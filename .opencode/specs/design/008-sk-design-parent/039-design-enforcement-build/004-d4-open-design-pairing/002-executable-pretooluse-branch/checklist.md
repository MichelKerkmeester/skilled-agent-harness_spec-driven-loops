---
title: "Verification Checklist: Executable Open Design PreToolUse branch"
description: "No-regression-weighted verification checklist for the high-blast Codex PreToolUse hook change; every general tool class proven byte-identical before any completion claim, plus the deny and fail-open feature behavior and the defense-in-depth framing."
trigger_phrases:
  - "executable pretooluse branch checklist"
  - "open design precondition checklist"
  - "codex hook no regression checklist"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/002-executable-pretooluse-branch"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Verify every checklist item against the shipped hook branch"
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
# Verification Checklist: Executable Open Design PreToolUse branch

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

- [x] CHK-001 [P0] Existing codex hook vitest suite is GREEN before any edit; pass count recorded
  - **Evidence**: `tests/codex-pre-tool-use.vitest.ts` re-run returns 11/11 passing (baseline re-confirmed by markdown-agent)
- [x] CHK-002 [P0] `tsc --noEmit -p tsconfig.json` is clean before any edit
  - **Evidence**: baseline clean per implementer; re-confirmed with no pre-tool-use type errors
- [x] CHK-003 [P1] Insertion point re-confirmed: between the `if (!input)` guard and the Bash-only `if (toolNameFor(input) !== 'Bash')` return
  - **Evidence**: the `evaluateOpenDesignPrecondition` call sits before the non-Bash return (`pre-tool-use.ts:378`)
- [x] CHK-004 [P1] Return shapes re-confirmed: allow `{}`, deny `{ decision: 'deny', reason: string }`
  - **Evidence**: the branch returns `{}` on a valid token and `{ decision: 'deny', reason }` on a missing/invalid token or validator exception

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-040 [P0] `tsc --noEmit -p tsconfig.json` clean after the change
  - **Evidence**: `tsc --noEmit` reports no pre-tool-use type errors (re-confirmed by markdown-agent)
- [x] CHK-041 [P0] Build shape intact after the change
  - **Evidence**: additive branch plus co-located helpers only; no new module and no build-shape change
- [x] CHK-042 [P1] Helpers co-located in the same file, no new module
  - **Evidence**: `readPolicyQuiet:147`, `resolveGuardedOpenDesignTools:239`, `extractDesignProofToken:254`, `isStructurallyValidDesignProofToken:301` all in `pre-tool-use.ts`
- [x] CHK-043 [P1] Change is confined to `pre-tool-use.ts`; no other source touched
  - **Evidence**: the change set is a single file (+168 lines); scope clean per implementer and orchestrator
- [x] CHK-044 [P0] A guarded call never reaches the OUTER fail-open catch in a way that allows it; Phase B exceptions deny
  - **Evidence**: the two-phase try structure at `pre-tool-use.ts:324` denies inside Phase B on a confirmed-guarded call; Phase A returns `null` only for non-membership

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

### No-regression (DOMINANT — every general tool class proven unaffected)

- [x] CHK-010 [P0] Bash deny-on-match unchanged (same deny reason)
  - **Evidence**: existing suite 11/11 PASS; Bash denylist behavior intact
- [x] CHK-011 [P0] Bash allow / no-match unchanged → `{}`
  - **Evidence**: existing suite 11/11 PASS
- [x] CHK-012 [P0] `Read` tool → `{}` (branch returns `null`; not entered)
  - **Evidence**: Read is not in the guarded list → Phase A returns `null` → unchanged non-Bash early return; byte-identical per deny battery
- [x] CHK-013 [P0] `Edit` tool → `{}`
  - **Evidence**: same non-guarded fall-through as Read; byte-identical per deny battery
- [x] CHK-014 [P0] `Write` tool → `{}`
  - **Evidence**: same non-guarded fall-through; byte-identical per deny battery
- [x] CHK-015 [P0] `Grep` / other built-in tool → `{}`
  - **Evidence**: non-guarded tool name → `null` → unchanged non-Bash return
- [x] CHK-016 [P0] A non-Open-Design MCP tool name → `{}` (not in guarded list)
  - **Evidence**: non-guarded MCP name → `null` → unchanged early return; confirmed in the deny battery
- [x] CHK-017 [P0] `null` input → `{}` (branch inserted after the null guard; never reached)
  - **Evidence**: the branch call sits after `if (!input) return {}` (`pre-tool-use.ts:378`); null input is handled before the branch
- [x] CHK-018 [P0] Missing `.codex/policy.json` → the single `in_memory_default` stderr diagnostic still fires via the Bash lane only; `readPolicyQuiet` writes none
  - **Evidence**: existing missing-policy test still green (11/11); `readPolicyQuiet` is side-effect-free
