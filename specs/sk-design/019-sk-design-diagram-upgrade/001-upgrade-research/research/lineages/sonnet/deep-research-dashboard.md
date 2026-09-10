# Deep Research Dashboard — lineage sonnet (verification of lineage glm)

Iteration Table

| Run | Focus | Status | Verifications | Corrected | New Findings | newInfoRatio |
|-----|-------|--------|----------------|-----------|---------------|--------------|
| 1 | The contract and its checker | complete | 10 | 6 | 4 | 1.0 |
| 2 | The token source and the repaint | complete | 6 | 3 | 3 | 0.85 |
| 3 | Style reference, design-md and fonts | complete | 7 | 2 | 2 | 0.85 |
| 4 | The corpus shape | complete | 6 | 3 | 3 | 0.9 |
| 5 | The verification loop and the phase plan | complete | 2 | 2 | 2 | 0.9 |

Question Status

| Question | Answered | Evidence |
|----------|----------|----------|
| Q1 verify+deepen angle 1 (checker) | yes (run 1) | iteration-001.md |
| Q2 verify+deepen angle 2 (tokens) | yes (run 2) | iteration-002.md |
| Q3 verify+deepen angle 3 (reference/fonts) | yes (run 3) | iteration-003.md |
| Q4 verify+deepen angle 4 (corpus shape) | yes (run 4) | iteration-004.md |
| Q5 verify+deepen angle 5 (verification loop/phases) | yes (run 5) | iteration-005.md |

Convergence Trend (telemetry only; stop policy = max-iterations at 5)

- question-entropy coverage: 5/5 answered
- convergenceSignals.entropyCoverage: 0.2 -> 0.4 -> 0.6 -> 0.8 -> 1.0
- newInfoRatio: 1.0, 0.85, 0.85, 0.9, 0.9

Verification Verdict Summary (across glm's 29 findings + 2 iteration-5 citations)

- CONFIRMED: 15 (F1.1-F1.4, F1.10, F2.2-F2.5, F3.3-F3.4, F3.6-F3.7, F4.1, F4.4)
- CORRECTED: 15 (F1.6-F1.9, F2.1, F2.6, F3.1-F3.2, F4.2-F4.3, F4.5-F4.6, mutation-suite path,
  the nonexistent diagram-corpus.yml)
- UNVERIFIABLE / not re-derived: 2 (F3.5, findings-sort totals)

Dead Ends (ruled out this lineage)

- Trusting glm's line-number citations without spot-checking against `wc -l` (run 1) — F1.6 cited
  two impossible line numbers.
- Treating `style-guide.md:54`'s "slight hue-shift" prose as an encodable derivation rule (run 2).
- Treating `check-corpus.cjs:936-938` as a documented exception for a real remote font link
  (run 3).
- Assuming one comparable ceiling-wording pattern runs through all 27 type files (run 4).
- Merging phases P3/P4; treating glm's `diagram-corpus.yml` claim as an adaptable existing file
  (run 5).

Blocked Stops

- (none)

Graph Convergence

- not used (no graphEvents recorded)

Next Focus

- Nothing — the loop is complete at the cap. See `research.md`'s terminal synthesis and
  `iterations/iteration-005.md`'s seven-decision proposal for the operator-facing handoff.
