---
title: "Decision Record: 004 — MCP Tool Surface Removal"
description: "ADR-001 records the choice to delete the four deep_loop_graph_* MCP tools with no backward-compat aliases after phase 003 ships the .cjs script replacements."
trigger_phrases:
  - "MCP tool surface removal decision"
  - "ADR-001 deep_loop_graph removal"
  - "118 phase 004 decision"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-deep-skill-evolution/003-deep-loop-runtime/005-mcp-tool-surface-removal"
    last_updated_at: "2026-05-22T19:55:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored ADR-001 with 5/5 checks"
    next_safe_action: "Await phase 003 shims"
    blockers: ["depends-on:003-script-shim-and-db-relocation"]
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:1180041180041180041180041180041180041180041180041180041180040004"
      session_id: "118-004-mcp-tool-surface-removal-adr"
      parent_session_id: null
---
# Decision Record: 004 — MCP Tool Surface Removal

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Complete Removal of Four MCP Tools (No Backward-Compat Aliases)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-22 |
| **Deciders** | User directive override of 117 SPLIT ruling; phase-parent author |

---

<!-- ANCHOR:adr-001-context -->
### Context

The parent packet 118 implements the user's FULL_ISOLATE_NO_MCP directive: move every deep-loop and coverage-graph piece of infrastructure out of `system-spec-kit/mcp_server/` and into a new peer skill `.opencode/skills/deep-loop-runtime/`, and replace the four `deep_loop_graph_*` MCP tools with direct `.cjs` script invocations. Phase 003 ships those `.cjs` script shims and relocates the SQLite DB. Phase 004 is the next step: it must remove the four MCP tools from the server so the surface actually shrinks.

Three shapes were on the table for that removal: a clean deletion, an alias layer, and a thin-wrapper layer. The choice locks the migration's exit shape, so it belongs in a packet ADR.

### Constraints

- The user directive is explicit and was authored after the 117 council SPLIT ruling. Anything that leaves the MCP surface intact violates the directive.
- The only external consumers of the four tools outside the deep-* workflow YAMLs are `/doctor` (one diagnostic) and the `system-code-graph` playbook (one scenario); both are scheduled to swap to script invocation in phase 006.
- The deep-* workflow YAMLs themselves are scheduled to swap in phase 005.
- Phase 003's `.cjs` scripts already cover the full functional surface of the four MCP tools; the runtime libs they depend on already moved in phase 002.
- The MCP server architecture has no requirement to retain dead tool IDs; tool registration is per-handler and removable.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Delete the four `deep_loop_graph_*` MCP tools completely — five handler files, four entries in `tool-schemas.ts`, four entries in `schemas/tool-input-schemas.ts`, and four registration calls in `tools/index.ts` — with no backward-compat aliases and no transition wrappers.

**How it works**: Phase 004 runs as delete-only. It deletes the `mcp_server/handlers/coverage-graph/` folder, edits three central files to remove the four entries from each, clears the TS build cache, and verifies via `tsc --noEmit` plus an MCP smoke start that `mcp tools list` shows exactly four fewer tools. Phases 005 and 006 immediately follow to swap consumers (YAML workflows + `/doctor` + playbook) onto the phase-003 `.cjs` scripts.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Complete removal (chosen)** | Honors user directive; MCP surface actually shrinks; no dead code; clean exit shape; smallest long-term maintenance cost | One-shot break window for consumers between phase 004 and phase 006 (mitigated by order constraint in parent phase-map) | 9/10 |
| Keep MCP tools as backward-compat aliases pointing at the scripts | Smooth transition for any forgotten consumer; no break window | Defeats the user directive (MCP layer stays intact); doubles the surface (alias + script); aliases need their own tests; cargo-cult risk of long-lived aliases | 2/10 |
| Keep MCP tools as thin wrappers that call the scripts internally | Preserves tool IDs for any forgotten consumer | Worst-of-both-worlds: MCP layer is still alive and now duplicates the script surface; tool semantics drift between MCP wrapper and direct script invocation; testing two paths instead of one | 2/10 |
| Partial removal (delete some, keep some) | Reduces risk of breaking one specific consumer mid-arc | Half-state is worse than either extreme: still violates FULL_ISOLATE_NO_MCP, still introduces wrapper/alias semantic split for the kept tools, and harder to reason about | 1/10 |

