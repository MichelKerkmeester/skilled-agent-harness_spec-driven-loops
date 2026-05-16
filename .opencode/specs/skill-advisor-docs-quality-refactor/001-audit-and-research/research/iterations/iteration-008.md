# Iter 008 — feature_catalog/01--daemon-and-freshness sk-doc alignment

## Question

Does feature_catalog/01--daemon-and-freshness/ follow sk-doc feature_catalog template 1:1? Are per-feature files complete with feature.md + feature_test.md?

## Evidence (file:line citations required)

**Evidence 1: Root feature_catalog.md structure**
- feature_catalog.md has frontmatter with title, description, and trigger_phrases <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md" lines="1-9" />
- Root catalog has H1 title, intro paragraph, unnumbered TABLE OF CONTENTS, and numbered H2 sections (1. OVERVIEW through 8. PYTHON COMPAT) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md" lines="11-33" />
- Grep for `^## ` found 8 H2 headings: TABLE OF CONTENTS + 7 numbered sections <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md" lines="20-29" />
- Grep for `^---` found 11 frontmatter separators throughout the document <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md" lines="1-173" />
- Root catalog uses simplified table format for feature entries instead of template's Description/Current Reality/Source Files subsections <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md" lines="70-78" />

**Evidence 2: 01--daemon-and-freshness directory contents**
- Directory listing shows exactly 7 per-feature files: 01-watcher.md through 07-cache-invalidation.md <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/01--daemon-and-freshness/" />
- Root catalog section 2 (DAEMON AND FRESHNESS) lists exactly 7 features with links to these 7 files <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md" lines="70-78" />
- File count matches catalog entry count exactly (7 files for 7 catalog entries) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md" lines="70-78" />
- No feature_test.md files exist in the directory (only feature.md files) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/01--daemon-and-freshness/" />

**Evidence 3: Per-feature file structure compliance**
- All 7 per-feature files have frontmatter with title, description, and trigger_phrases <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/01--daemon-and-freshness/01-watcher.md" lines="1-9" />
- All 7 per-feature files include `<!-- sk-doc-template: skill_asset_feature_catalog -->` HTML comment <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/01--daemon-and-freshness/01-watcher.md" line="13" />
- All 7 per-feature files have the 4 required sections: `## 1. OVERVIEW`, `## 2. CURRENT REALITY`, `## 3. SOURCE FILES`, `## 4. SOURCE METADATA` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/01--daemon-and-freshness/01-watcher.md" lines="16-52" />
- SOURCE FILES section in all files includes Implementation and Validation And Tests subsections with file tables <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/01--daemon-and-freshness/01-watcher.md" lines="30-45" />
- SOURCE METADATA section in all files includes Group, Canonical catalog source, and Feature file path <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/01--daemon-and-freshness/01-watcher.md" lines="48-52" />

**Evidence 4: sk-doc feature_catalog template requirements**
- sk-doc feature_catalog_template.md requires root catalog to have frontmatter, H1 intro, unnumbered TABLE OF CONTENTS, and numbered H2 sections <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md" lines="87-106" />
- Template requires per-feature files to have 4 sections: OVERVIEW, CURRENT REALITY, SOURCE FILES, SOURCE METADATA <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md" lines="169-217" />
- Template root catalog scaffold shows each feature should have Description, Current Reality, and Source Files subsections (not simplified table) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md" lines="114-145" />
- Template canonical package shape requires root `feature_catalog.md` plus numbered category directories with per-feature files <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md" lines="27-37" />
- Template checklist requires every root catalog entry to have Description, Current Reality, and Source Files callout <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md" lines="231-254" />

**Evidence 5: sk-doc feature_catalog_creation.md guidance**
- feature_catalog_creation.md states root catalog is for stable inventory and navigation, per-feature files for implementation truth <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/feature_catalog_creation.md" lines="14-16" />
- Guidance states root summaries should answer: what this feature does, what its current reality is, where to find source-file detail <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/feature_catalog_creation.md" lines="90-93" />
- Guidance states root catalog should not be overloaded with exhaustive file tables or full scenario matrices <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/feature_catalog_creation.md" lines="95-100" />
- Guidance states per-feature files must include frontmatter, overview, current-reality behavior description, implementation source tables, validation/test anchors, and metadata <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/feature_catalog_creation.md" lines="106-119" />
- Guidance requires one root entry to map to one per-feature file <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/feature_catalog_creation.md" lines="67-72" />

