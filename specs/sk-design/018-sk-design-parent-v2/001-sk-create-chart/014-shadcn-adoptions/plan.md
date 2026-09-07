---
title: "Implementation Plan: shadcn adoptions"
description: "Land the three shadcn adoptions phase 13 judged worth carrying as declared, checker-held contracts across the 26 standalone chart templates, without touching the decisions the research said to keep."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: shadcn adoptions

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Standalone HTML templates with inline SVG and script; Node for the checker |
| **Framework** | None; the checker forbids external resources |
| **Storage** | None |
| **Testing** | `scripts/check-corpus.cjs` static pass plus one mutation per new assertion; `--render` when a browser exists |

### Overview
Each adoption is one contract sentence in `template-contract.md`, one assertion in `check-corpus.cjs` proven by a mutation, and the template edits that satisfy it. Work proceeds assertion first: write the check, show it failing on a mutated copy, then bring the templates to pass, then the deliveries.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Static corpus and mutation checks passing (render-dependent checks recorded as unknown when the browser runtime aborts)
- [x] Docs updated (spec/plan/tasks, acceptance criteria, goal and implementation summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Template corpus with a single static checker as the binding contract.

### Key Components
- **Templates**: 26 standalone forms, each carrying `CHART_DATA`, a palette block and a geometry block
- **Checker**: `check-corpus.cjs`, retaining the existing assertion families while adding keyed-series and readout enforcement plus the curve-contract assertion

### Data Flow
A template declares its data, series keys, readout knobs and curve intent in sentinel blocks; the script reads them; the checker reads the same blocks and the markup and errors on disagreement.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `check-corpus.cjs` series-mapping, number-format and a new curve assertion | the binding contract | update | mutation fails before, corpus passes after |
| `template-contract.md`, `catalog.md`, `color-system.md`, six deliveries | how authors and readers see the contract | update | the references state each contract; deliveries pass the checker |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
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
| Static | every template and delivery | `check-corpus.cjs`, RESULT: PASSED |
| Mutation | one per new assertion | a mutated copy turns the run to FAILED |
| Render | card readouts and pointer reach | `check-corpus.cjs --render`; attempted here, but the available Chrome binary aborted before returning a document, so render-dependent results remain unknown |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 13 research record | Internal | Green | Defines the adoptions |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the checker cannot be made to pass without loosening an existing assertion
- **Procedure**: `git checkout HEAD -- .opencode/skills/sk-design/sk-design-chart` restores templates, checker and references together
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | read the contract and the checker |
| Core Implementation | Med | three assertions and about 30 files |
| Verification | Low | one checker run per assertion |
| **Total** | | **One implementation and verification session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) — N/A; this packet changes local static assets only
- [x] Feature flag configured — N/A; no runtime rollout surface exists
- [x] Monitoring alerts set — N/A; no deployed service is changed

### Rollback Procedure
1. Stop editing; the checker output names the assertion
2. Revert the scoped working-tree diff for the chart package through the conductor
3. `check-corpus.cjs` prints RESULT: PASSED again
4. Not user-facing

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A; no data or deployed state changes
<!-- /ANCHOR:enhanced-rollback -->

---
