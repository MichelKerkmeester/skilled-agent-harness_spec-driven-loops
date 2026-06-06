# Iteration 016

## Dimension

Traceability - playbook capability for EX-037..EX-042. Focus: do scenario preconditions map to actually supported tool surfaces, flags, schemas, and runtime entry points?

## Files Reviewed

- `.opencode/skills/sk-code-review/references/review_core.md:18` - severity and evidence doctrine.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/review/deep-review-config.json:104` - review scope file list.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/review/deep-review-findings-registry.json:185` - prior EX-039 finding, used to avoid duplicate reporting.
- `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:769` - EX-037 root scenario entry.
- `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:782` - EX-038 root scenario entry.
- `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:795` - EX-039 root scenario entry.
- `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:808` - EX-040 root scenario entry.
- `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:821` - EX-041 root scenario entry.
- `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:834` - EX-042 root scenario entry.
- `.opencode/skills/system-spec-kit/manual_testing_playbook/05--lifecycle/checkpoint-v2-file-snapshot-roundtrip.md:35` - EX-037 `includeEmbeddings:true` create command.
- `.opencode/skills/system-spec-kit/manual_testing_playbook/05--lifecycle/checkpoint-v2-file-snapshot-roundtrip.md:71` - EX-037 scratch restore command.
- `.opencode/skills/system-spec-kit/manual_testing_playbook/04--maintenance/post-insert-enrichment-lifecycle-v30.md:38` - EX-038 save/status command surface.
- `.opencode/skills/system-spec-kit/manual_testing_playbook/04--maintenance/index-scan-phased-async-refinements.md:38` - EX-039 scan/search command surface.
- `.opencode/skills/system-spec-kit/manual_testing_playbook/14--pipeline-architecture/front-proxy-reconnect-and-backend-only.md:45` - EX-040 proxy/backend command surface.
- `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/sk-git-worktree-convention.md:40` - EX-041 worktree command surface.
- `.opencode/skills/system-spec-kit/manual_testing_playbook/05--lifecycle/checkpoint-v2-needs-rebuild-self-heal.md:40` - EX-042 boot/scan command surface.
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:28` - strict schema mode default.
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:342` - strict `checkpoint_create` runtime schema.
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:565` - allowed runtime parameters for `checkpoint_create`.
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:349` - human-facing `checkpoint_create` schema docs.
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:384` - `checkpoint_restore` human-facing schema.
- `.opencode/skills/system-spec-kit/mcp_server/tools/checkpoint-tools.ts:32` - MCP dispatcher validates tool args before calling checkpoint handlers.
- `.opencode/skills/system-spec-kit/mcp_server/tools/types.ts:228` - exposed `CheckpointCreateArgs` type.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/checkpoints.ts:376` - checkpoint create handler.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/checkpoints.ts:497` - checkpoint restore handler.
- `.opencode/skills/system-spec-kit/mcp_server/core/config.ts:67` - DB path environment overrides.
- `.opencode/skills/system-spec-kit/mcp_server/core/README.md:80` - DB path environment boundary.
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2126` - `SPECKIT_BACKEND_ONLY` runtime flag.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:351` - scan lease acquisition.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:383` - checkpoint sentinel repair during scan.
- `.opencode/skills/sk-git/SKILL.md:207` - sk-git worktree ask-first precondition.
- `.opencode/skills/sk-git/references/worktree_workflows.md:153` - numbered worktree command support.

## Findings by Severity

### P0

None.

### P1

#### R16-P1-001 - EX-037 requires `includeEmbeddings`, but the strict MCP surface rejects that parameter

