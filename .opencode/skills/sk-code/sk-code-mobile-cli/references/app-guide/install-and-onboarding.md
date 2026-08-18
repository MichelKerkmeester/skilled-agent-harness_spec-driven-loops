# Pi Remote Installation Guide

Complete installation and configuration guide for Pi Remote, a private installable PWA that remote-controls the Pi coding agent from an enrolled phone over a Tailscale tailnet. Covers the loopback relay with its redacted SQLite ledger, prompt steering, exact-action approval for protected tool calls, and the offline-capable PWA shell. Uses a foreground deployment script that configures tailnet-only Tailscale Serve routes. Lets you watch and steer Pi from your phone without exposing any service to the public internet.

---

## AI-FIRST INSTALL GUIDE

**Copy and paste this prompt to your AI assistant to get installation help:**

```
I want to install Pi Remote in the Pi Mobile app directory

Please help me:
1. Verify I have Node.js 22, npm 10, the pi binary and a Tailscale tailnet
2. Install dependencies with npm ci
3. Build all four workspaces with npm run build
4. Configure deploy/serve.env with the exact Tailscale Serve origin
5. Start the deployment with sh deploy/setup-tailscale-serve.sh and verify the Serve routes
6. Guide me through phone enrollment and the PWA install

Guide me through each step with the exact commands I need to run.
```

**What the AI will do:**

- Verify Node.js, npm, the pi binary and Tailscale
- Install dependencies with `npm ci`
- Build the protocol, relay, web and extension workspaces with `npm run build`
- Configure `deploy/serve.env`
- Start the deployment and check `tailscale serve status` plus `tailscale funnel status`
- Walk through enrollment and the PWA install on the phone

**Expected setup time:** 20-30 minutes

---

## 1. OVERVIEW

Pi Remote is a loopback relay plus an installable PWA. The relay runs next to Pi on one host, owns one Pi RPC child, and keeps a bounded redacted event ledger. Tailscale Serve exposes the PWA and the relay API to the phone over private HTTPS and WSS. The phone enrolls once, then watches the transcript, steers prompts, and decides protected tool calls.

### Core Principle

> **Install once, verify at each step.** Each phase has a validation checkpoint. Do not proceed until the checkpoint passes.

### Key Features

| Feature                     | Description                                                                            |
| --------------------------- | -------------------------------------------------------------------------------------- |
| **Redacted transcript**     | Paths, secrets and private text are replaced before persistence or broadcast           |
| **Prompt steering**         | One steering prompt is written to the owned Pi child                                   |
| **Protected tool approval** | `edit`, `write`, `bash` and `fetch` wait for a phone decision on an exact-action lease |
| **Tailnet-only ingress**    | Loopback relay plus private Tailscale Serve routes, Funnel disabled                    |
| **Installable PWA**         | Offline shell with a stale read-only cache                                             |

### Architecture Overview

```
┌────────────────────────────────────────────────────────────┐
│                Phone PWA (browser on the tailnet)          │
│          enrollment, transcript, approval decisions        │
└───────────────────────────┬────────────────────────────────┘
                            │ HTTPS and WSS via Tailscale Serve
                            ▼
┌────────────────────────────────────────────────────────────┐
│               Loopback relay (127.0.0.1:4310)              │
│      redacted SQLite ledger, auth, sync, approval, push    │
└───────────────────────────┬────────────────────────────────┘
                            │ strict LF-delimited JSONL
                            ▼
┌────────────────────────────────────────────────────────────┐
│            Pi RPC child (pi --mode rpc --no-session)       │
│      read tools plus the optional approval extension       │
└────────────────────────────────────────────────────────────┘
```

---

## 2. PREREQUISITES

**Phase 1** verifies the tools and services the deployment needs.

### Required Software

1. **macOS with Node.js 22 or newer and npm 10 or newer**

   ```bash
   node --version
   # → v22.x.x

   npm --version
   # → 10.x.x
   ```

   Install with Homebrew when absent:

   ```bash
   brew install node
   ```

