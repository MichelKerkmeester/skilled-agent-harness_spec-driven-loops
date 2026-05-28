# Iteration 1 — Q1 Focus: Per-Seam Interface Contracts

## Focus
Q1: Define the exact interface contracts (inputs, outputs, error/boundary behavior, file/JSONL side effects) for the three pluggable seams — candidate-source, dispatcher, scorer — that both modes (agent-improvement, model-benchmark) must satisfy.

## Actions Taken

1. **Read 001 design docs** (`spec.md`, `decision-record.md`) to confirm seam architecture and reuse map.
2. **Read 120/003 source scripts**: `dispatch-minimax.cjs`, `loop.cjs`, `score-variant.cjs`, `grader/harness.cjs` to extract actual interface signatures.
3. **Read deep-agent-improvement existing scripts**: `score-candidate.cjs`, `run-benchmark.cjs`, `materialize-benchmark-fixtures.cjs` to map existing agent-improvement seam implementations.
4. **Analyzed seam calls in `loop.cjs`** (120/003) to understand how each seam is invoked and what contract the orchestrator expects.

## Findings

### Seam 1: candidate-source

**Role**: Produces the next candidate to evaluate. Mode determines what "candidate" means.

| Aspect | agent-improvement | model-benchmark |
|--------|-----------------|-----------------|
| Input | `{ bestCandidate, noImprovementCount, statePath }` | `{ bestVariant, noImprovementCount, statePath }` |
| Output | `{ proposal: { id, signature, meta?, filePath?, source } }` | `{ proposal: { id, signature, meta?, filePath?, source } }` |
| Meta keys | `framework`, `preplanning_density`, `thinking_threshold`, `bundle_gate_strictness`, `anti_hallucination_strength` | Same meta schema (from `render-variant.cjs`); mutation axes differ |
| Side effects | May write `mutation-coverage.json`; appends candidate to state JSONL | Same (shared `reduce-state.cjs`) |
| Error/boundary | Returns `null` when mutation queue exhausted; loop terminates | Same |

**Contract shape** (both modes):
```javascript
// candidate-source seam
/**
 * @param {{ bestCandidate: object|null, noImprovementCount: number, statePath: string }} opts
 * @returns {{ proposal: { id: string, signature: string, meta?: object, filePath?: string, source: 'seeded'|'mutated'|'imported' }|null }}
 */
function proposeNextCandidate(opts)
```

**key field**: `proposal.source` — `'seeded'` for initial candidates, `'mutated'` for loop-generated, `'imported'` for model-benchmark variant imports.

---

### Seam 2: dispatcher

**Role**: Takes a prompt artifact + dispatch args, executes the model, returns raw output + metadata.

From `dispatch-minimax.cjs` (120/003), the contract:

| Aspect | contract |
|--------|----------|
| Input | `{ prompt_file: string, mock?: boolean, mock_mode?: string, cwd?: string, timeout_ms?: number }` |
| Output | `{ ok: boolean, exit_code: number, stdout: string, stderr: string, attempts: number, paused?: boolean, pause_reason?: string, mock?: boolean }` |
| Side effects | Writes `state/.eval-loop-pause` sentinel on rate-limit pause; reads `eval-loop-config.json` for target model config |
| Error/boundary | Returns `{ ok: false, paused: true }` on rate-limit exhaustion (3 strikes); `{ ok: false, error: '...' }` on other dispatch failures |

**Model-agnostic generalization** (`dispatch-model.cjs`):
```javascript
// dispatch-model.cjs interface
/**
 * @param {{ prompt_file: string, executor: 'cli-opencode'|'cli-claude-code'|'cli-devin'|'cli-codex', model: string, agent?: string, mock?: boolean, mock_mode?: string, cwd?: string, timeout_ms?: number }} opts
 * @returns {Promise<{ ok: boolean, exit_code: number, stdout: string, stderr: string, attempts: number, paused?: boolean, pause_reason?: string, mock?: boolean }>}
 */
async function dispatch(opts)
```

