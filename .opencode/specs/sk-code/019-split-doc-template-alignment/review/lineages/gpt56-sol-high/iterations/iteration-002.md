# Iteration 2: Canonical Template Correctness

## Dispatcher

- Route: `Resolved route: mode=review target_agent=deep-review`
- Budget profile: adjudicate

## Files Reviewed

- `.opencode/skills/sk-doc/create-skill/assets/skill/skill_reference_template.md`
- `.opencode/skills/sk-code/code-webflow/references/implementation/implementation_workflows/validation_minification_and_cdn.md`
- All 163 tracked target Markdown files via semantic structure parser

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **F001: Twenty-one conformed references duplicate the intro in Purpose** -- `.opencode/skills/sk-code/code-webflow/references/implementation/implementation_workflows/validation_minification_and_cdn.md:16-24` -- The intro and Purpose are identical in this representative file, and the same class appears in 21 target references. The governing template explicitly says not to duplicate intro content in Section 1 at `.opencode/skills/sk-doc/create-skill/assets/skill/skill_reference_template.md:84-87`.
   - Finding class: class-of-bug
   - Scope proof: all 163 Git-tracked target files were parsed; 21 exact/containment duplicates were found.
   - Affected surface hints: code-webflow implementation references, create-skill reference conformance

```json
{"findingId":"F001","claim":"Twenty-one target references duplicate the H1 intro in Section 1 Purpose despite the canonical template explicitly forbidding that duplication.","evidenceRefs":[".opencode/skills/sk-doc/create-skill/assets/skill/skill_reference_template.md:84-87",".opencode/skills/sk-code/code-webflow/references/implementation/implementation_workflows/validation_minification_and_cdn.md:16-24"],"counterevidenceSought":"Ran validate_document.py and the complete section matrix over all 163 files; those checks pass but do not enforce semantic duplication.","alternativeExplanation":"Mechanical wrapper generation may have treated repeated Purpose prose as acceptable, but the named authority explicitly prohibits it.","finalSeverity":"P1","confidence":0.94,"downgradeTrigger":"The authority is amended or all 21 duplicates are removed.","transitions":[{"iteration":2,"from":null,"to":"P1","reason":"Confirmed class-wide spec mismatch"}]}
```

### P2 Findings

None.

## Traceability Checks

`spec_code=partial`: mechanical structure passes, but canonical semantic conformance does not.

## Edge Cases

The generic validator reports zero issues because it does not compare intro and Purpose semantics.

## Confirmed-Clean Surfaces

Required metadata, four-part versions, H1, OVERVIEW, and mode headings exist across the corpus.

## Ruled Out

- F001 is not a validator failure; it is an authority-versus-output mismatch.

## Next Focus

- Dimension: security
- Focus area: executable and trust-boundary impact
- Reason: determine whether documentation changes introduced security risk

Review verdict: CONDITIONAL
