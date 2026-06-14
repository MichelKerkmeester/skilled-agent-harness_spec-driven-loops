# Seat B — sk-interface-design de-vendor + uniqueness + Open Design integration

**Mode:** READ-ONLY analysis (sk-interface-design + Open Design bundle). No mutating commands run; nothing deleted or edited. One file written (this one).
**Date:** 2026-06-14
**Scope note vs siblings:** Seat A owns the terminal-control surface (how to invoke `od`, MCP wiring, daemon/socket model). Seat C owns authoring the new `mcp-open-design` SKILL.md and the adversarial live-verification of OD's terminal claims. This seat (B) owns **sk-interface-design's side**: the OD data model *as it bears on replacing the CSVs*, the de-vendor plan, the integration *contract from sk-interface-design*, and the licensing sequence. Terminal mechanics and the new skill's section layout are referenced as dependencies, not duplicated.

---

## ⚠️ LEAD FINDING (read first) — a licensing regression is already live in the working tree

`git status` shows all three license/attribution files **deleted in the working tree** (unstaged `D`):

```
 D .opencode/skills/sk-interface-design/LICENSE-ui-ux-pro-max.txt
 D .opencode/skills/sk-interface-design/LICENSE.txt
 D .opencode/skills/sk-interface-design/THIRD-PARTY-NOTICES.md
```

They still exist in `HEAD` (confirmed via `git show HEAD:…`). Deleting `LICENSE-ui-ux-pro-max.txt` and `THIRD-PARTY-NOTICES.md` *before* the MIT data is gone is **out of order** (MIT notice must be retained while the MIT compilation still ships — the CSVs and search scripts are still present on disk). Deleting **`LICENSE.txt` is a defect regardless of sequencing**: `LICENSE.txt` is the **Apache-2.0** license for the Anthropic `frontend-design` base, which `design_principles.md` is "adapted verbatim" from and which the skill **keeps**. That license MUST stay.

**Immediate corrective action (independent of the rest of this plan): restore `LICENSE.txt`.** The MIT files may stay deleted *only after* step (a) below completes; right now they are deleted while their covered material is still on disk, which is the inverse of the correct order.

---

## TASK 1 — Open Design data model

### 1.1 An OD *design system* (the rich, directly-consumable unit)

Location: `/Applications/Open Design.app/Contents/Resources/open-design/design-systems/<slug>/`. ~150 folders (`ls` = 152 incl. `_schema/` + `README.md`; `_schema/AGENTS.md` references "138 brands"; `README.md` enumerates 72 product systems + 57 design-skill systems + hand-authored starters). Sources per `README.md`: `VoltAgent/awesome-design-md` (the `getdesign` npm package, MIT), `bergside/awesome-design-skills`, `tw93/kami` (MIT), plus hand-authored (`default`, `cisco`, `webex`, `atelier-zero`, `warm-editorial`, `kami`).

**Folder shape** (verified on `apple/`, `airbnb/`, `claude/`, `cursor/`):

| File | Role | Verified content |
|---|---|---|
| `DESIGN.md` | Canonical design **prose** for agents | 9 normalized sections (below) |
| `tokens.css` | Machine-readable `:root` token block | 56 tokens on `apple/`, standardized names |
| `components.html` | Real standalone component fixture (markup) | 29 KB on `apple/` |
| `manifest.json` | Optional machine-readable project entry (`od-design-system-project/v1`) | Validated by `pnpm guard` when present; legacy `DESIGN.md`-only folders still valid |
| `USAGE.md`, `assets/`, `fonts/`, `preview/`, `source/` | Optional agent guide, brand assets, evidence | Per `README.md` project shape |

**The 9-section `DESIGN.md` schema** (stable across systems; section 7 varies — `apple` "Depth & Elevation" vs `cursor` "Interaction & Motion"):

