---
title: "Verification Checklist: Pi runtime compatibility (prompts, agents, extensions)"
description: "Verification checklist for the pi-runtime-compatibility build phase."
trigger_phrases: ["pi runtime compatibility checklist"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/012-pi-runtime-compatibility"
    last_updated_at: "2026-07-27T16:10:00Z"
    last_updated_by: "claude-code"
    recent_action: "All items verified with live evidence, GLM APPROVE WITH MINOR NOTES"
    next_safe_action: "Commit phase 012"
    blockers: []
    key_files: ["implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Pi runtime compatibility (prompts, agents, extensions)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

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

- [x] CHK-001 [P0] Requirements documented in `spec.md` (REQ-001..REQ-006)
  - **Evidence**: `spec.md` §4, 6/6 REQs present
- [x] CHK-002 [P0] Technical approach defined in `plan.md`
  - **Evidence**: `plan.md` §3 Architecture
- [x] CHK-003 [P1] Existing `sync-prompts.cjs`/`sync-agents.cjs` pattern read before authoring new siblings
  - **Evidence**: both new scripts reuse the exact discovery-walk/`--check`/write-mode pattern, confirmed via direct read
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `sync-prompts-pi.cjs --check` reports clean, all 36 commands present
  - **Evidence**: `[pi-prompt-sync] PASS: 36 prompts are in sync.`
- [x] CHK-011 [P0] `sync-agents-pi.cjs --check` reports clean, all 13 agents present
  - **Evidence**: `[pi-agent-sync] PASS: 13 agents are in sync.` (re-confirmed after the post-review hardening pass)
- [x] CHK-012 [P0] `.pi/extensions/*.ts` delegates to a shared guard-core module, not a reimplementation
  - **Evidence**: all 7 files' guard-core function calls (`evaluateMutation`, `classifyIntent`, `evaluateNativeMcpCall`, `readHardRules`/`evaluate`, `recordDispatch`, `resolveDispatch`/`runChecks`, `evaluateEdit`) confirmed real via `grep` on the cited files, independently re-confirmed by GLM-5.2 against the real function signatures
- [x] CHK-013 [P1] No `.opencode/agents/`, `.opencode/commands/`, or `.claude/agents/` canonical source file modified
  - **Evidence**: `git status --porcelain` shows zero hits under any of those 3 paths
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Live command dispatch captured (exit code + output), not inferred from file existence
  - **Evidence**: `pi --offline --approve -p "list your available tools"` exit 0, full output captured in `implementation-summary.md`
- [x] CHK-021 [P0] Live agent parse-check captured
  - **Evidence**: same live session -- `pi-subagents` tools (`subagent`, `subagent_wait`, `subagent_supervisor`, `intercom`) present, no schema error
- [x] CHK-022 [P0] Live extension load captured, no startup error
  - **Evidence**: `pi --offline --approve -p "list your available tools"` exit code 0, no crash with all 7 extensions present
- [x] CHK-023 [P1] GLM-5.2 independent review completed, findings addressed
  - **Evidence**: verdict APPROVE WITH MINOR NOTES; 3 actionable findings fixed (name-traversal guard, always-explicit `tools:`, alias-assumption comment), 2 informational left as-is
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P2] N/A -- this is new-capability build work, not a bug fix; no finding to classify
  - **Evidence**: N/A by scope
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets/tokens/credentials introduced in any generated file
  - **Evidence**: GLM-5.2 independent review of `sync-prompts-pi.cjs`/`sync-agents-pi.cjs`/all 7 `.pi/extensions/*.ts` files confirmed no secrets/credentials; all embedded paths are repo-relative
- [x] CHK-031 [P0] `.pi/extensions/*.ts` follows the same fail-open discipline as the other 3 CLI adapters (no fail-closed-by-accident path)
  - **Evidence**: GLM-5.2 confirmed all 7 files' try/catch is the first statement in the handler with zero fail-closed paths identified; independently traced `evaluateMutation`'s real `deny` conditions to confirm the `bash` branch can never block
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `scripts/pi/README.md` documents both generators
  - **Evidence**: `git status` confirms the file; direct read confirms it mirrors `codex/README.md`'s shape
- [x] CHK-041 [P1] The pre-existing Codex-mirror drift found this session is named in this phase's docs, not silently fixed or ignored
  - **Evidence**: `spec.md` REQ-005 and `implementation-summary.md` both name the exact drift (3 missing/1 stale prompts, 1 stale agent), explicitly not touched
- [x] CHK-042 [P2] No fabricated changelog/version-history narrative introduced
  - **Evidence**: `grep -in "changelog\|version history"` across all edited/created docs returns no fabricated narrative
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] `git status --porcelain` scoped to exactly this phase's Files to Change table
  - **Evidence**: `git status --porcelain` shows `scripts/pi/`, `.pi/agents/`, `.pi/prompts/`, `.pi/extensions/`, `.pi/settings.json` (package addition), `cli-pi/references/agent-delegation.md`, plus this phase's own docs -- nothing else
- [x] CHK-051 [P1] `scratch/` left empty
  - **Evidence**: `find .../012-pi-runtime-compatibility/scratch -type f` returns nothing
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 7 | 7/7 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-07-27. All items verified with real, live evidence. GLM-5.2 independent review: APPROVE WITH MINOR NOTES, all 3 actionable findings addressed.
<!-- /ANCHOR:summary -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`