- File: `.opencode/skills/system-spec-kit/manual_testing_playbook/05--lifecycle/checkpoint-v2-file-snapshot-roundtrip.md:35`
- Claim: EX-037 cannot run its first documented MCP command as written through the normal tool dispatcher because it calls `checkpoint_create(name, includeEmbeddings:true)`, while the strict runtime validation schema for `checkpoint_create` omits `includeEmbeddings`.
- Evidence: EX-037 asks the operator to validate `checkpoint_create(name, includeEmbeddings:true)` and repeats the command in the command list. The MCP dispatcher validates with `validateToolArgs('checkpoint_create', args)` before invoking the handler. Strict schemas are the default (`SPECKIT_STRICT_SCHEMAS !== 'false'`), and the runtime `checkpointCreateSchema` only accepts `name`, `specFolder`, `tenantId`, `userId`, `agentId`, and `metadata`; the allowed-parameter list likewise excludes `includeEmbeddings`. The exposed `CheckpointCreateArgs` type in `tools/types.ts` also lacks the property.
- Evidence refs: `.opencode/skills/system-spec-kit/manual_testing_playbook/05--lifecycle/checkpoint-v2-file-snapshot-roundtrip.md:35`, `.opencode/skills/system-spec-kit/manual_testing_playbook/05--lifecycle/checkpoint-v2-file-snapshot-roundtrip.md:40`, `.opencode/skills/system-spec-kit/mcp_server/tools/checkpoint-tools.ts:32`, `.opencode/skills/system-spec-kit/mcp_server/tools/checkpoint-tools.ts:34`, `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:28`, `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:342`, `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:348`, `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:565`, `.opencode/skills/system-spec-kit/mcp_server/tools/types.ts:228`, `.opencode/skills/system-spec-kit/mcp_server/tools/types.ts:235`
- Counterevidence sought: I checked whether another public schema, type, or dispatcher path accepts the parameter. `tool-schemas.ts` documents `includeEmbeddings`, and direct handler tests pass `includeEmbeddings:false`, but that is counterevidence only for the direct handler seam; it does not override the normal MCP dispatcher validation boundary.
- Alternative explanation: The playbook may have intended to rely on the default `includeEmbeddings:true` behavior instead of passing the flag explicitly. If so, the scenario text is stale rather than the handler implementation being unable to create embedding-inclusive checkpoints.
- Final severity: P1.
- Confidence: 0.94.
- Downgrade trigger: Downgrade to P2 or resolved if `checkpointCreateSchema`, `ALLOWED_PARAMETERS.checkpoint_create`, and the exported tool args are updated to include `includeEmbeddings`, or if EX-037 removes the explicit flag and documents that unscoped checkpoint creation uses the default embedding-inclusive path.
- Finding class: `matrix/evidence`.
- Scope proof: Exact searches for `includeEmbeddings`, direct reads of dispatcher, schema, type, docs, handler, and tests show the split is at the MCP boundary only.
- Affected surface hints: `manual_testing_playbook`, `checkpoint_create MCP schema`, `checkpoint dispatcher`, `checkpoint handler docs`.
- Recommendation: Align the runtime schema/type with `tool-schemas.ts` and the handler, or rewrite EX-037 to omit `includeEmbeddings:true` and cite the default behavior.

#### R16-P1-002 - EX-037 says to restore into a scratch copy, but `checkpoint_restore` has no per-call scratch DB target

