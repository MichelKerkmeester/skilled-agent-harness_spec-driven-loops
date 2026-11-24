# Deep Review Report - mcp-browser-use hub epic (fan-out lineage opus-4)

## 1. Executive Summary

- Overall verdict: **FAIL**. hasAdvisories: false (the verdict is not PASS).
- Counts the verdict used: P0 = 0, P1 = 0, P2 = 5 (`review-verdict.cjs` over this lineage's registry and state log).
- Why FAIL with no P0/P1: the terminal `coverage` gate failed with reason `traceability-incomplete`. The hard core protocol `checklist_evidence` stayed `partial` from iteration 3 to 7, because the 003 and 004 goal and closure records disagree with the shipped tree (O4-I3-P2-001, O4-I3-P2-002). The verdict comes from the gate, not from finding severity. Fixing those two findings is what clears the gate.
- This report does not decide release. The fan-out root merge recomputes the verdict from every lineage's registry.
- Self-check: no P0 or P1 candidate was raised, so Hunter/Skeptic/Referee did not run. Iteration 7 re-examined all five P2s for a P1 upgrade and kept each at P2.
- Review scope: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder, 13 phase children). 470 pre-bound files: 277 hub files, 75 packet docs, and the routing, advisor, mcp-tooling and doc surfaces.
- Operator review focus: every phase's shipped work against its goal criteria.
- Headline: the shipped work meets every goal criterion that could be re-run read-only. Parent criteria 1-3, 5 (stage two) and 6 hold, and so do the machine criteria of 003, 004, 005, 008, 009, 010 and 013. The prior generation's P1 fixes hold too (router reject only on the `forbidden` constraint, Bladebro teardown confirmation, superseding routing run). The open findings are packet-doc state that has not caught up with the tree, plus one stale example.

## 2. Planning Trigger

`/speckit:plan` is required: the verdict is FAIL because a required gate failed. The remediation is small doc work.

