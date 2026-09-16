---
title: "Implementation Plan: Phase 1: review-confirmed-findings"
description: "Close each confirmed finding at its producer, and narrow the resolver so the fix for one finding cannot introduce another."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: review-confirmed-findings

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (ESM) plus a CommonJS runner script |
| **Framework** | None |
| **Storage** | Git working tree, JSONL state and status ledgers |
| **Testing** | Vitest |

### Overview
The review found the defects; the verification pass found the defect in the first fix. The resolver initially matched any quoted suffix anywhere in a file, which credited a stem from a doc string and contradicted the checker's own stated rule. Narrowing it to the two shapes a call site uses keeps the rule true and leaves all twelve real emissions credited.
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
Fix at the producer, then verify the fix with a model that did not write it

### Key Components
- **Stem resolver**: Two call-site shapes, not a bare token
- **Ledger census**: Twelve spoken with named producers, forty-nine reserved with reasons
- **Playbook citations**: One declared root, one spelling
- **Parity censuses**: Both variants enumerate their auto-only sites

### Data Flow
Each finding is reproduced, fixed at its producer, then re-measured with the command that exposed it and re-checked by an independent pass.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Stem checker | Blind to interpolated emissions | resolve through call-site shapes | twelve spoken, zero credited from prose |
| Both ledger schemas | Seven stems wrongly reserved | declare spoken with producers | zero violations |
| sk-code playbooks | Forty-three citations missing a segment | rewrite to the declared root | zero unprefixed, zero double-prefixed |
| Feature catalog | Cited a deleted validator | remove | every remaining path resolves |
| Stress scenario | Prose contradicted its command block in two places | correct both | six trees named, six diffs expected |
| Research confirm census | No auto-only enumeration | enumerate | both variants carry the key |

Required inventories:
- Same-class producers: one guard, two schemas, seventeen playbook files, one catalog, one scenario, one workflow.
- Consumers: the release decision reading the census, and anyone following a citation.
- Residuals: per-site crediting in the resolver, and a registry glossary another session fixed.
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
| Unit | The corrected census and its twelve stems | Vitest |
| Control | A stem named only in prose is not credited | node |
| Gate | Contract drift, command references | node |
| Suite | Whole deep-loop runtime | Vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| None | - | Green | - |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The resolver misses a real emission shape
- **Procedure**: Revert this phase's commit; the census returns to its earlier numbers and the gap returns with it
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
| Setup | Low | minutes |
| Core Implementation | Low | one dispatch |
| Verification | Med | full suite run |
| **Total** | | **one dispatch plus one suite run** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. [Immediate action - e.g., disable feature flag]
2. [Revert code - e.g., git revert or redeploy previous version]
3. [Verify rollback - e.g., smoke test critical paths]
4. [Notify stakeholders - if user-facing]

### Data Reversal
- **Has data migrations?** [Yes/No]
- **Reversal procedure**: [Steps or "N/A"]
<!-- /ANCHOR:enhanced-rollback -->

---

