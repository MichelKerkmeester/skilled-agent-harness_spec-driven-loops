# Iteration 15: Depth Pass — Glance-Class Surfaces (Watch / Lock-Screen Actions)

## Focus
Design the glance-class approval affordances: can a watch or lock screen approve? Under what constraints? This is the last UX layer between the phone and the attention loop.

## Findings

### F1. Platform mechanics for notification actions
- **Wear OS**: `NotificationCompat.WearableExtender().addAction(...)` gives one-tap Approve/Deny buttons; `setAuthenticationRequired(true)` (API 31+) makes the OS require keyguard before the action's PendingIntent fires; server must still validate request, expiry, authorization, idempotency ([SOURCE: developer.android.com/training/wearables/notifications], [SOURCE: developer.android.com/reference/androidx/core/app/NotificationCompat.Action]).
- **Apple Watch**: actionable notifications show up to four action buttons in the long-look interface; approve/deny-style categories are the documented pattern ([SOURCE: developer.apple.com/documentation/watchos-apps/adding-actions-to-notifications-on-watchos], [SOURCE: developer.apple.com/design/human-interface-guidelines/notifications]).
- **Android visibility**: `VISIBILITY_PRIVATE` + sanitized `setPublicVersion()`; MASWE-0037: notifications are readable on the lock screen and by notification-access apps — any sensitive value in a notification is exposure ([SOURCE: developer.android.com/reference/android/app/Notification], [SOURCE: mas.owasp.org/MASWE/MASVS-PLATFORM/MASWE-0037/]).
- **Web Push actions**: `Notification.actions` (with action URLs handled by the SW) are supported in Chrome/Android; **iOS Safari Web Push does not support notification actions** — iOS web apps get tap-to-open only ([SOURCE: developer.mozilla.org/en-US/docs/Web/API/Notification/actions] — platform-documented limitation).

### F2. Implication
- Glance approve is possible on Android (phone lock screen + Wear) via Web Push actions with OS-gated authentication; on iOS the PWA cannot offer action buttons — open-to-view is the only path (still better than the reference's plain hints, because the local cache renders rich content on open without a second server round-trip).

## Design: glance-class approval (Android-first, iOS-documented)

1. **Decision submission, not authority**: the glance Approve/Deny button submits `{leaseId, nonce, outcome}` to the relay via the SW (device credential); the relay settles it through the **exact same lease CAS as in-app approval** (006) — digest revalidation, expiry, single-settlement, epoch invalidation. A glance action is one more *responder device*, never a shortcut that skips the ledger.
2. **OS-gated authentication**: `setAuthenticationRequired(true)` on Android (keyguard before the action fires); iOS lock-screen actions are governed by device settings (documented, no bypass attempted).
3. **Content discipline (MASWE-0037)**: the glance card shows only class + client-local session label + "Approve/Deny" — no tool name, no args, no path (the rich redacted preview stays in-app post-unlock; iteration 11 lock-state rule).
4. **Risk-class bounds**: glance quick-approve is **opt-in per risk class**; medium-risk default enabled, high-risk default off (high-risk always requires the in-app full card + optional number matching). Deny is always available from glance (safe default). Notification actions never carry `renotify` churn (iteration 13 tag rules).
5. **iOS row**: no action buttons (WebKit limitation) — tap opens the PWA; the unlocked local cache renders the card immediately (axis 5); documented as the platform-difference row in 007.
6. **Watch UX**: Wear OS watch shows the same class-level card; long-press context for "open on phone"; the watch inherits the phone's risk-class policy (no separate config surface).

### Why this exceeds the reference
- Reference: notifications are hints; no action buttons; every decision requires opening the app (and its documented render failures stall sessions).
- Pi: glance-class *decision submission* on Android/Wear with OS-gated auth and full lease-CAS validation — the fastest safe approval path that exists for a remote agent; iOS gets the same policy with open-to-view mechanics, honestly documented.

## Sources Consulted
- [SOURCE: https://developer.android.com/training/wearables/notifications]
- [SOURCE: https://developer.android.com/reference/androidx/core/app/NotificationCompat.Action]
- [SOURCE: https://developer.apple.com/documentation/watchos-apps/adding-actions-to-notifications-on-watchos]
- [SOURCE: https://developer.apple.com/design/human-interface-guidelines/notifications]
- [SOURCE: https://developer.android.com/reference/android/app/Notification]
- [SOURCE: https://mas.owasp.org/MASWE/MASVS-PLATFORM/MASWE-0037/]

## Assessment
- newInfoRatio: 0.50
- Novelty justification: glance actions as lease-CAS decision submissions with risk-class bounds and the iOS action-button limitation row are new; platform mechanics consolidated.
- Confidence: high on platform facts; design maps to 006 unchanged.

## Reflection
- What worked: separating "submit decision" from "grant authority" — glance actions stay inside the ledger.
- What failed / ruled out: glance actions showing tool/args content (MASWE-0037); glance approve for high-risk (needs full card + matching); iOS action buttons (unsupported by WebKit).
- Ruled out: any glance path that skips digest revalidation.

## Recommended Next Focus
Depth pass: session catalog redaction details — exact metadata fields, retention bounds, and the offline read-only cache policy (005/001 reconciliation).
