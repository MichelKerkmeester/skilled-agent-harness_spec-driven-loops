# Deep Research Synthesis — sk-design parent restructure (lineage: opus48-claude2)

> **Lineage:** opus48-claude2 (Claude Opus 4.8, xhigh) · **Loop:** research · **Iterations:** 15/15 · **Stop:** maxIterationsReached · **Questions answered:** 8/8
> **Topic:** Restructure `sk-design-interface` into an `sk-design` parent of 4–7 focused design sub-skills, grounded in the external design-skills corpus (41 standalone docs + designer-skills-main 9-collection/97-skill model + apple-bento-grid-main). Deliverables: (1) sub-skill taxonomy with scope/boundaries/sources; (2) parent structural-model evidence (hub vs umbrella) with coupling/shared-runtime signals; (3) per-child onboarding + backward-compat for folding in `sk-design-interface` and `sk-design-md-generator`.

This is one lineage of a four-model fan-out; it produces a vote for the cross-lineage merge and the phase-002 architecture decision. Grain (4 vs 5 vs 6) and the optional output child are flagged for reconciliation, not forced.

---

## 1. Executive Recommendation

- **Taxonomy:** **5 core children + 1 optional.**
  1. `sk-design-interface` (flagship — direction & build) · 2. `sk-design-foundations` (color/type/layout tokens) · 3. `sk-design-motion` (animation/interaction) · 4. `sk-design-audit` (QA/critique/harden/a11y/perf) · 5. `sk-design-spec` (DESIGN.md extract+author) · *(opt.)* `sk-design-output` (static/presentation graphics).
- **Structural model:** **umbrella-router parent over a sibling family**, with a parent-owned shared design-base, and **impeccable-style hub structure *inside* the interface child**. NOT a monolithic single hub.
- **Onboarding/compat:** keep flat `sk-design-*` names (zero reference rewrites); `sk-design-md-generator` → `sk-design-spec` via alias (not hard rename); augment (not replace) `sk-design-interface`; introduce the shared base additively; advisor + skill-graph rebuild is the discovery gate. Migration maps 1:1 to phases 003→006.

**Single strongest finding:** the corpus ships BOTH structural models — `impeccable` is an explicit hub ("the **parent impeccable skill (already loaded in this context)**" [SOURCE: external/audit.md:60-64]) and `designer-skills` is a loose marketplace ("installing more doesn't slow things down" [SOURCE: external/designer-skills-main/README.md:200]). So the choice is decided by *our* family's coupling — and the existing `sk-design-*` skills are already loosely-coupled siblings with heterogeneous runtimes, which tips it to umbrella.

---

## 2. Deliverable 1 — Sub-skill taxonomy (KQ4, KQ5)

Inclusion test: a cluster earns its own child when it is (a) deep, (b) independently invokable, (c) has its own reference corpus.

### Child 1 — `sk-design-interface` (flagship; keep name)
- **Scope:** decide and build a distinctive, non-templated interface direction; grounding → token-system brainstorm → anti-AI-default critique → build → self-critique; N-direction exploration; in-place redesign; interface writing.
- **Boundary:** owns *direction & build*; delegates token math → foundations, motion → motion, review → audit, artifact capture → spec.
- **Sources:** existing `sk-design-interface` (design_principles, variation_diversity, real_ui_loop) [SOURCE: .opencode/skills/sk-design-interface/SKILL.md:151-167]; `taste-skill`, `gpt-tasteskill`, `bencium-innovative-ux-designer`, `emil-design-eng`, `impeccable` (identity/craft/shape), `make-interfaces-feel-better`, `design-lab` (explore), `redesign-skill` (apply) [SOURCE: external/impeccable.md:11], [SOURCE: external/design-lab.md:6-8], [SOURCE: external/redesign-skill.md:8-15]; named-aesthetic presets `brutalist`/`minimalist`/`soft`/`apple-bento` as a `references/aesthetics/` library [SOURCE: external/stitch-skill.md:29-35], [SOURCE: external/apple-bento-grid-main/SKILL.md:200-204].

### Child 2 — `sk-design-foundations` (new)
- **Scope:** the static visual system — color (OKLCH conversion, palettes, contrast, gamut, theming, dark mode), typography (scale, pairing, measure), layout/spacing/hierarchy/grid, responsive/adapt.
- **Boundary:** owns *what the static system IS*; not motion, not direction-from-scratch. (Soft call — see Risks; structure internals as `color/`,`type/`,`layout/` so a split to 6 children is mechanical.)
- **Sources:** `oklch-skill` (+4 sub-refs), `colorize`, `layout`, `baseline` (token/type/color rules), `adapt` [SOURCE: external/oklch-skill.md:10-90], [SOURCE: external/layout.md:24-148], [SOURCE: external/baseline.md:60-86]; designer-skills `ui-design` + `design-systems` token/theming [SOURCE: external/designer-skills-main/design-systems/skills/design-token/SKILL.md].

