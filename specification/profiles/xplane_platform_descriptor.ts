import { z } from 'zod';

import { PlatformDescriptorSchema, PlatformSimDataModel } from './platform_descriptor.js';
import { XPDataref } from './xplane_datarefs.js';
import { XPCommandRef } from './xplane_commands.js';
import { SimDataDescriptors } from '../simdata/data_descriptors.js';

/** Schema describing properties needed to convert from X-Plane to Shirley `SimData`.
 * Including any overrides for the Shirley DataDescriptor of the same path.
 * @see PlatformDescriptorSchema */
export const XplaneDescriptorSchema = PlatformDescriptorSchema.extend({
  /** The dataref name in X-Plane. Usually only unset if you're disabling the field, have a custom
   * special case handler (e.g. failures or radios), or have a write-only command.
   *
   * @see command - When `command` is also set, the dataref should be the "read" dataref, and the
   *                command is used to set/toggle the dataref.
   * @remark This supports anything that could be a dataref e.g. when received from the client in a
   *         custom profile.
   * @see XplaneDescriptor - overrides this to expect `XPDataref` for local type safety.
   * */
  dataref: z.string().min(1).optional(),

  /** A command used for actuating the dataref.
   * @see dataref which includes details on command usage.
   */
  command: z
    .object({
      /** The command ref to be activated.
       * @remark This supports anything that could be a command e.g. when received from the client
       *         in a custom profile.
       * @see XplaneDescriptor - overrides this to expect `XPCommandRef` for local type safety.
       */
      ref: z.string().min(1),
      /** Optional length of time in seconds to hold command when activating.
       * @remark If not set, the command is activated instantaneously.
       * @default 0 (instantaneous)
       */
      durationS: z.number().optional(),
    })
    .optional(),

  /** The multiplication ratio to convert the dataref value to the quantity Shirley sees. */
  ratio: z.number().optional(),

  /** If descriptor`type` (`ValueType`) is `(Number|Boolean|String)Map`, this represents a map
   * from the index inside of the dataref's array to each `descriptor.mapKeys`.
   *
   * E.g. `{ '0': 'key0', '1': 'key1', ... }`
   *
   * @remark Numeric keys should still be strings due to Javascript's object key type.
   * @remark If not defined for map, the index is used as the key per `kDefaultMapIndexKeys`.
   * @see DataDescriptorSchema:mapKeys
   * */
  arrayIndexNameMap: z.record(z.string().transform(Number), z.string()).optional(),

  /** Allows Shirley string Enum Values to be compatible with X-Plane's integer enum values.
   *
   * If descriptor `type` is `String` or `StringMap`, and `descriptor.enumValues` is defined,
   * this property maps each `enumValue` to a numeric value & vice versa.
   *
   * E.g. `{'DryRunway': 0, 'SlightlyWetRunway': 1, ...}`
   *
   * @remark If not defined for map, the enum value is used as the key per `kDefaultMapIndexKeys`. */
  enumValueMap: z.record(z.string(), z.number()).optional(),
}).strict();

/** Describes properties needed to convert from X-Plane to Shirley `SimData`.
 * @remark Overrides the `dataref` and `command` properties to keep the specific
 *        `XPDataref` and `XPCommandRef` types.
 * @see XplaneDescriptorSchema
 */
export type XplaneDescriptor = Omit<
  z.infer<typeof XplaneDescriptorSchema>,
  'dataref' | 'command'
> & { dataref?: XPDataref; command?: { ref: XPCommandRef; durationS?: number } };

/** SimDataDescriptor overrides for X-Plane and PlatformDescriptor used by X-Plane client. */
export type XPlanePlatformDescriptors = PlatformSimDataModel<XplaneDescriptor>;

/** Zod schema for XPlanePlatformDescriptors. Exists at runtime as a schema.
 * @remark Not possible to infer the type of this schema, use XPlanePlatformDescriptors instead.
 * @remark strict & partial - no extra DataNames or DataCategories, all are optional. */
export const XPlanePlatformDescriptorsSchema = z
  .object(
    Object.fromEntries(
      // Iterate over SimDataDescriptors to get each category and its data
      // This is the DataCategory name (e.g., 'position')
      // Each category has a map of DataNames to DataDescriptors
      Object.entries(SimDataDescriptors).map(([categoryKey, dataNamesObject]) => [
        categoryKey,
        z
          .object(
            // For each category, create an object schema for its DataNames
            Object.fromEntries(
              // Iterate over the keys (DataNames) of the current category's object
              // Each DataName maps to an optional XplaneDescriptor
              Object.keys(dataNamesObject).map(dataNameKey => [
                dataNameKey,
                XplaneDescriptorSchema.optional(),
              ])
            )
          )
          .strict(),
      ])
    )
  )
  .partial()
  .strict();
