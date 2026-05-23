---
name: deep-loop-runtime
version: 1.3.0
description: "Shared deep-loop runtime: executor + prompt-pack + validation + atomic state + coverage-graph + Bayesian scoring + fallback routing."
allowed-tools: [Bash, Read, Glob, Grep]
---

# Deep Loop Runtime

Shared runtime infrastructure for the deep-review and deep-research loop workflows. The 118 FULL_ISOLATE_NO_MCP arc moved the shared runtime libraries, coverage-graph ownership, script entry points, SQLite storage, and runtime tests into this peer skill.

---

## 1. WHEN TO USE

This skill is consumed by deep-review and deep-research workflow YAML and script paths, not invoked directly as a user-facing workflow.

Use it when a deep-loop workflow needs shared runtime support for:

- executor configuration and audit metadata
- prompt-pack rendering
- post-dispatch validation
- atomic state files and JSONL repair
- loop locking and permissions gates
- Bayesian scoring and fallback routing
- coverage-graph schema, query, and signal interpretation

### Activation Triggers

This skill is activated when:

- A deep-review or deep-research workflow YAML invokes `node .opencode/skills/deep-loop-runtime/scripts/<name>.cjs`
- A test file imports `from '.../deep-loop-runtime/lib/...'`
- An operator queries / mutates the coverage graph via the runtime scripts
- A workflow needs Bayesian convergence scoring or fallback executor routing

### When NOT to Use

Do not invoke this skill when:

- A user requests an interactive command (use `/deep:start-review-loop` or `/deep:start-research-loop` instead — those orchestrate this runtime)
- A package outside deep-review / deep-research needs deep-loop semantics (out of supported scope; open a packet to extend ownership)
- An MCP tool surface is needed (this skill explicitly has none — the 118 ADR-001 removed the deep-loop MCP tools)

---

## 2. SMART ROUTING

This skill has no direct LLM-facing keyword triggers — it is invoked by workflow YAMLs (via `bash:` script calls) and by test imports. The router below documents which sub-domain to load for a given consumer query.

### Primary Detection Signal

```bash
request_text="$(printf '%s' "$USER_REQUEST" | tr '[:upper:]' '[:lower:]')"
case "$request_text" in
  *"deep-loop runtime"*|*"deep-loop-runtime"*|*"executor config"*|*"prompt pack"*) DEEP_LOOP_INTENT=1 ;;
  *"coverage graph"*|*"deep_loop_graph"*|*"bayesian scorer"*|*"loop lock"*) DEEP_LOOP_INTENT=1 ;;
  *"fallback router"*|*"post-dispatch validate"*|*"jsonl repair"*) DEEP_LOOP_INTENT=1 ;;
  *) DEEP_LOOP_INTENT=0 ;;
esac
```

### Phase Detection

```text
TASK CONTEXT
    |
    +- STEP 0: Detect runtime-call intent vs. consumer-orchestration intent
    +- STEP 1: If consumer (workflow YAML), invoke the relevant scripts/*.cjs
    +- STEP 2: If contributor (modifying lib code), load matching lib/ subtree
    +- STEP 3: If test author, load tests/ + lib/ pair
```

### Resource Domains

```text
lib/deep-loop/*.ts            # 10 runtime modules (executor, prompt-pack, validation, state, scoring, routing)
lib/coverage-graph/*.ts       # 3 schema + query + signals modules
scripts/*.cjs                 # 4 entry points (convergence, upsert, query, status)
database/*.sqlite              # runtime-owned SQLite (deep-loop-graph.sqlite)
tests/{unit,integration,lifecycle}/  # 21+ vitest files split by responsibility
```

### Resource Loading Levels

| Tier | When loaded | Purpose |
|------|-------------|---------|
| ALWAYS | SKILL.md frontmatter | description, allowed-tools, version |
| CONDITIONAL | When a runtime call dispatches | `lib/` modules required by the called function |
| ON_DEMAND | When a test fails or a contributor extends | `tests/` + matching `lib/` sub-tree |

### Smart Router Pseudocode

```text
IF request mentions a specific lib name (e.g. "bayesian-scorer", "prompt-pack"):
  → Load lib/deep-loop/<name>.ts + matching tests/unit/<name>.vitest.ts
ELIF request mentions coverage-graph / convergence / signals:
  → Load lib/coverage-graph/*.ts + tests/integration/review-depth-*.vitest.ts
ELIF request mentions a script (convergence.cjs, status.cjs, etc.):
  → Load scripts/<name>.cjs + tests/integration/<name>-script.vitest.ts + lib/coverage-graph/coverage-graph-db.ts
ELSE:
  → Defer to consumer skill (deep-review / deep-research)
```

---

## 3. HOW IT WORKS

### Runtime Architecture

The runtime exposes deep-loop primitives to consumer workflows through two paths: **direct `.cjs` script invocation** (replacing the removed `mcp__mk_spec_memory__deep_loop_graph_*` MCP tools) and **TypeScript library imports** (from workflow scripts and tests).

