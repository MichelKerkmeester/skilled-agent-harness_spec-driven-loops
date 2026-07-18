# Deep Review Iteration 005 — Cross-Reference Stabilization

## Dispatcher

- Resolved route: `Resolved route: mode=review target_agent=deep-review`
- Target agent: `deep-review` (definition loaded; LEAF-only)
- Session: `fanout-sol-b-1784385520599-ecg4bg`, generation 1, lineage mode `new`
- Focus: replay active P1-001 through P1-006 and confirm P2-007 classification
- Budget profile: `verify`; graphless citation replay only, with no broad rediscovery
- Review-depth contract: v2, strict, graphless fallback; structural-impact analysis unavailable

## Files Reviewed

- Lifecycle citations: parent `spec.md`; `002-md-generator-upgrade/{spec.md,implementation-summary.md}`; `003-global-modes-utilization/{spec.md,implementation-summary.md}`
- Dependency citations: phase 005-010 `graph-metadata.json` plus the cited dependency sections in phase 005-010 specs/plans
- Security citations: `004-retrieval-substrate/{spec.md,checklist.md,decision-record.md}` and `006-md-generator-study-exemplars/{spec.md,checklist.md}`
- Synthesis-pointer citations: parent `spec.md`; phase 001-003 plans; `001-research-utilization/implementation-summary.md`; phase 001-003 `research/` directories
- Advisory citations: phase 004 plan; phase 007 spec/plan; phase 008-010 consumer plans
- Review state/doctrine: registry, state JSONL, strategy, iterations 001-004, `review_core.md`, and `state_jsonl.md`

## Findings - New

No net-new findings. The complete active set was replayed against current files.

### P0 Findings

None.

### P1 Findings

1. **P1-001 remains P1: completed research phases still advertise pre-dispatch continuation state** -- `002-md-generator-upgrade/spec.md:15` -- Phase 002 still says to dispatch research at 10% while its implementation summary records complete/100%; phase 003 has the same contradiction, and the parent still directs child 001 at 0% while its phase table marks 001-003 complete. Higher-precedence implementation summaries are valid counterevidence, but they do not repair the contradictory canonical spec continuity fields. [SOURCE: 002-md-generator-upgrade/spec.md:15-26] [SOURCE: 002-md-generator-upgrade/implementation-summary.md:10-27] [SOURCE: 003-global-modes-utilization/spec.md:15-26] [SOURCE: 003-global-modes-utilization/implementation-summary.md:10-27] [SOURCE: spec.md:15-25] [SOURCE: spec.md:46]
   - Finding class: cross-consumer
   - Scope proof: Current parent, phase-002, and phase-003 continuity blocks were reread against their current status and implementation-summary fields; all three contradictions remain.
   - Affected surface hints: `parent continuity`, `phase 002 resume`, `phase 003 resume`, `spec-memory indexing`

```json
{"type":"claim_adjudication","claim":"Canonical spec continuity fields still direct consumers to repeat completed research and report stale completion.","evidenceRefs":["002-md-generator-upgrade/spec.md:15-26","002-md-generator-upgrade/implementation-summary.md:10-27","003-global-modes-utilization/spec.md:15-26","003-global-modes-utilization/implementation-summary.md:10-27","spec.md:15-25","spec.md:46"],"counterevidenceSought":"Reread the higher-precedence implementation summaries and phase map; they correctly report completion and contain resume-ladder impact.","alternativeExplanation":"Consumers that exclusively honor implementation-summary continuity will avoid the stale fields, but canonical spec/index readers can still observe them.","finalSeverity":"P1","confidence":0.94,"downgradeTrigger":"Downgrade only if all relevant resume, indexing, and status consumers are proven to ignore these spec continuity fields after an implementation summary exists."}
```

