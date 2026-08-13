# Per-Mode Deepening — How Each Deep-Loop Mode Improves and Becomes Uniquely Valuable

> A 40-iteration, non-converging follow-on run inside packet 005 (run-2). Single lineage — GPT-5.6 SOL at **xhigh** reasoning (fast tier) via cli-codex `codex --search exec` — seeded with the **290** repos from 001 + 005 run-1 as a do-not-re-list set. Organized as **8 modes × 5 angles** (state-of-the-art → unique-value/moat → mechanisms → failure-modes → synthesis). Every iteration answered two questions about one mode: *how does it get better*, and *what makes it uniquely valuable versus the other deep modes and a generic single-shot alternative*.

---

## 1. Executive Summary

Where run-1's 59 recommendations were overwhelmingly about the shared **runtime** (fan-out, checkpointing, gauges), this run went **per-mode** and found the thing run-1 skipped: **what each mode is uniquely for.** Across 40 iterations (0 parse failures) it catalogued **163 new repos** (beyond the 290 prior), **168 insights**, **111 mode-specific recommendations**, and **84 evidence-backed contradictions**, mapped across all 8 modes and 16 targets.

**One finding dominates: every mode's moat is the same shape, and it is not "smarter per pass."** Across all eight modes, the highest-leverage recommendations converge on turning the mode from a *stateless generator* into a **longitudinal, replayable, falsifiable evidence ledger** — an append-only typed event log with versioned replay fingerprints, sealed/frozen reference artifacts, and receipts/certificates that a one-shot chat agent, a linter, or a public leaderboard structurally *cannot* produce. A PR bot gives a snapshot; deep-review gives an evolving assurance history. A deep-research chat agent gives a terminal report; our deep-research gives a claim ledger you can reopen months later and ask "what changed." That accumulated, auditable evidence is the moat — and it is the *same* moat, instantiated eight ways.

**Per-mode headline (the sharpened moat, one line each):**

| Mode | Generic alternative it must out-value | The sharpened moat |
|------|----------------------------------------|--------------------|
| **deep-research** | one-shot Deep Research chat agent (GPT/Gemini/Perplexity) | A **living claim-evidence ledger** that revises exactly what changed on new evidence while preserving valid prior work |
| **deep-review** | single-shot PR reviewer / static linter | A **proof-carrying finding ledger** that certifies what was examined, tries to *disprove* its own findings, and tracks a defect across passes and patch revisions |
| **deep-ai-council** | one strong model / self-consistency sampling | **Demonstrated** (not assumed) independent judgment: a sealed stance-transition + influence ledger proving the verdict survives changes irrelevant to merit |
| **deep-improvement** | "ask the model to improve itself" | The only mode that **commits the ruler before the mutation** — a frozen, secrecy-enforced evaluator capsule + reversible, workload-scoped promotion |
| **deep-alignment** | linter / one-shot "check the rules" prompt | A **reproducible temporal conformance proof** bound to an authorized standard *version*, with governed, expiring exceptions |
| **agent-improvement** | manual prompt tweaking | A **portable behavioral warranty** for an agent definition: change-control with counterfactual causal replay, not a scalar prompt score |
| **model-benchmark** | public leaderboards (LMArena/HELM) | A **private, workflow-conditioned, cost-aware selection policy** with sealed task-derived canaries — a causal stack-selection experiment, not a rank |
| **skill-benchmark** | benchmarking the underlying model | A **Skill Contribution Certificate**: paired causal lift of a *portable bundle* across executors, with gold-integrity gating |

**Cross-cutting honesty:** the run also surfaced the sharpest *refutations* of naive versions of each moat — a frozen evaluator is **not** automatically un-gameable (a 2026 preprint shows reference-free judges still get optimized against); more providers/rounds is **not** inherently useful diversity (Self-MoA can beat heterogeneous MoA); a single aggregate ranking is **not** sufficient for model selection (Prompt-to-Leaderboard). The recommendations are written to survive those refutations, not to ignore them.

