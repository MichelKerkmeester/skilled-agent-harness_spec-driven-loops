# Review Iteration 004

## Dispatcher

- Session: `fanout-xhigh-c-1783915428096-y929h9`
- Lineage: detached, generation 1, `lineageMode=new`
- Route: `mode=review`, `target_agent=deep-review`
- Stop policy: `max-iterations` (iteration 4 of 4; final pass before synthesis)
- Budget profile: `verify`

## Dimension

`maintainability`

## Files Reviewed

- Exact maintainability searches covered all 163 configured Markdown path entries (160 resolved document targets) for tautological `When to Use` prose, duplicated split-description suffixes, and unresolved `TODO`/`TBD`/`FIXME`/`PLACEHOLDER`/`XXX` markers.
- Direct maintainability evidence: `.opencode/skills/sk-code/code-webflow/references/implementation/third_party_integrations/best_practices_and_summary.md:20-32`, `.opencode/skills/sk-code/code-webflow/references/implementation/performance_patterns/budgets_and_anti_patterns.md:20-32`, `.opencode/skills/sk-code/code-webflow/references/implementation/form_upload_workflows/mime_troubleshooting_and_deployment.md:20-32`, and `.opencode/skills/sk-doc/create-skill/assets/skill/skill_reference_template.md:98-109`.
- Narrow active-finding counterevidence: `.opencode/skills/sk-code/code-opencode/references/rust/style_guide/interop_errors_and_parity.md:13-21`, `.opencode/skills/sk-code/code-webflow/references/implementation/security_patterns/overview_and_checklist.md:89-98`, `:247-258`, `.opencode/skills/sk-code/code-webflow/references/implementation/third_party_integrations/best_practices_and_summary.md:34-55`, `.opencode/skills/sk-code/code-opencode/references/workflow_debug.md:14-20`, and `.opencode/skills/sk-code/code-webflow/references/css/quality_standards/patterns_and_naming_enforcement.md:17-27`.
- Narrow read-only history: rename commits `dd9e700477384f2b4312f3236428e300b29e840e` and `1922cffed797c62b96e8cf862308232b3f6ba7a8` for two representative transformed references.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Six `When to Use` sections repeat their filenames instead of naming actionable scenarios** -- `.opencode/skills/sk-code/code-webflow/references/implementation/third_party_integrations/best_practices_and_summary.md:28` -- Six in-scope references use the generated form `Use this reference when implementing or troubleshooting <title> & related`; one even says `troubleshooting ... troubleshooting`. This does not tell a maintainer or reader which concrete task should select the split document, unlike the governing template's scenario list at `.opencode/skills/sk-doc/create-skill/assets/skill/skill_reference_template.md:103-109`. Replace each tautology with two or three topic-specific task or symptom bullets while preserving the document's scope.
   - Finding class: `class-of-bug`
   - Scope proof: An exact search across the six configured Markdown roots isolated six instances, at `best_practices_and_summary.md:28`, `budgets_and_anti_patterns.md:28`, `mime_troubleshooting_and_deployment.md:28`, `finsweet_custom_select_bridge.md:28`, `motion_dev_advanced.md:28`, and `initialization_and_troubleshooting.md:27`; three representative files and the governing template were directly read.
   - Affected surface hints: `["code-webflow implementation references", "human document routing", "safe split-document maintenance"]`

## Traceability Checks

- `spec_code` (core): **failed, carried forward without re-execution** -- the active R3 mismatch remains represented by `I1-P1-001`; the saturated traceability protocol was not repeated.
- `checklist_evidence` (core): **failed, carried forward without re-execution** -- prior validator evidence still cannot establish R3; no checklist sweep was repeated.
- `feature_catalog_code` / `playbook_capability` (overlay): **notApplicable, carried forward** -- iteration 3 resolved applicability from packet scope; no overlay sweep was repeated.
- Content-preservation R4: **deferred, narrowed but unresolved** -- git history traces two representative files through 81% and 90% similarity renames and shows their substantive body lines retained while wrappers, numbering, and renamed links changed. That is useful counterevidence, but it does not prove verbatim preservation for the other 158 resolved targets, so the full-corpus debt remains deferred.

## Integration Evidence

- `.opencode/skills/sk-doc/create-skill/assets/skill/skill_reference_template.md:98-109` is the named authoring authority reviewed for actionable `When to Use` structure.
- Git commits `dd9e700477384f2b4312f3236428e300b29e840e` and `1922cffed797c62b96e8cf862308232b3f6ba7a8` establish rename lineage and representative structural-only diffs for the content-preservation debt; they do not establish corpus-wide proof.
- Existing active findings were reread only at their evidence and counterevidence ranges. All four remain active; no duplicate finding was emitted.

## Edge Cases

- The strategy mechanically labels the original no-baseline content-preservation attempt `BLOCKED`, while the rendered iteration prompt expressly authorizes a narrow git-history attempt. The history read used a changed evidence source, not a retry of the blocked current-state-only approach.
- The configured scope remains 163 lexical Markdown paths but 160 resolved targets because six symlink paths expose three shared workflow documents twice; same-file aliases were not counted as independent maintainability defects.
- Representative git rename similarity is corroboration, not a corpus-wide invariant. Missing proof was preserved as debt rather than converted into a pass.
- Structural-impact analysis was not applicable to this documentation-corpus review; exact scoped searches, direct reads, and read-only history supplied the evidence.

## Confirmed-Clean Surfaces

- The scoped maintenance-marker search found instructional examples and headings, not unresolved authoring placeholders.
- The 64 description lines using an em-dash split-title suffix are systematic split-document disambiguation and match their intros; no inconsistency or unsafe follow-on maintenance claim was supported.
- Narrow current reads found no evidence that any of the two active P1s or two prior P2s was fixed, downgraded, or expanded into a new class.

## Ruled Out

- Duplicate findings for `I1-P1-001`, `I2-P1-001`, `I1-P2-001`, and `I2-P2-001`: ruled out because current evidence reconfirms the registered claims without expanding their scope.
- Unresolved `TODO`/`TBD`/`FIXME`/placeholder debt: ruled out; all scoped matches are instructional examples or named guidance.
- A new finding for split-title description suffixes: ruled out as a consistent disambiguation pattern aligned with the intro/description template contract.
- A full R4 content-preservation pass: ruled out; two representative rename diffs cannot prove all 160 resolved targets.

## Verdict

FINAL VERDICT: CONDITIONAL

No P0 was found. Two previously active P1 findings keep the review conditional. One new maintainability P2 joins two existing advisories, so `hasAdvisories=true`.

## Next Dimension

No review dimension remains; proceed to synthesis.

## Next Focus

- Dimension: `synthesis`
- Focus area: consolidate the two active P1s, three active P2s, failed core traceability gates, and deferred content-preservation debt into the planning packet.
- Reason: all four configured dimensions are complete and iteration 4 is the required final pass under `max-iterations`.
- Rotation status: correctness, security, traceability, and maintainability complete; stop the iteration loop.
- Blocked/productive carry-forward: preserve exact finding IDs and the 163-path/160-target distinction; carry the six-instance `When to Use` class once and do not duplicate reconfirmed findings.
- Required evidence: reducer-registry reconciliation, exact file:line citations, and the final conditional verdict with `hasAdvisories=true`.
- Recovery note: `content_preservation` remains deferred for the 158 resolved targets not covered by the two representative rename diffs.

Review verdict: CONDITIONAL
