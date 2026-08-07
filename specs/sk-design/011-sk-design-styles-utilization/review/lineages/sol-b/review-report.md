---
title: "Deep Review Report: sk-design styles-library utilization"
description: "Five-iteration detached review of the phase-parent packet and its planned sk-design utilization contracts."
verdict: "CONDITIONAL"
hasAdvisories: false
sessionId: "fanout-sol-b-1784385520599-ecg4bg"
generation: 1
stopReason: "converged"
---

# Deep Review Report: sk-design styles-library utilization

## Executive Summary

- **Verdict:** CONDITIONAL
- **Active findings:** P0=0, P1=6, P2=1
- **hasAdvisories:** false (`hasAdvisories` is reserved for PASS with P2-only findings)
- **Release-readiness state:** converged review, remediation required before implementation proceeds
- **Scope:** `.opencode/specs/sk-design/011-sk-design-styles-utilization`, child phases 001-010, and the `.opencode/skills/sk-design/**` surfaces those phases name
- **Stop reason:** legal convergence after five iterations, 4/4 dimensions, both core protocols, and one stabilization replay
- **Evidence mode:** direct reads and exact searches; memory retrieval timed out and the workspace code graph was absent

No shipped runtime exploit was found because implementation phases 004-010 remain planned. Six required issues exist in the planning and continuity contracts that would otherwise propagate into implementation, navigation, or security boundaries.

## Planning Trigger

`/speckit:plan` is required. The six P1 findings must be incorporated into the relevant implementation-phase plans before runtime work starts.

