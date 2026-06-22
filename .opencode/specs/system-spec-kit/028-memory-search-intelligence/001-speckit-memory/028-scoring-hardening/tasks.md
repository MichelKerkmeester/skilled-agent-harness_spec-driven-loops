---
title: "Tasks: Scoring Hardening [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "scoring hardening"
  - "grounding signal envelope"
  - "noise floor subtraction banding"
  - "cite with caveat tier"
  - "evidence gap detected verdict"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/028-scoring-hardening"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Retasked scoring-hardening build for recs 7 8 10 11 12"
    next_safe_action: "Hold for implementation, no task has started yet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/dist/lib/search/confidence-scoring.d.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/dist/lib/search/search-results.d.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-eval-v2.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Scoring Hardening

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

- [ ] T001 Confirm the off-corpus fixtures and the wired false-confirm metric are available read-only as the validation harness (`.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-eval-v2.mjs`)
- [ ] T002 Confirm the lexical signals `fts_score` and `bm25` are present on the raw rows at the `:913-916` seam (`.opencode/skills/system-spec-kit/mcp_server/dist/lib/search/search-results.d.ts`)
- [ ] T003 Define the four default-OFF flag names and the grandfather report mode (`.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md`)
- [ ] T004 [P] Measure the corpus noise-floor against the active embedder and record the embedder it was measured against (`.opencode/skills/system-spec-kit/mcp_server/dist/lib/search/confidence-scoring.d.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Surface the grounding or low-grounding signal on the envelope at the `:1167-1176` verdict-field population behind the rec-7 default-OFF flag, reusing the raw-row lexical signals (`.opencode/skills/system-spec-kit/mcp_server/dist/lib/search/search-results.d.ts`)
- [ ] T006 Subtract the measured noise-floor from absolute relevance before the `:400` band read, floored at zero, behind the rec-8 default-OFF flag (`.opencode/skills/system-spec-kit/mcp_server/dist/lib/search/confidence-scoring.d.ts`)
- [ ] T007 Add the `cite_with_caveat` tier between cite_results and weak in the `:433-478` citation policy behind the rec-10 default-OFF flag (`.opencode/skills/system-spec-kit/mcp_server/dist/lib/search/confidence-scoring.d.ts`)
- [ ] T008 Bridge `stage4.evidenceGapDetected` into the band so a true gap bands no higher than the configured ceiling, behind the rec-11 default-OFF flag, reading stage4 not a recompute (`.opencode/skills/system-spec-kit/mcp_server/dist/lib/search/confidence-scoring.d.ts`)
- [ ] T009 Apply the same flag-gated edits to the compiled surfaces so they match the typed surfaces (`.opencode/skills/system-spec-kit/mcp_server/dist/lib/search/confidence-scoring.js`)
- [ ] T010 Document the calibration re-fit as a proven non-fix with the `:400` and `:388` file:line evidence and ship no curve edit (`.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Confirm the OFF arm reproduces the shipped band and envelope byte for byte on the aligned good queries and the correctly-weak authentication case, and the rec-8 flag ON drops the kubernetes off-corpus sample below good (`.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-eval-v2.mjs`)
- [ ] T012 Confirm the rec-10 flag ON resolves a borderline-grounding result to cite_with_caveat while a clear good and a clear miss keep their tiers, the rec-11 flag ON lowers the band on a true evidenceGapDetected, the rec-7 flag ON surfaces the grounding signal, and the grandfather report lists the legacy fixtures without failing them
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
