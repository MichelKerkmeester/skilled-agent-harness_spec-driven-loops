---
title: "Repo-Guards Project Plugin"
description: "The `repo-guards` project plugin bridges this repository's existing guard cores into a Hermes session through the plugin hook surface, shelling out to each core and failing open."
trigger_phrases:
  - "repo-guards project plugin"
  - "hermes project plugin hooks"
  - "hermes pre_verify guard"
  - "HERMES_ENABLE_PROJECT_PLUGINS"
version: 1.0.0.0
---

# Repo-Guards Project Plugin (repo-guards)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The `repo-guards` project plugin bridges this repository's existing guard cores into a Hermes session through the plugin hook surface, shelling out to each core and failing open.

Hermes keeps shell hooks in the operator's configuration, so a repository cannot carry them. A project plugin is the one hook-bearing surface a repository can carry, and this is it.

---

## 2. HOW IT WORKS

### Hook Surface

The plugin manifest declares six hooks and the registration function registers exactly those six: pre-llm-call, pre-tool-call, transform-tool-result, pre-verify, session-start and session-end, plus four system-prompt sections. Together they bridge every repo hook core Hermes's plugin API can reach: the skill advisor and spec gate at prompt time; the dispatch preflint, task-dispatch guard, MCP route guard, sk-git advisory and sk-vision core before a tool call; post-edit quality on a write result; the shared goal core at session start; the worktree, dist-freshness, git-hooks and primary-reconcile guards as a session section; and session cleanup at session end. The pre-tool-call hook also refuses the write and command tools when the runner marks a leaf read-only (`SPECKIT_HERMES_READ_ONLY`), because Hermes has no read-only file toolset, and stages the sk-git advisory for a git-shaped command, which the transform-tool-result hook appends to that command's result. Three system-prompt sections, each under Hermes's 4000-character cap, carry the session-start context, the persona binding (`HERMES_AGENT_PERSONA=<name>` points the session at the preloaded `agent-<name>` skill) and, when `HERMES_SPEC_FOLDER` names a packet, that packet's path and goal slice. The pre-tool-call hook runs the dispatch preflight core against the command a tool call is about to run, and separately refuses a nested Hermes dispatch launched from inside a Hermes session, on the same reasoning the packet gives for its self-invocation guard. The pre-verify hook runs the completion-evidence core, which blocks a completion claim naming no evidence. The session-end hook records the closing state through the shared lifecycle core.

### Core Bridge

The plugin re-implements no guard logic. Each hook runs an existing core as a subprocess with the same JSON payload the sibling runtime's adapters send, from the repository root, under a bounded timeout, and reads the core's hook-specific output back off its last stdout line. A core that is missing, times out, exits without output, or returns something unparsable resolves to no directive, so the session continues. The stated reason is the usual one: a false block stalls a session while a false pass only reproduces the failure the caller would have seen anyway.

### Enablement

Loading is opt-in twice over. Hermes reads project plugins only when its project-plugin environment variable is set, and only when the plugin's key is also listed in the operator's user-level configuration, which the plugin-enable subcommand refuses to do for a project key. Both are operator steps, recorded in the runtime folder's manifest.

---

## 3. SOURCE FILES

In-process coverage: `.hermes/plugins/repo-guards/tests/test_repo_guards.py` exercises every directive shape with a fake context.


### Implementation

| File | Layer | Role |
|---|---|---|
| `.hermes/plugins/repo-guards/plugin.yaml` | Shared | Plugin manifest: name, kind and the declared hook list. |
| `.hermes/plugins/repo-guards/__init__.py` | Handler | Hook implementations, the core subprocess bridge, the self-dispatch refusal and the registration function. |
| `.opencode/hooks/dispatch/devin/dispatch-preflight-lint.mjs` | Shared | The dispatch preflight core the pre-tool-call hook runs. |
| `.opencode/skills/system-spec-kit/runtime/hooks/devin/completion-evidence-stop.cjs` | Shared | The completion-evidence core the pre-verify hook runs. |
| `.opencode/skills/cli-external-orchestration/cli-hermes/references/hook-contract.md` | Handler | The two hook surfaces and which one a repository can carry. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | Automated test | The rule engine the bridged preflight core evaluates with. |
| `.opencode/hooks/dispatch/lib/dispatch-audit.test.mjs` | Automated test | The dispatch recognition the self-dispatch refusal mirrors. |
| `.opencode/skills/cli-external-orchestration/cli-hermes/manual-testing-playbook/manual-testing-playbook.md` | Manual playbook | Operator scenarios for enabling and exercising the plugin. |

---

## 4. SOURCE METADATA

- Group: Runtime surface
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `runtime-surface/repo-guards-project-plugin.md`

Related references:
- [hermes-runtime-folder.md](hermes-runtime-folder.md) - the folder that carries this plugin and records its operator steps.
- [../dispatch-guards/hard-rule-preflight-checks.md](../dispatch-guards/hard-rule-preflight-checks.md) - the same preflight core reached from outside a Hermes session.
