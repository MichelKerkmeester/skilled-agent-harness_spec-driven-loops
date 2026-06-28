---
title: "Implementation Summary: Codex policy guardedTools activates the Open Design PreToolUse branch"
description: "Post-build record for populating .codex/policy.json openDesignPreconditions.guardedTools with the 21 wired forms of the 7 Open Design write tools: the activation, the 7/7 deny proof, vitest 11/11, the codex self-protection deviation, and the do-not-block-transport guarantee."
trigger_phrases:
  - "codex policy guardedtools implementation summary"
  - "activate open design pretooluse branch summary"
  - "guarded tools policy design build record"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/004-codex-policy-schema"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Record activated guardedTools policy, deny proof, and codex self-protection deviation"
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
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-codex-policy-schema |
| **Completed** | 2026-06-28 |
| **Level** | 2 |
| **Deliverable** | `.codex/policy.json` `openDesignPreconditions.guardedTools` (21 entries) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

This phase took the Open Design PreToolUse precondition branch from inert to live. The executable branch and its policy types already existed in the Codex hook, but it was fail-open because the policy file carried no guarded-tool list, so every tool fell through. Populating `.codex/policy.json` with `openDesignPreconditions.guardedTools` flips the switch: a guarded Open Design write call that arrives without a valid design proof token is now denied at the Codex boundary, while every read, transport, and ordinary tool stays untouched.

This is the firing layer going live. It is defense-in-depth, not the authoritative lane. The guarded proxy from the all-surface gate phase remains the primary enforcement point; this coarse Codex tool-name list is a second, independent net that catches a guarded write the moment it reaches the Codex hook.

### The guarded-tool list

The `guardedTools` array holds the 7 Open Design write tools, each in 3 wired forms, for 21 entries total. The 7 base tools are `create_artifact`, `write_file`, `create_project`, `start_run`, `cancel_run` (mutating) and `delete_file`, `delete_project` (destructive). Each is listed three ways because the same tool reaches the hook under different transports: the bare name, the native-MCP form `mcp__open-design__<tool>`, and the Code Mode UTCP form `open_design.open_design_<tool>`. The hook matches the incoming tool name by exact membership, so every wired form must be present for the gate to be complete.

