import {
  XPCommandRefs,
  XplaneDescriptor,
  XPlanePlatformDescriptors,
  XPDatarefs,
  AllCloudLayerKeys,
  AutopilotAltitudeModes,
  AllCloudTypes,
  RunwayConditions,
  WeatherEvolutions,
} from "lib-airplane/src/client";

const kSecondsPerHour = 3600;
const kFeetPerMeter = 3.28084;
const kFtLbPerNm = 0.737562;
const kKtsPerMetersPerSecond = 1.94384;
const kNumHzPerDeciHz = 10;
const kInchesMercuryPerPascal = 1 / 3386.39;
const kSecondsPerMinute = 60;

/** Map of all xplane supported indexes for cloud layers (3) to internal keys. */
const kCloudLayerIndexToKey = Object.fromEntries(AllCloudLayerKeys.map((v, i) => [i, v]));

/** The maximum wind layer index in X-Plane. */
export const kMaxXplaneWindLayerIndex = 12;

/** Map of all xplane supported indexes for wind layers to their internal keys. */
export const kWindLayerIndexToKey = Array.from({ length: kMaxXplaneWindLayerIndex + 1 }, (_, i) =>
  (i + 1).toString()
);

const FrontendXPlanePlatformDescriptorsInternal = {
  frontend: {
    propellorTargetRotationSpeedRadsSec: {
      dataref: XPDatarefs.cockpit2.engine.actuators.propellorLeverTargetRotationSpeedRadsSec,
    },
    propellorMinRotationSpeedRadsSec: {
      dataref: XPDatarefs.aircraft.propellorMinRotationSpeedRadsSec,
    },
    propellorMaxRotationSpeedRadsSec: {
      dataref: XPDatarefs.aircraft.propellorMaxRotationSpeedRadsSec,
    },
    engineCount: { dataref: XPDatarefs.aircraft.engineCount },
    com1FrequencyHz: {
      dataref: XPDatarefs.cockpit.radios.com1FrequencyDeciHz,
      ratio: kNumHzPerDeciHz,
    },
    com1StandbyFrequencyHz: {
      dataref: XPDatarefs.cockpit.radios.com1StandbyFrequencyDeciHz,
      ratio: kNumHzPerDeciHz,
    },
    com2FrequencyHz: {
      dataref: XPDatarefs.cockpit.radios.com2FrequencyDeciHz,
      ratio: kNumHzPerDeciHz,
    },
    com2StandbyFrequencyHz: {
      dataref: XPDatarefs.cockpit.radios.com2StandbyFrequencyDeciHz,
      ratio: kNumHzPerDeciHz,
    },
    nav1FrequencyHz: {
      dataref: XPDatarefs.cockpit.radios.nav1FrequencyDeciHz,
      ratio: kNumHzPerDeciHz,
    },
    nav1StandbyFrequencyHz: {
      dataref: XPDatarefs.cockpit.radios.nav1StandbyFrequencyDeciHz,
      ratio: kNumHzPerDeciHz,
    },
    nav2FrequencyHz: {
      dataref: XPDatarefs.cockpit.radios.nav2FrequencyDeciHz,
      ratio: kNumHzPerDeciHz,
    },
    nav2StandbyFrequencyHz: {
      dataref: XPDatarefs.cockpit.radios.nav2StandbyFrequencyDeciHz,
      ratio: kNumHzPerDeciHz,
    },
    weatherUpdateImmediately: {
      dataref: XPDatarefs.weather.updateImmediately,
    },
    // Coordinate system descriptors
    localX: {
      dataref: XPDatarefs.flightModel.position.localX,
    },
    localY: {
      dataref: XPDatarefs.flightModel.position.localY,
    },
    localZ: {
      dataref: XPDatarefs.flightModel.position.localZ,
    },
    localVx: {
      dataref: XPDatarefs.flightModel.position.localVx,
    },
    localVy: {
      dataref: XPDatarefs.flightModel.position.localVy,
    },
    localVz: {
      dataref: XPDatarefs.flightModel.position.localVz,
    },
    q: {
      dataref: XPDatarefs.flightModel.position.q,
      arrayIndexNameMap: { 0: "w", 1: "x", 2: "y", 3: "z" },
    },
    // Engine failure descriptors
    engine0Seize: {
      dataref: XPDatarefs.operationFailures.seize.seize0,
    },
    engine1Seize: {
      dataref: XPDatarefs.operationFailures.seize.seize1,
    },
    // as used by ALIA-250 for the pusher
    engine4Seize: {
      dataref: XPDatarefs.operationFailures.seize.seize4,
    },
    // Pitot-static failure descriptors
    pitotPilotSideBlockage: {
      dataref: XPDatarefs.operationFailures.pitotStatic.pitotFailure,
    },
    staticPilotSideBlockage: {
      dataref: XPDatarefs.operationFailures.pitotStatic.staticFailure,
    },
    // GPS and navigation failure descriptors
    gps1Failure: {
      dataref: XPDatarefs.operationFailures.gps.gps1Failure,
    },
    nav1Failure: {
      dataref: XPDatarefs.operationFailures.gps.nav1Failure,
    },
    nav2Failure: {
      dataref: XPDatarefs.operationFailures.gps.nav2Failure,
    },
    // Electrical failure descriptors
    bus1Failure: {
      dataref: XPDatarefs.operationFailures.electrical.bus1Failure,
    },
    battery1Failure: {
      dataref: XPDatarefs.operationFailures.electrical.battery1Failure,
    },
    generator1Failure: {
      dataref: XPDatarefs.operationFailures.electrical.generator1Failure,
    },
  },
} as const;

