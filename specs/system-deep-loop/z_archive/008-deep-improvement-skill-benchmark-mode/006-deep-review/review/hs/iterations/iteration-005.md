# Iteration 005 - sk-doc Template Alignment

## Focus

Compare `.opencode/skills/deep-improvement/references/skill-benchmark/*.md` against sk-doc reference template (skill_reference_template.md), and `.opencode/skills/deep-improvement/assets/skill-benchmark/*` against sk-doc asset template (skill_asset_template.md) + template_rules.json. Identify every structural/frontmatter/section deviation.

## Findings

### P0 Findings (Correctness/Security/Contradiction)

**1. scenario_authoring.md — Missing YAML frontmatter**
- Severity: P0
- File: `.opencode/skills/deep-improvement/references/skill-benchmark/scenario_authoring.md`
- Line: 1
- Issue: File begins with `# Lane C — scenario (fixture) authoring` but reference files require YAML frontmatter with `title` and `description` per skill_reference_template.md lines 53-56
- Fix: Add YAML frontmatter block at line 1: `---`, `title: ...`, `description: ...`, `---`

**2. scenario_authoring.md — Missing required overview section**
- Severity: P0
- File: `.opencode/skills/deep-improvement/references/skill-benchmark/scenario_authoring.md`
- Line: 1
- Issue: template_rules.json line 254 mandates `overview` as required section for `reference` document type; file has no `## 1. OVERVIEW` section
- Fix: Add `## 1. OVERVIEW` section after the intro block and `---` separator

**3. scenario_authoring.md — Missing section separator after intro**
- Severity: P0
- File: `.opencode/skills/deep-improvement/references/skill-benchmark/scenario_authoring.md`
- Line: 1
- Issue: skill_reference_template.md line 62 requires `---` after the 1-2 sentence intro; file has no `---` separator
- Fix: Add `---` after intro block before `## 1. OVERVIEW`

**4. scoring_contract.md — Missing YAML frontmatter**
- Severity: P0
- File: `.opencode/skills/deep-improvement/references/skill-benchmark/scoring_contract.md`
- Line: 1
- Issue: File begins with `# Lane C — scoring contract` but reference files require YAML frontmatter
- Fix: Add YAML frontmatter block at line 1

**5. scoring_contract.md — Missing required overview section**
- Severity: P0
- File: `.opencode/skills/deep-improvement/references/skill-benchmark/scoring_contract.md`
- Line: 1
- Issue: template_rules.json requires `overview` section for reference type
- Fix: Add `## 1. OVERVIEW` section

**6. scoring_contract.md — Missing section separator after intro**
- Severity: P0
- File: `.opencode/skills/deep-improvement/references/skill-benchmark/scoring_contract.md`
- Line: 1
- Issue: skill_reference_template.md requires `---` after intro
- Fix: Add `---` after intro block

**7. operator_guide.md — Missing YAML frontmatter**
- Severity: P0
- File: `.opencode/skills/deep-improvement/references/skill-benchmark/operator_guide.md`
- Line: 1
- Issue: File begins with `# Lane C — skill-benchmark operator guide` but reference files require YAML frontmatter
- Fix: Add YAML frontmatter block at line 1

**8. operator_guide.md — Missing required overview section**
- Severity: P0
- File: `.opencode/skills/deep-improvement/references/skill-benchmark/operator_guide.md`
- Line: 1
- Issue: template_rules.json requires `overview` section for reference type
- Fix: Add `## 1. OVERVIEW` section

**9. operator_guide.md — Missing section separator after intro**
- Severity: P0
- File: `.opencode/skills/deep-improvement/references/skill-benchmark/operator_guide.md`
- Line: 1
- Issue: skill_reference_template.md requires `---` after intro
- Fix: Add `---` after intro block

**10. remediation_taxonomy.json — Missing YAML frontmatter**
- Severity: P0
- File: `.opencode/skills/deep-improvement/assets/skill-benchmark/remediation_taxonomy.json`
- Line: 1
- Issue: skill_asset_template.md lines 125-127 require YAML frontmatter with `title` and `description` for asset files; JSON file has no frontmatter
- Fix: Add YAML frontmatter block: `---`, `title: remediation_taxonomy`, `description: ...`, `---` before the JSON content

