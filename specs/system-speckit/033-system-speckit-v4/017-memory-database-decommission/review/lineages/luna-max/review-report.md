---
title: Memory decommission deep-review report
mode: review
review_target: .opencode/specs/system-speckit/049-memory-decommission
review_target_type: spec-folder
review_dimensions:
  - correctness
  - security
  - traceability
  - maintainability
session_id: fanout-luna-max-1788500810815-bsonv7
generation: 1
lineage_mode: new
terminal_iteration: 10
---

# Deep Review Report

## 1. Executive Summary

Verdict: **CONDITIONAL**.

- Active findings: P0=0, P1=4, P2=2.
- `hasAdvisories`: false; the P2 items accompany an already-conditional result.
- Scope: the memory-decommission spec folder, its parent and phase closure documents, the recorded release-environment evidence, and the replacement trigger-index reader/writer/test boundary.
- Coverage: correctness, security, traceability, and maintainability were all covered, including the terminal adversarial replay in iteration 10.
- Stop reason: `maxIterationsReached`. The configured ceiling ended dispatch; convergence was telemetry only and was not used to claim readiness.
- Release state: not established. The packet still contains four required P1 findings and failed traceability checks.

The review found no P0 security or data-loss condition. It did find a runtime contract gap in malformed trigger-index handling and multiple parent/child closure contradictions. No target source or spec file was modified by this lineage.

## 2. Planning Trigger

`/speckit:plan` is required before implementing the four P1 remediations and is also the appropriate route for the two P2 release-readiness/documentation follow-ups. This report is a planning seed only; no implementation planning command was run inside the detached lineage.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {"id":"F001","severity":"P1","title":"Trigger-index reader accepts malformed postings and can return incomplete results","dimension":"correctness","file":".opencode/skills/system-spec-kit/scripts/retrieval/lookup-trigger-index.mjs:71","findingClass":"contract-mismatch","affectedSurfaceHints":["trigger-index-reader","committed-index","gate1-retrieval"]},
    {"id":"F002","severity":"P1","title":"Research fold-in gates remain open while the parent declares the research integrated","dimension":"traceability","file":".opencode/specs/system-speckit/049-memory-decommission/005-ripgrep-retrieval-research/tasks.md:62","findingClass":"traceability-drift","affectedSurfaceHints":["phase-005-fold-in","phase-006-fold-in","parent-phase-map"]},
    {"id":"F003","severity":"P1","title":"Phase completion gates contradict the completed status","dimension":"traceability","file":".opencode/specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/tasks.md:70","findingClass":"traceability-drift","affectedSurfaceHints":["phase-001-closure","phase-002-closure","parent-phase-map"]},
    {"id":"F004","severity":"P1","title":"Parent exact-zero residue criterion is closed despite literal matches","dimension":"traceability","file":".opencode/specs/system-speckit/049-memory-decommission/goal.md:94","findingClass":"traceability-drift","affectedSurfaceHints":["parent-completion-criterion","retired-prefix-residue","historical-allowlist"]},
    {"id":"F005","severity":"P2","title":"Report-only exception debt has no named owner or expiry","dimension":"maintainability","file":".opencode/specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/implementation-summary.md:207","findingClass":"documentation-debt","affectedSurfaceHints":["exception-inventory","owner-assignment","expiry-policy"]},
    {"id":"F006","severity":"P2","title":"Main-checkout model-server dependency remains an explicit release-readiness caveat","dimension":"maintainability","file":".opencode/specs/system-speckit/049-memory-decommission/goal.md:141","findingClass":"deployment-readiness","affectedSurfaceHints":["main-checkout-node-modules","shared-model-server","release-handoff"]}
  ],
  "remediationWorkstreams": [
    "Align the trigger-index reader's input validation with the generator's closed-shape validation and add a malformed-committed-index regression test.",
    "Reconcile parent phase status with phases 001/002 closure criteria and close or explicitly supersede the open research fold-in rows in phases 005/006.",
    "Resolve the exact-zero retired-prefix criterion against the retained-residue evidence and document an approved allowlist only if that is the intended contract.",
    "Assign owners and expiry/review checkpoints to phase-004 report-only exception classes.",
    "Reinstall or otherwise prove dependency parity for the main-checkout model-server environment, then repeat the live acceptance check."
  ],
  "specSeed": [
    "Define whether a malformed committed trigger index is a hard reader error or a required regeneration event.",
    "Make phase completion and research fold-in claims agree with their task-level closure gates.",
    "Replace the contradictory exact-zero completion wording or remove the retained retired-prefix matches under an approved policy.",
    "Add accountable owner, expiry, and renewal fields to report-only exception decisions and release-environment caveats."
  ],
  "planSeed": [
    {"id":"PLAN-F001","dependsOn":[],"task":"Trace reader and generator invariant ownership, implement fail-closed parity, and add malformed-index coverage."},
    {"id":"PLAN-F002-F003","dependsOn":[],"task":"Reconcile phase-001/002 completion rows and phase-005/006 fold-in rows with the parent phase map."},
    {"id":"PLAN-F004","dependsOn":["PLAN-F002-F003"],"task":"Choose and record the literal retired-prefix completion policy, including any approved retained-residue allowlist."},
    {"id":"PLAN-F005-F006","dependsOn":["PLAN-F002-F003"],"task":"Assign exception ownership/expiry and close the main-checkout environment parity evidence gap."}
  ],
  "findingClasses": ["contract-mismatch","traceability-drift","documentation-debt","deployment-readiness"],
  "affectedSurfacesSeed": ["trigger-index-reader","committed-index","phase-001-closure","phase-002-closure","phase-005-fold-in","phase-006-fold-in","parent-completion-criterion","exception-inventory","shared-model-server","release-handoff"],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

