# Iteration 6: Angle 6 — hooks and safety

## Focus

What hook system Vibe exposes, at which events, whether a hook can block a tool call, whether the eight repo guards the DeepSeek Harness plugin carries can be expressed there, and what Vibe's approval and sandbox modes are.

## Actions Taken

1. Read `core/hooks/models.py` for the event enum, the strict-blocking subset, the source taxonomy and the TOML config shape.
2. Read `app_server/_host_hooks.py` for the three host-fired hooks and their timing semantics.
3. Read the DSH repo-guards adapter table (`.dsh/plugins/repo-guards/README.md` §4) for the guard inventory and the DSH event each one binds to.
4. Read the harness configuration models for `SandboxConfig`, `SandboxAccess` and `PermissionRule`.
5. Cross-checked the iteration-4 goal-bridge row against the `session_start` context-injection path.

## Findings

1. Vibe fires seven hook events: `pre_agent`, `post_agent`, `pre_tool`, `post_tool`, `notification`, `session_start` and `session_end`. [SOURCE: /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/hooks/models.py:20-33]

2. Blocking is deliberately narrow: `strict = true` is accepted only on `pre_tool`, `post_tool` and `pre_agent`, and the model validator rejects it on any other type. So a hook can block a tool call, but not a notification or a session boundary. [SOURCE: /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/hooks/models.py:35-45]

3. A hook is declarative TOML: `name`, `type`, `command`, `match` (optional pattern), `timeout` (default 60 s), `strict`, `description`. Hooks come from six sources — host, project, project plugin, global, global plugin, client — and speak one of three protocols: `vibe`, `claude_code` or `kimi_code`. [SOURCE: /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/hooks/models.py:57-115]

4. The `claude_code` hook protocol is the porting lever: an existing Claude Code hook configuration can be consumed as-is rather than rewritten, which is the cheapest path to a guard set for any runtime that already has one. [SOURCE: /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/hooks/models.py:48-53]

5. The three host hooks have distinct timing: `notification` runs in the background with its output ignored; `session_end` runs in the background with its output ignored; `session_start` runs synchronously and its `additional_context` is added, out of the user's sight, to the session's next user message, which waits for the hook. On close the server waits at most 5 s for hooks still running. [SOURCE: /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/app_server/_host_hooks.py:1-20]

6. Safety has two independent layers. The sandbox is a `SandboxConfig` (`type` local or managed, `image`, `size`, `network_access`, `env`, `options`) plus a `SandboxAccess` level of `none`, `files` or `full` with an explicit rank. Permissions are `PermissionRule` rows that match stable tool IDs by glob and carry a behaviour. [SOURCE: /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/mistralai_vibe_local_harness/session_api/app_server/session/models/configuration.py:40-45]

7. The DSH repo-guards bundle carries 25 adapters over seven DSH event classes. Vibe can host four of those classes: `tools/pre-execute` → `pre_tool`, `tools/post-execute` → `post_tool`, `agent/created` → `session_start`, `agent/disposed` → `session_end`. It has no home for `agent/pre-step`, `agent/turn-stopping` or `session/event` compaction events. [SOURCE: .dsh/plugins/repo-guards/README.md:1-60]

8. The deny-capable guards map cleanly because `pre_tool` is strict-eligible: `spec-gate-enforce`, `env-secret-guard`, `overlay-guard`, `mcp-route-guard`, `dispatch-preflight-lint` and `git-message-gate` all become strict `pre_tool` hooks. The turn-stopping guards — `completion-evidence` and `ask-surface-guard` — have no Vibe event and cannot be expressed. [SOURCE: .dsh/plugins/repo-guards/README.md:1-60]

9. **Correction to iteration 4.** The goal bridge is not "none": a `session_start` hook can return `additional_context` that is injected into the session's next user message, and a builtin `pre_agent` binding (`builtin:session_start_context`) carries it there. A goal slice can therefore be injected at session start. What Vibe still lacks is a goal *object* with lifecycle, so the bridge is partial rather than absent. [SOURCE: /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/app_server/_host_hooks.py:1-20]

## Ruled Out

- Expressing `completion-evidence` or `ask-surface-guard` as Vibe hooks: both bind to a turn-stopping moment Vibe does not expose, and no other event fires there.
- Assuming `strict` works on every hook type: the validator rejects it outside the three tool/agent events, so a design that relies on a blocking `session_end` hook fails at config parse.

## Dead Ends

- Finding an in-process hook API. Every hook is an external command; there is no Python or JavaScript handler registry, so a guard that needs to inspect structured tool arguments must parse them from the hook payload.

## Edge Cases

- Ambiguous input: "the eight repo guards" — the bundle actually carries 25 adapters over seven event classes. Read as "the repo-guards bundle" and answered by event class rather than by a fixed count of eight.
- Contradictory evidence: iteration 4 recorded the goal bridge as "none"; the `session_start` `additional_context` path contradicts that. Resolved in favour of the newer evidence and recorded as correction 9 above, with the iteration-4 row now known to be too strong.
- Missing dependencies: no hook was authored or run, so the payload schema a hook receives stays unconfirmed. Marked as an open question rather than assumed.
- Partial success: event set, blocking subset, sources, protocols, host timing, sandbox and permission layers are confirmed; the hook payload contract is not. Status `complete` with that caveat.

## Sources Consulted

- `/Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/hooks/models.py`
- `/Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/hooks/config.py`
- `/Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/app_server/_host_hooks.py`
- `/Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/mistralai_vibe_local_harness/session_api/app_server/session/models/configuration.py`
- `.dsh/plugins/repo-guards/README.md`

## Questions Answered

- What hook system does Vibe expose, at which events, can a hook block a tool call, can the repo guards be expressed there, and what are the approval and sandbox modes? — Answered, with the hook payload contract left open.

## Questions Remaining

- The exact JSON payload a hook receives and the exit-code or stdout-JSON contract it answers with.

## Assessment

- New information ratio: 0.94
- Questions addressed: Angle 6 (hooks and safety); correction to Angle 4
- Questions answered: 6 of 8 strategy key questions

## Reflection

- What worked and why: reading the DSH adapter table beside the Vibe event enum. The two lists are the same shape — event, scope, deny policy — so the mapping fell out row by row instead of needing a design.
- What did not work and why: assuming the goal bridge had no mechanism. Iteration 4 read the prompt-loading path and stopped there; the host-hook docstring, twenty lines long, was the missing piece.
- What I would do differently: when a finding is "none", check the host-hook and injection surfaces before recording it. An absence claim needs a wider sweep than a presence claim, because it asserts that no mechanism exists anywhere.

## Recommended Next Focus

Angle 7: deep-loop executor support — what a `cli-mistral-vibe` executor kind would need in the deep-loop runtime: the command builder, the environment allowlist, a closed model roster, dispatch-audit recognition and stress coverage.
