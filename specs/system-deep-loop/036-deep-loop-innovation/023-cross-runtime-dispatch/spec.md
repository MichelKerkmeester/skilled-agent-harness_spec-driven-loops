---
title: "Feature Specification: Retire the deep/* Dispatch-Context (Phase-0) Gate"
description: "Retire the in-prompt Phase-0 dispatch-context self-classification gate across all deep/* commands. Capable orchestrators (GPT-5.6-Luna) hard-block a genuine /deep:review with 'DIRECT INVOCATION REQUIRED' because the gate asks the model to classify unobservable provenance (real invocation vs pasted-inline). The gate is unfixable in-prompt, defends a case that occurs in zero code, and is redundant with the deterministic harness guard. Removing it makes the false-block disappear structurally for every runtime and model."
trigger_phrases:
  - "phase 0 gate retire deep loop"
  - "DIRECT INVOCATION REQUIRED false block"
  - "dispatch-context self-classification gate removal"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/023-cross-runtime-dispatch"
    last_updated_at: "2026-08-27T07:25:00.000Z"
    last_updated_by: "claude"
    recent_action: "Removed the Phase-0 gate from all deep/* commands; reverted 022; recompiled contracts"
    next_safe_action: "Commit; push v4 + main; then the executor-routing fix"
    blockers: []
    key_files:
      - ".opencode/commands/deep/review.md"
      - ".opencode/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs"
      - ".opencode/plugins/system-deep-loop-guard.js"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The gate cannot be made reliable in-prompt: it asks the model to classify provenance that is unobservable, and for codex/pi the genuine path is byte-identical to a pasted-inline paste."
      - "Removing it is safe: no auto-YAML or executable code consumes general_agent_verified / dispatch_context_verified, and the harness guard (system-deep-loop-guard.js) still protects the real case deterministically."
