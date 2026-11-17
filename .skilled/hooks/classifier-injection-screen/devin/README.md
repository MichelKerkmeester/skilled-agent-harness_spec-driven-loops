---
title: "Devin Injection Screen: webfetch PostToolUse Adapter"
description: "Devin CLI PostToolUse adapter that screens the text a webfetch returned and adds one advisory line when a section reads as instructions aimed at an AI agent."
trigger_phrases:
  - "devin injection screen"
  - "devin webfetch screen"
  - "devin posttooluse injection check"
version: 1.0.0.0
---

# Devin Injection Screen: webfetch PostToolUse Adapter

---

## 1. OVERVIEW

`.skilled/hooks/classifier-injection-screen/devin/` holds the Devin CLI adapter for the injection screen concern. It runs at `PostToolUse` after a `webfetch` call. The adapter reads the page text and adds one advisory line to `hookSpecificOutput.additionalContext` when a section reads as instructions aimed at an agent. The fetch result reaches the model unchanged either way.

Devin loads the adapter from `.devin/hooks.v1.json`, which registers the `PostToolUse` event with the matcher `^webfetch$` and a 30-second timeout. `sync-hook-registrations.cjs` renders that file out of `hook-registry.json`. The registration sets no fallback envelope, so it adds no drift line of its own.

The adapter checks `isHookEnabled('injection-screen')` before it reads stdin, so a disabled hook never parses a payload. That call reaches the shared resolver through `hook-flags.mjs`. The concern switch `SYSTEM_INJECTION_SCREEN_DISABLED` silences this adapter, and `SYSTEM_HOOKS_DISABLED` is the master switch. A second gate sits in the shared library: `JEV_FEATURE_INJECTION_SCREEN=0` turns screening off, and screening needs a `jev` CLI that passes its auth check. With the variable unset, the screen runs.

Every failure ends the same way. Exit 0 with no output. A disabled switch, a missing or malformed payload, another tool name, an absent `jev`, a failed screen or a throw anywhere in `main` adds nothing to the fetch result.

---

## 2. DIRECTORY TREE

| File | Responsibility |
|---|---|
| `classifier-injection-screen-posttooluse.mjs` | The adapter. It checks the kill switch, parses the payload, keeps only a `webfetch` call, calls `screenAdvisory` and writes the advisory. |
| `classifier-injection-screen-posttooluse.test.mjs` | The `node --test` suite. It spawns the adapter with a payload on stdin and a stub `jev` first on `PATH`. |

The adapter writes the advisory through a stdout callback that owns the exit, so the line reaches Devin whole. The suite builds its stub `jev` and its fixture directories under the system temp folder and removes them afterwards.

---

## 3. VALIDATION

Run this command from the repository root.

```bash
node --test .skilled/hooks/classifier-injection-screen/devin/classifier-injection-screen-posttooluse.test.mjs
```

Expected result: every test passes and the command exits 0.

The suite covers a flagged page, a `content` field, another tool, the concern switch, the Jev feature switch and malformed stdin. It needs no network and no stored Jev key.

---

## 4. RELATED

- [`../README.md`](../README.md): the injection screen concern, its decision rule and its switches.
- [`../lib/classifier-injection-advisory.mjs`](../lib/classifier-injection-advisory.mjs): the text extraction and advisory line this adapter calls.
- [`../lib/classifier-screen-fetched-text.mjs`](../lib/classifier-screen-fetched-text.mjs): the section, call and flag logic behind `screenAdvisory`.
- [`../claude/README.md`](../claude/README.md): the Claude Code sibling that screens `WebFetch`.
