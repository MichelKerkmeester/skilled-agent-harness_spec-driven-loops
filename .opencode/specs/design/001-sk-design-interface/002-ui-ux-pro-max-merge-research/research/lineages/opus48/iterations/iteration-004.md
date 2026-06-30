# Iteration 004 — Licensing & attribution path (Q3) + negative-knowledge consolidation

**Lineage:** opus48 (claude-opus-4-8 xhigh) · **Iteration:** 4 of 5 · **Status:** complete · **newInfoRatio:** 0.5

## Focus

The licensing/attribution path for combining the MIT `ui-ux-pro-max` content into the Apache-2.0 house skill (Q3), and consolidation of ruled-out directions (part of Q5).

## Actions Taken

1. Confirmed external license: MIT, "Copyright (c) 2024 Next Level Builder." [SOURCE: file:external/.../LICENSE:1-3]
2. Confirmed house license: Apache-2.0 (vendored Anthropic frontend-design), with `license:` frontmatter + `LICENSE.txt`. [SOURCE: file:.opencode/skills/sk-design-interface/LICENSE.txt:2-3] [SOURCE: file:.opencode/skills/sk-design-interface/SKILL.md:6-9]
3. Surveyed the framework for existing license/attribution precedent. [SOURCE: file:.opencode/skills/*/LICENSE* — only sk-design-interface ships one]

## Findings

**F14 — License compatibility is clean; MIT → Apache-2.0 combination is permitted with no copyleft trap.** Both MIT and Apache-2.0 are permissive. MIT-licensed material may be incorporated into a larger work that also contains Apache-2.0 material; neither imposes a share-alike obligation. The result is a **mixed-license skill**: adopted ui-ux-pro-max files (data CSVs + adapted search scripts) stay under MIT; the existing `design_principles.md` stays Apache-2.0. There is no need to relicense the Anthropic content and no conflict to resolve. [SOURCE: file:external/.../LICENSE:5-13] [SOURCE: file:.opencode/skills/sk-design-interface/LICENSE.txt:2]

**F15 — MIT's only real obligation is notice retention.** MIT requires the copyright + permission notice "be included in all copies or substantial portions of the Software." Concrete obligations for the merge:
1. Ship the MIT license text alongside the existing Apache `LICENSE.txt` — e.g. `LICENSE-ui-ux-pro-max.txt` (the verbatim MIT text incl. the NextLevelBuilder copyright line).
2. Add a `THIRD-PARTY-NOTICES.md` mapping which files are MIT-derived (the adopted `assets/data/*.csv` and `scripts/design_search*.py`) vs Apache-2.0 (the design principles content).
3. Because the scripts are *adapted* (renamed, re-rooted, trimmed — F11) and CSVs may be trimmed, label them "adapted from ui-ux-pro-max" — MIT permits modification; the label keeps provenance honest.
4. Add a short per-file provenance header to the adapted scripts noting MIT origin + upstream URL. [SOURCE: file:external/.../LICENSE:5-13]

**F16 — Extend the framework's existing precedent rather than invent one.** `sk-design-interface` is the *only* house skill that already ships a `LICENSE.txt` and a `license:` frontmatter field — created precisely to attribute vendored Anthropic content. The merge extends that same pattern: update the `license:` frontmatter to declare the mixed licensing, e.g. `license: Apache-2.0 (design principles) + MIT (design data & search; see THIRD-PARTY-NOTICES.md)`, and update `metadata.source` to also credit `https://github.com/nextlevelbuilder/ui-ux-pro-max-skill` (MIT, v2.5.0). No new framework-wide mechanism is needed. [SOURCE: file:.opencode/skills/sk-design-interface/SKILL.md:6-9]

**F17 — One low-risk provenance caveat.** The CSV *content* is the upstream author's compilation, covered by their MIT grant. Font-family names, WCAG figures, and HIG/Material rule statements within the rows are facts/standards, not separately licensable. `google-fonts.csv` (the one row-set that most resembles an external catalog) is already SKIP-from-inline (F8), so no additional third-party-license exposure is introduced. Risk: low; no extra clearance required for the adopted set.

## Questions Answered

- **Q3:** Licensing path specified — MIT⊕Apache-2.0 mixed-license skill; retain MIT notice via `LICENSE-ui-ux-pro-max.txt` + `THIRD-PARTY-NOTICES.md`, per-file provenance headers on adapted scripts, updated `license:`/`metadata.source` frontmatter, "adapted from" labels. No relicensing, no copyleft. (F14–F17)

## Consolidated Negative Knowledge (ruled-out directions)

| # | Ruled out | Reason | Iter |
|---|---|---|---|
| 1 | Lift the published SKILL.md verbatim | RN-specialized + ~660L; breaks lean house convention | 1 |
| 2 | Trust the repo's headline asset counts | Drift from data + internally inconsistent; regenerate from CSVs | 1 |
| 3 | Wire `design_system.py --design-system` as the default flow | Auto-emits "use-this" systems = the templated defaults the skill resists | 2 |
| 4 | Import 16 `stacks/*.csv` into sk-design-interface | Overlaps/cross-cuts `sk-code` ownership | 2 |
| 5 | Inline `google-fonts.csv` (1922 rows) | Lookup index, not design judgment; reference/query only | 2 |
| 6 | New top-level `data/` dir | No house skill uses one; use `assets/data/` | 3 |
| 7 | Inline adopted rules into SKILL.md | Exceeds largest house SKILL.md; route to references + script | 3 |
| 8 | Adopt `design_system.py` wholesale (1148L) | Generator + persistence beyond a design skill; philosophy-conflicting | 3 |
| 9 | Adopt the 6 sibling sub-skills + CLI + marketplace + platform configs | Distribution/consumer packaging, out of scope | 1 |

## Questions Remaining

- Q5 (final merge recommendation + concrete first steps per ADOPT/ADAPT class; cross-lineage cross-check framing).

## Dead Ends / Ruled Out (this iteration)

- **Relicensing the Anthropic Apache-2.0 content to MIT (or vice-versa)** — ruled out and unnecessary: permissive licenses coexist file-by-file; a mixed-license skill with clear per-file notices is the correct, lower-effort path. [SOURCE: file:external/.../LICENSE]

## Next Focus

Iteration 5: Consolidate the full Merge Recommendation (per-asset-class verdict table + integration design + licensing), enumerate one concrete first integration step per ADOPT/ADAPT class, and frame the cross-lineage cross-check (where the opus48 line is confident vs where the gpt55fast line may diverge).
