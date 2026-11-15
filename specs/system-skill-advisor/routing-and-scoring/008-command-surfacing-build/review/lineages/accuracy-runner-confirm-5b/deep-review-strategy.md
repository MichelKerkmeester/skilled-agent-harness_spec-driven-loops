---
title: Deep Review Strategy - accuracy-runner-confirm-5b lineage
description: Runtime strategy tracking the confirming review of pass-five fixes in the accuracy-runner area of command surfacing.
version: 1.11.17.0
---

# Deep Review Strategy - accuracy-runner-confirm-5b lineage

## 1. OVERVIEW

### Purpose

Persistent brain for this fan-out lineage. It records which dimensions remain, what was found
(P0/P1/P2), which review approaches worked or failed, and where to focus next. Read at every
iteration before any review action.

### Ownership

Machine-managed metrics and coverage blocks are wrapped in explicit ownership anchors. Human
commentary and operator overrides live outside those anchors.

---

## 2. TOPIC

Confirming round of review pass five of `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`
in the `accuracy-runner` area. Scope: the eight changed paths listed in
`review/review-scope-5b.txt` whose area is `accuracy-runner` — the routing-accuracy write and
COMMAND readers, the behavior arena builder, the live-turn runner, their README and their three
test files — plus shared docs that describe them. The change range is `2a1a42263cc..d21dbc1cafe`.

The operator focus is the pass-five confirming brief: read `review-brief-5b.txt` first; confirm
that the shell write reader misses no in-place edit, that the COMMAND reader reads only a line
the model printed as its own, that the arena builder refuses a dirty source, a stale build, an
escaping or absolute link and answers a failed check with a JSON line, that a live turn checks
for a remote every turn and has no network push, that the kill-switch names agree in code and
docs, and that docs agree with code. Holdout prompt text is never read or printed.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

---

## 4. NON-GOALS

- The kill-switch docs and tests (`global-disable-flag.md`, `ENV-REFERENCE.md`, the launcher and
  stale-daemon retry suites) are the `kill-switch-cli-confirm-5b` lineage's scope. This lineage
  reads them only as context evidence and raises no finding against them.
- The Vibe and Claude hook, the doctor check and the docs-metadata files are the
  `vibe-hooks-doctor-confirm-5b` and `docs-metadata-confirm-5b` lineages' scope.
- Holdout prompt text is never read or printed. Corpus work is limited to counts and
  `jq 'del(.prompt)'` rows.
- No code changes: review is observation-only.
- No runtime command, build, test run or generator is executed against the review target;
  every claim is grounded in a direct file read of the changed commit.

---

## 5. STOP CONDITIONS

- Convergence: `newFindingsRatio` at or below the 0.10 threshold with no active P0.
- Cap: `maxIterations` 3.
- Stuck: two consecutive iterations with no new evidence (stuckThreshold 2).
- Any active P0 blocks PASS regardless of convergence.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->

---

<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 0
- P2 (Suggestions): 8
- Resolved: 0

<!-- /ANCHOR:running-findings -->

---

## 6. KNOWN CONTEXT

- `review/verify-5/report.md` grades the accuracy-runner findings: two P1 (shell writes invisible,
  arena build not the commit), one true-P2 remote guard, and seven P2 in this area. Those are the
  fixes this round confirms.
- `032-review-pass-five-remediation/plan.md` D13 records items left unbuilt; a finding may not
  re-report them without a new input that breaks them.
- `review-scope-5b.txt` names the eight paths of this lineage; no other path is a review target.

---

## 7. WHAT WORKED

- Reading the new `shellWriteTargets` block against the plan's D1 writer table word by word
  surfaced the exact spelling each writer branch handles before any test was read. (iteration 1)
- Calling `normalize` and `commandLines` in memory on one-call records gave a table of spellings
  that separated the writers D1 named from the ones it did not, without running the suite. (iteration 1)
- Reading the long-target test rather than its title showed the assertion checks existence, not the
  path, which is why the misnamed copy survived. (iteration 1)

---

## 8. WHAT FAILED

- Nothing failed in iteration 1: both readers are pure functions reachable from an in-memory probe,
  so every case in the findings was reproduced directly. (iteration 1)