### Child 3 — `sk-design-motion` (new)
- **Scope:** the temporal layer — purposeful animation, micro-interactions, transitions, motion materials, reduced-motion; framer-motion/GSAP implementation patterns.
- **Boundary:** owns *motion build*; motion-performance *review* lives in audit (motion references it). [SOURCE: external/animate.md:108-208], [SOURCE: external/interaction-design.md:51-272]
- **Sources:** `animate`, `interaction-design`, `delight`, `morphing-icons`; designer-skills `interaction-design` + `design-systems` motion-system.

### Child 4 — `sk-design-audit` (new)
- **Scope:** cross-cutting QA & critique — a11y, performance, responsive, theming, anti-pattern/slop detection, design-quality scoring, production hardening; shared P0–P3 severity + 5-dimension /20 contract.
- **Boundary:** owns *review/score/harden* (reports + targeted fixes); does not invent direction. [SOURCE: external/audit.md:12-105], [SOURCE: external/fixing-accessibility.md:33-136]
- **Sources:** `audit`, `critique`, `polish`, `harden`, `optimize`, `fixing-accessibility`, `fixing-motion-performance`, `12-principles-of-animation`, `mastering-animate-presence`, `pseudo-elements`, `baseline` (constraint mode); designer-skills `visual-critique` (7) + `accessibility-audit`.

### Child 5 — `sk-design-spec` (folds `sk-design-md-generator`)
- **Scope:** the DESIGN.md / Style-Reference artifact layer — **extract** from a live site (md-generator Playwright backend) AND **author** from taste directives (stitch approach).
- **Boundary:** owns the *DESIGN.md contract* that interface/foundations/sk-code consume. [SOURCE: .opencode/skills/sk-design-md-generator/SKILL.md:14], [SOURCE: external/stitch-skill.md:9-26]
- **Sources:** existing `sk-design-md-generator` references + new "author" path from `stitch-skill`; designer-skills `design-token` + `documentation-template`.

### Optional Child 6 — `sk-design-output`
- **Scope:** static/presentation graphics — posters, slides, bento stat-cards. **Sources:** `canvas-design`, `frontend-slides`, `slidev`, `apple-bento`. **Status:** phase-002 keep/drop; if dropped, sources become references under interface. [SOURCE: external/canvas-design.md], [SOURCE: external/frontend-slides.md], [SOURCE: external/apple-bento-grid-main/SKILL.md]

### Overlap seams (resolved)
- interface chooses palette/type/layout strategy → foundations implements/validates it → **DESIGN.md (spec) is the handoff**.
- foundations owns palette-level contrast; audit owns full-UI WCAG/perf sweeps.
- motion builds; audit's `fixing-motion-performance` reviews (motion links to it).
- spec captures/authors the reference; interface invents new direction and consumes it (the existing sibling boundary, preserved [SOURCE: .opencode/skills/sk-design-md-generator/SKILL.md:398-402]).

