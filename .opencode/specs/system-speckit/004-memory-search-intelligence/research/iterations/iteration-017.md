# Iteration 17: Documentation-Quality Validation Gaps For Catalog Test Labels

## Focus

This iteration audited sk-doc and system-spec-kit validation/test surfaces for documentation-quality enforcement gaps around the iteration 15-16 catalog drift: placeholder test paths, invalid validation-table `Type` values, and create-command/template section-name drift.

Ambiguity note: the dispatch says run 17/40 and the state/strategy still record a 40-iteration cap, but `deep-research-config.json` currently says `maxIterations: 20`. Since run 17 is below both caps, this iteration proceeded and recorded the control-file contradiction for reducer/operator follow-up.

## Findings

1. `validate_document.py` has no feature-catalog document type in its path detector: it special-cases manual playbook feature files, commands, install guides, changelogs, readmes, skills, specs, agents, references, and assets, then defaults other markdown to `readme`. Feature-catalog files under `.opencode/skills/*/feature_catalog/` therefore receive generic README validation rather than the per-feature catalog contract. [SOURCE: .opencode/skills/sk-doc/scripts/validate_document.py:119] [SOURCE: .opencode/skills/sk-doc/scripts/validate_document.py:154] [SOURCE: .opencode/skills/sk-doc/assets/template_rules.json:5]
2. The actual placeholder row pattern from iteration 15 passes current sk-doc validation: `dual-level-retrieval.md` contains `| — | Automated test | — |`, while `validate_document.py ... --json` reported `document_type: "readme"`, `valid: true`, and `total_issues: 0`. [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/retrieval-enhancements/dual-level-retrieval.md:41] [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/retrieval-enhancements/dual-level-retrieval.md:43] [INFERENCE: command output from `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-spec-kit/feature_catalog/retrieval-enhancements/dual-level-retrieval.md --json`]
3. `check-markdown-links.cjs` is strong for relative-link existence but does not address this label drift: it extracts markdown links/ref-defs, skips placeholder/glob/variable references containing `<>{}*$`, resolves paths on disk, and reports broken links. A table cell containing `—` or an invalid `Type` value is not a markdown link target and is outside this guard. [SOURCE: .opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs:7] [SOURCE: .opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs:120] [SOURCE: .opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs:185]
4. The closest system-spec-kit public-surface test that scans feature catalogs is `workflow-invariance.vitest.ts`, but its purpose is private taxonomy leakage. It includes `feature_catalog` and `manual_testing_playbook` roots in default scan surfaces, yet the banned pattern is limited to `preset`, `capability/capabilities`, `kind`, and `manifest`, so it cannot catch `Automated test` placeholder rows or `Integration`/manual-scenario label misuse. [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:12] [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:45] [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:132]
5. Existing system-spec-kit validation utilities and manual-playbook tests enforce adjacent surfaces rather than catalog validation-table taxonomy: `validation-utils.ts` only detects leaked Mustache placeholders/anchors, and `manual-playbook-runner.vitest.ts` validates scenario parsing, automatable metadata, and tool-argument schemas. Those gates are useful but do not inspect feature-catalog `Validation And Tests` rows for placeholder paths or invalid Type values. [SOURCE: .opencode/skills/system-spec-kit/scripts/utils/validation-utils.ts:8] [SOURCE: .opencode/skills/system-spec-kit/scripts/utils/validation-utils.ts:19] [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/manual-playbook-runner.vitest.ts:117] [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/manual-playbook-runner.vitest.ts:288]

## Ruled Out

- A generic markdown validation failure for placeholder test rows was ruled out by the direct validation run on `dual-level-retrieval.md`; it returned valid/readme/zero issues despite the placeholder automated-test row. [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/retrieval-enhancements/dual-level-retrieval.md:43] [INFERENCE: command output from the validation run]
- Link checking as sufficient protection was ruled out because the link checker operates on markdown link targets, not table taxonomy or em-dash placeholders. [SOURCE: .opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs:108] [SOURCE: .opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs:176]

## Dead Ends

- No inspected validation gate currently combines feature-catalog path detection, table-schema validation, test-path existence, and allowed `Type` taxonomy. This should be promoted as a docs-quality coverage gap, not treated as already covered by existing validators.

## Edge Cases

- Ambiguous input: The latest synthesis focus was used because reducer-owned strategy `Next Focus` remains stale.
- Contradictory evidence: State/strategy/user context imply a 40-iteration cap, while current config says 20; run 17 remains valid under either cap.
- Missing dependencies: Code graph remained stale/untrusted; direct file reads, greps, and a bounded validation command were used. [SOURCE: .opencode/specs/system-speckit/004-memory-search-intelligence/research/deep-research-strategy.md:122]
- Partial success: This pass identified validation blind spots but did not implement or run a new lint rule, per research-only scope.

## Sources Consulted

- `.opencode/skills/sk-doc/scripts/validate_document.py:119`
- `.opencode/skills/sk-doc/scripts/validate_document.py:154`
- `.opencode/skills/sk-doc/assets/template_rules.json:5`
- `.opencode/skills/system-spec-kit/feature_catalog/retrieval-enhancements/dual-level-retrieval.md:41`
- `.opencode/skills/system-spec-kit/feature_catalog/retrieval-enhancements/dual-level-retrieval.md:43`
- `command output: python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-spec-kit/feature_catalog/retrieval-enhancements/dual-level-retrieval.md --json`
- `.opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs:7`
- `.opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs:120`
- `.opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs:185`
- `.opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:12`
- `.opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:45`
- `.opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:132`
- `.opencode/skills/system-spec-kit/scripts/utils/validation-utils.ts:8`
- `.opencode/skills/system-spec-kit/scripts/utils/validation-utils.ts:19`
- `.opencode/skills/system-spec-kit/scripts/tests/manual-playbook-runner.vitest.ts:117`
- `.opencode/skills/system-spec-kit/scripts/tests/manual-playbook-runner.vitest.ts:288`
- `.opencode/specs/system-speckit/004-memory-search-intelligence/research/deep-research-strategy.md:122`

## Assessment

- New information ratio: 1.0
- Questions addressed:
  - Where do docs claim coverage that tests or validation do not fully support?
  - Where does implemented behavior lack corresponding catalog/playbook/test coverage?
  - Which gaps affect skill docs and deep-loop workflow reliability surfaces?
- Questions answered:
  - Existing sk-doc validation treats feature-catalog leaves as generic README docs.
  - Placeholder automated-test rows can pass current validation.
  - Link, invariance, placeholder, and manual-playbook tests do not cover catalog validation-table taxonomy.

## Reflection

- What worked and why: Running the existing validator against a known placeholder catalog file converted a suspected blind spot into direct evidence.
- What did not work and why: Grep found many adjacent validation utilities, but most were scoped to links, workflow vocabulary, rendered placeholders, or manual playbook execution rather than feature-catalog table semantics.
- What I would do differently: Next pass should audit command/package docs that claim feature-catalog validation completeness and compare them to the validated blind spots.

## Recommended Next Focus

Audit `/create:feature-catalog`, sk-doc README/SKILL, and feature-catalog creation references for overclaims about validation completeness now that table taxonomy and placeholder test rows are known blind spots.
