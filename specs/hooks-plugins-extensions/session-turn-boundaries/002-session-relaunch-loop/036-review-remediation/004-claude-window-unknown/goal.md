---
title: "Goal: Phase 4: claude-window-unknown"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "claude window unknown goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/004-claude-window-unknown"
    last_updated_at: "2026-11-12T12:39:30Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed the phase after one correction pass and an SWE review"
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
# Goal: Phase 4: claude-window-unknown

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A Claude session with no configured context window treats the window as unknown, skips the handover nudge and logs why, so a checkout without `autoCompactWindow` never hands over against a guessed 200,000-token window.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Only `SESSION_RELAUNCH_WINDOW_TOKENS`, a Claude `autoCompactWindow` setting or a `[1m]` model id supplies a window. Any other model has an unknown window. |
| D2 | The Claude nudge emits nothing and logs `context-nudge-skipped` with `reason=window-unknown` when no window resolves. Auto-compaction stays the fallback. |
| D3 | `/doctor:setup` names the missing setting and the README marks `SESSION_RELAUNCH_WINDOW_TOKENS` as read from the environment only. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node --test .skilled/hooks/session-relaunch/tests/context-usage.test.cjs` exits 0 and the case `resolveWindow returns null when no setting and no model marker supplies a window` passes.
- [x] `node --test .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0 and the case `context-nudge skips and logs when the window is unknown` passes.
- [x] `rg -n 'SESSION_RELAUNCH_WINDOW_TOKENS' .skilled/hooks/session-relaunch/README.md` prints one row that says the switch is read from the environment only.
- [x] `/doctor:setup` prints a line that names `SESSION_RELAUNCH_WINDOW_TOKENS` or `autoCompactWindow` when no window is configured.
- [x] `node --test .skilled/hooks/session-relaunch/tests/context-usage.test.cjs .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0.
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
| Phase 4 planning documents | Done | Five files written in `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/004-claude-window-unknown` on 2026-11-12. Measured behavior captured with the `rg` command in `spec.md` |
| Build, two passes | Done | `scratch/red.txt` and `scratch/red-2.txt` hold the failing runs, `scratch/green.txt` the passing files (318 tests, 318 pass, 0 fail) |
| Review | Done | SWE through Devin, read-only, on `scratch/review.diff`: CONDITIONAL with one P1 and two P2, all fixed in the second pass |
| Suites | Done | Relaunch suite 852 of 852, OpenCode plugin 65 of 65, Pi 59 of 59, each exit 0 |
| Second review | Done | SWE through Devin, read-only, on the later passes: PASS with two P2 on `lib/nudge.cjs`. DeepSeek V4.1 Flash fixed both test first, `scratch/red-3.txt` (75 tests, 2 fail), then 75 of 75. Relaunch suite 865 of 865, OpenCode plugin 65 of 65, Pi 59 of 59 |

### Deviations and findings

| Item | Note |
|------|------|
| Doctor check file | The planning step could not name the `/doctor:setup` file. Reading the workflow answered it on 2026-11-12: `.skilled/commands/doctor/assets/doctor-setup.yaml` runs the informational lines, so the hint is a `window` command in the relaunch CLI that one more step shows. |
| Scope grew by two requirements | The review found the skip line appended on every tool call to a log with no size bound, and a `window` command that ignored arguments and called the window unknown on a `[1m]` model. REQ-006 and REQ-007 record the fixes. The orchestrator wired the three `/doctor:setup` files and wrote the two why-comments. |

<!-- /ANCHOR:log -->
