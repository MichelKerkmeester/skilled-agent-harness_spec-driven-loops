---
title: "Implementation Plan: sk-code-obsidian reference stack"
description: "Execution plan for authoring the references/ tree: the reading order across the shape template, SKILL.md's contract, the design plan, and the plugin tree, then the drafting order across twelve top-level files, six subfolder files, and three workflow symlinks."
trigger_phrases:
  - "sk-code-obsidian references execution"
  - "obsidian surface reference drafting order"
  - "obsidian surface subfolder authoring"
importance_tier: "important"
contextType: "planning"
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
    answered_questions: []
---
# Implementation Plan: sk-code-obsidian reference stack

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, YAML frontmatter; two `ln -s` symlink operations produce three files |
| **Framework** | `sk-doc`'s reference-document conventions, applied against the `sk-code-mobile-cli` shape template |
| **Storage** | `$HUB/.opencode/skills/sk-code/sk-code-obsidian/references/` (flat + five subfolders); this leaf's own `spec.md`/`plan.md`/`tasks.md` |
| **Testing** | None executable; verification is path-resolution against the live plugin repo, section-shape parity against the template, and an anachronism grep — not a test run |

### Overview
This plan authors the full `references/` tree by reading the binding shape template
(`sk-code-mobile-cli/references/`, all eighteen files across its flat layer and five subfolders),
the authoritative content contract (`sk-code-obsidian/SKILL.md` §2/§2b), the approved design
(`mode-design-plan.md` §6), the measured audit (`audit.json`), and a wide live read of the plugin
repository — entry point, every renderer family, the full data pipeline, the screenshot harness,
the accessibility test suite, the touch-detection module, and the release workflow. It mirrors the
template's frontmatter shape, section grammar, and subfolder split exactly, replacing every
Svelte-specific claim with this plugin's own measured facts, and creates the three workflow-
doctrine files as real symlinks rather than copies.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Shape template read across all five subfolders plus a representative set of top-level files:
      `comment-grammar.md`, `folder-docs.md`, `verification.md`, `css-class-naming-bem.md`,
      `scoped-style-ownership.md`, `svelte-runes-effects.md`, `a11y-parity.md`,
      `component-tokens.md`, `standards/code-standards.md`, `standards/platform-support.md`,
      `quality/doc-quality-gate.md`, `setup/setup.md`, `operations/operations.md`,
      `release/release-verification.md`.
- [x] `sk-code-obsidian/SKILL.md` §2 and §2b read as the content contract.
- [x] `../001-surface-design-plan/mode-design-plan.md` §6 and `../002-repo-convention-audit/
      audit.json` read in full.
- [x] Live plugin repository read: `manifest.json`, `esbuild.config.mjs`, `src/main.ts` (import
      line, `onload`/`onunload`, `registerView` calls), `src/views/DatabaseView.ts`,
      `src/views/DatabaseFileView.ts`, `src/data/DataSource.ts`, `src/data/RowPipeline.ts`,
      `src/data/TouchEnvironment.ts`, `src/views/AccessibilityDefects.test.ts`, `styles.css`
      (header), `tools/screenshots/{capture,verify,scenarios}.mjs`,
      `tools/screenshots/{theme,runtime-vars}.css`, `src/views/ScreenshotFixtures.test.ts`,
      `<plugin-repo>/specs/public/HANDOVER.md`, `AGENTS.md`, `REPO RULES.md`, `.github/workflows/release.yml`,
      `versions.json`, `package.json`, `README.md`.

### Definition of Done
- [x] Twelve top-level reference files created under `references/`, each with template-shaped
      frontmatter and section grammar.
- [x] Six subfolder files created across `standards/`, `quality/`, `setup/`, `operations/`,
      `release/`.
- [x] Three workflow files created as real symlinks (`ln -s`) into `../../shared/references/`.
- [x] Every backticked path in every authored file verified to resolve against the live plugin
      repository via a scripted pass.
- [x] `spec.md`, `plan.md`, and `tasks.md` in this folder replaced with real content — no scaffold
      placeholders remain.
- [x] No file written outside `$HUB/.opencode/skills/sk-code/sk-code-obsidian/references/` and
      this leaf's own folder; `SKILL.md`, `README.md`, `assets/`, and every hub routing file left
      untouched.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Template-shape-first, content-from-evidence-second, same discipline as phase `004-skill-core`.
Frontmatter fields, section headers, and the five-subfolder split come from `sk-code-mobile-cli`
verbatim; every sentence inside those sections comes from a live plugin read or `audit.json`,
never from the template's own Svelte-specific prose or invented by inference.

### Key Components
- **Template read**: `sk-code-mobile-cli/references/` — the flat-file frontmatter/section shape,
  and the five subfolders' purpose split (`operations/` = runtime configuration and lifecycle,
  `quality/` = the doc-quality gate, `release/` = release-gate verification, `setup/` = install
  and deployment, `standards/` = applied conventions and platform support).
- **Contract read**: `sk-code-obsidian/SKILL.md` §2 (the reference table) and §2b (the intent →
  resource routing block) — the list of topics this phase must cover, adapted where a live read
  surfaced more precise or additional real evidence (recorded in `spec.md` Edge Cases).
