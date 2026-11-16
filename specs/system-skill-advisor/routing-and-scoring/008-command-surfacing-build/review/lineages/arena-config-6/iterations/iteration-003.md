# Review Iteration 003

## Dimension

Primary dimension: **maintainability**, with a **security** read of the same two paths. The maintainability question is what the next reader pays to trust or diagnose these two changes; the security question is whether the new temp folder or the raised read cap widened anything the code already bounds.

Review focus addressed: the operator focus binds this area's three files and the pass-six brief. This iteration re-read the changed lines in the arena builder and in the new regression test, asked what evidence each carries for the next maintainer, and checked the two security-relevant boundaries the changes touch — the privacy mode of the per-run folder and the dotenv filter in the arena copy. No other area's files were opened, no recorded limit was restated, no prompt corpus was opened and `.skilled/hooks/hook-flags.env` was not read.

## Dispatcher

- Mode: review, detached fan-out lineage `arena-config-6`.
- Session: `fanout-arena-config-6-1794815529929-dybl7p`, generation 1, lineage mode new.
- Artifact directory: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/arena-config-6`.
- Budget: 60 tool calls, 10 minutes.
- Doctrine: `.skilled/skills/sk-code/sk-code-review/references/review-core.md` loaded before severity calls.
- Sources read for this pass: the three scope files at `85550ee946e`, `runtime/lib/metrics.ts:451-466`, and the T043 blocked-run record that named the `ENOBUFS` message.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/tests/command-behaviour-guards.vitest.ts:755-789` (and `471-509` for the block's helpers)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/prepare-behaviour-arena.mjs:142-152`, `:358-385` (the dotenv and link boundaries the cap does not touch)
- `.skilled/skills/system-skill-advisor/runtime/vitest.config.ts:9-18`
- `.skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:451-466` (the writer whose records the folder holds)
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/032-review-pass-five-remediation/tasks.md:116` and `:164` (the blocked run and the repair)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The buffer regression test never asserts the premise it guards** -- `.skilled/skills/system-skill-advisor/runtime/tests/command-behaviour-guards.vitest.ts:755-789` -- The test's name and comment say the listing passes the default buffer, but the body only builds the fixture and asserts `built.status === 0` with `ok: true`. Nothing measures the listing, so the test passes unchanged if the fixture shrinks below 1 MiB, and it would also pass if the builder stopped reading the listing at all.
   - Case: a maintainer trims the loop from 6,000 files to 3,000 to shorten the test; the listing becomes 558,018 bytes, well under the 1,048,576-byte default cap, and the test still passes while the overflow it was written for is no longer exercised.
   - Evidence: `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-behaviour-guards.vitest.ts:765-766]` (the fixture loop and its single 171-character name), `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-behaviour-guards.vitest.ts:786-788]` (the two assertions); measured: the fixture prints 1,116,018 bytes, which is 67,442 bytes past the cap.
   - User impact: the suite would keep reporting a passing regression test for a buffer that no longer has anything over it, so a future shrink of the cap or of the fixture loses the guard silently.
   - Finding class: instance-only
   - Scope proof: the assertion set is the whole test body; no other case in the `arena builder` block measures a listing (`rg -n "ls-files" tests/command-behaviour-guards.vitest.ts` returns only this test's helper calls).
   - Affected surface hints: ["command-behaviour-guards arena builder block", "prepare-behaviour-arena git buffer", "regression coverage"]
   - Recommendation: assert the listing size before building — `spawnSync('git', ['ls-files','-z'], { cwd: source, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 }).stdout.length` greater than `1024 * 1024` — so the premise is part of the test.

2. **A listing above the cap is still reported as a spawn failure** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/prepare-behaviour-arena.mjs:150` -- `git()` turns every `result.error` into `StepFailure('spawn_failed', …)`, including `ENOBUFS`. Above the new cap the operator therefore reads the same code and message a missing `git` binary produces, and the packet's own history shows how that reads: T043 was blocked for a day on `prepare-behaviour-arena.mjs: spawn_failed: spawnSync git ENOBUFS`, and the note records the string without naming the buffer as the cause.
   - Case: a monorepo whose `git ls-files -z` reaches about 512 MiB (roughly 2.7 million 190-byte paths) builds an arena; the builder prints `{"ok":false,"code":"spawn_failed"}` and the operator starts by checking whether `git` is installed or on `PATH`, which is the opposite of the real cause.
   - Evidence: `[SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/prepare-behaviour-arena.mjs:148-150]`; `[SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/032-review-pass-five-remediation/tasks.md:164]` (the blocked-run note quoting the same string).
   - User impact: the one diagnosis this fix was written to remove is still the diagnosis above the cap, so a future ceiling raise repeats the same blocked investigation.
   - Finding class: instance-only
   - Scope proof: `result.error` is read in exactly one place in the builder (`rg -n "result.error" prepare-behaviour-arena.mjs` returns `git()` and `runCp()`); `runCp` is a copy failure and keeps `copy_failed`, so the git path is the whole class.
   - Affected surface hints: ["prepare-behaviour-arena git()", "arena builder failure codes", "operator diagnosis"]
   - Recommendation: branch on `result.error.code === 'ENOBUFS'` and throw `StepFailure('listing_too_large', 'git output passed the 512 MiB buffer')`, leaving every other `result.error` as `spawn_failed`.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | pass | Re-checked for this pass: the two changed behaviours still match phase 035's REQ-001 and phase 032's T053; neither new finding contradicts a stated requirement, both are within the delivery. |
