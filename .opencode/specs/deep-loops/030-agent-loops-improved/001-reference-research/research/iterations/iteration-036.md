# Iteration 36: S5-07 Code-Graph to Coverage-Graph Init Bridge

## Focus

[S5-07] How can a bridge seed the coverage graph from `code_graph_query` / impact at init so review and context loops start with real `FILE` / `DEPENDENCY` nodes instead of an empty graph returning `CONTINUE`?

## Actions Taken

1. Checked prior registry and iteration narratives for S5-07, `code_graph`, `coverage-graph`, `DEPENDENCY`, empty graph, and `CONTINUE` overlap.
2. Mined `loop-cli-main` init and project hydration paths for startup seeding mechanisms that construct relationship state before runtime controllers act.
3. Mined `kasper` state and source-resolution init paths for validated, precedence-aware bootstrap mechanisms before scoring/evaluation.
4. Mapped the mechanisms onto our context/review YAMLs and runtime coverage graph allow-list, upsert, and convergence signal files.

## Findings

1. Ranked backlog: add a context init graph-seed step immediately after `step_seed_frontier`.

   Reference mechanism: `loop-cli-main` initializes projects before loading loops, migrates missing `projectId` to `default`, converts legacy inline commands to task ids, and only then constructs controllers with hydrated options and prior run state [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:34`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:38`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:43`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:49`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:69`].

   Exact OUR target file: `.opencode/commands/deep/assets/deep_context_auto.yaml`.

   Why it helps: our context init already resolves ranked `frontier_slices_json` from `code_graph_query` before the first sweep [TARGET: `.opencode/commands/deep/assets/deep_context_auto.yaml:226`; `.opencode/commands/deep/assets/deep_context_auto.yaml:230`; `.opencode/commands/deep/assets/deep_context_auto.yaml:236`], but the coverage graph is not upserted until iteration output creates `graph_nodes_json` and `graph_edges_json` [TARGET: `.opencode/commands/deep/assets/deep_context_auto.yaml:496`; `.opencode/commands/deep/assets/deep_context_auto.yaml:511`; `.opencode/commands/deep/assets/deep_context_auto.yaml:514`]. Add a bounded init step that converts `frontier_slices_json` plus code-graph imports/callers into initial `SLICE`, `FILE`, `SYMBOL`, and `DEPENDENCY` nodes and `CONTAINS` / `IMPORTS` / `DEPENDS_ON` edges, then calls `upsert.cjs` before the first convergence check.

   Port-difficulty: med. Tag: quick-win.

2. Ranked backlog: persist source provenance and fallback quality on seeded graph nodes.

   Reference mechanism: `kasper` resolves an agent prompt source through a precedence chain: project config, global config, explicit file directive, inline prompt, project file candidates, then global file candidates [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/agent-prompt-resolver.ts:203`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/agent-prompt-resolver.ts:209`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/agent-prompt-resolver.ts:218`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/agent-prompt-resolver.ts:236`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/agent-prompt-resolver.ts:240`].

   Exact OUR target file: `.opencode/commands/deep/assets/deep_context_auto.yaml`.

   Why it helps: context init already records `frontier_source` as `code_graph | glob_grep_fallback` [TARGET: `.opencode/commands/deep/assets/deep_context_auto.yaml:237`; `.opencode/commands/deep/assets/deep_context_auto.yaml:238`], but the future graph seed should carry per-node metadata such as `seed_source`, `seed_confidence`, `code_graph_query`, and `fallback_reason`. That lets convergence distinguish code-graph-verified structural nodes from fallback nodes instead of treating all seeded `DEPENDENCY` / `FILE` nodes as equally authoritative.

   Port-difficulty: easy. Tag: quick-win.

3. Ranked backlog: repair missing or stale seeded nodes before scoring, not during scoring.

   Reference mechanism: `kasper` state init loads existing state, checks integrity, overlays defaults, repairs absent arrays/maps, restores dedupe sets, and rebuilds running state when counts disagree before later evaluation uses the state [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:159`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:165`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:176`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:185`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:201`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:204`].

   Exact OUR target file: `.opencode/skills/deep-loop-runtime/scripts/upsert.cjs`.

   Why it helps: `upsert.cjs` currently rejects empty node/edge batches for non-council loop types [TARGET: `.opencode/skills/deep-loop-runtime/scripts/upsert.cjs:133`; `.opencode/skills/deep-loop-runtime/scripts/upsert.cjs:153`]. A bridge command or `--seed-source code_graph` mode should accept an init seed payload, dedupe identical seed nodes, and emit a no-op result only when a prior identical seed already exists. That keeps init repair and idempotency outside `convergence.cjs`, where `CONTINUE` currently hides whether the graph was truly empty or just not seeded.

   Port-difficulty: med. Tag: quick-win.

