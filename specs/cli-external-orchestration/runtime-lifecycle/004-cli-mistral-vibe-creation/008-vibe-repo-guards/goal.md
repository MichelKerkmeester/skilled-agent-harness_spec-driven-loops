---
title: "Goal: Phase 8: vibe-repo-guards"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "vibe repo guards goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/008-vibe-repo-guards"
    last_updated_at: "2026-11-14T14:20:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Ported ten guard rows plus the spec-gate classify half to .vibe/hooks.toml; live fixtures pass"
    next_safe_action: "Phase 009 adds cli-mistral-vibe as a deep-loop executor kind"
    blockers: []
    key_files:
      - ".vibe/hooks.toml"
      - ".skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-vibe-plans-2026-11-14"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "What does a Vibe hook receive and how does it answer?"
      - "Does a claude_code-protocol guard script run unchanged under Vibe?"
      - "Does export.json record each tool call outcome?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 8: vibe-repo-guards

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Run this repository's deny-capable guards inside Vibe sessions, with a recorded verdict for every OpenCode plugin.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | This phase owns the hook decision wire format. A fixture hook settles it before any guard is ported |
| D2 | The port list comes from the 21-row classification table. Research section 6 is its starting point, not its limit |
| D3 | Completion-evidence, ask-surface and session-relaunch are classified not portable and get no task |
| D4 | A guard works only when its deny shows where the wire-format fixture found denies recorded. Exit code is not evidence |
| D5 | No default model changes. DevPass stays the default |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] The classification table in `references/guards-and-hooks.md` holds 21 plugin rows
- [x] The wire-format section quotes a recorded hook input and deny reply
- [x] Each ported guard has a fixture run that shows its deny and one that shows a clean call completing
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
| Plugin count | Done | `ls .opencode/plugins/*.js \| wc -l` printed 21 on 2026-11-14 |
| Classification | Done | 21 rows in `guards-and-hooks.md` section 4; ten hook rows built here, the goal bridge and dist-freshness left to phase 011 |
| Wire format | Done | Fixture under `.vibe/plugins/repo-guards/fixtures/wire-format/`; a deny is a journal `hook_completed` record with output type `skip`, never `export.json` |
| Guard ports | Done | 12 `[[hooks]]` entries in `.vibe/hooks.toml` over 11 scripts; every script denies or annotates its violating payload and prints nothing for the clean and the malformed one |
| Live fixtures | Done | Live DENIED on violating and NOT-DENIED on clean for env-secret, spec gate, dispatch preflight, overlay, git-message and deep-loop guard; post-edit findings appended to the live tool result; session-cleanup's startup context reached the model |
| Strict placement | Done | 0 strict entries outside `pre_tool`, `post_tool` and `pre_agent`; no `strict is only valid` text in any run output |
| OpenCode plugins | Done | `git diff --stat -- .opencode/plugins` printed nothing, staged or unstaged |

### Deviations and findings

| Item | Note |
|------|------|
| Plugin count | `ls .opencode/plugins \| wc -l` prints 26, not 21. The 21 `.js` files are the plugins; the other 5 entries are docs, `lib`, `relative-repo` and `tests` |
| Wire format | Settled: one JSON object on stdin, exit 0 with empty stdout allows, `{"decision":"deny","reason":...}` refuses, `hook_specific_output.additional_context` annotates `post_tool`, `pre_agent` and `session_start` |
| Protocol reuse | Not used. Each port is a `vibe`-protocol Node script over the shared core, because the cores take a generic call shape that `lib/hook-io.mjs` maps Vibe's qualified tool names onto |
| Spec gate needs two hooks | A `pre_tool` hook never sees the operator prompt, so nothing would open the gate. `spec-gate-classify.mjs` runs at `pre_agent`, persists the same per-session state, and the strict `pre_tool` half reads it. The shared core's deny is opt-in, so the hook supplies `SYSTEM_SPEC_GATE_ENFORCE=1` only when the variable is unset |
| Payload-only proof | mcp-route-guard and classifier-injection-screen deny or annotate their payloads, but their live violating runs could not raise the call: a throwaway project has no MCP server, and the local fetch returned a proxy error page instead of the crafted text |
| Fixture runner | Deny detection now walks the journal as JSON, because a reason holding `]` broke the earlier regex; it also prints every hook outcome and copies a fixture's `tree/` into the project |
| Dispatched children were denied | Found after close: both spec-gate hooks deleted an inherited `AI_SESSION_CHILD=1` when the payload had no parent, which is every headless `vibe -p`, so a dispatched write was denied. Both now treat the inherited variable or a payload parent as the child signal; `tests/spec-gate.test.mjs` covers it |
<!-- /ANCHOR:log -->
