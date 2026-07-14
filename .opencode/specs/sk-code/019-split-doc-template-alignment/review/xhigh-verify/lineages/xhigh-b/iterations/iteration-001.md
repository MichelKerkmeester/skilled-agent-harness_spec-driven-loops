# Iteration 1: Correctness and Template Contract

## Dispatcher

- Budget profile: verify
- Dimension: correctness
- Scope: all 163 Git-tracked reference/asset Markdown files plus the governing reference and asset templates
- Route: `Resolved route: mode=review target_agent=deep-review`

## Files Reviewed

- `.opencode/skills/sk-code/code-opencode/references/**/*.md`
- `.opencode/skills/sk-code/code-opencode/assets/**/*.md`
- `.opencode/skills/sk-code/code-webflow/references/**/*.md`
- `.opencode/skills/sk-code/code-webflow/assets/**/*.md`
- `.opencode/skills/sk-code/code-quality/references/**/*.md`
- `.opencode/skills/sk-code/code-quality/assets/**/*.md`
- `.opencode/skills/sk-doc/create-skill/assets/skill/skill_reference_template.md:54-87`
- `.opencode/skills/sk-doc/create-skill/assets/skill/skill_asset_template.md:125-175`

## Findings - New

### P0 Findings

None.

### P1 Findings

- **F001**: Rust interop reference places OVERVIEW after substantive content - `.opencode/skills/sk-code/code-opencode/references/rust/style_guide/interop_errors_and_parity.md:13-19` - The document begins its inherited Error Style content immediately after the intro; `## 1. OVERVIEW` does not appear until lines 304-315. This contradicts R3's requirement that the body open with H1, intro, then OVERVIEW before content. [SOURCE: .opencode/specs/sk-code/019-split-doc-template-alignment/spec.md:65-72] [SOURCE: .opencode/skills/sk-code/code-opencode/references/rust/style_guide/interop_errors_and_parity.md:13-19] [SOURCE: .opencode/skills/sk-code/code-opencode/references/rust/style_guide/interop_errors_and_parity.md:304-318]

Finding class: instance-only

Scope proof: the deterministic 163-file audit found exactly one document with content between its H1 intro and eventual `## 1. OVERVIEW`; all 163 passed `validate_document.py`, showing the structural validator does not detect this ordering defect.

Affected surface hints: `code-opencode Rust reference`, `create-skill reference template`, `packet R3`

```json
{"findingId":"F001","claim":"The Rust interop reference places its required OVERVIEW after substantive content instead of opening the body with it.","evidenceRefs":[".opencode/specs/sk-code/019-split-doc-template-alignment/spec.md:65-72",".opencode/skills/sk-code/code-opencode/references/rust/style_guide/interop_errors_and_parity.md:13-19",".opencode/skills/sk-code/code-opencode/references/rust/style_guide/interop_errors_and_parity.md:304-318"],"counterevidenceSought":"Ran validate_document.py across all 163 target files and inspected the complete heading order; the validator passes this file, but direct reads prove the OVERVIEW is last rather than first.","alternativeExplanation":"The OVERVIEW may have been appended mechanically and still be numbered 1, but R3 governs physical body order, not numbering alone.","finalSeverity":"P1","confidence":0.99,"downgradeTrigger":"Downgrade only if R3 is amended to permit OVERVIEW after substantive content or the OVERVIEW is moved before Error Style.","transitions":[{"iteration":1,"from":null,"to":"P1","reason":"Direct spec-order contradiction"}]}
```

- **F002**: Third-party integration Purpose still duplicates its intro - `.opencode/skills/sk-code/code-webflow/references/implementation/third_party_integrations/overview_hls_and_lenis.md:14-23` - The intro says this is a reference guide for integrating external JavaScript libraries in Webflow projects, and Purpose repeats the same sentence without adding distinct detail. The governing template explicitly forbids intro/OVERVIEW duplication, so the prior F001 remediation did not cover the full class. [SOURCE: .opencode/skills/sk-doc/create-skill/assets/skill/skill_reference_template.md:58-87] [SOURCE: .opencode/skills/sk-code/code-webflow/references/implementation/third_party_integrations/overview_hls_and_lenis.md:14-23]

Finding class: class-of-bug

Scope proof: normalization and bidirectional containment across all 163 target files found one remaining intro/Purpose duplicate; the previously reported 21 exact duplicates are no longer present.

Affected surface hints: `code-webflow third-party integration reference`, `create-skill reference template`, `post-review remediation`

```json
{"findingId":"F002","claim":"One target reference still repeats its H1 intro in Section 1 Purpose despite the canonical template's non-duplication rule.","evidenceRefs":[".opencode/skills/sk-doc/create-skill/assets/skill/skill_reference_template.md:58-87",".opencode/skills/sk-code/code-webflow/references/implementation/third_party_integrations/overview_hls_and_lenis.md:14-23"],"counterevidenceSought":"Replayed the semantic duplicate scan across all 163 targets and checked whether Purpose added a distinct integration rationale; it only removes the intro's trailing qualifier.","alternativeExplanation":"The shorter Purpose could be read as a summary, but it is wholly contained in the intro and the authority explicitly says not to repeat the intro in OVERVIEW.","finalSeverity":"P1","confidence":0.96,"downgradeTrigger":"Downgrade if Purpose is rewritten with distinct detailed intent or the governing template permits containment-level repetition.","transitions":[{"iteration":1,"from":null,"to":"P1","reason":"Post-remediation semantic replay"}]}
```

### P2 Findings

None.

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| `spec_code` | partial | hard | `spec.md:65-72`; F001; F002 | R1/R2 and most R3 mechanics pass; two R3 defects remain. |
| `checklist_evidence` | pending | hard | - | Scheduled for iteration 3. |

## Integration Evidence

- `validate_document.py` returned zero failures for all 163 targets when invoked with the matching reference/asset type.
- Corpus inventory: 136 references and 27 assets.
- Clean matrix: zero hyphenated basenames, missing routing metadata, bad four-part versions, missing H1s, missing OVERVIEWs, missing mode sections, numbering defects, misplaced RELATED RESOURCES sections, or validator failures.

## Edge Cases

- An unnumbered terminal `## RELATED RESOURCES` is accepted by the packet's stated contract and was excluded from contiguous content-section numbering checks.
- Variant headings such as `When to Use This Reference` and `When to Use (Observers vs Polling)` satisfy the semantic When-to-Use requirement.

## Confirmed-Clean Surfaces

- R1 metadata/version matrix across 163 files.
- R2 basename matrix across 163 files.
- R3 H1, OVERVIEW existence, mode-section, contiguous content numbering, and RELATED RESOURCES placement except F001/F002.

## Ruled Out

- The original 21-file exact Purpose duplication set remains active: ruled out by the current full-corpus scan; only F002 remains.
- Validator failures explain F001/F002: ruled out because all 163 validator subprocesses exit zero.

## Next Focus

security: inspect the documentation-only change surface for secrets, unsafe executable examples, path disclosure, and newly introduced trust-boundary or command hazards without re-entering correctness.

Review verdict: CONDITIONAL
