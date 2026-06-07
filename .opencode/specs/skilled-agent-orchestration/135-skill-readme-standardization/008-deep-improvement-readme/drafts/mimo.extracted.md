---
title: "deep-improvement"
description: "Evaluator-first bounded agent improvement with five-dimension scoring, packet-local candidates, guarded promotion and rollback across three lanes: agent, model-benchmark and skill-benchmark."
trigger_phrases:
  - "deep-improvement"
  - "agent improvement loop"
  - "bounded agent improvement"
  - "5-dimension scoring"
  - "integration scanner"
  - "dynamic profiling"
  - "model-benchmark mode"
  - "benchmark a model or prompt framework"
  - "skill-benchmark mode"
---

# deep-improvement

> Score improvement candidates against five weighted dimensions before you ever touch the canonical file.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Testing whether an agent prompt, model, prompt framework or skill can be improved, with deterministic scoring and explicit promotion gates |
| **Invoke with** | `/deep:start-agent-improvement-loop` (Lane A), `/deep:start-model-benchmark-loop` (Lane B) or `/deep:start-skill-benchmark-loop` (Lane C) |
| **Works on** | Bounded agent `.md` files, model/prompt framework fixtures and skill routing surfaces, all through packet-local candidates |
| **Produces** | Scored candidates, benchmark reports, a mutation-coverage graph, a dashboard and a guarded promotion or rollback decision |

---

## 2. OVERVIEW

### Why This Skill Exists

Editing an agent prompt is guesswork. You reword a rule, the prompt reads better, you ship it and you never learn whether the agent got stronger or only different. Integration drift across runtime mirrors goes unnoticed because nothing checks every surface the agent touches. Promotion risk is hard to audit when no paper trail links score evidence to the mutation decision. Rollback is neither systematic nor comparable to the pre-promotion state.

### What It Does

`deep-improvement` is a proposal-first evaluator skill. It writes packet-local candidates, scores them deterministically and promotes only after both score evidence and operator approval pass. The skill runs three co-equal lanes: Lane A improves bounded agent files, Lane B benchmarks models and prompt frameworks, and Lane C benchmarks a skill's real-world routing, discovery and usefulness. All three share the same candidate, dispatcher and scorer seams. Lane A scores candidates on five weighted dimensions before guarded promotion with rollback.

It does not plan features or manage spec folders. `/speckit:plan` owns planning. `system-spec-kit` owns spec folders and memory continuity. `deep-improvement` evaluates and improves within those boundaries.

---

## 3. QUICK START

**Step 1: Pick your lane.** Agent improvement runs Lane A. Model or prompt framework benchmarking runs Lane B. Skill diagnostics run Lane C.

**Step 2: Invoke Lane A.**

```bash
/deep:start-agent-improvement-loop ".opencode/agents/debug.md" :confirm --spec-folder={spec_folder}
```

Expected output: the loop initializes, runs an integration scan, writes a packet-local candidate under `{spec_folder}/improvement/candidates/`, scores it across five dimensions and presents a promotion or rollback decision. State is appended to `agent-improvement-state.jsonl` and `improvement-journal.jsonl`.

**Step 3: Verify the reducer output.**

```bash
node .opencode/skills/deep-improvement/scripts/shared/reduce-state.cjs <spec-folder>
```

Expected output: a JSON summary with dashboard path, experiment registry path, iteration count, dimension scores and the latest stop reason.

---

## 4. HOW IT WORKS

### The Proposal-First Loop

The loop runs in three modes. Mode 1 initializes the runtime: it confirms the spec folder, target path and active profile, creates the packet-local `improvement/` directory and records baseline state in the append-only ledger. Mode 2 runs proposal and evaluation: it reads the charter and boundary file, runs the integration scan, writes one bounded candidate, scores it and appends results. Mode 3 handles promotion and recovery: it promotes only when scoring, benchmark, repeatability, boundary and approval gates all pass, with rollback available if the canonical target must be restored.

