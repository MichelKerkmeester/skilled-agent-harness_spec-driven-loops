---
title: "Implementation Plan: Phase 1: skill-and-tag-move"
description: "Scaffold the standalone system-skilled-doctor skill with init_skill.py, move ten doctor commands' skill_agent tags to it, update the four contract tests that pin the old tag and regenerate the command bridges."
trigger_phrases:
  - "skill and tag move plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 1: skill-and-tag-move

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown and JSON skill files, CommonJS test files |
| **Framework** | The Skilled standalone skill shape from `sk-create-skill` |
| **Storage** | None |
| **Testing** | `node --test` for the doctor contract tests, vitest for the command-bridge drift guard |

### Overview
`init_skill.py` scaffolds the skill and the authored files are filled from the design packet. One line changes in each of ten command routers, and `derive-command-bridges.cjs` regenerates the bridge outputs that credit each command to its tag.
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
- [x] `node --test .skilled/commands/doctor/scripts/tests/*.test.cjs` prints `pass 1005` and `fail 0`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A standalone skill that owns doctor commands through their `skill_agent` tag.

### Key Components
- **`system-skilled-doctor/SKILL.md`**: names the owned commands, when to use each and the commands left with their domain skill.
- **`system-skilled-doctor/README.md`**: the owned-command table, which is also the router's default resource.
- **The ten command routers**: unchanged except for their tag.

### Data Flow
`derive-command-bridges.cjs` reads each router in `.skilled/commands/doctor/`, takes its `skill_agent` tag and writes one bridge per route crediting that skill. The advisor scores those bridges with the skill's own intent signals.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `derive-command-bridges.cjs` | Credits each doctor bridge to its tag | Unchanged, rerun | The owner of every doctor bridge read from `command-bridges.generated.json` |
| Doctor contract tests | Four pin the old tag | Update the pin | The four fail on the moved tag and pass after the pin changes |

Required inventories:
- Same-class producers: `rg -n "skill_agent: (system-spec-kit|sk-doc)" .skilled/commands/doctor/scripts/tests` lists the five pins. The one in `doctor-sk-skill-contract.test.cjs` stays, because `/doctor:sk-skill` stays with `sk-doc`.
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
| Unit | The doctor contract tests | `node --test` |
| Integration | The command bridges and the skill graph | vitest drift guard, `skill_graph_compiler.py --validate-only` |
| Manual | Advisor routing on 12 prompts | `skill-advisor.cjs advisor_recommend` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `derive-command-bridges.cjs` | Internal | Green | The bridges keep crediting the old owners |
| `init_skill.py` | Internal | Green | The scaffold would be hand-built |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a doctor command behaves differently, or advisor routing for a moved command gets worse.
- **Procedure**: revert this phase's commit. The tags, the tests and the generated bridges return together.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup: baseline | None | Implementation |
| Implementation: scaffold, tags, bridges | Setup | Verification |
| Verification: tests, routing | Implementation | Phase 002 |
<!-- /ANCHOR:phase-deps -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
baseline ──► scaffold skill ──► move tags ──► regenerate bridges ──► verify
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Baseline | None | Test and routing numbers | Verification |
| Skill scaffold | None | The skill folder | Bridges |
| Tag move | None | Ten new tags | Bridges |
| Bridges | Scaffold, tags | Regenerated outputs | Verification |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Baseline** - before any edit - CRITICAL
2. **Tag move and bridge regeneration** - one pass - CRITICAL
3. **Whole-gate rerun** - after the last edit - CRITICAL

**Total Critical Path**: one working session

**Parallel Opportunities**:
- The skill's docs and the tag move touch different files and can be done in either order.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baseline captured | 1005 doctor tests, 5 drift-guard tests, 12 advisor rows | Before the first edit |
| M2 | Skill and tags in place | `validate_skill_package.py --strict` passes | Mid-phase |
| M3 | Gate green | The baseline counts hold and the bridges credit the new skill | Phase end |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Standalone skill, command files stay put

**Status**: Accepted

**Context**: The ten commands need one owner whose purpose matches them.

**Decision**: A standalone skill owns them through their `skill_agent` tag, and no command file moves. The operator ruled this in the design packet.

**Consequences**:
- Every `/doctor:*` name keeps working, because the deriver, `_routes.yaml` and the mirrors still read the same folder.
- The skill's own files hold no workflow copy. Each command keeps its own.

**Alternatives Rejected**:
- A parent hub with a mode per command: each command already owns its workflow, so a mode packet would restate it.

---

<!-- ANCHOR:ai-execution-protocol -->
## L3: AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [x] Capture the doctor test count, the drift-guard count and the 12-prompt advisor baseline before the first edit.
- [x] Confirm the ten owned commands against `../research/design-plan.md` §3 and leave the other six tags alone.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Move the tags before regenerating the bridges, and update the pinned tests only after seeing them fail on the moved tags. |
| TASK-SCOPE | Edit only the files in `spec.md` §3. No command file moves, and no other skill's metadata changes. |

### Status Reporting Format
Report as: `Phase 001 - <In Progress|Complete> - doctor tests <pass>/<total> - bridges moved <n>/10 - blocking on: <item | none>`.

### Blocked Task Protocol
When a gate fails after the tag move, compare it with the baseline before changing anything. A count below the baseline blocks the commit until its cause is named and fixed at the producer.
<!-- /ANCHOR:ai-execution-protocol -->

---
