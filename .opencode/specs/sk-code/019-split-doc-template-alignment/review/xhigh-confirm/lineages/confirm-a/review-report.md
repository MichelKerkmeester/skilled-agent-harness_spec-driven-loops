---
title: "Deep Review Report: sk-code Split-Doc Template Alignment"
description: "Four-iteration detached review lineage covering correctness, security, traceability, and maintainability."
verdict: "CONDITIONAL"
baseFindingVerdict: "PASS"
hasAdvisories: true
hasSearchDebt: true
activeP0: 0
activeP1: 0
activeP2: 3
stopReason: "maxIterationsReached"
sessionId: "fanout-confirm-a-1783921047347-ky9ry5"
generatedAt: "2026-07-13T06:36:45Z"
---

# Deep Review Report: sk-code Split-Doc Template Alignment

## 1. Executive Summary

**Final verdict: CONDITIONAL.** The finding-severity verdict is PASS because no P0 or P1 remains, but the final release-readiness view is conditional because one explicit search-debt item remains: R4's historical verbatim-content preservation claim cannot be replayed without the pre-change baseline and commit evidence.

All four configured dimensions completed at the required iteration ceiling. The review confirmed the current 163-file distribution and current-state structural claims, found no executable capability change, and found no P0/P1 during the terminal stabilization pass. Three P2 advisories remain active.

| Metric | Result |
|--------|--------|
| Iterations | 4/4 |
| Dimension coverage | 4/4 |
| Active findings | P0=0, P1=0, P2=3 |
| Convergence score | 1.0 |
| Search debt | 1 deferred item |
| JSONL corruption | 0 |
| Resource-map coverage gate | Skipped; target packet had no `resource-map.md` at initialization |

## 2. Planning Trigger

No implementation remediation plan is required because the review found no P0/P1 and the target is documentation-only. The three advisories can be handled as a bounded packet/documentation cleanup. The historical R4 debt requires evidence recovery rather than a code change.

**Planning Packet**