The canonical target file is never mutated during proposal-only mode. Candidates live under `{spec_folder}/improvement/candidates/`. Promotion happens only through `scripts/shared/promote-candidate.cjs` after every gate clears.

### The Integration Scan

`scripts/agent-improvement/scan-integration.cjs` discovers all surfaces the target agent touches. It checks runtime mirrors in `.claude/agents`, `.codex/agents` and any declared extra mirrors. The scan feeds a dynamic profile that the five-dimension scorer uses to evaluate integration consistency. A profile is generated on the fly from any agent file via `scripts/agent-improvement/generate-profile.cjs`.

### Five-Dimension Scoring

Every candidate is scored against five weighted dimensions:

| Dimension | Weight | What It Measures |
|---|---|---|
| Structural Integrity | 0.20 | Agent template compliance, required sections present |
| Rule Coherence | 0.25 | ALWAYS and NEVER rules align with workflow steps |
| Integration Consistency | 0.25 | Mirrors in sync, commands and skills reference the agent |
| Output Quality | 0.15 | Output-verification items present, no placeholder content |
| System Fitness | 0.15 | Permission alignment, valid resource references, complete frontmatter |

The scorer is independent from the mutator. A trade-off detector flags Pareto-dominated candidates where improvement in one dimension causes regression in another. Promotion is blocked for any Pareto-dominated candidate.

### Guarded Promotion and Rollback

Promotion requires all five legal-stop gate bundles to pass: `contractGate`, `behaviorGate`, `integrationGate`, `evidenceGate` and `improvementGate`. The operator must also approve. Promotion runs through `scripts/shared/promote-candidate.cjs`, which performs the guarded canonical mutation. If the promoted target needs to be restored, `scripts/agent-improvement/rollback-candidate.cjs` rolls back to the recorded pre-promotion state with direct comparison evidence.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for `deep-improvement` when you want to test whether an agent prompt can be improved without guesswork. Reach for it when benchmark evidence must back a promotion decision. Reach for it when you need to benchmark a model or prompt framework against repeatable fixtures. Reach for it when you want to diagnose whether a skill is well-routed and discoverable in practice.

Skip it for open-ended prompt rewrites across multiple agent families. Skip it for direct canonical edits without a candidate and evaluator evidence. Skip it for planning (use `/speckit:plan`) or code implementation (use `sk-code`).

### Sibling Deep Loops

`deep-improvement` shares the `deep-loop-runtime` with four sibling skills. Each owns a different phase of the work pipeline.

| Skill | Relationship |
|---|---|
| `deep-research` | Investigates outward web knowledge and answers research questions. Read-only. |
| `deep-review` | Audits code for bugs, security gaps and quality issues. Run it after implementation. |
| `deep-context` | Maps existing code, integration points and conventions before planning. Read-only. |
| `deep-ai-council` | Compares competing plans with structured disagreement. Run `deep-context` first so seats start from shared facts. |

`deep-improvement` is the one deep loop that can mutate. It does so only behind the promotion gate, and only on the canonical target. `system-spec-kit` owns the spec folder that candidates live in. The model-benchmark lane writes outputs into the `sk-prompt-small-model` benchmarks tree.

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| Candidate not promoted | Score did not clear the bar or the operator declined | Read the journal at `improvement-journal.jsonl` and the dashboard for dimension scores and gate results |
| Integration scan flags drift | A runtime mirror is out of sync with the canonical target | The scan lists each surface. Run `scripts/agent-improvement/check-mirror-drift.cjs` for a drift report |
| Pareto trade-off detected | Improvement in one dimension caused regression in another | The trade-off detector blocks promotion. Adjust the candidate to avoid the regression |
| `blockedStop` with failed gates | One or more legal-stop gate bundles did not pass | Check `latestLegalStop.gateResults` in the experiment registry for the specific failing gates |
| Reducer exits with an error | Corrupt JSONL state log | The reducer auto-repairs a trailing corrupt line. Inspect the file if the error persists |
| Benchmark run produces no report | Fixtures were not materialized or the runner failed | Run `scripts/shared/materialize-benchmark-fixtures.cjs` first, then retry `run-benchmark.cjs` |