Full machine-readable catalogue: `research/findings-registry-modes.json`; per-iteration evidence: `research/iterations-modes/`; complete ranked digest: `scratch/synthesis-digest-modes.md`.

---

## 2. Method & Provenance

**Executor.** Single lineage, per operator directive: GPT-5.6 SOL (`gpt-5.6-sol`) at **xhigh** reasoning on the fast tier, via cli-codex `codex --search exec` (top-level `--search` for live web/GitHub mining). GPT via cli-codex only.

**Loop.** The proven Shape-B harness (`scratch/deep-loop-driver-modes.cjs`), sequential + findings-seeded + resume-from-JSONL-line-count, adapted to 40 iterations across 8 modes. `stop_policy=max-iterations`, `convergence_mode=divergent`. Serial dispatch with backoff to stay gentle on the shared OAuth.

**Seed.** Every prompt carried the full 290-repo name list (001's 216 + run-1's 74) as a do-not-re-list set, plus each mode's real identity and the generic alternative it must out-value. The merge step drops any candidate already in a prior registry — so all 163 repos are genuinely new.

**Angles.** Each mode ran the same 5-angle template: **A1** 2025-2026 state of the art · **A2** unique-value / moat · **A3** mechanisms & reference implementations · **A4** failure modes & guardrails · **A5** synthesis (highest-leverage recs + the sharpened moat thesis).

**Verification.** URL reality sampled across modes (sampled URLs resolved HTTP 200; none present in the prior registries). As in the prior runs, repo *existence* is URL-checked but stars/recency are model-reported and not audited; the arXiv/doc citations should be spot-audited before any load-bearing design rests on them.

**Guardrail (held).** Research + scratch only. Zero edits to shipped `runtime/` or skill code; all writes inside this spec folder. The mode identities were read from each mode's `SKILL.md`, not invented.

---

## 3. Scope & Success Criteria

| Criterion | Target | Result |
|-----------|--------|--------|
| Iterations complete | 40 | **40/40** (0 parse failures) |
| Modes covered | 8 × 5 | **8/8 at full 5/5** |
| New repos (beyond 290 prior) | ≥10 | **163** |
| Mode-specific recommendations | strong set | **111**, each with a moat/uniqueness field |
| Synthesis incl. Eliminated Alternatives | yes | this document (§13) |
| Zero shipped-runtime changes | yes | held — all writes in this spec folder |

**Out of scope (held):** `ai-system-improvement` (dropped per operator); any edit to shipped runtime/skill code; cross-run ranking and production wiring (gated follow-ons). Each mode's full rec set lives in the registry; below is the ranked, curated top.

---

## 4. deep-research

**Identity today:** autonomous deep-research loop — iterative investigation, externalized JSONL state, convergence detection, fresh context per pass, findings registry, memory-graph save.

**Sharpened moat.** A one-shot Deep Research agent produces a *terminal report*; deep-research should produce a **living claim-evidence ledger**. The unique, defensible capability is *update precision*: when a source is corrected or retracted, invalidate exactly the affected claims through dependency edges while preserving the rest of the investigation — and answer "what changed and why" months later. Convergence stops being "the loop got repetitive" and becomes "the remaining evidence risk is bounded."

**Top recommendations (ranked):**
- **[high/S]** Build a two-snapshot longitudinal fixture (additions, corrections, retractions, duplicate sources) and measure affected-claim precision/recall + unaffected-claim stability *before* wiring any incremental refresh. — _proves the living-research moat with a benchmark, cheaply._
- **[high/M]** Add a reducer-owned **research-plan DAG**: typed question nodes with dependencies, required source classes, disconfirming queries, budgets, and branch lifecycle events. — _a durable, forkable plan survives context loss; one-shot agents expose only a transient plan._
- **[high/M]** Replace raw `newInfoRatio` convergence with **trusted evidence yield** + STOP-blockers (unsupported high-impact claims, unresolved contradictions, missing falsification receipts, citation drift); treat max-iteration exhaustion as *incomplete*, not converged.
- **[high/M]** Periodic **draft-to-gap passes**: audit the evolving outline for unsupported claims, missing counterarguments, and stale evidence, then enqueue the highest-value gap. — _the report becomes a reproducible projection of an evidence program._
- **[high/L]** A **ClaimRecord ledger** (versioned status, exact evidence locators, support/refute/qualify edges, independence clusters, supersession links); generate `research.md` *from* the ledger, and block strong claims lacking independent support or a contested label.

