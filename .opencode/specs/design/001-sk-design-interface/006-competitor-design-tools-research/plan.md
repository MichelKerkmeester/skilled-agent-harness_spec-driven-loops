---
title: "Implementation Plan: Competitor design-tools research"
description: "Plan for a web-heavy 10-iteration parallel-by-model deep-research loop surveying competitor AI design tools for adoptable ideas. Research-only; deliverable is a recommendation."
trigger_phrases:
  - "competitor design tools plan"
  - "v0 lovable subframe research plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/001-sk-design-interface/006-competitor-design-tools-research"
    last_updated_at: "2026-06-14T09:25:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Research loop complete; plan reflects the executed approach"
    next_safe_action: "Fold into the 007 keystone build"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-148-006-competitor-design-tools-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Competitor design-tools research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Deep-research loop (fanout-run.cjs + per-lineage CLI executors) |
| **Framework** | Spec Kit deep-research, web-heavy parallel by-model fan-out |
| **Storage** | Packet-local `research/` |
| **Testing** | Cross-lineage reconciliation; gpt lineage web-verified |

### Overview
Survey leading AI design tools (v0, Lovable, Figma Make, Subframe, others) for adoptable ideas net-new vs the 005 Claude Design findings, via two parallel by-model lineages, merged and cross-checked.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Competitor set identified; 005 dedup baseline available
- [x] Executors smoke-tested (prior packets)

### Definition of Done
- [x] Both lineages completed and merged
- [x] `research/research.md` with ranked net-new ideas
- [x] Docs validate `--strict`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Web-heavy parallel by-model fan-out (concurrency 2), independent convergence, central reduce + host synthesis.

### Key Components
- **`fanout-run.cjs`**: spawns the two lineages.
- **Lineage loops**: each surveys competitor tools in `lineages/{label}/`.
- **`fanout-merge.cjs`**: consolidates the registries.

### Data Flow
Competitor docs + both skills + 005 baseline -> per-lineage iterations -> merged registry -> host-authored research.md.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable — read-only research packet.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| both skills | Under study | unchanged (read-only) | no diff |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Scaffold the 006 child + register in the 148 parent
- [x] Author the 2-lineage web-heavy fan-out config

### Phase 2: Core Implementation
- [x] Run the 10-iteration parallel fan-out
- [x] Merge lineage registries
- [x] Cross-check the two lineages (gpt web-verified vs opus model-knowledge)

### Phase 3: Verification
- [x] Synthesize the canonical research.md (ranked net-new ideas)
- [x] Validate docs `--strict`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Cross-check | Lineage agreement/divergence | manual synthesis |
| Verification | Competitor feature claims | gpt lineage web citations |
| Validation | Spec-folder doc structure | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `fanout-run.cjs` / `fanout-merge.cjs` | Internal | Green | No fan-out / no merge |
| claude account #2 + cli-opencode gpt-5.5-fast | External | Green | Lose a lineage |
| `../005-claude-design-parity-research` | Internal | Green (complete) | No dedup baseline |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Research artifacts invalid or lineages all failed.
- **Procedure**: Discard `research/`; nothing outside this packet is touched.
<!-- /ANCHOR:rollback -->
