---
title: "Implementation Summary: fanout containment sibling lineage scope"
description: "Fan-out write-containment now excludes sibling lineage directories from attribution, so a leaf tripping the guard can no longer revert a concurrent sibling's completed research artifacts."
trigger_phrases:
  - "fanout containment sibling scope"
  - "containment reverted sibling lineage"
  - "write containment concurrency bug"
  - "unattributableDirs implementation summary"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/003-write-containment-hardening/002-fanout-containment-sibling"
    last_updated_at: "2026-08-18T23:59:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Documented the landed sibling-exclusion containment fix"
    next_safe_action: "Commit the packet doc closeout"
    blockers: []
    key_files:
      - "runtime/lib/deep-loop/write-containment.ts"
      - "runtime/scripts/fanout-run.cjs"
      - "runtime/tests/unit/write-containment.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-042-fanout-containment-sibling"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: fanout containment sibling lineage scope

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-fanout-containment-sibling |
| **Status** | Complete |
| **Completed** | 2026-08-08 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A concurrent fan-out used to eat its own work. When one `cli-codex` lineage wrote outside its directory and tripped the write-containment guard, the guard reverted every file its sibling lineages had produced since dispatch, because it could not tell a sibling's concurrent write from the leaf's own. On a three-lane run this erased two completed research lineages. The guard now treats sibling lineage directories as unattributable: their writes are excluded from both detection and revert, while every other out-of-scope path stays fully guarded.

### Unattributable directory scope on the containment surface

The containment surface accepts an `unattributableDirs` option (`runtime/lib/deep-loop/write-containment.ts:72`). Each directory is resolved with the same repo-relative rules as `artifactDir` (`resolveArtifactScope`, `write-containment.ts:264-286`): anything that does not resolve to a repo-relative subpath is dropped rather than silently widening scope (`write-containment.ts:282`), and the leaf's own artifact dir passed as an exclusion is a no-op (`write-containment.ts:283`). Paths under an unattributable directory are skipped in the pre-dispatch snapshot (`snapshotOutOfScopeDirtyPaths` via `isUnattributable`, `write-containment.ts:290-293,328`) and in post-dispatch detection, so a sibling's files are never reported and never reverted.

### Fan-out worker passes sibling dirs on both calls

The worker computes `siblingLineageDirs` from every other lineage label and folds them into `containmentUnattributableDirs` (`runtime/scripts/fanout-run.cjs:2605-2612`). That same exclusion set is passed to the pre-dispatch snapshot (`fanout-run.cjs:2617`) and to `enforceWriteContainment` after dispatch (`fanout-run.cjs:2669`), so the baseline and the enforcement agree on what is out of scope.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/deep-loop/write-containment.ts` | Modified | Added `unattributableDirs` option, repo-relative resolution, and exclusion in snapshot + detect (`a3c9f03c51`, `568aa17a40`) |
| `runtime/scripts/fanout-run.cjs` | Modified | Compute `siblingLineageDirs`/`containmentUnattributableDirs`; pass on snapshot and enforce (`a3c9f03c51`, `568aa17a40`) |
| `runtime/tests/unit/write-containment.vitest.ts` | Modified | Concurrent-sibling regression block, 4 cases (`568aa17a40`) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The fix landed in two commits: `a3c9f03c51` introduced the sibling-exclusion option and worker wiring, and `568aa17a40` restored the preserve-never-delete behavior and made containment uniform across dispatch kinds. Verification is the `write-containment.vitest.ts` suite, which adds a dedicated `concurrent sibling lineages` block asserting that a sibling write is not reported, that a completed sibling's `research.md` survives a leaf tripping containment, that genuine out-of-scope repository writes are still caught, and that a non-repo-relative exclusion is ignored. The full suite runs green (`vitest run tests/unit/write-containment.vitest.ts` → 22/22 passing).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Exclude sibling dirs from attribution rather than serialize lineages | Under concurrency a sibling's write is genuinely unattributable to the leaf, and mis-reverting a completed run is strictly worse than leaving an untracked cross-lineage write in place |
| Drop exclusions that are not repo-relative subpaths | An absolute or `../` path must never widen scope or disable the guard for real repository writes |
| Preserve (never delete) not-in-HEAD out-of-scope writes | A path with no HEAD version may be a concurrent parent/sibling write this leaf cannot prove it owns, so it is logged as advisory instead of deleted |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `vitest run tests/unit/write-containment.vitest.ts` | PASS, 22/22 tests (includes 4-case concurrent-sibling block) |
| REQ-001 sibling write not reported | PASS, `write-containment.vitest.ts:473` |
| REQ-002 completed sibling artifact survives | PASS, `write-containment.vitest.ts:494-520` |
| REQ-003 genuine repo write still reverted | PASS, `write-containment.vitest.ts:523` |
| REQ-004 both worker calls receive exclusion set | PASS, `fanout-run.cjs:2617` + `fanout-run.cjs:2669` |
| REQ-005 non-repo-relative exclusion ignored | PASS, `write-containment.ts:282`; `write-containment.vitest.ts:541` |
| REQ-006 leaf's own dir is a no-op exclusion | PASS, `write-containment.ts:283` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Cross-lineage writes are now invisible, not blocked.** A leaf writing into a sibling's directory is unattributable under concurrency, so the guard leaves it untouched rather than reverting it. This is the accepted trade: not reverting is safer than erasing a sibling's completed work.
2. **The observed data loss is not recovered.** The fix prevents future reverts; the `research.md`, state log, and iteration files destroyed by the original failure are gone.
3. **Stray repository writes by a research lane still happen, just unreverted elsewhere.** The guard still catches and reverts genuine out-of-scope repository writes; a read-only research sandbox (open question in spec.md) would prevent them at the source.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr-rules.md
-->
