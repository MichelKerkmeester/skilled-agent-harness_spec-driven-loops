# DeepSeek V4 Pro — Independent Verification of the Graphene Synthesis

> Adversarial verification of `research.md` by DeepSeek V4 Pro (cli-pi `--provider deepseek --model deepseek-v4-pro --thinking high`), a second, different model. Verdict: **PASS-WITH-FIXES**. All flagged fixes were applied to research.md (grounding block added; overclaims hedged; Decision-2 verdict corrected; body P1–P7 renumbered; staged-delivery table marked as an 8→9 reconstruction). Produced 2026-08-13.

Verified against the actual repo (the cited lineage files and the graphene-main corpus both exist under `specs/system-deep-loop/037-graph-engineering/`). My findings below are grounded in spot-checks, not just plausibility.

---

## 1. OVERALL VERDICT

**PASS-WITH-FIXES.** The synthesis is faithful to its source lineage — I verified the major citations (iteration-020 verdicts, the `done(node,…)` inference, the `0.79/0.74/0.48/0.73/0.68/0.71/0.46` novelty numbers) and they match — but it overstates finality, mislabels one contradiction target, and reconstructs a 9-stage rollout table whose citations don't line up with the underlying 8-step source.

## 2. UNSUPPORTED / OVERCLAIMED

- **"It converts seven underspecified parts of repo 1 into concrete contracts: …"** — "concrete contracts" clashes with the document's own body tag `[INFERENCE: the schema and package names are proposed implementation contracts, not shipped runtime APIs]` and with iteration-020's evidence-gap table ("Exact package/file and final field names are proposed, not shipped"). "Underspecified" also does not appear in the source; iteration-020 says "adds" and "refines," not "converts underspecified parts."
- **"The research settles architecture and contract semantics."** — Stronger than the source's "answered at design-decision level." "Settles" is hard to defend against a `maxIterationsReached` stop and a terminal `newInfoRatio` of 0.46 (nearly the 0.48 "fell to" low at iteration 11 — i.e., not converged by the study's own metric).
- **"Open design conflicts: none"** — stated flatly in the Convergence Report despite the preceding honest line "Convergence telemetry was not stop authority." The honest reading is "none found within the iteration budget," which the synthesis does not carry into the bullet.
- **"Graphene's strongest contribution is executable negative knowledge."** — A value judgment with no comparative measure; the supporting "aggregate contradiction density" characterization of repo 1 is not sourced here.
- **"Its cache is correctly disposable."** — "correctly" is an editorial verdict, not an observed fact shown.

## 3. INTERNAL INCONSISTENCIES

