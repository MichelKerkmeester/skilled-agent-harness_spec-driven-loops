---
title: Deep Research Strategy — opus48 lineage
description: Session tracking for the ui-ux-pro-max → sk-design-interface merge research (claude-opus-4-8 lineage).
trigger_phrases:
  - "ui-ux-pro-max merge strategy"
  - "sk-design-interface merge research strategy"
importance_tier: normal
contextType: planning
---

# Deep Research Strategy — opus48 lineage

Runtime tracking for the `opus48` fan-out lineage (`cli-claude-code` / `claude-opus-4-8` xhigh). Sibling lineage: `gpt55fast`.

## 1. OVERVIEW

Research-only investigation: can the vendored MIT `ui-ux-pro-max-skill-main` repo (data, scripts, patterns) merge into and improve the Apache-2.0 house `sk-design-interface` skill — what to ADOPT/ADAPT/SKIP, how to integrate into house structure, and the licensing path. No edits to `sk-design-interface` in this packet.

---

## 2. TOPIC

ui-ux-pro-max merge into sk-design-interface — per-asset-class adopt/adapt/skip verdict, integration design, license/attribution path, and cross-lineage cross-check.

---

## 3. KEY QUESTIONS (remaining)
- [x] Q1: Which asset classes are ADOPT vs ADAPT vs SKIP, and why? (R1) — answered iter 1/2/5
- [x] Q2: Concrete integration design into the house structure? (R2) — answered iter 3
- [x] Q3: Licensing/attribution path for MIT into Apache-2.0? (R3) — answered iter 4
- [x] Q4: How do the recommendation assets reconcile with the anti-default philosophy? (R4) — answered iter 2
- [x] Q5: Negative knowledge + concrete first integration steps? (R5) — answered iter 4/5

All key questions answered. No questions remaining within lineage scope.

---

## 4. NON-GOALS
- Implementing the merge / editing `sk-design-interface` (separate follow-up packet).
- The standalone `mcp-magicpath` skill and CLI (packet 147).
- Re-deriving the external repo's data; it is taken as given input.
- Auditing the external repo's data for factual correctness of every row (spot-checks only).

---

## 5. STOP CONDITIONS
- All 5 key questions answered with evidence and cited sources.
- A per-asset-class ADOPT/ADAPT/SKIP table exists with integration design + licensing path.
- newInfoRatio across recent iterations falls below the convergence threshold (0.05) with quality guards satisfied, OR maxIterations (5) reached.

---

## 6. ANSWERED QUESTIONS
- Q1 (iter 1/2/5): Per-asset-class ADOPT/ADAPT/SKIP table complete (see research.md Merge Recommendation).
- Q4 (iter 2): Reconciled — adopt objective quality-floor data outright; adopt recommendation data only reframed as an inventory to critique against, never as an authoritative generator.
- Q2 (iter 3): `assets/data/` for CSVs, `scripts/` for adapted search, two new `references/` docs, lean SKILL.md routing block, scoped advisor routing, Python3 prereq.
- Q3 (iter 4): Mixed-license skill; retain MIT notice (`LICENSE-ui-ux-pro-max.txt` + `THIRD-PARTY-NOTICES.md`), per-file provenance, updated frontmatter; no relicensing/copyleft.
- Q5 (iter 4/5): Negative knowledge consolidated; one concrete first step per ADOPT/ADAPT class; cross-lineage divergence framed.

---

<!-- MACHINE-OWNED: START -->
## 7. WHAT WORKED
- Direct file/CSV inspection with measured row counts (iter 1): exposed the marketing-number drift and grounded every verdict in ground truth.
- Splitting "the data" into quality-floor vs recommender classes (iter 2): the move that resolved the central philosophy tension.
- Measuring house conventions before proposing placement (iter 3): turned "where should it go" into an evidence-backed answer (`assets/data/`, not `data/`).
- Anchoring licensing on the existing `sk-design-interface` LICENSE precedent (iter 4): avoided inventing a new mechanism.

## 8. WHAT FAILED
- (No failed approaches.) The investigation is codebase-internal; every question was answerable from local source. No web/external dependency, no dead tooling.

---

## 9. EXHAUSTED APPROACHES (do not retry)
[None — no approach was tried-and-blocked; all foci were productive.]

