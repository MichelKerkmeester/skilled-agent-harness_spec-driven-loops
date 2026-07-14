---
title: "Implementation Plan: Deep-Loop Market Research (Loop-Engineering Landscape)"
description: "Method for the 45-iteration non-converging /deep:research run: exact executor configs (LUNA 25 cli-codex gpt-5.6-luna max fast; SOL 10 cli-codex gpt-5.6-sol ultra fast; GLM 10 cli-opencode glm-5.2 max), the non-converging flags, both faithful execution shapes (A parallel fan-out with the executors JSON, B sequential batches) with a recommendation, research/ state layout, and the orchestrator check-in cadence."
trigger_phrases:
  - "deep loop market research plan"
  - "45 iteration executor split"
  - "deep research fan-out recipe"
  - "non-converging flags"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/001-deep-loop-market-research"
    last_updated_at: "2026-07-14T21:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Plan authored at scaffold time; execution not started"
    next_safe_action: "Run transport pre-flights, then launch the run per ADR-002 shape"
    blockers: []
    key_files:
      - "spec.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "065-001-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Deep-Loop Market Research (Loop-Engineering Landscape)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | `/deep:research` (deep-research mode of system-deep-loop); loop owned by `.opencode/commands/deep/assets/deep_research_auto.yaml` |
| **Framework** | system-deep-loop `runtime/` loop engine (state JSONL, convergence math, fan-out, dedup, gauges); executor transports cli-codex + cli-opencode |
| **Storage** | Loop state INSIDE this folder at `research/` (created AT EXECUTION by the loop — never pre-scaffolded) |
| **Testing** | Config-flag verification at init; state-JSONL iteration accounting; deliverable gates in `checklist.md`; `validate.sh --strict --recursive` on the parent |

### Overview

One full-depth, non-converging research run: 45 iterations total, allocated LUNA 25 / SOL 10 / GLM 10, launched with `--max-iterations=45 --stop-policy=max-iterations --convergence-mode=divergent`. `stop-policy=max-iterations` forces full depth; `divergent` pivots into adjacent/contradiction/missing-source questions at would-be-stop points; the anti-convergence floor and quality guards stay active. The run seeds from the 10 research angles in `spec.md`, broadens beyond them, dedups via the findings-registry, catalogues 10+ GitHub repos, maps insights to system-deep-loop subsystems, and synthesizes `research/research.md`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Shape A vs B decided and recorded in ADR-002 (execution-start decision; Shape A also needs operator OK for 3-way parallelism)
- [ ] cli-codex ChatGPT-OAuth pre-flight passed (LUNA + SOL lineages)
- [ ] GLM provider prefix + variant confirmed via `opencode models` (e.g. `zai-coding-plan/glm-5.2`); actual values recorded in decision-record.md
- [ ] Session goal set by operator

### Definition of Done
- [ ] 45/45 iterations in state JSONL; non-converging flags present in `research/deep-research-config.json`
- [ ] `research/research.md` 17-section synthesis incl. Eliminated Alternatives
- [ ] 10+ repo catalogue with links + lessons; insights mapped to 6+ distinct subsystems
- [ ] `checklist.md` P0 items checked with evidence; `validate.sh --strict --recursive` Errors: 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Command-owned autonomous loop: `/deep:research` initializes state, dispatches one LEAF `@deep-research` iteration at a time (or N independent lineages under fan-out), evaluates the stop policy, synthesizes, and saves continuity. This phase never hand-rolls loop mechanics; the YAML workflow owns the loop.

### Executor Configs (locked; from runtime executor-config flag support + cli-codex/cli-opencode model rosters)

| Lineage | Kind | Model | reasoningEffort | serviceTier | Iterations |
|---------|------|-------|-----------------|-------------|------------|
| LUNA | `cli-codex` | `gpt-5.6-luna` | `max` | `fast` | 25 |
| SOL | `cli-codex` | `gpt-5.6-sol` | `ultra` | `fast` | 10 |
| GLM | `cli-opencode` | `glm-5.2` | `max` | (not supported by cli-opencode — omit) | 10 |

Operator mandate: GPT models ONLY via cli-codex (both GPT lineages comply); GLM via cli-opencode. GLM's exact provider prefix (e.g. `zai-coding-plan/glm-5.2`) and `max`-variant support are confirmed at execution start (open risk, ADR-003 notes).

### Non-Converging Flags

```
/deep:research ... --max-iterations=45 --stop-policy=max-iterations --convergence-mode=divergent
```

### Execution Shapes (both faithful; choice = execution-start decision, ADR-002)

