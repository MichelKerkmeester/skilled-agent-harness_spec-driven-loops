# Pi Remote Mobile UI/UX — Deep Research Synthesis

> **Deep-research single-executor run** — 10 iterations (9 complete, 1 error), executor `cli-opencode` (`openai/gpt-5.6-sol-fast`, high, `--variant high`), session `62836e1f-705d-4d35-b0f1-de74f57a4289`, generation 1.
> Stop policy: `max-iterations` (convergence threshold 0.05 was telemetry-only; convergence mode `default`).
> [SOURCE: file:specs/cli-external-orchestration/044-pi-mobile-ui-ux-research/research/deep-research-config.json]
>
> **Topic:** improve the UI/UX and ease-of-use of the "Pi Remote" mobile PWA — an installable iPhone PWA (Vite + React 19 + Tailwind 4 + React Aria) that remote-controls the Pi coding agent over a Tailscale tailnet — across its four surfaces (Home session list, Session typed-block transcript, Review approval card, Attention Inbox), grounded in reference patterns from comparable mobile apps and the current implementation. This research is **research-only**: it does not proceed to implementation.

---

## 1. Executive Summary

Pi Remote's strongest opportunities are to make the **first screen and the high-stakes actions say exactly what they mean**, give the **long-running transcript a semantic hierarchy it can restore**, and keep **attention content-free and low-noise** while preserving foreground authority.

Ten iterations (nine with findings) synthesized 112 key findings from 29 ruled-out directions, grounded in the current implementation (`App.tsx`, `state.ts`, `relay.ts`, `attention.ts`, `style.css`, `docs/`) and primary references from Warp agents/notifications, Claude Code Remote Control, GitHub Mobile, Replit Mobile, Blink Shell, OWASP, RFC 7009, MDN (History API, notificationclick, live regions, VirtualKeyboard, enterkeyhint), and React Aria. Termius and Vercel/Netlify could not be validated as named comparators (404/unavailable primary pages) and are flagged as coverage gaps, not adopted patterns.

Consolidated adoption model per surface:

1. **Information architecture (Q2):** Use **two persistent roots — `Sessions` and `Attention`** — rather than four peer destinations. A live Session is a detail under Sessions; exact-action Review is a task detail under Attention. One URL-addressable route state replaces independent surface booleans; a content-free hint resolves through an authenticated barrier (`/attention/:lookupId`) to authoritative Session or Review state, never becoming an authority surface. Warm activation restores the prior place; cold activation returns to Attention. [ITER-005: F-018..F-023]
2. **Session list (Q1):** Reframe Home/Sessions as an **action-first priority queue** (`Needs you`, `Working`, `Recent`), not a recent-items grid, with status derived only from coarse relay state and attention/approval counts. [ITER-001]
3. **Transcript (Q3):** Keep a **turn-oriented typed-block hierarchy** with user/assistant text expanded, settled tool/usage machinery collapsed behind type-labelled disclosures, errors and pending approvals always expanded, and a **two-state live edge** (following vs paused with an `N new blocks / Jump to latest` control). Preserve DOM order, block timestamps, and a **content-free block-sequence anchor** for safe return restoration — never pixel-only or content-derived anchors. [ITER-009]
4. **Compose (Q5):** Derive **`Send` / `Steer` / `Later`** actions from session state; touch Return inserts newline, modified-Enter dispatches; keep an editable draft beside the immutable pending submit; bind undo/retry/stop to host semantics; quick actions fill drafts only. [ITER-003]
5. **Review / approval (Q4):** Present an **"Exact redacted action"** card (never "full action" language), progressive evidence grouped by file/argument with a persistent decision summary, direct Deny/Approve-once actions (no ritual confirmations), in-place settlement that preserves uncertainty (never auto-retry), and **accept-edits as a separate future-authority grant** behind a secondary "Allow a short edit run" action with bounded presets, host-time status, and host-confirmed one-tap revoke. Only allowlisted host-generated categorical/cardinality descriptors are privacy-safe; predictive impact wording requires typed tool semantics and revalidated, approval-bound preconditions. [ITER-002, ITER-006, ITER-007, ITER-008]
6. **Attention (Q6):** Model a **server-owned device receipt lifecycle** with leased foreground/typing suppression, dual indicators (unread vs unresolved) that never auto-clear, two-layer dedupe with bounded stale retention, class-level grouping (`Needs action` first, then `Updates`, then `Errors`), and per-device push-only preferences that never hide authoritative receipts. [ITER-010]
7. **Accessibility and ergonomics:** Touch-sized targets with the software keyboard and discoverable hardware-keyboard shortcuts, coalesced live-region announcements, reduced-motion counter updates without animated scrolling, and separated high-stakes targets. [ITER-001, ITER-009]

