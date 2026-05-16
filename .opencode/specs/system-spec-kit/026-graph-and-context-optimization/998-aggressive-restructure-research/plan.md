---
title: "Plan: 998 aggressive restructure research"
description: "20 cli-devin SWE-1.6 iter targeting Wave 1 deferred items + aggressive cross-phase consolidation."
trigger_phrases:
  - "998 plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research"
    last_updated_at: "2026-05-16T07:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored plan"
    next_safe_action: "Dispatch 20-iter loop"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:99811111222233334444555566667777888899990000111122223333444455c2"
      session_id: "998-plan"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: 998 aggressive restructure research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Three phases: (1) author 20 iter prompts targeting Wave 1 deferred items; (2) dispatch loop via run-loop.sh (resume-aware, per-iter immediate commit); (3) synthesize + author Wave 2 resource-map.

Uses cli-devin v1.0.4.1 recipe (sequential_thinking mandatory, narrow Write, MCP permission scope).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check |
|------|-------|
| Per-iter | ≥ 1000 bytes + JSONL row + sequential_thinking trace |
| Loop end | 20 iter files exist |
| Synthesis | research.md cites every iter |
| Final | Wave 2 resource-map authored |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Same pattern as 999: research/prompts/ + research/iterations/ + research/logs/ + scripts/run-loop.sh. Synthesis → research/research.md → packet root resource-map.md.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Author 20 prompts + scaffold scripts
### Phase 2: Dispatch 20-iter loop (cli-devin SWE-1.6 v1.0.4.1 recipe)
### Phase 3: Synthesis + Wave 2 resource-map authoring
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Per-iter strict-validate of output (≥1000 bytes + JSONL + ≥ 3 file:line citations).
Final: strict-validate of 998 packet.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- cli-devin v1.0.4.1 (packet 105 hotfix)
- packet 999's resource-map.md
- packet 107's implementation-summary
- HEAD baseline: `c2fcdaa56`
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Per-iter immediate commit; partial state recoverable. Full revert: `git rm -rf 998-aggressive-restructure-research/` (read-only on rest of codebase).
<!-- /ANCHOR:rollback -->
