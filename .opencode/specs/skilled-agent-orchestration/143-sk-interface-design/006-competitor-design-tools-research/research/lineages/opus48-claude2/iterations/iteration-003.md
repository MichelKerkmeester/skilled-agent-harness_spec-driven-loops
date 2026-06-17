# Iteration 3: Figma Make + Subframe — design-system-native generation

## Focus
Survey **Figma Make** (figma.com/make) and **Subframe** (subframe.com) — the design-system-native generators. Target the sharpest candidate net-new theme: **constrain generation to a registered design system / component library** ("no design drift"), vs 005's softer "inherit-if-present".

## Sourcing note
Live web gated; model knowledge (claude-opus-4-8, 2026-01), tagged UNVERIFIED with canonical URLs for host verification.

## Actions Taken
1. Enumerated Figma Make's design-relevant capabilities (design-file-aware generation, variables/libraries as tokens, point-and-edit + code panel).
2. Enumerated Subframe's capabilities (design-system-first editor, generation constrained to your components, production React/Tailwind export, prompt/image input).
3. Distilled the cross-tool "constrain-to-system" theme and split it into the two skills' boundaries; checked it against the anti-default mandate.

## Findings

### F13 — Figma Make: design-system / variables-aware generation
Figma Make turns a prompt (or an existing Figma frame) into a working prototype/app, and can **respect your Figma libraries and variables (design tokens)** so generated output uses your real system rather than arbitrary styling. [SOURCE: model-knowledge 2026-01; UNVERIFIED — host verify at https://help.figma.com/hc/en-us/articles/figma-make] 
- **Relevance:** "Tokens/system flow into generation." OVERLAP with 005 design-system inheritance + token export, but reinforces that *tokens-as-input* is the field norm. The Figma-plugin coupling itself is out-of-scope.

### F14 — Figma Make: point-and-edit + "edit with code" panel
Generated apps are editable both by prompt and by **direct selection/point-edit**, with a code panel for precise control. [SOURCE: model-knowledge 2026-01; UNVERIFIED — host verify at https://help.figma.com/hc/en-us/articles/figma-make] 
- **Relevance:** A *fourth* independent instance of the direct-manipulation-edit pattern (F1/F8/F14). Pattern is now strongly corroborated; not new.

### F15 — Subframe: generation constrained to YOUR design system (no drift) ★
Subframe is **design-system-first**: you define/import a component library + tokens, and AI generation **composes from your registered components**, not net-new markup — so output cannot drift off-system; it exports clean production React + Tailwind. [SOURCE: model-knowledge 2026-01; UNVERIFIED — host verify at https://www.subframe.com] 
- **Relevance:** **The keystone net-new theme of this packet.** 005's "inherit-if-present" means *ground in* a system (soft). Subframe's model is *hard*: a **registry of allowed components/tokens the generator must compose from**. This is anti-default-aligned (it *prevents* generic output by construction) AND lean-CLI-hostable:
  - For `mcp-magicpath`: it already has `search`/`inspect`/`add` over a component registry and `themes`. The net-new move is a **"reuse-before-generate" / compose-from-registered-components** rule — search the theme's components first and compose, only authoring net-new when nothing fits. Concrete, ADOPT-able.
  - For `sk-interface-design`: ADAPT (it is judgment, not a generator) — when a component registry/token system is present, the critique step gains a hard check: "is this composed from the existing system, or am I reinventing a component the system already has?"

### F16 — Subframe: visual editor → production code (design-tool fidelity)
Subframe's Figma-like visual editor outputs production-grade React/Tailwind with no separate handoff step (design *is* the code). [SOURCE: model-knowledge 2026-01; UNVERIFIED — host verify at https://www.subframe.com] 
- **Relevance:** Design-is-code reduces handoff loss. 005 already proposes a handoff manifest; OVERLAP. The sharper note: *prefer editing tokens/components over re-describing in prose* (connects to F8/F15).

## Questions Answered
- Q1 (Figma Make + Subframe): capabilities enumerated (F13–F16).
- Q2: **F15 (constrain-to-registered-system) is the keystone NET-NEW theme** vs 005's softer inheritance; F13/F16 overlap; F14 corroborates the direct-edit pattern.
- Q3 (partial): F15 split into ADOPT (mcp-magicpath reuse-before-generate) / ADAPT (sk-interface-design critique check).

## Questions Remaining
- Q1 for the broader field (Onlook, Builder Visual Copilot, Stitch, Uizard, Relume, tweakcn) — iter 4.
- Q4/Q5 (consolidated negative knowledge + prioritized recommendation) — iters 4–5.

## Assessment
- **newInfoRatio: 0.55** — one keystone net-new theme (F15) plus reinforcement; F13/F14/F16 are overlap/corroboration, so net novelty is moderate and declining.
- **Novelty justification:** F15 (hard constrain-to-registered-system) is the single most valuable net-new idea so far; the rest corroborates earlier patterns.
- **Confidence:** HIGH on the constrain-to-system theme (it is Subframe's and Builder's core, multiply attested); Medium on exact feature wording.

## Reflection
- **Worked:** Forcing the survey toward "what is *hard*-constrained vs *soft*-grounded" surfaced the keystone F15 distinction from 005.
- **Failed:** Web gated (unchanged). Figma-plugin coupling repeatedly out-of-scope — now a settled boundary.
- **Ruled out:** Figma-plugin-native integration (Figma Make's libraries coupling, Builder/Anima plugins) as adoptable for two non-plugin CLI skills; the *generalized* tokens-as-input idea is kept, the plugin coupling is dropped.

## Recommended Next Focus
Iteration 4: **Broader field sweep** — Onlook (open-source visual-edit-to-real-code), Builder.io Visual Copilot (component mapping), Google Stitch (text/image→UI + variants), Uizard (screenshot→UI), Relume (component-library wireframing), tweakcn (visual shadcn token editor). Then begin the consolidated ADOPT/ADAPT/SKIP mapping per skill and assemble negative knowledge.
