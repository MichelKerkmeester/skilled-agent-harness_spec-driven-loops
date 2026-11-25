# Iteration 8: Phases 013-skilled-and-doc-alignment and 014-deep-review — can the closing phases prove the packet?

## Focus
Whether the two closing phases can actually prove the build. 013 runs two alignment commands and fixes what they report; 014 runs one expanded five-lineage review and fixes every P0 and P1. Between them they are the packet's only claim that the whole thing works, so their inputs, their evidence and their close conditions matter more than their file lists.

## Actions Taken
1. Read `013-skilled-and-doc-alignment/spec.md:95-150` (scope, files to change, REQ-001..REQ-005) and its handoff criteria at `:33`.
2. Read `014-deep-review/spec.md:38-56` (dependencies, deliverables), `:55-95` (problem, purpose, measured behavior, scope) and `:95-175` (out of scope, files to change, the five-dimension mapping, the five-part stop rule, REQ-001..REQ-010).
3. Read `014-deep-review/plan.md:30, :66, :88, :145-177` for the fan-out mechanics, the roster and the fallback order.
4. Grepped 013 for every mention of 014 and every mention of a handed-over finding.
5. Compared 014's dependency list against 013's handoff criteria to test whether the handoff has a receiver.

## Findings

1. **P1 — 013's handoff has no receiver.** 013's handoff criteria say "What passes to 014 is the two report folders and the clean criterion" (`013/spec.md:33`), and its scope says a finding that needs a runtime change "is recorded and handed to 014 rather than fixed here" (`:112`, restated at `:183` and `:235`). 014's dependency list names only "Phase 013 is clean first: every row in its `acceptance-criteria.md` is `Met`" (`014/spec.md:44`) and never the report folders or the handed-over findings. So a runtime finding 013 deliberately refuses to fix is dropped at the boundary, and 014's fresh review may or may not rediscover it. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/013-skilled-and-doc-alignment/spec.md:33] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/013-skilled-and-doc-alignment/spec.md:112] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/spec.md:44]

2. **P1 — 013's evidence lives outside the checkout, so its close cannot be re-verified.** REQ-002 and REQ-003 write `report.md`, `findings.json` and `fix-plan.md` under `<state>/local-skilled-alignment/system-skilled-bots/<UTC timestamp>/` and `<state>/local-doc-alignment/...`, and REQ-005's clean criterion is a line inside those reports. Nothing copies them into the packet; `implementation-summary.md` records only the folder paths. A later reader, or 014, cannot check that the reports held zero open findings. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/013-skilled-and-doc-alignment/spec.md:154] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/013-skilled-and-doc-alignment/spec.md:158]

3. **P1 — the packet closes without a re-review or a corpus re-run.** 014's out-of-scope forbids "a second review run after the fixes" (`014/spec.md:104`), and 012's 33-scenario corpus is never re-executed after 014's fixes (iteration 7, finding 8). The final state is therefore: fixes applied, `npm test` green, `validate.sh --strict` green, and no evidence that the fixes did not break the surface the review just read or the scenarios the corpus just ran. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/spec.md:104] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/spec.md:30]

4. **P1 — 014's verdict can read PASS while 012's corpus recorded FAILs.** 014's verdict is strongest-restriction over the review's own findings, and the review reads code and docs against the docs that describe them; it never reads `benchmark/reports/<run>/results.csv`. 012's handoff criteria are satisfied by executing the scenarios and naming every FAIL (iteration 7, finding 6). So the packet can close on a PASS verdict beside a corpus that recorded the build broken. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/spec.md:31] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/spec.md:181]

5. **P1 — 014's five-lineage fan-out has no rule for a host with fewer than five executors.** REQ-003 requires five lineages "one per roster executor" and `review/orchestration-summary.json` to list all five labels "with no partition gap" (`014/spec.md:161`). The plan names the roster, each kind's effort, the enforced allowlists and a fallback order that starts at `pi` (`plan.md:149-177`), but nothing says what happens when a kind is not installed on the host: the phase either cannot start, or must record a gap that REQ-003 forbids. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/spec.md:161] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/plan.md:177]