2. **The pi binary, version 0.84.1 pinned**

   ```bash
   pi --version
   # → 0.84.1
   ```

   The relay does not enforce the version. When `pi` is unavailable the relay replays its recorded fixture instead. Load the extension in a live Pi for the mutation boundary to be operator-verified. The relay runs one of three host-selected postures — fail-closed steering-only default, allowlisted mutation family, or operator-only full access (`--full-access` / `PI_REMOTE_FULL_ACCESS=1`, desktop parity, never enableable from the phone); see [Security](security.md).

3. **A Tailscale tailnet with Serve permission on the host**

   ```bash
   tailscale status
   # → your host appears with a 100.x.y.z tailnet address
   ```

   The host must be signed in and allowed to configure Serve. The phone must join the same tailnet.

### Validation: `phase_1_complete`

```bash
node --version      # → v22.x.x
npm --version       # → 10.x.x
pi --version        # → 0.84.1
tailscale status    # → your host and phone appear on the tailnet
```

**Checklist:**

- [ ] `node --version` returns 22 or newer?
- [ ] `npm --version` returns 10 or newer?
- [ ] `pi --version` returns 0.84.1?
- [ ] `tailscale status` shows the host on the tailnet?

❌ **STOP if validation fails** - Fix prerequisites before continuing.

---

## 3. INSTALLATION

This section covers **Phase 2 (Install)** and **Phase 3 (Build)**.

### Step 1: Install Dependencies

Run from the Pi Mobile app directory:

```bash
npm ci
```

`npm ci` installs from `package-lock.json` and sets up the four workspaces under `packages/`, `apps/` and `extensions/`.

### Step 2: Build All Workspaces

```bash
npm run build
```

`npm run build` compiles the protocol package, relay, PWA and approval extension in dependency order. The relay build also copies its runtime assets.

### Step 3: Verify the Build Outputs

```bash
ls apps/pi-remote-relay/dist/index.js
ls apps/pi-remote-web/dist/index.html
ls extensions/pi-remote-approval/dist/index.js
```

Each path must exist.

### Validation: `phase_2_complete`

```bash
ls apps/pi-remote-relay/dist/index.js           # → file exists
ls apps/pi-remote-web/dist/index.html           # → file exists
ls extensions/pi-remote-approval/dist/index.js  # → file exists
```

**Checklist:**

- [ ] `npm ci` exits 0?
- [ ] `npm run build` exits 0?
- [ ] All three build outputs exist?

❌ **STOP if validation fails** - Check the install and build output for errors.

### Optional: Typecheck And Test

```bash
npm run typecheck
npm test
```

Both must exit 0. `npm test` runs the protocol, relay, extension and root suites.

### Validation: `phase_3_complete`

```bash
npm run typecheck    # → exits 0
npm test             # → all suites pass
```

❌ **STOP if validation fails** - Fix the failing workspace before continuing.

---

## 4. CONFIGURATION

This section covers **Phase 4 (Configure and deploy)**.

### Step 1: Create the Serve Environment File

```bash
cp deploy/serve.env.example deploy/serve.env
```

Set `PI_REMOTE_PUBLIC_ORIGIN` to the exact HTTPS origin Tailscale assigned to this host. Find it with `tailscale serve status` while the host has any Serve route, or use the pattern `https://<host-name>.<tailnet-name>.ts.net`. Leave the relay and web ports at their defaults unless another loopback service occupies them.

### Step 2: Start the Deployment in the Foreground

```bash
sh deploy/setup-tailscale-serve.sh
```

The script:

1. Generates a fresh 256-bit Serve anchor in memory
2. Starts the relay on `127.0.0.1:4310`
3. Starts the PWA preview on `127.0.0.1:4173`
4. Disables the HTTPS Funnel route
5. Routes `/` to the PWA and secret-prefixed `/api` plus `/health` to the relay
6. Removes those routes and stops both processes when the script exits

Keep the script in the foreground. The relay prints one short-lived enrollment JSON object at startup when `PI_REMOTE_PRINT_ENROLLMENT` is `1`.

### Step 3: Verify the Serve Routes

In a second terminal:

```bash
tailscale serve status
tailscale funnel status
```

Serve must show only the intended HTTPS routes for `/`, `/api` and `/health`. Funnel must show no public listener.

### Validation: `phase_4_complete`

