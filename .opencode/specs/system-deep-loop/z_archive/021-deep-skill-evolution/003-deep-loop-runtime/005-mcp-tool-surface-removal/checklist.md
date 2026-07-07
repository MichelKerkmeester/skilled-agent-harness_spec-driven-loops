---
title: "Verification Checklist: 004 — MCP Tool Surface Removal"
description: "Level 3 verification checklist for deleting 5 MCP handler files + 4 schema entries + 4 input-schema entries + 4 registration calls for the deep_loop_graph_* tools."
trigger_phrases:
  - "MCP tool surface removal checklist"
  - "118 phase 004 checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-deep-skill-evolution/003-deep-loop-runtime/005-mcp-tool-surface-removal"
    last_updated_at: "2026-05-22T19:55:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored L3 checklist with arch-verify + sign-off"
    next_safe_action: "Await phase 003 shims"
    blockers: ["depends-on:003-script-shim-and-db-relocation"]
    key_files:
      - "spec.md"
      - "tasks.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:1180041180041180041180041180041180041180041180041180041180040003"
      session_id: "118-004-mcp-tool-surface-removal-checklist"
      parent_session_id: null
---
# Verification Checklist: 004 — MCP Tool Surface Removal

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.2 -->

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

- [ ] CHK-001 [P0] Requirements documented in `spec.md`
  - **Evidence**: spec.md contains REQ-001 through REQ-009 with acceptance criteria
- [ ] CHK-002 [P0] Plan and architecture documented in `plan.md`
  - **Evidence**: plan.md sections 3 (architecture) and 4 (phases) describe delete-only surface removal
- [ ] CHK-003 [P0] Phase 003 dependency confirmed
  - **Evidence**: T001 output shows `.cjs` script shims present at `.opencode/skills/deep-loop-runtime/scripts/`
- [ ] CHK-004 [P0] Hidden-consumer scan complete
  - **Evidence**: T002 + T003 grep results classify every `deep_loop_graph_` and `handlers/coverage-graph` reference as in-scope or owned by phases 005 / 006 / 007
- [ ] CHK-005 [P1] Pre-deletion baseline captured
  - **Evidence**: T004 baseline `mcp tools list` output saved to scratch
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `tsc --noEmit` exits 0 after deletions
  - **Evidence**: T018 output
- [ ] CHK-011 [P0] No dangling imports remain in modified files
  - **Evidence**: T015 import-cleanup notes and T016 zero-hit grep
- [ ] CHK-012 [P1] Modified files preserve other tools intact
  - **Evidence**: diff of `tool-schemas.ts`, `schemas/tool-input-schemas.ts`, `tools/index.ts` shows only the four removals plus import cleanup
- [ ] CHK-013 [P1] Edit style matches surrounding code
  - **Evidence**: No spurious whitespace, trailing comma, or formatter regressions in the three edited files
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] MCP server smoke start succeeds
  - **Evidence**: T020 captured stdout shows clean startup, all non-coverage-graph tools register
- [ ] CHK-021 [P0] MCP smoke start 5/5 success (NFR-R01)
  - **Evidence**: T021 logs five successful starts
- [ ] CHK-022 [P0] Tool-list delta = -4 (SC-005)
  - **Evidence**: T022 diff of pre vs post `mcp tools list` shows exactly the four deleted IDs absent and total count dropped by 4
- [ ] CHK-023 [P1] Cross-phase smoke: phase-003 `.cjs` shims still work
  - **Evidence**: T023 captures stdout from invoking each of the four scripts
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-030 [P0] Five handler files deleted (REQ-001)
  - **Evidence**: `ls .opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/` returns no such file/directory
- [ ] CHK-031 [P0] `tool-schemas.ts` clean (REQ-002)
  - **Evidence**: `grep -c "deep_loop_graph_" .opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` returns 0
- [ ] CHK-032 [P0] `schemas/tool-input-schemas.ts` clean (REQ-003)
  - **Evidence**: `grep -c "deep_loop_graph_" .opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` returns 0
- [ ] CHK-033 [P0] `tools/index.ts` clean (REQ-004)
  - **Evidence**: `grep -c "deep_loop_graph_\|coverage-graph/" .opencode/skills/system-spec-kit/mcp_server/tools/index.ts` returns 0
- [ ] CHK-034 [P0] MCP server compiles (REQ-005)
  - **Evidence**: T018 `tsc --noEmit` exit 0
- [ ] CHK-035 [P0] MCP server starts (REQ-006)
  - **Evidence**: T020 + T021 smoke runs
- [ ] CHK-036 [P0] Tool IDs absent from `mcp tools list` (REQ-007)
  - **Evidence**: T022 diff
- [ ] CHK-037 [P1] No leftover `handlers/coverage-graph/` imports anywhere (REQ-008)
  - **Evidence**: T016 zero-hit grep
