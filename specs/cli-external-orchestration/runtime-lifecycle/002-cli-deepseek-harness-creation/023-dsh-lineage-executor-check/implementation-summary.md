---
title: "Implementation Summary"
description: "The post-dispatch gate now checks a CLI fan-out lineage against the invocation-metadata.json the fan-out runner writes, and the documented validator takes the iteration_start row on a log with no ledger."
trigger_phrases:
  - "dsh lineage executor check implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/023-dsh-lineage-executor-check"
    last_updated_at: "2026-11-15T10:30:00Z"
    last_updated_by: "template-author"
    recent_action: "Built and verified the phase"
    next_safe_action: "Release the phase with a changelog and a version bump"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-023-dsh-lineage-executor-check"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 023-dsh-lineage-executor-check |
| **Completed** | 2026-11-15 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A CLI fan-out lineage no longer passes the executor check by default. It passes when the runner's `invocation-metadata.json` names the executor its config names, and it fails with `executor_missing` when that file is missing or names something else.

### Phase 23: dsh-lineage-executor-check

`verify-iteration.cjs` still recognizes a lineage by the same three signals. For a lineage with a non-native configured kind it reads `effectiveConfig.kind` from `invocation-metadata.json` in the artifact directory and compares it with that kind. A missing, unreadable or kindless file fails with a detail that names the file, and another kind fails with a detail that names it. A native lineage and a lineage whose config has no executor block stay unchecked, because nothing names a non-native executor there. `validateIterationOutputs` now takes the executor from the iteration's `iteration_start` row on any log, so both checks read the same rows.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs` | Modified | `lineageInvocationKind` and the lineage branch of `checkExecutorProvenance` |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/post-dispatch-validate.ts` | Modified | The opening-row check drops its ledger condition and the unused `ledgerModeFor` import |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/verify-iteration.vitest.ts` | Modified | The lineage exemption case becomes three lineage cases |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/post-dispatch-validate.vitest.ts` | Modified | The no-ledger opening-row case |
| `.skilled/commands/deep/assets/deep-review.yaml`, `deep-research.yaml` | Modified | The `executor_missing` sentence in each `command_note` |
| `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown`, `deep-research.contract.markdown` | Regenerated | Only the source digest line changed in each |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The script at `e263e5481e7` ran first on scratch copies of two real DeepSeek Harness lineages and passed every iteration, the copy with no metadata file included. The baseline suite ran before any source edit. The gate, the validator, the tests and the workflow sentence went in next, then the fail-first run with both source files put back at `HEAD`, the real copies again, the typecheck, the drift check and the full suite. Nothing was committed, and the changelog and version bump are left to the caller.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Check a lineage only against `invocation-metadata.json` | A lineage skips the pre-dispatch audit, so no state-log row names its executor. The runner writes the file in the pool worker before every spawn, retries and resumes included |
| Keep a native lineage and a lineage with no executor block exempt | They return before the lineage branch, as they did before, because nothing names a non-native executor there |
| Exempt no salvage, dry-run or older lineage | Salvage runs after the lineage exits in the folder that already holds the file and never runs the gate. The runner has no dry-run mode. An older folder cannot be told from a current one whose file is missing, and no live path reaches it |
| Reuse `executor_missing` for a kind mismatch | A new reason would change both workflows' reason lists for a case the detail already names |
| Pair every passing lineage case with a failing control | The old script passes every lineage, so each case asserts the shape without metadata fails before asserting the passing one |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Touched files | PASS. `verify-iteration.vitest.ts` prints `41 passed (41)`, up from 39. `post-dispatch-validate.vitest.ts` prints `31 passed (31)`, up from 30 |
| Fail first | PASS. With both source files at `HEAD` the two files printed `4 failed \| 68 passed (72)`, every failure an assertion |
| Real lineage copies | PASS. All five `dsh-1` review iterations and all five `deepseek-1` research iterations exit 0. The `dsh-1` copy with no metadata file exits 1 with `executor_missing` |
| Typecheck | PASS. `npm run typecheck` exit 0 |
| Contract drift | PASS. `[CONTRACT DRIFT] OK commands=2` after the regeneration, two `STALE_SOURCE_DIGEST` lines before it |
| Full deep-loop suite | PASS. `Test Files  177 passed (177)` and `Tests  3013 passed \| 9 skipped (3022)`, exit 0, against a baseline of `3010 passed \| 9 skipped (3019)`, no failure in either |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A lineage folder that predates the metadata file fails if an old iteration is checked again.** A survey of the 681 lineage configs under `specs/` found 314 that name a non-native kind with no metadata file beside them. The gate runs only on a new iteration of a live run, so a running loop is not affected.
<!-- /ANCHOR:limitations -->

---
