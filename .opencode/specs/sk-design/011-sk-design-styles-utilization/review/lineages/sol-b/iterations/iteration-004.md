# Deep Review Iteration 004 — Maintainability

## Dispatcher

- Resolved route: `Resolved route: mode=review target_agent=deep-review`
- Target agent: `deep-review` (definition loaded; LEAF-only)
- Focus: ownership, shared-contract duplication, concrete implementation locations, sequencing, and independently operable rollback boundaries across phases 004-010
- Budget profile: `verify` (graphless direct-read/exact-search workflow)
- Review-depth contract: v2, graphless; structural-impact analysis unavailable by dispatch contract

## Files Reviewed

- `004-retrieval-substrate/plan.md`
- `005-md-generator-schema-contract/plan.md`
- `006-md-generator-study-exemplars/plan.md`
- `007-shared-context-seam/{spec.md,plan.md}`
- `008-interface-audit-pilots/{plan.md,checklist.md}`
- `009-foundations-motion/plan.md`
- `010-open-design-transport/{plan.md,tasks.md,checklist.md}`
- Prior finding evidence in `review/lineages/sol-b/iterations/iteration-001.md`
- Shared severity and v2 state doctrine: `.opencode/skills/sk-code/code-review/references/review_core.md` and `.opencode/skills/system-deep-loop/deep-review/references/state/state_jsonl.md`

## Findings - New

### P0 Findings

None.

### P1 Findings

No new P1 finding. Existing P1-002 is refined: phases 009 and 010 add further declared prerequisites to the same packet-wide dependency-metadata omission. [SOURCE: 009-foundations-motion/plan.md:143-151] [SOURCE: 010-open-design-transport/plan.md:132-139]

### P2 Findings

1. **The shared cross-mode contract has no concrete package owner or explicit phase-004 proof mapping** — `007-shared-context-seam/spec.md:89` — Phase 004 gives its proof contract a concrete owner (`styles/_engine/corpus-use-proof.mjs`), while phase 007 introduces overlapping generation, source, provenance, transformation, fallback, and proof fields in only “a new shared schema/validator package (kept OUT of the hub).” The phase-007 plan never names a path/import boundary or maps those fields to `CORPUS_USE_PROOF v1`, even though phases 008-010 are told to consume the seam. That leaves implementers free to create parallel schema authorities or mode-local copies before a canonical package is chosen. [SOURCE: 004-retrieval-substrate/plan.md:80-87] [SOURCE: 007-shared-context-seam/spec.md:85-90] [SOURCE: 007-shared-context-seam/plan.md:44-54] [SOURCE: 007-shared-context-seam/plan.md:79-86] [SOURCE: 008-interface-audit-pilots/plan.md:81-88] [SOURCE: 009-foundations-motion/plan.md:97-105] [SOURCE: 010-open-design-transport/plan.md:61-65]
   - Finding class: cross-consumer
   - Scope proof: Exact ownership/proof searches and direct reads covered the phase-004 proof producer, the phase-007 proposed shared owner, and all downstream phase-008-010 consumers. Phase 004 is concrete; phase 007 repeatedly remains pathless, and no reviewed phase-007-010 contract names an adapter or import from `CORPUS_USE_PROOF v1`.
   - Affected surface hints: phase-007 schema package, phase-004 proof-card adapter, phase-008 pilot imports, phase-009 mode imports, phase-010 receipt schema
   - Recommendation: Before implementation, name one canonical package/module path and exported type owner for `CORPUS_CONTEXT_PLAN v1`, then document whether phase-004 proof fields are imported, adapted, or intentionally distinct; require downstream phases to import that owner rather than restate fields.

## Traceability Checks

| Protocol | Level | Result | Evidence |
|---|---|---|---|
| `spec_code` | core | pass (carry-forward) | Not re-executed; iteration 3 supplied the required full graphless protocol pass. |
| `checklist_evidence` | core | pass (carry-forward) | Not re-executed; iteration 3 supplied the required full graphless protocol pass. |
| `feature_catalog_code` | overlay | notApplicable (carry-forward) | Maintainability review found no new packet delivery claim that makes the overlay applicable. |
| `playbook_capability` | overlay | notApplicable (carry-forward) | Maintainability review found no new packet delivery claim that makes the overlay applicable. |

## Integration Evidence

