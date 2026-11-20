---
title: "Implementation Plan: Phase 20: review-p1-fixes"
description: "Three small runtime changes in the skill advisor, each with a test that fails first: a refresh drain loop, a read-only coverage read on the recommend path, and an incomplete-coverage reason in advisor_status."
trigger_phrases:
  - "review p1 fixes plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 20: review-p1-fixes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node, ES modules |
| **Framework** | None; the skill advisor daemon and its handlers |
| **Storage** | SQLite through `better-sqlite3`, the skill-graph database |
| **Testing** | Vitest, config `.skilled/skills/system-skill-advisor/runtime/vitest.config.ts` |

### Overview
Change three functions in the advisor runtime: `refreshEmbeddingsInBackground` in `skill-graph-db.ts`, `scoreSemanticShadowLane` in `semantic-shadow.ts` and `readSemanticLaneHealth` in `advisor-status.ts`. Each fix lands with a test that fails on main `03c7fb56e47` and passes after. The two catalog pages that describe the behavior change with the code.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `npx vitest run tests/skill-graph/refresh-in-background.vitest.ts tests/scorer/semantic-shadow-cosine.vitest.ts tests/handlers/advisor-status.vitest.ts` in the runtime prints no failure, and each new test fails with the old source
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Daemon-owned singleton state: one module-level database handle and one in-flight refresh slot per process.

### Key Components
- **`refreshEmbeddingsInBackground`**: the background vector refresh the daemon starts at boot and after each watcher reindex. It gains a request flag and a drain loop, the shape `drainPending` in `lib/daemon/watcher.ts` already uses.
- **`scoreSemanticShadowLane`**: the recommend-path lane. Its coverage gate gets the handle from `getDbReadOnly()`, which returns the daemon's own handle when one is open and a cached read-only handle otherwise.
- **`readSemanticLaneHealth`**: the `advisor_status` semantic-health reader. Its reason chain gains `incomplete_skill_vectors`, and `laneEnabled` already turns false on any reason.

### Data Flow
The watcher reindexes skill rows, then calls the refresh, which embeds rows missing a current vector. The recommend path reads those vectors and checks coverage before scoring. `advisor_status` reads the same coverage and reports the lane state.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Imported from the Planning Packet in `../019-ollama-lane-honest-and-closeout/review/review-report.md`: finding classes `correctness`, `lost_update` and `traceability`; `fixCompletenessRequired: true`.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `skill-graph-db.ts` `refreshEmbeddingsInBackground` | Owns the in-flight refresh slot | update | New reindex-during-refresh test |
| `advisor-server.ts:439`, `watcher.ts:496` | Callers that start a refresh with `void` | unchanged | They keep the same call and ignore the result |
| `semantic-shadow.ts:392` coverage gate | Recommend-path coverage read | update | New no-read-write-handle test |
| `embeddingCoverage` other callers: `skill-graph-db.ts:1451`, `advisor-status.ts:201` | Already pass a handle | unchanged | `rg -n "embeddingCoverage\(" runtime --glob '!**/dist/**'` |
| `advisor-status.ts` reason chain and `laneEnabled` | Status lane health | update | Changed status test |
| `advisor-recommend.ts:595-609` | Reads `disabledReason` from runtime health and status | not a consumer of the new branch | The recommend path sets its own reason first |
| `advisor-tool-schemas.ts:256-260` | `disabledReason` is a nullable string | unchanged | No enum to extend |
| Doctor assets `doctor-skill-advisor-embedder.yaml`, `doctor-setup.yaml` | Read `coverageComplete` and lane state | unchanged | Their PASS rule already needs complete coverage |
| Catalog `background-vector-refresh.md`, `advisor-status.md` | Describe the behavior | update | `rg` for the new sentence |

Required inventories:
- Same-class producers: `embeddingCoverage(database?)` is the only optional-handle signature under `.skilled/skills`, and the lane is its only caller without a handle.
- Consumers of changed symbols: `rg -n 'refreshEmbeddingsInBackground|incomplete_skill_vectors|laneEnabled' .skilled --glob '*.ts' --glob '*.md' --glob '*.yaml'`.
- Matrix axes: refresh (no request during run, one request, several requests, pass throws); coverage read (read-write handle open, none open, file absent); status (weight 0, weight above 0 with full, incomplete or empty coverage).
- Algorithm invariant: a request that arrives while a run is in flight is always followed by a pass that starts after it, and the slot is cleared once no request is pending.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup records the baseline. Implementation writes each test, watches it fail, then fixes the source. Verification reruns the three suites and the full runtime suite.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Refresh drain loop, coverage handle choice, status reason chain | Vitest |
| Integration | Full runtime suite after `skill_graph_scan --trusted` | Vitest |
| Manual | None; no operator-visible flow changes beyond the status fields | N/A |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `better-sqlite3` read-only handles | Internal | Green | The coverage fix would need a per-call handle instead |
| Worktree `worktrees/480-ollama-lane-honest-and-closeout` | Internal | Green | Work would move to a new worktree from sk-git |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the runtime suite gains a failure, or the daemon logs a refresh that does not stop.
- **Procedure**: revert the fix commit on the branch, or the merge commit on main, with `git revert`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | The 019 review report | Implementation |
| Implementation | Baseline test run | Verification |
| Verification | All three fixes | Merge |
<!-- /ANCHOR:phase-deps -->

---
