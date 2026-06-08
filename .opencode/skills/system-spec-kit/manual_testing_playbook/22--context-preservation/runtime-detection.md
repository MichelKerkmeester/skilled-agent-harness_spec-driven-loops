---
title: "253 -- Runtime detection outputs"
description: "This scenario validates Runtime detection for 253. It focuses on runtime + hookPolicy for all 3 runtimes."
audited_post_018: true
---

# 253 -- Runtime detection outputs

## 1. OVERVIEW

This scenario validates Runtime detection.

---

## 2. SCENARIO CONTRACT


- Objective: Verify that `detectRuntime()` correctly identifies all 3 supported runtimes (claude-code, codex-cli, copilot-cli) plus the unknown fallback from environment variables, and assigns the correct `hookPolicy` to each; Also verify the helper functions `areHooksAvailable()` and `getRecoveryApproach()` return correct values per runtime, with Copilot interpreted as file-based hook transport through custom instructions.
- Real user request: `` Please validate Runtime detection outputs against cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/runtime-detection.vitest.ts and tell me whether the expected signals are present: All vitest tests in `runtime-detection.vitest.ts` pass; Claude Code: `{ runtime: 'claude-code', hookPolicy: 'enabled' }` — `areHooksAvailable()` returns `true`, `getRecoveryApproach()` returns `'hooks'`; Codex CLI: `{ runtime: 'codex-cli', hookPolicy: 'live' }` when Codex is installed and repo `.codex/settings.json` is valid; `partial` when settings are missing/invalid; `unavailable` only when the Codex probe fails; Copilot CLI: `{ runtime: 'copilot-cli', hookPolicy: 'enabled' }` in this repo when `.github/hooks/*.json` exposes repo hook wiring; prompt-time context is expected in the managed custom-instructions block, not in hook stdout; `disabled_by_scope` when the repo hook config is absent; Unknown: `{ runtime: 'unknown', hookPolicy: 'unknown' }` — `areHooksAvailable()` returns `false`; Detection priority: claude-code checked first, then codex, copilot (first match wins). ``
- Prompt: `Validate runtime detection outputs with the runtime-detection vitest suite.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: All vitest tests in `runtime-detection.vitest.ts` pass; Claude Code: `{ runtime: 'claude-code', hookPolicy: 'enabled' }` — `areHooksAvailable()` returns `true`, `getRecoveryApproach()` returns `'hooks'`; Codex CLI: `{ runtime: 'codex-cli', hookPolicy: 'live' }` when Codex is installed and repo `.codex/settings.json` is valid; `partial` when settings are missing/invalid; `unavailable` only when the Codex probe fails; Copilot CLI: `{ runtime: 'copilot-cli', hookPolicy: 'enabled' }` in this repo when `.github/hooks/*.json` exposes repo hook wiring; prompt-time context is expected in the managed custom-instructions block, not in hook stdout; `disabled_by_scope` when the repo hook config is absent; Unknown: `{ runtime: 'unknown', hookPolicy: 'unknown' }` — `areHooksAvailable()` returns `false`; Detection priority: claude-code checked first, then codex, copilot (first match wins)
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: All 4 runtime/hookPolicy combinations correct, helper functions return expected values, detection priority respected, and Copilot enabled policy is documented as custom-instructions transport rather than prompt-output injection; FAIL: Any runtime misidentified, hookPolicy wrong, or detection order incorrect (e.g., codex env vars matching claude-code)

---

## 3. TEST EXECUTION

### Prompt

```
As a context-and-code-graph validation operator, validate Claude Code detected with hookPolicy=enabled and hooks available against cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/runtime-detection.vitest.ts. Verify cLAUDE_CODE=1 yields { runtime: 'claude-code', hookPolicy: 'enabled' }, areHooksAvailable() returns true, getRecoveryApproach() returns 'hooks'. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/runtime-detection.vitest.ts

### Expected

`CLAUDE_CODE=1` yields `{ runtime: 'claude-code', hookPolicy: 'enabled' }`, `areHooksAvailable()` returns true, `getRecoveryApproach()` returns 'hooks'

### Evidence

Test output showing detection and helper results

### Pass / Fail

- **Pass**: claude-code identified with enabled hooks
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check env var checks: CLAUDE_CODE, CLAUDE_SESSION_ID, MCP_SERVER_NAME

---

### Prompt

```
As a context-and-code-graph validation operator, validate All 3 runtimes produce correct hookPolicy values against cd .opencode/skills/system-spec-kit/mcp_server && TMPDIR=/Users/michelkerkmeester/.tmp/vitest-tmp npx vitest run tests/runtime-detection.vitest.ts tests/cross-runtime-fallback.vitest.ts. Verify claude-code=enabled, codex-cli=live or partial based on local Codex/settings availability, copilot-cli=enabled in this repo plus disabled_by_scope in the no-hook temp repo. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skills/system-spec-kit/mcp_server && TMPDIR=/Users/michelkerkmeester/.tmp/vitest-tmp npx vitest run tests/runtime-detection.vitest.ts tests/cross-runtime-fallback.vitest.ts

### Expected

claude-code=enabled, codex-cli=live/partial according to local Codex/settings availability, copilot-cli=enabled in this repo plus disabled_by_scope in the no-hook temp repo

### Evidence

Test output showing all hookPolicy values

### Pass / Fail

- **Pass**: all runtime branches match the current repo/config rules
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Verify `HookPolicy` type union covers all values

---

### Prompt

```
As a context-and-code-graph validation operator, validate Unknown runtime fallback when no env vars match against cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/runtime-detection.vitest.ts. Verify no matching env vars yields { runtime: 'unknown', hookPolicy: 'unknown' }. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/runtime-detection.vitest.ts

### Expected

No matching env vars yields `{ runtime: 'unknown', hookPolicy: 'unknown' }`

### Evidence

Test output showing unknown detection

### Pass / Fail

- **Pass**: clean environment returns unknown/unknown
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Ensure test clears all runtime-related env vars before assertion

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation/runtime-detection.md](../../feature_catalog/22--context-preservation/runtime-detection.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 253
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation/runtime-detection.md`