**Key repos:** `assafelovic/gpt-researcher` (branching question frontier with branch-local context) · `langchain-ai/local-deep-researcher` (typed gap→query transitions, not prose "next focus") · `GAIR-NLP/DeepResearcher` (claim-level cross-validation + explicit unresolved state) · `asreview/asreview` (persist screening labels to prioritize the next candidate) · `ResearchObject/ro-crate-py` (portable research object for replay).

**Sharpest tension:** "scrape more sites, pick the frequent answer" fails when sites copy a common upstream — the transferable unit is *independent* evidence, not source count.

---

## 5. deep-review

**Identity today:** autonomous iterative code-review loop — externalized state, convergence detection, P0/P1/P2 findings, adversarial verify, fresh context per pass, `review-report.md`.

**Sharpened moat.** A PR bot offers a snapshot; deep-review should offer an **evolving assurance history**. The unique capability is a **proof-carrying finding ledger** that (a) certifies *what was examined and ruled out* per changed surface, (b) actively tries to *disprove* its own findings with executable refutation, and (c) reasons about one defect across many passes and patch revisions — so historical false positives don't become global ignore rules.

**Top recommendations (ranked):**
- **[high/M]** Replace scalar P0/P1/P2 storage with **factored findings** (impact, confidence, action, evidence_kind, reachability, lifecycle). — _reversible adjudication history compounds across runs without contaminating fresh discovery._
- **[high/M]** A **dimension-coverage ledger** keyed by changed surface × applicable review dimension; schedule fresh-context passes to fill cells. — _certify what was examined, not just what was flagged._
- **[high/M]** A diff-scoped **executable-refutation lane** for P0/P1: run existing tests, targeted static queries, line-scoped checks to witness or falsify each candidate.
- **[high/M]** Reducer-owned **versioned partial fingerprints** (not a line+description hash) so one defect is tracked across passes and patch revisions.
- **[high/L]** A **proof-carrying finding ledger** with states suspected → witnessed → falsified → residual-risk → fixed-pending → fixed-verified. — _the durable falsification history is the moat._

**Key repos:** `The-PR-Agent/pr-agent` (documented second-pass 0-10 scoring) · `semgrep/semgrep` (deterministic high-recall candidate producers before LLM adjudication) · `SWE-bench/SWE-smith` (keep-only-if-a-test-breaks filter) · `PurCL/RepoAudit` (finding as a path-sensitive hypothesis, validate intermediate facts).

**Sharpest tension:** high comment precision / developer acceptance is **not** proof a reviewer is effective — high precision can hide very low recall, and acceptance can reflect preference.

---

## 6. deep-ai-council

**Identity today:** multi-seat diverse-lens planning/deliberation, multi-round critique, convergence checks, packet-local artifacts, council test gate.

**Sharpened moat.** More seats is not more robustness — the mode must make **demonstrated independent judgment the admission criterion**, not multi-agent theater. The unique artifact is a **sealed stance-transition + influence ledger**: who changed their mind, when, in response to which evidence, and a counterfactual receipt showing the verdict survives changes irrelevant to merit (provider, order, length). A single model or same-model self-consistency *cannot* produce a cross-vantage causal record of independent belief revision.

