---
title: "Verification Checklist: Cross-Launcher Lease Propagation"
description: "P0/P1/P2 verification evidence for the code-graph + spec-memory launcher-boundary PID lease patch."
trigger_phrases:
  - "checklist 008/007"
  - "cross-launcher lease checklist"
  - "code-graph spec-memory launcher verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/002-cross-launcher-lease-propagation"
    last_updated_at: "2026-05-18T07:55:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored P0/P1/P2 checklist after codex implementation"
    next_safe_action: "Commit packet 007 + push origin main"
    blockers: []
    key_files:
      - ".opencode/bin/mk-code-index-launcher.cjs"
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-cross-launcher-lease-propagation"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Cross-Launcher Lease Propagation

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

- [x] CHK-001 [P0] Spec read and 006 pattern referenced. spec.md §2 cites the 006 launcher-boundary lease as the parent pattern; cli-codex prompt reads commit `28e1fc8ba` lines 302–325 of skill-advisor launcher.
- [x] CHK-002 [P0] Decision: inline PID-file primitive (not lib/daemon/lease.ts reuse). spec.md §3 Out of Scope makes this explicit; cli-codex honored it.
- [x] CHK-003 [P1] Both launcher files identified as in-scope. spec.md §3 Files to Change table names both `mk-code-index-launcher.cjs` and `mk-spec-memory-launcher.cjs`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## 3. CODE QUALITY

- [x] CHK-004 [P0] No new lint or type errors. Evidence: `npm --prefix .opencode/skills/system-code-graph run typecheck` exit 0 + `npm --prefix .opencode/skills/system-spec-kit/mcp_server run typecheck` exit 0.
- [x] CHK-005 [P0] Lease check is the FIRST DB-related call in both launchers. Evidence: code review of both `main()` functions shows lease check before `acquireBootstrapLock()`.
- [x] CHK-006 [P1] PID-file write uses atomic rename. Evidence: `writeLeaseFile()` writes to `<path>.tmp.<pid>` then `fs.renameSync`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## 4. TESTING

- [x] CHK-007 [P0] Spawn-twice test green for code-graph. Evidence: vitest case "spawn launcher #2 while owner alive → exits 0 with LEASE_HELD_BY" passes (1 of 3 in `system-code-graph/mcp_server/tests/launcher-lease.vitest.ts`).
- [x] CHK-008 [P0] Spawn-twice test green for spec-memory. Evidence: vitest case "spawn launcher #2 while owner alive → exits 0 with LEASE_HELD_BY" passes (1 of 3 in `system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts`).
- [x] CHK-009 [P1] Stale-PID reclaim test green (both). Evidence: vitest case "dead-PID lease file → new launcher reclaims" passes for both skills.
- [x] CHK-010 [P1] Env-var disable test green (both). Evidence: vitest case "disabled via env var → launcher boots even when sibling alive" passes for both skills.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## 5. FIX COMPLETENESS

- [x] CHK-011 [P0] All 3 launchers now share the LEASE_HELD_BY contract. Evidence: `grep -c 'LEASE_HELD_BY' .opencode/bin/mk-*-launcher.cjs` returns 3.
- [x] CHK-012 [P0] Manual spawn-twice probe for each launcher (REQ-001 + REQ-002). Evidence (codex log): `second_exit=0`, `second_stdout=LEASE_HELD_BY:<pid>`, `lease_after_kill=gone` for both `mk-code-index` (PID 52613) and `mk-spec-memory` (PID 55959).
- [x] CHK-013 [P1] PID files clean up on SIGTERM (REQ-003). Evidence (codex log): `lease_after_kill=gone` for both probes.
- [ ] CHK-014 [P2] 24-hour zombie audit (SC-002). Verification automated via `.opencode/skills/system-skill-advisor/mcp_server/scripts/verify-zombie-soak.sh`. Procedure: (1) restart MCP-using runtimes so the new 008/006-009 launcher binaries activate; (2) use the workspace normally for ≥ 24 hours across all connected runtimes; (3) run `bash .opencode/skills/system-skill-advisor/mcp_server/scripts/verify-zombie-soak.sh --verbose > /tmp/soak-evidence-$(date +%Y%m%d).log 2>&1`; (4) attach the log here, mark this checkbox, and update CHK-018 in `008/008/checklist.md` if it references the same soak. Script exits 0 if no launcher exceeds 1 instance; exits 1 if duplicates present (zombie state — investigate).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## 6. SECURITY

- [x] CHK-015 [P1] PID files are workspace-local. Lease files resolve under each skill's `mcp_server/database/`; no absolute paths escape workspace root.
- [x] CHK-016 [P2] No PID-spoofing attack surface. Both launchers only do `process.kill(pid, 0)` (existence probe), never `kill <signal> <pid>` against the recorded owner.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## 7. DOCUMENTATION

- [x] CHK-017 [P1] `system-code-graph/references/launcher-lease.md` created. 83 lines; covers OVERVIEW, PID-FILE FORMAT, ENV-VAR OVERRIDE, STALE RECLAIM PATH, RELATED.
- [x] CHK-018 [P1] `system-spec-kit/references/launcher-lease.md` created. 83 lines; mirrors code-graph version with spec-memory specifics.
- [x] CHK-019 [P1] `013-embedder-testing-and-architecture/006-mcp-launcher-concurrency/changelog/002-cross-launcher-lease-propagation.md` created. 103 lines; summary + what-changed + upgrade notes + verification evidence.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## 8. FILE ORGANIZATION

- [x] CHK-020 [P1] Edits stay within scope listed in spec.md §3. All 7 modified files appear in the §3 table; no drive-by edits to scorer, schema, or context-server.js.
- [x] CHK-021 [P1] Strict validate green after metadata cleanup. Evidence: Phase 005 verification reran strict validation for the arc parent and child packets after metadata cleanup; Phase 006 keeps this item checked and reruns the parent strict validator as a final gate.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## 9. VERIFICATION SUMMARY

- [x] CHK-022 [P0] All P0 items complete with evidence.
- [x] CHK-023 [P1] All P1 items complete with evidence.
- [ ] CHK-024 [P2] All P2 items complete; CHK-014 soak deferred to operator.
- [x] CHK-025 [P1] Strict spec validate PASSED, validated by Phase 005 and rechecked by Phase 006 final gates.
- [x] CHK-026 [P1] `recent_action` in `implementation-summary.md` frontmatter is compact.
- [x] CHK-027 [P1] `next_safe_action` begins with an imperative verb.
<!-- /ANCHOR:summary -->
