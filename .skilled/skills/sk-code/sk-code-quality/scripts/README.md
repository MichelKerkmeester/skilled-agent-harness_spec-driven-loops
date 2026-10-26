---
title: "Scripts: comment-hygiene, dist-staleness and ceiling-report checkers"
description: "The sk-code-quality skill's standalone checkers, including the ceiling-marker report, and pointers to the hook adapters and shared dispatch table that wire them into editor tool calls."
version: 1.0.1.0
---

# Scripts

---

## 1. OVERVIEW

`scripts/` owns the `sk-code-quality` skill's three standalone checkers (comment hygiene, dist staleness and the ceiling-marker report). The per-edit PostToolUse adapters and their shared dispatch table moved to `.skilled/hooks/post-edit-quality/`, and the `hooks/` and `lib/` subfolders here keep only the legacy `claude-posttooluse.sh` and a pointer README.

---

## 2. CONTENTS

| File / Folder | Purpose |
|------|---------|
| `check-comment-hygiene.sh` | Python script (kept as a `.sh` entrypoint) that scans the comments of one or more files for ephemeral-artifact references such as packet/phase IDs, ADR/REQ/CHK IDs, spec paths and issue numbers. It reads its languages and comment families from `../assets/comment-syntax.json`, prints each finding with its reason, and prints a `comment-hygiene/v1` document with `--json`. It exits 1 when any file has a finding, 0 when at least one file was checked clean, 2 when every file was skipped and 3 on a usage error, an unreadable table or an unreadable file |
| `check-comment-hygiene.test.sh` | Bash test harness that runs the comment-hygiene checker against seeded fixture files covering both violation and allowed-pattern cases |
| `check-dist-staleness.sh` | Python script (kept as a `.sh` entrypoint) that checks whether a watched TypeScript package's compiled dist is stale, scoped to one edited file by default or every watched package with `--all` |
| `ceiling-report.sh` | Python report behind a `.sh` entrypoint that lists the `ceiling:` and `intentional-limit:` comment markers, tags the ones with no trigger or no measurable trigger, and exits 0 when it runs |
| `ceiling-report.test.sh` | Bash test harness with fixture cases for the ceiling report |
| `hooks/` | Legacy `claude-posttooluse.sh` and its test, registered in no runtime. The live adapters are in `.skilled/hooks/post-edit-quality/`, see `hooks/README.md` |
| `lib/` | Pointer only. The shared dispatch table moved to `.skilled/hooks/post-edit-quality/lib/`, see `lib/README.md` |

---

## 3. VALIDATION

Run the four bash suites from the repository root. The `sk-code-script-tests.yml` workflow runs the same four.

```bash
bash .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.test.sh
bash .skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.test.sh
bash .skilled/skills/sk-code/sk-code-quality/scripts/typo-flags.test.sh
bash .skilled/skills/sk-code/sk-code-quality/scripts/hooks/claude-posttooluse.test.sh
```

Expected: `All comment hygiene test cases passed`, `All ceiling report test cases passed`, `All typo-flag test cases passed` and `Post-edit adapter parse regression fixture passed`, each with exit 0.

---

## 4. RELATED

- [`sk-code-quality SKILL.md`](../SKILL.md)
- [`sk-code-quality README.md`](../README.md)
