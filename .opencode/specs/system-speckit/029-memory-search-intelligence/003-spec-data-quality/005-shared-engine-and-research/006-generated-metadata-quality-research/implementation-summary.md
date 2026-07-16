---
title: "Implementation Summary: 031 Generated JSON Quality and Safety Research [template:level_2/implementation-summary.md]"
description: "Status COMPLETE for a research-only deliverable. The 10-angle study diagnosed two dominant safety classes, broad-walk over-reach and non-idempotent writes, converged on a shared spec-folder identity resolver and a first-class generated-metadata validator as the root-cause fixes, skeptically cross-checked the load-bearing claims, and produced 14 ranked proposals with a build order. Findings live in research/research.md. No generator or parser or schema or validator code was modified."
trigger_phrases:
  - "generated json quality research summary"
  - "safe regeneration research complete"
  - "shared identity resolver recommendation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/003-spec-data-quality/005-shared-engine-and-research/006-generated-metadata-quality-research"
    last_updated_at: "2026-07-06T19:16:38.256Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Completed 10-angle research, identity-resolver fix verified"
    next_safe_action: "Operator decides which verified proposals warrant a build phase"
    blockers: []
    key_files:
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-22-summary-031-generated-metadata-quality-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Two safety classes dominate, broad-walk over-reach and non-idempotent writes, both surfacing as unscoped cross-session commit churn."
      - "A single shared spec-folder identity resolver is the convergent root-cause fix four angles reached."
      - "A first-class generated-metadata validator in strict mode is the convergent enforcement three angles reached."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 031-generated-metadata-quality-research |
| **Completed** | 2026-06-22 |
| **Level** | 2 |
| **Type** | Research-only study, no code or doc mutation |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet delivered a diagnosis and a ranked plan, not a code change. Ten angle-diverse read-only seats, each reading the live generator, parser, schema, discovery, and validator code, converged on a clear diagnosis of how the spec-kit generated JSON over-reaches and churns and on the root-cause fixes. The full method, the 14 ranked proposals, the verification verdicts and the recommended build order live in `research/research.md`, backed by the ten per-angle finding sets under `research/deltas/`.

### The diagnosis: four safety classes, two dominant

The study sorted every finding into four safety classes. Class A is broad-walk over-reach, the backfill CLI ignores its positional folder and defaults to the repo-wide root and runtime search regenerates a global cache as a side effect. Class B is non-idempotent writes, the description path stamps wall-clock time and writes unconditionally so a rerun dirties unchanged folders. Class C is relationship and identity drift, `mergeGraphMetadata` drops `parent_id` and `children_ids` on a re-derive and the `specFolder` path shape differs between the two generators. Class D is the weak generated-JSON contract, free-text statuses leak and the validator is shallow and warning-level. Classes A and B share the visible symptom of unscoped cross-session commit churn, class C is the lineage-loss risk, and class D is the missing enforcement that lets all three regress silently.

### The convergent fixes: an identity resolver and a validator

Two fixes are convergent. Four independent angles arrived at one shared spec-folder identity resolver, a single helper returning a specs-root-relative `specFolder`, `parentId`, and `childrenIds` from the absolute path, used by both generators, which removes the path-shape drift and gives the merge path a safe parent-preservation rule. Three independent angles arrived at a first-class generated-metadata validator wired into `validate.sh` strict mode, which turns the shallow warning-level shell checks into a real completion gate and closes the status enum at the schema boundary.

### The skeptic downgrades and the confirmed root causes

The skeptical pass downgraded four over-claims and confirmed two P0 root causes. The four downgrades are the z_future backfill crash already fixed this session, the z_archive memory-versus-code-graph divergence which is documented and by-design, the graph-metadata determinism which is already idempotent via the volatile-ignoring compare, and the triple-counted causal-summary drift merged into one ranked entry. The two confirmed P0 root causes carry file:line evidence, the status normalizer admits em-dash prose at `graph-metadata-parser.ts:179-180` and `mergeGraphMetadata` spreads the refreshed payload at `graph-metadata-parser.ts:1149-1161` and so drops a non-null `parent_id` and an append-only `children_ids`.

