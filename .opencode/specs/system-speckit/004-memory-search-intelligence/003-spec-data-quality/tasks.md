---
title: "Tasks: Spec-Kit Data Quality by Default"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "spec data quality tasks"
  - "research loop tasks"
  - "stage 0 tasks"
  - "candidate verification"
  - "data quality default"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/003-spec-data-quality"
    last_updated_at: "2026-07-12T12:17:12Z"
    last_updated_by: "markdown-agent"
    recent_action: "Reconciled parent governance truth after topology migration"
    next_safe_action: "Resolve CHK-050/051, obtain sign-offs, then rerun reviews and strict validation"
    blockers:
      - "CHK-050 and CHK-051 lack current completion evidence"
      - "Three governance sign-offs and two fresh independent reviews remain open"
    key_files:
      - "system-speckit/004-memory-search-intelligence/003-spec-data-quality/checklist.md"
      - "system-speckit/004-memory-search-intelligence/scratch/task-30c-data-quality-truth.md"
    session_dedup:
      fingerprint: "sha256:a13d79278b8e7546f3edb041b539b5aa0a91ec037e7cd0e86fb96918be7acc04"
      session_id: "031-stage-0-init"
      parent_session_id: null
    completion_pct: 91
    open_questions:
      - "When current evidence for CHK-050 and CHK-051 and all sign-offs will be available"
    answered_questions: []
---
# Tasks: Spec-Kit Data Quality by Default

<!-- SPECKIT_LEVEL: 3 -->
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

- [x] T001 Create the Level 3 packet structure (003-spec-data-quality) [EVIDENCE: `spec.md` declares SPECKIT_LEVEL 3 and the canonical folder exists]
- [x] T002 Record the Stage 0 external-findings brief (research/stage-0-external-findings.md) [EVIDENCE: `research/stage-0-external-findings.md` exists as the Stage 0 brief]
- [ ] T003 Point the research index at the brief (research/research.md) - current `research/research.md` does not link the Stage 0 brief
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Verify the retrieval candidates against the spec-kit corpus (research/research.md) [EVIDENCE: `research/research.md` Tier C records the prod-mode gate and five retrieval verdicts]
- [x] T005 [P] Verify the adherence candidates and record the honest ceiling (research/research.md) [EVIDENCE: `research/research.md` executive verdict and Tier A separate adherence wins from retrieval claims]
- [x] T006 [P] Verify the logic-graph candidates against the current edge model (research/research.md) [EVIDENCE: `research/research.md` Tier D records the existing rollup node and rejects a duplicate lane]
- [x] T007 Flag every vendor-only claim and corpus-specific assumption (research/research.md) [EVIDENCE: `research/research.md` marks retrieval items hypothesis-until-prod-measured and rejects vendor-only promotion]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run validate.sh strict on the packet (spec.md)
- [x] T009 Check HVR voice across the authored docs (spec.md) [EVIDENCE: `implementation-summary.md` Verification records the historical 2026-06-21 HVR pass]
- [x] T010 Write the candidate verdict for a build packet (research/research.md) - evidence research/research.md candidate verdict
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Historical Research Task Completion Criteria

- [ ] All tasks marked `[x]` - T003 remains open
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed

These checks close the 2026-06-21 research task set only. Current parent governance remains **In Progress**: CHK-050 and CHK-051 lack current evidence, all three sign-offs are open and fresh independent review plus strict validation remain outstanding.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
