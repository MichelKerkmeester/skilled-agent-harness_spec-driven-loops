---
title: "Tasks: Executable Open Design PreToolUse branch"
description: "Ordered implementation tasks with no-regression verification as a first-class, gating concern for the high-blast Codex PreToolUse hook."
trigger_phrases:
  - "executable pretooluse branch tasks"
  - "open design precondition tasks"
  - "codex hook branch tasks"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/002-executable-pretooluse-branch"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark every executable branch task complete with evidence"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Executable Open Design PreToolUse branch

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
*Baseline and map before any edit (45m).*

- [x] T001 Capture baseline: run the codex hook vitest suite and record the green pass count — 11/11 (`tests/codex-pre-tool-use.vitest.ts`) [15m]
- [x] T002 Capture baseline: `tsc --noEmit -p tsconfig.json` is clean (`mcp_server/`) [10m]
- [x] T003 Re-confirm the insertion point and the two return shapes by re-reading `handleCodexPreToolUse` (`hooks/codex/pre-tool-use.ts`) [10m]
- [x] T004 [P] Enumerate the guarded Open Design tool set the branch must gate (sourced from the policy; sibling phase populates the list) [10m]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
*Types, co-located helpers, and the two-phase branch (1.5h).*

### Types (minimal, additive)
- [x] T005 Add OPTIONAL `openDesignPreconditions?.guardedTools` (+ tolerant `toolPreconditions` form) to the policy type; `OpenDesignPreconditions` shape added (`hooks/codex/pre-tool-use.ts`) [15m]
- [x] T006 Add OPTIONAL `validateOpenDesignToken?` injection to `CodexPreToolUseDependencies` (testability seam) (`hooks/codex/pre-tool-use.ts`) [10m]

### Helpers (co-located; no new module)
- [x] T007 Implement `readPolicyQuiet(policyPath)` — side-effect-free read, no stderr diagnostic (`hooks/codex/pre-tool-use.ts:147`) [15m]
- [x] T008 Implement `resolveGuardedOpenDesignTools(deps)` — returns string[] from policy, `[]` on any missing/malformed shape (`hooks/codex/pre-tool-use.ts:239`) [15m]
- [x] T009 [P] Implement `extractDesignProofToken(input)` — tolerant lookup across `tool_input`/`toolInput`/`input`/top-level (`hooks/codex/pre-tool-use.ts:254`) [10m]
- [x] T010 [P] Implement `isStructurallyValidDesignProofToken(token)` — structure + freshness presence checks only (deep validation deferred to proxy) (`hooks/codex/pre-tool-use.ts:301`) [25m]

### Branch
- [x] T011 Implement `evaluateOpenDesignPrecondition(input, deps)` with the two-phase structure: Phase A membership (fail-OPEN → `null`), Phase B validation (fail-CLOSED → deny) (`hooks/codex/pre-tool-use.ts:324`) [20m]
- [x] T012 Insert the branch call BETWEEN the `if (!input)` guard and the Bash-only return; short-circuit only on a non-`null` verdict (`hooks/codex/pre-tool-use.ts:378`) [10m]

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
*First-class; the no-regression battery dominates (2.25h).*

### 3a. NO-REGRESSION BATTERY (run first; must dominate)
- [x] T013 Re-run the ENTIRE existing `codex-pre-tool-use.vitest.ts` suite UNCHANGED; matches the T001 baseline exactly (11/11 PASS) [15m]
- [x] T014 `tool: 'Bash'` deny-on-match still denies with the same reason (covered by the existing suite) [10m]
- [x] T015 `tool: 'Bash'` no-match still allows `{}` (existing suite) [10m]
- [x] T016 [P] `tool: 'Read'` → `{}` (branch returns `null`, not entered) [10m]
- [x] T017 [P] `tool: 'Edit'` → `{}` [5m]
- [x] T018 [P] `tool: 'Write'` → `{}` [5m]
- [x] T019 A non-Open-Design MCP tool name → `{}` (not in guarded list) [15m]
- [x] T020 Missing-policy `in_memory_default` stderr diagnostic still fires exactly once via the Bash lane, not from `readPolicyQuiet` [15m]
- [x] T021 Fail-open-on-policy-throw (injected throwing `readPolicy`) still returns `{}` for Bash [10m]
- [x] T022 Full-word matching, `bash_denylist` alias, and camelCase `toolInput.command` cases all still pass [10m]

### 3b. FEATURE TESTS (deny + fail-open)
- [x] T023 Guarded OD tool + policy `guardedTools` includes it + NO token → DENY (deny shape asserted) [15m]
- [x] T024 Guarded OD tool + injected `validateOpenDesignToken` that THROWS → DENY (fail-closed), NOT `{}` [15m]
- [x] T025 Guarded OD tool BUT policy has no `guardedTools` → allowed `{}` (fail-OPEN on policy-absence) [10m]
- [x] T026 [P] Guarded OD tool + structurally valid token → allowed `{}` [10m]

### 3c. TYPE / BUILD
- [x] T027 `tsc --noEmit -p tsconfig.json` clean (no pre-tool-use type errors) [10m]
- [x] T028 `tsc --build` path unaffected; additive change only, no build-shape change [10m]

### 3d. Evergreen + docs
- [x] T029 Grep the diff: NO spec/packet/phase IDs and NO `specs/` paths in code or comments [10m]
- [x] T030 Update `implementation-summary.md` with evidence (commands run, pass counts, deltas) [15m]
- [x] T031 Mark every `checklist.md` item with evidence [15m]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] No-regression battery green and matching the recorded baseline (11/11)
- [x] Deny (no-token) and deny (validator-throw) feature tests green
- [x] Fail-open-on-policy-absence test green
- [x] `tsc` clean (no pre-tool-use type errors); additive change leaves the build shape intact
- [x] No evergreen-ID leakage in code/comments
- [x] `checklist.md` fully verified with evidence

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Baseline BEFORE edit; verification is a first-class phase
- No-regression battery (3a) runs first and dominates the feature tests (3b)
- DI-based tests only; .codex/policy.json is NOT modified
-->
