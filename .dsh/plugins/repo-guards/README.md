---
title: "DSH Plugins: Repo Guards for Spec, Git, Dispatch and Session State"
description: "The DSH plugin bundle that registers guard adapters and reaches the shared hook cores."
trigger_phrases:
  - "dsh plugins"
  - "repo guards"
  - "dsh adapter links"
---

# DSH Plugins: Repo Guards for Spec, Git, Dispatch and Session State

---

## 1. OVERVIEW

`.dsh/plugins/repo-guards/` holds the plugin bundle a DSH run loads to guard this repository. DSH finds it through `.dsh/patches/guards.patch.yml`, which inserts one row named `repo-guards` and points that row at `index.mjs`.

`index.mjs` imports every adapter in `adapters/` and registers its handler. Every adapter there is a relative link, and the real code lives in `.skilled/hooks/<concern>/dsh/` or in the skill that owns the concern. The [hook library](../../../.skilled/hooks/README.md) lists each concern and the switch that silences it. Two helper links sit beside them and `index.mjs` does not register them.

The lineage patch mounts `lineage-leaf.mjs` from this folder. The plugin marks the process as a fan-out leaf, and section 5 says which entries step aside.

Every entry follows one rule: it translates a DSH event into a core call and delivers the result. The rule stays in the core, so a policy change lands in the core and never in an adapter. Most entries fail open. The exceptions are named in section 5.

---

## 2. ARCHITECTURE

```text
╭──────────────────────╮
│ DSH event            │
╰──────────┬───────────╯
           ▼
┌──────────────────────┐
│ index.mjs            │
│ registers each entry │
└──────────┬───────────┘
           ▼
┌──────────────────────────┐
│ adapters/<entry>.mjs     │
│ a link to the real file  │
└──────────┬───────────────┘
           ▼
┌──────────────────────────┐
│ shared hook core         │
│ owns the decision        │
└──────────┬───────────────┘
           ▼
╭──────────────────────────╮
│ inject, attach, allow    │
│ or deny                  │
╰──────────────────────────╯
```

Dependency direction: `index.mjs` → adapter link → real adapter → shared core.

---

## 3. DIRECTORY TREE

```text
repo-guards/
+-- README.md
+-- index.mjs                 # bundle entry the guards patch loads
+-- lineage-leaf.mjs          # marker plugin the lineage patch mounts
+-- adapters/                 # relative links, no adapter code
|   +-- README.md             # the link-to-target table
|   +-- dsh-llm.mjs           # loads the dsh message and tool modules
|   +-- session-role.mjs      # reads and writes the leaf marker
|   `-- <adapter>.mjs         # one link per entry in section 4
`-- tests/
    +-- README.md             # what the suite covers
    `-- bundle.test.mjs       # the bundle's own node --test suite
