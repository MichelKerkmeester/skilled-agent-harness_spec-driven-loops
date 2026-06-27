---
title: "Tasks: C4 Metadata Fusion Alpha-Blend [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "metadata fusion alpha"
  - "c4 retrieval fusion"
  - "alpha text meta blend"
  - "metadata signal vector"
  - "fusion alpha calibration"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/003-retrieval-gated-tuning/017-metadata-fusion"
    last_updated_at: "2026-06-21T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored phase task breakdown for C4 metadata fusion scaffold"
    next_safe_action: "Hold for implementation, no task has started yet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-eval-v2.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: C4 Metadata Fusion Alpha-Blend

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

- [ ] T001 Confirm header path, curated triggers, and content_type are present on the candidate row at the fusion stage with no extra read (`.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`)
- [ ] T002 Choose the lane flag name and wire it default-off next to the existing fusion config (`.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`)
- [ ] T003 [P] Capture the C1 prefix prod-mode completeRecall@3 baseline this lane must beat
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add a metadata-signal score derived from fields already on the row, contributing zero on missing fields and never throwing (`.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`)
- [ ] T005 Fold the `alpha * text + (1 - alpha) * meta` blend next to the existing validation multiplier, reusing the `clampMultiplier` bound, behind the default-off flag with alpha as a tunable parameter (`.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`)
- [ ] T006 Add an alpha-sweep mode that reports prod-mode completeRecall@3 per alpha setting on the spec corpus (`.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-eval-v2.mjs`)
- [ ] T007 Run the alpha sweep and record the prod@3 readout per setting so any chosen alpha cites this corpus, not the SEC-10K finding
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Confirm a flag-off prod path is byte-identical to baseline and a fusion unit test shows a no-metadata candidate scores identically to baseline with the blend inside the `clampMultiplier` bound
- [ ] T009 Confirm the alpha sweep emits one prod-mode completeRecall@3 number per setting and record the C1-versus-C4 comparison so promotion stays gated on a C2 prod@3 rise
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
