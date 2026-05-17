---
title: "Edge Cases: Phase 001 Discovery Impact Map"
description: "Annotated non-trivial sk-deep-* reference patterns for packet 070 rename planning."
---
# Edge Cases: Phase 001 Discovery Impact Map

This file lists non-trivial reference forms that need explicit handling during Phases 002-006. Binary database files are listed as rebuild/re-index targets, not text-edit targets.

## Filename Embeds - Files

No matches found. Expected handling: Rename path embeds in the phase that owns the file. Historical changelog embeds are excluded.


## Filename Embeds - Folders

Expected handling: Use git mv for skill folder roots in Phase 002. Treat active spec folder name embeds as Phase 003 spec-folder-active decisions.

### `.opencode/skills/sk-deep-research`

Snippet: `(path-only or binary match)`

### `.opencode/skills/sk-deep-review`

Snippet: `(path-only or binary match)`

### `.opencode/specs/skilled-agent-orchestration/070-sk-deep-rename`

Snippet: `(path-only or binary match)`

### `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-runtime-executor-hardening/002-sk-deep-cli-runtime-execution`

Snippet: `(path-only or binary match)`

### `specs/skilled-agent-orchestration/070-sk-deep-rename`

Snippet: `(path-only or binary match)`

### `specs/system-spec-kit/026-graph-and-context-optimization/004-runtime-executor-hardening/002-sk-deep-cli-runtime-execution`

Snippet: `(path-only or binary match)`


## URL and Path Links

Expected handling: Update markdown/config links when their owning phase updates text references.

### `.claude/agents/deep-research.md`

Snippet: `L91: - Lifecycle branch from 'config.lineage.lineageMode' ('new', 'resume', or 'restart'; 'fork' and 'completed-continue' are deferred -- see '.opencode/skills/sk-deep-research/references/loop_protocol.md §Lifecycle Branches')`

### `.claude/agents/deep-review.md`

Snippet: `L3: description: "LEAF review agent for sk-deep-review. Performs single review iteration: reads state, reviews one dimension with P0/P1/P2 findings, updates strategy and JSONL."`

### `.codex/agents/deep-research.toml`

Snippet: `L83: - Lifecycle branch from 'config.lineage.lineageMode' ('new', 'resume', or 'restart'; 'fork' and 'completed-continue' are deferred -- see '.opencode/skills/sk-deep-research/references/loop_protocol.md §Lifecycle Branches')`

### `.codex/agents/deep-review.toml`

Snippet: `L10: description = "LEAF review agent for sk-deep-review. Performs single review iteration: reads state, reviews one dimension with P0/P1/P2 findings, updates strategy and JSONL."`

### `.gemini/agents/deep-research.md`

Snippet: `L74: - Lifecycle branch from 'config.lineage.lineageMode' ('new', 'resume', or 'restart'; 'fork' and 'completed-continue' are deferred -- see '.opencode/skills/sk-deep-research/references/loop_protocol.md §Lifecycle Branches')`

### `.gemini/agents/deep-review.md`

Snippet: `L3: description: "LEAF review agent for sk-deep-review. Performs single review iteration: reads state, reviews one dimension with P0/P1/P2 findings, updates strategy and JSONL."`

### `.gemini/commands/spec_kit/deep-research.toml`

Snippet: `L2: prompt = "---\ndescription: Autonomous deep research loop - iterative investigation with convergence detection. Supports :auto and :confirm modes\nargument-hint: \"<topic> [:auto|:confirm] [--max-iterations=N] [--converg`

### `.opencode/agents/deep-research.md`

Snippet: `L91: - Lifecycle branch from 'config.lineage.lineageMode' ('new', 'resume', or 'restart'; 'fork' and 'completed-continue' are deferred -- see '.opencode/skills/sk-deep-research/references/loop_protocol.md §Lifecycle Branches')`

### `.opencode/agents/deep-review.md`

Snippet: `L3: description: "LEAF review agent for sk-deep-review. Performs single review iteration: reads state, reviews one dimension with P0/P1/P2 findings, updates strategy and JSONL."`

