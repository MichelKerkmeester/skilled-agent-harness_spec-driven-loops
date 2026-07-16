---
title: "Implementation Summary: Global spec-drift and prior-context-optimization deep-research sweep"
description: "Executed the /deep:research :auto fan-out (GLM/SOL/LUNA, normal convergence) over .opencode/specs/*. SOL (9 iters) + LUNA (10 iters) are the route-proof-compliant synthesis basis; GLM (5 iters) failed the route-proof gate and was archived as supplementary per operator decision. Merged research/research.md written; findings triaged for phase 007."
trigger_phrases:
  - "global spec drift research"
  - "spec drift deep research sweep"
  - "prior context optimization research"
  - "006 global spec drift"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/000-migration-from-soa-and-cleanup/006-global-spec-drift-deep-research"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Ran fan-out; archived noncompliant GLM; compiled merged research.md from SOL+LUNA"
    next_safe_action: "Commit 006; phase 007 teardown gated on fresh operator yes"
    blockers: []
    key_files:
      - "spec.md"
      - "research/research.md"
      - "research/deep-research-findings-registry.json"
      - "research/_archived-lineages/glm/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "006-global-spec-drift-deep-research-executed"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Per-packet 'spec wrong vs graph stale' determination for the ~231 genuine status conflicts is deferred to a follow-on packet (parent REQ-006)."
    answered_questions:
      - "Operator specified the launch workflow verbatim: /deep:research :auto, not a hand-rolled substitute."
      - "GLM lineage resolution: operator chose 'synthesize SOL+LUNA, GLM supplementary' over rerunning GLM (glm-5.2 structurally omits route-proof provenance)."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-global-spec-drift-deep-research |
| **Completed** | Yes — fan-out executed; SOL+LUNA synthesized into `research/research.md`; GLM archived supplementary. Phase 007 remains gated on a fresh operator confirmation. |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

One `/deep:research :auto` sweep, fanned out across 3 executor lineages (GLM, SOL, LUNA) under NORMAL convergence (10-iteration/lineage cap; forced-depth is not wired for the research fan-out path), over ALL of `.opencode/specs/*`, producing the durable `research/research.md` that gates phase 007's destructive memory-database teardown.

The fan-out ran all three lineages. SOL (9 iterations, converged) and LUNA (10 iterations, max-iterations) both satisfied the workflow's mandatory per-iteration **route-proof contract**. **GLM (`glm-5.2`, 5 iterations) did not** — it emitted a reduced record schema with 0 route-proof fields and 0 delta files (a structural model-adherence gap; its records were also flagged timestamp-anomalous). Per operator decision, GLM was archived to `research/_archived-lineages/glm/` and its research is carried as a supplementary, unverified-provenance input; the gated synthesis was compiled from the two compliant lineages.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/research.md` | Create | Merged 17-section synthesis from SOL+LUNA (GLM supplementary) — the phase-007 evidence gate. |
| `research/deep-research-findings-registry.json`, `research/fanout-attribution.md` | Create | `fanout-merge.cjs` consolidated the 2 compliant lineage registries (`merged_lineages: 2`, `key_findings: 19`). |
| `research/lineages/{sol,luna}/**` | Create | The two compliant lineage state packets (iterations, deltas, per-lineage research.md, findings registries). |
| `research/_archived-lineages/glm/**` | Move (archive) | GLM lineage removed from the gated set; preserved for the supplement. Rollback: move back to `research/lineages/glm/`. |
| `spec.md` (EXECUTION DEVIATION #2, REQ-002, SC-002) | Edit | Codify the operator-approved 2-lineage synthesis + GLM-supplementary amendment. |
| `research/deep-research-config.json`, `research/orchestration-summary.json` | Edit | Reconcile the active gated set to SOL+LUNA (GLM annotated as archived post-run); truthful run counts preserved. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Launched with `opencode run --command deep/research ":auto '<topic>' --spec-folder=<006> --max-iterations=10 --executors='[glm,sol,luna]' --concurrency=3"` from the isolated worktree against the origin snapshot (the `tsx` ESM loader was made resolvable via the worktree's `node_modules`/`runtime/node_modules` symlinks). The fan-out completed; the workflow's route-proof gate correctly fail-closed on the noncompliant GLM lineage. After the operator chose "synthesize SOL+LUNA, GLM supplementary," GLM was archived out of the gated `lineages/` set, spec/config/summary were reconciled, and the synthesis was completed through the workflow's own tooling: `fanout-merge.cjs --loop-type research` (merged 2 registries) followed by the `step_compile_research` compose step (this session, per "orchestration stays with the main session"), because `:auto` has no synthesis-only resume branch. Node scripts ran from the MAIN tree against worktree paths.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Synthesize from SOL+LUNA; carry GLM as supplementary (unverified provenance) | Operator decision. `glm-5.2` structurally omits route-proof provenance fields, so a same-model rerun would re-fail; GLM's research *content* is preserved and corroborates the compliant basis, but is not part of the route-proof-gated set. |
| Complete synthesis via the workflow's own `fanout-merge.cjs` + `step_compile_research` | `:auto` fail-closed with "no safe resume-to-merge branch" and explicitly requested a synthesis-only recovery path; running the workflow's own merge script + the orchestrator compile step is that path, not a hand-rolled substitute (the fan-out — the workflow's core feature — already ran). |
| Amend spec.md (REQ-002/SC-002 + EXECUTION DEVIATION #2) before re-running synthesis | The workflow raised a LOGIC-SYNC (2-lineage command vs 3-lineage spec); routed through an amendment recording the operator's decision, not a silent workaround. |
| Ran under normal convergence, not forced-depth | Forced-depth (`divergent` + `stop-policy=max-iterations`) is not wired for the research fan-out path; operator-accepted 2026-07-16 (EXECUTION DEVIATION #1). |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `research/research.md` exists, non-empty | Yes — merged 17-section synthesis; mandatory `## Eliminated Alternatives` + `## Divergence Map` present. |
| Route-proof compliance of the synthesis basis | SOL 9/9 + LUNA 10/10 route-proof-compliant; GLM 0/5 (archived supplementary). |
| `fanout-merge.cjs` consolidation | `merged_lineages: 2`, `key_findings: 19`; registry + attribution written. |
| Findings triaged (parent REQ-006) | Yes — §10 triage table (each finding remediated/deferred/accepted with reason). |
| `validate.sh --recursive --strict` | Run post-metadata-regen; error-count reconciled (see commit). |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **GLM lineage is supplementary, not gated.** `glm-5.2` failed the route-proof contract; its findings are retained at `research/_archived-lineages/glm/` with Low confidence unless corroborated by SOL/LUNA. Specific GLM-only counts (e.g. ~61 snake_case dirs, ~45/~23 status mismatches) are NOT independently reproduced by the compliant lineages.
2. **Quantitative prevalence under a clean denominator is open.** LUNA left 3/5 quantitative questions open by design; SOL's counts use a research denominator (2,168 active candidates), not a manifest-scoped packet denominator. Deferred to the parent REQ-006 follow-on.
3. **Code-graph structural analysis was unavailable.** The code-graph index was empty (0 nodes) for both lineages; relationship claims rest on direct source reads, not graph traversal.
4. **Phase 007 remains gated.** This packet authorizes nothing destructive. The teardown requires a FRESH operator confirmation plus the daemon-stop / named-allowlist / exclusion-baseline gates recorded in `research/research.md` §7.1.
<!-- /ANCHOR:limitations -->

---