No read or transport tool is in the list. The gate keys purely on name membership and does not evaluate `feedsDesignDecision`, so including any read tool would deny legitimate transport. The read-side `feedsDesignDecision` gating belongs to the guarded proxy, not to this coarse lane.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.codex/policy.json` | Modified | Added the `openDesignPreconditions.guardedTools` block (21 entries) as a sibling of the existing `bashDenylist` / `bash_denylist`, activating the PreToolUse precondition branch |

The hook source (`pre-tool-use.ts`) was not edited. The D4-R2 phase already added the `OpenDesignPreconditions` type, the `CodexPolicyFile.openDesignPreconditions` / `toolPreconditions.openDesignPreconditions` fields, `resolveGuardedOpenDesignTools`, and the `evaluateOpenDesignPrecondition` call before the Bash-only return. This phase only supplied the data the resolver reads, so there was no schema gap to close.

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The list applied to `.codex/policy.json` is the exact 21-entry set the plan derived from the Open Design write-tool surface. Activation was proven against the real policy file, not a fixture: a node type-stripping harness loaded the actual `.codex/policy.json` through the shipped `handleCodexPreToolUse(input, { policyPath })` entry point with default dependencies. Guarded `start_run` and `create_artifact` with no token returned a deny, and both namespace transports (`mcp__open-design__start_run` and `open_design.open_design_delete_project`) returned the same deny. The do-not-block-transport guarantee held in the same run: `get_run`, `list_projects`, a plain `Read`, and a safe `Bash` (`git status --short`) all returned an empty allow, and `Bash rm -rf /` still denied, proving the existing denylist is intact. The Codex hook vitest suite passed 11/11 with the test file unmodified, and `.codex/policy.json` parses as valid JSON. The added block is evergreen: it carries a durable `description` and no spec, packet, or phase identifiers.

The implementer of record for the policy edit is the orchestrator, not a Codex session. A Codex session is structurally barred from rewriting the policy that governs Codex itself, so `cli-codex` could not apply the change. The orchestrator read the file, applied the plan-derived list, and verified the result independently. This phase's documentation records and re-verifies that work; it writes only the phase-folder docs and touches no live skill or `.codex` file.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Make activation a data-only change to `.codex/policy.json` | The D4-R2 branch and types already exist, so there is no schema gap; populating the policy is the whole job |
| List each write tool in all 3 wired forms (21 entries) | The hook matches by exact name membership, so the bare, native-MCP, and Code Mode forms must each be present or a transport slips the gate |
| Keep every read and transport tool out of the list | The gate keys on name membership only, so any read entry would deny legitimate transport; read gating lives at the guarded proxy |
| Populate only the top-level `openDesignPreconditions` | The nested `toolPreconditions.openDesignPreconditions` is an accepted alias read by the same resolver; duplicating would only concatenate redundant entries |
| Let the orchestrator apply the policy edit | A Codex session cannot rewrite the policy that governs Codex; the orchestrator applied the plan-derived list and verified it independently |
| Frame this as defense-in-depth | The guarded proxy is the authoritative lane; this coarse Codex tool-name list is a second independent net |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `.codex/policy.json` parses as JSON | PASS, `node -e JSON.parse` exit 0 |
| `guardedTools` holds 21 entries (7 base + 7 `mcp__open-design__*` + 7 `open_design.open_design_*`) | PASS, read against the real policy file |
| ACTIVATION deny: `start_run` no token | PASS, `decision: deny`, `Guarded Open Design call denied: missing or invalid design proof token` |
| ACTIVATION deny: `create_artifact` no token | PASS, same deny reason |
| Namespace deny: `mcp__open-design__start_run` no token | PASS, deny |
| Namespace deny: `open_design.open_design_delete_project` no token | PASS, deny |
| NO-BLOCK-TRANSPORT: `get_run` | PASS, empty allow |
| NO-BLOCK-TRANSPORT: `list_projects` | PASS, empty allow |
| Non-guarded `Read` unaffected | PASS, empty allow |
| Ordinary `Bash git status --short` unaffected | PASS, empty allow |
| Existing Bash denylist intact: `Bash rm -rf /` | PASS, still denied |
| No-regression: Codex hook vitest suite | PASS, 11/11, test file unmodified |
| No read/transport tool in `guardedTools` | PASS, `get_run`, `list_projects`, `get_active_context`, `get_artifact`, `get_project`, `get_file`, `search_files`, `list_files`, `list_skills`, `list_plugins`, `list_agents` all absent |
| Evergreen: no spec/packet/phase IDs in the added block | PASS, durable `description` only |
| Scope: no live skill or `.codex` file touched by this phase's doc work | PASS, only phase-folder docs written |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Defense-in-depth, not the authoritative lane.** This Codex tool-name list is a coarse second net. The guarded proxy from the all-surface gate phase remains the primary enforcement point; do not treat this lane as the sole gate.
2. **Name-membership matching only.** The gate denies a guarded write that lacks a valid token but does not itself evaluate `feedsDesignDecision`. Read-side design-feeding gating is enforced at the guarded proxy, not here.
3. **CLI write verbs out of scope.** `od ui respond/prefill/revoke`, `od media generate`, and run start/redesign are gated by the Bash/`od`-CLI precondition lane in a later phase, not by this MCP tool-name list.
4. **Policy edit applied by the orchestrator.** A Codex session cannot rewrite the policy that governs Codex, so `cli-codex` could not implement the change. The orchestrator applied the plan-derived list. See OPEN QUESTIONS in `spec.md`.

<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
- Core + Level 2 verification focus
- Data-only activation of the Open Design PreToolUse branch via .codex/policy.json guardedTools
-->
