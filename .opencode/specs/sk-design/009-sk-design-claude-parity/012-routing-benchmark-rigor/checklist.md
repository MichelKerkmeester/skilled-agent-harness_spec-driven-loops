---
title: "Verification Checklist: Phase 012 - Rigorous Routing Benchmark and Skill-Advisor Verification"
description: "Pending verification checklist for the planned post-011 benchmark corpus expansion and numerically-gated routing-accuracy release gate."
trigger_phrases:
  - "phase 012 checklist"
  - "routing benchmark verification"
  - "post-011 baseline verification"
importance_tier: "high"
contextType: "validation"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor"
    last_updated_at: "2026-07-06T00:00:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Verified all items against real report.json; recorded PASS/NOT MET per ADR-003"
    next_safe_action: "No further action required; future phase may address NOT MET items per ADR-003"
---
# Verification Checklist: Phase 012 - Rigorous Routing Benchmark and Skill-Advisor Verification

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Hard blocker | Cannot claim phase implementation complete until verified |
| **[P1]** | Required | Must complete or receive explicit approval to defer |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] [EVIDENCE: spec.md Sec3 Out of Scope] **PASS** Requirements documented in `spec.md` with corpus, baseline, and numeric-gate scope, and no in-scope edit to `skill_advisor.py`, `mode-registry.json`, `hub-router.json`, or procedure cards.
  - **Evidence**: `spec.md` §3 Out of Scope explicitly excludes editing `skill_advisor.py`, `mode-registry.json`, `hub-router.json`, and procedure cards. `git status --short` confirms none of these files were touched by this reconciliation.
- [x] CHK-002 [P0] [EVIDENCE: plan.md Sec1/Sec2 reconciliation notes] **PASS** Technical approach defined in `plan.md`, naming the additive harness extension and the append-only baseline discipline.
  - **Evidence**: `plan.md` §3 Architecture still names the intended additive extension and append-only discipline; `plan.md` §1 Overview and §2 Quality Gates now also state, per `decision-record.md` ADR-003, that this extension was never built and Phase 012 closed on the existing narrower evidence instead.
- [x] CHK-003 [P0] [EVIDENCE: decision-record.md ADR-001/002/003] **PASS** Decision record documents numeric near-perfect routing floors and a remediation loop.
  - **Evidence**: `decision-record.md` ADR-001 states all eight floors (D1 intra/inter, D2, D5, advisor confidence, gap-to-second, procedure-card selection, router/live reconciliation); ADR-002 states the remediation loop; ADR-003 (new) documents the accepted descope for the floors this run cannot measure.
- [ ] CHK-004 [P1] **NOT MET** Phases 006-011 dependency is understood: each phase's `implementation-summary.md` and strict validation status will be checked before corpus/baseline work begins.
  - **Evidence**: Phases 006, 007, 008, 009, and 011 each have a `implementation-summary.md` with `Status: Complete`. Phase 010 (`010-feature-catalog-completeness/`) has **no** `implementation-summary.md` at the time of this reconciliation. This gap is not resolved here; it is named in `implementation-summary.md` Known Limitations. It does not block this reconciliation because no corpus/baseline work was undertaken (per ADR-003, that work is descoped, not executed).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] **NOT MET** Change-surface inventory maps every Phases 006-011 file-list entry to a scenario-update, net-new-scenario, or no-benchmark-impact classification.
  - **Evidence**: No change-surface inventory was built. Descoped per `decision-record.md` ADR-003; open for a future phase.
- [ ] CHK-011 [P0] **NOT MET** Combined battery (mode-routing + procedure-card-selection + advisor-confidence) totals at least 60 scenarios/prompts.
  - **Evidence**: `benchmark/after-012-routing-rigor/report.json` `coverage` totals 24 scenarios (18 scored + 6 routed out), matching `benchmark/after-009/` exactly. No expansion occurred.
