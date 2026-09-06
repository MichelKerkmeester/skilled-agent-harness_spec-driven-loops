---
title: "Feature Specification: Header tags, hook catch and script test fixes"
description: "Fixes the confirmed code-standards deviations from the runtime research: shell and script header tags normalized to the documented form, a silent hook catch made to report, a dead barrel removed, a comment-hygiene pointer replaced, and tests added for two untested CLI scripts."
trigger_phrases:
  - "shell header tag normalization"
  - "rule script component header"
  - "silent hook catch stderr"
  - "dead memory frontmatter barrel"
  - "quality audit script test"
  - "calculate completeness script test"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/028-header-tags-hook-catch-and-script-test-fixes"
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
# Feature Specification: Header tags, hook catch and script test fixes

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
| **Phase** | 28 of 28 |
| **Predecessor** | 027-doc-path-strict-mode-and-retired-capability-fixes |
| **Successor** | none |
| **Handoff Criteria** | Every confirmed row applied or decided, gates green, metadata regenerated |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 28** of the system-speckit v4 program: the remediation child for the research lane before it.

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
The runtime research confirmed 31 shell scripts and 7 module scripts with header tags the sk-code standards do not document, one hook that swallows every failure, one barrel nobody imports, one comment kept alive by a hygiene marker, and two public CLI scripts with no test at all.

### Purpose
Every mechanical row in `../026-runtime-code-standards-research/research/confirmed-findings.md` is applied, every judgment row has a decision recorded, and the two scripts have a happy-path and an edge test.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Normalize `# RULE:`, `# SPEC-KIT:` and `# SCRIPT:` shell headers to `# COMPONENT:` or `# SPECKIT:`, and `// SCRIPT:` module headers to `// MODULE:`
- Remove `runtime/cli/utils/memory-frontmatter.ts`
- Make the cursor completion-evidence response hook report a failure on stderr while staying fail-open
- State in the frontmatter-migration header why it keeps its own fence detection
- Replace the feature-catalog pointer comment in `shared/embeddings.ts` with the durable reason
- Add vitest coverage for `quality-audit.sh` and `calculate-completeness.sh`

### Out of Scope
- Consolidating the four repo-root resolvers - a behavior change in a security-adjacent primitive; recorded as a follow-up
- Renaming the legacy `test-*` node suites - they are wired by package scripts, not a glob
- Changing the documented doctor exit codes - they are the script's own documented contract

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `runtime/cli/rules/*.sh` (27), `runtime/cli/spec/*.sh` (3), `runtime/cli/kpi/quality-kpi.sh` | Modify | Header tag |
| `runtime/cli/retrieval/*.mjs` (6), `runtime/cli/evals/run-phase2-closure-metrics.mjs` | Modify | Header tag |
| `runtime/cli/utils/memory-frontmatter.ts` | Delete | Barrel with no importer |
| `runtime/hooks/cursor/completion-evidence-response.mjs` | Modify | Report failures |
| `runtime/cli/lib/frontmatter-migration.ts` | Modify | Header rationale |
| `shared/embeddings.ts` | Modify | Comment |
| `runtime/cli/tests/quality-audit-script.vitest.ts` | Create | Happy path and edge test |
| `runtime/cli/tests/calculate-completeness-script.vitest.ts` | Create | Happy path and edge test |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No shell script under `runtime/cli` carries a `# RULE:`, `# SPEC-KIT:` or `# SCRIPT:` header, and no module script carries `// SCRIPT:` |
| REQ-002 | The two new test files pass, and the CLI typecheck stays clean after the barrel removal |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The hook still exits clean on failure and writes one stderr line |
| REQ-004 | Every judgment row in the confirmed table has its decision recorded in the implementation summary |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `grep` for the retired header tags under `runtime/cli` returns nothing
- **SC-002**: The two new vitest files pass and the CLI project typecheck exits 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A tool parses the `# RULE:` tag | Low | ripgrep found no consumer before the change |
| Risk | A test depends on the deleted barrel | Low | ripgrep found no importer; typecheck confirms |
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
