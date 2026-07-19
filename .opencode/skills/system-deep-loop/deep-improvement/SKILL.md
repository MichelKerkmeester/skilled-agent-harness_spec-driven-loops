---
name: deep-improvement
description: "Evaluator-first bounded agent improvement: 5-dim scoring, dynamic profiling, packet-local candidates, guarded promotion."
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
version: 1.17.0.1
triggers:
  - deep-improvement
  - agent improvement loop
  - bounded agent improvement
  - 5-dimension scoring
  - integration scanner
  - dynamic profiling
  - model-benchmark mode
  - benchmark a model or prompt framework
  - skill-benchmark mode
---

<!-- Keywords: deep-improvement, agent-improvement, benchmark-harness, score-candidate, promote-candidate, rollback-candidate -->

# Recursive Agent: Evaluator-First Improvement Orchestrator

Evaluator-first workflow for testing whether a bounded agent surface can be improved without immediately mutating the source of truth. It combines packet-local candidates, deterministic scoring, repeatable benchmarks, and explicit promotion or rollback gates.

---

## 1. WHEN TO USE

### Three Co-Equal Lanes

This skill supports three co-equal use-case lanes that share the same candidate, dispatcher, and scorer seams:

| Lane | Pick when | Command |
| --- | --- | --- |
| **Lane A: Agent-Improvement** | You want to improve a bounded agent `.md` file | `/deep:agent-improvement` |
| **Lane B: Model-Benchmark** | You want to benchmark a model or prompt framework | `/deep:model-benchmark` |
| **Lane C: Skill-Benchmark** | You want to diagnose a skill's real-world routing, discovery, efficiency, and usefulness | `/deep:skill-benchmark` |

Lane A is detailed in §3 (Runtime Initialization, Proposal and Evaluation, Promotion and Recovery). Lane B is detailed in §4. Lane C (skill-benchmark) is documented in `references/skill-benchmark/` (operator guide, scoring contract, scenario authoring) and run via `loop-host.cjs --mode=skill-benchmark`. All lanes run the same loop shape and keep the agent-improvement path byte-identical when no mode flag is set.

### Activation Triggers

Use this skill when:
- You want to test whether an agent prompt or instruction surface can be improved (Lane A)
- You want to benchmark a model or prompt framework against repeatable fixtures (Lane B)
- You want to diagnose whether a skill is well-routed, discoverable, efficient, and useful in practice (Lane C)
- The mutation boundary is explicit and narrow
- You need packet-local evidence instead of ad hoc prompt tweaking
- You need target-specific benchmark or scoring rules before any canonical mutation
- Promotion must stay gated behind independent evidence plus operator approval

### Primary Use Cases

- **Lane A** — proposal-first loop for any bounded agent file: packet-local candidates, dynamic 5-dimension scoring, append-only evidence, guarded promotion/rollback with drift review kept separate. See §3.
- **Lane B** — benchmarks a model or prompt framework (not an agent file) against a benchmark profile, scoring produced outputs; shares the candidate, dispatcher, and scorer seams with Lane A. See §4.
- **Lane C** — diagnoses whether a *skill* is well-routed, discoverable, efficient, and useful in practice; emits a ranked Skill Benchmark Report and is diagnostic by default (no target mutation). See `references/skill-benchmark/operator-guide.md`.

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

**Lane awareness**: resources are organized by lane. `references/agent-improvement/` + `assets/agent-improvement/` carry Lane A guidance, `references/model-benchmark/` + `assets/model-benchmark/` carry Lane B guidance, and `references/skill-benchmark/` + `assets/skill-benchmark/` carry Lane C guidance. `RESOURCE_MAP` routes the `MODEL_BENCHMARK` and `SKILL_BENCHMARK` intents to their lane references, and `RUNTIME_ASSETS` loads each lane's profile only when its intent is selected. The `ALWAYS` and shared `references/shared/` resources apply to all three lanes.

### Resource Loading Levels

| Level | When to Load | Resources |
| --- | --- | --- |
| ALWAYS | Every skill invocation | `references/shared/quick-reference.md` |
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
DEFAULT_RESOURCE = "references/shared/quick-reference.md"