| ID | Severity | Dimension | Evidence | Finding class | Scope proof | Disposition |
| --- | --- | --- | --- | --- | --- | --- |
| F001 | P1 | correctness | Reader accepts parsed top-level index data and skips malformed postings [SOURCE: `.opencode/skills/system-spec-kit/scripts/retrieval/lookup-trigger-index.mjs:71-178`]. Generator validation is stronger [SOURCE: `.opencode/skills/system-spec-kit/scripts/retrieval/generate-trigger-index.mjs:369-403`]. | `contract-mismatch` | Replacement retrieval reader and committed index contract | Active, reaffirmed in iteration 10 |
| F002 | P1 | traceability | Research T013 fold-in rows remain open while the parent map says research was folded into build phases [SOURCE: `.opencode/specs/system-speckit/049-memory-decommission/005-ripgrep-retrieval-research/tasks.md:61-73`; `.opencode/specs/system-speckit/049-memory-decommission/006-legacy-memory-surface-inventory/tasks.md:61-74`; `.opencode/specs/system-speckit/049-memory-decommission/spec.md:156-184`]. | `traceability-drift` | Target phase handoff and research closure documents | Active, reaffirmed in iteration 10 |
| F003 | P1 | traceability | Phases 001 and 002 retain unchecked completion-criteria rows despite the parent complete status [SOURCE: `.opencode/specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/tasks.md:70-76`; `.opencode/specs/system-speckit/049-memory-decommission/002-memory-consumer-rewire/tasks.md:188-194`]. | `traceability-drift` | Target phase closure documents | Active, reaffirmed in iteration 10 |
| F004 | P1 | traceability | The exact-zero retired-prefix criterion conflicts with the recorded retained matches and narrower live-surface interpretation [SOURCE: `.opencode/specs/system-speckit/049-memory-decommission/goal.md:84-98`; `.opencode/specs/system-speckit/049-memory-decommission/goal.md:124-132`]. | `traceability-drift` | Target completion criterion and recorded scan evidence | Active, reaffirmed in iteration 10 |
| F005 | P2 | maintainability | Residual warning/refusal classes have no named owner, due date, expiry, or renewal checkpoint [SOURCE: `.opencode/specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/implementation-summary.md:203-213`; `.opencode/specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/tasks.md:267-275`]. | `documentation-debt` | Phase exception accounting and parent decision log | Active, reaffirmed in iteration 10 |
| F006 | P2 | maintainability | The main checkout lacks `onnxruntime-common`, while phase-003 live acceptance evidence is recorded from the worktree environment [SOURCE: `.opencode/specs/system-speckit/049-memory-decommission/goal.md:141-142`; `.opencode/specs/system-speckit/049-memory-decommission/003-spec-memory-server-removal/acceptance-criteria.md:62-70`]. | `deployment-readiness` | Target host caveat and phase-003 environment evidence | Active, reaffirmed in iteration 10 |

No active finding was resolved by the terminal replay. The final content hashes remain F001=`111111...1111`, F002=`222222...2222`, F003=`333333...3333`, F004=`444444...4444`, F005=`555555...5555`, and F006=`666666...6666` as recorded in the lineage deltas.

## 4. Remediation Workstreams

