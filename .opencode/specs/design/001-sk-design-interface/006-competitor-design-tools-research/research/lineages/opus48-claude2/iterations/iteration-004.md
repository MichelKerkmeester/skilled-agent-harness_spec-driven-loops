# Iteration 4: Broader field sweep + consolidated ADOPT/ADAPT/SKIP mapping

## Focus
Sweep the broader field (Onlook, Builder.io Visual Copilot, Google Stitch, Uizard, Relume, tweakcn, Magic Patterns) to confirm/extend the themes, then consolidate every distinct idea into an ADOPT/ADAPT/SKIP verdict per skill with the anti-default / lean-CLI guardrail.

## Sourcing note
Live web gated; model knowledge (claude-opus-4-8, 2026-01), tagged UNVERIFIED with canonical URLs for host verification.

## Actions Taken
1. Enumerated the broader field's distinctive capabilities (F17–F22).
2. Folded them into the existing themes (direct-edit, constrain-to-system, error self-healing, persistent context, multi-variant, tokens).
3. Built the consolidated per-skill ADOPT/ADAPT/SKIP table and ran each row against the anti-default mandate and the lean-CLI scope.

## Findings (broader field)

### F17 — Onlook: direct-manipulation visual edits on a *real* codebase, written back to code
Onlook ("Cursor for designers", open-source) is a visual editor over a real Next.js/React + Tailwind project: drag/select/edit in a browser preview and the changes are **written back into the actual source/Tailwind classes**, with a design-tokens panel. [SOURCE: model-knowledge 2026-01; UNVERIFIED — host verify at https://onlook.com] 
- **Relevance:** The strongest instance of the direct-edit-to-code pattern (F1/F8/F14), and the only one operating on a *real local codebase* rather than a hosted canvas — closest to the CLI skills' world. Confirms F8's adopt direction for `mcp-magicpath` (edit tokens/markup in `src/**` directly between revisions).

### F18 — Builder.io Visual Copilot: component mapping (Figma node → your component)
Visual Copilot converts Figma to code and lets you **map design elements to your existing code components** so output reuses real components. [SOURCE: model-knowledge 2026-01; UNVERIFIED — host verify at https://www.builder.io/c/docs/visual-copilot] 
- **Relevance:** Another instance of constrain-to-system (F15) via explicit mapping. The plugin coupling is out-of-scope; the *mapping idea* reinforces "reuse registered components."

### F19 — Google Stitch: text/image → UI with multiple themed variants + editable export
Stitch (Google Labs) generates UI from a prompt or image, offers **multiple design variants/themes**, and exports to code/Figma. [SOURCE: model-knowledge 2026-01; UNVERIFIED — host verify at https://stitch.withgoogle.com] 
- **Relevance:** Multi-variant (F6) + image→UI (F2/F3). Same anti-default caution as F6: variants are useful for *exploring one grounded direction*, hazardous as a canned-style chooser.

### F20 — Uizard: screenshot/sketch → editable UI + themes
Uizard turns screenshots/sketches into editable mockups with swappable themes. [SOURCE: model-knowledge 2026-01; UNVERIFIED — host verify at https://uizard.io] 
- **Relevance:** image→UI (OVERLAP w/ 005 image-brief). Theme-swap = preset chooser → anti-default SKIP for sk-design-interface.

### F21 — Relume: AI sitemap → wireframes from a fixed component library + style-guide gen
Relume generates sitemaps and wireframes **assembled from a fixed component library**, and can generate a style guide. [SOURCE: model-knowledge 2026-01; UNVERIFIED — host verify at https://www.relume.io] 
- **Relevance:** Another constrain-to-library instance (F15). Style-guide generation overlaps 005 token export.

### F22 — tweakcn: visual editor for shadcn/ui tokens → exports CSS variables/theme
tweakcn is a **visual theme editor** for shadcn/ui that produces CSS variables / a theme object you paste into a project. [SOURCE: model-knowledge 2026-01; UNVERIFIED — host verify at https://tweakcn.com] 
- **Relevance:** Token editing/export (OVERLAP w/ 005 token export). Reinforces "tokens are the durable interchange object."

## Theme consolidation (dedup vs 005)
| Theme | Instances | vs 005 | Verdict source |
|---|---|---|---|
| T1 Direct-manipulation edits that write back to code/tokens (no AI turn) | v0 F1, Lovable F8, Figma Make F14, Onlook F17 | **NET-NEW** (005 routing was AI-only) | strong |
| T2 Constrain generation to a registered design system/component library (no drift) | Subframe F15★, Builder F18, Relume F21 | **NET-NEW** (005 = soft inherit) | keystone |
| T3 Build/runtime-error self-healing loop (run→error→fix) | v0 F4, Bolt F12 | **NET-NEW** (005 loop = fidelity, not correctness) | strong |
| T4 Persistent project "Knowledge"/context file grounding all work | Lovable F9, v0 Sources F2 | **NET-NEW-sharpened** (005 = per-task snapshot) | medium |
| T5 Diff-before-apply (preview the change before committing) | Bolt F12c | NET-NEW-minor | low |
| T6 Multi-variant generation | v0 F6, Stitch F19, Uizard F20 | OVERLAP (005 levers note) + anti-default hazard | caution |
| T7 Tokens-as-input + token export | Figma Make F13, tweakcn F22, Relume F21, Subframe F16 | OVERLAP (005 inheritance + token export) | overlap |
| T8 Image/screenshot → UI brief | v0 F2, Uizard F20, Stitch F19 | OVERLAP (005 image-brief) | overlap |

## Consolidated ADOPT / ADAPT / SKIP (per skill, net-new only)
### mcp-magicpath (canvas/CLI)
| Theme | Verdict | Move + guardrail |
|---|---|---|
| T2 constrain-to-system | **ADOPT** | "Reuse-before-generate": `search`/`inspect` the active theme's registered components first; compose from them; author net-new only when nothing fits. Prevents design drift by construction (anti-default aligned). |
| T3 error self-healing | **ADOPT** | After `code submit --wait`, if build != `completed`, read the error, fix within the editable boundary (`src/App.tsx`, `src/index.css`, `src/components/generated/**`), resubmit; cap retries. Net-new vs 005 fidelity loop. |
| T1 direct token/markup edits | **ADAPT** | Between revisions, edit `src/index.css` tokens / generated markup directly for targeted tweaks instead of always re-prompting; reserve AI turns for structural change. |
| T5 diff-before-apply | **ADAPT (small)** | Surface a diff of edited editable-boundary files before `code submit` so the change is reviewable. |
### sk-design-interface (judgment)
| Theme | Verdict | Move + guardrail |
|---|---|---|
| T2 constrain-to-system | **ADAPT** | Add a critique check: when a component registry/token system is present, ask "am I reinventing a component the system already has?" Stays judgment; never becomes a generator. |
| T4 persistent Knowledge file | **ADAPT** | Optionally read a persisted project "design brief" (subject/audience/brand/do-don'ts) if present, to ground Step 0 across sessions. Read-if-present; never authored as a style chooser. |
| T6 multi-variant | **SKIP (mostly) / ADAPT-cautious** | A canned-style variant menu = "pick-a-vibe" → violates the anti-default mandate → SKIP. Only safe form: bounded variations *within the one grounded direction* for self-critique, never preset styles. |
| T1 direct edits | **SKIP** | sk-design-interface owns judgment, not a live canvas; direct-manipulation belongs to mcp-magicpath/sk-code. |

## Questions Answered
- Q1: broader field surveyed (F17–F22); no new *theme* beyond T1–T8.
- Q2: full dedup table vs 005 complete (T1–T8).
- Q3: consolidated per-skill ADOPT/ADAPT/SKIP table complete.
- Q4 (partial): negative knowledge assembled below.

## Negative knowledge (consolidated)
- SKIP full-stack/backend generation (Lovable/Bolt) — UI skills, not app generators.
- SKIP in-browser runtime / WebContainers, deploy/host, GitHub sync, community remix galleries — platform features.
- SKIP Figma-plugin-native coupling (Figma Make libraries, Builder/Anima/Visual Copilot plugins) — the skills are not plugins; keep only generalized tokens-as-input.
- SKIP preset theme-swap / "pick-a-vibe" variant menus in sk-design-interface — violates the anti-default mandate (primary guardrail, agrees with 005).
- SKIP heavyweight visual-regression/diff engines — agrees with 005; screenshot+judgment compare suffices.
- SKIP pushing generated themes back to the MagicPath account / hosted canvas — platform scope creep (agrees with 005).

## Assessment
- **newInfoRatio: 0.40** — the broader field produced *no new theme* (all fold into T1–T8); the new value is the *consolidation* (dedup table + per-skill verdicts), which is synthesis, not discovery.
- **Novelty justification:** Discovery has saturated (4 tools, 0 new themes); value shifted to mapping/verdicts. This is the expected pre-convergence shape.
- **Confidence:** HIGH — themes are now multiply attested (T1: 4 tools, T2: 3 tools, T3: 2 tools).

## Reflection
- **Worked:** The theme table made saturation visible — every iter-4 tool mapped to an existing theme, signalling convergence.
- **Failed:** Web gated throughout (settled). No new discovery axis remained.
- **Ruled out:** see Negative knowledge above (consolidated).

## Recommended Next Focus
Iteration 5: **Convergence + cross-check prep** — finalize the prioritized per-skill recommendation, rank the net-new ideas (T2 keystone → T3 → T1/T4 → T5), set up the cross-lineage reconciliation hooks against the `gpt55fast` sibling, and confirm newInfoRatio has converged.
