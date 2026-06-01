---
title: "Skill-Advisor Documentation and Phase 020 Code Alignment"
description: "Skill-advisor package documentation updated for hook-first invocation and Phase 020 TypeScript audited against coding standards. Nine minor findings remediated across the Model Context Protocol (MCP) server library."
trigger_phrases:
  - "skill-advisor hook documentation"
  - "skill-advisor feature catalog update"
  - "skill-advisor manual testing playbook"
  - "Phase 020 code alignment audit"
  - "hook-routing smoke test"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/001-documentation-code-alignment` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation`

### Summary

Phase 020 shipped the skill-advisor hook surface but the skill-advisor package documentation still described the direct command-line interface (CLI) flow as primary. The Phase 020 TypeScript code had not been audited against project coding standards. This phase updated all four package documents to reflect hook-first invocation and completed a full audit of 18 Phase 020 TypeScript files with nine minor remediations applied in place.

### Added
- Hook invocation documented as the primary Gate 2 path in the skill-advisor README and setup guide, with build and runtime registration guidance plus a cross-reference to the Phase 020 hook reference
- Twelve new Phase 020 hook-surface feature entries in the feature catalog under a dedicated HOOK SURFACE category covering runtime hook adapters, HMAC prompt cache, freshness fingerprints, generation counter, runtime parity, corpus parity, disable flag, observability metrics, diagnostic records, health reporting, and privacy contract
- Manual hook-routing smoke test playbook covering runtime registration, work-intent brief injection, disable flag bypass, stale-graph badge behavior, and diagnostic privacy spot checks

### Changed
- README restructured so prompt-time hook invocation appears as the primary path near the top, with the direct CLI flow preserved under a fallback section for diagnostics and scripted checks
- Setup guide reoriented around hook-first invocation as the primary Gate 2 mode
- Manual testing playbook expanded with a hook-routing category and cross-reference index entries for HR-001 through HR-006
- Comment wording across five TypeScript files rephrased from dated, task-era, or legacy-install language to durable runtime behavior and fallback contract descriptions

### Fixed
- Untyped catch variables in skill-advisor TypeScript files now use explicit `unknown` annotations in generation.ts and subprocess.ts
- Child-process spawn handle typed explicitly as `ChildProcess` in subprocess.ts
- Diagnostic validation and generation payload error messages now include field paths along with expected and actual values in metrics.ts, subprocess.ts, and generation.ts
- Parser-trust comment near advisor shared-payload additions rephrased for clarity in shared-payload.ts

### Verification
- Phase 020 vitest target: PASS (19 files, 118 tests passed, 15.44s)
- `npx tsc --noEmit` in mcp_server: PASS (exit 0)
- TypeScript standards grep: PASS (no matches for unqualified `any`, untyped `catch (error)`, task-era comments, compatibility wording, or untyped child handle)
- `validate.sh --strict --no-recursive` on spec folder: PASS (errors=0, warnings=0)

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `../../../../skill/skill-advisor/README.md` | Modified | Documented hook invocation as primary and direct CLI as fallback |
| `../../../../skill/skill-advisor/feature_catalog/feature_catalog.md` | Modified | Added 12 Phase 020 hook-surface feature entries |
| `../../../../skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md` | Modified | Added hook-routing category and cross-reference index entries |
| `../../../../skill/skill-advisor/manual_testing_playbook/06--hook-routing/001-hook-routing-smoke.md` | Created | Added manual hook-routing smoke test playbook |
| `../../../../skill/skill-advisor/SET-UP_GUIDE.md` | Modified | Aligned setup guide with hook-first invocation |
| `.opencode/skills/system-spec-kit/mcp_server/lib/context/shared-payload.ts` | Modified | Rephrased parser-trust comment near advisor shared-payload additions |
| `.opencode/skills/system-spec-kit/mcp_server/lib/skill-advisor/generation.ts` | Modified | Added explicit catch type and stronger generation payload error message |
| `.opencode/skills/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts` | Modified | Added child-process typing, explicit catch types, and field-path JSON errors |
| `.opencode/skills/system-spec-kit/mcp_server/lib/skill-advisor/metrics.ts` | Modified | Improved diagnostic validation error messages with closed-schema expectations |
| `.opencode/skills/system-spec-kit/mcp_server/lib/skill-advisor/normalize-adapter-output.ts` | Modified | Removed packet-number comment wording |
| `.opencode/skills/system-spec-kit/mcp_server/lib/codex-hook-policy.ts` | Modified | Removed legacy-install wording |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts` | Modified | Replaced dated local-checkout comment with runtime SDK probing description |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts` | Modified | Renamed compatibility comment to fallback-path comment |
| Packet docs (plan, checklist, implementation-summary, audit-findings) | Created | Level 2 packet evidence and Phase 020 audit ledger |

### Follow-Ups
- Interactive runtime smoke testing remains manual. The playbook describes the Claude, Gemini, Copilot, and Codex smoke procedure, but this pass verified automated Phase 020 suites rather than launching each interactive runtime.
