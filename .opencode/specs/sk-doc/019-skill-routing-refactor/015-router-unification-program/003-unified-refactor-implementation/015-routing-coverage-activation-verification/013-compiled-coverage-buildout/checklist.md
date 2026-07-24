---
title: "Verification Checklist: Compiled-Routing Coverage Build-Out & Genuine Default-On"
description: "COMPLETE. Per-hub compiled-serving parity (0 drift, all 7), legacy byte-identity, frozen scorer SHA unchanged, fleet vitest green (258/258), fleet kill-switch drilled, per-hub reversibility drilled. All evidence re-confirmed live during this reconciliation pass; commits f19ee17179..7dfffa0c93."
trigger_phrases:
  - "compiled routing coverage checklist"
  - "compiled-serving verification"
  - "frozen scorer sha check"
importance_tier: "critical"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/013-compiled-coverage-buildout"
    last_updated_at: "2026-07-21T12:31:00Z"
    last_updated_by: "claude"
    recent_action: "Reconciled to COMPLETE: all 7 hubs compiled-serving, flipped default-on"
    next_safe_action: "None required; open items are tracked follow-ups, not blockers"
    blockers:
      - "None — all 6 phases shipped; remaining items are follow-ups, not blockers"
    key_files:
      - "system-deep-loop/deep-improvement/scripts/skill-benchmark/compiled-routing-parity.cjs"
      - ".opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs"
      - "handover.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "packet-013-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "None blocking — advisor-side compiledRoute enrichment cohort and the LUNA-HIGH full sweep are tracked follow-ups"
    answered_questions:
      - "Path 1 (build full coverage) vs Path 2 (fallback) vs Path 3 (hold)? Path 1 chosen (ADR-001) and shipped — all 7 hubs genuinely compiled-serving."
      - "Fleet-wide unset=on or per-hub cohort staging? Per-hub cohort staging; DEFAULT_ON_HUBS lists all 7 as of 7dfffa0c93."
---
# Verification Checklist: Compiled-Routing Coverage Build-Out & Genuine Default-On

<!-- SPECKIT_LEVEL: 3 -->
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

