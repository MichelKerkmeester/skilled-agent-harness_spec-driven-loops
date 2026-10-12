---
title: Phase Detection and Lifecycle
description: Phase 1/2/3 development lifecycle (Implementation / Testing+Debugging / Verification) with per-surface resource expectations.
trigger_phrases:
  - "sk-code phase lifecycle"
  - "phase detection routing"
  - "implementation testing verification phases"
  - "per surface phase map"
importance_tier: normal
contextType: general
version: 1.5.0.9
---

# Router Reference - Phase Lifecycle

All three surfaces in the hub `SKILL.md` surface list (WEBFLOW, OPENCODE and OBSIDIAN) follow the same lifecycle. Surface detection changes which resources and verification evidence apply.

---

## 1. OVERVIEW

### Purpose

Define the shared execution lifecycle for supported code surfaces so research, implementation, quality, debugging, and verification happen in the expected order.

### When to Use

- When planning work on the WEBFLOW, OPENCODE or OBSIDIAN surface.
- When deciding which phase-specific references and checklists to load.
- When a failed quality or verification gate requires a controlled transition back to debugging or implementation.
- When checking whether completion evidence is sufficient.

### Core Principle

Phase lifecycle defines the gated progression from research through verification with quality gates between stages.

### Key Sources

- [stack-detection.md](./stack-detection.md) — surface detection and OPENCODE language sub-detection
- [ROUTER.md](../../ROUTER.md) — intent classification and resource maps

---

## 2. PHASE MAP

```text
Phase 0 Research (optional for simple work, required for complex/risky work)
    -> Phase 1 Implementation
    -> Phase 1.5 Code Quality Gate
    -> Phase 2 Debugging if checks fail
    -> Phase 3 Verification
    -> done only with evidence
```

---

## 3. WEBFLOW PHASES

| Phase | Resources / Evidence |
| --- | --- |
| Research | Webflow constraints, performance, browser/runtime context |
| Implementation | `.skilled/skills/sk-code/sk-code-webflow/references/implementation/`, Webflow patterns/assets; add `.skilled/skills/sk-code/sk-code-webflow/references/animation/` when Motion API or decision context is needed |
| Code Quality | Webflow code quality checklist and standards |
| Debugging | Webflow debugging resources plus browser console evidence |
| Verification | Minification scripts and browser checks at relevant desktop/mobile viewports |

---

## 4. OPENCODE PHASES

| Phase | Resources / Evidence |
| --- | --- |
| Research | Shared OpenCode patterns, affected skill/agent/command context, prior spec memory |
| Implementation | `.skilled/skills/sk-code/sk-code-opencode/references/shared/` plus detected language references |
| Code Quality | Universal OpenCode checklist plus language checklist |
| Debugging | Root-cause analysis, failing command output, language-specific patterns |
| Verification | `bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh`, the three-guard umbrella, plus targeted tests/spec validation |

OPENCODE previously had standards-only behavior. In the merged `sk-code`, it receives the full lifecycle.

### Cross-Stack Motion.dev Resources

The Motion.dev overlay (`.skilled/skills/sk-code/sk-code-webflow/references/animation/`) can be loaded during research, implementation, code quality, debugging, or verification when Motion-specific API, performance, snippet, or decision guidance is relevant. It does not change the selected surface; it gives the active surface a shared Motion reference package.

---

## 5. OBSIDIAN PHASES

| Phase | Resources / Evidence |
| --- | --- |
| Research | The read-only `sk-code-obsidian` evidence packet: plugin API, data layer and view-renderer references |
| Implementation | `.skilled/skills/sk-code/sk-code-obsidian/references/standards/code-standards.md` plus the class-naming and stylesheet-ownership references |
| Code Quality | `.skilled/skills/sk-code/sk-code-obsidian/references/standards/code-standards.md` and the recorded lint baseline |
| Debugging | Failing vitest or build output, screenshot diffs and root-cause analysis |
| Verification | The gate command set in `.skilled/skills/sk-code/sk-code-obsidian/references/verification.md`, run in the plugin repository |

The Obsidian surface is read-only evidence. The bundled workflow mode runs these phases, and the gate commands run in the plugin repository, not in this hub.

---

## 6. IRON LAWS

1. No completion claim without Phase 3 verification evidence.
2. No Phase 1 completion claim without Phase 1.5 quality gate.
3. No unsupported-stack claims; UNKNOWN surfaces require clarification or a new route plan.

---

## 7. TRANSITIONS

- 0 -> 1: enough context and plan exists, and — for implementation intent — the laziest viable rung of the Design Restraint Ladder (see universal code quality standards) has been selected.
- 1 -> 1.5: code written or modified.
- 1.5 -> 2: P0 quality issue or failing check found.
- 2 -> 1.5: fix applied.
- 1.5 -> 3: P0 items pass.
- 3 -> 1/2: verification flags a problem.
- 3 -> done: verification evidence is recorded.

---

## 8. RELATED RESOURCES

- [stack-detection.md](./stack-detection.md) — surface detection and OPENCODE language sub-detection
- [ROUTER.md](../../ROUTER.md) — intent classification, resource maps, and load tiers
