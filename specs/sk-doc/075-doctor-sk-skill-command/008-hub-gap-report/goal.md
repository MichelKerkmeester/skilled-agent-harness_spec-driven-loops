---
title: "Goal: Phase 8: hub-gap-report"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "hub gap report goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/008-hub-gap-report"
    last_updated_at: "2026-10-30T05:21:19Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-hub-gap-report"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 8: hub-gap-report

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give `/doctor:sk-skill check` a read-only report of which of the 11 mode-integration surfaces a skill would still need under a given hub.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The report writes nothing; mode-into-hub conversion stays refused. |
| D2 | A row with no probe that ran prints UNKNOWN, never present. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `sk-skill-check.cjs check <mode> --into-hub <hub>` on a mode shipped in that hub prints 11 rows, none missing, and exits 0
- [ ] The same command on the fixture hub whose mode lacks `routerSignals` prints row 2 missing and exits 1
- [ ] `git status --porcelain` is identical before and after an `--into-hub` run
- [ ] `node --test .skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs` exits 0
- [ ] `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 with `--into-hub` in the check route's `allowed_flags`
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
| Phase planned | Pending | Spec docs authored 2026-10-30 |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | No work has started |
<!-- /ANCHOR:log -->
