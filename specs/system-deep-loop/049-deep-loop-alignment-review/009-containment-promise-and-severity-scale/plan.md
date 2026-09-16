---
title: "Implementation Plan: Phase 8: containment-promise-and-severity-scale"
description: "Correct each promise to what the code does, state the shape-only contract where three different readers meet it, and report an out-of-scale severity instead of absorbing it."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 8: containment-promise-and-severity-scale

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
Each claim was checked against the code before editing. Where the promise and the mechanism disagreed, the promise was corrected, because the mechanism is load-bearing and changing it is a destructive behaviour change on shared checkouts. Where a check is weaker than a reader would assume, the contract now says so and names where the governing answer is computed. Where a value fell through a lookup, it is reported and attributed rather than given a rank the scale does not have.
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
Name one authority, make the losing site point at it

### Key Components
- **Containment promise sites**: Four, plus the guard's own docstring
- **Verdict contract**: Stated at the check, the hub document and the rendered prompt
- **Merge severity report**: Per lineage, finding and value, through the existing mismatch channel
- **Collapse rule**: Written where a rater reads it

### Data Flow
Each promise is matched against the mechanism it describes; the mismatched half is rewritten to point at the mechanism, and the one silent fallthrough becomes a reported one.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Containment comments | Promised revert, event and loud failure | correct the promise | no site claims a revert; the remedy authority is named |
| Confirm notes | Carried the same claim | correct the promise | the claim is gone from both |
| Guard docstring | Asserted a caller obligation no caller meets | correct | the assertion is gone |
| Verdict check | Shape-only, undocumented | state the contract | stated at three sites with different readers |
| Merge rank lookup | Zero default absorbed an out-of-scale value | report | warning emitted where the pre-change module emitted none |
| Compiled contracts | Staled by the edits | regenerate | the digest test accepts them |

Required inventories:
- Same-class producers: four promise sites plus one docstring, one rank lookup, three contract statements.
- Consumers: the orchestrating agent reading the YAML, the rater reading the prompt pack, and the release decision reading the merged registry.
- Residuals recorded not fixed: the runner's devin branch repeating the revert claim inside another session's executor tables, the reducer's severity normalizer dropping an out-of-scale finding silently, and the agent mirrors which the collapse rule does not reach yet.
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
| Unit | The out-of-scale report, its duplicate collapse, and an in-scale value still deciding the verdict | Vitest |
| Drift | Compiled contracts against their sources | node |
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

- **Trigger**: A corrected promise turns out to describe the wrong mode
- **Procedure**: Revert this phase's commit; the mechanism was never changed, only what is said about it
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

