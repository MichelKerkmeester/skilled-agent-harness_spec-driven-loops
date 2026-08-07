---
round: 1
seat: seat-001
executor: simulated-cli-claude-code-vantage
lens: critical (risk-averse)
status: returned
timestamp: 2026-05-23T17:05:00.000Z
simulated: true
---

# Seat 001 — RISK-AVERSE (Critical Lens, simulated cli-claude-code vantage)

## Mandate

Surface every regression vector across the remaining 8 phases. Insist on rollback granularity stronger than `git restore`. Challenge any "just ship it" framing that defers verification.

## Proposed Plan

### Q1: Phase ordering

**Keep 003→010 sequential, but insert 002b *before* 003.** Rationale:
- 002b shares topical context with 002 (CocoIndex doc drift). Memory cache is still warm: I just read `registered_embedders.py:256` confirming `Qwen/Qwen3-Reranker-0.6B`. Deferring 002b past 003 means re-loading the CocoIndex doc-stack mental model later. Cost of re-context > cost of finishing the side-split now.
- 002b is small (~30-60 min, mechanical doc edits with footprint verification). It does not unbalance the 003 wall-clock budget.
- Closing 002b before 003 also keeps the "phase 002 complete" claim honest in `description.json` and graph-metadata. Right now 002 is shipped but the audit cluster is partially open.

**Do NOT reorder 004 earlier or later.** It is the biggest phase (2-4 hr) and the highest risk (scorer behavior could shift). Putting it after 003 means the operator has 3 quick wins (002b, 003 if codex agents is small) before committing to the multi-hour deepseek-v4-pro dispatch.

**Do NOT pull 006 (Python) out of order.** It is independent of TS phases but moving it earlier would break the operator's mental phase-number-as-progress signal.

### Q2: cli-opencode + deepseek-v4-pro risk mitigation

Preflight (each of 004, 005, 007):
1. `opencode providers list` — verify deepseek/deepseek-v4-pro is reachable; check credit balance reads "OK" or non-zero. Per memory `reference_opencode_go_credit_gated.md`, all opencode-go models go 401-Insufficient-balance when credits hit zero. **If credits zero: fall back to cli-devin --model deepseek-v4-pro (DeepSeek API direct, separate billing).**
2. `git status` snapshot — verify clean working tree on main (per memory `feedback_worktree_cleanliness_not_a_blocker.md`, dirty WT is fine for parallel-track baseline, but for a multi-file refactor dispatch we want a clean fingerprint to detect partial-revert post-dispatch).
3. `git rev-parse HEAD` — capture commit baseline for the 4-layer RM-8 mitigation (per memory `feedback_rm8_mitigation_works_under_deepseek.md`).
4. Sequential_thinking ≥ 5 thoughts for SWE-1.6 (cli-devin Rule 14) — but cli-opencode + deepseek-v4-pro has no documented sequential_thinking requirement; **still do it** to compose CLEAR ≥ 40/50 prompt.
5. Read `.opencode/skills/cli-opencode/SKILL.md` to refresh prompt-quality contract.

