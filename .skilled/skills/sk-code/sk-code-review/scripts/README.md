---
title: "Scripts: rule-copy canary"
description: "Locks load-bearing rule wording (review-status vocabulary, the Iron Law, the restraint ladder's never-cut items) so it cannot silently drift across skill docs."
---

# Scripts

---

## 1. OVERVIEW

`scripts/` holds the `code-review` skill's rule-copy canary. Some wording must read identically or carry the same safety concept in more than one file. Two examples: the review-status vocabulary downstream PR-state dedup logic keys on, and the Iron Law that forbids completion claims without verification. This canary fails loudly the moment a copy drifts instead of letting the docs silently disagree.

---

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `check-review-final-line.js` | Checks that full reviews end on an exact status line. The line above the status line must be one blank line, and the line above that blank line must start with `Not checked:` followed by text. The output must hold exactly one line that starts with `Not checked:`. A skip status such as `Review status: COMMENTED (skipped: ...)` passes only as the whole output. Trailing text, trailing whitespace on the status line and a result block below the status line also fail. Reads a file argument or stdin. Exits 0 on pass, 1 on validation failure and 2 when a file cannot be read, and prints the cause before the usage line |
| `check-review-findings.js` | Checks each numbered finding under `## Findings` in a review output. Fails when a finding has no `- Case:` sub-line, or when finding numbers restart or skip across the severity groups. A review with no findings passes. Reads a file argument or stdin. Exits 0 on pass, 1 on failure and 2 when a file cannot be read, and prints the cause before the usage line |
| `check-rule-copies.js` | Asserts that `Review status: APPROVED/REQUESTED_CHANGES/COMMENTED` appear verbatim in `sk-code-review/SKILL.md` and `sk-code-review/README.md`, that `COMMENTED` appears in the changelog and dedup reference, that `code-quality-standards.md` keeps the items the restraint ladder may never cut, that at least one Iron Law line in `workflow-verify.md` and `AGENTS.md` carries both "completion claim" and "verification", and that the binding `AGENTS.md` clauses end inside its 16,384-byte delivery prefix with the file under 32,768 bytes. It also checks the documented example outputs in `SKILL.md` and `README.md` with `check-review-final-line.js`. A canary, not a generator, it never rewrites anything |
| `check-rule-copies.test.sh` | Self-contained bash test. It runs the canary against the real repo tree and an untampered copy (expects pass), then against tampered copies (expects each to fail): a deleted status string, a reworded Iron Law line, each never-cut item deleted in turn, binding clauses pushed past the delivery prefix, an oversized `AGENTS.md`, final-line contract cases and example tampering that adds text after status or removes the `Not checked:` line, and the four findings-checker cases |

---

## 3. VALIDATION

Run from the repository root:

```bash
node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js
```

Expected: `OK: all rule invariants present (5 exact-string file(s) + 2 Iron Law file(s) + 21 delivery-prefix anchor(s) + 2 example output(s)).`, then the delivery-prefix byte report, and exit code 0.

Check a review output from the repository root:

```bash
node .skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js <review-output-file>
```

Expected: `OK: review output ends on the exact status line`, exit code 0.

Check the finding numbers and Case lines of a review output from the repository root:

```bash
node .skilled/skills/sk-code/sk-code-review/scripts/check-review-findings.js <review-output-file>
```

Expected: `OK: findings are numbered once and each carries a Case line`, exit code 0.

Or run the test harness from anywhere:

```bash
bash .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.test.sh
```

Expected: `All rule-canary test cases passed`.

---

## 4. RELATED

- [`code-review SKILL.md`](../SKILL.md)
- [`code-review README.md`](../README.md)
