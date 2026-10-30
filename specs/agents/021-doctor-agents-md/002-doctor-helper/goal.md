---
title: "Goal: /doctor:helper"
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
    packet_pointer: "agents/021-doctor-agents-md/002-doctor-helper"
    last_updated_at: "2026-10-30T12:40:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers:
      - "Waits on /doctor:sk-skill (packet sk-doc/075-doctor-sk-skill-command) landing on main"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-292-doctor-agents-md"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: /doctor:helper

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give the doctor family one read-only entry point that names the doctor command a described problem needs, and hand every writing command back to its own plan and yes.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | One route named `helper`, class `read-only`, reached bare or with free text after `--`. |
| D2 | The route manifest's trigger phrases are the only phrase table, and a vocabulary gap is fixed there. |
| D3 | A read-only pick runs in place; a writing pick is printed for the operator to run, and the helper never emits a flag. |
| D4 | The helper skips its own entry and every local-only name, and reports a count only. |
| D5 | The held-out set is frozen before tuning and pinned by sha256, and the accuracy bar is top-1 0.80, top-3 0.90, negatives 0.90. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node .skilled/commands/doctor/scripts/doctor-helper-match.cjs -- "my pre-commit hook keeps rejecting my commit"` exits 0 and its first candidate line starts `1) /doctor:git hooks`
- [ ] `node .skilled/commands/doctor/scripts/doctor-helper-match.cjs -- "write me a poem about cats"` exits 1 with last line `STATUS=NO_MATCH FALLBACK=/doctor:setup`
- [ ] `node --test .skilled/commands/doctor/scripts/tests/doctor-helper-match.test.cjs` prints top-1 at least 0.80, top-3 at least 0.90 and negatives at least 0.90, and reports `fail 0`
- [ ] `node --test .skilled/commands/doctor/scripts/tests/doctor-helper-contract.test.cjs` reports `fail 0`, which proves every doctor router is reachable and the helper's derivation matches the deriver's
- [ ] `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 with the helper route at the re-measured route count
- [ ] `bash .skilled/commands/doctor/scripts/tests/run-all.sh` ends `0 failed`
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
| Specification, plan, tasks and criteria authored | Done | This packet's four documents |
| Baseline recorded | Done | `spec.md` section 2 quotes the route and test counts this packet moves |
| Implementation | Pending | Waits on the doctor sk-skill command landing on main |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | No work has run |
<!-- /ANCHOR:log -->
