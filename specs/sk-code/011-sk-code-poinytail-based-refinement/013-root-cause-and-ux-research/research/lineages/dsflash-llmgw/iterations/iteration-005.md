# Iteration 5: Document-claim blockers and the hook stdin deadline

## Focus

Part 2's remaining two named items: the 36 HVR hard blockers in `.skilled/skills/sk-code/SKILL.md`, and the 500 ms hook stdin deadline that runs on hosts with a 3 s budget without a late-write test. Both confirmed by running the shipped scanner and reading the deadline constants, their consumers, the deadline test suite, and the recorded Known Limitations.

## Actions Taken

1. Ran the shipped voice scanner over the hub `SKILL.md` and read the blocker breakdown and totals.
2. Located `SHORT_HOST_STDIN_TIMEOUT_MS` and its consumers across the runtime hooks; read the hook READMEs' deadline contract and the v2.7.2.0 changelog entry.
3. Read `.skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs` end to end, including the `runHook` helper's write timing, and the round-four child's Known Limitations.

## Findings

1. **The 36 hard blockers are one punctuation class in one file: 27 semicolons and 9 em dashes.** The shipped scanner reports `x27 hard punctuation ;` and `x9 hard punctuation —` for `.skilled/skills/sk-code/SKILL.md`, the always-loaded hub document; the epic recorded the same count at multiple checkpoints (for example "`SKILL.md` kept 0 issues and 36 hard blockers") and deliberately left it while other files were swept to zero (the OpenCode guardrails went 4 to 0 in the same round four). [SOURCE: command: `python3 -I .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py .skilled/skills/sk-code/SKILL.md` -> hard blockers 36] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/008-session-aware-tie-break/plan.md:117] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/005-doc-claims-hardening/implementation-summary.md:83] — **CONFIRMED** (ran the scanner; read the records). **P2 by external-user impact**: the framework's own voice gate fails its most-read document, which teaches adopters that the gate is optional. **Smallest fix**: one punctuation sweep over the file replacing the 27 semicolons with sentence breaks and the 9 em dashes with other punctuation, proved by the same scanner printing `hard blockers: 0`; no code, no rule change.

2. **The 500 ms deadline exists in two constants and serves six short-budget readers; the 3 s host budget is documented, not measured.** `SHORT_HOST_STDIN_TIMEOUT_MS = 500` is defined in `shared-stdin.ts:23` (compiled adapters) and `hook-adapter-shared.mjs:17` (plain adapters). It is passed by the Claude `user-prompt-submit` shim, `session-prime`, `compact-inject`, both `spec-gate-classify` adapters, and the Codex `session-start` and `user-prompt-submit` adapters; the README states the reason ("the entries whose host kills them after 3 seconds") and the changelog repeats it. The value is a judgment: the round-one child recorded "no host write latency was measured, so 3000 ms is a judgment", and the short value inherits that. [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/shared-stdin.ts:23] [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/lib/hook-adapter-shared.mjs:17] [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/README.md:88] [SOURCE: .skilled/skills/system-spec-kit/changelog/v2.7.2.0.md:12] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/009-round-two-follow-ups/005-hook-stdin-deadlines/implementation-summary.md:13] — **CONFIRMED** (read). **P1 by external-user impact**: a host that writes its hook payload later than 500 ms loses the payload silently. **Smallest fix**: decide the intended semantics before editing — either keep the drop and pin it with a test (finding 3), or start the deadline when the first byte arrives and cap the total below the host budget; the one-constant change is the smallest once the semantics are chosen.

3. **There is no late-write test: the suite's payload case writes at spawn, and the child records the resulting loss.** `runHook` writes the payload immediately after spawn when `holdOpen` is set, then holds the pipe open; the "short-deadline entries still act on a payload" test therefore proves only an immediate write, not a write after the 500 ms deadline. The round-four child's Known Limitation 2 states the untested behavior plainly: "A payload written more than 500 ms after the hook starts, on a stdin that stays open, is cut short. The hook takes its empty or invalid payload answer. Hosts write the payload at spawn." [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs:116] [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs:225] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/007-hook-deadline-margins/implementation-summary.md:4] — **CONFIRMED** (read the write timing and the limitation). **P1**: on a slow host, session context and advisor injection silently go missing, and a guard takes its fail-open branch. **Smallest fix**: add one test case that writes the payload after ~800 ms to a short-deadline entry and asserts the observed outcome, so the drop is pinned and visible; changing the deadline then becomes a deliberate follow-up rather than a guess.

