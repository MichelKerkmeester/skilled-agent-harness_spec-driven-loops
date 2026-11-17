---
title: 'Completion Evidence: Advisory for Completion Claims'
description: 'Checks completion claims against packet evidence and reports advisories in Claude, Codex, Cursor, Devin, DSH, OpenCode, Pi and Vibe.'
trigger_phrases:
  - 'completion evidence hook'
  - 'completion sentinel'
  - 'done claim evidence check'
  - 'claude completion evidence'
  - 'claude stop sentinel'
  - 'completion claim check'
  - 'codex completion evidence'
  - 'codex stop sentinel'
  - 'codex completion claim check'
  - 'cursor completion evidence'
  - 'cursor after agent response'
  - 'cursor completion claim check'
  - 'devin completion evidence'
  - 'devin stop sentinel'
  - 'devin completion claim check'
  - 'dsh completion evidence'
  - 'dsh turn stopping sentinel'
  - 'dsh completion claim check'
  - 'opencode completion sentinel'
  - 'opencode completion evidence'
  - 'system speckit completion tool'
  - 'pi completion evidence'
  - 'pi turn end sentinel'
  - 'pi completion claim check'
importance_tier: 'important'
contextType: 'reference'
---

# Completion Evidence: Advisory for Completion Claims

---

## 1. OVERVIEW

`.skilled/hooks/completion-evidence/` checks assistant replies for completion claims near the end. It evaluates packet evidence when an adapter resolves a spec folder. It returns advice for the runtime to deliver.

The sentinel adapters use `.skilled/skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs`. The concern key is `completion`, while this folder is named `completion-evidence`. Set `SYSTEM_COMPLETION_DISABLED=1` to turn it off. `SYSTEM_HOOKS_DISABLED=1` also disables this concern.

---

## 2. HOW IT WORKS

`detectCompletionClaim()` checks the last 160 characters after filtering code and structured checklist or table content. It also ignores assignment lines.

`evaluateCompletionEvidence()` checks `tasks.md` for `<!-- ANCHOR:protocol -->`. When it finds the marker, it runs `.skilled/skills/system-spec-kit/runtime/cli/spec/check-completion.sh` with `--json` and a default timeout of 1200 ms. An incomplete P0 or P1 item becomes an advisory. The core also advises on missing priority context, missing evidence or unmet acceptance criteria. Without the marker, it checks whether `implementation-summary.md` exists and advises when that file is missing.

Every advisory ends with a reminder to reread the request and confirm each outcome is met or named not done. The core stores the last fingerprint for each packet and suppresses a repeat of the same packet and reply.

The adapters call `appendAdvisoryLog()` to write a bounded line to `.skilled/logs/completion-sentinel-advisories.log`. Before each append, the core rotates the active log to `.1` once it has reached 256 KiB, the default threshold. `sweepStaleSentinelState()` prunes old dedup entries and temporary files. It also removes an aged rotated log. The three Stop adapters call the sweep. OpenCode calls it on `session.created`.

---

## 3. RUNTIME COVERAGE

| Runtime | Event | Entry in this folder | Real file | What the runtime shows |
|---|---|---|---|---|
| Claude | `Stop` | `claude/completion-evidence-stop.cjs` | `.skilled/skills/system-spec-kit/runtime/hooks/claude/completion-evidence-stop.cjs` | A `stderr` warning and an advisory log entry. |
| Codex | `Stop` | `codex/completion-evidence-stop.cjs` | `.skilled/skills/system-spec-kit/runtime/hooks/codex/completion-evidence-stop.cjs` | A `stderr` warning and an advisory log entry. |
| Cursor | `afterAgentResponse` | `cursor/completion-evidence-response.mjs` | `.skilled/skills/system-spec-kit/runtime/hooks/cursor/completion-evidence-response.mjs` | An advisory log entry. |
| Devin | `Stop` | `devin/completion-evidence-stop.cjs` | `.skilled/skills/system-spec-kit/runtime/hooks/devin/completion-evidence-stop.cjs` | A `stderr` warning and an advisory log entry. |
| OpenCode | `session.created` and `session.idle`. Tool: `system_speckit_completion` | `opencode/system-completion-sentinel.js` and `opencode/system-speckit-completion.js` | `.opencode/plugins/system-completion-sentinel.js` and `.opencode/plugins/system-speckit-completion.js` | The event plugin logs advice. The tool returns JSON. |
| Pi | `turn_end` | `pi/completion-evidence.ts` | `.skilled/skills/system-spec-kit/runtime/hooks/pi/completion-evidence.ts` | A model-visible notice arrives on the next turn. Human display is off. |
| DSH | `agent/turn-stopping` | `dsh/completion-evidence.mjs` | `.skilled/skills/system-spec-kit/runtime/hooks/dsh/completion-evidence.mjs` | An injected `[completion-evidence]` notice. |
| Vibe | `post_agent` through `turn-end` | `vibe/completion-evidence-post-agent.cjs` | `.skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs` | A pending advisory enters the model context on the next main turn. |

Claude registers its Stop hook in `.claude/settings.json`. Codex uses `.codex/hooks.json`. Cursor uses `.cursor/hooks.json` and Devin uses `.devin/hooks.v1.json`.

