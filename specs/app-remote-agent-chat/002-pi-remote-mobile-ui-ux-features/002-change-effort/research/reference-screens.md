# Reference screens — effort / reasoning-level selector

Real-screen evidence for the F2-change-effort effort picker, gathered via code mode from Mobbin (platform ios) and Refero (platform ios). Note: Mobbin returned zero results on every query (including control queries), so all cited screens below are Refero records with their canonical Refero URLs. No URLs, app names, or screens are fabricated.

## Screens

| App | URL | Pattern / why relevant |
|-----|-----|------------------------|
| Grok | https://refero.design/screens/06f7f4be-de00-486d-a093-302ca5a933c6 | "Customize Grok" sheet (light): centered bold title + right-aligned Save, "Enable Customization" toggle, and a 2×2 preset grid (Custom/Concise/Formal/Socratic) with the selected preset filled and bold. Closest real capture of the app where reasoning-effort/behavior customization lives. |
| Grok | https://refero.design/screens/a0c82c18-abc5-4922-9d76-f23aab175a30 | Same "Customize Grok" panel in dark mode: toggle + 2×2 preset grid with selected state highlighted by fill and border. Shows the control holding up across light and dark ink-on-parchment themes. |
| Raycast | https://refero.design/screens/77def010-772d-43d1-8fce-e57ad42185c9 | "Model" bottom sheet selecting an AI provider plus a specific model variant: large rounded sheet, one option per row with selection state. The closest real sheet to "pick a reasoning level" as a vertical list of choices. |
| Raycast | https://refero.design/screens/8684e932-9b60-49f5-841c-37bb012386d2 | Translucent frosted "Models" bottom sheet over a blurred search home; each row = small left icon, bold title, muted one-line description, "Auto" shown as the default. Row anatomy to copy for level rows. |
| Raycast | https://refero.design/screens/3f8d1ce3-b5e6-46c9-82d0-c0cb49aaa65a | Dark "Models" sheet anchored to the bottom, occupying the lower half to two-thirds of the screen over a blurred/dimmed launcher; drag handle + crisp section rows. |
| Raycast | https://refero.design/screens/84e26bf7-24c0-4bc5-b324-7bedb4f61ee2 | "Manage Models" settings list: single-column rows of model providers with an expanded provider card exposing per-item toggles — precedent for a settings-style list where each option can carry a switch/state. |
| Comet | https://refero.design/screens/81a4e827-e5f4-4341-9d5c-1254c111cc07 | "Models" modal bottom sheet (~60–70% height): centered drag handle, left-aligned title, right-aligned circular close, single-column selectable list on a warm cream surface (#FBFAF7) with a teal accent for the selected state — the closest tonal match to parchment. |
| ChatGPT | https://refero.design/screens/98e046b7-bb0f-407a-abf8-9aff7c13ce72 | "Customize ChatGPT" sheet: Cancel | centered title | Save header, horizontally scrollable "+ Witty" trait chips, a prompt textarea, and a collapsible "Advanced" section with capability toggles (Code, Canvas, Advanced Voice). Canonical cancel/save configuration sheet. |
| ChatGPT | https://refero.design/screens/1c84ebac-2019-454e-8e20-06283287bb81 | "Customize ChatGPT" personality/traits screen: a Personality dropdown (e.g. Cynic) with a one-line preview, plus scrollable pill chips and a multiline trait input. Dropdown + pill pattern for picking a configured behavior. |
| Perplexity | https://refero.design/screens/ff3f1027-abd0-45cd-974d-5dc7f50fefe5 | Settings modal on a light-beige surface (#E6E8E4) with dark-teal section headings and an "AI Model" dropdown (Perplexity / GPT-4 / Claude 2). Parchment-friendly settings modal with an inline select for model/behavior. |
| Clearful | https://refero.design/screens/b8128c0b-44b2-402c-bc2f-182f47d4cd59 | "AI Preferences" settings page: large-title header, explanatory paragraph, a rounded card with an "AI Features" toggle, and "Where is AI used" sections. Dedicated AI-preferences page structure to mirror. |
| Grok | https://refero.design/screens/fc8898e2-76c1-469b-bb7e-6c0270bfe283 | Grok chat with a top segmented toggle (Chat | Voice) — a composer/header-level segmented control precedent that maps directly onto a compact effort or "Think" toggle next to the input. |

