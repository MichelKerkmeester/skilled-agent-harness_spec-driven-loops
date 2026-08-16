# Reference screens — model switcher & model picker bottom sheet

Real-screen evidence for the F1-change-model model-switcher sheet, gathered from Mobbin (platform ios) and Refero (platform ios). Note: Mobbin returned no results for any query (including a control query "onboarding signup"), so all cited screens below are Refero records with their canonical Refero URLs. No URLs are fabricated.

## Screens

| App | URL | Pattern |
|-----|-----|---------|
| Raycast | https://refero.design/screens/ad032d1f-1304-476b-8b47-f21a9efcfe4a | Translucent rounded "Models" bottom sheet over a blurred home; each model row = small left icon, bold title, muted one-line description, pill badge ("Vision"); "Auto" shown as default. Part of flow "Selecting AI model" (step 5/6). |
| Raycast | https://refero.design/screens/3f8d1ce3-b5e6-46c9-82d0-c0cb49aaa65a | Dark-mode "Models" sheet anchored to the bottom, occupying lower half to two-thirds, over a blurred/dimmed search launcher; drag handle + crisp section rows. |
| Raycast | https://refero.design/screens/d0b3a5f8-affb-485f-bb15-0072469892bd | Dark glassmorphism "Models" sheet — heavy blur/translucency, strong white heading vs mid-gray body contrast, concise microcopy under each model name. |
| Raycast | https://refero.design/screens/603ff711-bacb-461f-b000-1a175dbd498f | Model sheet layered over the search home — search field and avatar peek above the sheet's top edge, showing how a picker coexists with the launcher surface beneath it. |
| Comet | https://refero.design/screens/81a4e827-e5f4-4341-9d5c-1254c111cc07 | "Models" modal bottom sheet covering ~60–70% of screen: centered drag handle, left-aligned title, right-aligned circular close button; single-column vertical list of selectable AI models. |
| Comet | https://refero.design/screens/f43f377c-e6a4-4a50-9f76-f4bb08ca59f5 | Chat composer anchored above the iOS keyboard with a large serif display headline — precedent for warm, editorial type next to the model selector. |
| ChatGPT | https://refero.design/screens/2b92d450-1ddb-4456-8beb-7733a564d0a4 | Minimal chat input with a top context/model bar; light surface, high whitespace. Sits in flow "Chatting with AI model" (step 2/7). |
| ChatGPT | https://refero.design/screens/4ad4f27f-f62d-4556-80e5-1dac2b536522 | Dark chat screen with model label centered in the top bar, minimal chrome and high text contrast — model identity made visible without chrome weight. |

## Reference-backed UI/UX direction

Concrete direction for an ink-on-parchment model switcher, grounded in the screens above.

1. **Bottom-sheet anatomy from Raycast/Comet, on parchment.** Keep the picker a bottom sheet — centered drag handle, large rounded top corners, sheet covering ~60–70% of the screen, right-aligned circular close (Comet) plus drag-to-dismiss. Surface = warm parchment (cream/sepia paper tone) instead of white/gray glass; dim/blur the chat beneath through a parchment-bleed scrim rather than flat black.

2. **Ink-on-parchment row anatomy from Raycast.** Each model row: small left icon, model name in bold ink, one muted (faded-sepia) line describing the model's capability, and a small pill badge for special abilities (Raycast's "Vision" badge). The selected model gets an ink check or ring instead of a fill-color highlight, so hierarchy stays typographic, not chromatic.

3. **"Auto" default + current-model affordance.** Follow Raycast: the top row is the automatic/default option, and the currently active model is visibly marked inside the sheet. The chat top bar echoes the selection (ChatGPT centers the model label in the bar) so the active model is legible before the sheet even opens.

4. **Search/filter and provider grouping without a full-screen takeover.** Keep the sheet height bounded (Comet/Raycast ~60–70%) and put an inline search field at the top (Raycast's launcher-search precedent) so long model lists filter in place instead of expanding to full screen. Group rows by provider with small ink-caps section labels; a one-line capability hint per row is what lets a user pick mid-turn without guessing.

5. **Capability hints and switch-during-a-running-turn states.** Because selection is host-confirmed and never optimistic (never instantly swap the active model), the sheet must render pending/stale/error states: a muted "switching…" ink row with a thin progress affordance while the host confirms, a strike/disabled ink treatment for models that are stale or unavailable, and an inline error line if set_model fails — mirroring the calm, high-contrast, microcopy-driven communication Raycast and ChatGPT use, so the parchment surface never reads as broken or busy.
