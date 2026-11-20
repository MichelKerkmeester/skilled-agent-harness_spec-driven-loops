# Deep Review Report: confirmation of the OpenCode v1 removal fix commits

## 1. Executive Summary

- **Verdict: FAIL.** No P0 findings. The verdict is FAIL because the required `coverage` terminal gate failed at the stop (`traceability-incomplete`: the core `checklist_evidence` protocol finished `partial`). The one active P1 would by itself give CONDITIONAL.
- **hasAdvisories:** false (the verdict is not PASS).
- **Counts the verdict used** (`review-verdict.cjs` over the refreshed registry): active P0 = 0, active P1 = 1, active P2 = 2, search debt = 0, failed required gates = `coverage`.
- **Adversarial self-check:** DR-001-P1-001 was re-read against source and **confirmed** at P1: `003-v1-docs-and-playbooks-sweep/acceptance-criteria.md:89` reads `**Closeable:** No` and `:91` says every criterion is Unmet because the phase has not been implemented, while `:57` records AC-004 Met, `implementation-summary.md:133` says every row is Met or Superseded and `spec.md:23` says `Status: Complete`. No downgrades and no false positives, so no adjudication rows were appended.
- **Earlier findings** (from `070-opencode-v1-removal/review/review-report.md`): DR4-P1-001 resolved; DR3-P1-001 resolved at its two named sites but continued at a third site in the same file (DR-001-P1-001); DR1-P2-001, DR1-P2-002 (by recorded design plus a parity test), DR1-P2-003, DR2-P2-001, DR3-P2-002 and DR4-P2-001 resolved; DR3-P2-001 resolved as waiver rows, with the replacement commands filed as DR-001-P2-001.
- **Scope:** 42 files: the 39 files touched by 49edc61c95b, d857649d81c and 12dcc168817, plus the cross-references `.vibe/plugins/repo-guards/lib/hook-io.mjs`, `.opencode/plugins/session-cleanup.js` and the earlier review report. The generated `trigger-index.json` and retrieval fixtures were in scope but not reviewed by content (declared non-goal).
- **Run:** 1 iteration on executor cli-pi (model `deepseek-v4.1-flash-1017`, reasoning effort `max`, `PI_BLACKHOLE_PASSIVE=true`), stop policy `max-iterations`, stop reason `maxIterationsReached`. Generation 1, fresh lineage.

## 2. Planning Trigger

`/speckit:plan` **is required**: the verdict is FAIL, with one P1 and an incomplete core traceability protocol. The remediation is small (three doc edits in phase 003 and one script path fix).

