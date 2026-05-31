---
title: "deep-research: Feature Catalog"
description: "Unified reference combining the complete feature inventory and current-reality reference for the deep-research autonomous research loop."
---

# deep-research: Feature Catalog

This document combines the current feature inventory for the `deep-research` system into a single reference. The root catalog acts as the system-level directory. It summarizes the live loop lifecycle, packet state surfaces, convergence controls, and research outputs, then points to the per-feature files that hold the deeper implementation and validation anchors.

---

## 1. OVERVIEW

Use this catalog as the canonical inventory for the live `deep-research` feature surface. The numbered sections below group the system by capability area so readers can move from a top-level summary into per-feature reference files without losing the implementation and validation context behind each loop behavior.

| Category | Coverage | Primary Runtime Surface |
|---|---:|---|
| Loop lifecycle | 6 features | `.opencode/commands/deep/start-research-loop.md`, auto and confirm YAML workflows, fan-out runtime primitives |
| State management | 3 features | `research/deep-research-*.json`, `research/findings-registry.json`, reducer-owned strategy surfaces |
| Convergence | 4 features | `references/convergence/convergence.md`, workflow legal-stop gates, graph convergence hooks |
| Research output | 2 features | `research/research.md`, iteration files, reducer-backed negative knowledge surfaces |

---

## 2. LOOP LIFECYCLE

These entries cover the command-managed loop from spec-folder setup through final continuity save.

### Initialization

#### Description

Sets up a research packet and locks the lineage contract before the first iteration runs.

#### How It Works

Initialization classifies the packet as fresh, resume, completed-session, or invalid-state before writing anything. It then creates canonical `deep-research-*` artifacts, seeds the reducer-owned findings registry, validates the research charter sections, and only exposes `new`, `resume`, and `restart` as runtime-supported lineage modes.

#### Source Files

See [`01--loop-lifecycle/001-initialization.md`](01--loop-lifecycle/001-initialization.md) for full implementation and test file listings.

---

### Iteration dispatch

#### Description

Runs one fresh-context research cycle through the LEAF agent and reducer sync path.

#### How It Works

The loop reads config, JSONL state, and strategy state, generates a compact state summary, checks the pause sentinel, and dispatches `.opencode/agents/deep-research.md` for one iteration only. After the agent writes the iteration file and appends one JSONL line, the workflow runs the reducer to refresh `findings-registry.json`, the machine-owned strategy sections, and the dashboard.

#### Source Files

See [`01--loop-lifecycle/002-iteration-dispatch.md`](01--loop-lifecycle/002-iteration-dispatch.md) for full implementation and test file listings.

---

### Convergence check

#### Description

Chooses whether the loop continues, enters stuck recovery, or reaches a legal stop.

#### How It Works

The loop first applies hard stops and the three-signal `shouldContinue()` vote, then runs the legal-stop gate bundle and optional graph convergence check before accepting STOP. When the legal-stop bundle blocks a stop, the workflow records a first-class `blocked_stop` event and keeps the loop running with an explicit recovery hint.

#### Source Files

See [`01--loop-lifecycle/003-convergence-check.md`](01--loop-lifecycle/003-convergence-check.md) for full implementation and test file listings.

---

### Synthesis

#### Description

Consolidates the iteration trail into the canonical research document.

#### How It Works

Synthesis owns the final `research/research.md` output. It reads all iteration files and the final strategy state, compiles the standard 17-section research document, adds the required `Eliminated Alternatives` table, marks the config status complete, and appends a `synthesis_complete` event to the JSONL log.

#### Source Files

See [`01--loop-lifecycle/004-synthesis.md`](01--loop-lifecycle/004-synthesis.md) for full implementation and test file listings.

---

### Memory save

#### Description

Preserves the finished packet through the supported continuity save boundary.

#### How It Works

The save phase calls `generate-context.js` with the spec folder payload and treats that script as the live continuity boundary. Manual authoring under `memory/` is explicitly disallowed, and the workflow expects the save step to refresh the support artifact after synthesis completes.

#### Source Files

See [`01--loop-lifecycle/005-memory-save.md`](01--loop-lifecycle/005-memory-save.md) for full implementation and test file listings.

---

### Fan-out loop dispatch

#### Description

Opt-in fan-out dispatch layer: `step_resolve_artifact_root` artifact-dir override branch,
`step_fanout_spawn` (CLI pool + native sequential agent dispatch), and `step_fanout_merge`
at the top of `phase_synthesis`. Single-executor path is byte-identical to pre-change
behavior.

#### How It Works

Three new YAML steps gated on `config.fanout` presence. CLI lineages run via `fanout-run.cjs`
(pool-capped headless subprocesses). Native lineages run as sequential `agent: deep-research`
dispatches. `step_fanout_merge` produces a consolidated `deep-research-findings-registry.json`
before `step_compile_research` runs. Command flags: `--executor` (repeatable), `--executors
<json>`, `--concurrency N`. Default policy: 0–1 executor → `config.executor`; 2+ →
`config.fanout`.

#### Source Files

See [`01--loop-lifecycle/007-fanout-dispatch.md`](01--loop-lifecycle/007-fanout-dispatch.md) for full implementation and validation file listings.

---

## 3. STATE MANAGEMENT

These entries describe the packet files that carry continuity across fresh-context iterations. Strategy tracking also covers the reducer-owned findings registry that stays in sync with the iteration trail.

### JSONL state log

#### Description

Acts as the append-only ledger for config, iteration, and lifecycle events.

