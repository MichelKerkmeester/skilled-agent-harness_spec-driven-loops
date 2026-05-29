---
name: deep-agent-improvement
description: "Evaluator-first bounded agent improvement: 5-dim scoring, dynamic profiling, packet-local candidates, guarded promotion."
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
version: 1.9.0.0
triggers:
  - deep-agent-improvement
  - agent improvement loop
  - bounded agent improvement
  - 5-dimension scoring
  - integration scanner
  - dynamic profiling
  - model-benchmark mode
  - benchmark a model or prompt framework
---

<!-- Keywords: deep-agent-improvement, deep-agent-improvement, agent-improvement, benchmark-harness, score-candidate, promote-candidate, rollback-candidate -->

# Recursive Agent: Evaluator-First Improvement Orchestrator

Evaluator-first workflow for testing whether a bounded agent surface can be improved without immediately mutating the source of truth. It combines packet-local candidates, deterministic scoring, repeatable benchmarks, and explicit promotion or rollback gates.

---

## 1. WHEN TO USE

### Two Co-Equal Lanes

This skill supports two co-equal use-case lanes that share the same candidate, dispatcher, and scorer seams:

| Lane | Pick when | Command |
| --- | --- | --- |
| **Lane A: Agent-Improvement** | You want to improve a bounded agent `.md` file | `/deep:start-agent-improvement-loop` |
| **Lane B: Model-Benchmark** | You want to benchmark a model or prompt framework | `/deep:start-model-benchmark-loop` |

Lane A is detailed in §3 (Runtime Initialization, Proposal and Evaluation, Promotion and Recovery). Lane B is detailed in §4. Both lanes run the same loop shape and keep the agent-improvement path byte-identical when no mode flag is set.

### Activation Triggers

Use this skill when:
- You want to test whether an agent prompt or instruction surface can be improved (Lane A)
- You want to benchmark a model or prompt framework against repeatable fixtures (Lane B)
- The mutation boundary is explicit and narrow
- You need packet-local evidence instead of ad hoc prompt tweaking
- You need target-specific benchmark or scoring rules before any canonical mutation
- Promotion must stay gated behind independent evidence plus operator approval

### Primary Use Cases

#### Bounded Agent Improvement

Use this skill to set up a proposal-first loop for any bounded agent file, write packet-local candidates, and record append-only evidence.

#### Benchmark-Backed Evaluation

Use this skill when candidate quality must be judged by produced artifacts and repeatability reports, not just by how a prompt file reads in isolation.

#### Promotion and Rollback Verification

Use this skill when you need to prove that guarded promotion, validation, rollback, and post-rollback comparison all work end to end without leaving hidden drift behind.

#### Model and Prompt Benchmarking

Use Lane B (model-benchmark) when the thing under test is a model or prompt framework rather than an agent definition. It runs the same loop shape against a benchmark profile and scores produced outputs, sharing the candidate, dispatcher, and scorer seams with the agent-improvement path. See §4 below.

### When NOT to Use

Do not use this skill for:
- Open-ended prompt rewrites across multiple agent families at once
- Direct canonical edits without a packet-local candidate and evaluator evidence
- Broad runtime-mirror synchronization work presented as benchmark truth
- General packet planning that belongs in `/speckit:plan` or implementation that does not need an improvement loop

---

## 2. SMART ROUTING


### Resource Domains

The router discovers markdown resources recursively from `references/` and `assets/`, then applies intent scoring so only the guidance that matches the current task is loaded.

- `references/` for operator workflows, evaluator policy, promotion or rollback rules, target onboarding, and quick-reference guidance
- `assets/` for reusable runtime templates such as the charter and strategy markdown files
- `scripts/` for deterministic benchmark, scoring, reduction, promotion, rollback, and drift-check helpers

**Lane awareness**: resources are organized by lane. `references/agent-improvement/` and `assets/agent-improvement/` carry Lane A guidance, while `references/model-benchmark/` and `assets/model-benchmark/` carry Lane B guidance. `RESOURCE_MAP` routes the `MODEL_BENCHMARK` intent to the Lane B references, and `RUNTIME_ASSETS` loads the Lane B benchmark profile only when the `MODEL_BENCHMARK` intent is selected. The `ALWAYS` and shared `references/shared/` resources apply to both lanes.

