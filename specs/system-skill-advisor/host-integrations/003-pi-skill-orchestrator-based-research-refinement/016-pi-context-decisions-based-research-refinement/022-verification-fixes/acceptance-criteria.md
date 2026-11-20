---
title: "Acceptance Criteria: Phase 22: verification-fixes"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "verification fixes acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/022-verification-fixes"
    last_updated_at: "2026-11-20T15:31:24Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-022-verification-fixes"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 22: verification-fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `022-verification-fixes`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-20
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a heartbeat watchdog whose own checks were suspended for ten minutes, When it checks before the child writes again, Then it sends no signal, and a child still silent at the next check gets SIGTERM | `vitest run --config vitest.config.bin.ts bin/launcher-heartbeat-watchdog.vitest.ts` from `.skilled`. Observed at `d35466eb1d8`: both new cases failed on the base source with SIGTERM on wake, then 13 passed | Met | - |
| AC-002 | REQ-002 | Given a server whose launcher died before the watch was armed, When the watch ticks, Then `onOrphaned` runs | `npx vitest run tests/daemon/liveness.vitest.ts`. Observed at `d35466eb1d8`: the new case failed on the base source, then 4 passed | Met | - |
| AC-003 | REQ-003 | Given lane weight 0 and a stale projection, When both lane functions and `scoreAdvisorPrompt` run, Then the reason stays `lane_weight_zero` and `degradedLanes` lacks `semantic_shadow` | `npx vitest run tests/semantic-lane-weight-zero.vitest.ts`. Observed at `d35466eb1d8`: the case failed on the base source with `projection_embedding_stale`, then passed | Met | - |
| AC-004 | REQ-004 | Given lane weight 0.05 and incomplete coverage, When the prompt embed wrapper runs, Then no embed call is made, the reason is `incomplete_skill_vectors` and the merged lane health is `runtime_degraded` | Same file. Observed at `d35466eb1d8`: the case failed on the base source with 1 embed call, then passed | Met | - |
| AC-005 | REQ-005 | Given lane weight 0.05 and a set prompt vector, When coverage turns incomplete, Then `scoreSemanticShadowExactSubset` returns no match | Same file. Observed at `d35466eb1d8`: the case failed on the base source with 1 match, then passed | Met | - |
| AC-006 | REQ-006 | Given the watcher's default reindex, When a skill file changes twice, Then the refresh is requested once per reindex with the skills root | `npx vitest run tests/daemon/watcher-embedding-refresh.vitest.ts`. Observed at `d35466eb1d8`: 2 passed; with the refresh call removed both failed, and `watcher.ts` was restored with no diff | Met | - |
| AC-007 | REQ-007 | Given a refresh pass that throws while a request is queued, When the run settles, Then both callers get the queued pass's result and coverage is complete | `npx vitest run tests/skill-graph/refresh-in-background.vitest.ts`. Observed at `d35466eb1d8`: the case rejected with `probe exploded` on the base source, then 8 passed | Met | - |
| AC-008 | REQ-008 | Given `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` and a working directory that throws, When the hook runs, Then it returns `{}` | `npx vitest run tests/hooks/claude-user-prompt-submit-hook.vitest.ts`. Observed at `d35466eb1d8`: the base source returned the outage line, then the hook suites passed 254 | Met | - |
| AC-009 | REQ-009 | Given a clean DSH compaction, When the next turn starts at once, Then the route receipt is dropped and the clock rotated before the advisor runs | `node --test .skilled/skills/system-skill-advisor/hooks/tests/dsh-prompt-advisor.test.mjs`. Observed at `d35466eb1d8`: both new cases failed on the base source, then 20 passed | Met | - |
| AC-010 | REQ-010 | Given the runtime source, When it is searched, Then no comment says vectors are written only by a trusted scan | `rg -n "written only by a trusted"` under the runtime, excluding `dist`. Observed at `d35466eb1d8`: no match | Met | - |
| AC-011 | REQ-011 | Given the shared strip fixture, When both readers run, Then the `user-task-before-follow-up-marker` row passes in both | `npx vitest run tests/legacy/advisor-prompt-policy.vitest.ts` and `python3 tests/python/test_skill_advisor.py`. Observed at `d35466eb1d8`: 34 passed and `pass=123, fail=0` | Met | - |
| AC-013 | REQ-013 | Given a first refresh pass that succeeds and a queued pass whose probe throws `database is locked`, When the run settles, Then its result keeps the first pass's counts and carries a warning naming the error | `npx vitest run tests/skill-graph/refresh-in-background.vitest.ts`. Observed at `d35466eb1d8`: the case failed with an empty `warnings` list before the fix, then 9 passed | Met | - |
| AC-014 | REQ-014 | Given each of `dim_mismatch`, `adapter_unavailable` and `database_absent`, When the handler merges lane health, Then the lane is `runtime_degraded`, and `lane_weight_zero` adds nothing | `npx vitest run tests/semantic-lane-weight-zero.vitest.ts`. Observed at `d35466eb1d8`: `dim_mismatch` merged to nothing before the fix, then the file passed | Met | - |
| AC-015 | REQ-015 | Given a spawned server, When the launcher builds its env, Then `SYSTEM_SKILL_ADVISOR_LAUNCHER_PID` is the launcher pid, and `resolveLauncherPid` prefers it over the parent pid | `bin/launcher-threshold-env.vitest.ts` and `tests/daemon/liveness.vitest.ts`. Observed at `d35466eb1d8`: both new cases failed before the fix, then passed | Met | - |
| AC-012 | REQ-012 | Given all fixes, When every suite runs after a rebuild and `skill_graph_scan --trusted`, Then none reports a failure absent from the baseline, and the six changed docs state the shipped behavior | Observed at `d35466eb1d8`: runtime 196 files, 2570 passed, 8 skipped against 2559 baseline; bin 97 passed; DSH 20 passed; Python `pass=123, fail=0`; typecheck exit 0 | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

Every criterion is Met with observed evidence.
<!-- /ANCHOR:closure -->
