---
title: "Research Plan: Cross-Runtime Goal Isolation"
description: "Execute three focused deep-research passes and synthesize the verified isolation contract that gates implementation."
trigger_phrases:
  - "goal isolation research plan"
  - "three goal research iterations"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/042-goal-isolation/001-goal-isolation-research"
    last_updated_at: "2026-08-10T12:35:00Z"
    last_updated_by: "codex"
    recent_action: "Reconciled three-pass research synthesis"
    next_safe_action: "Hand the accepted scope contract to 002-session-scoped-core"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Research Plan: Cross-Runtime Goal Isolation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Workflow** | `system-deep-loop` via `/deep:research:auto` |
| **Depth** | Exactly 3 iterations; `--stop-policy=max-iterations` |
| **Target** | `001-goal-isolation-research` child packet |
| **Evidence** | Current source, runtime contracts, focused commands/tests, prior packets as hypotheses |

### Overview

The loop will use three non-overlapping focuses. Iteration 1 maps state ownership and the observed failure. Iteration 2 maps native session identity and management capabilities across runtimes. Iteration 3 evaluates architectures, migration rules, and the complete implementation proof matrix. The workflow then owns synthesis and continuity refresh.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Target child phase exists and its write boundary is explicit.
- [x] Pi goal extension is disabled and live Pi processes are stopped.
- [x] Research questions, non-goals, and forced-depth stop policy are specified.

### Definition of Done

- [x] Three iteration markdown files and valid JSONL/delta records exist.
- [x] Route-proof fields identify the deep-research leaf for every iteration.
- [x] Final synthesis cites evidence and records eliminated alternatives; post-loop corrections identify two source-level identity errors in the generated synthesis.
- [x] Parent and implementation phase plans are reconciled with the corrected synthesis.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Command-owned iterative research with fresh leaf context and externalized local state.

### Key Components

- **Command router**: binds topic, target folder, three-iteration ceiling, and max-iterations stop policy.
- **Leaf iterations**: each investigates one focus and writes one immutable report plus structured delta.
- **Reducer**: owns strategy, findings registry, and dashboard projection.
- **Synthesis**: turns all three passes into the canonical research recommendation.

### Data Flow

```text
bounded research charter
        -> iteration 1: ownership and failure
        -> iteration 2: runtime identity and management
        -> iteration 3: architecture, migration, and proof
        -> research/research.md
        -> phases 2-5 plan reconciliation
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

| Surface | Current Role | Research Action | Evidence |
|---------|--------------|-----------------|----------|
| `.opencode/hooks/goal/lib/goal-core.cjs` | Runtime-neutral singleton producer | Trace state path and every public operation | Current file and focused tests |
| `.opencode/hooks/goal/bin/goal.cjs` | Management CLI | Determine identity inputs and failure contract | Current file and command behavior |
| Pi/Cursor/Devin adapters and registrations | Native identity bridge | Verify actual payload/context fields and support truth | Tracked files, configs, runtime contracts |
| `.opencode/plugins/mk-goal.js` | OpenCode per-session control | Extract reusable invariants without sharing incompatible storage | Current plugin and tests |
| Goal docs and packets 032/034 | Historical contract | Confirm or refute current claims | Current source takes precedence |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Ownership and Failure Surface

- Inventory all state producers/consumers and registrations.
- Reconfirm the singleton replacement mechanism and blast radius.
- Record OpenCode's isolated design as the regression control.

### Phase 2: Native Identity and Management

- Verify session identifiers, lifecycle events, resume/fork semantics, and management APIs per runtime.
- Identify unsupported or ambiguous management paths.
- Resolve the current Devin adapter discrepancy.

### Phase 3: Architecture and Proof

- Compare state layouts and binding strategies.
- Specify legacy migration, missing-identity, diagnostics, and concurrency rules.
- Produce requirements, test matrix, rollout order, rollback, and phase recommendations.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Check | Pass Condition |
|-------|----------------|
| Iteration count | Exactly three iteration reports and three structured deltas |
| Route proof | Every iteration records `target_agent`, `resolved_route`, loaded definition, and research mode |
| Citation quality | Every load-bearing finding cites a file/line, command/test, or primary source |
| Synthesis | Includes recommendation, alternatives eliminated, gaps, and phase-specific next actions |
| Packet | Focused strict validation exits 0 after metadata refresh |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status | Impact if Blocked |
|------------|--------|-------------------|
| Deep-research auto workflow | Loaded | The named user workflow cannot be substituted manually. |
| Current goal source/config | Available | Without it, current support truth cannot be established. |
| Native runtime contracts | Verified and reconciled | Pi supports native lifecycle/command identity; Cursor supports hook identity but not the current management prompt; Devin remains decommissioned. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: workflow writes outside the phase packet, produces invalid state, or omits required route proof.
- **Procedure**: keep the Pi extension disabled, halt the loop, preserve valid iteration evidence, and use the workflow's state recovery path. Do not hand-author replacement iteration state.
<!-- /ANCHOR:rollback -->
