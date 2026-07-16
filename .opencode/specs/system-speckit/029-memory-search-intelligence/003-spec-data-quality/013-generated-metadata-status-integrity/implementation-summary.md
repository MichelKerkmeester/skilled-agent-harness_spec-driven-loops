---
title: "Implementation Summary: Phase 10: generated-metadata-status-integrity"
description: "deriveStatus now gates 'complete' on real completion evidence instead of implementation-summary.md's mere presence, and a new report-mode-default validator rule catches the same disagreement in existing folders."
trigger_phrases:
  - "generated metadata status integrity"
  - "deriveStatus false complete fix"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/003-spec-data-quality/013-generated-metadata-status-integrity"
    last_updated_at: "2026-07-06T18:49:53.375Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Shipped and committed, operator accepted targeted verification"
    next_safe_action: "Decide separately on bulk-correcting the 213-folder backlog"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-phase-010-status-integrity-20260702"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "REQ-001/002 resolved by gating complete on completion_pct>=100 AND no open tasks.md items, with null completion_pct treated as unknown (never complete) plus a review flag."
      - "REQ-003/004 resolved by adding STATUS_COMPLETE_EVIDENCE_MISMATCH with its own independent rollout gate (SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE), default OFF/report-mode, so the existing 213-folder backlog does not immediately fail strict validation for other sessions."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 047-generated-metadata-status-integrity |
| **Status** | Complete |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`deriveStatus` used to mark a spec folder `complete` the moment `implementation-summary.md` existed, with zero regard for whether that doc actually said anything was done. A repo-wide sweep of 2,437 `graph-metadata.json` files found the class of defect this produced: dozens of freshly-scaffolded, never-implemented folders carried `status: complete` on disk today because the doc was a blank template, not because the work was finished. The fix gates `complete` on real evidence, and a new `validate.sh --strict` rule catches the same disagreement in existing folders without immediately breaking anyone else's validation run.

This doc's completion claim is backed by real evidence, not just its own presence, in keeping with the exact principle this phase's own fix enforces: the targeted 9-file suite ran fresh and green, the root cause of the full 815-file suite's multi-hour runtime was identified as an unrelated, by-design serial-execution config rather than a regression signal, and the operator explicitly reviewed that evidence and closed the phase on it rather than the claim being asserted unverified.

### deriveStatus Now Requires Real Evidence

When a folder has no `checklist.md` (the common Level-1 shape), `deriveStatus` now reads `completion_pct` from `implementation-summary.md`'s frontmatter and checks whether `tasks.md` still has unchecked items. `complete` requires `completion_pct >= 100` and zero open tasks. A folder with no parseable `completion_pct` at all derives a non-`complete` status with a review flag set, rather than defaulting to `complete` by omission, which was the exact mechanism of the original defect.

### A New Validator Rule Catches Existing Drift

