---
title: "Implementation Plan: JSON Cleanup and Advisor-Metadata Conventions"
description: "Codify the advisor-metadata placement rule (doctrine + recursive checker rule 2b + AGENTS.md), then remove the one dead residue so the checker verifies the removal."
importance_tier: "normal"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/021-documentation-quality-program/001-json-cleanup-and-conventions"
    last_updated_at: "2026-07-22T08:59:26Z"
    last_updated_by: "claude"
    recent_action: "Shipped all four changes and verified rule 2b."
    next_safe_action: "Proceed to phase 002."
    blockers: []
    key_files: []
---

# Implementation Plan: JSON Cleanup and Advisor-Metadata Conventions

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS checker), Markdown doctrine + AGENTS.md |
| **Subsystem** | Parent-hub conformance checker + skill-authoring doctrine |
| **Testing** | Run `parent-skill-check.cjs` before/after removal; `node --check` |
| **Branch** | `sk-doc/0097-documentation-quality` |

### Overview

Harden first so the removal is self-verifying: add the doctrine sentence, the recursive checker rule, and the AGENTS.md convention; then delete the residue and confirm the checker flips from FAIL to PASS on rule 2b.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Residue confirmed dead (grep-proven, no consumer)
- [x] Existing rule 2a identified as the pattern to mirror
- [x] Placement rule locations identified (doctrine, checker, AGENTS.md)

### Definition of Done
- [x] Rule 2b FAILs before removal, PASSes after
- [x] Checker passes `node --check`
- [x] Doctrine + AGENTS.md carry the rule
- [x] Checklist verified with evidence

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

The checker recurses a hub tree collecting a filename, then fails on any hit below the hub root. Rule 2a does this for `graph-metadata.json`; rule 2b adds the identical treatment for `description.json` via a parallel `findDescriptionJson` collector.

### Key Components
- `findDescriptionJson(dir)` — recursive collector, sibling to `findGraphMetadata`.
- Rule 2b — fails on any nested `description.json`, excluding the hub root's own.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm the residue is dead and rule 2a is the pattern.

### Phase 2: Implementation
- [x] Add the doctrine sentence to `parent-skills-nested-packets.md`.
- [x] Add `findDescriptionJson` + rule 2b to `parent-skill-check.cjs`.
- [x] Add the disambiguation + placement rule to `AGENTS.md`.
- [x] Delete `sk-prompt/prompt-models/description.json`.

### Phase 3: Verification
- [x] Rule 2b FAIL-before then PASS-after; `node --check`; repo-wide nested-`description.json` scan clean.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Regression | Rule 2b FAIL-before / PASS-after | `parent-skill-check.cjs` |
| Syntax | Modified checker parses | `node --check` |
| Invariant | No other nested `description.json` in a checked hub | `find` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| JSON audit grep proof | Internal | Green | Removal safety unproven |
| Existing rule 2a | Internal | Green | No pattern to mirror |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a runtime consumer of the deleted file surfaces, or rule 2b false-positives on a checked hub.
- **Procedure**: `git checkout` restores the deleted file and `git revert` the checker/doctrine/AGENTS.md changes on the worktree branch. No runtime state involved.

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
| Verification | Low | 15 minutes |
| **Total** | | **under 1 hour** |

<!-- /ANCHOR:l2-effort -->
---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline captured (rule 2b FAIL state confirmed before removal)
- [x] Deleted file recoverable via git
- [x] Merge to v4 held behind the operator gate

### Rollback Procedure
1. `git checkout -- .opencode/skills/sk-prompt/prompt-models/description.json` to restore.
2. `git revert` the doctrine/checker/AGENTS.md commit.
3. Re-run `parent-skill-check.cjs` to confirm baseline.

### Data Reversal
- **Has data migrations?** No. Documentation and a diagnostic checker only.

<!-- /ANCHOR:l2-rollback -->