INTENT_SIGNALS = {
    "QUICK_REFERENCE": {"weight": 3, "keywords": ["quick reference", "short reminder", "command example"]},
    "LOOP_EXECUTION": {"weight": 4, "keywords": ["run loop", "proposal", "candidate", "score candidate", "benchmark"]},
    "EVALUATION_POLICY": {"weight": 4, "keywords": ["evaluator", "rubric", "contract", "repeatability", "no-go"]},
    "PROMOTION_OPERATIONS": {"weight": 4, "keywords": ["promote", "rollback", "mirror drift", "approval gate"]},
    "TARGET_ONBOARDING": {"weight": 4, "keywords": ["new target", "target profile", "onboarding", "second target"]},
    "INTEGRATION_SCAN": {"weight": 4, "keywords": ["integration", "scan surfaces", "mirror sync", "dynamic profile", "5-dimension"]},
    "MODEL_BENCHMARK": {"weight": 5, "keywords": ["benchmark a model", "benchmark a prompt framework", "optimize a model", "model-benchmark", "model benchmark"]},
    "SKILL_BENCHMARK": {"weight": 5, "keywords": ["benchmark a skill", "skill benchmark", "skill routing", "unprompted discovery", "routing accuracy", "skill-benchmark"]},
    "FULL_SETUP": {"weight": 3, "keywords": ["full setup", "initialize runtime", "charter", "strategy"]},
}

RESOURCE_MAP = {
    "QUICK_REFERENCE": ["references/shared/quick-reference.md"],
    "LOOP_EXECUTION": ["references/shared/loop-protocol.md", "references/model-benchmark/benchmark-operator-guide.md", "references/shared/runtime-truth-contracts.md", "references/agent-improvement/candidate-proposal-format.md"],
    "EVALUATION_POLICY": ["references/model-benchmark/evaluator-contract.md", "references/shared/promotion-rules.md", "references/shared/heldout-and-gold-sets.md", "references/agent-improvement/score-dimensions.md", "assets/agent-improvement/improvement-config-reference.md"],
    "PROMOTION_OPERATIONS": ["references/shared/rollback-runbook.md", "references/agent-improvement/mirror-drift-policy.md", "references/shared/promotion-rules.md", "references/agent-improvement/stress-test-protocol.md", "references/shared/promotion-gate-contract.md"],
    "TARGET_ONBOARDING": ["references/agent-improvement/target-onboarding.md"],
    "INTEGRATION_SCAN": ["references/agent-improvement/integration-scanning.md", "references/model-benchmark/evaluator-contract.md", "references/agent-improvement/profiling-audit-log.md"],
    "MODEL_BENCHMARK": ["references/model-benchmark/benchmark-operator-guide.md", "references/model-benchmark/evaluator-contract.md", "references/model-benchmark/lane-b-mechanics.md", "references/model-benchmark/mixed-executor-methodology.md", "assets/model-benchmark/benchmark-fixtures/reviewer-schema.md"],
    "SKILL_BENCHMARK": ["references/skill-benchmark/operator-guide.md", "references/skill-benchmark/scoring-contract.md", "references/skill-benchmark/scenario-authoring.md", "references/skill-benchmark/routing-optimization.md", "assets/skill-benchmark/fixtures/deep-loop-workflows/routing-precision.md"],
    "FULL_SETUP": ["assets/agent-improvement/improvement-charter.md", "assets/agent-improvement/improvement-strategy.md"],
}

