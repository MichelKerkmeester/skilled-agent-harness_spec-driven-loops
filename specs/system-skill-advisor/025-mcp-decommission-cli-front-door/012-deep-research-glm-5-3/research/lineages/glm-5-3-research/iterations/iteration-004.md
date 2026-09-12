# Iteration 004 — KQ4: The checklist, backtested against the packet's own debris

**Focus:** Does the it3 checklist, applied to this packet's actual failures and residue, catch what it1/it2 found — and what does the checklist itself still miss? Plus: two never-read witnesses (002, 005) to broaden the evidence base.
**Status:** complete · **newInfoRatio:** 0.6
**Novelty justification (1 sentence):** The packet's records witness its failures and its practices separately; no record had cross-tabulated them — this iteration's backtest shows the packet inventing the it3 checklist step-by-step *under fire*, three record-mechanisms it never recorded (plan-time records, review-generation decay, waiver score-qualification), and one affirmative dividend (hook 2,096→819 ms) a risk-only reading would lose.

## Actions Taken

1. Read 002/implementation-summary.md:55-105 and 005/implementation-summary.md:44-100 — the two phases whose records this study had never opened.
2. Checked 002's referenced artifacts (baseline.md, protocol-contract.md, warm-mechanism.md) via the summary's own What-Was-Built paragraph.
3. Ran the it3 checklist's ten steps against the it1/it2 findings (LF1–LF5, R1–R7, fix-echo), timing each step's theoretical firing against when the packet actually practiced it.

## Finding A — the record-completeness residue (R6) is bigger than 009 saw, and its mechanism is now nameable