```json
{
  "Planning Packet": true,
  "triggered": true,
  "verdict": "FAIL",
  "hasAdvisories": false,
  "activeFindings": [
    {"id": "DR-001-P1-001", "severity": "P1", "file": "specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/acceptance-criteria.md:89", "findingClass": "closure-metadata inconsistency", "refines": "DR3-P1-001"},
    {"id": "DR-001-P2-001", "severity": "P2", "file": "specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/acceptance-criteria.md:55", "findingClass": "checklist-evidence discipline", "refines": "DR3-P2-001"},
    {"id": "DR-001-P2-002", "severity": "P2", "file": "specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/tasks.md:72", "findingClass": "closure-metadata inconsistency"}
  ],
  "remediationWorkstreams": [
    "WS1 (P1): replace the scaffold closure statement in phase-003 acceptance-criteria.md section 3 with the real closure state",
    "WS2 (P2): make the ADR-001 replacement commands reproducible from one stated cwd, and drop the stale T023 trailing sentence"
  ],
  "specSeed": [
    "Phase 003 acceptance-criteria.md section 3 must agree with its own rows and with implementation-summary.md and spec.md"
  ],
  "planSeed": [
    "Rewrite 003/acceptance-criteria.md:89-91 to Closeable: Yes with the closing evidence",
    "Resolve both paths in 003/scratch/check-index-v1.py from __file__ or an explicit repo root, and state the cwd for the AC-002/AC-006 commands",
    "Remove 'T019 and AC-004 stay open.' from 003/tasks.md:72"
  ],
  "findingClasses": ["closure-metadata inconsistency", "checklist-evidence discipline"],
  "affectedSurfacesSeed": [
    "070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/acceptance-criteria.md",
    "070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/check-index-v1.py",
    "070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/tasks.md"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

| ID | Sev | Dimension | file:line | Title |
|---|---|---|---|---|
| DR-001-P1-001 | P1 | traceability | `.../003-v1-docs-and-playbooks-sweep/acceptance-criteria.md:89` | Phase 003's acceptance file still declares the whole phase unimplemented and not closeable |
| DR-001-P2-001 | P2 | traceability | `.../003-v1-docs-and-playbooks-sweep/acceptance-criteria.md:55` | The ADR-001 replacement checks (AC-002, AC-006, AC-008) cannot be reproduced as written: they mix phase-folder-relative and repo-root-relative paths |
| DR-001-P2-002 | P2 | traceability | `.../003-v1-docs-and-playbooks-sweep/tasks.md:72` | T023's closure note still says "T019 and AC-004 stay open" |

**DR-001-P1-001.** *Evidence:* `acceptance-criteria.md:89,91` against `:57`, `implementation-summary.md:133`, `003/spec.md:23`, `070/spec.md:145`. *Impact:* a resume or closure run that reads section 3 concludes the phase was never implemented, while every other closure artifact says Complete. *Fix:* replace the scaffold answer with the real closure statement. *Disposition:* active, confirmed by the self-check. *scopeProof:* 12dcc168817 edited this file's waiver block but not section 3.

## 4. Remediation Workstreams

1. **WS1, P1, DR-001-P1-001 (fix first).** Rewrite the phase-003 closure statement so it agrees with the rows and the summary. This closes the last site of DR3-P1-001.
2. **WS2, P2 advisories.** DR-001-P2-001 (make the replacement commands run from one stated cwd; `check-index-v1.py:6-8` resolves one path from `__file__` and the other from cwd) and DR-001-P2-002 (drop the stale sentence in T023).

## 5. Spec Seed

- Phase 003's closure statement, rows, task notes and summary must state one closure state.
- A Superseded row's replacement command must run as printed from a stated working directory.

## 6. Plan Seed

- T1: rewrite `003/acceptance-criteria.md:89-91`.
- T2: fix the path resolution in `003/scratch/check-index-v1.py` and the cwd of the AC-002/AC-006 commands at `003/acceptance-criteria.md:55,59`.
- T3: remove the trailing sentence at `003/tasks.md:72`.

## 7. Traceability Status

**Core protocols**
- `spec_code`: **pass**. `001/implementation-summary.md:112` records the four code fixes, and the code matches at `session-cleanup.mjs:51,60`, `dispatch-rule-checks.mjs:51-52`, `skilled-loop:1219-1237` and `v2-bridge.js:602`.
- `checklist_evidence`: **partial** (the gating failure). The phase-003 rows now carry ADR-001 waivers and AC-004 is Met with live evidence, but section 3 of the same file contradicts the table and the replacement commands fail as written.

**Overlay protocols:** `skill_agent` pass (`cli-opencode/README.md:51` agrees with `SKILL.md:5` version 2.0.0.0); `feature_catalog_code` pass; `playbook_capability` pass; `agent_cross_runtime` not applicable (no agent surface touched).

**AC_COVERAGE:** exempt. The review target is a file set, not a spec-folder target.

Resource Map Coverage Gate: skipped, because no `resource-map.md` existed at init. This run emitted `review/resource-map.md`.

## 8. Deferred Items

- The iteration recommended a closure-metadata sweep across all three phase folders (`grep` for `Closeable`, `Unmet`, `In Progress`, `stay open`). It did not run because the iteration cap was 1.
- `001/acceptance-criteria.md` AC-007's `.server(` grep scope, suggested by the earlier Plan Seed, was outside this run's scope and was not checked.
- The DR-001 P2 advisories in WS2.

## Dimension Expansion Map

- No divergent pivots: convergence mode `default`, stop policy `max-iterations`.
- Dimensions swept in iteration 1: correctness, with traceability, security and maintainability touched where a fix changed them.
- Remaining frontier: the closure-metadata sweep named in Deferred Items.

## 9. Search Ledger

- `searchCoverage.graphCoverageMode`: `graphless_fallback`.
- Required bug classes: `closure_metadata_conflict` and `verification_command_scope` covered; `dangling_consumer` and `trust_boundary` ruled out.
- Ruled out (4 candidates): no consumer of the removed `server` key remains (SL-1-004); the probe runs only names that can be OpenCode (SL-1-005); no code importer of the trimmed `v2-bridge.js` names (SL-1-006); the closure conflict is confined to the AC file and the T023 note (SL-1-007).
- Deferred: none. **hasSearchDebt: false.**

## 10. Audit Appendix

- **Convergence:** one iteration ran to the cap, and the stop decision was `maxIterationsReached`. Legal-stop gates recorded as blocked at the cap, as synthesis evidence: `dimensionCoverageGate`, `candidateCoverageGate`, `graphlessFallbackGate`. Terminal gates: evidence = pass, scope = pass, coverage = fail (`traceability-incomplete`). Graph convergence score at the stop: 0.833.
- **Coverage:** all four dimensions marked covered in the registry; core protocol `checklist_evidence` unfinished.
- **Per iteration:**

| Iteration | Focus | P0/P1/P2 | newFindingsRatio | Dispatch exit | verify-iteration |
|---|---|---|---|---|---|
| 1 | correctness (+ traceability for the packet findings) | 0/1/2 | 0.5 | 0 | OK |

- **Sources reviewed:** listed in `iterations/iteration-001.md`, Files Reviewed.

**Core Protocols:** `spec_code` pass, `checklist_evidence` partial.
**Overlay Protocols:** `skill_agent` pass, `feature_catalog_code` pass, `playbook_capability` pass, `agent_cross_runtime` notApplicable.
