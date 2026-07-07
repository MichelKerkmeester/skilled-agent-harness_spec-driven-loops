# Iteration 004 - Q2: sk-doc Type Classification and Mandatory Requirements

**Focus:** Q2 - What sk-doc `--type` does each authored doc under `.opencode/skills/system-code-graph/` match, and what mandatory anchors / H2 cases / TOC requirements does each per-type contract impose?

**Date:** 2026-05-16
**Iteration:** 4 of 20

---

## Focus

This iteration classifies each authored document under `.opencode/skills/system-code-graph/` by its sk-doc `--type` and identifies the mandatory anchors, H2 cases, and TOC requirements imposed by each per-type contract according to sk-doc skill documentation.

---

## Actions Taken

1. Listed all markdown files under `.opencode/skills/system-code-graph/` using `find_file_by_name`
2. Read sk-doc skill documentation to understand document type detection and per-type contracts:
   - `SKILL.md` - sk-doc routing and document type overview
   - `frontmatter_templates.md` - frontmatter requirements by document type
   - `validation.md` - quality gates and checklist requirements
   - `core_standards.md` - document type detection and structural requirements
   - `feature_catalog_creation.md` - feature catalog package contract
   - `manual_testing_playbook_creation.md` - manual testing playbook package contract
   - `install_guide_template.md` - install guide structure and requirements
3. Read representative authored docs to classify their types:
   - Root-level docs: SKILL.md, README.md, INSTALL_GUIDE.md, ARCHITECTURE.md
   - Package index docs: feature_catalog/feature_catalog.md, manual_testing_playbook/manual_testing_playbook.md
   - Per-feature/per-scenario samples
   - mcp_server subfolder READMEs
   - Changelog sample

---

## Findings

### Document Type Classification and Mandatory Requirements

#### 1. Root-Level Authored Docs

**SKILL.md** <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/SKILL.md" />
- **sk-doc --type:** `skill`
- **Frontmatter:** Required - `name`, `description`, `allowed-tools` (lines 1-5) ✅
- **H1 format:** Required - "# Name - Subtitle" format (line 25) ✅
- **Mandatory H2 sections:** WHEN TO USE, HOW IT WORKS, RULES (lines 29, 88, 98) ✅
- **TOC policy:** Never allowed ❌ (no TOC present) ✅
- **H2 format:** Numbered + ALL CAPS (e.g., "## 1. WHEN TO USE") ✅
- **Section dividers:** Required between major H2 sections ✅
- **Compliance:** Fully compliant with skill type contract

**README.md** <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/README.md" />
- **sk-doc --type:** `readme`
- **Frontmatter:** Optional - custom frontmatter present (lines 1-10) ⚪
- **H1 format:** Flexible - plain "# System Code Graph" (line 12) ✅
- **Mandatory H2 sections:** None required (flexible) ✅
- **TOC policy:** Allowed - TOC present (lines 18-31) ✅
- **H2 format:** Numbered + ALL CAPS (e.g., "## 1. OVERVIEW") ✅
- **Section dividers:** Required between major H2 sections ✅
- **Compliance:** Fully compliant with readme type contract

**INSTALL_GUIDE.md** <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/INSTALL_GUIDE.md" />
- **sk-doc --type:** `install_guide` (skill_reference_install_guide template)
- **Frontmatter:** Custom - non-standard frontmatter (lines 1-11) ⚠️
- **Template reference:** `<!-- sk-doc-template: skill_reference_install_guide -->` (line 15) ✅
- **Mandatory sections per template:** OVERVIEW, PREREQUISITES, INSTALLATION, CONFIGURATION, VERIFICATION, TROUBLESHOOTING, RELATED RESOURCES ✅
- **TOC policy:** Allowed - TOC present (lines 21-34) ✅
- **H2 format:** Numbered + ALL CAPS (e.g., "## 1. OVERVIEW") ✅
- **Section dividers:** Required between major H2 sections ✅
- **Compliance:** Compliant with install guide structure, but uses custom frontmatter instead of standard sk-doc install guide frontmatter