### `.opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml`

Snippet: `L67: skill: sk-deep-research`

### `.opencode/commands/spec_kit/assets/spec_kit_deep-research_confirm.yaml`

Snippet: `L53: skill: sk-deep-research`

### `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml`

Snippet: `L33: lineage_mode: "[auto|resume|restart] - Session lifecycle intent. Default: auto. The runtime only persists lineage events for 'resume' (same sessionId, no archive) and 'restart' (new sessionId, generation+1, prior review/`

### `.opencode/commands/spec_kit/assets/spec_kit_deep-review_confirm.yaml`

Snippet: `L33: lineage_mode: "[auto|resume|restart] - Session lifecycle intent. Default: auto. The runtime only persists lineage events for 'resume' (same sessionId, no archive) and 'restart' (new sessionId, generation+1, prior review/`

### `.opencode/commands/spec_kit/deep-research.md`

Snippet: `L36: > '.opencode/skills/sk-deep-research/references/spec_check_protocol.md'.`

### `.opencode/commands/spec_kit/deep-review.md`

Snippet: `L135: - '"skill:sk-deep-research, B, all, A, A"'`

### `.opencode/skills/sk-deep-research/README.md`

Snippet: `L2: title: sk-deep-research`

### `.opencode/skills/sk-deep-research/SKILL.md`

Snippet: `L2: name: sk-deep-research`

### `.opencode/skills/sk-deep-research/assets/deep_research_config.json`

Snippet: `L54: "capabilityMatrixPath": ".opencode/skills/sk-deep-research/assets/runtime_capabilities.json",`

### `.opencode/skills/sk-deep-research/assets/deep_research_strategy.md`

Snippet: `L105: - Capability matrix: '.opencode/skills/sk-deep-research/assets/runtime_capabilities.json'`

### `.opencode/skills/sk-deep-research/assets/runtime_capabilities.json`

Snippet: `L3: "docPath": ".opencode/skills/sk-deep-research/references/capability_matrix.md",`

### `.opencode/skills/sk-deep-research/feature_catalog/01--loop-lifecycle/01-initialization.md`

Snippet: `L33: | '.opencode/skills/sk-deep-research/references/loop_protocol.md' | Reference | Documents session classification, canonical names, and the resumed or restarted lifecycle event contract. |`

### `.opencode/skills/sk-deep-research/feature_catalog/01--loop-lifecycle/02-iteration-dispatch.md`

Snippet: `L34: | '.opencode/skills/sk-deep-research/scripts/reduce-state.cjs' | Reducer | Synchronizes strategy, findings registry, and dashboard from iteration artifacts and events. |`

### `.opencode/skills/sk-deep-research/feature_catalog/01--loop-lifecycle/03-convergence-check.md`

Snippet: `L30: | '.opencode/skills/sk-deep-research/references/convergence.md' | Reference | Defines the hard stops, weighted signals, legal-stop bundle, and stop labels. |`

### `.opencode/skills/sk-deep-research/feature_catalog/01--loop-lifecycle/04-synthesis.md`

Snippet: `L30: | '.opencode/skills/sk-deep-research/references/loop_protocol.md' | Reference | Defines the synthesis phase steps, required output shape, and terminal event contract. |`

### `.opencode/skills/sk-deep-research/feature_catalog/01--loop-lifecycle/05-memory-save.md`

Snippet: `L31: | '.opencode/skills/sk-deep-research/references/loop_protocol.md' | Reference | Defines the save phase and its verification step. |`

### `.opencode/skills/sk-deep-research/feature_catalog/01--loop-lifecycle/06-resource-map-emission.md`

Snippet: `L31: | '.opencode/skills/sk-deep-research/scripts/reduce-state.cjs' | Reducer | Adds the '--emit-resource-map' path and honors 'config.resource_map.emit'. |`

### `.opencode/skills/sk-deep-research/feature_catalog/02--state-management/01-jsonl-state-log.md`