**Shape A — parallel fan-out (one run, three independent lineages).** ONE `/deep:research` run with a fan-out `--executors` JSON; lineages run as INDEPENDENT parallel loops (each a full loop in `research/lineages/{label}/`), reduced/deduped at the end. Needs operator OK for 3 parallel CLI dispatches. Recipe:

```json
{"executors":[
  {"label":"luna","kind":"cli-codex","model":"gpt-5.6-luna","reasoningEffort":"max","serviceTier":"fast","iterations":25},
  {"label":"sol","kind":"cli-codex","model":"gpt-5.6-sol","reasoningEffort":"ultra","serviceTier":"fast","iterations":10},
  {"label":"glm","kind":"cli-opencode","model":"glm-5.2","reasoningEffort":"max","iterations":10}
],"concurrency":3}
```

**Shape B — sequential batches (three generations, one growing effort).** Three successive runs/generations: LUNA 25 → SOL 10 → GLM 10, each later batch seeded by the accumulated findings of the earlier ones; orchestrator checks in between generations. Uses `--lineage-mode=restart` between generations OR successive invocations against the same spec folder.

**Recommendation: Shape B**, because (a) the mission is BROADENING — SOL and GLM generations can be pointed at the gaps and contradictions LUNA leaves, which Shape A's independent lineages cannot do mid-run (no cross-pollination is a recorded Shape-A risk); (b) between-generation gates give the orchestrator natural check-in/steering points; (c) it avoids the 3-way parallel dispatch load and the extra operator parallelism approval. Shape A remains the faster wall-clock option if the operator prefers parallelism and accepts per-lineage angle allocation as the dedup mitigation. Final call at execution start.

### State Layout (loop-owned, created at execution under `research/`)

`deep-research-config.json`, `deep-research-state.jsonl`, `deep-research-strategy.md`, `findings-registry.json`, `deep-research-dashboard.md`, `.deep-research-pause`, `.deep-research.lock`, `resource-map.md`, `research.md`, `iterations/iteration-NNN.md` — plus `lineages/{label}/...` under Shape A. Do NOT pre-create any of it.

### Data Flow

Seed angles (spec.md) → loop INIT (config + strategy) → per-iteration LEAF research cycles (web/GitHub sources) → findings-registry dedup + novelty scoring → divergent pivots at would-be-stop points → reducer/synthesis → `research/research.md` (17-section) + repo catalogue + subsystem map → phase 002 input.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not a bug-fix phase (research-only); recorded for scope discipline — the run must observe these surfaces and write only where stated.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `001-deep-loop-market-research/research/**` | Loop-owned state + synthesis | Create at execution (loop writes) | State files present post-run; owned by the loop, not hand-written |
| This folder's packet docs | Evidence + decisions | Update during/after run | checklist evidence rows; ADR-002/ADR-003 resolutions |
| `.opencode/skills/system-deep-loop/**` and all other repo paths | Research SUBJECT | READ-ONLY — zero writes | `git status` scoped check at close: no writes outside this spec folder |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Shape A vs B decided (ADR-002 resolved; operator OK captured if A)
- [ ] Transport pre-flights: cli-codex OAuth; GLM provider prefix + variant probe
- [ ] `/deep:research` launched with the non-converging flags; config verified

### Phase 2: Core Implementation
- [ ] LUNA lineage/generation: 25 iterations
- [ ] SOL lineage/generation: 10 iterations (Shape B: seeded by LUNA findings)
- [ ] GLM lineage/generation: 10 iterations (Shape B: seeded by LUNA+SOL findings)
- [ ] Divergent pivots + dedup observed at check-ins (dashboard + state JSONL)

