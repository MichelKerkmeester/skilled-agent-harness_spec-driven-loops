# Convergence Report — deepseek-research lineage

## 1. TERMINAL STATE

| Field | Value |
|---|---|
| **Stop reason** | `maxIterationsReached` (hard stop, evaluated first in the decision order) |
| **Configured stop policy** | `max-iterations` |
| **Convergence mode** | `off` — this is an audit run under the parent directive's rule that both closing loops run a fixed five iterations |
| **Convergence threshold (recorded, unused)** | 0.05 |
| **Iterations completed** | 5 of 5 |
| **Questions answered** | 5 of 5 (ratio 1.00) |
| **Average newInfoRatio** | 0.80 |
| **Ratio trend** | 0.90 → 0.75 → 0.85 → 0.80 → 0.70 |
| **Stuck count** | 0 |
| **Legal-stop gates evaluated** | not applicable — the max-iteration branch is terminal and does not pass through the gate bundle |
| **Blocked stops** | none |
| **Graph events emitted** | 7 findings, 1 question, tracked in the per-iteration deltas |

## 2. WHY THE RUN TERMINATED HERE

The configured terminal condition was the iteration cap, and it was reached rather than approached: the fifth iteration is the synthesis-pass iteration, and its ratio (0.70) is the lowest of the run, which is the expected shape for an iteration that consolidates rather than discovers.

Had the run been left in `default` convergence mode, the signals would not have nominated STOP before the cap. The rolling average over five iterations is 0.80, well above the 0.05 threshold, and the evidence base is a bounded artifact set rather than an open topic — the loop would have kept re-reading the same nine documents. Two facts support capping this run instead: the packet's own artifacts were exhausted by iteration 4 (interval evidence in iteration 4's "saturated" note), and the five remaining open questions all require material *outside* the packet — a git-range replay, a commit diff, or a repository-wide execution census.

## 3. QUALITY GUARDS (informational, since convergence was disabled)

| Guard | Result | Basis |
|---|---|---|
| **Source diversity** | Pass | 43 distinct sources across five classes: 11 packet documents, 20 repository code files at HEAD, 13 commits, 2 live checks, 1 sibling-lineage artifact. No finding rests on a single source; every load-bearing claim carries at least one code or git citation and, for the disputed ones, an independent check. |
| **Focus alignment** | Pass | Each iteration pursued exactly one focus from the strategy's Next Focus, and iteration 5's focus was set by iteration 4 rather than re-planned. |
| **No single weak-source dominance** | Pass | The one source used for a claim that could not be independently verified (a phase log's account of an intermediate commit) is labelled as such in every iteration where it appears; the packet's prose log was never the sole support for a finding. |
| **Negative knowledge recorded** | Pass | Ten ruled-out directions across iterations 1-5, each with a reason and an evidence citation; consolidated in `research.md` §10. |
| **Per-iteration artifacts** | Pass | Five iteration files and five delta files, one per iteration, each write-once. |

## 4. WHAT THE RATIOS MEAN

The ratio sequence is not a discovery curve. Iteration 1 (0.90) reads the packet's failure cluster for the first time; iteration 2 (0.75) narrows to the detection surface, which is a smaller question; iteration 3 (0.85) opens the residue side, which the packet recorded in two phases and therefore yields a large structured set; iteration 4 (0.80) resolves the split and finds one unrecorded class; iteration 5 (0.70) consolidates and produces the deliverable. The one-iteration dip at iteration 2 is a *question-size* effect, not a signal of diminishing returns: the detection question is narrow and the evidence for it is two files.

## 5. DEVIATIONS AND CAVEATS

1. **The append-mode-event gateway was not invoked.** The gateway binds a ledger root from `--run-directory`, and this lineage's containment rule forbids writing outside its own directory. `deep-research-state.jsonl` here is an executor-written projection, not gateway output, and carries no ledger receipt. Recorded so no later reader mistakes it for an authorized append.
2. **No reducer process ran.** Machine-owned strategy sections, the findings registry and the dashboard were refreshed by the executor after each iteration against the lineage-local files.
3. **Detection checks were reasoned about, not executed.** No suite, three-daemon-state battery or invocation-inversion harness was run. The detection table's yields are argued from mechanism plus the packet's recorded outcomes; this is stated in `research.md` §13 and is the first of the run's open questions.
4. **Counts are measurements.** 603 `mcp-server/` markdown references (excluding `node_modules`, `dist`, advisor `changelog`), 3 retired tool ids repo-wide, 6 alias-collapse code sites, 47 stale retrieval paths, 407 renames, 36 retired-or-rewritten test cases (9 + 1 + 4 + 22).
5. **One external-framing figure could not be reproduced.** The driving brief's "26 tests of a deleted file and 7 asserting removed registrations" appears in no packet artifact; the nearest verifiable counts are recorded in `research.md` §7 (C7) so the figure does not propagate.
6. **One bookkeeping error, corrected and disclosed.** The iteration 4 record was omitted from `deep-research-state.jsonl` on the first pass and was found missing during final-state verification. Because the state log declares itself an executor-written projection rather than gateway output (deviation 1), the projection was rewritten once to place the record in run order rather than appending it out of sequence after the synthesis event. Seven records now stand in order: config, iterations 1-5, synthesis_complete.
7. **Write containment verified, not asserted.** After the final write, a filesystem scan for anything modified outside this lineage directory after the session start returned only the packet's driver-written observability log and the sibling `deepseek-review` lineage's own files — both written by other processes, neither by this executor. `git status` shows no tracked file changed; the only untracked trees are the two lineages' own directories, and the pre-existing modifications to `.github/workflows/*` and `.gitignore` predate the session (mtimes 19:23-19:34 local, before the session's first write at 19:39:40).

## 6. LINEAGE ARTIFACT CHECKLIST

| Artifact | Present |
|---|---|
| `deep-research-config.json` | yes (immutable after init) |
| `deep-research-state.jsonl` | yes — config record, 5 iteration records in run order, 1 synthesis record (7 records, all valid JSON) |
| `deep-research-strategy.md` | yes — final state, all sections populated |
| `findings-registry.json` | yes — 5 resolved questions, 27 key findings, 10 ruled-out directions, 8 residue classes |
| `deep-research-dashboard.md` | yes — regenerated at synthesis |
| `iterations/iteration-001..005.md` | yes |
| `deltas/iter-001..005.jsonl` | yes |
| `research.md` | yes — canonical synthesis with the mandatory Eliminated Alternatives section between Recommendations and Open Questions |
| `resource-map.md` | yes — evidence-derived |
| `convergence-report.md` | this file |

**Loops run:** `phase_init` → `phase_main_loop` (5 iterations to the terminal cap) → `phase_synthesis`. No pause sentinel was set, no recovery tier was entered, and no file outside this lineage directory was created or modified.
