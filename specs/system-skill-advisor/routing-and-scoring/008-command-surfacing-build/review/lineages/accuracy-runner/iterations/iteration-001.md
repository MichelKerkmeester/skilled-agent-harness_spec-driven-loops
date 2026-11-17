# Review Iteration 001

## Dispatcher

- Mode: review (fan-out lineage `accuracy-runner`)
- Session: `fanout-accuracy-runner-1794550137809-1ecgc7`, generation 1, lineage mode `new`
- Dimension: D1 Correctness
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder)
- Budget profile: verify (11 review actions)
- Operator review focus bound as `review_focus`: command-surfacing review of the `accuracy-runner` area (routing-accuracy harness, corpora, transcript scoring, offer recovery, cost benches, fidelity tests); cross-runtime behavior for claude, codex, opencode, pi, devin, dsh; safety of offering a mutating command; holdout hygiene; docs that disagree with code.
- How this iteration addressed the focus: it audited the correctness of the measurement harness that decides what an offered command is and what counts as unsafe, and it tested the holdout-hygiene invariant end to end across the scoring path, the runner path and the committed baseline.
- `steer.md`: absent at review start; no lead rulings to apply.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs:56-131,220-284,335-421`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:520-614,640-746,792-825,980-1100`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/worktree-restore.mjs:46-122`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:540-706,911-972,1010-1210,1216-1339`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs:430-575`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/prepare-behaviour-arena.mjs:1-120`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:1-182`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-routing-slice.vitest.ts:1-141`
- `.skilled/skills/system-skill-advisor/runtime/scripts/measure-brief-cost.mjs:1-160`
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:555-605`
- Corpus composition read as counts only (no holdout prompt text): `command-prompts.jsonl` 176 rows = 44 holdout + 45 tune + 87 none; `holdout-prompts.jsonl` 66 rows, ids disjoint.

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **Committed baseline publishes per-row holdout outcomes and a test pins them** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs:537` -- Every corpus row is written into the baseline's `rows` map as `{expected_command, top, top1, top3, offered}` with no split filter, so the 44 `split === "holdout"` rows are published row by row, each with its gold command and the scorer's top prediction. `tests/command-routing-slice.vitest.ts:91-107` then compares every row, holdout included, and its failure text instructs the developer to re-capture with `--write` when the change is intended, which makes the holdout rows part of the ordinary fix loop. The scoring and runner paths enforce the opposite invariant for the same rows (`score-command-transcripts.mjs:948,1157` marks them `holdout_row` and never scores them; `run-command-behaviour.mjs:588-590` refuses to run them), so the harness itself treats holdout rows as unreadable while the report artifact publishes their outcomes.
Finding class: holdout-integrity / measurement-correctness
Scope proof: all four cited files are in the declared scope (`capture-command-routing-baseline.mjs`, `command-routing-baseline.json`, `command-routing-slice.vitest.ts`, `score-command-transcripts.mjs`, `run-command-behaviour.mjs`); the finding concerns only the publication of holdout rows, not the legitimate aggregate holdout metric.
Affected surface hints: `runtime/scripts/routing-accuracy/command-routing-baseline.json` (44 holdout keys in `rows`), `runtime/tests/command-routing-slice.vitest.ts`, any future tune/fix loop that reads the baseline, the reported `plain_recall_at_1.holdout` metric.
Case: a developer whose routing change flips a holdout row from miss to hit runs the documented `--write` recapture, which rewrites that holdout row's `top`/`top1` in the committed baseline; the next fix iteration reads the updated holdout row and tunes against it, and the reported holdout accuracy no longer measures generalisation.

