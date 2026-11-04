---
title: "Goal: sk-design"
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
    packet_pointer: "sk-doc/066-skill-readability-refinement/007-sk-design"
    last_updated_at: "2026-11-04T08:10:38Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ae286a84-7880-4ce7-a5fe-7d1335e09c78"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: sk-design

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Every in-scope doc of `.skilled/skills/sk-design`, its root files, `shared/` and each mode, is refined for readability, layout and structure and committed as one release.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The `001-hub-and-shared` leaf owns the root files and `shared/`; each mode leaf owns only its mode folder |
| D2 | The skill is committed once, after every leaf passes, with a changelog entry and a matching `SKILL.md` and hub JSON version |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-hub-and-shared | `001-hub-and-shared/goal.md` |
| 002-sk-design-chart | `002-sk-design-chart/goal.md` |
| 003-sk-design-diagram | `003-sk-design-diagram/goal.md` |
| 004-sk-design-fundamentals | `004-sk-design-fundamentals/goal.md` |
| 005-sk-design-md-generator | `005-sk-design-md-generator/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/066-skill-readability-refinement/007-sk-design --recursive --strict` prints `RESULT: PASSED`
- [ ] `python3 .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py .skilled/skills/sk-design --check --strict` prints `Result: PASS`
- [ ] The `debt` object in `.skilled/skills/sk-doc/sk-create-skill/scripts/render-known-debt.json` holds no key that is `sk-design` or starts with `sk-design/`
- [ ] `git log --oneline 1af95fc818..HEAD -- .skilled/skills/sk-design` lists at least one commit, and `git status --porcelain -- .skilled/skills/sk-design` prints nothing
- [ ] `node --test .skilled/bin/tests/compiled-route-*.test.cjs` reports `fail 0`
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
| Goal authored | Done | `check-goal.cjs` run at authoring |

### Deviations and findings

| Item | Note |
|------|------|
| Criteria source | The Level 1 children carry no `acceptance-criteria.md`, so the criteria come from each `spec.md` success criteria and the parent phase handoff table |
<!-- /ANCHOR:log -->
