---
title: "Implementation Summary"
description: "Every chat candidate the five sweeps print now carries a deterministic evidence object, and every chat decision a save writes ends its why with an Evidence sentence. On the 7-pair fixture the save already chose the right entry before the change, so the evidence made the judgment visible; it is not shown to change it."
trigger_phrases:
  - "chat answer evidence implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/004-decision-capture/009-chat-answer-evidence"
    last_updated_at: "2026-11-03T11:40:00Z"
    last_updated_by: "orchestrator-closeout"
    recent_action: "Built and verified the chat-answer evidence; every acceptance criterion Met"
    next_safe_action: "Commit the phase and pin CHK-FIX-007"
    blockers: []
    key_files:
      - ".skilled/hooks/decision-capture/lib/chat-questions.mjs"
      - ".skilled/hooks/decision-capture/lib/chat-questions.test.mjs"
      - ".skilled/hooks/decision-capture/bin/sweep-transcript.test.mjs"
      - ".skilled/hooks/decision-capture/bin/fixtures/claude-chat-answers-extended.jsonl"
      - ".skilled/hooks/decision-capture/bin/fixtures/claude-chat-answers-extended.labels.json"
      - ".skilled/commands/speckit/save.md"
      - ".skilled/skills/system-spec-kit/feature-catalog/ux-hooks/operator-decision-capture.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2cdc1c20-d541-4a71-ba53-999a34105259"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-chat-answer-evidence |
| **Completed** | 2026-11-03 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A chat decision in `decision-record.md` now says why it was written. On the fixture, the pair 6 row's why reads `Not stated. Evidence: numbered_list, option not_applicable, overlap 3, imperative false, shift false.`

### Phase 9: chat-answer-evidence

