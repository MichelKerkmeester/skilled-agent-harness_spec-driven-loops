---
round: 1
seat: 1
seat_letter: A
executor: cli-codex
lens: isolation-architect
model: gpt-5.5
reasoning: xhigh
status: complete
timestamp: 2026-05-22T16:59:43Z
---

# Seat A — Isolation Architect

## Position

Relocate the deep-loop runtime out of `system-spec-kit/mcp_server/` into a new `.opencode/skills/deep-loop-runtime/` skill, and make both `deep-review` and `deep-research` depend on that runtime explicitly. The dependency survey says these 18 production files have 100% deep-* consumption and no non-deep production callers; keeping them under spec-kit makes the generic memory/spec server the false owner of review/research iteration semantics, executor policy, prompt rendering, validation, graph convergence, and graph schema. The clean architecture is not "deep-review owns deep-research runtime" and not "spec-kit owns deep-loop internals"; it is a dedicated deep-loop runtime skill with spec-kit retaining only MCP registration and database lifecycle integration.

## Argument

The current layout is an ownership inversion. `deep_start-review-loop_auto.yaml` resolves executor config from `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts#parseExecutorConfig` around line 656, renders review prompts through `prompt-pack.ts#renderPromptPack` around line 672, writes non-native executor provenance through `executor-audit.ts#writeFirstRecordExecutor` around line 692, validates iteration output through `post-dispatch-validate.ts#validateIterationOutputs` around line 898, and calls `mcp__mk_spec_memory__deep_loop_graph_upsert` around line 1015. `deep_start-research-loop_auto.yaml` mirrors the same runtime calls around lines 543, 554, and 572. Those are not generic spec-kit concerns. They are the execution kernel for two deep-loop skills.

The deepest tell is that `coverage-graph-db.ts` defines `LoopType = 'research' | 'review'`, node-kind allow-lists for research and review, review relations such as `EVIDENCE_FOR`, `ESCALATES`, and `IN_DIMENSION`, and a dedicated `deep-loop-graph.sqlite` database. This is domain code wearing an infrastructure path. It is not a neutral memory service; it encodes exactly the graph vocabulary of deep-research and deep-review. The 116/007 node-kind extension landed in the same misplaced file because the only way to evolve deep-review graph semantics today is to patch a system-spec-kit MCP library.

MCP tool ID stability does not require physical handler ownership. `mcp_server/tools/index.ts` already centralizes the public names in `coverageGraphTools.TOOL_NAMES` and dispatches by switch cases for `deep_loop_graph_upsert`, `deep_loop_graph_query`, `deep_loop_graph_status`, and `deep_loop_graph_convergence`. That file can keep the stable public tool IDs while importing implementations from `.opencode/skills/deep-loop-runtime/mcp_server/handlers/coverage-graph/*`. The name is the contract; the handler directory is not.

External contributor ergonomics matter because ownership boundaries teach maintainers where to look. A contributor debugging a deep-review iteration failure currently has to bounce from `deep-review/scripts/reduce-state.cjs` and `deep-review/assets/prompt_pack_iteration.md.tmpl` into `system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts`, then into coverage-graph handlers under spec-kit for convergence. That split is not modularity; it is archaeology. The repo already shows the better pattern: reducers, assets, strategy files, and protocol references live inside `deep-review` and `deep-research`. Runtime code should follow the same ownership rule.

The cleanest relocation is a new `.opencode/skills/deep-loop-runtime/` skill, not placing all shared files under `deep-review/`. The runtime is genuinely shared between review and research, so making `deep-research` import `deep-review/mcp_server/lib/deep-loop/*` would recreate the same anti-pattern with a different false owner. A first-class deep-loop-runtime skill states the truth: this is shared deep-loop infrastructure, consumed by exactly two deep-* skills, with system-spec-kit acting as the MCP host boundary rather than the semantic owner.

## Risks of opposing positions