---

## 10. RULED OUT DIRECTIONS
- Lift the published SKILL.md verbatim — RN-specialized + ~660L (iter 1).
- Trust the repo's headline asset counts — drift + internally inconsistent (iter 1).
- Wire `design_system.py --design-system` as default flow — manufactures templated defaults (iter 2).
- Import 16 `stacks/*.csv` into the design skill — overlaps `sk-code` (iter 2).
- Inline `google-fonts.csv` (1922 rows) — lookup index, reference/query only (iter 2).
- New top-level `data/` dir — use `assets/data/` (iter 3).
- Inline adopted rules into SKILL.md — exceeds largest house SKILL.md (iter 3).
- Adopt `design_system.py` wholesale (1148L) — generator+persistence beyond scope (iter 3).
- Adopt sibling sub-skills / CLI / marketplace / platform configs — distribution packaging (iter 1).
- Relicense Apache↔MIT — unnecessary; permissive licenses coexist file-by-file (iter 4).

---

## 11. NEXT FOCUS
COMPLETE — converged at maxIterations (5); all key questions answered. Exited to synthesis (`research.md`). Cross-lineage reconciliation with `gpt55fast` is the merge stage's job.

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

**External repo** `.opencode/specs/.../143-sk-design-interface/external/ui-ux-pro-max-skill-main/` (MIT, NextLevelBuilder, v2.5.0):
- `src/ui-ux-pro-max/data/`: 14 top-level CSVs + `stacks/` (16 stack CSVs). Measured row counts (data rows = lines−1): styles 84, colors 160, typography 73, ui-reasoning 161, ux-guidelines 98, charts 25, products 161, landing 33, icons 104, google-fonts 1922, react-performance 44, app-interface 29, design 1774, draft 1777.
- `src/ui-ux-pro-max/scripts/`: `core.py` (262L; zero-dep BM25 + regex hybrid search), `search.py` (114L CLI), `design_system.py` (1148L; multi-domain aggregation + reasoning + Master/Overrides persist).
- `src/ui-ux-pro-max/templates/`: `base/` (skill-content.md, quick-reference.md) + `platforms/` (18 platform installer JSON configs).
- `cli/`: `uipro-cli` npm/TS installer (distribution plumbing, ~564KB bundled assets).
- `.claude-plugin/`: marketplace.json + plugin.json (Claude marketplace publishing).
- `.claude/skills/`: 7 sub-skills (ui-ux-pro-max, design, banner-design, ui-styling, brand, slides, design-system) — symlinks to `src/`.
- Published SKILL.md (~660L): large; embeds a 10-category Quick Reference duplicating ux-guidelines.csv; workflow examples are React-Native-specialized ("React Native (this project's only tech stack)").
- License: MIT. skill.json marketing numbers (67 styles / 15+ stacks) and SKILL.md numbers (50+ styles / 161 palettes / 57 pairings / 161 products / 99 UX / 25 charts / 10 stacks) DRIFT from measured data — do not propagate.

**Target skill** `.opencode/skills/sk-design-interface/` (Apache-2.0, vendored Anthropic frontend-design, v1.0.0):
- Lean: SKILL.md (187L), references/design_principles.md (87L), README.md (161L), LICENSE.txt, graph-metadata.json.
- Philosophy: distinctive/anti-default visual design; brainstorm→critique→build→self-critique; one justified aesthetic risk; subject-grounded; restraint. Pure prose, no data, no scripts.
- graph-metadata: family `sk-code`; enhances `sk-code`; prerequisite_for `mcp-magicpath`; allowed-tools include Bash.

**Core tension (working hypothesis):** house skill = "avoid templated defaults, make distinctive choices"; external = "recommend best-match popular patterns from a DB." Naive adoption of the recommender could push toward the AI-default looks the house skill warns against. Likely resolution: adopt the data as raw-material reference + objective quality-floor checks (a11y, UX rules, contrast, touch targets), NOT as an authoritative design-picker.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5
- Convergence threshold: 0.05 (research default, newInfoRatio)
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research.md ownership: lineage-local synthesis output (`research/lineages/opus48/research.md`)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11
- Lineage: opus48 (cli-claude-code / claude-opus-4-8 xhigh), generation 1
- Started: 2026-06-13T16:23:52Z
