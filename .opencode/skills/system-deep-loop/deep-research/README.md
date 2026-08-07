---
title: "deep-research"
description: "Autonomous multi-round research that writes every finding to disk, gives each round a fresh context window and stops itself when new information runs dry, for topics that need three or more sources and unattended investigation."
trigger_phrases:
  - "deep research loop"
  - "autoresearch"
  - "research loop"
  - "iterative research"
  - "autonomous research"
  - "/deep:research"
version: 1.15.0.0
---

# deep-research

> Run an autonomous research loop that writes every finding to disk, starts each round with a fresh context window, stops when new information runs dry and hands you a converged report at the end.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Multi-round investigation of a topic that spans three or more sources, where each round should build on what the prior round found |
| **Invoke with** | `/deep:research:auto "topic"` for autonomous runs, `/deep:research:confirm "topic"` for approval-gated runs. Keyword triggers: "autoresearch", "deep research" and "research loop" |
| **Works on** | Any research topic with web sources, codebase references or both, through the LEAF agent's Read, WebFetch, Grep and Glob tool set |
| **Produces** | A converged findings report at `research/research.md`, plus an iteration audit trail, a findings registry and a convergence dashboard under `{spec_folder}/research/` |

---

## 2. OVERVIEW

### Why This Skill Exists

Long-form investigation inside one conversation degrades as findings pile up in the context window. You prune earlier notes to make room, which loses the insights you already found. Each follow-up round re-injects prior results, so the model rereads what it already decided instead of going deeper. Multi-domain topics compound the problem, because every sub-question drags in its own evidence trail. Without a stop condition you keep digging past diminishing returns or stop too early and miss evidence.

That is the whole reason this skill exists. It makes multi-round research survivable: it writes every finding to disk, starts each round from a clean context window and computes a stop signal from the ratio of new information. You get a complete investigation without context fatigue. The loop stops itself when the evidence runs dry.

### What It Does

`deep-research` runs an autonomous multi-iteration research loop through `/deep:research:auto`. Each pass works like this:

- A fresh `@deep-research` LEAF agent reads the accumulated state from disk, investigates one focus area, writes findings to a numbered iteration file and appends a JSONL delta record with a new-information ratio.
- A reducer updates the strategy file, the findings registry and the dashboard after the write-back.
- The loop stops when the new-information ratio stays below the convergence threshold for long enough or when all research questions are answered.

The skill does not do one-shot codebase lookup, code audits or plan comparison. Those jobs belong to `@context`, `deep-review` and `deep-ai-council`. The active deep-loop roster has four families: `deep-research`, `deep-review`, `deep-ai-council` and `deep-improvement`. The improvement family ships four command lanes. The runtime-backed families share `runtime/` for executors, state handling and coverage graphs. Improvement stays host-driven.

### The Research State Layer

Every discovery and every decision survives across iterations because the skill owns a state layer it can read and write. Each file has one operator:

| State file | What the skill knows how to operate |
|---|---|
| `deep-research-config.json` | The run settings: session lineage, max iterations, convergence threshold and executor choice |
| `deep-research-state.jsonl` | The append-only log. One record per iteration, event and convergence signal, with a single trailing corrupt line auto-repaired on resume |
| `deep-research-strategy.md` | Focus areas, what worked, what failed and exhausted approaches. The reducer owns these sections |
| `findings-registry.json` | The index of every discovery, so no finding is lost between iterations |
| `deep-research-dashboard.md` | Convergence trends and the stuck count, so an operator can judge a run at a glance |
| `research/research.md` | The canonical converged report, updated progressively as iterations land |

---

## 3. QUICK START

**Step 1: Invoke it.** Pick the gate you want. `/deep:research:auto` runs straight through with no approvals. `/deep:research:confirm` asks for approval at setup, before each iteration and before synthesis.

```bash
/deep:research:auto "WebSocket reconnection strategies across browsers"
/deep:research:confirm "Distributed cache invalidation patterns"
```

Expected output: both commands run to convergence and stop on their own. A converged report lands at `{spec_folder}/research/research.md`.

**Step 2: Run the primary workflow.** The command YAML initializes the packet, dispatches iterations, evaluates convergence and synthesizes the report.

```bash
/deep:research:auto "API backpressure patterns" --max-iterations 6 --convergence 0.03
```

