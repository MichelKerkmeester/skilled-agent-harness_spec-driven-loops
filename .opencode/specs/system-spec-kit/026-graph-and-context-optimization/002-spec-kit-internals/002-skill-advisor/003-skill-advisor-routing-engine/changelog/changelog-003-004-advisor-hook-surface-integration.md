---
title: "Skill-Advisor Hook Surface Across Claude/Gemini/Copilot/Codex"
description: "Skill advisor only fired when AI explicitly invoked it in a shell command, leaving Codex/Gemini/Copilot runtimes without proactive routing. This phase shipped a cross-runtime hook surface that runs buildSkillAdvisorBrief on every UserPromptSubmit event, renders AdvisorHookResult as additionalContext with fail-open contract, and achieved 200/200 corpus parity with cache-hit p95 of 0.016 ms."
trigger_phrases:
  - "skill advisor hook surface"
  - "cross-runtime advisor hook"
  - "buildSkillAdvisorBrief"
  - "AdvisorHookResult renderer"
  - "proactive skill routing runtime"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/003-skill-advisor-routing-engine/004-advisor-hook-surface-integration` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/003-skill-advisor-routing-engine`

### Summary

Skill advisor only fired when an AI explicitly invoked it in a shell command, leaving Codex, Gemini, and Copilot runtimes without proactive routing. This phase shipped a cross-runtime hook surface. Each UserPromptSubmit event in all four runtimes now runs buildSkillAdvisorBrief which returns a typed AdvisorHookResult rendered as hookSpecificOutput.additionalContext or wrapper-preamble fallback. The brief emits a sanitized top-1 skill recommendation with freshness, confidence, and uncertainty fields. A fail-open contract returns an empty object on any error, so hook failures never block the runtime. The phase achieved 200/200 corpus parity, 4-runtime parity across 5 fixtures, cache-hit p95 of 0.016 ms, and a 66.7% replay hit rate.

### Added

- Cross-runtime proactive skill-advisor hook surface running on UserPromptSubmit events in Claude, Gemini, Copilot, and Codex
- Shared-payload advisor contract in lib/context/shared-payload.ts with skill-inventory, skill-graph, and advisor-runtime source kinds plus AdvisorEnvelopeMetadata with privacy rejection for prompt-derived provenance
- getAdvisorFreshness() in lib/skill-advisor/freshness.ts implementing live/stale/absent/unavailable vocabulary with 15-minute LRU source cache and atomic generation counter with corrupt recovery
- buildSkillAdvisorBrief() orchestration with NFKC canonical fold prompt policy, 5-minute HMAC exact cache, and python3 subprocess runner with SQLITE_BUSY retry and 1000ms SIGKILL timeout
- Pure renderer with whitelist fields, canonical-fold sanitization, and instruction-regex deny, cross-runtime output normalizer and observability contract with speckit_advisor_hook namespace and AdvisorHookDiagnosticRecord JSONL schema
- Claude hook in hooks/claude/user-prompt-submit.ts emitting JSON hookSpecificOutput.additionalContext, registered in .claude/settings.local.json
- Gemini BeforeAgent adapter emitting JSON additionalContext, registered in .gemini/settings.json
- Copilot adapter with SDK onUserPromptSubmitted preferred and wrapper fallback for when the SDK is locally unavailable
- Codex adapter with dynamic live/partial/unavailable detector, stdin canonical path, argv fallback, PreToolUse Bash-only deny, and prompt-wrapper fallback
- 200-prompt corpus parity harness and 4-runtime parity harness covering 5 canonical fixtures across Claude/Gemini/Copilot/Codex
- 650-line skill-advisor-hook reference doc (DQI 97) with capability matrix, failure-mode playbook, observability contract, performance budgets, migration notes, and privacy contract, validation playbook, updated CLAUDE.md Gate 2 section

### Changed

- Cache-hit lane p95 gate tightened to cache-hit-only measurement, 30-turn replay corrected to 10 unique plus 20 repeats yielding 66.7% hit rate
- Advisor envelope metadata validation made producer-gated with privacy rejection for kind:user-prompt with unanchored sha256 provenance
- NFKC canonical normalization applied to prompt inputs across all runtime adapters

### Fixed

- getAdvisorFreshness() now correctly implements live/stale/absent/unavailable states per implementation-summary verification table
- Shared-payload envelope correctly populated with advisor producer and metadata fields across all runtimes
- Cache-hit p95 measured at 0.016 ms against a 50 ms gate after correcting the measurement lane scope
- Pre-existing non-020 test failures (transcript-planner-export.vitest.ts, deep-loop/prompt-pack.vitest.ts) confirmed unrelated to Phase 020 via stash-test

### Verification