```json
{
  "type": "claim",
  "claim": "capture-command-routing-baseline.mjs:537 writes per-row results for holdout rows into the committed baseline, and command-routing-slice.vitest.ts:91-107 pins those rows and directs intentional changes back through --write, so holdout outcomes are visible to, and updated by, the tune/fix loop.",
  "evidenceRefs": [
    ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs:537",
    ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs:462-463",
    ".skilled/skills/system-skill-advisor/runtime/tests/command-routing-slice.vitest.ts:91-107",
    ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:948",
    ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1157",
    ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:588"
  ],
  "counterevidenceSought": "Checked whether the test skips holdout ids (it does not: ids come from the whole corpus plus both row maps), whether the 44 in-corpus holdout rows are a published benchmark instead of a held-out split (a disjoint sealed `holdout-prompts.jsonl` with 66 rows exists and is never scored by these paths), and whether the leak is prompt text (it is not: only ids, gold commands and top predictions).",
  "alternativeExplanation": "The per-row map exists to catch label drift and row swaps that an aggregate hides, and the sealed 66-row file may be the only split the project treats as confidential, in which case the in-corpus split is an open benchmark by design.",
  "finalSeverity": "P1",
  "confidence": 0.78,
  "downgradeTrigger": "Downgrade to P2 if project intent recorded anywhere in the packet states the 44-row in-corpus holdout split is a published benchmark whose per-row outcomes are meant to be readable, with `holdout-prompts.jsonl` as the sole sealed evaluation set."
}
```

### P2 Findings

2. **`offerReached` counts an unknown brief state as reached** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1293` -- The tally increments `offerReached` whenever `briefDelivered !== false`, so `unknown` is counted as reached, while `README.md:111` documents `offerReached` as offers "on a turn whose brief arrived" and `command-offer.mjs:283` returns `unknown` precisely when delivery cannot be established (always the case on OpenCode, per `command-offer.mjs:207-209`). The offered-command reach rate is therefore inflated by every runtime whose brief state is unreadable, and the caller must subtract `deliveryUnknown` to recover the documented meaning.
Finding class: metric-semantics
Scope proof: `score-command-transcripts.mjs`, `command-offer.mjs` and `README.md` are all declared scope files; the finding is confined to the tally at line 1293 and the doc claim at README:111.
Affected surface hints: `score-command-transcripts.mjs` summary `offerReached`/`deliveryUnknown`, README §4 metric list, any operator reading reach per runtime.
Case: an OpenCode arm records every run line with `briefDelivered: "unknown"`; `offerReached` equals the offer count even though no brief delivery was ever confirmed, so the arm reads as fully reached.

3. **The routing-accuracy README's structure table and statistics have drifted from the folder** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:29` -- The statistics row says `Code files | 9` and the structure table at `README.md:105-114` names 8 entries, while the folder holds 14 code files (13 `.mjs` plus `score-routing-corpus.py`). Omitted code includes the arena builder and the restore primitive that the mutating-command runs depend on (`prepare-behaviour-arena.mjs`, `worktree-restore.mjs`), plus `build-holdout.mjs`, `capture-local-native-divergence-ledger.mjs`, `capture-scorer-eval-baseline.mjs`, `derive-ambiguity-slice.mjs`, `reject-unknown-options.mjs`, `score-outcome-rerank.mjs`; omitted data files include `holdout-prompts.jsonl`, `labeled-prompts.jsonl`, `doctor-prompts.jsonl`, `ambiguity-prompts.jsonl` and `scorer-eval-baseline.json`.
Finding class: documentation-drift
Scope proof: `README.md` is a declared scope file and the file inventory was read directly from the same directory; no claim here depends on an unlisted file's behavior.
Affected surface hints: operator navigation of the harness, the `sk-doc` README audit expectation recorded at `README.md:171`, the playbook chapter that refers to this folder.
Case: an operator follows the structure table to find how a behaviour run is prepared and restores a checkout, finds no entry for the arena builder or the restore module, and concludes the folder has no such step.

## Traceability Checks

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | partial | Code claims are traceable to runtime sources; the packet's own claim about holdout hygiene is contradicted by the baseline publication (finding 1). |
| `checklist_evidence` | not run this iteration | Deferred to the traceability iteration. |
| `playbook_capability` | partial | `README.md:97` claims `measure-brief-cost.mjs` refuses a holdout id before spawning and never prints a prompt; `measure-brief-cost.mjs:105-119,153` confirms the refusal and the prompt is passed on stdin only to the hook. |

## Integration Evidence

