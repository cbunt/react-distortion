# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Fixed
- Included React 19 in peer dependency range

## [2.0.2] - 2024-12-10
### Fixed
- Missing type declarations

## [2.0.1] - 2024-12-10
### Fixed
- Bundlejs badge in readme now has correct externals.

## [2.0.0] - 2024-12-10
### Added
- react-dom is now a required peer-dependency.
- 'alternate' prop to DistortFilterOptions, allowing customization of alternating animations.
- 'domStates' prop to DistortOptions for customizing DOM event transitions.
- Filter SVGs now have 'aria-hidden="true"'.
- 'cssVariable' prop to DistortOptions for accessing the distortion filter's url in styles.

### Changed
- Animation types are now inferred from related properties.
- Filter SVGs are now appended to document.body with createPortal while in use.
- Internal state is now managed with useReducer.
- 'as' components no longer need to support children.

### Removed
- Removed 'animation' prop from DistortFilterOptions.
- Removed 'distortChildren' prop from DistortOptions.
- Removed child-elements module.

## [1.4.1] - 2024-12-04
### Fixed
- Child svg is now removed from the page flow with 'position: absolute;'.
- Removed unnecessary svg properties xmlns and version.

## [1.4.0] - 2024-11-19
### Added
- More robust typing of `DistortionOptions`, requiring `as` custom components to support children.
    This is only a breaking change for Typescript, and only prevents things that previously
    would cause runtime errors.

## [1.3.0] - 2024-11-02
### Added
- filterId override to DistortOptions

## [1.2.1] - 2024-11-02
### Fixed
- Build issue from previous release

## [1.2.0] - 2024-11-02 [YANKED]
### Added
- jitterAnimation filter option

### Fixed
- 'alternating endless' looping instead of refreshing
- Made @types/react optional peerDependency

## [1.1.2] - 2024-10-26
### Fixed
- Rebuilt after issue in previous release

## [1.1.1] - 2024-10-26 [YANKED]
### Added
- Repo to package.json
- Detailed bundlejs badges

## [1.1.0] - 2024-10-25
### Added
- CHANGELOG.md.
- npm version and bundejs badges to docs.
- Table of minified sizes to docs.
- More robust typing of `DistortionOptions`, requiring `as` intrinsic elements to support children.
    This is only a breaking change for Typescript, and only prevents things that previously
    would cause runtime errors.

### Fixed
- Moved @types/react to peer dependencies.
- Syntax when joining CSS filters
- Removes redundant file anchors when generating docs.

## [1.0.1] - 2024-10-24
### Fixed
- Cleaned up readme links so they work on npmjs.

## [1.0.0] - 2024-10-24

[Unreleased]: https://github.com/cbunt/react-distortion/compare/v2.0.2...HEAD
[2.0.2]: https://github.com/cbunt/react-distortion/compare/v2.0.1...v2.0.2
[2.0.1]: https://github.com/cbunt/react-distortion/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/cbunt/react-distortion/compare/v1.4.1...v2.0.0
[1.4.1]: https://github.com/cbunt/react-distortion/compare/v1.4.0...v1.4.1
[1.4.0]: https://github.com/cbunt/react-distortion/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/cbunt/react-distortion/compare/v1.2.1...v1.3.0
[1.2.1]: https://github.com/cbunt/react-distortion/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/cbunt/react-distortion/compare/v1.1.2...v1.2.0
[1.1.2]: https://github.com/cbunt/react-distortion/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/cbunt/react-distortion/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/cbunt/react-distortion/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/cbunt/react-distortion/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/cbunt/react-distortion/releases/tag/v1.0.0
