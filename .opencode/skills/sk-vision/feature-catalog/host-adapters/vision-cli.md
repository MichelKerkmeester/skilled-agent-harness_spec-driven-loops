---
title: "Vision CLI (vision-cli.js)"
description: "The command entry for a host that can run a process but cannot load an adapter or receive injected context. Cursor is that host."
trigger_phrases:
  - "Vision CLI (vision-cli.js)"
  - "sk-vision cli"
  - "cursor vision command"
  - "sk-vision command entry"
version: 1.0.0.0
---

# Vision CLI (vision-cli.js)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The command entry for a host that can run a process but cannot load an adapter or receive injected context. Cursor is that host.

Cursor registers lifecycle hooks, but a live probe against build `2026.09.02-c22c1a3` confirmed it does not deliver `beforeSubmitPrompt`, with a `sessionStart` positive control firing on the same runs. Injection is therefore impossible on Cursor, and a process it can invoke is the strongest remaining option.

---

## 2. HOW IT WORKS

The built `vision-runtime/dist/vision-cli.js` runs under plain node. It takes an image path with an optional trailing question, or `--from-text "<text>"` to find a path inside prose the way the Devin hook does. It prints a `<SK-VISION EVIDENCE>` block on stdout and nothing else, so a caller pasting stdout into a prompt never has to strip diagnostics out of it.

Exit codes are `0` for evidence on stdout, `1` for a runtime or usage error with a single `SK_VISION_ERROR` line on stderr, and `2` when `--from-text` found no resolvable image.

It shares `src/evidence/prompt-evidence.ts` with the Devin hook, so both hosts see identical analysis and identical detection rules. The runtime is opened per call and torn down in a `finally`, honoring `SK_VISION_TEARDOWN`.

Cursor reaches it two ways: the `/vision` command in `.cursor/commands/vision.md`, and the always-apply rule symlinked to `.cursor/rules/sk-vision.md`. Neither can compel the call, which both documents state rather than implying a guarantee they cannot give. The CLI also cannot see the conversation, so the user must name a path; a pasted image with no file has to be saved first.

The evidence core and the CLI are separate bundle entries on purpose. A bundle exports only what its own entry exports, so the Devin hook cannot import the core through the CLI's bundle. An earlier build had exactly that wiring, and the hook silently no-opped on every turn while all its fail-open tests still passed.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `vision-runtime/src/cli/vision-cli.ts` | Handler | Argument parsing, usage text, exit-code contract, main-module guard |
| `vision-runtime/src/evidence/prompt-evidence.ts` | Core | Image-path detection, analysis, evidence wrapping, teardown |
| `vision-runtime/scripts/build.ts` | Script | Bundles the CLI to `dist/vision-cli.js`, node-targeted |
| `.cursor/commands/vision.md` | Script | Cursor `/vision` command that invokes the CLI |
| `hooks/cursor/vision-rule.md` | Script | Always-apply rule, symlinked to `.cursor/rules/sk-vision.md` |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `vision-runtime/src/evidence/prompt-evidence.test.ts` | Unit | Path detection and the evidence wrapper, including the nested-tag regression |
| `manual-testing-playbook/host-adapters/vision-cli.md` | Manual playbook | Validates the exit-code contract and a real image read |

---

## 4. SOURCE METADATA

- Group: host-adapters
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `host-adapters/vision-cli.md`

Related references:
- [devin-hook.md](devin-hook.md): the injection adapter sharing this CLI's evidence core
- [opencode-plugin.md](opencode-plugin.md): native OpenCode adapter with command and legacy attachment paths
- [pi-extension.md](pi-extension.md): native Pi adapter with hidden tools and command paths