---

## 7. FAQ

**Q: Why not just edit the agent file directly?**

A: Direct edits have no score evidence, no rollback path and no integration check. `deep-improvement` writes a packet-local candidate first, scores it across five dimensions, checks every runtime mirror and only promotes when the evidence and the operator both approve. If the promotion is wrong, it rolls back to the recorded pre-promotion state.

**Q: What do the five dimensions actually measure?**

A: Structural Integrity checks that the agent template has its required sections. Rule Coherence checks that ALWAYS and NEVER rules align with the workflow steps. Integration Consistency checks that runtime mirrors, commands and skills all reference the agent correctly. Output Quality checks for verification items and no placeholder content. System Fitness checks permission alignment, resource references and frontmatter completeness.

**Q: How does rollback work?**

A: Before promotion, the skill records the canonical target's current state. If the promoted version regresses, `rollback-candidate.cjs` restores the target to that recorded state. The rollback includes direct comparison evidence so you can see exactly what changed.

**Q: What is the difference between Lane A, Lane B and Lane C?**

A: Lane A improves a bounded agent `.md` file. Lane B benchmarks a model or prompt framework against repeatable fixtures. Lane C diagnoses a skill's real-world routing, discovery, efficiency and usefulness. All three share the same loop shape and candidate, dispatcher and scorer seams.

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the smart router and the full operating contract |
| [`references/shared/quick_reference.md`](./references/shared/quick_reference.md) | Operator cheat sheet for commands, scripts and dimension weights |
| [`references/shared/loop_protocol.md`](./references/shared/loop_protocol.md) | Loop lifecycle, iteration steps and the host-writes-state invariant |
| [`references/shared/promotion_rules.md`](./references/shared/promotion_rules.md) | Promotion gates, approval requirements and evidence bundles |
| [`references/shared/rollback_runbook.md`](./references/shared/rollback_runbook.md) | Rollback procedures and pre-promotion state comparison |
| [`references/agent-improvement/integration_scanning.md`](./references/agent-improvement/integration_scanning.md) | Integration surface discovery and dynamic profiling |
| [`references/agent-improvement/mirror_drift_policy.md`](./references/agent-improvement/mirror_drift_policy.md) | Runtime mirror drift detection and resolution |
| [`references/model-benchmark/benchmark_operator_guide.md`](./references/model-benchmark/benchmark_operator_guide.md) | Lane B operator workflow and fixture runner |
| [`references/model-benchmark/evaluator_contract.md`](./references/model-benchmark/evaluator_contract.md) | Scorer contract, grader selection and hardening env gates |
| [`references/skill-benchmark/operator_guide.md`](./references/skill-benchmark/operator_guide.md) | Lane C operator workflow and scoring contract |
| [`assets/agent-improvement/improvement_charter.md`](./assets/agent-improvement/improvement_charter.md) | Improvement charter template |
| [`assets/agent-improvement/improvement_strategy.md`](./assets/agent-improvement/improvement_strategy.md) | Improvement strategy template |
| [`scripts/shared/reduce-state.cjs`](./scripts/shared/reduce-state.cjs) | Dashboard and experiment registry reducer |
| [`scripts/shared/promote-candidate.cjs`](./scripts/shared/promote-candidate.cjs) | Guarded canonical promotion |
| [`scripts/agent-improvement/score-candidate.cjs`](./scripts/agent-improvement/score-candidate.cjs) | Lane A five-dimension candidate scorer |
| [`scripts/agent-improvement/scan-integration.cjs`](./scripts/agent-improvement/scan-integration.cjs) | Integration surface scanner |
| [`scripts/agent-improvement/trade-off-detector.cjs`](./scripts/agent-improvement/trade-off-detector.cjs) | Pareto trade-off detection |
| [`feature_catalog/`](./feature_catalog/) | Feature inventory across evaluation, integration scanning, scoring, model-benchmark and skill-benchmark |
| [`manual_testing_playbook/`](./manual_testing_playbook/) | Validation scenarios with preconditions and expected signals |
