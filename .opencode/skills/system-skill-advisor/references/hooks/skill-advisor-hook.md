---
title: Skill Advisor Hook Reference
description: Operator contract for the native-first Skill Advisor adapters across Claude, Codex, Cursor, Devin, and the OpenCode plugin bridge.
trigger_phrases:
  - "skill advisor hook"
  - "user prompt submit hook"
  - "advisor hook fail-open"
  - "opencode plugin bridge"
  - "runtime adapter smoke test"
importance_tier: "important"
contextType: "implementation"
version: 0.8.0.33
---

# Skill Advisor Hook Reference

Operator contract for the maintained Skill Advisor adapters. The native source adapters live under `.opencode/skills/system-spec-kit/mcp-server/hooks/`; OpenCode uses the maintained plugin bridge, not a source-hook tree.

---

## 1. OVERVIEW

### Purpose

Define the prompt-time Skill Advisor contract across the four registered source-adapter runtimes and the OpenCode plugin bridge.

### When to Use

- Installing or debugging Claude, Codex, Cursor, Devin, or OpenCode advisor delivery.
- Checking hook fail-open, redaction, freshness, or build behavior.
- Verifying that a documented adapter path and smoke command resolve to a maintained file.

### Core Principle

Hooks surface compact advisor context; they do not replace skill loading, persist raw prompt text, or block the user prompt on advisor failures.

### Key Sources

- Source adapters: `.opencode/skills/system-spec-kit/mcp-server/hooks/{claude,codex,cursor,devin}/`
- Compiled adapters: `.opencode/skills/system-spec-kit/mcp-server/dist/hooks/{claude,codex,cursor,devin}/`
- OpenCode bridge: `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`

---

## 2. RUNTIME MATRIX

| Runtime | Source Hook | Compiled Smoke Target | Output Shape | Notes |
| --- | --- | --- | --- | --- |
| Claude Code | `.opencode/skills/system-spec-kit/mcp-server/hooks/claude/user-prompt-submit.ts` | `.opencode/skills/system-spec-kit/mcp-server/dist/hooks/claude/user-prompt-submit.js` | `hookSpecificOutput.additionalContext` | Reads `prompt` and `cwd`. |
| Codex | `.opencode/skills/system-spec-kit/mcp-server/hooks/codex/user-prompt-submit.ts` | `.opencode/skills/system-spec-kit/mcp-server/dist/hooks/codex/user-prompt-submit.js` | `hookSpecificOutput.additionalContext` | Registered in `.codex/hooks.json`. |
| Cursor | `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/user-prompt-submit.ts` | `.opencode/skills/system-spec-kit/mcp-server/dist/hooks/cursor/user-prompt-submit.js` | `hookSpecificOutput.additionalContext` | Registered in `.cursor/hooks.json`. |
| Devin | `.opencode/skills/system-spec-kit/mcp-server/hooks/devin/user-prompt-submit.ts` | `.opencode/skills/system-spec-kit/mcp-server/dist/hooks/devin/user-prompt-submit.js` | `hookSpecificOutput.additionalContext` | Registered in `.devin/hooks.v1.json`. |
| OpenCode | `.opencode/plugins/mk-skill-advisor.js` + `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs` | `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs` | `experimental.chat.system.transform` | Plugin bridge; there is no OpenCode source-hook adapter in this tree. |

The four source adapters share the native advisor contract. The OpenCode plugin bridge uses the same advisor renderer and a warm-only CLI fallback; exit `75` is retryable daemon unavailability and remains fail-open.

Build the maintained source and advisor packages before smoke testing:

```bash
npm --prefix .opencode/skills/system-spec-kit/mcp-server run build
npm --prefix .opencode/skills/system-skill-advisor/mcp-server run build
```

---

## 3. SHARED BEHAVIOR

All adapters:

