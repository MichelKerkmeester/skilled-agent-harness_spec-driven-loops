---
title: "Feature Specification: Memory Search Intelligence Phase Parent"
description: "Phase parent for the six release, memory-engine, data-quality, remediation, dark-flag and surface-alignment tracks."
trigger_phrases:
  - "028 memory search intelligence"
  - "external memory systems research"
  - "galadriel aionforge mining"
  - "memory retrieval improvements"
  - "028 implementation phase parent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence"
    last_updated_at: "2026-07-06T17:33:25.530Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Renumbered 028 top-level to a contiguous 000-005"
    next_safe_action: "Commit and push to origin/028"
    blockers: []
    key_files:
      - "spec.md"
      - "context-index.md"
      - "research/roadmap.md"
      - "001-speckit-memory/research/merged-research-index.md"
      - "001-speckit-memory/spec.md"
      - "000-release-cleanup/spec.md"
      - "002-spec-data-quality/SUMMARY.md"
      - "003-review-remediation/spec.md"
      - "004-dark-flag-graduation/spec.md"
      - "005-speckit-surface-alignment/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-memory-search-intelligence-parent"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Top-level children are a contiguous 000 through 006 after the subsystem extraction."
      - "Child 000 defines release-cleanup scope only."
      - "Earlier research-only rounds live in subsystem research archives."
      - "Code-graph, skill-advisor and deep-loop runtime work moved to their own sibling packets."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Memory Search Intelligence Phase Parent

## How to read this packet

Use this root `spec.md` as the current phase map. Use `changelog/README.md`, `before-vs-after.md`, `feature-flags.md` and `benchmark-status.md` as the current navigation and evidence set. Treat `context-index.md` as the migration bridge and consolidated work summary, `archive/handover.md` and `archive/review-report.md` as historical continuity, `archive/implementation-schedule.md` as historical scheduling, and `timeline.md` as the chronological record.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | complete|
| **Created** | 2026-06-16 |
| **Updated** | 2026-06-19 |
| **Parent Spec** | `../description.json` |
| **Parent Packet** | `system-spec-kit` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 028 owns the planning record that turns external memory-system research into shipped retrieval intelligence, release cleanup, review remediation, data-quality generation, dark-flag graduation and surface-alignment work. After the 2026-07-07 subsystem extraction its top-level children were a contiguous 000 through 005: release cleanup, the memory-search engine, the spec-data-quality lineage, the review-remediation track, the dark-flag graduation program and the surface-alignment remediation. Eighteen further review-remediation children, `006` through `023`, were added on 2026-07-10 (presentation-layer fixes, search-index integrity, metadata-rename reconciliation, validation-gate hardening, query-channel calibration, drift self-healing, orphan-sweep safety, drift-marker resilience, self-healing hardening, validation-hardening fixes, flag governance and consolidation, git-hooks reinstall, validation-enforce graduation, and the query-time-filter, graph-preservation, drift-marker-native and self-healing-model benchmarks/consolidations), so research inputs, candidate plans, cleanup scopes, child validation state and benchmark verdicts are easy to navigate. The kept-off flag-resolution, new-feature-research-build and reranker-research phases are nested under `001-speckit-memory` as children 022 through 024, followed by the off-corpus eval gate, lexical-grounding floor, envelope-fidelity enforcement, scoring-hardening and substrate sandbox cleanup builds as children 025 through 029, and a 30th child, `030-opencode-temp-worker-reaping`, a planned scaffold not yet started.

### Purpose
Provide the root purpose, child map and cross-packet boundary for packet 028. After the 2026-07-07 subsystem extraction, 028 is scoped to the **memory-search engine** (`001-speckit-memory`) and **spec data-quality** (`002-spec-data-quality`), plus release-cleanup, review-remediation, the dark-flag/surface-alignment programs, and the 006-023 review-remediation children added 2026-07-10. The code-graph, deep-loop and skill-advisor subsystems (including the held `002-skill-advisor` follow-up removed on 2026-07-07) were extracted to their own sibling packets — see `context-index.md` for the full migration record and a consolidated summary of the memory-search and data-quality work.

