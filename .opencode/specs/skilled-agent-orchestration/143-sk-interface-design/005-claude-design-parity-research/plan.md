---
title: "Implementation Plan: Claude Design parity research"
description: "Plan for a 10-iteration parallel-by-model deep-research loop assessing how to improve sk-interface-design and mcp-magicpath toward Claude Design parity. Research-only; deliverable is a recommendation."
trigger_phrases:
  - "claude design parity plan"
  - "sk-interface-design mcp-magicpath research plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/143-sk-interface-design/005-claude-design-parity-research"
    last_updated_at: "2026-06-14T08:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Research loop complete; plan reflects the executed approach"
    next_safe_action: "Operator reviews research/research.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-148-005-claude-design-parity-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Claude Design parity research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Deep-research loop (fanout-run.cjs + per-lineage CLI executors) |
| **Framework** | Spec Kit deep-research, parallel by-model fan-out |
| **Storage** | Packet-local `research/` (state, deltas, iterations, registries) |
| **Testing** | Cross-lineage reconciliation + host web verification |

### Overview
Run a read-only deep-research loop over both skills and the Claude Design support docs to determine prioritized improvements toward parity. Two parallel by-model lineages produce independent syntheses, merged and cross-checked.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Claude Design target defined (support article)
- [x] Both skills' current state mapped
- [x] Executors smoke-tested (opus via account #2 + gpt-5.5-fast)

### Definition of Done
- [x] Both lineages completed and merged
- [x] `research/research.md` with scorecard + per-skill recommendations
- [x] Docs validate `--strict`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Parallel by-model fan-out (concurrency 2), independent convergence, central reduce + host synthesis.

### Key Components
- **`fanout-run.cjs`**: spawns the two lineages (opus via claude account #2 + gpt-5.5-fast).
- **Lineage loops**: each runs its full 5-iteration loop in `lineages/{label}/`.
- **`fanout-merge.cjs`**: consolidates the findings registries.

### Data Flow
Both skills + Claude Design docs -> per-lineage iterations -> merged registry -> host-authored research.md.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable — read-only research packet. Only packet-local research artifacts + control docs are written.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sk-interface-design/` | Skill under study | unchanged (read-only) | no diff |
| `mcp-magicpath/` | Skill under study | unchanged (read-only) | no diff |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Scaffold the 005 research child + register in the 148 parent
- [x] Author the 2-lineage fan-out config; pre-flight smoke tests

### Phase 2: Core Implementation
- [x] Run the 10-iteration parallel fan-out
- [x] Merge lineage registries; host web-verify the keystone claim
- [x] Cross-check the two lineages and resolve divergences

### Phase 3: Verification
- [x] Synthesize the canonical research.md (scorecard + per-skill recommendations)
- [x] Validate docs `--strict`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Cross-check | Lineage agreement/divergence | manual synthesis |
| Verification | Claude Design capability claims | host WebFetch |
| Validation | Spec-folder doc structure | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `fanout-run.cjs` / `fanout-merge.cjs` | Internal | Green | No fan-out / no merge |
| claude account #2 (`~/.claude-account2`) | External | Green | Lose the opus lineage |
| cli-opencode `openai/gpt-5.5-fast` | External | Green | Lose the gpt lineage |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Research artifacts invalid or lineages all failed.
- **Procedure**: Discard `research/`; nothing outside this packet is touched.
<!-- /ANCHOR:rollback -->
