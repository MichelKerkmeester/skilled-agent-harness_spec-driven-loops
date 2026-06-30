---
title: "Decision Record: CLI Devin Code Graph Hook"
description: "Accepted ADRs for code-graph hook source location, mk-code-index versus mk-code-graph naming, and Devin variant strategy."
trigger_phrases:
  - "ADR"
  - "decision"
  - "code-graph"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/036-cli-devin-code-graph-hook"
    last_updated_at: "2026-05-15T17:35:00Z"
    last_updated_by: "cli-codex-phase-b"
    recent_action: "Phase B synthesis complete"
    next_safe_action: "Phase C implementation"
    blockers: []
    key_files:
      - "decision-record.md"
    completion_pct: 40
    open_questions: []
    answered_questions: []
---

# Decision Record: CLI Devin Code Graph Hook

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---
<!-- ANCHOR:adr-001 -->
## ADR-001: Hook Source Location

### Metadata

| Field | Value |
|-------|-------|
| **Status** | ACCEPTED |
| **Date** | 2026-05-15 |
| **Deciders** | Packet owner, cli-codex Phase B |
| **Related Findings** | F002/Q2, F004/Q4, F005/Q5 |

---
<!-- ANCHOR:adr-001-context -->
### Context

Phase A found that migrating code-graph hooks from `.opencode/skills/system-spec-kit/mcp_server/hooks/` to `.opencode/skills/system-code-graph/hooks/` would be a high-risk breaking change. The current path is referenced by 110+ files, `.claude/settings.local.json:54-66`, and `.opencode/skills/system-spec-kit/mcp_server/scripts/finalize-dist.mjs`. The boundary layer already provides a safe interface from system-spec-kit hooks into code-graph data.

### Constraints

- Phase C must add Devin support without destabilizing existing Claude/Gemini/Codex SessionStart behavior.
- Build and settings path changes are out of scope for this packet.
<!-- /ANCHOR:adr-001-context -->

---
<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Option B, keep hook source at `.opencode/skills/system-spec-kit/mcp_server/hooks/{claude,gemini,codex}/` and add Devin at `.opencode/skills/system-spec-kit/mcp_server/hooks/devin/session-start.ts`.

**How it works**: The Devin variant mirrors the existing Claude `session-prime.ts` shape and calls `getStartupBriefFromMarker()` through the existing code-graph boundary. This documents an intentional asymmetry: advisor hooks are skill-owned, but code-graph hooks stay system-spec-kit-owned until a future migration packet can absorb the build/settings blast radius.
<!-- /ANCHOR:adr-001-decision -->

---
<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| A: Migrate to `system-code-graph/hooks/` | Symmetric with advisor pattern. | 110+ refs, settings paths, build process changes; high break risk. | 4/10 |
| B: Keep in `system-spec-kit/mcp_server/hooks/` | Minimal blast radius; preserves working hooks. | Visible asymmetry requiring documentation. | 9/10 |

**Why this one**: Stability matters more than symmetry here. The migration can happen later if build/config ownership is redesigned.
<!-- /ANCHOR:adr-001-alternatives -->

---
<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Devin support can be added without touching the existing hook source tree.
- Existing Claude/Gemini/Codex registrations stay stable.

**What it costs**:
- Advisor and code-graph hook ownership are asymmetric. Mitigation: document it in ADR-001, SKILL.md, and resource map.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Future reader migrates hooks casually. | H | ADR and docs mark migration deferred. |
| Devin import path differs from advisor. | M | Tests assert the accepted path. |
<!-- /ANCHOR:adr-001-consequences -->

---
<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Necessary? | PASS | Devin support requires a SessionStart path. |
| 2 | Beyond Local Maxima? | PASS | Migration and keep-in-place options were compared. |
| 3 | Sufficient? | PASS | Adds only the missing Devin variant. |
| 4 | Fits Goal? | PASS | Protects startup parity and Phase C scope. |
| 5 | Open Horizons? | PASS | Future migration remains possible. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---
<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Add `.opencode/skills/system-spec-kit/mcp_server/hooks/devin/session-start.ts`.
- Compile to `.opencode/skills/system-spec-kit/mcp_server/dist/hooks/devin/session-start.js`.
- Do not create `.opencode/skills/system-code-graph/hooks/`.

**How to roll back**: Remove the Devin hook source/dist and `.devin/hooks.v1.json` entry; leave existing hook locations untouched.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

## ADR-002: `mk-code-index` MCP Name vs `mk-code-graph` Plugin Name

| Field | Value |
|-------|-------|
| **Status** | ACCEPTED |
| **Date** | 2026-05-15 |
| **Related Findings** | F006/Q6, F008/Q8 |

### Context

The user requested plugin rename to `mk-code-graph`, matching the skill folder. The MCP server is already registered as `mk-code-index`, and tool consumers use the stable prefix `mcp__mk_code_index__*`.

### Decision

Keep MCP server name `mk-code-index`. Rename only the OpenCode plugin and bridge to `mk-code-graph` / `mk-code-graph-bridge.mjs`. Document the asymmetry in SKILL.md and `.opencode/plugins/README.md`.

### Alternatives Considered

| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| Rename MCP to `mk-code-graph` | Name symmetry. | Breaks tool consumers and MCP config. | Rejected. |
| Rename plugin to `mk-code-index` | MCP/plugin symmetry. | Breaks skill-folder naming request. | Rejected. |
| Keep asymmetric names | Preserves tool contract and skill plugin identity. | Requires one explanatory paragraph. | Accepted. |

### Consequences

- Future-reader confusion is possible but bounded by docs.
- MCP tooling stays stable.
- Plugin identity aligns with `system-code-graph` skill naming.

### Implementation Notes

- Do not change `.devin/config.json` MCP server name from `mk_code_index`.
- Do not rename MCP package/server surfaces to `mk-code-graph`.

## ADR-003: Devin Variant Strategy

| Field | Value |
|-------|-------|
| **Status** | ACCEPTED |
| **Date** | 2026-05-15 |
| **Related Findings** | F001/Q1, F003/Q3, F004/Q4, F005/Q5 |

### Context

Devin claims Claude-compatible hooks, but Phase A could not prove inherited SessionStart output from inside the current runtime. Existing Claude SessionStart emits plain text markdown, not JSON `hookSpecificOutput`, and Devin docs do not explicitly document the relevant output behavior.

### Decision

Use the same hybrid strategy as advisor: implement an explicit Devin SessionStart variant and keep `.devin/config.json` `read_config_from.claude=true` as a safety net. The variant location follows ADR-001 and stays under `system-spec-kit/mcp_server/hooks/devin/`.

### Alternatives Considered

| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| Inheritance only | Zero code. | Low-confidence due undocumented behavior. | Rejected as sole strategy. |
| Explicit variant only | Clear path. | Loses safety net if Devin inheritance is actually working. | Rejected as sole strategy. |
| Hybrid | Covers both runtime behaviors. | Requires double-fire verification. | Accepted. |

### Consequences

- Phase D must verify `/hooks` and double-firing.
- The explicit variant can be kept even if inheritance also works, as long as duplicate context is mitigated.

### Implementation Notes

- Call `getStartupBriefFromMarker()`.
- Emit startup block with `kind=startup`, provenance, and `sectionKeys=[structural-context]`.
- Mirror Claude stale warning; no inline refresh.
