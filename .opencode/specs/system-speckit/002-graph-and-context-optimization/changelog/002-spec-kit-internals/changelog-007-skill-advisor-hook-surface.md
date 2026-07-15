---
title: "Phase 007: Skill advisor hook surface"
description: "Cross-runtime advisor hook surface shipped across Claude/Gemini/Copilot/Codex. 200/200 corpus parity, cache-hit p95 0.016ms, hit rate 66.7%, DQI 97 reference doc."
trigger_phrases:
  - "phase 007 changelog"
  - "skill advisor hook surface"
  - "advisor hook 4-runtime parity"
importance_tier: "critical"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-19

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor` (Level 3)
> Parent packet: `002-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor`

### Summary

Cross-runtime proactive skill-advisor hook surface. Each `UserPromptSubmit` event in Claude, Gemini, Copilot, and Codex runs `buildSkillAdvisorBrief(prompt, {runtime})` which returns a typed `AdvisorHookResult` rendered to the model as additional context. Brief emits a sanitized skill recommendation with freshness/confidence/uncertainty fields. Fail-open contract returns `{}` on any error. Delivery spanned three research waves plus 8 implementation children plus an integration gauntlet, all executed in approximately 6 hours of autonomous orchestration.

### Added

- `lib/context/shared-payload.ts` advisor producer + `AdvisorEnvelopeMetadata` type + privacy rejection.
- `lib/skill-advisor/freshness.ts`, `source-cache.ts` (15-min LRU), `generation.ts` (atomic counter + corrupt recovery).
- `lib/skill-advisor/prompt-policy.ts` (NFKC canonical fold), `prompt-cache.ts` (5-min HMAC exact cache), `subprocess.ts` (Python runner with SQLITE_BUSY retry + SIGKILL timeout), `skill-advisor-brief.ts`.
- `lib/skill-advisor/render.ts` (pure renderer + whitelist + deny regex), `normalize-adapter-output.ts` (cross-runtime comparator), `metrics.ts` (observability + JSONL + health).
- `hooks/claude/user-prompt-submit.ts`, `hooks/gemini/user-prompt-submit.ts`, `hooks/copilot/user-prompt-submit.ts`.
- `lib/codex-hook-policy.ts` (dynamic detector), `hooks/codex/user-prompt-submit.ts`, `hooks/codex/pre-tool-use.ts`, `hooks/codex/prompt-wrapper.ts`.
- 650-line reference doc at `references/hooks/skill-advisor-hook.md` (DQI 97/100).
- 11 test files. 10 canonical fixtures + 5 test harnesses.

### Changed

- `shared-payload.ts` extended with advisor producer and skill-inventory source kinds.
- CLAUDE.md Gate 2 section updated for hook-first invocation.

### Fixed

- 200/200 corpus parity achieved across all 4 runtimes.
- Cache-hit p95 at 0.016ms. Hit rate at 66.7%.
- Pattern reuse from code-graph: same freshness vocabulary, same envelope shape, same pure-renderer boundary.

### Verification

- T9 Integration Gauntlet: PASS.
- All 118 Phase 020 tests green.
- `tsc --noEmit` clean.
- `validate.sh --strict` clean.
- Live dogfood observed during orchestrating session.

### Files Changed

| File | What changed |
|------|--------------|
| `lib/context/shared-payload.ts` | Advisor producer + privacy rejection |
| `lib/skill-advisor/` (8 new files) | Freshness, cache, policy, brief, render, metrics, subprocess, normalization |
| `hooks/claude/`, `hooks/gemini/`, `hooks/copilot/`, `hooks/codex/` (7 new files) | 4-runtime hook adapters |
| `references/hooks/skill-advisor-hook.md` | 650-line reference doc |
| 11 test files | Renderer, observability, corpus-parity, timing, privacy |

### Follow-Ups

- Copilot current-turn semantics differ from Claude/Gemini/Codex (writes to custom instructions, read on next prompt).
- Level 3 checklist remains pending.