---
# Feature Specification: Retire the deep/* Dispatch-Context (Phase-0) Gate

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
| **Source** | Cross-session smoke: GPT-5.6-Luna false-blocked a real `/deep:review` at Phase 0; Opus 5 architect design recommends retiring the gate |
| **Parent Spec** | ../spec.md |
| **Predecessor** | 022-phase0-dispatch-anchor |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Every deep/* command (`review`, `research`, `ai-council`, `alignment`, `agent-improvement`, `model-benchmark`, `skill-benchmark`, `command-benchmark`) and `prompt/improve` opened with a Phase-0 dispatch-context gate. The gate asks the orchestrating model to self-classify whether it was invoked as the command or had the command's raw content pasted inline as ad hoc instructions, and to hard-block with "⛔ DIRECT INVOCATION REQUIRED" on the pasted-inline case.

This is unfixable in-prompt. The classification is of provenance the model cannot observe from inside its own prompt. For the codex and pi runtimes the genuine invocation path is byte-identical to a pasted-inline paste (both arrive as command text the model reads), so no prompt wording can discriminate them. Capable orchestrators answer inconsistently: GPT-5.6-Luna concluded "pasted inline" from seeing the command content and hard-stopped a genuine `/deep:review` before any iteration ran. Packet 022 tried to anchor the gate on an objective marker, but that layer proved dormant (the render-injection path it patched is not wired into the live opencode dispatch) and, even where reached, still depended on model compliance.

The gate is also unnecessary and redundant:
- **Unnecessary** — the pasted-inline scenario it guards against occurs in zero code paths; every real dispatch injects the command doc through the runtime.
- **Redundant** — the real protection is the harness guard (`.opencode/plugins/system-deep-loop-guard.js` + `.opencode/hooks/task-dispatch/lib/dispatch-guard.cjs:isCommandDrivenIteration`), which validates dispatch against on-disk config in the plugin host. That check is deterministic and involves no model compliance.

### Purpose

Retire the in-prompt Phase-0 self-classification gate everywhere it exists. With no self-classification step left, the genuine-invocation false-block disappears structurally, for every runtime and every model. The deterministic harness guard continues to protect the genuine dispatch-integrity case.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

1. Remove the `### PHASE 0: DISPATCH-CONTEXT CHECK` block from all 8 deep/* command docs, `prompt/improve.md`, and the 4 injected legacy bodies.
2. Trim the ROUTER-CONTRACT prose that references the check (the "must pass the dispatch-context check" clauses, the Gate 1/Gate 2 sentences, the numbered "Run Phase 0" FIRST-ACTION items with renumbering).
3. Remove the gate's now-orphaned setup-contract residue: `general_agent_verified` / `dispatch_context_verified` from YAML-START-CONDITION lists, input-table rows, and Phase-Output lists; and the two `prompt_improve` workflow-YAML steps that told the agent to confirm the removed check.
4. Revert the dormant 022 render layer: the DISPATCH-CONTEXT authorization in `render-command-contract.cjs` and its regression test.
5. Recompile the 4 injection-command contracts so their embedded source digests match the edited docs.

### Out of Scope

- The `create/*` command family's Phase-0 `@markdown` agent verification — a separate, unrelated gate that checks agent availability, not dispatch provenance.
- `doctor/*` and `speckit/*` workflow "Phase 0" labels — unrelated workflow-phase names.
- The executor-kind routing gap in the single-executor auto-YAML path (cli-cursor/cli-devin/cli-pi have no branch) — a distinct runtime-dispatch concern tracked separately.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `commands/deep/{review,research,ai-council,alignment,agent-improvement,model-benchmark,skill-benchmark,command-benchmark}.md` | Modify | Remove the Phase-0 block + trim gate-referencing prose |
| `commands/prompt/improve.md` | Modify | Remove the Phase-0 block + drop dispatch-context ownership clause + input-table row |
| `commands/deep/assets/legacy/deep-{review,research,ai-council,alignment}.body.md` | Modify | Remove the Phase-0 block + trim gate-referencing prose |
| `commands/deep/assets/deep-{agent-improvement,model-benchmark,skill-benchmark,command-benchmark}-presentation.txt` | Modify | Drop the gate's Phase-Output bullet / display reference |
| `commands/prompt/assets/prompt_improve_{auto,confirm}.yaml` | Modify | Drop the "confirm the PHASE 0 dispatch-context check" workflow step |
| `commands/deep/assets/legacy/README.md` | Modify | Drop "Dispatch-context checks" from the legacy-bodies responsibility list |
| `runtime/scripts/render-command-contract.cjs` | Modify | Revert the dormant 022 DISPATCH-CONTEXT authorization |
| `runtime/tests/unit/render-command-contract.vitest.ts` | Modify | Revert the 022 authorization regression test |
| `commands/deep/assets/compiled/deep-{review,research,ai-council,alignment}.contract.md` | Regenerate | Recompile so embedded source digests match |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The Phase-0 gate is gone from every command surface | No `general_agent_verified`, `dispatch_context_verified`, `PHASE 0: DISPATCH-CONTEXT`, or `DIRECT INVOCATION REQUIRED` remains under `.opencode/commands/deep/` or `.opencode/commands/prompt/`. |
| REQ-002 | No executable consumer is broken | No auto/confirm YAML branches on the removed variables; verified 0 references in `commands/deep/assets/*.yaml`. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Each command still opens cleanly | Every deep/* command retains `## 1. ROUTER CONTRACT` → `### MANDATORY INPUT GATE` with coherent renumbered FIRST-ACTION lists. |
| REQ-004 | The dormant 022 render layer is reverted | `render-command-contract.cjs` no longer emits DISPATCH-CONTEXT / general_agent_verified; its test no longer asserts them. |
| REQ-005 | Compiled contracts are fresh | The 4 compiled contracts are recompiled; `check-contract-drift` is green and `render-command-contract` passes. |
| REQ-006 | No whole-suite regression | The runtime vitest suite and `run-node-tests.mjs` show no new code-caused failures vs baseline. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A grep for the gate markers under `commands/deep/` + `commands/prompt/` returns clean (the create/* @markdown Phase-0 is a different gate and is out of scope).
- **SC-002**: `render-command-contract.vitest.ts` + `check-contract-drift.vitest.ts` pass (24/24).
- **SC-003**: Both whole-suite gates show no new failures vs baseline.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Removing the in-prompt gate weakens dispatch-integrity protection | A genuinely mis-dispatched loop-executor worker could proceed | The harness guard (`system-deep-loop-guard.js` + `dispatch-guard.cjs`) remains and is deterministic — it validates against on-disk config in the plugin host, independent of model compliance. Optional hardening: flip its default from warn to reject. |
| Risk | Orphaned references to the removed variables | A command doc/YAML references a variable nothing produces | Full repo-wide inventory of `general_agent_verified` + `dispatch_context_verified`; every doc-only reference cleaned; verified 0 executable consumers. |
| Dependency | `compile-command-contracts.cjs` | Contract freshness | Recompiled the 4 injection-command contracts after editing their canonical docs. |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether to also harden the harness guard from its default warn to a hard reject (`SYSTEM_DEEP_LOOP_GUARD_REJECT_LOOP=1`) is a separate, optional decision. The gate removal alone eliminates the reported false-block; the guard already warns on the genuine mis-dispatch case.

<!-- /ANCHOR:questions -->
