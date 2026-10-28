---
title: "comment_hygiene: the comment-hygiene checker's package"
description: "The Python package check-comment-hygiene.sh imports from its own real path: the CLI, the per-file check, the line scanner and its construct finders, the comment-family table and the rule names."
version: 1.0.0.0
---

# comment_hygiene

---

## 1. OVERVIEW

`comment_hygiene/` holds the work of `../../check-comment-hygiene.sh`, one module per concern. The entry puts this package's folder on `sys.path` from its own real path, so no install step is needed, and a checker copied without the package fails closed instead of checking nothing. The entry keeps the core violation table its callers read out of its text and hands that table to `cli.main()`, so the rules a caller sees in the entry are the rules the package applies.

The entry turns bytecode writing off before it imports the package, so a run inside a skill folder leaves no `__pycache__` folder here. A caller that imports the package directly should do the same, for example with `python3 -B`.

---

## 2. CONTENTS

```text
comment_hygiene/
+-- __init__.py
+-- checker.py
+-- cli.py
+-- constructs.py
+-- families.py
+-- rules.py
`-- scanner.py
```

| File | Purpose |
|------|---------|
| `__init__.py` | Lists the modules. It prints nothing of its own |
| `cli.py` | Reads the checker's arguments, checks every input file and prints one text line per finding or one `comment-hygiene/v1` document, then returns the exit code |
| `checker.py` | Checks one file and returns one record with its status, its language and its findings |
| `scanner.py` | Splits one source line into comment text, and carries a block comment, a string, an interpolation, an arithmetic construct or a heredoc across lines in `ScanState` |
| `constructs.py` | Finds where a string, a regex literal, an arithmetic construct, a heredoc body, a Rust char literal or a YAML block scalar opens and ends inside one line |
| `families.py` | Reads the comment-family table and names a file's language and comment family, from its shebang and then from its extension |
| `rules.py` | Names the rule a finding carries, holds the allow-list patterns and the URL span cut out before the violation patterns run, and refuses a disable value no run may switch off |

---

## 3. CONSUMERS

- `../../check-comment-hygiene.sh` imports `cli.py` and calls `main(argv, violation_patterns)`.
- `cli.py` imports `checker.py`, `families.py` and `rules.py`. `checker.py` imports `families.py`, `rules.py` and `scanner.py`, and `scanner.py` imports `constructs.py`.
- `../../tests/check-comment-hygiene.test.sh` covers the package end to end through the entry, and its missing-contract case imports `cli.py` directly with `python3 -B`.

---

## 4. RELATED

- [`Lib README`](../README.md)
- [`Scripts README`](../../README.md)
