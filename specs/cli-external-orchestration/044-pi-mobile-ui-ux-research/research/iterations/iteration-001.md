# Iteration 1: Transferable Mobile Coding-Agent Patterns

## Focus

Q1: Which interaction patterns from leading mobile coding-agent and terminal clients transfer directly to Pi Remote's session list, transcript, compose, review, and inbox surfaces, and which require mobile-PWA-specific adaptation?

## Actions Taken

1. Inspected Pi Remote's current Home, Session, Review, Attention Inbox, compose, transcript-block, and responsive styling implementations.
2. Benchmarked Claude Code Remote Control, GitHub Mobile, and Replit Mobile using official documentation.
3. Benchmarked Warp's conversation management, prompt queueing, code-diff review, and agent-notification patterns using official documentation.
4. Benchmarked Blink Shell's touch, shell-switching, keyboard, and conditional Smart Keys patterns; attempted to retrieve Termius's official terminal/features documentation, but both candidate URLs returned 404.

## Findings

### F-001: Make the session list a status-first resume surface

The strongest shared pattern is not a miniature terminal. It is a resumable work list whose rows answer three questions at a glance: which task is this, what state is it in, and how recently did it change. Claude Remote Control exposes named sessions with an online status dot and synchronizes titles across local and mobile clients. Warp divides conversations into Active and Past and shows title, recency, and working-directory context. Replit starts with Recent Projects beside a new-task prompt. [SOURCE: https://docs.anthropic.com/en/docs/claude-code/remote-control] [SOURCE: https://docs.warp.dev/agents/local-agents/interacting-with-agents/] [SOURCE: https://docs.replit.com/platforms/mobile-app]

Pi Remote already carries state, block count, and relative time, but the only identity is a compact opaque ID. The card's explicit "Open" affordance is also hidden until hover or keyboard focus, so it is absent during ordinary iPhone touch use. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:664-691] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/style.css:620-633]

Direct transfer:

- Sort and group by actionable state: Needs input, Running, then Recent/Idle.
- Keep a persistent state label, relative update time, and unread/attention marker on every row.
- Make the whole row tappable while keeping a permanently visible disclosure affordance.

PWA/security adaptation:

- Do not copy path- or prompt-derived remote titles. Use an operator-assigned device-local alias or a safe ordinal such as "Session 3" alongside the opaque ID.
- Treat cached/offline state as a first-class row state, not only a global freshness annotation.

### F-002: Preserve typed transcript blocks, but add mobile reading controls

Warp models an agent conversation as queries plus blocks, surfaces context usage progressively, and separates active from past conversations. Replit separates Agent, Tools, and Tasks into touch-oriented panes. Pi Remote's typed blocks already provide the right semantic foundation: thinking is collapsed, plans are checklists, tool calls/results use distinct labels, diffs are line-colored, usage is structured, and live work has a dedicated indicator. [SOURCE: https://docs.warp.dev/agents/local-agents/interacting-with-agents/] [SOURCE: https://docs.replit.com/platforms/mobile-app] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:1119-1305]

Direct transfer:

- Retain semantic blocks rather than flattening the transcript into chat bubbles.
- Keep low-signal detail such as thinking, successful tool output, and usage collapsible while leaving errors, plans, and pending approvals prominent.
- Expose stable working, blocked, complete, and error states outside the scroll stream.

PWA adaptation:

- Add visible filter chips or a sheet for All, Messages, Tools, Changes, and Errors instead of relying on swipe-only panes.
- Add a "Jump to latest" control and a new-block count when the reader has scrolled away from the live edge; do not force-scroll during review.
- Keep a visible control alternative for every gesture because iOS edge swipes compete with browser/PWA navigation and are not discoverable to screen-reader or keyboard users.

### F-003: Split compose behavior into "steer now" and "queue next"

Warp explicitly distinguishes interrupting/steering the in-flight response from queueing a follow-up. Its queue is visible, per-conversation, ordered, editable, removable, and paused rather than discarded after an error. Claude Remote Control keeps input synchronized across terminal, browser, and phone. Replit adds voice input for mobile capture. [SOURCE: https://docs.warp.dev/agents/local-agents/interacting-with-agents/prompt-queueing/] [SOURCE: https://docs.anthropic.com/en/docs/claude-code/remote-control] [SOURCE: https://docs.replit.com/platforms/mobile-app]

Pi Remote currently presents one text area whose Enter key immediately sends, with Shift+Enter required for a newline. It optimistically inserts the prompt and restores the draft after rejection, but it does not explain whether a prompt steers the current turn or waits for the next turn. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:1003-1047] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:1078-1114]

