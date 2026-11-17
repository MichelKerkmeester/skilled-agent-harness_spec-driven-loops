---
title: "Goal: Stop redispatch_once from re-running an iteration that already landed"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "no redispatch landed iteration goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/013-no-redispatch-landed-iteration"
    last_updated_at: "2026-11-17T14:34:35Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-child-authoring-013"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Stop redispatch_once from re-running an iteration that already landed

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** A deep-loop iteration that already landed is never dispatched a second time because of an `executor_missing` verify failure.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The fix is a reason filter in both workflow YAMLs; `verify-iteration.cjs` is not changed. |
| D2 | Only `executor_missing` is excluded; route-proof reasons keep their redispatch because an append-only retry can correct them. |
| D3 | No other slice is a prerequisite. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] `grep -n 'redispatch_once:.*executor_missing'` prints one line in each of `deep-research.yaml` and `deep-review.yaml`.
- [ ] `npx vitest run` over `verify-iteration.vitest.ts` and `stop-policy-yaml-parity.vitest.ts` exits 0 with the new cases.
- [ ] The YAML assertion fails against the pre-change YAMLs.
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
| Phase spec authored | Done | `spec.md`, `plan.md`, `tasks.md` written 2026-11-17; implementation not started |

### Deviations and findings

| Item | Note |
|------|------|
| Other post-delta reasons | Open question: should `findings_not_enumerated`, `gateway_bypass_detected` and `ledger_backing_missing` also skip the redispatch? Not in scope; D14 names only `executor_missing`. |
<!-- /ANCHOR:log -->
