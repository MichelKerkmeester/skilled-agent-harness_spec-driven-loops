---
title: "Goal: Phase 8: quality-packet-fixes"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "quality packet fixes goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/hub-architecture/006-sk-code-audit-remediation/008-quality-packet-fixes"
    last_updated_at: "2026-11-14T12:01:57Z"
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
# Goal: Phase 8: quality-packet-fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Close every `QL` ledger row with a proven fix or a recorded reason for no change.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|---|---|
| D1 | A row is fixed only when phase 001 marked it `Confirmed` or `Changed`. |
| D2 | No script source is split or refactored in this phase. |
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `grep -c '^| QL-.*| - |$' specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/findings-ledger.md` prints 0, so every row carries fix evidence or `no change`.
- [ ] `node --test .skilled/skills/sk-code/sk-code-quality/scripts/tests` passes.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/hub-architecture/006-sk-code-audit-remediation/008-quality-packet-fixes --strict --quiet` prints `RESULT: PASSED`.
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
| Phase 008 closed | Done | Code 3c7926322b. Six criteria Met. Eleven QL rows fixed here, QL-09 fixed in phase 005, QL-08 and QL-13 closed with no change. 15 DeepSeek V4.1 Flash dispatches through cli-pi |
| Edge cases | Recorded | No row was Refuted, so the empty case did not arise. Eleven rows were fixed in one commit, not one commit each, on the operator's commit policy. A dead path added to SKILL.md made the runner exit 1, and it exited 0 after the restore |
| Deviation: T005's verify prints a changelog hit as written | Recorded | The glob !changelog/** does not match from the repository root. With !**/changelog/** the command prints nothing and exits 1 |
| Finding outside the ledger: two sk-code-skilled files still cite CHK-CMT-07 | Open | js-css-style/verification-quick-reference-and-related.md line 87 and overview-header-and-comments.md line 42 name an id the style guide no longer carries. This phase may edit sk-code-quality only |
| Finding outside the ledger: four lines still say OpenCode | Open | README.md lines 26, 47 and 48 and the OpenCode JavaScript row of the load table in SKILL.md. Row QL-10 names OpenCode authoring only |

### Deviations and findings

| Item | Note |
|------|------|
| None so far | Nothing has diverged from the directive |
<!-- /ANCHOR:log -->
