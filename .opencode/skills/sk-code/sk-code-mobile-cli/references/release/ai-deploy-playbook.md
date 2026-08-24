---
title: Pi Remote AI Deploy Playbook
description: Deterministic runbook an AI agent follows to deploy, boot, and onboard Pi Remote for a user with one command.
trigger_phrases:
  - 'pi remote boot'
  - 'deploy pi remote'
  - 'boot pi remote'
  - 'onboard the phone'
  - 'ai deploy playbook'
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Pi Remote AI Deploy Playbook

Deploy, boot, and onboard Pi Remote for a user from one command, then hand the user a copy-paste download and install message. Every step has an expected output and a decision point. Do not improvise past a checkpoint that fails.

---

## 1. OVERVIEW

Pi Remote runs a loopback relay that supervises one `pi --mode rpc` child, plus a built PWA. Tailscale Serve exposes only tailnet HTTPS routes to the phone. `node scripts/boot.mjs` (or `npm run boot`) performs the whole sequence and prints the handoff.

Core principle: fail closed. If any preflight check, posture assertion, or readiness signal fails, boot stops with a named cause and a remediation hint. Nothing else runs.

---

## 2. WHEN TO USE

- First deployment on a Mac
- Re-deployment after a stop or a crash
- Re-onboarding a phone after an enrollment payload expired
- Any time an AI agent is asked to make Pi Remote reachable

Do not use boot to change app behavior, auth, mutation policy, or push. Those are separate operator concerns.

---

## 3. PREFLIGHT DECISION POINTS

Run the boot command. Boot checks, in order: node, npm, pi, tailscale, then `deploy/serve.env`.

| Check              | Pass condition                                  | Fail outcome                                                |
| ------------------ | ----------------------------------------------- | ----------------------------------------------------------- |
| node               | 22 or newer on PATH                             | Boot stops with the version and a hint                      |
| npm                | 10 or newer on PATH                             | Boot stops with the version and a hint                      |
| pi                 | 0.84.1 on PATH                                  | Boot stops with the pinned version and a hint               |
| tailscale          | `tailscale status` exits 0                      | Boot stops and asks for `tailscale up` or the Tailscale app |
| `deploy/serve.env` | present with an https `PI_REMOTE_PUBLIC_ORIGIN` | Boot stops and names the missing setting                    |

Decision points:

- A check fails. Fix the named tool, then re-run the same command. Never continue past a failed check.
- Tailscale is not logged in. Run `tailscale up` or sign in through the Tailscale app, confirm `tailscale status` shows the host, then re-run boot.
- The tailnet is down. `tailscale status` fails or shows no host. Bring the tailnet back before booting. Boot does not guess.
- `deploy/serve.env` is missing. Copy `deploy/serve.env.example` to `deploy/serve.env` and set `PI_REMOTE_PUBLIC_ORIGIN` to the exact HTTPS origin shown by `tailscale serve status`.

---

## 4. ONE-COMMAND BOOT

From the Pi Remote directory:

```bash
node scripts/boot.mjs
```

Or, with the script alias:

```bash
npm run boot
```

Expected progression on stdout:

```text
[boot] stage: preflight
[boot] preflight: ok
[boot] stage: config
[boot] stage: build
[boot] stage: deploy
... relay and web startup output ...
Pi Remote is configured for tailnet-only Serve.
[boot] stage: posture
[boot] posture: Funnel asserted off
================================================================
PI REMOTE BOOT COMPLETE
================================================================
... URL, enrollment, and COPY-PASTE USER INSTRUCTIONS ...
```

The boot process stays in the foreground and supervises the deployment. The relay, the web preview, and the Serve routes stay up until you stop the process with Ctrl-C.

---

## 5. STAGES AND EXPECTED OUTPUT

### 5.1 Preflight

Boot verifies node, npm, pi, and tailscale, then reads `deploy/serve.env`.

Expected: `[boot] preflight: ok`.

### 5.2 Build

Boot runs `npm ci` only when `node_modules` is absent, then always runs `npm run build`.

Expected: the four workspaces build in dependency order and the command exits 0.

### 5.3 Ingress

Boot spawns `deploy/setup-tailscale-serve.sh`, which starts the relay on `127.0.0.1:4310`, the web preview on `127.0.0.1:4173`, turns Funnel off, and configures tailnet-only Serve routes for `/`, `/api`, and `/health`.

Expected: the line `Pi Remote is configured for tailnet-only Serve.` and an enrollment JSON line.

### 5.4 Posture assertion

Boot asserts Funnel is off and that the Serve routes point at the relay and web ports in `deploy/serve.env`.

Expected: `[boot] posture: Funnel asserted off` and no failure.

### 5.5 Enrollment

Boot captures the one-time enrollment payload the relay prints at startup. The payload is single-use and expires five minutes after the relay starts.

### 5.6 Handoff

Boot prints the tailnet HTTPS URL, the enrollment QR when the optional `qrencode` tool is installed, the enrollment code otherwise, and the copy-paste user instructions.

---

