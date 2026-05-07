# Iteration 1 - Issue A - Default Scope Policy + SPECKIT_CODE_GRAPH_INDEX_SKILLS Verification

## METADATA
- Iteration: 1 / 10
- Date: 2026-05-06
- Executor: cli-codex (gpt-5.5, high, fast)
- Focus dimension: 1 - Issue A - default scope policy + SPECKIT_CODE_GRAPH_INDEX_SKILLS verification

## INVESTIGATION
Read the research charter, native-rerun synthesis, and native trial log for the code graph failure chain. Traced the scope-policy path from `handlers/scan.ts` into `lib/index-scope-policy.ts`, `lib/indexer-types.ts`, `lib/utils/index-scope.ts`, `lib/structural-indexer.ts`, `lib/code-graph-db.ts`, public docs, env reference, and scan/schema tests.

The focus was whether the default policy and `SPECKIT_CODE_GRAPH_INDEX_SKILLS` opt-in are safe enough for maintainers working on Spec Kit internals. The native trial already verified the behavioral failure: an `includeSkills:true` scan populated 56,843 nodes, a default-scope scan then returned `totalNodes:0`, and later `includeSkills:true` recovery still returned zero nodes.

## FINDINGS
- P0 `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:14` - The default scope deliberately excludes `.opencode/skills/**`, `.opencode/agents/**`, `.opencode/commands/**`, `.opencode/specs/**`, and `.opencode/plugins/**`, which means the repo's active Spec Kit implementation tree is outside the default scan; recommended remediation: make scan scope active-root aware for `.opencode/skills/system-spec-kit/**` work, or block/warn loudly when default scope would index zero nodes for an internal-maintainer CWD.
- P1 `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:75` - `SPECKIT_CODE_GRAPH_INDEX_SKILLS` parsing silently converts any non-empty value that is neither `true`, `false`, nor a valid `sk-*` CSV into `none`; recommended remediation: validate env values and surface invalid tokens as scan warnings or errors instead of silently disabling skill indexing.
- P2 `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:493` - Per-call `includeSkills` validates only the `sk-*` name shape, and the shared parser similarly normalizes by regex only; a syntactically valid but nonexistent skill name can remove the broad skill exclude while matching no skill content; recommended remediation: verify selected skill folders exist and report unmatched selections before persisting scan scope.

## EVIDENCE
Native-rerun evidence:

```text
N-CG-001 first_scan_includeSkills_true: filesIndexed=9280 totalNodes=56843 totalEdges=36347.
N-CG-005 second_scan_default_scope: totalNodes=0 previousTotalNodes=56843 parserCrashCount=10.
N-CG-007 third_scan_includeSkills_true_recovery: totalNodes=0 totalEdges=764 parserCrashCount=10.
```

Default scope excludes are declared in `index-scope-policy.ts`:

```text
14-20 CODE_GRAPH_DEFAULT_EXCLUDE_GLOBS includes skill, agent, command, specs, plugins.
140-153 buildIndexScopePolicy derives excluded globs when included folders are not opted in.
162-179 resolveIndexScopePolicy marks the source as default when no env/per-call opt-in is present.
```

The default policy becomes actual scan behavior:

```text
scan.ts:256-263 resolves scope from per-call args.
indexer-types.ts:149-164 appends policy excluded globs into the indexer excludeGlobs.
structural-indexer.ts:1306-1318 rejects paths when shouldIndexForCodeGraph returns false.
utils/index-scope.ts:72-90 rejects .opencode skill/agent/command/specs/plugins paths unless policy opts them in.
scan.ts:342 persists the active scope policy after indexing.
code-graph-db.ts:277-280 stores only fingerprint, label, and source metadata for the graph scope.
```

Docs and tests confirm the current contract, so this is not a one-off runtime accident:

```text
code_graph/README.md:256-266 documents the broader default excludes and env opt-ins.
ENV_REFERENCE.md:261 documents SPECKIT_CODE_GRAPH_INDEX_SKILLS default=false and type=boolean or csv.
code-graph-indexer.vitest.ts:294-310 asserts that all five .opencode folders are excluded by default.
code-graph-scan.vitest.ts:345-421 asserts includeSkills true/list pass through to the indexer.
```

Env/per-call verification gaps:

```text
index-scope-policy.ts:53 accepts only /^sk-[a-z0-9-]+$/ skill names.
index-scope-policy.ts:71-72 filters invalid skill values out during normalization.
index-scope-policy.ts:75-85 maps invalid or empty env CSVs to includedSkillsList='none'.
schemas/tool-input-schemas.ts:493 validates per-call includeSkills by boolean or sk-* regex array.
tool-input-schema.vitest.ts:626-639 rejects invalid per-call shape, but there is no equivalent invalid-env warning/error coverage.
```

Local scope-size check:

```text
find .opencode/skills/system-spec-kit ... indexable extensions | wc -l => 4924
find .opencode/skills/system-spec-kit/mcp_server/code_graph ... -type f | wc -l => 97
```

## NEW INSIGHTS
- The default-scope problem is encoded as the documented public contract and test baseline, not merely as missing documentation.
- `SPECKIT_CODE_GRAPH_INDEX_SKILLS` has a weaker validation path than per-call `includeSkills`: per-call schema rejects bad shapes, while env parsing silently collapses invalid values to `none`.
- Granular selection has no existence check. `sk-does-not-exist` is syntactically valid, produces a selective scope, and can lead to an empty or misleading scan without telling the maintainer the selected skill folder was unmatched.

## OPEN QUESTIONS
- Should the default scope become CWD-aware only when the active root is inside `.opencode/skills/system-spec-kit`, or should all `.opencode/skills/**` folders be included by default in this repository?
- Should invalid `SPECKIT_CODE_GRAPH_INDEX_SKILLS` env values block scans, warn and continue, or fall back to the last known non-empty graph?
- Should `setCodeGraphScope` persist richer policy metadata, such as selected skill names and unmatched selections, so status/readiness can explain scope mismatches without reparsing only the fingerprint?
