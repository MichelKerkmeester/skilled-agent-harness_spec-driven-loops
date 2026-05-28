# Iteration 4 — Q4: Wire mode switch into loop / reduce-state / converge / materialize

## Focus

Implement the mode switch (agent-improvement | model-benchmark) wiring in `loop.cjs` (the orchestrating entry point) and ensure `materialize-benchmark-fixtures.cjs` is only invoked for model-benchmark mode. Research the actual code changes needed in reduce-state.cjs, converge.cjs, and the materialize plumbing.

## Actions Taken

1. **Read `reduce-state.cjs`** — the ledger reducer / state log consumer. No mode switch present; purely data-driven from state JSONL.
2. **Read `materialize-benchmark-fixtures.cjs`** — standalone fixture materializer, invoked independently of the agent-improvement loop.
3. **Read `run-benchmark.cjs`** — the benchmark-mode scorer (fixture-based, pattern matching).
4. **Read `score-candidate.cjs`** — the agent-improvement scorer (5-dim rubric, profile-driven).
5. **Read 120/003 `loop.cjs`** — the reference loop implementation from the port source.

## Findings

### F1 — deep-agent-improvement has no `loop.cjs` — the loop IS the orchestration

The deep-agent-improvement skill does not have a `loop.cjs`. Its "loop" is the journal-serialized orchestration via:
- `improvement-journal.cjs` — appends state events to `agent-improvement-state.jsonl`
- `reduce-state.cjs` — reads the state log, computes registry/dashboard
- `promote-candidate.cjs` — decides based on scores whether to accept/reject

The 120/003 `loop.cjs` is a synchronous imperative script that coordinates `dispatch → score → converge → mutate` in a single process. deep-agent-improvement uses a different pattern: async journal appends, separate reducer runs, and explicit promotion gating.

