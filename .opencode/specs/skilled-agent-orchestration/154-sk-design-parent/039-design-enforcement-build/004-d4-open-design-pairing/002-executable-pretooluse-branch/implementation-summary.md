---
title: "Implementation Summary: Executable Open Design PreToolUse branch"
description: "Post-build record for the executable evaluateOpenDesignPrecondition branch inserted into the Codex PreToolUse hook: a two-phase guarded Open Design lane (fail-OPEN membership, fail-CLOSED validation) that is defense-in-depth behind the D4-R1 guarded proxy and inert until a sibling phase populates the guarded-tool list."
trigger_phrases:
  - "executable pretooluse branch summary"
  - "open design precondition build record"
  - "codex hook guarded branch summary"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/002-executable-pretooluse-branch"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Author the executable PreToolUse Open Design branch build record"
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
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-executable-pretooluse-branch |
| **Completed** | 2026-06-28 |
| **Level** | 2 |
| **Deliverable** | Executable guarded Open Design branch in `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts` (+168 lines) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The Codex PreToolUse hook now runs a real Open Design precondition instead of never-run `design_gate()` pseudocode. Before this change the hook returned the empty allow object `{}` at its Bash-only early guard, so every Open Design MCP call passed unchecked. The build inserts a tightly-scoped `evaluateOpenDesignPrecondition(input, dependencies)` lane ahead of that Bash-only return, giving the runtime a second, agent-local enforcement point behind the authoritative guarded proxy. This is the highest-blast change in the build, because the file it touches gates every Codex tool call (Bash, Read, Edit, Write, Grep, and every MCP tool), so the work was scoped and verified to be byte-identical for everything except a confirmed-guarded Open Design call.

### Two-phase guarded branch

`evaluateOpenDesignPrecondition` returns `CodexPreToolUseOutput | null` and splits into two deliberately separate `try` blocks. Phase A decides MEMBERSHIP and fails OPEN: it resolves the tool name and the policy-supplied guarded list, and any error, a non-guarded tool, an empty list, or a missing list returns `null` so the call proceeds untouched. Phase B runs only after a guarded Open Design tool is CONFIRMED and fails CLOSED: a guarded call with no valid `DESIGN_PROOF_TOKEN`, or a validator that throws, returns `{ decision: 'deny', reason }`. Splitting membership from validation is what guarantees an exception while merely deciding membership can never deny an innocent non-Open-Design tool, while an exception while validating a confirmed-guarded call always denies. The branch call sits between the existing `if (!input)` guard and the Bash-only `if (toolNameFor(input) !== 'Bash')` return, and only short-circuits when the verdict is non-`null`.

### Supporting helpers and types

