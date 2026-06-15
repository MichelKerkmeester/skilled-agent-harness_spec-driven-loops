---
title: "Evaluate Context"
description: "Runs convergence.cjs --loop-type context to evaluate all five coverage signals and return CONTINUE / STOP_ALLOWED / STOP_BLOCKED after each iteration."
trigger_phrases:
  - "evaluate context"
  - "convergence.cjs context"
  - "STOP_ALLOWED"
  - "STOP_BLOCKED decision"
  - "convergence script"
  - "graph convergence context"
---

# Evaluate Context

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Runs `convergence.cjs --loop-type context` to evaluate all five coverage signals and return a `CONTINUE | STOP_ALLOWED | STOP_BLOCKED` decision after each iteration.

`convergence.cjs` is the shared deep-loop-runtime script that bridges the host YAML workflow and the TypeScript coverage-graph signal computation. It is the authoritative stop oracle for all three loop types; for `deep-context` it calls `evaluateContext` from `coverage-graph-signals.ts`.

---

## 2. HOW IT WORKS

### Invocation

`step_graph_convergence` in the loop YAML runs:

```
node .opencode/skills/deep-loop-runtime/scripts/convergence.cjs \
  --spec-folder "{spec_folder}" \
  --loop-type "context" \
  --session-id "{config.lineage.sessionId}" \
  --iteration {current_iteration}
```

### Output

The script emits a JSON object to stdout with `decision` (`CONTINUE | STOP_ALLOWED | STOP_BLOCKED`), `signals` (all five `ContextConvergenceSignals` values), `blockers` (array of named failing guards), and `blendedScore`. This JSON is parsed by the host workflow into `graph_decision`, `graph_signals_json`, `graph_blockers_json`, and `graph_convergence_score`.

### Event Emission

After the script runs, `step_graph_convergence` appends a typed `graph_convergence` event to the JSONL state log with the decision, signals, blockers, and timestamp. This event is used by `step_check_convergence` to combine the graph decision with the host's low_progress_streak computation.

### Exit Codes

| Exit Code | Meaning |
|---|---|
| 0 | Success — JSON result on stdout |
| 1 | Script error |
| 2 | Database error |
| 3 | Input validation error (missing args) |

The host workflow treats non-zero exits as `graph_decision: null` and degrades gracefully (proceeds with host saturation check only).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs` | Script | CLI entrypoint: parses args, bootstraps tsx, calls evaluateContext, emits JSON |
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts` | Shared | `evaluateContext` — computes all five signals from the SQLite coverage graph |
| `.opencode/commands/deep/assets/deep_context_auto.yaml` | Workflow | `step_graph_convergence` — invocation, JSON parsing, graph_convergence event emission |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/context/manual_testing_playbook/04--convergence-detection/evaluate-context.md` | Manual playbook | Verifies convergence.cjs exits 0, emits parseable JSON with all five signal fields and a valid decision enum value |

---

## 4. SOURCE METADATA

- Group: Convergence Detection
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `04--convergence-detection/evaluate-context.md`

Related references:
- [context-coverage-signals.md](context-coverage-signals.md) — The five signals that evaluate-context computes
- [relevance-gate.md](relevance-gate.md) — How STOP_BLOCKED from this script feeds the blocked_stop lifecycle