- fail open with `{}` or no context when parsing, status, scoring, or rendering fails
- honor `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1`
- avoid persisting raw prompts in diagnostics, cache metadata, status, or attribution
- use the freshness vocabulary `live`, `stale`, `absent`, and `unavailable`
- use the status vocabulary `ok`, `skipped`, `degraded`, and `fail_open`
- render a compact `Advisor: ...` brief only when a route passes threshold
- use `0.8 / 0.35` as the default prompt-time confidence/uncertainty pair unless overridden

---

## 4. SETUP AND SMOKE TESTS

Each native smoke command targets a compiled file that exists after the system-spec-kit build:

```bash
printf '%s' '{"prompt":"help me commit my changes","cwd":"'"$PWD"'"}' | \
  node .opencode/skills/system-spec-kit/mcp-server/dist/hooks/claude/user-prompt-submit.js

printf '%s' '{"prompt":"help me commit my changes","cwd":"'"$PWD"'"}' | \
  node .opencode/skills/system-spec-kit/mcp-server/dist/hooks/codex/user-prompt-submit.js

printf '%s' '{"prompt":"help me commit my changes","cwd":"'"$PWD"'"}' | \
  node .opencode/skills/system-spec-kit/mcp-server/dist/hooks/cursor/user-prompt-submit.js

printf '%s' '{"prompt":"help me commit my changes","cwd":"'"$PWD"'"}' | \
  node .opencode/skills/system-spec-kit/mcp-server/dist/hooks/devin/user-prompt-submit.js
```

Expected: `{}` or `hookSpecificOutput.additionalContext` beginning with `Advisor:`.

The OpenCode plugin bridge is smoke-tested through its maintained bridge entrypoint:

```bash
printf '%s' '{"prompt":"save this conversation context to memory","workspaceRoot":"'"$PWD"'","runtime":"opencode","maxTokens":80,"thresholdConfidence":0.8}' | \
  node .opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs
```

Expected: `status: "ok"` with `metadata.workspaceRoot` matching the supplied repository root when native advisor state is available.

---

## 5. CONTROL FLAGS

| Control | Applies To | Behavior |
| --- | --- | --- |
| `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` | Native adapters, plugin bridge, and Python shim | Disables prompt-time advisor work and returns empty/skipped prompt-safe output. |
| `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1` | Python shim and bridge diagnostics | Forces local Python fallback where supported. |
| `--force-native` | Python shim | Requires native `advisor_recommend`; exits nonzero if unavailable. |
| `--force-local` | Python shim | Bypasses native routing and uses local Python scoring. |
| `--threshold` | Python shim | Sets confidence threshold; default is `0.8`. |
| `--stdin` | Python shim | Reads one prompt from stdin. |

---

## 6. OPERATOR STATES

Use `advisor_status` for prompt-safe state:

```text
advisor_status({"workspaceRoot":"/absolute/path/to/repo"})
```

| State | Meaning | Operator Action |
| --- | --- | --- |
| `live` | Current graph generation is trusted. | No action. |
| `stale` | Sources are newer than graph state. | Use scored recommendations with a caveat, then run `advisor_rebuild({})`. |
| `absent` | Required graph state is missing. | Run `advisor_rebuild({})`; empty recommendations are expected until repaired. |
| `unavailable` | Status cannot be read. | Inspect daemon logs and SQLite state, then use a supported fallback. |

---

## 7. PRIVACY AND DIAGNOSTICS

- Raw prompt text is never persisted in public status output.
- Prompt cache keys are HMAC/hash based.
- Diagnostics use runtime, status, freshness, duration, cache, skill label, generation, and normalized error codes.
- `includeAttribution` returns numeric lane contribution metadata only.

---

## 8. VALIDATION

```text
advisor_validate({"confirmHeavyRun":true,"workspaceRoot":"/absolute/path/to/repo","skillSlug":null})
```

Package checks:

```bash
npm --prefix .opencode/skills/system-spec-kit/mcp-server run typecheck
npm --prefix .opencode/skills/system-skill-advisor/mcp-server test -- --reporter=default
```

The dated validation policy and snapshot authority are maintained in [`../scoring/validation-baselines.md`](../scoring/validation-baselines.md).
