---
title: "Implementation Summary: Deep Improvement Promotion Safety"
description: "Summary of the mirror-sync gate canonical-baseline remediation and its verification state."
trigger_phrases:
  - "deep improvement promotion safety summary"
  - "mirror sync gate canonical baseline summary"
  - "promote candidate mirror sync summary"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-agent-loops-improved/008-loop-systems-remediation/002-deep-improvement-promotion-safety"
    last_updated_at: "2026-06-29T14:00:00Z"
    last_updated_by: "claude"
    recent_action: "Implemented the mirror-sync canonical-baseline fix and regression test"
    next_safe_action: "Finalize the remaining 009 remediation phases"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/promote-candidate.cjs"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/tests/promote-candidate-mirror-sync.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-improvement-promotion-safety-2026-06-29"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Comparing mirrors against the candidate flagged every real body change as drift; comparing against the current canonical fixes the false positive."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `deep-loops/030-agent-loops-improved/008-loop-systems-remediation/002-deep-improvement-promotion-safety` |
| **Completed** | 2026-06-29 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The pre-mutation 4-runtime mirror-sync gate now verifies the runtime mirrors against the current canonical body rather than the candidate, so a legitimate in-sync agent-definition promotion is no longer blocked while genuine mirror drift still is.

### Mirror-Sync Baseline

In the agent-definition branch of `promote-candidate.cjs`, the gate reads the current canonical content from the target file and passes it to `verifyMirrorSync` as the expected body. When the target is absent — a new agent with no canonical yet — it falls back to the candidate, preserving the prior block-on-missing-mirrors behavior. The `verifyMirrorSync` and `evaluateMirrorSyncGate` helpers are unchanged.

### Regression Coverage

A new spawn-based test stands up a hermetic repo-root with three runtime mirrors and runs the real promotion CLI. The in-sync case asserts the candidate body lands on the canonical target; the drift case asserts a non-zero exit with the mirror-sync failure and an untouched target. The temp root is resolved through `realpathSync` so the spawned child's `process.cwd()` matches the target path and the agent-definition gate actually fires.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/promote-candidate.cjs` | Modified | Verify mirrors against the current canonical body, with a missing-target fallback. |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/tests/promote-candidate-mirror-sync.vitest.ts` | Created | Spawn-based in-sync-passes / drift-blocks regression coverage. |
| `.opencode/specs/deep-loops/030-agent-loops-improved/008-loop-systems-remediation/002-deep-improvement-promotion-safety/spec.md` | Modified | Authored concrete Level-1 specification. |
| `.opencode/specs/deep-loops/030-agent-loops-improved/008-loop-systems-remediation/002-deep-improvement-promotion-safety/plan.md` | Modified | Authored concrete Level-1 plan. |
| `.opencode/specs/deep-loops/030-agent-loops-improved/008-loop-systems-remediation/002-deep-improvement-promotion-safety/tasks.md` | Modified | Authored concrete Level-1 tasks. |
| `.opencode/specs/deep-loops/030-agent-loops-improved/008-loop-systems-remediation/002-deep-improvement-promotion-safety/implementation-summary.md` | Modified | Documented implementation and verification state. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The fix is a one-line change of the comparison baseline plus a missing-target guard, paired with a focused spawn-based regression. The in-sync case was confirmed RED against the pre-fix code before the baseline change landed, then GREEN after, and the full deep-improvement suite was rerun to confirm no regressions.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Compare mirrors against the current canonical body, not the candidate | The pre-mutation gate verifies the invariant on the state being replaced; a real promotion always changes the body, so a candidate comparison flags every legitimate change as drift. |
| Fall back to the candidate when the target is absent | Avoids a new crash path for a new-agent promotion while keeping the prior block-on-missing-mirrors outcome. |
| Leave `verifyMirrorSync` and `evaluateMirrorSyncGate` unchanged | The defect was the comparison baseline, not the verifier or gate logic; narrowing the call site is the minimal correct change. |
| Leave the no-phase legacy canonical mutation unchanged | The bare invocation mapping to the one-step `promote` mutation is documented design-intent, with `--phase=accept` / `--phase=ship` as the staged path. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baseline suite (before change): `cd .opencode/skills/deep-loop-workflows/deep-improvement/scripts && PATH=/opt/homebrew/bin:$PATH npx vitest run` | PASS: 32 files / 403 tests |
| RED before fix: `npx vitest run shared/tests/promote-candidate-mirror-sync.vitest.ts` against the pre-fix baseline | In-sync case FAILED (exit 1, MIRROR_SYNC_GATE_FAILED), confirming the bug |
| Syntax: `PATH=/opt/homebrew/bin:$PATH node --check .opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/promote-candidate.cjs` | PASS |
| GREEN after fix: `npx vitest run shared/tests/promote-candidate-mirror-sync.vitest.ts` | PASS: 2 tests |
| Full suite (after change): `PATH=/opt/homebrew/bin:$PATH npx vitest run` | PASS: 33 files / 405 tests (baseline 403 + 2 new, no regressions) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Mirror-sync is token-set based.** The gate inherits `verifyMirrorSync`'s normalized-token comparison; semantically equivalent bodies with different tokenization could still register as drift. This phase did not change that contract.
2. **New-agent promotions remain blocked at this gate.** With no canonical and no mirrors, the gate falls back to the candidate and blocks on missing mirrors, matching the prior behavior.
<!-- /ANCHOR:limitations -->
