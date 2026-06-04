---
title: "Implementation Plan: Comprehensive Deep-Review + Deep-Research Audit"
description: "Campaign plan: worktree isolation, six gpt-5.5-xhigh fan-out review slices, a deep-research pass, consolidation and integration."
trigger_phrases:
  - "deep review audit plan"
  - "026 audit plan"
  - "fan-out review campaign"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: Comprehensive Deep-Review + Deep-Research Audit

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Engine** | deep-review + deep-research skills (YAML state machines) |
| **Executor** | cli-codex `gpt-5.5` reasoning=xhigh service_tier=fast, fan-out count=5 concurrency=5 timeout=1200s |
| **Isolation** | git worktree `wt/0006-deep-review-audit` off main; scripts run by main abs path, cwd=worktree |
| **Artifacts** | `012-comprehensive-deep-review-audit/{review,research}/` plus summary docs |

### Overview
A maximal audit decomposed into six risk-ordered review slices plus one deep-research pass. Each slice runs a deep-review fan-out of five gpt-5.5-xhigh-fast lineages over a bounded target; lineage outputs merge with strongest-restriction. The research pass investigates the highest-value unconfirmed unknowns the review surfaces. Everything runs inside an isolated worktree so the workspace-write executor cannot touch the main checkout, with a per-loop git-status tripwire.


<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Scope decomposed into bounded slices
- [x] Executor wiring validated against executor-config schema
- [x] Isolation mechanics proven (worktree + abs-path scripts + cwd sandbox)
- [x] Spec folder established (Gate 3 answered: new 026 packet)

### Definition of Done
- [ ] All six slices reviewed with verdicts
- [ ] Deep-research pass complete
- [ ] Top findings adversarially verified
- [ ] Consolidated summary written, validate --strict green, diff clean


<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Sequenced fan-out loops driven through the deep-loop runtime, with each loop's CLI lineages running the full review/research loop in an isolated lineage directory and merged at the end.

### Key Components
- **deep-loop-runtime fanout-run.cjs**: spawns capped pool of cli-codex lineages
- **executor-config.ts**: validates executor + fanout config (kind/model/flags)
- **fanout-merge.cjs**: consolidates lineage outputs (strongest-restriction for review)
- **deep-review / deep-research SKILL.md**: per-lineage loop contract
- **worktree wt/0006**: write isolation boundary; codex `--sandbox workspace-write` rooted here

### Data Flow
1. Build fanout config JSON (5 cli-codex lineages) per slice
2. Run fanout-run.cjs by main abs path with shell cwd = worktree
3. Lineages read the target (read-only intent), write iteration files + report to their lineage dirs
4. Merge lineage reports into the slice review-report.md
5. After all slices, seed deep-research from surfaced unknowns and run a fan-out research loop
6. Consolidate, verify, validate, integrate to main, save memory on main


<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Create worktree off main and prove isolation mechanics
- [x] Create audit packet with spec/plan/tasks
- [ ] Confirm per-lineage iteration propagation in the fan-out spawn path

### Phase 2: Core Implementation
- [ ] Slice 1 MCP core review
- [ ] Slice 2 026 integrity + changelog review
- [ ] Slice 3 feature-catalog + playbook review
- [ ] Slice 4 constitutional + sk-doc/sk-code review
- [ ] Slice 5 interconnected MCPs review
- [ ] Slice 6 027 launch-state review
- [ ] Deep-research pass on surfaced unknowns

### Phase 3: Verification
- [ ] Consolidate + dedupe findings, severity-rank
- [ ] Adversarially verify top findings by direct read
- [ ] validate.sh --strict on main post-merge
- [ ] Diff audit; integrate; memory save


<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Loop convergence | Each slice reaches a verdict | deep-review dashboard + state.jsonl |
| Finding verification | Top P0/P1 confirmed independently | Direct Read of cited file:line |
| Structural validation | Packet docs pass strict gates | validate.sh --strict |
| Isolation check | No writes outside artifacts | git status/diff in worktree |


<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| codex CLI (gpt-5.5) | External | Green | Cannot run executor lineages |
| ChatGPT OAuth | External | Green | Auth failure halts dispatch |
| deep-loop-runtime deps (tsx, zod) | Internal | Green (on main) | fanout-run.cjs cannot start |
| spec-kit MCP servers | Internal | Degraded | Enrichment skipped; save deferred to main |


<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Executor writes outside artifacts, or campaign produces no usable findings
- **Procedure**: Discard the worktree (`git worktree remove`), delete the branch; no main changes occurred


<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──> Review slices 1-6 ──> Deep-research ──> Consolidate/Verify ──> Integrate
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Reviews |
| Review slices | Setup | Research, Consolidate |
| Research | Review slices | Consolidate |
| Consolidate/Verify | Research | Integrate |
| Integrate | Consolidate/Verify | None |


<!-- /ANCHOR:l2-phase-deps -->
---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 0.5 hour |
| Six review slices | High | several hours (5 concurrent lineages per slice) |
| Deep-research pass | Medium | 1-2 hours |
| Consolidate + verify + integrate | Medium | 1-2 hours |
| **Total** | | **multi-hour campaign** |


<!-- /ANCHOR:l2-effort -->
---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Clean baseline isolated (worktree off main HEAD)
- [x] Executor sandbox confirmed OS-rooted at worktree
- [x] Per-loop git-status tripwire defined

### Rollback Procedure
1. **Immediate**: Stop any running fan-out (TaskStop) and kill orphan codex processes
2. **Inspect**: `git -C <worktree> status` to see what was written
3. **Discard**: `git worktree remove --force .worktrees/0006-deep-review-audit` and delete branch
4. **Verify**: main checkout unchanged apart from pre-existing uncommitted files

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Worktree removal fully reverses the campaign; main is untouched

<!-- /ANCHOR:l2-rollback -->

---
