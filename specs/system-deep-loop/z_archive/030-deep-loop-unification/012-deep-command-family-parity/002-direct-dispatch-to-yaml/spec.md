---
title: "Feature Specification: convert the direct-dispatch deep command to yaml-backed"
description: "Convert /deep:skill-benchmark from inline direct-dispatch to the yaml-backed family shape — it gains an auto workflow YAML, a confirm workflow YAML, and a 4-section presentation asset, and command.md is rewired to load them — while the loop-host dispatch stays byte-identical and the HARD-BLOCK gates are preserved verbatim."
trigger_phrases:
  - "deep direct dispatch to yaml"
  - "skill-benchmark yaml-backed"
  - "deep command workflow yaml conversion"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-unification/012-deep-command-family-parity/002-direct-dispatch-to-yaml"
    last_updated_at: "2026-07-13T14:15:00Z"
    last_updated_by: "claude"
    recent_action: "Skill-benchmark conversion implemented and verified byte-identical"
    next_safe_action: "Proceed to child 003 (deep-* agent create-agent reconciliation)"
---
# Feature Specification: convert the direct-dispatch deep command to yaml-backed

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
| **Created** | 2026-07-13 |
| **Branch** | `wt/0036-deep-command-family-parity` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`/deep:skill-benchmark` (Lane C) was the remaining deep command that dispatched its loop host inline: its `command.md` declared "direct-router family — no workflow YAML" with an inline `§5 PRESENTATION BOUNDARY` instead of a presentation asset. Every other deep command owns an auto + confirm workflow YAML and a separate presentation asset. The operator directed force literal uniformity so the whole family shares one execution model.

### Purpose
Give `/deep:skill-benchmark` the yaml-backed family shape its Lane A/B siblings (`agent-improvement`, `model-benchmark`) already use: an auto workflow YAML, a confirm workflow YAML, and a 4-section presentation asset, with `command.md` rewired to resolve setup and then load the matching YAML. The conversion is behavior-preserving: the workflow YAML dispatches the exact same `loop-host.cjs` invocation the command previously ran inline, and the two HARD-BLOCK gates (Phase 0 dispatch-context, Mandatory Input Gate) are preserved verbatim.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `deep_skill-benchmark_auto.yaml` + `deep_skill-benchmark_confirm.yaml`: minimal thin wrappers dispatching `loop-host.cjs --mode=skill-benchmark` once.
- `deep_skill-benchmark_presentation.txt`: 4-section presentation extracted from the command's inline display.
- `skill-benchmark.md`: rewired to yaml-backed (ROUTER CONTRACT, OWNED ASSETS, EXECUTION TARGETS), gates preserved.

### Out of Scope
- Any change to `loop-host.cjs`, the Lane C/D orchestrators, or the guarded loop logic.
- Compiler registration — these stay yaml-backed like Lane A/B, never compiler-registered (no compiled contract).
- The alignment/ai-council pipeline parity (predecessor phase `001-pipeline-command-parity`) and the deep-* agent reconciliation (successor phase `003-deep-agent-family-reconciliation`).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/deep/assets/deep_skill-benchmark_auto.yaml` | Create | Autonomous single-dispatch wrapper |
| `.opencode/commands/deep/assets/deep_skill-benchmark_confirm.yaml` | Create | Same + one approval gate |
| `.opencode/commands/deep/assets/deep_skill-benchmark_presentation.txt` | Create | 4-section presentation |
| `.opencode/commands/deep/skill-benchmark.md` | Modify | Rewire to yaml-backed |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The command owns auto + confirm YAML + a presentation asset | Three new assets exist |
| REQ-002 | Skill-benchmark YAML dispatch is byte-identical to the prior inline dispatch | Adapter argv identical across flag combos |
| REQ-004 | Phase 0 dispatch-context gate preserved verbatim | Gate text unchanged |
| REQ-005 | Mandatory Input Gate preserved | Gate resolves the same inputs |
| REQ-006 | All 7 deep commands pass `validate_document.py --type command` | exit 0 each |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Skill-benchmark converted-path report equals the baseline report | Byte-identical (timestamps normalized) |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The effective `loop-host.cjs` adapter step (script + argv) the converted YAML produces is byte-identical to the command's documented direct dispatch, across representative flag combinations.
- **SC-002**: A real `loop-host.cjs --mode=skill-benchmark` run through the converted YAML dispatch produces a report byte-identical to the baseline direct run.
- **SC-003**: `validate_document.py --type command` passes on all 7 deep commands.

### Acceptance Scenarios

- **Scenario 1**: **Given** the rewired skill-benchmark command, **when** `:auto` resolves inputs, **then** it loads `deep_skill-benchmark_auto.yaml` and dispatches the loop host once with the same flags.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | YAML dispatch diverging from the inline invocation | Silent Lane C behavior change | Proved adapter argv byte-identical via `planInvocation` across flag combos |
| Risk | Dropping a HARD-BLOCK gate during the rewire | Loss of a safety block | Preserved Phase 0 + input gate verbatim |
| Risk | Over-cloning model-benchmark's multi-iteration shape | Adding nonexistent loop behavior | Authored a minimal single-dispatch wrapper, not a phase-loop clone |
| Dependency | `loop-host.cjs` flag-forwarding contract | A changed forwarding set would re-break the diff | Read `SKILL_BENCHMARK_RUN_OPTIONS` directly |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The wrapper adds no measurable overhead — one dispatch step, same process as before.

### Reliability
- **NFR-R01**: The dispatch string is deterministic — the same resolved inputs produce the same loop-host argv.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- An optional flag left unset is never appended (the `$([ -n … ])` guard), preserving the loop host's own defaults.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | One command conversion plus three new assets |
| Risk | 12/25 | Touches one working command; mitigated by a proven byte-identical dispatch |
| Research | 12/20 | Read the loop-host flag-forwarding sets and the shared parse-args dialect |
| **Total** | **36/70** | **Level 2** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- None. The minimal-wrapper approach and the byte-identical dispatch contract are settled by reading `loop-host.cjs` and `parse-args.cjs` directly.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Parent Spec**: See `../spec.md`

<!-- /ANCHOR:related-docs -->