Snippet: `L30: | '.opencode/skills/sk-deep-research/references/state_format.md' | Reference | Defines the JSONL schema for config, iteration, and event lines. |`

### `.opencode/skills/sk-deep-research/feature_catalog/02--state-management/02-strategy-tracking.md`

Snippet: `L30: | '.opencode/skills/sk-deep-research/assets/deep_research_strategy.md' | Asset | Defines the strategy anchors and machine-owned section boundaries. |`

### `.opencode/skills/sk-deep-research/feature_catalog/02--state-management/03-config-management.md`

Snippet: `L30: | '.opencode/skills/sk-deep-research/assets/deep_research_config.json' | Asset | Defines the default config fields, reducer paths, file protections, and optimizer-managed knobs. |`

### `.opencode/skills/sk-deep-research/feature_catalog/03--convergence/01-three-signal-model.md`

Snippet: `L30: | '.opencode/skills/sk-deep-research/references/convergence.md' | Reference | Defines hard stops, weighted signals, stop-score threshold, and status handling. |`

_Additional entries omitted from this section for readability: 1002. Full text-reference rows are in inventory.tsv._


## TypeScript and JavaScript Constants

Expected handling: Update string literals and fixture expectations in Phase 003; rerun advisor/scorer tests in Phase 006.

### `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/aliases.ts`

Snippet: `L13: 'sk-deep-research': [`

### `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts`

Snippet: `L118: && args.skillId === 'sk-deep-research'`

### `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts`

Snippet: `L100: '/spec_kit:deep-research': [['sk-deep-research', 1.6], ['command-spec-kit', 0.45]],`

### `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/lexical.ts`

Snippet: `L30: 'sk-deep-research': ['deep research', 'research loop', 'overnight research', 'delta record', 'state log', 'lineage'],`

### `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts`

Snippet: `L314: skill({ id: 'sk-deep-review', description: 'Deep review loop.' }),`

### `.opencode/skills/system-spec-kit/mcp_server/tests/remediation-008-docs.vitest.ts`

Snippet: `L20: expect(spec).toContain('sk-deep-research/feature_catalog/' -- root catalog + 14 feature entries across 4 categories');`


## SQLite Indexed Entries

Expected handling: Do not edit these binaries directly. Rebuild skill graph, context index, and code graph caches in Phase 006.

### `.opencode/skills/system-spec-kit/mcp_server/database/code-graph.sqlite`

Snippet: `(binary grep matched old-name bytes)`

### `.opencode/skills/system-spec-kit/mcp_server/database/code-graph.sqlite-wal`

Snippet: `(binary grep matched old-name bytes)`

### `.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite`

Snippet: `(binary grep matched old-name bytes)`

### `.opencode/skills/system-spec-kit/mcp_server/database/context-index__voyage__voyage-4__1024.sqlite`

Snippet: `(binary grep matched old-name bytes)`

### `.opencode/skills/system-spec-kit/mcp_server/database/context-index__voyage__voyage-4__1024.sqlite-wal`

Snippet: `(binary grep matched old-name bytes)`

### `.opencode/skills/system-spec-kit/mcp_server/database/skill-graph.sqlite`

Snippet: `(binary grep matched old-name bytes)`

### `.opencode/skills/system-spec-kit/mcp_server/database/skill-graph.sqlite-wal`

Snippet: `(binary grep matched old-name bytes)`


## Test Snapshot Files

No matches found. Expected handling: Update snapshots only after source fixture expectations are renamed.


## Active Graph Metadata Files

Expected handling: Update active graph metadata as part of spec-folder-active Phase 003 handling.

### `.opencode/skills/sk-code-review/graph-metadata.json`

Snippet: `L25: "target": "sk-deep-review",`

### `.opencode/skills/sk-deep-research/graph-metadata.json`

Snippet: `L3: "skill_id": "sk-deep-research",`

### `.opencode/skills/sk-deep-review/graph-metadata.json`

