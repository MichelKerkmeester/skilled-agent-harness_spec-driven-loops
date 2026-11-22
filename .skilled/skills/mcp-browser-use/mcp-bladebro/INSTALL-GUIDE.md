---
title: "Bladebro CLI Installation Guide"
description: "Install the Bladebro CLI on macOS at the pinned v4.8.2, check its native binary digest, verify the CLI and the registered Code Mode manual, and remove it again."
version: 1.0.0.0
---

# Bladebro CLI Installation Guide

> Install the Bladebro CLI on macOS at the pinned v4.8.2, check the native binary digest, verify the CLI and the registered `bladebro` Code Mode manual, and remove it again when the work is done.

---

## 0. AI-FIRST INSTALL GUIDE

Paste this prompt to an AI agent to run the install with you:

```text
Install the Bladebro CLI on this macOS machine. Steps:
1. Confirm the platform is macOS arm64 or x64. Stop on anything else.
2. Run `command -v bladebro`. If it prints a path, report the version and stop.
3. Ask me for a yes, then run: bash .skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh
4. Run: bash .skilled/skills/mcp-browser-use/mcp-bladebro/scripts/doctor.sh
5. Run `bladebro help --json` and keep the output as the flag fixture for this version.
6. Do not run `npm update -g bladebro` or `bladebro -u` without asking me first.
Report each step's output and stop on any failure.
```

### Quick Success Check

```bash
command -v bladebro && BLADE_NO_UPDATE_CHECK=1 bladebro --version
```

Expect a path and `bladebro v4.8.2`. `BLADE_NO_UPDATE_CHECK=1` keeps the command from contacting the release registry.

---

## 1. OVERVIEW

### Core Principle

Installing Bladebro is an operator decision. A workflow reports the install command and stops, and never installs or updates on its own. The pin, the digests and the step-by-step probes live in [`references/install-and-verify.md`](references/install-and-verify.md). This guide walks the same install through the packet scripts.

### Distribution

Bladebro ships as the npm package `bladebro`. The package is a small Node launcher, and the real program is a native Rust binary that npm pulls in as an optional dependency (`bladebro-darwin-arm64` or `bladebro-darwin-x64`). A standalone prebuilt binary is also published on the GitHub Releases page.

### Two Surfaces After Install

| Surface | Launch | Use |
|---|---|---|
| CLI | `bladebro ...` | The default transport for every Bladebro task |
| MCP server | `bladebro mcp` (stdio, started by the client) | The Code Mode path, through the registered `bladebro` manual |

### Status On This Host

The install ran live on macOS arm64 on 2026-11-21. The run recorded 12 PASS, 1 FAIL and 1 SKIP in [`benchmark/reports/2026-11-21--manual-testing-playbook--macos-live/`](benchmark/reports/2026-11-21--manual-testing-playbook--macos-live/README.md).

- **BB-012 failed.** The real-browser reads in `clone` mode, using the Aside browser binary and a copied profile, each exited 1 with `Chrome launch failed: no page target available`. The agent-browser lane is not affected. Attaching to a running Aside instead passed 3 of 3 in [`benchmark/reports/2026-11-21--attach-probe--aside-browser/`](benchmark/reports/2026-11-21--attach-probe--aside-browser/README.md).
- **BB-014 was skipped.** The operator chose to keep Bladebro installed, so it is still on this host.

---

## 2. PREREQUISITES

### Platform Support

- **macOS arm64 or x64.** These are the only platforms with a recorded v4.8.2 digest, so `scripts/install.sh` refuses every other platform. Only the arm64 digest has been matched against an installed binary. The x64 digest comes from the release sidecar and has not been checked against an npm install, so a mismatch there makes the script remove the install and exit 1.
- **Node.js 14 or later and npm.** The npm launcher needs them. The live run used Node v26.13.0.
- **A Chromium-family browser** on the host. `bladebro doctor` reports which one it found.

---

## 3. INSTALLATION

### Step 1: Get the operator's yes

Installing changes the machine. State the rollback first: `npm uninstall -g bladebro`, then remove the data root that `bladebro doctor` reports, once no needed named session remains.

