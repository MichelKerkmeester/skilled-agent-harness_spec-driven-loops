---
title: "Implementation Plan: Phase 4: search-surface"
description: "One sk-doc dispatch extends the commit workflows catalog entry and adds a playbook scenario that proves the three queries, and the conductor runs the queries on a stamped fixture commit."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: search-surface

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown under sk-doc create-feature-catalog and create-manual-testing-playbook |
| **Framework** | sk-git feature catalog and manual testing playbook shapes |
| **Storage** | None |
| **Testing** | validate_document.py, the two package validators, the queries run on a fixture commit |

### Overview
Research showed plain git log answers every query, so no index is built. The catalog entry gains a subsection on commit identity and search, the playbook gains scenario GIT-044, and the conductor proves the queries on a commit stamped through both hooks in a fixture.
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
Documentation only

### Key Components
- **Catalog entry**: what commit identity is and how to query it
- **Playbook scenario GIT-044**: the operator contract that proves the queries
- **Quick reference**: the copy-paste queries, added in phase 003

### Data Flow
A reader starts at the catalog or the quick reference, runs one git log query, and gets the commit.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| none | docs only | unchanged | no code changed |

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
| Unit | none | - |
| Integration | a stamped commit resolves by packet, by id and by trailer extraction | fixture repo with the worktree hooks path |
| Manual | scenario GIT-044 | operator playbook |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| phase 003 hooks and allocator | Internal | Green | nothing to query |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a validator regression
- **Procedure**: revert the docs commit
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
| Setup | Low | 15 minutes |
| Core Implementation | Low | 25 minutes, one dispatch |
| Verification | Low | 10 minutes |
| **Total** | | **under one hour** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Not applicable
- [x] Not applicable
- [x] Not applicable

### Rollback Procedure
1. Revert the docs commit
2. Nothing else
3. Re-run validate_document.py
4. Not user-facing

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phase 1   │────►│   Phase 2   │────►│   Phase 3   │
│   Setup     │     │    Core     │     │   Verify    │
└─────────────┘     └──────┬──────┘     └─────────────┘
                          │
                    ┌─────▼─────┐
                    │  Phase 2b │
                    │  Parallel │
                    └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Dispatch | phase 003 | four docs | Proof |
| Proof | hooks | query output | closeout |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Dispatch** - 25 minutes - CRITICAL
2. **Fixture proof** - 5 minutes - CRITICAL
3. **Closeout** - 10 minutes - CRITICAL

**Total Critical Path**: 40 minutes

**Parallel Opportunities**:
- The dispatch ran beside the phase 003 closeout
- The phase 005 briefs were written during it
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Dispatch returned | four files VALID | 2026-09-11, done |
| M2 | Queries proven | three queries return the stamped commit | 2026-09-11, done |
| M3 | Committed | `98be1cebc2` | 2026-09-11, done |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: No index script

**Status**: Accepted

**Context**: The parent spec allowed an index generator if research showed plain git log was not enough.

**Decision**: None is built. Every query the format promises is one git log line.

**Consequences**:
- Nothing to maintain or re-run
- A cross-clone search still needs git; the GitHub search behavior stays unverified offline

**Alternatives Rejected**:
- A generated commit index file: a second copy of what git already answers

---

