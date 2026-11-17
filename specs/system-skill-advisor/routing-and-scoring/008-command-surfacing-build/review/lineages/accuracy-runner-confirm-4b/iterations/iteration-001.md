# Review Iteration 1

- Mode: review
- Lineage: `accuracy-runner-confirm-4b`
- Run: `fanout-accuracy-runner-confirm-4b-1794680176420-xvj4ed`
- Iteration: 1 of 3
- Dimension: correctness
- Budget profile: verify (11-13 read actions)
- Sources read: `review-brief-4b.txt`, `review-scope-4b.txt`, `review/verify-4/report.md`, `steer.md` (absent)

## Dispatcher

`/deep:review` fan-out lineage `accuracy-runner-confirm-4b`, confirming round of pass four.
The dispatcher bound the nine `accuracy-runner` paths in `review/review-scope-4b.txt` plus the
shared docs that describe them, and the fix range `11af224a34..48f03b5013`.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs:43-82,390-508`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:807-828,1150-1210`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-offer.vitest.ts:355-390`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-behaviour-guards.vitest.ts:107-126`

Context reads outside the finding surface: `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1468-1478` (the reader of `offeredAs`).

## Findings - New

No new correctness finding.

The confirmed P1 from the verify report is fixed on both writers:

1. `backfillRunLog` copies `offeredAs` beside the command and policy at
   `command-offer.mjs:496`, after the replay returns it at `command-offer.mjs:80`.
2. The live turn uses `offerLineFields` at `run-command-behaviour.mjs:1203`, which returns the
   command, policy and side at `run-command-behaviour.mjs:820-827`.
3. The brief-only branch at `command-offer.mjs:489-490` still copies the line forward, so a
   legacy line with no `offeredAs` stays without one and is scored as before by
   `score-command-transcripts.mjs:1471-1476`.

No input now drops the side between the replay and the written line: the two paths that write a
line are the only writers in the changed area, and both carry it.

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None in this dimension. Two documentation drifts raised by the fix are recorded under
traceability in iteration 3 so they stay in their owning dimension.

## Traceability Checks

- `spec_code`: partial. The phase 026 T024 claim that a start is read from the same reads a load
  uses is implemented by `readDocument` calling the same `shellReadTargets` predicate; this
  iteration confirms the writer half only.
- `checklist_evidence`: pending. No checklist row in this area is claimed by iteration 1.
- `agent_cross_runtime`: pending. No agent definition changed.
- `feature_catalog_code`: pending, the README drift is scheduled for iteration 3.
- `playbook_capability`: notApplicable. No playbook surface changed.

## Integration Evidence

- `run-command-behaviour.mjs` imports `replayOffer` from `command-offer.mjs:56` and writes the
  live line through the local `appendRunLine` (`run-command-behaviour.mjs:663-666`).
- `score-command-transcripts.mjs:1468-1478` reads `offeredAs` and splits a partner-side command
  out of the offer count. The two writers therefore feed one reader, and that reader is the
  only consumer of the new field in the changed area.
- The append gateway recorded the iteration record and the reducer reads its delta; both live
  under the lineage directory.

## Edge Cases

- A line with no checkout or an untrusted checkout has no offer object with `offeredAs`; the
  `?? null` at `command-offer.mjs:496` keeps the field present with a null value. The reader
  treats a present command with a null side as an offer, which is the pre-fix behavior.
- A brief-only pass does not invent `offeredAs` for a legacy line. That is the documented
  contract at `command-offer.mjs:403-404`, and the reader's `offeredAs !== 'partner'` test
  keeps such a line counted as before.
- A head that names no command takes the `parseOffer` early return at `command-offer.mjs:73-75`,
  so `offeredAs` is null rather than a stale side.

## Confirmed-Clean Surfaces

- `parseOffer` returns one of `head`, `partner` or null, and only the side of the first ` vs `
  before the match decides it (`command-offer.mjs:70-82`).
- Both writers preserve the field, and neither writes a partner-side command as an offer.
- The added backfill test asserts `partner` for the first line and null for the second
  (`command-offer.vitest.ts:385-388`).
- The added helper test pins the field set and the null case
  (`command-behaviour-guards.vitest.ts:110-124`).

## Ruled Out

- A missing `offeredAs` on the live writer: ruled out by `run-command-behaviour.mjs:1203` and
  the helper return at `:820-827`.
- A missing `offeredAs` on the backfill writer: ruled out by `command-offer.mjs:496`.
- A partner-side command still counted as an offer: ruled out by
  `score-command-transcripts.mjs:1471-1476`, which tests the side before counting.

## Next Focus

- Dimension: security
- Focus area: the Codex reader's resolved-path read, the holdout guard on the live capture path,
  and the runner's refusal to run holdout rows.
- Reason: the pass-four brief names both surfaces; iteration 1 covered the offer persistence.
- Rotation status: first security pass in this lineage.
- Required evidence: direct reads of `codex.mjs` containment and read, `identity.mjs`
  `resolveInside`, the Codex test tracker, and the runner's row guard.
- Blocked/productive carry-forward: none.
- Recovery note: none.

Review verdict: PASS
