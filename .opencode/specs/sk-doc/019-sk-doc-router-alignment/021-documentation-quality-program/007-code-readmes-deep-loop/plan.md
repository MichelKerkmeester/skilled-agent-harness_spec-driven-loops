---
title: "Implementation Plan: Code READMEs (System-Deep-Loop Batch)"
description: "Author the fifty-three code READMEs with a six-agent Sonnet swarm, refresh the two stale runtime catalogs at reconcile, validate, and commit."
importance_tier: "normal"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/021-documentation-quality-program/007-code-readmes-deep-loop"
    last_updated_at: "2026-07-22T13:46:50Z"
    last_updated_by: "claude"
    recent_action: "Split the fifty-three folders into six batches and dispatched the authors."
    next_safe_action: "Reconcile, refresh the catalogs, validate."
    blockers: []
    key_files: []
---

# Implementation Plan: Code READMEs (System-Deep-Loop Batch)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documenting Node and shell deep-loop runtime folders |
| **Subsystem** | system-deep-loop runtime, modes and shared |
| **Testing** | `validate_document.py --type readme` floor plus an em-dash and semicolon sweep |
| **Branch** | `sk-doc/0097-documentation-quality` |

### Overview

Fan out six Sonnet authors: three own the thirty-five `runtime/lib` domains (twelve, twelve and eleven), one owns the four other runtime folders, one owns the eight deep-mode folders, and one owns the six shared folders. The orchestrator validates every file, then refreshes the two stale catalogs from the real folder listing before commit.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The fifty-three folders split into six disjoint batches
- [x] The `council` domain README confirmed as the batch model for the thirty-five domains
- [x] The two stale catalogs identified (`runtime/lib/README.md`, `runtime/tests/README.md`)

### Definition of Done
- [x] All fifty-three folders have a README that reports VALID
- [x] The two catalogs list every real subfolder and report VALID
- [x] Every CONTENTS table matches the real folder listing and the HVR sweep is clean

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

The shared brief and the `council` exemplar carry the shape once. Six authors own disjoint batches. The two catalog refreshes run at reconcile, after the domain READMEs exist, so each catalog row can borrow the domain README's own one-line description.

### Key Components
- The shared code-README brief and the `council` batch model.
- Six batch authors (three lib, one other-runtime, one deep-modes, one shared).
- The catalog-refresh step and the floor-plus-listing reconcile gate.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Split the fifty-three folders into six batches and confirm the two stale catalogs.
- [x] Reuse the shared brief and name the `council` model for the domain authors.

### Phase 2: Implementation
- [x] Dispatch six batch authors, each owning a disjoint folder set.

### Phase 3: Verification
- [x] Validate every new README with the floor validator.
- [x] Refresh the two catalogs from the real listing and re-validate them.
- [x] Cross-check CONTENTS tables and sweep for HVR, then commit.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | Every README clears the floor | `validate_document.py --type readme` |
| Accuracy | CONTENTS filenames exist and catalogs list real subfolders | `ls` cross-check |
| HVR | No em dashes or semicolons in the new prose | `grep` sweep |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 003 validator fix | Internal | Green | Authors cannot run the documented validator command |
| `runtime/lib/council/README.md` model | Internal | Green | No batch shape for the domains |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a domain README misstates its module, or a refreshed catalog lists a wrong subfolder.
- **Procedure**: `git checkout` the offending README or catalog. Each file is independent.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──▶ Implementation ──▶ Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 003 | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | None |

<!-- /ANCHOR:l2-phase-deps -->
---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 40 minutes |
| Implementation | Medium | parallel, six batch authors |
| Verification | Medium | 1 hour including the catalog refresh |
| **Total** | | **about 2 to 3 hours wall-clock** |

<!-- /ANCHOR:l2-effort -->
---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] The folders had no README before, so authoring adds files without overwriting
- [x] Each author owns a disjoint batch (no parallel-write conflicts)
- [x] Merge to v4 held behind the operator gate

### Rollback Procedure
1. `git checkout -- <the offending README or catalog>` to restore.
2. Re-run the floor validator on the remaining files to confirm baseline.

### Data Reversal
- **Has data migrations?** No. Markdown documentation only.

<!-- /ANCHOR:l2-rollback -->
