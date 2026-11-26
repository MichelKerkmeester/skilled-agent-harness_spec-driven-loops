# Deep Review Report: mcp-browser-use hub epic (fan-out root)

Run `1795495435655-lf6jf3`, generation 2, lineageMode restart. Four lineages (opus-1 to opus-4, cli-claude-code `claude-opus-5-5`), 7 iterations each, 28 iterations in all. All four lineages succeeded. Provider cost 33.85 USD (`orchestration-summary.json`). Stop reason in every lineage: `maxIterationsReached`.

## 1. Executive Summary

- **Overall verdict: FAIL.** `fanout-merge.cjs` returned `merged_verdict FAIL` and `review-verdict.cjs` returned `verdict FAIL, has_advisories false`. No P0 exists. The FAIL comes from two required terminal gates that are still failing, `coverage` and `scope` (`failed_required_gate_ids ["coverage","scope"]`). The two P1 defects alone would map to CONDITIONAL.
- hasAdvisories: false. The flag only applies to PASS.
- **Counts the verdict used:** P0 = 0, P1 = 3, P2 = 30, search_debt = 0. These are the merged registry entries, stated as the merge bound them.
- **Distinct defects behind those counts:** the 3 P1 entries are 2 defects, because O1-I1-P1-001 (opus-1) and R1-P1-001 (opus-3) report the same `_utils.sh:160` break. The 30 P2 entries are 18 distinct defects once cross-lineage duplicates are folded (section 3).
- **Self-check outcomes (fan-out root, recorded here only, no state rows written):**
  - O1-I1-P1-001 with its duplicate R1-P1-001: upheld 3 of 3, final severity P1. Each check ran `diff` on the two `_utils.sh` copies (exit 1, two changed lines at 160 and 164) and `node --test .skilled/bin/tests/mcp-installers.test.cjs` (5 tests, 4 pass, 1 fail).
  - R2-P1-001: upheld 3 of 3, final severity P1. Each check confirmed `mcp-bladebro/SKILL.md:60` offers `npx -y bladebro mcp` with no version pin and no operator yes, against the R-SEC-3 rule at `SKILL.md:116`.
  - No finding was downgraded and none was called a false positive, so the counts above stand.