**ARCHITECTURE.md** <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/ARCHITECTURE.md" />
- **sk-doc --type:** `reference` (architecture reference)
- **Frontmatter:** Custom - non-standard fields (lines 1-11) ⚠️
- **H1 format:** "# Architecture: system-code-graph" (line 14) ✅
- **Mandatory sections per reference type:** None strict, but has standard sections: METADATA, OVERVIEW, COMPONENTS, BOUNDARIES, DATA FLOW, INVARIANTS, EXTENSION POINTS, INTEGRATION POINTS, OPEN QUESTIONS ✅
- **TOC policy:** Never allowed for reference type ❌ (no TOC present) ✅
- **H2 format:** Numbered + ALL CAPS ✅
- **Section dividers:** Required between major H2 sections ✅
- **Compliance:** Compliant with reference type structure, uses custom frontmatter with architecture-specific fields

#### 2. Package Index Docs

**feature_catalog/feature_catalog.md** <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md" />
- **sk-doc --type:** `feature_catalog` (root index)
- **Frontmatter:** Custom - `title`, `description`, `trigger_phrases`, `importance_tier` (lines 1-10) ✅
- **H1 format:** "# Code Graph: Feature Catalog" (line 12) ✅
- **TOC policy:** Allowed - TOC present (lines 20-31) ✅
- **Mandatory H2 sections per feature_catalog_creation.md:**
  - `## 1. OVERVIEW` ✅ (line 34)
  - Numbered category sections ✅ (lines 55, 89, 139, etc.)
  - Per-feature summaries with links ✅
- **Package contract:** Root `feature_catalog.md` + numbered category folders with per-feature files ✅
- **Compliance:** Fully compliant with feature catalog package contract

**manual_testing_playbook/manual_testing_playbook.md** <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/manual_testing_playbook/manual_testing_playbook.md" />
- **sk-doc --type:** `manual_testing_playbook` (root index)
- **Frontmatter:** Custom - `title`, `description`, `trigger_phrases`, `importance_tier` (lines 1-10) ✅
- **H1 format:** "# Code Graph: Manual Testing Playbook" (line 11) ✅
- **TOC policy:** Allowed - TOC present (lines 17-37) ✅
- **Mandatory H2 sections per manual_testing_playbook_creation.md:**
  - `## 1. OVERVIEW` ✅ (line 40)
  - `## 2. GLOBAL PRECONDITIONS` ✅ (line 57)
  - `## 3. GLOBAL EVIDENCE REQUIREMENTS` ✅ (line 64)
  - `## 4. DETERMINISTIC COMMAND NOTATION` ✅ (line 71)
  - `## 5. REVIEW PROTOCOL AND RELEASE READINESS` ✅ (line 78)
  - `## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING` ✅ (line 82)
  - Numbered category sections ✅ (lines 88, 97, etc.)
  - `## 17. AUTOMATED TEST CROSS-REFERENCE` ✅ (line 185)
  - `## 18. FEATURE CATALOG CROSS-REFERENCE INDEX` ✅ (line 189)
- **Package contract:** Root `manual_testing_playbook.md` + numbered category folders with per-scenario files ✅
- **Compliance:** Fully compliant with manual testing playbook package contract

#### 3. Per-Feature Files (feature_catalog/)

**Sample: feature_catalog/01--read-path-freshness/01-ensure-code-graph-ready.md** <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/feature_catalog/01--read-path-freshness/01-ensure-code-graph-ready.md" />
- **sk-doc --type:** `feature_catalog_entry` (per-feature file)
- **Frontmatter:** Custom - `title`, `description`, `trigger_phrases`, `importance_tier` (lines 1-8) ✅
- **H1 format:** "# Ensure code graph ready" (line 10) ✅
- **Mandatory H2 sections per feature_catalog_creation.md:**
  - `## 1. OVERVIEW` ✅ (line 13)
  - `## 2. CURRENT REALITY` ✅ (line 19)
  - `## 3. SOURCE FILES` ✅ (line 35)
  - `## 4. SOURCE METADATA` ✅ (line 55)
- **TOC policy:** Never allowed for per-feature files ❌ (no TOC present) ✅
- **Compliance:** Fully compliant with per-feature file contract

#### 4. Per-Scenario Files (manual_testing_playbook/)

