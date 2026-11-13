---
title: "Implementation Plan: Phase 9: ux-performance-cross-cli-research"
description: "Two research segments over the ux, performance and cross-cli lanes. Segment one ran before phases 005 to 008 were built and merged three lineages into one ranked list. Segment two reruns against the built state until it converges, then each recommendation gets a disposition."
trigger_phrases:
  - "ux performance cross cli research plan"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 9: ux-performance-cross-cli-research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown and JSON state written by the deep-research loop |
| **Framework** | `/deep:research` fan-out with one lineage per lane |
| **Storage** | `research/` in this folder, one subfolder per lineage under `research/lineages/` |
| **Testing** | `validate.sh --strict` on this folder and the orchestrator's re-checks marked `[CHECKED]` in `research/research.md` |

### Overview
A fan-out deep research runs one lineage per lane: `ux`, `performance` and `cross-cli`. Each lineage iterates until it converges or hits its cap and writes its own synthesis under `research/lineages/<label>/research.md`. The orchestrator merges, deduplicates and ranks them into `research/research.md`. Segment two repeats the run once phases 005 to 008 are built, so the list reflects what those phases actually changed.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The research question and the three lanes are set (`spec.md` section 3).
- [x] The research rules are set: no holdout rows, no CLI arm runs and read-only git (`research/research.md` section 2).
- [ ] Segment two: phases 005 to 008 are built and phase 007 has recorded its after arm.

### Definition of Done
- [ ] Segment two has converged and its synthesis is merged under `research/`.
- [ ] Every row of the disposition table in `tasks.md` reads `built in <phase>` or `declined: <reason>`.
- [ ] `validate.sh --strict` on this folder prints `RESULT: PASSED`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fan-out, then merge. Each lineage owns one lane and its own state. The merge step owns ranking and conflict resolution.

### Key Components
- **Lineage `ux`**: brief content, offer, ask and start, discovery and the external install path.
- **Lineage `performance`**: hook time, the embedder, cold start and token cost.
- **Lineage `cross-cli`**: start behaviour per runtime on Claude Code, Codex, OpenCode, Pi, Devin and DSH.
- **Merged synthesis** (`research/research.md`): the ranked list in section 9, the conflicts in section 8 and the open questions in section 12.

### Data Flow
1. Each lineage reads the planned phases, the phase 007 before arm and the runtime surfaces.
2. Each iteration writes `research/lineages/<label>/iterations/iteration-NNN.md` and updates the lineage state.
3. The orchestrator merges the lineage syntheses and registries into `research/research.md` and `research/findings-registry.json`.
4. The disposition of each ranked item is recorded in `tasks.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Segment one (done 2026-11-12) ran three lineages `ux`, `performance` and `cross-cli` with DeepSeek v4.1 flash at max effort through OpenCode Go, for 5, 5 and 3 iterations, merged into `research/research.md` (`research/deep-research-config.json`, `research/fanout-attribution.md`). Segment two (planned) reruns the same lanes against the built phases 005 to 008 and the phase 007 after-arm behaviour log until it converges. Disposition then records each of the 14 ranked recommendations as built in a named phase or declined with a reason. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | The three packet documents and their anchors | `validate.sh --strict` |
| Evidence | Load-bearing claims of the synthesis | The orchestrator's `[CHECKED]` re-reads against source, listed in `research/research.md` section 15 |
| Disposition | Every ranked item has a recorded outcome | The disposition table in `tasks.md` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 005 to 008 built | Internal | Pending | Segment two cannot start |
| Phase 007 after arm (`../007-per-runtime-behaviour-proof/scratch/`) | Internal | Pending | Segment two cannot judge whether an offer moves a start |
| OpenCode Go access for the executor | External | Green for segment one | Segment two waits or runs with an operator-approved executor |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A segment produces a synthesis that cannot be trusted, for example a lineage that read a holdout row.
- **Procedure**: Remove the segment's files under `research/` and rerun it. No code changes in this child, so nothing else needs reverting.
<!-- /ANCHOR:rollback -->
