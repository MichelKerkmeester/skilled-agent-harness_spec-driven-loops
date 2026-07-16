---
title: "027/006 — peck-source deep mining: net-new mechanisms beyond T1-T4 + T1 re-evaluation"
parts: [peck-source-001-013]
iterations: "001-013 (13)"
executor: "cli-opencode openai/gpt-5.5-fast --variant high (read-only); orchestrator-written artifacts"
session: "2026-06-06-027-peck-source-deep-mining"
status: "converged + cross-model-verified (MiniMax M3); canonical synthesis for the peck-source mining pass — feeds sub-packet-proposal.md"
merged_at: "2026-06-06"
cross_model_verify: "iterations 014-018 (minimax-coding-plan/MiniMax-M3) — all headline findings hold; T1 design sharpened; proposal endorsed-with-one-must-fix"
---

# 027/006 — peck-source deep mining

**Goal.** The 2026-06-02 analysis (`001-peck-teachings-adoption/001-peck-teachings-for-spec-kit/peck-teachings-analysis.md`) mined peck's **README** and produced teachings T1-T4 (T2/T3/T4 adopted as children `001/{002,003,004}`; **T1 deferred**). This pass mines peck-master's **actual source** — agent prompts, CLI commands, the `reflect` skill, and the untouched `revim-*` benchmark harness — for **net-new** adoptable mechanisms, and re-evaluates the deferred **T1**. Per-mechanism verdict in {ADOPT, ADAPT, DEFER, SKIP}.

---

## 1. Executive Summary

**Peck's source is a fresh, productive well — distinct from the "XCE exhausted" verdict of phase 005 (that was the XCE/memory axis; this is the peck-source × spec-kit-verification axis).** Thirteen read-only gpt-5.5-fast analyses (mean newInfoRatio 0.625; batch means 0.64 / 0.65 / 0.60 / 0.59) surfaced **six adoptable net-new mechanisms (T5-T10), three secondary ones (T11-T13), one T4-residue thread (T14), a now-adoptable T1, and three re-confirmed anti-teachings.**

Three headline results:

1. **A coherent "peck verification discipline" bundle exists** that the README pass missed entirely: escalation gates (001), completion-verdict freshness binding (002), anti-verdict-softening (005), and reviewer read-budget discipline (004). These touch sk-code / CLAUDE.md / deep-review / the completion gate — **orthogonal to the 027 memory phases 002-008** (iter 013). The single highest-value item is **T6 completion-verdict freshness**: spec-kit's `session_dedup.fingerprint` exists but is **never recomputed against content**, and completion isn't bound to HEAD or a clean tree (iter 002).

2. **The deferred T1 is now adoptable — as its own staged, reuse-heavy sibling packet** (iter 008). Post-026, the validation/checklist/deep-review substrate exists; T1 becomes AC-traceability-table + `AC_COVERAGE` rule (floor 0.9, WARNING→ERROR) + deep-review verdict binding + per-level opt-in, reusing existing AC syntax / evidence infra / reviewer primitive. It needs **one prerequisite the README pass didn't flag**: AC-assertion-format normalization, because 002/T3 never standardized AC shape (iter 011).

3. **peck's untouched `revim-*` benchmark harness is the run's highest-novelty finding (0.85, iter 006):** a reviewer-prompt *regression* harness over real repo fixtures with **expected verdicts** (`CHECKOUT/INPUT/EXPECTED` → `Pass|Fail|Block` oracle). spec-kit's Lane B/C benchmarks don't cover "does this reviewer prompt still catch this known bug class" — and that is exactly the validation substrate every new verification rule above (and the T1 gate) needs to be safe to ship.

**Critical coordination finding (iter 010/011/012):** the "adopted" peck teachings **002/003/004 are spec'd but NOT yet implemented** (their own implementation-summaries say pending). So the T4-residue (T14) and reflection-residue (T12) findings should **extend those pending children**, not spawn duplicate packets.

---

## 2. Net-New Teaching Verdict Matrix (the core deliverable)

Labels continue peck's T1-T4 numbering. "Gap" = is there a real gap in live spec-kit?

