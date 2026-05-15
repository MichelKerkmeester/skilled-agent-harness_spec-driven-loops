---
title: "Implementation Summary: MCP Startup Stdio Fix [system-spec-kit/028-mcp-startup-stdio-fix/implementation-summary]"
description: "mk-spec-memory startup now keeps MCP stdout protocol-clean by sending embedding auto-migration diagnostics to stderr."
trigger_phrases:
  - "mk-spec-memory startup"
  - "mcp stdio fix"
  - "auto migration diagnostics"
  - "028"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-mcp-startup-stdio-fix"
    last_updated_at: "2026-05-15T20:15:00Z"
    last_updated_by: "codex"
    recent_action: "Completed MCP startup stdio fix and changelog packet"
    next_safe_action: "No code follow-up required; rotate invalid Voyage key if cloud embeddings are desired"
    blockers: []
    key_files: ["implementation-summary.md", "changelog/changelog-028-root.md"]
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 028-mcp-startup-stdio-fix |
| **Completed** | 2026-05-15 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`mk-spec-memory` now starts cleanly over MCP stdio without embedding auto-migration diagnostics corrupting JSON-RPC output. The fix keeps the diagnostic text visible on stderr while preserving stdout for protocol frames only, which is the constraint that mattered for Codex MCP startup.

### Stdio-Safe Auto-Migration Diagnostics

The embedding factory now uses `logAutoMigrationDiagnostic()` for auto-migration status messages. That helper writes to `process.stderr`, so messages such as `AUTO_MIGRATION_SKIP`, `AUTO_MIGRATION_START`, and `AUTO_MIGRATION_COMPLETE` no longer pass through `console.info` and no longer appear on stdout.

The tracked JavaScript mirror was patched with the same behavior so runtime surfaces do not drift from the TypeScript source.

### Regression Coverage

The auto-migration Vitest suite now spies on `process.stderr.write` and preserves a `console.info` spy to prove the successful migration diagnostic moved away from stdout. This is narrow coverage, but it protects the exact transport boundary that failed.

### Detailed Changelog

The requested closeout changelog lives at `changelog/changelog-028-root.md`. It records the investigation timeline, the two distinct failure modes, the code patch, verification commands, and the remaining provider-key caveat.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts` | Modified | Route auto-migration diagnostics to stderr. |
| `.opencode/skills/system-spec-kit/shared/embeddings/factory.js` | Modified | Keep the tracked JS mirror aligned. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embeddings-auto-migration.vitest.ts` | Modified | Assert diagnostics use stderr and avoid `console.info`. |
| `specs/system-spec-kit/028-mcp-startup-stdio-fix/` | Created | Store this packet and detailed changelog. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The investigation started with a direct launcher run, then moved to log review and a hand-rolled JSON-RPC smoke probe. The evidence showed that the active failure was stdout contamination, not server initialization itself. The implementation touched only the diagnostic call sites and the focused regression test, then the same startup path was smoke-tested again.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Move diagnostics to stderr instead of suppressing them | Operators still need migration visibility, but MCP clients cannot safely parse human-readable stdout lines. |
| Leave provider auto-selection behavior unchanged | The invalid Voyage key failure is configuration-specific and separate from the stdio transport bug. |
| Patch the tracked JS mirror manually | The repository tracks both source and mirror files, and runtime behavior must stay aligned. |
| Use a smoke probe after tests | Typechecks and unit tests cannot prove stdout framing stays parseable during MCP startup. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `cd .opencode/skills/system-spec-kit/shared && npm run build` | PASS |
| `cd .opencode/skills/system-spec-kit/shared && npm run typecheck` | PASS |
| `cd .opencode/skills/system-spec-kit/mcp_server && npm run typecheck` | PASS |
| `cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/embeddings-auto-migration.vitest.ts tests/local-llm-features/auto-migration.vitest.ts` | PASS |
| Direct MCP line-delimited JSON-RPC smoke probe | PASS - `mcp_smoke: tools=39 parse_failures=0` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Invalid provider credentials can still fail startup.** If `EMBEDDINGS_PROVIDER=auto` selects Voyage and `VOYAGE_API_KEY` is invalid, the provider validation can still stop startup. This packet fixes stdio framing, not cloud credential health.
2. **The smoke probe covers the observed startup path.** It proves the current local-provider startup path no longer emits parse-breaking stdout diagnostics, but future startup log additions should keep the same stdout rule.
<!-- /ANCHOR:limitations -->
