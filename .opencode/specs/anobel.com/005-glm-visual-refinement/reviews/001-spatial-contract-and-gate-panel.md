# Panel Synthesis — Phase 001: spatial-contract-and-gate

> 5-model second-opinion panel over the GPT-5.5-authored plan. Advisory only — no spec edits, no implementation.
> Source reviews: `reviews/001-spatial-contract-and-gate/review-{glm,mimo,deepseek,kimi,minimax}.md`

## Panel table

| Model | Verdict | Confidence | Top gap | Top improvement |
|-------|---------|-----------|---------|-----------------|
| GLM-5.2 | AGREE-WITH-CHANGES | 0.72 | Card geometry self-contradictory (560×480 spec vs 480×480 A1 research); Y thresholds untrustworthy if harness renders 480-tall | Insert a 5-tile probe before the 45-tile pilot: hand-inject `SAFE_LINEAR_560`, measure T1 lift first (≥10pts → load-bearing; <5pts → cut contract tokens) |
| MiMo-v2.5-Pro | AGREE-WITH-CHANGES | 0.72 | SHIP prediction over-optimistic by ~5-10pp; capping rows truncates info, won't narrow the 41pt gap to 15-22 (realistic 30-34/45 = 67-76%) | Add a Phase 0 gate-validation on the existing 45 baseline tiles (2h, zero GLM cost): report precision/recall vs known RC-1..5 failures before the experiment |
| DeepSeek-v4-Pro | **DISAGREE** | 0.85 | FATAL dimensional contradiction (480×480 contract values vs 560×480 harness); plus repair pass asks GLM to fix spatial reasoning it lacks | Replace the GLM repair pass with a ~50-line deterministic CSS fixup (clamp/shrink-to-fit overflow, z-index title, regex-strip `uppercase`, regex-swap banned grays) — 80% of intent, zero tokens |
| Kimi-k2.7 | AGREE-WITH-CHANGES | 0.62 | Coordinate desync (research pad 24 / title-y 352 vs spec pad 30 / title-y 356) + repair-success-rate is an unmeasured load-bearing assumption (SC-001 is arithmetic over it) | Split into 001a "Characterize" (~25-30 gens: gate-on-baseline + T1-honoring probe + derive the failure-JSON schema from real emit) then 001b "Combine" (T2 + repair) |
| MiniMax-M3 | AGREE-WITH-CHANGES | 0.62 | Same 480-vs-560 contradiction + success criteria are program-level not phase-level (the 41pt gap closes in 002-005, not here); contract doesn't ban the root-cause primitive | Pull primitive-routing forward into the repair pass: on overlap/intrusion/>3 nodes, force rebuild as `linear-flow`/`stacked-ledger`/`mini-table` rather than fixing 2D |

**Mean confidence: 0.71** (1 DISAGREE, 4 AGREE-WITH-CHANGES)

## Consensus (≥3 models agree)

1. **Architecture is correct.** All 5 endorse the core inversion: deterministic DOM/CSS gate as the acceptance authority, GLM's preflight as an untrustworthy hint, failure-only single repair. GLM calls this "Goodhart-resistant" (mimo); deepseek: "the right authority model (gate owns acceptance, model never self-certifies)."
2. **A dimensional mismatch exists between the A1 research (480×480) and this phase (560×480)** — flagged by all 5. (Severity disputed — see Red Flags.)
3. **SHIP target (34-37/45 = 76-82%) is over-optimistic** — 4 of 5 (glm, mimo, deepseek, kimi, minimax all touch it). Capping rows produces *truncated* not *good* tiles; the gap shrinks by reclassification, not skill. Realistic estimates cluster at 30-34/45 ≈ 67-76% (mimo) / 32-36 ≈ 71-80% (deepseek).
4. **The one-shot repair pass is the weakest, unvalidated, load-bearing link** — glm, deepseek, kimi, minimax. SC-001's whole range "lives in an assumption the spec never measures or bounds" (kimi).
5. **Run a cheap falsification probe before the full 135-generation run** — all 5 converge: either gate-on-existing-baseline (mimo, deepseek) or a 5-tile T1-honoring probe (glm, kimi, minimax).
6. **The failure-JSON schema is the load-bearing artifact for phases 002-006 but is deferred** to plan.md/setup (glm, kimi) — should be frozen in spec.md as REQ-006 acceptance.
7. **Bbox checks need a pixel tolerance + font-load determinism** — glm (`await document.fonts.ready`), mimo (±3px), minimax (>4px²), kimi (±2px). Zero-tolerance overlap will false-positive on touching grid/flex items.

