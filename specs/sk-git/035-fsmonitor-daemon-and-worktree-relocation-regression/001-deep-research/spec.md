---
title: "Feature Specification: Phase 1: deep-research"
description: "Find out why the main checkout's fsmonitor daemon stops answering and why daemons pile up across worktrees, and design a fix the later phases can build."
trigger_phrases:
  - "deep research"
  - "phase 1 deep research"
  - "fsmonitor daemon root cause"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 1: deep-research

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-27 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 4 |
| **Predecessor** | None |
| **Successor** | 002-worktree-relocation-restore |
| **Handoff Criteria** | All five questions in `../scratch/findings.md` section 8 are answered in `research/research.md`, with a fix design per layer |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the fsmonitor daemon leak and worktree relocation regression specification.

**Scope Boundary**: Research only. This phase reads code, git's source and the live process table. It changes no code and stops no daemon.

**Dependencies**:
- `../scratch/findings.md`, the observed symptom record and the five questions.
- `cli-opencode` with DeepSeek V4.1 Flash at `max` effort, run through the deep-loop fan-out.

**Deliverables**:
- `research/research.md`, the merged synthesis.
- `research/resource-map.md` and `research/fanout-attribution.md`.
- One lineage folder per research lane under `research/lineages/`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A `git push` stalled for about 30 minutes because a `git check-ignore` waited on an fsmonitor daemon that never answered, and two more main daemons wedged the same morning. Twelve daemons were alive at once, and the worktree relocation from sk-git/026 had quietly reverted. Nobody knew whether the wedge was load, a git bug, or repository code, so no fix could be chosen.

### Purpose
Answer the five questions in `../scratch/findings.md` section 8 with sourced evidence, and turn the answers into a layered fix design that phases 002 to 004 can implement.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ for d in research/lineages/*/; do printf '%s iterations=%s\n' "$d" "$(ls "$d"/iterations | wc -l)"; done
research/lineages/llmgateway-flash-1017/ iterations=3
research/lineages/llmgateway-flash-undated-run2/ iterations=3
research/lineages/llmgateway-flash-undated/ iterations=1
research/lineages/opencode-go-flash/ iterations=0

$ wc -l research/research.md research/resource-map.md
     266 research/research.md
     136 research/resource-map.md
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run six DeepSeek V4.1 Flash iterations at `max` effort through `cli-opencode`, three per lane, two lanes in parallel.
- Trace the regression of sk-git/026's worktree relocation and reaper daemon handling through git history.
- Read git v2.50.1's fsmonitor daemon, health and IPC source to settle whether the wedge is a known unbounded wait.
- Inventory the repository's git calls that run without a timeout or fsmonitor opt-out.
- Merge the lanes into one synthesis with a fix design per layer.

### Out of Scope
- Changing any code or config - phases 002 to 004 own the fixes.
- Measuring fsmonitor's speed benefit - it would write the index of a checkout whose daemon wedges.
- Fixing the deep-loop runner's failed `resume` - it belongs to `system-deep-loop`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/research.md` | Create | Merged synthesis of all lanes |
| `research/resource-map.md` | Create | Resource map emitted by the reducer |
| `research/fanout-attribution.md` | Create | Which lane contributed which finding |
| `research/lineages/*/` | Create | Per-lane iterations, state and synthesis |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `research/research.md` answers all five questions from `../scratch/findings.md` section 8, each with a source tag or an explicit UNKNOWN or INFERRED mark. |
| REQ-002 | `research/research.md` holds a fix design with one section per layer, naming the files and lines each later phase changes. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Two research lanes run in parallel at three iterations each on DeepSeek V4.1 Flash at `max` effort. |
| REQ-004 | The synthesis states how independent the lanes are, and the orchestrator checks the load-bearing git source claims directly. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg -n '^### Q[1-5]\.' research/research.md` prints five lines.
- **SC-002**: `rg -n '^### Layer [1-4]' research/research.md` prints four lines.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | opencode-go provider quota | A lane cannot run | Move the lane to llmgateway with the operator's approval, which is what happened |
| Risk | A research lane runs an index-reading git command and hangs on the wedged daemon | High | Lanes use read-only commands that skip the index, and the orchestrator ends a wedged daemon when a lane stalls |
| Risk | The second lane copies the first lane's conclusions | Med | The synthesis marks lane agreement as not independent and the orchestrator verifies the git source claims itself |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A. A research phase runs no service.

### Security
- **NFR-S01**: Research lanes read code and process lists only. They write inside `research/` and never signal a process.

### Reliability
- **NFR-R01**: Every claim in the synthesis carries a source tag, or an UNKNOWN or INFERRED mark with the check that would settle it.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a lane that gets no model reply records zero iterations and the merge skips it, as `opencode-go-flash` did.
- Maximum input: N/A. Iterations are capped at three per lane by `--stop-policy max-iterations`.
- Failure path: a lane interrupted mid-iteration keeps its finished iterations, and a fresh lane label reruns the work.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | Research artifacts in one folder, no code |
| Risk | 4/25 | Read-only, apart from the hang risk on index reads |
| Research | 18/20 | git C source, repository history and live process state |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None block this phase. The unverified items, each with its resolving check, are listed in `research/research.md` section 10.
<!-- /ANCHOR:questions -->

---
