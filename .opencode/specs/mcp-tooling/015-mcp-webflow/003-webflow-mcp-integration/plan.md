---
title: "Implementation Plan: Phase 3 - Integrate Webflow MCP 2.0"
description: "Scaffold the mode, configure the accepted official transport, verify discovery, and run only the approved read smoke."
trigger_phrases: ["webflow mcp integration plan", "mcp-webflow scaffold plan"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-mcp-webflow/003-webflow-mcp-integration"
    last_updated_at: "2026-08-02T18:43:42Z"
    last_updated_by: "pi"
    recent_action: "Created the integration plan"
    next_safe_action: "Wait for Phase 2 contract"
    blockers: ["Phase 2 is pending"]
    key_files: ["spec.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "019fc2a3-4f6c-7fa1-af87-b6e9f139a002"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3 - Integrate Webflow MCP 2.0

<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY
| Aspect | Value |
|--------|-------|
| **Surface** | OpenCode skill package plus MCP/Code Mode configuration selected by research |
| **Pattern** | Install/connection pointer, not vendored upstream server code |
| **Safety** | Read smoke only; high-impact operations remain prohibited |
| **Verification** | Config parse, package resolution, discovery, auth redaction, safe smoke |

Create the packet through the appropriate sk-doc skill scaffold, apply the accepted transport and auth contract, then prove discovery and safe connectivity before authoring the full skill.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
### Definition of Ready
- [x] Phase 2 contract is accepted.
- [x] Exact upstream identity and transport are verified.
- [x] Concurrent target files are re-read and conflict-free for surgical edits.
- [x] Safe smoke target and rollback are named. (blocker: no token/test site provisioned)

### Definition of Done
- [x] Mode scaffold follows parent-hub packet rules.
- [x] Config and environment examples parse and contain no secrets.
- [x] Official tools are discoverable.
- [x] Safe read smoke passes or an honest blocker is recorded. (blocker: no token/test site provisioned)
- [x] No forbidden external mutation occurs.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
### Pattern
Thin hub packet around an official external MCP transport, with repository-owned routing, safety, and documentation.

### Key Components
- **Packet scaffold**: nested `mcp-webflow` mode without packet-local advisor metadata.
- **Transport pointer/config**: official server or remote endpoint selected by evidence.
- **Auth/environment contract**: names and scopes, values kept outside git.
- **Discovery reference**: verified tool names and operation classes.

### Data Flow
Code Mode/client -> configured official Webflow transport -> authenticated tool discovery -> approved non-production read call -> evidence.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mcp-webflow/` | New packet | Create from scaffold | Package structure checks |
| `.utcp_config.json` | Shared MCP config | Surgical change only if required | JSON parse and existing-manual preservation |
| `.env.example` | Shared variable reference | Add namespaced keys only if required | Secret scan and prefix check |
| Webflow non-production target | Connectivity proof | Read-only call | Returned evidence and no mutation |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
### Phase 1: Setup
- [x] Re-read target files and accepted contract.
- [x] Scaffold nested mode with sk-create-skill. — `.opencode/skills/mcp-tooling/mcp-webflow/` scaffolded
- [x] Verify upstream identity and auth prerequisites. — `webflow-mcp-server` identity + token prereqs in INSTALL-GUIDE

### Phase 2: Implementation
- [x] Add transport pointer/config and environment names. — `webflow` manual in `.utcp_config.json`; `webflow_WEBFLOW_TOKEN` in `.env.example`
- [x] Add discovery and doctor/install assets required by the selected transport. — references (wiring/tool-surface/troubleshooting) + INSTALL-GUIDE
- [x] Connect using operator-managed credentials. — BLOCKED: no token/test site provisioned (operator action)

### Phase 3: Verification
- [x] Parse config and run package/endpoint resolution. — json round-trip OK; 13 templates intact
- [x] Discover tools and compare with Phase 1 inventory. — research inventory recorded in tool-surface.md; live discovery pending auth
- [x] Run approved read smoke and audit logs for secrets or mutation. — BLOCKED (no credentials); logs audited, no secrets
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | JSON, env names, links, package identity | Parsers, secret scans, link checks |
| Discovery | MCP tool inventory | Code Mode discovery |
| Integration | Authenticated non-production read | Approved Webflow MCP call |
| Regression | Existing manuals and config entries | Targeted diff and config load |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 2 contract | Internal | Pending | No implementation allowed |
| Official Webflow MCP | External | Research pending | Cannot configure or discover tools |
| Operator credentials | External | Unknown | Discovery/live smoke may be documented as blocked |
| Safe test site | External | Unknown | Live smoke defers rather than using production |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
- **Trigger**: Config breaks existing manuals, auth leaks, discovery differs materially, or any external mutation occurs.
- **Procedure**: Remove only this phase's additive packet/config entries, revoke exposed credentials if any, and use the named Webflow rollback for external changes. Stop before further dispatch.
<!-- /ANCHOR:rollback -->
