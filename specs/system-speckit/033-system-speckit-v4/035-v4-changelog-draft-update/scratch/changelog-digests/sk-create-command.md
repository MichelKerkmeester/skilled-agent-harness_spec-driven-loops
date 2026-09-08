# sk-create-command changelog digest

Skill path: `.opencode/skills/sk-doc/sk-create-command/`
Versions covered: v1.0.0.0 through v1.0.2.0 (all 4 entries in the changelog, fewer than 10 exist)
Date range: 2026-07-06 to 2026-07-12

---

## 1. PER-VERSION DIGEST (NEWEST FIRST)

### v1.0.2.0 (2026-07-12) - `v1.0.2.0.md`

A README-only release. Per `v1.0.2.0.md`, the mode's README was rewritten on the refined skill README template so it reads purpose-first: a one-line pitch, then a problem-first OVERVIEW that states the reader's situation before any feature list, then quick start, how the skill works, integration, troubleshooting, FAQ, verification and related documents. The seven command types got a dedicated capability table. A human-voice cleanup pass removed the Oxford commas the old body carried, including the ones in the frontmatter description. The README frontmatter version field moved from 1.0.0.0 to 1.0.2.0. The entry states explicitly that no SKILL.md content, template or other skill file was touched, and that all seven command types, the invocation path rules, the mandatory gate pattern, the router and presentation split, the troubleshooting rows, the FAQ answers, the verification commands and the related-document links survive verbatim. No rename, removal, moved path, changed default or breaking change.

### v1.0.1.1 (2026-07-12) - `v1.0.1.1.md`

A one-line documentation entry. Per `v1.0.1.1.md`, the release recorded two things in the packet's docs: how the command surface stays resilient when routing, and the packet's deliberate choice to expose flat resources rather than keyed runtime discovery. No behavior, workflow or file layout changed. No rename, removal, moved path, changed default or breaking change.

### v1.0.1.0 (2026-07-12) - `v1.0.1.0.md`

A structural conformance fix to SKILL.md. Per `v1.0.1.0.md`, section 1 previously carried the header `WHEN TO USE + SMART_ROUTING`, and the underscore in `SMART_ROUTING` stopped the canonical section matcher from seeing a distinct `SMART ROUTING` heading, so the packet read as missing a required section under the contract the shared skill packager enforces. RENAME: the merged header was split into two correctly named H2 sections, `## 1. WHEN TO USE` for the use and do-not-use boundaries and `## 2. SMART ROUTING` for the keyword triggers plus the sibling-packet hand-off rule, with the routing keyword-trigger line moved under the new section and no prose removed. The remaining H2 sections were renumbered contiguously to run 1 through 6, and a new `## 5. SUCCESS CRITERIA` section was added stating when a command produced through this packet is complete. The entry states no migration is required because authoring workflow, rules and references are unchanged.

### v1.0.0.0 (2026-07-06) - `v1.0.0.0.md`

Initial tracked release of `create-command`, described in `v1.0.0.0.md` as one of the ten workflow packets in the `sk-doc` parent hub's workflow-only architecture. The packet scaffolds and refactors OpenCode slash commands under `.opencode/commands/`, covering command-type selection, frontmatter (`description`, `argument-hint`, `allowed-tools`), mandatory input gates for required arguments, argument dispatch, `:auto` and `:confirm` mode routing, and the thin-router plus presentation-asset split for larger mode-based commands. The primary contract is a 13-step creation workflow running from deciding whether a command is warranted through resolving the invocation path, reading existing files first, classifying the command type, choosing the output package shape, authoring frontmatter, adding mandatory gates, writing the body, implementing argument dispatch and mode routing, enforcing router and presentation separation, adding destructive-action safety, and validating before delivery. Rules cover least-privilege `allowed-tools`, mandatory gates for required arguments and keeping presentation text out of thin routers, with escalation conditions for unclear invocation contracts. Five reference files shipped (`references/README.md`, `worked-example.md`, `router-presentation-split.md`, `argument-hints-and-modes.md`, `common-pitfalls.md`) plus two assets at `assets/command/command-template.md` and `assets/command/command-presentation-template.md`. The entry records the packet as lean and self-contained with no packet-local `graph-metadata.json`, because the single advisor identity lives at the `sk-doc` hub root. Its spec folder is given as `.opencode/specs/skilled-agent-orchestration/125-sk-doc-parent`. No migration required.