2. **P1-002 remains P1: dependency graph metadata omits declared implementation prerequisites** -- `005-md-generator-schema-contract/graph-metadata.json:8` -- Phases 005-010 still expose empty `manual.depends_on` arrays while their current contracts require ordered prerequisites: 005 after 004; 006 after 004/005; 007 after 004; 008 after 004/007; 009 after 004/007/008; and 010 after 007/008. Human-readable dependency sections are counterevidence for maintainers, not a machine-readable replacement. [SOURCE: 005-md-generator-schema-contract/graph-metadata.json:7-10] [SOURCE: 005-md-generator-schema-contract/spec.md:143-148] [SOURCE: 006-md-generator-study-exemplars/graph-metadata.json:7-10] [SOURCE: 006-md-generator-study-exemplars/spec.md:134-143] [SOURCE: 007-shared-context-seam/graph-metadata.json:7-10] [SOURCE: 007-shared-context-seam/spec.md:128-135] [SOURCE: 008-interface-audit-pilots/graph-metadata.json:7-10] [SOURCE: 008-interface-audit-pilots/spec.md:151-156] [SOURCE: 009-foundations-motion/graph-metadata.json:7-10] [SOURCE: 009-foundations-motion/plan.md:143-151] [SOURCE: 010-open-design-transport/graph-metadata.json:7-10] [SOURCE: 010-open-design-transport/plan.md:132-139]
   - Finding class: class-of-bug
   - Scope proof: Every implementation-phase metadata file (005-010) was reread beside its current dependency contract; each machine field remains empty and every cited prerequisite remains declared.
   - Affected surface hints: `graph traversal`, `phase sequencing`, `blast-radius analysis`, `resume dependency context`

```json
{"type":"claim_adjudication","claim":"Machine-readable graph metadata still cannot represent the packet's declared implementation build order.","evidenceRefs":["005-md-generator-schema-contract/graph-metadata.json:7-10","005-md-generator-schema-contract/spec.md:143-148","006-md-generator-study-exemplars/graph-metadata.json:7-10","006-md-generator-study-exemplars/spec.md:134-143","007-shared-context-seam/graph-metadata.json:7-10","007-shared-context-seam/spec.md:128-135","008-interface-audit-pilots/graph-metadata.json:7-10","008-interface-audit-pilots/spec.md:151-156","009-foundations-motion/graph-metadata.json:7-10","009-foundations-motion/plan.md:143-151","010-open-design-transport/graph-metadata.json:7-10","010-open-design-transport/plan.md:132-139"],"counterevidenceSought":"Reread the human-readable phase map and dependency sections for an alternate canonical ordering source.","alternativeExplanation":"The arrays may require explicit authoring rather than derivation, but they are still the packet's machine-readable dependency surface.","finalSeverity":"P1","confidence":0.96,"downgradeTrigger":"Downgrade if graph/resume consumers are proven not to use manual.depends_on and another canonical machine-readable dependency source is identified."}
```

3. **P1-003 remains P1: hydration lacks a path-containment and symlink safety contract** -- `004-retrieval-substrate/spec.md:124` -- Current requirements still constrain hashes, generation, includes, and byte caps without requiring canonical-root containment, traversal rejection, or symlink handling before artifact reads. The adjacent checklist still tests generation mismatch, stale artifacts, and rights but no outside-root path. Hash revalidation is useful counterevidence for integrity, not path authorization. [SOURCE: 004-retrieval-substrate/spec.md:124-136] [SOURCE: 004-retrieval-substrate/spec.md:174-180] [SOURCE: 004-retrieval-substrate/checklist.md:86-102] [SOURCE: 004-retrieval-substrate/decision-record.md:245-273]
   - Finding class: class-of-bug
   - Scope proof: The complete current hydration requirement, reliability/security clauses, checklist guard matrix, and ADR were reread; none establishes root or symlink behavior.
   - Affected surface hints: `styles/_engine/manifest.mjs`, `styles/_engine/hydrate.mjs`, `styles/_engine/__tests__/**`

```json
{"type":"claim_adjudication","claim":"The planned hydrator can follow a selected artifact path outside the corpus root because containment and symlink behavior remain unspecified.","evidenceRefs":["004-retrieval-substrate/spec.md:124-136","004-retrieval-substrate/spec.md:174-180","004-retrieval-substrate/checklist.md:86-102","004-retrieval-substrate/decision-record.md:245-273"],"counterevidenceSought":"Reread generation hashing, selected-artifact rehashing, source-scan bounds, and the adversarial checklist as possible containment controls.","alternativeExplanation":"A trusted generated manifest reduces accidental drift, but the contract neither declares that trust boundary nor constrains resolved paths beneath the corpus root.","finalSeverity":"P1","confidence":0.93,"downgradeTrigger":"Downgrade if an incorporated path-parser contract proves canonical root containment and symlink rejection for every manifest and hydration read."}
```

