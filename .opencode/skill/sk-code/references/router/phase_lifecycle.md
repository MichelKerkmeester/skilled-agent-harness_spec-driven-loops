---
title: Router Reference - Phase Lifecycle
description: Five-phase lifecycle for WEBFLOW and OPENCODE code surfaces.
---

# Router Reference - Phase Lifecycle

Both supported surfaces follow the same lifecycle. Surface detection changes which resources and verification evidence apply.

---

## 1. PHASE MAP

```text
Phase 0 Research (optional for simple work, required for complex/risky work)
    -> Phase 1 Implementation
    -> Phase 1.5 Code Quality Gate
    -> Phase 2 Debugging if checks fail
    -> Phase 3 Verification
    -> done only with evidence
```

---

## 2. WEBFLOW PHASES

| Phase | Resources / Evidence |
| --- | --- |
| Research | Webflow constraints, performance, browser/runtime context |
| Implementation | `references/webflow/implementation/*`, Webflow patterns/assets; add `references/motion_dev/` when Motion API or decision context is needed |
| Code Quality | Webflow code quality checklist and standards |
| Debugging | Webflow debugging resources plus browser console evidence |
| Verification | Minification scripts and browser checks at relevant desktop/mobile viewports |

---

## 3. OPENCODE PHASES

| Phase | Resources / Evidence |
| --- | --- |
| Research | Shared OpenCode patterns, affected skill/agent/command context, prior spec memory |
| Implementation | `references/opencode/shared/*` plus detected language references |
| Code Quality | Universal OpenCode checklist plus language checklist |
| Debugging | Root-cause analysis, failing command output, language-specific patterns |
| Verification | `verify_alignment_drift.py --root <changed-scope>` plus targeted tests/spec validation |

OPENCODE previously had standards-only behavior. In the merged `sk-code`, it receives the full lifecycle.

### Cross-Stack Motion.dev Resources

`motion_dev/` can be loaded during research, implementation, code quality, debugging, or verification when Motion-specific API, performance, snippet, or decision guidance is relevant. It does not change the selected surface; it gives the active surface a shared Motion reference package.

---

## 4. IRON LAWS

1. No completion claim without Phase 3 verification evidence.
2. No Phase 1 completion claim without Phase 1.5 quality gate.
3. No unsupported-stack claims; UNKNOWN surfaces require clarification or a new route plan.

---

## 5. TRANSITIONS

- 0 -> 1: enough context and plan exists.
- 1 -> 1.5: code written or modified.
- 1.5 -> 2: P0 quality issue or failing check found.
- 2 -> 1.5: fix applied.
- 1.5 -> 3: P0 items pass.
- 3 -> 1/2: verification flags a problem.
- 3 -> done: verification evidence is recorded.