- File: `.opencode/skills/system-spec-kit/manual_testing_playbook/05--lifecycle/checkpoint-v2-file-snapshot-roundtrip.md:71`
- Claim: EX-037's destructive restore round-trip cannot be run safely as written because the command sequence says to copy the live DB to a scratch path and then run `checkpoint_restore(name)` "against the scratch copy", but the supported `checkpoint_restore` MCP surface has no `databasePath`, `dbDir`, or scratch-target parameter. A normal call restores the active runtime database selected at server startup.
- Evidence: EX-037 marks the scenario sandbox-only and says the restore must never touch production, then lists `checkpoint_restore(name:<checkpoint-name>) against the scratch copy`. The public restore schema only accepts `name`, `tenantId`, `userId`, `agentId`, and `clearExisting`. The runtime allowed-parameter list matches those fields. The handler extracts only `name`, `clearExisting`, and scope before calling `checkpoints.restoreCheckpoint(name, clear_existing, scope)`. The supported way to change the active database is startup/environment path resolution (`SPEC_KIT_DB_DIR`, `SPECKIT_DB_DIR`, or `MEMORY_DB_PATH`), not a restore-tool argument; EX-037 does not include a precondition to launch a sandbox MCP server with those overrides before the restore call.
- Evidence refs: `.opencode/skills/system-spec-kit/manual_testing_playbook/05--lifecycle/checkpoint-v2-file-snapshot-roundtrip.md:14`, `.opencode/skills/system-spec-kit/manual_testing_playbook/05--lifecycle/checkpoint-v2-file-snapshot-roundtrip.md:66`, `.opencode/skills/system-spec-kit/manual_testing_playbook/05--lifecycle/checkpoint-v2-file-snapshot-roundtrip.md:71`, `.opencode/skills/system-spec-kit/manual_testing_playbook/05--lifecycle/checkpoint-v2-file-snapshot-roundtrip.md:72`, `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:384`, `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:395`, `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:359`, `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:364`, `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:567`, `.opencode/skills/system-spec-kit/mcp_server/handlers/checkpoints.ts:518`, `.opencode/skills/system-spec-kit/mcp_server/handlers/checkpoints.ts:549`, `.opencode/skills/system-spec-kit/mcp_server/core/config.ts:67`, `.opencode/skills/system-spec-kit/mcp_server/core/config.ts:90`, `.opencode/skills/system-spec-kit/mcp_server/core/README.md:80`
- Counterevidence sought: I checked for an alternate restore flag or path argument in the human-facing schema, strict Zod schema, allowed-parameter list, tool args type, and restore handler. I found DB path overrides, but only as environment/startup configuration, not as a `checkpoint_restore` call option.
- Alternative explanation: The scenario author may have assumed "against the scratch copy" implies starting a separate MCP runtime pointed at the copied DB. That is a valid operator strategy, but it is not stated in the test execution steps and cannot be inferred from the `checkpoint_restore` command itself.
- Final severity: P1.
- Confidence: 0.91.
- Downgrade trigger: Downgrade to P2 or resolved if EX-037 adds an explicit precondition such as "start a separate sandbox MCP server with `SPEC_KIT_DB_DIR`/`SPECKIT_DB_DIR` or `MEMORY_DB_PATH` pointed at the scratch copy before invoking `checkpoint_restore`", or if the restore tool gains a validated scratch-target parameter.
- Finding class: `cross-consumer`.
- Scope proof: Direct reads covered the restore playbook text, public schema, strict schema, allowed-parameter list, dispatcher path, restore handler, and DB path resolution docs. No per-call scratch target exists in the supported restore surface.
- Affected surface hints: `manual_testing_playbook`, `checkpoint_restore MCP schema`, `database path configuration`, `sandbox restore safety`.
- Recommendation: Add a concrete sandbox-runtime startup step to EX-037 before the restore command, or add a validated restore target parameter if per-call scratch restore is intended.

### P2

None.

## Traceability Checks

- `EX-037 checkpoint_create_surface`: Finding `R16-P1-001`. The documented `includeEmbeddings:true` precondition reaches an unsupported strict-schema parameter at the normal MCP boundary.
- `EX-037 scratch_restore_surface`: Finding `R16-P1-002`. The documented restore command does not bind the restore to a scratch DB through any supported per-call tool flag.
- `EX-038 enrichment_marker_lifecycle`: Deferred as an underspecified operator setup detail, not elevated to a new finding in this pass. `memory_save` and `memory_index_scan` are supported surfaces, and production repair/backfill code exists, but the playbook's row-status read and incomplete-marker setup rely on DB/operator access that is not spelled out as a tool command.
- `EX-039 index_scan_surface`: Ruled out for new findings in this slice. `memory_index_scan` supports `force`; the handler acquires a lease, reports `complete_with_pending_vectors` / `pendingVectors`, includes `moveReconciled`, and carries `checkpointRepair` in the response. The prior active finding `R9-P1-001` already covers EX-039 move-reconciliation overstatement.
- `EX-040 front_proxy_backend_only_surface`: Ruled out for new findings. `SPECKIT_BACKEND_ONLY=1` is documented and implemented as a server boot guard before stdio connection; prior iterations already covered README/ENV drift for this surface.
- `EX-041 sk_git_worktree_surface`: Ruled out for new findings. The worktree command and numbered branch/directory convention are supported by sk-git references. The scenario remains operator-mediated and must honor sk-git ask-first rules before executing git writes.
- `EX-042 needs_rebuild_surface`: Ruled out for new findings. Boot repair and scan-lease repair entry points exist, and `memory_index_scan` surfaces the checkpoint repair counts in its response.
- `graph_status`: Graphless fallback. This pass used exact search and direct reads because the assigned slice was explicit scenario-to-schema traceability.

## SCOPE VIOLATIONS

None. No reviewed files, shared review state, registry, or strategy files were modified.

## Verdict

CONDITIONAL. This iteration found two new P1 playbook-capability gaps in EX-037. Both are traceability defects that make the scenario unsafe or non-runnable as written through the supported MCP surface.

## Next Dimension

Continue traceability fix-verification for EX-037 after the checkpoint schema/playbook alignment is patched, or proceed to synthesis with these P1s active.

Review verdict: CONDITIONAL
