# Review Iteration 003

- Dimension: security
- Operator review focus: narrow pass three over the `advisor-runtime` area; this iteration read the changed lines that sit on a trust or privacy boundary and followed each one to the process it starts, the file it reads, or the environment it changes. It also performed the only permitted check of the sealed holdout file, a `--numstat` diff.
- Budget profile: adjudicate (8-10 calls)
- Base/HEAD: `ec1869dae8..1ca14a44988d3812ef18d968aba304ed31481648`

## Dispatcher

`@deep-review` LEAF iteration dispatched by the fan-out lineage `advisor-runtime-3`, session `fanout-advisor-runtime-3-1794593402980-zhrui5`, generation 1. Sources read this iteration: `review-scope-3.txt`, `017-review-pass-two-remediation/tasks.md` security rows T010, T014, T029, `git diff ec1869dae8..HEAD` for the files below, the current code at the cited lines, `prepare-behaviour-arena.mjs:314`, and `steer.md` (absent).

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs:60-120,326-500`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/worktree-restore.mjs:70-128`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs:81-96,361-397,680-692`
- `.skilled/skills/system-skill-advisor/runtime/scripts/measure-brief-cost.mjs:155-180`
- `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:254-268,368-374`
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:955-968,1010-1240`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/prepare-behaviour-arena.mjs:314` (marker writer, read-only context)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/holdout-prompts.jsonl` (numstat only)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | T010's trust gate matches `command-offer.mjs:333-344` and the replay call it guards at `:437-457`; T014's nine-name restore matches every assignment at `capture-command-routing-baseline.mjs:381-396`; T029's busy scan matches `subprocess.ts:254-268` and the retry decision at `:371`. |
| `checklist_evidence` | pass | T010's assertion that no untrusted binary runs is covered by the new test at `command-offer.vitest.ts:445-490`, which writes two fake binaries and asserts neither marker file exists; the suite passed in iteration 2 (`6 passed (6)`). |
| `skill_agent` | notApplicable | Plugin security surface is scheduled for iteration 4 with traceability. |
| `feature_catalog_code` | notApplicable | Catalog files belong to the `doctor-docs` area. |

## Integration Evidence

- `replayOffer` resolves the hook from `checkoutDir` and spawns `node` with `cwd: checkoutDir` (`command-offer.mjs:83-101`). The trust gate sits before both `warm(checkoutDir)` and `replay(...)`, so the only two code-executing calls in a backfill are behind it.
- `trustedCheckout`'s marker path `.git/skilled-behaviour-arena` is the path `prepare-behaviour-arena.mjs:314` writes, so a prepared arena is trusted and an unprepared folder is not.
- The holdout file check: `git -c core.fsmonitor=false diff --numstat ec1869dae8..HEAD -- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/holdout-prompts.jsonl` printed `0 1` (zero added, one deleted). No row text was opened.

## Edge Cases

- The trust marker is a fixed, documented file name, not a secret. A folder an attacker fully controls can carry it, so the gate stops accidental replay of arbitrary run-log paths and unprepared clones, not a same-user attacker who controls both the log and the folder. T010 defines the marker as the trust signal and the verifier for this phase accepted that marker path; recorded here as a boundary, not a new finding.
- `backfillRunLog` still reads `locator.transcriptPath` for the brief decision on an untrusted line. That is a read, not a spawn, and it predates this diff; the changed lines only add the spawn gate.
- The busy scan keeps at most 64 characters of stderr between chunks in memory and never returns them; no new data reaches the caller.

## Confirmed-Clean Surfaces

- No changed line writes a holdout prompt or a holdout row. The only change to the sealed file is the one-line deletion the instruction permits, confirmed by numstat.
- `trustedCheckout` returns `false` on any filesystem throw, so a deleted or unreadable checkout fails toward untrusted rather than throwing past the gate.
- `capture-command-routing-baseline` restores all nine names it writes or deletes, with absent names deleted again; no name is left projected into the caller.
- `tsString` now escapes backslash, quote, LF, CR, U+2028 and U+2029 before the value becomes generated TypeScript, so a derived name or description holding a line break cannot end the literal.

## Ruled Out

- A spawn from an untrusted checkout through the brief path: ruled out by reading `briefDelivered`; it reads transcripts and runs the repo's own approval check, never the checkout's hook or CLI.
- A stderr-scan secrecy leak: ruled out by reading `runSpawnAttempt`; the carried text is local and not placed in the result.
- An env-projection leak into the caller after scoring: ruled out by iteration 2's read of the `finally` restore and the nine-name comparison.
- A generated-code injection through a derived string: ruled out by the escaping chain and the round-trip test at `derive-command-bridges-strings.vitest.ts:26-32`.

## Next Focus

- Dimension: traceability and maintainability
- Focus area: plugin change (`system-skill-advisor.js`), plugin test, test-quality checks across every changed test file, and task-line conformance for the whole area
- Reason: security boundaries are now covered; the remaining dimensions are the two the workload has not yet entered, and the plugin is the only changed production file not yet read.
- Rotation status: correctness and security completed; traceability and maintainability begin together.
- Blocked/productive carry-forward: none blocked.
- Required evidence: plugin diff and callers, each changed test's failure mode, and the T00x/T04x task lines.

Review verdict: PASS
