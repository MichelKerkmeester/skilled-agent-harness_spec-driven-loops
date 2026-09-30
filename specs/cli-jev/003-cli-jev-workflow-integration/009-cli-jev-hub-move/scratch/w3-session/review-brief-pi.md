# Cross-family review: one phase's uncommitted routing move

You are a read-only reviewer. You are MiMo v2.6 Pro (Pi), and the files in your share were written by DeepSeek V4.1 Flash through Devin, a different model family. Never dispatch another agent. Never edit, create or delete a file. Never run a git command that writes (no add, commit, stash, checkout, restore, reset, mv, rm). Do not run `refresh`, `mint`, any `--write` generator or `npm run build`. Do not call `jev`, the Deem server or any network service. Never open a `.env` file.
Worktree root (run every command from here): `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration`

**Your share.** Your share is what Devin DeepSeek wrote: area 2 (the rollout child `lib/registry-compiler.cjs`, `lib/router.cjs`, `lib/policy-card.cjs`, `harness/build-artifacts.cjs`, both trees), area 3 (every literal list, `dispatch-audit.mjs` and its two tests), `.skilled/skills/cli-classifier/mode-registry.json` and `hub-router.json` from area 1, `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-merge.vitest.ts`, and area 5 (replay). Skip the rest: the other reviewer has it.

Worktree root (run every command from here): `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration`

## Scope

Phase folder: `specs/cli-jev/003-cli-jev-workflow-integration/009-cli-jev-hub-move`. The build is uncommitted and staged in part. Read the phase `spec.md` (requirements, file list), `goal.md` and `scratch/w3-build/build-evidence.md` first. `git diff HEAD -M --name-status` lists what changed (renames, edits, deletes). Review these areas, opening each file in full where it is new or merged, and the diff where it is an edit:
1. The merged hub: `.skilled/skills/cli-classifier/{mode-registry.json,hub-router.json,graph-metadata.json,description.json,leaf-manifest.json,SKILL.md,ROUTER.md,README.md}` and its playbook `manual-testing-playbook/hub-routing/`. Check the two modes, the tie-break and ordered bundle, the vocabulary of both modes, and that no field of either source hub was dropped in the merge (compare with `git show HEAD:.skilled/skills/cli-jev/<file>` and `git show HEAD:.skilled/skills/cli-classifier/<file>`).
2. The compiled rollout child `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/008-cli-classifier/**` and its authored twin under `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/`: the registry compiler, router, policy card, harness and canary corpus. Check it compiles and serves both modes and cannot route a Jev prompt to the Deem mode or the reverse. Check the two trees agree.
3. The literal lists: `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/{compiled-route,resolve}.cjs`, `.skilled/bin/compiled-route-{guard,sync}.cjs`, `.skilled/skills/system-skill-advisor/runtime/lib/compiled-routing-flag.ts`, `.skilled/bin/lib/compiled-routing/serving-closure.manifest.json`, `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` and its two tests. Check every list names `cli-classifier` once and `cli-jev` nowhere, and that no cohort copy was missed (search the tree for the other copies).
4. The activation pair `.skilled/bin/lib/compiled-routing/013-live-activation/activation/cli-classifier/` and its authored twin. Run `node .skilled/bin/compiled-route-manifest.cjs freshness --hub cli-classifier --skill-root .skilled/skills/cli-classifier` and read it. Check no digest looks hand-written: `refresh` must re-derive the same bytes (do not run `refresh`, it writes; reason from `freshness` and the library code).
5. The replay: `build-evidence.md` claims a 17-row comparison of `route-baseline.txt` against the post-move replay. Re-run `zsh /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/13974574-59f7-48b5-b4cd-aa93ca9ca737/scratchpad/w3/009/replay.sh cli-classifier /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/13974574-59f7-48b5-b4cd-aa93ca9ca737/scratchpad/w3/009/review-replay-pi.txt` (it writes one scratch file) and compare with the baseline on `action`, `selectionKind`, `packetId` and exit code. Add 3 prompts of your own that could route wrongly (a prompt naming both jev and deem, a prompt naming neither, a Deem-only prompt) and say what each returns.

## What to look for

Correctness against the phase requirements; a route that differs from the baseline; a stale `.skilled/skills/cli-jev/` path outside `specs/`, changelogs and dated benchmark reports (`git grep -n` for it); a changelog or dated report edited (they must stay byte-identical: check `git diff HEAD -M` shows R100); secrets or a `.env` read; comment hygiene (no spec paths, packet or phase numbers, REQ or task ids in code comments); Jev and Deem privacy gate words weakened anywhere in a doc; tests that assert nothing or mirror the implementation; the sk-code OpenCode standards and the `skill-hub-routing` rule (`.skilled/repo-rules/skill-hub-routing.md`). Skip style nits a formatter would settle.

## Severity

P0: wrong route, data loss, a secret leak, a broken gate or a hub that no longer serves. P1: a requirement not met, a missing edge case the spec names, a test gap on a changed public surface, a dropped field, or a stale live path. P2: everything else worth fixing.

## Report (under 450 words)

One line per finding: `P0|P1|P2 file:line - what is wrong - the concrete input or state that shows it`. Cite only lines you opened. Then one line per phase requirement you checked: `REQ-xxx met|not met|not checked - why`. End with `VERDICT: PASS` (no P0 or P1) or `VERDICT: FAIL`.