Expected output: a converged research report at `{spec_folder}/research/research.md` with findings from every iteration, a convergence report and an iteration audit trail under `{spec_folder}/research/iterations/`.

**Step 3: Verify the reducer output after the loop finishes.**

```bash
node .opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs <spec-folder>
```

Expected output: a JSON summary with `registryPath`, `dashboardPath`, `iterationsCompleted`, `findings` and convergence fields.

**Step 4: Resume a crashed run.** State lives on disk, so a crashed run resumes. Re-invoke `/deep:research:auto` with the same topic and the workflow picks up the active lineage from the packet files.

---

## 4. HOW IT WORKS

### The Iteration Lifecycle

The command YAML workflow owns dispatch. It initializes the research packet on first run, then loops through a fixed sequence: check convergence, dispatch the `@deep-research` LEAF agent for one iteration, wait for the write-back, run the reducer and decide whether to continue or stop. Each iteration is a single LEAF dispatch capped at roughly twelve tool calls. The agent investigates one focus area, writes a numbered iteration markdown file, appends a JSONL delta record and returns. It never dispatches sub-agents, never nests another loop and never asks the user a question.

The loop ships three lifecycle controls:

- [run-now control](./feature-catalog/loop-lifecycle/run-now-control.md)
- [per-iteration memory upsert](./feature-catalog/loop-lifecycle/per-iteration-memory-upsert.md)
- [loop-wide dry-run](./feature-catalog/loop-lifecycle/loop-wide-dry-run.md)

### Externalized State

All continuity lives in packet files under `{spec_folder}/research/`, never in conversation memory. The config file (`deep-research-config.json`) holds the run settings. The append-only JSONL log (`deep-research-state.jsonl`) records every iteration, event and convergence signal. The strategy file (`deep-research-strategy.md`) tracks focus areas, what worked, what failed and exhausted approaches. The findings registry (`findings-registry.json`) indexes every discovery. The dashboard (`deep-research-dashboard.md`) shows convergence trends. The reducer machine-owns the strategy sections, the registry and the dashboard. The agent writes only iteration files and JSONL records. The workflow owns the canonical `research.md`.

Because state is on disk, a crashed run resumes from the packet files. Re-invoke `/deep:research:auto` and the workflow picks up the active lineage.

Reducer-owned state also covers five more surfaces:

- [injection inbox provenance](./feature-catalog/state-management/injection-inbox-provenance.md)
- [question conflict ownership](./feature-catalog/state-management/question-conflict-ownership.md)
- [rejected-pattern cache](./feature-catalog/state-management/rejected-pattern-cache.md)
- [ideas backlog lifecycle](./feature-catalog/state-management/ideas-backlog-lifecycle.md)
- [dashboard sparkline trend](./feature-catalog/state-management/dashboard-sparkline-trend.md)

### Convergence Detection

Convergence is a composite stop signal driven by the new-information ratio per iteration. The loop continues as long as iterations keep surfacing new findings. It stops when the ratio falls below the convergence threshold (default 0.05) for long enough. A quality gate also checks source diversity, focus alignment and weak-source prevention before accepting a stop. A stuck-recovery path handles iterations that add nothing, escalating after the stuck threshold (default 3) is reached.

The convergence model weighs the new-information ratio against a minimum-iterations floor. The full signal math lives in `references/convergence/convergence.md` and `references/convergence/convergence-signals.md`. The convergence threshold is not interchangeable with sibling deep loops. `deep-review` and `deep-ai-council` each use a different default tuned to their domain. The minimum-iteration behavior is documented as the [anti-convergence floor](./feature-catalog/convergence/anti-convergence-floor.md).

### Progressive Synthesis

`research.md` updates as iterations land. The workflow can write interim synthesis content before the loop stops. Final synthesis consolidates all findings into one report with a convergence summary, a questions-answered ratio and an average new-information trend.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Run `deep-research` when a topic demands three or more rounds of investigation and the findings from one round should shape the next. Run it when you want the research to run overnight or unattended. Run it when you need a convergence-gated investigation that stops itself rather than running until you manually call it. Once the loop completes, save continuity to the memory index with `generate-context.js` and use `/speckit:resume` to rebuild context before extending or reviewing a completed run.

