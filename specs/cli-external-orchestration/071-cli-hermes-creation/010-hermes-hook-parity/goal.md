---
title: "Goal: Phase 1: hermes-hook-parity"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/010-hermes-hook-parity"
    last_updated_at: "2026-09-15T05:17:37Z"
    last_updated_by: "scaffold"
    recent_action: "Ten bridges landed on Pi dispatches and proven live"
    next_safe_action: "None; phase closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 1: hermes-hook-parity

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything between the frontmatter and the log is the DURABLE SLICE: it is
> what an operator sets as the session objective, and it must stay true for the
> life of the packet. The frontmatter above it is bookkeeping and never leaves
> this file: it is not sent in chat, not injected, not stored in an objective.
> Keep the slice short. A phase parent or top-level packet warns past 3000
> characters and fails past 4000, measured from the frontmatter's closing fence
> to the log anchor; the runtime goal surfaces cap what they hold, and a
> truncated objective loses its tail, which is where the criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** The `repo-guards` Hermes plugin bridges every repo hook core that Hermes's plugin
API can reach, so a Hermes session runs the same guards as the other six runtimes.

### Decisions

| ID | Decision |
|----|----------|
| P1 | One plugin, many hooks: every bridge lives in `.hermes/plugins/repo-guards/__init__.py` and shells out to the existing core with the runtime-neutral JSON payload the Devin adapters send; no core is re-implemented |
| P2 | Bridges: `post-edit-quality` (post_tool_call on `write_file`, `patch`), `mcp-route-guard` (pre_tool_call on MCP tools), `task-dispatch` (pre_tool_call on `delegate_task`), `git-worktree-guard`, `dist-freshness`, `git-hooks-check`, `git-primary-reconcile` (session-start advisories), `session-cleanup` (on_session_end), the shared goal core bound by Hermes session id (on_session_start), `sk-vision` (pre_tool_call on the vision tool) |
| P3 | Prompt-time hooks (`skill-advisor`, `spec-gate`) bridge through `pre_llm_call`, whose returned context Hermes appends to the user message (trial verdict 2026-09-15: bridgeable) |
| P4 | Out of scope by nature: `codex-watchdog` (OpenCode), `directive-lifecycle` (Claude), `permission-policy` (Devin), `hook-install` |
| P5 | Implementation runs on `cli-pi` with `deepseek-v4.1-flash` at max through `llmgateway`, one bridge group per dispatch; every bridge gets a harness test and a live playbook scenario |
| P6 | Every hook fails open and every prompt section stays under Hermes's 4000-character cap |

### Completion criteria

1. Every P2 bridge is registered, unit-tested in the plugin harness, and proven in a live Hermes session with recorded evidence.
2. The P3 trial has a recorded verdict.
3. `.hermes/SYNC.md`, the hook contract and the catalog leaf list every bridge; the playbook covers each with an executed scenario.

### Operator copy

