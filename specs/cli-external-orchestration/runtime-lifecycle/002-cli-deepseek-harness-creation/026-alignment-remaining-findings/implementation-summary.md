---
title: "Implementation Summary"
description: "The routing corpus pin matches main again, and the executor-selection, save and presentation docs, the benchmark labels and ENV-REFERENCE match the code."
trigger_phrases:
  - "alignment remaining findings implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/026-alignment-remaining-findings"
    last_updated_at: "2026-11-15T16:00:00Z"
    last_updated_by: "template-author"
    recent_action: "Recaptured the corpus pin and fixed the remaining alignment docs"
    next_safe_action: "Commit with the regenerated contracts and the baseline evidence"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-026-alignment-remaining-findings"
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
| **Spec Folder** | 026-alignment-remaining-findings |
| **Completed** | 2026-11-15 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The routing CI corpus gate scores again, because its holdout pin now matches the 64-row file on main. A reader of the review catalog now learns that every CLI kind but `cli-mistral-vibe` runs through `dispatch-iteration.cjs`, and that a non-native pass with no executor fails with `executor_missing`. The save docs and the save scenario now require `--full-auto`. Both deep presentations list `cli-mistral-vibe` as fan-out only, and the review one no longer says `:confirm` runs three kinds.

### Phase 26: alignment-remaining-findings

The holdout pin, its top-1 and top-3 numbers and the delegation bucket are recaptured in the recorded regime, and the discrepancy record gains a 2026-11-15 entry. The labeled and ambiguity evidence stays as it was, because both files and their scores are unchanged. ENV-REFERENCE gains a `CLAUDE_CODE_SESSION_ID` row, and two benchmark reports name packet `002-`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `routing-baseline.json`, `capture-scorer-eval-baseline.stdout.txt`, `capture-top3.json` | Modified | Recaptured pin and holdout numbers |
| `executor-selection-contract.md`, review `feature-catalog.md` | Modified | Dispatch branches, gateway, `executor_missing` |
| Review `memory-save.md`, research `feature-catalog.md`, the review save scenario | Modified | Full-auto save |
| Both deep presentations and both compiled contracts | Modified | Executor list, `:confirm` sentence |
| Two benchmark `source.md` reports | Modified | Packet label |
| `ENV-REFERENCE.md` | Modified | Claude session id |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The two holdout captures ran with an empty advisor DB dir, `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC=1`, `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1` and `VITEST=true`, the regime the baseline records. The corpus scorer ran too and matched its committed output. Each doc claim was read from `dispatch-iteration.cjs`, `deep-review.yaml` or `session-handover.cjs` first.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Leave the full-auto save probe on spec-kit | `state of a deep loop run` and `deep loop run state` kept the ratchets green but left spec-kit first, and `full-auto deep loop` moved the probe but failed two ratchet tests |
| Leave the OpenCode Go probe as an ordered bundle | The hub's tie-break order puts cli-opencode first when a prompt names two executors, and cli-deepseek-harness is in the bundle |
| Document `CLAUDE_CODE_SESSION_ID` in ENV-REFERENCE, not `.env.example` | Claude Code sets it, so an operator never does, and the other loop variables the token check named are already listed as loop-supplied |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Corpus pin step | `corpus matches the pinned baseline hashes` |
| Corpus floors (`score-routing-corpus.py`) | `"overall_pass": true`, output unchanged |
| `node scripts/check-contract-drift.cjs` | `[CONTRACT DRIFT] OK commands=2` |
| Playbook package, catalog package, markdown links | exit 0, exit 0, `0 broken` |
| README derived counts | 18 of 18 pass |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Two advisor probes keep their winner.** See Key Decisions. Neither is a misroute the routing corpus counts.
<!-- /ANCHOR:limitations -->

---