- [ ] CHK-038 [P1] Phase 003 `.cjs` scripts confirmed present (REQ-009)
  - **Evidence**: T001 listing
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P0] No new exposed handlers, ports, or RPC entry points (NFR-S01)
  - **Evidence**: Delete-only diff inspection; only removals + import cleanup
- [ ] CHK-041 [P1] No secrets, tokens, or credentials touched
  - **Evidence**: None of the deleted files held secrets; `.env`/credential files untouched
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P0] `spec.md`, `plan.md`, `tasks.md` synchronized with final state
  - **Evidence**: T029 updated spec.md Status; plan and tasks describe the executed sequence
- [ ] CHK-051 [P0] `decision-record.md` ADR-001 reflects executed decision
  - **Evidence**: T027 set ADR-001 status: Accepted, five checks 5/5 PASS
- [ ] CHK-052 [P1] `implementation-summary.md` populated with concrete deliverables
  - **Evidence**: T025 + T026 filled `what-built` and `verification` anchors with file paths, diffs, and command outputs
- [ ] CHK-053 [P2] No stale references to deleted tool IDs in any doc inside this packet
  - **Evidence**: grep within `004-mcp-tool-surface-removal/` shows references are framed as "deleted" / "removed" / historical
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P0] All writes stayed inside `004-mcp-tool-surface-removal/` (for spec docs) or the named MCP server paths (for code)
  - **Evidence**: `git diff --stat` for the commit touches only the eight listed paths plus this packet's spec docs
- [ ] CHK-061 [P1] No temp files left in the packet folder
  - **Evidence**: `ls 004-mcp-tool-surface-removal/` contains only the eight scaffolded files (no `.tmp`, `.bak`)
- [ ] CHK-062 [P1] Pre-deletion baseline + raw grep outputs preserved in scratch, not committed inside the packet
  - **Evidence**: Any scratch artifacts saved under `.opencode/skills/system-spec-kit/scratch/` (outside the packet folder)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decision documented in `decision-record.md`
  - **Evidence**: ADR-001 "Complete Removal of 4 MCP Tools (No Backward-Compat Aliases)" fully populated
- [ ] CHK-101 [P0] ADR-001 status: Accepted
  - **Evidence**: T027 confirmation
- [ ] CHK-102 [P0] ADR-001 five checks 5/5 PASS
  - **Evidence**: decision-record.md `### Five Checks Evaluation` table shows 5/5 PASS
- [ ] CHK-103 [P1] Alternatives in ADR-001 documented with rejection rationale
  - **Evidence**: ADR-001 lists three alternatives (aliases, thin wrappers, partial removal) each with rejection reasoning
- [ ] CHK-104 [P1] Architecture diagram in `plan.md` matches executed deletes
  - **Evidence**: plan.md §3 "BEFORE / AFTER" diagram still accurate after implementation
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] MCP cold-start time not regressed (NFR-P01)
  - **Evidence**: T021 captured timings averaged across 5 runs; delta vs baseline is non-positive (deletion should not slow startup)
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented and validated
  - **Evidence**: plan.md `L2: ENHANCED ROLLBACK` section + commit SHA captured for revert
- [ ] CHK-121 [P1] Order constraint with phase 005 + 006 documented
  - **Evidence**: spec.md §6 (R-004) + parent `spec.md` phase-map handoff criteria reference this dependency chain
- [ ] CHK-122 [P2] Build cache hygiene step recorded
  - **Evidence**: T017 `rm -rf dist/` recorded in tasks.md and noted in implementation-summary.md
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] User directive FULL_ISOLATE_NO_MCP honored
  - **Evidence**: ADR-001 cites the directive; no aliases or wrappers introduced
- [ ] CHK-131 [P1] No skipped Gate 3 / scope locks
  - **Evidence**: All writes limited to the eight listed MCP-server paths plus this packet's spec docs
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] `implementation-summary.md` placeholders removed (concrete content in `what-built` + `verification`)
  - **Evidence**: T025 + T026 results
- [ ] CHK-141 [P2] Cross-references between `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md` resolve
  - **Evidence**: Manual cross-check; "RELATED DOCUMENTS" sections point at sibling files
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

- [ ] CHK-150 [P0] Phase 004 strict validate exits 0
  - **Evidence**: T024 output of `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .../004-mcp-tool-surface-removal --strict`
- [ ] CHK-151 [P0] Implementer sign-off
  - **Sign-off**: [Implementer name + date once T029 completes]
- [ ] CHK-152 [P1] Reviewer sign-off
  - **Sign-off**: [Reviewer name + date]
<!-- /ANCHOR:sign-off -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 21 | 0/21 (scaffolded) |
| P1 Items | 18 | 0/18 (scaffolded) |
| P2 Items | 4 | 0/4 (scaffolded) |

**Verification Date**: [to be filled at completion]
**Verified By**: [to be filled at completion]
**ADRs**: 1 (ADR-001) — status: Proposed (scaffold) -> Accepted (on completion)
<!-- /ANCHOR:summary -->
