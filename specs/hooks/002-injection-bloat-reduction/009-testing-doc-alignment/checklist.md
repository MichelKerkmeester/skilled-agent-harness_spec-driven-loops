---
title: "Checklist: Testing-Doc and Feature-Catalog Alignment Sweep"
description: "Verification checklist for the dual-lineage playbook and catalog alignment sweep and its must-fix implementation, confirming documentation-only edits and a re-run of the corrected playbook command."
trigger_phrases:
  - "testing doc alignment checklist"
  - "feature catalog sweep checklist"
importance_tier: "supporting"
contextType: "checklist"
parent: "hooks"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/009-testing-doc-alignment"
    last_updated_at: "2026-08-08T09:29:48Z"
    last_updated_by: "claude"
    recent_action: "Verified must-fix implementation from the final state"
    next_safe_action: "Optionally apply the deferred feature-flag-reference env-row task"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/spec-mutation-gate-enforce.md"
    session_dedup:
      fingerprint: "sha256:8b1de50185aaabedc28db0c69984681a5810f48d1c3ae766411fd7888b2304bc"
      session_id: "2026-08-07-hooks-002-009"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: Testing-Doc and Feature-Catalog Alignment Sweep

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

Each item is checked from the final working-tree state. Behavior-preserving claims are backed by a command and its observed result cited in the Evidence.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Changed surface committed and stable before the sweep — Evidence: `git commit 2af2feb113`.
- [x] CHK-002 [P0] Each must-fix finding verified against the real file before editing — Evidence: `grep 'tests 67' spec-mutation-gate-enforce.md` located the stale count and the command was re-run to confirm the true output.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The stale playbook count is corrected to the real output — Evidence: `grep 'tests 87' spec-mutation-gate-enforce.md` returns the corrected `87/87/0/0` line.
- [x] CHK-011 [P1] Documentation-only edits; no runtime code or behavior changed — Evidence: `git status` shows only three Markdown docs (one playbook, two catalogs) plus the packet.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] The corrected playbook command produces its documented output — Evidence: `node --experimental-test-module-mocks --test spec-gate-core.test.mjs` reports `tests 87 / pass 87 / fail 0 / skipped 0`, matching the doc.
- [x] CHK-021 [P1] The documented count reflects the module-mocks invocation, not a plain run — Evidence: with mocks the 3 ESM-mock cases run (87/87/0); without them they skip (87/84/3) — the playbook command has the flag.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] The one P1 must-fix (stale playbook count) implemented and re-verified — Evidence: `spec-mutation-gate-enforce.md:63` now states `87/87/0/0`.
- [x] CHK-FIX-002 [P1] The cursor spec-gate catalog documents the post-emission delivery observer — Evidence: `grep MK_SPEC_GATE_3_DELIVERY_SUPPRESSION cursor-hooks-and-spec-gate.md` returns the added note.
- [x] CHK-FIX-003 [P1] The claude advisor-hook catalog documents the post-emission policy observer — Evidence: `grep observeEmittedAdvisorPolicy claude-hook.md` returns the added note.
- [~] CHK-FIX-004 [P2] The feature-flag-reference env-row addition is won't-fix by design — Evidence: `grep` shows 8/12 catalog files delegate to `ENV-REFERENCE.md` ("no longer enumerate flags"); adding rows reintroduces the drift that delegation prevents.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P1] No secrets, credentials, or tokens introduced in edits or research artifacts — Evidence: `git diff` review of the three touched docs.
- [x] CHK-031 [P2] No new external network or execution surface added — Evidence: edits are Markdown documentation only.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] Cited symbols verified to exist before documenting them — Evidence: `grep observeGate3QuestionDelivery`/`observeEmittedAdvisorPolicy` in the source confirmed both.
- [x] CHK-041 [P1] Catalog notes additive and accurate to current behavior — Evidence: diff review against the epoch>=1 / post-emission-observer contract.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Edits scoped to three docs plus the packet; no unrelated files or collateral churn — Evidence: `git status --porcelain` shows 0 description.json churn outside the packet tree.
- [x] CHK-051 [P2] Research artifacts contained under `research/` — Evidence: `find research/` lists the two lineages' synthesis and state files only.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 6 | 6/6 |
| P1 Items | 8 | 8/8 |
| P2 Items | 3 | 2/3 (1 deferred with rationale) |

**Verification Date**: 2026-08-07 — all must-fix items verified with command evidence; the corrected playbook command re-run to match its documented output; one P2 item deferred.
<!-- /ANCHOR:summary -->
