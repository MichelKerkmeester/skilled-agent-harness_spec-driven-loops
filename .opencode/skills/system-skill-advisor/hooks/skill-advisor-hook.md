---
title: Skill Advisor Hook Reference
description: Operator contract for the maintained Skill Advisor adapters across Claude, Codex, Cursor, Devin, Pi, and the OpenCode plugin bridge. Surfaces a prompt-safe routing brief on each user prompt; advisory only and fail-open.
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

---

## 1. OVERVIEW

The Skill Advisor concern surfaces prompt-safe routing context at the moment a user submits a prompt: it scores the prompt against the maintained skill graph and, when a match clears the confidence threshold, injects a brief recommending the matching skill(s). The brief is advisory — it never replaces explicit skill loading, never persists raw prompt text, and never blocks the prompt on an advisor failure.

The maintained advisor implementation lives in `system-skill-advisor/mcp-server/`. The four editor runtimes (Claude, Codex, Cursor, Devin) each carry a thin `user-prompt-submit` shim in `system-spec-kit/mcp-server/hooks/<runtime>/` that resolves and spawns the compiled advisor in `system-skill-advisor`; the real brief-building, scoring, freshness, and rendering logic lives in the advisor package. Pi carries a native TypeScript extension that imports the same advisor module in-process (Pi awaits input handlers before agent processing, so the old two-process blocking-spawn bridge stalled every send). OpenCode integrates through a plugin bridge under `system-skill-advisor` that uses the maintained advisor package and a warm-only CLI fallback.

The single most important property is that it **fails open**. A parsing failure, a missing graph, a scoring error, a render failure, a timeout, or any internal error resolves to `{}` (native) or no context (OpenCode) — the prompt proceeds untouched. Every adapter honors the `skill-advisor` kill-switch, default-on.

Paths beginning with `mcp-server/` in the package-local tables resolve from `.opencode/skills/system-spec-kit/` (for the shims) or `.opencode/skills/system-skill-advisor/` (for the advisor); paths beginning with `.opencode/` are repository-root relative.

---

## 2. WHAT IT DOES

On each user-prompt event the adapter:

1. **Kill-switch.** Checks `isHookEnabled('skill-advisor')` (master `SYSTEM_HOOKS_DISABLED` or the `skill-advisor` family). Disabled → empty/skipped prompt-safe output.
2. **Read the prompt + workspace.** Resolves the workspace root (install-anchored walk, not CWD-relative, so the hook stays correct off-root), reads the prompt text (bounded), and resolves the session id.
3. **Build the brief.** `buildSkillAdvisorBrief` scores the prompt against the skill graph, checks freshness (`live` / `stale` / `absent` / `unavailable`), and returns an `AdvisorHookResult` with status `ok` / `skipped` / `degraded` / `fail_open`. Default confidence/uncertainty pair is `0.8 / 0.35` unless overridden.
4. **CLI fallback.** When the native advisor is unavailable, `shouldTrySkillAdvisorCliFallback` may invoke the Python shim (`skill_advisor.py`) as a warm-only fallback.
5. **Render.** `renderAdvisorBrief` produces the model-visible `Advisor:` text; `renderAdvisorFallbackDirective` produces the degraded-mode directive. Raw prompt text is never persisted in diagnostics, cache metadata, status, or attribution.
6. **Directive-lifecycle dedup.** `decideDirectiveLifecycleDelivery` suppresses a re-delivery of the same directive to the same session within its cadence, so a repeated prompt does not re-inject an identical brief.
7. **Emit.** Native adapters emit a `hookSpecificOutput.additionalContext` JSON envelope; OpenCode appends to `output.system` via `experimental.chat.system.transform`; Pi sends a model-visible message.

The injected brief begins with `Advisor:` and names the recommended skill(s) with their confidence. A degraded or fail-open result emits `{}` (native) or nothing (OpenCode).

---

## 3. PER-RUNTIME DELIVERY

Every runtime evaluates the **same** maintained advisor package (`buildSkillAdvisorBrief` + `renderAdvisorBrief`). What differs is the prompt event each runtime fires, how the adapter reaches the advisor (subprocess shim vs in-process import vs plugin bridge), and the channel the brief is handed back through.