- **Design read**: `mode-design-plan.md` §6 — the original proposed reference map and per-file
  content summary, the starting point this phase's content was checked and expanded against.
- **Evidence read**: `audit.json` plus a wide plugin-repository read — the source for every
  concrete count, class name, file path, and workflow step cited across all eighteen files.
- **Draft order**: top-level files first, grouped by topic proximity (API boundary → renderer
  architecture → stylesheet/class grammar → screenshot harness → verification, then the target-
  state conventions comment-grammar/folder-docs, then theme-variables/mobile-and-touch/
  accessibility/data-layer), then the five subfolder files, then the three symlinks last (so every
  cross-reference the subfolder files make back into the top-level files already resolves).
- **Path-resolution pass**: a scripted check (`python3` walking every backticked token) run after
  drafting, against the live plugin repository, to catch an invented or stale path before
  delivery.
- **Spec-kit wrapper**: `spec.md`, `plan.md`, `tasks.md` restate the same work in the level-2
  spec-kit shape, matching every sibling phase folder.

### Data Flow
Shape template + `SKILL.md` contract + design plan + measured audit + wide live plugin reads →
eighteen drafted reference files + three symlinks → scripted path-resolution pass → the spec-kit
wrapper documents around them → phase `006-assets-checklists` reads `SKILL.md` §4's checklist
names as its own input contract.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns the Setup, Drafting, and Verification phase
checkboxes and task state.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Path-resolution check | Every backticked path in every authored file resolves against the live plugin repository | Scripted `python3` walk over each file's backtick tokens, tested against real paths under `~/MEGA/Development/Obsidian Plugin` |
| Section-shape parity | Frontmatter fields and `## N. TITLE` header grammar against `sk-code-mobile-cli/references/`'s | Manual side-by-side comparison against representative template files |
| Citation check | Every concrete number traces to `audit.json` or a live plugin read | Manual re-read against the cited source |
| Anachronism check | No `runes`/`$effect` term appears; every `svelte` mention is a brief contrastive aside | `grep -rin 'svelte\|runes\|\$effect' references/`, manually reviewed |
| Symlink check | The three workflow files are real symlinks, not copies | `ls -la references/workflow-*.md` shows `->` targets |
| Scaffold-residue check | No scaffold marker remains in `spec.md`/`plan.md`/`tasks.md` | `grep` for the scaffold markers |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `$HUB/.../sk-code-mobile-cli/references/` (all 18 files) | External (hub repo) | Green — representative files read across every subfolder | Without it, frontmatter shape and section grammar would be guessed rather than mirrored |
| `../004-skill-core/` (`SKILL.md`, `README.md`) | Internal (this packet) | Green — already authored | Without it, the required reference list and per-file content contract would be unsourced |
| `../001-surface-design-plan/mode-design-plan.md` §6 | Internal (this packet) | Green — already authored | Without it, the original proposed reference map would be missing as a cross-check |
| `../002-repo-convention-audit/audit.json` | Internal (this packet) | Green — already measured | Without it, every concrete count across eighteen files would be unsourced |
| Plugin repository (entry point, renderers, data pipeline, harness, a11y test, release workflow) | External (plugin repo) | Green — read this session | Without direct reads, every path, class name, and workflow-step claim would be guessed |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a later phase finds a claim in any reference file that no longer matches the live
  plugin, or finds a broken path the scripted check missed (a path inside a fenced code block the
  script's backtick-token scan does not reach, for example).
- **Procedure**: correct the specific section in the specific file in place; this is a
  documentation artifact, so rollback is an edit, not a revert. Phase `006-assets-checklists` has
  not yet consumed this phase's cross-references by exact wording, only by file existence and
  topic — so no downstream file depends on prose staying byte-identical.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Reading (template + contract + design + audit + wide plugin read) ──► Drafting (12 top-level ──► 6 subfolder ──► 3 symlinks) ──► Verification (path resolution, shape parity, citations, anachronism check)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Reading | None | Drafting |
| Drafting | Reading | Verification |
| Verification | Drafting | Phase 006 (assets-checklists) reading `SKILL.md` §4's checklist names |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Reading | High | Eighteen template files, `SKILL.md`/`README.md`, one design plan, one audit file, plus a wide live-plugin read spanning entry point, seven renderer families, the full data pipeline, the release workflow |
| Drafting | High | Eighteen files (~100–150 lines each) plus three symlinks |
| Verification | Med | Scripted path-resolution pass, header-parity spot check, citation re-check, anachronism grep, symlink confirmation |
| **Total** | | **Single-session** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Every template, contract, design-plan, and audit fact this phase cites was actually read
      this session, not recalled from training.
- [x] No file was written outside `$HUB/.opencode/skills/sk-code/sk-code-obsidian/references/`
      and this leaf's own folder.

### Rollback Procedure
1. Identify the stale claim, the broken path, or the section that drifted from its source.
2. Edit that section of the specific reference file in place with the corrected fact or path.
3. Re-run the path-resolution, citation, and anachronism checks in §5.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A — this phase mutates only the `references/` tree plus its own leaf
  folder.

<!-- /ANCHOR:enhanced-rollback -->
