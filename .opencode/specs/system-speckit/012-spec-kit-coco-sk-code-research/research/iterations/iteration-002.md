# Iteration 2 — Validator and Metadata Coverage

## Focus
Audited `system-spec-kit` validator and metadata script coverage, with emphasis on the default `validate.sh --strict` path, graph metadata shape checks, phase-parent metadata drift, and whether documented metadata requirements are enforced by the code that actually runs.

## Actions Taken
- Action 1: Reviewed iteration 1 and strategy Sections 3, 6-12 to avoid re-treading the surface-map findings.
- Action 2: Read `scripts/spec/validate.sh`, the default Node validation orchestrator, and the shell fallback rules `check-files.sh`, `check-template-headers.sh`, and `check-graph-metadata.sh`.
- Action 3: Read graph metadata and phase-parent test coverage around backfill, refresh, phase validation, template structure, and phase-parent pointer writes.
- Action 4: Ran a synthetic `/tmp` validation fixture with malformed `graph-metadata.json` to confirm the default Node path reports `GRAPH_METADATA_PRESENT` as pass when the file merely exists.
- Action 5: Compared validator behavior against docs in `AGENTS.md`, `references/validation/validation_rules.md`, `references/structure/phase_definitions.md`, and `references/workflows/quick_reference.md`.

## Findings

### system-spec-kit

### F-002-001 — Default validator does not parse graph metadata shape [P1]
`validate.sh` delegates to the Node validation orchestrator whenever `.opencode/skills/system-spec-kit/mcp_server/dist/lib/validation/orchestrator.js` or the TS fallback exists, then exits with that result at `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:839`-`.opencode/skills/system-spec-kit/scripts/spec/validate.sh:858` and `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:1019`. The Node orchestrator's graph check is only `fs.existsSync(path.join(folder, 'graph-metadata.json')) ? 'pass' : 'warn'` at `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts:355`-`.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts:366`.

The stronger shell rule parses JSON and requires top-level `schema_version`, `packet_id`, `spec_folder`, `parent_id`, `children_ids`, `manual`, and `derived` fields at `.opencode/skills/system-spec-kit/scripts/rules/check-graph-metadata.sh:27`-`.opencode/skills/system-spec-kit/scripts/rules/check-graph-metadata.sh:42`, but that rule is bypassed on the default path. A synthetic fixture with `{bad json` in `graph-metadata.json` still produced a default `GRAPH_METADATA_PRESENT` pass, so this is not only theoretical drift.

### F-002-002 — Default Node validator omits registry-owned phase rules [P1]
The shell registry declares `PHASE_LINKS`, `PHASE_PARENT_CONTENT`, and `GRAPH_METADATA_PRESENT` as runnable rules at `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json:107`-`.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json:169`, and `validation_rules.md` states that `validate.sh` delegates to the Node orchestrator by default at `.opencode/skills/system-spec-kit/references/validation/validation_rules.md:982`. The Node orchestrator, however, emits a fixed subset of entries at `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts:355`-`.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts:366`; it does not run `PHASE_LINKS` or `PHASE_PARENT_CONTENT`.

This creates visible test/docs drift: `test-phase-validation.js` expects `PHASE_LINKS` to appear as a warning for broken phase links at `.opencode/skills/system-spec-kit/scripts/tests/test-phase-validation.js:334`-`.opencode/skills/system-spec-kit/scripts/tests/test-phase-validation.js:339`, while the default orchestrator cannot produce that rule. The fix target is to either port these registry rules into the Node orchestrator or make `validate.sh` run both paths without double-counting.

### F-002-003 — Mandatory metadata is enforced only for phase parents [P2]
Repo instructions state that every Level 1+ spec folder must contain both `description.json` and `graph-metadata.json` at `AGENTS.md:282`. The default Node validator only adds `description.json` and `graph-metadata.json` to `FILE_EXISTS` when the detected level is `phase` at `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts:168`-`.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts:177`. The shell `check-files.sh` has the same phase-parent-only metadata branch at `.opencode/skills/system-spec-kit/scripts/rules/check-files.sh:44`-`.opencode/skills/system-spec-kit/scripts/rules/check-files.sh:52`.

That means ordinary Level 1/2/3 packets can pass `FILE_EXISTS` without `description.json`, and missing `graph-metadata.json` is only a warning through the default Node `GRAPH_METADATA_PRESENT` entry. This directly conflicts with the stated reason that folders without those files are invisible to memory search and graph traversal.

### F-002-004 — Phase-parent active-child pointer drift is not validated [P2]
The resume docs say a phase parent should redirect only when `derived.last_active_child_id` is non-null and `derived.last_active_at` parses as ISO-8601 within 24 hours; malformed, missing, or stale pointers should fall back to child listing at `.opencode/skills/system-spec-kit/references/workflows/quick_reference.md:468`-`.opencode/skills/system-spec-kit/references/workflows/quick_reference.md:474`. The structure docs also treat `children_ids`, `derived.last_active_child_id`, and `derived.last_active_at` as the phase-parent graph rollup at `.opencode/skills/system-spec-kit/references/structure/phase_definitions.md:79`-`.opencode/skills/system-spec-kit/references/structure/phase_definitions.md:99`.

The shell graph rule only type-checks optional `last_active_child_id` / `last_active_at` fields at `.opencode/skills/system-spec-kit/scripts/rules/check-graph-metadata.sh:38`-`.opencode/skills/system-spec-kit/scripts/rules/check-graph-metadata.sh:40`, and the default Node path does not parse them at all. Existing tests cover pointer writes and concurrent child saves at `.opencode/skills/system-spec-kit/scripts/tests/phase-parent-pointer.vitest.ts:61`-`.opencode/skills/system-spec-kit/scripts/tests/phase-parent-pointer.vitest.ts:124`, but not validator rejection or warning for a stale pointer, a malformed timestamp, or a pointer that is absent from `children_ids` / direct child folders.

## Questions Answered
- Q1: Partially answered. The highest validator drift found this iteration is default Node validation being weaker than the shell registry for graph metadata and phase-parent rules.
- Q2: Partially answered. There is test coverage for graph backfill, graph refresh, phase-parent pointer writes, and phase-validation expectations, but no default-path coverage proving `validate.sh --strict` rejects malformed graph metadata or stale phase-parent pointers.

## Questions Remaining
- Q1: Still open for system-spec-kit MCP tool docs and command-surface drift.
- Q2: Still open for `generate-context.js` coverage depth and whether canonical saves always refresh both metadata files under failure conditions.
- Q3: Still open; mcp-coco-index CLI/MCP parity and freshness behavior are planned for later iterations.
- Q4: Still open for live CocoIndex query/rank checks against `sk-code` resources.
- Q5: Still open for detailed sk-code OpenCode reference/assets gaps.
- Q6: Still open for `STACK_FOLDERS` and resource_map drift.
- Q7: Still open for cross-skill loading during `/speckit:complete`-style writes.

## Next Focus (for iteration 3)
Audit system-spec-kit MCP tool surface vs docs drift. Start with `mcp_server/tool-schemas.ts`, handler registration in `context-server.ts`, API exports under `mcp_server/api/`, and the workflow docs that name MCP tools. Prioritize tools whose docs imply validator, graph metadata, memory save, resume, or indexing behavior that the exposed schema/handler does not actually support.
