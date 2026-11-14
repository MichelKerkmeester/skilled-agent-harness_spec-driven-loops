---
title: "Goal: Phase 2: frontend-reach"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "frontend reach goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/hub-architecture/006-sk-code-audit-remediation/002-frontend-reach"
    last_updated_at: "2026-11-14T12:01:50Z"
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
# Goal: Phase 2: frontend-reach

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make a plainly worded frontend request reach `sk-code-frontend` without sending unrelated requests there.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|---|---|
| D1 | The 22 prompts in `scratch/probes.txt` are the measure. A probe is never edited to make it pass. |
| D2 | No frontend keyword is a single word. |
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] Every line tagged `frontend` in `specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/scratch/probes.txt` returns a decision whose `targets` include `sk-code-frontend`: 13 of 13.
- [ ] No line tagged `negative` in the same file returns a decision whose `targets` include `sk-code-frontend`: 0 of 8.
- [ ] The line tagged `review` returns `sk-code-review` first and `sk-code-frontend` second.
- [ ] `node .skilled/bin/compiled-route-guard.cjs --json` and `node .skilled/bin/compiled-route-sync.cjs --check` both exit 0.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/hub-architecture/006-sk-code-audit-remediation/002-frontend-reach --strict --quiet` prints `RESULT: PASSED`.
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
| Spec, plan, tasks and acceptance criteria authored | Done | Written on 2026-11-14 from the audit evidence in `../001-finding-verification/` |
| Implementation | Pending | Not started |
| Implementation | Done | Probe replay 13/13 frontend, 1/1 review, 0/8 negative at 40b8d7e6b7. Guard and sync exit 0, playbook validator PASS, strict validation PASSED |
| Edge cases | Run | rename the variable returns defer. A prompt matching frontend, CI and SKILLED returns frontend, ci, skilled in tie-break order |
| Deviation: files outside the Files to Change table | Recorded | Three test expectations, phase-detection.md, the feature catalog sentence and the generated graph-metadata.json changed. One test sits outside sk-code, which parent decision D5 names |
| Deviation: T012 command | Recorded | The stale artifact was the activation manifest, refreshed with compiled-route-manifest.cjs refresh, not compiled-route-sync.cjs |
| Deviation: packet router section 2 prose | Recorded | Not extended, because phase 004 replaces it with a pointer to the machine block |

### Deviations and findings

| Item | Note |
|------|------|
| None so far | Nothing has diverged from the directive |
<!-- /ANCHOR:log -->
