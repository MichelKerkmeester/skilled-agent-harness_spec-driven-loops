---
title: "Implementation Plan: Skill and Mode README Overhaul"
description: "Author the fourteen target READMEs with a parallel Sonnet swarm against a shared brief, validate each with the floor validator, then reconcile and commit as one phase."
importance_tier: "normal"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/021-documentation-quality-program/004-skill-mode-readme-overhaul"
    last_updated_at: "2026-07-22T13:08:26Z"
    last_updated_by: "claude"
    recent_action: "Reconciled and validated all fourteen READMEs."
    next_safe_action: "Proceed to phase 005."
    blockers: []
    key_files: []
---

# Implementation Plan: Skill and Mode README Overhaul

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (skill READMEs) |
| **Subsystem** | sk-doc modes, sk-code surfaces, sk-git |
| **Testing** | `validate_document.py --type readme` floor plus the template Section-5 manual checklist |
| **Branch** | `sk-doc/0097-documentation-quality` |

### Overview

Fan out one Sonnet author per skill family against a single shared brief that carries the template, the exemplar, the voice rules, and the floor validator. Each author owns a distinct set of files, so parallel writes never collide. The orchestrator reconciles the output, spot-checks the voice against the template checklist, runs the floor validator across every file, and commits the phase once.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Template confirmed current (phase 003 clarifications landed) and the floor validator path fixed
- [x] A calibration exemplar and an explicit non-exemplar named in the brief
- [x] The fourteen target files confirmed by line-count and header scan

### Definition of Done
- [x] All fourteen READMEs report VALID under the floor validator
- [x] Each rewrite opens with a pitch and AT A GLANCE and a problem-first OVERVIEW
- [x] Spot HVR check clean on the authored prose

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

A shared brief file holds the entire contract once. Five author agents read it, each owning a non-overlapping file set. Reconciliation is central: the orchestrator does not re-author, it verifies. The floor validator is a gate, and the template Section-5 checklist is the human-judgment gate the script cannot cover.

### Key Components
- The shared brief (template, exemplar, HVR, sourcing rules, special cases).
- Five author agents, grouped by skill family.
- The floor validator plus a spot HVR grep as the reconcile gate.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the template, the exemplar, and one bare README to calibrate the brief.
- [x] Confirm the fourteen targets and their current state.
- [x] Write the shared brief.

### Phase 2: Authoring
- [x] Dispatch five parallel authors, each owning a distinct file set.

### Phase 3: Reconcile and Verify
- [x] Validate every rewritten README with the floor validator.
- [x] Spot-check voice and HVR against the template checklist.
- [x] Fix any file that misses the bar, then commit the phase.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | Every README clears the floor | `validate_document.py --type readme` |
| Voice | Pitch, AT A GLANCE, problem-first OVERVIEW present | Template Section-5 checklist, manual |
| HVR | No em dashes, semicolons, Oxford commas in authored prose | `grep` spot check |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 003 validator fix | Internal | Green | Authors cannot run the documented validator command |
| skill-readme-template.md | Internal | Green | No section model to author against |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a rewritten README loses information present in the old one.
- **Procedure**: `git checkout` restores the prior README on the worktree branch. Each file is independent, so a single bad file reverts without touching the others.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──▶ Authoring ──▶ Reconcile and Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 003 | Authoring |
| Authoring | Setup | Reconcile |
| Reconcile and Verify | Authoring | None |

<!-- /ANCHOR:l2-phase-deps -->
---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 minutes |
| Authoring | Medium | parallel, one author per family |
| Reconcile and Verify | Medium | 45 minutes |
| **Total** | | **about 2 hours wall-clock** |

<!-- /ANCHOR:l2-effort -->
---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Old READMEs are under git and recoverable per file
- [x] Each author owns a disjoint file set (no parallel-write conflicts)
- [x] Merge to v4 held behind the operator gate

### Rollback Procedure
1. `git checkout -- <the offending README>` to restore one file.
2. Re-run the floor validator on the restored file to confirm baseline.

### Data Reversal
- **Has data migrations?** No. Markdown documentation only.

<!-- /ANCHOR:l2-rollback -->
