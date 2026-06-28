---
title: "D4-R4 — Codex policy schema: openDesignPreconditions.guardedTools + namespace forms"
description: "Add toolPreconditions/openDesignPreconditions to CodexPolicyFile plus the 7 mutating tools and namespace variants in pre-tool-use.ts and .codex/policy.json."
trigger_phrases:
  - "d4-r4 codex policy schema"
  - "guarded tools policy design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D4-R4 — Codex policy schema: openDesignPreconditions.guardedTools + namespace forms

## 1. OBJECTIVE
Extend the Codex policy schema with `toolPreconditions`/`openDesignPreconditions` carrying a `guardedTools` list (the 7 mutating Open Design tools plus their namespace-prefixed variants) so the PreToolUse branch knows exactly which tools to gate.

## 2. WHY
The executable branch (R2) needs a declarative source of truth for which tools are guarded and under which namespace forms. Without it, the guarded-tool set is hardcoded and silently drifts from the real tool surface.

## 3. TARGET & CLASS
- **Target file(s):** `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts:44` (CodexPolicyFile) + `.codex/policy.json`
- **Severity:** P1
- **Enforcement class:** enforceable
- **Dimension:** D4 — mcp-open-design Pairing

## 4. BUILD OUTLINE
- Add `toolPreconditions` / `openDesignPreconditions.guardedTools` to the `CodexPolicyFile` type.
- Enumerate the 7 mutating tools and their namespace-prefixed forms in `.codex/policy.json`.
- Have the R2 branch read `guardedTools` to decide gating membership.

## 5. ACCEPTANCE
- Each of the 7 mutating tools (and each namespace variant) is matched as guarded from policy alone; a non-listed tool is not gated, proving the membership check is policy-driven.

## 6. EVIDENCE
- `.opencode/skills/mcp-open-design/references/tool_surface.md:48` — the mutating tool set the `guardedTools` list must cover.
- Source: `research/research.md` §7 (D4-R4)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
