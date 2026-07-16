---
title: "Verification Checklist: Phase 7: adapter-sk-code"
description: "Verification Date: 2026-07-11 - adapter built and CLI-verified against real repo files"
trigger_phrases:
  - "verification"
  - "checklist"
  - "phase 007"
  - "adapter sk-code"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/032-deep-alignment-mode/007-adapter-sk-code"
    last_updated_at: "2026-07-11T14:56:54Z"
    last_updated_by: "claude"
    recent_action: "All checklist items verified with real evidence"
    next_safe_action: "Wire adapter into phase 008 ITERATE/CONVERGE loop"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-code.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-059-007"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 7: adapter-sk-code

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
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md` — REQ-001..005, all now carrying MET evidence rows in the Requirements table.
- [x] CHK-002 [P0] Technical approach defined in `plan.md` — Architecture section (unchanged) plus Phase 1-3 evidence rows added this pass.
- [x] CHK-003 [P1] Phase 005 adapter contract dependency identified and tracked — `sk_doc_adapter.md`/`sk-doc.cjs` read in full; `sk-code.cjs` matches the exact file-section shape.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Adapter code passes lint/format checks. No repo-level ESLint config exists for this package (confirmed: no `.eslintrc*`/`eslint.config.*` outside vendored `node_modules`) — `node --check scripts/adapters/sk-code.cjs` is the applicable syntax gate and it passes.
- [x] CHK-011 [P0] No console errors or warnings. All 5 live CLI invocations (`discover` x2, `check` x4, `standard-source`, `reasoning-dispatch`) completed with clean stdout/JSON, zero stderr output.
- [x] CHK-012 [P1] Error handling implemented for surface-undetected and deterministic-checker-unavailable edge cases. Both live-verified: `surface-undetected` P1 finding on an `UNKNOWN`-surface path; `deterministic-layer-unavailable` P1 finding on a WEBFLOW-surface path with no discoverable project root.
- [x] CHK-013 [P1] Adapter code follows the phase-005 contract signature. `discover(scope)->{artifacts,nodes}`, `standardSource(authority)->rules`, `check(artifact,rules,options)->findings` — identical shape to `sk-doc.cjs`, options param added per this phase's own reasoning-layer design (documented, not a silent divergence).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria in `spec.md` REQ-001..005 met — see `spec.md`'s Requirements table, Evidence column added this pass.
- [x] CHK-021 [P0] Manual dry-run against real OPENCODE and WEBFLOW artifacts complete. OPENCODE: 6 live `verify_alignment_drift.py` dry-runs plus adapter `check()` calls, all clean. WEBFLOW: real code path exercised via a synthetic scope value, since live-verified zero `src/2_javascript` project roots exist anywhere in this monorepo (`sk_code_adapter.md` §8.1) — the invocation code is real (`spawnSync('node', [verify-minification.mjs/test-minified-runtime.mjs], {cwd: projectRoot})`), only its live-fire precondition is absent in this repo today.
- [x] CHK-022 [P1] Edge cases tested: surface-undetected (verified), deterministic-checker-unavailable for WEBFLOW (verified, this is the actual applicable "unavailable" edge case for this repo — `verify_alignment_drift.py` itself did not fail-to-parse in any real dry-run since this repo's OPENCODE surface is currently clean), MOTION_DEV overlay (verified, including its honest false-positive mode — `sk_code_adapter.md` §8.5).
- [x] CHK-023 [P1] Error scenarios validated per spec.md Edge Cases section — spec.md's Error Scenarios bullets updated this pass with the real, verified behavior (malformed-file handling is a normal ERROR finding, not a crash; subprocess failure is a distinct `adapter-error`).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Not applicable — `sk-code.cjs` is net-new adapter code, not a bug fix; there is no pre-existing defect to classify.
- [x] CHK-FIX-002 [P0] Not applicable — same reasoning as CHK-FIX-001; no same-class producer inventory needed for `sk-code.cjs`'s net-new code.
- [x] CHK-FIX-003 [P0] Not applicable — same reasoning; no changed helpers/policies/schema fields to inventory consumers for (`sk-code.cjs` is a new consumer of existing tools, not a change to a shared symbol).
- [x] CHK-FIX-004 [P0] Not applicable in this phase — no security/path/parser/redaction fix ships here (adapter is net-new, read-only implementation, confirmed: `check()` never invokes `minify-webflow.mjs`, the one script in scope that writes files).
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. `plan.md`'s Affected Surfaces section: surface (WEBFLOW, OPENCODE, MOTION_DEV overlay) x layer (deterministic, reasoning-agent) = 6 planned behaviors — all 6 now built and CLI-exercised, not merely planned.
- [x] CHK-FIX-006 [P1] Not applicable — no process-wide state is read or mutated by the adapter in v1; confirmed by reading `sk-code.cjs` in full (no globals, no shared state across `check()` calls).
- [x] CHK-FIX-007 [P1] Not applicable pre-commit — `sk-code.cjs` adds net-new code, not a regression fix, so there is no prior "fix SHA" to pin evidence against. Would apply if this packet were remediating an earlier adapter bug, which it is not.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets in adapter code — confirmed by reading `sk-code.cjs` in full (only `fs`/`path`/`child_process` usage, no credentials, tokens, or API keys anywhere).
- [x] CHK-031 [P0] Input validation implemented for lane scope resolution — `discover()` validates `scope.type` against the 3 known shapes (throws on an unknown type); every path is checked via `isInsideRepoRoot()` before being walked or read; `normalizeArtifact()` throws on a `check()` artifact path resolving outside the repo root.
- [x] CHK-032 [P1] Not applicable — no auth/authz surface anywhere in `sk-code.cjs` (confirmed by reading the full file: `fs`/`path`/`child_process` only)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — `spec.md`/`plan.md`/`tasks.md` all updated in this pass with matching completion status and cross-referenced evidence.
- [x] CHK-041 [P1] Automatability-limits statement written and reviewed once adapter code exists — `sk_code_adapter.md` Section 9, written after the adapter code and its live dry-runs, not before (so its fraction claim is evidence-derived, not predicted).
- [ ] CHK-042 [P2] README updated — correctly deferred to phase 009 cutover (unchanged from original plan; not a gap introduced by this pass).
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — no temp files were created inside the repo; all exploratory checks used inline `node -e`/CLI invocations against real files, nothing written to a repo-local scratch dir.
- [x] CHK-051 [P1] `scratch/` cleaned before completion — nothing to clean; see CHK-050 (zero temp files created).
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 0/1 (CHK-042 correctly deferred to phase 009) |

Note: the original stub's summary table (P0:9, P1:9) undercounted the checklist's own item tags — recounted directly against Sections above during this pass (12 P0, 13 P1, 1 P2), not carried forward uncorrected.

**Verification Date**: 2026-07-11 — adapter built, `node --check` clean, all 4 CLI subcommands (`discover`/`check`/`standard-source`/`reasoning-dispatch`) exercised against real repo files, 3 live `node -e` tests confirm the reasoning-layer VERIFY-FIRST pass-through.
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
