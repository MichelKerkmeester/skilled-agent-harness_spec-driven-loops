---
title: "D4-R4 — Codex policy guardedTools: activate the Open Design PreToolUse branch"
description: "Populate .codex/policy.json openDesignPreconditions.guardedTools with the 7 Open Design write tools in 3 wired forms (21 entries), activating the already-landed PreToolUse precondition branch without editing hook source."
trigger_phrases:
  - "d4-r4 codex policy guardedtools"
  - "activate open design pretooluse branch"
  - "guarded tools policy design build"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/004-codex-policy-schema"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Upgrade spec to Level 2 and record the codex self-protection deviation"
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
# D4-R4 — Codex policy guardedTools: activate the Open Design PreToolUse branch

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Enforcement class** | enforceable |
| **Dimension** | D4 — mcp-open-design Pairing |
| **Completed** | 2026-06-28 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Codex PreToolUse hook already carries the executable Open Design precondition branch and its policy types, but the branch is inert. `.codex/policy.json` carries no guarded-tool list, so `resolveGuardedOpenDesignTools` returns an empty array and every Open Design write tool falls through fail-open. A guarded write lacking a valid design proof token is not stopped at the Codex boundary.

### Purpose
Populate `.codex/policy.json` with `openDesignPreconditions.guardedTools` so the already-landed branch fires. The list names the 7 Open Design write tools in each of the 3 wired forms (bare, native-MCP, Code Mode UTCP), 21 entries total, in the exact shape the resolver expects. Once populated, a guarded write without a valid token is denied, while every read, transport, and ordinary tool stays unaffected. This is a data-only change; no hook source is edited.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The `openDesignPreconditions.guardedTools` block in `.codex/policy.json` (21 entries)
- The 7 write tools (`create_artifact`, `write_file`, `create_project`, `start_run`, `cancel_run`, `delete_file`, `delete_project`) in 3 wired forms
- Activation, deny-case, no-block-transport, and no-regression verification against the real policy file

### Out of Scope
- Editing the Codex hook source (`pre-tool-use.ts`); the D4-R2 branch and types already exist
- Adding any read or transport tool to `guardedTools`
- Read-side `feedsDesignDecision` gating (owned by the guarded proxy)
- CLI write-verb gating (`od ui respond/prefill/revoke`, `od media generate`, run start/redesign), owned by the Bash/`od`-CLI lane in a later phase

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.codex/policy.json` | Modify | Add `openDesignPreconditions.guardedTools` (21 entries) as a sibling of the existing `bashDenylist` / `bash_denylist` |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Populate `guardedTools` in the resolver-expected shape | The block is a string array under top-level `openDesignPreconditions`, holding the 21 entries |
| REQ-002 | Activate the branch | A guarded write (bare + namespace) without a valid token is denied via the real policy file |
| REQ-003 | Do not block transport | A read/transport tool, a non-guarded tool, and an ordinary Bash command return an empty allow |
| REQ-004 | No regression | The existing Codex hook vitest suite passes 11/11 and the Bash denylist still denies |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Preserve existing policy fields | `bashDenylist` / `bash_denylist` are left untouched; the new block is purely additive |
| REQ-006 | Keep the policy evergreen | No spec, packet, or phase identifiers and no `specs/` paths in `.codex/policy.json` |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `.codex/policy.json` carries `openDesignPreconditions.guardedTools` with the 21-entry list and parses as valid JSON.
- **SC-002**: A guarded write in bare and both namespace forms, lacking a token, is denied against the real policy file.
- **SC-003**: `get_run`, `list_projects`, `Read`, and a safe `Bash` all return an empty allow, and `Bash rm -rf /` still denies.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A read/transport tool added to `guardedTools` | Legitimate transport is denied | List only the 7 write tools; verify all read/transport names are absent |
| Risk | A wired transport form omitted | A guarded write slips the gate under that transport | List all 3 forms per tool (bare, native-MCP, Code Mode) |
| Risk | Codex cannot edit the policy that governs Codex | `cli-codex` cannot self-author the change | The orchestrator applies the plan-derived list and verifies it independently |
| Dependency | D4-R2 PreToolUse precondition branch + types | Without it the policy list is inert | Landed; this phase only supplies the data the resolver reads |
| Dependency | `resolveGuardedOpenDesignTools` reading the policy locations | Determines the accepted policy shape | Landed; top-level `openDesignPreconditions` is read directly |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Security
- **NFR-S01**: The gate fails closed for a guarded write that lacks a valid design proof token.
- **NFR-S02**: The gate never denies a pure read or transport call; membership covers write tools only.

### Defense-in-Depth
- **NFR-DD01**: This Codex tool-name lane is a second, independent net. The guarded proxy from the all-surface gate phase remains the authoritative enforcement point.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Transport Variants
- **Same tool, different transport**: `start_run`, `mcp__open-design__start_run`, and `open_design.open_design_start_run` are all guarded because each is an exact-match entry.
- **Unlisted tool**: A tool not in `guardedTools` falls through to the unchanged Bash-only lane.

### Failure Modes
- **Empty list**: If the block is removed, the branch reverts to inert/fail-open immediately, with no code revert needed.
- **Validator exception**: A precondition validator error returns a deny, never a silent allow.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

- **Surface count**: One policy file populates one already-wired branch; no source change.
- **Risk concentration**: The single material risk is including a read tool or omitting a transport form, both closed by the explicit 21-entry list and the absent-read-tool check.

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Who should implement an edit to `.codex/policy.json` when the executor is Codex itself? **RESOLVED: The orchestrator. A Codex session is structurally barred from rewriting the policy that governs Codex (self-protection), so `cli-codex gpt-5.5 high fast` could not apply the change. The orchestrator read the file, applied the exact plan-derived 21-entry list, and verified the result independently. This is a sanctioned deviation from "codex implements," forced by the self-protection constraint.**
- Is this lane the authoritative Open Design gate? **RESOLVED: No. It is defense-in-depth. The D4-R1 guarded proxy is the authoritative lane; this coarse Codex tool-name list is a second independent net that blocks a guarded write the moment it reaches the Codex hook.**

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
- Data-only activation of the Open Design PreToolUse branch via .codex/policy.json guardedTools
- Deviation recorded: orchestrator applied the policy edit (codex self-protection); defense-in-depth framing in RISKS/OPEN QUESTIONS
-->
