# Deep Research Dashboard — Jev feature proof-or-retire

Lineage: `deepseek-v4-1-flash-max` · Session: `fanout-deepseek-v4-1-flash-max-1791147269547-wctu8t` · Generation 1
Mode: research · Stop policy: max-iterations (cap 5) · Convergence threshold: 0.05

| Field | Value |
|-------|-------|
| Iterations completed | 5 / 5 |
| Key findings | 36 (15 P0, 12 P1, 9 P2) |
| Open questions | 0 (8 bounded follow-ups noted in research.md) |
| Answered questions | 5 / 5 |
| Last newInfoRatio | 0.5 |
| Trend | ▇▇▇▇▅ |
| Stop reason | maxIterationsReached |

## Status

Complete. All five iterations ran to the cap and verified (narrative + route-proof record + delta each, recorded through the append gateway). Synthesis written to `research.md`; registry, strategy and dashboard maintained in reducer shapes; resource map emitted; terminal `synthesis_complete` event carries `stopReason: maxIterationsReached`. Spec-folder writeback intentionally deferred (write boundary) and recorded as `spec_synthesis_deferred`.

## Focus Ledger

| Iter | Focus | Ratio | Status | Findings |
|------|-------|-------|--------|----------|
| 1 | The shared gate and the four proven features' live-path pattern | 1.0 | complete | 6 |
| 2 | Spec-track narrowing: the repeat, the power, and the keep rule | 0.9 | complete | 8 |
| 3 | Routing clarify default: the 3-of-365 base rate, the refusal, and the power wall | 0.9 | complete | 7 |
| 4 | Alignment folder suggestion: the distractor kill and the state-anchored pick | 0.9 | complete | 8 |
| 5 | Cross-feature synthesis: the proof-or-retire standard, the rule family, ranked next steps | 0.5 | complete | 7 |

## Findings Index

| ID | Sev | Feature | Short label |
|----|-----|---------|-------------|
| f-iter001-001 | P0 | gate | Four FEATURES entries; candidates absent |
| f-iter001-002 | P0 | gate | Switch-first then one bounded auth probe; no spawn when disabled |
| f-iter001-003 | P0 | gate | Four proven paths share gate-first fail-open shape |
| f-iter001-004 | P1 | gate | Auto-on resolution records provenance |
| f-iter001-005 | P1 | gate | Stub-CLI test pattern with no-spawn proof |
| f-iter001-006 | P2 | gate | cite-drift uses a version-pinned private gate |
| f-iter002-001 | P0 | track | Repeat stopped on margin; CI spans zero; inconclusive |
| f-iter002-002 | P0 | track | 217 decided pairs (~431 rows) for 80% power; MDE 13.7pp |
| f-iter002-003 | P0 | track | Relative-only rule; no absolute or per-track floor |
| f-iter002-004 | P1 | track | Probability-aware aggregation did not repeat; one-call near-equivalent |
| f-iter002-005 | P1 | track | 049 trust upgrades landed (pins, replay, bootstrap) |
| f-iter002-006 | P1 | track | Paraphrase transfer warning persists; heterogeneous clusters |
| f-iter002-007 | P2 | track | p50 325 ms/call; serve one call miss-only |
| f-iter002-008 | P2 | track | Advisory Gate 1 integration shape; R1 binds |
| f-iter003-001 | P0 | clarify | 3 clarifications of 365 committed prompts (2 mode) |
| f-iter003-002 | P0 | clarify | 42 of 54 fixture rows refused; below the 30-row gate |
| f-iter003-003 | P0 | clarify | 69 discordant pairs at 0.65; ~32k prompts at base rate; always-none beats Jev |
| f-iter003-004 | P1 | clarify | 049 upgrades landed (digests, baselines, early stop) |
| f-iter003-005 | P1 | clarify | Seam confirmed: normalized route drops alternatives |
| f-iter003-006 | P2 | clarify | Advisory beside action: clarify; T0/T1 first |
| f-iter003-007 | P2 | clarify | Tests: shadow capture, contract, floors, transcripts rate |
| f-iter004-001 | P0 | alignment | Distractor control kills W=0 L=30; pick follows the state's folder |
| f-iter004-002 | P0 | alignment | Keep holds only with path-resolved descriptions and original state |
| f-iter004-003 | P0 | alignment | Fixture by construction; 11 discordant pairs cannot prove |
| f-iter004-004 | P1 | alignment | f022-001 still loses; adjudicate |
| f-iter004-005 | P1 | alignment | 049 upgrades landed (kill branch, controls, gated arm) |
| f-iter004-006 | P2 | alignment | Interactive flag-gated save-flow shape; D6 amendment |
| f-iter004-007 | P2 | alignment | Tests: masked-state ablation, real corpus, provenance |
| f-iter004-008 | P1 | alignment | Masked-state ablation gates retire-or-prove |
| f-iter005-001 | P0 | all | Seven-requirement standard; none met |
| f-iter005-002 | P0 | all | Rule family diverges; shared-kit amendment set |
| f-iter005-003 | P0 | all | Ranked next step per feature |
| f-iter005-004 | P1 | all | Shared kit is the reuse path |
| f-iter005-005 | P1 | all | Shadow → canary → live behind the unchanged gate |
| f-iter005-006 | P2 | all | Cross-feature test plan |
| f-iter005-007 | P2 | all | Base rates cap value; retirement is an evidence outcome |

## Verification Summary

- Gate contract verified from code and tests (iteration 1); four proven call sites read in full.
- Track repeat read from `~/.skilled/.labels/runs/049-002-jev.stdout.txt`; power computed by exact binomial from its counts.
- Clarify census and fixture replay run read-only this session: 3 of 365; 42 of 54 refused, 12 labeled.
- Alignment control read from `~/.skilled/.labels/runs/049-008-jev.stdout.txt`: keep on the primary arm, kill on the distractor arm.
- All gateway appends returned exit 0 with receipts; the state log holds the config row, iterations 1-5, the synthesis_complete row (`maxIterationsReached`) and the spec_synthesis_deferred row.

## Notes

- Detached fan-out lineage; write boundary is this directory only.
- Official reducer paths resolve outside this boundary; strategy/registry/dashboard were maintained by the executor in reducer shapes, and the resource map was emitted from the deltas in the shared format.
- No live Jev call was made by this lineage; every figure comes from recorded runs, read-only commands, or exact computation from those records.
- Containment note: all 51 files in `containment/baseline/` compare byte-identical to the live tree except `.skilled/hooks/README.md`, whose post-spawn change (three lines describing files deleted by the concurrent parent cleanup — `count-pi-goal-nudges.mjs`, `build-verifier-fixture.cjs`, `score-verifier-labeled-set.cjs`, all shown as deletions in `git status`) was not made by this lineage; no command in this session touched that path. The runner records such findings as advisories on a complete lineage.
