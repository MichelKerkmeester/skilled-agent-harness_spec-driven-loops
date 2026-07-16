---
title: "Implementation Plan: Fix test failures surfaced by post-sync verification"
description: "Root-cause and fix 5 real test failures in system-spec-kit and deep-ai-council found during independent verification of a large sync commit."
trigger_phrases:
  - "reduce-state.cjs"
  - "orchestrate-session.cjs"
  - "EXECUTOR_KINDS"
  - "runtime_capabilities.json"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/033-post-sync-verification-fixes"
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
      session_id: "post-sync-verification-fixes/033"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Fix test failures surfaced by post-sync verification

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CJS + native-TS-import), TypeScript |
| **Framework** | Vitest |
| **Storage** | n/a |
| **Testing** | vitest (per-package configs: `system-spec-kit/mcp_server/vitest.config.ts`, `system-deep-loop/runtime/vitest.config.ts`, ad-hoc config for `deep-ai-council` which has none checked in) |

### Overview
Three unrelated root causes, one fix each, no shared code path: (1) a test fixture missing a required field the reducer genuinely enforces, (2) two stale test assertions referencing a deep-review runtime (Codex) that was fully removed from the canonical registry at some earlier point, (3) a real, previously-missing input-validation guard in the deep-ai-council CLI entrypoint.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root cause traced to source (not guessed) for each of the 5 failures
- [x] Confirmed which failures are test-fixture bugs vs. real code gaps

### Definition of Done
- [x] All 5 originally-failing assertions pass
- [x] Previously-passing suites (161 + 48 tests) still pass, re-verified
- [x] Docs updated (spec/plan/tasks/implementation-summary)

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Targeted root-cause fixes; no new abstractions introduced.

### Key Components
- **`runtime_capabilities.json`**: canonical deep-review runtime registry (2 runtimes: opencode, claude) — source of truth the stale test should match.
- **`reduce-state.cjs#buildTraceabilityRollup`**: recomputes `gatingFailures` from each result's own `gateClass` field (not from the raw per-iteration summary) — confirmed correct against a sibling passing test's fixture convention.
- **`executor-config.ts#EXECUTOR_KINDS`**: shared canonical list (`['native', 'cli-claude-code', 'cli-opencode']`) reused for the new CLI guard rather than a new hardcoded list.

### Data Flow
1. `orchestrate-session.cjs#main()` now checks `executorConfig.executor.model` against `EXECUTOR_KINDS` before doing anything else — rejects early (exit 1, no spawn) if they collide.
2. `buildTraceabilityRollup` is unchanged; only the LG-0006 test fixture gained the `gateClass`/`applicable` fields it was missing.
3. `deep-review-contract-parity.vitest.ts`'s `runtimeMirrors` array and hardcoded ID list now match the real 2-runtime registry.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Root-cause each failure
- [x] Traced `.toml` mirror expectation to zero git history anywhere — confirmed dead, not a gap
- [x] Traced runtime-ID duplicate expectation against the real 2-entry canonical registry
- [x] Traced `gatingFailures` mismatch to a missing `gateClass` field, confirmed against a sibling passing test's fixture convention
- [x] Traced the CLI validation gap to a real missing guard, found the existing shared `EXECUTOR_KINDS` constant to reuse

### Phase 2: Apply fixes
- [x] `deep-review-contract-parity.vitest.ts`: dropped dead `.toml` mirror path, fixed hardcoded ID list to `['opencode', 'claude']`
- [x] `reducer-backlog-remediation.vitest.ts`: added `gateClass: 'hard'`, `applicable: true` to the LG-0006 fixture
- [x] `orchestrate-session.cjs`: added a `main()`-level guard using the existing `EXECUTOR_KINDS` import pattern (already used identically by `fanout-run.cjs`)

### Phase 3: Verification
- [x] Re-ran all 3 fixed test files individually — all pass
- [x] Re-ran the previously-clean suites (`system-deep-loop/runtime` 161 tests, `deep-improvement` 48 tests) — zero regressions

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `buildTraceabilityRollup`, `resolveRuntimeCapability`/`listRuntimeCapabilityIds`, `orchestrate-session.cjs#main` | vitest |
| Regression | Full previously-passing suites in `system-deep-loop/runtime` and `deep-improvement` | vitest |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `executor-config.ts` dynamic `import()` from a `.cjs` file | Internal | Green (pre-existing working pattern, reused not invented) | New guard wouldn't load; falls back to existing (broken) behavior |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any of the 3 fixes causes an unexpected regression elsewhere.
- **Procedure**:
  1. `git revert` the single commit containing these 3 files' changes (isolated, no shared edits with other work).
  2. Re-run the affected test files to confirm the revert restores the pre-fix (failing) state cleanly.

<!-- /ANCHOR:rollback -->

---
