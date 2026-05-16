# Iteration 008 - Feature Catalog and Manual Testing Playbook Validation

## Focus

Q7: Does the feature_catalog index + per-feature files validate as `--type playbook`? Are per-feature files inside the catalog discoverable via the per-type contract or do they require recursion?

Q8: Does the manual_testing_playbook index + per-scenario files validate as `--type playbook`? Same recursion question.

## Actions Taken

1. Located feature_catalog and manual_testing_playbook directories under `.opencode/skills/system-code-graph/`
2. Read feature_catalog index (`feature_catalog.md`) and sampled 3 per-feature files from different groups
3. Read manual_testing_playbook index (`manual_testing_playbook.md`) and sampled 3 per-scenario files from different groups
4. Analyzed sk-doc template_rules.json to understand document type validation contracts
5. Reviewed feature_catalog_creation.md and manual_testing_playbook_creation.md reference docs to understand intended contracts

## Findings

### Q7: Feature Catalog Validation

**Finding 1: No feature_catalog document type exists in template_rules.json**

The sk-doc `template_rules.json` defines document types for: readme, skill, command, install_guide, reference, asset, changelog, playbook, spec, agent, and playbook_feature. There is NO "feature_catalog" document type defined (template_rules.json:4-558).

**Finding 2: Feature catalog follows its own contract, not playbook contract**

The feature_catalog index (`feature_catalog/feature_catalog.md`) structure:
- Has frontmatter with title, description, trigger_phrases, importance_tier (feature_catalog.md:1-10)
- Has H1 intro paragraph (feature_catalog.md:12)
- Has unnumbered `TABLE OF CONTENTS` (feature_catalog.md:20-30)
- Has numbered H2 sections starting with `## 1. OVERVIEW` (feature_catalog.md:34)
- Uses ALL CAPS for H2 section names (feature_catalog.md:34, 55, 89, etc.)

This matches the feature_catalog template contract (feature_catalog_template.md:18-23) which specifies:
- "Feature-catalog shaped: The root file uses frontmatter, an H1 intro paragraph, an unnumbered `TABLE OF CONTENTS`, and numbered all-caps H2 section headers"

**Finding 3: Per-feature files do not match playbook_feature contract**

Sampled per-feature file (`01--read-path-freshness/01-ensure-code-graph-ready.md`):
- Has frontmatter (01-ensure-code-graph-ready.md:1-8)
- Has numbered H2 sections: OVERVIEW, CURRENT REALITY, SOURCE FILES, SOURCE METADATA (01-ensure-code-graph-ready.md:13, 19, 35, 55)
- Uses ANCHOR comments (<!-- ANCHOR:overview -->, <!-- /ANCHOR:overview -->) (01-ensure-code-graph-ready.md:12, 16)

The playbook_feature type in template_rules.json requires:
- requiredSections: ["overview", "scenario_contract", "test_execution", "source_metadata"] (template_rules.json:546-550)
- sectionAliases: {"references": "source_files"} (template_rules.json:552-555)

The feature catalog per-feature files have "CURRENT REALITY" and "SOURCE FILES" sections, not "SCENARIO CONTRACT" and "TEST EXECUTION".

**Finding 4: Per-feature files are NOT discoverable via per-type contract**

Since there is no "feature_catalog" document type in template_rules.json:
- The validator cannot auto-detect feature_catalog files as a specific type
- Per-feature files would fall back to default "readme" type detection (validate_document.py:119-156)
- The playbook_feature type is specific to manual_testing_playbook per-scenario files, not feature_catalog per-feature files
- Recursion is required because the validator does not have a feature_catalog contract to validate against

### Q8: Manual Testing Playbook Validation

**Finding 5: Manual testing playbook index DOES validate as playbook type**

The manual_testing_playbook index (`manual_testing_playbook/manual_testing_playbook.md`) structure matches the playbook contract in template_rules.json:
- Has frontmatter with title, description, trigger_phrases, importance_tier (manual_testing_playbook.md:1-10)
- Has `TABLE OF CONTENTS` (manual_testing_playbook.md:17-36)
- Has required sections: OVERVIEW, GLOBAL PRECONDITIONS, GLOBAL EVIDENCE REQUIREMENTS, DETERMINISTIC COMMAND NOTATION (manual_testing_playbook.md:40, 57, 64, 71)
- Has recommended sections: AUTOMATED TEST CROSS-REFERENCE, FEATURE CATALOG CROSS-REFERENCE INDEX (manual_testing_playbook.md:185, 189)

