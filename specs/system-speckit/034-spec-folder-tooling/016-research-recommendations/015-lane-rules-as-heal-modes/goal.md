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
    last_updated_at: "2026-10-08T12:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 0
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

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] All five modes (anchor-wrap, link-repoint, continuity-placeholders, level-from-spec, header-add) are implemented in `heal-spec-docs.cjs` with derivability checks and are called in sequence by `upgrade-legacy.mjs` repair flow
- [ ] Each mode's refusal is recorded in the baseline file (upgrade-baseline.json) so a reviewer knows the transformation was not attempted (verifies D2)
- [ ] `heal-spec-docs.vitest.ts` has 5+ test cases per mode: positive (transformation applied), negative (refusal recorded), and idempotence (second run changes nothing); minimum count: 15 passing tests across all five modes
- [ ] Integration test in `upgrade-legacy.vitest.ts::all-modes-sequence` shows all five modes run in order without contradictions on a corpus fixture
- [ ] Per-folder validation after apply confirms safety: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <packet> --strict` returns RESULT: PASSED after each mode run (verifies REQ-004)
- [ ] `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md` documents all five modes, each mode's exact derivability rule, and when each refuses
- [ ] Existing test suite (`npm test` in system-spec-kit) passes with zero new failures; no regression in prior heal modes or upgrade-legacy behavior
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
| Tests | Pending | To be scheduled |

### Deviations and findings

| Item | Note |
|------|------|
| Lane rule 7 decided | 2026-10-08, the operator confirmed that summary status following spec.md stays reported and is never automated. The research had left open whether the status is a derived fact; it is an authored claim |
<!-- /ANCHOR:log -->