6. **P2 — 013 and 014 disagree on what a P2 finding is worth.** 013 fixes "every finding either report names" with no severity filter (`013/spec.md:110`), while 014 explicitly excludes "fixing a P2 finding" and leaves it open because "the verdict reads PASS with advisories" (`014/spec.md:103`). A P2 that 013 would have fixed is left open by 014, and the two phases' fix passes are not comparable. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/013-skilled-and-doc-alignment/spec.md:110] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/spec.md:103]

7. **P2 — 013's `topics.json` topic is named by field but not by schema.** The files table says the topic carries "title, `terms`, three `codeRoots`, `lanes`, three `checks`" (`013/spec.md:126`) without key names or value shapes. The existing file is a usable precedent, so this is polish rather than a blocker. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/013-skilled-and-doc-alignment/spec.md:126]

8. **P2 — 014's `git status --porcelain` scope check includes the review's own writes.** REQ-009 requires the fix pass to change no file outside the surfaces the review named and `git status --porcelain` to list only those surfaces (`014/spec.md:169`), while the same phase writes `review/` and `implementation-summary.md`, both listed in its own files-to-change table. The check needs the review's own outputs to count as named surfaces, which the requirement does not say. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/spec.md:169]

## Ruled Out
- Reading 014 as under-planned. It is the deepest plan in the packet: five named dimensions mapped onto four canonical ids, a five-part stop rule with the frontier veto and the strongest-restriction verdict, a roster with per-kind effort and enforced allowlists, a fallback order, a file-partitioned fix pass, and a measured test floor. Its gaps are boundary rules, not design.
- Reading 013 as needing a child phase. It is two command runs plus a fix pass; its problem is where the evidence lands, not how much design it needs.
- Treating 014's "at least 381 tests" as a gap. The number is a floor measured before the build, so a larger suite still passes.

## Dead Ends
- Looking for 013's report folders in 014's inputs: 014's dependency list is five bullets and none names them, which is what makes finding 1 a boundary gap rather than a wording quibble.
- Looking for a host-capacity rule in the fan-out contract: the plan's fallback order covers which executor to prefer, not what to do when one is absent.

## Edge Cases
- Ambiguous input: none. Both phases name their commands, outputs and close conditions.
- Contradictory evidence: finding 6 — 013 fixes every finding, 014 fixes only P0 and P1. Both cited; unresolved, and it is a policy choice rather than a defect.
- Missing dependencies: none.
- Partial success: none. All five research actions returned evidence.

## Questions Answered
- Can 013 prove its own close? No — its evidence is outside the checkout and nothing copies it in (finding 2).
- Does 014 receive what 013 hands over? No (finding 1).
- Does the packet close on a proven surface? No — no re-review and no corpus re-run (findings 3 and 4).

## Questions Remaining
- Whether any phase owns the refusal-name registry, since 008, 009 and 012 all mint or assert names across three document layers.
- Whether the packet has a single error/refusal catalogue at all, or whether each phase's names are the only record.

## Sources Consulted
- specs/system-skilled-bots/003-openbot-parity-build/013-skilled-and-doc-alignment/spec.md:33, :95-150, :154-158, :183, :235
- specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/spec.md:31, :38-56, :55-95, :95-175
- specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/plan.md:30, :66, :88, :145-177
- specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/spec.md:30, :181

## Assessment
- New information ratio: 0.90
- Questions addressed: 013's and 014's one-shot readiness; whether the packet's closing evidence survives its own fix pass.
- Questions answered: all three.

## Reflection
- What worked and why: testing the handoff as a claim rather than reading it as prose. 013 says twice that it hands runtime findings to 014; checking 014's dependency list for a receiver took one grep and turned a sentence into a P1.
- What did not work and why: expecting 014 to be the weak phase. It is the strongest document in the packet, so the findings had to come from the seams around it — what it does not read, and what it forbids itself from re-running.
- What I would do differently: read every phase's handoff criteria as a contract with a named receiver from the start. That single lens produced findings 1, 3 and 4 across three iterations.

## Recommended Next Focus
The cross-cutting layer: whether the packet has one error and refusal catalogue, one concurrency and restart rule, and one migration and rollback rule, or whether each phase's names and rules are the only record.
