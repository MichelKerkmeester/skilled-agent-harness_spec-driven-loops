---
title: "Implementation Plan: Doc-Tooling and Template Fixes"
description: "Resolve the validator symlink path at its four load sites, then add the two skill-readme-template clarifications and bump its version."
importance_tier: "normal"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/021-documentation-quality-program/003-doc-tooling-and-template-fixes"
    last_updated_at: "2026-07-22T12:50:05Z"
    last_updated_by: "claude"
    recent_action: "Applied the path fix and template clarifications; verified."
    next_safe_action: "Proceed to phase 004."
    blockers: []
    key_files: []
---

# Implementation Plan: Doc-Tooling and Template Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python (validator), Markdown (template) |
| **Subsystem** | sk-doc shared validator + create-skill README template |
| **Testing** | Symlink and real-path invocation; `py_compile`; grep |
| **Branch** | `sk-doc/0097-documentation-quality` |

### Overview

Add `.resolve()` at the four non-resolved `Path(__file__)` load sites so the rules file resolves regardless of invocation path, then add the two template clarifications and bump the version.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The four buggy load sites identified by grep
- [x] The two already-resolved sites confirmed safe from the replacement

### Definition of Done
- [x] Symlink invocation works; real path still works
- [x] No `resolve().resolve()`; `py_compile` passes
- [x] Template carries both clarifications and a version bump

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

`load_template_rules(script_dir)` resolves `script_dir.parent / "assets" / "template-rules.json"`. When `script_dir` derives from a non-resolved `__file__`, a symlink invocation points at the wrong parent. Resolving `__file__` first fixes every caller at once.

### Key Components
- The four `Path(__file__)` load sites (188, 665, 1001, 1086).
- The template WRITING RULES and VALIDATION CHECKLIST sections.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Reproduce the symlink error and locate the four load sites.

### Phase 2: Implementation
- [x] Replace `Path(__file__).parent` with `Path(__file__).resolve().parent` at the four sites.
- [x] Add the analogy note and the floor caveat to the template; bump the version.

### Phase 3: Verification
- [x] Symlink and real-path invocations both report VALID; `py_compile` passes; no double-resolve.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Regression | Symlink invocation validates instead of erroring | `validate_document.py` via the symlink |
| Regression | Real-path invocation unchanged | `validate_document.py` via `shared/scripts/` |
| Syntax | Validator compiles | `python3 -m py_compile` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Template audit finding | Internal | Green | No exact load-site list |
| `shared/assets/template-rules.json` | Internal | Green | Validator cannot load rules |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the validator misbehaves after the change.
- **Procedure**: `git checkout` restores the validator and template on the worktree branch. No runtime state.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──▶ Implementation ──▶ Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | None |

<!-- /ANCHOR:l2-phase-deps -->
---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 10 minutes |
| Implementation | Low | 20 minutes |
| Verification | Low | 10 minutes |
| **Total** | | **under 1 hour** |

<!-- /ANCHOR:l2-effort -->
---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline captured (the symlink error reproduced before the fix)
- [x] Files recoverable via git
- [x] Merge to v4 held behind the operator gate

### Rollback Procedure
1. `git checkout -- <the validator and template>` to restore.
2. Re-run the two invocations to confirm baseline.

### Data Reversal
- **Has data migrations?** No. A Python path fix and two template bullets.

<!-- /ANCHOR:l2-rollback -->