The operator holds the parent directive as the session objective. A change here that alters a
parent decision or criterion is an amendment to the parent: apply it there and resend that file.
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [x] Every P2 bridge registered, harness-tested and proven live with recorded evidence
- [x] The `pre_llm_call` trial for the prompt-time hooks has a recorded verdict: bridgeable, both hooks reach the user message
- [x] SYNC.md, hook contract, catalog leaf and playbook cover every bridge; package validators pass
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Dispatch 1 (post-edit-quality, mcp-route-guard, task-dispatch) | Done | cli-pi `llmgateway/deepseek-v4.1-flash` thinking max: 16 harness tests; `post_tool_call` staging raced the bounded transform thread live, so a second dispatch moved the core into `transform_tool_result` (live 2026-09-15: `COMMENT HYGIENE WARNING` appended to a `write_file` result, session `20260915_074652_824086`); the delegation bridge read only top-level `goal`/`context` while Hermes sends a `tasks` array, so a third dispatch fixed it: 17 harness tests; live 2026-09-15 under `SYSTEM_DEEP_LOOP_GUARD_REJECT=1` a `delegate_task` whose task goal declared `Agent: @deep-research` with `mode=review` returned `BLOCKED: system-deep-loop-guard: Deep Route mode mismatch ...` in 21 s (session `20260915_075336_71898f`). MCP route guard: Hermes registers MCP tools as `mcp__<server>__<tool>`, the core's own form; a ClickUp-shaped call gets the advisory in-process, and the only configured server (`code_mode`) is silent by design, so the live check is a negative control (live 2026-09-15: `TOOLS=10`, `NO_ADVISORY`, session `20260915_083406_ca99f7`) |
| Dispatch 2 (session-start advisories, session cleanup) | Done | 23 harness tests; a fourth prompt section `repo-guards-session-advisories` runs worktree-guard, dist-freshness, git-hooks-check and git-primary-reconcile and joins their warnings; `on_session_end` reaps MCP helpers through the cleanup core with the Hermes PID. Conductor fix: the dist checker is Python behind a `.sh` name, so each guard now names its interpreter and the section reads stderr or stdout (the pi collector had the same defect and was corrected). Live 2026-09-15: section rendered at 572 chars and the session quoted the worktree-guard line (session `20260915_080054_2ae5e2`) |
| Dispatch 3 (native goal binding, vision) | Done | 34 harness tests. `on_session_start` binds the packet named by `HERMES_SPEC_FOLDER` through `goal.cjs bind --runtime hermes --session <id>` once, and the goal section renders the core's `show` lines. Live 2026-09-15: session `20260915_080753_e6cc2e` quoted the bound packet and the objective, `goal.cjs show` reports `goal_present=true` for that session, section 2655 chars; the state record lands under the gitignored `.opencode/skills/.state/goal/` |
| Vision live | Done | The tool was hidden because no vision provider resolved; `auxiliary.vision.provider=llmgateway` and `auxiliary.vision.model=deepseek-v4.1-flash` were set under backup `~/.hermes/config.yaml.bak-20260915-hermes-071-vision` (rollback: `cp` it back). Live 2026-09-15: `vision_analyze` completed in 22 s and its result carried `<SK-VISION EVIDENCE>` (session `20260915_082637_0f75f1`) |
| Delegation scenario re-run | Done | Prompt token changed to `REFUSED` for the playbook validator; live 2026-09-15: `REFUSED: system-deep-loop-guard: Deep Route mode mismatch ...` in 38 s (session `20260915_082815_aca5a1`) |
| Post-run hardening (advisory placement, vision budget) | Done | The full playbook run on 2026-09-15 showed the sk-git advisory never reaching a live terminal result: three advisories were computed in `pre_tool_call` and stashed under an exact string key for `transform_tool_result` to pop, a hand-off that does not survive a live session. All three now compute inside the transform hook and the staging dict is gone. The same run showed the sk-vision core on `pre_tool_call`, the one hook Hermes fails closed on timeout, needing about 12.5 s against a 15-second budget; it moved to the fail-open transform hook with its own 25-second budget. 42 harness tests, and the new tests fail 6 against the pre-fix plugin. Live: `HERMES-014` session `20260915_151323_3141f2` and `HERMES-029` session `20260915_151426_ba137d` |
| Dispatch 4 (prompt-time: skill advisor, spec gate) | Done | 42 harness tests; `pre_llm_call` returns `{"context": ...}` appended to the user message; the gate runs on the first turn only and both skip for an orchestrated leaf. Live 2026-09-15: a write-intent prompt reported `ADVISOR` and `GATE` (session `20260915_082955_5bc29b`, 20 s); an earlier probe reported `NO_GATE` only because its own wording ("do not create or edit any file") classifies as read-only, which the core confirmed directly |

### Deviations and findings

| Item | Note |
|------|------|
| Hermes bounds `post_tool_call` and `transform_tool_result` on worker threads | A post hook cannot stage state for the transform hook; an advisory that must reach the result is computed inside the transform hook itself. The full run later showed the same is true of `pre_tool_call`: no advisory may be staged in one bounded hook for another to find, whatever the key. |
| The vision tool was hidden until a vision provider resolved | `auxiliary.vision.provider=llmgateway` with `auxiliary.vision.model=deepseek-v4.1-flash` set in `~/.hermes/config.yaml` under a fresh backup; the plugin needed no change. |
| The advisor CLI ignores its own kill switches | The plugin checks the documented switches itself before asking for a brief. |
| `delegate_task` carries a `tasks` array | The runtime-neutral `run_subagent` payload needs the goals joined from that array, not from top-level keys. |
<!-- /ANCHOR:log -->
