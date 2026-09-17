---
title: Pi Remote Platform Support
description: Supported browsers, installed PWA behavior, push delivery limits, and the Attention Inbox fallback. Offline and cached views are visibly stale and cannot approve actions.
trigger_phrases:
  - 'ios safari installed pwa'
  - 'attention inbox fallback'
  - 'platform limits push delivery'
  - 'enrollment installation limits'
  - 'barcode detector scan image'
importance_tier: normal
contextType: general
version: 1.0.0.0
---

# Pi Remote Platform Support

Supported browsers, installed PWA behavior, push delivery limits, and the Attention Inbox fallback. Offline and cached views are visibly stale and cannot approve actions.

---

## 1. OVERVIEW

### Purpose

Document the supported platforms, installed PWA behavior, push delivery limits, and the Attention Inbox fallback for Pi Remote.

### Core Principle

The Attention Inbox is the authoritative fallback on every platform. Opening any hint requires fresh device authentication and a live relay fetch.

### Key Sources

- The PWA requires the private HTTPS origin configured through Tailscale Serve.
- The production service worker caches the application shell.
- The app stores a bounded seven-day read-only cache for up to eight sessions and 500 blocks per transcript.
- Push is an optional, lossy attention signal.
- Notification text never includes transcript, tool, approval, workspace, path, result, or decision content.

---

## 2. PLATFORM SUPPORT MATRIX

| Platform                               | Install prerequisites                                                       | Delivery limits                                                                                             | Kill and restart                                                                                          | Stale hints                                                               | Permission and Focus states                                                   | Fallback        |
| -------------------------------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | --------------- |
| iOS 16.4+ Home Screen                  | Safari, Add to Home Screen, then grant notifications from the installed app | Installed Home Screen web apps only. Delivery timing is controlled by iOS. No notification actions are used | The installed app may be killed. A notification opens the app, which reauthenticates before loading state | Expired, revoked, or prior-epoch hints show as stale and expose no action | Denied permission or Focus may suppress delivery without changing relay state | Attention Inbox |
| Android Chrome and compatible browsers | HTTPS origin, service worker, install optional, grant notifications         | Browser and OS battery policy may delay or suppress delivery                                                | Browser process may be killed. Notification click opens or focuses the PWA, then reauthenticates          | Expired, revoked, or prior-epoch hints show as stale and expose no action | Denied permission, Do Not Disturb, or site settings may suppress delivery     | Attention Inbox |
| Desktop Chromium-compatible browser    | HTTPS origin, service worker, grant notifications                           | Browser must retain push capability. OS notification settings apply                                         | Browser restart restores subscription when the endpoint remains valid                                     | Same epoch and revocation checks as mobile                                | Site permission and OS Focus may suppress delivery                            | Attention Inbox |

---

## 3. ENROLLMENT AND INSTALLATION LIMITS

- The PWA accepts pasted enrollment JSON on every supported browser.
- **Scan image** depends on the browser's `BarcodeDetector` support and selects an existing image. It is not a built-in live camera scanner.
- The repository emits enrollment JSON but does not generate a QR graphic.
- The PWA private key is non-extractable and stored in IndexedDB. Clearing site data requires fresh enrollment.
- iOS push requires installation to the Home Screen before notification permission is requested.
- The service worker is registered only in a production build, not the Vite development server.

---

## 4. OPERATOR-VERIFIED ITEMS

Actual iOS Web Push delivery requires a physical supported device. Android background delivery, desktop browser restart, OS Focus/Do Not Disturb behavior, installation prompts, and `BarcodeDetector` support also depend on the target browser and OS.

Pi Remote does not provide lock-screen approval or notification actions. A notification click only opens or focuses the PWA at an opaque attention lookup, after which the app reauthenticates and fetches current state.
