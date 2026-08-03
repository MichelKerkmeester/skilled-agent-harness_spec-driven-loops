---
title: "Tasks: Magnific MCP runtime integration"
description: "Runtime registration, authentication, discovery, and secret-safety tasks for the official remote endpoint."
trigger_phrases: ["magnific runtime tasks", "magnific utcp tasks", "mcp-remote magnific tasks"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/014-mcp-magnific/003-mcp-runtime-integration"
    last_updated_at: "2026-08-02T18:15:00Z"
    last_updated_by: "spec-author"
    recent_action: "Define runtime task sequence"
    next_safe_action: "Execute 004-skill-authoring"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "research/discovery-fixture.json"]
    session_dedup: {fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "014-mcp-magnific-003", parent_session_id: null}
    completion_pct: 100
    open_questions: []
    answered_questions: ["Authenticated discovery completed: 85 tools, 22 resources, 1 prompt; cost simulation exists"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Magnific MCP runtime integration

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

- [x] T001 Confirm accepted endpoint, bridge, auth, and discovery sequence — endpoint `https://mcp.magnific.com`; bridge `npx -y mcp-remote`; auth browser OAuth; sequence discover → consent-gate → call [evidence: `../002-mode-architecture-and-scaffold/decision-record.md` ADR-002]
- [x] T002 Snapshot `.utcp_config.json` and parse the baseline — baseline parsed, 11 manuals; git snapshot captured [evidence: `git diff --stat .utcp_config.json` pre-change = clean]
- [x] T003 [P] Verify bridge package identity/version and locate auth-session storage — mcp-remote 0.1.38 (npm); launch probe auto-discovered OAuth and started callback server; session storage `~/.mcp-auth/` (outside repo) [evidence: `research/discovery-fixture.json` bridge_observations]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the `magnific` manual to `.utcp_config.json` — appended name-keyed `magnific` manual: stdio, `npx -y mcp-remote https://mcp.magnific.com`, empty env; 18-line surgical diff, no reindent churn [evidence: `git diff .utcp_config.json` +18]
- [x] T005 Add only verified variable names to `.env.example` when required — NOT required: Magnific MCP is OAuth-only, no API key or env variable exists [evidence: `research/research.md` §3.2 + ADR-006]
- [x] T006 Complete operator-assisted authentication without committing state — operator approved browser OAuth 2026-08-02T18:04Z; bridge connected ("Connected to remote server using StreamableHTTPClientTransport"); session persisted in `~/.mcp-auth/`, nothing in repo [evidence: bridge log + `~/.mcp-auth/mcp-remote-0.1.37/d26f40..._tokens.json`]
- [x] T007 Capture sanitized discovery and naming evidence — authenticated fixture: 85 tools with input schemas, 22 resources (ui://, models://, flows:// etc.), 1 prompt; canonical server names captured; Code Mode namespace confirmation deferred to a Code Mode session [evidence: `research/discovery-fixture-authenticated.json`]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Parse the full config and verify existing manuals remain intact — 12 manuals parse clean; diff shows only the +18 magnific insertion [evidence: `python3 -m json.tool .utcp_config.json` exit 0]
- [x] T009 Run a confirmed no-cost discovery/read probe and inspect credit state when available — tools/list, resources/list, prompts/list, account_balance all succeeded post-auth; balance probe returned structured credits (44,381/60,000); zero spend [evidence: `research/discovery-fixture-authenticated.json` balance_probe]
- [x] T010 Grep/git-status for secrets or session artifacts and validate this child — no token/cookie/session artifact in repo; bridge state in `~/.mcp-auth/` only; strict validation passed [evidence: `git status --porcelain` + validate.sh --strict exit 0]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] Official endpoint is discoverable or exact auth blocker is documented — blocker recorded: operator browser OAuth approval
- [x] No credit-consuming call or credential leak occurred — probe inventory: 401s, OAuth metadata, bridge launch; zero spend
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Architecture**: `../002-mode-architecture-and-scaffold/`
<!-- /ANCHOR:cross-refs -->