1. **Visual Theme & Atmosphere** — multi-paragraph prose + "Key Characteristics" bullets (the *why* and personality)
2. **Color Palette & Roles** — named hex with role + source-page citations (`Absolute Black (#000000): immersive hero canvases…`), grouped Primary / Secondary & Accent / Surface / Neutrals / Semantic / Gradient
3. **Typography Rules** — full **type-scale table** (Role × Size × Weight × Line-Height × Letter-Spacing × Notes), font families with fallbacks + usage split, principles, and *substitution guidance* for non-free fonts
4. **Component Stylings** — buttons / cards / inputs / nav / image treatment / distinctive components, with concrete radii, padding, hex
5. **Layout Principles** — spacing system (base unit + reused values), grid/container, whitespace philosophy, border-radius scale
6. **Depth & Elevation** — elevation table (Level × Treatment × Use)
7. **Do's and Don'ts** — explicit anti-pattern list per brand (*or* Interaction & Motion)
8. **Responsive Behavior** — breakpoint table, touch targets, collapsing strategy, image behavior
9. **Agent Prompt Guide** — quick color reference, **example component prompts**, an ordered iteration guide, and a **Known Gaps** section (e.g. "no consistent semantic status colors were extracted")

**`tokens.css` is a contract, not a dump.** A standardized shared schema (`--bg --surface --surface-warm --fg --fg-2 --muted --meta --border --accent --accent-hover --font-display --text-xs…--text-4xl --space-1…--space-12 --section-y-* --radius-sm…--radius-pill --elev-* --focus-ring --motion-fast …`, 56 tokens) governed by a **four-layer model** in `_schema/AGENTS.md` + `_schema/tokens.schema.ts`: **A1-identity / A1-structure** (brand decides, guard-required), **A2** (brand-with-fallback), **B-slot** (brand or schema-suggested `aliasTo` alias), **C-extension** (per-brand allowlist). There is a documented C→B-slot→A2→A1 promotion path. The file header tells agents to **paste the `:root{…}` block verbatim into the first `<style>` of an artifact, then reference via `var(--name)`** — i.e. tokens.css *pre-translates* a brand's prose names into lint-enforced token names so agents copy structure instead of inventing it.

**How an agent consumes a design system:** (1) read `DESIGN.md` for direction + reasoning; (2) paste `tokens.css` `:root` verbatim, reference via `var()`; (3) read `components.html` for real component markup to reuse. Reachable from a terminal per the task via `od mcp` (`get_file` / `search_files` / `list_files`) or `od tools design-systems read` (terminal mechanics = Seat A).

### 1.2 An OD *skill* (thin catalogue stub — NOT a rich unit)

Location: `…/open-design/skills/<slug>/SKILL.md` (~139). **Most are advertisement stubs, not self-contained capabilities.** Verified on `design-md`, `color-expert`, `design-review` — all three are identical in shape:

```yaml
---
name: design-review
description: |
  Designer Who Codes: visual audit then fixes...
triggers: ["design review", "visual audit", ...]
od: { mode: design-system, category: creative-direction, upstream: "https://github.com/garrytan/gstack" }
---
# design-review
> Curated from Garry Tan (gstack).
## What it does … ## Source (upstream URL) … ## How to use
"This catalogue entry advertises the skill in Open Design so the agent
 discovers it during planning. To run the full upstream workflow … install
 the upstream bundle into your active agent's skills directory."
```

So an OD skill = frontmatter (`name`, `description`, `triggers`, `od:{mode,category,upstream}`) + a body that **points to an external repo and tells you to install it yourself**. The daemon scans `skills/` at startup and shows them in the picker (per `skills/README.md`); the skill folder itself carries `assets/` + `references/` + `example.html` only sometimes. **Implication for us: OD *skills* are discovery pointers to third-party repos, not a usable knowledge base to fold into `sk-interface-design`.** The integration value is ~entirely in the **design-systems** (and secondarily the 111 `design-templates`), not the skills.

### 1.3 Richer / different vs sk-interface-design's CSVs

sk-interface-design's nine CSVs (verified headers + row counts): `styles` (84), `colors` (160), `typography` (73), `ui-reasoning` (161), `products` (161), `landing` (34), `ux-guidelines` (98), `charts` (25), `app-interface` (29).

