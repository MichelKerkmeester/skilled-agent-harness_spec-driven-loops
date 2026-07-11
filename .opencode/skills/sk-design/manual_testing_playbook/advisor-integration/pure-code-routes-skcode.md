---
title: "AI-002: Pure Code Routes to sk-code"
description: "Verify pure code-edit prompts route away from sk-design and into sk-code."
version: 1.0.0.0
---

# AI-002: Pure Code Routes to sk-code

## 1. OVERVIEW

This scenario verifies that `sk-design` does not false-fire on a pure code prompt with no visual, UI, motion, audit, or extraction intent.

## 2. SCENARIO CONTRACT

**Realistic user request**: A developer asks for a TypeScript refactor unrelated to UI or design.

**Exact prompt**:
```text
Refactor the parseExecutorConfig function in a TypeScript config loader to throw when the executor type is missing.
```

**Expected mode resolution**: none for `sk-design`; route elsewhere.

**Why**:
- `SKILL.md` says never route pure code, backend, or data work through the design family.
- `hub-router.json` design vocabulary does not include TypeScript config-loader refactor terms.
- The expected owner is `sk-code`, which owns executable code implementation.

**Expected packet loaded**:
- None under `sk-design/`.

**Expected shared resources loaded or cited**:
- None under `sk-design/shared/`.

**Expected advisor behavior**: route elsewhere. Expected top-1 is `sk-code`; `sk-design` must not be top-1 at confidence `>= 0.80`.

## 3. TEST EXECUTION

### Preconditions

1. Advisor is callable.
2. The prompt is not edited to include UI, design, motion, audit, or DESIGN.md terms.

### Exact Command Sequence

1. Run the advisor probe and save output to `/tmp/skd-AI002-advisor.txt`.
2. Do not invoke `sk-design` if advisor routes elsewhere.
3. Record top-1 skill, score, and whether `sk-design` appeared in top-3.

### Pass/Fail Criteria

- **PASS** iff top-1 is `sk-code` or another code owner, and `sk-design` is not top-1 at confidence `>= 0.80`.
- **FAIL** iff `sk-design` wins for this pure code prompt or loads any design packet.

### Failure Triage

1. If `sk-design` wins, inspect whether broad words like `config` or `refactor` were incorrectly added to design signals.
2. If the hub was invoked manually despite advisor losing, discard the run as operator error and rerun from advisor-first flow.
3. If the prompt was rewritten to mention a UI surface, restore the exact prompt.

## 4. SOURCE FILES

- `.opencode/skills/sk-design/SKILL.md`
- `.opencode/skills/sk-design/hub-router.json`

## 5. SOURCE METADATA

- **Critical path**: Yes
- **Destructive**: No
- **Concurrent-safe**: Yes
- **Last validated**: pending manual run
