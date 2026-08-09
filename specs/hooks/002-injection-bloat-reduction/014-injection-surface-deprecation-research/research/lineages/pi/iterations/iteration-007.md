# Iteration 7: End-State Projection & Remaining Gaps

## Focus

Quantify the recommended end-state (post-migration) per-turn chains and 10-turn totals, and inventory the residual knowledge gaps for the convergence report.

## Findings

### F1. Post-migration Pi per-turn chain (recommended end-state)

| Stage | Turn composition (Pi, visible) | 10-turn total |
|---|---|---|
| Today, worst case (fallback turns) | 767+554 = 1,321 B × 10 | 13,420 B |
| Today, best case (head + 013 dedup) | 1,363 first + 596 × 9 | 6,727 B |
| Step 1 only (013-extension covers fallback) | 809+554 first, 554 repeats (fallback), 596 (head) | 5,540-5,750 B (−57-59%) |
| Steps 1+4a (once-per-session full, repeat suppression both shapes) | 809+554 first, 42+554 repeats | 6,031 B (all-head) |
| Steps 1+4b (+ compact dispatch 116 B, if 006's 5-semantics proof passes) | 925 first, 158-670 repeats | 2,347-6,855 B |

Key structural fact: **013's dedup already delivers the 004 route-only benefit on Pi for head-present turns** (both keep the ~42 B route head). The remaining Pi gains come from (a) covering the headless fallback (step 1: −767 B on every fallback turn) and (b) the compact dispatch directive (step 4b: −438 B/turn, pending 006 semantics proof). 004 activation itself changes nothing for Pi; it is the mechanism for the four [SYS] runtimes.

### F2. Post-migration chain for the four [SYS] runtimes (Claude/Codex/Devin/OpenCode)

Today: 806 B × N turns (invisible to the human, full context occupancy). With 004 activation (full-first + route-only repeats): 806 + 43×(N-1). For N=10: 8,060 → 1,193 B (−85.2%); 001's model with Gate/continuity terms produced 9,626 → 1,715 B (−82.2%). The dedup machine is built, shadow-proven (82.2% receipt reproduction), and gated behind the 007 negative controls. [SOURCE: 004 implementation-summary.md:105-110,135; hooks/001 research.md:64]

### F3. Irreducible per-turn floor

Even in the best end-state, every Pi turn carries the dispatch directive (554 B today; 116 B only if 006 proves semantic preservation) + 42 B route head when the advisor yields a recommendation. The floor is 596 B/turn today, ~158 B/turn with a proven compact — versus the topic's implied "keep only two injections" ideal, where the Pi dispatch directive remains a deliberate keep (Pi-critical per 013/006 decision records; five semantics must all survive any compaction).

### F4. Residual gaps (reported, not resolved — all outside this lineage's evidence)

1. **Provider token/billing receipts:** 001's bytes are `ceil(UTF-16/4)` estimates; real tokenizer/billing/latency effects are unmeasured (001 research.md:13,166).
2. **Fallback emission rate:** no telemetry counts how often the advisor yields no brief; the whole Pi cost spread (6.7 vs 13.4 KB/10 turns) pivots on this rate. A counting receipt (already available via `observeAdvisorPolicy`/shadow log) would pin the distribution.
3. **Behavioral equivalence of suppression:** the 007 negative-control suite has never run (0/13 evidence cells); 004 activation must not proceed without it.
4. **Cursor/Devin delivery verification:** 001 flags Cursor's observed prompt lane as zero and Devin's PostToolUse stdout handling as unverified; Cursor/Pi were "qualified but not activated" in 004.
5. **Active-goal frequency:** no active goal exists today; per-turn cost when one is active is bounded (4,800 chars) but its per-turn necessity on Pi is untested.

## Sources Consulted

- Iterations 1-6 of this lineage (byte table, dedup cases, activation evidence)
- 004 implementation-summary.md:105-135; hooks/001 research.md:13,64,96,166
- 006 spec.md:62-77; 013 implementation-summary.md:81

## Assessment

- **newInfoRatio: 0.6** — end-state projections (F1-F3) and the structural fact that 013 already equals 004 on Pi (F1) are new; gap inventory (F4) consolidates known open items.
- **Confidence:** high on the math (derives from measured constants); medium on the gap list completeness.
- All five key questions remain answered; no new questions opened.

## Reflection

- What worked: separating "004 activation value" from "Pi-local dedup value" — the two overlap on Pi, which sharpens the migration path (step 1 is the Pi-critical change; 004 activation is for the other four runtimes).
- What failed: nothing.
- Ruled out: treating the compact dispatch prototype as ready (006's semantics proof is not executed).

## Recommended Next Focus

Convergence candidate: all five questions answered (5/5), three consecutive sub-threshold or declining ratios. Run the composite convergence check and, if legal, proceed to synthesis.
