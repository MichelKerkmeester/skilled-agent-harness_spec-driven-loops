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
    last_updated_at: "2026-06-23T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Logged the 005 build, migration and flag-graduation phases"
    next_safe_action: "Track complete, twelve flags graduated and one deleted"
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
| 005 | `005-spec-data-quality/` | Spec-kit data-quality research that then shipped: 44 child phases spanning the go/no-go research scaffold, benchmark and generated-JSON bridge, generated-metadata build, full-repo JSON migration, flag-graduation benchmark and search-quality/evidence-gap wave | Complete |
| 006 | `006-review-remediation/` | Six-child review-remediation track: 001, 003, 005 and 006 executed, 002 and 004 pending | Phase parent |
| 007 | `007-dark-flag-graduation/` | Twelve-child dark-flag graduation suite that benchmarked built-but-default-off capabilities, returned graduate, refine or cut verdicts and closed follow-up validation | Phase parent |
| 008 | `008-drift-audit-remediation/` | Fixed all 75 findings from a GPT-5.5-fast drift audit spanning this packet's other seven children (24 confirmed + 51 unverified, 42 directories corrected) | Complete |
| 009 | `009-drift-audit-deep-history-correction/` | Second-pass doc correction: git history shows the 4 code-gap findings from 008 were built, shadow-shipped, benchmarked and deliberately deleted for cause, not abandoned | Complete |
| 010 | `010-generated-metadata-status-integrity/` | Fixes a real deriveStatus defect (213 folders repo-wide already mislabeled `complete` from a doc's mere presence, not its content) and adds a report-mode-default `validate.sh --strict` rule catching the same class going forward | Complete |
| 011 | `011-create-sh-parent-corruption-fix/` | Fixes a deterministic create.sh bug where append-mode phase scaffolding overwrote an existing parent packet's `description.json` with the appended child's own metadata, and repairs the one confirmed already-corrupted packet | Complete |
| 012 | `012-derive-status-explicit-bypass-fix/` | Closes a second deriveStatus bypass an independent adversarial follow-up review found in phase 010's own shipped fix: an explicit `status: complete` claim returned immediately, ahead of the completion-evidence gate; also wires the MCP validation orchestrator's enforcement flag | Complete |
| 013 | `013-validate-sh-dist-freshness-and-repo-remediation/` | validate.sh dist-freshness enforcement and repo remediation, adopted from standalone packet 030 | In Progress |
| 014 | `014-manual-playbook-execution-sweep/` | Manual playbook execution sweep; findings-remediation waves 1-7 shipped with Phase-2 appendix items open, adopted from standalone packet 031 | In Progress |
| 015 | `015-deep-review-followup-hardening/` | Deep-review follow-up hardening; children 002-004 complete and 001 not started, adopted from standalone packet 032 | In Progress |

### Phase Transition Rules

- Children 001 through 004 are subsystem phase parents. Their direct child folders own implementation specs, plans, tasks and validation evidence.
- Child 000 is an executed release-cleanup phase parent. Its direct child folders record the cleanup, validation and drift-remediation scopes.
- Child 005 is the data-quality lineage. Its first 28 children remain the planned research scaffold and children 029 through 044 record the shipped benchmark, generated-metadata, migration and search-quality tail.
- Child 006 is the review-remediation rollup, with four executed children and two pending remediation contracts.
- Child 007 is the dark-flag graduation suite, with twelve benchmark, cleanup, validation, follow-up and review children.
- Children 013 through 015 were adopted from standalone packets 030 through 032 on 2026-07-03 by operator restructure.
- Research-only material from earlier rounds lives under subsystem `research/from-*` archives.
- Run strict validation on a child parent and its direct children before using it as an execution source.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| root | child parent | Select a child from 000 through 007 | Child `spec.md` lists all direct children or scoped docs |
| subsystem parent | implementation child | Select the next PENDING candidate group | Child `spec.md` names gate, scope and evidence |
| release cleanup parent | cleanup child | Inspect one executed cleanup or validation surface | Child `spec.md` and changelog name scope, evidence and follow-ups |
| implementation child | root | Child reaches strict validation green | `validate.sh <child> --strict` exits 0 |
| 009-drift-audit-deep-history-correction | 010-generated-metadata-status-integrity | Independent, not a continuation of 009's own scope; surfaced by an unrelated diagnostic review | Targeted 9-file suite green (108/108); full repo-wide suite deliberately stopped after root cause (unrelated serial-execution config) confirmed |
| 010-generated-metadata-status-integrity | 011-create-sh-parent-corruption-fix, 012-derive-status-explicit-bypass-fix | Independent findings, not continuations of 010's own scope; both surfaced by an unrelated adversarial follow-up review auditing 010's shipped fix and the create.sh scaffolding tool concurrently | Both phases: targeted suite green (test-phase-system.sh 8/8 for 011; 9-file/119-test suite for 012), zero new errors under `validate.sh --strict` (one pre-existing, cross-verified-unrelated `SECTION_COUNTS` warning documented in each phase's implementation-summary.md) |
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
