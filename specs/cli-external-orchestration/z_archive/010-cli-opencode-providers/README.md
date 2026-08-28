---
title: "Level 1 Templates [template:level_1/README.md]"
description: "Baseline documentation templates for low-risk, small-scope changes."
trigger_phrases:
  - "level 1"
  - "small change"
  - "baseline docs"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "000-feature-name"
    last_updated_at: "2026-04-11T00:00:00Z"
    last_updated_by: "template-author"
    recent_action: "Initialize continuity block"
    next_safe_action: "Replace template defaults on first save"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
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

## 3. OPTIONAL FILES

- `resource-map.md` - lean, scannable catalog of every path analyzed, created, updated, or removed (copy from `../resource-map.md`).

---

## 4. QUICK START

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

Resume follow-up work through `/speckit:resume`, which rebuilds packet continuity from `handover.md -> _memory.continuity -> spec docs`. Save continuity with `/memory:save`, which routes updates into canonical packet docs such as `implementation-summary.md` and `handover.md`.

---

## 5. PHASE DECOMPOSITION

Phase decomposition is typically not needed at Level 1. Most Level 1 tasks are small enough to complete in a single pass without phased ordering.

If a task unexpectedly grows beyond Level 1 scope, consider escalating to Level 2+ with phase decomposition rather than splitting a Level 1 spec. See the Phase System in the [main templates README](../README.md#phase-system).

---

## 6. RELATED

- `../level_2/README.md`
- `../../references/templates/level_specifications.md`
- `../../references/validation/validation_rules.md`

