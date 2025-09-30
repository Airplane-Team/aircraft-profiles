import { AircraftProfile } from "./aircraft_profile.js";
import { Visibility } from "../simdata/data_descriptor.js";
import { FailureMapKey } from "../simdata/data_descriptors.js";

/** Failures for pitot-static systems */
export const kPitotStaticFailureMapKeys: FailureMapKey[] = ["PitotBlockage", "StaticBlockage"];

/** Failures for GPS systems */
export const kIfrFailureMapKeys: FailureMapKey[] = [
  "Gps1Failure",
  "Navigation1Failure",
  "Navigation2Failure",
];

/** Failures for electrical systems */
export const kElectricalFailureMapKeys: FailureMapKey[] = [
  "Bus1Failure",
  "Battery1Failure",
  "Generator1Failure",
];

/** Standard failures for all IFR-equipped aircraft */
export const kStandardAircraftFailureMapKeys: FailureMapKey[] = [
  ...kPitotStaticFailureMapKeys,
  ...kIfrFailureMapKeys,
  ...kElectricalFailureMapKeys,
];

/** Failures appropriate for IFR-equipped single-engine aircraft */
export const kSingleEngineFailureMapKeys: FailureMapKey[] = [
  ...kStandardAircraftFailureMapKeys,
  "EngineSeize",
];

/** Failures appropriate for IFR-equipped twin-engine aircraft */
export const kTwinEngineFailureMapKeys: FailureMapKey[] = [
  ...kStandardAircraftFailureMapKeys,
  "LeftEngineSeize",
  "RightEngineSeize",
];

/** Failures appropriate for single-engine aircraft */
const SingleEngineFailures = {
  isFailed: { descriptor: { mapKeys: kSingleEngineFailureMapKeys } },
  scheduledAtAirspeedKias: { descriptor: { mapKeys: kSingleEngineFailureMapKeys } },
  scheduledAtAltitudeFtAgl: { descriptor: { mapKeys: kSingleEngineFailureMapKeys } },
};

/** Failures appropriate for twin-engine aircraft */
const TwinEngineFailures = {
  isFailed: { descriptor: { mapKeys: kTwinEngineFailureMapKeys } },
  scheduledAtAirspeedKias: { descriptor: { mapKeys: kTwinEngineFailureMapKeys } },
  scheduledAtAltitudeFtAgl: { descriptor: { mapKeys: kTwinEngineFailureMapKeys } },
};

/** Generic profile for Single Fixed Piston aircraft */
export const SingleFixedPistonProfile: AircraftProfile = {
  aircraftCode: "genericSingleFixedPiston",
  aircraftName: "Other Single Engine Fixed-Gear Piston Aircraft",
  profileName: "Generic Single Engine Piston with Fixed Gear",
  additionalDetails: ["Single-engine piston aircraft", "fixed landing gear"],
  xplane: {
    levers: {
      mixtureLeverPercentRich: { descriptor: { visibility: Visibility.Always } },
      landingGearHandlePercentDown: { descriptor: { visibility: Visibility.Never } },
    },
    indicators: {
      propellerRpm: { descriptor: { visibility: Visibility.Always } },
      manifoldPressureInchesMercury: { descriptor: { visibility: Visibility.Always } },
    },
    failures: SingleEngineFailures,
  },
};

export const kAutoPilotDisabledOptions = {
  isAutopilotEngaged: { descriptor: { visibility: Visibility.Never } },
  isFlightDirectorEngaged: { descriptor: { visibility: Visibility.Never } },
  isHeadingSelectEnabled: { descriptor: { visibility: Visibility.Never } },
  altitudeMode: { descriptor: { visibility: Visibility.Never } },
  magneticHeadingBugDeg: { descriptor: { visibility: Visibility.Never } },
  altitudeBugFt: { descriptor: { visibility: Visibility.Never } },
  targetVerticalSpeedUpFpm: { descriptor: { visibility: Visibility.Never } },
};