### Step 2: Run the install wrapper

The wrapper installs `bladebro@4.8.2`, checks the native binary against the recorded digest and removes the install again on a mismatch. It does nothing when a `bladebro` binary is already on PATH.

```bash
bash .skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh
```

To install by hand instead, follow section 3 of [`references/install-and-verify.md`](references/install-and-verify.md), which holds the same command and the digests.

### Step 3: Capture the flag fixture

Flags can change between releases. Save the live schema of the installed binary before relying on any flag this packet quotes.

```bash
BLADE_NO_UPDATE_CHECK=1 bladebro help --json
```

---

## 4. CONFIGURATION

The `bladebro` Code Mode manual is already registered in `.utcp_config.json`. Check it with jq and do not add it again. The exact JSON is in [`assets/utcp-bladebro-manual.md`](assets/utcp-bladebro-manual.md).

```bash
jq '.manual_call_templates[] | select(.name == "bladebro")' .utcp_config.json
```

Before calling a tool through Code Mode, run `search_tools("bladebro")` and `tool_info()` in that session. The discovery steps are in [`references/mcp-wiring.md`](references/mcp-wiring.md).

Two environment variables matter for setup. `BLADE_HOME` moves the data root, and `BLADE_FRESH=1` gives a task a throwaway one. `BLADE_NO_UPDATE_CHECK=1` stops `--version` and `doctor` from contacting the release registry.

---

## 5. VERIFICATION

### One-Command Health Check

The doctor is read-only. It checks the version against the pin, the native binary digest, the `bladebro doctor` summary, a stdio MCP handshake and the registered manual, with the update check switched off.

```bash
bash .skilled/skills/mcp-browser-use/mcp-bladebro/scripts/doctor.sh
```

A healthy run ends with exit 0 and reports the five tools `act`, `see`, `state`, `run` and `vision`. `bladebro doctor` reports `12/14 PASSED · 2 ADVISORIES` here, and both advisories are the skipped update check. The doctor exits 1 only on a digest mismatch for the pinned version or a missing manual.

### Full Verification Checklist

- [ ] Platform is macOS arm64 or x64
- [ ] `command -v bladebro` prints a path
- [ ] `bladebro --version` reports v4.8.2
- [ ] The doctor reports a digest match
- [ ] `bladebro help --json` output is saved as the fixture for this version
- [ ] The doctor's MCP handshake lists the five tools
- [ ] The jq command returns the registered `bladebro` manual
- [ ] No update ran without an operator yes

---

## 6. UNINSTALLATION

Uninstalling removes the package and its native binary. It leaves the data root, which holds the agent-browser profile, cookies and named sessions.

```bash
bladebro stop
npm uninstall -g bladebro
```

Remove the data root (`~/.local/state/blade` here) only after confirming no needed named session remains. An update is a new install under the same rules: record the new version, check its digest against that release's sidecar and re-run `bladebro help --json`.

---

## 7. TROUBLESHOOTING

| Symptom | Fix |
|---|---|
| `command not found: bladebro` | npm's global bin folder is not on PATH. Add `$(npm prefix -g)/bin` to PATH |
| `Digest mismatch` from install.sh | The script already removed the install. Compare the release `.sha256` sidecar before trying again |
| `platform package "bladebro-darwin-arm64" not installed` | Optional dependencies were disabled. Reinstall with them enabled |
| `Chrome launch failed: no page target available` in an `rb` lane | Seen with `clone` mode and the Aside binary (BB-012). Use attach mode, or a stock Chromium-family browser with a fresh profile |
| Tools in the handshake differ from the five documented | Version drift. Rediscover the callables and re-check `references/cli-reference.md` |

---

## 8. RELATED RESOURCES

- [`references/install-and-verify.md`](references/install-and-verify.md): the pin, the digests, the probes and teardown.
- [`scripts/README.md`](scripts/README.md): what each script does and its exit codes.
- [`references/browser-lanes.md`](references/browser-lanes.md): the consent checklist for the `rb` lanes.
- Upstream `docs/setup.md` and the GitHub Releases page at `https://github.com/dondai44423/bladebro`.