| Dimension | sk-interface-design CSV | OD design system | Verdict |
|---|---|---|---|
| Granularity | Per-**pattern / product-type** generic rows ("luxury e-comm → glassmorphism + Playfair") | Per-**brand realized system** (apple, airbnb, stripe…) | OD is concrete & grounded; CSV is generic |
| Tokens | `colors.csv` = 160 shadcn-style semantic palettes, *as data* | `tokens.css` = compiled, lint-governed `:root`, paste-ready, 4-layer schema | **OD richer** — executable, not just listed |
| Type | `typography.csv` = 73 mood pairings (heading+body+Google Fonts URL) | `DESIGN.md §3` = full size/weight/leading/tracking scale **+ substitution guidance**, per brand | **OD richer** |
| Components | none (CSVs carry no component markup) | `components.html` real fixtures + `DESIGN.md §4` styling rules | **OD-only** |
| Reasoning | `ui-reasoning.csv` = per-product Recommended_Pattern / Decision_Rules / **Anti_Patterns** | `DESIGN.md §1, §7, §9` = prose atmosphere + per-brand Do/Don't + agent prompt guide | **Different job** (see below) |
| Quality floor | `ux-guidelines`/`charts`/`app-interface` = a11y/chart/web rules with Code Example Good/Bad + severity | none — OD carries no objective-quality-floor rule DB | **CSV-only** (this is the gap; see Task 2) |

**The key *difference*, not just richness:** the CSVs' `ui-reasoning`/`products`/`styles` are **"what everyone does"** — a taxonomy of expected defaults to *deviate from* (the whole point of `design_inventory.md`: "Read it as what everyone else does, not what to do"). OD design systems are **"here is one fully-realized distinctive system"** — material to *ground in and reuse*. These are **complementary, not substitutable**: OD can replace the *palette/type/token* lookups, but a single OD brand is a destination, not a map of the default to push against. Treating ~150 OD brands as a pick-list would itself be the templated-default behavior the skill exists to resist.

---

## TASK 2 — De-vendor + uniqueness plan

### 2.1 Can OD replace the static ui-ux-pro-max CSV inventory? — *Mostly yes for the aesthetic inventory; no for the quality floor.*

Map each CSV to its fate:

| CSV (rows) | What it provides | OD equivalent? | Disposition |
|---|---|---|---|
| `colors.csv` (160) | semantic palettes + WCAG pairs | **Yes** — `tokens.css` per brand (richer, compiled) | **Replace with live OD.** Keep the *token-schema + contrast discipline* as our authored principle (it's quality, not taste). |
| `typography.csv` (73) | mood pairings | **Yes** — `DESIGN.md §3` per brand | **Replace with live OD.** Keep "don't reach for the same pairing" as authored critique prose. |
| `styles.csv` (84) | named looks + effects + **"Do Not Use For"/contraindications** | **Partial** — OD systems *are* realized styles but not a taxonomy with contraindications | **Author-original** (condense the contraindication value into `design_principles.md`/inventory prose) **or drop**. No clean OD source for the taxonomy. |
| `ui-reasoning.csv` (161) | per-product Recommended_Pattern / **Anti_Patterns** | **No** — OD is per-brand, not per-product-type reasoning | **Author-original or drop.** `design_inventory.md` itself flags this as "the most dangerous file to take literally." Keep a short authored "expected default per product type" list as critique-against fuel; drop the generator-shaped Recommended_Pattern. |
| `products.csv` (161) | per-product style recs | **No** (same as above) | **Author-original or drop.** |
| `landing.csv` (34) | conventional section orders | **Partial** — OD `design-templates/` (111) + landing skills/systems (`atelier-zero` pairs with landing renderings) | **Author-original** (short "default section order to deviate from") **or** map to OD templates. |
| `ux-guidelines.csv` (98) | a11y/UX rules + Code Good/Bad + severity | **No** | **Keep as authored `ux_quality_reference.md`.** Already distilled into that doc (see §4.4). |
| `charts.csv` (25) | chart-type selection + a11y | **No** | **Keep** in `ux_quality_reference.md` (already covers charts). |
| `app-interface.csv` (29) | web-surface UX rules | **No** | **Keep** in `ux_quality_reference.md`. |

Net: the **aesthetic inventory** (colors, typography, and the realized-style role of styles) moves to **live OD reads**; the **quality floor** (ux-guidelines, charts, app-interface) was never aesthetic data and stays as our **already-authored `ux_quality_reference.md`** (its rules are paraphrased facts — see Task 4). The generator-shaped per-product CSVs (`ui-reasoning`, `products`) are **retired or compressed into a small authored "named-default" prose list**, because their literal `Recommended_Pattern` content is exactly what the skill is built to push against.

### 2.2 What becomes genuinely OURS / unique

The honest framing: **don't swap one vendor (ui-ux-pro-max) for another bundle (OD).** OD is *also* third-party (Apache-2.0 + MIT subskills). Uniqueness comes from two things we own:

1. **The anti-default judgment layer** — `design_principles.md` (Apache-2.0 Anthropic base, kept & attributed) + our critique-against discipline + the quality-floor gate. This is the skill's spine and is unchanged by de-vendoring.
2. **The live-OD *orchestration*, which is original synthesis:** sk-interface-design treats an OD design system in **two distinct anti-default-safe ways**, switched by the brief — (a) *reuse-before-generate* grounding when a real brand fits, and (b) *critique-against* ("name the OD system closest to the generic answer, then deviate"). No off-the-shelf tool does this dual use; ui-ux-pro-max only did (b), and only over static generic rows. This is the differentiator.
3. **Live read, not vendored copy** — we source from the user's *installed* OD app at run time and **never copy OD content into the skill**. That means (i) the data is ~150 real, maintained brand systems instead of a frozen CSV snapshot, and (ii) **no new vendored-license burden** is introduced (no redistribution → no notice obligation). This is the clean structural win over the current arrangement.

**Third-party dependency dropped:** the entire `ui-ux-pro-max` CSV inventory (9 files) + the BM25 search engine (`design_search.py` + `design_search_core.py`). After de-vendor, the skill ships **zero MIT-covered material** and depends only on its Apache-2.0 Anthropic base plus the user's separately-installed OD app.

---

## TASK 3 — Integration design (sk-interface-design → mcp-open-design)

Routing *mechanics* (the `od mcp` config, which verbs, daemon discovery) belong to `mcp-open-design` (Seat C). From sk-interface-design's side the contract is small and folds into the existing `claude_design_parity.md` loop.

### 3.1 Where it folds into the parity loop

`claude_design_parity.md`'s loop is **ground → reuse → render → check → revise → hand off**. OD slots into the first two steps:

- **§2 Design-Context Snapshot (intake):** add a bullet — *"If an OD design system matches the brief's brand or strongly-implied aesthetic, read it via `mcp-open-design` (`od mcp get_file`/`search_files`, or `od tools design-systems read`) as the grounding system: `DESIGN.md` for direction, `tokens.css` for the paste-ready `:root`, `components.html` for reusable markup."* Capture-only, never a chooser.
- **§3 Reuse-before-generate:** add — *"When an OD system is the grounding system, reuse its `tokens.css` tokens and `components.html` components before authoring net-new. Adherence check = the same one already defined (no raw hex where a token exists, no hand-rolled component the system provides)."* Reuse-before-generate is anti-default *by construction*, so this strengthens the existing mandate rather than diluting it.
- **§5 Fidelity check / §6 handoff:** unchanged.

### 3.2 When sk-interface-design routes to mcp-open-design

- The brief **names or strongly implies a brand/aesthetic** that has an OD system (e.g. "make it feel like Linear", "Apple-clean product page").
- The agent needs a **real system to ground/reuse** (Parity §3) and one exists.
- The agent wants to **name the generic default to deviate from** and an OD brand is the closest realized example of that default (critique-against use).

If no OD system fits, the free-axis anti-default process governs exactly as today; OD is optional, never a required step (mirrors how the CSVs were "ON_DEMAND, never required").

### 3.3 Keeping it lean & anti-default (the guardrails that must survive integration)

- **No style chooser.** The ~150 OD systems must **never** be surfaced as a pick-a-vibe menu. The agent resolves *one* system from the subject + brief, the same way `design_principles.md` Step 0 grounds the subject. A menu of reusable styles is precisely the templated default the skill resists (`claude_design_parity.md §8` already forbids "pick-a-vibe / theme-swap menu / named aesthetic dials" — that guardrail now also covers OD).
- **No generator.** OD's *creation* verbs (`create_artifact`, `media generate`, `automation run`) are **out of sk-interface-design's scope** — generation/handoff is `mcp-open-design` + `sk-code`. sk-interface-design only **reads** OD (judgment in, no artifacts out).
- **OD is an input to judgment, not an authority.** `design_principles.md` stays the authority. An OD match never overrides subject-grounding, the one-justified-risk mandate, or the quality floor. Reused tokens still get critiqued ("am I reinventing the default this brand also defaults to?").
- **Live read only.** Never cache/vendor OD content into the skill (preserves the licensing win in §2.2 — see Task 4 risk).

### 3.4 Concrete edits to land the integration (resource table)

In `SKILL.md §2` Resource Loading Levels, the current `ON_DEMAND … assets/data/*.csv … design_search.py` row is **replaced** by:

> `ON_DEMAND` | Need a real design system to ground in, reuse, or name the default to deviate from | OD design system via `mcp-open-design` (`od mcp get_file`/`search_files`/`list_files`; `od tools design-systems read`)

`design_inventory.md` is **reframed** from "the CSV critique-against catalog" to "how to use a matched OD system as either reuse-ground or critique-against baseline," or retired if `claude_design_parity.md` + `design_principles.md` already carry the discipline.

---

## TASK 4 — Licensing sequence (precise, ordered, legally careful)

**Two licenses in play.** (1) **Apache-2.0** — Anthropic `frontend-design` base; `design_principles.md` is "Adapted verbatim from Anthropic's frontend-design skill (Apache-2.0, see ../LICENSE.txt)" (verified header, line 16). SKILL.md/README also vendor Apache-2.0 prose. **This stays.** (2) **MIT** — `ui-ux-pro-max` (© 2024 Next Level Builder); covers the 9 CSVs (verbatim) and the two search scripts (derivative of upstream `core.py`/`search.py`). **This is what we remove.** MIT's sole obligation is *notice retention while the covered Software (or substantial portions) ships*. Once no MIT-covered file ships, the notice obligation lapses. Therefore **data/code first, attribution second** — never the reverse.

### Step (a) — FIRST remove the MIT-covered material

1. Delete `assets/data/*.csv` (all 9) — the verbatim MIT compilation.
2. Delete `scripts/design_search.py` + `scripts/design_search_core.py`. **Confirmed safe to delete:** `design_search_core.py` hard-codes `DATA_DIR = ../assets/data` and its entire `CSV_CONFIG` is the nine vendored files; `design_search.py` is a thin CLI over it. They serve **only** the vendored CSVs and nothing else, *and* they are themselves MIT-derivative — removing them removes the last MIT-licensed code.
3. Delete `assets/data/README.md` (describes the CSVs).

After (a), **no MIT-covered material ships.** Only now is the MIT notice removable.

### Step (b) — THEN remove the MIT attribution + references

4. Delete `LICENSE-ui-ux-pro-max.txt` (verbatim MIT — needed only while MIT material shipped).
5. `THIRD-PARTY-NOTICES.md`: the only remaining third-party component is the Apache-2.0 base (already covered by `LICENSE.txt` + SKILL.md attribution). Cleanest = **delete it**; acceptable alternative = reduce it to a one-line Apache-2.0 pointer. (HEAD content is a mixed-license table whose MIT half is now false.)
6. `SKILL.md` frontmatter (lines 6-9): remove `data_source: …ui-ux-pro-max-skill (MIT, design data and search)` from `metadata`; change `license:` from *"Apache-2.0 (principles) plus MIT (data and search); see LICENSE.txt, LICENSE-ui-ux-pro-max.txt, THIRD-PARTY-NOTICES.md"* → **"Apache-2.0; see LICENSE.txt"**. In `§5 References`, drop the `THIRD-PARTY-NOTICES.md` / `LICENSE-ui-ux-pro-max.txt` bullet and the "plus MIT (data and search)" phrasing. In `§2` resource table, remove the `assets/data/*.csv` + `design_search.py` row (replaced per Task 3.4).
7. `references/ux_quality_reference.md` lines 35-37: remove the `../assets/data/` link, "Distilled from … the adopted data sets," and the MIT-provenance line. The *rules themselves stay* (paraphrased facts — see §4.4).
8. `references/design_inventory.md`: remove ui-ux-pro-max provenance (lines 35, 82) + CSV-count framing + `../assets/data/` + `design_search.py` links; reframe to OD-backed (Task 3.4) or retire.
9. Secondary references to update (non-license-critical but leave dangling links otherwise): `feature_catalog/03--critique-against-data-inventory/{design-data-search,design-data-sets}.md`, `feature_catalog/02--quality-floor/objective-quality-floor.md`, `feature_catalog/feature_catalog.md`, `manual_testing_playbook/04--data-as-critique-against/query-default-then-deviate.md`, `manual_testing_playbook/06--licensing-and-provenance/licensing-and-provenance-integrity.md` (this scenario *tests* the MIT provenance — rewrite it to assert the de-vendored Apache-2.0-only state), `manual_testing_playbook/manual_testing_playbook.md`, and regenerate `graph-metadata.json`. Add a **new** `changelog/` entry recording the de-vendor (don't rewrite the v1.0.0.0 history).

### Step (c) — WHAT MUST STAY (Apache-2.0 Anthropic base)

- **`LICENSE.txt`** (Apache-2.0 full terms) — **RESTORE IT** (currently wrongly deleted in working tree). Required while any Apache-2.0 Anthropic prose ships.
- SKILL.md `metadata.author: Anthropic`, `metadata.source: anthropics/skills/frontend-design`, and the "Vendored from Anthropic's `frontend-design` skill (Apache-2.0)" lines (top of file + §8).
- `references/design_principles.md` header line 16 ("Adapted verbatim from Anthropic's frontend-design skill (Apache-2.0, see ../LICENSE.txt)") — this is **substantially verbatim Anthropic expression**; Apache-2.0 §4 requires retaining the attribution + a copy of the license. Non-negotiable.
- `README.md` Apache attribution.

### 4.4 NOT cleanly replaceable / attribution must remain — and verification flags

- **`design_principles.md`** — Apache-2.0 Anthropic-derived **verbatim**. Cannot be de-attributed; this is the single hard "keep attribution" case. `LICENSE.txt` exists for it.
- **`ux_quality_reference.md`** — currently *claims* MIT provenance (line 37: "adopted from the MIT-licensed ui-ux-pro-max repo") but the body is **"Distilled from the CRITICAL and HIGH severity rows"** (line 36) — i.e. paraphrased rules (WCAG AA contrast, `prefers-reduced-motion`, touch targets…). Factual rules and paraphrased rule-prose are **not copyrightable expression**, so the *content* can stay without MIT attribution. **VERIFY before dropping the notice:** confirm `ux_quality_reference.md` did not copy any **`Code Example Good/Bad`** snippets *verbatim* from `ux-guidelines.csv`/`app-interface.csv`/`charts.csv` (those code strings are the one place expressive MIT material could have been lifted). Sections read (2-4) are pure paraphrased prose with no copied code blocks — low risk, but confirm the full file before erasing provenance.
- **New OD third-party surface** — the OD bundle is **not uniformly Apache-2.0**: skills are Apache-2.0 "unless their own LICENSE says otherwise" (`skills/README.md` flags `guizang-ppt/` as verbatim MIT); design-systems derive from MIT sources (`getdesign`/awesome-design-md, `tw93/kami`). **Because we READ OD live from the user's installed app and never copy its content into `sk-interface-design`, no OD license attaches to our skill.** **FLAG (hard guardrail):** if the integration ever caches, vendors, or copies OD `DESIGN.md`/`tokens.css`/`components.html` into the skill repo, each source's license (Apache-2.0 / MIT / per-skill) immediately attaches and a new THIRD-PARTY-NOTICES becomes required. Keep integration strictly live-read (this is also Task 3.3's guardrail).

---

## DE-VENDOR CHECKLIST (ordered)

0. **[corrective, do now]** Restore `LICENSE.txt` (Apache-2.0) — it is wrongly deleted in the working tree.
1. **[verify]** Confirm `ux_quality_reference.md` contains no verbatim `Code Example Good/Bad` snippets copied from the MIT CSVs (read the whole file). If any exist → re-author them before step 7.
2. **[a]** Delete `assets/data/*.csv` (9 files).
3. **[a]** Delete `assets/data/README.md`.
4. **[a]** Delete `scripts/design_search.py` + `scripts/design_search_core.py` (serve only the CSVs; MIT-derivative).
5. **[b]** Delete `LICENSE-ui-ux-pro-max.txt`.
6. **[b]** Delete (or reduce to an Apache-2.0 one-liner) `THIRD-PARTY-NOTICES.md`.
7. **[b]** Edit `SKILL.md` frontmatter (`metadata.data_source` out; `license:` → "Apache-2.0; see LICENSE.txt") + `§2` resource row + `§5` references.
8. **[b]** Edit `references/ux_quality_reference.md` (remove CSV link + MIT-provenance lines 35-37; keep the rules).
9. **[b]** Edit `references/design_inventory.md` (reframe to OD-backed per Task 3.4, or retire).
10. **[b]** Update dangling references: `feature_catalog/03--…/*`, `02--quality-floor/objective-quality-floor.md`, `feature_catalog.md`, `manual_testing_playbook/04--…`, `06--licensing-and-provenance/licensing-and-provenance-integrity.md` (rewrite to the new Apache-only reality), `manual_testing_playbook.md`.
11. **[integration]** Land Task 3.4 edits (OD resource row in `§2`; OD bullets in `claude_design_parity.md §2/§3`).
12. **[c — keep, do not touch]** `LICENSE.txt`; SKILL.md Anthropic attribution; `design_principles.md` Apache header; `README.md` Apache attribution.
13. **[finalize]** Regenerate `graph-metadata.json`; add a new `changelog/` entry documenting the de-vendor (preserve v1.0.0.0 history); run `validate.sh <skill-spec-folder> --strict` per the skill's authoring rules.

---

## RISKS / KEEP-ATTRIBUTION CASES

| # | Risk / case | Severity | Mitigation |
|---|---|---|---|
| R1 | **`LICENSE.txt` already deleted** in working tree — Apache-2.0 base shipped with no license. | **High (live now)** | Restore `LICENSE.txt` immediately (Checklist 0). |
| R2 | MIT attribution removed **before** the CSVs/scripts — notice gap while MIT material still on disk (the inverse of the correct order, already half-done in the tree). | **High** | Enforce strict (a)-then-(b) ordering; do not re-stage the MIT-file deletions until step (a) lands. |
| R3 | `design_principles.md` is **verbatim Anthropic** — must retain attribution + license. | **Hard requirement (cannot drop)** | Keep `LICENSE.txt` + the line-16 attribution + SKILL.md `author/source`. |
| R4 | `ux_quality_reference.md` may contain **verbatim MIT code snippets**. | Medium | Verify full file (Checklist 1); re-author any copied `Code Example` strings before erasing provenance. Rule-prose itself is non-copyrightable and safe. |
| R5 | **Vendor-swap illusion** — replacing ui-ux-pro-max with OD just trades one third party for another and adds a heavier license surface (Apache + MIT subskills). | Medium | Read OD **live only**, never vendor it (R6). Uniqueness lives in the judgment + dual-use orchestration (Task 2.2), not the data. |
| R6 | **Caching/vendoring OD content** into the skill would attach OD's per-source licenses (incl. MIT `guizang-ppt`, MIT `kami`/`getdesign`-derived systems) and require a new THIRD-PARTY-NOTICES. | Medium | Hard guardrail: integration is strictly live-read; never copy OD `DESIGN.md`/`tokens.css`/`components.html` into the repo. |
| R7 | **Capability regression** — the quality-floor CSVs (`ux-guidelines`/`charts`/`app-interface`) have **no OD equivalent**; dropping them naively loses the a11y/chart/web rule base. | Medium | They are already distilled into `ux_quality_reference.md`; keep that doc as the authored source. Only the *generic-pattern* CSVs move to OD; the quality floor stays authored. |
| R8 | **Anti-default erosion** — surfacing ~150 OD systems as a chooser turns the skill into the pick-a-vibe menu it was built to resist. | Medium | Resolve exactly one OD system from the subject; reuse the `claude_design_parity.md §8` no-menu guardrail; OD is input to judgment, not authority. |
| R9 | **Dangling references** after CSV/script deletion across feature_catalog + manual_testing_playbook (10+ files). | Low | Checklist 9-10 sweep; `grep -rl "ui-ux-pro-max\|design_search\|assets/data\|LICENSE-ui-ux\|THIRD-PARTY"` until clean. |
| R10 | **`mcp-open-design` skill does not exist yet** in `.opencode/skills/` (confirmed absent; being authored by Seat C). sk-interface-design must not hard-depend on it before it ships. | Low | Gate the OD integration on `mcp-open-design` landing; keep the OD path "ON_DEMAND / optional," same posture the CSVs had. |
