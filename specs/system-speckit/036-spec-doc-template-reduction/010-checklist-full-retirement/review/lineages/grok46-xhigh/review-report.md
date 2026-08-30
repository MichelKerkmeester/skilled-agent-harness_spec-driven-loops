# Review Report — Checklist Full Retirement (lineage grok46-xhigh)

Lineage: `fanout-grok46-xhigh-1788069812336-30nyvs`  
Target: `specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement` (spec-folder)  
Stop: `maxIterationsReached` (3/3). Maintainability was not executed. Convergence scores were telemetry only.

## 1. Executive Summary

- **Verdict:** CONDITIONAL
- **hasAdvisories:** false (P2 items are deferred; P1 items drive the verdict)
- **Active counts:** P0 0 · P1 5 · P2 3
- **Release readiness:** in-progress (D4 maintainability uncovered; no P0)
- **Scope:** Producer retirement, contract, read-paths, template/examples, evidence-rule id filter, fingerprint docset marker, and this packet's own completion claim. Memory-taxonomy `checklist` labels and the four symlinked repositories stay out of scope.

Production producers no longer emit `checklist.md`. The remaining required work is stale tests (F001–F003), leftover template/example pointers (F006), and this packet's Complete claim against an unchecked merged verification section (F007).

## 2. Planning Trigger