### Resource Loading Levels

| Level | When to Load | Resources |
| --- | --- | --- |
| ALWAYS | Every skill invocation | `references/shared/quick_reference.md` |
| CONDITIONAL | If intent signals match | Workflow, policy, or onboarding references |
| ON_DEMAND | Only on explicit request or full setup | Markdown runtime templates in `assets/` |

### Smart Router Pseudocode

The authoritative routing logic for scoped markdown loading and explicit runtime-asset loading.

- Pattern 1: Runtime Discovery - `discover_markdown_resources()` recursively scans `references/` and `assets/`.
- Pattern 2: Existence-Check Before Load - `load_if_available()` uses `_guard_in_skill()`, `inventory`, and `seen`.
- Pattern 3: Extensible Routing Key - quick-reference, loop, evaluation, promotion, target onboarding, integration, and setup intents route resources.
- Pattern 4: Multi-Tier Graceful Fallback - `UNKNOWN_FALLBACK_CHECKLIST` asks for target/action/gate disambiguation and missing intent routes return a "no knowledge base" notice.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/shared/quick_reference.md"

INTENT_SIGNALS = {
    "QUICK_REFERENCE": {"weight": 3, "keywords": ["quick reference", "short reminder", "command example"]},
    "LOOP_EXECUTION": {"weight": 4, "keywords": ["run loop", "proposal", "candidate", "score candidate", "benchmark"]},
    "EVALUATION_POLICY": {"weight": 4, "keywords": ["evaluator", "rubric", "contract", "repeatability", "no-go"]},
    "PROMOTION_OPERATIONS": {"weight": 4, "keywords": ["promote", "rollback", "mirror drift", "approval gate"]},
    "TARGET_ONBOARDING": {"weight": 4, "keywords": ["new target", "target profile", "onboarding", "second target"]},
    "INTEGRATION_SCAN": {"weight": 4, "keywords": ["integration", "scan surfaces", "mirror sync", "dynamic profile", "5-dimension"]},
    "MODEL_BENCHMARK": {"weight": 5, "keywords": ["benchmark a model", "benchmark a prompt framework", "optimize a model", "model-benchmark", "model benchmark"]},
    "FULL_SETUP": {"weight": 3, "keywords": ["full setup", "initialize runtime", "charter", "strategy"]},
}

RESOURCE_MAP = {
    "QUICK_REFERENCE": ["references/shared/quick_reference.md"],
    "LOOP_EXECUTION": ["references/shared/loop_protocol.md", "references/model-benchmark/benchmark_operator_guide.md"],
    "EVALUATION_POLICY": ["references/model-benchmark/evaluator_contract.md", "references/shared/promotion_rules.md"],
    "PROMOTION_OPERATIONS": ["references/shared/rollback_runbook.md", "references/agent-improvement/mirror_drift_policy.md", "references/shared/promotion_rules.md"],
    "TARGET_ONBOARDING": ["references/agent-improvement/target_onboarding.md"],
    "INTEGRATION_SCAN": ["references/agent-improvement/integration_scanning.md", "references/model-benchmark/evaluator_contract.md"],
    "MODEL_BENCHMARK": ["references/model-benchmark/benchmark_operator_guide.md", "references/model-benchmark/evaluator_contract.md"],
    "FULL_SETUP": ["assets/agent-improvement/improvement_charter.md", "assets/agent-improvement/improvement_strategy.md"],
}

RUNTIME_ASSETS = {
    "ALWAYS": ["assets/agent-improvement/improvement_config.json", "assets/agent-improvement/target_manifest.jsonc"],
    "MODEL_BENCHMARK": ["assets/model-benchmark/benchmark-profiles/default.json"],
}

ON_DEMAND_KEYWORDS = ["target profile", "score candidate", "proposal loop", "benchmark", "promotion gate", "mirror drift"]

def _task_text(task) -> str:
    return " ".join([
        str(getattr(task, "text", "")),
        str(getattr(task, "query", "")),
        " ".join(getattr(task, "keywords", []) or []),
    ]).lower()

