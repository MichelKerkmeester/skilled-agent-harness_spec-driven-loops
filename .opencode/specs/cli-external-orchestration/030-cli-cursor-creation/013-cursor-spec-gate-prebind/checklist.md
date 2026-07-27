---
title: "Verification Checklist: Cursor session-start spec-gate prebinding"
description: "Evidence gate for startup state safety, child exemptions, Cursor wiring, and packet consistency."
trigger_phrases:
  - "Cursor prebind verification"
  - "Cursor Gate-3 checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/013-cursor-spec-gate-prebind"
    last_updated_at: "2026-07-26T09:52:00Z"
    last_updated_by: "opencode"
    recent_action: "Post-closeout hardening: enforce consumer root agreement and fallback tests."
    next_safe_action: "Commit and push on explicit approval only."
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cursor-spec-gate-prebind"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Wire Cursor session-start spec gate prebinding

<!-- SPECKIT_LEVEL: 2 -->
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
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented. [EVIDENCE: `spec.md` defines seven acceptance-tested requirements.]
- [x] CHK-002 [P0] Technical approach defined. [EVIDENCE: `plan.md` scopes startup behavior to the adapter and the resolved autonomous-child contract to the shared core.]
- [x] CHK-003 [P1] Dependencies identified and available. [EVIDENCE: `spec-gate-core.mjs`, `shared/dist/gate-3-classifier.js`, and `.cursor/hooks.json` resolve on disk.]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Hook passes syntax, comment-hygiene, and alignment checks. [EVIDENCE: `node --check`, code-comment hygiene, and all 3 drift guards pass.]
- [x] CHK-011 [P0] The shared spec-gate core suite passes after the child no-op change. [EVIDENCE: core 67/67 with module mocks and OpenCode plugin 11/11 pass.]
- [x] CHK-012 [P1] Every adapter error path returns allow and writes no unsafe state. [EVIDENCE: malformed, missing-identity, child, and pre-existing-state rows pass in `spec-gate-prebind.test.mjs` and `spec-gate-core.test.mjs`.]
- [x] CHK-013 [P1] Hook remains a thin ESM adapter using public core exports. [EVIDENCE: `spec-gate-prebind.mjs` imports only the shared core and compiled classifier.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Valid `MK_SPEC_FOLDER` produces satisfied state consumed as allow. [EVIDENCE: named integration rows pass in the 11/11 prebind suite.]
- [x] CHK-021 [P0] Enforce-only top-level startup produces open state consumed as deny. [EVIDENCE: named integration row exits 2 with `permission:"deny"`.]
- [x] CHK-022 [P0] Disabled and child sessions produce no state and are complete no-ops. [EVIDENCE: prebind 11/11, core 67/67, plugin 11/11, and the live Claude child probe pass.]
- [x] CHK-023 [P0] Missing identity and malformed input produce no state. [EVIDENCE: the named fail-open row passes in `spec-gate-prebind.test.mjs`.]
- [x] CHK-024 [P1] Invalid declarations, padded session ids, and repeated terminal states behave deterministically. [EVIDENCE: the 11/11 prebind suite includes a padded-id row that requires a real deny after verbatim open-state lookup, plus missing-roots and whitespace-root rows.]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Findings classified as cross-consumer and matrix/evidence issues. [EVIDENCE: `spec-gate-prebind.test.mjs` invokes both startup producer and enforce consumer across 11 named subtests.]
- [x] CHK-FIX-002 [P0] Same-class producer inventory complete. [EVIDENCE: grep found the draft as the only startup caller of `writeGateStateAtomic`.]
- [x] CHK-FIX-003 [P0] Consumer inventory complete. [EVIDENCE: enforce adapter and hook/docs/config registrations are listed in `plan.md`.]
- [x] CHK-FIX-004 [P0] Path and input validation include out-of-tree, malformed, missing, padded-id, and fallback rows. [EVIDENCE: 11/11 process suite covers each class, including missing-roots and whitespace-root fallback rows.]
- [x] CHK-FIX-005 [P1] Matrix axes listed before implementation. [EVIDENCE: `plan.md` names the independent axes, including padded-id and child-classify.]
- [x] CHK-FIX-006 [P1] Environment variants run in isolated child processes. [EVIDENCE: `spawnSync` invokes each adapter with a fresh environment map.]
- [x] CHK-FIX-007 [P1] Final evidence is pinned to the resulting commit SHA. [EVIDENCE: implementation commit `348b644283`.]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No credentials or payload contents are persisted. [EVIDENCE: persisted-state assertions in `spec-gate-prebind.test.mjs` contain only status, binding, path, and timestamps.]
- [x] CHK-031 [P0] Folder binding uses filesystem-backed validation. [EVIDENCE: valid and out-of-tree declaration rows pass through `validateSpecFolderBinding`.]
- [x] CHK-032 [P1] Only opted-in, top-level sessions can enter enforceable open state. [EVIDENCE: inert, child, disabled, and enforced rows pass in the 11/11 process suite.]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:post-closeout -->
## Post-Closeout Hardening

- [x] CHK-060 [P1] The enforce consumer resolves `workspace_roots[0]` the same way the prebind producer does. [EVIDENCE: `spec-gate-enforce.mjs` uses trim-and-fallback; the whitespace-root regression test denies through the enforce consumer.]
- [x] CHK-061 [P1] The prebind's `process.cwd()` fallback path is covered by a discriminating test. [EVIDENCE: the missing-roots row in `spec-gate-prebind.test.mjs` writes state under the spawn cwd and the enforce consumer denies a Write through that same cwd.]
<!-- /ANCHOR:post-closeout -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, checklist, and summary are synchronized. [EVIDENCE: phase 018 strict validation reports 0 errors, 0 warnings, and `RESULT: PASSED`.]
- [x] CHK-041 [P1] Comments explain durable runtime constraints without packet identifiers. [EVIDENCE: `check-comment-hygiene.sh` reports no violations across all changed JavaScript files.]
- [x] CHK-042 [P1] Cursor hook READMEs and canonical hook reference match live wiring and the child no-op contract. [EVIDENCE: `validate_document.py` reports 21/21 affected Markdown documents with zero issues.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temporary files remain under `scratch/` or approved system temp paths. [EVIDENCE: automated tests use `tmpdir()` and the live probe used the approved system temp root.]
- [x] CHK-051 [P1] Packet 030 child metadata matches the on-disk phases and contains no ghost entries. [EVIDENCE: parent `graph-metadata.json` reports 18/18 unique children, one phase 018, and no ghost 015 MCP entry.]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 14/14 |
| P1 Items | 15 | 15/15 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-07-26 (Complete; post-closeout hardening added 2026-07-26)
<!-- /ANCHOR:summary -->

---
