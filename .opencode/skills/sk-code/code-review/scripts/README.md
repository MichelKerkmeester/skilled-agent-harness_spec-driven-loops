---
title: "Scripts: rule-copy canary"
description: "Locks load-bearing rule wording (review-status vocabulary, the Iron Law) so it cannot silently drift across skill docs."
---

# Scripts

---

## 1. OVERVIEW

`scripts/` holds the `code-review` skill's rule-copy canary. Some wording must read identically or carry the same safety concept in more than one file. Two examples: the review-status vocabulary downstream PR-state dedup logic keys on, and the Iron Law that forbids completion claims without verification. This canary fails loudly the moment a copy drifts instead of letting the docs silently disagree.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `check-rule-copies.js` | Asserts that `Review status: APPROVED/REQUESTED_CHANGES/COMMENTED` appear verbatim in `code-review/SKILL.md` and `code-review/README.md`, that `COMMENTED` appears in the changelog and dedup reference, and that at least one Iron Law line in `workflow-verify.md`, `CLAUDE.md` and `AGENTS.md` carries both "completion claim" and "verification". A canary, not a generator, it never rewrites anything |
| `check-rule-copies.test.sh` | Self-contained bash test that runs the canary against the real repo tree (expects pass) and against two tampered copies with a deleted status string and a reworded Iron Law line (expects each to fail) |

## 3. VALIDATION

Run from the repository root:

```bash
node .opencode/skills/sk-code/code-review/scripts/check-rule-copies.js
```

Expected: `OK: all rule invariants present (4 exact-string file(s) + 3 Iron Law file(s)).` and exit code 0.

Or run the test harness from anywhere:

```bash
bash .opencode/skills/sk-code/code-review/scripts/check-rule-copies.test.sh
```

Expected: `All rule-canary test cases passed`.

## 4. RELATED

- [`code-review SKILL.md`](../SKILL.md)
- [`code-review README.md`](../README.md)
