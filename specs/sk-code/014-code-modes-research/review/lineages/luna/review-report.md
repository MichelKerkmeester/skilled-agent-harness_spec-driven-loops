# Deep Review Report

## 1. Executive Summary

**Verdict:** CONDITIONAL  
**hasAdvisories:** false  
**Active findings:** P0 0, P1 2, P2 3  
**Scope:** Parent packet specs/sk-code/014-code-modes-research and its two completed research phases. Five review iterations covered correctness, security, traceability, and maintainability. No target files were changed.

Two required P1 fixes remain: the parent and child goals retain superseded run directives, and a P0 write-boundary criterion is marked met even though its evidence records authorized spec.md writes. Three P2 findings concern stale acceptance status, a deleted temp file still described as present, and the old executor alternation plan. The registry and state log contain five active findings, zero P0, and no corruption.

The run reached its five-iteration cap. The stop reason is maxIterationsReached; the convergence score is telemetry only and did not shorten the run. Graph coverage was unavailable because graph writes are outside this lineage. Four search-debt obligations remain deferred.

## 2. Planning Trigger

/speckit:plan is required because two active P1 findings remain. The packet below is a scoped seed; no remediation was applied during this review.

~~~json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {"id":"R1-P1-001","severity":"P1","title":"Goal completion gates still require ten iterations after both phases were amended to fifteen","file":"specs/sk-code/014-code-modes-research/goal.md:52"},
    {"id":"R2-P1-001","severity":"P1","title":"The P0 write-boundary checklist is marked met while its evidence records spec.md writes","file":"specs/sk-code/014-code-modes-research/002-review-mode-research/tasks.md:166"},
    {"id":"R3-P2-001","severity":"P2","title":"Acceptance metadata says In Progress while the same phase packets declare closure","file":"specs/sk-code/014-code-modes-research/002-review-mode-research/acceptance-criteria.md:42"},
    {"id":"R4-P2-001","severity":"P2","title":"The summary says a dispatch temp file remains even though the completion evidence says it was deleted","file":"specs/sk-code/014-code-modes-research/002-review-mode-research/implementation-summary.md:128"},
    {"id":"R5-P2-001","severity":"P2","title":"The parent goal still requires executor alternation after the recorded decision changed the second pass","file":"specs/sk-code/014-code-modes-research/goal.md:53"}
  ],
  "remediationWorkstreams": [
    {"priority":"P1","title":"Reconcile durable parent and child goal directives with the fifteen-iteration amendment and ADR-002."},
    {"priority":"P1","title":"Rewrite CHK-031 so its criterion and path-level write evidence describe the same approved boundary."},
    {"priority":"P2","title":"Align both acceptance status fields with their closeable/completed phase status."},
    {"priority":"P2","title":"Remove or update the stale temp-file limitation and mark the original executor plan historical."}
  ],
  "specSeed": [
    "Amend parent D3 and both child goal completion gates to the fifteen-iteration run, citing ADR-002.",
    "Amend parent D4 to identify the cli-devin second-model pass as the superseding execution decision.",
    "Update CHK-031 to distinguish authorized bounded spec.md edits from prohibited writes and attach path-level evidence.",
    "Set both child acceptance metadata fields to the completed lifecycle state.",
    "Replace the phase 2 temp-file limitation with the documented deletion disposition."
  ],
  "planSeed": [
    "Update and cross-check parent and child goal directives against phase specs and ADR-002.",
    "Reconcile CHK-031 wording with parent scope D1 and the recorded spec_mutation events.",
    "Update phase acceptance statuses and verify the parent phase map and summaries agree.",
    "Remove the stale temp-file note and confirm all summary limitations match cleanup evidence.",
    "Re-run the packet's authoritative acceptance and validation gates after remediation."
  ],
  "findingClasses": ["spec-contract-drift","checklist-evidence-integrity","lifecycle-metadata-drift","stale-artifact-reference","execution-decision-drift"],
  "affectedSurfacesSeed": ["parent and child goals","phase 2 security checklist","both acceptance criteria files","phase 2 implementation summary","parent executor decision"],
  "fixCompletenessRequired": true
}
~~~

