---
title: "deep-improvement"
description: "Proposal-first evaluator skill that tests bounded agent improvement with 5-dimension scoring, dynamic profiling and guarded promotion across three co-equal lanes."
trigger_phrases:
  - "deep-improvement"
  - "agent improvement loop"
  - "bounded agent improvement"
  - "5-dimension scoring"
  - "model-benchmark mode"
  - "skill-benchmark mode"
version: 1.17.0.38
---

# deep-improvement

> Test whether an agent improved before you ship it. Score a packet-local candidate across five dimensions and promote only when the evidence and the approval gate both pass.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Proving a bounded agent, model, or skill improved with measured evidence before you mutate the canonical file |
| **Invoke with** | `/deep:agent-improvement`, `/deep:model-benchmark`, or `/deep:skill-benchmark` |
| **Works on** | Any agent `.md` under `.opencode/agents/`, a model or prompt framework against repeatable fixtures, or a skill's real-world routing |
| **Produces** | Packet-local candidates with five-dimension scores, benchmark reports, an append-only journal and a dashboard, all under `{spec_folder}/improvement/` |

---

## 2. OVERVIEW

### Why This Skill Exists

Editing an agent prompt is normally guesswork. You reword a rule, the prompt reads better, you ship it and you never learn whether the agent got stronger or only different. Integration drift across runtime mirrors goes unnoticed because nothing checks every surface the agent touches. Promotion risk is hard to audit because no paper trail links score evidence to the mutation decision. Rollback is neither systematic nor comparable to the pre-promotion state.

### What It Does

`deep-improvement` replaces that guess with measured evidence. It writes a candidate to a packet-local sandbox, scores it across five deterministic dimensions and promotes to the canonical file only after both score evidence and operator approval pass. It is the only deep loop that can mutate a file, but it does so exclusively behind a guarded promotion gate with a recorded rollback path. The skill runs three co-equal lanes: Agent-Improvement for bounded agent `.md` files, Model-Benchmark for models and prompt frameworks, and Skill-Benchmark for diagnosing a skill's real-world routing and usefulness.

---

## 3. QUICK START

**Step 1: Pick a target and a spec folder.** Choose any agent under `.opencode/agents/` and the spec folder where the run will live.

**Step 2: Run the Lane A loop.**

```bash
/deep:agent-improvement ".opencode/agents/debug.md" :confirm --spec-folder={spec_folder}
```

The integration scan maps every surface the agent touches. A packet-local candidate lands under `{spec_folder}/improvement/candidates/`. The five-dimension scorer reports `candidate-acceptable` or `needs-improvement`, and a refreshed dashboard shows dimensional progress.

**Step 3: Run a single script when you only need one signal.**

```bash
# Scan every surface the agent touches
node .opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/scan-integration.cjs --agent=debug

# Derive a scoring profile from the agent itself
node .opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/generate-profile.cjs --agent=.opencode/agents/debug.md

# Score across five dimensions (dynamic mode is the only path)
node .opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs --candidate=.opencode/agents/debug.md
```

Each returns JSON with a five-dimension breakdown and a recommendation.

---

## 4. HOW IT WORKS

### The Proposal-First Lifecycle

The loop never touches the canonical file until you tell it to. It copies the target, scans its integration surface, derives a dynamic profile from the agent's own rules, writes one bounded candidate to a packet-local directory, scores it and records the evidence. Promotion is a separate guarded step that demands score evidence, benchmark status, repeatability, boundary compliance and explicit operator approval. The current promotion helper also supports an accept/ship split: accept snapshots candidate evidence without mutating the canonical target, ship writes only the accepted snapshot, and rollback restores the pre-acceptance backup.

### The Integration Scan

An agent is more than its `.md` file. `scan-integration.cjs` inventories the canonical agent definition (`.opencode/agents/`), its Claude runtime mirror (`.claude/agents/`), command dispatch files, YAML workflow assets, skill references and the skill-advisor routing path. The scanner extracts emphasized strings from the canonical agent and marks a mirror aligned when enough of them appear. A drifted mirror shows up before it causes a runtime surprise, and the score reflects the whole integration surface, not the prompt in isolation. Mirror parity is also enforced repo-wide outside a scoring run: `scripts/check-agent-mirror-sync.cjs` gates commits (through `.opencode/hooks/pre-commit`) and pull requests into `main` (through `.github/workflows/agent-mirror-sync.yml`), so drifted runtime copies are caught before they merge. The commit hook fails open when Node or the checker is unavailable so it never blocks an unrelated commit; the CI gate on `main` is the fail-closed backstop.

### Five Scoring Dimensions (Lane A)

Scoring is deterministic. Every check is a regex, string match or file-existence check. No model-as-judge step means a score always traces back to specific evidence.

