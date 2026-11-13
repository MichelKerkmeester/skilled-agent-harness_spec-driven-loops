# Iteration 3: Composed degraded-CLI cost and headroom against the 2,500 ms budget

## Focus

Compose the two degraded shapes the way the hook pays them: one fresh process that imports the CLI first, then either the in-process handler (rank 6) or the Python spawn (today). This tests the budget claim with whole-process measurements rather than summed medians, and adds the 10,000-character prompt cap and the CLI's own boot cost.

## Actions Taken

1. Wrote `scratch/compose-timing.mjs`: it imports the built CLI module first, then the handler or `runAdvisorSubprocess`, and prints the whole-process elapsed time. One fresh process per prompt.
2. Ran ten proposed and ten today runs over the same ten prompts, with the scratch database and `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1`.
3. Ran one proposed run at the 10,000-character prompt cap and a handler-only long-prompt sample: five cold, ten warm.
4. Measured the CLI's own process boot with ten `--version` spawns.

## Findings

1. The CLI's module import costs a median of 3.85 ms and a worst of 5.26 ms inside a fresh process. The CLI's own startup is not the budget driver. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/inprocess-timing-4/scratch/iteration-003-summary.json]
2. The composed proposed path costs a median of 231.1 ms and a worst of 428.5 ms per fresh process, including CLI import, handler import and one scoring call. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/inprocess-timing-4/scratch/compose-proposed.jsonl]
3. The composed today path costs a median of 219.9 ms and a worst of 544.3 ms on the same prompts, including CLI import and the Python spawn. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/inprocess-timing-4/scratch/compose-today.jsonl]
4. At its worst the proposed path leaves 2,071.5 ms of the 2,500 ms budget, 82.9 percent; today's worst leaves 1,955.7 ms, 78.2 percent. The proposed path costs 11.2 ms more at the median and 115.8 ms less at the worst case. [INFERENCE: derived from the composed rows in the two files above, each total subtracted from 2,500]
5. At the 10,000-character prompt cap the composed proposed path costs 335.0 ms, 13.4 percent of the budget, and the handler alone costs a cold median of 242.1 ms and a worst of 424.1 ms over five runs, with a warm median of 147.1 ms and a worst of 215.3 ms over ten. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/inprocess-timing-4/scratch/iteration-003-summary.json]
6. A whole CLI process that only prints its version costs a median of 33.6 ms and a worst of 39.9 ms, which is the floor any degraded hook call pays before scoring starts. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/inprocess-timing-4/scratch/cli-startup.jsonl]

## Ruled Out

- Summing the separately measured medians (CLI startup, handler import, handler call) as if that were a measurement. The composed process run replaces the sum and is the number quoted for the budget.
- Treating the `--version` spawn as the CLI's import cost. The spawn includes Node boot; the in-process import is 3.85 ms, and both are reported separately. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/inprocess-timing-4/scratch/compose-proposed.jsonl]

## Dead Ends

- None this iteration.

## Edge Cases

- Ambiguous input: the hook's own pre-CLI work is not measured, because running the hook would start a daemon. Selected interpretation: report the full budget as headroom available to the rest of the hook, which is the conservative reading. Deferred: a live hook arm.
- Contradictory evidence: none. The median moves up 11.2 ms and the worst case moves down 115.8 ms; both are reported.
- Missing dependencies: none.
- Partial success: the long-prompt composed sample is one run; the handler-only long sample is fifteen runs and is reported beside it.

## Commands and Output

```text
$ for i in 0..9; do SYSTEM_SKILL_ADVISOR_DB_DIR=<lineage>/scratch/db node <lineage>/scratch/compose-timing.mjs proposed $i; done
{"mode":"proposed","index":0,..."totalMs":275.027875}
{"mode":"proposed","index":2,..."totalMs":428.525}
... 10 lines in scratch/compose-proposed.jsonl

$ for i in 0..9; do ... compose-timing.mjs today $i; done
{"mode":"today","index":9,..."totalMs":544.278791}
... 10 lines in scratch/compose-today.jsonl

$ node <lineage>/scratch/compose-timing.mjs proposed-long 0
{"mode":"proposed-long","index":0,"chars":9997,"totalMs":334.992291,...}

$ node <lineage>/scratch/spawn-timing.mjs 10 cli-version -- node <CLI> --version
{"label":"cli-version","summary":true,"n":10,"median":33.568667000000005,"worst":39.93237499999998,"best":31.818167000000017}
```

## Sources Consulted

- .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1455
- .skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:305
- .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:144
- .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:230
- specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/inprocess-timing-4/scratch/compose-proposed.jsonl
- specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/inprocess-timing-4/scratch/compose-today.jsonl
- specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/inprocess-timing-4/scratch/compose-proposed-long.jsonl
- specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/inprocess-timing-4/scratch/cli-startup.jsonl

## Assessment

- New information ratio: 1.0
- Questions addressed: the budget headroom question
- Questions answered: the budget headroom question

## Reflection

- What worked and why: composing the path in one process measured the thing the hook pays, and it exposed that the worst case favors the in-process path even though the median does not. The CLI import turned out to be negligible, so the earlier `--version` spawn number was misleading on its own.
- What did not work and why: summing medians would have overstated the CLI's share and hidden the worst-case variance in the Python spawn.
- What I would do differently: measure the composed path in the first iteration and use the component runs only to explain it.

## Recommended Next Focus

No further measurement is needed for the build-or-decline answer: all five key questions now carry numbers from commands run in this lineage. Synthesis should state the build, name the two files the change touches, and quote the measured gain and the floor check.
