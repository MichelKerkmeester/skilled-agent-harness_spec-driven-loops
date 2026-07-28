---
title: "Scripts: Deterministic Foundations Token Gates"
description: "Python checkers that give filled foundations token artifacts structural evidence gates for rhythm, contrast, and naming."
---

# Scripts: Deterministic Foundations Token Gates

---

## 1. OVERVIEW

`sk-design-interface/scripts/` owns three deterministic gates that validate filled token artifacts, plus a positive/negative fixture pair for the naming and doc gate. Each gate closes a spot where a token table or artifact could otherwise look compliant on inspection while failing its own contract.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `baseline_rhythm_check.py` | Checks the `assets/foundations/token-starter.md` spacing scale table: every spacing value must resolve to the declared baseline, a small sub-baseline fraction, or an explicit `exception` label. Fixed px/rem/em anchors inside a `clamp()` still must resolve, and fluid units are exempt. |
| `contrast_check.py` | WCAG contrast calculator for foreground/background hex pairs. Targets 4.5:1 for body text and 3:1 for large text or UI components, so a contrast-pair inventory row cannot claim a pass on eyeballed arithmetic. |
| `naming_doc_check.py` | Naming and required-heading gate for filled token, component, or library artifacts. Applies only to artifacts with a recognized `artifactKind`. Ordinary skill, reference, and vocabulary markdown exits cleanly as not applicable. |
| `fixtures/naming-doc/compliant.md` | A `token`-kind artifact that satisfies `naming_doc_check.py`, used as the positive example when validating the checker itself. |
| `fixtures/naming-doc/violating.md` | The matching negative example that `naming_doc_check.py` must reject. |
| `tests/` | Pytest suite covering all three gates. See section 4. |

## 3. VALIDATION

Run from the repository root against a filled artifact.

```bash
python3 .opencode/skills/sk-design/sk-design-interface/scripts/baseline_rhythm_check.py <token-doc.md>
python3 .opencode/skills/sk-design/sk-design-interface/scripts/contrast_check.py "#787878" "#ffffff"
python3 .opencode/skills/sk-design/sk-design-interface/scripts/naming_doc_check.py <artifact.md>
```

Exit 0 means satisfied, exit 1 means a violation, exit 2 means a usage, read, or parse error. The table checkers accept `--json` for machine-readable output.

## 4. TESTS

```bash
python3 -m pytest .opencode/skills/sk-design/sk-design-interface/scripts/tests/ -q
```

46 tests, no network, no fixtures beyond the two checked-in `fixtures/naming-doc/` files. One file per checker, matching the `test_[script_name].py` convention.

**Why these tests exist, and why they are the shape they are.** `naming_doc_check.py` and `baseline_rhythm_check.py` both import `md_table` from `../../shared/scripts` through a hand-built `sys.path` entry. A wrong parent-count in that path makes every invocation die with `ModuleNotFoundError` before any logic runs — and that defect shipped, surviving undetected from `b217d74b81` until it was found by hand and fixed in `140fdab23d9f`. It survived because nothing ever executed the scripts. So each checker's suite leads with a subprocess smoke test run from an unrelated working directory, which is the only shape that exercises the real path math; importing the module in-process would not have caught it. The remaining tests pin the arithmetic and CLI exit contract (`0` satisfied, `1` violation, `2` usage/read error) that callers gate on, and finally run the two `fixtures/naming-doc/` files that this README already described as the checker's own positive and negative examples but that nothing had ever executed automatically.

**Scoped exception to the ≥80%-coverage rule.** `create-skill/assets/skill/skill-reference-template.md` §8 requires a `tests/` directory whenever `scripts/` exists, with ≥80% line coverage. This suite deliberately targets the regression-prone surface — the shared-import path, the WCAG arithmetic, the baseline-resolution rules, and the exit codes — rather than chasing a coverage percentage through the presentation helpers (`_print_text` and the table-formatting branches of each `main`). Those are display-only and would need brittle stdout assertions to cover. Coverage is not measured or enforced here; no checker in the repo enforces the rule (verified against `parent-skill-check.cjs` and `package_skill.py`), and every other `sk-design` `scripts/` directory has no tests at all. If a coverage gate is ever wired up repo-wide, this is the known deviation.

## 5. RELATED

- [`../SKILL.md`](../SKILL.md) - design-interface mode doctrine.
- [`../../shared/scripts/README.md`](../../shared/scripts/README.md) - shared checkers reused across sk-design modes, including the `md_table` row parser these scripts import.
