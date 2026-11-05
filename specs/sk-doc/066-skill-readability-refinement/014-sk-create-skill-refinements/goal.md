---
title: "Goal: sk-create-skill readability refinements: render checks, strict gate, exempt map, rewrite guard and templates"
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
    packet_pointer: "sk-doc/066-skill-readability-refinement/014-sk-create-skill-refinements"
    last_updated_at: "2026-11-05T08:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "014-planning"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: sk-create-skill readability refinements: render checks, strict gate, exempt map, rewrite guard and templates

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** All 14 refinements in `scratch/review-report.md` ship, so sk-create-skill checks the render rules 066 enforced by hand, gates strictly, protects pinned docs, guards every rewrite and clears the fleet's render debt with no claim changed.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Executors run DeepSeek V4.1 Flash only, through `cli-opencode`, `cli-pi` or `cli-codex`, never Devin. A quota stop halts for the operator |
| D2 | The orchestrator reads every diff before commit, and an independent opus-medium review runs before each phase commit. A review pass alone closes nothing |
| D3 | Phases run in order: 001, then 002, then 003. A phase starts only after the one before it commits |
| D4 | Fleet changes are form only and every claim survives. Docs whose strings code pins sit in a `pinned` list, keep their render checks and are never rewritten without the operator |
| D5 | Work stays in worktree 315 with no push or merge without an operator instruction |
| D6 | New render codes and newly scanned scopes stay advisory under `--strict` until phase 003 clears the fleet. The ledger `debt` stays `{}` and its rule stays intact |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-render-checks-and-gate | `001-render-checks-and-gate/goal.md` |
| 002-exempt-and-rewrite-guard | `002-exempt-and-rewrite-guard/goal.md` |
| 003-templates-and-fleet | `003-templates-and-fleet/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/066-skill-readability-refinement/014-sk-create-skill-refinements --recursive --strict` prints `RESULT: PASSED` for the parent and all three children
- [ ] `RENDER_STAGED_CODES` and `RENDER_STAGED_SCOPES` in `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py` are empty, and the `debt` object in `.skilled/skills/sk-doc/sk-create-skill/scripts/render-known-debt.json` is `{}`
- [ ] `python3 .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py <skill> --check --strict` exits 0 for each of the 13 skills under `.skilled/skills/`
- [ ] `bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` prints `all sk-doc script tests passed`, and `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/*.test.cjs` reports `fail 0`
- [ ] `node --test .skilled/bin/tests/compiled-route-*.test.cjs` reports `fail 0`
- [ ] `.skilled/skills/sk-doc/shared/scripts/doc-rewrite-guard.py` exists, and `rg -n "render-known-debt-ratchet" .github/workflows/sk-doc-script-tests.yml` prints the ratchet step
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
| Planning docs | Done | parent spec and three child plans authored 2026-11-05 from `scratch/review-report.md` |
| 001-render-checks-and-gate | Pending | not started |
| 002-exempt-and-rewrite-guard | Pending | waits for 001 |
| 003-templates-and-fleet | Pending | waits for 002 |

### Deviations and findings

| Item | Note |
|------|------|
| Staging decision | The operator chose advisory until 003 on 2026-11-05: new codes and newly scanned scopes stay warnings under `--strict` through staged sets, the ledger `debt` stays `{}`, and phase 003 empties the staged sets. Recorded as 001 ADR-001 |
<!-- /ANCHOR:log -->
