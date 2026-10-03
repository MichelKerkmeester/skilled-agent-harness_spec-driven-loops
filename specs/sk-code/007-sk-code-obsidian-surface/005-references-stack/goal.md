---
title: "Goal: sk-code-obsidian reference stack"
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
    packet_pointer: "sk-code/007-sk-code-obsidian-surface/005-references-stack"
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
# Goal: sk-code-obsidian reference stack

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Author the full `references/` tree under `sk-code-obsidian/`, mirroring the layout of `sk-code-mobile-cli/references/` with flat topic files, five purpose-named subfolders and three workflow-doctrine symlinks, while every claim describes the Obsidian Note Database plugin as measured, designed and read from its live source.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | This phase writes only under `sk-code-obsidian/references/`. `SKILL.md`, `README.md`, `assets/` and every hub routing file stay untouched. |
| D2 | Only the five-subfolder shape and the symlink mechanism are mirrored literally. Topic names follow the plugin's real stack, not the template's file names. |
| D3 | Svelte may appear only as a brief contrast, never as this plugin's convention. |
| D4 | Target conventions are labeled as not adopted, and recorded traps carry no proposed fix. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `references/` holds 18 non-symlink markdown files: 12 top-level topics plus `standards/code-standards.md`, `standards/platform-support.md`, `quality/doc-quality-gate.md`, `setup/setup.md`, `operations/operations.md` and `release/release-verification.md`
- [x] `ls -la references/workflow-*.md` shows `workflow-implement.md`, `workflow-debug.md` and `workflow-verify.md` as symlinks into `../../shared/references/`
- [x] Every reference file's frontmatter parses with `title`, `description`, `trigger_phrases`, `importance_tier`, `contextType` and `version`
- [x] A scripted pass over every backticked path in the 18 files reports zero paths that fail to resolve against the live plugin repository
- [x] A grep of the 18 files for `runes` and `$effect` returns no match, and every `svelte` match is a brief contrast
- [x] `comment-grammar.md` and `folder-docs.md` state that the `MODULE:` banner and folder-doc conventions are not adopted (0 of 249 files, 0 folders)
- [x] No authored reference file contains a phase number, requirement id, task id or checklist id in its prose
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
| 18 reference files and 3 symlinks authored | Done (2026-08-28) | `tasks.md` T020 to T037 |
| Path resolution, grep, symlink check, write boundary | Done | `tasks.md` T040 to T045, CHK-020 to CHK-023 |
| Phase status | Complete | `implementation-summary.md` metadata |

### Deviations and findings

| Item | Note |
|------|------|
| Basenames differ from `SKILL.md` §2 | `obsidian-plugin-api.md`, `stylesheet-ownership.md` and `screenshot-harness.md` replace the proposed names, and `source-naming.md` was folded into `comment-grammar.md` and `folder-docs.md`; the `SKILL.md` link-text correction is out of this phase's boundary |
| Status wording | `spec.md` metadata reads `Done` while `implementation-summary.md` reads `Complete` |
| Reconstructed summary | `implementation-summary.md` was rebuilt from `tasks.md`; its results are quoted, not re-run |
<!-- /ANCHOR:log -->
