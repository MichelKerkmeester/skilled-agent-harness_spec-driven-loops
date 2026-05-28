# Deep Research: Implementing the deep-agent-improvement model-benchmark mode

> Canonical synthesis output. Workflow-owned. Compiled from 5 evidence iterations (cli-opencode `minimax/MiniMax-M2.7`, no `--variant`). Stop reason: converged (newInfoRatio plateau after the build-delta was fully characterized in iteration 6).

## 1. Executive Summary

The 001 design named a **mode selector + three pluggable seams** (candidate-source, dispatcher, scorer) and a reuse map. This research turns that into a build-ready plan and surfaces one design-changing discovery: **deep-agent-improvement has no `loop.cjs`** — its orchestration is journal-based (`improvement-journal.cjs` writes `agent-improvement-state.jsonl`; `reduce-state.cjs` reduces it; `promote-candidate.cjs` gates promotion). So the mode switch is NOT a branch inside an existing loop; it needs a **new `loop-host.cjs` entry point** that dispatches to the existing agent-improvement scorer or to a ported model-benchmark pipeline, with the default (no `--mode`) path byte-for-byte identical to today.

The seam contracts are **mode-agnostic in shape** — both modes share `proposeNextCandidate(opts)`, `dispatch(opts)`, and `score(outputText, ctx, mode)` signatures; only the implementations differ. The model-benchmark dispatcher (`dispatch-model.cjs`) generalizes 120/003's `dispatch-minimax.cjs` via an executor-routing map keyed on `opts.executor`. The scorer port's main hazard is **fixture coupling** in 120/003's `score-variant.cjs` (3 coupling points), addressed by passing primitive criteria arrays instead of raw fixture JSON.

**Build delta**: ~2 new files (`loop-host.cjs`, `dispatch-model.cjs`) + 1 grader-factory addition, and ~4 modified files (`score-candidate.cjs`, `run-benchmark.cjs`, `promote-candidate.cjs`, `reduce-state.cjs` — the last is metadata-only). Backward-compat is enforced by an identity test (TST-1) as a CI gate.

> **Verification caveat**: MiniMax cited specific files, LOC counts, line numbers, and constants (e.g. `reduce-state.cjs` 1146 LOC, `RUBRIC_VERSION = 'dynamic-5d/p126-reproducibility-v1'`). These are research-grade reads, not verified ground truth — the build packet MUST confirm each against the actual code before relying on it.

## 2. Research Question & Scope

