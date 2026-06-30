---
title: "Research: Merging ui-ux-pro-max into sk-design-interface"
description: "Canonical synthesis of a 10-iteration, parallel-by-model deep-research loop (5x claude-opus-4-8 xhigh + 4x openai/gpt-5.5-fast xhigh) on whether and how the vendored MIT ui-ux-pro-max-skill-main repo can merge into and improve the house sk-design-interface skill. Research-only: produces a merge recommendation; no edits to the skill."
trigger_phrases:
  - "ui-ux-pro-max merge research"
  - "sk-design-interface merge recommendation"
  - "design data merge recommendation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/001-sk-design-interface/002-ui-ux-pro-max-merge-research"
    last_updated_at: "2026-06-13T16:50:00Z"
    last_updated_by: "claude-opus"
    recent_action: "10-iteration parallel-by-model fan-out complete; both lineages merged and cross-checked"
    next_safe_action: "Operator reviews the merge recommendation; if accepted, open a follow-up merge packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-148-002-ui-ux-pro-max-merge-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Research: Merging ui-ux-pro-max into sk-design-interface

> Canonical synthesis of a 10-iteration deep-research loop run as two parallel by-model lineages — `opus48` (`claude-opus-4-8` xhigh, 5 iterations, via cli-claude-code) and `gpt55fast` (`openai/gpt-5.5-fast` xhigh, 4 iterations / converged, via cli-opencode) — over local source only. Both lineage syntheses live under `lineages/{label}/research.md`; this document reconciles them. **Research-only: this produces a recommendation. No file in `.opencode/skills/sk-design-interface/` is changed by this packet.**

---

## 1. Executive Summary

**Verdict: merge worth doing — but asymmetrically, and only the data and search layers.** The vendored `ui-ux-pro-max-skill-main` (MIT, NextLevelBuilder, v2.5.0) is a data-driven design-intelligence repo. Its value to our lean, prose-only `sk-design-interface` (Apache-2.0, ~186-line SKILL.md + one 87-line reference) is concentrated in its CSV data and its zero-dependency search engine. Everything that makes it a *distributable product* — the npm CLI, the Claude marketplace plugin, 18 platform-installer templates, 6 sibling sub-skills, and the ~660-line React-Native-specialized published SKILL.md — is noise for us and is **SKIP**.

The single load-bearing decision, on which both lineages ultimately agree, is **how the data is framed**:

- **Objective quality-floor data** (accessibility / UX / chart / mobile rules with WCAG, Apple-HIG, Material citations) → **ADOPT directly.** It is orthogonal to aesthetics, fills a real gap (the house skill compresses this whole domain into one sentence), and carries zero philosophical conflict.
- **Aesthetic / recommendation data** (styles, colors, type pairings, product-reasoning) → **ADAPT, reframed as an inventory of common/expected patterns to critique against** — never as an authoritative "use this" generator. Adopted naively (the upstream `--design-system` default), it would manufacture exactly the templated AI-default looks the house skill exists to resist.

Licensing is clean: MIT material combines into the Apache-2.0 skill as a **mixed-license skill** with notice retention only — no relicensing.

**The actual merge is a separate follow-up packet.** This research scopes and de-risks it.

---

## 2. Method & Provenance

| Item | Value |
| --- | --- |
| Loop | 10 iterations total, 2 parallel by-model lineages, concurrency 2, local source only (no web) |
| `opus48` | `cli-claude-code` / `claude-opus-4-8` xhigh — 5/5 iterations, stopped at maxIterations (newInfoRatio 1.00→0.35, descending, not yet < 0.05) |
| `gpt55fast` | `cli-opencode` / `openai/gpt-5.5-fast` xhigh — 4/5 iterations, **converged** (newInfoRatio 0.90→0.03 < 0.05 threshold) |
| Runtime | `fanout-run.cjs` async pool → per-lineage loops → `fanout-merge.cjs` (2 lineages merged, 0 skipped; 27 key findings, 10 resolved questions, 17 ruled-out) |
| Write path | Both lineages' iteration files were recovered by the framework salvage sweep from CLI stdout (opus48: 5, gpt55fast: 4) — the expected weak-executor write path; no data lost |
| Inputs | `external/ui-ux-pro-max-skill-main/` (data, scripts, templates, CLI, SKILL.md, skill.json, LICENSE, CLAUDE.md); `.opencode/skills/sk-design-interface/`; house skill-dir conventions |
| Counts | Re-measured from the CSVs by the orchestrator (§3) — the repo's own headline numbers are inconsistent and must not be trusted |

