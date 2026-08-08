---
title: "Research Plan: Further Improvements for the deep-pi and pi-cache-optimizer Forks"
description: "Three independent deep-research lineages (GPT-5.6 SOL high fast, GPT-5.6 LUNA max fast via cli-codex; Grok 4.5 high fast via cli-cursor), 20 iterations total (7/7/6), forced to full depth via --stop-policy=max-iterations, synthesized into one priority-ranked improvement list for both forks."
trigger_phrases:
  - "fork improvement research plan"
  - "deep-pi pi-cache-optimizer improvement research"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/039-pi-caching-like-reasonix/007-research-fork-improvements"
    last_updated_at: "2026-08-08T05:52:36Z"
    last_updated_by: "spec-author"
    recent_action: "4th lineage complete; research.md re-synthesized across 24 iterations"
    next_safe_action: "Operator decides whether findings warrant an 008 implementation phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-08-cli-039-007-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Research Plan: Further Improvements for the deep-pi and pi-cache-optimizer Forks

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Evidence targets** | `.pi/extensions/pi-cache-optimizer/`, `.pi/extensions/deep-pi/`, and their specs at `../003-fork-and-guard-cache-optimizer/`, `../006-fork-and-improve-deep-pi/` |
| **Executor A** | GPT-5.6 **SOL**, effort **high**, **fast** mode, via **cli-codex**, 7 iterations |
| **Executor B** | GPT-5.6 **LUNA**, effort **max**, **fast** mode, via **cli-codex**, 7 iterations |
| **Executor C** | **Grok 4.5** (`cursor-grok-4.5-high-fast`), via **cli-cursor**, 6 iterations |
| **Iterations** | 20 total (not 20 each), non-converging, forced to full depth via `--stop-policy=max-iterations` |
| **Outputs** | `research/lineages/{sol,luna,grok}/` (per-lineage state, iterations, findings-registry, own research.md), `research/research.md` (top-level synthesis) |

### Overview
Twenty iterations, split 7/7/6 across three genuinely independent models (not three prompts to the same model), investigate correctness, test coverage, telemetry/observability, cost-economics, and maintainability opportunities for both forks. Each lineage runs its own full loop with fresh context per iteration; the top-level synthesis is authored only after all three complete, grouping findings by how many lineages independently found the same issue.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Both forks (003, 006) shipped, committed, and pushed before research started
- [x] cli-codex and cli-cursor routes verified for the three target models (`gpt-5.6-sol`, `gpt-5.6-luna`, `cursor-grok-4.5-high-fast`)
- [x] Fan-out config validated as JSON before dispatch

### Definition of Done
- [x] Each lineage logged its full assigned iteration count under `research/lineages/{label}/iterations/`
- [x] `research/research.md` cites real file paths/line numbers for every finding
- [x] Synthesis groups findings by cross-executor convergence tier, not just concatenated
- [x] `validate.sh --strict` exits 0 on this phase folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

```
Three independent deep-research lineages (concurrency 3), each a full loop to its own assigned count:
  sol:  cli-codex  gpt-5.6-sol  (high, fast)  ─ 7 iterations ─> research/lineages/sol/  ─┐
  luna: cli-codex  gpt-5.6-luna (max, fast)   ─ 7 iterations ─> research/lineages/luna/ ─┼─> research/research.md
  grok: cli-cursor cursor-grok-4.5-high-fast  ─ 6 iterations ─> research/lineages/grok/ ─┘   (merged synthesis)
  (no early convergence: --stop-policy=max-iterations forces the full count per lineage regardless of declining scores)
```

### Iteration Protocol (each iteration, per lineage)

1. Fresh context per dispatch: no conversation carryover between iterations (deep-research runtime guarantee)
2. Each iteration picks a focus track (architecture, correctness, testing, observability, cost, maintainability, or a synthesis/prioritization pass on the final iteration) and reads the real source directly
3. Output per iteration: 3-5 cited findings (LEAF, target 8-11 tool calls), ruled-out directions, and updated open/answered questions
4. Runtime writes `research/lineages/{label}/iterations/iteration-NNN.md` + appends the JSONL delta; the reducer refreshes each lineage's own strategy/registry/dashboard, then its own per-lineage `research.md`

### Key Design Decisions

