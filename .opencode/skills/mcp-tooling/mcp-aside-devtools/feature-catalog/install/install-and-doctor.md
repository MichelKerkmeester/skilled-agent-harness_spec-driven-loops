---
title: "Install"
description: "Operator-invoked install and read-only diagnostics for the aside CLI: the official macOS-only curl installer, the packaged idempotent wrapper, the preflight fixture discipline, and the doctor health check."
trigger_phrases:
  - "install aside"
  - "aside setup"
  - "aside doctor"
  - "aside not found"
version: 1.0.0.0
---

# Install (setup and diagnostics for the aside binary)

<!-- sk-doc-template: skill_asset_feature-catalog -->

## 1. OVERVIEW

Carries setup and health: getting the `aside` binary onto a macOS host, verifying it with fixtures, and diagnosing the whole surface read-only. Distribution is an official curl bootstrap installer — not npm, not a GitHub package — supporting macOS (Darwin) arm64/x64 only, placing the shim at `~/.local/bin/aside` by default.

Installation is MUTATING on the host and strictly operator-invoked: the skill never runs the installer or `aside --update` implicitly. Diagnostics are READ-ONLY: `scripts/doctor.sh` changes nothing, installs nothing, and never prints secrets.

---

## 2. HOW IT WORKS

Install with `curl -fsSL https://releases.aside.com/install.sh | bash` or the packaged wrapper `bash scripts/install.sh` (platform gate + no-op when already installed; honors `ASIDE_CLI_VERSION`, `ASIDE_CLI_BASE_URL`, `ASIDE_CLI_INSTALL_DIR`, `ASIDE_CLI_BIN_DIR`). Sign-in happens through the Aside app; verify with `aside account list` / `aside account status`. The preflight discipline applies before every use: `command -v aside`, then `aside --version 2>&1`, then `aside --help 2>&1` saved as a version-pinned fixture — never freeze flag spellings from memory.

`bash scripts/doctor.sh` checks platform, binary, version, account state, runs a watchdog-guarded MCP stdio handshake probe, and verifies the registered `aside` manual in `.utcp_config.json` — manual absence is an error (registration regressed), and the doctor reports it without writing anything.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `INSTALL-GUIDE.md` | Guide | Full install, sign-in, permission tiers, registered MCP wiring |
| `scripts/install.sh` | Script | Operator-invoked installer wrapper with platform gate |
| `scripts/doctor.sh` | Script | Read-only diagnostics including handshake probe and manual check |
| `mcp-servers/aside-cli/README.md` | Server package | Install pointer for the binary |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual-testing-playbook/cli-lifecycle/install-version.md` | Manual playbook | ASD-001 install + version check |
| `manual-testing-playbook/cli-lifecycle/help-fixture.md` | Manual playbook | ASD-002 version-pinned help fixture capture |
| `manual-testing-playbook/cli-lifecycle/account-status.md` | Manual playbook | ASD-003 read-only account state |

---

## 4. SOURCE METADATA

- Group: Install
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `install/install-and-doctor.md`

Related references:
- [troubleshooting-recipes.md](../troubleshoot/troubleshooting-recipes.md) covers missing-binary and signed-out recovery
- [mcp-transport-and-code-mode.md](../mcp/mcp-transport-and-code-mode.md) covers the registered manual the doctor verifies