## 6. DECISION POINTS

| Situation                                       | Boot behavior                                                     | Action                                                                                        |
| ----------------------------------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| A preflight check fails                         | Boot stops with the named tool and a hint                         | Fix the tool and re-run boot                                                                  |
| `deploy/serve.env` is missing                   | Boot stops and asks for a copy of `deploy/serve.env.example`      | Copy the example, set the exact HTTPS origin, re-run boot                                     |
| `PI_REMOTE_PUBLIC_ORIGIN` is empty or not https | Boot stops with a hint                                            | Set the exact origin from `tailscale serve status`                                            |
| `PI_REMOTE_PRINT_ENROLLMENT` is 0               | Boot stops                                                        | Set it to 1 in `deploy/serve.env` and re-run boot                                             |
| The relay port is occupied by a foreign process | Boot stops and names the port                                     | Identify the listener with `lsof -nP -iTCP:4310 -sTCP:LISTEN`, stop it if needed, re-run boot |
| The deployment is already live                  | Boot verifies posture and prints the handoff without a fresh code | To mint a fresh enrollment payload, stop with Ctrl-C and re-run boot                          |
| Serve routes are incomplete or point elsewhere  | Boot stops with a hint                                            | Reconcile `deploy/serve.env` or stop the other deployment, re-run boot                        |
| Funnel is on                                    | Boot stops and refuses to expose a public listener                | Run `tailscale funnel --https=443 off`, re-run boot                                           |
| The tailnet is down                             | Boot stops at preflight                                           | Bring up the tailnet, re-run boot                                                             |
| Enrollment expired                              | The phone rejects the payload                                     | Stop with Ctrl-C and re-run boot to mint a fresh payload                                      |
| The deployment script exits before readiness    | Boot stops with the exit code                                     | Inspect the relay and web logs in the output, free the ports, re-run boot                     |

---

## 7. USER HANDOFF MESSAGE

Boot prints the following block verbatim. Copy it to the user message.

```text
================================================================
COPY-PASTE USER INSTRUCTIONS
================================================================
1. On the iPhone, install the Tailscale app and sign in to the same tailnet as this Mac.
2. Open the URL above in Safari on the iPhone: <ORIGIN>
3. Tap Share, then Add to Home Screen, then Add.
4. Launch Pi Remote from the Home Screen.
5. On first launch, paste the enrollment code into Enrollment data, or choose Scan image and scan the QR above.
6. Tap Enroll device before the code expires (five minutes from boot).
7. Confirm the session catalog appears, then use Attention hints for notification hints if you want them.
================================================================
```

---

## 8. OPERATOR-ONLY CAVEATS

Boot asserts what it can verify from the host. The following stay operator-verified on the target environment and are never machine claims:

- Real Tailscale. Serve must show exactly the intended HTTPS routes for `/`, `/api`, and `/health` with no Funnel listener, and a direct loopback request to the relay must return 403. Confirm with `tailscale serve status` and `tailscale funnel status`.
- iOS on-device push. Web Push delivery on a physical iPhone requires operator confirmation and the four push variables in `deploy/serve.env`.
- `sandbox-exec` containment. The macOS sandbox escape suite must pass on the deployment OS before relying on the approval boundary.
- Live Pi. The relay falls back to its recorded fixture when the pi child fails to start. Confirm the pi child is live and, for mutation, that the approval extension loads on pi 0.84.1 and is the final `tool_call` handler.

---

## 9. IDEMPOTENCY AND CONVERGENCE

A second boot run on a live deployment detects the open relay port and the matching Serve routes, skips duplicate start and duplicate configuration, re-asserts posture, and prints the handoff again. Enrollment payloads are minted only at relay startup, so a fresh one-time code requires a stop and a re-run. Boot never creates duplicate relays, duplicate Serve routes, or duplicate enrollments.

---

## 10. STOP AND ROLLBACK

Stop the supervised deployment with Ctrl-C on the boot process. The deployment script removes the Serve routes and stops the relay and web preview. Boot never rewrites or deletes Pi native session history. The relay ledger and the pi child sessions are separate, and rollback touches neither.

To rebuild after a source change, stop the deployment, run `npm run boot` again, and hand over the fresh URL and payload.

---

## 11. REFERENCE

| Path                              | Purpose                                                      |
| --------------------------------- | ------------------------------------------------------------ |
| `scripts/boot.mjs`                | One-command boot sequence                                    |
| `deploy/setup-tailscale-serve.sh` | Foreground deployment and Serve route setup, invoked by boot |
| `deploy/serve.env`                | Deployment configuration copied from the example             |
| `docs/setup.md`                   | Detailed setup runbook                                       |
| `docs/install-and-onboarding.md`  | Installation and onboarding guide                            |

Commands:

```bash
node scripts/boot.mjs
npm run boot
node scripts/boot.mjs --enable-mutation filesystem
node scripts/boot.mjs --help
tailscale serve status
tailscale funnel status
```

---

**Done.** The app is deployed, booted, and onboarded when the user confirms the session catalog on the phone.
