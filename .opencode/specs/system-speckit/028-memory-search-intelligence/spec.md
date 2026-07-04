---
title: "Feature Specification: Memory Search Intelligence Phase Parent"
description: "Phase parent for the eight release, subsystem, data-quality, remediation and dark-flag tracks."
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
    packet_pointer: "system-spec-kit/028-memory-search-intelligence"
    last_updated_at: "2026-07-04T16:42:01.468Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "016 deep-dive program complete (13/13 shipped); 006/002+006/004 absorbed"
    next_safe_action: "016 complete; daemon-side captures pending a daemon restart"
    blockers: []
    key_files:
      - "spec.md"
      - "research/roadmap.md"
      - "001-speckit-memory/research/merged-research-index.md"
      - "001-speckit-memory/spec.md"
      - "002-code-graph/spec.md"
      - "003-skill-advisor/spec.md"
      - "004-deep-loop/spec.md"
      - "000-release-cleanup/spec.md"
      - "005-spec-data-quality/SUMMARY.md"
      - "006-review-remediation/spec.md"
      - "007-dark-flag-graduation/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-memory-search-intelligence-parent"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Children 001-004 record their implementation child maps."
      - "Child 000 defines release-cleanup scope only."
      - "Earlier research-only rounds live in subsystem research archives."
      - "Adopted standalone packets 030, 031 and 032 as children 013, 014 and 015."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Memory Search Intelligence Phase Parent

## How to read this packet

Use this root `spec.md` as the current phase map. Use `changelog/README.md`, `before-vs-after.md`, `feature-flags.md` and `benchmark-status.md` as the current navigation and evidence set. Treat `archive/handover.md` and `archive/review-report.md` as historical continuity, `archive/implementation-schedule.md` as historical scheduling, and `timeline.md` as the chronological record.

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
Packet 028 owns the planning record that turns external memory-system research into shipped retrieval intelligence, cleanup, review remediation, data-quality generation and dark-flag graduation work. Its top-level children span release cleanup, four subsystem phase parents, the spec-data-quality lineage, the review-remediation phase parent, the dark-flag graduation program and later hardening/adoption tracks so research inputs, candidate plans, cleanup scopes, child validation state and benchmark verdicts are easy to navigate. The kept-off flag-resolution, new-feature-research-build and reranker-research phases are nested under 001-speckit-memory as children 022 through 024, followed by the off-corpus eval gate, lexical-grounding floor, envelope-fidelity enforcement, scoring-hardening and substrate sandbox cleanup builds as children 025 through 029, and a 30th child, `030-opencode-temp-worker-reaping`, a planned scaffold not yet started.

### Purpose
Provide the root purpose, child map and cross-packet boundary for packet 028. This parent routes the release-cleanup, subsystem, data-quality, review-remediation, dark-flag and adopted hardening children to their current child maps.

> **Phase-parent note:** This `spec.md` is the only authored document at this parent level. Detailed planning lives in the child phase folders listed below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root-level routing for packet 028 phase parents and track roots.
- Phase-documentation map updates for children 000 through 007.
- Release-cleanup scope routing for every pre-release documentation surface.
- Merged research archive pointers for earlier research-only rounds.
- Adopted child routing for former standalone packets 030, 031 and 032.