1. **Reader invariant parity — P1, F001.** Establish one authoritative closed-shape invariant for the trigger index. Enforce it at the reader boundary or fail closed with a regeneration path, and add a regression fixture for malformed committed postings. Preserve the existing writer-side validation as a separate publication check.
2. **Closure-state reconciliation — P1, F002/F003.** Either close the unchecked phase and research task rows with receipts or revise the parent phase map/progress claims. The result must make the phase status and task-level gates mechanically agree.
3. **Retired-prefix policy — P1, F004.** Decide whether the literal zero-hit criterion or the narrower live-surface interpretation governs. If retained historical/reporting matches are permitted, record an explicit approved allowlist and change the criterion accordingly.
4. **Exception accountability — P2, F005.** Add an owner and expiry/review checkpoint for each residual warning/refusal class, including the three blank phase-004 sign-off rows.
5. **Environment parity — P2, F006.** Restore or prove dependency parity in the main checkout, rerun the shared model-server/advisor evidence, and attach a release-handoff receipt identifying the tested environment.

## 5. Spec Seed

- The trigger-index contract should state the reader behavior for a syntactically parseable but semantically malformed committed artifact.
- Parent and child phase status claims should use one closure vocabulary, with explicit semantics for unchecked template rows.
- Research phase handoff criteria should reference the actual fold-in task receipts rather than only the parent progress statement.
- The completion criterion for retired-prefix residue should be literal, or its narrower interpretation should be made normative and approved.
- Exception decisions should carry owner, expiry, and renewal metadata.
- Live acceptance evidence should identify whether the worktree or the main checkout is the release environment.

## 6. Plan Seed

- Inspect the reader/generator contract seam and implement the smallest fail-closed behavior that preserves valid lookup semantics; cover malformed postings and missing path IDs.
- Reconcile the parent `spec.md` phase map, `goal.md` progress/DONE WHEN rows, and phases 001, 002, 005, and 006 task closure sections.
- Decide and record the retained-residue policy before asserting the exact-zero criterion.
- Add accountable follow-up metadata for phase-004 residual classes and sign-off rows.
- Restore main-checkout dependency parity, repeat the live model-server check, and record the result against the release environment.
- Rerun the authoritative repository verification after the remediation packet is changed. This detached review did not run repository validators or generators by instruction.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence | Gap |
| --- | --- | --- | --- |
| `dimension-coverage` | pass | All four configured dimensions were covered, including the iteration-10 replay. | None for review coverage. |
| `spec_code` | fail | Parent phase map and child closure evidence disagree [SOURCE: `.opencode/specs/system-speckit/049-memory-decommission/spec.md:156-184`; `.opencode/specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/tasks.md:70-76`]. | F002/F003 remain open. |
| `checklist_evidence` | fail | Research fold-in and phase completion rows remain unchecked [SOURCE: `.opencode/specs/system-speckit/049-memory-decommission/005-ripgrep-retrieval-research/tasks.md:61-73`; `.opencode/specs/system-speckit/049-memory-decommission/002-memory-consumer-rewire/tasks.md:188-194`]. | F002/F003 remain open. |
| `trigger-index-structural-validation` | fail | Generator and reader enforce different levels of index shape validation [SOURCE: `.opencode/skills/system-spec-kit/scripts/retrieval/lookup-trigger-index.mjs:71-178`; `.opencode/skills/system-spec-kit/scripts/retrieval/generate-trigger-index.mjs:369-403`]. | F001 remains open. |

`AC_COVERAGE`: exempt for the root target because no root-level `checklist.md` exists. The phase-level acceptance documents were still inspected where they supplied direct evidence.

### Overlay Protocols

| Protocol | Status | Evidence | Gap |
| --- | --- | --- | --- |
| `security-boundary` | pass | No distinct credential, path-traversal, or trust-boundary defect was found in the final replay. | F001 remains a correctness/contract issue with an input-validation consequence. |
| `host-environment-parity` | partial | The packet distinguishes successful worktree evidence from the main-checkout dependency caveat [SOURCE: `.opencode/specs/system-speckit/049-memory-decommission/goal.md:141-142`; `.opencode/specs/system-speckit/049-memory-decommission/003-spec-memory-server-removal/acceptance-criteria.md:62-70`]. | F006 lacks a remediation receipt. |
| `resource-map` | not applicable | No root `resource-map.md` was present at initialization. | Conditional map gate skipped. |
| `agent-cross-runtime` | not applicable | No cross-runtime agent contract was asserted by the target packet. | None. |

## 8. Deferred Items

- F005 remains a P2 accountability/documentation follow-up until owners and expiry dates are recorded.
- F006 remains a P2 environment-parity follow-up until the main checkout is proved equivalent to the worktree used for live acceptance.
- Continuity generation was intentionally not run because the detached lineage instruction forbade `generate-context.js`; the canonical review artifacts and append-gateway receipts are preserved here.
- The final review is not a substitute for the repository’s authoritative validation, test, or generation gates; those must be run by the operator after any remediation.