**Top recommendations (ranked):**
- **[high/S]** A **council-worthiness preflight** in `deep_ai_council_config.json` (distributed_information, value_conflict, decision-stakes gates) — only convene when the moat (integrating distributed information / legitimate value conflict) actually applies.
- **[high/M]** Replace transcript-wide rounds with **typed belief messages + recipient-specific dissent retention** (immutable claim IDs, minority lineage) — the influence graph is the collective-decision artifact.
- **[high/M]** Extend the council test gate with **control arms** it must beat: single-strong, self-consistency, and same-model MoA. — _positions the mode as accountable governance, not an expensive ensemble._
- **[high/M]** An **independence_batch contract**: seal first proposals across CLI-local rounds; persist model-family / reasoning-method / evidence provenance to *measure* effective independence.
- **[high/M]** A **blinded adjudicator gate**: anonymous candidates, A/B *and* B/A judging, provider + confidence masking → counterfactual receipts.

**Key repos:** `SpaceHunterInf/DMAD` (oversample then select a maximally diverse subset) · `tmlr-group/ECON` (explicit per-seat belief + equilibrium/oscillation checks) · `algorithmicsuperintelligence/optillm` (same-model MoA as a mandatory control arm) · `deeplearning-wisc/MAD-identity-bias` (blind provenance; measure conformity vs obstinacy).

**Sharpest tension:** different providers / more rounds do **not** inherently create useful diversity — Self-MoA can outperform heterogeneous MoA; mathematical MAD often gains little from more agents.

---

## 7. deep-improvement

**Identity today:** evaluator-first bounded agent improvement — 5-dimension scoring, dynamic profiling, packet-local candidates, guarded promotion.

**Sharpened moat.** Naive self-improvement produces one self-endorsed replacement; deep-improvement should be **the only mode that commits the ruler before proposing the mutation.** The unique capability is a **frozen, secrecy-enforced EvaluatorCapsule** created before candidate generation (hashed rubric + judge build), plus **reversible, workload-scoped promotion** with a regression envelope — turning "evaluator-first" from a convention into a mechanically enforced separation between mutator and ruler.

**Top recommendations (ranked):**
- **[high/M]** **Two-key promotion**: a candidate-blind hidden-anchor/verifier channel *plus* the frozen five-dimension evaluator must both clear — bounded, reversible, workload-scoped replacement.
- **[high/M]** A lane-independent **EvaluatorCapsule** created before any candidate exists (hash evaluator code, rubric, judge build). — _prove the mutation didn't move the ruler._
- **[high/M]** An append-only **TrialScore ledger**; split grading, calibration, reduction, promotion into separately versioned stages. — _an auditable measurement authority, not a prompt optimizer._
- **[high/M]** A **non-extractive evaluator-oracle API** (coarse verdict bands, per-epoch query budget) so evaluator secrecy is an enforced information-flow property, not an honor system.
- **[high/M]** A **regression envelope** for promotion: paired global lower bound + non-overridable sealed/gold slices (no aggregate-only promotion).

**Key repos:** `gepa-ai/gepa` (rich evaluator artifacts + per-case fitness vectors, minibatch admission) · `algorithmicsuperintelligence/openevolve` (separate performance elites from inspiration; quality-diverse lineages) · `ShengranHu/ADAS` (search agent architecture, not only prompt wording) · `A-EVO-Lab/AdaptiveHarness` (promote specialists conditionally by workload profile).

**Sharpest tension (important):** a frozen evaluator is **not** automatically sufficient — a 2026 preprint reports even frozen reference-free judges get optimized against. Hence the secrecy-as-information-flow + hidden-anchor recommendations.

---

## 8. deep-alignment

**Identity today:** autonomous standard-authority conformance audit by lane — verify-first findings, known-deviation suppression, read-only default.

**Sharpened moat.** A linter checks code against fixed rules; deep-alignment should produce a **reproducible temporal conformance proof bound to an authorized standard *version*.** The unique capabilities are (a) a per-rule **witness matrix** (conforming, violating, boundary, relational examples) that is a replayable semantic proof stronger than a linter diagnostic, and (b) **governed, expiring exceptions** (owner, issuedAt, expiresAt, authorityDigest) that give exception-aware longitudinal judgment across authority revisions.

