import { z } from "zod";
import {
  AllComMapKeys,
  AllFailureMapKeys,
  SimDataDescriptors,
} from "../simdata/data_descriptors.js";
import { ValueType } from "../simdata/data_descriptor.js";
import { TypedEntries } from "../util/typed_entries.js";
import { AircraftProfile, AircraftProfileSchema } from "./aircraft_profile.js";
import { AircraftProfileEffectiveModel } from "../simdata/effective_simdata_model.js";
import { RelaxedDataModelCategory } from "../simdata/simdata_types.js";
import { RelaxedPlatformModelCategory } from "./platform_descriptor.js";
import { XplaneDescriptor } from "./xplane_platform_descriptor.js";
import { kDefaultMapIndexKeys } from "../simdata/effective_set_simdata_model.js";

/**
 * For certain map-type properties, the data is assembled from multiple individual datarefs
 * in special-case logic rather than read from a single array dataref. This function provides
 * the valid map keys for these properties so that aircraft profile validation can check them.
 * @param categoryName The category of the data descriptor.
 * @param dataName The name of the data descriptor.
 * @returns The allowed map keys, or undefined if it's not a special case.
 * @see `LabelKeyMap`
 * @see `XPlaneDataManager:handleSpecialCases`
 */
function GetSpecialCaseMapKeys(
  categoryName: string,
  dataName: string
): readonly string[] | undefined {
  if (categoryName === "failures") {
    switch (dataName) {
      case "isFailed":
      case "scheduledAtAltitudeFtAgl":
      case "scheduledAtAirspeedKias":
        return AllFailureMapKeys;
    }
  }
  if (categoryName === "radiosNavigation") {
    switch (dataName) {
      case "frequencyHz":
      case "standbyFrequencyHz":
      case "comShouldSwapFrequencies":
        return AllComMapKeys;
    }
  }
  return undefined;
}

/** Validates `mapKeys` in aircraft profile against base data descriptors.
 *
 * Primarily checks if any `arrayIndexNameMap` values not present in `mapKeys`,
 * otherwise the data wont be displayed.
 *
 * Also checks if `mapKeys` given for a non-map type, or if the `mapKeys` are restricted by special cases.
 *
 * @param profile The parsed aircraft profile to validate
 * @returns Array of validation issues found
 */
function ValidateMapKeysAgainstDescriptors(profile: AircraftProfile): z.ZodIssue[] {
  const warnings: z.ZodIssue[] = [];

  if (!profile.xplane) {
    return warnings;
  }

  const effectiveModel = AircraftProfileEffectiveModel(SimDataDescriptors, profile);

  const addWarning = (path: (string | number)[], message: string) => {
    warnings.push({ code: z.ZodIssueCode.custom, path, message, fatal: false });
  };

  // Walk the profile, check the map keys if a map type
  // Iterate through each category in the xplane profile
  for (const [categoryName, categoryData] of TypedEntries(profile.xplane)) {
    if (!categoryData) continue;
    const effectiveModelCategory = effectiveModel[categoryName] as RelaxedDataModelCategory;

    // Check each data field in the category
    const relaxedProfileCategoryData =
      categoryData as RelaxedPlatformModelCategory<XplaneDescriptor>;
    for (const [dataName, profileDescriptor] of TypedEntries(relaxedProfileCategoryData)) {
      // only relevant if mapKeys or arrayIndexNameMap present
      if (!profileDescriptor?.descriptor?.mapKeys && !profileDescriptor?.arrayIndexNameMap) {
        continue;
      }

      /** The effective descriptor from the aircraft profile's effective model.
       *
       * @remark This is guaranteed to be defined by the schema verification, completed first
       */
      const effectiveDescriptor = effectiveModelCategory[dataName]!;

      // Check if the base descriptor supports map types
      const isMapType =
        effectiveDescriptor.type === ValueType.NumberMap ||
        effectiveDescriptor.type === ValueType.BooleanMap ||
        effectiveDescriptor.type === ValueType.StringMap;

      if (!isMapType) {
        addWarning(
          ["xplane", String(categoryName), String(dataName), "descriptor", "mapKeys"],
          `Descriptor type '${effectiveDescriptor.type}' does not support mapKeys. Only NumberMap, BooleanMap, and StringMap types support mapKeys.`
        );
        continue;
      }

      // First check if there're any restricted map keys from special cases
      // If so, we need to verify profile `mapKeys` are in the `specialCaseMapKeys`
      const specialCaseMapKeys = GetSpecialCaseMapKeys(String(categoryName), String(dataName));
      if (specialCaseMapKeys) {
        const profileMapKeys = Object.values(profileDescriptor.descriptor?.mapKeys ?? []);
        const unmatched = profileMapKeys.filter(k => !specialCaseMapKeys.includes(k));
        if (unmatched.length > 0) {
          addWarning(
            ["xplane", String(categoryName), String(dataName), "descriptor", "mapKeys"],
            `'mapKeys' [${unmatched.join(", ")}] not found in special mapKeys for '${String(
              dataName
            )}': [${specialCaseMapKeys.join(", ")}]`
          );
        }
        continue;
      }

      // Check consistency between effective model's `mapKeys` and profile's `arrayIndexNameMap`:
      // Verify all mapped keys from profile's `arrayIndexNameMap` are in descriptor's effective `mapKeys`.
      /** Keys in the effective model's `mapKeys` (order to display to shirley). */
      const effectiveMapKeys = effectiveDescriptor.mapKeys ?? kDefaultMapIndexKeys;
      /** Keys in the profile's `arrayIndexNameMap` (from xplane data array to `mapKey`). */
      const profileArrayIndexNameMap = profileDescriptor.arrayIndexNameMap;

      if (profileArrayIndexNameMap) {
        const profileMapKeys = Object.values(profileArrayIndexNameMap);
        const unmatched = profileMapKeys.filter(k => !effectiveMapKeys.includes(k));
        if (unmatched.length > 0) {
          addWarning(
            ["xplane", String(categoryName), String(dataName), "arrayIndexNameMap"],
            `'arrayIndexNameMap' [${unmatched.join(
              ", "
            )}] not found in model's mapKeys: [${effectiveMapKeys.join(", ")}]`
          );
        }
      }
    }
  }

  return warnings;
}

export function ValidateAircraftProfile(profileJson: any): {
  profile?: AircraftProfile;
  warnings?: z.ZodIssue[];
  errors?: z.ZodIssue[];
} {
  const results = AircraftProfileSchema.safeParse(profileJson);
  if (!results.success) {
    return { errors: results.error.issues };
  }
  const profile = results.data;

  // check for any `mapKeys` checks available as warnings
  const mapKeyWarnings = ValidateMapKeysAgainstDescriptors(profile);
  if (mapKeyWarnings.length > 0) {
    return {
      profile,
      warnings: mapKeyWarnings,
    };
  }

  return { profile };
}
