---
title: "Injection Screen Library: Shared Screen and Advisory Core"
description: "Runtime-neutral library that extracts fetched text, screens it in bounded sections and words the one advisory line every injection screen adapter shares."
trigger_phrases:
  - "injection screen library"
  - "fetched text screen"
  - "injection advisory line"
version: 1.0.0.0
---

# Injection Screen Library: Shared Screen and Advisory Core

---

## 1. OVERVIEW

`hooks/classifier-injection-screen/lib/` holds the runtime-neutral half of the injection screen concern. Every adapter keeps only its own event, fetch tool name and delivery channel. This folder owns the text extraction, the feature gate, the sectioning, the bounded classifier calls and the wording of the advisory line.

The screen imports its question, flag threshold and section helpers from `cli-classifier/benchmark/injection-screen/score-injection-screen.mjs`, so the live hook and the offline measurement cannot drift apart.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | Behavior | On error |
|---|---|---|---|
| `classifier-injection-advisory.mjs` | Shared library | Exports `fetchedText`, `advisoryLine` and `screenAdvisory`. Reads text from a string, a content block array or a known text field, checks the `injection-screen` feature gate, and returns the advisory line or `null`. | Fails open. A blank text, a gate that is not ready or an empty verdict returns `null`, so the adapter adds nothing. |
| `classifier-injection-advisory.test.mjs` | `node --test` suite | Injects the gate and screen seams. Covers text extraction, the gate, the advisory wording and the null paths. | Not applicable. No test spawns a process or reaches a backend. |
| `classifier-screen-fetched-text.mjs` | Shared library | Exports `screenText`. Splits the page into sections, runs the classifier calls with a bounded section count, concurrency and character budget, and returns the flagged sections and the checked count. | Fails open. An unreadable answer counts as unmeasured, a spent budget leaves sections unchecked and a failure never turns into a flag. |
| `classifier-screen-fetched-text.test.mjs` | `node --test` suite | Injects a `classify` seam. Covers sectioning, the straddling-pair confirm call, the budget cap and unreadable answers. | Not applicable. No test spawns a process or reaches a backend. |

---

## 3. RELATED

- [`../README.md`](../README.md): the injection screen concern, its decision rule and its switches.
- [`../claude/README.md`](../claude/README.md): the Claude Code adapter that calls this library.
- [`../dsh/README.md`](../dsh/README.md): the DSH adapter that calls this library.
