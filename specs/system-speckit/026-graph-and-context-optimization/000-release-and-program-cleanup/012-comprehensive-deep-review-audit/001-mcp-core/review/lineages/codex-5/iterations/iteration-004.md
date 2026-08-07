# Iteration 004 - Maintainability

Focus: save sub-handler boundaries, response wiring, and regression coverage.

## Findings

No new findings.

## Evidence Checked
- Save-path post-mutation feedback is centralized in `response-builder.ts`, while entity-density invalidation happens directly in `memory-save.ts` after commit. Evidence: `.opencode/skills/system-spec-kit/mcp_server/handlers/save/response-builder.ts:625`, `.opencode/skills/system-spec-kit/mcp_server/handlers/save/response-builder.ts:630`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2703`.
- Atomic save wraps pending-file promotion and index failure rollback in a spec-folder lock. Evidence: `.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:319`, `.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:360`, `.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:378`, `.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:394`.
- Save/create record identity and same-path matching are factored into `create-record.ts` with explicit scope filters. Evidence: `.opencode/skills/system-spec-kit/mcp_server/handlers/save/create-record.ts:96`, `.opencode/skills/system-spec-kit/mcp_server/handlers/save/create-record.ts:199`, `.opencode/skills/system-spec-kit/mcp_server/handlers/save/create-record.ts:245`.
- Existing entity-density integration coverage tests save and bulk-delete invalidation, but not update invalidation. Evidence: `.opencode/skills/system-spec-kit/mcp_server/tests/integration/entity-density-commit-hooks.vitest.ts:79`, `.opencode/skills/system-spec-kit/mcp_server/tests/integration/entity-density-commit-hooks.vitest.ts:102`, `.opencode/skills/system-spec-kit/mcp_server/tests/README.md:83`.

## Maintainability Notes
- The save sub-handler split is coherent and did not produce a separate maintainability finding.
- F001 should add a targeted `memory_update` regression because existing entity-density commit-hook coverage demonstrates the exact cache behavior but omits the update entry point.
- F004 is a small API-surface cleanup candidate: unused public options make maintenance harder because callers can develop expectations that code does not honor.

Review verdict: PASS
