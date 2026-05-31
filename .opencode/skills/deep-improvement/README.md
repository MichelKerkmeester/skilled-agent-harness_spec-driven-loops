---
title: "deep-improvement: Prove an Agent Got Better Before You Ship It"
description: "Evaluator-first skill for bounded agent improvement with 5-dimension integration-aware scoring, dynamic profiling, packet-local candidates, and guarded promotion or rollback."
trigger_phrases:
  - "deep-improvement"
  - "recursive agent"
  - "agent improvement loop"
  - "bounded agent improvement"
  - "5-dimension scoring"
  - "integration scanner"
---

# deep-improvement

Improve an agent the way you ship code: change a copy, measure it, and promote only when the evidence holds.

---

## 1. OVERVIEW

### What This Skill Does

Editing an agent prompt is usually guesswork. You reword a rule, the prompt reads better, you ship it, and you never know whether the agent got stronger or only different. `deep-improvement` replaces that guess with measured evidence.

The skill treats agent improvement as an optimization problem with a paper trail. It scans every surface an agent touches across the repo, derives a scoring profile from the agent's own rules, writes a candidate to a packet-local sandbox, scores it across five deterministic dimensions, and promotes to the canonical file only after evidence and an operator approval both pass. Nothing touches the real agent until you say so.

For packet recovery around an improvement run, `/speckit:resume` stays the canonical surface. Continuity rebuilds from `handover.md`, then `_memory.continuity`, then the remaining spec docs.

### Three Lanes

This skill runs three co-equal lanes that share one evaluator core, journal, and promotion discipline:

| Lane | Use it to | Command |
|---|---|---|
| **Lane A — Agent-Improvement** | Improve a bounded agent `.md` file (the default; most of this README) | `/deep:start-agent-improvement-loop` |
| **Lane B — Model-Benchmark** | Benchmark a model or prompt framework against fixtures | `/deep:start-model-benchmark-loop` |
| **Lane C — Skill-Benchmark** | Diagnose a skill's real-world routing, discovery, efficiency, and usefulness | `/deep:start-skill-benchmark-loop` |

Lane B (the model-benchmark mode) is documented in `SKILL.md` §4 and `references/model-benchmark/`; Lane C (the skill-benchmark mode) in `references/skill-benchmark/`. To match the three lanes, `references/`, `assets/`, and `scripts/` are each split into `agent-improvement/`, `model-benchmark/`, `skill-benchmark/`, and `shared/` subdirs.

### What Changes With This Skill

| Without it | With it |
|---|---|
| Prompt edits are ad hoc and untracked | Every candidate is packet-local and evidence-backed |
| Quality is judged by reading the prompt file | Quality is scored across five deterministic dimensions |
| Integration drift goes unnoticed | The scanner checks mirrors, commands, skills, and routing |
| Promotion risk is hard to audit | Promotion, rollback, and drift review each leave explicit artifacts |
| Only hand-profiled agents can be evaluated | Any agent in `.opencode/agents/` is evaluated through dynamic profiling |

### How This Compares

The `@deep-improvement` agent (under `.opencode/agents/`) is the mutator that writes one candidate. This skill is the evaluator and the rulebook around it: it owns scoring, benchmarking, the promotion gates, and the stop logic. `sk-prompt` rewrites prompt prose on request. This skill decides whether a rewrite earned its place.

### Key Features at a Glance

| Capability | What It Does |
|---|---|
| Integration scanning | Maps every file that references an agent across the repo |
| Dynamic profiling | Derives scoring rules from the agent's own ALWAYS/NEVER/ESCALATE IF sections |
| 5-dimension scoring | Measures structural integrity, rule coherence, integration consistency, output quality, and system fitness |
| Proposal-first edits | Candidates live in a packet-local sandbox, never the canonical file |
| Guarded promotion | Canonical mutation only after scoring, benchmark, repeatability, boundary, and approval all pass |
| Rollback | Restores the pre-promotion backup and records a post-rollback dimensional snapshot |
| Runtime-truth contracts | Stop-reason taxonomy, legal-stop gates, and an append-only journal, matching deep-research and deep-review |

### Requirements

- An existing spec folder for the improvement run
- Node.js 18+ for the `.cjs` scripts
- A target agent file in `.opencode/agents/`
- Packet-local runtime write access

---

## 2. QUICK START

**Step 1: Pick a target and a spec folder.**

Choose any agent under `.opencode/agents/` and the phase spec folder where the run will live.

**Step 2: Run the loop.**

