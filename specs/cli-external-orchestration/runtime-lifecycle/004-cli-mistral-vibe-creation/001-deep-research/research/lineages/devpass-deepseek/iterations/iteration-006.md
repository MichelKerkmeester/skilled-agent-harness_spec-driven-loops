# Iteration 6: hooks and safety

## Focus

Angle 6: which hook system Vibe exposes, at which events, whether a hook can block a tool call, whether the repository's guard set can be expressed there, and what approval and sandbox modes exist. The guard comparison uses the enforcement adapters in `.dsh/plugins/repo-guards/README.md`; that bundle carries more than eight adapters, so this iteration graded the eight enforcement guards (spec gate, dispatch preflight, git message gate, MCP route, overlay, env secret, task dispatch, post-edit quality) plus the two turn-stopping guards as a separate advisory class.

## Findings

1. Hooks are declared, not programmed: `.vibe/hooks.toml` (project) or `~/.vibe/hooks.toml` (global) holds `[[hooks]]` entries with `name`, `type`, `command`, optional `match`, `timeout` (default 60s), `strict` and `description`, and the binary's own changelog records hooks as stable since 2.21 with "no opt-in flag". [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/hooks/config.py:1-70] [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/hooks/models.py:53-100] [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/harness_files/_harness_manager.py:140-143]

2. Seven events exist: `post_agent`, `pre_tool`, `post_tool`, `pre_agent`, `notification`, `session_start`, `session_end`. Only `pre_tool`, `post_tool` and `pre_agent` accept `strict`, and the model's own comment defines strict as where "a failing hook may block instead of letting things through". A hook can therefore block a tool call — at those three events only. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/hooks/models.py:19-41,80-100]

3. Hook provenance and protocol are first-class: `HookSource` distinguishes host, project, project-plugin, global, global-plugin and client hooks, and `HookProtocol` accepts `VIBE`, `CLAUDE_CODE` and `KIMI_CODE`. Claude Code hook scripts and Kimi hooks are therefore usable as a protocol, which is an odd but real porting shortcut for any guard that already exists in a Claude hook form. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/hooks/models.py:44-60]

4. A resolved hook carries execution context, not just a command: `RuntimeHookDefinition` adds `cwd`, `environment`, `order`, `visibility`, `protocol`, `plugin_name`, `declared_name` and `config_file`, and plugin-sourced hooks must name their plugin. That is enough to run a repository guard from its own checkout rather than the session cwd. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/hooks/models.py:104-128]

5. Approval modes are agent safety levels: `SAFE`, `NEUTRAL`, `DESTRUCTIVE`, `SMART`, `YOLO`, with builtin agents `ask`, `accept-edits`, `smart-approve` and `auto-approve` plus `explore` and `lean`; a dispatch selects one with `--agent`, and per-tool permission is `ALWAYS`, `NEVER` or `ASK`. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/agents.py:6-18] [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/agents/models.py:15-30] [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/tools/models.py:14-18]

6. The workspace boundary is a policy, not a container: `outside_workdir` is `ask` (default) or `deny`, overridable per tool, with allowlisted paths unaffected; `enable_auto_approve` lets an admin forbid YOLO entirely, and project config plus `AGENTS.md` are gated by folder trust (`--trust` for one invocation). [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/vibe_schema.py:813-822,900-932]

7. Protected paths escalate to a human regardless of the classifier: writes that would decide what executes next — `.vibe` config, `.git/hooks`, `.git/config`, shell startup files — are held for approval, and the module says plainly it is a heuristic over argument text, not a boundary ("only an OS sandbox can make that a guarantee"). [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/mistralai_vibe_local_harness/vibe/_protected_paths.py:1-40]

8. There is no user-facing sandbox mode in 3.1.2: the config schema exposes no sandbox field and `vibe --help` no sandbox flag, while the harness ships a `Sandbox Environment` adapter that runs workspace tools inside a sandbox through a digest-checked helper. Sandboxing is a runtime deployment choice, not a CLI mode a governed executor can turn on per dispatch. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/mistralai_vibe_local_harness/vibe/_sandbox.py:1-20] [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/evidence/vibe-help.txt:17-67]

