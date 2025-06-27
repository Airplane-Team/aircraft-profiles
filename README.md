# FlyShirley Aircraft Profiles by Airplane.Team

This repository contains a collection of sample Shirley Aircraft Profiles created by the Airplane Team and community. You can use these profiles as a reference when creating your own!

If you need help, you can join us on our [Discord server](https://airplane.team/discord). If you create a profile and would like feedback, you can post it in the `#profiles` channel!

## Folders

- **[JSON](./json)**: Sample aircraft profiles written in JSON format.
- **[Specification](./specification)**: Contains the type formats and schema for aircraft profiles.

## Specification Overview

- [aircraft_profile.ts](./specification/profiles/aircraft_profile.ts) is the TypeScript file that defines the structure of an aircraft profile. It includes types for the main `AircraftProfile` object, which contains set points, details for Shirley to see, and an `xplane` section for data descriptors.
- [xplane_platform_descriptor.ts](./specification/profiles/xplane_platform_descriptor.ts) defines the data descriptors used in the `xplane` section of the profile. Descriptors map specific aircraft features to data fields in X-Plane, such as position, levers, indicators, and systems.
- [xplane-platform-descriptors.ts](./specification/profiles/xplane-platform-descriptors.ts) Contains the mapping from data descriptors to datarefs in X-Plane, e.g. `XPCommandRefs`, `XPDatarefs`.
- [data_descriptor.ts](./specification/simdata/data_descriptor.ts) defines the structure of a data descriptor, which includes properties like `type`, `visibility`, and `writableByPlatform`, as well as `description` for Shirley to understand the data.
- [data_descriptors.ts](./specification/simdata/data_descriptors.ts) contains the default data descriptors that Shirley has access to.
- [aircraft_types.ts](./specification/aircraft_types.ts) lists all of the codes for supported aircraft types. Use `other` for aircraft not listed here, and give its name in the `name` field of the profile instead.

## Profile Overview

Aircraft profiles use data descriptors to bridge the gap between Shirley's standardized data model and the specific implementation details of different aircraft in X-Plane.
Each profile contains an optional `xplane` section that organizes data descriptors into categories like `position`, `levers`, `indicators`, and `systems`, where each descriptor maps an aircraft feature to a specific data field in the simulation.

All of the Airplane team official aircraft profiles are available to help you get started making your own!
Simply go to the [aircraft profile creator page](https://airplane.team/fly/a/create), scroll down to the bottom of the editor, and select the check box labeled `Always Use Profile Editor`.
Now you can select any supported aircraft in the drop down menu and view its json content.

**Notes:**

1. If you change the content of the editor, you'll need to erase it before the profile for a different aircraft will appear.
2. With the `Always Use Profile Editor` checkbox checked, the profile editor will be used instead of the selector for choosing an aircraft.

## Shirley Aircraft Profile Maker

The Shirley Aircraft Profile Maker is a tool that allows you to create Shirley profiles in a more user-friendly way using a GPT.

Link to Shirley "GPT":
https://flyshirley.com/profile-gpt

It can be helpful to give examples of profiles you like, and data descriptors you'd like to use before asking for a JSON to be created.

## Testing

The most up to date production version of the Profile Creator can be found at:

https://airplane.team/fly/a/create

Copy and paste your JSON profile file into the Shirley Profile Creator.

For access to the latest features, join our [Discord server](https://airplane.team/discord) and ask to join the beta test group.
