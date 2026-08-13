# Iteration 14: Platform Audit — iOS vs Android PWA Notification/Background Constraints

## Focus
Harden axes 3/6 per-platform: what the service worker can and cannot do on iOS vs Android for notifications and background work, and how the notification permission prompt must be timed. This fills the 007 "declared platform rows" requirement with current mechanics.

## Findings

### F1. Android/Chromium: event-driven SW, not a background service
- The SW is terminated after ~30s idle; long-running events can be killed (>5 min); no WebSockets, timers, or polling in the worker; push events wake the worker; payload guidance ~2KB; **no delivery guarantees** — the app must reconcile on next open ([SOURCE: chromium.org/Home/chromium-security/security-faq/service-worker-security-faq/], [SOURCE: groups.google.com/a/chromium.org/g/chromium-dev/c/jqrtJCPMb-k]).
- A PWA service worker is NOT an Android foreground service — no persistent execution, sockets, or background compute ([SOURCE: developer.android.com/develop/background-work/services/fgs/restrictions-bg-start]).
- Practical pattern: small push with ID → `waitUntil()` minimal fetch → persist to IndexedDB → `showNotification()` ([SOURCE: web.dev/learn/pwa/update]).

### F2. iOS: storage eviction + no background execution
- WebKit storage policy: script-writable storage can be evicted; installed Home Screen web apps get more durable storage than tabs (WebKit 17.4+ updates), but storage must never be treated as a source of truth ([SOURCE: webkit.org/blog/14403/updates-to-storage-policy/]).
- No background fetch/refresh API for Home Screen web apps (BGAppRefreshTask is native-only); background sync is not available on iOS Safari/WebKit ([SOURCE: caniuse.com/wf-background-sync], [SOURCE: developer.apple.com/documentation/backgroundtasks/bgapprefreshtask]).

### F3. Permission prompt UX rules
- Ask with a user gesture and when the value is obvious; never on page load (Lighthouse flags it); Firefox/Safari require a prior user gesture; the iOS PWA path requires the prompt from the direct handler of a tap ([SOURCE: web.dev/articles/push-notifications-permissions-ux], [SOURCE: developer.chrome.com/docs/lighthouse/best-practices/notification-on-start]).

## Design deltas (hardening iterations 3/5/6)
1. **Cache is a cache, not a source of truth**: the iteration-5 local encrypted attention cache is populated only while the PWA is foreground; it may be evicted (iOS) or stale (Android). The service worker's push handler must therefore follow the bounded wake pattern: (a) cache hit + device unlocked → rich local notification; (b) cache miss → **bounded `waitUntil()` fetch of the attention summary** (opaque ids + class + pendingCount only — a 007-safe redacted projection) and render class-level copy; (c) fetch fails/slow → generic "Pi needs attention — open to view". All three paths satisfy the iOS visible-notification rule with honest copy.
2. **No SW connections**: the SW never holds a WSS; all tailnet WSS traffic lives in the foreground PWA (matches 004 ticket-bound sessions — SW fetches use the device credential via the same auth path, bounded and short).
3. **Reconciliation on open remains mandatory** (Android no-guarantee delivery + iOS eviction): the PWA always re-fetches the authoritative attention list + session list on open (007 fetch-on-open already assumes this; now the fallback is *primary* on iOS storage eviction).
4. **Permission prompt timing**: the prompt is requested at the end of pairing (post-gesture, contextual — "get notified when Pi needs you"), never on PWA load; on iOS it must come from the direct tap handler; the pairing flow (axis 7) is the natural insertion point.
5. **Platform rows** (007): Android — FCM or self-hosted UnifiedPush/ntfy; SW wake pattern; no FGS claims. iOS — APNs via Safari Web Push; visible-notification rule; badge supplemental; storage eviction documented; permission via gesture. Desktop browsers — same SW pattern, treated as a fallback surface.

## Sources Consulted
- [SOURCE: https://www.chromium.org/Home/chromium-security/security-faq/service-worker-security-faq/]
- [SOURCE: https://groups.google.com/a/chromium.org/g/chromium-dev/c/jqrtJCPMb-k/m/hYM1WE7mAAAJ]
- [SOURCE: https://developer.android.com/develop/background-work/services/fgs/restrictions-bg-start]
- [SOURCE: https://webkit.org/blog/14403/updates-to-storage-policy/]
- [SOURCE: https://caniuse.com/wf-background-sync]
- [SOURCE: https://web.dev/articles/push-notifications-permissions-ux]
- [SOURCE: https://developer.chrome.com/docs/lighthouse/best-practices/notification-on-start]

## Assessment
- newInfoRatio: 0.50
- Novelty justification: the three-path SW notification handling, cache-as-cache doctrine, and pairing-anchored permission timing are new hardening; platform mechanics are consolidated facts.
- Confidence: high; all mechanics from vendor/standard docs.

## Reflection
- What worked: treating the SW as a bounded wake handler (never a connection holder) resolved the remaining tension between axis-5's cache and iOS/Android reality.
- What failed / ruled out: SW-held WebSockets (impossible, SW lifecycle); background fetch on iOS (doesn't exist for web apps); treating IndexedDB as durable truth (eviction).
- Ruled out: FGS-style persistent execution claims for the PWA (platform rule).

## Recommended Next Focus
Depth pass: watch/glance-class surfaces — quick actions and complication-style approval affordances on lock screen/wearables (OWASP-constrained).
