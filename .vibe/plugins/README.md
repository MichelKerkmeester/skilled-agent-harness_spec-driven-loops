---
title: "Vibe Plugins: Repo Guards and Hook Map"
description: "The repo-guards bundle that runs this repository's Mistral Vibe hooks, and the map from each OpenCode plugin to the Vibe hook entry that does its job."
trigger_phrases:
  - "vibe plugins"
  - "vibe repo guards"
  - "vibe hook map"
  - "opencode plugin to vibe hook"
version: 1.1.0.0
---

# Vibe Plugins: Repo Guards and Hook Map

---

## 1. OVERVIEW

`.vibe/plugins/` holds one bundle, `repo-guards/`, and no other plugin. That is deliberate. Mistral Vibe never imports or runs JavaScript plugins. Each of the 21 plugins in `.opencode/plugins/` reaches Vibe as a hook entry in `.vibe/hooks.toml`, as a command, or not at all.

Vibe reads every directory here as a plugin candidate and skips plain files. A symlinked OpenCode plugin would be ignored or refused, and it would advertise a feature that never runs. The plugin map in section 5 takes its place. It names the hook entry that carries each plugin's job.

Current state:

- `.vibe/hooks.toml` declares 18 `[[hooks]]` entries.
- Thirteen entries run a script in `repo-guards/`.
- Five entries run Vibe adapters under `.skilled/hooks/<concern>/vibe/`.
- Every script calls the same runtime-neutral core the other runtimes call, so a rule changes in one place.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────╮
│                    VIBE HOOK EXECUTION                       │
╰──────────────────────────────────────────────────────────────╯

