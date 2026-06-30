# Iteration 1: design-interface expansion matrix

## Focus
Inventory `design-interface`'s current references/assets, map them against the taste/craft corpus it does not yet use, and produce its per-mode expansion matrix entry (inventory gaps, prioritized additions, do-NOT-add list).

## Findings

### F1.1 — design-interface is vendored and draws on NONE of the taste corpus [confirmed]
The mode is vendored verbatim from Anthropic `frontend-design` (Apache-2.0), has no `corpus_map.md`, and its references are the upstream set plus locally-added grounding/aesthetics/mcp-tooling refs [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:1-16,154-167]. Its anti-default calibration is the three named "AI-default looks" (cream+serif+terracotta, near-black+acid accent, broadsheet hairlines) [SOURCE: design-interface/SKILL.md:120]. None of the corpus craft sources the 001 research assigns to this child — `taste-skill`, `gpt-tasteskill`, `bencium-innovative-ux-designer`, `emil-design-eng`, `make-interfaces-feel-better`, `design-lab`, `redesign-skill` — are distilled in [SOURCE: 001-corpus-research/research/research.md:81]. The calibration is *aesthetic* (which palettes look AI-made) but misses the *mechanical* tells the corpus catalogs.

### F1.2 — Zero assets; the two-pass process has no fill-in artifact [confirmed]
`design-interface` ships 13 references and **0 assets** (filesystem). The STEP 0–4 two-pass process (ground → token brainstorm → critique → build → self-critique) lives only as SKILL prose [SOURCE: design-interface/SKILL.md:99-118]. There is no scaffold the agent fills in, so the process is re-derived from prose every run.

### F1.3 — The corpus ships concrete mechanical anti-default rules interface lacks [confirmed]
`gpt-tasteskill` is a dense catalog of the exact defects LLM UI ships and mechanical fixes: the **2–3 line hero iron rule** with `max-w` container fix, the **gapless bento** rule (`grid-flow-dense`, interlocking spans), the **meta-label ban** ("SECTION 01"/"QUESTION 05"), the **button-contrast check** (no invisible text), and a **mandatory `<design_plan>` pre-flight block** that verifies hero math, bento density, label sweep, and button contrast before any code [SOURCE: external/gpt-tasteskill.md:31-44,61-74]. `design_principles.md` only partially covers this (it bans numbered markers 01/02/03 [SOURCE: design-interface/SKILL.md:143]) and frames defaults aesthetically, not as a checkable pre-flight. This is gap 09 + gap N2 [SOURCE: 001-corpus-research/research/gap-analysis.md:20,27].

### F1.4 — No mock-content / anti-AI-copy discipline [confirmed]
Gap N1: realistic placeholder content (plausible names, numbers, copy with no AI tells) is absent from interface and audit; the corpus carries it in `redesign`, `gpt-taste` §7 (the picsum-seed + filter discipline and meta-label ban), and `impeccable` [SOURCE: gap-analysis.md:26], [SOURCE: external/gpt-tasteskill.md:61-63]. interface produces UI, so this is a build-time addition, not only a review one.

### F1.5 — The real-UI loop has no variation+feedback loop top-up [confirmed, nice]
`real_ui_loop.md` owns ground→reuse→render→check→revise→hand-off [SOURCE: design-interface/references/design-process/real_ui_loop.md:14-26] but does not carry `design-lab`'s explicit variation+feedback loop (gap 12, nice-to-have) [SOURCE: gap-analysis.md:31].

## Prioritized Additions (design-interface)

