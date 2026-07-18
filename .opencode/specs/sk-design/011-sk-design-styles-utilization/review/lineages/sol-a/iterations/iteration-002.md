# Deep Review Iteration 002

## Dispatcher
- Route: `mode=review`, `target_agent=deep-review`, single LEAF iteration
- Focus: security boundaries across phases 004, 006, 007, and 010
- Budget profile: `verify` (graphless fallback; direct reads plus one scoped counterevidence search)

## Files Reviewed
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/004-retrieval-substrate/spec.md`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/006-md-generator-study-exemplars/spec.md`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/007-shared-context-seam/spec.md`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/010-open-design-transport/spec.md`
- `.opencode/skills/sk-design/design-mcp-open-design/SKILL.md`
- Prior iteration narrative and lineage state for carry-forward adjudication

## Findings - New

### P0 Findings
None.

### P1 Findings
1. **Hydration has no contracted filesystem-containment boundary** -- `.opencode/specs/sk-design/011-sk-design-styles-utilization/004-retrieval-substrate/spec.md:103-112` -- The planned CLI generates paths from the corpus and hydrates selected artifacts, but neither the requirements nor the invalidation fixtures require canonical root confinement, traversal rejection, or symlink handling. Generation hashes prevent stale reads, not reads that resolve outside `styles/`; an implementation can satisfy every stated acceptance criterion while following a poisoned bundle path beyond the corpus root. [SOURCE: `.opencode/specs/sk-design/011-sk-design-styles-utilization/004-retrieval-substrate/spec.md:103-112`] [SOURCE: `.opencode/specs/sk-design/011-sk-design-styles-utilization/004-retrieval-substrate/spec.md:124-136`] [SOURCE: `.opencode/specs/sk-design/011-sk-design-styles-utilization/004-retrieval-substrate/spec.md:188-200`]
   - Finding class: class-of-bug
   - Scope proof: A scoped exact search across phase 004/006/007/010 specs, plans, tasks, checklists, and summaries found no `realpath`, symlink, traversal, canonicalization, or root-confinement contract; phase 004 is the sole planned filesystem producer for downstream hydration.
   - Affected surface hints: `manifest generator`, `hydrate CLI`, `source-scan fallback`, `STUDY hydration`
   - Recommendation: Require lexical and realpath containment under the canonical corpus root, define symlink policy, fail closed before reading, and add traversal/symlink fixtures to phase-004 invalidation tests.

```json
{"type":"claim-adjudication","findingId":"SOL-A-I002-P1-001","claim":"The phase-004 contract permits a conforming implementation to hydrate a corpus path that resolves outside the styles root because no containment or symlink invariant is specified.","evidenceRefs":[".opencode/specs/sk-design/011-sk-design-styles-utilization/004-retrieval-substrate/spec.md:103-112",".opencode/specs/sk-design/011-sk-design-styles-utilization/004-retrieval-substrate/spec.md:124-136",".opencode/specs/sk-design/011-sk-design-styles-utilization/004-retrieval-substrate/spec.md:188-200"],"counterevidenceSought":"Searched every phase-004/006/007/010 planning artifact for realpath, canonicalization, path traversal, path escape, root confinement, and symlink controls; reviewed generation-mismatch and permitted-artifact language as possible containment substitutes.","alternativeExplanation":"Manifest records may ultimately be generated only from fixed immediate child directories and implementation may independently enforce root containment, but neither condition is an acceptance criterion or fixture, while live source-scan and hydration are explicitly planned filesystem reads.","finalSeverity":"P1","confidence":0.9,"downgradeTrigger":"Downgrade to P2 if the implementation contract is amended to prove immutable manifest-derived paths, canonical root containment, explicit symlink policy, and negative traversal fixtures before any read."}
```

2. **The STUDY injection envelope records a boundary but does not neutralize untrusted instructions** -- `.opencode/specs/sk-design/011-sk-design-styles-utilization/006-md-generator-study-exemplars/spec.md:104-117` -- The planned flow reads corpus prose, transforms it, and injects observations into a model prompt. Its security contract requires an auditable “injection envelope,” yet defines no data-only parsing rule, imperative/instruction rejection, escaping boundary, or adversarial prompt-injection fixture. The exact-value and normalized-span gates detect copying after generation; they do not prevent source instructions from steering the model without literal leakage. [SOURCE: `.opencode/specs/sk-design/011-sk-design-styles-utilization/006-md-generator-study-exemplars/spec.md:73-79`] [SOURCE: `.opencode/specs/sk-design/011-sk-design-styles-utilization/006-md-generator-study-exemplars/spec.md:104-117`] [SOURCE: `.opencode/specs/sk-design/011-sk-design-styles-utilization/006-md-generator-study-exemplars/spec.md:165-187`]
   - Finding class: cross-consumer
   - Scope proof: Scoped counterevidence search found the envelope repeated in phase-006 spec/plan/tasks/checklist, but no instruction-treatment or prompt-injection acceptance criterion; phase 007's fixed authority order constrains decisions but does not sanitize phase-006 prompt content.
   - Affected surface hints: `study transformer`, `STUDY prompt block`, `adversarial fixtures`, `runGuided retry`
   - Recommendation: Define corpus content as untrusted data, constrain the transformer to an allowlisted observation schema, reject instruction-like content, preserve a hard prompt boundary, and add indirect/no-literal prompt-injection fixtures whose success criterion is behavioral non-influence.

