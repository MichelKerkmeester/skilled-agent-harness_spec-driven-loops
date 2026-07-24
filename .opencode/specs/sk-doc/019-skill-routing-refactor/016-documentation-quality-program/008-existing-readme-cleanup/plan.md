---
title: "Implementation Plan: Existing-README Cleanup"
description: "Triage the audit to a verified real-work list, dispatch a six-agent Sonnet swarm to surgically repair genuine READMEs, then reconcile by re-running the audit."
importance_tier: "normal"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/021-documentation-quality-program/008-existing-readme-cleanup"
    last_updated_at: "2026-07-22T16:00:57Z"
    last_updated_by: "claude"
    recent_action: "Triaged, dispatched the swarm, reconciled by re-audit."
    next_safe_action: "Proceed to phase 009."
    blockers: []
    key_files: []
---

# Implementation Plan: Existing-README Cleanup

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (older skill/code READMEs) |
| **Subsystem** | Fleet-wide skill and code READMEs |
| **Testing** | `audit_readmes.py` deltas plus `validate_document.py --type readme` |
| **Branch** | `sk-doc/0097-documentation-quality` |

### Overview

Run `audit_readmes.py`, then triage its raw findings to a verified real-work list by resolving each reference against multiple roots and excluding spec-folder, archive and fixture files. Split the genuine targets by skill family and dispatch a Sonnet swarm to repair them surgically. Reconcile by re-running the audit and confirming the counts dropped.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The audit run and its false-positive classes understood
- [x] The genuine target set filtered from the raw findings
- [x] The surgical cleanup brief written with the "locate, never guess" rule

### Definition of Done
- [x] Audit template-invalid and broken-ref counts dropped
- [x] Every touched README floor-VALID with fixed links resolving on disk
- [x] No agent-introduced HVR violations

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Triage is the gate: the raw audit output is never handed to a swarm. A per-reference multi-root resolver plus a spec/archive/fixture exclusion filter produces the real-work list. Six family agents repair their disjoint batches; each verifies fixes on disk. Reconciliation re-runs the audit rather than assuming every flagged ref was fixed.

### Key Components
- The audit triage and exclusion filter.
- The per-batch work-lists (each README plus its exact issues).
- Six Sonnet family agents and the re-audit reconcile gate.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Run the audit, classify its false-positive patterns, and build the verified real-work list.
- [x] Exclude spec-folder, archive and fixture files; split the 100 genuine targets into six batches.

### Phase 2: Implementation
- [x] Dispatch six Sonnet family agents to repair broken refs and add OVERVIEW surgically.

### Phase 3: Verification
- [x] Re-run the audit and confirm the invalid and broken-ref counts dropped.
- [x] Independently floor-validate the targets and confirm em dashes are pre-existing, not agent-added.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Regression | Audit counts drop | `audit_readmes.py` before/after |
| Structure | Touched files VALID | `validate_document.py --type readme` |
| Provenance | Em dashes not agent-added | `git diff` on added lines |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `audit_readmes.py` | Internal | Green | No finding source to triage |
| Phase 003 validator fix | Internal | Green | Agents cannot run the documented validator |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a repaired link points at the wrong target, or a fabricated path slipped through.
- **Procedure**: `git checkout` the offending README. Each file is independent; the `__tests__` deletion is restorable from the byte-identical `tests/` sibling.

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
| Setup | Medium | 1 hour (triage is the hard part) |
| Implementation | Medium | parallel, six family agents |
| Verification | Medium | 45 minutes including the re-audit |
| **Total** | | **about 3 hours wall-clock** |

<!-- /ANCHOR:l2-effort -->
---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Every fix verified on disk before commit
- [x] The `__tests__` deletion is restorable from the identical `tests/` sibling
- [x] Merge to v4 held behind the operator gate

### Rollback Procedure
1. `git checkout -- <the offending README>` to restore.
2. Re-run the audit to confirm baseline.

### Data Reversal
- **Has data migrations?** No. Markdown edits and one duplicate-folder deletion.

<!-- /ANCHOR:l2-rollback -->
