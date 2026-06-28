---
title: "D4-R2 — Replace never-run design_gate() pseudocode with an executable PreToolUse branch"
description: "Insert a two-phase evaluateOpenDesignPrecondition(input, dependencies) lane before the Bash-only return {} in the Codex PreToolUse hook: fail-OPEN membership, fail-CLOSED validation, defense-in-depth behind the D4-R1 guarded proxy."
trigger_phrases:
  - "d4-r2 pretooluse branch"
  - "executable design gate design build"
  - "open design precondition hook"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/002-executable-pretooluse-branch"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Upgrade the D4-R2 spec to a Level 2 contract and mark it complete"
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
# D4-R2 — Replace never-run design_gate() pseudocode with an executable PreToolUse branch

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Enforcement class** | enforceable |
| **Dimension** | D4 — mcp-open-design Pairing |
| **Completed** | 2026-06-28 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Codex PreToolUse hook (`handleCodexPreToolUse`) is Bash-only: any non-Bash tool returns the empty allow object `{}` at the early `if (toolNameFor(input) !== 'Bash')` guard, so Open Design MCP calls pass unchecked. The existing `design_gate()` is pseudocode that never runs, so there is no agent-local precondition behind the guarded proxy on the Codex surface.

### Purpose
Add a real, executable Open Design lane to the hook by inserting `evaluateOpenDesignPrecondition(input, dependencies)` immediately before the Bash-only early return. The lane is deny-by-default for a guarded Open Design call that lacks a valid `DESIGN_PROOF_TOKEN`, and it denies (fail-CLOSED) when the token validator throws. Because the authoritative enforcement lane is the D4-R1 guarded proxy, this hook is defense-in-depth: when the policy carries no guarded list, the lane blocks nothing (fail-OPEN on policy-absence), the explicitly accepted tradeoff that guarantees zero regression to general tool execution.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A single additive `evaluateOpenDesignPrecondition` branch inserted between the `if (!input)` guard and the Bash-only `if (toolNameFor(input) !== 'Bash')` return
- A two-phase internal structure: Phase A membership (fail-OPEN to `null`), Phase B validation (fail-CLOSED to deny)
- Co-located helpers in the same file: `readPolicyQuiet`, `resolveGuardedOpenDesignTools`, `extractDesignProofToken`, `isStructurallyValidDesignProofToken`
- Minimal additive types: an `OpenDesignPreconditions` shape, optional `openDesignPreconditions` policy fields, and an optional `validateOpenDesignToken` injection seam
- A no-regression battery proving every general tool class is byte-identical

### Out of Scope
- Populating the guarded-tool list itself (owned by the sibling policy-population phase)
- Full digest recomputation, loaded-file hashing, replay, or bound-surface payload binding (owned by the authoritative proxy)
- Any new module, and any change to `.codex/policy.json`

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts` | Modify | Insert the two-phase guarded Open Design branch, the `OpenDesignPreconditions` types, and the co-located policy/token helpers (+168 lines) |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Insert an executable Open Design branch before the Bash-only return | `evaluateOpenDesignPrecondition` runs ahead of the non-Bash early return and short-circuits only on a non-`null` verdict |
| REQ-002 | Deny a guarded call with no valid token | A guarded Open Design tool with no valid `DESIGN_PROOF_TOKEN` returns `{ decision: 'deny', reason }` |
| REQ-003 | Fail CLOSED on a guarded-call validator exception | A throwing validator on a confirmed-guarded call denies, not `{}` |
| REQ-004 | Prove no regression to every general tool class | The existing hook suite re-runs unchanged and Bash/Read/Edit/Write/Grep/non-OD-MCP/null-input stay byte-identical |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Keep the touched code evergreen | No spec, packet, or phase identifiers and no `specs/` paths in the code or comments |
| REQ-006 | Type-check and build clean | `tsc --noEmit` reports no pre-tool-use type errors |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A guarded Open Design call without a valid token is DENIED by the PreToolUse branch, and a thrown validator error yields deny (not pass).
- **SC-002**: Every non-Open-Design tool class (Bash, Read, Edit, Write, Grep, non-OD MCP, null input) behaves byte-identical to the pre-change hook, proven by the 11/11 existing suite.
- **SC-003**: With no guarded-tool list in the policy, the branch blocks nothing (fail-OPEN on policy-absence), and the authoritative proxy remains the enforcement floor.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Highest-blast file: this hook gates EVERY Codex tool call | A regression here could break Bash, Read, Edit, Write, Grep, and every MCP tool | No-regression battery dominates; the existing 11/11 suite re-runs unchanged and every general tool path is proven byte-identical |
| Tradeoff | Fail-OPEN on policy-absence | With no guarded list the branch blocks nothing, so it adds no enforcement on its own | Accepted deliberately so the lane can never break general tool execution; the D4-R1 proxy is the authoritative deny lane |
| Dependency | Sibling policy-population phase supplies the guarded-tool list | Until that list lands, this branch is inert by design and guards no Open Design call | No hard dependency: an absent list yields `[]` and falls through to `null`; the branch activates automatically once the list is populated |
| Dependency | D4-R1 guarded proxy contract | This hook is defense-in-depth behind it; it does not replace the proxy | Named as the enforcement floor; the hook never weakens or claims to replace it |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Security
- **NFR-S01**: A confirmed-guarded call fails CLOSED — missing or invalid token, or a validator exception, denies.
- **NFR-S02**: Membership determination fails OPEN — any error while deciding whether a tool is guarded returns `null` and never denies an innocent non-Open-Design tool.

### Determinism
- **NFR-D01**: For a given tool name and policy, the verdict is deterministic; a tool not in a non-empty guarded list always falls through to `null`.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Membership Boundaries
- **Empty or missing guarded list**: returns `null` (fail-OPEN on policy-absence); the call proceeds unchecked.
- **Non-guarded tool name**: returns `null`; the existing non-Bash early return runs verbatim.

### Error Scenarios
- **Throw while deciding membership (Phase A)**: caught, returns `null`; the innocent tool is never denied.
- **Throw while validating a confirmed-guarded call (Phase B)**: denies with a fail-closed reason, never `{}`.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

- **Blast radius**: EXTREME — the hook gates every Codex tool call, so the work is weighted toward proving non-regression rather than feature size.
- **Change footprint**: One file, one additive branch plus co-located helpers and minimal additive types; fully revertible with `git checkout` and no schema or data migration.

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does fail-OPEN on policy-absence weaken enforcement? **RESOLVED: No net weakening. The branch is defense-in-depth; the D4-R1 guarded proxy is the authoritative deny lane. Fail-OPEN is the accepted tradeoff that guarantees zero regression to general tool execution on the highest-blast file in the build.**
- Where does the guarded-tool list come from? **RESOLVED: A sibling policy-population phase supplies `openDesignPreconditions.guardedTools`. Until it lands this branch is inert by design; once the list is populated the branch guards those tools automatically with no further code change.**
- Should the hook do full digest and replay validation? **RESOLVED: No. The hook checks token presence, structure, and freshness only; full digest recomputation, file hashing, replay, and bound-surface binding stay with the proxy, which sees the reconstructed outgoing payload.**

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`

---

<!--
LEVEL 2 SPEC
- Core + Level 2 verification focus
- Deliverable: executable evaluateOpenDesignPrecondition branch in pre-tool-use.ts (highest-blast file)
- Defense-in-depth behind the D4-R1 proxy; fail-OPEN on policy-absence; inert until the sibling policy phase lands
-->