## Reference-backed UI/UX direction

Concrete direction for an ink-on-parchment effort picker, grounded in the screens above and constrained by Pi Remote's fixed ink-on-parchment system and read-only (host-authoritative) security posture.

1. **Radio rows, not a slider or segmented adaptivity.** Comet and Raycast both render the picker as a single-column list of selectable options, and ChatGPT/Perplexity use dropdown/pill selects — but the F2 spec's decision (radio rows for 3–7 levels) matches Comet's single-column list best. Each level row: bold ink label, one muted sepia line of explanation, and a confirmed ink check on the selected row (never a fill-color highlight), keeping hierarchy typographic, not chromatic.

2. **Sheet anatomy from Comet/Raycast, on parchment.** Keep the effort picker a bottom sheet inside the existing Model and Effort sheet (one React Aria Dialog, no second overlay): centered drag handle, large rounded top corners, ~60–70% of screen height, right-aligned circular close plus drag-to-dismiss and swipe-down (Comet 81a4e827, Raycast 77def010/8684e932). Surface = warm parchment (cream/sepia paper tone ≈ Comet's #FBFAF7 / Perplexity's #E6E8E4) instead of glass; dim the chat beneath through a parchment-bleed scrim.

3. **Persist-selection chrome.** ChatGPT's Cancel | title | Save header (98e046b7, 1c84ebac) is the model for the sheet header; Grok's right-aligned Save (06f7f4be) confirms the pattern. F2 commits immediately but stays visually unselected until pi confirms — so the header should show a subtle pending affordance ("awaiting host…") on the requested row rather than a static Save, and flip to the confirmed ink check only on the confirmed value from the one-use-ticket path.

4. **Composer-level compact trigger.** Grok's top segmented Chat | Voice toggle (fc8898e2) and ChatGPT's model-in-top-bar precedent justify a compact effort readout in the Pi Remote header (`{model} · {effort}`) and the RuntimeStrip `Effort · High` summary button — both opening the same controlled sheet. Segmented controls should be avoided for the picker itself (radio rows are more legible for 3+ levels with descriptions), but a header pill is a legitimate trigger.

5. **Streaming/disabled & failure states, read-only posture.** While pi is streaming, effort rows render disabled with an inline reason (Clearful's explanation-under-toggle pattern, Raycast's settings rows) — never an optimistic swap, since F2 keeps the non-optimistic reducer and refuses to promise "next message" semantics that may be false for multi-call agent turns. Failures surface as cause-specific, recoverable read-only rows (muted sepia + inline line), mirroring Raycast/ChatGPT's calm microcopy rather than a terminal "Unavailable".

6. **Palette & a11y.** Map the beige family directly onto parchment: backgrounds ≈ #FBFAF7/#E6E8E4, ink ≈ #2C3E3A–near-black headings (Perplexity), body in faded sepia. Keep ≥4.5:1 ink-on-parchment contrast, mark selection by thickened ink stroke/check + full-row tap target ≥44pt, and expose each Radio via VoiceOver with label + description composed as one accessible string (matching React Aria RadioGroup semantics). Six rows plus header fit without scrolling at 430pt width.

7. **State persistence cue.** Perplexity's settings modal and Clearful's AI-preferences page both make the active choice visible after the sheet closes; Pi Remote should echo the confirmed level in the header/RuntimeStrip readout so the user sees the level that took effect on the last confirmed message, rehydrated on sheet open, foreground, and sync reconnect.

## Coverage gaps

- **Literal "reasoning effort" control not captured.** No returned screen shows ChatGPT's Low/Medium/High effort picker, Claude's thinking toggle, or Perplexity's effort selector. The closest real captures are Grok's "Customize Grok" presets and the Raycast/Comet model-selection sheets. Refero's descriptions are AI-generated; exact labels like "Reasoning effort" could not be confirmed from the captures themselves.
- **Mobbin returned zero results** on every query (including a control query), so no mobbin.com URLs are cited; all 12 cited screens are Refero records.
- **No real screens found for:** Dot, Manus, Genie, the Pi app itself, or OpenCode/Codex effort/thinking selectors; no "slider-style" effort control; no multi-select "thinking toggles" for stacking reasoning behaviors.
