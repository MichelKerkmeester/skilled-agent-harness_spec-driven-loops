---
title: "Implementation Summary: GPT Behavioral Hardening — Follow-Up Research"
description: "Two-round, six-lineage deep-research investigation completed; round 2 (operator-directed critical re-review) caught and corrected a real error made by round 2's own first lineage; final consolidated research.md written with a recommended phase 008-012 breakdown."
trigger_phrases:
  - "implementation summary"
  - "gpt behavioral hardening"
importance_tier: "critical"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/031-deep-loop-gpt-reliability/001-research-and-diagnosis/001-gpt-behavioral-hardening-research"
    last_updated_at: "2026-07-01T11:35:00Z"
    last_updated_by: "claude-code"
    recent_action: "Two-round research complete (6 lineages); final consolidated research.md written"
    next_safe_action: "Plan phase 008 per research.md §4"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-007-init"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Confirm a genuine OPENCODE_PID-free external shell exists before starting phase 011."
      - "glm-critical's reproducible stall (GLM quota exhaustion) is worth a deep-research runtime follow-up, independent of this packet."
    answered_questions:
      - "All KQs answered across 6 lineages with file:line evidence; consolidated in research/research.md."
      - "Is the ai-council route-proof validator a guaranteed FAIL? No -- round 2 self-corrected: it passes on non-canonical values that disagree with the registry."
---
# Implementation Summary: GPT Behavioral Hardening — Follow-Up Research

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete (research, both rounds) |
| **Completion** | 100% |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A two-round, six-lineage deep-research investigation using `fanout-run.cjs`:

**Round 1 (exploratory, 30 iterations each):** `glm-max` (GLM-5.2, max reasoning) and `gpt-fast-high` (GPT-5.5-fast, high reasoning), both 30/30, all 9 KQs answered.

**Round 2 (operator-directed critical re-review, 10 iterations each, `research-prompt.md` §9):** commissioned after the operator (a) directly confirmed all four reported symptoms as real, first-hand experience and (b) flagged that `gpt-fast-high` researching GPT's own failures was a structural conflict of interest. Ran `sonnet-critical` (Claude Sonnet 5, 10/10), `glm-critical` (GLM-5.2, stalled — see Known Limitations), `opus-critical` (Claude Opus 4.8, 10/10), and `gpt-critical` (GPT-5.5-fast self-critiquing, 10/10).

All 6 lineages were merged (`fanout-merge.cjs`, `merged_lineages: 6`) into a final consolidated `research/research.md` that documents cross-lineage agreement, a corrected finding (see How It Was Delivered), and a reconciled phase 008-012 breakdown.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

