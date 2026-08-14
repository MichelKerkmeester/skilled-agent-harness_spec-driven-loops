# DeepSeek V4 Pro — Independent Verification of the Loop/Harness (NOOA) Synthesis

> Adversarial verification of `research.md` by DeepSeek V4 Pro (cli-pi deepseek-v4-pro, thinking=high). Verdict: **PASS-WITH-FIXES**. Its most important catch is program-level: the synthesis (inheriting from studies 1-4) framed 036 as an EXISTING operational authority, when 036 actually runs additive/DARK with cutover planned/gated (DarkLedgerAdapter returns the legacy result unchanged) — so 'only 036 may admit' is a target-state invariant, not current enforcement. All fixes applied to research.md: (1) corrected the 036 grounding (designated != operational; runs dark; every subordination guarantee is a design contract, not live enforcement); (2) disambiguated P1's minimal content-digest reference from the deferred P6 ArtifactHandleV1; (3) added P2's authoritative-history read-through rule + corrected the NOOA memory-tool list to all seven tools (remember/recall/search/update_memory/forget/associate/deref); (4) clarified the P5 three-layer count (StopDecision is a separate stop mechanism, not a 4th eval layer); (5) flagged the near-perfectly-monotonic novelty series as executor-generated trajectory metadata, not corpus-exhaustion evidence. Produced 2026-08-14.

I verified the load-bearing citations against the actual repository (paper line ranges, convergence docs, state-jsonl, dashboard, the four prior studies, and the 036 spec + runtime). The line-number chains are accurate. Here is the adversarial verdict.

---

## 1. OVERALL VERDICT: **PASS-WITH-FIXES**

The synthesis does what it claims (DESIGN-level, hedged, boundary-aware) and its citations resolve, but it carries one material overstatement — the present-tense framing of 036 as an *existing* authority system — and one data-integrity red flag (the novelty telemetry) that must be corrected before this is treated as a faithful record.

## 2. UNSUPPORTED / OVERCLAIMED

- **"036 / authority plane is the existing transition-authority system. It evaluates canonical requests, records authorization decisions, fences protected mutations…"** — overclaimed as operational fact. 036's own `spec.md` shows `Status: In Progress`, `completion_pct: 0`, and the phase table marks `006-transition-authorized-ledger-core` and `014-staged-state-migration-and-authority-cutover` as **"Planned"**. The shipped `runtime/lib/authorized-ledger/README.md` confirms it runs **dark**: `DarkLedgerAdapter.recordAfterLegacy()` "invoke[s] this authorization after the legacy result is already final and always return[s] that legacy result unchanged." So "only 036 may admit a protected transition" is a *target-state design invariant*, not a live runtime property today. The synthesis never distinguishes "designated authority" from "operational authority."
- **"The descending novelty telemetry supports a claim of documentary corpus exhaustion"** — the claim is hedged (correctly labeled executor telemetry), but the underlying data is cited as evidence without scrutiny. See §5.
- NOOA memory tool list — **"deliberate remember/recall/update/forget/associate operations"** — the paper (lines 209-231) states **seven** tools: `remember, recall, search, update_memory, forget, associate, deref`. The synthesis omits `search` and `deref` and renames `update_memory`→`update`. Minor, but it mis-states the paper's surface.

## 3. INTERNAL INCONSISTENCIES

- **P1 vs P6 handle ambiguity.** P1's `IterationResultV1` is defined to contain "artifact handles and digests," and Delta 1 mandates "artifact/digest admission" *now*. But P6 defers `ArtifactHandleV1` "pending measured benefit," and the Executive Decision says "Defer artifact handles." The document never states whether P1 ships on `contentDigest`-only admission or depends on the deferred P6 type. A reader cannot tell if "handle" in P1 means "P6 handle" or something weaker.
- **P5 naming.** Titled "Three-Layer Evaluation Architecture," but its table has four rows (A, B, StopDecision, C), with StopDecision explicitly "not one of the three." Cosmetic, but the headline count and the table disagree.
- **Emphasis ordering.** Executive Decision calls P1 "the most important near-term idea," while the Terminal Audit says "P7 should land first" and "P1 and P5 should shadow… next." Not a contradiction (test-first vs. feature-priority), but the ranking is muddled.

