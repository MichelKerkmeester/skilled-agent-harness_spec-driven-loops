---
title: "Changelog: MCP Startup Stdio Fix [system-spec-kit/028-mcp-startup-stdio-fix/root]"
description: "Detailed closeout changelog for the mk-spec-memory MCP startup fix."
trigger_phrases:
  - "mk-spec-memory startup changelog"
  - "mcp stdout contamination fix"
  - "AUTO_MIGRATION_SKIP"
  - "028"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v2.2 -->

## 2026-05-15

> Spec folder: `specs/system-spec-kit/028-mcp-startup-stdio-fix` (Level 1)

### Summary

Fixed `mk-spec-memory` MCP startup by keeping human-readable embedding auto-migration diagnostics off stdout. The server was able to initialize, but the MCP client handshake could fail because `AUTO_MIGRATION_SKIP: no hf-local source store with rows` was emitted to stdout, where the client expected only JSON-RPC protocol frames.

The investigation also found an earlier separate failure: `EMBEDDINGS_PROVIDER=auto` selected Voyage when `VOYAGE_API_KEY` was present, then failed because the key was invalid or unauthorized. That provider-key issue explains an older fatal startup log, but the active reproducible failure after local llama-cpp startup was stdout contamination.

### Investigation Timeline

- Started by reproducing `mk-spec-memory` startup from the launcher. Direct startup reached normal server initialization, which pointed away from a basic Node/runtime crash.
- Read MCP server logs and found an older fatal provider validation path: auto provider selection chose Voyage because `VOYAGE_API_KEY` existed, then Voyage rejected the key as invalid or unauthorized.
- Checked the later startup path and saw the server initialize with llama-cpp and reach `Context MCP server running on stdio` before the client terminated it.
- Ran a direct line-delimited JSON-RPC probe against the stdio server. The probe found a non-JSON stdout line: `AUTO_MIGRATION_SKIP: no hf-local source store with rows`.
- Matched that line back to embedding auto-migration diagnostics in the shared embedding provider factory.
- Confirmed the transport rule: stdio MCP servers must reserve stdout for JSON-RPC frames. Human-readable diagnostics belong on stderr.

### Added

- Added `logAutoMigrationDiagnostic(message)` in `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts`.
- Added the same helper in `.opencode/skills/system-spec-kit/shared/embeddings/factory.js` to keep the tracked runtime mirror aligned.
- Added stderr spying in `.opencode/skills/system-spec-kit/mcp_server/tests/embeddings-auto-migration.vitest.ts`.
- Added this closeout packet under `specs/system-spec-kit/028-mcp-startup-stdio-fix/`.

### Changed

- Changed `AUTO_MIGRATION_SKIP` diagnostics from `console.info(...)` to stderr writes.
- Changed `AUTO_MIGRATION_START` diagnostics from `console.info(...)` to stderr writes.
- Changed auto-migration progress callback diagnostics from `console.info(...)` to stderr writes.
- Changed `AUTO_MIGRATION_COMPLETE` diagnostics from `console.info(...)` to stderr writes.
- Updated the successful auto-migration test expectation from stdout logging to stderr logging.

### Fixed

- Fixed MCP startup stdout contamination from embedding auto-migration diagnostics.
- Fixed the regression gap where tests allowed migration diagnostics to be emitted through `console.info`.
- Fixed mirror drift risk by patching both `factory.ts` and `factory.js`.

### Verification

- `cd .opencode/skills/system-spec-kit/shared && npm run build` - PASS.
- `cd .opencode/skills/system-spec-kit/shared && npm run typecheck` - PASS.
- `cd .opencode/skills/system-spec-kit/mcp_server && npm run typecheck` - PASS.
- `cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/embeddings-auto-migration.vitest.ts tests/local-llm-features/auto-migration.vitest.ts` - PASS.
- Direct MCP line-delimited JSON-RPC smoke probe - PASS: `mcp_smoke: tools=39 parse_failures=0`.
- Incidental `.mk-spec-memory-launcher.json` timestamp churn was reverted so the patch only contains source, test, and packet documentation changes.

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts` | Added a stderr diagnostic helper and routed auto-migration diagnostic messages through it. |
| `.opencode/skills/system-spec-kit/shared/embeddings/factory.js` | Mirrored the TypeScript diagnostic routing in the tracked JavaScript file. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embeddings-auto-migration.vitest.ts` | Added a `process.stderr.write` spy and asserted successful migration diagnostics no longer call `console.info`. |
| `specs/system-spec-kit/028-mcp-startup-stdio-fix/spec.md` | Documented the problem, scope, requirements, success criteria, and risks for the fix. |
| `specs/system-spec-kit/028-mcp-startup-stdio-fix/plan.md` | Captured the implementation plan, affected surfaces, and verification strategy. |
| `specs/system-spec-kit/028-mcp-startup-stdio-fix/tasks.md` | Recorded completed investigation, implementation, verification, and changelog tasks. |
| `specs/system-spec-kit/028-mcp-startup-stdio-fix/implementation-summary.md` | Summarized what changed, why it matters, decisions, verification, and limitations. |
| `specs/system-spec-kit/028-mcp-startup-stdio-fix/changelog/changelog-028-root.md` | Added this detailed closeout changelog. |

### Operational Notes

- The fix protects MCP stdio framing. It does not make an invalid `VOYAGE_API_KEY` valid.
- If cloud embeddings are desired, rotate or correct the Voyage key before relying on `EMBEDDINGS_PROVIDER=auto`.
- If local embeddings are desired, keep the environment on the local provider path so auto-selection does not choose an unavailable cloud provider.
- Future startup diagnostics in stdio MCP servers should use stderr unless they are JSON-RPC protocol messages.

### Follow-Ups

- No code follow-up is required for the observed stdio startup failure.
- Optional environment cleanup: remove or rotate the invalid Voyage API key if auto provider selection should not hit the cloud provider.