/** Generic profile for Simple (minimally electric) Carbureted Single Engine Piston aircraft */
export const SimpleCarburetedSingleFixedPistonProfile: AircraftProfile = {
  aircraftCode: "genericSingleFixedPiston",
  aircraftName: "Other Single Engine Fixed-Gear Piston Aircraft",
  profileName: "Generic Single Engine Piston with Fixed Gear",
  additionalDetails: [
    "Single-engine piston aircraft",
    "fixed landing gear",
    "direct drive fixed pitch propeller",
    "single radio",
  ],
  xplane: {
    radiosNavigation: {
      frequencyHz: { descriptor: { mapKeys: ["com1", "nav1"] } },
      standbyFrequencyHz: { descriptor: { mapKeys: ["com1", "nav1"] } },
      comShouldSwapFrequencies: { descriptor: { mapKeys: ["com1", "nav1"] } },
    },
    levers: {
      mixtureLeverPercentRich: { descriptor: { visibility: Visibility.Always } },
      landingGearHandlePercentDown: { descriptor: { visibility: Visibility.Never } },
      carburetorHeatLeverPercentHot: { descriptor: { visibility: Visibility.Always } },
    },
    indicators: {
      engineRpm: { descriptor: { visibility: Visibility.Always } },
      manifoldPressureInchesMercury: { descriptor: { visibility: Visibility.Never } },
      yawStringRightSideslipDeg: { descriptor: { visibility: Visibility.Always } },
    },
    failures: SingleEngineFailures,
    autopilot: kAutoPilotDisabledOptions,
  },
};

/** Generic profile for Single Complex Piston aircraft */
export const SingleComplexPistonProfile: AircraftProfile = {
  aircraftCode: "genericSingleComplexPiston",
  aircraftName: "Other Single Engine Complex Piston Aircraft",
  profileName: "Generic Complex Single Engine Piston",
  additionalDetails: [
    "Single-engine piston aircraft",
    "retractable landing gear",
    "variable-pitch propeller",
  ],
  xplane: {
    levers: {
      mixtureLeverPercentRich: { descriptor: { visibility: Visibility.Always } },
      propellerLeverPercentCoarse: {
        descriptor: {
          visibility: Visibility.Always,
          description: "handle position converted from target RPM at full power",
        },
      },
    },
    indicators: {
      propellerRpm: { descriptor: { visibility: Visibility.Always } },
      manifoldPressureInchesMercury: { descriptor: { visibility: Visibility.Always } },
    },
    failures: SingleEngineFailures,
  },
};

/** Generic profile for Single Complex Turbine aircraft */
export const SingleComplexTurbineProfile: AircraftProfile = {
  aircraftCode: "genericSingleComplexTurbine",
  aircraftName: "Other Single Turbine Complex Aircraft",
  profileName: "Generic Complex Single Engine Turbine",
  additionalDetails: [
    "Single-engine turboprop aircraft",
    "retractable landing gear",
    "variable-pitch propeller",
  ],
  xplane: {
    levers: {
      conditionLeverPercentHigh: { descriptor: { visibility: Visibility.Always } },
      propellerLeverPercentCoarse: {
        descriptor: {
          visibility: Visibility.Always,
          description: "handle position converted from target RPM at full power",
        },
      },
    },
    indicators: {
      engineN1Percent: { descriptor: { visibility: Visibility.Always } },
      propellerRpm: { descriptor: { visibility: Visibility.Always } },
      engineTorqueFtLb: { descriptor: { visibility: Visibility.Always } },
      engineIttDegC: { descriptor: { visibility: Visibility.Always } },
    },
    failures: SingleEngineFailures,
  },
};

/** Generic profile for Multi-Engine Turbine aircraft */
export const TwinTurbineProfile: AircraftProfile = {
  aircraftCode: "genericTwinTurbine",
  aircraftName: "Other Twin Turbine Aircraft",
  profileName: "Generic Multiengine Turbine",
  additionalDetails: [
    "Twin-engine turboprop aircraft",
    "retractable landing gear",
    "variable-pitch propellers",
  ],
  xplane: {
    levers: {
      throttlePercentOpen: {
        arrayIndexNameMap: {
          0: "LeftEngine",
          1: "RightEngine",
        },
        descriptor: {
          description: "0 to 100% forward; 0 to -100% is beta; -100 to -200% is reverse",
          mapKeys: ["LeftEngine", "RightEngine"],
        },
      },
      conditionLeverPercentHigh: {
        arrayIndexNameMap: {
          0: "LeftEngine",
          1: "RightEngine",
        },
        descriptor: {
          visibility: Visibility.Always,
          description: "position 0-100%",
          mapKeys: ["LeftEngine", "RightEngine"],
        },
      },
      propellerLeverPercentCoarse: {
        arrayIndexNameMap: {
          0: "LeftProp",
          1: "RightProp",
        },
        descriptor: {
          visibility: Visibility.Always,
          description: "handle position converted from target RPM at full power",
          mapKeys: ["LeftProp", "RightProp"],
        },
      },
    },
    indicators: {
      engineN1Percent: {
        arrayIndexNameMap: {
          0: "LeftEngine",
          1: "RightEngine",
        },
        descriptor: {
          visibility: Visibility.Always,
          mapKeys: ["LeftEngine", "RightEngine"],
        },
      },
      propellerRpm: {
        arrayIndexNameMap: {
          0: "LeftProp",
          1: "RightProp",
        },
        descriptor: {
          visibility: Visibility.Always,
          mapKeys: ["LeftProp", "RightProp"],
        },
      },
      engineTorqueFtLb: {
        arrayIndexNameMap: {
          0: "LeftEngine",
          1: "RightEngine",
        },
        descriptor: {
          visibility: Visibility.Always,
          mapKeys: ["LeftEngine", "RightEngine"],
        },
      },
      engineIttDegC: {
        arrayIndexNameMap: {
          0: "LeftEngine",
          1: "RightEngine",
        },
        descriptor: {
          visibility: Visibility.Always,
          mapKeys: ["LeftEngine", "RightEngine"],
        },
      },
    },
    failures: TwinEngineFailures,
  },
};

