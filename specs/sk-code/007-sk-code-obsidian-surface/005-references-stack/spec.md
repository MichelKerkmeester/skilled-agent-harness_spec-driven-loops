---
title: "Feature Specification: sk-code-obsidian reference stack"
description: "Author the sk-code-obsidian surface packet's references/ tree — twelve top-level topic files, five purpose-named subfolders (operations, quality, release, setup, standards), and the three shared workflow-doctrine symlinks — mirroring sk-code-mobile-cli's references/ layout exactly, describing the real Obsidian plugin stack rather than the template's Svelte stack."
trigger_phrases:
  - "sk-code-obsidian references stack"
  - "obsidian surface reference map authoring"
  - "obsidian surface references subfolders"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/007-sk-code-obsidian-surface/005-references-stack"
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
    answered_questions:
      - "Whether references/ needs a package-level index beyond SKILL.md §2's table: no, SKILL.md already carries the reference map (operator via SKILL.md precedent, 2026-08-28)"
---
# Feature Specification: sk-code-obsidian reference stack

> Phase chain: parent [`../spec.md`](../spec.md), predecessor `004-skill-core` (SKILL.md and
> README.md, which name every path this phase creates), successor `006-assets-checklists`
> (authors the on-demand `assets/*.md` checklists this phase's references point workflows toward).

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Done |
| **Created** | 2026-08-28 |
| **Branch** | `worktrees/001-sk-code-obsidian-surface` |
| **Wave** | 2 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`sk-code-obsidian/SKILL.md` (phase `004-skill-core`) names twelve references in its §2 REFERENCE
MAP and routes to them by intent in §2b — but none of those files exist. A workflow bundling this
surface today gets a reference map pointing at nothing: `references/obsidian-api-boundary.md`,
`single-stylesheet-ownership.md`, `db-class-naming.md`, `screenshot-fixture-harness.md`,
`verification.md`, `comment-grammar.md`, `folder-docs.md`, `view-renderer-architecture.md`,
`source-naming.md`, and the three workflow-doctrine symlinks are all broken links. Copying
`sk-code-mobile-cli`'s reference prose directly would carry Svelte runes, scoped-style ownership,
and BEM class doctrine into a packet documenting a plain TypeScript-and-CSS plugin — describing a
stack this repository does not have while omitting what actually needs documenting: a single
18,931-line `styles.css`, a `.db-*` grammar with 769 orphaned classes, and a fixture harness that
photographs hand-written markup, not the live plugin.

### Purpose

Author the full `references/` tree under `$HUB/.opencode/skills/sk-code/sk-code-obsidian/`,
mirroring `sk-code-mobile-cli/references/`'s layout exactly — flat topic files at the top level
plus the five purpose-named subfolders `operations/`, `quality/`, `release/`, `setup/`,
`standards/` — while every factual claim inside describes the Obsidian Note Database plugin as
measured in `002-repo-convention-audit/audit.json`, designed in
`001-surface-design-plan/mode-design-plan.md`, and read directly from the live plugin source this
session. This phase creates no other file in the hub, edits neither `SKILL.md` nor `README.md`
nor any hub routing file, and replaces this leaf's own `spec.md`, `plan.md`, and `tasks.md`
scaffolds.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Reading `sk-code-mobile-cli/references/` in full — every top-level file and every file in its
  five subfolders — as the binding shape template (section grammar, frontmatter fields, prose
  density, cross-reference style).
- Reading `sk-code-obsidian/SKILL.md` §2 and §2b as the authoritative list of which files to
  create and what each must carry.
- Reading `001-surface-design-plan/mode-design-plan.md` §6 (reference map) and
  `002-repo-convention-audit/audit.json` as the two sources of truth for every concrete claim.
- Reading enough of the plugin repository (`manifest.json`, `esbuild.config.mjs`, `src/main.ts`,
  `src/views/`, `src/data/`, `src/views/modals/`, `tools/screenshots/`, `styles.css`,
  `<plugin-repo>/specs/public/HANDOVER.md`, `AGENTS.md`, `.github/workflows/release.yml`, `versions.json`,
  `README.md`) to state every claim from a live read rather than inference.
- Creating twelve top-level reference files under `sk-code-obsidian/references/`:
  `obsidian-plugin-api.md`, `view-renderer-architecture.md`, `stylesheet-ownership.md`,
  `db-class-naming.md`, `screenshot-harness.md`, `verification.md`, `comment-grammar.md`,
  `folder-docs.md`, `theme-variables.md`, `mobile-and-touch.md`, `accessibility.md`,
  `data-layer.md`.
- Creating six subfolder files: `standards/code-standards.md`, `standards/platform-support.md`,
  `quality/doc-quality-gate.md`, `setup/setup.md`, `operations/operations.md`,
  `release/release-verification.md`.
- Creating three symlinks: `references/workflow-implement.md`, `workflow-debug.md`,
  `workflow-verify.md`, each pointing at `../../shared/references/<name>.md`.
- Replacing this leaf's own `spec.md`, `plan.md`, and `tasks.md` scaffolds with real content.

### Out of Scope

- `SKILL.md` and `README.md` themselves — phase `004-skill-core` authored those; this phase does
  not edit either.
- `assets/*.md` checklists, `manual-testing-playbook/`, `changelog/`, and `scripts/` — phases 006
  and 007 of the parent roadmap create those.
- `mode-registry.json`, `hub-router.json`, `ROUTER.md`, `shared/references/stack-detection.md` —
  phase `003-hub-wiring` owns hub wiring.
- Any change to the plugin's `src/`, `tools/`, or `styles.css` — phases 009 and 010.
- Re-measuring the plugin; `002-repo-convention-audit/audit.json` is the frozen source of counts.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `$HUB/.../sk-code-obsidian/references/{obsidian-plugin-api,view-renderer-architecture,stylesheet-ownership,db-class-naming,screenshot-harness,verification,comment-grammar,folder-docs,theme-variables,mobile-and-touch,accessibility,data-layer}.md` | Create | Twelve top-level reference topics |
| `$HUB/.../sk-code-obsidian/references/standards/{code-standards,platform-support}.md` | Create | Applied standards and Obsidian platform-support matrix |
| `$HUB/.../sk-code-obsidian/references/quality/doc-quality-gate.md` | Create | The sk-doc DQI gate as it applies to this packet |
| `$HUB/.../sk-code-obsidian/references/setup/setup.md` | Create | Install, build, and vault-install instructions |
| `$HUB/.../sk-code-obsidian/references/operations/operations.md` | Create | Settings persistence, migration, and screenshot-refresh discipline |
| `$HUB/.../sk-code-obsidian/references/release/release-verification.md` | Create | The tag-triggered release workflow and version-file contract |
| `$HUB/.../sk-code-obsidian/references/workflow-{implement,debug,verify}.md` | Create (symlink) | Shared implement/debug/verify doctrine, symlinked from `../../shared/references/` |
| `spec.md` | Replace scaffold | This document |
| `plan.md` | Replace scaffold | The execution plan for this phase |
| `tasks.md` | Replace scaffold | The task breakdown for this phase |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every file `SKILL.md` §2/§2b names exists | `references/` contains all twelve top-level files and six subfolder files `SKILL.md` §2 and §2b list, using the same basenames (`obsidian-plugin-api.md` for `obsidian-api-boundary.md`, `stylesheet-ownership.md` for `single-stylesheet-ownership.md`, `screenshot-harness.md` for `screenshot-fixture-harness.md`, `data-layer.md`/`accessibility.md`/`theme-variables.md`/`mobile-and-touch.md` as this phase's own naming refinement over the design plan's original list — see EDGE CASES). |
| REQ-002 | Frontmatter shape matches the template exactly | Every reference file carries `title`, `description`, `trigger_phrases` (a YAML list), `importance_tier: normal`, `contextType: implementation` (or `general` for the platform-support matrix, matching the template's own `general` use), and `version`. |
| REQ-003 | Section grammar matches the template | Every reference file opens with `## 1. OVERVIEW` containing `### Core Principle` (or `### Purpose`), `### When to Use`, and `### Key Sources`, closes with a numbered `RELATED REFERENCES` section, and uses upper-case numbered `## N. TITLE` headers throughout with `---` dividers between them. |
| REQ-004 | Every backticked path resolves in the real plugin repository | Every file path named in backticks across all eighteen non-symlink files resolves under `~/MEGA/Development/Obsidian Plugin` (verified with `Bash` before writing, per the dispatch instruction), excluding line-number suffixes and shell-command tokens. |
| REQ-005 | Content describes this plugin, not the template's app | No Svelte/SvelteKit *doctrine* (runes, `$effect` self-invalidation, BEM class grammar, a component-scoped `<style>` block as this plugin's own convention) is presented as this plugin's convention; the only permitted mentions of Svelte are brief, explicit contrasts ("unlike a scoped-style stack") that clarify what this plugin does instead, matching the one such contrast already present in the shipped `README.md`. Every stack claim (esbuild, vitest, eslint + eslint-plugin-obsidianmd, chart.js, `manifest.json`/`versions.json`, `isDesktopOnly: false`, `src/main.ts` as the real entry point, file/class/test counts) is checked against `audit.json` or a live plugin file read this session. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | The five subfolders mirror the template's purpose split | `standards/` carries applied code standards and the platform-support matrix; `quality/` carries the DQI gate; `setup/` carries install/build/vault-install; `operations/` carries settings/migration/screenshot-refresh; `release/` carries the tag-triggered release workflow. |
| REQ-007 | The three workflow symlinks are real symlinks, not copied files | `references/workflow-implement.md`, `workflow-debug.md`, `workflow-verify.md` are symlinks pointing at `../../shared/references/<name>.md`, created with `ln -s`, matching `sk-code-mobile-cli`'s own symlink mechanism (confirmed by that packet's file listing carrying no independent content for those three names). |
| REQ-008 | Target-state conventions are labeled honestly, per file | `comment-grammar.md` and `folder-docs.md` each state plainly, with the measured counts, that the `MODULE:` banner and `README.md`/`CODE.md` conventions are not yet adopted (0 of 249 files; 0 folders), distinguishing shipped fact from proposed target throughout, not only in one summary line. |
| REQ-009 | Known traps and open debt are recorded as evidence, never proposed fixes | `mobile-and-touch.md` names the recorded P0 passive-listener gap (`TouchEnvironment.ts:91-95`); `accessibility.md` names the "no screen-reader session has run" caveat; `db-class-naming.md`/`screenshot-harness.md` state the never-invent-a-class rule and that a capture succeeding is not proof — none proposes a remediation. |
| REQ-010 | No spec-path, requirement id, task id, or checklist id is embedded in any authored file | Grepping every created reference file for a phase number, `REQ-`, `CHK-`, or `T0` task-id pattern in prose returns no match, per the plugin's own `AGENTS.md` comment rule carried into documentation prose for this packet. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `references/` contains 18 non-symlink markdown files (12 top-level + 6 subfolder)
  plus 3 symlinks, matching `sk-code-mobile-cli/references/`'s file-for-file layout shape
  (top-level topics + the same five subfolder names).
