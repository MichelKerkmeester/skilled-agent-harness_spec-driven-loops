---
title: "Implementation Plan: Code READMEs (Infra and SK Batch)"
description: "Author the thirty-three code READMEs with a parallel Sonnet swarm grouped by skill family, validate each with the floor validator, then reconcile and commit as one phase."
importance_tier: "normal"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/021-documentation-quality-program/005-code-readmes-infra-and-sk"
    last_updated_at: "2026-07-22T13:27:47Z"
    last_updated_by: "claude"
    recent_action: "Wrote the code-README brief and dispatched five family authors."
    next_safe_action: "Reconcile and validate the thirty-three READMEs."
    blockers: []
    key_files: []
---

# Implementation Plan: Code READMEs (Infra and SK Batch)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (code-folder READMEs) documenting Python, Node and shell folders |
| **Subsystem** | sk-doc, sk-code, and four infra hubs |
| **Testing** | `validate_document.py --type readme` floor plus an em-dash and semicolon sweep |
| **Branch** | `sk-doc/0097-documentation-quality` |

### Overview

Fan out one Sonnet author per skill family against a shared code-README brief. Each author owns a disjoint set of folders, opens the real files, and writes a lean per-folder README. The orchestrator validates every file independently and reconciles before the phase commits.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The code-folder README template and the council lean exemplar named in the brief
- [x] The thirty-three folders enumerated from the repo-wide scan
- [x] The floor validator confirmed to accept a code README with `--type readme`

### Definition of Done
- [x] All thirty-three folders have a README that reports VALID
- [x] Every CONTENTS table matches the real folder listing
- [x] Em-dash and semicolon sweep clean on the new files

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

The shared brief holds the template, the exemplar and the validator once. Five authors, grouped by family, each own a disjoint folder set so writes never collide. Reconciliation validates, it does not re-author.

### Key Components
- The shared code-README brief.
- Five family authors (sk-doc, sk-code, system-code-graph, advisor plus code-mode, tooling plus cli).
- The floor validator plus a folder-listing cross-check as the reconcile gate.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the code-README template, the council exemplar, and confirm the validator type.
- [x] Enumerate the thirty-three folders and write the shared brief.

### Phase 2: Implementation
- [x] Dispatch five family authors, each owning a disjoint folder set.

### Phase 3: Verification
- [x] Validate every new README with the floor validator.
- [x] Cross-check each CONTENTS table against the real folder listing and sweep for HVR.
- [x] Fix any file that misses the bar, then commit the phase.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | Every README clears the floor | `validate_document.py --type readme` |
| Accuracy | CONTENTS filenames exist | `ls` cross-check per folder |
| HVR | No em dashes or semicolons in the new prose | `grep` sweep |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 003 validator fix | Internal | Green | Authors cannot run the documented validator command |
| readme-code-template.md | Internal | Green | No section model to author against |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a README misstates what a folder owns.
- **Procedure**: `git checkout` removes the offending README on the worktree branch. Each file is independent, so one bad file reverts alone.

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
| Setup | Low | 30 minutes |
| Implementation | Medium | parallel, one author per family |
| Verification | Medium | 45 minutes |
| **Total** | | **about 2 hours wall-clock** |

<!-- /ANCHOR:l2-effort -->
---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] The folders had no README before, so authoring adds files without overwriting
- [x] Each author owns a disjoint folder set (no parallel-write conflicts)
- [x] Merge to v4 held behind the operator gate

### Rollback Procedure
1. `git checkout -- <the offending README>` or delete it to restore the prior no-README state.
2. Re-run the floor validator on the remaining files to confirm baseline.

### Data Reversal
- **Has data migrations?** No. Markdown documentation only.

<!-- /ANCHOR:l2-rollback -->
