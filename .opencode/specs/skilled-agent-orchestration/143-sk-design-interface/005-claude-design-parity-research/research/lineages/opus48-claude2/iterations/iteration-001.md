# Iteration 1: Baseline Survey — Current Capabilities and the Five-Dimension Parity Framework

## Focus
Map what `sk-design-interface` and `mcp-magicpath` do today, lock the five Claude Design parity dimensions as the assessment axes (R1), and assign a first-cut current-state verdict per dimension per skill. This baseline frames iterations 2–4 (per-dimension deep gaps) and iteration 5 (scorecard + recommendation).

## Findings

### F1 — The parity target is a fixed, seeded capability set (not to be re-derived)
Claude Design's capabilities are seeded in the spec and are out-of-scope to re-derive: conversational generation of designs/prototypes/presentations; **org design-system inheritance**; **canvas + inline-comment iteration**; **context attachments**; **multi-format export**; **Claude Code handoff**; **named quality levers**. [SOURCE: file:.opencode/specs/skilled-agent-orchestration/143-sk-design-interface/005-claude-design-parity-research/spec.md:141] These collapse cleanly into the five R1 dimensions: (1) design-system inheritance, (2) iteration/visual feedback, (3) context grounding, (4) quality levers, (5) output/handoff. [SOURCE: file:.opencode/specs/skilled-agent-orchestration/143-sk-design-interface/005-claude-design-parity-research/spec.md:90]

### F2 — sk-design-interface is a *judgment* skill, not a *generation* skill
It produces a design **direction** (palette, type, layout, signature, copy) via a two-pass process: ground the subject → brainstorm a compact token system → critique against AI-default looks → build → self-critique. [SOURCE: file:.opencode/skills/sk-design-interface/SKILL.md:92] Its differentiator is the **anti-default philosophy**: reject the three clustered AI looks (cream+serif+terracotta; near-black+one acid accent; broadsheet hairlines) on any free axis. [SOURCE: file:.opencode/skills/sk-design-interface/references/design_principles.md:59] It owns the *look* and explicitly hands implementation to `sk-code`; it does not render or build. [SOURCE: file:.opencode/skills/sk-design-interface/SKILL.md:184]

### F3 — sk-design-interface already has token-system *thinking* but no token *artifact*
Step 2 brainstorms a token system as "4–6 named hex values" + display/body/utility faces + layout + signature — but as in-thinking planning material, not an emitted, machine-readable token file. [SOURCE: file:.opencode/skills/sk-design-interface/references/design_principles.md:61] There is no mechanism to ingest an existing design system, nor to emit one. This is the seed for the dimension-1 (inheritance) gap.

### F4 — sk-design-interface's "quality floor" is adjacent to "quality levers" but not user-selectable
It enforces an objective quality floor (responsive, visible keyboard focus, reduced motion) via `ux_quality_reference.md`, applied as a pass/fail gate after direction is set. [SOURCE: file:.opencode/skills/sk-design-interface/SKILL.md:115] This is a *floor* (binary, always-on), whereas Claude Design's "named quality levers" are *dials* the user turns. Adjacent capability, different shape — seeds dimension-4.

### F5 — sk-design-interface's iteration is self-critique-in-thinking, with an optional screenshot
The loop is "screenshot if possible, remove one accessory, confirm the quality floor" — a single self-review, not an external visual-feedback loop driven by rendered output and comments. [SOURCE: file:.opencode/skills/sk-design-interface/references/design_principles.md:73] Screenshotting is routed through `mcp-chrome-devtools`, and only post-build. [SOURCE: file:.opencode/skills/sk-design-interface/SKILL.md:188] Seeds dimension-2.

### F6 — mcp-magicpath already has a real canvas with revisions (partial dimension-2 parity)
The `code start` → `code submit` flow creates a **pending canvas revision**, scaffolds editable files, shows agent presence, and builds; revisions are addressable (`--revision`, `selectedRevisionId`). [SOURCE: file:.opencode/skills/mcp-magicpath/references/magicpath_operations.md:289] This is the closest existing thing to Claude Design's canvas — but the loop is open (submit → build → done), with **no inline-comment-driven iteration** and **no fidelity verification** of the built result against intent. [SOURCE: file:.opencode/specs/skilled-agent-orchestration/143-sk-design-interface/005-claude-design-parity-research/spec.md:143]

