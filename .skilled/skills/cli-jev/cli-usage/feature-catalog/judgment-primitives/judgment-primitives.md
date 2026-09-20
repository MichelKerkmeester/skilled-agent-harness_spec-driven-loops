---
title: "cli-usage Feature: Judgment primitives"
description: "The four judgment primitives — noul, choice, score and run — with their inputs, answer shapes, cardinality rules and anchors."
trigger_phrases:
  - "jev judgment primitives"
  - "noul choice score run"
  - "jev answer shapes"
importance_tier: "important"
contextType: "reference"
version: 1.0.0.0
---

# Judgment primitives

Each primitive is one request type. The caller picks by what it will do with the value, and the
answer path is `answers.<name>.<type>` — see `references/cli-reference.md` §5 for the receipts.

---

## 1. `noul` — yes/no probability

| | |
|---|---|
| CLI shape | `jev noul -q '<question>' [-s '<state>']` |
| Criteria | none |
| Answer | `answers.answer.noul` — a probability in `[0, 1]` |
| `--value` output | the bare number |
| Choose it when | the caller owns a threshold and will compare against it |

Anchors: `SKILL.md` §4 (narrowest question type), `references/cli-reference.md` §5,
`assets/question-shaping-card.md` §1.

**The trap**: a `noul` answer that then gets compared to a threshold invented at the call site. If
the threshold is really the decision, the question was a `choice`.

---

## 2. `choice` — one key from explicit options

| | |
|---|---|
| CLI shape | `jev choice -q '<question>' [-s '<state>'] -o KEY=DESCRIPTION [-o …]` |
| Criteria | an object of `KEY → DESCRIPTION` pairs, at least two |
| Answer | `answers.answer.choice` — one submitted key, verbatim |
| `--value` output | the key |
| Choose it when | the caller will branch on a category |

Anchors: `SKILL.md` hard rule `jev-choice-option-cardinality`,
`.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` (`jev-choice-option-cardinality`),
`references/integration-patterns.md` §2.

**The trap**: single-option `choice`. The CLI sends it, the MCP tool refuses it, and the answer is a
foregone conclusion either way. The packet's guard refuses it at the command line, which is the
earliest of the three.

---

## 3. `score` — ordered level position

| | |
|---|---|
| CLI shape | `jev score -q '<question>' [-s '<state>'] -l '<level>' [-l …]` |
| Criteria | a list of descriptions ascending from lowest to highest, at least two |
| Answer | `answers.answer.score` — a zero-based position, **may be fractional** |
| `--value` output | the position |
| Choose it when | the answer is a degree and several thresholds act on it |

Anchors: `SKILL.md` hard rule `jev-score-level-cardinality`,
`dispatch-rule-checks.mjs` (`jev-score-level-cardinality`), `references/integration-patterns.md` §3.

**The traps**: descending levels invert every comparison downstream, and a fractional position
silently falls through an integer `case` pattern. Both are in the pattern's own text.

---

## 4. `run` — batched typed questions

| | |
|---|---|
| CLI shape | `jev run <request.json|->` |
| Request | `{"state": …, "questions": {"<key>": {"type": …, "instructions": …, "criteria": …}}}` |
| Answer | `answers.<key>.<type>` for every key the caller named |
| `--value` output | **unavailable** — and the CLI says so only after a successful call |
| Choose it when | one state answers several questions and one round trip is cheaper |

Anchors: `SKILL.md` hard rule `jev-value-not-with-run`, `dispatch-rule-checks.mjs`
(`jev-value-not-with-run`), `references/integration-patterns.md` §4.

**The trap**: batching unrelated decisions. Questions share the state's context, so a bundle of
questions the state does not answer invites confident answers about nothing.

---

## 5. Cardinality, by surface

| Surface | `choice` with one option | `score` with one level | `--value` with `run` |
|---|---|---|---|
| CLI | Accepted, request sent | Accepted, request sent | Rejected after a successful call |
| `jev-mcp` | Refused before any request | Refused before any request | n/a — no such argument |
| Packet guard | Refused before the command is spawned | Refused before the command is spawned | Refused before the command is spawned |

The three surfaces disagree on *when*, and that is exactly why the guard exists: it moves the refusal
to the earliest of the three, where no quota has been spent and no misleading answer has been
produced.
