---
title: "Implementation Summary"
description: "The injection screen keeps its keep verdict at the new 0.6 flag line, with false positives down from 5 to 3."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/049-jev-feature-improvement-build/004-injection-screen-improvements"
    last_updated_at: "2026-10-03T12:00:00Z"
    last_updated_by: "claude-opus-5-5-049"
    recent_action: "Built, reviewed and verified the phase"
    next_safe_action: "None. The phase is Complete"
    blockers: []
    key_files:
      - ".skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs"
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
| **Spec Folder** | 004-injection-screen-improvements |
| **Completed** | 2026-10-03 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The injection screen keeps its keep verdict at the new 0.6 flag line, with false positives down from 5 to 3. It now refuses a corpus row that no longer matches its recorded commit or snapshot, and its report carries the trust package an operator needs to check the result.

### Phase 1: injection-screen-improvements

`score-injection-screen.mjs` asks Jev whether a section of fetched text tries to redirect an agent. It now refuses rows whose source no longer matches the recorded commit or snapshot digest, and records label, planted, snapshot, instruction and lexical hashes. The report prints comparator Brier, natural and planted recall apart, close calls and a hardened lexical comparator as a hybrid floor. Rows run two calls and a third only on disagreement, the flag line is 0.6, and an opt-in `--reworded-arm` scores a reworded question beside the original one, with a review-band question on rows whose mean falls from 0.25 up to the 0.60 flag line. A failed reworded call is reported on its own line and never erases the primary verdict.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs` | Modified | Corpus check, trust package, flag line, call protocol, comparator, question arms |
| `.skilled/skills/cli-classifier/benchmark/injection-screen/tests/score-injection-screen.test.mjs` | Modified | Corpus refusal, hashes, Brier, recall split, close calls, call protocol, reworded-arm failure |
| `.skilled/skills/cli-classifier/benchmark/injection-screen/README.md` | Modified | Corpus provenance and the new report fields |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Luna 6 max fast built it on cli-codex. A DeepSeek V4.1 Flash max review on cli-pi found a P1, untested refusals, which DeepSeek fixed. The first re-measure ran the reworded question as the primary one and returned kill. The session attributed that to the wording from the recorded calls, and DeepSeek restored the original question with the reworded one behind `--reworded-arm`. A Luna review of the final change found a P0: a failed reworded call dropped the completed primary verdict. DeepSeek fixed it with a test. The second re-measure keeps.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the original question as the primary arm | On the recorded calls the reworded question raised false positives from 5 to 15 at 0.5, so it stays an opt-in comparison arm |
| Report the reworded arm apart from the primary verdict | An opt-in side arm must never decide or erase the verdict the keep rule reads |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .skilled/skills/cli-classifier/benchmark/injection-screen/tests/score-injection-screen.test.mjs` | 49 passed (baseline 35) |
| Live re-measure, `--jev --reworded-arm --out ~/.skilled/.labels/runs/049-004-jev-20261003b` | exit 0 in 122 s, 371 calls (181 primary): `verdict jev: keep K=90 M=90 A=82 B=68 W=19 L=5 TP=30 FP=3 F=1 p=0.003305`, brier 0.0670, natural recall 0.600, planted 0.900 |
| Luna review of the final change | 1 P0 fixed (reworded failure erased the primary verdict), 1 P1 closed by this log |
| `validate.sh --strict` | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The baseline moved.** The hardened lexical comparator gives B=68 where 035 had 56, so W and L are not directly comparable to the 035 line.
2. **The reworded question loses.** `verdict jev-reworded: kill (precision) ... FP=11`, recorded and kept as an opt-in arm only.
3. **No new corpus slices.** Real-fetch, obfuscated and multilingual rows need new labels, per 003 D4.
<!-- /ANCHOR:limitations -->

---


