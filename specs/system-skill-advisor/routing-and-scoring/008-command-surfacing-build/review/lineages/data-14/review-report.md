# Review Report: Command Surfacing Build, Pass Fourteen - data area

- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder)
- Pass: the fourteenth review pass, `data` area of `review/review-scope-14.txt`. It diffed `932aff4e437..e626653ce79` for `.skilled/skills/system-skill-advisor/graph-metadata.json` and `040-final-alignment-loop/decision-record.md`, then read each whole file at `e626653ce79`.
- Lineage: `data-14`, session `fanout-data-14-1794868189353-tsxtos`, five iterations, stop reason `converged` at threshold 0.10, one stuck-recovery pass, `blockedBy` empty. Brief `review/review-brief-14.txt`.

## 1. Executive Summary

- **Overall verdict: CONDITIONAL.** P0 0, P1 1, P2 1 -- the counts the verdict used.
- **hasAdvisories: false.** One P2 advisory is open, but the verdict is CONDITIONAL on the active P1, so the advisory flag is not set.
- **Operator review focus:** Review pass fourteen. First read `review/review-brief-14.txt` and follow it: it names the area by lineage label, the scope file, the graph and stop steps each iteration runs, and the holdout rule.
- **What the change did.** Six of the seven pass-thirteen intent signals were removed; only `vibe prompt hook` remains from that set. ADR-001 now waives AC-004 for P05, P08 and P09 and keeps their routes, and fixes P07 with `vibe prompt hook` alone.
- **What the review found.** The removal is correct and reproduces: the five prompts pass thirteen checked no longer top the advisor, and P05/P07/P08/P09 match ADR-001. It is not complete as a leak fix: four ordinary prompts still top the advisor through older generic signals, and ADR-001 does not record that residual.
- **Stop and recovery.** Iterations 1-2 covered all four dimensions. Iteration 3's stop was blocked because `checklist_evidence` was left `partial`; iteration 4 closed it but hit the two-pass stuck threshold. A recorded recovery pass swept one ordinary-sense prompt per remaining signal, found no new out-of-contract case, and the stop then converged.
- **Self-check outcomes.** F001 (P1) was confirmed by the full Hunter/Skeptic/Referee pass in iteration 1: each of the four prompts loses the advisor top-1 when only its matching signal is dropped. F002 (P2) was confirmed by reading ADR-001 beside the transcript it cites. No finding was downgraded or called a false positive.

## 2. Planning Trigger

