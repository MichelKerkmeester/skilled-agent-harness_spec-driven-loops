---
name: create-feature-catalog
description: Author sk-doc feature-catalog inventory packages with a root catalog, numbered category folders, per-feature files, and auditable source anchors.
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 1.0.0.0
---

# Create Feature Catalog

`create-feature-catalog` is the feature-inventory workflow packet of the `sk-doc` parent hub. It authors canonical current-state catalogs rooted at `feature_catalog/feature_catalog.md`, with numbered category folders and one per-feature reference file per root catalog entry.

This packet owns `/create:feature-catalog`, `references/feature_catalog_creation.md`, and `assets/feature_catalog/`. It consumes shared sk-doc validation and writing standards from `../shared/`.

---

## 1. WHEN TO USE

### Activation Triggers

Use this workflow when the request involves:
- Creating a canonical feature inventory for a skill, system, MCP surface, CLI surface, or documentation family.
- Splitting a large feature surface into a root catalog plus per-feature files.
- Documenting shipped behavior with source-file anchors, validation anchors, and stable feature slugs.
- Creating or updating `feature_catalog/feature_catalog.md`.
- Creating numbered category folders such as `01--retrieval/` or `02--mutation/`.
- Creating per-feature files such as `unified-context-retrieval.md` under category folders.
- Linking manual testing playbooks, README summaries, or operator docs back to a stable feature reference.

Keyword triggers: `feature catalog`, `feature inventory`, `catalog package`, `per-feature files`, `source anchors`, `root catalog`, `capability inventory`, `/create:feature-catalog`.

### When NOT to Use

Skip this workflow when:
- The system has only a small feature list that fits accurately in a README.
- The user needs manual validation scenarios. Use `create-manual-testing-playbook`.
- The user needs a README, install guide, changelog, benchmark report, command, agent, or skill scaffold.
- The requested catalog would describe planned behavior rather than current shipped behavior.
- The task is only document quality review of an existing catalog. Use `doc-quality`.

### Family Boundary

This is a nested workflow packet under `sk-doc`. It carries its own `SKILL.md`, `README.md`, `references/`, `assets/`, and `changelog/`, but it must not define a packet-local `graph-metadata.json`; advisor identity lives at the `sk-doc` hub root.

---

## 2. SMART ROUTING

### Primary Detection Signal

Route here when the target artifact is a feature catalog package:

```text
FEATURE CATALOG TASK
    |
    +- Creation guide       -> references/feature_catalog_creation.md
    +- Root scaffold        -> assets/feature_catalog/feature_catalog_template.md
    +- Per-feature scaffold -> assets/feature_catalog/feature_catalog_snippet_template.md
    +- Shared standards     -> ../shared/references/global/
    +- Shared validators    -> ../shared/scripts/
```

### Resource Loading Levels

| Level | When to Load | Resources |
| --- | --- | --- |
| ALWAYS | Any feature-catalog task | `references/feature_catalog_creation.md` |
| ALWAYS | Creating or rewriting the root catalog | `assets/feature_catalog/feature_catalog_template.md` |
| ALWAYS | Creating per-feature files | `assets/feature_catalog/feature_catalog_snippet_template.md` |
| ALWAYS | Before delivery | `../shared/references/global/quick_reference.md`, `../shared/references/global/validation.md` |
| CONDITIONAL | Runtime docs or skill docs | `../shared/references/global/evergreen_packet_id_rule.md`, `../shared/references/global/core_standards.md` |
| CONDITIONAL | Frontmatter/version checks | `../shared/references/global/frontmatter_versioning.md`, `../shared/scripts/check-frontmatter-versions.sh` |

### Package Contract

```text
feature_catalog/
├── feature_catalog.md
├── 01--category-name/
│   ├── feature-name.md
│   └── another-feature-name.md
└── 02--another-category/
    └── feature-name.md
```

Category directories use `NN--category-name`. Per-feature files use stable `feature-name.md` slugs without numeric prefixes. One root catalog entry maps to exactly one per-feature file.

---

## 3. HOW IT WORKS

### Authoring Workflow

