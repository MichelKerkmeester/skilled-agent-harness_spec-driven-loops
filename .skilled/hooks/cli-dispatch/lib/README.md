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

`.skilled/hooks/cli-dispatch/lib/` holds the runtime-neutral cores for the dispatch concern in this tree. The rule engine reads a `hard-rules.json` sidecar beside a dispatch skill's `SKILL.md`. It evaluates each declared check against a composed command before that command spawns. The audit core recognizes a dispatch shape, scrubs the command and appends one audit line. The version resolver answers which OpenCode family a binary runs.

The Claude, Codex, Devin, Pi, DSH and OpenCode adapters import these cores. Cursor's preflight spawns the Claude preflight, so it reaches them through that. Vibe's plugin calls `evaluateDispatch` from the rule engine before a bash call runs. The parent README holds each runtime's registration and its event.

No core needs an external package or a daemon, so enforcement survives a skill advisor outage. None of the three cores writes to stdout or stderr. Each core fails open at its own boundary, so a bug cannot block a dispatch. The DSH preflight is the one adapter that denies when the shared core throws.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `dispatch-rule-checks.mjs` | The hard-rule engine. |
| `dispatch-rule-checks.test.mjs` | The `node --test` suite. |
| `dispatch-audit.mjs` | The audit core. |
| `dispatch-audit.test.mjs` | The `vitest` suite. |
| `opencode-version-corpus.json` | Version-output samples for the resolver test. |
| `opencode-version.mjs` | The OpenCode version resolver. |

`dispatch-rule-checks.mjs` exports `readHardRules`, `evaluate`, `evaluateDispatch`, `CHECKS` and `KNOWN_CHECKS`. `CHECKS` holds the 40 check functions that a sidecar rule names. `evaluate` maps `block` and `error` severity to a deny and every other severity to a warning. An unknown check id is skipped and a throwing check counts as satisfied.

`dispatch-rule-checks.test.mjs` is the `node --test` suite for the rule engine. It covers rule loading, every check family, chain evaluation, the dispatch shapes and the OpenCode version resolver.

`dispatch-audit.mjs` exports `DISPATCH_SHAPES`, `inspectDispatch`, `resolveDispatchPackets`, `resolveDispatchCommands`, `buildAuditLine`, `appendAuditLog` and `recordDispatch`. It scrubs secrets, truncates fields and appends a size-rotated JSONL line. Every exported function resolves without throwing past its own boundary.

`dispatch-audit.test.mjs` is the `vitest` suite for the audit core. It covers dispatch recognition, the scrub and truncate pipeline, the rotated append and the kill switch. Run it with the pinned `.skilled/node_modules/.bin/vitest`, because `npx vitest` resolves a different copy.

`opencode-version-corpus.json` holds version outputs and the family each one should resolve to, including `v1`, `v2` and `unknown` forms.

`opencode-version.mjs` exports `resolveOpencodeVersionSync` and `SUPPORTED_FAMILIES`. It probes the first `opencode` on `PATH`, parses its version and caches the family as `v1` or `v2`. It returns `unknown` when the probe fails or the output holds no supported version.

---

## 3. VALIDATION

Run both suites from the repository root.

```bash
node --test .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.test.mjs
```

Expected result: every test passes and the runner exits 0.

```bash
.skilled/node_modules/.bin/vitest run .skilled/hooks/cli-dispatch/lib/dispatch-audit.test.mjs
```

Expected result: every test passes and the runner exits 0.

---

## 4. RELATED

- [`../README.md`](../README.md): the dispatch concern, the rule list and the runtime delivery table.
- [`../claude/README.md`](../claude/README.md): the Claude adapters that call these cores.
- [`../tests/dsh-dispatch.test.mjs`](../tests/dsh-dispatch.test.mjs): the DSH adapter tests that compare against these cores.
