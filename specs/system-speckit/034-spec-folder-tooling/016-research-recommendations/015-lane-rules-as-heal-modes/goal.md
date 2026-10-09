---
title: "Goal: lane-rules-as-heal-modes"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/015-lane-rules-as-heal-modes"
    last_updated_at: "2026-10-09T11:20:00Z"
    last_updated_by: "closeout-worker"
    recent_action: "Closeout pass 3: criteria checked against the gates"
    next_safe_action: "Commit with the D6 combined commit, then pin the SHA (CHK-FIX-007)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 86
    open_questions: []
    answered_questions: []
---
# Goal: lane-rules-as-heal-modes

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Automate the five deterministic lane rules (anchor wrap, link repoint, continuity placeholders, level from spec, header add) as permanent heal modes with derivability checks and idempotence tests.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Lane rules 3 (reconstruction) and 7 (status) stay reported, never automated, because both change what a document says. Rule 7 was confirmed by the operator on 2026-10-08 |
| D2 | Each mode must refuse when its derivability rule fails; refusal is recorded in the baseline |
| D3 | Per-folder validation after apply is the control for safety when touching many documents |
| D4 | Built in wave 5 by GPT-6 Luna max on the fast tier through cli-codex: `SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 codex -a never exec --model gpt-6-luna -c model_reasoning_effort="max" -c service_tier="fast" --sandbox workspace-write "<brief>" </dev/null`. One brief per task group in tasks.md, each naming its files and the check that proves it |
| D5 | Reviewed read-only by DeepSeek V4.1 Flash max through cli-pi on the LLM Gateway route with `--tools read,grep,find,ls`. The builder applies a finding only after confirming it in the code, for at most two rounds |
| D6 | The builder writes only the files in spec.md Files to Change, its tests and this folder. The orchestrator reverts any other write |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] All five modes (anchor-wrap, link-repoint, continuity-placeholders, level-from-spec, header-add) are implemented in `heal-spec-docs.cjs` with derivability checks and are called in sequence by `upgrade-legacy.mjs` repair flow
- [x] Each mode's refusal is recorded in the baseline file (upgrade-baseline.json) so a reviewer knows the transformation was not attempted (verifies D2)
- [x] `heal-lane-modes.vitest.ts` has 5+ test cases per mode: positive (transformation applied), negative (refusal recorded), and idempotence (second run changes nothing); minimum count: 15 passing tests across all five modes
- [x] Integration test in `upgrade-legacy.vitest.ts::all-modes-sequence` shows all five modes run in order without contradictions on a corpus fixture
- [ ] Per-folder validation after apply confirms safety: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <packet> --strict` returns RESULT: PASSED after each mode run (verifies REQ-004)
- [x] `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md` documents all five modes, each mode's exact derivability rule, and when each refuses
- [x] Existing test suite (`npm test` in system-spec-kit) passes with zero new failures; no regression in prior heal modes or upgrade-legacy behavior
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
| Spec and plan written | Done | specs/.../015-lane-rules-as-heal-modes/{spec,plan}.md validated --strict |
| Implementation | Pending | To be scheduled |
| Closeout note 2026-10-09 | Implementation and Tests are Done | The two rows above are the 2026-10-08 scaffold state. implementation-summary.md holds the current state, 19 of 19 acceptance rows Met |
| Tests | Pending | To be scheduled |

### Deviations and findings

| Item | Note |
|------|------|
| Builder route | DeepSeek V4.1 Flash on cli-pi and cli-devin, not the Luna route named in D4. See implementation-summary.md deviation 1 |
| Criterion 5 open | The criterion says `validate.sh --strict` passes after each mode run. The test that covers it, `all-modes-sequence`, checks the combined apply, and AC-016 is worded the same way. Left unticked for the parent to decide whether a per-mode check is needed. Closeout pass 3, 2026-10-09 |
| Lane rule 7 decided | 2026-10-08, the operator confirmed that summary status following spec.md stays reported and is never automated. The research had left open whether the status is a derived fact; it is an authored claim |
<!-- /ANCHOR:log -->
