---
title: "Implementation Plan: Phase 15: dsh-hook-parity"
description: "Adds six repo-guards adapters, a lineage leaf marker and a DSH session sweep, then moves every adapter into the hook library with relative links from the bundle. Fixture tests come first, and keyless boots of both compositions prove the registrations."
trigger_phrases:
  - "dsh hook parity plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 15: dsh-hook-parity

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM (`.mjs`), Node 26.8 from `~/.local/bin` |
| **Framework** | Cordis plugins loaded by `@deepseek-ai/dsh` 0.2.2-rc.1 |
| **Storage** | Session logs (`session.v4.jsonl.zstd`), the decision queue and goal records under `.skilled/skills/.state/` |
| **Testing** | `node:test` for the bundle, sweep, mirror and matrix suites, vitest for the hooks suite |

### Overview
Each Pi concern DSH lacked gets an adapter on the matching harness event, built test-first against a fake plugin context. A marker plugin the lineage patch inserts tells the bundle it runs in a fan-out leaf, so the advisor and the other writer adapters stay off there. Every adapter then moves into `.skilled/hooks/<concern>/dsh/` or its skill's `hooks/dsh/`, and the bundle reaches it through a relative link the mirror check verifies.
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
- [x] `node --test .dsh/plugins/repo-guards/tests/` prints `pass 75` and `fail 0`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Thin event adapters over shared cores.

### Key Components
- **`.dsh/plugins/repo-guards/index.mjs`**: the bundle entry the guards patch loads. It registers 20 adapters and holds the two service-dependent ones behind `ctx.inject`.
- **`lineage-leaf.mjs` and `session-role.mjs`**: the marker the lineage patch inserts and the global flag the adapters read at event time.
- **Real adapters in `dsh/` folders**: one per concern, each calling its shared core.
- **`sweep-dsh.mjs`**: recovers answers from a DSH session log at save time.
- **`sync-runtime-mirrors.cjs`**: derives and checks one link per real adapter.

### Data Flow
A harness event reaches `index.mjs`, which dispatches to each adapter through its link. The adapter reads the event payload, calls its shared core and delivers the result as an injected message, an attached context, a decision or a queue record.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup inventories the concerns and records the red tests, Implementation writes the adapters and moves them, and Verification runs every suite, the keyless boots and recursive strict validation. A follow-up phase closes the five drift items the first pass reported, each test first.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each adapter against a fake plugin context, the sweep's decoder and record mapping, the mirror derivation | `node --test` |
| Integration | Keyless isolated boots of both compositions and `--dump-config` | `dsh` in a `mktemp -d` cwd and `DSH_HOME` with model keys unset |
| Manual | GRD-001 in the harness playbook | `node --test .dsh/plugins/repo-guards/tests/` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `@deepseek-ai/dsh` 0.2.2-rc.1 with `dsh-llm` and `dsh-tools` | External | Green | No injected messages and no `dsh_goal` tool |
| Shared goal, capture, overlay and session-prime cores | Internal | Green | The matching adapter has nothing to call |
| `zstd` CLI | External | Green, evidence only | The frame walker comparison could not run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a guard stops loading (`did not activate` on a dsh run), or a leaf shows an advisor brief or the `dsh_goal` tool.
- **Procedure**: revert this phase's commits with `git revert`, newest first. All code lands in one commit, because each moved adapter also carries its new behavior and the new adapters import the moved helpers, so the move cannot be reverted alone.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Layout move ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (inventory, probes, red tests) | Phase 013 contract pin | Implementation |
| Implementation (adapters, sweep, advisor split) | Setup | Layout move |
| Layout move (hook library, links, mirror tree) | Implementation | Verification |
| Verification (suites, boots, docs, validation) | Layout move | Phase close |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
session-role.mjs ──► lineage-leaf.mjs ──► lineage.patch.yml
        │
        ▼
interactive-only adapters ──► index.mjs ──► guards.patch.yml
        ▲
dsh-llm.mjs (dsh-llm, dsh-tools)
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| `session-role.mjs` | None | The leaf flag | Leaf-aware adapters |
| `dsh-llm.mjs` | The dsh install | Message and tool helpers | Every context adapter, `goal-manage` |
| New adapters | Shared cores, the two helpers | Event registrations | `index.mjs` |
| Adapter links | Real adapter files | The bundle's import surface | The mirror check |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Probe the harness events and patch order** - one session - CRITICAL
2. **Write the adapters against red tests** - one session - CRITICAL
3. **Move the adapters and rewrite their imports** - under an hour - CRITICAL

**Total Critical Path**: one working day.

**Parallel Opportunities**:
- The sweep and its tests ran beside the adapter work.
- The docs ran after the move, while the boots were captured.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Red tests recorded | `evidence/tests-red.txt` shows each new suite failing on its missing module | Setup |
| M2 | Adapters green | `node --test .dsh/plugins/repo-guards/tests/` prints `fail 0` | Implementation |
| M3 | Layout parity | `sync-runtime-mirrors.cjs --check` prints `PASS` with the `dsh-adapters` tree | Layout move |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

The five decisions are recorded in full in `decision-record.md`: ADR-001 the lineage leaf marker, ADR-002 the goal surface, ADR-003 interactive-only writer adapters, ADR-004 the hook library layout and ADR-005 the leaf goal tools and runtime lists.

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- Read the shared core and the Pi adapter for the concern before writing the DSH one.
- Write the fixture test first and see it fail on the missing module.
- Never run `dsh` with the repository root as its cwd. Use a `mktemp -d` cwd, an isolated `DSH_HOME` and unset model keys.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SCOPE | Touch only the bundle, its patches, the `dsh/` folders, the sweep, the mirror check and the named docs |
| TASK-SEQ | Tests before code, adapters before the move, the move before the docs |
| TASK-COMMIT | Commit with `git commit --only -- <paths>` so the parallel docs work keeps its own staged entries |

### Status Reporting Format
One line per task: the task id, the state and the command whose output proves it.

### Blocked Task Protocol
Stop after three failed fixes for one symptom. Record the symptom, the attempts and the evidence in `implementation-summary.md`, and report the blocker instead of working around it.
