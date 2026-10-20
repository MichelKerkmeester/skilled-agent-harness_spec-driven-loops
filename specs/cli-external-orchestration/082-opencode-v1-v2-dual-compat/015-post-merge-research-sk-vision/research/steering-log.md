# Steering Log - post-merge research (sk-vision OpenCode 2 runtime)

Orchestrator-owned record of each iteration focus. Angle ids continue the A1-A17 numbering of the original run in `../../research/steering-log.md`; this sibling runs A23 (sk-vision OpenCode 2 runtime) in parallel with phase 014.

## Entry 23 (iteration 1)

- Angle: A23
- Focus: A23 sk-vision OpenCode 2 runtime bugs: which runtime paths in `.skilled/skills/sk-vision/vision-runtime/src/` can still misbehave on OpenCode 2 after phases 012 and 013 of packet 082? Cover tool registration in `plugin.ts` `setup` (the `ctx.tool.transform` path, the `SK_VISION_AUTOINSPECT` switch, ordering after the prompt hook, fail-open behaviour), `opencode/tools.ts` `toV2Tools`, the 2-second grace path for models off the text-only list, and `runtime/client.ts` `close()`, the 5-second interpreter checks and the venv `mkdir` race that phase 013 left open (`specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/013-sk-vision-v2-tools-and-loose-ends/implementation-summary.md`). Output: a ranked bug list with file:line evidence, each labelled confirmed, documented or inferred, and the fix each needs. Check: read the sources and tests and run `bun test` in `vision-runtime` read-only; never edit files outside this research packet.

### Dispatch failure (iteration 1, not a model fault)

The first dispatch (`research-i1-g1`) failed twice over: cli-pi exited 1 after 137 s on an llmgateway HTTP 500, and write containment recorded a `containment_violation` whose paths were other lineages' files (014's `steering-log.md` and the 016-018 dispatch intent receipts). Cause: five lineages ran concurrently in one worktree, so each containment diff saw its siblings' writes. The one redispatch was stopped before it finished. This packet then moved into its own worktree (`.worktrees/150-post-merge-research-sk-vision`) and iteration 1 reruns there.

## Executor switch (restart to generation 2)

The operator switched the executor to GLM 5.3 flash because llmgateway kept returning HTTP 500 and request timeouts for deepseek-v4.1-flash, opencode-go was over its usage limit and cline-pass returned 403. The session held no completed iteration, and its config pins the executor model, so it was restarted through the workflow's `restart` branch: the empty generation 1 moved to `../research_archive/20261019T190902Z/`, and this generation runs on cli-pi `glm-5.3-flash` (llmgateway, thinking max). Foci and angle ids are unchanged.

## Entry 23 (iteration 1)

- Angle: A23
- Focus: A23 sk-vision OpenCode 2 runtime bugs: which runtime paths in `.skilled/skills/sk-vision/vision-runtime/src/` can still misbehave on OpenCode 2 after phases 012 and 013 of packet 082? Cover tool registration in `plugin.ts` `setup` (the `ctx.tool.transform` path, the `SK_VISION_AUTOINSPECT` switch, ordering after the prompt hook, fail-open behaviour), `opencode/tools.ts` `toV2Tools`, the 2-second grace path for models off the text-only list, and `runtime/client.ts` `close()`, the 5-second interpreter checks and the venv `mkdir` race that phase 013 left open (`specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/013-sk-vision-v2-tools-and-loose-ends/implementation-summary.md`). Output: a ranked bug list with file:line evidence, each labelled confirmed, documented or inferred, and the fix each needs. Check: read the sources and tests and run `bun test` in `vision-runtime` read-only; never edit files outside this research packet.

### Digest (iteration 1, generation 2)

A23 done (ratio 0.71). P1: the setup teardown leaks every later disposal when one throws (f-001, confirmed); an unreadable session model silently downgrades to the 2 s grace (f-002, inferred). P2: the 15 s startup ping timer is never cleared (f-003); `V2PluginContext` is hand-maintained (f-004). P3: command-transform failure aborts tools and hook (f-005); venv mkdir residue stands (f-006); 5 s probes conflate slow with missing (f-007). The leaf also wrote a stray delta copy under the misspelled `specs/cli-external/` track; containment preserved it, the real delta verified, and the stray file is excluded from commits. Angle complete; synthesis next.
