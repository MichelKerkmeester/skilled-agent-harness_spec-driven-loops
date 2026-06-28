---
title: "D4-R2 — Replace never-run design_gate() pseudocode with an executable PreToolUse branch"
description: "Insert evaluateOpenDesignPrecondition(input,policy) before the Bash-only return {} in pre-tool-use.ts and deny on validator exception."
trigger_phrases:
  - "d4-r2 pretooluse branch"
  - "executable design gate design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D4-R2 — Replace never-run design_gate() pseudocode with an executable PreToolUse branch

## 1. OBJECTIVE
Add a real, executable Open Design branch to the Codex PreToolUse hook by inserting `evaluateOpenDesignPrecondition(input, policy)` before the current Bash-only `return {}`, denying on any validator exception rather than failing open.

## 2. WHY
The existing `design_gate()` is pseudocode that never runs; the hook reaches a Bash-only early return, so MCP/HTTP Open Design tool calls pass unchecked. PreToolUse is the defense-in-depth lane behind the guarded proxy.

## 3. TARGET & CLASS
- **Target file(s):** `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts:215`
- **Severity:** P0
- **Enforcement class:** enforceable
- **Dimension:** D4 — mcp-open-design Pairing

## 4. BUILD OUTLINE
- Insert `evaluateOpenDesignPrecondition(input, policy)` ahead of the Bash-only `return {}` branch.
- Make validator exceptions deny (fail-closed), unlike the Bash lane's fail-open behavior.
- Route guarded Open Design tools through the new branch; leave non-guarded tools untouched.

## 5. ACCEPTANCE
- A guarded Open Design tool call with no valid token is DENIED by PreToolUse, and a thrown validator error yields deny (not pass), verified against the hook path.

## 6. EVIDENCE
- `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts:215` — the Bash-only early `return {}` that the executable branch must precede.
- Source: `research/research.md` §7 (D4-R2)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