**Top recommendations (ranked):**
- **[high/M]** A per-compiled-rule **witness matrix** (conforming / violating / boundary / relational examples). — _replayable semantic proofs stay comparable across iterations._
- **[high/M]** Replace passive known-deviation entries with **governed exceptions** carrying owner, expiry, authority digest, and multi-authority conflict analysis.
- **[high/M]** Replace pre-verification suppression with exact, expiring **DeviationAssertions** matched on authority digest + claim + lane. — _a versioned negative-assertion ledger, not a blanket ignore._
- **[high/M]** A per-lane **verifier admission gate**: shadow-run new authority/verifier pairs, sample dispositions before trusting them. — _audit trust becomes an evidence-backed operational property._
- **[high/M]** An **authority-capsule gate** before DISCOVER (source digests, rule manifest, publisher, authority epoch) — a conformance proof tied to a specific authorized version.

**Key repos:** `open-policy-agent/opa` (compile, type-check, test, coverage-gate, sign an authored policy) · `kyverno/kyverno` (deviations as scoped policy-referencing objects; pass/fail/warn/skip) · `microsoft/typespec` (compile authority prose into a typed rule IR; expose residual ambiguity) · `specmatic/specmatic` (replay old-authority witnesses against a new authority capsule).

**Sharpest tension:** always reading the *live* authority is **not** strongest — without an immutable authority revision + digest, the same audit can't be reproduced.

---

## 9. agent-improvement (deep-improvement variant)

**Identity today:** benchmark-anchored improvement of agent definitions/prompts/loops via behavior benchmarks + discipline stress tests + guarded promotion.

**Sharpened moat.** Manual prompt tweaking yields vibes; agent-improvement should yield a **portable behavioral warranty** — an evidence-backed promotion decision for an agent *constitution*, with counterfactual causal replay attributing a behavior change to a specific clause. It is behavioral change-control, not a scalar prompt score.

**Top recommendations (ranked):**
- **[high/M]** **Blocker-aware Pareto successive halving**: cheap invariant/replay checks gate before expensive scoring — evidence-backed promotion manual editing can't issue.
- **[high/M]** An independently versioned **improver-agent lane** with its own sealed benchmark — makes improvement capability itself a benchmarked, reusable asset.
- **[high/M]** A **sealed promotion lane** replaying candidates through a non-discovery executor family + isolated judge → a portable behavioral warranty.
- **[high/M]** `compile-agent-change` producing a **change-contract** (static assertions, trace policies, generated scenarios) — behavioral change control for agent constitutions.
- **[high/M]** **Failure-triggered counterfactual replay** using changed clauses as interventions and executors as policies — an evidence-producing causal debugger for agent-definition changes.

**Key repos:** `IBM/prompt-declaration-language` (models/demos/verification as typed free variables) · `EvoAgentX/EvoAgentX` (multiple optimizer backends behind one agent-workflow IR) · `aiwaves-cn/agents` (back-propagate textual requirements through recorded trajectories) · `YaoZ720/SwarmAgenticCode` (personal-best / global-best / failure-memory signals).

**Sharpest tension:** "self-evolving agent systems autonomously produce better agents" — most only show improvement on *optimizer-visible proxy tasks*; several cited systems haven't released code.

---

## 10. model-benchmark (deep-improvement variant)

**Identity today:** in-workflow task-anchored model benchmarking (router mode-A vs live mode-B), 5-dim scoring, cost-aware selection.

**Sharpened moat.** Public leaderboards give a generic rank; model-benchmark should give a **private, workflow-conditioned, cost-aware selection policy** — a *causal stack-selection experiment* using paired task blocks and sealed, expiring, task-derived canaries unavailable to any public benchmark. The terminal artifact is not a score but a task-conditional routing decision under the user's real prices.

