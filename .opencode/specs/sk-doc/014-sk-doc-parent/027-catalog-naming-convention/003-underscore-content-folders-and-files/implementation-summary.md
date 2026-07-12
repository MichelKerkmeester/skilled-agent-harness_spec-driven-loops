---
title: "Implementation Summary: Underscore restyle of catalog/playbook content"
description: "Shipped hyphen->underscore migration of all catalog/playbook content folders and files repo-wide: a deterministic path-segment rename with in-lockstep reference sweep, fanned out across parallel agent branches and merged path-scoped, with zero tracked hyphenated residue."
trigger_phrases:
  - "underscore migration summary"
  - "catalog content renamed"
  - "hyphen to underscore summary"
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/003-underscore-content-folders-and-files"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/003-underscore-content-folders-and-files"
    last_updated_at: "2026-07-12T11:46:10Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Reconciled 003 to a completed Level-2 leaf; residual hyphenated tracked = 0"
    next_safe_action: "Commit path-scoped after strict validate"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-feature-catalog/assets/create_feature_catalog_auto.yaml"
      - ".opencode/skills/sk-doc/create-manual-testing-playbook/assets/create_manual_testing_playbook_auto.yaml"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Migration merged via merge commits 0659149d08 + b5afa1206c, each merging parallel agent branches"
      - "End-state verified: 0 tracked hyphenated content folders/files (excl z_archive); 2,032 tracked underscore .md content files present"
      - "50 hyphenated .md under system-deep-loop/deep-alignment/ are untracked concurrent-session files, not migration residue"
---
# Implementation Summary: Underscore Restyle of Catalog/Playbook Content

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-underscore-content-folders-and-files |
| **Completed** | 2026-07-12 |
| **Level** | 2 |
| **Actual Effort** | ~2 hours wall-clock (fanned out across 3 parallel agent branches) |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

Restyled every hyphenated catalog/playbook content folder and per-feature `.md` file to `underscore_case`, repo-wide
across all skills. `feature_catalog/mcp-tool-surface/read-path-freshness.md` became
`feature_catalog/mcp_tool_surface/read_path_freshness.md`. The transform is a pure `-`→`_` on path segments only;
skill/agent/command directory names and spec phase-folder names stay hyphenated by hard convention. Because no runtime
gate keys on the separator (the validator classifies leaves by the `feature_catalog`/`manual_testing_playbook`
parent-dir name; the Lane C loader selects scenario files by frontmatter), the migration was a mechanical rename plus a
path-scoped reference sweep, not a gate-neutralization problem.

### Files Changed

| File / Surface | Action | Purpose |
|----------------|--------|---------|
| `feature_catalog/<category>/**` + `manual_testing_playbook/<category>/**` (all skills) | Renamed | hyphen→underscore on folder + `.md` basenames |
| Root index tables (`feature_catalog.md` / `manual_testing_playbook.md`) | Modified | path rows rewritten in lockstep |
| `category:` frontmatter + markdown cross-ref links | Modified | reference sweep, path-scoped and word-boundary-safe |
| `create-feature-catalog` + `create-manual-testing-playbook` generators | Modified | emit `category_name` / `feature_name.md` (027 commit `7cc369f2ed`) |
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A deterministic rename engine enumerated the in-scope hyphenated content folders + `.md` files via `git ls-files`,
computed the `-`→`_` rename map on path segments only, and hard-aborted on any collision before writing. The work
fanned out across three parallel agent branches partitioned by skill family, each rewriting its own cross-skill
references in lockstep, then merged path-scoped: `b5afa1206c` (spec-kit/sk-code/cli-external/sk-prompt) and
`0659149d08` (deep-loop/mcp-tooling/sk-design + 4 more). Confidence came from the verified end-state rather than a
rename count: `git ls-files` finds **0** tracked hyphenated content folders/files under the in-scope surfaces
(excl `z_archive`) and **2,032** tracked underscore `.md` content files present, and the validator still types every
leaf because it keys on the parent-dir name (`validate_document.py:129,137`).
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Rename path segments only, never skill/agent/command/phase-folder names | Those are hyphen-only by hard convention; underscoring them would break routing + spec structure |
| Cite the verified end-state, not a rename count | The migration landed via merge commits whose renames live on the merged-in branches; `git ls-files residual = 0` + `2,032 underscore files` is stronger and directly verifiable |
| Leave the 50 hyphenated `.md` under `system-deep-loop/deep-alignment/` untouched | They are untracked (`??`) working files of a concurrent live session (0 tracked), not migration residue |
| Leave the 5 non-`.md` files hyphenated | `superset-notify.json`, `409-fixture.json`, 3× `setup-cp-sandbox.sh` are entangled with tests/hooks/frozen history |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Coverage | Notes |
|-----------|--------|----------|-------|
| Residual grep | Pass | - | `git ls-files '**/feature_catalog/**/*-*.md' '**/manual_testing_playbook/**/*-*.md'` (excl z_archive) = 0 tracked |
| Underscore end-state | Pass | 2,032 | tracked underscore `.md` content files present under the in-scope surfaces |
| Classification | Pass | - | `validate.sh --strict` keeps every leaf typed; validator keys on parent-dir name |
| Concurrent-session isolation | Pass | - | 50 hyphenated `.md` under deep-alignment confirmed `??` untracked, 0 tracked |
| Strict validate | Pending | - | `validate.sh --recursive --strict` on the 027 parent — see final gate |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-D01 | Pure `-`→`_` path-segment transform, agent-parallelizable | Fanned out across 3 branches, no coordination | Pass |
| NFR-S01 | Collision hard-abort + untracked files never staged | Map hard-aborts on collision; deep-alignment `??` files untouched | Pass |
<!-- /ANCHOR:nfr-verify -->

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Concurrent-session hyphenated files** — 50 hyphenated `.md` files under
   `system-deep-loop/deep-alignment/feature_catalog|manual_testing_playbook/` are a live session's untracked new
   files created with the old convention. They are out of scope here; a no-new-hyphen guard (part of the original
   phase plan, not built in this reconcile) would catch them if committed, or that session will land them.
2. **No standalone guard shipped** — the nominal `005` no-new-hyphen guard was not materialized as a separate phase;
   the convention generators (`7cc369f2ed`) now emit the underscore form, which prevents the common re-introduction
   path, but there is no CI gate yet.
<!-- /ANCHOR:limitations -->

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| 5 sub-phase folders (001-convention-docs … 005-validate-and-rebenchmark) | One fanned-out pass, no sub-phase folders | The deterministic `-`→`_` transform made a single parallel pass safe; sub-phase decomposition would have been ceremony without risk reduction |
| No-new-hyphen guard (phase 005) | Generator rewrite only (`7cc369f2ed`) | Generators are the primary producer of new content names; a CI guard remains a documented follow-up |
<!-- /ANCHOR:deviations -->