How should we implement the model-benchmark mode designed in 001: exact per-seam interface contracts; generalizing `dispatch-minimax.cjs` → `dispatch-model.cjs`; porting the 120/003 eval-rig scorer + 5-dim rubric; wiring a `mode` switch without regressing agent-improvement; the backward-compat test strategy; and edge cases. Out of scope: building the mode (a follow-on packet), re-deciding the architecture (001's ADRs stand), and moving the 120/003 rig.

## 3. Methodology

Deep-research loop, executor `cli-opencode` / `minimax/MiniMax-M2.7` (no `--variant`), :auto. One focused question per iteration with fresh context, externalized JSONL state, reducer-maintained registry, and 3-signal convergence. Each iteration read the real 001 design docs + the 120/003 and deep-agent-improvement source scripts and emitted an interface/finding artifact. 5 evidence iterations converged once the full build-delta was characterized.

## 4. Key Findings (summary)

- **Mode-agnostic seam shapes**: all three seams have one contract shape; mode selects the implementation, not the signature.
- **No `loop.cjs` in deep-agent-improvement**: the mode switch belongs in a new `loop-host.cjs`, not inside `reduce-state.cjs` (which is reactive/mode-agnostic) or a non-existent loop.
- **`reduce-state.cjs` needs no structural change**: it already routes by `record.type`; only `mode` metadata pass-through + dashboard display.
- **Scorer port hazard = fixture coupling**: 3 coupling points in `score-variant.cjs`; decouple by passing primitive criteria arrays, parameterizing det-check scripts with explicit `--cwd`, and a `buildGraderFn(mode)` factory.
- **`--variant` flips meaning across modes**: held constant in agent-improvement (comparison fairness); the experimental axis in model-benchmark.
- **Backward-compat is testable**: TST-1 identity test (`--mode=agent-improvement` vs no flag → byte-identical state JSONL) is the critical CI gate.

## 5. Q1 — Per-seam interface contracts (candidate-source, dispatcher, scorer)

All three seams are **mode-agnostic in shape**; the orchestrator depends only on the contract, mode selects the implementation.

**candidate-source** — `proposeNextCandidate(opts) → { proposal }`:
- in: `{ bestCandidate|bestVariant, noImprovementCount, statePath }`
- out: `{ proposal: { id, signature, meta?, filePath?, source: 'seeded'|'mutated'|'imported' } | null }`
- side effects: may write `mutation-coverage.json`; appends candidate to state JSONL (shared `reduce-state.cjs`)
- boundary: returns `null` when the mutation queue is exhausted → loop terminates.

**dispatcher** — `dispatch(opts) → DispatchResult` (generalized from `dispatch-minimax.cjs`):
- in: `{ prompt_file, executor: 'cli-opencode'|'cli-claude-code'|'cli-devin'|'cli-codex'|'cli-gemini', model?, agent?, mock?, mock_mode?, cwd?, timeout_ms?, variant?, modelBenchmarkConfig? }`
- out: `{ ok, exit_code, stdout, stderr, attempts, paused?, pause_reason?, mock? }`
- side effects: writes a rate-limit pause sentinel (`state/.eval-loop-pause`) on 3-strike exhaustion
- boundary: `{ ok:false, paused:true }` on rate-limit exhaustion; `{ ok:false, error }` otherwise.

**scorer** — `score(outputText, ctx, mode, opts?) → ScoringResult`:
- ctx: `{ candidateId, candidateHash, profileOrFixture, rubricVersion? }` (+ seam-adapter-derived `acceptanceCriteria[]`, `gradingCriteria[]`)
- out: `{ fixtureId, weightedScore (0..1), dimensions, hard_gate_failed, interaction_terms?, grader?, metadata? }`
- invariants: `hard_gate_failed === true ⇒ weightedScore === 0`; `weightedScore` always 0..1; **the scorer never reads a fixture JSON file directly** — the loop host extracts primitives and passes them in.

## 6. Q2 — `dispatch-model.cjs` generalization + config

`dispatch-minimax.cjs` is hardcoded to MiniMax. `dispatch-model.cjs` adds an **executor-routing map** keyed on `opts.executor` (`cli-opencode`→`opencode run --model X --agent Y --dir CWD "prompt"` with stdin closed; one entry per CLI family). Mock modes (`high-score`/`low-score`/`default`) stay model-agnostic; the 3-strike rate-limit-pause-sentinel pattern carries over.

Config locus is `improvement_config.json` with a new `modelBenchmarkConfig` key:
```json
{ "mode": "agent-improvement",
  "modelBenchmarkConfig": {
    "enabled": true,
    "target_model": { "model": "minimax/MiniMax-M2.7", "agent": "general", "timeout_ms": 600000, "max_concurrent": 3, "rate_limit_backoff_ms": [60000,120000,240000] },
    "benchmark": { "fixtureDir": "...benchmark-profiles", "minimumFixtureScore": 70, "requiredAggregateScore": 80 },
    "rubric": { "version": "5-dim-...", "weights": { "...": 0.2 } },
    "budget": { "max_iterations": 12, "rate_limit_pause": true, "rate_limit_pause_sentinel": "state/.eval-loop-pause" } } }
```
**Default behavior**: `mode` absent or `"agent-improvement"` ⇒ `modelBenchmarkConfig` is ignored and `dispatch-model.cjs` is never loaded — this is the backward-compat guarantee. Loading is gated by a lazy `require()` / dispatcher factory so agent-improvement never imports the model-benchmark dispatcher.

## 7. Q3 — Porting the eval-rig scorer / 5-dim rubric

Two scoring paths exist today and are **entirely separate**: 120/003 `score-variant.cjs` (D1–D5 weighted rubric, claude grader via harness) and deep-agent-improvement `run-benchmark.cjs` (pattern match: `requiredHeadings`/`requiredPatterns`/`forbiddenPatterns`). Unifying them under one seam needs a careful abstraction barrier.

Three fixture-coupling points in `score-variant.cjs`:
- **CP1** `scoreAcceptanceDeterministic` reads `fixture.acceptance[]` (grep / grep_absent / deterministic / git_diff_paths) against `fixture.scope.cwd`.
- **CP2** det-check scripts (`bundle-gate.cjs`, `cwd-check.cjs`, `preplanning-regex.cjs`, `hallucination-flag.cjs`) each take a `fixturePath` and read the fixture JSON internally (second-order coupling).
- **CP3** `harness.gradeD4({ fixture, ... })` passes the full fixture object; the grader reads `fixture.grading[]` internally.

Decoupling: (1) build a criteria list from `(mode, profileOrFixture)` instead of reading `fixture.acceptance` directly; (2) parameterize det-check scripts with an explicit `--cwd` flag instead of reading `scope.cwd` from JSON; (3) a `buildGraderFn(mode)` factory in `eval-rig/grader/harness.cjs` — LLM 5-dim grader for agent-improvement, NOOP/forbidden-pattern match for model-benchmark. For agent-improvement, the loop host passes a "virtual fixture" (`{ acceptance, grading }`) derived from the improvement profile, so one `score()` always operates on primitive criteria arrays.

## 8. Q4 — Wiring `mode` into the orchestration

**Discovery**: deep-agent-improvement has no `loop.cjs`. Its loop is journal-based: `improvement-journal.cjs` (state appends) + `reduce-state.cjs` (reducer) + `promote-candidate.cjs` (promotion gate). The mode switch therefore lives in a **new entry point `loop-host.cjs`**, not in `reduce-state.cjs`.

- `loop-host.cjs`: resolves `mode = args.mode || config.mode || 'agent-improvement'`; agent-improvement ⇒ `score-candidate.cjs` → state append → `promote-candidate.cjs --mode=agent-improvement`; model-benchmark ⇒ `materialize-benchmark-fixtures.cjs` → `run-benchmark.cjs` → state append → `promote-candidate.cjs --mode=model-benchmark`.
- `reduce-state.cjs`: already mode-agnostic (routes by `record.type`); only add `mode` to bucket metadata + dashboard display. **No structural change.**
- `materialize-benchmark-fixtures.cjs`: stays a pure materializer; the **caller** gates it (only called in model-benchmark; it is NOT invoked by `run-benchmark.cjs`, so the loop host must call it first).
- `promote-candidate.cjs`: add `--mode`; agent-improvement requires `score.status==='scored'`, model-benchmark requires `score.status==='benchmark-complete'` and reads `benchmark_run` fields (aggregateScore, passRate, minimumFixtureScore).
- No `converge.cjs` exists; convergence for agent-improvement is in `promote-candidate.cjs`, for model-benchmark it is the `benchmark_run.recommendation`.

## 9. Q5 — Backward-compat plan, tests, edge cases

**Invariants** — BC-INV-1: `loop-host.cjs --mode=agent-improvement` (or no flag) ⇒ byte-for-byte identical state JSONL. BC-INV-2: existing `score-candidate.cjs` callers unchanged (no new required args). BC-INV-3: `type:'scored'` schema stays compatible (new `mode` field is additive; `reduce-state` doesn't string-match `evaluationMode`, so it's immune to the `dynamic-5d`→`agent-improvement` rename). BC-INV-4: `reduce-state` tolerates old records with no `mode` field. BC-INV-5: unknown/absent `--mode` falls through to agent-improvement.

**Tests** — TST-1 identity test (the critical CI gate: `--mode=agent-improvement` vs no flag → `diff` empty); TST-2 state-log shape regression; TST-3 score determinism (incl. `--no-cache`); TST-4 benchmark smoke (materialize → run-benchmark → `benchmark_run` record); TST-5 default-mode = agent-improvement; TST-6 `mode` field persistence (never null in a run).

**Edge cases (EC-1..10, build packet MUST handle)**: missing state log on first run (ensure parent dir); unknown `--mode` warns+defaults; mixed pre/post-feature state logs; concurrent runs sharing a state log (use per-run path or OS write-lock); materialize failure silently zero-scores benchmark (propagate non-zero exit); SHA256 score-cache key must differ by mode (avoid cross-mode hits; drop `baselineContent` for benchmark); `mode` on `infra_failure` records (score-candidate currently omits it — add); `promote-candidate` status check differs by mode; `dispatch-model.cjs` must accept/forward `--variant` for model-benchmark only; rubric version must not be hardcoded when called from model-benchmark.

## 10. Build-delta list (for the follow-on build packet)

**CREATE**
- `loop-host.cjs` — mode-switching entry point (default agent-improvement; unknown→warn+default; all records carry `mode`).
- `dispatch-model.cjs` — model-agnostic dispatcher (executor-routing map; `--variant` model-benchmark only; gated lazy load).
- grader factory `buildGraderFn(mode)` in `eval-rig/grader/harness.cjs`.

**MODIFY**
- `score-candidate.cjs` — `evaluationMode:'dynamic-5d'`→`'agent-improvement'`; add `mode` to all records incl. `infra_failure`; no new required args.
- `run-benchmark.cjs` — add `mode:'model-benchmark'` to all records incl. `infra_failure`.
- `promote-candidate.cjs` — `--mode` + mode-aware convergence/status checks.
- `reduce-state.cjs` — `mode` pass-through in bucket metadata + dashboard (no structural change).

**GATE**: TST-1 identity test wired as a pre-merge CI check.

## 11. Relationship to the 001 design

001's ADR-001 (mode selector + 3 seams + reuse map) holds. This research **refines** two assumptions: (a) the seam host is a new `loop-host.cjs`, not an existing `loop.cjs` (which doesn't exist); (b) `reduce-state.cjs` is reused as-is structurally (metadata only), confirming ADR-001's ~90%-generic-plumbing claim. ADR-003 (keep scorers/promotion separate) is reinforced by the `buildGraderFn(mode)` factory and the mode-aware `promote-candidate.cjs` rather than a merged scorer.

