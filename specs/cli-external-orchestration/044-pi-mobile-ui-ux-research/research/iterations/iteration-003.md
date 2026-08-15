# Iteration 3: Mobile Compose and Turn Control

## Focus

Q5: Which compose-box affordances lower friction for steering Pi from an iPhone keyboard while preserving explicit turn-taking, delivery certainty, and foreground authority?

## Actions Taken

1. Inspected Pi Remote's composer state, submit path, optimistic transcript update, idempotent retry ID, keyboard handler, and sticky mobile layout.
2. Inspected Pi Remote's architecture and feature catalog to identify the current steer-only transport, one-in-flight rule, redacted prompt boundary, and delivery-unknown policy.
3. Compared the current transport with Pi RPC's distinct prompt, steer, follow-up, abort, pending-count, queue-update, and agent-settled contracts.
4. Checked standards and component guidance for virtual-key labeling, multiline text entry, composition events, and virtual-keyboard viewport handling.

## Findings

### F-012: Derive the primary action from agent state and expose turn destination

The current label and placeholder combine "send" and "steer," while every relay submission uses `streamingBehavior: "steer"`. Pi RPC has three distinct destinations: a normal prompt when idle, `steer` while running (delivered after current-turn tool calls and before the next LLM call), and `follow_up` after the agent settles. It also exposes `pendingMessageCount` and `queue_update`. The composer should therefore derive its primary action from authoritative session state rather than ask the operator to manage a persistent mode: `Send` when idle and `Steer` when running. While running, a secondary `Later` action should enqueue a follow-up. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:1003-1113] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/docs/architecture.md:352-367] [SOURCE: https://raw.githubusercontent.com/badlogic/pi-mono/main/packages/coding-agent/docs/rpc.md]

The destination must be visible before dispatch: `Steer after current tool` and `Later, after Pi finishes` are clearer than a generic Send icon. After acceptance, show the item above the composer as `Steering (1)` or `Later (2)` until `queue_update` removes it. Allow edit, reorder, or remove only while the host still reports the item pending. Do not fabricate a durable client queue: an offline or stale draft is `Not sent`, and a queue control should not ship until the relay exposes Pi's steer/follow-up acknowledgements and queue updates.

### F-013: Let touch Return create lines; make dispatch a visible touch action

The current handler sends on unmodified Enter. That instruction assumes a hardware keyboard and makes multiline editing on an iPhone depend on modifier language that the touch keyboard does not present. Use a real multiline textarea that grows from roughly two lines to a bounded maximum, then scrolls internally. On touch keyboards, Return inserts a newline and the adjacent, always-visible button dispatches. Keep the focused editor and primary action above the keyboard without depending on the experimental VirtualKeyboard API, which MDN marks as limited and non-Baseline; rely on normal browser viewport handling and verify the installed PWA on physical iPhones. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:1086-1111] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/style.css:1232-1297] [SOURCE: https://developer.mozilla.org/en-US/docs/Web/API/VirtualKeyboard_API] [SOURCE: https://react-spectrum.adobe.com/react-aria/TextField.html]

Set the textarea's virtual-key hint to `enter`, not `send`, because Return's actual action is newline. MDN distinguishes `enter` for inserting a line from `send` for delivery. The separate button supplies the unambiguous send/steer action. Keep native selection, cut/copy/paste, dictation, autocorrection, and undo behavior; avoid replacing the textarea with a custom contenteditable editor. [SOURCE: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/enterkeyhint]

### F-014: Use one safe external-keyboard shortcut and respect text composition

For an attached iPhone/iPad keyboard, plain Enter should match touch behavior and insert a newline. `Command+Enter` should dispatch the state-derived primary action; `Control+Enter` may be an equivalent cross-platform shortcut. Shift+Enter does not need a special contract when plain Enter already creates a line. Never dispatch while an IME composition is active (`isComposing`), and leave Tab to normal focus navigation. Display the shortcut only when a hardware keyboard interaction is detected or in accessible help, instead of showing `Enter to send` to every mobile user. React Aria exposes composition and keyboard handlers while retaining a native TextArea. [SOURCE: https://react-spectrum.adobe.com/react-aria/TextField.html]

### F-015: Keep drafting available while one submission is in flight

Pi Remote currently disables the entire textarea during submission, even though it snapshots the submitted text before the request and already enforces one in-flight submission. This blocks the operator from writing the next steer during network latency. Keep the editor enabled after dispatch, move the submitted snapshot into a small pending row, and disable only additional dispatch until the relay accepts or rejects the request. New typing becomes a separate draft and must never mutate the pending payload or reuse its submission ID. Preserve one in-flight request at the transport boundary. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:1005-1047] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/docs/feature-catalog/pwa/compose-box.md:19-35]

Keep a separate in-memory draft per session when navigating among app surfaces. Do not persist raw prompt drafts to general browser storage under the current redaction policy: Pi Remote documents prompt fields as private text and warns that browser storage is a protected boundary. If durable drafts become a product requirement, they need an explicit encrypted-storage and retention contract rather than an incidental `localStorage` convenience. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/docs/security.md:102-106] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/docs/architecture.md:302-367]

### F-016: Undo, retry, and stop must describe what the host can still change

There is no honest "undo send" after Pi accepts a prompt. Offer Undo only for a host-reported queued item that has not been delivered; otherwise offer `Edit as new` or a corrective Steer. A rejected-before-acceptance request may restore the exact draft and retry with the same submission ID. A delivery-unknown result must say `Delivery unknown - check transcript` and must not automatically retry. Editing a known-rejected draft creates a new submission ID; changing text while retaining the old ID corrupts idempotency semantics. Pi Remote already restores the exact draft and ID after client-visible rejection, while its feature contract explicitly blocks automatic retry when delivery is unknown. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:1010-1047] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/docs/feature-catalog/pwa/compose-box.md:31-35]

