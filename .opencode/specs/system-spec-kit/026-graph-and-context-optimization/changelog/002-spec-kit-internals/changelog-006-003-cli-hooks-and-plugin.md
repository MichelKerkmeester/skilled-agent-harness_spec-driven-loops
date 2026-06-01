---
title: "CLI Hooks and Plugin Verification"
description: "Prompt-time skill advisor hook adapters for Claude, Gemini, Codex and Devin were verified against the compiled dist build. All four pass. The OpenCode plugin bridge fails open safely but its native route does not engage, recorded as a documented finding."
trigger_phrases:
  - "skill advisor cli hooks"
  - "playbook run phase 003 verification"
  - "claude gemini codex devin hook adapter results"
  - "opencode plugin bridge native route finding"
  - "prompt-time advisor brief adapters"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/003-cli-hooks-and-plugin` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation`

### Summary

Prompt-time hook adapters for four command-line runtimes (Claude, Gemini, Codex and Devin) were exercised against compiled dist hooks. Each adapter surfaces a compact advisor brief for substantive prompts, returns an empty payload for short or malformed input, exits cleanly and never leaks the raw prompt to stderr. The OpenCode plugin bridge was also exercised. It fails open safely with correct thresholds but its native compat route does not engage, falling back to the Python path instead.

### Added

- None.

### Changed

- None.

### Fixed

- None.

### Verification

- CL-001 Claude hook adapter, PASS
- CL-003 Gemini hook adapter (BeforeAgent schema), PASS
- CL-004 Codex SessionStart and UserPromptSubmit hooks plus prompt wrapper, PASS
- CL-005 OpenCode plugin bridge direct invocation, PARTIAL (fail-open correct, native route did not engage)
- CL-006 Devin hook adapter with registration check, PASS
- Prompt-leak audit across all stderr outputs, PASS (no raw prompt found)
- Totals: 4 PASS, 1 PARTIAL, 0 FAIL, 0 SKIP

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| Packet docs (spec, plan, tasks, checklist, implementation-summary) | Created | Scoped packet documentation for this verification phase |

### Follow-Ups

- The OpenCode plugin bridge native route remains unverified. The bridge reports `SYSTEM_SKILL_ADVISOR_UNAVAILABLE` and falls to the Python path even though the compat entry exists on disk. Root cause is the subprocess invocation of the native compat path, recorded for a follow-on packet.
- Live interactive terminal behavior was not exercised. Devin `/hooks` listing, codex features list and stdin-over-argv precedence checks are documented optional manual steps that remain unrun.
