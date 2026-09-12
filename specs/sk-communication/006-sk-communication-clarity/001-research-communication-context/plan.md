---
title: "Implementation Plan: Phase 1: research-communication-context"
description: "Dispatch independent deep-research lineages over three vendored communication sources through two executor families, with convergence disabled so depth is not cut short."
trigger_phrases:
  - "research lineage plan"
  - "fan-out executors"
  - "no early convergence"
  - "write authority binding"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: research-communication-context

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown artifacts, driven by the deep-loop Node and TypeScript runtime |
| **Framework** | `/deep:research` command workflow with multi-lineage fan-out |
| **Storage** | Append-only JSONL state plus iteration markdown under `research/` |
| **Testing** | State-log inspection and citation resolution, there is no unit surface here |

### Overview

Each source becomes research questions, and each executor family runs its own independent full loop
in its own lineage directory. Convergence is disabled so a lineage runs its full requested depth
rather than stopping when novelty drops. The orchestrator changes nothing outside the lineage tree
while a run is live, because the runner attributes any out-of-lineage change to the lineage,
reverts it and fails the run.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

N independent loops, not wave orchestration. Each lineage is a full research loop with its own
state, its own convergence evaluation and its own synthesis, running under the fan-out pool's
concurrency cap.

### Key Components
- **`/deep:research` workflow YAML**: owns setup, per-iteration dispatch, reducer sync and synthesis.
- **`deep-research` leaf agent**: runs exactly one iteration per dispatch, with a fresh context window.
- **`cli-pi` executor**: reaches DeepSeek V4.1 Flash through the DevPass LLM Gateway on the two-segment bare model id.
- **`cli-codex` executor**: reaches GPT-5.6 LUNA, with reasoning effort and service tier set through config overrides rather than flags.
- **Append gateway**: authorizes and receipts each iteration's single state event, so the state log is never written directly.

### Data Flow

Init writes config, strategy and state log per lineage. Each iteration reads state, picks one
focus, reads the source and the repository surface it concerns, writes `iterations/iteration-NNN.md`,
records one event through the append gateway, and lets the reducer refresh strategy, registry and
dashboard. After the last iteration the workflow synthesizes `research.md` for that lineage.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase is research, not a fix. It has no `research_intent=fix_bug`, no deep-review verdict
behind it, and it changes no producer, consumer, policy or schema. The table is retained with an
explicit not-a-consumer verdict per row rather than deleted, so a later reader can see the question
was asked.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Repository communication stack | The subject the research reads | Unchanged, read-only | The scoped diff shows changes only under this phase folder |
| Projection package source | Not touched by this phase | Not a consumer | `git status` confirms no change under `cli-communication-projection/` |

Required inventories, answered for this phase:
- Same-class producers: none, no behavior is being changed.
- Consumers of changed symbols: none, no symbol is being changed.
- Matrix axes: the axes are source and executor family, and the row set is the lineage matrix in `tasks.md`.
- Algorithm invariant: not applicable, no path, parser, resolver or redaction logic is in scope.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | None, this phase produces documents rather than code | Not applicable |
| Integration | Lineage artifacts exist at their exact paths and hold the recorded iteration count | `find`, state-log read |
| Manual | A sampled citation per lineage resolves to the line it names | Open the cited file at the cited line |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `pi` on PATH with a DevPass credential | External | Yellow, probe before dispatch | No DeepSeek lineage, the LUNA lineage still runs |
| A valid `codex login` session | External | Yellow, pre-flight before dispatch | No LUNA lineage, the DeepSeek lineage still runs |
| `/deep:research` fan-out adapters for both kinds | Internal | Green | No multi-executor run, falls back to sequential single-executor loops |
| Vendored sources under `../context/` | Internal | Green | Nothing to research |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A lineage writes outside its own directory, or a run produces artifacts whose citations do not resolve.
- **Procedure**: The artifacts are untracked additions under this phase folder, so removing the affected lineage directory reverts the run completely. Nothing outside this folder is touched, so no other surface needs reverting.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Pre-flight (executor probes) ──► Lineage dispatch ──► Artifact verification ──► Handoff to 002
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Pre-flight | None | Lineage dispatch |
| Lineage dispatch | Pre-flight | Artifact verification |
| Artifact verification | Lineage dispatch | Handoff to 002 |
| Handoff to 002 | Artifact verification | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Under 30 minutes, dominated by the executor probes |
| Core Implementation | High | Unattended, bounded by the 4 hour per-lineage ceiling |
| Verification | Medium | 30 to 60 minutes of artifact and citation checking |
| **Total** | | **One unattended run plus about an hour of checking** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. Stop the fan-out pool so no lineage writes during the revert
2. Remove the affected lineage directory under `research/`
3. Confirm the scoped diff shows no change outside this phase folder
4. Record why the lineage was discarded, because a discarded run is still evidence about the question

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Not applicable, the artifacts are untracked files under one folder
<!-- /ANCHOR:enhanced-rollback -->

---