Skip it for a single-question lookup, where a direct web search or the `@context` agent is faster. Skip it for implementation planning, where `/speckit:plan` owns the plan after context is gathered. Skip it for code audits (`deep-review`) or strategy comparison (`deep-ai-council`).

### Sibling Deep Loops

`deep-research` shares the `runtime/` with the other active deep-loop families. Each owns a different phase and none crosses into another's territory.

| Skill | Relationship |
|---|---|
| `deep-review` | Audits code for bugs, security gaps and quality issues. Run it after implementation. |
| `deep-ai-council` | Compares competing plans with structured disagreement. Run `deep-research` first when the council needs an evidence base. |
| `deep-improvement` | Runs evaluator-first improvement across agents, models, skills and packaged AI systems. |
| `system-spec-kit` | Owns the spec folder, validation and memory continuity. `/speckit:plan` and `/speckit:implement` consume the research report. |

`runtime/` provides the shared executor, state layer and coverage graph used by the runtime-backed families.

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| Loop stops too early | The convergence threshold is too loose for the topic breadth | Lower `--convergence` (try 0.03) or raise `--max-iterations` (try 12) |
| Loop never converges | Partial overlap keeps the ratio above the threshold, possibly with the stuck-recovery path triggered too | Check the dashboard for the stuck count. Tighten the focus in the strategy file or raise the convergence threshold. |
| JSONL parse failure on resume | A trailing corrupt line in the append-only log | The reducer auto-repairs one trailing corrupt line. Inspect deeper corruption with `cat research/deep-research-state.jsonl \| python3 -m json.tool` |
| Strategy or dashboard drift from iteration files | The reducer did not run after the last iteration write | Run `node .opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs <spec-folder>` to regenerate the derived files |
| Packet resumes when you expected a new run | An active lineage exists in the config | Inspect `deep-research-config.json` for the current `sessionId`. Archive the existing `research/` tree and pass `--restart` or delete the config |
| Loop will not continue after pause | The pause file is still present | Remove `{spec_folder}/research/.deep-research-pause` and re-invoke the command |
| Agent hits the tool-call cap every iteration | The focus area is too broad | Tighten the focus in `deep-research-strategy.md` to one sub-question per iteration |
| Runtime mirror behaves differently across CLI executors | Provider quirks or missing capabilities | Compare the mirror against `references/guides/capability-matrix.md` and `assets/runtime-capabilities.json` |

---

## 7. FAQ

**Q: How does convergence decide to stop?**

A: The loop tracks the new-information ratio after each iteration. When the ratio stays below the convergence threshold (default 0.05) for long enough and the quality gates for source diversity, focus alignment and weak-source prevention all pass, the loop stops. If any gate fails, the decision is STOP_BLOCKED and the loop continues with a recovery focus. The full signal model is in `references/convergence/convergence.md`.

**Q: Why does each iteration get a fresh agent?**

A: A shared context window fills with stale findings that degrade reasoning quality across a long session. By dispatching a fresh LEAF agent per iteration and externalizing state to disk, every round starts with a clean window. The agent reads only the current strategy, focus and prior findings, then writes back. Nothing lingers.

**Q: Where do the findings live?**

A: Iteration files go under `{spec_folder}/research/iterations/iteration-NNN.md`. The workflow synthesizes those into `research/research.md` when the loop stops. A findings registry at `findings-registry.json` indexes every discovery. The dashboard at `deep-research-dashboard.md` shows the convergence trend.

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

### Feature Catalog

The `feature-catalog/` covers every capability across its categories: loop lifecycle, state management, convergence and research output. Each category documents inputs, outputs, the owning resource and acceptance criteria.

### Manual Testing Playbook

Deterministic scenarios under `manual-testing-playbook/` cover loop lifecycle, state management, convergence, recovery and research output. Preconditions, expected signals and pass, fail or partial verdict rules are defined in the root playbook. Every scenario maps to a dedicated feature file with the canonical prompt, expected signals and live source anchors.

