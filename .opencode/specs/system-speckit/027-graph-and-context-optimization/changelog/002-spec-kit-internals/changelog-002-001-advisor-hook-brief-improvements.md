

---
title: "Skill-Advisor Hook Improvements"
description: "Unified threshold contract and shared brief rendering across OpenCode and Codex runtimes, with durable prompt-safe telemetry and explicit workspace semantics on public MCP surfaces."
trigger_phrases:
  - "skill-advisor threshold unification"
  - "codex opencode brief rendering"
  - "advisor hook diagnostics sink"
  - "workspaceRoot advisor surface"
  - "prompt-safe telemetry outcomes"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/002-skill-advisor-scoring-engine/001-advisor-hook-brief-improvements` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/002-skill-advisor-scoring-engine`

### Summary

The skill-advisor runtime had a fragmented threshold contract across OpenCode and Codex paths, with no durable path for hook diagnostics to survive process boundaries. This phase unified the threshold and rendering invariants for both runtimes, wired public `advisor_recommend` and `advisor_validate` onto explicit `workspaceRoot` and effective-state outputs, and published a bounded JSONL sink for prompt-safe diagnostics that validator analysis can read across processes. Verification passed on the focused Vitest suites, direct hook smokes, and cross-consistency greps. The full package build remains blocked by unrelated pre-existing TypeScript errors outside this scope.

### Added

- OpenCode threshold default parity so plugin defaults, native bridge, and fallback route share one explicit contract.
- Shared `renderAdvisorBrief(...)` invariants replacing the OpenCode bespoke formatter.
- Codex shared-builder normalization covering prompt submission and prompt-wrapper fallback.
- Explicit `workspaceRoot` acceptance on `advisor_recommend` and `advisor_validate` with effective state on output.
- Durable JSONL diagnostics sink under the temp metrics root for hook diagnostics that survive process boundaries.
- Accepted, corrected, and ignored outcome totals published through the `advisor_validate` telemetry block.

### Changed

- OpenCode native bridge rendering now flows through the shared `renderAdvisorBrief(...)` path instead of a custom formatter.
- Codex prompt submission and prompt-wrapper fallback now share the same builder, timeout, threshold, and durable-diagnostics contract.
- Public advisor MCP surfaces now expose explicit `workspaceRoot`, `effectiveThresholds`, and threshold semantics on output.
- Hook diagnostics from Claude, Gemini, and Copilot hooks now persist to the bounded JSONL sink instead of process-local stderr only.

### Fixed

- None.

### Verification

- OpenCode parity vitest - Pass (4 tests passed)
- Validator vitest - Pass (3 tests passed)
- Direct bridge smoke - Pass (returned prompt-safe brief plus `workspaceRoot` and `effectiveThresholds`)
- Codex hook plus wrapper verification - Pass (prompt-safe fail-open `{}` output with durable diagnostics on stale path)
- Direct handler smokes - Pass (`advisor_recommend` and `advisor_validate` returned new public fields and telemetry totals)
- Cross-consistency grep - Pass (README, hook reference, and schema agree on `workspaceRoot`, `effectiveThresholds`, and `thresholdSemantics`)
- Full package build - Fail (pre-existing TypeScript errors in `hooks/claude/hook-state.ts`, `lib/context/shared-payload.ts`, and `code-graph/lib/code-graph-context.ts` outside this packet scope)

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/plugins/spec-kit-skill-advisor.js` | Modified | OpenCode threshold default parity |
| `.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs` | Modified | OpenCode threshold and render contract |
| `.opencode/skills/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts` | Modified | Shared threshold helpers |
| `.opencode/skills/system-spec-kit/mcp_server/skill-advisor/lib/render.ts` | Modified | Shared render threshold options |
| `.opencode/skills/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts` | Modified | Public workspace, threshold, and telemetry schemas |
| `.opencode/skills/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts` | Modified | Public workspace and threshold outputs |
| `.opencode/skills/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts` | Modified | Threshold semantics and telemetry outcomes |
| `.opencode/skills/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts` | Modified | Durable diagnostics and outcome capture |
| `.opencode/skills/system-spec-kit/mcp_server/skill-advisor/README.md` | Modified | Public contract documentation |
| `.opencode/skills/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts` | Modified | OpenCode parity regression coverage |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts` | Modified | Codex shared-builder normalization and durable diagnostics |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts` | Modified | Codex fallback parity and durable diagnostics |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts` | Modified | Durable diagnostics sink wiring |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts` | Modified | Durable diagnostics sink wiring |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts` | Modified | Durable diagnostics sink wiring |
| `.opencode/skills/system-spec-kit/references/hooks/skill-advisor-hook.md` | Modified | Hook and operator contract documentation |

### Follow-Ups

- Full package build remains blocked by pre-existing TypeScript errors in `hooks/claude/hook-state.ts`, `lib/context/shared-payload.ts`, and `code-graph/lib/code-graph-context.ts` outside this packet scope. Resolution is outside the scope lock for this packet.
