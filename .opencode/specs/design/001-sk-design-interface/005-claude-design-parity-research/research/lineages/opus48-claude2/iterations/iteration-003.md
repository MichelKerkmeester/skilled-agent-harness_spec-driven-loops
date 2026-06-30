# Iteration 3: The Hardest Gap — Iteration / Visual Feedback (dim 2)

## Focus
Deep gap analysis on Claude Design's defining capability — **canvas + inline-comment iteration**, plus implied fidelity (the rendered design is the source of truth) — and per-skill ADOPT/ADAPT/SKIP. This is the dimension where both skills are furthest from parity, so it gets the most weight in the scorecard.

## Findings

### F14 — sk-design-interface's iteration philosophy is deliberately the *inverse* of Claude Design's
Claude Design iterates **in the open**: render on a canvas, the user leaves inline comments, the AI revises. sk-design-interface deliberately iterates **in private**: "do a lot of this planning and iteration in your thinking, and only show ideas to the user when you have higher confidence it'll delight them," with self-critique as "screenshot if possible, remove one accessory, confirm the quality floor." [SOURCE: file:.opencode/skills/sk-design-interface/references/design_principles.md:67] [SOURCE: file:.opencode/skills/sk-design-interface/references/design_principles.md:73] This is a genuine philosophical tension, not a mere missing feature — and the recommendation must respect it rather than overwrite it.
- **ADAPT (highest value for this skill):** Upgrade the single self-critique into a bounded, rendered **render → critique → one targeted revision** loop *when a rendering surface is available* (paired sk-code build or magicpath canvas), screenshotting via `mcp-chrome-devtools` which the skill already names for this purpose. [SOURCE: file:.opencode/skills/sk-design-interface/SKILL.md:188] Keep the "reveal at confidence" default; the loop runs against the rendered artifact, not the user, so it does not violate the philosophy.
- **ADOPT (the inline-comment *model*, not the infra):** Adopt targeted-revision discipline — when feedback names one element, revise that element and leave the rest, which is exactly the "remove one accessory" restraint generalized. [SOURCE: file:.opencode/skills/sk-design-interface/references/design_principles.md:73]
- **SKIP:** A hosted canvas with live comment threads — that is the Claude Design web product, explicitly out of scope (spec §3, "do not replicate the web product wholesale"). [SOURCE: file:.opencode/specs/design/001-sk-design-interface/005-claude-design-parity-research/spec.md:78]

### F15 — mcp-magicpath has a canvas and a revision model, but an *open* loop with no fidelity gate
`code submit --wait` returns `completed`/`failed`; on failure the skill reads sanitized diagnostics and fixes allowed files. [SOURCE: file:.opencode/skills/mcp-magicpath/references/magicpath_operations.md:353] But that is **build** feedback, not **design fidelity** feedback — nothing checks whether the *rendered* result matches the design intent. The known-gaps line confirms: "no iteration loop, no fidelity verification." [SOURCE: file:.opencode/specs/design/001-sk-design-interface/005-claude-design-parity-research/spec.md:143] The success criterion stops at "`code submit --wait` returns a `completed` build" + responsive/interactive — i.e. it verifies the build compiled, not that it looks right. [SOURCE: file:.opencode/skills/mcp-magicpath/SKILL.md:289]
- **ADOPT (the single highest-value improvement in the whole study):** A **fidelity-verification step** after `code submit` completes — render the result (`view`/`share` → screenshot, or chrome-devtools), compare against the design intent (the inherited/brainstormed token system + brief), and iterate if it diverges. This converts the open loop into a closed one and directly fills the named gap.
- **ADAPT (the inline-comment analog):** The skill already has `selection` (the component/images the user has selected on the canvas) and revision targeting (`code start --component --revision`). [SOURCE: file:.opencode/skills/mcp-magicpath/references/magicpath_operations.md:106] A canvas selection + a text instruction *is* an inline comment in CLI form. ADAPT: route "selection + instruction" into a targeted revision against the exact revision the user is viewing (`selectedRevisionId`), instead of a fresh full rebuild.
- **SKIP:** Building the comment/threading infrastructure — it belongs to the MagicPath/Claude Design web surface, not the CLI (negative knowledge).

