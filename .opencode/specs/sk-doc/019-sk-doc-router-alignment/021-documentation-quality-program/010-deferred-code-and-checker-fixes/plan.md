---
title: "Implementation Plan: Deferred Code and Checker Fixes"
description: "Fix the 10a checker path and data gaps, flip skill/command Title-Case, and record the not-fixed decisions, verifying each with the doctor checker and the document validator."
importance_tier: "normal"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/021-documentation-quality-program/010-deferred-code-and-checker-fixes"
    last_updated_at: "2026-07-22T16:53:38Z"
    last_updated_by: "claude"
    recent_action: "Applied and verified the deferred fixes."
    next_safe_action: "Operator ff-merge to v4."
    blockers: []
    key_files: []
---

# Implementation Plan: Deferred Code and Checker Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node (checker), JSON (registry/manifest), Python (validator), Markdown |
| **Subsystem** | doctor parent-skill-check, leaf-manifest hubs, sk-doc validator config |
| **Testing** | `parent-skill-check.cjs` per hub; `validate_document.py --type skill|command` |
| **Branch** | `sk-doc/0097-documentation-quality` |

### Overview

Investigate each deferred item on disk before acting. Fix the 10a path resolution and the sk-code and mcp-tooling data gaps it surfaces. Scan skill and command headers, uppercase the two offenders, and flip the config. Record the benchmark and HVR decisions with their evidence.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The 10a failure reproduced across the non-sk-doc hubs
- [x] The skill/command offender count scanned (2 SKILL.md, 0 command)
- [x] The benchmark and HVR items investigated on disk

### Definition of Done
- [x] All seven hubs pass 10a/10b/10d
- [x] All SKILL.md and command files pass the flip
- [x] The not-fixed decisions are recorded

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Investigate-then-act: no edit lands before an on-disk check confirms the defect and the correct target. Shared tooling resolves from one canonical location. Not-fixing is a recorded decision backed by evidence.

### Key Components
- The 10a path resolution in `parent-skill-check.cjs`.
- The sk-code registry field and the mcp-tooling manifest regeneration.
- The skill/command config flip and the header transform.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Reproduce the 10a failure and locate the hardcoded per-hub generator path.
- [x] Scan skill and command headers; investigate the benchmark and HVR items.

### Phase 2: Implementation
- [x] Fix the 10a path, add the sk-code registry field, regenerate the mcp-tooling manifest.
- [x] Flip skill and command config and uppercase the two SKILL.md offenders.

### Phase 3: Verification
- [x] Confirm 10a/10b/10d pass on all seven hubs and all SKILL.md/command files pass.
- [x] Record the benchmark and HVR not-fixed decisions.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Checker | 10a/10b/10d across hubs | `parent-skill-check.cjs` |
| Structure | SKILL.md and command headers | `validate_document.py` |
| Syntax | Checker compiles | `node --check` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Refined `is_uppercase_section` | Internal | Green | The skill/command flip rejects correct headers |
| Shared leaf-manifest generator | Internal | Green | 10a cannot regenerate |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a hub regresses on 10b, or a SKILL.md header was mangled.
- **Procedure**: `git revert` the relevant commit; each fix is an independent commit.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──▶ Implementation ──▶ Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 009 | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | None |

<!-- /ANCHOR:l2-phase-deps -->
---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | investigation-heavy |
| Implementation | Low | targeted edits |
| Verification | Low | per-hub checker runs |
| **Total** | | **about 1.5 hours** |

<!-- /ANCHOR:l2-effort -->
---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Each fix is an independent revertible commit
- [x] 10b confirms the mcp-tooling regeneration is byte-correct
- [x] Merge to v4 held behind the operator gate

### Rollback Procedure
1. `git revert` the offending commit.
2. Re-run `parent-skill-check.cjs` on the affected hub to confirm baseline.

### Data Reversal
- **Has data migrations?** No. A checker path, two data files, a config flag, and header text.

<!-- /ANCHOR:l2-rollback -->
