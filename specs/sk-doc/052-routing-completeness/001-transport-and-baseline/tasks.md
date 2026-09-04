---
title: "Tasks: Phase 1: transport-and-baseline"
description: "Every task this phase ran, marked done with the evidence that settles it: a command and its output, a file and line, or a commit."
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/052-routing-completeness/001-transport-and-baseline"
    last_updated_at: "2026-09-02T19:56:10Z"
    last_updated_by: "claude-code"
    recent_action: "Marked every task done with its observed evidence"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files:
      - "research/transport-finding.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-052-001-transport-and-baseline"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: transport-and-baseline

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Locate the advisor recommend handler and read its scorer import (`.opencode/skills/system-skill-advisor/mcp-server/handlers/advisor-recommend.ts`). Evidence: line 13 imports `scoreAdvisorPrompt` from `../lib/scorer/fusion.js`.
- [x] T002 Identify the handler's only fallback (`.opencode/skills/system-skill-advisor/hooks/lib/`). Evidence: `skill-advisor-cli-fallback.ts` is the sole fallback, and it speaks the same tool surface over the daemon socket.
- [x] T003 [P] Search the hook library for a Python invocation. Evidence: `grep -rn "skill_advisor.py" .opencode/skills/system-skill-advisor/hooks/lib/` exits 1 with no output.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Record the dispatch-path read as a citable finding (`research/transport-finding.md`). Evidence: created in `03f5db4876`, 65 lines.
- [x] T005 Record the confidence-floor rule, that 0.8200 is the floor for anything surfaced and `score` is the discriminator. Evidence: across the 381 declared-signal replies re-measured on 2026-09-02, 555 recommendations carry a minimum confidence of exactly 0.82, 166 sit exactly at the floor, and the lowest score among those floor rows is 0.10213.
- [x] T006 Record the rank rule, that rank is the returned array order. Evidence: `fusion.ts:749` sorts on `score` plus command, intent and conflict adjustments the reply does not expose.
- [x] T007 Repoint the Gate 2 manual fallback at the daemon CLI (`AGENTS.md`). Evidence: `4e66155b6c`, 2 insertions and 2 deletions.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Probe the daemon on a live prompt and read the reply shape. Evidence: `node .opencode/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"dqi score"}' --format json --timeout-ms 60000` exits 0 and returns an empty `recommendations` array, which is a real answer rather than an error.
- [x] T009 Test the cold-start edge case for the new gate text. Evidence: the daemon was stopped, one CLI call self-started it, and it answered from the same scorer the hook consults.
- [x] T010 Update the phase documents so `spec.md`, `plan.md` and `tasks.md` describe the work as executed. Evidence: this document set, validated with `validate.sh --strict`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

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

- [x] CHK-001 [P0] Requirements documented in spec.md. REQ-001 through REQ-003 map to AC-001 through AC-003.
- [x] CHK-002 [P0] Technical approach defined in plan.md, section 3.
- [x] CHK-003 [P1] Dependencies identified and available. The daemon answered every call.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks. Not applicable, since the phase adds no code.
- [x] CHK-011 [P0] No console errors or warnings. Every CLI call exited 0.
- [x] CHK-012 [P1] Error handling implemented. Exit status is read from a file rather than through a pipe.
- [x] CHK-013 [P1] Code follows project patterns. Not applicable.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. AC-001, AC-002 and AC-003 read Met with observed evidence.
- [x] CHK-021 [P0] Manual testing complete. Four verification commands run and their output read.
- [x] CHK-022 [P1] Edge cases tested. Cold daemon, and an empty recommendations array.
- [x] CHK-023 [P1] Error scenarios validated. A missing daemon self-starts rather than failing the call.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class. The Gate 2 fallback line is `instance-only`, proven by grep.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. `rg -n 'skill_advisor.py'` shows one caller outside its own directory, a validation handler off the routing path.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. The changed surface is two lines of instruction text with no code consumer.
- [x] CHK-FIX-004 [P0] Adversarial table tests. Not applicable, since no path, parser or redaction code changed.
- [x] CHK-FIX-005 [P1] Matrix axes and row count listed. Three transports by three claims, in plan.md.
- [x] CHK-FIX-006 [P1] Hostile env variant executed. The cold-daemon case stands in for it.
- [x] CHK-FIX-007 [P1] Evidence pinned to a fix SHA. `03f5db4876` and `4e66155b6c`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. The documents carry no credentials.
- [x] CHK-031 [P0] Input validation implemented. Not applicable.
- [x] CHK-032 [P1] Auth/authz working correctly. No trusted-context flag was needed, since no mutation command ran.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. All three describe the work as executed.
- [x] CHK-041 [P1] Code comments adequate. Not applicable.
- [x] CHK-042 [P2] README updated. Not applicable.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. The sweep output lived outside the packet entirely.
- [x] CHK-051 [P1] scratch/ cleaned before completion. It holds only `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 13 | 13/13 |
| P2 Items | 4 | 4/4 |

**Verification Date**: 2026-09-02
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented. ADR-001 sits in plan.md, since this phase has no separate decision record.
- [x] CHK-101 [P1] All ADRs have status. ADR-001 is Accepted.
- [x] CHK-102 [P1] Alternatives documented with rejection rationale. Output comparison was rejected and the reason recorded.
- [x] CHK-103 [P2] Migration path documented. Not applicable.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] Response time targets met (NFR-P01). A cold call returned in 6.8 seconds against a 60 second timeout.
- [x] CHK-111 [P1] Throughput targets met. Not applicable to this phase.
- [x] CHK-112 [P2] Load testing completed. Not applicable.
- [x] CHK-113 [P2] Performance benchmarks documented. Not applicable.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback procedure documented and tested. `git revert 4e66155b6c` is the whole procedure.
- [x] CHK-121 [P0] Feature flag configured. Not applicable.
- [x] CHK-122 [P1] Monitoring/alerting configured. Not applicable.
- [x] CHK-123 [P1] Runbook created. The verification commands in plan.md section 5 serve as one.
- [x] CHK-124 [P2] Deployment runbook reviewed. Not applicable.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] Security review completed. The change is one instruction line with no runtime effect.
- [x] CHK-131 [P1] Dependency licenses compatible. No dependency was added.
- [x] CHK-132 [P2] OWASP Top 10 checklist completed. Not applicable.
- [x] CHK-133 [P2] Data handling compliant with requirements. Only local repository files were read.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] All spec documents synchronized. spec.md, plan.md, tasks.md and acceptance-criteria.md agree on Complete.
- [x] CHK-141 [P1] API documentation complete. Not applicable.
- [x] CHK-142 [P2] User-facing documentation updated. The Gate 2 line in `AGENTS.md` is the user-facing surface, and it changed.
- [x] CHK-143 [P2] Knowledge transfer documented. `research/transport-finding.md` carries it.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Not applicable | Technical Lead | [ ] Approved | |
| Not applicable | Product Owner | [ ] Approved | |
| Not applicable | QA Lead | [ ] Approved | |

This phase ran as a single-operator documentation and measurement change, so no separate
approver signed it off. The evidence rows above carry the verification instead.
<!-- /ANCHOR:sign-off -->
