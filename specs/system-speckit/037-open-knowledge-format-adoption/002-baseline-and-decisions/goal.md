---
title: "Goal: Phase 2: baseline-and-decisions"
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
    packet_pointer: "system-speckit/050-open-knowledge-format-adoption/002-baseline-and-decisions"
    last_updated_at: "2026-10-04T08:13:09Z"
    last_updated_by: "claude-sonnet-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-04-speckit-050"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 2: baseline-and-decisions

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Freeze the numbers and settle four decisions before any product file changes. Done when: baseline.md lists the command and the commit behind every number, and a rerun gives the same number; decision-record.md records decisions D1 to D4 (contextType policy, R1 shape, phase 006 threshold, enforcement scope), each with evidence and an owner; the document-kind versus session-kind question for the 10-value and 11-value contextType lists is answered with file:line evidence from the call sites; the labeled citation sample is enlarged with two labelers from different model families, or the shortfall is recorded and the phase 006 threshold defaults to not building; git status --short .skilled/skills prints nothing.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Research and decisions only. No file under .skilled/skills changes in this phase. |
| D2 | A baseline number that cannot be reproduced is marked UNKNOWN, never dropped. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] baseline.md lists the command and the commit behind every number, and a rerun gives the same number
- [x] decision-record.md records decisions D1 to D4 (contextType policy, R1 shape, phase 006 threshold, enforcement scope), each with evidence and an owner
- [x] the document-kind versus session-kind question for the 10-value and 11-value contextType lists is answered with file:line evidence from the call sites
- [x] the labeled citation sample is enlarged with two labelers from different model families, or the shortfall is recorded and the phase 006 threshold defaults to not building
- [x] git status --short .skilled/skills prints nothing
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
| Phase opened | Pending |  |
| Census, call sites, addendum, D1-D4, labeled sample | Done | baseline.md, decision-record.md, scratch/agreement.json |
| Operator approval of D1-D4 | Pending | acceptance-criteria.md AC-006 |
| Operator approval of D1-D4 | Done | approved with the UX and command-surface condition; D3 condition 3 deferred to 006 (decision-record.md) |
| Baseline correction | Done | post-alias outliers are 100 contextType + 3 importance_tier, not 80 (baseline.md section 2) |

### Deviations and findings

| Item | Note |
|------|------|
| None yet |  |
<!-- /ANCHOR:log -->
