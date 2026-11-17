# Iteration 005 - correctness replay

## Dimension

Correctness, replay: re-run both P1 reproductions line by line and sweep the two boundaries, so each active finding stays grounded in observed behavior rather than stale prose. Recovery granularity: line level.

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

Operator review focus: pass fourteen, area `mention`. The replay stayed inside the two scope files and honored the holdout rule.

Recovery note: the iteration-4 stop decision was again `STUCK_RECOVERY` (stuckCount 3). This replay follows the recovery strategy's protocol replay step and keeps the P1s active.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:403-482`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:200-218`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-brief-14.txt:1-10`

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. `R1-P1-001` and `R1-P1-002` remain active and reproduce.

### P2 Findings

None new. `R1-P2-001` remains active.

## Traceability Checks

Not re-run; iteration 3's `spec_code` and `checklist_evidence` results stand.

## Integration Evidence

- `R1-P1-001` replay: `commandOnlyMentioned('/create:readme keeps failing, never run it again', '/create:readme')` returns `false`; `attachCommand('sk-doc', SINGLE('sk-create-readme'), prompt)` returns `/create:readme`. Same for `anymore`, `because it is broken`, `until it is fixed`, `today`, `ever again`.
- `R1-P1-002` replay: `commandOnlyMentioned('read the /deep:review docs, then tell me what it does', '/deep:review')` returns `false`; `attachCommand('system-deep-loop', SINGLE('review'), prompt)` returns `/deep:review`. Same for `then summarize it`, `then check the changelog`, `then run the test suite`.
- Boundary sweep of the allowed trailing words: `yet`, `now`, `for now`, `at all`, `please` all keep the mention reading, which matches the change's stated allowlist. `twice` reads as a request, which is the intended pass-thirteen trade-off.
- Boundary sweep of `then`: only `then do a thorough review of this diff` and `then run it` are genuine requests; every other probed `then` clause is read as a request although it asks for something else.

## Edge Cases

- `do not run it today` reads as a request. That is a time limit rather than a refusal, so it is consistent with the change's limit/refusal distinction; it is not counted as part of `R1-P1-001`.
- `do not run it twice` reads as a request, the intended behavior. It stays out of the finding.
- A refusal ending in `ever again` fails for the same anchor reason as `again`; folded into `R1-P1-001`, not raised separately.
- A `then` clause that names the command again (`then run it`) is a request through the pronoun rule as well as the `then` guard; the guard is not what decides it.
- No prompt was found in these two rules where a request reads as a mention beyond the intended limits, so the opposite direction stays clean.

## Confirmed-Clean Surfaces

- The five-word allowlist behaves exactly as written: all five keep a mention.
- The two P1 prompts still return the wrong reading on the current tree (working tree matches `e626653ce79`), so neither finding is stale.
- The consumer still offers the command for each failing prompt, so both findings have a reachable effect.

## Ruled Out

- Downgrading `R1-P1-001` because `again` can imply a previous run: the probe uses `keeps failing` and `is broken`, where the clause refuses a further run and the prompt contains no request.
- Downgrading `R1-P1-002` because `then` often introduces work: five of six probed `then` clauses ask for a read or a different task, so the word alone is not a request marker.
- A new finding for `today`: it is a limit, not a refusal, and the change's own comment names limits as requests.

## Next Focus

- Dimension: correctness (consumer cross-reference)
- Focus area: `typedCommandForTop`, `attachCommand` and `routeNeedsMode`, plus the generated `MODE_COMMANDS`/`COMMAND_ROWS`/`TRACKED_COMMANDS` consistency for the two commands in the probes.
- Reason: the replay confirmed the guard; the next pass asks whether a consumer could still deliver the wrong command through a different path or a table mismatch.
- Rotation status: four dimensions covered; consumer cross-reference next.
- Blocked/productive carry-forward: the traceability gate stays closed; expect another recovery or continue decision, not STOP.
- Required evidence: consumer return values for a mention and a request prompt, and own-key/table agreement for `/deep:review` and `/create:readme`.

## Verdict

No new finding; both P1s and the P2 remain active and reproduce.

Review verdict: CONDITIONAL
