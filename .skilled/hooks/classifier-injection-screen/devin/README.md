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

`.skilled/hooks/classifier-injection-screen/devin/` holds the Devin CLI adapter for the injection screen concern. The adapter runs at `PostToolUse` for the `webfetch` tool. It screens the page text and writes one advisory line to `hookSpecificOutput.additionalContext` when a section flags. The fetch result always reaches the model unchanged.

Devin loads the hook from `.devin/hooks.v1.json`. `sync-hook-registrations.cjs` renders that file out of `hook-registry.json`. The entry matches `^webfetch$` and allows 30 seconds.

The adapter checks the kill switch before it reads any payload. A missing payload, a parse error, an absent `jev` CLI or a failed screen exits 0 with no output. A bug here can never break a real fetch.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `classifier-injection-screen-posttooluse.mjs` | The adapter. It checks the kill switch, parses the payload, reads the page text from `tool_response.output`, calls `screenAdvisory` and writes `hookSpecificOutput.additionalContext` with the advisory. |
| `classifier-injection-screen-posttooluse.test.mjs` | The `node --test` suite. It spawns the hook with a payload on stdin and a stub `jev` first on `PATH`, then covers the advisory path, non-fetch tools, the kill switch and the failure paths. |

The adapter writes the advisory through a write callback that owns the exit, so the line reaches Devin whole. A throw anywhere in `main` ends as the same silent exit 0.

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/classifier-injection-screen/devin/classifier-injection-screen-posttooluse.test.mjs
```

Expected result: every case passes and the process exits 0.

The suite needs no network and no stored Jev key. It writes its stub `jev` and its fixture directories under the system temp folder, then removes them.

---

## 4. RELATED

- [`../README.md`](../README.md): the injection screen concern, its decision rule and its switches.
- [`../lib/classifier-injection-advisory.mjs`](../lib/classifier-injection-advisory.mjs): the shared text extraction and advisory line this adapter calls.
- [`../claude/README.md`](../claude/README.md): the Claude Code sibling that screens `WebFetch`.