`STATUS_COMPLETE_EVIDENCE_MISMATCH` cross-checks any stored `derived.status: complete` in `graph-metadata.json` against the same completion evidence, independent of whatever produced that status. It has its own rollout flag, `SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE`, defaulting OFF (report mode): a disagreement surfaces in `--strict` output but does not fail the run, because a repo-wide scan found 213 folders already carrying the false-complete status from the old defect. Turning that flag on enforces the check as a hard strict error once the existing backlog has been reviewed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` | Modified | Gated the `!checklistDoc` branch of `deriveStatus` on completion_pct/open-tasks evidence; added `parseCompletionPct`/`hasOpenTaskItems` as real exports. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts` | Modified | Added `assertStatusCompletionConsistency` and per-violation-code severity resolution in `resolveGeneratedMetadataIntegrity`. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts` | Modified | Added `SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE`, default OFF (inverse polarity from the other flags in this module). |
| `.opencode/skills/system-spec-kit/scripts/validation/generated-metadata-integrity.ts` | Modified | Wired the new flag into the CLI bridge `validate.sh --strict` actually calls. |
| `.opencode/skills/system-spec-kit/mcp_server/api/index.ts` | Modified | Exported the new violation code and flag through the shared API barrel. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts` | Modified | Fixed a test that pinned the old buggy behavior as "correct"; added 3 new tests for the null/low/open-tasks branches. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/generated-metadata-integrity.vitest.ts` | Modified | Added 5 new tests for the validator rule (report mode, enforced mode, and the genuinely-complete negative case) plus a flag-behavior test. |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modified | Documented the new flag in both the feature-flags table and the flat variable table. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Baseline first (9 files, 99 tests, all directly importing `deriveStatus`/`deriveGraphMetadata`/`checkGeneratedMetadataIntegrity`), then the code fix, then tests, then a full `tsc --build` across both TypeScript projects (`mcp_server` and `scripts`, which are composite project references, so `scripts` only sees `mcp_server`'s new exports after a rebuild). Manual smoke tests against real, currently-mislabeled folders in the repo (found via a live repo-wide scan, not synthetic fixtures) confirmed report mode stays non-blocking by default and enforced mode correctly fails. Mid-implementation, `orchestrator.ts` and `ENV_REFERENCE.md` were found to carry large, unrelated, uncommitted changes from other concurrently active sessions in this shared repo. `orchestrator.ts`'s own wiring was reverted entirely (its `resolveGeneratedMetadataIntegrity` call site still works correctly, just always in report mode, since the omitted parameter defaults to `false`) rather than risk disturbing that session's in-progress work; `ENV_REFERENCE.md`'s edits were isolated into the git index via a hand-built patch so only this phase's 4 additions get committed, leaving the other session's edge-confidence content untouched in the working tree.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Gate `complete` on `completion_pct >= 100 AND no open tasks`, not a broader heuristic | This is exactly the evidence the diagnostic review's D4-P0-001 finding named, and it reuses fields every canonical doc already carries (no new frontmatter contract needed). |
| Null `completion_pct` resolves to non-complete plus a review flag, never a silent default | Defaulting unknown state to `complete` was the original bug; defaulting it to `planned`/preserved-status with `reviewRequired: true` fails safe instead. |
| New validator check gets its own independent rollout flag instead of joining the existing `grandfather` flag | The existing flag already defaults to enforced; reusing it would have turned 213 already-mislabeled folders into new hard failures for every other session touching them the moment this shipped. A separate, default-OFF flag lets the check ship visibly (report mode) without that blast radius. |
| Reverted the `orchestrator.ts` wiring rather than attempt a partial commit of that file | A concurrent session's own large, unrelated, uncommitted feature (a validator-registry shell-rule bridge) was sitting in the same file. The safe default (report mode) already holds without the explicit wiring, so the completeness gap is minor and reversible later; disturbing another session's WIP is not. |
| `parseCompletionPct`/`hasOpenTaskItems` promoted to real exports, not left as `__testables`-only internals | The validator module needs the identical parsing logic `deriveStatus` uses, and duplicating the regex/parsing in two places would let them drift out of sync. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baseline (9 files touching `deriveStatus`/`deriveGraphMetadata`/integrity checks), before edits | PASS: 9 files, 99 tests |
| `npx tsc --build` (both `mcp_server` and `scripts` composite projects) | PASS: clean, no errors |
| Targeted suite after edits (same 9 files + the 2 test files' new coverage) | PASS: 9 files, 108 tests (99 baseline + 9 new) |
| Manual smoke: report mode (flag unset) against `.opencode/specs/ai-systems/009-prompt-improver-interface-design` (a real folder found via live repo scan, `completion_pct: 95`, open tasks) | PASS: `resolved.status: "info"`, exit 0 |
| Manual smoke: enforced mode (`SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE=true`) against the same folder | PASS: `resolved.status: "error"`, exit 1 |
| Full repo-wide `vitest run` across all 815 system-spec-kit test files | Started, then deliberately stopped (killed) after ~5 hours of real CPU time with an explicit operator decision. Root cause of the runtime found: `mcp_server/vitest.config.ts` sets `fileParallelism: false` on purpose ("Several script suites mutate shared process-level state and temp project roots. Run files serially so the combined config remains deterministic"), so all 815 files run strictly one at a time in a single worker regardless of the 18 CPU cores available - not a hang, not caused by this change, and not primarily machine contention. Given the 9-file targeted suite (every file that actually imports the changed functions) plus a clean full-project `tsc --build` already give strong evidence of no regression, and given the full run's architecture means waiting longer would not meaningfully add confidence about this specific change, continuing it was not worth the wall-clock cost. Not run to completion. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Found but did not fix: `create.sh --phase --phase-parent` corrupted the parent packet's own `description.json`.** Scaffolding this phase overwrote `029-memory-search-intelligence/description.json`'s `specFolder` (dropped its `system-speckit/` prefix), `description`, `keywords`, and `parentChain` (emptied) with this CHILD phase's own values, instead of leaving the parent's identity untouched. Reverted via `git checkout --` before committing; not investigated or fixed at the tooling level, since it is unrelated to this phase's own scope. Worth a follow-up look at `create.sh`'s description-generation call when adding a phase to an existing parent.
2. **`orchestrator.ts`'s `resolveGeneratedMetadataIntegrity` call site does not pass the new flag.** It always resolves the new check in report mode regardless of `SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE`, because a concurrent session had large, unrelated, uncommitted changes in the same file at implementation time and wiring the flag there risked disturbing that work. No correctness impact (report mode is the safe default), but the flag cannot be explicitly enforced through that code path yet. The `validate.sh --strict` CLI bridge, the actual path `validate.sh` uses, is fully wired.
3. **The 213 already-mislabeled folders on disk are not bulk-corrected by this phase.** That is a deliberately separate, deferred decision (see spec.md Out of Scope) since it touches content outside this phase's own surface area.
4. **The full 815-file repo-wide test suite was not run to completion.** It was deliberately stopped after ~5 hours once the root cause of its runtime was identified (serial-only execution by design, unrelated to this change) and the operator judged the already-strong targeted evidence sufficient. See the Verification table above for exactly what was and was not confirmed.
<!-- /ANCHOR:limitations -->

---
