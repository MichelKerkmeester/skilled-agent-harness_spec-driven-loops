---
title: "Decision Record: 010 — Council Graph CLI Migration"
description: "Architecture decisions for council graph persistence, convergence math placement, migration ordering, and test migration strategy."
trigger_phrases:
  - "council graph CLI migration"
  - "council_graph_ MCP removal"
  - "deep-loop-runtime council loopType"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/004-deep-loop-runtime/010-council-graph-cli-migration"
    last_updated_at: "2026-05-24T09:35:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Remediated native review findings and revalidated council matrix"
    next_safe_action: "Complete; none unless follow-up cleanup is requested"
    blockers: []
    completion_pct: 100
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "decision-record.md", "implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:1310030100000000000000000000000000000000000000000000000000000005"
      session_id: "131-003-010-council-cli-scaffold"
      parent_session_id: null
    open_questions: []
    answered_questions: []
---
# Decision Record: 010 — Council Graph CLI Migration

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Persistence Model for Council Graph CLI

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-24 |
| **Deciders** | Operator, implementation agent |

<!-- ANCHOR:adr-001-context -->
### Context

Council graph rows are derived from packet-local `ai-council/**` artifacts. The old MCP implementation stores a dedicated SQLite projection at `system-spec-kit/mcp_server/database/council-graph.sqlite`; the migration must choose whether the runtime CLI keeps a SQLite projection or appends per-packet JSONL rows.

### Constraints

- The CLI scripts run as subprocesses and need cross-invocation coordination.
- Multiple CLI invocations may upsert/query/status the same namespace during replay and convergence checks.
- `ai-council/**` remains source-of-truth; graph storage is a rebuildable projection.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Use deep-loop-runtime-owned SQLite storage under a runtime storage directory, scoped by `specFolder`, `loopType`, and `sessionId`.

**How it works**: Port the existing council graph schema to `deep-loop-runtime/lib/council/`, retain WAL mode and namespace keys, and keep replay recovery bounded to the affected namespace. The database moves ownership; it does not become source-of-truth.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Runtime-owned SQLite projection** | Handles subprocess reads/writes; preserves query performance and current test behavior; supports indexes and uniqueness constraints | Requires storage path migration and cleanup helpers | 9/10 |
| Per-packet JSONL graph rows | Easy to inspect and colocated with artifacts | Race-prone append semantics, weaker query performance, duplicate handling pushed into every reader | 5/10 |

**Why this one**: SQLite fits the existing derived-index model and avoids JSONL race conditions during concurrent subprocess calls. Packet artifacts remain authoritative, so the database can always be rebuilt.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Direct CLI calls avoid MCP bridge overhead while keeping indexed graph queries.
- Cross-instance coordination stays inside SQLite rather than ad hoc JSONL append rules.

**What it costs**:
- Storage path ownership must be explicit. Mitigation: document the runtime path and add cleanup helpers.
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The migration needs persistent derived graph state across CLI invocations. |
| 2 | **Beyond Local Maxima?** | PASS | Compared SQLite with packet JSONL. |
| 3 | **Sufficient?** | PASS | Moves the current proven model without adding a new storage abstraction. |
| 4 | **Fits Goal?** | PASS | Aligns council with runtime CLI ownership. |
| 5 | **Open Horizons?** | PASS | Future council query modes can reuse indexes and namespace cleanup. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Add runtime-owned council graph DB/query modules.
- Route CLI council operations to runtime-owned SQLite.

**How to roll back**: Restore the MCP-owned council graph DB usage and revert the runtime storage module changes.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Convergence Math Location

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-24 |
| **Deciders** | Operator, implementation agent |

### Context

The current council convergence handler is the heaviest porting unit at about 208 LOC. It computes council-specific signals: agreement ratio, dissent density, evidence depth, unresolved critical disagreements, decision confidence, and a composite score.

### Decision

**We chose**: Put council convergence math in `.opencode/skills/deep-loop-runtime/lib/council/convergence.cjs` as a sibling to other council runtime primitives.

**How it works**: `scripts/convergence.cjs` keeps argv parsing and JSON bridge behavior. When `loopType=council`, it imports the council convergence library instead of the coverage-graph signal reducers.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Council-specific `lib/council/convergence.cjs`** | Localizes council thresholds and blockers; mirrors existing `lib/council/` ownership | Some duplication with research/review composite scoring remains | 9/10 |
| Generic `lib/convergence-shared.cjs` with `loopType` switch | Centralizes stop-decision scaffolding | Creates a broad switchboard too early and risks coupling different signal models | 5/10 |

