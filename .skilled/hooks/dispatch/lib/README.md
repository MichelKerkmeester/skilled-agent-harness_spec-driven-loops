---
title: "Dispatch Library: Hard-Rule Engine and Audit Core"
description: "Runtime-neutral dispatch library that evaluates a skill's hard-rules sidecar, recognizes dispatch shapes and writes one scrubbed JSONL audit line."
trigger_phrases:
  - "dispatch rule engine"
  - "dispatch audit core"
  - "opencode version resolver"
version: 1.0.0.0
---

# Dispatch Library: Hard-Rule Engine and Audit Core

---

## 1. OVERVIEW

`hooks/dispatch/lib/` holds the runtime-neutral cores for the dispatch concern. Every runtime adapter in this tree calls these files. The rule engine reads a `hard-rules.json` sidecar beside a dispatch skill's `SKILL.md` and evaluates its checks against a composed command. The audit core recognizes a dispatch shape, scrubs the command and appends the audit line.

Both cores import Node builtins only, so enforcement survives when the skill advisor daemon is down. Neither core writes stdout or stderr, and both fail open at their boundary.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | Behavior | On error |
|---|---|---|---|
| `dispatch-rule-checks.mjs` | Shared library | Exports `readHardRules`, `evaluate`, `evaluateDispatch`, `CHECKS` and `KNOWN_CHECKS`. Holds the 41 pure check functions, maps `block` and `error` severity to a deny and every other severity to a warning. | Fails open. An unknown check id is skipped and a throwing check counts as satisfied. |
| `dispatch-rule-checks.test.mjs` | `node --test` suite | Covers rule loading, every check family, chain evaluation, the dispatch shapes and the OpenCode version resolver. | Not applicable. |
| `dispatch-audit.mjs` | Shared library | Exports `DISPATCH_SHAPES`, `inspectDispatch`, `resolveDispatchPackets`, `resolveDispatchCommands`, `buildAuditLine`, `appendAuditLog` and `recordDispatch`. Scrubs secrets, truncates fields and appends a size-rotated JSONL line. | Fails open. Every exported function resolves without throwing past its boundary. |
| `dispatch-audit.test.mjs` | `vitest` suite | Covers dispatch recognition, the scrub and truncate pipeline, the rotated append and the kill switch. Run it with the pinned `.skilled/node_modules/.bin/vitest`. | Not applicable. |
| `opencode-version-corpus.json` | Test data | Version outputs and the family each one should resolve to, including v1, v2 and unknown forms. | Not applicable. |
| `opencode-version.mjs` | Shared library | Exports `resolveOpencodeVersionSync` and `SUPPORTED_FAMILIES`. Probes the first `opencode` on `PATH`, parses its version and caches the family as `v1` or `v2`. | Returns `unknown` when the probe fails or the output holds no supported version. |

---

## 3. RELATED

- [`../README.md`](../README.md): the dispatch concern, the rule list and the runtime delivery table.
- [`../claude/README.md`](../claude/README.md): the Claude adapters that call these cores.
- [`../tests/dsh-dispatch.test.mjs`](../tests/dsh-dispatch.test.mjs): the DSH adapter tests that compare against these cores.
