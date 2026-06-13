# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-06-13

### Added

- `relationships` support on `createResource` and `serialize`.
- `included` option for compound documents, deduped by `type` and `id`.
- `jsonapi` top-level member via `serialize` options.
- `options.timestamp` to opt out of the auto-injected `meta.timestamp`.
- `source.header` support in `ErrorConfig`.

### Fixed

- `serialize` now throws when a resource item is missing `id`, instead of producing `id: "undefined"`.

## [0.1.0] - 2026-06-12

### Added

- Initial release of `@emelon/jsonapi-nano`.
- Zero-dependency JSON:API presentation layer engine.
