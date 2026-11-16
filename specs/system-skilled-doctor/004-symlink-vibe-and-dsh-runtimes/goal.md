---
title: "Goal: Add the Mistral Vibe and DSH runtimes to the doctor link manifest and its runtime lists"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "symlink vibe and dsh runtimes goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/004-symlink-vibe-and-dsh-runtimes"
    last_updated_at: "2026-11-16T10:15:56Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Add the Mistral Vibe and DSH runtimes to the doctor link manifest and its runtime lists

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** A project links the Mistral Vibe and DSH runtime folders through `/doctor:symlink`, as it links every other runtime.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Plan first. The operator chose a plan in a new packet on 2026-11-16. No manifest change until the operator says to build. |
| D2 | Both runtimes are in scope, not Vibe alone. The operator chose this on 2026-11-16. |
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `node --test .skilled/commands/doctor/scripts/tests` prints `fail 0` with the two new tests in the count.
- [x] `symlink-engine.cjs check --runtimes vibe,dsh` prints no `unknown runtime` line.
- [x] `rg -c 'vibe' .skilled/commands/doctor/symlink.md` prints a number above 0.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Report checked against the manifest | Done | `symlink-engine.cjs check --runtimes vibe` printed `ERROR: unknown runtime: vibe`, and the same for `dsh` |
| Spec, plan and tasks | Done | This folder |
| Build | Pending | None yet |
| Live session per runtime in a linked scratch project | Done | vibe 3.1.2 with --trust ended exit_code 0, outcome finished and listed 55 Skilled skills. dsh 0.2.2-rc.3 headless exited 0 with a final event of kind completed and listed 55 Skilled skills and the agent lead. Without --trust Vibe ignored the linked .vibe folder |

### Deviations and findings

| Item | Note |
|------|------|
| The report named three documents with a runtime list | Six hold one. `install.md`, `doctor-install.yaml` and `doctor-install-presentation.txt` repeat the list too. |
| The report asked whether DSH is meant to be linked | `doctor-runtime-mirrors.yaml` names `.dsh` and `.vibe` beside the other runtime folders, so both are planned. |
<!-- /ANCHOR:log -->
