---
title: "Verification Checklist: 039 Deferred Follow-on"
description: "Acceptance gates for closing 038 deferred items + 037 P2 batch."
trigger_phrases:
  - "039 checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/039-system-code-graph-deferred-followon"
    last_updated_at: "2026-05-15T18:05:00Z"
    last_updated_by: "claude-opus-4-7-039-scaffold"
    recent_action: "checklist_authored"
    next_safe_action: "await_user_dispatch_authorization"
    blockers: []
    key_files: ["checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-15-039-deferred-followon"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
# Verification Checklist: 039

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

Each item must be marked `[x]` with evidence (file:line, command + output excerpt, or commit SHA) before the packet ships. `[ ]` = pending.

<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

| ID | Priority | Status | Item | Evidence |
|----|----------|--------|------|----------|
| CHK-001 | [P0] | [ ] | Phase 0 verification sweep complete; STILL-OPEN list documented in `tasks.md`. | tasks.md T0.1-T0.12 marked |
| CHK-002 | [P0] | [ ] | Open Question 1 (`package.json` gitignore) decision recorded. | spec.md §7 Q1 + tasks.md T1.1 evidence |
| CHK-003 | [P1] | [ ] | Open Question 2 (P2 batch cap = 10) confirmed by operator. | spec.md §7 Q2 |
| CHK-004 | [P1] | [ ] | Parallel agent's 058/4* commits stable (no continued mutation during 039 dispatches). | git log + `git status --short` snapshots |

<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

| ID | Priority | Status | Item | Evidence |
|----|----------|--------|------|----------|
| CHK-010 | [P0] | [ ] | `npx tsc --noEmit -p tsconfig.json` from `system-code-graph/mcp_server/` exits 0 post-Phase 1. | command output |
| CHK-011 | [P0] | [ ] | New vitest files match existing style (describe/it, vi.mock patterns). | file inspection |
| CHK-012 | [P1] | [ ] | No new lint warnings introduced (if any lint config exists). | npm run lint output |

<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

| ID | Priority | Status | Item | Evidence |
|----|----------|--------|------|----------|
| CHK-020 | [P0] | [ ] | `npx vitest run mcp_server/tests/runtime-detection.vitest.ts` exits 0 with ≥15 test cases. | command output |
| CHK-021 | [P0] | [ ] | `npx vitest run mcp_server/tests/exclude-rule-classifier.vitest.ts` exits 0 with ≥15 test cases. | command output |
| CHK-022 | [P0] | [ ] | `npx vitest run mcp_server/stress_test/code-graph/doctor-apply-mode-stress.vitest.ts` exits 0 with previously-skipped tests now restored or documented. | command output + grep `it.todo`/`it.skip` count |
| CHK-023 | [P0] | [ ] | Full `npx vitest run` from `mcp_server/` exits 0. | command output |
| CHK-024 | [P1] | [ ] | New test files have ≥80% branch coverage on target modules. | vitest --coverage output |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

| ID | Priority | Status | Item | Evidence |
|----|----------|--------|------|----------|
| CHK-005 | [P0] | [ ] | All P0 + P1 from 037 review-report.md are CLOSED (by 038 or 039) or moved to a tracked-deferral list. | per-finding map in tasks.md Phase 1 |
| CHK-006 | [P0] | [ ] | P1-F1 (package.json scripts) shipped or documented per Open Question 1 decision. | git log + jq inspection |
| CHK-007 | [P0] | [ ] | P1-F2 (dist materialization) confirmed: `wc -c mcp_server/dist/index.js > 1000`. | wc -c output |
| CHK-008 | [P1] | [ ] | P1-D1 (2 new vitest files for runtime-detection + exclude-rule-classifier) shipped with ≥80% branch coverage. | vitest --coverage output |
| CHK-009 | [P1] | [ ] | P1-D3 (skip-test restorations at doctor-apply-mode-stress:125,184) closed via mock OR it.todo + comment. | grep + diff |

<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

| ID | Priority | Status | Item | Evidence |
|----|----------|--------|------|----------|
| CHK-030 | [P1] | [ ] | No secrets in new test fixtures (no API keys, tokens, credentials). | grep `[A-Z0-9_]{32,}` in new test files |
| CHK-031 | [P1] | [ ] | New tests don't enable destructive ops without proper mocking. | code review |

<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

| ID | Priority | Status | Item | Evidence |
|----|----------|--------|------|----------|
| CHK-040 | [P0] | [ ] | `.opencode/skills/system-code-graph/changelog/v1.0.2.0.md` exists with HONEST scope summary. | file exists + content review |
| CHK-041 | [P1] | [ ] | Open Questions in `spec.md` §7 are resolved or marked deferred. | spec.md §7 review |
| CHK-042 | [P1] | [ ] | `tasks.md` Phase 0 verification table is filled in. | tasks.md inspection |
| CHK-043 | [P2] | [ ] | `scratch/p2-deferral.md` lists remaining ~20 P2 findings if cap-at-10 chosen. | file exists |

<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

| ID | Priority | Status | Item | Evidence |
|----|----------|--------|------|----------|
| CHK-050 | [P0] | [ ] | All 6 mk-spec-memory configs have `_NOTE_AUTO_MIGRATION` block (P1-H3). | rg `_NOTE_AUTO_MIGRATION` opencode.json .claude/ .codex/ .devin/ .gemini/ .vscode/ |
| CHK-051 | [P0] | [ ] | `.claude/mcp.json` + `.gemini/settings.json` use `_NOTE_1_DB` + `_NOTE_2_TOOLS` (P1-H2). | jq inspection |
| CHK-052 | [P0] | [ ] | `SPECKIT_CODE_GRAPH_INDEX_*` defaults are consistently `"false"` (or documented exception) across 6 configs (P1-H1). | rg + diff |
| CHK-053 | [P1] | [ ] | `mcp-doctor.sh` `diagnose_mk_code_index` fix-mode has `mkdir -p "$db_dir"` (P1-G1). | grep |

<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| ID | Priority | Status | Item | Evidence |
|----|----------|--------|------|----------|
| CHK-100 | [P0] | [ ] | Strict validate: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <039> --strict` exits 0. | command output |
| CHK-101 | [P0] | [ ] | `mcp_server/dist/index.js` is real compiled output (`wc -c > 1000`). | wc -c |
| CHK-102 | [P0] | [ ] | All CHK-001..CHK-053 items marked `[x]` with evidence. | this file |
| CHK-103 | [P0] | [ ] | Final commit on main; pushed to origin; v1.0.2.0 changelog visible. | git log |
| CHK-104 | [P1] | [ ] | `_memory.continuity` updated via `/memory:save` to `completion_pct: 100`. | implementation-summary.md frontmatter |

<!-- /ANCHOR:summary -->
