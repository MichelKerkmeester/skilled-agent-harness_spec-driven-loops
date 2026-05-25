---
title: deep-research
description: Autonomous deep research loop with lineage-aware lifecycle branches, reducer-owned packet synchronization, and runtime parity guidance.
trigger_phrases:
  - "deep research loop"
  - "autonomous iterative research"
  - "lineage aware research"
  - "fresh context research"
  - "reducer synchronized research packet"
---

# deep-research

> Autonomous multi-iteration research loop for topics that need repeated investigation, fresh context per iteration, and durable packet state on disk.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

1. [OVERVIEW](#1--overview)
2. [QUICK START](#2--quick-start)
3. [FEATURES](#3--features)
4. [STRUCTURE](#4--structure)
5. [CONFIGURATION](#5--configuration)
6. [USAGE EXAMPLES](#6--usage-examples)
7. [LIFECYCLE MODES](#7--lifecycle-modes)
8. [RUNTIME PARITY](#8--runtime-parity)
9. [TROUBLESHOOTING](#9--troubleshooting)
10. [FAQ](#10--faq)
11. [RELATED DOCUMENTS](#11--related-documents)
<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

`deep-research` is research-only. It runs repeated investigation cycles through `/deep:start-research-loop`, dispatching a fresh `@deep-research` agent for each iteration while keeping continuity in packet files instead of live conversation memory.

### Usage

Use this README for human orientation: command examples, packet layout, lifecycle modes, troubleshooting, and reference navigation. Use `SKILL.md` for runtime instructions and smart routing.

### Key Statistics

| Metric | Value |
|---|---|
| Version | `1.14.0.0` |
| Primary command | `/deep:start-research-loop` |
| Runtime modes | `auto`, `confirm` |
| Live lifecycle branches | `new`, `resume`, `restart` |
| Focused references | 13 |
| Scripts | 2 primary helpers |

### How This Compares

| Capability | This Skill | Related Skill |
|---|---|---|
| Research loop | Multi-round investigation and synthesis | `@context` handles single-pass lookup |
| Review loop | Out of scope | `deep-review` owns iterative code review |
| Shared runtime | Consumes executor and graph support | `deep-loop-runtime` owns shared libraries |
| Packet docs | Writes research artifacts under a spec folder | `system-spec-kit` owns spec validation and memory continuity |

### Key Features

| Feature | What It Does |
|---|---|
| Fresh-context iteration | Starts each research pass with externalized packet state |
| Reducer synchronization | Keeps strategy, registry, dashboard, and synthesis metadata aligned |
| Legal-stop convergence | Blocks premature STOP until coverage and quality gates pass |
| Graph-aware gates | Uses `graphEvents` as extra STOP-blocking evidence when present |
| Spec anchoring | Bounded `spec.md` seed and generated-fence write-back during the workflow |
| Shared resource family | Quick reference, loop protocol, split convergence/state references, config, strategy, dashboard, prompt-pack, and runtime capability assets aligned with sibling deep skills while staying research-specific. |

The packet is lineage-aware. Every run carries `sessionId`, `parentSessionId`, `lineageMode`, `generation`, and `continuedFromRun`, so the workflow can distinguish an active resume from a restart. `fork` and `completed-continue` are reserved for a future release and are not runtime-supported today. See the Lifecycle Branches section in `references/protocol/loop_protocol.md` for the canonical one-session contract.

The packet is also reducer-synchronized. The agent writes the iteration file plus the JSONL record. The workflow reducer then updates the machine-owned packet surfaces so `deep-research-strategy.md`, `findings-registry.json`, `deep-research-dashboard.md`, and synthesis metadata cannot drift apart.

The workflow also anchors every run to a real `spec.md`. During late INIT it follows [`references/protocol/spec_check_protocol.md`](references/protocol/spec_check_protocol.md): acquire `research/.deep-research.lock`, classify `folder_state` as `no-spec`, `spec-present`, `spec-just-created-by-this-run`, or `conflict-detected`, and then either seed a Level 1 spec or append bounded context before LOOP starts.

During SYNTHESIS the same contract replaces exactly one `<!-- BEGIN GENERATED: deep-research/spec-findings -->` ... `<!-- END GENERATED: deep-research/spec-findings -->` block under the chosen host anchor while keeping `research/research.md` canonical.

Outside the research loop itself, `/speckit:resume` remains the canonical recovery surface for packet work. Continuity still rebuilds from `handover.md`, then `_memory.continuity`, then the remaining spec docs, while generated memory artifacts stay supporting only.

For iterative code review, use `deep-review`.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:quick-start -->
## 2. QUICK START

```bash
/deep:start-research-loop:auto "WebSocket reconnection strategies across browsers"
/deep:start-research-loop:confirm "Distributed cache invalidation patterns"
/deep:start-research-loop:auto "API backpressure patterns" --max-iterations 6 --convergence 0.03
```

What the workflow creates under the resolved `{artifact_dir}`:

- `deep-research-config.json`
- `deep-research-state.jsonl`
- `deep-research-strategy.md`
- `findings-registry.json`
- `deep-research-dashboard.md`
- `iterations/iteration-NNN.md`
- `research.md`

The artifact directory always lives under the target spec's local `research/` folder. First runs with an empty local folder use `{spec_folder}/research/` directly, including child-phase and sub-phase targets. A `{spec_folder}/research/{ownerSlug}-pt-NN/` packet is allocated only when prior local content already exists for a different target. Pause a running loop by creating `.deep-research-pause` inside the resolved `{artifact_dir}`, then delete it to let the workflow continue from the next lifecycle check.
<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:features -->
## 3. FEATURES

- Fresh context per iteration: Each iteration uses a fresh LEAF agent dispatch.
- Lineage-aware lifecycle: Supports `new`, `resume`, and `restart`. `fork` and `completed-continue` are deferred. See the Lifecycle Branches section in `references/protocol/loop_protocol.md`.
- Reducer synchronization: Strategy, dashboard, registry, and synthesis metadata are updated from canonical iteration outputs.
- Packet-first recovery: Hook and non-hook runtimes derive the same next action from packet files.
- Runtime capability matrix: One documented and machine-readable source of truth for provider quirks and parity expectations.
- `spec.md` anchoring: Late INIT follows `references/protocol/spec_check_protocol.md` to seed or sync bounded packet context before LOOP begins.
- Folder-state contract: `folder_state` resolves to `no-spec`, `spec-present`, `spec-just-created-by-this-run`, or `conflict-detected` before any `spec.md` mutation branch runs.
- Advisory lock + generated fence: The workflow holds `research/.deep-research.lock` through synthesis and replaces one `BEGIN/END GENERATED` findings block in `spec.md`.
- Progressive synthesis: `research.md` can be updated incrementally and is finalized during synthesis.
- Negative knowledge: Ruled-out directions and dead ends are preserved as first-class outputs.
- Quality guards: Source diversity, focus alignment, and weak-source checks must pass before STOP is accepted.
- 3-signal convergence model: Composite stop decision uses Rolling Average (`0.30`), MAD Noise Floor (`0.35`), and Question Entropy (`0.35`). STOP requires a normalized weighted score above `0.60`, then legal-stop gates must pass.
- Graph-aware legal-stop checks: When `graphEvents` exist, structural graph signals add extra STOP-blocking evidence on top of the standard convergence math.
- Semantic coverage graph: Each iteration emits `graphEvents` (nodes + edges) in JSONL, building an in-memory coverage graph with relation types (ANSWERS, SUPPORTS, CONTRADICTS, SUPERSEDES, DERIVED_FROM, COVERS, CITES).
- Graph convergence guards: STOP-blocking guards. sourceDiversity (>= 0.4) and evidenceDepth (>= 1.5) must pass before convergence is accepted, preventing premature termination from single-source or shallow-evidence research.
- Question coverage tracking: Graph tracks which research questions have ANSWERS edges, computing an answerCoverage ratio that contributes to the convergence score.
- Fail-closed corruption handling: The reducer throws a structured error before writing any derived files when JSONL corruption is detected in non-lenient mode.
- Graph convergence fallback: When `blendedScore` is absent from `graph_convergence` events, the reducer uses a numeric fallback instead of collapsing to zero.
- Terminal stop metadata: The reducer parses `synthesis_complete` events to derive authoritative dashboard status rather than relying on stale config.
<!-- /ANCHOR:features -->

---

<!-- ANCHOR:structure -->
## 4. STRUCTURE

```text
.opencode/skills/deep-research/
  SKILL.md
  README.md
  references/
    convergence/
      convergence.md
      convergence_graph.md
      convergence_recovery.md
      convergence_reference_only.md
      convergence_signals.md
    state/
      state_format.md
      state_jsonl.md
      state_outputs.md
      state_reducer_registry.md
    protocol/
      loop_protocol.md
      spec_check_protocol.md
    guides/
      capability_matrix.md
      quick_reference.md
  assets/
    deep_research_config.json
    deep_research_dashboard.md
    deep_research_strategy.md
    prompt_pack_iteration.md.tmpl
    runtime_capabilities.json
  feature_catalog/
    feature_catalog.md
    01--loop-lifecycle/
    02--state-management/
    03--convergence/
    04--research-output/
```

Runtime packet layout:

```text
{spec_folder}/research/
  deep-research-config.json
  deep-research-state.jsonl
  deep-research-strategy.md
  findings-registry.json
  deep-research-dashboard.md
  .deep-research-pause
  research.md
  archive/
    {sessionId}/
  iterations/
    iteration-001.md
    iteration-002.md
  {ownerSlug}-pt-NN/                 # Conditional: prior non-matching content exists
```

Ownership model:

- Agent-owned writes: `iteration-NNN.md`, JSONL iteration/event append, optional progressive synthesis content.
- Reducer-owned writes: `deep-research-strategy.md` machine-owned sections, `findings-registry.json`, `deep-research-dashboard.md`.
- Workflow-owned output: `research.md` and lifecycle snapshot files such as `synthesis-v{generation}.md`.
- Protocol-owned packet mutations: bounded `spec.md` seeding, context append, advisory lock lifecycle, and generated-fence replacement defined in `references/protocol/spec_check_protocol.md`.
<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:configuration -->
## 5. CONFIGURATION

| Setting | Default | Purpose |
|---|---|---|
| `--max-iterations` | `10` | Hard iteration ceiling |
| `--convergence` | `0.05` | Novelty threshold for rolling convergence |
| `progressiveSynthesis` | `true` | Allows `research.md` updates before final synthesis |
| `stuckThreshold` | `3` | Consecutive no-progress iterations before recovery |
| `executor.kind` | `native` | Selects native LEAF agent or workflow-routed CLI executor |

Non-configurable invariants: the command YAML owns dispatch, `reduce-state.cjs` owns reducer writes, and `@deep-research` remains LEAF-only.
<!-- /ANCHOR:configuration -->

---

<!-- ANCHOR:usage-examples -->
## 6. USAGE EXAMPLES

**Autonomous investigation**

```text
User request: Deep research browser WebSocket reconnection behavior
Skill routing: LOOP_SETUP + CONVERGENCE
Resources loaded: quick_reference, loop_protocol, convergence, state_format
Expected output: research packet with iterations, dashboard, registry, and synthesis
```

**Resume an active packet**

```text
User request: Continue the deep research run
Skill routing: STATE + ITERATION
Resources loaded: state_jsonl, state_outputs, state_reducer_registry, loop_protocol
Expected output: resumed lineage event and next iteration or synthesis
```

**Diagnose a blocked STOP**

```text
User request: Why did convergence not stop?
Skill routing: CONVERGENCE + RECOVERY
Resources loaded: convergence, convergence_signals, convergence_recovery, convergence_graph
Expected output: gate/blocker explanation and next focus
```
<!-- /ANCHOR:usage-examples -->

---

<!-- ANCHOR:lifecycle-modes -->
## 7. LIFECYCLE MODES

| Mode | Meaning |
|------|---------|
| `new` | First run against this spec folder. No prior state. |
| `resume` | Continue the active lineage with the same `sessionId`. Persisted as a `resumed` JSONL event. |
| `restart` | Start a new generation with explicit parent linkage and archive the prior `research/` tree under `research_archive/{timestamp}/`. Persisted as a `restarted` JSONL event. |
| `fork` (deferred) | Reserved. Earlier drafts described this as a sibling-lineage branch. the runtime does not emit lineage events for `fork` today. Do not expose it in user-facing workflows. |
| `completed-continue` (deferred) | Reserved. Earlier drafts described snapshotting the prior synthesis as immutable `synthesis-v{generation}.md`. the runtime does not emit lineage events for `completed-continue` today. |

See the Lifecycle Branches section in `references/protocol/loop_protocol.md` for the canonical event contract. Legacy artifact names remain read-only migration aliases for a 4-week window. The workflow writes only canonical `deep-research-*` names and emits migration events when it consumes a legacy alias.
<!-- /ANCHOR:lifecycle-modes -->

---

<!-- ANCHOR:runtime-parity -->
## 8. RUNTIME PARITY

The workflow resolves the runtime mirror from the active CLI, but every mirror must preserve the same packet contract:

| Runtime | Mirror |
|---------|--------|
| OpenCode / Copilot | `.opencode/agents/deep-research.md` |
| Claude | `.claude/agents/deep-research.md` |
| Codex | `.codex/agents/deep-research.toml` |
| Gemini | `.gemini/agents/deep-research.md` |

Read `.opencode/skills/deep-research/references/guides/capability_matrix.md` for the parity checklist and `.opencode/skills/deep-research/assets/runtime_capabilities.json` plus `.opencode/skills/deep-research/scripts/runtime-capabilities.cjs` for the machine-readable lookup path.
<!-- /ANCHOR:runtime-parity -->

---

<!-- ANCHOR:troubleshooting -->
## 9. TROUBLESHOOTING

| Problem | Check |
|---------|-------|
| Packet resumes when you expected a new run | Inspect `config.lineage` and the latest lifecycle event in `deep-research-state.jsonl`. |
| Strategy/dashboard drift | Confirm the reducer ran and regenerated `findings-registry.json` and `deep-research-dashboard.md`. |
| JSONL parse failure | Run `cat research/deep-research-state.jsonl | jq .` and fall back to iteration-file reconstruction if needed. |
| Runtime mirror behaves differently | Compare the mirror against `references/guides/capability_matrix.md`. |
| Loop will not continue after pause | Remove `research/.deep-research-pause` and restart the command so the lifecycle check can emit `resumed`. |
| `spec.md` write is blocked | Inspect `folder_state`, `research/.deep-research.lock`, and the conflict details defined in `references/protocol/spec_check_protocol.md`. |
<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:faq -->
## 10. FAQ

**Q: Does the agent still edit `deep-research-strategy.md` directly?**
A: Not as the source of truth. The reducer owns the machine-managed sections so packet state stays synchronized.

**Q: What is the difference between `resume` and `restart`?**
A: `resume` continues the same `sessionId` and generation, leaving the `research/` tree in place. The workflow appends a `resumed` JSONL event. `restart` archives the existing `research/` tree under `research_archive/{timestamp}/`, mints a fresh `sessionId`, increments `generation`, and appends a `restarted` JSONL event. Both events share the full lineage-contract field set documented in the Lifecycle Branches section of `references/protocol/loop_protocol.md`.

**Q: What happened to `fork` and `completed-continue`?**
A: Both were described in earlier drafts but never shipped as runtime branches. They are deferred and the workflow no longer exposes them as options. If the long-form lineage feature is implemented later it will arrive with first-class event emission, reducer ancestry handling, and replay fixtures. until then treat each run as a standalone session or use `restart` to archive the prior one.

**Q: Can non-hook runtimes use the same workflow safely?**
A: Yes. Packet files are the authority. Hooks only improve startup ergonomics.

**Q: What can `/deep:start-research-loop` change in `spec.md`?**
A: Only the bounded mutations in `references/protocol/spec_check_protocol.md`. seed markers or pre-init context during INIT, plus one machine-owned `BEGIN GENERATED` / `END GENERATED` findings block during SYNTHESIS.

**Q: Where should review work go now?**
A: Use `deep-review` and `/deep:start-review-loop`.
<!-- /ANCHOR:faq -->

---

<!-- ANCHOR:related-documents -->
## 11. RELATED DOCUMENTS

### Dependencies

`deep-research` depends on `.opencode/skills/deep-loop-runtime/` for executor + state + coverage-graph runtime, which runs in a fully isolated, no-MCP execution mode.

| Resource | Purpose |
|----------|---------|
| `SKILL.md` | Full protocol and rules |
| `references/protocol/loop_protocol.md` | Detailed lifecycle and reducer sequencing |
| `references/protocol/spec_check_protocol.md` | Bounded `spec.md` anchoring, `folder_state` rules, advisory lock lifecycle, and generated-fence write-back |
| `references/state/state_format.md` | State packet hub and mutability/navigation summary |
| `references/state/state_jsonl.md` | Config, iteration, event, lineage, graph, and blocked-stop records |
| `references/state/state_outputs.md` | Strategy, iteration markdown, `research.md`, dashboard, resource-map, and spec anchoring outputs |
| `references/state/state_reducer_registry.md` | Reducer ownership, findings registry, validation, reconstruction, and file protection |
| `references/convergence/convergence.md` | Live stop contract, legal-stop gates, and convergence navigation hub |
| `references/convergence/convergence_signals.md` | `newInfoRatio`, rolling average, MAD, entropy, stuck count, and reporting |
| `references/convergence/convergence_recovery.md` | Stuck recovery, recovery strategy selection, tiered errors, and escalation |
| `references/convergence/convergence_graph.md` | Graph-aware STOP gates, graph convergence events, and graceful degradation |
| `references/convergence/convergence_reference_only.md` | Non-executable segment, semantic, dead-end, and optimizer notes |
| `manual_testing_playbook/04--convergence-and-recovery/031-graph-convergence-signals.md` | Operator test case for graph stop guards and blocked-stop behavior |
| `references/guides/capability_matrix.md` | Runtime parity source of truth |
| `feature_catalog/feature_catalog.md` | Canonical feature inventory across loop lifecycle, state management, convergence, and research output |
| `deep-review` | Dedicated iterative code review skill |
<!-- /ANCHOR:related-documents -->
