---
title: "Implementation Summary"
description: "Three research lineages of 15 iterations each traced the branch's spec failures to a few producers that still run, found that the healers write what the checkers reject and ranked 16 fixes. The top five are small and stop new failures at their source."
trigger_phrases:
  - "spec auto healing research implementation summary"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research"
    last_updated_at: "2026-10-07T22:40:00Z"
    last_updated_by: "claude-opus-5.5"
    recent_action: "Merged three 15-iteration lineages into research/research.md and closed the packet"
    next_safe_action: "Operator picks the archive semantics, then a follow-up packet builds SH-01 to SH-05"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/findings-registry.json"
      - "research/resource-map.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "014-spec-auto-healing-research-close"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Current-location or snapshot semantics for archived packets?"
    answered_questions:
      - "Which one-off repair fixes should become permanent idempotent tooling, and where should each live?"
      - "What causes each validation failure class at the source, and how do we stop new instances?"
      - "How should an older or pre-v4 repo be detected and migrated or healed safely, and how does that fit /doctor:update?"
      - "What should be hardened in this branch's own changes: the CI rebuild job, the cleanup tools, the seeder, the Gate 3 wording and the token push?"
      - "Which checks belong in CI or pre-commit so drift is caught early and cheaply?"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 014-spec-auto-healing-research |
| **Completed** | 2026-10-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You now have a ranked plan for making the spec repair permanent and for sparing external repos the same cleanup. The research found that most failures come from a few producers that still run today: archive moves that never re-derive recorded paths, a core template that nests three sections inside the `questions` anchor, and phase scaffolds that skip graph-metadata derivation. It also found that the shipped healers write values the checkers reject.

### Phase 14: spec-auto-healing-research

The `/deep:research` fan-out ran three executors on the same five questions, each for 15 iterations: DeepSeek V4.1 Flash on cli-pi, SWE-2 Max on cli-devin and GPT-6 Luna at max reasoning on the fast tier through cli-codex. The orchestrator read every iteration as it landed, re-checked the claims at their cited lines and merged the result into `research/research.md`. That file holds 16 ranked recommendations, each with its effort, risk, files touched and whether it could change what a document says.

The top five are all small: fix the template anchor (SH-01), finalize phase scaffolds (SH-02), settle the archive policy and re-derive on move (SH-03), harden the trigger-index rebuild workflow (SH-04) and stop the healer refilling judge-rejected phrases (SH-05). For external repos, `upgrade-legacy.mjs` already does the dry run, the fail-closed apply and the recorded debt the operator asked for. Nothing calls it yet, and SH-08 wires it into `/doctor:update` as a read-only check plus a separate approved action.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md` | Modified | Filled from what the research did. `spec.md` carries the generated findings block |
| `research/research.md` | Created | Merged synthesis, ranked recommendations and verification appendix |
| `research/deep-research-config.json`, `deep-research-state.jsonl`, ledgers | Created | Parent run config and the gateway-recorded synthesis and spec-mutation events |
| `research/lineages/` | Created | Three lineages with their steer files, iterations, deltas, state and lineage syntheses |
| `research/findings-registry.json`, `deep-research-findings-registry.json`, `fanout-attribution.md`, `resource-map.md` | Created | Merge and reducer outputs |
| `research/orchestration-status.log`, `orchestration-summary.json`, `observability-events.jsonl` | Created | Fan-out runner ledgers |
| `research/scaffold-sample/` | Created | Byte copy of this packet's docs as `create.sh` produced them |
| `description.json`, `graph-metadata.json` | Modified | Regenerated by the single-folder generators |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The fan-out ran from 20:53 to 22:13 UTC with `stopPolicy: max-iterations`, so convergence was telemetry only. All three lineages finished on their first attempt: Pi in 2,652 seconds, Devin in 3,867 and Codex in 4,815. Each recorded 15 iterations and `synthesis_complete` with `stopReason: maxIterationsReached` and five of five questions answered. No lineage failed, timed out or needed a retry. No convergence or stop-vote event fired. New-information ratios stayed between 0.7 and 1.0 until each lineage's final ranking iteration.

At 21:35 UTC the orchestrator appended five questions to the two running lineages' steer files, covering areas none had examined. Codex confirmed three of them independently. After the run, `fanout-merge.cjs` merged 74 key findings, `reduce-state.cjs` emitted the resource map, `synthesis-closeout.cjs` passed its invariants and both terminal events went through the append gateway.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Skip the workflow's `git add` of `research/` | The operator barred commits, and the index is shared with the live repair lanes. The contract marks that step non-fatal |
| Skip `generate-context.js` and refresh only this packet's `description.json` and `graph-metadata.json` with the single-folder generators | The save walks up and rewrites each phase-parent ancestor's `graph-metadata.json`, which would write `034-spec-folder-tooling` outside this packet |
| Run Devin on `swe-2-max` | It is the fan-out default. The cli-devin skill names no research model, and a Luna model on Devin would duplicate the Codex lens |
| Run three concurrent 15-iteration lineages rather than three seats per iteration | That is the contract's multi-executor mechanism |
| Set `GIT_OPTIONAL_LOCKS=0` on the fan-out runner | Its frequent `git status` sampling would otherwise take the shared index lock while lanes work |
| Write the parent config by hand | Fan-out skips the parent `phase_init` by contract |
| Delete the three `containment/` directories after the run | They held 4,874 copied `spec.md` files from other packets, which corpus walkers would double count |
| Recommend current-location semantics for archives, but leave the choice open | Phase 13 already moved most archives there and the validator demands it, but the shipped `upgrade-legacy.mjs` contract and its test say the opposite |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Fan-out summary | PASS: `orchestration-summary.json` reports 3 succeeded, 0 failed and every failure class at 0 |
| Lineage terminal records | PASS: 15 iterations and `synthesis_complete` with `maxIterationsReached` in all three state logs |
| Claim review | 3 refuted, 4 downgraded, 1 corrected, the rest confirmed at their cited lines (`research/research.md` Section 10) |
| Synthesis close-out | PASS: `synthesis-closeout.cjs` exit 0, `synthesis_complete` staged with 45 iterations and 5 of 5 answered |
| Targeted post-synthesis validation | PASS: 6 rules, `Errors: 0  Warnings: 0`, `RESULT: PASSED` |
| Write scope | PASS: 369 of 370 out-of-scope paths the containment check listed sit in Phase 13 lane folders and the last is a re-derive report. None was reverted |
| Strict validation of this packet | PASS: `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Corpus counts are snapshots.** Phase 13's lanes edited `specs/` during the run, so working-tree figures such as the 549 nested-anchor files are dated to the run and will move.
2. **The containment check cannot attribute writes in a shared checkout.** It listed the lanes' edits as violations for every lineage. The attribution to the lanes rests on the lane folder lists, not on a per-process record.
3. **Devin ran without an OS sandbox.** For a write-capable lineage the runtime passes `--permission-mode dangerous` without `--sandbox`, while `invocation-metadata.json` records `acceptEdits`. Confinement was the after-the-fact containment report only.
4. **`PI_BLACKHOLE_PASSIVE` could not reach the Pi child.** The cli-pi skill asks for it, and the fan-out's child environment allowlist drops it. The Pi lineage finished all 15 iterations regardless.
5. **The rebuild token risk is inferred.** It depends on how `skilled/**` branches are protected, which this run did not check.
<!-- /ANCHOR:limitations -->

---
