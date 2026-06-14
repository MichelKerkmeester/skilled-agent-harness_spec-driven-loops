# Iteration 2: The Input Side — Design-System Inheritance (dim 1) + Context Grounding (dim 3)

## Focus
Deep gap analysis on the two "input" dimensions and per-skill ADOPT/ADAPT/SKIP recommendations: how each skill takes in a design system and how each grounds in context, measured against Claude Design's org-design-system inheritance and context attachments. The anti-default guardrail is preserved throughout.

## Findings

### Dimension 1 — Design-System Inheritance

#### F10 — sk-interface-design has token *content* but no token *contract* (ingest or emit)
Its Step-2 token system is real design content — "the palette as 4–6 named hex values," display/body/utility faces, layout, signature — but it lives in thinking, not as a structured artifact, and there is no step that ingests an existing system. [SOURCE: file:.opencode/skills/sk-interface-design/references/design_principles.md:61] Yet the grounding principle already says to use "any information in your memory about the human's preferences, context about what they're building, or designs you've made before … as a hint." [SOURCE: file:.opencode/skills/sk-interface-design/references/design_principles.md:37] So *inheritance is philosophically endorsed but mechanically absent*.
- **ADAPT (high value, low risk):** Add an optional "Step 0.5 — inherit if present": if the brief, repo, or memory carries an existing token system (brand palette, `tailwind.config`, CSS variables), ground in it and spend the aesthetic risk *within* those constraints rather than reinventing. This extends the existing memory-as-hint rule; it does **not** weaken anti-default (you still avoid the three default looks within the inherited system).
- **ADAPT (medium):** Let Step 2 optionally **emit** its token system as a small structured block (named hex + roles + type scale) so downstream `sk-code`/`mcp-magicpath` consume a contract instead of re-reading prose. The content already exists; only the shape is new.
- **SKIP:** Hosting/syncing an org design system, or a "design-system manager." That is product surface, not judgment; out of scope for a CLI judgment skill (negative knowledge).

#### F11 — mcp-magicpath already inherits design systems (themes) — near parity on *consume*
`get-theme` returns `light`/`dark` CSS-variable maps, `fonts`, and a natural-language `prompt` of styling instructions to follow; the skill instructs applying these vars instead of hardcoded colors and loading the fonts. [SOURCE: file:.opencode/skills/mcp-magicpath/references/magicpath_operations.md:124] Repo-import already reads "the design foundation first — global CSS …, design tokens (`tailwind.config.*`, CSS variables, token files), fonts, theming strategy." [SOURCE: file:.opencode/skills/mcp-magicpath/references/magicpath_operations.md:282]
- **ADOPT: nothing** — consume-side inheritance is effectively at parity. Recording this as parity (not a gap) is itself a finding.
- **ADAPT (medium):** Bridge the two inheritance sources. During repo-import, synthesize the repo's discovered tokens into a theme-shaped object (CSS vars + a `prompt` line) so canvas authoring and install share one inherited system. The pieces exist (theme schema + repo-foundation read); the bridge does not.
- **SKIP:** Writing a generated theme *back* to the MagicPath account — no `create-theme` exists in the documented CLI surface; adding one is platform scope creep, not a CLI-skill improvement (negative knowledge). [SOURCE: file:.opencode/skills/mcp-magicpath/references/magicpath_operations.md:413]

### Dimension 3 — Context Grounding

#### F12 — sk-interface-design grounds in the *subject* and memory, but has no attachment intake
Grounding is conceptual: name the subject/audience/job, draw from "the subject's own world, its materials, instruments, artifacts, and vernacular," plus memory hints. [SOURCE: file:.opencode/skills/sk-interface-design/references/design_principles.md:37] There is no structured channel for the brand/visual references Claude Design accepts as attachments.
- **ADAPT (high value):** Formalize a "context intake" before Step 0 — accept brand refs, an existing-page URL/screenshot, or competitor examples as *grounding* inputs, explicitly framed as "critique-against / inherit-from," not "copy." This rides the existing design_inventory.md framing of patterns as "common patterns to critique against … never a chooser." [SOURCE: file:.opencode/skills/sk-interface-design/SKILL.md:151]
- **SKIP:** Building file upload/storage/attachment management — the runtime already passes file paths/images; the skill only needs to *use* them, not store them (negative knowledge).

#### F13 — mcp-magicpath has strong *code* context grounding and partial *visual* grounding
It mandates understanding the target before acting: existing functionality, layout context, data flow, and design system of the destination file. [SOURCE: file:.opencode/skills/mcp-magicpath/references/magicpath_operations.md:118] It also ingests selected canvas images into `assets/selected/**` for use in authoring. [SOURCE: file:.opencode/skills/mcp-magicpath/references/magicpath_operations.md:154]
- **ADOPT: near parity** on code-context grounding (arguably *exceeds* Claude Design here, since it reads the live destination codebase).
- **ADAPT (medium):** Extend image intake from "asset to embed" to "reference to design against" — i.e., let a selected/attached image act as a visual brief routed into sk-interface-design's new context intake (F12), not just a literal asset pasted into the build.
- **SKIP:** A general document/PDF attachment pipeline — outside a UI-canvas CLI's job (negative knowledge).

### Refined verdict (dims 1 & 3)
| Dimension | sk-interface-design | mcp-magicpath | Biggest lever |
|---|---|---|---|
| 1. Inheritance | Endorsed-but-absent: add inherit-if-present + optional token emit (F10) | Near parity on consume; bridge repo→theme (F11) | sk-interface-design inherit step |
| 3. Context grounding | Subject+memory only; add structured context intake (F12) | Strong code context; extend image→visual-brief (F13) | sk-interface-design context intake |

## Sources Consulted
- design_principles.md (grounding, memory-as-hint, token brainstorm) [SOURCE: file:.opencode/skills/sk-interface-design/references/design_principles.md:37]
- sk-interface-design/SKILL.md (design_inventory framing as critique-against) [SOURCE: file:.opencode/skills/sk-interface-design/SKILL.md:151]
- magicpath_operations.md (themes/get-theme, repo design-foundation read, target-context phase, selected images) [SOURCE: file:.opencode/skills/mcp-magicpath/references/magicpath_operations.md:124]

## Assessment
- **newInfoRatio: 0.7** — Substantial new gap analysis and concrete ADOPT/ADAPT/SKIP per skill for two dimensions; reuses the iteration-1 baseline framing for ~30%.
- **Novelty justification:** The "endorsed-but-absent inheritance" insight (F10) and the consume-parity finding for magicpath themes (F11) are both new and reframe two of the five gaps.
- **Confidence:** High — every recommendation traces to an existing capability seam, so each is an extension rather than a new subsystem.

## Reflection
- **Worked:** Anchoring each recommendation to an existing seam (memory-as-hint, theme schema, repo-foundation read) keeps proposals low-risk and philosophy-safe.
- **Failed / ruled out:** "Generate and push themes back to MagicPath" (no CLI surface; platform scope creep) and "build an attachment store" (runtime already supplies paths) — both recorded as negative knowledge.

## Recommended Next Focus
Iteration 3: The hardest gap — **iteration / visual feedback (dim 2)**: canvas + inline-comment loop and fidelity verification. Determine what a real feedback loop looks like for each skill and whether sk-interface-design's self-critique can be upgraded to a rendered loop.
