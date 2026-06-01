---
title: "Phase 011: Skill advisor hook improvements"
description: "OpenCode threshold/render parity, Codex shared-brief normalization, public MCP workspace/threshold semantics, and durable prompt-safe telemetry with outcome capture."
trigger_phrases:
  - "phase 011 changelog"
  - "skill advisor hook improvements"
  - "threshold parity"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-24

> Spec folder: `026-graph-and-context-optimization/006-skill-advisor/001-advisor-hook-brief-improvements` (Level 2)
> Parent packet: `026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor`

### Summary

Packet 014 delivered the implementation follow-through for the packet-02 research bundle. OpenCode now uses one explicit threshold contract across plugin defaults, native bridge routing, fallback routing, and operator-facing bridge metadata. Codex prompt submission and prompt-wrapper now share the same builder, timeout, threshold, and durable-diagnostics contract. Public MCP handlers expose `workspaceRoot` and threshold semantics. Hook diagnostics now persist to bounded JSONL sinks.

### Added

- Shared threshold helpers in `skill-advisor-brief.ts` and `render.ts`.
- Public `workspaceRoot` and `effectiveThresholds` output on `advisor_recommend` and `advisor_validate`.
- `thresholdSemantics` and prompt-safe telemetry block with outcome totals on `advisor_validate`.
- Durable diagnostics: bounded JSONL sinks under temp metrics root.
- `advisor-validate.vitest.ts` (3 tests) and `plugin-bridge.vitest.ts` (4 tests).

### Changed

- OpenCode native bridge rendering now flows through shared `renderAdvisorBrief()` invariants.
- Codex `user-prompt-submit.ts` and `prompt-wrapper.ts` normalized to shared builder/timeout/threshold contract.
- Public tool inputs: `workspaceRoot` optional on input, explicit on output.
- Aggregate validation thresholds published separately from runtime routing thresholds.
- Hook diagnostics wired into Claude, Gemini, and Copilot adapters.

### Fixed

- OpenCode threshold drift: plugin used 0.7, shared runtime used 0.8. Now unified.
- Codex bespoke prompt-time fast path bypassed shared brief pipeline. Now normalized.
- `advisor_recommend` lacked `workspaceRoot` and `effectiveThresholds` in public output. Now present.
- Hook diagnostics were stderr-only. Now persist to bounded JSONL.

### Verification

- OpenCode parity vitest: 4/4 passed.
- Validator vitest: 3/3 passed.
- Direct bridge smoke: prompt-safe brief plus `workspaceRoot` and `effectiveThresholds`.
- Codex hook + wrapper verification: prompt-safe fail-open `{}` with durable diagnostics.
- Direct handler smokes: new public fields and telemetry totals present.
- Cross-consistency grep: README, hook reference, and schema agree on `workspaceRoot`, `effectiveThresholds`, `thresholdSemantics`.
- Full package build: FAIL (blocked by unrelated pre-existing TypeScript errors outside packet scope).

### Files Changed

| File | What changed |
|------|--------------|
| `plugins/spec-kit-skill-advisor.js` | OpenCode threshold default parity |
| `plugin-helpers/spec-kit-skill-advisor-bridge.mjs` | OpenCode threshold + render contract |
| `hooks/codex/user-prompt-submit.ts` | Codex shared-builder normalization + durable diagnostics |
| `hooks/codex/prompt-wrapper.ts` | Codex fallback parity + durable diagnostics |
| `skill-advisor/lib/skill-advisor-brief.ts` | Shared threshold helpers |
| `skill-advisor/lib/render.ts` | Shared render threshold options |
| `skill-advisor/schemas/advisor-tool-schemas.ts` | Public workspace/threshold/telemetry schemas |
| `skill-advisor/handlers/advisor-recommend.ts` | Public workspace + threshold outputs |
| `skill-advisor/handlers/advisor-validate.ts` | Threshold semantics + telemetry/outcomes |
| `skill-advisor/lib/metrics.ts` | Durable diagnostics + outcomes |
| `references/hooks/skill-advisor-hook.md` | Hook/operator contract docs |
| 4 hook adapters files | Durable diagnostics sink wiring |

### Follow-Ups

- Global package build still blocked by unrelated pre-existing TypeScript errors.
- Workspace reports stale advisor freshness during direct hook/bridge smokes.
