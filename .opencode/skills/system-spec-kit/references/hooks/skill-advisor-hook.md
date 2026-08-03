---
title: Skill Advisor Hook Reference
description: Operator contract for the maintained Skill Advisor adapters across Claude, Codex, Cursor, Devin, and the OpenCode plugin bridge.
trigger_phrases:
  - "skill advisor hook reference"
  - "native-first advisor hooks"
  - "advisor hook runtime matrix"
  - "opencode plugin bridge"
  - "advisor hook smoke tests"
importance_tier: important
contextType: implementation
version: 3.6.0.31
---

# Skill Advisor Hook Reference

This reference describes the current prompt-time Skill Advisor integrations. The maintained source adapters live in `.opencode/skills/system-spec-kit/mcp-server/hooks/`; OpenCode is integrated through the plugin bridge under `system-skill-advisor`.

Paths beginning with `mcp-server/` in the package-local tables resolve from `.opencode/skills/system-spec-kit/`; paths beginning with `.opencode/` are repository-root relative.

---

## 1. OVERVIEW

### Purpose

Define the prompt-time Skill Advisor contract across the four registered source-adapter runtimes and the OpenCode plugin bridge.

### When to Use

Load this reference when wiring runtime hooks, smoke-testing advisor output, checking threshold behavior, or diagnosing freshness and fail-open states.

### Core Principle

Hooks surface prompt-safe routing context. They do not replace explicit skill loading, persist raw prompt text, or block the user prompt on advisor failures.

---

## 2. RUNTIME MATRIX

| Runtime | Source Hook | Compiled Hook | Registration | Output |
| --- | --- | --- | --- | --- |
| Claude Code | `mcp-server/hooks/claude/user-prompt-submit.ts` | `mcp-server/dist/hooks/claude/user-prompt-submit.js` | `.claude/settings.json` | `hookSpecificOutput.additionalContext` |
| Codex | `mcp-server/hooks/codex/user-prompt-submit.ts` | `mcp-server/dist/hooks/codex/user-prompt-submit.js` | `.codex/hooks.json` | `hookSpecificOutput.additionalContext` |
| Cursor | `mcp-server/hooks/cursor/user-prompt-submit.ts` | `mcp-server/dist/hooks/cursor/user-prompt-submit.js` | `.cursor/hooks.json` | `hookSpecificOutput.additionalContext` |
| Devin | `mcp-server/hooks/devin/user-prompt-submit.ts` | `mcp-server/dist/hooks/devin/user-prompt-submit.js` | `.devin/hooks.v1.json` | `hookSpecificOutput.additionalContext` |
| OpenCode | `.opencode/plugins/mk-skill-advisor.js` + `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs` | `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs` | OpenCode plugin discovery | `experimental.chat.system.transform` |

OpenCode has no source-hook adapter in this repository. Its prompt-time integration is the plugin bridge, which uses the maintained advisor package and a warm-only CLI fallback.

---

## 3. BUILD AND SMOKE TESTS

Build both maintained packages:

```bash
npm --prefix .opencode/skills/system-spec-kit/mcp-server run build
npm --prefix .opencode/skills/system-skill-advisor/mcp-server run build
```

Every native smoke command below targets an existing compiled file:

```bash
printf '%s' '{"prompt":"update documentation with DQI checks","cwd":"'"$PWD"'"}' | \
  node .opencode/skills/system-spec-kit/mcp-server/dist/hooks/claude/user-prompt-submit.js

printf '%s' '{"prompt":"update documentation with DQI checks","cwd":"'"$PWD"'"}' | \
  node .opencode/skills/system-spec-kit/mcp-server/dist/hooks/codex/user-prompt-submit.js

printf '%s' '{"prompt":"update documentation with DQI checks","cwd":"'"$PWD"'"}' | \
  node .opencode/skills/system-spec-kit/mcp-server/dist/hooks/cursor/user-prompt-submit.js

printf '%s' '{"prompt":"update documentation with DQI checks","cwd":"'"$PWD"'"}' | \
  node .opencode/skills/system-spec-kit/mcp-server/dist/hooks/devin/user-prompt-submit.js
```

Expected: `{}` or `hookSpecificOutput.additionalContext` beginning with `Advisor:`.

OpenCode uses the maintained bridge entrypoint:

