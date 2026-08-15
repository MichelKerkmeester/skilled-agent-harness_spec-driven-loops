# Iteration 5: Axis 3 — Actionable Notification-as-Pull Loop (Content-Free-Push Resolution)

## Focus
Design the bounded `needs_input`/`finished`/`error` attention class with deep-linking to the approval — and resolve the core contradiction: 007 forbids decision/transcript content in push, yet an actionable notification must tell the user *what* needs attention. Prior art: RFC 8291 Web Push encryption limits, iOS Home Screen PWA push/badging constraints, UnifiedPush/ntfy self-hosted delivery.

## Findings

### F1. Web Push payload physics (RFC 8291)
- Push payloads are E2EE (aes128gcm) between the app server and the user agent; the push service transports ciphertext only ([SOURCE: datatracker.ietf.org/doc/html/rfc8291]).
- Hard limit: 4096 bytes total, ≈3993 bytes plaintext with standard framing; **no compression allowed** (compression can leak). Practical rule: send a small event/ID, fetch content after delivery ([SOURCE: datatracker.ietf.org/doc/html/rfc8291], [SOURCE: developer.mozilla.org/en-US/docs/Web/API/PushSubscriptionOptions/applicationServerKey]).
- Implication: the push channel is *physically* a pointer channel. Even if policy allowed content, it cannot carry transcripts. The design must make a tiny pointer actionable.

### F2. iOS Home Screen PWA push constraints (007's hardening reality)
- Web Push works only for installed Home Screen web apps on iOS 16.4+; standalone manifest required; permission requires a user gesture; every received push MUST result in a visible `showNotification()` — **silent/background-only push is not allowed and permission can be revoked**; badge alone does not satisfy the rule ([SOURCE: webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/]).
- Badging: `setAppBadge` works from the service worker during a push event, but badge visibility is not observable (user may disable it) — badges are supplemental only; multiple installs of the same PWA share origin identity nuances ([SOURCE: webkit.org/blog/14112/badging-for-home-screen-web-apps/]).
- Implication: the "silent push to wake the app" trick is FORBIDDEN on iOS. The SW must render something visible; the design therefore requires a *local rendering path*.

### F3. UnifiedPush/ntfy — the self-hosted alternative to FCM/APNs
- UnifiedPush separates app↔distributor (on device) from backend↔push server; a self-hosted ntfy instance can be the push server; the backend POSTs to a per-app endpoint, ntfy maintains delivery to the distributor, battery-efficient ([SOURCE: unifiedpush.org/news/20221218_unifiedpush/], [SOURCE: docs.ntfy.sh/publish/]).
- Implication: Pi can offer a **zero-cloud notification path**: relay → self-hosted ntfy (or UnifiedPush endpoint on the same tailnet host) → phone. This preserves the tailnet-only posture end-to-end for Android; iOS requires APNs via standard Web Push (Safari), where only the *pointer* crosses to Apple — consistent with 007's "opaque hints" rule.

## Design: Axis 3 deliverables

### Attention class (bounded, 3 members)
`attention.raised`: `{attentionId, class, sessionOpaqueId, runId, leaseId?, raisedAt, expiresAt?, pendingCount?}` where class ∈ `needs_input | finished | error`. Emitted at committed relay transitions (persist-before-broadcast per 003); feeds `transcript.run.status` and the approval queue (axis 2).

### Content-free-push resolution — actionability lives in local state, not the payload
The contradiction dissolves once the push is a **wake-up pointer** and the *content* comes from two allowed channels:
1. **Local encrypted cache (primary)**: while the PWA is alive it fetches attention records over the tailnet WSS and stores them (encrypted at rest in IndexedDB, keyed by the app session key). The service worker, on push, looks up `attentionId` in the cache and renders a **rich, redacted, local notification** — "Approve write to ws-abc:src/app.ts" — without the push carrying a single content byte. On iOS this also satisfies the visible-notification rule with genuinely useful copy.
2. **Fetch-on-open (fallback)**: cache miss (attention raised while the app was never connected) → generic notification "Pi needs attention — open to view" → tap deep-links → 004 reauth → fetch the attention record → render the actionable card. This is exactly 007's documented fallback; the cache makes the *common* case actionable, the fallback keeps the *authoritative* case safe.

Push payload (≤ 256 bytes, all opaque, 007-compliant): `{v:1, a:<attentionId>, c:<class>, s:<sessionOpaqueId>}`. No decision, no transcript, no path, no tool name. Deep link: `pi-remote://attention/{s}/{a}` — names only opaque ids.

### UX patterns
- **Coalescing + tag replacement**: one notification per session per class; Web Push `tag` = `${s}:${class}` so repeated `needs_input` updates replace (not stack) — anti-spam per OWASP. `pendingCount` renders "3 approvals waiting".
- **Class affordances**: `needs_input` → primary action opens the approval queue (biometric-gated); `finished` → opens the run summary (diffs + usage, from transcript events); `error` → opens the error card with retry/steer controls. Lock-screen copy stays class-level ("Pi needs input") — OWASP lock-screen minimization.
- **Badge**: app badge = pending count across sessions, set from SW during push; supplemental only (WebKit caveat).
- **iOS compliance checklist**: user-gesture permission prompt; every push shows a notification (never silent); Focus/quiet-mode respected (generic class copy still renders); multiple-install identity handled via manifest id.
- **Android zero-cloud path**: optional UnifiedPush/ntfy distributor instead of FCM; same opaque pointer payload.

### Why this exceeds the reference
- Reference: "Push when Claude decides" sends generic finished/decision-needed hints; content arrives only on open; no local cache → the notification itself is never actionable, and the documented mobile-render failure (iteration 4, issue #35637) makes even the open-path unreliable.
- Pi: bounded attention classes, deep-linkable opaque pointers, local encrypted cache making the *notification itself* rich and actionable, tag-replacement coalescing, iOS-compliant visible rendering, and a zero-cloud Android path — while the push payload stays byte-for-byte 007-compliant.

## Sources Consulted
- [SOURCE: https://datatracker.ietf.org/doc/html/rfc8291]
- [SOURCE: https://developer.mozilla.org/en-US/docs/Web/API/PushSubscriptionOptions/applicationServerKey]
- [SOURCE: https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/]
- [SOURCE: https://webkit.org/blog/14112/badging-for-home-screen-web-apps/]
- [SOURCE: https://unifiedpush.org/news/20221218_unifiedpush/]
- [SOURCE: https://docs.ntfy.sh/publish/]
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/007-push-and-platform-hardening/spec.md]

## Assessment
- newInfoRatio: 0.85
- Novelty justification: the local-encrypted-cache + fetch-on-open two-channel resolution is new design; RFC 8291 physics and iOS silent-push prohibition are hard facts that reframe the contradiction.
- Confidence: high on platform facts (vendor/standard docs); design validates 007's hint contract unchanged.

## Reflection
- What worked: reframing the contradiction as "actionability must live in local state or the authenticated fetch, never in the payload" — every constraint (4KB, iOS visible-notification rule, 007 content ban) then points the same way.
- What failed / ruled out: silent push wake (illegal on iOS, permission revocation); badge-only signaling (WebKit: not observable, insufficient); E2EE payloads as a content channel (still violates 007's policy ban — encryption is not a policy exemption; push service and lock screen remain exposure surfaces).
- Ruled out: putting tool names or paths in push copy (007 REQ-001 violation).

## Recommended Next Focus
Axis 4: scoped accept-edits / session allow-list bound to the lease/CAS model — convenience without bypass.
