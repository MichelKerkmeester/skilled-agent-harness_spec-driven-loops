---
title: "Goal: /doctor:agents-md and /doctor:helper"
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
    packet_pointer: "agents/021-doctor-agents-md"
    last_updated_at: "2026-10-30T12:40:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-292-doctor-agents-md"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: /doctor:agents-md and /doctor:helper

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Ship `/doctor:agents-md`, which reports what the shipped template carries and embeds a repository's own instruction lines into one marked block without dropping one, and `/doctor:helper`, which names the doctor command that fits a described problem.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Phase 001 owns the root instruction files and phase 002 owns the route manifest read; neither phase writes a file the other phase's acceptance criteria name. |
| D2 | No phase starts implementation before `/doctor:sk-skill` (packet `sk-doc/075-doctor-sk-skill-command`) is on `main`, and every route, bridge, phrase and mirror count is re-measured on the branch the phase starts from. |
| D3 | Reuse what already ships with tests: the rule-copy canary for the delivery budget, the gate 1 pointer sync, the repo-rules checker and the exported three-way classifier. No second implementation of any of them. |
| D4 | Nothing is ever deleted or moved out of a repository's own text automatically; every write is a printed plan, one explicit yes and a recorded rollback. |
| D5 | Fixtures are synthetic. No consumer checkout, no operator-local skill or command name, and no real repository path reaches a tracked file. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-doctor-agents-md | `001-doctor-agents-md/goal.md` |
| 002-doctor-helper | `002-doctor-helper/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/agents/021-doctor-agents-md --recursive --strict` prints `RESULT: PASSED`
- [ ] `node .skilled/commands/doctor/scripts/agents-md-check.cjs` on this repository exits 0 and prints `STATUS=OK`
- [ ] `node .skilled/commands/doctor/scripts/agents-md-embed.cjs plan` on this repository prints `NOTHING TO DO` and exits 0
- [ ] `node .skilled/commands/doctor/scripts/doctor-helper-match.cjs -- "my pre-commit hook keeps rejecting my commit"` exits 0 and its first candidate line starts `1) /doctor:git hooks`
- [ ] `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 and its summary line names both new commands' routes at the re-measured count
- [ ] `node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js` exits 0 and `node .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs` prints `RESULT: PASSED`
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
| Packet authored from two approved designs | Done | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/agents/021-doctor-agents-md --recursive --strict` printed `RESULT: PASSED` at authoring time |
| Phase 001 | Pending | Five Level 2 children scaffolded, none started |
| Phase 002 | Pending | One Level 2 packet scaffolded, none started |

### Deviations and findings

| Item | Note |
|------|------|
| No implementation has run | Every completion criterion is unanswered; the packet records a plan, not a result |
<!-- /ANCHOR:log -->
