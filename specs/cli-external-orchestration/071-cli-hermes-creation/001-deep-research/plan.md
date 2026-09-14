---
title: "Implementation Plan: Hermes runtime deep research"
description: "Run the /deep:research fan-out with two cli-devin lineages at forced depth over the ten Hermes angles, verify the lineages reached their caps, merge and synthesize, and present the findings for operator confirmation."
trigger_phrases:
  - "hermes research plan"
  - "deep research fan-out cli-devin"
  - "forced depth two lineages"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Hermes runtime deep research

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | `/deep:research:auto` workflow; `fanout-run.cjs` (Node, tsx); `cli-devin` executor |
| **Framework** | system-deep-loop deep-research packet v1.15 |
| **Storage** | `research/` artifact tree in this folder |
| **Testing** | Runner artifact checks, `verify-iteration.cjs`, `validate.sh --strict` |

### Overview
The `/deep:research:auto` router resolves setup, persists `research/deep-research-config.json`, and hands execution to the auto workflow, which in fan-out mode runs `fanout-run.cjs` once for both lineages, then merges registries with `fanout-merge.cjs` and emits the resource map. The orchestrating session then writes the consolidated `research/research.md` from the two lineage syntheses and presents the findings in chat.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (`devin` available, Hermes readable, angles and resource map authored)

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Lineage caps verified on disk, not from the run's own summary
- [ ] Docs updated (spec/plan/tasks, implementation summary, goal log)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Detached fan-out: two independent CLI lineages, each a full research loop in its own directory, merged after both finish.

### Key Components
- **`research-angles.md`**: the ten angles and the rules of engagement; named in the topic string
- **`resource-map.md`**: known context the loop seeds into each lineage's strategy
- **`fanout-run.cjs`**: spawns `devin -p ... --model <id> --permission-mode dangerous --respect-workspace-trust false` per lineage with stdin closed, enforces write containment, retries once
- **`fanout-merge.cjs`** and **`reduce-state.cjs`**: consolidated registry, attribution table, resource map
- **Orchestrating session**: verifies caps, writes `research/research.md`, presents findings

### Data Flow
Topic and angles go into each lineage's strategy; iterations write `iterations/iteration-NNN.md`, `deltas/iter-NNN.jsonl` and the state log inside the lineage; the merge step consolidates registries at `research/`; the synthesis reads both lineage `research.md` files.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable: research phase, no runtime change.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `research/` tree | phase output | create | file inventory after the run |
| repo runtime files | unchanged | not a consumer | `git status` shows only this packet |
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
| Artifact | 10 + 5 iteration files, terminal `maxIterationsReached` per lineage | `find`, `jq` over state logs |
| Citation | A sample of citations from each lineage resolves | `sed -n` on cited lines |
| Containment | Nothing outside `research/` changed | `git status --short` |
| Packet | Strict validation | `validate.sh <folder> --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `devin` CLI, headless | External | Green (packet 046 repair) | No lineages run |
| Hermes install at `~/.hermes` | External | Green (v0.21.1 observed) | Angles degrade to online-only |
| Web access from lineages | External | Yellow (inherit-only on cli-devin) | Online angles marked unconfirmed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a lineage fails containment or produces no usable findings
- **Procedure**: delete `research/` and re-run; nothing else was changed
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (angles, map, config) ──► Run (fan-out) ──► Verify (caps, containment) ──► Synthesize ──► Present
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Run |
| Run | Setup | Verify |
| Verify | Run | Synthesize |
| Synthesize | Verify | Present |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1 hour |
| Run | Medium | 2 to 4 hours wall clock (two lineages in parallel, up to 15 minutes per iteration) |
| Verification and synthesis | Medium | 1 to 2 hours |
| **Total** | | **4 to 7 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data changes outside the packet
- [x] No feature flag involved
- [x] Runner status ledger is the monitoring surface

### Rollback Procedure
1. Stop the runner if still running
2. Remove `research/` in this folder
3. Confirm `git status` is clean outside the packet

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
research-angles.md ─┐
resource-map.md ────┼──► fanout-run.cjs ──► lineages/deepseek (10) ─┐
config.json ────────┘                  └──► lineages/swe2 (5) ─────┼──► fanout-merge ──► research.md
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Angles and map | None | Seed context | Run |
| Fan-out run | Seed context, config | Two lineage trees | Merge |
| Merge | Both lineages | Registry, attribution, resource map | Synthesis |
| Synthesis | Merge | `research.md` | Presentation |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Fan-out run** - 2 to 4 hours - CRITICAL
2. **Cap verification and merge** - 30 minutes - CRITICAL
3. **Synthesis and presentation** - 1 hour - CRITICAL

**Total Critical Path**: 4 to 6 hours

**Parallel Opportunities**:
- The two lineages run concurrently (`concurrency: 2`)
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Fan-out launched | Status ledger shows both lineages started | 2026-09-14 |
| M2 | Lineages complete | 10 and 5 iteration files, `maxIterationsReached` | same day |
| M3 | Findings presented | `research.md` written; chat summary delivered; operator confirms plan | same day |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Two lineages with unequal caps instead of one 15-iteration loop

**Status**: Accepted

**Context**: The operator asked for 10 iterations on DeepSeek V4 Flash Max and 5 on SWE-2 Max, both through `cli-devin`, with no early convergence before 15.

**Decision**: Run one fan-out with two labelled lineages, `iterations: 10` and `iterations: 5`, under `stop_policy: max-iterations`, rather than a single sequential loop that switches model mid-run, which the runtime does not support.

**Consequences**:
- Each lineage converges independently and the merge step reconciles them; two model families give a second lens on every judgment.
- The two lineages start from the same angles, so the synthesis must compare rather than concatenate.

**Alternatives Rejected**:
- One 15-iteration single-executor loop: cannot change model per iteration.
- Two separate research packets: doubles the metadata and loses the merged registry.

---
