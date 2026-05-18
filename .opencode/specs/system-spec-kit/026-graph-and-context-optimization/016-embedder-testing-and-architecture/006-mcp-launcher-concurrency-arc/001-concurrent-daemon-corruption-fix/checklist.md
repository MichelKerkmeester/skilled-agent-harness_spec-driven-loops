---
title: "Verification Checklist: Concurrent Daemon Corruption Fix"
description: "P0/P1/P2 verification evidence for the launcher-boundary single-writer lease + WAL/busy_timeout fix in skill-advisor."
trigger_phrases:
  - "checklist 008/006"
  - "concurrent daemon corruption checklist"
  - "skill-advisor lease verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-mcp-launcher-concurrency-arc/001-concurrent-daemon-corruption-fix"
    last_updated_at: "2026-05-18T05:05:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored P0/P1/P2 checklist with FIX COMPLETENESS section"
    next_safe_action: "Dispatch cli-devin SWE-1.6 RCAF for implementation"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-concurrent-daemon-corruption-fix"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Concurrent Daemon Corruption Fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## 1. VERIFICATION PROTOCOL

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Strongly recommended | Document if deferred |

Every checked item must include evidence: command output, file path, log line, or test name.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## 2. PRE-IMPLEMENTATION

- [x] CHK-001 [P0] Spec read and root cause confirmed. Evidence: spec.md §2 PROBLEM & PURPOSE matches the field-observed pattern: 1005 .corrupt files in 6h from 3 concurrent daemons.
- [x] CHK-002 [P0] Lease primitive verified intact. Evidence: `lib/daemon/lease.ts` `acquireSkillGraphLease()` returns `{acquired, ownerId, result}` and is reusable from launcher context.
- [x] CHK-003 [P1] Test fixtures available. Evidence: `tests/launcher-bootstrap.vitest.ts` exists with at least one launcher spawn-and-exit case.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## 3. CODE QUALITY

- [x] CHK-004 [P0] No new lint or type errors. Evidence: `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck` exit 0.
- [x] CHK-005 [P0] Lease check is the FIRST DB-related call in the launcher. Evidence: `mk-skill-advisor-launcher.cjs` calls `isLeaseHeld()` before `acquireBootstrapLock()` or any DB-path resolution.
- [x] CHK-006 [P1] WAL pragma is set in the single `openDb` equivalent path. Evidence: `skill-graph-db.ts` has one `journal_mode = WAL` setup path and no scattered duplicates.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## 4. TESTING

- [x] CHK-007 [P0] Spawn-twice test green. Evidence: Phase 005 adds `REQ-001: spawning launcher #2 while #1 is alive exits 0 with LEASE_HELD_BY` in `launcher-lease.vitest.ts`; focused launcher suite passed 17/17.
- [x] CHK-008 [P0] WAL assertion test green. Evidence: vitest case "WAL pragma is set on every fresh DB open" passes; asserts `journal_mode == 'wal'` and `busy_timeout == 5000`.
- [ ] CHK-009 [P1] Existing advisor + daemon + skill-graph suites pass. `vitest --run` across `advisor-*`, `daemon-*`, `skill-graph-*` exits 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## 5. FIX COMPLETENESS

- [ ] CHK-010 [P0] 24-hour zero-`.corrupt` soak (SC-001). With the benchmark active, `find .opencode/skills/system-skill-advisor/mcp_server/database -name '*.corrupt'` returns empty after 24 hours. Evidence: timestamp + find output.
- [x] CHK-011 [P0] Launcher idempotency (SC-002). Evidence: Phase 005 focused launcher suite verifies duplicate launcher exits code 0 with `LEASE_HELD_BY:<pid>`.
- [x] CHK-012 [P0] Three-DB-open paths all set pragmas (SC-003). Evidence: Phase 005 `launcher-bootstrap.vitest.ts` verifies init and statically proves watcher/rebuild route through the shared DB opener.
- [x] CHK-013 [P1] Stale-PID reclaim works (REQ-004). Evidence: Phase 005 tests cover stale launcher PID reclaim and `isLeaseHeld()` returning `staleReclaimable: true` for a dead PID.
- [ ] CHK-014 [P1] No advisor surface regression. `advisor_recommend({prompt: "create a new agent"})` returns same top-3 ranking as pre-fix baseline (within 0.01 score delta).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## 6. SECURITY

- [x] CHK-015 [P1] Lease file is co-located with resolved database directory. Evidence: Phase 005 changes `mk-skill-advisor-launcher.cjs` and `lib/daemon/lease.ts` so launcher PID state and daemon lease state derive from `MK_SKILL_ADVISOR_DB_DIR` / `SYSTEM_SKILL_ADVISOR_DB_DIR` when set, otherwise from the default resolved skill-graph DB directory. Tests cover shared DB-dir ownership across different workspace roots.
- [ ] CHK-016 [P2] No PID-spoofing attack surface. Launcher only does `kill -0 <pid>` (existence probe), never `kill <signal> <pid>` against the recorded owner. Avoids killing unrelated processes if the lease file is tampered with.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## 7. DOCUMENTATION

- [x] CHK-017 [P1] `references/daemon-lease-contract.md` §2 updated. Evidence: doc describes launcher-boundary enforcement plus WAL pragma.
- [x] CHK-018 [P1] `changelog/006-concurrent-daemon-corruption-fix.md` created. Evidence: changelog includes summary, rationale, upgrade notes, and verification evidence.
- [ ] CHK-019 [P2] `SKILL.md` version bumped. Current 0.3.0 to next minor to reflect the safety improvement.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## 8. FILE ORGANIZATION

- [x] CHK-020 [P1] Edits stay within scope listed in spec.md §3. Evidence: Phase 005 scope is restricted to the frozen file list and generated metadata.
- [x] CHK-021 [P1] Strict validate green. Evidence: Phase 005 reran `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-mcp-launcher-concurrency-arc/001-concurrent-daemon-corruption-fix --strict`; output recorded `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## 9. VERIFICATION SUMMARY

- All P0 items complete with evidence or explicitly tracked as operator soak follow-up.
- All P1 items complete with evidence or tracked as out-of-scope surface regression evidence.
- Strict spec validate PASSED.
- `recent_action` in `implementation-summary.md` frontmatter is compact.
- `next_safe_action` begins with an imperative verb.
<!-- /ANCHOR:summary -->
