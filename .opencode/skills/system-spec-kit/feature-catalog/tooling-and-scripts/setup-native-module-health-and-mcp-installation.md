---
title: "Setup, Native Module Health, and MCP Installation"
description: "Spec-folder prerequisite validation, native module diagnostics and rebuild, and Node ABI marker recording."
trigger_phrases:
  - "setup native module health and mcp installation"
  - "install.sh"
  - "install spec kit mcp"
  - "native module rebuild"
  - "check-native-modules"
version: 3.6.0.13
---

# Setup, Native Module Health, and MCP Installation

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

This setup surface combines two neighboring but distinct responsibilities inside `scripts/setup/`: prerequisite validation for spec-driven implementation workflows, and local-environment bootstrap for the Spec Kit workspace.

Taken together, these scripts validate the active feature-folder shape, install and build the workspace, probe native Node module health, rebuild ABI-sensitive packages after runtime changes, and record a compatibility marker.

The MCP-registration half of this surface went with the memory server: there is no memory server to bootstrap, no `opencode.json` entry to write, and no daemon smoke test to run.

---

## 2. HOW IT WORKS

The shipped behavior in this slice currently works as follows:

1. `check-prerequisites.sh` is the workflow-facing prerequisite gate for spec work. It resolves repo, branch, and feature paths through `common.sh`, supports JSON and path-only output, can require `tasks.md`, and can pass through to `spec/validate.sh` in normal, strict, or verbose validation modes.
2. Outside path-only mode, that same script hard-fails when the resolved feature directory is missing, when `plan.md` is absent, or when `--require-tasks` is used and `tasks.md` is absent. It also surfaces optional companion docs such as `research/research.md`, `checklists/`, `decisions/`, and `tasks.md` when requested.
3. `install.sh` is the workspace environment bootstrap. It requires Node.js >= 20.11, `npm`, and `npx`; logs the current Node version, module ABI version, and binary path; and verifies that the expected Spec Kit workspace and its `package.json` files exist before proceeding.
4. The installer runs `npm install` from the Spec Kit root, attempts `npm run build`, and falls back to `npx tsc --build --noCheck --force` if the standard build fails.
5. Native module health is treated as part of installation, not a separate manual step. `install.sh` shells into `check-native-modules.sh`, prints the probe output verbatim, and if any `[FAIL]` marker appears it automatically runs `rebuild-native-modules.sh` with `n` piped into the optional Hugging Face cache prompt, then re-runs the health probe and aborts if failures remain.
6. After dependency recovery, the installer verifies the compiled output the surviving entry points need. It writes no MCP registration: the memory server it used to declare no longer exists.
7. Verification can be skipped with `--skip-verify`; otherwise `verify_installation()` syntax-checks the built output and confirms `node_modules` is present.
8. `check-native-modules.sh` is the standalone diagnostic probe. It compares the current Node runtime against `.node-version-marker`, reports Node and `MODULE_VERSION`, and attempts to load `better-sqlite3` plus optional `sharp` installs so ABI mismatches show up as explicit `[FAIL]` lines.
9. `rebuild-native-modules.sh` is the repair path for ABI drift. It rebuilds `better-sqlite3` inside `mcp_server`, runs `npm rebuild` in `shared/` when that workspace is installed, optionally clears the global Hugging Face cache interactively, and then calls `record-node-version.js` to rewrite `.node-version-marker` with the current Node version, module ABI, platform, architecture, and timestamp.

For post-rebuild verification, the authoritative check is that `validate.sh` runs and reports rule lines rather than exiting 3 on a stale compiled orchestrator. The daemon rebuild-and-restart protocol these scripts once pointed at described the memory server and was retired with it.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/system-spec-kit/scripts/setup/check-prerequisites.sh` | Workflow guard | Resolves feature-folder paths, validates required spec documents, and optionally invokes spec validation |
| `.opencode/skills/system-spec-kit/scripts/setup/install.sh` | Installer | Installs/builds the Spec Kit workspace, probes and repairs native modules, smoke-tests the context server, and writes MCP config |
| `.opencode/skills/system-spec-kit/scripts/setup/check-native-modules.sh` | Diagnostic probe | Compares recorded versus active Node ABI details and probes native package loadability |
| `.opencode/skills/system-spec-kit/scripts/setup/rebuild-native-modules.sh` | Repair script | Rebuilds ABI-sensitive modules, optionally clears cache, and refreshes the Node-version marker |
| `.opencode/skills/system-spec-kit/scripts/setup/record-node-version.js` | Marker writer | Persists the current Node/runtime compatibility snapshot into `.node-version-marker` |

---

## 4. SOURCE METADATA
- Group: Tooling And Scripts
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `tooling-and-scripts/setup-native-module-health-and-mcp-installation.md`
Related references:
- [spec-folder-detection-and-description.md](../../feature-catalog/tooling-and-scripts/spec-folder-detection-and-description.md) — Spec-Folder Detection and Description Metadata
- [template-composition-system.md](../../feature-catalog/tooling-and-scripts/template-composition-system.md) — Template Composition System
