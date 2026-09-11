# Changelog digest: sk-design-diagram

Skill path: `.opencode/skills/sk-design/sk-design-diagram/` (changelog at `changelog/`). Versions covered: v1.0.0.0 only, the sole entry in the directory. Date range: 2026-08-12 to 2026-08-12.

---

## Per-version digest (newest first)

### v1.0.0.0 (`v1.0.0.0.md`, released 2026-08-12)

The initial release. Per `v1.0.0.0.md`, the mode was forked from the third-party `diagram-design` plugin (cathrynlavery/diagram-design) and rebuilt against the `sk-create-skill` authoring contract rather than copied over. It shipped as a nested `sk-doc` workflow mode with `SKILL.md` restructured into the mandatory WHEN TO USE / SMART ROUTING / HOW IT WORKS / RULES / SUCCESS CRITERIA / REFERENCES order with all five connector rules intact, the shared editorial design system (`references/foundations/style-guide.md`, `onboarding.md`, `output-spec.md`) plus four primitives (annotation callout, sketchy filter, terminal chrome, icon library), all 27 diagram-type references under `references/types/type-*.md` each with a canonical example asset, and draw.io and Mermaid extraction via the stdlib-only `scripts/drawio_extract.py` and `scripts/mermaid_extract.py` alongside their redraw references and `references/import-export/export.md`. Registration covered `mode-registry.json`, `hub-router.json`, `command-metadata.json` and the slash command.

REMOVED: the source plugin's multi-variant example gallery (light, dark and full per type) was trimmed to one canonical example per type plus a small set of special-pattern examples, and the source's own CI and lint tooling was not ported because it validates the upstream release process rather than this packet's runtime content. Trim manifest and rationale live in `specs/sk-doc/028-sk-design-diagram/001-inventory-and-skill-contract/decision-record.md` per `v1.0.0.0.md`.

---

## Facts the v4 draft gets wrong or misses

Draft read: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md` (463 lines).

- The changelog stops at v1.0.0.0. Everything the draft attributes to this mode beyond the initial fork has no changelog entry at all. `v1.0.0.0.md` describes a nested `sk-doc` workflow mode. The move into the `sk-design` hub, the rename, the ASCII capability and the screenshot library are all unlogged. Draft lines 270 and 272 present that later state as fact with no changelog behind it.
- RENAME: the draft at line 272 says the mode used to live under sk-doc as `sk-create-diagram`, which matches the historical folder `.opencode/skills/sk-doc/sk-create-diagram/`, but `v1.0.0.0.md` names the packet `create-diagram` throughout its title, heading and prose. The draft's name is the folder name and the changelog's is the packet label, so a reader matching one against the other will not find a match.
- The current `v1.0.0.0.md` in the tree says registration included "the `/design:diagram` command". The entry as originally committed (commit `3e322127310`) said `/create:diagram`. The v1.0.0.0 entry was retro-edited during the migration, so it now describes an August release using post-migration command naming. The draft's rename list at line 443 covers `/interface:*` to `/design:diagram` but not `/create:diagram` to `/design:diagram`, which is the transition this entry actually underwent.
- Draft line 270 credits the mode with "ASCII and Markdown flowcharts". `v1.0.0.0.md` mentions no ASCII path whatsoever. That capability arrived later, by the merge of `sk-create-flowchart` (commit `70443c0ece5`), and was never given a changelog entry. The draft is correct about the current state and the changelog is silent on it.
- Draft line 270's count of 27 diagram types is consistent with `v1.0.0.0.md` and with the tree (28 files under `references/types/`, of which one is `README.md`). No discrepancy.
- Draft line 272 claims every form the two canvas modes ship has a rendered screenshot kept beside its mode. A `screenshots/` directory does exist at the mode root, but no changelog entry records it, so the claim is unverifiable from these entries.

## Current version and identity

`SKILL.md` frontmatter declares `version: 1.0.0.0`, matching the single changelog entry. Identity: a MODE, not a hub and not standalone. Its own root carries no `mode-registry.json`, `description.json` or `hub-router.json`. Its parent `.opencode/skills/sk-design/` carries `mode-registry.json`, `hub-router.json`, `description.json`, `graph-metadata.json` and `leaf-manifest.json`, and that registry lists `sk-design-diagram` as a `workflowMode` and as a `packet` (lines 89, 107 and 108). The mode sits under the `sk-design` parent hub alongside `sk-design-chart`, `sk-design-fundamentals` and `sk-design-md-generator`.
