# Plan

Single-phase build of the URL slug utility.

## Phase 1 - Implement

Implement `slugify` in `src/slugify.js` covering all five requirements:
lowercasing, trimming whitespace, collapsing non-alphanumeric runs to single
hyphens, removing leading and trailing hyphens, and capping length at 60
characters. Verify against the three acceptance examples in `spec.md`, then
export the function as a CommonJS module with no external dependencies.

## Notes

Standalone utility; no build step, no integration, no configuration needed.
