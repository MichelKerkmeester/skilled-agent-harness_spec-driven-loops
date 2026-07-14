# Iteration 3: Traceability and Evidence

## Dispatcher

- Route: `mode=review target_agent=deep-review`
- Budget profile: verify

## Dimension

Traceability: `spec_code`, `checklist_evidence`, remediation claims, and completion metadata.

## Files Reviewed

- `.opencode/specs/sk-code/019-split-doc-template-alignment/spec.md:64-82`
- `.opencode/specs/sk-code/019-split-doc-template-alignment/tasks.md:23-61`
- `.opencode/specs/sk-code/019-split-doc-template-alignment/checklist.md:23-95`
- `.opencode/specs/sk-code/019-split-doc-template-alignment/implementation-summary.md:60-78`
- `.opencode/skills/sk-code/code-webflow/references/implementation/third_party_integrations/overview_hls_and_lenis.md:14-25`
- Strict packet validation and fenced-code-aware link scan outputs

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **F002: Post-review Purpose de-duplication left one containment duplicate** -- `.opencode/skills/sk-code/code-webflow/references/implementation/third_party_integrations/overview_hls_and_lenis.md:14-25` -- The intro says this is a reference guide for integrating external JavaScript libraries with production-tested patterns; Purpose repeats that it is a reference guide for integrating external JavaScript libraries. The canonical template forbids intro/Section-1 duplication [SOURCE: `.opencode/skills/sk-doc/create-skill/assets/skill/skill_reference_template.md:84-87`], while the summary claims zero duplicates across all 163 [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/implementation-summary.md:65`].
   - Finding class: instance-only
   - Scope proof: normalized equality/containment comparison across all 163 targets found exactly this one remaining duplicate after the remediation commit changed 21 other files.
   - Affected surface hints: `code-webflow third-party references`, `post-review remediation`, `semantic conformance checker`
   - Recommendation: make Purpose state the detailed operational role of the guide rather than repeat its intro, then rerun the complete containment matrix.

```json
{"findingId":"F002","claim":"The zero-duplicate remediation claim is false because one target still repeats its intro in Purpose by containment.","evidenceRefs":[".opencode/skills/sk-doc/create-skill/assets/skill/skill_reference_template.md:84-87",".opencode/skills/sk-code/code-webflow/references/implementation/third_party_integrations/overview_hls_and_lenis.md:14-25",".opencode/specs/sk-code/019-split-doc-template-alignment/implementation-summary.md:65"],"counterevidenceSought":"Re-ran the normalized equality/containment matrix over all 163 targets, inspected the remediation diff, and checked whether this file was among the 21 modified references.","alternativeExplanation":"The added phrase about production-tested patterns differentiates the intro slightly, but Purpose remains a strict semantic subset and the canonical template explicitly forbids duplicating the intro.","finalSeverity":"P1","confidence":0.97,"downgradeTrigger":"Downgrade only when Purpose becomes semantically distinct or the template authority permits containment duplication.","transitions":[{"iteration":3,"from":null,"to":"P1","reason":"Confirmed incomplete post-review remediation"}]}
```

2. **F003: Completed task/checklist rows do not carry the evidence their own protocol requires** -- `.opencode/specs/sk-code/019-split-doc-template-alignment/checklist.md:23-60` -- The checklist says every item carries a command and result, but its checked rows are bare assertions. Strict validation reports 25 completed items without evidence across `checklist.md` and `tasks.md`, plus a missing concrete verification command/artifact in the implementation summary.
   - Finding class: matrix/evidence
   - Scope proof: strict verbose validation enumerated 14 checklist rows and 11 task rows with `UNSPECIFIED` evidence, covering the full completed-item matrix.
   - Affected surface hints: `completion verification`, `checklist evidence`, `strict packet validation`
   - Recommendation: attach concise command/artifact evidence to every P0/P1 completion row, add a concrete verification artifact to the summary, and require strict exit 0 before Complete.

```json
{"findingId":"F003","claim":"The completed Level 2 packet fails strict evidence validation because 25 checked task/checklist rows lack citations despite the checklist protocol requiring command-and-result evidence.","evidenceRefs":[".opencode/specs/sk-code/019-split-doc-template-alignment/checklist.md:23-60",".opencode/specs/sk-code/019-split-doc-template-alignment/tasks.md:23-54",".opencode/specs/sk-code/019-split-doc-template-alignment/implementation-summary.md:70-78"],"counterevidenceSought":"Ran validate.sh --strict --verbose, checked the verification summary table, and looked for inline evidence markers or command references adjacent to every completed row.","alternativeExplanation":"Commit messages may contain historical evidence, but the packet's own protocol requires each row to carry evidence and the strict validator cannot verify external commit-message context from the rows.","finalSeverity":"P1","confidence":0.99,"downgradeTrigger":"Downgrade when the completed rows cite reproducible commands/artifacts and strict validation exits 0.","transitions":[{"iteration":3,"from":null,"to":"P1","reason":"Confirmed hard completion-evidence gap"}]}
```

### P2 Findings

1. **F004: Implementation summary retains the withdrawn whole-hub zero-link claim** -- `.opencode/specs/sk-code/019-split-doc-template-alignment/implementation-summary.md:65-76` -- The decision narrative says the claim was narrowed to renamed-file scope, but the verification table still says `Broken relative .md links (whole hub) | 0`. A fenced-code-aware scan finds the two out-of-scope artifacts already documented by the checklist [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/checklist.md:47-52`].
   - Finding class: matrix/evidence
   - Scope proof: scan covered all 326 tracked `sk-code` Markdown files and reproduced exactly the two checklist exclusions.
   - Affected surface hints: `implementation summary`, `verification table`, `link-scope claim`
   - Recommendation: change the table label/result to the checklist's renamed-file scope.

## Traceability Checks

- `spec_code`: fail, because R3 remains unmet at F001 and F002.
- `checklist_evidence`: fail, because F003 contradicts the packet's evidence protocol and strict completion gate.
- `feature_catalog_code`: not applicable.
- `playbook_capability`: not applicable.
- `AC_COVERAGE`: disabled by runtime policy; advisory only.

## Integration Evidence

- Generic document validation: 163/163 exit 0.
- Strict spec validation: 0 errors, 5 warnings, `RESULT: FAILED` under `--strict`.
- Link scan: 326 tracked Markdown files, two pre-existing/out-of-scope unresolved link-shaped artifacts.

## Edge Cases

- F004 is advisory because the authoritative spec/checklist now scopes the zero-link claim correctly; only the summary table is stale.
- Strict validation also reports priority-tag, complexity, and section-count warnings. F003 is bounded to the evidence failures that directly contradict the packet's own protocol.

## Confirmed-Clean Surfaces

- All 163 files pass the generic validator and filename/frontmatter checks.
- The prior remediation corrected the 21 files it touched.
- The two whole-hub link-shaped artifacts predate this packet and need not be changed to satisfy the scoped requirement.

## Ruled Out

- Reclassifying the two excluded link-shaped artifacts as packet implementation defects.
- Elevating documentation evidence defects to P0 without security or destructive-loss impact.

## Next Focus

- Dimension: maintainability and stabilization
- Focus area: adversarial replay of F001-F004 and same-class saturation
- Rotation status: traceability covered; core protocols failed

Review verdict: CONDITIONAL
