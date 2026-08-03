---
title: "Tasks: Official Magnific MCP research"
description: "Research and discovery tasks for the official Magnific remote MCP contract."
trigger_phrases: ["magnific research tasks", "magnific discovery tasks", "mcp-magnific phase 1 tasks"]
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/014-mcp-magnific/001-official-mcp-research"
    last_updated_at: "2026-08-02T18:20:00Z"
    last_updated_by: "spec-author"
    recent_action: "Execute and close out the official MCP research phase"
    next_safe_action: "Execute 002-mode-architecture-and-scaffold"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup: {fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "014-mcp-magnific-001", parent_session_id: null}
    completion_pct: 100
    open_questions: []
    answered_questions: ["Transport and auth are verified (streamable HTTP, OAuth 2.0 Keycloak).", "Tool names are documented officially; live schemas await an authenticated session."]
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Official Magnific MCP research

<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (artifact)`
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Fix research questions, no-spend boundary, and evidence schema (`research/`) — boundary: read-only probes only; evidence schema: raw captures in `research/evidence/`
- [x] T002 Read the official MCP page, endpoint metadata, plan/credit statements, privacy claims, and connector instructions — official landing page and official docs MCP page captured (`research/evidence/06`, `07`)
- [x] T003 [P] Inventory current Code Mode remote-MCP bridges and authentication patterns — `.utcp_config.json` (mobbin/refero `mcp-remote` precedent), `mcp-code-mode` configuration reference, `.env.example` (no Magnific entry needed)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Verify transport and authentication against `https://mcp.magnific.com` — 405/`allow: POST` on GET; 401 on unauthenticated `initialize` and `tools/list`; OAuth metadata live-captured (Keycloak, PKCE S256, device grant, DPoP advertised); evidence 01–05
- [x] T005 Capture sanitized tools, resources, prompts, schemas, naming, jobs, and output formats — ~34 documented tool names from official docs (`research/research.md` §4, `research/evidence/07-official-docs-mcp.md`); live schemas blocked by auth (recorded as U1, resolved in Phase 3); no resources/prompts claims published [evidence: official docs tool inventory + 401 wire capture]
- [x] T006 Classify each confirmed operation by cost, mutation, destructive, sharing, and account effect — full classification matrix in `research/research.md` §5
- [x] T007 Synthesize runtime topology, mode classification, safety policy, and test-fixture recommendations — `mcp-remote` stdio bridge, transport kind, confirmation gates, no-cost probe set, deferred paid smoke; research.md §6–7
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Audit every load-bearing claim against official or live evidence — source matrix with per-claim evidence file and confidence in research.md §2 [evidence: source matrix S1–S16 in `research/research.md`; no-spend audit in §9]
- [x] T009 Confirm no generation, transformation, training, publishing, or credit spend occurred — call inventory in research.md §9: only 405/401 probes, metadata GETs, and public page fetches; no authenticated session created
- [x] T010 Validate this child and write research closeout evidence — validate.sh --strict passed; implementation-summary.md updated
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No foundational UNKNOWN remains hidden — remaining unknowns (U1–U9) are schema/detail level and explicitly routed to Phase 3; none blocks architecture
- [x] Phase 2 receives a decided evidence-backed contract — research.md §10 handoff list
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Parent**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
