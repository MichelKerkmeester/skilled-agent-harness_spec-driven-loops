---
title: "Implementation Plan: MCP Startup Stdio Fix [system-spec-kit/028-mcp-startup-stdio-fix/plan]"
description: "Plan and verification route for keeping Spec Kit MCP stdout protocol-clean during mk-spec-memory startup."
trigger_phrases:
  - "mcp startup plan"
  - "stdio diagnostics"
  - "mk-spec-memory fix"
  - "028"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-mcp-startup-stdio-fix"
    last_updated_at: "2026-05-15T20:15:00Z"
    last_updated_by: "codex"
    recent_action: "Captured implementation plan for completed stdio fix"
    next_safe_action: "Review changelog"
    blockers: []
    key_files: ["plan.md", "changelog/changelog-028-root.md"]
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: MCP Startup Stdio Fix

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript and tracked JavaScript mirror |
| **Runtime** | Node.js MCP server over stdio |
| **Storage** | Spec Kit memory database and local embedding stores |
| **Testing** | npm build, TypeScript checks, Vitest, direct MCP JSON-RPC smoke probe |

### Overview

The fix keeps stdout reserved for MCP protocol frames by moving embedding auto-migration diagnostics to stderr. The implementation is deliberately narrow: one helper in the embedding factory, the aligned JavaScript mirror, and a regression test that fails if the diagnostic path goes back through `console.info`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented.
- [x] Success criteria measurable through a JSON-RPC smoke probe.
- [x] Adjacent invalid Voyage API key failure separated from the active stdio failure.

### Definition of Done

- [x] Startup diagnostics moved off stdout.
- [x] Focused tests updated.
- [x] Shared build and typechecks passed.
- [x] MCP smoke probe passed with zero parse failures.
- [x] Packet changelog created under `specs/system-spec-kit/028-mcp-startup-stdio-fix/changelog/`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Surgical transport-boundary fix.

### Key Components

- **Embedding provider factory**: owns provider selection and embedding store auto-migration diagnostics.
- **MCP stdio transport**: treats stdout as JSON-RPC-only protocol output.
- **Vitest regression suite**: verifies successful auto-migration logging no longer uses stdout.

### Data Flow

At startup, the MCP server initializes the embedding provider and may run local store migration checks. Those checks can emit human-readable diagnostics, but after this fix they go to stderr while stdout remains available only for JSON-RPC messages.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts` | TypeScript source for provider factory and migration diagnostics. | Added `logAutoMigrationDiagnostic()` and routed diagnostic messages through stderr. | Build, shared typecheck, focused Vitest. |
| `.opencode/skills/system-spec-kit/shared/embeddings/factory.js` | Tracked JavaScript mirror used by runtime surfaces. | Mirrored the stderr helper and call-site changes. | MCP server typecheck and smoke probe. |
| `embeddings-auto-migration.vitest.ts` | Regression coverage for migration behavior. | Spies on `process.stderr.write` and asserts no `console.info`. | Focused Vitest pass. |
| MCP stdio startup | Client/server handshake over stdout. | No direct code change; behavior protected by moving diagnostics off stdout. | Smoke probe reports `tools=39 parse_failures=0`. |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Investigation

- [x] Start the launcher directly to distinguish server boot failure from client handshake failure.
- [x] Read startup logs and identify the older invalid Voyage provider failure.
- [x] Run a JSON-RPC smoke probe and capture stdout parse contamination.

### Phase 2: Fix

- [x] Add a stderr diagnostic helper in the embedding factory.
- [x] Replace `console.info` auto-migration diagnostics with the helper.
- [x] Patch the tracked JavaScript mirror.
- [x] Update focused tests to protect the stdout contract.

### Phase 3: Verification and Documentation

- [x] Run build, typechecks, Vitest, and MCP smoke probe.
- [x] Revert incidental launcher timestamp churn.
- [x] Create this 028 packet and detailed changelog.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Build | Shared package emitted output after source change. | `cd .opencode/skills/system-spec-kit/shared && npm run build` |
| Typecheck | Shared package and MCP server compile surface. | `cd .opencode/skills/system-spec-kit/shared && npm run typecheck`; `cd .opencode/skills/system-spec-kit/mcp_server && npm run typecheck` |
| Unit | Embedding auto-migration behavior. | `cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/embeddings-auto-migration.vitest.ts tests/local-llm-features/auto-migration.vitest.ts` |
| Integration smoke | MCP stdio JSON-RPC startup. | Direct line-delimited JSON-RPC probe |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Node/npm workspaces | Internal tooling | Green | Cannot verify build/typecheck. |
| Local llama-cpp provider path | Runtime config | Green for smoke probe | Startup may fall back to cloud provider behavior if environment changes. |
| Valid Voyage API key | External config | Yellow | `EMBEDDINGS_PROVIDER=auto` can still fail if it selects Voyage with an invalid key. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: stderr routing causes missing diagnostics or unexpected runtime failure.
- **Procedure**: Revert the three implementation files from this packet, rerun the same verification commands, and keep the changelog as the investigation record.
<!-- /ANCHOR:rollback -->