```text
[deep-review/deep-research workflow YAML]
            │
            ├─ bash: node .../scripts/<name>.cjs   (coverage-graph mutations)
            │       └─→ lib/coverage-graph/*.ts → database/deep-loop-graph.sqlite
            │
            └─ ts-import: lib/deep-loop/<lib>.ts   (runtime primitives)
                    └─→ atomic-state, prompt-pack, post-dispatch-validate, etc.
```

### Library Structure

**`lib/deep-loop/` (10 modules):**
- `executor-config.ts` — schema + parsing for per-iteration executor settings
- `executor-audit.ts` — appends `executor` block to iteration JSONL (provenance)
- `prompt-pack.ts` — renders the iteration prompt template
- `post-dispatch-validate.ts` — validates iteration outputs (markdown + JSONL + delta)
- `atomic-state.ts` — atomic state-log writes
- `jsonl-repair.ts` — recovers corrupt JSONL state lines
- `loop-lock.ts` — single-writer locking
- `permissions-gate.ts` — permission scope checks
- `bayesian-scorer.ts` — convergence scoring
- `fallback-router.ts` — executor fallback decision matrix

**`lib/coverage-graph/` (3 modules):**
- `coverage-graph-db.ts` — SQLite schema + node-kind allow-list + connection lifecycle
- `coverage-graph-query.ts` — query builders
- `coverage-graph-signals.ts` — convergence signal extraction

### Council Primitives

Packet 131/001/008 ADR-001 (Runtime Boundary Decision) extends `deep-loop-runtime/lib/` with council-compatible infrastructure primitives while keeping operator-facing and domain workflow semantics in `deep-ai-council`. These primitives are consumed by downstream 131/001 phases 010-013 (per-topic-multi-round, session-findings-registry, command-and-skill-wiring, parity-cost-docs) for per-topic orchestration, multi-topic session state, command wiring, parity tests and docs.

**`lib/council/` (5 modules):**
- `multi-seat-dispatch.cjs` — runs seat executors in parallel for one council round, preserves seat result order, and returns fulfilled/rejected per-seat outcomes plus round summary counts.
- `round-state-jsonl.cjs` — appends per-round JSONL records with a lock-file single-writer guard, repairs corrupt trailing JSONL before append, fsyncs writes, and exposes round-state readers for resume.
- `adjudicator-verdict-scoring.cjs` — scores Round-N -> Round-N+1 adjudicator verdict deltas using ADR-003 weights for option change, confidence delta, material-risk Jaccard delta, axis flip rate, and blocking-disagreement delta.
- `cost-guards.cjs` — normalizes and enforces ADR-004 defaults for `max_rounds_per_topic`, `max_topics_per_session`, `saturation_threshold`, and `seats_per_round`, including upper-bound seat-output calculation.
- `session-state-hierarchy.cjs` — creates and validates the ADR-002 session -> topic -> round state shape, including stable `topic-NNN-slug` and `round-NNN` ids.

The existing `lib/deep-loop/atomic-state.ts`, `lib/deep-loop/jsonl-repair.ts`, and `lib/deep-loop/loop-lock.ts` remain the sibling runtime contracts. Council modules mirror those durability semantics in a council-scoped CJS surface so downstream `deep-ai-council` phases can consume them without modifying deep-review or deep-research behavior.

### Script Entry Points

Four `.cjs` scripts replace the 4 deleted MCP tools, each honoring the same JSON-in / JSON-out contract documented in phase 003 ADR-001:

| Script | Replaces | Purpose | Exit codes |
|--------|----------|---------|------------|
| `scripts/convergence.cjs` | `deep_loop_graph_convergence` | Computes typed CONTINUE / STOP_ALLOWED / STOP_BLOCKED decisions | 0=ok, 1=script, 2=DB, 3=input |
| `scripts/upsert.cjs` | `deep_loop_graph_upsert` | Stores nodes + edges from iteration `graphEvents` | 0=ok, 1=script, 2=DB, 3=input |
| `scripts/query.cjs` | `deep_loop_graph_query` | Inspects uncovered questions, unverified claims, contradictions | 0=ok, 1=script, 2=DB, 3=input |
| `scripts/status.cjs` | `deep_loop_graph_status` | Session-scoped health report | 0=ok, 1=script, 2=DB, 3=input |

Each script: parses argv → opens `database/deep-loop-graph.sqlite` → calls the lib function → writes JSON to stdout → closes DB in `finally` → exits with the appropriate code.

### Test Organization

```text
tests/
├── unit/         # 13 files — per-module unit tests (atomic-state, executor-config, etc.)
├── integration/  # 7 files — script invocations + review-depth fixtures
├── lifecycle/    # 1 file — db-open-close pattern verification
└── _helpers/     # 1 file — spawn-cjs helper for direct-invocation tests
```

The system-spec-kit `mcp_server/vitest.config.ts` includes `'../deep-loop-runtime/tests/**/*.{vitest,test}.ts'` so a single vitest run discovers both surfaces.

