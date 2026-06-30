---
title: "Tasks: sk-design OVERVIEW Conformance [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk-design overview tasks"
  - "overview conformance tasks"
  - "batch tasks"
  - "gate verification task"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/041-sk-design-overview-conformance"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark all tasks complete; 22/22 conformant, 3 gates re-verified green"
    next_safe_action: "Regenerate generated metadata; commit the 22-file conformance batch"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-audit/references/audit_contract.md"
      - ".opencode/skills/sk-design/design-foundations/assets/token_starter.md"
      - ".opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: sk-design OVERVIEW Conformance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture baseline gates: naming_doc_check.py exit 0, audit gate + proof_check green, design-command-surface-check STATUS=PASS drift=0, skill-benchmark hubRoute 34/29/5/0 (`.opencode/skills/sk-design/`) — baseline captured green before edits
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Each batch: implement via cli-codex gpt-5.5 xhigh fast, then orchestrator-verify section outline + frontmatter-unchanged. Critical-file gate re-verification lives in Phase 3.

- [x] T002 Batch 1 — restructure 8 audit reference files to reference OVERVIEW (Purpose/When to Use/Core Principle): accessibility_performance, ai_fingerprint_tells, anti_patterns_production, corpus_map, critique_hardening, evidence_capture, hardening_edge_cases, transform_remediation (`.opencode/skills/sk-design/design-audit/references/`) — 8/8 conformant, frontmatter unchanged
- [x] T003 Batch 2 — restructure 5 mixed reference files (incl. CRITICAL audit_contract) to reference OVERVIEW: audit_contract, worked_examples, redesign_intake, advanced_craft, design_dispatch_boundary (`.opencode/skills/sk-design/{design-audit/references,design-foundations/references,design-interface/references/design-process,design-motion/references,shared}/`) — 5/5 conformant; audit_contract proof_check triad {ok:True}
- [x] T004 Batch 3 — restructure 7 assets to asset OVERVIEW (Purpose/Usage): register_card, animate_presence_checklist, motion_pattern_cards, motion_performance_failure_card, a11y_quick_fixes, anti_patterns_score_rubric, audit_evidence_worksheet (`.opencode/skills/sk-design/{shared/assets,design-motion/assets,design-audit/assets}/`) — 7/7 conformant
- [x] T005 Batch 4 — restructure 2 CRITICAL assets to asset OVERVIEW: token_starter, interface_preflight_card (`.opencode/skills/sk-design/{design-foundations/assets,design-interface/assets}/`) — 2/2 conformant; naming_doc_check exit 0; preflight VERDICT last at ## 13
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Orchestrator outline + frontmatter-unchanged verification across all 22 restructured files (section numbering contiguous, `## 1. OVERVIEW` present, frontmatter byte-identical) — 22/22 verified independently, no pipe-masking
- [x] T007 Gate re-verification — token_starter.md: `python3 .opencode/skills/sk-design/design-foundations/scripts/naming_doc_check.py` returns exit 0 (alias headings COLOR RAMP/TYPE SCALE/SPACING SCALE/HAND OFF intact) — exit 0; lint strips section numbers
- [x] T008 Gate re-verification — audit_contract.md: audit gate + `python3 .opencode/skills/sk-design/shared/scripts/proof_check.py` observation-triad green; 7-layer a11y matrix + findings schema preserved — `proof_check._validate_observation_triad` returns {ok:True}
- [x] T009 Gate re-verification — interface_preflight_card.md: walk the Interface Pre-Flight HARD gate; confirm all 12 original sections survive — renumbered `## 1`–`## 13` after OVERVIEW insertion; VERDICT last at ## 13, interaction-state matrix at ## 12; cross-references to other files unchanged
- [x] T010 Standing invariants — `design-command-surface-check.mjs` STATUS=PASS drift=0; skill-benchmark hubRoute 34/29/5/0 — both hold; evergreen 0 leaks
- [x] T011 Sync spec/plan/tasks/checklist and mark checklist items with evidence — implementation-summary.md added; all four docs marked complete
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] 22/22 files conformant; 3 gate re-verifications green; standing invariants hold
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
