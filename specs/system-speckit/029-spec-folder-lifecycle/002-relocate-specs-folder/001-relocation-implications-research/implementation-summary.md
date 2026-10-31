---
title: "Implementation Summary: Relocation Implications Research"
description: "Dual-executor deep research converged on both lineages and produced a reconciled recommendation: CONDITIONAL-GO on a back-symlink flip, gated on a combined patch list neither lineage alone found in full."
trigger_phrases:
  - "relocation research summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/032-relocate-specs-folder/001-relocation-implications-research"
    last_updated_at: "2026-08-06T13:28:45Z"
    last_updated_by: "claude-code"
    recent_action: "4-lineage synthesis complete; found reusable existing migration infrastructure"
    next_safe_action: "Operator reviews research/research.md before scoping phase 002"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-06-system-speckit-032-relocate-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-relocation-implications-research |
| **Completed** | 2026-08-06 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You now have a source-cited, cross-verified answer to whether the root `.opencode/specs` folder can move to a top-level `specs/` directory: **CONDITIONAL-GO**, via a back-symlink flip, gated on patching a combined list of hardcoded literals that only surfaced by running two independent lineages and reading them against each other.

### Dual-executor research (round 1) + two more lineages (round 2)

Round 1: two lineages ran the full deep-research loop independently: `glm` (cli-devin, GLM-5.2 High) and `grok` (cli-cursor, Grok 4.5 High). Both converged legally (`all_questions_answered`) with full source citations. glm quantified the reference-scale problem (476,239 references, 99.6% self-reference) and designed the back-symlink-flip architecture. grok found three Memory MCP discovery-layer literals that glm's lineage never inspected, and was more conservative about executing without a coordinated cutover.

Round 2 (operator-requested, "10 more iterations", clarified to 5 each): two more lineages, `sol` (cli-codex, gpt-5.6-sol, reasoningEffort high) and `luna` (cli-codex, gpt-5.6-luna, reasoningEffort max), ran on the same topic. Both went considerably deeper than round 1 and independently discovered that **this repo already has a substantial migration-safety subsystem** (`spec-root-registry.ts`, `spec-root-migration.ts`, `spec-root-migration-manifest.ts`, `spec-root-write-guard.ts`, a 61-test-case validation matrix) built for the opposite migration direction — verified real, and precisely matching its stated purpose. That single finding changes the recommendation from "hand-patch ~7 literals" to "invert and reuse the existing harness." `sol`'s dispatch was flagged by the orchestrator as failed over an incidental write-containment violation (`.pi/modes.json`, cleanly reverted, zero residue, never referenced in sol's own output) — investigated and confirmed benign before its findings were used.

`research/research.md` reconciles all four lineages, including an internal Memory MCP inconsistency (indexer is dual-root-aware, discovery/identity layer is canonical-locked) that only emerged from reading multiple citation sets together.

### Phase-parent scaffold

`system-speckit/032-relocate-specs-folder/` is a phase-parent packet (lean trio at the parent) with this phase as its first child, scaffolded via `create.sh --phase --parent` and hand-filled from the Level-1 templates for the research-first framing.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/research.md` | Created | Packet-level synthesis reconciling both lineages, with a combined ranked implication list and an explicit recommendation |
| `research/lineages/glm/*`, `research/lineages/grok/*` | Created | Per-lineage state (config, JSONL deltas, iteration markdown, per-lineage research.md) written by each dispatch |
| `spec.md`, `plan.md`, `tasks.md` | Modified | Status flipped to Complete; tasks marked done with evidence, including the glm failure/retry story |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Dispatched via `fanout-run.cjs` directly — the same shared runtime `/deep:research:auto` delegates to for `--executor`-flag multi-lineage fan-out (config schema confirmed against the actual TypeScript source, not just docs, before dispatch). The glm lineage failed its first attempt; the failure was reproduced directly against the real `devin` CLI, root-caused to an org-policy restriction on autonomous mode, and retried only after explicit operator approval for the elevated permission mode. The packet-level synthesis was written by hand after both lineages had real output, since the automated merge step only runs when all lineages complete on the same pass — this run's first pass was partial.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reproduced the glm failure directly instead of accepting the generic "exited with code 1" | The fan-out log carried no stderr; a bare `devin -p --model glm-5-2 --permission-mode dangerous --sandbox` reproduction surfaced the real error text ("Mode 'autonomous' is restricted by your organization's policy") in one call |
| Asked before retrying with `sandboxMode: danger-full-access` | cli-devin's own hard rule requires explicit user approval before `--permission-mode dangerous`; the confirmed working alternative still needed that approval, not a silent substitution |
| Verified 10 citations against real files instead of trusting either lineage's self-report | Both lineages' iteration timestamps were self-reported and didn't match true wall-clock time (each CLI ran its whole multi-iteration loop in one continuous session) — citation content needed independent confirmation before the findings could be trusted |
| Reconciled rather than picked a winning verdict | glm and grok reached different strategic conclusions (proceed now vs. wait for a cutover) for a legitimate reason — different depth of inspection, not one being simply wrong — and each found literals the other missed |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| grok lineage convergence | PASS — `all_questions_answered`, iteration 6, 40 sources, quality guards passed |
| glm lineage convergence (after retry) | PASS — `all_questions_answered`, iteration 5, `EXIT:0` |
| Citation spot-check (5 grok + 5 glm + 3 sol + 2 luna) | PASS — 15/15 matched the actual files exactly |
| sol containment-violation investigation | PASS — `.pi/modes.json` diff clean (reverted with zero residue); no reference to it anywhere in sol's own research output |
| luna lineage convergence | PASS — `all_questions_answered`, iteration 5 |
| sol lineage research completion (pre-containment-flag) | PASS — `synthesis_complete` + `lock_released` in state log before the orchestrator's containment check ran |
| `validate.sh --recursive --strict` (parent packet) | PASS — `Errors: 0  Warnings: 0` on both the parent and this phase folder |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Per-iteration timestamps in both lineages' JSONL state are synthetic.** Each CLI executor ran its full multi-iteration research loop inside one continuous non-interactive session and self-reported iteration boundaries/durations rather than measuring real wall-clock time. The *findings* were independently verified against real files; the *timing* metadata should not be read as literal.
2. **Five carried-forward items are unresolved** (see `research/research.md` §5) — most notably whether `backfill-graph-metadata.ts`'s bulk-discovery caller enumerates from both roots, and whether a real downstream symlinked repo's `specs` mount survives a flip. A migration phase should not proceed without closing these.
3. **This phase does not migrate anything.** It answers the go/no-go question; a later phase (not yet created) would patch the literals and execute the flip, only after operator review of the recommendation.
<!-- /ANCHOR:limitations -->