Every recommendation preserves Pi Remote's four security boundaries: redaction everywhere, mutation approval-gated, foreground authority, and content-free push. No recommendation offers a raw-value reveal, an inline mutation from Attention/push, or a second weaker redaction boundary.

## 2. Background

Pi Remote is an installable iPhone PWA that remote-controls the Pi coding agent over a Tailscale tailnet. Current surfaces: (1) Home = a session list of running/idle session cards; (2) Session = a typed-block transcript rendering text, thinking, plan, tool_call, tool_result, file_diff, and usage blocks with live streaming, plus a compose box to send and steer prompts; (3) Review = an exact-action approval card (approve, deny, accept-edits); (4) Attention Inbox = content-free push hints (needs_input, finished, error). Design constraints: restrained tokens, one accent, light and dark, prefers-reduced-motion, keyboard and screen-reader support via React Aria. Security constraints: mobile-first foreground authority, redaction everywhere, mutation approval-gated, content-free push. This research grounds concrete UX improvements in real reference patterns plus the actual implementation rather than assumptions.

## 3. Objectives

1. Identify interaction and information-architecture patterns worth adopting from mobile coding-agent clients, terminals, CI/CD, remote-development, and agent-control/remote-desktop apps (Q1).
2. Define one coherent navigation and IA model across Sessions, Session, Review, and Attention with deterministic return paths (Q2).
3. Define how streaming typed-block transcripts should behave on a small iPhone screen: hierarchy, collapse defaults, live edge, errors, anchors (Q3).
4. Balance one-thumb approval speed against exact-action safety and redaction truthfulness, including the accept-edits grant contract (Q4).
5. Define compose-box affordances for steering from an iPhone keyboard with explicit turn-taking and delivery certainty (Q5).
6. Design attention patterns for a content-free push-hint inbox without alert fatigue or content leakage (Q6).

## 4. Methodology

Ten deep-research iterations dispatched via `cli-opencode` (`openai/gpt-5.6-sol-fast`, high) ran the loop protocol: state read → focused investigation → evidence iteration → reducer refresh → convergence/graph upsert → synthesis. Iteration 4 (initial Q2 navigation pass) errored during artifact write (`apply_patch` could not match the long JSONL line); the loop re-dispatched it once, recorded it as `error` (per `redispatch_once`), and continued. Iteration 5 re-covered Q2 navigation successfully.