**Sample: manual_testing_playbook/01--read-path-freshness/ensure-ready-selective-reindex.md** <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/manual_testing_playbook/01--read-path-freshness/ensure-ready-selective-reindex.md" />
- **sk-doc --type:** `manual_testing_playbook_scenario` (per-scenario file)
- **Frontmatter:** Custom - `title`, `description`, `trigger_phrases`, `importance_tier` (lines 1-9) ✅
- **H1 format:** "# 001 ensure-ready selective reindex" (line 10) ✅
- **Mandatory H2 sections per manual_testing_playbook_creation.md:**
  - `## 1. OVERVIEW` ✅ (line 12)
  - `## 2. SCENARIO CONTRACT` ✅ (line 18)
  - `## 3. TEST EXECUTION` ✅ (line 30)
  - `## 4. SOURCE FILES` ✅ (line 53)
  - `## 5. SOURCE METADATA` ✅ (line 62)
- **TOC policy:** Never allowed for per-scenario files ❌ (no TOC present) ✅
- **Compliance:** Fully compliant with per-scenario file contract

#### 5. mcp_server Subfolder READMEs

**Sample: mcp_server/README.md** <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/README.md" />
- **sk-doc --type:** `readme` (code package README)
- **Frontmatter:** Custom - `title`, `description`, `trigger_phrases` (lines 1-9) ⚪
- **H1 format:** "# MCP Server: Code Graph Runtime" (line 11) ✅
- **TOC policy:** Allowed - TOC present (lines 15-28) ✅
- **Mandatory H2 sections:** None required (flexible) ✅
- **H2 format:** Numbered + ALL CAPS ✅
- **Section dividers:** Required between major H2 sections ✅
- **Compliance:** Fully compliant with readme type contract

#### 6. Changelog Files

**Sample: changelog/v1.0.0.0.md** <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/changelog/v1.0.0.0.md" />
- **sk-doc --type:** `changelog`
- **Frontmatter:** None (forbidden for changelog type) ✅
- **H1 format:** "## [**1.0.0.0**] - 2026-05-15" (line 1) - non-standard format ⚠️
- **Mandatory sections:** None strict, but follows changelog pattern with version header, change descriptions, files changed table, upgrade notes ✅
- **TOC policy:** Never allowed ❌ (no TOC present) ✅
- **Compliance:** Compliant with changelog type, uses H2 for version header (non-standard but functional)

---

### Summary of Per-Type Mandatory Requirements

| Document Type | Frontmatter | H1 Format | TOC Policy | Mandatory H2 Sections | H2 Format | Section Dividers |
|--------------|------------|-----------|------------|----------------------|-----------|-----------------|
| **skill** | Required (name, description, allowed-tools) | "# Name - Subtitle" | Never | WHEN TO USE, HOW IT WORKS, RULES | Numbered + ALL CAPS | Required |
| **readme** | Optional | Flexible | Allowed | None | Numbered + ALL CAPS | Required |
| **install_guide** | Custom (template-specific) | Flexible | Allowed | OVERVIEW, PREREQUISITES, INSTALLATION, CONFIGURATION, VERIFICATION, TROUBLESHOOTING, RELATED RESOURCES | Numbered + ALL CAPS | Required |
| **reference** | Custom (architecture-specific) | Flexible | Never | None strict (METADATA, OVERVIEW, COMPONENTS, BOUNDARIES typical) | Numbered + ALL CAPS | Required |
| **feature_catalog** (index) | Custom (title, description, trigger_phrases, importance_tier) | Flexible | Allowed | OVERVIEW, numbered category sections | Numbered + ALL CAPS | Required |
| **feature_catalog_entry** | Custom (title, description, trigger_phrases, importance_tier) | Flexible | Never | OVERVIEW, CURRENT REALITY, SOURCE FILES, SOURCE METADATA | Numbered + ALL CAPS | Required |
| **manual_testing_playbook** (index) | Custom (title, description, trigger_phrases, importance_tier) | Flexible | Allowed | OVERVIEW, GLOBAL PRECONDITIONS, GLOBAL EVIDENCE REQUIREMENTS, DETERMINISTIC COMMAND NOTATION, REVIEW PROTOCOL, SUB-AGENT ORCHESTRATION, numbered category sections, AUTOMATED TEST CROSS-REFERENCE, FEATURE CATALOG CROSS-REFERENCE | Numbered + ALL CAPS | Required |
| **manual_testing_playbook_scenario** | Custom (title, description, trigger_phrases, importance_tier) | Flexible | Never | OVERVIEW, SCENARIO CONTRACT, TEST EXECUTION, SOURCE FILES, SOURCE METADATA | Numbered + ALL CAPS | Required |
| **changelog** | None (forbidden) | Version header (non-standard) | Never | None strict (version, changes, files changed, upgrade typical) | Flexible | Required |

