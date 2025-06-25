# Sample Shirley Aircraft Profiles by Airplane.Team

This repository contains a collection of sample Shirley Aircraft Profiles created by the Airplane Team and community. You can use these profiles as a reference when creating your own!

If you need help, you can join us on our [Discord server](https://airplane.team/discord). If you create a profile and would like feedback, you can post it in the #profiles channel!

## Folders

- **[JSON](./json)**: Sample aircraft profiles written in JSON format.
- **[Specification](./specification)**: Contains the type formats and schema for aircraft profiles.

## Profile Overview

Aircraft profiles use data descriptors to bridge the gap between Shirley's standardized data model and the specific implementation details of different aircraft in X-Plane. Each profile contains an optional `xplane` section that organizes data descriptors into categories like `position`, `levers`, `indicators`, and `systems`, where each descriptor maps an aircraft feature to a specific data field in the simulation.

All of the Airplane team official aircraft profiles are available to help you get started making your own! Simply go to the aircraft profile creator [page](https://airplane.team/fly/aircraft/create), scroll down to the bottom of the editor, and select the check box labeled `Always Use Profile Editor`. Now you can select any supported aircraft in the drop down menu and view its json content.

## Shirley Aircraft Profile Maker

The Shirley Aircraft Profile Maker is a tool that allows you to create Shirley profiles in a more user-friendly way using a GPT.

Link to Shirley "GPT":
https://flyshirley.com/profile-gpt

It can be helpful to first say,

```
Let's list out and agree on the points before you create the Aircraft Profile object. Here's the background info:

(put your background info here)
```

Then, when you're happy with the list, you can create the object:

```
Looks good! Let's create a the Profile Object in the same style as this one:
` ` `
(paste your previous profile here)
` ` `
```

## Testing

The most up to date production version of the Profile Creator can be found at:

https://airplane.team/fly/aircraft/create

Copy and paste your JSON profile file into the Shirley Profile Creator.

For access to the latest features, join our [Discord server](https://airplane.team/discord) and ask to join the beta test group.