| ID | Type | Title | Why it raises usefulness | Corpus sources | Effort |
|----|------|-------|--------------------------|----------------|--------|
| IF-A1 | asset | `assets/design_plan_preflight.md` — fill-in `<design_plan>` pre-flight card | Converts the prose two-pass into a checkable artifact gating the exact mechanical defects LLM UI ships (hero line count, bento density, meta-label sweep, button contrast). First asset for the mode. | gpt-tasteskill §3,§4,§7,§8; taste §14; impeccable | M |
| IF-R1 | reference | `references/design-process/mechanical_defaults.md` — mechanical anti-default checklist | design_principles' calibration is aesthetic (3 looks); this adds the mechanical tells (2–3 line hero + max-w fix, gapless bento, meta-label ban, button contrast, section spacing) the corpus enumerates. Pairs with the N2 layout pre-flight gate shared with audit. | gpt-tasteskill §2–7; redesign-skill; taste §14 | M |
| IF-R2 | reference | `references/design-process/mock_content.md` — realistic mock-content / anti-AI-copy discipline | Closes gap N1 on the build side: plausible names/numbers/copy, no lorem, no AI-tell phrasing, image-seed discipline. Shared concept with audit's review-side check. | redesign-skill; gpt-tasteskill §7; impeccable | S |
| IF-R3 | reference | augment `real_ui_loop.md` with a design-lab variation+feedback loop note | Adds an explicit variation→feedback→refine micro-loop to the real-UI path. Nice-to-have; small. | design-lab | S |
| IF-R4 | reference | bencium craft-depth top-up folded into `design_principles.md` | Marginal taste-depth enrichment; nice-to-have only. | bencium-innovative-ux-designer | S |

## Do-NOT-add (design-interface)
- **gpt-taste's Python-RNG "true randomization" as a hard mandate** — it duplicates the job of `variation_diversity.md` (seed-of-thought debias) and contradicts design_principles' grounding-first philosophy. Adapt the *intent* (force layout variance) into IF-A1's pre-flight, not the literal mechanism. [if-effective bar: mechanism is redundant]
- **Aesthetic presets as a chooser** — `aesthetics/` is already guarded as critique-against-only; do not promote to a pick-a-vibe axis [SOURCE: design-interface/SKILL.md:179].
- **Forward DESIGN.md/PRODUCT.md authoring (gap 10)** — that is the `design-spec` / md-generator surface, a net-new child decision; out of scope here.
- **GSAP scroll/motion paradigms from gpt-taste** — motion build belongs to `design-motion`; importing it here breaks the mode boundary.
- **taste-skill wholesale (87KB)** — distill only specific sub-parts where they land; the brief→config three-dials intake belongs in `foundations` (gap 08t), not interface.

## Sources Consulted
- `.opencode/skills/sk-design/design-interface/SKILL.md` (full)
- `.opencode/skills/sk-design/design-interface/references/design-process/real_ui_loop.md` (head)
- filesystem inventory of `design-interface/references` and `assets` (0 assets)
- `external/gpt-tasteskill.md` (full)
- `001-corpus-research/research/research.md` §4 child-1; `gap-analysis.md` rows 09, N1, N2, 12, 08b

## Assessment
- **newInfoRatio: 1.0** — First substantive mode pass; the full interface inventory, corpus-usage gap, and 5 scored additions + 5 do-NOT entries are all new to this packet.
- **Novelty justification:** Establishes the dominant pattern for the whole matrix (vendored base + zero assets + un-distilled craft corpus), which later modes will contrast against.
- **Confidence:** High on inventory (filesystem + SKILL confirmed) and corpus grounding (gpt-tasteskill read in full); Medium on effort estimates.

## Reflection
- **Worked:** Reading the mode SKILL + the single richest corpus source (gpt-tasteskill) was enough to ground concrete, typed additions. The corpus_map absence is itself a signal (interface never distilled its craft corpus).
- **Ruled out:** gpt-taste Python-RNG randomization as a literal addition (redundant with variation_diversity).
- **Failed:** nothing this iteration.

## Recommended Next Focus
Iteration 2: `design-foundations` — assess data-viz (14d), three-dials brief→config intake (08t), brand-seed color (N3), and gestalt depth (14g) against the existing color/type/layout references; produce its matrix entry.
