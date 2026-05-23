---
title: "Spec: Arc 020 Spec Docs sk-doc Alignment"
description: "Level 2 packet for the final arc 021 sk-doc structure sweep across arc 020 child spec docs and selected runtime skill surfaces."
trigger_phrases:
  - "021 003 sk-doc arc 020 alignment"
  - "arc 020 spec docs sk-doc sweep"
  - "skill surface evergreen packet id check"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/021-fix-sk-doc-sk-code-alignment-and-3-remaining-deferred-p2/003-align-arc-020-spec-docs-with-sk-doc"
    last_updated_at: "2026-05-23T14:00:00Z"
    last_updated_by: "codex"
    recent_action: "Completed sk-doc sweep"
    next_safe_action: "Review and commit documentation-only packet if desired"
    blockers: []
    key_files:
      - "../020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/{001..006}/*.md"
      - ".opencode/skills/system-rerank-sidecar/SKILL.md"
      - ".opencode/skills/system-rerank-sidecar/README.md"
      - ".opencode/skills/*/scripts/doctor.sh"
    session_dedup:
      fingerprint: "sha256:0210030210030210030210030210030210030210030210030210030210030210"
      session_id: "021-003-sk-doc-arc-020-spec-sweep"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "User pre-approved this Level 2 folder, branch main, no commit, and read-only constraints outside drift fixes."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Arc 020 Spec Docs sk-doc Alignment

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-05-23 |
| **Branch** | `main` |
| **Parent** | `../spec.md` (021 sk-doc/sk-code alignment parent) |
| **Predecessor** | `../002-align-rerank-sidecar-cjs-and-sidecar-worker-with-sk-code/implementation-summary.md` |
| **Handoff Criteria** | Arc 020 child packets validate strictly; this packet validates strictly; 021 parent validates strictly |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Arc 020 closed the deferred-P2 behavior and API changes, but its child packet docs need a final sk-doc structure sweep before arc 021 can close. The risk is not runtime behavior; it is stale packet documentation that can weaken future memory retrieval and packet handoff quality.

### Purpose
Audit the arc 020 child spec docs for H2 casing, ADR evidence rows, mutable packet citations, anchor validity, and continuity frontmatter completeness. Also audit the selected skill surfaces for evergreen packet-ID hygiene and doctor script shell headers.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Arc 020 child markdown docs under `001-*` through `006-*`.
- Minimal H2 case fixes, ADR evidence row fills, and continuity frontmatter fills where actual drift exists.
- Runtime skill-surface evergreen audit for the two rerank sidecar docs and five doctor scripts listed by the user.
- Packet-local tally output at `scratch/sk-doc-sweep-tally.csv`.
- Packet docs, checklist evidence, ADR, implementation summary, description metadata, and graph metadata.

### Out of Scope
- Logic changes.
- Arc 010 through arc 019 packet docs.
- Skill docs outside the seven listed surfaces.
- Whole-file rewrites where a targeted fix is sufficient.
- Git commit, push, or branch mutation.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `<this-folder>/*.md` | Modify | Record Level 2 plan, tasks, evidence, ADR, and completion handoff |
| `<this-folder>/description.json` | Generate | Metadata for memory/spec graph visibility |
| `<this-folder>/graph-metadata.json` | Generate | Graph metadata for packet visibility |
| `<this-folder>/scratch/sk-doc-sweep-tally.csv` | Generate | Per-file sweep tally |
| `../020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/{001..006}/*.md` | Conditional modify | Minimal structure fixes only where drift is found |
| Listed skill surfaces | Conditional modify | Evergreen/header fixes only where drift is found |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve behavior | No logic files or executable shell behavior are changed |
| REQ-002 | Scaffold packet docs | Level 2 packet docs and metadata exist with canonical anchors |
| REQ-003 | Sweep arc 020 docs | All child docs are checked for H2 casing, ADR evidence, continuity fields, and stale citations |
| REQ-004 | Produce tally | `scratch/sk-doc-sweep-tally.csv` records every audited arc 020 child doc |
| REQ-005 | Sweep skill surfaces | Seven listed skill surfaces are checked for evergreen packet-ID and shell header rules |
| REQ-006 | Validate strictly | Arc 020 children, this packet, and the arc 021 parent validate with exit 0 |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Minimal fixes only | Changes are limited to drift categories found by the sweep |
| REQ-008 | Document decisions | Decision record captures the sweep outcome and alternatives |
| REQ-009 | Commit handoff | Implementation summary contains absolute paths and suggested commit text |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All in-scope arc 020 child H2 headings are sk-doc compliant.
- **SC-002**: ADR evidence rows and continuity required fields have no empty values.
- **SC-003**: Listed runtime skill docs contain no current-state mutable packet-ID violations.
- **SC-004**: Five doctor scripts have a bash shebang, `set -euo pipefail`, and `COMPONENT:` header.
- **SC-005**: Required strict validation commands exit 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Over-correcting closed packet docs | Medium | Apply only mechanical structure fixes and record categories in tally |
| Risk | Validation regression from heading edits | High | Run strict validation after edits and halt on first unexpected regression |
| Risk | Mutable packet IDs in runtime docs are historical rather than current state | Medium | Flag only genuinely stale runtime guidance, not valid predecessor citations in packet docs |
| Dependency | Arc 021/002 shipped | Low | User provided commit handoff context; this packet is the final child |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. User specified scope, verification gates, no-commit constraint, and drift handling rules.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: Packet evidence should let a later reviewer see exactly which docs changed and why.

### Reliability
- **NFR-R01**: Validation commands must be run from the repository root with strict mode.

### Security
- **NFR-S01**: Documentation updates must not expose secrets, tokens, raw payloads, or local private data beyond requested absolute paths in handoff.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Documentation Boundaries
- Arc 020 predecessor citations remain valid when they document packet history or evidence.
- Runtime skill docs should use evergreen feature names, commands, or file anchors instead of mutable packet IDs.

### Error Scenarios
- If validation regresses after a documentation fix, revert that file and record the deferral in this packet's ADR.

### State Transitions
- Packet starts as Draft, moves to Completed only after tally generation, checklist evidence, ADR, implementation summary, and all strict validations are synchronized.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Dozens of docs plus seven skill surfaces |
| Risk | 10/25 | Documentation-only, but validation-sensitive |
| Research | 8/20 | Requires sweep scripts and strict packet validation |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
