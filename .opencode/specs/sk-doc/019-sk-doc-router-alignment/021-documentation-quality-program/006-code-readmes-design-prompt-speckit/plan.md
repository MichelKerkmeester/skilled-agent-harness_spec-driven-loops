---
title: "Implementation Plan: Code READMEs (Design, Prompt, Spec-Kit Batch)"
description: "Author the thirty-eight in-scope code READMEs with a parallel Sonnet swarm grouped by skill family, exclude the seed fixtures and the stale duplicate, then reconcile and commit."
importance_tier: "normal"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/021-documentation-quality-program/006-code-readmes-design-prompt-speckit"
    last_updated_at: "2026-07-22T13:27:47Z"
    last_updated_by: "claude"
    recent_action: "Filtered the exclusions and dispatched four family authors."
    next_safe_action: "Reconcile and validate the thirty-eight READMEs."
    blockers: []
    key_files: []
---

# Implementation Plan: Code READMEs (Design, Prompt, Spec-Kit Batch)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documenting Node, Python and shell folders |
| **Subsystem** | sk-design, sk-prompt benchmarks, system-spec-kit |
| **Testing** | `validate_document.py --type readme` floor plus an em-dash and semicolon sweep |
| **Branch** | `sk-doc/0097-documentation-quality` |

### Overview

Fan out one Sonnet author per family against the shared code-README brief, each owning a disjoint folder set. The scan's forty-five folders were filtered to thirty-eight: six benchmark seed folders and one stale duplicate are excluded with a recorded reason. The orchestrator validates every file and reconciles before commit.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The forty-five scanned folders filtered to thirty-eight with the exclusions recorded
- [x] The stale `design-mcp-open-design/__tests__` duplicate confirmed byte-identical to `tests/`
- [x] The shared code-README brief reused from phase 005

### Definition of Done
- [x] All thirty-eight in-scope folders have a README that reports VALID
- [x] Every CONTENTS table matches the real folder listing
- [x] The seed exclusions and the duplicate flag are recorded in `context-index.md`

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

The shared brief carries the template, exemplar and validator once. Four authors, grouped by family, each own a disjoint folder set. The scope filter runs before dispatch so no author touches a seed fixture or the stale duplicate.

### Key Components
- The shared code-README brief.
- The exclusion filter (`phase-006-author.txt` versus `phase-006-excluded.txt`).
- Four family authors and the floor-plus-listing reconcile gate.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm the `design-mcp-open-design` tests duplicate and filter the six seed folders out.
- [x] Enumerate the thirty-eight in-scope folders and reuse the shared brief.

### Phase 2: Implementation
- [x] Dispatch four family authors, each owning a disjoint folder set.

### Phase 3: Verification
- [x] Validate every new README with the floor validator.
- [x] Cross-check each CONTENTS table against the real folder listing and sweep for HVR.
- [x] Record the exclusions, then commit the phase.

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

- **Trigger**: a README misstates a folder, or a seed fixture was documented by mistake.
- **Procedure**: `git checkout` or delete the offending README. Each file is independent.

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
| Implementation | Medium | parallel, one author per family |
| Verification | Medium | 45 minutes |
| **Total** | | **about 2 hours wall-clock** |

<!-- /ANCHOR:l2-effort -->
---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] The folders had no README before, so authoring adds files without overwriting
- [x] The seed fixtures are excluded before dispatch, so no fixture is polluted
- [x] Merge to v4 held behind the operator gate

### Rollback Procedure
1. `git checkout -- <the offending README>` or delete it to restore the prior no-README state.
2. Re-run the floor validator on the remaining files to confirm baseline.

### Data Reversal
- **Has data migrations?** No. Markdown documentation only.

<!-- /ANCHOR:l2-rollback -->
