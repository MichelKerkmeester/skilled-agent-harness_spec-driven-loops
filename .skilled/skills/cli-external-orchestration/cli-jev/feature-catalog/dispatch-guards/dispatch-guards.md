---
title: "cli-jev Feature: Dispatch guards"
description: "The eight declared hard rules with their implementations and severities, and the audit dispatch shape that decides whether they are reachable at all."
trigger_phrases:
  - "jev dispatch guards"
  - "jev hard rules"
  - "jev audit shape"
importance_tier: "important"
contextType: "reference"
version: 1.0.0.0
---

# Dispatch guards

Enforcement for this packet has two halves that must both hold. The **shape** decides whether a
command is recognised as a `cli-jev` dispatch, and the **rules** decide whether it is allowed. A
shape that resolves nothing makes every rule dead text; an implementation no packet declares is dead
code that reads as coverage. Both directions are asserted by the repository's own test suite.

---

## 1. The audit dispatch shape

| Aspect | Value |
|---|---|
| Module | `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` |
| Registry row | `DISPATCH_SHAPES` — a `jev` entry alongside the seven executors |
| Command-position branch | `directExecutor()` returns `cli-jev` for the `jev` and `jev-mcp` basenames |
| Executor set | `EXECUTOR_BASENAMES` includes both basenames |
| Text fallback | `hasDispatchText()` accepts the jev forms, so an embedded invocation is not missed |

**Resolution rule**: the tokenizer decides. A `jev` that sits in a quoted argument, a heredoc body, a
grep pattern or a `console.log` is text, and resolves to `null`. This is the property that lets the
packet's own references quote commands without arming the guard.

Anchors: `dispatch-audit.mjs` (`DISPATCH_SHAPES`, `directExecutor`, `hasDispatchText`),
`.skilled/hooks/dispatch/lib/dispatch-audit.test.mjs` (the shape rows).

---

## 2. The eight declared rules

Declared in `SKILL.md` `hard_rules:`, implemented in `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs`,
each with a satisfied/violated fixture pair in `dispatch-rule-checks.test.mjs`.

| # | Rule id | Check id | Severity | What it refuses |
|---|---|---|---|---|
| 1 | `jev-availability-required` | `command-v-jev-required` | error | A dispatch whose binary does not resolve on `PATH` |
| 2 | `jev-stdin-bounded` | `jev-stdin-bounded` | error | A stdin-reading judgment with nothing feeding or closing stdin |
| 3 | `jev-choice-option-cardinality` | `jev-choice-option-cardinality` | error | `choice` with fewer than two options |
| 4 | `jev-score-level-cardinality` | `jev-score-level-cardinality` | error | `score` with fewer than two levels |
| 5 | `jev-value-not-with-run` | `jev-value-not-with-run` | error | `--value` combined with `run` |
| 6 | `jev-custom-endpoint-required` | `jev-custom-endpoint-required` | error | `--provider custom` with no endpoint |
| 7 | `jev-no-inline-credential` | `jev-no-inline-credential` | warn | An API key literal on the command line |
| 8 | `jev-mcp-host-only` | `jev-mcp-host-only` | warn | Running `jev-mcp` from a shell |

**Why error and not warn.** A rule whose violation produces a wrong answer or a hang is declared
`error`, because a warning an agent may ignore changes nothing about the failure. A rule whose
violation is a hygiene problem with a plausible legitimate reading — an inline variable in a harness,
a probe that owns its own server subprocess — is declared `warn`.

**Fail-open, deliberately.** A check that throws, an unreadable `PATH`, or a check id with no
implementation all resolve to a pass. The cost of a false refusal is a blocked dispatch; the cost of
a false pass is the failure the caller would have seen anyway. The bijection guard is what keeps the
fail-open path from becoming a silent hole: a declared id with no implementation fails the suite, so
"unknown check → skip" can never be the reason a rule never fires.

---

## 3. The three enforcement gates

| Gate | Location | Fires |
|---|---|---|
| In-process dispatch audit | `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` | Records a completed dispatch and resolves which packet governs it |
| Preflight lint | `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts` | Before a Bash call runs; blocks on error-severity violations |
| Test-suite guards | `dispatch-rule-checks.test.mjs` | In CI; the shape fixture, the decline fixture, and the bijection guard |

Anchors and commands are in the per-scenario files under the packet's `manual-testing-playbook/dispatch-guards/`
(JEV-017 to JEV-019).
