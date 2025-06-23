import { TypedEntries } from '../util/typed_entries.js';
import { DataDescriptor } from './data_descriptor.js';
import {
  RelaxedDataModelCategory,
  RelaxedOverrideDataModelCategory,
  RelaxedSimDataModel,
  RelaxedSimDataOverrideDataModel,
  SimDataModel,
  SimDataOverrideModel,
} from './simdata_types.js';
import {
  PlatformDescriptor,
  PlatformSimDataModel,
  RelaxedPlatformDataModel,
} from '../profiles/platform_descriptor.js';
import { AircraftProfile } from '../profiles/aircraft_profile.js';

/** Extracts the sim data overrides from the platform overrides.
 * @param platformOverrides The platform overrides to extract sim data overrides from.
 * @returns The extracted sim data overrides.
 * */
export function ExtractSimDataOverrideModel<P extends PlatformDescriptor>(
  platformOverrides: PlatformSimDataModel<P>
): SimDataOverrideModel {
  const dataOverrides: RelaxedSimDataOverrideDataModel = {};
  for (const [category, categoryModel] of TypedEntries(
    platformOverrides as RelaxedPlatformDataModel<P>
  )) {
    if (!categoryModel) continue;
    let simCategoryOverrides = {} as RelaxedOverrideDataModelCategory;

    for (const [dataName, platformDescriptor] of TypedEntries(categoryModel!)) {
      if (!platformDescriptor) continue;
      const descriptor = platformDescriptor.descriptor;

      simCategoryOverrides[dataName] = descriptor;
    }

    if (Object.keys(simCategoryOverrides).length === 0) continue;
    dataOverrides[category] = simCategoryOverrides;
  }

  return dataOverrides as SimDataOverrideModel;
}

/** Merges the base descriptor with the override descriptor by using all properties
 * from both but giving preference to the override descriptor for properties in common.
 * @param baseDescriptor The base descriptor to apply overrides to.
 * @param overrideDescriptor The overrides to apply over the base descriptor.
 * @returns New descriptor object with overrides applied.
 * @remark Property values in `DataDescriptor` are references to their respective originals.
 * */
function MergeDataDescriptor(
  baseDescriptor: DataDescriptor,
  overrideDescriptor: Partial<DataDescriptor>
): DataDescriptor {
  return { ...baseDescriptor, ...overrideDescriptor };
}

/** This function generates an effective model by merging the base model with the aircraft profile overrides.
 * It iterates over the base model and applies the overrides from the aircraft profile if they exist.
 * If an override does not exist, the base model is used.
 * @param baseModel The base model to apply overrides to.
 * @param aircraftProfileOverrides The overrides to apply to the base model.
 * @returns New effective model with overrides applied.
 *          The property values in `DataDescriptor` are references.
 * @remarks This function does not mutate `baseModel` but may reuse `baseModel`'s descriptors.
 * */
export function ComputeEffectiveModel(
  baseModel: SimDataModel,
  aircraftProfileOverrides?: SimDataOverrideModel
): SimDataModel {
  const effectiveModel: RelaxedSimDataModel = {};
  // we "relax" the types here because typescript doesn't know which branch we go down in the loop
  // and we were getting "can't assign to never" errors on categoryModel[dataName]
  for (const [category, categoryModel] of TypedEntries(baseModel as RelaxedSimDataModel)) {
    let newCategoryModel = { ...categoryModel } as RelaxedDataModelCategory;

    const overrides = (aircraftProfileOverrides?.[category] ?? {}) as RelaxedDataModelCategory;
    for (const [dataName, baseDescriptor] of TypedEntries(categoryModel!)) {
      const overrideDescriptor = overrides[dataName];
      if (!baseDescriptor || !overrideDescriptor) continue;
      newCategoryModel[dataName] = MergeDataDescriptor(baseDescriptor, overrideDescriptor);
    }

    effectiveModel[category] = newCategoryModel;
  }

  // We know that the effectiveModel is a SimDataModel because we iterated over baseModel.
  return effectiveModel as SimDataModel;
}

/** This function generates an effective model by merging the base model with the aircraft profile overrides.
 * It also replaces flaps and speedbrakes' `description` using setpoints from the profile.
 * It iterates over the base model and applies the overrides from the aircraft profile if they exist.
 * If an override does not exist, the base model is used.
 * @param baseModel The base model to apply overrides to.
 * @param profile The aircraft profile to apply overrides from.
 * @returns New effective model with overrides and profile flaps/speedbrakes setpoints applied.
 *         The property values in `DataDescriptor` are references.
 * @remarks This function does not mutate `baseModel` but does reuse the `baseModel`'s descriptor
 *          properties (except for flaps and speedbrakes).
 * @see `ComputeEffectiveModel`,`ExtractSimDataOverrideModel`
 * */
export function AircraftProfileEffectiveModel(
  baseModel: SimDataModel,
  profile?: AircraftProfile
): SimDataModel {
  const aircraftProfileOverrides = profile?.xplane
    ? ExtractSimDataOverrideModel(profile.xplane)
    : undefined;
  const effectiveModel = ComputeEffectiveModel(baseModel, aircraftProfileOverrides);

  // if there are no setpoints, we can return the effective model as is
  if (!profile?.flapsSetpoints && !profile?.speedbrakesSetpoints) return effectiveModel;

  // Category is not mutable, so we need to start a new 'RelaxedDataModelCategory'
  let newLeversCategory = { ...effectiveModel.levers } as RelaxedDataModelCategory;

  // Now we just replace a few descriptors per the profile: flaps and speedbrakes
  if (profile?.flapsSetpoints && effectiveModel.levers.flapsHandlePercentDown) {
    const flapsSetpointsDescription = profile.flapsSetpoints
      .map((setpoint) => `${setpoint.percent}% for ${setpoint.name}`)
      .join(', ');
    newLeversCategory.flapsHandlePercentDown = {
      ...effectiveModel.levers.flapsHandlePercentDown,
      description: flapsSetpointsDescription,
    };
  }

  if (profile?.speedbrakesSetpoints && effectiveModel.levers.speedBrakesHandlePercentDeployed) {
    const speedbrakesSetpointsDescription = profile.speedbrakesSetpoints
      .map((setpoint) => `${setpoint.percent}% for ${setpoint.name}`)
      .join(', ');
    newLeversCategory.speedBrakesHandlePercentDeployed = {
      ...effectiveModel.levers.speedBrakesHandlePercentDeployed,
      description: speedbrakesSetpointsDescription,
    };
  }

  const profileEffectiveModel = {
    ...effectiveModel,
    levers: newLeversCategory as SimDataModel['levers'],
  };
  return profileEffectiveModel;
}
