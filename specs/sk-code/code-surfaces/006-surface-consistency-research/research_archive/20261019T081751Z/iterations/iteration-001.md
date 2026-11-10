# Iteration 001

## Focus

Q1: How do the three surfaces differ in SKILL.md section order, frontmatter fields and smart-routing blocks, and which form matches the sk-doc create-skill canon for a hub child?

## Actions Taken

- Read the frontmatter, section headings, and smart-routing markers in the three surface `SKILL.md` files.
- Compared those structures with the create-skill frontmatter contract, the packet scaffold, and the parent-hub surface-packet rules.
- Status: `insight`; `newInfoRatio`: `0.74`.

## Findings

### Shared frontmatter contract

All three surfaces use the same top-level fields: `name`, `description`, `allowed-tools`, `version`, and `metadata`. They share `[Read, Bash, Grep, Glob]` and the metadata values `author: OpenCode`, `family: sk-code`, and `packetKind: surface`; names, descriptions, and versions vary by surface. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:2] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:4] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:6] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:2] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:4] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:6] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:2] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:4] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:6]

This matches the create-skill contract's four required core fields (`name`, `description`, `allowed-tools`, and four-part `version`); the shared `metadata` block is an additional surface marker. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/SKILL.md:290] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/SKILL.md:291] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/SKILL.md:293] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/SKILL.md:294]

### Shared routing prefix, different later sections

The three files share the opening order `WHEN THE HUB BUNDLES THIS` → `REFERENCE MAP` → `SMART ROUTING`. Their machine-readable blocks each expose `DEFAULT_RESOURCE`, `INTENT_SIGNALS`, and `RESOURCE_MAP`; the entries remain surface-specific. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:20] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:28] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:48] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:61] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:70] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:83] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:27] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:49] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:69] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:79] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:84] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:92] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:18] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:26] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:57] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:66] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:73] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:89]

After routing, SKILLED and Webflow go to `SURFACE STANDARDS` and `ASSETS`; Obsidian adds `SOURCE TREE CONVENTIONS`, then `ASSETS`, `RULES`, and `INTEGRATION POINTS`. Those additions describe Obsidian-specific evidence and should remain available, while shared section names and numbering can be normalized. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:171] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:181] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:143] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:179] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:236] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:254] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:291] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:226] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:235]

The routing comments in SKILLED and Webflow describe a parent union of their own map plus the other named sibling map, omitting Obsidian; Obsidian's comment refers to sibling surface maps generally. The hub documents all three surfaces. This confirms comment-level inconsistency, not a defect in the actual route map. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:53] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:56] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:75] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:78] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:62] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:65] [SOURCE: .skilled/skills/sk-code/SKILL.md:15]

### Canon fit and target form

The parent-skill canon defines a surface packet as a read-only, advisor-invisible evidence base bundled alongside a workflow. The available `packet-skill-scaffold.md` instead identifies itself as a primary workflow packet, so its `WHEN TO USE` → `SMART ROUTING` → `HOW IT WORKS` structure is not a surface-specific body template. The canon supplies surface identity and permission requirements, but no exact surface section order. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:54] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:58] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:85] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:89] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/scaffold/packet-skill-scaffold.md:8] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/scaffold/packet-skill-scaffold.md:14] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/scaffold/packet-skill-scaffold.md:22] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/scaffold/packet-skill-scaffold.md:66]

No single current surface is a complete sk-doc canonical exemplar. Use the three files' shared opening as the local baseline, keep the core frontmatter, and make `SMART ROUTING` the one authoritative routing section with the reference inventory presented inside it. Keep `SURFACE STANDARDS` and `ASSETS` as the shared body sections; retain later sections only where a surface needs them, with consistent numbering. This follows create-skill's rule that resource selection belongs in `SMART ROUTING` and that there is one authoritative routing source. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/SKILL.md:239] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/SKILL.md:408]

## Questions Answered

- **Q1:** The three surfaces share core frontmatter and the same initial section sequence and routing keys. Their later sections differ, and SKILLED/Webflow routing comments omit Obsidian from their stated parent-map union. The parent canon defines surface-packet role and metadata rather than an exact section order; use a common surface skeleton with optional domain-specific sections, not the generic workflow scaffold.

## Questions Remaining

- **Q2:** How do the three references/ trees differ (topic folders vs flat files, shared/, workflow-implement/debug/verify), and what single layout fits all three without losing surface-specific content?
- **Q3:** How do the supporting folders (assets, scripts, benchmark, manual-testing-playbook, changelog, README) differ, and which should every surface carry?
- **Q4:** What do the hub files (mode-registry.json, hub-router.json, leaf-manifest.json, graph-metadata.json, ROUTER.md), the doctor checks (parent-skill-check, sk-code-setup-check) and the advisor assume about each surface's layout, and what breaks if a surface moves files?
- **Q5:** What ordered migration plan, with a guarding check per step, brings each surface to the target layout?

## Next Focus

Q2: How do the three references/ trees differ (topic folders vs flat files, shared/, workflow-implement/debug/verify), and what single layout fits all three without losing surface-specific content?
