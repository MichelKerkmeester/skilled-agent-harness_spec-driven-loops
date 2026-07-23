---
title: "Implementation Plan: Deep-Review Remediation"
description: "Fix the confirmed in-scope P0 blockers from the deep-review FAIL verdict (NUL corruption, non-runnable commands), route the out-of-scope findings, and stage the validator hardening, verifying each against disk."
importance_tier: "high"
contextType: "implementation"
status: "in-progress"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/021-documentation-quality-program/011-review-remediation"
    last_updated_at: "2026-07-22T20:45:00Z"
    last_updated_by: "claude"
    recent_action: "Fixed the NUL corruption and the named non-runnable commands."
    next_safe_action: "Stage the validator hardening with a corpus baseline."
    blockers: []
    key_files: []
---

# Implementation Plan: Deep-Review Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, Python (validator), byte-level file repair |
| **Subsystem** | sk-doc authored READMEs, the doc validator, sk-design/sk-prompt reference docs |
| **Testing** | `validate_document.py`; `tr -dc '\000'` NUL scan; targeted command execution |
| **Branch** | `sk-doc/0097-documentation-quality` |

### Overview

Fix each confirmed blocker only after confirming it on disk. Restore the two NUL-corrupted headers from the merge-base code spans. Make the named non-runnable commands runnable from one documented directory. Route the findings that are not this program's regression (the style-catalog links, the import-policy test failures). Stage the validator hardening as a careful, baselined change because it gates every document.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The FAIL verdict's load-bearing findings verified against disk
- [x] Each finding classified as in-scope (021 regression) or routed (pre-existing)

### Definition of Done
- [x] Zero NUL bytes across every changed markdown file
- [x] The named non-runnable commands run from their documented directory
- [ ] The validator hardening lands with table-driven tests and a clean corpus re-run

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Verify-then-fix, scope-locked. Byte-precise repair for the corruption (original spans read from the merge-base blob, never retyped). Path normalization for the commands (one working directory, repo-root-relative). Out-of-scope findings are routed with evidence, not fixed on this branch.

### Key Components
- The two corrupted reference docs and their restored code spans.
- The create-skill and mcp-server/api README command blocks.
- `validate_document.py` `is_uppercase_section` (staged, not yet changed).

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Verify the FAIL findings on disk; classify in-scope vs routed.

### Phase 2: Implementation
- [x] Restore the two NUL-corrupted headers from the merge-base code spans.
- [x] Fix the create-skill and mcp-server/api non-runnable commands.
- [ ] Harden `is_uppercase_section` with a balanced-delimiter scanner and a true mixed-case gate (staged).

### Phase 3: Verification
- [x] NUL scan clean; the two restored files validate; the fixed commands run.
- [ ] Validator corpus baseline and regression re-run (staged with the validator change).

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Corruption | Every changed markdown file | `tr -dc '\000'` |
| Structure | The two restored reference docs | `validate_document.py --type reference` |
| Runnability | The fixed command blocks | direct execution |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Merge-base blob | Internal | Green | Byte-precise restore of the code spans |
| Validator corpus baseline | Internal | Pending | Needed before changing the gate |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a restored header is wrong, or a fixed command still fails.
- **Procedure**: `git checkout` the affected file; each fix is independent.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──▶ Implementation ──▶ Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Review verdict | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | None |

<!-- /ANCHOR:l2-phase-deps -->
---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | disk verification |
| Implementation | Medium | byte repair + path fixes + staged validator |
| Verification | Low | scans + validation |
| **Total** | | **about 2 hours (validator staged)** |

<!-- /ANCHOR:l2-effort -->
---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Each fix is an independent revertible edit
- [x] Restored spans read from the merge-base blob
- [x] Merge to v4 held behind the operator gate

### Rollback Procedure
1. `git checkout` the affected file.
2. Re-run the NUL scan and `validate_document.py`.

### Data Reversal
- **Has data migrations?** No. Header bytes, command text, and staged validator logic.

<!-- /ANCHOR:l2-rollback -->
