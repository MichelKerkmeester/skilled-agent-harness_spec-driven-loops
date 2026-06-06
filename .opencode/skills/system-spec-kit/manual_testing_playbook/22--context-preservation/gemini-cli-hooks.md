---
title: "289 -- Gemini CLI hooks"
description: "Validates the Gemini-native lifecycle hooks: session priming, compact injection, compact caching, and session stop tracking."
audited_post_018: true
---

# 289 -- Gemini CLI hooks

## 1. OVERVIEW

This scenario validates the four Gemini lifecycle hooks that mirror the Claude hook surface. It exercises session priming on SessionStart, compact injection on BeforeAgent, compact cache on PreCompress, session stop on SessionEnd/AfterAgent, and the shared Gemini stdin/stdout parsing.

---

## 2. SCENARIO CONTRACT

- Objective: Verify each Gemini hook script accepts the documented event payload, returns the correct hookSpecificOutput, and reuses the shared Claude core utilities.
- Real user request: `Please validate the Gemini CLI hooks: prove session-prime injects additionalContext, compact-inject fires after PreCompress caching, compact-cache caches the context before compression, and session-stop tracks tokens.`
- Prompt: `Validate Gemini CLI hooks lifecycle: SessionStart priming, BeforeAgent injection, PreCompress caching, SessionEnd stop tracking.`
- Expected execution process: Run each hook script directly with a stubbed Gemini event payload and assert the returned hookSpecificOutput shape.
- Expected signals: session-prime returns additionalContext on startup/resume/clear sources; compact-inject returns a one-shot compact payload after PreCompress; compact-cache writes the compressed context to the expected cache location; session-stop records token-tracking state; shared.ts parses Gemini stdin format and serializes the response correctly.
- Desired user-visible outcome: Pass/fail verdict with cited hook output per script.
- Pass/fail: PASS when each hook script returns the documented output shape and the shared parser handles Gemini's input/output contract. FAIL when any hook returns wrong shape or shared parsing rejects valid Gemini payloads.

---

## 3. TEST EXECUTION

### Prompt

```
Validate Gemini CLI hooks lifecycle: SessionStart priming, BeforeAgent injection, PreCompress caching, SessionEnd stop tracking.
```

### Commands

1. Pipe a stubbed SessionStart payload into `mcp_server/hooks/gemini/session-prime.ts`. Inspect the JSON returned on stdout. Assert it contains `hookSpecificOutput.additionalContext`.
2. Pipe a stubbed BeforeAgent payload into `mcp_server/hooks/gemini/compact-inject.ts`. Assert the response contains a one-shot compact context payload.
3. Pipe a stubbed PreCompress payload into `mcp_server/hooks/gemini/compact-cache.ts`. Assert the cache file is written and the response acknowledges the cache.
4. Pipe a stubbed SessionEnd payload into `mcp_server/hooks/gemini/session-stop.ts`. Assert token-tracking state is recorded.
5. Run a malformed payload through each hook. Assert each rejects the payload with a structured error rather than crashing.
6. Confirm `mcp_server/hooks/gemini/shared.ts` reuses `mcp_server/hooks/claude/shared.ts` core utilities by grepping the imports.

### Expected

- Each hook returns the documented output shape on a valid payload.
- Malformed payloads return structured errors.
- Gemini shared parser reuses Claude shared core utilities.

### Evidence

- Four hook outputs from valid stubbed payloads
- Four error responses from malformed payloads
- Import grep showing Claude shared reuse

### Pass / Fail

- **Pass**: documented shapes returned, errors structured, shared utilities reused.
- **Fail**: wrong shapes, hooks crash on malformed input, or shared utilities not reused.

### Failure Triage

Inspect `mcp_server/hooks/gemini/session-prime.ts` and sibling scripts for the SessionStart/BeforeAgent/PreCompress/SessionEnd handlers. Verify `mcp_server/hooks/gemini/shared.ts` for `GeminiHookInput` parsing and `GeminiHookOutput` serialization. Check that `mcp_server/hooks/claude/shared.ts` is imported, not duplicated.

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation/gemini-cli-hooks.md](../../feature_catalog/22--context-preservation/gemini-cli-hooks.md)
- Source: `.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts`, `.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts`, `.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts`, `.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts`, `.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/shared.ts`

---

## 5. SOURCE METADATA

- Group: Context preservation
- Playbook ID: 289
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation/gemini-cli-hooks.md`
