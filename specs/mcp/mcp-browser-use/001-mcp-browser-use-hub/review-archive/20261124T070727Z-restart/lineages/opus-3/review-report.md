# Review Report: mcp-browser-use hub (lineage opus-3)

Session `fanout-opus-3-1795495435655-lf6jf3`, generation 1, lineageMode new. Executor: cli-claude-code `claude-opus-5-5`, run inline. Seven iterations, stop reason `maxIterationsReached`.

## 1. Executive Summary

- **Overall verdict: FAIL**. No P0 exists. The FAIL comes from a required quality gate still failing at the terminal stop: `terminal-gates.cjs` reports evidence pass, scope pass, **coverage fail** (`traceability-incomplete`), because the hard core protocol `checklist_evidence` stayed partial through iteration 7. On findings alone the verdict would be CONDITIONAL (two active P1).
- hasAdvisories: false. The flag only applies to PASS.
- Active counts the verdict used (from `review-verdict.cjs` over the registry): **P0 0, P1 2, P2 8**, `failed_required_gate_ids: ["coverage"]`
- Self-check outcomes: the adversarial self-check reread both P1s and confirmed both at P1, with no downgrades and no false positives. R1-P1-001: the `_utils.sh` diff is still 8 lines. R2-P1-001: `mcp-bladebro/SKILL.md:60` is unchanged. R7-P2-001 refines R6-P2-001, and the registry keeps them as one entry.
- Review scope: spec folder `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (phases 001-013), plus the 470 shipped files in `review-scope-files.txt`.
- Operator review focus: every phase's shipped work against its goal criteria
- Headline: most phase goal criteria still reproduce on the current tree. That covers the registry counts, stale-path greps, parent-skill checks, the mutation guard, playbook and catalog validators, recorded-run tallies and all six recorded two-stage routing requests. Two P1s remain. Phase 013 broke phase 003's installer-test criterion. Bladebro's lane rule offers an ungated `npx -y` install that its own R-SEC-3 forbids.

## 2. Planning Trigger

`/speckit:plan` is required: a failed coverage gate plus two active P1 findings. The coverage gate clears once the goal-state drifts behind `checklist_evidence` are reconciled (WS-5) and a follow-up review records the protocol as pass.

```json
{
  "Planning Packet": true,
  "triggered": true,
  "verdict": "FAIL",
  "failedRequiredGateIds": ["coverage"],
  "hasAdvisories": false,
  "activeFindings": [
    {"id": "R1-P1-001", "severity": "P1", "dimension": "correctness", "file": ".skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/_utils.sh:160", "findingClass": "regression"},
    {"id": "R2-P1-001", "severity": "P1", "dimension": "security", "file": ".skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md:60", "findingClass": "security-contract-contradiction"},
    {"id": "R1-P2-002", "severity": "P2", "dimension": "correctness", "file": "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/003-mode-relocation/goal.md:58", "findingClass": "traceability-drift"},
    {"id": "R1-P2-003", "severity": "P2", "dimension": "correctness", "file": "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/005-routing-and-surfaces/goal.md:59", "findingClass": "traceability-drift"},
    {"id": "R2-P2-002", "severity": "P2", "dimension": "security", "file": ".skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/install.sh:28", "findingClass": "supply-chain-hardening"},
    {"id": "R3-P2-001", "severity": "P2", "dimension": "traceability", "file": "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/011-bdg-eval-port-note/goal.md:56", "findingClass": "non-durable-criterion"},
    {"id": "R3-P2-002", "severity": "P2", "dimension": "traceability", "file": "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md:146", "findingClass": "template-residue"},
    {"id": "R4-P2-001", "severity": "P2", "dimension": "maintainability", "file": ".skilled/skills/mcp-browser-use/mcp-chrome-devtools/changelog/v1.0.27.0.md:1", "findingClass": "release-history-drift"},
    {"id": "R5-P2-001", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/2026-11-21--two-stage-replay--compiled/results.csv:5", "findingClass": "brittle-acceptance-evidence"},
    {"id": "R6-P2-001", "severity": "P2", "dimension": "traceability", "file": "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/005-routing-and-surfaces/tasks.md:67", "findingClass": "understated-known-limitation", "refinedBy": "R7-P2-001"}
  ],
  "remediationWorkstreams": [
    {"id": "WS-1", "priority": "P1", "findings": ["R1-P1-001"], "title": "Restore helper lockstep and rerun the installer test"},
    {"id": "WS-2", "priority": "P1", "findings": ["R2-P1-001"], "title": "Gate or pin the Bladebro npx fallback under R-SEC-3"},
    {"id": "WS-3", "priority": "P2", "findings": ["R2-P2-002", "R4-P2-001"], "title": "Chrome DevTools and Aside version pin and release history"},
    {"id": "WS-4", "priority": "P2", "findings": ["R5-P2-001", "R6-P2-001"], "title": "Routing vocabulary: tie-break recall and out-of-domain alias leak"},
    {"id": "WS-5", "priority": "P2", "findings": ["R1-P2-002", "R1-P2-003", "R3-P2-001", "R3-P2-002"], "title": "Goal-state and handoff-table reconciliation"}
  ],
  "specSeed": ["Fix-up packet under the hub epic covering WS-1 to WS-5", "Acceptance: node --test .skilled/bin/tests/mcp-installers.test.cjs exits 0", "Acceptance: rg 'npx -y bladebro' in mcp-bladebro/SKILL.md prints no ungated line"],
  "planSeed": ["Align mcp-code-mode/scripts/_utils.sh to Node 20 or record a split decision and update the test", "Amend Bladebro SKILL.md:60 and 004 spec/research lane text", "Pin browser-debugger-cli to 0.6.10", "Cut Chrome DevTools and Aside releases for 013's changes", "Reconcile 003/004/005/011 goal boxes and parent handoff row 006->007"],
  "findingClasses": ["regression", "security-contract-contradiction", "supply-chain-hardening", "release-history-drift", "brittle-acceptance-evidence", "understated-known-limitation", "traceability-drift", "non-durable-criterion", "template-residue"],
  "affectedSurfacesSeed": [".skilled/skills/mcp-code-mode/scripts/_utils.sh", ".skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/", ".skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md", ".skilled/skills/mcp-browser-use/mode-registry.json", ".skilled/skills/mcp-browser-use/hub-router.json", ".skilled/skills/mcp-browser-use/graph-metadata.json", ".skilled/skills/mcp-browser-use/mcp-chrome-devtools/changelog/", ".skilled/skills/mcp-browser-use/mcp-aside-devtools/changelog/", "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md", "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/00{3,4,5}-*/goal.md", "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/011-bdg-eval-port-note/goal.md"],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

| ID | Sev | Dimension | File:line | Evidence | Impact | Fix recommendation | Disposition | findingClass | scopeProof | affectedSurfaceHints |
|----|-----|-----------|-----------|----------|--------|--------------------|-------------|--------------|------------|----------------------|
| R1-P1-001 | P1 | correctness | `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/_utils.sh:160` | `mcp-installers.test.cjs:49-55` fails "both copies identical". The Chrome copy defaults Node to 20 while `mcp-code-mode/scripts/_utils.sh:160` defaults to 18. Changed by 013 T008 (`013-.../tasks.md:50`). | 003 goal criterion 4 is false. The guard test is red. | Change both copies together, or record the split and update the test. Add the suite to 013-style verification. | open | regression | diff has 2 hunks (160, 164) | both `_utils.sh`, the test |
| R2-P1-001 | P1 | security | `.skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md:60` | Line 60 offers `npx -y bladebro mcp` when the binary is missing. R-SEC-3 (line 116) forbids implicit install and requires the v4.8.2 pin and a SHA-256 check. `references/mcp-wiring.md:44` concedes it needs an operator yes. | An agent with no binary runs an unpinned, unverified package. | Drop the npx alternative, or gate it on an operator yes and `bladebro@4.8.2`. Amend `004/spec.md:82` and `research.md:57`. | open | security-contract-contradiction | only npx mentions: SKILL.md:60 (ungated), mcp-wiring.md:44 (gated) | Bladebro SKILL lane rule, 004 spec |
| R1-P2-002 | P2 | correctness | `003-mode-relocation/goal.md:58` | 003 goal lines 58-62 and 004 goal lines 59-63 are all `[ ]`. The parent map says Complete. | Goal state unreadable. | Tick the criteria that hold. Leave 003 c4 open until R1-P1-001 is fixed. | open | traceability-drift | 10 open boxes | 003/004 goal.md |
| R1-P2-003 | P2 | correctness | `005-routing-and-surfaces/goal.md:59` | The `[x]` criterion says mcp-tooling routes for none of the requests, but `scratch/after-stage1.jsonl:1-3` shows `mcp_tooling_passing: true`. | The ticked box overstates the phase. | Qualify the criterion with "at the default threshold", or untick it. | open | traceability-drift | 3/3 rows passing | 005 goal |
| R2-P2-002 | P2 | security | `mcp-chrome-devtools/scripts/install.sh:28` | `browser-debugger-cli@alpha` here, in SKILL.md:61, INSTALL-GUIDE and `troubleshooting.md:163` (`sudo`). The docs are aligned to 0.6.10. | A moving pre-release can diverge from the corrected docs. | Pin `browser-debugger-cli@0.6.10`. | open | supply-chain-hardening | only `@alpha` forms | Chrome install surfaces |
| R3-P2-001 | P2 | traceability | `011-bdg-eval-port-note/goal.md:56` | The criterion expects `rg -c` to print 3. It prints 5 after 013. The parent `spec.md:151` row uses the same check. | The criterion cannot be re-run as proof. | Use a presence check, for example `rg -q` on the heading at `troubleshooting.md:467`. | open | non-durable-criterion | count 5 | 011 goal, parent handoff |
| R3-P2-002 | P2 | traceability | `spec.md:146` | `[Criteria TBD] \| [Verification TBD]` for 006→007. | The handoff is undefined. | Fill in the row. | open | template-residue | only TBD row | parent spec |
| R4-P2-001 | P2 | maintainability | `mcp-chrome-devtools/changelog/v1.0.27.0.md:1` | 013 edited 011's published note in place. It changed 36 Chrome files, including install, utils and doctor, and 21 Aside files, with no new versions. | Version-to-content mapping is broken. Users can't tell the installer changed. | Cut Chrome DevTools 1.0.28.0 and Aside 1.1.13.0 entries. | open | release-history-drift | commit stat: modified, not added | both changelogs |
| R5-P2-001 | P2 | correctness | `benchmark/reports/.../results.csv:5` | Tie-breaks pass at 0.8255 and 0.8298 against a 0.8 floor. Paraphrases ("fill out the form in my signed-in account", "browse this site without getting flagged as a bot") return nothing. | The objective is proven only on tuned strings. | Widen the tie-break vocabulary and add paraphrase rows to the benchmark. | open | brittle-acceptance-evidence | live replay | graph-metadata, hub-router, benchmark |
| R6-P2-001 (+R7-P2-001) | P2 | traceability / security | `005-routing-and-surfaces/tasks.md:67`; `mode-registry.json:116` | 4 of 8 out-of-domain phrases return the hub above 0.8 (0.82, 0.82, 0.8864, 0.9129), but T020 mentions only the two at 0.82. `rb status`/`rb attach` route "rb status of the ruby build" (0.8229) and "check rb attach logs in the deploy" (0.8452) to `mcp-bladebro`. R-SEC-1 still gates the rb lane. | Mis-routing has reach at the must-load floor. The note understates it. | Correct the T020 note. Tighten or drop the generic aliases `aside`, `lighthouse`, `har`, `performance trace`, `rb status` and `rb attach`. | open | understated-known-limitation / alias-overreach | 8 + 4 live probes | 005 tasks, registry, hub-router, graph-metadata |

## 4. Remediation Workstreams

1. **P1 — WS-1:** restore `_utils.sh` lockstep. Acceptance: `node --test .skilled/bin/tests/mcp-installers.test.cjs` exits 0. (R1-P1-001)
2. **P1 — WS-2:** remove or gate the `npx -y bladebro mcp` fallback in SKILL.md, the 004 spec and research. (R2-P1-001)
3. P2 advisories:
   - WS-3: pin bdg and cut the missing releases. (R2-P2-002, R4-P2-001)
   - WS-4: routing vocabulary recall and out-of-domain aliases. (R5-P2-001, R6-P2-001)
   - WS-5: goal-state, handoff-row and criterion durability fixes. (R1-P2-002, R1-P2-003, R3-P2-001, R3-P2-002)

## 5. Spec Seed

- Open a fix-up child under the hub epic. Scope: the WS-1 and WS-2 surfaces, plus the WS-3 to WS-5 advisories.
- Requirement: shared helper copies change in lockstep, or a recorded decision splits them.
- Requirement: every Bladebro transport path honors R-SEC-3. No unpinned or unverified launch without an operator yes.
- Requirement: goal criteria use presence checks, not equality counts on files that later phases edit.

## 6. Plan Seed

1. Edit `mcp-code-mode/scripts/_utils.sh:160,164` to match the Chrome copy (or record the split). Run `mcp-installers.test.cjs`.
2. Amend `mcp-bladebro/SKILL.md:60`, `004-bladebro-mode/spec.md:82` and `001-research/research/research.md:57`.
3. Pin `browser-debugger-cli@0.6.10` in `install.sh`, SKILL.md, INSTALL-GUIDE and troubleshooting.
4. Add Chrome DevTools and Aside changelog entries for 013's changes.
5. Correct the T020 note. Review the generic aliases. Add paraphrase and negative rows to the routing benchmark.
6. Reconcile the goal boxes in 003, 004, 005 and 011, and fill parent `spec.md:146`.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| spec_code | pass (latest), partial earlier | Iterations 3, 5 and 7 pass: 006-010 and 013 criteria reproduce, 001 criteria hold, routing replays 6/6, and R-SEC-1 gates after routing. Iterations 1 and 2 are partial (R1-P1-001, R2-P1-001). |
| checklist_evidence | partial | 003/004 boxes are unticked under Complete. 005's goal is fully ticked while its spec says Partial. 011's count drifted. The 006→007 handoff is TBD. |

### Overlay Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| playbook_capability | pass | Each mode has a recorded run. Tallies match the goals (Bladebro 4/1, Aside 10/5). |
| feature_catalog_code | pass | The Bladebro catalog validator reports 0 violations. Packet versions match their newest changelog entries. |
| skill_agent | notApplicable | The hub ships no agent definitions. |
| agent_cross_runtime | not run | Not exercised in this lineage. |

AC_COVERAGE: not computed. `validate.sh` is barred inside the lineage. Parent goal criterion 7 and the `validate.sh --recursive` criteria in 009-013 are **unverified** here, neither passed nor failed.

## 8. Deferred Items

- Whether bladebro 4.8.2 runs npm lifecycle scripts before `install.sh` verifies the digest (needs network).
- 007's "changelog coverage check prints 0 uncovered", which names no script and was not rerun.
- The `validate.sh --strict --recursive` criteria (parent c7, 009-013), barred by the lineage contract.
- No frontier object (default depth mode).

## Dimension Expansion Map

- Saturated directions: none recorded. Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Coverage order: correctness (1, 5), security (2, 7), traceability (3, 6), maintainability (4).
- Remaining frontier: none recorded.

## 9. Search Ledger

*No search-depth state captured (legacy v1 record)*

hasSearchDebt: false (registry `searchDebt` is empty).

## 10. Audit Appendix

- Convergence: newFindingsRatio by iteration was 1.0, 0.462, 0.133, 0.063, 0.059, 0.056, 0.026. Dimension coverage reached 4/4 at iteration 4. `checklist_evidence` stayed partial, so the coverage gate held and the stop reason is `maxIterationsReached` at 7/7.
- Terminal gates (recorded late, after the `synthesis_complete` row, because the stop branch's `record_terminal_gates` step was first skipped and then run at closeout): evidence pass, scope pass, coverage fail. The `synthesis_complete` ledger row carries the earlier CONDITIONAL verdict. The ledger is append-only, so the registry's `terminalGates` plus `review-verdict.cjs` (FAIL) are the record.
- Registry note: R7-P2-001 was recorded with `refines: R6-P2-001`, so the registry folds both into one P2 entry carrying R7's title on R6's file. The two defects (understated REQ-009 note, `rb` alias overreach) are described separately in section 3.
- Ruled out: stale mcp-tooling browser paths, browser ids in mcp-tooling's root files, embedded secrets, debug-port exposure, `eval` of caller-supplied ops, Aside's vendor installer, recorded-run tally mismatches, leftover positional-JSON `bdg cdp` calls, advisor drift on the recorded corpus, out-of-domain leak regression since 005, duplicate changelog trees, and a route-to-real-browser escalation.
- Sources: see each `iterations/iteration-00N.md` "Files Reviewed". The commands rerun include `parent-skill-check.cjs` (hub, mcp-tooling, sk-code), `check-mcp-mutation-class.sh` and its test, `mcp-installers.test.cjs`, `validate-playbook-package.cjs` ×3, `validate_catalog_package.py`, `verify-router-sync.cjs` and `skill-advisor.cjs advisor_recommend`.
