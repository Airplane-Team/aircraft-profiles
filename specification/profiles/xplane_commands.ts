import { ExtractValues } from "../util/extract_values.js";
import { Flatten } from "../util/flatten.js";

/** X-Plane Commands Reference */
export const XPCommandRefs = {
  autopilot: {
    servosToggle: "sim/autopilot/servos_toggle", // toggles autopilot
    flightDirectorToggle: "sim/autopilot/fdir_toggle", // toggles flight director
    headingModeToggle: "sim/autopilot/heading",
    returnToLevel: "sim/autopilot/return_to_level", // activates autopilot if not active
    altitudeHold: "sim/autopilot/altitude_hold", // requires autopilot active; enables altitude hold
    verticalSpeed: "sim/autopilot/vertical_speed_pre_sel", // requires autopilot active; enables vertical speed mode
  },
  operation: {
    pauseToggle: "sim/operation/pause_toggle",
    flightModelSpeedToggle: "sim/operation/flightmodel_speed_change",
    loadSituationOne: "sim/operation/load_situation_1",
  },
  engines: {
    propBetaEnabledToggle: "sim/engines/beta_toggle",
  },
  freeze: {
    groundSpeedFreezeToggle: "sim/operation/freeze_toggle",
  },
  systems: {
    fixAllSystems: "sim/operation/fix_all_systems",
  },
  view: {
    enable3DCockpitView: "sim/view/3d_cockpit_cmnd_look",
    screenshot: "sim/operation/screenshot",
  },
  weather: {
    regenerate: "sim/operation/regen_weather",
  },
} as const;

/** Type encompassing all defined X-Plane Commands */
export type XPCommandRef = ExtractValues<typeof XPCommandRefs>;

/** Array of all X-Plane commands used by sim client. */
export const AllXplaneCommands: readonly XPCommandRef[] = Flatten(XPCommandRefs) as XPCommandRef[];
