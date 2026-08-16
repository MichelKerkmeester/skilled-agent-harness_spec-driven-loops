# 006-rich-content-blocks — reference screens

> Real Mobbin/Refero captures gathered via code mode. URLs are authoritative; do not invent.
> Mobbin (platform ios) returned **zero** results for every query run (incl. controls: "Claude code block chat", "terminal output card", "bash command output", "AI generated code preview", "code block copy button", "terminal app command line"). All cited screens below are therefore Refero records with canonical refero.design URLs. No URLs are fabricated.

## Screens

| App | Source (real URL) | Pattern / why relevant |
|-----|-------------------|------------------------|
| Claude | https://refero.design/screens/696b4637-83bc-4269-bbae-0f8b7e3f0127 | Claude assistant message on a **light beige surface (#E9E9DC) with black monospace text** — direct precedent for rendering command/code-like blocks on a warm parchment tone, not gray glass. |
| Claude | https://refero.design/screens/870c725f-5ba0-4810-a009-eeed635cca59 | Long-form article/reading view in Claude on light beige (#F5F3EB) with dark gray serif text — precedent for the text-"artifact" card and its full-screen reading state on parchment. |
| ChatGPT | https://refero.design/screens/7864950a-f990-4df5-a9b6-f7d2ddbaf6e0 | Light-mode ChatGPT chat containing a fenced **code block as a distinct block inside the transcript** — the in-stream code-card pattern with copy affordance. |
| ChatGPT | https://refero.design/screens/6646b440-abbf-4224-ad37-cc40669ba922 | Dark-mode ChatGPT chat with a code block rendered as a bordered, contained block within the message stream — high-contrast variant of the same pattern. |
| ChatGPT | https://refero.design/screens/8267a1fa-de55-4418-9afb-170cddf08590 | "Generate random line chart" conversation — an AI **generated artifact (chart/code) presented inside the chat** rather than as plain prose. |
| Google Gemini | https://refero.design/screens/531535c2-274d-4639-96de-6885969d23dd | Gemini chat showing a **code snippet plus a following explanation block** — "code card, then prose" rhythm for tool/command results. |
| Meta AI | https://refero.design/screens/fa7901f8-db92-49d7-863c-7e8c3608f20b | **Full-screen mobile code viewer** with syntax highlighting of raw HTML/source — the full-screen expand target for a code/artifact block. |
| Meta AI | https://refero.design/screens/af5ae5a1-2b57-4cfc-9bb7-58bf8c7d3cae | Minimalist **light-mode full-screen code viewer modal** (white canvas, no decorative chrome) — clean read-only expand state. |
| Raycast | https://refero.design/screens/64843269-d301-452d-9003-a13578681c70 | Mobile conversation/article view with **repeated rounded code cards** stacked in the content column — the repeated "command/output card" cadence. |
| Raycast | https://refero.design/screens/a73d03ff-c2ac-4aef-8442-3b5478560f3f | Single-column chat/documentation view **alternating rich-text headings/paragraphs with rounded code cards** — mixed prose + block layout for a transcript. |
| Craft | https://refero.design/screens/8ba36155-c199-4ac0-9057-2e5461b6db44 | Code snippet on a **dark block with line numbers and syntax highlighting** (keywords/strings/comments colored) — the block grammar for a Code card. |
| Craft | https://refero.design/screens/c0a6031a-4722-4abc-90eb-4dbce4f8fae2 | **Code snippet viewer + document preview + a bottom sheet of card-style options** — precedent for the Copy / card-action affordance layer on an artifact. |
| Perplexity | https://refero.design/screens/383b98bb-6c69-4ce0-a1ab-719e1e5e593b | Long-form reading screen on **light cream (#FAFAF4) with dark teal text** — editorial parchment-adjacent surface for the text-artifact full-screen state. |
| Weather Terminal | https://refero.design/screens/ee2c565f-a810-4289-823f-148b6d5f9f2e | **Terminal-aesthetic mobile screen** (monospace, dark, sparse) — concept precedent for the bash Command/Output block's monospace identity. |

## Reference-backed UI/UX direction

Concrete, adoptable specifics for Pi Remote's ink-on-parchment system (warm cream/sepia surfaces, ink typography, serif display, READ-ONLY over already-redacted content). All grounded in the screens above.