```json
{
  "label": "Planning Packet",
  "triggered": true,
  "verdict": "FAIL",
  "hasAdvisories": false,
  "stopReason": "maxIterationsReached",
  "releaseReadinessState": "in-progress",
  "failedRequiredGateIds": ["coverage"],
  "activeFindings": [
    {"id": "O4-I3-P2-001", "severity": "P2", "dimension": "traceability", "file": "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/003-mode-relocation/acceptance-criteria.md:94"},
    {"id": "O4-I3-P2-002", "severity": "P2", "dimension": "traceability", "file": "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/004-bladebro-mode/goal.md:21"},
    {"id": "O4-I3-P2-003", "severity": "P2", "dimension": "traceability", "file": "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md:146"},
    {"id": "O4-I3-P2-004", "severity": "P2", "dimension": "traceability", "file": "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md:17"},
    {"id": "O4-I4-P2-001", "severity": "P2", "dimension": "maintainability", "file": ".skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/repl-evidence-capture.sh:12"}
  ],
  "remediationWorkstreams": [
    "WS1 clear the coverage gate: reconcile 003 closure/goal/continuity and 004 goal state with the shipped tree (O4-I3-P2-001, O4-I3-P2-002)",
    "WS2 parent packet hygiene: fill the 006-to-007 handoff row and refresh parent continuity (O4-I3-P2-003, O4-I3-P2-004)",
    "WS3 Aside example default path (O4-I4-P2-001)"
  ],
  "specSeed": [
    "003-mode-relocation: closure statement Closeable Yes, goal criteria checked with evidence, continuity updated",
    "004-bladebro-mode: goal criteria checked with the iteration-1 evidence",
    "parent spec.md: handoff row for 006 to 007; parent spec/goal continuity at completion"
  ],
  "planSeed": [
    "Edit 003 acceptance-criteria.md closure anchor, goal.md completion and log rows, implementation-summary.md continuity",
    "Edit 004 goal.md completion anchor and continuity",
    "Edit parent spec.md:146 and the parent spec/goal _memory.continuity blocks",
    "Change repl-evidence-capture.sh default OUT_DIR to the session-relative ./tmp form with in-REPL fs checks, matching ASD-007; update examples/README.md 2.2",
    "Re-run validate.sh --strict --recursive and re-run this review's checklist_evidence protocol"
  ],
  "findingClasses": ["packet-doc state drift", "template residue", "continuity drift", "stale example after a verified fix"],
  "affectedSurfacesSeed": [
    "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/003-mode-relocation/{acceptance-criteria.md,goal.md,implementation-summary.md}",
    "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/004-bladebro-mode/goal.md",
    "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/{spec.md,goal.md}",
    ".skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/{repl-evidence-capture.sh,README.md}"
  ],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

| ID | Sev | Dimension | File:line | Evidence and impact | Fix | Class / scope / surfaces |
|----|-----|-----------|-----------|---------------------|-----|--------------------------|
| O4-I3-P2-001 | P2 | traceability | `003-mode-relocation/acceptance-criteria.md:94` | AC-002 row is Met (`:60`) and the rg pair prints nothing on the current tree (iteration 1). The closure anchor still says "Closeable: No / AC-002 is unmet" (`:92-94`). goal.md logs "Criterion 2 Unmet" (`:87`) with all five criteria unchecked (`:58-62`). implementation-summary.md keeps completion_pct 90 and next_safe_action "Await operator choice on AC-002" (`:14,35`). A resume of 003 would reopen finished work. AC_CLOSURE reads only the rows, so validation passes; only the prose is stale | Set the closure statement to Yes, check the goal criteria with evidence, and update the continuity | packet-doc state drift / 003 docs only / closure anchor, goal, summary |
| O4-I3-P2-002 | P2 | traceability | `004-bladebro-mode/goal.md:21` | All five criteria are unchecked and continuity reads "Authored the durable directive", completion_pct 0. Every criterion holds (iteration 1), and the parent binds this goal as authoritative | Check the criteria with evidence and refresh the continuity | packet-doc state drift / 004 goal.md / completion anchor, continuity |
| O4-I3-P2-003 | P2 | traceability | `spec.md:146` | The 006 to 007 handoff row still reads "[Criteria TBD] / [Verification TBD]" in a packet marked Complete | Name the criterion and its verification command | template residue / one row / handoff table |
| O4-I3-P2-004 | P2 | traceability | `spec.md:17` | Parent spec.md and goal.md continuity: last_updated 2026-11-21T12:30Z, completion_pct 0, next_safe_action "Start 002-hub-scaffold" (`spec.md:14-24`, `goal.md:14-24`), while the status says Complete | Refresh both continuity blocks | continuity drift / parent frontmatter / spec.md, goal.md |
| O4-I4-P2-001 | P2 | maintainability | `mcp-aside-devtools/examples/repl-evidence-capture.sh:12` | The default `OUT_DIR=/tmp/aside-evidence` is the form the example's own README (`examples/README.md:51`) says fails on Aside 1.26.626.1517. The playbook's ASD-007 already uses `./tmp/` plus in-REPL `fs` checks and passed live. A no-argument run fails its own artifact check | Adopt the ASD-007 form in the script and the README | stale example after a verified fix / one script + README row |

## 4. Remediation Workstreams

1. P0: none. P1: none.
2. WS1, gate-clearing (P2, needed for the coverage gate): O4-I3-P2-001, then O4-I3-P2-002.
3. WS2, parent hygiene (P2 advisories): O4-I3-P2-003, O4-I3-P2-004.
4. WS3, example (P2 advisory): O4-I4-P2-001.

## 5. Spec Seed

- 003: the closure statement, goal criteria and continuity record AC-002 as met. cite-drift-redirects.json already carries the moved path.
- 004: the goal criteria record the evidence that 004's own implementation summary and iteration 1 of this review hold.
- Parent: a real 006 to 007 handoff gate (for example, the 007 goal's guard and changelog checks), and continuity set at program completion.

## 6. Plan Seed

- T1: Edit the 003 closure anchor, goal completion and log, and implementation-summary continuity.
- T2: Edit the 004 goal completion anchor and continuity.
- T3: Edit parent spec.md:146 and both parent continuity blocks.
- T4: Switch repl-evidence-capture.sh to the ASD-007 path form and update README 2.2.
- T5: Run `validate.sh --strict --recursive` on the packet, then re-review checklist_evidence.

## 7. Traceability Status

### Core Protocols
| Protocol | Gate | Final status | Iterations | Notes |
|----------|------|--------------|------------|-------|
| `spec_code` | hard | pass | 1-7 | Goal criteria re-run as written; R-SEC text matches the 004 spec verbatim; versions match their changelogs |
| `checklist_evidence` | hard | partial | 3, 5, 6, 7 | The 003 closure, goal and continuity and the 004 goal disagree with the shipped tree (O4-I3-P2-001/002). Tasks are open only where documented (004 manual check deferred to 006; 005 T020/T021 blocked with not-met notes) |

### Overlay Protocols
| Protocol | Status | Notes |
|----------|--------|-------|
| `skill_agent` | pass | The hub SKILL.md mode table names the three registry modes |
| `feature_catalog_code` | pass | Chrome catalog totals 31 with the Lighthouse leaf linked; the leaf defers tool names to list_tools/tool_info |
| `playbook_capability` | pass | Scenario files: Chrome 30, Aside 29, Bladebro 15, matching the 007/008 goals |
| `agent_cross_runtime` | notApplicable | No agent definition is in scope |

AC_COVERAGE: 003, 007 and 008 are Level 2 with acceptance-criteria.md. This review did not run the advisory rule because it writes outside the lineage. 003's rows are all Met.

## 8. Deferred Items

- Not independently re-run, because they write outside the lineage: stage-one advisor replay (parent criterion 5, 005 criterion 1, 013 criterion 1) and `validate.sh --strict --recursive` (parent criterion 7 and several children). Recorded evidence was relied on.
- 012's alignment evidence lives in a private, git-ignored location by design. It exists on this host but cannot be re-checked elsewhere.
- Seen and not re-raised, because the prior generation deferred them to the operator: C2-I1-P2-001 (bare `aside` substring makes "Aside from that, run lighthouse" an ordered bundle; still reproducible), C2-I2-P2-003 (`auto` rb lane attaches to any reachable endpoint), R2-P2-003 (Chrome `sudo npm` hint).
- The Bladebro digest constants are duplicated in install.sh and doctor.sh. They agree today; consolidate if a third copy appears.
- No frontier object in the registry: default depth mode.

## Dimension Expansion Map

- Saturated directions: none recorded by the reducer. Pivots: 0 completed, 0 failed, 0 audited overrides.
- Recovery passes: iteration 3 (traceability protocol replay) and iteration 7 (severity escalation), both after a STUCK_RECOVERY decision.
- Remaining frontier: none.

## 9. Search Ledger

*No search-depth state captured (legacy v1 record)*. The iteration records are unversioned and carry no searchLedger. Ruled-out directions are listed per iteration and in the Audit Appendix. hasSearchDebt: false.

## 10. Audit Appendix

- Convergence: 7 iterations, stop reason `maxIterationsReached`, blockedBy `dimensionCoverageGate`. New-findings ratios by iteration: 0, 0, 1.0, 0.2, 0, 0, 0. convergence.cjs returned STUCK_RECOVERY before iterations 3 and 7, and CONTINUE before 4, 5 and 6. Terminal gates: evidence pass, scope pass, coverage fail (`traceability-incomplete`).
- Coverage: all four dimensions covered (correctness 1, 5; security 2; traceability 3, 5, 6, 7; maintainability 4, 7).
- Ruled out: drift between the compiled-routing bundle and its copy (byte-identical); top-level await in Code Mode examples (the hits are Aside REPL snippets); teardown `rm -rf` on an arbitrary root (operator confirmation comes first); `eval` in Chrome `_utils.sh` (internal literals only); parent Complete against 005 Partial (the status line names the unmet requirements); stale stage-one tool (skill_advisor.py exists); dangling changelog links (none); P1 upgrade of the 003 closure drift (AC_CLOSURE reads rows that are Met).
- Sources: the parent and 13 child goal/spec/tasks/acceptance-criteria/implementation-summary docs; hub and mode registries; `compiled-route.cjs` (live replay of 6 prompts); the compiled-routing router and authored bundle; mutation manifest, pre-commit hook and guard; Bladebro, Aside and Chrome scripts, examples, references and playbooks; benchmark run folders; sk-code ROUTER.md:193; `compiled-route-sync.cjs --check`; `.skilled/changelog/mcp-browser-use/`; the system-spec-kit AC_CLOSURE contract.
- Fan-out: `step_fanout_merge` was skipped because this lineage config has no `fanout` key. The root merge owns cross-lineage results.
- Process deviations, disclosed:
  - No convergence pass ran before iterations 1-2.
  - The coverage graph (`graph-db/`, inside the lineage) was seeded after iteration 2.
  - Iteration 3's recovery_started row precedes its graph_convergence_evaluated row: the first graph payload was refused for its shape and re-sent after the fix.
  - A `sed -i ''` edit ran on the lineage's own helper `prompts/convev.cjs`. It is listed as a scope note in iteration 7. No file outside the lineage was modified.
  - `step_stage_artifact_dir` (git add) and `phase_save` (generate-context.js) were skipped under the lineage write limits.

Review verdict: FAIL
