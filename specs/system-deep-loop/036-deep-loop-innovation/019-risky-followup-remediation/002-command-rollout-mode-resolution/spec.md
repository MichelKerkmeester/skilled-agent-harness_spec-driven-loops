---
title: "Feature Specification: Command Rollout-Mode Resolution"
description: "Resolve the render-command-contract + check-contract-drift failures: the deep/review, deep/research, deep/ai-council compiled contracts are stale, but recompiling them (the sanctioned fix) silently flips deep/review's rollout mode fix->fallback, breaking resolveMode. Decide the intended default mode, make the tests and config agree, then recompile."
trigger_phrases:
  - "command rollout mode resolution"
  - "stale source digest deep review"
  - "resolveMode fix fallback"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/019-risky-followup-remediation/002-command-rollout-mode-resolution"
    last_updated_at: "2026-08-26T11:05:01.338Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded the rollout-mode child"
    next_safe_action: "Phase 1: determine the intended default rollout mode for deep/*"
    blockers: []
    key_files:
      - "plan.md"
    completion_pct: 0
    open_questions:
      - "Is the intended default rollout mode for deep/review 'fix' or 'fallback'?"
    answered_questions: []
---
# Feature Specification: Command Rollout-Mode Resolution

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-08-26 |
| **Failing tests** | `render-command-contract.vitest.ts`, `check-contract-drift.vitest.ts` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | 001-dependency-and-node-abi-alignment |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The compiled command contracts for `deep/review`, `deep/research`, and `deep/ai-council` are stale — their source digest no longer matches the compiled artifact (`STALE_SOURCE_DIGEST`), so `check-contract-drift` and `render-command-contract` fail. The sanctioned fix is `compile-command-contracts.cjs --command <c> --write`. But running it silently changes `deep/review`'s rollout mode from `fix` to `fallback`, which then fails a different assertion (`resolveMode('deep/review')` expects `fix`). Rollout mode is not cosmetic: it decides which body the command renders at runtime (the compiled `fix` contract vs the `fallback` legacy body). So the recompile both fixes the staleness AND changes real command behavior, and it is not yet known whether `fix` or `fallback` is the intended default.

### Purpose

Determine the intended default rollout mode for the deep commands, make the compiler/config and the `resolveMode` test agree on it, and then recompile the contracts so the staleness clears without an unintended behavior change.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Trace `resolveMode` in `scripts/render-command-contract.cjs` and what sets `fix` vs `fallback`.
- Determine, from the rollout config + git history + the renderer's intent, the correct default mode for `deep/review` / `deep/research` / `deep/ai-council`.
- Make the tests and the config/compiler agree (fix the compiler/config if `fix` is intended; update the stale test if `fallback` is intended).
- Recompile the deep/* contracts and clear the staleness.

### Out of Scope

- The dependency/Node-ABI failure (child 001).
- Redesigning the rollout-mode mechanism — only setting the correct default and removing the drift.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/render-command-contract.cjs` or its config | Modify (conditional) | Correct the default rollout mode if `fix` is intended |
| `tests/unit/render-command-contract.vitest.ts` | Modify (conditional) | Update the `resolveMode` expectation if `fallback` is intended |
| `commands/deep/assets/compiled/deep-*.contract.md` | Modify | Recompiled contracts (via the sanctioned tool) |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The intended default rollout mode is decided with evidence | A `decision` note names `fix` or `fallback` and the source of truth. |
| REQ-002 | No unintended runtime behavior change | The recompiled `deep/review` renders the same body the intended mode dictates; behavior change (if any) is explicit and approved. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The stale contracts are cleared | `check-contract-drift` passes; no `STALE_SOURCE_DIGEST`. |
| REQ-004 | Tests and config agree | `render-command-contract` passes; `resolveMode('deep/review')` matches the decided mode. |
| REQ-005 | The change is scoped to contracts + one config/test | The scoped diff is the recompiled `deep-*.contract.md` plus one config or test edit; no unrelated code. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `render-command-contract.vitest.ts` and `check-contract-drift.vitest.ts` pass.
- **SC-002**: `resolveMode` and the compiled contracts agree on the decided mode.
- **SC-003**: Whole-suite delta vs the 017 baseline shows no new failures.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Recompiling changes command behavior | deep/review renders differently at runtime | Decide the intended mode FIRST; only then recompile |
| Risk | The stale source is another skill's edit | The drift is not ours to define | Confirm the source doc's current content is the intended one before recompiling |
| Dependency | `compile-command-contracts.cjs` | The recompile tool | Verified present |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- `fix` vs `fallback` default — resolved in Phase 1 from the rollout config and the renderer's documented intent.

<!-- /ANCHOR:questions -->
