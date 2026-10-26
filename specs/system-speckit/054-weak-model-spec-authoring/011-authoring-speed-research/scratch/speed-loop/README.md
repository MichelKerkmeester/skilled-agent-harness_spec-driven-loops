# Speed loop

A short, rerunnable benchmark of how long a weak model takes to write a spec packet and then keep it up to date, on several spec-kit trees. It shows the speed cost of packet 054 and whether a later speed refinement removes it.

## What it measures

The subject is cli-devin `deepseek-v4-1-flash-1017-max`, the model the earlier authoring benchmark used. Each run has two timed steps: **author** writes a packet from a frozen brief, then **upkeep** sends a second brief against the packet the author step just wrote and asks for one new requirement, with strict validation still passing.

`--task` picks what the model is asked to do. Everything task-specific (the two briefs, the packet folder, the scored documents, the upkeep check and the leak-scan terms) comes from `set_task` in `lib.sh`; the rest of the loop is shared.

| Task | Author brief | Upkeep brief | Packet | Scored documents | Upkeep counts when the new REQ id is in |
|---|---|---|---|---|---|
| `quiet` (default) | `001-template-drift-census-and-baseline/scratch/baseline-swe-l3/brief-1.txt` | `upkeep-brief.txt` | `001-recommend-level-quiet-flag`, Level 3 | spec, plan, tasks, acceptance-criteria; anchor rule scored | `tasks.md` and `acceptance-criteria.md` |
| `minpct` | `018-benchmark-redesign-and-remeasure/scratch/briefs/author-minpct.txt` | `018-benchmark-redesign-and-remeasure/scratch/briefs/upkeep-minpct.txt` | `001-completeness-min-percent`, at the level the helper picks | spec, plan, tasks; `missing_anchors=NA` | `spec.md` and `tasks.md` |

`quiet` is the earlier benchmark's task, "Add a quiet flag to recommend-level.sh". The 054 templates later used that same task as their worked example, so on `now054` and `refined` the sandbox holds the answer and the other variants do not; read any `quiet` comparison with that in mind. `minpct` ("Add a `--min-percent <N>` option to `calculate-completeness.sh`") is a task no template, example or card names, and the leak scan below proves it per sandbox. The hint list (`hints-l3.txt`) is shared by both tasks.

All briefs use repository-relative paths only, so they are byte-identical across variants and name nothing that exists in only some trees. A real run refuses to start when a brief or the terms file of its task is missing or empty; a dry run only warns.

Every variant is a full copy of a tree in its own sandbox under the session scratchpad. None of them is this worktree.

| Variant | Tree | Why it is there |
|---|---|---|
| `pre054` | commit `ac2be31ec6` | Where the packet started. |
| `main-no054` | commit `9a80256f05` | The main side of the last merge into this branch: `pre054` plus 166 commits from main and none of 054. |
| `now054` | commit `84887f37f7` | All of 054, before the speed fixes. |
| `refined` | a snapshot of this worktree's tracked and untracked, not ignored, files | The speed refinement, once it lands. |

Read the deltas this way: `now054` minus `main-no054` is the cost of 054 alone. `now054` minus `pre054` also carries the main commits merged in between, because the branch took main twice. `refined` minus `now054` is the refinement effect. The loop warns when this worktree has merged other work after `84887f37f7`, since `refined` then carries drift that `main-no054` lacks.

Every sandbox is built the same way:

