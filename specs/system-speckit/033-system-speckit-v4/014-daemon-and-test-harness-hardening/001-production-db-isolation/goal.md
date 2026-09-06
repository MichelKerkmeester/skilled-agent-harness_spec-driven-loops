---
title: "Goal: Phase 1: Production Database Isolation"
description: "The durable directive this packet executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/045-daemon-and-test-harness-hardening/001-production-db-isolation"
    last_updated_at: "2026-08-30T10:24:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-30-production-db-isolation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 1: Production Database Isolation

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short —
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make it impossible for a test run to resolve the production memory database, whichever config or working directory it starts from.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The bypass is reproduced before it is fixed, and the same check proves the fix. |
| D2 | Assert on the resolved path only. No test opens a handle against the live database. |
| D3 | Two entry points sharing one guard, or one entry point. Not two guards kept in sync by hand. |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 2. COMPLETION CRITERIA

- [x] Runs started from `scripts/`, `mcp-server/` and the skill root each resolve a throwaway database directory
- [x] A run that targets the production directory fails closed with a named error instead of opening it
- [x] A recorded pre-fix negative control shows the old path resolving to the production directory
- [x] A drift check fails when a vitest config globs `mcp-server/tests/**` without the isolation setup
- [x] Full suite run shows no new failures against the recorded baseline
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 3. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase authored and validated | Done | `validate.sh --strict` RESULT: PASSED, Errors: 0 |
| Implementation | Done | 3 files changed; 3 tests pass; all three entry points resolve a throwaway dir |
| Negative control captured | Done | pre-fix `scripts/` run resolved the production dir |
| Configs reconciled | Done | root config shares the mcp-server `setupFiles` |
| Criteria verified | Done | all three entry points resolve a throwaway dir; negative control fails closed after the fix |
| Resolver fails closed | Done | `ProductionDatabaseResolutionError`; drift check proven non-vacuous |

### Deviations and findings

| Item | Note |
|------|------|
| Open question still unanswered | Resolver-wide guard versus test-scoped. Resolver-wide is stronger but widens blast radius to production callers. Blocks Definition of Ready. |
| Production database is 12.9 GB and daemon-held | Observed held open with `.lock` and `.lock-journal` descriptors during a run that used the unguarded config. |
<!-- /ANCHOR:log -->