RUNTIME_ASSETS = {
    "ALWAYS": ["assets/agent-improvement/improvement-config.json", "assets/agent-improvement/target-manifest.jsonc"],
    "MODEL_BENCHMARK": ["assets/model-benchmark/benchmark-profiles/default.json"],
    "SKILL_BENCHMARK": ["assets/skill-benchmark/default-profile.json"],
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
    if "SKILL_BENCHMARK" in intents:
        runtime_assets.extend(RUNTIME_ASSETS.get("SKILL_BENCHMARK", []))

    if not loaded:
        load_if_available(DEFAULT_RESOURCE)
    return {"intents": intents, "resources": loaded, "runtime_assets": runtime_assets}
```

---

## 3. LANE A: AGENT-IMPROVEMENT

Lane A improves a bounded agent `.md` file. Command: `/deep:agent-improvement`. It runs the proposal-first loop in three modes (initialization, proposal and evaluation, promotion and recovery) and scores candidates with dynamic-mode 5-dimension scoring across structural integrity (0.20), rule coherence (0.25), integration consistency (0.25), output quality (0.15), and system fitness (0.15) — profiles are generated on the fly per target via `scripts/agent-improvement/generate-profile.cjs`; no static profiles ship.

1. **Init**: confirm spec folder/target/mode/profile, create `{spec_folder}/improvement/` plus `candidates/`, `benchmark-runs/`, `archive/`, copy in runtime templates, record baseline in the append-only ledger.
2. **Propose + evaluate**: read charter/boundary/profile/target, run `scan-integration.cjs`, write exactly one bounded candidate under `candidates/`, score it with `score-candidate.cjs` (dynamic 5-dimension, the sole supported path), benchmark it with `run-benchmark.cjs`, append results to the ledger, refresh state with `reduce-state.cjs`.
3. **Promote + recover**: promote only when scoring, benchmark status, repeatability, boundary, and approval gates all pass, via `promote-candidate.cjs`; roll back with `rollback-candidate.cjs` plus direct comparison evidence; treat mirror drift as separate downstream work via `check-mirror-drift.cjs`.

For changes that alter agent discipline, run a same-task A/B stress scenario (isolated sandbox baseline vs. the disciplined path, judged only on grep/file/diff/exit-code signals) before recommending promotion — reading `SKILL.md` is not evidence the protocol executed. See `references/agent-improvement/stress-test-protocol.md` for the full procedure, `references/shared/loop-protocol.md` for the complete step-by-step INIT/PROPOSE/SCORE/PROMOTE lifecycle, and `references/agent-improvement/score-dimensions.md` for the full per-dimension scoring rubric.

---

## 4. LANE B: MODEL-BENCHMARK

Lane B benchmarks a model or prompt framework instead of mutating an agent file. Command: `/deep:model-benchmark`. Runtime entry is `scripts/shared/loop-host.cjs --mode=model-benchmark`. It reuses the three pluggable seams (candidate-source, dispatcher, scorer) and keeps the default agent-improvement path byte-identical when no mode flag is set.

- **Entry + dispatch**: `loop-host.cjs` resolves `--mode=agent-improvement` (default) vs `--mode=model-benchmark`; the model-agnostic dispatcher `scripts/model-benchmark/dispatch-model.cjs` loads only on the model-benchmark path.
- **Scoring**: `run-benchmark.cjs --scorer pattern` (default) uses the heading/pattern matcher; `--scorer 5dim` routes through the ported 120/003 five-dimension scorer with a pluggable `--grader noop|mock|llm` (default `noop`, deterministic).
- **Promotion**: state records and reports carry `mode`/`scoringMethod` for lane attribution. Lane A promotes through the agent-scored gates in `promote-candidate.cjs`; Lane B promotes from the benchmark report via `promote-candidate.cjs --benchmark-report <report.json>` when status is `benchmark-complete` with a passing recommendation — both lanes still share one canonical-target guard, archive, and runtime-mirror sync.
- **Hardening**: `DEEP_AGENT_ALLOW_CRITERIA_EXEC=0` refuses criteria-driven shell execution in both the 5-dim scorer and the bundle-gate Layer-3 acceptance command; `DEEP_AGENT_GRADER_CACHE_RAW=0` redacts raw grader output from the cache. Both default permissive (trusted-author boundary: criteria come only from operator-authored benchmark profiles in the same trust domain as the loop) — flip both for hardened/shared-runner deployments.

Full dispatcher, scorer, promotion-path, and hardening-rationale detail: `references/model-benchmark/lane-b-mechanics.md`.

---

## 5. SUCCESS CRITERIA

- The loop stays proposal-first unless an explicit guarded promotion path is requested
- Benchmark evidence, prompt scoring, and mirror-sync evidence remain separate
- Reducer outputs make the best-known state, rejected runs, infrastructure failures, and stop conditions easy to review
- Operators can onboard a bounded target without weakening boundary or evaluator guardrails

---

## 6. HOW IT WORKS (Multi-Iteration Methodology)
For multi-iter evaluation sweeps, a mixed-executor split plus an adjudication pass gives better breadth, better synthesis, and less noise than a single-executor run.

- **Mixed-executor 8+2 split**: run breadth iterations on a breadth executor (e.g. cli-opencode or cli-opencode with a fast model) and synthesis iterations on a synthesis executor (e.g. cli-opencode gpt-5.5). For a 10-iter sweep, that is iters 1-8 breadth and iters 9-10 synthesis.
- **Adjudication iter**: insert a false-positive filter pass before the synthesis iterations (typically the iter-7 mark) so only confirmed findings carry forward. In validation this delivers a 90%+ false-positive reduction, with one pass dropping 9 false-positive and 4 outdated items to take a 20-item queue down to 7.

See `references/model-benchmark/mixed-executor-methodology.md` for the split mechanics, adjudication details, and the full validation evidence.

---

## 7. RUNTIME TRUTH CONTRACTS

Every improvement session termination MUST produce both a `stopReason` (why) and a `sessionOutcome` (what happened), drawn from a small frozen enum validated by `scripts/shared/improvement-journal.cjs`:

- **stopReason**: `converged` (all 5 legal-stop gate bundles pass + trajectory stable), `maxIterationsReached`, `blockedStop` (a gate bundle failed), `manualStop`, `error`, `stuckRecovery`
- **sessionOutcome**: `keptBaseline`, `promoted`, `rolledBack`, `advisoryOnly`

Journal emission is orchestrator-only (ADR-001) — the target agent never writes journal rows. The append-only `improvement-journal.jsonl` records lifecycle events (`session_start`, `candidate_scored`, `gate_evaluation`, `legal_stop_evaluated`, `promotion_result`, `session_end`, etc.) via `scripts/shared/improvement-journal.cjs --emit <eventType> --journal <path> --details '<json>'`. A session may NOT claim `converged` unless all five gate bundles pass: `contractGate`, `behaviorGate`, `integrationGate`, `evidenceGate`, `improvementGate`.

**Resume caveat (current release):** sessions support only `new` lineage today. Every `/deep:agent-improvement` invocation starts a fresh session id and generation 1 — `resume`/`restart`/`fork`/`completed-continue` have no shipped runtime wiring despite appearing in earlier drafts. To continue evaluating an agent, archive the prior session folder and re-invoke the command; the reducer never carries ancestry across sessions.

Static benchmark assets (profile, fixtures, materializer, runner) ship with the skill under `assets/model-benchmark/` and `scripts/shared/materialize-benchmark-fixtures.cjs` / `scripts/model-benchmark/run-benchmark.cjs`. Output location depends on the caller: the static `default.json` regression check embedded in every `/deep:agent-improvement` iteration (Lane A) writes spec-locally to `{spec_folder}/improvement/benchmark-outputs/`, while the standalone `/deep:model-benchmark` command (Lane B) writes to the sk-prompt/prompt-models hub (`.opencode/skills/sk-prompt/prompt-models/benchmarks/{run_label}/`), keyed by the operator-supplied `run_label`. `scripts/shared/mutation-coverage.cjs` tracks explored/exhausted mutation types with a signature-based dedup (`DEEP_AGENT_IMPROVEMENT_SKIP_DEDUP=1` bypasses it); `scripts/agent-improvement/trade-off-detector.cjs` blocks promotion on Pareto-dominated candidates; `scripts/agent-improvement/candidate-lineage.cjs` (disabled by default) and `scripts/agent-improvement/benchmark-stability.cjs` (advisory-only weight recommendations) round out the coverage/trajectory tooling. The reducer (`scripts/shared/reduce-state.cjs`) replays `improvement-journal.jsonl`, `candidate-lineage.json`, and `mutation-coverage.json` on every refresh into `journalSummary`, `candidateLineage`, and `mutationCoverage` registry fields, degrading gracefully to `null` when an artifact is missing.

Full stop-reason tables, the journal event-type list, the mutation-signature formula, dimension-trajectory vs. plateau distinctions, and orchestrator/reducer boundary ownership are documented in `references/shared/runtime-truth-contracts.md`.

---

## 8. RULES

### ✅ ALWAYS

- Read the charter, boundary file, and target profile before creating a candidate
- Keep the ledger append-only
- Treat the scorer as independent from the mutator
- Preserve repeatability evidence when benchmark claims are made
- Prefer the simpler candidate when scores tie
- Keep benchmark evidence separate from mirror-drift packaging work
- Require integration evidence to name each expected runtime mirror path explicitly (`.claude/agents`, `.opencode/agents`, plus any declared extra mirrors) before trusting `integrationGate`

### ⛔ NEVER

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

Core references: `README.md`, `references/shared/quick-reference.md`, `references/shared/loop-protocol.md`, evaluator/promotion/rollback/no-go/onboarding docs, runtime assets under `assets/`, benchmark assets, and helper scripts for scoring, reduction, promotion, rollback, scanning, drift, journal, mutation coverage, trade-offs, candidate lineage, and benchmark stability.

---

## 10. INTEGRATION POINTS

- `/deep:agent-improvement` initializes and runs the Lane A bounded workflow
- `/deep:model-benchmark` initializes and runs the Lane B model-benchmark workflow
- `/deep:skill-benchmark` runs the Lane C skill diagnostic
- `.opencode/agents/deep-improvement.md` provides the mutator surface for deep-improvement runs
- `sk-doc` validators enforce package-shape, README, and markdown document consistency
- `system-spec-kit` packet validation proves phase records remain truthful

---

## 11. REFERENCES AND RELATED RESOURCES

The router discovers reference, asset, and script docs dynamically. Start with `references/shared/loop-protocol.md`, `references/shared/quick-reference.md`, `references/model-benchmark/benchmark-operator-guide.md`, `references/model-benchmark/evaluator-contract.md`, `references/agent-improvement/integration-scanning.md`, `references/agent-improvement/mirror-drift-policy.md`, `references/shared/promotion-rules.md`, then load task-specific resources from `references/`, templates from `assets/`, and automation from `scripts/` when present.

Scripts: `scripts/agent-improvement/benchmark-stability.cjs` (repeatability and weight recommendations), `scripts/agent-improvement/candidate-lineage.cjs` (candidate parentage across waves), `scripts/agent-improvement/check-mirror-drift.cjs` (runtime mirror drift report), `scripts/agent-improvement/generate-profile.cjs` (dynamic target profile), `scripts/shared/improvement-journal.cjs` (append-only lifecycle journal), `scripts/shared/materialize-benchmark-fixtures.cjs` (static fixture materializer), `scripts/shared/mutation-coverage.cjs` (mutation coverage graph), `scripts/shared/promote-candidate.cjs` (guarded canonical promotion), `scripts/shared/reduce-state.cjs` (dashboard and registry reducer), `scripts/shared/loop-host.cjs` (deep-loop host entrypoint), `scripts/agent-improvement/rollback-candidate.cjs` (promotion rollback), `scripts/model-benchmark/run-benchmark.cjs` (Lane B fixture runner), `scripts/model-benchmark/sweep-benchmark.cjs` (Lane B matrix sweep and scoring), `scripts/agent-improvement/scan-integration.cjs` (integration surface scanner), `scripts/agent-improvement/score-candidate.cjs` (Lane A candidate scorer), `scripts/agent-improvement/trade-off-detector.cjs` (Pareto trade-off detector), `scripts/skill-benchmark/run-skill-benchmark.cjs` (Lane C orchestrator), `scripts/skill-benchmark/live-executor.cjs` (Lane C live dispatch executor), `scripts/skill-benchmark/score-skill-benchmark.cjs` (Lane C D1-D5 scorer), `scripts/skill-benchmark/d4-ablation.cjs` (D4 and D4-R ablation), `scripts/skill-benchmark/build-report.cjs` (Lane C markdown report renderer), `scripts/skill-benchmark/executor-dispatch.cjs` (Lane C executor router), `scripts/skill-benchmark/router-replay.cjs` (router-mode replay harness), `scripts/skill-benchmark/advisor-probe.cjs` (D1-inter deterministic advisor probe), `scripts/skill-benchmark/d5-connectivity.cjs` (D5 router-connectivity drift guard), `scripts/skill-benchmark/contamination-lint.cjs` (skill-off contamination linter), `scripts/skill-benchmark/load-playbook-scenarios.cjs` (playbook scenario loader), `scripts/skill-benchmark/playbook-generator.cjs` (playbook scenario generator), `scripts/skill-benchmark/browser-executor.cjs` (Lane C browser-trace executor), and `scripts/model-benchmark/dispatch-model.cjs` (Lane B per-cell dispatch envelope). This list names the lane-level scripts; per-lane `scorer/`, `lib/`, and `tests/` helpers are discovered dynamically and not all enumerated here.

Related skills: `sk-doc` for package-shape and markdown validation, `system-spec-kit` for packet validation, and `sk-prompt` when prompt surfaces need evaluator-backed rewriting.
