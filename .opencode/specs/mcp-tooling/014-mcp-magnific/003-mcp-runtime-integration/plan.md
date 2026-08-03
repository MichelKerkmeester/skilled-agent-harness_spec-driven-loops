---
title: "Implementation Plan: Magnific MCP runtime integration"
description: "Add the verified official remote endpoint to Code Mode, complete authentication, and capture no-cost discovery evidence."
trigger_phrases: ["magnific runtime plan", "magnific utcp plan", "mcp-remote magnific plan"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/014-mcp-magnific/003-mcp-runtime-integration"
    last_updated_at: "2026-08-02T18:15:00Z"
    last_updated_by: "spec-author"
    recent_action: "Plan runtime registration"
    next_safe_action: "Apply accepted remote topology"
    blockers: ["Phase 2 topology not yet accepted"]
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup: {fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "014-mcp-magnific-003", parent_session_id: null}
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Magnific MCP runtime integration

<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Stack** | JSON, Code Mode, remote MCP bridge |
| **Framework** | `.utcp_config.json` manual-call template |
| **Storage** | Local auth/session state outside Git |
| **Testing** | JSON parse, bridge launch, discovery, no-cost query |

Mirror the established remote manual pattern only after verifying Magnific's auth and transport. Keep all credentials and sessions out of tracked configuration.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Runtime topology accepted
- [x] Endpoint and bridge package verified
- [x] No-cost discovery sequence defined

### Definition of Done
- [x] Config parses and existing manuals remain valid
- [x] Authentication/discovery works or exact blocker is documented
- [x] Repository contains no secret/session artifact
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Remote MCP adapter: Code Mode manual → verified bridge → `https://mcp.magnific.com` → operator-owned account.

### Key Components
- **Manual**: Name-keyed `magnific` registration.
- **Auth flow**: Browser/token mechanism proven in Phase 1.
- **Discovery fixture**: Sanitized callable schema snapshot.

### Data Flow
Code Mode launches bridge, bridge authenticates outside Git, remote server returns schemas/results, fixture stores non-secret evidence.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.utcp_config.json` | External-tool registry | Add one manual | JSON parse and diff |
| `.env.example` | Variable documentation | Change only if verified | Secret-name review |
| Bridge session store | Local auth state | Inspect, never commit | Git status and path check |
<!-- /ANCHOR:affected-surfaces -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Verify bridge identity/version and endpoint
- [x] Snapshot runtime config

### Phase 2: Implementation
- [x] Add Magnific manual
- [x] Complete operator-assisted auth if required (documented as blocker: browser OAuth approval is the operator step)
- [x] Capture sanitized discovery (pre-auth fixture recorded; authenticated fixture supersedes it)

### Phase 3: Verification
- [x] Parse JSON and enumerate tools (config parse verified; tool enumeration auth-gated and recorded)
- [x] Run confirmed free/read probe (blocked pre-auth — exact blocker recorded in fixture)
- [x] Confirm no tracked credential or paid call
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Syntax | Entire `.utcp_config.json` | JSON parser |
| Integration | Bridge and endpoint | Code Mode discovery |
| Security | Auth/session leakage | Grep and git status |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Accepted topology | Internal | Red until Phase 2 | No runtime edit allowed |
| Node/npx | Runtime | Green, verify fresh | Bridge cannot launch |
| Magnific account | External | Yellow | Authenticated discovery may defer |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Bridge fails, auth state is unsafe, discovery invokes mutations, or existing manuals regress.
- **Procedure**: Remove the `magnific` manual, clear only Magnific bridge session state with operator consent, and re-parse the prior config.
<!-- /ANCHOR:rollback -->
