# Aircraft Profiles Changelog

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Version numbers are assigned in Github Releases using `worker`'s version number from [Shirley Changelog](https://airplane.team/changelog).

## [v2.14.0 beta] - 2025-09-29

The 2.14 beta is on the staging environment. See [README.md#Testing](./README.md#Testing) for more information.

### Added

- `offset` property to `xplane_platform_descriptor.ts` to convert the dataref value to the quantity Shirley sees.
- `shouldResetFlight` property to `xplane_platform_descriptor.ts` to reset the flight.

### Changed

- `positionFreezeEnabled` is now additionally visible to Shirley via `xplane_platform_descriptor.ts`.
- `parkingBrakeOn` is new name for `brakesOn` in `xplane_platform_descriptor.ts`.
- `targetVerticalSpeedUpFpm` is new name for `targetVerticalSpeedFpm` in `xplane_platform_descriptor.ts`.

## [v2.12.0] - 2025-07-17

### Added

- `aircraft_profile.ts` and `data_descriptors.ts` files from Shirley `v2.12.0`. Includes control highlighting support.
- Initial [README.md](./README.md).
- [Specification](./specification) folder with initial files for aircraft profiles.
- [JSON](./json) folder with sample aircraft profiles.
