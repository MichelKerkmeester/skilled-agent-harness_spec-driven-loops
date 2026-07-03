---
title: "Verification Checklist: Phase 5: trigger-phrase-quality-and-matcher-guards"
description: "P0/P1/P2 verification gates for trigger-phrase data repair, write-side and matcher-side guards, constitutional hygiene, and the match_triggers latency target (warm p50 < 300ms vs 2.3s baseline)."
trigger_phrases:
  - "trigger phrase quality verification"
  - "matcher guard checklist"
  - "match triggers latency gate"
  - "trigger quality success gates"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/005-trigger-phrase-quality-and-matcher-guards"
    last_updated_at: "2026-07-03T12:15:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored verification checklist with phase-specific success gates"
    next_safe_action: "Start T001 confirm-before-fix verification of the agent-reported findings"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/005-trigger-phrase-quality-and-matcher-guards"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 5: trigger-phrase-quality-and-matcher-guards

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

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

- [ ] CHK-001 [P0] Requirements documented in spec.md (REQ-001..REQ-010 with report/ledger references)
- [ ] CHK-002 [P0] Technical approach defined in plan.md (affected-surfaces inventory, rg commands, matrix axes, rollback)
- [ ] CHK-003 [P1] Dependencies identified and available: phase 002 predicate status checked before T008; quality-loop extractor validated on legacy rows in T001
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks (mcp_server build clean)
- [ ] CHK-011 [P0] No new build or runtime warnings introduced by guard/cache/migration changes
- [ ] CHK-012 [P1] Error handling implemented: migration batch failures resumable; backfill cap parks failures explicitly; write guard rejects with a clear error
- [ ] CHK-013 [P1] Code follows project patterns: migration follows the vector-index-schema.ts versioned pattern; 002 predicate consumed, not forked; no finding IDs in code comments (comment-hygiene HARD BLOCK)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met (REQ tables in spec.md, evidence per row)
- [ ] CHK-021 [P0] Manual testing complete: resume-style prompt reproduction + latency measurement against the production corpus
- [ ] CHK-022 [P1] Edge cases tested: apostrophe/multi-line phrases, stopword-only prompts, phase-child scope, stale/unchanged mtime cache states
- [ ] CHK-023 [P1] Error scenarios validated: deleted-memory FK cleanup, permanently-failing backfill rows, interrupted migration resume
- [ ] CHK-024 [P0] Success gate: warm memory_match_triggers p50 < 300ms, measured over 10+ warm calls (baseline 2.3s warm / 17s cold from T002)
- [ ] CHK-025 [P0] Success gate: resume-style prompts surface active-packet docs; 0 z_archive rows via single-word matches (baseline 5/5)
- [ ] CHK-026 [P1] Success gate: single-word share of phrase occurrences materially below the 45% baseline after regeneration; write-side guards prevent reintroduction
- [ ] CHK-027 [P1] Success gate: constitutional tier audited at 20 distinct rows; sandbox row id 38797 purged; write guard test passes
- [ ] CHK-028 [P2] Cold-start latency re-measured and documented (17s baseline; improvement expected from cache, not gated)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep (rg commands in plan.md affected-surfaces).
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests (match_triggers scope semantics doc updated).
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases (parser fix + /tmp-sandbox write guard + scope prefix fix all qualify).
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed (T016 enumerates the plan.md matrix).
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state (cache TTL + mtime behavior under concurrent refresh).
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented: guard thresholds validated; migration inputs bounded; scoped requests still fail closed
- [ ] CHK-032 [P1] Constitutional write guard active: /tmp and sandbox source paths rejected for constitutional-tier saves with explicit error
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized (REQ ids, task numbers, gates consistent)
- [ ] CHK-041 [P1] Code comments adequate: durable WHY only; finding citations stay in tasks.md
- [ ] CHK-042 [P2] Changelog entry refreshed in ../changelog/ when the phase closes; T015 constitutional-visibility decision recorded in implementation-summary.md
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only (DB-copy dry-run artifacts included)
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 0/14 |
| P1 Items | 15 | 0/15 |
| P2 Items | 2 | 0/2 |

**Verification Date**: pending (set when phase verification runs)
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