**Top recommendations (ranked):**
- **[high/M]** **BenchmarkDesign + TrialResult events** implementing paired task blocks, randomized path/order, crossed model×path factors — a causal experiment, not a leaderboard.
- **[high/M]** A versioned **judge-calibration firewall**: deterministic checks first, blinded mirrored pairwise judgments, style-feature controls.
- **[high/M]** A **sealed-canary lifecycle** (creation hash, source timestamp, proposer/oracle visibility, expiry) — private task-derived canaries as a defensible evidence asset.
- **[high/M]** Wire real **usage/cost** (inference, retries, routing overhead) through every sweep row incl. failures — benchmark quality becomes an operational deployment decision under real prices.
- **[high/M]** Make the terminal artifact a **task-conditional selection policy** (preferred model, fallback, confidence, evidence expiry) — private cost-aware longitudinal routing.

**Key repos:** `lmarena/p2l` (task-conditioned strengths + routing under cost) · `aims-foundations/reeval` (spend eval budget on maximally informative items) · `IBM/eval-assist` (rubric + judge as a testable artifact) · `Code2Bench/Code2Bench` (fresh task-local cases only when generated oracles pass structural checks).

**Sharpest tension:** a single aggregate 5-dimensional ranking is **not** sufficient — Prompt-to-Leaderboard finds prompt-dependent strengths precisely because one global rank hides them.

---

## 11. skill-benchmark (deep-improvement variant)

**Identity today:** benchmarking a *skill* (packaged instruction+resource bundle) across executors — gold-set scoring, empty-gold detection.

**Sharpened moat.** Benchmarking the model answers the wrong question; skill-benchmark should certify the **portable bundle** — a **Skill Contribution Certificate** with paired causal lift (no-skill / auto-route / forced-activation control arms) and a gold-integrity gate, explaining *how* a portable skill changes executor behavior and its substitution value across executors. Model benchmarks have no package-relative equivalent.

**Top recommendations (ranked):**
- **[high/M]** A **causal-path verifier** recording discovery → invocation → key-point coverage/order → intermediate milestones — explains *how* a skill changes behavior, not just task completion.
- **[high/M]** A versioned **Skill Contribution Certificate** (bundle + evaluator hashes, paired lift confidence intervals, substitution value across executors).
- **[high/M]** Split Mode A / Mode B contracts: Mode A emits only ROUTER-CONTRACT results; Mode B emits SKILL-LIFT verdicts — a release certificate for a portable artifact.
- **[high/M]** A pre-dispatch **gold-integrity gate** (`goldPolicy = scored | negative | structural-only | pending`); block a positive score on empty/unvalidated gold. — _directly closes the packet-056 empty-gold failure._
- **[high/M]** `skill-effect-certificate.v1` backed by randomized no-skill / auto-route / forced-activation arms — the causal assurance layer for portable behavioral dependencies.

**Key repos:** `benchflow-ai/skillsbench` (skill availability as an intervention; paired lift separate from invocation) · `langchain-ai/skills-benchmarks` (decouple tasks from skill treatments; distractor libraries) · `GeniusHTX/SWE-Skills-Bench` (bind every gold criterion to an executable check) · `cxcscmu/SkillLearnBench` (layered mediation: defective content vs executor non-adoption).

**Sharpest tension:** a broad curated-skill eval reports **+16.6pp** lift, but requirement-driven SWE evaluation reports only **+1.2pp** with most skills unused — aggregate lift dramatically overstates real per-task value.

---

## 12. Cross-Mode Synthesis — the common spine

The 111 recommendations are **not** 111 unrelated tweaks. Read across the eight modes, the same five primitives recur — the modes differ only in *what* they seal and certify:

1. **Append-only typed event ledger** — ClaimRecord (research), proof-carrying findings (review), stance-transition ledger (council), TrialScore ledger (improvement), conformance ledger (alignment), trial ledger (model/skill benchmark).
2. **A sealed/frozen reference artifact** — EvaluatorCapsule, AuthorityCapsule, sealed canaries, independence_batch seals. *Commit the ruler before the move.*
3. **Versioned replay fingerprints** — so a result is reproducible and one entity (a claim, a defect, a candidate) is trackable across passes/revisions.
4. **Receipts / certificates** — EvidenceReceipt, Skill Contribution Certificate, selection certificate, counterfactual convergence certificate. *Portable, independently checkable proof.*
5. **Blinded / counterfactual adjudication** — anonymize provenance, judge both orders, verify the verdict survives merit-irrelevant changes.

