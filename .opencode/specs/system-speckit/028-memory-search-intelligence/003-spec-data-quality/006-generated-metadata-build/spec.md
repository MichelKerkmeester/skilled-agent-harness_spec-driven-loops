---
title: "Feature Specification: Generated-Metadata Build Phase Parent"
description: "Generated-Metadata Build subgroup of the spec-data-quality track: the generated-metadata build, full-repo migration, flag-graduation benchmark and search-quality/evidence-gap wave."
trigger_phrases:
  - "generated metadata build"
  - "spec data quality generated-metadata build"
  - "generated-metadata build phase parent"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/003-spec-data-quality/006-generated-metadata-build"
    last_updated_at: "2026-07-04T17:11:45.435Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Grouped the generated-metadata build phases under one subparent during the 005 restructure"
    next_safe_action: "None — subgroup complete"
    blockers: []
    key_files:
      - "spec.md"
      - "033-identity-resolver-merge-safety/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-27-028-005-006-generated-metadata-build-parent"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The generated-metadata build phases are grouped under this subparent (12 children)."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Generated Metadata Build

Groups generated-metadata build phases for identity resolution, scoped backfill, idempotent writes, validator statuses, synopsis extraction, hardening, migration, benchmark graduation, search quality fixes, ranking benchmarks, threshold calibration, and evidence-gap handling.

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../005-shared-engine-and-research/spec.md |
| **Successor** | ../007-metadata-rename-reconciliation/spec.md |

## PHASE DOCUMENTATION MAP

| Child | Description |
|-------|-------------|
| `033-identity-resolver-merge-safety/` | Identity Resolver Merge Safety |
| `034-scoped-backfill-boundary/` | Scoped Backfill Boundary |
| `035-idempotent-writes-cache-upsert/` | Idempotent Writes Cache Upsert |
| `036-metadata-validator-status-enum/` | Metadata Validator Status Enum |
| `037-drift-gate-synopsis-extractor/` | Drift Gate Synopsis Extractor |
| `038-generator-hardening/` | Generator Hardening |
| `039-full-repo-json-migration/` | Full Repo Json Migration |
| `040-flag-graduation-benchmark/` | Flag Graduation Benchmark |
| `041-search-quality-fixes/` | Search Quality Fixes |
| `042-deterministic-ranking-benchmark/` | Deterministic Ranking Benchmark |
| `043-gap-threshold-calibration-benchmark/` | Gap Threshold Calibration Benchmark |
| `044-relevance-aware-evidence-gap/` | Relevance Aware Evidence Gap |