4. **P1-004 remains P1: unknown-rights styles are forbidden from results but allowed as references** -- `004-retrieval-substrate/decision-record.md:153` -- ADR-002 still says rights-unknown styles must never enter results, while the spec still permits them as relationship/rationale references under the proof gate. NFR-S01 narrows exact reuse but does not reconcile result membership or define a reference-only rights state. [SOURCE: 004-retrieval-substrate/decision-record.md:153-157] [SOURCE: 004-retrieval-substrate/spec.md:124-127] [SOURCE: 004-retrieval-substrate/spec.md:178-180] [SOURCE: 004-retrieval-substrate/spec.md:193-199] [SOURCE: 004-retrieval-substrate/checklist.md:97-103]
   - Finding class: cross-consumer
   - Scope proof: Current ADR membership language was reread against eligibility, hydration, failure-scenario, and checklist clauses; the exact-reuse restriction is narrower than the unresolved result/reference contradiction.
   - Affected surface hints: `eligibility.mjs`, `cards.mjs`, `hydrate.mjs`, `corpus-use-proof.mjs`

```json
{"type":"claim_adjudication","claim":"The rights boundary remains contradictory because rights-unknown styles must never enter results yet may remain eligible as rationale references.","evidenceRefs":["004-retrieval-substrate/decision-record.md:153-157","004-retrieval-substrate/spec.md:124-127","004-retrieval-substrate/spec.md:178-180","004-retrieval-substrate/spec.md:193-199","004-retrieval-substrate/checklist.md:97-103"],"counterevidenceSought":"Reread the exact-reuse limitation and proof-card gate for a defined reference-only interpretation.","alternativeExplanation":"The intended distinction may be exact artifact reuse versus abstract relationship evidence, but no typed state reconciles that intent with ADR-002's broader result-membership rule.","finalSeverity":"P1","confidence":0.96,"downgradeTrigger":"Downgrade after separate reference-only rights fields, raw-hydration prohibition, reconciled ADR language, and matching tests are specified."}
```

5. **P1-005 remains P1: the STUDY envelope has no malicious-instruction handling oracle** -- `006-md-generator-study-exemplars/spec.md:104` -- The current contract still de-literalizes values, rejects malformed provenance, and leak-tests authored output, but it does not treat semantically preserved exemplar instructions as untrusted data or define neutralization/delimiting behavior. Current adversarial fixtures remain exact-value and normalized-span leak checks. [SOURCE: 006-md-generator-study-exemplars/spec.md:104-117] [SOURCE: 006-md-generator-study-exemplars/spec.md:158-171] [SOURCE: 006-md-generator-study-exemplars/spec.md:176-191] [SOURCE: 006-md-generator-study-exemplars/checklist.md:81-117]
   - Finding class: cross-consumer
   - Scope proof: The full current STUDY requirement, security/reliability clauses, edge cases, and checklist fixture matrix were reread; no malicious-instruction behavior or oracle is present.
   - Affected surface hints: `study-envelope.ts`, `study transformer`, `buildWritePrompt`, `buildPlan`, `runGuided`

```json
{"type":"claim_adjudication","claim":"The planned STUDY prompt boundary still does not define or test resistance to malicious instructions embedded in corpus text.","evidenceRefs":["006-md-generator-study-exemplars/spec.md:104-117","006-md-generator-study-exemplars/spec.md:158-171","006-md-generator-study-exemplars/spec.md:176-191","006-md-generator-study-exemplars/checklist.md:81-117"],"counterevidenceSought":"Reread de-literalization, provenance-envelope refusal, no-raw-few-shot, leak gates, and adversarial fixtures as possible instruction controls.","alternativeExplanation":"Those controls reduce literal copying and authority drift but do not specify behavior for semantically retained adversarial instructions.","finalSeverity":"P1","confidence":0.92,"downgradeTrigger":"Downgrade if the schema treats source observations as inert data, neutralizes instruction-like content, and adds seeded prompt-injection fixtures with a fail-closed oracle."}
```

