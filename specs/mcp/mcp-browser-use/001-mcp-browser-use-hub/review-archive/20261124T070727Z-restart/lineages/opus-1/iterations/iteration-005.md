# Iteration 005 - Correctness (second pass): two-stage routing and recorded playbook runs

## Dispatcher
- Lineage opus-1, iteration 5, dimension correctness (second pass after all four were covered). steer.md: not present.
- Review focus: re-ran the routing goal criteria (parent criterion 5 stage two, 005 compiled-route criterion, 013's own-Chrome routing claim, prior C2-I1-P1-001 403 fix) and 008 criterion 1 (results.csv tallies vs README).

## Files Reviewed
- .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs:109-110
- .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/fixtures/canary-cases.v1.json (15 cases)
- .skilled/bin/compiled-route.cjs (no file writes: 0 writeFileSync/appendFileSync)
- .skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/2026-11-21--two-stage-replay--compiled/results.csv
- .skilled/skills/mcp-browser-use/mcp-aside-devtools/benchmark/reports/2026-11-22--manual-testing-playbook--{signed-in-live,rewritten-forms-rerun,probe-guard-fix}/results.csv + README.md
- .skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-22--manual-testing-playbook--clickup-real-browser/results.csv + README.md

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None new. O1-I1-P1-001 remains active (not re-checked as fixed; the tree is unchanged).

### P2 Findings
None new.

## Traceability Checks
- spec_code: partial (carried; O1-I1-P1-001 still active). Stage-two replay this iteration: "debug the 403 Forbidden network requests in chrome devtools" -> route single mcp-chrome-devtools (prior P1 fix holds; canary `chrome-devtools-http-403-forbidden` present); "attach to my own Chrome and inspect the signed-in dashboard" -> mcp-chrome-devtools; "use bladebro to scrape the page with stealth" -> mcp-bladebro; "open my signed-in browser with aside and capture the tab" -> mcp-aside-devtools. router.cjs:109 rejects only on the `forbidden` constraint.
- playbook_capability: pass. Bladebro clickup-real-browser 5 rows, 4 PASS 1 FAIL; Aside signed-in-live 15 rows, 10 PASS 5 FAIL (both match 008 criterion 1 and their README tallies); Aside rewritten-forms-rerun 8 PASS 2 FAIL and probe-guard-fix 2 PASS match their READMEs; two-stage replay 6 of 6.

## Integration Evidence
- `node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt ...` x4 (read-only; git status unchanged).

## Edge Cases
- Stage one (advisor) was not replayed: the advisor CLI may start a daemon that writes outside the lineage. Recorded as not re-run.
- 013 edited four Aside playbook scenarios (help-fixture, screenshot-pdf-capture, unbound-profile-error, repl-screenshot-artifact) after the 2026-11-22 recorded runs, so those runs exercised the earlier wording. 006's criterion (a run dated after 005) still holds; noted, not a finding.

## Confirmed-Clean Surfaces
- Compiled hub router for all three modes and the 403 negative-word case; recorded run tallies.

## Ruled Out
- Regression of prior C2-I1-P1-001 (403 Forbidden reject): fixed and canaried.
- results.csv vs README tally drift for 008's two live runs: tallies match.

## Next Focus
- Dimension: traceability (overlay pass). Focus: agent_cross_runtime and feature_catalog_code: runtime mirrors that name the hub, chrome-devtools catalog count 31 (005/013 D3), 010 pointers and 012 doc-alignment topic wiring. Required evidence: file:line.

Review verdict: CONDITIONAL
