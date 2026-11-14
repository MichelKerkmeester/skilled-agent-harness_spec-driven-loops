# Review Iteration 2

- Mode: review
- Lineage: `accuracy-runner-confirm-4b`
- Run: `fanout-accuracy-runner-confirm-4b-1794680176420-xvj4ed`
- Iteration: 2 of 3
- Dimension: security
- Budget profile: verify (11-13 read actions)
- Sources read: `review-brief-4b.txt`, `steer.md` (absent), the iteration-1 narrative and strategy

## Dispatcher

`/deep:review` fan-out lineage `accuracy-runner-confirm-4b`. The security pass follows the two
surfaces the pass-four brief names: the Codex reader's resolved-file open and holdout hygiene.
The scorer's live-capture guard is read as context because its file belongs to the sibling
`scorer-attach-confirm-4b` area.

## Files Reviewed

- `.skilled/hooks/shared/session-readers/codex.mjs:142-194`
- `.skilled/hooks/shared/tests/session-readers/codex.test.mjs:100-131`
- `.skilled/hooks/shared/tests/session-readers/helpers.mjs:46-69`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:620-645,772-791,830-834`

Context reads outside the finding surface: `.skilled/hooks/shared/session-readers/identity.mjs:91-117`
for `resolveInside`; `.skilled/skills/system-skill-advisor/runtime/tests/command-routing-slice.vitest.ts:125-211`
for the live-capture holdout guard.

## Findings - New

No new security finding.

The confirmed P2 from the verify report (`codex.mjs:167` opened the caller's locator after
containment resolved another path) is fixed:

1. `resolveInside` resolves both the root and the path with `realpathSync` and refuses a real
   path outside the real root (`identity.mjs:104-116`), so `containment.path` is the resolved
   file.
2. The reader now opens that path, not the locator (`codex.mjs:163-169`).
3. The new test creates a link inside the store, calls the reader with the link, and asserts the
   link path was never opened while the resolved file was (`codex.test.mjs:104-129`). The
   tracker syncs the monkey-patched builtins into the ESM bindings
   (`helpers.mjs:46-68`), so the assertion observes the reader's own `readFileSync`.

The holdout guard in this area is unchanged and holds: `findRow` refuses a row whose
`split === 'holdout'` before returning its prompt (`run-command-behaviour.mjs:623-637`), and
`assertRunnable` sends every explicit non-fixed id through that lookup
(`run-command-behaviour.mjs:778-790`). The G2 fixed prompts are runner-owned ids and are not
rows in either corpus; a run line for one is scored through `startedLabel`'s fixed table, not a
corpus label. The live-capture half of the guard is present in the sibling area at
`command-routing-slice.vitest.ts:206-210`, which checks the freshly scored capture as well as
the committed baseline.

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None in this dimension.

## Traceability Checks

- `spec_code`: partial. The Codex reader now follows the same containment pattern as
  `claude.mjs:203-217`; no runtime-specific branch was added.
- `checklist_evidence`: pending. No checklist row in this area is claimed by iteration 2.
- `agent_cross_runtime`: pending. No agent definition changed.
- `feature_catalog_code`: pending. The README drift is scheduled for iteration 3.
- `playbook_capability`: notApplicable. No playbook surface changed.

## Integration Evidence

- `loadCodexSession` is the shared reader behind the transcript scorer's `loadSession` call
  (`score-command-transcripts.mjs` loads through the session-reader matrix), so the resolved-path
  read reaches every Codex score.
- `run-command-behaviour.mjs` reads the corpus through `findRow` for backfill prompts and sends
  fixed G2 prompts from its own table; neither path prints a prompt on refusal.
- The live capture guard is not a file this lineage owns. It is named here as the sibling
  surface that closes the verify report's live-capture item.

## Edge Cases

- A path swapped after `realpathSync` but before `readFileSync` remains a narrow race: the read
  still follows the resolved path, but that path can be replaced in the interval. The verify
  report's probe exercised a link swapped before containment, which is now refused. The residual
  race is recorded as an accepted limitation, not a new finding, because closing it needs an
  `open` with a no-follow flag and the reader has no such contract.
- A link whose name is the requested session id and whose target has no `session_meta` header
  still passes identity on the caller's file name. This is the deliberate `recordedSessionId`
  behavior the verify report asked to keep; the header id still wins when present.
- A G2 fixed id is never looked up in the corpus, so the holdout guard does not see it. The ids
  are not rows in either corpus, so no holdout row is reachable through that shortcut.

## Confirmed-Clean Surfaces

- Containment resolves before the open and refuses a real path outside the real store.
- The reader opens the resolved path.
- The new test proves both halves of the contract it names.
- `findRow` refuses a holdout row before its prompt can reach a child process.

## Ruled Out

- **The Codex reader still opens the caller's locator.** Ruled out: `codex.mjs:169` reads
  `storePath`, and the new test asserts the link was not opened.
- **A link inside the store can escape the store.** Ruled out: `resolveInside` realpaths both
  sides and checks containment at `identity.mjs:104-116`.
- **A holdout row can reach a live turn through the fixed G2 table.** Ruled out by id: the G2
  ids are runner-owned prompts and appear in neither corpus.
- **The live capture publishes a holdout row.** Ruled out in the sibling area by
  `command-routing-slice.vitest.ts:206-210`; this lineage does not re-report it.

## Next Focus

- Dimension: RECOVERY (least-covered traceability and maintainability)
- Focus area: docs/code agreement for the `offeredAs` fix and the A11 malformed-router row.
- Reason: two clean iterations reached the stuck threshold; the remaining evidence is
  documentation and checklist alignment, not a new security angle.
- Rotation status: correctness and security complete; traceability and maintainability remain.
- Required evidence: direct reads of the README field lists against both writers, the verify
  report's accepted items, and the A11 guidance against the doctor check and embed code.
- Blocked/productive carry-forward: no blocked approach.
- Recovery note: recovery pass changes granularity to line-level doc claims.

## Verdict

No active P0 or P1 finding. The Codex containment fix and the holdout guard are confirmed.

Review verdict: PASS
