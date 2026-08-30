---
title: "Feature Specification: Nothing Points At The Retired Checklist"
description: "Remove the dead links left behind when the standalone verification checklist was deleted from the corpus."
trigger_phrases:
  - "checklist reference cleanup"
  - "dead checklist links"
  - "spec doc integrity checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/036-spec-doc-template-reduction/011-checklist-reference-cleanup"
    last_updated_at: "2026-08-30T09:10:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Removed every dead markdown link to the retired checklist.md"
    next_safe_action: "None outstanding for this phase"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/check-spec-doc-integrity.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-30-speckit-036-011"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Nothing Points At The Retired Checklist

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-30 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 |
| **Predecessor** | 010-checklist-full-retirement |
| **Successor** | None |
| **Handoff Criteria** | No document links to a checklist.md that does not exist |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Phase 10 retired the standalone verification checklist and deleted 2,309
`checklist.md` files, but not the links pointing at them. `SPEC_DOC_INTEGRITY`
follows markdown links and reports a missing target, so packets that were
otherwise healthy began failing on a reference to a document the retirement had
deliberately removed.

The failure was easy to under-read from the corpus pass rate, because most
affected packets were already failing for other reasons and so did not change
verdict. On a fixed 300-packet sample only three flipped; the real population is
108 documents.

### Purpose

Finish the retirement: remove what pointed at the deleted document.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope**

- Markdown links to a `checklist.md` that does not exist, in any document under
  `specs/`, archived packets included.

**Out of scope**

- Mentions of `checklist.md` in prose or backticks. `SPEC_DOC_INTEGRITY` follows
  links, not mentions, and a historical sentence naming a document that once
  existed is a true record.
- `worktree_checklist.md` and other files whose name merely contains the word.
- Re-adding checklists anywhere. The retirement stands; this completes it.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Priority |
|----|-------------|----------|
| REQ-001 | No document links to a `checklist.md` that does not exist | P0 |
| REQ-002 | No historical record is destroyed to achieve that | P0 |
| REQ-003 | Packets that failed only on this recover; none regress | P0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- A scan for dead `checklist.md` links returns zero.
- The three packets in the sample that failed only on this now pass, and the
  sample shows no regression.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Impact | Mitigation |
|------|--------|------------|
| Deleting lines that carried real content | A completed packet loses its record of work | Two dispositions: a line whose only content is the pointer is removed; a line with surrounding prose keeps the prose and loses only the link |
| Over-matching on similarly named files | Unrelated documents edited | Matched on link targets resolving to `checklist.md` specifically; `worktree_checklist.md` and prose mentions are untouched |
| Fixing a symptom rather than the cause | The same breakage returns on the next retirement | The cause is upstream in phase 10 and is recorded here; this phase repairs what it left |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## 8. RELATED DOCUMENTS

- `../spec.md` — the parent packet and its phase map
- `plan.md`, `tasks.md` — this phase's approach and execution
<!-- /ANCHOR:related-docs -->