**Round 1:**
1. Smoke-tested GLM-5.2's `--variant`/reasoning-effort forwarding directly via `opencode run` before committing to the full run — confirmed `max` produces meaningfully more reasoning tokens than `high` (126 vs 67 tokens) once the correct enum values were used (an initial test using an invalid `low` value gave a false negative).
2. Extended `deep-loop-runtime`'s `reasoningEffort` schema (`executor-config.ts`) to add `"max"` — it previously capped at `"xhigh"`, which GLM-5.2 doesn't recognize (GLM's own native enum is `["high","max"]` only). Updated `deep_research_presentation.txt`/`deep_review_presentation.txt` docs to match. Verified via `npx vitest run` (2 pre-existing flaky timing tests confirmed unrelated by isolated re-run).
3. Launched via `fanout-run.cjs` directly (the real script the `/deep:research` command's own workflow YAML invokes for CLI-executor fan-out, since that command is itself a markdown contract meant to be interpreted step-by-step, not a black-box entrypoint).
4. **First launch attempt was misconfigured and was killed and restarted.** Post-init file-patching of `antiConvergence.minIterations: 30` was overwritten back down to `7` by the GLM lineage's own agent, which read the dispatch prompt's ambiguous default wording ("run to legal convergence OR maxIterations, whichever comes first") and decided the dispatcher instruction should prevail. Root-caused and fixed properly: `fanout-run.cjs` supports `--stop-policy=max-iterations`, which changes the actual dispatch prompt to remove the ambiguity ("treat convergence before that as telemetry only"). Killed the mis-configured run, wiped the disposable partial state, relaunched correctly.
5. First merge attempt only captured 1 of 2 lineages (`skipped_no_registry: 1`) because glm-max wrote `findings-registry.json` while the merge script expects `deep-research-findings-registry.json` — copied to the expected name and re-ran.
6. Hand-wrote the round-1 consolidated `research/research.md` since `fanout-merge.cjs` only merges structured findings registries, not lineage prose.

**Round 2 (critical re-review):**
7. Amended `research-prompt.md` with a new §9 charter section: operator-confirmed symptoms treated as ground truth (not re-litigated), explicit instruction to critique round 1's conclusions (especially `gpt-fast-high`'s, given the conflict-of-interest concern), focus on concrete fixes over more diagnostic scaffolding.
8. Launched `sonnet-critical` + `glm-critical` together. `sonnet-critical` completed cleanly with genuinely rigorous findings (including a full self-adversarial pass on its own conclusions). `glm-critical` completed 1 strong iteration then stalled on iteration 2 — confirmed via CPU-time sampling (near-zero CPU consumption over multi-minute windows, not a genuine slow-reasoning case) as a hang, not a think. Killed and retried twice (3 total attempts, ~29-50 min each), all failing at the same point; the whole background task was also externally terminated once mid-cycle for unrelated reasons and was relaunched. Operator then identified the actual root cause: GLM usage/quota was at zero — an API-side failure that manifests as a silent hang, not a clean error, because the deep-research runtime doesn't detect or surface quota exhaustion distinctly from genuine long-running reasoning.
9. Per operator instruction, abandoned GLM after the 3rd confirmed stall (not a 4th retry) and replaced it with two new lineages: `opus-critical` (Claude Opus 4.8) and `gpt-critical` (GPT-5.5-fast, told explicitly to critique its own predecessor). Both completed cleanly, 10/10 each.
10. **A genuine correction surfaced inside round 2 itself.** `sonnet-critical`'s single most assertive claim — that the ai-council route-proof validator is a "code-traced, guaranteed FAIL" — was itself wrong: it traced the validator and the YAML config but never opened the file that actually emits the record being validated (`orchestrate-topic.cjs`). `opus-critical` opened it, found the emitted record hardcodes `mode:'council'` (matching the validator, not `'ai-council'` as assumed), and showed the validator actually passes — on non-canonical values that disagree with `mode-registry.json`, which is the real (subtler) defect. `gpt-critical`, working independently, reached the identical corrected conclusion. This 2-vs-1 convergence is treated as decisive in the final synthesis.
11. Re-ran `fanout-merge.cjs` across all 6 lineages (`merged_lineages: 6, skipped_no_registry: 0` — all lineages this time wrote the correctly-named registry file).
12. Rewrote `research/research.md` as the final consolidated synthesis, making the round-2 self-correction an explicit, prominent section rather than silently updating the answer with no trace of the process.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- Fixed the anti-convergence problem at its root (`--stop-policy=max-iterations` changing the dispatch prompt) rather than by external file-patching, after observing a lineage agent actively override the patch.
- Did not silently resolve cross-lineage disagreements by picking one answer — round 1's Mode D/phase-ordering disagreements and round 2's ai-council correction are all documented explicitly as part of the record, not smoothed over.
- Abandoned GLM for round 2 after 3 confirmed reproducible stalls rather than continuing to retry indefinitely, once the operator identified the root cause (quota exhaustion) — replaced with two additional, differently-sourced lineages (Opus, GPT) rather than reducing round 2's model diversity.
- Extended shared runtime schema (`executor-config.ts`) to add `"max"` reasoning effort with explicit user approval, since it touches all deep-loop workflows, not just this run.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- `npx vitest run` on `executor-config.vitest.ts`, `fanout-run.vitest.ts`, `fanout-merge.vitest.ts` after the schema change: 100/102 passed; 2 failures confirmed flaky/pre-existing by isolated re-run.
- All 6 lineages independently confirmed `maxIterationsReached`/`max_iterations` stop reasons (or, for glm-critical, an honestly-reported partial/stalled state) — direct evidence the anti-convergence fix held across every completed run.
- `bash validate.sh --strict` on this phase folder: PASSED, 0 errors, 0 warnings.
- The ai-council correction was verified as a genuine 2-vs-1 independent convergence (opus-critical and gpt-critical agreeing against sonnet-critical), not accepted from a single source.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- `glm-critical` completed only 1/10 iterations. Its single completed iteration (7 findings, independently corroborating the ai-council issue) is preserved and counted in the final synthesis, but it did not get the full 10-iteration critical pass the other round-2 lineages did.
- The reproducible GLM stall (near-zero CPU, ~29-50 min per attempt, 3 attempts) is a real gap in the deep-research runtime's failure detection — it does not distinguish "genuinely slow reasoning" from "API rejecting due to quota exhaustion," and the configured 900s `timeoutSeconds` does not appear to enforce a hard per-iteration cutoff for this failure mode. Worth a dedicated follow-up independent of this packet's substantive research.
- gpt-fast-high's (round 1) and both round-2 GPT/Opus lineages' iterations required stdout-salvage recovery for most/all iterations rather than a clean canonical JSONL append each time — a runtime robustness gap that did not compromise synthesis content but is worth investigating.
- The phase-ordering question (smoke-first vs. fix-first, `research/research.md` round-1 disagreement) is resolved in the final synthesis in favor of fix-first, with reasoning given — this is a judgment call, not a definitive research answer, and the operator may reasonably choose otherwise.
- Mode D magnitude is confirmed-in-mechanism and confirmed-fired-once, but not measured across all modes/models — sizing it is deferred to the future benchmark phase (011 in the final breakdown).
- The entire recommended phase 008-012 chain depends on a precondition (a genuine external, non-OpenCode shell) that has not been confirmed to exist in this environment — see `research/research.md` §5.
<!-- /ANCHOR:limitations -->
