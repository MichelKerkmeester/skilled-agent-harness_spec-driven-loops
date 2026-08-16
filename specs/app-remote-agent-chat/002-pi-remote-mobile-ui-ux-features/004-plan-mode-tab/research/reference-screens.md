# 004-plan-mode-tab — reference screens

> Real Mobbin/Refero captures gathered via code mode. URLs are authoritative; do not invent.

Feature: **Switch to plan mode incl. a Tab/keyboard affordance** — a mode the user flips into from the composer/keyboard region, where the agent proposes a reviewable plan that is never executed until the user approves (Pi Remote is read-only until granted).

Mobbin (platform ios) returned **zero** results for every query, including a control query ("AI chat app model switcher"), so no Mobbin URL is cited. All screens below are real Refero (refero.design) records returned by `refero_refero_search_screens` for the queries in the feature brief. No URLs are fabricated.

## Screens

| App | Source (real URL) | Pattern / why relevant |
|-----|-------------------|------------------------|
| Grok | https://refero.design/screens/ba836d0f-5ece-4d3e-a6ff-8cbf0aa0653a | Top navigation bar holds two **toggle buttons "Chat" and "Voice"** in the center — the exact "tab switch between two chat modes" pattern plan mode needs. |
| Grok | https://refero.design/screens/7d9e0c04-514d-4eb9-8e8c-8e4a6fde3060 | **Segmented control** with two options ("Chat" + speech icon, "Voice") anchored near the top — mode switch that reads as a real tab, not a buried setting. |
| Grok | https://refero.design/screens/edefb2c5-3c56-4165-8f32-8ffdf13e588a | Dark-mode **pill-shaped toggle** between Chat/Voice with the active segment clearly filled — direct precedent for a filled-ink active segment on a dark/ink surface. |
| Grok | https://refero.design/screens/a0adc2f0-e148-4950-85f6-2ab5a8d6c5c2 | Two-mode toggle sitting **above an on-screen keyboard** in a chat composer — shows the mode control and keyboard coexisting, i.e. the keyboard affordance. |
| Raycast | https://refero.design/screens/3f8d1ce3-b5e6-46c9-82d0-c0cb49aaa65a | Dark "Models" **bottom sheet** over a blurred launcher: drag handle, crisp sectioned rows, one-line description per option — mode/option selection as a bounded sheet. |
| Structured | https://refero.design/screens/d325da71-3edd-48f1-97c7-ece34e262889 | **AI planning assistant** ("Structured AI") rendering a plan-like task surface with a suggestion/similar-items card — how a propose-a-plan step presents on mobile. |
| Structured | https://refero.design/screens/dd39aff4-5364-4298-945d-195ba4728469 | Onboarding/intro modal introducing the planning assistant — precedent for a lightweight "here's what Plan mode does" first-run sheet. |
| Meta AI | https://refero.design/screens/af9c4797-d97a-4320-bc76-2cd3f0475a8b | AI **presentation-generator in progress** ("Loading & Connecting") — a long-running, multi-step generation the user watches but can interrupt; plan-then-execute feel. |
| Meta AI | https://refero.design/screens/aab32531-b454-462a-833b-525436228dca | Clean iOS **expanded bottom-sheet / modal panel** over a light warm-gray surface showing AI content for review — the plan-review surface as a sheet, not a new screen. |
| Wabi | https://refero.design/screens/0e100477-59d1-4b59-a935-0b8c6c3c8648 | Large rounded **confirmation bottom sheet combining a checklist, chat context and AI action** — strongest single reference for "review plan + confirm/execute." |
| Notion | https://refero.design/screens/c56e895b-3d09-4859-9830-a4319c694f0d | Centered dark **confirmation modal dialog** with rounded corners and shadow — the approve/cancel gate for a plan, kept small and non-destructive-looking. |
| Asana | https://refero.design/screens/be083e15-6b3f-47a1-afb8-85b63b235b20 | Dark **task-management checklist** ("Mission to the moon") — step list where items can be checked off, matching plan-step state (pending → done). |
| Comet | https://refero.design/screens/6bd88872-2bda-47c7-aa3b-2346c1efeb75 | Floating **text composer anchored just above the iOS keyboard** — the composer/keyboard region where the plan-mode tab should live, one tap away from typing. |

## Reference-backed UI/UX direction

Concrete direction for building plan mode in Pi Remote's ink-on-parchment system (read-only posture — nothing executes until the user grants it), grounded in the screens above.

1. **Segmented mode tab in the composer, above the keyboard.** Put a two-segment control "Chat | Plan" as a slim ink tab row sitting directly above the composer and keyboard (Grok Chat/Voice, Comet floating composer). Active segment = filled dark ink with parchment text; inactive = muted ink outline. Tab height ≈ 44pt (touch target ≥ 44pt). This is the Tab/keyboard affordance: switching is one tap while typing.

2. **Mode identity visible in the header, not just the tab.** When Plan mode is active, echo a small "Plan" pill/badge in the top bar (Grok keeps the mode label in the bar; ChatGPT centers the active model label) so the mode is legible even with the keyboard collapsed. Filled-ink on parchment for active state, muted for inactive.

3. **The plan is a review card in the stream, never auto-executed.** The agent's proposal renders as a parchment card in the conversation (Structured AI, Meta AI sheets): an ink-caps section label "Plan", a numbered step list, and a one-line summary — no runnable side effects attached. Card is expandable/collapsible so long plans don't dominate the thread.

4. **Approval gate as a confirmation sheet with an explicit, permission-granting CTA.** Follow Wabi's confirmation-sheet-with-checklist and Notion's small modal: a bounded bottom sheet showing the plan summary and two actions — a quiet "Revise" (muted ink text button) and a primary "Execute" (filled-ink pill). Because the app is read-only, the Execute pill is deliberately the only chromatically strong control, marking it as the one action that grants write access. Both actions are reachable with the keyboard dismissed (sheet sits above the keyboard per Comet).

5. **Rich plan-step states, typographic not chromatic.** Model the step lifecycle on Asana's checklist and Meta AI's progress: proposed (plain ink), reviewing (thin ink progress line, Meta AI "Loading & Connecting" feel), executing (checked steps struck through / check-filled, remaining steps muted), completed (full check), declined (struck through). Use ink weight, strike, and check glyphs instead of color fills so state reads on parchment without new colors.

6. **No destructive default; reversible entry.** Entering Plan mode must never truncate or alter the normal chat mode (Grok keeps both modes side by side, never one overwriting the other). Exiting Plan mode is always available from the same tab; sending a message while in Plan mode appends to the plan proposal rather than running anything — preserving the read-only posture.

7. **Keyboard + a11y.** The mode tab participates in the keyboard as an accessory row so it does not shift content (Comet). Expose the segmented control's selected state via accessibility trait and announce "Plan mode" on activation; keep labels (not icons only) per Grok's labeled segments. Contrast of filled-ink active segment vs parchment background ≥ 4.5:1.

## Coverage gaps

- **No Mobbin results at all** — every Mobbin query (including the control) returned an empty `screens` array, so zero Mobbin captures are cited. Refero carries the entire evidence base.
- **No iOS capture of an explicit "Plan mode vs normal" toggle in an agentic coding assistant.** OpenCode/Codex-style plan-then-execute toggles live in desktop/web UIs that don't appear in the iOS capture libraries. Grok's Chat/Voice segmented toggle is the closest real iOS mode-switch precedent and is used as the anchor.
- **No Manus-grade plan checklist on iOS found** — the task-list references are Asana/Structured (productivity), not an agent plan with per-step execution control.
- **No reference for the exact "approve → execute grants write access" semantics** in these captures; approval gates found are generic confirmation sheets, so the read-only → granted-write transition is designed from Notion/Wabi's confirmation patterns rather than a direct plan-mode reference.
