---
title: "Implementation Plan: Symlink Retirement and Validation"
description: "Prove no-alias correctness, retire the specs alias, and run the full R1–R10 × L1–L4 validation matrix with fault injection."
trigger_phrases:
  - "symlink retirement plan"
  - "validation matrix plan"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: Symlink Retirement and Validation

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Vitest fixtures; CI matrix; Git |
| **Subsystems** | test harness; `specs` tracked symlink |
| **Testing** | R1–R10 × L1–L4 including fault injection |

### Overview
Terminal phase. Build and run the full fixture matrix across source, clean dist, the OS/no-symlink matrix, and migration/rollback fault injection; prove the no-alias cases; then formalize the already-applied alias removal. Captures a before/after strict-validate delta.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phases 001–004 landed
- [x] R1–R10 table (phase 001) available

### Definition of Done
- [ ] R1–R10 × L1–L4 green; skips carry reasons + counts
- [ ] Alias removal committed; zero re-materialization
- [ ] Before/after strict-validate delta captured

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A fixture factory that factors root mode from packet mode over temporary workspaces, driven across four lanes, never mutating the live checkout.

### Key Components
- **Fixture matrix** — R1–R10 root/packet states.
- **Lane harness** — L1 source, L2 clean dist, L3 OS matrix, L4 fault injection.
- **Alias retirement** — commit the tracked-symlink removal.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Build the fixture factory + lane harness

### Phase 2: Core Implementation
- [ ] Implement R1–R10 across L1/L2/L3/L4
- [ ] Prove no-alias/plain-file/dangling/misdirected cases

### Phase 3: Verification
- [ ] Full matrix green; commit alias removal; capture strict-validate delta

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Fixture matrix | R1–R10 root/packet states | Vitest + temp workspaces |
| OS matrix | Linux/macOS/Windows no-symlink | CI |
| Fault injection | Races, cross-device, freeze, post-S3 rollback refusal | Vitest |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 001–004 | Internal | Not started | Retirement unsafe |
| Cross-platform CI | Internal | Unknown | L3 mandatory rows cannot run |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a no-alias case fails or a plain `specs/` reappears.
- **Procedure**: restore the alias only as a non-universal convenience bridge (`ln -s .opencode/specs specs`), and roll back to the last passing behavior bundle; canonical data is preserved. Restoring the symlink is never a data rollback.

<!-- /ANCHOR:rollback -->