| # | Decision | Rationale |
|---|----------|-----------|
| D-001 | 20 total, split 7/7/6, not 20 each | Operator's explicit call after a consolidated clarifying question — balances cost against still having enough depth per model for real convergence signal |
| D-002 | Forced full depth (`--stop-policy=max-iterations`) | Operator wanted a genuine 3-way comparison at equal depth, not one model quitting early while another ran its full count |
| D-003 | Three genuinely different models, not three prompts to one model | Diversity of failure mode is the point — a finding all three reach independently is far stronger evidence than one model repeated |
| D-004 | Grok routed via cli-cursor (`cursor-grok-4.5-high-fast`), not a native deep-research executor kind | Grok isn't one of the seven native executor kinds; cli-cursor is the sanctioned fan-out adapter that supports it, confirmed against the real model allowlist in `executor-config.ts` before dispatch |
| D-005 | Added `--stop-policy` directly to the manual `fanout-run.cjs` invocation | The `/deep:research:auto` YAML's own `step_fanout_spawn_cli` template doesn't forward that flag to the script, even though the script itself accepts and uses it — verified by reading both files rather than assumed; documented as a real workflow gap in `spec.md` §6 |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup and Dispatch
1. Resolved the fan-out config (3 executors, 7/7/6 iterations, concurrency 3) and validated it as JSON before use
2. Acquired the packet's advisory lock, created the research directory, dispatched `fanout-run.cjs` in the background with `--stop-policy max-iterations`
3. Armed a persistent monitor on the orchestration ledger to watch for progress and terminal completion/failure without blocking

### Phase 2: Iterations
1. All three lineages ran concurrently; confirmed live via `ps` (real `codex exec`/subprocess activity, not just queued state)
2. Verified `sol`'s apparent early "stall" was a false alarm from the monitor's own single-line display, not a real hang, by checking its actual `state.jsonl` directly
3. Investigated `sol`'s eventual "failed" terminal status directly: its own research completed cleanly (7/7 iterations, `synthesis_complete`), and the failure was a post-synthesis write-containment violation (safely reverted) — confirmed via `git diff` that the 3 out-of-scope paths were untouched

### Phase 3: Synthesis and Reconciliation
1. Pulled each lineage's `findings-registry.json` directly (not just its narrative `research.md`) and cross-matched findings by semantic content to build convergence tiers
2. Authored `research/research.md` grouping findings into Tier 1 (all 3 lineages), Tier 2 (2 of 3), and Tier 3 (single-lineage, well-evidenced), plus a cross-validated priority-ranked action list
3. Reconciled `spec.md`, this plan, `tasks.md`, `checklist.md`, `implementation-summary.md` to the real outcome; updated the 039 parent's Phase Documentation Map (which was also stale about phase 6's true Complete status, fixed in the same pass); regenerated metadata; ran `validate.sh --recursive --strict` on the whole 039 packet
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Target | Test | When |
|--------|------|------|
| Iteration completeness | Each `research/lineages/{label}/` holds its full assigned iteration count | After Phase 2 |
| No early convergence | Each lineage's `state.jsonl` stop reason is `max_iterations`/`maxIterationsReached`, confirmed directly, not assumed from the flag alone | After Phase 2 |
| Write containment | `git diff` on the 3 paths sol's lineage attempted to write confirms they're clean | After Phase 2 |
| Synthesis quality | `research/research.md` cites real file:line evidence for every finding, notes convergence tier explicitly | After Phase 3 |
| Packet | `validate.sh --recursive --strict` on the whole 039 packet | After Phase 3 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Purpose | Risk if missing |
|-----------|---------|-----------------|
| cli-codex + `gpt-5.6-sol`/`gpt-5.6-luna` routes | Executors A/B | Track fails; logged honestly, not papered over |
| cli-cursor + `cursor-grok-4.5-high-fast` route | Executor C | Track fails; logged honestly |
| Both forks (003, 006) already shipped and pushed | Research needs a real, working baseline to critique | Confirmed complete on `origin/skilled/v4.0.0.0` before this phase started |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Research-only phase: nothing to roll back in the forks themselves. Delete `research/` and `scratch/` to restart. No repo files outside this phase folder were intentionally touched; the one out-of-scope write attempt during the run was reverted automatically by the fan-out's own write-containment guard, confirmed clean via `git diff`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:verification -->
## 8. VERIFICATION PATH

1. `research/lineages/{sol,luna,grok}/iterations/`: 7, 7, and 6 iteration files respectively
2. `research/research.md`: every finding cites real file paths/line numbers; convergence tier stated explicitly for each
3. Priority-ranked action list cross-validated against all 3 lineages' own prioritization output, not authored from one model's opinion
4. `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/cli-external-orchestration/039-pi-caching-like-reasonix/007-research-fork-improvements --strict` exits 0
<!-- /ANCHOR:verification -->
