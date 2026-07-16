---
title: "Verification Checklist: Advisor-Scorer Saturation-Class Root Fix (WS1–WS6) + Advisor Projection Vocab"
description: "Forward-looking Level 2 verification checklist for the shared advisor-scorer saturation-class root fix and Layer 1b projection vocabulary. All items are pending; evidence is filled in as each workstream executes."
trigger_phrases:
  - "advisor scorer root fix checklist"
  - "post-cap demotion verification"
  - "executor delegation resolver checklist"
importance_tier: "high"
contextType: "implementation"
status: "Closed"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/016-skill-advisor-tuning/001-scorer-saturation-root-fix"
    last_updated_at: "2026-07-07T17:37:00.000Z"
    last_updated_by: "opus-4.8"
    recent_action: "Pre-implementation spec authored"
    next_safe_action: "Await advisor-lane standdown, then execute WS3→WS1→re-run→WS2/4/5/6"
---
# Verification Checklist: Advisor-Scorer Saturation-Class Root Fix (WS1–WS6) + Advisor Projection Vocab

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

> This is a pre-implementation checklist. Every item is intentionally unchecked; evidence is recorded as each workstream lands.

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md — REQ-001..REQ-008, SC-001..SC-004, the six-workstream scope, and the Layer 1b projection change
- [ ] CHK-002 [P0] Technical approach defined in plan.md — leverage order, post-cap demotion architecture, re-baseline-first discipline, rollback per workstream
- [ ] CHK-003 [P1] GATE confirmed — the live advisor-TS lane has stood down and a fresh 193-row baseline is captured before any scorer edit

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] WS1 post-cap demotion attempted then reverted — Design A was implemented and measured, then reverted; the saturation thesis was empirically falsified [EVIDENCE: net -2 on the 193-row corpus, 0 of 6 target regressions fixed and 2 broken; superseded by audit-phrase calibration in commit e2711fb580]
- [ ] CHK-011 [P0] WS2 resolver replaces the inline `-3.0` regex — `executor-delegation.ts` builds its alias table from metadata + model profiles and applies a post-fusion override
- [ ] CHK-012 [P1] WS4 graph-causal order fixed — score-first/traversal-second; `bestPositiveStrengthByTarget` replaces boolean `seen`
- [x] CHK-013 [P1] WS1 escalation decision recorded — Design A was falsified (attempted then reverted), not shipped; Design B was not pursued because the falsified thesis left no ranking-by-negative-evidence case [EVIDENCE: Design A net -2, reverted; parity landed via commit e2711fb580]

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Fresh 193-row baseline captured — tsCorrect, pythonCorrect, regressions, and holdout recorded after Layer 1b lands
- [ ] CHK-021 [P0] Verbose-saturation fixtures pass — cli-opencode, colon review loop, webflow CMS, benchmark-mode assert topSkill + demoted contribution
- [ ] CHK-022 [P1] Executor-delegation parity fixture passes — shared across TS native tests and Python parity
- [ ] CHK-023 [P1] Robustness guard clean — advisor_validate + per-skill = 0, memory-save + read-only-review buckets = 0, no near-tie increase, no UNKNOWN rise

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-024 [P0] WS3 parity superseded — parity landed via audit-phrase calibration rather than this packet's mechanism [EVIDENCE: commit e2711fb580 corrected the legacy 197-prompt label to the true 193-row corpus, resolved regressions rr-iter3-100 and rr-iter3-104, and left four accepted divergences]
- [ ] CHK-025 [P1] WS5 eval hardening landed — empirical ambiguity slice, schema-enforced buckets, ratcheted baseline, frozen independent holdout ≥60 rows
- [ ] CHK-026 [P1] WS6 semantic_shadow proven-or-frozen — paired ablation + holdout with pinned providerModelId + fail-on-skip; weight kept low until evidence

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets or credentials touched — changes are scoped to TypeScript scorer modules, JSON fixtures/baselines, and advisor graph-metadata/SKILL frontmatter
- [ ] CHK-031 [P0] Memory daemon and database untouched — only one deterministic embedding path is restored for the WS6 ablation; no DB or daemon mutation
- [ ] CHK-032 [P1] Archived codex executor cannot be default-routed — it abstains/redirects on "use codex" and is never routable

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized — the same six-workstream scope, leverage order, and Layer 1b change across all three docs
- [ ] CHK-041 [P1] Implementation summary updated with actual evidence — status, files changed, verification, and deviations filled in once the work executes
- [ ] CHK-042 [P2] Divergence ledger recorded — any surviving parity regression is documented as reviewed-accepted with rationale

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Changes stay inside the advisor scorer scope — `lib/scorer/*.ts`, eval fixtures/baselines, and the two hubs' advisor metadata; Layer 1 (packet 024) is not re-touched
- [ ] CHK-051 [P2] Re-baseline artifact preserved — the fresh 193-row baseline is stored so later runs compare against it, not the stale pre-Layer-1b numbers

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 2/9 resolved (falsified/superseded) |
| P1 Items | 10 | 1/10 resolved (falsified) |
| P2 Items | 3 | 0/3 |

**Status**: Closed — WS1 saturation thesis falsified (WS1 items attempted-then-reverted); WS3 parity superseded via commit e2711fb580; remaining workstreams not executed
**Verification Date**: Pending
**Verified By**: Pending

<!-- /ANCHOR:summary -->
