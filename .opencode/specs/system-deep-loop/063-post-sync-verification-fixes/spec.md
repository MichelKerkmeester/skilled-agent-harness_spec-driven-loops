---
title: "Feature Specification: Fix test failures surfaced by post-sync verification"
description: "Fix 5 real test failures found while independently verifying a large operator-directed working-tree sync commit."
trigger_phrases:
  - "deep-review contract parity"
  - "traceabilityChecks rollup"
  - "orchestrate-session executor family"
  - "gateClass"
  - "verification sweep"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/063-post-sync-verification-fixes"
    last_updated_at: "2026-07-12T00:00:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Packet completed: 5 test failures root-caused and fixed"
    next_safe_action: "None - packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts"
      - ".opencode/skills/system-spec-kit/scripts/tests/reducer-backlog-remediation.vitest.ts"
      - ".opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "post-sync-verification-fixes/063"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Fix test failures surfaced by post-sync verification

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-12 |
| **Branch** | `skilled/v4.0.0.0` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A large operator-directed sync of outstanding working-tree state (3,801 files, from concurrent sessions on `skilled/v4.0.0.0`) was committed and pushed. Independent post-commit verification (mechanical JSON/JSONL parse sweep, JS/CJS syntax check, then running the touched vitest suites) surfaced 5 real, non-mechanical test failures across 3 test files in `system-spec-kit` and `deep-ai-council`. These weren't caught by the sync itself since it was a catch-all commit, not a reviewed change.

### Purpose
Root-cause and fix each of the 5 failures individually rather than papering over them, distinguishing stale test expectations from real code gaps, and leave the touched suites green with no regressions to the suites that were already passing.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `scripts/tests/deep-review-contract-parity.vitest.ts`: fix 2 stale assertions about a third ("codex") deep-review runtime mirror that no longer exists anywhere in the repo.
- `scripts/tests/reducer-backlog-remediation.vitest.ts`: fix a test fixture missing the `gateClass` field the reducer's `buildTraceabilityRollup` genuinely requires.
- `deep-ai-council/scripts/orchestrate-session.cjs`: add real input validation — reject when `executor.model` is accidentally set to an executor family/kind identifier instead of a real model name.

### Out of Scope
- The 3,801-file sync commit itself (already committed/pushed prior to this packet; not re-litigated here).
- Restoring Codex CLI as a third deep-review runtime (investigated and explicitly rejected — see Key Decisions in implementation-summary.md).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts` | Modify | Drop the dead `.opencode/agents/deep-review.toml` mirror path; fix the hardcoded 3-entry (duplicate) runtime-ID expectation to the real 2-entry list |
| `.opencode/skills/system-spec-kit/scripts/tests/reducer-backlog-remediation.vitest.ts` | Modify | Add `gateClass: 'hard'` (+ `applicable: true`) to the LG-0006 fixture's result objects |
| `.opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs` | Modify | Add a `main()`-level guard rejecting `executor.model` values that collide with `EXECUTOR_KINDS`; add `execution_provenance` to `persistedSeat`; add `requested`/`effective` to `route_fields` |
| `.opencode/skills/system-deep-loop/deep-ai-council/vitest.config.mjs` | Create | Wire the skill's `.vitest.ts` suite into a real, checked-in config |
| `.opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/persist-artifacts.cjs` | Modify | Carry `execution_provenance` through into persisted `completed` progress records |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `deep-review-contract-parity.vitest.ts` passes | All tests in the file pass; fix is grounded in the real canonical `runtime_capabilities.json` registry, not invented |
| REQ-002 | `reducer-backlog-remediation.vitest.ts` passes | All tests in the file pass; fix matches the `gateClass` convention already used by the sibling passing test (`reduce-state-summary-fallback.test.cjs`) |
| REQ-003 | `orchestrate-session-cli.vitest.ts` passes | All tests in the file pass; the new guard uses the repo's existing shared `EXECUTOR_KINDS` constant, not a new hardcoded list |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | No regressions in previously-passing suites | `system-deep-loop/runtime` (161 tests) and `system-deep-loop/deep-improvement` (48 tests) still fully pass after the fix |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 5 originally-failing assertions now pass, verified by directly re-running each affected test file.
- **SC-002**: Each fix is traced to a concrete root cause (read against real source/registry files), not a guess.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Reintroducing Codex support was the "wrong" call | A dropped runtime capability stays dropped | Verified `.codex/agents/` doesn't exist anywhere in the repo and no current doc references Codex as live for deep-review before choosing test-fix over feature-restoration; documented the reasoning and evidence in implementation-summary.md for reversal if wrong |
| Dependency | `orchestrate-session.cjs` (`.cjs`) dynamically importing `executor-config.ts` | Fix breaks if Node's native TS import support changes | Reused an existing, already-working pattern (`fanout-run.cjs` does the identical dynamic `import()` of the same file) rather than inventing a new import mechanism |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None remaining. The `deep-ai-council` vitest-config question was resolved in a follow-up round: wired (`vitest.config.mjs` added), which surfaced and fixed 2 more pre-existing bugs — see implementation-summary.md.

<!-- /ANCHOR:questions -->

---
