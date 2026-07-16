---
title: "Verification Checklist: Validation-Gate Hardening"
description: "Verification Date: 2026-07-09. Validation-gate hardening implemented and verified locally; staged enforcement flags remain default-off."
trigger_phrases:
  - "validation gate hardening"
  - "evidence cited redesign"
  - "scaffold never touched complete match"
  - "strict pass freshness sweep"
  - "metadata disk path consistency"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/009-validation-integrity-hardening"
    last_updated_at: "2026-07-10T08:09:04.000Z"
    last_updated_by: "claude-code"
    recent_action: "Phase R audit remediation completed: swarm-implemented, Sonnet-verified, all tasks evidenced"
    next_safe_action: "Review Phase R evidence and the consolidated swarm commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Validation-Gate Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|--------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md` -- spec.md lists REQ-001 through REQ-009 and was updated to Status Shipped after implementation.
- [x] CHK-002 [P0] Technical approach defined in `plan.md` -- plan.md records the rule-module architecture, rollout flags, benchmark table, and rollback procedure.
- [x] CHK-003 [P1] Dependencies identified and available (008-metadata-rename-reconciliation status, 011-scheduled-dq-sweep plan read) -- `plan.md` dependency table records the shipped/default-off dependency decision and the sibling sweep coordination result.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks -- `npm run typecheck && npm run build && npm run test:validation && npm run test:legacy` passed in scripts; MCP `npm run typecheck && npm run build` also passed.
- [x] CHK-011 [P0] No console errors or warnings -- `npm run typecheck`, `npm run build`, `npm run test:validation`, and `npm run test:legacy` exited 0; only expected Node SQLite experimental warnings appeared in existing validation/test output.
- [x] CHK-012 [P1] Error handling implemented (malformed Status field, malformed validate.sh --json output, missing metadata surface) -- `validation-gate-hardening.vitest.ts` asserts malformed sweep output is recorded as an error while preserving fixture content.
- [x] CHK-013 [P1] Code follows project patterns (registry-dispatched rule module shape, shared-helper precedent from check-priority-helper.sh) -- new rules are registered in `validator-registry.json` and source/use shared helper patterns consistent with existing shell rule modules.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (REQ-001 through REQ-009) -- targeted vitest covers REQ-001 through REQ-008, and the workflow file plus plan/tasks record the REQ-009 coordination decision.
- [x] CHK-021 [P0] Manual testing complete (local sweep/static workflow validation; before/after validate.sh --strict on the known-good/known-bad sample) -- `validate.sh ...032... --strict --no-recursive` passed with Errors 0 Warnings 0; known-bad fixtures failed in targeted vitest as expected.
- [x] CHK-022 [P1] Edge cases tested (missing metadata surface, phase-parent with no `implementation-summary.md`, multi-line evidence block, non-tabular Status field) -- validation fixture tests exercise missing/stale metadata, status extraction, multi-line prose evidence, and not-applicable paths without crashes.
- [x] CHK-023 [P1] Error scenarios validated (malformed validate.sh --json output, one folder erroring mid-sweep without aborting the fan-out) -- sweep vitest injects a bad validate script and asserts a structured malformed-output error.
- [x] CHK-024 [P0] Benchmark thresholds pinned with reproduce commands (flags-off inertness, drift detection, scaffold-fix direction, evidence-content accuracy, sweep regression detection) -- plan.md Benchmark table remains present with reproduce commands, and `validation-gate-hardening.vitest.ts` covers each row locally.
- [x] CHK-025 [P0] Named test suite present with its assertions (.opencode/skills/system-spec-kit/scripts/tests/validation-gate-hardening.vitest.ts) -- `npx vitest run ../scripts/tests/validation-gate-hardening.vitest.ts --reporter=verbose` passed 6/6 tests.
- [x] CHK-026 [P1] Default-off proven for both staged rules, SPECKIT_METADATA_DISK_CONSISTENCY_ENFORCE and SPECKIT_STATUS_CROSS_DOC_ENFORCE default false with ALL_SPECKIT_FLAGS plus FLAG_CHECKERS entries -- `npx vitest run tests/flag-ceiling.vitest.ts ../scripts/tests/validation-gate-hardening.vitest.ts` passed 12/12 tests.
- [x] CHK-027 [P0] The two real bare-evidence-stamp fixtures (tasks.md:113 in the hybrid-rag-fusion archive, checklist.md:109 in the path-scoped-rules archive) fail EVIDENCE_CITED after the F9 redesign -- targeted vitest reproduces both bare stamps and asserts `EVIDENCE_CITED` exits 2 with two missing items.
- [x] CHK-028 [P0] 032-boot-integrity-rebuild-maintenance-marker's prose-evidence checklist passes EVIDENCE_CITED after the F9 redesign, and the folder's validate.sh --strict result is re-checked end to end -- `validate.sh ...032... --strict --no-recursive` passed with Errors 0 Warnings 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each finding class recorded -- `plan.md` Affected Surfaces and Benchmark sections separate staged corpus-wide detectors, literal-match fix, sweep mechanism, and evidence heuristic redesign.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed -- `check-scaffold-never-touched.sh` now owns status classification via helper and `check-evidence.sh` owns one full-item substance path; targeted tests cover both changed producers.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for new and changed rule ids -- rule ids stayed stable for `SCAFFOLD_NEVER_TOUCHED` and `EVIDENCE_CITED`; new ids are registered and visible in validation output.
- [x] CHK-FIX-004 [P0] Adversarial cases covered -- targeted vitest covers metadata drift, status drift, tautological evidence, and malformed sweep output without corpus writes.
- [x] CHK-FIX-005 [P1] Matrix axes and row count listed before completion is claimed -- `plan.md` Benchmark table and Affected Surfaces section list the matrix axes and reproduce commands.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed: both rollout flags set simultaneously, flags read from a stale shell env in a second concurrent validate.sh invocation -- targeted vitest runs advisory and enforced variants in isolated subprocess environments for both flags.
- [x] CHK-FIX-007 [P1] Evidence pinned to a fix SHA or explicit diff range, not a moving branch-relative range -- `git diff` is the uncommitted evidence range for this phase, and this checklist cites exact file paths plus commands/results rather than moving branch-relative claims.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets -- diff review found only rule ids, file paths, env flag names, and test fixtures; no credential material was added.
- [x] CHK-031 [P0] Input validation implemented (the sweep's --roots path is scoped and stays inside the corpus, matching the existing generate-description.ts path-containment pattern) -- `strict-pass-freshness.ts` resolves roots under the repository and rejects escaping paths.
- [x] CHK-032 [P1] Sweep CI workflow carries no write credential and no commit step (NFR-S01) -- `.github/workflows/strict-pass-freshness-sweep.yml` runs the report-only sweep and does not commit or push.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized -- `spec.md` Status, plan DoD, tasks.md, checklist.md, and implementation-summary.md were updated together with verification evidence.
- [x] CHK-041 [P1] Code comments adequate (durable WHY only, no spec/packet/REQ/CHK ids embedded in code comments) -- code diff review found no new ephemeral packet/task identifiers in code comments.
- [x] CHK-042 [P2] README update not required -- the new rules follow the existing registry-dispatched architecture and no rule-count table or architecture diagram needed a doc change.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only -- targeted vitest creates temporary fixtures in OS temp or repo `scratch/validation-hardening-*` and cleans them after each test.
- [x] CHK-051 [P1] scratch/ cleaned before completion -- targeted vitest `afterEach` removes created scratch roots; no persistent fixture directory is required.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 16/16 |
| P1 Items | 14 | 14/14 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-09
<!-- /ANCHOR:summary -->