---

## 3. Measured asset inventory (ground truth)

Row counts re-measured directly (data rows = lines − header). The repo's marketing numbers drift from its own data.

| Asset | File | Measured rows | Repo claims |
|---|---|---|---|
| UI styles | `styles.csv` | **84** | "67" / "50+" |
| Color palettes | `colors.csv` | **160** | "161" |
| Type pairings | `typography.csv` | **73** | "57" |
| Product-reasoning rules | `ui-reasoning.csv` | **161** | "161" |
| UX guidelines | `ux-guidelines.csv` | **98** | "99" |
| Charts | `charts.csv` | **25** | "25" |
| Product types | `products.csv` | **161** | — |
| Landing patterns | `landing.csv` | **34** | — |
| Icons | `icons.csv` | **104** | — |
| Google Fonts index | `google-fonts.csv` | **1923** | — |
| React performance | `react-performance.csv` | **44** | — |
| App-interface (mobile a11y) | `app-interface.csv` | **29** | — |
| Scratch / working sets | `design.csv` / `draft.csv` | 1774 / 1777 | — |
| Stack guides | `stacks/*.csv` | **16 stacks** | "10" / "15+" |
| BM25 search engine | `scripts/core.py` | 262 L (zero-dep) | — |
| Search CLI | `scripts/search.py` | 114 L | — |
| Design-system generator | `scripts/design_system.py` | 1148 L | — |

Counts re-measured directly from the data files. [SOURCE: file:.opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/styles.csv] [SOURCE: file:.opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/scripts/core.py]

**Implication for any merge:** regenerate every count from the CSVs; never copy the upstream headline numbers into our docs.

---

## 4. The central tension and its resolution (the crux)

`sk-design-interface`'s whole reason to exist is anti-default: *"a design that reads as a templated default has failed,"* and it names the current AI-default clusters to deviate from. [SOURCE: file:.opencode/skills/sk-design-interface/references/design_principles.md] `ui-ux-pro-max` does the opposite by default: `ui-reasoning.csv` literally emits per-product-type best-match answers (e.g. `{"if_checkout":"emphasize-trust","if_hero_needed":"use-3d-hyperrealism"}`), and `design_system.py --design-system` will auto-assemble a "use-this" system. [SOURCE: file:.opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/src/ui-ux-pro-max/data/ui-reasoning.csv] A naive merge bolts a default-generator onto an anti-default skill.

**Resolution (the load-bearing insight): invert the recommendation data's role from *answer* to *inventory + constraint*.** The house process already includes a "critique against the AI-default looks" step. The recommendation data is most valuable as **the catalog of common answers to critique against** ("the cliché for luxury e-commerce is glassmorphism + premium-minimal → now deviate deliberately"). The objective quality-floor data needs no such inversion — it is adopted as-is. This split is what makes the merge safe.

Both lineages reach this resolution; `opus48` framed it most sharply and `gpt55fast` independently states the same guardrail (*"do not use `ui-reasoning.csv` as deterministic truth; it should guide, not override the brief and critique process"*).

---

## 5. Merge Recommendation (reconciled, per asset class)

Verdicts are the reconciliation of both lineages. "Agreement" notes where the lineages aligned vs where the divergence was resolved (see §8).

