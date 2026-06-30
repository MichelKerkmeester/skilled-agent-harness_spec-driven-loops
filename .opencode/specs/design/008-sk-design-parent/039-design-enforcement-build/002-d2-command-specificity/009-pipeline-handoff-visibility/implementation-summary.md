---
title: "Implementation Summary: D2-R9 — Pipeline & handoff visibility across the /design:* surface"
description: "Each /design:* command now declares its pipeline place and recommend-only handoffs, machine-checked by a bidirectional graph rule in design-command-surface-check.mjs."
trigger_phrases:
  - "d2-r9 pipeline handoff summary"
  - "design command pipeline visibility summary"
  - "design build handoff summary"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/009-pipeline-handoff-visibility"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Documented D2-R9 pipeline+handoff build; checker PASS invalid=0 drift=0; 7 files scoped"
    next_safe_action: "Regenerate description.json + graph-metadata.json to clear residual generated-metadata"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-29-d2-r9-pipeline-handoff-visibility"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Recommend-only enforced positively (marker + bidirectional graph) rather than by a phrase ban"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-pipeline-handoff-visibility |
| **Completed** | 2026-06-29 |
| **Level** | 2 |
| **Enforcement class** | hybrid (metadata SSOT + deterministic surface gate) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The five `/design:*` commands now state where they sit in the design pipeline. Before this change, the flow `md-generator -> interface/foundations -> motion -> audit -> sk-code` lived only in routing data and child packets, so a user invoking a single command saw no handoff context. Each command now declares the stage it owns, what it accepts upstream, the artifact it produces, the commands it recommends next, and the build boundary it hands off to. The whole graph is machine-checked, and the recommendation is a positive no-auto-invoke guarantee rather than a silent chain.

### Pipeline metadata per command

`command-metadata.json` gained a `pipeline{ stage, acceptsFrom, produces, nextCommands, proofRequired }` object on all five records, with every prior field preserved. The values are reconciled, not invented: `produces` equals each record's `outputContract.primaryArtifactName`, `proofRequired` equals its `proofFields`, and `nextCommands` is a subset of its existing `next`. `acceptsFrom` is the exact inverse of the other records' `nextCommands`, which makes `md-generator` the origin (`acceptsFrom: []`) and declares every handoff edge at both ends. The five stage labels are distinct: `extract`, `direction`, `system`, `behavior`, `review`.

### Wrapper Pipeline & Handoff sections

Each of the five `commands/design/*.md` files gained a `## 6. PIPELINE & HANDOFF` body section (the prior `## 6. EXAMPLE` renumbered to `## 7. EXAMPLE`) projecting the pipeline: stage, accepts-from sources, produced artifact, the recommend-only next commands, the `sk-code` build-handoff card as the pipeline terminus, and a `Recommend-only:` marker stating the command never silently chains. The INSTRUCTIONS success tail upgraded to `STATUS=OK PRODUCES=<artifact> NEXT=<recommended-commands> PROOF=<proof-fields>`, preserving the `STATUS=OK` substring the prior D2-R7 token check depends on. Wrapper frontmatter stayed byte-frozen so existing drift stays 0.

### Checker enforcement