```

`adapters/` holds links and a README. A link holds no code of its own. An edit made through it lands in the adapter it names, so a behavior change belongs in that file.

---

## 4. ENTRY MAP

| Entry | Event | Real file or core | Effect |
|---|---|---|---|
| `ask-surface-guard.mjs` | `agent/turn-stopping` | `.skilled/hooks/ask-surface-guard/dsh/ask-surface-guard.mjs` | Sends a turn that closes on a prose option menu back once. A headless run and a leaf have no question tool, so it stays quiet. |
| `classifier-injection-screen.mjs` | `tools/post-execute` on `web_fetch`, `web_search` and `mcp__*` | `.skilled/hooks/classifier-injection-screen/dsh/classifier-injection-screen.mjs` | Adds the injection advisory to an accepted result. |
| `completion-evidence.mjs` | `agent/turn-stopping` | `.skilled/skills/system-spec-kit/runtime/hooks/dsh/completion-evidence.mjs` | Adds an evidence advisory when a stopping reply claims completion for a spec folder. |
| `decision-capture.mjs` | `tools/result`, `session/event` and `agent/status` | `.skilled/hooks/decision-capture/dsh/decision-capture.mjs` | Queues operator answers and injects a reminder at idle. |
| `dispatch-audit.mjs` | `tools/post-execute` on `bash` | `.skilled/hooks/cli-dispatch/dsh/dispatch-audit.mjs` | Records the command in the dispatch audit log. The result passes unchanged. |
| `dispatch-preflight-lint.mjs` | `tools/pre-execute` on `bash` | `.skilled/hooks/cli-dispatch/dsh/dispatch-preflight-lint.mjs` | Denies a command that breaks a target skill's blocking rule and logs the warnings. |
| `env-secret-guard.mjs` | `tools/pre-execute` and `tools/post-execute` | `.skilled/hooks/env-secret-guard/dsh/env-secret-guard.mjs` | Denies a dotenv read or write before the call and reports a dotenv value after it. |
| `git-message-gate.mjs` | `tools/pre-execute` on `bash` | `.skilled/skills/sk-git/scripts/hooks/dsh/git-message-gate.mjs` | Denies a command whose message breaks the shared contract. It also denies when it cannot read the contract. |
| `git-preflight-advisory.mjs` | `tools/post-execute` on `bash` | `.skilled/skills/sk-git/scripts/hooks/dsh/git-preflight-advisory.mjs` | Adds one notice with up to three Git advisories to an accepted result. |
| `goal-context.mjs` | `agent/created` | `.skilled/hooks/goal/dsh/goal-context.mjs` | Injects the `DSH_SPEC_FOLDER` chat slice. |
| `goal-manage.mjs` | `agent/created`, `agent/pre-step`, `agent/turn-stopping` and `agent/status` | `.skilled/hooks/goal/dsh/goal-manage.mjs` | Registers `/goal-dsh` and `dsh_goal`, adds the goal brief, records the turn and sends a verify note at idle. |
| `mcp-route-guard.mjs` | `tools/pre-execute` on `mcp__*` | `.skilled/hooks/mcp-route-guard/dsh/mcp-route-guard.mjs` | Denies a call the route core flags. It also denies a `code_mode` tool outside `call_tool_chain`, `list_tools`, `search_tools` and `tool_info`. |
| `overlay-guard.mjs` | `tools/pre-execute` on `write`, `edit` and `apply_patch` | `.skilled/hooks/overlay-guard/dsh/overlay-guard.mjs` | Denies a write that touches a file a vendored tree's overlay owns. |
| `post-edit-quality.mjs` | `tools/post-execute` on `write`, `edit` and `apply_patch` | `.skilled/hooks/post-edit-quality/dsh/post-edit-quality.mjs` | Adds the post-edit findings and a dist-staleness banner. |
| `prompt-advisor.mjs` | `agent/pre-step`, with receipt resets on `agent/created` and `session/event` | `.skilled/skills/system-skill-advisor/hooks/dsh/prompt-advisor.mjs` | Adds the advisor brief to the step. The directive block arrives once per session start or compaction. |
| `session-compact-context.mjs` | `session/event` on `compaction/end` | `.skilled/skills/system-spec-kit/runtime/hooks/dsh/session-compact-context.mjs` | Re-primes the agent after a completed compaction. |
| `session-start-advisories.mjs` | `agent/created` on `startup` | `.skilled/skills/system-spec-kit/runtime/hooks/dsh/session-start-advisories.mjs` | Injects one notice with the warnings from the warn-only session-start scripts. |
| `session-start-context.mjs` | `agent/created` | `.skilled/skills/system-spec-kit/runtime/hooks/dsh/session-start-context.mjs` | Injects the `session-prime.js` output for the session. |
| `session-stop-context.mjs` | `agent/disposed` | `.skilled/skills/system-spec-kit/runtime/hooks/dsh/session-stop-context.mjs` | Runs the `session-stop.js` autosave when the agent closes. |
| `spec-gate-classify.mjs` | `agent/pre-step` | `.skilled/skills/system-spec-kit/runtime/hooks/dsh/spec-gate-classify.mjs` | Adds the deferred Gate 3 notice when the gate opens. |
| `spec-gate-enforce.mjs` | `tools/pre-execute` on `write`, `edit`, `apply_patch` and `bash` | `.skilled/skills/system-spec-kit/runtime/hooks/dsh/spec-gate-enforce.mjs` | Denies a call the shared verdict blocks and asks at the first undelivered write or edit. |
| `task-dispatch-guard.mjs` | `tools/pre-execute` on `subagent` and `subagent_fork` | `.skilled/hooks/subagent-dispatch-guard/dsh/task-dispatch-guard.mjs` | Writes deep-loop warnings and audits, then passes the call. |

The two helper links are not entries. `dsh-llm.mjs` loads the message and tool modules, and `session-role.mjs` holds the leaf marker.

---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | An entry imports its core from its real folder. Node resolves a link before it resolves that folder's imports, so every path is written for the real location. |
| Ownership | The core owns the decision. An entry owns the event, the payload translation and the result it returns. |
| Failure | Most entries log a core error and continue. `dispatch-preflight-lint` denies when the shared rule check throws. `mcp-route-guard` denies a call it cannot evaluate. `spec-gate-enforce` denies when the shared guard cannot complete. `git-message-gate` logs an unexpected error and continues. It denies when it cannot read the contract. |
| Session folder | A DSH session can run in a lineage or scratch folder. These entries find the checkout from their own file, not from the session folder: `dispatch-audit`, `dispatch-preflight-lint`, `git-preflight-advisory`, `mcp-route-guard` and `session-start-advisories`. |

A fan-out leaf carries the marker row. Five entries read that mark.

- `ask-surface-guard` reads the leaf as a session with no question tool.
- `goal-manage` closes its command and tool.
- `prompt-advisor` adds no brief.
- `session-start-advisories` runs no script.
- `session-stop-context` skips the autosave.

Every other entry keeps running.

A context entry never blocks a tool call when its core fails. The entries build injected messages with `@deepseek-ai/dsh-llm` and the goal tool with `@deepseek-ai/dsh-tools`. `dsh-llm.mjs` loads both from the running `dsh` install. Two entries wait for a service through `ctx.inject`. `goal-manage` waits for `commands` and `tools`. `session-compact-context` waits for `agents`. A bundle-level `inject` would hold every guard until those services exist.

---

## 6. CONFIGURATION

The plugin row lives in `.dsh/patches/guards.patch.yml`.

```yaml
- insert:
    - id: repo-guards
      name: ../plugins/repo-guards/index.mjs
      config:
        adapters:
          promptAdvisor: true
