---
title: "Verification Checklist: sk-vision Cursor + Devin MCP adapters"
description: "Verification Date: 2026-08-17"
trigger_phrases:
  - "sk-vision cursor devin checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/014-cursor-devin-mcp-adapters"
    last_updated_at: "2026-08-17T12:10:09.000Z"
    last_updated_by: "claude"
    recent_action: "Ported the MCP server to v4 and wired the Cursor and Devin MCP configs."
    next_safe_action: "Author the phase spec docs and commit the sk-vision-scoped changes on v4."
    blockers: []
    key_files:
      - "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/014-cursor-devin-mcp-adapters/checklist.md"
      - ".opencode/skills/sk-vision/vision-runtime/src/mcp/server.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-014-cursor-devin-mcp-adapters"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Verification Checklist: sk-vision Cursor + Devin MCP adapters

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented. **Evidence**: `spec.md` section 4.
- [x] CHK-002 [P0] Approach defined. **Evidence**: `plan.md` sections 3-4.
- [x] CHK-003 [P1] MCP-only host model confirmed. **Evidence**: `spec.md` Phase Context (Cursor/Devin have no in-process plugin API).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Server builds. **Evidence**: `bun run build` emits `dist/mcp-server.js`.
- [x] CHK-011 [P0] Server ported unchanged from the tested source. **Evidence**: `server.ts` + `server.test.ts` copied from PR #34, no edits.
- [x] CHK-012 [P1] Server kept where its SDK dep resolves. **Evidence**: `vision-runtime/src/mcp/server.ts` imports `@modelcontextprotocol/sdk` from the package.
- [x] CHK-013 [P1] Configs are valid JSON. **Evidence**: `python3 json.load` on `.claude/mcp.json` and `.devin/mcp_config.json`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All P0 acceptance criteria met. **Evidence**: `spec.md` REQ-001 through REQ-005 and `implementation-summary.md` Verification.
- [x] CHK-021 [P0] 13 tools listed over MCP. **Evidence**: live `tools/list` probe against `node dist/mcp-server.js` returned 13.
- [x] CHK-022 [P0] No runtime regression. **Evidence**: `bun test` → 9 pass / 0 fail.
- [x] CHK-023 [P1] Status works without model weights. **Evidence**: `server.test.ts` asserts `loaded: false` and `provider: photon`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Change class: `host-coverage` (MCP transport). **Evidence**: `spec.md` Problem Statement.
- [x] CHK-FIX-002 [P0] Both MCP-only hosts covered. **Evidence**: `.claude/mcp.json` (Cursor) and `.devin/mcp_config.json` (Devin) entries.
- [x] CHK-FIX-003 [P0] Config command actually launches the server. **Evidence**: `node .opencode/skills/sk-vision/vision-runtime/dist/mcp-server.js` answered `tools/list` with 13 tools.
- [x] CHK-FIX-004 [P1] Cursor reach verified through the symlink chain. **Evidence**: `.cursor/mcp.json` -> `.mcp.json` -> `.claude/mcp.json`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets added. **Evidence**: the diff is a ported server, a build entry, two JSON configs, and docs.
- [x] CHK-031 [P1] Vision stays local. **Evidence**: the MCP server drives the same local `python/runtime.py` Moondream runtime; no new outbound path.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. **Evidence**: `spec.md`, `plan.md`, `tasks.md` describe the same MCP work.
- [x] CHK-041 [P1] Host docs updated. **Evidence**: `SKILL.md` §3 and `README.md` §7 name Cursor and Devin.
- [x] CHK-042 [P2] Build-artifact caveat recorded. **Evidence**: `implementation-summary.md` KNOWN LIMITATIONS.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Server lives in the runtime package, not `hooks/`. **Evidence**: `vision-runtime/src/mcp/server.ts` (SDK dep resolves there).
- [x] CHK-051 [P1] Scope isolation. **Evidence**: `git status` shows only sk-vision + the two MCP config paths changed.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

- [x] CHK-060 [P0] All checklist items marked `[x]` with evidence. **Evidence**: `checklist.md` CHK-001 through CHK-061.
- [x] CHK-061 [P0] Runtime tests green. **Evidence**: `bun test` → 9 pass / 0 fail.
<!-- /ANCHOR:summary -->
