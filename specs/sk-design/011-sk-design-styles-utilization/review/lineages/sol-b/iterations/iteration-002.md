# Deep Review Iteration 002

## Dispatcher

- Resolved route: mode=review target_agent=deep-review
- Agent definition loaded: true
- Focus: security — corpus-to-prompt and transport trust boundaries
- Budget profile: verify
- Structural-impact analysis unavailable: the rendered prompt declared the code graph absent, so this iteration used a cited graphless direct-read/exact-search ledger.

## Files Reviewed

- `004-retrieval-substrate/spec.md`
- `004-retrieval-substrate/decision-record.md`
- `004-retrieval-substrate/checklist.md`
- `005-md-generator-schema-contract/{spec.md,plan.md,tasks.md,checklist.md,decision-record.md,implementation-summary.md}` (exact security-term search)
- `006-md-generator-study-exemplars/spec.md`
- `006-md-generator-study-exemplars/{plan.md,tasks.md,checklist.md,implementation-summary.md}` (exact security-term search)
- `007-shared-context-seam/**`, `008-interface-audit-pilots/**`, `009-foundations-motion/**`, and `010-open-design-transport/**` (scoped exact security-term searches over canonical packet documents)
- `.opencode/skills/sk-code/code-review/references/review_core.md` (severity doctrine only; read-only integration context)

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **Hydration has no path-containment or symlink safety contract** -- `004-retrieval-substrate/spec.md:124-136` -- The planned manifest and hydration requirements hash artifact content and reject stale generations, but they never require canonical root containment, traversal rejection, or symlink handling before reading manifest-selected artifact paths. The security checklist likewise tests mismatch, stale artifacts, and rights, but no outside-root path case (`004-retrieval-substrate/checklist.md:86-102`). An exact search across phase 004 found no `realpath`, symlink, traversal, root-containment, or outside-root control. A malicious or corrupted manifest/corpus entry could therefore direct the future hydrator outside `styles/` while still satisfying content hashing.
   Finding class: class-of-bug
   Scope proof: Exact phase-004 search for `symlink|realpath|outside.root|root containment|path traversal|traversal|allowlist|relative path|artifact path` found no containment requirement; the complete hydration requirement and security checklist were then read directly.
   Affected surface hints: `styles/_engine/manifest.mjs`, `styles/_engine/hydrate.mjs`, `styles/_engine/__tests__/**`

```json
{"type":"claim_adjudication","claim":"The planned hydration boundary can follow an artifact path outside the corpus root because containment and symlink behavior are unspecified.","evidenceRefs":["004-retrieval-substrate/spec.md:124-136","004-retrieval-substrate/spec.md:174-180","004-retrieval-substrate/checklist.md:86-102","004-retrieval-substrate/decision-record.md:245-273"],"counterevidenceSought":"Searched every phase-004 Markdown contract for canonicalization, realpath, symlink, traversal, allowlist, relative-path, and outside-root controls; reviewed hashing and generation-guard requirements.","alternativeExplanation":"The committed manifest and selected-artifact re-hash reduce accidental drift, but hashing does not establish that the resolved path remains beneath the approved corpus root.","finalSeverity":"P1","confidence":0.92,"downgradeTrigger":"Downgrade if an existing governing path parser contract is explicitly incorporated by reference and proves canonical root containment plus symlink rejection for every manifest and hydration read."}
```

2. **Unknown-rights styles are both forbidden from results and permitted as decision references** -- `004-retrieval-substrate/decision-record.md:153-157` -- ADR-002 says a rights-unknown style must never enter results, while the spec later allows unknown-rights styles to remain eligible as relationship/rationale references under the proof gate (`004-retrieval-substrate/spec.md:193-199`). The narrower no-exact-reuse rule at `spec.md:178-180` does not resolve whether unknown-rights content may influence downstream decisions, leaving eligibility and provenance enforcement with contradictory authorities.
   Finding class: cross-consumer
   Scope proof: Compared the eligibility ADR, P0 eligibility requirement, security NFR, unknown-rights edge case, and security checklist across the phase-004 packet; the contradiction spans ranking, cards, hydration, and proof consumers.
   Affected surface hints: `styles/_engine/eligibility.mjs`, `styles/_engine/cards.mjs`, `styles/_engine/hydrate.mjs`, `styles/_engine/corpus-use-proof.mjs`

```json
{"type":"claim_adjudication","claim":"The rights boundary is internally contradictory: rights-unknown styles must never enter results but may remain eligible as rationale references.","evidenceRefs":["004-retrieval-substrate/decision-record.md:153-157","004-retrieval-substrate/spec.md:124-127","004-retrieval-substrate/spec.md:178-180","004-retrieval-substrate/spec.md:193-199","004-retrieval-substrate/checklist.md:97-103"],"counterevidenceSought":"Reviewed the exact-reuse limitation and proof-card gate as possible narrower interpretations.","alternativeExplanation":"The author may intend to distinguish exact artifact reuse from abstract relationship evidence, but neither the eligibility schema nor acceptance criteria defines that split and ADR-002 uses the broader phrase 'into results'.","finalSeverity":"P1","confidence":0.95,"downgradeTrigger":"Downgrade after the contract defines separate rights states and fields for reference-only evidence, prohibits raw hydration for that state, and reconciles ADR-002 with the spec and tests."}
```

