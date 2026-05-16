---
title: "Verification Checklist: 043 Suite Revalidation"
description: "Verification checklist and evidence for post-wave scenarios 401-415."
trigger_phrases:
  - "043 checklist"
  - "suite revalidation verification"
  - "post-wave scenario verification"
importance_tier: "critical"
contextType: "spec"
status: "fail"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-migration/_044-suite-revalidation"
    last_updated_at: "2026-05-14T16:35:00Z"
    last_updated_by: "main-agent"
    recent_action: "Filled verification evidence for failed nested codex startup"
    next_safe_action: "Rerun the suite outside the current nested Codex sandbox limitation"
    blockers:
      - "All child codex exec runs fail before scenario logic with app-server initialization permission error"
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000043"
      session_id: "_044-suite-revalidation-checklist"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: 043 Suite Revalidation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR document evidence-backed deferral |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md`. Evidence: packet spec created from Level 2 template.
- [x] CHK-002 [P0] Technical approach defined in `plan.md`. Evidence: sequential `codex exec` runner plan documented.
- [x] CHK-003 [P1] Dependencies identified. Evidence: Codex CLI, Spec Kit Memory MCP, CocoIndex MCP, playbook, and baseline TSV listed.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Runner script created and executable. Evidence: `_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14-post-wave.sh` and `bash -n` pass.
- [x] CHK-011 [P0] Runner writes one TSV header and scenario rows. Evidence: `run-2026-05-14-post-wave.summary.tsv` has 15 data rows.
- [x] CHK-012 [P1] Runner handles missing scenario files and missing final verdict lines. Evidence: script records SKIP for missing files and controlled FAIL for missing verdicts.
- [x] CHK-013 [P1] Runner includes per-scenario timeout handling. Evidence: `SCENARIO_TIMEOUT_SECONDS` watchdog in runner.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All 15 scenarios attempted or explicitly skipped. Evidence: summary TSV has rows 401-415.
- [x] CHK-021 [P0] Verdict distribution computed. Evidence: 0 PASS / 0 PARTIAL / 15 FAIL / 0 SKIP.
- [x] CHK-022 [P1] Baseline-vs-post-wave table documented. Evidence: `implementation-summary.md`.
- [x] CHK-023 [P1] Raw per-scenario logs retained. Evidence: `per-scenario-logs-post-wave/401.log` through `415.log`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class identified as `matrix/evidence`: this packet validates substrate outcomes rather than changing source.
- [x] CHK-FIX-002 [P0] Same-class producer inventory not applicable because substrate source is read-only in this packet.
- [x] CHK-FIX-003 [P0] Consumer inventory not applicable because no public helper, policy, schema, or response field changes.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction adversarial table not applicable to validation-only shell runner.
- [x] CHK-FIX-005 [P1] Matrix axes listed: scenarios 401-415, verdict, key metric, detail, baseline delta, substrate explanation.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant not applicable; runner uses fresh child processes and records tool availability failures.
- [x] CHK-FIX-007 [P1] Evidence pinned to explicit paths and logs. Evidence: summary TSV plus per-scenario logs under `_sandbox/24--local-llm-query-intelligence/evidence/`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: packet docs contain no credentials.
- [x] CHK-031 [P0] Playbook scenarios remain read-only. Evidence: scope lock documented.
- [x] CHK-032 [P1] No substrate source changes. Evidence: scope lock documented.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/checklist initialized.
- [x] CHK-041 [P1] Implementation summary includes baseline delta table. Evidence: `implementation-summary.md`.
- [x] CHK-042 [P2] Final binding trace fields are recoverable from docs and evidence. Evidence: implementation summary and TSV.
- [x] CHK-043 [P1] Strict packet validation passes. Evidence: `validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-migration/_044-suite-revalidation --strict` returned `RESULT: PASSED`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Packet files live under the requested 043 phase folder.
- [x] CHK-051 [P1] Evidence files live under `_sandbox/24--local-llm-query-intelligence/evidence/`. Evidence: runner, summary TSV, and per-scenario logs are all under that directory.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 14 | 14/14 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-05-14
<!-- /ANCHOR:summary -->
