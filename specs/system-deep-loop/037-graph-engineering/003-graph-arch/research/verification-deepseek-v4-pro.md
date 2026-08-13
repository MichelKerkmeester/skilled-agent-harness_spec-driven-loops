# DeepSeek V4 Pro — Independent Verification of the GraphARC Governance Synthesis

> Adversarial verification of `research.md` by DeepSeek V4 Pro (cli-pi `--provider deepseek --model deepseek-v4-pro --thinking high`), a second, different model. Verdict: **REWORK**. Its findings were substantive and were applied to research.md before closeout: (1) recast the 'decisive' finding + dropped the admission-as-authorization strawman, adding an explicit threat model and flagging the 036-capability assumption; (2) reconciled the stop-reason contradiction to the maxIterationsReached hard cap; (3) dropped the false '28 mutants' precision; (4) relabelled the stretched 'CONFIRM by absence/contrast' and behavior-targeting CONTRADICT table rows; (5) softened 'Exact insertion point' -> 'Proposed'; (6) defined 'trust-separated' and 'reference-closed'; (7) added an 'Unexamined Assumptions and Missing Coverage' section (threat model, issuer security, 036 capability, owner-disagreement, no measurements, concurrency, citation granularity); (8) fixed the novelty-trend wording. Produced 2026-08-14.

1. **OVERALL VERDICT: REWORK.** The central "decisive" finding is overclaimed and aimed at a strawman ("an admission-as-authorization reading" that no prior decision asserts), and the document's own account of why the run stopped is self-contradictory — two load-bearing pillars that need repair, not just citation cleanup.

---

2. **UNSUPPORTED / OVERCLAIMED**

- **"Its decisive result is negative: admission is a precondition, not authorization."** — "Decisive" is unearned. An unsigned Python wrapper not authenticating its `AdmissionResult` is a mundane, expected property of any in-process library, not a deep or decisive finding. The framing inflates a category observation into the study's headline result.
- **"CONFIRM, with one decisive CONTRADICT against any admission-as-authorization reading."** — The CONTRADICT targets a *reading* (an interpretation), not an actual `study-1`/`study-2` decision. This is contradicting a strawman; no cited prior decision claims admission *is* authorization.
- **"The 28 governance mutants cover forged/bypassed admission, rename laundering, …"** — The count "28" is asserted as fact (not flagged [INFERENCE]), but the category list that follows has ~16 categories. Nothing substantiates that the source enumerates exactly 28, and no enumeration is provided.
- **"GraphARC's stage examples and negative tests are strong fixture seeds…"** — "strong" is an evaluative claim with no evidence shown of what these examples/tests actually contain.
- **Eight "Exact insertion point." sections** specify file names (e.g., `runtime/lib/graph-admission/graph-admission-proof.ts`) while the same sections state the files "do not yet exist" / "not shipped." "Exact" overclaims precision for unbuilt proposals.
- **"`stopReason=maxIterationsReached`"** is rendered as a precise enum value in code font but is flagged [INFERENCE] — an invented identifier presented as fact.

---

3. **INTERNAL INCONSISTENCIES**

- **Stop reason contradicts itself.** Status: "The run ended because iteration 20 was the configured hard stop… it did not establish convergence." Convergence Report: "Iteration 20 independently checked the full lineage and **directed that no iteration 21 be launched**." A *directed* stop is a semantic judgment; a *configured hard stop* is not. The two accounts of why the run ended are incompatible.
- **Novelty trend phrasing.** "the final five ratios **declined** to `0.64, 0.64, 0.57, 0.50, 0.60`" — the last element *rises* from 0.50 to 0.60, yet the text says "declined," then separately explains "The iteration-20 increase." Internally contradictory wording.
- **"eight research angles rather than eight wire families"** — but the document defines ~11 wire records (`GraphAdmissionProofV1`, `SealedCompiledGraphV1`, `OrganizationGraphPolicyV1` + compiled variant, `GraphApprovalGateV1`, `TransitionRefusalV1` + 2 variants, `GraphExecutionEventV1`, `GraphExecutionProjectionV1`, `GraphBudgetQuoteV1`, `GraphParityPromotionEvidenceV1`, `GraphTransitionEvidenceV1`). The "not eight wire families" correction is misleading — there are *more* than eight.
- **"Terminal Audit… internally consistent"** sits in tension with the stop-reason contradiction and the "decisive CONTRADICT against a reading" strawman.

---

4. **LOGICAL GAPS**

