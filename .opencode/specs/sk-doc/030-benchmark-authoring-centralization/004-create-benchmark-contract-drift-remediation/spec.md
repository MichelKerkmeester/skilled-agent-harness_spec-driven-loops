---
title: "Feature Specification: create-benchmark contract-drift remediation"
description: "A three-model GPT-5.6 SOL audit found create-benchmark structurally complete but its authoring templates describe an intended contract that drifts from the real deep-improvement / deep-alignment runtime. This packet fixes every confirmed finding, including two operator-approved runtime changes (D5 hard-fail exit, alignment budget cap)."
trigger_phrases:
  - "create-benchmark contract drift"
  - "benchmark template runtime alignment"
  - "d5 hard fail exit"
  - "alignment budget cap"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-benchmark-authoring-centralization/004-create-benchmark-contract-drift-remediation"
    last_updated_at: "2026-07-14T18:40:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "All fixes landed and verified; gates green"
    next_safe_action: "Commit and integrate to skilled/v4.0.0.0"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: create-benchmark contract-drift remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-14 |
| **Parent** | `sk-doc/017-benchmark-authoring-centralization` |
| **Parent Spec** | ../spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A three-model GPT-5.6 SOL audit of `sk-doc/create-benchmark` confirmed the packet is structurally complete (all five families present, packager PASS, zero broken links) but that its authoring templates and guides describe an intended contract that drifts from what the deep-improvement (Lane B) and deep-alignment runtime actually implement or accept. Following some instructions verbatim produces an artifact the runtime ignores or rejects: the reviewer-profile workflow is self-contradictory, the `5dim` scorer never reads the code-task oracle fields, the Lane B output contract names paths the runtime does not use, the skill-benchmark template claims D5 "hard-fails the run" while the runtime exits 0, and the behavior-benchmark scenario template emits invalid JSON. Two findings are genuine runtime gaps, not doc drift: the D5 structural gate does not hard-fail, and deep-alignment has no defined budget cap.

### Purpose
Every confirmed audit finding is fixed so create-benchmark's authoring surface tells the truth about the runtime, the two runtime gaps are closed (operator-approved), and the deep-alignment package's own stale pointers are reconciled — with no broken reference and no failing test.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Runtime (operator-approved):** make the skill-benchmark D5 structural gate exit non-zero; define an `alignment` budget cap in the shared behavior-benchmark framework.
- **create-benchmark docs:** reconcile the reviewer-profile workflow, the `5dim`-vs-oracle scoring claim, the Lane B output/path contract, the advertised-but-ineffective profile controls, the D5 wording, the underscore/hyphen dir prose, the Smart Router family coverage, README taxonomy, and stale section pointers.
- **behavior-benchmark templates:** fix the invalid JSON scaffold, the copy-relative link paths, the missing `fail_fast` enum value, the baseline provenance fields, and the budget-cap citations.
- **deep-alignment package:** reconcile its own stale section pointers and lifecycle (version/availability) drift surfaced incidentally by the audit.

### Out of Scope
- Re-architecting the Lane B scorer/sweep runtime beyond the two approved changes.
- Rewriting scoring/evaluator contracts (lane-owned).
- The broader repo hyphen migration (packet 017).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs` | Modify | D5 gate returns non-zero exit |
| `system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/**` | Modify | Cover the D5 exit-code change |
| `system-deep-loop/shared/behavior-benchmark/framework.md` | Modify | Define the `alignment` budget cap |
| `system-deep-loop/shared/behavior-benchmark/tests/**` | Modify | Cover the cap if code-enforced |
| `sk-doc/create-benchmark/SKILL.md`, `README.md`, `references/**`, `assets/**`, `changelog/**` | Modify | Reconcile the doc-drift findings |
| `system-deep-loop/deep-alignment/behavior_benchmark/**` | Modify | Reconcile stale pointers + lifecycle |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | D5 structural gate hard-fails | `run-skill-benchmark.cjs` exits non-zero (code 3) when the D5 connectivity gate blocks the verdict; a test proves the exit code; the readme template wording matches |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Alignment budget cap defined | `framework.md` gives `alignment` an explicit cap (1500000 ms); templates + DAB citations agree |
| REQ-003 | Reviewer-profile workflow non-contradictory | SKILL.md + profile template agree that reviewer fixtures route to the lane-owned reviewer path, not a standard `5dim/pattern` profile |
| REQ-004 | Lane B scoring + output contract accurate | Docs state that the code-task oracle is scored on the sweep/`scoreCodeTask` path (not `run-benchmark 5dim`), and the real output paths/artifacts per run/sweep/reviewer path |
| REQ-005 | behavior-benchmark scaffold valid | Scenario template produces parseable JSON for natural/halt cells; index/baseline templates use copy-relative links + provenance + full enum |
| REQ-006 | Stale pointers reconciled | No stale `§12`/`§2`/`NEVER #5b` pointer, no "directory names use underscores" generalization, no phantom taxonomy in create-benchmark or the deep-alignment index |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `package_skill.py --check create-benchmark` stays PASS; SKILL.md stays under the 5000-word hard gate.
- **SC-002**: The touched Lane B / behavior-benchmark / skill-benchmark vitest suites pass, including a new D5 exit-code assertion.
- **SC-003**: Repo-relative + markdown-link resolution for the touched areas shows 0 new broken references.
- **SC-004**: `validate.sh --strict` on this packet returns Errors 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | D5 exit-code change breaks a CI consumer expecting exit 0 | Med | New distinct code (3); documented; blast-radius grep for callers |
| Risk | Alignment cap value (1500000) is a judgment call | Low | Grounded in the baseline's own "900k too low" note; matches ai-council/improvement |
| Dependency | Doc fixes must reflect the post-change runtime truth | — | Runtime changes land + verify BEFORE doc agents describe them |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: No existing behavior-benchmark / skill-benchmark / Lane B test regresses.
- **NFR-R02**: Frozen historical run-report artifacts remain byte-identical.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Template placeholders (`{{...}}`, `./SOURCE.md`) are not broken links and stay.
- A finding that targets the deep-alignment package (not create-benchmark) is fixed in that package, not copied into a template.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | 4 skill areas, docs + two runtime changes + tests |
| Risk | 10/25 | Runtime exit-code + cap changes with consumers |
| Research | 8/20 | Audit + runtime reading already done |
| **Total** | **33/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None open; spec folder and the runtime-vs-docs direction were operator-resolved.
<!-- /ANCHOR:questions -->
