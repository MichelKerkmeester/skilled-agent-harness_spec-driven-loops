---
title: "Decision Record: Deep-Loop Core Script Isolation (SPLIT ruling)"
description: "ADR-001 captures the SPLIT ruling from a 4-seat AI Council deliberation: pure deep-loop runtime libs move to a new deep-loop-runtime/ peer skill; MCP handlers and DB-schema owner stay in system-spec-kit/mcp_server/."
trigger_phrases:
  - "deep-loop isolation decision"
  - "ADR-001 deep-loop relocation"
  - "deep-loop-runtime peer skill"
  - "SPLIT ruling"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/117-deep-loop-core-isolation-deliberation"
    last_updated_at: "2026-05-22T17:15:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Council ruled SPLIT after 3-way advocate split + independent adjudication"
    next_safe_action: "Scaffold follow-on implementation packet 118"
    blockers: []
    completion_pct: 100
    key_files:
      - "ai-council/council-report.md"
      - "ai-council/seats/round-001/seat-D-adjudicator.md"
    session_dedup:
      fingerprint: "sha256:5575575575575575575575575575575575575575575575575575575575570001"
      session_id: "117-deep-loop-isolation-council"
      parent_session_id: null
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Deep-Loop Core Script Isolation

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: SPLIT — Move Pure Runtime Libs to deep-loop-runtime/, Keep MCP Handlers + DB Owner in system-spec-kit

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-22 |
| **Deciders** | sk-ai-council seats A/B/C/D + user |
| **Decision Source** | Seat D — Adjudicator (independent reasoning; no 2-of-3 advocate majority) |
| **Plan Confidence** | 92/100 |

---

<!-- ANCHOR:adr-001-context -->
### Context

The deep-review and deep-research skills depend on **18 production files** inside `.opencode/skills/system-spec-kit/mcp_server/lib/{deep-loop,coverage-graph}/` and `mcp_server/handlers/coverage-graph/`. Dependency survey: 100% deep-* consumption with zero non-deep callers anywhere. No prior ADR justified the placement; it was accumulated drift from early MCP server scaffolding.

User flagged the inversion and requested an AI Council deliberation before any movement.

### Constraints

- **MCP tool ID stability** (Critical): `mcp__mk_spec_memory__deep_loop_graph_*` names cannot change. Documented stable per CLAUDE.md §1.
- **Shared SQLite DB lifecycle** (High): `deep-loop-graph.sqlite` has a single owner — the MCP server. Schema-owner code must stay with the connection manager.
- **Test infrastructure** (Medium): vitest tests under `mcp_server/tests/deep-loop/`. Source/test colocation matters for CI.
- **Planning-only scope**: This packet captures the ruling. File moves are deferred to a follow-on packet.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: SPLIT — relocate pure-runtime libraries to a new `.opencode/skills/deep-loop-runtime/` peer skill; KEEP MCP-handler files and the SQLite schema/lifecycle owner in `system-spec-kit/mcp_server/`.

**How it works**:
- A new `.opencode/skills/deep-loop-runtime/` skill becomes the neutral home for shared deep-loop runtime infrastructure used by both deep-review and deep-research.
- The 10 files in `lib/deep-loop/` (executor-config, executor-audit, prompt-pack, post-dispatch-validate, atomic-state, jsonl-repair, loop-lock, permissions-gate, bayesian-scorer, fallback-router) move into `deep-loop-runtime/lib/deep-loop/`.
- 2 of 3 files in `lib/coverage-graph/` (coverage-graph-query, coverage-graph-signals) move into `deep-loop-runtime/lib/coverage-graph/`.
- All 5 files in `handlers/coverage-graph/` (convergence, upsert, query, status, index) STAY in `system-spec-kit/mcp_server/handlers/coverage-graph/` because they register MCP tools.
- `coverage-graph-db.ts` STAYS in `system-spec-kit/mcp_server/lib/coverage-graph/` because it owns the SQLite connection lifecycle.
- `mcp_server/tools/index.ts`, `tool-schemas.ts`, `schemas/tool-input-schemas.ts` STAY (host contract files).
- All 4 `mcp__mk_spec_memory__deep_loop_graph_*` tool IDs preserved exactly.
- Workflow YAML imports (`spec_kit_deep-review_{auto,confirm}.yaml`, `spec_kit_deep-research_{auto,confirm}.yaml`) update to new runtime skill paths.
- Tests split by responsibility: runtime unit tests with `deep-loop-runtime`; MCP registration / handler dispatch / DB lifecycle tests stay with `system-spec-kit`.

