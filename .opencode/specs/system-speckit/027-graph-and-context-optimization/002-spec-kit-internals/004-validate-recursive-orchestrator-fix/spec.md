---
title: "Feature Specification: Fix validate.sh --recursive orchestrator-path silent no-op so phase children are validated"
description: "validate.sh --recursive exits inside run_node_orchestrator before main() recursion, so the orchestrator path validates only the parent. This fixes the orchestrator path to recurse over phase children itself."
trigger_phrases:
  - "validate recursive orchestrator"
  - "validate.sh phase children no-op"
  - "run_node_orchestrator recursion"
  - "recursive validation orchestrator path"
  - "phase children silently skipped"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/002-spec-kit-internals/004-validate-recursive-orchestrator-fix"
    last_updated_at: "2026-05-29T11:47:40Z"
    last_updated_by: "claude-opus"
    recent_action: "Fixed run_node_orchestrator to recurse over phase children on orchestrator path"
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
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Fix validate.sh --recursive orchestrator-path silent no-op so phase children are validated

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-29 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
In `validate.sh`, `run_node_orchestrator()` built the command with `--folder "$FOLDER_PATH"`, ran the compiled orchestrator (`mcp_server/dist/lib/validation/orchestrator.js`), then called `exit $?`. That `exit` fired before `main()` reached its recursive block, so when the orchestrator was present, `--recursive` silently validated only the parent and skipped every phase child. The shell fallback path already recursed via `run_recursive_validation`, so the gap was limited to the orchestrator-present path.

### Purpose
On the orchestrator path, `--recursive` validates the parent and every phase child and exits with the worst observed code, matching the shell fallback behavior.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rework `run_node_orchestrator()` so it resolves the orchestrator base once, builds flags once, validates the parent, and on `--recursive` validates each phase child.
- Aggregate the child exit codes into the orchestrator exit code (worst wins).
- Keep non-recursive behavior byte-identical and keep the no-orchestrator fallback unchanged.

### Out of Scope
- The shell `run_recursive_validation` path, which already recurses correctly and is untouched.
- The compiled orchestrator itself (`orchestrator.js` / `orchestrator.ts`), which already supports single-folder validation and needs no change.
- Any change to phase-child discovery semantics beyond reusing the existing pattern.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/system-spec-kit/scripts/spec/validate.sh | Modify | Recurse over phase children on the orchestrator path before exit |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Orchestrator path validates phase children when `--recursive` is set | **Given** the compiled orchestrator is present and a parent has phase children, **When** `validate.sh --recursive` runs, **Then** the orchestrator runs once per child plus the parent |
| REQ-002 | Non-recursive orchestrator behavior stays byte-identical | **Given** no `--recursive` flag, **When** the orchestrator path runs, **Then** it validates only the parent and exits the orchestrator return code |
| REQ-003 | The no-orchestrator fallback stays unchanged | **Given** neither `orchestrator.js` nor a tsx-loadable `orchestrator.ts` exists, **When** `run_node_orchestrator` runs, **Then** it returns 1 before invoking anything |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Aggregate exit code reflects the worst child result | **Given** one phase child fails strict validation, **When** the recursive orchestrator run finishes, **Then** the script exits with that worst code, not the parent code |
| REQ-005 | Child discovery mirrors the shell recursion pattern | **Given** the parent contains `NNN-*` entries, **When** children are enumerated, **Then** non-directories and children lacking both spec.md and description.json are skipped |
| REQ-006 | Shared flags propagate to every invocation | **Given** flags like `--strict`/`--json`/`--quiet`/`--verbose`, **When** the orchestrator runs on parent and children, **Then** the same flag set is passed to each |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: With the orchestrator present, `validate.sh --recursive` on a phase parent emits one orchestrator run per child (verified by stderr/stdout child lines or per-child JSON), not parent-only.
- **SC-002**: A non-recursive orchestrator run is byte-identical to the prior behavior: one parent validation, exit equals the orchestrator return code.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Compiled orchestrator (`orchestrator.js`) | If absent, shell fallback recurses instead | Fallback path left untouched, returns 1 before any run |
| Risk | Drift from `run_recursive_validation` child discovery | Low: inconsistent child sets between paths | Reused the same `NNN-*` glob and dir guard |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Recursive cost scales linearly with child count (one orchestrator process per child), the same shape as the shell recursion.

### Security
- **NFR-S01**: Child paths come only from the parent-scoped `NNN-*` glob, so no path traversal beyond the parent is introduced.

### Reliability
- **NFR-R01**: A failing child must not be masked. The aggregate exit code is the worst observed code across parent and children.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- No phase children: the `NNN-*` glob matches nothing, the loop body never runs, exit equals the parent code.
- `NNN-*` match that is a file, not a directory: skipped by the `[[ -d ]]` guard.
- Child dir lacking both spec.md and description.json: skipped, matching the design intent.

### Error Scenarios
- Child fails validation (exit 2): aggregated into `rc` so the final exit reflects it.
- Orchestrator absent: `run_node_orchestrator` returns 1 before any run, shell fallback recurses.

### State Transitions
- Parent passes, one child fails: final exit is the child failure code, not success.
- Mixed warnings and errors across children: worst code wins via `(( child_rc > rc ))`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One function in one file, ~25 changed lines |
| Risk | 14/25 | Touches a shared validation entrypoint and an exit-code contract |
| Research | 6/20 | Bug and fix design were pre-specified |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. The bug, fix design, and child-skip rule were fully specified.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
