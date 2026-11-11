---
title: "sk-design-diagram Tests: Mutation Proof for Every Check Family"
description: "How the diagram corpus check is proved to fail: one mutation case per checker family."
trigger_phrases:
  - "diagram mutation tests"
  - "corpus mutations"
  - "checker family coverage"
  - "mutation cases"
  - "diagram tests"
version: 1.2.0.0
---

# sk-design-diagram Tests

Standing proof that every family in the diagram corpus check fails when the thing it describes is broken.

---

## 1. OVERVIEW

`tests/` owns the mutation suite for `../check-diagram-corpus.cjs`. The idea is simple. A checker that only ever runs on a green corpus proves nothing about its own assertions, so each case here breaks one thing in a copy and expects one named family to report one specific message.

The suite holds 17 mutation cases: 13 file cases, 2 package cases and 2 exemption cases. With a green baseline and three completeness guards, `node --test` reports 21 tests.

Current state:

- File cases copy one shipped diagram to a temporary folder, run the real checker with `--extra`, and read the `FAIL [family]` lines.
- Package cases copy `scripts/`, `references/`, `assets/` and `SKILL.md` into a temporary package, because corpus-scoped families read the documents and the token source.
- Exemption cases land a value the rule is meant to ignore and expect the run to stay green.
- The harness refuses a case that asserts nothing: a missing patch anchor, an unchanged patch, a base file that already fails, or a failure from another family.

---

## 2. KEY FILES

```text
tests/
├── corpus-mutations.test.cjs   # Harness: runs each case and guards family coverage
├── mutation-cases.cjs          # Case table: FILE_CASES, PACKAGE_CASES, EXEMPTION_CASES
├── fixtures/                   # Mutation inputs that stand in for shipped assets
│   └── design-md-sample.html   # Themed palette block used by the derivation-gate cases
└── README.md                   # This file
```

`fixtures/` holds HTML samples that the checker treats like any other delivery. Today it holds one themed palette block whose values deliberately differ from the token record, so the themed branch of `derivation-gates` is exercised by a mutation rather than by a live reference.

---

## 3. HOW A CASE RUNS

A file case is a plain object. It names a family, a shipped file, a `from` anchor and a `to` replacement. The harness then:

1. Reads the source file and asserts the anchor exists, so a moved line fails loudly.
2. Writes the unmutated file into a temp folder and confirms the family is already silent on it.
3. Writes the mutated file and runs the checker again.
4. Requires at least one `FAIL [family]` line and requires one of those lines to match the case's `expect` pattern.

Package cases take a `mutate` function instead of a file and anchor, and run against a copied package. Exemption cases write only the mutated file and require `RESULT: PASSED`, because the value is meant to pass.

The last three tests keep the suite honest. One checks that every family under `../families/` has a case. One checks that no case names a family the checker does not register. One checks that every entry in `NEEDS_AN_EYE` still names a live family. A new family with no case fails the run.

---

## 4. RUNNING THE SUITE

Run from the repository root.

```bash
node --test '.skilled/skills/sk-design/sk-design-diagram/scripts/tests/*.test.cjs'
```

Expected result: 21 tests pass and 0 fail. The run takes about 30 seconds because every case starts a checker process. The first test runs the checker over the whole packet, so one document outside this folder that fails a family fails the suite before any case runs.

Run the checker on its own when you want the corpus status without the mutation proof.

```bash
node .skilled/skills/sk-design/sk-design-diagram/scripts/check-diagram-corpus.cjs
```

Expected result: the summary ends with `RESULT: PASSED`.

---

## 5. ADDING A CASE

Add the case to `mutation-cases.cjs` in the table that matches its scope. Keep the anchor short and unique in the file. Write `expect` against the message the family actually prints, not against a word you hope it prints.

The harness fails when the anchor is missing, when the patch changes nothing, when the base file already fails the family, or when a different family fires. It also fails when a new family has no case, so add the case in the same change that adds the family.

If a family cannot fire on the shipped corpus, record it in `NEEDS_AN_EYE` inside `corpus-mutations.test.cjs` with the reason. The guard fails once that family disappears.

---

## 6. RELATED

- [`../README.md`](../README.md) - the scripts this suite exercises.
- [`../../README.md`](../../README.md) - the diagram packet overview.
- [`../../SKILL.md`](../../SKILL.md) - workflow boundaries and the drawing contract.
- [`../../../sk-design-chart/scripts/README.md`](../../../sk-design-chart/scripts/README.md) - sibling scripts README and its own mutation suite.