## Divergence

- **Severity of the dimensional issue:** deepseek alone escalates to DISAGREE/FATAL ("guaranteed layout breakage on every tile"). The other 4 treat it as a real-but-resolvable gap (document the adaptation, re-derive caps/thresholds).
- **What to do with the repair pass:** deepseek wants it *replaced* by deterministic CSS fixup; minimax wants it *upgraded* with forced primitive-downgrade; kimi wants a repair-success-rate gate (skip T2 if pilot rate <50%); glm/mimo want it *probed* first.
- **Where the lift comes from:** glm argues T1 (contract-only) may be ~0 and the contract is "decorative under instruction load" → cut it; mimo/minimax assume gate+repair is load-bearing. No model thinks contract alone carries the lift.
- **Token budget:** spec claims ~350-450 tokens (net replacement). deepseek counts ~1100-1200 tokens of new content (net addition past the IFScale cliff); kimi ~600-700 combined. mimo says measure the existing `contract()` token count first and require net delta ≤ 0.

## Adopt-worthy improvements GPT-5.5 missed (ranked, cross-model)

1. **Cheap pre-build falsification probe** (glm, mimo, deepseek, kimi, minimax — unanimous). Best concrete form: run the proposed gate on the *existing 45 baseline tiles* (no GLM calls) and report the confusion matrix vs the named known-bad/known-good tiles; in parallel run T1-only on 5 archetype tiles to measure whether GLM honors the contract in the rendered DOM. ~1-2h, de-risks the 8-15h build.
2. **Freeze the failure-JSON schema in spec.md (not plan.md), derived from what the gate actually emits** (glm, kimi). Phases 002-006 write readers against it.
3. **Define "best-scoring pass" precisely** (mimo): a repair must not introduce new gate failures; if the re-gated repair has new failures, discard it and keep the original; order by fewer failures → higher contrast min → original preferred.
4. **Add a T1 success band** (mimo, glm): e.g., T1 ≥67% validates the prompt contract; T1 <63% means the contract is being dropped and the gate is load-bearing. Currently SC-001 only scores T2.
5. **Deterministic CSS fixup as repair (or fallback)** (deepseek): clamp overflow + iterative font-shrink, z-index/solid-bg the title band, regex-strip `text-transform:uppercase`, regex-swap banned grays on text-bearing nodes only.
6. **Pull primitive-downgrade into the repair prompt** (minimax): hard rule — on bbox overlap / title intrusion / >3 nodes, rebuild as a linear/table primitive instead of re-attempting 2D.
7. **data-a1-role fallback targeting** (mimo): try `data-a1-role` first, fall back to CSS-selector/position heuristics (navy bg + height 304 = visual panel), because GLM may drop the attribute (the original root cause).
8. **Enlarge the gate self-test set with mid-pack tiles (70-80)** (kimi): the 2 known-good tiles are both top-of-leaderboard; false-positive risk is highest in borderline mid-pack geometry.
9. **Disclose cost** (kimi): 3 arms × 45 = 135 generations + up to 18 repairs, not 45. Add a cost/latency NFR.

## Red flags (≥2 models flag a risk, or a DISAGREE)

### The deepseek/001 "480×480 vs 560×480" dimensional bug — VERIFIED, but NOT a self-contradiction in the spec

I read `001-spatial-contract-and-gate/spec.md` and `plan.md` directly. Finding:

