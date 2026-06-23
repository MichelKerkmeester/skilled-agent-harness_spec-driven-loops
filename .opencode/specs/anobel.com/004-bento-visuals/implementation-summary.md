---
title: "Implementation Summary: Bento Visual Recreation in Open Design"
description: "Complete (2026-06-21): all 12 feature pages (60 bento cards) live in OD project 2078899e — the 4 Claude-DC .dc.html prototypes transpiled to OD-native HTML, plus the 11 missing pages built to the OCI-v3 quality bar. Index (12 live links) + aggregation (12 iframes) + tokens. Browser-verified; packet validates --strict."
trigger_phrases:
  - "bento"
  - "open design"
  - "implementation summary"
  - "anobel"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "anobel.com/004-bento-visuals"
    last_updated_at: "2026-06-22T19:15:00Z"
    last_updated_by: "claude"
    recent_action: "Pushed all 233 visuals to OD 2078899e: 9 new -3 created, 18 overwritten, aggregate synced"
    next_safe_action: "Refresh project in Open Design app to view; pick strongest -3 per feature"
    blockers: []
    key_files:
      - "OD project: 2078899e-aa23-41a8-a0ef-6bfcef9bebc5 (Anobel — Faithful Prototypes, 15 files)"
      - "scratch/faithful-import/build-faithful.mjs (Claude-DC → OD-native transpiler + fidelity asserts)"
      - "scratch/faithful-import/dist/ (12 transpiled/built pages + tokens + index + aggregation + screenshots)"
      - "Prior OD project 00765887 (recreation) was deleted by the user; superseded by 2078899e"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "implement-anobel.com/004-bento-visuals"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
# Implementation Summary: Bento Visual Recreation in Open Design

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Status** | Complete (faithful set) |
| **Completed** | 2026-06-21 |
| **OD Project** | `2078899e-aa23-41a8-a0ef-6bfcef9bebc5` (Anobel — Faithful Prototypes) |
| **Files in project** | 39 (tokens, index, aggregation, 12 v1-v3, 4 v4, 2 Vloot group, 9+9 per-function pages) |
| **Cards Built** | 179 — 60 (faithful) + 20 (v4) + 9 (Vloot group) + 45 (9×5) + 45 (9×5 more) |
| **Verification** | All pages pass structural + palette QA; browser-verified; index+aggregation 36/36; `--strict` |
<!-- /ANCHOR:metadata -->

---

## Faithful Prototype Import — 2026-06-21

Distinct deliverable from the earlier recreation: bring the four `.dc.html` prototypes in
`a_nobel_en_zn/4_prototyping` (Claude-design exports) into Open Design faithfully, per the
user's "migrate/convert these htmls into open design" request.

**Root cause DeepSeek hit:** `.dc.html` is Claude-design's format (`<x-dc>`, `<helmet>`,
`sc-for` loops, `{{ }}`, `DCLogic.renderVals()`, `<dc-import>`, `style-hover`, `support.js`).
Open Design has **no runtime** for any of it (verified: none of those tokens exist in the OD
bundle; OD renders plain HTML + `.artifact.json` manifests). A literal copy renders broken
(the Tokens page is entirely loop-driven). The fix is a **transpile**, not a copy.

**What was done:**
- Wrote `scratch/faithful-import/build-faithful.mjs` — extracts each file's `<helmet>`+`<x-dc>`
  body, lifts the head, drops `support.js`, expands the Tokens `sc-for` loops from the real
  `renderVals()` data (6 swatches / 6 ramps / 70 stops / 5 radii), converts `style-hover`→CSS
  `:hover` (reduced-motion guarded), and degrades the non-self-contained pages honestly.