### F7 — mcp-magicpath already has design-system *inheritance* primitives (partial dimension-1 parity)
`list-themes`/`get-theme` returns a design system: `light`/`dark` CSS-variable maps, `fonts`, and a natural-language `prompt` field of styling instructions to follow. [SOURCE: file:.opencode/skills/mcp-magicpath/references/magicpath_operations.md:124] This is genuine design-system inheritance — but it is **consume-only** (no theme/token generation), and it lives inside MagicPath's account model, not derived from a repo's own tokens. [SOURCE: file:.opencode/specs/skilled-agent-orchestration/143-sk-design-interface/005-claude-design-parity-research/spec.md:143]

### F8 — mcp-magicpath's output/handoff is single-target (React/TS), which is its export story
`add` installs React/TypeScript source into `src/components/magicpath/`; non-JS targets must `inspect` + hand-translate. [SOURCE: file:.opencode/skills/mcp-magicpath/SKILL.md:210] There is no multi-format export (no design tokens, no Figma, no image/PDF/presentation) — the "handoff" is "React source you then adapt." Seeds dimension-5. Notably this *is* a form of "Claude Code handoff" already: it produces editable code in the user's repo.

### F9 — The two skills are already composed: magicpath depends_on the judgment skill
mcp-magicpath auto-applies sk-design-interface whenever it produces or shapes UI (canvas authoring, repo recreation, post-`add` adapt). [SOURCE: file:.opencode/skills/mcp-magicpath/SKILL.md:250] So parity improvements can be split cleanly: *judgment-side* gaps belong to sk-design-interface; *canvas/CLI-side* gaps belong to mcp-magicpath. This composition is the single most important structural fact for the recommendation.

### First-cut current-state verdict (to be refined in iterations 2–4)

| Dimension | sk-design-interface | mcp-magicpath |
|---|---|---|
| 1. Design-system inheritance | Token *thinking* only; no ingest/emit (F3) | Consume themes (CSS vars+fonts+prompt); no generation (F7) |
| 2. Iteration / visual feedback | Self-critique in thinking; optional post-build screenshot (F5) | Real canvas + revisions; no comment loop, no fidelity check (F6) |
| 3. Context grounding | Grounds in "the subject" + memory hints; no attachments (F2) | Reads target codebase/theme context; selected images→assets (F6/F7) |
| 4. Quality levers | Binary quality *floor*, not dials (F4) | None of its own; inherits floor via sk-design-interface (F9) |
| 5. Output / handoff | None (hands to sk-code) (F2) | React/TS install = code handoff; no multi-format export (F8) |

## Sources Consulted
- spec.md (topic, seeded Claude Design capabilities, R1 dimensions, known magicpath gaps) [SOURCE: file:.opencode/specs/skilled-agent-orchestration/143-sk-design-interface/005-claude-design-parity-research/spec.md:56]
- sk-design-interface/SKILL.md (process, quality floor, integration boundary) [SOURCE: file:.opencode/skills/sk-design-interface/SKILL.md:1]
- sk-design-interface/references/design_principles.md (anti-default calibration, token brainstorm, self-critique) [SOURCE: file:.opencode/skills/sk-design-interface/references/design_principles.md:1]
- mcp-magicpath/SKILL.md (install vs author directions, depends_on) [SOURCE: file:.opencode/skills/mcp-magicpath/SKILL.md:1]
- mcp-magicpath/references/magicpath_operations.md (themes, canvas code flow, Design Defaults) [SOURCE: file:.opencode/skills/mcp-magicpath/references/magicpath_operations.md:1]

## Assessment
- **newInfoRatio: 1.0** — First pass; the full current-state map and the five-dimension framework are all new to this packet.
- **Novelty justification:** Establishes the baseline verdict table and the judgment-vs-canvas split (F9) that the entire recommendation hangs on; nothing pre-existed in this lineage.
- **Confidence:** High on current-state facts (direct file evidence). The parity target is taken as seeded (not independently verified — that is the host's job at synthesis).

## Reflection
- **Worked:** Reading both SKILL.md files plus the two deep references gave enough evidence to assign every cell of the baseline table with a citation.
- **Failed / ruled out:** Independently re-deriving Claude Design's feature set — explicitly out of scope (spec §3); relying on the seeded summary is correct and avoids wasted iterations.
- **Ruled out:** Treating the two skills as one merge target — they have a clean depends_on boundary (F9), so recommendations must stay per-skill.

## Recommended Next Focus
Iteration 2: Deep gap on **design-system inheritance (dim 1) + context grounding (dim 3)** — the "input" side. Decide ADOPT/ADAPT/SKIP for theme/token ingest+emit and for context attachments, per skill, preserving the anti-default guardrail.