| `checklist_evidence` | core | pass | Carried from iteration 2: T002, AC-001, AC-005, T053 and T043 each record observed evidence for the delivered behaviour. |

## Integration Evidence

- `.skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:451-466` — the record writer the per-run folder holds; the records are prompt-free unless `SKILL_ADVISOR_DEBUG` is set.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/prepare-behaviour-arena.mjs:358-385` — `escapingLinks`, the copy boundary the raised cap does not touch.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/prepare-behaviour-arena.mjs:475-487` — `copyPath`, which skips every `.env*` file in the copied build trees.
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/032-review-pass-five-remediation/tasks.md:164` — the blocked-run note that quotes `spawn_failed: spawnSync git ENOBUFS`.

## Edge Cases

- The 512 MiB ceiling was not exercised: reaching it would need about 2.7 million paths, and no fixture in the repository is that large. The finding is therefore about the diagnosis of the ceiling, not about a reproduced run above it.
- The test-premise finding assumes the fixture could shrink without a reviewer noticing; that is exactly the maintenance risk, not a present defect, so it stays P2.
- Security was checked on the two boundaries the diff touches and not widened into a third dimension: the temp folder is created by `mkdtempSync` with mode `0700` (observed), and the dotenv filter in the copy is unchanged by the diff.
- `runCp` keeps its own `copy_failed` code, so the `spawn_failed` confusion is specific to the git path and is not a class over every spawn in the builder.

## Confirmed-Clean Surfaces

- The per-run folder is private: `mkdtempSync` creates it mode `0700` (observed on this machine), and `metrics.ts` still tightens the metrics directory and log files it writes inside it, so moving the records into a `sav-*` folder does not loosen their mode.
- The raised read cap does not widen any write path: `copyPlan`, `copyPath`, `escapingLinks` and `stampBuildTree` are unchanged, and the dotenv filter still runs over every copied build tree.
- The new test's fixture is deterministic: one 171-character base name plus a four-digit prefix produces the same 1,116,018-byte listing every run, which matches the size T053 recorded.
- The builder's failure shapes stay separated on the copy path: `runCp` reports `copy_failed`, and only `git()` reports `spawn_failed`.
- No scope violation occurred: writes stayed inside the lineage directory.

## Ruled Out

- A private-mode regression from moving the health records: `mkdtempSync` creates `0700`, and the writers still set `0700`/`0600` on what they create.
- A dotenv leak reintroduced through the larger read: the cap bounds bytes printed by git; the copy filter is a separate walk and is unchanged.
- A fixture that is flaky in size: the name length and the count are both literals, and the byte size is reproducible.
- An `ENOBUFS` confusion on the copy path: `runCp` maps its own failures to `copy_failed`.

## Next Focus

- Dimension: none remaining.
- Focus area: synthesis only.
- Reason: `maxIterations=3` is reached with correctness, traceability, maintainability and a security read of the changed boundaries covered; no active P0 or P1.
- Rotation status: complete.
- Blocked/productive carry-forward: productive — the packet's own blocked-run note supplied the concrete input for the failure-code advisory.
- Required evidence: the terminal convergence decision, the finding registry, and the synthesis report.
- Recovery note: none; no failed iteration.

Review verdict: PASS
