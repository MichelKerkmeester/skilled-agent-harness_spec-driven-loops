---
title: "Goal: Phase 4: vocabulary-single-source"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "vocabulary single source goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/hub-architecture/006-sk-code-audit-remediation/004-vocabulary-single-source"
    last_updated_at: "2026-11-14T12:01:53Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 4: vocabulary-single-source

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make a vocabulary mismatch between the hub's copies fail a guard.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|---|---|
| D1 | Extend the existing guard. No generator is built in this phase. |
| D2 | No keyword changes in this phase. |
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] With one keyword removed from `code-frontend-aliases` in a scratch copy of the hub, the router-sync guard exits non-zero and names `hub-router.json`.
- [ ] On the unmodified tree, `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` prints PASS for the router-sync leg.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/hub-architecture/006-sk-code-audit-remediation/004-vocabulary-single-source --strict --quiet` prints `RESULT: PASSED`.
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
| Spec, plan, tasks and acceptance criteria authored | Done | Written on 2026-11-14 from the audit evidence in `../001-finding-verification/` |
| Implementation | Pending | Not started |
| Phase 004 closed | Done | Code 9a9bbb76aa. Five criteria Met, AC-006 Superseded by ADR-001. Row H1 carries fix evidence and row H7 records the sk-code-ci difference. 8 DeepSeek V4.1 Flash dispatches through cli-pi |
| Edge cases | Recorded | sk-code-skilled is left off vocabularyMirrors, so the three-way match skips it and its alias rule passes. The 162 frontend keywords compare as sets, so order does not matter |
| Deviation: the comparison lives in check 2 | Recorded | ADR-002. A sixth leg would change the 5/5 total and the leg list about twenty documents quote, two of them outside the hub |

### Deviations and findings

| Item | Note |
|------|------|
| None so far | Nothing has diverged from the directive |
<!-- /ANCHOR:log -->
