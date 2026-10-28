---
title: "Scripts: rule-copy canary"
description: "Locks load-bearing rule wording (review-status vocabulary, the Iron Law, the restraint ladder's never-cut items) so it cannot silently drift across skill docs."
version: 1.0.5.0
---

# Scripts

---

## 1. OVERVIEW

`scripts/` holds the `sk-code-review` mode's rule-copy canary. Some wording must read identically or carry the same safety concept in more than one file. Two examples: the review-status vocabulary downstream PR-state dedup logic keys on, and the Iron Law that forbids completion claims without verification. This canary fails loudly the moment a copy drifts instead of letting the docs silently disagree.

---

## 2. CONTENTS

```text
scripts/
+-- check-review-final-line.js
+-- check-review-findings.js
+-- check-rule-copies.js
+-- review-output-fixture/
|   +-- overall-contradicts-status.md
|   +-- overall-contradicts-status-bulleted.md
|   +-- overall-contradicts-status-title-case.md
|   +-- heading-shape-missing-case.md
|   +-- heading-shape-restart.md
|   +-- heading-shape-valid.md
|   +-- list-shape-valid.md
|   `-- rule-sources-valid.md
`-- tests/
    `-- check-rule-copies.test.sh
```

| File | Purpose |
|------|---------|
| `check-review-final-line.js` | Checks that full reviews end on an exact status line. The line above the status line must be one blank line, and the line above that blank line must start with `Not checked:`, then one or more spaces, then text. When the summary carries an `Overall assessment` line, plain, bold, as a list item or in any letter case, whose value is one of the three status tokens, that value must match the final status line. The output must hold exactly one line that starts with `Not checked:`. A skip status such as `Review status: COMMENTED (skipped: ...)` passes only as the whole output. Trailing text, trailing whitespace on the status line and a result block below the status line also fail. Reads a file argument or stdin. Exits 0 on pass, 1 on validation failure and 2 when a file cannot be read, and prints the cause before the usage line |
| `check-review-findings.js` | Checks each numbered finding under `## Findings` in a review output, in both documented shapes: a numbered list item (`1. path:line Title`, the SKILL.md template) and a level-three heading (`### 2 [P1] Title`, the `review-core.md` schema). Fails when a finding has no `- Case:` sub-line, or when finding numbers restart or skip across the severity groups. A review with no findings passes. Reads a file argument or stdin. Exits 0 on pass, 1 on failure and 2 when a file cannot be read, and prints the cause before the usage line |
| `check-rule-copies.js` | Asserts that `Review status: APPROVED/REQUESTED_CHANGES/COMMENTED` appear verbatim in `sk-code-review/SKILL.md` and `sk-code-review/README.md`, that SKILL.md keeps the `APPROVED / REQUESTED_CHANGES / COMMENTED` assessment tokens, its pointer to the shared detection contract, its `quality-gate.cjs --explain` resolver step and the deleted-path filter before it, that `review-core.md` keeps the four review floor ids in its floor table and the exact `Rule sources:` line format, that `review-ux-single-pass.md` names the same three tokens, that `COMMENTED` appears in the changelog and dedup reference, that `code-quality-standards.md` keeps the items the restraint ladder may never cut, that `AGENTS.md` keeps the four evidence-floor labels the review mode applies (`Confirmed vs inferred`, `Observed command evidence`, `Finding = hypothesis` and `Your own read is also one lens`), that at least one Iron Law line in `workflow-verify.md` and `AGENTS.md` carries both "completion claim" and "verification", that every line of the `### Extension Floors` list in `SKILL.md` sits inside that section, and that the binding `AGENTS.md` clauses end inside its 16,384-byte delivery prefix with the file under 32,768 bytes. It also checks the documented example outputs in `SKILL.md` and `README.md` with `check-review-final-line.js`. A canary, not a generator, it never rewrites anything |
| `tests/check-rule-copies.test.sh` | Self-contained bash test. It runs the canary against the real repo tree and an untampered copy (expects pass), then against tampered copies (expects each to fail): a deleted status string, a reworded Iron Law line, each never-cut item deleted in turn, binding clauses pushed past the delivery prefix, an oversized `AGENTS.md`, final-line contract cases and example tampering that adds text after status or removes the `Not checked:` line, the four findings-checker cases, a `Not checked:` line with two spaces after the colon (expects pass), both finding shapes in `review-output-fixture/` through both checkers, the three contradictory-report fixtures, an agreeing and a placeholder Overall assessment line, a drifted gate-recommendation token in `review-ux-single-pass.md`, a renamed evidence-floor label in `AGENTS.md`, a reworded extension floor in `SKILL.md`, a reworded `Rule sources:` format and a dropped review floor id in `review-core.md`, a resolver step that stops filtering deleted paths, and a report that carries a `Rule sources:` line through both checkers (expects pass) |
| `review-output-fixture/` | Eight complete review outputs that `tests/check-rule-copies.test.sh` runs: `list-shape-valid.md` and `heading-shape-valid.md` pass both checkers, `heading-shape-missing-case.md` and `heading-shape-restart.md` pass the final-line checker and fail the findings checker, and `overall-contradicts-status.md` fails the final-line checker because its Overall assessment contradicts its status line. `overall-contradicts-status-bulleted.md` and `overall-contradicts-status-title-case.md` carry the same contradiction as a list item and as `Overall Assessment`, and fail the same way. `rule-sources-valid.md` carries a `Rule sources:` line in its summary and passes both checkers |

---

## 3. VALIDATION

Run from this packet's root, the `sk-code-review` folder. The canary reads files across the repository, so pass the repository root with `--root`:

```bash
node scripts/check-rule-copies.js --root <repository-root>
```

Expected: `OK: all rule invariants present (8 exact-string file(s) + 2 Iron Law file(s) + 21 delivery-prefix anchor(s) + 6 extension floor(s) + 2 example output(s)).`, then the delivery-prefix byte report, and exit code 0.

Check a review output from this packet's root:

```bash
node scripts/check-review-final-line.js <review-output-file>
```

Expected: `OK: review output ends on the exact status line`, exit code 0.

Check the finding numbers and Case lines of a review output from this packet's root:

```bash
node scripts/check-review-findings.js <review-output-file>
```

Expected: `OK: findings are numbered once and each carries a Case line`, exit code 0.

Or run the test harness from anywhere:

```bash
bash scripts/tests/check-rule-copies.test.sh
```

Expected: `All rule-canary test cases passed`.

---

## 4. RELATED

- [`sk-code-review SKILL.md`](../SKILL.md)
- [`sk-code-review README.md`](../README.md)