- Proposed producer/consumer seams were reviewed exactly in packet docs: phase 004 `styles/_engine/corpus-use-proof.mjs`, phase 007's unnamed shared package, phase 008 `{design-interface,design-audit}`, phase 009 `{design-foundations,design-motion}`, and phase 010 `design-mcp-open-design/`.
- No runtime implementation surface was reread or claimed covered in this iteration; all seven phases remain planned, so the evidence boundary is the implementation contract.

## Edge Cases

- **Refinement, not duplicate:** P1-002 already covers omitted machine-readable prerequisites. Phase 009's phase-004/007/008 prerequisites and phase 010's phase-007/008 prerequisites strengthen its sequencing and maintenance blast radius rather than creating a new finding.
- Phase 004's `CORPUS_USE_PROOF v1` and phase 007's `CORPUS_CONTEXT_PLAN v1` may be intentionally different layers. The P2 asks for an explicit ownership/mapping decision, not forced schema unification.
- Phase 006's provenance/rights/injection envelope is md-generator-specific and phase 007 explicitly excludes md-generator work; it was not counted as downstream duplication.
- Structural-impact analysis remains unavailable. Direct reads and exact searches establish the planned contract boundary but cannot enumerate future transitive imports.

## Confirmed-Clean Surfaces

- Phase 005 names one schema authority and a drift sentinel; consumers are required to resolve against it rather than redefine facts. [SOURCE: 005-md-generator-schema-contract/plan.md:77-87]
- Phase 006 has an isolated STUDY switch and byte-identical no-STUDY path, providing an independently operable rollback contract. [SOURCE: 006-md-generator-study-exemplars/plan.md:61-71] [SOURCE: 006-md-generator-study-exemplars/plan.md:149-153]
- Phase 008 requires a feature flag for each of its two consumers and verifies both off paths. [SOURCE: 008-interface-audit-pilots/plan.md:198-209] [SOURCE: 008-interface-audit-pilots/checklist.md:163-168]
- Phases 009 and 010 isolate changes under mode/transport-owned directories, making code-only rollback separable from phases 004/007. [SOURCE: 009-foundations-motion/plan.md:155-160] [SOURCE: 010-open-design-transport/plan.md:143-147]

## Ruled Out

- Consumer-local field duplication in phases 008-009: their plans explicitly say to consume/reference the phase-007 fields without extending or redefining the shared schema.
- Coupled rollback across the whole chain: phase 006 has its own switch, phase 008 requires per-consumer flags, and phases 009/010 confine rollback to their owned directories.
- A second dependency-ordering finding: the additional 009/010 evidence refines P1-002.

## V2 Graphless Search Ledger

- Applicability: `scopeClass=complex`, `enforcement=strict`; seven planned phases share producers, consumers, schemas, and rollback boundaries.
- Target selection: phase-004 proof owner; phase-005 schema-owner pattern; phase-006 STUDY switch; phase-007 shared seam; phase-008-010 consumers and rollback contracts. Discovery used exact search and direct reads; graph and semantic search were unavailable.
- Coverage: contract ownership, shared-field duplication, concrete location, dependency sequencing, and rollback independence all received conclusive graphless treatment; no class was deferred or blocked.
- `SL-004-01` — `contract_ownership_and_concrete_location` — finding `P2-007`; direct reads show a concrete phase-004 owner but only an unnamed phase-007 package and no proof-field adapter.
- `SL-004-02` — `dependency_sequencing` — finding/refinement `P1-002`; direct reads extend the same empty-metadata class through phase 009 and phase 010 prerequisites.
- `SL-004-03` — `consumer_field_redefinition` — ruled out; phase 008 binds the seam without extending it and phase 009 marks the seam unchanged/consumed.
- `SL-004-04` — `rollback_independence` — ruled out; phase 006, 008, 009, and 010 each preserve a phase-local off/revert boundary.
- Search debt: future transitive imports cannot be enumerated until implementation and a usable code graph exist; no active finding depends on that unavailable evidence.

## Next Focus

- Dimension: cross-reference stabilization
- Focus area: replay active P0/P1 evidence and confirm no severity or scope drift after all four dimensions
- Reason: correctness, security, traceability, and maintainability now each have a full pass; one stabilization pass remains before legal convergence
- Rotation status: stabilization
- Blocked/productive carry-forward: direct reads and exact searches remain productive; memory, graph, false shipped-code, completed core-protocol, and duplicate dependency-finding routes remain blocked/exhausted
- Required evidence: current-file rereads for P1-001 through P1-006, claim-adjudication completeness, and active-count agreement across state and reducer outputs

Review verdict: CONDITIONAL
