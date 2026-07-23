---
title: "Implementation Summary: system-skill-advisor Routing Research"
description: "Research outcome for the skill-advisor routing diagnosis: the advisor is useful but its confidence is policy-quantized at the 0.82 floor, three P0 correctness defects are named with fixes, and the prioritized plan hands off to 013-skill-advisor-routing-fixes."
trigger_phrases:
  - "skill advisor routing research outcome"
  - "advisor confidence policy floor"
  - "advisor P0 defects handoff"
  - "skill advisor fix plan handoff"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/011-skill-advisor-routing-research"
    last_updated_at: "2026-07-16T08:20:00Z"
    last_updated_by: "claude"
    recent_action: "Documented research outcome and fix-plan handoff"
    next_safe_action: "Plan 013-skill-advisor-routing-fixes against research.md Section 8"
    blockers: []
    key_files:
      - "research/research.md"
      - "spec.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "dr-20260716-054704-skill-advisor-routing"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "REQ-001: holdout 73.08%, confidence dominated by 0.82 floor"
      - "REQ-002: fallback chain traced, hook tests 4/11 red"
      - "REQ-003: no drift, separate eligibility gate confirmed"
      - "REQ-004: no, guard hard-codes deep-loop registry only"
      - "REQ-005: P0-1 through P2-8 delivered to 013"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-skill-advisor-routing-research |
| **Completed** | 2026-07-16 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Ten iterations of deep research now answer whether system-skill-advisor works and where it breaks. The advisor helps: current-source holdout accuracy lands at 73.08% (57/78) with 85.25% selective precision. But the confidence number CLAUDE.md Gate 2 reads as an >=0.8 must-invoke signal is dominated by categorical policy floors rather than an 80% posterior, and three correctness defects plus one unguarded architecture boundary now have named fixes waiting in a sibling packet.

### Confidence Calibration, Quantified

The advisor_recommend pipeline runs a four-layer path (`advisor-server.ts` to `tools/index.ts` to `handlers/advisor-recommend.ts` to `lib/scorer/fusion.ts`) across five weighted lanes that fuse via reciprocal rank fusion, not raw confidence. Public confidence is a separate policy function layered on top: a base score plus floors, and the `0.82` task-intent floor turns out to dominate the number. It led 31% of the full corpus and 48% of the frozen ambiguity slice, at plateau correctness of only 58-65%. Read Gate 2's >=0.8 threshold as "the policy floors fired," not as an empirical probability.

### Three P0 Correctness Defects

The Claude hook's no-brief output contract drifted: the implementation now emits a governance directive where 4 of 11 targeted tests still expect an empty object. The CLI fallback can starve to 1 millisecond, because the primary producer claims the full 2500 ms hook budget and the fallback only gets whatever time is left over, defeating the recovery path exactly when the primary times out. And result-level `ambiguous: true` can coexist with an unattributed leader: the executor-delegation override mutates rankings after `ambiguousWith` attribution but before the final ambiguity boolean, reproducing on 7 of 8 frozen executor routes, with a stale Codex fixture making the parity suite red on top of it.

### The Unguarded Metadata-Hub Boundary

Routing-registry-drift-guard exists and works, but it only covers system-deep-loop's own projection. Metadata-routed hubs like sk-doc have zero advisor-discovery coverage from that guard, even though sk-doc's own hub-internal vocabulary (12 modes, 113 aliases, 12 router signals) passes a strict check from `parent-skill-check.cjs`. Hub-internal parity being green tells you nothing about whether the advisor can discover that hub. The fix is a behavioral discovery fixture battery per hub, not mirroring the 113 aliases into `graph-metadata.json`, which would duplicate registry-owned vocabulary and encode the wrong invariant for two-stage routing.

### Threshold Tuning Ruled Out, Fix Plan Handed Off