```bash
tailscale serve status     # → HTTPS routes only for /, /api and /health
tailscale funnel status    # → no public listener
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:4310/api/sessions
# → 403, because the loopback relay requires a signed device session
```

**Checklist:**

- [ ] `deploy/serve.env` sets the exact tailnet origin?
- [ ] `tailscale serve status` shows only the three HTTPS routes?
- [ ] `tailscale funnel status` shows no listener?
- [ ] A direct loopback request returns `403`?

❌ **STOP if validation fails** - Fix the origin, the Serve routes or the Funnel state before continuing.

---

## 5. VERIFICATION

This section covers **Phase 5 (End to end)**.

### Step 1: Enroll the Phone

1. Transfer the printed enrollment JSON through an operator-controlled path. Encode it as a QR image with a trusted local tool, or move the text for pasting. Do not publish or retain it.
2. Open the configured HTTPS origin on the phone.
3. Choose **Scan image** to select a QR image when the browser provides `BarcodeDetector`, or paste the JSON into **Enrollment data**.
4. Choose **Enroll device** before the five-minute challenge expires.
5. Confirm the app leaves the enrollment screen and shows the opaque session catalog.

The phone generates a non-extractable P-256 private key. The key and the opaque device record stay in browser IndexedDB. Enrollment is single-use and binds to the exact origin, host fingerprint, Tailscale principal and submitted public key.

### Step 2: Install the PWA on iPhone

1. Open the HTTPS origin in Safari.
2. Use **Share** then **Add to Home Screen**.
3. Launch the installed app from the Home Screen.

The service worker is registered only in production builds, and the Serve deployment uses the built PWA preview.

### Step 3: Review an Approval

Send a prompt from the PWA, then request an action in the protected family from the Pi side. Confirm the Attention Inbox shows the request and that a decision reaches the tool.

### Success Criteria (`phase_5_complete`)

- [ ] ✅ Phone shows the opaque session catalog after enrollment
- [ ] ✅ PWA opens from the Home Screen on the iPhone
- [ ] ✅ A steering prompt appears in the transcript
- [ ] ✅ A protected tool call waits for a decision and resolves after approval

❌ **STOP if validation fails** - Regenerate the enrollment payload by restarting the foreground deployment and retry.

---

## 6. USAGE

### Daily Workflow

```bash
# Start the deployment in the foreground
sh deploy/setup-tailscale-serve.sh

# Open the HTTPS origin on the phone and use the installed PWA
```

### Common Operations

```bash
# Stop the deployment and remove the Serve routes
# Interrupt the foreground script with Ctrl-C

# Verify the routes are gone
tailscale serve status

# Rebuild after a change
npm run build

# Run the release gate
npm run release:verify
```

When push is configured, open **Attention hints** in the PWA and choose **Enable notifications**. The browser creates the subscription only after notification permission is granted.

---

## 7. FEATURES

| Feature                 | Description                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------ |
| **Redacted ledger**     | Newest 1,000 envelopes per stream epoch with a retention floor                       |
| **Sync replay barrier** | Snapshot or delta from one committed high-water barrier                              |
| **Approval leases**     | Durable pending, approved and consumed states with a final gate                      |
| **Accept-edits grants** | Binds a principal, session, epoch, tool list, at most 10 actions and a 10-minute TTL |
| **Push hints**          | Content-free hints carrying only a lookup id and an attention class                  |
| **Enrollment**          | Single-use payload bound to origin, host, principal and public key                   |

---

## 8. EXAMPLES

**Scenario 1: watch a session from the phone**

Open the PWA, pick a session from the catalog and follow the redacted transcript as the relay replays it.

**Scenario 2: approve an edit**

A protected `edit` call posts an `approval.requested` card. The phone shows the exact action, the operator approves, and the extension consumes the one-use lease before Pi executes.

**Scenario 3: steer the agent**

Submit a prompt from the PWA. The relay writes one steering prompt to the owned Pi child and broadcasts the projected user block back to the phone.

---

## 9. TROUBLESHOOTING

### Common Errors

**❌ "Missing deploy/serve.env"**

- **Cause**: The config file does not exist.
- **Fix**:
  ```bash
  cp deploy/serve.env.example deploy/serve.env
  ```

