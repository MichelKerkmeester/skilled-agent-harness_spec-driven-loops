---
title: "Goal: sk-code-obsidian On-Demand Checklists"
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
    packet_pointer: "sk-code/007-sk-code-obsidian-surface/006-assets-checklists"
    last_updated_at: "2026-10-03T12:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "None; every criterion is met"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-03-child-goal-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: sk-code-obsidian On-Demand Checklists

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Author seven on-demand `assets/*.md` checklists under `sk-code-obsidian/` in `sk-code-mobile-cli`'s checklist shape, each item carrying its own proof, so a workflow that hits one of the surface's escalation triggers has a grounded checklist to load.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | This phase writes only under `sk-code-obsidian/assets/`. `SKILL.md`, `README.md`, `references/` and every hub routing file stay untouched. |
| D2 | The five-name asset list in `SKILL.md` §4 and `mode-design-plan.md` §7 is left unreconciled against the seven delivered checklists, and the discrepancy is recorded. |
| D3 | No checklist uses a `.db-*` class or file path that is absent from `styles.css`, `src/`, `tools/screenshots/` or `audit.json`. |
| D4 | Banner and folder-doc conventions are labeled as target conventions, not adopted ones. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `screenshot-coverage-checklist.md`, `db-class-rename-checklist.md`, `fixture-authoring-checklist.md`, `verification-checklist.md`, `folder-docs-checklist.md`, `comment-banner-checklist.md` and `modal-coverage-checklist.md` exist under `sk-code-obsidian/assets/`
- [x] `wc -l` reports between 90 and 140 lines for each of the seven checklists
- [x] Each checklist's frontmatter parses with `title`, `description`, `trigger_phrases`, `importance_tier`, `contextType` and `version`, and each closes with a `THE GATE` section
- [x] `screenshot-coverage-checklist.md` and `modal-coverage-checklist.md` both name the non-recursing `ls` as the root cause of the 17 unphotographed modals
- [x] `db-class-rename-checklist.md` and `fixture-authoring-checklist.md` both name `ScreenshotFixtures.test.ts` as the guard against an invented class
- [x] No checklist body contains a spec path, phase number, requirement id or task id
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
| Seven checklists drafted | Done (2026-08-28) | `tasks.md` T010 to T016 |
| Line counts, citation re-check, write boundary | Done | `tasks.md` T020 to T024, CHK-020 to CHK-023 |
| Phase status | Complete | `spec.md` metadata and `implementation-summary.md` |

### Deviations and findings

| Item | Note |
|------|------|
| Five-name versus seven-name asset set | `SKILL.md` §4 still names a different five-checklist proposal; reconciling it is deferred because `SKILL.md` is outside this phase's boundary |
| Reconstructed summary | `implementation-summary.md` was rebuilt from `tasks.md`; its results are quoted, not re-run |
<!-- /ANCHOR:log -->