- The 054 packet folder and the `2026-10-25--model-eval--authoring-baseline` benchmark report are removed from every variant. The packet holds transcripts and copies of earlier runs of this exact task, and the earlier benchmark deleted it from its disposable worktree for the same reason. `prep/prep-times.tsv` records `quiet_flag_refs`, the count of files still naming the `quiet` packet folder, which is 0 in every sandbox.
- **Leak scan:** that folder-name count missed the templates that use the task as their worked example, so `prepare.sh` also counts the sandbox files under `.skilled/skills/system-spec-kit/templates/`, `references/templates/` and `references/workflows/spec-authoring-card.md` that name any term in the task's terms file (`018-benchmark-redesign-and-remeasure/scratch/briefs/task-terms.txt` for `minpct`). It writes the count as `task_term_refs=<n>` into the sandbox's `ready` file and `prep/prep-times.tsv`, together with `task=<task>`. A task without a terms file, or a scan that found none of those paths, records `NA`. For a task with a terms file, `loop.sh` reuses a sandbox only when its `ready` reads `task_term_refs=0` and is newer than the terms file, and it refuses to dispatch at all (exit 4) when any sandbox's count is not 0. Prepare runs under the task the loop exports in `SPEED_TASK`; a hand-run `prepare.sh` defaults to `quiet` and so records `NA`.
- The sandbox name is a random id, and its history is one parentless commit named `workspace snapshot`, so the model's working directory and git log name no variant. The id-to-variant map is `prep/sandbox-map.tsv`, in this worktree.
- node_modules is cloned copy-on-write from this worktree, never symlinked, so a model has no write path back into it.
- The system-spec-kit, skill-advisor and sk-vision builds are made in each sandbox, so the Devin prompt hooks inject the same kind of context in every variant.
- Preparation ends with the same warm-up everywhere: one create and one strict validate on a throwaway packet, then a check that the sandbox status is clean.
- Every dispatch passes `--respect-workspace-trust=false`. Devin refuses to run in a directory it has not trusted, and print mode cannot show the prompt that trusts one. Every sandbox is a new directory, so without the flag each dispatch fails at exit 1 in under a second.
- Every dispatch sets `SPECKIT_DIST_AUTO_REBUILD=0` (`step.sh`, on the dispatch line). Newer trees rebuild stale package builds at session start; a sandbox does not prebuild every package, so that rebuild would land inside the timed step and write build output. Trees without the hook ignore the switch, so every variant runs under the same conditions.

For every run and step the loop records:

- **Speed:** seconds from dispatch start to end.
- **Validation calls and tool calls:** read from the Devin session store. Tool calls are counted with `count(*)`, so a capped session still counts; `tool_calls_null` shows rows without call data.
- **Tokens:** uncached input, cached input and output, from the same store. A figure the store does not hold prints UNKNOWN.
- **Quality guards:** `strict_passed`, `leftover_hints`, `missing_anchors` (scored by the frozen anchor rule for `quiet`, `NA` for `minpct`) and `out_of_scope_writes`. For upkeep it also records `upkeep_applied`, plus `pre_strict` and `pre_hints`, the state the author step left.
- **Contamination:** the earlier benchmark's patterns over tool calls and their outputs. A run is `contaminated` when the model's own calls name the 054 packet, a specific pattern, or a path outside its sandbox. Every hit is listed in `<step>.hits`.
- **Isolation:** sandbox files changed outside the packet track, gitignored ones included (`sbx_side_writes`), processes left behind in the sandbox and killed (`leftover_procs`), and for this worktree new status lines, a changed tracked diff and node_modules writes during the step.

An untouched Level 3 scaffold passes strict validation, so always read `strict_passed` alongside `leftover_hints`.

## How to run

```bash
cd <worktree root>
bash specs/system-speckit/054-weak-model-spec-authoring/011-authoring-speed-research/scratch/speed-loop/loop.sh \
  --task minpct --variants pre054,main-no054,now054,refined --runs 5 --parallel-ok
```

| Flag | Default | Meaning |
|---|---|---|
| `--task` | `quiet` | `quiet` or `minpct`; see the task table above. The first line of the run prints `task=` and `packet=`. Apart from that line, `--task quiet` runs exactly the commands the loop ran before the switch existed. |
| `--variants` | `pre054,main-no054,now054` | The variants to compare. Add `refined` once the speed refinement is in this worktree. |
| `--runs N` | `2` | Rounds. Each round runs every variant once, all started together in a shuffled order. |
| `--parallel-ok` | off | Required for a real run with more than one variant. It is the explicit authorization cli-devin asks for before parallel dispatches, each in `--permission-mode dangerous`. |
| `--dry-run` | off | Prints every command without preparing, dispatching or writing anything. |
| `--no-upkeep` | off | Times the author step only. |
| `--author-timeout`, `--upkeep-timeout` | `480`, `240` | Per-step cap in whole seconds, at least 1. A capped run is flagged and left out of the means. |
| `--reuse-refined` | off | Keeps the existing refined snapshot instead of taking a new one. |
| `--fresh` | off | Re-prepares every variant before the first round. |

