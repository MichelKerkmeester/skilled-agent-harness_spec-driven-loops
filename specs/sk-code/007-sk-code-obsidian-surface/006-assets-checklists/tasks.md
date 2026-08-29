---
title: "Tasks: sk-code-obsidian On-Demand Checklists"
description: "Task breakdown for authoring the seven assets/*.md checklists and replacing this leaf's spec-kit scaffolds, in reading-then-drafting-then-verification order."
trigger_phrases:
  - "sk-code-obsidian checklist tasks"
  - "assets checklists task breakdown"
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
# Tasks: sk-code-obsidian On-Demand Checklists

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

- [x] T001 Read the markdown agent persona and its write boundary (`.claude/agents/markdown.md`)
- [x] T002 [P] Read the full `sk-code-mobile-cli/assets/` set as the binding shape template — close
  read of `bem-rename-checklist.md`, `story-coverage-checklist.md`, `ds-verification-checklist.md`
- [x] T003 [P] Read `sk-code-obsidian/SKILL.md` and `001-surface-design-plan/mode-design-plan.md`
  §6-7 for the reference map and the five-name asset proposal this phase supersedes
- [x] T004 [P] Read `002-repo-convention-audit/audit.json` and `<plugin-repo>/specs/public/HANDOVER.md` for
  measured counts and the six recorded P0/P1 items
- [x] T005 [P] Read live plugin evidence: `src/views/ScreenshotFixtures.test.ts`,
  `tools/screenshots/scenarios.mjs`, `tools/screenshots/scenarios/core.mjs`,
  `tools/screenshots/verify.mjs`, `tools/screenshots/capture.mjs`, `styles.css` (preamble),
  `AGENTS.md`, `package.json`
- [x] T006 List `src/views/modals/` and `tools/screenshots/scenarios/` to ground the modal-coverage
  and screenshot-coverage checklists in the real file set

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Draft `screenshot-coverage-checklist.md` — new-scenario-in-the-same-change discipline,
  `sources` list accuracy, the two gates, opening the changed PNGs, unphotographed-surface
  awareness (`sk-code-obsidian/assets/screenshot-coverage-checklist.md`)
- [x] T011 Draft `db-class-rename-checklist.md` — injective map, static occurrences, dynamic
  construction sites (including the `CardFieldRenderer` parameter trap), fixture/scenario sites,
  orphan awareness, render proof (`sk-code-obsidian/assets/db-class-rename-checklist.md`)
- [x] T012 Draft `fixture-authoring-checklist.md` — real classes only, the
  `ScreenshotFixtures.test.ts` guard, the card-field parameter trap, `runtime-vars.css`/`theme.css`
  stand-ins, sources list, device/body class (`sk-code-obsidian/assets/fixture-authoring-checklist.md`)
- [x] T013 Draft `verification-checklist.md` — the iron law, type/build gates, test gate,
  screenshot-freshness gate, and the 115-problem lint baseline with delta-reporting discipline
  (`sk-code-obsidian/assets/verification-checklist.md`)
- [x] T014 Draft `folder-docs-checklist.md` — the >=3-direct-source threshold in both directions,
  the seven folders that owe docs today, README/CODE content split, scanner awareness
  (`sk-code-obsidian/assets/folder-docs-checklist.md`)
- [x] T015 Draft `comment-banner-checklist.md` — the MODULE banner shape, numbered upper-case
  sections, the `styles.css` CJK/`===` preamble distinction, the spec/task-id leakage rule
  (`sk-code-obsidian/assets/comment-banner-checklist.md`)
- [x] T016 Draft `modal-coverage-checklist.md` — the 17 modal filenames, the non-recursing-`ls`
  root cause, adding a modal scenario, the `SKILL.md` §5 escalation rule
  (`sk-code-obsidian/assets/modal-coverage-checklist.md`)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Confirm every checklist falls inside 90-140 lines (`wc -l sk-code-obsidian/assets/*.md`)
- [x] T021 Re-check every cited class name, file path, command, and count against the live plugin
  file or `audit.json` it was drawn from
- [x] T022 Replace this leaf's `spec.md`, `plan.md`, `tasks.md` scaffolds and grep for residual
  scaffold markers (`REQUIREMENT_PLACEHOLDER`, bare `**Given**`) — none remain
- [x] T023 Confirm no file was written outside `sk-code-obsidian/assets/` or
  `006-assets-checklists/`
- [x] T024 Confirm `SKILL.md`, `README.md`, `references/`, and every hub routing file were left
  untouched

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
- **Deliverables**: `$HUB/.opencode/skills/sk-code/sk-code-obsidian/assets/*.md` (seven files)

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
- [x] CHK-003 [P1] Dependencies (template checklists, audit, live plugin evidence) identified and
  read

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every checklist's section headers are upper-case and numbered, matching the
  `sk-code-mobile-cli/assets/` grammar
- [x] CHK-011 [P0] No spec path, requirement id, task id, or phase number appears inside any
  checklist's body text
- [x] CHK-012 [P1] Every cited plugin path and class name resolves against the live repository
- [x] CHK-013 [P1] Every checklist closes with a `THE GATE` section restating its own checkbox
  items as one proof bar
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Each checklist's frontmatter parses as valid YAML with the six required keys
- [x] CHK-021 [P0] Line counts for all seven files fall inside 90-140
- [x] CHK-022 [P1] `screenshot-coverage-checklist.md` and `modal-coverage-checklist.md` cite the
  same non-recursing-`ls` root cause without contradiction
- [x] CHK-023 [P1] `db-class-rename-checklist.md` and `fixture-authoring-checklist.md` both name
  `ScreenshotFixtures.test.ts` as the guard mechanism
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] All seven checklists named in this phase's dispatch brief were authored —
  none deferred
- [x] CHK-FIX-002 [P0] The five-vs-seven checklist-name discrepancy against `SKILL.md` §4 /
  `mode-design-plan.md` §7 is recorded in `spec.md` §2/§6/§8, not silently left unexplained
- [x] CHK-FIX-003 [P1] Target-state conventions (`MODULE:` banners, folder docs) are labeled
  honestly as not-yet-adopted in their checklists, per `SKILL.md` §3b
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secret, token, or absolute personal path is embedded in any checklist
- [x] CHK-031 [P1] The packet's declared tool surface stays read-only; this phase mutates only
  `sk-code-obsidian/assets/` and its own spec-kit folder
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized with the seven delivered checklists
- [x] CHK-041 [P1] No spec paths, requirement ids, or task ids introduced into any checklist
  (checklists are documentation-only; the leakage rule they document was also followed while
  writing them)
- [x] CHK-042 [P2] Checklist naming style (kebab-case, `-checklist.md` suffix) matches
  `sk-code-mobile-cli/assets/`'s convention

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No file created outside `sk-code-obsidian/assets/` or
  `specs/sk-code/007-sk-code-obsidian-surface/006-assets-checklists/`
- [x] CHK-051 [P1] `scratch/` left untouched (no temp files used)
- [x] CHK-052 [P1] `SKILL.md`, `README.md`, `references/`, and every hub routing file left
  untouched, per the write boundary

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 5 | 5/5 |
| P1 Items | 9 | 9/9 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-08-28

<!-- /ANCHOR:summary -->