```text
/deep:start-agent-improvement-loop ".opencode/agents/debug.md" :confirm --spec-folder={spec_folder}
```

Expected result: an integration scan, a packet-local candidate under `candidates/`, a five-dimension score, a benchmark report, and a refreshed dashboard.

**Step 3: Run a single script when you only need one signal.**

```bash
# Scan every surface the agent touches
node .opencode/skills/deep-improvement/scripts/agent-improvement/scan-integration.cjs --agent=debug

# Derive a scoring profile from the agent itself
node .opencode/skills/deep-improvement/scripts/agent-improvement/generate-profile.cjs --agent=.opencode/agents/debug.md

# Score across five dimensions (dynamic mode is the only path)
node .opencode/skills/deep-improvement/scripts/agent-improvement/score-candidate.cjs --candidate=.opencode/agents/debug.md
```

Expected result: a JSON artifact with a five-dimension breakdown and a `candidate-acceptable` or `needs-improvement` recommendation.

---

## 3. FEATURES

### 3.1 EVALUATION LOOP

The loop runs from fresh setup through proposal, scoring, and the stop decision. Six features carry it.

- **Initialization.** Sets up a fresh packet-local session before any candidate work. It creates `{spec_folder}/improvement/`, scans the target surface, copies the config, charter, strategy, and manifest, and records baseline state so every later score has something to compare against.
- **Candidate generation.** Writes exactly one bounded candidate under `candidates/` without touching the canonical target. Generation is delegated to the `@deep-improvement` agent, which reads the charter and manifest first and stops before scoring begins, which keeps the mutator and the evaluator independent.
- **Scoring dispatch.** Routes a candidate through `score-candidate.cjs`, records mutation coverage, writes journal events, and refreshes the dashboard through `reduce-state.cjs`. This turns each iteration into append-only evidence instead of a one-off opinion.
- **Promotion gates.** Define the narrow conditions under which a candidate becomes promotion-eligible: explicit approval, benchmark pass, repeatability pass, manifest compliance, and a meaningful score delta. The gate is stricter than the scorer on purpose so a marginal candidate cannot slip through.
- **Rollback.** Restores the archived canonical target after a guarded promotion. Rollback is a separate helper, not a side effect of promotion, so recovery stays explicit and auditable.
- **Plateau detection.** Stops the loop when repeated runs stop moving. `reduce-state.cjs` halts when every tracked dimension repeats its score across the plateau window, which prevents endless iterations that burn cost without improving anything.

### 3.2 INTEGRATION SCANNING

An agent is more than its `.md` file. Three features map the full surface.

- **Surface discovery.** `scan-integration.cjs` inventories the canonical agent file, three runtime mirrors, the `/deep:start-agent-improvement-loop` command markdown, YAML workflow assets, skill references, global docs, and the `system-skill-advisor` routing path. The score reflects the whole integration, not the prompt in isolation.
- **Runtime mirrors.** Checks whether the runtime-specific mirrors still reflect the canonical body. Parity is signal-based: the scanner extracts emphasized strings from the canonical agent and marks a mirror aligned when enough of them appear, so a drifted mirror shows up before it causes a runtime surprise.
- **Command dispatch.** Owns the path that turns the skill into a runnable loop. `/deep:start-agent-improvement-loop` collects setup inputs, picks `:auto` or `:confirm`, and points the operator at the matching YAML workflow, which is where the real agent dispatch and journal emission happen.

### 3.3 FIVE-DIMENSION SCORING

Scoring is deterministic. Every check is regex, string match, or file existence, with no model-as-judge step. Four features build the scoring stack.

- **Five-dimension rubric.** Judges a candidate across five weighted dimensions. Each has a concrete checker, so a score traces back to specific evidence rather than a vibe.

| Dimension | Weight | What It Measures |
|---|---|---|
| Structural integrity | 0.20 | Required agent sections are present |
| Rule coherence | 0.25 | ALWAYS/NEVER rules align with the workflow steps |
| Integration consistency | 0.25 | Mirrors in sync, commands and skills reference the agent |
| Output quality | 0.15 | Output-verification items present, no placeholder content |
| System fitness | 0.15 | Permissions match capabilities, resource references resolve, frontmatter complete |

