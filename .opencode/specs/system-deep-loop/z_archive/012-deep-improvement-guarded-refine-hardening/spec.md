# Feature Specification: Guarded Refine-Loop Hardening from Copywriter Pilot Teachings

**Spec ID:** 143 | **Area:** skilled-agent-orchestration | **Level:** 3 (multi-phase) | **Status:** Draft
**Created:** 2026-06-09 | **Source sessions:** Copywriter auto-refine pilot (Barter repo branch `optimize/copywriter-output-speed`, Public commit `6e9f6a0e11`)

---

## 1. CONTEXT

The Copywriter pilot built and live-validated a **guarded autonomous benchmark-and-refine loop**: benchmark a multi-packaging AI system (CLI runtime / claude.ai Project / native skill), re-grade outputs with an independent different-family grader, propose bounded technique-doc edits, and promote only inside an isolated git worktree when held-out grades do not regress. It was folded into the shared `deep-improvement` skill as **Lane D** (`packaging-benchmark-refine`), with the loop host living packaging-side (`<packaging-root>/_loop/loop.py` contract).

The pilot was preceded by a 4-seat AI council that predicted the central failure mode, and live testing then **proved it empirically**: the system's self-reported quality score (MEQT) was inflated ~+6 of 25 versus independent graders and did not discriminate quality. Every guardrail the council demanded earned its keep during testing, and several new failure modes were discovered that nobody predicted.

This spec turns those teachings into a hardening + generalization program across `deep-improvement` (all lanes), its commands (`/deep:start-*-loop`), the `deep-improvement` agent surface, and the shared dispatch infrastructure.

### Pilot artifacts (evidence base)
- `Barter/Copywriter/_gates/` — frozen scoring surface (`gates.py`) + executable derivation (`derive.py`)
- `Barter/Copywriter/benchmark/` — 4-variant harness, `<DELIVERABLE>` output contract, blind re-grader (`grader/regrade.py`), HVR code linter
- `Barter/Copywriter/_loop/loop.py` — the 7-phase guarded loop host (journal: `_loop/state/loop-journal.jsonl`)
- `deep-improvement/scripts/packaging-benchmark-refine/run-packaging-refine.cjs` + `references/packaging-benchmark-refine/operator_guide.md` — the Lane D fold
- Memory: `copywriter-autorefine-loop.md` (Barter project memory)

---

## 2. TEACHINGS LEDGER (what the testing proved)

Each teaching is numbered; phases below reference them as T1..T12.

