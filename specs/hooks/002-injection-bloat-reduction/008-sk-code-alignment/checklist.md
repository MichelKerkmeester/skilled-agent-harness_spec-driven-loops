---
title: "Checklist: sk-code Alignment and README Freshness Audit"
description: "Verification checklist for the injection-bloat sk-code alignment audit and its must-fix implementation, confirming comment-only edits and additive README corrections leave the frozen shadow-delivery behavior unchanged."
trigger_phrases:
  - "sk-code alignment checklist"
  - "readme freshness checklist"
importance_tier: "supporting"
contextType: "checklist"
parent: "hooks"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/008-sk-code-alignment"
    last_updated_at: "2026-08-07T05:45:00Z"
    last_updated_by: "claude"
    recent_action: "Verified must-fix implementation from the final state"
    next_safe_action: "Optionally apply the deferred polish items"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs"
    session_dedup:
      fingerprint: "sha256:920e01baa5f244e42fa53afeb5298861bd9c43dcaf20d00df19fd66fd3d387a6"
      session_id: "2026-08-07-hooks-002-008"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: sk-code Alignment and README Freshness Audit

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

- [x] CHK-001 [P0] Changed surface committed and stable before the audit — Evidence: `git commit 78ef96ae6b`.
- [x] CHK-002 [P0] Each must-fix finding treated as a hypothesis and verified against the real file before editing — Evidence: `grep '(fix N)|(P1 fix)'` located the labels, `grep policy-plan lib/README.md` confirmed the omission, and `grep GATE_3_DELIVERY_SUPPRESSION_ENV` confirmed the env name is real.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Ephemeral fix-round labels removed, durable WHY retained — Evidence: `grep '(fix N)|(P1 fix)'` across the changed surface returns 0.
- [x] CHK-011 [P1] Comment-only edits; no logic or control-flow change on the frozen files — Evidence: `node --check` exit 0 on both files; `spec-gate-core.test.mjs` 84 pass / 0 fail.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `node --check` passes on both edited code files — Evidence: `spec-gate-core.mjs OK`, `mk-spec-gate.js OK`.
- [x] CHK-021 [P0] `spec-gate-core.test.mjs` unchanged — Evidence: `node --test spec-gate-core.test.mjs` reports 84/0 (87 total, 3 skipped), exit 0.
- [x] CHK-022 [P1] Advisor policy suites unchanged — Evidence: `policy-plan` + negative-controls + observation-sink 36 passed, exit 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] All four verified must-fix items implemented (4 comment labels, 3 READMEs) — Evidence: `git diff --stat` shows the six touched files.
- [x] CHK-FIX-002 [P0] `lib/README.md` lists `policy-plan.ts` in both trees — Evidence: `grep policy-plan lib/README.md` returns the added rows.
- [x] CHK-FIX-003 [P1] `lib/spec-gate/README.md` documents the delivery-observation entrypoints — Evidence: `grep observeGate3QuestionDelivery README.md` returns the added row.
- [x] CHK-FIX-004 [P1] `ENV-REFERENCE.md` documents the four load-bearing spec-gate envs with real names — Evidence: `GATE_3_DELIVERY_SUPPRESSION_ENV` verified present in `spec-gate-core.mjs` before documenting.
- [x] CHK-FIX-005 [P2] Optional polish implemented in a follow-up: candidate literals named per-file, shadow-delta/delivery cross-ref added — Evidence: `grep` shows 0 magic-literal candidate sites; suites green (36/84/46/44).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P1] No secrets, credentials, or tokens introduced in edits or research artifacts — Evidence: `git diff` review of the six touched files.
- [x] CHK-031 [P2] No new external network or execution surface added — Evidence: edits are code comments and additive Markdown only.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] Cited API and env names verified to exist before documenting them — Evidence: `grep export/env` in `spec-gate-core.mjs` confirmed every documented symbol.
- [x] CHK-041 [P1] README edits additive and accurate to current behavior — Evidence: diff review against the epoch>=1 / post-emission-observer contract.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Edits scoped to the changed surface and its READMEs; no unrelated files touched — Evidence: `git status --porcelain` shows only the intended paths.
- [x] CHK-051 [P2] Research artifacts contained under `research/` — Evidence: `find research/` lists lineage + synthesis files only.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 7 | 7/7 |
| P2 Items | 3 | 3/3 |

**Verification Date**: 2026-08-07 — all must-fix items verified with command evidence; the P2 polish items were implemented in a follow-up (named candidate constants, shadow README cross-ref).
<!-- /ANCHOR:summary -->
