---
name: create-feature-catalog
description: Author sk-doc feature-catalog inventory packages with a root catalog, numbered category folders, per-feature files, and auditable source anchors.
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 1.0.0.0
---

# Create Feature Catalog

`create-feature-catalog` is the feature-inventory workflow packet of the `sk-doc` parent hub. It authors canonical current-state catalogs rooted at `feature_catalog/feature_catalog.md`, with numbered category folders and one per-feature reference file per root catalog entry.

Feature catalogs are the canonical inventory for what a system does today. They organize capabilities by category, summarize current behavior in a root catalog, and link to per-feature files that carry implementation anchors, tests, and metadata.

Core principle: use the root catalog for stable inventory and navigation, and use per-feature files for implementation truth and traceable source anchors.

This packet owns `/create:feature-catalog`, its `references/` set (indexed by `references/README.md`), and `assets/feature_catalog/`. It consumes shared sk-doc validation and writing standards from `../shared/`.

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

### Creation Decision

Create a feature catalog when the system needs a canonical capability inventory.

Strong signals:

- The feature surface is too large for a trustworthy README-only summary.
- Multiple docs need a stable source of truth for feature names and links.
- Reviewers or operators need one place to see what the system does now.
- Manual playbooks or specs need a canonical feature list to cross-reference.

Use a lighter alternative when:

- The system has only a handful of features.
- A README already provides a complete and stable inventory.
- The product is too volatile for a maintained catalog to stay accurate.

Decision rule:

```text
Need a stable, reviewable current-state inventory?
  YES -> Create a feature catalog package
  NO  -> Keep capability summary in README or install guide
```

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

## 2. PACKAGE CONTRACT

### Canonical Shape

```text
feature_catalog/
├── feature_catalog.md
├── 01--category-name/
│   ├── feature-name.md
│   └── another-feature-name.md
└── 02--another-category/
    └── feature-name.md
```

Invariants:

- Root file is always `feature_catalog.md` in lowercase.
- Category directories use `NN--category-name`.
- Per-feature files use `feature-name.md` without numeric prefixes.
- One root entry maps to exactly one per-feature file.
- Slugs should remain stable after publication.
- Category numbering defines root section order.
- Per-feature snippet order is defined by the root catalog listing order; filenames do not encode order.

### Required Resources

Use these packet resources while authoring:

- `assets/feature_catalog/feature_catalog_template.md` for the root catalog scaffold.
- `assets/feature_catalog/feature_catalog_snippet_template.md` for each per-feature file.
- `../shared/references/global/quick_reference.md` and `../shared/references/global/validation.md` before delivery.
- `../shared/references/global/frontmatter_versioning.md` when checking frontmatter version fields.
- `references/README.md` to route the reference overflow — [`examples.md`](references/examples.md) (worked live-catalog walkthrough) and [`common_pitfalls.md`](references/common_pitfalls.md) (deep-dive pitfalls, template-versus-reference split) — only for depth beyond this inline workflow.

---

## 3. CREATION WORKFLOW

Follow this workflow in order.

1. Read the target system docs, source files, command surfaces, MCP tool lists, tests, and existing README material before drafting the catalog.
2. Decide whether a catalog is warranted; use a README summary instead when the feature surface is small, complete, stable, or too volatile for a maintained catalog.
3. Decide the category taxonomy before writing prose.
4. Stabilize category names, feature names, and feature slugs before polishing descriptions.
5. Create `feature_catalog/feature_catalog.md` from `assets/feature_catalog/feature_catalog_template.md`.
6. Create one numbered category folder per root section using `NN--category-name`.
7. Create one per-feature file for each root entry using `assets/feature_catalog/feature_catalog_snippet_template.md`.
8. Write concise root summaries and link each feature to its per-feature file.
9. Fill each per-feature `## 2. HOW IT WORKS` section with current behavior.
10. Use plain prose for short `HOW IT WORKS` sections and H3 subheadings for sections longer than three paragraphs.
11. Fill implementation source tables and validation or test anchor tables for every feature claim.
12. Fill `## 4. SOURCE METADATA`, including group, canonical file path, and related references.
13. Validate the root catalog and each per-feature leaf file with shared validation (see §6).
14. Manually verify feature-file links, root-entry parity, source anchors, and current-state wording.