## 3. Active Finding Registry

### P1 — Required

#### R1-P1-001 — Goal completion gates still require ten iterations after both phases were amended to fifteen

- **Dimension:** traceability (canonical iteration record); the reducer registry currently labels this correctness.
- **File:** specs/sk-code/014-code-modes-research/goal.md:52
- **Evidence:** Parent goal D3 says exactly ten, while parent spec D3 records the fifteen-iteration amendment. Both phase goals still require ten records and files, while phase specs and task evidence record fifteen. [SOURCE: specs/sk-code/014-code-modes-research/goal.md:52] [SOURCE: specs/sk-code/014-code-modes-research/spec.md:114] [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/goal.md:58] [SOURCE: specs/sk-code/014-code-modes-research/002-review-mode-research/goal.md:58] [SOURCE: specs/sk-code/014-code-modes-research/002-review-mode-research/tasks.md:145]
- **Impact:** Completion status and future resume decisions can disagree across the same packet.
- **Recommendation:** Update parent and child goal completion gates to fifteen and cite the superseding ADR.
- **Disposition:** Active. **Class:** spec-contract-drift. **Scope proof:** All evidence is in the reviewed parent/child packet. **Affected surfaces:** parent goal D3, both child goal gates, phase closure reporting.

#### R2-P1-001 — The P0 write-boundary checklist is marked met while its evidence records spec.md writes

- **Dimension:** security (canonical iteration record); the reducer registry currently labels this correctness.
- **File:** specs/sk-code/014-code-modes-research/002-review-mode-research/tasks.md:166
- **Evidence:** CHK-031 says no file outside research/ was written, while the same evidence cell says bounded spec.md edits occurred. Parent scope D1 and the implementation summary confirm those edits were permitted. [SOURCE: specs/sk-code/014-code-modes-research/002-review-mode-research/tasks.md:166] [SOURCE: specs/sk-code/014-code-modes-research/spec.md:112] [SOURCE: specs/sk-code/014-code-modes-research/002-review-mode-research/implementation-summary.md:71]
- **Impact:** A reviewer may rely on a P0 security check that does not establish the boundary it claims to establish.
- **Recommendation:** Rewrite CHK-031 to distinguish permitted bounded spec.md edits from prohibited writes, then record actual path-level evidence.
- **Disposition:** Active. **Class:** checklist-evidence-integrity. **Scope proof:** The mismatch is in reviewed task, scope, and summary files; this review changed no target file. **Affected surfaces:** security checklist, write-boundary evidence, phase closeout.

### P2 — Suggestions

#### R3-P2-001 — Acceptance metadata says In Progress while the same phase packets declare closure

- **Dimension:** traceability (canonical iteration record); the reducer registry currently labels this correctness.
- **File:** specs/sk-code/014-code-modes-research/002-review-mode-research/acceptance-criteria.md:42
- **Evidence:** Both child acceptance files say In Progress, then Closeable: Yes and all eleven criteria met; summaries and parent phase map say Complete. [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/acceptance-criteria.md:42] [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/acceptance-criteria.md:92] [SOURCE: specs/sk-code/014-code-modes-research/002-review-mode-research/acceptance-criteria.md:42] [SOURCE: specs/sk-code/014-code-modes-research/002-review-mode-research/acceptance-criteria.md:92] [SOURCE: specs/sk-code/014-code-modes-research/spec.md:137]
- **Impact:** A later reader may treat a closed phase as active or misread the authoritative status.
- **Recommendation:** Align each acceptance status field with its summary and parent phase status.
- **Disposition:** Active. **Class:** lifecycle-metadata-drift. **Affected surfaces:** acceptance metadata, phase status map, implementation summaries.

#### R4-P2-001 — The summary says a dispatch temp file remains even though the completion evidence says it was deleted

