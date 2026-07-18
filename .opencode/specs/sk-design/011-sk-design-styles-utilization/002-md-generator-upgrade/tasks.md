---
title: "Tasks: md-generator upgrade research"
description: "Run queue for the deep-research loop over the md-generator upgrade question: dispatch the SOL-xhigh lineage, iterate to convergence, and confirm a ranked synthesis of upgrade levers."
trigger_phrases:
  - "md generator upgrade tasks"
  - "design-md-generator research tasks"
  - "improve DESIGN.md tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade"
    last_updated_at: "2026-07-18T11:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the md-generator upgrade research charter"
    next_safe_action: "Dispatch the SOL-xhigh research loop over the md-generator topic"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-md-gen-upgrade-011-002"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: md-generator upgrade research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: T### [P?] Description (file path)
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Author the research charter (question, scope, md-generator subject) (`spec.md`). [EVIDENCE: `spec.md` REQUIREMENTS + SCOPE.]
- [x] T002 Fix the executor + loop params: cli-opencode `openai/gpt-5.6-sol-fast` `--variant xhigh`, 10 iters (`plan.md`). [EVIDENCE: `plan.md` Technical Context.]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Dispatch the research lineage via `fanout-run.cjs --loop-type research` over the md-generator upgrade topic (`research/`). [EVIDENCE: job `b4bze2klj` ran to `exitCode 0`, status `fulfilled`.]
- [x] T004 Iterate to convergence or the 10-iteration ceiling (`research/`). [EVIDENCE: 5 iterations in `deep-research-state.jsonl`; `stall_detected` stopped it below the ceiling.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Confirm `research/research.md` ranks md-generator upgrade levers with evidence + rough cost (`research/research.md`). [EVIDENCE: `research.md` §9 ranks nine levers with per-lever cost (`4-7 days`, `2-3 days`).]
- [x] T006 Confirm each lever names a concrete md-generator integration point and states anti-slop discipline (`research/research.md`). [EVIDENCE: `research.md` §11 names `emitQuickStart`/`validateDesignMd`/`buildWritePrompt`; §1 states the corpus-teaches-shape-not-values rule.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Loop converged (or ceiling reached); research.md written
- [x] Upgrade levers ranked with evidence + cost
- [x] Integration points named
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Parent**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
