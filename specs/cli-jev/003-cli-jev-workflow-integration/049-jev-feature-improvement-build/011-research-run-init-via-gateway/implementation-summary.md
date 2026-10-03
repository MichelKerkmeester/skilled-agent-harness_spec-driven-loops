---
title: "Implementation Summary"
description: "A deep-research run now opens through the append gateway, so its first iteration projects instead of failing."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/049-jev-feature-improvement-build/011-research-run-init-via-gateway"
    last_updated_at: "2026-10-03T12:00:00Z"
    last_updated_by: "claude-opus-5-5-049"
    recent_action: "Built, reviewed and verified the phase"
    next_safe_action: "None. The phase is Complete"
    blockers: []
    key_files:
      - ".skilled/commands/deep/assets/deep-research-auto.yaml"
      - ".skilled/commands/deep/assets/deep-research-confirm.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-5-5-049"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-research-run-init-via-gateway |
| **Completed** | 2026-10-03 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A deep-research run now opens through the append gateway, so its first iteration projects instead of failing. A real fan-out lineage ran start to finish with no manual repair, which every Luna lineage in 048 needed.

### Phase 1: research-run-init-via-gateway

Both deep-research workflows used to start the state log with a flat config row written beside the ledger. The projection guard refuses any projection that drops that row's keys, so every run failed at its first gateway append. The init step now builds a `deep_research.run_initialized` event from the run's config and appends it through `append-mode-event.cjs`, which writes the projected config row itself. The stem census marks `run_initialized` as spoken by both workflows, and fan-out lineages open through the same step. This mirrors what packet `system-deep-loop/039-review-state-init-and-dispatch` did for deep-review.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/deep/assets/deep-research-auto.yaml` | Modified | Init step records run_initialized through the gateway |
| `.skilled/commands/deep/assets/deep-research-confirm.yaml` | Modified | Same change for the confirm variant |
| `.skilled/commands/deep/assets/compiled/deep-research.contract.md` | Modified | Source digests regenerated for the two workflows |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-types.ts` | Modified | Census row for run_initialized becomes spoken |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-run-open.vitest.ts` | Created | Runs the shipped init step end to end for both workflows and a fan-out lineage |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Luna 6 max fast built it on cli-codex in two dispatches, the first stopping at the Codex usage limit. DeepSeek V4.1 Flash max reviewed it on cli-pi: one P1, the stale compiled contract, which the session confirmed with `check-contract-drift.cjs` and regenerated. The session also applied the review's `${TMPDIR:-/tmp}` fix. A real one-lineage fan-out then proved the path end to end.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Mirror the deep-review run-open step | 039 already solved the same guard for review, so one pattern serves both modes |
| Regenerate the compiled contract in this phase | The contract records each workflow's digest, so a workflow edit without it fails the drift gate |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npx vitest run` on run-open, ledger-schema, projections-contract and check-contract-drift suites | 43 passed (baseline 28 on the first three) |
| `check-contract-drift.cjs` | `[CONTRACT DRIFT] OK commands=3` after regeneration; before it, `STALE_SOURCE_DIGEST` for deep/research |
| `check-ledger-stem-producers.cjs` | exit 0, run_initialized spoken (worker run) |
| Real fan-out, one DeepSeek lineage, 1 iteration | exit 0, state log reads config, iteration, synthesis_complete; `scratch/run-open-proof-state.jsonl.txt` |
| `validate.sh --strict` | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Lineage id source (review P2).** The init event takes `lineageId` from `lineage.parentSessionId` when set, while later events use the session id. Today `parentSessionId` is always null at init, so the two agree; a resumed-lineage path would need them aligned.
2. **Containment advisory on the proof run.** The runner reported `completed_with_containment_advisory` with 38 skipped paths, because other phases were editing the shared worktree at the same time. Nothing was reverted.
<!-- /ANCHOR:limitations -->

---