| # | Teaching | Evidence | Adopted in |
|---|---|---|---|
| T1 | **Self-reported scores are not a safe optimization target.** Self-MEQT inflated ~+6/25 and rubber-stamped ~23-24 regardless of quality; two independent families (MiMo grader + Claude read) landed ~17-18 and ranked correctly. | Phantom-gap run: self 23-24 vs independent 16-19 on 4/4 deliverables | 003 |
| T2 | **The optimizer must never write its own ruler.** A frozen, content-hashed scoring surface with halt-on-drift caught a real out-of-band edit to the scoring region within hours of being built. | `gates.py check` HALT on the EUR→€ System Prompt edit | 001, 003 |
| T3 | **Grader and proposer must be different model families.** Same-family grading is the inflation mechanism in T1; a code-level kill-switch must refuse it. | `regrade.py` kill-switch (refuses deepseek grader for deepseek proposer) | 003 |
| T4 | **Single benchmark runs are stochastic; target off N-sample averages.** One fixture swung independent 16 → 19.7 → 22 across runs. Single-sample targeting proposes/declines on noise. | Three runs of project/T1; N=3 averaging then caught an E-floor miss no single run showed | 001, 003 |
| T5 | **Graded output must be contract-delimited.** Without an explicit deliverable wrapper, graders/linters score the model's reasoning, rule-quoting, and self-assessment — almost all early lint hits were false positives from reasoning text. | First HVR lint pass: em-dashes from DEPTH headers, quoted "influencers" | 003, 004 |
| T6 | **Held-out fixtures must produce gradeable deliverables.** An interactive fixture (answers with a clarifying question) yields nothing to grade; naive code turned that measurement gap into a false kill-switch. | T6-ambiguous: n=0 grades → false "HVR lint failed" halt | 001, 004 |
| T7 | **Measurement gaps are not failures.** n=0 must be distinguished from a real gate breach (reject/skip, never halt-with-blame). | Same incident as T6; fixed via None/n semantics in `measure()` | 001 |
| T8 | **Always clean up isolation state in `finally`.** A kill-switch mid-promotion leaked a worktree until cleanup moved into a finally block. | Leaked `copywriter-loop-0` worktree | 001 |
| T9 | **Loops must survive session teardown.** A live run was killed mid-iteration by a remote-control reconnect; the loop has no lock/resume, so the run was simply lost (journal left an orphaned partial session). | Killed run at 19:51; relaunch required | 001 |
| T10 | **Decline-when-clean is correct behavior.** Two live runs correctly refused to edit because averaged floors passed. An improvement loop that always generates candidates churns docs on noise. | Both live runs: STOP noTarget at indep 22 / 21 | 003 |
| T11 | **Verify provider auth before batch dispatch.** A configured-but-expired credential (MiniMax) silently burned a 4-dispatch grading batch returning auth errors parsed as "no-json". | MiniMax cross-check batch: 4/4 `invalid api key` | 004 |
| T12 | **Promotion-accept has never live-fired.** Both live runs declined (clean averages), so the accept path is only mock-validated. A controlled synthetic-deficit run is needed to prove it. | Live runs 1-2; accept/reject logic validated dispatch-free only | 001, 005 |

Cross-cutting design teachings: keep loop logic **with the system under test** (contract, not framework — the Lane D fold stayed a ~90-line adapter); scope commits with pathspecs in shared repos (a pre-staged-file bundling incident); hardcoded absolute paths block portability (loop.py still carries them).

---

## 3. GOALS

1. **Harden Lane D** to production grade: resumable, session-kill-safe, portable, with the promotion-accept path proven live (T2, T4, T6-T9, T12).
2. **Give Lane D a first-class surface**: a `/deep:start-packaging-refine-loop` command, advisor routing, playbook + catalog entries — parity with lanes A/B/C.
3. **Back-port the anti-Goodhart teachings to lanes A/B/C** so the whole skill benefits, not just packagings (T1, T3, T4, T5, T10 — and T2 for Lane A targets that contain their own rubrics).
4. **Codify fixture + grader infrastructure** (gradeable-fixture lint, held-out conventions, grader calibration, auth pre-flight) (T5, T6, T11).
5. **Prove generalization** by re-running on Copywriter to a live accept and piloting a second packaging (T12).

## 4. NON-GOALS

- Rewriting the packaging-side loop in Node (the bash/python seam is deliberate; the harness encodes dispatch discipline).
- Fully autonomous promotion to live trees (accepted candidates stay on worktree branches for deliberate operator merge).
- Fixing the Copywriter's own self-MEQT leniency (a Copywriter product defect; tracked in the ai-systems spec area, informed by T1).

## 5. PHASES

| Phase | Title | Teachings | Depends on |
|---|---|---|---|
| 001 | Lane D loop hardening | T2 T4 T6 T7 T8 T9 T12 | — |
| 002 | Lane D command + agent surface | parity | 001 |
| 003 | Anti-Goodhart cross-lane adoption | T1 T2 T3 T4 T5 T10 | — |
| 004 | Fixture + grader infrastructure | T5 T6 T11 | 003 |
| 005 | Validation + second-packaging rollout | T12, all | 001-004 |

## 6. INVARIANTS (carry into every phase)

1. Frozen scoring surface: the thing being optimized and the thing defining "better" are never writable by the same loop.
2. Independent different-family grader; deterministic code linters for hard rules; self-scores never gate promotion.
3. Held-out, N-sample-averaged evidence for promotion; decline-when-clean.
4. Worktree isolation with guaranteed cleanup; dirty-tree refusal; operator merges accepted candidates deliberately.