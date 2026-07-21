---
title: "Tasks: Locks & Fencing"
description: "Tasks for the phase-007 shared locks-and-fencing service: inventory protected resources, implement durable fenced leases and guarded writes, adapt shipped writers, and verify stale-writer rejection."
trigger_phrases:
  - "locks and fencing tasks"
  - "deep-loop fencing token tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/006-locks-and-fencing"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/006-locks-and-fencing"
    last_updated_at: "2026-07-21T01:38:43Z"
    last_updated_by: "codex"
    recent_action: "Hardened grant CAS and commit fencing with independent-process adversarial tests"
    next_safe_action: "Consume the additive adapters from later dark-path integration work"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/locks-and-fencing.vitest.ts"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Locks & Fencing

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Pin the candidate baseline (`d1a3f0323c3635f24c3560feaeda839522ececf0`) and inventory protected shipped writers in the frozen manifest [evidence: `protected-resource-registry.ts` exports the frozen manifest against the recorded baseline]
- [x] T002 Freeze canonical resource-key rules, the single-host filesystem domain, lock ordering, bounded timeouts/renewal, and unsupported topology behavior [evidence: focused Vitest `locks-and-fencing.vitest.ts` passed 28/28]
- [x] T003 Consume the existing authorized append/head/receipt interfaces and accept an opaque continuity identity plus verified replay identity [evidence: `fenced-ledger-writer.ts`, `fenced-state-store.ts`, and `replay-identity.ts` compile under tsc]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Implement lease/fence types, typed errors, canonical resource encoding, and durable per-resource token allocation [evidence: `locks-and-fencing-types.ts`, `locks-and-fencing-errors.ts`, and `protected-resource-registry.ts` pass tsc]
- [x] T005 Implement atomic acquire, renew, release, expiry, takeover, owner validation, and never-reuse persistence [evidence: focused Vitest atomic hard-link grant, independent-process, release/takeover, and partial-record cases passed]
- [x] T006 Implement ledger append enforcement that holds the current fence while the authorized ledger atomically checks its expected head [evidence: focused Vitest passed current-head contention with one commit and one `HEAD_CONFLICT`]
- [x] T007 Implement projection and per-lineage/checkpoint enforcement that validates fence plus state version/identity inside one mutex [evidence: focused Vitest passed stale-state and CAS coverage across protected resource kinds]
- [x] T008 Implement the shared legacy/dark shadow-adapter seam with one write epoch, exact legacy return identity, and observable dark failure [evidence: focused Vitest adapter case passed; no existing writer consumes the seam]
- [x] T009 Map every named shipped path to an additive direct replacement seam while leaving the legacy files untouched until authority cutover [evidence: `PROTECTED_WRITE_SURFACE_MANIFEST` is frozen and path-scoped git diff reports no legacy writer edits]
- [x] T010 Enforce one-resource preference, canonical multi-resource order, bounded jittered waits, renewal loss, nonce-safe mutex release, and no force unlock [evidence: focused Vitest passed ordering, re-entry, timeout, and lease-loss cases]
- [x] T011 Prepare, authorize, append, read, and reduce redacted typed lifecycle records through the existing gateway and ledger [evidence: focused Vitest passed the typed lifecycle gateway, verified-read, and reducer contract]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Verify: The manifest and resource matrix cover ledger, projection, fan-out, recovery, checkpoint, council, pause/resume, and lineage surfaces [evidence: focused Vitest manifest/resource-matrix test passed]
- [x] T013 Verify: Contention, release, expiry, crash recovery, restart, restore advance, and rollback attempts never reuse or decrease a token [evidence: focused Vitest monotonicity and recovery cases passed 28/28 overall]
- [x] T014 Verify: A stale live/resumed holder cannot mutate the additive ledger, projection, lineage, status, merge, checkpoint, council, or pause/resume replacement stores [evidence: focused Vitest stale resource-matrix and paused-commit cases passed; existing writer integration is not claimed]
- [x] T015 Verify: The shadow adapter holds one epoch, returns the exact legacy value, and contains dark failure without moving authority [evidence: focused Vitest shadow-adapter contract passed]
- [x] T016 Verify: Distinct lineages overlap while duplicate same-lineage workers and resumed processes admit only the current token [evidence: focused Vitest lineage overlap plus two-independent-process same-resource exclusion cases passed]
- [x] T017 Verify: Inversion, re-entry, contention, partial mutex/state, expected-head conflict, clock rewind, owner reuse, overflow, and unsupported topology fail closed [evidence: focused Vitest fail-closed matrix passed]
- [x] T018 Verify: The focused leaf suite passes 28/28; the full runtime suite remains owned by the later integration gate [evidence: requested Vitest invocation exited 0 with 1 file and 28/28 tests passed]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete
- [x] All requirements in spec.md met within the approved additive-dark boundary, with legacy authority unchanged
- [x] Phase gate green (focused Vitest 28/28, TypeScript exit 0, strict validation recorded in `implementation-summary.md`)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