Sandboxes live under `SPEED_SANDBOX_ROOT`, which defaults to this session's scratchpad `speed-loop/` folder. A lock in that folder stops a second loop, or a hand-run `prepare.sh`, from touching the sandboxes while a loop runs. The loop reuses a sandbox only when it is clean, holds no packet and is not marked dirty; otherwise it runs `prepare.sh <variant>` itself. Refined is retaken on every run.

Ctrl-C stops the loop cleanly: it kills every dispatch still running, marks the sandboxes dirty so the next run rebuilds them, and releases the lock.

## How long it takes

- **Preparation:** once per variant. On 2026-10-25, pre054 took 68 seconds, main-no054 56, now054 61 and refined 115 (`prep/prep-times.tsv`). Each sandbox uses about 1.9 GB of disk.
- **Each round:** about as long as the slowest author step plus the slowest upkeep step, plus about 30 seconds of snapshots and scoring. In the earlier benchmark this model took 217 to 298 seconds on the `ac2be31ec6` tree and 164 to 228 seconds after its fixes, under different conditions, so expect roughly 6 to 9 minutes a round. The caps hold a round to 12 minutes of dispatch plus scoring. `round.tsv` records each round's wall time and flags any round over the 900 second budget.
- **Default run:** two rounds, so plan on 12 to 18 minutes.

Absolute seconds are not comparable with the earlier benchmark: the sandboxes, the caps, the parallel load and the hook builds all differ. Compare variants within one results folder only.

## How to read summary.md

`results/<stamp>/summary.md` has four parts.

1. **Runs per variant and step:** valid runs out of all runs, and the excluded ones by reason: timed out, failed exit code, contaminated, or aborted, skipped or missing. Then min, max and mean seconds, token means, validation and tool-call means, and the guards. A valid run exited 0, stayed under its cap and was not contaminated; only valid runs enter the means.
2. **Upkeep from a clean start:** upkeep seconds for runs whose author packet passed strict validation with 0 leftover hints, so repair work does not count as maintenance.
3. **Paired difference per round:** for each round, the variant's seconds minus the baseline's seconds from that same round, with min, max and mean, the delta of means, and the strict and hints guards beside it. The seconds verdict is SLOWER or FASTER only when at least two pairs all share one sign; otherwise it reads INCONCLUSIVE. The earlier benchmark saw runs of one set spread by 64 to 81 seconds, so a gap smaller than that needs more rounds. Beside it, `summarize.py` prints a tok_out verdict column: REAL only with at least 4 valid pairs that all share one sign, INCONCLUSIVE otherwise.
4. **Rounds:** launch order, wall seconds against the budget, and launch skew between the first and last variant starting a step.

`results.tsv` has one row per run and step, including a row for every aborted, skipped or missing step. Each run's evidence sits under `results/<stamp>/<variant>/r<round>/`: the brief, stdout and stderr, the session tool calls and outputs, contamination hits, side writes, leftover processes, the validator output and a copy of the packet after each step.

`wt-r<round>-<step>-new.txt` lists new status lines in this worktree outside the loop folder during that step, and `-nm.txt` lists node_modules writes. Other agents may be editing the tree at the same time, so a line there means look, not guilt.

## Decision rule

A comparison between two variants is REAL only when at least 4 of the 5 rounds give a valid pair and every valid pair has the same sign on the comparison's metric: `tok_out` (output tokens) for speed, the blind grader total for quality. A quality claim also needs the deterministic rescore (the `Verify:` ratio or the template residue count) to move the same way in the variant means. Every other comparison is INCONCLUSIVE. Seconds are reported beside every verdict and never decide one alone: paired seconds in the earlier three-round runs spread by up to about 200 seconds. The rule is stated in `018-benchmark-redesign-and-remeasure/spec.md`, REQ-006; the blind grades and the rescore live in that phase's `scratch/`, not in this loop.
