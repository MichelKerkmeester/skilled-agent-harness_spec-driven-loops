# Review Iteration 006 — fixes-11

**Lineage:** `fixes-11` (detached fan-out, review pass eleven)
**Artifact dir:** `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/fixes-11`
**Session:** `fanout-fixes-11-1794851543294-mlt3r6`

## Dispatcher

- **Operator review focus (bound):** review pass eleven, area `fixes`, per `review/review-brief-11.txt`. This iteration is a verification replay of the focus: it re-ran the two reachable evasions, re-read the seven active findings, and confirmed the reviewed bytes have not changed since iteration 5.
- **Dimension this iteration:** correctness (verification replay).
- **Dimensions planned:** all four covered; this pass re-checks the two P1 findings.
- **Steer file:** absent at iteration start.

## Files Reviewed

| File | Under |
|------|-------|
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | correctness |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` | correctness |
| `.skilled/commands/doctor/assets/doctor-install-presentation.txt` | correctness |
| `.skilled/commands/doctor/assets/doctor-install.yaml` | correctness |
| `.skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs` | correctness |

## Findings - New

### P0 Findings

None.

### P1 Findings

None new; `FIX11-P1-001` and `FIX11-P1-002` remain active and reproduce.

### P2 Findings

None new.

## Traceability Checks

No new protocol was run; this pass is a replay of the evidence already recorded, and the audit trail is the same registry and delta rows from iterations 1-5.

## Verification Replay

| Probe | Result | Reading |
|-------|--------|---------|
| `commandOnlyMentioned("do not run '/create:agent' or '/create:readme', just explain them", "/create:readme")` | `false` | The quoted or-list refusal is still not read (`FIX11-P1-001`). |
| `attachCommand("sk-doc", {single target sk-create-readme}, same prompt)` | `/create:readme` | The refused command is still offered. |
| `typedCommandForTop("sk-doc", "do not run /create:skill yet, just explain")` | `{"command":"/create:sk-skill","policy":"start","ownerSkillId":"sk-doc"}` | The retired-name refusal is still bypassed (`FIX11-P1-002`). |
| `attachCommand("sk-doc", {single target sk-create-skill}, same prompt)` | `/create:sk-skill` | The successor is still offered on the refusal. |
| `commandOnlyMentioned("do not run /create:readme yet", "/create:readme")` | `true` | Control: the canonical quoted refusal is read. |
| `commandOnlyMentioned("do not run /create:sk-skill yet", "/create:sk-skill")` | `true` | Control: the canonical successor name is read. |

The controls isolate both failures to the mapped or quoted name rather than to the guard's lead grammar.

## Integration Evidence

- Both probes ran against `.skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/command-attach.js`, the build the shipped advisor loads, not a hand copy.
- `git status --short` shows no reviewed file modified during the review (`command-attach.ts`, the guards test, the doctor presentation, the doctor workflow and the contract test are all clean); the only tracked modification is the shared observability log.
- The registry still holds two P1 and five P2 findings with no transitions; no finding was resolved, merged or downgraded since iteration 4.

## Edge Cases

- **Convergence signal vs active P1s.** The convergence script's rolling signal is a novelty measure, not a resolution measure: it can stop the loop while P1 findings remain active. The verdict stays CONDITIONAL for that reason, and the synthesis report records the open findings rather than a pass.
- **Replay vs new review.** This pass adds no new direction; a further iteration would repeat the same probes, so the loop terminates on the stop decision rather than on exhaustion of ideas.

## Confirmed-Clean Surfaces

- The two administration controls above hold: canonical quoted refusals and canonical retired-name refusals are read correctly.
- No reviewed file was modified; the review remained observation-only.
- No holdout prompt text was read or printed; no prompt corpus file was opened in this pass.
- All four dimensions and all five scope paths remain covered; the registry and narrative counts agree.

## Ruled Out

- **A regression introduced between iterations 5 and 6** — the reviewed bytes are unchanged and both probes reproduce identically.
- **A guard failure on the canonical names** — both canonical controls return `true`; the failures are specific to the quoted or-list and the retired alias.
- **A missing finding in the registry** — seven active findings, matching iterations 1-4 and the deltas.

## Next Focus

- **Dimension:** none; the loop is at its stop decision.
- **Focus area:** synthesis and remediation planning for the two P1 and five P2 findings.
- **Reason:** the stop decision is the loop's terminal signal; a further iteration would repeat the replay.
- **Rotation status:** complete.
- **Blocked/productive carry-forward:** no approach is blocked; the productive approaches are recorded in the strategy.
- **Required evidence:** the stop decision from `convergence.cjs` and the registry counts.

**Stop decision after iteration 5:** CONTINUE; `stopReason` none; `blockedBy` empty; the rolling signal sat at 0.100 with the noise floor already stopped, so one zero-novelty pass was still required.

Review verdict: CONDITIONAL