`chat-questions.mjs` gained `answerEvidence(question, options, answer)` and seven frozen lexicons, and `chatCandidatesFromTurns` attaches its result as the last key of every candidate, so all five sweeps print it. The object holds five fields: `questionType`, `optionMatch`, `contentOverlap`, `imperativeOpening` and `topicShift`. Every value is an enum, a boolean or a count, and a candidate with no reply carries `evidence: null`. No code accepts or rejects a candidate. `save.md` step 3 now tells the model to read the evidence first, names the signals that usually mean new work, says `not_applicable` is no evidence against an answer, and requires every chat entry's `why` to end with the `Evidence:` sentence. The writer, the queue and the consumed log did not change.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/decision-capture/lib/chat-questions.mjs` | Modified | Seven frozen lexicons, `answerEvidence`, and `evidence` on every candidate |
| `.skilled/hooks/decision-capture/lib/chat-questions.test.mjs` | Modified | Whole-object case gains `evidence`; six edge cases and a null case |
| `.skilled/hooks/decision-capture/bin/sweep-transcript.test.mjs` | Modified | Whole-object case gains `evidence`; per-pair evidence on the 7-pair fixture; a shape test over the extended fixture |
| `.skilled/hooks/decision-capture/bin/fixtures/claude-chat-answers-extended.jsonl` | Created | 14 synthetic product pairs |
| `.skilled/hooks/decision-capture/bin/fixtures/claude-chat-answers-extended.labels.json` | Created | One label per pair, `answers` and `synthetic`; 9 positives |
| `.skilled/commands/speckit/save.md` | Modified | Chat rule reads the evidence and writes the `Evidence:` sentence; a chat entry with no stated reason writes `Not stated.` first |
| `.skilled/skills/system-spec-kit/feature-catalog/ux-hooks/operator-decision-capture.md` | Modified | Names the evidence object, the `why` sentence and that no code decides |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The planned worker, `gpt-6-luna`, hit its usage limit, so the detector and the tests went to `llmgateway/deepseek-v4.1-flash-1017` at max through cli-pi, the parent goal's D6 fallback. The worker first got pair 3 wrong until `use` counted as a choice verb, as the plan's STOPWORDS already listed; a check script then reproduced all ten expected rows of `plan.md` §3. The orchestrator wrote the `save.md` rule and the catalog text. Before the change, four scripted saves ran in `mktemp` projects: the real sweep, a headless `claude -p` given `save.md`'s chat rule, then `generate-context.js --full-auto`. After it, four more ran the same way, the last one also grepping the written record.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Evidence goes into `why`, not a new appendix field | `why` is already free text, so the writer, the input normalizer and the session types do not change |
| The model still decides every candidate | ADR-002 in `../007-gap-closure/decision-record.md` shows a lone candidate can be off-topic, so no field is a verdict |
| A chat entry with no stated reason writes `Not stated.` before the sentence | The old rule omitted `why` when no reason was stated, which would have dropped the evidence; pending answers keep the old rule |
| No reject-only filter | 14 labelled pairs cannot measure a false-reject rate |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Detector on the 7-pair fixture | PASS: `true` on all four candidates. Pairs 1, 3 and 7 imperative true, overlap 0, option not true; pair 6 `numbered_list`, `not_applicable`, 3, false, false |
| Hooks `node --test` over `lib`, `bin`, `claude`, `devin` | PASS: 119 tests, 119 pass, 0 fail, exit 0 (baseline 107) |
| Pi vitest | PASS: 10 of 10, exit 0 |
| OpenCode plugin test | PASS: 6 pass, 0 fail, exit 0 |
| Mutation checks in a scratch copy | PASS: pair 6 expected overlap set to 0 gave pass 25, fail 1; the `analy*` stem removed gave pass 35, fail 1 on the fixture test |
| sk-code quality gate, three code files, changed lines | PASS: `gate=NO_BLOCKER_FOUND exit=0`, findings 0 |
| Extended fixture | PASS: `jq` prints 14 pairs and 9 positives; positives cover all four question types |
| `save.md` rule | PASS: `clearly replies` gone; each field name and `Evidence:` present |
| Baseline scripted saves, pre-change | Four runs, each choosing exactly pair 6: three printed `chat_rows=1 pair6=1`; one writer failed in `withWorkflowRunLock` after the right choice |
| Scripted saves, changed code | PASS: three runs `save_exit=0`, `chat_rows=1 pair6=1 entries=1`, why ending in the sentence. Those three took the why from the model's entries and counted record rows by key; a fourth run grepped the record and found row Q009 with the sentence |
| Sweep time and determinism | `real 0.04` before and after on six alternating runs, at the timer's 0.01 s resolution; two sweeps byte-identical by `cmp` |
| This repository's state | No file written by this phase; `git status` on the folder shows only 008's README edit |
| `validate.sh --strict` | PASS: `Summary: Errors: 0  Warnings: 0`, `RESULT: PASSED`, after `repair-derived.cjs --apply` refreshed the generated metadata |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The outcome change is unproven.** All four baseline saves already chose pair 6 alone, so on this fixture the evidence made the judgment visible but did not change it.
2. **Small sample.** Three or four saves per side, all with one model, Claude through `claude -p`; other runtimes' save models were not scripted.
3. **The harness can flake.** One baseline run's writer failed inside `withWorkflowRunLock` after the model chose correctly; the after-runs did not repeat it.
4. **The reject-only filter stays deferred.** On the 14 synthetic pairs no answer opens with a new task and every non-answer has an imperative opening or a topic shift, but pair 11 names an option and is still a non-answer. That is an observation on synthetic data, not a measured rate, and no set size that would unblock the filter has been decided.
5. **Three adversarial inputs lack a named test.** A list marker before a verb, a shift phrase past word five and inline code inside an `or` question are probed but not committed as cases (`tasks.md` CHK-FIX-004).
6. **Not committed.** CHK-FIX-007 waits on the commit that lands this phase.
<!-- /ANCHOR:limitations -->

---