- **Release readiness state:** `in-progress` (no active P0, and the stop reason is `maxIterationsReached`, not `converged`).
- Review scope: spec folder `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (parent plus phases 001 to 013) and the 470 pre-bound files in each lineage's `review-scope-files.txt`. That covers the 13 phase packets, the `mcp-browser-use` hub, the compiled routing lib, the advisor scorer, doctor scripts and related docs.
- Operator review focus: every phase's shipped work against its goal criteria
- Headline: most phase goal criteria still reproduce on the current tree. Registry counts, stale-path greps, parent-skill checks, the mutation guard, the playbook and catalog validators, recorded-run tallies and the two-stage routing replays all hold. Two real defects remain at P1. Phase 013 broke phase 003's installer-test criterion, and the Bladebro lane rule offers an ungated, unpinned install. The rest is packet-doc state that has not caught up with the tree, supply-chain hardening, and doc drift after live results.

## 2. Planning Trigger

`/speckit:plan` is required. The verdict is FAIL, with two active P1 defects and two failed required gates. The remediation routing the workflow names for a FAIL verdict is `/speckit:plan [remediation]` (`deep-review.yaml` completion `next_steps`). After the fixes land, a follow-up `/deep:review` over the same target must record `checklist_evidence` as pass to clear the coverage gate. Do not use `--extend`, because dimension coverage is already 4 of 4.

Planning Packet

```json
{
  "triggered": true,
  "verdict": "FAIL",
  "hasAdvisories": false,
  "failedRequiredGateIds": ["coverage", "scope"],
  "releaseReadinessState": "in-progress",
  "stopReason": "maxIterationsReached",
  "activeFindings": [
    {"id": "O1-I1-P1-001", "severity": "P1", "dimension": "correctness", "file": ".skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/_utils.sh:160", "findingClass": "UNKNOWN", "duplicateOf": "R1-P1-001"},
    {"id": "R1-P1-001", "severity": "P1", "dimension": "correctness", "file": ".skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/_utils.sh:160", "findingClass": "regression"},
    {"id": "R2-P1-001", "severity": "P1", "dimension": "security", "file": ".skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md:60", "findingClass": "security-contract-contradiction"},
    {"id": "O1-I1-P2-002", "severity": "P2", "dimension": "correctness", "file": "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/003-mode-relocation/goal.md:1", "findingClass": "UNKNOWN"},
    {"id": "O2-I3-P2-001", "severity": "P2", "dimension": "correctness", "file": "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/004-bladebro-mode/goal.md:59", "findingClass": "stale-goal-state"},
    {"id": "R1-P2-002", "severity": "P2", "dimension": "correctness", "file": "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/003-mode-relocation/goal.md:58", "findingClass": "traceability-drift"},
    {"id": "O4-I3-P2-002", "severity": "P2", "dimension": "traceability", "file": "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/004-bladebro-mode/goal.md:21", "findingClass": "packet-doc state drift"},
    {"id": "O4-I3-P2-001", "severity": "P2", "dimension": "traceability", "file": "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/003-mode-relocation/acceptance-criteria.md:94", "findingClass": "packet-doc state drift"},
    {"id": "R1-P2-003", "severity": "P2", "dimension": "correctness", "file": "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/005-routing-and-surfaces/goal.md:59", "findingClass": "traceability-drift"},
    {"id": "O1-I1-P2-001", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/mcp-browser-use/mcp-chrome-devtools/references/troubleshooting.md:327", "findingClass": "UNKNOWN"},
    {"id": "R3-P2-001", "severity": "P2", "dimension": "traceability", "file": "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/011-bdg-eval-port-note/goal.md:56", "findingClass": "non-durable-criterion"},
    {"id": "O1-I3-P2-001", "severity": "P2", "dimension": "traceability", "file": "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md:146", "findingClass": "UNKNOWN"},
    {"id": "O4-I3-P2-003", "severity": "P2", "dimension": "traceability", "file": "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md:146", "findingClass": "template residue"},
    {"id": "O2-I3-P2-002", "severity": "P2", "dimension": "correctness", "file": "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md:146", "findingClass": "stale-parent-metadata"},
    {"id": "R3-P2-002", "severity": "P2", "dimension": "traceability", "file": "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md:146", "findingClass": "template-residue"},
    {"id": "O1-I3-P2-002", "severity": "P2", "dimension": "traceability", "file": "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/graph-metadata.json:53", "findingClass": "UNKNOWN"},
    {"id": "O4-I3-P2-004", "severity": "P2", "dimension": "traceability", "file": "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md:17", "findingClass": "continuity drift"},
    {"id": "O1-I2-P2-002", "severity": "P2", "dimension": "security", "file": ".skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/install.sh:28", "findingClass": "UNKNOWN"},
    {"id": "R2-P2-002", "severity": "P2", "dimension": "security", "file": ".skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/install.sh:28", "findingClass": "supply-chain-hardening"},
    {"id": "O2-I5-P2-001", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/install.sh:28", "findingClass": "unpinned-dependency"},
    {"id": "O1-I2-P2-001", "severity": "P2", "dimension": "security", "file": ".skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh:111", "findingClass": "UNKNOWN"},
    {"id": "O2-I2-P2-001", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh:111", "findingClass": "supply-chain-hardening"},
    {"id": "O1-I4-P2-001", "severity": "P2", "dimension": "maintainability", "file": ".skilled/skills/mcp-browser-use/mcp-chrome-devtools/changelog/v1.0.27.0.md:15", "findingClass": "UNKNOWN"},
    {"id": "R4-P2-001", "severity": "P2", "dimension": "maintainability", "file": ".skilled/skills/mcp-browser-use/mcp-chrome-devtools/changelog/v1.0.27.0.md:1", "findingClass": "release-history-drift"},
    {"id": "O2-I4-P2-001", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/mcp-browser-use/mcp-aside-devtools/SKILL.md:147", "findingClass": "doc-drift-after-live-result"},
    {"id": "O4-I4-P2-001", "severity": "P2", "dimension": "maintainability", "file": ".skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/repl-evidence-capture.sh:12", "findingClass": "stale example after a verified fix"},
    {"id": "O1-I6-P2-001", "severity": "P2", "dimension": "traceability", "file": ".skilled/skills/mcp-browser-use/mcp-aside-devtools/manual-testing-playbook/manual-testing-playbook.md:35", "findingClass": "UNKNOWN"},
    {"id": "O2-I6-P2-001", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/real-browser/attach-mode-reads.md:45", "findingClass": "scenario-precondition-gap"},
    {"id": "O2-I3-P2-003", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-22--manual-testing-playbook--clickup-real-browser/results.csv:3", "findingClass": "evidence-retention-gap"},
    {"id": "O2-I1-P2-001", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/mcp-browser-use/SKILL.md:30", "findingClass": "doc-contract-drift"},
    {"id": "O2-I3-P2-004", "severity": "P2", "dimension": "correctness", "file": "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/005-routing-and-surfaces/implementation-summary.md:158", "findingClass": "orphaned-unmet-requirement"},
    {"id": "R5-P2-001", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/2026-11-21--two-stage-replay--compiled/results.csv:5", "findingClass": "brittle-acceptance-evidence"},
    {"id": "R6-P2-001", "severity": "P2", "dimension": "traceability", "file": "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/005-routing-and-surfaces/tasks.md:67", "findingClass": "understated-known-limitation", "refinedBy": "R7-P2-001", "refinedByClass": "alias-overreach"}
  ],
  "remediationWorkstreams": [
    {"id": "WS-1", "priority": "P1", "title": "Restore installer helper parity and rerun the parity test", "findings": ["O1-I1-P1-001", "R1-P1-001"]},
    {"id": "WS-2", "priority": "P1", "title": "Gate or pin the Bladebro npx fallback under R-SEC-3", "findings": ["R2-P1-001"]},
    {"id": "WS-3", "priority": "P2", "gateClearing": true, "title": "Phase goal, closure and parent packet state reconciliation", "findings": ["O1-I1-P2-002", "O2-I3-P2-001", "R1-P2-002", "O4-I3-P2-002", "O4-I3-P2-001", "R1-P2-003", "O1-I1-P2-001", "R3-P2-001", "O1-I3-P2-001", "O4-I3-P2-003", "O2-I3-P2-002", "R3-P2-002", "O1-I3-P2-002", "O4-I3-P2-004"]},
    {"id": "WS-4", "priority": "P2", "title": "Install supply chain pins and ordering", "findings": ["O1-I2-P2-002", "R2-P2-002", "O2-I5-P2-001", "O1-I2-P2-001", "O2-I2-P2-001"]},
    {"id": "WS-5", "priority": "P2", "title": "Release history for the 013 changes", "findings": ["O1-I4-P2-001", "R4-P2-001"]},
    {"id": "WS-6", "priority": "P2", "title": "Mode docs, examples, playbooks and evidence after live results", "findings": ["O2-I4-P2-001", "O4-I4-P2-001", "O1-I6-P2-001", "O2-I6-P2-001", "O2-I3-P2-003"]},
    {"id": "WS-7", "priority": "P2", "title": "Routing contract and vocabulary", "findings": ["O2-I1-P2-001", "O2-I3-P2-004", "R5-P2-001", "R6-P2-001"]},
    {"id": "WS-8", "priority": "gate", "title": "Scope gate bookkeeping: re-anchor O2-I3-P2-003 to an in-scope file or add the 2026-11-22 report to the scope list", "findings": ["O2-I3-P2-003"]}
  ],
  "specSeed": [
    "Open a remediation child under the hub epic covering WS-1 to WS-8",
    "Requirement: the two shared _utils.sh copies change in lockstep, or a recorded decision splits them and the parity test is updated",
    "Requirement: every Bladebro transport path honors R-SEC-3, with no unpinned or unverified launch without an operator yes",
    "Requirement: goal criteria use presence checks rather than equality counts on files later phases edit",
    "Acceptance: node --test .skilled/bin/tests/mcp-installers.test.cjs exits 0",
    "Acceptance: a follow-up /deep:review records checklist_evidence as pass"
  ],
  "planSeed": [
    "Align mcp-code-mode/scripts/_utils.sh:160,164 with the Chrome DevTools copy, or revert the Chrome change, then run the parity test",
    "Amend mcp-bladebro/SKILL.md:60, 004-bladebro-mode/spec.md:82 and 001 research.md:57 to drop or gate the npx -y fallback",
    "Tick the 003 and 004 goal criteria that hold, fix the 003 closure anchor, qualify or untick 005 criterion 1, and change 011's count check to a presence check",
    "Fill parent spec.md:146 and refresh parent spec.md, goal.md and graph-metadata.json continuity",
    "Pin browser-debugger-cli@0.6.10 and install Bladebro with --ignore-scripts before the digest check, or document the ordering",
    "Cut Chrome DevTools 1.0.28.0 and an Aside entry for the 013 changes and restore the published v1.0.27.0 note",
    "Rewrite Aside page.on and page.context() guidance, fix the repl-evidence-capture.sh default path, derive the Aside census, add the Chrome 136+ precondition to BB-015",
    "State the own-Chrome versus caller-owned attach rule in the hub SKILL.md and ROUTER.md, assign 005 REQ-009, widen tie-break vocabulary and tighten the generic aliases"
  ],
  "findingClasses": ["regression", "security-contract-contradiction", "stale-goal-state", "traceability-drift", "packet-doc state drift", "non-durable-criterion", "template residue", "template-residue", "stale-parent-metadata", "continuity drift", "supply-chain-hardening", "unpinned-dependency", "release-history-drift", "doc-drift-after-live-result", "stale example after a verified fix", "scenario-precondition-gap", "evidence-retention-gap", "doc-contract-drift", "orphaned-unmet-requirement", "brittle-acceptance-evidence", "understated-known-limitation", "alias-overreach", "UNKNOWN"],
  "affectedSurfacesSeed": [
    ".skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/_utils.sh",
    ".skilled/skills/mcp-code-mode/scripts/_utils.sh",
    ".skilled/bin/tests/mcp-installers.test.cjs",
    ".skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md",
    ".skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh",
    ".skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/install.sh",
    ".skilled/skills/mcp-browser-use/mcp-chrome-devtools/references/troubleshooting.md",
    ".skilled/skills/mcp-browser-use/mcp-chrome-devtools/changelog/v1.0.27.0.md",
    ".skilled/skills/mcp-browser-use/mcp-aside-devtools/SKILL.md",
    ".skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/repl-evidence-capture.sh",
    ".skilled/skills/mcp-browser-use/mcp-aside-devtools/manual-testing-playbook/manual-testing-playbook.md",
    ".skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/real-browser/attach-mode-reads.md",
    ".skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-22--manual-testing-playbook--clickup-real-browser/results.csv",
    ".skilled/skills/mcp-browser-use/SKILL.md",
    ".skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/2026-11-21--two-stage-replay--compiled/results.csv",
    "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md",
    "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/graph-metadata.json",
    "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/003-mode-relocation/goal.md",
    "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/003-mode-relocation/acceptance-criteria.md",
    "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/004-bladebro-mode/goal.md",
    "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/005-routing-and-surfaces/goal.md",
    "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/005-routing-and-surfaces/implementation-summary.md",
    "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/005-routing-and-surfaces/tasks.md",
    "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/011-bdg-eval-port-note/goal.md"
  ],
  "fixCompletenessRequired": true
}
```

Field notes. `dimension` and `file` come from the merged registry. `findingClass` comes from the lineage state logs. The merged registry carries `findingClass: null` for every entry, and opus-1's state rows carry no class at all, so each opus-1 id is marked `UNKNOWN` rather than inferred from prose. `fixCompletenessRequired` is true because a P1 regression broke a shipped acceptance criterion.

## 3. Active Finding Registry

Every entry has disposition `active` in the merged registry. scopeProof and affectedSurfaceHints are null or empty in the merged registry for every entry, so the values below come from the lineage reports and are marked as such.

### 3.1 Active P1 findings

| ID | Severity | Dimension | File:line | Evidence | Impact | Fix | Self-check |
|----|----------|-----------|-----------|----------|--------|-----|------------|
| O1-I1-P1-001 (opus-1), duplicate R1-P1-001 (opus-3) | P1 | correctness | `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/_utils.sh:160` | Phase 013 raised the `check_node_version` default from 18 to 20 and changed the install hint at line 164, in the Chrome DevTools copy only. `mcp-code-mode/scripts/_utils.sh:160` still says 18. `.skilled/bin/tests/mcp-installers.test.cjs:49` asserts the two copies are identical, so the test fails (5 tests, 1 fail). The change bought no behavior, because `install.sh:30` passes `MIN_NODE_VERSION="20"` explicitly. | Phase 003 goal criterion 4 is now false and 013's own REQ-006 "No hub gate regresses" is broken. The guard test is red. | Change both copies together, or revert the Chrome default, then rerun the parity test. Add the suite to the gates a phase must rerun. | Upheld 3 of 3, final P1 |
| R2-P1-001 (opus-3) | P1 | security | `.skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md:60` | Line 60 offers `bladebro mcp` "(or `npx -y bladebro mcp`) when the binary is unavailable". The npx form has no `@4.8.2` pin and no operator-yes caveat. R-SEC-3 at line 116 says installation stays an operator stop-for-yes, never implicit, with the exact version pinned and a SHA-256 check. `references/mcp-wiring.md:44` concedes the npx path needs an operator yes. The live doctor run already sees v4.8.3, so `npx -y` would fetch an unverified newer version. | An agent with no binary runs an unpinned, unverified package without operator consent. | Drop the npx alternative, or gate it on an operator yes and `bladebro@4.8.2`. Amend `004-bladebro-mode/spec.md:82` and `001` `research.md:57` to match. | Upheld 3 of 3, final P1 |

Finding classes: R1-P1-001 is `regression`, R2-P1-001 is `security-contract-contradiction`, O1-I1-P1-001 is `UNKNOWN`. Scope proof (lineage report): the `_utils.sh` diff has 2 hunks (160, 164), and the only npx mentions are `SKILL.md:60` (ungated) and `mcp-wiring.md:44` (gated).

### 3.2 Active P2 findings, grouped by theme

All 30 P2 entries appear below. Where two or more lineages report the same defect, the entries share one row and every id is listed.

#### Theme A: phase goal and closure state drift (8 entries, 4 defects)

| Defect | IDs | Dimension | File:line | Evidence and impact | Fix |
|--------|-----|-----------|-----------|---------------------|-----|
| A1. Phases 003 and 004 are Complete while every goal criterion is unchecked | O1-I1-P2-002 (opus-1), O2-I3-P2-001 (opus-2), R1-P2-002 (opus-3), O4-I3-P2-002 (opus-4) | correctness, correctness, correctness, traceability | `003-mode-relocation/goal.md:1`, `004-bladebro-mode/goal.md:59`, `003-mode-relocation/goal.md:58`, `004-bladebro-mode/goal.md:21` | 003 goal lines 58 to 62 and 004 goal lines 59 to 63 are all `[ ]`. 004's continuity reads completion_pct 0. Every 004 criterion holds, and four of 003's five hold. The fifth (criterion 4) fails because of the P1 above. Goal state cannot be read from the packet. | Tick the criteria that hold, with evidence. Leave 003 criterion 4 open until WS-1 lands. Refresh the continuity. |
| A2. 003 closure anchor says AC-002 is unmet while its row and the tree say Met | O4-I3-P2-001 (opus-4) | traceability | `003-mode-relocation/acceptance-criteria.md:94` | The AC-002 row is Met (`:60`) and the rg pair prints nothing. The closure anchor still says "Closeable: No" (`:92-94`), goal.md logs "Criterion 2 Unmet" (`:87`), and implementation-summary.md keeps completion_pct 90 with next action "Await operator choice on AC-002". A resume of 003 would reopen finished work. | Set the closure statement to Yes and update the goal log and continuity. |
| A3. 005 goal criterion 1 is ticked though its own evidence contradicts it | R1-P2-003 (opus-3) | correctness | `005-routing-and-surfaces/goal.md:59` | The `[x]` criterion says mcp-tooling routes for none of the requests, but `scratch/after-stage1.jsonl:1-3` shows `mcp_tooling_passing: true`. The ticked box overstates the phase. | Qualify the criterion as "at the default threshold", or untick it. |
| A4. 011's count criterion no longer reproduces | O1-I1-P2-001 (opus-1), R3-P2-001 (opus-3) | correctness, traceability | `mcp-chrome-devtools/references/troubleshooting.md:327`, `011-bdg-eval-port-note/goal.md:56` | The criterion expects `rg -c 'Session target not found\|returnByValue'` to print 3. It prints 5 since 013 added lines 327 and 826. The parent handoff row at `spec.md:151` uses the same check. | Replace the count with a presence check, for example `rg -q` on the heading at `troubleshooting.md:467`. |

#### Theme B: parent packet metadata (6 entries, 2 defects)

| Defect | IDs | Dimension | File:line | Evidence and impact | Fix |
|--------|-----|-----------|-----------|---------------------|-----|
| B1. The parent 006 to 007 handoff row is template residue | O1-I3-P2-001 (opus-1), O4-I3-P2-003 (opus-4), O2-I3-P2-002 (opus-2), R3-P2-002 (opus-3) | traceability, traceability, correctness, traceability | `spec.md:146` | The row reads `[Criteria TBD] \| [Verification TBD]` in a packet marked Complete. O2-I3-P2-002 also notes that the parent metadata names the removed 505 branch. The handoff is undefined. | Fill the row from 007's goal criteria and update the Branch row. |
| B2. Parent continuity and graph metadata are frozen at planning time | O1-I3-P2-002 (opus-1), O4-I3-P2-004 (opus-4) | traceability | `graph-metadata.json:53`, `spec.md:17` | graph-metadata says `in_progress` with last active child 012. spec.md and goal.md continuity say completion_pct 0 and next action "Start 002-hub-scaffold" (`spec.md:14-24`, `goal.md:14-24`), while the status says Complete. | Refresh both continuity blocks and the graph metadata. |

#### Theme C: install supply chain (5 entries, 2 defects)

| Defect | IDs | Dimension | File:line | Evidence and impact | Fix |
|--------|-----|-----------|-----------|---------------------|-----|
| C1. Chrome DevTools installs bdg from the floating `@alpha` tag | O1-I2-P2-002 (opus-1), R2-P2-002 (opus-3), O2-I5-P2-001 (opus-2) | security, security, correctness | `mcp-chrome-devtools/scripts/install.sh:28` | `browser-debugger-cli@alpha` appears in install.sh, SKILL.md:61, INSTALL-GUIDE and `troubleshooting.md:163`, while 013 aligned about ten docs to bdg 0.6.10 behavior. A moving pre-release can diverge from the corrected docs. | Pin `browser-debugger-cli@0.6.10`, or record the alpha policy and re-verify. |
| C2. Bladebro installer runs npm lifecycle scripts before the digest check | O1-I2-P2-001 (opus-1), O2-I2-P2-001 (opus-2) | security, correctness | `mcp-bladebro/scripts/install.sh:111` | `npm install -g` runs lifecycle scripts before the SHA-256 check at `:130-138`, and the JS launcher is never verified. R-SEC-3 says verify before use. O2-I2-P2-001 refines the prior generation's C2-I2-P2-002. | Install with `--ignore-scripts`, verify, then run what is needed, or document why the scripts are safe. Verify the launcher too. |

#### Theme D: release history (2 entries, 1 defect)

| Defect | IDs | Dimension | File:line | Evidence and impact | Fix |
|--------|-----|-----------|-----------|---------------------|-----|
| D1. Phase 013 shipped behavior changes without cutting a release | O1-I4-P2-001 (opus-1), R4-P2-001 (opus-3) | maintainability | `mcp-chrome-devtools/changelog/v1.0.27.0.md:15`, `:1` | 013 changed 36 Chrome DevTools files (install, utils and doctor among them) and 21 Aside files with no new versions. It rewrote 011's published v1.0.27.0 note in place, and Aside got no entry. Users cannot tell the installer changed. | Cut Chrome DevTools 1.0.28.0 and an Aside 1.1.13.0 entry, and keep released entries frozen. |

#### Theme E: mode docs, examples, playbooks and evidence after live results (5 entries, 5 defects)

| Defect | IDs | Dimension | File:line | Evidence and impact | Fix |
|--------|-----|-----------|-----------|---------------------|-----|
| E1. Aside docs still teach `page.on` capture and `page.context()` cookies | O2-I4-P2-001 (opus-2) | correctness | `mcp-aside-devtools/SKILL.md:147` | SKILL.md:147, README.md:189 and catalog rows 139 to 142 teach calls that throw on Aside 1.26.626.1517 (SKILL.md:202-205, changelog v1.1.12.0:30). | Rewrite them to `page.console.logs()` and `page.evaluate`. |
| E2. Aside example defaults to `/tmp`, which its own README says fails | O4-I4-P2-001 (opus-4) | maintainability | `mcp-aside-devtools/examples/repl-evidence-capture.sh:12` | `OUT_DIR=/tmp/aside-evidence` is the form `examples/README.md:51` says fails on the current Aside. ASD-007 already uses `./tmp/` with in-REPL `fs` checks and passed live. A no-argument run fails its own artifact check. | Adopt the ASD-007 path form in the script and the README. |
| E3. Aside playbook root keeps a hand-typed scenario census | O1-I6-P2-001 (opus-1) | traceability | `mcp-aside-devtools/manual-testing-playbook/manual-testing-playbook.md:35` | The validator warns `HAND_TYPED_CENSUS (29 scenarios, 8 categories)`. Correct today and drift-prone. | Derive the census or drop the number. |
| E4. BB-015 launches the live profile with a debug port that branded Chrome 136+ refuses | O2-I6-P2-001 (opus-2) | correctness | `mcp-bladebro/manual-testing-playbook/real-browser/attach-mode-reads.md:45` | Branded Chrome 136+ refuses a debug port on the default profile, and triage item 1 blames a still-running browser instead. Both recorded passes used Aside. | Add the browser precondition and a matching triage row. |
| E5. Live playbook verdicts cite evidence files that were never kept | O2-I3-P2-003 (opus-2) | correctness | `mcp-bladebro/benchmark/reports/2026-11-22--manual-testing-playbook--clickup-real-browser/results.csv:3` | The verdicts point at raw output that was not retained. 008 discloses this as a known limitation at `008-live-runs-and-playbook-fixes/implementation-summary.md:144`. This finding is the cause of the scope gate failure (section 7). | Keep redacted raw output, or reword the criterion. Re-anchor the citation to the in-scope 008 file. |

#### Theme F: routing contract and vocabulary (4 entries, 4 defects)

| Defect | IDs | Dimension | File:line | Evidence and impact | Fix |
|--------|-----|-----------|-----------|---------------------|-----|
| F1. Caller-owned Chrome attach routes to Chrome DevTools while the hub contract gives it to Bladebro | O2-I1-P2-001 (opus-2) | correctness | `.skilled/skills/mcp-browser-use/SKILL.md:30` | "attach to my own chrome and finish the checkout" routes to mcp-chrome-devtools through the hub-router `my own chrome` lift. SKILL.md:30 and research.md:162 give caller-owned attachment to Bladebro. 013's lift was deliberate and never written into the contract. | State the own-Chrome rule in SKILL.md and ROUTER.md. |
| F2. 005 REQ-009 is unmet and no later phase owns it | O2-I3-P2-004 (opus-2) | correctness | `005-routing-and-surfaces/implementation-summary.md:158` | "set that aside and fix the failing unit test" and "write a lighthouse keeper short story" still return the hub at 0.82. | Assign it to a follow-up phase or close it by decision. |
| F3. Tie-break routing holds only for the recorded phrasings | R5-P2-001 (opus-3) | correctness | `benchmark/reports/compiled-routing/2026-11-21--two-stage-replay--compiled/results.csv:5` | Tie-breaks pass at 0.8255 and 0.8298 against a 0.8 floor. Paraphrases such as "fill out the form in my signed-in account" return nothing. The objective is proven only on tuned strings. | Widen the tie-break vocabulary and add paraphrase rows to the benchmark. |
| F4. Generic aliases leak out-of-domain prompts, and the T020 note understates it | R6-P2-001 (opus-3), with R7-P2-001 folded in by `refines` | traceability | `005-routing-and-surfaces/tasks.md:67` (and `mode-registry.json:116` per R7) | Two defects share this entry. R6: 4 of 8 out-of-domain phrases return the hub above 0.8 (0.82, 0.82, 0.8864, 0.9129), but T020 names only the two at 0.82. R7 (the title the registry keeps): `rb status` and `rb attach` route "rb status of the ruby build" (0.8229) and "check rb attach logs in the deploy" (0.8452) to mcp-bladebro. R-SEC-1 still gates the rb lane. | Correct the T020 note. Tighten or drop the generic aliases `aside`, `lighthouse`, `har`, `performance trace`, `rb status` and `rb attach`. |

Theme totals: A 8, B 6, C 5, D 2, E 5, F 4, which is 30 entries and 18 distinct defects.

## 4. Remediation Workstreams

1. **P0:** none.
2. **P1, WS-1:** restore `_utils.sh` parity (O1-I1-P1-001, R1-P1-001). Acceptance: `node --test .skilled/bin/tests/mcp-installers.test.cjs` exits 0 with 5 of 5 passing.
3. **P1, WS-2:** remove or gate the `npx -y bladebro mcp` fallback in SKILL.md, the 004 spec and the 001 research (R2-P1-001).
4. **Gate repair, WS-8:** re-anchor O2-I3-P2-003 to `008-live-runs-and-playbook-fixes/implementation-summary.md:144`, or add the 2026-11-22 ClickUp report folder to the scope list.
5. **P2 advisories, separated:**
   - WS-3 (clears the coverage gate): Theme A and Theme B, 14 entries.
   - WS-4: Theme C, 5 entries.
   - WS-5: Theme D, 2 entries.
   - WS-6: Theme E, 5 entries.
   - WS-7: Theme F, 4 entries.

## 5. Spec Seed

- Open one remediation child under the hub epic, scoped to WS-1 to WS-8.
- Requirement: shared helper copies change in lockstep, or a recorded decision splits them and the parity test changes with it.
- Requirement: every Bladebro transport path honors R-SEC-3. No unpinned or unverified launch happens without an operator yes.
- Requirement: goal criteria use presence checks, not equality counts on files that later phases edit.
- Requirement: a phase that changes a mode's scripts or behavior cuts a new changelog version and leaves published entries frozen.
- Acceptance: the parity test passes, `rg 'npx -y bladebro' mcp-bladebro/SKILL.md` prints no ungated line, and a follow-up review records `checklist_evidence` as pass.

## 6. Plan Seed

1. Edit `mcp-code-mode/scripts/_utils.sh:160,164` to match the Chrome copy, or revert the Chrome change. Run the parity test.
2. Amend `mcp-bladebro/SKILL.md:60`, `004-bladebro-mode/spec.md:82` and `001` `research.md:57`.
3. Tick the 003 and 004 goal criteria that hold, fix the 003 closure anchor, qualify 005 criterion 1, and switch 011's check to a presence check.
4. Fill parent `spec.md:146` and refresh parent spec.md, goal.md and graph-metadata.json continuity.
5. Pin `browser-debugger-cli@0.6.10` in install.sh, SKILL.md, INSTALL-GUIDE and troubleshooting. Test `--ignore-scripts` against bladebro 4.8.2 and adopt it if the launcher still resolves.
6. Add Chrome DevTools 1.0.28.0 and an Aside entry for 013's changes.
7. Fix the Aside capture docs, the example default path and the census. Add the Chrome 136+ precondition to BB-015. Re-anchor or retain the ClickUp evidence.
8. Write the own-Chrome attach rule into the hub SKILL.md and ROUTER.md, assign 005 REQ-009, widen tie-break vocabulary with paraphrase rows, correct the T020 note and tighten the generic aliases.
9. Run `validate.sh --strict --recursive` on the packet, then run `/deep:review` again on the same target.

## 7. Traceability Status

### Core Protocols

| Protocol | Gate class | opus-1 | opus-2 | opus-3 | opus-4 | Unresolved drift |
|----------|-----------|--------|--------|--------|--------|------------------|
| `spec_code` | hard | partial | partial | pass (latest) | pass | opus-1 holds it partial on O1-I1-P1-001. opus-2 marks it partial while saying "no new drift this pass", which looks like a bookkeeping error. |
| `checklist_evidence` | hard | partial | partial | partial | partial | Themes A and B: 003 and 004 boxes, the 003 closure anchor, 005 criterion 1, the 011 count and the 006 to 007 handoff row. |

The merged registry summary is required 6, executed 6, pass 2, partial 4, gatingFailures 2. Every protocol ran, so `partial` records open drift, not unreviewed ground.

### Overlay Protocols

| Protocol | opus-1 | opus-2 | opus-3 | opus-4 | Notes |
|----------|--------|--------|--------|--------|-------|
| `skill_agent` | pass | pass | notApplicable | pass | No `--account` flag, live manual consent stated, mode table names the three registry modes |
| `agent_cross_runtime` | pass | not run | not run | notApplicable | No stale mirror or agent paths |
| `feature_catalog_code` | pass | partial | pass | pass | Counts match. The Aside index rows contradict the live result (E1) |
| `playbook_capability` | pass | partial | pass | pass | Tallies match. BB-015 omits the Chrome 136+ precondition (E4) |

AC_COVERAGE: not computed. No lineage could run the rule, because `validate.sh` writes outside the lineage. 003, 007 and 008 are Level 2 packets, and 003's rows are all Met.

### Terminal gate failures and their cause

The merge does no gate checks of its own. `fanout-merge.cjs` combines each lineage's latest `terminal_gates` event. Verified from the lineage state logs:

| Lineage | evidence | scope | coverage |
|---------|----------|-------|----------|
| opus-1 (state line 9) | all-findings-cited | all-findings-in-scope | traceability-incomplete |
| opus-2 (state line 10) | all-findings-cited | findings-out-of-scope | traceability-incomplete |
| opus-3 (state line 12) | all-findings-cited | all-findings-in-scope | traceability-incomplete |
| opus-4 (state line 17) | all-findings-cited | all-findings-in-scope | traceability-incomplete |

- **coverage (real gap in the target).** `terminal-gates.cjs` passes the gate only when `dimensionCoverageGate.pass` is true, which needs `traceabilityCovered`. That in turn needs zero gating failures, and any hard protocol at `partial`, `fail` or `blocked` counts as one. `checklist_evidence` is a hard `partial` in all four lineages because of the open checklist and goal-state drift in Themes A and B. Fixing WS-3 and re-reviewing clears it.
- **scope (bookkeeping).** `terminal-gates.cjs` requires every open finding's file to sit inside the 470-entry `reviewScopeFiles` list or the target folder. Only opus-2 fails it, through O2-I3-P2-003, which cites the 2026-11-22 ClickUp `results.csv`. The scope list holds only the 2026-11-21 report folders (`review-scope-files.txt:134-137`) and has no entry for the ClickUp report. The defect itself stands. It needs an in-scope citation, or the scope list needs that report.

## 8. Deferred Items

- The merged registry carries no `frontier` object (default depth mode), so no frontier nodes are listed.
- Not re-run by any lineage because they write outside the lineage: `validate.sh --strict --recursive` (parent criterion 7 and the 009 to 013 criteria), and the stage-one advisor replay (parent criterion 5, 005 criterion 1, 013 criterion 1). These criteria are unverified, neither passed nor failed.
- Not re-run: 012 criterion 1 (`doc-alignment.cjs scope`), live browser sessions (parent criterion 6), `check-mcp-mutation-class.test.sh` in opus-2, and 007's "changelog coverage check prints 0 uncovered", which names no script.
- Four Aside playbook scenarios were edited by 013 after the 2026-11-22 recorded runs, and no rerun records the new wording.
- Whether bladebro 4.8.2 actually runs npm lifecycle scripts before the digest check needs network access to confirm.
- Bladebro `doctor.sh` edge cases: the empty-version digest message at `:91-97` and a possible orphaned `bladebro mcp` after the 15 second probe kill at `:127-138`.
- Prior-generation items seen and not re-raised: C2-I1-P2-001 (bare `aside` substring bundles "Aside from that, run lighthouse"), C2-I2-P2-003 (`auto` rb lane attaches to any reachable endpoint), R2-P2-003 (Chrome `sudo npm` hint), the sk-code router `forbidden` reject, and the unpinned Aside vendor installer.
- The Bladebro digest constants are duplicated in install.sh and doctor.sh. They agree today.
- opus-2 recorded a containment note: shared advisor daemon state under `.skilled/skills/system-skill-advisor/runtime/database/` changed during its run, possibly from read-only `advisor_recommend` calls or from other sessions.

## Dimension Expansion Map

- `divergenceByLineage` is empty for all four lineages: no saturated directions, 0 completed pivots, 0 failed pivots, 0 audited overrides, no Council artifacts, no remaining frontier recorded.
- Selected review directions by lineage: opus-1 correctness (1, 5), security (2, 7), traceability (3, 6), maintainability (4, 7). opus-2 correctness (1, 5), security (2, 6), traceability (3, 7), maintainability (4). opus-3 correctness (1, 5), security (2, 7), traceability (3, 6), maintainability (4). opus-4 correctness (1, 5), security (2), traceability (3, 5, 6, 7), maintainability (4, 7), with STUCK_RECOVERY passes before iterations 3 and 7.
- opus-2 lists the Code Mode example blocks in the Chrome DevTools packet and the hub README navigation as sampled only.

## 9. Search Ledger

- searchCoverage: required bug classes `consent_bypass` and `secret_exposure`. Covered none, ruled out both, deferred none, blocked none. graphCoverageMode `graph`.
- candidateCoverage: 6 covered, 9 ruled out, 0 deferred, 0 blocked.
- searchDebt: empty. hasSearchDebt: false.
- ruledOutCandidates (10, all from opus-1):

| Id | Iteration | Bug class | Target | Evidence | Reason |
|----|-----------|-----------|--------|----------|--------|
| SL-001-2 | 1 | criterion_regression | `.skilled` | `mcp-tooling/mode-registry.json:1` | no match, verified by rg |
| SL-002-3 | 2 | destructive_command | Bladebro teardown scenario | `uninstall-and-data-root.md:48` | fix holds |
| SL-002-4 | 2 | consent_bypass | advisor `fusion.ts` | `fusion.ts:623` | needs explicit attach wording |
| SL-003-3 | 3 | scope_creep | 013 spec.md | `013.../spec.md:91` | in declared scope |
| SL-004-2 | 4 | version_mismatch | `mcp-browser-use` | `SKILL.md:5` | checker passes |
| SL-005-1 | 5 | routing_regression | `compiled-route.cjs` | `010-mcp-browser-use/lib/router.cjs:109` | all route correctly, verified by replay |
| SL-005-2 | 5 | evidence_tally_drift | `mcp-browser-use` | ClickUp `results.csv:1` | match, verified by count |
| SL-006-2 | 6 | stale_mirror_path | `.skilled/agents`, `.claude/agents` | `topics.json:286` | no match, verified by rg |
| SL-007-1 | 7 | secret_exposure | `.utcp_config.json` | `.utcp_config.json:1` | no env, verified by direct read |
| SL-007-2 | 7 | consent_bypass | Chrome DevTools SKILL.md | `SKILL.md:86` | rule present |

- cleanSearchProof: not present in the merged registry. opus-2, opus-3 and opus-4 recorded unversioned iteration rows with no search ledger of their own.

## 10. Audit Appendix

### Convergence summary

| Lineage | Iterations | Convergence | newFindingsRatio by iteration | Stop |
|---------|-----------|-------------|-------------------------------|------|
| opus-1 | 7 | 1 | 1.0, 0.25, 0.17, 0.07, 0.0, 0.06, 0.0 | maxIterationsReached |
| opus-2 | 7 | 1 | 1.0, 0.5, 0.67, 0.14, 0.125, 0.11, 0.0 | maxIterationsReached, blocked by dimensionCoverageGate |
| opus-3 | 7 | 0.974 | 1.0, 0.462, 0.133, 0.063, 0.059, 0.056, 0.026 | maxIterationsReached |
| opus-4 | 7 | 1 | 0, 0, 1.0, 0.2, 0, 0, 0 | maxIterationsReached, blocked by dimensionCoverageGate |

Lineage verdicts were FAIL in all four (`fanout-attribution.md`). opus-1 and opus-3 failed on coverage only, opus-2 on coverage and scope, opus-4 on coverage only.

### Coverage summary

- Dimension coverage: 4 of 4 (correctness, security, traceability, maintainability), ratio 1.0, in the merged registry and in every lineage.
- Lineage resource maps (the root map is not emitted on a fan-out run): `lineages/opus-1/resource-map.md`, `lineages/opus-2/resource-map.md`, `lineages/opus-3/resource-map.md`, `lineages/opus-4/resource-map.md`.
- Resource Map Coverage Gate: skipped. `{spec_folder}/resource-map.md` does not exist and there is no `applied/` folder, so `resource_map_present` is false.

### Ruled-out claims (across lineages)

Stale mcp-tooling browser paths, browser ids in mcp-tooling root files, embedded secrets in the UTCP browser manuals, debug-port exposure, `eval` of caller-supplied ops, `eval` in the Chrome `_utils.sh` (internal literals only), the Aside curl installer (operator-invoked), the teardown `rm -rf` regression (the prior fix holds), 013 scope creep, the 403 Forbidden reject regression (the prior fix holds with a canary), results.csv tally drift, JSON routing version mismatch, stale mirror paths, changelog duplication (symlinks), Bladebro doctor and installer pin drift, real-browser scenarios without operator selection, compiled-routing bundle drift, parent Complete against 005 Partial, a stale stage-one tool, dangling changelog links, and a P1 upgrade of the 003 closure drift.

### Sources reviewed

Each lineage's `iterations/iteration-00N.md` lists its files reviewed. Live commands the lineages ran include `compiled-route.cjs --hub mcp-browser-use`, `skill-advisor.cjs advisor_recommend`, `parent-skill-check.cjs` on the hub, mcp-tooling and sk-code, `check-mcp-mutation-class.sh` and its test, `mcp-installers.test.cjs`, `validate-playbook-package.cjs` three times, `validate_catalog_package.py`, `verify-router-sync.cjs` and `compiled-route-sync.cjs --check`.

### Cross-reference appendix

- Core Protocols: `spec_code`, `checklist_evidence` (both hard). See section 7.
- Overlay Protocols: `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`. See section 7.

### Lineage process notes

- opus-1: no lock was acquired. Its config first carried the root `fanout` key and had it removed before synthesis. Graph upserts for iterations 1 to 4 were backfilled. A scratch file outside the lineage was written and then deleted.
- opus-3: terminal gates were recorded after the `synthesis_complete` row, which carries an earlier CONDITIONAL verdict. The registry gates and `review-verdict.cjs` (FAIL) are the record.
- opus-4: no convergence pass ran before iterations 1 and 2, and the coverage graph was seeded after iteration 2.
- The self-check pairs for the P1s are recorded in section 1 of this report only. No claim-adjudication rows were written at the fan-out root.

Review verdict: FAIL
