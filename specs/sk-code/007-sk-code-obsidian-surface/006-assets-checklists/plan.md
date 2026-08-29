---
title: "Implementation Plan: sk-code-obsidian On-Demand Checklists"
description: "Execution plan for authoring the seven assets/*.md checklists: the reading order across sk-code-mobile-cli's template and the live plugin source, then the drafting order per checklist."
trigger_phrases:
  - "sk-code-obsidian checklist execution"
  - "assets checklists reading order"
  - "obsidian checklist drafting plan"
importance_tier: "high"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/007-sk-code-obsidian-surface/006-assets-checklists"
    last_updated_at: "2026-08-28T21:30:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored on-demand checklists"
    next_safe_action: "Author playbook scenarios"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-code-obsidian-006"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: sk-code-obsidian On-Demand Checklists

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown with YAML frontmatter (checklist content, no executed code) |
| **Framework** | `sk-code-mobile-cli/assets/` checklist shape (binding template, per `../goal.md` §3) |
| **Storage** | `$HUB/.opencode/skills/sk-code/sk-code-obsidian/assets/` (seven new files) plus this leaf's own spec-kit folder |
| **Testing** | None executable; verification is line-count, frontmatter-shape, and citation accuracy against live plugin files |

### Overview
This plan produces seven checklists (`screenshot-coverage-checklist.md`,
`db-class-rename-checklist.md`, `fixture-authoring-checklist.md`, `verification-checklist.md`,
`folder-docs-checklist.md`, `comment-banner-checklist.md`, `modal-coverage-checklist.md`) by reading
`sk-code-mobile-cli/assets/`'s full seven-file set as the binding shape template, then the live
plugin evidence each checklist grounds itself in (`ScreenshotFixtures.test.ts`, `scenarios.mjs`,
`verify.mjs`, `capture.mjs`, `styles.css`'s preamble, `AGENTS.md`, `package.json`,
`<plugin-repo>/specs/public/HANDOVER.md`), plus the packet's own `mode-design-plan.md` and
`002-repo-convention-audit/audit.json` for measured counts. No `SKILL.md`, `README.md`,
`references/`, or hub routing file is touched.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `sk-code-mobile-cli/assets/` read in full — all seven files (`a11y-parity-checklist.md`,
  `bem-rename-checklist.md`, `ds-verification-checklist.md`, `guardrail-audit-checklist.md`,
  `runes-effect-audit-checklist.md`, `story-coverage-checklist.md`, `token-retint-checklist.md`);
  three (`bem-rename`, `story-coverage`, `ds-verification`) read closely for section shape.
- [x] `sk-code-obsidian/SKILL.md` and `001-surface-design-plan/mode-design-plan.md` §6-7 read for
  the packet's reference map and the five-name asset proposal this phase supersedes.
- [x] `002-repo-convention-audit/audit.json` and `<plugin-repo>/specs/public/HANDOVER.md` read for measured
  counts and the six recorded P0/P1 items.
- [x] Live plugin evidence read: `src/views/ScreenshotFixtures.test.ts`,
  `tools/screenshots/scenarios.mjs`, `tools/screenshots/scenarios/core.mjs`,
  `tools/screenshots/verify.mjs`, `tools/screenshots/capture.mjs` (device-frame constants),
  `styles.css` (preamble), `AGENTS.md`, `package.json`.

### Definition of Done
- [x] Seven checklists created under `sk-code-obsidian/assets/`, each 90-140 lines.
- [x] Every checkbox item names its own proof (a command, a file, a test name).
- [x] `spec.md`, `plan.md`, and `tasks.md` in this folder replaced with real content — no scaffold
  placeholders remain.
- [x] No file written outside `sk-code-obsidian/assets/` and this leaf's own folder.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Template-first, then ground-then-cite. Every checklist follows `sk-code-mobile-cli/assets/`'s exact
section shape (frontmatter → `## 1. OVERVIEW` → numbered sections → `## N. THE GATE`), and every
concrete fact inside it (a class name, a file path, a measured count, a command) was checked
against a live file or `audit.json` before being written.

