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
    recent_action: "Planned the plugin classification, wire-format fixture and guard ports"
    next_safe_action: "After phase 006 lands, run T001 to T003 to write the classification table"
    blockers:
      - "MISTRAL_API_KEY is unset, so no hook fixture can fire"
      - "Phase 006 has not created .vibe/ yet"
    key_files:
      - ".vibe/hooks.toml"
      - ".skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-vibe-plans-2026-11-14"
      parent_session_id: null
    completion_pct: 0
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

- [ ] The classification table in `references/guards-and-hooks.md` holds 21 plugin rows
- [ ] The wire-format section quotes a recorded hook input and deny reply
- [ ] Each ported guard has a fixture run that shows its deny and one that shows a clean call completing
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
| Classification | Pending | Needs no key. Waits on phase 006 and the `guards-and-hooks.md` reference phase 005 creates |
| Wire format | Pending | Needs `MISTRAL_API_KEY`, unset on 2026-11-14 |
| Guard ports | Pending | Wait on the wire format (D1) |

### Deviations and findings

| Item | Note |
|------|------|
| Plugin count | `ls .opencode/plugins \| wc -l` prints 26, not 21. The 21 `.js` files are the plugins. The other 5 entries are `ARCHITECTURE.md`, `README.md`, `lib`, `relative-repo` and `tests`, so the research count of 21 holds |
| Wire format | Open question: what does a Vibe hook receive and how does it answer? This phase owns it (D1), and the T004 fixture settles it |
| Protocol reuse | Open question: does a guard script written for Claude's hook format run unchanged under Vibe's `claude_code` protocol? The T004 fixture decides whether each port needs an adapter |
| Deny evidence | Open question: does `export.json` record each tool call's outcome, or only the run's? No hook has run yet (research section 12). T004 and T005 record where a deny is visible before any guard fixture relies on it |
| Porting sources | The hook commands in `.claude/settings.json` are Claude-format scripts, and `.dsh/plugins/repo-guards/` is a prior re-expression of the same guards for dsh |
<!-- /ANCHOR:log -->