/** These are keys for the descriptors that are specific to the frontend. */
export type FrontendDescriptorKey =
  keyof (typeof FrontendXPlanePlatformDescriptorsInternal)["frontend"];

/** These are the descriptors that are specific to the frontend / computing the values to
 * be sent to Shirley. These include datarefs and ratios used by the frontend to convert from X-Plane.
 * They are supplemental `XPlanePlatformDescriptors` and not used by Shirley.
 * */
export const FrontendXPlanePlatformDescriptors: Record<
  "frontend",
  Record<FrontendDescriptorKey, XplaneDescriptor | undefined>
> = FrontendXPlanePlatformDescriptorsInternal;

/** These are the platform descriptors used for converting between backend data and X-Plane datarefs.
 * @remark Prior to any aircraft profile overrides: The Xplane portion of the platform descriptors can be
 *         overridden by the aircraft profile.
 * @remark DataDescriptor overrides (`descriptor`) are disallowed in the base descriptors
 *         as they are only seen on the frontend.
 * */
export const BaseXPlanePlatformDescriptors: XPlanePlatformDescriptors = {
  position: {
    latitudeDeg: { dataref: XPDatarefs.flightModel.position.latitudeDeg },
    longitudeDeg: { dataref: XPDatarefs.flightModel.position.longitudeDeg },
    aglAltitudeFt: { dataref: XPDatarefs.flightModel.position.altitudeAglM, ratio: kFeetPerMeter },
    mslAltitudeFt: { dataref: XPDatarefs.flightModel.position.altitudeMslM, ratio: kFeetPerMeter },
    indicatedAirspeedKts: { dataref: XPDatarefs.flightModel.position.kias },
    gpsGroundSpeedKts: {
      dataref: XPDatarefs.flightModel.position.gpsSpeedMps,
      ratio: kKtsPerMetersPerSecond,
    },
    verticalSpeedUpFpm: { dataref: XPDatarefs.flightModel.position.verticalSpeedUpFpm },
  },
  attitude: {
    rollAngleDegRight: { dataref: XPDatarefs.flightModel.position.rollAngleDegRight },
    pitchAngleDegUp: { dataref: XPDatarefs.flightModel.position.pitchAngleDegUp },
    magneticHeadingDeg: { dataref: XPDatarefs.flightModel.position.headingMagDeg },
    trueHeadingDeg: { dataref: XPDatarefs.flightModel.position.headingTrueDeg },
    trueGroundTrackDeg: { dataref: XPDatarefs.flightModel.position.groundTrackTrueDeg },
  },
  radiosNavigation: {
    frequencyHz: { ratio: kNumHzPerDeciHz },
    standbyFrequencyHz: { ratio: kNumHzPerDeciHz },
    comShouldSwapFrequencies: undefined,
    transponderCode: { dataref: XPDatarefs.cockpit.radios.transponderCode },
  },
  lights: {
    landingLightsSwitchOn: { dataref: XPDatarefs.cockpit2.switches.landingLightsSwitchOn },
    taxiLightsSwitchOn: { dataref: XPDatarefs.cockpit2.switches.taxiLightsSwitchOn },
    navigationLightsSwitchOn: { dataref: XPDatarefs.cockpit2.switches.navigationLightsSwitchOn },
    strobeLightsSwitchOn: { dataref: XPDatarefs.cockpit2.switches.strobeLightsSwitchOn },
  },
  indicators: {
    engineRpm: { dataref: XPDatarefs.cockpit2.engine.indicators.engineSpeedRpm },
    rotorRpm: { dataref: XPDatarefs.cockpit2.engine.indicators.propOrRotorSpeedRpm },
    propellerRpm: { dataref: XPDatarefs.cockpit2.engine.indicators.propOrRotorSpeedRpm },
    engineN1Percent: { dataref: XPDatarefs.cockpit2.engine.indicators.n1Percent },
    manifoldPressureInchesMercury: {
      dataref: XPDatarefs.cockpit2.engine.indicators.manifoldPressureInHg,
    },
    engineTorqueFtLb: {
      dataref: XPDatarefs.cockpit2.engine.indicators.torqueNMtr,
      ratio: kFtLbPerNm,
    },
    turbineGasTemperatureDegC: { dataref: XPDatarefs.cockpit2.engine.indicators.egtDegC },
    engineIttDegC: { dataref: XPDatarefs.cockpit2.engine.indicators.ittDegC },
    exhaustGasDegC: { dataref: XPDatarefs.cockpit2.engine.indicators.egtDegC },
    lowRotorRPMWarningOn: { dataref: XPDatarefs.flightModel.failures.lowRotorSpeedWarning },
    totalEnergyVariometerFpm: { dataref: XPDatarefs.cockpit2.gauges.totalEnergyVariometerFpm },
    stallWarningOn: { dataref: XPDatarefs.cockpit2.annunciators.stallWarning },
    altimeterSettingInchesMercury: { dataref: XPDatarefs.cockpit2.gauges.altimeterPressureInHg },
    slipSkidBallRightDeflectionPercent: {
      dataref: XPDatarefs.cockpit2.gauges.ballSlipIndicatorDeg,
      ratio: -100 / 8, // full right deflection is -8 degrees, so we divide by 8 to get a percentage
    },
    yawStringRightSideslipDeg: {
      // NOTE: right sideslip makes the yaw string point left
      dataref: XPDatarefs.cockpit2.gauges.sideslipRightDeg,
    },
  },
  levers: {
    flapsHandlePercentDown: {
      dataref: XPDatarefs.cockpit2.engine.actuators.flapsDownHandleRatio,
      ratio: 100,
    },
    speedBrakesHandlePercentDeployed: {
      dataref: XPDatarefs.cockpit2.engine.actuators.speedBrakesDeployedHandleRatio,
      ratio: 100,
    },
    landingGearHandlePercentDown: {
      dataref: XPDatarefs.cockpit2.engine.actuators.landingGearDownHandleRatio,
      ratio: 100,
    },
    throttlePercentOpen: {
      dataref: XPDatarefs.cockpit2.engine.actuators.throttleAndBetaReverseRatio,
      ratio: 100,
    },
    collectivePercentUp: {
      dataref: XPDatarefs.cockpit2.engine.actuators.collectiveUpRatio,
      ratio: 100,
    },
    conditionLeverPercentHigh: {
      dataref: XPDatarefs.cockpit2.engine.actuators.mixtureRatio,
      ratio: 100,
    },
    mixtureLeverPercentRich: {
      dataref: XPDatarefs.cockpit2.engine.actuators.mixtureRatio,
      ratio: 100,
    },
    carburetorHeatLeverPercentHot: {
      dataref: XPDatarefs.flightModel.engine.carburetorHeatRatio,
      ratio: 100,
    },
    // undefined here because it's handled in a special case in the frontend
    propellerLeverPercentCoarse: undefined,
    propBetaEnabled: {
      dataref: XPDatarefs.cockpit2.annunciators.propBetaEnabled,
      command: { ref: XPCommandRefs.engines.propBetaEnabledToggle },
    },
  },
  autopilot: {
    isAutopilotEngaged: {
      dataref: XPDatarefs.cockpit2.autopilot.autoPilotServosOn,
      command: { ref: XPCommandRefs.autopilot.servosToggle },
    },
    isHeadingSelectEnabled: {
      dataref: XPDatarefs.cockpit2.autopilot.headingMode,
      command: { ref: XPCommandRefs.autopilot.headingModeToggle },
    },
    isFlightDirectorEngaged: {
      dataref: XPDatarefs.cockpit2.autopilot.flightDirectorMode,
      command: { ref: XPCommandRefs.autopilot.flightDirectorToggle },
    },
    altitudeMode: {
      dataref: XPDatarefs.cockpit2.autopilot.altitudeMode,
      enumValueMap: {
        disabled: 12,
        pitch: 3,
        verticalSpeed: 4,
        levelChange: 5,
        altitudeHold: 6,
        terrain: 7,
        glideSlope: 8,
        VNAV: 9,
        TOGA: 10,
        flightPathAngle: 19,
        VNAVSpeed: 20,
      } as Record<(typeof AutopilotAltitudeModes)[number], number>,
    },
    targetVerticalSpeedUpFpm: {
      dataref: XPDatarefs.cockpit.autopilot.targetVerticalSpeedUpFpm,
    },
    shouldLevelWings: {
      command: { ref: XPCommandRefs.autopilot.returnToLevel },
    },
    magneticHeadingBugDeg: {
      dataref: XPDatarefs.cockpit.autopilot.headingBugMagDeg,
    },
    altitudeBugFt: {
      dataref: XPDatarefs.cockpit.autopilot.altitudeBugFt,
    },
  },
  systems: {
    batteryOn: { dataref: XPDatarefs.cockpit2.electrical.batteryOn },
    pitotHeatSwitchOn: { dataref: XPDatarefs.cockpit.switches.pitotHeatSwitchOn },
    parkingBrakeOn: { dataref: XPDatarefs.flightModel.controls.parkingBrakeOn },
    governorSwitchOn: { dataref: XPDatarefs.cockpit2.engine.actuators.governorOn },
    totalEnergyAudioSwitchOn: { dataref: XPDatarefs.cockpit.switches.totalEnergyAudioSwitchOn },
    propHeatSwitchOn: { dataref: XPDatarefs.cockpit2.ice.propHeatSwitchOn },
  },
  environment: {
    aircraftWindHeadingDeg: { dataref: XPDatarefs.weather.aircraftWindHeadingDeg },
    aircraftWindSpeedKts: {
      dataref: XPDatarefs.weather.aircraftWindSpeedMps,
      ratio: kKtsPerMetersPerSecond,
    },
    zuluTimeHours: { dataref: XPDatarefs.time.zuluTimeSeconds, ratio: 1 / kSecondsPerHour },
    dayOfYear: { dataref: XPDatarefs.time.dayOfYear },
    // undefined here because it's handled in a special case in the frontend
    cloudLayerEnabled: undefined,
    cloudLayerBasesAltitudeFtMsl: {
      dataref: XPDatarefs.weather.cloudLayerBasesAltitudeMMsl,
      ratio: kFeetPerMeter,
      arrayIndexNameMap: kCloudLayerIndexToKey,
    },
    cloudLayerTopsAltitudeFtMsl: {
      dataref: XPDatarefs.weather.cloudLayerTopsAltitudeMMsl,
      ratio: kFeetPerMeter,
      arrayIndexNameMap: kCloudLayerIndexToKey,
    },
    cloudLayerType: {
      dataref: XPDatarefs.weather.cloudLayerType,
      arrayIndexNameMap: kCloudLayerIndexToKey,
      enumValueMap: { cirrus: 0, stratus: 1, cumulus: 2, cumulonimbus: 3 } as Record<
        (typeof AllCloudTypes)[number],
        number
      >,
    },
    cloudLayerCoveragePercent: {
      dataref: XPDatarefs.weather.cloudLayerCoveragePercent,
      ratio: 100,
      arrayIndexNameMap: kCloudLayerIndexToKey,
    },
    // undefined here because it's handled in a special case in the frontend
    windLayerEnabled: undefined,
    windLayerAltitudeFt: {
      dataref: XPDatarefs.weather.windLayerAltitudeM,
      ratio: kFeetPerMeter,
      arrayIndexNameMap: kWindLayerIndexToKey,
    },
    windLayerDirectionDeg: {
      dataref: XPDatarefs.weather.windLayerDirectionDeg,
      arrayIndexNameMap: kWindLayerIndexToKey,
    },
    windLayerSpeedKts: {
      dataref: XPDatarefs.weather.windLayerSpeedMsc,
      ratio: kKtsPerMetersPerSecond,
      arrayIndexNameMap: kWindLayerIndexToKey,
    },
    windLayerTurbulencePercent: {
      dataref: XPDatarefs.weather.windLayerTurbulence,
      ratio: 100,
      arrayIndexNameMap: kWindLayerIndexToKey,
    },
    windLayerGustIncreaseKts: {
      dataref: XPDatarefs.weather.windLayerShearMsc,
      ratio: kKtsPerMetersPerSecond,
      arrayIndexNameMap: kWindLayerIndexToKey,
    },
    seaLevelPressureInchesMercury: {
      dataref: XPDatarefs.weather.sealevelPressurePas,
      ratio: kInchesMercuryPerPascal,
    },
    runwayFriction: {
      dataref: XPDatarefs.weather.runwayFriction,
      enumValueMap: {
        dry: 0,
        lightlyWet: 1,
        wet: 2,
        veryWet: 3,
        lightlyPuddly: 4,
        puddly: 5,
        veryPuddly: 6,
        lightlySnowy: 7,
        snowy: 8,
        verySnowy: 9,
        lightlyIcy: 10,
        icy: 11,
        veryIcy: 12,
        lightlySnowyAndIcy: 13,
        snowyAndIcy: 14,
        verySnowyAndIcy: 15,
      } as Record<(typeof RunwayConditions)[number], number>,
    },
    rainPercent: {
      dataref: XPDatarefs.weather.rainPercent,
      ratio: 100,
    },
    groundTemperatureDegC: { dataref: XPDatarefs.weather.groundTemperatureDegC },
    thermalClimbRateFpm: {
      dataref: XPDatarefs.weather.thermalRateMs,
      ratio: kFeetPerMeter * kSecondsPerMinute,
    },
    weatherEvolution: {
      dataref: XPDatarefs.weather.changeMode,
      enumValueMap: {
        improvingRapidly: 0,
        improving: 1,
        improvingSlowly: 2,
        static: 3,
        deterioratingSlowly: 4,
        deteriorating: 5,
        deterioratingRapidly: 6,
        realWorldWeather: 7,
      } as Record<(typeof WeatherEvolutions)[number], number>,
    },
    visibilityMiles: { dataref: XPDatarefs.weather.visibilityMiles },
    // undefined here because it's handled in a special case in the frontend
    shouldUseCurrentWeather: undefined,
    shouldRegenerateWeather: {
      command: { ref: XPCommandRefs.weather.regenerate },
    },
  },
  failures: {
    // undefined here because it's handled in a special case in the frontend
    // in `FrontendXPlanePlatformDescriptorsInternal`
    scheduledAtAltitudeFtAgl: undefined,
    scheduledAtAirspeedKias: undefined,
    isFailed: undefined,
  },
  simulation: {
    aircraftName: {
      dataref: XPDatarefs.aircraft.name,
    },
    isPaused: {
      dataref: XPDatarefs.time.isPaused,
      command: { ref: XPCommandRefs.operation.pauseToggle },
    },
    simSpeedRatio: {
      dataref: XPDatarefs.time.simSpeedRatio,
      command: { ref: XPCommandRefs.operation.flightModelSpeedToggle },
    },
    isCrashed: {
      dataref: XPDatarefs.flightModel2.hasCrashed,
      command: { ref: XPCommandRefs.systems.fixAllSystems },
    },
    shouldResetFlight: {
      command: { ref: XPCommandRefs.operation.resetFlight },
    },
  },
  freezes: {
    positionFreezeEnabled: {
      dataref: XPDatarefs.time.groundSpeedRatio,
      ratio: -1,
      offset: 1,
      command: { ref: XPCommandRefs.freeze.groundSpeedFreezeToggle },
    },
  },
} as const;

/** PlatformDescriptors used by frontend X-Plane client, including frontend-only descriptors. */
export type XplaneFrontendAndPlatformDescriptors = XPlanePlatformDescriptors &
  typeof FrontendXPlanePlatformDescriptors;
