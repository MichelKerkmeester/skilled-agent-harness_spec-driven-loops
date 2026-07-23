---
title: "benchmark-fixtures: tiered oracle fixtures"
description: "Benchmark fixtures for Lane B: pattern evidence contracts, coding-task oracle fixtures, validation packs, and reviewer-prompt expected-verdict fixtures."
trigger_phrases:
  - "benchmark fixtures"
  - "tiered fixture taxonomy"
  - "hard partial-credit fixtures"
  - "validation fixture pack"
version: 1.17.0.2
---

# benchmark-fixtures: tiered oracle fixtures

---

## 1. OVERVIEW

`benchmark-fixtures/` holds the JSON fixtures a sweep scores. Each coding-task fixture names a function (`fn_name`), states the task, and carries `tests[]` (visible) + `hidden_tests[]` (held-out adversarial) oracle cases of the form `{name, args[], expect}`. `code-task-scorer.cjs` extracts the model's function, runs every oracle case in an isolated child process, and returns a `correctness_pass_rate` fraction — so "mostly right" separates from "fully right" instead of pass/fail.

Reviewer-prompt fixtures add a separate expected-verdict shape for reviewer regression tests. They use `kind: "reviewer-prompt"`, `prompt_template`, `input_kind`, `input`, `expectedVerdict`, and `expectedFindings`. `reviewer-scorer.cjs` extracts `PASS`/`FAIL`/`BLOCK` pattern-first, can fall back to `--grader llm`, and reports `REVIEWER_BENCHMARK: fixture X expected FAIL, got PASS — rule not safe to promote` on mismatch.

Fixtures are organized by a **difficulty tier** (T1 smoke → T4 adversarial) so a profile can pick a discrimination level. The design lesson baked into the packs: raw computational difficulty saturates for frontier models (they ace standard-to-hard algorithms), so the discriminating fixtures are **invalid-dominant strict validators** — many adversarial-malformed inputs a lax-but-plausible solution wrongly accepts.

Current state:

- Legacy agent fixtures (`fixture_*`) feed the Lane B pattern scorer (no tier, no oracle cases).
- The tiered taxonomy (`t1`/`t3`/`t4`) seeds the smoke → adversarial range.
- The **hard pack** (computational, T4) discriminates code quality at the oracle level but tends to saturate frontier models.
- The **harder pack** (T4) confirmed the saturation finding — frontier models ace these too.
- The **validation pack** (`validate_*`, T4) is the discriminator: invalid-dominant validators where occasional catastrophic failures surface a real, reproducible reliability gap. Every oracle value is generated from a verified reference impl (reference scores 1.0; a lax impl scores < 1.0), never hand-authored.
- Reviewer fixtures (`reviewer_*`) seed reviewer-prompt regression cases for stale evidence, softened failure, read-budget overuse, and acceptance coverage shortfall.

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
| `reviewer-stale-verdict.json` | reviewer | `reviewer-scorer.cjs` | 2 | Expected-`fail` reviewer regression for stale completion evidence after a changed command or asset. |
| `reviewer-softened-fail.json` | reviewer | `reviewer-scorer.cjs` | 2 | Expected-`fail` reviewer regression for active blockers relabeled as conditional or partial success. |
| `reviewer-over-read.json` | reviewer | `reviewer-scorer.cjs` | 2 | Expected-`fail` reviewer regression for unjustified full or repeat reads. |
| `reviewer-ac-coverage.json` | reviewer | `reviewer-scorer.cjs` | 2 | Expected-`fail` reviewer regression for acceptance coverage shortfall. |

---

## 3. REVIEWER FIXTURE SHAPE

Reviewer fixtures are detected by shape: `kind: "reviewer-prompt"`, a string `prompt_template`, and an `expectedVerdict` in `pass`/`fail`/`block`. They carry `tests[]` and `hidden_tests[]` just like code-task fixtures, but the oracle is a verdict plus expected finding tokens rather than function return values.

See [`reviewer-schema.md`](./reviewer-schema.md) for the full schema, deterministic replay field, and how-to-add steps.

---

## 4. AUTHORING

New fixtures are authored from the `sk-doc/create-benchmark` §11 templates: [`model-benchmark-code-task-fixture-template.md`](../../../../../sk-doc/create-benchmark/assets/model-benchmark/model-benchmark-code-task-fixture-template.md) for code-task oracle fixtures and [`model-benchmark-pattern-fixture-template.md`](../../../../../sk-doc/create-benchmark/assets/model-benchmark/model-benchmark-pattern-fixture-template.md) for pattern/capability and reviewer-prompt fixtures, following [`model-benchmark-fixture-guide.md`](../../../../../sk-doc/create-benchmark/references/model-benchmark/model-benchmark-fixture-guide.md). Those templates author the fixture *inputs* only. The reviewer-prompt schema ([`reviewer-schema.md`](./reviewer-schema.md)) and every scorer stay lane-local here; they are cross-linked from create-benchmark, never copied into it.
