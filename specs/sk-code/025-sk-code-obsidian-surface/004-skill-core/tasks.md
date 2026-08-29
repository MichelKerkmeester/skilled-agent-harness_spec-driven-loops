---
title: "Tasks: sk-code-obsidian SKILL.md and README.md"
description: "Task breakdown for authoring SKILL.md and README.md and replacing this leaf's spec-kit scaffolds, in reading-then-drafting-then-verification order."
trigger_phrases:
  - "sk-code-obsidian skill core tasks"
  - "obsidian surface skill task breakdown"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/025-sk-code-obsidian-surface/004-skill-core"
    last_updated_at: "2026-08-28T21:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored SKILL.md and README.md"
    next_safe_action: "Author reference stack"
    blockers: []
    key_files:
      - "$HUB/.opencode/skills/sk-code/sk-code-obsidian/SKILL.md"
      - "$HUB/.opencode/skills/sk-code/sk-code-obsidian/README.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-code-obsidian-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: sk-code-obsidian SKILL.md and README.md

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
- [x] T002 Read the two authoring contracts (`$HUB/.opencode/skills/sk-doc/sk-create-skill/SKILL.md`, `sk-create-readme/SKILL.md`)
- [x] T003 [P] Read the binding style template in full (`sk-code-mobile-cli/SKILL.md`, `sk-code-mobile-cli/README.md`)
- [x] T004 [P] Read the approved design plan (`../001-surface-design-plan/mode-design-plan.md`) and the measured audit (`../002-repo-convention-audit/audit.json`)
- [x] T005 [P] Read the plugin repository's own conventions and metadata (`AGENTS.md`, `package.json`, `manifest.json`, `<plugin-repo>/specs/public/HANDOVER.md`)
- [x] T006 [P] Read enough of `src/views/`, `src/data/`, `src/views/modals/`, and `tools/screenshots/` to confirm renderer names, file counts, and the harness contract firsthand

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Author `SKILL.md` frontmatter, keyword comments, and title matching the template's one-line forms (`$HUB/.opencode/skills/sk-code/sk-code-obsidian/SKILL.md`)
- [x] T011 Author `SKILL.md` §1 WHEN THE HUB BUNDLES THIS, describing OBSIDIAN detection and typical bundled resolutions (`SKILL.md`)
- [x] T012 Author `SKILL.md` §2 REFERENCE MAP and §2b SMART ROUTING from the design plan's proposed reference set and Python block (`SKILL.md`)
- [x] T013 Author `SKILL.md` §3 SURFACE STANDARDS from the measured verification-gate baseline and the harness's known traps (`SKILL.md`)
- [x] T014 Author `SKILL.md` §3b SOURCE TREE CONVENTIONS, splitting shipped fact from target convention against the audit's exact counts (`SKILL.md`)
- [x] T015 Author `SKILL.md` §4 ASSETS, §5 RULES, and §6 INTEGRATION POINTS (`SKILL.md`)
- [x] T016 Author `README.md`'s eight sections — AT A GLANCE, OVERVIEW, QUICK START, HOW IT WORKS, INTEGRATION & NAVIGATION, FAQ, VERIFICATION, RELATED DOCUMENTS (`$HUB/.opencode/skills/sk-code/sk-code-obsidian/README.md`)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Diff `SKILL.md`/`README.md` section headers against `sk-code-mobile-cli`'s for shape parity
- [x] T021 Re-check every concrete number in both files against `audit.json` or the live plugin reads from Phase 1
- [x] T022 Grep both files for `svelte`, `runes`, and `scoped style` and confirm no match
- [x] T023 Replace this leaf's `spec.md`, `plan.md`, `tasks.md` scaffolds and grep for residual scaffold markers — none remain
- [x] T024 Confirm no file was written outside `$HUB/.opencode/skills/sk-code/sk-code-obsidian/{SKILL.md,README.md}` and this leaf's own folder

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
- **Deliverables**: `$HUB/.opencode/skills/sk-code/sk-code-obsidian/SKILL.md`, `README.md`

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
- [x] CHK-003 [P1] Dependencies (style template, authoring contracts, design plan, audit, plugin reads) identified and read

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every section header in `SKILL.md`/`README.md` is upper-case and numbered, matching the `sk-code-mobile-cli` grammar
- [x] CHK-011 [P0] No spec path, requirement id, task id, or phase number appears in either file
- [x] CHK-012 [P1] Every cited plugin path and count resolves against the live repository or `audit.json`
- [x] CHK-013 [P1] Prose distinguishes shipped convention from target convention in `SKILL.md` §3b
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] `SKILL.md` frontmatter parses as valid YAML against the `sk-create-skill` contract (name, description, allowed-tools, version, metadata block)
- [x] CHK-021 [P0] No Svelte, SvelteKit, runes, or scoped-style term appears in either file
- [x] CHK-022 [P1] `README.md`'s eight sections appear in the required order
- [x] CHK-023 [P1] `SKILL.md` §2b's Python block defines `DEFAULT_RESOURCE`, `INTENT_SIGNALS`, and `RESOURCE_MAP`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Every reference and asset path named in `SKILL.md` is one phase 005/006 can author against, with no dangling name outside the design plan's proposed set
- [x] CHK-FIX-002 [P0] The six recorded P0/P1 items and the unphotographed-modals gap are named as evidence, not proposed fixes
- [x] CHK-FIX-003 [P1] The lint baseline (115 problems) is stated as a recorded fact, never implied clean
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secret, token, or absolute personal path is embedded in either file
- [x] CHK-031 [P1] The packet's declared tool surface (`Read, Bash, Grep, Glob`) stays read-only, mutating nothing
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized with the authored `SKILL.md`/`README.md`
- [x] CHK-041 [P1] No spec paths, requirement ids, or task ids introduced into either authored file
- [x] CHK-042 [P2] Section and rule style matches `sk-code-mobile-cli`'s grammar throughout

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Only `SKILL.md` and `README.md` were created under `sk-code-obsidian/`; no other file was added there
- [x] CHK-051 [P1] `scratch/` left untouched (no temp files used)

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 5 | 5/5 |
| P1 Items | 8 | 8/8 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-08-28

<!-- /ANCHOR:summary -->