The playbook type in template_rules.json specifies:
- requiredSections: ["overview", "global_preconditions", "global_evidence_requirements", "deterministic_command_notation"] (template_rules.json:408-413)
- recommendedSections: ["automated_test_cross_reference", "feature_catalog_cross_reference"] (template_rules.json:414-417)
- tocRequired: true (template_rules.json:440)
- h2UppercaseRequired: true (template_rules.json:442)

**Finding 6: Per-scenario files DO validate as playbook_feature type**

Sampled per-scenario file (`01--read-path-freshness/001-ensure-ready-selective-reindex.md`):
- Has frontmatter with title, description, trigger_phrases, importance_tier (001-ensure-ready-selective-reindex.md:1-9)
- Has required sections: OVERVIEW, SCENARIO CONTRACT, TEST EXECUTION, SOURCE FILES, SOURCE METADATA (001-ensure-ready-selective-reindex.md:12, 18, 30, 53, 62)
- Has numbered H2 sections matching the playbook_feature contract

The playbook_feature type in template_rules.json specifies:
- requiredSections: ["overview", "scenario_contract", "test_execution", "source_metadata"] (template_rules.json:546-550)
- sectionAliases: {"references": "source_files"} (template_rules.json:552-555)

The per-scenario files match this contract, with "SOURCE FILES" being an alias for "references".

**Finding 7: Per-scenario files ARE discoverable via per-type contract**

The validate_document.py script has specific detection logic for playbook_feature files:
- Per-feature playbook files are detected via path pattern: `/manual_testing_playbook/NN--category/NNN-feature.md` (validate_document.py:123-130)
- The parent directory matching `NN--category-name` pattern triggers playbook_feature type detection
- This means the validator CAN auto-detect per-scenario files as playbook_feature type without explicit --type flag

**Finding 8: Validator limitation requires manual recursion for both catalogs**

From manual_testing_playbook_creation.md:
- "Validator limitation: the current validator is root-doc focused" (manual_testing_playbook_creation.md:218)
- "it does not recurse into category folders" (manual_testing_playbook_creation.md:219)
- "it does not verify cross-file playbook links by itself" (manual_testing_playbook_creation.md:220)

From feature_catalog_creation.md:
- "Validation workflow: validate the root catalog with validate_document.py" (feature_catalog_creation.md:160)
- "manually check per-feature file links and source anchors" (feature_catalog_creation.md:161)
- "Current validator limitation: validation is strongest at the root-doc level" (feature_catalog_creation.md:164)
- "per-feature file link and source-anchor quality still require manual review" (feature_catalog_creation.md:166)

Both catalogs require manual recursion because the validator does not automatically validate files in subdirectories.

## Questions Answered

**Q7**: Does the feature_catalog index + per-feature files validate as `--type playbook`? Are per-feature files inside the catalog discoverable via the per-type contract or do they require recursion?

- Answer: The feature_catalog index does NOT validate as `--type playbook` because there is no "feature_catalog" document type in template_rules.json. Per-feature files are NOT discoverable via the per-type contract for the same reason. Both require manual recursion and follow their own contract defined in feature_catalog_creation.md and feature_catalog_template.md.

**Q8**: Does the manual_testing_playbook index + per-scenario files validate as `--type playbook`? Same recursion question.

- Answer: The manual_testing_playbook index DOES validate as `--type playbook` per the template_rules.json contract. Per-scenario files ARE discoverable via the per-type contract as `playbook_feature` type through path pattern detection. However, both require manual recursion because the validator does not automatically validate files in subdirectories.

## Questions Remaining

- Q1: What specific bugs, drift, or weak prose exist in each authored doc under `.opencode/skills/system-code-graph/` beyond the 3 known INSTALL_GUIDE drifts?
- Q2: What sk-doc `--type` does each authored doc match, and what mandatory anchors / H2 cases / TOC requirements does each per-type contract impose?
- Q3: What HVR violations (em dashes, banned words, banned phrases, semicolons, Oxford commas) does each authored doc currently contain?
- Q4: What problem hook and section arc do the Public root README and system-spec-kit README use that the system-code-graph README should mimic structurally while staying HVR-clean?
- Q5: What "useful" content gaps exist in SKILL.md / references / per-folder mcp_server READMEs that operators reading the skill cold would benefit from?
- Q6: Which per-folder mcp_server READMEs require fresh authoring vs validation-only passes?
- Q9: What's the optimal child-001 task ordering?
- Q10: What are the 3 worst-case HVR pitfalls the root README + system-spec-kit README contain that the system-code-graph README must avoid mimicking?

## Next Focus

Q2: What sk-doc `--type` does each authored doc under `.opencode/skills/system-code-graph/` match, and what mandatory anchors / H2 cases / TOC requirements does each per-type contract impose? This will build on the validation contract understanding from Q7/Q8 and map each authored doc to its correct sk-doc type with specific requirements.