- **The spec is internally consistent at 560×480.** REQ-001 specifies `560x480 CSS vars; visual box x=30..530, y=30..328; reserved title band x=30..530, y=356..456`. `x=30..530` = 500px width = 560 − 30 − 30. The gate checks in REQ-006 (`y=356..456`, bottom `>328`) are derived for that same 560 geometry. Nowhere in spec.md or plan.md do the 480-based literals (`--tile-w:480px`, `visualBox [24,24,432,304]`, `y=24..328`, pad 24, title-y 352) actually appear.
- **The spec explicitly resolves the dimension choice.** §3 Out of Scope: *"Changing the tile card size - locked at 560x480 (the existing harness); do not retarget 480x480."* The frontmatter `answered_questions` repeats it; §10 open-question #2 defers a *production* 480 target to later parameterization.
- **So deepseek's "FATAL … guaranteed layout breakage on every tile" overstates it.** The spec does not ship contradictory 480 and 560 values; it picks 560 and forbids 480. A run that follows REQ-001 would not produce 480-positioned tiles in a 560 container.

**But the underlying concern is real and is a confirmed RED FLAG** (all 5 models raised the dimensional theme; kimi and mimo pin the exact deltas):
- The geometry's *provenance* is the 480×480 A1 research, and the spec adapts it to 560 **without showing the re-derivation math**. Kimi: spec pad 30 vs research 24, title-y 356 vs research 352 (a 4px shift) — unexplained. MiMo: visual-panel width jumps 432→500px (+16%) and title-band height 104→100px, so the per-primitive caps may no longer be correct at 500px and the spec "doesn't address this."
- The Complexity Assessment calls the A1 research recs *"copy-pasteable"* — which is exactly the trap: an implementer copying the research contract verbatim into the future `a1Block()` helper would re-introduce the 480 values and desync from the 560-based gate thresholds.

**Net on the bug:** Real as a provenance/re-derivation gap and a copy-paste hazard; **not** an unimplementable internal contradiction. Resolve before coding by (a) restating the 560 geometry as the single source in spec.md, (b) showing the cap/threshold re-derivation at 500px visual width, and (c) explicitly NOT copy-pasting the 480 research block into `a1Block()`.

### Other multi-model red flags

- **Repair pass is unvalidated and load-bearing** (deepseek, kimi, glm, minimax — 4 models). Mitigation missing: a repair-success-rate gate ("if pilot repair rate <50%, escalate to phase 004, do not ship T2" — kimi).
- **SC-001 over-optimistic** (5 models) — see Consensus #3. SC-002's "diagram-vs-linear delta narrows" measures a metric whose *meaning changes* mid-experiment via reclassification (glm).
- **IFScale-cliff risk: contract may be a net token addition, not replacement** (deepseek, kimi, mimo). Testable cheaply at 0/200/400/700 added tokens (kimi); require net delta ≤ 0 (mimo).
- **Scaffold leaks** (glm, minimax): branch `system-speckit/028-memory-search-intelligence` is unrelated; `fingerprint: sha256:0000…` placeholder; arm names switch between `control/a1_prompt/a1_gate_repair` and `C0/T1/T2`. (Confirmed present in the spec frontmatter and metadata table.)

## Net recommendation

**REVISE before building** (strongest-revision phase of the six). The architecture is endorsed 5/5 — keep it. Before any code:
1. Restate the 560×480 geometry as the single source in spec.md and show the cap/threshold re-derivation at 500px width; forbid copy-pasting the 480 research block into `a1Block()`. (Resolves the only DISAGREE.)
2. Run the gate-on-existing-baseline confusion matrix + a 5-tile T1-honoring probe before the 135-gen run; add a repair-success-rate gate.
3. Make SC honest and phase-level (target ~+7-16pp, not +16-22pp); add a T1 success band; state SC-002 measures post-conversion primitive score.
4. Freeze the failure-JSON schema in spec.md; add bbox tolerance + `document.fonts.ready` determinism; fix the scaffold leaks.
