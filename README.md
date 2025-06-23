# Sample Shirley Aircraft Profiles by Airplane.Team

This repository contains a collection of sample Shirley Aircraft Profiles created by the Airplane Team and community. You can use these profiles as a reference when creating your own!

If you need help, you can join us on our [Discord server](https://airplane.team/discord). If you create a profile and would like feedback, you can post it in the #profiles channel!

## Folders

- **[JSON](./json)**: Sample aircraft profiles written in JSON format.
- **[TypeScript](./typescript)**: Sample aircraft profiles written in TypeScript.
- **[Specification](./specification)**: Contains the type formats and validation schema for aircraft profiles.

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

Copy and paste your profile file into the Shirley Profile Creator. The supported formats are JSON and variant of TypeScript.

For profiles in Typescript, you can copy the whole file, but it must be a single profile object with no derived properties. There are also certain restrictions- most notably, no `//` inside a string and no strings with single quotes `' example '`.

For access to the latest features, join our [Discord server](https://airplane.team/discord) and ask to join the beta test group.

## Converting Typescript Profile to JSON

You can add this code to convert a TS profile to JSON, if you need to:

```typescript
const jsonString = JSON.stringify(yourProfileName, null, 2);

import { writeFileSync } from "fs";
const fileName = "profile.out.json";
const outputPath = "json/" + fileName;
writeFileSync(outputPath, jsonString);

console.log(`Wrote ${fileName} to ${outputPath}`);
```

You can execute this code by running `npx ts-node typescript/c172sp.ts` in the root directory of the repo.
