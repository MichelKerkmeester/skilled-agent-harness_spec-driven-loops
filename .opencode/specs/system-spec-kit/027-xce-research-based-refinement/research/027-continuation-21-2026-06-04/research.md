# Continuation Revalidation Research

This artifact is a continuation/revalidation packet for 21 targeted deep research iterations. It restarts research state in an isolated artifact root while treating older flat research state as lineage and reference only.

---

## Source Corpus

- `external/xce-mcp`
- Current `system-spec-kit` implementation
- Existing 027 plans
- Stale existing flat research state as lineage/reference only

---

## Iteration Index

| Iteration | Focus | Status |
|---|---|---|
| 040 | state hygiene | complete |
| 041 | path/root drift | complete |
| 042 | XCE signal/noise | complete |
| 043 | peck T3/T4/T2 | complete |
| 044 | memory write safety | complete |
| 045 | incremental index | complete |
| 046 | tombstones | complete |
| 047 | metadata edge promoter | complete |
| 048 | statediff | complete |
| 049 | semantic triggers | complete |
| 050 | feedback reducers | complete |
| 051 | local context-first decision tree | complete |
| 052 | context bundle workflow | complete |
| 053 | resource-map automation | complete |
| 054 | reducer/state hygiene | complete |
| 055 | command naming/root normalization | complete |
| 056 | impact-analysis preflight | complete |
| 057 | memory_context curator | complete |
| 058 | semantic trigger backfill/promote | complete |
| 059 | reducer telemetry gates | complete |
| 060 | final synthesis | insight |

---

## Final Synthesis

Iteration 060 was written before some parallel artifacts for 040-057 were visible, so its provisional matrix has now been reconciled against all 21 iteration markdown files and 21 delta JSONL files in this continuation artifact root. The authoritative result is this merged synthesis plus the rebuilt `deep-research-state.jsonl`; older flat research state remains lineage/reference only.

### Evidence Coverage

- Required iteration markdown files present: 21/21 (`iteration-040.md` through `iteration-060.md`).
- Required delta JSONL files present and parsed: 21/21 (`iter-040.jsonl` through `iter-060.jsonl`).
- Normalized state records appended: 21 sorted `type:"iteration"` records, preserving config/event lines.

### Merged Recommendations

- **040:** Repair state hygiene through isolated continuation state; old flat state/registry/research are lineage-only until reducer regeneration.
- **041:** Normalize root and command naming before rollout; keep `specs/` versus `.opencode/specs/` citations explicit by surface.
- **042:** Keep XCE-derived ideas as signal sources, not direct requirements; promote only evidence-backed adaptations.
- **043:** Treat peck T3/T4/T2 as scoped inspiration and reject broad unverified imports.
- **044:** Keep memory-write safety as a hard gate: default-off mutations, spec-folder discipline, and explicit validation before persistence.
- **045:** Use incremental index work only with freshness/hash checks and safe full-scan fallback.
- **046:** Require tombstone lifecycle semantics before edge deletion/promotion changes become active.
- **047:** Constrain metadata edge promotion to validated schema and confidence gates.
- **048:** Use statediff as an explicit reconciliation aid, not as an implicit source of truth.
- **049+058:** Merge semantic trigger work with backfill/promote gates: lexical-first remains safe, semantic expansion stays measured and default-off until metrics pass.
- **050+059:** Merge feedback reducer work with telemetry gates: reducers stay shadow/default-off until ledger quality, replay, and consumer-specific live gates pass.
- **051:** Prefer a local-context-first decision tree before MCP-heavy retrieval when local packet evidence is sufficient.
- **052:** Bundle context explicitly and reproducibly; avoid hidden reducer dependencies.
- **053:** Automate resource-map maintenance only after validation can prove path accuracy and stale-entry behavior.
- **054:** Reducer/state hygiene must be idempotent, duplicate-resistant, and safe on rerun.
- **055:** Standardize command naming/root normalization before docs or commands claim canonical behavior.
- **056:** Keep impact-analysis preflight as a refusal gate on stale or missing structural graph state.
- **057:** Curate `memory_context` output for relevance and evidence density instead of returning undifferentiated matches.
- **060:** Replace the provisional synthesis with this reconciled merge; no source/spec edits are implied by this artifact-only update.

### Iteration Evidence Matrix

