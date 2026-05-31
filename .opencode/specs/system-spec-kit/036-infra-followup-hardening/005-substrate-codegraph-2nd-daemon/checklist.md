---
title: "Verification Checklist: Wire a second live code-graph daemon into the substrate stress harness"
description: "Verification Date: 2026-05-31"
trigger_phrases:
  - "substrate code-graph 2nd daemon checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/036-infra-followup-hardening/005-substrate-codegraph-2nd-daemon"
    last_updated_at: "2026-05-31T05:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored checklist to manifest scaffold"
    next_safe_action: "Gate then commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003658"
      session_id: "036-005-checklist"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Wire a second live code-graph daemon into the substrate stress harness

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P0] Baseline captured: at HEAD (change stashed) the suite is RED (`1 failed | 2 passed`, runner-harness file)
- [x] CHK-004 [P0] Standalone probe confirmed code-graph daemon connect + code_graph_context content (isError=false) before editing
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] shortSocketDir(slug) helper added; creates a short os.tmpdir() subdir
- [x] CHK-011 [P0] Memory daemon gets SPECKIT_IPC_SOCKET_DIR=shortSocketDir('mem')
- [x] CHK-012 [P0] 2nd daemon connection added (mk-code-index, shortSocketDir('cg'), bridge disabled)
- [x] CHK-013 [P0] selectClientForServer routes mk_code_index / mk-code-index; clients + toolNameSets register it
- [x] CHK-014 [P1] Maintainer mode NOT enabled (no INDEX_* scan)
- [x] CHK-015 [P1] vitest description + 2 comments synced; expect() assertions byte-unchanged
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] node --check passes on the harness
- [x] CHK-021 [P0] Harness run: 403=PASS 404=PASS 407=PASS 410=PASS, 0 runner-FAIL
- [x] CHK-022 [P0] `npm run stress:substrate` green 3x consecutive, NO external env: Test Files 3 passed, Tests 9 passed
- [x] CHK-023 [P0] Stash-compare: at HEAD RED (`1 failed`), with change GREEN — confirms the change is the fix
- [x] CHK-024 [P0] graph-metadata dirty count before==after==0 (no mass-write) on every run
- [x] CHK-025 [P1] Daemons killed between runs; clean marker each (no false flake)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: `harness coverage gap + red-by-default` (scenarios SKIP for lack of 2nd daemon; daemons die on sun_path)
- [x] CHK-FIX-002 [P0] Producer inventory: the substrate runner is the only daemon-wiring site; both daemons routed through one shortSocketDir helper
- [x] CHK-FIX-003 [P0] Consumer inventory: scenarios 403/404/407 (now PASS) + 410 (unchanged); vitest assertions still valid for 2 daemons
- [x] CHK-FIX-004 [P1] N/A — no security/parser path; env denylist reused for both children
- [x] CHK-FIX-005 [P1] Axes listed: (daemon, socket dir, routing key, tool-name set)
- [x] CHK-FIX-006 [P1] Global state: two short socket dirs under os.tmpdir(), created idempotently (mkdir recursive)
- [x] CHK-FIX-007 [P1] Evidence pinned to the commit
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] No new external input (env denylist reused for both child daemons)
- [x] CHK-032 [P1] No auth surface touched
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/checklist/implementation-summary synchronized
- [x] CHK-041 [P1] Comment-hygiene: 0 ephemeral-pointer violations on both code files
- [x] CHK-042 [P2] SKIP-tolerance retained-by-design note recorded (future-hardening option in spec Q)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Only the 2 substrate code files + this packet touched
- [x] CHK-051 [P1] Commit scoped with explicit pathspecs (no `git add -A`)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 12 | 12/12 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-05-31
<!-- /ANCHOR:summary -->