`design-command-surface-check.mjs` was extended additively: `pipeline` joined `REQUIRED_FIELDS` and `DRIFT_FIELDS`; `validatePipeline` checks sub-field validity plus the reconciliation rules (`nextCommands ⊆ next`, `produces == outputContract.primaryArtifactName`, `proofRequired` set-equal `proofFields`); a new cross-record `validatePipelineGraph` enforces `acceptsFrom == inverse(nextCommands)` and unique stages; and a Stage-2 body channel (`expectedPipelineDrift`) requires the section markers, the `nextCommands` tokens, the `sk-code` handoff line, and the `PRODUCES=/NEXT=/PROOF=` tail in every wrapper. This is the surface's first cross-record consistency rule.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/command-metadata.json` | Modified | Added `pipeline{}` to all 5 records; all prior fields preserved |
| `.opencode/commands/design/md-generator.md` | Modified | Added PIPELINE & HANDOFF section + upgraded OK tail; frontmatter frozen |
| `.opencode/commands/design/interface.md` | Modified | Same projection from its `pipeline` record |
| `.opencode/commands/design/foundations.md` | Modified | Same projection from its `pipeline` record |
| `.opencode/commands/design/motion.md` | Modified | Same projection from its `pipeline` record |
| `.opencode/commands/design/audit.md` | Modified | Same projection from its `pipeline` record |
| `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` | Modified | Added `validatePipeline`, `validatePipelineGraph`, Stage-2 pipeline body channel |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The build ran SSOT-first: the `pipeline` objects landed in `command-metadata.json` before the wrapper sections, because the cross-record graph rule needs all five `nextCommands` present at once. The wrapper sections were then projected from each record, and the checker rules were added last so the metadata-and-wrapper state was already conformant. Every change is strictly additive: `mode-registry.json` and `shared/sk_code_handoff.md` were never touched, wrapper frontmatter stayed frozen, and the final surface-check state is `invalid=0 drift=0`. The gate was confirmed to bite with a synthetic break (an `acceptsFrom` set to a non-inverse command), then restored. Scope held to exactly seven files.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Enforce a bidirectional graph (`acceptsFrom == inverse(nextCommands)`) | Declaring each handoff edge at both ends means no edge is invisible at either node; the graph cannot drift silently and `md-generator` is provably the origin |
| Reconcile `pipeline` against existing fields instead of restating them | `produces`/`proofRequired`/`nextCommands` mirror `outputContract.primaryArtifactName`/`proofFields`/`next`, so the new object cannot contradict the SSOT it sits in |
| Positive recommend-only marker + graph, not a phrase ban | A `Recommend-only:` marker plus a fully-declared graph is a positive no-auto-invoke guarantee; a banned-phrase scan would false-positive on the section's own negative assertions |
| Name the `sk-code` handoff card as the pipeline terminus | Makes the design->build boundary visible at the command layer where a user actually invokes, without coupling to or mutating the handoff card itself |
| Keep wrapper frontmatter byte-frozen | Body-only edits keep the prior D2 frontmatter-drift gate at 0, so the change is provably no-regression |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node design-command-surface-check.mjs` | PASS `invalid=0 drift=0` (exit 0); pipeline + all prior D2 fields green |
| Pipeline graph consistency | `acceptsFrom == inverse(nextCommands)` holds for all 5; stages unique; `md-generator` origin (`acceptsFrom: []`) |
| Field reconciliation | `produces == outputContract.primaryArtifactName`, `proofRequired == proofFields`, `nextCommands ⊆ next` for all 5 |
| PIPELINE & HANDOFF sections | 5/5 present with all markers (`Stage:`/`Accepts from:`/`Produces:`/`Hands to next`/`Hands to build:`/`Recommend-only:`) |
| Recommend-only markers | 5/5 present (positive no-auto-invoke guarantee) |
| Status tails | 5/5 carry `STATUS=OK PRODUCES= NEXT= PROOF=`; `STATUS=OK` substring preserved |
| sk-code handoff line | 5/5 wrappers name the `sk-code` build-handoff card |
| Synthetic break (orchestrator-verified) | An `acceptsFrom` set to a non-inverse command -> `STATUS=INVALID` "pipeline.acceptsFrom contains unknown command" + "must match inverse nextCommands"; restoring -> `invalid=0 drift=0` |
| `node --check` on checker | PASS (valid ESM) |
| `command-metadata.json` JSON parse | PASS (5 records) |
| Non-mutation | `git status`: `mode-registry.json` and `shared/sk_code_handoff.md` byte-unchanged |
| Scope | `git status`: exactly 7 files changed (metadata + 5 wrappers + checker) |

### Test Coverage Summary

| Surface | Channel | Status |
|---------|---------|--------|
| Metadata sub-fields + reconciliation | Stage 1 `validatePipeline` | PASS |
| Cross-record graph + unique stages | Stage 1 `validatePipelineGraph` | PASS |
| Wrapper section + tokens + tail | Stage 2 `expectedPipelineDrift` | PASS |
| Prior D2 (example/contract/discriminator/preconditions) | full run | PASS, intact |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Residual generated-metadata errors are expected.** Strict `validate.sh` reports a `GENERATED_METADATA_INTEGRITY` source-fingerprint mismatch (and `description.json` may show staleness) because `spec.md`/`implementation-summary.md` changed after the last metadata generation. These are regenerated by the orchestrator via `generate-context.js`; they are not hand-written here.
2. **The graph rule assumes a fully-connected design surface.** `acceptsFrom == inverse(nextCommands)` is exact, so any future `/design:*` command must declare its edges on both ends or the checker fails by design. This is the intended strictness, not a bug.
3. **Recommend-only is enforced structurally, not behaviorally.** The checker proves the wrapper text declares no auto-chain and the graph is fully declared; it does not execute the commands. The runtime no-chain guarantee rests on the wrappers being the invocation surface.
<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
- Core + Level 2 verification addendum
- Post-implementation: pipeline metadata + wrapper sections + bidirectional graph checker
- Strictly additive; mode-registry.json + sk_code_handoff.md untouched; final surface-check invalid=0 drift=0
-->
