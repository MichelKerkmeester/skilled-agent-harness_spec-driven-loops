---
title: "Changelog: Code Graph Index Flag Deprecation [032/004]"
description: "Chronological changelog for removing the dead SPECKIT_CODE_GRAPH_INDEX_* maintainer-mode flag mechanism."
trigger_phrases:
  - "phase changelog"
  - "code graph index flag deprecation"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-08-07

> Spec folder: `specs/system-speckit/032-relocate-specs-folder/004-code-graph-index-flag-deprecation` (Level 2)
> Parent packet: `specs/system-speckit/032-relocate-specs-folder`

### Summary

A self-contained cleanup discovered mid-flight during phase 003's `scripts/` cleanup, not the relocation itself: `setup-maintainer-filters.sh`, a git clean/smudge filter that kept five `SPECKIT_CODE_GRAPH_INDEX_*` flags `"true"` locally while committing `"false"`, was dead infrastructure — none of its four target config files had carried those keys in a while. Landed in commit `af6e1b98a9`.

### Removed

- `.gitattributes` (entirely this filter's mapping) and `.opencode/skills/sk-git/references/config-content-filters.md` (entirely a description of the same filter) — both deleted.
- 5 dead `env.SPECKIT_CODE_GRAPH_INDEX_*` reads in `index-scope.ts`, plus the now-unreachable `'env'` fallback value and the `env` input field. Every fallback now goes straight to its safe default.

### Fixed

- Deleting the reference doc surfaced a dependency the scoping grep missed: `sk-git`'s own `leaf-manifest.json`/`leaf-aliases.json` still listed it. Fixed via the hub's own regeneration tooling rather than hand-editing the JSON.

### Verification

- `tsc --noEmit` 0 errors; `index-scope.vitest.ts` 8/8 unchanged; repo-wide grep for `SPECKIT_CODE_GRAPH_INDEX` returns empty outside historical spec docs.
- `ci-skill-root-metadata.cjs` fleet check: 11/11 at the time this phase closed. A later independent review (2026-08-08) re-ran it and found 10/11 — `system-skill-advisor`'s `leaf-aliases.json` had gone stale against `leaf-manifest.json`'s projection, a deliberate scope-lock decision this phase's own `tasks.md` already documented, not a new regression.
