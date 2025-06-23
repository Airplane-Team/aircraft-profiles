import { z } from 'zod';

import { DataDescriptorSchema } from '../simdata/data_descriptor.js';
import { SimDataDescriptors } from '../simdata/data_descriptors.js';
import { DataCategory, DataName } from '../simdata/simdata_types.js';

/** Schema describing how to read a value from sim platform (e.g. X-Plane 12)
 * into a DataDescriptor. */
export const PlatformDescriptorSchema = z.object({
  /** DataDescriptor for the dataref, overriding any default DataDescriptor
   * sharing the DataName. */
  descriptor: DataDescriptorSchema.partial().optional(),
});

/** Describes how to read a value from sim platform (e.g. X-Plane 12) into a DataDescriptor.
 * @see PlatformDescriptorSchema
 */
export type PlatformDescriptor = z.infer<typeof PlatformDescriptorSchema>;

/** Platform descriptors organized by DataCategory and DataName as per SimDataDescriptors. */
export type PlatformSimDataModel<P extends PlatformDescriptor> = {
  [K in keyof typeof SimDataDescriptors]?: {
    [D in keyof (typeof SimDataDescriptors)[K]]?: P;
  };
};

/** View of Category where key can be any DataName and value is a PlatformDescriptor.
 * See RelaxedDataModelCategory for more information. */
export type RelaxedPlatformModelCategory<P extends PlatformDescriptor> = Partial<
  Record<DataName, P>
>;

/** View of data model where key is any DataCategory and value is a map from any
 * dataName to a PlatformDescriptor.
 * See RelaxedSimDataModel for more information. */
export type RelaxedPlatformDataModel<P extends PlatformDescriptor> = Partial<
  Record<DataCategory, RelaxedPlatformModelCategory<P>>
>;
