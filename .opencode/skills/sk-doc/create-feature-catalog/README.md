# create-feature-catalog

Create canonical feature-inventory packages for shipped systems, with a root catalog plus one source-anchored file per feature.

## When To Use

Use this packet when you need to document a real feature surface as an inventory, especially for a skill, system, MCP surface, CLI surface, or documentation family.

Good fits:

- Creating or updating `feature_catalog/feature_catalog.md`
- Splitting a large feature surface into numbered category folders
- Creating one stable per-feature file for each root catalog entry
- Capturing current shipped behavior with source-file and validation anchors
- Linking READMEs, operator docs, or manual testing playbooks to stable feature references

Do not use it for roadmap-only docs, manual test scenario matrices, small README-sized feature lists, or document-quality review of an existing catalog.

## What's Inside

- `SKILL.md` - authoritative packet contract, routing rules, authoring workflow, validation expectations, and hard rules.
- `references/README.md` - route-map into the reference overflow, loaded before authoring or restructuring a catalog.
- `references/examples.md` - annotated walkthrough of a shipped feature catalog (root-catalog and per-feature anatomy).
- `references/common_pitfalls.md` - recurring catalog defects with worked fixes and the template-versus-reference split.
- `assets/feature_catalog/feature_catalog_template.md` - scaffold for the root `feature_catalog/feature_catalog.md`.
- `assets/feature_catalog/feature_catalog_snippet_template.md` - scaffold for each per-feature reference file.
- `changelog/.gitkeep` - placeholder for packet changelog history.
- No packet-local `scripts/` directory is present; validation is consumed from the shared sk-doc backbone.

## Output Shape

A catalog package uses this structure:

```text
feature_catalog/
├── feature_catalog.md
├── 01--category-name/
│   ├── feature-name.md
│   └── another-feature-name.md
└── 02--another-category/
    └── feature-name.md
```

Category folders use `NN--category-name`.

Per-feature files use stable `feature-name.md` slugs without numeric prefixes.

Each root catalog entry should map to exactly one per-feature file.

## Quick Start

```text
/create:feature-catalog for the MCP memory tools
```

Then follow the packet flow:

1. Read the target system docs, source files, commands, tests, and existing README material.
2. Load `references/README.md`, which routes to the worked example and pitfalls references.
3. Decide whether the feature surface is large enough to warrant a catalog.
4. Create the root catalog from `assets/feature_catalog/feature_catalog_template.md`.
5. Create one numbered category folder per root section.
6. Create one per-feature file per root entry from `assets/feature_catalog/feature_catalog_snippet_template.md`.
7. Verify root-entry to feature-file parity, links, source anchors, and shipped-behavior claims.
8. Run shared validation from `../shared/scripts/` before delivery.

## Hub Relationship

This is a nested workflow packet of the `sk-doc` parent hub.

The shared doc-quality backbone lives at `../shared`.

The single advisor identity and mode registry live at the `sk-doc` hub root, not inside this packet.

Do not add a packet-local `graph-metadata.json`.
