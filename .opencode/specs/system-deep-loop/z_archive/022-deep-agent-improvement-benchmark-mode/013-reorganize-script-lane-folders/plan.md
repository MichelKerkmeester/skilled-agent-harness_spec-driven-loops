---
title: "Implementation Plan: scripts physical lane reorg"
description: "Move the 16 deep-agent-improvement scripts plus the scorer subtree into agent-improvement, model-benchmark, and shared lane subdirs, repair every __dirname-relative path, and rewrite all cross-references while keeping the agent-improvement default path byte-identical."
trigger_phrases:
  - "scripts-physical-reorg plan"
  - "scripts lane reorg plan"
  - "deep-agent-improvement scripts plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/022-deep-agent-improvement-benchmark-mode/013-reorganize-script-lane-folders"
    last_updated_at: "2026-05-29T10:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffold 013 plan for scripts physical lane reorg"
    next_safe_action: "git mv scripts into lane subdirs and fix __dirname path joins"
    blockers: []
    key_files:
      - ".opencode/skills/deep-agent-improvement/scripts/loop-host.cjs"
      - ".opencode/skills/deep-agent-improvement/scripts/dispatch-model.cjs"
      - ".opencode/skills/deep-agent-improvement/scripts/run-benchmark.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-013-reorganize-script-lane-folders"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: scripts physical lane reorg

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS (.cjs) scripts |
| **Framework** | OpenCode skill layout (scripts/, references/, assets/) |
| **Storage** | Files on disk + skill graph-metadata.json |
| **Testing** | vitest (14 test files in scripts/tests/) |

### Overview
Regroup the flat scripts tree into the three lanes the skill already names in prose. Each script is a `git mv` to preserve history, then every `__dirname`-relative path join is repaired for the new depth, and every cross-reference (SKILL.md, README.md, the 4 workflow YAMLs, the vitest resolvers) is repointed. The agent-improvement default path stays byte-identical (TST-1).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Lane mapping recorded for all 16 scripts plus scorer subtree
- [ ] `__dirname` and relative-require inventory captured by grep
- [ ] Cross-reference inventory captured across SKILL/README/YAML/tests

### Definition of Done
- [ ] All 16 scripts under a lane subdir; scorer under model-benchmark
- [ ] dispatch-model loads real config (positive assert, not just runs)
- [ ] loop-host TST-1 identity test green
- [ ] Full vitest suite green
- [ ] grep for stale flat script paths returns zero in all reference surfaces
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Lane-organized scripts layout: `scripts/{lane}/` where lane is one of agent-improvement, model-benchmark, shared. Shared infra (`lib/`, `tests/`) stays at the scripts root.