- **Forgeability → revalidation does not follow.** The jump from "`AdmissionResult` is forgeable" to "036 must independently revalidate current actor, capability, evidence, policy, authority epoch, ledger head, budget, gate, fence, and exact event identity" is a prescription, not a derivation. The synthesis never establishes that 036 *can* perform this 12-item revalidation — it projects requirements onto an external system whose own capability is assumed, not audited.
- **"CONFIRM by absence" (`study-2 P4`) and "CONFIRM by contrast" (`study-2 P1`).** GraphARC *lacking* a mechanism (claimant-addressed fencing) cannot "confirm" a `study-2` decision; it only shows GraphARC doesn't implement it. Absence/contrast are not confirmation — the taxonomy is stretched to preserve the confirm/refine/extend/contradict frame.
- **CONTRADICT rows misdirected.** `study-2 P5` "CONTRADICT GraphARC's write-then-detect memory behavior" and `study-2 P7` "EXTEND + CONTRADICT GraphARC bypassability" contradict GraphARC *behavior*, not a prior decision. The table's stated purpose is to classify GraphARC against `study-1`/`study-2` decisions; these rows change the target.
- **Undefined load-bearing terms.** "trust-separated" and "reference-closed" carry the entire adoption decision ("versioned, reference-closed contracts"; "trust-separated issuer") but are never defined operationally (separate process? separate key? separate admin domain?).
- **"Every central `study-1` and `study-2` decision was classified."** "Central" is never enumerated, so "every" is unverifiable — the table shows only D1–D8 and P1–P7.

---

5. **CITATION RED FLAGS** (spot-check these)

- **`iteration-001.md:23-23`** — one line cited for ≥4 distinct claims: `study-1 D8` CONFIRM, `study-2 P1` confirm-by-contrast, `study-2 P5` CONTRADICT, and the gaps-table "write-then-detect" row. Overloaded to the point of implausibility.
- **`iteration-002.md:11-11`** and **`:19-19`** — single lines carrying multiple distinct claims (policy-identity loss + "policy JSONL is a debugging projection"; budget estimation).
- **`iteration-018.md:17-17`** — cited for *two unrelated* claims: "hard provider budgets" AND "multi-host fencing."
- **`iteration-015.md:23-45`** — cited for *both* the R7 budget lifecycle *and* the 20-step end-to-end owner order.
- **`iteration-019.md:41-45`** — cited for *both* `GraphAdmissionProofV1` and `SealedCompiledGraphV1`.
- **`iteration-010.md:23-77`** — does it actually enumerate 28 mutants, or only the categories paraphrased here?
- **Suspicious pattern:** an odd-numbered single-line run — `:9-9`, `:11-11`, `:13-13`, `:15-15`, `:17-17`, `:19-19`, `:21-21`, `:23-23` — suggesting one-line bullet entries are being cited to carry whole multi-sentence paragraphs. This directly undercuts the "Citation traceability" claim.

---

6. **MISSING COVERAGE**

- **Threat model.** "Forgeable `AdmissionResult`" presupposes an adversary, but who? Internal operator, compromised model, malicious plugin, supply-chain code? No adversary is named, so "trust-separated issuer" has no defined threat to defeat.
- **Issuer security itself.** If the trust-separated issuer is compromised, every proof is worthless — yet there is zero coverage of issuer key custody, rotation, revocation, or compromise response.
- **036 capability audit.** The design offloads 12-item revalidation to 036 but never verifies 036 has those primitives; if it doesn't, the whole architecture collapses. This is the largest unexamined assumption.
- **Owner-disagreement resolution.** "Owner disagreement blocks forward action" is stated, but there is no mechanism for arbitration, escalation, or timeout — a dead-end is declared with no exit.
- **Performance/overhead.** The study "analyzed" GraphARC but reports zero measurements (latency, memory, admission/compile cost); everything is deferred to a future prototype. A rigorous governance synthesis should at least bound the overhead it is proposing.
- **Concurrency model.** "approximate under concurrency" is asserted with no analysis of GraphARC's actual concurrency behavior (GIL, async, threading, fan-out races).
- **Human-gate operator experience / operator load** — named as a future baseline but never designed.

---

7. **TOP 3 FIXES**

1. **Recast the central finding.** Downgrade "decisive," drop the strawman "admission-as-authorization reading" as the CONTRADICT target, and state plainly: unsigned in-process admission is expected, and the actual requirement is (a) a named threat model and (b) a trust-separated signer — then derive the 036 revalidation list from that threat model instead of asserting it.
2. **Reconcile the stop-reason account.** Choose one: either the hard cap (`maxIterationsReached`) ended the run, or iteration 20 made a directed no-continuation judgment. Delete "directed that no iteration 21 be launched" if the cap was the actual stop, and make the Convergence Report match the Status section.
3. **Repair citation overload.** Give each distinct claim its own non-overlapping source range; break the single-line citations (`:23-23`, `:11-11`, `:17-17`, `:19-19`, `:15-15`) into real spans; and either enumerate the 28 mutants or drop the specific count.
