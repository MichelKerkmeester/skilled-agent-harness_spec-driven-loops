---
title: "Checklist: Doctor Cutover Phase 2 [system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/004-cutover-doctor-router-from-legacy-files/checklist]"
description: "Verification gates and completion criteria for the doctor command hard cutover: deletes, sed correctness, advisor rebuild, file counts, grep gates, and strict validation."
trigger_phrases:
  - "013/005 cutover phase checklist"
  - "doctor hard cutover verification"
  - "doctor stale grep gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/006-operator-tooling/002-doctor-update-orchestrator/004-cutover-doctor-router-from-legacy-files"
    last_updated_at: "2026-05-11T17:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Phase 2 cutover shipped + verified"
    next_safe_action: "Optional: commit + advisor reindex"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-014-002-cutover-phase-2026-05-11"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->"
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Doctor Cutover Phase 2

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## VERIFICATION PROTOCOL

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Hard blocker | Cannot claim done until complete |
| **[P1]** | Required quality gate | Must complete or explicitly document why deferred |
| **[P2]** | Audit support | Can defer only if P0/P1 gates are unaffected |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## PRE-IMPLEMENTATION

- [ ] CHK-001 [P0]: 003-skill-advisor-routing-engine-consolidation static verification table has 7/7 YAML matches.
- [ ] CHK-002 [P0]: `route-validate.sh` exits 0 before cutover.
- [ ] CHK-003 [P0]: `route-validate.sh --self-test` rejects 3/3 bad fixtures.
- [ ] CHK-004 [P0]: 013 parent `children_ids` includes `004-cutover-doctor-router-from-legacy-files`.
- [ ] CHK-005 [P0]: 004-cutover-doctor-router-from-legacy-files has full Level 2 doc set.
- [ ] CHK-006 [P0]: 004-cutover-doctor-router-from-legacy-files passes strict validation before destructive deletes.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## CODE QUALITY

### Deletes

- [ ] CHK-101 [P0]: 9 old `.opencode/commands/doctor/*.md` files are deleted.
- [ ] CHK-102 [P0]: `.opencode/commands/doctor/mcp.md` remains.
- [ ] CHK-103 [P0]: `.opencode/commands/doctor/update.md` remains.
- [ ] CHK-104 [P0]: 9 old `.gemini/commands/doctor/*.toml` files are deleted.
- [ ] CHK-105 [P0]: `.gemini/commands/doctor/mcp.toml` remains.
- [ ] CHK-106 [P1]: `.gemini/commands/doctor/update.toml` remains if it existed before cutover.

### Sed Correctness

- [ ] CHK-201 [P0]: `/doctor:mcp_debug` becomes `/doctor:mcp debug`.
- [ ] CHK-202 [P0]: `/doctor:mcp_install` becomes `/doctor:mcp install`.
- [ ] CHK-203 [P0]: `/doctor:memory` becomes `/doctor memory`.
- [ ] CHK-204 [P0]: `/doctor:causal-graph` becomes `/doctor causal-graph`.
- [ ] CHK-205 [P0]: `/doctor:code-graph` becomes `/doctor code-graph`.
- [ ] CHK-206 [P0]: `/doctor:deep-loop` becomes `/doctor deep-loop`.
- [ ] CHK-207 [P0]: `/doctor:cocoindex` becomes `/doctor cocoindex`.
- [ ] CHK-208 [P0]: `/doctor:skill-advisor` becomes `/doctor skill-advisor`.
- [ ] CHK-209 [P0]: `/doctor:skill-budget` becomes `/doctor skill-budget`.
- [ ] CHK-210 [P0]: `/doctor:mcp`, `/doctor:update`, and `/doctor:mcp-*` are not accidentally rewritten.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## TESTING

- [ ] CHK-301 [P0]: `route-validate.sh` passes after deletes.
- [ ] CHK-302 [P0]: Sandbox harness `.sh` files all pass `bash -n`.
- [ ] CHK-303 [P0]: Case-insensitive stale invocation grep returns zero non-archival matches.
- [ ] CHK-304 [P0]: `.opencode/commands/doctor/` markdown file count gate passes.
- [ ] CHK-305 [P0]: `.opencode/commands/doctor/assets/` YAML count remains 10.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX COMPLETENESS

- [ ] CHK-401 [P0]: Manual playbook 23 scenario directory has no stale old-name invocations.
- [ ] CHK-402 [P0]: Sandbox wrapper and harness scripts have no stale old-name invocations.
- [ ] CHK-403 [P1]: 013 historical docs have `Superseded By` metadata rows.
- [ ] CHK-404 [P1]: 013 historical docs no longer show stale invocation examples.
- [ ] CHK-405 [P0]: Final inventory report lists shipped Phase 1 files, deleted Phase 2 files, updated references, and final state.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## SECURITY

- [ ] CHK-501 [P0]: Advisor rebuild runs after deleting legacy command descriptions.
- [ ] CHK-502 [P1]: No deleted command descriptions remain discoverable through local command files.
- [ ] CHK-503 [P1]: No accidental broad filesystem delete happened outside the 9 named `.opencode` and 9 named `.gemini` files.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## DOCUMENTATION

- [ ] CHK-601 [P0]: 002 packet docs strict-validate with zero errors and warnings.
- [ ] CHK-602 [P0]: 003-skill-advisor-routing-engine-consolidation strict-validates after completion metadata update.
- [ ] CHK-603 [P0]: 013 parent strict-validates after child metadata update.
- [ ] CHK-604 [P1]: `implementation-summary.md` records final evidence.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## FILE ORGANIZATION

- [ ] CHK-701 [P0]: No `.bak`, `.old`, `.orig`, `.deprecated`, or `_archive` files are created.
- [ ] CHK-702 [P0]: `.codex` command path is not separately edited.
- [ ] CHK-703 [P0]: `.claude` is only manually touched if auto-sync verification fails.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## VERIFICATION SUMMARY

| Gate | Status | Evidence |
|------|--------|----------|
| Strict validation | Pending | Run after implementation |
| Route validation | Pending | Run after deletes |
| Grep gate | Pending | Run after all sed passes |
| File counts | Pending | Run after deletes |
| Sandbox syntax | Pending | Run after sandbox rewrite |
<!-- /ANCHOR:summary -->
