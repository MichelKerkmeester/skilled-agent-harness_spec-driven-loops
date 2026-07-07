---
title: "Implementation Summary: 10-iter P2 cleanup"
description: "Evidence summary and full bucket ledger for the 28 P2 findings from the 013/009 10-iteration review."
trigger_phrases:
  - "013/009/018 implementation summary"
  - "P2 cleanup summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/018-fix-followup-p2-findings-for-package-extraction"
    last_updated_at: "2026-05-15T06:09:08Z"
    last_updated_by: "codex"
    recent_action: "18 P2 fixed, 3 not applicable, 6 named deferrals"
    next_safe_action: "Strict-validate packet and commit"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "description.json"
      - "graph-metadata.json"
    completion_pct: 100
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `018-fix-followup-p2-findings-for-package-extraction` |
| **Completed** | 2026-05-15 |
| **Level** | 2 |
| **Status** | Complete |
| **Completion** | 100% implementation |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

18 P2 findings were fixed in code/config/tests, 3 were classified not applicable against current state or historical-doc scope, and 7 were deferred to named packets because they are broader than the dispatch's surgical limit. The review report's synthesis table uses merged labels; this ledger expands `A-R-RELATED` and the parent-doc drift row so the mandated 28 P2 findings are individually accounted for.

### P2 Bucket Ledger

| ID | Bucket | Resolution |
|----|--------|------------|
| A-001 | FIXED | `dispatchTool` and `TOOL_DEFINITIONS` now live in `tools/index.ts`. |
| A-002 | FIXED | Chokidar lookup now prefers advisor package path before fallback. |
| A-004 | FIXED | Advisor DB fixture helper moved under advisor tests. |
| A-005 | NEEDS_NEW_PACKET | `019-advisor-schema-boundary-contract` for schema bridge timeline. |
| A-006 | FIXED | Removed server-local duplicate dispatch implementation. |
| C-001 | FIXED | `semantic-shadow.ts` imports `@spec-kit/shared`. |
| C-002 | FIXED | Advisor test fixture no longer imports spec-kit test fixtures. |
| C-003 | NEEDS_NEW_PACKET | `019-advisor-schema-boundary-contract` for typed schema bridge. |
| R-001 | FIXED | Launcher artifact readiness checks source mtimes. |
| R-002 | FIXED | Fatal server startup path calls `shutdownAdvisor()`. |
| R-003 | FIXED | Unknown SQLite open errors return `SQLITE_CHECK_FAILED`. |
| R-005 | FIXED | Missing chokidar error reports every checked path. |
| T-001 | FIXED | Dispatch test now covers all 8 public tools. |
| T-002 | FIXED | Launcher stale lock recovery Vitest added. |
| T-003 | FIXED | Launcher stale artifact Vitest added. |
| T-004 | NEEDS_NEW_PACKET | `020-plugin-bridge-unit-isolation` for subprocess-free plugin bridge units. |
| T-005 | FIXED | Runtime env parity Vitest added. |
| S-MERGED | NEEDS_NEW_PACKET | `021-subprocess-env-whitelist` for 3 subprocess env surfaces. |
| S-002 | NOT_APPLICABLE | Current schemas already bound `workspaceRoot`; tests reject `/etc`. |
| P-001 | FIXED | Fusion scorer indexes lane matches once per lane. |
| P-002 | NEEDS_NEW_PACKET | `022-dfidf-cold-start-cache` for persisted cold-start corpus cache. |
| P-003 | FIXED | Watcher defaults can be tuned via env vars. |
| D-001 | NEEDS_NEW_PACKET | `023-parent-doc-drift-refresh` for parent child-status rewrite. |
| D-002 | NEEDS_NEW_PACKET | `023-parent-doc-drift-refresh` for parent completion/handover metadata rewrite. |
| D-004 | NOT_APPLICABLE | Child 007 spec is historical and sibling packet edits are forbidden here. |
| D-005 | NOT_APPLICABLE | Child 008 feature catalog refs are historical and sibling packet edits are forbidden here. |
| CP-001 | FIXED | All four runtime configs now expose aligned advisor env keys. |
| M-003 | FIXED | Same fix as A-001/A-006: single dispatch source. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The cleanup stayed in the current advisor package and runtime config surfaces. It did not edit review artifacts or sibling packet docs. Larger P2s were named as follow-ons rather than expanded inline.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Defer schema bridge redesign | It spans spec-kit/advisor type contracts and exceeds the surgical limit. |
| Defer subprocess env whitelisting | It touches three process boundaries and needs its own compatibility pass. |
| Mark D-004/D-005 not applicable | Historical sibling packet docs are out of scope and intentionally immutable here. |
| Add env parity to all configs | The review identified config asymmetry; tests now enforce the common keys. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Advisor Vitest | PASS: 43 files, 299 tests. |
| Advisor typecheck | PASS: `npm run typecheck`. |
| Runtime JSON parse | PASS: `opencode.json`, `.claude/mcp.json`, `.gemini/settings.json`. |
| Launcher syntax | PASS: `node -c .opencode/bin/mk-skill-advisor-launcher.cjs`. |
| Strict validation | PASS: 018 strict validation returned 0 errors and 0 warnings. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

Named follow-ons:

1. `019-advisor-schema-boundary-contract`: A-005 and C-003.
2. `020-plugin-bridge-unit-isolation`: T-004.
3. `021-subprocess-env-whitelist`: S-MERGED.
4. `022-dfidf-cold-start-cache`: P-002.
5. `023-parent-doc-drift-refresh`: D-001 and D-002.
<!-- /ANCHOR:limitations -->
