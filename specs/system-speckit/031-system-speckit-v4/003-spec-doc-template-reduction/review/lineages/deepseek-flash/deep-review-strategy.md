---
title: "Deep Review Strategy - Session Tracking"
trigger_phrases: []
---
# Deep Review Strategy - Session Tracking

## 1. OVERVIEW

### Purpose
Review the spec folder `specs/system-speckit/036-spec-doc-template-reduction` — a phase-parent packet (Level 2) with 6 child phase folders targeting spec-kit doc-template reduction (tasks/checklist merge, template dedup, continuity single-source, comment extraction, verify rollout). Impl is scaffold-only for the templates workstream; child specs are mixed scaffold (001) and authored drafts (002-006). Review covers correctness, security, traceability, maintainability across the parent + children + the template corpus they reference (templates/examples/level-1, level-2, references/templates).

### Usage
- Init state: created during initialization
- Per iteration: read Next Focus, review assigned dimension/files, write findings to iteration-NNN.md, update JSONL + strategy + registry
- Mutability: mutable, updated after each iteration

---

## 2. TOPIC
Review the 036-spec-doc-template-reduction packet for:
- Correctness: scaffold placeholders that never got replaced, phantom/duplicate requirement ids, malformed continuity metadata, internal contradictions between docs
- Security: trust boundaries of validator-consumed doc content, injection/marker handling, secrets exposure, path claims
- Traceability: spec_code (normative claims in 002-006 vs shipped templates/scripts/mcp-server), checklist_evidence (checked claims have evidence), parent phase-map vs child reality, manifest vs files
- Maintainability: template duplication/bloat (decision-record 138 lines, continuity ~227 lines, comment leakage 15.5%), small-model legibility, byte budgets, doc quality

---

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness — Logic, state transitions, edge cases, behavior against observable intent (iterations 1-2: scaffold-state defects + template corpus; verdict CONDITIONAL)
- [x] D2 Security — Trust boundaries, auth/authz, input handling, secrets exposure, exploit paths (iteration 3: no P0; F014 status-precedence P1, F013/F015 P2; no secrets, no injection)
- [x] D3 Traceability — Spec alignment, checklist evidence, cross-reference integrity, runtime parity (iterations 4-5, 7-9: spec_code partial [10 pass/2 fail], checklist_evidence FAIL [F018]; BLOCKER structural claims confirmed; overlays pass/partial) — DIMENSION COVERED
- [x] D4 Maintainability — Pattern compliance, documentation clarity, safe follow-on change cost (iteration 6: bloat measurements — F023 budgets infeasible, F024 dup estimate drift; comment leakage 19-52%/doc confirmed) — DIMENSION COVERED
<!-- MACHINE-OWNED: END -->

---

## 4. NON-GOALS
- Purely stylistic/cosmetic improvements without behavioral impact
- Performance tuning unless it intersects correctness or security
- Full end-to-end functional testing of the memory system or template renderer
- Review of the constitutional-memory deprecation workstream (native-fallback archive scope, not this lineage)

---

## 5. STOP CONDITIONS
- Max iterations reached (10, per stop-policy=max-iterations). Convergence before the ceiling is telemetry only; angles are broadened instead of synthesizing early.

---

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
[None yet]

| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| correctness (inventory) | CONDITIONAL (3 P1, 5 P2) | 1 | Scaffold-state audit: plans 002-006 un-authored, malformed continuity session ids, 001 spec placeholder with phantom REQs |
| correctness (template corpus) | CONDITIONAL (4 P1, 8 P2 cumulative) | 2 | Garbled example descriptions (F009); F002 root cause = create.sh:529,545 double-prefix; F007 confirmed at plan.md.tmpl:152; comment leakage + SCAFFOLD_VALIDATION_COUNTS residue |
| security | CONDITIONAL (5 P1, 10 P2 cumulative) | 3 | No P0; F014 deriveStatus tasks-suppression verified; F013 check-anchors env-sensitivity; F015 create.sh substitution fragility; no secrets/injection surfaces |
| traceability (spec_code sweep) | CONDITIONAL (6 P1, 11 P2 cumulative) | 4 | 9/11 claims verified pass; F017 decision-record 138-line premise stale (hard-gate fail); F016 resume-ladder path drift; checklist_evidence N/A |
| traceability (cross-doc consistency) | CONDITIONAL (8 P1, 14 P2 cumulative) | 5 | F018 false Completed claims; F020 graph children orphaned; F019 tasks scaffold; F021/F022 description pollution; checklist_evidence FAIL |
| maintainability (bloat measurements) | CONDITIONAL (8 P1, 16 P2 cumulative) | 6 | F023 budgets infeasible; F024 dup estimate drift; comment share measured 19-52%/doc corroborates phase 5 |
| stabilization (all dimensions) | CONDITIONAL (8 P1, 18 P2 final) | 10 | Adversarial replay upheld all 8 P1s; F009 evidence extended (systemic, 7+ docs); no P0; verdict CONDITIONAL |
<!-- MACHINE-OWNED: END -->

---

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 8 active (F001, F002, F003, F009, F014, F017, F018, F020)
- **P2 (Minor):** 18 active (F004-F008, F010-F013, F015, F016, F019, F021-F026)
- **Delta this iteration:** +0 P0, +0 P1, +0 P2 (stabilization pass — no new findings)
<!-- MACHINE-OWNED: END -->

---

## 8. WHAT WORKED
- Iteration 1: full-file reads of all 12 child spec/plan pairs exposed the scaffold-vs-authored asymmetry in one pass; comparing session_id/packet_pointer values across docs revealed the template-composition defect.

