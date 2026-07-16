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
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-speckit-memory/038-scoring-hardening"
    last_updated_at: "2026-07-04T17:51:07.092Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Completed all scoring-hardening tasks for recs 7 8 10 11 12"
    next_safe_action: "Graduate a flag only after its off-corpus fixture arm is green"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/noise-floor.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 100
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

- [x] T001 Confirmed the false-confirm metric driver is available read-only; the off-corpus fixtures are the upstream dependency (`.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-false-confirm-eval.mjs`)
- [x] T002 Confirmed the lexical signals `fts_score` and `bm25` are read on the raw rows by `resolveLexicalSignal` (`.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts`)
- [x] T003 Defined the four default-OFF flag names; grandfathering is via default-OFF (flag-OFF reproduces the shipped output) (`.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts`, `ENV_REFERENCE.md`)
- [x] T004 [P] Recorded the corpus noise-floor keyed by the embedder it was measured against, with a fail-closed resolver (`.opencode/skills/system-spec-kit/mcp_server/lib/search/noise-floor.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Surfaced the grounding or low-grounding signal on the envelope at the verdict-field population behind the rec-7 default-OFF flag, reusing the raw-row lexical signals via `assessGrounding` (`.opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts`)
- [x] T006 Subtracted the measured noise-floor from absolute relevance before the band read, floored at zero, behind the rec-8 default-OFF flag (`.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts`)
- [x] T007 Added the `cite_with_caveat` tier between cite_results and do_not_cite in the citation policy behind the rec-10 default-OFF flag (`.opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts`)
- [x] T008 Bridged `stage4.evidenceGapDetected` into the verdict so a true gap caps a good at weak, behind the rec-11 default-OFF flag, reading the threaded stage4 signal not a recompute (`.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts`)
- [x] T009 Regenerated the compiled surfaces from the typed sources with `npm run build` so they match (`.opencode/skills/system-spec-kit/mcp_server/dist/lib/search/confidence-scoring.js`)
- [x] T010 Documented the calibration re-fit as a proven non-fix with the pre-calibration band-read evidence and shipped no curve edit (`.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Confirmed the OFF arm reproduces the shipped band and envelope and the rec-8 flag ON drops the off-corpus sample below good (`.opencode/skills/system-spec-kit/mcp_server/tests/scoring-hardening.vitest.ts`)
- [x] T012 Confirmed the rec-10 flag ON resolves a borderline-grounding result to cite_with_caveat while a clear good and a clear miss keep their tiers, the rec-11 flag ON caps a good at weak on a true evidenceGapDetected, the rec-7 flag ON surfaces the grounding signal, and flag-OFF leaves the legacy behavior unchanged (`.opencode/skills/system-spec-kit/mcp_server/tests/scoring-hardening.vitest.ts`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