Seat B's status-quo defense will lean on MCP tool ID stability, DB lifecycle, test colocation, and PR churn. Those are migration mechanics, not architecture. Tool IDs remain stable because `mcp_server/tools/index.ts` keeps `deep_loop_graph_*` names while changing import targets. DB lifecycle remains coherent because `coverage-graph-db.ts` can continue importing `DATABASE_DIR` from `system-spec-kit/mcp_server/core/config.js`, or better, receive a DB directory adapter from the MCP host; neither option requires semantic ownership to stay in spec-kit. Test colocation improves when `mcp_server/tests/deep-loop/` moves with the runtime, because prompt-pack, validator, dispatch failure, graph, and convergence tests stop living under the wrong skill. PR churn is finite; inverted ownership is compound interest.

The partial-split position is worse than either status quo or full relocation because it preserves two sources of truth. Moving only `lib/deep-loop/` while leaving coverage-graph handlers in spec-kit means iteration dispatch and convergence evolve in different ownership zones despite sharing state, session IDs, and reducer outputs. Moving handlers but not DB/query/signals means the public MCP layer points into a library still owned by the wrong package. Moving only docs and YAML call sites is cosmetic. A partial split would keep the next 116/007-style graph semantic change crossing ownership boundaries, which is exactly the failure mode this deliberation is about.

## Migration outline

Move these 10 files from `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/` to `.opencode/skills/deep-loop-runtime/mcp_server/lib/deep-loop/`: `executor-config.ts`, `executor-audit.ts`, `prompt-pack.ts`, `post-dispatch-validate.ts`, `atomic-state.ts`, `jsonl-repair.ts`, `loop-lock.ts`, `permissions-gate.ts`, `bayesian-scorer.ts`, and `fallback-router.ts`.

Move these 3 files from `.opencode/skills/system-spec-kit/mcp_server/lib/coverage-graph/` to `.opencode/skills/deep-loop-runtime/mcp_server/lib/coverage-graph/`: `coverage-graph-db.ts`, `coverage-graph-query.ts`, and `coverage-graph-signals.ts`.

Move these 5 files from `.opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/` to `.opencode/skills/deep-loop-runtime/mcp_server/handlers/coverage-graph/`: `convergence.ts`, `upsert.ts`, `query.ts`, `status.ts`, and `index.ts`.

Keep MCP public registration in `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts`, but update the handler imports to the new runtime path. Keep tool schemas in `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` and `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`, because those define the host-facing MCP contract. Preserve the tool names `mcp__mk_spec_memory__deep_loop_graph_convergence`, `mcp__mk_spec_memory__deep_loop_graph_upsert`, `mcp__mk_spec_memory__deep_loop_graph_query`, and `mcp__mk_spec_memory__deep_loop_graph_status` exactly.

Update workflow YAML references in `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml`, `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml`, `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml`, and `.opencode/commands/deep/assets/deep_start-research-loop_confirm.yaml` from `system-spec-kit/mcp_server/lib/deep-loop/*` to `deep-loop-runtime/mcp_server/lib/deep-loop/*`. Move vitest coverage from `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/` to `.opencode/skills/deep-loop-runtime/mcp_server/tests/deep-loop/`, and update parity or integration tests under `system-spec-kit/scripts/tests/` to import the runtime as an external deep-loop dependency rather than treating spec-kit as the owner.

Keep `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs` and `.opencode/skills/system-spec-kit/scripts/resource-map/extract-from-evidence.cjs` where they are. They are cross-cutting helpers, not deep-loop runtime owners. Add `.opencode/skills/deep-loop-runtime/SKILL.md` declaring the runtime's scope: shared execution, validation, graph, and convergence infrastructure for `deep-review` and `deep-research`, with spec-kit limited to MCP hosting and stable public tool IDs.

## Confidence

94/100. The dependency map, YAML call sites, and MCP registry shape all point to the same conclusion: stable public names can stay in spec-kit while runtime ownership moves to a deep-loop-specific home.

---

Recommendation: ISOLATE
