# DRIFT and repair transcript for the two Hermes checkers

The route is a documented workflow, not an executable program, so the manual run it
describes is exercised here at the checker level: the same commands the route would
run, with the same verdict mapping. The tracked `.hermes/` tree is outside the write
authority of the run that produced this file, so the skills cycle runs against a copy
in a scratch directory (the generator honours `HERMES_SKILLS_OUTPUT_DIR`).

## sync-skills-hermes.cjs: in sync, drift, repair

```text
$ HERMES_SKILLS_OUTPUT_DIR=<scratch>/hermes-skills node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check
PASS: 65 Hermes skill copies in sync
exit 0

$ printf "\nHand-edited line ...\n" >> <scratch>/hermes-skills/sk-git/SKILL.md
$ HERMES_SKILLS_OUTPUT_DIR=<scratch>/hermes-skills node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check
DRIFT sk-git
FAIL: 1 drifted, 0 stale; run without --check to regenerate
exit 1

$ HERMES_SKILLS_OUTPUT_DIR=<scratch>/hermes-skills node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs   # the repair line
Wrote 1 of 65 Hermes skill copies; pruned 0
exit 0

$ HERMES_SKILLS_OUTPUT_DIR=<scratch>/hermes-skills node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check
PASS: 65 Hermes skill copies in sync
exit 0
```

The hand edit produced `DRIFT sk-git` and exit 1, and the repair line for that row
(the generator without `--check`) returned the tree to `PASS` and exit 0.

## sync-prompts-hermes.cjs: in sync only

```text
$ node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-prompts-hermes.cjs --check
[hermes-prompt-sync] PASS: 38 prompts are in sync.
exit 0
```

`sync-prompts-hermes.cjs` pins its output root at `.hermes/prompts` and exposes no
override, so the worker could not produce a drifted prompt copy without writing inside
the tracked `.hermes/` tree. The worker observed the in-sync half and read the drift
mapping from the script; the conductor then ran the drift half once on the tracked tree,
recorded at the end of this file. The script's mapping: `checkOutputs`
returns false on any MISSING, STALE or EXTRA entry and the entry point maps that to
exit 1, so the route reports DRIFT and its repair line is the generator without
`--check`. The same 0-or-1 mapping is exercised for real by the skills sibling above.

## Prompts drift on the tracked tree (conductor run)

```text
$ echo "hand edit" >> .hermes/prompts/create-agent.md
$ node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-prompts-hermes.cjs --check
[hermes-prompt-sync] Drift detected:
[hermes-prompt-sync] STALE .hermes/prompts/create-agent.md
exit 1
$ node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-prompts-hermes.cjs
[hermes-prompt-sync] Wrote 1 of 38 generated prompts.
$ node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-prompts-hermes.cjs --check
[hermes-prompt-sync] PASS: 38 prompts are in sync.
exit 0
$ git status --short -- .hermes | wc -l
0
```
