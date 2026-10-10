---
title: "Scripts: comment-hygiene, dist-staleness and ceiling-report checkers"
description: "The code-quality skill's standalone checkers, including the ceiling-marker report, plus the hook adapters and shared dispatch table that wire them into editor tool calls."
---

# Scripts

---

## 1. OVERVIEW

`scripts/` owns the `code-quality` skill's three standalone checkers (comment hygiene, dist staleness and the ceiling-marker report) and the two subfolders that turn them into per-edit warnings: `hooks/` (the Claude Code and Codex CLI PostToolUse adapters) and `lib/` (the shared runtime-neutral dispatch table both adapters call).

---

## 2. CONTENTS

| File / Folder | Purpose |
|------|---------|
| `check-comment-hygiene.sh` | Python script (kept as a `.sh` entrypoint) that scans the comment lines of one or more files for ephemeral-artifact references such as packet/phase IDs, ADR/REQ/CHK IDs and spec paths. It exits 1 with the offending lines when any file has one, 0 when at least one file was checked clean, and 2 when every file was skipped |
| `check-comment-hygiene.test.sh` | Bash test harness that runs the comment-hygiene checker against seeded fixture files covering both violation and allowed-pattern cases |
| `check-dist-staleness.sh` | Python script (kept as a `.sh` entrypoint) that checks whether a watched TypeScript package's compiled dist is stale, scoped to one edited file by default or every watched package with `--all` |
| `ceiling-report.sh` | Python report behind a `.sh` entrypoint that lists the `ceiling:` and `intentional-limit:` comment markers, tags the ones with no trigger or no measurable trigger, and exits 0 when it runs |
| `ceiling-report.test.sh` | Bash test harness with fixture cases for the ceiling report |
| `hooks/` | Claude Code and Codex CLI PostToolUse adapters, see `hooks/README.md` |
| `lib/` | Shared runtime-neutral dispatch table consumed by both hook adapters, see `lib/README.md` |

---

## 3. VALIDATION

Run from the repository root:

```bash
bash .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.test.sh
bash .skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.test.sh
```

Expected: `All comment hygiene test cases passed` and `All ceiling report test cases passed`.

---

## 4. RELATED

- [`code-quality SKILL.md`](../SKILL.md)
- [`code-quality README.md`](../README.md)
