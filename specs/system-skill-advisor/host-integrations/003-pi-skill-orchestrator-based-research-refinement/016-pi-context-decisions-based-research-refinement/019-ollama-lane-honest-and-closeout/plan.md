---
title: "Implementation Plan: Phase 19: ollama-lane-honest-and-closeout"
description: "Luna builds the lane fixes, the watchdog gap and the harness update as leaves behind failing tests. The conductor runs one real-embedding ablation to the pass bar, settles the default weight, hunts the flakes and writes ended sessions' answers into their packets."
trigger_phrases:
  - "ollama lane honest and closeout plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 19: ollama-lane-honest-and-closeout

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript advisor runtime, CommonJS launcher |
| **Framework** | None: Node daemon behind the launcher |
| **Storage** | Skill-graph SQLite vectors; the heartbeat file |
| **Testing** | Vitest, the Python scorer suite, the opt-in ablation harness with a local Ollama |

### Overview
Each lane fix keys off the resolved lane weight, so at the default weight 0 the daemon still makes no Ollama call. The refresh helper returns at once at weight 0. The coverage gate and the outage-degraded mark only matter while the lane scores. The ablation runs once, with the harness scoring its full arm at a candidate 0.05, and its outcome sets the default weight.
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
- [ ] Every baseline suite passes, with each delta explained in `implementation-summary.md`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Guard clauses keyed on the resolved lane weight, inside the existing daemon, scorer and launcher.

### Key Components
- **`refreshSkillEmbeddingsWhenLaneLive`**: the one refresh entry point for the daemon. It does nothing at weight 0.
- **Coverage gate**: the lane scores only when every described skill has a vector.
- **Outage mark**: a failed prompt embed adds `semantic_shadow` to the call's runtime lane health.
- **Watchdog grace**: no heartbeat 5 minutes after spawn counts as stale, and the child always gets the launcher's database directory.

### Data Flow
Startup scan or watcher reindex, then the refresh helper, which refreshes only above weight 0, then the vectors. A prompt then goes through the embed wrapper, then the scored closure, which reads the lane health and marks it degraded on failure, then fusion, which leaves the degraded lane out of the live total.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Refresh failure path in `skill-graph-db.ts` | Deletes a vector on any embed failure | Update: keep it | Outage test asserts the vector survives |
| Lane scoring in `semantic-shadow.ts` | Scores any skill with a vector | Update: full-coverage gate | Cosine test with a missing vector |
| Recommend handler | Leaves the lane in the live total on outage | Update: degraded mark | Handler test |
| Launcher child env | Strips `OLLAMA_*`, leaves the database directory to the default | Update | Bin tests |
| Shared cascade | Read by other skills | Unchanged | `git diff --stat` on `system-spec-kit/shared` is empty |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup starts the flake reruns on main and maps each orphan session to its packet. Implementation lands the six leaves behind failing tests, then runs the ablation with a local `ollama serve` and applies its outcome. Verification reruns every suite, checks the live daemon, writes the orphan answers and merges. Ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Refresh helper, outage keep, coverage gate, degraded mark, child env, watchdog grace | Vitest |
| Integration | Full runtime, bin, Python and spec-kit suites; the opt-in ablation | Vitest, local Ollama |
| Manual | A daemon refresh to full coverage with the lane on, then the status block on main | `skill-advisor.cjs advisor_status` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Luna through cli-codex | External | Green | Stop and ask; fallback is Vibe DeepSeek V4.1 Flash `max` |
| Local `ollama serve` with `nomic-embed-text` | External | Green | No ablation; the weight stays 0 and REQ-005 is blocked |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a fix breaks a suite, or a decision record lands in the wrong packet.
- **Procedure**: revert the merge commit on main. A misplaced decision record entry reverts with its own commit, one per packet.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Worktree 480 | Implementation |
| Implementation | The harness update and a running Ollama for the ablation | Verification |
| Verification | Every leaf green and the ablation outcome applied | Merge and push |
<!-- /ANCHOR:phase-deps -->

---
