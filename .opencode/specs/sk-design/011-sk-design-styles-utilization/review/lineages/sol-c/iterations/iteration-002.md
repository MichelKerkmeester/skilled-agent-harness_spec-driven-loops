# Iteration 2: Security Boundaries

## Dispatcher

- Budget profile: verify
- Dimension: security
- Prior active findings: F001 (P1 correctness)
- Structural caveat: code graph absent; direct packet reads and exact searches supplied the evidence ledger.

## Files Reviewed

- `.opencode/specs/sk-design/011-sk-design-styles-utilization/004-retrieval-substrate/decision-record.md:141-179,235-325`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/004-retrieval-substrate/checklist.md:83-102,173-179`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/005-md-generator-schema-contract/decision-record.md:136-227`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/006-md-generator-study-exemplars/spec.md:58-117,133-187`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/006-md-generator-study-exemplars/plan.md:76-135`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/006-md-generator-study-exemplars/tasks.md:53-91`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/006-md-generator-study-exemplars/checklist.md:78-118`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/007-shared-context-seam/spec.md:70-122`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/008-interface-audit-pilots/decision-record.md:51-70,149-177,234-250`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/009-foundations-motion/decision-record.md:52-71,150-169`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/010-open-design-transport/plan.md:38-87,101-127`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **The STUDY plan names prompt injection but has no enforceable pre-prompt injection control or adversarial gate** -- `.opencode/specs/sk-design/011-sk-design-styles-utilization/006-md-generator-study-exemplars/plan.md:83-87` -- Hydrated corpus DESIGN.md and token artifacts are transformed and then placed into a model prompt. The plan defines an “injection envelope,” but neither the architecture, tasks, testing strategy, nor security checklist states how untrusted instructions or delimiter escapes are neutralized, rejected, or tested. The concrete two-signal gate only detects source-value/span leakage in the authored draft after generation (`plan.md:128-135`; `tasks.md:65-71`). The checklist explicitly classifies this as a cross-consumer class spanning “prompt-injection and authored-draft boundaries,” but provides no corresponding prompt-boundary acceptance row (`checklist.md:93-118`).
   - Finding class: cross-consumer
   - Scope proof: exact searches across phases 004-010 found injection terminology only in phase 006; all concrete tasks and tests target de-literalization or output leakage, not hostile instruction neutralization before prompt assembly.
   - Affected surface hints: study hydration, study transformer, buildWritePrompt, buildPlan, runGuided
   - Recommendation: add a P0 acceptance contract and adversarial fixtures for untrusted-instruction neutralization, delimiter/joined-input escapes, and fail-closed no-STUDY fallback before any STUDY block reaches `buildWritePrompt`.

```json
{"findingId":"F002","claim":"Phase 006 sends corpus-derived observations into a model prompt but defines no enforceable prompt-injection neutralization or adversarial acceptance gate before prompt assembly.","evidenceRefs":[".opencode/specs/sk-design/011-sk-design-styles-utilization/006-md-generator-study-exemplars/plan.md:83-87",".opencode/specs/sk-design/011-sk-design-styles-utilization/006-md-generator-study-exemplars/plan.md:128-135",".opencode/specs/sk-design/011-sk-design-styles-utilization/006-md-generator-study-exemplars/tasks.md:65-71",".opencode/specs/sk-design/011-sk-design-styles-utilization/006-md-generator-study-exemplars/checklist.md:93-118"],"counterevidenceSought":"Searched all phase 004-010 specs, plans, tasks, checklists, and decisions for untrusted-input, sanitization, escaping, delimiter, instruction, and injection controls; found the envelope name and post-generation leak controls, but no pre-prompt behavior or fixture contract.","alternativeExplanation":"The phrase injection envelope may be intended to imply safe delimiting, but no acceptance criterion defines that implication, so implementation and verification can satisfy every named task without neutralizing hostile instructions.","finalSeverity":"P1","confidence":0.94,"downgradeTrigger":"Downgrade to P2 if an existing authoritative design-md-generator contract already enforces untrusted corpus isolation at buildWritePrompt and phase 006 explicitly binds and tests that control.","transitions":[{"iteration":2,"from":null,"to":"P1","reason":"Initial discovery"}]}
```

### P2 Findings

None.

## Traceability Checks

- `spec_code`: pending dedicated traceability pass.
- `checklist_evidence`: pending dedicated traceability pass.
- Security contract sweep: phase 004 rights/generation controls, phase 005 no-value-leak rule, phase 007 authority order, phase 008 audit non-authority, phase 009 restraint/reference-only rules, and phase 010 no-cache/subordinate transport rules are mutually consistent.

## Integration Evidence

- Phase 004 excludes unknown-rights styles from exact-reuse hydration and requires proof cards.
- Phase 007 propagates the fixed authority order and makes unknown-rights a valid negative result.
- Phase 010 keeps corpus data metadata-only and transport returns subordinate to mode judgment.

## Edge Cases

- De-literalization can remove source-specific values without removing imperative instructions; the controls solve different threat classes.
- A post-generation source-leak gate cannot prove the model ignored a hostile instruction that changes structure or omits required content without copying a source span.

## Confirmed-Clean Surfaces

- Rights-unknown exact reuse is consistently prohibited across phases 004, 007, 008, and 009.
- Raw corpus/Open-Design caching is explicitly prohibited and tested in phase 010 planning.
- Corpus evidence cannot assign audit severity, prove accessibility/performance, or authorize transport acceptance.

## Ruled Out

- Rights policy contradiction: ruled out; unknown-rights material is consistently restricted to non-exact reference roles.
- Cache-authority leak in phase 010: ruled out by metadata-only receipt and no-cache gates.
- Corpus-as-aesthetic-majority: ruled out by phase 005 hard/advisory split and fixed authority order.

## Next Focus

- Dimension: traceability
- Focus area: research recommendations to child requirements, parent map, checked evidence, and current metadata
- Reason: both active P1 findings concern continuity or an unbound contract; the dedicated protocols must determine the full affected set.
- Rotation status: correctness and security covered; traceability pending.
- Required evidence: research synthesis lines, child requirement/task/checklist links, checked-item proof, and metadata parity.

## Verdict

F001 and F002 remain active P1 findings.

Review verdict: CONDITIONAL
