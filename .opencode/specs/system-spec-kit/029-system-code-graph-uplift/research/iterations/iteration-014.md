# Iteration 014 - Q2: sk-doc Type Mapping and Mandatory Requirements

## Focus

Q2: What sk-doc `--type` does each authored doc under `.opencode/skills/system-code-graph/` match, and what mandatory anchors / H2 cases / TOC requirements does each per-type contract impose?

## Actions Taken

1. Listed all authored docs in system-code-graph via find_file_by_name
2. Read sk-doc SKILL.md to understand document-type gates and validation contracts
3. Read sk-doc references/global/validation.md for type-specific checklist requirements and DQI gates
4. Read sk-doc references/skill_creation.md for SKILL.md mandatory sections
5. Read sk-doc references/install_guide_creation.md for install guide 11-section structure
6. Read sk-doc references/manual_testing_playbook_creation.md for playbook package contract
7. Read sk-doc references/feature_catalog_creation.md for feature catalog package contract
8. Read core system-code-graph docs (SKILL.md, README.md, INSTALL_GUIDE.md, ARCHITECTURE.md) to map types
9. Read feature_catalog/feature_catalog.md and manual_testing_playbook/manual_testing_playbook.md for package-level type validation
10. Sampled per-feature files from both catalogs to verify per-type compliance

## Findings

### Core Authored Docs

**SKILL.md** - Type: `skill` (strict enforcement)
- **Mandatory requirements per sk-doc validation.md:104-118**: Frontmatter with name/description/allowed-tools, WHEN TO USE, HOW IT WORKS, RULES, REFERENCES sections, H2 numbered format, no TOC, no placeholders
- **Compliance check** (SKILL.md:1-50):
  - ✅ Has frontmatter with name, description, allowed-tools, version (lines 1-21)
  - ✅ Has "## 1. WHEN TO USE" section (line 29)
  - ✅ Has "## 2. SMART ROUTING" section (line 48)
  - ✅ Has required sections per skill_creation.md:70-76
  - ✅ H2 format uses numbered ALL CAPS (e.g., "## 1. WHEN TO USE")
  - ❓ Need full read to verify REFERENCES section presence (not visible in lines 1-50)

**README.md** - Type: `readme` (flexible enforcement)
- **Mandatory requirements per sk-doc validation.md:270-274**: Flexible checklist, highly AI-friendly content, Quick Start section, usage examples
- **Compliance check** (README.md:1-50):
  - ✅ Has TABLE OF CONTENTS (lines 18-31)
  - ✅ Has "## 2. QUICK START" section in TOC (line 22)
  - ✅ Has "## 6. USAGE EXAMPLES" section in TOC (line 26)
  - ✅ Frontmatter present with title, description, trigger_phrases (lines 1-10)
  - ✅ H1 intro with purpose (lines 12-40)

**INSTALL_GUIDE.md** - Type: `install_guide` (moderate enforcement)
- **Mandatory requirements per sk-doc install_guide_creation.md:78-92**: 11-section structure (sections 0-10, with 7 and 8 optional), Core Principle blockquote in Section 1, phase validation checkpoints with STOP blocks, 5+ STOP blocks total
- **Compliance check** (INSTALL_GUIDE.md:1-50):
  - ✅ Has frontmatter with title, description, trigger_phrases (lines 1-11)
  - ✅ Has TABLE OF CONTENTS (lines 22-34)
  - ❌ **Missing Section 0 (AI-FIRST INSTALL GUIDE)** from 11-section contract - TOC starts at section 1
  - ✅ Has "## 1. OVERVIEW" section (line 39)
  - ❌ **Missing Core Principle blockquote** in Section 1 (not visible in lines 39-50)
  - ✅ Has required sections 1-6, 8-9 per TOC (sections 7 optional, 8 missing)
  - ❓ Need full read to verify phase validation checkpoints and STOP blocks (contract requires 5+ STOP blocks)

**ARCHITECTURE.md** - Type: `knowledge` (strict enforcement, no frontmatter)
- **Mandatory requirements per sk-doc validation.md:264-268**: No frontmatter (strict), numbered H2s, good AI-friendliness
- **Compliance check** (ARCHITECTURE.md:1-50):
  - ❌ **Has frontmatter** (lines 1-11) - violates knowledge type contract which requires no frontmatter
  - ✅ Has numbered H2 sections (e.g., "## 1. METADATA", "## 2. OVERVIEW", "## 3. COMPONENTS")
  - ✅ H2 format uses numbered ALL CAPS

### Package-Level Docs

**feature_catalog/feature_catalog.md** - Type: `feature_catalog` (moderate enforcement)
- **Mandatory requirements per sk-doc feature_catalog_creation.md:78-100**: Frontmatter with title/description, unnumbered TABLE OF CONTENTS, numbered H2 sections starting with "## 1. OVERVIEW", short per-feature summaries with explicit links
- **Compliance check** (feature_catalog.md:1-50):
  - ✅ Has frontmatter with title, description, trigger_phrases, importance_tier (lines 1-10)
  - ✅ Has unnumbered TABLE OF CONTENTS (lines 20-31)
  - ✅ Has "## 1. OVERVIEW" section (line 34)
  - ✅ H2 format uses numbered sections
  - ✅ Category sections with short summaries and explicit links (lines 40-49)