---

## 4. RULES

### ALWAYS

- **ALWAYS** open the SQLite DB inside a `try` block and close it in a `finally` block (script lifecycle invariant per phase 003 ADR-001)
- **ALWAYS** emit JSON-only output to stdout from `scripts/*.cjs` (workflow YAML parses stdout for output bindings)
- **ALWAYS** include `'use strict';` on line 2 of every `.cjs` script (per sk-code OPENCODE JS style)
- **ALWAYS** include a `MODULE: <name>` header comment in every `lib/**/*.ts` file (per sk-code OPENCODE TS-MODULE-HEADER convention)
- **ALWAYS** preserve atomic-state semantics when mutating JSONL state — never partial-write
- **ALWAYS** acquire `loop-lock` before any state-log mutation

### NEVER

- **NEVER** register MCP tools from this skill — the 118 ADR-001 explicitly removed the MCP surface; reintroducing tools defeats the FULL_ISOLATE direction
- **NEVER** open the SQLite DB outside `lib/coverage-graph/coverage-graph-db.ts` — single owner of the connection
- **NEVER** import from `system-spec-kit/mcp_server/lib/deep-loop/` or `system-spec-kit/mcp_server/lib/coverage-graph/` — those locations are empty since phase 002; import from this skill instead
- **NEVER** write to `database/deep-loop-graph.sqlite` without holding the `loop-lock`
- **NEVER** swallow exceptions in script entry points — propagate to the exit-code matrix

### ESCALATE IF

- **ESCALATE** to the user if a runtime call requires a new MCP tool — the architectural direction prohibits MCP additions; the user must decide on policy override
- **ESCALATE** to phase-008 ADR if a new consumer skill (beyond deep-review and deep-research) needs deep-loop runtime — extension requires a new ownership ADR
- **ESCALATE** if the SQLite schema requires a backward-incompatible change — coordinate with all consumer workflows + add migration to `coverage-graph-db.ts`
- **ESCALATE** if a script's stdout JSON contract changes — every workflow YAML output binding depends on the existing shape

---

## 5. SCOPE

In scope:

- runtime libraries under `lib/deep-loop/`
- coverage-graph runtime libraries under `lib/coverage-graph/`
- `.cjs` script entry points under `scripts/`
- runtime-owned SQLite storage under `database/`
- runtime tests under `tests/`

Out of scope:

- MCP tool registration
- MCP handler ownership
- DB lifecycle inside `system-spec-kit/mcp_server/`
- direct user command routing

---

## 6. ARCHITECTURE

- `lib/deep-loop/` holds shared deep-loop runtime libraries.
- `lib/coverage-graph/` holds coverage-graph schema, query, and signal helpers.
- `scripts/` holds `.cjs` entry points used by workflow YAML and collateral commands.
- `database/` owns relocated runtime SQLite artifacts.
- `tests/` holds runtime-owned tests split from the MCP server surface.

Shipped layout:

| Path | Populated By | Purpose |
|------|--------------|---------|
| `lib/deep-loop/` | 10 files | Shared executor config, audit, prompt-pack, validation, state, repair, locking, permissions, scoring, and fallback routing. |
| `lib/coverage-graph/` | 3 files | Coverage-graph schema owner, query helpers, and signal interpretation. |
| `scripts/` | 4 files | Direct `status`, `query`, `upsert`, and `convergence` entry points replacing the removed deep-loop MCP tools. |
| `database/` | SQLite | Runtime-owned `deep-loop-graph.sqlite`. |
| `tests/` | Unit, integration, lifecycle | Runtime-owned tests discovered by the system-spec-kit MCP server Vitest config. |

---

## 7. INTEGRATION POINTS

- **117 ADR-001**: original AI Council SPLIT ruling. Superseded for the 118 arc by user directive.
- **118 ADR-001**: FULL_ISOLATE_NO_MCP. Moves deep-loop runtime, coverage-graph schema/query/signals, script entry points, storage, and tests into this peer skill while removing the deep-loop MCP tool surface.
- **Deep-review and deep-research workflow YAML** call this runtime through script entry points after phase 005's cutover.
- **system-spec-kit/mcp_server/vitest.config.ts** includes `'../deep-loop-runtime/tests/**/*.{vitest,test}.ts'` for cross-package test discovery.
- **deep-review/scripts/reduce-state.cjs** depends on the moved coverage-graph runtime via lib imports.

---

## 8. REFERENCES

- 118 phase parent: `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/spec.md`
- 118 phase 003: script shim and DB relocation (ADR-001 documents the script interface contract)
- 118 phase 004: MCP tool surface removal (ADR-001 documents the deletion rationale)
- 118 phase 008: v1.0.0 closeout, changelog, and resource-map updates
- 117 council deliberation: `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/003-deep-loop-runtime/001-core-isolation-deliberation/`
- changelog: `changelog/v1.0.0.0.md` (initial shipped release)
- changelog: `changelog/v1.1.0.0.md` (Phase-1-3 release-cleanup pass)
