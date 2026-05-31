---
title: "Cleanup Pass Phase 016: Hook Plugin Per Runtime Testing"
description: "Live runtime harness built and executed across five CLI surfaces: Claude, Codex, Copilot, Gemini and OpenCode. A complete five-cell verdict matrix was produced with honest FAIL and TIMEOUT_CELL outcomes recorded from real invocations."
trigger_phrases:
  - "runtime hook plugin testing"
  - "per-runtime hook validation"
  - "hook live testing matrix"
  - "cli hook runner results"
  - "016-runtime-hook-plugin-testing"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-29

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/016-runtime-hook-plugin-testing` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass`

### Summary

The hook contract docs and adapter scaffolding described how Claude Code, Codex CLI, GitHub Copilot CLI, Gemini CLI and OpenCode should receive Spec Kit prompt and lifecycle context. That contract had never been tested with a live execution pass. Each runtime CLI was invoked. Its hook or plugin signal was observed. Results were saved as JSONL evidence.

A five-cell verdict matrix was produced. Four cells returned FAIL due to auth, keychain, session-store or state-directory blockers specific to the host environment. One cell returned TIMEOUT_CELL because the Gemini CLI stalled at an interactive auth prompt for the full 300-second window. Direct hook and plugin smoke evidence was captured separately so hook-code health could be assessed independently from provider launch failures.

### Added

- `runners/common.ts` with shared runner contract, subprocess helper, timeout enforcement, redaction and JSONL output helpers
- `runners/run-all-runtime-hooks.ts` three-wide concurrent orchestrator for all five runtime cells
- `runners/test-claude-hooks.ts`, `test-codex-hooks.ts`, `test-copilot-hooks.ts`, `test-gemini-hooks.ts`, `test-opencode-plugins.ts` as per-runtime live test cells
- `runners/README.md` operator quickstart covering prerequisites, invocation and result interpretation
- `results/*.jsonl` with per-cell JSONL evidence for Claude, Codex, Copilot, Gemini and OpenCode
- `findings.md` signed-off runtime matrix with PASS, FAIL, SKIPPED and TIMEOUT_CELL verdicts per runtime and event

### Changed

- None. Additive-only phase.

### Fixed

- None. Additive-only phase.

### Verification

| Command | Result |
|---------|--------|
| `node --experimental-strip-types runners/run-all-runtime-hooks.ts` | Exit 0. Five cells classified. |
| `rg <secret patterns> results/` | Exit 0. No unredacted key-like values found. |
| `bash validate.sh 016-runtime-hook-plugin-testing --strict` | Exit 0. |
| CHK-001 Hook contract reference read | PASS. Evidence in spec.md. |
| CHK-002 Per-runtime hook docs read | PASS. Evidence in plan.md. |
| CHK-003 CLI invocation docs read | PASS. Evidence in plan.md. |
| CHK-010 Shared result contract exists | PASS. Evidence in runners/common.ts. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `runners/common.ts` (NEW) | Created | Shared runner contract, subprocess helper, redaction, JSONL writes |
| `runners/run-all-runtime-hooks.ts` (NEW) | Created | Three-wide concurrent orchestrator |
| `runners/test-claude-hooks.ts` (NEW) | Created | Claude Code live hook test cell |
| `runners/test-codex-hooks.ts` (NEW) | Created | Codex CLI live hook test cell |
| `runners/test-copilot-hooks.ts` (NEW) | Created | GitHub Copilot CLI live hook test cell |
| `runners/test-gemini-hooks.ts` (NEW) | Created | Gemini CLI live hook test cell |
| `runners/test-opencode-plugins.ts` (NEW) | Created | OpenCode plugin live test cell |
| `runners/README.md` (NEW) | Created | Operator quickstart for runner invocation |
| `results/claude-user-prompt-submit.jsonl` (NEW) | Created | Claude hook evidence |
| `results/codex-user-prompt-submit-freshness.jsonl` (NEW) | Created | Codex hook evidence |
| `results/copilot-user-prompt-submitted-next-prompt.jsonl` (NEW) | Created | Copilot hook evidence |
| `results/gemini-before-agent-additional-context.jsonl` (NEW) | Created | Gemini hook evidence |
| `results/opencode-plugin-system-transform.jsonl` (NEW) | Created | OpenCode plugin evidence |
| `findings.md` (NEW) | Created | Signed-off runtime verdict matrix |

### Follow-Ups

- Determine whether runtime auth and state-directory failures belong in operator setup documentation or in dedicated per-runtime remediation packets.
- Rerun the matrix on a host where all five CLIs are fully authenticated to confirm hook-code PASS verdicts.
- Investigate why the Gemini CLI blocks at an interactive auth prompt rather than returning a nonzero exit code when credentials are absent.
