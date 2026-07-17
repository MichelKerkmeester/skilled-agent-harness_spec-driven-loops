---
title: "136 -- Feature catalog annotation name validity"
description: "This scenario validates Feature catalog annotation name validity for `136`. It focuses on Verify all annotation names cross-reference against catalog H3 headings with 0 invalid."
version: 3.6.0.18
id: tooling-and-scripts-feature-catalog-annotation-name-validity
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 136 -- Feature catalog annotation name validity

## 1. OVERVIEW

This scenario validates Feature catalog annotation name validity for `136`. It focuses on Verify all annotation names cross-reference against catalog H3 headings with 0 invalid.

---

## 2. SCENARIO CONTRACT


- Objective: Verify all annotation names cross-reference against catalog H3 headings with 0 invalid.
- Real user request: `Please validate Feature catalog annotation name validity against the documented validation surface and tell me whether the expected signals are present: 0 invalid annotation names.`
- Prompt: `Validate Feature catalog annotation name validity against the documented validation surface and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: verify_alignment_drift.py or grep output shows 0 annotation names that fail to match an H3 heading in feature_catalog.md.
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: Sorted annotation list + H3 heading list + diff showing 0 invalid entries

---

## 3. TEST EXECUTION

### Prompt

```
Validate Feature catalog annotation name validity against the documented validation surface and report cited pass/fail evidence.
```

### Commands

1. Extract all unique annotation names from source-like files: `grep -rho --include='*.ts' --include='*.js' --include='*.mts' --include='*.mjs' "// Feature catalog: .*" .opencode/skills/system-spec-kit/mcp_server/ .opencode/skills/system-spec-kit/shared/ | sort -u`
2. Extract all H3 headings from `feature_catalog/FEATURE_CATALOG.md`: `grep "^### " FEATURE_CATALOG.md`
3. Cross-reference: every annotation name must match an H3 heading exactly
4. Report any mismatches

### Expected

0 invalid annotation names; every source-file `// Feature catalog:` value matches an H3 heading in the catalog.

### Evidence

