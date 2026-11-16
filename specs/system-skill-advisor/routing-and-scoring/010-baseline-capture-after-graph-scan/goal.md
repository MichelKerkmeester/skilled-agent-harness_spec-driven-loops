---
title: "Goal: Find why a command routing baseline capture run straight after a skill graph scan reads the state from before the scan"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "baseline capture after graph scan goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/010-baseline-capture-after-graph-scan"
    last_updated_at: "2026-11-16T09:33:10Z"
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
# Goal: Find why a command routing baseline capture run straight after a skill graph scan reads the state from before the scan

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Find out why a command routing baseline capture run straight after a skill graph scan can return a value from before the scan, and fix the producer if it is in this repository.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Plan first. The operator chose analyze and plan on 2026-11-16. No advisor file changes until the operator has read `plan.md`. |
| D2 | No wait, retry or sleep is added to the capture before the cause is named. |
| D3 | Not reproduced is an allowed outcome. It is recorded with what was tried, and the vendoring project is told what to record next time. |
| D4 | A host holds its captured values in its own capture file beside the upstream one, and the two fixture tests read it when it exists. The operator chose this on 2026-11-16. |
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] `wc -l scratch/repro-results.txt` prints 10 or more.
- [ ] `rg -n 'Cause:|Not reproduced:' goal.md` prints one line.
- [ ] `handover-to-barter.md` exists in this folder.
- [ ] The two fixture tests print 0 failed against a host capture.
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
| Item 10 read against the capture and the scan handler | Done | The capture sets an empty `SYSTEM_SKILL_ADVISOR_DB_DIR` at line 361. The scan handler awaits its index and embedding steps before it returns |
| Spec, plan and tasks | Done | This folder |
| Packet validation | Done | `validate.sh --strict --quiet` printed `RESULT: PASSED (errors=0 warnings=0)` on 2026-11-16 |
| Reproduction | Pending | None yet |
| Captured fixtures item added | Done | Item 4 of the vendoring project's first handover, added on 2026-11-16 at the operator's choice. The two tests that read the fixtures are named in `spec.md` |

### Deviations and findings

| Item | Note |
|------|------|
| The report was not reproduced before the plan was written | The reproduction runs a trusted scan, which rewrites advisor state. The operator chose plan-only, so it is T001 to T003. |
| Two candidate causes are named in `plan.md` | Both are inferred from reading. Neither has been observed. |

The vendoring project answered on 2026-11-16: the field is `top`, the rows are not recorded, and both stale captures followed an edit to sk-code router sources plus a regenerate step that rewrote `graph-metadata.json`. That is what T002 now reproduces. It also saw launcher lines such as `reclaimed stale bootstrap lock` in its suite log, so a long-lived process is one candidate. Nothing here is confirmed in this repository.
<!-- /ANCHOR:log -->