/** Generic profile for Multiengine Piston aircraft */
export const TwinPistonProfile: AircraftProfile = {
  aircraftCode: "genericTwinPiston",
  aircraftName: "Other Twin Piston Aircraft",
  profileName: "Generic Multiengine Piston",
  additionalDetails: [
    "Twin-engine piston aircraft",
    "retractable landing gear",
    "variable-pitch propellers",
  ],
  xplane: {
    levers: {
      throttlePercentOpen: {
        arrayIndexNameMap: {
          0: "LeftEngine",
          1: "RightEngine",
        },
        descriptor: {
          mapKeys: ["LeftEngine", "RightEngine"],
        },
      },
      mixtureLeverPercentRich: {
        arrayIndexNameMap: {
          0: "LeftEngine",
          1: "RightEngine",
        },
        descriptor: {
          visibility: Visibility.Always,
          mapKeys: ["LeftEngine", "RightEngine"],
        },
      },
      propellerLeverPercentCoarse: {
        arrayIndexNameMap: {
          0: "LeftEngine",
          1: "RightEngine",
        },
        descriptor: {
          visibility: Visibility.Always,
          description: "handle position converted from target RPM at full power",
          mapKeys: ["LeftEngine", "RightEngine"],
        },
      },
    },
    indicators: {
      propellerRpm: {
        arrayIndexNameMap: {
          0: "LeftProp",
          1: "RightProp",
        },
        descriptor: {
          visibility: Visibility.Always,
          mapKeys: ["LeftProp", "RightProp"],
        },
      },
    },
    failures: TwinEngineFailures,
  },
};

/** Generic profile for Single-Engine Jet aircraft */
export const SingleJetProfile: AircraftProfile = {
  aircraftCode: "genericSingleJet",
  aircraftName: "Other Single Jet Aircraft",
  profileName: "Generic Single-Engine Jet",
  additionalDetails: ["Single-engine jet aircraft", "retractable landing gear"],
  xplane: {
    levers: {
      throttlePercentOpen: {
        descriptor: {
          description: "0 to 100% forward; 0 to -100% is beta; -100 to -200% is reverse",
        },
      },
    },
    indicators: {
      engineN1Percent: { descriptor: { visibility: Visibility.Always } },
      exhaustGasDegC: { descriptor: { visibility: Visibility.Always } },
    },
    failures: SingleEngineFailures,
  },
};

/** Generic profile for Twin-Engine Jet aircraft */
export const TwinJetProfile: AircraftProfile = {
  aircraftCode: "genericTwinJet",
  aircraftName: "Other Twin Jet Aircraft",
  profileName: "Generic Twin-Engine Jet",
  additionalDetails: ["Twin-engine jet aircraft", "retractable landing gear"],
  speedbrakesSetpoints: [
    { name: "Retracted", percent: 0 },
    { name: "Half", percent: 50 },
    { name: "Full", percent: 100 },
  ],
  xplane: {
    levers: {
      throttlePercentOpen: {
        arrayIndexNameMap: {
          0: "LeftEngine",
          1: "RightEngine",
        },
        descriptor: {
          description: "0 to 100% forward; 0 to -100% is beta; -100 to -200% is reverse",
          mapKeys: ["LeftEngine", "RightEngine"],
        },
      },
      speedBrakesHandlePercentDeployed: { descriptor: { visibility: Visibility.Always } },
    },
    indicators: {
      engineN1Percent: {
        arrayIndexNameMap: {
          0: "LeftEngine",
          1: "RightEngine",
        },
        descriptor: {
          visibility: Visibility.Always,
          mapKeys: ["LeftEngine", "RightEngine"],
        },
      },
      exhaustGasDegC: {
        arrayIndexNameMap: {
          0: "LeftEngine",
          1: "RightEngine",
        },
        descriptor: {
          visibility: Visibility.Always,
          mapKeys: ["LeftEngine", "RightEngine"],
        },
      },
    },
    failures: TwinEngineFailures,
  },
};