> **Phase-parent note:** This `spec.md` is the only authored document at this parent level. Detailed planning lives in the child phase folders listed below. The migration bridge and work summary live in `context-index.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root-level routing for packet 028 phase parents and track roots.
- Phase-documentation map for children 000 through 023.
- Release-cleanup scope routing for every pre-release documentation surface.
- Merged research archive pointers for earlier research-only rounds.
- Cross-packet boundary to the extracted code-graph, skill-advisor and deep-loop siblings.

### Out of Scope
- Rewriting child folders beyond identity metadata and path references.
- Implementing any PENDING candidate.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `spec.md` | Modify | parent | Root purpose and child map |
| `description.json` | Refresh | parent | Search metadata for the parent |
| `graph-metadata.json` | Refresh | parent | Child identity and parent graph metadata |
| `context-index.md` | Modify | parent | Migration bridge and consolidated work summary |
| `001-speckit-memory/spec.md` | Modify | 001 | Memory-search engine subsystem phase-parent map |
| `000-release-cleanup/spec.md` | Modify | 000 | Release-readiness documentation cleanup phase-parent map |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 000 | `000-release-cleanup/` | Release-readiness documentation sweep across repository doc surfaces | Phase parent |
| 001 | `001-speckit-memory/` | Spec-Kit Memory MCP research plus roughly 30 child phases, including the kept-off-flag resolution, new-feature-research-build and reranker-research phases as 022 through 024, the off-corpus eval gate, lexical-grounding floor, envelope-fidelity enforcement, scoring-hardening and substrate sandbox cleanup builds as 025 through 029, the OpenCode temp-worker reaping build as 030, and the 016 deep-dive remediation program at `031-fix-deep-dive-p0-p2-findings-for-mk-spec-memory` | Phase parent |
| 002 | `002-spec-data-quality/` | Spec-kit data-quality research that then shipped: child phases spanning the go/no-go research scaffold, benchmark and generated-JSON bridge, generated-metadata build, full-repo JSON migration, flag-graduation benchmark and search-quality/evidence-gap wave, plus the drift-audit, metadata-status-integrity and create.sh-corruption phases (045-049) re-nested here from top-level on 2026-07-04; the re-nested validate.sh dist-freshness phase parent (050), also moved from top-level on 2026-07-04, In Progress; and the spec-metadata integrity phases (051-053), authored directly here on 2026-07-06 (never top-level, never re-nested), individually In Progress | Complete |
| 003 | `003-review-remediation/` | Six-child review-remediation track (`001-eval-benchmark-fidelity` through `006-review-record-packet-type`); the `002-memory-schema-and-concurrency` and `004-p2-triage` closures were absorbed into the 016 deep-dive program on 2026-07-04 | Phase parent |
| 004 | `004-dark-flag-graduation/` | Eight-child dark-flag graduation suite that benchmarked built-but-default-off capabilities, returned graduate, refine or cut verdicts and closed follow-up validation and a deep review | Phase parent |
| 005 | `005-speckit-surface-alignment/` | Five-child surface-alignment remediation: false-now doc corrections, stress-doc fixes, the stress-and-skill.md audit, recorded-failure closure and manual-test verification | Phase parent |
| 006 | `006-presentation-layer-fixes/` | Breadcrumb suppression, result-floor and field-shape parity fixes for the search presentation layer | Implemented, with broad-suite caveat documented in `implementation-summary.md` |
| 007 | `007-search-index-integrity-sweep/` | Search-index integrity sweep for `memory_index` + `vec768` backend drift against the on-disk spec corpus | Core DB sweep already applied; verification blocked |
| 008 | `008-metadata-rename-reconciliation/` | Two generator bugs reconciled on top of the shipped identity resolver | Complete |
| 009 | `009-validation-integrity-hardening/` | Closed four gaps that let bad spec-folder data pass `validate.sh --strict` clean | Shipped |
| 010 | `010-query-channel-calibration/` | Query-complexity routing calibration and channel-usage visibility | Implemented, verification-limited |
| 011 | `011-automatic-drift-self-healing/` | Wiring drift self-healing to run without a human-typed command | In Progress |
| 012 | `012-orphan-sweep-scoped-scan-safety/` | Orphan-sweep time budget and scoped-scan discovery-gate parity | Implemented |
| 013 | `013-drift-marker-pipeline-resilience/` | Git-hook lock stale-lock recovery and drift-marker producer/consumer resilience | Complete |
| 014 | `014-self-healing-internals-hardening/` | Self-healing internals hardening, including the synchronous drift-suspect write on the search hot path | Implemented |
| 015 | `015-validation-hardening-fixes/` | Evidence-substance checker, status classifier and freshness-baseline fixes | Implemented, with 2 out-of-scope findings flagged for operator review |
| 016 | `016-cross-package-flag-governance/` | Reconciled two homes for new feature flags with opposite default polarity | Complete |
| 017 | `017-flag-vocabulary-consolidation/` | Consolidated hand-rolled flag vocabularies across `capability-flags.ts` and consuming modules | Complete |
| 018 | `018-git-hooks-reinstall-and-guard/` | Git hooks reinstall and presence guard | Complete |
| 019 | `019-validation-enforce-graduation/` | Graduated 3 validation rules from advisory to enforcing-by-default (status cross-doc, metadata disk-path, child drift) | Complete |
| 020 | `020-query-time-filter-benchmark/` | Query-time existence filter benchmark and hardening | Completed |
| 021 | `021-graph-preservation-quality-benchmark/` | Graph-preservation quality benchmark for routing-affecting flags | Complete |
| 022 | `022-drift-marker-native-consolidation/` | Native consolidation of the git-hooks drift-marker detection script | Complete |
| 023 | `023-self-healing-model-consolidation/` | Consolidated the three-layer self-healing system's model | Complete |

Children 006 through 023 were added on 2026-07-10 as review-remediation follow-ups; each is a leaf implementation packet (its own `spec.md`/`plan.md`/`tasks.md`/`implementation-summary.md`), not a phase parent. Statuses above are read directly from each child's `spec.md` METADATA table.

The held skill-advisor follow-up (formerly `002-skill-advisor/`, holding only `001-hard-rule-and-dispatch-preflight-hardening` after its runtime phases were extracted on 2026-07-06) moved to `system-skill-advisor/011-skill-advisor-phase-parent/` on 2026-07-07.

### Phase Transition Rules

- Child 000 is an executed release-cleanup phase parent. Its direct child folders record the cleanup, validation and drift-remediation scopes.
- Child 001 is the memory-search engine. Its direct child folders own the research, build and 016 deep-dive remediation specs, plans, tasks and validation evidence.
- Child 002 is the data-quality lineage. Its earliest children remain the planned research scaffold, the middle children record the shipped benchmark, generated-metadata, migration and search-quality tail, children 045 through 050 are the drift-audit, metadata-status-integrity, create.sh-corruption and validate.sh dist-freshness phases re-nested here from top-level on 2026-07-04, and children 051 through 053 are spec-metadata integrity phases authored directly here on 2026-07-06 (never top-level, never re-nested), each currently In Progress.
- Child 003 is the review-remediation track, with six children; the `002` and `004` closures were absorbed into the 016 deep-dive program and closed 2026-07-04.
- Child 004 is the dark-flag graduation suite, with eight benchmark, cleanup, validation, follow-up and review children.
- Child 005 is the surface-alignment remediation, with five doc-correction, fix, audit, recorded-failure-closure and manual-test-verification children.
- Children 006 through 023 are the review-remediation follow-ups added 2026-07-10 (presentation-layer fixes, search-index integrity, metadata-rename reconciliation, validation-gate hardening, query-channel calibration, drift self-healing, orphan-sweep safety, drift-marker resilience, self-healing hardening, validation-hardening fixes, flag governance/vocabulary, git-hooks reinstall, validation-enforce graduation, and the query-time-filter, graph-preservation, drift-marker-native and self-healing-model benchmarks/consolidations); each is a standalone leaf packet, not a phase parent.
- **Top-level ceiling (governance):** All new phase work nests as a child of an existing top-level folder by subject; never create a new top-level `0NN-` folder. On 2026-07-06 the code-graph and deep-loop phase-parents that had accreted here were extracted to their own sibling packets (`system-code-graph/`, `system-deep-loop/`), leaving `002-skill-advisor/` holding only the in-progress hard-rule follow-up (its runtime phases had already moved to `system-skill-advisor/`). On 2026-07-07 that held follow-up was extracted too, closing out 028's last skill-advisor remnant. 028 is now scoped to the memory-search engine (`001-speckit-memory`) and data-quality (`002-spec-data-quality`) plus release-cleanup, review-remediation (children 003 and 006-023) and the surface-alignment/dark-flag programs. Full migration record: `context-index.md`.
- Research-only material from earlier rounds lives under subsystem `research/from-*` archives.
- Run strict validation on a child parent and its direct children before using it as an execution source.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| root | child parent | Select a child from 000 through 023 | Child `spec.md` lists all direct children or scoped docs |
| subsystem parent | implementation child | Select the next PENDING candidate group | Child `spec.md` names gate, scope and evidence |
| release cleanup parent | cleanup child | Inspect one executed cleanup or validation surface | Child `spec.md` and changelog name scope, evidence and follow-ups |
| implementation child | root | Child reaches strict validation green | `validate.sh <child> --strict` exits 0 |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:wave-0-pointer -->
## 4. WAVE-0 DONE-EVIDENCE POINTER

The Wave-0 implementation record is the Wave-0 SHIPPED record for candidates already marked DONE in the 028 implementation child specs. It is intentionally separate from packet 028 and was not modified by this planning pass.
<!-- /ANCHOR:wave-0-pointer -->

---

<!-- ANCHOR:questions -->
## 5. OPEN QUESTIONS

- None for parent wiring. Candidate questions live in the subsystem child folders.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Roadmap**: `research/roadmap.md`
- **Migration bridge**: `context-index.md`
- **Child parents**: `000-release-cleanup/`, `001-speckit-memory/`, `002-spec-data-quality/`, `003-review-remediation/`, `004-dark-flag-graduation/`, `005-speckit-surface-alignment/`
- **Review-remediation leaf children**: `006-presentation-layer-fixes/` through `023-self-healing-model-consolidation/` — see the PHASE DOCUMENTATION MAP above for the full per-child list
- **Merged research index**: `001-speckit-memory/research/merged-research-index.md`
- **Graph metadata**: `graph-metadata.json`
