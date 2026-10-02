---
title: "Goal: Phase 44: deem-answer-shape-fix"
description: "Make cli-deem read the answer shape the real local Deem server sends, and make 027's and 026's scorers read judgment output at the depth real cli-deem and jev print it."
trigger_phrases:
  - "deem answer shape fix"
  - "cli-deem noul value"
  - "deem score level"
  - "judgment envelope depth"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/044-deem-answer-shape-fix"
    last_updated_at: "2026-10-02T06:02:32Z"
    last_updated_by: "orchestrating-session"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-044-deem-answer-shape-fix"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 44: deem-answer-shape-fix

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make every Deem and Jev judgment that the packet's scorers ask reach a measured answer on the real tools, by fixing where the code expects an answer shape the real tools never send.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The real tools are the contract. The local Deem server answers `noul` as `{"noul": <number>}` and `score` as `{"score": <number>, "probabilities": {"0": ...}, "legend": {...}}`, and real `cli-deem` and `jev` print the envelope `answers.answer`. Code and test stubs follow those shapes, and no fallback keeps the old `value` or `level` shape |
| D2 | Scope is the three readers that disagree with the real tools: `cli-deem`'s `translateAnswer`, 027's stop rater (both arms) and 026's completion-claim Deem arm, with their tests and the cli-deem docs that describe the shape. 043's record of the cause is corrected |
| D3 | Luna 6 max on cli-codex or SWE 2 max on cli-devin writes the code. The session verifies, documents and commits. One DeepSeek V4.1 Flash review on cli-pi: fix P0 and P1, record P2 |
| D4 | Checks against the local Deem server are allowed, since nothing leaves the machine. A live scorer run with `--deem` or `--jev` needs the operator's separate yes. Path-scoped commits, main only on the operator's go, no key in a file, no `.env` opened |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node --test .skilled/skills/cli-classifier/cli-deem/scripts/tests/cli-deem.test.mjs` passes more than 34 tests with 0 failing, with fake answers in the real shapes and cases where the old `value` and `level` shapes exit 1
- [ ] `node cli-deem.mjs noul`, `choice` and `score` against the local server at `127.0.0.1:8300` each exit 0 and print a number or a known key
- [ ] `npx vitest run tests/unit/score-stop-rater.vitest.ts`, run from `.skilled/skills/system-deep-loop/runtime`, and `npx vitest run tests/completion-claim-audit.vitest.ts`, run from `.skilled/skills/system-spec-kit/runtime`, pass more than 59 and 23 tests with 0 failing, and their stubs print the `answers.answer` envelope
- [ ] The DeepSeek V4.1 Flash review of these changes leaves no open P0 or P1
- [ ] `validate.sh --strict` prints `RESULT: PASSED` and `check-goal.cjs` prints `RESULT: PASSED (5/5 checks)` on this phase and on `specs/cli-jev/003-cli-jev-workflow-integration`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Cause found | Done | Two direct calls to the local server on 2026-10-02 returned `{"type":"noul","noul":0.9627,...}` and `{"type":"score","score":0.5808,"legend":{...},"probabilities":{"0":...}}`. `cli-deem.mjs:524` reads `answer.value` and its score path reads `answer.level`, so every real `noul` and `score` call exits 1. Its test fake answers in the shape the client expects, so the suite passed |
| Reach | Done | Every scorer reads `answers.answer.<field>` except 027's stop rater (`parsed?.score`, lines 1057 and 1345) and 026's Deem parser (`parsed?.noul`, line 721). Real `jev` prints the envelope too (`jev_cli/__init__.py` prints the whole result unless `--value`) |
| Baselines | Done | cli-deem 34 pass, 027 vitest 59, 026 vitest 23, all 0 failing |
| cli-deem fix | Done | Luna 6 max, brief `044a.md`, 1,078 s: `translateAnswer` passes `noul` and `score` through after a range check, and the fake server answers in the real shapes. Luna reported BLOCKED because its sandbox refused loopback binds (`listen EPERM`), so the session ran the suite: 38 pass (34 before), 0 failing. Against the local server: `health`, `noul` (0.9707), `noul --value`, `choice` (key `pay`, probabilities by key), `score` (1.0983, legend and index probabilities) and `score --value` each exit 0 |
| Scorer depth fix | Done | SWE 2 max, brief `044b.md`, 281 s: 027's two arms and 026's `parseNoul` read `answers.answer`, and their stubs print the envelope with an old-shape case that stays unmeasured. The session added one change: 027's Jev arm took only an integer score, but Jev answers an expected level as a float (its reference fake answers `n - 1.3`, and Deem answered 0.58), so the arm now rounds a float in range like its Deem arm. A float-answer test fails on the old check and passes now. 027 vitest 61, 026 vitest 24, 0 failing, census exit 0 and unchanged |

### Deviations and findings

| Item | Note |
|------|------|
| 043's record blamed the server | 043's log and implementation summary say the Deem server answers `noul` with no number. It answers with a number in a field the client never read. This phase corrects that record |
<!-- /ANCHOR:log -->
