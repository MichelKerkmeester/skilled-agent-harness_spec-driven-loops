---
title: "Implementation Plan: drift census and plan revalidation for the 036 program"
description: "Execution plan for the two-lineage deep-research drift census: how the 204-commit range is triaged, how each of the 15 implementation phases is revalidated against pinned HEAD, and how the two model lineages are reconciled into a per-phase verdict table."
trigger_phrases:
  - "036 drift census plan"
  - "deep-loop revalidation plan"
  - "drift census execution"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/018-drift-census-and-plan-revalidation"
    last_updated_at: "2026-07-19T18:16:02Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored the census execution plan"
    next_safe_action: "Launch the loop with --stop-policy=max-iterations and two executors"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Drift Census and Plan Revalidation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Run a forced-depth, two-lineage `/deep:research` loop over the commit range `0ce43ff589..HEAD` and return a
per-phase drift verdict for the 15 implementation phases of packet 036. The loop is command-owned: `/deep:research`
owns state, dispatch, convergence telemetry, and synthesis. Two independent lineages run the same charter under
different models so their findings can be reconciled rather than averaged.

The census is **read-only with respect to phases 003-017** — it produces verdicts and evidence, never edits.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Command / Check | Blocking |
|------|-----------------|----------|
| Spec validation | `validate.sh <this folder> --strict` Errors 0 | Yes |
| Parent still valid | `validate.sh 036 --strict` after 018 is registered in `children_ids` | Yes |
| Iteration well-formedness | Each iteration writes `iterations/iteration-NNN.md` + a JSONL delta with the five required fields | Yes |
| Phase coverage | All 15 phases (003-017) carry an explicit verdict; no "unknown" | Yes |
| Evidence standard | Every non-clean verdict names a commit SHA plus `path:line` or a command with output | Yes |
| Known-true detection | The census independently reproduces the confirmed phase-003 path breakage | Yes |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Three layers, matching the deep-research contract:

- **Command layer** — `/deep:research` YAML owns setup, per-iteration dispatch, reducer sync, convergence
  evaluation (telemetry only here), and synthesis into `research/research.md`.
- **Lineage layer** — two independent full loops under `research/lineages/{label}/`, one per model. Each converges
  independently; neither can stop the other.
- **Leaf layer** — `@deep-research` executes exactly one iteration per dispatch with fresh context, writes its
  iteration markdown and JSONL delta, and dispatches nothing further.

Drift is triaged in two classes, kept separate throughout:

| Class | Definition | Detection |
|-------|-----------|-----------|
| **First-order** | A path, file, or symbol a phase names no longer resolves | Resolve every path named in a phase plan against pinned HEAD |
| **Second-order** | A path resolves but an assumption behind it is now false | Compare a phase's stated premise against current runtime behavior, registries, and shipped capability |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Why it is in the census |
|---------|------------------------|
| `system-deep-loop/runtime/**` | 22 commits since baseline; the substrate every phase modifies |
| Mode registries and routing | `6cd8ab14e4e`, `708d25acf04`, `908efde8d8f` all touched routing after the plan froze |
| Runtime reference docs | Renamed wholesale by `cc77a1e550a`; phase 003 names two of them |
| Behavior-benchmark harness | The 003 baseline and 016 gate both depend on it; `packet-033` has been renumbered |
| Fan-out scripts | Phases 005 and 009 modify them additively; `fanout-run.cjs` has changed since baseline |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Pin the exact HEAD SHA and record it alongside the baseline `0ce43ff589` in the research config, so every verdict is stated against a known tree state.
- Confirm both executors dispatch and the fan-out spec-gate injection is present before spending iteration budget.

### Phase 2: Implementation
- Triage all 204 commits in `0ce43ff589..HEAD` into touches-036-dependency versus not; no commit is silently dropped.
- Resolve every runtime path, file, and symbol named across phase plans 003-017 against pinned HEAD to detect first-order drift.
- Test each phase's stated premise against current runtime behavior, registries, and shipped capability to detect second-order drift.
- Determine whether any shipped work since the baseline already delivers part of a planned phase, making that phase partly redundant.
- Resolve the two named open questions: the `packet-033` benchmark dependency, and whether routing commits changed the registered-mode count phase 013 assumes.

### Phase 3: Verification
- Prove all 15 implementation phases carry an explicit verdict with no "unknown" bucket.
- Prove the positive control: the census independently rediscovered the confirmed phase-003 dead reference paths.
- Prove the negative control: at least one phase came back genuinely clean, showing the census discriminates.
- Reconcile the two lineages and surface every disagreement rather than averaging them away.
- Run strict validation on this folder and re-confirm the 036 parent still validates after registration.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

There is no code under test. Verification is evidence reproduction:

- **Positive control** — the census must independently rediscover the two confirmed phase-003 dead paths and the
  `behavior_benchmark/` glob with zero matches. Failure to rediscover known-true drift invalidates the run.
- **Negative control** — at least one phase should come back genuinely clean; a census that marks everything
  drifted is not discriminating.
- **Reproducibility** — every cited command is re-runnable by a reader against the pinned SHA.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status |
|------------|--------|
| `/deep:research` command workflow | Available; owns the loop |
| `openai/gpt-5.6-sol-fast --variant high` | Smoke-tested, dispatches clean (`SOL_OK`) |
| `zai-coding-plan/glm-5.2 --variant max` | Smoke-tested, dispatches clean (`GLM_OK`); effort forwarding unverified upstream |
| Fan-out spec-gate fix | Landed — `fanout-run.cjs:1789-1790` injects `MK_SPEC_GATE_DISABLED=1` + `AI_SESSION_CHILD=1` |
| 036 analysis findings (2026-07-19) | Prior input; the census must not simply restate them |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The census writes only inside this folder plus two additive registrations in the parent. To undo: delete
`018-drift-census-and-plan-revalidation/`, remove the 018 entry from `036/graph-metadata.json` `children_ids`,
and drop the 018 row from the parent phase map. No runtime file is touched, so there is nothing to revert
outside the spec tree.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
1. Pin HEAD
      │
2. Triage 204 commits ──────────┐
      │                         │
3. Census per phase (×15)   [both lineages, independent]
      │                         │
4. Reconcile lineages ◄─────────┘
      │
5. Synthesize verdict table
```

Stages 1-3 run inside each lineage independently. Stage 4 is the only barrier.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Item | Estimate | Basis |
|------|----------|-------|
| Iterations | 20 total (10 per lineage) | Operator-selected budget |
| Wall-clock per iteration | 3-12 min | GLM-5.2 latency variance measured at 6-161s per dispatch plus tool time |
| Total wall-clock | ~1.5-3 hours, lineages concurrent | 10 sequential iterations per lineage |
| Human review | ~30 min | Reading the verdict table and deciding per-phase actions |

Kill criterion: if after 6 iterations a lineage has produced no verdict backed by a commit SHA, stop that lineage
and fall back to the surviving one rather than spending the remaining budget.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

| Trigger | Action |
|---------|--------|
| GLM lineage rate-limits or stalls | Operator directive: fall back to `openai/gpt-5.6-sol-fast` for the remainder |
| 3 consecutive executor failures | Route to stuck recovery per loop protocol; do not hand-roll a retry loop |
| Parent validate breaks after registering 018 | Revert the two parent edits; 018 remains a valid standalone folder |
| Census contradicts the 2026-07-19 analysis | Surface the contradiction; do not silently pick a side |
<!-- /ANCHOR:enhanced-rollback -->
