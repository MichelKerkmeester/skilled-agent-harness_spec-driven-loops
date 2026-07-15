---
title: "Implementation Plan: 028 Playbook Findings Remediation [template:level_2/plan.md]"
description: "The cluster-by-cluster remediation approach for the playbook validation findings. gpt-5.5-fast high authored the fixes in eight clusters in worktree wt/0008-findings-remediation, each cluster verified by vitest plus typecheck plus mutation checks on the risky fixes plus comment hygiene plus alignment drift, then committed; the commits are landed on the 028 review-branch mainline. Status complete and code verified per cluster; a whole-suite run across all clusters together, before the 028 branch merges to main, is pending."
trigger_phrases:
  - "playbook findings remediation plan"
  - "028 remediation cluster approach"
  - "gpt-5.5-high cluster verification"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/000-release-cleanup/012-playbook-findings-remediation"
    last_updated_at: "2026-07-04T17:31:28.233Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Documented the cluster-by-cluster approach and the per-cluster verification gate"
    next_safe_action: "Run the whole suite across all clusters together before the 028 review branch merges to main"
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-25-plan-012-playbook-findings-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 028 Playbook Findings Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript memory-search and advisor surfaces plus the code-graph MCP, Python for the advisor disabled-hook path |
| **Framework** | Vitest for the test gate, tsc for typecheck, the comment-hygiene and alignment-drift gates |
| **Storage** | Same SQLite stores the findings reference, fixed at the schema and write-path boundary |
| **Testing** | Per-cluster vitest blast-radius sweep plus mutation checks on the risky fixes |

### Overview
The findings cluster by failure mode, so the remediation was sequenced as eight clusters A through H rather than file by file. gpt-5.5-fast high took one cluster at a time in an isolated worktree, landed the fix and its test, then ran a per-cluster verification gate before committing. The gate is vitest over the cluster's full blast radius, a real-repo typecheck, a mutation check on each risky fix that reintroduces the bug and confirms the test goes red, and the comment-hygiene and alignment-drift gates. Each cluster became one commit so the remediation reads finding by finding. Two follow-up test commits and a phase re-parenting migration close the sequence.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Findings registry triaged into eight clusters by failure mode
- [x] Isolation and harness artifacts separated from real product findings
- [x] Isolated worktree proven able to run the integration suites

### Definition of Done
- [x] All eight clusters fixed and committed
- [x] Each cluster passes vitest, typecheck, hygiene and drift
- [x] Risky fixes mutation-checked True-RED
- [ ] Whole-suite run across all clusters together before the 028 review branch merges to main (not met, held open as the next safe action)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern: cluster-by-cluster fix with a per-cluster verification gate

Each cluster groups findings that share a failure mode and a blast radius. The fix lands with a test that distinguishes the fixed behavior, then the cluster runs its verification gate before it is committed. The gate proves three things: the fix passes, the neighbors still pass under the full blast-radius sweep, and the risky fix actually closed a real bug because reverting it turns the distinguishing test red.

### Key Components

| Component | Role |
|-----------|------|
| Cluster triage | Groups the findings by failure mode into A through H |
| Fix executor | gpt-5.5-fast high lands the source fix plus its test per cluster |
| Verification gate | vitest blast-radius sweep, typecheck, mutation check, hygiene, drift |
| Mutation check | Reintroduces the bug and confirms the distinguishing test fails |
| Commit boundary | One commit per cluster so the remediation reads finding by finding |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Cluster A schema drift (P0)
Guard the source_kind select on narrow schemas, align the adaptive consumption insert to query_hash. Add the reconsolidation merge-contract and the schema-contract tests. Commit `adbcc65e83`.

### Phase 2: Cluster B wiring (P1, dominant theme)
Wire five implemented-but-dead features into the runtime: scoring observability, LLM backfill registration, llm-reformulation, query-surrogates and the contextual-tree header. Commit `e5b4735c4b`.

### Phase 3: Cluster C retrievalLevel (P1)
Honor retrievalLevel local, global and auto end to end, add the missing strict public input schema field, key the cache by level. Commit `f0e063eed4`.