---

## 9. WHAT FAILED
- Iteration 1: description.json drift check produced no load-bearing finding (deferred to traceability); SCAFFOLD_VALIDATION_COUNTS consumer not yet identified (needs template/validator read).

---

## 10. EXHAUSTED APPROACHES (do not retry)
[Populated when a review approach has been tried from multiple angles without yielding new findings]

---

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
<!-- MACHINE-OWNED: START -->
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded
<!-- MACHINE-OWNED: END -->

---

## 11. RULED OUT DIRECTIONS
[Review angles that were investigated and definitively eliminated]

---

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
- Phase: synthesis COMPLETE — review-report.md written; verdict CONDITIONAL (8 P1, 18 P2)
- Operator next step: route to /speckit:plan per WS-1..WS-6 remediation lanes; 002 BLOCKER exact repro re-verification recorded as blocked check
<!-- MACHINE-OWNED: END -->

---

## 13. KNOWN CONTEXT

### Bounded Context Snapshot

**Target pointers:**
- Parent: `specs/system-speckit/036-spec-doc-template-reduction/spec.md` (Level 2 phase parent, 6 children, phase map with `[Phase N scope]` placeholders, status all "Pending")
- Children 001-006: spec.md (001 scaffold-only; 002-006 authored drafts), plan.md, tasks.md, implementation-summary.md
- Template corpus (goal-file-manifest scope): `templates/examples/level-1/{spec,plan,tasks,implementation-summary}.md`, `templates/examples/level-2/{spec,tasks,checklist,implementation-summary}.md`, `references/templates/{level-specifications,level-selection-guide}.md`
- Impl claims in 002-006 reference: `templates/manifest/*.md.tmpl`, `scripts/rules/check-anchors.sh`, `scripts/utils/template-structure.js`, `scripts/rules/check-ac-coverage.sh`, `scripts/tests/scaffold-golden-snapshots.vitest.ts`, `mcp-server/lib/graph/graph-metadata-parser.ts`, `mcp-server/lib/validation/orchestrator.ts`, `mcp-server/lib/validation/spec-doc-structure.ts`, `mcp-server/lib/graph/resume-ladder.ts`, `scripts/memory/generate-context.ts`

**Behavior claims to verify:**
- 002: check-anchors ANCHORS_VALID flags 9 base verification anchors while `compare` reports them optional (A/B-proven to tasks.md.tmpl change); deriveStatus ignores tasks.md checkboxes when checklist.md exists
- 003: decision-record.md.tmpl L3≡L3+ 138 identical lines; research.md.tmpl 948 lines widget taxonomy
- 004: _memory.continuity ~227 near-identical lines per L2 packet across 5 docs; only implementation-summary read by resume ladder
- 005: instructional comments = 15.5% of packet bytes (implementation-summary 43.6%); grep of SELF-CHECK/FAILURE-MODES finds no code consumer

**Reuse/convention pointers:**
- deep-review protocol: 4 dimensions, P0/P1/P2 severities, 9-section review-report, iteration-NNN.md + JSONL delta per iteration
- Prior lineage context: `review/_native-fallback-archive/` holds a prior native review attempt (different scope: two workstreams incl. constitutional-memory); do not duplicate its workstream-1 scope

**Risk areas / context gaps:**
- resource-map.md absent at init → resource-map coverage gate skipped (`resource-map.md not present. Skipping coverage gate`)
- Templates manifest dir exists but .tmpl files not yet read; example docs under templates/examples may differ from manifest templates
- `goal-file-manifest.txt` header states impl is scaffold-only — distinguishes expected scaffold from unfinished authored work
- 002 spec carries an unresolved BLOCKER (check-anchors vs compare divergence) — the thread to pull for correctness/traceability
- Stale-graph caveat: Code Graph unavailable this session; cross-references verified by direct read only

**Out of scope:** constitutional-memory deprecation workstream, memory-system internals not referenced by 036 claims, any file outside the declared review scope.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | — | — |
| `checklist_evidence` | core | pending | — | — |
| `feature_catalog_code` | overlay | pending | — | — |
| `playbook_capability` | overlay | pending | — | — |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| 036/spec.md (parent) | — | — | — | pending |
| 001-analysis/{spec,plan,tasks,implementation-summary}.md | — | — | — | pending |
| 002-tasks-checklist-merge/{spec,plan}.md | — | — | — | pending |
| 003-template-dedup/{spec,plan}.md | — | — | — | pending |
| 004-continuity-single-source/{spec,plan}.md | — | — | — | pending |
| 005-comment-extraction/{spec,plan}.md | — | — | — | pending |
| 006-verify-rollout/{spec,plan}.md | — | — | — | pending |
| templates/examples/level-1/*.md (4 docs) | — | — | — | pending |
| templates/examples/level-2/*.md (4 docs) | — | — | — | pending |
| references/templates/level-specifications.md | — | — | — | pending |
| references/templates/level-selection-guide.md | — | — | — | pending |
| 036/description.json, graph-metadata.json, goal-file-manifest.txt | — | — | — | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 10
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Stop policy: max-iterations (early convergence treated as telemetry; angles broadened instead)
- Session lineage: sessionId=fanout-deepseek-flash-1787805958244-hkfwxl, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[feature_catalog_code, playbook_capability]
- Write surface: review/lineages/deepseek-flash ONLY — no writes outside this directory; no git/validate.sh/generate-context.js execution
- Started: 2026-08-27
<!-- MACHINE-OWNED: END -->
