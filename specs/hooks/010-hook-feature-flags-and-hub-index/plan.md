---
title: "Implementation Plan: Hook Feature Flags + Full Hub Index"
description: "Deliver one default-on hook disable contract across runtime, shell, git, and compiled adapters, then reconcile the hub index and verify concern isolation."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "hook feature flags plan"
  - "hook kill-switch implementation"
  - "cross-runtime hook phases"
importance_tier: "high"
contextType: "plan"
parent: "./spec.md"
_memory:
  continuity:
    packet_pointer: "hooks/010-hook-feature-flags-and-hub-index"
    last_updated_at: "2026-08-14T08:08:08Z"
    last_updated_by: "opencode"
    recent_action: "Shipped all seven phases and reconciled the complete Level-3 packet"
    next_safe_action: "Retain verification evidence for future review"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "4654af88-ba88-466a-bd14-2fa43ea87923"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Use one shared concern guard with master and per-concern flags"
      - "Keep MK_SPEC_GATE_ENFORCE separate from generic disable controls"
      - "Keep the hub README as the only canonical kill-switch index"
---
# Implementation Plan: Hook Feature Flags + Full Hub Index

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Languages** | TypeScript, JavaScript, POSIX shell |
| **Runtime Surfaces** | Claude, Codex, Cursor, Devin, OpenCode, Pi |
| **Guard Contract** | Master switch, per-concern switch, legacy aliases, default-on fail-open behavior |
| **Verification** | Concern matrix, alias matrix, shell parity, focused runtime suites |

### Overview

Use the CJS concern resolver as the canonical Node implementation, expose compatible module facades, and mirror its semantics in POSIX shell. Wire each canonical adapter before rebuilding compiled distributions, then align the hub documentation and execute negative controls across all concern families.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- The concern inventory and canonical symlink ownership are known.
- Existing legacy aliases and independent policy controls are identified.
- Each phase has an observable negative control.

### Definition of Done

- All 20 concerns pass default-on, master-off, self-flag, and isolation checks.
- All 8 legacy aliases and 6 shell concerns pass.
- Focused spec-gate and adapter suites pass.
- Strict packet validation reports zero errors and zero warnings.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:ai-execution -->
## AI Execution Protocol

### Pre-Task Checklist

Before any follow-up task:

1. Load `spec.md` and confirm the requested work remains in scope.
2. Load `plan.md` and identify the applicable phase and dependencies.
3. Load `tasks.md` and select the next incomplete task, if any.
4. Load `checklist.md` and identify the required verification evidence.
5. Confirm the allowed write paths before modifying files.

### Execution Rules

| Rule | Description |
|------|-------------|
| TASK-SEQ | Complete dependent work in documented phase order |
| TASK-SCOPE | Modify only files within the approved task scope |
| TASK-VERIFY | Verify each change against its acceptance criteria |
| TASK-DOC | Reconcile packet status only after verification passes |

### Status Reporting Format

Report `Task`, `Status`, `Evidence`, `Blockers`, and `Next` after each task.

### Blocked Task Protocol

If a task is blocked, stop dependent work, record the failing check and evidence, keep the task incomplete, and request the decision needed to continue.
<!-- /ANCHOR:ai-execution -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Concern-generic early-return guard with module-format facades and a behaviorally equivalent POSIX helper.

### Key Components

- **Node resolver**: Derives canonical flags, evaluates the master switch and aliases, and defaults to enabled.
- **POSIX mirror**: Applies the same truthy and default semantics to shell and git consumers.
- **Canonical adapters**: Invoke the concern guard before existing hook logic.
- **Compiled distributions**: Resolve the shared guard through `createRequire` after rebuilds.
- **Hub README**: Owns the canonical concern-to-flag index.

### Data Flow

An adapter supplies its concern slug to the shared guard. The guard evaluates master, canonical, and legacy disable inputs before returning enabled or directing the adapter to its existing silent or allow path.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 5: Skill-Advisor Master Switch