**Planning Packet**

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": ["P1-001", "P1-002", "P1-003", "P1-004", "P1-005", "P1-006", "P2-007"],
  "remediationWorkstreams": [
    {"id": "W1", "title": "Continuity, dependency, and synthesis-pointer repair", "findings": ["P1-001", "P1-002", "P1-006"]},
    {"id": "W2", "title": "Retrieval path and rights-boundary hardening", "findings": ["P1-003", "P1-004"]},
    {"id": "W3", "title": "STUDY prompt-injection contract", "findings": ["P1-005"]},
    {"id": "W4", "title": "Shared contract ownership decision", "findings": ["P2-007"]}
  ],
  "specSeed": [
    "Reconcile completed-phase continuity and lineage-owned synthesis paths.",
    "Persist the declared child dependency graph in graph metadata.",
    "Specify canonical corpus-root containment, symlink behavior, and rights states.",
    "Treat STUDY corpus observations as untrusted inert data and add an injection oracle.",
    "Name the CORPUS_CONTEXT_PLAN package owner and its mapping to CORPUS_USE_PROOF."
  ],
  "planSeed": [
    "Repair metadata and path references before implementation dispatch.",
    "Add security acceptance criteria and adversarial fixtures to phases 004 and 006.",
    "Record a single shared-package ownership decision before phases 007-010 build consumers.",
    "Re-run strict recursive packet validation and a focused review replay."
  ],
  "findingClasses": {
    "cross-consumer": ["P1-001", "P1-004", "P1-005", "P1-006", "P2-007"],
    "class-of-bug": ["P1-002", "P1-003"]
  },
  "affectedSurfacesSeed": [
    "packet continuity and memory indexing",
    "graph metadata and phase sequencing",
    "styles retrieval manifest and hydrator",
    "rights eligibility, cards, hydration, and proof",
    "design-md-generator STUDY prompt boundary",
    "phase 007 shared schema and phases 008-010 consumers"
  ],
  "fixCompletenessRequired": true
}
```

<!-- ANCHOR:active-finding-registry -->
## Active Finding Registry

### P1-001: Completed research phases retain stale continuation state

- **Severity / dimension:** P1 / correctness
- **Evidence:** `002-md-generator-upgrade/spec.md:15-26`, `003-global-modes-utilization/spec.md:15-26`, `spec.md:15-25`
- **Impact:** Resume, indexing, and direct status consumers can repeat completed research or report false progress.
- **Disposition:** Active and stable through iteration 5.
- **Finding class:** cross-consumer
- **Scope proof:** Parent and all child lifecycle fields were searched; contradictions occur in the parent and completed phases 002-003, while implementation summaries correctly report 100% completion.
- **Affected surfaces:** parent continuity, phase 002/003 resume, spec-memory indexing
- **Recommendation:** Reconcile canonical continuity fields with completed summaries and set the parent next action to the first planned implementation phase.

### P1-002: Dependency metadata omits the declared implementation order

- **Severity / dimension:** P1 / correctness
- **Evidence:** `005-md-generator-schema-contract/graph-metadata.json:7-10`, `006-md-generator-study-exemplars/graph-metadata.json:7-10`, `007-shared-context-seam/graph-metadata.json:7-10`, `008-interface-audit-pilots/graph-metadata.json:7-10`, `009-foundations-motion/graph-metadata.json:7-10`, `010-open-design-transport/graph-metadata.json:7-10`
- **Impact:** Graph traversal, resume context, sequencing, and blast-radius analysis cannot represent documented prerequisites.
- **Disposition:** Active and refined through phases 009-010 in iteration 5.
- **Finding class:** class-of-bug
- **Scope proof:** Every implementation-phase dependency array is empty while the associated specs/plans declare prerequisites.
- **Affected surfaces:** graph traversal, phase sequencing, impact analysis, resume context
- **Recommendation:** Populate `manual.depends_on` from the approved phase order and validate the dependency chain.

### P1-003: Hydration lacks a root-containment and symlink contract

- **Severity / dimension:** P1 / security
- **Evidence:** `004-retrieval-substrate/spec.md:124-136`, `004-retrieval-substrate/checklist.md:86-102`, `004-retrieval-substrate/decision-record.md:245-273`
- **Impact:** A future malicious or corrupted manifest entry could select a path outside the styles corpus while still satisfying hash checks.
- **Disposition:** Active; no runtime exploit claim because phase 004 is unimplemented.
- **Finding class:** class-of-bug
- **Scope proof:** Full phase-004 path-safety search and direct hydration/checklist reads found no canonical-root, traversal, or symlink rule.
- **Affected surfaces:** `manifest.mjs`, `hydrate.mjs`, retrieval security fixtures
- **Recommendation:** Require canonical realpath containment under the corpus root, define symlink policy, reject traversal, and add outside-root fixtures.

### P1-004: Unknown-rights styles are both forbidden and permitted

- **Severity / dimension:** P1 / security
- **Evidence:** `004-retrieval-substrate/decision-record.md:153-157`, `004-retrieval-substrate/spec.md:178-180`, `004-retrieval-substrate/spec.md:193-199`
- **Impact:** Eligibility, cards, hydration, and proof consumers have contradictory authority for reference-only use.
- **Disposition:** Active; exact-reuse language does not resolve result membership.
- **Finding class:** cross-consumer
- **Scope proof:** ADR, requirement, NFR, edge-case, and checklist language were compared directly.
- **Affected surfaces:** eligibility, cards, hydration, corpus-use proof
- **Recommendation:** Define typed rights states and a reference-only lane that prohibits raw hydration, then reconcile ADR and tests.

### P1-005: STUDY lacks malicious-instruction handling

- **Severity / dimension:** P1 / security
- **Evidence:** `006-md-generator-study-exemplars/spec.md:104-117`, `006-md-generator-study-exemplars/spec.md:158-191`, `006-md-generator-study-exemplars/checklist.md:81-117`
- **Impact:** Semantically preserved instructions in corpus material could influence generation despite provenance and source-leak controls.
- **Disposition:** Active; no shipped prompt boundary exists yet.
- **Finding class:** cross-consumer
- **Scope proof:** Full phase-006 searches found de-literalization and leak controls but no inert-data, delimiter, neutralization, or malicious-instruction oracle.
- **Affected surfaces:** STUDY transformer/envelope, `buildWritePrompt`, `buildPlan`, `runGuided`
- **Recommendation:** Mark source observations untrusted and inert, define neutralization/delimiting rules, and add seeded injection fixtures with fail-closed outcomes.

### P1-006: Canonical research pointers miss lineage-owned syntheses

- **Severity / dimension:** P1 / traceability
- **Evidence:** `spec.md:123-125`, `001-research-utilization/plan.md:43-48`, `002-md-generator-upgrade/plan.md:43-48`, `003-global-modes-utilization/plan.md:43-48`
- **Impact:** Handoff and output pointers used by reviewers or automation resolve to nonexistent unlineaged paths.
- **Disposition:** Active; all three actual `research/lineages/sol/research.md` syntheses exist.
- **Finding class:** cross-consumer
- **Scope proof:** Packet-wide path search found four stale pointers and no stable unlineaged aliases.
- **Affected surfaces:** parent handoff, research plans, resume/navigation, validation evidence
- **Recommendation:** Point directly to lineage-owned syntheses or intentionally publish and verify stable aliases.

### P2-007: Shared cross-mode contract has no concrete owner path

- **Severity / dimension:** P2 / maintainability
- **Evidence:** `007-shared-context-seam/spec.md:85-90`, `007-shared-context-seam/plan.md:44-54`, `004-retrieval-substrate/plan.md:80-87`
- **Impact:** Implementers can create parallel schema authorities or adapters before phases 008-010 consume the seam.
- **Disposition:** Active advisory; consumers currently prohibit local redefinition, so this is not a present correctness failure.
- **Finding class:** cross-consumer
- **Scope proof:** Phase-004 producer, phase-007 seam, and phase-008-010 consumers were compared.
- **Affected surfaces:** phase-007 package, phase-004 proof adapter, downstream mode imports
- **Recommendation:** Name one canonical module/type owner and document import/adaptation from `CORPUS_USE_PROOF v1`.
<!-- /ANCHOR:active-finding-registry -->

## Remediation Workstreams

1. **W1: Continuity and machine-readable sequencing** (`P1-001`, `P1-002`, `P1-006`): repair stale continuation data, populate dependency edges, and correct synthesis paths before any implementation dispatch.
2. **W2: Retrieval trust boundary** (`P1-003`, `P1-004`): define path authorization and typed rights states before implementing manifest selection or hydration.
3. **W3: Prompt-injection resistance** (`P1-005`): add an explicit untrusted-data contract and adversarial oracle before STUDY can enter a generation prompt.
4. **W4: Shared ownership** (`P2-007`): make the shared package and phase-004 mapping explicit before downstream consumers import it.

## Spec Seed

- Add canonical continuity completion rules to the parent and completed research children.
- Add explicit machine-readable dependency acceptance criteria for phases 005-010.
- Add corpus-root containment, traversal rejection, and symlink semantics to phase 004.
- Replace the rights contradiction with typed `reusable`, `reference-only`, and `ineligible` behavior.
- Add a phase-006 requirement that corpus observations remain inert untrusted data and cannot issue instructions.
- Replace research synthesis placeholders with exact lineage paths or a stable-alias requirement.
- Name the phase-007 package/export owner and its relationship to phase-004 proof data.

## Plan Seed

1. Update packet metadata and canonical research pointers; verify resume and graph readers against the corrected fields.
2. Amend phase-004 spec, ADRs, checklist, and tests for path containment and typed rights behavior.
3. Amend phase-006 spec/checklist for malicious-instruction neutralization and seeded adversarial fixtures.
4. Record the phase-007 package/adapter decision and update phases 008-010 to import that owner.
5. Run recursive strict packet validation, metadata generation checks, and a focused deep-review replay.

## Traceability Status

| Protocol | Gate | Status | Evidence |
|----------|------|--------|----------|
| `spec_code` | hard | pass | Iteration 3 verified parent/child status and planned runtime absence against summaries and named surfaces. |
| `checklist_evidence` | hard | pass | Completed research tasks have artifact evidence; planned checklists contain no premature checks. |
| `feature_catalog_code` | advisory | notApplicable | The packet claims no feature-catalog delivery for planned phases. |
| `playbook_capability` | advisory | notApplicable | The packet claims no implemented playbook scenarios for planned phases. |
| `AC_COVERAGE` | advisory | exempt | Phase-parent has no parent `checklist.md` or lifecycle-active parent implementation summary. |

The source packet had no `resource-map.md` at initialization, so the Resource Map Coverage Gate is not applicable. The lineage-local generated `resource-map.md` is synthesis telemetry, not an input gate.

## Deferred Items

- `P2-007` is advisory but should be resolved before phase 007 implementation starts.
- Runtime, negative-test, and transitive-import verification remain future evidence because phases 004-010 are planned and the code graph was unavailable.
- The generated lineage resource map reports packet-relative finding paths as missing because they are resolved from the lineage directory; this telemetry issue does not alter target findings or the skipped input resource-map gate.

## Dimension Expansion Map

- **Completed pivots:** 0
- **Failed pivots:** 0
- **Audited overrides:** 0
- **Swept dimensions:** correctness, security, traceability, maintainability, stabilization
- **Selected directions:** lifecycle/ordering, trust boundaries, core traceability, ownership/rollback, active-finding replay
- **Remaining frontier:** none for the current unchanged target snapshot

## Search Ledger

- **reviewDepthSchemaVersion:** 2 for every iteration
- **graphCoverageMode:** `graphless_fallback`
- **Required bug classes covered:** lifecycle contradiction, dependency metadata, path containment, rights state, STUDY injection, synthesis pointers, shared ownership
- **Candidate coverage:** 11 covered, 2 ruled out, 0 deferred, 0 blocked
- **Search debt:** none
- **Ruled out:** consumer-local schema redefinition, chain-wide coupled rollback, false shipped-code claims, P0 escalation without runtime evidence
- **Clean search proof:** direct cited reads support each ruled-out class; stabilization replay covered all seven active findings

## Audit Appendix

### Iteration Record

| Iteration | Dimension | New P0/P1/P2 | Ratio | Result |
|-----------|-----------|---------------|-------|--------|
| 1 | Correctness | 0/2/0 | 1.0000 | Two P1 findings |
| 2 | Security | 0/3/0 | 0.6000 | Three P1 findings |
| 3 | Traceability | 0/1/0 | 0.2500 | Core protocols pass; one P1 |
| 4 | Maintainability | 0/0/1 | 0.1129 | One P2; one P1 refinement |
| 5 | Stabilization | 0/0/0 | 0.0000 | Seven classifications stable |

### Convergence Replay

- Last-two rolling average: `0.0564516129` (passes `<= 0.08`)
- MAD noise floor: `0.37065`; latest ratio `0` (passes)
- Dimension coverage: 4/4 with one stabilization pass
- Composite convergence score: `1.0`
- Active P0: 0
- Claim adjudication: pass for six active P1 findings
- Candidate/search debt: none
- Graphless fallback: all seven required bug classes have cited direct-read ledger rows
- Stop decision: `converged`

### Binary Gates

| Gate | Result |
|------|--------|
| Convergence | PASS |
| Dimension and protocol coverage | PASS |
| P0 resolution | PASS |
| Evidence density | PASS |
| Hotspot stabilization | PASS |
| Claim adjudication | PASS |
| Fix-completeness replay | PASS (not a post-fix rerun) |
| Candidate coverage | PASS |
| Graphless fallback | PASS |

### Replay Caveats

- Memory context retrieval timed out twice and was not used.
- Workspace code graph status was `absent` with zero nodes; direct Read/Grep/Glob evidence replaced structural queries.
- No target file was modified by this review.

Review verdict: CONDITIONAL
