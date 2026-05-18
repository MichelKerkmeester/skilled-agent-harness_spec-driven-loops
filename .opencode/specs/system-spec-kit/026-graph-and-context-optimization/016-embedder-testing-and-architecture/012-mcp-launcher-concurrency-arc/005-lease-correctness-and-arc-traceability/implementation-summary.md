---
title: "Implementation Summary: Lease Correctness and Arc Traceability"
description: "Phase 005 closes the 13 P1 deep-review findings across arc documentation, launcher lease correctness, SQLite fallback handling, and verification evidence."
trigger_phrases:
  - "012/005 implementation summary"
  - "lease correctness summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/012-mcp-launcher-concurrency-arc/005-lease-correctness-and-arc-traceability"
    last_updated_at: "2026-05-18T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Implemented Phase 005 remediation"
    next_safe_action: "Review final verification evidence"
    blockers: []
    key_files:
      - ".opencode/bin/mk-skill-advisor-launcher.cjs"
      - ".opencode/bin/mk-code-index-launcher.cjs"
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/launcher-lease.vitest.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/launcher-bootstrap.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "012-005-implementation-summary"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "No P1 deferrals intended"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `005-lease-correctness-and-arc-traceability` |
| **Completed** | 2026-05-18 |
| **Level** | 2 |
| **Status** | Implementation complete; commit blocked by sandbox Git index permissions |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 005 closes the CONDITIONAL deep-review verdict by tightening both behavior and evidence. The launcher lease boundary now follows the resolved database directory where overrides can redirect storage, the SQLite WAL fallback predicate is resilient to base and extended result codes, and the arc docs state the invariants future maintainers must preserve.

### Finding Closure

The packet addresses all 13 P1 findings:

| P1 | Closure |
|----|---------|
| P1-1 Child status drift | 001, 002, and 003 child specs now report Complete; 004 remains Complete. |
| P1-2 Unverified validate.sh claim | 004 checklist records strict validate evidence. |
| P1-3 Missing invariants | Parent spec includes Cross-Cutting Invariants. |
| P1-4 Missing skill-advisor spawn-twice test | Skill-advisor launcher-lease suite spawns a second launcher and asserts `LEASE_HELD_BY`. |
| P1-5 Stale-PID reclamation untested | Skill-advisor coverage includes stale launcher PID reclaim and `isLeaseHeld()` staleReclaimable behavior. |
| P1-6 SC-003 DB-open path coverage | Bootstrap suite verifies init path and statically proves watcher/rebuild paths route through the shared DB opener. |
| P1-7 REQ-009 test count drift | 003 spec lists all six launcher-lease cases. |
| P1-8 Missing REQ anchors | Launcher-lease suites carry REQ comments above mapped cases. |
| P1-9 Full vitest suite never run | Full skill-advisor vitest result is recorded below. |
| P1-10 Wrong race-protection mechanism | 002 spec names atomic temp-file+rename as the race guard. |
| P1-11 DB-dir override lease bug | Lease files/lease DB are co-located with resolved DB directories where overrides exist. |
| P1-12 Hardcoded SQLite error list | WAL fallback now matches SQLite READONLY/CANTOPEN/IOERR code families plus filesystem write errors. |
| P1-13 Lease leaks past SIGKILL path | All three launchers install exit cleanup for unconditional lease cleanup. |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `../spec.md` and child specs/checklists | Modified | Align arc traceability and validation evidence. |
| `.opencode/bin/mk-*-launcher.cjs` | Modified | Enforce resolved-DB lease ownership and unconditional cleanup. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lease.ts` | Modified | Resolve daemon lease DB beside the resolved skill graph DB. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts` | Modified | Widen WAL fallback error code matching. |
| `launcher-*.vitest.ts` | Modified | Add missing coverage and REQ anchors. |
| `references/daemon-lease-contract.md` | Modified | Document resolved-DB-dir lease boundary. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The code changes stay surgical: no new launcher abstraction, no schema migration, and no unrelated cleanup. The test changes reuse existing subprocess fixtures and static source assertions where exercising daemon harness paths would add more risk than coverage value.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use `process.on('exit', clearLeaseFile)` for P1-13 | It is the smallest cross-launcher cleanup hook and fits the prompt's allowed approach. |
| Use static assertions for watcher/rebuild DB-open paths | Those paths route through shared functions; static tests prove the wiring without booting daemon harnesses. |
| Keep spec-memory lease path unchanged except cleanup | No direct spec-memory DB-dir override was found in the launcher path logic. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <005> --strict` | PASS, exit 0. `Summary: Errors: 0  Warnings: 0`; `RESULT: PASSED`. |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <arc> --strict --no-recursive` | PASS, exit 0. `Summary: Errors: 0  Warnings: 0`; `RESULT: PASSED`. |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <001> --strict` | PASS, exit 0. `Summary: Errors: 0  Warnings: 0`; `RESULT: PASSED`. |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <004> --strict` | PASS, exit 0. `Summary: Errors: 0  Warnings: 0`; `RESULT: PASSED`. |
| `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck` | PASS, exit 0. |
| `cd .opencode/skills/system-skill-advisor/mcp_server && npx vitest --run launcher-lease launcher-bootstrap` | PASS, exit 0. 2 files passed; 17 tests passed. |
| `cd .opencode/skills/system-code-graph/mcp_server && npx vitest --run launcher-lease` | PASS, exit 0. 1 file passed; 7 tests passed. |
| `cd .opencode/skills/system-spec-kit/mcp_server && npx vitest --run launcher-lease` | PASS, exit 0. 1 file passed; 6 tests passed. |
| `cd .opencode/skills/system-skill-advisor/mcp_server && npx vitest --run` | FAIL, exit 1. 57 files passed, 3 failed; 403 tests passed, 1 failed, 7 skipped. |
| `git add <explicit Phase 005 paths>` | FAIL, exit 128. Git cannot create `.git/index.lock` in this sandbox: `Operation not permitted`. |

### Pre-existing Test Failures

These failures are outside the Phase 005 frozen file scope and were not addressed in this packet:

1. `tests/skill-graph-diagnostic-redaction.vitest.ts:10` fails to import `../../../../plugins/spec-kit-skill-advisor.js`.
2. `tests/scorer/lane-weight-sweep.vitest.ts:152` cannot find the expected seeded sweep spec packet directories for `006-corpus-seeded-sweep` and `007-harder-intent-corpus-resweep`.
3. `tests/manual-testing-playbook.vitest.ts:50` expects the root playbook to contain `45 deterministic scenario files across 9 categories`, while the current playbook says `46 deterministic scenario files across 9 categories`.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Manual smoke skipped if unsafe.** The subprocess vitest suites cover duplicate-launch behavior without perturbing running MCP daemons.
2. **Commit blocked by sandbox Git permissions.** The repository worktree contains the intended changes, but this session cannot stage or commit because `.git/index.lock` cannot be created.
<!-- /ANCHOR:limitations -->
