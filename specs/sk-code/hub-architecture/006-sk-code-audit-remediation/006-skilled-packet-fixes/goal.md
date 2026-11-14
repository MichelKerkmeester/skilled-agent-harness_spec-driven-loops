---
title: "Goal: Phase 6: skilled-packet-fixes"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "skilled packet fixes goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/hub-architecture/006-sk-code-audit-remediation/006-skilled-packet-fixes"
    last_updated_at: "2026-11-14T12:01:55Z"
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
# Goal: Phase 6: skilled-packet-fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Close every `SK` ledger row with a proven fix or a recorded reason for no change.

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

- [ ] `grep -c '^| SK-.*| - |$' specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/findings-ledger.md` prints 0, so every row carries fix evidence or `no change`.
- [ ] `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests` passes.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/hub-architecture/006-sk-code-audit-remediation/006-skilled-packet-fixes --strict --quiet` prints `RESULT: PASSED`.
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
| Phase 006 closed | Done | Code ac50644619. Six criteria Met. Twelve SK rows fixed here, SK-07 fixed in phase 005, SK-11 and SK-12 closed with no change. 19 DeepSeek V4.1 Flash dispatches through cli-pi |
| Edge cases | Recorded | No row was Refuted, so the empty case did not arise. Twelve rows were fixed in one commit, not one commit each, on the operator's commit policy. A dead path added to SKILL.md made the runner exit 1, and it exited 0 after the revert |
| Finding outside the ledger: check_readme_references.py fails on scripts/README.md | Open | Two paths on line 13 are unresolved, assets/scripts/verify-router-sync.cjs and assets/scripts/verify-doc-claims.cjs. They were unresolved before this phase |
| Finding outside the ledger: the playbook test table lists seven of nine test files | Open | router-file-resolver.test.cjs and router-replay-lib-resolver.test.cjs are missing from section 11 of the packet playbook |
| Finding outside the ledger: SKILL.md line 13 says OpenCode system code | Open | Row SK-09 names the README only, so the line is unchanged |

### Deviations and findings

| Item | Note |
|------|------|
| None so far | Nothing has diverged from the directive |
<!-- /ANCHOR:log -->
