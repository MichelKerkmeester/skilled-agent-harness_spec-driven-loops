---
title: "Decision Record: Validate advisor extraction and remove deprecated bridge"
description: "ADR ledger for final validation scope, bridge removal signal, stale-doc cleanup policy, and post-cleanup runtime smoke requirements."
trigger_phrases:
  - "013/009/006 decision record"
  - "advisor cleanup ADR"
  - "spec_kit_memory proxy removal decision"
importance_tier: "critical"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-package-extraction/006-clean-validation-and-remove-deprecated-code"
    last_updated_at: "2026-05-14T12:45:00Z"
    last_updated_by: "codex"
    recent_action: "Validation cleanup landed; P0 tests blocked"
    next_safe_action: "Fix system-skill-advisor package-local Vitest/path failures, then rerun final matrix"
    blockers:
      - "Package-local system-skill-advisor Vitest failed: 153 passed / 71 failed / 38 files."
      - "Hook smoke failed one settings-driven suite because expected Claude settings file is absent."
    key_files:
      - "decision-record.md"
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0130090060000000000000000000000000000000000000000000000000000000"
      session_id: "013-009-006-validation-cleanup"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions:
      - "ADR-001 parent decision remains authoritative for standalone MCP with stable advisor tool ids."
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Validate Advisor Extraction and Remove Deprecated Bridge

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Parent ADR Remains Authoritative

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-14 |
| **Deciders** | Codex under parent ADR-001 constraints |

<!-- ANCHOR:adr-001-context -->
### Context

Parent child 001 accepted "Standalone Advisor MCP With Legacy Tool Bridge." It locked the standalone `system_skill_advisor` server, stable public `advisor_*` tool ids, DB-local ownership, and a temporary memory-side bridge during migration.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: child 006 reuses parent ADR-001 rather than redefining topology.

**How it works**: This packet treats the parent ADR as binding input. Cleanup removes temporary compatibility behavior only after the runtime and caller evidence proves the accepted topology is live.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Reuse parent ADR-001 | Preserves accepted topology and keeps this packet focused | Requires readers to follow the parent reference | 9/10 |
| Reopen topology decisions | Could revisit assumptions after later child work | Expands scope and risks tool-id churn | 3/10 |
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- Child 006 has a narrow job: validate and clean up, not redesign.
- Public advisor tool ids stay stable while server ownership changes.

**What it costs**:

- Any attempt to rename tool ids or collapse servers is out of scope and needs a new ADR.
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The parent decision governs this cleanup. |
| 2 | **Beyond Local Maxima?** | PASS | Reuse avoids local redesign in a validation packet. |
| 3 | **Sufficient?** | PASS | The parent ADR already answers topology, ids, and bridge policy. |
| 4 | **Fits Goal?** | PASS | Cleanup depends on the accepted migration shape. |
| 5 | **Open Horizons?** | PASS | Future topology changes can use a separate ADR. |

**Five Checks Summary**: 5/5 PASS.
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation

Child 006 references parent ADR-001 in `spec.md`, `plan.md`, and this decision record. No topology changes are made by this scaffold.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Validation Surface Scope

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-14 |
| **Deciders** | Codex under 013/009/006 dispatch |

### Context

A cleanup-only pass is unsafe if it validates only one layer. The extraction crosses package-local TypeScript tests, Python shim behavior, hooks, four runtime configs, live MCP probes, DB path ownership, and install docs.

### Decision

**We chose**: a completion claim requires the full validation surface listed in `spec.md` REQ-001 through REQ-009.

**How it works**: Phase 1 captures baseline evidence, Phase 2 removes the bridge and stale references in focused clusters, and Phase 3 reruns the full matrix. P0 rows cannot be deferred.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Full matrix across package, runtimes, hooks, Python, DB, docs | Matches blast radius and catches hidden bridge dependencies | More commands and evidence to collect | 9/10 |
| Package-local tests only | Fast and easy to automate | Misses runtime config and consumer cutover failures | 4/10 |
| Grep cleanup only | Removes obvious stale references quickly | Cannot prove runtime availability | 2/10 |

### Consequences