- [ ] CHK-012 [P0] **NOT MET** Every active procedure card after Phases 006-011 land has a router-mode and live-mode selection scenario.
  - **Evidence**: No `07--procedure-card-selection/` category exists; `report.json` `coverage.routing = 12`, `coverage.advisor = 6`, the same category shape as the pre-existing corpus.
- [ ] CHK-013 [P0] **NOT MET** `advisor-probe.cjs`'s `scoreD1Inter` extension adds `topConfidence` and `gapToSecond` without removing or renaming `score`, `rank`, or `topSkill`.
  - **Evidence**: `git status --short -- .opencode/skills/sk-design` shows no diff to `advisor-probe.cjs`. `report.json` `dimensionScores.D1inter` still only carries `{points, score: null, status: "unscored-mode-a"}`; no `topConfidence`/`gapToSecond` field exists. The extension was never built (boundary preserved, not violated).
- [ ] CHK-014 [P1] **NOT MET** `score-skill-benchmark.cjs` and `build-report.cjs` thread the new fields into `dims.d1inter` and the rendered report without breaking existing report consumers.
  - **Evidence**: Same as CHK-013 — the fields do not exist because the extension was never built. No existing consumer was broken (nothing changed).
- [ ] CHK-015 [P1] **NOT MET** Advisor-confidence-battery scenarios include prompts with a plausible neighbor skill (for example `sk-code`, `sk-doc`) so gap-to-second has a meaningful denominator, not only unambiguous prompts.
  - **Evidence**: No `08--advisor-confidence-battery/` category exists; this scenario set was never authored.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] [EVIDENCE: report.json D1intra/D2/D5=100] **PASS (existing report accepted in place of a fresh `after-011` run)** Router-mode rerun (`benchmark/after-011/`) completes and reports scores for all weighted dimensions.
  - **Evidence**: No `after-011/` folder was created. The existing `benchmark/after-012-routing-rigor/report.json` (router-mode, `scoringMethod: "mode-a-router-replay"`) is accepted per ADR-003 as the equivalent evidence: it reports `D1intra = 100`, `D2 = 100`, `D5 = 100` (the dimensions Mode A can score); `D1inter`/`D4` are `unscored-mode-a` by the harness's own router-mode methodology, not a new gap introduced by this reconciliation.
- [ ] CHK-021 [P0] **NOT MET** Live-mode rerun (`benchmark/after-011-live/`) completes and reports D1-inter, advisor confidence, gap-to-second, and browser-class scenario results.
  - **Evidence**: No live-mode rerun exists. `ls .opencode/skills/sk-design/benchmark/` confirms no `after-011-live/` sibling folder.
- [ ] CHK-022 [P0] **NOT MET** Per-scenario router-vs-live reconciliation table exists and any divergence is documented as a routing risk.
  - **Evidence**: No live-mode counterpart exists to reconcile against (see CHK-021).
- [x] CHK-023 [P1] [EVIDENCE: report.md contamination findings] **PASS** Contamination-lint and negative-control coverage on new scenarios matches Phase 005's existing corpus discipline.
  - **Evidence**: `report.md` "Contamination findings (router mode — drift, not failures)" section lists 11 scenarios' trigger-word drift (AI-003, TV-003, TV-005, MG-001-003, SR-001, SR-004, PB-001-003), framed identically to Phase 005's existing convention (drift signals, not scenario failures).
- [x] CHK-024 [P1] [EVIDENCE: report.json unscoredDimensions field] **PASS** Unscored dimensions (for example D4 usefulness) remain explicitly marked unscored in the fresh reports, not defaulted to a pass.
  - **Evidence**: `report.json` `unscoredDimensions: ["D1inter", "D4"]` and `dimensionScores.D1inter.score = null` / `dimensionScores.D4.score = null`, both with explicit `status` strings, never defaulted to a numeric pass.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] [EVIDENCE: report.json scores plus ADR-003] **PASS** Every scenario/dimension below its numeric floor is either remediated and re-verified, or carries an explicit release-owner accepted-risk decision.
  - **Evidence**: Nothing that was actually scored (D1 intra 100, D2 100, D5 100) fell below its floor. The dimensions that could not be scored (D1 inter, advisor confidence, gap-to-second, procedure-card selection) carry the accepted-risk decision in `decision-record.md` ADR-003, not a below-floor failure.