| Iteration | Status | Key finding | Recommendation summary |
|---|---|---|---|
| 040 | complete | The continuation config explicitly restarts from isolated state: `artifactDir` points to this continuation packet, `progressiveSynthesis` is true, and `lineage.lineageMode` is `restart` because the existing flat research state... | No extra recommendation captured; use iteration findings. |
| 041 | complete | The current 027 parent spec is stored under `.opencode/specs/...` and its phase map names the current active children 000-008, including `001-peck-teachings-adoption` and memory phases `002`-`008`. | No extra recommendation captured; use iteration findings. |
| 042 | complete | Portable local idea: architecture-context packaging is useful as a pattern, not a dependency. XCE publicly exposes HLD, LLD, component descriptions, relationships, and call-graph-style context; local Spec Kit can adapt that as... | No extra recommendation captured; use iteration findings. |
| 043 | complete | Iteration evidence is present and parsed, but no concise finding sentence was detected. | No extra recommendation captured; use iteration findings. |
| 044 | complete | Iteration evidence is present and parsed, but no concise finding sentence was detected. | No extra recommendation captured; use iteration findings. |
| 045 | complete | Iteration evidence is present and parsed, but no concise finding sentence was detected. | No extra recommendation captured; use iteration findings. |
| 046 | complete | The core deletion primitives still hard-delete active causal edges without a tombstone read-before-delete path: `deleteEdge()` executes `DELETE FROM causal_edges WHERE id = ?`, and `deleteEdgesForMemory()` executes `DELETE FROM... | No extra recommendation captured; use iteration findings. |
| 047 | complete | Manual `graph-metadata.json` relationships are already deterministically parsed into causal-link buckets: `manual.depends_on` becomes `blocks`, `manual.supersedes` becomes `supersedes`, and `manual.related_to` becomes `related_... | No extra recommendation captured; use iteration findings. |
| 048 | complete | Entity-density invalidation is still manually wired in save and bulk-delete: `memory-save.ts` defines `invalidateEntityDensityCacheAfterSave()` and calls it after post-insert enrichment, while `memory-bulk-delete.ts` defines `i... | No extra recommendation captured; use iteration findings. |
| 049 | complete | Phase 007 is still directionally valid: the current matcher loads canonical spec docs plus `_memory.continuity` rows from `memory_index`, and still relies on lexical trigger phrases rather than semantic trigger embeddings. | No extra recommendation captured; use iteration findings. |
| 050 | complete | Phase 008's reducer-parent shape remains valid: it is explicitly a phase parent for an aggregator plus three consumers and env/tests integration, with the shared aggregator reading SQLite `feedback_events` from `feedback-ledger... | No extra recommendation captured; use iteration findings. |
| 051 | complete | Local rules already define a safer context-first sequence: parse request, read actual files/docs first, plan, validate, then execute; this maps to XCE-style context steering without letting context retrieval bypass local govern... | No extra recommendation captured; use iteration findings. |
| 052 | complete | A context bundle should start with Spec Kit memory/resume, not code search: `memory_context` is documented as the L1 entry point for context retrieval, supports resume mode, and explicitly routes code search to Code Graph plus... | No extra recommendation captured; use iteration findings. |
| 053 | complete | The template already defines the stale-reference vocabulary needed for automation: summary rows include total references and missing-on-disk count, and status values include `OK`, `MISSING`, and `PLANNED`. | No extra recommendation captured; use iteration findings. |
| 054 | complete | Deep-research state has split ownership: the agent writes iteration markdown and one structured record, while the workflow reducer owns strategy machine sections, findings registry, and dashboard; manual repair should respect t... | No extra recommendation captured; use iteration findings. |
| 055 | complete | The live OpenCode command directory is `speckit`, not `spec_kit`: file discovery found `.opencode/commands/speckit/...` and no `.opencode/commands/spec_kit/...` command directory. The command file itself advertises `/speckit:re... | No extra recommendation captured; use iteration findings. |
| 056 | complete | Local impact analysis should use `detect_changes` as a read-only diff preflight, not as an implementation step: the feature maps unified diff hunks to structural symbols through line-range overlap and explicitly refuses stale,... | No extra recommendation captured; use iteration findings. |
| 057 | complete | Prior 027 research already split the bundled Coco extras from the memory curator: Coco few-shot exemplars belong in 028, while LLM-curated `memory_context` is a 027 memory-backend concern that attaches `data.curatedContext` and... | No extra recommendation captured; use iteration findings. |
| 058 | complete | Phase 007 already makes the key safety decision: lexical matching remains primary, semantic recall is a feature-flagged fallback, semantic-only hits are source-tagged and reduced-activation, and the master flag defaults off wit... | keep lexical-first default-off hybrid design; add resumable backfill contract; require shadow telemetry promotion checklist |
| 059 | complete | Phase 008 is intentionally a phase parent, not a direct implementation packet; its root purpose is to coordinate reducer children only after correctness preconditions land, with all reducer behavior default-off and shadow-first... | gate on ledger quality; require shadow replay before live mutation; use consumer-specific live criteria |
| 060 | insight | The continuation packet explicitly defines iterations 040-060 as targeted revalidation questions, with 058 semantic trigger backfill/promote, 059 reducer telemetry gates, and 060 final synthesis at the end of the run. | keep 027 as focused phase-parent family; revise 007 and 008 with gates from 058 and 059; merge 049 with 058 and 050 with 059 |

### Decision Boundary

This continuation merge updates only the readable synthesis, normalized local state, and findings registry inside the artifact root. It does not modify source code, root/child specs, or old flat research outputs. Implementation decisions should consume this as evidence and then update the relevant phase packet through the normal spec-kit gates.
