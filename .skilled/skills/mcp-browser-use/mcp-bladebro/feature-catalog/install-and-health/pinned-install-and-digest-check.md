---
title: "Pinned install and digest check"
description: "An operator-approved `npm install -g --ignore-scripts bladebro@4.8.2` adds the native binary through optional dependencies with no lifecycle script, and the SHA-256 of the native binary and of the two JS launcher files is checked against recorded digests before first use."
trigger_phrases:
  - "pinned install and digest check"
  - "install bladebro"
  - "bladebro sha256"
  - "bladebro install.sh"
version: 1.0.1.0
---

# Pinned install and digest check (npm install -g --ignore-scripts bladebro@4.8.2)

## 1. OVERVIEW

An operator-approved `npm install -g --ignore-scripts bladebro@4.8.2` adds the native binary through optional dependencies with no lifecycle script, and the SHA-256 of the native binary and of the two JS launcher files is checked against recorded digests before first use.

Installing Bladebro changes the host, so it is an operator stop-for-yes every time. Without that yes, the agent reports the command and stops. The pin and the digest keep the binary the packet was written against.

---

## 2. HOW IT WORKS

### Preflight

`command -v bladebro || echo absent` shows whether Bladebro is already present. `node --version` must report Node 14 or later for the npm launcher, and a Chromium-family browser must be on the host.

### Install and Digest

`npm install -g --ignore-scripts bladebro@4.8.2` adds the package plus the native `bladebro-darwin-arm64` or `bladebro-darwin-x64` package through optional dependencies, and no lifecycle script runs. Before anything installed first runs, the native binary's SHA-256 is compared with the v4.8.2 release `.sha256` sidecar through `shasum -a 256 -c`. The two JS files the npm launcher runs first, `bin.js` and `binary.cjs`, are compared with the digests recorded from the 4.8.2 package. The standalone prebuilt binary plus its digest is the higher-assurance alternative to npm.

### Wrapper Script

`scripts/install.sh` refuses a platform with no recorded digest, does nothing when `bladebro` is already on PATH, installs the pinned release with lifecycle scripts off, checks the launcher and native binary digests before the version, and removes the install again on a mismatch. It never runs `npm update` or `bladebro -u`. The native binary and launcher digests live in that script, in `scripts/doctor.sh` and in `references/install-and-verify.md`, so a new pin changes all three.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/references/install-and-verify.md` | Shared | Preflight, install steps, digests and rollback |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh` | Script | Pinned install with the digest and version checks |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/INSTALL-GUIDE.md` | Shared | Operator install walk-through |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/mcp-servers/bladebro-cli/README.md` | Shared | Install pointer for the binary |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/preflight-and-install/host-preflight.md` | Manual playbook | Host readiness before the install |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/preflight-and-install/npm-install.md` | Manual playbook | The pinned npm install |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/preflight-and-install/native-binary-digest.md` | Manual playbook | The digest against the release sidecar |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-21--manual-testing-playbook--macos-live/README.md` | Benchmark | Recorded install output and matching digests |

---

## 4. SOURCE METADATA

- Group: Install and Health
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `install-and-health/pinned-install-and-digest-check.md`

Related references:
- [health-diagnostics.md](health-diagnostics.md) - The checks after the install
- [teardown-and-rollback.md](teardown-and-rollback.md) - Undoing the install
