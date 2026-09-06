---
title: "Feature Specification: Doc path, strict-mode and retired-capability fixes"
description: "Fixes the fourteen confirmed documentation mismatches from the docs-reality research: stale script paths, the wrong strict-mode semantics, retired memory capabilities described as live, phantom validator rule scripts and stale route and file counts."
trigger_phrases:
  - "strict mode warning semantics doc fix"
  - "phantom validator rule scripts"
  - "retired vector search docs cleanup"
  - "doctor route list correction"
  - "finalize dist path fix"
  - "cli sibling enumeration fix"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/027-doc-path-strict-mode-and-retired-capability-fixes"
    last_updated_at: "2026-09-06T10:25:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Authored the remediation planning documents"
    next_safe_action: "Apply the confirmed fixes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-v4-reality-research"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Doc path, strict-mode and retired-capability fixes

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-06 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 27 of 28 |
| **Predecessor** | 026-runtime-code-standards-research |
| **Successor** | 028-header-tags-hook-catch-and-script-test-fixes |
| **Handoff Criteria** | Every confirmed row applied or decided, gates green, metadata regenerated |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 27** of the system-speckit v4 program: the remediation child for the research lane before it.

**Scope Boundary**: only the files named by the confirmed findings table.

**Dependencies**:
- The confirmed findings table of the research lane
- The gates named in the plan

**Deliverables**:
- The fixes applied at the cited lines
- An implementation summary recording each judgment decision

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Fourteen confirmed mismatches in the system-spec-kit playbook, catalog and references send readers to paths that moved, describe warnings as strict-mode failures, present retired vector search, decay and re-indexing as live, and name four validator rule scripts that do not exist.

### Purpose
Every confirmed row in `../025-docs-reality-alignment-research/research/confirmed-findings.md` is fixed at its cited line, and the corrected text matches the runtime it describes.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite the strict-mode severity table and the completion-freshness note in `references/validation/validation-rules.md`, and the matching help line in `validate.sh`
- Repoint the finalize-dist, validate.sh and continuity paths in the playbook, README and phase definitions
- Replace phantom rule-script names with the real enforcement and remove the retired vector, decay and re-index descriptions
- Correct the doctor route list, the cli sibling enumeration, the check-links row and the README module counts

### Out of Scope
- Rewriting prose that is accurate but old-fashioned - the lane checked facts, not voice
- Changing runtime behavior to match a doc - where doc and code disagreed, the code was the truth in every confirmed row

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `references/validation/validation-rules.md` | Modify | Strict-mode and freshness semantics |
| `runtime/cli/spec/validate.sh` | Modify | Help text for `--strict` |
| `README.md` | Modify | Directory tree and counts |
| `references/structure/phase-definitions.md` | Modify | Validate path and rule-script list |
| `references/templates/level-selection-guide.md` | Modify | Remove the phantom section-counts rule |
| `references/workflows/execution-methods.md` | Modify | Drop the vector re-index save steps |
| `references/cli/memory-handback.md` | Modify | Six cli siblings |
| `references/config/environment-variables.md` | Modify | Inert `MEMORY_BASE_PATH` |
| `feature-catalog/**` (five files) | Modify | Description discovery, doctor routes, config contract, rule engine, template composition |
| `manual-testing-playbook/**` (two files) | Modify | Build path and recorded suite output |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every P1 row in the confirmed table is fixed at its cited line |
| REQ-002 | No fixed passage names a path, rule script or capability that does not exist in the runtime |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Every P2 row in the confirmed table is fixed |
| REQ-004 | The trigger index regenerates identically after the edits and the touched docs still validate as skill assets |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A ripgrep over the skill docs for the retired names (finalize-dist under cli, scripts/spec/validate, check-section-counts, check-anchors, check-template-headers, check-sections, vector database re-index) returns no live hits
- **SC-002**: The strict-mode sentence agrees with `orchestrator.ts` and with CLAUDE.md's completion rule
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A recorded playbook output block is rewritten to a suite that later changes | Low | The rewritten block names a rule that exists in the extended suite today |
| Dependency | Another session editing the same skill docs | Low | Commit by pathspec; only the confirmed files are touched |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The whole remediation runs in one session; no long-running job
- **NFR-P02**: The gates (tests, typecheck, validation) complete in minutes

### Security
- **NFR-S01**: No change widens a permission, a path root or an exit code contract
- **NFR-S02**: No credential or token is written anywhere

### Reliability
- **NFR-R01**: Every edit is asserted against the exact current text so a stale match fails loudly
- **NFR-R02**: Every change is one hunk in one file and reverts independently
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a confirmed row with no cited line is not applied
- Maximum length: not applicable
- Invalid format: a replacement whose anchor text no longer matches stops the script

### Error Scenarios
- External service failure: not applicable; everything is local
- Network timeout: not applicable
- Concurrent access: another session editing the same file is detected by the exact-text assertion

### State Transitions
- Partial completion: applied rows are committed by pathspec; the rest stay listed as open
- Session expiry: not applicable
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Many files, tiny hunks |
| Risk | 6/25 | Doc text and header tags; one hook line |
| Research | 4/20 | Done in the research lane |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None; every judgment row carries its decision in the implementation summary
<!-- /ANCHOR:questions -->
