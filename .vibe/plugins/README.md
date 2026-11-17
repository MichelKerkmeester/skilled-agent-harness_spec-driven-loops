---
title: "Vibe Plugins: Repo Guards and Hook Map"
description: "The hook scripts a Vibe session runs from this folder plus the map from each OpenCode plugin to the Vibe entry that does its job."
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

`.vibe/plugins/` is the plugin folder a Vibe session scans at the project root. The scan is not what runs these scripts. Vibe treats each direct subdirectory as a plugin and needs a `plugin.json` inside it. `repo-guards/` carries no manifest, so nothing in this folder loads as a plugin.

The scripts run because `.vibe/hooks.toml` names each one as a hook command. That file declares 18 entries. Thirteen run a script in `repo-guards/`. Five run an adapter under `.skilled/hooks/<concern>/vibe/`.

Every hook script here is a thin adapter. It reads one JSON object from stdin and maps the payload onto the shape its core judges. It never decides anything itself. Empty stdout allows the call. A deny object refuses it. An `additional_context` line adds text to the result.

The rules live in the cores under `.skilled/`. The [hook cores README](../../.skilled/hooks/README.md) owns them and lists every switch.

---

## 2. ARCHITECTURE

```text
╭─────────────────────────────╮
│ Vibe event                  │
│ any hook type               │
╰──────────────┬──────────────╯
               ▼
┌─────────────────────────────┐
│ .vibe/hooks.toml            │
│ one [[hooks]] entry         │
└──────────────┬──────────────┘
               ▼
┌─────────────────────────────┐
│ repo-guards/<guard>.mjs     │
│ reads the payload, maps it  │
└──────────────┬──────────────┘
               ▼
┌─────────────────────────────┐
│ the core under .skilled/    │
│ owns the rule               │
└──────────────┬──────────────┘
               ▼
╭─────────────────────────────╮
│ a decision or added text    │
╰─────────────────────────────╯
```

Dependency direction: `repo-guards/*.mjs` ───▶ `repo-guards/lib/hook-io.mjs` and the core it names.

The entry decides nothing. It translates the payload, calls the core and prints the answer the core returns. `dist-freshness.mjs` and `session-cleanup.mjs` carry work of their own. `dist-freshness.mjs` runs the staleness checker. `session-cleanup.mjs` drives the shared cleanup plugin.

---

## 3. DIRECTORY TREE

```text
.vibe/plugins/
+-- README.md                    # this index
`-- repo-guards/
    +-- <guard>.mjs              # 12 hook scripts, one row each in the entry map
    +-- render-home-hooks.cjs    # writes hooks.toml into a dispatch's VIBE_HOME
    +-- lib/
    |   `-- hook-io.mjs          # the stdin reader and the reply writer
    +-- fixtures/                # recorded inputs per guard, plus a wire-format capture
    `-- tests/                   # node --test suites for the bundle