`/speckit:plan` is required. Five active P1 findings block PASS. Do not open a changelog-only close-out.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": ["F001", "F002", "F003", "F004", "F005", "F006", "F007", "F008"],
  "remediationWorkstreams": [
    "Retarget stale unit and integration tests to the retired contract",
    "Remove leftover template and example checklist.md pointers",
    "Reconcile this packet Complete claim with merged verification CHK items"
  ],
  "specSeed": [
    "Record that standalone checklist.md is gone from templates and examples, not only from upgrade-level.sh and spec-kit-docs.json",
    "Decide whether leftover tasks.md CHK template rows on this packet are in-scope for completion evidence"
  ],
  "planSeed": [
    "T-test-ac-coverage: retarget expect_source cases at scripts/tests/check-ac-coverage.sh:141-146",
    "T-test-level-contract: align optionalAddonDocs with spec-kit-docs.json:561",
    "T-test-integration: drop existsSync level-2/checklist.md at test-integration.vitest.ts:215",
    "T-docs-templates: delete checklist.md.tmpl rows from templates/README.md and example related-docs",
    "T-packet-chk: check or exclude merged verification CHK items so deriveStatus can match Complete"
  ],
  "findingClasses": {
    "F001": "test-isolation",
    "F002": "test-isolation",
    "F003": "test-isolation",
    "F004": "algorithmic",
    "F005": "cross-consumer",
    "F006": "class-of-bug",
    "F007": "matrix/evidence",
    "F008": "instance-only"
  },
  "affectedSurfacesSeed": [
    "producer/check-ac-coverage.sh",
    "consumer/check-ac-coverage tests",
    "producer/spec-kit-docs.json",
    "consumer/level-contract-resolver.vitest.ts",
    "producer/templates/examples",
    "consumer/test-integration.vitest.ts",
    "producer/templates/README.md",
    "producer/graph-metadata-parser.ts",
    "consumer/this packet tasks.md",
    "producer/validation-metadata.ts",
    "producer/memory-index-discovery.ts",
    "producer/plan.md"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

### P1

| ID | Title | Dimension | File:line | Class | Disposition |
|----|-------|-----------|-----------|-------|-------------|
| F001 | AC-coverage unit tests still assert the retired checklist.md fallback | correctness | `.opencode/skills/system-spec-kit/scripts/tests/check-ac-coverage.sh:141` | test-isolation | active |
| F002 | Level-contract vitest still expects checklist.md in optionalAddonDocs | correctness | `.opencode/skills/system-spec-kit/scripts/tests/level-contract-resolver.vitest.ts:32` | test-isolation | active |
| F003 | Integration vitest still requires deleted level-2 checklist.md example | correctness | `.opencode/skills/system-spec-kit/scripts/tests/test-integration.vitest.ts:215` | test-isolation | active |
| F006 | Templates README and worked examples still point at deleted checklist.md | traceability | `.opencode/skills/system-spec-kit/templates/README.md:105` | class-of-bug | active |
| F007 | Packet verification checkboxes are unchecked while Status is Complete | traceability | `specs/.../010-checklist-full-retirement/tasks.md:124` | matrix/evidence | active |

**F001** — Evidence: `_ac_traceability_file` returns only `tasks.md` with a protocol anchor (`check-ac-coverage.sh:84-92`); `expect_source` still wants `checklist.md` at 141-146. T011 is marked complete on the old return. Impact: default suite disagrees with REQ-005. Fix: retarget those cases to none/tasks.md and rewrite T011. scopeProof: no later fallback function through EOF of `_ac_traceability_file`. Surfaces: producer/check-ac-coverage.sh, consumer/check-ac-coverage tests, packet/tasks.md T011.

**F002** — Evidence: live `spec-kit-docs.json:561-563` lists only `acceptance-criteria.md`; `level-contract-resolver.vitest.ts:32` still expects both docs; `scaffold-golden-snapshots.vitest.ts:136-148` asserts absence. Impact: two tests in one suite encode opposite contracts. Fix: align the resolver test with the golden snapshot. Surfaces: producer/spec-kit-docs.json, consumer/level-contract-resolver.vitest.ts.

**F003** — Evidence: `existsSync(.../level-2/checklist.md)` must be true; `templates/**/checklist.md*` is empty. Impact: integration vitest cannot pass after example deletion. Fix: drop the assertion or retarget to tasks.md verification sections. Surfaces: producer/templates/examples, consumer/test-integration.vitest.ts.

**F006** — Evidence: README tree and key-files still list `addons/checklist.md.tmpl`; examples still say `See checklist.md` (`level-2/spec.md:195` and siblings). Impact: an author following template docs would recreate the retired document. Fix: delete those rows and retarget related-docs to tasks.md. Surfaces: producer/templates/README.md, consumer/templates/examples.

**F007** — Evidence: `extractMergedVerification` spans `ANCHOR:protocol` through `ANCHOR:summary` (`graph-metadata-parser.ts:1298-1307`) and includes CHK-001..CHK-051 all `[ ]`. `evaluateChecklistCompletion` returns INCOMPLETE; deriveStatus is `in_progress` (`:1263-1266`) while spec.md Status is Complete. Impact: this packet's completion claim would not survive a re-derive. Fix: check the items this packet used, or stop the slice at `/ANCHOR:protocol`. Surfaces: producer/graph-metadata-parser.ts, consumer/this packet tasks.md.

### P2

| ID | Title | Dimension | File:line | Class | Disposition |
|----|-------|-----------|-----------|-------|-------------|
| F004 | checklistFromFilePath uses a substring match not a path segment | security | `.opencode/skills/system-spec-kit/mcp-server/lib/search/validation-metadata.ts:111` | algorithmic | active |
| F005 | Level discovery still treats sibling checklist.md as a Level-2 signal | security | `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-index-discovery.ts:255` | cross-consumer | active |
| F008 | Plan still describes a pre-merge checklist fallback the live rule removed | traceability | `specs/.../010-checklist-full-retirement/plan.md:82` | instance-only | active |

## 4. Remediation Workstreams

1. **Stale test surface (P1, F001–F003)** — Retarget AC-coverage unit cases, the level-contract optionalAddonDocs expectation, and the integration existsSync assertion. Uncheck or rewrite T009/T011 evidence rows that cite the old behavior.
2. **Template doc drift (P1, F006)** — Remove `checklist.md.tmpl` from `templates/README.md` and example related-docs / examples README. Same class: every remaining `See checklist.md` pointer under `templates/examples/`.
3. **Packet completion evidence (P1, F007)** — Either mark the merged verification CHK items that apply, or change `extractMergedVerification` so leftover template CHK rows do not veto Complete.
4. **Advisories (P2)** — Bound `checklistFromFilePath` to a path segment; drop or retarget the sibling `checklist.md` level heuristic; rewrite plan.md architecture to the shipped tasks.md-only resolver.

## 5. Spec Seed

- Add an explicit non-goal vs in-scope split: standalone `checklist.md` file retirement is in scope; leftover `See checklist.md` strings in templates/examples are in-scope documentation debt, not optional polish.
- Record that this packet's own merged verification section currently makes `deriveStatus` `in_progress` despite table Status Complete.
- Keep memory-taxonomy `checklist` labels and checklist-as-pattern (CHK- ids, protocol anchors) as operator-accepted leftovers unless a follow-on packet takes them.

## 6. Plan Seed

- Retarget `scripts/tests/check-ac-coverage.sh` expect_source cases 141-146.
- Align `level-contract-resolver.vitest.ts:32` with `spec-kit-docs.json:561`.
- Remove `test-integration.vitest.ts:215` existsSync for level-2/checklist.md.
- Edit `templates/README.md:105,141` and example related-docs (`level-2/spec.md:195`, `level-3/spec.md:271`, `level-3+/spec.md:381`, matching tasks.md, `examples/README.md:68`).
- Reconcile `tasks.md` CHK checkboxes with `evaluateChecklistCompletion` or narrow `extractMergedVerification`.
- Optional: `validation-metadata.ts:111` segment match; `memory-index-discovery.ts:255` heuristic; `plan.md:82` architecture sentence.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence | Unresolved drift |
|----------|--------|----------|------------------|
| spec_code | partial | REQ-001 producer pass (`upgrade-level.sh` has no checklist string; `spec-kit-docs.json` has 0 checklist hits; `CANONICAL_PACKET_DOCS` omits checklist.md). REQ-002 fingerprint skip pass (`generated-metadata-integrity.ts:168`, `SOURCE_FINGERPRINT_DOCSET=2`). REQ-005 live resolver pass; tests and plan.md lag (F001, F008). | F001–F003, F006, F008 |
| checklist_evidence | fail | T011 marked complete on `check-ac-coverage.sh:125` returning checklist.md (live code does not). This packet's CHK items are unchecked while Status is Complete (F007). | F001, F007, T011 |

**AC_COVERAGE:** disabled — `validate.sh` was not run (lineage write-containment). Covered/total: UNKNOWN. Floor: UNKNOWN.

### Overlay Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| skill_agent | notApplicable | Target type is spec-folder, not a skill |
| agent_cross_runtime | notApplicable | Target type is spec-folder, not an agent |
| feature_catalog_code | notApplicable | No feature-catalog artifact in this packet (glob 0) |
| playbook_capability | notApplicable | No playbook artifact in this packet (glob 0) |

## 8. Deferred Items

- F004, F005, F008 (P2 advisories).
- Maintainability (D4) not executed: iteration ceiling 3 with stopPolicy max-iterations. Would have covered comment/docs quality beyond F006/F008 and whether stale tests are already in the accepted 13-fail baseline.
- Remaining `specs/**/checklist.md` under `app-mobile-cli/` treated as symlink-out-of-scope.
- Memory MCP `memory_match_triggers` timed out this lineage; no memory save (`generate-context.js` forbidden).
- Coverage-graph upsert skipped (would write outside the lineage).

## Dimension Expansion Map

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none
- Pivot lineage: none
- Selected directions: correctness → security → traceability
- Remaining frontier: maintainability (not executed)

This section records breadth only. It does not change the Executive Summary verdict.

## 9. Search Ledger

- hasSearchDebt: false
- graphCoverageMode: graphless_fallback
- candidateCoverage: covered=classification, completion_claim, path_confinement, spec_code_drift, state_transition; ruledOut=path_confinement (REQ-002 skip), producer_write; deferred=none; blocked=none
- searchDebt: none
- Ruled-out: fingerprint skip is the documented SOURCE_FINGERPRINT_DOCSET marker (`generated-metadata-integrity.ts:168`); no remaining production writer of checklist.md under system-spec-kit scripts/templates
- cleanSearchProof: iteration 2 path_confinement ruled_out with evidence at generated-metadata-integrity.ts:168

## 10. Audit Appendix

### Convergence

- stopPolicy: max-iterations (3). Last 3 newFindingsRatio values: 1.00 → 1.00 → 1.00 (telemetry only; did not stop the loop).
- convergenceScore: 0.00. graphDecision: CONTINUE (upsert skipped: write-containment).
- Stop reason: maxIterationsReached. D4 maintainability uncovered, so dimensionCoverageGate would have vetoed a convergence STOP.

### Coverage

- Dimensions covered: correctness, security, traceability (3/4 = 0.75).
- Iterations: 3. Open findings: 8. Resolved: 0. Corruption: 0.
- resource_map_present: false at init — Resource Map Coverage Gate section omitted by contract.

### Adversarial re-read (active P1)

- F001 Hunter: tests pin a removed read-path. Skeptic: may already sit in the accepted 13-fail baseline. Referee: keep P1 — T011 is checked complete on the old behavior, so packet evidence is false even if CI already fails.
- F002 Hunter: contract test vs live manifest. Skeptic: file might not be collected. Referee: keep P1 — golden-snapshot test in the same suite asserts the opposite; one of them is wrong.
- F003 Hunter: existsSync on a deleted example. Skeptic: same baseline. Referee: keep P1 — retirement deleted the file the test still requires.
- F006 Hunter: README would recreate the template. Skeptic: operators follow spec-kit-docs.json only. Referee: keep P1 — README is the human contract next to the deleted file.
- F007 Hunter: deriveStatus would be in_progress. Skeptic: checklist-as-pattern was declared out of scope for the retirement. Referee: keep P1 — this review's target is the packet, and the packet claims Complete.

No P0. No severity upgrades or downgrades.

### Ruled-out claims

- Remaining production producer of checklist.md: not found.
- Fingerprint skip as an integrity bypass: rejected; it is REQ-002.
- collectPacketDocs path traversal: rejected; closed relative-path list plus path.join.
- upgrade-level.sh symlink delete of checklist.md: N/A; script has no checklist string.

### Sources reviewed

upgrade-level.sh; spec-kit-docs.json; template-structure.js; check-evidence.sh; check-ac-coverage.sh (rule + tests); graph-metadata-parser.ts; generated-metadata-integrity.ts; validation-metadata.ts; memory-index-discovery.ts; level-contract-resolver.vitest.ts; scaffold-golden-snapshots.vitest.ts; test-integration.vitest.ts; templates/README.md and examples; packet spec.md, plan.md, tasks.md, acceptance-criteria.md, implementation-summary.md.

### Cross-reference appendix

Core: spec_code=partial, checklist_evidence=fail. Overlay: skill_agent=notApplicable, agent_cross_runtime=notApplicable, feature_catalog_code=notApplicable, playbook_capability=notApplicable.
