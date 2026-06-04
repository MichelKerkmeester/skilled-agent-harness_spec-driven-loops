# Iteration 001

## Focus

Q1 (T3): feasibility and prior art for adding self-check + failure-mode blocks to `spec.md.tmpl`, `plan.md.tmpl`, and `checklist.md.tmpl`, especially whether those blocks should be HTML comments or tracked `##` sections under `TEMPLATE_HEADERS` exact-order enforcement.

## Actions Taken

- Read the deep-research state/config/strategy. The strategy identifies Q1 as the next focus and asks for the comment-vs-section trade-off plus comparable prior art. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/001-peck-teachings-for-spec-kit/research/deep-research-strategy.md:20-25] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/001-peck-teachings-for-spec-kit/research/deep-research-strategy.md:69-70]
- Read the sibling peck analysis for the T3 recommendation and current spec-kit gap. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/001-peck-teachings-for-spec-kit/peck-teachings-analysis.md:188-222]
- Read the three manifest template targets and the phase 002 spec. [SOURCE: .opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:31-38] [SOURCE: .opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:31-38] [SOURCE: .opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:31-38] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/002-self-check-templates/spec.md:90-112]
- Read `TEMPLATE_HEADERS`, `SECTIONS_PRESENT`, `SECTION_COUNTS`, and template contract docs/scripts to verify how headers are derived and enforced. [SOURCE: .opencode/skills/system-spec-kit/scripts/rules/check-template-headers.sh:53-64] [SOURCE: .opencode/skills/system-spec-kit/scripts/utils/template-structure.js:16-18] [SOURCE: .opencode/skills/system-spec-kit/scripts/utils/template-structure.js:333-347] [SOURCE: .opencode/skills/system-spec-kit/references/validation/template_compliance_contract.md:229-264]
- Checked external markdown-linter prior art for non-rendered comments and scoped markup handling. [SOURCE: https://github.com/DavidAnson/markdownlint/blob/main/README.md#configuration] [SOURCE: https://vale.sh/docs/topics/scoping/]

## Findings

### Finding 1: HTML-comment guidance is the safest T3 shape, but the comment body must avoid line-start `## ` headings.

The phase 002 spec already leans toward HTML-comment guidance because it preserves header validation and matches the template voice-guide pattern. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/002-self-check-templates/spec.md:93-97] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/002-self-check-templates/spec.md:148-152] The validator-specific caveat is sharper than the current plan states: `template-structure.js` extracts H2s with `^##\s+(.+)$` and strips fenced code blocks, but it does not strip HTML comments before extracting template headers. [SOURCE: .opencode/skills/system-spec-kit/scripts/utils/template-structure.js:16-18] [SOURCE: .opencode/skills/system-spec-kit/scripts/utils/template-structure.js:333-361] Therefore a comment block is safe only if its internal lines do not start with markdown H2 syntax such as `## Self Check`.

Concrete refinement: use a compact comment block with plain labels, not markdown headers, for example `SELF-CHECK:` and `FAILURE MODES:` inside `<!-- ... -->`. Keep it near the relevant required section, but do not introduce any line beginning `## ` inside the comment.

### Finding 2: A tracked `## SELF-CHECK` section is feasible but changes the structural contract and is not the minimal T3 implementation.

`TEMPLATE_HEADERS` delegates to `template-structure.js compare ... headers`, treats missing or out-of-order required headers as structural failures, and remediates by restoring exact H1/H2 structure from active templates. [SOURCE: .opencode/skills/system-spec-kit/scripts/rules/check-template-headers.sh:53-64] [SOURCE: .opencode/skills/system-spec-kit/scripts/rules/check-template-headers.sh:101-145] [SOURCE: .opencode/skills/system-spec-kit/scripts/rules/check-template-headers.sh:182-191] The contract docs warn that required-header order and anchor presence are separate gates and that template changes require tests, docs sync, and sample validation. [SOURCE: .opencode/skills/system-spec-kit/references/validation/template_compliance_contract.md:231-252] [SOURCE: .opencode/skills/system-spec-kit/references/validation/template_compliance_contract.md:258-264]

Concrete refinement: do not create a tracked `## SELF-CHECK` section unless the team intentionally wants self-check to become a required authored-doc section across affected levels. For the current low-risk T3 phase, keep it as comment guidance and verify by scaffolding a sample folder plus `validate.sh --strict`, as phase 002 already requires. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/002-self-check-templates/spec.md:121-125]

### Finding 3: The phase plan should refine its `TEMPLATE_HEADERS list` wording; the live header contract is template-derived, not registry-list-derived.

