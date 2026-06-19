---
title: "Implementation Summary: Skill Advisor Outcome-Weighted Ranking Follow-On"
description: "Implementation summary for the aionforge-procedural follow-on: the execution-success record + durable skill-outcome store + replay-safe fold + idempotent ambient tick + outcome-weighted shadow rerank + query-scored failure-mode recall + default-off BM25 query-length calibration are BUILT shadow-only. Two gates stay PENDING (the emitter runtime seam and sibling 004's Beta primitive). No live ranking change is claimed."
trigger_phrases:
  - "advisor outcome ranking implementation summary"
  - "advisor ambient tick status"
  - "advisor bm25 calibration status"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/003-skill-advisor/007-outcome-weighted-ranking-followon"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Built shadow-only modules; verified typecheck and scorer suite green"
    next_safe_action: "Wire emitter seam and sibling 004 Beta primitive, then benchmark"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-003-007-outcome-weighted-ranking"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Skill Advisor Outcome-Weighted Ranking Follow-On

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level3-arch | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `028-memory-search-intelligence/003-skill-advisor/007-outcome-weighted-ranking-followon` |
| **Completed** | 2026-06-19 (shadow-only build; live promotion NO-GO) |
| **Level** | 3 |
| **Status** | IMPLEMENTED shadow-only / default-off — 2 tasks PENDING on external gates |
| **Candidate count** | 3 (all built shadow-only; 2 sub-gates pending) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The shadow-only build of the one genuine Skill Advisor external follow-on landed: a net-new execution-success record (distinct from recommendation-acceptance), a durable append-only skill-outcome store with a replay-safe order-independent fold, an idempotent out-of-process ambient-tick cadence driver, an outcome-weighted shadow re-rank (`similarity x reliability x penalty`, fresh skill = 0.5) over a Beta adapter seam, query-scored failure-mode recall, and a default-off query-length BM25 calibration. Everything is shadow-only / default-off: the live fused sort is byte-identical (proven by test) and the BM25 lane stays shadow-only with a zeroed fusion weight. Two sub-gates stay PENDING — the emitter's runtime trigger seam (Q-001 undecided) and the shared Beta-posterior reliability math (owned by sibling 004, not yet landed; the adapter returns the neutral fresh value until it is). Live promotion remains NO-GO until real execution-success data plus a benchmark earn it.

### Candidate Status

| Candidate | Status | Remaining gate |
|-----------|--------|------|
| SA-outcome-weighted-ranking | IMPLEMENTED shadow-only (record + store + fold + shadow re-rank + failure-mode recall) | Emitter runtime seam (Q-001) + sibling 004 Beta primitive wiring; then a benchmark for live promotion |
| SA-scheduler-ambient-tick | IMPLEMENTED (idempotent fold-tick core + out-of-process `.mjs` runner; double-tick no-op) | Sibling 004 C4-seam promoter must be built to ride the shared driver |
| ADV-bm25-calibration | IMPLEMENTED (query-length-bucketed midpoint behind a default-off flag; byte-identical default; telemetry-only) | A measured telemetry win + lane promotion (separate gate) |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `lib/metrics.ts` | Modified | Added `SkillExecutionOutcomeRecord` + `createSkillExecutionOutcomeRecord` + validator beside the untouched acceptance record |
| `lib/scorer/skill-outcome-store.ts` | Created | Durable append-only store, replay-safe fold, query-scored failure-mode recall, idempotent ambient-tick core |
| `lib/scorer/outcome-weighted-rerank.ts` | Created | Shadow re-rank + neutral Beta adapter seam; default-off flag |
| `lib/scorer/lanes/bm25.ts` | Modified | Query-length-bucketed logistic midpoint behind a default-off flag (byte-identical default) |
| `scripts/skill-outcome-fold-tick.mjs` | Created | Out-of-process cron/maintenance fold-tick runner |
| `tests/scorer/outcome-weighted-ranking.vitest.ts` | Created | 20 unit tests: record distinction, fold idempotence, ambient-tick no-op, Beta blend, recall, live-sort guardrail, BM25 calibration |

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The packet was delivered by grounding the aionforge-procedural candidate against the current advisor evidence. The existing advisor signal is recommendation acceptance, not execution success, so the plan starts with a net-new emitter and store instead of treating acceptance as a proxy. The decision record captures the live-promotion NO-GO: no live rerank, no live BM25 claim and no benefit number until data plus a benchmark exist.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Build a net-new execution-success emitter before ranking | The existing `AdvisorHookOutcomeRecord` only records accepted, corrected or ignored recommendations. It does not prove the task succeeded. |
| Keep outcome ranking shadow-only | The data source is absent today, so changing live order would be unmeasured. |
| Reuse the shared f64 Beta primitive | The integer scorer rejects fractional inputs, and a third Beta copy would drift from the shared 004/D2 contract. |
| Use one shared ambient tick | The store fold and sibling C4 promoter need the same out-of-process cadence. |
| Treat BM25 calibration as telemetry-only | The BM25 lane is shadow-only with zero live weight until a separate promotion gate earns it. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run typecheck` | PASS: 0 errors (unchanged from baseline) |
| New unit tests | PASS: 20/20 (`tests/scorer/outcome-weighted-ranking.vitest.ts`) |
| Broad scorer suite | PASS: `tests/scorer` 15 files / 109 tests green (baseline was 14/89) |
| Broad regression `tests/scorer tests/legacy` | 0 NEW failures: 181 pass; the 2 failures (skill-graph weight-band drift + 197-prompt corpus parity) fail identically at HEAD |
| Live-sort guardrail | PASS: `scoreAdvisorPrompt` byte-identical with/without store data (test) |
| Comment hygiene | PASS: 0 violations on all changed files |
| Live-ranking claim | PASS: none made — shadow-only/default-off; live promotion NO-GO |
| `validate.sh --strict` | PASS: 0 errors / 0 warnings |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Shadow-only, not live.** All modules are built but nothing affects the live fused sort or the live BM25 weight. The re-rank is a separate module the live path never imports; the BM25 calibration is default-off.
2. **The emitter runtime seam is undecided (Q-001).** The record contract + append/record write-path exist, but which post-task signal fires the emitter is left pending — so no execution-success data accumulates yet and the re-rank stays inert (fresh 0.5 everywhere).
3. **The shared Beta primitive is not landed.** Sibling 004 owns it; the adapter seam returns the neutral fresh value until it is wired (no fork). Reliability is uniform 0.5 until then, so the shadow order equals the similarity order.
4. **No benefit number is available.** Every leverage claim remains structural until real data and a benchmark exist; BM25 calibration is prove-first with no telemetry-delta claimed.
<!-- /ANCHOR:limitations -->
