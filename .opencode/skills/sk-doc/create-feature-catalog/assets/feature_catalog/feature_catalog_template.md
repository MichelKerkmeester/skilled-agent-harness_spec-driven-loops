---
title: Feature Catalog Creation - Templates and Standards
description: Templates for creating feature-catalog-style inventories with a root catalog, numbered category sections, current frontmatter conventions, and per-feature reference files.
trigger_phrases:
  - "feature catalog template"
  - "root catalog scaffold"
  - "capability inventory template"
  - "numbered category sections"
importance_tier: normal
contextType: general
version: 1.8.0.10
---

# Feature Catalog Creation - Templates and Standards

Templates for creating feature catalogs that combine top-level capability inventory with per-feature reference files.

> **Need the scaffold?** Jump to [§4 Root Catalog Scaffold](#4-root-catalog-scaffold) or [§5 Per-Feature File Scaffold](#5-per-feature-file-scaffold).

---

## 1. OVERVIEW

**Purpose**: Feature catalogs provide a canonical inventory of what a system does today. They organize live capabilities into numbered sections, summarize current behavior in the root document, and point to per-feature reference files for implementation details, tests, and metadata.

**Key Characteristics**:
- **Inventory-first**: The root catalog acts as the system-level directory and summary surface.
- **Feature-catalog shaped**: The root file uses frontmatter, an H1 intro paragraph, and numbered all-caps H2 section headers.
- **Per-feature files**: Each catalog entry maps to exactly one per-feature file in a numbered category directory.
- **Current-reality focused**: The root and per-feature files describe shipped behavior, not speculative roadmaps unless clearly marked.
- **Reference-rich**: Per-feature files carry source-file tables, implementation anchors, and metadata.
- **Stable naming**: Category directory names and feature file slugs should remain stable after publication.
- **Packet-history free**: Catalogs cite current source files and validation anchors, not spec or phase packet numbers.

**Location Convention**: `{SKILL_PATH}/feature_catalog/`

Canonical layout:

```text
feature_catalog/
├── feature_catalog.md                 # Root inventory and summary catalog
├── 01--category-name/                 # Required per-feature files for category 1
│   ├── feature-name.md
│   └── another-feature-name.md
└── 02--another-category/              # Required per-feature files for category 2
    └── feature-name.md
```

**Existing Example**:
- `.opencode/skills/system-spec-kit/feature_catalog/`

---

## 2. WHEN TO CREATE FEATURE CATALOGS

| Create a catalog when | Keep simpler when |
|---|---|
| Surface area is too large for a flat README to be trustworthy | System has only a handful of features |
| You need a stable, reviewable list of current capabilities | An existing README or install guide already gives an accurate full inventory |
| Operators, reviewers, or agents need one place to map features to implementation and test anchors | The system is too early or volatile for a maintained catalog to be worth the overhead |
| Manual playbooks, install guides, or specs need a canonical feature reference to link back to | |

---

## 3. CATEGORY AND FILE DESIGN

Each category groups related features under a numbered directory.

| Category Purpose | Example Directory | Example File |
|---|---|---|
| Retrieval | `01--retrieval` | `unified-context-retrieval-memorycontext.md` |
| Mutation | `02--mutation` | `memory-indexing-memorysave.md` |
| Tooling and scripts | `17--tooling-and-scripts` | `admin-cli-bootstrap.md` |

Directory and file rules:
- Category directories use `NN--category-name`.
- Per-feature files use `feature-name.md` (no numeric prefix).
- Per-feature snippet order is defined by the root catalog listing order; filenames no longer encode order. Category folders keep `NN--` numbering for section order.
- Published slugs should remain stable unless the feature is intentionally renamed.

Per-feature file shape:
1. `## 1. OVERVIEW`
2. `## 2. HOW IT WORKS`
3. `## 3. SOURCE FILES`
4. `## 4. SOURCE METADATA`

---

## 4. ROOT CATALOG SCAFFOLD

Copy this scaffold to create `{SKILL_PATH}/feature_catalog/feature_catalog.md`:

```markdown
---
title: "{SYSTEM_NAME}: Feature Catalog"
description: "Unified reference combining the complete feature inventory and current-reality reference for the {SYSTEM_NAME} system."
trigger_phrases:
  - "{system name}"
  - "{primary capability phrase}"
  - "feature catalog"
last_updated: "{YYYY-MM-DD}"
version: 1.0.0.0
---

# {SYSTEM_NAME}: Feature Catalog

This document combines the current feature inventory for the `{SYSTEM_SLUG}` system into a single reference. The root catalog acts as the system-level directory: it summarizes each capability area, describes what the system does today, and points to the per-feature files that carry the deeper implementation and validation anchors.

---

## 1. OVERVIEW

Use this catalog as the canonical inventory for the live `{SYSTEM_SLUG}` feature surface. The numbered sections below group the system by capability area so readers can move from a top-level summary into per-feature reference files without losing implementation or validation context.

---

## 2. {CAT1_HEADING}

### {FEATURE_NAME_1}

#### Description

{FEATURE_DESCRIPTION_1}

#### Current Reality

{CURRENT_REALITY_SUMMARY_1}

#### Source Files

See [`{CAT1_DIR}/{FEATURE_FILE_1}`]({CAT1_DIR}/{FEATURE_FILE_1}) for full implementation and test file listings.

---

### {FEATURE_NAME_2}

#### Description

{FEATURE_DESCRIPTION_2}

#### Current Reality

{CURRENT_REALITY_SUMMARY_2}

#### Source Files

See [`{CAT1_DIR}/{FEATURE_FILE_2}`]({CAT1_DIR}/{FEATURE_FILE_2}) for full implementation and test file listings.

---

## 3. {CAT2_HEADING}

### {FEATURE_NAME_3}

#### Description

{FEATURE_DESCRIPTION_3}

#### Current Reality

{CURRENT_REALITY_SUMMARY_3}

#### Source Files

See [`{CAT2_DIR}/{FEATURE_FILE_3}`]({CAT2_DIR}/{FEATURE_FILE_3}) for full implementation and test file listings.
```

---

## 5. PER-FEATURE FILE SCAFFOLD

Copy this scaffold to create `feature_catalog/{CATEGORY_DIR}/{feature-name}.md`:

```markdown
---
title: "{FEATURE_NAME}"
description: "{OVERVIEW_ONE_LINE}"
trigger_phrases:
  - "{primary trigger phrase}"
  - "{alternate phrasing}"
  - "{tool or command name}"
  - "{user-visible label if different}"
# importance_tier: "important"   # uncomment only for Tier 1 critical features
version: 1.0.0.0
---

# {FEATURE_NAME} ({tool_name_or_command})

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

{OVERVIEW_ONE_LINE}

{OVERVIEW_DETAIL}

---

## 2. HOW IT WORKS

<!-- Short section (≤3 paragraphs): write plain prose and delete the sub-headings below.
     Long section (>3 paragraphs): keep or rename sub-headings and delete this comment. -->

### {PRIMARY_BEHAVIOR_ASPECT}

{Description of the core behavior from the caller's perspective.}

### {SECONDARY_BEHAVIOR_ASPECT}

{Description of a distinct aspect — quality gates, routing logic, async behavior, etc.}

<!-- Add further H3 sub-headings as needed. Common ones:
     Configuration | Quality Gates | Edge Cases | Async & Safety | Post-Action Behavior -->

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `{IMPLEMENTATION_FILE_1}` | {Handler\|Shared\|Script} | {ROLE_1} |
| `{IMPLEMENTATION_FILE_2}` | {Handler\|Shared\|Script} | {ROLE_2} |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `{TEST_FILE_1}` | {Automated test\|Manual playbook} | {TEST_ROLE_1} |
| `{TEST_FILE_2}` | {Automated test\|Manual playbook} | {TEST_ROLE_2} |

---

## 4. SOURCE METADATA

- Group: {CATEGORY_NAME}
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `{CATEGORY_DIR}/{feature-name}.md`

Related references:
- [{neighboring-feature}.md]({neighboring-feature}.md) — {brief description}
- [{neighboring-feature}.md]({neighboring-feature}.md) — {brief description}
```

---

## 6. AUTHORING NOTES

- Add frontmatter to both the root catalog and per-feature files.
- Add `trigger_phrases` to every per-feature file frontmatter. Phrases must match the H3 feature heading in the root catalog, plus natural-language alternates and the tool or command name.
- Add `importance_tier: "important"` only for Tier 1 critical features that must always surface in search routing. Omit for standard catalog entries.
- In per-feature files, if `HOW IT WORKS` exceeds 3 paragraphs, break it into H3 sub-headings — e.g. `### Core Behavior`, `### Quality Gates`, `### Configuration`, `### Edge Cases`. Long unbroken prose sections should always have navigation anchors.
- Keep the root catalog readable by summarizing behavior instead of dumping raw source-file tables there.
- Put implementation and test anchor detail in the per-feature files.
- Preserve stable file paths once other docs start linking to them.
- Use numbered all-caps H2 section headers in the root catalog. Do not add a Table of Contents.
- Do not write packet-history references such as "added in packet 033" or "Phase 017 update". Rewrite them as current behavior plus a source file, test, or reference-doc link.

---

## 7. CHECKLIST

Before publishing a feature catalog, verify:

```markdown
Structure:
- [ ] `feature_catalog.md` exists with frontmatter and H1 intro paragraph
- [ ] Root catalog uses numbered all-caps H2 section headers (no Table of Contents)
- [ ] Category directories use `NN--category-name`
- [ ] Per-feature snippet order matches root catalog listing order (filenames do not encode order)
- [ ] Every root catalog entry links to exactly one per-feature file
- [ ] Every per-feature file includes frontmatter with `title` and `description`

Content:
- [ ] Every root catalog entry has Description, Current Reality, and Source Files callout
- [ ] Every per-feature file has `OVERVIEW`, `HOW IT WORKS`, `SOURCE FILES`, and `SOURCE METADATA`
- [ ] Source-file tables are specific and meaningful
- [ ] Current reality text describes shipped behavior honestly

Validation:
- [ ] Root catalog links resolve locally
- [ ] Count of root entries matches count of per-feature files
- [ ] Other docs link to the root catalog rather than duplicating the inventory
```

---

## 8. RELATED RESOURCES

- [feature_catalog_snippet_template.md](./feature_catalog_snippet_template.md) - Per-feature file template
- [manual_testing_playbook_template.md](../testing_playbook/manual_testing_playbook_template.md) - Parallel pattern for manual validation packages
- [frontmatter_templates.md](../frontmatter_templates.md) - Frontmatter conventions