- Named surfaces checked: `runtime/scripts/routing-accuracy/score-command-transcripts.mjs` (summary/scoring path), `runtime/scripts/routing-accuracy/run-command-behaviour.mjs` (live-turn path), `runtime/tests/command-routing-slice.vitest.ts` (regression ratchet), `runtime/scripts/routing-accuracy/command-routing-baseline.json` (committed report artifact).
- Cross-runtime behavior verified by reading runtime tables and guards, not by executing a CLI in this lineage (containment forbids spawning measured turns): Codex approval gate `run-command-behaviour.mjs:1140-1152`, `command-offer.mjs:263-281`; Pi/Devin/DSH store reads `command-offer.mjs:251-261`; OpenCode documented `unknown` `command-offer.mjs:205-209`; Claude transcript attachment `command-offer.mjs:221-249`.

## Edge Cases

- `steer.md` absent: recorded, no ruling to apply.
- Containment forbids running the harness, so every conclusion about runtime behavior comes from reading the runtime tables and guards; execution evidence is deferred and named as a limit rather than a pass.
- Coverage-graph seed (`step_seed_coverage_graph`) was not executed because `upsert.cjs` writes graph state outside the lineage directory; the iteration proceeds with an empty graph and records the gap here instead of claiming coverage.
- Holdout prompt text was never read or printed; the corpus was inspected through counts of `split`/`row_type`/`expected_policy` and through id sets only.

## Confirmed-Clean Surfaces

- `parseOffer` (`command-offer.mjs:56-67`) matches every shipped command shape: all 44 distinct `expected_command` values are lowercase with hyphens, and the optional second word is the deliberate `/doctor:git hooks` form exercised at `tests/command-offer.vitest.ts:74-85`.
- `BRIEF_PATTERN` (`command-offer.mjs:36`) matches all five heads the renderer can emit, including `Advisor: prompt skipped.` and `Advisor: no skill matched.` (`render.ts:633-638`).
- Holdout refusal ordering is correct on the live-run path: `findRow` refuses a holdout id before any prompt reaches a child process or the run log (`run-command-behaviour.mjs:578-594`).
- Arena preparation refuses a destination inside a repository and an existing destination, and skips every `.env*` file while copying (`prepare-behaviour-arena.mjs:26-34,43-66`).
- Restore is HEAD-based and never reverts a path that was already dirty before the turn (`worktree-restore.mjs:61-84,97-122`).

## Ruled Out

- `--dry-run` is not side-effect free: it still replays the Claude hook (`run-command-behaviour.mjs:1043-1047`), which spawns a process. Ruled out as a finding because the code comments state the replay explicitly and no documentation claims a dry run spawns nothing; recorded as a behavior note only.
- Staged-new-file restoration: `restorePath` drops the index entry and deletes the file, covering the case a restore-from-index would miss (`worktree-restore.mjs:61-84`). No finding.
- Untracked-directory collapse in `git status --porcelain`: considered as a restore gap, but the runner refuses a dirty worktree outside the run-log folder before the first live turn (`run-command-behaviour.mjs:994-1000`), so a pre-existing untracked directory cannot silently absorb turn writes in the measured arms. Not promoted without a reachable case.
- Claude/codex/pi/devin/dsh brief detection false negatives: every renderer head shape and every reader branch was checked against `render.ts:581-638`; no mismatch found.

## Next Focus

- Dimension: security
- Focus area: safety of offering a mutating command in the live-turn harness and arena (remote/dirty/worktree guards, credential scrubbing, restore completeness, fixture trust), plus secrets exposure in measured environments.
- Reason: iteration 1 confirmed the read paths are holdout-safe but exposed a report-path leak; the highest remaining risk in the review focus is a measured turn that writes outside its arena or reaches the network with operator credentials.
- Rotation status: D1 correctness complete, D2 security next.
- Blocked/productive carry-forward: productive (source-level guard audit); blocked (cannot execute turns under containment).
- Required evidence: exact guard lines in `run-command-behaviour.mjs`, `prepare-behaviour-arena.mjs`, `worktree-restore.mjs`, and the playbook chapter that instructs operators how to run a live arm.

Review verdict: CONDITIONAL