1. **Command/Output card grammar (Claude 696b4637, Raycast 64843269 / a73d03ff, Weather Terminal ee2c565f).** Render tool_call/tool_result as a labelled card, not a quiet disclosure: a muted ink-caps label row ("Command" / "Output"), monospace body inside a slightly darker **sepia inset well**, and a 1px ink hairline border — no gray glass fills, so hierarchy stays typographic. Command line on one or two lines; output truncates to ~5–8 lines with a trailing "Show N more" affordance. The card is the collapsed state of the existing full-screen viewer.

2. **Code block uses the same card grammar + restrained syntax (Craft 8ba36155, Meta AI fa7901f8, ChatGPT 7864950a / 6646b440).** Fenced code = monospace block on the sepia well with faint ink **line numbers** (Craft) and a 2–3 tint syntax set (ink keywords, sepia strings, muted comments) chosen to stay legible on parchment — never full color. A **Copy** button sits at the block's top-right (ChatGPT/Raycast code-card placement); a full-screen expand affordance sits beside it.

3. **Copy + full-screen are the only actions, and both are read-only (Meta AI af5ae5a1 / fa7901f8, Craft c0a6031a).** Copy is the single user-initiated mutation (OS clipboard via share sheet / navigator.clipboard) with a transient "Copied" ink confirmation; full-screen is a **push view reusing the F6 viewer shell** (Claude 870c725f / Perplexity 383b98bb reading-state precedent) with a back/close and the same card rendered edge-to-edge in a scroll container with pinch-to-zoom. Content stays host-redacted: no edit affordance, no host-filesystem access.

4. **Text-artifact card (Claude 870c725f, ChatGPT 8267a1fa, Perplexity 383b98bb).** Long text / goal prompt renders as an artifact card: ink label line, serif preview clipped at ~4 lines with a faint ink gradient fade, then a "Copy" + "Expand" row. Expand opens the full-screen reading view — beige/cream surfaces with serif body type are directly evidenced by Claude #F5F3EB and Perplexity #FAFAF4, so the expand state is a larger parchment page, not a new color system.

5. **Block states (progressive disclosure).** Streaming/typing fade-in for output still arriving; collapsed-by-default tall blocks with an explicit expander; "Copied" transient on the Copy button; a calm one-line muted-ink note (with strike/disabled treatment) if a block's content is missing or stale — matching the microcopy-driven calm of Raycast/Comet so a parchment surface never reads as broken.

6. **Gestures & a11y.** In full-screen: pinch-to-zoom on monospace content and horizontal pan for long lines with a sticky first column for line numbers (Craft). Min 44pt touch targets for Copy/Expand; copy success announced via VoiceOver; respects Dynamic Type with wrapping or horizontal scroll for code at large text sizes; `prefers-reduced-motion` keeps expand a push rather than a spring transition.

7. **Ink-on-parchment implementation notes.** Card surfaces: parchment base → inset well one step darker (sepia) → 1px ink hairlines; dividers as faint sepia rules; no chromatic fills — hierarchy from type weight, ink-caps labels, and whitespace, mirroring Claude's warm #E9E9DC / #F5F3EB surfaces with dark ink text (696b4637, 870c725f).

## Coverage gaps

- **No Mobbin captures.** Mobbin returned zero screens for all six queries (including control queries); no mobbin.com URLs could be cited. Refero carried the evidence load.
- **No real "bash Command → Output" paired card.** The closest real captures are Raycast/ChatGPT code cards and terminal-aesthetic apps (Weather Terminal); no single real screen shows Claude's exact paired command+output anatomy on iOS.
- **Copy button not directly legible in captures.** Refero descriptions confirm code blocks inside chat but don't reliably show the copy control itself; the Copy placement is inferred from the block grammar in Craft/ChatGPT screens and standard iOS behavior rather than a single explicit capture.
- **No in-chat artifact library or saved-blocks view** in the reference AI apps (Meta AI's "Artifacts" screens are a browsing hub, not an in-transcript copy/full-screen flow).
- **No usable screens for Grok, Pi, Manus, Dot, or Genie specific to this feature** surfaced under these queries; the Genie/Dot chat captures found were general assistant shells without code/command blocks. A future pass could target "tool call result" and "agent task list" queries directly against those apps.
