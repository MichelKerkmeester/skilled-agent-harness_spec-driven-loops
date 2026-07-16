---
title: "Feature Specification: Fresh+Regression Deep-Review Remediation (Phase Parent)"
description: "Phase parent coordinating remediation of ALL 113 findings from the 027 fresh+regression deep-review, decomposed into 6 subsystem sub-phases (memory-storage, daemon-launcher, code-graph, CLI front-doors, spec-folder metadata, doc-truth/mirrors). Scaffold only — every finding carried as a task; no fixes applied."
trigger_phrases:
  - "fresh regression remediation"
  - "027 review round 3 remediation"
  - "remediate every deep-review finding"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/005-verification-and-remediation/005-fresh-regression-remediation"
    last_updated_at: "2026-06-16T00:00:00Z"
    last_updated_by: "deep-review-orchestrator"
    recent_action: "Decomposed remediation into 6 subsystem sub-phases; all 113 findings carried as tasks"
    next_safe_action: "Operator review; then implement sub-phases code-first (001-004) then docs (005-006)"
    blockers: []
    key_files:
      - "spec.md"
      - "fix-coverage.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-fresh-regression-remediation-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Fresh+Regression Deep-Review Remediation (Phase Parent)

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | Phase parent (control file) |
| **Priority** | P1 |
| **Status** | Scaffolded — 6 sub-phases created; no fixes applied |
| **Created** | 2026-06-16 |
| **Branch** | `system-speckit/028-xce-research-based-refinement` |
| **Parent Spec** | ../spec.md |
| **Sub-phases** | 6 |
| **Findings carried** | 113 (40 P1 / 73 P2) |
| **Handoff Criteria** | Every one of the 113 findings fixed-or-refuted-with-reason in its sub-phase; code phases (001-004) test-gated; doc/metadata phases (005-006) validate.sh --strict clean. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The 75-seat fresh+regression deep-review of the 027 epic surfaced 113 unique findings (0 P0 · 40 P1 · 73 P2) in `../../review/fresh-regression-75/deep-review-findings-registry.json`. Per operator directive, every finding must be addressed — refuted ones carried as hardening, asserted ones fixed as stated. This phase parent decomposes that work by subsystem so each sub-phase has a coherent verification gate, and tracks full coverage via `fix-coverage.json`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope**: all 113 findings, each assigned to exactly one sub-phase by `fix-coverage.json` (union = 113, no dupes, no orphans). Code-defect fixes (sub-phases 001-004) are test-gated; metadata/doc reconciliation (005-006) is validate.sh-gated.

**Out of scope**: new feature work; reopening prior epic-sweep findings; applying any fix during this scaffold step. The 3 Round-2-refuted findings are carried as hardening tasks (tagged) rather than dropped, per directive.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Sub-phase | Theme | Findings | Verification |
|-----------|-------|----------|--------------|
| `001-memory-storage-and-search` | mk-spec-memory write-path/search/save + advisor-lib code | 34 | vitest per fix; baseline→delta |
| `002-daemon-launcher-lifecycle` | launcher reclaim/reap/escalation, owner-lease, socket-server, fanout | 15 | vitest in isolated fake-root harness |
| `003-code-graph-robustness` | mk-code-index engine (db/query/context/bm25) | 8 | vitest per fix |
| `004-cli-frontdoor-safety` | the 3 bin CLIs + bridge (socket trust, exit codes, mutation gating) | 6 | vitest + shell exit-code assertions |
| `005-spec-folder-metadata-reconciliation` | description.json/graph-metadata/pointers/context-index | 8 | validate.sh --strict --recursive |
| `006-doc-truth-completion-and-mirrors` | completion claims, catalog/playbook, Gate B, benchmark, runtime mirrors | 42 | validate.sh --strict; cross-runtime diff |

Coverage is machine-checked in `fix-coverage.json`. Round-2 status is tagged per task (confirmed / downgraded→P2 / refuted-Round2→harden-anyway / asserted / P2).
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None at scaffold time. Each sub-phase confirms its asserted findings against the cited code before fixing (Round-2 refuted 3/16 code candidates, so assertion ≠ truth).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- Findings registry: `../../review/fresh-regression-75/deep-review-findings-registry.json`
- Round-2 verdicts: `../../review/fresh-regression-75/round2/code-verdicts.json`
- Coverage manifest: `./fix-coverage.json`
- Review report: `../../review/fresh-regression-75/review-report.md`