- **Dynamic profiling.** Generates a target-specific profile straight from the agent being scored. No static profiles ship, so any agent in `.opencode/agents/` is a valid target the moment it exists, with the selection rationale recorded for audit.
- **Deterministic scoring.** `score-candidate.cjs` always runs in `dynamic-5d` mode, regenerates the profile every run, and emits structured dimension details plus a `candidate-acceptable` or `needs-improvement` verdict. A weighted score of 70 or higher reads as acceptable.
- **Dimensional progress.** `reduce-state.cjs` aggregates the JSONL ledger into `experiment-registry.json` and a dashboard, records the latest and best value per dimension, and computes stop status, so an operator can see the trend instead of squinting at raw runs.

### 3.4 RUNTIME-TRUTH CONTRACTS

These contracts match the deep-research and deep-review runtime-truth model so the three loops report termination the same way.

- **Stop-reason taxonomy.** Every session ends with both a `stopReason` (why) and a `sessionOutcome` (what happened to the candidate), drawn from frozen enums, so a stopped run is never ambiguous.
- **Audit journal.** `improvement-journal.cjs` writes an append-only `improvement-journal.jsonl` of lifecycle events. Emission is orchestrator-only, so the agent under evaluation never forges its own evidence.
- **Legal-stop gates.** A session may claim `converged` only when all five gate bundles pass: contract, behavior, integration, evidence, and improvement. A failure emits `blocked_stop` with the failing gates named.
- **Mutation coverage graph.** `mutation-coverage.cjs` tracks explored dimensions and tried mutation types under a `loop_type: "improvement"` namespace, with a signature dedup that skips a mutation already attempted, so the loop stops re-trying what it already ruled out.
- **Trade-off detection.** `trade-off-detector.cjs` flags Pareto trade-offs where a gain in one dimension forces a regression in a hard dimension, and blocks promotion for a dominated candidate.

### 3.5 MULTI-ITER METHODOLOGY

For multi-iter evaluation sweeps, two patterns improve breadth and cut noise.

- **Mixed-executor dispatch.** Runs breadth iterations on cli-devin SWE-1.6 and synthesis iterations on cli-codex gpt-5.5 in an 8+2 split, which balances exploration cost against synthesis quality.
- **Adjudication-iter filter.** Adds a false-positive filter pass before synthesis, typically at the iteration-7 mark, so only confirmed findings reach the synthesis iterations. See `references/model-benchmark/mixed_executor_methodology.md` for the split mechanics and adjudication details.

---

## 4. STRUCTURE

```text
.opencode/skills/deep-improvement/
+-- SKILL.md                    # Router and runtime instructions (three co-equal lanes)
+-- README.md                   # This file
+-- references/                 # operator and policy guides, grouped by lane
|   +-- agent-improvement/      # Lane A (6): integration, scoring, profiling, onboarding, proposal, mirror drift
|   +-- model-benchmark/        # Lane B (3): evaluator contract, benchmark operator guide, mixed-executor
|   `-- shared/                 # both lanes (5): quick reference, loop protocol, promotion rules + gate, rollback
+-- assets/                     # grouped by lane
|   +-- agent-improvement/      # Lane A: charter, strategy, config, manifest
|   `-- model-benchmark/        # Lane B: benchmark fixtures + profiles
+-- scripts/                    # grouped by lane (16 helpers) + lib/ + tests/
|   +-- agent-improvement/      # Lane A (8): scan, profile, score, rollback, drift, trade-off, lineage, stability
|   +-- model-benchmark/        # Lane B (2): run-benchmark, dispatch-model + scorer/ subtree
|   `-- shared/                 # both lanes (6): loop-host, reduce-state, promote, journal, coverage, materialize
+-- feature_catalog/            # Current-state feature inventory (4 categories incl. model-benchmark)
`-- manual_testing_playbook/    # 42 manual scenarios across 9 categories (09 = model-benchmark / Lane B)
```

### References (14, grouped by lane)

Under `references/agent-improvement/` (6), `references/model-benchmark/` (3), and `references/shared/` (5).

| Reference | Purpose |
|---|---|
| `quick_reference.md` | Command and dimension reminder (always loaded) |
| `loop_protocol.md` | End-to-end operator workflow |
| `evaluator_contract.md` | Scoring and benchmark contract |
| `score_dimensions.md` | Per-dimension checker detail |
| `benchmark_operator_guide.md` | Fixture benchmark execution |
| `candidate_proposal_format.md` | Shape of a packet-local candidate |
| `promotion_rules.md` | Keep, reject, promote decisions |
| `promotion_gate_contract.md` | Gate contract the promotion helper enforces |
| `rollback_runbook.md` | Promotion rollback procedure |
| `mirror_drift_policy.md` | Mirror packaging policy |
| `target_onboarding.md` | Adding new bounded targets |
| `integration_scanning.md` | Integration scanner documentation |
| `profiling_audit_log.md` | Profile-selection rationale logging |
| `mixed_executor_methodology.md` | Mixed-executor and adjudication-iter guidance |

