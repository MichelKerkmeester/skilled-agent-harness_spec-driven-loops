---
title: Feature Catalog Examples - Live Catalog Walkthrough
description: Annotated walkthrough of the shipped system-skill-advisor feature catalog, showing root-catalog anatomy and a real per-feature file section by section.
trigger_phrases:
  - "feature catalog example"
  - "feature catalog walkthrough"
  - "per-feature file example"
  - "root catalog anatomy"
  - "worked feature catalog"
importance_tier: normal
contextType: implementation
version: 1.0.0.8
---

# Feature Catalog Examples - Live Catalog Walkthrough

A section-by-section reading of a real, shipped feature catalog so a new catalog can be modeled on a proven layout instead of the abstract contract alone.

---

## 1. OVERVIEW

The packet `SKILL.md` states the contract; this reference shows a working instance of its content model. Everything below is drawn from the live catalog at `.opencode/skills/system-skill-advisor/feature-catalog/`: 42 features across 7 group folders, every claim carrying a real source and test path.

Read this alongside the two scaffolds in `../assets/feature-catalog/`. The templates give you the empty shape; this walkthrough shows the shape filled in well.

---

## 2. THE LIVE EXAMPLE

Location: `.opencode/skills/system-skill-advisor/feature-catalog/`

Canonical emitted shape, using content drawn from the live example:

```text
feature-catalog/
├── feature-catalog.md        # root inventory + navigation
├── mcp-surface/              # 10 per-feature files
│   ├── advisor-recommend.md
│   ├── advisor-status.md
│   └── ...
├── daemon-and-freshness/     # watcher.md, lease.md, lifecycle.md, ...
├── auto-indexing/            # sanitizer.md, derived-extraction.md, ...
├── scorer-fusion/
├── lifecycle-routing/
├── hooks-and-plugin/
└── python-compat/
```

The catalog groups a large MCP surface into category folders, each holding one file per feature. The root `feature-catalog.md` is the only navigation surface and owns the section order; the folder names do not encode ordering. Both the category folders and the per-feature files use bare descriptive kebab-case slugs with no numeric prefix.

One wrinkle worth copying only if you have the same reason: the directory layout skips a numeric slot between `scorer-fusion` and `mcp-surface`, and the root says so in a note that tells you not to renumber. A deliberate gap with a written reason beats a silent one.

---

## 3. ROOT CATALOG ANATOMY

The root `feature-catalog.md` opens with frontmatter carrying `title`, `description`, `trigger_phrases` and a 4-part `version`, then the H1, the catalog template marker, and a short intro naming what the system does today and where its source of truth lives:

```markdown
# Skill Advisor: Feature Catalog

<!-- sk-doc-template: skill_asset_feature_catalog -->

This catalog is the current inventory for the skill advisor. The package source
of truth is `.opencode/skills/system-skill-advisor/mcp-server/`, with adjacent
OpenCode plugin docs included where the same hook/plugin ownership model applies.
Each group links to per-feature files that cite the real implementation and test
anchors.
```

After the intro it uses numbered all-caps H2 sections — `## 1. OVERVIEW` first, then one H2 per category (`## 2. DAEMON AND FRESHNESS`, and so on). There is no Table of Contents and no `<!-- ANCHOR -->` navigation comment.

`## 1. OVERVIEW` carries the counts and the map: a sentence per group explaining what it owns, a `Group | Count | Scope` table linking each folder, and a baseline-metrics table pinned to a commit SHA. Numbers with a SHA attached age visibly, which is the point.

Inside each category section, the root stays a pure index. Every feature is one row pointing at its own file:

```markdown
## 6. MCP SURFACE

| Feature | File |
| --- | --- |
| Native recommendation tool | [mcp-surface/advisor-recommend.md](./mcp-surface/advisor-recommend.md) |
| Advisor status and freshness | [mcp-surface/advisor-status.md](./mcp-surface/advisor-status.md) |
```