| Asset class | Verdict | Integration target | Rationale / lineage reconciliation |
|---|---|---|---|
| `ux-guidelines.csv` (98) | **ADOPT** | `assets/data/` + distilled `references/ux_quality_reference.md` | Quality-floor: WCAG/HIG/Material Do/Don't + code + severity. Highest value, lowest risk. (opus48 ADOPT; gpt55fast ADAPT — both want it in, distilled to a checklist.) |
| `charts.csv` (25) | **ADOPT** | `assets/data/` | Chart selection, thresholds, a11y fallbacks. Objective. (Both agree.) |
| `app-interface.csv` (29) | **ADOPT (a11y subset)** | `assets/data/` | Mobile accessibility quality-floor. (opus48 ADOPT; gpt55fast ADAPT — adopt the a11y rows, not as default web guidance.) |
| `react-performance.csv` (44) | **ADAPT** | extract cross-cutting design-quality rows only | Mixed: layout-stability/reduced-motion are design-quality; React-specific perf is implementation (sk-code territory). (Divergence resolved: opus48 ADOPT vs gpt55fast SKIP-direct → take only the design-quality fragments.) |
| `colors.csv` (160) | **ADAPT** | `assets/data/` + token note in `references/design_inventory.md` | Adopt the shadcn-style semantic-token schema + WCAG-pair discipline; frame palettes as "common starts to deviate from." (Both value it; framed as inventory.) |
| `typography.csv` (73) | **ADAPT** | `assets/data/` | A pairings *inventory*, not a chooser. (Both.) |
| `styles.csv` (84) | **ADAPT** | `assets/data/` + cross-link to `design_principles.md` | Inventory of expected looks to deviate from; rich fields (fit, contraindications, a11y, perf). (Both.) |
| `ui-reasoning.csv` (161), `products.csv` (161), `landing.csv` (34) | **ADAPT (cautious)** | `assets/data/` + explicit "critique-against, not use-this" framing | The crux assets — adopt as expected-pattern inventory only. (Divergence resolved toward opus48's cautious framing + gpt55fast's "guide, not truth" guardrail.) |
| `icons.csv` (104) | **SKIP** | — | Phosphor-specific; preserve each app's own icon system. (gpt55fast SKIP; opus48 ADAPT-minor → resolved SKIP.) |
| `scripts/core.py` + `search.py` | **ADAPT (optional)** | `scripts/design_search_core.py` + `scripts/design_search.py` | Zero-dep BM25 over the adopted CSVs. Re-root `DATA_DIR`→`assets/data`, trim `CSV_CONFIG`, drop stack config, add MIT provenance header. Never a *mandatory* runtime step. (Both agree; optional tooling.) |
| `scripts/design_system.py` (1148) | **SKIP (revisit trimmed)** | — | Generator + persistence beyond a design skill; its default flow conflicts with the philosophy. Revisit only as a stripped "show the cliché for X" helper later. (opus48 SKIP; gpt55fast "optional only" → resolved SKIP-for-now.) |
| `stacks/*.csv` (16) | **SKIP** | extract only cross-cutting design-quality fragments | Mostly implementation checklists (React/Next/RN/SwiftUI/Flutter/shadcn/Tailwind/Three.js). Adopt only focus-visibility, touch-target, reduced-motion, semantic-token, chart-theming, canvas-label, layout-stability fragments. **Do not claim `sk-code` already owns these stacks** — it supports Webflow/frontend + OpenCode surfaces and rejects unsupported stacks (gpt55fast correction). |
| `google-fonts.csv` (1923) | **SKIP from inline** | reference/query only if ever | A lookup index, not design judgment. |
| `design.csv` / `draft.csv` (1774 / 1777) | **SKIP** | — | Scratch / working sets. |
| Published SKILL.md (~660 L) + inline Quick Reference | **SKIP as files** (reuse the data) | — | RN-specialized + exceeds the largest house SKILL.md; its content is already adopted via the CSVs. |
| `cli/`, `.claude-plugin/`, `templates/platforms/*.json` (18), 6 sibling sub-skills, `docs/` | **SKIP** | — | Distribution / consumer packaging. Out of scope. |

---

## 6. Integration design (for the follow-up packet)

**Proposed layout** (convention-grounded — `opus48` counted house skills: 0 ship a top-level `data/`, 15 ship `assets/`, 16 ship `scripts/`):