`/speckit:plan` is required: the verdict is CONDITIONAL on one active P1.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": ["F001", "F002"],
  "remediationWorkstreams": [
    {
      "id": "WS-1",
      "findingIds": ["F001"],
      "severity": "P1",
      "title": "Stop generic remaining intent signals from routing ordinary prompts",
      "scope": "advisor intent_signals scoring surface: narrow which skill, route request, not offering a skill and workflow measure to advisor-specific compounds, or exclude their single tokens from the lexical lane; pin the four ordinary prompts as fixtures"
    },
    {
      "id": "WS-2",
      "findingIds": ["F002"],
      "severity": "P2",
      "title": "Record the residual leak in the decision record and pin it",
      "scope": "ADR-001 residual row or sentence plus a real-signal ordinary-sense fixture in the specificity test"
    }
  ],
  "specSeed": [
    "State that an advisor intent signal must name advisor behaviour, not a word that appears in ordinary backend, career, HR or ops text.",
    "State that a leak check must cover every remaining generic signal, not only the phrases the current change added.",
    "State that a declined probe whose words were removed for leaking must be rechecked against the remaining surface."
  ],
  "planSeed": [
    "Narrow which skill, route request, not offering a skill and workflow measure to advisor-specific compounds, and add the four ordinary prompts as negative fixtures.",
    "Add one ADR-001 row naming the residual generic signals and the reproducing prompts, and extend the specificity test with real-signal ordinary-sense cases."
  ],
  "findingClasses": ["algorithmic", "matrix/evidence"],
  "affectedSurfacesSeed": [
    ".skilled/skills/system-skill-advisor/graph-metadata.json",
    ".skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts",
    ".skilled/skills/system-skill-advisor/runtime/tests/scorer/declared-phrase-specificity.vitest.ts",
    "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/decision-record.md"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

| ID | Severity | Dimension | Location | Finding | Fix recommendation | Finding class | Scope proof | Affected surface hints |
|----|----------|-----------|----------|---------|--------------------|---------------|-------------|------------------------|
| F001 | P1 | correctness | `.skilled/skills/system-skill-advisor/graph-metadata.json:70` | Four ordinary prompts top the advisor through pre-existing generic intent signals | Narrow which skill, route request, not offering a skill and workflow measure to advisor compounds, or exclude their single tokens; pin the four prompts | algorithmic | Each prompt returns `system-skill-advisor` 0.82 with the committed projection and loses the top-1 when only its matching signal is dropped; measure then returns `sk-design` | graph metadata, lexical lane, specificity test, after-pass-13 transcript |
| F002 | P2 | maintainability | `040-final-alignment-loop/decision-record.md:37` | ADR-001 records the pass-thirteen fix but not the residual leak it leaves open | Add a residual row naming the remaining generic signals and the four prompts, and pin them as fixtures | matrix/evidence | Read ADR-001 and the five-prompt transcript it cites; the test file pins fixture phrases only, so the residual is unpinned | decision record, tasks evidence, specificity test |

Impact notes:

- F001 changes the top recommendation for ordinary text: `route request to the backend service`, `which skill should I learn next as a developer`, `measure the workflow throughput` and `not offering a skill in the job listing` all lead with the advisor. No command is attached and no mutating command is offered.
- The four prompts pre-date the pass-thirteen change. F001 is a residual of the older surface, not a regression introduced by this diff.

## 4. Remediation Workstreams

- **WS-1 (F001).** Treat the four generic signals as phrases only, or remove their single tokens from the lexical and derived lanes. Add the four prompts as ordinary-sense fixtures so the next phrase addition cannot silently regress. This is the same class pass thirteen fixed for the newly added phrases.
- **WS-2 (F002).** Record the residual in ADR-001 and extend the specificity test with real-signal ordinary-sense cases. The existing test builds a fixture projection and never reads the shipped signal list.
- No code change is made in this review. Both workstreams are planning seeds.

## 5. Spec Seed

- An advisor intent signal names advisor behaviour, not a word that appears in ordinary backend, career, HR or ops text.
- A leak check must cover every remaining generic signal, not only the phrases the current change added.
- A declined probe whose words were removed for leaking must be rechecked against the remaining surface.

## 6. Plan Seed

- Narrow the four generic signals to advisor-specific compounds and add the four ordinary prompts as negative fixtures.
- Add one ADR-001 row naming the residual signals and prompts, and extend the specificity test with real-signal ordinary-sense cases.

## 7. Traceability Status

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 5 | P05 returns `command-doctor-helper` with `/doctor:skill-advisor rebuild` first; P07 advisor; P08 `sk-doc`; P09 none; ADR-001 and the probe rows agree |
| `checklist_evidence` | core | pass | 5 | AC-004, T006 and T008 carry evidence; F001 and F002 are the separately recorded residuals |
| `skill_agent` | overlay | pass | 3 | Author metadata and the committed projection carry the same 33 canonical signals |
| `agent_cross_runtime` | overlay | notApplicable | 1 | No agent file or runtime-specific surface in this area |
| `feature_catalog_code` | overlay | notApplicable | 2 | No feature catalog row changes in this area |
| `playbook_capability` | overlay | notApplicable | 2 | No manual-testing playbook source in this area |

Acceptance coverage: `AC_COVERAGE` is advisory only. AC-004 is waived by ADR-001 for P05, P08 and P09; AC-005 remains unmet pending this pass and the full alignment run. The advisory does not change the verdict.

## 8. Deferred Items

- F002 is advisory and can land with the F001 fix.
- The two ambiguous sweep cases, `route my request through the proxy` and `write a prompt-time brief for the team`, are recorded with F001's case set rather than as a separate finding. A later fix should decide whether `route my request` and `prompt-time brief` also need narrowing.
- T006's evidence cell records the earlier seven-phrase build. It is historical and superseded by T008 and ADR-001; no edit is requested here.

## Dimension Expansion Map

| Dimension | Iterations | Coverage |
|-----------|------------|----------|
| correctness | 1, 3, 4, 5 | complete |
| security | 2, 3, 4 | complete |
| traceability | 1, 3, 4, 5 | complete |
| maintainability | 2, 3, 4, 5 | complete |

## 9. Search Ledger

- Ordinary-sense sweep, correctness: four out-of-contract prompts found (`route request to the backend service`, `which skill should I learn next as a developer`, `measure the workflow throughput`, `not offering a skill in the job listing`), each proven by a single-signal drop test. Result: F001.
- Wider recovery sweep, correctness: thirteen further prompts tested; in-domain prompts (skill selection, scorer fusion, command transcripts, prompt hook health, private skills indexing, fallback scorer) route to the advisor by contract; ambiguous prompts (`route my request through the proxy`, `write a prompt-time brief for the team`) are added to F001's case set. No new finding.
- Pass-thirteen transcript replay: five prompts reproduce the recorded outcomes; four return no skill and one returns `system-spec-kit`.
- ADR and probe replay: P05 helper ranking, P07 pass, P08 `sk-doc`, P09 no skill. All match ADR-001.
- Holdout hygiene: both scope files and the cited transcript were checked for corpus references; none names `command-prompts.jsonl`, `holdout-prompts.jsonl` or `behaviour-fresh-prompts.jsonl`. No holdout row was read.
- Security pass: both files are static author text and markdown; 33 signals are unique, ASCII-only and metacharacter-free; no secret, host, credential or executable path.

## 10. Audit Appendix

- Iterations: 5. Iteration records were recorded through `append-mode-event.cjs`; the reducer refreshed the registry, dashboard and strategy after each.
- Convergence: stop reason `converged`, `composite_converged`, all nine legal-stop gates pass, `blockedBy` empty. One `stuckRecovery` was recorded after iteration 4 and the recovery pass was iteration 5.
- Verdict source: the findings registry (one P1, one P2). The iteration final lines are the leaf self-report; this report and the registry agree.
- Writes: confined to `review/lineages/data-14`. Review targets were read-only.
- Completion line: `FANOUT_LINEAGE_COMPLETE:data-14`.
