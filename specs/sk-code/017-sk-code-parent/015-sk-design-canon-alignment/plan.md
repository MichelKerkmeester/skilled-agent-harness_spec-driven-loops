---
title: "Implementation Plan: Phase 15 sk-design canon alignment"
description: "Forward-looking execution plan for the remaining sk-design parent-hub canon gaps: real hub changelog entries, hub description, manual playbook, Lane-C baseline, transform-verb extension, and broken interface README link repair."
trigger_phrases:
  - "sk-design canon plan"
  - "sk-design Lane-C baseline"
  - "sk-design transform verbs"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/017-sk-code-parent/015-sk-design-canon-alignment"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Phase planned and documented; execution pending"
    next_safe_action: "Start with the hub changelog symlink deletion task."
    blockers:
      - "Declarative bundleRules conversion waits for phase 017 canon reconciliation."
    key_files:
      - ".opencode/skills/sk-design/changelog/"
      - ".opencode/skills/sk-design/description.json"
      - ".opencode/skills/sk-design/manual_testing_playbook/"
      - ".opencode/skills/sk-design/benchmark/"
      - ".opencode/skills/sk-design/mode-registry.json"
      - ".opencode/skills/sk-design/design-interface/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-015-doc-authoring"
      parent_session_id: null
    completion_pct: 15
    open_questions:
      - "Whether declarative bundleRules should ship in this phase after phase 017, or remain as prose-only routing with a TODO."
    answered_questions:
      - question: "Can packetKind work be skipped?"
        answer: "Yes. It is already done and pushed in commit f8673ff0db."
---
# Implementation Plan: Phase 15 sk-design canon alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, symlink filesystem state, benchmark artifacts |
| **Framework** | OpenCode parent skill hub canon and sk-doc parent hub templates |
| **Storage** | Repository filesystem under `.opencode/skills/sk-design/` |
| **Testing** | `parent-skill-check` strict, markdown link verification, benchmark baseline review |

### Overview
This phase will close the remaining sk-design parent-hub canon failures after the already-pushed `packetKind` fix. The sequence starts with low-risk strict-check blockers, then adds hub companion artifacts, then adds transform-verb registry metadata while keeping declarative `bundleRules` blocked on phase 017.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Master plan marks phase 015 safe-now Level 2 and names the exact deliverables. Source: master plan lines 17-26.
- [x] Audit digest identifies four sk-design strict parent-skill-check failures. Source: audit digest lines 7-10 and P0-9 through P0-12.
- [x] `packetKind` work is already complete and pushed. Source: user note and master plan line 19.
- [ ] Confirm target sk-design files are not concurrently dirty before editing. Source: master plan branch collision caution lines 61-63.

### Definition of Done
- [ ] Five hub changelog symlinks deleted, with per-mode packet changelog directories untouched. Source: audit P0-9.
- [ ] Hub `description.json` authored from parent skill description template. Source: audit P0-10.
- [ ] Hub `manual_testing_playbook/` scaffolded for mode classification and transform-verb framing. Source: audit P0-11.
- [ ] Hub `benchmark/` Lane-C baseline produced. Source: audit P0-12.
- [ ] `extensions: { transform-verbs }` declared. Source: master plan line 24.
- [ ] Declarative `bundleRules` either completed after phase 017 or documented as blocked. Source: master plan lines 24 and 38-46.
- [ ] Broken `design-interface/README.md` link fixed. Source: master plan line 25.
- [ ] `PARENT_HUB_CHECK_STRICT=1` parent-skill-check for sk-design reports 0 fails. Source: master plan line 26.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Parent skill hub companion-file alignment. The hub remains one public sk-design identity with workflow packets for interface, foundations, motion, audit, and md-generator; this phase fills missing hub-level companion artifacts and transform-verb routing metadata.

### Key Components
- **Hub changelog**: Real hub version files only; symlinked packet changelog entries are non-canonical.
- **Hub description**: Advisor-facing metadata with name, description, four-part version, keyword coverage, and trigger examples.
- **Manual testing playbook**: Hub-level behavioral scenarios for mode classification and transform-verb framing.
- **Benchmark baseline**: Lane-C hub baseline package to support later cross-hub comparison in phase 019.
- **Mode registry extension**: `transform-verbs` declaration for design-like prompt transforms.
- **Bundle rules**: Deferred declarative conversion until phase 017 reconciles the canon vocabulary.

