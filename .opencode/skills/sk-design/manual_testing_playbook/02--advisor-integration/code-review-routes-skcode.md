---
title: "AI-004: Code-Correctness Review Routes to sk-code"
description: "Verify a code-correctness review request using review/audit-adjacent wording still routes to sk-code's code-review mode, not sk-design's audit mode."
version: 1.0.0.0
---

# AI-004: Code-Correctness Review Routes to sk-code

## 1. OVERVIEW

This scenario verifies that `sk-design` does not capture a code-correctness review prompt merely because it uses review/audit-adjacent wording that overlaps with `design-audit`'s own alias vocabulary. It proves the sibling-collision boundary that `design-audit/SKILL.md` names explicitly: a code review outside design/UI concerns must route to `sk-code`'s code-review mode, not `sk-design`'s audit mode.

## 2. SCENARIO CONTRACT

**Realistic user request**: A developer asks for a security and correctness review of a backend API handler, explicitly framing it as code review rather than a UI or design review.

**Exact prompt**:
```text
Review this checkout API handler for SQL-injection risk and missing input validation. This is a code-correctness review, not a visual or UI design review.
```

**Expected mode resolution**: none for `sk-design`; route elsewhere.

**Why**:
- `design-audit/SKILL.md` names "the user asks for a code review outside design/UI concerns -> use sk-code's code-review mode" as an explicit When-NOT-to-Use trigger and Integration Points boundary.
- The prompt's wording overlaps `hub-router.json` audit vocab classes `audit-aliases` / `audit-quality` (e.g. `design review`, `review the ui`, `ui critique`, `audit the design`) via the bare word "review", but the request itself is SQL-injection risk and input validation on an API handler — pure backend code correctness, not visual or UI design.
- The expected owner is `sk-code`, whose code-review mode owns correctness, security, and reuse/simplification review of code changes.
- No other `sk-design` mode shares a same-named sibling mode in `sk-code`; `design-audit` vs `sk-code` code-review is the one explicitly-documented cross-skill collision.

**Expected packet loaded**:
- None under `sk-design/`.

**Expected shared resources loaded or cited**:
- None under `sk-design/shared/`.

**Expected advisor behavior**: route elsewhere. Expected top-1 is `sk-code` (its code-review mode); `sk-design` must not be top-1 at confidence `>= 0.80`. No `design-audit` packet or procedure card should load.

## 3. TEST EXECUTION

### Preconditions

1. Advisor is callable.
2. The prompt is not edited to add UI, visual, or design-system language.

### Exact Command Sequence

1. Run the advisor probe and save output to `/tmp/skd-AI004-advisor.txt`.
2. Do not invoke `sk-design` if advisor routes elsewhere.
3. Record top-1 skill, score, and whether `sk-design` (or `design-audit`) appeared in top-3.

### Pass/Fail Criteria

- **PASS** iff top-1 is `sk-code` (routed to its code-review mode), and `sk-design` is not top-1 at confidence `>= 0.80`.
- **FAIL** iff `sk-design` wins, `design-audit` loads a packet or procedure card, or the audit-alias overlap on "review" pulls the request into the design family.

### Failure Triage

1. If `sk-design` wins, inspect whether the bare word "review" or "audit" is over-weighted in `hub-router.json`'s `audit-aliases` / `audit-quality` vocab classes relative to the code-correctness signal (`SQL-injection`, `input validation`, `API handler`).
2. If `design-audit`'s When-NOT-to-Use trigger for code review is missing or was edited, treat as a `SKILL.md` regression, not an advisor scoring bug.
3. If the prompt was rewritten to include UI, visual, or design-system terms, restore the exact prompt.

## 4. SOURCE FILES

- `.opencode/skills/sk-design/SKILL.md`
- `.opencode/skills/sk-design/design-audit/SKILL.md`
- `.opencode/skills/sk-design/hub-router.json`

## 5. SOURCE METADATA

- **Critical path**: No
- **Destructive**: No
- **Concurrent-safe**: Yes
- **Last validated**: pending manual run