### Out of scope / adjacent
`output-skill` (anti-truncation) and `ui-skills-root` (CLI selector) = meta/infra (the latter informs the parent's router design). designer-skills' 5 process plugins (design-research, ux-strategy, prototyping-testing, design-ops, most of designer-toolkit) = a UX-strategy family, adjacent to an interface-build family. [SOURCE: external/designer-skills-main/README.md:69-77]

### Count variants (all 4–7)
4 (hub: interface absorbs foundations+motion) · **5 (recommended)** · 6 (split foundations→{layout,color}, or add output) · 7 (both).

---

## 3. Deliverable 2 — Structural-model evidence (KQ6)

### The two models, from in-corpus exemplars
- **HUB (`impeccable`):** one identity loads a shared base (anti-slop rules, register, slop test) once; modes are `reference/<command>.md` packets loaded *selectively*; `audit` routes among modes; `pin` promotes hot modes to shortcuts. Repo scaffold: `create:sk-skill-parent` ("one hub identity, registry source of truth"). [SOURCE: external/impeccable.md:13-186]
- **UMBRELLA (`designer-skills` / repo `deep-loop-workflows`):** a thin parent dispatches by registry to independently-loadable siblings over a shared backend; "holds no per-mode logic — it dispatches by workflowMode through mode-registry.json." À-la-carte install/load. [SOURCE: external/designer-skills-main/README.md:29-35], [SOURCE: skill registry: deep-loop-workflows]
- **ROUTER (`ui-skills-root`):** a pre-step that selects "the smallest useful UI Skills context." [SOURCE: external/ui-skills-root.md]

### Coupling / shared-runtime signal matrix
| Signal | Reading | Favors |
|--------|---------|--------|
| Shared knowledge base (anti-slop core, tokens, slop test) | HIGH (recurs across taste/stitch/baseline/audit/animate/redesign) | either, if parent owns a shared base |
| Shared runtime/tooling | LOW & HETEROGENEOUS (interface=judgment; spec=Playwright/ts-node backend; others=judgment) | **Umbrella** |
| Independent invocation | HIGH (audit, color, motion, spec invoked alone) | **Umbrella/router** |
| Cross-child workflows | PRESENT (redesign/craft sequence children) | **Router** |
| Advisor routing precision | distinct named children → sharper triggers | **Umbrella** |
| Backward-compat | existing names referenced across repo | **Umbrella** (nesting breaks them) |
| Context cost of co-load | inflates context | both (hub: selective load; umbrella: lazy) |
| Single-door discoverability | one "sk-design" door valued | **Hub** (edge; recoverable by umbrella entry name) |

**Tally: 5 umbrella · 1 hub · 2 neutral.** Deciding signals: runtime heterogeneity [SOURCE: .opencode/skills/sk-design-md-generator/SKILL.md:206-294] and backward-compat [SOURCE: .opencode/skills/sk-design-interface/SKILL.md:196-202].

### Decision
**Umbrella-router parent + shared design-base + sibling children, with hub structure inside the interface child.** Reject the monolithic hub: it would co-load a Playwright backend with pure-judgment children, force name-nesting that breaks cross-repo references, and blunt advisor precision — while the hub's real wins (shared base, single door, in-hub routing, pin) are all recoverable in the umbrella via a shared-base reference + one parent entry + a registry router. This confirms the parent spec's "umbrella + siblings" default with evidence rather than assumption. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/spec.md:126-128]

---

## 4. Deliverable 3 — Onboarding + backward-compatibility (KQ7, KQ8)

### Per-child onboarding (triggers · advisor keywords · seed references · skill-graph)
- **interface:** "design/redesign/variations/looks templated/visual identity" · interface-design, anti-slop, art-direction · existing refs + craft/shape/explore packets + aesthetics presets · ENHANCES sk-code; RELATED foundations/motion/spec/audit, mcp-figma, mcp-open-design.
- **foundations:** "color palette/oklch/contrast/tokens/typography/spacing/grid/dark mode/responsive" · color-system, design-tokens, typography, layout, theming · oklch+colorize+layout+baseline+adapt · ENHANCES interface, sk-code; RELATED spec, audit.
- **motion:** "animation/micro-interaction/transition/framer motion/hover/loading/scroll" · animation, motion-design, framer-motion · animate+interaction-design+delight+morphing-icons · ENHANCES interface, sk-code; RELATED audit, foundations.
- **audit:** "audit/design review/critique/a11y/WCAG/performance/harden/anti-pattern/polish" · design-audit, accessibility-audit, design-qa · audit+critique+polish+harden+optimize+fixing-* · ENHANCES interface, sk-code-review; RELATED all children; shares P0–P3 with sk-code-review.
- **spec:** "extract design system/generate DESIGN.md/capture css/style reference/author design system" · design-md, css-extraction, style-reference · md-generator refs + stitch author path · ENHANCES interface, sk-code; RELATED mcp-figma, mcp-open-design, foundations.
- **Parent routing:** one umbrella entry + a `skill-registry.json` router; defaults — free-form "design X"→interface; "fix/review/audit"→audit; "extract/DESIGN.md"→spec; "color/type/layout/tokens"→foundations; "animate/motion"→motion. [SOURCE: external/impeccable.md:149-168], [SOURCE: skill registry: deep-loop-workflows]
- **Discovery gate:** author each child's frontmatter, run advisor rebuild + skill-graph scan, validate routing at ≥0.8 — children are invisible to memory search/graph until this runs. [SOURCE: .opencode/skills/sk-design-interface/SKILL.md:1-12]