### Phase 3: Verification
- [ ] Repo catalogue 10+ with links + lessons
- [ ] Insights mapped to 6+ distinct subsystems/children/modes
- [ ] `research/research.md` 17-section synthesis incl. Eliminated Alternatives
- [ ] checklist.md evidence complete; strict recursive validation Errors: 0
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Config verification | Non-converging flags present at init | Read `research/deep-research-config.json` |
| Iteration accounting | 45/45 across lineages/generations | `research/deep-research-state.jsonl` (+ per-lineage state under Shape A) |
| Deliverable gates | Repo count, subsystem-map count, 17 sections | checklist.md items vs `research/research.md` |
| Scope discipline | Zero writes outside this spec folder | `git status` scoped check at close |
| Packet integrity | Template/anchor/link conformance | `validate.sh --strict --recursive` on the parent |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-codex (ChatGPT-OAuth) | External transport | Yellow (pre-flight at launch) | LUNA + SOL lineages (35/45 iterations) cannot dispatch |
| cli-opencode GLM provider | External transport | Yellow (prefix/variant probe at launch) | GLM lineage (10/45) cannot dispatch |
| system-deep-loop runtime + deep_research_auto.yaml | Internal | Green | The loop itself |
| Public web/GitHub access | External | Green | Source mining degraded |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Broken transports mid-run, runaway cost, or operator abort.
- **Procedure**: Pause via the loop's pause file / stop the run; state is additive and packet-local — completed iterations persist in `research/` and the run resumes from `deep-research-state.jsonl`. Full abandon: leave `research/` as-is (evidence), mark phase paused in parent map. Nothing outside this spec folder changes, so there is nothing to revert elsewhere.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup: shape + pre-flights + launch)
        └──► Phase 2 (45 iterations by lineage/generation) ──► Phase 3 (Synthesis gates + validation)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Operator goal-set; ADR-002 decision | Core |
| Core (iterations) | Setup | Verify |
| Verify (synthesis + gates) | Core | Phase 002 handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 0.5-1 hour (decision + pre-flights + init) |
| Core Implementation | High | 45 iterations; multi-hour autonomous run (Shape A wall-clock < Shape B) |
| Verification | Medium | 1-2 hours (gates + synthesis review + validation) |
| **Total** | | **One long autonomous session + orchestrator check-ins** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Not a deployment — research-only; scope lock: writes confined to this spec folder
- [ ] Pause/resume path understood (`.deep-research-pause`, state JSONL resume)

### Rollback Procedure
1. Pause or stop the loop (pause file / abort the run)
2. Keep `research/` intact as evidence; resume later from state JSONL, or mark the phase paused in the parent map
3. Verify no writes landed outside this spec folder (`git status` scoped check)

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A (packet-local additive state only)
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────┐     ┌─────────────────────────────┐     ┌──────────────────────┐
│  Phase 1: Setup  │────►│  Phase 2: 45 iterations     │────►│  Phase 3: Synthesis  │
│  ADR-002 + pre-  │     │  LUNA 25 → SOL 10 → GLM 10  │     │  gates + validation  │
│  flights + init  │     │  (or 3 parallel lineages)   │     │                      │
└──────────────────┘     └─────────────────────────────┘     └──────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Shape decision (ADR-002) | Operator input | Execution recipe | Launch |
| Transport pre-flights | None | Verified executor configs | Launch |
| Loop run (45 iters) | Launch | findings-registry + iterations/ | Synthesis |
| Synthesis + catalogue + map | Loop run | research/research.md | Phase 002 |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Setup (shape + pre-flights + init)** - under 1 hour - CRITICAL
2. **LUNA generation/lineage (25 iterations)** - longest single block - CRITICAL
3. **SOL + GLM generations/lineages (20 iterations)** - CRITICAL (parallel with LUNA under Shape A)
4. **Synthesis + gates + validation** - 1-2 hours - CRITICAL

**Total Critical Path**: Shape A ≈ setup + max(lineage wall-clocks) + synthesis; Shape B ≈ setup + sum of generations + synthesis.

**Parallel Opportunities**:
- Shape A runs all three lineages concurrently (needs operator OK)
- Repo-catalogue and subsystem-map curation can proceed during late iterations at check-ins
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Run launched non-converging | Flags in `deep-research-config.json`; first iterations landing | Phase 1 exit |
| M2 | LUNA depth complete | 25 LUNA iterations in state JSONL | Mid Phase 2 |
| M3 | Full depth complete | 45/45 iterations across all lineages/generations | Phase 2 exit |
| M4 | Synthesis shipped | research.md 17-section + 10+ repos + 6+ subsystem map; validation Errors: 0 | Phase 3 exit |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

Decisions live in `decision-record.md`: ADR-001 (divergent convergence-mode vs off, for non-convergence), ADR-002 (Shape A parallel fan-out vs Shape B sequential batches — Proposed, execution-start decision, recommendation Shape B), ADR-003 (transport split: GPT via cli-codex, GLM via cli-opencode — operator mandate).

### Orchestrator Check-in Cadence

- Review `research/deep-research-dashboard.md` + the state JSONL tail at least every 5 iterations (or ~30 minutes of wall-clock, whichever comes first).
- Shape B adds hard between-generation gates: after LUNA and after SOL, the orchestrator reviews coverage/dedup and seeds the next generation at the gaps and contradictions.
- Intervene on: guard-triggered stalls, duplicate-heavy stretches without divergent pivots, transport/auth failures, budget anomalies.
