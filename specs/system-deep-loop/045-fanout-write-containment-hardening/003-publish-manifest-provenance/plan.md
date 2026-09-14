---
title: "Implementation Plan: Record executor kind and model in the publish manifest so the attribution table stops reading unknown"
description: "Read the executor provenance the runner already persists beside each lineage and surface it in the attribution table and a label-keyed map on the merged registry."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Record executor kind and model in the publish manifest so the attribution table stops reading unknown

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
The merge's per-lineage loader reads `invocation-metadata.json`, takes kind, model and reasoning effort from its `effectiveConfig`, and keeps the old lookups as fallbacks. A helper builds a label-sorted `lineageExecutors` map that both merge outputs carry.
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
Loader plus pure projection helper

### Key Components
- **Per-lineage loader**: Reads registry, state log, iteration findings and now invocation metadata
- **buildLineageExecutors**: Label-sorted map of kind, model, reasoning effort
- **buildAttributionMd**: Prints kind and model per lineage

### Data Flow
Runner writes invocation metadata before dispatch; the merge reads it per lineage, threads the three fields through lineageData, and projects them into the attribution markdown and the merged registry.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Per-lineage loader | Sourced kind and model from absent records | update | tests at lines 1373 and 1412 |
| Merge outputs (research, review) | Carried no executor provenance | update | tests at lines 538 and 878 |
| Runner | Writes the provenance file | unchanged | four retained lineages hold it |

Required inventories:
- Consumers of the merge output: result-envelopes tests pass unchanged.
- Matrix axes: source (metadata, event, summary, none) x loop type (research, review).
- Invariant: existing registry fields are byte-identical.
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
| Unit | Loader read and fallback, both merge shapes | Vitest |
| Dry run | Temp copy of the retained research directory | fanout-merge.cjs |
| Manual | None | - |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| invocation-metadata.json per lineage | Internal | Green | Fallbacks apply |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Provenance must come from another source
- **Procedure**: Revert this phase's commit; the loader returns to the event and summary lookups
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

