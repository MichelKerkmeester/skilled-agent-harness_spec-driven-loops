---
title: "deep-research"
description: "Autonomous deep-research loop that runs iterative investigation with fresh context per pass, externalized state and convergence detection for multi-round discovery."
trigger_phrases:
  - "deep research loop"
  - "autoresearch"
  - "research loop"
  - "iterative research"
  - "autonomous research"
  - "/deep:research"
---

# deep-research

> Run an autonomous research loop that stores all findings on disk, dispatches a fresh agent per iteration and stops when new information runs dry.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Multi-round investigation of a topic that spans three or more sources, where each round should build on what the prior round found |
| **Invoke with** | `/deep:research:auto "topic"` (autonomous) or `:confirm` (approval-gated). Keyword triggers include "autoresearch", "deep research" and "research loop" |
| **Works on** | Any research topic with web sources, codebase references or both, through the LEAF agent's Read, WebFetch, Grep and Glob tool set |
| **Produces** | A converged findings report at `research/research.md`, plus an iteration audit trail, a findings registry and a convergence dashboard under `{spec_folder}/research/` |

---

## 2. OVERVIEW

### Why This Skill Exists

Long-form investigation inside a conversation degrades as findings pile up in the context window. You prune to make room, which means you lose earlier insights. Each follow-up round re-injects prior results and the model rereads what it already decided. Multi-domain topics compound the problem because each sub-question drags in its own evidence trail. Without an explicit stop condition you keep digging past diminishing returns, or you stop too early and miss evidence. This skill externalizes every finding to disk, starts each round from a clean context window and computes a stop signal from the ratio of new information. You get a complete investigation without context fatigue.

### What It Does

`deep-research` runs an autonomous multi-iteration research loop through `/deep:research:auto`. Each iteration dispatches a fresh `@deep-research` LEAF agent that reads the accumulated state from disk, investigates one focus area, writes findings to an iteration file and appends a JSONL record with a new-information ratio. A reducer updates the strategy, registry and dashboard after each pass. The loop stops when the new-information ratio falls below the convergence threshold for long enough, or when all research questions are answered.

It does not map code (`deep-context` does that), audit code (`deep-review`) or compare competing plans (`deep-ai-council`). All four sibling loops share the `deep-loop-runtime` for executors, state handling and coverage graphs.

---

## 3. QUICK START

**Step 1: Invoke it.** Pick your mode. Autonomous runs straight through with no gates. Confirm asks for approval at setup, each iteration and synthesis.

```bash
/deep:research:auto "WebSocket reconnection strategies across browsers"
/deep:research:confirm "Distributed cache invalidation patterns"
```

**Step 2: Run the primary workflow.** The command YAML initializes the packet, dispatches iterations, evaluates convergence and synthesizes the report.

```bash
/deep:research:auto "API backpressure patterns" --max-iterations 6 --convergence 0.03
```

Expected output: a converged research report at `{spec_folder}/research/research.md` with findings from every iteration, a convergence report and an iteration audit trail under `{spec_folder}/research/iterations/`.

**Step 3: Verify the reducer output after the loop finishes.**

```bash
node .opencode/skills/deep-loop-workflows/research/scripts/reduce-state.cjs <spec-folder>
```

Expected output: a JSON summary with `registryPath`, `dashboardPath`, `iterationsCompleted`, `findings` and convergence fields.

---

## 4. HOW IT WORKS

### The Iteration Lifecycle

The command YAML workflow owns dispatch. It initializes the research packet on first run, then loops: check convergence, dispatch the `@deep-research` LEAF agent for one iteration, wait for the write-back, run the reducer and decide whether to continue or stop. Each iteration is a single LEAF dispatch capped at roughly twelve tool calls. The agent investigates one focus area, writes a numbered iteration markdown file, appends a JSONL delta record and returns. It never dispatches sub-agents, never nests another loop and never asks the user a question.

### Externalized State

All continuity lives in packet files under `{spec_folder}/research/`, not in conversation memory. The config file (`deep-research-config.json`) holds settings. The append-only JSONL log (`deep-research-state.jsonl`) records every iteration, event and convergence signal. The strategy file (`deep-research-strategy.md`) tracks focus areas, what worked, what failed and exhausted approaches. The findings registry (`deep-research-findings-registry.json`) indexes every discovery. The dashboard (`deep-research-dashboard.md`) shows convergence trends. The reducer machine-owns the strategy sections, the registry and the dashboard. The agent writes only iteration files and JSONL records. The workflow owns the canonical `research.md`.

Because state is on disk, a crashed run resumes from the packet files. Use `/deep:research:auto` again and the workflow picks up the active lineage.

### Convergence Detection

