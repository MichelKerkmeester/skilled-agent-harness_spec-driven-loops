---
title: "Level 3 Templates [template:level_3/README.md]"
description: "Architecture-oriented templates for large or high-risk implementation work."
trigger_phrases:
  - "level 3"
  - "architecture"
  - "decision record"
contextType: "general"
---
# Level 3 Templates

Use when implementation needs explicit architecture and risk management.

## 1. OVERVIEW

- Typical size is 500+ LOC.
- Architecture decisions need durable records.
- Risk, dependencies, and stakeholder alignment are central.

Use Level 3+ if governance and formal approvals are required.

---

## 2. REQUIRED FILES

- `spec.md`
- `plan.md`
- `tasks.md`
- `checklist.md`
- `decision-record.md`
- `implementation-summary.md`

---

## 3. LEVEL 3 ADDITIONS

- Architecture-focused sections in spec and plan templates.
- Risk/dependency/critical-path detail for execution control.
- `decision-record.md` for major technical decisions.

---

## 4. QUICK START

```bash
mkdir -p specs/###-feature-name
cp .opencode/skills/system-spec-kit/templates/level_3/*.md specs/###-feature-name/
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/###-feature-name/
```

---

## 5. WORKFLOW NOTES

- Keep `decision-record.md` updated as decisions are made.
- Keep checklist evidence current before completion claims.
- Finalize `implementation-summary.md` at the end of delivery.

---

## 6. PHASE DECOMPOSITION

Phase decomposition is recommended for Level 3 tasks exceeding 500 LOC across multiple subsystems. Breaking large architectural work into ordered phases improves delivery control and risk management. Use Gate 3 Option E to target a specific phase child and `/speckit:phase` to create the phase structure.

See the Phase System in the [main templates README](../README.md#phase-system) for full details.

---

## 7. RELATED

- `../../../skill/system-spec-kit/templates/level_2/README.md`
- `../../../skill/system-spec-kit/templates/level_3+/README.md`
- `../../../skill/system-spec-kit/templates/addendum/level3-arch/`
- `../../../skill/system-spec-kit/templates/README.md`

