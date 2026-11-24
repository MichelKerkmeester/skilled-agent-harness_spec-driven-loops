# Deep Review Report — mcp-browser-use hub epic (fan-out lineage opus-2)

## 1. Executive Summary

- **Overall verdict: FAIL** (from `review-verdict.cjs` over this lineage's registry and state log). No active P0 or P1 exists. The FAIL comes only from two failed required terminal gates, `scope` and `coverage` (recorded in `deep_review.terminal_gates_recorded`, run 7). The finding content alone would give PASS with advisories.
  - `coverage` failed with `traceability-incomplete`. The two hard core protocols, `spec_code` and `checklist_evidence`, ended `partial` because the review found real drift (findings O2-I3-*). This is a true result, not missing bookkeeping.
  - `scope` failed with `findings-out-of-scope`. O2-I3-P2-003 cites `.../clickup-real-browser/results.csv:3`, a file that is not in `review-scope-files.txt`. The defect it describes is also stated in an in-scope file, `008-live-runs-and-playbook-fixes/implementation-summary.md:144`. The iteration record is write-once, so the citation was not moved. A merge that re-anchors the finding to that file would clear this gate.
- hasAdvisories: false, as the script reports. With the gates set aside, the run carries 9 active P2 advisories.
- **Counts the verdict used:** P0 = 0, P1 = 0, P2 = 9.
- Self-check outcomes: no P0 or P1 candidate came up, so no Hunter/Skeptic/Referee pass was needed. Iteration 7 checked every finding against earlier records. O2-I2-P2-001 partly overlaps the prior C2-I2-P2-002 on the npm launcher, and its new part is the lifecycle-script ordering. O2-I3-P2-003 is already listed as a known limitation in 008 (implementation-summary.md:144).
- Review scope: spec-folder `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub`, 470 pre-bound scope files, 7 iterations covering correctness ×2, security ×2, traceability ×2 and maintainability ×1. Stop reason: `maxIterationsReached`.
- Operator review focus: every phase's shipped work against its goal criteria
- Goal-criteria result: the parent goal's criteria 2, 3 and 5 were re-run live and hold (registries list 3 and 6 modes, the stale-path rg finds nothing, and both routing stages work for one prompt per mode). Phase 003's criteria were re-run and hold. Phase 008's tallies match its results.csv. Criteria 1, 4, 6 and 7 were not re-run, because validate.sh and live browser sessions are outside this lineage's write limits.

## 2. Planning Trigger

`/speckit:plan` is required by the verdict enum (FAIL). In practice the remediation is P2 documentation and hardening work plus re-anchoring one citation. No P0 or P1 blocks release on content.

Planning Packet

```json
{
  "triggered": true,
  "verdict": "FAIL",
  "hasAdvisories": false,
  "failedRequiredGateIds": ["scope", "coverage"],
  "activeFindings": [
    {"id": "O2-I1-P2-001", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/mcp-browser-use/SKILL.md:30"},
    {"id": "O2-I2-P2-001", "severity": "P2", "dimension": "security", "file": ".skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh:111"},
    {"id": "O2-I3-P2-001", "severity": "P2", "dimension": "traceability", "file": "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/004-bladebro-mode/goal.md:59"},
    {"id": "O2-I3-P2-002", "severity": "P2", "dimension": "traceability", "file": "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md:146"},
    {"id": "O2-I3-P2-003", "severity": "P2", "dimension": "traceability", "file": ".skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-22--manual-testing-playbook--clickup-real-browser/results.csv:3"},
    {"id": "O2-I3-P2-004", "severity": "P2", "dimension": "traceability", "file": "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/005-routing-and-surfaces/implementation-summary.md:158"},
    {"id": "O2-I4-P2-001", "severity": "P2", "dimension": "maintainability", "file": ".skilled/skills/mcp-browser-use/mcp-aside-devtools/SKILL.md:147"},
    {"id": "O2-I5-P2-001", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/install.sh:28"},
    {"id": "O2-I6-P2-001", "severity": "P2", "dimension": "security", "file": ".skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/real-browser/attach-mode-reads.md:45"}
  ],
  "remediationWorkstreams": ["WS1 goal-state and parent-spec hygiene (O2-I3-P2-001, O2-I3-P2-002)", "WS2 doc drift after live results (O2-I4-P2-001, O2-I6-P2-001, O2-I1-P2-001)", "WS3 install supply chain and pins (O2-I2-P2-001, O2-I5-P2-001)", "WS4 evidence and orphaned requirements (O2-I3-P2-003, O2-I3-P2-004)"],
  "specSeed": ["Tick 003/004 goal criteria", "Fill 006->007 handoff row", "Decide owner for 005 REQ-003/008/009"],
  "planSeed": ["Fix Aside capture docs", "Pin bdg or record the alpha policy", "Add --ignore-scripts or document the ordering", "Add Chrome 136+ precondition to BB-015", "State own-Chrome vs caller-owned attach rule in SKILL.md"],
  "findingClasses": ["doc-contract-drift", "supply-chain-hardening", "stale-goal-state", "stale-parent-metadata", "evidence-retention-gap", "orphaned-unmet-requirement", "doc-drift-after-live-result", "unpinned-dependency", "scenario-precondition-gap"],
  "affectedSurfacesSeed": [".skilled/skills/mcp-browser-use/SKILL.md", ".skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh", ".skilled/skills/mcp-browser-use/mcp-aside-devtools/", ".skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/install.sh", ".skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/real-browser/attach-mode-reads.md", "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/{spec.md,003-mode-relocation/goal.md,004-bladebro-mode/goal.md}"],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

| ID | Sev | Dimension | File:line | Finding | Fix | Disposition |
|----|-----|-----------|-----------|---------|-----|-------------|
| O2-I1-P2-001 | P2 | correctness | `mcp-browser-use/SKILL.md:30` | "attach to my own chrome and finish the checkout" routes to mcp-chrome-devtools (hub-router `my own chrome`), but SKILL.md:30 and research.md:162 give caller-owned attachment to Bladebro. 013's lift was deliberate and was never written into the hub contract. Class doc-contract-drift. | State the own-Chrome rule in SKILL.md and ROUTER.md | open |
| O2-I2-P2-001 | P2 | security | `mcp-bladebro/scripts/install.sh:111` | `npm install -g` runs lifecycle scripts before the digest check at :130-138. The JS launcher is never verified. Refines prior C2-I2-P2-002. Class supply-chain-hardening. | `--ignore-scripts` if the package allows it, or document the ordering. Verify the launcher too | open |
| O2-I3-P2-001 | P2 | traceability | `004-bladebro-mode/goal.md:59` | Every completion box in the 003 and 004 goals is unchecked and both show completion_pct 0, yet the criteria hold. Class stale-goal-state. | Tick the boxes and update continuity | open |
| O2-I3-P2-002 | P2 | traceability | `spec.md:146` | The parent's 006→007 handoff row is still TBD, and metadata line 53 names the removed 505 branch. Class stale-parent-metadata. | Fill the row and update the branch | open |
| O2-I3-P2-003 | P2 | traceability | `.../clickup-real-browser/results.csv:3` (in-scope twin: `008.../implementation-summary.md:144`) | The live playbook verdicts cite evidence files that were not kept. Disclosed by 008. Class evidence-retention-gap. | Keep redacted raw output, or reword criterion 6 | open (acknowledged) |
| O2-I3-P2-004 | P2 | traceability | `005.../implementation-summary.md:158` | REQ-009 still reproduces: "set that aside and fix the failing unit test" and "write a lighthouse keeper short story" return the hub at 0.82. No later phase owns it. Class orphaned-unmet-requirement. | Assign it to a follow-up or close it by decision | open |
| O2-I4-P2-001 | P2 | maintainability | `mcp-aside-devtools/SKILL.md:147` | SKILL.md:147, README.md:189 and the catalog rows 139-142 still teach `page.on(...)` and `page.context()`, which throw on 1.26.626.1517 (SKILL.md:202-205, changelog v1.1.12.0:30). Class doc-drift-after-live-result. | Rewrite them to `page.console.logs()` and `page.evaluate` | open |
| O2-I5-P2-001 | P2 | correctness | `mcp-chrome-devtools/scripts/install.sh:28` | `browser-debugger-cli@alpha` floats, while 10 files document bdg 0.6.10 behaviour. Class unpinned-dependency. | Pin 0.6.10, or record the alpha policy and re-verify | open |
| O2-I6-P2-001 | P2 | security | `mcp-bladebro/.../attach-mode-reads.md:45` | BB-015 opens `<browser app>` with a debug port on its live profile. Branded Chrome 136+ refuses that, and triage item 1 blames a still-running browser. Both recorded passes used Aside. Class scenario-precondition-gap. | Add the browser precondition and a triage row | open |

## 4. Remediation Workstreams

No P0 or P1 workstream. P2 advisories:
1. WS1 goal and parent hygiene: O2-I3-P2-001, O2-I3-P2-002.
2. WS2 doc drift: O2-I4-P2-001, O2-I6-P2-001, O2-I1-P2-001.
3. WS3 install supply chain: O2-I2-P2-001, O2-I5-P2-001.
4. WS4 evidence and orphaned requirements: O2-I3-P2-003, O2-I3-P2-004.
5. Gate repair: re-anchor O2-I3-P2-003 to the in-scope 008 implementation-summary.md:144 at merge time.

## 5. Spec Seed

- 003 and 004 goal.md: tick the criteria and set the continuity to complete.
- Parent spec.md: fill the 006→007 handoff criterion and update the Branch row.
- Pick a phase to own 005 REQ-003, REQ-008 and REQ-009, or close them by decision.

## 6. Plan Seed

- Aside packet: replace the `page.on`/`page.context()` guidance in SKILL.md:147, README.md:189, feature-catalog.md:139-142 and the two devtools-parity code blocks.
- Chrome DevTools: pin `browser-debugger-cli@0.6.10` in install.sh:28, SKILL.md:61 and INSTALL-GUIDE.md, or document why alpha floats.
- Bladebro install.sh: test `--ignore-scripts` against 4.8.2. If the launcher still resolves the native package, adopt it.
- BB-015: add "Aside or another non-branded Chromium. Branded Chrome 136+ needs a non-default --user-data-dir" and a matching triage row.
- Hub SKILL.md and ROUTER.md: one sentence on own-Chrome attach (Chrome DevTools) versus `rb attach` (Bladebro).

## 7. Traceability Status

### Core Protocols
| Protocol | Status | Evidence | Drift |
|----------|--------|----------|-------|
| `spec_code` (hard) | partial | goal criteria 2/3/5 hold live; `spec.md:146`; `SKILL.md:30` | O2-I1-P2-001, O2-I3-P2-001/002/004, O2-I5-P2-001 |
| `checklist_evidence` (hard) | partial | `003.../implementation-summary.md:125` (8/8 met); `008.../implementation-summary.md:144` | O2-I3-P2-003 |

### Overlay Protocols
| Protocol | Status | Evidence |
|----------|--------|----------|
| `skill_agent` | pass | hub and mode version stamps equal their changelog heads |
| `feature_catalog_code` | partial | Chrome catalog 31 = SKILL.md:226; the Aside index rows contradict the live result |
| `playbook_capability` | partial | the scenario counts match; BB-015 precondition gap |
| `agent_cross_runtime` | not run | no agent definitions in the review target |

AC_COVERAGE: not computed. This lineage cannot run the validation rule.

## 8. Deferred Items

- sk-code's compiled router still rejects the "403 Forbidden ... chrome devtools" prompt at stage one. That matches the prior generation's deferral of the sibling-router `forbidden` reject and is outside this scope.
- Aside install.sh pipes the vendor installer to bash with no pin. Pre-existing, and already adjudicated out of scope by the prior generation.
- Not re-run here because of the lineage write limits: validate.sh --strict --recursive (criteria 7 and 009-013), live browser runs (criterion 6), `check-mcp-mutation-class.test.sh`.
- Bladebro doctor.sh edge cases: the empty-version digest message at :91-97, and a possible orphaned `bladebro mcp` after the 15 s probe kill at :127-138.

## Dimension Expansion Map

- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Swept: correctness (iterations 1, 5), security (2, 6), traceability (3, 7), maintainability (4).
- Remaining frontier: Code Mode example blocks in the Chrome DevTools packet and hub README navigation were sampled only.

## 9. Search Ledger

*No search-depth state captured (legacy v1 record)*. The iteration records are unversioned (no `reviewDepthSchemaVersion: 2`). hasSearchDebt: false (search_debt 0).

## 10. Audit Appendix

- Convergence: weightedStopScore went 0.25 (iterations 4-6) then 0.55 (iteration 7). Rolling average 0.1325 → 0.1175, above its stop line. Decision at iteration 7: STOP `maxIterationsReached`, blockedBy `dimensionCoverageGate` (traceability partial).
- newFindingsRatio per iteration: 1.0, 0.5, 0.67, 0.14, 0.125, 0.11, 0.0.
- Coverage: all four canonical dimensions covered (registry dimensionCoverage all true).
- Ruled out: the prompt-text `forbidden` reject in the browser hub (fixed, with a canary), the unconditional Bladebro data-root `rm -rf` (fixed), secrets in the UTCP browser manuals (none), changelog duplication (symlinks), Bladebro doctor/installer pin drift (identical constants), real-browser scenarios without operator selection (gated), and re-raising prior-generation P2s.
- Sources reviewed: see each `iterations/iteration-00N.md` Files Reviewed section. Live commands: `compiled-route.cjs --hub mcp-browser-use` (14/14 canaries match), `skill-advisor.cjs advisor_recommend` (one prompt per mode plus the REQ-009 phrases), `parent-skill-check.cjs` on both hubs (OK, 0 warnings).
- Write scope: every file this lineage authored is inside `review/lineages/opus-2`, and every state row went through `append-mode-event.cjs`. Containment conflict, recorded rather than repaired: a post-run `find -newer` shows `.skilled/skills/system-skill-advisor/runtime/database/{advisor-server.heartbeat,skill-graph-daemon-lease.sqlite-wal,.skill-advisor-owner.json}` changed during the run. The read-only `skill-advisor.cjs advisor_recommend` calls in iterations 1 and 3 may have refreshed that shared daemon state, and so could other sessions using the daemon. `.skilled/skills/.state/*` (gitignored hook state) and the fan-out root files `review/observability-events.jsonl` and `review/orchestration-status.log` also changed. This lineage did not write those root files, which belong to the runner.