Convergence is a composite stop signal driven by the new-information ratio per iteration. The loop continues as long as iterations keep surfacing new findings. It stops when the ratio falls below the convergence threshold (default 0.05) for long enough. A quality gate also checks source diversity, focus alignment and weak-source prevention before accepting a stop. A stuck-recovery path handles iterations that add nothing, escalating after the stuck threshold (default 3) is reached.

The convergence model weighs the new-information ratio against a minimum-iterations floor. The full signal math lives in `references/convergence/convergence.md` and `references/convergence/convergence_signals.md`. The convergence threshold is not interchangeable with sibling deep loops. `deep-review` and `deep-ai-council` each use a different default tuned to their domain.

### Progressive Synthesis

`research.md` updates as iterations land. The workflow can write interim synthesis content before the loop stops. Final synthesis consolidates all findings into one report with a convergence summary, a questions-answered ratio and an average new-information trend.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Run `deep-research` when a topic demands three or more rounds of investigation and the findings from one round should shape the next. Run it when you want the research to run overnight or unattended. Run it when you need a convergence-gated investigation that stops itself rather than running until you manually call it. Once the loop completes, save continuity to the memory index with `generate-context.js` and use `/speckit:resume` to rebuild context before extending or reviewing a completed run.

Skip it for a single-question lookup, where a direct web search or the `@context` agent is faster. Skip it for inward code mapping (`deep-context`), code audits (`deep-review`) or strategy comparison (`deep-ai-council`).

### Sibling Deep Loops

`deep-research` shares the `deep-loop-runtime` with three sibling skills. Each owns a different phase and none crosses into another's territory.

| Skill | Relationship |
|---|---|
| `deep-context` | Maps inward code before planning. `deep-research` investigates outward knowledge. |
| `deep-review` | Audits code for bugs, security gaps and quality issues. Run it after implementation. |
| `deep-ai-council` | Compares competing plans with structured disagreement. Run `deep-research` first when the council needs an evidence base. |

`/speckit:plan` and `/speckit:implement` consume the research report. `system-spec-kit` owns the spec folder, validation and memory continuity. `deep-loop-runtime` provides the shared executor, state layer and coverage graph.

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| Loop stops too early | The convergence threshold is too loose for the topic breadth | Lower `--convergence` (try 0.03) or raise `--max-iterations` (try 12) |
| Loop never converges | The topic keeps yielding partial overlap that stays above the threshold, or the stuck-recovery path has triggered | Check the dashboard for stuck count. Tighten the focus in the strategy file or raise the convergence threshold. |
| JSONL parse failure on resume | A trailing corrupt line in the append-only log | The reducer auto-repairs one trailing corrupt line. Inspect deeper corruption with `cat research/deep-research-state.jsonl \| python3 -m json.tool`. |
| Strategy or dashboard drift from iteration files | The reducer did not run after the last iteration write | Run `node .opencode/skills/deep-loop-workflows/research/scripts/reduce-state.cjs <spec-folder>` to regenerate derived files |
| Packet resumes when you expected a new run | An active lineage exists in the config | Inspect `deep-research-config.json` for the current `sessionId`. Archive the existing `research/` tree and pass `--restart` or delete the config. |
| Loop will not continue after pause | The pause file is still present | Remove `{spec_folder}/research/.deep-research-pause` and re-invoke the command |
| Agent hits the tool-call cap every iteration | The focus area is too broad | Tighten the focus in `deep-research-strategy.md` to one sub-question per iteration |
| Runtime mirror behaves differently across CLI executors | Provider quirks or missing capabilities | Compare the mirror against `references/guides/capability_matrix.md` and `assets/runtime_capabilities.json` |

---

## 7. FAQ

**Q: How does convergence decide to stop?**

A: The loop tracks the new-information ratio after each iteration. When the ratio stays below the convergence threshold (default 0.05) for long enough, and quality gates for source diversity, focus alignment and weak-source prevention all pass, the loop stops. If any gate fails the decision is STOP_BLOCKED and the loop continues with a recovery focus. The full signal model is in `references/convergence/convergence.md`.

**Q: Why does each iteration get a fresh agent?**

A: A shared context window fills with stale findings that degrade reasoning quality across a long session. By dispatching a fresh LEAF agent per iteration and externalizing state to disk, every round starts with a clean window. The agent reads only the current strategy, focus and prior findings, then writes back. Nothing lingers.

**Q: Where do the findings live?**

A: Iteration files go under `{spec_folder}/research/iterations/iteration-NNN.md`. The workflow synthesizes those into `research/research.md` when the loop stops. A findings registry at `deep-research-findings-registry.json` indexes every discovery. The dashboard at `deep-research-dashboard.md` shows the convergence trend.

**Q: What is the difference between `resume` and `restart`?**

