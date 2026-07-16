---
title: "Hook Test Sandbox Fix: Separate Direct Smokes from Live CLI Verdicts"
description: "Runtime hook tests now split deterministic direct-smoke cells from live CLI cells. Sandbox detection skips live CLI cells with SKIPPED_SANDBOX instead of misclassifying them as hook or auth failures."
trigger_phrases:
  - "hook test sandbox fix"
  - "sandbox detection runner"
  - "SKIPPED_SANDBOX live CLI"
  - "BLOCKED_BY_TEST_SANDBOX misclassification"
  - "direct smoke vs live CLI evidence"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-29

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/017-hook-test-sandbox-fix` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass`

### Summary

The runtime hook test matrix ran live runtime CLIs from inside a sandboxed `codex exec --sandbox workspace-write` parent process. That sandbox blocks access to user auth state, keychain, home config plus runtime state directories, so live CLI failures were misclassified as hook or auth failures rather than sandbox-blocked calls.

The runner was updated to detect sandboxed execution once at startup and pass the result to all five runtime adapters. Each adapter now emits a deterministic direct-smoke cell and a separate live-cli cell. Live CLI cells are recorded as `SKIPPED_SANDBOX` when sandbox is active, keeping hook-smoke coverage intact without producing false failures.

Prior findings in `016-runtime-hook-plugin-testing/findings.md` were amended to reclassify the five live CLI failures as `BLOCKED_BY_TEST_SANDBOX`, preserving the original verdict text as history. A `methodology-correction.md` file documents the root cause and the operator path for obtaining canonical live verdicts outside the sandbox.

### Added

- `detectSandbox()` function in `common.ts` checking `CODEX_SANDBOX`, `SANDBOX_PROFILE`, home mismatch plus home write probe failure
- `SKIPPED_SANDBOX` result type for live CLI cells that are intentionally skipped in sandboxed runs
- `hook-tests` npm script in `mcp_server/package.json` using the local TypeScript loader
- `methodology-correction.md` at the packet root explaining root cause and operator path

### Changed

- Each runtime adapter now emits a direct-smoke cell and a live-cli cell as separate result entries
- Orchestrator (`run-all-runtime-hooks.ts`) detects sandbox once and passes the flag to all adapters
- `runners/README.md` updated to document normal-shell live mode and sandbox partial mode
- `findings.md` amended with corrected `BLOCKED_BY_TEST_SANDBOX` classification while keeping original verdict text

### Fixed

- Live CLI failures were misclassified as hook failures when running inside a codex sandbox. They are now recorded as `SKIPPED_SANDBOX`.
- Prior findings carried incorrect root-cause labels for five live CLI failures. The amendment corrects them without removing the original evidence.

### Verification

| Command | Result |
|---------|--------|
| `npm --prefix .opencode/skills/system-spec-kit/mcp_server run hook-tests` | PASS: 5 direct-smoke PASS cells, 5 live-cli `SKIPPED_SANDBOX` cells |
| `npm --prefix .opencode/skills/system-spec-kit/mcp_server run build` | PASS |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh ... --strict` | PASS |
| CHK-001 Requirements documented | EVIDENCE: spec.md |
| CHK-002 Technical approach defined | EVIDENCE: plan.md |
| CHK-003 Historical evidence reviewed | EVIDENCE: `016-runtime-hook-plugin-testing/results/*.jsonl` |
| CHK-010 Runner changes scoped to methodology files | EVIDENCE: `016-runtime-hook-plugin-testing/runners/*.ts` |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `003-cross-cutting-cleanup-pass/016-runtime-hook-plugin-testing/runners/common.ts` | Modified | Added sandbox detection. New `SKIPPED_SANDBOX` type. Repo-root detection. Run-output path. |
| `003-cross-cutting-cleanup-pass/016-runtime-hook-plugin-testing/runners/run-all-runtime-hooks.ts` | Modified | Passes sandbox detection to adapters and prints aggregate verdict. |
| `003-cross-cutting-cleanup-pass/016-runtime-hook-plugin-testing/runners/test-claude-hooks.ts` | Modified | Emits direct-smoke and live-cli cells separately. |
| `003-cross-cutting-cleanup-pass/016-runtime-hook-plugin-testing/runners/test-codex-hooks.ts` | Modified | Emits direct-smoke and live-cli cells separately. |
| `003-cross-cutting-cleanup-pass/016-runtime-hook-plugin-testing/runners/test-gemini-hooks.ts` | Modified | Emits direct-smoke and live-cli cells separately. |
| `003-cross-cutting-cleanup-pass/016-runtime-hook-plugin-testing/runners/test-opencode-plugins.ts` | Modified | Emits direct-smoke and live-cli cells separately. |
| `003-cross-cutting-cleanup-pass/016-runtime-hook-plugin-testing/runners/test-copilot-hooks.ts` | Modified | Emits direct-smoke and live-cli cells separately. |
| `003-cross-cutting-cleanup-pass/016-runtime-hook-plugin-testing/runners/README.md` | Modified | Documents normal-shell live mode and sandbox partial mode. |
| `.opencode/skills/system-spec-kit/mcp_server/package.json` | Modified | Added `hook-tests` script using the local TypeScript loader. |
| `003-cross-cutting-cleanup-pass/016-runtime-hook-plugin-testing/findings.md` | Modified | Added corrected `BLOCKED_BY_TEST_SANDBOX` amendment while preserving original verdict. |
| `003-cross-cutting-cleanup-pass/017-hook-test-sandbox-fix/methodology-correction.md` (NEW) | Created | Documents root cause and operator path for canonical live-shell verdicts. |

### Follow-Ups

- Obtain canonical live CLI verdicts by running `hook-tests` from a normal operator shell outside any sandbox to confirm all five runtimes produce `PASS` live-cli cells.