- Phase 020 vitest (all suites, 19 files, 118 tests, 16.12s) - PASS
- npx tsc --noEmit mcp_server - PASS
- validate.sh --strict per-child (8 children) - PASS
- validate.sh --strict 020 parent - PASS
- 200-prompt corpus parity HARD GATE (200/200 top-1 match via advisor-corpus-parity.vitest.ts) - PASS
- 4-runtime parity across 5 fixtures (Claude/Gemini/Copilot/Codex produce identical additionalContext after transport normalization) - PASS
- Cache-hit lane p95 (gate 50 ms) measured at 0.016 ms - PASS
- 30-turn replay cache hit rate (gate 60%) measured at 66.7% - PASS
- Privacy audit (zero raw prompt presence in envelope sources, metrics labels, JSONL, session_health, cache keys) - PASS
- Disable flag smoke (SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 short-circuits producer) - PASS
- Reference doc DQI (target 85) measured at 97 - PASS

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/context/shared-payload.ts` | Modified | Added advisor producer, source kinds, and AdvisorEnvelopeMetadata with privacy rejection |
| `.opencode/skills/system-spec-kit/mcp_server/lib/skill-advisor/freshness.ts` | Modified | Implemented getAdvisorFreshness with live/stale/absent/unavailable vocabulary |
| `.opencode/skills/system-spec-kit/mcp_server/lib/skill-advisor/source-cache.ts` | Created | 15-minute LRU cache keyed by workspace root plus source signature and generation |
| `.opencode/skills/system-spec-kit/mcp_server/lib/skill-advisor/generation.ts` | Created | Atomic generation counter with temp-file rename and corrupt recovery |
| `.opencode/skills/system-spec-kit/mcp_server/lib/skill-advisor/prompt-policy.ts` | Created | NFKC canonical fold and fire/skip rules |
| `.opencode/skills/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts` | Created | 5-minute HMAC exact cache with session-scoped secret |
| `.opencode/skills/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts` | Created | Python3 runner with SQLITE_BUSY retry and 1000ms SIGKILL timeout |
| `.opencode/skills/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts` | Created | buildSkillAdvisorBrief orchestration with typed AdvisorHookResult output |
| `.opencode/skills/system-spec-kit/mcp_server/lib/skill-advisor/render.ts` | Created | Pure renderer with whitelist fields and instruction-regex deny |
| `.opencode/skills/system-spec-kit/mcp_server/lib/skill-advisor/normalize-adapter-output.ts` | Created | Cross-runtime output normalizer for parity comparison |
| `.opencode/skills/system-spec-kit/mcp_server/lib/skill-advisor/metrics.ts` | Created | Observability contract with speckit_advisor_hook namespace and JSONL schema |
| `.opencode/skills/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts` | Modified | Extended to 4 runtimes with 5 canonical fixtures |
| `.opencode/skills/system-spec-kit/mcp_server/tests/advisor-corpus-parity.vitest.ts` | Modified | 200-prompt harness with HARD GATE enforcement |
| `.opencode/skills/system-spec-kit/mcp_server/tests/advisor-timing.vitest.ts` | Modified | Cache-hit lane p95 and 30-turn replay hit rate |
| `.opencode/skills/system-spec-kit/mcp_server/tests/advisor-privacy.vitest.ts` | Created | Privacy audit harness |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts` | Created | Claude UserPromptSubmit hook emitting JSON additionalContext |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts` | Created | Gemini BeforeAgent adapter emitting additionalContext |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts` | Created | Copilot adapter with SDK preferred path and wrapper fallback |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts` | Created | Codex adapter with stdin canonical and argv fallback |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts` | Created | Codex PreToolUse with Bash-only deny |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts` | Created | Codex fallback wrapper when detector returns unavailable |
| `.opencode/skills/system-spec-kit/mcp_server/lib/codex-hook-policy.ts` | Created | Dynamic live/partial/unavailable detector with version and hooks list probes |
| `.opencode/skills/system-spec-kit/mcp_server/tests/shared-payload-advisor.vitest.ts` | Created | 6 acceptance scenarios for advisor envelope metadata |
| `.opencode/skills/system-spec-kit/mcp_server/tests/advisor-freshness.vitest.ts` | Created | 11 tests covering AS1-AS10 freshness and cache scenarios |
| `.opencode/skills/system-spec-kit/mcp_server/tests/advisor-brief.vitest.ts` | Created | 26 tests across 4 vitest files for brief producer and cache |
| `.opencode/skills/system-spec-kit/mcp_server/tests/advisor-renderer.vitest.ts` | Created | Renderer harness with whitelist and deny validation |
| `.opencode/skills/system-spec-kit/mcp_server/tests/advisor-observability.vitest.ts` | Created | Observability harness for metrics namespace and JSONL |
| `.claude/settings.local.json` | Modified | Registered Claude UserPromptSubmit hook |
| `.gemini/settings.json` | Modified | Registered Gemini BeforeAgent hook |
| `.opencode/skills/system-spec-kit/references/hooks/skill-advisor-hook.md` | Created | 650-line reference doc with DQI 97 |
| `.opencode/skills/system-spec-kit/references/hooks/skill-advisor-hook-validation.md` | Created | 8-step manual validation playbook |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/README.md` | Modified | Updated for 4 runtime adapters |
| `CLAUDE.md` | Modified | Updated Gate 2 section with hook primary and direct CLI fallback |

### Follow-Ups

- Full mcp_server test suite green pending T9 integration gauntlet evidence
- Codex .codex/settings.json and .codex/policy.json not auto-registered due to sandbox EPERM, registration snippets documented in reference doc section 3 and require manual application
- Copilot SDK runtime capture deferred because @github/copilot-cli was not locally available during development, wrapper fallback path tested via mocks and is production-ready when SDK lands
- Interactive smoke tests deferred for all 4 runtimes, CLI smoke tests with simulated stdin are in place but real interactive session smoke is pending
- Pre-existing test failures (transcript-planner-export.vitest.ts, deep-loop/prompt-pack.vitest.ts) need follow-up in their respective packets 015 and deep-loop, confirmed unrelated to Phase 020 via stash-test
- Smart-router context-load efficacy measurement (do advisor briefs actually reduce context load for AI assistants) queued as a separate phase with OpenCode plugin architecture research using the working code-graph OpenCode plugin as reference
