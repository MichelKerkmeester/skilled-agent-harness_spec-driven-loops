---
title: "057: Deeper second-pass rewrite of root README from 056 raw findings"
description: "Sonnet @markdown second-pass on ./README.md consuming the 263 raw iter findings from packet 056 (not just the 30-EDIT collapsed delta). Targets DQI >= 98 (Phase 4 hit 94). Voice preserved in non-drifted prose; surgical edits only."
trigger_phrases:
  - "057 spec"
  - "deeper rewrite root readme"
  - "sonnet markdown second pass"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/z_archive/wave-2-merges/014-057-root-readme-deeper-rewrite"
    last_updated_at: "2026-05-15T14:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded 057 packet"
    next_safe_action: "Dispatch sonnet @markdown Phase 2"
    blockers: []
    key_files:
      - "README.md"
      - ".opencode/specs/.../054-root-readme-deep-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:354b39616b2b3450c6d32ad48820ffc68cce9efb703394d6fcfc31738c2a4ab7"
      session_id: "057-spec-scaffolded"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions:
      - "Scope clarification: deeper second-pass that consumes raw iter findings + Phase 4 evidence (not the collapsed 30-EDIT delta only)"
      - "Target metric: DQI >= 98 (Phase 4 hit 94)"
      - "Why a new packet not amending 056? 056 is shipped/closed; this is a follow-on implementation pass"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# 057: Deeper second-pass rewrite of root README

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Target Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-05-15 |
| **Branch** | `main` |
| **Parent** | `system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/001-local-embeddings-foundation` |
| **Depends on** | `054-root-readme-deep-research` (shipped) |
| **Successor** | None |
| **Handoff Criteria** | ./README.md HVR score >= 95 (target >= 98), all Phase-4-missed iter findings addressed, packet strict-validate PASS, single primary commit on main |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem

056 Phase 4 sonnet @markdown applied 25 of 30 verified-delta EDITs + bulk HVR cleanup. The shipped state (commit 6e330e218) tests at DQI 94/100. The delta-verified.md collapsed 263 raw findings into 30 bucket EDITs. The bucketing was efficient but may have left individual P1/P2 findings unaddressed when they didn't fit cleanly into a bucket.

Examples of potential gaps:
- iter 8's 183 HVR punctuation hits were collapsed into one "HVR-PUNCT-FIX" bucket. Phase 4 removed 4 em dashes + 28 semicolons + 38 oxford commas (~70 fixes). The remaining ~113 borderline cases (table cells, HTML spacers, code blocks) may still hide prose-level violations.
- iter 17's 7 Quick Start findings were collapsed into one "Quick Start rewrite" bucket. The rewrite touched the 3 build commands but may not have addressed every step-level issue iter 17 surfaced.
- iter 4's naming inconsistency on code_mode (5 underscore vs 4 hyphen) was addressed for most sites; iter 19's similar findings on Copilot CLI / Codex CLI naming may have residual cases.

### Purpose

Sonnet @markdown second-pass that revisits the raw iter findings (not just the bucket delta) and applies surgical edits to any finding Phase 4 missed. Push DQI from 94 to >= 98.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Sonnet @markdown re-reads all 20 iter files + research.md + edit-evidence.md (Phase 4 record)
- Applies any finding NOT already in edit-evidence.md
- Re-evaluates borderline HVR cases Phase 4 left in (table cells, spacers) and tightens where prose
- Voice preservation in non-drifted prose
- Per-edit before/after evidence in `research/edit-evidence-v2.md`

### Out of Scope

- Re-doing edits Phase 4 already applied (no churn)
- Rewriting non-drifted sections (voice preservation contract)
- Modifying any doc other than ./README.md
- Re-running the 20-iter cli-devin sweep (056's research stands)

### Files to Change

| File | Action | Purpose |
|------|--------|---------|
| `./README.md` | Edit (surgical, scoped to Phase-4-missed findings) | Apply remaining iter findings, push HVR closer to 100 |
| `research/edit-evidence-v2.md` | Create | Second-pass before/after transcript |
| `research/uncovered-findings.md` (optional) | Create | Iter findings sonnet judges un-applyable, for human review |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | ./README.md passes sk-doc validate | `validate_document.py --type readme` exit 0 |
| REQ-002 | HVR score >= 95 (target >= 98) | `validate_document.py --type readme --json` |
| REQ-003 | Strict-validate on packet | `validate.sh --strict` exit 0 |
| REQ-004 | Sonnet @markdown + @review final double-check | 0 P0 findings before commit |
| REQ-005 | Edit-evidence-v2 transcript exists | Records every applied edit with iter citation |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Voice preservation in non-drifted prose | git diff README.md scoped to Phase-4-missed findings |
| REQ-007 | No re-applying Phase 4 edits | edit-evidence-v2.md does not duplicate edit-evidence.md entries |
| REQ-008 | Sonnet flags un-applyable findings honestly | uncovered-findings.md exists if any iter findings need human decision |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: ./README.md HVR score improves from Phase 4's 94 to >= 95 (preferably >= 98).
- **SC-002**: At least the 5 deferred EDITs from Phase 4 are addressed (applied or formally marked un-applyable).
- **SC-003**: Single primary commit on `main` closes this packet.
- **SC-004**: 056 research artifacts remain untouched; 057 only adds to the trail.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Voice drift in non-drifted prose | High | Explicit scope contract: preserve voice; only revisit Phase-4-missed findings |
| Risk | HVR rigor vs readability tradeoff | Medium | Optimize for HVR score within readability bounds; flag forced rewrites in uncovered-findings.md |
| Risk | Duplicate edits | Medium | Sonnet reads edit-evidence.md first to identify Phase 4 coverage |
| Risk | Parallel-session interference | Low | Commit immediately after sonnet returns |
| Dependency | 056 packet shipped | Met | 6e330e218 on main |
| Dependency | Sonnet @markdown via Task tool | Met | Used in Phase 4 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Phase 2 sonnet wall-clock < 20 min
- **NFR-P02**: Phase 3 verify + double-check < 10 min

### Quality
- **NFR-Q01**: HVR score >= 95 (target >= 98)
- **NFR-Q02**: 0 em dashes, semicolons, oxford commas in prose
- **NFR-Q03**: 0 banned HVR words in prose

### Reproducibility
- **NFR-R01**: edit-evidence-v2.md captures every applied edit
- **NFR-R02**: uncovered-findings.md (if created) captures every un-applyable iter finding with reason
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **EC-001**: Sonnet finds 0 missed items beyond Phase 4 → accept as confirmation; commit a note rather than additional edits
- **EC-002**: HVR baseline is 94; pushing >= 98 may force readability tradeoffs → sonnet flags forced rewrites
- **EC-003**: Iter 16 noted "218" feature catalog count, but verified count is 290 (Phase 4 kept 290) → sonnet maintains 290
- **EC-004**: Some iter findings may have been intentionally deferred by Phase 4 with valid reasoning → sonnet respects those if reasoning still holds, otherwise applies
- **EC-005**: Voice-drift over-edits → reject, redo Phase 2 with tighter scope contract
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

None. Scope, executor, target metric all clarified at planning time.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Resource Map**: See `resource-map.md`
- **056 predecessor**: `../054-root-readme-deep-research/`
- **055 grandfather**: `../055-root-readme-realignment/`
<!-- /ANCHOR:related-docs -->