**11. remediation_taxonomy.json — Missing required overview section**
- Severity: P0
- File: `.opencode/skills/deep-improvement/assets/skill-benchmark/remediation_taxonomy.json`
- Line: 1
- Issue: template_rules.json line 303-307 mandates `overview` as required section for `asset` document type; JSON has no markdown wrapper with overview
- Fix: Wrap JSON in markdown with `## 1. OVERVIEW` section per skill_asset_template.md structure

**12. default_profile.json — Missing YAML frontmatter**
- Severity: P0
- File: `.opencode/skills/deep-improvement/assets/skill-benchmark/default_profile.json`
- Line: 1
- Issue: skill_asset_template.md requires YAML frontmatter for asset files
- Fix: Add YAML frontmatter block before JSON content

**13. default_profile.json — Missing required overview section**
- Severity: P0
- File: `.opencode/skills/deep-improvement/assets/skill-benchmark/default_profile.json`
- Line: 1
- Issue: template_rules.json requires `overview` section for asset type
- Fix: Wrap in markdown structure with `## 1. OVERVIEW` section

### P1 Findings (Degraded/Incomplete/Missing Validation)

**14. scenario_authoring.md — Section headers not numbered ALL CAPS**
- Severity: P1
- File: `.opencode/skills/deep-improvement/references/skill-benchmark/scenario_authoring.md`
- Line: 8
- Issue: "Three tiers" should be `## 1. THREE TIERS (ANTI-CIRCULARITY)` per skill_reference_template.md numbering + uppercase convention
- Fix: Use numbered ALL CAPS H2 headers: `## 1.`, `## 2.`, etc.

**15. scoring_contract.md — Section headers not numbered ALL CAPS**
- Severity: P1
- File: `.opencode/skills/deep-improvement/references/skill-benchmark/scoring_contract.md`
- Line: 5
- Issue: "Point weights" should be `## 1. POINT WEIGHTS (FULL / LIVE MODE)` per template convention
- Fix: Use numbered ALL CAPS H2 headers

**16. operator_guide.md — Section headers not numbered ALL CAPS**
- Severity: P1
- File: `.opencode/skills/deep-improvement/references/skill-benchmark/operator_guide.md`
- Line: 5
- Issue: "Invocation" should be `## 1. INVOCATION` per template convention
- Fix: Use numbered ALL CAPS H2 headers

### P2 Findings (Style/Naming/Docs)

**17. skill-benchmark reference files — snake_case naming violated**
- Severity: P2
- File: `.opencode/skills/deep-improvement/references/skill-benchmark/scenario_authoring.md`
- Line: 1
- Issue: skill_reference_template.md line 18 mandates snake_case for reference filenames; all three .md files use snake_case correctly, but the parent directory `skill-benchmark` uses kebab-case
- Fix: Consider renaming directory from `skill-benchmark` to `skill_benchmark` for full compliance

**18. remediation_taxonomy.json — Intro not 1-2 sentences**
- Severity: P2
- File: `.opencode/skills/deep-improvement/assets/skill-benchmark/remediation_taxonomy.json`
- Line: 1
- Issue: skill_asset_template.md lines 121, 131 require 1-2 sentence intro after H1 with no subsections; JSON file is not markdown-wrapped at all
- Fix: Wrap in markdown structure per skill_asset_template.md

**19. default_profile.json — Intro not 1-2 sentences**
- Severity: P2
- File: `.opencode/skills/deep-improvement/assets/skill-benchmark/default_profile.json`
- Line: 1
- Issue: skill_asset_template.md requires 1-2 sentence intro; JSON file has no markdown wrapper
- Fix: Wrap in markdown structure with proper intro

## Verdict

**Review verdict: FAIL**

All 5 skill-benchmark files (3 reference .md files + 2 asset .json files) exhibit systematic P0 frontmatter absence and missing required `overview` sections per template_rules.json. This is a complete structural violation of the sk-doc template system. The 3 P1 findings compound the issue with unnumbered/non-ALL-CAPS section headers. The assets (JSON files) are not even wrapped in markdown, making them entirely non-compliant with skill_asset_template.md requirements.