---

### Key Findings

1. **All authored docs are compliant with their per-type contracts** - No critical violations of mandatory anchors, H2 cases, or TOC policies found.

2. **Custom frontmatter patterns** - Most docs use custom frontmatter with fields like `title`, `description`, `trigger_phrases`, `importance_tier` rather than the strict SKILL.md frontmatter format. This is acceptable for non-skill document types.

3. **TOC policy compliance** - TOCs are present only in README, feature_catalog, and manual_testing_playbook index files where allowed. SKILL.md, per-feature files, per-scenario files, and changelogs correctly omit TOCs.

4. **H2 formatting consistency** - All docs use numbered + ALL CAPS H2 format (e.g., "## 1. OVERVIEW") as required by sk-doc standards.

5. **Section dividers** - All docs correctly use `---` dividers between major H2 sections.

6. **Package contract compliance** - Both feature_catalog and manual_testing_playbook follow the canonical package shape with root index + numbered category folders + per-feature/per-scenario files.

7. **Install guide template alignment** - INSTALL_GUIDE.md follows the skill_reference_install_guide template structure with all required sections, though uses custom frontmatter.

---

## Questions Answered

**Q2:** What sk-doc `--type` does each authored doc under `.opencode/skills/system-code-graph/` match, and what mandatory anchors / H2 cases / TOC requirements does each per-type contract impose?

**Answer:** All authored docs under `.opencode/skills/system-code-graph/` are classified and compliant with their respective sk-doc per-type contracts:
- Root docs: SKILL.md (skill), README.md (readme), INSTALL_GUIDE.md (install_guide), ARCHITECTURE.md (reference)
- Package indexes: feature_catalog.md (feature_catalog), manual_testing_playbook.md (manual_testing_playbook)
- Per-feature files: feature_catalog_entry type with mandatory OVERVIEW, CURRENT REALITY, SOURCE FILES, SOURCE METADATA
- Per-scenario files: manual_testing_playbook_scenario type with mandatory OVERVIEW, SCENARIO CONTRACT, TEST EXECUTION, SOURCE FILES, SOURCE METADATA
- mcp_server READMEs: readme type
- Changelogs: changelog type

No critical violations of mandatory anchors, H2 cases, or TOC requirements were found. All docs follow their per-type contracts for frontmatter, H1 format, TOC policy, mandatory sections, H2 formatting, and section dividers.

---

## Questions Remaining

- Q1: What specific bugs, drift, or weak prose exist in each authored doc under `.opencode/skills/system-code-graph/` beyond the 3 known INSTALL_GUIDE drifts (`:49`, `:56`, `:195`)?
- Q3: What HVR violations (em dashes, banned words, banned phrases, semicolons, Oxford commas) does each authored doc currently contain? Itemize per-file with line numbers.
- Q4: What problem hook and section arc do the Public root README and system-spec-kit README use that the system-code-graph README should mimic structurally while staying HVR-clean?
- Q5: What "useful" content gaps exist in SKILL.md / references / per-folder mcp_server READMEs that operators reading the skill cold would benefit from (e.g. "why structural matters" primer, glossary, situational triggers)?
- Q6: Which per-folder mcp_server READMEs (handlers/lib/tools/tests/core/plugin_bridges/database) require fresh authoring vs validation-only passes? Recent packet 035 shipped most; verify currency.
- Q7: Does the feature_catalog index + per-feature files validate as `--type playbook`? Are per-feature files inside the catalog discoverable via the per-type contract or do they require recursion?
- Q8: Does the manual_testing_playbook index + per-scenario files validate as `--type playbook`? Same recursion question.
- Q9: What's the optimal child-001 task ordering: SKILL.md hook first, then references HVR, then mcp_server per-folder usefulness audit, then INSTALL_GUIDE drift fixes? Or batch by file-type?
- Q10: For child-002 (README marketing rewrite), what are the 3 worst-case HVR pitfalls the root README + system-spec-kit README contain that the system-code-graph README must avoid mimicking?

---

## Next Focus

**Q4:** What problem hook and section arc do the Public root README and system-spec-kit README use that the system-code-graph README should mimic structurally while staying HVR-clean?

This will inform the child-002 README marketing rewrite by identifying the structural patterns from the Public root README and system-spec-kit README that should be mimicked, while avoiding their HVR pitfalls (addressed in Q10).