Note what the root does *not* do: it never dumps source-file tables, prose descriptions or scenario matrices. That depth lives one link away, in the per-feature file. A root that stays a table of links survives having features added to it.

---

## 4. PER-FEATURE FILE ANATOMY

The file `mcp-surface/advisor-recommend.md` is a good model for a full feature entry. It shows all four required sections and the sub-heading rule in action.

**Frontmatter** carries a stable `title`, a one-line `description`, five `trigger_phrases`, and a 4-part `version`. The `trigger_phrases` lead with the exact tool name, then add natural-language alternates and one field name a reader might search for:

```yaml
title: "advisor_recommend MCP Tool"
trigger_phrases:
  - "advisor_recommend"
  - "mcp recommend tool"
  - "native recommend"
  - "skill recommendation tool"
  - "compiledRoute enrichment"
```

**H1 and template marker** — the H1 names the tool, immediately followed by the catalog template marker:

```markdown
# advisor_recommend MCP Tool

<!-- sk-doc-template: skill_asset_feature_catalog -->
```

**`## 1. OVERVIEW`** is one sentence: expose the native scoring pipeline as an MCP tool any runtime can call, with prompt-safe attribution and lifecycle-aware redirects. Written from the caller's side, not the implementation's. One sentence is enough when the sentence is the right one.

**`## 2. HOW IT WORKS`** runs long, so it names the handler, the schema and the response envelope in prose, then breaks out `### Compiled-Routing Enrichment (compiledRoute)` as an H3 because that behavior has its own gate, its own failure mode and its own flag. This is the sub-heading rule the contract asks for: split when a sub-behavior needs its own navigation anchor, not on a paragraph count. The section is also unusually good at stating when a field is *absent* — flag off, hub ineligible, legacy sentinel, probe failure — which is the half most feature docs skip.

**`## 3. SOURCE FILES`** carries two tables. The `### Implementation` table uses `File | Layer | Role` columns, with Handler / Schema / Shared / Script rows pointing at real `mcp-server/**` and `.opencode/bin/**` paths. The `### Validation And Tests` table uses `File | Type | Role` columns, mixing `Automated test` rows that point at real `*.vitest.ts` files with a `Manual playbook` row that links named scenarios in the testing playbook.

**`## 4. SOURCE METADATA`** closes with the group, the canonical catalog source, the feature file path, and `Related references` links to neighboring features plus the one cross-skill page the behavior depends on:

```markdown
- Group: MCP surface
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `mcp-surface/advisor-recommend.md`

Related references:

- [advisor-status.md](../../feature-catalog/mcp-surface/advisor-status.md).
- [advisor-validate.md](../../feature-catalog/mcp-surface/advisor-validate.md).
```

---

## 5. PATTERNS TO REUSE

- Keep the root a table of links per category. Resist inlining prose or source tables there.
- Put counts and baseline metrics in `## 1. OVERVIEW`, and pin the metrics to a commit SHA so staleness is visible.
- Name the tool in the H1 whenever the feature maps to one.
- Make `trigger_phrases` lead with the exact tool or feature name, then add alternates.
- Apply the H3 sub-heading rule when a sub-behavior needs its own anchor, not on a paragraph count.
- Say when a field or behavior is absent, not only when it fires.
- Point `Related references` at adjacent features so readers navigate without returning to the root.
- Reference real, stable source and test paths. The whole point of a per-feature file is that its claims are auditable.

---

## 6. RELATED RESOURCES

- [../SKILL.md](../SKILL.md) - root-catalog and per-feature requirements this example illustrates
- [common-pitfalls.md](common-pitfalls.md) - the defects this example avoids, with fixes
- [../assets/feature-catalog-template.md](../assets/feature-catalog-template.md) - the empty root-catalog shape
- [../assets/feature-catalog-snippet-template.md](../assets/feature-catalog-snippet-template.md) - the empty per-feature shape
- `.opencode/skills/system-skill-advisor/feature-catalog/` - the full live catalog read here