- **Self-containment reality:** only 2 of 4 are fully faithful (Tokens, OCI-v3). The index
  links to 11 feature `.dc.html` files that were **never exported**; the aggregation is built
  from `<dc-import>` of those same 11 missing docs. Per the user's "degrade gracefully" choice:
  index's one real link (OCI-v3) is live, the other 11 are dimmed + non-clickable under an
  honest banner; aggregation embeds the real OCI-v3 in an iframe and shows dashed
  "nog niet geëxporteerd" placeholders for the 11. **No missing pages were fabricated.**
- Created **NEW OD project `2078899e-aa23-41a8-a0ef-6bfcef9bebc5`** ("Anobel — Faithful
  Prototypes") and registered all 4 via `od artifacts create` (proper `.artifact.json`
  manifests, `status: complete`). The earlier project `00765887` was left untouched.

**Verification:**
- 22 transpile asserts pass (counts + no Claude-DC scaffold leaks).
- All 4 rendered in headless Chrome and visually confirmed faithful: Tokens (all swatches/
  ramps/type/radii/components), OCI-v3 (5 cards 1:1), index (faithful + honest degradation),
  aggregation (OCI-v3 iframe + 11 placeholders). Screenshots in `scratch/faithful-import/dist/`.

### Completion — remaining 11 pages built to the OCI-v3 bar

On "fix all remaining", and after confirming no further prototypes were exported and that the prior
recreation project `00765887` had been deleted, the 11 missing feature pages were **built** (not
imported — there was no faithful source) at the OCI-v3 quality bar:

- 4 parallel feature builders (Kwartaalcijfers / Maandfactuur / OCI v1-v2 / Marad), each reading
  `oci-v3.html` + `tokens.html` as the strict template, produced 11 pages × 5 = **55 new cards**.
  Card concepts came from the index's own per-page subtitles; data is invented but realistic and
  maritime-appropriate (Dekken / Tuigerij / Verf; OCI 5.0; Marad XML / release 2026).
- Independent structural QA: all 11 pass — 55 cards, exactly 5 per page at 480×440, balanced SVG,
  brand-palette-only, no external deps beyond Google Fonts, no Claude-DC scaffold.
- The transpiler was upgraded to wire every feature page by name: index now has **12 live links,
  0 degraded**; aggregation **12 live iframes, 0 placeholders** (existence-aware — a failed build
  degrades rather than 404s).
- All 11 imported via `od artifacts create`; index + aggregation overwritten via `od files write`.
  **OD project `2078899e` now holds 15 files** (tokens, index, aggregation, 12 feature pages = 60 cards).
- Visual sweep: contact-sheet montage of all 11 + full-detail check of the most chart-dense page
  (kwartaalcijfers-v3: stacked bar / donut / waterfall / treemap / goal-vs-actual) confirm craft.

### Expansion — 2026-06-22: v4 round + Vloot-functies category (Mobbin/Refero grounded)

On "use Mobbin/Refero to find high-end bento examples and create more variations", then a screenshot +
9 customer-supplied fleet-feature concepts:

- **Live reference pass** (Code Mode → `refero.*` / `mobbin.*`, read live, never copied): pulled the
  high-end analytics/BI aesthetic (Hex, Mode, Operate, Linear, Resend, Runey) to name the craft bar and
  the default to deviate from. Distilled into a critique-against brief: layered/inset depth, one editorial
  display moment, instrument-grade density — all executed in Anobel's own palette, never a copied look.
- **Seed-of-thought debias** (seed `A7n2Qp9rD4xK`, median excluded) assigned 4 distinct v4 signatures so
  the new directions don't collapse to one "premium bento" median.
- **v4 round — 4 Opus agents, 20 cards:** Kwartaalcijfers v4 (motion-led, reduced-motion guarded),
  Maandfactuur v4 (instrument panel, monospaced figures), OCI v4 (editorial hero number), Marad v4
  (layered-depth, inset borders only — verified no drop-shadows).
