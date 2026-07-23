---
title: "eval-rig/scripts/deterministic: regex-based per-fixture scoring checks"
description: "Four deterministic scoring checks (D2, D3, D4, D5) that grade a model output without an LLM call."
---

# eval-rig/scripts/deterministic

---

## 1. OVERVIEW

`deterministic/` holds the eval-rig's regex and rule-based scoring checks. Each check reads a `fixture.json` and an output markdown file and returns a score for one rubric dimension, no model call involved. `bundle-gate.cjs` is the rig's only hard gate. The other three are soft signals folded into the weighted variant score.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `bundle-gate.cjs` | D2 Bundle-gate check (rubric weight 0.30, hard gate). Three-layer verification of claimed imports, claimed exports and an executed smoke-run command when the fixture declares one. An environment-failure smoke-run sets `hard_gate_failed: true` |
| `cwd-check.cjs` | D3 Path/CWD discipline check (rubric weight 0.20, soft signal). Classifies every path-like string in the output as inside the fixture's cwd, outside it, a bare relative path or a `..` traversal attempt. Scores accordingly |
| `hallucination-flag.cjs` | D4 Hallucination check (rubric weight 0.15, deterministic primary). Extracts claimed CLI flags and symbols from the output and flags any not present in the fixture's allowlist. The semantic counterpart lives in `../../grader/harness.cjs` |
| `preplanning-regex.cjs` | D5 Pre-plan structure check (rubric weight 0.10, never a hard gate). Scores a `<pre-plan>` block for presence, step count (three or more numbered steps) and whether each step states both an acceptance criterion and a verification command |

## 3. VALIDATION

```bash
node bundle-gate.cjs <fixture.json> <output.md>
```

Each check is independently runnable this way from `deterministic/`. `../dry-run.cjs --test-deterministic` runs all four against canned outputs in one pass.

## 4. RELATED

- [`SKILL.md`](../../../../../SKILL.md)
- [`../README.md`](../README.md)
- [`../../grader/README.md`](../../grader/README.md)
