# Iteration 4: Mobile Chat Hierarchy and Interaction Polish

## Focus

This iteration compared current official ChatGPT, Claude, Cursor, and React Aria guidance with Pi Remote's transcript and composer. The goal was not visual mimicry; it was to identify the small number of patterns that make a long-running agent legible, steerable, and comfortable on an iPhone while keeping typed execution evidence intact.

## Findings

1. **Replace the event timeline with turn-oriented visual hierarchy, while preserving typed data.** Pi Remote currently gives every block a bordered card, header, timestamp, and timeline node, making ordinary assistant text, tool noise, usage, and decisive diffs compete equally. Strong chat products privilege the conversational turn and progressively disclose supporting work. Group consecutive blocks under one user turn: render the user prompt as a compact trailing bubble; render assistant prose as borderless, full-width reading text; nest thinking/tools/results/diffs/usage beneath it as typed supporting sections. This reduces chrome and scan cost without flattening the state model. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:1197] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/style.css:1351] [SOURCE: specs/cli-external-orchestration/044-pi-mobile-ui-ux-research/research/research.md:240]

2. **Collapse execution detail by signal, not by block type alone.** During a run, show one compact working group such as `Worked for 38s · 6 steps` with the current step visible. Default successful tool calls/results and usage to collapsed after settlement; keep errors, approvals, plan changes, and file diffs expanded or summarized prominently. Cursor mobile foregrounds completion status, artifacts, logs, and diffs rather than a flat raw event stream, while its planning UI keeps todos visible. This makes the transcript conversational at rest without hiding important audit detail. [SOURCE: https://cursor.com/changelog/ios-mobile-app] [SOURCE: https://docs.cursor.com/en/agent/planning] [INFERENCE: typed Pi blocks make deterministic signal-based grouping possible]

3. **Give streaming a stable, named phase with elapsed time.** Claude shows a `Thinking` indicator with a timer and an expandable thinking section. Pi Remote already has a `working-indicator` and a collapsible thinking summary, but the generic three-dot animation and “new blocks appear” copy do not explain the current phase. Render `Thinking · 12s`, `Running tests · 34s`, or `Writing response` from the newest unsettled typed block; update text in place, reserve its height, and expose only coarse announcements to `aria-live`. When settled, collapse it into the turn's working summary. [SOURCE: https://support.claude.com/en/articles/8664678-change-the-model-effort-and-thinking-settings] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:1164]

4. **Use reader-position-aware live-edge behavior.** Auto-follow only while the viewport is already near the bottom. Once the operator scrolls up, freeze their position and show a floating `N new · Jump to latest` button above the composer; tapping restores follow mode. Stable block ids and revisions should anchor the return position, not pixels or message text. This retains steering visibility during long output and respects the prior research's explicit rejection of force-scroll. [SOURCE: specs/cli-external-orchestration/044-pi-mobile-ui-ux-research/research/research.md:206] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/docs/feature-catalog/transport-and-state/transcript-projection.md:30] [INFERENCE: current TranscriptList virtualizes but tracks only block count]

5. **Make the composer an autosizing control dock, not a form card.** Replace the fixed three-row textarea and instructional footer with a 1–6 line autosizing textarea inside a single rounded surface. Put command/quick-action affordance on the left and one explicit circular Send/Steer/Stop control on the right; keep model, effort, and mode in a slim context row immediately above. ChatGPT consolidated many mobile tool icons into one button and a bottom sheet specifically to free composer space; Claude puts voice beside the text input and uses a lower-right Stop action. Pi Remote can defer voice but should adopt the spatial economy. [SOURCE: https://help.openai.com/en/articles/6825453-chatgpt-release-notes] [SOURCE: https://support.claude.com/en/articles/11101966-use-voice-mode] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:1078]

6. **Touch Return must create a newline; dispatch must be explicit.** The current plain-Enter handler sends, which is error-prone on a software keyboard and conflicts with a first-class multiline composer. On touch, Return inserts a newline and the visible control dispatches. A hardware keyboard may use Cmd/Ctrl+Enter, with a shortcut hint shown only when a hardware keyboard is detected. While Pi is running, label the action `Steer` or `Later` from host state; when running output can be stopped, the right control becomes an unmistakable Stop square. [SOURCE: specs/cli-external-orchestration/044-pi-mobile-ui-ux-research/research/research.md:174] [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/usage.md:68] [INFERENCE: one explicit touch action reduces accidental remote execution]

7. **Use immediate, state-preserving feedback for every compose action.** ChatGPT's immediate image preview and clearer edit-message states demonstrate a broader rule: acknowledge what the user just did without replacing it with an ambiguous placeholder. Pi Remote should preserve an immutable pending-submit snapshot in the transcript while keeping a new draft editable; show `Sending…`, `Accepted`, or `Delivery unknown—do not retry` on that snapshot. A rejected submit restores the exact draft. Model/mode changes and slash commands use the same local-pending/host-confirmed pattern. [SOURCE: https://help.openai.com/en/articles/6825453-chatgpt-release-notes] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/docs/feature-catalog/pwa/compose-box.md:31]

8. **Turn the empty state into a safe starting surface.** `No transcript blocks are available yet` is operationally correct but inert. Show a restrained greeting, current connection/model/mode context, and three action chips that fill the draft: `Explain this project`, `Review current state`, and `Plan the next change`. Never auto-submit. ChatGPT's cleaned-up mobile web deliberately centers the composer when the conversation is empty; Pi Remote should similarly make the next action visually primary, but retain the session status and redaction boundary. [SOURCE: https://help.openai.com/en/articles/6825453-chatgpt-release-notes] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:1144]

9. **Use restrained typography and surfaces rather than copying brand styling.** Preserve the existing OKLCH light/dark tokens and single accent, but reduce the oversized session heading on the chat screen, remove the decorative timeline rail, and adopt a compact rhythm: 16px body, roughly 1.6 line-height, 16px side gutters, 8/12/16/24px spacing steps, and a reading width around 42–48rem. Reserve raised cards for tool groups, diffs, plans, alerts, and the composer; assistant prose sits on canvas. This creates the quiet density associated with Claude/ChatGPT without introducing a second accent, gradients, or heavy shadow. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/style.css:11] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/style.css:1201] [INFERENCE: hierarchy follows from current equal-card density rather than proprietary pixel measurements]

