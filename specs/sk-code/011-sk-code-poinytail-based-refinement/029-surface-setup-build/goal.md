---
title: "Goal: Surface setup build"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build"
    last_updated_at: "2026-10-13T19:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-029-parent"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Surface setup build

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Build the 028 surface setup recommendations R1 to R5, so an external user reaches a green sk-code battery from a fresh clone and one read-only doctor command names the repair for each failing leg.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | 001 builds first; 002 starts from origin/main once the operator has pushed 001, because it prints 001's repair texts |
| D2 | Never push and never merge into main; the operator merges |
| D3 | Out: the rejected ideas X1 to X11 of the 028 research, and the optional `worktree-naming.sh` usage retitle |
| D4 | External DeepSeek agents make every edit outside spec folders; a child's or reviewer's report is a claim, so rerun its criteria before calling it done; stop a child after three failed repairs of one symptom |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001 | `001-clone-path-and-messages/goal.md` |
| 002 | `002-doctor-sk-code-setup/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `P=specs/sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build; [ "$(cat $P/00*/goal.md | grep -c '^- \[ \] ')" = 0 ] && [ "$(grep -l 'completion_pct: 100' $P/00*/implementation-summary.md | wc -l | tr -d ' ')" = 2 ] && echo ok` prints ok.
- [ ] `P=specs/sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build; for c in $P $P/00*/; do node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs $c | tail -1; done | grep -c 'RESULT: PASSED'` prints 3.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build --recursive --strict` prints `RESULT: PASSED` 3 times and `RESULT: FAILED` 0 times.
- [ ] `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code >/dev/null 2>&1 && node .skilled/bin/compiled-route-guard.cjs >/dev/null 2>&1 && node .skilled/bin/compiled-route-sync.cjs --check >/dev/null 2>&1 && bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh >/dev/null 2>&1 && node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs >/dev/null 2>&1 && echo ok`, run on 002's branch, prints ok.

All commands run from the repository root.
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
| Planned 2026-10-13 | Done | create.sh phase mode, `--path`, `--level 2`, `--with-goal`, two children; traceability table in `spec.md` maps R1 to R5 to exactly one child each |
| 001 clone path and messages | In Progress | Branch `worktrees/133-surface-setup-build` |
| 002 doctor sk-code setup | Pending | Starts from origin/main once 001 is on it |

### Deviations and findings

| Item | Note |
|------|------|
| Level 2 for both children | 026 set the precedent: sk-create-goal's phase-parent workflow requires each child's `acceptance-criteria.md`, which Level 2 scaffolds |
| No phased grandchildren | Neither phase meets both thresholds of `phase-definitions.md` section 2 |
| 002 adds one check script | Recorded as 002 D2: the research file list has no script, and a YAML-only route leaves the probe verdict to an agent reading JSON, the F7 failure |
<!-- /ANCHOR:log -->