Run the structural check:

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-deep-loop/deep-research/README.md --type readme
```

Expected output: zero issues reported.

### Maintainer Checklist

A feature change to this skill typically touches more than one surface. Before calling a change complete, check each:

- [ ] **`SKILL.md`** -- routing rules and the resource list stay in sync with the new or changed behavior
- [ ] **`references/`** -- the owning protocol, state or convergence doc reflects the change (see section 9 table for which doc owns what)
- [ ] **`feature-catalog/`** -- the feature's category package documents inputs, outputs, owner and acceptance criteria
- [ ] **`manual-testing-playbook/`** -- a scenario exists (or is updated) with preconditions, expected signals and a pass, fail or partial verdict
- [ ] **command YAML/tests** -- `.opencode/commands/deep/assets/deep-research-auto.yaml` and `deep-research-confirm.yaml`, plus any `scripts/*.test.cjs`, cover the change
- [ ] **`assets/`** -- templates (`deep-research-config.json`, `deep-research-strategy.md`, `deep-research-dashboard.md`, prompt pack) match the new shape
- [ ] **`scripts/`** -- `reduce-state.cjs` and `runtime-capabilities.cjs` implement the change and stay idempotent

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the smart router, the rules and the full operating contract |
| [`references/guides/quick-reference.md`](./references/guides/quick-reference.md) | One-page operator cheat sheet with commands, parameters, state files and the convergence tree |
| [`references/protocol/loop-protocol.md`](./references/protocol/loop-protocol.md) | Iteration lifecycle, dispatch rules, reducer sequencing and the command-owned state flow |
| [`references/protocol/spec-check-protocol.md`](./references/protocol/spec-check-protocol.md) | Bounded `spec.md` anchoring, `folder_state` rules and generated-fence write-back |
| [`references/convergence/convergence.md`](./references/convergence/convergence.md) | Live stop contract, legal-stop gates and convergence navigation hub |
| [`references/convergence/convergence-signals.md`](./references/convergence/convergence-signals.md) | New-information ratio, rolling average, noise floor, entropy, stuck count and reporting |
| [`references/convergence/convergence-recovery.md`](./references/convergence/convergence-recovery.md) | Stuck recovery, recovery strategy selection, tiered errors and escalation |
| [`references/convergence/convergence-graph.md`](./references/convergence/convergence-graph.md) | Graph-aware stop gates, coverage-graph events and graceful degradation |
| [`references/state/state-format.md`](./references/state/state-format.md) | Packet file hub with owners, mutability rules and navigation |
| [`references/state/state-jsonl.md`](./references/state/state-jsonl.md) | Config, iteration, event, lineage, graph and blocked-stop JSONL record types |
| [`references/state/state-outputs.md`](./references/state/state-outputs.md) | Strategy, iteration markdown, report, dashboard, resource-map and spec anchoring outputs |
| [`references/state/state-reducer-registry.md`](./references/state/state-reducer-registry.md) | Reducer ownership, findings registry, validation, reconstruction and file protection |
| [`references/guides/capability-matrix.md`](./references/guides/capability-matrix.md) | Runtime parity source of truth across OpenCode, Claude and OpenCode executors |
| [`scripts/reduce-state.cjs`](./scripts/reduce-state.cjs) | The agreement-weighted findings reducer, dashboard generator and convergence evaluator |
| [`scripts/runtime-capabilities.cjs`](./scripts/runtime-capabilities.cjs) | Machine-readable capability lookup for the active runtime |
| [`assets/deep-research-config.json`](./assets/deep-research-config.json) | Config template with defaults for max iterations, convergence threshold and executor |
| [`assets/deep-research-strategy.md`](./assets/deep-research-strategy.md) | Strategy template with focus areas, what worked, what failed and exhausted approaches |
| [`assets/deep-research-dashboard.md`](./assets/deep-research-dashboard.md) | Dashboard template with convergence trend and iteration summary |
| [`assets/prompt-pack-iteration.md.tmpl`](./assets/prompt-pack-iteration.md.tmpl) | The per-iteration prompt template dispatched to the LEAF agent |
| [`assets/runtime-capabilities.json`](./assets/runtime-capabilities.json) | Declared capability manifest checked at runtime for parity gate validation |
| [`feature-catalog/`](./feature-catalog/) | Feature inventory across loop lifecycle, state management, convergence and research output |
| [`manual-testing-playbook/`](./manual-testing-playbook/) | Deterministic scenarios with preconditions, expected signals and per-feature execution contracts |
| [`behavior-benchmark/`](./behavior-benchmark/) | Executor-model behavior benchmark (RSB): what the model does at `/deep:research` under realistic prompts, covering dispatch evidence, presentation and latency vs Claude |
