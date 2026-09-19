---
title: "Implementation Plan: Phase 17: build-compiled-serving-gold-admission-checker"
description: "Build a read-only checker over compiledRoute() and playbook gold, fix its scoring in fixtures first, baseline the admitted hubs, then add CI and repair the flip step."
trigger_phrases:
  - "gold admission checker plan"
  - "phase 17 plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 17: build-compiled-serving-gold-admission-checker

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node CJS, matching the other `.skilled/bin` tools |
| **Framework** | None |
| **Storage** | None; reports are written to a path the caller names |
| **Testing** | `node:test` under `.skilled/bin/tests/`, run by the node gate |

### Overview
The checker is read-only. For each hub it loads the typed-gold scenarios from the hub's playbook, runs each prompt through `compiledRoute()`, bridges the targets to leaves with `qualifiedIdToLeaf` and the hub's `leaf-manifest.json`, and scores the result by fixed rules. Coverage floors then decide whether the hub has enough gold to be judged. Scoring is pinned in fixtures before the first live run, so the live corpus cannot shape the rules it is judged by.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The open questions in `spec.md` section 10 are answered
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A pure pipeline: load, evaluate, bridge, score, floor-check, report.

### Key Components
- **Gold loader**: reads frontmatter only; returns typed gold or a parse failure, never a silent empty.
- **Evaluator**: `compiledRoute(hubId, prompt)` from `014-runtime-engine/lib/compiled-route.cjs`; it bypasses the serving gate, so the flag and manifest do not affect the result.
- **Bridge**: `qualifiedIdToLeaf` from `sk-create-skill/scripts/lib/leaf-resource-contract.cjs`.
- **Scorer**: per-scenario status `pass`, `drift`, `broken` or `n/a`, with a sub-reason (`wrong-mode`, `missing-leaf`, `unsafe-route`, `silent-defer`, `stale-gold`, `parse-failure`).
- **Floor check**: coverage per declared workflow mode, from the hub's `mode-registry.json`.
- **Reporter**: stable-ordered JSON and Markdown, fitted and holdout apart.

### Data Flow
Playbook frontmatter → gold → `compiledRoute()` decision → bridged leaves → scenario status → hub verdict (`admitted`, `drift`, `broken`, `insufficient-coverage`) → report and exit code.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `compiled-route.cjs` | Engine | Unchanged; called | The checker's tests |
| `leaf-resource-contract.cjs` | Bridge | Unchanged; called | The checker's tests |
| Hub playbooks | Gold | Unchanged; read | Corpus pin |
| `routing-registry-drift.yml` | CI | Add a step | A CI run |
| `frozen-scorer-contract.cjs` | Flip gate | Repair, if chosen | Sandbox flip |

Required inventories:
- Callers of `compiledRoute`: `rg -n "compiledRoute\(" .skilled/bin`.
- Gold keys: `rg -n "^expected_(workflow_mode|leaf_resources|intent):" .skilled/skills/*/manual-testing-playbook`.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Loader, scorer and floor check against fixtures, one per status and sub-reason | `node:test`, run by the node gate |
| Integration | A live run on sk-doc, the hub with the most gold | `node:test` |
| Manual | `--all` over the five hubs; a sandboxed flip | CLI runs |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Answers to `spec.md` section 10 | Operator | Red | Build cannot start |
| `compiledRoute()` and `qualifiedIdToLeaf` | Internal | Green | None expected |
| Scorer at `system-skill-advisor/runtime/lib/scorer` | Internal | Green | Flip repair blocked |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The CI step blocks unrelated work, or the checker proves wrong.
- **Procedure**: Revert the CI step first, then the checker. Neither changes serving, so no hub is affected either way.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Decisions ──► Fixtures + scorer ──► Live run + baseline ──► CI (warn, then block)
                                                      └──► Flip repair ──► Runbook
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Decisions | None | Everything |
| Scorer | Decisions | Baseline |
| Baseline | Scorer | CI blocking |
| Flip repair | Decisions | Runbook |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Scorer and fixtures | Med | Half a day |
| Baseline and triage | Med | Half a day, more if gold has drifted |
| CI, flip repair, runbook | Low | A few hours |
| **Total** | | **One to two days** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] The CI step starts warn-only
- [ ] The flip repair is proven in a sandbox before it touches a live manifest
- [ ] Baseline report committed

### Rollback Procedure
1. Revert the CI step.
2. Revert the checker and its tests.
3. Revert the flip repair, which returns the flip to its current broken state.
4. Nothing user-facing changes, so no notice is needed.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
