# Review Iteration 005

## Dispatcher

- Mode: review, lineage `data-14`, iteration 5 of 8.
- Declared target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder).
- Area: `data`; scope files are the advisor graph metadata and ADR-001 in the 040 decision record.
- Dimensions this iteration: correctness and maintainability, the recovery target and the record surface.
- Operator review focus binding: `review-brief-14.txt` asks whether any remaining advisor intent signal pulls an ordinary prompt to the advisor, and whether ADR-001 stays consistent. The recovery is a different granularity of the same question: instead of four hand-picked prompts, one ordinary-sense prompt per generic remaining signal.
- Recovery cause: iteration 4's stop decision was `STUCK_RECOVERY` (`stuckThresholdReached`) after two zero-novelty passes. The recovery event is recorded in the ledger; this pass changes the approach rather than repeating the same replay.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/graph-metadata.json:66-100` (each remaining signal checked against an ordinary-sense prompt)
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/decision-record.md:37` (ADR-001, re-read for the record boundary)
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/scratch/probes.json` (P05/P07/P08/P09 rows)
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/data-14/deep-review-findings-registry.json` (reduced state)

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. F001 stays active with its four cases: `route request to the backend service`, `which skill should I learn next as a developer`, `measure the workflow throughput`, `not offering a skill in the job listing`.

The per-signal sweep tested a wider prompt set, and the extra prompts are inside the advisor's stated contract, so they do not extend F001:
- `which skill should i use for this task` is a skill-selection request, which is exactly the advisor's declared job.
- `my command transcripts are huge`, `the scorer fusion layer is slow`, `this lane fusion change needs a test`, `the local fallback scorer returns nothing`, `check the prompt hook health endpoint` and `index private skills from the vendor folder` name the advisor's own measurement, scorer, hook and private-index surfaces; routing them to the advisor is expected.
- `the gate 2 review of the bridge failed` returns `sk-code` (0.9076), not the advisor.
- `show me how to add a private repository`, `measure the workflow latency in production` and `the routing confidence is low on this model` return no skill.
- `route my request through the proxy` (0.8621) and `write a prompt-time brief for the team` (0.8734) are the same generic-signal class as F001 but are ambiguous enough that they are recorded as additional cases for that finding rather than a new one. They do not change its severity.

### P2 Findings

None new. F002 stays open: ADR-001 does not carry the residual leak.

## Traceability Checks

- `spec_code` -- pass, re-verified in the recovery pass. P05/P07/P08/P09 outcomes still match ADR-001 and the probe rows.
- `checklist_evidence` -- pass. The checklist rows and the registry agree; F001 and F002 are recorded separately as the active findings.

## Integration Evidence

- Recovery scope: the sweep covered every remaining generic signal in `graph-metadata.json:66-100`. The two additional ambiguous cases (`route my request through the proxy`, `write a prompt-time brief for the team`) reproduce through `author:route my request` and `author:prompt-time brief`, the same single-signal mechanism as F001.
- The four F001 cases and the five pass-thirteen prompts reproduce unchanged.
- No state disagreement: the registry holds F001 and F002, and this iteration adds no finding row.

## Edge Cases

- The recovery sweep found in-domain prompts the advisor should answer. Treating them as leaks would overstate F001 and would recommend narrowing signals the advisor needs; they are recorded as within-contract examples instead.
- `route my request through the proxy` and `write a prompt-time brief for the team` sit on the boundary. They are listed with F001's cases so a later fix can decide whether to narrow `route my request` and `prompt-time brief` too; they are not counted as a new finding.

## Confirmed-Clean Surfaces

- No signal outside the four F001 cases produces a clearly out-of-contract top-1 in the sweep.
- Both scope files are unchanged; ADR-001 and the probe rows still agree.

## Ruled Out

- A broader leak than F001 among the remaining signals: the wider sweep produced only in-domain or ambiguous results beyond the four established cases.
- A new documentation or test-surface defect beyond F002: the ADR and test gap is unchanged from iteration 2.

## Next Focus

- Dimension: none remaining; convergence check.
- Focus area: retake the stop decision with the recovery reset in place; if it stops, synthesize with F001 as the active P1 and F002 as the P2 advisory.
- Reason: all four dimensions are covered, both core protocols pass, and the recovery pass found no new finding.
- Rotation status: complete.
- Blocked/productive carry-forward: F001 and F002 stay open; no new direction remains.
- Required evidence: the convergence decision and, if STOP, the synthesis report.

Review verdict: CONDITIONAL
