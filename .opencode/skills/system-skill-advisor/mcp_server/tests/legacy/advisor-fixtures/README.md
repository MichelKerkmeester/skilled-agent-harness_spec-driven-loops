---
title: "Skill Advisor Legacy Fixtures"
description: "JSON scenario fixtures used by legacy advisor tests for prompt policy, stale routing, fail-open and adversarial labels."
trigger_phrases:
  - "advisor fixtures"
  - "legacy advisor fixtures"
  - "skill advisor json fixtures"
---

# Skill Advisor Legacy Fixtures

<!-- sk-doc-template: code_folder_readme -->

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. OWNERSHIP](#2--ownership)
- [3. KEY FILES](#3--key-files)
- [4. BOUNDARIES](#4--boundaries)
- [5. ENTRYPOINTS](#5--entrypoints)
- [6. VALIDATION](#6--validation)
- [7. RELATED](#7--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:1-overview -->
## 1. OVERVIEW

`tests/legacy/advisor-fixtures/` stores small JSON scenarios consumed by legacy advisor regression suites. The fixtures capture routing states and prompt-policy edge cases without hard-coding large inline objects in tests.

<!-- /ANCHOR:1-overview -->

---

<!-- ANCHOR:2-ownership -->
## 2. OWNERSHIP

| Surface | Owner | Notes |
|---|---|---|
| Fixture JSON | Skill advisor tests | Stable inputs for legacy suites. |
| Expected behavior | Test files | Assertions live in the consuming tests. |
| Runtime logs | None | Do not put generated output in this folder. |

<!-- /ANCHOR:2-ownership -->

---

<!-- ANCHOR:3-key-files -->
## 3. KEY FILES

| Fixture | Scenario |
|---|---|
| `livePassingSkill.json` | Live advisor state with a passing skill recommendation. |
| `staleHighConfidenceSkill.json` | Stale freshness with high-confidence routing. |
| `ambiguousTopTwo.json` | Near-tie top-two recommendation handling. |
| `noPassingSkill.json` | Abstain path when no skill passes thresholds. |
| `failOpenTimeout.json` | Fail-open timeout behavior. |
| `promptPoisoningAdversarial.json` | Prompt-safety and adversarial label handling. |
| `skipPolicy*.json` and `skippedShortCasual.json` | Policy-driven skip cases. |
| `unicodeInstructionalSkillLabel.json` | Unicode and instruction-shaped label hardening. |

<!-- /ANCHOR:3-key-files -->

---

<!-- ANCHOR:4-boundaries -->
## 4. BOUNDARIES

- Keep fixtures small, static and hand-reviewable.
- Do not store captured runtime telemetry, SQLite files or generated reports here.
- Update consuming tests when fixture shape changes.

<!-- /ANCHOR:4-boundaries -->

---

<!-- ANCHOR:5-entrypoints -->
## 5. ENTRYPOINTS

Legacy Vitest suites in `tests/legacy/` load these JSON files directly.

<!-- /ANCHOR:5-entrypoints -->

---

<!-- ANCHOR:6-validation -->
## 6. VALIDATION

Run from the repository root.

```bash
npm --prefix .opencode/skills/system-skill-advisor/mcp_server run test -- tests/legacy
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-skill-advisor/mcp_server/tests/legacy/advisor-fixtures/README.md
```

<!-- /ANCHOR:6-validation -->

---

<!-- ANCHOR:7-related -->
## 7. RELATED

- [`../README.md`](../README.md)
- [`../../README.md`](../../README.md)

<!-- /ANCHOR:7-related -->
