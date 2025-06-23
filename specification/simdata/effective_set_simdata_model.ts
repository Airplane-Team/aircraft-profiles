import { z } from 'zod';

import { TypedEntries } from '../util/typed_entries.js';
import { SimPlatform, ValueType, Visibility, Writability } from './data_descriptor.js';
import {
  PartialSimDataModel,
  RelaxedSetSimData,
  RelaxedSimData,
  RelaxedSimDataModel,
} from './simdata_types.js';
import { SetSimData, SetSimDataSchema } from './set_simdata_schemas.js';
import { SimData } from './simdata_schemas.js';

/** Default map keys for number, string, and boolean maps. */
export const kDefaultMapIndexKeys = ['0'] as const;

/** Merges two SetSimData into a new object by overwriting the baseSetpoints with the newSetpoints.
 * @param baseSetpoints The base setpoints to merge atop of.
 * @param newSetpoints The new setpoints to merge atop the base.
 * @returns A new SetSimData object with the merged setpoints.
 * @remarks This function does not mutate the baseSetpoints.
 * @remarks Does not merge any category field values to set, only overwrites them. */
export function MergeSetSimData(baseSetpoints: SetSimData, newSetpoints: SetSimData): SetSimData {
  // Duplicate all categories from the base setpoints into new object to ensure no mutation.
  const mergedSetpoints: SetSimData = Object.fromEntries(
    TypedEntries(baseSetpoints).map(([key, category]) => [key, { ...category }])
  );
  for (const [category, categoryData] of TypedEntries(newSetpoints)) {
    if (!categoryData) continue;
    if (!mergedSetpoints[category]) {
      mergedSetpoints[category] = categoryData;
      continue;
    }
    for (const [field, data] of TypedEntries(categoryData)) {
      if (!data) continue;
      mergedSetpoints[category]![field] = data;
    }
  }
  return mergedSetpoints;
}

/** Filters-out the `DataDescriptor`s and categories that can never be set: i.e. `WritableByPlatform`
 *  set to `Writability.Never`.
 * @see `Writability`
 * @param dataModel The full SimDataModel to filter.
 * @returns A new `PartialSimDataModel` with only the settable fields. Empty categories are removed. */
export function FilterSettableSimDataModel(dataModel: PartialSimDataModel): PartialSimDataModel {
  let output: RelaxedSimDataModel = {};
  for (const [category, categoryData] of TypedEntries(dataModel as RelaxedSimDataModel)) {
    if (!categoryData) continue;
    output[category] = {};
    for (const [field, descriptor] of TypedEntries(categoryData)) {
      // doesn't support any platform nor overrides
      if (!descriptor || !descriptor.writableByPlatform) continue;

      // doesn't support the current platform
      if (Object.values(descriptor.writableByPlatform).every(w => w === Writability.Never)) {
        continue;
      }

      output[category]![field] = descriptor;
    }
    if (Object.keys(output[category]!).length === 0) {
      delete output[category];
    }
  }
  return output;
}

/** Filters-in the `DataDescriptor`s and categories that Shirley can set for the given platform,
 * looking for `WritableByPlatform` set to `Writability.AfterRead` or `Writability.Always`.
 * @see `Writability`
 * @param dataModel The full SimDataModel to filter.
 * @param platform The platform to filter for.
 * @returns A new `PartialSimDataModel` with only the settable fields. Empty categories are removed. */
export function FilterPlatformSettableSimDataModel(
  dataModel: PartialSimDataModel,
  platform?: SimPlatform
): PartialSimDataModel {
  if (!platform) return {};

  let output: RelaxedSimDataModel = {};
  for (const [category, categoryData] of TypedEntries(dataModel as RelaxedSimDataModel)) {
    if (!categoryData) continue;
    output[category] = {};
    for (const [field, descriptor] of TypedEntries(categoryData)) {
      // doesn't support any platform nor overrides
      if (!descriptor || !descriptor.writableByPlatform) continue;

      // doesn't support the current platform
      if (
        descriptor.writableByPlatform[platform] !== Writability.Always &&
        descriptor.writableByPlatform[platform] !== Writability.AfterRead
      ) {
        continue;
      }

      output[category]![field] = descriptor;
    }
    if (Object.keys(output[category]!).length === 0) {
      delete output[category];
    }
  }
  return output;
}