9. The eight enforcement guards are expressible, with one payload caveat each: spec gate, dispatch preflight, git message gate, MCP route guard, overlay guard, env secret guard and task dispatch guard all run before a named tool, so `pre_tool` + `strict` is the direct analogue; post-edit quality runs after a named tool, so `post_tool` + `strict`. What does not carry over is the OpenCode payload shape (`tool.execute.before/after` arguments) and each guard's state directory, which must move under `.vibe/` or the packet. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/hooks/models.py:19-41] [SOURCE: .dsh/plugins/repo-guards/README.md:80-93]

10. The turn-stopping guards are the real gap: `completion-evidence` and `ask-surface-guard` run on DSH's `agent/turn-stopping`, and Vibe's nearest event is `post_agent`, which cannot be strict. They can report but cannot block a turn, and the goal/session context adapters (`agent/created`, `session/event` compaction, `agent/disposed`) have no Vibe event at all. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/hooks/models.py:19-41] [SOURCE: .dsh/plugins/repo-guards/README.md:84-100]

## Ruled Out

- Treating `--auto-approve` as a sandbox: it suppresses prompts, and the only containment is `outside_workdir` plus protected-path escalation.
- Porting `completion-evidence` as a blocking hook: `post_agent` has no `strict`, so the port degrades to an advisory.

## Dead Ends

- Searching the config schema for a sandbox mode: there is no field, so any "sandbox mode" claim would be documentation-only and is marked UNKNOWN for the CLI.
- Searching the binary for a hook decision JSON schema: the decision protocol is not exposed as strings, so blocking is cited from the `strict` model contract rather than a wire format.

## Edge Cases

- Ambiguous input: "the eight repo guards" names a subset of a 20-adapter bundle. Fixed the set at the eight enforcement adapters listed in the README table and graded the two turn-stopping guards separately.
- Contradictory evidence: the binary changelog says hooks are "three types" while the Python model declares seven. Resolved as stable core three plus host-fired and engine events; both cited.
- Missing dependencies: no live hook was executed, and the workspace has no `.vibe/hooks.toml`, so blocking behaviour is source-read only.
- Partial success: hook events, declaration and safety modes are fully answered; the wire format of a hook decision is UNKNOWN.

## Sources Consulted

- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/hooks/models.py
- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/hooks/config.py
- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/harness_files/_harness_manager.py
- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/vibe_schema.py
- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/agents.py
- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/agents/models.py
- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/tools/models.py
- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/mistralai_vibe_local_harness/vibe/_protected_paths.py
- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/mistralai_vibe_local_harness/vibe/_sandbox.py
- specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/evidence/vibe-help.txt
- .dsh/plugins/repo-guards/README.md

## Assessment

- New information ratio: 1.0
- Questions addressed: What hook system does Vibe expose, at which events, and can a hook block a tool call? Can the eight repo guards be expressed there? What are Vibe's approval and sandbox modes?
- Questions answered: All three parts; the sandbox answer is that no CLI sandbox mode exists, which is an answer rather than a gap.

## Reflection

- What worked and why: grading the guards by their DSH event rather than by name turned a vague "can we port hooks" question into a per-event yes/no, and `strict` is the single field that decides blocking.
- What did not work and why: looking for a sandbox flag. The absence is real and had to be established from both the schema and the CLI capture before it could be stated.
- What I would do differently: read `_protected_paths.py` before the agent-safety enums; it is the sharpest statement in the package about what the permission system does and does not guarantee.

## Recommended Next Focus

Angle 7: deep-loop executor support. Read `runtime/lib/deep-loop/executor-config.ts` and `runtime/scripts/fanout-run.cjs` for the executor-kind contract, the environment allowlist and the model roster, then state exactly what a `cli-mistral-vibe` kind needs.