**Implication**: The "mode switch" for deep-agent-improvement must be implemented at the **entry point** that drives the journal-based loop (likely an `index.cjs` or `main.cjs` that doesn't yet exist), NOT inside reduce-state.cjs which is purely reactive.

---

### F2 — `materialize-benchmark-fixtures.cjs` is already standalone and gated

This script (97 LOC) takes `--profile` and `--outputs-dir` as required args. It does NOT check any mode flag — it simply materializes fixtures when invoked. It is invoked by the benchmark runner (`run-benchmark.cjs`) as part of the benchmark scoring pipeline.

For model-benchmark mode, `materialize-benchmark-fixtures.cjs` must be called before `run-benchmark.cjs`. For agent-improvement mode, neither is called. The current calling pattern is:

```
run-benchmark.cjs --profile <x> --outputs-dir <y>
  └── internally calls materialize-benchmark-fixtures.cjs? NO — they are separate scripts
```

Actually, `run-benchmark.cjs` does NOT call `materialize-benchmark-fixtures.cjs`. It loads fixtures directly via `loadFixtures()` (lines 85–93). The materializer is a **separate step** that must be called before `run-benchmark.cjs` to produce the `.md` output files that `scoreFixture()` reads.

**Gating rule**: materialize should ONLY run when mode=`model-benchmark`. In agent-improvement, the benchmark pipeline is not relevant.

---

### F3 — reduce-state.cjs is mode-agnostic — it only consumes state records

`reduce-state.cjs` (1146 LOC) reads `agent-improvement-state.jsonl` and emits `experiment-registry.json` + `agent-improvement-dashboard.md`. It has NO mode awareness. Every record in the state log carries a `type` field that allows it to be bucketed correctly regardless of whether the record came from agent-improvement or model-benchmark scoring.

The relevant record types that flow through reduce-state:
- `scored` / `accepted` / `rejected` — from score-candidate.cjs (agent-improvement)
- `benchmark_run` — from run-benchmark.cjs (model-benchmark)
- `infra_failure` — from either scorer
- `mirror_sync_state` — from scan-integration.cjs

**Gating rule**: reduce-state does not need modification. It correctly routes by `record.type` already. The mode switch is upstream — in whatever script writes the state records.

---

### F4 — converge.cjs is absent from deep-agent-improvement — it may be promote-candidate.cjs

No `converge.cjs` exists in `.opencode/skills/deep-agent-improvement/scripts/`. The convergence logic for agent-improvement is in `promote-candidate.cjs` which evaluates promotion gates (weighted score threshold, benchmark pass, stability coefficient). For model-benchmark mode, convergence is the `benchmark_run` record's `recommendation` field (`benchmark-pass` vs `benchmark-fail`).

The "converge" step in 120/003 evaluates whether a variant is the best seen so far. In deep-agent-improvement, this is done by:
- `promote-candidate.cjs` — computes `recommendation` from score + gates
- Journal records carry the `recommendation` forward
- reduce-state aggregates recommendations across the run

**Gating rule**: For model-benchmark, convergence is per-profile, per-fixture, and aggregate. The mode switch must determine which convergence criteria to apply.

---

### F5 — The mode switch entry point architecture

The correct place to wire the mode switch is at the **loop host** — the script that:
1. Reads/writes `agent-improvement-state.jsonl`
2. Calls `score-candidate.cjs` (agent-improvement) or `run-benchmark.cjs` (model-benchmark)
3. Calls `promote-candidate.cjs` for the convergence decision

Since no such entry point script currently exists in deep-agent-improvement, the build delta must include creating it (or modifying the existing orchestration entry point).

**Mode switch logic** (proposed):

```javascript
// Determine mode from config / CLI arg
const mode = args.mode || config.mode || 'agent-improvement';

if (mode === 'agent-improvement') {
  // Score candidate via 5-dim rubric
  const scoreResult = spawnSync('node', ['score-candidate.cjs', `--candidate=${candidatePath}`, `--output=${scorePath}`]);
  appendState(JSON.parse(scoreResult.stdout));
} else if (mode === 'model-benchmark') {
  // Materialize fixtures then run benchmark
  spawnSync('node', ['materialize-benchmark-fixtures.cjs', `--profile=${benchmarkProfile}`, `--outputs-dir=${fixtureOutputsDir}`]);
  const benchmarkResult = spawnSync('node', ['run-benchmark.cjs', `--profile=${benchmarkProfile}`, `--outputs-dir=${benchmarkOutputsDir}`, `--state-log=${STATE_JSONL}`]);
}
```

**Backward-compat invariant**: When mode is absent or `agent-improvement`, the existing score-candidate.cjs path must be invoked with identical state JSONL output.

---

### F6 — reduce-state.cjs: concrete changes needed

reduce-state.cjs itself needs NO structural changes. However, the state records it consumes need mode metadata. Currently:
- `score-candidate.cjs` outputs records with `type: 'scored'` and `evaluationMode: 'dynamic-5d'`
- `run-benchmark.cjs` outputs records with `type: 'benchmark_run'` and `evaluationMode: 'benchmark'`

To support the mode switch cleanly, we should:
1. Add `mode: 'agent-improvement' | 'model-benchmark'` to every state record (both scorers)
2. reduce-state can then compute per-mode metrics correctly

**reduce-state.cjs delta** (minimal): Add a `mode` field pass-through in `buildRegistry()` bucket computation and in the dashboard's evaluation mode display. No structural rewrite needed.

---

### F7 — materialize-benchmark-fixtures.cjs: concrete changes needed

This script must be guarded so it only runs for model-benchmark mode. Currently it runs unconditionally when called. The change is in the **caller**, not in the script itself. The caller (loop host) should only invoke it when `mode === 'model-benchmark'`.

No changes to `materialize-benchmark-fixtures.cjs` are required. It should remain a pure fixture materializer.

---

### F8 — promote-candidate.cjs: concrete changes needed

promote-candidate.cjs needs mode-aware convergence criteria:
- agent-improvement: weighted score >= WEIGHTED_SCORE_GATE (60), plus stability + benchmark pass
- model-benchmark: aggregateScore >= profile threshold, per-fixture minimum met

**promote-candidate.cjs delta**:
1. Accept `--mode` argument (default: 'agent-improvement')
2. When mode=`model-benchmark`, use `benchmark_run` record fields for convergence decision (aggregateScore, passRate, minimumFixtureScore)
3. When mode=`agent-improvement`, use existing score-candidate logic

---

### F9 — Build delta list (per-seam wiring + backward-compat)

**NEW FILE — loop-host.cjs** (the mode-switching entry point):
```
- Accepts --mode=agent-improvement|model-benchmark (default: agent-improvement)
- agent-improvement path: calls score-candidate.cjs, appends to state log
- model-benchmark path: calls materialize-benchmark-fixtures.cjs then run-benchmark.cjs
- Both paths: call promote-candidate.cjs with --mode
- All paths: emit state records with mode field
```

**MODIFY score-candidate.cjs**:
```
- Add evaluationMode: 'agent-improvement' to all emitted records
- Already outputs evaluationMode: 'dynamic-5d' — rename to evaluationMode: 'agent-improvement' for clarity
```

**MODIFY run-benchmark.cjs**:
```
- Add evaluationMode: 'model-benchmark' to all emitted records (already sets this)
- Confirm state record includes mode field
```

**MODIFY promote-candidate.cjs**:
```
- Add --mode argument
- Mode-aware convergence criteria per F8 above
```

**MODIFY reduce-state.cjs**:
```
- Pass mode through in bucket metadata
- Display mode in dashboard
- No structural changes required
```

**BACKWARD COMPAT INVARIANT**:
```
loop-host.cjs --mode=agent-improvement (or no mode)
  → score-candidate.cjs invoked identically to current behavior
  → state JSONL records have identical schema (type, evaluationMode, recommendation)
  → promote-candidate.cjs produces same recommendation values
```

---

### F10 — Edge cases and pitfalls

1. **No loop.cjs exists yet**: Must create loop-host.cjs as the new orchestrating entry point. Without this, there is no place to wire the mode switch.

2. **materialize-benchmark-fixtures.cjs is not called by run-benchmark.cjs**: They are separate. The loop host must call materialize BEFORE run-benchmark. Omitting this step produces zero fixture outputs and all fixtures fail with `missing-output`.

3. **mode default must be agent-improvement**: If mode is absent or unknown, the loop must default to agent-improvement. This is critical for backward compat — existing callers that don't pass --mode must get the existing behavior.

4. **State record mode field must be consistent**: If score-candidate emits `mode: 'agent-improvement'` but promote-candidate expects it, the field must be present. Review all record emitters.

5. **reduce-state computes per-profile aggregates**: If model-benchmark and agent-improvement records are mixed in the same state log, reduce-state correctly handles them via record.type routing. No special mixed-mode handling needed.

6. **Promote-candidate convergence for model-benchmark**: The convergence criteria (aggregate threshold, per-fixture minimum, pass rate) are per-profile from the benchmark profile JSON. These must be passed to promote-candidate.cjs or embedded in the benchmark_run record for it to read.

## Questions Answered

- **Q4** (substantially): How to wire mode switch — create loop-host.cjs entry point with mode-gated dispatch. reduce-state.cjs needs no structural changes. materialize-benchmark-fixtures.cjs must be called explicitly by loop-host before run-benchmark. promote-candidate.cjs needs mode-aware convergence criteria.

## Questions Remaining

- **Q5**: Backward-compat test strategy + concrete implementation edge cases

## Next Focus

Q5: Design the backward-compat test strategy — regression fixtures for both modes, default-mode invariants, and concrete edge cases the build packet must handle.