Snippet: `L3: "skill_id": "sk-deep-review",`

### `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/graph-metadata.json`

Snippet: `L20: { "target": "sk-deep-research", "weight": 0.7, "context": "routes autonomous research requests" },`

### `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/001-deep-research-recommendations/graph-metadata.json`

Snippet: `L49: ".opencode/skills/sk-deep-research/changelog/v1.9.0.0.md",`

### `.opencode/specs/skilled-agent-orchestration/070-sk-deep-rename/001-discovery-impact-map/graph-metadata.json`

Snippet: `L3: "packet_id": "skilled-agent-orchestration/070-sk-deep-rename/001-discovery-impact-map",`

### `.opencode/specs/skilled-agent-orchestration/070-sk-deep-rename/graph-metadata.json`

Snippet: `L3: "packet_id": "skilled-agent-orchestration/070-sk-deep-rename",`

### `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/013-evergreen-doc-packet-id-removal/graph-metadata.json`

Snippet: `L48: ".opencode/skills/sk-deep-research/feature_catalog/feature_catalog.md",`

### `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/003-system-deep-bugs-and-improvements/graph-metadata.json`

Snippet: `L56: ".opencode/skills/sk-deep-research/SKILL.md"`

### `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/004-deep-research-finding-remediation/002-deep-loop-workflow-state/graph-metadata.json`

Snippet: `L49: ".opencode/skills/sk-deep-research/references/state_format.md",`

### `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/002-codesight/graph-metadata.json`

Snippet: `L52: ".opencode/skills/sk-deep-research/scripts/reduce-state.cjs",`

### `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/004-graphify/graph-metadata.json`

Snippet: `L49: ".opencode/skills/sk-deep-research/scripts/reduce-state.cjs",`

### `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/005-claudest/graph-metadata.json`

Snippet: `L51: ".opencode/skills/sk-deep-research/scripts/reduce-state.cjs",`

### `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-deep-loop-fix/001-reverse-parent-research-review-folders/graph-metadata.json`

Snippet: `L48: ".opencode/skills/sk-deep-research/scripts/reduce-state.cjs",`

### `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-deep-loop-fix/003-resource-map-deep-loop-integration/graph-metadata.json`

Snippet: `L49: ".opencode/skills/sk-deep-review/scripts/reduce-state.cjs",`

### `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-deep-loop-fix/graph-metadata.json`

Snippet: `L55: ".opencode/skills/sk-deep-review/scripts/reduce-state.cjs",`

### `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-runtime-executor-hardening/002-sk-deep-cli-runtime-execution/graph-metadata.json`

Snippet: `L3: "packet_id": "system-spec-kit/026-graph-and-context-optimization/004-runtime-executor-hardening/002-sk-deep-cli-runtime-execution",`

### `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-runtime-executor-hardening/graph-metadata.json`

Snippet: `L8: "system-spec-kit/026-graph-and-context-optimization/004-runtime-executor-hardening/002-sk-deep-cli-runtime-execution",`

### `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/003-smart-remediation-and-opencode-plugin/graph-metadata.json`

Snippet: `L80: ".opencode/skills/sk-deep-research/SKILL.md",`

### `.opencode/specs/z_future/agentic-system-upgrade/001-research-agentic-systems/005-intellegix-code-agent-toolkit-master/graph-metadata.json`

Snippet: `L52: ".opencode/skills/sk-deep-research/references/loop_protocol.md",`

### `.opencode/specs/z_future/agentic-system-upgrade/002-agentic-adoption/003-loop-observability/graph-metadata.json`

Snippet: `L44: ".opencode/skills/sk-deep-research/references/state_format.md",`

### `.opencode/specs/z_future/agentic-system-upgrade/002-agentic-adoption/005-budget-stagnation-enforcement/graph-metadata.json`

Snippet: `L41: ".opencode/skills/sk-deep-research/assets/deep_research_config.json",`

### `.opencode/specs/z_future/agentic-system-upgrade/002-agentic-adoption/011-event-journal-and-replay-study/graph-metadata.json`

