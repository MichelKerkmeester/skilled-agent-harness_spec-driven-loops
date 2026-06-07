---
title: "deep-context: Heterogeneous Codebase Context Loop"
description: "Iterative, multi-model context-gathering loop that maps existing code for reuse, integration points, and conventions before planning or implementation."
trigger_phrases:
  - "gather context for feature"
  - "map the code for X"
  - "what existing code can I reuse"
  - "deep context loop"
  - "pre-plan context sweep"
---

# deep-context

Iterative, multi-model codebase-context-gathering loop that sweeps the existing repository for the code relevant to a feature and synthesizes a reuse-first Context Report before planning or implementation.

---

## 1. OVERVIEW

### Purpose

`deep-context` maps existing code so that `/speckit:plan` and `/speckit:implement` start from verified knowledge of what to reuse, where to connect, and which conventions to follow — rather than ad-hoc exploration. It runs a heterogeneous pool of executors over the same code scope in parallel and uses cross-executor **agreement** to rank findings by confidence.

### Usage

Use this README for human orientation: command examples, packet layout, configuration, usage scenarios, troubleshooting, and reference navigation. Use `SKILL.md` for runtime instructions and smart routing.

### Key Statistics

| Metric | Value |
|---|---|
| Version | `1.0.0` |
| Primary command | `/deep:start-context-loop` |
| Runtime modes | `auto`, `confirm` |
| Default executor pool | 2 native `@deep-context` seats (native-only); add `--executor` for CLI/heterogeneous |
| References | 2 (`loop_protocol.md`, `convergence.md`) |
| Assets | 2 (`context_report_template.md`, `deep_context_config.json`) |
| Scripts | 1 (`reduce-state.cjs`) |

### How This Compares

| Capability | This Skill | Related Skill |
|---|---|---|
| Codebase understanding | Multi-model parallel sweep, agreement-weighted | `@context` handles single-pass read-only lookup |
| Web/outward research | Out of scope | `deep-research` owns iterative external investigation |
| Code audit and defects | Out of scope | `deep-review` owns iterative defect-finding |
| Shared runtime | Consumes executor and coverage-graph support | `deep-loop-runtime` owns shared libraries |
| Planning and implementation | Feeds the Context Report to downstream commands | `system-spec-kit` owns spec validation and memory continuity |

### Key Features

| Feature | What It Does |
|---|---|
| Heterogeneous pool | Runs native Claude agents alongside CLI seats (MiMo, gpt, deepseek) in parallel |
| By-model shared scope | All seats sweep the same focus; agreement = multiple models finding the same thing |
| Agreement-weighted findings | A reuse candidate confirmed by 3 of 5 executors outranks a single-seat find |
| Relevance-gated convergence | Below-gate findings go to a low-confidence bucket, not the report |
| Pointer-only report | Ships `file:symbol` references with signatures, not pasted source bodies |
| Contradiction surfacing | Incompatible seat findings are surfaced, never auto-resolved |
| Runtime durability | Crash-safe state writes (atomic temp+fsync+rename), corrupt JSONL tail auto-repaired before each reduce, seat outputs validated before merge (invalid findings surface as `seatValidationWarnings`), single-writer loop-lock (`scripts/loop-lock.cjs`) prevents concurrent session races, CLI seats dispatched with recursion-guard env so no seat can launch a nested loop — durability and validation parity with `deep-research` and `deep-review` |

---

## 2. QUICK START

**Step 1: Invoke the skill.**

Route is automatic from `/deep:start-context-loop`. The skill activates when a request matches context-gathering intent. To load manually:

```bash
# Read runtime instructions
Read(".opencode/skills/deep-context/SKILL.md")
```

**Step 2: Run the primary workflow.**

```bash
/deep:start-context-loop:auto "WebSocket reconnection — map existing transport layer"
/deep:start-context-loop:confirm "auth middleware — what can I reuse before planning"
```

Expected result: a converged Context Report at `{spec_folder}/context/context-report.md` with a REUSE catalog, integration points, touch list, and conventions.

**Step 3: Verify the reducer output.**

```bash
node .opencode/skills/deep-context/scripts/reduce-state.cjs <spec-folder>
```

Expected result: JSON summary with `registryPath`, `dashboardPath`, `iterationsCompleted`, `findings`, `agreementEligible`, and `contradictions`.

**Step 4: Validate the JSON config.**

```bash
node -e "JSON.parse(require('node:fs').readFileSync('.opencode/skills/deep-context/assets/deep_context_config.json','utf8'))" && echo "JSON OK"
```

---

## 3. FEATURES

### 3.1 FEATURE HIGHLIGHTS

The loop runs in two phases: a **parallel sweep phase** where all executor seats analyze the same code scope simultaneously, and a **merge + convergence phase** where the host deduplicates findings by cross-executor agreement and evaluates stop signals. The Context Report is emitted only when relevance, agreement, and coverage gates all pass.