- **Dimension:** maintainability (canonical iteration record); the reducer registry currently labels this correctness.
- **File:** specs/sk-code/014-code-modes-research/002-review-mode-research/implementation-summary.md:128
- **Evidence:** The summary says the temp file is kept, CHK-050 says executor leftovers were deleted, and a current read-only existence check found the named path absent. [SOURCE: specs/sk-code/014-code-modes-research/002-review-mode-research/implementation-summary.md:128] [SOURCE: specs/sk-code/014-code-modes-research/002-review-mode-research/tasks.md:185]
- **Impact:** A maintainer may search for or decide about an artifact that no longer exists.
- **Recommendation:** Remove the stale limitation or replace it with the cleanup disposition and evidence.
- **Disposition:** Active. **Class:** stale-artifact-reference. **Affected surfaces:** implementation summary, cleanup evidence, operator handoff.

#### R5-P2-001 — The parent goal still requires executor alternation after the recorded decision changed the second pass

- **Dimension:** traceability (canonical iteration record); the reducer registry currently labels this correctness.
- **File:** specs/sk-code/014-code-modes-research/goal.md:53
- **Evidence:** Parent goal D4 directs alternation through cli-pi; the parent spec and child ADR-002 record the refusal and cli-devin second-model pass. [SOURCE: specs/sk-code/014-code-modes-research/goal.md:53] [SOURCE: specs/sk-code/014-code-modes-research/spec.md:115] [SOURCE: specs/sk-code/014-code-modes-research/002-review-mode-research/decision-record.md:166] [SOURCE: specs/sk-code/014-code-modes-research/002-review-mode-research/implementation-summary.md:86]
- **Impact:** A later resume may use the rejected route or fail to identify the current executor decision.
- **Recommendation:** Amend parent D4 to identify ADR-002 as superseding the old alternation plan, or mark the original route historical.
- **Disposition:** Active. **Class:** execution-decision-drift. **Affected surfaces:** parent executor decision, child ADR-002, resume instructions.

## 4. Remediation Workstreams

### P1 — Required before PASS

1. Reconcile parent D3, parent D4, and both child goal directives with the fifteen-iteration second-model decision in ADR-002. Remove the remaining “exactly ten” live language or label it as the original first-pass baseline.
2. Rewrite CHK-031 so its scope matches parent D1, and attach evidence that distinguishes bounded spec.md edits from any prohibited path.

### P2 — Advisory cleanup

3. Set both acceptance metadata fields to the completed status used by their closure statements and summaries.
4. Remove the phase 2 temp-file limitation or document its deletion.
5. Mark the original cli-pi alternation plan as historical where it remains in the parent goal.

## 5. Spec Seed

- Parent D3 and both child goals: state that the completed run has fifteen iterations and cite ADR-002.
- Parent D4: identify the cli-devin second-model pass as the superseding route.
- Phase 2 CHK-031: distinguish authorized bounded spec.md edits from prohibited writes and cite path-level evidence.
- Both child acceptance files: align Status with Closeable and the completed summaries.
- Phase 2 implementation summary: remove the stale temp-file claim or cite the deletion disposition.

## 6. Plan Seed

1. Amend the parent and child goal directives, then cross-check them against phase specs, ADR-002, and final state counts.
2. Reword CHK-031 and confirm its evidence demonstrates the criterion it states.
3. Align both acceptance status fields with closure and the parent phase map.
4. Reconcile cleanup notes with CHK-050 and the current file state.
5. Run the packet's acceptance and validation gates after changes.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence and unresolved drift |
|---|---|---|
| spec_code | Partial | Parent and child goal count gates and parent executor route lag behind the amended specs and ADR-002. Findings R1-P1-001 and R5-P2-001. |
| checklist_evidence | Partial | CHK-031 conflicts with its own bounded spec.md write evidence; acceptance status metadata and one summary limitation are stale. Findings R2-P1-001, R3-P2-001, R4-P2-001. |

### Overlay Protocols