---

## 2. FACTS THE V4 DRAFT GETS WRONG OR MISSES

- MISS: the draft never names `sk-create-command` or `/create:command` anywhere in its 463 lines. Line 132 lists seven nested packets by name (`sk-create-skill`, `sk-create-readme`, `sk-create-agent`, `sk-create-diff`, `sk-create-changelog`, `sk-create-repo-rule`, `sk-create-quality-control`) and folds the rest into "and the rest", so the command-authoring mode is invisible to a reader scanning for it. `v1.0.0.0.md` establishes it as a first-class workflow packet with its own 13-step contract, and `mode-registry.json` line 185 binds it to `/create:command`.
- MISS: none of the packet's authoring capabilities reach the draft. `v1.0.0.0.md` documents the thin-router plus presentation-asset split, the mandatory input gates for required arguments, least-privilege `allowed-tools` and `:auto` / `:confirm` mode routing as the packet's core rules. The draft describes the router and presentation split only as something that happened to one command, `/prompt:improve` at line 361, and never says the repo has a mode that produces that shape on demand.
- POSSIBLY STALE: `v1.0.0.0.md` calls create-command one of "the ten workflow packets" in `sk-doc`. Draft line 132 says fourteen nested packets, twelve of them command-bound. The draft matches the shipped `mode-registry.json` (14 mode entries, 2 with `"command": null`), so the count in the changelog entry is the stale one and the draft is right here. Recorded so a later editor does not "correct" the draft down to ten.
- MOVED PATH not recorded anywhere: `v1.0.0.0.md` lists the packet's assets at `assets/command/command-template.md` and `assets/command/command-presentation-template.md`. The shipped tree has them one level up at `assets/command-template.md` and `assets/command-presentation-template.md`, plus three files no changelog entry mentions: `assets/command-router-template.md`, `assets/command-contract.json` and `assets/command-contract.schema.json`. No entry after v1.0.0.0 records the move or the additions, and the draft does not either.
- MISS: `v1.0.1.0.md` records the `SMART_ROUTING` to `SMART ROUTING` section rename driven by the canonical section matcher and the shared skill packager's required-section contract. The draft discusses hub routing and drift checks at lines 132 and 134 but never mentions the section-contract enforcement that reshaped mode SKILL.md files across the family.
- MISS: `v1.0.1.1.md` records the packet's deliberate use of flat resources instead of keyed runtime discovery. The draft says nothing about this design choice for nested modes.
- NOT WRONG, confirmed: draft line 136 says "The `/create:*` command family itself is untouched." Nothing in the four entries contradicts this for `/create:command`, which is unrenamed across all four.

---

## 3. CURRENT VERSION AND IDENTITY

- Version in `SKILL.md` frontmatter: `1.0.2.0` (matches the newest changelog entry `v1.0.2.0.md`).
- Frontmatter `name`: `sk-create-command`. Frontmatter `allowed-tools`: `[Read, Write, Edit, Bash, Grep, Glob]`.
- Identity: a MODE, not a hub and not standalone. There is no `mode-registry.json` at `.opencode/skills/sk-doc/sk-create-command/`, and no JSON metadata file of any kind at that root. The parent `.opencode/skills/sk-doc/` carries `mode-registry.json`, `hub-router.json`, `graph-metadata.json` and `description.json`, which is the parent-hub signature. The parent registry declares the mode at `mode-registry.json` lines 164 to 195 with `"workflowMode": "sk-create-command"`, `"packetKind": "workflow"`, `"backendKind": "template-scaffold"` and `"command": "/create:command"`.
- Consistent with the entries: `v1.0.0.0.md` states the packet carries no packet-local `graph-metadata.json` because the single advisor identity lives at the `sk-doc` hub root, and `SKILL.md` repeats that instruction in its opening prose.
