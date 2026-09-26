# Changelog

[Back to the main README](README.md)

This file records user-visible changes to Pi Skill Orchestrator.

## 0.1.26 - 2026-09-15

Adds an optional, profile-scoped Token Saver inspired by transferable tactics from Headroom and RTK while keeping Skill Orchestrator local, reversible, fail-open, and within Pi's public extension boundary.

### Added

- Added `/token-saver [on|off|status|stats|clear]` and the manager `T` toggle. The setting is stored per Skill Orchestrator profile and is off by default for existing/default profiles.
- Added deterministic content-aware compaction for JSON/NDJSON, search results, tests, logs/build output, diffs, source reads, directory inventories, tables, structured config, and long general text.
- Added Headroom-style reversible Compress-Cache-Retrieve behavior through a bounded session-local exact-output store and the `token_retrieve` model tool, including line-range paging.
- Added exact cross-turn result deduplication, repeated-line grouping, progress/ANSI cleanup, error/failure prioritization, representative sampling, relevance scoring, outlier/change-point retention, and constant-field factoring.
- Added local adaptive recovery feedback so repeated retrievals make later compaction for that tool type less aggressive.
- Added lazy non-core tool-schema deferral through `token_tool_search`; Pi core tools and Skill Orchestrator's discovery/recovery tools remain active while deferred capabilities can be searched and activated on demand.
- Added provider-request compaction for unusually long top-level tool descriptions while preserving names, parameter schemas, parameter descriptions, required fields, enums, and validation constraints exactly.
- Added cache-friendly prompt-prefix drift observation without rewriting old conversation turns or guessing provider cache TTLs.
- Added fixed concise-response guidance and conservative clamp-only reasoning-effort reduction after routine successful tool continuations when the provider request already exposes a compatible effort/budget field.
- Added Token Saver session statistics for character reduction, approximate input-token savings, recovery activity, prefix drift, deferred-tool searches/activations, tool-description reduction, and strategy counts.
- Added `docs/token-saver.md` with the tactic map, safety guarantees, and explicit list of Headroom features that are deliberately not emulated.

### Safety and compatibility

- Explicit machine-readable output requests such as `--json` pass through unchanged.
- Skill bodies and Skill Orchestrator skill-selection results are never compacted.
- Images are never modified.
- Source reads stay byte-exact when the current task clearly requires editing, fixing, patching, refactoring, or implementation.
- Compression failures and non-beneficial transforms fail open to the original tool result.
- Recovery data is bounded and session-local; recovery IDs are valid only while their exact originals remain in memory. Oversized originals that cannot fit in the store fail open unchanged. Token Saver does not create a persistent personal-memory database, install external services, mutate instruction files, or change Pi's global settings.
- Exact recovery preserves the original newline bytes, including CRLF input; analysis may normalize a working copy without changing the stored original.
- Fixed multi-tool effort routing so any error or non-routine result blocks reasoning-effort reduction for that continuation.
- Restored deferred tools and removed Token Saver helper schemas during Pi session shutdown.
- Preserved diff metadata and all changed lines under diff cap pressure.
- Sanitized deferred-tool metadata before model display and tightened tool-description character limits.
- Updated compatibility documentation for the current Pi public extension hooks used by Token Saver, including mutable tool results, provider-request inspection/replacement, and runtime active-tool control.

### Verified

- 171 automated regression tests pass.
- Source-safety, documentation-reachability, package-metadata, and npm dry-pack checks pass before release packaging.

## 0.1.25 - 2026-09-10

First GitHub-ready and npm-ready release package.

### Added

- Added complete GitHub repository metadata and support files.
- Added a full documentation set under `docs/`.
- Added GitHub Actions for normal CI, latest-Pi compatibility checks, and npm publishing.
- Added package metadata for npm, GitHub, issue tracking, author attribution, and public publishing.
- Added repository checks for documentation reachability, source safety, package metadata, release-version consistency, and current Pi public API compatibility.

### Changed

- Rewrote the public README in Alan Guice's current repository style with plain-language examples for everyday work, software development, media creation, and system administration.
- Added a plain-language explanation of Pi's normal eager skill catalog and the context cost that Skill Orchestrator removes.
- Added clear documentation for groups, profiles, bounded global fallback, and recursive dependencies.
- Kept Pi-provided core modules as `"*"` peer dependencies, as required by Pi's package guidance.
- Configured the GitHub release workflow for npm trusted publishing with OIDC and package provenance.
- Moved development-history detail out of the main README so the top page stays focused on installation and use.

### Verified

- The production behavior remains the same as 0.1.24.
- The automated runtime regression suite passes before packaging.
- The npm package is built from the same repository tree used for the release checks.

## 0.1.24 - 2026-09-10

### Changed

- Audited compatibility against Pi `0.85.1` and current upstream Pi source.
- Changed Pi core peer dependency ranges to `"*"` so the running Pi installation supplies matching core modules.
- Added tests that reject unsupported deep Pi imports.
- Added checks for Pi's package manifest, Node.js minimum, and model-tool parameter schemas.

## 0.1.23 - 2026-09-10

### Changed

- Hardened native Pi skill-catalog stripping and residual-catalog detection.
- Made zero-eager-catalog behavior a required architecture rule instead of an optional setting.
- Preserved Pi's `disable-model-invocation` behavior during model-driven search.
- Hardened profile IDs, profile files, migration, atomic writes, fallback authorization, and terminal-safe metadata handling.
- Added regression coverage for large skill collections, profile/file safety, dependency cycles, missing dependencies, autocomplete isolation, and persistence errors.

## 0.1.22 - 2026-09-10

### Added

- Added active-first global fallback search.
- Added bounded outside-scope root authorization for model-selected fallback skills.

### Changed

- Groups and profiles became preferred discovery scopes instead of hard capability prisons.
- Switching scope clears old fallback authorization.

## 0.1.21 - 2026-09-10

### Changed

- Replaced the eager active-scope metadata catalog with a constant-size scope stub.
- Moved skill names and descriptions to lazy `skill_search` results.
- Made empty profiles expose zero automatic candidates.

## 0.1.20 - 2026-09-10

### Changed

- Changed groups and profiles to lazy candidate scopes.
- Group/profile activation stopped bulk-loading skill bodies.

## Earlier development builds

Versions before `0.1.20` were iterative development builds. They introduced the manager UI, groups, profile storage, dependency controls, command aliases, and autocomplete behavior that the later lazy-loading architecture now uses.
