---
title: "Feature Specification: MCP Startup Stdio Fix [system-spec-kit/028-mcp-startup-stdio-fix/spec]"
description: "Documents the fix that moved Spec Kit embedding auto-migration diagnostics off MCP stdout so mk-spec-memory can start without JSON-RPC framing corruption."
trigger_phrases:
  - "mk-spec-memory startup"
  - "mcp stdout contamination"
  - "AUTO_MIGRATION_SKIP"
  - "stdio json rpc"
  - "028"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-mcp-startup-stdio-fix"
    last_updated_at: "2026-05-15T20:15:00Z"
    last_updated_by: "codex"
    recent_action: "Documented completed mk-spec-memory MCP startup stdio fix"
    next_safe_action: "Use changelog/changelog-028-root.md as the closeout record"
    blockers: []
    key_files: ["changelog/changelog-028-root.md", "implementation-summary.md"]
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "User requested a new 028 spec folder under specs/system-spec-kit for the detailed changelog."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: MCP Startup Stdio Fix

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-15 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`mk-spec-memory` appeared to fail during MCP startup. Direct launcher execution showed the server could initialize, but an MCP JSON-RPC smoke probe found a non-JSON diagnostic line on stdout: `AUTO_MIGRATION_SKIP: no hf-local source store with rows`. Since stdio MCP transport reserves stdout for protocol frames, that line could corrupt the client handshake even when the server itself was otherwise healthy.

The investigation also found an earlier, separate failure where `EMBEDDINGS_PROVIDER=auto` selected Voyage because `VOYAGE_API_KEY` was present, then failed on an invalid or unauthorized API key. That configuration issue was real, but it was not the active stdio framing failure after the server switched to local llama-cpp startup.

### Purpose

Keep MCP stdout JSON-RPC clean by routing embedding auto-migration diagnostics to stderr, then document the fix and verification evidence in this 028 packet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Identify why `mk-spec-memory` startup failed under an MCP client despite direct server startup succeeding.
- Fix the stdout contamination caused by embedding auto-migration diagnostics.
- Update the tracked TypeScript source, tracked JavaScript mirror, and focused tests.
- Record a detailed changelog in `specs/system-spec-kit/028-mcp-startup-stdio-fix/changelog/changelog-028-root.md`.

### Out of Scope

- Changing provider selection semantics for `EMBEDDINGS_PROVIDER=auto`.
- Repairing or rotating a user-specific invalid `VOYAGE_API_KEY`.
- Reworking the whole Spec Kit MCP startup path.

### Files Changed

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts` | Modify | Move auto-migration diagnostic messages from stdout to stderr. |
| `.opencode/skills/system-spec-kit/shared/embeddings/factory.js` | Modify | Keep the tracked JavaScript mirror aligned with the TypeScript source. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embeddings-auto-migration.vitest.ts` | Modify | Assert auto-migration diagnostics use stderr and do not call `console.info`. |
| `specs/system-spec-kit/028-mcp-startup-stdio-fix/` | Create | Store the closeout packet and detailed changelog requested by the user. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | MCP stdout must contain only JSON-RPC protocol frames during startup. | A line-delimited MCP smoke probe completes with `parse_failures=0`. |
| REQ-002 | Auto-migration diagnostics must remain visible for operators. | Diagnostics are written to stderr via a local helper. |
| REQ-003 | Regression coverage must catch stdout reintroduction. | Focused Vitest coverage expects stderr writes and no `console.info`. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The tracked JS mirror must stay aligned. | `factory.js` contains the same stderr diagnostic helper behavior. |
| REQ-005 | The fix must be verified with stack-appropriate checks. | Shared build, shared typecheck, MCP server typecheck, focused tests, and MCP smoke probe pass. |
| REQ-006 | The closeout must distinguish root cause from adjacent config failure. | Changelog documents both the invalid Voyage key failure and the active stdout contamination failure. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `mk-spec-memory` can complete MCP JSON-RPC startup without protocol parse failures from auto-migration diagnostics.
- **SC-002**: Operators still see auto-migration status messages on stderr.
- **SC-003**: The packet changelog records what was investigated, what changed, what passed, and what remains a configuration caveat.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Stdio MCP framing rules | Any stdout log line can break client JSON parsing. | Keep non-protocol diagnostics on stderr. |
| Dependency | Embeddings provider environment | Invalid cloud provider keys can still fail startup when selected. | Document that the stdio fix does not validate or replace keys. |
| Risk | Mirror drift between TS and JS | Runtime surfaces could diverge if only one file changes. | Patch both tracked files and run build/typecheck. |
| Risk | Hidden stdout logging elsewhere | Another startup path could emit non-JSON text. | Run a direct MCP smoke probe and watch `parse_failures`. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. The remaining Voyage API key issue is a configuration action, not an open implementation question for this packet.
<!-- /ANCHOR:questions -->