- The arena builder could not be executed: a probe needs a temp source repository, which is outside
  this lineage's write surface, so iteration 2 is a read of the checks and their pinning tests
  rather than a run. (iteration 2)
- The two documentation findings come from reading the README rows against the code, not from a
  doc tool: no doc validator ran, because the changed rows already pass the packet's own DOCV gate
  and the gap is one of omission. (iteration 3)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### "`cp -t dest src.md` names the source": ruled out; the probe prints `dest` and the test pins it. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "`cp -t dest src.md` names the source": ruled out; the probe prints `dest` and the test pins it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "`cp -t dest src.md` names the source": ruled out; the probe prints `dest` and the test pins it.

### "`sed -i.bak` or `perl -i.bak` loses the edited file": ruled out. The script word is marked and the file survives in both readers. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "`sed -i.bak` or `perl -i.bak` loses the edited file": ruled out. The script word is marked and the file survives in both readers.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "`sed -i.bak` or `perl -i.bak` loses the edited file": ruled out. The script word is marked and the file survives in both readers.

### "A dirty source still writes a partial arena": ruled out; all source checks end before `mkdirSync(dirname(dest))` (`:581`). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "A dirty source still writes a partial arena": ruled out; all source checks end before `mkdirSync(dirname(dest))` (`:581`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "A dirty source still writes a partial arena": ruled out; all source checks end before `mkdirSync(dirname(dest))` (`:581`).

### "A dry run is now refused for a missing arena": ruled out; `turnRefusal` returns null for `dryRun` before it reads git (`:650-652`). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "A dry run is now refused for a missing arena": ruled out; `turnRefusal` returns null for `dryRun` before it reads git (`:650-652`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "A dry run is now refused for a missing arena": ruled out; `turnRefusal` returns null for `dryRun` before it reads git (`:650-652`).

### "A lane A task is marked `[x]` without a verifier pass": ruled out for T003-T005a, T049-T051a, T006-T014 and T044-T048a; each line carries an `Evidence:` clause. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "A lane A task is marked `[x]` without a verifier pass": ruled out for T003-T005a, T049-T051a, T006-T014 and T044-T048a; each line carries an `Evidence:` clause.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "A lane A task is marked `[x]` without a verifier pass": ruled out for T003-T005a, T049-T051a, T006-T014 and T044-T048a; each line carries an `Evidence:` clause.

### "A quoted separator inside a commit message becomes a write": ruled out; `git commit -m "docs; rm stale notes"` emits no write. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "A quoted separator inside a commit message becomes a write": ruled out; `git commit -m "docs; rm stale notes"` emits no write.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "A quoted separator inside a commit message becomes a write": ruled out; `git commit -m "docs; rm stale notes"` emits no write.

### "A refusal or a sentence that quotes the marker is read as a start": ruled out. `The model printed COMMAND: /deep:review → started in its reply.` returns no line, and a line that opens with `>` returns none. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "A refusal or a sentence that quotes the marker is read as a start": ruled out. `The model printed COMMAND: /deep:review → started in its reply.` returns no line, and a line that opens with `>` returns none.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "A refusal or a sentence that quotes the marker is read as a start": ruled out. `The model printed COMMAND: /deep:review → started in its reply.` returns no line, and a line that opens with `>` returns none.

### "Copying still assumes `cp -Rc` on every platform": ruled out; `copyArgs` returns `['-R']` off darwin and the test pins both (`command-behaviour-guards.vitest.ts:506-508`). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "Copying still assumes `cp -Rc` on every platform": ruled out; `copyArgs` returns `['-R']` off darwin and the test pins both (`command-behaviour-guards.vitest.ts:506-508`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Copying still assumes `cp -Rc` on every platform": ruled out; `copyArgs` returns `['-R']` off darwin and the test pins both (`command-behaviour-guards.vitest.ts:506-508`).

### "The builder paragraph still claims the `.env` skip covers the clone": ruled out; the code header narrows it to the copied build trees and the README names the tracked-dotenv case beside it. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "The builder paragraph still claims the `.env` skip covers the clone": ruled out; the code header narrows it to the copied build trees and the README names the tracked-dotenv case beside it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The builder paragraph still claims the `.env` skip covers the clone": ruled out; the code header narrows it to the copied build trees and the README names the tracked-dotenv case beside it.