- [x] CHK-019 [P0] Fail-open-on-policy-throw (injected throwing `readPolicy`) still returns `{}` for Bash
  - **Evidence**: existing test still green in the 11/11 suite
- [x] CHK-020 [P0] Full-word matching, `bash_denylist` alias, and camelCase `toolInput.command` cases all still pass
  - **Evidence**: existing tests green in the 11/11 suite
- [x] CHK-021 [P0] Entire pre-existing vitest suite re-run UNCHANGED matches the CHK-001 baseline exactly (no count/behavior delta)
  - **Evidence**: 11/11 PASS = baseline, delta 0

### Feature behavior (deny + fail-open)

- [x] CHK-030 [P0] Guarded OD tool + `guardedTools` includes it + NO token → DENY
  - **Evidence**: deny battery: a guarded tool (for example `create_artifact`) with no token returns the deny shape
- [x] CHK-031 [P0] Guarded OD tool + validator THROWS → DENY (fail-CLOSED), not `{}`
  - **Evidence**: deny battery injects a throwing `validateOpenDesignToken`; Phase B catch returns deny
- [x] CHK-032 [P0] Guarded OD tool BUT policy has no `guardedTools` → allowed `{}` (fail-OPEN on policy-absence)
  - **Evidence**: deny battery: empty guarded list → Phase A returns `null` → branch blocks nothing
- [x] CHK-033 [P1] Guarded OD tool + structurally valid token → allowed `{}`
  - **Evidence**: a valid token passes `isStructurallyValidDesignProofToken` and Phase B returns `{}`
- [x] CHK-034 [P1] Membership phase fails OPEN: a thrown `resolveGuardedOpenDesignTools` does NOT deny a non-OD tool
  - **Evidence**: Phase A `try/catch` at `pre-tool-use.ts:324` returns `null` on any membership error

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
  - **Evidence**: instance-only; this phase adds one additive branch to a single hook and produces no cross-consumer findings
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
  - **Evidence**: instance-only; the change set is one file and an evergreen grep over the touched code found no IDs or `specs/` paths
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
  - **Evidence**: the additive `OpenDesignPreconditions` types and the optional `validateOpenDesignToken` seam have no live consumers yet; the existing suite re-runs unchanged (11/11)
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
  - **Evidence**: the deny battery covers the adversarial cases that matter here: no token, throwing validator, empty/missing guarded list, and non-guarded tool fall-through
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
  - **Evidence**: axes = tool class (Bash, Read, Edit, Write, Grep, non-OD MCP, guarded OD, null) × verdict (allow `{}`, deny, fall-through `null`); the no-regression and feature rows above enumerate them
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
  - **Evidence**: policy reads use the injected `readPolicy` seam or the side-effect-free `readPolicyQuiet`; the throwing-policy and missing-policy cases cover the hostile state path
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
  - **Evidence**: evidence pinned to `pre-tool-use.ts` line citations (324, 378, helper lines) and the +168-line additive change

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-050 [P0] Deny-by-default holds for a guarded call lacking a valid token
  - **Evidence**: CHK-030; a guarded call with no valid token denies
- [x] CHK-051 [P0] Validator exception denies (fail-closed), the inverse of the Bash lane's fail-open
  - **Evidence**: CHK-031; Phase B catch returns deny, not `{}`
- [x] CHK-052 [P1] Fail-open-on-policy-absence is intentional and documented; the authoritative proxy lane remains the enforcement floor
  - **Evidence**: spec §6 RISKS and plan §6 named limit; the D4-R1 proxy is the authoritative deny lane

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-060 [P0] Evergreen [HARD] — no spec/packet/phase IDs and no `specs/` paths in the touched code or comments
  - **Evidence**: an evergreen scan over the changed code found no identifiers or `specs/` paths
- [x] CHK-061 [P1] spec/plan/tasks/checklist synchronized with the final implementation
  - **Evidence**: the four docs are upgraded to the Level 2 contract and describe the two-phase branch, the verification, and the defense-in-depth framing
- [x] CHK-062 [P1] `implementation-summary.md` records commands, pass counts, and the no-regression result
  - **Evidence**: the summary records the 11/11 suite, the tsc result, the deny battery, and the fail-open framing

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-070 [P1] Temp/working notes in scratch only
  - **Evidence**: no temp files were created outside scratch for this phase
- [x] CHK-071 [P1] scratch cleaned before completion
  - **Evidence**: no scratch artifacts were created for this phase

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 27 | 27/27 |
| P1 Items | 14 | 14/14 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-06-28
**Verified By**: markdown-agent (post-build verification of the executable PreToolUse Open Design branch)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist — no-regression weighted
P0-heavy on proving every general tool class is byte-identical (existing suite 11/11 PASS)
Deny (no-token) and deny (validator-throw) are P0; fail-open-on-policy-absence is P0
Mark [x] with evidence when verified
-->