Evidence came from the current Pi Remote implementation at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src` (App.tsx, state.ts, relay.ts, attention.ts, style.css, auth.ts, cache.ts, main.tsx, public/service-worker.js) and the design docs under `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/docs` (architecture.md, security.md, operations.md, platform-support.md, incident-playbooks.md, feature-catalog), plus primary references: Warp agents and notifications, Claude Code Remote Control, GitHub Mobile, Replit Mobile, Blink Shell, OWASP transaction authorization and logging/redaction guidance, RFC 7009, MDN (History API, ServiceWorkerGlobalScope notificationclick, ARIA live regions, enterkeyhint, VirtualKeyboard API, document visibility state), and WAI ARIA tabs. Apple HIG pages returned only a JavaScript-required shell and were not used as evidence. Findings carry `[SOURCE: ...]` citations in the iteration files; this synthesis deduplicates them into per-surface findings and a consolidated adoption order. The spec-kit memory daemon was wedged during bootstrap (MCP and warm-CLI both timed out, exit 75); prior-context injection was skipped and the loop relied on direct file/WebFetch evidence.

## 5. Findings: Information Architecture and Navigation (Q2)

### F-018/F-024: Two persistent roots — Sessions and Attention; Session and Review are details

- **Source:** Warp notification mailbox (All/Unread/Errors filters, direct session jumps, per-session attention indicators) and Claude Code Remote Control (named session list, online state, direct session URLs, synchronized devices, focus-aware push suppression). [SOURCE: https://docs.warp.dev/agents/capabilities/agent-notifications/] [SOURCE: https://docs.anthropic.com/en/docs/claude-code/remote-control]
- **Current evidence:** Pi Remote exposes Home, Inbox, and Review as peer header actions while only Session has a durable route; `popstate` restores only `selectedSessionId`, so browser Back/Forward cannot reconstruct Review or Inbox state; Review and Inbox label Back "Back to sessions" regardless of origin. [SOURCE: file:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi%20Mobile/apps/pi-remote-web/src/App.tsx:67-75,134-165,248-303,383-425,509-515,731-738]
- **Pattern:** Two persistent roots: **Sessions** (work map) and **Attention** (interruption/triage map). A live Session is a Sessions detail; exact-action Review is an Attention task detail. A bottom safe-area-aware primary nav with a bounded Attention count; contextual Back in details.
- **Why it helps:** The operator always knows where they are and what Back means; work and interruptions are not conflated.
- **Pi Remote application:** Replace independent surface booleans with one route state; derive every surface from it; implement roots as navigation links (not ARIA tabs — that pattern is for layered panels, [SOURCE: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/]).

### F-019/F-025: One addressable route state and History API contract

- **Source:** MDN History API. [SOURCE: https://developer.mozilla.org/en-US/docs/Web/API/History_API/Working_with_the_History_API]
- **Current evidence:** Independent `selectedSessionId`, `reviewOpen`, `reviewFocusId`, `inboxOpen` booleans; header opens do not call `pushState`. [SOURCE: file:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi%20Mobile/apps/pi-remote-web/src/App.tsx:71-75,134-165]
- **Pattern:** Route map: `/` Sessions; `/session/:sessionId`; `/attention`; `/attention/review`; `/attention/review/:approvalId`; `/attention/hint/:lookupId` (short-lived resolver, replaced after resolution). Every in-app transition creates a history entry; initial entry normalized with `replaceState`; Back/Forward restores full route state from `popstate`.
- **Why it helps:** Browser history, PWA relaunch, React rendering, and screen-reader page announcements share one source of truth.
- **Pi Remote application:** Never persist transcript/prompt/path/canonical-argument content in history state or URLs (redaction boundary). [SOURCE: file:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi%20Mobile/docs/security.md:100-106]

### F-020/F-026: Content-free hint resolves through an authenticated barrier

- **Source:** MDN notificationclick model. [SOURCE: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/notificationclick_event]
- **Current evidence:** Pi Remote already accepts an opaque lookup ID, reauthenticates through `openAttentionHint`, and replaces the hint URL only after fresh relay resolution. [SOURCE: file:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi%20Mobile/apps/pi-remote-web/src/App.tsx:140-165,710-780] [SOURCE: file:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi%20Mobile/public/service-worker.js:58-93] [SOURCE: file:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi%20Mobile/src/attention.ts:35-44]
- **Pattern:** `content-free hint -> Checking current state -> live Session or exact Review` with no actions on the hint/resolver screen. Stale/expired/revoked/settled lookups resolve to Attention with an inert "No longer current" receipt, never a generic error or old action.
- **Why it helps:** A push is a pointer into a foreground resolution pipeline, never an authority jump.
- **Pi Remote application:** Keep mutation controls disabled until live auth, epoch, revision, digest, and expiry checks pass. Navigation success is not authority.

### F-021/F-027: Warm and cold return contract

- **Source:** MDN History API + Pi Remote security contract. [SOURCE: https://developer.mozilla.org/en-US/docs/Web/API/History_API/Working_with_the_History_API]
- **Pattern:** Warm open from Session returns to that Session restoring the safe transcript anchor, expansion state, and in-memory draft; warm from Sessions/Attention returns to that root with scroll/filter position; cold notification launch: Back goes to Sessions (from Session) or Attention with next unresolved selected (from Review). Settling one review may advance within the queue; explicit Done/Back returns through stored origin. If origin is stale after reauth/epoch change, fall back to Attention and explain.
- **Why it helps:** Interruption-aware return behavior prevents losing place in a long transcript or review queue.
- **Pi Remote application:** Store non-sensitive return descriptors (prior route, session ID, block/sequence anchor, live-edge flag, expanded block IDs) in history state; keep draft text in the in-memory per-session draft model.

### F-022/F-028: Attention merges triage, not authority

- **Source:** Warp notifications + GitHub Mobile. [SOURCE: https://docs.warp.dev/agents/capabilities/agent-notifications/] [SOURCE: https://docs.github.com/en/get-started/using-github/github-mobile]
- **Pattern:** One Attention root with priority sections or filters: `Needs action` first, then `Updates`, then `Errors`/error filter. Pending exact approvals appear as protected-action rows that open the exact Review detail; the list never gains approve/deny controls.
- **Why it helps:** Operators triage fast without duplicating the Inbox or separating decisions from their complete redacted object.
- **Pi Remote application:** Sessions root mirrors only blocked/running/idle/error, a bounded attention dot/count, recency, and cached/live freshness.

### F-023/F-029: Presence, unread, and authority are separate state dimensions

- **Source:** MDN document visibility + Pi Remote operations/security docs. [SOURCE: https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilityState] [SOURCE: file:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi%20Mobile/docs/operations.md:119-125] [SOURCE: file:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi%20Mobile/docs/security.md:28-35]
- **Pattern:** `document.visibilityState === 'visible'` answers "should the relay push?"; unread answers "has the operator reached current state?"; authority answers "may this exact action be submitted now?" A visible PWA must not silently clear work or enable action.
- **Why it helps:** Prevents conflation bugs where foreground state is mistaken for read state or live authority.
- **Pi Remote application:** Mark a hint visited only after resolution reaches current Session/Review state; keep an approval actionable until host-settled.

## 6. Findings: Home / Session List (Q1)

### F-001: Reframe the session list as an action-first priority queue

- **Source:** Warp (Active/Past + working/blocked/completed/errored states), Replit Mobile (pick-up-where-you-left-off + recent), Claude Remote Control (named session list). [SOURCE: https://docs.warp.dev/agents/local-agents/interacting-with-agents/] [SOURCE: https://docs.replit.com/platforms/mobile-app] [SOURCE: https://docs.anthropic.com/en/docs/claude-code/remote-control]
- **Current evidence:** Pi Remote renders one `Recent sessions` grid with status, opaque id, block count, and age. [SOURCE: file:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi%20Mobile/apps/pi-remote-web/src/App.tsx:661-694]
- **Pattern:** Divide into `Needs you`, `Working`, and `Recent`; sort by actionability then update time; keep an always-visible count for pending approvals/input requests.
- **Why it helps:** The first screen answers "Where am I needed?" without opening sessions one by one.
- **Pi Remote application:** Derive sections only from coarse relay state and attention/approval counts; keep opaque ids and relative time; never create titles from prompts/paths/tool args/transcript text. If attention cannot be joined to a session without exposing more data, show a top-level `Needs you` route instead of decorating cards.

### F-002: Keep status-first, resumable session cards with live freshness

- **Source:** Warp per-tab agent-state indicators; Claude Remote Control online/device state. [SOURCE: https://docs.warp.dev/agents/capabilities/agent-notifications/] [SOURCE: https://docs.anthropic.com/en/docs/claude-code/remote-control]
- **Pattern:** Visible blocked/running/idle/error state, bounded attention dot/count, recency, and cached/live freshness on each card.
- **Why it helps:** Orientation at a glance; the operator can pick work by session without opening each one.

## 7. Findings: Session Transcript (Q3)

### F-030..F-034: Turn-oriented typed-block hierarchy with signal-based collapse defaults

- **Source:** Pi Remote transcript renderer + MDN live-region guidance. [SOURCE: file:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi%20Mobile/apps/pi-remote-web/src/App.tsx:1119-1305] [SOURCE: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions]
- **Current evidence:** All non-thinking blocks are expanded equally; no explicit follow state, unread-block counter, or jump-to-latest control. [SOURCE: file:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi%20Mobile/apps/pi-remote-web/src/App.tsx:1126-1193]
- **Pattern:**
  - Turn-oriented hierarchy: user text and assistant text always expanded; latest plan as a compact sticky progress summary; successful tool call/result pairs, usage, and long settled diffs collapsed behind type-labelled disclosures; errors and pending approvals always expanded.
  - Collapse matrix by block type and signal (error = expanded, active = expanded, settled = collapsed, usage = collapsed with summary, diff = collapsed with line-count descriptor).
  - Two-state live edge: follow the tail while near the bottom; once scrolled up, freeze the viewport and show `N new blocks / Jump to latest`; resume follow only after explicit jump or return to bottom. Count settled typed blocks, not tokens.
  - Content-free block-sequence anchor for return restoration (stable ids/sequence, not pixels); never persist content-derived or private state.
  - Errors persistent and announced via a coalesced live region; usage surfaced but not noisy.
- **Why it helps:** A small screen preserves the conversational through-line while detailed evidence stays one tap away; long-running output remains steerable without motion-sickness.
- **Pi Remote application:** Collapse only relay-redacted block payloads already present on the phone; preserve DOM order and block timestamps; keep a direct way to expand every block. Under reduced motion, update the counter without animated scrolling.

### F-003: Explicit follow mode with a new-block counter

- **Source:** Warp per-tab indicators. [SOURCE: https://docs.warp.dev/agents/capabilities/agent-notifications/]
- **Pattern:** Follow only while the user is at/near the bottom; otherwise show a thumb-reachable `N new blocks / Jump to latest` control.
- **Why it helps:** Streaming stays legible without yanking the reader away from a diff or earlier decision.

## 8. Findings: Review / Approval (Q4)

### F-007/F-035: Present an exact redacted action, not a "full action"

- **Source:** Pi Remote Review source + security contract. [SOURCE: file:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi%20Mobile/apps/pi-remote-web/src/App.tsx:517-522] [SOURCE: file:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi%20Mobile/docs/security.md:68-72]
- **Current evidence:** The card heading claims "Decide with the full action in view" while the payload is explicitly relay-redacted; a digest proves the host later evaluated the same bytes but does not help a person understand hidden values. [SOURCE: file:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi%20Mobile/apps/pi-remote-web/src/App.tsx:517-522]
- **Pattern:** Label the object an "Exact redacted action." Keep redaction markers inline where values were removed; show a compact summary of hidden values (e.g., "2 values hidden: path, secret"). Never offer a reveal control (that creates a second, weaker redaction boundary). For a fully-hidden decisive scope, use a policy-generated, privacy-safe descriptor covered by the action digest (e.g., "existing workspace file", "creates one file", "changes 14 lines") — but see F-038 on the preconditions before predictive wording is truthful.
- **Why it helps:** Honest about what the operator can inspect; prevents fake informed consent.

### F-008/F-036: Progressive inspection with a persistent decision summary

- **Source:** GitHub PR review (files, viewed-progress, pending review, approve/request-changes) + Warp code diffs. [SOURCE: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/reviewing-proposed-changes-in-a-pull-request] [SOURCE: https://docs.warp.dev/agents/local-agents/code-diffs/]
- **Pattern:** Header shows tool, privacy-safe scope summary, expiry, and current state; redacted payload grouped by file/argument with risky and changed fields expanded; a safe-area-aware decision bar remains visible after inspection starts and repeats tool + scope. Deny and Approve-once stay direct (no second confirmation dialog). If the action changes/expires/loses freshness while open, disable approval and replace the action bar with the terminal reason — never silently refresh beneath an enabled control. Ruled out: scroll-to-bottom gestures and hold-to-approve (motor friction is not informed consent and harms accessibility).

### F-009/F-037: Accept-edits is a separate future-authority grant

- **Source:** Pi Remote Review source + feature catalog. [SOURCE: file:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi%20Mobile/apps/pi-remote-web/src/App.tsx:572-603] [SOURCE: file:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi%20Mobile/docs/feature-catalog/README.md:274-282]
- **Current evidence:** "Accept next 3 edits" is a peer of Deny and Approve once and creates the grant immediately — understating that it permits multiple future exact actions not yet visible. [SOURCE: file:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi%20Mobile/apps/pi-remote-web/src/App.tsx:572-603]
- **Pattern:** Move it behind a secondary "Allow a short edit run" action; the sheet names tool family, max count, expiration, remaining count, denial precedence, and revocation. Final button states the complete grant ("Allow up to 3 edit/write actions for 10 minutes"). Active grant visible in both Review and Session with remaining actions and one-tap revoke. (Full grant contract in F-039..F-042.)

### F-010/F-038: Settlement preserves uncertainty; privacy-safe descriptors need preconditions

- **Source:** Pi Remote Review source + incident playbooks. [SOURCE: file:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi%20Mobile/apps/pi-remote-web/src/App.tsx:531-533,605-613] [SOURCE: file:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi%20Mobile/docs/incident-playbooks.md:30-30]
- **Pattern:** Distinguish submitted, host-verified/consumed, denied, expired, revoked, changed-action, failed, and outcome-indeterminate. A submitted decision disables all controls and retains the reviewed payload until a terminal state. On relay loss/indeterminate, say "Outcome unknown - do not retry" and route to state refresh/recovery — never back to an actionable pending card. After a terminal decision, preserve the settled card briefly and move focus to the next pending action.
- **Descriptor preconditions:** Only allowlisted, host-generated categorical/cardinality descriptors (tool family, count, duration, "redacted values: N", server-owned grant scope) are privacy-safe today. Predictive impact wording ("creates one file", "changes 14 lines") requires typed tool semantics and revalidated, approval-bound filesystem preconditions — the current action digest does not bind mutable filesystem state, so such claims can go stale before execution. Client-side parsing of redacted canonical arguments is ruled out.

### F-039..F-042: Accept-edits grant contract

- **Source:** Pi Remote grant web client/service/tests + OWASP authorization + RFC 7009. [SOURCE: file:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi%20Mobile/apps/pi-remote-web/src/App.tsx] [SOURCE: https://owasp.org/www-community/access_control] [SOURCE: https://datatracker.ietf.org/doc/html/rfc7009]
- **Findings:**
  - Grant applies to **future actions only**; the visible pending approval is never included in a newly created grant.
  - Grant scope is a **server-owned conjunction** (principal, session, epoch, tool family, count, duration); no path/argument-similarity scope claims.
  - **Exact denial precedes grant consumption** for any in-view action.
  - **Operator revoke boundary is missing today** — the active grant needs principal-scoped list + idempotent host-confirmed revoke HTTP contracts.
  - Active authority needs **global visibility** in Session and Attention (host-time-anchored remaining count and expiry, one shared server-derived grant model).
  - **Bundled presets:** `1 edit / 2 min`, `3 edits / 5 min` (default), `5 edits / 10 min`. Ruled out: 3/10 as default (always consumes max TTL, broader than needed).
  - Grant revoke must **transactionally revoke linked pending and approved leases that are not consumed**; it must not abort consumed or in-flight execution (cancellation is a separate operator action).
  - Client countdowns and revoke submissions never establish authority state without host confirmation.
- **Why it helps:** Broad authority gets deliberate friction and persistent visibility; ordinary exact approval stays one press.

## 9. Findings: Compose Box (Q5)

### F-012..F-017: State-derived actions, multiline touch input, hardware-keyboard shortcuts, editable drafts, host-bound controls

- **Source:** Pi Remote compose implementation + Pi RPC mode docs + MDN (enterkeyhint, VirtualKeyboard) + React Aria TextArea. [SOURCE: file:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi%20Mobile/apps/pi-remote-web/src/App.tsx] [SOURCE: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/enterkeyhint] [SOURCE: https://developer.mozilla.org/en-US/docs/Web/API/VirtualKeyboard_API] [SOURCE: https://react-spectrum.adobe.com/react-aria/TextArea.html]
- **Pattern:**
  - **State-derived actions:** `Send` / `Steer` / `Later` derived from session state, matching the host turn model; the compose affordance never guesses a delivery mode.
  - **Touch keyboard:** touch Return inserts a newline; a send/steer affordance is an explicit control (never plain-Enter send — accidental dispatch risk). `enterkeyhint` communicates intent on the software keyboard.
  - **Hardware keyboard:** modified-Enter (e.g., Cmd/Control+Enter) dispatches safely; discoverable shortcuts shown when a hardware keyboard is present.
  - **Editable draft beside immutable pending submit:** keep the draft editable while the pending submit is an immutable snapshot; never present unacknowledged local state as authoritative.
  - **Host-bound undo/retry/stop:** these operate on host delivery/execution state, not local UI; never auto-retry after unknown delivery (duplicate-risk).
  - **Quick actions** (steer presets) fill drafts only — they never submit directly without explicit dispatch.
  - **No client-only durable prompt queue** (presents unacknowledged local state as authoritative and risks private prompt persistence).
  - **No VirtualKeyboard API as a required layout mechanism** — experimental/non-Baseline; use it as a progressive enhancement only.
- **Why it helps:** Steering is explicit, safe, and low-friction on both touch and hardware keyboards without accidental dispatches or lost drafts.

## 10. Findings: Attention Inbox (Q6)

### F-043..F-047: Server-owned device receipt lifecycle with leased suppression

- **Source:** Pi Remote attention implementation + MDN visibility + MDN notifications. [SOURCE: file:/Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi%20Mobile/apps/pi-remote-web/src/attention.ts] [SOURCE: https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilityState] [SOURCE: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/notificationclick_event]
- **Pattern:**
  - **Server-owned device receipt lifecycle:** each device has receipts with delivered/seen/actionable states; the server is the authority for delivery and unread, not the client.
  - **Leased foreground and typing suppression:** while the PWA is visible and/or the operator is typing in the session, suppress redundant push for that device under a lease; foreground suppression does not clear unread or imply authority.
  - **Dual indicators — unread vs unresolved:** separate indicators; opening Attention marks seen but may still require action; never auto-clear all badges just because Attention opened (seen receipts may still require action).
  - **Two-layer dedupe and bounded stale retention:** dedupe by class/event (not per-lookup unique tags, which turn bursts into notification noise), and retain stale hints for a bounded window with an inert "No longer current" receipt.
  - **Per-device push-only preferences:** preferences control delivery only and must never hide authoritative receipts from the Inbox (push preferences are not inbox filters).
  - Class-level grouping: `Needs action` first, then `Updates`, then `Errors`.
- **Why it helps:** The operator is informed without alert fatigue, and the content-free contract (no content leakage, no authority in push) is preserved.

## 11. Recommendations (Adoption Order)

1. **Route-state + two-root IA (Q2)** — foundational; everything else sits on it. Replace boolean overlays with one addressable route model; introduce `Sessions` and `Attention` roots; implement the hint resolver and warm/cold return contract.
2. **Review honesty + grant separation (Q4)** — highest-security-surface improvements. "Exact redacted action" wording, progressive evidence, direct Deny/Approve-once, accept-edits as a scoped grant with presets and host-confirmed revoke.
3. **Transcript hierarchy + live edge (Q3)** — readability of the core surface. Turn-oriented hierarchy, signal-based collapse, `N new blocks / Jump to latest`, content-free block anchors.
4. **Compose affordances (Q5)** — steering friction. State-derived Send/Steer/Later, touch-vs-hardware keyboard rules, editable drafts, host-bound undo/retry/stop.
5. **Attention lifecycle (Q6)** — notification quality. Server-owned receipts, leased suppression, dual indicators, two-layer dedupe, per-class grouping.
6. **Session list priority queue (Q1)** — first-screen orientation. `Needs you` / `Working` / `Recent` derived from coarse relay state.

**Coverage gaps to validate before/at implementation:** Termius and Vercel/Netlify as named comparators (primary pages unavailable during this run); privacy-safe descriptor preconditions on the live service; installed-iPhone PWA history, focus-existing-client behavior, scroll restoration, and VoiceOver announcements on the supported iOS matrix; physical-iPhone validation of the grant-sheet copy, radio-card density, countdown legibility, and the 3-edit/5-minute default.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Swipe-only navigation | Conflicts with iOS edge gestures, discoverability, keyboard access, and screen-reader parity | ITER-001 ruledOut | 1 |
| Native Live Activities as a required channel | Not a dependable installable-PWA capability; inbox and Web Push remain the portable baseline | ITER-001 ruledOut | 1 |
| Content-rich notifications, path autocomplete, file attachments | Conflict with the current redaction and foreground-authority contract | ITER-001 ruledOut | 1 |
| Blanket always-allow or auto-apply permissions | Conflicts with exact-action mutation approval | ITER-001 ruledOut | 1 |
| Terminal modifier rows and raw shell gestures | Pi Remote is a semantic agent controller, not a terminal emulator | ITER-001 ruledOut | 1 |
| Termius-specific claims from unavailable pages | Both attempted official documentation URLs returned 404; no behavior inferred without primary evidence | ITER-001 ruledOut | 1 |
| Universal confirmation, press-and-hold, scroll-to-bottom, or Viewed gate before exact approval | Adds ceremony and accessibility friction without proving comprehension | ITER-002 ruledOut | 2 |
| Place Accept next 3 edits beside Approve once as equivalent actions | They convey different authority scopes and use differently bound requests | ITER-002 ruledOut | 2 |
| Reveal redacted values on demand | Creates a confidentiality path and undermines relay-owned redaction | ITER-002 ruledOut | 2 |
| Plain Enter sends from the multiline composer | Conflicts with touch-keyboard multiline editing and creates accidental dispatch risk | ITER-003 ruledOut | 3 |
| Client-only durable prompt queue | Would present unacknowledged local state as authoritative and risks private prompt persistence | ITER-003 ruledOut | 3 |
| Automatic retry after unknown delivery | Could duplicate an accepted steering instruction and violates the existing delivery-unknown contract | ITER-003 ruledOut | 3 |
| VirtualKeyboard API as required iPhone layout mechanism | Experimental non-Baseline API is not a reliable iOS PWA dependency | ITER-003 ruledOut | 3 |
| Third persistent Review root | Review is contextual to a session or attention task and duplicates the attention domain | ITER-005 ruledOut | 5 |
| Route directly from notification class | The content-free hint is not authoritative; the foreground relay must resolve current state | ITER-005 ruledOut | 5 |
| Client-side parsing of redacted canonical arguments | Presentation text lacks typed evidence and parsing it would create a weaker disclosure path | ITER-006 ruledOut | 6 |
| Predictive impact wording from point-in-time filesystem inspection | The existing action digest does not bind mutable filesystem state, so the claim can become stale before execution | ITER-006 ruledOut | 6 |
| Include the visible approval in the reusable grant | Grant creation does not bind the visible approval ID, revision, or digest | ITER-007 ruledOut | 7 |
| Claim path or argument-similarity scope | The current server contract enforces only principal, session, epoch, tool, count, and duration | ITER-007 ruledOut | 7 |
| Use attention items or push hints for active grants | Persistent authority status is not a new attention event and must not dilute content-free hint semantics | ITER-007 ruledOut | 7 |
| Use 3 edits / 10 minutes as the default grant preset | Always consumes the maximum server TTL and is broader than needed for the default short run | ITER-008 ruledOut | 8 |
| Optimistically show expired or revoked | The host owns consumption and revoke race ordering; ambiguous failures leave authority potentially active | ITER-008 ruledOut | 8 |
| Abort consumed or in-flight execution on grant revoke | Grant revoke removes future and unconsumed authority; execution cancellation remains a separate operator action | ITER-008 ruledOut | 8 |
| Flatten typed blocks into chat bubbles | Erases execution semantics needed to inspect plans, tools, diffs, errors, and usage | ITER-009 ruledOut | 9 |
| Force-scroll on every stream update or steer | Destroys the operator's review position and makes long-running output unsteerable | ITER-009 ruledOut | 9 |
| Persist pixel-only or content-derived return anchors | Variable-height virtualization makes pixels unstable and content-derived state violates redaction boundaries | ITER-009 ruledOut | 9 |
| Clear all badges when Attention opens | Seen receipts may still require operator action | ITER-010 ruledOut | 10 |
| Use per-lookup visible notifications | Unique tags turn bursts into notification noise; class replacement preserves the inbox as authority | ITER-010 ruledOut | 10 |
| Use push preferences as inbox filters | Delivery settings must not hide authoritative receipts | ITER-010 ruledOut | 10 |

## Divergence Map

- **Saturated directions:** None marked saturated. Iteration focus rotated through all six key questions plus two Q4 deepenings; no direction was ruled exhausted.
- **Pivots taken:** None (no divergent pivot prepared; convergence mode `default`, single lineage).
- **Evidence and Council artifact references:** 112 key findings in `findings-registry.json`; 10 iteration narratives in `iterations/iteration-00{1,2,3,5,6,7,8,9,10}.md` (iteration-004 errored, recorded as error); 25+ graph nodes/edges upserted to the coverage graph per iteration; 29 consolidated ruled-out directions (see Eliminated Alternatives).
- **Pivot failures and audited overrides:** Iteration 4 (initial Q2 navigation pass) failed at artifact write (`apply_patch` could not match the long JSONL line); re-dispatched once per `redispatch_once`, then recorded as `error` and continued. Iteration 5 re-covered Q2 successfully. No operator override events.
- **Remaining frontier:** Termius and Vercel/Netlify comparator validation; privacy-safe descriptor preconditions on the live approval service; installed-iPhone PWA history/focus-existing-client/scroll-restoration/VoiceOver validation; physical-iPhone validation of grant-sheet copy and the 3-edit/5-minute default.

## Open Questions

- Q1: Which interaction patterns from leading mobile coding-agent and terminal clients transfer to Pi Remote's surfaces, and which are mobile-PWA-specific adaptations? — **Answered at pattern level** (ITER-001). Remaining: Termius/Vercel-Netlify comparator validation.
- Q2: What information architecture and navigation patterns make multi-surface mobile agent control coherent and low-effort? — **Answered at IA/route-contract level** (ITER-005; iteration 4 errored and was re-covered). Remaining: replace independent surface booleans with one route model; non-sensitive restoration state.
- Q3: Which transcript and streaming patterns improve readability and steerability of a long-running agent transcript on a phone? — **Answered at contract level** (ITER-009). Remaining: physical-iPhone validation of hierarchy, collapse defaults, live-edge, and the safe block anchor.
- Q4: How should mutation approval and redaction be presented so safety stays explicit and fast? — **Answered at interaction + grant-contract level** (ITER-002, ITER-006, ITER-007, ITER-008). Remaining: privacy-safe descriptor preconditions; grant presets/status/revoke HTTP contracts on the live service.
- Q5: Which compose-box affordances lower friction for steering a coding agent from an iPhone keyboard? — **Answered at contract level** (ITER-003). Remaining: physical-iPhone validation of touch/hardware keyboard behavior and VirtualKeyboard progressive enhancement.
- Q6: What attention/notification/inbox patterns keep the operator informed without noise or content leakage? — **Answered at contract level** (ITER-010). Remaining: physical-iPhone validation of suppression leases, badges, and per-device preferences.

## Appendix: Convergence Report

- Stop reason: `maxIterationsReached` (stop policy `max-iterations`; convergence threshold 0.05 was telemetry-only)
- Total iterations: 10 (9 complete with findings, 1 error)
- Questions answered at pattern level: 6/6 key questions (Q1, Q2, Q3, Q4, Q5, Q6), plus Q4 deepenings (descriptors, grant contract, grant UX)
- Remaining questions: listed in Open Questions (implementation/validation dependencies, not un-addressed research questions)
- Last iteration summaries: run 9 Q3 transcript (0.57) -> run 10 Q6 attention (0.64); iteration 4 Q2 error (0.00)
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded; iteration 4 was a single-error re-dispatch, not a pivot
- Quality evidence: 112 key findings (median newInfoRatio across complete iterations ≈ 0.70; ratios 0.88, 0.74, 0.79, 0.71, 0.68, 0.66, 0.61, 0.57, 0.64); 29 ruled-out directions; coverage sources: Pi Remote source code, Pi Remote docs, MDN, React Aria, Warp, Claude Remote Control, GitHub Mobile, Replit Mobile, Blink Shell, OWASP, RFC 7009, WAI