| Dimension | Weight | What it measures |
|---|---|---|
| Structural Integrity | 0.20 | Agent template compliance: required sections present |
| Rule Coherence | 0.25 | ALWAYS/NEVER rules align with workflow steps |
| Integration Consistency | 0.25 | Mirrors in sync, commands and skills reference the agent |
| Output Quality | 0.15 | Output-verification items present, no placeholder content |
| System Fitness | 0.15 | Permission alignment, valid resource references, complete frontmatter |

Profiles are generated dynamically from the target agent file via `generate-profile.cjs`. No static profiles ship, so any agent in `.opencode/agents/` is a valid target the moment it exists.

### Guarded Promotion

A candidate becomes promotion-eligible only when five gates all pass: prompt scoring must clear the bar, benchmark status must be complete and passing, repeatability must be proven, the manifest boundary must hold and the operator must approve. `promote-candidate.cjs` enforces every gate before it writes the canonical file. The rollback helper restores the archived pre-promotion state and records a dimensional comparison so you can audit the difference. The scorer and the mutator stay independent throughout.

### The Three Lanes

All three lanes share the same candidate, dispatcher and scorer seams.

| Lane | Command | What it tests |
|---|---|---|
| A: Agent-Improvement | `/deep:agent-improvement` | A bounded agent `.md` file |
| B: Model-Benchmark | `/deep:model-benchmark` | A model or prompt framework against repeatable fixtures |
| C: Skill-Benchmark | `/deep:skill-benchmark` | A skill's routing, discovery, efficiency and usefulness |

Lane B enters through `scripts/shared/loop-host.cjs --mode=model-benchmark` and writes benchmark outputs to `.opencode/skills/sk-prompt/prompt-models/benchmarks/{run_label}/`; benchmark reports include `outcomeScoreDelta` and helped/hurt fixture deltas so promotion can block regressions instead of relying on pass/fail alone. Lane C runs through `loop-host.cjs --mode=skill-benchmark` and emits a ranked diagnostic Skill Benchmark Report. Lane A is the default path when no mode flag is set.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Run `deep-improvement` when you want to prove an agent edit earned its place before you commit it. Run it when integration drift across runtime mirrors worries you and you need a scanner to find every surface. Run Lane B when a model or prompt framework needs benchmark comparison against repeatable fixtures. Run Lane C when a skill's routing accuracy or discoverability needs measurement.

Skip it for open-ended prompt rewrites across many agent families at once. Skip it for direct canonical edits you already have confidence in. Skip it for general planning that belongs in `/speckit:plan`.

### Sibling Deep Loops

`deep-improvement` shares the `runtime/` with the other active deep-loop families. Each owns a different phase and none crosses into another's territory.

| Skill | Relationship |
|---|---|
| `deep-research` | Investigates outward web knowledge. `deep-improvement` tests inward agent quality. |
| `deep-review` | Audits code for bugs and security gaps. Run it after implementation, not during improvement. |
| `deep-ai-council` | Compares competing plans with structured disagreement. Feed it context from `@context` or `/speckit:plan`, not an agent file. |

`deep-improvement` is the only deep loop that can mutate a file. Every other deep loop is read-only or advisory. This one writes only when the promotion gate opens, and even then it records a rollback path. `system-spec-kit` owns the spec folder, validation and memory continuity for the run. `runtime/` provides the shared coverage graph and atomic-state layer. `sk-prompt/prompt-models` owns the benchmark output tree that Lane B writes into.

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| Candidate scores well but does not promote | A promotion gate is missing or the operator declined | Check the journal and the dashboard. All five gates must pass: scoring, benchmark, repeatability, boundary and approval. |
| Integration scan flags drift | A runtime mirror is out of sync with the canonical agent | Run `scan-integration.cjs` again. It lists each surface and its parity status. |
| Scorer returns 0 on all dimensions | Profile generation failed or the target is unreadable | Run `generate-profile.cjs` directly and check for parse errors. |
| All dimensions plateaued | The current improvement hypothesis is exhausted | Update the strategy and re-run with a fresh hypothesis. |
| Benchmark scores drift across repeats | Fixtures are unstable | Treat the run as untrustworthy until repeatability is fixed. |
| Promotion refused with a Pareto trade-off detected | A gain in one dimension caused a regression in a hard dimension | `trade-off-detector.cjs` blocks Pareto-dominated candidates. Rebalance the candidate. |
| Reducer exits with an error | Corrupt JSONL state log | The reducer auto-repairs a trailing corrupt line. If the error persists, inspect the file for mid-line corruption. |

---

## 7. FAQ

**Q: Why not edit the canonical agent directly?**

A: The point is to prove improvement before mutation. Direct edits skip the evidence trail that makes a promotion decision auditable and a rollback possible.

**Q: How does the integration scanner work?**

A: It finds every file that references an agent: the canonical definition, its Claude runtime mirror, command dispatch files, YAML workflow references, skill SKILL.md mentions and the skill-advisor routing entry. It extracts emphasized strings from the canonical agent and marks a mirror aligned when enough of them appear.

**Q: What do the five dimensions measure?**

A: Structural Integrity checks that required sections are present. Rule Coherence checks that ALWAYS/NEVER rules align with workflow steps. Integration Consistency checks that mirrors are in sync and that commands and skills reference the agent. Output Quality checks that output-verification items exist with no placeholder content. System Fitness checks permissions, resource references and frontmatter completeness.

**Q: How are the three lanes different?**

A: Lane A improves a bounded agent `.md` file and writes packet-local candidates with five-dimension scores. Lane B benchmarks a model or prompt framework against repeatable fixtures. Lane C diagnoses a skill's routing, discovery, efficiency and usefulness without mutating the skill. All three share the same candidate, dispatcher and scorer seams.

**Q: How does rollback work?**

A: `rollback-candidate.cjs` restores the archived pre-promotion state to the canonical file and records a post-rollback dimensional snapshot. Rollback is a separate helper, not a side effect of promotion, so recovery stays explicit and auditable.

---

## 8. VERIFICATION

The skill ships two validation packages.

### Feature Catalog

The `feature_catalog/` covers every capability across five categories: evaluation-loop, integration-scanning, scoring-system, model-benchmark-mode and skill-benchmark. Each category documents inputs, outputs, the owning resource and acceptance criteria with live source anchors.

### Manual Testing Playbook

`manual_testing_playbook/` carries deterministic scenarios across all feature categories. Preconditions, expected signals and pass, fail or partial verdict rules are defined in the root playbook. Every scenario maps to a dedicated feature file with the canonical prompt, expected signals and source anchors.

| Check | How to run it |
|---|---|
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-deep-loop/deep-improvement/README.md --type readme` reports zero issues |
| Behavior | Run the playbook scenarios under `manual_testing_playbook/` in a live session |

---

### Behavior Benchmark

`behavior_benchmark/` (IMB scenarios) measures what an executor model actually does at the `/deep:agent-improvement` command surface under realistic vague/concise prompts: whether it runs the evaluator-first loop (scored on a **packet-local candidate + evaluator score**), how it presents, whether it halts or stalls, and its latency versus a Claude baseline. Contracts + baselines live here; run evidence and the cross-mode scorecard live in the `033-deep-loop-behavior-benchmarks` packet.

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the smart router and the full operating contract for all three lanes |
| [`references/shared/quick_reference.md`](./references/shared/quick_reference.md) | One-page operator cheat sheet with commands, dimension weights and the runtime layout |
| [`references/shared/loop_protocol.md`](./references/shared/loop_protocol.md) | End-to-end operator workflow across setup, proposal, scoring and stop |
| [`references/shared/promotion_rules.md`](./references/shared/promotion_rules.md) | Keep, reject and promote decision rules |
| [`references/shared/rollback_runbook.md`](./references/shared/rollback_runbook.md) | The promotion rollback procedure |
| [`references/agent_improvement/integration_scanning.md`](./references/agent_improvement/integration_scanning.md) | Integration scanner documentation and surface inventory |
| [`references/agent_improvement/score_dimensions.md`](./references/agent_improvement/score_dimensions.md) | Per-dimension checker detail |
| [`references/model_benchmark/benchmark_operator_guide.md`](./references/model_benchmark/benchmark_operator_guide.md) | Fixture benchmark execution |
| [`references/skill_benchmark/operator_guide.md`](./references/skill_benchmark/operator_guide.md) | Skill-benchmark operator workflow |
| [`references/skill_benchmark/scoring_contract.md`](./references/skill_benchmark/scoring_contract.md) | Skill-benchmark scoring and funnel contract |
| [`scripts/shared/loop-host.cjs`](./scripts/shared/loop-host.cjs) | Shared loop host entry point for Lanes B and C |
| [`scripts/agent-improvement/score-candidate.cjs`](./scripts/agent-improvement/score-candidate.cjs) | The five-dimension candidate scorer |
| [`scripts/shared/promote-candidate.cjs`](./scripts/shared/promote-candidate.cjs) | Guarded canonical promotion |
| [`feature_catalog/feature_catalog.md`](./feature_catalog/feature_catalog.md) | Feature inventory with source anchors |
| [`manual_testing_playbook/manual_testing_playbook.md`](./manual_testing_playbook/manual_testing_playbook.md) | Deterministic scenarios with preconditions and expected signals |