#### How It Works

`deep-research-state.jsonl` stores the config record, iteration records, and typed events such as `resumed`, `restarted`, `blocked_stop`, `graph_convergence`, and `synthesis_complete`. Iteration lines can carry `ruledOut`, `noveltyJustification`, `convergenceSignals`, `focusTrack`, `sourceStrength`, and `graphEvents`, and the reader contract explicitly tolerates malformed lines by skipping them with defaults.

#### Source Files

See [`02--state-management/008-jsonl-state-log.md`](02--state-management/008-jsonl-state-log.md) for full implementation and test file listings.

---

### Strategy tracking

#### Description

Keeps the persistent research brain and the synchronized reducer surfaces aligned.

#### How It Works

`deep-research-strategy.md` holds the readable packet state, while the reducer owns the machine-managed sections such as answered questions, worked and failed approaches, ruled-out directions, and next focus. The same reducer pass also refreshes `findings-registry.json` and `deep-research-dashboard.md`, so the strategy, registry, and dashboard stay aligned with the newest iteration and event trail.

#### Source Files

See [`02--state-management/009-strategy-tracking.md`](02--state-management/009-strategy-tracking.md) for full implementation and test file listings.

---

### Config management

#### Description

Defines the immutable loop contract, tunable thresholds, and runtime capability pointers.

#### How It Works

`deep-research-config.json` is written at initialization and treated as read-only after that point. It records iteration budgets, convergence and stuck thresholds, lineage metadata, file protection rules, pause sentinel and reducer paths, and the runtime capability matrix paths that let the same skill describe OpenCode, Claude, Codex, and Gemini mirrors without changing the packet contract.

#### Source Files

See [`02--state-management/010-config-management.md`](02--state-management/010-config-management.md) for full implementation and test file listings.

---

## 4. CONVERGENCE

These entries cover the stop logic, recovery logic, guard rails, and graph-aware extension that control when research can end.

### Three-signal model

#### Description

Uses statistical novelty and question coverage signals to nominate STOP or CONTINUE.

#### How It Works

The live algorithm checks hard stops first, then computes a weighted vote from rolling average, MAD noise floor, and question entropy coverage. `thought` iterations are excluded from the signal math, `insight` iterations keep low-ratio breakthroughs from looking stuck, and a stop score above `0.60` only nominates STOP until the legal-stop gates also pass.

#### Source Files

See [`03--convergence/011-three-signal-model.md`](03--convergence/011-three-signal-model.md) for full implementation and test file listings.

---

### Stuck detection

#### Description

Detects consecutive no-progress runs and switches the loop into recovery mode.

#### How It Works

The loop increments `stuckCount` when evidence iterations fall below the configured threshold or self-report `stuck`, while `insight` resets the counter and `thought` is ignored. Once the threshold is reached, the recovery protocol classifies the failure mode, injects a targeted recovery prompt, and either resets the loop on renewed progress or exits to synthesis with gaps documented.

#### Source Files

See [`03--convergence/012-stuck-detection.md`](03--convergence/012-stuck-detection.md) for full implementation and test file listings.

---

### Quality guards

#### Description

Blocks weak or incomplete STOP decisions even after convergence math votes to stop.

#### How It Works

The legal-stop bundle checks coverage, evidence density, and research quality before STOP becomes final. Current guard behavior requires source diversity, focus alignment with the original key-question set, and protection against single weak-source answers. Failures emit `guard_violation` and `blocked_stop` events and force the loop back to CONTINUE.

#### Source Files

See [`03--convergence/013-quality-guards.md`](03--convergence/013-quality-guards.md) for full implementation and test file listings.

---

### Graph convergence

#### Description

Adds coverage-graph evidence to the stop decision when iterations emit graph events.

#### How It Works

When `graphEvents` are present, the workflow calls the graph convergence tool, appends a `graph_convergence` event, and folds graph score and blockers into the legal-stop gate path. The reducer surfaces the latest graph decision and blockers in `findings-registry.json` and `deep-research-dashboard.md`, while the system degrades cleanly when no graph data is available.

#### Source Files

See [`03--convergence/014-graph-convergence.md`](03--convergence/014-graph-convergence.md) for full implementation and test file listings.

---

## 5. RESEARCH OUTPUT

These entries cover the canonical `research/research.md` surface and the negative-knowledge contract that keeps dead ends visible.

### Progressive synthesis

#### Description

Keeps `research/research.md` live during the loop and reconciles it at the end.

#### How It Works

`progressiveSynthesis` defaults to `true`, so the agent may create or extend `research/research.md` during each iteration while the workflow still owns the final cleanup pass. If the flag is disabled, iteration work leaves the file alone and the synthesis phase creates it from scratch, but in both cases `research/research.md` stays the canonical workflow-owned research output.

#### Source Files

See [`04--research-output/015-progressive-synthesis.md`](04--research-output/015-progressive-synthesis.md) for full implementation and test file listings.

---

### Negative knowledge

#### Description

Treats failed paths and ruled-out approaches as first-class research output.

#### How It Works

Iteration files include `Ruled Out` and `Dead Ends` sections, JSONL records can carry structured `ruledOut` entries, and the reducer promotes those failed paths into the strategy and findings registry. Final synthesis then consolidates them into the required `Eliminated Alternatives` section so later iterations and later readers do not repeat dead paths.

#### Source Files

See [`04--research-output/016-negative-knowledge.md`](04--research-output/016-negative-knowledge.md) for full implementation and test file listings.
