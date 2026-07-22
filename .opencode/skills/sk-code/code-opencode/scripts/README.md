---
title: "Scripts: drift-guard gate runner"
description: "Single entry point that runs all sk-code drift guards as one completion gate."
---

# Scripts

---

## 1. OVERVIEW

`scripts/` holds the one drift-guard entrypoint for the `code-opencode` mode. sk-code's three drift guards (alignment-drift, stack-folder, router-sync) were runnable only one at a time before this script. It runs all three in sequence and exits non-zero if any one fails, so a completion gate never has to remember three separate commands.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `run-all-drift-guards.sh` | Runs `verify_alignment_drift.py --check-router`, `verify_stack_folders.py` and the `sk-code-router-sync.vitest.ts` suite in order, printing a PASS/FAIL line per guard |

## 3. VALIDATION

Run from any working directory, the script resolves its own paths:

```bash
bash .opencode/skills/sk-code/code-opencode/scripts/run-all-drift-guards.sh
```

Expected: `run-all-drift-guards: all 3 guards PASSED` and exit code 0.

## 4. RELATED

- [`code-opencode SKILL.md`](../SKILL.md)
- [`code-opencode README.md`](../README.md)