```

---

## 4. ENTRY MAP

One row per script the hook file loads, then the files that support them. The Event column names the entry's `type` in `.vibe/hooks.toml`, with its `match` selector where it has one. Paths in the core column start at the repository root.

| Entry | Kind | Event | Real file or core | Effect |
|---|---|---|---|---|
| `spec-gate-classify.mjs` | Thin adapter | `pre_agent` | `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` | Classifies the operator prompt and persists the gate state the strict half reads. It never blocks. |
| `spec-gate.mjs` | Thin adapter | `pre_tool` on `re:bash|process_start|process_write|write_file|edit`, strict | `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` | Refuses a write or edit while the spec-folder question is open and unanswered. A shell call gets an operator note instead. |
| `env-secret-guard.mjs` | Thin adapter | `pre_tool` on `re:bash|process_start|process_write|read_file|write_file|edit`, strict | `.skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs` | Refuses a call that would read or write a dotenv file. |
| `dispatch-preflight.mjs` | Thin adapter | `pre_tool` on shell calls, strict | `.skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs` | Refuses a dispatch that breaks a target skill's hard rule and reports an advisory rule on stderr. |
| `overlay-guard.mjs` | Thin adapter | `pre_tool` on write and edit, strict | `.skilled/hooks/overlay-guard/lib/overlay-guard.cjs` | Refuses a write a vendored tree's overlay owns and names the overlay file to edit. |
| `mcp-route-guard.mjs` | Thin adapter | `pre_tool`, strict | `.skilled/hooks/mcp-route-guard/lib/mcp-route-guard.cjs` | Refuses a native MCP call whose family has a Code Mode manual. |
| `git-message-gate.mjs` | Thin adapter | `pre_tool` on shell calls, strict | `.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs` | Refuses a command whose git message or branch name breaks the sk-git templates. |
| `deep-loop-guard.mjs` | Thin adapter | `pre_tool` on `agents_spawn`, strict | `.skilled/hooks/subagent-dispatch-guard/lib/subagent-dispatch-guard.cjs` | Refuses a spawn whose declared Deep Route mode disagrees with the registry. A repeated loop hand-off is refused too. |
| `post-edit-quality.mjs` | Thin adapter | `post_tool` on write and edit, strict | `.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs` | Appends quality findings to the tool result. It never refuses. |
| `dist-freshness.mjs` | Thin adapter | `post_tool` on write, edit and shell calls | `.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh` | Appends a staleness banner when a build falls behind its sources. It also fires when a command is about to trust the build. |
| `classifier-injection-screen.mjs` | Thin adapter | `post_tool` on `web_fetch` and `open_url` | `.skilled/hooks/classifier-injection-screen/lib/classifier-injection-advisory.mjs` | Appends one advisory when fetched text reads as instructions aimed at the agent. |
| `session-cleanup.mjs` | Thin adapter | `session_end`, plus `session_start` as a child of the session-start hook | `.opencode/plugins/session-cleanup.js` | Runs the startup guards on session start and the cleanup script with a process sweep at session end. |
| `render-home-hooks.cjs` | Render helper, not a hook | None, run before a dispatch | `.vibe/hooks.toml` | Writes a copy of the hook file into a dispatch's `VIBE_HOME` with every command anchored to the checkout. |
| `lib/hook-io.mjs` | Shared seam, not an entry | None, imported by every script | None. It re-exports `.skilled/hooks/shared/payload-dir.mjs` | Reads the payload, maps Vibe tool names onto the short names every runtime shares. It also writes the reply. |

---

## 5. PLUGIN MAP

One row per plugin in `.opencode/plugins/`, which holds 20. The Vibe entry column names a `name` in `.vibe/hooks.toml`. Paths in the script column are relative to this folder, unless they start with a dot. Plugin paths start at the repository root.

| OpenCode plugin | Vibe entry | Event | Script |
|---|---|---|---|
| `.opencode/plugins/system-spec-gate.js` | `spec-gate-classify`, `spec-gate` | `pre_agent`, `pre_tool` | `repo-guards/spec-gate-classify.mjs`, `repo-guards/spec-gate.mjs` |
| `.opencode/plugins/env-secret-guard.js` | `env-secret-guard` | `pre_tool` | `repo-guards/env-secret-guard.mjs` |
| `.opencode/plugins/cli-dispatch-audit.js` | `dispatch-preflight` | `pre_tool` | `repo-guards/dispatch-preflight.mjs` |
| `.opencode/plugins/overlay-guard.js` | `overlay-guard` | `pre_tool` | `repo-guards/overlay-guard.mjs` |
| `.opencode/plugins/mcp-route-guard.js` | `mcp-route-guard`, which refuses where OpenCode only logs | `pre_tool` | `repo-guards/mcp-route-guard.mjs` |
| `.opencode/plugins/sk-git-message-gate.js` | `git-message-gate` | `pre_tool` | `repo-guards/git-message-gate.mjs` |
| `.opencode/plugins/system-deep-loop-guard.js` | `deep-loop-guard`, matched on `agents_spawn` | `pre_tool` | `repo-guards/deep-loop-guard.mjs` |
| `.opencode/plugins/sk-code-post-edit-quality.js` | `post-edit-quality` | `post_tool` | `repo-guards/post-edit-quality.mjs` |
| `.opencode/plugins/system-dist-freshness-guard.js` | `session-start`, `dist-freshness-edit`, `dist-freshness-shell` | `session_start`, `post_tool` | `.skilled/hooks/session-lifecycle/vibe/session-start.mjs`, `repo-guards/dist-freshness.mjs` |
| `.opencode/plugins/classifier-injection-screen.js` | `classifier-injection-screen` | `post_tool` | `repo-guards/classifier-injection-screen.mjs` |
| `.opencode/plugins/opencode-goal.js` | `session-start`, which injects the bound packet's goal slice | `session_start` | `.skilled/hooks/session-lifecycle/vibe/session-start.mjs` |
| `.opencode/plugins/session-cleanup.js` | `session-start` for the startup guards, `session-cleanup-end` for the cleanup | `session_start`, `session_end` | `.skilled/hooks/session-lifecycle/vibe/session-start.mjs`, `repo-guards/session-cleanup.mjs` |
| `.opencode/plugins/system-skill-advisor.js` | `turn-start` | `pre_agent` | `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs` |
| `.opencode/plugins/system-completion-sentinel.js` | `turn-end` records the gap, `turn-start` delivers it once | `post_agent`, `pre_agent` | `.skilled/hooks/session-lifecycle/vibe/turn-end.mjs`, `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs` |
| `.opencode/plugins/ask-surface-guard.js` | `turn-end`, which sends a prose option menu back once | `post_agent` | `.skilled/hooks/session-lifecycle/vibe/turn-end.mjs` |
| `.opencode/plugins/decision-capture.js` | `decision-capture-ask`, plus the save nudge in `turn-start` | `post_tool`, `pre_agent` | `.skilled/hooks/decision-capture/vibe/decision-capture-post-tool.mjs` |
| `.opencode/plugins/session-handover.js` | `turn-start` delivers the claim seed and withdraws an armed hand-over, `compaction-post-tool` nudges, `turn-end` arms the record and starts the killer | `pre_agent`, `post_tool`, `post_agent` | `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs`, `.skilled/hooks/session-lifecycle/vibe/compaction-post-tool.mjs`, `.skilled/hooks/session-lifecycle/vibe/turn-end.mjs` |
| `.opencode/plugins/codex-hooks-watchdog.js` | None | None | Not needed. It watches a Codex file a Vibe session never reads. |
| `.opencode/plugins/sk-git-preflight-advisory.js` | None | None | Not needed. sk-git's skill docs state the same rules. |
| `.opencode/plugins/system-speckit-completion.js` | None | None | Not needed. Vibe has no plugin tool registry. The spec-kit CLI returns the same data. |

At save time, `node .skilled/hooks/decision-capture/bin/sweep-vibe.mjs` replays the session journal for any answer the live hook missed.

---

## 6. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | A script imports `repo-guards/lib/hook-io.mjs` and one runtime-neutral core, such as `.skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs`. Ten of the twelve also import `.skilled/hooks/shared/hook-flags.mjs`. The rule logic stays in that core. |
| Ownership | This folder adapts Vibe's hook wire format. A guard's rules change in its core under `.skilled/`, never here. |
| Failure | A script that throws allows the call and writes one stderr line. Seven entries can refuse a call: `spec-gate`, `env-secret-guard`, `dispatch-preflight`, `overlay-guard`, `mcp-route-guard`, `git-message-gate` and `deep-loop-guard`. `post-edit-quality` is strict in the hook file and never refuses, because a deny would replace the tool output the model needs. |
| Contract | `git-message-gate` refuses a command when its rulebook exists and cannot be read, as every other runtime does. The contract has no bypass, so the hook has no kill switch. |
| Loading | The entries load in place only in a trusted checkout, the same as `.vibe/config.toml`. |

A refused tool call returns to the model as a tool error. The run can still exit `0`. The refusal makes one call unavailable. It does not fail the session.

A dispatch that starts in a scratch folder never reads the project hook file. It gets the entries through its disposable `VIBE_HOME` instead: `repo-guards/render-home-hooks.cjs` writes `.vibe/hooks.toml` there with the checkout path filled in, at dispatch time. No rendered copy is committed, so none can drift.

---

## 7. CONFIGURATION

Every script in this folder is on by default. A switch is truthy as `1`, `true`, `yes` or `on`, in any case. The shared resolver reads the live environment first and `.skilled/hooks/hook-flags.env` second.

| Switch | What it silences |
|---|---|
| `SYSTEM_HOOKS_DISABLED=1` | Master. Every entry that reads a switch. |
| `SYSTEM_SPEC_GATE_DISABLED=1` | Both spec-gate entries. |
| `SYSTEM_DISPATCH_GUARD_DISABLED=1` | `dispatch-preflight`. The older `SYSTEM_DISPATCH_DISABLED` still works. |
| `SYSTEM_OVERLAY_GUARD_DISABLED=1` | `overlay-guard`. |
| `MCP_ROUTE_GUARD_DISABLED=1` | `mcp-route-guard`. |
| `SYSTEM_TASK_DISPATCH_DISABLED=1` | `deep-loop-guard`. |
| `SK_CODE_POST_EDIT_QUALITY_DISABLED=1` | `post-edit-quality`. |
| `SYSTEM_DIST_FRESHNESS_DISABLED=1` | Both `dist-freshness` entries. |
| `SYSTEM_INJECTION_SCREEN_DISABLED=1` | `classifier-injection-screen`. |
| `SYSTEM_SESSION_CLEANUP_DISABLED=1` | `session-cleanup`, on both lifecycle halves. |
| `SYSTEM_ENV_SECRET_GUARD_DISABLED=1` | `env-secret-guard`, read by its own core rather than the shared resolver. |

`git-message-gate` reads no switch.

One plugin map row ships off. The hand-over parts run only after `SYSTEM_SESSION_HANDOVER_VIBE_ENABLED=1`. The global `SYSTEM_SESSION_HANDOVER_ENABLED` answers when that one is blank.

Two hooks supply their own blocking opt-in when the operator has set none. A `pre_tool` hook can answer only with a deny, so `spec-gate.mjs` sets `SYSTEM_SPEC_GATE_ENFORCE=1` when the value is unset. `deep-loop-guard.mjs` does the same for `SYSTEM_DEEP_LOOP_GUARD_REJECT` and `SYSTEM_DEEP_LOOP_GUARD_REJECT_LOOP`. An explicit `0` keeps either one advisory.

`AI_SESSION_CHILD=1` marks a child session. The spec gate never denies one. Vibe also passes a parent session id in the payload for a subagent, which the script reads as the same signal.

To keep a switch, write it into `.skilled/hooks/hook-flags.env`. The exception is `env-secret-guard`, which reads both `SYSTEM_ENV_SECRET_GUARD_DISABLED` and the master switch from the environment only. The [hook cores README](../../.skilled/hooks/README.md) carries the full list across every runtime.

---

## 8. VALIDATION

Run these from the repository root.

```bash
node --test .vibe/plugins/repo-guards/tests/
```

Expected result: `ℹ tests 26`, `ℹ pass 26`, `ℹ fail 0` and exit status 0. The suites cover the spec gate's two halves, the render helper, dist freshness and four strict guards.

```bash
node --test .skilled/hooks/session-lifecycle/vibe/*.test.mjs
```

Expected result: `ℹ tests 57`, `ℹ pass 57`, `ℹ fail 0` and exit status 0. These suites cover the session-start, turn-start, turn-end and compaction adapters outside this folder.

```bash
for f in $(grep -oE '\.(skilled|vibe)/[^"]+\.(mjs|cjs|js|sh)' .vibe/hooks.toml | sort -u)
do
  test -f "$f" && echo "ok   $f" || echo "MISSING $f"
done
echo "count=$(grep -c '^\[\[hooks\]\]' .vibe/hooks.toml)"
```

Expected result: 17 lines, each starting `ok`, plus a final `count=18`. The loop proves every hook command still names a file on disk. The count proves the hook file still declares 18 entries.

---

## 9. RELATED

- [`../SYNC.md`](../SYNC.md): what in `.vibe/` is generated, derived or authored here
- [`../hooks.toml`](../hooks.toml): the 18 hook entries this folder serves
- [`../../.skilled/hooks/README.md`](../../.skilled/hooks/README.md): the hook cores and the switch index
- [`../../.opencode/plugins/README.md`](../../.opencode/plugins/README.md): the OpenCode plugins the plugin map covers
- [`guards-and-hooks.md`](../../.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md): the wire format and the reason behind each plugin map row

<!-- readme-check
allow-ref plugin.json | the manifest Vibe looks for in a plugin folder, which repo-guards/ deliberately lacks
-->
