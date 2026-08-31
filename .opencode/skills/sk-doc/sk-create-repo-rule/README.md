---
title: "create-repo-rule"
description: "Authors, revises and retires repo rules from a user's request, refusing most of them on four decision tests before anything gets written."
trigger_phrases:
  - "create repo rule"
  - "repo rule mode"
  - "what does create-repo-rule do"
  - "add a project rule"
importance_tier: normal
contextType: general
version: 1.0.0.0
---

# create-repo-rule

Turns a request — *"we should always X"*, *"stop doing Y"*, *"this keeps happening"* —
into a file under `repo-rules/`, wired into that repository's `REPO RULES.md` router.

---

## 1. WHAT IT IS FOR

A repo rule binds **before an action**: it loads when the router's trigger table matches
what you are about to do, and it constrains how you do it. That is different from a
skill, which loads when you need a capability and teaches you how.

The distinction that decides most cases: **if it tells you how to accomplish something it
is a skill; if it tells you what you may not do while accomplishing it, it is a rule.**

---

## 2. WHAT IT REFUSES

More than it accepts, by design. Four tests run before anything is written:

| Test | Refuses |
|------|---------|
| Always-loaded | Content that must bind on a turn where no trigger fires. That is an `AGENTS.md` row |
| Scope boundary | Routing — which skill, which command, which flags. Owned elsewhere |
| Four-part refusal | Single rows, content that already has a home, and anything with no anchor to load it |
| Restraint | Rules with no failure they prevent today |

A refusal names the test and where the content belongs instead. That is a useful answer,
not a dead end.

---

## 3. A RULE IS NOT PERMANENT

It supplements the harness. It sits below `AGENTS.md` and below a live operator
instruction, it carries a `version` because it is expected to change, and it should be
removed when nothing it prevents still happens. This mode owns creating, revising and
retiring — a create mode that cannot delete produces a set nobody prunes.

---

## 4. WHAT IT PRODUCES

- One file under `repo-rules/`, to the anatomy the shipped corpus already agrees on.
- Two rows in `REPO RULES.md`: trigger table and index.
- A pointer from the `AGENTS.md` section the rule governs.
- `REPO RULES.md` itself, when the repository has none — a prerequisite, not the ask.

---

## 5. WHERE THE RULES LIVE

`SKILL.md` is the executable contract. `references/decision-tests.md` decides whether a
rule may exist; `references/rule-anatomy.md` decides what it must contain. The templates
in `assets/` are what gets filled.
