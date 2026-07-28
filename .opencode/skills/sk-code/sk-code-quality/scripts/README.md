---
title: "Scripts: comment-hygiene and dist-staleness checkers"
description: "The code-quality skill's standalone checkers plus the hook adapters and shared dispatch table that wire them into editor tool calls."
---

# Scripts

---

## 1. OVERVIEW

`scripts/` owns the `code-quality` skill's two standalone checkers (comment hygiene and dist staleness) and the two subfolders that turn them into per-edit warnings: `hooks/` (the Claude Code and Codex CLI PostToolUse adapters) and `lib/` (the shared runtime-neutral dispatch table both adapters call).

## 2. CONTENTS

| File / Folder | Purpose |
|------|---------|
| `check-comment-hygiene.sh` | Python script (kept as a `.sh` entrypoint) that scans one file's comment lines for ephemeral-artifact references such as packet/phase IDs, ADR/REQ/CHK IDs and spec paths, and exits 1 with the offending lines |
| `check-comment-hygiene.test.sh` | Bash test harness that runs the comment-hygiene checker against seeded fixture files covering both violation and allowed-pattern cases |
| `check-dist-staleness.sh` | Python script (kept as a `.sh` entrypoint) that checks whether a watched TypeScript package's compiled dist is stale, scoped to one edited file by default or every watched package with `--all` |
| `hooks/` | Claude Code and Codex CLI PostToolUse adapters, see `hooks/README.md` |
| `lib/` | Shared runtime-neutral dispatch table consumed by both hook adapters, see `lib/README.md` |

## 3. VALIDATION

Run from the repository root:

```bash
bash .opencode/skills/sk-code/code-quality/scripts/check-comment-hygiene.test.sh
```

Expected: `All comment hygiene test cases passed`.

## 4. RELATED

- [`code-quality SKILL.md`](../SKILL.md)
- [`code-quality README.md`](../README.md)
