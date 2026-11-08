---
title: "Goal: Phase 4: integration-review-and-docs-closure"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "integration review and docs closure goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/004-integration-review-and-docs-closure"
    last_updated_at: "2026-10-16T20:16:23Z"
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
# Goal: Phase 4: integration-review-and-docs-closure

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** The session relaunch loop closes with a verified cross-phase review, a complete documentation rollup, a live run on every runtime with an automatic trigger and a packet whose recorded state matches the repository.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | SWE reviews the union of changed files. Every P0 and P1 finding is confirmed by the orchestrator before any fix is dispatched. |
| D2 | Phase-specific docs stay in their own phases. This phase only rolls up the root README, the system-spec-kit README and the catalog and playbook indexes. |
| D3 | Every touched doc passes sk-create-quality-control and the Human Voice Rules scan. |
| D4 | Closure reconciles completion metadata across spec, tasks, implementation summary and goal files and leaves no task-created temporary output. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] The phase 004 review record lists zero open confirmed findings at any severity
- [x] The root README, the system-spec-kit README and the catalog and playbook indexes are updated, and each index matches its files on disk by name
- [x] Every touched doc passes `validate_document.py`, and `hvr_scan.py` is clean or each hit is justified
- [x] A live-run record exists for Codex and for Devin (`swe-2-max`); Hermes and Cursor carry the operator's skip
- [x] `validate.sh specs/hooks/023-session-relaunch-loop --recursive --strict` prints `RESULT: PASSED`
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
| Goal authored | Done | Orchestrator, 2026-10-16 |
| All five criteria met | Done | acceptance-criteria.md 5/5 Met; ../scratch/closure-evidence.md, Closure section |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | - |
<!-- /ANCHOR:log -->
