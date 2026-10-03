---
title: "Architecture: system-deep-loop"
description: "Current package architecture for system-deep-loop: the registry-routed mode hub, the MCP-free runtime beneath it, the graph and append-gateway paths, and the checks that hold them."
trigger_phrases:
  - "system-deep-loop architecture"
  - "deep-loop runtime architecture"
  - "mode append gateway flow"
  - "deep-loop package topology"
importance_tier: "important"
---

# Architecture: system-deep-loop

> Current-reality architecture for the `system-deep-loop` package. It runs iterative research, review, AI Council and improvement loops, reached through `Skill(system-deep-loop)`, the `/deep:*` commands and the deep-loop agents.

---

## 1. OVERVIEW

`system-deep-loop` is one advisor identity over several loop modes. The hub resolves a request to a `workflowMode` through `mode-registry.json` and loads that mode's packet. The packet owns the mode's convergence rules, state format and artifacts. Every mode then calls into `runtime/`, a nested infrastructure layer with no MCP tools, for durable state, the coverage graph, executor fan-out, locking and the validated write path for mode state.

The package owns three authored zones:

- The hub root (`SKILL.md`, `ROUTER.md`, `mode-registry.json`, `hub-router.json`, `graph-metadata.json`) routes and holds no per-mode logic.
- The mode packets `deep-research/`, `deep-review/`, `deep-ai-council/` and `deep-improvement/` carry each mode's contract, references, assets and mode-local scripts. `shared/` carries helpers the packets share.
- `runtime/` carries the TypeScript and CommonJS library, the CLI scripts, the SQLite stores and the test suites.

### Architecture diagram

