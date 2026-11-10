---
title: "Goal: Phase 9: chat-answer-evidence"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "chat answer evidence goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/004-decision-capture/009-chat-answer-evidence"
    last_updated_at: "2026-11-03T11:40:00Z"
    last_updated_by: "orchestrator-closeout"
    recent_action: "Met every completion criterion"
    next_safe_action: "Commit the phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2cdc1c20-d541-4a71-ba53-999a34105259"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 9: chat-answer-evidence

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Every chat candidate the sweeps print carries deterministic evidence about its reply, and every chat decision a save writes shows that evidence, while the saving model keeps the judgment.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | No code accepts or rejects a chat candidate. The detector adds one nested `evidence` object with five fields, and the save model decides (ADR-002 in `../007-gap-closure/decision-record.md`). |
| D2 | The lexicons in `plan.md` §3 are frozen. `optionMatch` is `not_applicable` for open-value and numbered-list questions, and a bare "first" is never a topic-shift marker. |
| D3 | The evidence reaches the stored record only as one fixed-form `Evidence:` sentence at the end of the entry's `why`. The writer, the queue and the consumed log do not change. |
| D4 | The outcome is proven twice: a node test pins the fixture's evidence, and three scripted saves in a scratch project outside this repository must each write one entry, for pair 6. |
| D5 | A reject-only filter is deferred until a larger labelled set measures it. This phase grows that set; it ships no filter. |
| D6 | 009 starts after 008 closes. Implementation workers follow the parent goal's D6. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] The Measured Behavior detector command in `spec.md` prints `true` in the `evidence` column for all four fixture candidates.
- [x] `node --test .skilled/hooks/decision-capture/{lib,bin,claude,devin}/*.test.mjs` reports `fail 0` with more than 107 tests.
- [x] Three scripted scratch saves of the fixture each print `chat_rows=1 pair6=1`.
- [x] Every row of `acceptance-criteria.md` reads Met.
- [x] `validate.sh specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/009-chat-answer-evidence --strict` prints RESULT: PASSED.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Planning docs | Done | spec, plan, tasks and acceptance criteria filled 2026-11-03; lexicons probed on the fixture in the session scratchpad |
| Code baselines | Done | detector prints no `evidence` on 4 of 4 candidates; hooks suites `pass 107 fail 0` (spec Measured Behavior) |
| Baseline scratch saves | Done | Four pre-change runs, each choosing only pair 6: three printed `chat_rows=1 pair6=1`; one writer failed in `withWorkflowRunLock` after the right choice |
| Implementation | Done | Detector and tests by DeepSeek v4.1 flash through cli-pi (D6 fallback, Luna at its usage limit); `save.md` and the catalog by the orchestrator |
| Verification | Done | Hooks 119 of 119, Pi 10 of 10, OpenCode 6 of 6; three after-runs `chat_rows=1 pair6=1 entries=1`, a fourth found the `Evidence:` sentence in row Q009 of the written record |
| Sweep timing | Done | No pre-change `real` was recorded here; six alternating runs of the HEAD detector and the changed one each printed `real 0.04`; two sweeps byte-identical |

### Deviations and findings

| Item | Note |
|------|------|
| Outcome | The baseline already chose pair 6 alone, so the evidence made the judgment visible on this fixture; it is not shown to change it. |
| `save.md` omit-why line | A chat entry with no stated reason now writes `Not stated.` and then the `Evidence:` sentence; pending answers still omit `why`. |
| `Analyxe` case | Pinned by fixture pair 1 in `sweep-transcript.test.mjs`, not a unit case in `chat-questions.test.mjs`; removing the stem fails it. |
| `why` instead of an appendix field | The research allowed either. `why` needs no writer change; the appendix would touch the writer, the input normalizer and the session types. |
<!-- /ANCHOR:log -->