**❌ "PI_REMOTE_PUBLIC_ORIGIN is required"**

- **Cause**: The origin is empty or does not match the Tailscale assignment.
- **Fix**: Read the origin from `tailscale serve status` and set it in `deploy/serve.env`.

**❌ "Command not found: pi"**

- **Cause**: The pi binary is not on PATH.
- **Fix**: Install or locate `pi`, then re-run `pi --version`. The relay falls back to its recorded fixture when `pi` is unavailable.

**❌ "Cannot reach the HTTPS origin on the phone"**

- **Cause**: The foreground deployment stopped, or the Serve routes are missing.
- **Fix**:
  ```bash
  sh deploy/setup-tailscale-serve.sh
  tailscale serve status
  ```

**❌ "Enrollment failed"**

- **Cause**: The payload expired, was edited or was reused.
- **Fix**: Restart the foreground deployment to print a fresh payload and enroll again.

**❌ "Funnel status shows a public listener"**

- **Cause**: The Funnel route is still enabled.
- **Fix**:
  ```bash
  tailscale funnel --https=443 off
  tailscale funnel status
  ```

**❌ "Push notifications are not offered in the PWA"**

- **Cause**: One of the four push variables is missing from `deploy/serve.env`.
- **Fix**: Set `PI_REMOTE_PUSH_ENCRYPTION_KEY`, `PI_REMOTE_VAPID_PUBLIC_KEY`, `PI_REMOTE_VAPID_PRIVATE_KEY` and `PI_REMOTE_VAPID_SUBJECT`, then restart the deployment.

### Operator-Only Checks

The repository cannot run these itself. Verify them on the target environment before relying on the deployment:

- Real Tailscale: Serve shows only the intended routes, Funnel has no listener, and a direct loopback request returns `403`
- iOS Web Push: delivery works on a physical supported device
- `sandbox-exec`: the escape suite passes on the deployment OS
- Live Pi: the approval extension loads on Pi 0.84.1 and is the final `tool_call` handler

---

## 10. RESOURCES

### File Locations

| Path                              | Purpose                                          |
| --------------------------------- | ------------------------------------------------ |
| `deploy/serve.env`                | Deployment configuration copied from the example |
| `deploy/setup-tailscale-serve.sh` | Foreground deployment and Serve route setup      |
| `deploy/containment/pi-remote.sb` | macOS sandbox profile for protected execution    |
| `../ARCHITECTURE.md`              | Full system architecture                         |
| `docs/security.md`                | Posture boundaries and approval contracts        |
| `docs/operations.md`              | Runtime operations                               |
| `docs/incident-playbooks.md`      | Recovery runbooks                                |
| `docs/platform-support.md`        | PWA and notification limits                      |

### CLI Command Reference

```bash
# Install and build
npm ci
npm run build

# Deploy in the foreground
sh deploy/setup-tailscale-serve.sh

# Verify routes
tailscale serve status
tailscale funnel status

# Workspace commands
npm run start -w @pi-remote/relay
npm run preview -w @pi-remote/web
npm run dev -w @pi-remote/web
npm test -w @pi-remote/approval-extension
```

### Related Documents

- [Setup](setup.md) for the detailed setup runbook
- [Security](security.md) for the posture boundaries
- [Architecture](../ARCHITECTURE.md) for the system reference
- [Release Verification](release-verification.md) for machine gates and staged readiness

---

## Quick Start Summary

```bash
# 1. Prerequisites
node --version
npm --version
pi --version
tailscale status

# 2. Install
npm ci

# 3. Build
npm run build

# 4. Configure
cp deploy/serve.env.example deploy/serve.env
# Set PI_REMOTE_PUBLIC_ORIGIN to the exact tailnet HTTPS origin

# 5. Deploy and enroll
sh deploy/setup-tailscale-serve.sh
# Enroll the phone from the printed payload, then add the PWA to the Home Screen
```

---

**Installation Complete!**

You now have Pi Remote installed and deployed. Open the HTTPS origin on the phone, enroll once, and add the PWA to the Home Screen. Watch the transcript, steer prompts and decide protected tool calls from the Attention Inbox.
