---
title: "Scripts: Deterministic Foundations Token Gates"
description: "Python checkers that give filled foundations token artifacts structural evidence gates for rhythm, contrast, and naming."
---

# Scripts: Deterministic Foundations Token Gates

---

## 1. OVERVIEW

`design-foundations/scripts/` owns three deterministic gates that validate filled token artifacts, plus a positive/negative fixture pair for the naming and doc gate. Each gate closes a spot where a token table or artifact could otherwise look compliant on inspection while failing its own contract.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `baseline_rhythm_check.py` | Checks the `assets/token-starter.md` spacing scale table: every spacing value must resolve to the declared baseline, a small sub-baseline fraction, or an explicit `exception` label. Fixed px/rem/em anchors inside a `clamp()` still must resolve, and fluid units are exempt. |
| `contrast_check.py` | WCAG contrast calculator for foreground/background hex pairs. Targets 4.5:1 for body text and 3:1 for large text or UI components, so a contrast-pair inventory row cannot claim a pass on eyeballed arithmetic. |
| `naming_doc_check.py` | Naming and required-heading gate for filled token, component, or library artifacts. Applies only to artifacts with a recognized `artifactKind`. Ordinary skill, reference, and vocabulary markdown exits cleanly as not applicable. |
| `fixtures/naming-doc/compliant.md` | A `token`-kind artifact that satisfies `naming_doc_check.py`, used as the positive example when validating the checker itself. |
| `fixtures/naming-doc/violating.md` | The matching negative example that `naming_doc_check.py` must reject. |

## 3. VALIDATION

Run from the repository root against a filled artifact.

```bash
python3 .opencode/skills/sk-design/design-foundations/scripts/baseline_rhythm_check.py <token-doc.md>
python3 .opencode/skills/sk-design/design-foundations/scripts/contrast_check.py "#787878" "#ffffff"
python3 .opencode/skills/sk-design/design-foundations/scripts/naming_doc_check.py <artifact.md>
```

Exit 0 means satisfied, exit 1 means a violation, exit 2 means a usage, read, or parse error. The table checkers accept `--json` for machine-readable output.

## 4. RELATED

- [`../SKILL.md`](../SKILL.md) - design-foundations mode, section 5 Scripts.
- [`../../shared/scripts/README.md`](../../shared/scripts/README.md) - shared checkers reused across sk-design modes, including the `md_table` row parser these scripts import.