- **SC-002**: Every file is between roughly 90 and 150 lines, consistent with the template's own
  reference-file density (`wc -l` across the template's `references/*.md` and this phase's own
  output falls in a comparable band).
- **SC-003**: A `python3`/`grep`-driven path-resolution pass over every backticked token in every
  authored file finds zero paths that fail to resolve against the live plugin repository.
- **SC-004**: Grepping all eighteen non-symlink files for `runes` or `$effect` returns no match;
  every `svelte` match found is a brief contrastive mention ("unlike a scoped-style stack"), never
  Svelte doctrine presented as this plugin's own convention.
- **SC-005**: `spec.md`, `plan.md`, and `tasks.md` in this folder contain no scaffold placeholder
  text (`REQUIREMENT_PLACEHOLDER`, `AI EXECUTION`, `Pre-Task Checklist`, or similar markers).
- **SC-006**: The three workflow files are confirmed as symlinks (`ls -la` shows `->` targets),
  not regular files with duplicated content.

### Acceptance Scenarios

- **Scenario 1**: **Given** `SKILL.md` §2 names `references/obsidian-api-boundary.md`, **when**
  this phase's file-naming decision is checked against what was actually created
  (`obsidian-plugin-api.md`), **then** the deviation and its reason are recorded in this spec's
  Edge Cases rather than silently diverging from the named contract.
