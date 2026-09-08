---
title: "Implementation Plan: deep research on the external reference library for visual upgrades"
description: "Run the deep-research fan-out runner with two CLI lineages over one five-angle brief, then synthesise across lanes."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: deep research on the external reference library for visual upgrades

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | The deep-loop fan-out runner; codex and pi CLIs |
| **Framework** | `/deep:research` workflow, fan-out path |
| **Storage** | Lineage state under `research/lineages/` |
| **Testing** | Orchestration summary, per-lineage state logs, the synthesis read against the captures |

### Overview
One brief, two lineages: GPT-5.6 Luna on codex at max reasoning and the fast tier, GLM-5.3-Flash on pi through the DevPass gateway at max thinking, five iterations each under a `max-iterations` stop policy at concurrency two. The conductor then reads both `research.md` files and writes the cross-lane synthesis.
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
Fan-out lineages with externalised state, synthesised by the conductor

### Key Components
- **fanout-run.cjs**: spawns and supervises both lineages
- **dispatch-prompt.md**: the shared brief
- **Synthesis**: the conductor's merge of the two lanes

### Data Flow
The brief and the library on disk feed each lineage; each writes iteration files, deltas and a research.md; the conductor reads both and writes research/research.md.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| The chart corpus | `sk-design-chart` | unchanged | findings only |
| A later build phase | reads the synthesis backlog | not a consumer yet | `research/research.md` |

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
| Run health | both lineages | `orchestration-summary.json`, status ledger |
| Content | each research.md | five headings, cited evidence, angle 4 numeric |
| Manual | the synthesis | read against the captures by the conductor |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| codex CLI, pi CLI with DevPass | External | Green at launch | A lane cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a lane fails or stalls
- **Procedure**: rerun the failed lane alone with the same config; nothing shipped changes
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
| Setup | Low | brief and launch |
| Core Implementation | Med | two lanes, about an hour each in parallel |
| Verification | Med | read both lanes, write the synthesis |
| **Total** | | **One session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. Stop the runner if a lane misbehaves
2. Delete the lane directory and rerun it alone
3. Confirm the orchestration summary
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
| Brief | None | dispatch-prompt.md | luna, glm |
| luna, glm | Brief | research.md each | synthesis |
| synthesis | luna, glm | research/research.md | next phase |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Brief and launch** - minutes - CRITICAL
2. **Two lanes, five iterations each** - about an hour in parallel - CRITICAL
3. **Synthesis** - one sitting - CRITICAL

**Total Critical Path**: one session

**Parallel Opportunities**:
- The luna and glm lanes run simultaneously
- Packet docs are filled while the lanes run
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Lanes launched | both lineage directories exist and report progress | 2026-09-08 |
| M2 | Lanes complete | orchestration summary: two succeeded | 2026-09-08 |
| M3 | Synthesis written | `research/research.md` ranked and cited | 2026-09-08 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Two model families on one brief

**Status**: Accepted

**Context**: One model reading a visual library will carry its own taste; the operator asked for two lanes.

**Decision**: Run GPT-5.6 Luna and GLM-5.3-Flash on the same five-angle brief, five iterations each, no early convergence, and synthesise across both.

**Consequences**:
- Agreements across model families carry more weight than either lane alone
- Twice the cost and a synthesis step; mitigated by the max-iterations cap and the shared brief

**Alternatives Rejected**:
- One lane only: rejected because a single reading cannot be cross-checked

---