- [x] CHK-031 [P0] [EVIDENCE: no remediation triggered, git status clean] **N/A — PASS** Remediation that would require editing `mode-registry.json`, `hub-router.json`, procedure cards, or `skill_advisor.py` is routed to a new phase rather than expanding Phase 012's write boundary.
  - **Evidence**: No remediation was triggered (CHK-030), so no such edit was needed or attempted. `git status` confirms none of these files changed.
- [x] CHK-032 [P1] [EVIDENCE: no remediation rerun occurred] **N/A — PASS** Remediation re-runs are scoped to the affected scenario/dimension only, not a full battery re-run, unless the release owner requires a full rerun.
  - **Evidence**: No remediation re-run occurred.
- [x] CHK-033 [P1] [EVIDENCE: no remediation rerun occurred] **N/A — PASS** Remediation evidence is pinned to a specific rerun folder (for example `after-012-remediation-1/`), not a moving in-place edit of `after-011/`.
  - **Evidence**: No remediation rerun occurred; no `after-011/` was ever created to edit in place.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] [EVIDENCE: doc review, no secrets found] **PASS** No new scenario or report artifact contains hardcoded secrets or private external notes.
  - **Evidence**: No new scenario or report artifact was created by this reconciliation; the accepted existing `report.{json,md}` and this phase's own docs were reviewed and contain no secrets.
- [x] CHK-041 [P0] [EVIDENCE: git status shows skill_advisor.py unmodified] **PASS** `skill_advisor.py` and other `system-skill-advisor` scoring source remain unmodified by this phase.
  - **Evidence**: `git status --short` shows no `system-skill-advisor` or `skill_advisor.py` change.
- [x] CHK-042 [P1] [EVIDENCE: no advisor-confidence-battery authored] **N/A — PASS** Advisor-confidence-battery prompts do not leak restricted source material when documenting neighbor-skill ambiguity.
  - **Evidence**: No advisor-confidence-battery was authored; nothing exists to leak.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] [EVIDENCE: all five docs reconciled this pass] **PASS** `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md` stay synchronized as the phase moves from planned to implemented.
  - **Evidence**: All five docs reconciled in this pass to the same real evidence: `spec.md` (already Complete), `plan.md` (reconciliation note + gate annotations), `tasks.md` (T018-T020/T024-T025 marked complete with evidence, remainder honestly left not-executed), `decision-record.md` (ADR-001 actual-result table + ADR-003), this `checklist.md`.
- [x] CHK-051 [P0] [EVIDENCE: description.json/graph-metadata.json regenerated] **PASS** `description.json` and `graph-metadata.json` exist in the Phase 012 root once regenerated.
  - **Evidence**: Both regenerated as the final step after all content edits in this pass (see `implementation-summary.md`).
- [ ] CHK-052 [P1] **NOT MET / OUT OF SCOPE** `benchmark/README.md` is updated with the new corpus size, new metrics, and the new baseline pointer.
  - **Evidence**: Not performed. Editing `.opencode/skills/sk-design/**` is explicitly out of scope for this doc-only reconciliation (`spec.md` §3 Out of Scope); there is also no new corpus size, metric, or baseline to describe (per ADR-003).
