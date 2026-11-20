---
title: "Goal: Phase 10: readme-text-diagrams"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "readme text diagrams goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/document-standards/006-readme-template-conformance/010-readme-text-diagrams"
    last_updated_at: "2026-11-18T10:21:38Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "3984aaec-9181-4f22-ae90-fe5d131a5589"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 10: readme-text-diagrams

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Every README draws its diagrams as plain box-drawing text, and the skill README template no longer asks for Mermaid.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Only the Mermaid fence changes in each README. Each new diagram keeps the nodes and edges of the block it replaces. |
| D2 | One Hy4 Flash Free writer session and a separate Hy4 reviewer session per README, as Q012 records. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `git ls-files '*README.md' | xargs rg -l '```mermaid'` prints nothing
- [x] `boxcheck.py` prints `OK` for all 55 files, and each prints `VALID` with 0 hard voice blockers
- [x] `validate.sh --strict` on this phase prints `RESULT: PASSED` and the phase commit is on origin/main
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
| Rule edits | Done | The template, the writing patterns and the checklist ask for a text diagram |
| Writers and reviewers | Done | 55 diagrams redrawn, 53 reviewer passes, 2 confirmed findings fixed |
| Gates | Done | 55 `VALID` and `OK`, suite exit 0, `PARITY PASS`, 0 broken links |

### Deviations and findings

| Item | Note |
|------|------|
| The program goal kept templates out of scope | Recorded as a third amendment in the parent goal and as Q013 in the parent decision record |
| The sk-doc suite failed on the README manifest | Phase 009 gave `.skilled/repo-rules` a README without refreshing the manifest, so this phase refreshed it |
<!-- /ANCHOR:log -->