```
sk-design-interface/
  SKILL.md                      (+ ~15-25-line routing section; stays lean, < ~250 L)
  references/
    design_principles.md        (UNCHANGED — remains the primary authority)
    design_inventory.md         (NEW — critique-against framing for the aesthetic data)
    ux_quality_reference.md     (NEW — distilled quality-floor checklist from CRITICAL/HIGH rows)
  assets/data/                  (NEW — adopted CSVs, MIT-licensed)
  scripts/
    design_search.py            (NEW — adapted search.py)
    design_search_core.py       (NEW — adapted core.py, zero-dep BM25)
  LICENSE.txt                   (Apache-2.0, existing)
  LICENSE-ui-ux-pro-max.txt     (NEW — verbatim MIT incl. NextLevelBuilder copyright)
  THIRD-PARTY-NOTICES.md        (NEW — MIT vs Apache-2.0 file map)
```

- **SKILL.md budget:** house SKILL.md range is ~186-466 lines; the external ~660 lines exceeds all. Route to references + script; **never inline the rules** into SKILL.md.
- **Script adaptation is small:** rename, re-root `DATA_DIR`, trim `CSV_CONFIG` to adopted domains, drop the 16-stack config, add a per-file MIT provenance header. Python3 prerequisite is already met framework-wide (skill-advisor, spec-kit scripts).
- **Advisor routing:** extend `graph-metadata.json` `derived.trigger_phrases` / intent signals with "color palette", "font pairing", "chart type", "ux checklist", "design tokens"; add the new `key_files`; **avoid** stack/implementation signals owned by `sk-code`. Keep the existing `enhances sk-code` and `prerequisite_for mcp-magicpath` edges.
- **Alternative considered:** `gpt55fast` proposed nesting everything under `references/design_intelligence/{data,asset-matrix.md,pattern-catalog.md}`. Resolved toward `assets/data/` + `scripts/` because that is the measured house convention; `gpt55fast`'s `asset-matrix.md` / `pattern-catalog.md` naming idea is folded into `design_inventory.md`.

---

## 7. Licensing & attribution path

- **Compatible, no copyleft.** MIT material may be incorporated into the Apache-2.0 skill; the result is a **mixed-license skill** (MIT data + scripts, Apache-2.0 principles). No relicensing.
- **MIT's only obligation is notice retention.** Ship `LICENSE-ui-ux-pro-max.txt` (verbatim MIT incl. the NextLevelBuilder copyright), a `THIRD-PARTY-NOTICES.md` mapping MIT vs Apache files, per-file "adapted from" provenance headers on the scripts, and updated `license:` frontmatter (`Apache-2.0 (principles) + MIT (data & search)`) crediting the upstream repo in `metadata.source`.
- **Extend existing precedent, no new mechanism.** `sk-design-interface` is already the only house skill shipping a `LICENSE.txt` + a `license:` frontmatter field.
- **Low provenance risk.** CSV content is the upstream author's MIT-covered compilation; the facts/standards within rows are not separately licensable. License/notice work becomes **mandatory** the moment substantial MIT content is copied — land it in the same packet.

---

## 8. Cross-lineage reconciliation

**Agreements (high confidence — both lineages independently):**
- The data + search engine are the value; the CLI / marketplace / 18 platform configs / 6 sibling sub-skills / published SKILL.md are SKIP.
- Keep SKILL.md lean; never inline CSVs. Keep `design_principles.md` as the untouched primary authority.
- `ui-reasoning.csv` is guidance, not deterministic truth.
- Scripts must never be a mandatory runtime step; `design_system.py --persist`/`--design-system` is not a house workflow.
- Mixed Apache-2.0 ⊕ MIT is clean; notice-retention only; separate notice files required.
- Phase the merge: references/data first, runtime logic last.