The branch is backed by co-located helpers in the same file, no new module: `readPolicyQuiet` (a side-effect-free policy read that writes no `in_memory_default` diagnostic so non-Open-Design behavior stays byte-identical), `resolveGuardedOpenDesignTools` (returns `[]` for any missing or malformed policy shape), `extractDesignProofToken`, and `isStructurallyValidDesignProofToken` (structure plus freshness presence checks only). The change adds an `OpenDesignPreconditions` type plus optional `openDesignPreconditions` fields on the policy type and an optional `validateOpenDesignToken` injection seam on the dependencies type, mirroring the existing `readPolicy` injection pattern used by the test suite.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts` | Modified | Inserted the two-phase `evaluateOpenDesignPrecondition` branch before the Bash-only return, plus `OpenDesignPreconditions` types and the guarded-tool / quiet-policy / token helpers (+168 lines) |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Verification dominated the work because the one real risk was breaking general tool execution. The existing hook suite `tests/codex-pre-tool-use.vitest.ts` was re-run as the authoritative no-regression gate and returned 11/11 PASS, confirming every Bash denylist, allow, and other-tool path is intact. `tsc --noEmit` reported no pre-tool-use type errors. A deny battery exercised the new lane directly: a guarded Open Design tool (for example `create_artifact`) with no token denies; a throwing validator denies (fail-closed); and a policy with no `guardedTools` blocks nothing (fail-OPEN on policy-absence). Bash, Read, Edit, Write, Grep, a non-Open-Design MCP tool, and `null` input were all confirmed byte-identical to the pre-change behavior. The change set is one file, and no evergreen spec, packet, or phase identifiers leaked into the code.

This branch is DEFENSE-IN-DEPTH behind the D4-R1 guarded-proxy contract, not a standalone guarantee. It fails OPEN on policy-absence on purpose, so it can never break general tool execution, and the authoritative deny lane remains the proxy. The guarded-tool list it reads is supplied by a sibling policy-population phase, so until that list lands the branch is inert by design and blocks nothing. Completion here means the executable lane is correct and proven safe, not that Open Design enforcement is fully active.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Insert the branch BEFORE the Bash-only early return | Open Design tools are not `Bash`, so placing the lane after that guard means it can never run |
| Split membership (Phase A) from validation (Phase B) | A thrown error while deciding membership must fall through to `null`, never deny an innocent non-Open-Design tool; only a confirmed-guarded call can deny |
| Fail CLOSED on a guarded-call validator exception | A guarded Open Design call with a broken validator should deny, the deliberate inverse of the Bash lane's outer fail-open catch |
| Fail OPEN on policy-absence (empty guarded list blocks nothing) | The authoritative proxy is the enforcement floor, so the hook must never risk breaking general tool execution to add defense-in-depth |
| Use a quiet policy read and co-located helpers, no new module | Keeps non-Open-Design behavior byte-identical (no extra stderr diagnostic) and keeps the change a single revertible additive edit |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Existing hook suite re-run (authoritative no-regression) | PASS, `tests/codex-pre-tool-use.vitest.ts` 11/11 passing |
| Type check | PASS, `tsc --noEmit` reports no pre-tool-use type errors |
| Deny battery: guarded Open Design tool, no token | PASS, returns `{ decision: 'deny', reason }` |
| Deny battery: guarded call, throwing validator | PASS, denies (fail-CLOSED), not `{}` |
| Fail-OPEN on policy-absence: no `guardedTools` | PASS, branch returns `null`, blocks nothing |
| No-regression: Bash deny/allow, Read, Edit, Write, Grep, non-OD MCP, null input | PASS, byte-identical to pre-change behavior |
| Branch lands before the Bash-only early return | PASS, `evaluateOpenDesignPrecondition` call sits between the `if (!input)` guard and the non-Bash return |
| Evergreen scan (no spec/packet/phase IDs in code) | PASS, no identifiers or `specs/` paths in the touched code |
| Scope clean (one file) | PASS, change confined to `pre-tool-use.ts` |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Defense-in-depth, not a standalone guarantee.** This hook is the second enforcement lane behind the D4-R1 guarded proxy. The proxy remains the authoritative deny boundary; this branch hardens the Codex surface but does not replace it.
2. **Fails OPEN on policy-absence by design.** When the policy carries no guarded-tool list, the branch blocks nothing. This is the deliberate tradeoff that guarantees zero regression to general tool execution. The guarantee depends on the proxy lane existing.
3. **Inert until the sibling policy-population phase lands.** The guarded-tool list is supplied by a separate phase. Until that list is populated, no Open Design call is guarded by this branch, so completion of this phase does not by itself activate Codex-side Open Design enforcement.
4. **Presence, structure, and freshness only.** The hook validates token PRESENCE, STRUCTURE, and FRESHNESS. Full digest recomputation, loaded-file hashing, replay, and bound-surface payload binding stay with the authoritative proxy, because the PreToolUse hook sees only the tool input, not the reconstructed outgoing payload.

<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
- Core + Level 2 verification focus
- Highest-blast file: gates every Codex tool call; proven byte-identical for all non-guarded paths
- Defense-in-depth behind the D4-R1 proxy; fail-OPEN on policy-absence; inert until the sibling policy phase lands
-->
