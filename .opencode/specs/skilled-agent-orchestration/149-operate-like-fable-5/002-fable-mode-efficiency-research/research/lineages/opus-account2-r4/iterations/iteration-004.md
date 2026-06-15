# Iteration 4: OPTIMIZE — ranked, tiered surface×delta recommendation set

## Focus
Q4 (OPTIMIZE): consolidate F1–F15 (iter 1) + G1–G9 (iter 2) against the read-reliability matrix (iter 3) into a **ranked, tiered surface×delta recommendation set**, scored `Leverage / (Cost + Blast)`, all NET-NEW vs round 1. Tiers: **A** = doctrine text, **B** = mechanism, **C** = measurement. Identify the efficiency core. This is an analytical/synthesis iteration — no new source evidence.

## Scoring note
`Score ≈ Leverage / (Cost + Blast)`, each 1–5 (an ordering aid, not precision). Every Tier-B/C item inherits the **G4 honesty** (steers efficiency/style/persistence, NOT capability) and the **fable-mode.md:11 blast-radius guardrail** (don't import the cost with the strength). Our framework already owns the matching primitive for that guardrail (CLAUDE.md §1 "Match effort to blast-radius").

## Ranked recommendation set

| # | Recommendation | Surface | Tier | Maps | Lev | Cost | Blast | Score | Dedup vs R1 |
|---|----------------|---------|------|------|-----|------|-------|-------|-------|
| 1 | **Compact fable-5 governor on the live per-turn hook** (one dense paragraph: reason-about-problem-not-yourself, depth-limit-1, commit-with-`// DECISION:`, default-terse, act-don't-narrate, open-with-result) | the live `UserPromptSubmit` reminder (skill-advisor hook payload) | B | G1,G2,G5,F10 | 5 | 1 | 2 | **1.67** | net-new |
| 2 | **Mutation-check / claim-falsifier discipline** (after green, break it to confirm the test bites; hunt vacuous green; a green test that stays green when you break what it guards = the claim is false) | sk-code verification (+ optional rule) | B | F1,F3,F13 | 5 | 2 | 1 | **1.67** | net-new |
| 3 | **Recursion-control rule + xhigh briefs** (reason-about-problem-not-yourself; audit depth-limit-1; the caption test; keep-real-depth guardrail) | new constitutional rule + extended-thinking executor briefs | B | G1,G6,G8 | 5 | 2 | 1 | **1.67** | net-new |
| 4 | **Engineer staleness out of artifacts** (counts→greps, lists→table-walking tests); **first apply to the underscore/hyphen dead pointer** — a grep-test that asserts every AGENTS.md `references/.../*.md` pointer resolves | new rule / fold into comment-hygiene + a pointer-resolution test | B | F6,F4,F13 | 4 | 2 | 2 | **1.00** | partial (sharper than R1) |
| 5 | **Inject governor into agent prompts / renderPromptPack** (the subagent surface the hook is blind to) — routed through agent-mirror-sync.yml | agent prompts + deep-loop prompt-pack | B | G2,G1,G6 | 5 | 3 | 3 | **0.83** | net-new (needs sync) |
| 6 | **One-line doctrine-spine in AGENTS.md §1** (root conviction + register/voice + letter-vs-intent), paired with #1 so it doesn't decay alone | AGENTS.md/CLAUDE.md §1 | A | spine,F8,F9,F10 | 3 | 1 | 2 | **1.00** | net-new (NOT a restate of R1 subsection) |
| 7 | **leak_test-style behavioral metric** (tool:text, words/msg distribution, caveat%, self-opener%) — runtime-aware bucketing | `/doctor` route or a `deep:*-benchmark` dimension | C | G3,G5,F13 | 4 | 4 | 1 | **0.80** | net-new |
| 8 | **Scar-tissue + cold-successor handoff discipline** (carry only non-derivable; blast-site + activation-condition; numbered Read-order; ship next brief) | handover.md + _memory.continuity | A/B | F4,F5 | 3 | 2 | 1 | **1.00** | net-new |
| 9 | **Verification ladder with pre-named blind spots** (unit→in-memory→on-server→live→headless; "in-memory-green is not production-green") | sk-code + deep-review | B | F2 | 3 | 1 | 1 | **1.50** | partial |
| 10 | **Adversarial-review schema + machine-checkable evidence contract** (claim/verdict/evidence triple + completeness critic; wired into post-dispatch-validate) | @orchestrate/@deep-review prompts + post-dispatch-validate | B | F3,F11,F15,F5 | 5 | 5 | 4 | **0.56** | = R1 carried follow-up (dedicated packet) |
| 11 | **Decision-economy + fail-closed-by-construction doctrine** (named seam not TODO; never a dead control; reject not strip; structural-not-disciplinary invariants) | sk-code doctrine (+ optional rule) | A | F7,F8 | 3 | 1 | 1 | **1.50** | net-new |
| 12 | **Fail-loud on model mismatch in executor-audit** (compare requested vs actual model; emit error/blocked_stop, don't silently substitute) | executor-audit.ts / dispatch | B | F7,F13,G4 | 4 | 3 | 3 | hardening | = R1 carried follow-up (codex SIGKILL/silent-gpt-5; dedicated packet) |

## Clusters
- **Land-first / efficiency core (#1–#3):** high-leverage, low-cost, low-blast, squarely on "efficiency." #1 (thermostat governor) + #3 (recursion-control) are the *style/persistence* levers; #2 (mutation-check) is a *verification* lever. Per G4, none of these touch capability — the capability lever stays task-structure (closed prompt packs) + multi-CLI orchestration, which we already pull.
- **Durable / cheap (#4, #6, #8, #9, #11):** mostly Tier-A doctrine + one anti-staleness mechanism; each is a small surgical drop with low blast.
- **High-value-real-cost (#5, #7):** #5 is the only way to govern subagents (the hook is blind to them) but needs mirror-sync; #7 is the measurement layer and needs a multi-runtime port.
- **Dedicated packets (#10, #12):** both are the carried round-1 follow-ups — highest leverage, highest cost, structural (TypeScript runtime + schema work), not surgical drops. They earn their own packets.

## Efficiency framing (why this answers the spec, not just "adopt Fable")
The spec asked for **efficiency**, and G4/G5 are decisive: the governor's measured gains are **median words 47→18 and tool:text 1.41→3.91** — i.e. ~3× less narration per unit of work and a tighter token distribution. That is *exactly* efficiency (token burn, context decay, result-first output), and it is what #1+#3 buy persistently and cheaply. The mutation-check (#2) buys a *different* efficiency: it kills the most expensive failure class (a green-but-vacuous test that ships a lie) at the cheapest point. Everything else is durable doctrine or a measurement to confirm the gains are real (the F13/G3 "a metric that lies is worse than none" loop).

## Sources Consulted
- This lineage's `iterations/iteration-001.md` (F1–F15) and `iteration-002.md` (G1–G9)
- This lineage's `iterations/iteration-003.md` (read-reliability matrix)
- `external/Fable5.md` + `149/001-initial-refinement/changelog.md` (dedup verification per item)

## Assessment
- **newInfoRatio: 0.22** — Synthesis/ranking iteration: consolidates F1–F15 + G1–G9 into 12 ranked surface×delta recs. New content is surface-fit, scoring, tier assignment, dedup verdicts, and the efficiency framing (analytical output, not new source evidence). Descending trend continues.
- **Novelty justification:** the ranking, the cluster structure, the efficiency-framing argument (G4/G5 → "efficiency is what the governor actually buys"), and the surface×delta fit are net-new analytical product; the underlying findings are not.
- **Confidence:** HIGH on the top cluster and the dedup; MEDIUM on the coarse numeric scores (deliberately coarse — an ordering aid).

## Reflection
- **What worked:** Scoring against the read-reliability matrix (iter 3) rather than abstractly — it forced #1 to the top (highest-read-reliability, decay-proof surface) and pushed #10/#12 to dedicated packets (high blast).
- **What failed:** Nothing material.
- **Ruled out:** Adopting F14 (ration live actions / cleanup-as-privacy) as a rec — low relevance, no shared production box, partially covered by name-the-rollback. A standalone F12 rec — already covered by round-1's finding-is-a-hypothesis + Fable5.md reproduce-before-cause; folded as reinforcement. G7/G8 as standalone recs — folded into #3's governor as guardrails.

## Recommended Next Focus
Q5 (FOLLOW-UPS + GAPS): re-assess the two carried round-1 follow-ups (machine-checkable evidence contract; codex SIGKILL/silent-gpt-5 fail-loud) against the live runtime; document this lineage's gaps and the merge questions for reconciliation with the sibling lineages.
