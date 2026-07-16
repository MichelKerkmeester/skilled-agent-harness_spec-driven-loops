---
title: "Verification Checklist: Scouted Bugfix Batch 4"
description: "QA verification for the verify-first deep-dive -> implement workflow and the 9 confirmed defect fixes; 11 candidates excluded as policy/migration/unconfirmed."
trigger_phrases:
  - "scouted bugfix batch 4 checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/000-release-and-program-cleanup/010-scouted-bugfix-train/004-scouted-bugfix-batch-4"
    last_updated_at: "2026-06-03T09:00:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Verification items confirmed via per-fix regression tests + build"
    next_safe_action: "Validate --strict and reconcile"
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
# Verification Checklist: Scouted Bugfix Batch 4

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..012)
- [x] CHK-002 [P0] Technical approach defined in plan.md (verify-first deep-dive → implement over batch-4 candidates)
- [x] CHK-003 [P1] Batch-4 candidates carried over; disjoint file partition defined; 11 exclusions documented with rationale
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Fixes are defect-driven; only confirmed targets edited; no scope creep into excluded candidates
- [x] CHK-011 [P0] No spec-path/packet-id introduced into any edited source file as a tracking artifact
- [x] CHK-012 [P1] 11 excluded candidates documented (policy/migration/unconfirmed); none edited
- [x] CHK-013 [P1] 9 implement agents touched disjoint file sets; no overlapping writes
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Each candidate confirmed or excluded by a gpt-5.5-fast deep-dive before any edit
- [x] CHK-021 [P0] The 11 excluded candidates NOT acted on (policy/migration/unconfirmed; left untouched)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P1] Fix — warm-tier-savings-metric (P1): `fullContentTokens` captured before 150-char truncation in `token-metrics.ts`; passed via `memory-triggers.ts`; 3x kept as fallback; regression test passes in `modularization.vitest.ts`
- [x] CHK-031 [P1] Fix — anchor-miss-returnedtokens (P1): all-anchors-missing branch in `search-results.ts` recomputes `returnedTokens` + `savingsPercent` from `estimateTokens(content)`; regression test passes in `anchor-prefix-matching.vitest.ts`
- [x] CHK-032 [P1] Fix — formatagestring-nan (P1): `Number.isNaN(timestamp)` guard in `format-helpers.ts` returns "never" sentinel for invalid ISO; regression test passes in `search-results-format.vitest.ts`
- [x] CHK-033 [P1] Fix — shadow-promotion-gate (P1): `MIN_NDCG_IMPROVEMENT` epsilon + empty Map on `maxAbsoluteSignalTotal===0` in `shadow-scoring.ts`; `shadow-evaluation-runtime.ts` updated; regression test passes in `shadow-scoring-holdout.vitest.ts`
- [x] CHK-034 [P2] Fix — adapter-common-dead-branch (P2): "BLOCKED : FAIL" replaces dead "BLOCKED : BLOCKED" in `adapter-common.ts`; EPIPE/ECONNRESET now classify as FAIL; regression test passes in `matrix-adapter-common.vitest.ts`
- [x] CHK-035 [P2] Fix — check-graph-metadata-shape-last-active (P2): basename fallback existence test in `check-graph-metadata-shape.sh`; full packet_id in `derived.last_active_child_id` no longer triggers spurious WARNING; regression test passes in `check-graph-metadata-shape-last-active-child.sh`
- [x] CHK-036 [P1] Fix — cli-gemini-auth-preflight (P1): filesystem probe of `~/.gemini/oauth_creds.json` replaces non-existent `gemini config list` in `cli-gemini/SKILL.md`; regression test passes
- [x] CHK-037 [P1] Fix — cli-codex-auth-preflight (P1): `codex login status` replaces unrecognized `codex auth status` in `cli-codex/SKILL.md`; regression test passes
- [x] CHK-038 [P1] Fix — token-budget-envelope (P1): `data.constitutionalCount` recomputed from survivors + `envelope.summary` rebuilt after pop loop in `context-server.ts`; regression test passes in `token-budget-constitutional-sync.vitest.ts`
- [x] CHK-039 [P0] 9 fixes applied; 0 skipped from the confirmed set
- [x] CHK-040 [P0] system-spec-kit mcp_server `npm run build` exit 0
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-050 [P1] No new attack surface introduced; fixes are correctness-class, scope-locked to confirmed defects
- [x] CHK-051 [P1] cli-gemini/cli-codex auth pre-flight corrections do not expose credentials; filesystem probe reads existence only
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-060 [P1] spec/plan/tasks/implementation-summary synchronized to shipped state
- [x] CHK-061 [P2] Exclusion rationale recorded for 11 excluded candidates (policy/migration/unconfirmed)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-070 [P1] No temp/scratch artifacts introduced into the repo; edits land only in the confirmed-defect files (sources + added regression tests)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 5 | 5/5 |
| P1 Items | 13 | 13/13 |
| P2 Items | 3 | 3/3 |

**Verification Date**: 2026-06-03

### Ship status

- [x] CHK-080 [P1] description.json + graph-metadata.json present
- [x] CHK-081 [P0] `validate.sh --strict` → Errors 0
- [x] CHK-082 [P1] Completion metadata reconciled across packet docs
<!-- /ANCHOR:summary -->
