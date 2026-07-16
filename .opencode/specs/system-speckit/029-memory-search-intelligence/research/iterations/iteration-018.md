# Iteration 18: Validation-Completeness Claims For Feature Catalog Creation

## Focus

This iteration audited `/create:feature-catalog`, sk-doc README/SKILL, and feature-catalog creation references for overclaims or under-disclosed limits now that iteration 17 showed placeholder catalog test rows can pass current validation.

The parent repaired the config drift back to `maxIterations: 40`; this run used the live config plus state log as source of truth.

## Findings

1. `/create:feature-catalog` is a thin router and delegates user-visible completion wording to the presentation asset; the completion template reports `Feature Catalog Command Complete` with only root validation, root/per-feature link checks, and category/per-feature count checks. It does not include a slot for known blind spots such as validation-table `Type` taxonomy, placeholder test-path rows, or per-feature source-anchor quality. [SOURCE: .opencode/commands/create/feature-catalog.md:9] [SOURCE: .opencode/commands/create/feature-catalog.md:29] [SOURCE: .opencode/commands/create/assets/create_feature_catalog_presentation.txt:126] [SOURCE: .opencode/commands/create/assets/create_feature_catalog_presentation.txt:137]
2. The auto workflow's validation gate is internally narrower than its feature-file quality standard: quality standards require per-feature `SOURCE FILES`/`SOURCE METADATA`, but validation activities check root validation, linked file existence, category folder names, required section headers, and root/file counts. No inspected activity validates that test paths are real non-placeholder rows or that validation-table `Type` values match the sk-doc taxonomy. [SOURCE: .opencode/commands/create/assets/create_feature_catalog_auto.yaml:163] [SOURCE: .opencode/commands/create/assets/create_feature_catalog_auto.yaml:167] [SOURCE: .opencode/commands/create/assets/create_feature_catalog_auto.yaml:258] [SOURCE: .opencode/commands/create/assets/create_feature_catalog_auto.yaml:261]
3. The feature-catalog creation reference is the most honest inspected surface: it explicitly says `validate_document.py` is strongest at the root-doc level, cross-file link resolution is covered by `check-markdown-links.cjs`, and per-feature link correctness/source-anchor quality still require manual review. This means the reference already contains the right caveat, but the create-command presentation does not surface it in completion output. [SOURCE: .opencode/skills/sk-doc/references/feature_catalog_creation.md:174] [SOURCE: .opencode/skills/sk-doc/references/feature_catalog_creation.md:179] [SOURCE: .opencode/commands/create/assets/create_feature_catalog_presentation.txt:137]
4. The sk-doc README has broader quality-pipeline language than the feature-catalog validator currently supports. It says the core pipeline produces a pass/fail checklist and violations before AI judgment, and that no document gets a quality pass without the script running first; but its own FAQ narrows `validate_document.py` to README delivery gates and `extract_structure.py` as the full-picture report. That broader language can overlead operators if they assume feature-catalog table semantics are script-enforced. [SOURCE: .opencode/skills/sk-doc/README.md:44] [SOURCE: .opencode/skills/sk-doc/README.md:84] [SOURCE: .opencode/skills/sk-doc/README.md:146]
5. The sk-doc SKILL success criteria are comparatively aligned because they require catalog/playbook template fill, link resolution, and honest statement of known validator limits. However, the create-command completion template only reports validation pass/fail categories and does not prompt the operator to state those known limits, creating a presentation gap between the skill contract and command result surface. [SOURCE: .opencode/skills/sk-doc/SKILL.md:435] [SOURCE: .opencode/skills/sk-doc/SKILL.md:439] [SOURCE: .opencode/commands/create/assets/create_feature_catalog_presentation.txt:137]

## Ruled Out

- The feature-catalog creation reference itself was ruled out as an overclaiming source; it explicitly documents root-level validator strength and manual review limits. [SOURCE: .opencode/skills/sk-doc/references/feature_catalog_creation.md:179]
- The create workflow was ruled out as claiming semantic test-table validation directly; its listed validation activities are structural/link/count checks. The issue is missing caveat propagation, not a direct false claim that table taxonomy is validated. [SOURCE: .opencode/commands/create/assets/create_feature_catalog_auto.yaml:258]

