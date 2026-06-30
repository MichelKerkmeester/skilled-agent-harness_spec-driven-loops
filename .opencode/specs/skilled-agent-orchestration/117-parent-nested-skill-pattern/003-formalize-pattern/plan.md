---
title: "Implementation Plan: Formalize the parent-nested-skill pattern"
description: "Implementation Plan for phase 003: the sk-doc section + templates, /create:parent-skill, /doctor:parent-skill, and the dogfooded routing/discovery benchmark — authored by parallel agents and orchestrator-verified."
trigger_phrases:
  - "formalize parent skill plan"
  - "phase 003 plan"
  - "create doctor benchmark plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/117-parent-nested-skill-pattern/003-formalize-pattern"
    last_updated_at: "2026-06-15T14:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored implementation plan for the formalization phase"
    next_safe_action: "Validate and commit scoped"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-155-003-formalize-pattern-implementationplan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Formalize the parent-nested-skill pattern

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (sk-doc + command docs), YAML (command/route assets), Node `.cjs` (doctor check), JSON (templates + benchmark fixtures) |
| **Framework** | sk-doc authoring, `/create` + `/doctor` command routers, deep-loop-workflows skill-benchmark mode |
| **Storage** | `.opencode/skills/sk-doc/`, `.opencode/commands/{create,doctor}/`, `.opencode/agents/` mirrors, the skill-benchmark fixtures dir |
| **Testing** | sk-doc validator, `/doctor:parent-skill` run (PASS/FAIL/negative), YAML parse, mirror parity, benchmark scorecard, comment-hygiene |

### Overview
Four additive deliverables formalizing the now-stable pattern, authored by three parallel agents (sk-doc; /create; /doctor) plus the orchestrator (benchmark + research reconcile + integration). Each output is independently verified before commit. No advisor/registry/skill behavior changes.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Pattern defined (`../research/research.md`) + implemented (`../002-advisor-routing-drift-guard`).
- [x] Existing surfaces to mirror identified (sk-doc templates, create trio, doctor route).

### Definition of Done
- [x] sk-doc §10 + 2 templates; validator clean.
- [x] /create:parent-skill + assets + registration + agent mirrors; YAMLs parse.
- [x] /doctor:parent-skill route + check; PASS on reference, FAIL on broken; hygiene clean.
- [x] Benchmark fixtures valid + advisor-probe routing 3/3 lexical (harness scores skill-id).
- [x] `validate.sh --strict` green on this phase (close-out).

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation + tooling around a stable pattern. Each deliverable mirrors an existing framework surface convention (no new mechanisms invented).

### Parallel Groups (worker fleet)
- **G1 (markdown agent)** — sk-doc section + templates.
- **G2 (markdown agent)** — /create:parent-skill command + assets + registration.
- **G3 (general agent)** — /doctor:parent-skill route + check script.
- **S1 (orchestrator)** — benchmark fixtures + scorecard, research reconcile, verification, metadata, commit.

### Read/Write Split
Agents author their non-overlapping surfaces (different dirs); the orchestrator authors the benchmark, reconciles research.md, verifies every output, and commits.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Gather the target shapes (sk-doc structure, create trio, doctor route, skill-benchmark fixtures).

### Phase 2: Core Implementation
- [x] T1 sk-doc §10 "Parent Skills with Nested Mode Packets" + hub/registry templates. (`sk-doc/references/skill_creation.md`, `sk-doc/assets/skill/parent_skill_*`)
- [x] T2 /create:parent-skill command + 3 assets + registration + 3 agent mirrors. (`commands/create/parent-skill.md` + assets)
- [x] T3 /doctor:parent-skill route + check script + workflow asset + router row. (`commands/doctor/`)
- [x] T4 Benchmark fixtures (5 mode scenarios) + routing-precision scorecard. (`skill_benchmark/fixtures/deep-loop-workflows/`)
- [x] T5 Reconcile research.md routingClass 3 → 4 (`../research/research.md`).

### Phase 3: Verification
- [x] sk-doc validator clean (0 new warnings); templates parse.
- [x] /create YAMLs parse; 3 agent mirrors consistent.
- [x] /doctor check PASS on deep-loop-workflows + negative-path proof; hygiene exit 0.
- [x] Benchmark fixtures valid; advisor-probe routing 3/3 lexical (harness scores skill-id).
- [x] `validate.sh --strict` on this phase folder (close-out).

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Method |
|-----------|-------|--------|
| Doc validation | sk-doc | `validate_document.py` (0 new issues vs HEAD) |
| Command integrity | /create | YAML parse + frontmatter parity + 3-runtime mirror parity |
| Validator behavior | /doctor | run on reference (PASS) + broken fixture (FAIL) + missing (exit 2) |
| Routing precision | Benchmark | advisor probe scorecard on the lexical-mode prompts |
| Hygiene | doctor `.cjs` | `check-comment-hygiene.sh` exit 0 |
| Structural | Spec docs | `validate.sh --strict` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `../research/research.md` | Internal | Complete | Defines the pattern the docs/tools describe |
| `../002-advisor-routing-drift-guard` | Internal | Complete | The advisorRouting block the docs/validator reference |
| Existing create/doctor/sk-doc conventions | Internal | Stable | Each deliverable mirrors them |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a validator fails, a YAML won't parse, the doctor check is vacuous, or `validate.sh --strict` errors.
- **Procedure**: `git restore` the modified files + `rm` the new ones (sk-doc templates, create command + assets, doctor script + yaml, benchmark fixtures). All additive; no data migration.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | research + 002 | Core Implementation |
| Core Implementation | Setup | Verification |
| Verification | Core Implementation | Epic close-out |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | gather shapes |
| Core Implementation | Medium | 4 deliverables across 4 surfaces (parallel agents) |
| Verification | Medium | validator + runs + parses + mirror parity + scorecard |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Each agent output independently verified before commit.
- [x] No advisor/registry/skill source touched (the doctor route only reads them).

### Rollback Procedure
1. **A deliverable diverges from the shipped code.** -> Reconcile the doc to the code (the `/doctor` check + drift-guard are the executable source of truth), or revert the doc.
1. **The /create update-branch behaves unexpectedly.** -> It is a documented extrapolation; revert to create-only if needed.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: `git restore` + `rm` the additive files; no data migration.

<!-- /ANCHOR:enhanced-rollback -->