4. **Two adjacent gaps compound the deadline risk, both already recorded.** Known Limitation 1: a held-open stdin plus a child that runs to its own timeout still passes 3 seconds, so the host still kills that case (the 500 ms read plus a 2500-2800 ms child wait exceeds the host budget). Known Limitation 3: the compiled shim's 1 MB overflow path is covered by no suite; a manual 2.2 MB probe was the only evidence. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/007-hook-deadline-margins/implementation-summary.md:3] — **CONFIRMED** (read). **P2**. **Smallest fix**: none new — these are inputs to the phase's test list, not separate mechanisms.

## Ruled Out

- **Lowering every deadline to the host budget.** Rejected under `.skilled/repo-rules/prevent-overengineering.md`: the short value exists so post-read work finishes before the host's 3 s kill, and raising it trades a silent loss for a killed hook — a worse failure with the same uncertainty. The smallest correct step is the test that makes the trade-off visible (finding 3), then a measured host-write latency if the loss proves real.
- **A configurable per-host deadline.** Rejected: no host exposes its write latency or budget to the hook today, so the option would have no input to read.

## Dead Ends

- No test in the repo writes a hook payload after the deadline, and no host-latency measurement exists anywhere in the records; both would be the evidence that turns the risk into a number.

## Edge Cases

- Ambiguous input: "no late-write test" could mean no test at all for held-open stdin; the suite does test a prompt held-open write (line 225). The interpretation kept is the one the child recorded: no test writes after the deadline.
- Contradictory evidence: the changelog says the suite "checks that a payload written to a stdin that stays open still reaches the shim's advisor and the Claude and Codex session hooks" — true, and compatible with finding 3, because the write in that test is immediate.
- Missing dependencies: none.
- Partial success: both items confirmed with exact counts and constants. `Status: complete`.

## Questions Answered

- Q7: Why does .skilled/skills/sk-code/SKILL.md carry 36 HVR hard blockers, and what does the 500 ms hook stdin deadline against a 3 s hook budget risk? — answered.

## Questions Remaining

- Q8 to Q10.

## Sources Consulted

- command: `python3 -I .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py .skilled/skills/sk-code/SKILL.md` -> hard blockers 36 (27 semicolons, 9 em dashes)
- .skilled/skills/system-spec-kit/runtime/hooks/shared-stdin.ts:23
- .skilled/skills/system-spec-kit/runtime/hooks/lib/hook-adapter-shared.mjs:17
- .skilled/skills/system-spec-kit/runtime/hooks/README.md:88
- .skilled/skills/system-spec-kit/changelog/v2.7.2.0.md:12
- .skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs:116,225
- specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/007-hook-deadline-margins/implementation-summary.md:3-5
- specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/008-session-aware-tie-break/plan.md:117
- specs/sk-code/011-sk-code-poinytail-based-refinement/009-round-two-follow-ups/005-hook-stdin-deadlines/implementation-summary.md:13

## Assessment

- New information ratio: 0.88
- Questions addressed: Q7
- Questions answered: Q7

## Reflection

- What worked and why: running the shipped scanner turned "36 hard blockers" into an exact punctuation inventory, and reading `runHook`'s write timing proved the missing late-write case rather than asserting it.
- What did not work and why: no host-latency measurement exists to size the risk; recorded as the settling artifact instead of a fabricated number.
- What I would do differently: for deadline claims, read the test helper before the test body — the timing lives in the helper.

## Recommended Next Focus

Iteration 6: the reducer change that lowered open findings in 146 review folders — read the round-four parser child's records and the reducer code, count the affected folders, and name the mechanism by which findings disappeared, including whether any were lost rather than superseded.
