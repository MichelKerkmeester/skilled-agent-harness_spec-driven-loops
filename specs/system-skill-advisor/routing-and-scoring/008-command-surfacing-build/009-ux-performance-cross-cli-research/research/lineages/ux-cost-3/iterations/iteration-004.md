# Iteration 4: Change sites, test surfaces, and the two constraints that change the ranking

## Focus

A verification pass on the three ranked changes: where exactly each lands, which existing test each extends, and whether any of them carries a contract risk that the ranking in iteration 3 did not price. This is the "thought plus narrow reads" iteration the previous assessment recommended.

## Focus Selection Check

Strategy next focus named the verification pass after KQ3. No exhausted approach applied. The pass is narrow by design: it reads the call sites and tests for the three named changes only, and it does not re-open any measured cost.

## Actions Taken

1. Read the `emitDiagnostic` call graph in the Claude hook and the `persistAdvisorHookDiagnosticRecord` signature.
2. Read the `hookHealth` schema and the existing status and hook test files.
3. Read the health-section builder's window constant.
4. Checked whether the brief-cost script has a test surface and whether `--root` makes a fixture test possible.

## Findings

1. **Change 1 lands in one function, not six call sites.** `emitDiagnostic` is the single funnel: the hook calls it at lines 301, 313, 329, 415, 449 and 512, and every call goes through the same `persistDiagnostic` call. So the default-on health record is a change inside `emitDiagnostic` and one new optional parameter on `persistAdvisorHookDiagnosticRecord`, not six edits. [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:238-256] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:445-452]

2. **The writer already has the ungated path; only the persist wrapper lacks a pass-through.** `writeBoundedJsonl` takes `options.requireDebug` and skips the gate only when it is explicitly `false`. So change 1 needs no new writer, no new file and no new trim logic — one parameter threaded through one function. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:314-316]

3. **A health-only record is schema-legal without any type change.** `createAdvisorHookDiagnosticRecord` adds `skillLabel` and `errorDetails` only when they are present, and the validator accepts their absence. So the default record is the same type with two optional fields omitted, which means no migration and no reader change. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:377-423]

4. **The health window is 30 invocations, which is the real gain of a default flip.** `buildAdvisorHookHealthSection` keeps only `records.slice(-MAX_HEALTH_RECORDS)` with `MAX_HEALTH_RECORDS = 30`, and `invocations` is that slice's length, so `/doctor:setup` can never say more than "over 30 prompts". Today a debug session's three records produce "over 3 prompts"; default-on turns the same field into a rolling window of the last 30 prompts, which is the number the field's name implies. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:179] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:468-475]

5. **Change 3 is a strict-schema change, not an additive one, and the ranking must say so.** `AdvisorStatusOutputSchema` is `.strict()` at the top level and `hookHealth` is `.strict()` inside it, so a reader built from an older `dist` throws on an unknown `lastRecordAt`. The CLI and the schema ship in the same build, so the risk is the known stale-`dist` hazard rather than a wire-format one, but it is a contract change: it must land with a rebuild and with a test that parses the new field. This downgrades change 3 from "no risk" to "no runtime risk, one build-coupling risk". [SOURCE: .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:451-457]

6. **Both of change 1's shapes already have a home in the status tests.** `advisor-status.vitest.ts` holds "reports hook health from durable diagnostic records", which sets `SKILL_ADVISOR_DEBUG=1` and expects two invocations, and "omits hook health when no diagnostic records exist". Change 1 adds one case between them: with the variable unset, one write produces a record, `hookHealth.invocations` is 1, and the record carries no `skillLabel`. Change 3 adds one assertion on the same fixture. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-status.vitest.ts:512-541]

7. **The brief-cost script can be tested without a daemon, which makes change 2 cheap to prove.** `measure-brief-cost.mjs` accepts `--root`, and it reads both the corpus and the hook from that root, so a temporary fixture with a two-row corpus and a stub hook that prints an outage envelope exercises the refusal path with no daemon and no real corpus. That is the same fixture shape the head-length and golden tests already use. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/measure-brief-cost.mjs:64-84]

## Questions Answered

- None new; this iteration prices the implementation of the three changes and corrects one risk rating.

## Questions Remaining

- Whether the plugin-shaped runtimes (OpenCode, Pi, DSH) can carry any health signal at all, and what the brief costs per runtime rather than per Claude prompt.

## Ruled Out

- **Threading the gate decision through all six `emitDiagnostic` call sites.** Rejected: the funnel already exists and six edits would be six places to drift.
- **Adding `lastRecordAt` beside the field instead of inside `hookHealth`.** Rejected: it would still be a strict-schema addition, and it would separate the age from the number it qualifies.

## Dead Ends

- Looking for a doctor presentation line for hook health outside the leg text: `doctor-setup-presentation.txt` and `setup.md` carry no hook-health string, so the leg text in `doctor-setup.yaml` is the only display contract. Any wording change for change 3 lives there.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: none. Iteration 3 called change 3 "zero risk"; the strict schema shows one build-coupling risk. The correction is recorded rather than smoothed over.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:238-256, 301-329, 415-449, 512`
- `.skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:179-180, 314-316, 377-423, 445-452, 468-475`
- `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:451-457`
- `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-status.vitest.ts:512-541`
- `.skilled/skills/system-skill-advisor/runtime/scripts/measure-brief-cost.mjs:64-84`

## Assessment

- New information ratio: 0.72
- Questions addressed: implementation map for all three changes
- Questions answered: none new

## Reflection

- What worked and why: reading the funnel before the call sites turned a suspected six-file change into one function plus one parameter. Counting the health window explained why a default flip matters even at three records: the field is a rolling window and today it can only ever be a debug session's length.
- What did not work and why: iteration 3 rated change 3 at zero risk because it costs zero bytes. Bytes are not the only risk; a strict schema is a contract, and the rating was wrong in kind.
- What I would do differently: check `.strict()` on any schema before rating a field addition, because that single modifier decides whether an addition is additive.

## Recommended Next Focus

The per-runtime half of the cost question: what the brief costs on the plugin-shaped runtimes, and whether a health record has any path there.
