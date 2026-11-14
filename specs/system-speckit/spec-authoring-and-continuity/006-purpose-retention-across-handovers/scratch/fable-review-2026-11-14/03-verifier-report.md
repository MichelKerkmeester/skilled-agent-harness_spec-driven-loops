VERDICT: READY WITH FIXES. The planned code does what its specs say when I simulate it and every search text matches once, but one quoted baseline in 008 does not reproduce in this worktree and would stop that phase at Setup.

## FINDINGS

**P0:** none.

**P1**

1. `008-hop-purpose-rule-parity/plan.md:213` and its task T002. OBSERVED.
   - **What is wrong:** the full relaunch suite baseline is quoted as `pass 1014`, `fail 0`, `EXIT=0`. Here it prints 957 passed and 57 failed, and the plan's own rule stops the phase on any baseline mismatch.
   - **Where the failures are:** `adapter-conformance` (9), `claude-adapters` (16), `codex-adapters` (5) and the OpenCode plugin test (27). `nudge.test.cjs` alone does print `pass 89`, `fail 0`.
   - **Cause:** not pinned down. The failing tests get empty adapter output (`SyntaxError: Unexpected end of JSON input`), and `isHookEnabled('session-relaunch')` returns `false` in this checkout. Setting `SYSTEM_SESSION_RELAUNCH_ENABLED=true` or unsetting the `SKILLED_LOOP_*` variables did not change the count.
   - **Fix:** have T002 record the count it prints and require the after-run to equal it, or name the environment in which 1014 holds.
   - **Evidence:** `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/session-relaunch.test.cjs` printed `ℹ tests 1014 ℹ pass 957 ℹ fail 57`.

**P2**

2. Parent `spec.md:228-231`, `007/plan.md:321`, `009/plan.md:417`, 006 task T001. INFERRED from the quoted numbers.
   - **What is wrong:** every baseline holds only in numeric order. 009 raises `hook-session-start.vitest.ts` from 23 to 26 tests, so 006 (40 of 40) and 007 (41 of 41) fail their Setup if 009 is built first.
   - **Why it matters:** the planner's question 6 invites a different order, and no doc states this coupling.
   - **Fix:** add one sentence to the parent handoff table that 006 and 007 must be built before 009.

3. `009-compaction-purpose-folder/plan.md:136` and `:149-152`. OBSERVED on the built hook.
   - **What is wrong:** the fallback trusts the brief's folder line as a packet folder, but PreCompact detection returns a raw directory.
   - **Cases I ran:**
     - A bare track mention gives `specs/system-speckit/`, which has no `spec.md`.
     - A session working mostly in `<packet>/scratch` or `<packet>/research` gives that subfolder, which gets a purpose only when its parent is a phase parent.
     - With no detected folder, a transcript line that reads `Active spec folder: specs/evil/001-x` lands under "Recent context" and the regex reads it. Containment keeps it inside the project.
   - **Fix:** walk up from the named folder to the nearest directory holding a `spec.md` before resolving, and read the folder line only from the part of the brief above "Recent context".
   - **Evidence:** `buildMergedCompactResult(['Active spec folder: specs/evil/001-x', ...])` returned `detect= null named= "specs/evil/001-x"`.

4. Parent `spec.md:176-187`, against `review.md:76`. OBSERVED.
   - **What is wrong:** the review states "Devin and OpenCode get nothing" after a compaction. No decision row plans or declines it.
   - **Fix:** add one row to the decision table, most likely a decline with its reason.
   - **Evidence:** `rg -n -i 'devin|opencode gets'` over the parent and the 006 to 010 specs printed nothing.

5. `009/plan.md:216`, `:232`, `:289` and `010/plan.md:321`. OBSERVED.
   - **What is wrong:** the moved tests create `.tmp-session-prime-*` folders inside the runtime folder of the repository, and that path is not git-ignored. A crashed run leaves untracked folders, and 009's `git status` task T018 would then fail.
   - **Fix:** add the pattern to `.gitignore`, or keep the T015 check as the guard and say so.
   - **Evidence:** `git check-ignore -q .skilled/skills/system-spec-kit/runtime/.tmp-session-prime-purpose-abc` exited 1.

