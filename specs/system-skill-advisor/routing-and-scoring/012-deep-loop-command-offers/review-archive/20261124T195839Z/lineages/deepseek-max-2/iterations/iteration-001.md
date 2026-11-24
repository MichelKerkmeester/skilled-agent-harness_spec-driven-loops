# Review Iteration 001

## Dispatcher

- Mode: review, target agent `deep-review`, single review iteration, lineage `deepseek-max-2`.
- Review target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder).
- Operator focus carried into this iteration: traceability, starting with the gate that implements the loop-ask requirements.
- Dimension: correctness.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1132` (`asksForLoopRun`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1102` (`namesLoopSubject`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1537` (`attachCommand`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1648` (`routedLoopMode`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1475` (`commandOnlyMentioned`)
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:129` (347 shared cases)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/results-after.json:1` (69 rows)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/results-spec-baseline.json:1`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:220` (REQ-001 to REQ-004)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:58` (AC-001 to AC-005)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

- `spec_code` (core, partial this pass): REQ-001, REQ-002, REQ-003 and REQ-004 were read against the gate and against the recorded probe run. The five gain rows in `scratch/probes/results-after.json` read `system-deep-loop` with `/deep:review` on V6, H1a and E3 and `/deep:research` on H1b and E1 [SOURCE: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/results-after.json:1]. None of the thirteen no-gain rows carries a `/deep:*` command in any of its three rows, and V5 still tops `sk-code` on `sk-code-review`. All seventeen keep rows match `results-spec-baseline.json` on command and `pol=ask`, and all seventeen negative rows match it on top skill and `cmd=`. The gate that produces those rows is `asksForLoopRun` gated inside `attachCommand` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1616].
- The shared fixture holds 347 cases, and the rows this pass sampled (`refusal-verb-skip`, `run-refused-stuck-dont-run`, `typed-stuck`, `plural-deep-reviews-use-verb`, `plural-deep-loops-served`, `how-do-run-deep-review`, `effort-loop-too-slow`, `no-edit-review-dont-change-anything`, `stuck-rerun-pronoun-it-again`, `bare-loop-name`) carry the columns their acceptance rows read [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:1].
- `checklist_evidence` was not run this pass; the acceptance-row evidence audit is scheduled for the traceability iterations.

## Integration Evidence

The gate is reached through `attachCommand`, the single reader of the deep-loop offer, and the probe run records the served head for all 69 rows. No integration surface outside the declared target was modified.

## Edge Cases

- A probe row whose top recommendation is `null` (N12, H4, H3b) is compared as "no skill", not as a missing row; all three match the baseline block or the drift requirement.
- The probe results file carries keys `exit`, `freshness`, `top`, `second`, `third`; a reader expecting a `recommendations` array would read the file as empty, so the iteration compares the actual key shape rather than the prose shorthand.

## Confirmed-Clean Surfaces

- Probe rerun: 69 of 69 rows read `exit 0 live`.
- Keep group: 17 of 17 rows keep the baseline command and `pol=ask`.
- Negative group: 17 of 17 rows keep the baseline top skill and `cmd=` value.
- No-gain group: 13 of 13 rows carry no `/deep:*` command in three rows each.
- Gate path: `attachCommand` withholds the deep offer unless `asksForLoopRun` holds or the prompt types the served command [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1615].

## Ruled Out

- "The gain rows still print `cmd=-`": ruled out by the recorded run, where V6, H1a, H1b, E1 and E3 each carry their deep command.
- "The no-gain group gained a command": ruled out by a three-row scan over all thirteen ids.
- "The keep group drifted on policy": ruled out by the command-and-policy comparison against `results-spec-baseline.json`.
- "The shared fixture holds a different count than the closure docs claim": ruled out; 347 cases, the count AC-028 and AC-055 record.

## Next Focus

- Dimension: traceability.
- Focus area: `spec_code` over REQ-001 to REQ-022, each requirement against the code or decision it names.
- Reason: the correctness pass found the gate and the probe evidence in agreement; the operator focus now needs the requirement-by-requirement audit.
- Required evidence: a named symbol, fixture row or probe row per requirement, or an ADR that records the decision.

Review verdict: PASS
