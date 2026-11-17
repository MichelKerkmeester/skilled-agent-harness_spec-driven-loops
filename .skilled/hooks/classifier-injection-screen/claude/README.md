---
title: "Claude Classifier Injection Screen: PostToolUse Adapter"
description: "Claude Code PostToolUse adapter that screens the text a WebFetch returned and adds one advisory line when a section reads as instructions aimed at an AI agent."
trigger_phrases:
  - "claude injection screen"
  - "claude webfetch screen"
  - "posttooluse injection check"
version: 1.0.0.0
---

# Claude Classifier Injection Screen: PostToolUse Adapter

---

## 1. OVERVIEW

`.skilled/hooks/classifier-injection-screen/claude/` holds the Claude Code adapter for the classifier injection screen concern. It runs at `PostToolUse` after a `WebFetch` call and screens the page text the fetch returned. A section that reads as instructions aimed at an AI agent adds one advisory line to `hookSpecificOutput.additionalContext`. The fetch result always reaches the model unchanged, so the screen never blocks a fetch.

Claude Code loads the adapter from `.claude/settings.json`, where the event is written as `"PostToolUse"` and the matcher as `"WebFetch"`, with a 30-second timeout. The entry runs `node .skilled/hooks/classifier-injection-screen/claude/classifier-injection-screen-posttooluse.mjs`. Its fallback prints a drift warning when the adapter cannot be resolved. Devin, DSH, OpenCode, Pi and Vibe run their own adapters against the same core.

The adapter checks its switch first. It calls `isHookEnabled('injection-screen')` before it reads stdin, so a disabled adapter never parses a payload. The concern switch is `SYSTEM_INJECTION_SCREEN_DISABLED`. `SYSTEM_HOOKS_DISABLED` is the master switch.

On a live switch it parses the payload and returns at once unless `tool_name` is `WebFetch`. It pulls the fetched text out of `tool_response` and calls `screenAdvisory` in `.skilled/hooks/classifier-injection-screen/lib/classifier-injection-advisory.mjs`. That core also honours `JEV_FEATURE_INJECTION_SCREEN=0` and needs a `jev` CLI that passes its auth check. Every other outcome exits 0 with no output. A missing payload, a parse error, an absent `jev`, a failed screen and a throw from `main` all end the same way.

---

## 2. DIRECTORY TREE

| File | Responsibility |
|---|---|
| `classifier-injection-screen-posttooluse.mjs` | The adapter. It checks the switch, parses the payload, keeps only a `WebFetch` call and writes the advisory. |
| `classifier-injection-screen-posttooluse.test.mjs` | The `node --test` suite. It spawns the adapter with a payload on stdin and a stub `jev` first on `PATH`, then removes the fixture folders it wrote. |

---

## 3. VALIDATION

Run the command from the repository root.

```bash
node --test .skilled/hooks/classifier-injection-screen/claude/classifier-injection-screen-posttooluse.test.mjs
```

Expected result: every test passes and the command exits 0. The suite covers the advisory line, a content block array, an attacker heading, a non-fetch tool, the `JEV_FEATURE_INJECTION_SCREEN=0` gate and malformed stdin. Each case runs with a stub `jev` first on `PATH`, so no test reaches a real backend.

---

## 4. RELATED

- [`../README.md`](../README.md): the classifier injection screen concern, its decision rule and its switches.
- [`../lib/classifier-injection-advisory.mjs`](../lib/classifier-injection-advisory.mjs): the shared text extraction and advisory line this adapter calls.
- [`../lib/classifier-screen-fetched-text.mjs`](../lib/classifier-screen-fetched-text.mjs): the section and flag logic behind `screenAdvisory`.
- [`../../shared/hook-flags.cjs`](../../shared/hook-flags.cjs): the switch resolver behind `isHookEnabled`.
- [`../../shared/hook-adapter-shared.cjs`](../../shared/hook-adapter-shared.cjs): the stdin reader the adapter calls.
- [`../../../../.claude/settings.json`](../../../../.claude/settings.json): the file that registers this adapter under `PostToolUse`.
