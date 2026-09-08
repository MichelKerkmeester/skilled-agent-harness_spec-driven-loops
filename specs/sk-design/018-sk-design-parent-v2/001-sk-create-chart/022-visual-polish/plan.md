---
title: "Implementation Plan: visual polish pass on the chart corpus"
description: "Six polish moves across the 33 corpus files, each with a checker assertion where one can hold it, built by GLM-5.3-Flash through pi and verified by the conductor with the render gate."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: visual polish pass on the chart corpus

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Standalone HTML, inline SVG and script; Node checker |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `check-corpus.cjs` static and `--render`; mutations per new assertion; captures read |

### Overview
Assertion first for the three new families, then one form moved to the full polish and passed through the gate, then the other forms one at a time with the checker after each, then deliveries, references, changelog, captures.
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
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Template corpus with a static checker as the binding contract

### Key Components
- **Templates and deliveries**: carry the six moves
- **Checker**: `source-line`, `finding-cue`, `table-disclosure`; geometry record updated

### Data Flow
`FINDING` and `READOUT.unit` sentinel blocks feed the footer and the card; the checker reads the same blocks and the markup.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| [producer/helper/policy] | [what owns the behavior] | [update/unchanged/not a consumer] | [grep/test/doc evidence] |
| [consumer/status/docs/tests] | [how it observes the behavior] | [update/unchanged/not a consumer] | [grep/test/doc evidence] |

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
| Static | every file | `check-corpus.cjs` |
| Render | card readout, pointer reach, settled render | `check-corpus.cjs --render` |
| Manual | three captures | read by the conductor |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| [System/Library] | [Internal/External] | [Green/Yellow/Red] | [Impact] |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the render gate cannot pass without a gate change
- **Procedure**: `git checkout HEAD -- .opencode/skills/sk-design/sk-design-chart`
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
| Core Implementation | High | 33 files, three assertions |
| Verification | Med | render gate, mutations, captures |
| **Total** | | **One long session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. Stop editing; the checker names the family
2. Revert the scoped diff
3. `check-corpus.cjs` prints RESULT: PASSED
4. Not user-facing

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