### Phase 4: Cluster D ordering (P1)
Make folder rank the primary sort key and reserve a top-k slot per active channel below the floor. Commit `cbf4f4d111`.

### Phase 5: Cluster E advisor persistence (P0/P1)
Re-map routing to leaf skills, sanitize the skill_nodes index path, fix the validate-scorer, clear lifecycle fields on rollback, surface the F5 warm-latency gate (the bench already exits non-zero on failure, so no source fix was needed there), error force-native when the hook is disabled. Commit `917ad633a3`.

### Phase 6: Cluster F DB lifecycle (P2)
Standardize db-path resolution in `core/config.ts`, add a new end-to-end test that exercises the pre-existing cross-process rebind machinery, and fix the embedding-retry e2e. Commit `f27945593e`.

### Phase 7: Clusters G and H code-graph and quality (P2)
Recompute stale files on write-local refresh, extract the duplicate scope helper, update the two stale tests, fix entity dedup normalization and confirm the 7-layer metadata surface. Commit `3291c05389`.

### Phase 8: Follow-up tests and re-parenting
Add the dedicated B4 surrogate index-time, B5 contextual-tree header and C strict-schema tests. Commit `374ca93caa`. Re-parent the post-phase-6 phases under their relevant parents. Commit `64d064d868`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Vitest is the gate and runs per cluster over the full blast radius, not just the changed file, so a fix cannot pass while breaking a neighbor. Each risky fix carries a distinguishing test, and a mutation check reintroduces the bug to confirm the test goes red, so a green suite cannot hide a fix that never proved the bug. Typecheck runs against the real repo per cluster. Comment hygiene and alignment drift run on every touched surface. The two follow-up commits add the dedicated invocation tests that B4, B5 and the C strict schema were carrying as test holes when their fixes first landed.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Why |
|------------|-----|
| The packet 011 findings registry | The source list of real findings and their root causes |
| An isolated worktree with working integration suites | Run the blast-radius sweeps without touching the real repo |
| gpt-5.5-fast high as the fix executor | Lands the source fix plus its test per cluster |
| The mutation-check discipline | Proves each risky fix closed a real bug |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Each cluster is one commit landed on the 028 review-branch mainline (system-speckit/004-memory-search-intelligence), so any single cluster can be reverted without touching the others. The 028 review branch is not yet merged to main, so the whole remediation can still be held or dropped at the 028-to-main boundary. The next safe action is a whole-suite run across all clusters together before the 028 branch merges to main.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## 8. PHASE DEPENDENCIES

| Phase | Depends on |
|-------|-----------|
| 1 Cluster A | findings triage |
| 2 Cluster B | none, parallel to A |
| 3 Cluster C | B wiring landed (shares stage1-candidate-gen) |
| 4 Cluster D | none |
| 5 Cluster E | none |
| 6 Cluster F | none |
| 7 Clusters G and H | none |
| 8 Follow-up tests | B, C landed |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## 9. EFFORT

| Phase | Estimate |
|-------|----------|
| Per cluster | One fix-and-verify pass each |
| Mutation checks | One revert-and-confirm per risky fix |
| Follow-up tests | One authoring pass |
| Re-parenting | One migration pass |

Actual: all eight clusters landed on the 028 review-branch mainline and verified per cluster across seven fix commits plus a follow-up test commit and a re-parenting commit. The whole-suite run across all clusters together, before the 028 branch merges to main, is open.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## 10. ENHANCED ROLLBACK AND RECOVERY

The work was authored in worktree wt/0008-findings-remediation and the fix commits are landed on the 028 review-branch mainline (system-speckit/004-memory-search-intelligence). The 028 review branch is not yet merged to main, so no fix has reached main and there is no production state to recover. The per-cluster commit boundaries mean a regression traced to one cluster can be reverted in isolation. During cluster B the gpt-5.5 dispatch was cut at the cap mid-B5, but all five call sites had already landed, and the worktree node_modules workspace resolution was repaired so the integration suites could run. The one C schema field that gpt-5.5 had correctly flagged as out of its granted scope was closed directly rather than re-dispatched for a two-line mirror.
<!-- /ANCHOR:enhanced-rollback -->