### Key Components
- **Template pass**: reads `sk-code-mobile-cli/assets/`'s full checklist set for the shape —
  frontmatter keys, `THE GATE` closing pattern, the checkbox-with-proof style.
- **Grounding pass**: reads the live plugin evidence each checklist cites — the fixture guard test,
  the scenario registry and its `sources`/`group` fields, the freshness gate, the device-frame
  constants, the modal folder listing, and `styles.css`'s existing CJK/`===` preamble.
- **Drafting pass**: seven checklists, each targeting one operational trap named in this phase's
  dispatch brief (screenshot coverage, `.db-*` rename, fixture authoring, verification, folder
  docs, comment banners, modal coverage).
- **Spec-kit wrapper**: `spec.md`, `plan.md`, `tasks.md` restate the same work in the level-2
  spec-kit shape, so this leaf validates like every sibling phase folder.

### Data Flow
`sk-code-mobile-cli/assets/` shape + live plugin evidence + `audit.json` counts → seven cited
checklists under `sk-code-obsidian/assets/` → the spec-kit wrapper documents around them → phase
`007-manual-testing-playbook` may cite these checklists in its routing-recall corpus.

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
| Shape check | Every checklist carries the template's frontmatter keys and `THE GATE` closing section | Manual re-read against `sk-code-mobile-cli/assets/bem-rename-checklist.md` |
| Line-count check | Each checklist is 90-140 lines | `wc -l sk-code-obsidian/assets/*.md` |
| Citation check | Every class name, path, and count cited resolves against a live file or `audit.json` | `rg` re-check per citation |
| Scaffold-residue check | No `REQUIREMENT_PLACEHOLDER` or bare `**Given**` remains in `spec.md`/`plan.md`/`tasks.md` | `grep` for the scaffold markers |
| Boundary check | No file written outside `sk-code-obsidian/assets/` or this leaf's folder | `git status` / diff review |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `$HUB/.opencode/skills/sk-code/sk-code-mobile-cli/assets/` | External (hub repo) | Green — read in full | The shape template; deviating from it violates `../goal.md` §3's frozen constraint |
| `002-repo-convention-audit/audit.json` | Internal (this packet) | Green — already measured | Without it, checklist counts (modal list, folder-doc obligations, gate baselines, class totals) would be unsourced |
| Plugin repo live evidence (`ScreenshotFixtures.test.ts`, `scenarios.mjs`, `verify.mjs`, `capture.mjs`, `styles.css`, `AGENTS.md`, `package.json`) | Internal (plugin repo) | Green — read in full | Without it, checklist mechanics (the guard test, the freshness hash, device-frame sizes) would be recalled rather than cited |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a later phase finds a citation in one of the seven checklists no longer matches the
  live plugin file (a scenario module renamed, a class renamed, a gate baseline changed).
- **Procedure**: correct the specific cited section in place; these are documentation artifacts, so
  rollback is an edit, not a revert. No downstream file depends on their exact wording yet — phase
  007 has not executed.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Grounding (template + live evidence + audit) ──► Drafting (7 checklists) ──► Verification (shape, line count, citations)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Grounding | None | Drafting |
| Drafting | Grounding | Verification |
| Verification | Drafting | Phase 007 (manual-testing-playbook) citing these checklists |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Grounding | Med | Reading ~12 files across the hub template and the plugin repo |
| Drafting | Med | Seven checklists, ~860 lines total, each independently cited |
| Verification | Low | Line-count, shape, and citation re-check per file |
| **Total** | | **Single-session** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Every live file this plan cites was actually opened and read this session, not recalled from
  training.
- [x] No packet file was written outside `sk-code-obsidian/assets/` or `006-assets-checklists/`.

### Rollback Procedure
1. Identify the stale citation or section in the affected checklist.
2. Edit that section in place with the corrected fact.
3. Re-run the line-count and citation checks in §5.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A — this phase mutates only `sk-code-obsidian/assets/` and its own
  spec-kit folder.

<!-- /ANCHOR:enhanced-rollback -->