OpenCode loads both plugin files through its flat `.opencode/plugins/` glob. Pi re-exports the adapter from `.pi/extensions/completion-evidence.ts`. The DSH patch `.dsh/patches/guards.patch.yml` registers `.dsh/plugins/repo-guards/index.mjs`, whose entrypoint calls `registerCompletionEvidence()`.

Vibe registers the `turn-end` `post_agent` composer in `.vibe/hooks.toml`. The composer calls the completion adapter. Its `turn-start` composer delivers the saved advisory on the next main turn.

Pi queues a model-visible advisory for the next turn with `display: false` and `deliverAs: "nextTurn"`.

The completion path never blocks a turn. The three Stop adapters emit one `stderr` warning on advice and exit 0. Cursor writes one `stderr` line after a top-level error. DSH logs caught errors through `ctx.logger.warn` and injects nothing. The OpenCode event plugin swallows errors. Its tool returns JSON and marks failed sections `unavailable`. Pi swallows errors and returns. Vibe skips a failing completion part.

---

## 4. DIRECTORY TREE

```text
completion-evidence/
+-- README.md
+-- claude/
|   `-- completion-evidence-stop.cjs -> ../../../skills/system-spec-kit/runtime/hooks/claude/completion-evidence-stop.cjs
+-- codex/
|   `-- completion-evidence-stop.cjs -> ../../../skills/system-spec-kit/runtime/hooks/codex/completion-evidence-stop.cjs
+-- cursor/
|   `-- completion-evidence-response.mjs -> ../../../skills/system-spec-kit/runtime/hooks/cursor/completion-evidence-response.mjs
+-- devin/
|   `-- completion-evidence-stop.cjs -> ../../../skills/system-spec-kit/runtime/hooks/devin/completion-evidence-stop.cjs
+-- dsh/
|   `-- completion-evidence.mjs -> ../../../skills/system-spec-kit/runtime/hooks/dsh/completion-evidence.mjs
+-- opencode/
|   +-- system-completion-sentinel.js -> ../../../../.opencode/plugins/system-completion-sentinel.js
|   `-- system-speckit-completion.js -> ../../../../.opencode/plugins/system-speckit-completion.js
+-- pi/
|   `-- completion-evidence.ts -> ../../../skills/system-spec-kit/runtime/hooks/pi/completion-evidence.ts
+-- tests/
|   +-- README.md
|   `-- dsh-completion-evidence.test.mjs
`-- vibe/
    `-- completion-evidence-post-agent.cjs -> ../../../skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs
```

Each runtime directory has a link to its real adapter. The `tests/` directory holds the DSH parity suite.

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs` | Checks completion claims against packet evidence. |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/check-completion.sh` | Returns checklist status for the sentinel. |
| `.skilled/hooks/shared/hook-flags.cjs` | Resolves the concern switch and master switch. |
| `.dsh/plugins/repo-guards/index.mjs` | Registers the DSH adapter. |
| `.skilled/hooks/session-lifecycle/vibe/turn-end.mjs` and `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs` | Records and delivers Vibe advisories. |
| `.opencode/plugins/system-speckit-completion.js` | Exposes the read-only `system_speckit_completion` tool. |
| `.skilled/skills/system-spec-kit/runtime/tests/completion-evidence-sentinel.vitest.ts` | Tests the shared core and checks the Pi delivery wording. |

---

## 6. CONFIGURATION

The concern is on by default. Set a disable flag to `1`, `true`, `yes` or `on`, in any case. The resolver reads the environment first and the optional `.skilled/hooks/hook-flags.env` file second.

| Switch | Concern key | Effect |
|---|---|---|
| `SYSTEM_COMPLETION_DISABLED=1` | `completion` | Turns off the sentinel adapters and the OpenCode completion tool. |
| `SYSTEM_COMPLETION_SENTINEL_DISABLED=1` | `completion` alias | Also turns off the sentinel. |
| `SYSTEM_SPECKIT_COMPLETION_DISABLED=1` | `completion` alias | Also turns off the completion tool. |
| `SYSTEM_HOOKS_DISABLED=1` | Every concern using the shared resolver | Turns off this concern too. |

The environment value wins over the optional file value.

---

## 7. VALIDATION

Run from the repository root. The DSH parity suite checks the no-claim path and the adapter's fail-open error path.

```bash
node --test .skilled/hooks/completion-evidence/tests/dsh-completion-evidence.test.mjs
```

Expected result: two cases pass and zero fail.

The runtime-neutral suite also checks the claim detector, evidence decisions, deduplication and Pi delivery wording.

```bash
SYSTEM_COMPLETION_DISABLED=1 node .skilled/skills/system-spec-kit/runtime/hooks/claude/completion-evidence-stop.cjs < /dev/null
```

Expected result: no output and exit status 0.

---

## 8. RELATED

- [Hooks index](../README.md): the concern folders and runtime coverage.
- [Shared hook helpers](../shared/README.md): the switch resolver used by adapters.
- [Runtime hook README](../../skills/system-spec-kit/runtime/hooks/README.md): the skill-owned hook adapters.
- [OpenCode plugin index](../../../.opencode/plugins/README.md): how OpenCode loads plugin files.
- [DSH parity suite](tests/README.md): the adapter tests.

