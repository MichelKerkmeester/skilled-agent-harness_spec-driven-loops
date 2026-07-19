---
title: "Skill Advisor Python Tests"
description: "Direct Python coverage for skill advisor scripts and regression helpers."
trigger_phrases:
  - "skill advisor python tests"
  - "test_skill_advisor.py"
---

# Skill Advisor Python Tests

<!-- sk-doc-template: skill_readme -->

---

## 1. OVERVIEW

`tests/python/` runs direct script-level coverage for the Python skill advisor implementation and helper scripts.

Current state:

- Loads Python modules from `skill_advisor/scripts/` by file path.
- Exercises `analyze_prompt`, `analyze_batch`, `health_check`, `get_skills` and helper modules.
- Reports pass and fail counts through a standalone Python test harness.

---

## 2. DIRECTORY TREE

```text
python/
+-- test_skill_advisor.py  # Direct Python script coverage
`-- README.md
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `test_skill_advisor.py` | Loads advisor Python scripts and validates core functions, health states, regression metrics and JSONL helpers. |

---

## 4. VALIDATION

Run from the repository root.

```bash
python3 .opencode/skills/system-skill-advisor/mcp-server/tests/python/test_skill_advisor.py
```

Expected result: the harness exits 0 and prints passing checks.

---

## 5. RELATED

- [`../compat/README.md`](../compat/README.md)
- [`../parity/README.md`](../parity/README.md)
- [`../../README.md`](../../README.md)