### Backward-compatibility
- **Keep flat `sk-design-*` child names** — the umbrella decision means zero rewrites of the existing references in sk-code, sk-code-review, mcp-figma, mcp-open-design, CLAUDE.md. (The single biggest compat win over the hub.) [SOURCE: .opencode/skills/sk-design-interface/SKILL.md:196-202]
- **`sk-design-md-generator` → `sk-design-spec` via alias**, not hard rename (the name is referenced by interface, sk-code, transports, system-spec-kit). Add the stitch "author" mode; leave the extract backend intact. [SOURCE: .opencode/skills/sk-design-md-generator/SKILL.md:398-425]
- **Augment, don't replace `sk-design-interface`:** add aesthetics presets, craft/shape/redesign/explore packets, register split, slop test; preserve the Apache-2.0 vendored base + LICENSE; bump version. [SOURCE: .opencode/skills/sk-design-interface/SKILL.md:151-167]
- **Shared base additively:** children keep self-contained references until the parent base resolves; de-dup only after routing validates (no mid-migration rules gap).
- **Migration → phases:** 003 scaffold parent (+registry +shared base) → 004 onboard existing (register, alias, additive base, advisor/skill-graph rebuild; gate: existing references resolve + routing ≥0.8) → 005 build foundations/motion/audit (+decide output) → 006 advisor rebuild + skill-graph scan + `validate.sh --recursive` + routing-regression. Each phase validates independently; children stay individually invocable, so no phase dark-launches a broken family. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/spec.md:98-119]

---

## 5. Risks, tradeoffs, and where this could be wrong

- **foundations is the softest merge** — may re-split to {color, layout} under real usage; structure internals so the split is mechanical. [SOURCE: external/oklch-skill.md:85-90]
- **interface over-absorption** — keep cross-domain ops as sibling handoffs, not absorbed modes; use selective per-mode loading. [SOURCE: external/impeccable.md:119-168]
- **shared base = hidden coupling** — version it, pin children to a base version, regression-test on change. [SOURCE: external/audit.md:60-64]
- **single-model bias** — this is one Opus lineage leaning on impeccable + designer-skills as the structural poles; a hub-leaning lineage may weight impeccable's success more. Reconcile in the merge.
- **corpus ≠ usage** — advisor/usage telemetry (absent) is the missing signal to harden the foundations-split and output-child calls.
- **`design-lab` statefulness** (temp `.claude-design/` routes) is an implementation wrinkle for the interface child's explore mode. [SOURCE: external/design-lab.md:10-17]

### Open dials for phase 002 / the merge
1. Grain: 4 (hub) vs **5** vs 6. 2. Output child: keep or fold. 3. md-generator naming: canonical spec + alias. 4. Shared-base governance. 5. Cross-lineage reconciliation (umbrella vote vs any hub vote).

---

## 6. Convergence report

- **Stop reason:** maxIterationsReached (15/15) — REQ-001.
- **Questions answered:** 8/8 (KQ1–KQ8), all evidence-backed.
- **newInfoRatio trend:** 1.0 → 0.7 → 0.65 → 0.55 → 0.6 → 0.55 → 0.55 → 0.5 → 0.4 → 0.45 → 0.4 → 0.4 → 0.4 → 0.35 → 0.2 (clean decline; genuine diminishing returns at the cap).
- **Quality gates:** source diversity PASS (41 standalone docs + designer-skills 9 collections/97 skills + apple-bento + 2 existing skills + 3 local parent precedents); focus alignment PASS; no-single-weak-source PASS; every finding cites a source.
- **Confidence:** HIGH on structure (umbrella) + compat (flat names); MEDIUM on grain (5 vs 4 vs 6) + output child (deferred).

## 7. References (primary sources)
- Standalone corpus: `external/{impeccable,audit,layout,oklch-skill,animate,interaction-design,fixing-motion-performance,harden,fixing-accessibility,baseline,stitch-skill,design-lab,redesign-skill,taste-skill,brutalist-skill,minimalist-skill,soft-skill,colorize,adapt,delight,morphing-icons,critique,optimize,polish,bolder,quieter,distill,clarify,12-principles-of-animation,mastering-animate-presence,pseudo-elements,canvas-design,frontend-slides,slidev,output-skill,ui-skills-root,emil-design-eng,bencium-innovative-ux-designer,gpt-tasteskill,make-interfaces-feel-better}.md`
- `external/designer-skills-main/README.md` + 9 collection `skills/*/SKILL.md`; `external/apple-bento-grid-main/{SKILL.md,design-system.md,evals/}`
- Existing skills: `.opencode/skills/sk-design-interface/SKILL.md`, `.opencode/skills/sk-design-md-generator/SKILL.md`
- Local parent precedents: skill registry — `create:sk-skill-parent`, `deep-loop-workflows`, `sk-code`
- Packet: `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/spec.md`, `001-corpus-research/spec.md`