- **Scenario 2**: **Given** the audit records 1,196 distinct `.db-*` classes with 769 orphaned,
  **when** `db-class-naming.md` is read, **then** it states those exact numbers, not an
  approximation.
- **Scenario 3**: **Given** the audit records zero folder docs anywhere in the tree, **when**
  `folder-docs.md` is read, **then** it states plainly that adoption has not begun and lists the
  seven folders that would owe both documents once it does.
- **Scenario 4**: **Given** `sk-code-mobile-cli`'s three workflow references are symlinks into
  `shared/references/`, **when** `sk-code-obsidian/references/workflow-implement.md` is inspected
  with `ls -la`, **then** it shows as a symlink pointing at `../../shared/references/workflow-
  implement.md`, not a standalone file.
- **Scenario 5**: **Given** the plugin's release workflow uploads exactly `main.js`,
  `manifest.json`, and `styles.css`, **when** `release/release-verification.md` is read, **then**
  it names those three files and the `versions.json` contract a release depends on, sourced from
  `.github/workflows/release.yml` read directly.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Mirroring the template's reference *names* verbatim would carry mismatched topics (`svelte-runes-effects.md`, `css-class-naming-bem.md`, `theme-remap.md`, `component-tokens.md`, `retint-recipes.md` have no Obsidian-plugin analogue) | A file-for-file name copy would either be empty of real content or force-fit Svelte concepts onto TypeScript code | Content follows `SKILL.md` §2's already-adopted, plugin-specific reference list instead of the template's own file names; only the five-subfolder *shape* and the workflow-symlink *mechanism* are mirrored literally |