**What improves**:

- Cleanup is backed by evidence from every affected runtime.
- Failures identify the layer that still depends on compatibility behavior.

**What it costs**:

- The packet cannot complete if any runtime is unavailable and no explicit deferral is approved for P1/P2 rows.

**Five Checks Summary**: 5/5 PASS.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Deprecation-Removal Trigger

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-14 |
| **Deciders** | Codex under operator dispatch |

### Context

Child 005 may have added a temporary `spec_kit_memory` advisor proxy to protect callers during cutover. Removing it too early breaks hidden callers; keeping it too long leaves two apparent advisor owners.

### Decision

**We chose**: remove the proxy only after three signals are true: zero callers in spec packets, zero callers in plugin/code surfaces, and manual operator confirmation.

**How it works**: Phase 1 records grep evidence for `spec_kit_memory.advisor_*`, direct `advisor_*` bridge calls, and old source imports. The implementation phase removes proxy code only after the zero-caller evidence and operator confirmation are both present.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Zero callers plus operator confirmation | Balances safety with decisive cleanup | Requires a manual gate | 9/10 |
| Remove immediately after child 005 | Fast | Hidden caller risk remains | 5/10 |
| Keep proxy indefinitely | Lowest short-term break risk | Preserves confusing dual ownership | 3/10 |

### Consequences

**What improves**:

- The cleanup has a clear go/no-go signal.
- `spec_kit_memory` returns to memory-only ownership after cutover.

**What it costs**:

- If operator confirmation is unavailable, bridge removal blocks even when scans are clean.

**Five Checks Summary**: 5/5 PASS.
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Stale-Doc Removal Policy

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-14 |
| **Deciders** | Codex under 013/009/006 dispatch |

### Context

The migration itself needs historical documentation, but live operator docs must not point users back to `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/` or warn them not to register the standalone MCP server.

### Decision

**We chose**: delete stale live references by default, and annotate as historical only inside ADR or historical-context sections that legitimately discuss the migration.

**How it works**: Grep hits are classified as live instruction, historical explanation, or false-positive. Live instructions are removed or rewritten to the new topology. Historical hits remain only when the section clearly says they describe a past state.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Delete live stale refs, annotate historical refs | Keeps docs accurate without erasing rationale | Requires classification discipline | 9/10 |
| Delete every old-path reference | Maximum cleanliness | Destroys useful ADR context | 6/10 |
| Keep every old-path reference | Preserves context | Misleads operators and future agents | 2/10 |

### Consequences

**What improves**:

- Install and skill docs describe the final two-server topology.
- ADR history remains available where it is explicitly historical.

**What it costs**:

- The implementation summary must record classification counts so future readers can audit the cleanup.

**Five Checks Summary**: 5/5 PASS.
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Post-Cleanup Verification

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-14 |
| **Deciders** | Codex under 013/009/006 dispatch |

### Context

After bridge deletion, the meaningful proof is not only that tests pass. The final state must show the extraction is reversible-safe: the standalone advisor responds in every runtime, memory MCP no longer exposes advisor tools, and docs point to the correct topology.

### Decision

**We chose**: final verification must include a cross-runtime smoke matrix plus explicit absence checks for the old memory-side advisor surface.

**How it works**: Phase 3 runs config inspection and `advisor_recommend` probes for OpenCode, Codex, Claude, and Gemini. It also inspects `spec_kit_memory` tool exposure, DB path behavior, grep results, and install guides before any completion claim.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Cross-runtime smoke plus absence checks | Proves both new availability and old-surface removal | Most expensive verification option | 9/10 |
| Runtime config inspection only | Quick | Does not prove live tool calls work | 5/10 |
| Tool-schema absence only | Confirms cleanup | Does not prove replacement availability | 4/10 |

### Consequences

**What improves**:

- Completion evidence proves the extraction works from the surfaces users actually touch.
- The final state is easier to debug because each runtime row has its own evidence.

**What it costs**:

- Runtime-specific probe failures must be fixed or explicitly documented before completion.

**Five Checks Summary**: 5/5 PASS.
<!-- /ANCHOR:adr-005 -->
