# Iteration 37: S5-02 Loop-Wide Dry-Run Preview

## Focus

[S5-02] What would a loop-wide dry-run mode look like, using kasper `--dry-run` as the reference mechanism, that renders planned iterations, prompts, and convergence checks without dispatching executors?

## Actions Taken

1. Searched the kasper reference repo for `--dry-run`, `dryRun`, and preview-related paths.
2. Read kasper's slash-command parser, tool schema, and `executeKasperImprove` implementation.
3. Read our `/deep:research` mode routing and `deep_research_confirm.yaml` loop/dispatch sections.
4. Read our prompt renderer, convergence CLI, and fan-out runner surfaces to map a loop-wide preview boundary.
5. Checked prior research artifacts for `S5-02` and dry-run coverage; only the registry question appeared, so this focus was not already covered.

## Findings

1. **Rank 1: Thread dry-run as a first-class command/tool input, not a separate workflow mode.** Kasper exposes `dry_run` in the MCP tool schema and forwards it into `executeKasperImprove` as `dryRun`; the slash command also parses `--dry-run`, removes it from the agent argument, and calls the same implementation path [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/tools.ts:39-62`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/handlers.ts:1015-1023`]. Our target is `.opencode/commands/deep/research.md:109-116` plus `.opencode/commands/deep/assets/deep_research_confirm.yaml:28-33`: add `--dry-run` as a workflow input that keeps `:confirm`/`:auto` routing intact, then bind it into the YAML. Port difficulty: easy. Tag: quick-win. Why it helps: operators get a preview without inventing a third execution mode or bypassing the existing setup contract.

2. **Rank 2: Reuse the real planning/rendering path, then return before dispatch.** Kasper's dry-run builds the same header, weakness table, fix text, and status footer as the real improve command, then changes only the terminal message and returns before queue mutation [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/handlers.ts:432-472`]. Our target is `.opencode/commands/deep/assets/deep_research_confirm.yaml:587-640`: after `render_prompt_pack`, emit a dry-run artifact showing iteration number, focus, state summary, prompt path/content hash, executor type, and the concrete command that would run, then skip the executor branch. Port difficulty: med. Tag: quick-win. Why it helps: the preview proves the exact prompt and command shape without spending executor budget or creating iteration files.

3. **Rank 3: Make the side-effect boundary explicit and testable.** Kasper's mutation is concentrated in `weaknessToPending`, and `if (args.dryRun) return result` sits directly before that loop [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/handlers.ts:467-476`]. Our target is `.opencode/commands/deep/assets/deep_research_confirm.yaml:711-734`: dry-run should skip post-dispatch validation, state reduction, delta/state-log expectations, and executor audit writes because no iteration was actually executed. Port difficulty: med. Tag: quick-win. Why it helps: dry-run stays honest; it previews planned effects without producing reducer-owned state that later looks like evidence.

4. **Rank 4: Use convergence as a previewable read model.** Kasper tells the operator exactly that nothing was queued and how to run the mutating path [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/handlers.ts:467-469`]. Our target is `.opencode/commands/deep/assets/deep_research_confirm.yaml:456-468` and `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:356-520`: call or model the existing convergence CLI without `--persist-snapshot`, capture its JSON decision/signals/blockers, and include a "would continue / would stop / blocked by" section in the dry-run output. Port difficulty: easy. Tag: quick-win. Why it helps: the dry-run renders planned convergence checks with real graph semantics while avoiding snapshot writes.

5. **Rank 5: Extend dry-run across fan-out before subprocess spawn.** Kasper's parser/tool flag is carried all the way to the mutation boundary, so alternate invocation surfaces share one behavior [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/tools.ts:39-62`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/handlers.ts:403-405`]. Our target is `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:233-256`, `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:406-466`, and `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:600-624`: add a `--dry-run` branch that builds each lineage prompt and command plan, returns JSON, and never spawns child processes. Port difficulty: med. Tag: deep-rewrite. Why it helps: "loop-wide" dry-run includes multi-executor runs, where previewing model, sandbox, lineage dir, and prompt body matters most.

## Questions Answered

- `S5-02`: A loop-wide dry-run should be a first-class workflow input that executes the same setup, focus selection, prompt rendering, executor resolution, and convergence-read logic as a normal run, then stops at explicit mutation boundaries: no executor dispatch, no queue/state mutation, no reducer refresh, and no fan-out child spawn.

## Questions Remaining

- Should dry-run write a durable preview artifact under `research/previews/`, or print only to the command response? Durable artifacts are more auditable; print-only avoids new packet cleanup rules.
- Should dry-run be supported for `:auto` immediately, or land first in `:confirm` where the approval gates already give the operator a natural preview surface?

## Next Focus

[S5-03] Investigate the nearest unexplored cross-cutting loop UX/control mechanism in segment 5, preferably one that complements dry-run with pause/resume, run-now, or operator dashboard behavior.
