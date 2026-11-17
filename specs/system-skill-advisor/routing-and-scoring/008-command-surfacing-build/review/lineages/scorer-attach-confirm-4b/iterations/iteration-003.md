# Review Iteration 003 — scorer-attach-confirm-4b

## Dispatcher

- Mode: review (deep-review, fan-out lineage)
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`
- Lineage: `scorer-attach-confirm-4b`, session `fanout-scorer-attach-confirm-4b-1794680176420-xvj4ed`, generation 1, lineageMode `new`
- Focus: security and maintainability (combined pass)
- Operator focus: `review-brief-4b.txt` — confirming round of pass four. This iteration addressed it by taking the two checks not yet covered by a dimension: holdout hygiene in the scorer that reads the capture, and the cost, comment hygiene and test pinning of the two new matching constructs.
- Sources read: `steer.md` (absent), `review-brief-4b.txt`, `review/verify-4/report.md`, `score-command-transcripts.mjs` (row-label load, `scoreRun`, `shellReadTargets`, `readDocument`), `command-attach.ts` (new constants and the mention reader), the three new test tables, and the added comment lines in the fix diff.
- Budget profile: verify (9 analysis calls).

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1198-1245,1500-1518,638-694,910-925`
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:373-395,411-440`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:155-201`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts:614-640,1082-1120,2279-2284`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-routing-slice.vitest.ts:129-230`
- Fix-diff added comment lines for id hygiene (both core files)

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. Both active findings are carried from iteration 1: SAC4B-P1-001 (or-list article form) and SAC4B-P2-001 (question over an or-list).

### P2 Findings

None new.

## Security Checks

| Check | Result | Evidence |
|---|---|---|
| Holdout rows never open a session or print a prompt | pass | `loadRowLabels` stores only `{holdout:true}` for a holdout split (`score-command-transcripts.mjs:1236`); `scoreRun` returns `{scored:false, reason:'holdout_row'}` before `loadSession` (`:1510`) |
| Holdout guard reads the live capture | pass | `command-routing-slice.vitest.ts:205-215` asserts on `live` for all four published maps, plus a map-level test at `:216-231` |
| No prompt text reaches an output line through the new code | pass | the shell-read branch only inspects `event.command` (`:921`); no label or prompt field is read there |
| Untrusted input in the new regexes cannot execute or open a path | pass | `COMMAND_OR_LIST` is a pure character-class alternation (`command-attach.ts:379`); `shellReadTargets` only splits a string and compares tails, no filesystem call |
| Regex cost of the or-list | pass | timed on a 10/100/400/1200-item list: 0.18 ms or less per full match (`node` probe, iteration 3); each repetition consumes at least one `/`, so no empty-iteration backtracking |
| Trust-boundary reach unchanged | pass | the new branches widen only what counts as a read; they add no new input source |

## Maintainability Checks

| Check | Result | Evidence |
|---|---|---|
| Comment hygiene (no spec/phase/task/finding ids) | pass | added lines in both files carry no `0NN-`, `T0NN`, `P0NN`, `SA4`, `REQ-` or `AC-` token (`git diff … | grep '^+' | rg` returns nothing) |
| Comments name the durable why | pass | `command-attach.ts:376-379` explains why the list joins only `or`/`, or`; `:394` explains the article; `score-command-transcripts.mjs:646-648,914-916` explain the end-word class and the shell-read rule |
| New test rows pin the fixed behaviour | partial | the five or-list rows, the is-the row, the shell-read table and both heredoc rows pin their fixes; the article-inside-or-list form has no row (SAC4B-P1-001) |
| No new dead code | pass | every new constant is used once (`COMMAND_OR_LIST`, `publishedHoldoutIds`); no unused export |
| Test helper shape | pass | `publishedHoldoutIds` is a local helper over the same four maps the inline check read; the second test makes the helper's own coverage explicit rather than relying on a case that happens to hit one map |
| Repo-rule id hygiene on docs | pass | all three doc edits are prose plus a version bump; no id is embedded |

## Traceability Checks

| Check | Result | Evidence |
|---|---|---|
| `spec_code` | unchanged partial | carries SAC4B-P1-001; nothing in this iteration changes the spec-side reach judgment |
| `checklist_evidence` | unchanged partial | same gap; no new checklist row |
| `skill_agent` / `feature_catalog_code` | pass | iteration 2 result holds |
| `agent_cross_runtime` | pass (context) | Codex reader is sibling-owned and verified |

## Integration Evidence

- The holdout rule and the `publishedHoldoutIds` helper run inside the same vitest file that scores the corpus, so the guard cannot be bypassed by a different capture writer without failing the suite.
- The shell-read branch is reached from both `startState` (`:986`) and `takenLoop` (`:1439`) through the one `readDocument`, so no second copy of the rule can drift.
- The or-list constant is consumed by the same `commandOnlyMentioned` that `attachCommand` (`:491`) and the typed path call, so the P1 fix location is the shared reader, not a caller.

## Edge Cases

- A failed shell read (`cat` exiting non-zero) still counts as a start because the normalized event carries no exit code. This is unchanged by the fix and outside its claim; recorded, not raised.
- `{holdout:true}` replaces the label object entirely, so a holdout row also loses its expected command in memory — a safe default that keeps a future field from leaking through.
- The 1200-item timing probe is a synthetic worst case for the delimiter, not a real prompt; it establishes no super-linear blowup, nothing more.

## Confirmed-Clean Surfaces

- `scoreRun` holdout gate ordering (label → holdout → session load).
- `COMMAND_OR_LIST` and `COMMAND_BARE_ASK_LEAD` comment accuracy against behaviour.
- New test tables: or-list refusals, request controls, is-the question, shell-read start, heredoc end words.
- No id leakage in any added comment line.

## Ruled Out

- ReDoS on `COMMAND_OR_LIST`: the repetition cannot match empty, so the `$` anchor cannot force exponential backtracking; measured flat.
- Holdout leak through `command-routing-slice.vitest.ts`: the live capture is now checked; no prompt value is read by the helper.
- `unscoredOnly`, pair-block and `paired` name: accepted deferrals to phase 026 (P046), not re-raised.

## Next Focus

- Dimension: none remaining
- Focus area: synthesis
- Reason: correctness, traceability, security and maintainability each have one full iteration; the last two produced no new findings
- Rotation status: all dimensions covered
- Required evidence: `verify-4/report.md` ledger plus iterations 1-3
- Recovery note: none

Review verdict: CONDITIONAL
