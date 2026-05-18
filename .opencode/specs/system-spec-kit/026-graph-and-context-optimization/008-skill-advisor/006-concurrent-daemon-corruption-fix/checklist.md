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
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/006-concurrent-daemon-corruption-fix"
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

- [ ] **[CHK-001] [P0] Spec read and root cause confirmed.** spec.md §2 PROBLEM & PURPOSE matches the field-observed pattern: 1005 .corrupt files in 6h from 3 concurrent daemons.
- [ ] **[CHK-002] [P0] Lease primitive verified intact.** `lib/daemon/lease.ts` `acquireSkillGraphLease()` returns `{acquired, ownerId, result}` and is reusable from launcher context.
- [ ] **[CHK-003] [P1] Test fixtures available.** `tests/launcher-bootstrap.vitest.ts` exists with at least one launcher spawn-and-exit case.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## 3. CODE QUALITY

- [ ] **[CHK-004] [P0] No new lint or type errors.** `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck` exits 0.
- [ ] **[CHK-005] [P0] Lease check is the FIRST DB-related call in the launcher.** Reading `mk-skill-advisor-launcher.cjs` top-to-bottom, the lease check precedes any `Database` constructor or DB-path resolution.
- [ ] **[CHK-006] [P1] WAL pragma is set in the single `openDb` (or equivalent) path.** Only one call site sets `journal_mode=WAL`; no scattered duplicates.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## 4. TESTING

- [ ] **[CHK-007] [P0] Spawn-twice test green.** New vitest case: launcher #1 alive → launcher #2 spawned → #2 exits code 0 within 2s with `LEASE_HELD_BY:<pid>` line. Evidence: vitest name + assertion.
- [ ] **[CHK-008] [P0] WAL assertion test green.** Open the DB via the production handler path; assert `PRAGMA journal_mode == 'wal'` and `PRAGMA busy_timeout == 5000`.
- [ ] **[CHK-009] [P1] Existing advisor + daemon + skill-graph suites pass.** `vitest --run` across `advisor-*`, `daemon-*`, `skill-graph-*` exits 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## 5. FIX COMPLETENESS

- [ ] **[CHK-010] [P0] 24-hour zero-`.corrupt` soak (SC-001).** With the benchmark active, `find .opencode/skills/system-skill-advisor/mcp_server/database -name '*.corrupt'` returns empty after 24 hours. Evidence: timestamp + find output.
- [ ] **[CHK-011] [P0] Launcher idempotency (SC-002).** Spawn launcher while owner alive: exit code 0 in <2s. `lsof -p <pid>` shows no `skill-graph.sqlite` open before exit.
- [ ] **[CHK-012] [P0] Three-DB-open paths all set pragmas (SC-003).** Handler boot, watcher refresh, `rebuild-from-source` — assert WAL + busy_timeout on each via vitest.
- [ ] **[CHK-013] [P1] Stale-PID reclaim works (REQ-004).** Manually fake a dead PID in `.mk-skill-advisor-launcher.json`; new launcher reclaims and logs `staleReclaimed: true`.
- [ ] **[CHK-014] [P1] No advisor surface regression.** `advisor_recommend({prompt: "create a new agent"})` returns same top-3 ranking as pre-fix baseline (within 0.01 score delta).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## 6. SECURITY

- [ ] **[CHK-015] [P1] Lease file is workspace-local.** `.mk-skill-advisor-launcher.json` resolves under `.opencode/skills/system-skill-advisor/mcp_server/database/`; no absolute paths escape workspace root.
- [ ] **[CHK-016] [P2] No PID-spoofing attack surface.** Launcher only does `kill -0 <pid>` (existence probe), never `kill <signal> <pid>` against the recorded owner. Avoids killing unrelated processes if the lease file is tampered with.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## 7. DOCUMENTATION

- [ ] **[CHK-017] [P1] `references/daemon-lease-contract.md` §2 updated** to describe launcher-boundary enforcement + WAL pragma.
- [ ] **[CHK-018] [P1] `changelog/006-concurrent-daemon-corruption-fix.md` created** with summary + Why + Upgrade + verification evidence.
- [ ] **[CHK-019] [P2] `SKILL.md` version bumped** (current 0.3.0 → next minor) to reflect the safety improvement.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## 8. FILE ORGANIZATION

- [ ] **[CHK-020] [P1] Edits stay within scope listed in spec.md §3.** No drive-by changes to scorer, schema, or query surfaces.
- [ ] **[CHK-021] [P1] Strict validate green.** `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` reports `RESULT: PASSED`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## 9. VERIFICATION SUMMARY

- [ ] All P0 items complete with evidence
- [ ] All P1 items complete with evidence OR deferred with user approval recorded in `implementation-summary.md`
- [ ] Strict spec validate PASSED
- [ ] `recent_action` in `implementation-summary.md` frontmatter is compact (<96 chars, ≤16 tokens, no narrative discourse)
- [ ] `next_safe_action` begins with an imperative verb
<!-- /ANCHOR:summary -->