- **New category Vloot-functies — 2 Opus agents, 9 cards** (GROEP 1: goedkeuring/budget/limieten/
  assortiment/accounts; GROEP 2: eigen assortiment/standaardlijsten/meerdere winkelwagens/vrije invoer),
  from the customer's feature-selection screenshot. Maritime fleet data (MS Aldebaran/Castor/Pollux/Vesta).
- **Index + aggregation extended** (existence-aware transpiler injection): added a v4 row + a Vloot-functies
  section → **18 live links / 18 iframes, 0 degraded**. Footer tally updated to 89 visuals.
- All 6 new pages structurally QA'd (correct card counts, no scaffold/external deps, balanced SVG, motion
  guarded, Marad inset-only) and browser-verified via two contact sheets. Imported to OD project
  `2078899e` (now **21 files**); index + aggregation overwritten.

### Expansion — 2026-06-22: each Vloot-functie → its own page of 5 visuals (Opus 4.8)

On "create prompts to create at least 5 visuals per new function, let Opus 4.8 design those": each of the
9 Vloot-functies (previously one card on a group page) was expanded to its own page of **5 distinct visual
treatments** — **45 new cards**.

- I authored 9 self-contained Opus prompts, each specifying 5 deliberately different FORMS for that function
  (no form repeats within a page; the 9 functions collectively span flows, gauges, donuts, grids, matrices,
  funnels, meters, ledgers, toggles, carts, timelines). Dispatched **9 Opus 4.8 agents** in parallel.
- Independent QA: all 9 pass — 45 cards, 5 per page at 480×440, balanced SVG, no scaffold/external deps,
  motion guarded. Palette QA flagged 4 near-ramp values; `#e6f4e5` was a valid token (green-200), the other
  three were snapped to the exact nearest token (`#f6f6f6→#f4f4f4`, `#d8d8d8→#e2e2e2`, `#ffd9cd→#fed1cc`).
  Re-scan: all 9 palette-clean.
- Navigator extended again: index gains a "per functie · 5 visuals elk" section, aggregation gains 9 iframes →
  **27 live links / 27 iframes, 0 degraded**; footer tally 134 visuals.
- Browser-verified via a 9-page contact sheet + full-res spot checks (goedkeuringssysteem: flow/queue/funnel/
  matrix/timeline; meerdere-winkelwagens: parallel/split/tabs/breakdown/checkout). Imported to OD project
  `2078899e` (now **30 files**).

### Expansion — 2026-06-22: second wave, 5 more visuals per Vloot-functie (Opus 4.8)

On "make sure they are all in aggregation and index, then create 5 more for each new feature":

- **Navigator completeness verified first**: cross-checked every content page against the live OD index +
  aggregation — 27/27 present in both, 0 broken refs, before adding more.
- **Second wave — 9 Opus 4.8 agents, 45 more cards** (`{function}-2.html`). I designed 5 NEW forms per
  function that don't repeat the first page (each agent also reads its own first page to dedupe): e.g.
  goedkeuring → rules/hierarchy/ratio-donut/wait-aging/bulk; budget → kalender/prognose/ledger/burn-down/
  categorie; bestellimieten → historie/frequentie/ladder/stapel/waarschuwing; accountbeheer → rechten-matrix/
  sessies/gezondheid/organigram/audit; etc.
- Independent QA: all 9 pass — 45 cards, balanced SVG, no scaffold/external deps, motion guarded. Palette QA
  flagged 3 near-ramp tints; snapped to exact tokens (`#fff5f2→#fff3f2`, `#fde2da→#fed1cc`, `#fafafa→#fcfcfc`).
  Re-scan: all 9 palette-clean.
- Navigator extended (second per-function section): **36 live links / 36 iframes, 0 degraded**; footer 179.
- Browser-verified via a 9-page contact sheet + full-res check (vrije-artikelinvoer-2). Imported to OD project
  `2078899e` (now **39 files**). Re-verified against the LIVE OD project: **all 36 content pages present in
  both index and aggregation (36/36)**.