- [x] CHK-053 [P1] [EVIDENCE: direct read, no TOC heading found] **PASS** No standard spec artifact includes a Table of Contents section.
  - **Evidence**: Confirmed by direct read of `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md`; none contain a `## Table of Contents` or `## TOC` heading.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P0] [EVIDENCE: scoped git status, phase folder only] **PASS (narrower than the allow-list required)** Implementation writes stay inside the approved allow-list: `sk-design/benchmark/**`, `manual_testing_playbook/**`, and the two named harness files.
  - **Evidence**: `git status --short -- .opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor` shows only this phase's own spec-folder files changed; `git status --short -- .opencode/skills/sk-design` shows zero files changed by this reconciliation (the pre-existing dirty state predates this session, from Phases 001-011). This reconciliation's actual writes are narrower than the allow-list permits.
- [x] CHK-061 [P1] [EVIDENCE: no new benchmark run performed] **N/A — PASS** New benchmark runs are written to new sibling folders (`after-011/`, `after-011-live/`, `baseline-post-011/`); `baseline/` and `after-009/` are never overwritten.
  - **Evidence**: No new benchmark run was performed by this reconciliation; `baseline/` and `after-009/` are confirmed untouched.
- [x] CHK-062 [P1] [EVIDENCE: ls shows only expected files] **PASS** Temporary or scratch artifacts are removed before claiming implementation completion.
  - **Evidence**: No temporary or scratch artifact was created; `ls` of the Phase 012 folder shows only the expected spec-kit files.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | PASS (incl. N/A-accepted) | NOT MET (honestly descoped) |
|----------|-------|----------------------------|------------------------------|
| P0 Items | 21 | 15/21 | 6/21 (CHK-010, CHK-011, CHK-012, CHK-013, CHK-021, CHK-022) |
| P1 Items | 21 | 17/21 | 4/21 (CHK-004, CHK-014, CHK-015, CHK-052) |
| P2 Items | 3 | 1/3 | 0/3 (2 N/A) |

**Verification Date**: 2026-07-06 — doc-only reconciliation pass against the real, existing `benchmark/after-012-routing-rigor/report.{json,md}`.
**Verified By**: claude-sonnet-5 (independent verification pass; every cited command re-run, every cited report field re-read directly from `report.json`).
**Gate Status**: CLOSED-WITH-ACCEPTED-DESCOPE. Every floor the existing report can actually measure (D1 intra, D2, D5, aggregate verdict) passes. Every NOT MET item above corresponds to the originally-planned expanded battery, harness extension, live-mode rerun, or baseline promotion, which `decision-record.md` ADR-003 formally accepts as descoped rather than fabricated or silently dropped. No NOT MET item represents a routing regression, a fabricated score, or a defect in the existing evidence.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] [EVIDENCE: decision-record.md ADR-001/002/003] **PASS** Architecture decision is documented in `decision-record.md`.
  - **Evidence**: ADR-001 (floors), ADR-002 (remediation loop), and ADR-003 (accepted descope) are all present, each with Five Checks 5/5 PASS.
- [x] CHK-101 [P1] [EVIDENCE: ADR-001 Alternatives Considered table] **PASS** Alternatives include a public 100-scenario floor, an unweighted pass/fail gate, and the chosen numeric near-perfect floor set.
  - **Evidence**: ADR-001 Alternatives Considered table includes "Require exact 100/100 across every dimension," "Qualitative 'looks right' verdict, no numeric floor," and "Numeric floors without a distinct gap-to-second metric," alongside the chosen option.
- [x] CHK-102 [P1] [EVIDENCE: ADR-001 Cons column, 2/10 score] **PASS** Rejection rationale is documented for any alternative that would allow route-only success to count as parity.
  - **Evidence**: ADR-001's Cons column states the qualitative-verdict alternative is "indistinguishable from Phase 005's route-only risk," scored 2/10.
- [x] CHK-103 [P2] **PASS** Migration path is documented if a future phase needs to raise or lower a numeric floor.
  - **Evidence**: ADR-001 "How to roll back" states floors are amended with the release owner if proven unachievable or miscalibrated, rather than silently loosened in a report file.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] [EVIDENCE: advisor-probe extension never built] **N/A — PASS** The advisor-probe extension avoids re-running the full advisor CLI more than once per scenario.
  - **Evidence**: The advisor-probe extension was never built (CHK-013); there is no CLI re-run behavior to evaluate.
