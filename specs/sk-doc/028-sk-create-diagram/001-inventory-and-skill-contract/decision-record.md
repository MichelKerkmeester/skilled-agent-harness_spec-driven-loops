---
title: "Decision Record: sk-create-diagram scope, name, tree, and command surface"
description: "The frozen manifest phases 002-005 execute against: trim decisions, target tree, name/boundary, command surface, and the two open-question resolutions."
trigger_phrases:
  - "sk-create-diagram decision record"
  - "diagram skill target tree"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# Decision Record: sk-create-diagram scope, name, tree, and command surface

This is the executor brief for phases 002-005. Every decision below is final unless a later phase surfaces a concrete blocker (amend this file in place if so, per `plan.md` §7 Rollback Plan).

---

## 1. Skill identity

- **Folder / `name`**: `sk-create-diagram` under `.opencode/skills/sk-doc/`.
- **`packetSkillName`**: `sk-create-diagram` (folder == packetSkillName, `grandfatheredFolderMismatch: false`).
- **`packetKind`**: `workflow` (a nested workflow packet under the existing `sk-doc` hub — not a new standalone hub; `sk-doc` already owns the one advisor identity).
- **`backendKind`**: `template-scaffold`, matching every sibling `create-*` mode.
- **`toolSurface`**: `{ allowed: [Read, Write, Edit, Bash, Grep, Glob], forbidden: [Task], mutatesWorkspace: true, bashAllowlist: [] }` — identical to every sibling mode. No network tool is claimed; see §5 onboarding decision.

## 2. Scope boundary vs. `sk-create-flowchart`

`sk-create-flowchart`'s own "When NOT to Use" already excludes this skill's entire domain: *"The requested output is Mermaid, Graphviz, SVG, HTML, screenshot, canvas, or interactive design work."* `sk-create-diagram` is the packet that owns exactly that excluded domain — self-contained HTML files with inline SVG. No scope overlap exists; the boundary is additive, not contested.

`sk-create-diagram`'s own "When NOT to Use" (for `SKILL.md`, authored in phase 002) states the inverse:

> Use `sk-create-flowchart` instead when the deliverable is an ASCII or box-drawing flowchart directly inside a markdown document — no HTML file, no SVG, no design system. Use `sk-create-diagram` when the deliverable is a standalone visual artifact: architecture diagrams, sequence diagrams, ER diagrams, and 24 other technical/product diagram types, rendered as a self-contained `.html` file with inline SVG.

Phase 005 adds one optional line to `sk-create-flowchart/SKILL.md`'s "When NOT to Use" pointing at `sk-create-diagram` for SVG/HTML requests (tracked as the phase-parent's third open question — a same-sentence edit, not a restructure).

## 3. Command surface

**One command: `/create:diagram`.** Every sibling `create-*` mode maps 1:1 to exactly one command in `command-metadata.json` (confirmed against all 12 existing `sk-doc` modes). The source plugin's three Claude Code commands (`export-diagram`, `import-drawio`, `import-mermaid`) collapse into natural-language routing inside the one packet — the source's own Pi implementation already worked this way (one skill, natural-language triggers, with the slash commands as optional Claude-Code-specific convenience wrappers this repo does not need to replicate).

`SKILL.md` §3 "How It Works" documents three request shapes the one command and the packet's natural-language routing both serve:
1. **Generate** — "make me an architecture diagram of X" → select type, load `references/type-<name>.md`, draw.
2. **Import** — "redraw this drawio/mermaid file" → route by source extension to `references/import-drawio.md` or `references/import-mermaid.md`.
3. **Export** — "export this diagram as PNG/SVG" → `references/export.md`.

## 4. Target file tree

Ground truth checked directly against the two closest sibling nested workflow packets on disk (`sk-create-diff/`, `sk-create-flowchart/`) rather than inferred from prose — both carry exactly `SKILL.md`, `README.md`, `references/`, `assets/`, `scripts/`, `changelog/`, and neither carries `graph-metadata.json`, `leaf-manifest.config.json`, `leaf-manifest.json`, `leaf-aliases.json`, or `benchmark/` (those apply to top-level skill roots under the H/S root-metadata contract, not to packets nested inside a hub). `sk-create-diagram` matches that shape exactly:

```text
sk-create-diagram/
├── SKILL.md
├── README.md
├── changelog/
│   └── v1.0.0.0.md
├── references/
│   ├── style-guide.md
│   ├── onboarding.md
│   ├── output-spec.md
│   ├── export.md
│   ├── import-drawio.md
│   ├── import-mermaid.md
│   ├── primitive-annotation.md
│   ├── primitive-sketchy.md
│   ├── primitive-terminal.md
│   ├── primitive-icons.md
│   └── type-architecture.md .. type-venn.md   # all 27 diagram-type references
├── assets/
│   ├── template.html
│   ├── template-dark.html
│   ├── template-full.html
│   ├── template-terminal.html
│   ├── icons.html
│   ├── example-architecture.html .. example-venn.html   # 27 canonical examples
│   ├── example-quadrant-consultant.html
│   ├── example-loop-terminal.html
│   ├── example-sequence-oauth.html
│   ├── example-sequence-oauth-dark.html
│   ├── example-sequence-oauth-full.html
│   ├── example-import-drawio.html
│   └── example-import-mermaid.html
└── scripts/
    ├── drawio_extract.py
    └── mermaid_extract.py
```

No `graph-metadata.json` here — nested workflow packets never carry one (Rule §3.9 "Do not add `graph-metadata.json` to nested workflow packets or surface packets"; confirmed absent on both sibling packets on disk). `manual-testing-playbook/` and `benchmark/` are left for a later iteration once the skill has real usage to script scenarios from — `sk-create-flowchart` ships without either.

## 5. Open-question resolutions (carried from `../spec.md`)

**Icon set** — **include in v1.** `primitive-icons.md` (827 lines) and `assets/icons.html` are pure reference/example content with zero runtime dependency risk, and richer architecture/sequence diagrams genuinely need labeled component icons (server, database, K8s, Docker, cloud). Deferring it would ship an incomplete design system for the diagram types that need it most.

**Onboarding automation** — **agent-mediated guidance only, no packet script.** Every sibling `sk-doc` mode's `toolSurface.allowed` is `[Read, Write, Edit, Bash, Grep, Glob]` — none declare a network-fetch tool. `references/onboarding.md` ports as a documented workflow (ask the user for a URL, extraction procedure, propose-diff-then-write pattern) that assumes the *calling* AI session's own tools do any live fetch, exactly as the source's own onboarding flow already works (it is agent-mediated prose, not a Python script, in the source too — nothing to build here beyond porting the reference).

## 6. Section-order mapping: source `SKILL.md` → `sk-create-skill` contract

The source `SKILL.md` uses 12 numbered sections (Setup gate, Philosophy, When to Use, Diagram Types, Anti-patterns, Design System, Primitives, Layout, Summary Cards, Checklist, Templates, Import, Output). `sk-create-skill` requires `WHEN TO USE / SMART ROUTING / HOW IT WORKS / RULES / SUCCESS CRITERIA / REFERENCES`. Phase 002's mapping:

| New section | Absorbs source section(s) |
|---|---|
| `WHEN TO USE` | §2 When to Use, §3 selection-guide table (as use cases), the four boundary bullets |
| `SMART ROUTING` | §3 Diagram Types (as the resource-domain table keyed by type), a routed pseudocode block following the canonical resilience pattern |
| `HOW IT WORKS` | §0 style-guide gate, §5 Design System summary, §6 core primitives summary, §7 layout/spacing, §10 templates + "to create a new diagram" steps, §11 import, §12 output — each pointing into its `references/*.md` rather than inlining the full spec |
| `RULES` | §1 Philosophy (as ALWAYS restraint rules), §4 Universal Anti-patterns (as NEVER rules), §6 mandatory connector rules (as NEVER rules — these are non-negotiable per source) |
| `SUCCESS CRITERIA` | §9 Pre-Output Checklist (Taste Gate) |
| `REFERENCES` | Full pointer list to every ported `references/*.md` |

`SKILL.md` stays under the 5k-word ceiling by keeping the connector-rule *details*, the full complexity-budget table, and every type's layout conventions in `references/`, exactly as the source already does — only the routing index moves into `SKILL.md`.
