# Iteration 002 - security

## Dimension

Security: the guard sits on the boundary between untrusted prompt text and a recommendation that can carry a mutating command. This pass asks whether prompt text can steer the guard through pattern construction, backtracking, or markup folding.

## Dispatcher

```text
BINDING: target=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build
BINDING: maxIterations=8
BINDING: convergence=0.1
BINDING: mode=review
BINDING: dimensions=correctness,security,traceability,maintainability
BINDING: specFolder=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build
```

Resolved route: mode=review target_agent=deep-review; execution=single_review_iteration; state_source=externalized_files.

Operator review focus: pass fourteen, area `mention`. The security pass stayed on the two `mention` scope files and honored the holdout rule: no corpus or holdout file was opened, no forbidden diff was run, and no session text was read.

Sources: `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1-572`, `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:1-621`, `review-brief-14.txt:1-10`, `review-scope-14.txt:1-5`.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1-572`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:1-621`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-brief-14.txt:1-10`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-scope-14.txt:1-5`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

Not run in this iteration; the traceability pass is iteration 3.

## Integration Evidence

- `commandOnlyMentioned` is exported and reached from two consumers in the same file: `typedCommandForTop` (`command-attach.ts:259`) and `attachCommand` (`command-attach.ts:533`). Both feed a command whose `policy` can be `start` or `ask`, so a wrong mention reading changes what the reader is offered.
- `typedCommandIn` (`command-attach.ts:221-245`) is the only other prompt-text matcher on this path; it does not build a pattern from prompt text at all.

## Edge Cases

- The fold at `command-attach.ts:443-451` removes brackets, parentheses, quotes, guillemets, primes and code tags before the rules run. That is deliberate: a refusal wrapped in any of them still reads as a refusal (verified on four wrapped prompts). It cannot be used to hide a refusal, because removing the wrapper exposes the lead rather than the reverse.
- The occurrence regex is rebuilt per call, but only from static vocabulary plus `escapePhrase`d command names; the prompt contributes no pattern text.
- A 400,025-character prompt with a trailing refusal completed in 11 ms; 400,016 characters of `and ` repetitions, 200,000 slashes, and 200,000 dots each completed in 6 ms or less. No nested-quantifier blowup was found on the looked-for classes.
- Trust boundary: `commandOnlyMentioned` takes the raw prompt, so every value the prompt can send is in reach (`review-core.md` reach calibration). The only effect is the boolean reading; no code execution, file access, or network use exists on this path.

## Confirmed-Clean Surfaces

- Every `new RegExp` site (`command-attach.ts:323, 327, 407, 415, 456, 466, 468, 470, 473, 480`) builds from static text, or from `escapePhrase`d command spellings, or from the shared `COMMAND_OR_LIST` vocabulary. No prompt substring is interpolated unescaped.
- The two changed patterns (`415`, `465`) are static regexes with only optional groups; no unbounded repetition over prompt-derived alternatives.
- `COMMAND_OR_LIST` is a fixed pattern built from `[a-z]` classes, and the lead lists are constants.
- The suite's wrapper matrix (`tests:175-189`) already asserts that every fixture reads the same wrapped as plain, which is the security-relevant invariance for the fold.

## Ruled Out

- Regex injection through a command name: `escapePhrase` (`command-attach.ts:316-318`) escapes every metacharacter; both the occurrence regex and the determiner regex use the result.
- Backtracking denial of service on long or repetitive prompts: measured at 11 ms for 400k characters on the worst tried shape; the alternations are literal and bounded.
- Markup folding used to turn a refusal into a request: the fold strips the wrapper, and a wrapped refusal still returns a mention (`(do not run /create:readme)`, `[do not run /create:readme]`, `**never use /create:readme**`, `` `what does /create:readme do?` ``).
- Consent bypass in the fold: the guard's output only withholds or allows the offer; the refusal misreads are carried as correctness at `R1-P1-001` and `R1-P1-002`, and no separate security defect was found.

## Next Focus

- Dimension: traceability
- Focus area: the pass-thirteen decision record and the phase-040 problem statement against the two changed rules; record `spec_code` and `checklist_evidence`.
- Reason: correctness found two behavior gaps; the traceability pass must say whether the recorded claims are consistent with what was implemented.
- Rotation status: correctness and security complete; traceability next.
- Blocked/productive carry-forward: no exhausted approaches.
- Required evidence: `040-final-alignment-loop/spec.md` problem statement, `implementation-summary.md` decision row, and the task evidence line for the two fixes.

## Verdict

No finding in this dimension; the two P1s from iteration 1 remain active but are not security defects.

Review verdict: CONDITIONAL
