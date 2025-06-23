import {
  SetAutopilot,
  SetEnvironment,
  SetFailures,
  SetIndicators,
  SetLevers,
  SetLights,
  SetRadiosNavigation,
  SetSystems,
} from "./set_simdata_schemas.js";
import { DataDescriptor, ValueTypes } from "./data_descriptor.js";
import { SimDataDescriptors } from "./data_descriptors.js";

/** Complete data model providing a `DataDescriptor` for all sim data in all categories. */
export type SimDataModel = typeof SimDataDescriptors;

/** Any valid data category in `SimDataModel`. */
export type DataCategory = keyof typeof SimDataDescriptors;

/** Any valid data name in any `DataCategory`. */
export type DataName =
  | keyof typeof SimDataDescriptors.position
  | keyof typeof SimDataDescriptors.attitude
  | keyof typeof SimDataDescriptors.radiosNavigation
  | keyof typeof SimDataDescriptors.lights
  | keyof typeof SimDataDescriptors.indicators
  | keyof typeof SimDataDescriptors.levers
  | keyof typeof SimDataDescriptors.autopilot
  | keyof typeof SimDataDescriptors.systems
  | keyof typeof SimDataDescriptors.failures
  | keyof typeof SimDataDescriptors.weightBalance
  | keyof typeof SimDataDescriptors.environment
  | keyof typeof SimDataDescriptors.initialization
  | keyof typeof SimDataDescriptors.simulation
  | keyof typeof SimDataDescriptors.freezes;

/** All valid data categories in `SimDataModel`. */
export const DataCategories = Object.keys(SimDataDescriptors) as DataCategory[];

/** All valid data names in all categories in `SimDataModel`. */
export const DataNames = Object.entries(SimDataDescriptors).flatMap(([_, categoryData]) =>
  Object.keys(categoryData)
) as DataName[];

/** Data model where all categories and fields are optional. */
export type PartialSimDataModel = {
  [K in keyof typeof SimDataDescriptors]?: {
    [D in keyof (typeof SimDataDescriptors)[K]]?: DataDescriptor;
  };
};

/** View of Category where key is any DataName and value is a `DataDescriptor`.
 * Used for operations on the data model where the type system could not guarantee
 * keys, since the category could not be determined at compile time. */
export type RelaxedDataModelCategory = Partial<Record<DataName, DataDescriptor>>;

/** View of data model where key is any `DataCategory` and value is a map from any
 * dataName to a `DataDescriptor`.
 * Used for operations on the data model where the type system could not guarantee
 * keys names, when the category could not be determined at compile time. */
export type RelaxedSimDataModel = Partial<Record<DataCategory, RelaxedDataModelCategory>>;

/** Partial data model where each "override" `DataDescriptor` can be partial. */
export type SimDataOverrideModel = {
  [K in keyof typeof SimDataDescriptors]?: {
    [D in keyof (typeof SimDataDescriptors)[K]]?: Partial<DataDescriptor>;
  };
};

/** View of Category where key can be any DataName and value is a partial `DataDescriptor`.
 * Used for operations on the data model where the type system could not guarantee keys,
 * since the category could not be determined at compile time. */
export type RelaxedOverrideDataModelCategory = Partial<Record<DataName, Partial<DataDescriptor>>>;

/** View of data model where key is any `DataCategory` and value is a map from any
 * dataName to a partial `DataDescriptor`.
 * Used for operations on the data model where the type system could not guarantee
 * keys names, when the category could not be determined at compile time. */
export type RelaxedSimDataOverrideDataModel = Partial<
  Record<DataCategory, RelaxedOverrideDataModelCategory>
>;

/** All Keys of SetSimData Categories' Fields */
export type SetSimDataName = NonNullable<
  | keyof SetRadiosNavigation
  | keyof SetLights
  | keyof SetIndicators
  | keyof SetLevers
  | keyof SetAutopilot
  | keyof SetSystems
  | keyof SetFailures
  | keyof SetEnvironment
>;

/** View of SetSimData where key is any SetSimDataName and value is a ValueTypes. */
export type RelaxedSetSimData = Partial<
  Record<DataCategory, Partial<Record<SetSimDataName, ValueTypes>>>
>;

/** View of SimData category where key is any DataName and value is a ValueTypes. */
export type RelaxedSimDataCategory = Partial<Record<DataName, ValueTypes>>;

/** View of SimData where key is any SimDataName and value is a ValueTypes. */
export type RelaxedSimData = Partial<Record<DataCategory, RelaxedSimDataCategory>>;