```

`promptAdvisor` is the only row switch. `index.mjs` registers the advisor unless the value is `false`. The lineage patch does not change it. A leaf still gets no brief because the adapter returns before it asks the advisor.

`DSH_SPEC_FOLDER` names the packet whose goal the `goal-context` entry reads. The path may sit relative to the session workspace or be absolute inside it. The core returns the `chatSlice` field, which matches the `chat_slice` that `goal.cjs packet` prints. The entry injects that string alone.

`goal-manage` runs `/goal-dsh` and the `dsh_goal` tool over the shared manage CLI. `/goal-dsh bind <packet>` binds a packet and a bare `/goal-dsh` shows the goal. The [goal CLI](../../../.skilled/hooks/goal/bin/README.md) documents the action set.

| Switch | Effect |
|---|---|
| `adapters.promptAdvisor: false` | Leaves the prompt advisor unregistered. |
| `DSH_SPEC_FOLDER` | Names the packet whose chat slice `goal-context` injects. |
| `OPENCODE_GOAL_DISABLED=1` | Leaves `goal-manage` unregistered. |
| `SYSTEM_SPEC_GATE_DISABLED=1` | Makes `spec-gate-classify` and `spec-gate-enforce` inert. |
| `SYSTEM_SPEC_GATE_ENFORCE=1` | Lets `spec-gate-enforce` deny a blocked call. Without it the gate advises only. |
| `SYSTEM_SESSION_LIFECYCLE_DISABLED=1` | Turns off `session-start-context`, `session-start-advisories`, `session-compact-context` and `session-stop-context`. |
| `SYSTEM_GIT_WORKTREE_GUARD_DISABLED=1` | Skips `worktree-guard.sh`. |
| `SYSTEM_GIT_HOOKS_CHECK_DISABLED=1` | Skips `check-git-hooks.sh`. |
| `SYSTEM_PRIMARY_RECONCILE_DISABLED=1` | Skips `git-primary-reconcile.sh`. |
| `SYSTEM_LIVE_FOLLOW_DISABLED=1` | Skips `git-live-follow.sh --start`. |
| `SYSTEM_DIST_FRESHNESS_DISABLED=1` | Skips `check-dist-staleness.sh --all`. |
| `SYSTEM_HOOK_INSTALL_DISABLED=1` | Skips `install-codex-hooks.mjs --check`. |

The shared resolver reads the live environment first and `.skilled/hooks/hook-flags.env` second, so a switch kept in that file still gives way to a session value. `SYSTEM_HOOKS_DISABLED=1` is the master switch. An entry that never asks the resolver ignores it, such as `git-message-gate`. `goal-context` still honors it through the goal core.

---

## 7. VALIDATION

Run these commands from the repository root.

```sh
node --test .dsh/plugins/repo-guards/tests/
```

Expected result: the run reports `ℹ tests 5`, `ℹ pass 5` and `ℹ fail 0` and exits 0.

```sh
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check
```

Expected result: two lines print, the second carries `[runtime-mirror-sync] PASS` and the command exits 0.

```text
[runtime-mirror-sync] visibility claude 44/44, cursor 44/44
[runtime-mirror-sync] PASS: 260 mirrors across 10 trees are in sync.
```

The mirror check reads every `dsh/` folder in the hook library and expects one link here per `.mjs` file, so a new adapter without a link fails it. Each adapter's own suite sits beside its core, as `.skilled/hooks/goal/tests/dsh-goal.test.mjs` or `.skilled/skills/system-skill-advisor/hooks/tests/dsh-prompt-advisor.test.mjs`. Most of those suites share the fake plugin context in `.skilled/hooks/shared/tests/dsh-plugin-harness.mjs`. The MCP route guard suite builds its own.

---

## 8. RELATED

- [Guards patch](../../patches/guards.patch.yml): the row that loads this bundle
- [Lineage patch](../../patches/lineage.patch.yml): the marker row for a fan-out leaf
- [Adapters folder](adapters/README.md): each link and the file it names
- [Bundle tests](tests/README.md): what the suite covers
- [Hook library](../../../.skilled/hooks/README.md): the cores, their switches and the runtimes that carry them
- [Goal core](../../../.skilled/hooks/goal/lib/goal-core.cjs): the packet read and the goal record
- [Session sweep](../../../.skilled/hooks/decision-capture/bin/sweep-dsh.mjs): the recovery pass for missed answers

<!-- readme-check
allow-ref ../plugins/repo-guards/index.mjs | a path inside a patch file, resolved from .dsh/patches/
-->