## 4. LOGICAL GAPS

- **036-subordination is maintained only as a contract, and the doc never says so.** Every P1–P7 "036 boundary" correctly keeps proposals beneath the plane, and the `candidate → … → 036 authorization` sequence is well-formed. But because 036 is dark/not-yet-cut-over, the live runtime today has **no authoritative 036 gate** — legacy writers are still authoritative. The synthesis inherits the "existing system" framing from studies 1–4 without re-verifying it against 036's actual phase state. A reviewer reading "The hard boundary is architectural" would conclude the boundary is *currently* enforced; it is not.
- **Reducer "owns acceptance" of memory ops that touch authoritative-record classes.** P2 makes the reducer (`reduce-state.cjs`, a non-036 script) the acceptor of `MemoryProposalV1`, and its never-forget classes include "authoritative requests, decisions, refusals, fences, budgets, effects, and receipts." The doc lists "stale/superseded recall rate" as a metric but never states the governing rule: authoritative history must be **read-through from 036**, never cached as authoritative in a reducer projection. Without that rule, the memory projection can silently serve stale copies of authoritative events.
- **External-paper hedging: none found** — the doc consistently labels paper figures as author-reported and correctly flags that blog agreement ≠ independent replication. This axis is handled better than most.

## 5. CITATION RED FLAGS TO SPOT-CHECK

- **`arXiv:2607.20709v1`, dated 22 Jul 2026.** Internally consistent with the repo's 2026 environment, but externally unverifiable from current knowledge. All benchmark figures (97.9%/4,400 trials, 84.7% stress subset, +11.8 RHAE, SWE-bench/Terminal-Bench) rest on this paper's existence. The doc hedges them as author-reported — good — but the paper itself is the one citation that cannot be independently confirmed.
- **The novelty series is implausibly clean.** `0.96 → 0.88 → 0.82 → 0.77 → 0.72 → 0.68 → 0.63 → 0.59 → 0.55 → 0.50 → 0.46 → 0.41 → 0.36 → 0.31 → 0.26 → 0.21 → 0.16 → 0.11 → 0.07 → 0.03` is perfectly monotonic with deltas of only 0.04–0.08. Stochastic LLM novelty estimates do not decline this regularly. The values are real in `deep-research-state.jsonl` and the dashboard, but spot-check whether `newInfoRatio` was genuinely computed per iteration or produced by a deterministic/scripted trajectory — this directly bears on the "corpus exhaustion" claim.
- **NOOA tool count** (see §2) — verify against paper lines 209-231.

## 6. MISSING COVERAGE

- No acknowledgment of 036's dark-mode / not-yet-cut-over status (the §4 gap).
- No design rule preventing the reducer memory projection from caching authoritative history as if authoritative (the §4 gap).
- No threat model for prompt-injection abuse of the P3/P4 read-and-tool facades beyond "record reads" and P7 mutants; there is no design-level mitigation stated (e.g., capability-scoped, non-payload-logging reads already exist in P3, but tool-call abuse of `call_declared_tool` is not addressed at design level).
- The Terminal Audit measurement table is entirely empty of numbers — no baselines, so "no regressions" is currently unprovable. Acknowledged as DESIGN-level, but the doc presents the table as "required measurement" without noting that zero of these measurements exist yet in any shadow form.

## 7. TOP 3 FIXES (ranked)

1. **Correct the 036 grounding.** Replace "the existing transition-authority system" with "the *designated* transition-authority plane (in-progress; ledger core running dark; authority cutover planned)." Add one sentence stating the live runtime currently has no authoritative 036 gate, so every subordination guarantee is a target-state invariant, not a current enforcement fact.
2. **Disambiguate P1's "artifact handles" vs the deferred P6 `ArtifactHandleV1`.** State explicitly that P1 ships on `contentDigest`-based admission (or a minimal `{artifactId, contentDigest, snapshotHead}` handle) and does not depend on the deferred P6 type.
3. **Add the authoritative-history read-through rule to P2**, and add a one-line data-integrity caveat on the novelty telemetry (flag the monotonic series as executor-generated and treat it as trajectory metadata, not corpus-exhaustion evidence). Optionally correct the NOOA memory-tool list to all seven tools.
