---
title: "Claude Injection Screen: WebFetch PostToolUse Adapter"
description: "Claude Code PostToolUse adapter that screens the text a WebFetch returned and adds one advisory line when a section reads as instructions aimed at an AI agent."
trigger_phrases:
  - "claude injection screen"
  - "claude webfetch screen"
  - "posttooluse injection check"
version: 1.0.0.0
---

# Claude Injection Screen: WebFetch PostToolUse Adapter

---

## 1. OVERVIEW

`.skilled/hooks/classifier-injection-screen/claude/` holds the Claude Code adapter for the injection screen concern. The adapter runs at `PostToolUse` after a `WebFetch` call and screens the fetched text. It writes one advisory line to `hookSpecificOutput.additionalContext` when a section flags. The fetch result always reaches the model unchanged, so the screen never blocks a fetch.

Claude Code loads the hook from the registration that `sync-hook-registrations.cjs` renders out of `hook-registry.json`. The registration names the `PostToolUse` event with a `WebFetch` matcher and a 30-second timeout. The hook reads its kill switch through `isHookEnabled('injection-screen')` before it parses any payload.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `classifier-injection-screen-posttooluse.mjs` | The adapter. It checks the kill switch, parses the payload, keeps only a `WebFetch` call and writes the advisory. |
| `classifier-injection-screen-posttooluse.test.mjs` | The `node --test` suite. It spawns the hook with a payload on stdin and a stub `jev` first on `PATH`. |

The adapter fails open, so a bug here never breaks a real fetch. A missing payload, a parse error, an absent `jev` CLI or a failed screen exits 0 with no output. The entrypoint also catches any throw from `main` and exits 0 the same way.

The kill switch runs before stdin is read, so a disabled hook never parses a payload. A tool name other than `WebFetch` exits 0 at once. The advisory write callback owns the exit, so the line reaches the runtime whole.

The suite covers the advisory path, a content block array, an attacker heading, a non-fetch tool, the `JEV_FEATURE_INJECTION_SCREEN=0` feature gate and malformed stdin. Each case runs against a stub `jev` first on `PATH`, so no test reaches a real backend, and the suite removes its fixture directories afterwards.

---

## 3. VALIDATION

Run this command from the repository root.

```bash
node --test .skilled/hooks/classifier-injection-screen/claude/
```

Expected result: every case passes and the command exits 0.

---

## 4. RELATED

- [`../README.md`](../README.md): the injection screen concern, its decision rule and its switches.
- [`../lib/classifier-injection-advisory.mjs`](../lib/classifier-injection-advisory.mjs): the shared text extraction and advisory line this adapter calls.
- [`../lib/classifier-screen-fetched-text.mjs`](../lib/classifier-screen-fetched-text.mjs): the section, call and flag logic behind `screenAdvisory` in the shared library.