Config drives model/provider selection — see `improvement_config.json` with `modelBenchmarkConfig.target_model` (model, agent, timeout_ms, max_concurrent, rate_limit_backoff_ms array).

---

### Seam 3: scorer

**Role**: Takes a candidate + fixture outputs, returns dimension scores + weighted aggregate.

From `score-variant.cjs` (120/003):

| Aspect | contract |
|--------|----------|
| Input | `{ variantId, variantHash, fixturePath, swe16OutputText, rubricVersion, mode: 'real'|'mock', mockMode?: string }` |
| Output | `{ fixtureId, weightedScore: number, deterministic: { acceptance, bundleGate, cwdCheck, preplanning, hallucinationDet }, grader: { score, confidence, parse_status }, hard_gate_failed: boolean, interaction_terms: {...} }` |
| Side effects | Writes `state/in-flight/output-{variantId}-{fixtureId}.md`; writes grader cache (`lib/cache.cjs`) |
| Error/boundary | Grader unreachable → returns `{ grader: { score: 0.0, confidence: 0.0, parse_status: 'failed', error: err.message } }` — scoring continues with D1-D3 only, still computes weightedScore |

**5-dim rubric structure** (from `score-variant.cjs` + config):
- D1: `acceptance` — deterministic checks (grep/grep_absent/deterministic/git_diff_paths)
- D2: `bundleGate` — smoke-run bundle gate check
- D3: `cwdCheck` — working-directory correctness check
- D4: `grader` — claude grader (D4 Hallucination dimension, via harness)
- D5: `preplanning` — pre-planning regex check

**Hard gate**: D2 `hard_gate_failed: true` caps D1 to 0.0. Score still returned (not short-circuit).

**scorer-seam interface** (mode-agnostic):
```javascript
// scorer seam
/**
 * @param {{ candidateId: string, candidateHash: string, fixture: object, outputText: string, rubricVersion: string, mode: 'real'|'mock', mockMode?: string }} opts
 * @returns {Promise<{ fixtureId: string, weightedScore: number, dimensions: object, hard_gate_failed: boolean }>}
 */
async function scoreCandidateOnFixture(opts)
```

---

## Questions Answered

- **Q1 (partial)**: Interface contracts for candidate-source, dispatcher, scorer are now defined with inputs, outputs, error behavior, and file/JSONL side effects. Both modes share the same contract shape; only the implementations differ. Q1 fully answered.

## Questions Remaining

- **Q2**: Generalize `dispatch-minimax.cjs` → `dispatch-model.cjs` — config schema and model/provider selection mechanism needs detailed design.
- **Q3**: Port eval-rig scorer + 5-dim rubric — the harness + deterministic checks need a clean import path; fixture coupling is the main risk.
- **Q4**: Wire mode switch into `loop.cjs` + reduce-state/converge/materialize without regressing agent-improvement.
- **Q5**: Backward-compat test strategy + concrete edge cases.

## Next Focus

Q2: Design the `dispatch-model.cjs` generalization — how does config drive model/provider selection, what is the exact config schema for `modelBenchmarkConfig`, and what is the wiring path from `loop.cjs`'s `mode` to the resolved dispatcher?

## Graph Events

- `{ type: 'node', id: 'seam-candidate-source', label: 'candidate-source seam', relation: null }`
- `{ type: 'node', id: 'seam-dispatcher', label: 'dispatcher seam', relation: null }`
- `{ type: 'node', id: 'seam-scorer', label: 'scorer seam', relation: null }`
- `{ type: 'edge', id: 'e-seam-001', relation: 'CONNECTS', source: 'seam-candidate-source', target: 'loop.cjs' }`
- `{ type: 'edge', id: 'e-seam-002', relation: 'CONNECTS', source: 'dispatcher', target: 'loop.cjs' }`
- `{ type: 'edge', id: 'e-seam-003', relation: 'CONNECTS', source: 'scorer', target: 'loop.cjs' }`