| # | Net-new teaching | Verdict | Gap in spec-kit | Effort | Risk | Evidence (iter) |
|---|---|---|---|---|---|---|
| **T5** | Implementer escalation / anti-thrash gates (3-strike; one-sentence-root-cause; conflict→story-amendment; reviewers-contradict) | **ADOPT** (root-cause + amendment) / ADAPT (rest) | partial — sk-code has same-symptom + @debug 3-hypotheses, not these gates | S | low-med | 001 |
| **T6** | Completion-verdict **freshness binding** (code change invalidates green; bind to content fingerprint + clean tree) | **ADOPT** | real — `session_dedup.fingerprint` never recomputed; completion not HEAD/tree-bound | M | med | 002 |
| **T7** | Anti-verdict-**softening** ("do not relabel a Fail as conditional/partial"); anti-truncation for final reports | **ADOPT** (softening) / ADAPT (truncation) | real — general honesty exists, this sharpness doesn't | S | low | 005 |
| **T8** | Reviewer **token-budget read discipline** (justify each read; never re-read a full-content/new file) | **ADOPT** @review / ADAPT deep loops | real for @review; numeric TCB exists but not per-read justification | S | low-med | 004 |
| **T9** | **Numeric severity calibration** aid (±2 context adjustment + optional non-gating `riskScore`) | **ADAPT** (docs/schema) / **SKIP** literal `≥4 blocks` | partial — spec-kit has weighted convergence, not per-finding calibration | S/M | med | 003 |
| **T10** | **Reviewer-prompt benchmark substrate** (real-fixture + expected-verdict oracle) | **ADAPT** into deep-improvement Lane B | real — Lane B/C lack the known-bug-class reviewer shape | M | med | 006 (0.85) |
| **T11** | Benchmark-gated **cheap-model review preset** | **ADAPT** opt-in / **DEFER** blanket default | partial — routing plumbing exists, the policy doesn't; deep-review defaults to Opus | S/M | high (blanket) | 009 |
| **T12** | Reflection **bounded-cap + recurrence→promotion** (extends pending 004) | **ADAPT** (cap + recurrence) / **DEFER** prune-lifecycle | real — 004 shipped only a read-only staleness surface | S→M | low→high | 010 |
| **T13** | Phase-aware **resume FILES manifest** (one-shot packet file enumeration) | **ADAPT** (optional) | partial — resource-map/graph-metadata exist, no one-shot JSON FILES list | M | low | 007 |
| **T14** | T4 **current-state generalization** + curated `product.md`-style "system now" surface (extends pending 003) | **ADAPT** (impl-summary + narrative) / **DEFER** non-parent spec.md | partial — discipline still phase-parent-scoped; 003 pending | M | med | 012 |
| **T1** | Acceptance-criteria coverage gate (per-AC ≥90% test mapping) — **revisited** | **ADOPT-AS-PACKET** (own staged sibling) | real — single self-attested checkbox; now reuse-heavy post-026 | M/L | med | 008, 011 |

### Anti-teachings — re-confirmed SKIP (do NOT adopt)
- **Empty-commit verdict ledger** as the audit trail (`review.ts:72-96`) — spec-kit audit is richer + not git-coupled (iter 007; re-confirms the 2026-06-02 rejection).
- **Branch-per-story checkout on load** (`story.ts:95-100`) — spec-kit resume is packet-path/memory based, not branch-mutating (iter 007).
- **Literal `score ≥4 blocks`** (`code-reviewer.md:68`) — would over-block P2-advisory maintainability cleanup (iter 003).
- **Blanket cheap-model release gate** — broad/security surfaces risk false PASS; only opt-in/benchmark-gated (iter 009).
- **Automatic constitutional deletion** — 004 requires human-in-loop retirement; not low-risk (iter 010).

---

## 3. Consolidated deliverable structure

**Sub-packet A — peck verification discipline (NEW 027 child):** T5 escalation + T6 freshness + T7 anti-softening + T8 read-budget + T9 numeric-calibration-as-docs. All agent-prompt / completion-gate / CLAUDE.md / deep-review changes; CLEAR vs 002-008 + Phase-0 (iter 013). T6 is the anchor.

**Sub-packet B — reviewer-prompt benchmark substrate (NEW deep-improvement Lane B work, owned as a 027 child for tracking):** T10. The test substrate that makes A and the T1 gate regression-safe; also gates T11's cheap-model preset.

**Sibling packet C — T1 acceptance-coverage gate (NEW 027 child):** T1 + its T-prereq AC-format normalization (011). Staged WARNING→ERROR, deep-review-bound, per-level opt-in, benchmarked via B.

**Coordination with PENDING 001 children (not new packets):**
- T12 (reflection cap + recurrence) → extend pending **004-constitutional-rule-review**.
- T14 (current-state generalization + product.md narrative) → extend pending **003-current-state-discipline** (its own wave-2 deferral); the AC-format prereq (011) coordinates with pending **002-self-check-templates**.
- Implication: **sequence A/B/C after, or in coordination with, the 001 children landing**, to avoid editing the same templates twice.

**Optional / secondary:** T13 resume FILES manifest (modest /speckit:resume enhancement) · T11 cheap-model preset (opt-in, gated by B) · T12(c) constitutional prune/demote lifecycle (DEFER, own future review).

---

## 4. Numbering & non-conflict (iter 013)

- New top-level children number from **009** (000-008 occupied; `000-release-cleanup` is a placeholder to avoid; do NOT fill the internal `008/002` coco gap).
- **T1 is unowned** — both 027 parent and 001 explicitly exclude it and call for a separate packet.
- New packets sequence **independent of the 005 memory re-plan** (which gates 002-008 via Phase-0 + `002‖003→008→004→005→006→007`).

---

