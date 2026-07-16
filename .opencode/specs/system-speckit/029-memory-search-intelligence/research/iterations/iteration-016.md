# Iteration 16: Feature-Catalog Generation And Test-Label Taxonomy

## Focus

This iteration traced iteration 15's cross-skill test-label drift back into feature-catalog generation/scaffolding sources: `/create:feature-catalog` command assets, sk-doc feature-catalog templates, and sk-doc creation guidance.

Ambiguity note: the strategy `Next Focus` is still the stale initial inventory instruction, while the latest synthesis recommends generation/scaffolding audit. I selected the narrower latest packet-local recommendation because it directly follows the prior iteration's evidence and avoids repeating completed inventory work.

## Findings

1. `/create:feature-catalog` explicitly loads sk-doc feature-catalog creation guidance and both root/per-feature templates before generation, so the sk-doc template bundle is the intended taxonomy authority for generated or updated feature catalogs. [SOURCE: .opencode/commands/create/assets/create_feature_catalog_auto.yaml:144] [SOURCE: .opencode/commands/create/assets/create_feature_catalog_auto.yaml:149] [SOURCE: .opencode/commands/create/assets/create_feature_catalog_auto.yaml:235]
2. The per-feature template defines only two validation-table `Type` values: `Automated test` and `Manual playbook`; it does not define `Integration`, `Manual scenario contract`, or placeholder automated-test rows as valid `Type` taxonomy. [SOURCE: .opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_snippet_template.md:114] [SOURCE: .opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_snippet_template.md:118] [SOURCE: .opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_snippet_template.md:156]
3. The root feature-catalog template mirrors the same validation table shape and test-type choices, which means the intended public scaffold is consistent; observed `Integration` and manual-scenario-as-automated-test drift is not coming from a documented alternate taxonomy in the template. [SOURCE: .opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md:226] [SOURCE: .opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md:230] [SOURCE: .opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md:254]
4. The generation workflow's validation gate does not check validation-table type values or source-anchor correctness. It checks root validation, linked feature-file existence, category names, section headers, and root/feature-file counts; the creation reference separately says source-anchor correctness still requires manual review. [SOURCE: .opencode/commands/create/assets/create_feature_catalog_auto.yaml:258] [SOURCE: .opencode/commands/create/assets/create_feature_catalog_auto.yaml:261] [SOURCE: .opencode/skills/sk-doc/references/feature_catalog_creation.md:179]
5. There is a scaffolding contract mismatch unrelated to labels but relevant to catalog drift: the create-command quality standards still require per-feature `CURRENT REALITY`, while the current templates require `HOW IT WORKS` and source metadata. That mismatch can make generated-package validation language less precise even when the template itself is current. [SOURCE: .opencode/commands/create/assets/create_feature_catalog_auto.yaml:163] [SOURCE: .opencode/commands/create/assets/create_feature_catalog_auto.yaml:166] [SOURCE: .opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_snippet_template.md:87] [SOURCE: .opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md:217]

## Ruled Out

- A hidden alternate taxonomy in sk-doc feature-catalog templates was ruled out; both root and snippet templates expose only `Automated test` and `Manual playbook` for validation/test table Type values. [SOURCE: .opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md:230] [SOURCE: .opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_snippet_template.md:158]
- A command-level hard validation of test-type taxonomy was ruled out; inspected workflow validation focuses on root/link/count/section checks and leaves source-anchor correctness to manual review. [SOURCE: .opencode/commands/create/assets/create_feature_catalog_auto.yaml:261] [SOURCE: .opencode/skills/sk-doc/references/feature_catalog_creation.md:181]

## Dead Ends

- No script-level validator for `Automated test` vs `Manual playbook` table values was found in the inspected create-command/sk-doc surfaces; the next reducer-facing candidate is a docs-quality gap rather than an implementation bug fix request.

## Edge Cases

- Ambiguous input: Strategy `Next Focus` is stale; selected the latest packet-local recommended focus from iteration 15.
- Contradictory evidence: Templates define a narrow taxonomy, while existing catalogs use broader labels; validation workflow does not enforce the template taxonomy.
- Missing dependencies: Code graph remained stale/untrusted, so direct file reads and greps were used. [SOURCE: .opencode/specs/system-speckit/029-memory-search-intelligence/research/deep-research-strategy.md:122]
- Partial success: The pass identified scaffolding and validation sources but did not inspect every generated catalog history or authoring provenance.

## Sources Consulted

- `.opencode/commands/create/assets/create_feature_catalog_auto.yaml:144`
- `.opencode/commands/create/assets/create_feature_catalog_auto.yaml:149`
- `.opencode/commands/create/assets/create_feature_catalog_auto.yaml:163`
- `.opencode/commands/create/assets/create_feature_catalog_auto.yaml:166`
- `.opencode/commands/create/assets/create_feature_catalog_auto.yaml:235`
- `.opencode/commands/create/assets/create_feature_catalog_auto.yaml:258`
- `.opencode/commands/create/assets/create_feature_catalog_auto.yaml:261`
- `.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_snippet_template.md:87`
- `.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_snippet_template.md:114`
- `.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_snippet_template.md:118`
- `.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_snippet_template.md:156`
- `.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md:217`
- `.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md:226`
- `.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md:230`
- `.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md:254`
- `.opencode/skills/sk-doc/references/feature_catalog_creation.md:179`
- `.opencode/skills/sk-doc/references/feature_catalog_creation.md:181`
- `.opencode/specs/system-speckit/029-memory-search-intelligence/research/deep-research-strategy.md:122`

## Assessment

- New information ratio: 1.0
- Questions addressed:
  - Which docs/assets describe outdated, missing, or over-compressed behavior?
  - Where does implemented or generated behavior lack corresponding validation coverage?
  - Which misalignments affect skill docs and deep-loop workflow reliability surfaces?
- Questions answered:
  - The intended sk-doc taxonomy is narrower than observed catalog labels.
  - The create-feature-catalog workflow does not hard-validate validation-table label taxonomy.
  - Create-command quality standards have a section-name mismatch with current templates.

## Reflection

- What worked and why: Tracing from command assets into sk-doc templates isolated the intended source of truth and separated template taxonomy from validation enforcement.
- What did not work and why: The pass did not prove whether existing incorrect labels were generated or manually authored because provenance is not encoded in the inspected files.
- What I would do differently: Next pass should audit sk-doc/manual-playbook validation and docs-quality tests to see whether a lightweight lint gate exists or could detect this class of drift.

## Recommended Next Focus

Audit sk-doc and system-spec-kit validation/test surfaces for documentation-quality enforcement gaps: `validate_document.py`, markdown link checks, catalog/playbook tests, and whether any gate can detect placeholder test paths, invalid Type values, or template/command section-name drift.
