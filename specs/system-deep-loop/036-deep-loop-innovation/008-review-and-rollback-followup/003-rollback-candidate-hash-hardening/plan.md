---
title: "Implementation Plan: Rollback Candidate Hash Hardening"
description: "Technical plan for enforcing promoted-candidate-only rollback authority. All 3 phases landed and verified in commit c4fc339e83."
trigger_phrases:
  - "rollback candidate hash hardening plan"
  - "assertRollbackHashGuard plan"
  - "promoted-candidate-only rollback plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/008-review-and-rollback-followup/003-rollback-candidate-hash-hardening"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "markdown-agent"
    recent_action: "Documented the 3-phase plan against commit c4fc339e83's actual diff"
    next_safe_action: "None; packet complete, no follow-up required"
    blockers: []
    key_files:
      - "plan.md"
      - "spec.md"
      - "tasks.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Rollback Candidate Hash Hardening

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS) + TypeScript |
| **Runtime surface** | `system-deep-loop` deep-improvement, `rollback-candidate.cjs` shared script |
| **Storage** | N/A (file-hash comparison against the canonical target file, no persistence change) |
| **Testing** | vitest (per-file, hermetic), config `deep-improvement/scripts/vitest.config.mjs` |

### Overview

A single-function hardening fix: `assertRollbackHashGuard` previously accepted a current target matching either the pre-acceptance hash or the accepted-candidate hash. The fix removes the dual-hash acceptance path (`expectedRollbackSourceHashes` helper deleted) and requires the current target hash to equal `acceptedState.candidateHash` exclusively.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem confirmed against current source: `assertRollbackHashGuard` read and the dual-hash acceptance path identified
- [x] Fix scope documented in `spec.md` (single function, two test files)
- [x] Success criteria measurable (SC-001, SC-002)

### Definition of Done

- [x] REQ-001 implemented (commit `c4fc339e83`)
- [x] REQ-002 negative test added and passing (commit `c4fc339e83`)
- [x] REQ-003 benchmark test case updated (commit `c4fc339e83`)
- [x] REQ-004 per-file vitest green, re-verified during this documentation pass: 15/15 passed

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Single-guard-function hardening — `assertRollbackHashGuard` is the sole authority check gating `rollback-candidate.cjs`'s restore operation; narrowing its accepted-hash set is the entire fix.

### Key Components

- **`assertRollbackHashGuard`** (`rollback-candidate.cjs`) — compares the canonical target's current sha256 hash against the accepted state; now requires an exact match to `acceptedState.candidateHash`.
- **`expectedRollbackSourceHashes`** — deleted; this helper previously built the two-hash acceptance list (`preAcceptTargetHash`, `candidateHash`) that made the guard too permissive.
- **`rollback-candidate-hash-guard.vitest.ts`** — hermetic unit tests for the guard; gained a new negative test for the pre-acceptance-hash rejection.
- **`promote-candidate-benchmark.vitest.ts`** — end-to-end benchmark coverage; its pre-ship-rollback case now expects rejection.

### Data Flow

1. A promoted candidate's acceptance file records `candidateHash` (and, historically, `preAcceptTargetHash`).
2. `rollback-candidate.cjs` computes the canonical target's current sha256 hash via `sha256File(target)`.
3. `assertRollbackHashGuard` compares the current hash against `acceptedState.candidateHash` exclusively; any other value (including a stale pre-acceptance hash) fails with "unexpected canonical target state; expected accepted candidate".
4. Rollback proceeds only when the canonical target already equals the promoted candidate's own hash.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Guard hardening

- [x] Delete `expectedRollbackSourceHashes` and its two-hash acceptance list (`rollback-candidate.cjs`, commit `c4fc339e83`)
- [x] Require `currentTargetHash === acceptedState.candidateHash` exclusively in `assertRollbackHashGuard` (commit `c4fc339e83`)

### Phase 2: Test updates

- [x] Update the benchmark's pre-ship-rollback case to expect status 1 and the "unexpected canonical target state" stderr message (`promote-candidate-benchmark.vitest.ts`, commit `c4fc339e83`)
- [x] Add a negative test proving a receipt-valid pre-acceptance target is rejected (`rollback-candidate-hash-guard.vitest.ts`, commit `c4fc339e83`)

### Phase 3: Verification

- [x] Run per-file vitest for both touched test files — re-verified during this documentation pass: `Test Files 2 passed (2)`, `Tests 15 passed (15)`

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit (negative control) | Pre-acceptance hash rejected as a valid rollback source | vitest (`rollback-candidate-hash-guard.vitest.ts`) |
| Integration | Full promote-then-rollback benchmark flow | vitest (`promote-candidate-benchmark.vitest.ts`) |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| `rollback-candidate.cjs` | Internal | Modified, landed in commit `c4fc339e83` | REQ-001 cannot land |
| `deep-improvement/scripts/vitest.config.mjs` | Internal | Present, used to run the two touched test files | REQ-004 cannot be verified |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A legitimate caller needs pre-ship rollback and the removal breaks its workflow.
- **Procedure**:
  1. Revert `rollback-candidate.cjs` and both touched test files to their pre-`c4fc339e83` state.
  2. Rollback returns to accepting either the pre-acceptance or promoted-candidate hash until a corrected, scoped fix lands.

<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
