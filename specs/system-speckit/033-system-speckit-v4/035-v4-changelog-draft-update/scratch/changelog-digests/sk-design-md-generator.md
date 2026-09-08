# sk-design-md-generator changelog digest

Skill path: `.opencode/skills/sk-design/sk-design-md-generator/`. Versions covered: v1.0.0.0 to v1.1.0.0 (the whole changelog, only two entries exist). Date range: 2026-06-21 for v1.0.0.0. The v1.1.0.0 entry carries no release date in its frontmatter or body.

---

## Per version, newest first

### v1.1.0.0

From `v1.1.0.0.md`. A documentation-only release that rewrote the mode's `README.md` purpose-first, following the refined skill README template out of the skill-readme refinement packet. The front door now opens with a one-line pitch in a blockquote under the H1 stating the delivered outcome before naming any tool, then a problem-first OVERVIEW carrying Why This Skill Exists, What It Does, The Cardinal Rule, The Design-System Knowledge Layer and The Authoring Boundary, then numbered ALL-CAPS H2 sections with dividers, AT A GLANCE first and a QUICK START that shows expected outputs for every command. A new capability section names what the mode operates on at the file and data level: `tokens.json`, the value-bearing sections, prose authorship and fidelity validation. A voice pass confirmed zero hits for em dashes, semicolons, Oxford commas and banned words in the README body. The `README.md` frontmatter version moved from `1.0.0.0` to `1.1.0.0`. The entry states explicitly that `SKILL.md` stays at `1.0.2.0`, that no skill file, reference set, feature-catalog card, playbook scenario or backend module moved, that the released `v1.0.0.0` entry stays byte-identical, and that no vault, plugin or runtime data was touched. No rename, removal, moved path, changed default or breaking change is recorded.

### v1.0.0.0

From `v1.0.0.0.md`, released 2026-06-21. The first stable release of the skill, described there as `md-generator`, a standalone skill and not yet a mode. It captures a live website's real measured CSS into a publication-quality v3 Style Reference `DESIGN.md` so agents build against ground truth instead of hallucinating colours, fonts, spacing and shadows. The release embedded the working tool under `backend/`: 20 TypeScript pipeline modules plus a vitest suite in `backend/tests/`, 8 knowledge docs in `references/`, and gold-standard v3 `DESIGN.md`, `tokens.json` and `writing-notes.md` sets for stripe, vercel, linear and supabase in `references/examples/`. The pipeline runs three phases. Extract drives a Playwright crawler that samples five viewports and emits a verbatim `tokens.json`. Write composes the v3 Style Reference with value-bearing sections pre-rendered deterministically and prose written from a FACTS block, copying every numeric value verbatim. Validate runs `validate.ts` against hex accuracy, v3 section completeness and Quick-Start fidelity. `SKILL.md` routes the three phases plus a report path and an example-study path, and encodes the cardinal verbatim-value rule, 6-digit lowercase hex and the L1 to L4 stability gates. `references/extraction-workflow.md` and `references/troubleshooting.md` were added for framework-specific guidance and failure modes, and `INSTALL-GUIDE.md` documents the one-time `cd backend && npm install && npx playwright install chromium` setup. REMOVED: the regenerable example HTML reports, roughly 2 MB, were trimmed to keep the skill lean. Advisor registration landed as a skill-root `graph-metadata.json` declaring family `sk-code` and category `design`, with reciprocal sibling edges to `sk-design-interface`, `mcp-figma` and `mcp-open-design`, plus an `enhances` edge to `sk-code`.

---

## Facts the v4 draft gets wrong or misses

Compared against `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md`.

- Corroborated, not wrong. Draft line 268 says the mode "was a standalone skill and came back as a mode". `v1.0.0.0.md` supports this: it describes a standalone skill carrying its own root `graph-metadata.json` advisor registration, sibling to `sk-design-interface` and the `mcp-figma` and `mcp-open-design` transports.
- Corroborated, not wrong. Draft line 268 says the mode "validates one you already have". `v1.0.0.0.md` confirms a distinct validate phase run by `validate.ts` checking hex accuracy, v3 section completeness and Quick-Start fidelity.
- Missed detail. Neither draft line 268 nor 288 records the measurement mechanics the mode's identity rests on: a Playwright crawler sampling five viewports into a verbatim `tokens.json` and the cardinal rule that every hex, pixel, font-weight, shadow and radius must be copied verbatim from it. `v1.0.0.0.md` states both. Draft line 282 leans on `DESIGN.md` being "measured" without ever saying what does the measuring.
- Unverifiable from these entries. Draft line 288 claims the md generator "carries a private layer of procedure cards for its extraction work, each step pointing at its own card". No changelog entry records procedure cards. The `procedures/` directory exists at the mode root, so the claim may still be true, but it is undocumented in the mode's own changelog and cannot be confirmed from it.
- Missed release. The draft never mentions v1.1.0.0. That is defensible for release notes since v1.1.0.0 is a README rewrite with no behavior change, but it means the draft's account of the mode stops at its 2026-06-21 state.
- Version inconsistency the draft does not surface, and does not need to. `v1.1.0.0.md` states `SKILL.md` deliberately stays at `1.0.2.0` while `README.md` and the changelog move to `1.1.0.0`, so the mode ships two divergent version numbers. The draft cites no version numbers, so this is not a draft error.
- No factual error found in draft lines 31, 261, 268, 280, 282 or 288 that these two entries contradict.

---

## Current version and identity

`SKILL.md` frontmatter version: `1.0.2.0`. Note the split: `README.md` frontmatter and the newest changelog entry both read `1.1.0.0`, and `v1.1.0.0.md` says the `SKILL.md` value was left behind on purpose.

Identity: a MODE, not a hub and not standalone. `sk-design-md-generator/` holds no `mode-registry.json` and no `graph-metadata.json` of its own. Its parent `.opencode/skills/sk-design/` holds `mode-registry.json`, `hub-router.json`, `graph-metadata.json` and `description.json`, which is the parent-hub metadata set. The parent's `mode-registry.json` lists `sk-design-md-generator` as a `workflowMode` and as a `packet` with `packetSkillName` `sk-design-md-generator`, and `hub-router.json` routes to `sk-design-md-generator/SKILL.md`. The mode is reached through `/design:extract`.
