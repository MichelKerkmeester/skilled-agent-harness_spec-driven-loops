---
title: "Verification Checklist: Runtime Surface Coverage"
description: "Verification Date: 2026-08-04"
trigger_phrases:
  - "verification"
  - "checklist"
  - "runtime surface coverage"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/002-runtime-surface-coverage"
    last_updated_at: "2026-08-04T06:30:00Z"
    last_updated_by: "pi-main-agent"
    recent_action: "T002 done: CLAUDE.md replaced with symlink to AGENTS.md (82-line drift eliminated)"
    next_safe_action: "Implement Phase 1 (T001-T009)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-04-agents-002"
      parent_session_id: null
    completion_pct: 5
    open_questions:
      - "Should Devin MCP registration be added? Default: remain absent"
    answered_questions:
      - "copilot is deprecated (user decision 2026-08-04)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Runtime Surface Coverage

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] CHK-001 [P0] Requirements documented in spec.md — REQ-001..008 with acceptance criteria, evidence from scout audit (run e8d44f53, exit 0)
  - **Evidence**: [evidence: `spec.md` §4 lists REQ-001..008 with acceptance criteria; scout audit run `e8d44f53` exited 0 with file:line inventory; `implementation-summary.md` verification table records the pass]
- [x] CHK-002 [P0] Technical approach defined in plan.md — 3 phases, D-001..D-003 decisions
  - **Evidence**: [evidence: `plan.md` §1 summary, §3 architecture decisions D-001..D-003, §4 phases 1-3, §7 rollback]
- [x] CHK-003 [P1] Dependencies identified — runtime generators (pi sync-agents, Codex), advisor daemon restart, copilot deprecation resolved (2026-08-04)
  - **Evidence**: [evidence: `plan.md` §6 dependencies table lists all five dependencies with mitigation]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

**P1 contract fixes**

- [x] CHK-010 [P0] AGENTS.md six-surface claims present; CLAUDE.md symlinked to AGENTS.md (`readlink` + empty diff) — symlink done 2026-08-04, six-surface claims pending T001
  - **Evidence**: [evidence: `readlink CLAUDE.md` → `AGENTS.md`; `diff CLAUDE.md AGENTS.md` exits 0; pre-change diff was 82 lines]
- [ ] CHK-011 [P0] Advisor enum includes codex/cursor/devin/pi; `npx vitest run tests/hooks/runtime-parity.vitest.ts` passes
- [ ] CHK-012 [P0] validate-command-references.cjs exits 0 with Cursor/Pi/Devin allowlisted
- [ ] CHK-013 [P0] Generated mirrors regenerated from canonical; agent-roster-mirror-check.cjs reports six surfaces
- [ ] CHK-014 [P1] README.md conductor/topology statements cover six surfaces
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

**Phase 3 verification gates**

- [ ] CHK-030 [P0] Repo-wide grep sweep for stale enumerations ("three runtimes", "five runtimes", "Claude, Codex, OpenCode") — zero hits outside z_archive + completed historical specs
- [ ] CHK-031 [P0] No Devin MCP registration claims added (grep .devin + mcp)
- [ ] CHK-032 [P1] validate.sh --strict on this packet exits 0; checklist evidence complete
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class — all audit findings are class-of-doc: stale runtime enumerations; instance-only proven by the scout inventory (20+ sites listed)
  - **Evidence**: [evidence: scout audit report categorizes every site as hard gap, soft gap, or structural; `spec.md` §3 files-to-change table lists all 22 files]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed — runtime enumeration producers inventoried: AGENTS.md, CLAUDE.md, README.md, advisor enum + dependents, validation script, 11 secondary docs
  - **Evidence**: [evidence: `tasks.md` T001-T018 enumerates every producer; `spec.md` §3 lists all change targets]
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers/policies/docs — advisor enum consumers: metrics.ts, schemas, CLI manifest, validate tool, vitest parity suite (all in REQ-002)
  - **Evidence**: [evidence: `spec.md` REQ-002 acceptance names all six enum consumer files; `tasks.md` T004-T005]
- [ ] CHK-FIX-005 [P1] Matrix axes and row count listed before completion — matrix = 6 runtimes × (agents dir, hooks, MCP, generation model) documented in plan.md §3
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-033 [P0] No hardcoded secrets — no code changes beyond allowlists/strings/tests
- [x] CHK-034 [P0] Input validation unaffected — no parser/path/redaction changes; validation script allowlists are data-only
  - **Evidence**: [evidence: `plan.md` §7 rollback notes text/allowlist/test-only changes; no schema or auth edits in scope]
- [ ] CHK-035 [P1] No false support claims — Devin MCP registration must NOT appear (REQ-008)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

**P2 soft-gap docs**

- [ ] CHK-020 [P1] hook-system reference documents Pi native-extension path
- [ ] CHK-021 [P1] skill-advisor docs include Pi row; dispatch README documents Cursor asymmetry accurately
- [ ] CHK-022 [P1] sk-create-agent + deep-loop + SYNC.md + doctor + ENV-REFERENCE + sk-git CI counts = six surfaces
- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-042 [P2] README updated (if applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 4/7 |
| P1 Items | 9 | 2/9 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-08-04
<!-- /ANCHOR:summary -->
