---
title: "Devin prompt-time injection hook (sk-vision.mjs)"
description: "Analyzes an image named in a Devin prompt and injects the evidence into the same turn, without the model asking for it."
trigger_phrases:
  - "Devin prompt-time injection hook (sk-vision.mjs)"
  - "sk-vision devin hook"
  - "devin UserPromptSubmit vision"
  - "sk-vision injection adapter"
version: 1.0.0.0
---

# Devin prompt-time injection hook (sk-vision.mjs)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Analyzes an image named in a Devin prompt and injects the evidence into the same turn, without the model asking for it.

Devin exposes no in-process plugin API and no command surface, but it does deliver lifecycle hooks. `UserPromptSubmit` accepts `additionalContext` inside the `hookSpecificOutput` envelope, which is enough to put analysis in front of the model before it reads the message. That makes Devin the second host after OpenCode where vision is delivered rather than requested.

---

## 2. HOW IT WORKS

The adapter reads the hook payload from stdin, takes `prompt` and `cwd`, and looks for an image path. Detection is deliberately conservative: a candidate only counts when it carries an image extension and resolves to a file that exists, because spinning a local GPU on a filename mentioned in passing costs the operator real time. When several images are named, the last one wins, since that is the one being asked about.

On a hit it loads the shared evidence core from `vision-runtime/dist/prompt-evidence.js`, renders scene, caption and OCR, and returns the result wrapped in `<SK-VISION EVIDENCE>`. The runtime is torn down in a `finally`, honoring `SK_VISION_TEARDOWN`, so no Python child or GPU allocation survives a turn.

Every path fails open and emits `{}`. That covers a malformed payload, an absent prompt, a disabled kill-switch, a prompt naming no resolvable image, an unbuilt runtime, and any thrown error. The adapter never writes to stderr, which Devin would otherwise surface into the session. A vision helper that can break a turn is worse than one that stays quiet.

The core is loaded lazily, because `dist/` is gitignored and a fresh checkout reaches this hook before anything has been built. Resolving on demand keeps that case a silent no-op instead of a stack trace on every prompt.

**Kill-switches.** `SYSTEM_SK_VISION_DISABLED=1` disables this concern; `SYSTEM_HOOKS_DISABLED=1` disables every hook in the repository. Both resolve through the shared `hook-flags` resolver, so semantics match the rest of the fleet.

**Timeout.** The registration allows 60 seconds. A warm model answers well inside it. A cold first load downloads roughly 3.9 GB of weights and exceeds it, and the host skips a timed-out hook, so the first image-bearing turn after a cold start arrives without evidence.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `hooks/devin/sk-vision.mjs` | Handler | Payload parsing, kill-switch, lazy core load, envelope construction, fail-open guarantee |
| `vision-runtime/src/evidence/prompt-evidence.ts` | Core | Image-path detection, analysis, evidence wrapping, teardown |
| `vision-runtime/scripts/build.ts` | Script | Bundles the core to `dist/prompt-evidence.js`, node-targeted |
| `.devin/hooks.v1.json` | Script | Devin registration on `UserPromptSubmit` |
| `.opencode/hooks/sk-vision/devin/sk-vision.mjs` | Script | Shared hook-hub mirror symlink |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `hooks/devin/sk-vision-devin.test.mjs` | Node test | Spawns the adapter and asserts every fail-open path, both kill-switches, silent stderr, and that the built core exports what the adapter calls |
| `vision-runtime/src/evidence/prompt-evidence.test.ts` | Unit | Path detection against real files, including quoted paths, punctuation, non-images and last-match-wins |
| `manual-testing-playbook/host-adapters/devin-hook.md` | Manual playbook | Validates registration and live injection |

---

## 4. SOURCE METADATA

- Group: host-adapters
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `host-adapters/devin-hook.md`

Related references:
- [vision-cli.md](vision-cli.md): the CLI sharing this adapter's evidence core, used by Cursor
- [opencode-plugin.md](opencode-plugin.md): native OpenCode adapter with command and legacy attachment paths
- [pi-extension.md](pi-extension.md): native Pi adapter with hidden tools and command paths
