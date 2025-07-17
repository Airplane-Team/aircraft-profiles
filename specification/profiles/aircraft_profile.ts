import { z } from "zod";

import { AircraftCodes } from "../aircraft_types.js";
import {
  XPlanePlatformDescriptors,
  XPlanePlatformDescriptorsSchema,
} from "./xplane_platform_descriptor.js";

/** Schema for a Profile for an aircraft that Shirley can support. */
export const AircraftProfileSchema = z
  .object({
    /** The aircraft this profile is for.
     * @remark used for tracking. Use `other` if not in list.
     */
    aircraftCode: z.enum(AircraftCodes),

    /** The name of the aircraft this profile is for. */
    aircraftName: z.string().min(1),

    /** The optional name of the profile itself if different than the aircraft name. */
    profileName: z.string().min(1).optional(),

    /** Additional details Shirley needs to know about the aircraft.
     *
     * e.g. "fixed gear", "tailwheel", etc.
     */
    additionalDetails: z.array(z.string()).optional(),

    /** Descriptors used by the x-plane client, including descriptor overrides.
     * Keyed by DataCategory and then by DataName.
     */
    xplane: XPlanePlatformDescriptorsSchema.optional(),

    /** When set Shirley sees equivalent % setpoints for flaps setpoint names.
     *
     * E.g. `[{"name": "20 degrees", "percent": 40}, {"name": "30 degrees", "percent": 70}, ...]`
     *
     * @remark When undefined, Shirley can still set any percentage.
     * @remark When empty, no flaps setpoints are available.
     */
    flapsSetpoints: z.array(z.object({ name: z.string().min(1), percent: z.number() })).optional(),

    /** When set Shirley sees equivalent % setpoints for speedbrakes setpoint names.
     *
     * E.g. `[{"name": "20 degrees", "percent": 40}, {"name": "30 degrees", "percent": 70}, ...]`
     *
     * @remark When undefined or empty, no speedbrakes setpoints are available.
     */
    speedbrakesSetpoints: z
      .array(z.object({ name: z.string().min(1), percent: z.number() }))
      .optional(),

    /** Specifies speeds that Shirley can reference by name.
     *
     * E.g. `[{"name": "Vr", "kias": 50}, {"name": "Vy", "kias": 73}, ...]`
     */
    aircraftVSpeeds: z.array(z.object({ name: z.string().min(1), kias: z.number() })).optional(),

    /** Specifies additional optional properties for the aircraft. */
    properties: z
      .object({
        /** Specifies voice-activated control highlighting in X-Plane.
         *
         * @remark User lowercase for matching.
         *
         * E.g. `[{"triggers": ["stick", "side stick"], "commandRef": "flys/highlight/left_stick"}]`
         */
        highlightXplaneControls: z
          .array(
            z.object({
              /** The phrases that trigger the highlight command for a given control. */
              triggers: z.array(z.string().min(1)),
              /** The command ref to set active when the triggers are detected. */
              commandRef: z.string(),
            })
          )
          .optional(),
        /** Specifies the pitch of the aircraft when resting on the ground. */
        groundPitchDegUp: z.number().optional(),
      })
      .strict()
      .optional(),
  })
  .strict();

/** Profile for an aircraft that Shirley can support.
 * @remark compared to the schema, uses `xplane` as `XPlanePlatformDescriptors`
 *         instead of `XPlanePlatformDescriptorsSchema`, which resolves to be functionally
 *         equivalent at runtime.
 * @see AircraftProfileSchema
 */
export type AircraftProfile = Omit<z.infer<typeof AircraftProfileSchema>, "xplane"> & {
  xplane?: XPlanePlatformDescriptors;
};
