---
title: "Implementation Plan: Phase 005 — Consumer-specific merges + synthesis hooks"
description: "Reconstructed Level 2 implementation plan for the consumer-merge phase. It restates the spec.md purpose, scope and success criteria; the original plan was never written."
trigger_phrases:
  - "consumer merges synthesis plan"
  - "fanout merge research review plan"
importance_tier: "important"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Implementation Plan: Phase 005 — Consumer-specific merges + synthesis hooks

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js runtime script (`fanout-merge.cjs`) plus the deep-loop YAML command assets |
| **Framework** | deep-loop-runtime fan-out feeding the existing synthesis compilers |
| **Storage** | Consolidated findings registries plus `{artifact_dir}/fanout-attribution.md` |
| **Testing** | Unit merge cases plus a two-lineage fixture integration check |

### Overview
Consolidate the isolated lineage packets into one canonical output per consumer, reusing the existing synthesis compilers instead of adding a parallel report writer.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 003 spawn path and Phase 004 salvage available
- [ ] Existing synthesis compilers' input registries understood

### Definition of Done
- [ ] Research dedup and cross-model attribution produce the consolidated registry
- [ ] Review severity rollup keeps strongest-restriction (any active P0 forces merged FAIL)
- [ ] `validate.sh` passes for this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Reuse-first: the merge reducer writes the existing per-consumer findings registries, and the already-present synthesis steps emit the canonical reports.

### Key Components
- `fanout-merge.cjs` (`--loop-type research|review`)
- `step_fanout_merge` at the top of each `phase_synthesis`, gated on `config.fanout`
- Existing `step_compile_research` and the review synthesis step
- `{artifact_dir}/fanout-attribution.md` writer

### Data Flow
Every `{artifact_dir}/lineages/{label}/` registry, iterations and state log is read, deduped (research) or severity-rolled-up (review), written to the consolidated findings registry, and passed to the existing synthesis compiler.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns task state.

### Phase 1: Merge script
- [ ] Author `fanout-merge.cjs` and its research and review merge paths

### Phase 2: Synthesis hooks
- [ ] Add `step_fanout_merge` to both `phase_synthesis` steps in all 4 YAMLs

### Phase 3: Verification
- [ ] Unit merge cases plus a two-lineage fixture integration check
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Unit coverage for research dedup/attribution and review rollup/strongest-restriction, plus one two-lineage fixture producing a canonical report of unchanged shape; exact command output is Not recorded.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 003 per-lineage spawn path | Internal | Not recorded | No per-lineage registries to merge |
| Phase 004 salvage sweep | Internal | Not recorded | Salvaged iterations would be dropped from the merge |
| Existing synthesis compilers | Internal | Existing | Merged output would need a parallel report writer |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Not recorded — no rollback steps were captured when the phase was worked.
<!-- /ANCHOR:rollback -->
