---
title: "Goal: Phase 19: vibe-relaunch-command-tier"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "vibe relaunch command tier goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/019-vibe-relaunch-command-tier"
    last_updated_at: "2026-11-14T21:45:00Z"
    last_updated_by: "mistral-vibe-worker"
    recent_action: "Built the Vibe command-only relaunch tier; suites pass, manual hop blocked"
    next_safe_action: "Run the manual hop from an interactive terminal"
    blockers:
      - "T011 manual hop needs an interactive operator at a terminal"
    key_files:
      - ".skilled/bin/skilled-loop"
      - ".skilled/hooks/session-relaunch/lib/relaunch-core.cjs"
      - ".skilled/hooks/session-relaunch/bin/session-relaunch.cjs"
      - ".skilled/hooks/session-relaunch/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-support-2026-11-14"
      parent_session_id: null
    completion_pct: 93
    open_questions:
      - "Does a real Vibe hop claim the note from the seed without a turn-start claim part?"
      - "Should skilled-loop vibe export VIBE_SPEC_FOLDER from the claimed note?"
      - "Does vibe -p --resume continue a headless run when the roster guard allows the dispatch?"
    answered_questions:
      - "vibe -p --resume <id> --model <alias> exits 1 with '--model only applies to a new session'."
      - "A resume dispatch without --model is refused by the vibe-closed-roster hard rule."
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 19: vibe-relaunch-command-tier

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Let a Vibe session started through `skilled-loop vibe` hand off to a fresh Vibe session that claims the note.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Command-only tier: the operator runs `/speckit-handoff` and exits Vibe; no hook arms the hop or ends the session |
| D2 | The relaunch starts a fresh `vibe "<seed>"` session, never `--continue` or `--resume`, because those reopen the same conversation and shed no context |
| D3 | No `--model` on the interactive launch, because `vibe --help` documents it as headless-only |
| D4 | A dispatched child (`AI_SESSION_CHILD=1`) never claims or nudges |
| D5 | The automatic tier stays out of scope |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` prints `fail 0`
- [ ] `node .skilled/hooks/session-relaunch/bin/session-relaunch.cjs history` shows one claimed hop with runtime `vibe`
- [x] `scratch/resume-probe.md` records the headless `--resume` command, its exit code and a verdict
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
| Baseline | Done | 957 pass, fail 0 (`scratch/baseline.txt`) |
| Build | Done | Runtime list, wrapper case and option tables, prepare message, README row and tests |
| Suites | Done | 960 pass, fail 0 (`scratch/final-suite.txt`) |
| Manual hop | Blocked | Needs an interactive terminal; the prepare line and both decisions are recorded (`scratch/manual-hop.md`) |
| Resume probe | Done | First run exit 0; resume attempts exit 1; verdict UNVERIFIED (`scratch/resume-probe.md`) |

### Deviations and findings

| Item | Note |
|------|------|
| Turn-start claim part | The design source proposed claim and withdraw parts modelled on `codex/prompt-seed.mjs`. Codex is an automatic-tier runtime; the command-only Cursor and Devin rows carry the claim in the seed with no hook, so this phase adds a part only if T011 shows the seed claim fails |
| Resume guard conflict | `vibe -p --resume <id> --model <alias>` exits 1 with `--model only applies to a new session`, while the `vibe-closed-roster` hard rule refuses a resume dispatch without `--model`. The resume path is UNVERIFIED |
| Interactive hop | T011 needs a terminal; this worker is non-interactive. The command-only prepare line was exercised against a temporary note and state directory |

Open question: should `skilled-loop vibe` export `VIBE_SPEC_FOLDER` from the claimed note, so the relaunched session gets the goal slice at start? Not added in this phase; the Vibe session-start hook reads it, but the manual hop is the deciding evidence.

Open question: does `vibe -p --resume <session_id>` continue a headless run that stopped on a budget? UNVERIFIED: the roster guard and Vibe's model-on-resume refusal block the probe.
<!-- /ANCHOR:log -->