### Key Components
- **scripts/agent-improvement/**: score-candidate, generate-profile, rollback-candidate, candidate-lineage, scan-integration, check-mirror-drift, trade-off-detector, benchmark-stability
- **scripts/model-benchmark/**: dispatch-model, run-benchmark, and the scorer/ subtree
- **scripts/shared/**: loop-host, promote-candidate, materialize-benchmark-fixtures, reduce-state, improvement-journal, mutation-coverage
- **scripts/lib + scripts/tests**: stay at the root; lib is imported via `./lib/` by co-located callers, tests resolve scripts by absolute repo path

### Data Flow
loop-host (shared) plans a mode-specific invocation and spawns child scripts. The planner returns bare script names (TST-1 contract); the spawn layer resolves each name to its lane path. dispatch-model (model-benchmark) reads config and state by walking up from `__dirname` to the skill root, so its `..` depth must account for the new subdir level.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Lane move changes path resolution and shared policy, so the consumer inventory is mandatory.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| loop-host.cjs runNode | spawns child scripts by `path.join(SCRIPTS_ROOT, name)` | update: resolve lane path in spawn layer, keep planInvocation bare | loop-host.vitest.ts TST-1 stays green |
| dispatch-model.cjs SCRIPTS_ROOT | `path.join(__dirname,'..','state'|'assets')` | update: add one `..` level for the new subdir depth | positive config-load assert |
| score-candidate.cjs runScript | `path.join(__dirname, name)` spawns co-lane scripts | unchanged: scan-integration + generate-profile move into the same lane | score-candidate-cache.vitest.ts green |
| run-benchmark.cjs scorer require | lazy `require('./scorer/score-model-variant.cjs')` | update: scorer moves with run-benchmark into model-benchmark, relative require stays correct | scorer.vitest.ts + optin-scorer.vitest.ts green |
| SKILL.md / README.md / YAMLs / tests | reference scripts by path | update: repoint to lane paths | grep sweep returns zero flat paths |

Required inventories:
- `__dirname` usage: `rg -n "__dirname" --glob "*.cjs"`.
- Sibling relative requires: `rg -n "require\('\./" --glob "*.cjs"`.
- Cross-references: `rg -n "scripts/<name>\.cjs" SKILL.md README.md *.yaml *.vitest.ts`.
- Path invariant: every moved script must resolve state/, assets/, lib/, and spawned siblings to the exact same on-disk target as before the move.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Capture `__dirname`, relative-require, and cross-reference inventories
- [ ] Confirm the lane mapping against the actual file list

### Phase 2: Core Implementation
- [ ] git mv the 8 agent-improvement scripts into the lane subdir
- [ ] git mv the 2 model-benchmark scripts plus scorer/ into model-benchmark
- [ ] git mv the 6 shared scripts into shared
- [ ] Fix dispatch-model `..` depth; resolve loop-host child paths in the spawn layer
- [ ] Rewrite SKILL.md, README.md, YAML, and test cross-references; refresh graph-metadata

### Phase 3: Verification
- [ ] Run the full vitest suite; expect all 14 files green
- [ ] Positive-assert dispatch-model loads real config
- [ ] grep for stale flat script paths returns zero
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Moved scripts, scorer, lib | vitest |
| Identity | loop-host default path byte-identical | loop-host.vitest.ts (TST-1) |
| Config-load | dispatch-model reads real config, not `{}` | positive assert |
| Path sweep | No stale flat script paths remain | rg |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 010-reorganize-two-lane-references-assets | Internal | Green | assets dispatch-model loads already at `assets/agent-improvement/` |
| scripts/lib (stays put) | Internal | Green | co-located callers import via `./lib/`; movers reference via `../lib/` |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A test fails after the move, dispatch-model loads `{}` instead of real config, or loop-host TST-1 breaks.
- **Procedure**: `git mv` the affected script back to the scripts root and revert the matching path-join and cross-reference edits. Moves are history-preserving so revert is clean.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Inventory) ──► Phase 2 (Move + path fix) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Inventory | None | Move |
| Move + path fix | Inventory | Verify |
| Verify | Move + path fix | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Inventory | Low | 0.5-1 hour |
| Move + path fix | High | 2-4 hours |
| Verification | Med | 1-2 hours |
| **Total** | | **3.5-7 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Full vitest suite green before the move (baseline)
- [ ] `__dirname` and cross-reference inventories captured
- [ ] Working tree clean so each git mv is isolated

### Rollback Procedure
1. Identify the failing surface (test name, config-load assert, or grep hit)
2. `git mv` the offending script back to the scripts root
3. Revert the matching path-join and cross-reference edits
4. Re-run the suite to confirm the baseline is restored

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A; this is a file-move plus path-edit reorg
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│  Inventory  │────►│  Move + path fix │────►│   Verify    │
└─────────────┘     └────────┬─────────┘     └─────────────┘
                            │
                      ┌─────▼──────┐
                      │ Cross-ref  │
                      │  rewrite   │
                      └────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Inventory | None | path + ref map | Move |
| Move | Inventory | lane subdirs | path fix, cross-ref |
| Path fix | Move | repaired joins | Verify |
| Cross-ref rewrite | Move | repointed refs | Verify |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Move scripts + scorer into lane subdirs** - 1-2 hours - CRITICAL
2. **Repair dispatch-model + loop-host path resolution** - 1-1.5 hours - CRITICAL
3. **Run full vitest suite to green** - 1 hour - CRITICAL

**Total Critical Path**: 3-4.5 hours

**Parallel Opportunities**:
- Cross-reference rewrite (SKILL/README/YAML) can run alongside the path-fix work
- graph-metadata refresh can run after moves, in parallel with verification
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Scripts moved | 16 scripts + scorer under lane subdirs | Phase 2 |
| M2 | Paths repaired | dispatch-model loads real config; loop-host spawns at lane paths | Phase 2 |
| M3 | Reorg verified | Full vitest suite green; zero stale flat paths | Phase 3 |
<!-- /ANCHOR:milestones -->

---

<!--
LEVEL 3 PLAN
- Core + L2 + L3 addendums
- Dependency graph, critical path, milestones
-->
