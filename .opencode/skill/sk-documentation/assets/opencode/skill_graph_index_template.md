---
title: Skill Graph Index Template
description: Base template for writing the index.md entry point of a skill graph.
---

# Skill Graph Index Template

Use this template when creating or aligning `index.md` for a skill graph.
The index is the **Map of Content (MOC)** — the single navigation entry point
that routes readers to the right node for their task.

---

<!-- ANCHOR:template -->
## Template

Copy the structure below into `index.md` at the skill root and replace
placeholders with real content.

```md
---
name: {skill-name}
description: "{One-line value proposition}"
allowed-tools: [{comma-separated tool list}]
version: {major.minor.patch.graph}
---

# {Descriptive Skill Title}

{1-2 sentence summary of what this skill does and when it activates.}

> **Navigation note:** This is a supplemental deep-dive index. `SKILL.md` remains the primary entrypoint for activation rules, routing logic, and core behavior. Use this index for focused content on specific topics.

## Map of Content (MOC)

### Foundation
- [[nodes/when-to-use|When To Use]] — {What triggers this skill, scope boundaries.}
- [[nodes/rules|Rules]] — {ALWAYS/NEVER/ESCALATE behavioural rules.}
- [[nodes/success-criteria|Success Criteria]] — {Completion gates and quality targets.}

### {Domain Group Name}
- [[nodes/{topic}|{Display Label}]] — {Brief description of what this node covers.}
- [[nodes/{topic}|{Display Label}]] — {Brief description.}

### {Another Group} (optional)
- [[nodes/{topic}|{Display Label}]] — {Brief description.}
```

<!-- /ANCHOR:template -->

---

<!-- ANCHOR:guidelines -->
## Guidelines

### Structure Rules
1. **YAML frontmatter** mirrors `SKILL.md` (name, description, allowed-tools, version).
2. **H1 title** is descriptive of the skill domain — NOT "Skill Name - Index".
3. **Intro paragraph** follows the H1 — 1-2 sentences explaining the skill.
4. **Single `## Map of Content (MOC)` heading** — this IS the table of contents.
5. **`### Foundation` subsection** always comes first with the three required nodes.
6. **Domain groups** use `###` — group nodes by logical theme (Workflows, Architecture, Reference, etc.).
7. **Every wikilink has a ` — ` annotation** describing what the node covers.

### What to Avoid
- No `## TABLE OF CONTENTS` section (the MOC IS the ToC).
- No numbered sections (`1. OVERVIEW`, `2. MAP OF CONTENT`, etc.).
- No `## OVERVIEW` section (the intro paragraph serves this purpose).
- No `## SKILL GRAPH RESOURCES` section (not needed per-skill; the template reference lives in `sk-documentation`).
- No `<!-- ANCHOR:... -->` tags (indexes are short enough to not need anchors).
- No `---` horizontal rules between MOC groups (clean reading flow).

### Wikilink Format
```
[[nodes/filename|Display Label]] — Brief description of what the node covers.
```
- The `|Display Label` part provides human-readable text.
- The ` — ` annotation (em dash, not hyphen) gives context without opening the file.
- Descriptions should be 5-15 words — enough to route, not enough to duplicate content.

### Grouping Strategy
| Group Name | Typical Nodes |
|------------|---------------|
| Foundation | when-to-use, rules, success-criteria (required for all skills) |
| Architecture / How It Works | how-it-works, smart-routing, routing-decision |
| Workflows / Phases | implementation, debugging, verification, commit, setup |
| Reference | quick-reference, integration-points, related-resources |
| External Resources | References to files in `references/` or `assets/` |

### Canonical Example

See: `.opencode/skill/system-spec-kit/index.md`

<!-- /ANCHOR:guidelines -->

---

<!-- ANCHOR:checklist -->
## Checklist Before Saving

- [ ] Frontmatter matches the skill's `SKILL.md` (name, description, allowed-tools, version).
- [ ] H1 title is descriptive (not "- Index").
- [ ] Intro paragraph explains the skill in 1-2 sentences.
- [ ] `## Map of Content (MOC)` is the only `##` heading.
- [ ] `### Foundation` lists when-to-use, rules, and success-criteria.
- [ ] Every wikilink has a ` — description` annotation.
- [ ] No numbered sections, no TOC section, no OVERVIEW section.
- [ ] All wikilinks resolve to real files (run `check-links.sh`).
<!-- /ANCHOR:checklist -->