### Restyle — 2026-06-22: orange demoted, de-templated (Opus 4.8)

User feedback: orange should be "almost none" and "a lot of them are pretty bad" (generic/repeated, AI-templated).
Root cause owned: the prompts hardcoded "one orange accent per card" → every card carried orange (the templated
"dark + one acid accent" default). Direction chosen with the user: orange for genuine alerts/CTAs only; fix the
generic/templated feel; calibrate first.

- **Calibrated 3 archetype pages** (budgetteren=quantitative, aangepast-assortiment=state, goedkeuringssysteem=flow)
  with an upgraded design-led brief: encode data with the BLUE ramp; orange ≤1 functional use per page (often 0);
  no default donut; bolder reductive forms; grey eyebrow. User signed off.
- **Rolled out to all 24 generated pages** (12 faithful prototype recreations left as-is, per the user) via 21 more
  Opus 4.8 agents — each preserved its page skeleton/topic and re-executed the visuals.
- Result, verified across all 24 (119 cards): **every page ≤1 orange card; 10 pages have zero; only 14/119 cards
  (12%) use orange** (was 100%). Donuts/tables/logs replaced with funnels, waffle grids, organigrams, ranked
  columns, heatmaps, editorial figures. Marad-v4 flipped orange-led→blue-led; OCI-v4 hero numbers now blue.
- Palette QA: snapped a handful of near-white tints to exact tokens → all 24 palette-clean. Structure/ motion-guard
  intact. Overwrote the 24 in OD via `od files write` (project stays 39 files; index/aggregation unchanged).

### Re-illustrate — 2026-06-22: literal feature illustrations (Opus 4.8)

User feedback: "focus more on creative ways to literally illustrate the topic or feature" — the restyled set was still
dashboard-y (bars/gauges/funnels). Direction: draw the feature as a scene/metaphor, not chart it; keep the
restrained-orange brand discipline.

- **Calibrated 3 archetype pages** (meerdere-winkelwagens=objects, goedkeuringssysteem=process, bestellimieten=quantity)
  with an illustration brief: each card a hand-built flat-SVG drawn scene/metaphor of the feature (maritime/logistics —
  ships, crates, carts, gates, instruments), keeping the exact shell, grey eyebrow, brand palette, orange ≤1 (alert/CTA).
  User signed off; chose to roll out to all 24 generated pages.
- **Rolled out via 21 more Opus 4.8 agents.** Each function's two pages use DIFFERENT scene sets (no metaphor repeats):
  e.g. budget → coin-jar/envelope/scale/fuel-tank/safe then calendar/leaking-barrel/treasure-chest/taximeter/coin-stacks;
  goedkeuring → boom-gate/stamp/officer/signal/fork then drawbridge/punched-ticket/loket/signature/unlocking-padlock;
  OCI → plug→socket/bridge/pipeline/gears/mooring-cleats; maandfactuur → receipts→funnel→one-invoice; kwartaalcijfers →
  coin-stacks/ledger/treasure-chest/abacus/gold-ingots. The 2 group pages became single-emblem-per-function.
- Verified across all 24 (119 cards): **orange on 11 cards (9%), every page ≤1; all palette-clean; grey eyebrows**
  (caught + snapped one stray orange micro-eyebrow on goedkeuringssysteem-2). Motion still reduced-motion-guarded.
  Browser spot-checks confirmed quality (the 3 calibration pages + accountbeheer-2 + kwartaalcijfers-v4).
- Overwrote the 24 in OD via `od files write` (project stays 39 files; index/aggregation unchanged).

### Small-model bake-off + Kimi refinement — 2026-06-22

User asked to test DeepSeek-v4-pro / MiMo-v2.5-pro / Kimi-k2.7-code on visual design (all via
`cli-opencode`, each applying `sk-design-interface`), then refine the weak pages with the winner.

