# Iteration 079 — re-plan sequence: Phase 0 (coco purge + drift reconcile + vocab/STATE_LIMITS) then 002||003 core, 008 after 002, 004->005->006, 007 last

**Executor:** cli-opencode `openai/gpt-5.5-fast` --variant xhigh (read-only). **Status:** complete. **newInfoRatio:** 0.18. **Findings:** 5.
**Raw analysis:** `research/prompts/iteration-079.out`

### FINDINGS
[F-079-01] Cleanest ship path is `002‖003` first: `002` still has 3 real P0s with P0-2 distinct from the shipped conflict guard, and `003` remains materially unbuilt but should build on existing self-maintaining scan rather than replace it. [SOURCE: deep-research-state.jsonl:78,82]

[F-079-02] Highest-risk phases are `004`, `006`, and `007`: `004` needs 14 delete-site rescope plus `edge_lifecycle_generation`; `006` needs sync `DiffAction` plus async replay; `007` has the largest cache/schema identity rescope and must ship last. [SOURCE: deep-research-state.jsonl:81,83-84]

[F-079-03] `005` is viable only as narrowed scope: keep parent/children/parentChain plus provenance, drop `manual.*` and doc-chain expansion, and fix the internal REQ conflict before implementation. [SOURCE: deep-research-state.jsonl:77,86]

[F-079-04] Phase 0 gates everything: Coco purge, parent drift reconcile, stale `028`/path cleanup, vocab constants, and `STATE_LIMITS` export must precede phase work or the implementation will wire against dead dependencies. [SOURCE: deep-research-state.jsonl:75-76,87-89,92]

[F-079-05] `008` is not blocked as a family, but it must be reshaped first: delete `008/002-coco`, preserve the numbering gap, reuse `batch-learning`, and sequence `001 -> {003,004} -> 005` after `002`. [SOURCE: deep-research-state.jsonl:75,79,88-89]

### RECOMMENDED_SEQUENCE
1. Phase 0A: Coco purge. Delete `008/002-coco-rerank-consumer`; rewrite Coco references across `002/003/004/006/007/008`; remove Coco edges/children/phase-map entries while preserving the numbering gap. Dependency: none; this is the first mechanical unblocker.

2. Phase 0B: Parent drift reconcile. Fix `026` status, root-path self-cites, stale `028`/Coco dependencies, `009 -> 008` numbering drift, continuity conflict, `000` child-list, and `last_active_child_id`. Dependency: Phase 0A, so deleted/moved children are not reintroduced.

3. Phase 0C: Constants and vocabulary fixes. Align `DEFAULT_RELATION_TARGETS` with canonical `RELATION_TYPES`; add/export the `STATE_LIMITS` seam needed by retention reducer work. Dependency: Phase 0A/B, because owners and child graph must be stable.

4. Ship `002-memory-write-safety`. Why: direct P0 safety blocker, still relevant, minimal repath only. Dependency: Phase 0.

5. Ship `003-incremental-index-foundation` in parallel with or immediately after `002`. Why: foundation remains unbuilt; build on existing self-maintaining scan/enrichment rather than redesigning it. Dependency: Phase 0.

6. Rescope then ship `005-learning-feedback-reducers` after `002`. Why: reducer family can start once P0 write safety lands, but must be Coco-free and constants-correct. Dependency: Phase 0C + `002`; internal order `008/001 -> 008/{003,004} -> 008/005`.

7. Rescope then ship `004-causal-edge-tombstones`. Why: tombstone scope is real but delete-site inventory and lifecycle naming are stale. Dependency: `003` plus Phase 0; use full 14-site inventory.

8. Rescope then ship `005-metadata-edge-promoter`. Why: useful deterministic hierarchy edges remain, but scope must be narrowed to parent/children/parentChain and provenance only. Dependency: `004` and vocab fix.

9. Rescope then ship `006-write-path-reconciliation`. Why: needs correct split between sync durable row actions and async enrichment replay; avoid same-response graph writes. Dependency: `003 + 005`, and practically after `004`.

10. Rescope then ship `004-semantic-trigger-fallback` last. Why: largest blast radius; schema/cache identity must target live `profile_key + input_kind` and Nomic-768 reality, not stale model assumptions. Dependency: all prior stabilization, especially `003/006/008` telemetry/backfill seams.

11. Apply `001-peck-teachings-adoption` refinement as low-risk cleanup. Why: mostly already INFO-scoped; residual warning/obsolete parent fallback wording remains. Dependency: can be included in Phase 0 docs cleanup or before final synthesis.

### SHIP_CLASS_TABLE
phase | class | blocking prerequisite
`001-peck-teachings-adoption` | RESCOPE-THEN-SHIP | Residual warn/obsolete wording cleanup
`002-memory-write-safety` | CLEAN-SHIP | Phase 0 drift/Coco cleanup
`003-incremental-index-foundation` | CLEAN-SHIP | Phase 0 drift cleanup; build on existing scan
`004-causal-edge-tombstones` | RESCOPE-THEN-SHIP | Full 14 delete-site inventory; `003`; lifecycle rename
`005-metadata-edge-promoter` | RESCOPE-THEN-SHIP | Narrow scope; fix REQ conflict; after `004`
`006-write-path-reconciliation` | RESCOPE-THEN-SHIP | Sync/async split; after `003 + 005`
`004-semantic-trigger-fallback` | RESCOPE-THEN-SHIP | Cache/schema identity rescope; ship last
`005-learning-feedback-reducers` | RESCOPE-THEN-SHIP | Delete `008/002-coco`; constants/export fixes; after `002`
`008/002-coco-rerank-consumer` | BLOCKED | Dead Coco scope; delete, do not ship

### TOP_RISKS
- `007` cache/schema identity drift: stale model/profile assumptions can poison trigger lookup. Mitigation: rescope to live Nomic-768, `profile_key`, and `input_kind`; ship last.
- `004` delete-site undercount: missing any hard-delete path breaks tombstone guarantees. Mitigation: require 14-site inventory and tests before implementation.
- `006` sync/async conflation: same-response graph writes would be incorrect for enrichment. Mitigation: sync `DiffAction` for durable rows; async pending-marker replay for enrichment.
- Cross-cutting Coco/028/path drift: stale docs could drive work into deleted dependencies. Mitigation: mandatory Phase 0 purge/reconcile before code.
- `005` scope creep: manual/doc-chain promotion duplicates shipped relation-backfill behavior. Mitigation: narrow to hierarchy edges plus provenance columns only.

### VERDICT
Re-plan as a two-stage recovery: first run a mechanical Phase 0 cleanup that removes Coco, reconciles parent/path/028 drift, and fixes relation vocabulary plus `STATE_LIMITS`; then ship the low-risk safety/foundation core `002‖003`, start reshaped `008` after `002`, and only then move through the higher-risk dependency chain `004 -> 005 -> 006`, with `007` deliberately last after schema/cache/backfill realities are stabilized.

### RULED_OUT
- Do not ship `007` early as an isolated semantic feature.
- Do not preserve or renumber `008/002-coco`; delete it and keep the gap.
- Do not broaden `005` back to `manual.*` or doc-chain promotion.

### METRICS
newInfoRatio: 0.18  
novelty: No major new facts; this iteration converts 061-078 verdicts into a ship sequence and risk gate.  
status: complete  
sources: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/deep-research-state.jsonl:75-92`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/deep-research-strategy.md:19-50`
