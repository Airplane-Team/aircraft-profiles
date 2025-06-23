import { SimPlatform, Visibility, Writability } from '../simdata/data_descriptor.js';
import { RelaxedSimDataModel, SimDataModel } from '../simdata/simdata_types.js';
import { TypedEntries } from '../util/typed_entries.js';
import {
  PlatformDescriptor,
  PlatformSimDataModel,
  RelaxedPlatformDataModel,
  RelaxedPlatformModelCategory,
} from './platform_descriptor.js';

/**
 * Combines base platform descriptors with aircraft profile descriptors to create a
 * unified mapping including datarefs and conversion ratios.
 *
 * @param baseDescriptors The base platform descriptors.
 * @param aircraftProfileDescriptors The aircraft profile descriptors.
 */
export function ComputeEffectivePlatformDescriptors<P extends PlatformDescriptor>(
  baseDescriptors: PlatformSimDataModel<P>,
  aircraftProfileDescriptors: PlatformSimDataModel<P> | undefined
): PlatformSimDataModel<P> {
  if (!aircraftProfileDescriptors) return baseDescriptors;
  const effectiveDescriptors = {} as RelaxedPlatformDataModel<P>;

  for (const [category, categoryModel] of TypedEntries(baseDescriptors)) {
    if (!categoryModel) continue;
    let newCategoryModel = { ...categoryModel } as RelaxedPlatformModelCategory<P>;

    const overrides = (aircraftProfileDescriptors[category] ??
      {}) as RelaxedPlatformModelCategory<P>;
    for (const [dataName, platformDescriptor] of TypedEntries(
      categoryModel as RelaxedPlatformModelCategory<P>
    )) {
      const overrideDescriptor = overrides[dataName];
      if (!platformDescriptor && !overrideDescriptor) continue;
      const combinedDescriptor = { ...platformDescriptor, ...overrideDescriptor } as P;
      newCategoryModel[dataName] = combinedDescriptor;
    }

    if (Object.keys(newCategoryModel).length === 0) continue;
    effectiveDescriptors[category] = newCategoryModel;
  }

  return effectiveDescriptors;
}

/** Filters-in SimDataDescriptors that are active: readable or settable
 * on the current platform.
 *
 * @param platformModel The platform descriptors to filter.
 * @param dataEffectiveModel The effective sim data model descriptor model.
 */
export function FilterActivePlatformDescriptors<P extends PlatformDescriptor>(
  platformModel: PlatformSimDataModel<P>,
  dataEffectiveModel: SimDataModel
): PlatformSimDataModel<P> {
  const platform = SimPlatform.Xplane12; // TODO: Parameterize this for MSFS

  const relaxedPlatformModel = platformModel as RelaxedPlatformDataModel<P>;
  const activePlatformDescriptors = {} as RelaxedPlatformDataModel<P>;

  const relaxedSimDataModel = dataEffectiveModel as RelaxedSimDataModel;
  for (const [category, categoryModel] of TypedEntries(relaxedSimDataModel)) {
    if (!categoryModel) continue;
    let newCategoryModel = {} as RelaxedPlatformModelCategory<P>;

    for (const [dataName, dataDescriptor] of TypedEntries(categoryModel)) {
      if (!dataDescriptor) continue;
      if (
        dataDescriptor.visibility === Visibility.Never &&
        dataDescriptor.writableByPlatform?.[platform] === Writability.Never
      ) {
        continue;
      }
      newCategoryModel[dataName] = relaxedPlatformModel[category]?.[dataName];
    }

    if (Object.keys(newCategoryModel).length === 0) continue;
    activePlatformDescriptors[category] = newCategoryModel;
  }

  return activePlatformDescriptors;
}