### The build order

Ship the scoped boundary and the identity resolver first, they are the highest-leverage scope and drift fixes and the resolver is a dependency for the validator path invariants and the merge guard. Then the merge-path lineage guard and the description idempotency behind a default-off or grandfather mode validated against a scoped migration. Then the status enum and the global-cache upsert, both small and independent, then the validator once the resolver and enum exist for it to assert against. Then the P1 hardening, then defer the two P2 refinements to a backlog.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/research.md` | Created | The synthesized 10-angle ranked proposals, verification and build order |
| `research/deltas/` | Created | The ten per-angle finding sets |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md` | Created | Level 2 spec-folder documentation for the completed study |

No generator, parser, schema, or validator code was modified.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The study ran ten read-only angle seats, dispatched as gpt-5.5-fast xhigh seats through a driver, each scoped to its slice of the live source so it stayed within context. Seats were read-only by design, since an opencode-dispatched edit cannot pass Gate 3, and the orchestrator wrote all state. The angles spanned generator over-reach, the z_future and z_* exclusion residual, write determinism, the status enum, causal-summary drift, parent_id integrity, path-format canonicalization, the global index regen, the first-class JSON validator, and the unifying safe-regeneration contract. The load-bearing step was a skeptical cross-model verification pass, the load-bearing claims were independently re-checked by a claude synthesis model reading the live code, a different model than the gpt-5.5 seats that surfaced them. Confidence comes from that verification pass and from each proposal citing a file the seat actually read.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep every seat read-only and write state from the orchestrator | An opencode-dispatched edit cannot pass Gate 3, so read-only is the only safe seat shape |
| Sort the findings into four safety classes rather than a flat list | Over-reach, non-idempotent writes, identity drift, and the weak contract share no code and need separate fixes |
| Treat the shared identity resolver as the root-cause fix | Four independent angles reached it, and it removes path drift while giving the merge a parent-preservation rule |
| Treat the first-class validator as the convergent enforcement | Three independent angles reached it, and the real schemas already exist to assert against |
| Downgrade the z_future, z_archive, graph-determinism, and drift over-claims | The skeptical pass found them already-done, by-design, already idempotent, or triple-counted |
| Stop at research only, modify no generator or parser or schema or validator code | Shipping a fix is an operator decision, not part of this study scope |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Ranked proposal set written | PASS, research/research.md section 4 lists 14 ranked proposals across four safety classes |
| Per-angle evidence retained | PASS, research/deltas/ holds the ten finding sets |
| Load-bearing claims cross-model verified | PASS, two CONFIRMED, four DOWNGRADED, one ALREADY-DONE by a claude skeptical pass |
| Status normalizer root cause confirmed | PASS, em-dash prose admitted at graph-metadata-parser.ts:179-180 |
| Merge-path lineage root cause confirmed | PASS, parent_id and children_ids dropped at graph-metadata-parser.ts:1149-1161 |
| No generator or parser or schema or validator code modified | PASS, only research artifacts written |
| Spec-folder strict validation | PASS, validate.sh --strict exits 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **This study closes nothing.** The proposals are documented, not built. The next step is the operator decision recorded in research/research.md section 7.
2. **Behavioral fixes need a migration.** Many existing files carry the very prose statuses and prefixed paths the new contract rejects, so each fix should ship behind a default-off flag or a grandfather report mode and graduate only after a scoped migration.
3. **The graph fingerprint is hardening, not a fix.** Graph metadata is already idempotent via the volatile-ignoring compare, so the determinism work is description-side only.
4. **The identity resolver is a precondition.** The validator path invariants and the merge-path lineage guard both depend on the shared resolver, so it is the gating first build.
<!-- /ANCHOR:limitations -->
