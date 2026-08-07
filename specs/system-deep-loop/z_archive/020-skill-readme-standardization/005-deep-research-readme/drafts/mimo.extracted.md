---
title: "deep-research"
description: "Autonomous multi-iteration research loop that externalizes state to disk, dispatches a fresh LEAF agent per pass and stops on a convergence signal."
trigger_phrases:
  - "autoresearch"
  - "deep research"
  - "autonomous research"
  - "research loop"
  - "iterative research"
  - "deep investigation"
  - "comprehensive research"
  - "/deep:start-research-loop"
---

# deep-research

> Run an investigation across as many sources as you need, with a fresh context window every round and an automatic stop when findings dry up.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Multi-round technical investigation that spans domains, needs source triangulation or runs unattended |
| **Invoke with** | `/deep:start-research-loop:auto "topic"` (autonomous) or `:confirm` (gated per iteration) |
| **Works on** | Any research topic you can phrase as a question, scoped to a spec folder packet |
| **Produces** | A cited `research/research.md` report, a findings registry, a convergence dashboard and an iteration audit trail |

---

## 2. OVERVIEW

### Why This Skill Exists

Long-form investigation inside a conversation degrades fast. The context window fills with stale findings. You prune, restart and lose momentum. Multi-domain topics make it worse because each follow-up round re-injects prior results. Without an explicit stop condition you either keep digging past diminishing returns or stop too early and miss evidence you needed.

### What It Does

`deep-research` runs an autonomous research loop. Each iteration dispatches a fresh `@deep-research` LEAF agent that gets an empty context window and reads its instructions from disk. Findings land in `iterations/iteration-NNN.md` and a JSONL state log, never in conversation memory. The loop computes a convergence signal from the ratio of new information each round produces. When the signal says enough has been found, the workflow synthesises a final report and stops.

The canonical entry point is `/deep:start-research-loop`. Pass `:auto` for hands-off execution or `:confirm` to approve each iteration before it runs.

---

## 3. QUICK START

**Step 1: Invoke the loop.** Pick your mode. `auto` runs straight through. `confirm` pauses for your approval at each iteration.

```bash
/deep:start-research-loop:auto "WebSocket reconnection strategies across transport layers"
```

The command initialises a research packet under `{spec_folder}/research/` and begins iterating.

**Step 2: Watch the dashboard.** The loop writes `research/deep-research-dashboard.md` after every iteration. You can open it mid-run to check progress, convergence score and findings count.

```bash
cat research/deep-research-dashboard.md
```

Expected output: a table showing iteration number, `newInfoRatio`, status, focus and cumulative findings.

**Step 3: Read the final report.** When the loop converges or hits the iteration cap, the workflow writes `research/research.md`.

```bash
head -40 research/research.md
```

Expected output: a cited report with findings from all iterations, ordered by relevance.

---

## 4. HOW IT WORKS

### The Iteration Lifecycle

Each iteration follows the same contract. The host reads the current state from JSONL and strategy files, picks one focus from the strategy's "Next Focus" list and dispatches a `@deep-research` LEAF agent. That agent runs up to 12 tool calls: it researches the focus, writes findings to `iterations/iteration-NNN.md`, appends a JSONL delta record with `newInfoRatio` and a one-sentence novelty justification, then updates the strategy file with what worked, what failed and what to try next. The host evaluates convergence after the agent returns. If the loop continues, the next iteration picks a new focus and runs again.

Three lifecycle modes control the start: `new` creates a fresh packet, `resume` appends to an existing lineage, and `restart` archives the old tree and mints a new session.

### Externalized State

All continuity lives on disk, not in conversation memory. The research packet holds these files:

| File | Owner | Purpose |
|---|---|---|
| `deep-research-config.json` | Init | Loop parameters (max iterations, convergence threshold, flags) |
| `deep-research-state.jsonl` | Iterations (append-only) | One JSON record per iteration with status, ratio and focus |
| `deep-research-strategy.md` | Reducer | What worked, what failed, exhausted approaches, next focus |
| `deep-research-findings-registry.json` | Reducer | Deduplicated findings with source citations |
| `deep-research-dashboard.md` | Reducer | Human-readable progress table |
| `iterations/iteration-NNN.md` | Iteration agent | Per-iteration findings and ruled-out directions |
| `research.md` | Synthesis | Final cited report, built progressively |

A fresh agent reads these files at the start of its dispatch. When the agent finishes writing, the host reducer refreshes the strategy, registry and dashboard. This cycle repeats until convergence.

### Convergence Detection

The convergence model is a composite signal defined in `references/convergence/convergence.md`. It compares the new-information ratio of each iteration against a threshold (default 0.05). A fully new finding scores 1.0. A partially new one scores 0.5. When the ratio stays below the threshold long enough, the loop stops.

The model includes a stuck-recovery path. If an iteration produces nothing new, the host logs it. After a configurable number of stuck iterations (default 3), recovery kicks in and re-focuses the next pass. Quality guards on source diversity and focus alignment must also pass before a stop can trigger.

Convergence thresholds are not interchangeable across sibling skills. `deep-review` uses 0.10 on a severity ratio. `deep-ai-council` uses 0.20 on verdict stability. Carrying one sibling's threshold to another produces unexpected iteration counts.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Run `deep-research` when a question needs multiple rounds of discovery across sources you cannot predict up front. Run it when you want the investigation to continue unattended while you work on something else. Run it when prior findings should shape the next query.

Skip it for a single-pass question (use direct search or `@context`). Skip it for codebase mapping (use `deep-context`). Skip it for code audits (use `deep-review`) or plan comparison (use `deep-ai-council`).

### Sibling Deep Loops

Four skills share the `deep-loop-runtime`. Each owns a different phase and none crosses into another's territory.