Snippet: `L43: ".opencode/skills/sk-deep-research/references/state_format.md",`

### `.opencode/specs/z_future/agentic-system-upgrade/002-agentic-adoption/014-multi-model-council-evaluation/graph-metadata.json`

Snippet: `L43: ".opencode/skills/sk-deep-research/assets/deep_research_config.json",`

### `specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/001-deep-research-recommendations/graph-metadata.json`

Snippet: `L49: ".opencode/skills/sk-deep-research/changelog/v1.9.0.0.md",`

### `specs/skilled-agent-orchestration/070-sk-deep-rename/graph-metadata.json`

Snippet: `L3: "packet_id": "skilled-agent-orchestration/070-sk-deep-rename",`

### `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/013-evergreen-doc-packet-id-removal/graph-metadata.json`

Snippet: `L48: ".opencode/skills/sk-deep-research/feature_catalog/feature_catalog.md",`

### `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/003-system-deep-bugs-and-improvements/graph-metadata.json`

Snippet: `L56: ".opencode/skills/sk-deep-research/SKILL.md"`

### `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/004-deep-research-finding-remediation/002-deep-loop-workflow-state/graph-metadata.json`

Snippet: `L49: ".opencode/skills/sk-deep-research/references/state_format.md",`

### `specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/002-codesight/graph-metadata.json`

Snippet: `L52: ".opencode/skills/sk-deep-research/scripts/reduce-state.cjs",`

### `specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/004-graphify/graph-metadata.json`

Snippet: `L49: ".opencode/skills/sk-deep-research/scripts/reduce-state.cjs",`

### `specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/005-claudest/graph-metadata.json`

Snippet: `L51: ".opencode/skills/sk-deep-research/scripts/reduce-state.cjs",`

### `specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-deep-loop-fix/001-reverse-parent-research-review-folders/graph-metadata.json`

Snippet: `L48: ".opencode/skills/sk-deep-research/scripts/reduce-state.cjs",`

### `specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-deep-loop-fix/003-resource-map-deep-loop-integration/graph-metadata.json`

Snippet: `L49: ".opencode/skills/sk-deep-review/scripts/reduce-state.cjs",`

### `specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-deep-loop-fix/graph-metadata.json`

Snippet: `L55: ".opencode/skills/sk-deep-review/scripts/reduce-state.cjs",`

### `specs/system-spec-kit/026-graph-and-context-optimization/004-runtime-executor-hardening/002-sk-deep-cli-runtime-execution/graph-metadata.json`

Snippet: `L3: "packet_id": "system-spec-kit/026-graph-and-context-optimization/004-runtime-executor-hardening/002-sk-deep-cli-runtime-execution",`

### `specs/system-spec-kit/026-graph-and-context-optimization/004-runtime-executor-hardening/graph-metadata.json`

Snippet: `L8: "system-spec-kit/026-graph-and-context-optimization/004-runtime-executor-hardening/002-sk-deep-cli-runtime-execution",`

### `specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/003-smart-remediation-and-opencode-plugin/graph-metadata.json`

Snippet: `L80: ".opencode/skills/sk-deep-research/SKILL.md",`

### `specs/z_future/agentic-system-upgrade/001-research-agentic-systems/005-intellegix-code-agent-toolkit-master/graph-metadata.json`

Snippet: `L52: ".opencode/skills/sk-deep-research/references/loop_protocol.md",`

### `specs/z_future/agentic-system-upgrade/002-agentic-adoption/003-loop-observability/graph-metadata.json`

Snippet: `L44: ".opencode/skills/sk-deep-research/references/state_format.md",`

_Additional entries omitted from this section for readability: 3. Full text-reference rows are in inventory.tsv._


## CocoIndex and Code Graph Nodes

Expected handling: refresh/re-index after text and path renames complete; do not patch database files directly.

- `.cocoindex_code/cocoindex.db/mdb/data.mdb`
- `.cocoindex_code/target_sqlite.db`