## 5. Cross-model verification (MiniMax M3 — iterations 014-018)

A second model (`minimax-coding-plan/MiniMax-M3`, TIDD-EC prompts, read-only) independently re-examined the three highest-stakes findings, swept for misses, and reviewed the proposal — each prompt instructed to *try to refute first*. **All headline findings hold; T1's design was sharpened; the proposal was endorsed with one must-fix.** Batch mean newInfoRatio 0.34 (low = confirmation, as expected for a verify pass; zero refutations).

| Verify target | M3 verdict | Detail |
|---|---|---|
| **T6 freshness** (002) | **CONFIRMED (AGREE)** | All 3 sub-claims independently verified. M3 added: `normalizeForFingerprint`/`buildContinuityFingerprint` already exist (`memory-save.ts:1006-1014`) → ADOPT is recompute-at-validation, NOT new infra; `validate.sh` has zero HEAD/tree hooks; a `clock_drift` PASS path (`continuity-freshness.ts:251-265`) weakens it further. *(014)* |
| **T1 adoptability** (008/011) | **MIXED — core CONFIRMED, C2 PARTIAL** | reuse-heavy for COUNTING but **harder for CLASSIFYING** — Tested/Partial/Not-covered needs assertion-shaped AC text that doesn't exist today. AC-format prereq CONFIRMED real. *(015)* |
| **T10 benchmark** (006) | **CONFIRMED (AGREE)** | The 0.85 novelty holds — Lane B = code-task oracles, Lane C = routing gold, neither does reviewer-prompt-vs-expected-verdict. M3 supplied an implementation sketch (`reviewer-*.json` fixture + scorer branch reusing `dispatch-model.cjs` + 5dim envelope). *(016)* |
| **Completeness** (sweep) | **No material miss** | After init.ts/config.ts/planner.md/story.md/tests/build-configs/run.sh: zero net-new; remaining surface is anti-teaching or surface-mismatch. Matrix complete. *(017)* |
| **Proposal** (009/010/011) | **ENDORSE-WITH-CHANGES** | D1-D5 endorsed (split, numbering, 010-first, fold T14/T12 into pending 003/004, T1 own packet). One must-fix (D6): make the pending-001/002 (T3 templates) coordination explicit in sequencing. *(018)* |

**Design refinements folded into the proposal (from 015 + 018):**
1. **T1 needs AC-format normalization as a hard prereq** (not optional) — classification is impossible on placeholder AC text.
2. **Canonical per-level AC location** — L3 has both a requirement table (placeholder) and Given/When/Then story ACs; `AC_COVERAGE` must count ONE to avoid double-count/miss.
3. **Lifecycle opt-in, not just level** — enforce only when `implementation-summary.md` is in-progress+, so a freshly scaffolded L2 spec doesn't ERROR with zero tests.
4. **011 phases 001-002 share manifest templates with pending 001/002** — sequence 001/002 first or coordinate the edit window (proposal §7 updated).

---

## 6. Convergence Report
- **Stop reason:** converged — coverage complete (all 10 planned + 3 reserve foci done), teaching space mapped, non-conflict + numbering confirmed, newInfoRatio trend declining; then cross-model-verified.
- **Iterations:** 18 total — 13 discovery (001-013, gpt-5.5-fast --variant high) + 5 cross-model verify (014-018, MiniMax-M3), across 5 parallel background batches; orchestrator wrote all artifacts.
- **newInfoRatio trend:** 0.68, 0.72, 0.45, 0.72, 0.55, **0.85**, 0.62, 0.58, 0.48, 0.72, 0.72, 0.62, 0.42 (mean 0.625; batch means 0.64 / 0.65 / 0.60 / 0.59).
- **Method note:** two-model — discovery with gpt-5.5-fast (per "gpt 5.5 high fast agents"), then adversarial cross-verification with MiniMax-M3 (per "5 more iterations with minimax m3"). Every finding carries dual peck `file:line` + live spec-kit `file:line` citations in `iterations/iteration-0NN.md` and raw `prompts/iteration-0NN.out`. Both models showed good adoption-trap judgment (gpt-5.5 rejected literal ≥4 block / blanket cheap-model gate / auto deletion; M3 downgraded T1's classification feasibility rather than rubber-stamping).
- **Negative knowledge:** T2/T3/T4 were NOT re-derived (only their delta-vs-shipped assessed); the 005 XCE/memory-internal exhausted paths were not retread; the MiniMax sweep (017) confirmed no material peck mechanism was missed.

## 7. References
- Per-iteration evidence: `iterations/iteration-001.md` … `iteration-013.md` (+ raw `prompts/iteration-0NN.out`).
- Prior peck analysis (README pass): `../../001-peck-teachings-adoption/001-peck-teachings-for-spec-kit/peck-teachings-analysis.md`.
- Live 027 re-plan: `../005-live-rescope-coco-purge/research.md`.
- Proposal: `sub-packet-proposal.md` (this packet).
