import { AircraftProfile } from "../specification/profiles/aircraft_profile.js";
import { SingleFixedPistonProfile } from "../specification/profiles/generic_aircraft_profiles.js";
import { Visibility } from "../specification/simdata/data_descriptor.js";

export const Cessna172Profile: AircraftProfile = {
  ...SingleFixedPistonProfile,
  aircraftCode: "c172sp",
  aircraftName: "Cessna Skyhawk 172SP",
  profileName: undefined,
  additionalDetails: ["fixed gear", "flaps", "direct drive propeller"],
  aircraftVSpeeds: [
    { name: "Vg", kias: 68 },
    { name: "Vso", kias: 40 },
    { name: "Vs", kias: 48 },
    { name: "Vr", kias: 55 },
    { name: "Vx", kias: 62 },
    { name: "Vy", kias: 74 },
    { name: "Va 2550", kias: 105 },
    { name: "Va 1900", kias: 90 },
    { name: "Vfe 10º", kias: 110 },
    { name: "Vfe >10º", kias: 85 },
    { name: "Vno", kias: 129 },
    { name: "Vne", kias: 163 },
  ],
  flapsSetpoints: [
    { name: "Up", percent: 0 },
    { name: "Takeoff 10 degrees", percent: 33 },
    { name: "Landing 20 degrees", percent: 67 },
    { name: "Landing 30 degrees", percent: 100 },
  ],
  xplane: {
    ...SingleFixedPistonProfile.xplane,
    indicators: {
      ...SingleFixedPistonProfile.xplane?.indicators,
      engineRpm: {
        descriptor: {
          description: "max 2700",
          visibility: Visibility.Always,
        },
      },
      propellerRpm: {
        descriptor: { visibility: Visibility.Never },
      },
      manifoldPressureInchesMercury: {
        descriptor: { visibility: Visibility.Tool },
      },
    },
    levers: {
      ...SingleFixedPistonProfile.xplane?.levers,
      mixtureLeverPercentRich: {
        descriptor: { visibility: Visibility.Always },
      },
    },
    autopilot: {
      isFlightDirectorEngaged: { descriptor: { visibility: Visibility.Never } },
    },
  },
};
