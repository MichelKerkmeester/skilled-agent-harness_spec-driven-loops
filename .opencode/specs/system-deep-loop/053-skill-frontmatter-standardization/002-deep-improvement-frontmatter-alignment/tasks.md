---
title: "Tasks: Phase 7: deep-improvement Frontmatter Alignment"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "deep-improvement frontmatter tasks"
  - "frontmatter normalization tasks"
  - "doc contract authoring tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/053-skill-frontmatter-standardization/002-deep-improvement-frontmatter-alignment"
    last_updated_at: "2026-06-11T09:54:32Z"
    last_updated_by: "claude-fable"
    recent_action: "All tasks complete and checks green"
    next_safe_action: "Campaign continues in sibling phases"
    blockers: []
    key_files:
      - ".opencode/skills/deep-improvement/references/shared/promotion_gate_contract.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-009-007-deep-improvement"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 7: deep-improvement Frontmatter Alignment

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture frontmatter state for all 27 in-scope docs: 5 full-with-`contextType: reference`, 12 partial (phrases but no tier/contextType), 8 title+description only, 1 bare (`references/shared/heldout_and_gold_sets.md`)
- [x] T002 Confirm contract enums against the checker and scan headings of the 12 docs needing new or repaired phrases (`check-skill-doc-frontmatter.mjs`, `grep -n "^#"`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Fix enum drift: 5 fully-detailed docs move `contextType: reference` to `implementation` (`candidate_proposal_format.md`, `score_dimensions.md`, `promotion_gate_contract.md`, `skill_benchmark/{operator_guide,scenario_authoring,scoring_contract}.md`)
- [x] T004 Complete 12 partial docs with `importance_tier` + `contextType`; replace weak phrases — single tokens and a finding id in `profiling_audit_log.md`, 4 single hyphenated tokens in `mixed_executor_methodology.md`, command-name tokens in `integration_scanning.md` and `skill_benchmark/operator_guide.md`
- [x] T005 Author full phrase sets for 8 title-only docs (3 agent_improvement asset templates, 5 non_dev_ai_system references) and the full block for `heldout_and_gold_sets.md`
- [x] T006 Apply tier policy: `important` on 8 formal contract/invariant docs (kept 4, added `evaluator_contract.md`, `promotion_rules.md`, `non_dev_ai_system/loop_contract.md`, `heldout_and_gold_sets.md`); demoted `skill_benchmark/{operator_guide,scenario_authoring}.md` to `normal`
- [x] T007 Apply all 27 patches via one assertion-guarded Python pass (per-file title guard; body bytes untouched)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Coverage check green: `PASS mode=coverage scope=deep-improvement docs=27 carrying-detailed-block=27 violations=0`
- [x] T009 Python local-mode smoke with `SPECKIT_ADVISOR_DOC_TRIGGERS=true`: "legal-stop gate bundles" routes deep-improvement (0.77, passes_threshold) with `!legal-stop gate bundles(signal)`; live-daemon `matchedDocs` smoke rides packet 145 T025
- [x] T010 Diff hygiene: this phase's hunks are frontmatter-only; pre-existing uncommitted body changes from another session left untouched
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (coverage check + routing smoke without touching the live daemon)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification evidence**: See `implementation-summary.md`
- **Pilot recipe**: `../008-deep-loop-runtime/`
- **Contract origin**: `../001-frontmatter-benefit-investigation/research.md`
- **Consumer + checker packet**: `skilled-agent-orchestration/z_archive/112-advisor-doc-trigger-harvest`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