**Evidence 6: Prior iteration cross-reference**
- Iteration-001 focused on SKILL.md anchor coverage and smart-router conformance, did not examine feature_catalog <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skill-advisor-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-001.md" lines="1-77" />
- Iteration-002 focused on README.md marketing voice gap audit, did not examine feature_catalog structure <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skill-advisor-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-002.md" lines="1-119" />
- Iteration-003 focused on ARCHITECTURE.md vs source code drift, did not examine feature_catalog <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skill-advisor-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-003.md" lines="1-113" />
- Iteration-004 focused on INSTALL_GUIDE.md command verification, did not examine feature_catalog <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skill-advisor-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-004.md" lines="1-112" />
- Iteration-005 focused on references/advisor-scorer.md vs scorer source code, did not examine feature_catalog <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skill-advisor-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-005.md" lines="1-114" />
- Iteration-006 focused on references/db-path-policy.md and standalone-mcp-shape.md, did not examine feature_catalog <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skill-advisor-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-006.md" lines="1-96" />
- Iteration-007 focused on references cross-link integrity, did not examine feature_catalog <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skill-advisor-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-007.md" lines="1-113" />
- None of the prior iterations examined feature_catalog/01--daemon-and-freshness/ sk-doc alignment or per-feature file completeness

## Findings (numbered, severity-tagged P0|P1|P2, impact-ranked 1-10, sub-phase-targeted 002|003|004|005)

**Finding 1: Root catalog uses simplified table instead of template subsection format (P2, impact-rank 4, sub-phase-target: 004)**
- feature_catalog.md section 2 (DAEMON AND FRESHNESS) uses a two-column table (Feature | File) instead of the template's Description/Current Reality/Source Files subsections <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md" lines="70-78" />
- sk-doc feature_catalog_template.md scaffold shows each root entry should have ### Feature Name followed by #### Description, #### Current Reality, #### Source Files subsections <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md" lines="114-145" />
- Template checklist explicitly requires "Every root catalog entry has Description, Current Reality, and Source Files callout" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md" lines="244-246" />
- feature_catalog_creation.md guidance states root summaries should answer what the feature does, its current reality, and where to find source detail - the simplified table does not provide current reality summaries <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/feature_catalog_creation.md" lines="90-93" />
- However, the simplified table format may be intentional given that per-feature files already contain detailed current reality sections, and the guidance warns against overloading the root catalog <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/feature_catalog_creation.md" lines="95-100" />

**Finding 2: Per-feature files lack feature_test.md companion files (P2, impact-rank 3, sub-phase-target: 005)**
- Research question asks whether per-feature files are complete with "feature.md + feature_test.md" pattern <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skill-advisor-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-008.md" lines="1-113" />
- 01--daemon-and-freshness/ directory contains only 7 feature.md files (01-watcher.md through 07-cache-invalidation.md) with no feature_test.md companion files <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/01--daemon-and-freshness/" />
- sk-doc feature_catalog_template.md does not require feature_test.md files - the canonical package shape is root FEATURE_CATALOG.md plus per-feature files only <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md" lines="27-37" />
- sk-doc feature_catalog_creation.md states validation/test anchors belong in per-feature SOURCE FILES sections, not separate test files <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/feature_catalog_creation.md" lines="106-119" />
- All 7 per-feature files already include Validation And Tests subsections in their SOURCE FILES sections, citing automated tests and manual playbook scenarios <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/01--daemon-and-freshness/01-watcher.md" lines="39-45" />
- The "feature.md + feature_test.md" pattern mentioned in the research question appears to be a misunderstanding of the sk-doc template requirements <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md" lines="27-37" />