### Data Flow
Execution updates sk-design hub artifacts, then strict parent-hub validation reads hub changelog, description, playbook, benchmark, registry, and router metadata. Phase 019 later consumes the benchmark baseline for cross-hub comparison.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm working tree status for `.opencode/skills/sk-design/` before editing. Trace: master plan collision notes lines 61-63.
- [ ] Verify the five audited hub changelog entries are symlinks. Trace: audit P0-9.
- [ ] Read current sk-design `SKILL.md`, `mode-registry.json`, `hub-router.json`, and design-interface README before editing. Trace: parent-hub canon and read-first rule.
- [x] Record pushed packetKind work as completed evidence, not new work. Trace: master line 19 and user note.

### Phase 2: Core Implementation
- [ ] Delete only the five sk-design hub changelog symlinks. Trace: audit P0-9.
- [ ] Author hub `description.json` from `parent_skill_description_template.json` with name `sk-design`, a four-part version, SKILL keywords, and trigger examples. Trace: audit P0-10 and master line 21.
- [ ] Scaffold hub `manual_testing_playbook/` for mode classification and transform-verb framing. Trace: audit P0-11 and master line 22.
- [ ] Produce hub `benchmark/` Lane-C baseline after the playbook exists. Trace: audit P0-12 and master line 23.
- [ ] Add `transform-verbs` to the mode registry extension declaration. Trace: master line 24 and parent hub template lines 215-225.
- [ ] Fix `design-interface/README.md` broken link to `../sk-code/README.md`. Trace: master line 25.
- [ ] Keep declarative `bundleRules` blocked unless phase 017 has reconciled the canon field vocabulary. Trace: master lines 24 and 38-46.

### Phase 3: Verification
- [ ] Run strict parent-skill-check for sk-design and require 0 fails. Trace: master line 26.
- [ ] Verify markdown link repair for `design-interface/README.md`. Trace: master line 25.
- [ ] Inspect benchmark baseline artifacts for Lane-C package completeness. Trace: master line 23 and audit P0-12.
- [ ] Confirm no files outside sk-design execution scope and this phase folder were modified. Trace: brief hard rule lines 33-36.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Parent hub contract | sk-design hub companion artifacts and registry | `parent-skill-check` with `PARENT_HUB_CHECK_STRICT=1` |
| Link integrity | `design-interface/README.md` broken link repair | Markdown link checker or targeted path verification |
| Artifact review | `description.json`, playbook, benchmark | Template comparison and file inventory |
| Scope audit | Phase folder plus sk-design-only execution files | `git diff --name-only` scoped review |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Commit `f8673ff0db` packetKind repair | Internal | Complete | Progress remains below 15% if absent; do not redo it in this phase |
| Parent description template | Internal | Available | `description.json` cannot be canon-shaped without it |
| sk-code benchmark reference shape | Internal | Available | Lane-C baseline shape lacks local exemplar if unavailable |
| Phase 017 bundleRules reconciliation | Internal | Blocked for this phase | Declarative bundleRules conversion cannot safely proceed |
| Current sk-design files | Internal | Must be read before editing | Execution must halt if dirty files directly conflict |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Strict parent-skill-check introduces new sk-design failures, benchmark artifacts are malformed, or symlink deletion removes real changelog content.
- **Procedure**: Revert only the phase execution changes under `.opencode/skills/sk-design/`, restore any deleted hub symlinks if needed, and re-run strict parent-skill-check to return to the pre-phase audited state.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Master plan, audit digest, pushed packetKind repair | Core Implementation |
| Core Implementation | Clean sk-design edit scope and template references | Verification |
| Verification | Core Implementation | Phase 019 cross-hub rollup readiness |
| BundleRules Conversion | Phase 017 canon reconciliation | Final declarative router encoding |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Confirm symlinks, read current hub files, and confirm no direct conflicts |
| Core Implementation | Medium | Six artifact/link/registry edits plus one blocked bundleRules decision |
| Verification | Medium | Strict parent check, link verification, benchmark artifact review, and diff scope review |
| **Total** | | **Moderate Level 2 phase** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Record current symlink targets before deletion.
- [ ] Confirm no data migrations or persistent service changes are involved.
- [ ] Keep phase 017-dependent bundleRules changes out unless the canon reconciliation has landed.

### Rollback Procedure
1. Revert sk-design file changes from this phase execution.
2. Restore the five hub changelog symlinks only if rollback requires matching the audited pre-phase state.
3. Remove newly added hub `description.json`, `manual_testing_playbook/`, or `benchmark/` artifacts if they caused the regression.
4. Re-run strict parent-skill-check for sk-design and compare fail count with the audited baseline.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Revert repository filesystem and JSON/Markdown artifacts only.

<!-- /ANCHOR:enhanced-rollback -->
