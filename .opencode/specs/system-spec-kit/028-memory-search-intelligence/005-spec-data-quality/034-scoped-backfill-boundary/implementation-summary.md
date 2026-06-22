---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Status PLANNED. Scaffolded phase that will add an explicit scoped backfill boundary, make collection match the writer rules and isolate per-folder failures, and introduce one authoritative z_* exclusion helper with a descriptions.json guard, every behavioral fix behind a default-off flag or a grandfather report mode. No code change has landed."
trigger_phrases:
  - "scoped backfill boundary"
  - "backfill spec folder positional"
  - "collection matches writer rules"
  - "authoritative z exclusion helper"
  - "descriptions json z guard"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/034-scoped-backfill-boundary"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded the planned boundary and exclusion phase doc"
    next_safe_action: "Hold for implementation, no code change has landed yet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts"
      - ".opencode/skills/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/utils/index-scope.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-034-scoped-backfill-boundary"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 034-scoped-backfill-boundary |
| **Completed** | Not yet, status PLANNED |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Status PLANNED. This phase is scaffolded and not yet implemented. No code change has landed and nothing below has shipped. The section describes the change the phase will make once it is built.

### Scoped backfill boundary

The phase will add an explicit scoped boundary to the backfill CLI in `backfill-graph-metadata.ts`. Today the CLI ignores a positional folder and defaults to the repo-wide root, then refreshes every collected folder, so a single-packet intent silently walks the whole tree and dirties unrelated sessions' folders. The new boundary accepts a required positional target or `--spec-folder` that refreshes one packet only, rejects unknown args, validates the resolved folder through the supported-root checks, and keeps broad mode behind a default-off `--all` flag. The result is that a default run refreshes one packet and a repo-wide walk requires an explicit opt-in.

### Collection matches writer rules and isolates failures

The phase will make collection match the writer rules and isolate per-folder failures. Today collection admits candidates whose `graph-metadata.json` path fails `canClassifyAsGraphMetadataPath` and one corrupt folder aborts the whole run, which is the structural form of the z_future crash class. The new collection skips writer-rejected candidates during the walk and wraps each refresh so one corrupt folder reports skipped or failed without aborting, so an `--all` run is resilient to a single bad folder.

### Authoritative z_* exclusion helper and descriptions.json guard

The phase will introduce one authoritative z_* exclusion helper in `index-scope.ts` used at every traversal boundary, and apply it to the description scanner in `folder-discovery.ts` whose local skip list omits z_*. The by-design z_archive memory inclusion and the ARCHIVE_MULTIPLIERS deprioritization at `index-scope.ts:183-186` stay preserved through a separate generatedMetadata policy, so the unification closes the description-scanner gap without changing the documented memory behavior. The guard keeps a z_* prefixed folder out of the global `descriptions.json` cache.

### Default-off flag and grandfather report mode

Every behavioral fix will ship behind a default-off flag or a grandfather report mode, because existing files carry the prose statuses and prefixed paths the new contract rejects and a hard cutover would mass-fail them. The grandfather mode reports the existing offenders without failing the run, so the rollout is safe over the live tree and graduates only after a scoped migration.

### Files Changed

This table lists the planned changes. None have been applied.

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts` | Planned modify | Add the scoped boundary, reject unknown args, validate through supported-root checks, keep broad mode behind a default-off `--all`, match the writer rules in collection, and wrap each refresh to isolate failures |
| `.opencode/skills/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js` | Planned modify | Rebuild the dist so the scoped boundary and the failure isolation ship live |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts` | Planned modify | Apply the authoritative z_* exclusion helper to the description scanner whose local skip list omits z_* |
| `.opencode/skills/system-spec-kit/mcp_server/lib/utils/index-scope.ts` | Planned modify | Add the authoritative z_* exclusion helper and the separate generatedMetadata policy that preserves the by-design z_archive memory inclusion |
| `.opencode/skills/system-spec-kit/scripts/tests/scoped-backfill-boundary.vitest.ts` | Planned create | Prove the scoped boundary, the writer-rule match and failure isolation, and the unified exclusion plus descriptions.json guard |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. The planned sequence confirms the CLI default path, the writer rule, and the by-design z_archive policy first, then lands the scoped boundary and the failure-isolating collection on the CLI, then adds the authoritative exclusion helper and applies it to the description scanner, then rebuilds the dist so the change ships live. The vitest proving the single-packet default run, the unknown-arg and supported-root rejections, the corrupt-folder isolation, and the z_* prefixed folder refused by the scanner lands with the change, and every behavioral fix stays reachable behind a default-off flag or a grandfather report mode until a scoped migration graduates it.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Refresh one packet by default and keep broad mode behind `--all` | The CLI ignored a positional and walked the repo-wide root, so a default scoped run is the highest-leverage scope fix |
| Match collection to the writer rules and wrap each refresh | A writer-rejected candidate should never be collected, and one corrupt folder should report rather than abort the whole run |
| Introduce one authoritative z_* exclusion helper | The exclusion policy was split across four places and the description scanner omitted z_*, so a single source of truth removes the divergence |
| Preserve the by-design z_archive memory inclusion via a separate policy | The 031 verification confirms the z_archive memory inclusion is documented and intentional, not a bug, so the unification must not change it |
| Ship every behavioral fix behind a default-off flag or a grandfather report mode | Existing files carry the prose statuses and prefixed paths the new contract rejects, so a hard cutover would mass-fail the live tree |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

No verification has run. The checks below are planned and currently unmet. The planned proof is the new vitest plus a grep of the unified helper, and the planned docs gate is `validate.sh --strict`.

| Check | Result |
|-------|--------|
| A default run with one folder refreshes only that packet and touches no sibling | PLANNED, not yet run |
| A run without `--all` never walks the repo-wide root | PLANNED, not yet run |
| An `--all` run over a set with one corrupt folder isolates the failure and refreshes every healthy folder | PLANNED, not yet run |
| A z_* prefixed folder never enters the `descriptions.json` cache through the scanner | PLANNED, not yet run |
| A grep shows one authoritative exclusion helper rather than four divergent skip lists | PLANNED, not yet run |
| The grandfather report mode reports existing offenders without mass-failing the tree | PLANNED, not yet run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not implemented.** This is a scaffold. No code change has landed and no check has passed.
2. **Rollout precondition.** The behavioral fixes stay behind a default-off flag or a grandfather report mode until a scoped migration clears the existing prefixed-path and prose-status offenders, so the new contract does not graduate to default-on until then.
3. **Open boundary shape.** Whether the scoped boundary lands as a required positional target or as a `--spec-folder` flag is unresolved, with `--all` carrying the broad mode either way.
4. **Out-of-scope cluster.** The shared identity resolver, the merge-path lineage guard, the description idempotency, the status enum, the global-cache upsert, and the first-class validator are scoped to their own phases and do not land here.
<!-- /ANCHOR:limitations -->

---
