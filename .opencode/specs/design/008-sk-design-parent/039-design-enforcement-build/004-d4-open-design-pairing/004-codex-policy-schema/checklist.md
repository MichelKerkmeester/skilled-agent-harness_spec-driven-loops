---
title: "Verification Checklist: Codex policy guardedTools — activate the Open Design PreToolUse branch"
description: "Activation, deny-case, no-block-transport, 11/11 no-regression, JSON-validity, fix-completeness, and evergreen checks for the .codex/policy.json guardedTools population."
trigger_phrases:
  - "codex policy guardedtools checklist"
  - "activate open design pretooluse branch"
  - "guarded tools policy design build"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/004-codex-policy-schema"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Verify every checklist item against the activated guardedTools policy"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".codex/policy.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Codex policy guardedTools — activate the Open Design PreToolUse branch

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

- [x] CHK-001 [P0] No schema gap: `OpenDesignPreconditions.guardedTools`, `CodexPolicyFile.openDesignPreconditions`, and `CodexPolicyFile.toolPreconditions.openDesignPreconditions` already exist in `pre-tool-use.ts`
  - **Evidence**: types present at `pre-tool-use.ts:44` (`OpenDesignPreconditions`) and `:48` (`CodexPolicyFile`); no source edit required
- [x] CHK-002 [P0] Resolver shape confirmed: `resolveGuardedOpenDesignTools` reads top-level and nested `openDesignPreconditions.guardedTools`; `evaluateOpenDesignPrecondition` runs before the Bash return
  - **Evidence**: both functions present in source; deny reason emitted at `pre-tool-use.ts:352`, validator-error deny at `:359`
- [x] CHK-003 [P0] guardedTools list derived from `tool_surface.md` Mutating (5) + Destructive (2) = `guarded_proxy.md` `guarded.mcpTools` (7)
  - **Evidence**: 7 base tools `create_artifact`, `write_file`, `create_project`, `start_run`, `cancel_run` (mutating) + `delete_file`, `delete_project` (destructive)

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `.codex/policy.json` is valid JSON
  - **Evidence**: `node -e JSON.parse(...)` exit 0 (`JSON_VALID`)
- [x] CHK-011 [P0] `openDesignPreconditions.guardedTools` holds the 21 entries (7 base + 7 `mcp__open-design__*` + 7 `open_design.open_design_*`) in the resolver-expected shape
  - **Evidence**: 21-entry string array under top-level `openDesignPreconditions` at `policy.json:44`
- [x] CHK-012 [P1] Existing `bashDenylist` / `bash_denylist` keys left untouched; new block added as a sibling key
  - **Evidence**: both denylists intact (18 entries each); the `openDesignPreconditions` block is purely additive
- [x] CHK-013 [P1] Top-level `openDesignPreconditions` populated only (not duplicated into `toolPreconditions`)
  - **Evidence**: no `toolPreconditions` key present; only the top-level block exists

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] ACTIVATION / deny-case: a guarded tool without a valid token is DENIED via the real policy file (was fail-open/inert before)
  - **Evidence**: `handleCodexPreToolUse({tool:'start_run',tool_input:{}},{policyPath})` → `{decision:'deny', reason:'Guarded Open Design call denied: missing or invalid design proof token'}`; `create_artifact` same
- [x] CHK-021 [P0] Namespace variants denied: `mcp__open-design__start_run` and `open_design.open_design_delete_project` (no token) → deny
  - **Evidence**: both returned the guarded-deny reason against the real policy file
- [x] CHK-022 [P0] NO-BLOCK-TRANSPORT: a read-only/transport tool (`get_run`) returns `{}` (not denied)
  - **Evidence**: `get_run` and `list_projects` both returned an empty allow
- [x] CHK-023 [P0] Non-guarded tools unaffected: `{tool:'Read'}` → `{}`; ordinary `{tool:'Bash', command:'git status --short'}` → `{}`
  - **Evidence**: `Read` and `Bash git status --short` both returned an empty allow
- [x] CHK-024 [P1] Bash deny lane intact: `{tool:'Bash', command:'rm -rf /'}` still denied (no regression)
  - **Evidence**: `Bash rm -rf /` → deny with the existing Bash-denylist reason
- [x] CHK-025 [P0] No-regression: existing Codex hook vitest suite passes 11/11 (test file unmodified)
  - **Evidence**: `vitest run tests/codex-pre-tool-use.vitest.ts` → 11 passed (11)

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
  - **Evidence**: instance-only; this phase populates one policy list and produces no code findings
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
  - **Evidence**: instance-only; the change set is the single additive block in `.codex/policy.json`, no other policy consumer changed
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
  - **Evidence**: the lone consumer is `resolveGuardedOpenDesignTools` in the landed D4-R2 branch; it reads the new block and was exercised by the harness, unchanged
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
  - **Evidence**: the gate is exact name-membership matching; adversarial coverage is the namespace-variant deny set plus the read/transport allow set, both exercised against the real policy
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
  - **Evidence**: axes are {tool class: guarded-write, read/transport, non-guarded, denylisted-Bash} × {transport form: bare, native-MCP, Code Mode}; 9 harness rows executed
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
  - **Evidence**: not applicable; the harness injects `policyPath` explicitly and reads no process-wide state
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
  - **Evidence**: evidence pinned to the `policy.json:44` block and the 21-entry count read from the file in this session

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No read-only / `feedsDesignDecision` tool added to `guardedTools` (would block legitimate transport): `get_run`, `list_projects`, `get_active_context`, `get_artifact`, `get_project`, `get_file`, `search_files`, `list_files`, `list_skills`, `list_plugins`, `list_agents` all absent
  - **Evidence**: all 11 read/transport names verified absent from the 21-entry list; `get_run` + `list_projects` empty-allow at runtime
- [x] CHK-031 [P1] All 7 mutating/destructive write tools present (none dropped): create/write/delete project & file, start/cancel run
  - **Evidence**: `create_artifact`, `write_file`, `create_project`, `start_run`, `cancel_run`, `delete_file`, `delete_project` each present in all 3 wired forms

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] Evergreen [HARD]: no spec/packet/phase IDs or spec paths added to `.codex/policy.json` (and none in any code comment, since no source file is edited)
  - **Evidence**: the added block carries a durable `description` only; no IDs or `specs/` paths; no source file edited
- [x] CHK-041 [P1] spec/plan/tasks synchronized with the final 21-entry list and scope (`.codex/policy.json` only)
  - **Evidence**: spec, plan, and tasks all reference the 21-entry list and the `.codex/policy.json`-only scope

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Runtime harness lives in scratchpad only; not committed to the repo
  - **Evidence**: the node type-stripping harness was written under the session scratchpad, outside the repo
- [x] CHK-051 [P1] Scope held: only `.codex/policy.json` modified (`pre-tool-use.ts` only if a confirmed schema gap, not expected)
  - **Evidence**: no schema gap; `.codex/policy.json` was the only deliverable target, and this phase's doc work touched only the phase folder

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 16/16 |
| P1 Items | 10 | 10/10 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-06-28
**Verified By**: markdown-agent (independent re-verification of the activated guardedTools policy)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
Activation = deny guarded-without-token; do-not-block-transport is the critical guard
-->
