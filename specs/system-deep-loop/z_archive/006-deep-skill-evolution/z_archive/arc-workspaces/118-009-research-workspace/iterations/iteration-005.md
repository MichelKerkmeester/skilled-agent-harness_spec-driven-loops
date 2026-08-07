# Iteration 5: Adversarial review of deep-research code/docs/artifacts

## Focus
Probe deep-research's actual code, documentation, and configuration files for hidden defects that would not have been caught by the previous mapping/gap survey iterations (1-4).

## Findings

### DR-006: Lexical sort bug in iteration file ordering (P1)
**File**: `.opencode/skills/deep-research/scripts/reduce-state.cjs:874`
**Severity**: P1 - correctness bug

The reducer uses lexical sort for iteration files instead of numeric sort:

```javascript
const iterationFiles = fs.existsSync(iterationDir)
  ? fs.readdirSync(iterationDir)
      .filter((fileName) => /^iteration-\d+\.md$/.test(fileName))
      .sort()  // BUG: lexical sort, not numeric
      .map((fileName) => parseIterationFile(path.join(iterationDir, fileName)))
  : [];
```

This causes `iteration-10.md` to sort before `iteration-2.md` (since "10" < "2" lexicically). The reducer processes iterations in wrong order, corrupting registry, dashboard, and strategy state. The fix requires a numeric comparator: `.sort((a, b) => { const numA = parseInt(a.match(/\d+/)[0]); const numB = parseInt(b.match(/\d+/)[0]); return numA - numB; })`.

**Evidence**: reduce-state.cjs:874 uses `.sort()` without comparator for iteration-\d+\.md files.

### DR-007: Missing resource_map detection step in confirm YAML (P2)
**File**: `.opencode/commands/deep/assets/deep_start-research-loop_confirm.yaml`
**Severity**: P2 - functional gap

The confirm YAML is missing the `step_detect_resource_map` step that exists in auto YAML (lines 156-165 in auto). Confirm mode jumps from `step_create_directories` to `step_resolve_canonical_names`, skipping resource map detection. Additionally, confirm YAML hardcodes `resource_map.emit: true` at line 213, ignoring the `--no-resource-map` flag that auto YAML honors via the `{resource_map_emit}` binding.

**Impact**: Confirm mode cannot honor `--no-resource-map` flag and fails to populate `resource_map_known_context` during init, breaking the resource-map integration contract documented in SKILL.md §3.

**Evidence**: Auto YAML has step_detect_resource_map at lines 156-165; confirm YAML lacks this step and hardcodes emit=true at line 213.

### DR-008: Stale tool references in SKILL.md allowed-tools (P2)
**File**: `.opencode/skills/deep-research/SKILL.md:4`
**Severity**: P2 - documentation drift

SKILL.md allowed-tools lists `memory_context` and `memory_search` as MCP tools. After arc 118's FULL_ISOLATE_NO_MCP changes, the workflow YAML uses script-based convergence via `deep-loop-runtime/scripts/convergence.cjs` instead of the removed `mcp__mk_spec_memory__deep_loop_graph_*` tools. While memory tools may still be used for context loading (YAML step 54-58), listing them in the agent's allowed-tools is misleading since the agent itself is LEAF-only and should not dispatch MCP tools directly—the workflow owns MCP integration.

**Impact**: Documentation drift creates confusion about tool access boundaries. The SKILL.md should clarify that memory tools are workflow-owned, not agent-owned, or remove them from allowed-tools if the agent never invokes them directly.

**Evidence**: SKILL.md:4 lists memory_context/memory_search in allowed-tools; changelog v1.12.0.0 describes MCP→script cutover; YAML step 54-58 shows workflow-owned memory_context call.

## Ruled Out

- Off-by-one errors in iteration counters: The reducer correctly parses iteration numbers from filenames using regex and stores them in the `run` field. No counter arithmetic defects found.
- Race conditions in state mutation: The reducer is single-pass and synchronous; no concurrent access patterns exist.
- Missing error handling in reduce-state.cjs: Corruption handling is comprehensive (parseJsonlDetailed, createCorruptionError, fail-closed exit codes).
- Schema validity issues in assets/deep_research_config.json: JSON is valid and matches the documented schema.
- Placeholder mismatches in prompt_pack_iteration.md.tmpl: All placeholders ({state_summary}, {research_topic}, etc.) match the renderer's expected tokens.
- Orphaned MCP tool references in YAMLs: All graph operations correctly use bash: 'node .../deep-loop-runtime/scripts/*.cjs' invocations; no orphaned mcp_tool steps found.

## Dead Ends

- Attempted to find test coverage gaps: No .vitest or .test files exist under deep-research/tests/. The only test fixture is the interrupted-session manual fixture, which is not automated. This is a known limitation, not a hidden defect.
- Attempted to find stale state-key references: All state keys (sessionId, parentSessionId, lineageMode, etc.) are consistent across reduce-state.cjs, config schema, and YAML event templates.

## Sources Consulted

- `.opencode/skills/deep-research/scripts/reduce-state.cjs` (lines 1-1022)
- `.opencode/skills/deep-research/SKILL.md` (v1.12.0.0)
- `.opencode/skills/deep-research/changelog/v1.12.0.0.md`
- `.opencode/skills/deep-research/README.md`
- `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml`
- `.opencode/commands/deep/assets/deep_start-research-loop_confirm.yaml`
- `.opencode/skills/deep-research/assets/prompt_pack_iteration.md.tmpl`
- `.opencode/skills/deep-research/assets/deep_research_config.json`
- `.opencode/skills/deep-research/scripts/tests/fixtures/interrupted-session/`

## Reflection

- What worked and why: Reading the actual reduce-state.cjs end-to-end revealed the lexical sort bug that would have been missed in a high-level review. Cross-referencing auto vs confirm YAMLs exposed the missing resource_map detection step.
- What did not work and why: Attempting to find test coverage gaps was unproductive since deep-research has no automated tests—this is a known architectural gap, not a hidden defect.
- What I would do differently: Start with the core reducer script before reviewing docs, as implementation bugs are more impactful than documentation drift.

## Recommended Next Focus

Synthesize all 15 uplift candidates (10 from 118 mapping + 5 deep-research-specific) into a prioritized remediation plan, then proceed to iteration 6 for final convergence check.
