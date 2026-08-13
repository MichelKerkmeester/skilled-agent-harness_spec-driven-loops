---
title: "Implementation Plan: Combo Test Matrix and Ambient-Config Isolation"
description: "Sequence the three isolation and executor-coverage leaves through strict closeout."
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/047-executor-wiring-and-parity/003-cli-executor-fanout-parity/005-combo-test-matrix"
    last_updated_at: "2026-08-11T14:03:33Z"
    last_updated_by: "codex"
    recent_action: "Reconciled all three built leaves with the strict-validation contract"
    next_safe_action: "Pass strict validation and obtain operator sign-off."
    blockers: []
    key_files:
      - "plan.md"
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: Combo Test Matrix + Ambient-Config Isolation

<!-- ANCHOR:summary -->
## 1. SUMMARY
Close the fan-out parity packet with the end-to-end combo coverage matrix (log every skip) and the cross-cutting ambient-config isolation that phases 003-004 tracked here. Built as leaves: pi extension isolation first (done), then the combo matrix, then cursor/devin/MCP isolation.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- fan-out, model-benchmark, and ai-council suites pass (FULL output, never through `tail`).
- Whole-runtime tsc is 0.
- Live pi accepts the new read-only flags and writes nothing.
- The combo matrix logs every credentials-gated skip explicitly.
- `validate.sh --strict` passes.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
Read-only executor containment is layered: the model's own tool allowlist (read-only flags), plus — where the CLI auto-loads ambient config that can run write-capable lifecycle code — an explicit disable. For pi, that is `--no-extensions --no-skills --no-prompt-templates` in the shared read-only builder, so both fan-out leaves and ai-council seats inherit it. Cursor hooks and MCP, and devin config, need a config/workspace-level isolation because those CLIs read ambient config from the working directory with no per-invocation disable flag. The combo matrix is a construction-coverage test over the shared builder and each mode's dispatch, logging credentials-gated combinations as explicit skips.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
### Phase 1 — Pi extension isolation
Add the three `--no-*` flags to the read-only pi builder and update exact-argument assertions in the fan-out, model-benchmark, and ai-council suites.

### Phase 2 — Combo coverage matrix
Enumerate every kind × model × mode; assert construction or log a skip with a reason.

### Phase 3 — Cursor, devin, and MCP isolation
Neutralize repository hooks and unapproved MCP for read-only cursor/pi, verify devin config isolation, and prove the hostile-config markers do not fire.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Leaf 1: exact-arg assertions across three suites lock the new read-only pi vector; a live pi invocation confirms the flags are accepted and write nothing. Leaf 2: a coverage test iterating the full matrix, asserting construction and logging skips. Leaf 3: hostile-config probes (a marker-writing hook / a write allow-rule) that must NOT fire for a read-only leaf.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
- The frozen support matrix + gap register (001) and the wired builders/modes (002-004).
- pi/cursor/devin on PATH for the live isolation probes.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Leaf 1 is confined to the read-only branch of one builder plus three exact-arg test assertions; rollback is reverting those hunks, caught immediately by the exact-arg suites. Later leaves are additive tests plus isolated config wiring.
<!-- /ANCHOR:rollback -->