1. Read the target system docs, source files, command surfaces, MCP tool lists, tests, and existing README material before drafting the catalog.
2. Decide whether a catalog is warranted; use a README summary instead when the feature surface is small or volatile.
3. Define category taxonomy first, using numbered category folders to establish root section order.
4. Create `feature_catalog/feature_catalog.md` from `assets/feature_catalog/feature_catalog_template.md`.
5. Create one category folder per root section using `NN--category-name`.
6. Create one per-feature file per root entry from `assets/feature_catalog/feature_catalog_snippet_template.md`.
7. Keep the root catalog inventory-first: concise feature descriptions, current reality summaries, and links to per-feature files.
8. Put implementation truth in per-feature files: behavior overview, HOW IT WORKS, source-file tables, validation/test anchors, source metadata, and related references.
9. Run shared validation on the root catalog and manually verify cross-file links, source anchors, and root-entry to feature-file parity.

### Root Catalog Responsibilities

The root catalog owns the stable inventory and navigation layer:
- Frontmatter with title, description, trigger phrases, last updated date, and four-part version.
- A short H1 intro describing the current feature surface.
- `## 1. OVERVIEW`.
- Numbered H2 category sections.
- H3 feature entries with description, current reality, and source-file link.

Do not overload the root catalog with exhaustive source tables, execution matrices, roadmap detail, or long implementation explanation.

### Per-Feature File Responsibilities

Each per-feature file owns the detailed current-reality reference:
- Frontmatter with `title`, `description`, `trigger_phrases`, and four-part `version`.
- H1 matching the feature, with a tool or command name in parentheses when relevant.
- `## 1. OVERVIEW`.
- `## 2. HOW IT WORKS`.
- `## 3. SOURCE FILES`.
- `## 4. SOURCE METADATA`.

If `HOW IT WORKS` exceeds three paragraphs, split it with H3 subheadings such as `### Core Behavior`, `### Quality Gates`, `### Configuration`, `### Edge Cases`, or `### Async & Safety`.

### Validation Workflow

Use the shared doc-quality backbone before delivery:

```bash
python ../shared/scripts/validate_document.py feature_catalog/feature_catalog.md
python ../shared/scripts/extract_structure.py feature_catalog/feature_catalog.md
```

Also manually verify:
- Every root entry links to an existing per-feature file.
- Every per-feature file is represented in the root catalog.
- Source-file and validation tables reference real, stable paths.
- Catalog claims describe shipped behavior, not speculative roadmap.
- Runtime docs avoid mutable spec or phase packet history.

---

## 4. RULES

### ALWAYS

1. Load `references/feature_catalog_creation.md` before authoring or restructuring a catalog.
2. Use `assets/feature_catalog/feature_catalog_template.md` for the root catalog scaffold.
3. Use `assets/feature_catalog/feature_catalog_snippet_template.md` for per-feature files.
4. Preserve the canonical root path `feature_catalog/feature_catalog.md`.
5. Keep category folders numbered with `NN--category-name`.
6. Keep per-feature filenames stable after publication.
7. Include source-file and validation anchors for every feature claim.
8. Describe current shipped behavior from the caller or operator perspective.
9. Run shared validation on the root catalog before delivery.
10. Consume global standards and validators from `../shared/` instead of duplicating them here.

### NEVER

1. Never add a packet-local `graph-metadata.json`.
2. Never use a feature catalog as a roadmap unless future-state material is explicitly labeled.
3. Never split one feature across multiple files without a clear category boundary.
4. Never leave root entries without matching per-feature files.
5. Never leave per-feature files unlinked from the root catalog.
6. Never cite mutable packet numbers where current source paths, commands, or feature names should be used.
7. Never use numeric prefixes on per-feature filenames.
8. Never put manual execution scenario matrices in the catalog; route those to a playbook.

### ESCALATE IF

1. The category taxonomy is unclear after reading the target system.
2. Source anchors cannot be found for a claimed feature.
3. The requested catalog mixes shipped behavior with planned behavior.
4. Existing docs conflict about feature names or current reality.
5. Validation fails in `../shared/scripts/validate_document.py` and the safe fix is not obvious.
