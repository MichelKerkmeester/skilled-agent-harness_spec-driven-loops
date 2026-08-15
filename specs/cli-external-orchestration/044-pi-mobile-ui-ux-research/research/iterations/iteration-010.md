# Iteration 10: Attention Inbox Lifecycle

## Focus

Q6: What foreground suppression, unread and deduplication state, stale-hint retention, badge behavior, grouping, and per-class notification preferences keep Pi Remote informative without becoming noisy or content-leaking?

## Actions Taken

1. Recovered the externalized strategy, canonical state log, and the Q2 two-root and hint-resolver contract.
2. Inspected the current Attention Inbox, push settings, service worker, relay push service, and SQLite attention schema.
3. Compared the current foreground flag with the browser's documented `visibilityState` lifecycle.
4. Checked notification replacement controls (`tag`, `renotify`, and `getNotifications`) in the Notifications API; attempted Apple notification guidance, but its fetched page was only a JavaScript shell and was not used as evidence.
5. Reconciled the lifecycle with the established attention triad (`needs_input`, `finished`, `error`), content-free payloads, foreground authority, and the Q2 resolver barrier.

## Findings

### F-010-001: Separate authoritative attention receipts from best-effort push delivery

The Attention root must render server-owned, per-device receipts. Web Push is only a delivery hint and must not own unread, settlement, or destination state. The current relay stores global attention rows with no device read state, settlement state, expiry, or supersession pointer; the client equates every returned row with a live signal and displays `items.length`. Opening a notification or dismissing it therefore cannot produce a coherent unread lifecycle. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-relay/migrations/003-push-attention.up.sql:10-23] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:710-783]

Use one receipt per device with these states:

| State | Transition | Inbox treatment |
|---|---|---|
| `unread` | A new authoritative attention generation is committed | Bold/new marker; contributes to unread indicator |
| `seen` | The receipt has been visibly rendered in the foreground Attention root for at least one second | Removes new marker; remains actionable |
| `opened` | Foreground authentication resolves its opaque lookup and canonical target loading starts | Shows `Opened` only if the target remains unresolved |
| `settled` | Current relay state confirms no operator action remains, or the terminal result was acknowledged | Leaves active groups; may enter bounded history |
| `superseded` | A newer receipt for the same server-owned dedupe target replaces it | Hidden from active groups; retained as a receipt |
| `expired` | Epoch mismatch, retention expiry, or a 410 resolver response invalidates it | Non-actionable `No longer active` receipt |

`seen` is not `settled`. Merely opening the Attention root clears novelty, not work. Notification click, notification dismissal, app launch, and root switching must never settle an item. State transitions need idempotent device-scoped acknowledgements so reloads and multiple clients converge.

### F-010-002: Replace the foreground boolean with a short device lease and suppress duplicate in-app cues while typing

The relay currently keeps foreground device IDs in process memory until an explicit false call or unsubscribe. A crash, suspended iPhone PWA, missed `pagehide`, or relay restart can make this flag stale in either direction. Browser `visibilityState` distinguishes visible from hidden and emits `visibilitychange`, but it does not provide a durable server presence guarantee. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-relay/src/push/push-service.ts:78-80] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-relay/src/push/push-service.ts:150-161] [SOURCE: https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilityState]

Use a renewable foreground lease per device. Renew every 15 seconds only while the installed PWA is `visible`, focused, authenticated, and connected to current relay authority. Give the lease a 45-second expiry. Send an immediate best-effort release on `visibilitychange` to hidden and `pagehide`; expiry remains the safety net. At publish time, a valid lease suppresses system push for that device, but never suppresses receipt creation or inbox counts.

Foreground cue rules should be deterministic:

- If the canonical target is already visible, update its local state and suppress a duplicate banner.
- Otherwise update the Attention root indicators immediately without moving focus.
- While an IME composition is active, the composer contains a focused non-empty draft, a submit is in flight, or the last typing event was less than eight seconds ago, defer transient banners and coalesce them by class.
- After the typing window, show at most one content-free foreground banner: `Input needed`, `Run error`, or `Run finished`, with `Open Attention` as navigation only.
- Keep errors and input needs as persistent root markers until settled. Never use assertive announcements, force navigation, or place an approval action in the banner.

This creates a maximum 45-second post-suspension push-suppression gap if iOS kills the page before release. That bounded false suppression is safer and quieter than duplicate notifications; the authoritative inbox still records the item.

### F-010-003: Derive two indicators because unread and unresolved answer different questions

One count cannot represent both `What is new?` and `What still needs attention?`. The persistent Attention root should expose an unresolved count derived from active `needs_input` plus active `error` receipts. A small new marker indicates any unread receipt, including `finished`. Opening the inbox marks visible receipts seen and clears only the new marker. The numeric unresolved badge clears only when relay-confirmed settlement, supersession, or expiry reduces the unresolved count to zero.

`finished` belongs in the inbox as a terminal receipt but should not keep an actionable badge alive. The root label can announce a coalesced change such as `Attention, 2 unresolved, new activity`; the inbox itself uses one polite status update after refresh. The current `items.length` count includes all classes and all retained rows, so it will grow even when no work remains. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:731-755] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-relay/src/push/push-service.ts:163-175]

