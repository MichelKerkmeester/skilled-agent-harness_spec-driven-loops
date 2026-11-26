# Iteration 006 — Security (second pass): real-browser attach scenarios against R-SEC-1

## Dispatcher
- Lineage opus-2, iteration 6 (5 prior iteration rows). steer.md absent. Convergence after iteration 5: CONTINUE (noStopCandidate; rolling average 0.1325 above its stop line).

## Dimension
security

## Review Focus Coverage
Phase 008's goal added the Bladebro attach-mode scenario (BB-015) and ran it live; phase 004's R-SEC-1 is the rule it must honour. This pass read BB-011, BB-012 and BB-015 against R-SEC-1 (operator selects profile, attach for a caller-owned browser, redaction) and against the macOS constraint 001-research recorded.

## Files Reviewed
- `.skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/real-browser/attach-mode-reads.md:15-72`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/real-browser/lane-on-clone.md:19-27`, `real-mode-reads.md:47,67`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md:75,84,112`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/references/browser-lanes.md:59`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/mcp-servers/bladebro-mcp/README.md:35,57`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-21--attach-probe--aside-browser/README.md:20`, `feature-catalog/real-browser/attach-mode.md:30`
- `specs/.../001-research/research/research.md:138`

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **BB-015 starts "<browser app>" with a debug port on its live profile, which branded Chrome 136+ refuses, and its triage blames the wrong cause** -- .skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/real-browser/attach-mode-reads.md:45 -- Step 1 is `open -a <browser app> --args --remote-debugging-port=9333` on the browser's normal profile, and Failure Triage item 1 says a closed port "means the browser was still running". research.md:138 records that branded Chrome 136+ refuses remote debugging on its default data directory, and SKILL.md:84 and browser-lanes.md:59 carry that rule for `profile` mode only. Both recorded BB-015 passes attached to the Aside browser (attach-probe README.md:20, attach-mode.md:30). An operator who picks Google Chrome gets a port that never opens and a triage step that sends them to restart it again.
   Finding class: scenario precondition gap.
   Scope proof: attach-mode-reads.md:45 and :68; research.md:138; recorded runs used Aside only.
   Affected surface hints: BB-015 commands and triage, feature-catalog real-browser/attach-mode.md, references/browser-lanes.md attach row.
   Case: the operator picks Google Chrome 156 for BB-015; step 2's curl gets no answer however often step 1 is repeated, and the scenario records FAIL against the wrong cause.

## Traceability Checks
- playbook_capability (partial): BB-015 matches 008's goal (scenario exists, recorded PASS) and R-SEC-1 (operator confirms browser, site and restart at :30; read-only; redaction rule at :58; port closed at :50 and triage :70). Its browser precondition omits the Chrome 136+ limit (finding 1).
- spec_code (pass): mcp-servers/bladebro-mcp/README.md:35 and :57 keep the manual's `env` empty and make a second isolated manual an operator-approved change, as R-SEC-1/R-SEC-3 require.

## Integration Evidence
- `.utcp_config.json` bladebro manual (`bladebro mcp`, env {}) matches mcp-servers/bladebro-mcp/README.md:35.

## Edge Cases
- BB-015 triage item 3 notes that any local process can drive the signed-in browser while port 9333 is open; the scenario closes the port at step 6. Adequate for an operator-run scenario.

## Confirmed-Clean Surfaces
- Owned agent-browser profile is the default lane (SKILL.md:75); clone mode never writes the source profile (lane-on-clone.md:19).
- Evidence redaction in BB-015 keeps only exit status, `ok` and two booleans.

## Ruled Out
- Real-browser scenarios running without operator selection: manual-testing-playbook.md:37 gates BB-010..012 and BB-015 on the operator picking browser and profile.

## Next Focus
- Dimension: traceability (final pass)
- Focus area: cross-check the five findings from iterations 3-6 against any phase that already records them as known, and close checklist_evidence.
- Reason: last allowed iteration; confirm nothing raised here is already dispositioned.
- Required evidence: phase decision-record or known-limitations lines.

Review verdict: PASS
