---
title: "Implementation Plan: Phase 7: spec-kit-residue"
description: "[2-3 sentences: what this implements and the technical approach]"
trigger_phrases:
  - "implementation"
  - "plan"
  - "name"
  - "template"
  - "plan core"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 7: spec-kit-residue

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | [e.g., TypeScript, Python 3.11] |
| **Framework** | [e.g., React, FastAPI] |
| **Storage** | [e.g., PostgreSQL, None] |
| **Testing** | [e.g., Jest, pytest] |

### Overview
[2-3 sentences: what this implements and the technical approach]
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Decide against the delete list first, then implement only what survives it.

### Key Components
- **`decision-record.md`**: nine rulings, each read against 049 phase 003 §3 before any edit
- **`generate-context.ts` `main()`**: gains a defaulted project-root parameter bound into `CONFIG` before parsing, so a test can aim the save path at a throwaway workspace
- **The coverage-graph tests**: three repointed at `system-deep-loop/runtime/lib/coverage-graph/`, one deleted because its five handler imports were retired with no relocated equivalent
- **The sharded runner**: run to completion once so the residue is a count read from the run rather than an estimate

### Data Flow
A decision names its subject paths; each path is checked on disk and against the delete list; a surviving path gets its edit and its test run red then green; a deleted path gets a superseded note with the reason. The suite run then produces the residue, which is grouped by mechanism where the tree survives and counted by file where it does not.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `generate-context.ts` `main()` | Producer: resolves the packet and acquires its lock | update, defaulted third parameter | The CLI authority suite builds a temp packet and leaves `git status` clean |
| `CONFIG.PROJECT_ROOT` readers | Four downstream resolvers read the root from `CONFIG` | unchanged | `rg -n 'CONFIG.PROJECT_ROOT'` shows every reader; binding once upstream reaches all of them |
| `coverage-graph-*.vitest.ts` | Consumers of the moved coverage-graph modules | update, one import specifier each | 47 assertions collected where zero were before |
| `session-isolation.vitest.ts` | Consumer of five retired handler modules | deleted | No relocated equivalent exists for any of the five |
| `lib/coverage-graph-convergence.cjs` parity comment | Points at the pre-move handler path | update, comment only | The two repaired tests load it as their parity subject |

Required inventories:
- Same-class producers: `rg -n 'mcp-server/lib/coverage-graph' scripts/tests` found the four files, and no fifth.
- Consumers of changed symbols: `main()` has one caller, the module's own entry guard, and the test that now passes a root.
- Matrix axes: subject path in {surviving, inside the delete} by decision state in {implemented, superseded}; every ADR sits in exactly one cell.
- Algorithm invariant: no test writes into the real `specs/` tree; the write guard that rejected the archived packet is untouched.
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
| Unit | The repointed coverage-graph tests and the CLI authority suite | vitest through the workspace's own config |
| Integration | The whole sharded suite, run once to the end | `npm run test:sharded`, output redirected to a file and read |
| Manual | Each ADR's subject paths against the delete list | `049-memory-decommission/003-spec-memory-server-removal/spec.md` §3 and `ls` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Packet 049's delete list | Internal | Green at ruling time, 049 was Draft | A moved scope makes a superseded note wrong; the check date sits beside each |
| `system-deep-loop/runtime/lib/coverage-graph/` exporting every symbol the tests name | Internal | Green | The three repoints would collect zero tests again |
| Operator ruling on the two drifted assertions | Internal | Green, ruled: tests follow the producer, no deep-loop runtime code changes | The two tests stay red as findings |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a repointed test collecting zero assertions, or the CLI authority suite writing into the real `specs/` tree
- **Procedure**: `git checkout` the nine code files; the deleted test returns with its dead imports, which is the pre-phase state
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Rule (each ADR against 049) ──► Implement (ADR-005, ADR-008) ──► Run the suite ──► Group and count
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Rule | None | Implement |
| Implement | Rule | Run |
| Run | Implement | Group |
| Group | Run | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Rule | Med | Nine ADRs, each a path check and a reading |
| Implement | Med | Nine code files, all small |
| Run and group | High | 34m00s of suite time, then fifteen mechanisms traced to a file and a line |
| **Total** | | **Two sessions** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created: not needed, every change is a tracked file
- [x] Feature flag configured: none; the new `main()` parameter defaults to the current root
- [x] Monitoring alerts set: the CLI authority suite and the coverage-graph suites are the alerts

### Rollback Procedure
1. `git checkout` the four coverage-graph test files, the convergence library comment, `generate-context.ts`, and the three typed test files
2. `git checkout` restores `session-isolation.vitest.ts` with its dead imports
3. Re-run the CLI authority suite and expect the seven `process.exit(1)` deaths to return
4. Nothing user-facing changes, so no notification

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│     Rule     │────►│  Implement   │────►│  Run suite   │
│ 9 ADRs v 049 │     │ 005 and 008  │     │ 12 shards    │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                 │
                                          ┌──────▼───────┐
                                          │ Group, count │
                                          │ 31 and 150   │
                                          └──────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| ADR rulings | 049's delete list | Five superseded, two implemented, two ruled | Implement |
| Coverage-graph repoint | Rulings | 47 assertions back, two drifts named | Run |
| Injectable project root | Rulings | Seven tests green without touching `specs/` | Run |
| Suite run | Both implementations | 181 failures counted | Group |
| Grouping | Suite run | 15 mechanisms, 28 already ruled by ADR | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Rule every ADR against 049** - one session - CRITICAL
2. **Run the sharded suite to the end** - 34m00s wall - CRITICAL
3. **Trace the 31 surviving failures to fifteen mechanisms** - one session - CRITICAL

**Total Critical Path**: two sessions plus the suite's wall time

**Parallel Opportunities**:
- ADR-005 and ADR-008 implement independently once ruled
- The reference typecheck under a copied config runs while the suite runs
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Every ADR ruled | Nine rulings, each naming its paths and its check date | 2026-09-02 |
| M2 | The two surviving ADRs green | CLI authority 7 of 7, coverage-graph 60 of 60 | 2026-09-03 |
| M3 | Residue counted | 12 of 12 shards, 181 failures split 31 and 150 | 2026-09-03 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

The rulings live in `decision-record.md`: ADR-001 to ADR-009, five superseded by 049 with
the paths that prove it, two implemented, two ruled by the operator, and a ninth that rules
on the residue itself.

---


<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->