/** Filters-out `Writability.AfterRead` `DataDescriptor`s from the `SimDataModel` that haven't been
 *  read yet per `data`, or whose `Visibility` is set to `Never`.
 * @param dataModel The full SimDataModel to filter.
 * @param platform The platform to check for.
 * @param data The last received SimData to check fields against.
 * @returns A new SimDataModel with only the settable fields. Empty categories are removed.
 * @remark New object, same `DataDescriptor`s.
 * */
export function FilterAfterReadSettableSimDataModel(
  dataModel: PartialSimDataModel,
  platform: SimPlatform,
  data?: SimData
): PartialSimDataModel {
  const relaxedSimData = (data ?? {}) as RelaxedSimData;
  let output: RelaxedSimDataModel = {};
  for (const [category, categoryData] of TypedEntries(dataModel as RelaxedSimDataModel)) {
    if (!categoryData) continue;
    output[category] = {};
    for (const [field, descriptor] of TypedEntries(categoryData)) {
      // doesn't support any platform nor overrides
      if (!descriptor || !descriptor.writableByPlatform) continue;

      // If platform is `Writability.AfterRead` but `Visibility` is set `Never`
      if (
        descriptor.writableByPlatform[platform] === Writability.AfterRead &&
        descriptor.visibility === Visibility.Never
      ) {
        continue;
      }

      const fieldDataValue = relaxedSimData[category]?.[field];
      // AfterRead for platform and field not read yet
      if (
        descriptor.writableByPlatform[platform] === Writability.AfterRead &&
        fieldDataValue === undefined
      ) {
        continue;
      }

      output[category]![field] = descriptor;
    }
    if (Object.keys(output[category]!).length === 0) {
      delete output[category];
    }
  }
  return output;
}

/** Zod refinement to check all `mapKeys` provided to the schema are in the effective model.
 * @param schema The schema to refine.
 * @param effectiveSetModel The effective model to check against.
 * @returns The refined schema. */
export function MapKeyRefinedSetSimDataSchema(
  schema: typeof SetSimDataSchema,
  effectiveSetModel: PartialSimDataModel
): z.ZodEffects<typeof SetSimDataSchema> {
  const relaxedModel = effectiveSetModel as RelaxedSimDataModel;
  return schema.superRefine((data, context) => {
    for (const [category, categoryData] of TypedEntries(data as RelaxedSetSimData)) {
      if (!categoryData) continue;
      for (const [field, data] of TypedEntries(categoryData)) {
        if (!data) continue;
        // Check if field is in the effective model to verify it's currently settable.
        // A field will always be in a particular category if it is settable.
        const setModelDescriptor = relaxedModel[category]?.[field];
        if (!setModelDescriptor) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: [category, field],
            message: `Not currently settable`,
          });
          continue;
        }

        // Check if mapKeys are in the effective model.
        if (
          setModelDescriptor.type !== ValueType.NumberMap &&
          setModelDescriptor.type !== ValueType.StringMap &&
          setModelDescriptor.type !== ValueType.BooleanMap
        ) {
          continue;
        }
        const mapKeys = new Set(setModelDescriptor.mapKeys ?? kDefaultMapIndexKeys);
        for (const key of Object.keys(data)) {
          if (!mapKeys.has(key)) {
            context.addIssue({
              code: z.ZodIssueCode.custom,
              // NOTE: Zod errors don't include the final key in the path, but I think it makes sense
              //       vs parsing from message.
              path: [category, field, key],
              message: `Not a valid record key`,
            });
          }
        }
      }
    }
  });
}