Authoring order matters:

- Stabilize names and slugs before polishing prose.
- Finish root taxonomy before expanding file-level detail.
- Use implementation and test anchors to justify every feature summary.

---

## 4. ROOT CATALOG REQUIREMENTS

The root catalog is the top-level inventory and navigation layer.

It owns:

- Frontmatter with title, description, trigger phrases, last updated date, and four-part version.
- A short H1 intro describing the current feature surface.
- `## 1. OVERVIEW`.
- Numbered H2 capability sections by category.
- H3 feature entries with concise descriptions.
- Current-reality summaries.
- Explicit links to per-feature files.

Root summaries should answer:

- What this feature does.
- What its current reality is.
- Where to find source-file and test detail.

Package highlights for root catalogs:

- Use frontmatter, including `trigger_phrases`.
- Include a short H1 intro.
- Do not include a Table of Contents.
- Do not use `<!-- ANCHOR -->` navigation comments.
- Start numbered H2 sections with `## 1. OVERVIEW`.

Do not overload the root catalog with:

- Exhaustive source-file tables.
- Full scenario matrices.
- Speculative future-state design.
- Long implementation explanations.
- Roadmap detail.

That information belongs in per-feature files, playbooks, or specs.

---

## 5. PER-FEATURE FILE REQUIREMENTS

Each per-feature file is the detailed reference entry for one catalog item.

Required structure:

1. `## 1. OVERVIEW`
2. `## 2. HOW IT WORKS`
3. `## 3. SOURCE FILES`
4. `## 4. SOURCE METADATA`

Each per-feature file must include:

- Frontmatter with stable `title`, one-line `description`, `trigger_phrases`, and a four-part `version`.
- At least three trigger phrases matching the H3 heading in the root catalog.
- An H1 matching the feature, with a tool or command name in parentheses when relevant.
- A concise overview of the feature.
- A behavior-focused `HOW IT WORKS` section.
- Implementation source tables with `File | Layer | Role` columns.
- Validation or test anchors with `File | Type | Role` columns.
- Metadata including group, canonical file path, and related references.

`HOW IT WORKS` subheading rule:

- Use plain prose when the section is three paragraphs or fewer.
- Add H3 subheadings when the section exceeds three paragraphs.
- Preferred H3 examples include `### Core Behavior`, `### Quality Gates`, `### Configuration`, `### Edge Cases`, and `### Async & Safety`.
- Describe behavior from the caller or operator perspective, not the implementation perspective.

Content rule:

- Describe behavior that exists now.
- If a rollout or compatibility layer is documented, label it explicitly.
- Avoid roadmap or speculative wording unless the feature itself is a documented compatibility or feature-flag surface.

---

## 6. PLAYBOOK AND VALIDATION BOUNDARY

Feature catalogs and manual testing playbooks serve different purposes.

| Document | Primary Question |
|---|---|
| Feature catalog | What does the system do today? |
| Manual testing playbook | How do we validate that behavior manually? |

Cross-reference rule:

- Playbooks should link back to the matching catalog entry when one exists.
- Catalogs should stay focused on current behavior, not test execution detail.
- Manual execution scenario matrices belong in playbooks, not catalogs.

Validation workflow — run from the repo root so the validator resolves the `feature_catalog` doc type on per-feature leaves (leaf detection keys on a `/feature_catalog/NN--category/` path):

```bash
# Root catalog (detected as the readme doc type)
python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py <target-skill>/feature_catalog/feature_catalog.md
python3 .opencode/skills/sk-doc/shared/scripts/extract_structure.py <target-skill>/feature_catalog/feature_catalog.md

# Each per-feature leaf (detected as the feature_catalog doc type; validates the Validation And Tests table taxonomy)
python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py <target-skill>/feature_catalog/NN--category/feature-name.md
```