Direct transfer:

- Make the submission mode explicit while the agent is busy: "Steer now" versus "Queue next."
- Show queued items immediately above the composer with edit, remove, and send-now actions.
- Preserve the draft and queue when sync fails, and require review before resuming a paused queue.

PWA adaptation:

- On touch keyboards, Return should insert a newline and the visible Send button should submit. External keyboards can use a documented Command+Enter shortcut.
- Use the platform's dictation keyboard rather than building a custom microphone path unless a later requirement justifies new audio permissions and redaction work.
- Do not copy Claude's file attachments or path autocomplete under the current redaction contract.

### F-004: Review should be exact, staged, and reversible, not merely confirmatory

Warp's diff review keeps proposed changes unapplied until explicit acceptance and supports line/hunk navigation, refine, edit, cancel, and accept. GitHub Mobile prioritizes pull-request review and can edit files in pull requests. These products make the object of approval inspectable before the approval action. [SOURCE: https://docs.warp.dev/agents/local-agents/code-diffs/] [SOURCE: https://docs.github.com/en/get-started/using-github/github-mobile]

Pi Remote already has the stronger security primitive: the card shows tool name, relay-redacted canonical input, digest, expiry, host-verification state, Deny, Approve once, and a bounded three-edit grant. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:507-615]

Direct transfer:

- Keep the exact action and its diff/input in the same review card as the decision.
- Structure long changes by file and hunk, with a summary first and explicit expansion into the complete redacted payload before approval.
- Keep Deny, Approve once, and bounded accept-edits semantically distinct; show submitted, host-verified, expired, revoked, and failed outcomes in place.

PWA adaptation:

- Use a sticky safe-area-aware action bar after the complete action has been exposed, rather than desktop arrow-key navigation or hover controls.
- Present the three-edit grant as a secondary, visibly broader permission with its remaining count and expiry adjacent to the action.
- Never adopt Warp's "Always allow" or auto-apply option because Pi Remote's mutation contract is approval-gated.

### F-005: Pi Remote's attention taxonomy already matches the market

Warp uses Complete, Request, and Error; Replit notifies when Agent needs help or finishes; Claude pushes for decisions and completed long-running work. This maps directly to Pi Remote's finished, needs_input, and error classes. Warp also provides All, Unread, and Errors filters, direct navigation to the affected session, and automatic read-on-open behavior. [SOURCE: https://docs.warp.dev/agents/capabilities/agent-notifications/] [SOURCE: https://docs.replit.com/platforms/mobile-app] [SOURCE: https://docs.anthropic.com/en/docs/claude-code/remote-control]

Pi Remote's content-free lookup items, reauthentication on open, preference toggles, and inbox fallback already implement the correct secure transport boundary. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:710-855] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/attention.ts:23-99]

Direct transfer:

- Add Unread and Errors filters, a mark-all-read action, and stable unread counts.
- Open each hint into the authoritative current session/review state and mark it read only after resolution succeeds.
- Suppress redundant push while Pi Remote is foregrounded, following Claude's presence-aware notification behavior.

PWA adaptation:

- Keep notification title/body content-free; only class and generic action language belong outside the authenticated foreground app.
- Treat stale lookup IDs as resolved/expired inbox state rather than a generic global error.
- Do not promise Replit-style iOS Live Activities from a PWA. Use the in-app inbox, Web Push, and optional app badge only where browser support is verified.

### F-006: Borrow mobile input ergonomics, not a terminal emulator

