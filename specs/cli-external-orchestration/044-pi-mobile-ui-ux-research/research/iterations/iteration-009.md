# Iteration 9: Mobile Transcript and Live-Edge Contract

## Focus

Q3: Which typed-block hierarchy, streaming affordances, collapse defaults, error and usage treatment, and scroll-anchor rules make a long-running Pi Remote transcript readable and steerable on an iPhone?

## Actions Taken

1. Read the externalized strategy and state log to preserve the Q2 navigation and Q5 compose contracts and avoid reducer-owned mutations.
2. Inspected Pi Remote's virtualized transcript, block renderer, running indicator, live announcement, and compose boundary.
3. Reconciled the iteration-1 typed-block recommendation with the concrete behavior now required for a long-running transcript.
4. Checked ARIA live-region guidance for non-disruptive dynamic updates and iOS VoiceOver caveats.

## Findings

### F-009-001: Make a turn the primary reading unit, while retaining typed blocks inside it

The current renderer presents every `DisplayTranscriptBlock` as an equal peer card. That preserves type but gives a long run no higher-level rhythm: user text, assistant text, thinking, plan, tool activity, diffs, and usage all compete in one sequence. Group each user submission and the following agent activity into a turn. Give the turn a compact header with operator/agent identity, time, and terminal state (`Working`, `Needs input`, `Complete`, or `Error`), then retain the existing semantic blocks inside it. Do not flatten tools and changes into chat prose. The active turn stays expanded; completed turns retain their user request and final assistant text but may collapse their execution detail as one group. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:1119-1283] [SOURCE: specs/cli-external-orchestration/044-pi-mobile-ui-ux-research/research/iterations/iteration-001.md:33-47]

This hierarchy gives the phone transcript three scan levels: turn, semantic block, detail. A compact filter sheet may temporarily show `Messages`, `Tools`, `Changes`, or `Errors`, but filtering must not rewrite the canonical order or hide the active turn's state. Pending approval remains a Review destination and may appear in Session only as a prominent content-free action marker; mutation buttons do not belong inside virtualized transcript rows.

### F-009-002: Apply signal-based collapse defaults, not one rule for every block type

Use these defaults when a turn first renders:

| Block | Active or unresolved | Settled successfully |
|---|---|---|
| User and assistant text | Expanded | Expanded |
| Thinking summary | Collapsed, with one-line label | Collapsed |
| Plan | Expanded while any item is open | Collapse to `n/n complete` after completion |
| Tool call | One-line name and running state; input detail collapsed | Collapsed |
| Tool result | Expanded when errored; otherwise one-line outcome | Collapsed when successful |
| File diff | Summary and file/change counts visible; patch collapsed by file/hunk | Summary visible; patch collapsed |
| Usage | Compact turn footer or session header | Collapsed; never a peer card by default |
| Unsupported block | Compact visible warning | Compact visible warning |

The current code collapses only thinking. Tool inputs, successful output, full patches, and the usage grid all render expanded, so low-signal detail consumes the same vertical weight as messages and errors. Preserve the operator's manual expansion choice for the mounted route, but do not persist transcript content or content-derived labels merely to restore disclosure state. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:1200-1283]

### F-009-003: Model the live edge as explicit `following` and `paused` states

`following` means the viewport is at the measured live edge. New content and size changes in the active streaming block keep the bottom pinned only in this state. An upward user scroll, focus into older content, or opening an older disclosure moves the reader to `paused`. While paused, incoming measurements must preserve the first visible settled block and its viewport offset. Show one safe-area-aware control above the composer: `N new blocks · Jump to latest`. Updating an existing streaming block changes the activity indicator but does not increment the block count. Activating the control scrolls after virtualizer measurement, resets the count, and returns to `following`.

Sending or queueing a steer while paused must not tear the reader away from older evidence. Show the immutable pending submission in the compose-adjacent pending row defined by Q5, and let the live-edge control account for the resulting transcript block when it settles. The current transcript has a virtualizer and a tail working indicator but no explicit follow state, unread-tail count, or jump control. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:1126-1194] [SOURCE: specs/cli-external-orchestration/044-pi-mobile-ui-ux-research/research/iterations/iteration-003.md:34-40]

### F-009-004: Restore a content-free block anchor, never a pixel-only or content-derived position

