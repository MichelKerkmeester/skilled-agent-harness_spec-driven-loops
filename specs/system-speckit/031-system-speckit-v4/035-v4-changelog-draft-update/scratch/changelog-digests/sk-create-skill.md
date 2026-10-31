# sk-create-skill changelog digest

Skill path: `.opencode/skills/sk-doc/sk-create-skill/`
Versions covered: v1.0.0.0 through v1.2.0.0 (all three entries in `changelog/`, fewer than ten exist)
Date range: v1.0.0.0 carries no release date. v1.1.1.0 released 2026-08-04 and v1.2.0.0 released 2026-08-05.

---

## Per-version digest, newest first

### v1.2.0.0 - README template descriptive-voice revision (`v1.2.0.0.md`)

The README templates this packet hands to authors were producing thin reference cards instead of the narrative the repo root README delivers, so this release retuned the templates rather than the READMEs they had already produced. The OVERVIEW prose ceiling went up and now demands a three to six sentence problem narrative that puts the reader in a concrete failing situation before the solution appears, with a worked example shipped in the scaffold as a deletable comment. The capability section gained a required prose lead-in plus permission for one clarifying analogy, the HOW IT WORKS connection diagram was promoted from optional to expected for any multi-step skill with an ASCII stub in the scaffold, and an optional Why It Matters value beat with benefit-first outcome bullets was added inside OVERVIEW. A 2 to 3 sentence narrative hook is now allowed after the blockquote pitch while AT A GLANCE stays the first numbered section so the validator contract holds, and the one-idea-per-sentence rule was clarified to govern clarity rather than length. The same changes were mirrored into the parent-hub template. `skill-readme-template.md` went from 1.9.0.0 to 1.10.0.0 and `parent-skill-readme-template.md` went from 1.0.0.0 to 1.1.0.0, and two validation-checklist rows were added so a thin README fails the author self-check. The entry states explicitly that the Human Voice Rules hard blockers, `SKILL.md`, the reference-file template, the scripts and the mode registries were all untouched, and that no shipped README was rewritten.

### v1.1.1.0 - README rewrite (`v1.1.1.0.md`)

The packet's own README was rewritten purpose-first onto the refined README template: a one-line pitch, a problem-first OVERVIEW, numbered ALL-CAPS sections with dividers and a capability table for the two workflow modes. The old layout opened with a tabular AT A GLANCE and no human entry point, which forced anyone learning the skill from the README to assemble the story themselves. Every fact the old README carried survived the rewrite, including both modes, the validation and packaging gate, the legacy and ready compiled-routing shapes, the quick start commands, the troubleshooting rows, the FAQ answers, the verification rows and the related document links. The frontmatter version moved from 1.1.0.1 to 1.1.1.0. The entry records that `SKILL.md`, the templates, the scripts, the references and the assets were untouched and that the change is documentation-only with no migration.

### v1.0.0.0 - initial release (`v1.0.0.0.md`)

Initial release of `create-skill` as the skill-authoring workflow packet of the `sk-doc` parent hub, described in the entry as a ten-packet workflow-only architecture. The packet scaffolds, authors and validates OpenCode skill packages under `.opencode/skills/` through two workflow modes: `create-skill` for a standalone skill with its own advisor identity, and `create-skill-parent` for a parent hub that dispatches to nested workflow or surface packets. `SKILL.md` is the executable contract and carries route selection between the two modes, the ordered standalone steps (plan resource placement, scaffold with `init_skill.py`, author `SKILL.md`, `README.md`, `references/` and `assets/`, then validate) and the parallel parent-hub steps covering hub root files, nested-packet shape and the `mode-registry.json` and `hub-router.json` rules. References shipped for the standalone path (`skill/creation-workflow.md`, `skill/examples-and-maintenance.md`), for shared concerns (`shared/overview.md`, `shared/common-pitfalls.md`, `shared/validation-and-packaging.md`) and for the parent path (`parent-skill/parent-skills-nested-packets.md`, `parent-skill/parent-hub-router-schema.md`). Assets shipped as copy-from templates for both paths, and scripts shipped as `init_skill.py` for scaffolding plus `package_skill.py` as the validation and packaging gate (`--check` for structure and frontmatter, plain run to zip for distribution). The entry notes that this nested packet carries no `graph-metadata.json` of its own, because the single advisor identity and both `mode-registry.json` entries live at the `sk-doc` hub root.

No entry in this changelog uses BREAKING, RENAME or REMOVED. All three releases are additive or documentation-only by their own statements.

---

## Facts the v4 draft gets wrong or misses

- Draft line 132 calls the `sk-doc` family "fourteen nested `sk-create-*` workflow packets". `v1.0.0.0.md` states that `sk-create-skill` is one packet serving two workflow modes, `create-skill` and `create-skill-parent`, and that both `mode-registry.json` entries live at the hub root. Fourteen is the mode count, not the packet count, so the draft sentence conflates modes with packets.
- Draft line 132 does not carry the fact that the packet has no `graph-metadata.json` of its own and inherits the hub's single advisor identity, which `v1.0.0.0.md` calls out explicitly in its Notes section. The draft describes the routing shape without the identity rule that makes a nested packet different from a standalone skill.
- The draft never mentions the README authoring-quality work that is the entire content of `v1.1.1.0.md` and `v1.2.0.0.md`. The template revision in `v1.2.0.0.md` changes what `/create:skill` and `/create:skill-parent` produce for every future author (problem narrative required, connection diagram expected, two new validation-checklist rows), which is a user-visible behavior change in the scaffolding output that the draft's account of the tooling at lines 132 to 134 does not reflect.
- Draft line 134 says the tooling stamps out "the `mode-registry.json` and `hub-router.json` router files, the packets, the README, the agent mirrors and a routing-drift check". `v1.0.0.0.md` confirms the two router files and the README templates only. Agent mirrors and the routing-drift check appear in no changelog entry, so the draft claim is unverified against this changelog.
- Draft line 447 points readers at `sk-create-skill/references/skill/upgrading-a-skill-to-v4.md` for the single-to-parent migration. No changelog entry records that reference being added. The reference list in `v1.0.0.0.md` names six reference files and this is not one of them, so the changelog is stale rather than the draft being wrong.

---

## Current version and identity

- Version in `SKILL.md` frontmatter: `1.2.0.0`, matching the newest changelog entry.
- Identity: a nested workflow **mode** packet, not a hub and not standalone. The packet root holds no `mode-registry.json`, no `hub-router.json`, no `description.json` and no `graph-metadata.json`. The parent at `.opencode/skills/sk-doc/` holds all four, and its `mode-registry.json` registers this packet twice, once as `sk-create-skill` and once as `sk-create-skill-parent`, both with `packet: sk-create-skill`.
