---
title: "Skill-Advisor Hook Surface Integration"
description: "A cross-runtime proactive skill-advisor hook surface that fires on every UserPromptSubmit event across Claude, Gemini, Copilot and Codex runtimes, emitting sanitized compact skill recommendations with freshness and confidence metadata."
trigger_phrases:
  - "skill advisor hook surface"
  - "proactive skill routing"
  - "cross-runtime skill advisor"
  - "skill advisor context injection"
  - "skill advisor brief"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/003-skill-advisor-routing-engine/004-advisor-hook-surface-integration` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/003-skill-advisor-routing-engine`

### Summary

The skill advisor only ran when an AI explicitly invoked it, limiting proactive routing to a single runtime. A cross-runtime hook surface was shipped that fires the advisor on every UserPromptSubmit event across Claude, Gemini, Copilot and Codex runtimes. Each hook produces a sanitized, compact skill recommendation brief with freshness and confidence metadata, rendered as JSON additionalContext or a wrapper preamble. The fail-open contract ensures that hook failures never block the model from receiving the prompt.

### Added

- A shared-payload advisor contract with source vocabulary for skill-inventory, skill-graph and advisor-runtime sources, plus privacy rejection for prompt-derived provenance
- A freshness and source cache layer with per-skill fingerprints, generation-tagged snapshots, a 15-minute LRU cache and corrupt-counter recovery
- A brief producer with NFKC canonical fold prompt policy, a 5-minute HMAC exact cache and a subprocess runner with SQLITE_BUSY retry and SIGKILL timeout
- A pure renderer with whitelist fields, canonical-fold sanitization and instruction-regex deny, backed by a 200-prompt corpus parity harness that passed all 200 prompts
- A Claude UserPromptSubmit hook that emits sanitized skill recommendations as JSON `hookSpecificOutput.additionalContext` with a fail-open error contract
- Gemini and Copilot UserPromptSubmit hooks with JSON transport, a Copilot SDK preferred path and a wrapper fallback when the SDK is locally unavailable
- A Codex integration with a dynamic CLI detector, a stdin canonical adapter with argv fallback, a PreToolUse Bash-deny policy and a prompt wrapper fallback
- A 650-line reference document and validation playbook covering a capability matrix, a failure-mode playbook, an observability contract, performance budgets and a privacy contract

### Changed

- The CLAUDE.md Gate 2 section was updated to reference the advisor hook as the primary routing path with direct CLI invocation as a fallback

### Fixed

- None.

### Verification

- Full vitest suite (19 files, 118 tests): PASS
- `npx tsc --noEmit` on mcp_server: PASS (exit 0)
- `validate.sh --strict` across all 8 phase children: PASS (0 errors)
- `validate.sh --strict` on the parent packet: PASS (0 errors)
- 200-prompt corpus parity (005 hard gate): PASS (200 of 200 top-1 match)
- 4-runtime parity across 5 canonical fixtures: PASS (identical additionalContext after transport normalization)
- Cache-hit lane p95 latency (gate: 50 ms or less): PASS (0.016 ms)
- 30-turn replay cache hit rate (gate: 60 percent or higher): PASS (66.7 percent)
- Privacy audit for raw prompt absence: PASS (zero hits across sources, labels, JSONL, session health and cache keys)
- Disable flag smoke test (`SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1`): PASS
- Reference document DQI (target: 85 or higher): PASS (DQI 97)

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `lib/context/shared-payload.ts` | Modified | Extended with advisor producer, source vocabulary and metadata validation |
| `lib/skill-advisor/` (9 files) | Created | Freshness, source cache, generation counter, prompt policy, prompt cache, subprocess runner, brief orchestrator, renderer, comparator and metrics |
| `hooks/claude/user-prompt-submit.ts` | Created | Claude hook with JSON additionalContext and fail-open error contract |
| `hooks/gemini/user-prompt-submit.ts` | Created | Gemini BeforeAgent adapter with JSON transport |
| `hooks/copilot/user-prompt-submit.ts` | Created | Copilot adapter with SDK preferred path and wrapper fallback |
| `lib/codex-hook-policy.ts` | Created | Codex dynamic CLI detector |
| `hooks/codex/` (3 files) | Created | Codex UserPromptSubmit, PreToolUse policy and prompt wrapper fallback |
| `CLAUDE.md` | Modified | Gate 2 updated to reference advisor hook as primary routing path |
| Reference docs (2 files) | Created | Skill-advisor-hook reference and validation playbook in `.opencode/skills/system-spec-kit/references/hooks/` |
| Test suites (5 files) | Created | Advisor parity, runtime parity, timing, privacy and shared-payload vitest suites |

### Follow-Ups

- Full mcp_server test suite green (pre-existing non-020 failures in transcript-planner-export and deep-loop prompt-pack require follow-up in their respective packets)
- `.codex/settings.json` and `.codex/policy.json` must be manually registered for the Codex runtime, per the reference doc setup section
- Copilot SDK runtime capture awaits local availability of the `@github/copilot-cli` SDK package; the wrapper fallback path is production-ready
- Interactive smoke tests for all four runtimes are deferred; the CLI smoke tests with simulated stdin are in place
- A follow-up phase is queued for measuring smart-router context-load efficacy of advisor briefs
