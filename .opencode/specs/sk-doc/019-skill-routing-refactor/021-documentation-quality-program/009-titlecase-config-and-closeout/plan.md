---
title: "Implementation Plan: Title-Case Enforcement, Config Flip, and Closeout"
description: "Refine the uppercase check, flip the config, apply a deterministic exempt-preserving header transform, verify no regression, and close the program."
importance_tier: "normal"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/021-documentation-quality-program/009-titlecase-config-and-closeout"
    last_updated_at: "2026-07-22T16:53:38Z"
    last_updated_by: "claude"
    recent_action: "Refined, flipped, transformed, verified, closed out."
    next_safe_action: "Operator ff-merge to v4."
    blockers: []
    key_files: []
---

# Implementation Plan: Title-Case Enforcement, Config Flip, and Closeout

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python (validator), JSON (config), Markdown (headers) |
| **Subsystem** | sk-doc shared validator + reference/asset docs fleet-wide |
| **Testing** | `validate_document.py --type reference|asset`; `audit_readmes.py` regression |
| **Branch** | `sk-doc/0097-documentation-quality` |

### Overview

Refine `is_uppercase_section` to enforce ALL-CAPS only on prose words, flip the config, then run a deterministic transform that uppercases the genuine offender headers while protecting code spans, signatures and annotations. Verify all reference/asset files pass and no README regresses, then close the program and record the deferred code findings.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The genuine offender set separated from the mixed-case false positives
- [x] The refined check verified against a sanity set of headers
- [x] The transform confirmed to preserve exempt parts on a dry run

### Definition of Done
- [x] All 667 reference/asset files pass with the flipped config
- [x] The README audit's invalid count did not rise
- [x] The three code findings are documented as deferred

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

The validator refinement is the enabler: without it, the flip rejects correct headers. The transform is deterministic and exempt-aware, so it never uppercases code or signatures. Closeout separates shipped from deferred so the program's boundary is legible.

### Key Components
- `is_uppercase_section` (refined) and `template-rules.json` (flipped).
- The exempt-preserving header transform.
- The deferred-findings record in `context-index.md`.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Refine `is_uppercase_section` and verify it against a sanity set.
- [x] Separate the genuine offenders from the mixed-case false positives.

### Phase 2: Implementation
- [x] Flip `h2UppercaseRequired` for reference and asset; apply the transform to the 270 headers.

### Phase 3: Verification
- [x] Validate all 667 reference/asset files pass; confirm no README audit regression.
- [x] Record the closeout and the three deferred code findings.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Refined check passes/fails the sanity set | in-process `is_uppercase_section` |
| Structure | All reference/asset files VALID | `validate_document.py` |
| Regression | READMEs do not regress | `audit_readmes.py` before/after |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Refined `is_uppercase_section` | Internal | Green | The flip rejects correct headers |
| `template-rules.json` | Internal | Green | No config to flip |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the flip rejects a legitimate header, or the transform uppercased something exempt.
- **Procedure**: `git revert` the config-and-headers commit; the validator refinement is independent and can stay.

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
| Setup | Medium | 1 hour (validator design) |
| Implementation | Low | deterministic transform |
| Verification | Low | 30 minutes |
| **Total** | | **about 2 hours** |

<!-- /ANCHOR:l2-effort -->
---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] The transform diff confirmed header-only
- [x] Reference/asset files re-validated after the flip
- [x] Merge to v4 held behind the operator gate

### Rollback Procedure
1. `git revert` the config-and-headers commit to restore prior headers and config.
2. Re-run the reference/asset validation to confirm baseline.

### Data Reversal
- **Has data migrations?** No. A validator refinement, a config flag, and header text.

<!-- /ANCHOR:l2-rollback -->
