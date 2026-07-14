# Iteration 1: Correctness and Template Structure

## Dispatcher

- Route: `mode=review target_agent=deep-review`
- Budget profile: verify
- Artifact root: bound directly to the `xhigh-a` lineage override

## Dimension

Correctness: mechanical and structural conformance of the declared 163-file corpus.

## Files Reviewed

- `.opencode/specs/sk-code/019-split-doc-template-alignment/spec.md:44-82`
- `.opencode/skills/sk-doc/create-skill/assets/skill/skill_reference_template.md:54-87`
- `.opencode/skills/sk-doc/create-skill/assets/skill/skill_asset_template.md:125-175`
- All 163 tracked target Markdown files via the generic validator and a semantic structure matrix
- `.opencode/skills/sk-code/code-opencode/references/rust/style_guide/interop_errors_and_parity.md:13-21`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **F001: Rust reference never enters the required numbered OVERVIEW** -- `.opencode/skills/sk-code/code-opencode/references/rust/style_guide/interop_errors_and_parity.md:13-21` -- After its H1 and intro, the file opens directly at `### Error Style`; it has no `## 1. OVERVIEW`, `### Purpose`, or `### When to Use`. This contradicts R3 [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/spec.md:67-71`] and the canonical reference structure [SOURCE: `.opencode/skills/sk-doc/create-skill/assets/skill/skill_reference_template.md:54-87`].
   - Finding class: instance-only
   - Scope proof: the complete 163-file matrix found exactly one file with a heading between H1 and OVERVIEW/no OVERVIEW; `validate_document.py` still returned 163/163 because an all-H3 body escapes its numbered-H2 checks.
   - Affected surface hints: `code-opencode Rust references`, `create-skill reference contract`, `document validator`
   - Recommendation: add a distinct intro-safe OVERVIEW with Purpose and When to Use, then renumber the inherited content without changing substantive guidance.

```json
{"findingId":"F001","claim":"One declared target reference lacks the required numbered OVERVIEW and opens directly at an H3.","evidenceRefs":[".opencode/specs/sk-code/019-split-doc-template-alignment/spec.md:67-71",".opencode/skills/sk-doc/create-skill/assets/skill/skill_reference_template.md:54-87",".opencode/skills/sk-code/code-opencode/references/rust/style_guide/interop_errors_and_parity.md:13-21"],"counterevidenceSought":"Ran validate_document.py on all 163 targets, checked every target for H1 and numbered OVERVIEW, and inspected the full Git history for the file.","alternativeExplanation":"The inherited Error Style section could be treated as the file overview, but the approved requirement and canonical template explicitly require a numbered OVERVIEW with Purpose and When to Use.","finalSeverity":"P1","confidence":0.99,"downgradeTrigger":"Downgrade only if the governing R3/template contract is amended or the missing OVERVIEW structure is added.","transitions":[{"iteration":1,"from":null,"to":"P1","reason":"Confirmed current template-structure mismatch"}]}
```

### P2 Findings

None.

## Traceability Checks

Core protocols are pending the dedicated traceability pass. The current finding is nevertheless tied directly to R3 and the named template authority.

## Integration Evidence

- `validate_document.py`: 163/163 returned exit 0.
- Filename scan: 0 hyphenated target stems.
- Semantic structure matrix: one missing-OVERVIEW file and one intro/Purpose candidate reserved for traceability adjudication.

## Edge Cases

- The generic validator's clean result is counterevidence against broad corruption, not evidence that R3 is fully enforced.
- Eight root-level workflow/checklist files were omitted by the first recursive Git pathspec; the corrected prefix inventory included all 163.

## Confirmed-Clean Surfaces

- All 163 targets carry the required frontmatter fields and a four-part version.
- No target filename stem contains a hyphen.
- 162/163 targets provide the required top-level structural wrapper.

## Ruled Out

- Broad frontmatter or filename regression across the corpus.
- A generic-validator failure as the cause of F001; the gap is a validator false negative.

## Next Focus

- Dimension: security
- Focus area: prove the delivery remained documentation-only and introduced no executable/trust-boundary change
- Rotation status: correctness covered, F001 remains active

Review verdict: CONDITIONAL
