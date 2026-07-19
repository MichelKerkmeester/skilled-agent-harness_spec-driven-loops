---
title: "Skill Advisor Parity Tests"
description: "Vitest parity coverage that compares Python and TypeScript skill advisor routing decisions."
trigger_phrases:
  - "skill advisor parity tests"
  - "python ts parity tests"
---

# Skill Advisor Parity Tests

<!-- sk-doc-template: skill_readme -->

---

## 1. OVERVIEW

`tests/parity/` verifies that the TypeScript scorer preserves Python-correct routing decisions while tracking advisor quality gates.

Current state:

- Loads the labeled routing corpus from `scripts/routing-accuracy/labeled-prompts.jsonl`.
- Runs the Python scorer through `skill_advisor.py` and compares it with `scoreAdvisorPrompt()`.
- Checks corpus accuracy, abstention limits, false-fire limits and lexical lane ablation behavior.

---

## 2. DIRECTORY TREE

```text
parity/
+-- python-ts-parity.vitest.ts  # Python to TypeScript scorer parity gates
`-- README.md
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `python-ts-parity.vitest.ts` | Runs corpus parity checks, holdout accuracy checks and lexical ablation assertions. |

---

## 4. VALIDATION

Run from the repository root.

```bash
cd .opencode/skills/system-spec-kit/mcp-server && npx vitest run skill_advisor/tests/parity
```

Expected result: parity and ablation assertions pass.

---

## 5. RELATED

- [`../legacy/README.md`](../legacy/README.md)
- [`../python/README.md`](../python/README.md)
- [`../../README.md`](../../README.md)
