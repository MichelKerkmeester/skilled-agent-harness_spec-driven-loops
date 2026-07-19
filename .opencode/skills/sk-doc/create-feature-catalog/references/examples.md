---
title: Feature Catalog Examples - Live Catalog Walkthrough
description: Annotated walkthrough of the shipped system-spec-kit feature catalog, showing root-catalog anatomy and a real per-feature file section by section.
trigger_phrases:
  - "feature catalog example"
  - "feature catalog walkthrough"
  - "per-feature file example"
  - "root catalog anatomy"
  - "worked feature catalog"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Feature Catalog Examples - Live Catalog Walkthrough

A section-by-section reading of a real, shipped feature catalog so a new catalog can be modeled on a proven layout instead of the abstract contract alone.

---

## 1. OVERVIEW

The packet `SKILL.md` states the contract; this reference shows a working instance of its content model. Everything below is drawn from the live legacy catalog at `.opencode/skills/system-spec-kit/feature-catalog/`, the largest maintained catalog in the repo. That tree keeps its underscore root until the repository content migration. New output uses the canonical hyphenated paths shown below.

Read this alongside the two scaffolds in `../assets/feature-catalog/`. The templates give you the empty shape; this walkthrough shows the shape filled in well.

---

## 2. THE LIVE EXAMPLE

Location: `.opencode/skills/system-spec-kit/feature-catalog/`

Canonical emitted shape, using content drawn from the live example:

```text
feature-catalog/
├── feature-catalog.md            # root inventory + navigation
├── retrieval/                # ~17 per-feature files
│   ├── unified-context-retrieval-memorycontext.md
│   ├── semantic-and-lexical-search-memorysearch.md
│   └── ...
├── mutation/                 # memory-indexing-memorysave.md, ...
├── discovery/                # health-diagnostics-memoryhealth.md, ...
├── maintenance/
└── ...                           # twenty-plus category folders
```

The catalog groups a large MCP surface into category folders, each holding one file per feature. The root `feature-catalog.md` is the only navigation surface and owns the section order; the folder names do not encode ordering. Both the category folders and the per-feature files use bare descriptive kebab-case slugs with no numeric prefix.

---

## 3. ROOT CATALOG ANATOMY

The root `feature-catalog.md` opens with frontmatter carrying `title`, `description`, `trigger_phrases`, `last_updated`, and a 4-part `version`, then a short H1 intro that names what the system does today:

```markdown
# Spec Kit Memory: Feature Catalog

This document is the current feature inventory for the Spec Kit Memory system.
It describes live MCP tools, pipeline stages, verification surfaces, and the
supporting workflow scripts that ship with the same skill package.
```

After the intro it uses numbered all-caps H2 sections — `## 1. OVERVIEW` first, then one H2 per category (`## 2. RETRIEVAL`, and so on). There is no Table of Contents and no `<!-- ANCHOR -->` navigation comment.

Inside each category section, every feature is an H3 entry that stays deliberately thin — a `#### Description`, a `#### Current Reality`, and a `#### Source Files` callout that links to the per-feature file rather than inlining the source tables:

```markdown
### Unified context retrieval (memory_context)

#### Description
...

#### Current Reality
...

#### Source Files
See `retrieval/unified-context-retrieval-memorycontext.md` for full
implementation and test file listings.
```

The OVERVIEW section is where this catalog carries system-specific context (a command-surface contract table, coverage maps). That is fine — but note what it does *not* do: it never dumps exhaustive source-file tables or scenario matrices into the root. That depth lives one link away, in the per-feature file.

---

## 4. PER-FEATURE FILE ANATOMY

The file `retrieval/unified-context-retrieval-memorycontext.md` is a good model for a full feature entry. It shows all four required sections and the sub-heading rule in action.

**Frontmatter** carries a stable `title`, a one-line `description`, five `trigger_phrases`, and a 4-part `version`. The `trigger_phrases` include the exact feature name plus natural-language alternates and the tool name:

```yaml
title: "Unified context retrieval (memory_context)"
trigger_phrases:
  - "unified context retrieval"
  - "memory_context"
  - "context orchestration"
  - "intent-based retrieval routing"
  - "auto-detect task intent"
```

**H1 and template marker** — the H1 repeats the feature name with the tool in parentheses, immediately followed by the catalog template marker:

```markdown
# Unified context retrieval (memory_context)

<!-- sk-doc-template: skill_asset_feature_catalog -->
```

**`## 1. OVERVIEW`** opens with the one-line summary, then a plain-language paragraph describing the feature from the caller's perspective (a "smart librarian" analogy), not from the implementation.

**`## 2. HOW IT WORKS`** is long — well over three paragraphs — so it is broken into H3 sub-headings for navigation: `### Entry Point & Routing`, `### Configuration`, `### Async & Safety`, `### Post-Action Behavior`. This is exactly the sub-heading rule the contract requires for long sections; a short feature would use plain prose instead.

**`## 3. SOURCE FILES`** carries two tables. The `### Implementation` table uses `File | Layer | Role` columns (Handler / Lib / Formatter rows pointing at real `mcp-server/**` paths). The `### Validation And Tests` table uses `File | Type | Role` columns with `Automated test` rows pointing at real `*.vitest.ts` files.

**`## 4. SOURCE METADATA`** closes with the group, the canonical catalog source (`feature-catalog.md`), the feature file path, and a `Related references` link to a neighboring feature in the same category:

```markdown
- Group: Retrieval
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `retrieval/unified-context-retrieval-memorycontext.md`
Related references:
- [semantic-and-lexical-search-memorysearch.md](semantic-and-lexical-search-memorysearch.md) — Semantic and lexical search (memory_search)
```

---

## 5. PATTERNS TO REUSE

- Keep the root entry to Description / Current Reality / a Source Files link — resist inlining source tables at the root.
- Put the tool or command name in the H1 parentheses whenever the feature maps to a named tool.
- Make `trigger_phrases` lead with the exact feature name, then add alternates and the tool name.
- Apply the H3 sub-heading rule only when `HOW IT WORKS` actually runs long; short features stay plain prose.
- Point `Related references` at the immediately adjacent features so readers can navigate without returning to the root.
- Reference real, stable source and test paths — the whole point of a per-feature file is that its claims are auditable.

---

## 6. RELATED RESOURCES

- [../SKILL.md](../SKILL.md) - root-catalog and per-feature requirements this example illustrates
- [common-pitfalls.md](common-pitfalls.md) - the defects this example avoids, with fixes
- [../assets/feature-catalog/feature-catalog-template.md](../assets/feature-catalog/feature-catalog-template.md) - the empty root-catalog shape
- [../assets/feature-catalog/feature-catalog-snippet-template.md](../assets/feature-catalog/feature-catalog-snippet-template.md) - the empty per-feature shape
- `.opencode/skills/system-spec-kit/feature-catalog/` - the full live catalog read here
