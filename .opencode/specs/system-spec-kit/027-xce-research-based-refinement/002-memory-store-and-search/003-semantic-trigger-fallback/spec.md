---
title: "004 — Semantic Trigger Fallback"
description: "Phase-parent control packet for the hybrid lexical+semantic trigger fallback: schema + backfill, semantic matcher, hybrid handler integration, and tests/goldens/shadow eval. Lexical stays primary; semantic is a feature-flagged UNION fallback, default-off and shadow-first."
trigger_phrases:
  - "027 phase 004"
  - "memory semantic triggers"
  - "hybrid trigger matching"
  - "semantic trigger fallback"
  - "memory backend semantic trigger matching"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Promoted 007 leaf into phase parent with 4 children"
    next_safe_action: "Implement 001-schema-backfill first"
    blockers: []
    key_files: ["spec.md", "description.json", "graph-metadata.json"]
    completion_pct: 0
---
# Feature Specification: 004 — Semantic Trigger Fallback (Phase Parent)

<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v1.0 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Status** | phase-parent |
| **Parent Packet** | `system-spec-kit/027-xce-research-based-refinement` |
| **Packet ID** | `system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback` |
| **Hard Dependency** | None |
| **Soft Dependency** | Shadow-eval evidence (recall-lift / paired-comparison telemetry from an equivalent shadow-eval harness) for threshold tuning before union-mode promotion. The dependency is on the evidence, not a named folder. |
| **Scope Boundary** | Hybrid lexical+semantic trigger matching only. Lexical remains the primary precision path; semantic is a feature-flagged UNION fallback (default-off, shadow-first). |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:purpose -->
## 2. ROOT PURPOSE

`memory_match_triggers` is lexical-only today (`trigger-matcher.ts:201-545`): it catches explicit phrases (`/memory:save`, `save context`) but misses paraphrases ("save the current state"). The pt-03 RQ-B1 verdict was ADAPT, not replace — trigger matches feed cognitive activation (`memory-triggers.ts:360-380`), so semantic false positives are expensive and the lexical control surface must stay bit-for-bit identical when the feature is off.

This phase-parent decomposes that ADAPT into four independently executable children. The semantic stage reuses the active embedding profile's cache (default Ollama nomic-embed-text-v1.5, 768d; never embeds in the hot path), source-tags its hits, and activates them at reduced attention (`min(0.85, score)`). It ships default-off behind `SPECKIT_SEMANTIC_TRIGGERS`. In current code, shadow mode observes prompts that do not have a strong lexical match, and union mode is selected by `SPECKIT_SEMANTIC_TRIGGERS_MODE=union`; promotion evidence is an operator rollout policy, not a runtime-enforced gate.

The parent holds no implementation tasks. Cross-cutting architecture decisions live in `decision-record.md`; the full file inventory lives in `resource-map.md`.
<!-- /ANCHOR:purpose -->

---

<!-- ANCHOR:phase-map -->
## 3. PHASE DOCUMENTATION MAP

| Child | Scope | Primary subsystem | Depends On |
|-------|-------|-------------------|------------|
| `001-schema-backfill` | `memory_trigger_embeddings` derived table + resumable out-of-band backfill (index-scan + save-time). The hot path never embeds. | `vector-index-schema.ts`, `embedding-cache.ts`, `memory-index.ts`, `save/embedding-pipeline.ts` | None (foundation) |
| `002-semantic-matcher` | Pure cosine matcher with threshold/margin/max gates + concurrent-safe in-memory cache. | `lib/triggers/semantic-trigger-matcher.ts` (new), `memory-summaries.ts` | `001-schema-backfill` |
| `003-hybrid-handler` | Feature-flagged Stage 2 UNION in `memory_match_triggers`: short-circuit, source-tag, reduced-activation guards; flag-off bit-identical. | `handlers/memory-triggers.ts` | `002-semantic-matcher` |
| `004-tests-goldens-shadow-eval` | Goldens fixture, cold-start/latency/threshold/backfill tests, 5 ENV flags, shadow telemetry, shadow→union promotion gate. | `__tests__/triggers/*`, `__tests__/fixtures/trigger-goldens.json`, `ENV_REFERENCE.md` | `003-hybrid-handler` |

> **Promotion note:** the `0.84` threshold / `0.04` margin / goldens were tuned for Voyage 1024d and need re-tuning/re-validation for the active 768d Nomic profile before operators choose union-mode rollout. The current runtime does not store or enforce promotion evidence; starting a process with semantic triggers enabled and `SPECKIT_SEMANTIC_TRIGGERS_MODE=union` enables union behavior.
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:execution-order -->
## 4. EXECUTION ORDER

1. `001-schema-backfill` — derived table + out-of-band resumable backfill.
2. `002-semantic-matcher` — gated cosine matcher (pure, deterministic) against cached embeddings.
3. `003-hybrid-handler` — wire Stage 2 UNION into `memory_match_triggers`; keep flag-off bit-identical.
4. `004-tests-goldens-shadow-eval` — goldens, telemetry, flags, and the shadow→union promotion gate.

Some `004` work (goldens fixture, threshold-tuning scaffolding) can run in parallel with `001`.
<!-- /ANCHOR:execution-order -->

---

<!-- ANCHOR:what-needs-done -->
## 5. WHAT NEEDS DONE

- Keep lexical matching the primary precision path; flag-off output must be bit-identical to current behavior.
- Never embed in the trigger hot path; all embedding generation is out-of-band (index-scan + save-time), resumable, and fail-closed.
- Keep union mode limited to weak lexical results; shadow mode currently observes any prompt without a strong lexical match.
- Source-tag semantic-only hits and activate them at reduced attention so they cannot masquerade as exact triggers.
- Keep the feature default-off; re-tune thresholds for 768d Nomic before any operator-directed union rollout, because promotion evidence is not enforced by the runtime.
<!-- /ANCHOR:what-needs-done -->

---

<!-- ANCHOR:validation -->
## 6. VALIDATION

Strict validation must pass for this parent and each child:

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback --strict
```

Run the same command for each direct child folder before claiming the phase-parent scaffold is valid.
<!-- /ANCHOR:validation -->

---

## RELATED DOCUMENTS

- `decision-record.md` — ADRs for the hybrid trigger design (cross-cutting; retained at parent).
- `resource-map.md` — full file inventory (cross-cutting; retained at parent).
- Child phases — see `001-schema-backfill/`, `002-semantic-matcher/`, `003-hybrid-handler/`, `004-tests-goldens-shadow-eval/`.
- `../research/027-xce-research-pt-03/research.md` — pt-03 RQ-B1 source verdict.