A seat that fails (provider unavailable, timeout) does not block the other seats. The agreement count simply reflects only the seats that returned findings. A pool of 5 with 1 failure still produces 4-executor agreement signals.

### 3.2 FEATURE REFERENCE

| Feature | Inputs | Output | Primary Resource |
|---|---|---|---|
| Frontier seeding | Feature query, code graph | Ranked SLICE nodes | `references/protocol/loop_protocol.md` §3 |
| Parallel sweep | SLICE frontier, executor pool | Per-seat structured findings | `references/protocol/loop_protocol.md` §5 |
| Agreement merge | Raw per-seat findings | `findings-registry.json` | `scripts/reduce-state.cjs` |
| Convergence | Coverage-graph signals | CONTINUE / STOP_ALLOWED / STOP_BLOCKED | `references/convergence/convergence.md` |
| Context Report | `findings-registry.json` | `context-report.md` + `.json` | `assets/context_report_template.md` |

---

## 4. STRUCTURE

```text
deep-context/
+-- SKILL.md                          # Runtime instructions and smart router
+-- README.md                         # Human-facing overview (this file)
+-- references/
|   +-- guides/
|   |   +-- quick_reference.md        # Operator cheat sheet (ALWAYS baseline)
|   +-- protocol/
|   |   +-- loop_protocol.md          # Iteration lifecycle, parallel dispatch, merge
|   +-- convergence/
|   |   +-- convergence.md            # Stop-contract hub
|   |   +-- convergence_signals.md    # 5 signals + composite weights + thresholds
|   |   +-- convergence_recovery.md   # Blocked-stop / stuck recovery
|   |   +-- convergence_graph.md      # loop_type='context' coverage-graph stop path
|   +-- state/
|   |   +-- state_format.md           # Packet-file hub (owners, mutability)
|   |   +-- state_jsonl.md            # deep-context-state.jsonl record types
|   |   +-- state_outputs.md          # Dashboard / Context Report / iteration outputs
|   |   +-- state_reducer_registry.md # reduce-state.cjs ownership + robustness
+-- assets/
|   +-- context_report_template.md   # Context Report schema (REUSE-catalog-first)
|   +-- deep_context_config.json     # Run config template; copied to packet at init
+-- scripts/
    +-- reduce-state.cjs              # Agreement-weighted findings reducer + dashboard
    +-- README.md                     # scripts/ folder orientation
```

| Path | Purpose |
|---|---|
| `SKILL.md` | Runtime routing, rules, and smart router pseudocode |
| `references/guides/quick_reference.md` | One-page operator cheat sheet (commands, params, state files, convergence tree) — ALWAYS baseline |
| `references/protocol/loop_protocol.md` | Iteration lifecycle, roles, packet layout, merge rules, reliability invariants |
| `references/convergence/` | Stop-contract hub + `convergence_signals` (5 signals + weights + thresholds), `convergence_recovery`, `convergence_graph` |
| `references/state/` | `state_format` (packet hub), `state_jsonl` (records), `state_outputs` (dashboard/report), `state_reducer_registry` (reducer ownership + robustness) |
| `assets/context_report_template.md` | Schema for `context-report.md`; sections ordered by value-per-token |
| `assets/deep_context_config.json` | Default run config; populated and written to `{spec_folder}/context/deep-context-config.json` at init |
| `scripts/reduce-state.cjs` | Reads state log + per-seat findings; writes `findings-registry.json` and dashboard |

Runtime packet layout under `{spec_folder}/context/`:

```text
context/
+-- deep-context-config.json      # Run config (host-written at init)
+-- deep-context-state.jsonl      # Append-only state log
+-- deep-context-strategy.md      # Focus and scope notes
+-- iterations/
|   +-- iteration-001.md
|   +-- iteration-002.md
+-- seats/
|   +-- {label}/iter-NNN/         # Per-seat raw findings (JSON)
+-- findings-registry.json        # Agreement-weighted findings (reducer-owned)
+-- deep-context-dashboard.md     # Auto-generated progress view (reducer-owned)
+-- context-report.md             # The deliverable
+-- context-report.json           # Machine-readable deliverable
```

---

## 5. CONFIGURATION

| Setting | Default | Purpose |
|---|---|---|
| `maxIterations` | `8` | Hard iteration ceiling |
| `convergenceThreshold` | `0.10` | New agreement-eligible findings per iteration below which saturation is considered |
| `stuckThreshold` | `2` | Consecutive no-progress iterations before recovery focus |
| `maxToolCallsPerIteration` | `12` | Per-seat tool call budget |
| `relevanceGate` | `0.55` | Findings below this go to low-confidence bucket |
| `agreementMin` | `2` | Minimum distinct executors for a finding to be agreement-eligible |
| `fanout.concurrency` | `4` | Maximum concurrent seats |
| `fanout.mode` | `by-model-shared-scope` | All seats sweep the same scope in parallel |

