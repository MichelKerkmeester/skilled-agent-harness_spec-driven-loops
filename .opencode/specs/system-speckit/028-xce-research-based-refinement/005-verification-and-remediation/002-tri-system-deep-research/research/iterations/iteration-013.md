# Iteration 013 — Angle 13

**Angle:** Save-path parity: generate-context.js full save vs memory_save MCP vs CLI front door — divergence in scrubbing, provenance, metadata refresh.

**Summary:** The CLI front door is genuinely a thin transport over the MCP tool, so it inherits `memory_save` behavior. The real parity gaps are that generate-context is documented as a full canonical save but currently applies no continuity content, while direct `memory_save`/CLI indexing lacks metadata-refresh and generate-context lacks the fail-closed secret scrubber.

**Findings kept:** 3

## [P1][BROKEN-FEATURE] generate-context no longer applies continuity content

- Evidence: .opencode/skills/system-spec-kit/scripts/core/workflow.ts:1478-1490 says the legacy artifact was retired and canonical saves are owned elsewhere; .opencode/skills/system-spec-kit/scripts/core/workflow.ts:1577-1589 initializes writtenFiles as empty and proceeds only to metadata tracking; .opencode/skills/system-spec-kit/scripts/core/workflow.ts:1817-1822 returns writtenFiles and memoryId without any canonical doc write. Docs still claim apply behavior in .opencode/commands/memory/save.md:28,38,53.
- Detail: The workflow builds session-derived values but does not persist the session content into implementation-summary.md, decision-record.md, handover.md, or another canonical continuity doc. This makes the full-save path materially different from the documented `/memory:save` apply contract.
- Fix sketch: Restore a content-router/apply step in generate-context or update the command/docs to state that this path is metadata/index-refresh only.

## [P1][DOC-DRIFT] memory_save and CLI do not refresh packet metadata

- Evidence: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3109-3129 only checks whether description.json/graph-metadata.json exist; .opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3520-3531 indexes the requested file; .opencode/skills/system-spec-kit/mcp_server/spec-memory-cli.ts:975-981 dispatches the same validated tool to the daemon. The metadata refresh exists only in generate-context workflow at .opencode/skills/system-spec-kit/scripts/core/workflow.ts:1589-1705, while README.md:87 and ENV_REFERENCE.md:189 claim canonical saves refresh metadata.
- Detail: Direct MCP `memory_save` is a single-file indexing path, and the CLI front door inherits exactly that behavior. Operators following docs that suggest using the MCP path while a daemon is running will not get description/graph metadata freshness parity.
- Fix sketch: Either add a shared metadata-refresh follow-up to `memory_save` for spec docs or narrow the documentation to distinguish `/memory:save` command apply from direct `memory_save` indexing.

## [P0][BUG] generate-context lacks the fail-closed secret scrubber used by memory_save

- Evidence: .opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:271-282 scrubs secrets before content hash/indexing; .opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3638-3651 scrubs before atomic durable saves. In contrast, generate-context derives slug candidates from raw session fields at .opencode/skills/system-spec-kit/scripts/core/workflow.ts:1403-1425 and writes the derived filename into description.json memoryNameHistory at .opencode/skills/system-spec-kit/scripts/core/workflow.ts:1635-1646; slugification only normalizes characters at .opencode/skills/system-spec-kit/scripts/utils/slug-utils.ts:53-60 and :104-106.
- Detail: A structured JSON save whose summary/title contains a token can feed that value into `rawCtxFilename` and then persist it in `description.json` without the MCP secret scrubber. The direct `memory_save` path is fail-closed, but the generate-context path is not.
- Fix sketch: Run `scrubSecretsDetailed` over structured save inputs before title/slug/metadata derivation and abort on scrubber errors, matching the MCP write path.
