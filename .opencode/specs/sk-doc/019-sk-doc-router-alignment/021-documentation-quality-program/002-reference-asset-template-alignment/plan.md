---
title: "Implementation Plan: Reference and Asset Template Alignment"
description: "Rename the 15 Title-Case headers to ALL-CAPS in the two reference files, restructure the asset file to the standard, and verify all three VALID."
importance_tier: "normal"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/021-documentation-quality-program/002-reference-asset-template-alignment"
    last_updated_at: "2026-07-22T09:49:23Z"
    last_updated_by: "claude"
    recent_action: "Applied all header renames and the asset restructure; verified VALID."
    next_safe_action: "Proceed to phase 003."
    blockers: []
    key_files: []
---

# Implementation Plan: Reference and Asset Template Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (sk-doc reference/asset templates) |
| **Subsystem** | create-skill reference/asset library |
| **Testing** | `validate_document.py --type reference|asset` |
| **Branch** | `sk-doc/0097-documentation-quality` |

### Overview

Apply exact header renames to the two reference files, rewrite the asset file to the standard structure and HVR, then confirm all three report VALID with zero issues.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Exact per-file fix spec extracted by the template audit
- [x] Conformant sibling `parent-skill-hub-template.md` identified as the model

### Definition of Done
- [x] 15 reference headers ALL-CAPS
- [x] Asset file restructured and HVR-clean
- [x] All three VALID (0 issues)

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

The reference/asset standard is a numbered ALL-CAPS H2 section model over a five-field frontmatter. The reference files needed only header casing; the asset file needed frontmatter, an OVERVIEW, and section numbering to match.

### Key Components
- Exact string-replacement renames for the 15 reference headers.
- A full rewrite of the asset file against the model sibling.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm the current headers and the asset file's structure.

### Phase 2: Implementation
- [x] Rename 7 headers in `compiled-routing-architecture.md`.
- [x] Rename 8 headers in `parent-skills-nested-packets.md`.
- [x] Rewrite `parent-skill-smart-routing-template.md` to the standard.

### Phase 3: Verification
- [x] `validate_document.py` VALID for all three; grep confirms ALL-CAPS.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Header casing, section model, frontmatter | `validate_document.py` |
| Regression | Asset file passes (was INVALID) | `validate_document.py --type asset` |
| Invariant | Reference content unchanged apart from casing | `grep` diff |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Template audit fix spec | Internal | Green | No exact renames |
| `parent-skill-hub-template.md` model | Internal | Green | No asset structure model |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a rename corrupts a header or the asset restructure loses content.
- **Procedure**: `git checkout` restores the three files on the worktree branch. No runtime state.

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
| Implementation | Low | 30 minutes |
| Verification | Low | 10 minutes |
| **Total** | | **under 1 hour** |

<!-- /ANCHOR:l2-effort -->
---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline captured (validator results before the fix)
- [x] Files recoverable via git
- [x] Merge to v4 held behind the operator gate

### Rollback Procedure
1. `git checkout -- <the three files>` to restore.
2. Re-run `validate_document.py` to confirm baseline.

### Data Reversal
- **Has data migrations?** No. Documentation files only.

<!-- /ANCHOR:l2-rollback -->
