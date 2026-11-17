---
title: "Goal: Move the changelog spec-folder blockquote from under the summary to the end of the entry in the template and in every existing changelog"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "changelog spec folder at bottom goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/document-standards/007-changelog-spec-folder-at-bottom"
    last_updated_at: "2026-11-17T08:22:21Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "changelog-spec-bottom-2026-11-17"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Move the changelog spec-folder blockquote from under the summary to the end of the entry in the template and in every existing changelog

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Every changelog, new and existing, ends with its spec-folder blockquote.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | A script moves the bulk. Hy4 Flash Free at high handles only the files a script cannot place. |
| D2 | The block goes after the last section and an `&nbsp;` line, or ends its own dated section. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] The migration dry run prints `{'already last': 2796, 'spec lines': 19}`
- [x] The gate results over the `.skilled` changelogs match the baseline
- [x] `validate.sh` on this packet with `--strict` prints `RESULT: PASSED`
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
| Script migration | Done | 2,795 files moved |
| Hy4 multi-block files | Done | 19 files, all checked |
| Skill docs | Done | 0 issues each |

### Deviations and findings

| Item | Note |
|------|------|
| One Hy4 block stopped at a non-date heading | Moved by hand to the end of the file |
<!-- /ANCHOR:log -->