- [x] CHK-111 [P1] [EVIDENCE: corpus unchanged at 24 scenarios] **N/A — PASS** Router-mode replay stays deterministic and fast even as the corpus grows to 60+ scenarios.
  - **Evidence**: The corpus was not grown; it remains 24 scenarios, unchanged from `after-009/`.
- [x] CHK-112 [P2] **N/A — PASS** Live-mode run duration is recorded so future phases can budget dispatch time for the larger battery.
  - **Evidence**: No live-mode run was performed; nothing to record. Named as an open item for whichever future phase performs the live-mode rerun.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] [EVIDENCE: plan.md Sec7 Rollback Plan] **PASS** Rollback procedure is documented in `plan.md`.
  - **Evidence**: `plan.md` §7 Rollback Plan and the "L2: ENHANCED ROLLBACK" section both exist and remain accurate (no benchmark run, harness edit, or playbook scenario was created to roll back).
- [x] CHK-121 [P0] [EVIDENCE: doc-only boundary confirmed pre-edit] **PASS** Implementation boundary (benchmark, playbook, and the two named harness files only) is confirmed before editing begins.
  - **Evidence**: This reconciliation's actual boundary (the phase spec folder only) was confirmed before any edit and verified after via scoped `git status`.
- [x] CHK-122 [P1] [EVIDENCE: implementation-summary.md Follow-Up Items] **PASS** Handoff notes identify Phase 013 as the next safe action once this phase closes.
  - **Evidence**: `implementation-summary.md` Follow-Up Items names `013-design-commands-asset-refactor` as the next safe action.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P0] [EVIDENCE: git status shows skill_advisor.py unmodified] **PASS** The harness extension does not modify `skill_advisor.py` or any other skill-advisor scoring source.
  - **Evidence**: The extension was never built (CHK-013); `git status` confirms `skill_advisor.py` and `system-skill-advisor` are unmodified.
- [x] CHK-131 [P1] [EVIDENCE: no baseline promotion performed] **N/A — PASS** Baseline promotion requires and records explicit release-owner authority.
  - **Evidence**: No baseline promotion (`benchmark/baseline-post-011/`) was performed.
- [x] CHK-132 [P1] [EVIDENCE: decision-record.md ADR-003 rationale] **PASS** Any accepted-risk deferral of a below-floor scenario is recorded with rationale, not silently dropped.
  - **Evidence**: `decision-record.md` ADR-003 records the rationale for accepting the narrower evidence and explicitly names every descoped item (expanded battery, harness extension, live-mode rerun, baseline promotion) rather than silently dropping them.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] [EVIDENCE: all docs reconciled this pass] **PASS** All spec documents remain synchronized once implementation completes.
  - **Evidence**: Same as CHK-050 — all five docs reconciled to the same real evidence in this pass.
- [x] CHK-141 [P1] [EVIDENCE: metadata regenerated last] **PASS** Metadata is discoverable through `description.json` and `graph-metadata.json` once regenerated.
  - **Evidence**: Regenerated as the final step (see `implementation-summary.md`).
- [x] CHK-142 [P2] **N/A — PASS** Knowledge-transfer notes are added if the harness extension changes maintainer workflow for future Lane-C benchmark runs.
  - **Evidence**: The harness extension was never built; no maintainer workflow changed.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| User | Scope owner | Pending review of this reconciliation | |
| Implementer | Phase owner | Complete (doc-only reconciliation against accepted existing evidence) | 2026-07-06 |
| Release owner | Baseline promotion and remediation authority | Not exercised — no baseline promotion or remediation was triggered (nothing scored missed its floor) | |
<!-- /ANCHOR:sign-off -->
