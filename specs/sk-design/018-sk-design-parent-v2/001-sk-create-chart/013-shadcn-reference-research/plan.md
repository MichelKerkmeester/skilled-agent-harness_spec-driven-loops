---
title: "Implementation Plan: Phase 13: shadcn-reference-research"
description: "Six research angles run as one deep-research lineage against a frozen local shadcn corpus, producing cited findings and a sorted decision list; no template or checker changes."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: shadcn-reference-research

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown findings over TSX and HTML sources |
| **Framework** | The deep-research loop, one iteration per angle |
| **Storage** | `research/` under this packet |
| **Testing** | Citation check of every claim; `check-corpus.cjs` baseline read, not changed |

### Overview
Freeze shadcn's 70 charts and its chart machinery under `scratch/shadcn/`, then run six bounded angles in order, each reading the frozen copy and the shipped corpus and closing with ranked decisions tagged implementable today or needs a corpus change. The lineage record is the deliverable; the successor phase consumes it.
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
Research lineage: state, strategy, per-iteration findings and a final synthesis.

### Key Components
- **Frozen corpus**: `scratch/shadcn/chart.tsx` and 70 registry charts, read never vendored
- **Lineage record**: `research/lineages/luna/`, six iterations plus the synthesis in `research.md`

### Data Flow
Each iteration reads both corpora, writes its findings with citations, and the synthesis ranks every decision.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `assets/templates/*.html` | the shipped corpus | unchanged | read only, by contract |
| `scripts/check-corpus.cjs` | the binding contract | unchanged | baseline `RESULT: PASSED`, 35 files, 26 forms |

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
| Citation | every claim in `research.md` | file and line present, checked by reading |
| Integration | none; nothing under the chart skill changes | not applicable |
| Manual | reading each angle against its cited lines | the frozen corpus |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The frozen shadcn corpus under `scratch/shadcn/` | External source, local copy | Green | An angle cannot cite what it claims |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: none; the phase writes only research records
- **Procedure**: delete the lineage directory; nothing else moved
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
| Setup | Low | one extraction |
| Core Implementation | Med | six bounded iterations |
| Verification | Low | citation reading |
| **Total** | | **[e.g., 6-12 hours]** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes)
- [x] Feature flag configured
- [x] Monitoring alerts set

### Rollback Procedure
1. Nothing to disable; the corpus was not changed
2. Remove the lineage directory if its findings must be withdrawn
3. `check-corpus.cjs` still prints RESULT: PASSED
4. Not user-facing

### Data Reversal
- **Has data migrations?** [Yes/No]
- **Reversal procedure**: [Steps or "N/A"]
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
| [Component A] | None | [Output] | B, C |
| [Component B] | A | [Output] | D |
| [Component C] | A | [Output] | D |
| [Component D] | B, C | [Final] | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **[Phase/Task]** - [Duration estimate] - CRITICAL
2. **[Phase/Task]** - [Duration estimate] - CRITICAL
3. **[Phase/Task]** - [Duration estimate] - CRITICAL

**Total Critical Path**: [Sum of durations]

**Parallel Opportunities**:
- [Task A] and [Task B] can run simultaneously
- [Task C] and [Task D] can run after Phase 1
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | [Setup Complete] | [All dependencies ready] | [Date/Phase] |
| M2 | [Core Done] | [Main features working] | [Date/Phase] |
| M3 | [Release Ready] | [All tests pass] | [Date/Phase] |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: [Decision Title]

**Status**: [Proposed/Accepted/Deprecated]

**Context**: [What problem we're solving]

**Decision**: [What we decided]

**Consequences**:
- [Positive outcome 1]
- [Negative outcome + mitigation]

**Alternatives Rejected**:
- [Option B]: [Why rejected]

---


<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->
