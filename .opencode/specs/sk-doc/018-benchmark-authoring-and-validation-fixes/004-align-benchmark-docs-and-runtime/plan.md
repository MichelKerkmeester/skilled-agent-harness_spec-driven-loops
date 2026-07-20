---
title: "Implementation Plan: create-benchmark contract-drift remediation"
description: "Apply two operator-approved runtime changes (D5 hard-fail, alignment cap) with tests first, then reconcile create-benchmark + deep-alignment docs to the post-change truth via parallel agents, then verify."
trigger_phrases:
  - "create-benchmark contract drift plan"
  - "benchmark runtime alignment plan"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/018-benchmark-authoring-and-validation-fixes/004-align-benchmark-docs-and-runtime"
    last_updated_at: "2026-07-14T15:45:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the remediation plan"
    next_safe_action: "Apply runtime changes and tests"
    blockers: []
    key_files: []
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Implementation Plan: create-benchmark contract-drift remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown docs + Node/CJS runtime, vitest |
| **Framework** | system-spec-kit + sk-doc create-skill canon; deep-loop behavior/skill/model-benchmark runtime |
| **Storage** | Filesystem skill trees; no DB schema change |
| **Testing** | vitest (skill-benchmark, behavior-benchmark, Lane B), package_skill.py --check, validate.sh |

### Overview
Land the two operator-approved runtime changes with tests first (they define the contract truth), then reconcile every drifted create-benchmark doc and the deep-alignment package's own stale pointers to that truth, fanning the disjoint doc surfaces across parallel agents, then verify centrally.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Findings verified against real files (three-model audit + orchestrator re-check)
- [x] Runtime-vs-docs direction + spec folder operator-resolved
- [x] Contract values fixed (D5 exit 3; alignment cap 1500000)

### Definition of Done
- [x] All acceptance criteria met
- [x] Touched vitest suites pass incl. new D5 exit assertion; packager PASS; 0 new broken links
- [x] validate.sh --strict Errors 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Runtime-first (establish truth + tests), then disjoint-surface doc reconciliation, central verify-and-commit.

### Key Components
- **skill-benchmark runtime**: `run-skill-benchmark.cjs` D5 gate exit code.
- **shared behavior-benchmark framework**: the normative budget-cap contract.
- **create-benchmark docs**: authoring templates/guides/SKILL/README.
- **deep-alignment package**: its own index/scenario/baseline drift.

### Data Flow
The runtime is the source of truth; create-benchmark templates document how to author for it; deep-alignment consumes the framework contract. Fixes make all three agree.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `run-skill-benchmark.cjs` + tests | Lane C runner; returns 0 on D5 block | update | vitest asserts exit 3 on structural gate |
| `framework.md` | Normative budget-cap contract | update | `alignment` cap present; templates agree |
| `create-benchmark/**` | Authoring canon | update | package PASS; grep drift patterns 0 |
| `deep-alignment/behavior_benchmark/**` | Real DAB package | reconcile | stale pointers 0; links resolve |
| `deep-improvement/benchmark/*/*.json` | Frozen run history | unchanged | byte-identical |

Required inventories:
- D5 exit consumers: `rg -n 'run-skill-benchmark' .opencode --glob '*.cjs' --glob '*.md' --glob '*.yaml'`.
- Cap citations: `rg -n '300000|900000|1500000' create-benchmark deep-alignment`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Runtime (truth + tests)
- [ ] D5 gate exits non-zero (3) + skill-benchmark test
- [ ] `alignment` budget cap in framework.md (+ code/test if enforced)

### Phase 2: Doc reconciliation (parallel, disjoint)
- [ ] create-benchmark docs reconciled to post-change truth
- [ ] deep-alignment package stale pointers + lifecycle reconciled

### Phase 3: Verification
- [ ] package PASS + SKILL.md < 5000 words; 0 new broken links
- [ ] touched vitest suites pass
- [ ] validate.sh --strict Errors 0; commit + integrate
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | D5 exit code, budget cap | vitest |
| Static | Skill package conformance | package_skill.py --check |
| Link | Repo-relative + markdown links | resolver, grep |
| Spec | Packet integrity | validate.sh --strict |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| vitest (deep-improvement/shared) | Internal | Green | Runtime changes cannot be verified |
| `package_skill.py --check` | Internal | Green | create-benchmark packaging unverified |
| `validate.sh --strict` | Internal | Green | Packet integrity ungated |
| Operator direction (runtime change + folder) | External | Green | Resolved before work |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A gate regresses, a runtime change breaks a consumer, or a doc fix misstates the runtime.
- **Procedure**: Work lands as scoped commits on a dedicated branch integrated to `skilled/v4.0.0.0`. `git revert` the commit to restore; the runtime edits are small and localized. No non-git-reversible change.
<!-- /ANCHOR:rollback -->