| Skill | What it investigates |
|---|---|
| `deep-research` | Outward knowledge: web sources, documentation, cross-domain technical questions |
| `deep-context` | Inward code: existing symbols, reuse candidates, integration points |
| `deep-review` | Code quality: bugs, security gaps, standards violations (run after implementation) |
| `deep-ai-council` | Strategy: competing plans, structured disagreement, adjudicated verdicts |

`/speckit:plan` consumes the research report as input for planning. `system-spec-kit` owns the spec folder, validation and memory continuity. `deep-loop-runtime` provides the shared convergence script, atomic-state layer and coverage graph.

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| Loop stops after 2 or 3 iterations | Convergence threshold is too loose for the topic | Lower `--convergence` (try 0.03) or raise `--max-iterations` |
| Loop runs to the iteration cap without converging | Topic is broad or findings stay novel | Narrow the scope in the topic string. Check the dashboard for `newInfoRatio` trend. |
| Stuck recovery triggers repeatedly | The focus is exhausted or the topic is too narrow | Expand the topic scope. Check `deep-research-strategy.md` for the "Exhausted" list. |
| Iteration files are empty or missing | The agent hit an error or timed out | Check `deep-research-state.jsonl` for `error` or `timeout` status. Three consecutive failures route to stuck recovery. |
| State files are corrupt | A write was interrupted mid-line | The reducer auto-repairs trailing corrupt lines. If the error persists, inspect the JSONL file for mid-record corruption. |
| `confirm` mode hangs at approval gate | Waiting for your input in the conversation | Respond to the approval prompt or switch to `auto` mode. |

---

## 7. FAQ

**Q: How does convergence decide when to stop?**

A: The loop compares each iteration's `newInfoRatio` against a threshold (default 0.05). When the ratio stays below the threshold for long enough and quality guards on source diversity and focus alignment pass, the loop stops. A stuck-recovery path handles iterations that add nothing. The full model lives in `references/convergence/convergence.md`.

**Q: Why fresh context per iteration instead of accumulating findings?**

A: A long conversation window degrades research quality. Older findings crowd out new reasoning. By dispatching a fresh LEAF agent each round and externalizing all state to files, the loop keeps every iteration sharp. The agent reads what it needs from disk and gets a clean window to think in.

**Q: Where do findings live during and after the loop?**

A: Each iteration writes to `research/iterations/iteration-NNN.md`. The reducer deduplicates findings into `research/deep-research-findings-registry.json`. After convergence, the workflow synthesises everything into `research/research.md`. The dashboard at `research/deep-research-dashboard.md` tracks progress throughout.

**Q: Can I resume a crashed run?**

A: Yes. State is externalized to disk files. Use `/deep:start-research-loop` with `:auto` or `:confirm` and the workflow detects the existing packet and enters `resume` mode, appending to the active lineage.

**Q: What is the difference between `auto` and `confirm` mode?**

A: `auto` runs every iteration without asking. It stops only at convergence or the iteration cap. `confirm` pauses before each iteration and at synthesis, so you can steer the focus or approve the direction before the agent runs.

---

## 8. VERIFICATION

The skill ships a feature catalog and a manual testing playbook.

| Check | How to run it |
|---|---|
| Feature catalog | Review `feature_catalog/` for capability coverage across iteration lifecycle, convergence, state and recovery |
| Manual testing playbook | Run scenarios under `manual_testing_playbook/` with preconditions, expected signals and pass/fail rules defined in the root playbook |
| Config validation | `node -e "JSON.parse(require('node:fs').readFileSync('.opencode/skills/deep-research/assets/deep_research_config.json','utf8'))" && echo "JSON OK"` prints `JSON OK` |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, smart routing and the full operator contract |
| [`references/guides/quick_reference.md`](./references/guides/quick_reference.md) | One-page operator cheat sheet with commands, flags and state files |
| [`references/protocol/loop_protocol.md`](./references/protocol/loop_protocol.md) | Iteration lifecycle, dispatch contract and reducer sequencing |
| [`references/protocol/spec_check_protocol.md`](./references/protocol/spec_check_protocol.md) | Bounded spec.md anchoring and generated-fence write-back |
| [`references/convergence/convergence.md`](./references/convergence/convergence.md) | Stop-contract hub and decision tree |
| [`references/convergence/convergence_signals.md`](./references/convergence/convergence_signals.md) | Signal definitions, composite weights and threshold reference |
| [`references/convergence/convergence_recovery.md`](./references/convergence/convergence_recovery.md) | Blocked-stop and stuck-recovery procedures |
| [`references/convergence/convergence_graph.md`](./references/convergence/convergence_graph.md) | Coverage-graph stop path |
| [`references/state/state_format.md`](./references/state/state_format.md) | Packet-file layout, owners and mutability rules |
| [`references/state/state_jsonl.md`](./references/state/state_jsonl.md) | Append-only JSONL record types |
| [`references/state/state_outputs.md`](./references/state/state_outputs.md) | Dashboard, iteration files and report outputs |
| [`references/state/state_reducer_registry.md`](./references/state/state_reducer_registry.md) | Reducer ownership, dedup and runtime robustness |
| [`assets/deep_research_config.json`](./assets/deep_research_config.json) | Default loop configuration template |
| [`assets/deep_research_strategy.md`](./assets/deep_research_strategy.md) | Strategy file template |
| [`scripts/reduce-state.cjs`](./scripts/reduce-state.cjs) | State reducer and dashboard generator |
| [`feature_catalog/`](./feature_catalog/) | Feature inventory across lifecycle, convergence, state and recovery |
| [`manual_testing_playbook/`](./manual_testing_playbook/) | Deterministic test scenarios with preconditions and pass/fail rules |
