---
title: "Goal: Doctor skill command: check and convert a skill to the Skilled format and wire it into the advisor"
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
    packet_pointer: "sk-doc/075-doctor-sk-skill-command"
    last_updated_at: "2026-10-30T06:40:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-281-doctor-skill-command"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Doctor skill command: check and convert a skill to the Skilled format and wire it into the advisor

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Ship `/doctor:sk-skill`, whose read-only `check` reports a skill's distance from the Skilled format and whose `convert` turns a plain or older Skilled skill into a standalone root wired into the advisor, mirrors and changelog, writing only after a printed plan and a yes.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | A description over 130 characters gets a proposed trim as its own routing change with its own yes. Without it convert stops before the format gate. Never trim silently. |
| D2 | Framework skills append advisor cases to `skill-advisor-regression-cases.jsonl`. Adopter skills write nothing there; convert writes their rows to the skill's own `benchmark/advisor-cases.jsonl` and prints the `--dataset` command that runs them. |
| D3 | Use the sk-code-skilled router resolver and parser in place; exit 2 with a named cause when absent. |
| D4 | An absent runtime dir is an n/a row and is never created. |
| D5 | Run `skill_graph_scan --trusted`; print `/doctor:skill-advisor rebuild` as the fallback, never run it unasked. |
| D6 | The convert workflow's agent step writes reshaped SKILL.md prose, bounded by the preservation check. |
| D7 | No default `allowed-tools`: propose `[Read, Grep, Glob]`, plus `Bash` when `scripts/` exists, and the operator confirms. |
| D8 | `/doctor:runtime-mirrors` gains `sync-skills-hermes.cjs --check` in its route and YAML (phase 009). |
| D9 | `skill-leaf-manifest-config-template.json` says "the router in the sibling ROUTER.md", not "in-SKILL.md router" (phase 009). |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-check-engine | `001-check-engine/goal.md` |
| 002-check-plumbing | `002-check-plumbing/goal.md` |
| 003-convert-legacy-skilled | `003-convert-legacy-skilled/goal.md` |
| 004-convert-plain-skill | `004-convert-plain-skill/goal.md` |
| 005-integration | `005-integration/goal.md` |
| 006-convert-plumbing | `006-convert-plumbing/goal.md` |
| 007-docs-and-changelogs | `007-docs-and-changelogs/goal.md` |
| 008-hub-gap-report | `008-hub-gap-report/goal.md` |
| 009-mirror-and-template-fixes | `009-mirror-and-template-fixes/goal.md` |
| 010-verification-and-release | `010-verification-and-release/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `validate.sh specs/sk-doc/075-doctor-sk-skill-command --recursive --strict` prints `RESULT: PASSED`
- [ ] `route-validate.sh` exits 0 with `/doctor:sk-skill` `check` and `convert` routes, and `tests/run-all.sh` reports all PASS
- [ ] `node --test` on `sk-skill-check.test.cjs` and `sk-skill-convert.test.cjs` exits 0
- [ ] After convert in a temp repo, `sync-skills-hermes.cjs --check` passes, `skill-graph-freshness.cjs --strict` exits 0 and `.skilled/changelog/<name>` resolves
- [ ] `doctor-phrase-reach.cjs` reaches `/doctor:sk-skill`, and a scratch convert prints a plan, then `CANCELLED` on no and `OK` on yes
- [ ] `grep -c 'in-SKILL.md router'` on the leaf-manifest config template prints 0 and `doctor-runtime-mirrors.yaml` invokes `sync-skills-hermes.cjs --check`
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
| Parent goal authored | Done | `goal.cjs packet` report recorded at authoring time |

### Deviations and findings

| Item | Note |
|------|------|
| Phases 009 and 010 | Not in the design's phase table; the operator added them when accepting D8, D9 and the release step |
<!-- /ANCHOR:log -->
