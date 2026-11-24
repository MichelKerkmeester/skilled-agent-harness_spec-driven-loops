---
title: "Bladebro Install and Verify"
description: "Operator-gated install, the v4.8.2 pin check, SHA-256 verification against release sidecars, the agent and real-browser probes, and staged rollback. This file never installs anything itself."
trigger_phrases:
  - "bladebro install"
  - "bladebro doctor"
importance_tier: normal
contextType: reference
version: 1.1.3.0
---

# Bladebro Install and Verify

What to run, in order, once the operator says yes to an install. Every step is upstream documentation pinned to v4.8.2 and read 2026-11-21. The steps ran live on macOS arm64 on 2026-11-21; the results are in `benchmark/reports/2026-11-21--manual-testing-playbook--macos-live/`.

---

## 1. OVERVIEW

### Purpose

Turns the install and health check into steps with an expected output and a rollback, so a live run can be compared against this packet.

### When to Use

Load this file when `command -v bladebro` fails, when `bladebro doctor` reports a problem, or when the operator asks to install, update, verify or remove Bladebro.

### Core Principle

Installation is an operator stop-for-yes. Without that yes, report the command and stop.

---

## 2. PREFLIGHT

| Step | Command | Expected |
|---|---|---|
| 1 | `command -v bladebro \|\| echo absent` | A path, or `absent` |
| 2 | `node --version` | Node.js 14 or later for the npm launcher; a Chromium-family browser on the host |

---

## 3. INSTALL (OPERATOR YES REQUIRED)

| Step | Command | Expected | Rollback |
|---|---|---|---|
| 3 | `npm install -g --ignore-scripts bladebro@4.8.2` | The package plus the native `bladebro-darwin-arm64` or `bladebro-darwin-x64` through optional dependencies. No lifecycle script runs | `npm uninstall -g bladebro` |
| 4 | `bladebro doctor` | Health pass, the data root (`~/.local/state/blade` or `~/.blade`), a browser found | Set `CHROME_PATH`, re-run |
| 5 | `bladebro --version` | `4.8.2` | None |

`scripts/install.sh` runs steps 3 to 5 with the digest checks below, and removes the install again on a missing file or a mismatch. It checks every digest before `--version` first runs installed code. `scripts/doctor.sh` repeats the digest checks read-only. It reads the installed version from the package manifest, so no `bladebro` call runs before the digests are checked, and none runs after a mismatch on the pinned release. Both scripts carry the same four digests, so a new pin changes this file and both scripts together.

Leave optional dependencies enabled. Verify the resolved native binary against the release `.sha256` sidecar with `shasum -a 256 -c` before use. The v4.8.2 macOS digests recorded at authoring are arm64 `sha256:7324e502b1710f8fb0a073b1f71d3647266d986a50e7351cb4257ec4eb5d8fa8` and x64 `sha256:d839f5f8a8bed8f616e68029350b1c36f8bc12ee2a16deb32b6f7df93a5a36c3`.

The npm launcher runs two JS files before it hands over to the native binary. Their v4.8.2 digests, recorded from the installed package, are `bin.js` `sha256:14717680d950c7256756e904c9dfddd218e761b53cbc758f229583be0b45ae60` and `binary.cjs` `sha256:b123650d1119d7bbb71022dffb28983713d4eabcc76ae0cc81d456806a0e2baa`. Both are the same on every platform. For higher assurance, prefer the standalone prebuilt binary plus its digest over npm.

---

## 4. PROBES

| Step | Lane | Command | Expected |
|---|---|---|---|
| 6 | MCP | Load the `bladebro` manual in Code Mode, run `list_tools()` | Five tools: act, see, state, run, vision |
| 7 | Agent browser | `bladebro see content https://example.com --json` | One object with `ok`, `is_error`, `text`; exit 0 |
| 8 | Agent browser | `bladebro see model --json`, then `bladebro act click ...` | Refs returned, then a verdict |
| 9 | Agent browser | `bladebro vision --marks --json` | `image_path` to a non-empty PNG |
| 10 | Agent browser | `bladebro state tabs` | The open tabs |
| 11 | Real browser, on request | `bladebro rb status --json` | The current selection and live state |
| 12 | Real browser, on request | `bladebro rb use`, `bladebro rb profile` | Browser and profile chosen by the operator |
| 13 | Real browser, on request | `bladebro rb on` (`clone` or `auto` on macOS) | Tools and refs work with page injection off |

Re-verify every flag against the installed binary (`bladebro help --json`) before relying on captured output. Capture detection output fresh each session and redact cookie and credential values.

---

## 5. TEARDOWN AND ROLLBACK

| Step | Command | Notes |
|---|---|---|
| 14 | `bladebro rb off`, then `bladebro stop` | Returns to the agent browser and stops the daemon |
| Rollback | `npm uninstall -g bladebro` | Remove the data root `bladebro doctor` reported only after confirming no needed named sessions remain |

Updating is also an operator decision: `npm update -g bladebro` for npm installs, `bladebro -u` for the standalone binary, with `bladebro --rollback` to restore the previous standalone binary. An update replaces the version this packet pins, so treat it as a new install under R-SEC-3: record the new version, re-run the section 3 sidecar digest check against that release's sidecar, and re-verify flags with `bladebro help --json` before relying on it.

---

## 6. RELATED RESOURCES

- [`cli-reference.md`](./cli-reference.md): the commands the probes call.
- [`browser-lanes.md`](./browser-lanes.md): the consent checklist for steps 11-13.
- [`mcp-wiring.md`](./mcp-wiring.md): the manual step 6 loads.
- [`../INSTALL-GUIDE.md`](../INSTALL-GUIDE.md) and [`../scripts/README.md`](../scripts/README.md): the operator walk-through and the scripts that run these steps.
- Upstream `docs/setup.md` and the GitHub Releases page at `https://github.com/dondai44423/bladebro`.
