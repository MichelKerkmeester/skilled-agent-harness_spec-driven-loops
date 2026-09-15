---
title: "Scripts: drift-guard gate runner"
description: "Single entry point that runs all sk-code drift guards as one completion gate."
---

# Scripts

---

## 1. OVERVIEW

`scripts/` holds the one drift-guard entrypoint for the `code-opencode` mode. It runs the two live drift guards (alignment-drift, stack-folder) in sequence and exits non-zero if either fails, so a completion gate never has to remember separate commands. A third guard, the router-sync suite, was retired with its lane and has no replacement yet.

---

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `run-all-drift-guards.sh` | Runs `verify_alignment_drift.py --check-router` and `verify_stack_folders.py` in order, printing a PASS/FAIL line per guard; the retired router-sync guard is recorded as missing |

---

## 3. VALIDATION

Run from any working directory, the script resolves its own paths:

```bash
bash .opencode/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh
```

Expected: `run-all-drift-guards: all 3 guards PASSED` and exit code 0.

---

## 4. RELATED

- [`code-opencode SKILL.md`](../SKILL.md)
- [`code-opencode README.md`](../README.md)
