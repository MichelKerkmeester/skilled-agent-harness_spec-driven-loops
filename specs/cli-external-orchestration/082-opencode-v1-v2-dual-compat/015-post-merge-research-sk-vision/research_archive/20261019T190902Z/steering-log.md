# Steering Log - post-merge research (sk-vision OpenCode 2 runtime)

Orchestrator-owned record of each iteration focus. Angle ids continue the A1-A17 numbering of the original run in `../../research/steering-log.md`; this sibling runs A23 (sk-vision OpenCode 2 runtime) in parallel with phase 014.

## Entry 23 (iteration 1)

- Angle: A23
- Focus: A23 sk-vision OpenCode 2 runtime bugs: which runtime paths in `.skilled/skills/sk-vision/vision-runtime/src/` can still misbehave on OpenCode 2 after phases 012 and 013 of packet 082? Cover tool registration in `plugin.ts` `setup` (the `ctx.tool.transform` path, the `SK_VISION_AUTOINSPECT` switch, ordering after the prompt hook, fail-open behaviour), `opencode/tools.ts` `toV2Tools`, the 2-second grace path for models off the text-only list, and `runtime/client.ts` `close()`, the 5-second interpreter checks and the venv `mkdir` race that phase 013 left open (`specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/013-sk-vision-v2-tools-and-loose-ends/implementation-summary.md`). Output: a ranked bug list with file:line evidence, each labelled confirmed, documented or inferred, and the fix each needs. Check: read the sources and tests and run `bun test` in `vision-runtime` read-only; never edit files outside this research packet.

### Dispatch failure (iteration 1, not a model fault)

The first dispatch (`research-i1-g1`) failed twice over: cli-pi exited 1 after 137 s on an llmgateway HTTP 500, and write containment recorded a `containment_violation` whose paths were other lineages' files (014's `steering-log.md` and the 016-018 dispatch intent receipts). Cause: five lineages ran concurrently in one worktree, so each containment diff saw its siblings' writes. The one redispatch was stopped before it finished. This packet then moved into its own worktree (`.worktrees/150-post-merge-research-sk-vision`) and iteration 1 reruns there.
