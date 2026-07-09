---
title: "Tasks: Lane C Live Playbook Mode (Mode B)"
description: "Task breakdown + status for the Lane C redesign build (playbook corpus, dual-mode, live/browser/D4/generator executors)."
trigger_phrases:
  - "Lane C mode B tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/008-deep-improvement-skill-benchmark-mode/010-skill-benchmark-live-playbook-mode"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Phases 0-5 + hardening done; live Mode B confirmed"
    next_safe_action: "validate.sh --strict on packet 127"
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
# Tasks: Lane C Live Playbook Mode (Mode B)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation
- `[x]` complete · `[ ]` open. Evidence cited inline.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T-00 Phase 0 spike — live dispatch / skill-off ablation / bdg, all validated (3 MiniMax dispatches).
- [x] T-01 `load-playbook-scenarios.cjs` — sk-code → 24 scenarios (15 routing / 2 advisor / 7 browser); sk-doc variant.
- [x] T-02 `executor-dispatch.cjs` — normalized observed-result; live/browser lazy + gated to live mode.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T-03 `run-skill-benchmark.cjs` dual-path + classKind loop + lint-as-finding.
- [x] T-04 `score-skill-benchmark.cjs` adapter + real-gold + `computeDivergence` + live evidence.
- [x] T-05 `build-report.cjs` coverage + classKind + routed-out + divergence + contamination sections.
- [x] T-06 `live-executor.cjs` (NDJSON parse, cross-model JSON extraction, dropped --agent).
- [x] T-07 `browser-executor.cjs` (bdg; MR-001 real PASS; honest partials/SKIP).
- [x] T-08 `d4-ablation.cjs` (skill-on/off + gradeD4, attribution approximate).
- [x] T-09 `playbook-generator.cjs` (opt-in, staged, 4 gates).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T-10 245 vitest tests green.
- [x] T-11 Live Mode B confirmed via gpt-5.5-fast high — aggregate 76, all 3 scenarios parse, CS-001 surface correct.
- [ ] T-12 Packet docs + reference/command docs + `validate.sh --strict`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] All executors built + tested; live + browser validated.
- [x] Router mode deterministic (CI gate); live default deferred until stable.
- [ ] Packet strict-valid; reference/command docs reflect dual-mode.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- Spec: `spec.md` · Plan: `plan.md` · Checklist: `checklist.md` · Decisions: `decision-record.md`
- Evidence: `.opencode/skills/sk-code/benchmark/{baseline,after,full,live}/`
<!-- /ANCHOR:cross-refs -->