| Runtime | Adapter | Event / wiring | Payload difference it handles | Delivery |
|---|---|---|---|---|
| **Claude** | `system-spec-kit/.../hooks/claude/user-prompt-submit.ts` (shim) → `system-skill-advisor/.../dist/hooks/claude/user-prompt-submit.js` | `UserPromptSubmit` in `.claude/settings.json`, matcher `""`, timeout 3s | Shim resolves the advisor target by walking up to the `.opencode` ancestor (install-anchored, not CWD-relative); bounded stdin (1 MiB), bounded child stdio, 2.5s child timeout, `SIGKILL` on timeout | `hookSpecificOutput.additionalContext` JSON on stdout; `{}` on any failure |
| **Codex** | `system-spec-kit/.../hooks/codex/user-prompt-submit.ts` (shim) → `.../dist/hooks/codex/user-prompt-submit.js` | `UserPromptSubmit` in `.codex/hooks.json`, timeout 3s | Same shim dispatch; `cd "${CODEX_PROJECT_DIR:-$PWD}"`; fallback `printf` envelope on resolution failure | Same `additionalContext` JSON |
| **Cursor** | `system-spec-kit/.../hooks/cursor/user-prompt-submit.ts` (shim) → `.../dist/hooks/cursor/user-prompt-submit.js` | `beforeSubmitPrompt` in `.cursor/hooks.json`, timeout 10s | Same shim dispatch | Same `additionalContext` JSON |
| **Devin** | `system-spec-kit/.../hooks/devin/user-prompt-submit.ts` (shim) → `.../dist/hooks/devin/user-prompt-submit.js` | `UserPromptSubmit` in `.devin/hooks.v1.json`, matcher `""`, timeout 10s | Same shim dispatch; `cd "${DEVIN_PROJECT_DIR:-$PWD}"`; fallback `printf` envelope | Same `additionalContext` JSON |
| **Pi** | `system-skill-advisor/hooks/pi/prompt-advisor.ts` (real file; `.pi/extensions/` symlinks here) | `user_input` / prompt event via `.pi/extensions/` | Imports the advisor module **in-process** (not a subprocess) — Pi awaits input handlers before agent processing, so the old blocking-spawn bridge stalled every send; in-process calls remove the stall and let the module-level prompt cache work. Captures raw user text (bounded 32 KiB, 64-session LRU) | Model-visible message; delivery-state machine suppresses same-session re-delivery |
| **OpenCode** | `.opencode/plugins/system-skill-advisor.js` + `system-skill-advisor/.../plugin-bridges/system-skill-advisor-bridge.mjs` | Plugin, loaded by OpenCode's flat glob over `.opencode/plugins/`. `experimental.chat.system.transform` per prompt; `event` for session lifecycle; `tool` for status | Spawns the bridge subprocess (bounded timeout, stdout cap 256 KiB, grace termination); TTL+LRU prompt cache with in-flight dedup; transform-dedup integration | Brief appended to `output.system`; `spec_kit_skill_advisor_status` tool returns a key=value report (no raw path leakage) |

OpenCode has no source-hook adapter in `system-spec-kit`. Its prompt-time integration is the plugin bridge, which uses the maintained advisor package and a warm-only CLI fallback. The hooks-tree index at `.opencode/hooks/skill-advisor/` mirrors the per-runtime shims and the OpenCode plugin via relative symlinks; this README is the symlink target.

---

## 4. DIRECTORY TREE

