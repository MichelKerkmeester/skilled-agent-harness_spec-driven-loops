---
title: "Decision Record: Magnific mode architecture"
description: "Architecture decisions governing the nested mcp-magnific transport packet, remote runtime, credit gates, and design-judgment boundary."
trigger_phrases: ["magnific architecture decision", "mcp-magnific decisions", "magnific transport decision"]
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/014-mcp-magnific/002-mode-architecture-and-scaffold"
    last_updated_at: "2026-08-02T15:35:00Z"
    last_updated_by: "spec-author"
    recent_action: "Accept architecture decisions against Phase 1 evidence"
    next_safe_action: "Execute 003-mcp-runtime-integration"
    blockers: []
    key_files: ["spec.md", "decision-record.md"]
    session_dedup: {fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "014-mcp-magnific-002", parent_session_id: null}
    completion_pct: 100
    open_questions: ["Live tool schemas and per-tool credit costs await an authenticated session (Phase 3)."]
    answered_questions: ["Verified behavior supports packetKind transport with backendKind code-mode-remote-mcp.", "Direct streamable-HTTP registration is documented-but-unverified for Code Mode; mcp-remote bridge is accepted."]
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v2.2 -->
# Decision Record: Magnific mode architecture

<!-- SPECKIT_LEVEL: 2 -->

<!-- ANCHOR:status -->
## Status

**Accepted** — confirmed against Phase 1 evidence (2026-08-02). Evidence: packet
`001-official-mcp-research/research/research.md` (source matrix S1–S16). Amendments require
contradicting authenticated discovery, recorded in this file rather than silently worked around.
<!-- /ANCHOR:status -->

<!-- ANCHOR:context -->
## Context

Magnific exposes an official remote MCP endpoint for paid-plan users. Generation and transformation consume credits, while the official product page describes balance and history reads as free. The integration belongs under the existing `mcp-tooling` hub and must preserve the distinction between creative judgment and tool transport.

Phase 1 verified: streamable HTTP transport at `https://mcp.magnific.com` (POST-only, fully
Bearer-gated — `initialize` and `tools/list` return 401 without a token); OAuth 2.0 via Keycloak
realm `auth.magnific.com/realms/mcp` (browser authorization-code + PKCE S256, device grant and
DPoP advertised); ~34 stable tool names documented officially; MCP shares the account credit
balance; no API key exists.
<!-- /ANCHOR:context -->

<!-- ANCHOR:decisions -->
## Decisions

### ADR-001: Nested transport packet

Create `mcp-magnific` as a nested mode under `mcp-tooling` (`packetKind: transport`,
`backendKind: code-mode-remote-mcp`, `mutatesWorkspace: false`), not as a standalone advisor
identity. Magnific-specific prompts first select the hub, then the mode. Matches the live
`mcp-refero`/`mcp-mobbin` registry entries; the hub already declares the `transport-axis` extension.

### ADR-002: Official remote endpoint through Code Mode via the mcp-remote bridge

Use `npx -y mcp-remote https://mcp.magnific.com` as a stdio manual template in Code Mode — the
established repo pattern for OAuth-protected remote MCP servers (mobbin, refero). `mcp-remote`
v0.1.38 handles browser OAuth (DCR + PKCE), token refresh, DPoP, and session storage under
`~/.mcp-auth/`. Direct streamable-HTTP registration in Code Mode stays documented-but-unverified;
Phase 3 confirms which path serves live discovery, without changing the accepted bridge unless
proven incompatible.

### ADR-003: Runtime discovery is authoritative

Do not hard-code callable names or argument schemas from marketing copy. Discover the current
server surface at runtime and maintain dated, sanitized fixtures for documentation and tests. The
official docs themselves state the live `tools/list` response is the source of truth. Phase 1's
official-doc tool inventory is the baseline; authenticated discovery supersedes it per session.

### ADR-004: Explicit financial and mutation gates

Classify every operation before execution (read-only/no-cost, credit-consuming generation,
credit-consuming transformation, credit-consuming training, account/workspace writes,
destructive). Credit-consuming, training, deletion, and account-changing operations require
explicit confirmation immediately before the call with a stated expected output and spend
boundary. Confirmed free/read operations may proceed without a spend confirmation. The phase
records the full class→gate matrix; paid smoke tests are separately authorized.

### ADR-005: Creative judgment remains with sk-design

When a request requires visual direction, taste, composition, or critique, load `sk-design` before
transport execution. `mcp-magnific` may execute an already-approved transformation without
re-deciding creative intent. This is the transport-axis cross-hub pairing, matching
`mcp-figma`/`mcp-refero`/`mcp-mobbin`.

### ADR-006: Credentials and sessions stay outside Git

OAuth tokens, cookies, access tokens, and bridge session state must remain in operator-owned local
storage (`~/.mcp-auth/`). Tracked files may contain variable names and setup instructions, never
values. No `.env` entry is required for Magnific (no API key exists).
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:alternatives -->
## Alternatives Considered

| Alternative | Outcome | Reason |
|-------------|---------|--------|
| Standalone skill/advisor identity | Rejected | Violates the hub's nested-mode ownership model |
| Native OpenCode MCP registration | Rejected for current architecture | External MCP tools are routed through Code Mode |
| Direct streamable-HTTP registration in Code Mode | Deferred (documented-but-unverified) | Code Mode's `sse` template type targets SSE URLs; this repo has no verified streamable-HTTP + OAuth precedent; `mcp-remote` is the verified-shape bridge. Phase 3 may re-evaluate with live evidence |
| Local wrapper server | Rejected | Adds maintenance and security surface without evidence it is needed |
| API-key/token-in-repo auth | Rejected | No Magnific MCP API key exists; OAuth is the only documented auth; ADR-006 keeps sessions out of Git |
| Embed creative direction in transport | Rejected | Duplicates `sk-design` and blurs judgment ownership |
| Treat all calls as free/read | Rejected | Official product and docs establish credit-consuming operations |
<!-- /ANCHOR:alternatives -->

<!-- ANCHOR:consequences -->
## Consequences

- Implementation proceeds with the accepted bridge; authenticated discovery in Phase 3 may amend
  schema-level details but not the transport classification without a new decision.
- The mode must expose cost and mutation class before execution; credit gates are mandatory.
- Live tests split into mandatory no-cost checks and separately authorized paid smoke tests.
- Hub registration remains atomic and occurs only after the package validates.
- Remaining unknowns (live schemas, per-tool credit costs, job lifecycle, asset formats) are
  schema/detail level and resolved in Phase 3; none blocks this architecture.
<!-- /ANCHOR:consequences -->

<!-- ANCHOR:validation -->
## Validation

Phase 2 compared these decisions against Phase 1 evidence (research.md source matrix S1–S16),
nested-package doctrine (`sk-create-skill` parent-skills-nested-packets), and the live
`mcp-refero`/`mcp-mobbin` registry entries. The package skeleton passed structural inventory;
shared hub files were not modified in this phase. Contradicting evidence requires amendment rather
than a silent workaround.
<!-- /ANCHOR:validation -->