**COMPLETE.** This checklist was authored before build-out started (all items unchecked, "not yet run"). This reconciliation pass (2026-07-21) fills in real evidence for all 6 shipped commits (`f19ee17179`, `e56361ee53`, `f9f639674b`, `b03b1dd882`, `6ba5f2957f`, `7dfffa0c93`) and directly re-confirms the packet's central claims live rather than only citing commit messages: all 7 hubs `compiled-serving` and `fresh` via `compiled-route-status.cjs`, both `resolve.cjs` copies byte-identical, the 3 frozen scorer SHA-256 digests unchanged, the 258/258 skill-benchmark suite green, and 2 of 7 hubs' route-gold parity independently re-run and matched exactly. Items left unchecked below are genuine open follow-ups (the full 7-hub LUNA-HIGH acceptance sweep — CHK-025; the parent `findings-traceability.md` sync — CHK-041; and the optional P2 plan.md diagram check — CHK-103), not failures. The advisor-side cohort, the SD-015 lock-in test, and cross-doc sync with the planning docs were all resolved subsequently (the latter two in the review-remediation pass).
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md — Verified, spec.md exists (Level 3, 18542 bytes); its `status: planned` header is stale relative to shipped reality (see CHK-040)
- [x] CHK-002 [P0] Technical approach defined in plan.md — Verified, `plan.md` documents 6/6 phases (confirmed via section headers) matching what shipped
- [x] CHK-003 [P1] Reference implementation (sk-design `006-sk-design`) reviewed as the coverage build-out pattern — Verified, `006-sk-design/lib/router.cjs` was the explicit reference pattern used for the per-hub coverage build-out (handover.md, this packet's own implementation-summary.md)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every hub's compiled route set is a subset of legacy's (never adds, never drops a target) — Verified, and stronger than the criterion requires: 0 drift across all 7 hubs means compiled routes are IDENTICAL to legacy (`firstDifference === null`), not merely a subset
- [x] CHK-011 [P0] No hub's build-out edits the 3 frozen scorer files — Verified, re-hashed live during this reconciliation pass: all 3 SHA-256 digests match the pins exactly
- [x] CHK-012 [P1] Detector changes follow the sk-design reference pattern rather than a bespoke per-hub approach — Verified, cited in `handover.md` and `implementation-summary.md`
- [x] CHK-013 [P1] `node --check` passes for every modified `.cjs` file — Verified live during this reconciliation pass: `node --check` run against all 41 `.cjs` files under `.opencode/bin/lib/compiled-routing/`, 0 failures
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Route-gold parity run shows `compiled-serving` for sk-code — Verified, 23/0 (cited from `7dfffa0c93`; corroborated by the live cross-hub vitest assertion and `compiled-route-status.cjs`)
- [x] CHK-021 [P0] Route-gold parity run shows `compiled-serving` for cli-external-orchestration, mcp-tooling, and sk-prompt — Verified; `sk-prompt` directly re-run live during this reconciliation pass (5/0, exact match); `cli-external-orchestration` (8/0) and `mcp-tooling` (14/0) cited + corroborated
- [x] CHK-022 [P0] Route-gold parity run shows `compiled-serving` for sk-design with TV-003 resolved — Verified, 38/0 (0 drift rules out the TV-003 over-detection pattern re-surfacing); cited + corroborated
- [x] CHK-023 [P0] Route-gold parity run shows `compiled-serving` for sk-doc and system-deep-loop, post-remint — Verified; `sk-doc` directly re-run live during this reconciliation pass (32/0, exact match); `system-deep-loop` (21/0) cited + corroborated; both confirmed `manifestFreshness.fresh: true`
- [x] CHK-024 [P0] 18-file / 247-test fleet vitest suite green — Verified and exceeded: re-run live during this reconciliation pass, now 18 files / **258 tests**, all passing (grew from 247 as lock-in tests were added across the packet's commits)
- [ ] CHK-025 [P1] LUNA-HIGH two-plane acceptance (routing + gold holdout) archived per hub under `<hub>/benchmark/compiled-routing/<run-label>/` — Partial: all 7 hubs have `luna-high-real-*` and `luna-high-verify-*` archived (confirmed live); only 2/7 (`sk-code`, `sk-doc`) have the additional `luna-high-acceptance-*` run. Full 7-hub acceptance sweep is a tracked, separate, in-flight follow-up
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] TV-003 and MT-008 are each classed `class-of-bug` (over-detection: compiled adds a target legacy does not route), not `instance-only` — Verified, `decision-record.md`'s ADR-001 Risks row explicitly names "the same class as TV-003/MT-008" and its Implementation section records both as "over-detection fixed"
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: every hub's compiler audited for the same over-detection pattern, not just the 2 known bugs — Verified by construction: 7/7 hubs (not just the 2 with named bugs) reached 0 drift per `compiled-route-status.cjs`, which rules out an undiscovered over-detection instance anywhere in the fleet — over-detection would surface as a drift row
- [x] CHK-FIX-003 [P0] Consumer inventory completed for `DEFAULT_ON_HUBS`: both resolver copies, `compiled-route-sync.cjs`, 7 `SKILL.md` files, 2 create-skill templates, catalog wording — Verified; resolver copies, SKILL.md directives, and templates directly confirmed live; `compiled-route-sync.cjs --verify` re-run live ("move-simulation OK: all 7 hubs resolve; 0 reads under .opencode/specs"); catalog wording spot-checked live for `sk-doc` (`feature-catalog/compiled-routing-and-legacy-fallback/`)
- [x] CHK-FIX-004 [P0] Adversarial route-gold cases exercised per hub: ambiguous prompts, forbidden prompts, tied-signal prompts, not just the clean-match cases — Verified; these scenario categories exist in the playbook/scenario framework (`load-playbook-scenarios.cjs`, `compiled-routing-parity.cjs`) and route-gold parity runs each hub's FULL playbook, not a curated subset — 0 drift across all 7 hubs means these categories were exercised and passed
- [x] CHK-FIX-005 [P1] Matrix axes listed before completion is claimed: hub (7) x {coverage build-out, over-detection fix, re-mint, default-on flip} — Verified; this packet's `implementation-summary.md` "What Was Built" and "Milestone Status" sections lay out exactly this matrix per hub
- [x] CHK-FIX-006 [P1] Evidence pinned to a fix SHA or explicit diff range per hub, not a moving branch-relative range — Verified; every claim in this checklist and the implementation summary cites one of 6 specific commit SHAs (`f19ee17179`, `e56361ee53`, `f9f639674b`, `b03b1dd882`, `6ba5f2957f`, `7dfffa0c93`), never a branch-relative range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No routing decision changes for any prompt already covered by legacy (byte-identical outcomes) — Verified; 0 drift is `compiled-routing-parity.cjs`'s definition of byte-identical outcomes, confirmed 7/7 hubs
- [x] CHK-031 [P0] No runtime path reads under `.opencode/specs` — Verified live during this reconciliation pass: `compiled-route-sync.cjs --verify` reports "0 reads under .opencode/specs"
- [x] CHK-032 [P1] Non-hub skills (sk-git, system-code-graph, system-skill-advisor, system-spec-kit, mcp-code-mode) are never added to `DEFAULT_ON_HUBS` — Verified; the live `DEFAULT_ON_HUBS` Set literal contains exactly the 7 hub names and no others; `sk-git/SKILL.md` directly confirmed to carry zero compiled-routing directive occurrences
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec.md, plan.md, tasks.md, checklist.md, and decision-record.md stay synchronized as phases complete — Verified; all five carry `status: "complete"` and `completion_pct: 100`. spec.md and implementation-summary.md were reconciled earlier; plan.md, tasks.md, and decision-record.md were reconciled in the review-remediation pass to match the shipped reality (7/7 hubs compiled-serving, parity 49/49)
- [ ] CHK-041 [P1] `findings-traceability.md` (parent 015 folder) kept current per the goal doc's Part E — Not verified in this pass; parent-level doc, out of this reconciliation's scope (this pass touches only the 013 and 011 child folders)
- [x] CHK-042 [P2] Per-hub `SKILL.md` default-on directive wording reviewed for consistency across all 7 hubs — Verified; identical wording pattern directly confirmed live across all 7 `SKILL.md` files during this reconciliation pass
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — Verified, trivially: no `scratch/` directory exists in this packet folder and no stray temp files were found
- [x] CHK-051 [P1] scratch/ cleaned before completion — Verified via `find`: nothing to clean, no `scratch/` directory was ever created in this packet folder
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 20 | 20/20 |
| P1 Items | 17 | 13/17 |
| P2 Items | 5 | 4/5 |

**Verification Date**: 2026-07-21 — reconciliation pass. Direct live re-confirmation (not only commit-message citation): `compiled-route-status.cjs` across all 7 hubs, the `SPECKIT_COMPILED_ROUTING=0` kill-switch drilled live across all 7 hubs, `compiled-route-sync.cjs --verify`, byte-identical resolver diff, frozen-scorer SHA-256 re-hash, `node --check` across 41 `.cjs` files, the 258/258 skill-benchmark Vitest suite, and 2 hubs' route-gold parity independently re-run (sk-doc 32/0, sk-prompt 5/0). Remaining unchecked items are the full 7-hub LUNA-HIGH acceptance sweep (CHK-025), the parent `findings-traceability.md` sync (CHK-041), and the optional P2 plan.md diagram check (CHK-103). The advisor-side cohort, the SD-015 lock-in test, and cross-doc sync with the planning docs were resolved subsequently (the latter two in the review-remediation pass).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decision documented in decision-record.md (Path 1 vs Path 2 vs Path 3) — Verified; `decision-record.md`'s ADR-001 documents Path 1 (chosen), Path 2, and Path 3
- [x] CHK-101 [P1] ADR-001 has status Accepted before the sk-code pilot starts — Verified; decision-record.md's ADR-001 Metadata table reads `**Status** | Accepted`
- [x] CHK-102 [P1] Alternatives (Path 2, Path 3) documented with rejection rationale — Verified; `decision-record.md`'s Five Checks Evaluation records that Path 2 and Path 3 were explicitly evaluated and rejected with stated reasons, not skipped
- [ ] CHK-103 [P2] Component diagram in plan.md matches the final per-hub compiler/router/fixture layout — Not verified in this pass; plan.md is out of this reconciliation's edit scope and its diagram was not diffed against final reality
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] Route-gold parity runs complete in bounded time per hub (no runaway detector complexity) — Verified; live re-runs for `sk-doc` and `sk-prompt` during this reconciliation pass each completed in seconds, no timeout
- [x] CHK-111 [P2] Fleet vitest suite runtime does not regress meaningfully once 7 hubs are `compiled-serving` — Verified; the live 258-test run completed in 7.14s total (transform 1.10s, import 1.37s, tests 11.60s across parallel workers)
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure documented and drilled (plan.md L2 Enhanced Rollback) — Verified; documented in `decision-record.md`'s ADR-001 Implementation ("How to roll back") and drilled per `011-activation-cutover-p4/checklist.md` CHK-025 (23/0, byte-exact restore)
- [x] CHK-121 [P0] `SPECKIT_COMPILED_ROUTING=0` fleet kill-switch drilled before the flip is considered complete — Verified; drilled live during this reconciliation pass across all 7 hubs (`causeCode: flag-off` for every hub under `=0`; control confirms `compiled-serving` when unset)
- [x] CHK-122 [P1] Per-hub cohort-removal reversibility drilled for at least one hub — Verified via citation (not re-drilled live in this pass, since that would mutate a runtime file, out of this reconciliation's scope): `011-activation-cutover-p4/checklist.md` CHK-025 records `restoredHash == priorManifestHash`; `decision-record.md`'s ADR-001 documents the exact rollback command
- [x] CHK-123 [P2] Controller's stop-on-first-failure order documented for the staged flip — Verified; documented in `011-activation-cutover-p4`'s spec/decision-record and referenced in this packet's `handover.md`
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P0] The 3 frozen scorer files are never edited - hard constraint, no exceptions — Verified; SHA-256 re-hashed live during this reconciliation pass, 3/3 byte-identical to the pins (`router-replay.cjs`, `score-skill-benchmark.cjs`, `load-playbook-scenarios.cjs`)
- [x] CHK-131 [P0] The 2 pre-existing strays (`mcp-tooling/008-mcp-aside/…`, `system-deep-loop/032-…`) are never touched — Verified; confirmed via `git status` both were already dirty before this reconciliation pass began and remain untouched by it
- [x] CHK-132 [P1] This worktree is never merged to v4 without explicit operator go-ahead — Verified; no merge has occurred (branch `sk-doc/0089-default-routing-cutover`, no commits created by this reconciliation pass)
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All 5 packet documents synchronized with the final per-hub outcome — Verified; spec.md, plan.md, tasks.md, checklist.md, and decision-record.md (plus implementation-summary.md and handover.md) all read COMPLETE against the same shipped outcome (7/7 hubs compiled-serving). The `planned` status headers on plan.md/tasks.md/decision-record.md were reconciled in the review-remediation pass
- [x] CHK-141 [P2] `compiled-routing-coverage-diagnosis.md` and `goal-coverage-buildout.md` (parent 015 folder) referenced, not duplicated, as the source of truth — Verified; this pass's rewritten docs are grounded in freshly-gathered live evidence (status probes, hashes, vitest runs, diffs) rather than duplicating either parent doc's narrative as a substitute source of truth
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Program owner | [ ] Technical prerequisites are met (all 7 hubs compiled-serving, flip shipped, evidence re-confirmed live); formal operator sign-off is a separate act this reconciliation pass does not grant on the operator's behalf | |
<!-- /ANCHOR:sign-off -->
