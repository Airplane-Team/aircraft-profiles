import { ExtractValues } from "../util/extract_values.js";
import { Flatten } from "../util/flatten.js";

/** X-Plane Datarefs Reference */
export const XPDatarefs = {
  aircraft: {
    propellorMinRotationSpeedRadsSec: "sim/aircraft/controls/acf_RSC_mingov_prp",
    propellorMaxRotationSpeedRadsSec: "sim/aircraft/controls/acf_RSC_redline_prp",
    engineCount: "sim/aircraft/engine/acf_num_engines",
    name: "sim/aircraft/view/acf_ui_name",
  },
  cockpit: {
    autopilot: {
      headingBugMagDeg: "sim/cockpit/autopilot/heading_mag",
      altitudeBugFt: "sim/cockpit/autopilot/altitude",
      targetVerticalSpeedFpm: "sim/cockpit/autopilot/vertical_velocity",
    },
    radios: {
      com1FrequencyDeciHz: "sim/cockpit/radios/com1_freq_hz",
      com1StandbyFrequencyDeciHz: "sim/cockpit/radios/com1_stdby_freq_hz",
      com2FrequencyDeciHz: "sim/cockpit/radios/com2_freq_hz",
      com2StandbyFrequencyDeciHz: "sim/cockpit/radios/com2_stdby_freq_hz",
      nav1FrequencyDeciHz: "sim/cockpit/radios/nav1_freq_hz",
      nav1StandbyFrequencyDeciHz: "sim/cockpit/radios/nav1_stdby_freq_hz",
      nav2FrequencyDeciHz: "sim/cockpit/radios/nav2_freq_hz",
      nav2StandbyFrequencyDeciHz: "sim/cockpit/radios/nav2_stdby_freq_hz",
      transponderCode: "sim/cockpit/radios/transponder_code",
    },
    switches: {
      pitotHeatSwitchOn: "sim/cockpit/switches/pitot_heat_on",
      totalEnergyAudioSwitchOn: "sim/cockpit/switches/tot_ener_audio",
    },
  },
  cockpit2: {
    annunciators: {
      stallWarning: "sim/cockpit2/annunciators/stall_warning",
      propBetaEnabled: "sim/cockpit2/annunciators/prop_beta",
    },
    autopilot: {
      autoPilotServosOn: "sim/cockpit2/autopilot/servos_on",
      headingMode: "sim/cockpit2/autopilot/heading_status",
      altitudeMode: "sim/cockpit2/autopilot/altitude_mode",
      flightDirectorMode: "sim/cockpit2/autopilot/flight_director_mode",
    },
    electrical: {
      batteryOn: "sim/cockpit2/electrical/battery_on",
    },
    engine: {
      indicators: {
        ittDegC: "sim/cockpit2/engine/indicators/ITT_deg_C",
        torqueNMtr: "sim/cockpit2/engine/indicators/torque_n_mtr",
        n1Percent: "sim/cockpit2/engine/indicators/N1_percent",
        propOrRotorSpeedRpm: "sim/cockpit2/engine/indicators/prop_speed_rpm",
        manifoldPressureInHg: "sim/cockpit2/engine/indicators/MPR_in_hg",
        engineSpeedRpm: "sim/cockpit2/engine/indicators/engine_speed_rpm",
        egtDegC: "sim/cockpit2/engine/indicators/EGT_deg_C",
      },
      actuators: {
        landingGearDownHandleRatio: "sim/cockpit2/controls/gear_handle_down",
        speedBrakesDeployedHandleRatio: "sim/cockpit2/controls/speedbrake_ratio",
        flapsDownHandleRatio: "sim/cockpit2/controls/flap_handle_request_ratio",
        propellorLeverTargetRotationSpeedRadsSec:
          "sim/cockpit2/engine/actuators/prop_rotation_speed_rad_sec",
        collectiveUpRatio: "sim/cockpit2/engine/actuators/prop_ratio",
        throttleAndBetaReverseRatio: "sim/cockpit2/engine/actuators/throttle_beta_rev_ratio",
        mixtureRatio: "sim/cockpit2/engine/actuators/mixture_ratio",
        governorOn: "sim/cockpit2/engine/actuators/governor_on",
      },
    },
    gauges: {
      altimeterPressureInHg: "sim/cockpit2/gauges/actuators/barometer_setting_in_hg_pilot",
      totalEnergyVariometerFpm: "sim/cockpit2/gauges/indicators/total_energy_fpm",
      ballSlipIndicatorDeg: "sim/cockpit2/gauges/indicators/slip_deg",
      sideslipRightDeg: "sim/cockpit2/gauges/indicators/sideslip_degrees",
    },
    ice: {
      propHeatSwitchOn: "sim/cockpit2/ice/ice_prop_heat_on",
    },
    switches: {
      landingLightsSwitchOn: "sim/cockpit2/switches/landing_lights_on",
      taxiLightsSwitchOn: "sim/cockpit2/switches/taxi_light_on",
      navigationLightsSwitchOn: "sim/cockpit2/switches/navigation_lights_on",
      strobeLightsSwitchOn: "sim/cockpit2/switches/strobe_lights_on",
    },
  },
  flightModel2: {
    hasCrashed: "sim/flightmodel2/misc/has_crashed",
  },
  flightModel: {
    position: {
      kias: "sim/flightmodel/position/indicated_airspeed",
      gpsSpeedMps: "sim/flightmodel/position/groundspeed",
      groundSpeedKts: "sim/flightmodel/position/groundspeed",
      verticalSpeedFpm: "sim/flightmodel/position/vh_ind_fpm",
      altitudeAglM: "sim/flightmodel/position/y_agl",
      altitudeMslM: "sim/flightmodel/position/elevation",
      latitudeDeg: "sim/flightmodel/position/latitude",
      longitudeDeg: "sim/flightmodel/position/longitude",
      headingMagDeg: "sim/flightmodel/position/mag_psi",
      headingTrueDeg: "sim/flightmodel/position/true_psi",
      groundTrackTrueDeg: "sim/flightmodel/position/hpath",
      rollAngleDegRight: "sim/flightmodel/position/phi",
      pitchAngleDegUp: "sim/flightmodel/position/theta",
      localX: "sim/flightmodel/position/local_x",
      localY: "sim/flightmodel/position/local_y",
      localZ: "sim/flightmodel/position/local_z",
      localVx: "sim/flightmodel/position/local_vx",
      localVy: "sim/flightmodel/position/local_vy",
      localVz: "sim/flightmodel/position/local_vz",
      q: "sim/flightmodel/position/q",
    },
    controls: {
      brakesOn: "sim/flightmodel/controls/parkbrake",
    },
    failures: {
      lowRotorSpeedWarning: "sim/flightmodel/failures/lo_rotor_warning",
    },
    engine: {
      carburetorHeatRatio: "sim/flightmodel/engine/ENGN_heat",
    },
  },
  operationFailures: {
    seize: {
      seize0: "sim/operation/failures/rel_seize_0",
      seize1: "sim/operation/failures/rel_seize_1",
    },
    pitotStatic: {
      pitotFailure: "sim/operation/failures/rel_pitot",
      staticFailure: "sim/operation/failures/rel_static",
    },
    gps: {
      gps1Failure: "sim/operation/failures/rel_gps",
      nav1Failure: "sim/operation/failures/rel_nav1",
      nav2Failure: "sim/operation/failures/rel_nav2",
    },
    electrical: {
      bus1Failure: "sim/operation/failures/rel_esys",
      battery1Failure: "sim/operation/failures/rel_batter0",
      generator1Failure: "sim/operation/failures/rel_genera0",
    },
  },
  time: {
    zuluTimeSeconds: "sim/time/zulu_time_sec",
    dayOfYear: "sim/time/local_date_days",
    simSpeedRatio: "sim/time/sim_speed_actual",
    isPaused: "sim/time/paused",
  },
  weather: {
    aircraftWindHeadingDeg: "sim/weather/aircraft/wind_now_direction_degt",
    aircraftWindSpeedMps: "sim/weather/aircraft/wind_now_speed_msc",
    cloudLayerTopsAltitudeMMsl: "sim/weather/region/cloud_tops_msl_m",
    cloudLayerBasesAltitudeMMsl: "sim/weather/region/cloud_base_msl_m",
    cloudLayerCoveragePercent: "sim/weather/region/cloud_coverage_percent",
    cloudLayerType: "sim/weather/region/cloud_type",
    windLayerAltitudeM: "sim/weather/region/wind_altitude_msl_m",
    windLayerDirectionDeg: "sim/weather/region/wind_direction_degt",
    windLayerSpeedMsc: "sim/weather/region/wind_speed_msc",
    windLayerTurbulence: "sim/weather/region/turbulence",
    windLayerShearMsc: "sim/weather/region/shear_speed_msc",
    visibilityMiles: "sim/weather/region/visibility_reported_sm",
    rainPercent: "sim/weather/region/rain_percent",
    runwayFriction: "sim/weather/region/runway_friction",
    groundTemperatureDegC: "sim/weather/region/sealevel_temperature_c",
    sealevelPressurePas: "sim/weather/region/sealevel_pressure_pas",
    thermalRateMs: "sim/weather/region/thermal_rate_ms",
    changeMode: "sim/weather/region/change_mode",
    updateImmediately: "sim/weather/region/update_immediately",
  },
} as const;

/** Type encompassing all X-Plane Datarefs */
export type XPDataref = ExtractValues<typeof XPDatarefs>;

/** Array of all X-Plane datarefs used by sim client. */
export const AllXplaneDatarefs: readonly XPDataref[] = Flatten(XPDatarefs) as XPDataref[];