The validator machine-checks the root-catalog structure and each leaf's Validation And Tests table, but not cross-file link targets or source-anchor accuracy. Manually verify:

- Every root entry links to an existing per-feature file.
- Every per-feature file is represented in the root catalog.
- Source-file tables reference real, stable paths.
- Validation or test tables reference real, stable paths.
- Catalog claims describe shipped behavior, not speculative roadmap.
- Cross-file links resolve.
- Runtime docs avoid mutable spec or phase packet history.

Validator boundary:

- `validate_document.py` checks root-catalog structure and, for per-feature leaves reached by a repo-root path, the Validation And Tests table taxonomy.
- Cross-file link resolution is enforced in CI by `check-markdown-links.cjs`.
- Per-feature link correctness and source-anchor accuracy still require manual review.

---

## 7. RULES

### ALWAYS

1. Use `assets/feature_catalog/feature_catalog_template.md` for the root catalog scaffold.
2. Use `assets/feature_catalog/feature_catalog_snippet_template.md` for per-feature files.
3. Preserve the canonical root path `feature_catalog/feature_catalog.md`.
4. Keep category folders numbered with `NN--category-name`.
5. Keep per-feature filenames stable after publication.
6. Keep per-feature filenames free of numeric prefixes.
7. Include source-file and validation anchors for every feature claim.
8. Describe current shipped behavior from the caller or operator perspective.
9. Keep the root catalog inventory-first and navigation-focused.
10. Put implementation truth in per-feature files.
11. Run shared validation on the root catalog and per-feature leaves before delivery.
12. Manually verify cross-file links, source anchors, and root-entry to feature-file parity.
13. Consume global standards and validators from `../shared/` instead of duplicating them here.

### NEVER

1. Never add a packet-local `graph-metadata.json`.
2. Never use a feature catalog as a roadmap unless future-state material is explicitly labeled.
3. Never split one feature across multiple files without a clear category boundary.
4. Never leave root entries without matching per-feature files.
5. Never leave per-feature files unlinked from the root catalog.
6. Never cite mutable packet numbers where current source paths, commands, or feature names should be used.
7. Never use numeric prefixes on per-feature filenames.
8. Never put manual execution scenario matrices in the catalog.
9. Never omit source anchors for feature claims.
10. Never leave long `HOW IT WORKS` sections as unbroken walls of prose.
11. Never omit `trigger_phrases` from per-feature frontmatter.

### ESCALATE IF

1. The category taxonomy is unclear after reading the target system.
2. Source anchors cannot be found for a claimed feature.
3. The requested catalog mixes shipped behavior with planned behavior.
4. Existing docs conflict about feature names or current reality.
5. Validation fails in `../shared/scripts/validate_document.py` and the safe fix is not obvious.
6. Published category or feature slugs would need to change without a deliberate rename migration.

---

## 8. COMMON MISTAKES

| Mistake | Why It Breaks | Correct Fix |
|---|---|---|
| Treating the catalog like a roadmap | Readers cannot trust current-state claims | Keep speculative material out or label it explicitly |
| Unstable renaming of category or feature slugs | Breaks links from playbooks and other docs | Keep published slugs stable unless there is a deliberate rename migration |
| Missing source anchors | Catalog claims become hard to audit | Add implementation and validation file references in the per-feature file |
| Writing execution-heavy scenario detail in the catalog | Blurs the boundary with playbooks | Keep execution matrices in playbooks, not the catalog |
| Playbook cross-references drifting from catalog names | Inventory and validation no longer match | Update catalog and playbook links together when a feature name changes |
| Wall of prose in `HOW IT WORKS` | Long unbroken sections lose scannability and navigation anchors | Add H3 subheadings whenever the section exceeds three paragraphs |
| Missing `trigger_phrases` in frontmatter | Feature is invisible to doc-trigger routing | Add at least three trigger phrases matching the H3 heading in the root catalog |
