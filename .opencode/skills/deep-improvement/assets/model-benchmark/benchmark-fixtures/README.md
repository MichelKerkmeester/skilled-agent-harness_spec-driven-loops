---
title: "benchmark-fixtures: tiered coding-task oracle fixtures"
description: "The coding-task fixtures scored by code-task-scorer.cjs via hidden oracle cases — legacy agent fixtures, the T1-T4 tiered taxonomy, and the hard / harder / validation packs built to discriminate frontier models without saturating."
trigger_phrases:
  - "benchmark fixtures"
  - "tiered fixture taxonomy"
  - "hard partial-credit fixtures"
  - "validation fixture pack"
---

# benchmark-fixtures: tiered coding-task oracle fixtures

---

## 1. OVERVIEW

`benchmark-fixtures/` holds the JSON fixtures a sweep scores. Each coding-task fixture names a function (`fn_name`), states the task, and carries `tests[]` (visible) + `hidden_tests[]` (held-out adversarial) oracle cases of the form `{name, args[], expect}`. `code-task-scorer.cjs` extracts the model's function, runs every oracle case in an isolated child process, and returns a `correctness_pass_rate` fraction — so "mostly right" separates from "fully right" instead of pass/fail.

Fixtures are organized by a **difficulty tier** (T1 smoke → T4 adversarial) so a profile can pick a discrimination level. The design lesson baked into the packs: raw computational difficulty saturates for frontier models (they ace standard-to-hard algorithms), so the discriminating fixtures are **invalid-dominant strict validators** — many adversarial-malformed inputs a lax-but-plausible solution wrongly accepts.

Current state:

- Legacy agent fixtures (`fixture-*`) feed the Lane B pattern scorer (no tier, no oracle cases).
- The tiered taxonomy (`t1`/`t3`/`t4`) seeds the smoke → adversarial range.
- The **hard pack** (computational, T4) discriminates code quality at the oracle level but tends to saturate frontier models.
- The **harder pack** (T4) confirmed the saturation finding — frontier models ace these too.
- The **validation pack** (`validate-*`, T4) is the discriminator: invalid-dominant validators where occasional catastrophic failures surface a real, reproducible reliability gap. Every oracle value is generated from a verified reference impl (reference scores 1.0; a lax impl scores < 1.0), never hand-authored.

---

## 2. KEY FILES

| Fixture | Tier | Fn | Cases | Purpose |
|---|---|---|---|---|
| `fixture-baseline.json` / `fixture-improved.json` / `fixture-edge.json` | — | agent | — | Legacy Lane B agent fixtures (pattern scorer, no oracle cases). |
| `t1-smoke-echo.json` | T1 | `echo` | 10 | Smoke: confirms the dispatch + scoring path end-to-end. |
| `t3-bugfix-in-context.json` | T3 | `lowerBound` | 11 | Mid-difficulty bugfix-in-context. |
| `t3-strict-acceptance.json` | T3 | `compareVersions` | 12 | Mid-difficulty strict acceptance. |
| `t4-adversarial-tokenizer.json` | T4 | `tokenize` | 15 | Adversarial tokenizer. |
| `hard-merge-intervals.json` | T4 | `mergeIntervals` | 16 | Hard computational pack (partial-credit). |
| `hard-parse-csv-line.json` | T4 | `parseCsvLine` | 17 | Hard computational pack. |
| `hard-roman-to-int.json` | T4 | `romanToInt` | 17 | Hard pack — the one that consistently discriminates (roman-numeral validation edge cases). |
| `hard-eval-expr.json` | T4 | `evalExpr` | 18 | Hard computational pack. |
| `harder-semver-compare.json` | T4 | `semverCompare` | 24 | Harder pack (precedence rules) — saturated frontier models. |
| `harder-normalize-path.json` | T4 | `normalizePath` | 24 | Harder pack (path resolution) — saturated. |
| `harder-int-to-words.json` | T4 | `intToWords` | 24 | Harder pack (number→words) — saturated. |
| `validate-ipv4.json` | T4 | `isValidIPv4` | 27 | Validation pack — strict dotted-decimal, leading-zero/range/format; ~74% invalid. |
| `validate-date.json` | T4 | `isValidDate` | 26 | Validation pack — strict ISO date, leap-year + days-per-month; ~73% invalid. |
| `validate-semver.json` | T4 | `isValidSemver` | 28 | Validation pack — strict SemVer grammar, numeric-id leading-zero + empty-identifier; ~64% invalid. |