6. **P1-006 remains P1: canonical research-output pointers bypass lineage-owned syntheses** -- `spec.md:125` -- The parent verification pointer and all three completed research plans still name unlineaged `research/research.md` outputs. Each current `research/` directory contains only `lineages/` plus orchestration artifacts, while implementation evidence names `research/lineages/sol/research.md`. The syntheses exist, but no stable alias repairs the canonical pointers. [SOURCE: spec.md:123-125] [SOURCE: 001-research-utilization/plan.md:43-48] [SOURCE: 002-md-generator-upgrade/plan.md:43-48] [SOURCE: 003-global-modes-utilization/plan.md:43-48] [SOURCE: 001-research-utilization/implementation-summary.md:60-64]
   - Finding class: cross-consumer
   - Scope proof: All four current canonical output pointers were reread, and all three `research/` directory roots were checked; no unlineaged `research.md` alias exists.
   - Affected surface hints: `parent phase handoff`, `child 001-003 plans`, `resume/navigation consumers`, `validation evidence readers`

```json
{"type":"claim_adjudication","claim":"Canonical handoff/output pointers for completed research still resolve to nonexistent unlineaged paths.","evidenceRefs":["spec.md:123-125","001-research-utilization/plan.md:43-48","002-md-generator-upgrade/plan.md:43-48","003-global-modes-utilization/plan.md:43-48","001-research-utilization/implementation-summary.md:60-64"],"counterevidenceSought":"Checked all three research directory roots for stable aliases and reread implementation evidence naming the lineage-owned synthesis.","alternativeExplanation":"The paths predate command-owned lineage placement, but they remain canonical verification/output fields and no resolver or alias is present.","finalSeverity":"P1","confidence":0.98,"downgradeTrigger":"Downgrade if a supported resolver is proven to interpret these placeholders or stable unlineaged aliases are added and verified."}
```

### P2 Findings

7. **P2-007 remains advisory: the shared cross-mode contract has no concrete package owner or phase-004 proof mapping** -- `007-shared-context-seam/spec.md:89` -- Phase 007 still proposes only “a new shared schema/validator package” while phase 004 names concrete proof modules and phases 008-010 consume the seam. This creates follow-on implementation ambiguity, but no implementation exists and consumer contracts explicitly avoid local schema redefinition; P2 remains the highest supported classification. [SOURCE: 004-retrieval-substrate/plan.md:80-87] [SOURCE: 007-shared-context-seam/spec.md:85-90] [SOURCE: 007-shared-context-seam/plan.md:44-54] [SOURCE: 007-shared-context-seam/plan.md:79-86] [SOURCE: 008-interface-audit-pilots/plan.md:81-88] [SOURCE: 009-foundations-motion/plan.md:97-105] [SOURCE: 010-open-design-transport/plan.md:61-65]
   - Finding class: cross-consumer
   - Scope proof: The concrete phase-004 owner, pathless phase-007 producer, and all named downstream consumer contracts were reread; no current code or competing implementation elevates the ambiguity to a correctness failure.
   - Affected surface hints: `phase-007 schema package`, `phase-004 proof adapter`, `phase-008-010 imports`

## Traceability Checks

| Protocol | Level | Result | Evidence |
|---|---|---|---|
| `spec_code` | core | pass (carry-forward) | Iteration 3 supplied the full graphless protocol pass; stabilization found no changed status/runtime claim. |
| `checklist_evidence` | core | pass (carry-forward) | Iteration 3 supplied the full graphless protocol pass; current cited checklist rows remain unchecked planning contracts. |
| `feature_catalog_code` | overlay | notApplicable (carry-forward) | No new packet delivery claim or implementation surface makes the overlay applicable. |
| `playbook_capability` | overlay | notApplicable (carry-forward) | No new packet delivery claim or implemented scenario makes the overlay applicable. |

## Integration Evidence

- Exact planned integration surfaces were reread where they are evidence: phase 004 `styles/_engine/{manifest,eligibility,cards,hydrate,corpus-use-proof}.mjs`; phase 006 `buildWritePrompt`, `buildPlan`, and `runGuided`; phase 007's unnamed package; and phase 008-010 consumers.
- No runtime implementation coverage is claimed. Phases 004-010 remain planned, so adjudication is limited to current packet contracts.
- The reducer-owned registry was read only to confirm six active P1s and one active P2; it was not modified.