```json
{"type":"claim-adjudication","findingId":"SOL-A-I002-P1-002","claim":"The planned phase-006 controls can pass while corpus-borne instructions influence generated prose, because the envelope is metadata and the leak gate only tests copied values/spans.","evidenceRefs":[".opencode/specs/sk-design/011-sk-design-styles-utilization/006-md-generator-study-exemplars/spec.md:73-79",".opencode/specs/sk-design/011-sk-design-styles-utilization/006-md-generator-study-exemplars/spec.md:104-117",".opencode/specs/sk-design/011-sk-design-styles-utilization/006-md-generator-study-exemplars/spec.md:165-187"],"counterevidenceSought":"Searched phase-004/006/007/010 planning artifacts for prompt injection, untrusted-content, instruction rejection, sanitization, and injection-boundary controls; reviewed de-literalization, target-facts binding, fixed authority order, leak checks, and no-STUDY retry as possible defenses.","alternativeExplanation":"A strict de-literalized transformer could incidentally discard imperative text and locked FACTS constrain measured values, but the current acceptance criteria do not require either behavioral property and the two leak signals do not detect non-literal instruction following.","finalSeverity":"P1","confidence":0.88,"downgradeTrigger":"Downgrade to P2 if the transformer contract becomes a closed data-only schema with explicit instruction rejection and adversarial behavioral fixtures proving corpus text cannot redirect the WRITE task."}
```

### P2 Findings
None.

### Carried P1 Claim-Adjudication Correction
`SOL-A-I001-P1-001` remains active and is not duplicated as a new finding. Its corrected typed packet is:

```json
{"type":"claim-adjudication","findingId":"SOL-A-I001-P1-001","claim":"Canonical packet surfaces give obsolete next actions and completion percentages for already-completed research phases.","evidenceRefs":[".opencode/specs/sk-design/011-sk-design-styles-utilization/spec.md:13-25",".opencode/specs/sk-design/011-sk-design-styles-utilization/spec.md:46",".opencode/specs/sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade/spec.md:13-30",".opencode/specs/sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade/implementation-summary.md:10-30",".opencode/specs/sk-design/011-sk-design-styles-utilization/003-global-modes-utilization/spec.md:13-30",".opencode/specs/sk-design/011-sk-design-styles-utilization/003-global-modes-utilization/implementation-summary.md:10-31"],"counterevidenceSought":"Checked later status tables, implementation-summary frontmatter, parent phase map, planned child lifecycle fields, and phase-parent graph metadata in iteration 001.","alternativeExplanation":"Child resume normally prefers implementation-summary continuity, and a phase parent with no active child may list children rather than execute the stale parent next action; this contains some runtime impact but does not remove contradictory canonical completion metadata.","finalSeverity":"P1","confidence":0.92,"downgradeTrigger":"Downgrade to P2 only if the owning completion validator and every memory/resume consumer are proven to exclude spec.md continuity fields for these packets."}
```

## Traceability Checks
- `security_contract` (phase 004): partial — generation, rights, and fail-closed mismatch controls are explicit, but filesystem containment is not contracted.
- `security_contract` (phase 006): partial — anti-copy and fallback controls are explicit, but prompt-injection resistance is not behaviorally specified.
- `authority_order` (phase 007): pass — the shared seam fixes corpus and transport evidence below user/mode/target authority and forbids corpus evidence from authorizing exact reuse or accepting transport output.
- `transport_trust` (phase 010 + current transport): pass for planned/live boundary — metadata-only receipts, offline-first gating, reconciliation, explicit mutation confirmation, live tool discovery, and no-cache rules are named; implementation remains intentionally planned.

## Integration Evidence
- `.opencode/skills/sk-design/design-mcp-open-design/SKILL.md:123-163`: current READ/RUN trust boundary names guarded design-bearing reads, multi-turn completion, live `tools/list`, explicit mutation confirmation, and no-cache requirements.
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/010-open-design-transport/spec.md:95-109`: planned transport integration keeps receipts subordinate, gates live plumbing behind offline fixtures, forbids raw payload caching, and mandates return reconciliation.
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/007-shared-context-seam/spec.md:99-111`: planned fixed authority order prevents corpus and transport evidence from becoming acceptance or mutation authority.

## Edge Cases
- Structural-impact analysis unavailable by detached-lineage prompt constraint; graphless direct reads and exact counterevidence search were used.
- Both new findings concern missing planned security acceptance criteria, not absent runtime implementation; phases 004 and 006 remain intentionally unimplemented.
- Corpus files are committed/local, which lowers immediate exploitability, but generation and hydration explicitly process a large extracted corpus and downstream prompt content; this supported P1 rather than P0.
- The prior P1 packet was refined only to add `findingId`; it was excluded from `findingsNew` and counted at 0.5 severity weight in novelty.

## Confirmed-Clean Surfaces
- Phase 004 applies deterministic provenance/rights eligibility before ranking and fails closed on generation mismatch.
- Phase 007 encodes a security-relevant authority order and preserves successful negative evidence.
- Phase 010 and the current Open Design transport both keep transport output subordinate to mode judgment and require explicit confirmation for mutation.

## Ruled Out
- Missing implementation of phases 004/006/007/010: intentionally planned and not itself a finding.
- Open Design transport as an autonomous mutation authority: contradicted by both planned phase-010 requirements and current transport rules.
- Literal source copying as wholly uncontrolled: phase 006 already specifies de-literalization plus exact-value and normalized-span leak gates; the active finding is the distinct non-literal instruction-influence gap.

## Next Focus
- dimension: traceability
- focus area: requirement-to-plan/task/checklist closure for the new security controls and existing phase dependencies
- reason: security review found two specification-level control gaps whose downstream evidence paths must be mapped without re-running exhausted correctness protocols
- rotation status: security complete; rotate to traceability
- blocked/productive carry-forward: direct scoped reads and exact counterevidence search productive; graphless fallback remains required
- required evidence: phase 004/006 requirement-task-checklist matrices, phase 007/010 dependency handoffs, and exact references to current sk-design/Open Design contracts

Review verdict: CONDITIONAL