**Resolved divergences:**
1. **Recommender aggressiveness (the crux).** `gpt55fast` leaned to ADOPT the recommendation CSVs more literally; `opus48` insisted on the inventory/critique-against reframing. **Resolved toward `opus48`** — the reframing is what protects the skill's anti-default purpose; `gpt55fast`'s own "guide, not truth" guardrail is consistent with it.
2. **`design_system.py`.** SKIP vs ADAPT-optional → **SKIP for the first merge**, revisit a trimmed helper later.
3. **Layout.** `assets/data/` (convention, evidenced) vs `references/design_intelligence/` → **resolved to `assets/data/` + `scripts/`**.
4. **`react-performance.csv`.** ADOPT vs SKIP-direct → **ADAPT** (extract design-quality rows; leave React implementation-perf to `sk-code`).
5. **`sk-code` stack ownership.** `gpt55fast` corrected an over-broad `opus48` claim — `sk-code` does not own React Native/SwiftUI/Flutter/Three.js today. **Correction adopted.**

---

## 9. Negative knowledge (ruled-out directions)

- Lift the published SKILL.md verbatim — RN-specialized, ~660 L, breaks the lean house convention.
- Trust the repo's headline asset counts — they drift from the data and disagree with each other.
- Wire `design_system.py --design-system` as a default flow — auto-emits the templated defaults the skill resists.
- Import the 16 `stacks/*.csv` wholesale — implementation checklists, not design judgment; and not currently `sk-code`'s.
- Inline `google-fonts.csv` (1923) / scratch `design.csv`+`draft.csv` — lookup/working data, not design judgment.
- New top-level `data/` dir — no house skill uses one.
- Inline adopted rules into SKILL.md — exceeds the largest house SKILL.md.
- Adopt `design_system.py` wholesale (1148 L) — generator + persistence beyond a design skill.
- Adopt the CLI / marketplace / platform configs / 6 sibling sub-skills — distribution packaging.
- Make Phosphor the default icon system — preserve each app's icon system.
- Relicense Apache↔MIT, or collapse both under one unqualified label — unnecessary and incorrect.
- Make `search.py`/`core.py` mandatory runtime steps — keep optional.

---

## 10. Recommended next steps (for operator decision)

1. **Open a follow-up merge packet** (`003-…`) scoped to the §5 ADOPT/ADAPT set only.
2. **Phase it:** (a) quality-floor data + distilled `ux_quality_reference.md` (lowest risk, highest value); (b) adapted zero-dep search script over `assets/data/`; (c) the aesthetic data with the `design_inventory.md` critique-against framing.
3. **Regenerate all counts from the CSVs.**
4. **Stand up the licensing artifacts in the same packet** that first lands MIT files.
5. **Hold the SKIP line** on `design_system.py`, stacks, packaging, and the published SKILL.md.
6. After any real skill change: re-validate the skill, re-run advisor discovery, and check the `enhances`/`prerequisite_for` edges still hold.

---

## 11. References

<!-- ANCHOR:references -->
- **External repo:** `.opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/` (MIT) — `LICENSE`, `skill.json`, `CLAUDE.md`, `.claude/skills/ui-ux-pro-max/SKILL.md`, `src/ui-ux-pro-max/data/*.csv`, `src/ui-ux-pro-max/scripts/{core,search,design_system}.py`. [SOURCE: file:.opencode/specs/design/001-sk-design-interface/external/ui-ux-pro-max-skill-main/skill.json]
- **Target skill:** `.opencode/skills/sk-design-interface/` — `SKILL.md`, `references/design_principles.md`, `graph-metadata.json`, `LICENSE.txt`. [SOURCE: file:.opencode/skills/sk-design-interface/SKILL.md]
- **House conventions:** `.opencode/skills/sk-code/references/`; `.opencode/skills/` directory layout; house `SKILL.md` sizes.
- **Lineage syntheses:** `lineages/opus48/research.md`, `lineages/gpt55fast/research.md`. [SOURCE: file:lineages/opus48/research.md]
- **Per-lineage iterations:** `lineages/{label}/iterations/iteration-00N.md`; state `lineages/{label}/deep-research-state.jsonl`; deltas `lineages/{label}/deltas/iter-00N.jsonl`.
- **Merged registry + attribution:** `deep-research-findings-registry.json`, `fanout-attribution.md`.
<!-- /ANCHOR:references -->
