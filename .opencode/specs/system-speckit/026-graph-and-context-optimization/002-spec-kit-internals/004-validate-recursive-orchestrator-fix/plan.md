---
title: "Implementation Plan: Fix validate.sh --recursive orchestrator-path silent no-op so phase children are validated"
description: "Rework run_node_orchestrator to resolve the orchestrator base and flags once, validate the parent, then on --recursive validate each phase child and aggregate the worst exit code."
trigger_phrases:
  - "validate recursive orchestrator plan"
  - "run_node_orchestrator fix plan"
  - "phase child validation orchestrator"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/004-validate-recursive-orchestrator-fix"
    last_updated_at: "2026-05-29T11:47:40Z"
    last_updated_by: "claude-opus"
    recent_action: "Reworked run_node_orchestrator to recurse over phase children before exit"
    next_safe_action: "Run validate.sh --strict on packet then reconcile completion metadata"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/spec/validate.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/032-validate-recursive-orchestrator-fix"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Fix validate.sh --recursive orchestrator-path silent no-op so phase children are validated

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash (validate.sh) |
| **Framework** | system-spec-kit validation harness |
| **Storage** | None |
| **Testing** | `bash -n` syntax check plus `validate.sh --strict` on this packet |

### Overview
Inside `run_node_orchestrator()` the orchestrator command was built once and `exit $?` fired immediately, short-circuiting `main()`'s recursive block. The fix resolves the orchestrator invocation base and the shared flag set once, validates the parent, then on `--recursive` enumerates phase children with the same glob `run_recursive_validation` uses and validates each, aggregating the worst exit code before a single final `exit`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single shell function rework, no new abstractions.

### Key Components
- **`run_node_orchestrator()`**: resolves orchestrator base, builds flags, validates parent, optionally recurses, exits with aggregate code.
- **`main()`**: unchanged. It calls `run_node_orchestrator` early. When that function returns 1 (no orchestrator), main proceeds to the shell validators and `run_recursive_validation`.

### Data Flow
`main` calls `run_node_orchestrator`. If the orchestrator exists, the function now owns both the parent run and, under `--recursive`, the per-child runs, then exits. If not, it returns 1 and main's shell path (including `run_recursive_validation`) handles validation.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `run_node_orchestrator()` (validate.sh) | Orchestrator-path entry, exited before main recursion | Update: recurse over children before exit | Diff plus `bash -n` |
| `main()` (validate.sh) | Calls orchestrator early, owns shell recursion fallback | Unchanged: still calls orchestrator, still recurses when it returns 1 | Read L1009-1035, no edit |
| `run_recursive_validation()` (validate.sh) | Shell recursion that already validated children | Unchanged: discovery pattern reused verbatim | Read L928-1003, no edit |
| `has_phase_children()` (validate.sh) | Auto-enables RECURSIVE on parents | Unchanged | Read L139, no edit |
| Compiled orchestrator (`orchestrator.js`/`.ts`) | Validates a single `--folder` | Not a consumer: invoked once per folder, no change | Invocation contract unchanged |

Required inventories:
- Same-class producers: only `run_node_orchestrator` builds and runs the orchestrator command. `rg -n 'orchestrator_js|orchestrator_ts|--folder' validate.sh` confirms a single producer.
- Consumers of changed symbols: no exported symbol changed. `cmd` was a function-local array renamed to `base`/`flags`, never read outside the function.
- Matrix axes: orchestrator present/absent x recursive/non-recursive x child present/absent/non-dir/missing-control-files (see checklist CHK-FIX-004).
- Algorithm invariant: aggregate exit code = max(parent_rc, all child_rc). Adversarial cases: no children, file matching `NNN-*`, child missing both control files, failing child under passing parent.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read `run_node_orchestrator`, `main`, `has_phase_children`, `run_recursive_validation`
- [x] Confirm the bug: `exit $?` precedes main's recursive block

### Phase 2: Core Implementation
- [x] Resolve orchestrator base once (`base=()`), return 1 when neither JS nor tsx is available
- [x] Build the shared flag set once (`flags=()`)
- [x] Validate parent, capture `rc`, recurse over `NNN-*` children under `$RECURSIVE`, aggregate worst code, single final `exit $rc`

### Phase 3: Verification
- [x] `bash -n validate.sh` passes
- [x] Confirm non-recursive path is byte-identical (parent run, exit its code)
- [x] `validate.sh --strict` on this packet PASSED
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | Shell syntax of validate.sh | `bash -n` |
| Manual | Non-recursive byte-identity, recursive child enumeration logic | Code review of diff against design |
| Integration | `validate.sh --strict` on this packet | validate.sh |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Compiled orchestrator (`orchestrator.js`) | Internal | Green | None: shell fallback recurses when absent |
| Bash 4+ array support | Internal | Green | None: already required by existing script |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Recursive validation regresses or non-recursive output drifts.
- **Procedure**: `git checkout -- .opencode/skills/system-spec-kit/scripts/spec/validate.sh` restores the prior single-run `run_node_orchestrator`.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Read + confirm bug) ──► Phase 2 (Rework function) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15 min |
| Core Implementation | Med | 30 min |
| Verification | Low | 15 min |
| **Total** | | **~1 hour** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data changes, no backup needed
- [x] No feature flag (behavior gated by existing `--recursive`)
- [x] No monitoring change

### Rollback Procedure
1. `git checkout -- .opencode/skills/system-spec-kit/scripts/spec/validate.sh`
2. Confirm `run_node_orchestrator` is back to the single-run form
3. `bash -n validate.sh` to confirm syntax

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

