---
title: "Implementation Plan: Phase 1: ownership-transfer"
description: "Retag six doctor routers to system-skilled-doctor, regenerate the advisor command bridges, and update the tests, the routing baseline and the docs that name the old owners."
trigger_phrases:
  - "ownership transfer plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 1: ownership-transfer

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown routers, Node.js (CommonJS and ESM scripts), TypeScript advisor runtime, Python fallback scorer |
| **Framework** | The command-bridge deriver and the advisor runtime |
| **Storage** | Generated JSON and source blocks; the gitignored skill-graph SQLite database |
| **Testing** | vitest, node:test, pytest |

### Overview
The owner of a doctor command is the `skill_agent` tag in its router. The deriver reads that tag and writes the advisor's command rows, so the change is six tag edits and one regeneration, then the tests and docs that pinned the old owner.
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
- [x] `bash .skilled/commands/doctor/scripts/tests/run-all.sh` prints `7 suite(s) passed, 0 failed` and the advisor vitest prints `0 failed`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Generated projection: one authored source, the router tag, and derived rows checked by a drift guard.

### Key Components
- **Router `skill_agent` tag**: the authored owner of each doctor command.
- **`derive-command-bridges.cjs`**: writes `COMMAND_ROWS`, `TRACKED_COMMANDS`, the scorer projection and the Python bridge table from the tags.

### Data Flow
Router tag → deriver → generated rows → advisor brief `use <owner> → <command>` and the routing-accuracy slices.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Router tags | Producer of the owner | update | `grep -h skill_agent .skilled/commands/doctor/*.md \| sort -u` |
| Generated advisor rows | Consumer that renders the owner | regenerate | `derive-command-bridges.cjs --check` |
| Routing-accuracy slices | Consumer that measures owner-led reach | update the stage tally and recapture | `command-routing-slice.vitest.ts` |
| Contract tests and brief goldens | Consumers that pin the owner | update | node:test and vitest |
| Skill and repo docs | Describe the owner | update | `rg` for the old owner sentences |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup captures the baseline of the doctor suites, the advisor vitest, phrase reach and the playbook validator. Implementation retags the six routers, regenerates the bridges, updates the pinned tests, the stage tally and the docs. Verification reruns the whole baseline and compares the numbers. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Router contract tests, brief goldens | node:test, vitest |
| Integration | Routing-accuracy slices, phrase reach, Python scorer | vitest, `doctor-phrase-reach.cjs`, pytest |
| Manual | The brief for "check for skilled updates" and the helper prompts | `skill-advisor.cjs advisor_recommend` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Advisor runtime build | Internal | Green | Stale `dist` would render the old owner |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a routing regression the baseline comparison did not show.
- **Procedure**: revert the phase commit, rerun `derive-command-bridges.cjs` and rebuild the advisor runtime.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Baseline captured | Verification |
| Verification | Implementation | Phase 2 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
router tags ──► deriver ──► generated rows ──► advisor build ──► tests and slices
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Router tags | None | Owner source | Deriver |
| Deriver | Router tags | Generated rows | Advisor build |
| Advisor build | Generated rows | `dist` | Tests |
| Tests and baseline | Advisor build | Evidence | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Retag and regenerate** - minutes - CRITICAL
2. **Advisor rebuild and skill-graph scan** - minutes - CRITICAL
3. **Advisor vitest** - about 4 minutes - CRITICAL

**Total Critical Path**: under half an hour.

**Parallel Opportunities**:
- The doc wording and the test-pin updates can run while the advisor vitest runs.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baseline captured | Every gate output saved under `scratch/baseline/` | Setup |
| M2 | Owners moved | `--check` prints `"changed": []` | Implementation |
| M3 | Gates green | Whole baseline rerun with the deltas named | Verification |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Move ownership through the router tag

**Status**: Accepted

**Context**: the advisor's owner rows are generated, so a hand edit would be undone by the next deriver run.

**Decision**: change the six `skill_agent` tags and regenerate.

**Consequences**:
- One authored fact per command, guarded by `--check`.
- The agreement metric in the command slice counts a subject skill outranking its doctor command as a disagreement now, so its count falls from 6 to 4. The baseline records that.

**Alternatives Rejected**:
- Edit `COMMAND_ROWS` by hand: the deriver would revert it.

### ADR-002: Count a hub's own attachment as owner-led

**Status**: Accepted

**Context**: the deep-loop hub attaches `/doctor:deep-loop` to a stuck-run complaint through its own route. With that command owned elsewhere, the stage tally counted those rows as attached but not owner-led, which breaks the stage invariants.

**Decision**: a row is owner-led when the top skill owns the expected command or its own route attached it.

**Consequences**:
- The stage invariants hold, and the deep-loop hub keeps offering its diagnosis command.

**Alternatives Rejected**:
- Remove the hub's attachment: it would drop a correct offer to satisfy a metric.

---