```text
system-skill-advisor/hooks/
+-- skill-advisor-hook.md            # this reference (symlinked from .opencode/hooks/skill-advisor/README.md)
+-- skill-advisor-hook-validation.md # validation/audit detail
+-- claude/
|   +-- README.md
|   +-- directive-lifecycle-boundary.ts
|   `-- user-prompt-submit.ts         # real advisor handler (Claude shape)
+-- pi/
|   +-- README.md
|   `-- prompt-advisor.ts             # real Pi extension (.pi/extensions/ symlinks here)
`-- lib/
    +-- README.md
    +-- directive-lifecycle.ts, directive-lifecycle-contract.ts, directive-lifecycle-file-store.ts
    +-- directive-lifecycle-store.py, directive-lifecycle-vectors.json
    `-- skill-advisor-cli-fallback.ts

system-spec-kit/mcp-server/hooks/<runtime>/user-prompt-submit.{ts,js}  # thin shims (claude/codex/cursor/devin)
system-skill-advisor/mcp-server/
+-- dist/hooks/<runtime>/user-prompt-submit.js   # compiled advisor the shims spawn
+-- plugin-bridges/system-skill-advisor-bridge.mjs  # OpenCode bridge subprocess
+-- lib/skill-advisor-brief.ts, render.ts, metrics.ts, subprocess.ts
`-- scripts/skill_advisor.py                      # Python shim (warm-only fallback)
.opencode/plugins/system-skill-advisor.js         # OpenCode plugin
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `system-skill-advisor/hooks/claude/user-prompt-submit.ts` | The real advisor handler (Claude shape). Builds the brief, runs the CLI fallback, renders, applies directive-lifecycle dedup, emits the `additionalContext` envelope, persists a diagnostic record. The codex/cursor/devin siblings share the same advisor core over their runtime's payload shape. |
| `system-spec-kit/.../hooks/<runtime>/user-prompt-submit.ts` | Thin process-boundary shims. Resolve the advisor target by walking up to the `.opencode` ancestor, spawn the compiled advisor with bounded stdin/stdio/timeout, and relay its stdout (or `{}` on any failure). |
| `system-skill-advisor/hooks/pi/prompt-advisor.ts` | Native Pi extension. Imports the advisor module in-process, captures raw user text (bounded LRU), runs a delivery-state machine that suppresses same-session re-delivery, and sends the brief as a model-visible message. |
| `.opencode/plugins/system-skill-advisor.js` | OpenCode plugin. `experimental.chat.system.transform` spawns the bridge and appends the brief to `output.system`; `event` manages session lifecycle and cache invalidation; `tool: spec_kit_skill_advisor_status` returns a sanitized status report. TTL+LRU prompt cache with in-flight dedup and transform-dedup integration. |
| `system-skill-advisor/mcp-server/plugin-bridges/system-skill-advisor-bridge.mjs` | The warm bridge subprocess the OpenCode plugin spawns. Receives a JSON request on stdin, runs the advisor, returns the brief on stdout. |
| `system-skill-advisor/mcp-server/lib/skill-advisor-brief.ts` | The brief builder: scoring, freshness, status, confidence/uncertainty. |
| `system-skill-advisor/mcp-server/lib/render.ts` | `renderAdvisorBrief` / `renderAdvisorFallbackDirective` — produces the model-visible text. |
| `system-skill-advisor/hooks/lib/directive-lifecycle.ts` | Directive-lifecycle dedup: decides whether a directive should be re-delivered to a session within its cadence. |
| `system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts` | `buildSkillAdvisorBriefFromCli` / `shouldTrySkillAdvisorCliFallback` — warm-only Python-shim fallback. |
| `system-skill-advisor/mcp-server/scripts/skill_advisor.py` | Python shim for the CLI fallback and the standalone advisor CLI. |

---

## 6. CONFIGURATION

The advisor is enabled by default. Truthy disable values are `1`, `true`, `yes`, and `on` (case-insensitive) for the shared resolver.

| Variable | Effect |
|---|---|
| `SYSTEM_SKILL_ADVISOR_DISABLED=1` | Canonical kill-switch. Every adapter checks `isHookEnabled('skill-advisor')` and returns empty/skipped prompt-safe output. |
| `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED=1` | Alias. Disables the native adapters and the Python shim. |
| `SYSTEM_SKILL_ADVISOR_PLUGIN_DISABLED=1` | Alias. Disables the OpenCode plugin. |
| `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` | Legacy alias for the native adapters. |
| `SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED=1` | Legacy alias for the OpenCode plugin. |
| `SYSTEM_HOOKS_DISABLED=1` | Master switch that disables this concern along with every other repo hook. |

Additional controls: `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1` (force local Python fallback where supported); `--force-native` / `--force-local` / `--threshold` / `--stdin` (Python shim flags; default threshold `0.8`). `SPECKIT_OPENCODE_HOOK_TIMEOUT_MS` (default 3000) is owned by the `system-skill-advisor` hub — its live consumers are `mcp-server/lib/subprocess.ts`, `skill-advisor-brief.ts`, the OpenCode bridge, and `skill_advisor.py`; on timeout the OpenCode bridge serves prompt-safe stale context with a timeout marker. OpenCode tuning: `SYSTEM_SKILL_ADVISOR_CACHE_TTL_MS` (default 5 min), `SYSTEM_SKILL_ADVISOR_MAX_TOKENS` (default 80), `SYSTEM_SKILL_ADVISOR_MAX_BRIEF_CHARS` (default 2 KiB), `SYSTEM_SKILL_ADVISOR_MAX_PROMPT_BYTES` (default 64 KiB), `SYSTEM_SKILL_ADVISOR_COMPILED_ROUTE_BOUNDING` (compiled-route summary bounding).

Set a flag inline for one command, export it for a session, or persist it in `.opencode/hooks/hook-flags.env` (copied from `hook-flags.env.example`, gitignored). The environment always wins over the file, so a persisted default can be overridden for a single session.

---

