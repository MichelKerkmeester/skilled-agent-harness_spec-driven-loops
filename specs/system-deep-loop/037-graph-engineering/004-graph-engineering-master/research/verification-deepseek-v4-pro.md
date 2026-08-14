# DeepSeek V4 Pro — Independent Verification of the Graph-Engineering-Master Completeness Synthesis

> Adversarial verification of `research.md` by DeepSeek V4 Pro (cli-pi `--provider deepseek --model deepseek-v4-pro --thinking high`). Verdict: **PASS-WITH-FIXES**. Its central catch — that the synthesis overclaimed program-level completion/convergence and dropped study-3's own open architecture items — was applied to research.md before closeout: (1) downgraded 'no unresolved contradiction' -> 'no NEW contradiction found in a bounded search'; (2) reframed 'genuine convergence' -> 'documentary corpus exhaustion (self-reported)', noting the 0.05 threshold was operationally inert under stopPolicy=max-iterations and that study-3 rejected novelty-ratio-as-proof; (3) re-imported study-3's open architecture items (036-capability audit, owner-disagreement, zero measurements, concurrency) into the Program Completeness Verdict; (4) de-strawmanned 'prefer newer' (GEM already scopes it to retrieval time); (5) fixed citations (90% -> SKILL.md; WORKFLOWS overload marked inferred; 'no runnable code' attributed to the file inventory, not the README table). Produced 2026-08-14.

I read the actual sources. Verdict below, with file:line evidence for every material point.

---

## 1. OVERALL VERDICT: PASS-WITH-FIXES

The synthesis is substantially faithful to its cited sources and correctly self-limits to DESIGN level, but its headline "complete / no unresolved contradiction / genuine convergence" claims outrun the evidence — they rest on a self-reported novelty metric that the immediately prior study (3) explicitly rejected as convergence proof, and they silently drop study-3's own open "Unexamined Assumptions."

## 2. UNSUPPORTED / OVERCLAIMED

- **"The four-study design has no unresolved architectural contradiction"** (Executive Verdict) — this traces to `iteration-020.md:10`, which is self-tagged `[INFERENCE: synthesis of iterations 1–19…]`, and to line 45's "no **new** architectural contradiction." A single pass finding "no new" contradiction is not proof that none exists. The synthesis upgrades "no new contradiction found" → "no unresolved contradiction" without the warrant.
- **"Genuine documentary convergence"** (Convergence Report) — rests on `newInfoRatio` dropping to `0.03`. This is the executor's own self-assessed score. Study 3's `research.md:260` states the opposite standard: "the iteration explicitly rejects treating the cap **or novelty ratio** as convergence proof." Study 4 quietly reverses that, using the same ratio as its convergence evidence, and never acknowledges the reversal.
- **"No additional repository study is required to settle the present architecture"** (Program Completeness Verdict) — contradicts study-3's own `research.md:228-231`, which lists open architecture-level items: "036 capability is assumed, not audited… a materially larger build"; "Owner-disagreement has no resolution mechanism"; "No measurements"; "GraphARC's concurrency behavior is not analyzed." A documentary study cannot close these; the synthesis omits them entirely.
- **"It contains no runnable graph engine"** cited to `README.md:20-27` — that range is only the "What's inside" table; it nowhere states "no runnable code." The claim originates in the study's own `orientation.md:36` (an inventory inference), not in GEM's source.
- **"prefer newer" as "the only material doctrinal conflict" / "CONTRADICT as a universal rule"** — GEM's own text already scopes it: "prefer the newer **at retrieval time**" (`fusion-and-llm.md:82-84`). GEM never claims recency is truth admission. The synthesis invents the stronger "universal truth admission" position in order to then contain it — a mild strawman.

## 3. INTERNAL INCONSISTENCIES

- Convergence standard: study-3 forbids novelty-ratio-as-proof (`research.md:260`); study-4 adopts it as "genuine convergence." Same program, incompatible standards, unremarked.
- The knowledge/evidence plane is called "the one substantive contribution / one net-new deliverable," yet the completeness table's Knowledge-graph row says studies 1–3 "**already require** controlled predicates, temporal/provenance-bearing assertions, gated identity, hybrid routing, belief settlement, non-authority." Reconcilable as production-vs-consumption, but "already require" overstates what a *production pipeline* was established to be.
- "50-item sample or 90-percent precision" is cited to `WORKFLOWS.md:1-8,88-94`; the 90% figure actually lives at `SKILL.md:78-79`. `WORKFLOWS.md:92` says "50-document hand-check." Misattributed.

## 4. LOGICAL GAPS

- **Completeness is self-certified.** The loop's only convergence check is the same model scoring its own novelty; there is no independent reviewer, no negative control, no second model (the very absence this adversarial audit exists to fill).
- **"No contradiction" is absence-of-finding, not proof.** Earned only as "no new contradiction in iteration 20," a single terminal pass over a fixed corpus.
- **The 0.05 threshold had no authority.** `deep-research-state.jsonl:1` sets `convergenceThreshold: 0.05` but `stopPolicy: "max-iterations"`. The synthesis discloses this, then still derives "genuine convergence" from crossing a threshold that was operationally inert — precisely the inference study-3 forbade.
- **"Program complete" conflates corpus exhaustion with architecture settlement.** Study-3's unexamined assumptions (036 capability audit, owner-disagreement arbitration) are architecture-level, not implementation-level, and no documentary study resolves them.

## 5. CITATION RED FLAGS (for spot-check)

- `WORKFLOWS.md:148-179` and `:165-179` cited for "fusion error, route accuracy, citation fidelity" and "latency, cost" — none of these terms appear in the file (actual content: precision/recall, leakage, trivial baseline, vector-only baseline, 30-question eval). **Overloaded.**
- `README.md:20-27` for "no runnable graph engine" — contents table, not a statement.
- `SKILL.md:44-55` (P1) for "temporal… synthesis questions… vector retrieval remain preferable" — `SKILL.md:49-51` mentions multi-hop/recurring/relationships only; "temporal," "synthesis," "vector retrieval" are additions.
- `WORKFLOWS.md:1-8,88-94` for the 50-item/90% thresholds — 90% is in `SKILL.md`, not `WORKFLOWS.md`.

## 6. MISSING COVERAGE

- Study-3's "Unexamined Assumptions" (`research.md:226-232`) — 036 capability audit, owner-disagreement arbitration, zero measurements, concurrency — are dropped from the completeness verdict.
- No independent confirmation of the "no runnable code" inventory claim (taken on the orientation's word).
- The "prefer newer" containment is stated as doctrine; no concrete, testable retrieval-time rule is specified, so the "fix" is unfalsifiable.
- `answeredCount=10` is self-reported; the synthesis never checks whether questions were answered *well* versus merely marked answered.

## 7. TOP 3 FIXES (ranked)

1. **Downgrade the completion claim.** Replace "no unresolved contradiction / genuine convergence / program complete" with "no *new* contradiction found in 20 self-directed iterations; corpus exhausted for this question; convergence is self-reported telemetry." Re-import study-3's Unexamined Assumptions as explicitly open architecture items.
2. **Re-audit every [SOURCE] against the file.** Remove terms not present in the cited ranges (fusion error / route accuracy / citation fidelity / latency-cost from `WORKFLOWS.md`; temporal/vector from `SKILL.md:44-55`; 90% from `WORKFLOWS.md`), and re-attribute "no runnable code" to the orientation inventory, not `README.md`.
3. **Reframe "prefer newer."** GEM already scopes it to retrieval time; either drop the "contradiction" framing or state plainly that the study is *tightening* wording, not contradicting a position GEM holds.