Phase 002 lists `scripts/lib/validator-registry.json + TEMPLATE_HEADERS list` as a file to modify only if a tracked section is added. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/002-self-check-templates/spec.md:104-112] The registry only registers the `TEMPLATE_HEADERS` rule, severity, script path, category, and description. [SOURCE: .opencode/skills/system-spec-kit/scripts/lib/validator-registry.json:227-232] Required headers are extracted from the rendered manifest template via `loadTemplateContract()`, which reads the template, extracts H2 headers, and classifies required vs optional headers. [SOURCE: .opencode/skills/system-spec-kit/scripts/utils/template-structure.js:438-449] [SOURCE: .opencode/skills/system-spec-kit/scripts/utils/template-structure.js:492-501]

Concrete refinement: for comment guidance, no registry or header-contract code change should be needed. For a tracked section, the follow-up work is template changes plus contract/test/reference updates, not a simple static list edit.

### Finding 4: Existing spec-kit and external markdown tooling both support comments as the right non-section guidance surface.

The manifest templates already rely on HTML comments for branch markers, level/source metadata, anchors, and template guidance. [SOURCE: .opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:1-38] [SOURCE: .opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:131-136] [SOURCE: .opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl:55-67] [SOURCE: .opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:36-44] Spec-kit also has rule prior art for treating HTML comments as an ignored/comment surface: `PHASE_PARENT_CONTENT` explicitly skips tokens inside HTML comment blocks. [SOURCE: .opencode/skills/system-spec-kit/references/validation/validation_rules.md:160-175] [SOURCE: .opencode/skills/system-spec-kit/scripts/rules/check-phase-parent-content.sh:31-50]

External prior art aligns with that choice. markdownlint says most rules ignore HTML comments and uses non-rendered HTML comments for inline configuration such as `markdownlint-disable` / `markdownlint-enable`. [SOURCE: https://github.com/DavidAnson/markdownlint/blob/main/README.md#configuration] Vale is markup-aware and exposes comment scopes, showing that mature doc-lint systems treat comments as a distinct control/guidance surface rather than ordinary document sections. [SOURCE: https://vale.sh/docs/topics/scoping/]

### Finding 5: `SECTION_COUNTS` and strict-mode interaction further favor comments over tracked sections.

`SECTION_COUNTS` counts lines starting with `## ` as H2 sections and validates expected section counts by level. [SOURCE: .opencode/skills/system-spec-kit/references/validation/validation_rules.md:844-864] `TEMPLATE_HEADERS` reports mid-document extra headers as warnings, and validation warnings become validation errors under strict mode. [SOURCE: .opencode/skills/system-spec-kit/scripts/rules/check-template-headers.sh:139-200] [SOURCE: .opencode/skills/system-spec-kit/references/validation/validation_rules.md:27-35] A tracked self-check section could therefore create strict-mode churn if authors place custom copies in the wrong location or if generated docs drift from the required sequence.

Concrete refinement: if the implementation wants visible rendered guidance later, put custom rendered sections only after all required structure, or make them optional addenda with tests. For phase 002, comments avoid this strict-mode risk.

### Ruled Out Direction: Comment blocks containing markdown section headers.

Ruled out for T3: `<!-- ... ## Self Check ... -->` style comment blocks. The content would be non-rendered to humans, but `TEMPLATE_HEADERS` can still see line-start H2 syntax because the header extractor strips fenced code only, not HTML comments. [SOURCE: .opencode/skills/system-spec-kit/scripts/utils/template-structure.js:16-18] [SOURCE: .opencode/skills/system-spec-kit/scripts/utils/template-structure.js:333-361]

## Questions Answered

- Q1 is substantially answered. Ship T3 as concise HTML-comment guidance, not tracked `##` sections, for the first implementation. The important implementation constraint is to use comment-local labels rather than markdown H2/H3 headings inside comments.
- Prior art is sufficient for the comment choice: spec-kit already uses comments for anchors/template guidance and markdownlint/Vale both treat comments as non-rendered or separately scoped lint surfaces.

## Questions Remaining

- Q2 (T4): Severity remains open. The phase 003 spec leans INFO initially because strict mode escalates WARNING to blocking. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/003-current-state-discipline/spec.md:147-160]
- Q3 (T2): The phase 004 scope is clearly read-only and human-in-the-loop, but external prior art for staleness/expiry still needs investigation. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/004-constitutional-rule-review/spec.md:92-100] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/004-constitutional-rule-review/spec.md:142-158]
- Q4 (T1): Deferred acceptance-coverage mapping still needs external prior art and feasibility risk analysis.
- Q5: Rollout sequencing should revisit strict-mode behavior after Q2/Q3, because WARNING rules become strict-mode blockers. [SOURCE: .opencode/skills/system-spec-kit/references/validation/validation_rules.md:27-35]

## Next Focus

Q2 (T4): Determine whether the broadened current-state-only rule should start as INFO or WARNING, which document scopes minimize false positives, and how comparable doc linters detect or avoid history-narrative false positives.