Blink Shell shows two useful mobile principles: horizontal shell switching is fast for expert users, and software-keyboard-only Smart Keys expose controls that are otherwise awkward on touch. It also retains keyboard shortcuts when hardware input is present. [SOURCE: https://docs.blink.sh/]

Direct transfer:

- Adapt controls to the active input method: touch-sized actions with the software keyboard, discoverable shortcuts with a hardware keyboard.
- Preserve drafts and current session position when moving between sessions.

PWA adaptation:

- Do not add terminal modifier rows, pinch-to-resize, or raw shell gestures to Pi Remote's semantic agent UI.
- If horizontal session switching is added, make it optional and provide visible Previous/Next or session-picker controls.

### Transfer Matrix

| Surface | Direct transfer | Mobile-PWA/security adaptation |
|---|---|---|
| Session list | Status grouping, recency, unread state, persistent disclosure | Device-local safe aliases; explicit cached/offline state; no prompt/path titles |
| Transcript | Typed blocks, progressive disclosure, stable run states | Visible filters, jump-to-latest, no forced scroll, no swipe-only navigation |
| Compose | Explicit steer/queue modes, visible editable queue, retry-safe drafts | Send button on touch, newline Return, optional hardware shortcut, no attachments/path autocomplete |
| Review | Exact payload/diff before acceptance, distinct outcomes, bounded grants | Sticky safe-area actions, progressive hunk review, no blanket auto-apply |
| Inbox | Request/Complete/Error triad, unread/error filters, direct navigation | Content-free push, foreground suppression, reauth-and-resolve, no assumed Live Activities |

## Questions Answered

- Q1 is answered at the interaction-pattern level. Claude, Warp, GitHub Mobile, Replit Mobile, Blink Shell, and Pi Remote supplied enough primary evidence to distinguish direct transfers from PWA/security adaptations.
- Termius-specific claims were not made because the two attempted official documentation URLs returned 404.
- Vercel/Netlify-specific mobile claims were not made because no primary mobile-client evidence was consulted within this iteration's action budget; generic CI-dashboard behavior was not treated as evidence.

## Questions Remaining

- Q2: Define the coherent navigation and information architecture across Home, Session, Review, and Attention Inbox.
- Q3: Validate transcript hierarchy, live-edge behavior, collapse defaults, and error/usage prominence.
- Q4: Refine exact-action review flows without weakening mutation approval or redaction.
- Q5: Specify touch-keyboard, external-keyboard, steer, queue, retry, and stop behavior for compose.
- Q6: Define foreground suppression, unread state, stale hints, and notification preference behavior.
- Product-coverage caveat: Termius and Vercel/Netlify remain unvalidated as named comparators; revisit only if later questions require a pattern not covered by the stronger primary sources above.

## Sources Consulted

- Pi Remote `App.tsx`, `attention.ts`, and `style.css` at the absolute source pointers recorded in the strategy.
- Claude Code Remote Control: https://docs.anthropic.com/en/docs/claude-code/remote-control
- Warp agent conversations: https://docs.warp.dev/agents/local-agents/interacting-with-agents/
- Warp prompt queueing: https://docs.warp.dev/agents/local-agents/interacting-with-agents/prompt-queueing/
- Warp code diffs: https://docs.warp.dev/agents/local-agents/code-diffs/
- Warp notifications: https://docs.warp.dev/agents/capabilities/agent-notifications/
- GitHub Mobile: https://docs.github.com/en/get-started/using-github/github-mobile
- Replit Mobile: https://docs.replit.com/platforms/mobile-app
- Blink Shell: https://docs.blink.sh/
- Failed retrievals: https://termius.com/documentation/terminal and https://termius.com/features (404).

## Assessment

- `newInfoRatio`: 0.88
- Novelty justification: This first evidence-gathering iteration established a five-surface transfer matrix, identified Pi Remote's existing alignment with market patterns, and isolated six PWA/security-specific non-transfers.
- Confidence: High for Claude, Warp, GitHub, Replit, Blink, and current Pi behavior because findings use primary documentation or source code. No confidence is assigned to Termius or Vercel/Netlify-specific behavior.

## Reflection

What worked:

- Comparing interaction primitives by Pi Remote surface produced more actionable evidence than comparing product feature lists.
- The strongest sources were direct analogues: Claude Remote Control for cross-device authority, Warp for agent-state mechanics, Replit for touch adaptation, GitHub for mobile review, and Blink for input-mode ergonomics.

What failed or was ruled out:

- Two likely Termius documentation paths returned 404, so no Termius behavior was inferred from marketing familiarity.
- Native Live Activities, content-rich pushes, attachments/path autocomplete, swipe-only navigation, terminal modifier rows, and blanket auto-apply were ruled out under the current PWA, redaction, accessibility, and approval constraints.

## Next Focus

Q2: Convert the transfer matrix into a coherent, low-effort mobile information architecture for sessions, live work, approvals, and attention, with explicit foreground-authority transitions.

## Recommended Next Focus

Map the four primary surfaces and their badges/deep links into one navigation model, then test how a user moves from a content-free attention hint to the authoritative session or exact approval and back.
