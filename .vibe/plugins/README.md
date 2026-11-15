# Vibe Plugins and Hooks

---

## 1. OVERVIEW

This folder holds one bundle, `repo-guards/`, and no other plugin. That is deliberate. Mistral Vibe never imports or runs JavaScript plugins, so each of the 21 plugins in `.opencode/plugins/` reaches Vibe as a hook entry in `../hooks.toml`, as a command, or not at all.

Vibe reads every directory here as a plugin candidate and skips plain files. A symlinked OpenCode plugin would therefore be ignored or refused, and it would advertise a feature that never runs. The table in section 3 is the index instead: it names the hook entry that carries each plugin's job.

`../hooks.toml` declares 18 `[[hooks]]` entries. Thirteen run a script in `repo-guards/`. The other five run Vibe adapters in the hook library under `.skilled/hooks/<concern>/vibe/`. Every script calls the same shared core the other runtimes call, so a rule changes in one place.

---

## 2. DIRECTORY TREE

```text
plugins/
+-- README.md                       # this index
+-- repo-guards/
    +-- spec-gate-classify.mjs      # pre_agent: records an open spec gate
    +-- spec-gate.mjs               # pre_tool, strict: refuses a write while the gate is open
    +-- env-secret-guard.mjs        # pre_tool, strict
    +-- dispatch-preflight.mjs      # pre_tool, strict
    +-- overlay-guard.mjs           # pre_tool, strict
    +-- mcp-route-guard.mjs         # pre_tool, strict
    +-- git-message-gate.mjs        # pre_tool, strict
    +-- deep-loop-guard.mjs         # pre_tool, strict
    +-- post-edit-quality.mjs       # post_tool, strict
    +-- dist-freshness.mjs          # post_tool: two entries, after an edit and after a shell command
    +-- classifier-injection-screen.mjs  # post_tool on web_fetch and open_url
    +-- session-cleanup.mjs         # session_end
    +-- render-home-hooks.cjs       # writes hooks.toml into a dispatch's VIBE_HOME
    +-- lib/hook-io.mjs             # shared stdin and stdout handling
    +-- fixtures/                   # one fixture folder per guard
    +-- tests/                      # node --test suites for the bundle
```

---

## 3. PLUGIN MAP

Each row is one OpenCode plugin. The entry names are the `name` values in `../hooks.toml`.

| OpenCode plugin | Vibe entry | Event | Script |
| --- | --- | --- | --- |
| `system-spec-gate.js` | `spec-gate-classify`, `spec-gate` | `pre_agent`, `pre_tool` | `repo-guards/spec-gate-classify.mjs`, `repo-guards/spec-gate.mjs` |
| `env-secret-guard.js` | `env-secret-guard` | `pre_tool` | `repo-guards/env-secret-guard.mjs` |
| `cli-dispatch-audit.js` | `dispatch-preflight` | `pre_tool` | `repo-guards/dispatch-preflight.mjs` |
| `overlay-guard.js` | `overlay-guard` | `pre_tool` | `repo-guards/overlay-guard.mjs` |
| `mcp-route-guard.js` | `mcp-route-guard`, which refuses the call where OpenCode only logs it | `pre_tool` | `repo-guards/mcp-route-guard.mjs` |
| `sk-git-message-gate.js` | `git-message-gate` | `pre_tool` | `repo-guards/git-message-gate.mjs` |
| `system-deep-loop-guard.js` | `deep-loop-guard`, matched on `agents_spawn` | `pre_tool` | `repo-guards/deep-loop-guard.mjs` |
| `sk-code-post-edit-quality.js` | `post-edit-quality` | `post_tool` | `repo-guards/post-edit-quality.mjs` |
| `system-dist-freshness-guard.js` | `session-start`, `dist-freshness-edit`, `dist-freshness-shell` | `session_start`, `post_tool` | `session-lifecycle/vibe/session-start.mjs`, `repo-guards/dist-freshness.mjs` |
| `classifier-injection-screen.js` | `classifier-injection-screen` | `post_tool` | `repo-guards/classifier-injection-screen.mjs` |
| `opencode-goal.js` | `session-start`, which injects the bound packet's goal slice | `session_start` | `session-lifecycle/vibe/session-start.mjs` |
| `session-cleanup.js` | `session-start` for the startup guards, `session-cleanup-end` for the cleanup | `session_start`, `session_end` | `session-lifecycle/vibe/session-start.mjs`, `repo-guards/session-cleanup.mjs` |
| `system-skill-advisor.js` | `turn-start` | `pre_agent` | `session-lifecycle/vibe/turn-start.mjs` |
| `system-completion-sentinel.js` | `turn-end` records the gap, `turn-start` delivers it once | `post_agent`, `pre_agent` | `session-lifecycle/vibe/turn-end.mjs`, `session-lifecycle/vibe/turn-start.mjs` |
| `ask-surface-guard.js` | `turn-end`, which sends a prose option menu back once | `post_agent` | `session-lifecycle/vibe/turn-end.mjs` |
| `session-history-lookup.js` | `turn-start`, `compaction-post-tool` | `pre_agent`, `post_tool` | `session-lifecycle/vibe/turn-start.mjs`, `session-lifecycle/vibe/compaction-post-tool.mjs` |
| `decision-capture.js` | `decision-capture-ask`, plus the save nudge in `turn-start` | `post_tool`, `pre_agent` | `decision-capture/vibe/ask-capture-post-tool.mjs` |
| `in-session-handover.js` | No hook. Vibe has no idle or compaction event, so `skilled-loop vibe` and `/speckit:handoff` prepare the hop and the operator starts it | none | none |
| `codex-hooks-watchdog.js` | Not needed: it watches a Codex file a Vibe session never reads | none | none |
| `sk-git-preflight-advisory.js` | Not needed: sk-git's skill docs state the same rules | none | none |
| `system-speckit-completion.js` | Not needed: Vibe has no plugin tool registry, and the spec-kit CLI returns the same data | none | none |

Paths without `repo-guards/` sit under `.skilled/hooks/`. At save time, `node .skilled/hooks/decision-capture/bin/sweep-vibe.mjs` replays the session journal for any answer the live hook missed.

---

## 4. HOW THE HOOKS LOAD

The entries load only in a trusted checkout, the same as `../config.toml`. A dispatch that starts in a scratch folder gets them through its disposable `VIBE_HOME`: `repo-guards/render-home-hooks.cjs` copies `../hooks.toml` there with the checkout path filled in, at dispatch time. No rendered copy is committed, so none can drift.

A strict entry can refuse a tool call, and the refusal returns to the model as a tool error. The other entries add context and never block.

---

## 5. VALIDATION

Run these from the repository root.

```bash
node --test .vibe/plugins/repo-guards/tests/
node --test .skilled/hooks/session-lifecycle/vibe/*.test.mjs
```

Each prints `fail 0` when the hooks behave as documented.

---

## 6. RELATED

- [`../SYNC.md`](../SYNC.md): what in `.vibe/` is generated, derived or authored here
- [`guards-and-hooks.md`](../../.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md): the wire format and the reason behind each row above
- [`.opencode/plugins/README.md`](../../.opencode/plugins/README.md): the OpenCode plugins this table maps