### Scripts (16 + lib, grouped by lane)

Under `scripts/agent-improvement/` (8), `scripts/model-benchmark/` (2, plus the `scorer/` subtree), and `scripts/shared/` (6), with `lib/` helpers and `tests/`.

| Script | Purpose |
|---|---|
| `shared/loop-host.cjs` | Mode-switch entry point: routes to Lane A or `--mode=model-benchmark` (Lane B) |
| `model-benchmark/dispatch-model.cjs` | Lane B: run a model against fixtures under prompt-framework variants |
| `model-benchmark/scorer/**` | Lane B: ported decoupled scorer (deterministic checks + LLM grader harness) |
| `scan-integration.cjs` | Discover every surface an agent touches |
| `generate-profile.cjs` | Derive a scoring profile from any agent |
| `score-candidate.cjs` | Score a candidate across five dimensions |
| `run-benchmark.cjs` | Run fixture tests plus integration checks |
| `reduce-state.cjs` | Refresh dashboard and registry from the ledger |
| `promote-candidate.cjs` | Guarded canonical promotion |
| `rollback-candidate.cjs` | Restore the pre-promotion backup |
| `check-mirror-drift.cjs` | Report declared-surface alignment |
| `improvement-journal.cjs` | Append-only lifecycle journal emitter |
| `mutation-coverage.cjs` | Track explored dimensions and mutation types |
| `trade-off-detector.cjs` | Flag and block Pareto-dominated candidates |
| `candidate-lineage.cjs` | Track candidate parentage across waves |
| `benchmark-stability.cjs` | Repeatability and weight-recommendation report |
| `materialize-benchmark-fixtures.cjs` | Render static fixtures into packet-local outputs |
| `lib/promotion-gates.cjs`, `lib/mirror-sync-verify.cjs`, `lib/typed-errors.cjs` | Shared helpers for gates, mirror checks, and typed errors |

### Assets and Catalog

| Path | Purpose |
|---|---|
| `assets/agent-improvement/improvement_config.json` | Runtime config: weights, stop rules, feature flags |
| `assets/agent-improvement/improvement_config_reference.md` | Field-level config documentation |
| `assets/agent-improvement/improvement_charter.md` | Fixed policy charter template |
| `assets/agent-improvement/improvement_strategy.md` | Mutable runtime strategy template |
| `assets/agent-improvement/target_manifest.jsonc` | Target classification and mutability |
| `assets/model-benchmark/benchmark-fixtures/*.json` | Baseline, edge, and improved benchmark fixtures |
| `assets/model-benchmark/benchmark-profiles/default.json` | Default benchmark profile |
| `feature_catalog/feature_catalog.md` | Current-state feature inventory with source anchors |

---

## 5. CONFIGURATION

| Setting | Default | Effect |
|---|---|---|
| `proposalOnly` | `true` | Candidates cannot be promoted until flipped |
| `dynamicProfileEnabled` | `true` | Required. Dynamic mode is the sole scoring path |
| `dimensionWeights` | `{structural: 0.20, ruleCoherence: 0.25, ...}` | Weights for the five-dimension score |
| `stopOnDimensionPlateau` | `true` | Stop when all dimensions plateau |
| `thresholdDelta` | `2` | Minimum score improvement for `candidate-better` |
| `minimumAggregateScore` | `85` | Benchmark pass threshold |

Field-level documentation lives in `assets/agent-improvement/improvement_config_reference.md`. Target classification and mutability live in `assets/agent-improvement/target_manifest.jsonc`.

### Runtime Parity

The `/deep:start-agent-improvement-loop` command and the `@deep-improvement` agent are mirrored across runtimes. The integration scanner checks mirror parity on every run.

| Runtime | Agent Path | Command Path |
|---|---|---|
| OpenCode / Copilot | `.opencode/agents/` | `.opencode/commands/deep/` |
| Claude | `.claude/agents/` | uses agent mirror |
| Codex | `.codex/agents/` | uses agent mirror |
| Gemini | `.gemini/agents/` | uses agent mirror |

---

## 6. USAGE EXAMPLES

**Evaluate any agent (dynamic mode)**