10. **Make motion functional, interruptible, and optional.** Use only short opacity/position transitions for sheet entry, row reconciliation, and the live-edge button; do not animate token-by-token text, continuously pulse the composer, or move settled content. Pi Remote's global `prefers-reduced-motion` override is already strong and should remain authoritative. React Aria components provide interaction and assistive-technology behavior while remaining style-agnostic; on small screens, command/model pickers should use dialog/tray-style sheets rather than fragile tiny popovers near the keyboard. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/style.css:1810] [SOURCE: https://react-spectrum.adobe.com/react-aria/.../getting-started.html] [SOURCE: https://react-spectrum.adobe.com/v3/ComboBox.html]

11. **Keep secondary response actions quiet and contextual.** ChatGPT exposes response actions through long press on mobile. Pi Remote should similarly avoid a permanent icon row under every block: long press or a single overflow action on settled user/assistant turns can offer Copy, Retry, Edit-and-resend, and Jump to related diff, while tool blocks keep only Expand/Collapse. Destructive or authority-changing operations remain explicit buttons elsewhere. [SOURCE: https://help.openai.com/en/articles/8142208-chatgpt-android-app-faq] [INFERENCE: contextual actions reduce persistent chrome in a dense typed transcript]

## Ruled Out

- Applying the same card/header/timestamp treatment to every block.
- Hiding errors, approvals, plan changes, or diffs inside a generic “activity” collapse.
- Token-by-token animation or forced follow while the reader is reviewing earlier content.
- Plain Enter dispatch on the iPhone keyboard.
- A permanent row of model, effort, commands, tools, voice, and mode icons inside the composer.
- A decorative visual rebrand, multi-accent palette, or glass-heavy surfaces.
- Empty-state quick actions that submit immediately.

## Dead Ends

- Official product documentation describes current controls and behavior but does not publish exact type scales, padding, or color values. Numeric styling recommendations are therefore implementation-oriented inferences grounded in Pi Remote's existing tokens, not claims about proprietary design specs.
- Claude mobile documentation is strong for model/thinking/voice but sparse on transcript spacing and response menus; ChatGPT and Cursor primary sources cover those interaction categories more directly.

## Edge Cases

- A streaming tool error must immediately escape a collapsed working group and become visible without changing the operator's scroll position.
- `N new` counts new/revised user-significant blocks, not every token delta.
- Dynamic composer growth must keep the Send/Stop control visible above `env(safe-area-inset-bottom)` and must not obscure the live-edge button.
- Large diffs and code remain independently scrollable; horizontal gestures must not trigger navigation.
- Reduced-motion mode still receives instantaneous state changes and textual progress, only without spatial animation.

## Sources Consulted

- OpenAI ChatGPT release notes and Android app FAQ
- Claude model/effort/thinking and voice-mode help
- Cursor iOS mobile changelog and planning documentation
- React Aria/React Spectrum ComboBox and getting-started documentation
- Pi Remote `App.tsx`, `style.css`, transcript projection, and compose-box documentation
- Earlier Pi Mobile UI/UX research packet 044

## Assessment

- New information ratio: 0.68
- Novelty justification: The pass translated current mobile interaction evidence into a coherent turn-grouping, live-edge, composer, empty-state, type, surface, and motion specification for the existing typed transcript.
- Questions addressed: comparative mobile patterns that materially improve scanning, streaming, composer ergonomics, and visual polish.
- Questions answered: comparative mobile patterns that materially improve scanning, streaming, composer ergonomics, and visual polish.

## Reflection

- What worked and why: primary release/help documentation exposed the interaction intent behind mobile controls, while the current CSS and prior research made the Pi-specific deltas measurable.
- What did not work and why: product docs do not provide proprietary pixel specs, so the pass deliberately separated confirmed interaction patterns from inferred numeric styling guidance.
- What I would do differently: use the final iteration solely to reconcile dependencies, sequencing, and measurable acceptance checks rather than discover more visual references.

## Recommended Next Focus

Synthesize the control-plane and visual findings into a phased implementation plan, data contracts, component map, safety invariants, and objective mobile acceptance checks.
