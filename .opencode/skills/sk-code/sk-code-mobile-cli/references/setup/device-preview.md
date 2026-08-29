---
title: Previewing the App on a Phone-Shaped Screen
description: How to put the whole Pi Remote app in front of someone on a Mac — Chrome device emulation, the iOS Simulator, an Android emulator, or a real phone over the tailnet — and which one each question actually needs.
trigger_phrases:
  - "test the app in the emulator"
  - "ios simulator pi remote"
  - "android emulator preview"
  - "device preview on mac"
  - "see the app on a phone"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Previewing the App on a Phone-Shaped Screen

Storybook shows one component at a time; this shows the shipped app at phone size. The four ways
differ in what they can honestly prove.

---

## 1. OVERVIEW

### Core Principle

**Pick the cheapest surface that can answer the question.** Layout and reflow questions need only a
resized browser. Touch, safe areas and PWA install behaviour need a real engine. Push delivery and
the enrollment handshake need a real device on the tailnet — no emulator can stand in for them.

### When to Use

- The user asks to "see the app" rather than a component
- Checking a whole-screen layout, a scroll, or how two surfaces sit together
- Reproducing something that only happens on a narrow viewport or under a notch
- Verifying the PWA installs and launches standalone

### Key Sources

- `app-mobile/vite.config.ts` — the dev and preview servers, and the `.ts.net` allowed host
- `scripts/capture-screenshots.mjs` — the canonical `402 x 874` viewport the archive is captured at
- [`setup.md`](setup.md) — Tailscale Serve deployment and phone enrollment

### Prerequisites

`npm install` at the repository root. The relay only needs to be running for anything that talks to
a session; pure layout review does not need it.

---

## 2. START THE APP

```bash
npm run dev -w @pi-remote/web        # http://localhost:5173, hot reload
npm run preview -w @pi-remote/web    # serves the production build instead
```

Use `dev` while iterating and `preview` when the question is about the built output — a service
worker, an install prompt, or a bundle-size symptom will not behave the same under `dev`.

Both bind loopback and proxy the relay. The preview server additionally allows `.ts.net` hosts,
because Tailscale Serve forwards the tailnet hostname and Vite would otherwise reject every request
from the phone as a blocked host.

---

## 3. THE FOUR SURFACES

| Surface | Needs | Good for | Cannot prove |
|---|---|---|---|
| **Chrome device emulation** | nothing | Layout, reflow, the archive's exact `402 x 874` frame | Real touch, Safari engine bugs, install behaviour |
| **iOS Simulator** | Xcode | Safari/WebKit rendering, safe areas, standalone launch | Push delivery, real network conditions |
| **Android emulator** | Android Studio | Chrome-on-Android rendering, install banner | iOS-specific behaviour |
| **A real phone on the tailnet** | Tailscale + enrollment | Everything, including push and the enrollment handshake | — it is the target |

**Reach for the first row by default.** It costs nothing, and it is the same engine and viewport the
screenshot archive and `ui-audit.mjs` already use, so what you see matches what the gates measure.

### Chrome device emulation

Open the dev server, DevTools, toggle device toolbar, and set a custom `402 x 874` — that is the
archive's viewport, so a layout that looks right here matches the committed shots.

### iOS Simulator

The Simulator shares the Mac's network stack, so `http://localhost:5173` in its Safari reaches the
dev server with no extra configuration.

```bash
open -a Simulator          # boots the last-used device
```

Pick a device whose logical width is 402 (a recent Pro-sized iPhone) to match the archive. This is
the only surface that renders through WebKit, which is what the shipped PWA actually runs on — a
layout that survives Chrome emulation and breaks here is a real bug, not a false positive.

### Android emulator

An Android AVD does **not** share the host loopback. Reach the Mac from inside the emulator at
`http://10.0.2.2:5173`, not `localhost`.

### A real phone

Follow [`setup.md`](setup.md) for Tailscale Serve and enrollment. This is the only surface where push
delivery, the enrollment handshake and real network loss are observable — the release evidence rows
that say "operator-verified" exist precisely because no emulator can produce them.

---

## 4. WHAT NONE OF THEM PROVE

An emulator shows you the app; it does not check it. Colour and contrast are still resolved
browser-free, because the app's strict CSP renders it unstyled in headless Chrome — see
[`../verification/verification.md`](../verification/verification.md). Two states that differ only in
copy, a published state no rule consumes, or an inert control all look fine on any device and are
caught by [`../storybook/storybook.md`](../storybook/storybook.md)'s gate ladder instead.

---

## 5. RULES

### ✅ ALWAYS

- Match the archive's `402 x 874` viewport when comparing against committed screenshots.
- Use `preview` rather than `dev` for service-worker, install, or bundle questions.
- Say which surface an observation came from — "looks right in Chrome emulation" is a weaker claim
  than "renders correctly in the Simulator".

### ❌ NEVER

- Claim PWA install or push behaviour from Chrome device emulation.
- Use `localhost` from inside an Android emulator; it resolves to the emulator itself.
- Treat a device preview as a substitute for the value and state gates.

---

## 6. RELATED REFERENCES

- [`setup.md`](setup.md) — Tailscale Serve deployment, phone enrollment, and the pinned live Pi version.
- [`install-and-onboarding.md`](install-and-onboarding.md) — first run end to end.
- [`../storybook/running-storybook.md`](../storybook/running-storybook.md) — the component catalog, for one surface at a time.
- [`../verification/verification.md`](../verification/verification.md) — why value checks stay browser-free.
- [`../standards/platform-support.md`](../standards/platform-support.md) — the notification and offline limits a device preview will run into.
