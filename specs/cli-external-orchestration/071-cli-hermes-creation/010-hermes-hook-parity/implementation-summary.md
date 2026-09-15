---
title: "Implementation Summary"
description: "The repo-guards Hermes plugin now bridges every repo hook core Hermes's plugin API can reach: prompt-time advisor brief and spec gate, post-edit quality, task-dispatch and MCP route guards, the shared goal core, session-start advisories, session cleanup and vision evidence, implemented on cli-pi with DeepSeek V4.1 Flash and proven live in seven scenarios."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/071-cli-hermes-creation/010-hermes-hook-parity"
    last_updated_at: "2026-09-15T08:40:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Ten bridges landed on Pi dispatches and proven live"
    next_safe_action: "None; phase closed"
    blockers: []
    key_files:
      - ".hermes/plugins/repo-guards/__init__.py"
      - ".hermes/plugins/repo-guards/tests/test_repo_guards.py"
      - ".hermes/SYNC.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-071-010-hermes-hook-parity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "pre_llm_call carries the prompt-time hooks: Hermes appends the returned context to the user message"
      - "post and transform hooks run on separate bounded threads, so a result advisory must be computed in the transform hook"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-hermes-hook-parity |
| **Completed** | 2026-09-15 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A Hermes session now runs the same guards as the other six runtimes wherever Hermes's plugin API offers a seam; the four hook packages that stay out are runtime-specific by nature.

### Phase 10: hook parity

You get ten more bridges in the one `repo-guards` plugin, each shelling out to the existing core with the runtime-neutral payload. Before a tool call: the task-dispatch guard evaluates every entry of a `delegate_task` batch and blocks a rejected one; the MCP route guard advises on a native call to a family Code Mode can route; the sk-vision core stages its evidence for an image analysis. On a tool result: the post-edit quality core runs for `write_file` and `patch` and appends its warning (inside the transform hook, because Hermes runs post and transform hooks on separate bounded threads). At prompt time, through `pre_llm_call`: the skill advisor brief every turn and the Gate 3 question on the first turn, both skipped for an orchestrated leaf. At session start: the shared goal core binds the packet under the Hermes session id, and a fourth prompt section carries the worktree, dist-freshness, git-hooks and primary-reconcile warnings. At session end: the cleanup core reaps the MCP helpers the process spawned.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.hermes/plugins/repo-guards/__init__.py` | Modified | ten bridges; six hooks; four sections |
| `.hermes/plugins/repo-guards/plugin.yaml` | Modified | `pre_llm_call`, `on_session_start` declared |
| `.hermes/plugins/repo-guards/tests/test_repo_guards.py` | Modified | 42 tests |
| `.opencode/skills/system-spec-kit/runtime/hooks/pi/session-start-advisories.ts` | Modified | the dist checker run with `python3`, not `bash` |
| `.hermes/SYNC.md`, `cli-hermes/references/hook-contract.md`, catalog leaf | Modified | full hook map |
| `cli-hermes/manual-testing-playbook/**` | Created (7) | `HERMES-024` to `HERMES-030` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Four dispatch groups went to `cli-pi` with `llmgateway/deepseek-v4.1-flash` at max thinking, each brief one bridge group with the code persona inlined. After each, the conductor ran the harness, `hermes plugins validate`, an in-process run against the real cores, and a live session. Two defects the harness could not see were found live and sent back as one-change fix dispatches: the post-edit advisory raced the transform thread, and the delegation bridge read top-level keys while Hermes sends a `tasks` array. Two more were fixed in place: the dist checker is Python behind a `.sh` name (the pi collector shared the defect), and the vision tool was hidden until a vision provider resolved.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Run the post-edit core in the transform hook | The post hook's staging is not visible to the transform on another bounded thread |
| Bind the shared goal core by session id, keep the env slice as fallback | The core is the single source the other runtimes use; the slice covers a session the core cannot see |
| Advisor kill switches checked in the plugin | The advisor CLI ignores its own switches |
| Vision provider set at the operator level, not worked around | The tool exists only when Hermes resolves a vision client; the gateway model reads images |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `python3 .hermes/plugins/repo-guards/tests/test_repo_guards.py` | `Ran 42 tests ... OK` |
| `hermes plugins validate .hermes/plugins/repo-guards` | `Validation passed.` |
| HERMES-024 post-edit advisory | live, `COMMENT HYGIENE WARNING` on the write result |
| Post-run hardening | The full playbook run found the sk-git advisory never reaching a live result and the vision core on the fail-closed hook; all three staged advisories moved into `transform_tool_result` and vision got a 25-second budget, re-verified live |
| HERMES-025 delegation block | live, `REFUSED: system-deep-loop-guard: Deep Route mode mismatch ...` |
| HERMES-026 MCP route guard | in-process advisory for a ClickUp-shaped call; live Code Mode call silent |
| HERMES-027 session advisories | live, section 572 chars, worktree-guard line quoted |
| HERMES-028 advisor brief and gate | live, `ADVISOR` and `GATE` |
| HERMES-029 vision evidence | live, `<SK-VISION EVIDENCE>` on the tool result |
| HERMES-030 goal core binding | live, `goal.cjs show` reports the goal for the session id |
| Playbook and catalog validators | `violations=0`; `PASS: 0 violations` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The MCP route guard's positive path has no live case on this machine**: the only configured server is Code Mode, which the guard never advises against.
2. **Session cleanup is proven with a faked subprocess only**; running it for real would reap this session's own helpers.
3. **The primary-reconcile guard now runs at every Hermes session start**, as it does for Pi and Claude, and can fetch, rebase and push the live branch on a clean tree.
<!-- /ANCHOR:limitations -->

---