- **Contradiction target mislabeled.** The confirm/refine/extend table row "Decision 2" says `CONFIRMS and REFINES; CONTRADICTS lease sufficiency`. The body "Decision 4" says `CONTRADICT Graphene's documented revoked-claim guarantee`. Iteration-020 (the source) says `CONFIRM repo-1 Decision 2; REFINE lease insufficiency into an exact commit API` and iteration-006 finding #1 explicitly titles the contradiction against *Graphene's* revoked-claim guarantee while *confirming* repo-1's lease-insufficiency conclusion. So the table's "CONTRADICTS lease sufficiency" is backwards/misattributed — repo-1's lease-insufficiency is confirmed, Graphene's claim is what's contradicted.
- **Dual "Decision" numbering.** Body sections are "Decision 1…7" but they are P1–P7 (e.g., "Decision 1" verdict = "REFINE repo-1 Decisions 5 and 8," matching iteration-020's P1). The table uses "Decision 1…8" for *repo-1's* decisions. The lineage consistently says "P1–P7"; the synthesis renamed them "Decision N," colliding with repo-1's numbering.
- **"Nine-step" vs "eight-step."** The synthesis asserts "Repo 1's nine-step rollout remains controlling," but iteration-018's own Assessment says "a reversible **eight-stage** adoption sequence" and iteration-020's "Dependency-Safe Implementation Order" has **8** steps. The 9-stage framing is never cited to repo-1.

## 4. LOGICAL GAPS

- **Confirmation vs consistency.** Every table row for repo-1's 8 decisions lands on CONFIRM/REFINE/EXTEND; every CONTRADICT is aimed at Graphene, never repo-1. No falsifiable test of repo-1's architecture is described — "Graphene has a fold" is consistent-with, not confirmation-of, "projections should be disposable." A study scoped to confirm/refine/extend/contradict that contradicts the *subject codebase* 100% and the *prior study* 0% warrants an explicit note that repo-1 was never subjected to a negative control.
- **"Projection validity or freshness still cannot select authority"** is asserted without its premise (presumably: freshness/validity are recomputable properties, not admission events). The reader is left to supply it.
- **Global-serialization jump.** From "`BELIEF_ADD` doesn't check nogoods" the design concludes "all truth writers share one serializable belief-admission head." The minimal fix (check nogoods at add) does not obviously require a single global serialization point; the design makes global serialization the *default* and only relaxes it via a "disjoint-closure manifest" that is itself unproven. This is the largest under-argued architectural escalation.
- **P6-first ordering.** The dependency invariant `P6 → P2 → P3 → …` is stated as a fact, but the edge forcing P6 (a refusal *type*) to precede P2 (replay cuts) is never derived; "additive" is a rollout convenience, not a logical dependency.

## 5. CITATION RED FLAGS

I verified most of the heavyweight citations and they are accurate. Remaining spot-check targets for a human:

- **Staged Delivery table — `iteration-020.md:74-79, 76-78, 79-80, 80-83, 81-82, 82-83`.** Verified: lines 74–83 of iteration-020 are the *8-step* "Dependency-Safe Implementation Order" (steps 1–8). The synthesis's 9 rows are a re-projection onto repo-1's stages, and the per-row ranges are nested/overlapping and off-by-one (e.g., stage 2 cites lines 76–78 = steps 1–3, not step 2). Stages 7–8 cite `iteration-015.md` (a different file), confirming the table is a two-file reconstruction, not a single cited source.
- **"Repo 1's nine-step rollout"** — asserted with no repo-1 citation anywhere in the document.
- **`iteration-014.md:7-74` and `iteration-011.md:7-77`** — 67- and 70-line ranges for single claims; `7-74` is reused for two *different* claims (executive paragraph 2 and the integrated control protocol). Broad and overloaded.
- **The uniform `7-N` citation starts** are *not* a red flag — I confirmed the iteration files carry a ~6-line header, so content genuinely begins at line 7. Benign.
- Note: every citation in the synthesis points to `iteration-NNN.md`. The underlying iterations *do* cite graphene-main primary source (`crates/graphene-core/src/fold.rs`, `graphene-exec/src/lib.rs:450-515`, etc.), but the synthesis dropped those entirely, leaving "OBSERVED-IN-CODE" one hop removed from code.

## 6. MISSING COVERAGE

- **No definition of "036."** "036 authority plane," "036 transition," "authority-zero" are used throughout but never defined; the synthesis is unreadable standalone without study 1.
- **No grounding of graphene-main itself.** The synthesis never says "Rust" or "SQLite" or names a single crate, despite the corpus being a Rust workspace (`crates/graphene-core|exec|store|cli`, `rust-toolchain.toml`) with a SQLite log (per iteration-020's own conflict table). A code-audit synthesis that never names the language or a file is suspiciously abstract.
- **Settlement soundness unexamined.** Detecting "repeated whole-state digests" requires storing every prior state digest (memory growth); a "monotone-four-state measure" does not by itself guarantee termination without a bounded/well-founded order. Neither is analyzed.
- **Serialization cost unexamined.** The single serializable truth-admission head is accepted with "throughput/latency = measure later" but no design argument that it's even tractable under contention.
- **No independent adversarial review.** A1–A7 mutants are self-generated by the same lineage; nothing establishes they exhaust the attack surface.
- **`newInfoRatio` is never defined** (scale, what counts as "converged"). The synthesis reports 0.79/0.46/… as meaningful without stating the metric or a threshold.

## 7. TOP 3 FIXES

1. **Rebuild the Staged Delivery table from iteration-020's actual 8-step order (lines 76–83), or explicitly mark the 9-stage repo-1 mapping as a synthesis reconstruction and cite repo-1 for the "nine-step" claim.** Resolve the 8-vs-9 discrepancy and replace the nested/overlapping line ranges with the correct per-step lines. This is the single most mis-cited block in the document.
2. **Fix the Decision-2 table row** to `CONFIRM/REFINE repo-1 lease-insufficiency; CONTRADICT Graphene's revoked-claim guarantee` (matching the body and iteration-006), and **rename the body "Decision 1–7" sections to P1–P7** to eliminate the numbering collision with repo-1's "Decision 1–8."
3. **Add a one-paragraph grounding block**: define 036/authority-plane/transition in one line; state what graphene-main is (Rust, SQLite, crate layout); and either forward primary-source citations or add a traceability note that "OBSERVED-IN-CODE" claims reach code via the cited iterations. Simultaneously hedge "concrete contracts," "settles," and "Open design conflicts: none" to reflect the `maxIterationsReached` stop and 0.46 terminal novelty.
