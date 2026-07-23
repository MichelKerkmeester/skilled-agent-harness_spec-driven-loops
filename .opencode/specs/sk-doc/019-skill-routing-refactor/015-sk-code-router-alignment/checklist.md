---
title: "Verification Checklist: sk-code Router — Typed-Gold Instrumentation + Live Measurement"
description: "Verification Date: pending (Status: In Progress). QA gate for the Wave 2 sk-code pilot — map-correctness scope-lock, baseline refresh, manifest-gated typed-gold derivation, guard test, and the live-mode sample."
trigger_phrases:
  - "sk-code router checklist"
  - "sk-code typed-gold verification"
  - "sk-code pilot qa gate"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-sk-code-router-alignment"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Conformed checklist to the strict template; marked verified pilot items with evidence"
    next_safe_action: "Run the live-mode sample (CHK-024), then close with strict validation"
    blockers: []
    key_files:
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-sk-code-router-alignment-authoring"
      parent_session_id: null
    completion_pct: 70
    open_questions: []
    answered_questions: []
---
# Verification Checklist: sk-code Router — Typed-Gold Instrumentation + Live Measurement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

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

- [x] CHK-001 [P0] Recon bug-claims tested against tooling before any edit — evidence: drift-guard 7/7, `parseResourceMap` regex read (router-replay.cjs:90-97), fresh run PASS 83
- [x] CHK-002 [P0] Approach defined in `plan.md` (7 phases) and scoped in `spec.md` (measurement-only; no map edit)
- [x] CHK-003 [P1] Baseline captured before change: pre-change `skill-benchmark/tests/` = 19 failed | 145 passed (stash-baseline) for delta-based regression
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check` passes on the changed loader — evidence: `load-playbook-scenarios.cjs` OK
- [x] CHK-011 [P0] No console errors during benchmark runs — evidence: `sk-code router run` clean
- [x] CHK-012 [P0] Scope-lock held: NO correctness edit to `smart_routing.md` INTENT_SIGNALS/RESOURCE_MAP — evidence: git diff shows map untouched; drift-guard 7/7
- [x] CHK-013 [P1] Derivation is dormant for manifest-less skills (byte-identical) — evidence: `loadManifestModeLeaves` returns null → no typed gold
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Guard test pins the derivation — evidence: `tests/load-playbook-typed-derivation.vitest.ts` 5/5
- [x] CHK-021 [P0] Typed-pair + mode-routing dimensions score after the change — evidence: `typedPairRecall` on 14 scenarios, mean 0.729
- [x] CHK-022 [P0] Non-circular: gold derived from independent body gold, not router output — evidence: derivation reads `**Expected references loaded**` body gold
- [x] CHK-023 [P1] No new regressions vs baseline — evidence: `post-change suite` still 19 failed | 145 passed (0 new); 4 failing files last touched by other sessions
- [ ] CHK-024 [P1] Live-mode sample completed; routing-quality number + transport + model recorded — evidence: _____
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-MTX-001 [P0] Stale baseline refreshed: committed report now PASS-lineage (verdict non-null, D5=100, 0 pre-reorg loci) — evidence: `sk-code/benchmark/baseline/skill-benchmark-report.json`
- [x] CHK-MTX-002 [P0] Leaf-manifest generated + byte-stable — evidence: `generate-leaf-manifest.cjs --check` OK
- [x] CHK-MTX-003 [P0] Typed gold valid (oracle passed) for the scored scenarios — evidence: `typedPairRecall` only computes on `status:valid`; 14 scenarios scored
- [x] CHK-MTX-004 [P1] Routing-vs-command partition holds: command/negative scenarios self-exclude (no packet-qualified body gold) — evidence: 14/30 scenarios typed, rest excluded
- [ ] CHK-MTX-005 [P1] CONDITIONAL driver documented as the untyped-preamble artifact (REQ-006 follow-up), not a routing regression — evidence: implementation-summary.md §5
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets introduced in the `loader`, manifest, or fixtures
- [x] CHK-031 [P0] `leafResourceId` containment still enforced — evidence: manifest generated through `assertContainment` in the contract lib
- [x] CHK-032 [P1] N/A — internal `routing/measurement change`, no auth/authz surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, plan.md, tasks.md, checklist.md, implementation-summary.md synchronized with the corrected diagnosis
- [x] CHK-041 [P1] The derivation carries a doc comment explaining the durable why (types independent body gold; dormant without a manifest) — evidence: `load-playbook-scenarios.cjs` derivation comment
- [x] CHK-042 [P2] Recon over-diagnosis + refutation recorded — evidence: implementation-summary.md §2
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Benchmark scratch runs kept under the `session scratchpad`, not the skill tree
- [x] CHK-051 [P1] No stray temp files in the packet `before completion`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 11 | 9/11 |
| P2 Items | 2 | 2/2 |

**Verification Date**: pending — two P1 items (CHK-024 live-mode, CHK-MTX-005 doc cross-link) open; Status is In Progress
<!-- /ANCHOR:summary -->
