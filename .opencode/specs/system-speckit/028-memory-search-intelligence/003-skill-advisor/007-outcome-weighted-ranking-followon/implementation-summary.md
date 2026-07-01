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
    recent_action: "Built shadow-only modules, verified typecheck and scorer suite green"
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
    completion_pct: 85
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
| **Completed** | 2026-06-19 (shadow-only build, live promotion NO-GO) |
| **Level** | 3 |
| **Status** | complete |
| **Status detail** | Shipped shadow-only and default-off. 2 tasks (the emitter runtime seam Q-001 and sibling 004's Beta primitive) stay PENDING on external gates. Live promotion is a recorded NO-GO. See What Was Built and Known Limitations below. |
| **Candidate count** | 3 (all built shadow-only, 2 sub-gates pending) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

**CORRECTION (2026-07-01, drift audit remediation):** the narrative below describes what this child originally claimed to ship. A repo-wide search (glob + grep across the whole repository, not just this child's expected paths) found only `scripts/skill-outcome-fold-tick.mjs` actually present in the tree. `lib/scorer/skill-outcome-store.ts`, `lib/scorer/outcome-weighted-rerank.ts`, and `tests/scorer/outcome-weighted-ranking.vitest.ts` do not exist anywhere in the repository under this or any renamed/moved path. Since the fold-tick script depends on "the compiled fold core... present under dist/" (its own header comment) and that core was never created, the script that does exist has no store to operate on and is not functional as shipped. The claims below of a durable store, shadow re-rank, and a passing 20-test suite are drift — they describe work that was never actually committed, not a renamed or relocated implementation.

**CORRECTION (2026-07-01, drift-audit remediation -- pass 2 / git-history reconciliation):** the pass-1 correction above is itself incomplete. The current tree absence is real, but git history proves the store and rerank were built and later deleted: `skill-outcome-store.ts` (364 lines) and `outcome-weighted-rerank.ts` (124 lines) were built at commit `03d0b01eb6`, wired live-adjacent by touching `fusion.ts` and `advisor-validate.ts` at commit `09626fc921`, then deleted at commit `8efcde0e6b` along with 4 test files and the shadow-weight promoter. The delete-commit measurement was: "MRR delta +0.005 to +0.008 versus the metric's own noise band of SD 0.0237 (4x larger), and right-skill@3 = 0.000 across all 90 runs... the lever is structurally inert despite being fully wired." This is the strongest negative result of the four features corrected in this audit, and the operator explicitly decided not to revive it.

**Superseded by the pass-2 correction above.** The shadow-only build of the one genuine Skill Advisor external follow-on was actually delivered, then deleted: a net-new execution-success record (distinct from recommendation-acceptance), a durable append-only skill-outcome store with a replay-safe order-independent fold, an idempotent out-of-process ambient-tick cadence driver, an outcome-weighted shadow re-rank (`similarity x reliability x penalty`, fresh skill = 0.5) over a Beta adapter seam, query-scored failure-mode recall and a default-off query-length BM25 calibration - all built at `03d0b01eb6`, wired live-adjacent at `09626fc921`, then deleted at `8efcde0e6b` after the measured NO-GO. Only the out-of-process fold-tick script (`scripts/skill-outcome-fold-tick.mjs`) is still present in the current tree; it is orphaned without its (deleted) store dependency. The two sub-gates noted PENDING in the original claim - the emitter's runtime trigger seam (Q-001 undecided) and the shared Beta-posterior reliability math (owned by sibling 004) - are moot: this feature is not being revived, per operator decision, so those gates are not being pursued.

### Candidate Status

| Candidate | Status | Remaining gate |
|-----------|--------|------|
| SA-outcome-weighted-ranking | DELETED AFTER MEASURED NO-GO - built at `03d0b01eb6`, wired live-adjacent at `09626fc921`, deleted at `8efcde0e6b`; current tree absence remains real | Do not revive: delete-commit result was MRR delta +0.005 to +0.008 versus SD 0.0237, with right-skill@3 = 0.000 across all 90 runs |
| SA-scheduler-ambient-tick | PARTIAL - `scripts/skill-outcome-fold-tick.mjs` exists but has no store to operate on (non-functional as shipped) | Requires the store above before it can run meaningfully; sibling 004 C4-seam promoter must also be built to ride the shared driver |
| ADV-bm25-calibration | UNVERIFIED - claimed shipped behind a default-off flag in `lib/scorer/lanes/bm25.ts`; not independently re-confirmed as part of this correction | A measured telemetry win + lane promotion (separate gate) |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `lib/metrics.ts` | Claimed Modified | Added `SkillExecutionOutcomeRecord` + `createSkillExecutionOutcomeRecord` + validator beside the untouched acceptance record - not independently re-confirmed by this correction |
| `lib/scorer/skill-outcome-store.ts` | DELETED | Built at `03d0b01eb6` as a 364-line durable append-only store, wired live-adjacent at `09626fc921`, deleted at `8efcde0e6b`; current tree absence is expected after the measured NO-GO |
| `lib/scorer/outcome-weighted-rerank.ts` | DELETED | Built at `03d0b01eb6` as a 124-line shadow re-rank, wired live-adjacent at `09626fc921`, deleted at `8efcde0e6b`; current tree absence is expected after MRR delta +0.005 to +0.008 versus SD 0.0237 and right-skill@3 = 0.000 across all 90 runs |
| `lib/scorer/lanes/bm25.ts` | Claimed Modified | Query-length-bucketed logistic midpoint behind a default-off flag - not independently re-confirmed by this correction |
| `scripts/skill-outcome-fold-tick.mjs` | Created (confirmed present) | Out-of-process cron/maintenance fold-tick runner - exists but orphaned; its store dependency (`skill-outcome-store.ts`) was created at `03d0b01eb6` then deleted at `8efcde0e6b`, not "never created" |
| `tests/scorer/outcome-weighted-ranking.vitest.ts` | DELETED | One of the 4 test files deleted at `8efcde0e6b` after the measured NO-GO: MRR delta +0.005 to +0.008 versus SD 0.0237, right-skill@3 = 0.000 across all 90 runs |

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
| `tests/scorer/outcome-weighted-ranking.vitest.ts` exists | FAIL: file not found anywhere in the repository - the claimed "PASS: 20/20" below could not have run against real tests |
| `lib/scorer/skill-outcome-store.ts` exists | FAIL: file not found anywhere in the repository |
| `lib/scorer/outcome-weighted-rerank.ts` exists | FAIL: file not found anywhere in the repository |
| `scripts/skill-outcome-fold-tick.mjs` exists | PASS: file present, but depends on the missing store's compiled `dist/` output, so it is not currently runnable end to end |
| Remaining checks below (typecheck, broad scorer suite, live-sort guardrail, comment hygiene, `validate.sh --strict`) | UNVERIFIED by this correction - the original claims are preserved here for reference only, not re-confirmed: "npm run typecheck PASS 0 errors", "Broad scorer suite PASS tests/scorer 15 files / 109 tests", "Broad regression 0 NEW failures 181 pass", "Live-sort guardrail PASS byte-identical", "Comment hygiene PASS 0 violations", "validate.sh --strict PASS 0 errors / 0 warnings" |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

**Superseded by the pass-2 correction above - the limitations below described the state as of the original shadow-only build, before it was measured and deleted at `8efcde0e6b`.** Preserved for historical context only:

1. **Shadow-only, not live (historical).** All modules were built but nothing affected the live fused sort or the live BM25 weight. The re-rank was a separate module the live path never imported. The BM25 calibration was default-off. (Store and rerank modules no longer exist in the tree; see pass-2 correction.)
2. **The emitter runtime seam was undecided (Q-001, historical).** This is moot now - the feature was measured inert and deleted, not revived, so the emitter seam decision is no longer being pursued.
3. **The shared Beta primitive was not landed at the time (historical).** `beta-reliability.ts` (sibling 004) has since been built and remains in the tree, but the outcome-weighted rerank that would have consumed it was deleted, so this is moot.
4. **No benefit number was available at the time (historical).** A real benefit number now exists: the delete-commit measured MRR delta +0.005 to +0.008 versus noise SD 0.0237 (4x larger), and right-skill@3 = 0.000 across all 90 runs - "structurally inert." That measurement is why the feature was deleted, not because a benchmark was never run.
<!-- /ANCHOR:limitations -->