## Dead Ends

- No inspected `/create:feature-catalog` completion/status surface includes the sk-doc SKILL's “known validator limits stated honestly” requirement, so reducer follow-up should treat this as a presentation/contract alignment gap.

## Edge Cases

- Ambiguous input: Strategy `Next Focus` remains stale; selected the latest synthesis recommendation from iteration 17.
- Contradictory evidence: Config/state drift from iteration 17 was repaired; config now says `maxIterations: 40`, and the state log records a `config_repaired` event restoring 20 to 40. [SOURCE: .opencode/specs/system-speckit/029-memory-search-intelligence/research/deep-research-config.json:3] [SOURCE: .opencode/specs/system-speckit/029-memory-search-intelligence/research/deep-research-state.jsonl:20]
- Missing dependencies: Code graph remained stale/untrusted; direct reads/greps were used. [SOURCE: .opencode/specs/system-speckit/029-memory-search-intelligence/research/deep-research-strategy.md:122]
- Partial success: This pass audited public claim surfaces but did not inspect generated historical command transcripts beyond current command assets.

## Sources Consulted

- `.opencode/commands/create/feature-catalog.md:9`
- `.opencode/commands/create/feature-catalog.md:29`
- `.opencode/commands/create/assets/create_feature_catalog_presentation.txt:126`
- `.opencode/commands/create/assets/create_feature_catalog_presentation.txt:137`
- `.opencode/commands/create/assets/create_feature_catalog_auto.yaml:163`
- `.opencode/commands/create/assets/create_feature_catalog_auto.yaml:167`
- `.opencode/commands/create/assets/create_feature_catalog_auto.yaml:258`
- `.opencode/commands/create/assets/create_feature_catalog_auto.yaml:261`
- `.opencode/skills/sk-doc/references/feature_catalog_creation.md:174`
- `.opencode/skills/sk-doc/references/feature_catalog_creation.md:179`
- `.opencode/skills/sk-doc/README.md:44`
- `.opencode/skills/sk-doc/README.md:84`
- `.opencode/skills/sk-doc/README.md:146`
- `.opencode/skills/sk-doc/SKILL.md:435`
- `.opencode/skills/sk-doc/SKILL.md:439`
- `.opencode/specs/system-speckit/029-memory-search-intelligence/research/deep-research-config.json:3`
- `.opencode/specs/system-speckit/029-memory-search-intelligence/research/deep-research-state.jsonl:20`
- `.opencode/specs/system-speckit/029-memory-search-intelligence/research/deep-research-strategy.md:122`

## Assessment

- New information ratio: 1.0
- Questions addressed:
  - Which command and skill-reference surfaces describe outdated, missing, or over-compressed behavior?
  - Where do docs claim coverage that tests or validation do not fully support?
  - Which gaps affect command routing and skill docs?
- Questions answered:
  - `/create:feature-catalog` completion under-discloses known validator limits.
  - The creation reference is honest about current validator limits.
  - sk-doc README/SKILL are mixed: README language is broader, while SKILL success criteria include the right honesty requirement.

## Reflection

- What worked and why: Comparing command presentation output against the creation reference and SKILL success criteria isolated a propagation gap rather than treating all docs as stale.
- What did not work and why: Current assets do not show whether operators routinely include the missing caveat in freeform summaries; only the prescribed template was inspectable.
- What I would do differently: Next pass should move from feature-catalog validation to another high-impact alignment surface not yet covered, such as generated metadata/description/graph metadata references after packet 028.

## Recommended Next Focus

Audit generated metadata and skill-advisor/search-index documentation for packet-028 alignment: `description.json`/`graph-metadata.json` generation references, trigger/frontmatter requirements, and whether skill docs accurately describe what memory/search indexes do or do not index.