## 7. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Advisory only | Hooks surface prompt-safe routing context. They do not replace explicit skill loading, persist raw prompt text, or block the user prompt on advisor failures. |
| Fail-open | All adapters fail open with `{}` or no context when parsing, status, scoring, rendering, or subprocess work fails. The shims return `{}` on `TARGET_UNRESOLVED`, `CHILD_TIMEOUT`, `NONZERO_EXIT`, `EMPTY_OUTPUT`, `INVALID_JSON`, `INPUT_OVERFLOW`, and `SPAWN_ERROR`. |
| Freshness | Freshness states `live`, `stale`, `absent`, `unavailable`; status values `ok`, `skipped`, `degraded`, `fail_open`. Default confidence/uncertainty `0.8 / 0.35` unless overridden. |
| Privacy | Raw prompt text is never persisted in diagnostics, cache metadata, status, or attribution. The OpenCode status tool sanitizes paths (`[configured-node]`, `[skill-advisor-bridge]`). |
| Dedup | Directive-lifecycle dedup suppresses re-delivery of the same directive to the same session within its cadence. OpenCode adds transform-dedup across co-resident transforms. |
| Bounded | Shims bound stdin (1 MiB), child stdio (1 MiB), child timeout (2.5s), and `SIGKILL` on timeout. OpenCode bounds bridge stdout (256 KiB) and uses grace termination. Pi bounds captured user text (32 KiB, 64-session LRU). |
| Output | Native adapters emit one `additionalContext` JSON on stdout. OpenCode appends to `output.system`. Pi sends a model-visible message. No adapter writes to the TUI prompt line. |
| Imports | Shims import Node builtins only and spawn the advisor by absolute path. The advisor core imports its `mcp-server/lib/*` siblings and the shared `hook-flags` resolver. Nothing outside the repo. |

### Operator freshness states

| State | Meaning | Operator Action |
| --- | --- | --- |
| `live` | Current graph generation is trusted. | No action. |
| `stale` | Sources are newer than graph state. | Use scored recommendations with a caveat, then rebuild. |
| `absent` | Required graph state is missing. | Rebuild; empty recommendations are expected until repaired. |
| `unavailable` | Status cannot be read. | Inspect daemon logs and use a supported fallback. |

---

## 8. VALIDATION

Build both maintained packages:

```bash
npm --prefix .opencode/skills/system-spec-kit/mcp-server run build
npm --prefix .opencode/skills/system-skill-advisor/mcp-server run build
```

Expected result: both builds succeed and `dist/hooks/<runtime>/user-prompt-submit.js` are produced.

```bash
npm --prefix .opencode/skills/system-spec-kit/mcp-server run typecheck
npm --prefix .opencode/skills/system-skill-advisor/mcp-server test -- --reporter=default
node --test .opencode/plugins/tests/system-skill-advisor.test.cjs
```

Expected result: no type errors; all advisor package tests pass; the OpenCode plugin test passes.

Native smoke tests (each targets an existing compiled file):

```bash
printf '%s' '{"prompt":"update documentation with DQI checks","cwd":"'"$PWD"'"}' | \
  node .opencode/skills/system-spec-kit/mcp-server/dist/hooks/claude/user-prompt-submit.js
```

Expected: `{}` or `hookSpecificOutput.additionalContext` beginning with `Advisor:`. Repeat for the `codex`, `cursor`, and `devin` siblings.

OpenCode bridge smoke test:

```bash
printf '%s' '{"prompt":"save this conversation context to memory","workspaceRoot":"'"$PWD"'","runtime":"opencode","maxTokens":80,"thresholdConfidence":0.8}' | \
  node .opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/system-skill-advisor-bridge.mjs
```

Installation drift check (from a linked worktree with the required worktree flag):

```bash
node .opencode/bin/install-codex-hooks.mjs --check --allow-worktree
```

This compares the repository's maintained Codex registration and adapter paths. A report about the user-global installation is workstation state, not a repository defect.

---

## 9. RELATED

- [`skill-advisor-hook-validation.md`](skill-advisor-hook-validation.md): validation and audit detail for this concern.
- [`claude/README.md`](claude/README.md), [`pi/README.md`](pi/README.md), [`lib/README.md`](lib/README.md): per-surface detail.
- [`../../system-spec-kit/mcp-server/hooks/README.md`](../../system-spec-kit/mcp-server/hooks/README.md): the owning skill's hook contract (where the shims live).
- [`../../../hooks/README.md`](../../../hooks/README.md): the unified hooks tree with the kill-switch index and coverage matrix.
- [`../../../plugins/README.md`](../../../plugins/README.md): the OpenCode plugins folder that loads `system-skill-advisor.js`.
