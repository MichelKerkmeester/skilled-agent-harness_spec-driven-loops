---
title: "Implementation Plan: Phase 009 — README Alignment (Hub + Sub-Skills)"
description: "Complete Level 2 plan for updating the sk-design hub README.md and its five mode-packet README.md files to match the shipped Phase 002-005 reality, using sk-doc's readme templates."
trigger_phrases:
  - "implementation plan"
  - "readme alignment"
  - "sk-design readme alignment"
  - "mode packet readme"
importance_tier: "normal"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/sk-design/009-sk-design-claude-parity/009-readme-alignment/"
    last_updated_at: "2026-07-06T05:10:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Verified all six README edits against the live tree"
    next_safe_action: "Start Phase 010 feature-catalog-completeness"
---
# Implementation Plan: Phase 009 — README Alignment (Hub + Sub-Skills)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | `sk-design` hub and mode-packet documentation (`README.md` files only) |
| **Primary Area** | `.opencode/skills/sk-design/README.md` and the five `.opencode/skills/sk-design/design-*/README.md` files |
| **Spec Level** | 2 |
| **Testing** | `sk-doc` README validator per file, parent-skill canon checker for the hub, link resolution review, Human Voice Rules review |
| **Mutation Policy** | Six `README.md` edits; no `SKILL.md`, registry, router, `procedures/**`, `shared/**`, `benchmark/**`, or `manual_testing_playbook/**` content file changes |

### Overview

This plan updates six README files so they describe the `sk-design` family as it exists after Phases 002-005: the hub manager-shell behavior, the private procedure-card layer, the mode-packet refactor, and the extended benchmark and playbook. It uses `sk-doc`'s `readme_template.md` / `skill_readme_template.md` as the structural template and changes no runtime behavior.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 009 documentation scope is explicit and confined to the six named README files. Evidence: `spec.md` Section 3 names each file and change type.
- [x] README alignment findings are documented with file-level evidence. Evidence: `spec.md` "README Alignment Findings" table.
- [x] Phase 008 gate closes with evidence before implementation. Evidence: `../008-smart-routing-optimization/checklist.md` line 170 records `Gate Status: CLOSED`; `../008-smart-routing-optimization/implementation-summary.md` line 34 records `Status: Complete`.
- [x] Live hub and mode-packet state is re-read immediately before drafting, not assumed from this plan. Evidence: `SKILL.md`, `mode-registry.json`, each mode's `procedures/` directory, and each mode's `manual_testing_playbook/` are read fresh at implementation time.
- [x] Canonical validator and canon-checker commands are named. Evidence: `validate_document.py --type readme` and `parent-skill-check.cjs` commands are recorded in Section 5.

### Definition of Done
- [x] Hub README names `benchmark/` and `manual_testing_playbook/`. Evidence: `RELATED DOCUMENTS` (or an added section) links both paths.
- [x] Hub README cites the Phase 002 hub-shell contract section names. Evidence: `Manager Intake Before Routing`, `Visible Plan Before Design or Build Work`, `Proof Gates and Verifier Cadence`, and the transport-vs-taste separation are each named with their `SKILL.md` section number.
- [x] Each of the five mode READMEs names its own `procedures/` folder and card count. Evidence: each README's `RELATED DOCUMENTS` (or `HOW IT WORKS`) links the folder and, where useful, individual cards.
- [x] `design-motion/README.md`'s VERIFICATION section matches the live playbook's scenario count and category list. Evidence: re-read `design-motion/manual_testing_playbook/manual_testing_playbook.md` Section 1 at implementation time and match the README's claim to it exactly.
- [x] `design-md-generator/README.md` carries a frontmatter block matching sibling convention. Evidence: `title`, `description`, `trigger_phrases`, `version` fields exist, with `trigger_phrases` sourced from `mode-registry.json`'s `md-generator` `aliases`.
- [x] README validator reports zero issues for all six files. Evidence: `validate_document.py --type readme` output per file.
- [x] Parent-skill canon check remains a clean pass. Evidence: `parent-skill-check.cjs` exit code and failure/warning counts after the edits.
- [x] No non-README file is touched. Evidence: scoped `git diff --name-only` lists only the six README files plus this phase folder.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Documentation-only alignment pass: each of the six README files is audited against the live skill tree, then edited in place to add the missing references and correct the one stale claim. No new file, section shape, or runtime behavior is introduced; the pattern is "read live state, then narrow the gap" per file.