### "The every-turn guard is skipped on a later turn": ruled out; `turnRefusal` is outside the `isFirst` branch at `:1296-1308`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "The every-turn guard is skipped on a later turn": ruled out; `turnRefusal` is outside the `isFirst` branch at `:1296-1308`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The every-turn guard is skipped on a later turn": ruled out; `turnRefusal` is outside the `isFirst` branch at `:1296-1308`.

### "The marker is still written by more than one code path": ruled out; one exported constant, imported by the runner, the offer replay and both tests. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "The marker is still written by more than one code path": ruled out; one exported constant, imported by the runner, the offer replay and both tests.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The marker is still written by more than one code path": ruled out; one exported constant, imported by the runner, the offer replay and both tests.

### "The mode-suffix tally double-counts one command": ruled out; `commandLines` and `repeatedCommands` both key on namespace and name. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "The mode-suffix tally double-counts one command": ruled out; `commandLines` and `repeatedCommands` both key on namespace and name.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The mode-suffix tally double-counts one command": ruled out; `commandLines` and `repeatedCommands` both key on namespace and name.

### "The new marker lines break the runner or the offer replay": ruled out; both readers call `existsSync` on the marker path only. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "The new marker lines break the runner or the offer replay": ruled out; both readers call `existsSync` on the marker path only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The new marker lines break the runner or the offer replay": ruled out; both readers call `existsSync` on the marker path only.

### "The new write branch drops a redirect target": ruled out; a call with both a redirect and an in-place writer emits the redirect target first, then the writer's targets. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "The new write branch drops a redirect target": ruled out; a call with both a redirect and an in-place writer emits the redirect target first, then the writer's targets.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The new write branch drops a redirect target": ruled out; a call with both a redirect and an in-place writer emits the redirect target first, then the writer's targets.

### "The README still frames the absolute-link refusal as an outside link": ruled out; T048a's correction is in place at :111 and :143. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "The README still frames the absolute-link refusal as an outside link": ruled out; T048a's correction is in place at :111 and :143.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The README still frames the absolute-link refusal as an outside link": ruled out; T048a's correction is in place at :111 and :143.

### "The runner row still omits the every-turn check": ruled out; `README.md:137` states it, and the code calls `turnRefusal` before every turn. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "The runner row still omits the every-turn check": ruled out; `README.md:137` states it, and the code calls `turnRefusal` before every turn.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The runner row still omits the every-turn check": ruled out; `README.md:137` states it, and the code calls `turnRefusal` before every turn.

### "The spec's phase row contradicts the stricter link rules": ruled out; the row says "a link that leaves the source", which the extra absolute and dangling refusals tighten rather than contradict. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "The spec's phase row contradicts the stricter link rules": ruled out; the row says "a link that leaves the source", which the extra absolute and dangling refusals tighten rather than contradict.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The spec's phase row contradicts the stricter link rules": ruled out; the row says "a link that leaves the source", which the extra absolute and dangling refusals tighten rather than contradict.

### "The stale rule passes a clean tree with an old build" (verifier case B): ruled out by reading `staleBuilds`, which compares the copied build with the tracked sources rather than the tree state, and by the test at `command-behaviour-guards.vitest.ts:603-620`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "The stale rule passes a clean tree with an old build" (verifier case B): ruled out by reading `staleBuilds`, which compares the copied build with the tracked sources rather than the tree state, and by the test at `command-behaviour-guards.vitest.ts:603-620`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The stale rule passes a clean tree with an old build" (verifier case B): ruled out by reading `staleBuilds`, which compares the copied build with the tracked sources rather than the tree state, and by the test at `command-behaviour-guards.vitest.ts:603-620`.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining. All four dimensions have one full pass; the two carried P2 groups are the four reader findings and the two guard findings. - Focus area: synthesis - Reason: maxIterations 3 is reached with no active P0 or P1 - Required evidence: the registry, the dashboard, and the six P2 rows this lineage records - Recovery note: not applicable Review verdict: PASS

<!-- /ANCHOR:next-focus -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded
