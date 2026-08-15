# Iteration 2: Effort / thinking-level switching

## Focus

Q2: How should effort / thinking-level switching be presented and mapped to pi thinking levels with clear active state?

## Actions Taken

1. Re-read Claude effort+thinking nested menu pattern from prior fetch.
2. Re-read ChatGPT Instant/Medium/High effort-first naming and Cursor High/Medium/Low parameterized models.
3. Confirm pi RPC thinking commands from official `rpc.md`.
4. Cross-check Pi Remote: thinking blocks render as Disclosure; no level control exists.

## Findings

### F-006: Present effort as a sibling chip, not a replacement for the model label

- **Source:** [SOURCE: https://usingclaude.com/en/guides/features/claude-app-model-effort-thinking-settings] [SOURCE: https://forum.cursor.com/t/bug-report-the-model-dropdown-is-showing-the-wrong-list-high-low-medium-instead-of-the-models/167238] [SOURCE: iteration-001 F-003]
- **Pattern:** Claude nests Effort inside the model menu but keeps the closed control labeled with the model name. ChatGPT increasingly names tiers Instant/Medium/High. Cursor’s effort-first closed state loses glanceable model identity.
- **Why it helps:** Operators change effort more often than model; still must always know *which* model.
- **Apply:** Composer footer: `[ModelNick ▾] [Effort: Medium ▾] [Plan] [Send]`. Effort control is a React Aria `Select` or segmented control when ≤4 levels available.

### F-007: Map UI tiers to pi `ThinkingLevel` dynamically from the child

- **Source:** [SOURCE: https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/rpc.md] (`set_thinking_level`, `get_available_thinking_levels`, `cycle_thinking_level`; levels `off|minimal|low|medium|high|xhigh|max`)
- **Pattern:** Do not hardcode a fixed five-segment control. Call `get_available_thinking_levels` after model change; hide the effort chip when only `["off"]`.
- **Why it helps:** Avoids offering unsupported tiers (Claude hides Effort when model lacks it).
- **Apply:** Relay endpoints `thinking.list` / `thinking.set`; on `model.set` success, refresh levels and clamp current level into the new set. Show short labels: Off / Min / Low / Med / High / XHigh / Max.

### F-008: Prefer discrete select over silent cycle on phone

- **Source:** Pi TUI uses Shift+Tab cycle; Cursor `Cmd+Shift+/` cycle is brittle on mobile/hardware keyboards. [SOURCE: https://forum.cursor.com/t/model-thinking-effort-selection-is-missing/158529]
- **Pattern:** Mobile primary = visible menu with current level checked; optional hardware-keyboard cycle as progressive enhancement only.
- **Why it helps:** Cycles hide destination; phone users need explicit selection.
- **Apply:** React Aria `Menu` with `selectionMode="single"`; do not rely on Shift+Tab as the only path.

### F-009: Separate “show thinking transcript” from “effort level”

- **Source:** Claude distinguishes Effort from Extended Thinking toggle; Pi Remote already renders `thinking` blocks via Disclosure. [SOURCE: file:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:1205-1218] [SOURCE: https://usingclaude.com/en/guides/features/claude-app-model-effort-thinking-settings]
- **Pattern:** Effort changes how hard the model works; Disclosure collapse is a reading preference.
- **Why it helps:** Avoid conflating privacy/reading UX with model compute.
- **Apply:** Keep thinking-block Disclosure defaults from 044; do not couple them to effort chip.

## Ruled Out

- Hardcoded High/Medium/Low only — discards pi’s richer level set and model-specific availability.
- Effort-only closed button that hides model name — fails F-003.

## Assessment

- **newInfoRatio:** 0.78
- **Novelty justification:** Dynamic level list from `get_available_thinking_levels` + sibling-chip layout + explicit anti-cycle primary affordance for PWA.
- **Confidence:** High.

## Recommended Next Focus

Q3: Typed slash commands — `get_commands` inventory, `/` autocomplete overlay, safety (extension vs prompt vs skill), no second mutation authority.
