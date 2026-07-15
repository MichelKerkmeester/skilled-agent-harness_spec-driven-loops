# Iteration 7 - Deep Exhaustive Residue Sweep

## Dimensions Covered
- traceability
- maintainability

## Files Reviewed
- `.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md:29,48,287,291,307,323`
- `.opencode/bin/lib/sidecar-env-allowlist.cjs:17`
- `.opencode/skills/system-code-graph/references/runtime/tool_surface.md:84-86,115`
- `.opencode/skills/system-code-graph/README.md:343`
- `.opencode/skills/system-code-graph/SKILL.md:160,291,404`
- `.opencode/skills/system-spec-kit/references/memory/embedder_pluggability.md:189,230,238-244,297-299,319-321,330,365`
- `.opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts:17,92,98,175,405-406,529-530`
- `.opencode/skills/system-spec-kit/scripts/tests/process-sweep.vitest.ts:141,146,153`
- `.opencode/skills/system-spec-kit/scripts/tests/process-memory-harness.vitest.ts:20-21,38,71-72`
- `.opencode/skills/cli-codex/SKILL.md:357`
- `.opencode/skills/cli-claude-code/SKILL.md:350`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/context-preservation/250-session-start-startup.md:20,23,143`

## Findings

### P0
- none

### P1
- **F010**: Stale feature catalog claims deleted `07--ccc-integration` directory — `.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md:29,48,287,291,307,323` — The catalog claims 3 features in `07--ccc-integration/` (lines 48, 287, 291, 307, 323) with TOC entry (line 29), but the directory does not exist. Lines 287, 291, 323 reference the deleted `ccc` binary and tools. This is analogous to F008 found in iter-6 for the code-graph catalog. Recommendation: Remove the `07--ccc-integration` section entirely (TOC entry + 3 feature entries) or replace with a deprecation note.

- **F011**: Misleading tool handler references to deleted `lib/ccc/` paths — `.opencode/skills/system-code-graph/references/runtime/tool_surface.md:84-86,115` — Lines 84-86 claim tools route to `lib/ccc/` (deleted in 002), and line 115 references deleted `ccc_bridge_integration.md`. The actual handlers are `lib/scan/`, `lib/status/`, `lib/verify/` per the code-graph tree-sitter architecture. Recommendation: Update handler map to reflect actual tree-sitter paths and remove the deleted integration doc reference.

- **F012**: Dead cross-references to deleted `ccc_bridge_integration.md` — `.opencode/skills/system-code-graph/README.md:343`, `.opencode/skills/system-code-graph/SKILL.md:160,291,404` — Three files reference the deleted integration doc. The integration doc does not exist (`integrations/` directory is gone). Recommendation: Remove these cross-references or replace with a note about the 002 decouple.

### P2
- **F013**: Vestigial `RERANK_` env prefix in sidecar allowlist — `.opencode/bin/lib/sidecar-env-allowlist.cjs:17` — The `RERANK_` prefix (line 17) is dead since the rerank sidecar was deleted in 014. This file itself may be vestigial since no sidecar exists to consume the allowlist. Recommendation: Remove the `RERANK_` prefix and evaluate whether the entire file is still needed (no active sidecar consumers).

- **F014**: Obsolete ccc path reference in session-start testing playbook — `.opencode/skills/system-spec-kit/manual_testing_playbook/context-preservation/250-session-start-startup.md:20,23,143` — Lines 20, 23, 143 reference `.opencode/skills/system-code-graph/mcp_server/.venv/bin/ccc` which no longer exists (tree-sitter has no venv/ccc). Recommendation: Update to reflect tree-sitter readiness check or remove the ccc-specific assertion.

## Confirmed-Clean Surfaces
- **feature_catalog in other skills**: deep-agent-improvement, deep-ai-council, deep-loop-runtime, deep-research, deep-review catalogs contain no coco/ccc/rerank references (grepped with case-insensitive patterns).
- **.opencode/bin/ launcher libs**: mk-code-index-launcher.cjs, mk-skill-advisor-launcher.cjs, mk-spec-memory-launcher.cjs, launcher-ipc-bridge.cjs contain no coco/ccc/rerank/8765 residue (only sidecar-env-allowlist.cjs has the dead RERANK_ prefix).
- **references/ docs (excl changelog)**: No misleading "enable the sidecar" or "use CocoIndex" instructions found. The only cocoindex reference is in embedder_pluggability.md:189 with a clear deprecation banner (documented exception).
- **Exhaustive alias grep**: No NEW live refs found beyond documented exceptions:
  - `cocoindex`: Only in embedder_pluggability.md:189 (bannered exception), process-memory-harness.ts (documented exception), F-AC3 fixtures (documented exception), 409-fixture (documented exception), benchmark data (historical).
  - `mcp__cocoindex_code`: No matches.
  - `ccc_status`, `ccc_reindex`, `ccc_feedback`: No matches in skills/commands.
  - `rerank_sidecar`: Only in process-memory-harness.ts, process-sweep.vitest.ts, process-memory-harness.vitest.ts (documented exceptions), benchmark reports (historical).
  - `8765`: Only in benchmark reports (historical).
  - `SPECKIT_CROSS_ENCODER`: Extensive references in feature_catalog.md and benchmarks, but SKILL.md:422 explicitly documents the flag as "no longer wired" post-014 (documented exception).
  - `ccc ` (bare): Only in embedder_pluggability.md (bannered exception), process-memory-harness.ts (documented exception), cli-* SKILL.md pkill references (documented exception), system-code-graph feature_catalog (F010), and tool_surface.md (F011).

## Claim Adjudication
- F008 (iter-6): claim "system-code-graph feature_catalog still claims a deleted 07--ccc-integration dir + ccc tools"; evidence `.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md:29,48,287,291,307,323`; counterevidence sought "maybe the directory exists with different content"; alternative "directory might be empty or renamed"; finalSeverity P1; confidence 1.00. CONFIRMED: The directory does not exist (glob returned no files), and the catalog claims 3 features in it with TOC entry.

- F009 (iter-6): claim "sidecar-env-allowlist.cjs:17 dead RERANK_ env prefix"; evidence `.opencode/bin/lib/sidecar-env-allowlist.cjs:17`; counterevidence sought "maybe RERANK_ is still used by other consumers"; alternative "prefix might be for future use"; finalSeverity P2; confidence 0.95. CONFIRMED: The rerank sidecar was deleted in 014, and no other consumers use RERANK_ prefix (grepped skills/commands). The file itself may be vestigial.

## Next Focus
Synthesis if exhausted, OR remaining gap. This iteration found 4 NEW findings (F010-F013) across the analogous surfaces to iter-6, confirming the pattern that deeper digging finds more residue. The exhaustive alias grep confirmed no NEW live refs beyond documented exceptions. The remaining gap is the feature_catalog residue (F010) and the misleading handler references (F011-F012) which are traceability/maintainability issues.

Review verdict: FAIL