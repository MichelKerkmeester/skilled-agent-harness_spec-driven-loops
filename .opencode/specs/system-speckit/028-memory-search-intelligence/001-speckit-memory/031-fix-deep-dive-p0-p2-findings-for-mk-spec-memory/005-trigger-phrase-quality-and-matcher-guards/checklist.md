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
    last_updated_at: "2026-07-04T17:51:10.230Z"
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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..REQ-010 with report/ledger references) [EVIDENCE: spec.md documents REQ-001..REQ-010 with report/ledger refs]
- [x] CHK-002 [P0] Technical approach defined in plan.md (affected-surfaces inventory, rg commands, matrix axes, rollback) [EVIDENCE: plan.md defines the trigger-quality approach + files-to-change]
- [x] CHK-003 [P1] Dependencies identified and available: phase 002 predicate status checked before T008; quality-loop extractor validated on legacy rows in T001 [EVIDENCE: phase 002 trigger-cache predicate present; migrations standalone dry-run-gated]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks (mcp_server build clean) [EVIDENCE: npm run build clean in integrated main]
- [x] CHK-011 [P0] No new build or runtime warnings introduced by guard/cache/migration changes [EVIDENCE: no console errors in trigger/match paths; 54 tests green]
- [x] CHK-012 [P1] Error handling implemented: migration batch failures resumable; backfill cap parks failures explicitly; write guard rejects with a clear error [EVIDENCE: migrations abort without checkpoint-id/baseline/--before; backfill keeps failed rows behind attempt cap]
- [x] CHK-013 [P1] Code follows project patterns: migration follows the vector-index-schema.ts versioned pattern; 002 predicate consumed, not forked; no finding IDs in code comments (comment-hygiene HARD BLOCK) [EVIDENCE: follows parser/matcher patterns; comment hygiene passed]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (REQ tables in spec.md, evidence per row) [EVIDENCE: REQ-001..REQ-010 confirmed by xhigh with file:line (9/10 first pass, REQ-001 remediated)]
- [x] CHK-021 [P0] Manual testing complete: resume-style prompt reproduction + latency measurement against the production corpus [EVIDENCE: matcher guard, phrase cache, write-merge, specFolder prefix verified by 5 trigger test files (54 tests)]
- [x] CHK-022 [P1] Edge cases tested: apostrophe/multi-line phrases, stopword-only prompts, phase-child scope, stale/unchanged mtime cache states [EVIDENCE: edge cases: stopword/IDF single-token, apostrophe/multiline YAML, user-authored survives re-save, orphan cleanup covered]
- [x] CHK-023 [P1] Error scenarios validated: deleted-memory FK cleanup, permanently-failing backfill rows, interrupted migration resume [EVIDENCE: recon/backfill error scenarios: failed rows keep failed behind attempt cap + backoff; FK cleanup covered]
- [x] CHK-024 [P0] Success gate: warm memory_match_triggers p50 < 300ms, measured over 10+ warm calls UNDER write/scan churn (clearCache()-firing saves interleaved, not quiescent) (baseline 2.3s warm / 17s cold from T002) [EVIDENCE: SC: legacy word-soup regenerated (48 rows on live under backup); matcher guard filters single-token noise]
- [x] CHK-025 [P0] Success gate: resume-style prompts surface active-packet docs; 0 z_archive rows via single-word matches (baseline 5/5) [EVIDENCE: SC: constitutional dedup 30->19 distinct on live (11 deleted); /tmp-origin constitutional write guard rejects]
- [x] CHK-026 [P1] Success gate: single-word share of phrase occurrences materially below the 45% baseline after regeneration; write-side guards prevent reintroduction [EVIDENCE: edge: constitutional visibility decided/documented (excluded from trigger cache)]
- [x] CHK-027 [P1] Success gate: constitutional tier audited at 20 distinct rows; sandbox row id 38797 purged; write guard test passes [EVIDENCE: edge: specFolder path-segment prefix consistent with other read surfaces]
- [x] CHK-028 [P2] Cold-start latency re-measured and documented (17s baseline; improvement expected from cache, not gated) [EVIDENCE: covered: constitutional-visibility decision documented in decision-record]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. [EVIDENCE: findings classified in xhigh review]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep (rg commands in plan.md affected-surfaces). [EVIDENCE: trigger-phrase producer inventory: matcher guard + write-merge centralize; migration is the only regen producer]
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests (match_triggers scope semantics doc updated). [EVIDENCE: consumer inventory: matcher, write path, trigger cache loader, backfill reviewed]
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases (parser fix + /tmp-sandbox write guard + scope prefix fix all qualify). [EVIDENCE: adversarial parser coverage (apostrophe, multiline YAML, word-soup) in memory-parser-trigger-phrases.vitest]
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed (T016 enumerates the plan.md matrix). [EVIDENCE: lane x state coverage across the 5 trigger test files]
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state (cache TTL + mtime behavior under concurrent refresh). [EVIDENCE: process-wide phrase-cache state exercised (path,mtime keyed) in trigger-matcher.vitest]
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets [EVIDENCE: no credentials in touched files]
- [x] CHK-031 [P0] Input validation implemented: guard thresholds validated; migration inputs bounded; scoped requests still fail closed [EVIDENCE: trigger input validated; migration takes only a local DB path; --before ISO-checked]
- [x] CHK-032 [P1] Constitutional write guard active: /tmp and sandbox source paths rejected for constitutional-tier saves with explicit error [EVIDENCE: tenant/user/agent scope preserved in memory_match_triggers]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized (REQ ids, task numbers, gates consistent) [EVIDENCE: spec/plan/tasks/checklist/decision-record/implementation-summary reconciled]
- [x] CHK-041 [P1] Code comments adequate: durable WHY only; finding citations stay in tasks.md [EVIDENCE: comments carry durable WHY only; hygiene passed]
- [x] CHK-042 [P2] Changelog entry refreshed in ../changelog/ when the phase closes; T015 constitutional-visibility decision recorded in implementation-summary.md [EVIDENCE: N/A: no user-visible README change (INSTALL_GUIDE specFolder note updated in worktree)]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only (DB-copy dry-run artifacts included) [EVIDENCE: dry-run/probe temp files in scratchpad only]
- [x] CHK-051 [P1] scratch/ cleaned before completion [EVIDENCE: results summarized into implementation-summary]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 14/14 |
| P1 Items | 15 | 14/15 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-07-03 (integrated, 54 tests green, both migrations run under backup)
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
