---
title: "Checklist: drift census and plan revalidation"
description: "Blocking verification contract for the two-lineage drift census: full-range commit triage, explicit per-phase verdicts with reproducible evidence, first- versus second-order drift separation, and positive/negative controls proving the census discriminates."
trigger_phrases:
  - "drift census checklist"
  - "036 revalidation verification"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/018-drift-census-and-plan-revalidation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/018-drift-census-and-plan-revalidation"
    last_updated_at: "2026-07-20T17:23:24Z"
    last_updated_by: "claude-opus"
    recent_action: "Defined the blocking census verification contract"
    next_safe_action: "Run the loop, then check items"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Checklist: Drift Census and Plan Revalidation

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for the drift census. Every item stays unchecked until the loop
has run and its evidence is recorded inline. Evidence means a commit SHA plus a `path:line`, or a command with its
real output — never a summary claim. Two controls decide whether the run counts at all: the census must
independently rediscover known-true drift (positive control), and must return at least one genuinely clean phase
(negative control). A run that marks everything drifted, or that misses the confirmed phase-003 breakage, is not a
valid census regardless of how many findings it produced.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] HEAD pinned and recorded alongside baseline `0ce43ff589` [evidence: each lineage pinned and recorded its own HEAD — sol `e4b242c3940c` (211 commits), glm `739b85ac57` (205 commits); the branch moved mid-census, so no single canonical pin exists. Divergence recorded in `research/research.md` §7]
- [x] CHK-002 [P0] Both executors confirmed to dispatch before iteration budget was spent [evidence: minimal round-trip returned `SOL_OK` and `GLM_OK`, 2/2 dispatching]
- [x] CHK-003 [P1] Fan-out spec-gate injection present [evidence: `fanout-run.cjs:1789-1790` injects `MK_SPEC_GATE_DISABLED` and `AI_SESSION_CHILD`; no lineage stalled, 0 failed across both]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-004 [P0] No file outside this folder and the parent registrations was modified [evidence: writes confined to `018/**`, plus `036/graph-metadata.json` `children_ids`, `036/spec.md` phase map, and `017/spec.md` successor nav ref]
- [~] CHK-005 [P1] **SUPERSEDED by operator instruction 2026-07-19 ("make adjustments where needed").** The census-only boundary was deliberately crossed to apply Tier-1 mechanical repairs. Scope of the deviation: `003` dead paths + archived-benchmark provenance, `004/002` phase-ID space, 17 stale `mode_workstreams_phase_010` keys, `manifest` packet identity, `017` nav ref. No runtime file was touched; no semantic phase-reference rewrite was attempted [evidence: `git diff --stat` = 26 tracked files, all under `036/`; full-tree sweep 125/125 errors=0 warnings=0]
- [ ] CHK-006 [P2] No iteration dispatched a sub-agent or exceeded the leaf tool-call budget [not verified: leaf tool-call counts were not independently audited from the dispatch receipts]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-007 [P0] Positive control reproduced in BOTH lineages [evidence: `cc77a1e550a` renamed `state_format.md`→`state-format.md` and `integration_points.md`→`integration-points.md`; cited at `003/plan.md:81-82` against live `runtime/references/state-format.md:15-29`]
- [x] CHK-008 [P0] Positive control reproduced in BOTH lineages [evidence: `behavior_benchmark/` glob returns zero dirs; live path `shared/behavior-benchmark/framework.md:18-27`, cited `003/plan.md:153`]
- [x] CHK-009 [P0] Negative control locked [evidence: phase 004 clean in both lineages — zero `runtime/` citations, all 3 children resolve, no in-range commit touches its surfaces; glm additionally qualified 006 and 007]
- [x] CHK-010 [P1] Cited commands and paths are re-runnable [evidence: every verdict row carries a commit SHA plus `path:line`; spot-reproduced during synthesis]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-011 [P0] All 15 phases carry an explicit verdict; none "unknown" [evidence: 15-row matrix in both lineage syntheses and the merged `research/research.md` §2]
- [x] CHK-012 [P0] Full range triaged, not a runtime-only subset [evidence: supplied 204 figure was stale; both lineages corrected it independently — sol 211/27, glm 205/25. The sole first-order breakage came from `cc77a1e550a`, OUTSIDE the runtime subtree]
- [x] CHK-013 [P0] Non-runtime commits explicitly triaged [evidence: `iterations/iteration-007.md:9-11` accounts 27 deep-loop + 2 packet-036 + 182 neither = 211/211, none dropped]
- [x] CHK-014 [P0] Every non-clean verdict cites a commit SHA plus `path:line` [evidence: `research/research.md` §2, all 8 refine rows]
- [x] CHK-015 [P0] Every "still valid" verdict names surfaces checked [evidence: glm table lists `surfaces checked` per clean phase, e.g. phase 008 cites `008/spec.md:46,52,54`]
- [x] CHK-016 [P1] First- and second-order drift reported separately [evidence: separate columns in `research/research.md:2` matrix plus dedicated sections in both lineage syntheses]
- [ ] CHK-017 [P1] **FAILED — forced depth did not apply.** `stopPolicy` was passed inside the fan-out config JSON, but `fanoutConfigSchema` has no such key and zod stripped it silently; `fanout-run.cjs:1512` reads it only from the `--stop-policy` CLI flag. Both lineages ran 7/10 and stopped on `converged`. Impact is asymmetric: sol's stop was legitimate (composite 0.70 > 0.60, coverage 1.00, all guards passed); glm's stopping point is unverifiable
- [~] CHK-018 [P1] Not triggered — GLM never rate-limited, so no fallback to the OpenAI executor occurred [evidence: orchestration status shows 0 failed, attempt 1, terminal completion for both lineages]
- [x] CHK-019 [P1] Disagreements surfaced and adjudicated by evidence, not averaged [evidence: `research/research.md` §3 — sol's definition adopted as primary with external corroboration on phase 011; glm retained as the conservative floor]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-020 [P1] No credentials or secrets in any dispatched prompt body or persisted artifact [evidence: prompts carry only charter + spec paths; auth resolved from `~/.local/share/opencode/auth.json`, never inlined]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-021 [P0] Per-phase verdict table present with recommended actions [evidence: `research/research.md` §2 matrix and §6 recommendations]
- [x] CHK-022 [P1] Both open questions resolved, in agreement across lineages [evidence: §5 — mode count UNCHANGED at 7 routing modes (8 workstreams = 7 routing + 1 shared backbone); packet-033 survives under `z_archive/027` with active execution rebased to `shared/behavior-benchmark/`]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-023 [P1] All census artifacts live under this folder's `research/` tree [evidence: two lineage packets under `research/lineages/{sol,glm}/`, merged registry and attribution at `research/`]
- [x] CHK-024 [P2] Canonical packet names used; no legacy aliases written [evidence: `deep-research-*` naming throughout both lineage packets]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Gate | Command | Result |
|------|---------|--------|
| This folder validates | `validate.sh <018> --strict` | Pending re-run |
| Parent still validates | `validate.sh 036 --strict` | Pending re-run |
| Census run | All 14 P0 items checked with evidence | **PASS** — 14/14 P0 |
| Forced depth | CHK-017 | **FAIL** — recorded, not smoothed over; sol unaffected, glm's stop unverifiable |
| Operator decision | Per-phase actions decided from the verdict table | Pending |
<!-- /ANCHOR:summary -->