┌──────────────┐    ┌──────────────────┐    ┌──────────────────────┐
│ Vibe event   │ ─▶ │ .vibe/hooks.toml │ ─▶ │ repo-guards/*.mjs    │
│ pre_tool ... │    │ [[hooks]] entry  │    │ or .skilled/hooks/   │
└──────────────┘    └──────────────────┘    │ <concern>/vibe/*.mjs │
                                            └──────────┬───────────┘
                                                       │
                                                       ▼
                                            ┌──────────────────────┐
                                            │ runtime-neutral core │
                                            │ .skilled/hooks/.../  │
                                            │ lib/                 │
                                            └──────────┬───────────┘
                                                       │
                                                       ▼
                                            ┌──────────────────────┐
                                            │ allow, deny or added │
                                            │ context on stdout    │
                                            └──────────────────────┘

Dependency direction: repo-guards/ ───▶ lib/hook-io.mjs and .skilled/hooks/
```

---

## 3. DIRECTORY TREE

```text
.vibe/plugins/
+-- README.md
`-- repo-guards/
    +-- spec-gate-classify.mjs
    +-- spec-gate.mjs
    +-- env-secret-guard.mjs
    +-- dispatch-preflight.mjs
    +-- overlay-guard.mjs
    +-- mcp-route-guard.mjs
    +-- git-message-gate.mjs
    +-- deep-loop-guard.mjs
    +-- post-edit-quality.mjs
    +-- dist-freshness.mjs
    +-- classifier-injection-screen.mjs
    +-- session-cleanup.mjs
    +-- render-home-hooks.cjs
    +-- lib/
    |   `-- hook-io.mjs
    +-- fixtures/              # One folder of recorded inputs per guard
    `-- tests/                 # node --test suites for the bundle
```

---

## 4. KEY FILES

Each script backs one or two entries in `.vibe/hooks.toml`. A strict entry can refuse the call. The others add context and never block.

| File | Entry and event | Responsibility |
| --- | --- | --- |
| `repo-guards/spec-gate-classify.mjs` | `spec-gate-classify`, `pre_agent` | Classifies the operator prompt so the spec-folder gate is open before the first write |
| `repo-guards/spec-gate.mjs` | `spec-gate`, `pre_tool`, strict | Refuses a write or edit while the spec-folder gate is open and unanswered |
| `repo-guards/env-secret-guard.mjs` | `env-secret-guard`, `pre_tool`, strict | Refuses a tool call that would read or write a dotenv file |
| `repo-guards/dispatch-preflight.mjs` | `dispatch-preflight`, `pre_tool`, strict | Refuses a shell dispatch that breaks the target CLI skill's blocking hard rules |
| `repo-guards/overlay-guard.mjs` | `overlay-guard`, `pre_tool`, strict | Refuses a write to a file a vendored tree's overlay owns, and names the overlay file to edit instead |
| `repo-guards/mcp-route-guard.mjs` | `mcp-route-guard`, `pre_tool`, strict | Refuses a native MCP call whose family has a Code Mode manual registered |
| `repo-guards/git-message-gate.mjs` | `git-message-gate`, `pre_tool`, strict | Refuses a commit message, PR description or branch name that breaks the sk-git templates |
| `repo-guards/deep-loop-guard.mjs` | `deep-loop-guard`, `pre_tool` on `agents_spawn`, strict | Blocks a deep-loop agent spawn whose mode disagrees with the mode registry |
| `repo-guards/post-edit-quality.mjs` | `post-edit-quality`, `post_tool`, strict | Appends quality findings to the tool result after a write or edit |
| `repo-guards/dist-freshness.mjs` | `dist-freshness-edit` and `dist-freshness-shell`, `post_tool` | Warns when an edit or a shell command leaves a watched package's build behind its sources |
| `repo-guards/classifier-injection-screen.mjs` | `classifier-injection-screen`, `post_tool` on `web_fetch` and `open_url` | Appends an advisory when a fetched page reads as instructions aimed at the agent |
| `repo-guards/session-cleanup.mjs` | `session-cleanup-end`, `session_end` | Runs the cleanup script and process sweep when the session ends |
| `repo-guards/render-home-hooks.cjs` | None, run before a dispatch | Writes `.vibe/hooks.toml` into a dispatch's `VIBE_HOME` with every command anchored to the checkout |
| `repo-guards/lib/hook-io.mjs` | None, imported by the scripts | Reads the hook's JSON from stdin and writes the allow, deny or context answer |

---

## 5. PLUGIN MAP

Each row is one OpenCode plugin. The entry names are the `name` values in `.vibe/hooks.toml`.

| OpenCode plugin | Vibe entry | Event | Script |
| --- | --- | --- | --- |
| `.opencode/plugins/system-spec-gate.js` | `spec-gate-classify`, `spec-gate` | `pre_agent`, `pre_tool` | `.vibe/plugins/repo-guards/spec-gate-classify.mjs`, `.vibe/plugins/repo-guards/spec-gate.mjs` |
| `.opencode/plugins/env-secret-guard.js` | `env-secret-guard` | `pre_tool` | `.vibe/plugins/repo-guards/env-secret-guard.mjs` |
| `.opencode/plugins/cli-dispatch-audit.js` | `dispatch-preflight` | `pre_tool` | `.vibe/plugins/repo-guards/dispatch-preflight.mjs` |
| `.opencode/plugins/overlay-guard.js` | `overlay-guard` | `pre_tool` | `.vibe/plugins/repo-guards/overlay-guard.mjs` |
| `.opencode/plugins/mcp-route-guard.js` | `mcp-route-guard`, which refuses the call where OpenCode only logs it | `pre_tool` | `.vibe/plugins/repo-guards/mcp-route-guard.mjs` |
| `.opencode/plugins/sk-git-message-gate.js` | `git-message-gate` | `pre_tool` | `.vibe/plugins/repo-guards/git-message-gate.mjs` |
| `.opencode/plugins/system-deep-loop-guard.js` | `deep-loop-guard`, matched on `agents_spawn` | `pre_tool` | `.vibe/plugins/repo-guards/deep-loop-guard.mjs` |
| `.opencode/plugins/sk-code-post-edit-quality.js` | `post-edit-quality` | `post_tool` | `.vibe/plugins/repo-guards/post-edit-quality.mjs` |
| `.opencode/plugins/system-dist-freshness-guard.js` | `session-start`, `dist-freshness-edit`, `dist-freshness-shell` | `session_start`, `post_tool` | `.skilled/hooks/session-lifecycle/vibe/session-start.mjs`, `.vibe/plugins/repo-guards/dist-freshness.mjs` |
| `.opencode/plugins/classifier-injection-screen.js` | `classifier-injection-screen` | `post_tool` | `.vibe/plugins/repo-guards/classifier-injection-screen.mjs` |
| `.opencode/plugins/opencode-goal.js` | `session-start`, which injects the bound packet's goal slice | `session_start` | `.skilled/hooks/session-lifecycle/vibe/session-start.mjs` |
| `.opencode/plugins/session-cleanup.js` | `session-start` for the startup guards, `session-cleanup-end` for the cleanup | `session_start`, `session_end` | `.skilled/hooks/session-lifecycle/vibe/session-start.mjs`, `.vibe/plugins/repo-guards/session-cleanup.mjs` |
| `.opencode/plugins/system-skill-advisor.js` | `turn-start` | `pre_agent` | `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs` |
| `.opencode/plugins/system-completion-sentinel.js` | `turn-end` records the gap, `turn-start` delivers it once | `post_agent`, `pre_agent` | `.skilled/hooks/session-lifecycle/vibe/turn-end.mjs`, `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs` |
| `.opencode/plugins/ask-surface-guard.js` | `turn-end`, which sends a prose option menu back once | `post_agent` | `.skilled/hooks/session-lifecycle/vibe/turn-end.mjs` |
| `.opencode/plugins/session-history-lookup.js` | `turn-start`, `compaction-post-tool` | `pre_agent`, `post_tool` | `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs`, `.skilled/hooks/session-lifecycle/vibe/compaction-post-tool.mjs` |
| `.opencode/plugins/decision-capture.js` | `decision-capture-ask`, plus the save nudge in `turn-start` | `post_tool`, `pre_agent` | `.skilled/hooks/decision-capture/vibe/decision-capture-post-tool.mjs` |
| `.opencode/plugins/session-handover.js` | `turn-start` delivers the claim seed, withdraws an armed hand-over and nudges past the threshold, `compaction-post-tool` nudges, `turn-end` arms the record and starts the killer | `pre_agent`, `post_tool`, `post_agent` | `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs`, `.skilled/hooks/session-lifecycle/vibe/compaction-post-tool.mjs`, `.skilled/hooks/session-lifecycle/vibe/turn-end.mjs` |
| `.opencode/plugins/codex-hooks-watchdog.js` | Not needed: it watches a Codex file a Vibe session never reads | none | none |
| `.opencode/plugins/sk-git-preflight-advisory.js` | Not needed: sk-git's skill docs state the same rules | none | none |
| `.opencode/plugins/system-speckit-completion.js` | Not needed: Vibe has no plugin tool registry, and the spec-kit CLI returns the same data | none | none |

At save time, `node .skilled/hooks/decision-capture/bin/sweep-vibe.mjs` replays the session journal for any answer the live hook missed.

---

## 6. BOUNDARIES AND FLOW

| Boundary | Rule |
| --- | --- |
| Imports | A script imports `repo-guards/lib/hook-io.mjs`, `.skilled/hooks/shared/hook-flags.mjs` and one runtime-neutral core, such as `.skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs`. The rule logic stays in that core |
| Ownership | This folder adapts Vibe's hook wire format only. A guard's rules change in its core under `.skilled/`, never here |
| Failure | A script that throws allows the call and reports on stderr, so a guard bug never blocks a call it could not judge |
| Loading | The entries load in place only in a trusted checkout, the same as `.vibe/config.toml` |

A dispatch that starts in a scratch folder never reads the project hooks file. It gets the entries through its disposable `VIBE_HOME` instead: `repo-guards/render-home-hooks.cjs` writes `.vibe/hooks.toml` there with the checkout path filled in, at dispatch time. No rendered copy is committed, so none can drift.

A strict entry can refuse a tool call, and the refusal returns to the model as a tool error. A non-strict entry adds context to the tool result or the turn.

---

## 7. VALIDATION

Run these from the repository root.

```bash
node --test .vibe/plugins/repo-guards/tests/
node --test .skilled/hooks/session-lifecycle/vibe/*.test.mjs
```

Expected result: each run exits `0` and its summary prints `fail 0`.

---

## 8. RELATED

- [`../SYNC.md`](../SYNC.md): what in `.vibe/` is generated, derived or authored here
- [`../hooks.toml`](../hooks.toml): the 18 hook entries this folder serves
- [`guards-and-hooks.md`](../../.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md): the wire format and the reason behind each plugin map row
- [`.opencode/plugins/README.md`](../../.opencode/plugins/README.md): the OpenCode plugins the plugin map covers
