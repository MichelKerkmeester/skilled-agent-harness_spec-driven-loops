---
title: "Implementation Summary: spec-memory vitest stabilization [template:level_1/implementation-summary.md]"
description: "SCAFFOLD-ONLY. Execution deferred until operator opts in."
trigger_phrases:
  - "008 vitest summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/005-cross-cutting-quality/008-spec-memory-vitest-stabilization"
    last_updated_at: "2026-05-21T13:50:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffold authored; execution deferred"
    next_safe_action: "Block until operator commits to execution"
    blockers:
      - "Operator opt-in"
    completion_state: "scaffold-only"
---
# Implementation Summary: spec-memory vitest stabilization

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

> **Status: SCAFFOLD ONLY.** Execution deferred. The 168 pre-existing vitest failures across 33 files are inventoried here; remediation work hasn't started.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Scaffold only (execution deferred) |
| **Created** | 2026-05-21 |
| **Branch** | `main` |
| **Parent Arc** | `005-cross-cutting-quality` |
| **Position in arc** | Phase 008 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet — this is the scaffold. When executed, this section will list:

- Fixes to `.opencode/skills/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts` (cluster 1 — mock exports)
- Fixes to `tests/profile-db-filename.vitest.ts` + `tests/local-llm-*.vitest.ts` (cluster 5 — flag/config)
- Fixes to `tests/launcher-lease.vitest.ts` (cluster 3 — lease timeouts)
- Fixes or quarantines to `tests/runtime-routing.vitest.ts` (cluster 2 — MCP connection)
- Fixes or quarantines to ~127 assertion-drift tests across many files (cluster 4)
- Updated `npm run build` or CI hook to gate on vitest exit code (P1)
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

(to fill during execution; planned 5-phase order is Cluster 1 → 5 → 3 → 2 → 4)
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

### D-001 (scaffolded): Execution deferred until operator opts in
**Rationale:** 168 failures × multi-cause = multi-day work. Production code is not broken (focused vitests + pytest run green). No current ship depends on these tests passing.

### D-002 (scaffolded): Tests-only scope, no production code edits
**Rationale:** The failures are in test fixtures, mocks, and lifecycle helpers. Production-code regression risk should be zero.

### D-003 (scaffolded): PARTIAL acceptable for Cluster 4
**Rationale:** 127 failures may have 50+ distinct root causes. Sample-then-decide is more efficient than fixing each individually. Quarantined tests with explicit `.skip` reasons are valid closeout for cluster 4.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

(to fill during execution)

Planned baseline + delta commands:

```bash
# Baseline (2026-05-21):
#   168 failures across 33 test files
cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/ 2>&1 | tail -5

# After Phase A (cluster 1):
npx vitest run tests/stage1-expansion.vitest.ts
# Expect: 13/13 pass

# After Phase B (cluster 5):
npx vitest run tests/profile-db-filename.vitest.ts tests/local-llm-*.vitest.ts
# Expect: 4/4 pass

# After Phase C (cluster 3) — 3 consecutive runs:
for i in 1 2 3; do npx vitest run tests/launcher-lease.vitest.ts; done
# Expect: 7/7 pass each run

# After Phase D (cluster 2):
npx vitest run tests/runtime-routing.vitest.ts
# Expect: 25/25 pass OR 25 .skip with reason comments

# After Phase E (cluster 4):
npx vitest run tests/
# Expect: exit 0 OR explicit .skip reasons for remaining failures

# Strict-validate
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/.../005-cross-cutting-quality/008-spec-memory-vitest-stabilization --strict
# Expect: exit 0
```
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No production code changes.** If a failure cluster turns out to reflect a real production bug, that fix is out-of-scope for this packet (a sibling packet should track the production fix).
2. **Cluster 4 may be partial.** 127 failures with potentially many root causes; PARTIAL closeout (quarantine remainder) is acceptable.
3. **CI integration is P1, not P0.** Gating `npm run build` on vitest exit code is desirable but not blocking.
4. **No alternative test runner exploration.** Migration to bun test or similar is out-of-scope.
<!-- /ANCHOR:limitations -->
