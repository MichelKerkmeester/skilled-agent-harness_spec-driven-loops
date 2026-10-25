# Speed loop

A short, rerunnable benchmark of how long a weak model takes to write a spec packet and then keep it up to date, on several spec-kit trees. It shows the speed cost of packet 054 and whether a later speed refinement removes it.

## What it measures

The subject is cli-devin `deepseek-v4-1-flash-1017-max`, the model and Level 3 task the earlier authoring benchmark used: "Add a quiet flag to recommend-level.sh". Each run has two timed steps.

1. **author** sends the frozen brief `001-template-drift-census-and-baseline/scratch/baseline-swe-l3/brief-1.txt` unchanged.
2. **upkeep** sends `upkeep-brief.txt` against the packet the author step just wrote. It asks for one new requirement with its task line and acceptance row, with strict validation still passing.

Both briefs use repository-relative paths only, so they are byte-identical across variants and name nothing that exists in only some trees.

Every variant is a full copy of a tree in its own sandbox under the session scratchpad. None of them is this worktree.

| Variant | Tree | Why it is there |
|---|---|---|
| `pre054` | commit `ac2be31ec6` | Where the packet started. |
| `main-no054` | commit `9a80256f05` | The main side of the last merge into this branch: `pre054` plus 166 commits from main and none of 054. |
| `now054` | commit `84887f37f7` | All of 054, before the speed fixes. |
| `refined` | a snapshot of this worktree's tracked and untracked, not ignored, files | The speed refinement, once it lands. |

Read the deltas this way: `now054` minus `main-no054` is the cost of 054 alone. `now054` minus `pre054` also carries the main commits merged in between, because the branch took main twice. `refined` minus `now054` is the refinement effect. The loop warns when this worktree has merged other work after `84887f37f7`, since `refined` then carries drift that `main-no054` lacks.

Every sandbox is built the same way:

- The 054 packet folder and the `2026-10-25--model-eval--authoring-baseline` benchmark report are removed from every variant. The packet holds transcripts and copies of earlier runs of this exact task, and the earlier benchmark deleted it from its disposable worktree for the same reason. `prep/prep-times.tsv` records `quiet_flag_refs`, the count of files still naming the task's packet, which is 0 in every sandbox.
- The sandbox name is a random id, and its history is one parentless commit named `workspace snapshot`, so the model's working directory and git log name no variant. The id-to-variant map is `prep/sandbox-map.tsv`, in this worktree.
- node_modules is cloned copy-on-write from this worktree, never symlinked, so a model has no write path back into it.
- The system-spec-kit, skill-advisor and sk-vision builds are made in each sandbox, so the Devin prompt hooks inject the same kind of context in every variant.
- Preparation ends with the same warm-up everywhere: one create and one strict validate on a throwaway packet, then a check that the sandbox status is clean.
- Every dispatch passes `--respect-workspace-trust=false`. Devin refuses to run in a directory it has not trusted, and print mode cannot show the prompt that trusts one. Every sandbox is a new directory, so without the flag each dispatch fails at exit 1 in under a second.

For every run and step the loop records:

- **Speed:** seconds from dispatch start to end.
- **Validation calls and tool calls:** read from the Devin session store. Tool calls are counted with `count(*)`, so a capped session still counts; `tool_calls_null` shows rows without call data.
- **Tokens:** uncached input, cached input and output, from the same store. A figure the store does not hold prints UNKNOWN.
- **Quality guards:** `strict_passed`, `leftover_hints`, `missing_anchors` (scored by the frozen anchor rule) and `out_of_scope_writes`. For upkeep it also records `upkeep_applied`, plus `pre_strict` and `pre_hints`, the state the author step left.
- **Contamination:** the earlier benchmark's patterns over tool calls and their outputs. A run is `contaminated` when the model's own calls name the 054 packet, a specific pattern, or a path outside its sandbox. Every hit is listed in `<step>.hits`.
- **Isolation:** sandbox files changed outside the packet track, gitignored ones included (`sbx_side_writes`), processes left behind in the sandbox and killed (`leftover_procs`), and for this worktree new status lines, a changed tracked diff and node_modules writes during the step.

An untouched Level 3 scaffold passes strict validation, so always read `strict_passed` alongside `leftover_hints`.

## How to run

```bash
cd <worktree root>
bash specs/system-speckit/054-weak-model-spec-authoring/011-authoring-speed-research/scratch/speed-loop/loop.sh \
  --variants pre054,main-no054,now054,refined --runs 2 --parallel-ok
```

| Flag | Default | Meaning |
|---|---|---|
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
3. **Paired difference per round:** for each round, the variant's seconds minus the baseline's seconds from that same round, with min, max and mean, the delta of means, and the strict and hints guards beside it. The verdict is SLOWER or FASTER only when at least two pairs all share one sign; otherwise it reads INCONCLUSIVE. The earlier benchmark saw runs of one set spread by 64 to 81 seconds, so a gap smaller than that needs more rounds.
4. **Rounds:** launch order, wall seconds against the budget, and launch skew between the first and last variant starting a step.

`results.tsv` has one row per run and step, including a row for every aborted, skipped or missing step. Each run's evidence sits under `results/<stamp>/<variant>/r<round>/`: the brief, stdout and stderr, the session tool calls and outputs, contamination hits, side writes, leftover processes, the validator output and a copy of the packet after each step.

`wt-r<round>-<step>-new.txt` lists new status lines in this worktree outside the loop folder during that step, and `-nm.txt` lists node_modules writes. Other agents may be editing the tree at the same time, so a line there means look, not guilt.