```text
User request: improve the debug agent
Skill routing: /deep:start-agent-improvement-loop ".opencode/agents/debug.md" :confirm --spec-folder={spec_folder}
Resources loaded: charter, manifest, target profile (generated on the fly)
Expected output: five-dimension score plus a packet-local candidate, no canonical change
```

**Quick integration health check**

```bash
node .opencode/skills/deep-improvement/scripts/agent-improvement/scan-integration.cjs --agent=review
```

Expected output: mirror sync status, command coverage, and skill references for the review agent.

**Inspect runtime evidence after a run**

```text
{spec_folder}/improvement/agent-improvement-dashboard.md   # dimensional progress and stop status
{spec_folder}/improvement/experiment-registry.json          # per-profile metrics and best-known state
{spec_folder}/improvement/integration-report.json           # integration surface inventory
```

---

## 7. TROUBLESHOOTING

| What You See | Likely Cause | Fix |
|---|---|---|
| Candidate scores well but benchmark fails | Output contract is weaker than the prompt | Read the target fixtures and rerun |
| Benchmark scores drift across repeats | Fixtures are unstable | Treat the run as untrustworthy until repeatability is fixed |
| Promotion is refused | A promotion gate is missing | Check score delta, benchmark report, repeatability, target, and approval |
| Mirrors differ after promotion | Packaging drift not handled yet | Run `scan-integration.cjs` and record follow-up sync work |
| Scorer returns 0 on all dimensions | Profile generation failed | Run `generate-profile.cjs` directly and check for parse errors |
| All dimensions plateaued | The current hypothesis is exhausted | Reassess the hypothesis in `improvement_strategy.md` |
| Scorer reports `infra_failure` | Agent file not found or unreadable | Verify the `--candidate` path is a valid agent `.md` |

---

## 8. FAQ

**Q: Why not edit the canonical agent directly?**

A: The point is to prove improvement before mutation. Direct edits skip the evidence trail that makes a promotion decision auditable and a rollback possible.

**Q: How is promotion eligibility decided?**

A: A candidate becomes eligible only when prompt scoring, benchmark status, repeatability evidence, manifest boundary compliance, and explicit operator approval all pass for that specific target.

**Q: What does the integration scanner check?**

A: It finds every file that references an agent: the canonical definition, three runtime mirrors, command dispatch files, YAML workflow references, skill SKILL.md mentions, global docs, and the skill-advisor routing entry.

**Q: How are agents evaluated?**

A: Dynamic mode is the only path. The profile generator derives scoring checks from the agent's own ALWAYS/NEVER rules, output-verification checklist, capability scan, and anti-patterns. Any agent in `.opencode/agents/` is a valid target.

**Q: What happens when all dimensions plateau?**

A: When all five dimensions repeat their scores across the plateau window, the reducer triggers `stopOnDimensionPlateau`. The current improvement hypothesis is exhausted, so update the strategy before continuing.

---

## 9. RELATED DOCUMENTS

### Core References

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Router and runtime instructions |
| [`feature_catalog/feature_catalog.md`](./feature_catalog/feature_catalog.md) | Current-state feature inventory across the three categories |
| [`references/shared/quick_reference.md`](./references/shared/quick_reference.md) | Command and dimension reminder |
| [`references/shared/loop_protocol.md`](./references/shared/loop_protocol.md) | End-to-end operator workflow |
| [`references/model-benchmark/evaluator_contract.md`](./references/model-benchmark/evaluator_contract.md) | Five-dimension scoring and benchmark contract |

### Cross-System Connections

| Target | Relationship |
|---|---|
| `/deep:start-agent-improvement-loop` (`.opencode/commands/deep/start-agent-improvement-loop.md`) | Initializes and runs the bounded workflow |
| `@deep-improvement` (`.opencode/agents/deep-improvement.md`) | The mutator surface that writes one candidate |
| [`sk-doc`](../sk-doc/SKILL.md) | Validates package shape, README, and markdown consistency |
| [`system-spec-kit`](../system-spec-kit/SKILL.md) | Packet validation and continuity for the improvement run |
| [`sk-prompt`](../sk-prompt/SKILL.md) | Rewrites prompt surfaces when a candidate needs new prose |
| [`deep-research`](../deep-research/SKILL.md), [`deep-review`](../deep-review/SKILL.md) | Share the runtime-truth contract (stop reasons, legal-stop gates, journal) |
| `cli-devin`, `cli-codex` | Executors for the mixed-executor multi-iter methodology |
| `system-skill-advisor` | Routes requests to this skill and is checked by the integration scanner |
