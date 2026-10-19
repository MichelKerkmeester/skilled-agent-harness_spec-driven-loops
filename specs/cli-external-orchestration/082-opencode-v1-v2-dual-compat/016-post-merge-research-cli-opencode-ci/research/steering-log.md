# Steering Log - post-merge research (cli-opencode, doctor and CI)

Orchestrator-owned record of each iteration focus. Angle ids continue the A1-A17 numbering of the original run in `../../research/steering-log.md`; this sibling runs A24-A25 (cli-opencode, doctor and CI) in parallel with phase 014.

## Entry 24 (iteration 1)

- Angle: A24
- Focus: A24 cli-opencode docs and flag drift: where do `.skilled/skills/cli-external-orchestration/cli-opencode/` (SKILL.md, references, assets) and its dispatch code disagree with OpenCode 1.19.3 (`opencode`) and 2.0.32 (`opencode2`) as installed on this machine? Compare every documented flag, subcommand and dispatch shape against `opencode --help`, `opencode run --help`, `opencode2 --help` and `opencode2 run --help`, and the version detection in the deep-loop runtime (`.skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs`). Output: a drift table (doc claim, installed reality, file:line, severity) labelled confirmed or documented. Check: run the help commands only; never start, stop or restart any OpenCode service or server (PID 46220 is shared), never run `opencode upgrade`, and never edit files outside this research packet.

### Dispatch stopped (iteration 1, not a model fault)

The first dispatch (`research-i1-g1`) was stopped by the orchestrator before it completed: it shared one worktree with four other lineages, and the 014 and 015 dispatches had already failed write containment on each other's files. No iteration record was written. This packet then moved into its own worktree (`.worktrees/151-post-merge-research-cli-opencode-ci`) and iteration 1 reruns there.

## Executor switch (restart to generation 2)

The operator switched the executor to GLM 5.3 flash because llmgateway kept returning HTTP 500 and request timeouts for deepseek-v4.1-flash, opencode-go was over its usage limit and cline-pass returned 403. The session held no completed iteration, and its config pins the executor model, so it was restarted through the workflow's `restart` branch: the empty generation 1 moved to `../research_archive/20261019T190906Z/`, and this generation runs on cli-pi `glm-5.3-flash` (llmgateway, thinking max). Foci and angle ids are unchanged.

## Entry 24 (iteration 1)

- Angle: A24
- Focus: A24 cli-opencode docs and flag drift: where do `.skilled/skills/cli-external-orchestration/cli-opencode/` (SKILL.md, references, assets) and its dispatch code disagree with OpenCode 1.19.3 (`opencode`) and 2.0.32 (`opencode2`) as installed on this machine? Compare every documented flag, subcommand and dispatch shape against `opencode --help`, `opencode run --help`, `opencode2 --help` and `opencode2 run --help`, and the version detection in the deep-loop runtime (`.skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs`). Output: a drift table (doc claim, installed reality, file:line, severity) labelled confirmed or documented. Check: run the help commands only; never start, stop or restart any OpenCode service or server (PID 46220 is shared), never run `opencode upgrade`, and never edit files outside this research packet.

### Digest (iteration 1, generation 2)

A24 done (ratio 0.9). The dual-version CI workflow failed on main three runs in a row (39294766387, 39299540911, 39308825187); the 18:04 run died on `bun: command not found` before the battery ran. Doc drift: `--share` documented as a v1 detached flag, the default model named two ways, agents path named two ways, v2 `--log-level` marked unverified though 2.0.32 lists it, and the SKILL.md v1 flag list misses `--attach`, `-p`, `-u`, `-i`. Positive controls: version strings, v1-only flags and the version resolver match. Next: A25.

## Entry 25 (iteration 2)

- Angle: A25
- Focus: A25 Doctor battery and dual-version CI: does `.skilled/commands/doctor/scripts/opencode-version-battery.cjs` test what `/doctor` and packet 082 claim (plugin-active counts, skill visibility, version families) without pinning stale numbers, and does `.github/workflows/opencode-dual-version.yml` install both pinned versions and run the battery and smoke checks it claims? Read the workflow, run `gh run list --workflow opencode-dual-version.yml --limit 5` and `gh run view` on the latest run on main to see whether it ran and passed after the 2026-10-19 merges, and compare its pins with the installed 1.19.3 and 2.0.32. Output: claim-versus-reality rows with file:line or run URL, labelled confirmed or documented, plus the CI verdict. Check: `gh` read-only commands and the battery's own source; never start, stop or restart the shared OpenCode 2 service (PID 46220) and never edit files outside this research packet.

### Digest (iteration 2, generation 2)

A25 done (ratio 0.85). The battery matches its contract leg by leg and pins no versions or counts. The workflow installs `opencode-ai@1.19.3` and `@opencode/cli@2.0.32` and runs the battery per family and with both installed. It runs no smoke dispatch, and `opencode-config-shape.test.cjs` is a trigger path with no job. CI is green on main: run 39309852507 on `793b50ccbf`, 19:18Z, all three jobs. The preceding run 39308825187 failed v1 `plugin-load` and v2 `plugin-active` (`system-skill-advisor.js`, `system-spec-gate.js` status failed). This supersedes iteration 1's red-on-main verdict.

### Gateway check (round 2)

The round summary counted 2 gateway-error lines in the 014 log and 1 in the 018 log. Those counts came from a loose pattern (`rate` instead of `rate.limit`) that also matches words such as "iterate" and "generate". A recount of the same logs with the strict pattern found 0 in all three. No gateway errors occurred in round 2, so the round stays at full concurrency. The pattern in the round script is now fixed.

### Spot checks by the orchestrator (before synthesis)

- `gh run view 39309852507`: success on `793b50ccbf`, all three jobs success; `gh run list` shows the three earlier failures. Confirmed.
- `opencode run -m opencode-go/deepseek-v4.1-flash --help </dev/null | grep -c -- --share` prints 0. Confirmed for the help surface.
- `SKILL.md:158` names `deepseek-v4.1-flash`, while `cli-reference.md:158` and `:281` name `deepseek-v4-flash`. Confirmed.
- The workflow lists `opencode-config-shape.test.cjs` at lines 18 and 33, the trigger paths, and in no step. Confirmed.
