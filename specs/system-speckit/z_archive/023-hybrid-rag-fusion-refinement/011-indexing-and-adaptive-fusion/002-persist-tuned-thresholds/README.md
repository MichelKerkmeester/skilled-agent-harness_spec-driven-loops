---
title: "Level 1 Templates [template:level_1/README.md]"
description: "Baseline documentation templates for low-risk, small-scope changes."
trigger_phrases:
  - "level 1"
  - "small change"
  - "baseline docs"
importance_tier: "normal"
contextType: "general"
---
# Level 1 Templates

Use for simple work where full verification/governance overhead is unnecessary.

## 1. OVERVIEW

- Typical size is under 100 LOC.
- Scope is clear and low risk.
- No architecture decision record needed.

Move to Level 2 when verification checklist tracking is required.

---

## 2. REQUIRED FILES

- `spec.md`
- `plan.md`
- `tasks.md`
- `implementation-summary.md` (required output, finalized after implementation)

---

## 3. QUICK START

```bash
mkdir -p specs/###-short-name
cp .opencode/skills/system-spec-kit/templates/level_1/spec.md specs/###-short-name/
cp .opencode/skills/system-spec-kit/templates/level_1/plan.md specs/###-short-name/
cp .opencode/skills/system-spec-kit/templates/level_1/tasks.md specs/###-short-name/
```

At completion, add and fill:

```bash
cp .opencode/skills/system-spec-kit/templates/level_1/implementation-summary.md specs/###-short-name/
```

---

## 4. PHASE DECOMPOSITION

Phase decomposition is typically not needed at Level 1. Most Level 1 tasks are small enough to complete in a single pass without phased ordering.

If a task unexpectedly grows beyond Level 1 scope, consider escalating to Level 2+ with phase decomposition rather than splitting a Level 1 spec. See the Phase System in the [main templates README](../README.md#phase-system).

---

## 5. RELATED

- `.opencode/skills/system-spec-kit/templates/level_2/README.md`
- `.opencode/skills/system-spec-kit/references/templates/level_specifications.md`
- `.opencode/skills/system-spec-kit/references/validation/validation_rules.md`