Pi RPC exposes `abort` and emits `agent_settled`; Pi Remote's relay currently exposes neither as a compose control. Once the relay contract exists, show a separate `Stop agent` control only while running. One press may request stop without a confirmation dialog, but the UI must transition through `Stopping` and announce `Stopped` only after host acknowledgement/settlement. State explicitly that stop does not undo completed tool effects. Do not overload the dispatch button with Stop because an accidental mode/state race could turn a corrective steer into an abort. [SOURCE: https://raw.githubusercontent.com/badlogic/pi-mono/main/packages/coding-agent/docs/rpc.md] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/docs/architecture.md:352-367]

### F-017: Quick actions should fill a draft, never silently execute

When the textarea is empty, at most three state-aware chips can reduce iPhone typing: `Summarize progress`, `Explain the blocker`, and `Review the current plan`. Tapping a chip inserts editable text and focuses the editor; it never sends automatically. Hide chips once typing begins. Keep Stop, Retry, and queue management as explicit controls rather than prompt templates. Avoid automatically issuing slash/extension commands because Pi RPC documents that extension commands can execute immediately during streaming, bypassing normal steer/follow-up timing. [SOURCE: https://raw.githubusercontent.com/badlogic/pi-mono/main/packages/coding-agent/docs/rpc.md]

### Recommended Compose Contract

1. Idle: multiline draft plus `Send`.
2. Running: multiline draft plus primary `Steer` and secondary `Later`.
3. Pending submit: editor remains writable; dispatch controls wait for host acceptance; pending snapshot is immutable.
4. Host queue: visible destination and count; edit/remove only while host reports pending.
5. Touch keyboard: Return inserts newline; visible button dispatches.
6. External keyboard: Command+Enter or Control+Enter dispatches; Enter inserts newline; composition never dispatches.
7. Failure: exact draft restored; retry only under known-safe idempotency semantics; delivery-unknown never auto-retries.
8. Running control: separate `Stop agent`, then `Stopping`, then host-confirmed `Stopped`; no rollback claim.
9. Stale/offline: preserve draft, label it `Not sent`, and disable all dispatch/queue/stop mutations until foreground authority is live.

## Questions Answered

- Q5 is answered at the interaction-contract level for touch keyboards, external keyboards, send/steer/follow-up turn destination, pending drafts, queue visibility, quick actions, retry, undo, and stop.
- The lowest-friction safe default is state-derived `Send`/`Steer`, with explicit `Later`; it is not a persistent mode picker and not a single ambiguous Send action.
- Undo is valid only before host delivery. Stop is a separately acknowledged control and never a rollback promise.

## Questions Remaining

- Q2: Define coherent navigation and information architecture across Home, Session, Review, and Attention Inbox.
- Q3: Validate transcript hierarchy, live-edge behavior, collapse defaults, and error/usage prominence.
- Q6: Define foreground suppression, unread state, stale hints, and notification preferences.
- Q5 implementation dependency: expose Pi RPC follow-up, queue-update, abort, and agent-settled semantics through the relay before presenting those controls as authoritative.
- Q5 device validation: verify installed-PWA keyboard occlusion, focus retention, dictation, IME composition, and hardware shortcuts on the supported physical iPhone/iOS matrix.
- Q4 contract gap: confirm accept-edits inclusion and revocation semantics.

## Sources Consulted

- Pi Remote `App.tsx`: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:859-1115`.
- Pi Remote `style.css`: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/style.css:1232-1297`.
- Pi Remote architecture: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/docs/architecture.md:302-367`.
- Pi Remote security: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/docs/security.md:102-106`.
- Pi Remote compose catalog: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/docs/feature-catalog/pwa/compose-box.md:19-35`.
- Pi RPC mode: https://raw.githubusercontent.com/badlogic/pi-mono/main/packages/coding-agent/docs/rpc.md
- MDN `enterkeyhint`: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/enterkeyhint
- MDN VirtualKeyboard API: https://developer.mozilla.org/en-US/docs/Web/API/VirtualKeyboard_API
- React Aria TextField/TextArea: https://react-spectrum.adobe.com/react-aria/TextField.html

## Assessment

- `newInfoRatio`: 0.79
- Novelty justification: Iteration 1 identified steer versus queue as a transferable pattern; this iteration establishes the concrete Pi-native turn destinations, host-queue lifecycle, touch and hardware keyboard contracts, editable in-flight drafting, and strict undo/retry/stop semantics.
- Confidence: High for Pi RPC queue/abort semantics and the current Pi Remote gaps. High for native multiline and virtual-key labeling. Medium for viewport details until physical installed-PWA testing confirms iOS behavior.

## Reflection

What worked:

- Comparing the current always-steer request with Pi's actual RPC protocol converted vague compose affordances into explicit turn destinations.
- Separating the immutable pending payload from the next editable draft removed the false choice between transport serialization and continued typing.
- Treating undo and stop as host-state claims prevented optimistic UI from implying retraction or rollback.

What failed or was ruled out:

- A persistent Send/Steer mode toggle was ruled out because authoritative agent state already determines the safe primary destination.
- Plain Enter-to-send, a custom contenteditable editor, client-only durable queues, auto-send quick actions, automatic delivery-unknown retries, and optimistic "Stopped" states were ruled out.
- The VirtualKeyboard API was ruled out as a required iPhone layout dependency because it is experimental and non-Baseline.

## Next Focus

Q3: Define the transcript reading and live-edge contract that keeps the active turn, queued operator input, errors, and completed work legible above this composer.

## Recommended Next Focus

Map live-edge behavior and typed-block collapse rules against the composer states established here, including what the operator sees after sending a steer while reading older transcript content.
