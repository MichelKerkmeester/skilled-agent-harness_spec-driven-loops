---
title: Pi Remote Setup
description: Install the relay, deploy it through Tailscale Serve, enroll the phone, and install the PWA.
trigger_phrases:
  - 'pi remote setup'
  - 'tailscale serve deployment'
  - 'enroll the phone'
  - 'install the pwa'
  - 'relay deployment'
  - 'device enrollment'
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Pi Remote Setup

Install the relay, deploy it through Tailscale Serve, enroll the phone, and install the PWA.

---

## 1. OVERVIEW

### Purpose

Pi Remote runs the relay and Pi on the same host. The relay binds only to `127.0.0.1`. Tailscale Serve is the supported HTTPS/WSS ingress for the phone.

### Core Principle

Loopback-only relay plus Tailscale Serve ingress equals a private, tailnet-only control path for the phone.

### When to Use

- First-time deployment of Pi Remote on a host
- Re-enrollment of a phone after a relay restart
- Rebuilding the relay, PWA, or approval extension

### Prerequisites

- Node.js 22 or newer and npm 10 or newer
- Tailscale installed, signed in, and permitted to configure Serve on the host
- Pi 0.84.1 available as `pi` for the pinned live target
- A phone on the same tailnet with a supported browser

### Relay Process Boundary

The relay supports three host-selected postures. By default it starts `pi --mode rpc --no-session --no-tools --no-extensions`; this steering slice disables all built-in, extension, and custom tools at the Pi process boundary. The allowlisted mutation posture (`PI_REMOTE_MUTATION_ENABLED=1` with one family) instead exposes a small tool family behind the approval extension. The operator-only full-access posture (`--full-access` / `PI_REMOTE_FULL_ACCESS=1`) starts `pi --mode rpc --no-session --approve` with every built-in tool and no approval extension — desktop parity, host-selected only, never enableable from the phone. In every posture the relay does not attach to an already-running Pi process, expose Pi session files, or check the Pi version. If `pi` cannot be started because the executable is absent, the relay replays its bundled fixture. The current health response does not distinguish live and fixture supervisor states.

---

## 2. INSTALL AND BUILD

Run from the Pi Remote directory:

```bash
npm install
npm run build
```

`npm run build` builds the protocol package, relay, PWA, and approval extension in dependency order.

---

## 3. CONFIGURE TAILSCALE SERVE

Create `deploy/serve.env` from `deploy/serve.env.example`. Set `PI_REMOTE_PUBLIC_ORIGIN` to the exact HTTPS origin assigned to this host by Tailscale Serve. Leave the relay and web ports at their defaults unless they conflict with another loopback service.

Do not place a Serve anchor, device key, session cookie, WebSocket ticket, enrollment payload, push encryption key, or VAPID private key in documentation, screenshots, or logs.

Start the deployment in the foreground:

```bash
sh deploy/setup-tailscale-serve.sh
```

The script:

1. Generates a fresh 256-bit Serve anchor in memory.
2. Starts `npm run start -w @pi-remote/relay` on `127.0.0.1:4310`.
3. Starts `npm run preview -w @pi-remote/web` on `127.0.0.1:4173`.
4. Disables the HTTPS Funnel route.
5. Routes `/` to the PWA and secret-prefixed `/api` and `/health` targets to the relay.
6. Removes those routes and stops both processes when the foreground script exits.

`PI_REMOTE_PRINT_ENROLLMENT` defaults to `1` in the deployment script. The relay prints one short-lived enrollment JSON object at startup.

### Operator-Verified: Tailscale

The repository cannot validate the target tailnet. On the deployment host, confirm:

```bash
tailscale serve status
tailscale funnel status
```

Serve must show only the intended HTTPS routes for `/`, `/api`, and `/health`. Funnel must show no public listener. A direct request to the relay or a request through another proxy must remain forbidden.

---

## 4. ENROLL THE PHONE

The repository emits enrollment JSON. It does not render a QR image. Transfer that exact one-time JSON through an operator-controlled path:

1. Encode the printed JSON as a QR image with a trusted local tool, or transfer it for pasting without publishing or retaining it.
2. Open the configured tailnet HTTPS origin on the phone.
3. Choose **Scan image** to select a QR image when the browser provides `BarcodeDetector`, or paste the JSON into **Enrollment data**.
4. Choose **Enroll device** before the five-minute challenge expires.
5. Confirm the app leaves the enrollment screen and shows the opaque session catalog.

The phone generates a non-extractable P-256 private key. The private key and opaque device record remain in browser IndexedDB. Enrollment is single-use and is bound to the exact origin, host fingerprint, Tailscale principal, and submitted public key.

If enrollment fails, generate a fresh payload by restarting the foreground deployment. Reusing or editing a payload is rejected.

---

## 5. INSTALL THE PWA

- iPhone or iPad: open the HTTPS origin in Safari, use **Add to Home Screen**, then launch the installed app.
- Android: open the HTTPS origin in Chrome or a compatible browser and use its install action if offered.
- Desktop: use the browser install action if available, or keep using the HTTPS site.

The service worker is registered only in production builds. The Tailscale deployment uses the built PWA preview and therefore enables the installable shell. See [Platform Support](../standards/platform-support.md) for notification and offline limits.

---

## 6. OPTIONAL PUSH

Push remains disabled unless all four relay variables are present: `PI_REMOTE_PUSH_ENCRYPTION_KEY`, `PI_REMOTE_VAPID_PUBLIC_KEY`, `PI_REMOTE_VAPID_PRIVATE_KEY`, and `PI_REMOTE_VAPID_SUBJECT`. The setup script does not create them.

When push is configured, open **Attention hints** in the PWA and choose **Enable notifications**. The browser creates the subscription only after notification permission is granted. The Attention Inbox remains authoritative when push is disabled, denied, delayed, or lost.

---

## 7. OPERATOR-VERIFIED BOUNDARIES

Before enabling mutation or treating the deployment as live-agent evidence, verify these on the target environment:

- The Pi extension loads on Pi 0.84.1 and is the final `tool_call` handler.
- The extension authorizer is actually wired to the relay. The shipped production entrypoint does not provide that wiring.
- The macOS `sandbox-exec` escape suite passes on the deployment OS.
- Tailscale Serve preserves the exact Origin and trusted identity boundary.
- iOS Web Push works on a physical supported device if iOS delivery is required.