## 12. Negative knowledge / constraints

- There is no shared scorer seam today; 120/003 and deep-agent-improvement scoring are parallel code paths with different couplings — do not assume one can wrap the other without the criteria-array abstraction.
- `run-benchmark.cjs` does NOT call `materialize-benchmark-fixtures.cjs`; assuming it does will produce all-zero "missing-output" scores.
- `reduce-state.cjs` must not be given mode-branching logic; mode lives upstream in the record writers + `loop-host.cjs`.

## 13. Risks & mitigations

- **Unverified file/LOC/line claims** (High): MiniMax's reads may be stale or wrong → build packet verifies each cited symbol/line before editing.
- **Cross-mode cache collisions** (Med): SHA256 cache key shared across modes → include `mode` in the key, drop `baselineContent` for benchmark.
- **Identity-test drift** (Med): additive `mode` field could leak into the default path → TST-1 byte-diff gate catches any regression pre-merge.
- **Det-check scripts remain fixture-path-coupled** (Med): even with a clean seam → add `--cwd` parameterization before the scorer port is considered done.

## 14. Reusable infrastructure leveraged

120/003 `eval-rig/` (fixtures + deterministic checks + claude grader + 5-dim rubric) and `eval-loop/` dispatcher/mutator/scorer; deep-agent-improvement generic plumbing (`improvement-journal.cjs`, `reduce-state.cjs`, `promote-candidate.cjs`, `materialize-benchmark-fixtures.cjs`, `run-benchmark.cjs`, `score-candidate.cjs`). The build is mostly wiring + a generalized dispatcher + a decoupled scorer, not new loop machinery.

