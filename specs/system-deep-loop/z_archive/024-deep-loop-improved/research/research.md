# Research Report: Perfecting deep-loops/030-deep-loop-improved (Generation 2 — Forced-Depth Fan-Out Synthesis)

**Spec Folder:** `.opencode/specs/deep-loops/030-deep-loop-improved`
**Mode:** 2-lineage fan-out, generation 2 (RESTART — see §1.1), `glm` = zai-coding-plan/glm-5.2 @ xhigh, `gpt` = openai/gpt-5.5-fast @ high
**Configured:** maxIterations=35 (forced), convergenceThreshold=0.01 (telemetry-only), **stopPolicy=max-iterations**
**Run window:** 2026-07-01T07:15:47Z (dispatch) – 2026-07-01T07:39:02Z (gpt terminal) / ~07:34Z (glm real completion) — **orchestrator process itself did not exit until ~09:02Z; see §6.3**
**Generation-1 report (preserved, do not delete):** `research/research_archive/20260701T071133Z-gen1/research.md` (26 findings, F-001..F-019, G-001..G-009)
**Date compiled:** 2026-07-01

---

## 1. Executive Summary

This is round 2 of a two-round forced-depth research effort on the same packet. Round 1 (archived at `research_archive/20260701T071133Z-gen1/`) legally converged early (glm: 18 iterations, gpt: 11) on a question-coverage/entropy signal independent of `convergenceThreshold`. Round 2 forced `stopPolicy=max-iterations` on both lineages, guaranteeing exactly 35 real iterations each — confirmed genuine, not merely claimed (§2).

**Both lineages hit real 35-iteration depth**, and the forced depth paid off: glm alone surfaced **13 net-new findings** beyond round-1's baseline (its own iteration 034 delta inventory), and gpt independently surfaced **12 clean, evidence-cited findings**, 2 of which (comment-hygiene locations beyond the original 6; the `009` remediation phase's own metadata staleness) are genuinely new since round 1.

**Round 2 also surfaced two brand-new, more severe bugs in the research tooling itself**, found only because this run pushed depth and because the orchestrating session cross-checked live process state rather than trusting self-reported completion (§6.1, §6.2):

1. **glm's own synthesis step never ran to completion.** Its internal JSONL narrates `max_iterations_reached` → `synthesis_complete` at iteration 35, but `deep-research-findings-registry.json` was never updated past its INIT-time empty state (0 keyFindings, all 8 openQuestions still `"open"`), and `research.md`/`deep-research-dashboard.md`/`resource-map.md` were never written at all. The 35 iterations of real, substantive, evidence-cited work exist ONLY as raw `iterations/iteration-0NN.md` files — this report had to reconstruct glm's findings directly from those files rather than from its (empty) registry.
2. **The fan-out orchestrator hung for over an hour after both underlying CLI subprocesses had already exited.** gpt settled cleanly (`orchestration-status.log` "completed" event, `terminal:true`, at 07:39:02Z). glm's own subprocess also exited (confirmed via live `ps`/`lsof` — no `opencode run` process for either lineage remained), yet the orchestrator's ledger never recorded a "completed" event for glm, and the top-level `fanout-run.cjs` process (and its tsx-loaded child) stayed alive, idle, for ~1h20m+ past both lineages' real completion, never writing `orchestration-summary.json` and never exiting on its own. It was manually terminated by this session (`kill -TERM`) so the run could be synthesized. `fanoutConfig.lagCeilingMs` was left at its default (0 = disabled) — there is no active stall-watchdog that would have caught this.

