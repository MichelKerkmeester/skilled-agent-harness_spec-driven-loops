---
title: "Implementation Plan: Deep Alignment Multi-Executor [template:level-2/plan.md]"
description: "Mirror deep-review's contained cli-opencode leaf in autonomous alignment and add a convergence mode that forces the full iteration budget."
trigger_phrases:
  - "deep alignment implementation plan"
  - "alignment cli opencode plan"
  - "forced alignment iterations"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-deep-loop/038-deep-alignment-multi-executor"
    last_updated_at: "2026-07-23T04:55:05Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Implemented executor and convergence routing"
    next_safe_action: "Restore missing verification inputs"
    blockers:
      - "Runtime package.json is absent"
      - "Broad alignment fixtures are incomplete"
    key_files:
      - ".opencode/commands/deep/assets/deep-alignment-auto.yaml"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/check-convergence.cjs"
    session_dedup:
      fingerprint: "sha256:ca72e5a65953f4522089a02676704735026bbd3ad1d44519f814b512e8adfc60"
      session_id: "038-deep-alignment-multi-executor"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Deep Alignment Multi-Executor

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | YAML command workflow, Markdown contract, CommonJS |
| **Framework** | system-deep-loop |
| **Storage** | Alignment JSONL and packet files |
| **Testing** | Node test runner and strict spec validator |

### Overview

Adapt the proven deep-review cli-opencode branch to alignment's prompt pack, state paths, and route proof. Add a small convergence-mode discriminator to the alignment-local evaluator and bind it through command presentation into the autonomous YAML.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented (`spec.md`)
- [x] Success criteria measurable (`spec.md`)
- [x] Dependencies identified (`plan.md`)

### Definition of Done

- [x] Acceptance behavior implemented (`.opencode/commands/deep/assets/deep-alignment-auto.yaml`)
- [ ] Requested broad gates green
- [x] Command and packet docs updated (`.opencode/commands/deep/alignment.md`)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Command-owned YAML router with an alignment-local convergence evaluator.

### Key Components

- **Presentation owner**: Resolves executor and convergence flags before YAML load.
- **Autonomous workflow**: Dispatches one native, cli-codex, or cli-opencode leaf per iteration.
- **Convergence evaluator**: Preserves the default AND-gate or forces the configured iteration budget.

### Data Flow

Command flags and pre-bound answers produce `config.executor` and `convergence_mode`. The YAML selects the executor branch, runs the audited leaf, then calls `check-convergence.cjs` with the resolved mode.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Command presentation | Owns setup resolution | Add executor and convergence fields | Marker search and contract review |
| Autonomous YAML | Owns dispatch and loop calls | Add cli-opencode branch and mode flag | YAML parse and containment marker search |
| Convergence script | Owns stop decision | Gate `CONVERGED` on mode | Focused state-machine regression |
| Command reference | Advertises supported flags | Reconcile executor semantics | Contradiction search |
| State-machine test | Covers evaluator behavior | Add stable-before-max and at-max rows | Node test runner |

Required inventories:

- Same-class producer: `rg -n "if_cli_opencode|convergence-mode|NO external executor" .opencode/commands/deep .opencode/skills/system-deep-loop/deep-alignment`.
- Consumers: presentation binding, auto YAML command, evaluator CLI, and command reference.
- Matrix axes: executor kind `{native, cli-codex, cli-opencode}` and convergence mode `{default, off}`.
- Invariant: external selection fails closed; mode `off` cannot emit `CONVERGED`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Read target files and deep-review reference branch (`.opencode/commands/deep/assets/deep-review-auto.yaml`)
- [x] Scaffold the Level 2 packet (`.opencode/specs/system-deep-loop/038-deep-alignment-multi-executor`)
- [x] Capture baseline verification state (`implementation-summary.md`)

### Phase 2: Core Implementation

- [x] Add cli-opencode alignment leaf (`.opencode/commands/deep/assets/deep-alignment-auto.yaml`)
- [x] Thread convergence mode to the evaluator (`.opencode/skills/system-deep-loop/deep-alignment/scripts/check-convergence.cjs`)
- [x] Reconcile setup and command docs (`.opencode/commands/deep/assets/deep-alignment-presentation.txt`)

### Phase 3: Verification

- [x] Run focused convergence regression (`state-machine-wiring.test.cjs PASS`)
- [ ] Run requested broad gates
- [x] Run strict packet validation (`zero errors, one metadata warning`)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `checkConvergence` default and off decisions | Node test runner |
| Integration | Alignment script suite | Node test runner |
| Static | YAML syntax, marker parity, contradiction removal | Ruby YAML and `rg` |
| Documentation | Level 2 anchors and frontmatter | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `runAuditedExecutorCommand` | Internal | Green | cli-opencode cannot produce audited receipts |
| Alignment prompt pack | Internal | Green | Write-containment markers and route proof are unavailable |
| Runtime npm package | Internal | Red baseline | Requested npm gates cannot run |
| Command benchmark fixtures | Internal | Red baseline | Broad alignment suite remains red |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Executor routing or convergence behavior regresses.
- **Procedure**: Revert only the five framework-file edits and rerun the focused state-machine regression.
<!-- /ANCHOR:rollback -->

---

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 30 minutes |
| Core Implementation | Medium | 60 minutes |
| Verification | Medium | 30 minutes |
| **Total** | | **2 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] Existing branch used as implementation reference (`.opencode/commands/deep/assets/deep-review-auto.yaml`)
- [x] Shared runtime files left unchanged (`scope inventory`)
- [x] Interactive YAML left unchanged (`scope inventory`)

### Rollback Procedure

1. Remove the alignment cli-opencode branch.
2. Remove convergence-mode binding and evaluator logic.
3. Restore the prior command and presentation text.
4. Run the focused state-machine regression.

### Data Reversal

- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
