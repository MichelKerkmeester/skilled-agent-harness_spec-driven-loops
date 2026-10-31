<!-- dispatch: opencode NC-004; ledger: 2026-09-27T14:04:06Z 2026-09-27T14:10:31Z 0 385 -->

STEP 0 — Advisor line from runtime context:

`Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.`

Now reading the scenario file.
Scenario read. Running TEST EXECUTION step 1 (vitest) and step 2 (advisor_recommend) as written.
Both commands ran. Step 3 is inspection of `data.ambiguous`. To cover the absorbed legacy row's command sequence as well (save + compare), running that variant and saving to `/tmp`:
The legacy-row variant returned live results with `ambiguous: true`. The step-2 broad-prompt call returned fail-open empty earlier — re-running the exact step-2 command to characterize whether that was transient:
REVIEWED — scenario NC-004 executed. Evidence record follows.

```
RESULT: PASS | scenario=NC-004 | runtime=opencode
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---|---|---|---|
| 1 | vitest run tests/handlers/advisor-recommend.vitest.ts tests/legacy/advisor-renderer.vitest.ts | 0 | RUN v4.1.11; ✓ advisor-recommend (22 tests); ✓ advisor-renderer (13 tests); Test Files 2 passed; Tests 35 passed | Tests pass | Yes |
| 2a | advisor_recommend --prompt "review opencode docs and improve the prompt package" --options {topK:2,includeAttribution:true} (first run) | 0 | status "ok", recommendations: [], ambiguous: false, freshness "unavailable", trustState.reason "advisor_unavailable", warnings ["advisor_unavailable","ENOENT ... scandir"], abstainReasons fail-open | Broad prompt places two skills close together; envelope ok; plausible top-two | No — transient fail-open, zero candidates (see NOTES) |
| 2b | same command, immediate rerun | 0 | status "ok", freshness "live"; sk-code score 0.871803/conf 0.95; sk-prompt score 0.800087/conf 0.95; ambiguous: true | Close top-two → ambiguous rendering | Yes |
| 3 | inspect data.ambiguous (2b) | — | score gap 0.0717 (>0.05, outside); confidence gap 0.0 (≤0.05, inside) → ambiguous: true | ambiguous: true when second passing candidate within 0.05 on score OR confidence gap; only outside both margins is unambiguous | Yes |
| L1 | legacy row: advisor_recommend legacy prompt w/ includeAbstainReasons → save /tmp/skill-advisor-playbook/sad-002.json | 0 | status "ok", freshness "live"; sk-code 0.876948/0.95; sk-prompt 0.754285/0.9254; ambiguous: true; saved+compared | Envelope ok; top recommendations plausible; close top-two set ambiguous: true | Yes |
| L2 | legacy prompt confidence-gap check | — | score gap 0.1227 (outside); confidence gap 0.0246 (≤0.05, inside) → ambiguous: true | close top-two → ambiguous: true | Yes |
| L3 | lane-attribution prompt-safety (all live outputs) | — | lane fields hold lane ids, weights, evidenceTypes (token_match/category_hint/scorer_signal/derived_skill_signal/workflow_signal); no prompt literal anywhere | Lane attribution remains prompt-safe | Yes |
DEVIATIONS: (a) Step 2 required one extra invocation (2a→2b) because the first run returned fail-open empty; both invocations are reported. (b) Ran the absorbed SAD-002 legacy command sequence in addition to the two commands named in TEST EXECUTION, per its Exact Command Sequence, saving JSON to the scenario-named /tmp/skill-advisor-playbook/sad-002.json (outside the repo; retained there for review rather than in a mktemp dir per its explicit path). (c) "Rendered brief does not overstate certainty" was verified indirectly — CLI JSON exposes the ambiguity flag and fail-open never fabricates certainty; brief rendering itself is covered by tests/legacy/advisor-renderer.vitest.ts (13 tests pass).
NOTES: Flaky first invocation of step 2 — advisor_cli returned trustState "advisor_unavailable" with warning "ENOENT ... scandir" and fail-open empty recommendations, while the runtime's Advisor: line reported live; an immediate identical rerun and the legacy-prompt call were both freshness "live" (generation 530). No scenario failure mode occurred: ambiguous was not missing for close top two (it was true whenever the ≤0.05 condition held on either axis), the brief/flag did not overstate certainty, and no prompt text leaked into lane fields. The ambiguity threshold logic was genuinely exercised twice (confidence gaps 0.0 and 0.0246 → ambiguous: true). Environment note: vitest ran v4.1.11 vs v4.1.6 in the recorded evidence row; test counts match (22+13=35). No repository files written; no daemon/db touched; nothing written in the repo (no evidence directory was named by the task).
```
