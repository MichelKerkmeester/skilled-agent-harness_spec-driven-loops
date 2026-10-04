---
title: "Goal: Phase 4: citation-drift-detection"
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
    packet_pointer: "system-speckit/050-open-knowledge-format-adoption/004-citation-drift-detection"
    last_updated_at: "2026-10-04T09:20:00Z"
    last_updated_by: "claude-sonnet-5-5"
    recent_action: "Added the operator UX and command-surface criterion"
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
# Goal: Phase 4: citation-drift-detection

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Publish an honest citation-breakage census across spec docs and skill docs that tells a moved file from a wrong claim. Done when: the default run of cite-drift-scan.mjs makes zero model calls, reads no credential and writes no file; cite-drift-scan.mjs has a corpus option that reads spec packets and research artifacts, and its fixture tests exit 0; the census names its commit and splits broken citations into moved, gone and past-end for each doc family; rerunning the recorded census command on that commit gives the same counts; /doctor:speckit shows a read-only citation-drift summary per doc family that makes no model call and names the new path of each moved citation.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Reporting only: no validator rule, no new citation form, no edit to any citing doc. |
| D2 | Each redirect-table entry is checked against the git rename record. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] the default run of cite-drift-scan.mjs makes zero model calls, reads no credential and writes no file
- [x] cite-drift-scan.mjs has a corpus option that reads spec packets and research artifacts, and its fixture tests exit 0
- [x] the census names its commit and splits broken citations into moved, gone and past-end for each doc family
- [x] rerunning the recorded census command on that commit gives the same counts
- [x] /doctor:speckit shows a read-only citation-drift summary per doc family that makes no model call and names the new path of each moved citation
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
| phase 004 build | 5 of 6 criteria met | census sha dec373f6 four identical runs, 45/45 tests, doctor step, --moved listing 27,320; proposal criterion needs operator decision (written after census seen, commit held by D4) |

### Deviations and findings

| Item | Note |
|------|------|
| None yet |  |
<!-- /ANCHOR:log -->