| Protocol | Status | Reason |
|---|---|---|
| skill_agent | Not applicable | Findings-only research packet; no skill or agent implementation changed. |
| agent_cross_runtime | Not applicable | No production agent/runtime change is in scope. |
| feature_catalog_code | Not applicable | No feature catalog implementation changed. |
| playbook_capability | Not applicable | No playbook implementation changed. |

**AC_COVERAGE:** exempt for the parent spec-folder target. The parent folder has no root checklist.md or implementation-summary.md; the two child acceptance files were inspected, but their individual historical commands were not rerun.

## 8. Deferred Items

- Full source-tag reopening across both long research syntheses remains deferred.
- Credential scan CHK-030 was not reproduced during this review.
- Individual historical acceptance commands and strict validation were not rerun.
- No live review scenario measured usefulness; the phase summary already records that limitation.
- Shared graph projection was unavailable under the lineage-only write boundary.

## Dimension Expansion Map

- Reducer-recorded completed pivots: 0; failed pivots: 0; audited overrides: 0.
- Saturated directions: none recorded.
- Selected review angles: contract alignment, write-boundary evidence, acceptance lifecycle, cleanup state, and executor-route reconciliation.
- Remaining frontier: deferred source-tag, credential-scan, and acceptance-row provenance checks listed above.

## Search Ledger

- Graph coverage mode: graphless_fallback.
- Candidate coverage: 5 covered, 3 ruled out, 4 deferred, 0 blocked.
- Search debt: acceptance status coherence; credential exposure scan; acceptance row provenance; full recommendation source traceability.
- Ruled out: no unauthorized write path was established beyond parent-authorized bounded spec.md edits; closure summaries and parent phase map agree apart from acceptance metadata; cleanup task and filesystem state agree that the temp file was deleted.
- Clean search proof and candidate details are retained in deep-review-findings-registry.json.

## 9. Audit Appendix

### Convergence and Coverage

- Iterations: 5 of 5.
- Stop reason: maxIterationsReached.
- Final weighted new-finding ratio: 0.077; this did not shorten the configured run.
- Active findings: P0 0, P1 2, P2 3.
- Dimension coverage: correctness, security, traceability, and maintainability all covered.
- Reducer reported zero corrupt records and five open findings.

### Workflow and Scope Deviations

- Legacy migration, graph seed/upsert, shared fan-out merge, resource-map emission, validation, git staging, and continuity generation were skipped because they can write outside this lineage or were explicitly prohibited.
- Gateway input events were stored under this lineage to avoid system-temp writes. Every canonical state record, including run initialization, claim adjudications, five iterations, and synthesis, was handed to the append gateway.
- Dimension attribution caveat: the canonical iteration records carry per-finding dimensions, but the reducer registry labels all findings as correctness. The narrative follows the required Dimension headings, while the reducer derives finding dimensions from parsed Focus/Assessment blocks and defaults to correctness when those legacy sections are absent. Iteration reports were treated as write-once; this report uses the dimensions recorded in the canonical iteration findings and preserves the parser discrepancy for follow-up.

### Sources Reviewed

- Parent: goal.md, spec.md, description.json, graph-metadata.json.
- Phase 1: goal.md, spec.md, plan.md, tasks.md, acceptance-criteria.md, decision-record.md, implementation-summary.md, research/research.md, state log, strategy, dashboard, findings registry, resource map.
- Phase 2: goal.md, spec.md, plan.md, tasks.md, acceptance-criteria.md, decision-record.md, implementation-summary.md, research/research.md, state log, strategy, dashboard, findings registry, resource map.
- Runtime contracts: deep-review skill, agent definition, iteration prompt template, review-core doctrine, review YAML, append gateway, reducer, and synthesis closeout contract.
- steer.md was checked before init, each iteration, and synthesis; it was absent each time.

### Core Protocols

- spec_code: partial, with R1 and R5 active.
- checklist_evidence: partial, with R2, R3, and R4 active.

### Overlay Protocols

- skill_agent: not applicable.
- agent_cross_runtime: not applicable.
- feature_catalog_code: not applicable.
- playbook_capability: not applicable.

Review verdict: CONDITIONAL