**Finding 3: Per-feature files fully comply with template structure (P2, impact-rank 2, sub-phase-target: 004)**
- All 7 per-feature files have frontmatter with title, description, and trigger_phrases (matching template requirement) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/01--daemon-and-freshness/01-watcher.md" lines="1-9" />
- All 7 per-feature files include the 4 required sections: OVERVIEW, CURRENT REALITY, SOURCE FILES, SOURCE METADATA <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/01--daemon-and-freshness/01-watcher.md" lines="16-52" />
- All 7 per-feature files have Implementation and Validation And Tests subsections in SOURCE FILES with file tables <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/01--daemon-and-freshness/01-watcher.md" lines="30-45" />
- All 7 per-feature files have SOURCE METADATA with Group, Canonical catalog source, and Feature file path <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/01--daemon-and-freshness/01-watcher.md" lines="48-52" />
- Template requires these exact elements in per-feature files <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md" lines="169-217" />
- Per-feature files exceed template requirements by including Related references cross-links at the end of SOURCE METADATA <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/01--daemon-and-freshness/01-watcher.md" lines="54-58" />

**Finding 4: Root catalog frontmatter and structure comply with template (P2, impact-rank 2, sub-phase-target: 004)**
- feature_catalog.md has frontmatter with title and description (template requirement) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md" lines="1-4" />
- Root catalog has H1 title and intro paragraph (template requirement) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md" lines="11-15" />
- Root catalog has unnumbered TABLE OF CONTENTS (template requirement) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md" lines="20-30" />
- Root catalog has numbered H2 sections after TOC (template requirement) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md" lines="36-48" />
- Template requires these exact structural elements <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md" lines="87-106" />
- Root catalog exceeds template requirements by including trigger_phrases in frontmatter and baseline metrics table in OVERVIEW <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md" lines="4-9, 50-61" />

**Finding 5: One-to-one mapping between root entries and per-feature files (P2, impact-rank 2, sub-phase-target: 004)**
- Root catalog section 2 lists exactly 7 features with links to 7 per-feature files <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md" lines="70-78" />
- 01--daemon-and-freshness/ directory contains exactly 7 per-feature files <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/01--daemon-and-freshness/" />
- feature_catalog_creation.md guidance requires one root entry to map to one per-feature file <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/feature_catalog_creation.md" lines="67-72" />
- Template checklist requires "Count of root entries matches count of per-feature files" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md" lines="252-253" />
- One-to-one mapping is exact (7 root entries = 7 per-feature files) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md" lines="70-78" />

**Finding 6: Category directory naming follows template convention (P2, impact-rank 2, sub-phase-target: 004)**
- Category directory uses `NN--category-name` format: `01--daemon-and-freshness` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/01--daemon-and-freshness/" />
- Per-feature files use `NN-feature-name.md` format: `01-watcher.md` through `07-cache-invalidation.md` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/01--daemon-and-freshness/" />
- Template requires category directories to use `NN--category-name` and per-feature files to use `NN-feature-name.md` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md" lines="27-37" />
- Numeric prefixes match the order in the root catalog section <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md" lines="70-78" />
- Naming convention follows template exactly <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md" lines="27-37" />

## Gaps for next iter

1. **Gap 1**: Determine whether the simplified table format in the root catalog (Feature | File) is intentional or should be expanded to the template's Description/Current Reality/Source Files subsection format.

2. **Gap 2**: Investigate whether the other feature catalog category directories (02--auto-indexing, 03--lifecycle-routing, etc.) follow the same structure as 01--daemon-and-freshness or if there are inconsistencies across categories.

3. **Gap 3**: Verify if the manual testing playbook references in per-feature Validation And Tests sections actually exist at the documented paths (e.g., `../../manual_testing_playbook/05--auto-update-daemon/001-watcher-narrow-scope.md`).

4. **Gap 4**: Check if the source file paths cited in per-feature SOURCE FILES sections are accurate and current, particularly the implementation file paths under `.opencode/skills/system-skill-advisor/mcp_server/lib/`.

## JSONL delta row

```json
{"type":"iteration","iteration":8,"timestamp_utc":"2026-05-16T10:15:00Z","executor":"cli-devin","model":"swe-1.6","status":"complete","focus":"feature_catalog/01--daemon-and-freshness sk-doc alignment","findings_count":6,"gaps_count":4,"newInfoRatio":0.60,"primary_evidence_files":["/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md","/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md","/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/feature_catalog_creation.md","/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/01--daemon-and-freshness/01-watcher.md"]}
```
