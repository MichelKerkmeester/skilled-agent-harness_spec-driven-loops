---
title: "Implementation Summary: iteration-state-record-contract"
description: "An iteration record that carries only `iteration` now passes the fan-out validator and renders its number in the review dashboard, because the one reducer line and the one template that still depended on `run` were brought onto the canonical field."
trigger_phrases:
  - "iteration contract summary"
  - "run field fix shipped"
  - "iteration record verification evidence"
  - "state record field continuation"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/013-deep-loop-alignment-review/016-iteration-state-record-contract"
    last_updated_at: "2026-09-16T19:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Verified the iteration-field change against the full runtime suite"
    next_safe_action: "Commit when the operator asks"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs"
      - ".opencode/commands/deep/assets/deep-research-auto.yaml"
      - ".opencode/skills/system-deep-loop/deep-research/references/state/state-jsonl.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "049-016-iteration-contract"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Is run or iteration the canonical iteration-record field?"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 016-iteration-state-record-contract |
| **Completed** | 2026-09-16 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A research lane that followed the deep-research state document to the letter was rejected after finishing all its work, because the document said `run` and the fan-out validator reads only `iteration`. The operator settled `iteration` as the canonical field. The work turned out to be smaller than the contradiction suggested: almost every writer and reader already used or accepted `iteration`, and the change brings the few that did not onto it.

### Phase 16: iteration-state-record-contract

The review dashboard now numbers each progress row from `iteration`, falling back to `run`, so a record that honours the contract no longer renders the word `undefined`. The one command template that still wrote `run` alone now writes both, so a failed iteration in a max-iterations run is counted instead of reported as a gap. The state documents now say what the validator already enforced.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` | Modified | Dashboard row reads the number through `getIterationRun()` |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/deep-review-state-reducer.vitest.ts` | Modified | Regression test for an `iteration`-only record |
| `.opencode/commands/deep/assets/deep-research-auto.yaml` | Modified | Error-path iteration record writes `iteration` beside `run` |
| `.opencode/commands/deep/assets/compiled/deep-research.contract.md` | Regenerated | Records the template's new hash |
| `.opencode/skills/system-deep-loop/deep-research/references/state/state-jsonl.md` | Modified | `iteration` required, `run` legacy, event records keep `run` |
| `.opencode/skills/system-deep-loop/deep-review/references/state/state-jsonl.md` | Modified | Same contract for review records |
| `.opencode/skills/system-deep-loop/deep-research/references/state/state-reducer-registry.md` | Modified | Reconstructed-record example uses `iteration` |
| `.opencode/skills/system-deep-loop/deep-research/references/convergence/convergence-reference-only.md` | Modified | Reference-shape example uses `iteration` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The field was inventoried before anything changed, which corrected the first sketch of the fix. That sketch named a blocked-stop heading that turns out to read event records, missed a second reducer and a template, and assumed the documents were the only writers. The regression test was written first and failed on `| undefined | dim-iteration-only |`; the reducer change made it pass. The template edit changed a hash recorded in the compiled contract, so the contract was regenerated and compared byte for byte against the compiler's output. The work ran on `skilled/v4.0.0.0` in the main checkout after confirming no fan-out run was active there.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep `run` beside `iteration` in the error template | The sibling deep-review template already writes both, and it keeps any reader that still expects `run` working |
| Leave event records' `run` alone | They name the iteration an event occurred in, and the decision concerned iteration records |
| Leave the research reducer's suppressed-candidate `run` alone | Nothing reads it, so an `iteration`-only record breaks nothing there |
| Leave `readIterationNumber()`'s preference for `run` alone | It only differs when a record carries both keys with different values, which no writer produces |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Regression test before the reducer change | FAIL, as expected: rendered `\| undefined \| dim-iteration-only \|` |
| Reducer suites, before and after | PASS: 22 passed before, 23 passed after |
| Whole deep-loop runtime suite | PASS: 154 of 154 files, 2,681 passed, 8 skipped, 0 failed |
| Compiled contract freshness | PASS: compiler output identical to the committed contract after regeneration |
| `validate_document.py` on the four documents | PASS: 0 issues each |
| Comment hygiene on the changed code | PASS: no findings; the checker flags a spec path in a control file |
| Leaf manifest freshness | PASS: 13 of 13 fresh |
| Trigger index entries for the four documents | PASS: identical in a freshly generated index |
| Run-only writer search | PASS: none remain; the search flags the pre-change template |
| `node --check` and YAML parse | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No whole-suite baseline.** The runtime suite was only run after the change. It shows no failures, so there is nothing to attribute, but no before-and-after comparison exists for it.
2. **The sk-code drift-guard wrapper fails on this tree independently.** Its alignment guard reports 929 dead resource-map paths, every one in a `.hermes/skills/*/SKILL.md` copy. This change edits no `SKILL.md` and adds or removes no file, so it cannot change that result.
3. **The committed trigger index is stale independently.** A fresh build adds 589 paths and drops 4; the entries for the documents changed here are identical.
<!-- /ANCHOR:limitations -->
