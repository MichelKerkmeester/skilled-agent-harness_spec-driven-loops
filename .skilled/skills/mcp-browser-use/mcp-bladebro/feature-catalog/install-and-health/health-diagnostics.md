---
title: "Health diagnostics"
description: "`bladebro doctor` reports the data root, the browser and the release state, and `scripts/doctor.sh` adds the pin, digest, MCP handshake and manual checks, all read-only."
trigger_phrases:
  - "health diagnostics"
  - "bladebro doctor"
  - "bladebro version"
  - "bladebro doctor.sh"
version: 1.0.0.0
---

# Health diagnostics (bladebro doctor, scripts/doctor.sh)

## 1. OVERVIEW

`bladebro doctor` reports the data root, the browser and the release state, and `scripts/doctor.sh` adds the pin, digest, MCP handshake and manual checks, all read-only.

The doctor is the second step of the detection order, so it runs before the first Bladebro action in a session. Neither check installs, updates or changes anything.

---

## 2. HOW IT WORKS

### Core Behavior

`bladebro --version` prints the version, the build, the platform, the install method and whether an update is available. `bladebro doctor` prints a dossier of environment, browser and display, vault and hygiene, and network and release checks, then a pass count and a verdict. On the live host it called Bladebro operational, with two advisories: the profile folder that is created on first run, and an available update. The run stayed on 4.8.2.

### Packet Doctor

`scripts/doctor.sh` runs every `bladebro` call with `BLADE_NO_UPDATE_CHECK=1`, so nothing reaches the release registry. It reports the version against the pin, the native binary digest and the `bladebro doctor` summary. It sends an `initialize` and `tools/list` handshake to `bladebro mcp` over stdio, closes the process and checks the registered `bladebro` manual.

### Exit Codes

`scripts/doctor.sh` exits 0 when everything passes, when only warnings remain, or when the CLI is absent. It exits 1 when the pinned binary's digest does not match, or when `.utcp_config.json` exists without the `bladebro` manual.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/doctor.sh` | Script | Read-only pin, digest, doctor, handshake and manual checks |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/README.md` | Shared | Doctor entrypoint, mutation posture and exit codes |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/references/install-and-verify.md` | Shared | Version and doctor steps with expected output |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/preflight-and-install/version-and-doctor.md` | Manual playbook | Version and doctor health check |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-21--manual-testing-playbook--macos-live/README.md` | Benchmark | Recorded version and doctor dossier |

---

## 4. SOURCE METADATA

- Group: Install and Health
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `install-and-health/health-diagnostics.md`

Related references:
- [pinned-install-and-digest-check.md](pinned-install-and-digest-check.md) - The install the doctor checks
- [teardown-and-rollback.md](teardown-and-rollback.md) - The data root the doctor reports