Abort/rollback signals mid-dispatch:
- **30-second silence after dispatched job last logged output** → check `ps aux | grep opencode` to confirm process still alive. Hung processes happen per memory `feedback_opencode_pure_flag_required_for_deepseek.md` (without --pure, DeepSeek's tool-name regex rejects can cause silent hangs).
- **Any 401/403 in `/tmp/<phase>-out.log`** → SIGKILL + retry with cli-devin fallback.
- **typecheck regression in dispatched-output** → SIGKILL + restore from baseline commit + re-dispatch with tighter prompt.

Phase 004 wave-per-call:
**One wave per call, not all 4 waves in one cli-opencode dispatch.** Rationale:
- Each wave is a verification gate (typecheck + vitest + ban-list grep). Bundling means a wave-3 failure forces wave-1 + wave-2 to redo.
- 4 separate dispatches sacrifice ~2 min overhead per dispatch but gain 4 independent rollback boundaries.
- deepseek-v4-pro context budget on opencode-go is roughly 64-128k. A 4-wave atomic prompt would push prompt + diffs near the limit and risk truncation.

### Q3: Phase 010 ADR-B handling

**Option (c): separate "Verification clause amendment" ADR.** Rationale:
- (a) in-place edit destroys audit trail. Future readers of ADR-013/014 will see edits with no Git-blame-friendly story.
- (b) new ADR-015 superseding ADR-013/014 implies the originals were *wrong*. They weren't — they were *incomplete* on enumerating the inline `||` fallback class. Superseding is a stronger claim than the audit warrants.
- (c) preserves the original ADRs unchanged + adds a small amendment ADR explaining the verification requirement. This is the closest analog to "ADR with rider" patterns used in distributed governance contexts.

Concretely: phase 010 authors ADR-B as `ADR-013/014-AMENDMENT: Inline-fallback verification clause`. Within `004-spec-memory-embedder-bake-off/decision-record.md` we add a single "AMENDMENTS" section with a link to the amendment ADR in phase 010. This is a 5-line append to a shipped ADR (low surface area), not a content edit.

### Q4: Convergence gate strength

Original 6 invariants stand. **Add 3:**
- (a) `memory_index_scan` + `code_graph_scan` refresh — surfaces new packets to MCP, otherwise resume context will lag.
- (b) Reranker memory entry update via `/memory:save` — closes the stale entry the operator flagged.
- (c) `validate-doc-model-refs.js` dry-run against ALL changed docs in arc — phase 010 ships the validator; convergence runs it as smoke test.

**Do NOT add:** changelog entry per phase (that's per-skill discipline, not arc-level), benchmark re-runs (deferred per plan §risks 4).

### Q5: Failure-mode plan

Rollback granularity: **file > phase > arc.**
- File-level: `git restore <paths>` is sufficient when a single edit went sideways within a phase. Pull explicit paths from the dispatched output log.
- Phase-level: `git restore` on the phase's `Commit Handoff` paths + `git rm -rf <phase-folder>` for created spec docs + delete `/tmp/<phase>-*` artifacts. Restore the parent `graph-metadata.json` `children_ids` entry to "Planned".
- Arc-level: skip — phases are isolated; no scenario requires arc-wide rollback.

State-of-truth: **git index > spec.md status > dispatched-output log.**
- Git index is canonical. Spec.md status lines can drift (especially during partial completion); always reconcile against `git diff` on key files.
- Dispatched output log is suspect — silent reverts per memory `feedback_cli_dispatch_unreliability.md` mean log can report "shipped" while git shows no changes.

Partial-revert detection (mandatory after every cli-opencode dispatch):
- `git diff --stat HEAD~1..HEAD` — file count + line counts MUST match what dispatched-output log claimed
- `npm run typecheck:root` — exit 0 confirms no orphan imports from partial dispatch
- New vitest invariant test → run → pass
- Spot-Read on 1 representative changed file → human-readable

### Q6: Phase 004 wave-1-vs-wave-2

**Wave 1 CAN ship alone as partial 004.** Rationale:
- Wave 1 closes 14 P0 (the biggest priority cluster). Waves 2-4 close P1/P2.
- If wave 2 hits scope creep (RoutingCalibration interface expansion drags in unforeseen file edits), ship wave 1 as `004a-skill-advisor-threshold-consolidation-wave1` and reschedule waves 2-4 as `004b`.
- This is the same scope-split pattern that worked for 002 → 002b.

**However:** waves 2-4 should ship as a unit when possible (they share the RoutingCalibration interface). Wave 2 + 3 are tightly coupled (env-var override mechanism needs the typed interface). Wave 4 (prompt-policy) is independent enough to defer.

Safest sequence: 004a (wave 1) → verify → 004b (waves 2+3) → verify → 004c (wave 4) if needed. Three smaller phases, three smaller dispatches.

## Reasoning

This council seat is biased toward preserving optionality at every step. The arc has already had one scope split (002 → 002+002b) that worked cleanly. The same pattern applied prospectively to phase 004 reduces risk without sacrificing closure. The "no stopping" directive doesn't mean "no scope splits" — it means "no operator stops on principle." Scope splits are a tactical response to mid-dispatch discoveries, not a stopping condition.

The cli-opencode + deepseek-v4-pro risk surface is the single biggest concern. Memory has 4 separate entries documenting failure modes (credit-gating, silent reverts, parallelism limits, --pure flag). All four risks compound for the phases that use this executor (004, 005, 007). Strict preflight + single-wave dispatches + baseline-commit RM-8 mitigation are non-negotiable.

ADR-B preservation matters because the arc's value proposition is *making future drift structurally impossible*. If we destroy audit trail on the very ADRs that the arc is supposed to strengthen, we undercut our own premise.

## Risks & Trade-offs

- 002b-before-003 adds one more phase to the queue, slightly delaying 010 ADR closure. Trade-off accepted for memory-cache warmth + clean phase-002 closure.
- Per-wave dispatch for phase 004 adds ~6 min overhead total (3 extra preflight cycles). Trade-off accepted for rollback granularity.
- Separate amendment ADR (option c) adds doc surface vs in-place edit. Trade-off accepted for audit-trail preservation.
- File-level rollback granularity assumes the dispatcher reports accurate file lists. If cli-X output log is wrong, we'd over- or under-restore. Mitigation: `git diff --stat` is always primary source of truth.

## Assumptions and Evidence Gaps

- Assume operator approves option (c) ADR-B handling (separate amendment ADR). If they prefer (a) in-place, that's a 5-line append per the plan default; I'm not blocking on it.
- Assume opencode-go credit balance is currently non-zero. No way to verify without `opencode providers list` Bash call, which this council seat cannot make.
- Assume `Qwen/Qwen3-Reranker-0.6B` disk footprint and daemon-log identifier verification (for 002b) is bounded (per implementation-summary 002 §Limitations). Could balloon if Qwen3 size matrix turns out complex.

## Alternative Challenged

Velocity seat will say: "Skip 002b entirely; bundle reranker doc fix into convergence." I reject this because (a) memory cache for the reranker subsystem will be cold by convergence (16 hours later), and (b) bundling docs work into convergence inflates convergence wall-clock past the 30-min plan budget and risks rushing the validator dry-run.

## Confidence

**75/100** — High confidence on Q1 (insert 002b), Q3 (option c ADR-B), Q5 (file > phase > arc), Q6 (wave 1 can ship alone). Medium on Q2 (preflight is right; abort signals untested under deepseek-v4-pro specifically). Medium on Q4 (3 additions are right; could be over-engineering if convergence already takes 30 min).
