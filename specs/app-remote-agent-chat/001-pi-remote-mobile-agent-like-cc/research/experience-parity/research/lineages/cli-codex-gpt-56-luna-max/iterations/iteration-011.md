# Iteration 011 — Pairing and onboarding

## Question

What can remove ticket-copying friction without pretending that private tailnet membership is optional?

## Evidence

Tailscale Serve is tailnet-only, supports HTTPS and identity headers, and recommends a localhost-only backend so headers cannot be spoofed ([Serve](https://tailscale.com/docs/features/tailscale-serve)). Tailscale identity binds user/device/node and access policy ([identity](https://tailscale.com/docs/concepts/tailscale-identity)). WebAuthn provides public-key registration and assertions in HTTPS secure contexts ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API)). Claude uses a session URL and QR code for mobile pairing ([Remote Control](https://code.claude.com/docs/en/remote-control)).

## Findings

Do not replace Tailscale; remove the extra ticket ceremony:

~~~json
{"kind":"pairing.started","pairingId":"pair_opaque","tailnetOrigin":"https://pi-host.tailnet.ts.net","challenge":"one_time_opaque","expiresAt":"2026-08-12T15:30:00Z","hostApprovalRequired":true}
{"command":"pairing.confirm","pairingId":"pair_opaque","challenge":"one_time_opaque","deviceKey":"ed25519_public_opaque","webauthn":{"credentialId":"credential_opaque"}}
{"kind":"device.registered","deviceId":"dev_opaque","sessionCapability":"read_and_decide","expiresAt":"2026-09-12T15:30:00Z"}
~~~

The host command displays a QR containing only the tailnet origin, pairing ID, and single-use challenge. The phone scans, is routed through Tailscale Serve, and registers a device public key. The host confirms the device name and capability once; no pasted ticket or static bearer secret exists. A passkey is optional step-up for approval capability, not a replacement for tailnet access. The relay stores the public key and capability, never the private key.

On subsequent visits, the PWA uses the registered key plus Serve identity; if either device or tailnet identity is revoked, it falls back to a new foreground pairing. An expired/scanned screenshot challenge is harmless. If the phone is not on the tailnet, onboarding says exactly that and gives the tailnet prerequisite; it never opens a public fallback.

## Better-than-parity proof

Pairing is one scan plus one host confirmation, has no reusable ticket, survives PWA reinstall only through an explicit new ceremony, and can revoke one device without rotating every session. The security boundary is clearer than a shared URL.

## Prior-art comparison

Claude proves QR pairing is usable. Tailscale supplies private transport and identity. WebAuthn supplies phishing-resistant device proof. The proposed flow composes them without weakening tailnet-only ingress.

## Assessment

New information ratio: 0.86. Q7 is answered: simplify pairing ergonomics, not the network trust boundary.