A 12-cell grid over confidence {0.78, 0.80, 0.82} and uncertainty {0.30, 0.35, 0.40} produced identical holdout outcomes, and pushing confidence to 0.84 cost 24 points of coverage for 2.85 points of precision. External threshold tuning cannot fix any of the findings above. The prioritized, dependency-ordered plan (P0-1 through P2-8) names target files, verification commands and an acceptance matrix in `research/research.md` Section 8 through Section 10, and hands off to sibling packet `013-skill-advisor-routing-fixes` for the build.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md` | Modified | Replaced the auto-seeded stub with a research-charter spec recording the calibration outcome, the three P0 defects and the handoff to 013 |
| `implementation-summary.md` | Created | Documents the research outcome so anyone resuming this packet doesn't have to re-read all 10 iterations first |

The research deliverables themselves (`research/research.md`, `research/deep-research-dashboard.md`, `research/findings-registry.json`, `research/iterations/`, `research/deltas/`) already existed going into this documentation pass and are unchanged.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work ran as an autonomous deep-research loop against 10 of 10 planned iterations, cli-codex / gpt-5.6-sol at reasoning=high, service_tier=fast. Iteration 7 hit an execution-path error trying to run a joined calibration query, and iteration 8 recovered with a fresh source-loaded run instead of trusting the stale dist or the two stale committed baselines. Iterations 9 and 10 hardened the ambiguity-coherence finding down to a specific pre-finalization mutation and quantified it against 8 frozen executor-delegation fixtures. The loop never approached its 0.05 convergence threshold, newInfoRatio stayed between 0.24 and 0.92, so it stopped on `maxIterationsReached` rather than saturation. No code changed during research. Every improvement in Section 8 is a proposal for the implementation packet.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Report confidence as "policy floors fired" rather than an 80% posterior | Plateau correctness at the 0.82 floor sits at 58-65% across corpus slices, so reading confidence as an ordinal probability overstates trust |
| Bundle the three P0 correctness defects into one implementation packet | They're small, evidenced and unblock trustworthy testing of everything else downstream (research.md Recommendation 1) |
| Rule out threshold tuning as a fix path | A 12-cell grid over confidence and uncertainty produced identical holdout outcomes, and raising confidence to 0.84 cost 24 points of coverage for 2.85 points of precision |
| Scope the metadata-hub discovery gap as a behavioral fixture battery, not alias mirroring | Mirroring all 113 hub aliases into `graph-metadata.json` would duplicate registry-owned vocabulary, inflate lexical evidence and encode the wrong invariant for two-stage routing |
| Hand the fix plan to sibling packet 013-skill-advisor-routing-fixes instead of applying changes here | This packet's charter was research only. Researched files stayed read-only for the whole loop |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Research question coverage | PASS. 5/5 charter questions answered with file:line evidence across 10 iterations (research.md Sections 2, 14) |
| Convergence | Did not reach the 0.05 stop-ratio. Stopped at `maxIterationsReached` after 10/10 iterations, ratios ranged 0.24-0.92 with no monotonic decline |
| Calibration baseline freshness | Both committed baselines (`bench/scorer-calibration-baseline.json`, `scorer-eval-baseline.json`) found stale against the clean 193-row corpus. Iteration 8 ran a fresh joined evaluation instead of trusting them |
| Threshold-grid sensitivity | Identical holdout outcomes across confidence {0.78, 0.80, 0.82} times uncertainty {0.30, 0.35, 0.40}, confirming tuning alone cannot fix the calibration finding |
| Errors encountered | 1 (iteration 7, execution-path unavailable). Recovered in iteration 8 with a fresh joined calibration run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No code changed.** Every improvement in `research/research.md` Section 8 is a proposal. Implementation is scoped to sibling packet `013-skill-advisor-routing-fixes`, which does not exist yet.
2. **Empirical numbers come from a frozen filesystem projection.** Built-in semantic scoring was disabled for the ratchet run, so live daemon-backed numbers may differ modestly from the 73.08% holdout figure.
3. **The Spec Kit Memory daemon was unhealthy for the whole session** (exit 75 warm-only timeouts). Prior packet memory did not auto-load. This became direct evidence for the transport-resilience findings rather than blocking the research.
4. **A better-sqlite3 Node ABI mismatch** forced the executor-delegation test into filesystem-projection fallback during iteration 10. The red stale-fixture failure is consistent with checked-in hub metadata, not a defect in the fallback path itself.
<!-- /ANCHOR:limitations -->