### Out of Scope
- Rewriting adopted children beyond identity metadata and path references.
- Implementing any PENDING candidate.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `spec.md` | Modify | parent | Root purpose and child map |
| `description.json` | Refresh | parent | Search metadata for the parent |
| `graph-metadata.json` | Refresh | parent | Child identity and parent graph metadata |
| `001-speckit-memory/research/merged-research-index.md` | Create | 001 | Research archive routing index |
| `001-speckit-memory/spec.md` | Modify | 001 | Memory MCP subsystem phase-parent map |
| `002-code-graph/spec.md` | Modify | 002 | Code Graph subsystem phase-parent map |
| `003-skill-advisor/spec.md` | Modify | 003 | Skill Advisor subsystem phase-parent map |
| `004-deep-loop/spec.md` | Modify | 004 | Deep Loop subsystem phase-parent map |
| `000-release-cleanup/spec.md` | Create | 000 | Release-readiness documentation cleanup phase-parent map |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 000 | `000-release-cleanup/` | Release-readiness documentation sweep across repository doc surfaces | Phase parent |
| 001 | `001-speckit-memory/` | Spec-Kit Memory MCP research plus 30 child phases, including the kept-off-flag resolution, new-feature-research-build and reranker-research phases as 022 through 024, the off-corpus eval gate, lexical-grounding floor, envelope-fidelity enforcement, scoring-hardening and substrate sandbox cleanup builds as 025 through 029, and the OpenCode temp-worker reaping build as 030 | Phase parent |
| 002 | `002-code-graph/` | Code Graph research plus 8 implementation child plans | Phase parent |
| 003 | `003-skill-advisor/` | Skill Advisor research plus 8 implementation child plans | Phase parent |
| 004 | `004-deep-loop/` | Deep Loop Runtime research plus 6 implementation child plans | Phase parent |
| 005 | `005-spec-data-quality/` | Spec-kit data-quality research that then shipped: 49 child phases spanning the go/no-go research scaffold, benchmark and generated-JSON bridge, generated-metadata build, full-repo JSON migration, flag-graduation benchmark and search-quality/evidence-gap wave, plus five drift-audit, metadata-status-integrity and create.sh-corruption phases (045-049) re-nested here from top-level on 2026-07-04 | Complete |
| 006 | `006-review-remediation/` | Six-child review-remediation track: 001, 003, 005, 006 executed; 002 and 004 ABSORBED into 016 (verify-first-then-close, closed by phase 013 2026-07-04) | Phase parent |
| 007 | `007-dark-flag-graduation/` | Twelve-child dark-flag graduation suite that benchmarked built-but-default-off capabilities, returned graduate, refine or cut verdicts and closed follow-up validation | Phase parent |
| 016 | `016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/` | 13-phase remediation program for every P0/P1/P2 finding from the 2026-07-03 memory search deep dive; absorbs the Group-A flag cluster and the 006/002 + 006/004 scopes | Complete — 13/13 phases shipped + pushed 2026-07-04 (live-latency/eval/reconcile gates are daemon-side captures) |

### Phase Transition Rules

- Children 001 through 004 are subsystem phase parents. Their direct child folders own implementation specs, plans, tasks and validation evidence.
- Child 000 is an executed release-cleanup phase parent. Its direct child folders record the cleanup, validation and drift-remediation scopes.
- Child 005 is the data-quality lineage. Its first 28 children remain the planned research scaffold, children 029 through 044 record the shipped benchmark, generated-metadata, migration and search-quality tail, and children 045 through 049 are the drift-audit, metadata-status-integrity and create.sh-corruption phases re-nested here from top-level on 2026-07-04.
- Child 006 is the review-remediation rollup, with four executed children and two scopes (002/004) absorbed into the 016 program and closed 2026-07-04.
- Child 007 is the dark-flag graduation suite, with twelve benchmark, cleanup, validation, follow-up and review children.
- Children 013 through 015 were adopted from standalone packets 030 through 032 on 2026-07-03 by operator restructure.
- **Top-level ceiling (governance):** 028 has exactly eight canonical top-level phase-parent folders — 000 through 007. All new phase work nests as a child of one of them by subject; never create a new top-level `0NN-` folder. Folder 016 remains the last top-level exception, pending re-nest to `001-speckit-memory`; it is deferred while under active concurrent edit. The 016 program's ~13 cross-references into the absorbed ex-031 Group-A tracker now point at its new home `000-release-cleanup/015-manual-playbook-execution-sweep/001-findings-remediation`. Folders 013, 014 and 015 were re-nested on 2026-07-04 (013 to `005-spec-data-quality/050-validate-sh-dist-freshness-and-repo-remediation`, 014 to `000-release-cleanup/015-manual-playbook-execution-sweep`, 015 to `004-deep-loop/007-deep-review-followup-hardening`).
- Research-only material from earlier rounds lives under subsystem `research/from-*` archives.
- Run strict validation on a child parent and its direct children before using it as an execution source.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| root | child parent | Select a child from 000 through 007 | Child `spec.md` lists all direct children or scoped docs |
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
- **Child parents**: `000-release-cleanup/`, `001-speckit-memory/`, `002-code-graph/`, `003-skill-advisor/`, `004-deep-loop/`, `005-spec-data-quality/`, `006-review-remediation/`, `007-dark-flag-graduation/`
- **Merged research index**: `001-speckit-memory/research/merged-research-index.md`
- **Graph metadata**: `graph-metadata.json`
