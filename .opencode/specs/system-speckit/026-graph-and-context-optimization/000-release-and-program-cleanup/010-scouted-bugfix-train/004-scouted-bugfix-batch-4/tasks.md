---
title: "Task Breakdown: Scouted Bugfix Batch 4"
description: "Task list for the verify-first deep-dive -> implement workflow over the batch-4 scouted candidates (9 confirmed fixes; 11 excluded as policy/migration/unconfirmed)."
trigger_phrases:
  - "scouted bugfix batch 4 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/010-scouted-bugfix-train/004-scouted-bugfix-batch-4"
    last_updated_at: "2026-06-03T09:00:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "All deep-dive + implement tasks complete; 9 fixes verified"
    next_safe_action: "Metadata + validate + reconcile"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/formatters/token-metrics.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/utils/format-helpers.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scouted-bugfix-batch-4-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Task Breakdown: Scouted Bugfix Batch 4

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

**Task Format**: `T### Description — evidence`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-01 Carry over batch-4 candidate list from the scout
- [x] T-02 [P] Run 9 parallel gpt-5.5-fast confirm deep-dives against the real code
- [x] T-03 Classify: 9 CONFIRMED, 11 EXCLUDED (policy/migration/unconfirmed)
- [x] T-04 Document exclusion rationale for 11 excluded candidates — out-of-scope; none edited
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-05 [P] Run 9 parallel disjoint-file implement agents on the confirmed defects
- [x] T-06 Fix (warm-tier-savings-metric, P1): capture `fullContentTokens` before 150-char truncation in `token-metrics.ts`; pass through `memory-triggers.ts`; use as WARM baseline (3x kept only as fallback); regression test passes in `modularization.vitest.ts`
- [x] T-07 Fix (anchor-miss-returnedtokens, P1): all-anchors-missing branch in `search-results.ts` recomputes `returnedTokens` and `savingsPercent` from `estimateTokens(content)`, mirroring the partial-match branch; regression test passes in `anchor-prefix-matching.vitest.ts`
- [x] T-08 Fix (formatagestring-nan, P1): add `Number.isNaN(timestamp)` guard in `format-helpers.ts` `formatAgeString`; return "never" sentinel for invalid ISO; regression test passes in `search-results-format.vitest.ts`
- [x] T-09 Fix (shadow-promotion-gate, P1): add `MIN_NDCG_IMPROVEMENT` epsilon in `shadow-scoring.ts`; return empty Map (not uniform-0.5) when `maxAbsoluteSignalTotal===0`; update `shadow-evaluation-runtime.ts` to consume empty-Map guard; regression test passes in `shadow-scoring-holdout.vitest.ts`
- [x] T-10 Fix (adapter-common-dead-branch, P2): dead ternary "BLOCKED : BLOCKED" → "BLOCKED : FAIL" in `adapter-common.ts` so non-blocked spawn errors (EPIPE, ECONNRESET) classify as FAIL; regression test passes in `matrix-adapter-common.vitest.ts`
- [x] T-11 Fix (check-graph-metadata-shape-last-active, P2): add basename fallback existence test in `check-graph-metadata-shape.sh` so full packet_id in `derived.last_active_child_id` no longer triggers spurious WARNING; regression test passes in `check-graph-metadata-shape-last-active-child.sh`
- [x] T-12 Fix (cli-gemini-auth-preflight, P1): replace non-existent `gemini config list` call with filesystem probe of `~/.gemini/oauth_creds.json` in `cli-gemini/SKILL.md`; regression test passes
- [x] T-13 Fix (cli-codex-auth-preflight, P1): replace unrecognized `codex auth status` (exit 2) with `codex login status` in `cli-codex/SKILL.md`; regression test passes
- [x] T-14 Fix (token-budget-envelope, P1): after pop loop in `context-server.ts`, recompute `data.constitutionalCount` from survivors and rebuild `envelope.summary` so counts agree with `data.results.length`; regression test passes in `token-budget-constitutional-sync.vitest.ts`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-15 Each of the 9 fixes has an added or updated regression test that passes
- [x] T-16 Verify P1 fixes: warm-tier metric uses pre-truncation count; anchor-miss branch computes accurate metrics; formatAgeString returns "never" for invalid ISO; shadow gate rejects zero-delta cycles; context-server counts agree with survivors; CLI SKILL.md pre-flights use working commands
- [x] T-17 Comment-hygiene clean: no spec-path / packet-id tracking artifacts introduced into any edited source file
- [x] T-18 Build: system-spec-kit mcp_server `npm run build` exit 0
- [x] T-19 Orchestrator reviewed every diff; confirmed builds + tests; 9 agents touched disjoint file sets
- [x] T-20 description.json + graph-metadata.json
- [x] T-21 validate.sh --strict → 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All deep-dive + implement tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] 9 fixes applied; each stack-verified
- [x] Ship tasks (metadata, validate) complete
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
