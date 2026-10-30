---
title: "Goal: Phase 5: integration"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "integration goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/075-doctor-sk-skill-command/005-integration"
    last_updated_at: "2026-10-30T09:15:00Z"
    last_updated_by: "code-agent-worker"
    recent_action: "Built and tested the integration rows; recorded the deviation"
    next_safe_action: "Conductor wires applyIntegration into the convert apply path"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-281-doctor-skill-command"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 5: integration

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Wire a converted skill into the advisor, compiled skill graph, Hermes mirror and changelog index so it is reachable, not only format-valid.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Each integration row I1 to I6 is its own plan line and runs only after V8 passes. |
| D2 | The reach script's `--skill` flag is opt-in; its default fleet output does not change. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] In a temp repo with `HERMES_SKILLS_OUTPUT_DIR` set, `sync-skills-hermes.cjs --check` passes after convert
- [ ] In that temp repo with `SKILL_GRAPH_FRESHNESS_ROOT` set, `skill-graph-freshness.cjs --strict` exits 0 after convert
- [ ] `readlink .skilled/changelog/<name>` prints `../skills/<name>/changelog` for the converted skill
- [ ] `cmp` of the reach script's fleet output before and after the change prints nothing
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
| Phase planned | Pending | spec.md, plan.md, tasks.md authored |
| Integration rows built | Done | `lib/sk-skill-integrate.cjs`, 25 temp-repo cases in `tests/sk-skill-integrate.test.cjs` |
| Reach `--skill` flag | Done | one report row for a named root; default fleet report byte-identical to the golden recorded before the flag |
| Convert call site | Pending | the conductor adds `applyIntegration` to the convert apply path |

### Deviations and findings

| Item | Note |
|------|------|
| Rows live in a library, not inline in `sk-skill-convert.cjs` | The plain-skill phase owns the convert script and its test file in parallel, so an inline V9 would have put two phases on the same files. The conductor wires the call; `implementation-summary.md` holds the record. |
| `package_skill.py` needed no change | It already accepts `.jsonl` under `benchmark/`, proven by the strict package check passing with the file present. |
| `skill-root-reader-inventory.test.cjs` fails on `sk-skill-check.cjs:568` | Pre-existing in this worktree and untouched by this phase: the flagged file and the inventory are both unmodified, and the reach script is not named. |
<!-- /ANCHOR:log -->