**Why this one**: Council convergence is semantically different from research/review coverage scoring. A council-owned reducer is easier to test and safer to evolve.

### Consequences

**What improves**:
- Council thresholds and blockers stay near council taxonomy and query helpers.
- The script remains a thin bridge, which matches the existing runtime pattern.

**What it costs**:
- Shared stop-decision code is not abstracted yet. Mitigation: extract later only if three loop types converge on identical logic.

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The handler logic must move out of MCP before deletion. |
| 2 | **Beyond Local Maxima?** | PASS | Compared local council module with generic shared module. |
| 3 | **Sufficient?** | PASS | Keeps the port narrowly scoped. |
| 4 | **Fits Goal?** | PASS | Extends runtime CLI without redesigning argv shape. |
| 5 | **Open Horizons?** | PASS | Future council signals can change without touching research/review reducers. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Migration Ordering

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-24 |
| **Deciders** | Operator, implementation agent |

### Context

The user-listed phase outline puts MCP deletion before `deep-ai-council` rewiring. That is valid as a planning inventory, but execution order affects breakage: deleting MCP tools before the consumer path is rewritten creates a window where council graph replay/status/convergence calls have no live backend.

### Decision

**We chose**: Execute in safer order: port -> CLI extend -> consumer rewire -> MCP delete -> tests/count cleanup.

**How it works**: Build the runtime CLI path first, switch `deep-ai-council` to it, then delete the MCP tools once no live consumer depends on them. Finish by migrating tests and correcting inventory counts.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Strict serial from requested list: port -> CLI extend -> MCP delete -> consumer rewire -> tests | Matches prompt phase order exactly | Creates avoidable consumer break window | 6/10 |
| **Safer order: port -> CLI extend -> consumer rewire -> MCP delete -> tests** | Minimizes downtime and hidden-consumer risk | Requires documenting why execution order differs from inventory order | 9/10 |

**Why this one**: Removing a live tool before the caller has moved is unnecessary risk. The safer order still ends with the requested target state.

### Consequences

**What improves**:
- Hidden consumers surface while both old and new paths can still be compared.
- MCP deletion becomes a cleanup after proof, not a leap.

**What it costs**:
- Phase numbering in the plan needs one explicit note. Mitigation: `plan.md` records the dependency order.

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Ordering determines whether the migration has a break window. |
| 2 | **Beyond Local Maxima?** | PASS | Compared strict prompt order with safer operational order. |
| 3 | **Sufficient?** | PASS | No extra compatibility layer required. |
| 4 | **Fits Goal?** | PASS | Still removes all MCP council tools. |
| 5 | **Open Horizons?** | PASS | Leaves a cleaner rollback path. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Test Migration Strategy

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-24 |
| **Deciders** | Operator, implementation agent |

### Context

The current tests import MCP handlers directly from `system-spec-kit/mcp_server/handlers/council-graph/`. After deletion, those imports cannot remain. The behavior still needs coverage, especially value scenarios DAC-027 through DAC-032.

### Decision

**We chose**: Move council graph behavior tests into `deep-loop-runtime/tests/integration/` as CLI invocation tests, with helper fixtures adapted to spawn scripts instead of importing MCP handlers.

**How it works**: Reuse the existing runtime `tests/helpers/spawn-cjs.ts` pattern, extend it to allow `loopType='council'`, and rewrite seed helpers to call upsert/query/status/convergence scripts.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **CLI integration tests in deep-loop-runtime** | Tests the real supported interface; matches migration goal | Requires more fixture adaptation | 9/10 |
| Keep handler-level unit tests against ported libs only | Easier first port | Misses argv, JSON, and exit-code contract that consumers depend on | 6/10 |
| Duplicate both handler-level and CLI tests | Maximum coverage | Preserves a shape too close to deleted MCP handlers and increases maintenance | 5/10 |

**Why this one**: The CLI is the new contract. Tests should exercise the contract consumers actually call.

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Deleted MCP handlers cannot remain the test target. |
| 2 | **Beyond Local Maxima?** | PASS | Compared CLI, lib-only, and duplicate coverage. |
| 3 | **Sufficient?** | PASS | Covers behavior and process boundary. |
| 4 | **Fits Goal?** | PASS | Validates the direct CLI migration. |
| 5 | **Open Horizons?** | PASS | Future runtime scripts share one integration style. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004 -->

---

## RELATED DOCUMENTS

- `spec.md`
- `plan.md`
- `tasks.md`
- `checklist.md`
- `implementation-summary.md`