```bash
printf '%s' '{"prompt":"save this conversation context to memory","workspaceRoot":"'"$PWD"'","runtime":"opencode","maxTokens":80,"thresholdConfidence":0.8}' | \
  node .opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs
```

---

## 4. SHARED BEHAVIOR

All adapters:

- fail open with `{}` or no context when parsing, status, scoring, or rendering fails
- honor `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1`
- avoid persisting raw prompts in diagnostics, cache metadata, status, or attribution
- use freshness states `live`, `stale`, `absent`, and `unavailable`
- use status values `ok`, `skipped`, `degraded`, and `fail_open`
- use `0.8 / 0.35` as the default prompt-time confidence/uncertainty pair unless overridden

---

## 5. RUNTIME LIFECYCLE

The native adapters are registered per runtime and compiled from the same source tree:

| Runtime | Prompt | Session start | Compaction | Stop |
| --- | --- | --- | --- | --- |
| Claude | `dist/hooks/claude/user-prompt-submit.js` | `dist/hooks/claude/session-prime.js` | `dist/hooks/claude/compact-inject.js` | `dist/hooks/claude/session-stop.js` |
| Codex | `dist/hooks/codex/user-prompt-submit.js` | `dist/hooks/codex/session-start.js` | `dist/hooks/codex/compact-inject.js` | `dist/hooks/codex/session-stop.js` |
| Cursor | `dist/hooks/cursor/user-prompt-submit.js` | `dist/hooks/cursor/session-start.js` | `dist/hooks/cursor/precompact.js` | `dist/hooks/cursor/session-end.js` |
| Devin | `dist/hooks/devin/user-prompt-submit.js` | `dist/hooks/devin/session-start.js` | runtime-specific lifecycle path | `dist/hooks/devin/session-stop.js` |

OpenCode prompt-time delivery remains the plugin bridge. It is not represented as a source or compiled hook under `system-spec-kit/mcp-server/hooks/`.

---

## 6. CONTROL FLAGS

| Control | Applies To | Behavior |
| --- | --- | --- |
| `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` | Native adapters, plugin bridge, and Python shim | Disables prompt-time advisor work and returns empty/skipped prompt-safe output. |
| `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1` | Python shim and bridge diagnostics | Forces local Python fallback where supported. |
| `--force-native` | Python shim | Requires native `advisor_recommend`; exits nonzero if unavailable. |
| `--force-local` | Python shim | Bypasses native routing and uses local Python scoring. |
| `--threshold` | Python shim | Sets confidence threshold; default is `0.8`. |
| `--stdin` | Python shim | Reads one prompt from stdin. |

---

## 7. OPERATOR STATES

| State | Meaning | Operator Action |
| --- | --- | --- |
| `live` | Current graph generation is trusted. | No action. |
| `stale` | Sources are newer than graph state. | Use scored recommendations with a caveat, then rebuild. |
| `absent` | Required graph state is missing. | Rebuild; empty recommendations are expected until repaired. |
| `unavailable` | Status cannot be read. | Inspect daemon logs and use a supported fallback. |

---

## 8. INSTALLATION DRIFT CHECK

Run the project-scoped check from a linked worktree with the required worktree flag:

```bash
node .opencode/bin/install-codex-hooks.mjs --check --allow-worktree
```

This check compares the repository's maintained Codex registration and adapter paths. A report about the user-global installation is workstation state, not a repository defect: this packet documents the check and the distinction but does not repair user-global files. Any user-global repair is a separate operator action.

---

## 9. TIMEOUT OWNERSHIP

`SPECKIT_OPENCODE_HOOK_TIMEOUT_MS` is owned by the `system-skill-advisor` hub because its live consumers are `mcp-server/lib/subprocess.ts`, `mcp-server/lib/skill-advisor-brief.ts`, `mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`, and `mcp-server/scripts/skill_advisor.py`. The default is `3000` ms; on timeout, the OpenCode bridge serves prompt-safe stale context with a timeout marker. The sibling environment reference points here for the ownership contract.

---

## 10. VALIDATION

```bash
npm --prefix .opencode/skills/system-spec-kit/mcp-server run typecheck
npm --prefix .opencode/skills/system-skill-advisor/mcp-server test -- --reporter=default
```