```text
┌──────────────────────────────────────────────────────────────────┐
│                    SYSTEM-DEEP-LOOP PACKAGE                      │
├──────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────┐   ┌─────────────────────────────────┐  │
│  │ Skill(system-deep-   │   │ /deep:* commands                │  │
│  │ loop), deep agents   │   │ .skilled/commands/deep/assets/  │  │
│  └──────────┬───────────┘   └────────────────┬────────────────┘  │
│             ▼                                ▼                   │
│  ┌──────────────────────┐   ┌─────────────────────────────────┐  │
│  │ hub: mode-registry   │──▶│ mode packets                    │  │
│  │ + ROUTER.md          │   │ deep-research / deep-review /   │  │
│  └──────────────────────┘   │ deep-ai-council / deep-improve. │  │
│                             └────────────────┬────────────────┘  │
│                                              ▼                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ runtime/scripts/  JSON-stdout CLI adapters                 │  │
│  └──────────────────────────────┬─────────────────────────────┘  │
│                                 ▼                                │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ runtime/lib/  domain modules (graph, gateway, ledger,      │  │
│  │               locks, fan-out, council, per-mode schemas)   │  │
│  └──────────────────────────────┬─────────────────────────────┘  │
│                                 ▼                                │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ runtime/database/ deep-loop and council SQLite graphs      │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 2. PACKAGE TOPOLOGY

```text
system-deep-loop/
├── SKILL.md, ROUTER.md          # Hub routing and the stage-two leaf router
├── mode-registry.json           # workflowMode -> packet, runtimeLoopType, backendKind
├── deep-research/               # Research mode packet
├── deep-review/                 # Review mode packet
├── deep-ai-council/             # AI Council mode packet
├── deep-improvement/            # Agent-improvement and model-benchmark lanes
├── shared/                      # behavior-benchmark, progress, rollout, synthesis
├── runtime/
│   ├── lib/                     # One folder per domain, each with an index barrel
│   ├── scripts/                 # CLI adapters and scripts/lib/ shared CLI guards
│   ├── database/                # deep-loop-graph.sqlite, council-graph.sqlite
│   ├── references/              # Graph schema, state format, script contract
│   └── tests/                   # unit, integration, stress, lifecycle, fixtures
├── benchmark/                   # Benchmark reports
├── feature-catalog/             # Feature inventory
├── manual-testing-playbook/     # Operator scenarios
└── changelog/                   # Versioned changelogs
```

Allowed dependency direction:

- `mode packets ──▶ runtime/scripts/ ──▶ runtime/lib/`
- `runtime/lib/<domain>/ ──▶ runtime/lib/<sibling>/index` through the public barrel
- `runtime/tests/ ──▶ runtime/lib/` and `runtime/scripts/`

Three `lib/` modules reach back into `scripts/`: `deep-loop/jsonl-repair.ts` and `council/convergence.cjs` take the writer lock from `scripts/lib/cli-guards.cjs`, and `branch-leases-waves/durable-orchestrator.ts` loads `scripts/fanout-pool.cjs`. Those are the only exceptions to the direction above.

---

## 3. CANONICAL FLOWS

**Loop iteration path (`/deep:research`, `/deep:review`):** the command's workflow YAML under `.skilled/commands/deep/assets/` drives each iteration. The iteration runs in a native agent or as CLI lineages through `fanout-run.cjs` and `fanout-pool.cjs`. `verify-iteration.cjs` checks the artifacts, `upsert.cjs` stores the iteration's graph events in `deep-loop-graph.sqlite` under a required `--session-id`, and `convergence.cjs` returns a typed stop-or-continue decision. At the end, `synthesis-closeout.cjs` checks the synthesis against the iteration state and stages the completion event for the gateway.

**Write path (`append-mode-event.cjs`):** mode state reaches a ledger only through `lib/mode-append-gateway/`. The gateway resolves the cutover binding (actor, capability and commit, taken from the machine rather than typed by a person), admits the write against the authority root, authorizes the transition, appends through the fence in `lib/authorized-ledger/` and `lib/locks-and-fencing/`, then refreshes the legacy projection. A projection refresh that runs and fails returns `ok: false` with the durable receipt attached.

**Read path (`query.cjs`, `status.cjs`):** both open the coverage graph through `lib/coverage-graph/` and print JSON: `query.cjs` for gaps, contradictions and stored state, `status.cjs` for session-scoped health and row counts.

**Key modules:**

- `runtime/lib/coverage-graph/` owns graph storage, queries and convergence signals.
- `runtime/lib/mode-append-gateway/` owns the validated write path.
- `runtime/lib/deep-loop/` owns executor config, prompt packs, atomic state and the loop-level helpers.

---

## 4. RUNTIME SUBSYSTEMS

**Coverage graph.** Per-session nodes and edges for research (`QUESTION`, `FINDING`, `CLAIM`, `SOURCE`) and review (`DIMENSION`, `FILE`, `FINDING`, `EVIDENCE` and more), stored in `database/deep-loop-graph.sqlite`. Schema: `runtime/references/coverage-graph-schema.md`.

**Per-mode ledgers.** Each mode has a ledger schema, reducers and sealed artifacts (`deep-research-*`, `deep-review-*`, `deep-ai-council-*`, `agent-improvement-*`, `model-benchmark-*`, `deep-improvement-common-*`). Reducers derive projections from the append-only ledger, and `per-mode-authority-flip/` records when a mode's authority has moved to that ledger.

**Authority and fencing.** `authority-root/`, `authorized-ledger/` and `locks-and-fencing/` hold the durable authority record, the fenced append and the protected-resource registry. `scripts/loop-lock.cjs` exposes lock acquire, heartbeat, reclaim and release to the CLI.

**Fan-out.** `fanout-run.cjs`, `fanout-pool.cjs`, `fanout-merge.cjs` and `fanout-salvage.cjs` run lineages as CLI subprocesses under a concurrency cap, merge their outputs deterministically and recover artifacts from captured output. `branch-leases-waves/` and `hierarchical-budgets/` bound the waves and their budgets.

**Council.** `lib/council/` and `database/council-graph.sqlite` hold the AI Council graph, its convergence and the seat primitives the `deep-ai-council` packet orchestrates.

**Improvement.** The improvement lanes stay host-driven. `mode-registry.json` gives them a `runtimeLoopType` of `null`, and the runtime has no `improvement` loop type.

---

## 5. HOOK AND PLUGIN INTEGRATION

The deep-loop dispatch guard checks Task dispatches to deep-loop agents. It flags or blocks a Deep Route header whose mode disagrees with `mode-registry.json`, and repeated non-command dispatches to command-owned loop executors. The policy core is `.skilled/hooks/task-dispatch/lib/dispatch-guard.cjs`. Claude reaches it through the PreToolUse Task hook and OpenCode through `.skilled/plugins/system-deep-loop-guard.js`, which never writes to stdout or stderr and turns a denial into a thrown error.

Other consumers call the runtime directly: the `/deep:*` workflow YAMLs through JSON-stdout scripts, `/doctor:speckit deep-loop` against `deep-loop-graph.sqlite`, and the system-spec-kit Vitest config, which also discovers `runtime/tests/`. The call shapes and risks are in `runtime/references/integration-points.md`.

---

## 6. ENFORCEMENT AND VERIFICATION

**Append discipline.** `check-direct-append.cjs` catches a write to a legacy state file that bypassed the gateway, `check-protocol-append-sites.cjs` fails a workflow asset that records canonical state without the gateway, and `check-ledger-stem-producers.cjs` and `check-projection-coverage.cjs` cover ledger producers and projection coverage.

**Contract drift.** `check-contract-drift.cjs` compares command and runtime contract surfaces, and `check-documentation-drift.cjs` checks the hub, mode READMEs, playbook and benchmark index against the registry.

**Code style.** `sk-code-opencode/assets/scripts/verify_alignment_drift.py --root runtime --check-sections --check-folders` checks MODULE headers, numbered section dividers, folder READMEs and double-underscore folder names.

**Test surfaces.** `npm run typecheck` and `npm test` from `runtime/` run the TypeScript check and the Vitest suites under `runtime/tests/`. `node .skilled/scripts/run-node-tests.mjs` from the repository root runs the `*.test.cjs` suites, including `runtime/tests/unit/runtime-bootstrap.test.cjs`. `manual-testing-playbook/` holds the operator scenarios.

---

## 7. DECISION RECORDS

| ADR | Subject | Status |
|---|---|---|
| ADR-001 | The runtime exposes no MCP tools; consumers call JSON-stdout scripts or import `lib/` | Accepted |
| ADR-002 | The runtime lives inside this skill as nested infrastructure, not as a separate skill | Accepted |
| ADR-003 | One `graph-metadata.json` for the whole package, none inside a mode packet | Accepted |
| ADR-004 | Improvement stays host-driven, with no runtime loop type | Accepted |
| ADR-005 | Mode state reaches a ledger only through the append gateway once a mode's authority has moved | Accepted |

---

## 8. RELATED

- [README.md](./README.md): Package overview
- [SKILL.md](./SKILL.md): Routing and invariants
- [ROUTER.md](./ROUTER.md): Stage-two leaf router
- [runtime/README.md](./runtime/README.md): Runtime surface
- [runtime/references/integration-points.md](./runtime/references/integration-points.md): Consumers and call shapes
- [feature-catalog/](./feature-catalog/): Feature inventory
- [manual-testing-playbook/](./manual-testing-playbook/): Operator scenarios