The Q2 warm return contract should capture the first fully visible settled block as `{sessionId, blockId, sequence, offsetPx, edgeMode}` in ephemeral route state. `blockId` is the primary anchor because the renderer already keys rows by stable block ID. `sequence` is a fallback after reconciliation if compaction or snapshot replacement removes that block. `offsetPx` restores the block's local viewport position only after the row is measured. If neither identity resolves, restore the nearest surviving sequence; if none exists, show the reconciled live edge rather than stale cached transcript content. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:1160-1172] [SOURCE: specs/cli-external-orchestration/044-pi-mobile-ui-ux-research/research/iterations/iteration-005.md:40-40]

Do not use a virtual row index, total `scrollTop`, timestamp alone, prompt excerpt, tool input, path, or diff text as the anchor. Indices and pixels drift as variable-height rows settle; content-derived anchors violate the redaction and persistence boundary. Cold restoration still begins from the canonical Session URL, reauthenticates, and reconciles authoritative state. The block anchor is a warm navigation aid, not permission to persist the transcript.

### F-009-005: Separate persistent error visibility from low-noise streaming announcements

An errored tool result remains expanded in place and adds a compact unresolved-error marker near the Session state with a `Jump to error` action. `Needs input`, pending approval, stale authority, and terminal error must remain visible outside the scrolling stream; usage must not. The current running indicator is appended inside the virtualized scroll extent, so it can disappear while the reader reviews older content. Move the stable run state to the Session chrome while keeping a lightweight tail marker at the live edge. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:1175-1190] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:1233-1265]

For assistive technology, keep an initially present, separate `aria-live="polite"` status region and coalesce rapid streaming updates into milestones such as `3 new blocks, agent working` or `Tool error, review required`. Do not move focus, read every token, or make routine blocks assertive. MDN recommends polite live regions for important but non-urgent updates, notes that assertive updates interrupt the current announcement, and warns that redundant `role="alert"` plus `aria-live` can double-speak in VoiceOver on iOS. [SOURCE: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions]

## Questions Answered

- Q3 is answered at the interaction-contract level: turns provide hierarchy; semantic blocks remain canonical; collapse defaults follow operator value; errors and unresolved actions stay prominent; usage recedes to a compact summary.
- The live-edge contract has two observable states. Only `following` pins new output; `paused` preserves the visible settled-block anchor and exposes a counted jump control.
- The Q2 return contract should restore a stable, content-free block/sequence anchor after reconciliation rather than a virtual index, raw scroll offset, or transcript-derived text.

## Questions Remaining

- Q6: Define foreground suppression, unread state, stale hints, and notification preference behavior.
- Physical iPhone testing must validate dynamic-height anchoring with the keyboard open, VoiceOver announcement cadence, disclosure expansion above the viewport, safe-area placement of `Jump to latest`, and the threshold used to enter or leave `following`.
- The relay/projector must confirm that settled `blockId` and `sequence` identities survive snapshot reconciliation and transcript compaction. If they do not, the protocol needs a non-content stable sequence before the return contract can be implemented.
- Product-coverage caveat: Termius and Vercel/Netlify remain unvalidated as named comparators; no claim in this iteration depends on them.

## Ruled-Out Directions

- A flat chat-bubble transcript was ruled out because it erases tool, plan, diff, and usage semantics.
- Forced scrolling after every streamed update or operator steer was ruled out because it destroys review position.
- Expanding every block, collapsing every completed turn wholesale, swipe-only filtering, per-token screen-reader announcements, and inline mutation approval in virtualized rows were ruled out as high-friction or unsafe.
- Pixel-only, virtual-index, timestamp-only, and content-derived return anchors were ruled out because they are unstable or violate the redaction boundary.

## Sources Consulted

- Pi Remote `App.tsx` transcript and compose implementation at the absolute source pointer recorded in the strategy.
- Iterations 1, 3, and 5 for the typed-block, compose, and warm/cold navigation contracts.
- MDN ARIA live-region guidance: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions

## Assessment

- `newInfoRatio`: 0.57
- Novelty justification: Prior work selected typed blocks and no forced scrolling; this iteration adds the concrete turn hierarchy, per-type collapse matrix, two-state live-edge behavior, stable return-anchor schema, and accessible error/announcement contract.
- Confidence: High for the current-renderer gaps and accessibility behavior because they are grounded in source code and MDN guidance. Medium for the exact anchor fallback until relay sequence stability is verified and physical iPhone behavior is tested.

## Next Focus

Q6: Define the foreground-suppression window, authoritative unread lifecycle, stale-hint settlement, badge counting, and notification preference defaults, while preserving content-free push payloads.
