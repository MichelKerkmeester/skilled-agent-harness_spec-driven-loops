# Review Iteration 002

## Dispatcher

- Lineage `scorer-8`, pass eight of the command-surfacing build review, artifact directory `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/scorer-8`.
- Sources read: `review/review-brief-8.txt`, `review/review-scope-8.txt`, `review/lineages/scorer-8/deep-review-config.json`, `review/lineages/scorer-8/deep-review-strategy.md`, `review/lineages/scorer-8/iterations/iteration-001.md`, `review/lineages/scorer-8/deep-review-findings-registry.json`, `.skilled/skills/sk-code/sk-code-review/references/review-core.md`, phase 038 `acceptance-criteria.md:55-57` and `tasks.md:47`, `:139`, `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:135`, `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1740-1760`.
- Diff command: `git -c core.fsmonitor=false diff 1c3d62def5a 3416b5e0526 -- <path>` for each scoped scorer file (re-read for this dimension, not re-derived). No prompt corpus or holdout file was opened; no session store was read; `score-command-transcripts.mjs --summary` was not run.
- Operator review focus: the brief's `scorer` area. This iteration addressed it from the security side (the normalized path and the scratch exemption that decide the `unsafe` count) and the traceability side (AC-002, AC-003, T004 and the README sentence that now documents the rule), which is the focus the previous iteration handed forward.
- No `steer.md` exists for this lineage at iteration start.

## Dimension

Security and traceability: path handling in `guardedWriteCounts`, holdout hygiene in the scoped diff, and the spec/checklist evidence behind the rewritten rule.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1512-1525` (`guardedWriteCounts`), `:711-722` (`insideCheckout`), `:1740-1760` (the corpus paths the scorer reads), `:608-625` (`MODE_SUFFIX`, `commandParts`).
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:135` (the `unsafe` sentence as it now reads).
- `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts:1485-1535`.
- Context only: phase 038 `acceptance-criteria.md:56` (AC-002, AC-003), `tasks.md:47` (T004), `:139` (CHK-FIX-004), `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211` (sibling matcher).

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Security Checks

- **No filesystem effect from the changed predicate.** `guardedWriteCounts` is a pure string function: it reads `path` and `checkoutDir`, calls `posix.normalize` and returns a boolean. `score-command-transcripts.mjs:27` imports `existsSync`, `readFileSync` and `realpathSync`, and none is called from the changed line; the only filesystem reads at `:1780`, `:1801` and `:1916` are the pre-existing corpus, bridge-table and run-log reads. A crafted path can therefore mis-score a run but cannot reach a file, which caps the impact of the two P2s iteration 1 raised.
- **The traversal fix closes a real false-safe.** Before this pass an absolute path could carry `..` out of a scratch prefix and be excused; `posix.normalize` now resolves the whole path first (`:1520`), and `/tmp/../Users/dev/repo/README.md` is unsafe (pinned at `command-transcript-score.vitest.ts:1521`). The home spelling is likewise real now (`:1520`), which closes the pass-seven tilde finding.
- **The scratch exemption is a deliberate boundary, not an exploit path.** A guarded write anywhere under `/tmp`, `/private/tmp`, `/var/folders` or `/private/var/folders` stays safe even when it targets another run's folder. The brief states that rule, and pass seven already ruled out the sibling-arena spelling; this iteration confirms the new clause narrows it to those four trees and no others.
- **Holdout hygiene holds in the scoped diff.** The diff adds no read of `command-prompts.jsonl`, `holdout-prompts.jsonl`, `behaviour-fresh-prompts.jsonl` or any session store; the only corpus references remain the pre-existing label readers at `:1745` and `:1751`, whose holdout exclusion is documented in the README row. No prompt text was opened by this review.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | pass | REQ-002 and AC-002 define the arena/outside-checkout rule; `guardedWriteCounts:1518-1525` implements it and the three cases at `command-transcript-score.vitest.ts:1485-1521` pin arena, scratch and real-folder inputs. AC-002's verification cell names exactly those cases plus the fourth real-folder case, and records `Met`. |
| `checklist_evidence` | core | pass | `tasks.md:47` (T004) names the shared suffix chain and its evidence; `tasks.md:139` (CHK-FIX-004) requires unknown suffixes to keep refusing, which the probe confirmed for `:with-everything` and `:auto:draft`. The scorer change mirrors that matcher at `score-command-transcripts.mjs:613`, and `command-attach.ts:211` carries the same vocabulary, so the two surfaces agree today. |

## Integration Evidence

- The README sentence at `README.md:135` now matches the predicate clause for clause: inside the checkout, outside a temp scratch folder, a home path counted as real, and `..` resolved. The one place the prose is narrower than the code's policy is the `:auto`-only mode sentence, which is the subject of iteration 1's first P2; the prose reports the code as built, so this is a policy gap and not a doc/code mismatch.
- The checkout the predicate reads is still the run's `locator.projectDir`, fed from `scoreRun`; the diff does not change that wiring.
- Sibling surface parity: `command-attach.ts:211` and `score-command-transcripts.mjs:613` name the same five modes and three `with-*` modifiers; the scorer anchors at the end of the command text and the attach matcher after the command key, which the edge case in iteration 1 records.

## Edge Cases

- **A scratch write that targets another run's arena** stays safe by the briefed rule. Recorded as a limit, not a finding; the alternative would make the scratch tree unexempt.
- **A relative write after `cd /tmp`** is counted unsafe because the path stays relative. That over-count predates this pass and the brief lists the `$TMPDIR`-literal spelling as a recorded limit; not re-reported.
- **A case-variant scratch spelling** (`/TMP/x`) counts unsafe. Cautious over-count on a spelling no runner produces.
- **`unsafeNoChangedPath`** stays a separate counter: the predicate can count a write the run line lists no changed path for, and the published counter exists to show that gap. No change in this diff.

## Confirmed-Clean Surfaces

- The four temp trees the brief names are exactly the four the new scratch clause matches, and `insideCheckout`'s no-checkout fallback lists the same four plus the home shorthand.
- `posix.normalize` collapses `//tmp` and `/private//tmp`, so no alternate scratch spelling is misread as a real folder.
- AC-002 and AC-003 are `Met` with evidence that names the same cases this pass reads, and no AC covers the scorer's suffix chain, so the mirror is evidence-backed without over-claiming a requirement.
- The scoped diff adds no new import beyond `posix`, and no new file read, environment read or shell call.

## Ruled Out

- **Path traversal through the normalized value**: `posix.normalize` is called on a string that never reaches the filesystem in this function; the value only decides a boolean, so there is no path to escape.
- **A guarded write to `/dev/null` counted unsafe**: it is an over-count (cautious), pre-existing, and no run has to silence output to complete a guarded row. Not worth a finding.
- **README over-claiming `..` support for relative paths**: a relative path is unsafe regardless of `..`, so the sentence is true for every input where the resolution changes the answer.
- **A missing holdout guard in the new code**: the new code touches no file, so there is nothing to guard.

## Next Focus

- Dimension: maintainability.
- Focus area: comment and helper accuracy in `guardedWriteCounts` (`:1512-1525`), whether the four scratch roots are now encoded twice (`:1522` vs `:724-727`), and whether the changed behavior is pinned by the right tests (`command-transcript-score.vitest.ts:1509-1535`).
- Reason: correctness, security and traceability are covered; the remaining risk is follow-on change cost in a helper that now carries the policy comment.
- Rotation status: first rotation to maintainability.
- Required evidence: the helper comment, the duplicated scratch list, and the changed test cases.

Review verdict: PASS
