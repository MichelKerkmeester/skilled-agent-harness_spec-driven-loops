---
title: "Tasks: sk-code-obsidian reference stack"
description: "Task breakdown for authoring the references/ tree and replacing this leaf's spec-kit scaffolds, in reading-then-drafting-then-verification order."
trigger_phrases:
  - "sk-code-obsidian references tasks"
  - "obsidian surface reference task breakdown"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/025-sk-code-obsidian-surface/005-references-stack"
    last_updated_at: "2026-08-28T21:15:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored reference stack"
    next_safe_action: "Author playbook scenarios"
    blockers: []
    key_files:
      - "$HUB/.opencode/skills/sk-code/sk-code-obsidian/references/"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-code-obsidian-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: sk-code-obsidian reference stack

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the markdown agent's own persona and write boundary (`$HUB/.claude/agents/markdown.md`)
- [x] T002 [P] Read the shape template across all five subfolders plus representative top-level files (`sk-code-mobile-cli/references/**`)
- [x] T003 [P] Read the content contract (`../004-skill-core`'s `SKILL.md` §2/§2b)
- [x] T004 [P] Read the approved design plan §6 and the measured audit (`../001-surface-design-plan/mode-design-plan.md`, `../002-repo-convention-audit/audit.json`)
- [x] T005 [P] Read the plugin's entry point and manifest (`manifest.json`, `esbuild.config.mjs`, `src/main.ts`)
- [x] T006 [P] Read the view/renderer family and the two registered views (`src/views/DatabaseView.ts`, `src/views/DatabaseFileView.ts`, `src/views/` listing)
- [x] T007 [P] Read the data pipeline (`src/data/DataSource.ts`, `src/data/RowPipeline.ts`, `src/data/` listing)
- [x] T008 [P] Read the screenshot harness (`tools/screenshots/{capture,verify,scenarios}.mjs`, `theme.css`, `runtime-vars.css`, `src/views/ScreenshotFixtures.test.ts`)
- [x] T009 [P] Read the touch and accessibility source (`src/data/TouchEnvironment.ts`, `src/views/AccessibilityDefects.test.ts`)
- [x] T010 [P] Read the release and repo-convention sources (`.github/workflows/release.yml`, `versions.json`, `AGENTS.md`, `REPO RULES.md`, `<plugin-repo>/specs/public/HANDOVER.md`, `README.md`)

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T020 Author `obsidian-plugin-api.md` — the `src/main.ts` import boundary, `manifest.json` contract, `onload`/`onunload`, the two registered views (`references/obsidian-plugin-api.md`)
- [x] T021 Author `view-renderer-architecture.md` — the `*Renderer.ts` family, `DatabaseView` dispatch, the `src/data/` pipeline summary, the modals coverage gap (`references/view-renderer-architecture.md`)
- [x] T022 Author `stylesheet-ownership.md` — the one-file model, the CJK preamble, the split-file operator decision (`references/stylesheet-ownership.md`)
- [x] T023 Author `db-class-naming.md` — the three-prefix grammar, the 427/769 fixture split, the invent-a-class hard rule (`references/db-class-naming.md`)
- [x] T024 Author `screenshot-harness.md` — capture/verify scripts, hand-fixture-vs-real-renderer, the two capture modes, the two stand-ins (`references/screenshot-harness.md`)
- [x] T025 Author `verification.md` — the five-command gate, the measured baseline, the lint-baseline honesty rule, the rename sequencing (`references/verification.md`)
- [x] T026 Author `comment-grammar.md` — the target `MODULE:` banner grammar versus the measured 0-of-249 state and the CJK preamble distinction (`references/comment-grammar.md`)
- [x] T027 Author `folder-docs.md` — the threshold, the seven-folder owing list, README-vs-CODE (`references/folder-docs.md`)
- [x] T028 Author `theme-variables.md` — the Obsidian-supplied variable set, the plugin-runtime variable set, the sticky-header worked example (`references/theme-variables.md`)
- [x] T029 Author `mobile-and-touch.md` — `isTouchDevice`'s three signals, `attachLongPress`, the `is-phone` class, the recorded P0 passive-listener gap (`references/mobile-and-touch.md`)
- [x] T030 Author `accessibility.md` — the eight-item test suite, what it proves versus what it does not, the no-screen-reader-session caveat (`references/accessibility.md`)
- [x] T031 Author `data-layer.md` — `DataSource`, `RowPipeline`'s diagnostics, the supporting module cast, the migration model (`references/data-layer.md`)
- [x] T032 Author `standards/code-standards.md` and `standards/platform-support.md` (`references/standards/*.md`)
- [x] T033 Author `quality/doc-quality-gate.md` (`references/quality/doc-quality-gate.md`)
- [x] T034 Author `setup/setup.md` (`references/setup/setup.md`)
- [x] T035 Author `operations/operations.md` (`references/operations/operations.md`)
- [x] T036 Author `release/release-verification.md` — the tag-triggered workflow, the three shipped artifacts, the `versions.json` contract (`references/release/release-verification.md`)
- [x] T037 Create the three workflow-doctrine symlinks with `ln -s` (`references/workflow-{implement,debug,verify}.md`)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T040 Run a scripted path-resolution pass over every backticked token in all eighteen non-symlink files against the live plugin repository; resolve or fix every reported miss
- [x] T041 Confirm all eighteen files' line counts fall in a template-comparable band (`wc -l`)
- [x] T042 Grep all eighteen files for `runes` and `$effect` (no match), and check every `svelte` match is a brief contrastive mention, not doctrine presented as this plugin's convention
- [x] T043 Confirm the three workflow files are real symlinks (`ls -la references/workflow-*.md`)
- [x] T044 Replace this leaf's `spec.md`, `plan.md`, `tasks.md` scaffolds and grep for residual scaffold markers — none remain
- [x] T045 Confirm no file was written outside `$HUB/.opencode/skills/sk-code/sk-code-obsidian/references/` and this leaf's own folder — `SKILL.md`, `README.md`, `assets/`, and every hub routing file untouched

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Deliverable**: `$HUB/.opencode/skills/sk-code/sk-code-obsidian/references/`

<!-- /ANCHOR:cross-refs -->
---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies (shape template, `SKILL.md` contract, design plan, audit, wide plugin read) identified and read

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every reference file's headers are upper-case, numbered `## N. TITLE`, matching the `sk-code-mobile-cli` grammar
- [x] CHK-011 [P0] No spec path, requirement id, task id, or phase number appears in any authored file's prose
- [x] CHK-012 [P1] Every cited plugin path and count resolves against the live repository or `audit.json`
- [x] CHK-013 [P1] Prose distinguishes shipped convention from target convention in `comment-grammar.md` and `folder-docs.md`

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every reference file's frontmatter parses as valid YAML with `title`, `description`, `trigger_phrases`, `importance_tier`, `contextType`, `version`
- [x] CHK-021 [P0] No `runes` or `$effect` term appears in any file; every `svelte` mention is a brief contrastive aside, never doctrine presented as this plugin's own convention
- [x] CHK-022 [P1] The three workflow files resolve as symlinks into `../../shared/references/`
- [x] CHK-023 [P1] The scripted path-resolution pass reports zero unresolved backticked paths

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Every file `SKILL.md` §2/§2b names is covered by an authored file, under a matching or clearly-mapped basename recorded in Edge Cases
- [x] CHK-FIX-002 [P0] The recorded P0 passive-listener gap, the no-screen-reader-session caveat, the never-invent-a-class rule, and the "capture succeeding is not proof" rule are all named as evidence, not proposed fixes
- [x] CHK-FIX-003 [P1] The lint baseline (115 problems) is stated as a recorded fact in `verification.md` and `standards/code-standards.md`, never implied clean

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secret, token, or absolute personal path is embedded in any authored file
- [x] CHK-031 [P1] The packet's declared tool surface (`Read, Bash, Grep, Glob`) stays read-only; this phase mutates only markdown files and symlinks under `references/`

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized with the authored `references/` tree
- [x] CHK-041 [P1] No spec paths, requirement ids, or task ids introduced into any authored reference file
- [x] CHK-042 [P2] Section and rule style matches `sk-code-mobile-cli`'s grammar throughout

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Only `references/**` files and symlinks were created under `sk-code-obsidian/`; `SKILL.md`, `README.md`, `assets/`, and hub routing files untouched
- [x] CHK-051 [P1] `scratch/` left untouched (no temp files used)

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 6 | 6/6 |
| P1 Items | 8 | 8/8 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-08-28

<!-- /ANCHOR:summary -->
