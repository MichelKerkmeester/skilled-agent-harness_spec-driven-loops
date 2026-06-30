---
title: "Tasks: cross-model-validation"
description: "Tracks planned packet 113/007 work for a confirm-only cross-model validation harness. No harness implementation has started in this packet state."
trigger_phrases:
  - "113/007 validation tasks"
  - "cross model confirm tasks"
  - "deepseek kimi dispatch tasks"
  - "bundle gate validation task list"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/z_archive/092-cli-devin-prompt-quality/007-cross-model-validation"
    last_updated_at: "2026-05-17T12:18:35Z"
    last_updated_by: "cli-codex"
    recent_action: "documented-planned-task-state"
    next_safe_action: "build-cross-model-confirm-harness"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/z_archive/092-cli-devin-prompt-quality/007-cross-model-validation/scripts/cross-model-confirm.cjs"
      - ".opencode/specs/skilled-agent-orchestration/z_archive/092-cli-devin-prompt-quality/003-eval-loop/scripts/score-variant.cjs"
      - ".opencode/specs/skilled-agent-orchestration/z_archive/092-cli-devin-prompt-quality/005-extraction-rerun/scripts/extract-files-from-markdown.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-codex-113-cli-devin-prompt-quality/007-cross-model-validation"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Provider route readiness remains unverified"
    answered_questions:
      - "No implementation tasks are complete yet"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: cross-model-validation

<!-- SPECKIT_LEVEL: 3 -->

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

- [ ] T001 Confirm cli-opencode can route `deepseek/deepseek-v4-pro --variant high`
- [ ] T002 Confirm cli-opencode can route `opencode-go/kimi-k2.6 --variant high`
- [ ] T003 Inventory 113/002 fixture ids and 113/003 variant ids
- [ ] T004 Define result schema for model, variant, fixture, dispatch status, extraction status, and score output
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Create `.opencode/specs/skilled-agent-orchestration/z_archive/092-cli-devin-prompt-quality/007-cross-model-validation/scripts/cross-model-confirm.cjs`
- [ ] T006 Wire cli-opencode dispatch for both model routes
- [ ] T007 Reuse 113/005 `extract()` before D1 acceptance scoring
- [ ] T008 Reuse 113/003 `scoreVariantFixture()` for weighted scoring
- [ ] T009 Write append-only or resumable results under packet 113/007 state
- [ ] T010 Prevent variant mutation or writes back into packet 114
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Run the 70-dispatch matrix
- [ ] T012 Analyze standard-bundle-gate versus strict-bundle-gate across both models
- [ ] T013 Analyze v-003-anti-hallucination-strong versus v-004-rcaf-medium across both models
- [ ] T014 Record propagation recommendation in packet 113/007 analysis and implementation summary
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] 70 dispatch rows scored or explicitly accounted for
- [ ] Decision gates recorded with raw result evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision Record**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
