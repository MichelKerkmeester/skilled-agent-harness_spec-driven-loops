---
title: "Goal: Phase 4: private-local-skills"
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
    packet_pointer: "sk-code/013-private-surface-skills/004-private-local-skills"
    last_updated_at: "2026-10-23T13:30:00Z"
    last_updated_by: "deepseek-v4.1-flash-1017"
    recent_action: "Authored the durable directive"
    next_safe_action: "Record the operator's folder mode in ADR-001, then execute against the completion criteria"
    blockers:
      - "ADR-001 folder mode is pending the operator's decision"
    key_files:
      - "spec.md"
      - "acceptance-criteria.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-004-private-local-skills"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Real folder or symlink to a private repository?"
    answered_questions: []
---
# Goal: Phase 4: private-local-skills

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Restore the Webflow and Obsidian evidence surfaces as two gitignored standalone skills that the operator's local advisor routes, with every link resolving and no private byte tracked. Done when: both `.skilled/skills/local-webflow/` and `.skilled/skills/local-obsidian/` hold 162 and 66 files; the Webflow link audit prints exactly one `BROKEN ... -> target` line and `AUDIT_FAIL=1` while the Obsidian audit prints no `BROKEN` line and `AUDIT_FAIL=0`; each `SKILL.md` carries `name: local-webflow` or `name: local-obsidian`, no `packetKind`, and each skill root holds exactly one `graph-metadata.json`; a throwaway advisor database holds one `skill_nodes` row for each of `local-webflow` and `local-obsidian`; `git status --porcelain .skilled` and `git diff --cached --name-only` print nothing, and `git status --porcelain --ignored .skilled/skills/local-webflow .skilled/skills/local-obsidian` prints exactly two `!!` lines; `validate.sh --strict` on the phase folder prints `RESULT: PASSED` and the phase commit's file list holds no path outside the phase folder; ADR-001 records one accepted folder mode and `implementation-summary.md` names it.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The folder mode is one operator decision recorded in ADR-001; a pending status stops the run before any file is written. |
| D2 | Both trees are restored from `42b41dd286` and live only in the operator's main checkout; only this phase's documents are committed, from the worktree. |
| D3 | This phase starts only after phase 003's `local-*` compiler skip is present on `main`, because that compiler follows a symlink today. |
| D4 | Each skill carries exactly one skill-root `graph-metadata.json` and no `description.json`. |
| D5 | The evidence records paths and counts only, and the commit stages its files by name. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] both `.skilled/skills/local-webflow/` and `.skilled/skills/local-obsidian/` hold 162 and 66 files
- [ ] the Webflow link audit prints exactly one `BROKEN ... -> target` line and `AUDIT_FAIL=1` while the Obsidian audit prints no `BROKEN` line and `AUDIT_FAIL=0`
- [ ] each `SKILL.md` carries `name: local-webflow` or `name: local-obsidian`, no `packetKind`, and each skill root holds exactly one `graph-metadata.json`
- [ ] a throwaway advisor database holds one `skill_nodes` row for each of `local-webflow` and `local-obsidian`
- [ ] `git status --porcelain .skilled` and `git diff --cached --name-only` print nothing, and `git status --porcelain --ignored .skilled/skills/local-webflow .skilled/skills/local-obsidian` prints exactly two `!!` lines
- [ ] `validate.sh --strict` on the phase folder prints `RESULT: PASSED` and the phase commit's file list holds no path outside the phase folder
- [ ] ADR-001 records one accepted folder mode and `implementation-summary.md` names it
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
| Phase opened | Pending | Planning documents written; no task has run |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | |
<!-- /ANCHOR:log -->
