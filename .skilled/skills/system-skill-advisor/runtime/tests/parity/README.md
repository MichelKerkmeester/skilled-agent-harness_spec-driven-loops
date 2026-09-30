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
+-- score-jev-tiebreak.vitest.ts  # Offline tie-break eval checks with stub binaries and a fake Deem server
+-- score-suggested-order.vitest.ts  # Offline suggested-order eval checks with stub binaries and stub timed children
`-- README.md
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `python-ts-parity.vitest.ts` | Runs corpus parity checks, holdout accuracy checks and lexical ablation assertions. |
| `score-jev-tiebreak.vitest.ts` | Pins the tie-break eval's census, keep rule, gates, exit handling, calibration and report with stub `jev` and `cli-deem` binaries and a fake Deem server. It makes no model call. |
| `score-suggested-order.vitest.ts` | Pins the suggested-order eval's helpers, keep rule, timed child, headroom stops, gates, both arms and report with synthetic rows, stub `jev` and `cli-deem` binaries and stub children. It makes no model call. |

---

## 4. VALIDATION

Run from the repository root.

```bash
cd .skilled/skills/system-spec-kit/runtime && npx vitest run skill_advisor/tests/parity
```

Expected result: parity and ablation assertions pass.

---

## 5. RELATED

- [`../legacy/README.md`](../legacy/README.md)
- [`../python/README.md`](../python/README.md)
- [`../../README.md`](../../README.md)