**Why this one**: Complete removal is the only option that actually satisfies FULL_ISOLATE_NO_MCP. Aliases and wrappers superficially "soften" the migration but leave the MCP layer alive in the exact place the user directive asks us to delete it, and they each introduce a second surface that has to be tested, documented, and removed later anyway. The only real cost of complete removal is a narrow break window between phases 004 and 006 for the two non-YAML consumers, and that cost is bounded by ordering them in the same arc.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- The MCP tool surface shrinks by exactly four tools (SC-005), measurable via `mcp tools list`.
- `system-spec-kit/mcp_server/` carries less dead weight: five handler files and twelve schema/registration entries gone.
- No second code path to maintain (no aliases, no wrappers). Consumers know there is exactly one way to reach the runtime: invoke the `.cjs` script.
- Future readers see the user directive realized in the file system, not just in workflow YAML.

**What it costs**:

- A narrow time window exists between phase 004 (deletes the tools) and phase 006 (swaps `/doctor` + playbook) where `/doctor` and the system-code-graph playbook scenario will fail if invoked. Mitigation: phases 005 and 006 land in the same arc; parent `spec.md` phase-map handoff criteria already enforce the order.
- The deep-* workflow YAMLs (four files) similarly need updating in phase 005. Mitigation: phase-map ordering plus REQ-008's grep sweep ensures no hidden consumer remains.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Hidden consumer in the repo still imports a deleted handler symbol | M | T002 + T003 + T019 repo-wide grep sweeps; halt deletion if any unexpected hit |
| Phase 003 `.cjs` shims not actually ready when phase 004 starts | H | REQ-009 pre-condition check (T001) gates the deletes |
| Doctor or playbook fails between 004 and 006 | M | Order constraint in parent phase-map; both phases scheduled in the same arc |
| Future requester asks for the aliases back | L | This ADR documents the explicit rejection rationale; revisit only if FULL_ISOLATE_NO_MCP directive itself is rescinded |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Phase 003 ships the script replacements; without phase 004 the MCP surface stays alive and the user directive FULL_ISOLATE_NO_MCP is not actually met. The deletion is the missing step that turns "we have scripts" into "we have no MCP layer". |
| 2 | **Beyond Local Maxima?** | PASS | Three concrete alternatives (aliases, thin wrappers, partial removal) were enumerated with pros/cons/scores. Each was rejected on principled grounds tied to the user directive and to long-term surface hygiene. The chosen option scored 9/10 vs 1-2/10 for the others. |
| 3 | **Sufficient?** | PASS | Deletion is the simplest possible action: remove five files, edit three files, clear the build cache. No new abstractions, no transition layers, no migration scripts beyond `rm` and `git`. |
| 4 | **Fits Goal?** | PASS | The packet-level goal is FULL_ISOLATE_NO_MCP. Phase 004 is on the critical path: phases 005 and 006 cannot land cleanly until the tool IDs no longer exist (otherwise YAML and doctor edits could still bind to phantom tools). |
| 5 | **Open Horizons?** | PASS | Removing the four tools makes future MCP-server work easier: less code to read, fewer handlers to grep, simpler tool-list output. Future deep-loop changes happen in `deep-loop-runtime/`, not in `system-spec-kit/mcp_server/`. The decision aligns with the long-term shape established by phase 001's peer-skill scaffold. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:

- `.opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts` — deleted.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts` — deleted.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts` — deleted.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts` — deleted.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/index.ts` — deleted.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/` folder — removed.
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` — four tool definitions removed; any local imports that become unused removed.
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` — four schema entries removed; any unused imports cleaned.
- `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts` — four registration calls removed; `from '../handlers/coverage-graph/...'` import line(s) removed.
- `.opencode/skills/system-spec-kit/mcp_server/dist/` — cleared as part of the verification step (rebuild on next typecheck/start).

**How to roll back**: `git revert <phase-004-commit-sha>` restores the five handler files and reverts the three edits in a single mechanical step. Because the deletes are localized and do not touch phase 003 shims, phase 002 lib moves, or phase 001 scaffold, the revert is safe and self-contained. After revert, run `rm -rf dist/` and re-run `tsc --noEmit` plus an MCP smoke start to confirm the pre-phase-004 baseline is restored.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---