## 15. Open questions / next steps

- Confirm against real code: existence/shape of `score-candidate.cjs`, `promote-candidate.cjs` gates, `reduce-state.cjs` record-type routing, and the exact `RUBRIC_VERSION` constant.
- Decide whether `loop-host.cjs` is a fresh file or an extension of an existing orchestration entry; 001's build plan should adopt the journal-based reality.
- Next: open the build packet (121/003 or a sibling) that executes this delta with TST-1 as the gate.

## 16. References

<!-- ANCHOR:references -->
- iteration-001 — Q1 per-seam interface contracts (candidate-source, dispatcher, scorer)
- iteration-002 — Q2 `dispatch-model.cjs` generalization + `modelBenchmarkConfig` schema + wiring
- iteration-003 — Q3 scorer port, 3 fixture-coupling points, decoupling steps
- iteration-004 — Q4 mode-switch wiring; discovery that no `loop.cjs` exists (journal-based orchestration)
- iteration-006 — Q5 backward-compat invariants (BC-INV-1..5), tests (TST-1..6), edge cases (EC-1..10), full build-delta
- 001-mode-selector-design/decision-record.md — ADR-001/002/003 (mode selector + seams + home)
- 120-cli-opencode-minimax-optimization/003-minimax-prompt-framework-benchmark — eval-rig + eval-loop port source
<!-- /ANCHOR:references -->

## 17. Convergence Report

- Stop reason: converged (newInfoRatio plateau; build-delta fully characterized by iteration 6)
- Evidence iterations logged: 5 (iterations 1, 2, 3, 4, 6) — newInfoRatio 0.35 → 0.45 → 0.55 → 0.62 → 0.70
- Questions answered: 5 / 5 (Q1→i1+i3, Q2→i2, Q3→i3, Q4→i4, Q5→i6)
- Iterations 7–8 were convergence/handoff summaries (low new info), consistent with the stop decision.
- **Dogfood signal (MiniMax M2.7 as deep-research executor)**: held the 3-artifact contract on 5 of 7 dispatches. Two reliability misses — iteration 5 produced zero output (no artifacts written), and iteration 7 wrote the narrative + delta files but left the state-log record as `iteration_start` (no canonical `type:iteration` append). Both were caught by `post_dispatch_validate` and did not corrupt state; the loop recovered and converged. Net: MiniMax M2.7 is usable as a research executor but less reliable at the structured-output contract than the gpt-5.5 run in 120/002 — budget for occasional missed iterations.
