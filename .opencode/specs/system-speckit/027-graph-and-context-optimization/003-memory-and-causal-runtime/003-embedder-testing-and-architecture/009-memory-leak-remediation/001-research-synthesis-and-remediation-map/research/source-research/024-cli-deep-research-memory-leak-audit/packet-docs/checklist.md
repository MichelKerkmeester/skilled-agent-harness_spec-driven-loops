---
title: "Verification Checklist: 024 CLI Deep Research Memory Leak Audit"
description: "Checklist for validating setup, iteration artifacts, process cleanup, memory telemetry, and final synthesis for the 024 memory-leak deep-research packet."
trigger_phrases:
  - "024 CLI memory leak checklist"
  - "memory leak research verification"
importance_tier: "critical"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/024-cli-deep-research-memory-leak-audit/packet-docs"
    last_updated_at: "2026-05-22T07:20:00Z"
    last_updated_by: "opencode"
    recent_action: "Updated verification checklist after continuation synthesis."
    next_safe_action: "Run strict packet validation, then open the first remediation packet."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0240240240240240240240240240240240240240240240240240240240240240"
      session_id: "024-cli-memory-leak-audit-intake"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: 024 CLI Deep Research Memory Leak Audit

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim research complete until satisfied or halted for documented safety. |
| **[P1]** | Required | Must complete or receive operator-approved deferral. |
| **[P2]** | Optional | Can defer with documented reason. |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md`. Evidence: `spec.md` sections 2-5 define problem, scope, requirements, and success criteria.
- [x] CHK-002 [P0] Technical approach defined in `plan.md`. Evidence: `plan.md` sections 2-4 define quality gates, architecture, and execution phases.
- [x] CHK-003 [P1] Dependencies identified. Evidence: `plan.md` section 6 lists CLI, model, workflow, and telemetry dependencies.
- [x] CHK-004 [P0] Claude Code CLI auth and Opus model availability confirmed before lane A. Evidence: iterations 001-005 completed with `cli-claude-code` metadata.
- [x] CHK-005 [P0] Codex CLI auth and GPT-5.5 xhigh fast availability confirmed before and during lane B. Evidence: iterations 006-015 completed with `cli-codex` metadata.
- [x] CHK-006 [P0] Initial `sysctl vm.swapusage` and `vm_stat` captured before lane A. Evidence: pre-run swap output and subsequent native telemetry in `research/logs/iteration-007-runtime-measurement.json`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Each iteration writes non-empty markdown and a valid JSONL delta. Evidence: `research/iterations/iteration-001.md` through `iteration-015.md`, `research/deltas/iter-001.jsonl` through `iter-015.jsonl`, reducer `iterationsCompleted: 15`, `corruptionCount: 0`.
- [x] CHK-011 [P0] Every P0/P1 finding cites file-line evidence and a process or memory lifecycle boundary. Evidence: `research/research.md` final matrix and remediation packet order.
- [x] CHK-012 [P1] Findings distinguish orphan processes, retained caches, daemon lifecycle bugs, stale locks, and kernel/swap pressure. Evidence: `research/research.md` sections Final Findings Summary and Measurement Notes.
- [x] CHK-013 [P1] Findings preserve lane attribution and disagreement notes when Claude Code and Codex differ. Evidence: iteration metadata in `research/deep-research-state.jsonl` and downgrade notes in `research/research.md`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Five Claude Code iterations completed or halted with documented safety reason. Evidence: `research/iterations/iteration-001.md` through `iteration-005.md`.
- [x] CHK-021 [P0] Ten Codex iterations completed or halted with documented safety reason. Evidence: `research/iterations/iteration-006.md` through `iteration-015.md`.
- [x] CHK-022 [P0] Cleanup checks and unresolved process boundaries are documented after the run. Evidence: `research/research.md` Measurement Notes and continuation readiness matrix assign unresolved helpers to `mcp-host-session-process-sweep`; this is not a no-orphan claim.
- [x] CHK-023 [P1] Memory telemetry and telemetry gaps are documented. Evidence: pre-run and pre-continuation `sysctl vm.swapusage`/`vm_stat` snapshots plus `research/logs/iteration-007-runtime-measurement.json`; sandbox and command-collision gaps are recorded in `research/research.md`.
- [x] CHK-024 [P1] Final synthesis includes follow-up verification commands for every P0/P1 finding. Evidence: `research/research.md` Remediation Packet Order.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a packet class, severity, and verification boundary. Evidence: `research/research.md` Final F-ID Matrix and continuation readiness matrix.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed or scoped as follow-up fixture design. Evidence: `research/research.md` groups findings by daemon cancel, background task, launcher ownership, sidecar, registry cache, adapter, and read-path classes.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for research scope; no changed helpers, policies, schema fields, response fields, docs, or tests exist in this research-only packet. Evidence: `research/research.md` Non-Goals.
- [x] CHK-FIX-004 [P1] Process cleanup follow-up fixes include adversarial timeout, parent-exit, child-orphan, stale-lock, and sidecar-survival cases. Evidence: `research/research.md` continuation readiness matrix and process-sweep requirements.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before implementation completion is claimed in follow-up packets. Evidence: `research/research.md` Final F-ID Matrix includes F-001 through F-027 plus M-006/M-007 rows.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variants are assigned to follow-up implementation tests where process-wide state is read. Evidence: code-graph launcher and process-sweep readiness rows require env/DB-dir, `EPERM`, orphan, and ownership fixtures.
- [x] CHK-FIX-007 [P1] Evidence is pinned to generated research artifact paths rather than fix SHAs because this packet made no fixes. Evidence: `research/research.md` References and iteration artifacts 001-015.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets are pasted into CLI prompts or research artifacts. Evidence: prompts and final synthesis contain no API keys or tokens.
- [x] CHK-031 [P1] CLI auth status is summarized without exposing tokens or account details. Evidence: checklist and final report reference successful dispatches only.
- [x] CHK-032 [P1] Follow-up findings account for command injection and unsafe kill-pattern risks where shell commands are proposed. Evidence: `mcp-host-session-process-sweep` requires dry-run and current-PID safety gates.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, and tasks synchronized for the research charter. Evidence: all three docs name the same two-lane execution plan.
- [x] CHK-041 [P1] Final research synthesis updates `implementation-summary.md`. Evidence: implementation summary now records 15/15 iterations and final synthesis addendum.
- [x] CHK-042 [P2] Parent packet references are reviewed. Evidence: no parent child-map refresh was requested; current packet metadata is self-contained in `description.json` and `graph-metadata.json`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temporary files stay in `scratch/` or deep-research-owned `research/` subdirectories. Evidence: logs and iteration outputs are under this packet's `research/` tree.
- [x] CHK-051 [P1] `scratch/` cleaned or documented before completion. Evidence: no scratch artifacts were created for this run.
- [x] CHK-052 [P1] Deep-research artifacts remain under this packet, not a sibling or parent phase. Evidence: `research/resource-map.md` enumerates local artifacts.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in `decision-record.md`. Evidence: ADR-001 and ADR-002 define executor split and memory-pressure interpretation.
- [x] CHK-101 [P1] All final ADR statuses reviewed after research synthesis. Evidence: ADR-001 and ADR-002 statuses are Accepted.
- [x] CHK-102 [P1] Alternatives documented with rejection rationale. Evidence: `decision-record.md` alternatives tables.
- [x] CHK-103 [P2] Migration path documented if deep-research recommends workflow-level cleanup changes. Evidence: `research/research.md` remediation packet order and dependencies.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] Swap, free-page, and process-count telemetry captured where available and gaps documented. Evidence: pre-run/pre-continuation telemetry plus `research/logs/iteration-007-runtime-measurement.json`; sandbox-denied and command-collision gaps are explicit in the final synthesis.
- [x] CHK-111 [P1] Halt thresholds evaluated or explicitly overridden between iteration lanes. Evidence: user explicitly overrode high-swap blockers; final report keeps telemetry gaps as follow-up verification gates.
- [x] CHK-112 [P2] Clean reboot baseline considered if user-process cleanup cannot explain wired/swap pressure. Evidence: `research/research.md` Measurement Notes and remaining verification gates.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: DEPLOYMENT READINESS

- [x] CHK-120 [P0] No implementation is shipped from this research packet. Evidence: final synthesis states no target skill source files were edited.
- [x] CHK-121 [P1] Follow-up remediation packets must define rollback procedures before fixes begin. Evidence: `research/research.md` continuation addendum names each packet's first verification gate and leaves implementation to new packets.
- [x] CHK-122 [P1] Operator runbook updates are proposed if the research confirms cleanup gaps. Evidence: `mcp-host-session-process-sweep` and `rerank-sidecar-lifecycle` packet drafts.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Research prompt content reviewed for secrets before CLI dispatch. Evidence: dispatch prompts were constructed from repo paths and state artifacts, not credentials.
- [x] CHK-131 [P1] Findings avoid publishing tokens or machine-private identifiers in final report surfaces. Evidence: `research/research.md` uses relative repository paths and process classes; no credentials are present.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All spec documents synchronized after final research synthesis. Evidence: spec, plan, tasks, checklist, decision record, implementation summary, and resource maps updated.
- [x] CHK-141 [P1] `research/research.md` links back to this spec and its decisions. Evidence: final synthesis References include `../spec.md` and `../decision-record.md`.
- [x] CHK-142 [P2] Resource map emitted or explicitly disabled by deep-research config. Evidence: `research/resource-map.md` created.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Packet owner | Pending | 2026-05-22 |
| Maintainer | Technical reviewer | Pending | 2026-05-22 |
<!-- /ANCHOR:sign-off -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 25 | 25/25 |
| P2 Items | 4 | 4/4 |

**Verification Date**: 2026-05-22
<!-- /ANCHOR:summary -->
