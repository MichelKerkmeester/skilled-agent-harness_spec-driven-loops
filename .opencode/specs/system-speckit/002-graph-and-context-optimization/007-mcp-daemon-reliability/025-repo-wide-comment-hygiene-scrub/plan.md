---
title: "Implementation Plan: Repo-wide comment-hygiene scrub"
description: "Run three parallel gpt-5.5 agents over disjoint clusters of live-code files to scrub perishable comment labels to durable WHY, verified by the extended hygiene checker."
trigger_phrases:
  - "repo-wide comment hygiene plan"
  - "perishable label scrub plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/007-mcp-daemon-reliability/025-repo-wide-comment-hygiene-scrub"
    last_updated_at: "2026-06-07T21:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Three gpt-5.5 agents scrubbed 40 live-code files; all clean under the checker"
    next_safe_action: "Reconcile docs, commit and push"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/scripts/check-comment-hygiene.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-025-repo-wide-comment-hygiene-scrub"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Repo-wide comment-hygiene scrub

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, JavaScript, CommonJS, Python comments |
| **Framework** | None; comment-only edits across the live codebase |
| **Storage** | None |
| **Testing** | The extended comment-hygiene checker plus per-file syntax checks |

### Overview
Three gpt-5.5 agents each take a disjoint cluster of live-code files and rewrite every flagged comment to keep its reason and drop the perishable label. The extended checker is the verification gate, and syntax checks confirm no edited file broke.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Blast radius measured and exclusions chosen
- [x] Files partitioned into disjoint clusters
- [x] Checker available as the verification gate

### Definition of Done
- [ ] All 40 files clean under the checker
- [ ] Syntax checks pass for every edited file
- [ ] Docs updated and packet validated
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Parallel fan-out by directory cluster with a deterministic linter as the gate.

### Key Components
- **check-comment-hygiene.sh**: the extended linter that flags perishable labels.
- **Three cluster agents**: disjoint file sets, comment-only edits.

### Data Flow
Each agent runs the checker per file, edits the flagged comments, and re-runs the checker until its cluster is clean. The orchestrator then re-runs the checker over all 40 files and spot-checks diffs.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Live-code comments | Carry ADR/REQ/packet/DR/phase/seat labels | Rewrite to durable WHY | extended checker exit 0 per file |
| String literals (test names) | Hold historical IDs as data | Unchanged | checker never flags strings; diff review |
| Code and logic | The behavior under the comments | Unchanged | syntax checks plus comment-only diff stat |

Required inventories:
- Backlog: `check-comment-hygiene.sh` over all live code files, partitioned into clusters A, B, and C.
- Exclusions: `z_archive`, `scratch`, benchmarks, fixtures, `specs/**` packet-local scripts, and the pattern-defining tools.
- Invariant: only comment text changes; every file must end clean under the checker.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Measure the repo-wide backlog and choose exclusions
- [x] Partition into three disjoint clusters
- [x] Scaffold the Level 2 packet

### Phase 2: Core Implementation
- [x] Cluster A agent scrubs system-spec-kit core
- [x] Cluster B agent scrubs code-graph, advisor, bin, plugins
- [x] Cluster C agent scrubs deep-stack, sk-code, sk-doc

### Phase 3: Verification
- [ ] Checker clean across all 40 files
- [ ] Syntax checks and diff spot-checks pass
- [ ] Documentation updated and packet validated
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Lint | Perishable labels in comments | check-comment-hygiene.sh |
| Syntax | Edited cjs, js, py | node --check, py_compile |
| Review | Meaning preserved, comments only | git diff spot-checks |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Extended checker from 024 | Internal | Green | No way to detect the backlog |
| codex CLI (gpt-5.5) | External | Green | Orchestrator scrubs manually |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A syntax break or a meaning-losing rewrite found in review.
- **Procedure**: Revert the packet commit; all edits are comment-only and isolated to the 40 files.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core, 3 parallel clusters) ──► Phase 3 (Verify)
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
| Setup | Low | Done |
| Core Implementation | Medium | Three parallel agents |
| Verification | Low | Checker, syntax, diff review |
| **Total** | | One working session |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Clusters disjoint so parallel edits cannot conflict
- [ ] Checker clean across all 40 files
- [ ] Diff spot-checks confirm comments only

### Rollback Procedure
1. Identify the packet commit hash.
2. `git revert` the commit.
3. Re-run the checker and syntax checks to confirm the revert is clean.
4. No stakeholder notice needed; comments only.

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