Executed from repository root: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`.

Command 1, annotation extraction:

```console
$ grep -rho --include='*.ts' --include='*.js' --include='*.mts' --include='*.mjs' "// Feature catalog: .*" .opencode/skills/system-spec-kit/mcp_server/ .opencode/skills/system-spec-kit/shared/ | sort -u
// Feature catalog: 4-stage pipeline architecture
// Feature catalog: 4-stage pipeline refactor
// Feature catalog: 7-layer tool architecture metadata
// Feature catalog: ANCHOR tags as graph nodes
// Feature catalog: Ablation studies (eval_run_ablation)
// Feature catalog: Access-driven popularity scoring
// Feature catalog: Adaptive shadow ranking, bounded proposals, and rollback
// Feature catalog: Agent consumption instrumentation
// Feature catalog: Anchor-aware chunk thinning
// Feature catalog: Architecture boundary enforcement
// Feature catalog: Assistive reconsolidation
// Feature catalog: Async ingestion job lifecycle
// Feature catalog: Atomic-save parity and partial-indexing hints
// Feature catalog: Auto entity extraction
// Feature catalog: Auto-promotion on validation
// Feature catalog: BM25 trigger phrase re-index gate
// Feature catalog: Canonical ID dedup hardening
// Feature catalog: Causal chain tracing (memory_drift_why)
// Feature catalog: Causal edge creation (memory_causal_link)
// Feature catalog: Causal edge deletion (memory_causal_unlink)
// Feature catalog: Causal graph statistics (memory_causal_stats)
// Feature catalog: Causal neighbor boost and injection
// Feature catalog: Channel min-representation
// Feature catalog: Checkpoint creation (checkpoint_create)
// Feature catalog: Checkpoint delete confirmName safety
// Feature catalog: Checkpoint deletion (checkpoint_delete)
// Feature catalog: Checkpoint listing (checkpoint_list)
// Feature catalog: Checkpoint restore (checkpoint_restore)
// Feature catalog: Chunking Orchestrator Safe Swap
// Feature catalog: Classification-based decay
// Feature catalog: Co-activation boost strength increase
// Feature catalog: Co-activation fan-effect divisor
// Feature catalog: Confidence-based result truncation
// Feature catalog: Constitutional memory as expert knowledge injection
// Feature catalog: Content-aware memory filename generation
// Feature catalog: Core metric computation
// Feature catalog: Cross-document entity linking
// Feature catalog: Database and schema safety
// Feature catalog: Deferred lexical-only indexing
// Feature catalog: Dry-run preflight for memory_save
// Feature catalog: Dual-scope memory auto-surface
// Feature catalog: Duplicate-save no-op feedback hardening
// Feature catalog: Dynamic token budget allocation
// Feature catalog: Embedding cache
// Feature catalog: Embedding retry orchestrator
// Feature catalog: Encoding-intent capture at index time
// Feature catalog: Entity normalization consolidation
// Feature catalog: Evaluation database and schema
// Feature catalog: Feature flag governance
// Feature catalog: Folder-level relevance scoring
// Feature catalog: Graph and cognitive memory fixes
// Feature catalog: Graph calibration profiles and community thresholds
// Feature catalog: Graph lifecycle refresh
// Feature catalog: Guards and edge cases
// Feature catalog: Health diagnostics (memory_health)
// Feature catalog: Hierarchical scope governance, governed ingest, retention, and audit
// Feature catalog: HyDE (Hypothetical Document Embeddings)
// Feature catalog: Hybrid search pipeline
// Feature catalog: Implicit feedback log
// Feature catalog: Index-time query surrogates
// Feature catalog: Interference scoring
// Feature catalog: Known-item ground truth corpus
// Feature catalog: LLM query reformulation
// Feature catalog: Learned Stage 2 weight combiner
// Feature catalog: Learned relevance feedback
// Feature catalog: Learning history (memory_get_learning_history)
// Feature catalog: Lightweight consolidation
// Feature catalog: Lineage state active projection and asOf resolution
// Feature catalog: MPAB chunk-to-memory aggregation
// Feature catalog: Memory browser (memory_list)
// Feature catalog: Memory health autoRepair metadata
// Feature catalog: Memory indexing (memory_save)
// Feature catalog: Memory metadata update (memory_update)
// Feature catalog: Memory roadmap baseline snapshot
// Feature catalog: Memory summary search channel
// Feature catalog: Migration checkpoint scripts
// Feature catalog: Mutation hook result contract expansion
// Feature catalog: Mutation response UX payload exposure
// Feature catalog: Negative feedback confidence signal
// Feature catalog: Per-memory history log
// Feature catalog: Post-task learning measurement (task_postflight)
// Feature catalog: Pre-storage quality gate
// Feature catalog: Prediction-error save arbitration
// Feature catalog: Provenance-rich response envelopes
// Feature catalog: Quality proxy formula
// Feature catalog: Quality-aware 3-tier search fallback
// Feature catalog: Query complexity router
// Feature catalog: Query decomposition
// Feature catalog: Query expansion
// Feature catalog: RRF K-value sensitivity analysis
// Feature catalog: Real-time filesystem watching with chokidar
// Feature catalog: Reconsolidation-on-save
// Feature catalog: Reporting dashboard (eval_reporting_dashboard)
// Feature catalog: SHA-256 content-hash deduplication
// Feature catalog: Score normalization
// Feature catalog: Scoring observability
// Feature catalog: Semantic and lexical search (memory_search)
// Feature catalog: Session-manager transaction gap fixes
// Feature catalog: Shadow scoring with holdout evaluation
// Feature catalog: Shared post-mutation hook wiring
// Feature catalog: Signal vocabulary expansion
// Feature catalog: Single and folder delete (memory_delete)
// Feature catalog: Spec folder description discovery
// Feature catalog: Spec folder hierarchy as retrieval structure
// Feature catalog: Stage 3 effectiveScore fallback chain
// Feature catalog: Strict Zod schema validation
// Feature catalog: Synthetic ground truth corpus
// Feature catalog: System statistics (memory_stats)
// Feature catalog: Template anchor optimization
// Feature catalog: Temporal contiguity layer
// Feature catalog: Tier-based bulk deletion (memory_bulk_delete)
// Feature catalog: Tool-level TTL cache
// Feature catalog: Tool-result extraction to working memory
// Feature catalog: Transaction wrappers on mutation handlers
// Feature catalog: Trigger phrase matching (memory_match_triggers)
// Feature catalog: Typed-weighted degree channel
// Feature catalog: Unified context retrieval (memory_context)
// Feature catalog: Unified graph retrieval, deterministic ranking, explainability, and rollback
// Feature catalog: Validation feedback (memory_validate)
// Feature catalog: Validation signals as retrieval metadata
// Feature catalog: Verify-fix-verify memory quality loop
// Feature catalog: Watcher delete/rename cleanup
// Feature catalog: Weekly batch feedback learning
// Feature catalog: Working Memory Session Cleanup Timestamp Fix
// Feature catalog: Workspace scanning and indexing (memory_index_scan)
```

Command 2 exactly as written:

```console
$ grep "^### " FEATURE_CATALOG.md
grep: FEATURE_CATALOG.md: No such file or directory
```

Observed catalog location check:

```text
.opencode/skills/system-spec-kit/feature_catalog contains feature_catalog.md
Glob **/FEATURE_CATALOG.md returned only:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-click-up/feature_catalog/FEATURE_CATALOG.md
```

Supplemental cross-reference against the available system-spec-kit catalog file:

```console
$ comm -23 <(grep -rho --include='*.ts' --include='*.js' --include='*.mts' --include='*.mjs' "// Feature catalog: .*" .opencode/skills/system-spec-kit/mcp_server/ .opencode/skills/system-spec-kit/shared/ | sed 's/^\/\/ Feature catalog: //' | sort -u) <(grep "^### " .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md | sed 's/^### //' | sort -u)
Known-item ground truth corpus
```

### Pass / Fail

- **FAIL**: the documented H3 extraction command could not read `FEATURE_CATALOG.md`, and the supplemental cross-reference against the available system-spec-kit catalog produced 1 mismatch: `Known-item ground truth corpus`.

### Failure Triage

Inspect the extracted annotation comments and the catalog H3 headings if any names fail to match exactly.

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [tooling_and_scripts/feature_catalog_code_references.md](../../feature_catalog/tooling_and_scripts/feature_catalog_code_references.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 136
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `tooling_and_scripts/feature_catalog_annotation_name_validity.md`
