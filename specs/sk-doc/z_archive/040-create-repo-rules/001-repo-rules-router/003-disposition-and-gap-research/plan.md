---
title: "Implementation Plan: Phase 3: Disposition and Rule-Set Gap Research"
description: "Run a five-iteration deep-research loop with convergence forced to telemetry, on a DeepSeek V4 Flash max-thinking executor, over the shipped rule set, AGENTS.md, and the history of the retired governor directive. Write authority is bound to this phase folder so the run can only propose; the single durable output is a ranked recommendation list phase 4 consumes."
trigger_phrases:
  - "deep research plan"
  - "five iteration loop"
  - "max iterations stop policy"
  - "write containment"
  - "ranked recommendations"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: Disposition and Rule-Set Gap Research

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Deep-research loop over markdown and git history; JSONL state |
| **Framework** | `system-deep-loop` deep-research mode, driven by the `/deep:research` command contract |
| **Storage** | `research/` inside this phase folder: state log, strategy, findings |
| **Testing** | State-log assertions (iteration count, route-proof fields), citation audit, working-tree containment check |

### Overview
Run the deep-research loop for a fixed five iterations against the shipped rule set, `AGENTS.md`, and the history of the retired governor directive. Convergence is forced to telemetry so the loop cannot end early and call five iterations' worth of depth done in two. The executor is DeepSeek V4 Flash at its maximum thinking tier, dispatched through the CLI orchestration layer whose own skill document is read before the prompt is composed. The loop's only durable output is a ranked recommendation list; nothing it produces is applied here.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phases 1 and 2 landed, so the rule set under study is the final one
- [x] The executor's skill document read and its dispatch contract understood
- [x] Write authority bound to this phase folder before any dispatch
- [x] Research questions fixed and recorded in `spec.md` section 3

### Definition of Done
- [x] Five iteration records in the state log, each carrying route-proof fields
- [x] Every RQ answered, including any "no change warranted"
- [x] At least one subtraction candidate, or an explicit statement that none was found
- [x] `git diff --stat` shows no change under `repo-rules/`, `REPO RULES.md`, or `AGENTS.md`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Command-owned loop with a leaf research agent. The command owns setup, dispatch-per-iteration, state reduction, and synthesis; the leaf owns one iteration's artifacts. This phase composes the invocation and verifies the output - it does not run the loop by hand, which would be the plan-workflow substitution `AGENTS.md` section 1 forbids.

### Key Components
- **Loop configuration**: five iterations, max-iterations stop policy, bound spec folder as write authority.
- **Executor binding**: DeepSeek V4 Flash, maximum thinking tier, dispatched through the CLI orchestration layer.
- **Research corpus**: the seven governance files, `AGENTS.md`, commit `4477a9f1` and its packet under `specs/hooks/007-fable-governor-pi-hook/`, and `../../../../agents/004-agents-md-bloat-audit/`.
- **Output reducer**: `research/research.md`, ending in the ranked recommendation table phase 4 consumes.

### Data Flow
Setup binds folder, model and iteration count, and persists the run configuration. Each iteration dispatches with the accumulated state, writes its record, and updates findings. After iteration five, synthesis produces the ranked list. Phase 4 reads only that list.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The research reads doctrine surfaces and must write to none of them. The inventory below is a containment inventory.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `repo-rules/*.md` (7 files after phase 2) | The rules under study | read-only | `git diff --stat -- repo-rules/` empty after the run |
| `REPO RULES.md` | Router under study | read-only | `git diff --stat -- 'REPO RULES.md'` empty after the run |
| `AGENTS.md` | Always-loaded document under study | read-only | `git diff --stat -- AGENTS.md` empty after the run |
| Commit `4477a9f1` and `specs/hooks/007-fable-governor-pi-hook/` | Evidence for RQ3 | read-only | Citations in `research.md` resolve to real lines |
| `research/` in this folder | The run's only write target | create | Artifacts present; no file written outside this folder |

Required inventories:
- Same-class producers: `rg -n 'GOVERNOR_DIRECTIVE|governor' --glob '*.ts' --glob '*.mjs' --glob '*.md'` across the advisor surfaces, so RQ3 reasons from what the directive actually said.
- Consumers of changed symbols: none - this phase changes nothing.
- Matrix axes: RQ (5) x evidence class (current doc, git history, prior packet); every RQ needs at least one citation outside the current documents.
- Algorithm invariant: the working tree outside this phase folder is byte-identical before and after the run.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

`tasks.md` owns the numbered task state (T001-T020); the stages below say what each one has to establish before the next can start.

### Phase 1: Bind
- [x] Executor skill document read before any prompt is composed
- [x] Write authority, iteration count and stop policy bound and persisted

### Phase 2: Run
- [x] Five iterations dispatched, one research question each
- [x] Findings accumulated with citations rather than assertions

### Phase 3: Synthesize and assert
- [x] Ranked recommendation list produced, each item naming a target file and a failure prevented
- [x] Iteration count, executor configuration, citations and containment all verified
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| State assertion | Exactly five iteration records, each with route-proof fields | `jq` / `grep -c` over `deep-research-state.jsonl` |
| Config assertion | Recorded executor is DeepSeek V4 Flash at max thinking | Read the persisted run configuration |
| Citation audit | Every finding names a file, line, commit, or command | Sample every finding; resolve each citation |
| Containment | No write outside this phase folder | `git status --porcelain` scoped to the repository root |
| Coverage | Each of RQ1-RQ5 has an explicit answer | Section presence check in `research.md` |
| Packet gate | Spec docs validate | `validate.sh <folder> --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 1 and 2 landed | Internal | Yellow until they close | Research would judge a rule set that no longer exists |
| `cli-devin` present and authenticated | External | Green - binary present at version 3000.6.7 | No executor; report as a blocker rather than substituting a different model silently |
| DeepSeek V4 Flash max-thinking uid in the executor roster | External | Green - listed in the curated roster | The thinking tier could not be guaranteed |
| Deep-research command contract and workflow assets | Internal | Green | The loop would have to be hand-rolled, which the plan-workflow lock forbids |
| `../../../../agents/004-agents-md-bloat-audit/` | Internal | Green | RQ2 would have to re-measure what is already measured |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the run writes outside this phase folder, returns fewer than five iterations without an explained blocker, or produces findings with no citations.
- **Procedure**: delete `research/` in this folder and re-run with corrected binding. Nothing outside the folder is touched, so there is no wider revert - that containment is the reason the research phase writes nowhere else.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Read executor contract --> Bind config (folder, model, 5 iters) --> Run loop --> Synthesize --> Assert (count, citations, containment)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Read executor contract | Phases 1-2 landed | Bind config |
| Bind config | Read executor contract | Run loop |
| Run loop | Bind config | Synthesize |
| Synthesize | Run loop | Assert |
| Assert | Synthesize | Packet phase 4 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 1 hour - reading the executor contract is the bulk of it |
| Core Implementation | Medium | 5 iterations, wall-clock dominated by the executor |
| Verification | Low | under an hour |
| **Total** | | **half a day, mostly unattended** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Working tree clean before the run, so containment is provable afterwards
- [x] Write authority bound to this phase folder
- [x] Executor availability confirmed, not assumed

### Rollback Procedure
1. Stop the lineage
2. Salvage any partial `research/` artifacts before deleting, since a partial run still carries evidence
3. Delete `research/` and re-bind
4. Confirm `git status` shows no change outside this phase folder

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A - the run's only persistent effect is files inside this folder
<!-- /ANCHOR:enhanced-rollback -->

---