## Edge Cases

- Higher-precedence implementation summaries contain P1-001's resume impact but do not make the stale spec continuity fields internally consistent.
- Human-readable dependency sections preserve build order for people but do not repair P1-002's empty machine-readable dependency surface.
- Hashing and generation guards address integrity/staleness, not P1-003 path authorization.
- Exact reuse and relationship/rationale evidence may be intended as different rights states; P1-004 remains at the lower supported P1 pending a typed distinction.
- The exact dependency-search regex attempted during replay used unsupported look-around; direct reads of all implementation-phase metadata supplied complete evidence, so no search debt remains.
- Structural-impact analysis remains unavailable; no replay disposition depends on transitive graph evidence.

## Confirmed-Clean Surfaces

- All six P1 claims retain concrete current file:line evidence and complete compact skeptic/referee adjudication packets.
- No P0 candidate emerged: the implementation phases remain planned, and no active exploit, destructive loss, or authorization bypass is evidenced.
- P2-007 remains advisory because its risk is an unresolved implementation-location decision, not current behavioral failure.
- Active counts agree across the rendered prompt, registry, strategy, and replay: P0=0, P1=6, P2=1.

## Ruled Out

- Severity downgrades for P1-001 through P1-006: adjacent counterevidence contains impact but does not disprove the current contradictions or missing controls.
- P0 escalation for P1-003 through P1-005: no security-sensitive runtime exists yet.
- A new dependency finding: phase 009/010 evidence remains part of P1-002's same root cause.
- A new lifecycle finding: parent continuity remains part of P1-001's same root cause.
- P1 escalation for P2-007: no competing implementation or broken consumer exists; consumer-local redefinition remains explicitly prohibited.

## V2 Graphless Replay Ledger

- Applicability: `reviewDepthSchemaVersion=2`; `scopeClass=complex`; `enforcement=strict`; six active gate-relevant findings and one cross-consumer advisory span lifecycle, metadata, trust boundaries, pointers, and ownership.
- Target selection: only active finding citations and adjacent counterevidence were selected; discovery methods were direct reads, exact text search, directory existence checks, and prior-state replay. Graph and semantic search were unavailable; no identified high-risk citation target was omitted.
- Coverage: `lifecycle_state_contradiction`, `dependency_metadata_omission`, `hydration_path_containment`, `rights_state_contradiction`, `study_prompt_injection`, `stale_synthesis_pointers`, and `shared_contract_ownership` were all covered conclusively by graphless fallback; none was deferred or blocked.
- `SL-005-01` — finding `P1-001` — current stale continuity fields replayed against complete/100% implementation summaries; P1 confirmed.
- `SL-005-02` — finding `P1-002` — phase 005-010 empty arrays replayed against every cited prerequisite section; P1 confirmed.
- `SL-005-03` — finding `P1-003` — hydration/hash contracts replayed against containment/symlink hypothesis; P1 confirmed.
- `SL-005-04` — finding `P1-004` — ADR result membership replayed against exact-reuse/reference clauses; P1 confirmed.
- `SL-005-05` — finding `P1-005` — STUDY envelope/leak fixtures replayed against malicious-instruction hypothesis; P1 confirmed.
- `SL-005-06` — finding `P1-006` — canonical pointers replayed against all three research roots and lineage-owned outputs; P1 confirmed.
- `SL-005-07` — finding `P2-007` — ownership ambiguity replayed against concrete producer and non-redefining consumers; P2 confirmed.
- Search debt: none for the stabilization mandate. Future runtime/transitive verification remains implementation-stage evidence, not a blocker to this replay.

## Next Focus

- Dimension: convergence decision
- Focus area: reducer refresh and synthesis of the stable active finding set
- Reason: all four dimensions, both core protocols, and the required stabilization replay are complete with `newFindingsRatio=0`
- Rotation status: stabilization complete; legal convergence recommended
- Blocked/productive carry-forward: preserve graphless evidence; do not retry memory, graph, broad rediscovery, duplicate-root, or ruled-out severity routes without changed target files
- Required evidence: reducer verification that state/delta/narrative agree and that active counts remain P0=0, P1=6, P2=1

Review verdict: CONDITIONAL