Gate the canonical skill-advisor implementation, rebuild its distribution, and prove the compiled master-off path.

### Phase 6: Spec-Gate Master Switch

Route classification and mutation evaluation through the concern guard while preserving `MK_SPEC_GATE_ENFORCE` as an independent deny control.

### Phase 7: Remaining Node Adapters

Gate completion, codex-watchdog, permission-policy, and directive-lifecycle adapters and rebuild both affected distributions.

### Phase 8: Shell, Install, and Git Consumers

Add the POSIX mirror and wire worktree, git-hook checks, cleanup, dist freshness, hook installation, and the pre-commit emergency-off path while preserving existing guards.

### Phase 9: Multiplexed Path Isolation

Split Cursor write and shell branches and give Pi advisory branches concern-specific gates.

### Phase 10: Canonical Documentation Index

Make the hub README the 20-concern index and align the injection, coverage, and environment references without adding another catalog.

### Phase 11: Negative Controls and Packet Reconciliation

Run the full concern, alias, truthy/falsy, shell, and guard matrices, then reconcile and close the Level-3 packet.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Verified Result |
|-----------|-------|-----------------|
| Focused suite | Spec-gate behavior | 44/44 passed |
| Focused suite | Completion and remaining adapters | 34/34 passed |
| Matrix | Default, master, self-flag, isolation | 20/20 concerns passed |
| Compatibility | Legacy aliases | 8/8 passed |
| Portability | POSIX shell concerns | 6/6 passed |
| Resolver | Truthy/falsy and guard behavior | Guard suite 7/7 passed |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Canonical symlink targets | Internal | Verified | Edits could land on the wrong ownership surface |
| Distribution rebuilds | Internal | Verified | Runtime shims could retain stale behavior |
| Existing silent/allow paths | Internal | Verified | Disabled hooks could emit output or deny unexpectedly |
| Hub README index | Documentation | Verified | Operators lose a single source of truth |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Immediate trigger**: A hook family causes operational disruption or a false deny.
- **Immediate procedure**: Set `MK_HOOKS_DISABLED=1` or the matching `MK_<CONCERN>_DISABLED` flag.
- **Scoped procedure**: Restore the canonical adapter implementation and rebuild its compiled distribution when removing a guard integration is necessary.
- **Policy boundary**: Do not remove or conflate `MK_SPEC_GATE_ENFORCE`, the mass-deletion guard, or comment-hygiene checks during rollback.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Phase 5 -> Phase 6 -> Phase 7 -> Phase 8 -> Phase 9 -> Phase 10 -> Phase 11
 source      policy      node       shell      isolate     docs       proof
```

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Runtime and compiled adapters | Shared concern resolver | Master and self-flag controls | Cross-runtime proof |
| POSIX consumers | Shell mirror | Shell and git disable controls | Shell parity proof |
| Hub documentation | Verified concern inventory | Canonical 20-concern index | Packet reconciliation |
| Verification matrix | All wired consumers | Concern, alias, and parity evidence | Final packet closure |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Runtime gating and distribution rebuilds** - required before compiled negative controls.
2. **Shell and multiplexed-path isolation** - required before full concern isolation proof.
3. **Canonical documentation alignment** - required before packet reconciliation.
4. **Cross-runtime proof** - required before strict packet validation.

**Parallel Opportunities**: Documentation source review can run alongside focused runtime suites after the implementation is stable.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Status |
|-----------|-------------|------------------|--------|
| M1 | Runtime and policy adapters gated | Skill-advisor negative control and spec-gate 44/44 pass | Verified |
| M2 | Remaining Node and shell consumers gated | Adapter 34/34 and shell 6/6 pass | Verified |
| M3 | Concern documentation aligned | README lists all 20 concerns | Verified |
| M4 | Cross-runtime proof complete | Concern 20/20, aliases 8/8, guard 7/7 | Verified |
| M5 | Packet reconciled | Strict validator reports `Errors: 0  Warnings: 0` | Complete |
<!-- /ANCHOR:milestones -->
