---
title: "Implementation Plan: 027/006 Code Graph Adoption Eval"
description: "Level 3 plan for local evaluation harness with provider preflight, hardened subprocess dispatch, result schema, mocked stress, and reporting."
trigger_phrases:
  - "027 006 adoption eval plan"
  - "code graph adoption eval plan"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/006-code-graph-adoption-eval"
    last_updated_at: "2026-05-09T06:00:00Z"
    last_updated_by: "codex"
    recent_action: "Aligned plan.md with manifest anchors and Level 3 hardening amendments"
    next_safe_action: "Build preflight, dispatcher, schema, and mocked stress before live harness"
    blockers:
      - "Phases 001-004 must ship before full eval run."
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-09-027-alignment-fix"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Choose task curation source."
    answered_questions:
      - "Keep hardening in Phase 006 and Level 3."
---
# Implementation Plan: 027/006 Code Graph Adoption Eval

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript and Node CLI |
| **Framework** | system-spec-kit MCP/eval tooling |
| **Storage** | JSONL run output and session analytics DB |
| **Testing** | Vitest, stress test, `npm run check`, spec validator |

### Overview
Phase 006 builds the local eval harness that measures whether Phases 001-004 reduce file reads and token usage. pt-02 raised this to Level 3 because subprocess lifecycle, auth preflight, discriminated result rows, and mocked stress coverage are required for credible paired statistics.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phases 001-004 are complete for full live harness.
- [ ] Provider preflight behavior is defined.
- [ ] Result row schema is defined before dispatcher implementation.

### Definition of Done
- [ ] Mocked 12 x 2 dispatcher stress passes before live run.
- [ ] Live harness writes complete/incomplete/skipped accounting.
- [ ] Report includes paired statistics and power analysis.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
CLI dispatcher with hardened subprocess helper and post-run report generation.

### Key Components
- **Provider preflight**: fails fast on unavailable auth/provider state.
- **Dispatcher helper**: owns stdin, timeout, SIGTERM/SIGKILL escalation, close wait, and output paths.
- **Result schema**: discriminates success, timeout, and failed rows.
- **Report generator**: computes metrics only over complete baseline/after pairs.

### Data Flow
The CLI reads labeled tasks, runs each task in baseline and after conditions through the dispatcher, records JSONL rows, queries token metrics by session id, computes paired deltas, and renders a markdown report.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mcp_server/lib/eval/provider-preflight.ts` | New auth preflight | Create | Unit tests for success/auth failure |
| `mcp_server/lib/eval/dispatcher.ts` | New subprocess lifecycle owner | Create | Mocked stress test |
| `mcp_server/lib/eval/result-schema.ts` | New row validator | Create | Schema tests |
| `code-graph-adoption-eval.js` | New CLI | Create | Smoke and full harness |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Curate task set.
- [ ] Define provider preflight and result schema.

### Phase 2: Core Implementation
- [ ] Implement preflight, dispatcher, schema, token helper, CLI, metrics, report generator, and stress config.

### Phase 3: Verification
- [ ] Run mocked stress, smoke, coverage, `npm run check`, live harness, and strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | preflight, schema, metric math, report pair accounting | Vitest |
| Stress | 12 x 2 mocked dispatcher with mixed outcomes | Vitest |
| Manual/Live | full harness after mocked stress passes | Node CLI |
| Validation | Spec folder structure and anchors | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 001-004 | Internal | Pending | Full treatment condition cannot run |
| session-analytics DB | Internal | Available | Token metrics cannot be collected |
| cli-opencode | Internal/external provider route | Available with auth | Subprocess runs cannot execute |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: eval harness leaves subprocesses running, corrupts JSONL result rows, or misreports paired statistics.
- **Procedure**: Disable harness invocation, revert the implementation commit, and preserve any run JSONL as diagnostic evidence.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phases 001-004 for live run | Core implementation |
| Core implementation | Setup | Verification |
| Verification | Core implementation | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 1-2 hours |
| Core Implementation | High | 4-5 hours |
| Verification | High | 2-3 hours plus live run |
| **Total** | | **7-10 hours plus live run** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Mocked stress passes.
- [ ] Provider preflight runs before live dispatch.
- [ ] Result schema validates every row.

### Rollback Procedure
1. Stop any active harness subprocesses.
2. Revert implementation commit.
3. Archive failed run JSONL under the packet scratch area if needed.
4. Re-run dispatcher stress to confirm no stale process state remains.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Preserve or delete generated eval-run JSONL as needed; no database migration rollback.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
002 HLD/LLD + 003 Trace + 004 Impact + 005 Advisor Mandate
        -> 005 task harness treatment condition
        -> mocked dispatcher stress
        -> live paired run
        -> report
```

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Provider preflight | Provider config | Cached availability | Dispatcher |
| Dispatcher helper | Result schema | Structured rows | CLI |
| CLI harness | Task set, dispatcher | JSONL run rows | Report |
| Report generator | Complete paired rows | Markdown verdict | Completion |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Provider preflight + dispatcher helper** - 2-3 hours - CRITICAL
2. **Result schema + mocked stress** - 2-3 hours - CRITICAL
3. **CLI/report integration** - 2-3 hours - CRITICAL
4. **Live run and report review** - ~2 hours - CRITICAL

**Total Critical Path**: 8-11 hours.

**Parallel Opportunities**:
- Task curation can run while dispatcher helper is implemented.
- Report generator can start once result schema is stable.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Hardening ready | preflight, dispatcher, schema tests pass | Before CLI |
| M2 | Mocked reliability ready | 12 x 2 stress passes | Before live run |
| M3 | Evaluation complete | report generated from complete pairs | Completion |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Keep subprocess hardening in Phase 006

**Status**: Accepted

**Context**: pt-02 found provider auth, process lifecycle, and result schema risks inside the eval harness itself.

**Decision**: Keep hardening in this Level 3 packet rather than split a new prerequisite phase.

**Consequences**:
- The packet is larger, but the hardening sits next to its only current consumer.
- A shared dispatcher can be extracted later if another consumer appears.

**Alternatives Rejected**:
- Split a sixth phase: rejected because it adds dependency overhead without current reuse.
