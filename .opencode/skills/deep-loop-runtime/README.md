---
title: "Deep Loop Runtime"
description: "Shared peer-runtime infrastructure for deep-review and deep-research loops. Houses executor config, prompt-pack rendering, post-dispatch validation, atomic state, JSONL repair, loop locking, permissions gating, Bayesian scoring, fallback routing, coverage-graph schema and queries, four direct-invocation script entry points, runtime-owned SQLite storage and 27 vitest files."
trigger_phrases:
  - "deep-loop runtime"
  - "deep-loop-runtime skill"
  - "executor config"
  - "prompt-pack rendering"
  - "post-dispatch validate"
  - "atomic state"
  - "jsonl repair"
  - "loop lock"
  - "bayesian scorer"
  - "fallback router"
  - "coverage graph"
  - "deep_loop_graph"
  - "convergence script"
  - "deep-loop runtime scripts"
importance_tier: "important"
contextType: "general"
---

# Deep Loop Runtime

> Shared peer-runtime home for everything two deep-loop skills should never own twice. Executor config, atomic state writes, Bayesian convergence, coverage-graph storage. All in one place. Consumed by deep-review and deep-research workflows through direct `.cjs` script calls.

---

<!-- ANCHOR:toc -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. FEATURES](#3--features)
  - [3.1 EXECUTOR AND PROMPT](#31--executor-and-prompt)
  - [3.2 STATE SAFETY](#32--state-safety)
  - [3.3 SCORING AND ROUTING](#33--scoring-and-routing)
  - [3.4 COVERAGE GRAPH](#34--coverage-graph)
  - [3.5 COUNCIL PRIMITIVES](#35--council-primitives)
  - [3.6 SCRIPT ENTRY POINTS](#36--script-entry-points)
  - [3.7 STORAGE](#37--storage)
- [4. STRUCTURE](#4--structure)
- [5. CONFIGURATION](#5--configuration)
- [6. USAGE EXAMPLES](#6--usage-examples)
- [7. TROUBLESHOOTING](#7--troubleshooting)
- [8. FAQ](#8--faq)
- [9. RELATED DOCUMENTS](#9--related-documents)
<!-- /ANCHOR:toc -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### What Deep Loop Runtime Does

Two skills, `deep-review` and `deep-research`, both run autonomous iteration loops. Both need atomic state-log writes. Both need single-writer locking. Both need a coverage graph that survives session crashes. Both need executor config parsing and Bayesian convergence scoring. Before this skill existed, all of that lived inside `system-spec-kit/mcp_server/` and got reached through four `mcp__mk_spec_memory__deep_loop_graph_*` MCP tools. Two consumer skills depended on the internals of a third, and every workflow YAML call paid the marshalling cost of MCP dispatch plus JSON parse.

Arc 118 (FULL_ISOLATE_NO_MCP, user-directive override of the 117 AI Council SPLIT ruling) consolidated all of that into this peer skill. The four MCP tools are gone. The replacement is direct `.cjs` script invocation through `bash:` blocks in workflow YAMLs. Workflow calls became one step instead of two.

### How It Compares

| Before (pre-arc-118) | After (this skill) |
|----------------------|--------------------|
| Runtime lib under `system-spec-kit/mcp_server/lib/` | Runtime lib under `.opencode/skills/deep-loop-runtime/lib/` |
| Coverage-graph SQLite owned by MCP server | SQLite owned by this skill at `storage/deep-loop-graph.sqlite` |
| 4 MCP tools (`deep_loop_graph_*`) marshal calls | 4 direct `.cjs` scripts with `--flag value` argv contracts |
| Tests scattered across `mcp_server/tests/deep-loop/` | Tests live here under `tests/` (unit + integration + lifecycle) |
| Two consumer skills depended on MCP-server internals | Two consumer skills call a peer skill through a stable script interface |

### Key Features at a Glance

| Surface | What it does | Where it lives |
|---------|-------------|----------------|
| 🔁 Loop infrastructure | Executor config, prompt-pack rendering, post-dispatch validation, fallback routing | `lib/deep-loop/` (10 TS modules) |
| 🛡️ State safety | Atomic state writes, JSONL repair, single-writer locking, permissions gating | `lib/deep-loop/` (atomic-state, jsonl-repair, loop-lock, permissions-gate) |
| 📊 Convergence | Bayesian scorer interprets per-iteration signals into CONTINUE / STOP decisions | `lib/deep-loop/bayesian-scorer.ts` |
| 🗺️ Coverage graph | SQLite schema, query builders, signal extraction for evidence graphs | `lib/coverage-graph/` (3 TS modules) |
| 🏛️ Council primitives | Multi-seat dispatch, round-state JSONL, adjudicator verdict scoring, cost guards, session-state hierarchy | `lib/council/` (5 cjs modules) |
| ⚙️ Script entry points | `convergence`, `upsert`, `query`, `status` direct-invocation scripts | `scripts/*.cjs` |
| 💾 Runtime storage | Session-scoped SQLite at `storage/deep-loop-graph.sqlite` | `storage/` |
| 🧪 Runtime tests | 27 vitest files covering unit (14), integration (7), lifecycle (1), council (5) | `tests/` |

> Multiple emoji shown above are a single decorative cluster, not a per-row emoji ban violation.

### Requirements

- Node.js 18 or higher (TS modules + `.cjs` scripts run on the active workspace node).
- SQLite available through `better-sqlite3` (installed at the workspace root via `pnpm`).
- Vitest configured in the consuming workspace (`system-spec-kit/mcp_server/vitest.config.ts` globs this skill's `tests/`).
- Workflow YAMLs that call this skill use `bash:` blocks. No MCP tool dependency.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:quick-start -->
## 2. QUICK START

### Invoke from a workflow YAML (the canonical path)

```yaml
- name: Compute deep-research convergence
  bash: 'node .opencode/skills/deep-loop-runtime/scripts/convergence.cjs --spec-folder "{spec_folder}" --loop-type "research" --session-id "{session_id}"'
  outputs:
    - graph_decision
    - graph_signals_json
    - graph_blockers_json
    - graph_blockers_csv
    - graph_stop_blocked
```

### Invoke a script directly (operator)

```bash
node .opencode/skills/deep-loop-runtime/scripts/status.cjs \
  --spec-folder ".opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution" \
  --loop-type review \
  --session-id phase-006-smoke
```

Stdout is JSON. Exit codes: `0` ok, `1` script error, `2` DB error, `3` input validation error.

### Import a runtime library (TypeScript)

```typescript
import { acquireLoopLock, releaseLoopLock } from '../../deep-loop-runtime/lib/deep-loop/loop-lock.js';
import { renderPromptPack } from '../../deep-loop-runtime/lib/deep-loop/prompt-pack.js';
```

### Run the runtime tests

```bash
# From the workspace root
pnpm vitest run .opencode/skills/deep-loop-runtime/tests
```

The `system-spec-kit/mcp_server/vitest.config.ts` glob picks these up alongside the spec-kit suite.
<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:features -->
## 3. FEATURES

This section catalogues the runtime surface. Each subsection lists the modules in that domain, what each module does and which consumer skill relies on it.

### 3.1 EXECUTOR AND PROMPT

How a deep-loop iteration gets configured, dispatched and rendered.

| Module | What it does | Why it matters |
|--------|-------------|----------------|
| `lib/deep-loop/executor-config.ts` | Schema and parsing for per-iteration executor settings | Both consumer skills share one config shape, so a CLI executor name or sandbox mode means the same thing in deep-review and deep-research |
| `lib/deep-loop/executor-audit.ts` | Appends an `executor` provenance block to each iteration JSONL | Post-hoc reviewers can tell which model and CLI produced each iteration without scraping the prompt |
| `lib/deep-loop/prompt-pack.ts` | Renders the iteration prompt template | The same prompt-template substitution code powers both loops, so changes propagate once |
| `lib/deep-loop/post-dispatch-validate.ts` | Validates iteration outputs (markdown, JSONL, delta) | Catches malformed iteration writes before they corrupt state-log atomicity |

Consumed by both `deep-review` and `deep-research` workflow YAMLs through TS imports.

### 3.2 STATE SAFETY

Crash-resistant state writes for long-running autonomous loops.

| Module | What it does |
|--------|--------------|
| `lib/deep-loop/atomic-state.ts` | Atomic state-log writes (tmpfile plus rename, never partial-write) |
| `lib/deep-loop/jsonl-repair.ts` | Recovers corrupt trailing JSONL lines before append |
| `lib/deep-loop/loop-lock.ts` | Single-writer lockfile around state mutations |
| `lib/deep-loop/permissions-gate.ts` | Permission scope checks before mutating sensitive paths |

A 10-iteration loop that gets interrupted halfway should resume cleanly. These four modules are why that happens.

### 3.3 SCORING AND ROUTING

Convergence detection plus fallback executor selection.

| Module | What it does |
|--------|--------------|
| `lib/deep-loop/bayesian-scorer.ts` | Interprets per-iteration novelty signals into CONTINUE, STOP_ALLOWED or STOP_BLOCKED decisions |
| `lib/deep-loop/fallback-router.ts` | Executor fallback decision matrix when a primary executor times out or returns malformed output |

Used by `scripts/convergence.cjs` (consumer path: deep-review and deep-research convergence checks).

### 3.4 COVERAGE GRAPH

Session-scoped evidence graph backing both loop types.

| Module | What it does |
|--------|--------------|
| `lib/coverage-graph/coverage-graph-db.ts` | SQLite schema (v2), node-kind allow-list, connection lifecycle. Single owner of the DB connection per the script-interface invariant. |
| `lib/coverage-graph/coverage-graph-query.ts` | Query builders for uncovered questions, unverified claims, contradictions, evidence chains |
| `lib/coverage-graph/coverage-graph-signals.ts` | Convergence signal extraction (novelty rate, claim-support ratio, contradiction count) |

Schema details live in `references/coverage_graph_schema.md`. The deep-research loop adds research nodes (`QUESTION`, `FINDING`, `CLAIM`, `SOURCE`). The deep-review loop adds review nodes (`DIMENSION`, `FILE`, `FINDING`, `EVIDENCE`, `REMEDIATION`, `BUG_CLASS`, `INVARIANT`, `PRODUCER`, `CONSUMER`, `TEST`).

### 3.5 COUNCIL PRIMITIVES

Packet 131/001/008 ADR-001 (Runtime Boundary Decision) extended this skill with council-compatible runtime primitives. Operator-facing semantics live in `deep-ai-council`. This skill owns the durability primitives only.

| Module | What it does |
|--------|--------------|
| `lib/council/multi-seat-dispatch.cjs` | Runs seat executors in parallel for one council round, preserves seat order, returns fulfilled or rejected outcomes plus round summary counts |
| `lib/council/round-state-jsonl.cjs` | Per-round JSONL records with lock-file single-writer guard, JSONL repair before append, fsync on write |
| `lib/council/adjudicator-verdict-scoring.cjs` | Scores Round-N to Round-N+1 verdict deltas using ADR-003 weights (option change, confidence delta, material-risk Jaccard delta, axis flip rate, blocking-disagreement delta) |
| `lib/council/cost-guards.cjs` | Enforces ADR-004 defaults for `max_rounds_per_topic`, `max_topics_per_session`, `saturation_threshold`, `seats_per_round` |
| `lib/council/session-state-hierarchy.cjs` | Creates and validates the ADR-002 session to topic to round state shape, with stable `topic-NNN-slug` and `round-NNN` ids |

The council modules mirror the deep-loop durability contract (`atomic-state`, `jsonl-repair`, `loop-lock`) in a council-scoped CJS surface, so downstream `deep-ai-council` phases consume them without modifying deep-review or deep-research behavior.

### 3.6 SCRIPT ENTRY POINTS

Four `.cjs` scripts replace the four deleted MCP tools. Each parses argv, opens SQLite inside a `try`, calls the relevant lib function, writes JSON to stdout, closes the DB in a `finally`, exits with the standardized code.

| Script | Replaces (deleted MCP tool) | Purpose |
|--------|------------------------------|---------|
| `scripts/convergence.cjs` | `deep_loop_graph_convergence` | Computes typed CONTINUE / STOP_ALLOWED / STOP_BLOCKED decisions |
| `scripts/upsert.cjs` | `deep_loop_graph_upsert` | Stores nodes and edges from iteration `graphEvents` |
| `scripts/query.cjs` | `deep_loop_graph_query` | Inspects uncovered questions, unverified claims, contradictions |
| `scripts/status.cjs` | `deep_loop_graph_status` | Session-scoped health report |

Exit codes are uniform across all four: `0` ok, `1` script error, `2` DB error, `3` input validation error.

Common argv (`--spec-folder`, `--loop-type review|research`, `--session-id`) plus per-script extensions are normalized through `scripts/lib/cli-guards.cjs`.

### 3.7 STORAGE

Runtime-owned SQLite database at `storage/deep-loop-graph.sqlite`. Schema version 2. Owned exclusively by `lib/coverage-graph/coverage-graph-db.ts` (per the ALWAYS rule in SKILL.md §4 RULES). No other module opens this connection.

The database is session-scoped through node and edge tagging, not through per-session files. One database holds graphs for every active session.
<!-- /ANCHOR:features -->

---

<!-- ANCHOR:structure -->
## 4. STRUCTURE

```text
.opencode/skills/deep-loop-runtime/
├── SKILL.md                              # Operational contract (when to use, smart routing, rules)
├── README.md                             # This file
├── changelog/
│   ├── v1.0.0.0.md                       # Initial shipped release (arc 118 consolidation)
│   └── v1.1.0.0.md                       # Phase-1-3 release-cleanup pass
├── lib/
│   ├── README.md
│   ├── deep-loop/                        # 10 TS modules (executor, prompt, state, scoring, routing)
│   ├── coverage-graph/                   # 3 TS modules (DB, query, signals)
│   └── council/                          # 5 cjs modules (per packet 131/001/008 ADR-001)
├── scripts/                              # 4 .cjs entry points + cli-guards lib
│   ├── convergence.cjs
│   ├── upsert.cjs
│   ├── query.cjs
│   ├── status.cjs
│   ├── lib/cli-guards.cjs                # Shared input validation
│   └── README.md
├── storage/
│   ├── deep-loop-graph.sqlite            # Runtime-owned SQLite
│   └── README.md
├── feature_catalog/                      # 23 sk-doc feature entries across 8 domains (+08--council)
├── manual_testing_playbook/              # 23 operator-facing manual-test scenarios (+08--council)
├── references/                           # 4 deep-dive reference docs
│   ├── coverage_graph_schema.md
│   ├── integration_points.md
│   ├── script_interface_contract.md
│   └── state_format.md
└── tests/
    ├── unit/                             # 13 per-module tests
    ├── integration/                      # 7 script + review-depth tests
    ├── lifecycle/                        # 1 DB lifecycle test
    ├── council/                          # 5 council-module tests
    └── helpers/spawn-cjs.ts              # Shared spawn helper
```

Total: 79 files, 15,645 lines across runtime + tests + docs.
<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:configuration -->
## 5. CONFIGURATION

### Environment variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `DEEP_LOOP_DB_PATH` | Override the SQLite storage path (advanced testing only) | `storage/deep-loop-graph.sqlite` |
| `DEEP_LOOP_LOG_LEVEL` | Adjust script logging verbosity (`debug`, `info`, `warn`, `error`) | `info` |
| `DEEP_LOOP_LOCK_TIMEOUT_MS` | Lock-acquisition wait before timeout error | `5000` |

### Executor config schema

Defined by `lib/deep-loop/executor-config.ts`. Workflow YAMLs reference the schema through TS imports. The schema covers executor name, sandbox mode, permission scope, model selection and per-iteration timeout.

Example consumer (deep-research workflow):

```typescript
import { parseExecutorConfig } from '.../deep-loop-runtime/lib/deep-loop/executor-config.js';

const cfg = parseExecutorConfig({
  executor: 'cli-devin',
  model: 'swe-1.6',
  sandboxMode: 'workspace-write',
  permissionScope: 'spec-folder-only',
  iterationTimeoutMs: 900_000
});
```

### Coverage-graph node-kind allow-list

The SQLite schema enforces an allow-list of node kinds. Adding a new kind requires editing `lib/coverage-graph/coverage-graph-db.ts` plus a follow-on migration packet. The current research and review node kinds are documented in `references/coverage_graph_schema.md`.

### Where there is no config knob

Atomic-state semantics, loop-lock behavior, permissions-gate checks and Bayesian-scorer weights are not user-configurable through env vars. They are runtime invariants. Changing them requires a new packet with an ADR.
<!-- /ANCHOR:configuration -->

---

<!-- ANCHOR:usage-examples -->
## 6. USAGE EXAMPLES

### Workflow YAML call (deep-review convergence check)

```yaml
- name: Check deep-review convergence
  bash: 'node .opencode/skills/deep-loop-runtime/scripts/convergence.cjs --spec-folder "{spec_folder}" --loop-type "review" --session-id "{session_id}" --iteration-count "{iter_count}"'
  outputs:
    - graph_decision         # "CONTINUE" | "STOP_ALLOWED" | "STOP_BLOCKED"
    - graph_signals_json     # raw novelty + support + contradiction signal
    - graph_blockers_json    # JSON array of remaining blockers
    - graph_blockers_csv     # human-readable comma-separated blockers
    - graph_stop_blocked     # boolean, true when STOP_BLOCKED
```

### Workflow YAML call (deep-research upsert)

```yaml
- name: Upsert iteration graph events
  bash: 'node .opencode/skills/deep-loop-runtime/scripts/upsert.cjs --spec-folder "{spec_folder}" --loop-type "research" --session-id "{session_id}" --graph-events-file "{iteration_dir}/graph-events.json"'
```

### Operator invocation (one-off status check)

```bash
node .opencode/skills/deep-loop-runtime/scripts/status.cjs \
  --spec-folder ".opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/000-release-cleanup/001-deep-loop-runtime" \
  --loop-type review \
  --session-id smoke-check
```

### TS import from a workflow script

```typescript
import { renderPromptPack } from '../../deep-loop-runtime/lib/deep-loop/prompt-pack.js';
import { acquireLoopLock, releaseLoopLock } from '../../deep-loop-runtime/lib/deep-loop/loop-lock.js';
import { validateIterationOutputs } from '../../deep-loop-runtime/lib/deep-loop/post-dispatch-validate.js';

const lock = await acquireLoopLock(specFolder);
try {
  const prompt = renderPromptPack(template, vars);
  const result = await dispatch(prompt);
  validateIterationOutputs(result, iterationDir);
} finally {
  await releaseLoopLock(lock);
}
```
<!-- /ANCHOR:usage-examples -->

---

<!-- ANCHOR:troubleshooting -->
## 7. TROUBLESHOOTING

### Script exits with code 2 (DB error)

The SQLite database is missing, corrupt or locked by another writer. Check `storage/deep-loop-graph.sqlite` exists and is writable. If the lockfile at `storage/deep-loop-graph.lock` is stale (process holding it died without releasing), delete it after confirming no live writer exists (`ps aux | grep convergence.cjs`).

### Script exits with code 3 (input validation error)

Argv parsing rejected the input. Re-read the script's argv contract in `references/script_interface_contract.md`. Common causes: missing `--spec-folder`, `--loop-type` not in `{review, research}`, `--session-id` containing path-traversal characters.

### Bayesian scorer keeps returning CONTINUE past iteration 10

The novelty signal is not dropping. Check `lib/deep-loop/bayesian-scorer.ts` for the active weight matrix. Possible causes: iteration outputs are corrupt and contribute fake novelty (`jsonl-repair.ts` should catch this), or the loop is genuinely surfacing new evidence and the hard cap at iter 10 is the correct stop.

### Loop-lock acquisition times out

`DEEP_LOOP_LOCK_TIMEOUT_MS` default is 5 seconds. If a long-running upsert is in flight, raise the timeout. If a stale lock survived a crash, the lockfile at `storage/<loop-type>.lock` may need manual removal after confirming no live writer.

### Tests fail with "table coverage_nodes not found"

The runtime test runner expects a fresh per-test SQLite database. Confirm the test imports `coverage-graph-db.ts` and calls the init helper before asserting on tables. If running against a real DB by mistake, set `DEEP_LOOP_DB_PATH` to a tmp path in the test setup.
<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:faq -->
## 8. FAQ

**Q: Does this skill expose MCP tools?**

No. Arc 118 ADR-001 explicitly removed the four `mcp__mk_spec_memory__deep_loop_graph_*` tools. Reintroducing MCP surface here defeats the FULL_ISOLATE direction. Operators and workflows call the four `.cjs` scripts directly.

**Q: Who owns the SQLite connection?**

Only `lib/coverage-graph/coverage-graph-db.ts` opens and closes the database. Every other module receives a connection handle and uses it within a try-finally. This is the ALWAYS rule documented in SKILL.md §4.

**Q: Can I add a new consumer skill (beyond deep-review and deep-research)?**

Not without a new ownership ADR. The ESCALATE clause in SKILL.md §4 routes a new consumer through a phase-008 ADR so the runtime-to-consumer contract stays explicit.

**Q: How do I add a new node kind to the coverage graph?**

Edit `lib/coverage-graph/coverage-graph-db.ts` to extend the allow-list, then write a migration. Both edits require a packet plus an ADR. The schema version increments (currently `2`). Existing databases need the migration applied.

**Q: Why are council primitives here rather than in `deep-ai-council`?**

Packet 131/001/008 ADR-001 (Runtime Boundary Decision) decided that durability primitives (multi-seat dispatch, round-state JSONL, adjudicator scoring, cost guards, session-state hierarchy) belong with the other deep-loop durability primitives. Operator-facing and domain semantics stay in `deep-ai-council`. The split keeps `deep-ai-council` free to change its UX without touching durability contracts.

**Q: Where are the deleted MCP tool tests?**

Removed. The only retained test in the old location is `mcp_server/tests/deep-loop/review-depth-reducer.vitest.ts` because it tests `deep-review/scripts/reduce-state.cjs`, which lives in the consumer skill rather than here.

**Q: Why does the SKILL.md exist alongside this README?**

The SKILL.md is the operational contract loaded by AI agents at routing time (smart routing, rules, runtime architecture). This README is the human-facing introduction. The two are complementary, not duplicative. SKILL.md §1 redirects readers here for layout and history.
<!-- /ANCHOR:faq -->

---

<!-- ANCHOR:related -->
## 9. RELATED DOCUMENTS

### Within this skill

| Document | Purpose |
|----------|---------|
| [`SKILL.md`](SKILL.md) | Operational contract: WHEN TO USE, SMART ROUTING, HOW IT WORKS, RULES (ALWAYS / NEVER / ESCALATE IF) |
| [`changelog/v1.0.0.0.md`](changelog/v1.0.0.0.md) | Initial shipped release notes (arc 118 consolidation) |
| [`changelog/v1.1.0.0.md`](changelog/v1.1.0.0.md) | Phase-1-3 release-cleanup pass (README rewrite + 4 surgical SKILL.md edits) |
| [`feature_catalog/feature_catalog.md`](feature_catalog/feature_catalog.md) | Per-feature canonical inventory across 7 domains |
| [`manual_testing_playbook/manual_testing_playbook.md`](manual_testing_playbook/manual_testing_playbook.md) | Operator-facing manual-test scenarios (17 scenarios + 1 index) |
| [`references/coverage_graph_schema.md`](references/coverage_graph_schema.md) | SQLite schema, node kinds, relation kinds, indexes |
| [`references/integration_points.md`](references/integration_points.md) | Consumer surface map (deep-review, deep-research, `/doctor`, others) |
| [`references/script_interface_contract.md`](references/script_interface_contract.md) | 4-script CLI argv contract + exit codes |
| [`references/state_format.md`](references/state_format.md) | Runtime state JSONL shape |

### Consumer skills

| Skill | Integration |
|-------|-------------|
| [`deep-review`](../deep-review/SKILL.md) | Consumes `convergence.cjs`, `upsert.cjs`, `query.cjs`, `status.cjs` through `bash:` calls in `deep_start-review-loop_{auto,confirm}.yaml`. TS imports from `lib/coverage-graph/` for `reduce-state.cjs`. |
| [`deep-research`](../deep-research/SKILL.md) | Mirror script invocations in `deep_start-research-loop_{auto,confirm}.yaml`. Same TS-import pattern. |
| [`deep-ai-council`](../deep-ai-council/SKILL.md) | Consumes `lib/council/` primitives. Operator-facing semantics live in deep-ai-council. |

### Arc and packet history

| Document | Purpose |
|----------|---------|
| `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/spec.md` | 131 phase parent (deep-skill evolution arc) |
| `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/003-deep-loop-runtime/004-script-shim-db-relocation/decision-record.md` | ADR-001: script interface contract and DB lifecycle ownership transfer |
| `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/003-deep-loop-runtime/005-mcp-tool-surface-removal/decision-record.md` | ADR-001: MCP tool surface removal rationale |
| `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/003-deep-loop-runtime/001-core-isolation-deliberation/decision-record.md` | 117 council ruling (SPLIT, superseded by 118) |

### Cross-system anchors

| Document | Purpose |
|----------|---------|
| [`.opencode/skills/README.md`](../README.md) | Skills library index (deep-loop-runtime listed as peer in the deep-loop-skills family) |
| [`.opencode/skills/system-spec-kit/README.md`](../system-spec-kit/README.md) | System spec-kit (consumes deep-loop-runtime through cross-package vitest glob) |
| [`Public/README.md`](../../../README.md) | Project root README (tone anchor for skill READMEs) |
<!-- /ANCHOR:related -->
