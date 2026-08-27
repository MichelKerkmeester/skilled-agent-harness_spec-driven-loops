---
title: "Feature Specification: Objective Dispatch-Context Anchor for the deep/* Phase-0 Gate"
description: "Stop the deep/* Phase-0 dispatch-context gate from false-blocking capable orchestrators. GPT-5.6-Luna hard-stopped a real /deep:review invocation with 'DIRECT INVOCATION REQUIRED' because the gate asks the model to self-classify 'real invocation vs pasted-inline'. The real command runner already prepends an objective INVOCATION MESSAGE marker; the fix makes that prefix authoritatively resolve the gate (present = real invocation = PROCEED), so the model never has to guess."
trigger_phrases:
  - "phase 0 dispatch anchor deep review"
  - "DIRECT INVOCATION REQUIRED false block"
  - "ARGS_PRESENT dispatch-context authorization"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/022-phase0-dispatch-anchor"
    last_updated_at: "2026-08-27T05:20:00.000Z"
    last_updated_by: "claude"
    recent_action: "Anchored the deep/* dispatch-context gate in the injection prefix; verified render + both gates"
    next_safe_action: "Commit; push; then run the Grok review with a Luna orchestrator"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/render-command-contract.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The gate false-blocks because it relies on model self-classification; the injection prefix is an objective discriminator."
      - "Putting the authorization in the prefix (present only for real invocations) fixes it for all 4 injection commands and preserves the pasted-inline guard."
---
# Feature Specification: Objective Dispatch-Context Anchor for the deep/* Phase-0 Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-27 |
| **Source** | Cross-session smoke: GPT-5.6-Luna false-blocked a real `/deep:review` at Phase 0 |
| **Parent Spec** | ../spec.md |
| **Predecessor** | 021-containment-symlink-autoscope |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The deep/* commands (`review`, `research`, `ai-council`, `alignment`) open with a Phase-0 dispatch-context gate whose block reads "⛔ DIRECT INVOCATION REQUIRED — no review iteration executed". The gate asks the orchestrating model to self-classify whether it was invoked as the command or had the command's raw content pasted inline as ad hoc instructions. Capable orchestrators mis-answer this: GPT-5.6-Luna hard-stopped a genuine `/deep:review` invocation because it saw the command content in its own prompt and concluded "pasted inline" — the exact false-positive the gate's own note admits can happen. This makes headless `/deep:review` unreliable across capable models, blocking the loop before any iteration runs.

The command runner already prepends an objective marker to every real injection: `render-command-contract.cjs`'s `buildInvocationPrefix` emits an `<!-- INVOCATION MESSAGE -->` / `ARGS_PRESENT=true` block that a pasted-inline paste never carries. The gate simply did not use it.

### Purpose

Make the objective injection prefix authoritatively resolve the dispatch-context gate — its presence proves a real invocation, so the model is told to proceed rather than self-classify. This fixes the false-block for every injection command at once, without weakening the guard against genuine pasted-inline use.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

Two reinforcing layers, both keyed on the objective marker:

1. **Prefix authorization** — `buildInvocationPrefix` gives the real-invocation prefix (ARGS_PRESENT=true) an explicit DISPATCH-CONTEXT statement: the gate is satisfied, set `general_agent_verified = TRUE`, do not emit the block, there is no pasted-inline evidence.
2. **Body-gate override** — each of the 4 injected legacy bodies (`deep-{review,research,ai-council,alignment}.body.md`) gains an OBJECTIVE OVERRIDE ahead of the CHECK: resolve on a literal lookup of the `<!-- INVOCATION MESSAGE -->` marker; if present, PROCEED and do NOT run the fragile self-classification below. Seeing this file's own content is explicitly stated to NOT be evidence of pasting.
3. A regression test asserting the prefix authorization is present ahead of the body for a real invocation and absent for the no-message case.

### Out of Scope

- The 4 source command docs (`review.md` etc.) and their compiled `fix` contracts — the live rollout mode is `fallback`, so only the legacy bodies are injected. Syncing the source docs + recompiling is a documented follow-up for a future `fix`-mode flip.
- The 3 deep/* commands with no compiled contract / injection path (`model-benchmark`, `skill-benchmark`, `agent-improvement`) — they do not receive the prefix.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/render-command-contract.cjs` | Modify | `buildInvocationPrefix` adds the DISPATCH-CONTEXT authorization to the ARGS_PRESENT=true branch |
| `commands/deep/assets/legacy/deep-{review,research,ai-council,alignment}.body.md` | Modify | OBJECTIVE OVERRIDE ahead of the Phase-0 CHECK (marker lookup → PROCEED) |
| `tests/unit/render-command-contract.vitest.ts` | Modify | Regression: authorization present (real) / absent (pasted-inline) |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A real invocation carries the authorization ahead of the gate | The rendered prefix for ARGS_PRESENT=true contains the DISPATCH-CONTEXT authorization and precedes the command body. |
| REQ-002 | The pasted-inline guard is preserved | The no-message render (ARGS_PRESENT=false) does NOT carry the authorization, so the gate still guards a pasted-inline paste. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The gate body itself resolves on the marker | Each injected legacy body carries an OBJECTIVE OVERRIDE ahead of the CHECK that resolves on a literal marker lookup and skips the self-classification. |
| REQ-004 | The fix covers all injection commands | Both layers apply to `deep/review`, `deep/research`, `deep/ai-council`, `deep/alignment` (every command in the injection map). |
| REQ-005 | No contract drift / recompile | The compiled contracts are unaffected (the prefix is generated at render; the legacy bodies are not contract sources); `check-contract-drift` stays green. |
| REQ-006 | No whole-suite regression on either gate | The runtime vitest suite and `run-node-tests.mjs` show no new code-caused failures. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `render deep/review` shows the DISPATCH-CONTEXT authorization before the Phase-0 gate.
- **SC-002**: The no-message render omits the authorization.
- **SC-003**: Both gates clean; `check-contract-drift` green with no recompile.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A model ignores the prefix authorization and still runs the gate | The false-block could recur | The authorization is explicit and prepended first; the gate's own "default PROCEED, block only on concrete pasted-inline evidence" now has that evidence refuted. If a model still blocks, the body gate can be anchored too as a follow-up |
| Risk | Weakening the pasted-inline guard | A pasted-inline paste slips through | The authorization is emitted ONLY when a real invocation message is present, which a paste never has (tested) |
| Dependency | `render-command-contract.cjs` injection path | The prefix carrier | Verified: all 4 injection commands render through it |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether even two objective layers (prefix authorization + body-gate override) fully stop a stubborn orchestrator's block can only be confirmed by a live run. Both layers directly refute the specific misjudgment (concluding "pasted inline" from seeing the command content). If a capable model still hard-stops after being told, as a literal marker lookup, that it was invoked as the command, that is a model-compliance limit no doc change fully closes — the reliable path there is orchestrator choice (an orchestrator proven to pass Phase 0).
- Syncing the 4 source docs + their `fix` contracts is a follow-up, relevant only if the rollout flips from `fallback` to `fix`.

<!-- /ANCHOR:questions -->