### F16 — The closed loop neither skill has alone, the composition already affords
sk-design-interface owns judgment + names `mcp-chrome-devtools` for screenshots [SOURCE: file:.opencode/skills/sk-design-interface/SKILL.md:188]; mcp-magicpath owns a canvas that renders to a viewable URL and depends_on sk-design-interface [SOURCE: file:.opencode/skills/mcp-magicpath/SKILL.md:250]. **Composed**, they already contain every part of a visual feedback loop: judgment (intent) → canvas (render) → screenshot (observe) → critique (compare) → targeted revision (act). The gap is not missing parts; it is a **missing protocol** that wires the existing parts into a loop. This is the cheapest path to dim-2 parity and the most important structural finding of this lineage.
- **ADOPT:** Define the loop as a small cross-skill protocol (intent → render → screenshot → compare-to-intent → revise-targeted → stop-at-confidence) rather than as new machinery in either skill.

### Refined verdict (dim 2)
| | Today | Target (Claude Design) | Closest existing seam | Headline move |
|---|---|---|---|---|
| sk-design-interface | One-shot self-critique, reveal at confidence (F14) | Open canvas + comment iteration | mcp-chrome-devtools screenshot | ADAPT to a bounded rendered render→critique→revise loop |
| mcp-magicpath | Open loop; build-only verification (F15) | Canvas + inline comments + fidelity | revisions + selection + view/share | ADOPT fidelity verification; ADAPT selection→targeted revision |
| composed | Parts exist, unwired (F16) | Closed conversational loop | depends_on + chrome-devtools | ADOPT a wiring protocol, not new infra |

## Sources Consulted
- design_principles.md (reveal-at-confidence, self-critique discipline) [SOURCE: file:.opencode/skills/sk-design-interface/references/design_principles.md:67]
- sk-design-interface/SKILL.md (chrome-devtools for screenshot self-critique; depends boundary) [SOURCE: file:.opencode/skills/sk-design-interface/SKILL.md:188]
- magicpath_operations.md (submit/wait build status + diagnostics; selection + revision targeting) [SOURCE: file:.opencode/skills/mcp-magicpath/references/magicpath_operations.md:353]
- mcp-magicpath/SKILL.md (success criteria stop at completed build; depends_on) [SOURCE: file:.opencode/skills/mcp-magicpath/SKILL.md:289]
- spec.md (named gaps; do-not-replicate-web-product boundary) [SOURCE: file:.opencode/specs/design/001-sk-design-interface/005-claude-design-parity-research/spec.md:143]

## Assessment
- **newInfoRatio: 0.65** — The fidelity-verification ADOPT (F15), the philosophical-inversion framing (F14), and the "missing protocol, not missing parts" insight (F16) are all new and high-impact; some reuse of the iteration-1 composition fact.
- **Novelty justification:** F16 reframes dim-2 parity from "build features" to "wire existing parts," which changes the whole cost/priority calculus of the recommendation.
- **Confidence:** High on the gap (the spec names it and the success criteria confirm build-only verification); medium-high on the loop protocol shape (design proposal, not yet validated by a build).

## Reflection
- **Worked:** Reading the success criteria of both skills exposed that "done" = "compiles + responsive," never "matches intent" — the precise definition of the fidelity gap.
- **Failed / ruled out:** Proposing a hosted canvas or comment threads for either CLI skill — out of scope and recorded as negative knowledge twice (F14, F15).
- **Ruled out:** Adding a heavyweight diff/visual-regression engine — the loop only needs a screenshot + judgment compare, which the skills already afford (F16).

## Recommended Next Focus
Iteration 4: The "output" side — **quality levers (dim 4) + output/handoff (dim 5)**: named levers vs the binary quality floor, token generation, multi-format export, and Claude Code handoff. Consolidate negative knowledge on what two CLI skills should deliberately leave out.
