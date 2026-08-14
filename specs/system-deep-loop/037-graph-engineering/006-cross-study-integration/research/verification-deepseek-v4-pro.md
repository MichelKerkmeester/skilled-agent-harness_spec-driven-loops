# DeepSeek V4 Pro — Independent Verification of the Cross-Study Integration Capstone

> Adversarial verification of `research.md` (the SOL-xhigh cross-study integration synthesis) by DeepSeek V4 Pro (cli-pi deepseek-v4-pro, thinking=high). Verdict: **PASS-WITH-FIXES**. It read S1–S5 `research.md`, all ten Study-6 iteration files, and `orientation.md`, and spot-checked the cited line ranges. Its strongest confirmation: the eight cross-links are **real integrations, not concatenations** (the D/C/G/H/R/M bundle maps six distinct study outputs; the P6 machine composes S2 belief + S3 policy/gate + S5 return/evidence; the P7 DAG merges S1's 9 + S2's 8 + S3's 10 stages into one dependency graph), and the **036-dark status is carried honestly end-to-end** ("the document's strongest point"). Its material catches: the eight artifacts were called "concrete" when they are unimplemented nominal schemas; two distinct convergence systems were silently merged; and a few single-line citations over-reached. All fixes applied to `research.md`. Produced 2026-08-14.

---

## Fixes applied to `research.md`

**Top-3 (all applied):**

1. **Reconciled the two convergence systems.** Named S5's shipped, live `StopDecision` (the per-loop stop mechanism, retained unchanged) versus the *proposed* target-state graph "convergence reducer" (terminal-transition eligibility only). Added a P6 paragraph stating the target `Convergence` stage does not replace `StopDecision`, and rewrote the P8 arbitration bullet from the invented "convergence reducer owns stop eligibility" to a two-mode statement (target reducer owns terminal eligibility; shipped `StopDecision` owns current per-loop stop and is retained, not replaced).
2. **Downgraded "Concrete unified artifact" → "Proposed unified artifact (nominal schema, unimplemented)"** in all eight P-section headers, and labeled the "seven operational planes" taxonomy as `[INFERENCE]`, explicitly distinct from S1's own seven-plane model (which counts the 036 authority plane as one of its seven).
3. **Constrained the loose citations.** Moved the enumerated authority-invariant list fully under `[INFERENCE]` with per-item owners (projection/claim/refusal from S2 452-465; typed-return non-promotion from S5; score non-masking from S3/S5; belief non-authority from S2; convergence non-authority from S1; policy/human non-bypass from S3) and noted no single source states the full list; narrowed the S3 gate-stack clause so `003:43-77` covers only admission and the admission-versus-authorization separation (policy compiler lives at 78+); narrowed the S2 spine clause to projection/refusal/claim, dropping "parity results and human decisions" from the 452-465 anchor.

**Secondary honesty fixes (all applied):**

- Softened completion-flavored verbs — "five completed studies" → "five studies, each a completed 20-iteration research run"; "It settles doctrine…" → "It defines proposed doctrine… and reconciles them internally."
- Qualified the "hierarchical budgets" Design-settled bullet as doctrine-only, with graph-side budget normalization flagged open per P4.
- Assigned the recovery family `R` an owning-study set (S2 reconciliation, S3 rollback governance, S1 rollback-window/cutover assets), closing the D/C/G/H/R/M attribution gap.
- Added the S3 issuer/trust-root threat-model gap (key custody, rotation, revocation of the admission signer) to the architecture "Still open" list, closing the dangling S3→S6 interconnection.
- Retitled P4 "Gap Audit" → "Gap Inventory" to match its own static-source-inventory caveat.
- Concurrency-under-contention remains in the "Open" list, honestly listed rather than integrated, because no source study analyzed it.

---

## 1. OVERALL VERDICT: **PASS-WITH-FIXES**

The cross-links are real and largely correctly cited, and the 036-dark status is carried honestly end-to-end — but the document overstated the "concreteness" of its eight artifacts, silently merged two distinct convergence systems, and leaned on loose single-line citations for broad claims.

## 2. UNSUPPORTED / OVERCLAIMED

- **"Concrete unified artifact"** (used ~8×: the `PromotionBundle` struct, the P6 state machine, the P7 DAG, the P4 matrix, the P1 two-mode table). None of these exist as code, wire contracts, or in any of S1–S5. They are text schemas invented inside Study 6's iteration narratives. "Concrete" inflates nominal markdown into deliverables. The iterations themselves say "proposed," "not shipped," "the files do not yet exist."
- **"The result is DESIGN-level. It settles doctrine…"** and **"five completed studies."** "Settles"/"completed" are completion-flavored verbs. Every S1–S5 self-reports `maxIterationsReached` and explicitly states it did *not* converge. "Completed" is true only of the 20-iteration runs, not of the work.
- **"Design-settled: … hierarchical budgets and separately authorized effects."** P4's own matrix says budgets are "Present … graph normalization is still required." Listing them under "Design-settled" reads stronger than the source supports.
- **"the convergence reducer owns stop eligibility"** (P6 + P8). No study defines a "convergence reducer." S5 explicitly keeps the live `StopDecision` "intentionally not one of the three evaluation layers" and "retained unchanged." An invented owner.

## 3. INTERNAL INCONSISTENCIES

- **Convergence is two systems, treated as one.** S5's shipped live convergence vote (`StopDecision`: rolling novelty, MAD, coverage) is "CONFIRM; do not replace"; S1's convergence is typed-subgraph terminal verdicts. The synthesis folded these into a single machine layer owned by a "convergence reducer," never reconciling the live vote with the target graph reducer.
- **"Seven planes" mismatch.** S1's table credits seven planes with 036 authority *as* plane 1. The "Single Integrated Architecture" then presents a *different* seven-plane taxonomy (adds Loop/harness and Promotion/recovery; demotes authority out of the seven) without an `[INFERENCE]` label.
- **R-family ownership gap.** The promotion bundle names D/C/G/H/R/M, but the spine attributed C(S2), G(S3), D(S4), H/M(S5), traces(S1) — and never assigned **R (recovery/rollback drills)** to any owning study.

## 4. LOGICAL GAPS

- **Are the artifacts integrations or concatenations?** Genuinely *integrations*, not concatenations — verified: the D/C/G/H/R/M bundle maps six distinct study outputs; the P6 state machine composes S2 belief + S3 policy/gate + S5 return/evidence; the P7 DAG merges S1's 9 + S2's 8 + S3's 10 into a 13-node dependency graph. But they are *nominal, unimplemented* schemas. The honest noun is "proposed contract," not "artifact."
- **Is 036-dark honestly carried?** Yes — consistently (grounding, P1 current-state order, P4 "Shadow-only"/"Missing", P6 `shadow_recorded` terminal, "What Remains Unproven", the dual-mode tension row). This is the document's strongest point. Residual risk only: the present-tense "Design-settled" list can read as enforced.
- **Unaddressed cross-study gap — issuer/trust security.** S3's "Unexamined Assumptions" flags "issuer security is out of scope" (key custody, rotation, revocation of the trust-separated admission signer) and a "narrow threat model." The synthesis's P4 audited 036 capabilities but never picked up the issuer-compromise/threat-model hole — a real S3→S6 interconnection left dangling.

## 5. CITATION RED FLAGS (spot-check)

- **S3 itself warns** (its "Unexamined Assumptions"): "Several synthesis citations point to single-line iteration anchors that carry multi-claim bullets… treat the iteration narratives, not the exact line numbers, as the authoritative source." The capstone replicated this practice (`003:18`, `004:21`, `005:48`, `002:452-465`).
- **`002:452-465`** was cited for the broad invariant "no proposal, projection, validation, score, belief, convergence result, policy verdict, or human approval becomes mutation authority." That range actually supports *projection/claim/refusal* only; the other clauses come from S3/S5. The enumerated list was correctly `[INFERENCE]`-tagged, but the `[SOURCE]` tag over-claimed.
- **`003:43-77`** was cited for "structural admission, policy, and authorization separation" but covers only R1 (admission) + R2 (sealing); policy is R3, at lines 78+.
- **Verified as accurate:** `003:18` (admission≠authorization), `004:21` (prefer-newer scoping), `004:153-158` ("None is independently authoritative"), `005:48` ("Type-valid does not mean … authorized"), S2:505-523 (staged order), the novelty trajectory `0.88→0.82→0.76→0.91→0.72→0.66→0.63→0.69→0.04→0.03` (exact match to the ten iteration files), and the "10 of 10 / maxIterationsReached" stop reason.

## 6. MISSING COVERAGE

- **S5 live-convergence vs typed-subgraph convergence** — the one cross-study tension not reconciled (see §3). *(Fixed.)*
- **Issuer/trust-substrate security** and S3's "narrow threat model" — carried in S3 but dropped by the capstone. *(Fixed: added to "Still open.")*
- **Concurrency**: S4's "concurrency behavior is unanalyzed" appears only in the "Open" list; no integration angle addresses *how* any study's contracts behave under contention. Listed, not integrated. *(Left honestly in "Open" — no study analyzed it.)*
- **P4 title overreach**: "Gap Audit" is a static source-file inventory, not an operational audit. *(Fixed: retitled "Gap Inventory".)*

## 7. TOP 3 FIXES (ranked, as delivered)

1. **Reconcile the two convergence systems.** Name S5's live `StopDecision` (shipped, current) vs the target graph "convergence reducer" (proposed), state which owns stop eligibility in each mode, and change "convergence reducer owns stop eligibility" to match S5's "StopDecision is retained and is not an evaluation layer."
2. **Downgrade "Concrete unified artifact" → "Proposed nominal schema (unimplemented; not present in any source study),"** and re-label the "seven operational planes" taxonomy as an `[INFERENCE]` distinct from S1's seven planes.
3. **Fix the loose citations.** Constrain `002:452-465` (and any similar broad range) to what it actually contains; move the enumerated invariant list fully under `[INFERENCE]` with per-item owners; and honor S3's granularity caveat.
