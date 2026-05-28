# Iteration 2 — Q2 Focus: `dispatch-model.cjs` Generalization — Config Schema and Wiring

## Focus
Q2: Design the `dispatch-model.cjs` generalization — how does config drive model/provider selection, what is the exact config schema for `modelBenchmarkConfig`, and what is the wiring path from `loop.cjs`'s `mode` to the resolved dispatcher?

## Actions Taken

1. **Read `dispatch-minimax.cjs`** (120/003) — the reference implementation, hardcoded to MiniMax API.
2. **Read 120/003 `loop.cjs`** — how it `require()`s the dispatch module and passes args.
3. **Read deep-agent-improvement `score-candidate.cjs`** — existing 5-dim scorer to understand the fixture-coupling risk (Q3).
4. **Read deep-agent-improvement `run-benchmark.cjs`** — fixture-based benchmark runner, anchor for understanding the mode gap.
5. **Cross-referenced iteration-001 findings** on the three-seam contracts, already partially answered Q2.
6. **Read 001 design spec** (`spec.md`, `decision-record.md`) — confirms `improvement_config.json` is the config locus; `dispatch-model.cjs` is a new file under `deep-agent-improvement/scripts/`.

## Findings

### Q2-A: Config Schema for `modelBenchmarkConfig`

The exact structure for the `modelBenchmarkConfig` key in `improvement_config.json`:

```json
{
  "mode": "agent-improvement",
  "modelBenchmarkConfig": {
    "enabled": true,
    "target_model": {
      "model": "minimax/MiniMax-M2.7",
      "agent": "general",
      "timeout_ms": 600000,
      "max_concurrent": 3,
      "rate_limit_backoff_ms": [60000, 120000, 240000]
    },
    "benchmark": {
      "fixtureDir": ".opencode/skills/deep-agent-improvement/assets/benchmark-profiles",
      "profiles_dir": ".opencode/skills/deep-agent-improvement/assets/benchmark-profiles",
      "minimumFixtureScore": 70,
      "requiredAggregateScore": 80,
      "repeatabilityTolerance": 0,
      "thresholdDelta": 0
    },
    "rubric": {
      "version": "5-dim-reproducibility-v1",
      "weights": {
        "structural": 0.20,
        "ruleCoherence": 0.25,
        "integration": 0.25,
        "outputQuality": 0.15,
        "systemFitness": 0.15
      }
    },
    "budget": {
      "max_iterations": 12,
      "rate_limit_pause": true,
      "rate_limit_pause_sentinel": "state/.eval-loop-pause"
    }
  }
}
```

**Default behavior**: `mode` absent or `"agent-improvement"` → `modelBenchmarkConfig` is ignored. This is the backward-compat guarantee.

---

### Q2-B: `dispatch-model.cjs` Generalization

`dispatch-minimax.cjs` is hardcoded to MiniMax. `dispatch-model.cjs` generalizes by adding an **executor dispatch layer** that routes to any `cli-X` binary:

```javascript
// dispatch-model.cjs interface (generalized from dispatch-minimax.cjs)

/**
 * dispatch-model.cjs — model-agnostic CLI dispatcher
 * @param {{
 *   prompt_file: string,
 *   executor: 'cli-opencode'|'cli-claude-code'|'cli-devin'|'cli-codex'|'cli-gemini',
 *   model?: string,          // resolved from config if omitted
 *   agent?: string,          // resolved from config if omitted
 *   mock?: boolean,
 *   mock_mode?: string,
 *   cwd?: string,
 *   timeout_ms?: number,
 *   variant?: string,        // model-benchmark only; held constant for agent-improvement comparison
 *   modelBenchmarkConfig?: object  // injected by loop.cjs for model-benchmark; undefined for agent-improvement
 * }} opts
 * @returns {Promise<{
 *   ok: boolean,
 *   exit_code: number,
 *   stdout: string,
 *   stderr: string,
 *   attempts: number,
 *   paused?: boolean,
 *   pause_reason?: string,
 *   mock?: boolean
 * }>}
 */
```

**Executor routing** (the core generalization):

```javascript
const EXECUTOR_DISPATCH = {
  'cli-opencode': (opts) => opencodeRun(opts),
  'cli-claude-code': (opts) => claudeCodeRun(opts),
  'cli-devin': (opts) => devinRun(opts),
  'cli-codex': (opts) => codexRun(opts),
  'cli-gemini': (opts) => geminiRun(opts),
};

function dispatch(opts) {
  if (pauseSentinelExists()) {
    return { ok: false, paused: true, pause_reason: 'sentinel_exists', error: 'pause sentinel present' };
  }
  if (opts.mock) return dispatchMock(opts);

  const executor = opts.executor || config.target_model?.executor || 'cli-opencode';
  const fn = EXECUTOR_DISPATCH[executor];
  if (!fn) throw new Error(`Unknown executor: ${executor}`);
  return fn(opts);
}
```

`opencodeRun` maps to `opencode run --model X --agent Y --dir CWD "prompt"` (stdin=ignore). Other executors follow the same spawn pattern with their respective CLIs.

**Mock modes** are shared across all executors — they are model-agnostic deterministic outputs used to exercise the scoring pipeline (same `high-score`, `low-score`, `default` stubs from 120/003).

**Rate-limit handling**: backoff array from config, same 3-strike pause sentinel pattern.

---

### Q2-C: Wiring Path — `loop.cjs`'s `mode` to Resolved Dispatcher

The wiring is a **config-gated injection** pattern that preserves byte-for-byte agent-improvement behavior:

```
agent-improvement mode (default):
  loop.cjs
    ├── mode undefined/absent
    ├── dispatcher seam ← candidate-source.plumbing().dispatch()  ← NO-OP (internal prompt, no CLI call)
    └── scorer seam     ← score-candidate.cjs (existing 5-dim)

model-benchmark mode:
  loop.cjs
    ├── mode = 'model-benchmark'
    ├── reads improvement_config.json → modelBenchmarkConfig
    ├── dispatcher seam ← dispatch-model.cjs (pluggable, loaded via require() or virtual module)
    └── scorer seam     ← score-variant.cjs (ported 120/003 eval-rig scorer + 5-dim rubric)
```

**Key implementation detail**: `loop.cjs` must not import `dispatch-model.cjs` at the top level when mode is `agent-improvement`. Use lazy/dynamic require:

```javascript
// Inside loop.cjs — does NOT load dispatch-model unless mode === 'model-benchmark'
const resolvedDispatcher = (mode === 'model-benchmark')
  ? dynamicRequire('./dispatch-model.cjs')
  : { dispatch: () => ({ ok: true, exit_code: 0, stdout: '', stderr: '', attempts: 1 }) }; // no-op for agent-improvement
```

Or via a **dispatcher factory**, where the dispatcher module is selected at init time based on `improvement_config.json.mode`:

```javascript
function resolveDispatcher(mode, config) {
  if (mode === 'model-benchmark') {
    return require('./dispatch-model.cjs');
  }
  // agent-improvement: return a no-op dispatcher that the loop handles differently
  return { dispatch: noopDispatcher };
}
```

**Canonical config loading** (from both 120/003's `loop.cjs` and deep-agent-improvement's `run-benchmark.cjs`):

```javascript
const config = JSON.parse(fs.readFileSync(
  path.join(improvementConfigDir, 'improvement_config.json'), 'utf8'
));
```

**The config path for deep-agent-improvement**: `.opencode/skills/deep-agent-improvement/scripts/` is the runtime root. The config lives at `../assets/improvement_config.json` relative to the scripts dir (or an absolute path via `DEEP_AGENT_IMPROVEMENT_CONFIG` env var).

---

### Q2-D: Backward-Compat Guarantee

This is the key invariant that must hold after implementation:

> **When `mode` is absent/unset/`agent-improvement`, the agent-improvement loop runs with zero changes to existing behavior.** The dispatcher seam receives a no-op (no CLI dispatch), the scorer seam uses the existing `score-candidate.cjs`, and `dispatch-model.cjs` is never loaded.

This is enforced by:
1. The config default (`mode: "agent-improvement"` implied when absent)
2. The dynamic require / factory pattern that gates `dispatch-model.cjs` loading
3. A behavioral test: `loop.cjs --run-with-mode=agent-improvement` produces identical state JSONL lines as `loop.cjs` without the mode flag

---

## Questions Answered

- **Q2 (answered)**: `dispatch-model.cjs` generalizes by routing through an executor map keyed on `opts.executor`. Config drives selection via `modelBenchmarkConfig.target_model.{model, agent, timeout_ms, max_concurrent, rate_limit_backoff_ms}`. The wiring path from `loop.cjs`'s `mode` uses a config-gated lazy require or factory — `mode === 'model-benchmark'` loads `dispatch-model.cjs`; otherwise a no-op dispatcher is used. Backward-compat guarantee holds because the no-op path means `loop.cjs` in agent-improvement mode never imports or invokes the model-benchmark dispatcher.

## Questions Remaining

- **Q3**: Port eval-rig scorer + 5-dim rubric — harness + deterministic checks are fixture-coupled in 120/003; need to decouple so the same scorer works for both agent-improvement (profile-based) and model-benchmark (fixture-based) scoring.
- **Q4**: Wire mode switch into `loop.cjs` (this iteration answered the config schema; Q4 focuses on the actual code changes to `loop.cjs`, `reduce-state.cjs`, `converge.cjs`, `materialize-benchmark-fixtures.cjs`).
- **Q5**: Backward-compat test strategy + concrete implementation edge cases.

## Next Focus

Q3: Port the 120/003 eval-rig scorer and 5-dim rubric — specifically decouple the deterministic checks + claude grader harness from fixture-only assumptions so the scorer seam works for agent-improvement's profile-based scoring AND model-benchmark's fixture-based scoring. Key risk: fixture coupling in `score-variant.cjs` where each fixture is a `.json` file with `requiredHeadings`/`requiredPatterns` against a SWE-bench output path.

## Graph Events

- `{ type: 'node', id: 'modelBenchmarkConfig-schema', label: 'modelBenchmarkConfig JSON schema', relation: null }`
- `{ type: 'node', id: 'dispatch-model.cjs', label: 'dispatch-model.cjs (new file)', relation: null }`
- `{ type: 'node', id: 'improvement_config.json', label: 'improvement_config.json locus', relation: null }`
- `{ type: 'edge', id: 'e-mode-001', relation: 'READS', source: 'loop.cjs', target: 'improvement_config.json' }`
- `{ type: 'edge', id: 'e-mode-002', relation: 'LOADS', source: 'loop.cjs', target: 'dispatch-model.cjs' }`
- `{ type: 'edge', id: 'e-mode-003', relation: 'CONNECTS', source: 'modelBenchmarkConfig', target: 'dispatch-model.cjs' }`
- `{ type: 'edge', id: 'e-mode-004', relation: 'ENFORCES', source: 'noop-dispatcher', target: 'agent-improvement-backward-compat' }`