**Why SPLIT (not ISOLATE, not KEEP)**:
The decisive distinction is **MCP-bound vs pure-runtime**, not "deep-specific vs spec-kit-specific". Stable public tool IDs and the single SQLite connection owner are hard contracts. Physical placement of pure runtime libraries is an internal organization choice — and the right boundary returns ownership to the consumer (deep-* skills via a shared peer) while leaving server-bound code with its rightful host.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **SPLIT (chosen)** | Honors MCP server convention for handlers; preserves DB lifecycle; returns pure-lib ownership to deep-* consumers via neutral peer skill; reversible | Introduces one new skill (`deep-loop-runtime`); requires import-hygiene discipline at the new boundary | 9/10 |
| ISOLATE (Seat A) | Maximal encapsulation; deep-* skills fully own their runtime | Breaks MCP server convention for handler placement; risks DB lifecycle incoherence; higher PR churn; harder to reverse | 6/10 |
| KEEP (Seat B) | Zero migration cost; preserves test colocation; matches "shared infrastructure deserves a shared host" framing | Leaves documented inversion unfixed; no ownership return to consumers; future maintainers re-flag the same drift | 5/10 |

**Why this one**: SPLIT cuts along the actual ownership signal (MCP-binding) rather than the surface signal (consumer demographics or current directory). The 3-way advocate split + Seat D's independent adjudication stress-tested each frame; SPLIT survived all three critiques.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Pure-runtime ownership returns to the deep-* consumer side via a neutral peer (`deep-loop-runtime/`)
- Workflow YAML imports point at a clearly-named runtime skill instead of into another skill's MCP server
- Future cross-consumer use cases (e.g. a third deep-loop client) can depend on `deep-loop-runtime/` directly without a system-spec-kit-shaped dependency
- The ownership inversion is documented and corrected — future deep-review fixes don't require traversing into spec-kit's MCP server

**What it costs**:
- One new skill (`deep-loop-runtime/`) to create + maintain
- ~12 file moves + import-path updates in 4 YAML files
- Test infrastructure split across two packages
- One follow-on implementation packet of effort

**Risks** (full register in `ai-council/seats/round-001/seat-D-adjudicator.md` §Risk Register):
- Critical: MCP tool ID stability — mitigated by keeping tool registration files in `system-spec-kit/mcp_server/`
- High: DB lifecycle coherence — mitigated by keeping `coverage-graph-db.ts` with the connection owner
- High: Test coverage gaps — mitigated by splitting tests along the same responsibility boundary
- Medium: PR churn / merge conflicts — mitigated by scoped follow-on packet + mechanical import updates
- Medium: Import boundary drift — mitigated by `deep-loop-runtime/SKILL.md` documenting allowed dependency direction
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | User flagged the inversion; dependency survey confirmed 18 files with 100% deep-* consumption and no ADR justifying placement. |
| 2 | **Beyond Local Maxima?** | PASS | Council explicitly considered ISOLATE (full move) and KEEP (no move) before settling on SPLIT. Each was argued by a dedicated advocate seat at gpt-5.5 xhigh reasoning. |
| 3 | **Sufficient?** | PASS | Seat D's migration outline names every file's destination, preserves all 4 MCP tool IDs, and keeps the DB lifecycle owner intact. The follow-on packet has a complete file map to execute against. |
| 4 | **Fits Goal?** | PASS | The user's goal was to fix the ownership inversion. SPLIT moves the inverted-ownership files (pure runtime libs) while leaving the legitimately server-bound files in place. |
| 5 | **Open Horizons?** | PASS | Creates a peer `deep-loop-runtime/` that future deep-loop consumers can depend on directly. Doesn't lock in deep-review or deep-research as the false owner. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes** (in the follow-on packet, not this one):

1. Create `.opencode/skills/deep-loop-runtime/` with `SKILL.md` declaring shared deep-loop runtime infrastructure scope
2. Move 10 files from `system-spec-kit/mcp_server/lib/deep-loop/` to `deep-loop-runtime/lib/deep-loop/`
3. Move 2 files (coverage-graph-query, coverage-graph-signals) from `system-spec-kit/mcp_server/lib/coverage-graph/` to `deep-loop-runtime/lib/coverage-graph/`
4. Update imports in `spec_kit_deep-{review,research}_{auto,confirm}.yaml` (4 files)
5. Split tests: runtime unit tests → `deep-loop-runtime/tests/`; MCP registration / handler dispatch / DB lifecycle tests stay in `system-spec-kit/mcp_server/tests/`
6. Verification gates: MCP tool registration unchanged (`mcp tools list` confirms 4 `deep_loop_graph_*` tools); SQLite lifecycle intact; full vitest passes; workflow YAML paths valid

**How to roll back**:

This packet is planning-only; the ADR can be reversed by a follow-on ADR that supersedes it. The follow-on implementation packet (118 or later) carries its own rollback plan (git-revert the file moves + YAML import updates + test relocations).
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
