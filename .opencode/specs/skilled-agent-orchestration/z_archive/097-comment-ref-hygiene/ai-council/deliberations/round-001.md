# Deliberation — Round 001

## Council Composition

| Seat | Lens | Vantage (simulated) | Confidence |
| --- | --- | --- | --- |
| seat-001 | Critical / Security-Correctness | injection-path proof | 92 |
| seat-002 | Holistic / Systems-Architecture | single-seam map | 84 |
| seat-003 | Pragmatic / Effort | coverage-per-effort | 80 |
| seat-004 | Devil's Advocate | advisory != enforcement | 78 |

Dispatch mode: sequential inline deliberation in one Opus 4.8 context. All vantages
are simulated reasoning lenses (no external CLI executed), but every claim is grounded
in direct reads of the actual implementation.

## Seat Comparison (5-dimension rubric, 100 pts)

| Dimension | Weight | seat-001 | seat-002 | seat-003 | seat-004 |
| --- | --- | --- | --- | --- | --- |
| Correctness | 30% | 29 | 26 | 25 | 24 |
| Completeness | 20% | 18 | 18 | 16 | 15 |
| Elegance | 15% | 13 | 14 | 12 | 11 |
| Robustness | 20% | 17 | 16 | 18 | 19 |
| Integration | 15% | 14 | 14 | 13 | 11 |
| **Pre-Critique Total** | 100% | **91** | **88** | **84** | **80** |
| Post-Critique Adjustment | +/-10 | +2 | +1 | +3 | +4 |
| **Final Total** | 100% | **93** | **89** | **87** | **84** |

Scoring rationale: seat-001 wins Correctness — it supplies the single unambiguous code
path (`render.ts` is the only emitter; pointer-only format) that PROVES the briefing's
hypothesis. seat-002 wins Elegance/Integration — the one-seam fix is the cleanest
cross-runtime change. seat-003 and seat-004 win Robustness — both surface the
load-fragility of injection and the UNVERIFIED-GATE gap, which the analysts
under-weighted. Post-critique bumps reward seat-003/004 for the highest-value buried
finding (gate may never have fired in the WITHOUT test).

## Agreements (strong consensus, all 4 seats)

1. **Root cause confirmed**: the prompt-time hooks/plugin inject a *skill-routing
   pointer* (`Advisor: live; use <skill> <conf>/<unc> pass.`, render.ts:150-159), NOT
   the hygiene rule. The constitutional entry exists but is never PUSHED into context;
   "always surfaces" governs `memory_search` ranking only.
2. **AGENTS.md was the real source** of every WITH-rule self-correction. The hooks
   contributed routing, not hygiene.
3. **Write-time hooks on OpenCode/Codex/Gemini/Devin do not exist** (ADR-001..004,
   re-confirmed). The prompt-time advisor channel is the only model-visible lever
   before commit on those four runtimes.
4. **Do NOT inject the full markdown** — token budget (80-120 prompt cap / 2000
   session cap), coupling, and banner blindness all forbid it. Inject a short derived
   directive instead.
5. **The git pre-commit gate is the only true enforcement** (it blocks; everything
   else nudges or warns-and-exits-0).

## Disagreements

| Axis | Analysts (001/002) | Critics (003/004) |
| --- | --- | --- |
| Primary fix | widen the injection seam to carry a hygiene directive | harden + verify the gate first; injection is secondary |
| Faith in injection | a short imperative will meaningfully raise compliance | injection is probabilistic and silently no-ops under load (429 / timeout-fallback) |
| Biggest risk | rule never reaches the model | gate may not actually fire for non-Claude runtimes (unverified) |

## Cross-Critique (adversarial round)

- **HUNTER vs seat-001/002** (wearing critic lens): both analysts assume an injected
  directive will steer behavior. seat-004 lands a real hit — even WITH the full rule,
  Gemini only *stripped* the label and Codex's refusal was incidental to Gate 3.
  Injection of a shorter signal cannot be expected to outperform the full rule that
  already wobbled. **Undefended → analysts' "fix reaches the model so it self-corrects"
  is downgraded from a guarantee to a probabilistic nudge.** (Drives the report's
  framing: injection = early feedback, not enforcement.)
- **HUNTER vs seat-003/004** (wearing analyst lens): the critics lean on "the WITHOUT
  test measured writes, not commits, so the gate never fired." This is an INFERENCE
  from briefing wording, not confirmed. SKEPTIC defense: the inference is well-founded
  ("would write if Gate 3 confirmed", "wrote // ADR-007" with no mention of a blocked
  commit) and, critically, it is *cheap to verify and high-impact if true* — so it
  belongs in the report as a P0 verification action regardless. **Finding stands as a
  must-verify, not a proven fact.**
- **SKEPTIC vs seat-004's "hooks provide ZERO protection":** too absolute. A short
  injected directive naming the gate does measurably help cooperative models fix at
  write-time (cheaper than a re-edit bounce). "Zero" overstates; "secondary and
  probabilistic" is the defensible claim. seat-004 adjusted accordingly.

## Convergence Decision

**CONVERGED** (majority-of-4, no new high-severity finding overturns the lead
diagnosis). All four seats agree on the root cause and on the layer taxonomy; the
disagreement is about *priority ordering* of fixes, not about *what is broken*. That is
a synthesis problem, not a re-deliberation trigger. Round 2 is NOT required.

The synthesized position merges both camps:
- Analysts' seam fix is adopted as the prompt-time improvement (early feedback).
- Critics' gate-verification + bypass-proofing is adopted as the PRIMARY guarantee and
  the P0 action.
- seat-004's conceptual correction (advisory != enforcement) reframes the council
  verdict so the requester does not over-trust the hooks.

## Synthesis Inputs to Report

1. Root cause per runtime (seat-001).
2. Injection-path diagnosis: pointer vs needed directive (seat-001 + seat-002).
3. Single-seam fix location (seat-002).
4. Coverage-per-effort ranking (seat-003).
5. Verify-the-gate P0 + advisory/enforcement reframe (seat-003 + seat-004).
