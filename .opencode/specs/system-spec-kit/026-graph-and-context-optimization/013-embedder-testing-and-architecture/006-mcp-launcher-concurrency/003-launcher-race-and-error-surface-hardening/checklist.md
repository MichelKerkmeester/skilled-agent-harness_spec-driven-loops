---
title: "Verification Checklist: Lease Hardening From Review"
description: "P0/P1/P2 verification evidence for closing 9 P1 review findings against packets 006 + 007."
trigger_phrases:
  - "checklist 008/008"
  - "lease hardening checklist"
  - "review remediation verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/006-mcp-launcher-concurrency/003-launcher-race-and-error-surface-hardening"
    last_updated_at: "2026-05-18T08:32:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored checklist after codex + main-agent finish of all 10 phases"
    next_safe_action: "Commit packet 008 + push origin main"
    blockers: []
    key_files:
      - ".opencode/bin/mk-skill-advisor-launcher.cjs"
      - ".opencode/bin/mk-code-index-launcher.cjs"
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "008-lease-hardening-from-review"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Lease Hardening From Review

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
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## 2. PRE-IMPLEMENTATION

- [x] CHK-001 [P0] 9 P1 findings clearly enumerated in spec.md §4. spec.md §4 REQ-001..009 each maps to a single P1 from the 3-reviewer audit.
- [x] CHK-002 [P0] Codex prompt includes per-phase acceptance + verification. Confirmed in `/tmp/codex-008-prompt.md`.
- [x] CHK-003 [P1] 14 P2 findings logged as deferred in spec.md §3 Out of Scope + changelog. Both files list them explicitly.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## 3. CODE QUALITY

- [x] CHK-004 [P0] All 3 typechecks PASS. Evidence: `npm run typecheck` exit 0 for skill-advisor, code-graph, and spec-memory.
- [x] CHK-005 [P0] Re-probe block in code-graph + spec-memory immediately follows `writeLeaseFile()`. Code review of both launcher diffs.
- [x] CHK-006 [P1] Env-var helper is byte-identical across all 3 launchers. Manual diff confirmed; same accepted-values set.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## 4. TESTING

- [x] CHK-007 [P0] skill-advisor launcher-lease.vitest.ts (NEW) — 3 cases PASS. Evidence: `vitest --run launcher-lease` reports 3 passed, 481ms.
- [x] CHK-008 [P0] skill-advisor launcher-bootstrap.vitest.ts (existing) — 6 cases STILL PASS. No regression.
- [x] CHK-009 [P0] code-graph launcher-lease.vitest.ts — 3 cases PASS (with new stdout-close gate + env-strip).
- [x] CHK-010 [P0] spec-memory launcher-lease.vitest.ts — 3 cases PASS.
- [x] CHK-011 [P1] Total test count: 15 across 3 packages. Was 12 before this packet.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## 5. FIX COMPLETENESS

- [x] CHK-012 [P0] All 9 P1 review findings closed (REQ-001 to REQ-009). See spec.md §4 + verification table in implementation-summary.md.
- [x] CHK-013 [P0] Cross-launcher parity holds. `grep -c LEASE_HELD_BY .opencode/bin/mk-*-launcher.cjs` returns 1 (skill-advisor) + 2 (code-index, +re-probe) + 2 (spec-memory, +re-probe) = 5. The LEASE_HELD_BY string contract is byte-identical wherever it appears.
- [x] CHK-014 [P1] EPERM branch present in `isLeaseHeld()`. `lease.ts` lines 130-132 add `if (code === 'EPERM') return { held: true, ... }`.
- [x] CHK-015 [P1] `busy_timeout` precedes `journal_mode` in `initDb()`. Verified by code review of `skill-graph-db.ts:285-300`.
- [x] CHK-016 [P1] EACCES predicate broadened. Catches `EACCES | EROFS | SQLITE_READONLY | SQLITE_CANTOPEN | SQLITE_IOERR_WRITE`.
- [x] CHK-017 [P1] SIGTERM child-exit handler attached, SIGKILL backstop at 5s. `mk-spec-memory-launcher.cjs` signal handler refactored.
- [ ] CHK-018 [P2] 24-hour zero-zombie soak (carried over from 007 SC-002). Deferred to operator; not blocked by this packet.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## 6. SECURITY

- [x] CHK-019 [P1] No new attack surfaces. EPERM probe is read-only; `process.kill(pid, 0)` doesn't deliver a signal. Lease files remain workspace-local.
- [x] CHK-020 [P2] Env-var helper doesn't eval user input. `String(value).trim().toLowerCase()` then set-membership; no `eval`, no regex with user-controlled patterns.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## 7. DOCUMENTATION

- [x] CHK-021 [P1] `013-embedder-testing-and-architecture/006-mcp-launcher-concurrency/changelog/003-launcher-race-and-error-surface-hardening.md` written. Includes Summary + What Changed table + Upgrade Notes + Verification Evidence + Deferred P2s list.
- [x] CHK-022 [P2] No `references/` docs updated. None needed; new behavior is operator-facing, captured in changelog Upgrade Notes.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## 8. FILE ORGANIZATION

- [x] CHK-023 [P1] Edits stay within scope listed in spec.md §3 Files to Change. All 9 modified files appear in the §3 table. Zero drive-by edits.
- [x] CHK-024 [P1] Strict validate green. `bash .../validate.sh <packet>` PASS (0 errors).
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## 9. VERIFICATION SUMMARY

- [x] CHK-031 [P0] All P0 items complete with evidence.
- [x] CHK-032 [P1] All P1 items complete with evidence.
- [ ] CHK-033 [P2] 24-hour soak CHK-018 is deferred to operator.
- [x] CHK-034 [P1] Strict spec validate PASSED.
- [x] CHK-035 [P1] `recent_action` is compact.
- [x] CHK-036 [P1] `next_safe_action` begins with an imperative verb.
<!-- /ANCHOR:summary -->