**Implication for system-deep-loop:** these primitives belong in the **shared runtime** (they echo run-1's "one architecture" finding), but each mode must define its own *typed schema* over them. The highest-leverage program is therefore: build the runtime event/receipt/seal substrate once, then give each mode its ledger schema and its sealed artifact. That is what makes every mode simultaneously more effective (auditable, resumable) and more uniquely valuable (it owns evidence a one-shot tool cannot).

---

## 13. Eliminated / Not-Pursued Alternatives (honesty)

- **"Just add more council seats / providers / debate rounds."** Refuted repeatedly (Self-MoA, MAD-identity-bias, algorithmic-groupthink). Diversity must be *measured and demonstrated*, not assumed from headcount.
- **"A frozen evaluator makes improvement un-gameable."** Refuted by a 2026 reference-free-judge preprint. Kept only with secrecy-as-information-flow + hidden anchors + regression envelopes.
- **"Aggregate scores are enough"** (a single 5-dim model rank; a single skill-lift number). Refuted by Prompt-to-Leaderboard and the +16.6pp-vs-+1.2pp skill-lift gap. Replaced by task-conditional / paired-causal designs.
- **"Always read the live authority."** Rejected for reproducibility: without an immutable authority digest the audit isn't replayable.
- **General-purpose data/workflow engines** (durable-execution, stream processors) appeared as *mechanism donors* but are not mode-level answers; they inform the shared runtime, not a mode's moat. Held here as context, per the run-1 finding.
- **`ai-system-improvement`** — deliberately excluded from this run per operator direction; not evaluated.

---

<!-- ANCHOR:sources -->
## 14. Sources & Provenance

All findings derive from 40 live `codex --search exec` iterations (SOL, xhigh, fast) recorded in `research/iterations-modes/iteration-001.md` … `iteration-040.md`; the deduplicated catalogue is `research/findings-registry-modes.json` and the ranked reduction is `scratch/synthesis-digest-modes.md`. Representative primary sources (model-supplied, existence URL-checked, not each independently audited — spot-audit before load-bearing design):

- deep-research: `https://github.com/assafelovic/gpt-researcher`, `https://github.com/GAIR-NLP/DeepResearcher`, `https://github.com/asreview/asreview`, `https://www.w3.org/TR/prov-o/`
- deep-review: `https://github.com/semgrep/semgrep`, `https://github.com/qodo-ai/pr-agent`, `https://github.com/SWE-bench/SWE-smith`
- deep-ai-council: `https://github.com/tmlr-group/ECON`, `https://arxiv.org/abs/2409.13687` (Self-MoA), `https://github.com/algorithmicsuperintelligence/optillm`
- deep-improvement: `https://github.com/gepa-ai/gepa`, `https://github.com/algorithmicsuperintelligence/openevolve`, `https://github.com/ShengranHu/ADAS`
- deep-alignment: `https://github.com/open-policy-agent/opa`, `https://github.com/kyverno/kyverno`, `https://github.com/microsoft/typespec`
- agent-improvement: `https://github.com/IBM/prompt-declaration-language`, `https://github.com/EvoAgentX/EvoAgentX`
- model-benchmark: `https://github.com/lmarena/p2l`, `https://github.com/IBM/eval-assist`
- skill-benchmark: `https://github.com/benchflow-ai/skillsbench`, `https://github.com/langchain-ai/skills-benchmarks`

Verification: sampled URLs across modes resolved HTTP 200 and none appeared in the 001 or 005-run-1 registries (dedup enforced in `mergeFindings`). Stars/recency are model-reported. See `iteration-005.md`, `iteration-015.md`, `iteration-040.md` for the per-mode A5 synthesis passes.
<!-- /ANCHOR:sources -->
