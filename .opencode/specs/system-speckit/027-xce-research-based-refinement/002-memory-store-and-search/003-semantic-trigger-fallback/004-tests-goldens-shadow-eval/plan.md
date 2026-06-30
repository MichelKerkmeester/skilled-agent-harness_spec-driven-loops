---
title: "Implementation Plan: 004 — Tests, Goldens + Shadow Eval"
description: "Goldens fixture, cold-start/latency/threshold-tuning/backfill-resume tests, ENV flag docs, shadow telemetry, and the shadow→union promotion gate. Threshold re-validated for 768d Nomic."
trigger_phrases:
  - "027 phase 004 goldens shadow eval plan"
  - "shadow to union promotion plan"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/004-tests-goldens-shadow-eval"
    last_updated_at: "2026-06-10T10:50:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed synthetic evaluation harness"
    next_safe_action: "Run live embedding eval before union promotion"
    blockers: ["Union promotion blocked pending live eval evidence"]
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-007-phase-split"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 004 — Tests, Goldens + Shadow Eval

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node) |
| **Framework** | Spec Kit Memory MCP server |
| **Storage** | Reads shadow telemetry / eval logs |
| **Testing** | Vitest + goldens fixture |

### Overview
Build the evaluation harness (goldens, latency, threshold-tuning, cold-start, backfill-resume), document the 5 flags, capture shadow telemetry, and gate shadow→union promotion. The shipped goldens use synthetic vectors for machinery validation; live 768d re-validation remains required before union promotion.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Handler wired and emitting source-tagged results plus shadow telemetry hooks.
- [x] Live embedding-profile retuning documented as blocked for promotion.

### Definition of Done
- [x] Synthetic goldens metrics pass (exact precision 1.0; paraphrase recall 1.0; distractor FP 0).
- [x] Deterministic latency budget passes; semantic-trigger mode flag documented.
- [x] Shadow→union promotion checklist captured as blocked pending live evidence.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Evaluation harness + telemetry-gated promotion.

### Key Components
- **Goldens fixture**: exact/paraphrase/distractor variants with expected match-source.
- **Shadow telemetry**: would-have-fired logging + threshold-band buckets.
- **Promotion gate**: checklist blocking union until evidence passes.

### Data Flow
handler (shadow mode) → telemetry/eval logs → threshold-tuning test consumes logs → goldens metrics → promotion checklist decision.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Author goldens fixture (CJK + Latin; 3 variants per phrase).
- [x] Confirm shadow telemetry event shape includes threshold-band buckets.

### Phase 2: Core Implementation
- [x] Cold-start + latency-budget + threshold-tuning + backfill-resume tests.
- [x] Document semantic-trigger mode flag in `ENV_REFERENCE.md`.

### Phase 3: Verification
- [x] Run synthetic goldens metrics; block live 768d retune pending real eval.
- [x] Capture shadow→union promotion checklist evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Fixture | Goldens metrics (precision/recall/FP) | Vitest + JSON |
| Unit | Cold-start, latency, threshold-tuning, backfill-resume | Vitest |
| Manual | Live-profile shadow telemetry inspection | Blocked pending live eval |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `003-hybrid-handler` | Internal | Pending | No wired handler to evaluate |
| Shadow-eval evidence (equivalent harness) | Internal | Yellow | Recall-lift measurement for union promotion |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Goldens FP/recall or latency targets fail.
- **Procedure**: Keep `_MODE=shadow` (or master off); do not promote to union; re-tune from goldens and re-measure. No schema change here.
<!-- /ANCHOR:rollback -->