Non-configurable invariants:
- The host is the ONLY writer of merged state. Seats are read-only analyzers.
- `reduce-state.cjs` owns `findings-registry.json` and `deep-context-dashboard.md`.
- Every `file:symbol` in the report must be code-graph-verified before the run completes.

---

## 6. USAGE EXAMPLES

**Pre-plan context sweep**

```text
User request: Gather context for the WebSocket reconnection feature before planning
Skill routing: FRONTIER_SEEDING + PARALLEL_SWEEP
Resources loaded: loop_protocol.md, convergence.md
Expected output: Context Report with REUSE catalog, integration points, touch list
```

**Diagnose a blocked stop**

```text
User request: The context loop won't converge — agreementRate is stuck at 0.3
Skill routing: CONVERGENCE
Resources loaded: convergence.md
Expected output: Explanation of which gate is failing and a recovery focus suggestion
```

**Verify the reducer**

```text
User request: Run the reducer against the current context packet
Skill routing: AGREEMENT_MERGE
Command: node .opencode/skills/deep-context/scripts/reduce-state.cjs .opencode/specs/my-feature
Expected output: Updated findings-registry.json and deep-context-dashboard.md
```

---

## 7. TROUBLESHOOTING

| What You See | Cause | Fix |
|---|---|---|
| `agreementRate` stuck below 0.50 | Only one or two seats are returning findings | Check pool authentication; add a native seat to guarantee at least one agreement pair |
| `STOP_BLOCKED: sliceCoverage < 0.70` | The frontier has SLICE nodes that no seat has covered | Extend `maxIterations` or narrow the scope to match the iteration budget |
| `STOP_BLOCKED: relevanceFloor < 0.50` | Seats are collecting tangential files | Tighten the scope query; increase `relevanceGate` temporarily |
| Reducer exits with an error | `deep-context-state.jsonl` has corrupt lines | The reducer auto-repairs a corrupt trailing line via `repairJsonlTail` before reading; if the error persists, inspect the JSONL for mid-file corruption and remove the bad line, then re-run |
| Context report missing entries | Below-gate findings ended up in `lowConfidence` | Lower `relevanceGate` slightly, or accept the partial report and note the gaps |
| CLI seat times out | Provider is slow or the prompt is too broad | Increase the per-seat timeout; narrow the scope slice; reduce `maxToolCallsPerIteration` |

---

## 8. FAQ

**Q: What is the difference between `deep-context` and the `@context` agent?**

A: `@context` is a single-pass read-only lookup — one agent, one request, no iteration. `deep-context` is a convergence-gated multi-iteration loop with a heterogeneous pool. Use `@context` for quick targeted lookups; use `deep-context` when you need a verified, agreement-weighted map of an entire feature's code surface before planning.

**Q: Can I run the loop without a spec folder?**

A: Yes. When no spec folder exists, the host uses a standalone run dir and the report path is handed to `/speckit:plan` at the end. All packet files still live under a `context/` subdirectory of that run dir.

**Q: Why does the report ship pointers instead of source bodies?**

A: Source bodies paste stale code into the report. The consumer (the planner or implementer) reads the actual code at the cited `file:symbol` just-in-time. This prevents context rot and keeps the report token-efficient.

**Q: What happens if a provider in the pool is unavailable?**

A: That seat's findings are absent from the agreement merge. The remaining seats still produce findings. If the absence drops `agreementRate` below the guard, the loop gets a `STOP_BLOCKED` and continues iterating until the gate passes or the cap is hit. Escalate if a required provider cannot be reached at all.

**Q: When should I lower `convergenceThreshold`?**

A: Lower it (e.g. to 0.05) when you want the loop to run more iterations before declaring saturation — useful for broad scope sweeps. Raise it (e.g. to 0.15) when you want to stop faster on a narrow, well-defined feature.

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, smart router, rules |
| [`references/protocol/loop_protocol.md`](./references/protocol/loop_protocol.md) | Iteration lifecycle, roles, packet layout, merge rules |
| [`references/convergence/convergence.md`](./references/convergence/convergence.md) | Stop contract, why agreement + relevance are guards (hub) |
| [`references/convergence/convergence_signals.md`](./references/convergence/convergence_signals.md) | The 5 signals, composite weights, threshold reference |
| [`references/state/`](./references/state/state_format.md) | Packet format, JSONL records, outputs, reducer ownership |
| [`references/guides/quick_reference.md`](./references/guides/quick_reference.md) | One-page operator cheat sheet |
| [`assets/context_report_template.md`](./assets/context_report_template.md) | Context Report schema and field guide |
| [`assets/deep_context_config.json`](./assets/deep_context_config.json) | Default run config template |
| [`scripts/README.md`](./scripts/README.md) | scripts/ folder orientation |
| [`scripts/reduce-state.cjs`](./scripts/reduce-state.cjs) | Agreement-weighted findings reducer |