/** Generic profile for Helicopters */
export const SinglePistonHelicopterProfile: AircraftProfile = {
  aircraftCode: "genericSinglePistonHelicopter",
  aircraftName: "Other Single Engine Piston Helicopter",
  profileName: "Generic Single Engine Piston Helicopter",
  additionalDetails: ["throttle governor", "piston engine"],
  xplane: {
    levers: {
      throttlePercentOpen: { descriptor: { visibility: Visibility.Always } },
      collectivePercentUp: { descriptor: { visibility: Visibility.Always } },
      flapsHandlePercentDown: { descriptor: { visibility: Visibility.Never } },
      landingGearHandlePercentDown: { descriptor: { visibility: Visibility.Never } },
    },
    indicators: {
      rotorRpm: {
        descriptor: {
          visibility: Visibility.Always,
          description: "whereas pilot sees percent of max",
        },
      },
      engineRpm: {
        descriptor: {
          visibility: Visibility.Always,
          description: "whereas pilot sees percent of max",
        },
      },
      manifoldPressureInchesMercury: { descriptor: { visibility: Visibility.Always } },
      lowRotorRPMWarningOn: { descriptor: { visibility: Visibility.Always } },
      stallWarningOn: { descriptor: { visibility: Visibility.Never } },
    },
    systems: {
      governorSwitchOn: { descriptor: { visibility: Visibility.Always } },
      parkingBrakeOn: { descriptor: { visibility: Visibility.Never } },
    },
    failures: SingleEngineFailures,
    autopilot: kAutoPilotDisabledOptions,
  },
};

/** Generic profile for Twin Turbine Helicopters */
export const SingleTurbineHelicopterProfile: AircraftProfile = {
  aircraftCode: "genericSingleTurbineHelicopter",
  aircraftName: "Other Single Turbine Helicopter",
  profileName: "Generic Single Turbine Engine Helicopter",
  additionalDetails: ["Throttle governor"],
  xplane: {
    levers: {
      collectivePercentUp: { descriptor: { visibility: Visibility.Always } },
      flapsHandlePercentDown: { descriptor: { visibility: Visibility.Never } },
      landingGearHandlePercentDown: { descriptor: { visibility: Visibility.Never } },
    },
    indicators: {
      rotorRpm: {
        descriptor: {
          description: "whereas pilot sees percent of max",
          visibility: Visibility.Always,
        },
      },
      engineN1Percent: { descriptor: { visibility: Visibility.Always } },
      engineTorqueFtLb: { descriptor: { visibility: Visibility.Always } },
      engineIttDegC: { descriptor: { visibility: Visibility.Always } },
      lowRotorRPMWarningOn: { descriptor: { visibility: Visibility.Always } },
      stallWarningOn: { descriptor: { visibility: Visibility.Never } },
    },
    failures: SingleEngineFailures,
  },
};

/** Generic profile for Twin Turbine Helicopters */
export const TwinTurbineHelicopterProfile: AircraftProfile = {
  aircraftCode: "genericTwinTurbineHelicopter",
  aircraftName: "Other Twin Turbine Helicopter",
  profileName: "Generic Twin Turbine Helicopter",
  additionalDetails: ["Throttle governors"],
  xplane: {
    levers: {
      collectivePercentUp: { descriptor: { visibility: Visibility.Always } },
      flapsHandlePercentDown: { descriptor: { visibility: Visibility.Never } },
    },
    indicators: {
      rotorRpm: {
        descriptor: {
          description: "whereas pilot sees percent of max",
          visibility: Visibility.Always,
        },
      },
      engineN1Percent: {
        arrayIndexNameMap: {
          0: "LeftEngine",
          1: "RightEngine",
        },
        descriptor: {
          visibility: Visibility.Always,
          mapKeys: ["LeftEngine", "RightEngine"],
        },
      },
      engineTorqueFtLb: {
        arrayIndexNameMap: {
          0: "LeftEngine",
          1: "RightEngine",
        },
        descriptor: {
          visibility: Visibility.Always,
          mapKeys: ["LeftEngine", "RightEngine"],
        },
      },
      engineIttDegC: {
        arrayIndexNameMap: {
          0: "LeftEngine",
          1: "RightEngine",
        },
        descriptor: {
          visibility: Visibility.Always,
          mapKeys: ["LeftEngine", "RightEngine"],
        },
      },
      lowRotorRPMWarningOn: { descriptor: { visibility: Visibility.Always } },
      stallWarningOn: { descriptor: { visibility: Visibility.Never } },
    },
    failures: TwinEngineFailures,
  },
};