4. Ranked backlog: extend review graph seeding from changed-file impact, but keep it smaller than context mode.

   Reference mechanism: `loop-cli-main` project manager migrates old project files into a consolidated JSON array, skips corrupted files, loads valid entries into an in-memory map, and creates a default project if the inventory is absent [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/projects.ts:12`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/projects.ts:15`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/projects.ts:28`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/projects.ts:35`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/projects.ts:47`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/projects.ts:56`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/projects.ts:73`].

   Exact OUR target file: `.opencode/commands/deep/assets/deep_review_auto.yaml`.

   Why it helps: review graph convergence runs before the inline review stop vote [TARGET: `.opencode/commands/deep/assets/deep_review_auto.yaml:483`; `.opencode/commands/deep/assets/deep_review_auto.yaml:494`; `.opencode/commands/deep/assets/deep_review_auto.yaml:496`], but graph upsert only transforms latest iteration `graphEvents` and skips empty batches [TARGET: `.opencode/commands/deep/assets/deep_review_auto.yaml:1027`; `.opencode/commands/deep/assets/deep_review_auto.yaml:1033`; `.opencode/commands/deep/assets/deep_review_auto.yaml:1034`]. Seed review with changed `FILE` nodes and optional hotspot metadata from structural impact before the first graph convergence, while leaving richer `SYMBOL` / `DEPENDENCY` seeding to context mode unless the review vocabulary is deliberately expanded.

   Port-difficulty: med. Tag: quick-win.

5. Ranked backlog: only expand review/context coverage graph vocabularies where the signal math can use them.

   Reference mechanism: `loop-cli-main` init preserves only the relationships it can run: `projectId`, `taskId`, prior run state, and task resolver wiring are loaded before controllers start [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:56`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:66`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:69`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:78`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:86`].

   Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts`.

   Why it helps: context already allows `SLICE`, `FILE`, `SYMBOL`, and `DEPENDENCY` nodes plus `IMPORTS` / `DEPENDS_ON` edges [TARGET: `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts:194`; `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts:200`; `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts:209`], and context signal math uses `DEPENDENCY` completeness directly [TARGET: `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts:721`; `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts:734`; `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts:760`]. Review currently allows `FILE` but not `SYMBOL` / `DEPENDENCY` [TARGET: `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts:182`; `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts:184`], and its signal builder only consumes file hotspot metadata [TARGET: `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:163`; `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:180`]. So the first bridge should seed context dependencies deeply and review files shallowly; a deeper review rewrite should add vocabulary only with matching signal math.

   Port-difficulty: hard. Tag: deep-rewrite.

## Questions Answered

- S5-07 is not already answered by the last S4 iterations. Prior work covered min-iteration graph gates, mode-off semantics, dedupe, and scoring; this pass adds the missing init bridge from structural code graph output into runtime coverage graph nodes.
- The fastest actionable bridge belongs in `.opencode/commands/deep/assets/deep_context_auto.yaml`: convert `frontier_slices_json` into a pre-iteration graph upsert.
- Review should start smaller: seed changed/hotspot `FILE` nodes from structural impact first, then expand vocabulary only if review convergence learns how to use `SYMBOL` / `DEPENDENCY`.

## Questions Remaining

- What exact `code_graph_query` response shape should the bridge normalize: blast-radius files only, symbol nodes, import edges, or all three?
- Should the seed be written through a new `upsert.cjs --seed-source` mode or through YAML-built node/edge JSON using the existing `--nodes` / `--edges` contract?
- Should fallback-seeded nodes count toward `dependencyCompleteness`, or should they be visible but down-weighted until code-graph verification succeeds?

## Next Focus

[S5-08] Define the canonical seed-node identity scheme for code-graph bridge output so repeated init/resume runs dedupe `SLICE`, `FILE`, `SYMBOL`, and `DEPENDENCY` nodes without hiding stale or fallback-sourced structure.