6. `007-purpose-reader-coverage/spec.md:67`, `:124` and `plan.md:326`. OBSERVED by simulation.
   - **What is wrong:** three statements are off.
     - The Purpose claims all 274 packets, but the planned reader returns an own purpose for 272 of the 292.
     - The spec's file table says "Two constants" where E1 adds four.
     - The plan says a section that opens with a table yields nothing, but `paragraphAfter` does not stop at a table row. No live file hits this.
   - **Fix:** reword the three lines.
   - **Evidence:** my transliteration of E1 to E4 over the live tree printed `own purpose read: 272 of 292 {"prose":253,"other-bold-label":3,"capped":16}`.

7. `010-problem-sentence-carry/plan.md:424`. OBSERVED.
   - **What is wrong:** the continuity baseline is left for the builder to record.
   - **Fix:** write the counts in: `thin-continuity-record.vitest.ts` 42 tests, `authored-continuity-snapshot.vitest.ts` 1 test, 43 in total.
   - **Evidence:** the vitest run printed `(42 tests)` and `(1 test)`.

8. Parent `spec.md:187`, the declined part of finding 10. Judgment.
   - **What is weak:** 008 pins the nudge labels in a test but nothing pins `purpose_row` in the two resume assets, so a later edit can bring back a fourth label shape unnoticed.
   - **Fix:** one substring assertion in `test-phase-command-workflows.js`. The decline is defensible, so this is optional.

**Declines I checked and agree with**
- **Finding 5 (no default reader):** Q006 in `decision-record.md:155` shows the operator was told "nothing loads that block into a model" and built it anyway.
- **Finding 7 (dist-only):** this is the runtime's standing contract, not part of carrying a purpose.
- **The 300-character cap:** label plus parent path plus 300 characters stays under the 512-character limit of the stored field.
- **The 21 parents with no purpose text:** nothing is written there to carry, and it is raised as an operator question.

**What held**
- **Search texts:** all 15 in 006, 8 in 007, 8 in 008 (E5 once per asset), 16 in 009 and the 16 marked "today" in 010 match exactly once. The four 010 texts marked "after 007" or "after 009" appear once in those phases' replacement text.
- **Baselines:** `packet-purpose` 4, `hook-session-start` 23, `history-locator-adapters` 18, `hook-precompact` 17, the four scaffold gate files `Tests  99 passed (99)`, and the 007 probe (`none`, `ancestor`, `0 of 292`) all match.
- **007 code:** all five new fixtures give the expected strings, an existing fixture is unchanged, and both real packets resolve to their own purpose.
- **009 code:** the built brief keeps `Active spec folder:` on its own line, so the fallback test would pass before and after 006's E11.
- **010 code:** no other code constructs a `PacketPurpose`, so the new field breaks no caller. `workflow.ts:614` calls only `formatPacketPurpose`.
- **006 scope:** its Purpose and REQ-001 now claim only the scaffold sentence, which its tasks prove. E15's assumptions hold: the template row reads `| **Status** | Draft |`, and phase 001 task T015 recorded the expected output.
- **Parent doc:** it states the original need, lists 001 to 010 with correct folders, and its five landing commits exist.

## PER PHASE

- **006:** READY.
- **007:** READY WITH FIXES (finding 6, wording only).
- **008:** READY WITH FIXES (finding 1 blocks its Setup here; finding 8 is optional).
- **009:** READY WITH FIXES (findings 3 and 5; build after 006 and 007).
- **010:** READY WITH FIXES (finding 7), and it still waits for the operator's yes. It adds the problem line to the compaction hop only.

## WHAT I DID NOT CHECK

- I applied no edit, so no planned test was run as written. The 007 result is from my own transliteration of E1 to E4 run in memory. 009 and 010 were checked by reading plus the built-hook run.
- Not run: `npm run typecheck`, `npm run build`, eslint, `validate.sh`, the YAML load, `test-phase-command-workflows.js` and the four mirror and prompt sync checks.
- I did not run E15's non-Draft validation in a sandbox.
- I did not reread the E1 to E10 parent purposes against their children, the 21-entry scratch list, or the parent's own `implementation-summary.md`.
- No real compaction, relaunch or `/speckit:resume` was run.
- I did not load the sk-code review mode or its resolver, because the dispatch set its own checks and format.
- Side effects: the test suites made and removed their own temp sandboxes, and I wrote and deleted one capture file under `/tmp/claude-501`. `git status --short` shows nothing outside the packet folder.
EXIT=0