A: `resume` continues the same session and generation, appending a `resumed` event to the JSONL log. The existing `research/` tree stays in place. `restart` archives the current `research/` tree, mints a fresh session ID, increments the generation counter and appends a `restarted` event. Both are supported at runtime. The `fork` and `completed-continue` branches are deferred and not yet shipped.

**Q: Can I use a CLI executor instead of the native agent?**

A: Yes. Pass `--executor` with the CLI type and model.

```bash
/deep:research:auto "GPU memory allocation strategies" --executor=cli-opencode --model=deepseek-v4-pro
```

The YAML workflow routes the executor. The LEAF constraints still apply: no sub-dispatch, no nested loops and a tool-call cap.

---

## 8. VERIFICATION

The skill ships two validation packages. You can also check that this document passes structural validation.

### Feature Catalog

The `feature_catalog/` covers every capability across its categories: loop lifecycle, state management, convergence and research output. Each category documents inputs, outputs, the owning resource and acceptance criteria.

### Manual Testing Playbook

Deterministic scenarios under `manual_testing_playbook/` cover loop lifecycle, state management, convergence and recovery, and research output. Preconditions, expected signals and pass, fail or partial verdict rules are defined in the root playbook. Every scenario maps to a dedicated feature file with the canonical prompt, expected signals and live source anchors.

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/deep-loop-workflows/research/README.md --type readme
```

Expected output: zero issues reported.

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the smart router, the rules and the full operating contract |
| [`references/guides/quick_reference.md`](./references/guides/quick_reference.md) | One-page operator cheat sheet with commands, parameters, state files and the convergence tree |
| [`references/protocol/loop_protocol.md`](./references/protocol/loop_protocol.md) | Iteration lifecycle, dispatch rules, reducer sequencing and the command-owned state flow |
| [`references/protocol/spec_check_protocol.md`](./references/protocol/spec_check_protocol.md) | Bounded `spec.md` anchoring, `folder_state` rules and generated-fence write-back |
| [`references/convergence/convergence.md`](./references/convergence/convergence.md) | Live stop contract, legal-stop gates and convergence navigation hub |
| [`references/convergence/convergence_signals.md`](./references/convergence/convergence_signals.md) | New-information ratio, rolling average, noise floor, entropy, stuck count and reporting |
| [`references/convergence/convergence_recovery.md`](./references/convergence/convergence_recovery.md) | Stuck recovery, recovery strategy selection, tiered errors and escalation |
| [`references/convergence/convergence_graph.md`](./references/convergence/convergence_graph.md) | Graph-aware stop gates, coverage-graph events and graceful degradation |
| [`references/state/state_format.md`](./references/state/state_format.md) | Packet file hub with owners, mutability rules and navigation |
| [`references/state/state_jsonl.md`](./references/state/state_jsonl.md) | Config, iteration, event, lineage, graph and blocked-stop JSONL record types |
| [`references/state/state_outputs.md`](./references/state/state_outputs.md) | Strategy, iteration markdown, report, dashboard, resource-map and spec anchoring outputs |
| [`references/state/state_reducer_registry.md`](./references/state/state_reducer_registry.md) | Reducer ownership, findings registry, validation, reconstruction and file protection |
| [`references/guides/capability_matrix.md`](./references/guides/capability_matrix.md) | Runtime parity source of truth across OpenCode, Claude and Codex executors |
| [`scripts/reduce-state.cjs`](./scripts/reduce-state.cjs) | The agreement-weighted findings reducer, dashboard generator and convergence evaluator |
| [`scripts/runtime-capabilities.cjs`](./scripts/runtime-capabilities.cjs) | Machine-readable capability lookup for the active runtime |
| [`assets/deep_research_config.json`](./assets/deep_research_config.json) | Config template with defaults for max iterations, convergence threshold and executor |
| [`assets/deep_research_strategy.md`](./assets/deep_research_strategy.md) | Strategy template with focus areas, what worked, what failed and exhausted approaches |
| [`assets/deep_research_dashboard.md`](./assets/deep_research_dashboard.md) | Dashboard template with convergence trend and iteration summary |
| [`assets/prompt_pack_iteration.md.tmpl`](./assets/prompt_pack_iteration.md.tmpl) | The per-iteration prompt template dispatched to the LEAF agent |
| [`assets/runtime_capabilities.json`](./assets/runtime_capabilities.json) | Declared capability manifest checked at runtime for parity gate validation |
| [`feature_catalog/`](./feature_catalog/) | Feature inventory across loop lifecycle, state management, convergence and research output |
| [`manual_testing_playbook/`](./manual_testing_playbook/) | Deterministic scenarios with preconditions, expected signals and per-feature execution contracts |