```json
{
  "triggered": false,
  "verdict": "CONDITIONAL",
  "baseFindingVerdict": "PASS",
  "hasAdvisories": true,
  "hasSearchDebt": true,
  "activeFindings": ["P2-001", "P2-002", "P2-003"],
  "remediationWorkstreams": [
    "clarify dynamic-loader trust preconditions",
    "remove stale remediated follow-up prose",
    "align task/checklist evidence promises with retained evidence"
  ],
  "specSeed": [
    "Clarify whether historical preservation evidence is a required retained artifact.",
    "Keep completion follow-up claims synchronized with current resource content."
  ],
  "planSeed": [
    "Update the resource-loading usage wrapper with a trusted-source contract.",
    "Refresh implementation-summary follow-up items.",
    "Add replay pointers or narrow evidence-protocol wording."
  ],
  "findingClasses": ["instance-only", "cross-consumer", "matrix/evidence"],
  "affectedSurfacesSeed": [
    "code-webflow resource-loading reference",
    "packet implementation summary",
    "packet tasks/checklist evidence rows"
  ],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

### P2-001: Dynamic-loader usage wrapper omits its trust precondition

- **Severity / dimension:** P2 / security
- **Evidence:** `.opencode/skills/sk-code/code-webflow/references/performance/resource_loading.md:21-38,303-325`
- **Counterevidence:** `.opencode/skills/sk-code/code-webflow/references/implementation/third_party_integrations/best_practices_and_summary.md:39-60`
- **Impact:** The packet-added OVERVIEW broadly recommends the contained loading patterns, while `loadScript(src)` accepts an unconstrained URL and does not state the trusted-static-source, HTTPS allowlist, or integrity requirement. This is advisory because the body is documentation-only and the shown caller is static.
- **Recommendation:** State that `src` must be a trusted static or allowlisted HTTPS URL and point readers to the bounded loader/SRI guidance.
- **Disposition:** Active advisory; first seen in iteration 2, confirmed unchanged in iteration 4.

### P2-002: Completion follow-up presents remediated issues as active

- **Severity / dimension:** P2 / traceability
- **Evidence:** `.opencode/specs/sk-code/019-split-doc-template-alignment/implementation-summary.md:91-93`
- **Counterevidence:** `.opencode/skills/sk-code/code-webflow/references/implementation/security_patterns/overview_and_checklist.md:91-100,249-260`; `.opencode/skills/sk-code/code-webflow/references/implementation/third_party_integrations/best_practices_and_summary.md:39-60`
- **Impact:** Future work may be directed toward a cookie contradiction and arbitrary-input loader problem that current resources already remediate. The quoted generic When-to-Use phrase was also absent from the explicit allowed roots.
- **Recommendation:** Remove resolved items, label them as historical remediations, or retain only current follow-up with live citations.
- **Disposition:** Active advisory; first seen in iteration 3, confirmed unchanged in iteration 4.

### P2-003: Evidence protocol wording exceeds retained row evidence

- **Severity / dimension:** P2 / traceability
- **Evidence:** `.opencode/specs/sk-code/019-split-doc-template-alignment/tasks.md:23-25,51-61`; `.opencode/specs/sk-code/019-split-doc-template-alignment/checklist.md:23-25,48-60,72-95`
- **Corroboration:** `.opencode/specs/sk-code/019-split-doc-template-alignment/implementation-summary.md:83-86`
- **Impact:** The packet says every checked task row carries evidence and every checklist item carries a command plus result, but the rows contain completion statements without command output or durable replay pointers. Current-state conformance is corroborated; historical preservation, commit sequencing, push state, and pre-commit gates are not replayable from the rows.
- **Recommendation:** Add durable command/result or artifact pointers to checked rows, or narrow the protocol wording to the evidence actually retained.
- **Disposition:** Active advisory; first seen in iteration 3, confirmed unchanged in iteration 4.

## 4. Remediation Workstreams

1. **Current guidance clarity:** Resolve P2-001 in `resource_loading.md` by documenting the script-source trust contract and linking the bounded third-party pattern.
2. **Completion handoff accuracy:** Resolve P2-002 by removing or relabeling remediated follow-up items in `implementation-summary.md`.
3. **Audit replayability:** Resolve P2-003 by adding durable evidence pointers or narrowing the task/checklist evidence claims.
4. **Historical provenance:** Recover the pre-change baseline and commit evidence for R4 if historical verbatim preservation must be independently auditable; otherwise explicitly classify it as accepted non-replayable provenance.

## 5. Spec Seed

- Preserve R1-R3/R5 as current-state requirements; the four-pass review found no current mismatch.
- Clarify the required retention level for R4 historical preservation evidence.
- Require packet follow-up sections to distinguish active debt from already-remediated findings.
- Require usage wrappers around security-sensitive examples to state their trust preconditions.

## 6. Plan Seed

1. Patch the resource-loading OVERVIEW or loader section with the trusted-source/allowlist/integrity precondition.
2. Reconcile the implementation summary's follow-up list against current resource content.
3. Add command/result or durable artifact references to historical/process checklist rows, or revise the protocol statements.
4. If R4 must be independently replayable, locate the pre-change tree/commits and record a bounded preservation comparison artifact.
5. Re-run the scoped document validator, filename scan, relative-link scan, and packet validation after any cleanup.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Gate | Evidence | Remaining gap |
|----------|--------|------|----------|---------------|
| `spec_code` | partial, current-state pass | hard | `spec.md:64-71`; `implementation-summary.md:37-48,71-79` | R4 historical preservation baseline was not replayed. |
| `checklist_evidence` | partial, no gate failure | hard | `tasks.md:23-61`; `checklist.md:23-97`; `implementation-summary.md:83-86` | P2-003: promised command/result evidence is absent from checked rows. |
| `stabilization_replay` | pass | hard | iteration 4 direct reads and explicit-root searches | No new P0/P1 found. |

### Overlay Protocols

| Protocol | Status | Reason |
|----------|--------|--------|
| `feature_catalog_code` | not applicable | No feature catalog is part of the target. |
| `playbook_capability` | not applicable | No manual testing playbook is part of the target. |

`AC_COVERAGE` is advisory-shortfall: this Level 2 completed packet has a checklist, but the checklist is not acceptance-criterion keyed and does not retain command/result evidence per checked item.

## 8. Deferred Items

- Historical R4 preservation remains deferred because the pre-change baseline and commit evidence were unavailable and the strategy exhausted that approach.
- Spec Memory retrieval timed out twice; direct packet and file evidence was used instead.
- `code-quality/references` does not exist; the valid code-quality scope is its three asset files.
- The three active P2 findings do not block the base severity verdict but should be cleaned up before treating the packet as fully self-auditing.

## Dimension Expansion Map

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated dimensions: correctness, security, traceability, maintainability
- Remaining frontier: historical preservation provenance only
- Breadth result: four risk-ordered passes plus terminal stabilization; no fifth iteration permitted by the configured ceiling

## 9. Search Ledger

- `hasSearchDebt: true`
- Graph mode: `graphless_fallback`; the Markdown target was reviewed with direct reads, deterministic corpus checks, and exact per-root searches.
- Candidate coverage: covered=3, ruled-out=8, deferred=1, blocked=0.
- Covered finding classes: unsafe snippet framing, stale completion follow-up, checklist evidence provenance.
- Ruled out: active cookie contradiction, active remediated third-party loader defect, unsafe sink/secret examples presented as good, current R1-R3/R5 mismatch, missing maintenance mechanism, new maintainability P0/P1, and cross-finding duplication.
- Deferred: `preservation_provenance` (`SL-003-02`) because current-tree evidence cannot prove a historical verbatim-content claim.

## 10. Audit Appendix

### Iteration Replay

| Iteration | Dimension | New P0/P1/P2 | Ratio | Verdict | Validation |
|-----------|-----------|--------------|-------|---------|------------|
| 1 | correctness | 0/0/0 | 0.0000 | PASS | Mechanical + strict validator pass after one schema repair |
| 2 | security | 0/0/1 | 1.0000 | PASS | Mechanical + strict v2 validator pass |
| 3 | traceability | 0/0/2 | 0.6667 | PASS | One no-write scope failure, then reduced-scope retry; strict v2 pass |
| 4 | maintainability/stabilization | 0/0/0 | 0.0000 | PASS | Mechanical + strict v2 validator pass |

### Quality Gates

- Config and lineage match: PASS.
- Iteration completeness: PASS; four narratives, four canonical state records, and four matching deltas.
- Route proof: PASS for all four iterations.
- Evidence and severity: PASS; all active findings are P2 with direct citations.
- Adversarial P0/P1 replay: PASS vacuously; no P0/P1 was emitted, and terminal stabilization found none.
- Dimension coverage: PASS, 4/4.
- Corruption check: PASS, zero malformed JSONL rows.
- Candidate coverage: CONDITIONAL because one historical-provenance item remains deferred.
- Graphless fallback: PASS for the selected bug classes through cited direct-read and exact-search ledger rows.
- Stop policy: PASS; synthesis began only after iteration 4 reached `maxIterations`.

### Final Determination

The review's finding-only verdict is PASS with advisories. The final report is CONDITIONAL solely because the reducer-owned search ledger retains one explicit historical-provenance debt. No P0/P1 or current structural conformance failure was found.