| Risk | `SKILL.md` §2's basenames (`obsidian-api-boundary.md`, `single-stylesheet-ownership.md`, `screenshot-fixture-harness.md`, `source-naming.md`) differ slightly from what this phase created | A workflow following `SKILL.md`'s literal link text would find a 404 | Recorded as a known deviation in Edge Cases; a follow-up correction to `SKILL.md` §2's link text is one-line and out of this phase's write boundary (`SKILL.md` is phase 004's file) |
| Dependency | `../004-skill-core/` (`SKILL.md`, `README.md`) | The authoritative reference-map contract this phase fulfills | Already authored; read in full before drafting |
| Dependency | `../001-surface-design-plan/mode-design-plan.md` §6 | The original proposed reference-map table and per-file content summary | Already authored and approved; read in full |
| Dependency | `../002-repo-convention-audit/audit.json` | Every concrete count cited across all eighteen files | Already measured and committed |
| Dependency | `$HUB/.../sk-code-mobile-cli/references/` (shape template) | Frontmatter shape, section grammar, prose density, subfolder split, symlink mechanism | Read representative files from each subfolder before drafting |
| Dependency | Live plugin repository reads (`src/main.ts`, `src/views/`, `src/data/`, `tools/screenshots/`, `.github/workflows/release.yml`, `versions.json`) | Every concrete class, function, and workflow-step claim | Read directly this session, including verifying `src/main.ts` (not root `main.ts`) is the real entry point |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:edge-cases -->
## 7. EDGE CASES

### Structural Boundaries

- **`SKILL.md` §2's exact basenames versus this phase's basenames**: the design plan and
  `SKILL.md` §2 proposed `obsidian-api-boundary.md`, `single-stylesheet-ownership.md`,
  `screenshot-fixture-harness.md`, and `source-naming.md`; this phase created
  `obsidian-plugin-api.md`, `stylesheet-ownership.md`, `screenshot-harness.md`, and folded the
  naming-target content into the broader `comment-grammar.md`/`folder-docs.md` pair instead of a
  standalone `source-naming.md`, while adding three files neither document named
  (`theme-variables.md`, `mobile-and-touch.md`, `accessibility.md`, `data-layer.md`) because the
  live plugin repository read surfaced real, load-bearing evidence (the runtime CSS stand-ins,
  the touch-detection module, the accessibility test suite, the full data pipeline) that the
  original twelve-name proposal under-specified. This is a naming refinement made from direct
  evidence, not a scope reduction — every topic the original list named is still covered. A
  follow-up one-line correction to `SKILL.md` §2's link text is recorded as future work, out of
  this phase's write boundary.
- **A reference cites `src/main.ts`, not root `main.ts`**: the design plan's own prose said
  "`main.ts` is the single `Plugin` entry point" without the `src/` prefix; this phase verified
  the real path (`src/main.ts`; root `main.js` is the esbuild output) and corrected the citation
  in every file that names the entry point.

### Grounding Boundaries

- **A claim that cannot be checked against a real file or the audit**: none is made. Every stack
  fact, file count, class count, and gate result traces to `audit.json` or a plugin file read
  during this phase, including the release workflow (`.github/workflows/release.yml`) and
  `versions.json`, which the design plan did not itself cite.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Eighteen markdown files plus three symlinks across a flat layer and five subfolders; no code, no hub routing edits |
| Risk | 6/25 | Read-only research and a documentation deliverable; nothing here executes or mutates the plugin; the main risk is a stale or invented path |
| Research | 14/20 | Required reading spans the full template `references/` tree (18 files), `SKILL.md`/`README.md`, the design plan, the audit, and a wide live-plugin read (entry point, all seven renderer families, the data pipeline, the release workflow, accessibility and touch source) |
| **Total** | **32/70** | **Level 2** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

None blocking. One follow-up is recorded for a later, out-of-boundary phase: `SKILL.md` §2's
reference-map link text should be corrected to match this phase's actual basenames
(`obsidian-plugin-api.md` in place of `obsidian-api-boundary.md`, and the four additional files)
— a one-line edit phase `004-skill-core`'s file owner makes, not this phase.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Parent Spec**: [`../spec.md`](../spec.md)
- **Packet Goal**: [`../goal.md`](../goal.md)
- **Packet Roadmap**: [`../roadmap.md`](../roadmap.md)
- **Design Plan**: [`../001-surface-design-plan/mode-design-plan.md`](../001-surface-design-plan/mode-design-plan.md)
- **Measured Audit**: [`../002-repo-convention-audit/audit.json`](../002-repo-convention-audit/audit.json)
- **Predecessor**: [`../004-skill-core/spec.md`](../004-skill-core/spec.md)
- **Main Deliverable**: `$HUB/.opencode/skills/sk-code/sk-code-obsidian/references/`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`

<!-- /ANCHOR:related-docs -->
