---
title: "Implementation Plan: blast_radius includeTransitive Flag Fix (029 Phase 008)"
description: "Gate blast_radius depth on includeTransitive; test the gated behavior; reconcile scenario 022."
trigger_phrases:
  - "blast radius transitive plan"
  - "f-022-1 fix plan"
  - "029 phase 008 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/007-code-graph-buildout/010-playbook-validation-and-hardening/008-blast-radius-transitive-flag"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Author phase 008 plan"
    next_safe_action: "Edit query handler blast_radius branch"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-2026-05-27-code-graph-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: blast_radius includeTransitive Flag Fix (029 Phase 008)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (mk-code-index MCP server) |
| **Framework** | code_graph_query handler |
| **Storage** | n/a |
| **Testing** | vitest + tsc + verify_alignment_drift.py |

### Overview
Introduce `effectiveDepth = args.includeTransitive ? maxDepth : 1` inside the blast_radius branch and route the branch's 6 depth uses through it, leaving outline/relationship paths untouched.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Consumer audit done (no programmatic caller relies on the default)
- [x] All 6 in-branch maxDepth uses enumerated (1319/1358/1385/1413/1415/1461)

### Definition of Done
- [ ] blast_radius gated; other ops unchanged
- [ ] tsc + vitest + alignment green
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Localized depth gate inside one operation branch.

### Key Components
- **query.ts blast_radius branch** — effectiveDepth gate.
- **query-handler vitest** — depth assertions.

### Data Flow
includeTransitive → effectiveDepth → computeBlastRadius + depthGroups + payload echo.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| query.ts blast_radius branch | depth from maxDepth only | gate on includeTransitive | vitest depth assertions |
| query-handler vitest | tool tests | add gated-depth cases | vitest pass |
| playbook 022 | blast_radius scenario | pass criteria reflect gated default | doc read |

Required inventories:
- In-branch maxDepth uses: `buildDepthGroups([], maxDepth)` ×4 (branch-local), `computeBlastRadius(sourceFiles, maxDepth` ×1, `maxDepth: Math.max(0, maxDepth)` echo ×1. The `Math.max(0, maxDepth)` at query.ts:1008 is a different helper scope — NOT touched.
- Consumers of blast_radius default depth: none programmatic (phase-007 audit).
- Other ops honoring includeTransitive: calls/imports relationship branch — unchanged.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Baseline: query-handler vitest green pre-edit

### Phase 2: Core Implementation
- [ ] Add effectiveDepth gate at blast_radius branch top
- [ ] Route 6 in-branch depth uses through effectiveDepth
- [ ] Add/extend vitest: default→1-hop, includeTransitive→multi-hop
- [ ] Reconcile scenario 022 pass criteria

### Phase 3: Verification
- [ ] tsc build clean
- [ ] vitest query-handler + scan pass
- [ ] alignment verifier clean
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | blast_radius depth gating | vitest |
| Build | type-check | tsc |
| Alignment | changed scope | verify_alignment_drift.py |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| vitest + tsc | Internal | Green | cannot verify |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: tests reveal an unintended consumer dependency.
- **Procedure**: `git checkout -- mcp_server/handlers/query.ts mcp_server/tests/code-graph-query-handler.vitest.ts`; rebuild.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Core (gate + test + 022 doc) ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verification |
| Verification | Core | parent rollup |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 5 min |
| Core | Med | 30 min |
| Verification | Low-Med | 20 min |
| **Total** | | **~1 h** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Changed files git-tracked
- [ ] Test baseline recorded

### Rollback Procedure
1. `git checkout --` query.ts + the test
2. Rebuild dist
3. Restart launcher if new dist loaded

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
