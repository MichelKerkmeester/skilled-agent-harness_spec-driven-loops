---
title: "Implementation plan: Codex skill advisor Node runtime alignment"
description: "Prove the ABI mismatch with a safe negative control, update one Codex runtime path, and rerun the exact MCP initialize handshake. Preserve server-specific Node pins whose native dependencies have different ABI requirements."
trigger_phrases:
  - "Codex advisor runtime plan"
  - "MCP initialize handshake verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/019-codex-node-runtime-alignment"
    last_updated_at: "2026-08-10T08:41:19Z"
    last_updated_by: "codex"
    recent_action: "Completed the runtime repair and objective checks"
    next_safe_action: "Start a fresh Codex session and inspect the startup banner"
    blockers: []
    key_files:
      - ".codex/config.toml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-mcp-runtime-alignment-20260810"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Codex Skill Advisor Node Runtime Alignment

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TOML, Node.js, MCP stdio |
| **Framework** | Codex MCP configuration |
| **Storage** | SQLite through `better-sqlite3` |
| **Testing** | Native module constructor, MCP initialize handshake, TOML parse |

### Overview
The repair changes the advisor's Codex-only executable from Node 22 to `/opt/homebrew/bin/node`, currently Node 25 ABI 141. The proof uses the same launcher and environment that Codex reads from `.codex/config.toml`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Exact startup symptom reproduced.
- [x] ABI mismatch isolated to the advisor's configured Node runtime.
- [x] Rollback is a one-line path restoration.

### Definition of Done
- [x] Exact configured advisor launcher completes MCP initialize.
- [x] Codex configuration loading and scoped diff checks pass.
- [x] Strict packet validation exits 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Server-specific runtime pinning.

### Key Components
- **Codex MCP registry**: Selects the executable and launcher for each local server.
- **Skill advisor launcher**: Loads the advisor and its ABI-sensitive SQLite dependency.

### Data Flow
Codex reads `.codex/config.toml`, spawns the configured Node executable with the advisor launcher, then sends MCP `initialize` over stdio.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.codex/config.toml` advisor command | Produces the failing runtime selection. | Update to Node 25. | TOML parse and exact initialize handshake. |
| `mk-spec-memory` command | Uses a separate dependency tree under Node 22. | Unchanged. | Confirm scoped diff and registration. |
| `code_mode` command | Uses `isolated-vm` built for Node 24. | Unchanged. | Confirm scoped diff and registration. |
| Codex-managed servers | Reported as not initialized after interruption. | No direct change. | New session no longer stops at advisor initialization. |

The invariant is that each MCP server runs with the Node ABI required by its own native dependency tree; runtime pins are not normalized globally.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Capture the scoped baseline and inspect all configured runtime pins.
- [x] Define the negative and positive controls.

### Phase 2: Core Implementation
- [x] Reproduce the ABI mismatch under Node 22.
- [x] Change only the advisor runtime path.

### Phase 3: Verification
- [x] Load the final TOML through the Codex CLI.
- [x] Complete the exact advisor MCP initialize handshake.
- [x] Validate the packet and inspect the final scoped diff.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Negative control | Construct `better-sqlite3` under configured Node 22. | Node.js |
| Integration | Send MCP `initialize` to the configured advisor launcher. | Node.js stdio harness |
| Configuration | Load `.codex/config.toml` and inspect the resolved registration. | Codex CLI |
| Final state | Validate packet and scoped diff. | `validate.sh`, Git |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `/opt/homebrew/bin/node` | Local runtime | Green | Advisor cannot load ABI 141 native module. |
| Advisor `node_modules` | Local dependency tree | Green | MCP server cannot start. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The advisor fails under Node 25 for a reason not present under Node 22 after rebuilding dependencies.
- **Procedure**: Restore the previous Node 22 command in `.codex/config.toml` and rerun the initialize handshake.
<!-- /ANCHOR:rollback -->
