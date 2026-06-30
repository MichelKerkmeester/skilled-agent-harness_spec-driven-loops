---
title: "Implementation Plan: ui-ux-pro-max-merge-research"
description: "Plan for a 10-iteration parallel-by-model deep-research loop assessing how the vendored MIT ui-ux-pro-max repo can merge into and improve sk-design-interface. Research-only; the deliverable is a merge recommendation, not a skill change."
trigger_phrases:
  - "ui-ux-pro-max merge plan"
  - "sk-design-interface research plan"
  - "design data merge research"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/001-sk-design-interface/002-ui-ux-pro-max-merge-research"
    last_updated_at: "2026-06-13T16:50:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Research loop complete; plan reflects the executed approach"
    next_safe_action: "Operator reviews research/research.md merge recommendation"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-148-002-ui-ux-pro-max-merge-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: ui-ux-pro-max-merge-research

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Deep-research loop (Node `fanout-run.cjs` + per-lineage CLI executors) |
| **Framework** | Spec Kit deep-research, parallel by-model fan-out |
| **Storage** | Packet-local `research/` (state JSONL, deltas, iterations, registries) |
| **Testing** | Cross-lineage reconciliation; orchestrator ground-truths measured counts |

### Overview
Run a read-only deep-research loop over the local `external/ui-ux-pro-max-skill-main/` repo and the `sk-design-interface` skill to determine what to ADOPT/ADAPT/SKIP, how to integrate it into the house skill, and the licensing path. Two parallel by-model lineages produce independent syntheses that are merged and cross-checked.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md)
- [x] Success criteria measurable (per-asset verdicts + integration + licensing + cross-check)
- [x] Inputs identified (external repo + target skill + house conventions)

### Definition of Done
- [x] Both lineages completed and merged
- [x] `research/research.md` synthesized with a Merge Recommendation
- [x] Docs validate `--strict`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Parallel by-model fan-out (concurrency 2), independent convergence, central reduce.

### Key Components
- **`fanout-run.cjs`**: spawns the two lineage subprocesses in an async capped pool.
- **Lineage loops**: each runs phase_init → main_loop → synthesis in its own `lineages/{label}/`.
- **`fanout-merge.cjs`**: dedupes the two findings registries into one consolidated registry.

### Data Flow
External repo + skill → per-lineage iterations/deltas/registry → merged registry → orchestrator-authored `research.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable — this is a read-only research packet. No code or skill surface is modified. The only writes are packet-local research artifacts and this packet's control docs.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/sk-design-interface/` | Target skill under study | unchanged (read-only) | no diff in skill dir |
| `external/ui-ux-pro-max-skill-main/` | Research input | unchanged (read-only) | no diff in external dir |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Scaffold the 002 research child (spec + metadata + research/)
- [x] Author the fan-out config (2 lineages, 5 iters each, concurrency 2)
- [x] Pre-flight: slug + variant smoke-test, async pool confirmed

### Phase 2: Core Implementation
- [x] Run the 10-iteration parallel fan-out via `fanout-run.cjs`
- [x] Merge lineage registries via `fanout-merge.cjs`
- [x] Cross-check the two lineages and resolve divergences

### Phase 3: Verification
- [x] Ground-truth the measured asset counts
- [x] Synthesize the canonical `research.md` Merge Recommendation
- [x] Validate docs `--strict`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Cross-check | Lineage agreement/divergence reconciliation | manual synthesis |
| Ground-truth | CSV row counts vs marketing claims | `wc -l` re-measure |
| Validation | Spec-folder doc structure | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `fanout-run.cjs` / `fanout-merge.cjs` | Internal | Green | No fan-out / no merge |
| cli-opencode `openai/gpt-5.5-fast` | External | Green | Lose the gpt-5.5 lineage |
| cli-claude-code `claude-opus-4-8` | External | Green | Lose the opus lineage |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Research artifacts invalid or lineages all failed.
- **Procedure**: Discard `research/`; nothing outside this packet is touched, so there is no external state to revert.
<!-- /ANCHOR:rollback -->