### Key Components
- **Hub Audit**: Confirm `benchmark/` and `manual_testing_playbook/` contents and the exact `SKILL.md` section numbers for the hub-shell contract, then edit `README.md` (hub).
- **Per-Mode Procedure Audit**: For each of the five modes, list its `procedures/` directory and edit that mode's `README.md` to reference it.
- **Motion Playbook Reconciliation**: Re-count `design-motion`'s live playbook scenarios and categories, then correct the VERIFICATION section.
- **Frontmatter Backfill**: Add a YAML frontmatter block to `design-md-generator/README.md`, sourced from `mode-registry.json`'s `md-generator` entry and the file's own existing prose.
- **Verification Pass**: Run the README validator per file and the parent-skill canon checker once after all six edits land.

### Data Flow
1. Confirm Phase 008 gate closure (or explicit user approval to proceed without it).
2. Re-read the live hub `SKILL.md`, `mode-registry.json`, and each mode's `procedures/` and `manual_testing_playbook/` directories.
3. Draft the hub README edit against the confirmed `benchmark/`, `manual_testing_playbook/`, and `SKILL.md` section evidence.
4. Draft each of the five mode README edits against the confirmed `procedures/` evidence, correcting `design-motion`'s scenario claim and adding `design-md-generator`'s frontmatter.
5. Run the README validator per file and fix any reported issue in that file only.
6. Run the parent-skill canon checker once across the hub and confirm 0 failures, 0 warnings.
7. Record evidence in `checklist.md` and close the phase (implementation-summary.md is added only once this work actually happens).

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Entry Gate and Live-State Audit
- [x] Confirm Phase 008 gate closure or explicit user approval to proceed. Evidence: Phase 008 `checklist.md` gate status, or a recorded user approval note.
- [x] Re-read `.opencode/skills/sk-design/SKILL.md`, `mode-registry.json`, and `hub-router.json` before drafting any hub edit.
- [x] Re-list `benchmark/` and `manual_testing_playbook/` contents at the hub root.
- [x] Re-list each of the five modes' `procedures/` directories and `manual_testing_playbook/` contents.
- [x] Record any logic-sync conflict between this plan's cited counts and the live tree before writing.

### Phase 2: README Drafting
- [x] Edit `.opencode/skills/sk-design/README.md`: add `benchmark/` and `manual_testing_playbook/` references; name the hub-shell contract sections by number.
- [x] Edit `design-interface/README.md`: add the `procedures/` reference.
- [x] Edit `design-foundations/README.md`: add the `procedures/` reference.
- [x] Edit `design-motion/README.md`: add the `procedures/` reference; correct the VERIFICATION scenario count and category list.
- [x] Edit `design-audit/README.md`: add the `procedures/` reference.
- [x] Edit `design-md-generator/README.md`: add the missing frontmatter block; add the `procedures/` reference.

### Phase 3: Verification
- [x] Run `python3 .opencode/skills/sk-doc/scripts/validate_document.py <readme> --type readme` for each of the six edited files and fix any reported issue in that file only.
- [x] Run `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-design` and confirm 0 failures, 0 warnings.
- [x] Confirm every newly added link resolves on disk (`procedures/`, `benchmark/`, `manual_testing_playbook/` paths).
- [x] Review each edited passage against Human Voice Rules (no em dashes, semicolons, Oxford commas, banned words, or setup phrases).
- [x] Run scoped `git diff --name-only` and confirm only the six README files plus this phase folder changed.