- **Bake-off (1 fixture = Budgetteren, n=1/model):** all 3 read the design skill + respected the hard
  constraints. **Kimi won** — blue-led, 1 orange (the alert), gold rare, cohesive (per-card orange:
  Kimi 1, DeepSeek 1-but-gold-on-4, MiMo 5/5 sprayed). DeepSeek = richest drawings but gold-heavy/
  blue-starved; MiMo = clean/fast but over-accents. Files: `scratch/faithful-import/dist/bakeoff/`.
- **Weak-page review:** rendered all 24; structural scan over-flagged drawn instruments as "charts", so
  I confirmed visually. Genuinely chart/UI-ish: `bestellimieten` (gauge-dial + grid), `maandfactuur-v4`
  (calendar grid + UI card), `standaardlijsten-2` (pegbord node-diagram). Refined all 3 with Kimi.
- **A/B gate (adopt only if better):** **adopted Kimi `maandfactuur-v4`** (clear win — calendar grid +
  UI card replaced with clean MANY→ONE objects: funnel / receipt-spike / mailbox / binder-clip / press).
  Kept the current `bestellimieten` and `standaardlijsten-2` (Kimi's were lateral / slightly busier) —
  user's call. Reconciled orange: all 24 pages ≤1 orange card (9% of 119), palette-clean.
- **PENDING:** the Open Design desktop app/daemon was down at adopt time, so the one-file OD overwrite of
  `maandfactuur-v4` is queued — push via `od files write` once the app is reopened. Local dist file is
  already the Kimi version.
- **Skill findings recorded** (per research, the canonical home is `sk-prompt-small-model`; no change to
  `sk-design-interface` or `cli-opencode`): a caveated illustration note added to each of the 3 model
  profiles (`references/models/*.md` §7) + their `model_profiles.json` strengths/weaknesses, explicitly
  marked **informal n=1**, pointing to `/deep:model-benchmark` as the path to canonical evidence.

---

<!-- ANCHOR:what-built -->
## What Was Built

### Design System Foundation
- **`tokens.css`**: 120+ CSS custom properties — 5 brand colors, 6 color ramps (66 stops), typography (Hanken Grotesk 400-800), 5 border radii, surface/card/dark theme tokens, component button/badge tokens
- **`DESIGN.md`**: Brand documentation, palette reference, ramp structure, typography scale, layout specifications

### Navigation Layer
- **`index.html`**: Dark-themed bento navigator — 4 feature cards (Kwartaalcijfers, Maandfactuur, OCI, Marad) with SVG icons, v2/v3 direction links, responsive grid, hover animations
- **`aggregation.html`**: Full-overview composition page — iframe-embeds all 12 feature pages across 3 direction sections

### Direction 3 (v3) Feature Pages — 20 Bentogrid Cards
- **OCI v3** (`features/oci/direction-03.html`): Live synchronisation (bidirectional SAP↔Nobel diagram), shared catalog (Venn diagram), connection status panel, order bridge with animated OCI label, faster ordering time comparison
- **Kwartaalcijfers v3** (`features/kwartaalcijfers/direction-03.html`): Stacked bar (Q1-Q4 grouped), donut chart (category breakdown), waterfall (2025→2026 growth), treemap (category revenue), goal-vs-actual bar comparison
- **Maandfactuur v3** (`features/maandfactuur/direction-03.html`): Stacked invoice bars per month, chip-style sorted amounts, donut category breakdown, sum aggregation (12→1), monthly receipt card
- **Marad v3** (`features/marad/direction-03.html`): Before/after process comparison, step menu (select→send→confirm), progress ring at 75%, confirmation stamp, toggle switch with stats
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

- OD project created via CLI: `00765887-72e8-4045-8ce8-8293f879ab01`
- Files written directly to project directory at `~/Library/Application Support/Open Design/namespaces/release-stable/data/projects/`
- All bento cards follow the design spec: 480×440px, white surface `#fff`, 16px border radius, Hanken Grotesk typography, SVG-driven visuals
- CSS tokens referenced via CSS custom properties (e.g., `var(--brand-blue)`, `var(--card-radius)`)
- `sk-design-interface` Steps 0-2 critique applied before generation: palette confirmed non-AI-default, bento-card SVG language justified as aesthetic risk, dark theme retained as brand-appropriate
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

1. **Direct file writes** instead of MCP `start_run` — MCP tools returned empty results; CLI `od artifacts create` failed with "fetch failed"; writing directly to the resolved project directory was the reliable path
2. **v3 direction first** as the target quality level — the prototypes show v3 as the most polished direction, so it serves as the quality benchmark
3. **CSS custom properties** over hardcoded values — every color, radius, and font references tokens.css variables, making the design system the single source of truth
4. **Lucide-style inline SVGs** over external icon libraries — keeps cards self-contained and matches the prototype's visual language
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

### Completed
- [x] CHK-001/002: Spec and plan documented
- [x] CHK-003: OD daemon confirmed running (11 processes, socket present)
- [x] CHK-004: sk-design-interface Steps 0-2 completed
- [x] CHK-005: Token extraction validated (120+ properties, 6 ramps)
- [x] CHK-010/011/012: Brand colors, ramps, typography present in tokens.css
- [x] CHK-050: Spec/plan/tasks/checklist synchronized

### Pending
- CHK-013: Border radii validation
- CHK-014/015: sk-design-interface critique on generated pages
- CHK-020-027: Page completeness and card dimension checks (requires OD preview)
- CHK-030-035: Content fidelity per concept names
- CHK-040-044: Navigation and animation testing in browser

**Verification Artifact**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/anobel.com/004-bento-visuals --strict` — 0 errors, 1 warning (sufficiency)
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **MCP transport broken**: `create_project`, `write_file`, `start_run` return `{}` — works around by writing files directly to project directory
2. **Directions 1-2 not started**: 8 feature pages (40 cards) pending — see tasks.md T011-T018
3. **No browser preview verified**: OD project has files but `start_run` flow to get `previewUrl` not completed
4. **Token validation purely source-based**: color values extracted from prototype, not verified via OD rendering
<!-- /ANCHOR:limitations -->

---

## Deviations from Plan

- **File writing method**: Plan assumed MCP `create_artifact`/`write_file`; implemented via direct filesystem writes to `resolvedDir`
- **Multi-agent dispatch not used**: Design project had no codebase to explore structurally; all pages written inline
- **Preflight/Postflight skipped**: Quick design phase did not warrant epistemic measurement

---

## Recommended Next Steps

1. Run `/speckit:implement` to continue with Direction 1 (original) — 4 pages, 20 cards
2. Verify OD preview renders by opening the project in the Open Design app
3. Validate card dimensions (480×440px) and color fidelity via browser inspector
4. Complete remaining checklist items (CHK-013 through CHK-044)

---

## Minimal-Literal Refinement — 2026-06-22

User direction: the visuals were "too illustrated / too detailed" — the ask was for
**minimal but literal** metaphors that still tell each feature's story. Dispatched **8 Opus
design agents** (one per feature, each loading `sk-design-interface`), which rewrote **15 weak
pages** so every card is **ONE bold filled metaphor** (≤~10 primitives) instead of charts,
tables, admin-UI mockups, or faint multi-prop "scenes".

**Refined (15):** aangepast-assortiment p1/p2, standaardlijsten p1/p2, vrije-artikelinvoer p1/p2,
bestellimieten p1/p2, eigen-assortiment p1/p2, meerdere-winkelwagens p1/p2, marad-v4, budgetteren
p1/p2. The standout fix was meerdere-winkelwagens p1 (faint forklift/ship/conveyor scene → bold
solid carts). marad-v4 rebuilt as connection metaphors (coupler, tow-line, key-in-lock, magnets,
puzzle) kept distinct from oci-v4.

**Left as-is** (already minimal-literal): oci-v4, vloot-functies-groep-1/2, goedkeuringssysteem
p1/p2, accountbeheer p1/p2, kwartaalcijfers-v4, maandfactuur-v4.

**Verification:** brand shell + Dutch copy preserved on every page; `scratch/faithful-import/_audit.mjs`
confirms palette-only (snapped stray `#f2f3f6` → `#e7e9ee` in 4 files), flat (no gradient/shadow/filter),
orange ≤1 card/page, 5 cards each, SVGs balanced. Visual A/B (before `_suspects.png` vs after
`_after.png`, 0.41-scale contact sheets) confirms each refined page beats its prior version with no
layout regressions.

**Pending:** push the 15 refined pages (+ the earlier maandfactuur-v4) to OD project `2078899e` —
blocked on reopening the Open Design app (daemon was down). Local `dist/` files are updated.

---

## Minimal Option Pages (-3) — 2026-06-22

User follow-up: "I need more minimal extras" → clarified as **more minimal concept options to pick
from**, each one bold metaphor with **no extra chrome**. Dispatched **9 Opus agents** (one per fleet
function) which each created a new `<feature>-3.html` page of **6 maximally-pared-back cards** —
strip rule: one big hero pictogram (≤8 primitives) + a single eyebrow label, **no €-chips, no footer
status rows, no badges** — distinct from that feature's p1/p2 metaphors.

**New pages (9 × 6 = 54 option cards):** goedkeuringssysteem-3, budgetteren-3, bestellimieten-3,
aangepast-assortiment-3, accountbeheer-3, eigen-assortiment-3, standaardlijsten-3,
meerdere-winkelwagens-3, vrije-artikelinvoer-3.

**Verification:** `scratch/faithful-import/_audit3.mjs` → all 9 clean (palette-only after snapping a
stray `#7fd083` → `#367e39`, flat, orange ≤1 card, 6 cards each, SVGs balanced). Full pick-sheet
rendered to `dist/_min-all.png`.

**Aggregate view:** the 9 `-3` pages are now linked in `index.html` (new "minimaal · 6 visuals elk"
section, 45 links, 0 broken) and embedded as iframes in `aggregation.html` (new "Vloot-functies ·
minimaal" section, 45 iframes, 0 broken, footer total 233). So all visuals are visible in aggregate.

**Next:** user picks the strongest concept(s) per feature; promote chosen cards into the canonical
pages. The `-3` pages remain an option pool until that promotion.

---

## Pushed to Open Design — 2026-06-22

The Open Design app was reopened (daemon live), so the whole local set was synced to project
`2078899e` (this **supersedes the "pending push" notes above**):
- **9 new `-3` pages** added via `od artifacts create` (daemon-registered, manifests generated).
- **18 existing artifacts overwritten** via direct disk write to the project dir (the
  `.artifact.json` manifests carry no content hash, so a direct write stays valid — same method the
  prior session used): the 15 refined function pages + `maandfactuur-v4` (Kimi) + `aggregation.html`
  + `index.html`.

**Verification:** project now holds **48 HTML artifacts + 48 manifests** (was 39); all 9 `-3` present;
key overwrites `diff`-identical to `dist/`; project `aggregation.html` carries the "minimaal" section,
9 `-3` iframes, and footer total 233. The CLI is `node "<app>/…/daemon-cli.mjs"`, socket
`OD_SIDECAR_IPC_PATH=…/release-stable/daemon.sock`; project dir is under
`~/Library/Application Support/Open Design/namespaces/release-stable/data/projects/2078899e…`.

**Note:** overwrites were direct disk writes, so the running app may serve cached copies until the
project is refreshed/reopened; the new `-3` files (daemon-created) appear immediately. `build-faithful.mjs`
is retired (would clobber agent refinements) — `dist/` + the OD project are the source of truth now.
