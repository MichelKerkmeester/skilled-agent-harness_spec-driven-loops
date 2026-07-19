# create-feature-catalog

Create canonical feature-inventory packages for shipped systems, with a root catalog plus one source-anchored file per feature.

## 1. OVERVIEW

`create-feature-catalog` is a nested workflow packet of the `sk-doc` parent hub. It authors canonical current-state feature inventories rooted at `feature-catalog/feature-catalog.md`, with category folders and one source-anchored per-feature file per root catalog entry. The root catalog stays inventory-first and navigation-focused; per-feature files carry the implementation truth, source anchors, and validation references. `SKILL.md` is the authoritative contract.

## 2. WHEN TO USE

Use this packet when you need to document a real feature surface as an inventory, especially for a skill, system, MCP surface, CLI surface, or documentation family.

Good fits:

- Creating or updating `feature-catalog/feature-catalog.md`
- Splitting a large feature surface into category folders
- Creating one stable per-feature file for each root catalog entry
- Capturing current shipped behavior with source-file and validation anchors
- Linking READMEs, operator docs, or manual testing playbooks to stable feature references

Do not use it for roadmap-only docs, manual test scenario matrices, small README-sized feature lists, or document-quality review of an existing catalog.

## 3. WHAT'S INSIDE

- `SKILL.md` - authoritative packet contract, routing rules, authoring workflow, validation expectations, and hard rules.
- `references/README.md` - route-map into the reference overflow, loaded before authoring or restructuring a catalog.
- `references/examples.md` - annotated walkthrough of a shipped feature catalog (root-catalog and per-feature anatomy).
- `references/common-pitfalls.md` - recurring catalog defects with worked fixes and the template-versus-reference split.
- `assets/feature-catalog/feature-catalog-template.md` - source scaffold for the root `feature-catalog/feature-catalog.md`.
- `assets/feature-catalog/feature-catalog-snippet-template.md` - scaffold for each per-feature reference file.
- `changelog/.gitkeep` - placeholder for packet changelog history.
- No packet-local `scripts/` directory is present; validation is consumed from the shared sk-doc backbone.

## 4. OUTPUT SHAPE

A catalog package uses this structure:

```text
feature-catalog/
├── feature-catalog.md
├── category-name/
│   ├── feature-name.md
│   └── another-feature-name.md
└── another-category/
    └── feature-name.md
```

Category folders use descriptive kebab-case names such as `category-name`; the root catalog `feature-catalog.md` owns display order, not the folder name.

Per-feature files use stable `feature-name.md` slugs without numeric prefixes.

Each root catalog entry should map to exactly one per-feature file.

## 5. QUICK START

```text
/create:feature-catalog for the MCP memory tools
```

Then follow the packet flow:

1. Read the target system docs, source files, commands, tests, and existing README material.
2. Load `references/README.md`, which routes to the worked example and pitfalls references.
3. Decide whether the feature surface is large enough to warrant a catalog.
4. Create the root catalog from `assets/feature-catalog/feature-catalog-template.md`.
5. Create one category folder per root section using the bare descriptive slug.
6. Create one per-feature file per root entry from `assets/feature-catalog/feature-catalog-snippet-template.md`.
7. Verify root-entry to feature-file parity, links, source anchors, and shipped-behavior claims.
8. Run shared validation from `../shared/scripts/` before delivery.

The source templates retain their current underscore filenames until their separate source-file migration. Those source names are not emitted package names.

## 6. HUB RELATIONSHIP

This is a nested workflow packet of the `sk-doc` parent hub.

The shared create-quality-control backbone lives at `../shared`.

The single advisor identity and mode registry live at the `sk-doc` hub root, not inside this packet.

Do not add a packet-local `graph-metadata.json`.