- 002/implementation-summary.md: What-Was-Built carries one dense, factual paragraph ("`baseline.md` records hook warm p50 2096ms, CLI warm p50 823ms and cold first call 3008ms. `protocol-contract.md` freezes the replacement wire. `warm-mechanism.md` names the per-runtime warm point.") — but How-It-Was-Delivered, Key Decisions, Verification and Known Limitations are unfilled template (:60-94: "[How was this tested, verified and shipped?...]", "| [What was decided] | [Active-voice rationale...]", "| [Validation, lint, tests, manual check] | [PASS/FAIL with specifics] |", "1. **[Limitation]**").
- 005/implementation-summary.md — the phase whose work the whole packet celebrates (D1's five deleted declarations, the SDK, the bridge, the 26+7 tests) — says: "Not started. The planning artifacts exist and bind the work. ... No implementation artifact exists yet." (:49-56). Its `_memory.last_updated_at` = 2026-09-11T06:49:02Z (:14) — written at plan-time, never refreshed at close.
- 004: the fully unfilled record (iteration 1). Three of the eight implementation phases' records are scaffolded, partially-scaffolded, or assert their own phase never started; 009-F003 flagged 009's own scaffolds and the parent's phase map, and no workstream (WS-1..4) names 002/004/005.
- **The mechanism, now nameable: record-then-forget** — the records were drafted in the plan-time voice ("Not started", "No implementation artifact exists yet") and nothing in the phase machinery obligated a close-time refresh. The it3 checklist's step 7 pass condition ("zero unfilled template placeholders in shipped records... counts reconcile") fires exactly here, at packaging time — three phases too late for this packet, which is the lesson.
- The study's own dependence proves the cost: this iteration had to reconstruct 002's and 005's truth from OTHER phases' records (008:116's latency line, 006's key_files, the 009 registry) because their own records cannot testify. (002/005's description.json parity: unchecked here — noted, not asserted.)

## Finding B — the backtest: the packet practiced the checklist step-by-step, under fire, in the checklist's own order

| # | Checklist step | Fires on (from it1/it2) | Packet practiced it... | When it actually fired |
|---|---|---|---|---|
| 0 | freeze the contract + degradation semantics | — (enabler) | EARLY, twice | 002's `protocol-contract.md` "freezes the replacement wire"; 003's verdict: "Allowlisted, with the exit taxonomy as the contract" |
| 1 | three-state evidence, output+exit, baseline | LF1 | EARLY in artifact, LATE in discipline | 002's baseline.md measured hook 2,096/CLI 823/cold 3,008 — yet the warm-mechanism doc did not immunize; the DISCIPLINE arrives at 008:84-85, 100, 115, 118 |
| 2 | cold-door execution, not just grep | LF2, LF3 | MID (invented on the spot) | 006:83 — "Two failures surfaced only because the daemon was stopped before the hook ran" |
| 3 | derived artifacts are suspects; clean rebuild | LF3, R7 | MID | 006:99 ("delete the pre-rename dist/ and rebuild clean"); 006:95/139 (the waiver blast radius) |
| 4 | delete-with-its-tests (retire-or-INVERT, same change) | LF4, R4-mirror | MID, TWO PHASES LATE for the orphan | 006 limitations item 1 → 008:119 ("3/3, after removing a case..."); the inversion precedent: rename-invariants.vitest.ts:50-51 |
| 5 | residue criterion, BOTH ways (survivor buckets + absence + claims) | R1–R5, R7 | PARTIAL | 007:85/132/149 (survivor buckets, exemplary) + 008:117 (87→0) — but the absence half had to wait for 009-F005, and the claim-verification for 009-F001 |
| 6 | operator-frozen names enumerated BEFORE the sweep | R3 | LATE (invented mid-criterion) | 008/AC:91-96 — "Left out consciously: the P2 naming residue in the plugin's timeout variable" |
| 7 | records are part of the product; counts reconcile | R6 | LATE/NEVER | 009-F003 (P1) covered 009's own + the parent; 002/004/005 remained (Finding A); the nine-vs-eight arithmetic uncounted |
| 8 | waivers need owner + date + blast radius | R7 | PARTIAL | 006:95/139/31 recorded reason+blast+task beautifully — but the discharge arrived unowned (009-report:16's "regenerated as one set"), so the packet cannot say the 47 paths cleared |
| 9 | re-scan the remediation's own diff | fix-echo | LATE (the hunt caught it, post hoc) | 009-report:16 — "one of them inside the repair's own `.gitignore` edit (F007)"; the verify-a-sample rule: "A reviewer's P1 is a hypothesis. Three were re-proven independently before the fixes were dispatched" (009/implementation-summary.md:112) |
| 10 | re-verify at the FINAL state; earlier passes are hypotheses | 007-limitations staleness, inherited failures | EARLY-FINAL (the packet's strongest habit) | 008:98, 100, 115-119 — the whole final-state criterion set |

**The validation of the ORDER (T1→T4):** the packet's own pain arc ran in exactly the checklist's tier order — door-down (006, the flip's own phase) → criterion-down (008, "the residue criterion carried this packet: it was the only one that failed", 008/AC:91) → discovery-latency (009, findings at the hunt's 4th–5th iterations, 009-report:94) → record-erosion (009-F003, P1). The order is not the study's invention; it is the packet's experienced sequence. A next migration that spends its early rigor on T1 (steps 0–3) buys the packet's late-phase discoveries at their cheap point.

## Finding C — what the checklist still misses (the study's residual)

1. **Review-generation decay.** The packet needed its defect hunt TWICE: the prior nine (F001–F009) left three that "do not fully close", and those THREE became the next generation's P1s by promotion — "prior F010 → F001 here", "prior F012 → F002 here", "prior F015 → F003 here" (009-report:15). No it3 step re-attacks the CLOSURE itself; the 11th step: *the closing review's predecessor conclusions get one adversarial pass before the packet closes* — this packet's own justification: 009-report:112 ("Verify a sample by hand before acting — a reviewer's P1 is a hypothesis").
2. **Waiver score-qualification.** 006:95: the abandoned corpus regeneration "changed advisor fusion scores" — a QUALITY cost of the waiver that nothing later re-qualified: 008's recorded criterion was latency ("CLI warm 736 ms against 1,100; hook warm 819 ms against 2,096; cold 1,566 to 1,812 against 3,500", 008:116), not routing quality; whether the 009-remediation's index+fixtures regeneration restored the scores is uncited here (labeled hypothesis, carried). A migration checklist that benchmarks (D3) at step 0 must therefore ALSO re-qualify at the END, after the waivers settle — the score cost of deferred work is real, silent, and uncaptured by a risk-only checklist.
3. **The checklist cannot certify what waivers silently changed.** Generalizing (2): every waived artifact keeps its pre-removal semantics unless someone re-measures; the packet's exemplary waiver *record* (006:95/139/31) still left the 47-path question unsayable at close. Honesty about waivers needs the re-measurement, not just the запись record. (008/AC:92's "hand-corrected allowlist" — the residue bucketing — IS the packet's one executed post-waiver verification, and note what it verifies: NAMES, not scores.)

## Finding D — the affirmative dividend, lest the lessons read as costs only

The measurement trail the packet itself recorded: hook warm p50 2,096 ms at 002 (baseline, pre-rewire) → 819 ms at 008 (final) — the rewire through the single CLI door cut the hook's warm path by ~2.5×, while the CLI's own warm call (736 ms) came in under its recorded budget and the cold start (1,566–1,812 ms) under the 3,500 recorded against it (008:116). The daemon was kept (D3's "Inconclusive keeps it" — the measurement was conclusive enough to keep AND rewire, 002's protocol-contract.md). A lessons study that only lists pitfalls would undersell the packet: the migration's payoff was measured, recorded, and POSITIVE.

## Questions Answered

- **KQ4: ANSWERED.** The checklist catches everything it1/it2 found — the backtest's only graceful failures are timing (steps 4, 6, 9, 10 practiced late) and completeness (step 7, where the packet is the counterexample); it still misses the review-generation decay (fixed here as step 11), the waiver score-qualification (step 0/10 extension), and certification-of-waived-semantics in general. The tier order T1→T4 is validated by the packet's own experienced pain arc.

## Questions Remaining

- None of the charter's three; the study's residuals are recorded as the study's own open questions (see 11A): the 47-path post-state, the doctor-asset provenance, the ninth required correction, the 002/005 description.json state, and whether the 009-fix#3 regeneration restored the fusion scores — the last now doubled as the study's FINDING C.2, because these residuals are exactly what the packet's records cannot testify to.

## SCOPE VIOLATIONS

None. Reads: 002, 005 (new); everything else cited from iterations 1–3. Writes inside the lineage. 010/011 untouched — independence held to the last iteration; the study's residuals are precisely the questions their (unread) outputs may already answer, which is the point of the third reading.

## Negative knowledge

- The it3 checklist deliberately excluded benchmarking (D3 discharged) — Finding C.2 now QUALIFIES that exclusion: the benchmark needed doing AGAIN after the waivers, a sequencing subtlety inside "D3 discharged" that the it3 framing missed. The checklist's step 0/10 extension carries it.
- 005's "Not started" summary nearly fooled this study's iteration-1 survey (which cited 006/008's records for the removal's effects and never noticed 005's own silence until this iteration) — the scaffold-hunt cannot be skipped: the unfilled records actively MISLEAD (they assert a negative: "not started").