3. **The STUDY injection envelope has no malicious-instruction handling or test oracle** -- `006-md-generator-study-exemplars/spec.md:104-117` -- Phase 006 requires de-literalization, leak detection, and an auditable injection envelope, but does not specify that corpus text is untrusted, how embedded instructions are neutralized/delimited, or what validation makes an envelope safe. Its adversarial fixtures cover exact-value and normalized-span leakage rather than malicious instruction-following (`006-md-generator-study-exemplars/checklist.md:81-117`). Because the transformed observations are intentionally injected into the generation prompt, provenance metadata alone does not close the prompt-injection boundary.
   Finding class: cross-consumer
   Scope proof: Exact searches across all phase-006 Markdown documents found envelope and leak controls but no `malicious`, `untrusted`, `sanitize`, `escape`, or instruction-handling contract; direct reads covered the full requirement, NFR, edge-case, and checklist sections.
   Affected surface hints: `design-md-generator/**/study-envelope.ts`, `design-md-generator/**/study-*.ts`, `buildWritePrompt`, `buildPlan`, `runGuided`

```json
{"type":"claim_adjudication","claim":"The planned STUDY prompt boundary does not define or test resistance to malicious instructions embedded in corpus text.","evidenceRefs":["006-md-generator-study-exemplars/spec.md:104-117","006-md-generator-study-exemplars/spec.md:158-171","006-md-generator-study-exemplars/spec.md:176-191","006-md-generator-study-exemplars/checklist.md:81-117"],"counterevidenceSought":"Searched all phase-006 canonical documents for malicious, untrusted, instruction, delimiter, escape, sanitize, adversarial, and injection-envelope controls; reviewed the no-raw-few-shot and malformed-envelope refusals.","alternativeExplanation":"De-literalization and target-facts binding reduce copied values and authority drift, but neither defines behavior for semantically preserved adversarial instructions.","finalSeverity":"P1","confidence":0.90,"downgradeTrigger":"Downgrade if the envelope schema or transformer contract explicitly treats source text as inert data, rejects/neutralizes instruction-like content, and adds seeded prompt-injection fixtures with a fail-closed oracle."}
```

### P2 Findings

None.

## Traceability Checks

- `spec_code` (core): partial — security contracts and proposed implementation surfaces were mapped, but the strategy marks the prior consumer-level route BLOCKED and no runtime implementation exists to exercise.
- `checklist_evidence` (core): blocked carry-forward — checklist lines were used only as contract evidence; the blocked protocol approach was not retried as a completion-evidence audit.
- `feature_catalog_code` (overlay): not assessed; blocked carry-forward preserved.
- `playbook_capability` (overlay): not assessed; blocked carry-forward preserved.

## Integration Evidence

No current-iteration runtime integration evidence is claimed. Phases 004–010 remain planned scaffolds, and iteration 1 already exhausted the exact runtime-absence check. The affected-surface hints name the proposed `.opencode/skills/sk-design` consumers without treating them as implemented or reviewed code.

## Edge Cases

- **Partial implementation state:** Findings are defects in the approved planning contracts, not active exploit claims against shipped code; this contains severity at P1.
- **Trusted-repository alternative:** A fully trusted, immutable corpus would reduce path exploitability, but the planned build, manifest, fallback scan, and hydration boundaries process mutable repository artifacts and do not declare that trust assumption.
- **Rights semantics ambiguity:** Exact reuse and relationship/rationale reference may intentionally differ, but the current ADR and spec conflict; the lower supported P1 severity is retained pending a typed rights-state contract.
- **Structural limitation:** Code graph and `detect_changes` evidence were unavailable by dispatch; graphless direct reads and exact searches are recorded in state.

## Confirmed-Clean Surfaces

- Generation mismatch is fail-closed for hydration (`004-retrieval-substrate/spec.md:124-127`, `decision-record.md:245-273`).
- Phase 006 rejects malformed provenance envelopes and skips partial STUDY hydration (`006-md-generator-study-exemplars/spec.md:176-191`).
- Phase 010 consistently forbids raw corpus/Open-Design payload caching in its spec, tasks, checklist, plan, and implementation summary; implementation verification remains future work.

## Ruled Out

- **P0 escalation:** No security-sensitive runtime exists yet, so no currently exploitable path, authorization bypass, or destructive loss is evidenced.
- **False shipped-code finding:** Planned surface absence was established in iteration 1 and was not retried.
- **No-cache finding:** Phase 010's contract consistently states metadata-only/no-raw-payload caching; observability details can be verified during implementation rather than raised as a duplicate planning defect now.
- **Stale-generation finding:** Phase 004 and phase 006 explicitly reject stale hydration and provide bounded fallback behavior.

## Next Focus

- Dimension: traceability
- Focus area: parent/child status, spec-to-code claims, and non-blocked cross-reference evidence
- Reason: correctness and security now have full first-pass coverage; traceability is the next unchecked dimension
- Rotation status: first pass
- Blocked/productive carry-forward: direct reads and exact searches remain productive; memory, code graph, prior `spec_code` consumer route, and checklist-completion protocol remain blocked
- Required evidence: parent/child status contracts, named cross-references, and implementation-summary claims without retrying exhausted approaches

Review verdict: CONDITIONAL
