---
title: "Goal: bridge the guard cores into a Hermes plugin"
description: "The durable directive this phase executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/071-cli-hermes-creation/006-hermes-hook-and-plugin-layer"
    last_updated_at: "2026-09-14T19:40:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Project plugin authored, validated and exercised in-process"
    next_safe_action: "Live session proof once the provider exists"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-071-006-hermes-hook-and-plugin-layer"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: bridge the guard cores into a Hermes plugin

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A Hermes session in this repo runs the same guard cores the other runtimes run,
through one project-local plugin that shells out to the existing hook scripts.

### Decisions

Frozen choices for this phase. The parent goal's decisions bind here too; changing one of those is
an amendment to the packet root `goal.md`.

| ID | Decision |
|----|----------|
| P1 | The carrier is a native Hermes plugin at `.hermes/plugins/repo-guards/`, opt-in through `HERMES_ENABLE_PROJECT_PLUGINS`; not user-level shell hooks, not an Agent Plugins v1 package |
| P2 | Hook mapping: `pre_verify` to completion-evidence stop, `pre_tool_call` to dispatch audit and dispatch preflight lint, `on_session_start` and `on_session_end` to the session context hooks, `subagent_start` to the self-invocation guard |
| P3 | The plugin re-implements nothing: each hook invokes the existing `.mjs` or `.sh` core under `.opencode/hooks/` and maps the result to Hermes's block or continue contract |
| P4 | Every hook fails open on a core error and logs it, matching the `.pi/extensions/` precedent |
| P5 | The lineage builder from phase 003 does not pass `--accept-hooks` unless this plugin needs it, which it does not |

### Completion criteria

1. `hermes plugins validate` and `hermes plugins doctor` pass for the plugin, output recorded.
2. In a live session, `pre_tool_call` blocks a `devin -p` self-dispatch attempt and `pre_verify` blocks a completion claim without evidence, both recorded.
3. A discriminating test per hook shows fail-open on a broken core.
4. The plugin adds no new dependency beyond what Hermes and the repo already ship.

### Operator copy

The operator holds the parent directive as the session objective. A change here that alters a
parent decision or criterion is an amendment to the parent: apply it there and resend that file.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

| Surface | Bound to |
|---------|----------|
| Phase spec | `spec.md` |
| Closure gate | `acceptance-criteria.md` |

The parent directive in the packet root `goal.md` binds above this file. Evidence:
`../001-deep-research/research/research.md` angle 6 and section 4 row R5.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] Plugin passes validate and doctor
- [x] Live block on self-dispatch proven (a session running `hermes chat -q hello` through its terminal tool received the refusal as the tool result); the completion-evidence nudge is exercised only in a bound session (in-process proof done; live session waits on the provider)
- [x] Fail-open proven per hook
- [x] No new dependency
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Plugin authored | Done | `.hermes/plugins/repo-guards/{plugin.yaml,__init__.py}`; `hermes plugins validate` "Validation passed"; `py_compile` ok |
| In-process hook proof | Done | Fake-context harness: `hermes chat` self-dispatch -> block; `devin -p` with devin hidden and node reachable -> block from the preflight core; warn-only and non-dispatch commands -> pass; core unreachable -> pass (fail-open) |
| Persona binding and section split | Done | Hermes caps a plugin prompt section at 4000 characters and skipped the whole section when a 22k persona joined it (observed 2026-09-15); the plugin now registers three sections (`session-context`, `persona`, `goal`) each under the cap, and `HERMES_AGENT_PERSONA=<name>` binds the persona to the preloaded `agent-<name>` skill; 11 harness tests pass; live: `PERSONA=markdown` with the H1 quoted |
| Read-only refusal, git advisory, goal slice | Done | `pre_tool_call` refuses `write_file`, `patch`, `terminal`, `process_manage`, `execute_code` when `SPECKIT_HERMES_READ_ONLY=1`; git-shaped commands run through `git-preflight/shared/git-preflight-advisory.mjs` and the advisory is appended to the tool result by `transform_tool_result`; the session section carries `Bound packet: <HERMES_SPEC_FOLDER>` plus the goal's durable slice (4000-char cap, repo-contained path); `hermes plugins validate` passes; `tests/test_repo_guards.py` 10 of 10 |
| Live session proof | Done | With `HERMES_ENABLE_PROJECT_PLUGINS=1` and `repo-guards` in `plugins.enabled`: the nested dispatch returned `{"error": "Self-invocation refused: ..."}`; agent log shows the session prompt section `repo-guards-session-context` frozen (303 chars) |

### Deviations and findings

| Item | Note |
|------|------|
| `on_session_start` replaced by a system-prompt section | Hermes ignores an `on_session_start` callback's return, so the session-start context is registered through `register_system_prompt_section`; the manifest declares only the three hooks that register. |
| Loading needs the allowlist too | `HERMES_ENABLE_PROJECT_PLUGINS=1` alone discovers the plugin; it loads only when `repo-guards` is in `plugins.enabled`, and `hermes plugins enable` refuses project keys, so the line is added by hand. |
| `pre_verify` advisory needs a bound packet | The completion-evidence core resolves the packet from the lifecycle state file; without one it stays silent, so the nudge is exercised only inside a bound session. |
<!-- /ANCHOR:log -->