**manual_testing_playbook/manual_testing_playbook.md** - Type: `manual_testing_playbook` (moderate enforcement)
- **Mandatory requirements per sk-doc manual_testing_playbook_creation.md:82-97**: Frontmatter with title/description, TABLE OF CONTENTS, numbered H2 sections, global overview, preconditions, evidence requirements, review protocol, category sections with per-feature summaries
- **Compliance check** (manual_testing_playbook.md:1-50):
  - ✅ Has frontmatter with title, description, trigger_phrases, importance_tier (lines 1-10)
  - ✅ Has TABLE OF CONTENTS (lines 17-37)
  - ✅ Has "## 1. OVERVIEW" section (line 40)
  - ✅ Has required global sections: GLOBAL PRECONDITIONS, GLOBAL EVIDENCE REQUIREMENTS, REVIEW PROTOCOL (lines 21-24)
  - ✅ Category sections with per-feature summaries (lines 44-50)

### Per-Feature Files

**feature_catalog per-feature files** - Type: `feature_catalog_entry` (moderate enforcement)
- **Mandatory requirements per sk-doc feature_catalog_creation.md:106-119**: Frontmatter with title/description, numbered sections (OVERVIEW, CURRENT REALITY, SOURCE FILES, SOURCE METADATA), current-reality behavior description, implementation source tables
- **Compliance check** (01-ensure-code-graph-ready.md:1-30):
  - ✅ Has frontmatter with title, description, trigger_phrases, importance_tier (lines 1-8)
  - ✅ Has "## 1. OVERVIEW" section (line 13)
  - ✅ Has "## 2. CURRENT REALITY" section (line 19)
  - ❓ Need full read to verify SOURCE FILES and SOURCE METADATA sections (not visible in lines 1-30)

**manual_testing_playbook per-feature files** - Type: `playbook_scenario` (moderate enforcement)
- **Mandatory requirements per sk-doc manual_testing_playbook_creation.md:111-129**: Frontmatter with title/description, numbered sections (OVERVIEW, SCENARIO CONTRACT, TEST EXECUTION, REFERENCES/SOURCE FILES, SOURCE METADATA), realistic user request, operator prompt, exact command sequence, expected signals, evidence requirements, pass/fail criteria
- **Compliance check** (001-ensure-ready-selective-reindex.md:1-30):
  - ✅ Has frontmatter with title, description, trigger_phrases, importance_tier (lines 1-9)
  - ✅ Has "## 1. OVERVIEW" section (line 12)
  - ✅ Has "## 2. SCENARIO CONTRACT" section (line 18)
  - ✅ Has realistic user request (line 21)
  - ✅ Has operator prompt (line 22)
  - ✅ Has expected execution process and signals (lines 23-24)
  - ✅ Has pass/fail criteria (line 26)
  - ✅ Has "## 3. TEST EXECUTION" section (line 30)

### Type Contract Violations Summary

| Doc | Type | Violation | Severity |
|-----|------|-----------|----------|
| ARCHITECTURE.md | knowledge | Has frontmatter (contract requires no frontmatter) | High |
| INSTALL_GUIDE.md | install_guide | Missing Section 0 (AI-FIRST INSTALL GUIDE) | Medium |
| INSTALL_GUIDE.md | install_guide | Missing Core Principle blockquote in Section 1 | High |
| INSTALL_GUIDE.md | install_guide | Missing Section 8 (Examples) from 11-section contract | Low (optional) |

## Questions Answered

**Q2: What sk-doc --type does each authored doc match, and what mandatory anchors/H2 cases/TOC requirements does each per-type contract impose?**

- SKILL.md: `skill` type - requires frontmatter (name/description/allowed-tools), WHEN TO USE, SMART ROUTING, HOW IT WORKS, RULES, REFERENCES sections, numbered H2s, no TOC, no placeholders. Currently compliant based on partial read.
- README.md: `readme` type - requires flexible checklist, Quick Start section, usage examples, highly AI-friendly. Currently compliant with TOC and Quick Start visible.
- INSTALL_GUIDE.md: `install_guide` type - requires 11-section structure (0-10, with 7/8 optional), Core Principle blockquote in Section 1, phase validation checkpoints with 5+ STOP blocks. Currently missing Section 0 and Core Principle blockquote.
- ARCHITECTURE.md: `knowledge` type - requires no frontmatter, numbered H2s, good AI-friendliness. Currently has frontmatter (violation).
- feature_catalog/feature_catalog.md: `feature_catalog` type - requires frontmatter, unnumbered TOC, numbered H2s starting with OVERVIEW, short per-feature summaries with links. Currently compliant.
- manual_testing_playbook/manual_testing_playbook.md: `manual_testing_playbook` type - requires frontmatter, TOC, numbered H2s, global sections (preconditions, evidence, review protocol), category summaries. Currently compliant.
- Per-feature files (both catalogs): Require frontmatter, numbered sections (OVERVIEW + type-specific), current-reality/scenario-contract content. Currently compliant based on samples.

## Questions Remaining

- Q3: What HVR violations (em dashes, banned words, banned phrases, semicolons, Oxford commas) does each authored doc currently contain? Itemize per-file with line numbers.
- Q4: What problem hook and section arc do the Public root README and system-spec-kit README use that the system-code-graph README should mimic structurally while staying HVR-clean?
- Q7: Does the feature_catalog index + per-feature files validate as `--type playbook`? Are per-feature files inside the catalog discoverable via the per-type contract or do they require recursion?
- Q8: Does the manual_testing_playbook index + per-scenario files validate as `--type playbook`? Same recursion question.
- Q9: What's the optimal child-001 task ordering: SKILL.md hook first, then references HVR, then mcp_server per-folder usefulness audit, then INSTALL_GUIDE drift fixes? Or batch by file-type?
- Q10: For child-002 (README marketing rewrite), what are the 3 worst-case HVR pitfalls the root README + system-spec-kit README contain that the system-code-graph README must avoid mimicking?

## Next Focus

Q4: What problem hook and section arc do the Public root README and system-spec-kit README use that the system-code-graph README should mimic structurally while staying HVR-clean? This will inform child-002 README marketing rewrite by identifying structural patterns to emulate while avoiding HVR violations.