## 9. Dimension Expansion Map

- Completed pivots: 10.
- Failed pivots: 0.
- Audited overrides: 10.
- Swept directions: parent/child closure, runtime-removal boundary, research handoff, residual accounting, reader/writer contract, parser/input safety, retired-prefix residue, generated-artifact/ownership checks, release-environment parity, and terminal adversarial replay.
- Pivot lineage: parent closure -> runtime boundary -> research handoff -> exception debt -> reader/writer contract -> parser/corpus safety -> residue proof -> generated-artifact and ownership checks -> release-environment parity -> final replay.
- Remaining frontier: none; the max-iterations ceiling was reached.
- Graph status: unavailable; review used `graphless_fallback`.

## 10. Search Ledger

The terminal pass covered all required bug classes: `contract-mismatch`, `incomplete-removal`, `unsafe-input`, `state-integrity`, `traceability-drift`, and `documentation-debt`. No search direction was deferred or blocked in iteration 10. The graph was unavailable, so the lineage records a graphless fallback rather than a graph pass.

| ID | Dimension | Bug class | Disposition | Link or reason |
| --- | --- | --- | --- | --- |
| SL-037 | correctness | contract-mismatch | finding | F001 |
| SL-038 | security | unsafe-input | finding | F001; no separate finding split |
| SL-039 | correctness | state-integrity | finding | F003; document-state contradiction already represented |
| SL-040 | traceability | traceability-drift | finding | F002 |
| SL-041 | traceability | incomplete-removal | finding | F004 |
| SL-042 | maintainability | documentation-debt | finding | F005 |
| SL-043 | maintainability | documentation-debt | finding | F006 |
| SL-044 | security | state-integrity | ruled_out | No distinct trust-boundary or runtime state-transition defect |

Search coverage state: `covered` all six required classes; `ruledOut=[]`; `deferred=[]`; `blocked=[]`; `graphCoverageMode=graphless_fallback`; `searchDebt=[]`.

## 11. Audit Appendix

### Convergence and terminal state

- Iterations present: 1 through 10 in the lineage artifacts; iteration 10 has a write-once narrative and a 24-line JSONL delta.
- Iteration-10 novelty ratio: 0.00; all six findings were reaffirmed.
- Iteration-10 coverage ratio: 1.00; all four dimensions and all six required bug classes were replayed.
- Finding stability ratio: 0.96; hotspot saturation: 0.94; these are telemetry values, not a readiness assertion.
- Active findings at synthesis: P0=0, P1=4, P2=2.
- Stop reason: `maxIterationsReached`; final review verdict: `CONDITIONAL`.

### Canonical lineage receipts

- Resume event committed at ledger sequence 42.
- Iteration pass committed at sequence 43.
- P1 claim-adjudication events committed at sequences 44–47.
- Review-depth event committed at sequence 48.
- Inline and graph convergence telemetry committed at sequences 49–50.
- The projected state rows are under the lineage’s own `review/` subdirectory because the append gateway was invoked with the lineage artifact directory; no state file outside the lineage was written.

### State and evidence limitations

- The pre-existing iterations 1–9 contain legacy v2 field shapes and historical ordering from the interrupted prior attempt. They were preserved as write-once history; iteration 10 uses the current object-shaped v2 applicability and target-selection contract.
- No `resource-map.md` existed at initialization, so resource-map coverage is not evidence of completeness.
- No `validate.sh`, repository generator, test suite, or continuity generator was run in this detached lineage. Their outcomes are therefore unknown here, not inferred as passing.

### Sources reviewed

- Parent `spec.md` and `goal.md` closure, progress, and completion criteria.
- Phase 001/002 completion criteria and task gates.
- Phase 003 live environment acceptance evidence.
- Phase 004 exception accounting and sign-off rows.
- Phase 005/006 research fold-in tasks.
- Trigger-index reader, generator validation, and focused test coverage.

### Cross-reference appendix

#### Core Protocols

- `dimension-coverage`: pass.
- `spec_code`: fail — parent phase claims do not match child closure evidence.
- `checklist_evidence`: fail — open task-level closure rows remain.
- `trigger-index-structural-validation`: fail — reader/generator invariant mismatch.

#### Overlay Protocols

- `security-boundary`: pass.
- `host-environment-parity`: partial — main-checkout dependency caveat remains.
- `resource-map`: not applicable.
- `agent-cross-runtime`: not applicable.
