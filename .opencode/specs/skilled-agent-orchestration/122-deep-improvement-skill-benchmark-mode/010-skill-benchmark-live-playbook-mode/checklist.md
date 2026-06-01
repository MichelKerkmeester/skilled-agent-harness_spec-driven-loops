---
title: "Verification Checklist: Lane C Live Playbook Mode (Mode B)"
description: "QA checklist for the Lane C redesign: parser, dual-mode scoring, live/browser/D4/generator executors, cross-model robustness, and live validation."
trigger_phrases:
  - "Lane C mode B checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/010-skill-benchmark-live-playbook-mode"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Verified phases 0-5 + hardening; live Mode B confirmed"
    next_safe_action: "validate.sh --strict"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "skill-benchmark-live-playbook-mode"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Lane C Live Playbook Mode (Mode B)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol
- Suite: `cd .opencode/skills/deep-improvement/scripts && npx vitest run`.
- Live: `SKILL_BENCH_OPENCODE_MODEL=openai/gpt-5.5-fast SKILL_BENCH_OPENCODE_VARIANT=high node scripts/skill-benchmark/run-skill-benchmark.cjs --skill sk-code --trace-mode live --scenarios <ids> --outputs-dir <dir>`.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] CHK-01 [P1] Plan-mode research (3 explore + 3 plan agents) + approved phased plan.
- [x] CHK-02 [P1] Phase 0 spike validated live / skill-off / bdg before building.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] CHK-03 [P1] Additive seams; router mode dependency-free; back-compat adapters.
- [x] CHK-04 [P1] No spec-folder paths / packet ids in code comments (hygiene clean).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [x] CHK-05 [P0] Full vitest suite green — **245 tests / 22 files**.
- [x] CHK-06 [P1] Cross-model JSON extraction covered (fenced-tag / plain-fence / bare / prose).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] CHK-07 [P0] **REQ-001** playbook is the default corpus (24 sk-code scenarios parsed).
- [x] CHK-08 [P0] **REQ-002** router mode scores against real gold, deterministic.
- [x] CHK-09 [P0] **REQ-003** live mode runs via cli-opencode; NDJSON parsed; activation captured.
- [x] CHK-10 [P0] **REQ-004** full suite green; no existing behavior broken.
- [x] CHK-11 [P1] **REQ-005** browser scenarios via bdg (MR-001 real PASS; honest partials).
- [x] CHK-12 [P1] **REQ-006** D4 ablation graded (approximate attribution).
- [x] CHK-13 [P1] **REQ-007** generator stages scenarios behind opt-in + 4 gates.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [x] CHK-14 [P1] Live dispatch is read-only-analysis; generator writes only to staging.
- [x] CHK-15 [P1] No new exec paths beyond opencode/bdg/grader; auth via provider pre-flight.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [x] CHK-16 [P1] Packet 127 spec/plan/tasks/checklist/impl-summary present.
- [x] CHK-17 [P2] decision-record + operator_guide + command doc updated for Mode B; scoring_contract/scenario_authoring deep-sync is a tracked follow-up.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [x] CHK-18 [P2] New modules under `scripts/skill-benchmark/`; all Vitest suites lane-local under `<lane>/tests/` (cross-lane fixtures + suite index under `shared/tests/`).
- [x] CHK-19 [P2] Live/benchmark evidence under `sk-code/benchmark/{baseline,after,full,live}/`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
- 6 phases built; **245 tests green**; live Mode B confirmed (gpt-5.5-fast high, aggregate 76, all 3 parse, CS-001 surface correct).
- Honest limits documented: D4 approximate; xhigh too slow (use high); browser partials never fake PASS.
- Test lane-org completed (follow-on): all 22 suites relocated to `<lane>/tests/` (agent-improvement 5, model-benchmark 6, skill-benchmark 3, shared 8); cross-lane fixtures + suite index moved to `shared/tests/`; `vitest.config.mjs` glob simplified to `*/tests/**/*.vitest.ts`; READMEs + feature_catalog + playbook anchors re-pathed; 245 green from new layout.
<!-- /ANCHOR:summary -->