### F-010-004: Group by operator consequence, deduplicate at two layers, and retain stale receipts briefly

Render active groups in this order: `Needs input`, `Errors`, then `Finished`. Within each group, order newest first. The server dedupe key must be canonical and private: review-target identity for `needs_input`, and session plus epoch for `error` or `finished`. A newer generation for that key supersedes the older active receipt. Do not expose that key in URLs, labels, browser storage, notification text, or analytics.

Push needs a coarser privacy-safe dedupe layer because the current content-free payload contains only lookup ID and class. Use one notification `tag` per class, keep `renotify: false`, and replace the prior visible notification of that class. The latest notification opens its lookup through the Q2 resolver; older authoritative receipts remain in the inbox. The current tag includes every unique lookup ID, so bursts create one visible notification per event. The Notifications API defines `tag` as the notification identifier and `renotify: false` as replacement without re-alerting. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/public/service-worker.js:58-74] [SOURCE: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification]

When resolution returns 410, atomically mark that device receipt `expired`, show `No longer active`, refresh active receipts, and navigate back to the Attention root. Keep settled, superseded, and expired receipts under collapsed `Earlier` for 24 hours after the device first sees the terminal state, capped at 20 receipts; then delete them. Keep unseen terminal receipts for up to seven days so an offline device gets an explanation. Never retain notification bodies, target content, session excerpts, paths, tool arguments, or diffs.

### F-010-005: Make notification preferences per-device delivery policy, not inbox filters

The inbox must always collect all three classes. Preferences control only system push on the current device. Default `needs_input` and `error` on because they can require intervention; default `finished` off because completion is frequent and non-actionable. Offer explicit switches with consequence copy:

| Class | Default | Push copy | Foreground and inbox behavior |
|---|---|---|---|
| `needs_input` | On | `Pi Remote needs input` | Always record; unresolved badge until settled |
| `error` | On | `Pi Remote needs attention` | Always record; unresolved badge until acknowledged or superseded |
| `finished` | Off | `Pi Remote finished` | Always record; new marker only |

Request OS permission only from an explicit `Enable notifications` action in the installed PWA. If permission is denied, unsupported, or later revoked, show the OS state and preserve settings for explanation, but keep the inbox fully usable. Preference writes should wait for relay acknowledgement or roll back on failure; the current optimistic update leaves failed toggles appearing saved. The current server also defaults every class on. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-web/src/App.tsx:788-854] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Apps/Pi Mobile/apps/pi-remote-relay/src/push/push-service.ts:25-29]

## Questions Answered

- Q6 is answered at the lifecycle-contract level: server-owned device receipts govern unread, settlement, stale retention, and badges; push remains a content-free, replaceable hint.
- Foreground suppression uses a 15-second renewal and 45-second lease, while typing defers and coalesces only transient cues, not authoritative receipt creation.
- Opening the inbox clears newness after visible rendering; only authoritative settlement clears unresolved counts.
- Active items group by operator consequence, server dedupe uses private target identity, and service-worker dedupe uses one non-renotifying notification per class.
- Push defaults are on for `needs_input` and `error`, off for `finished`; per-class switches never filter the inbox.

## Questions Remaining

- Planning must define the receipt and device-acknowledgement protocol, private dedupe-key derivation, settlement source for each class, and cleanup job.
- Physical installed-iPhone testing must validate visibility and pagehide lease release, focus-existing-client behavior, notification replacement by tag, OS/app badge support, typing-window timing, and VoiceOver announcement cadence across the supported iOS matrix.
- The existing Q2 route-model replacement remains a prerequisite for canonical notification and inbox navigation.
- Termius and Vercel/Netlify remain unvalidated named comparators; no Q6 conclusion depends on them.

## Ruled-Out Directions

- Push delivery, notification dismissal, and notification click were ruled out as sources of unread or settlement truth.
- Clearing all badges when the Attention root opens was ruled out because seen items may still require action.
- Permanent process-memory foreground flags, per-lookup visible notifications, and push suppression without receipt creation were ruled out as stale, noisy, or lossy.
- Including session identity or target detail in notification tags was ruled out because it creates a correlation and content-leak surface.
- Treating notification preferences as inbox filters and enabling completion push by default were ruled out because they hide history or create avoidable noise.
- The Apple notification page was not used as evidence because the fetched result contained no substantive guidance without JavaScript.

## Assessment

- `newInfoRatio`: 0.64
- Novelty justification: Earlier iterations established the Attention root and content-free resolver; this iteration adds the concrete device receipt state machine, leased foreground suppression, typing window, dual indicator semantics, two-layer dedupe, bounded stale retention, and per-class defaults.
- Confidence: High for current implementation gaps and browser API semantics from primary source and MDN. Medium-high for the proposed timing and retention values until physical installed-iPhone validation.

## Next Focus

Final iteration reached. The workflow should synthesize all six question-level contracts into `research/research.md`, preserving the route-model, relay-protocol, and physical-device validation dependencies.