### Phase 4: Documentation and Handoff
- [x] Update this phase's `checklist.md` with concrete evidence per item.
- [x] Regenerate `description.json` and `graph-metadata.json` last, after all content edits land.
- [x] Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` and record the exit code.
- [x] Add `implementation-summary.md` once the work above is actually complete, not before.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| README structure validation | Section model, frontmatter, required `OVERVIEW` header | `python3 .opencode/skills/sk-doc/scripts/validate_document.py <readme> --type readme` |
| Parent-skill canon check | Hub-level invariants (checks 9a/9b for `benchmark/`/`manual_testing_playbook/` presence, plus the full check set) | `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-design` |
| Link resolution | Every new or edited path reference in a README | `Read`/`Glob` on each cited path |
| Human Voice Rules review | Every newly written or edited passage | Manual review against `.opencode/skills/sk-doc/references/global/hvr_rules.md` |
| Scope diff | No non-README file touched | Scoped `git diff --name-only` |
| Strict spec validation | This phase's own docs and generated metadata | `validate.sh --strict` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 008 closure | Governance | Closed. `../008-smart-routing-optimization/checklist.md` Gate Status CLOSED | Implementation proceeded after routing-language gate closed |
| Phases 001-005 content source of truth | Evidence | Closed | README content grounds in shipped, verified behavior |
| Live `sk-design` tree at implementation time | Evidence | Must be re-read, not assumed | Prevents drafting against a stale count from this plan |
| `sk-doc` README templates | Structural | Available (`readme_template.md`, `skill_readme_template.md`) | README shape stays consistent with house style |
| Parent-skill canon checker | Verification | Available, currently passes | Confirms the README edits do not regress hub canon |
| Sibling phases `011`, `013` (and any others landing concurrently) | Concurrency | In progress, out of scope | This phase does not read or depend on their content |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Phase 008 has not closed and no explicit user approval to proceed exists, a cited path does not resolve, the parent-skill canon check regresses, or a non-README file gets touched.
- **Procedure**: Stop implementation; inspect `git diff` and `git status` first; revert or remove only the affected README edit after explicit approval; preserve unrelated worktree and sibling-phase work.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 008 Gate ──> Live-State Audit ──> README Drafting ──> Verification ──> Documentation Handoff
       │                                                                          │
       └───────────── blocks all Phase 009 README edits until evidenced ─────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 008 Gate | Phase 008 checklist evidence (or explicit user approval) | All Phase 009 implementation |
| Live-State Audit | Phase 008 Gate | README Drafting |
| README Drafting | Live-State Audit | Verification |
| Verification | README Drafting | Documentation Handoff |
| Documentation Handoff | Verification | Phase 010 feature-catalog work (no direct content dependency) |

<!-- /ANCHOR:l2-phase-deps -->
---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Entry Gate and Live-State Audit | Low | 20-35 minutes |
| README Drafting (six files) | Medium | 60-100 minutes |
| Verification | Low | 20-35 minutes |
| Documentation and Handoff | Low | 15-25 minutes |
| **Total** | | **~2-3.5 hours after Phase 008 closure** |

<!-- /ANCHOR:l2-effort -->
---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-implementation Checklist
- [x] Phase 008 gate is closed, or explicit user approval to proceed without it is recorded.
- [x] Live hub and mode-packet files are re-read before any edit, not assumed from this plan.
- [x] Link-resolution evidence for every planned reference is gathered before writing.
- [x] Non-destructive rollback path is named (below).
- [x] Scope boundary (six README files only) is restated before the first edit.

### Rollback Procedure
1. **Immediate**: Stop the README edit in progress and preserve current worktree state.
2. **Document**: Record which invariant failed: gate closure, link resolution, canon check, or scope boundary.
3. **Preserve**: Avoid stash/reset/revert until unrelated work ownership is clear.
4. **Recover**: Remove or revise only the affected README edit after approval.
5. **Re-verify**: Re-run the README validator and canon checker before resuming.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Documentation-only changes; revert the specific README edit via its own diff, or delete this phase folder to remove the planning docs, preserving any unrelated worktree state.

<!-- /ANCHOR:l2-rollback -->
