---
title: "Implementation Plan: 005 Curator Integration"
description: "Plan for integrating memory context curator into memory-search with budget split and fallback."
trigger_phrases:
  - "027 011 005 plan"
importance_tier: "normal"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "z_future/code-graph-and-cocoindex/008-coco-memory-context-extras/005-curator-integration"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Authored child plan"
    next_safe_action: "Implement integration after child 004"
    blockers: ["004-curator-prompt"]
    key_files: ["plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-codex-2026-05-12-027-011-005-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 005 Curator Integration

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Framework** | system-spec-kit MCP server search pipeline |
| **Storage** | Existing memory search cache and curator cache |
| **Testing** | vitest |

### Overview
Wire the validated curator into memory search as a post-retrieval packaging step. Budget split lets the curator inspect more candidates than the caller sees while preserving deterministic result order.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Child 004 curator API is validated.
- [ ] Memory pipeline hook point is confirmed.
- [ ] Stage 4 immutability assertions are available.

### Definition of Done
- [ ] Budget split tests pass.
- [ ] Curator fallback tests pass.
- [ ] Ordering and score immutability snapshot passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Post-retrieval presentation hook with fail-open fallback.

### Key Components
- **Budget split**: Separates retrieval candidate and presentation limits.
- **Curator hook**: Calls child 004 API after deterministic retrieval.
- **Response attachment**: Adds `data.curatedContext` only when validated.

### Data Flow
Memory search retrieves deterministic candidates, caps presentation results, optionally invokes the curator over the broader candidate set, and attaches a validated package plan beside unchanged results.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `memory-search.ts` | Owns retrieval pipeline response | Add budget split and hook | budget and snapshot tests |
| Stage 4 output | Canonical ranking authority | Preserve ordering and scores | immutability test |
| Telemetry | Reports search behavior | Add curator outcomes | logger assertions |

Required inventories:
- Same-class producers: `rg -n "limit|presentation|Stage 4|formatSearchResults" .opencode/skills/system-spec-kit/mcp_server`.
- Consumers of changed symbols: `rg -n "curatedContext|memory_search|memory_context" .opencode/skills/system-spec-kit/mcp_server`.
- Matrix axes: flag off, shadow, active, timeout, invalid schema, cache hit, empty candidates.
- Algorithm invariant: curator may attach `data.curatedContext`, but never mutate `data.results`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read child 004 API.
- [ ] Read current memory-search limit flow.
- [ ] Identify immutable result fields for snapshot.

### Phase 2: Core Implementation
- [ ] Add retrieval candidate and presentation limit handling.
- [ ] Wire curator hook after deterministic retrieval.
- [ ] Add fallback and telemetry outcomes.

### Phase 3: Verification
- [ ] Add budget split tests.
- [ ] Add fallback tests.
- [ ] Add ordering immutability snapshot.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Budget split helpers | vitest |
| Integration | Search response with curator enabled/disabled | vitest |
| Manual | Shadow-mode telemetry review | Local MCP call if available |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `004-curator-prompt` | Child | Required | No validated curator API |
| Phase 004 eval | Soft gate | Required before active rollout | Curator can only ship shadow/default-off |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Search latency, ordering, or response compatibility regression.
- **Procedure**: Disable curator flag, revert hook and budget split, and re-run memory search tests.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
004 curator API ──> Budget split ──> Hook ──> Fallback and telemetry tests
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Child 004 | Core |
| Core | Setup | Verification |
| Verification | Core | Track B completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1 hour |
| Core Implementation | Medium | 4 hours |
| Verification | Medium | 2-3 hours |
| **Total** | | **7-8 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Curator flag defaults to disabled.
- [ ] Ordering snapshot exists.
- [ ] Fallback tests cover timeout, parse failure, invalid IDs, and missing provider.

### Rollback Procedure
1. Set curator flag false.
2. Revert `memory-search.ts` hook and budget split.
3. Keep child 004 module inert if still useful for tests.
4. Re-run memory search test suite.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Remove curator cache entries if persistent cache is introduced.
<!-- /ANCHOR:enhanced-rollback -->
