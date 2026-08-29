---
title: "Tasks: sk-code-obsidian Surface Design Plan"
description: "Task breakdown for producing mode-design-plan.md and replacing this leaf's spec-kit scaffolds, in reading-then-drafting-then-verification order."
trigger_phrases:
  - "sk-code-obsidian design plan tasks"
  - "surface design plan task breakdown"
importance_tier: "high"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/025-sk-code-obsidian-surface/001-surface-design-plan"
    last_updated_at: "2026-08-28T20:30:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored surface design plan"
    next_safe_action: "Begin hub wiring"
    blockers: []
    key_files:
      - "mode-design-plan.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-code-obsidian-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: sk-code-obsidian Surface Design Plan

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

- [x] T001 Read the hub registry and router contract (`$HUB/.opencode/skills/sk-code/mode-registry.json`, `hub-router.json`, `shared/references/stack-detection.md`)
- [x] T002 Read the parent hub's own routing doctrine (`$HUB/.opencode/skills/sk-code/SKILL.md`, `ROUTER.md`)
- [x] T003 Read the two metadata/nested-packet doctrine documents (`sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md`, `.../parent-skill/parent-skills-nested-packets.md`)
- [x] T004 [P] Read the full `sk-code-mobile-cli/` tree — `SKILL.md`, `README.md`, and its file listing, as the binding shape template
- [x] T005 [P] Read the measured plugin state (`002-repo-convention-audit/audit.json`) and this packet's `goal.md`, `spec.md`, `roadmap.md`
- [x] T006 [P] Read the plugin repo's own `AGENTS.md`, `package.json`, and one sibling leaf `spec.md` for the spec-kit shape (`<plugin-repo>/specs/public/003-ui-improvement-build/001-empty-and-first-run-states/spec.md`)

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Draft §1-2: overview and packet identity (folder==packetSkillName, no nested graph-metadata.json/description.json, companion files) (`mode-design-plan.md`)
- [x] T011 Draft §3: the exact `mode-registry.json` modes[] entry, the `surfaces[]` append, and the alias-disjointness check against all 33 live aliases (`mode-design-plan.md`)
- [x] T012 Draft §4: the `hub-router.json` routerSignals key, the `code-obsidian-aliases`/`code-obsidian-runtime` vocabulary classes, and the tieBreak append (`mode-design-plan.md`)
- [x] T013 Draft §5: the OBSIDIAN detection branch, the `OPENCODE > OBSIDIAN > PI_REMOTE > WEBFLOW > UNKNOWN` precedence, the symlink CRITICAL GUARD, and the new test-case rows (`mode-design-plan.md`)
- [x] T014 Draft §6: the ten-row reference map covering the API boundary, single-stylesheet ownership, `.db-*` grammar, screenshot/fixture harness, verification, comment grammar, folder docs, view-renderer architecture, source naming, and the workflow doctrine (`mode-design-plan.md`)
- [x] T015 Draft §7: the machine-readable `§2b` smart-routing block (`DEFAULT_RESOURCE`, `INTENT_SIGNALS`, `RESOURCE_MAP`) (`mode-design-plan.md`)
- [x] T016 Draft §8-9: the workflow-doctrine symlink plan and the file-by-file build-packet handoff table with gates (`mode-design-plan.md`)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Confirm `mode-design-plan.md` line count falls inside 200-320 (`wc -l mode-design-plan.md`)
- [x] T021 Re-check every JSONC/bash/python block and every alias/count claim against the live cited file (`mode-registry.json`, `hub-router.json`, `stack-detection.md`, `audit.json`)
- [x] T022 Replace this leaf's `spec.md`, `plan.md`, `tasks.md` scaffolds and grep for residual scaffold markers (`REQUIREMENT_PLACEHOLDER`, bare `**Given**`) — none remain
- [x] T023 Confirm no file was written outside `001-surface-design-plan/`

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
- **Deliverable**: See `mode-design-plan.md`

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
- [x] CHK-003 [P1] Dependencies (hub files, template packet, audit) identified and read

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every section header is upper-case and numbered, matching the sk-code-mobile-cli grammar — verified 2026-08-29: SKILL.md's eight numbered H2s are identical to `sk-code-mobile-cli/SKILL.md`'s, parentheticals included
- [x] CHK-011 [P0] No spec path, requirement id, task id, or phase number appears in any code block destined for source — verified 2026-08-29: `scan-comments.mjs` PASS across 255 files — this is exactly the ephemeral-label check
- [x] CHK-012 [P1] Every cited hub path resolves against the live repository — verified 2026-08-29: `scan-skill-references.mjs` PASS: 35 documents, 214 cited paths, 0 broken, sentinel counter-example rejected
- [x] CHK-013 [P1] Prose distinguishes what was read from what was inferred — verified 2026-08-29: prose carries read-vs-inferred markers; thin but present
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] The proposed registry entry parses as valid JSON against the live schema — verified 2026-08-29: `mode-registry.json` parses; exactly one `sk-code-obsidian` entry
- [x] CHK-021 [P0] Proposed aliases are lowercase and disjoint from every existing sk-code mode alias — verified 2026-08-29: 5 aliases, 0 non-lowercase, 0 overlap against the 34 aliases of the other five modes
- [x] CHK-022 [P1] The detection precedence is stated with the symlink guard and worked test rows — verified 2026-08-29: `stack-detection.md` carries 9 OBSIDIAN mentions, 8 symlink/realpath guard lines, and the `OPENCODE >` precedence line
- [x] CHK-023 [P1] The reference map describes this plugin's real stack, not the template's Svelte stack — verified 2026-08-29: both `svelte` hits are contrastive ("Unlike a scoped-style stack…", "no React, no Svelte"); 17 reference files describe the Obsidian stack
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each hub file the build packet must touch is named with the exact edit it needs — verified 2026-08-29: the consumer table names each hub file with its exact edit and owning phase
- [x] CHK-FIX-002 [P0] Consumer inventory covers mode-registry.json, hub-router.json, ROUTER.md, and stack-detection.md — verified 2026-08-29: mode-registry.json 6, hub-router.json 4, ROUTER.md 2, stack-detection.md 7 mentions
- [x] CHK-FIX-003 [P1] The compiled-routing re-mint and the fleet metadata gate are listed as in-phase work, not follow-up — verified 2026-08-29: compiled-routing refresh is listed in-phase against 003, not deferred
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secret, token, or absolute personal path is embedded in any proposed artifact — verified 2026-08-29: 0 files under the packet contain `/Users/...` or token patterns
- [x] CHK-031 [P1] The packet's declared tool surface stays read-only, mutating nothing — verified 2026-08-29: toolSurface allowed [Read, Bash, Grep, Glob], forbidden [Write, Edit, Task], mutatesWorkspace false
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized with `mode-design-plan.md`
- [x] CHK-041 [P1] No spec paths, requirement ids, or task ids introduced into any code comment (none was written — this phase is documentation-only)
- [x] CHK-042 [P2] `README`/naming style matches `sk-code-mobile-cli`'s section grammar

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No file created outside `specs/sk-code/025-sk-code-obsidian-surface/001-surface-design-plan/`
- [x] CHK-051 [P1] `scratch/` left untouched (no temp files used)

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 4 | 4/4 |
| P1 Items | 7 | 7/7 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-08-28

<!-- /ANCHOR:summary -->
