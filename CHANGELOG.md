# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
-   More robust typing of `DistortionOptions`, requiring `as` custom components to support children.
    This is only a breaking change for Typescript, and only prevents things that previously
    would cause runtime errors.

## [1.3.0] - 2024-11-02
### Added
-   filterId override to DistortOptions

## [1.2.1] - 2024-11-02
### Fixed
-   Build issue from previous release

## [1.2.0] - 2024-11-02 [YANKED]
### Added 
-   jitterAnimation filter option

### Fixed
-   'alternating endless' looping instead of refreshing 
-   Made @types/react optional peerDependency

## [1.1.2] - 2024-10-26
### Fixed
-   Rebuilt after issue in previous release

## [1.1.1] - 2024-10-26 [YANKED]
### Added
-   Repo to package.json
-   Detailed bundlejs badges

## [1.1.0] - 2024-10-25
### Fixed
-   Moved @types/react to peer dependencies.
-   Syntax when joining CSS filters
-   Removes redundant file anchors when generating docs.

### Added
-   CHANGELOG.md.
-   npm version and bundejs badges to docs.
-   Table of minified sizes to docs.
-   More robust typing of `DistortionOptions`, requiring `as` intrinsic elements to support children.
    This is only a breaking change for Typescript, and only prevents things that previously
    would cause runtime errors.

## [1.0.1] - 2024-10-24
### Fixed
-   Cleaned up readme links so they work on npmjs.

## [1.0.0] - 2024-10-24

[Unreleased]: https://github.com/cbunt/react-distortion/compare/v1.3.0...HEAD
[1.3.0]: https://github.com/cbunt/react-distortion/compare/v1.2.1...1.3.0
[1.2.1]: https://github.com/cbunt/react-distortion/compare/v1.1.2...v1.2.1
[1.2.0]: https://github.com/cbunt/react-distortion/compare/v1.1.2...v1.2.0
[1.1.2]: https://github.com/cbunt/react-distortion/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/cbunt/react-distortion/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/cbunt/react-distortion/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/cbunt/react-distortion/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/cbunt/react-distortion/releases/tag/v1.0.0