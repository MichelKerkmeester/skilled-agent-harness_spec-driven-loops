---
title: "Feature Specification: Repo-wide comment-hygiene scrub"
description: "The extended comment-hygiene checker from 024 surfaced a repo-wide backlog of perishable artifact labels in live code comments. This packet scrubs the live skill, bin, and plugin code to durable WHY."
trigger_phrases:
  - "repo-wide comment hygiene scrub"
  - "perishable label backlog"
  - "ADR REQ DR packet label cleanup"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/025-repo-wide-comment-hygiene-scrub"
    last_updated_at: "2026-06-07T21:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Three gpt-5.5 agents scrubbed 40 live-code files; all clean under the checker"
    next_safe_action: "Reconcile docs, commit and push"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/scripts/check-comment-hygiene.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-025-repo-wide-comment-hygiene-scrub"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Repo-wide comment-hygiene scrub

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-06-07 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 024 extended the comment-hygiene checker to catch `RC-N`, single-number `DR-N`, hyphen `phase-NNN`, and `P#-Seat#` labels, and it scrubbed only the daemon-reliability files. A repo-wide measurement then found about ninety more perishable labels in live code comments across the skills, bin, and plugin code. These rot after packet renumbering and defeat the very rule the checker enforces.

### Purpose
Scrub the live-code perishable-label backlog so the extended checker reports clean across the reusable codebase, keeping every comment's durable reason and dropping only the perishable identifier.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Scrub perishable labels from comments in 40 live-code files under `.opencode/skills`, `.opencode/bin`, and `.opencode/plugins`.
- Rewrite each flagged comment to keep its technical meaning and drop the label.
- Verify every file returns clean from the extended checker.

### Out of Scope
- `z_archive/**` and `scratch/**` - frozen or throwaway content.
- `benchmarks/**`, `fixtures/**`, `eval-rig/**` - test fixtures.
- `.opencode/specs/**` packet-local scripts and evidence - quasi-frozen artifacts.
- The pattern-defining tools (`ephemeral-pointer-audit.mjs`, the checker and its test) - they contain the labels as data by design.
- `F\d+` notation - excluded from the checker because of its false-positive rate.
- git pre-commit wiring - deferred until the broader tree settles.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| 16 files under `skills/system-spec-kit/{mcp_server,shared,scripts}` | Modify | Comment-only label scrub |
| 12 files under `skills/system-code-graph`, `skills/system-skill-advisor`, `bin`, `plugins` | Modify | Comment-only label scrub |
| 12 files under `skills/{deep-review,deep-research,deep-improvement,deep-loop-runtime,sk-code,sk-doc}` | Modify | Comment-only label scrub |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Live-code files clean under the checker | All 40 cluster files return exit 0 from `check-comment-hygiene.sh` |
| REQ-002 | Comment-only edits | `git diff` shows only comment-line changes; syntax checks pass for every edited file |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Meaning preserved | Each rewritten comment retains its technical reason; string literals such as test names are untouched |
| REQ-004 | Scope discipline | No file outside the 40-file cluster set is modified |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The extended checker reports zero violations across the 40 live-code files.
- **SC-002**: Every edited file passes its syntax check and no code, logic, or test assertion changed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Over-trimming a comment | Loss of a factual detail beyond the label | Spot-check diffs; keep the technical reason |
| Risk | Editing a string literal | Changing a test name or behavior | Instruct agents to edit comments only; checker never flags strings |
| Risk | Concurrent-session edits | Conflict on a shared file | Comment-only edits are low-conflict; commit scoped |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime behavior changes, so no performance impact.
- **NFR-P02**: The checker continues to run in well under a second per file.

### Security
- **NFR-S01**: No security surface is touched; comments only.
- **NFR-S02**: No secrets or credentials are added or exposed.

### Reliability
- **NFR-R01**: The extended checker is the deterministic verification gate.
- **NFR-R02**: Syntax checks confirm no edited file was broken.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a file with no flagged comment is left untouched.
- Maximum length: long multi-line comments keep their continuation lines.
- Invalid format: a string literal that resembles a label is not a comment and is skipped.

### Error Scenarios
- External service failure: not applicable; all local.
- Network timeout: not applicable.
- Concurrent access: three agents ran on disjoint clusters, so no write conflict.

### State Transitions
- Partial completion: an unfinished cluster shows up as a still-dirty checker exit and is re-run.
- Session expiry: not applicable.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 40 files, comment-only, ~94 labels |
| Risk | 6/25 | No code or behavior change |
| Research | 6/20 | Blast radius and exclusions measured up front |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None outstanding; the excluded scopes and the deferred pre-commit wiring are recorded decisions.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