UNKNOWN_FALLBACK_CHECKLIST = ["Confirm target path", "Confirm proposal vs scoring vs promotion", "Confirm packet-local evidence path"]

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routed here: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(p for p in base.rglob("*.md") if p.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def score_intents(task) -> dict[str, float]:
    text = _task_text(task)
    scores = {intent: 0.0 for intent in INTENT_SIGNALS}
    for intent, cfg in INTENT_SIGNALS.items():
        for keyword in cfg["keywords"]:
            if keyword in text:
                scores[intent] += cfg["weight"]
    return scores

def select_intents(scores: dict[str, float], ambiguity_delta: float = 1.0, max_intents: int = 2) -> list[str]:
    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    if not ranked or ranked[0][1] <= 0:
        return ["QUICK_REFERENCE"]
    selected = [ranked[0][0]]
    if len(ranked) > 1 and ranked[1][1] > 0 and (ranked[0][1] - ranked[1][1]) <= ambiguity_delta:
        selected.append(ranked[1][0])
    return selected[:max_intents]

def route_recursive_agent_resources(task):
    inventory = discover_markdown_resources()
    intents = select_intents(score_intents(task))
    loaded = []
    seen = set()

    def load_if_available(relative_path: str) -> None:
        guarded = _guard_in_skill(relative_path)
        if guarded in inventory and guarded not in seen:
            load(guarded)
            loaded.append(guarded)
            seen.add(guarded)

    load_if_available(DEFAULT_RESOURCE)
    for intent in intents:
        for relative_path in RESOURCE_MAP.get(intent, []):
            load_if_available(relative_path)

    text = _task_text(task)
    if any(keyword in text for keyword in ON_DEMAND_KEYWORDS):
        for paths in RESOURCE_MAP.values():
            for relative_path in paths:
                load_if_available(relative_path)

    runtime_assets = list(RUNTIME_ASSETS["ALWAYS"])
    if "MODEL_BENCHMARK" in intents:
        runtime_assets.extend(RUNTIME_ASSETS.get("MODEL_BENCHMARK", []))

    if not loaded:
        load_if_available(DEFAULT_RESOURCE)
    return {"intents": intents, "resources": loaded, "runtime_assets": runtime_assets}
```

---

## 3. LANE A: AGENT-IMPROVEMENT

Lane A improves a bounded agent `.md` file. Command: `/deep:start-agent-improvement-loop`. It runs the proposal-first loop in three modes (initialization, proposal and evaluation, promotion and recovery) and scores candidates with dynamic-mode 5-dimension scoring.

### Mode 1: Runtime Initialization

1. Confirm the spec folder, target path, execution mode, and active target profile.
2. Create `{spec_folder}/improvement/` plus the packet-local `candidates/`, `benchmark-runs/`, and `archive/` directories when needed.
3. Copy in the runtime config, charter, strategy, and boundary templates.
4. Record baseline state in the append-only ledger before the first candidate run.

### Mode 2: Proposal and Evaluation

1. Read the charter, boundary file, target profile, and canonical target surface.
2. Run `scripts/agent-improvement/scan-integration.cjs` to discover all surfaces the target agent touches.
3. Write exactly one bounded candidate under the packet-local `candidates/` directory.
4. Run `scripts/agent-improvement/score-candidate.cjs` to evaluate the candidate via dynamic-mode 5-dimension scoring (the sole supported path).
5. Run `scripts/model-benchmark/run-benchmark.cjs` to measure produced outputs against the active fixture set.
6. Append score and benchmark results to the packet-local ledger.
7. Run `scripts/shared/reduce-state.cjs` to refresh the dashboard and experiment registry.

### Mode 2A: Stress-Test Failure Paths Before Promotion Claims

For changes that alter agent discipline, run at least one same-task A/B stress scenario before recommending promotion:

1. Call A: a generic improvement attempt against an isolated sandbox copy of the target.
2. Reset the sandbox to its baseline copy.
3. Call B: the disciplined `/deep:start-agent-improvement-loop` path against the identical prompt and files.
4. Judge only grep/file/diff/exit-code signals: helper invocation, packet-local candidate boundary, no canonical or mirror mutation before promotion, benchmark journal boundary, legal-stop gate keys, and stop-reason correctness.

Do not treat `Read(SKILL.md)` or `skill(deep-agent-improvement)` as evidence that this protocol executed.

### 5-Dimension Evaluation Framework

Dynamic mode is the only scoring path. Scoring evaluates five dimensions:

| Dimension | Weight | What It Measures |
| --- | --- | --- |
| Structural Integrity | 0.20 | Agent template compliance (required sections present) |
| Rule Coherence | 0.25 | ALWAYS/NEVER rules align with workflow steps |
| Integration Consistency | 0.25 | Mirrors in sync, commands reference agent, skills reference agent |
| Output Quality | 0.15 | Output verification items present, no placeholder content |
| System Fitness | 0.15 | Permission alignment, resource references valid, frontmatter complete |

Profiles are generated on the fly from any agent file via `scripts/agent-improvement/generate-profile.cjs`. No static profiles are shipped. Every target is evaluated against its own derived structure and rules.

### Mode 3: Promotion and Recovery

1. Promote only when prompt scoring, benchmark status, repeatability, boundary, and approval gates all pass.
2. Use `scripts/shared/promote-candidate.cjs` for guarded canonical mutation.
3. Use `scripts/agent-improvement/rollback-candidate.cjs` plus direct comparison evidence when the canonical target must be restored.
4. Treat mirror drift as downstream packaging work and review it separately with `scripts/agent-improvement/check-mirror-drift.cjs`.

---

## 4. LANE B: MODEL-BENCHMARK

Lane B benchmarks a model or prompt framework instead of mutating an agent file. Command: `/deep:start-model-benchmark-loop`. Runtime entry is `scripts/shared/loop-host.cjs --mode=model-benchmark`. It reuses the three pluggable seams (candidate-source, dispatcher, scorer) and keeps the default agent-improvement path byte-identical when no mode flag is set.

1. **Entry point**: `scripts/shared/loop-host.cjs` resolves the mode. `--mode=agent-improvement` (or no flag) routes to `scripts/agent-improvement/score-candidate.cjs`. `--mode=model-benchmark` runs `scripts/shared/materialize-benchmark-fixtures.cjs` then `scripts/model-benchmark/run-benchmark.cjs`. An unknown mode warns and falls back to agent-improvement.
2. **Dispatcher**: `scripts/model-benchmark/dispatch-model.cjs` is the model-agnostic dispatcher (executor-routing map across cli-opencode, cli-claude-code, cli-codex, cli-gemini, cli-devin). It is loaded only on the model-benchmark path, never in agent-improvement mode.
3. **Scorer selection**: `run-benchmark.cjs --scorer pattern` (default) uses the heading/pattern matcher. `--scorer 5dim` routes materialized outputs through `scripts/model-benchmark/scorer/score-model-variant.cjs`, the ported 120/003 five-dimension scorer (deterministic checks plus a pluggable grader). `--grader noop` (default) stays deterministic with no model dispatch. `--grader mock` or `--grader llm` select the stub or real grader.
4. **Mode-aware records and promotion path**: every state record carries `mode: agent-improvement` or `mode: model-benchmark`, and benchmark reports carry `scoringMethod: pattern|5dim`, so the reducer (`reduce-state.cjs`) and downstream consumers can attribute results per lane. Record-level mode metadata lives in the reducer, NOT in the promoter. Lane A promotes a scored candidate through the agent-scored gates in `promote-candidate.cjs`. Lane B promotes from the benchmark report: pass `promote-candidate.cjs --benchmark-report <report.json>`, and when the report status is `benchmark-complete` with a passing benchmark recommendation, the benchmark-report path drives promotion and bypasses the agent-scored-file requirement. The promoter is NOT otherwise lane-branching beyond this benchmark-report path, both lanes share the same single canonical-target guard, archive, and runtime-mirror sync.
5. **Hardening env gates**: set `DEEP_AGENT_ALLOW_CRITERIA_EXEC=0` to refuse criteria-driven shell execution in the 5-dim scorer. When the gate is off, BOTH criteria-exec paths are refused: the deterministic-criterion `execSync` in `score-model-variant.cjs` AND the bundle-gate Layer-3 acceptance-command `execSync` in `bundle-gate.cjs`. Set `DEEP_AGENT_GRADER_CACHE_RAW=0` to redact raw grader output from the on-disk cache. Both default to the permissive value for backward-compat. **Trusted-author default rationale (DOCUMENT-ACCEPT)**: criteria commands originate only from benchmark profiles authored by the operator running the loop, and the deterministic criterion runs in the same trust domain as the loop itself, so the default-on behavior is an intended trusted-author boundary rather than an untrusted-input risk. A shipped backward-compat test asserts the criterion runs by default, so flipping the default would be a behavior change with test impact, not a silent hardening. Hardened or shared-runner deployments set `DEEP_AGENT_ALLOW_CRITERIA_EXEC=0` to fail closed, and `DEEP_AGENT_GRADER_CACHE_RAW=0` to redact cached grader output.

---

## 5. SUCCESS CRITERIA

- The loop stays proposal-first unless an explicit guarded promotion path is requested
- Benchmark evidence, prompt scoring, and mirror-sync evidence remain separate
- Reducer outputs make the best-known state, rejected runs, infrastructure failures, and stop conditions easy to review
- Operators can onboard a bounded target without weakening boundary or evaluator guardrails

---

## 6. MULTI-ITER METHODOLOGY

For multi-iter evaluation sweeps, a mixed-executor split plus an adjudication pass gives better breadth, better synthesis, and less noise than a single-executor run.

- **Mixed-executor 8+2 split**: run breadth iterations on cli-devin SWE-1.6 and synthesis iterations on cli-codex gpt-5.5. For a 10-iter sweep, that is iters 1-8 breadth and iters 9-10 synthesis.
- **Adjudication iter**: insert a false-positive filter pass before the synthesis iterations (typically the iter-7 mark) so only confirmed findings carry forward. In validation this delivers a 90%+ false-positive reduction, with one pass dropping 9 false-positive and 4 outdated items to take a 20-item queue down to 7.

See `references/model-benchmark/mixed_executor_methodology.md` for the split mechanics, adjudication details, and the full validation evidence.

---

## 7. RUNTIME TRUTH CONTRACTS

### Stop-Reason Taxonomy

Every improvement session termination MUST produce both a `stopReason` (why) and a `sessionOutcome` (what happened).

**stopReason** (WHY the session ended):

| Reason | Trigger Condition |
| --- | --- |
| `converged` | All legal-stop gate bundles pass and dimension trajectory is stable |
| `maxIterationsReached` | Iteration counter equals `maxIterations` config |
| `blockedStop` | One or more legal-stop gate bundles fail when convergence math would otherwise trigger stop |
| `manualStop` | Operator cancels the session |
| `error` | Infra failure, script crash, or unrecoverable condition |
| `stuckRecovery` | Session detected stuck state and exhausted recovery options |

**sessionOutcome** (WHAT happened to the candidate):

| Outcome | When Used |
| --- | --- |
| `keptBaseline` | Baseline was retained because candidate did not improve |
| `promoted` | Candidate was promoted to canonical target |
| `rolledBack` | Promoted candidate was rolled back to prior state |
| `advisoryOnly` | Session completed for assessment only; no mutation attempted |

### Audit Journal Protocol

All journal emission is orchestrator-only (ADR-001). The journal (`improvement-journal.jsonl`) is an append-only JSONL file capturing lifecycle events. Separate from the existing `agent-improvement-state.jsonl` which tracks proposal/evaluation data.

**Script**: `scripts/shared/improvement-journal.cjs`

Event types: `session_start`, `session_initialized`, `integration_scanned`, `candidate_generated`, `candidate_scored`, `benchmark_completed`, `gate_evaluation`, `legal_stop_evaluated`, `blocked_stop`, `promotion_attempt`, `promotion_result`, `rollback`, `rollback_result`, `trade_off_detected`, `mutation_proposed`, `mutation_outcome`, `session_ended`, `session_end`

### Static Benchmark Assets

The reusable benchmark contract ships with the skill, not with each spec packet:

- Profile: `assets/model-benchmark/benchmark-profiles/default.json`
- Fixtures: `assets/model-benchmark/benchmark-fixtures/*.json`
- Materializer: `scripts/shared/materialize-benchmark-fixtures.cjs`
- Runner: `scripts/model-benchmark/run-benchmark.cjs`

The command workflow first materializes static fixture JSON into packet-local markdown under `{spec_folder}/improvement/benchmark-outputs/{fixture.id}.md`, then runs `run-benchmark.cjs --profile .opencode/skills/deep-agent-improvement/assets/model-benchmark/benchmark-profiles/default.json --outputs-dir {spec_folder}/improvement/benchmark-outputs`. The runner writes `{spec_folder}/improvement/benchmark-outputs/report.json` with `status:"benchmark-complete"` and appends a `benchmark_run` row to `{spec_folder}/improvement/agent-improvement-state.jsonl`.

`benchmark_completed` may be emitted only after `benchmark-outputs/report.json` exists. Repeatability output from `benchmark-stability.cjs` is separate evidence and does not by itself prove benchmark completion.

### Legal-Stop Gate Bundles

A session may NOT claim `converged` unless all five gate bundles pass: `contractGate`, `behaviorGate`, `integrationGate`, `evidenceGate`, and `improvementGate`. The orchestrator emits `legal_stop_evaluated` with nested `details.gateResults` before any `session_end`. Failures emit `blocked_stop` with `failedGates[]` and `stopReason:"blockedStop"`.

### Resume/Continuation Semantics (current release)

Sessions support a single lineage mode today: `new`. Every invocation of the `/deep:start-agent-improvement-loop` workflow starts a fresh session with a new session id and generation 1. Multi-generation lineage modes (`resume`, `restart`, `fork`, `completed-continue`) were described in earlier drafts but have no shipped runtime wiring in the deep-agent-improvement workflow, reducer, or journal consumer.

Operators who want to continue evaluating an agent after a prior session SHOULD archive the prior session folder (e.g. move `improve/` to `improve_archive/{timestamp}/`) and re-invoke the command, which starts a new `new`-mode session. The reducer treats each session independently and does not carry ancestry across sessions.

If the long-form lineage feature is implemented later, it will arrive with first-class event emission in `deep_start-agent-improvement-loop_{auto,confirm}.yaml`, reducer ancestry handling in `deep-agent-improvement/scripts/shared/reduce-state.cjs`, and replay fixtures. Until then, treat every session as a standalone evaluation.

### Mutation Coverage Graph

**Script**: `scripts/shared/mutation-coverage.cjs`

Tracks explored dimensions, tried mutation types per dimension, and exhausted mutation sets using `loop_type: "improvement"` namespace isolation (ADR-002). The orchestrator skips mutation types already in the exhausted log.

#### Mutation Signature Dedup

Each mutation entry in `mutation-coverage.json` carries a `signature` field computed as:

```text
signature = sha256(dimension + "\u001f" + mutationType + "\u001f" + targetSection + "\u001f" + normalizedBody64)
```

Where `normalizedBody64` = whitespace-collapsed, lowercased, first 64 characters of the mutation body.

**Dedup behavior:**
- Before proposing a new mutation, `isSignatureSeen()` scans existing `mutations[]` and `exhausted[]` arrays
- If the signature matches, the candidate is skipped with `reason: "EXHAUSTED-FROM: iter-NNN"` recorded in `exhausted[]`
- The `EXHAUSTED-FROM` format references the iteration where the original mutation was tried

**Bypass:**
```bash
export DEEP_AGENT_IMPROVEMENT_SKIP_DEDUP=1  # Force re-evaluation of previously seen signatures
```
When set, `isSignatureSeen()` always returns `{ seen: false }`. Every mutation is considered fresh.

**Backward compatibility:** Legacy `mutation-coverage.json` entries without `signature` field fall back to the existing `dimension::mutationType` dedup in the reducer. No migration required.

**Authoritative storage:** `mutation-coverage.json` `mutations[]` array. `signature` is written by `recordMutation()` and read by `isSignatureSeen()` and `reduce-state.cjs`.

### Dimension Trajectory

Trajectory data records per-iteration dimension scores. Two distinct convergence signals run side by side and must not be conflated. `mutation-coverage.cjs` `checkConvergenceEligibility()` marks a profile convergence-eligible when it has at least 3 data points and every dimension delta across the last 3 points is within `DEFAULT_STABILITY_DELTA` (+/-2), a tolerance band. Separately, `reduce-state.cjs` `stopOnDimensionPlateau` fires the plateau stop only when a dimension's last 3 scores are identical (exact-repeat). The +/-2 trajectory eligibility and the exact-repeat plateau stop are different checks.

Stop-condition counters (`maxConsecutiveTies`, `maxInfraFailuresPerProfile`, `maxWeakBenchmarkRunsPerProfile`) default to disabled, with no cap, unless the runtime config sets them. Only configured counters can trigger `blockedStop`.

### Trade-Off Detection

**Script**: `scripts/agent-improvement/trade-off-detector.cjs`

Detects Pareto trade-offs: flags when improvement > +3 in one dimension causes regression < -3 in hard dimensions (structural, integration, systemFitness) or < -5 in soft dimensions (ruleCoherence, outputQuality). Blocks promotion for Pareto-dominated candidates.

### Parallel Candidate Waves (Optional)

**Script**: `scripts/agent-improvement/candidate-lineage.cjs`

Disabled by default (`parallelWaves.enabled: false` in config, ADR-004). When enabled, spawns 2-3 candidates with different mutation strategies. Activation requires: exploration-breadth score above threshold, 3+ unresolved mutation families, and 2 consecutive tie/plateau iterations.

### Weight Optimizer (Advisory Only)

**Script**: `scripts/agent-improvement/benchmark-stability.cjs`

Reads historical session data and emits a weight-recommendation report. Recommendations do NOT auto-apply (ADR-005). Requires minimum session count threshold before producing recommendations.

---

### Journal Wiring Contract

Journal emission is orchestrator-only. The target agent being evaluated never writes journal rows directly. Only the visible YAML workflow or an operator-side wrapper invokes `scripts/shared/improvement-journal.cjs`.

The CLI contract is:

```bash
node .opencode/skills/deep-agent-improvement/scripts/shared/improvement-journal.cjs --emit <eventType> --journal <journal_path> --details '<json>'
```

The helper validates event type plus `session_end` or `session_ended` details, and the CLI entrypoint stores boundary context under `details`. Top-level `iteration` and `candidateId` fields are available only through the JS API, not through the CLI wrapper used by the YAML workflows.

### Boundary Points

Journal boundaries are `session_start` after baseline setup, per-iteration candidate/scoring/gate events, and `session_end` after synthesis or terminal stop. Required details include session id, target, iteration/candidate paths, scores, stop reason, session outcome, and total iterations.

### Frozen Helper Enums

`improvement-journal.cjs` currently exports and validates the following enums:

- `STOP_REASONS`: `converged`, `maxIterationsReached`, `blockedStop`, `manualStop`, `error`, `stuckRecovery`
- `SESSION_OUTCOMES`: `keptBaseline`, `promoted`, `rolledBack`, `advisoryOnly`

Keep session-end emissions aligned to those helper-owned values until the helper contract itself changes. Labels such as `convergedImprovement`, `plateau`, `benchmarkPlateau`, `rejected`, `deferred`, `blocked`, or `errored` are not accepted by the current CLI validator. Plateau detection is a reducer/stop-rule condition. It must reconcile to one of the canonical stop reasons above when emitted as `details.stopReason`.

### Orchestrator Ownership

- Auto mode emits `session_start` after `step_record_baseline`, then emits `candidate_generated`, `candidate_scored`, and `gate_evaluation` inside each loop iteration, and finally emits `session_end` after synthesis.
- Confirm mode mirrors the same boundaries, with `gate_evaluation` emitted after the operator-facing approval gate is resolved.
- Operators invoking the helper manually must use the same boundary order so replay and reducer consumers see a consistent journal shape.

### Reducer Consumer Side

The reducer is the consumer for replay artifacts on refresh. Every `scripts/shared/reduce-state.cjs` pass now attempts to read:

- `improvement-journal.jsonl`
- `candidate-lineage.json`
- `mutation-coverage.json`

These inputs remain optional. Missing files do not fail the reducer. The corresponding registry field is set to `null` so dashboard and registry refreshes still complete.

For legal-stop replay, the reducer consumes `details.gateResults` from the latest `legal_stop_evaluated` event and surfaces it as `journalSummary.latestLegalStop.gateResults` in `experiment-registry.json` plus the dashboard's latest legal-stop table.

### Journal Replay Consumer

The reducer consumes replay artifacts instead of running a separate orchestrator-only synthesis step. During each refresh pass, `scripts/shared/reduce-state.cjs` reads the following artifacts when present:

- `improvement-journal.jsonl` to summarize last session boundaries, total replayed events, per-event counts, and terminal `stopReason` / `sessionOutcome`
- `candidate-lineage.json` to summarize lineage depth, total candidate count, and the latest candidate leaf
- `mutation-coverage.json` to summarize mutation coverage ratio and uncovered mutations

The reducer writes these summaries into new top-level registry fields:

- `journalSummary`
- `candidateLineage`
- `mutationCoverage`

Graceful degradation is required: if any artifact is missing, unreadable, or not yet generated for the current runtime, the reducer preserves the rest of the registry and records `null` for that field instead of throwing.

The dashboard now also includes a dedicated **Sample Quality** section. This separates replay/stability sample sufficiency from benchmark failures so operators can tell the difference between a true regression and an iteration that simply lacked enough data for trade-off or replay-stability trust.

## 8. RULES

### ✅ ALWAYS

- Read the charter, boundary file, and target profile before creating a candidate
- Keep the ledger append-only
- Treat the scorer as independent from the mutator
- Preserve repeatability evidence when benchmark claims are made
- Prefer the simpler candidate when scores tie
- Keep benchmark evidence separate from mirror-drift packaging work
- Require integration evidence to name each expected runtime mirror path explicitly (`.claude/agents`, `.codex/agents`, `.gemini/agents`, plus any declared extra mirrors) before trusting `integrationGate`

### ❌ NEVER

- Mutate the canonical target during proposal-only mode
- Broaden scope beyond the active boundary
- Treat runtime mirrors as experiment truth in the same phase as canonical evaluation
- Treat a stale placeholder mirror path as equivalent to a real runtime mirror
- Hide rejected runs, weak benchmark results, or infra failures
- Promote non-canonical targets even if they benchmark well

### ⚠️ ESCALATE IF

- The target profile and boundary file disagree about mutability or target family
- The benchmark runner cannot produce stable repeatability results
- Promotion evidence is incomplete but canonical mutation is still being requested
- Documentation edits would change the trust boundary rather than clarify it

---

## 9. REFERENCES

Core references: `README.md`, `references/shared/quick_reference.md`, `references/shared/loop_protocol.md`, evaluator/promotion/rollback/no-go/onboarding docs, runtime assets under `assets/`, benchmark assets, and helper scripts for scoring, reduction, promotion, rollback, scanning, drift, journal, mutation coverage, trade-offs, candidate lineage, and benchmark stability.

---

## 10. INTEGRATION POINTS

- `/deep:start-agent-improvement-loop` initializes and runs the Lane A bounded workflow
- `/deep:start-model-benchmark-loop` initializes and runs the Lane B model-benchmark workflow
- `.opencode/agents/deep-agent-improvement.md` provides the mutator surface for deep-agent-improvement runs
- `sk-doc` validators enforce package-shape, README, and markdown document consistency
- `system-spec-kit` packet validation proves phase records remain truthful

---

## 11. REFERENCES AND RELATED RESOURCES

The router discovers reference, asset, and script docs dynamically. Start with `references/shared/loop_protocol.md`, `references/shared/quick_reference.md`, `references/model-benchmark/benchmark_operator_guide.md`, `references/model-benchmark/evaluator_contract.md`, `references/agent-improvement/integration_scanning.md`, `references/agent-improvement/mirror_drift_policy.md`, `references/shared/promotion_rules.md`, then load task-specific resources from `references/`, templates from `assets/`, and automation from `scripts/` when present.

Scripts: `scripts/agent-improvement/benchmark-stability.cjs`, `scripts/agent-improvement/candidate-lineage.cjs`, `scripts/agent-improvement/check-mirror-drift.cjs`, `scripts/agent-improvement/generate-profile.cjs`, `scripts/shared/improvement-journal.cjs`, `scripts/shared/materialize-benchmark-fixtures.cjs`, `scripts/shared/mutation-coverage.cjs`, `scripts/shared/promote-candidate.cjs`, `scripts/shared/reduce-state.cjs`, `scripts/agent-improvement/rollback-candidate.cjs`, `scripts/model-benchmark/run-benchmark.cjs`, `scripts/agent-improvement/scan-integration.cjs`, `scripts/agent-improvement/score-candidate.cjs`, `scripts/agent-improvement/trade-off-detector.cjs`.

Related skills: `sk-doc` for package-shape and markdown validation, `system-spec-kit` for packet validation, and `sk-prompt` when prompt surfaces need evaluator-backed rewriting.
