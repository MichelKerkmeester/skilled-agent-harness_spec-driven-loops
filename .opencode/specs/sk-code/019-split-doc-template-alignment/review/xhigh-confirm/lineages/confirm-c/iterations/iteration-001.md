# Review Iteration 001

## Dispatcher

- Session: `fanout-confirm-c-1783921047347-ky9ry5`
- Lineage: detached, generation 1, `lineageMode=new`
- Route: `mode=review`, `target_agent=deep-review`
- Stop policy: `max-iterations` (iteration 1 of 4)

## Dimension

`correctness`

## Files Reviewed

- Deterministic full-corpus structure scan: all 163 configured Markdown paths (160 resolved targets).
- `validate_document.py` with explicit reference/asset type: 163/163 at zero issues.
- Fenced-code-aware relative Markdown link scan: 403 links checked; no broken renamed-file navigation. The known illustrative absolute `/specs/005-example.com/...` path remains non-navigational and out of scope.
- Direct reads: `.opencode/skills/sk-code/code-webflow/references/shared/enforcement.md:15-30`, `.opencode/skills/sk-code/code-opencode/references/workflow_debug.md:14-24`, `.opencode/skills/sk-code/code-opencode/references/workflow_implement.md:14-24`, `.opencode/skills/sk-code/code-opencode/references/workflow_verify.md:14-24`, `.opencode/skills/sk-code/code-webflow/references/css/quality_standards/patterns_and_naming_enforcement.md:17-29`, and `.opencode/skills/sk-doc/create-skill/assets/skill/skill_reference_template.md:54-87`.
- Prior remediation replay: the Rust Overview wrapper, exact intro/Purpose duplication, lowercase trigger phrase, and narrowed link claim are all present in current state.

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **A scoped reference places a Related Documents block before the mandatory Overview wrapper** - `.opencode/skills/sk-code/code-webflow/references/shared/enforcement.md:19-24` - R3 requires the body to open with H1, a 1-2 sentence intro, then `## 1. OVERVIEW` before substantive content. This file inserts a labelled five-link document map between the two-sentence intro and Overview at line 28. The current validator reports zero issues, so the checked 163/163 result does not prove this ordering invariant.
   - Finding class: `instance-only`
   - Scope proof: a deterministic pre-Overview structural-content scan covered all 163 configured paths and isolated this one file; direct reread confirmed the six-line block.
   - Affected surfaces: code-webflow shared references; resource-document validation; packet completion evidence.

```json
{"findingId":"C1-P1-001","claim":"One in-scope reference places substantive Related Documents content before the mandatory Overview wrapper while the packet claims every scoped file has the required opening order.","evidenceRefs":[".opencode/skills/sk-code/code-webflow/references/shared/enforcement.md:15-30",".opencode/specs/sk-code/019-split-doc-template-alignment/spec.md:67-72",".opencode/skills/sk-doc/create-skill/assets/skill/skill_reference_template.md:54-87"],"counterevidenceSought":"Ran validate_document.py with explicit resource type across all 163 paths, scanned every pre-Overview region, and checked whether Related Documents could be treated as the permitted intro; the validator passed but the template permits only a short intro before Overview.","alternativeExplanation":"The link map may be intended as navigation adjacent to the intro, but R3 and the governing template explicitly require Overview before content and reserve optional Related Resources for the end.","finalSeverity":"P1","confidence":0.99,"downgradeTrigger":"Downgrade only if the governing requirement is amended to allow a navigation block before Overview or this file is explicitly exempted."}
```

### P2 Findings

1. **Eight scoped paths use three-sentence intros instead of the required 1-2 sentences** - `.opencode/skills/sk-code/code-opencode/references/workflow_debug.md:16` - the shared debug, implement, and verify references appear through both code-opencode and code-webflow paths (six lexical paths, three resolved files); `patterns_and_naming_enforcement.md:19` and `enforcement.md:17` add two more lexical/resolved cases. Their wrappers otherwise resolve correctly, so this is bounded template drift rather than a functional contradiction.
   - Finding class: `class-of-bug`
   - Scope proof: the same full-corpus opening scan counted sentence boundaries for all 163 paths and isolated eight lexical paths representing five resolved documents.
   - Affected surfaces: shared workflow references; code-webflow shared enforcement; code-webflow CSS quality reference.

## Traceability Checks

- `spec_code` (core): **fail, provisional** - current `C1-P1-001` contradicts R3; final protocol replay is scheduled for iteration 3.
- `checklist_evidence` (core): **fail, provisional** - validator success is real but does not establish pre-Overview ordering; final replay is scheduled for iteration 3.
- Overlays: pending traceability classification.

## Confirmed-Clean Surfaces

- All 163 paths carry the required frontmatter fields and four-part version.
- No scoped filename stem contains a hyphen.
- All 163 contain H1 followed by `## 1. OVERVIEW` and the required Purpose/When-to-Use or Purpose/Usage subsections.
- No exact intro/Purpose duplicates or generic implementing-or-troubleshooting boilerplate remain.
- The prior Rust wrapper and CDN/cookie guidance remediations are present.

## Ruled Out

- Missing frontmatter/version class.
- Hyphenated scoped filename class.
- Missing Overview wrapper class.
- Broken renamed-file navigation class.
- Exact intro/Purpose duplication class.
- Generic When-to-Use boilerplate class.

## Verdict

One active P1 prevents PASS. One P2 class remains advisory; no P0 was found.

## Next Focus

- Dimension: `security`
- Focus: replay the two prior guidance findings and search adjacent trust-boundary patterns without repeating the saturated structural scan.

Review verdict: CONDITIONAL