Also confirmed this round: **round-1's Tier-0 #1 "merge silent-drop" bug is genuinely FIXED** in live code (`fanout-merge.cjs`'s `normalizeRegistrySchema` + `reconstructReviewRegistryFromState`, shipped by `009/001-fanout-merge-schema-tolerance`) — verified both by glm's own code-read (iteration 010) and independently by this session re-running `fanout-merge.cjs` against generation-2's registries, which produced no schema-mismatch warning (glm's registry is genuinely empty, not mis-shaped). Of round-1's 4 "Tier 0 immediate" backlog items, only this one shipped; the other 3 (`009/002` timeout override, `009/003` comment-hygiene + salvage-naming) remain scaffolded but unimplemented as of this run (§5).

---

## 1.1 Lifecycle Decision: RESTART (not resume) — record for the reconciliation trail

Both generation-1 lineages had already produced a lineage-level `research.md` synthesis plus a terminal `converged`/`legal_convergence` JSONL event before this dispatch began — a textbook "completed session." `deep_research_auto.yaml`'s own documented `on_completed_session` branch is `halt: true`, with message *"Completed deep-research packet detected. Archive or replace the existing research/ tree before starting a new session"* (`deep_research_auto.yaml:276-279`) — resume is contractually reserved for continuing a still-active lineage, not extending a session that already reached synthesis. Restart was therefore the only clean, documented path.

**What was archived (moved, not deleted), matching the documented `on_restart` mechanic** (`mkdir -p {archive_root} && mv {packet_dir} {archive_root}/{timestamp_slug}`, `deep_research_auto.yaml:268`), applied at whole-research-tree granularity since fan-out has no single `packet_dir`:
- `research/lineages/glm/`, `research/lineages/gpt/` (full generation-1 lineage trees)
- `research/research.md`, `resource-map.md`, `deep-research-findings-registry.json`, `fanout-attribution.md`, `orchestration-status.log`, `orchestration-summary.json`, `observability-events.jsonl`

All preserved at `research/research_archive/20260701T071133Z-gen1/`.

**Consequence:** generation 2 minted fresh session IDs and its own finding-ID schemes (glm: `B-001`..`B-013`; gpt: `R2-GPT-001`..`R2-GPT-012`) with no memory of generation-1's `F-00N`/`G-00N` IDs. **§7 below is the explicit crosswalk** the operator asked for — the remediation phase (`009-research-backlog-remediation`, 10 planned children) that already cites generation-1 IDs throughout its children's `spec.md` files does **not** need any edits: every citation found (`grep -rn` across all 10 children) already resolves through the archived path `research/research_archive/20260701T071133Z-gen1/research.md`, which this restart preserved byte-for-byte. Nothing goes stale. §7 additionally maps each generation-1 ID to its generation-2 confirmation/refinement for anyone extending the 009 children with round-2 evidence.

---

## 2. Iteration Count Verification (genuine, not claimed)

| Lineage | Claimed | Real padded iteration files on disk | JSONL `type:"iteration"` records | Terminal event | Registry `metrics.iterationsCompleted` |
|---|---|---|---|---|---|
| gpt | 35 | 35 (`iteration-001.md`..`iteration-035.md`, each distinct, 14 lines, real content — verified by diff) | 35 | `orchestration-status.log`: `{"event":"completed","label":"gpt","duration_ms":1395301,"terminal":true}` at 07:39:02Z | **35** ✓ |
| glm | 35 | 35 (`iteration-001.md`..`iteration-035.md`, each distinct, 1.3–2.8KB, substantive cited content — verified by direct read of all 35) | 35 (`deep-research-state.jsonl`, final record: `{"event":"max_iterations_reached","run":35,"stopReason":"maxIterationsReached"}` then `{"event":"synthesis_complete","totalIterations":35,"answeredCount":8,"totalQuestions":8}`) | **No** orchestrator-ledger "completed" event — see §6.2 | N/A — registry never updated past INIT (0 keyFindings) |

**Both lineages genuinely reached iteration 35/35.** `stopPolicy=max-iterations` worked exactly as designed for iteration depth. The verification gap that mattered was NOT iteration count — it was that "the loop said it's done" (JSONL/registry self-report) and "the orchestrator recorded it as done" (ledger completion) diverged for glm, and would have gone unnoticed without directly cross-checking live process state (§6.2).
