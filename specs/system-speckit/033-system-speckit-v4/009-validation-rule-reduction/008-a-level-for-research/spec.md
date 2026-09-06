---
title: "Feature Specification: A Level For Research"
description: "Research and audit packets had no level whose contract they could meet; this adds one and fixes the rules that never knew the non-numeric levels existed."
trigger_phrases:
  - "level for research"
  - "level for research"
  - "research level"
  - "research packet type"
  - "research and audit packets"
  - "non-numeric levels"
  - "check-level-match level set"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/009-validation-rule-reduction/008-a-level-for-research"
    last_updated_at: "2026-08-30T12:40:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Added a research level and taught every level enumeration about it"
    next_safe_action: "None outstanding for this phase"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/templates/spec-kit-docs.json"
      - ".opencode/skills/system-spec-kit/scripts/rules/check-level-match.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-30-speckit-041-010"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: A Level For Research

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-30 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 |
| **Predecessor** | 009-retire-the-sweep |
| **Successor** | None |
| **Handoff Criteria** | A research packet can declare what it is and meet that contract |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Levels 1, 2 and 3 all require spec.md, plan.md and tasks.md. A research or
audit packet has no implementation to plan, so it carries a spec and its
findings and nothing else — and failed FILE_EXISTS forever. The only
non-implementation level, `review`, requires `review/review-report.md` at a
fixed path that deep-review does not write to; it writes per-lineage reports
under `review/lineages/<name>/`.

So the corpus had 104 leaf packets missing plan.md or tasks.md with no honest
way to pass. The tempting fix — author plan and task documents for work that
had no implementation phase — makes the gate green by making the packet lie.

Fixing the contract instead surfaced a second defect: the shell LEVEL_MATCH rule
only ever recognised 1, 2, 3 and 3+. It never knew `phase` or `review` existed.
A packet declaring `review` alongside a numeric metadata row was silently graded
at the number, and one declaring `review` alone was reported as having an
invalid level.

### Purpose

Give a research record a level it can meet, and make the rules agree with the
manifest about which levels exist.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope**

- A `research` level in the document manifest.
- The six enumerations that decide which levels are legal.
- Declaring the level on the packets whose shape it describes.

**Out of scope**

- The 76 leaf packets that carry neither research nor review output. Sixty-one
  of those are Draft, Planned, or unstarted; the gate is right about them and a
  level change would only hide it.
- Grading the *shape* of `research/research.md`. It is required to exist, but
  only 31% of research output corpus-wide follows the anchored template and
  eight packets pass today with an anchorless one, so the template was never its
  operative contract. The existing free-form-artifact declaration carries that.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Priority |
|----|-------------|----------|
| REQ-001 | A packet declaring `research` requires spec.md and no implementation documents | P0 |
| REQ-002 | Every level enumeration accepts the level, or the declaration fails somewhere unhelpful | P0 |
| REQ-003 | Declaring the level changes no other rule's verdict | P0 |
| REQ-004 | Packets that do not carry research or review output are unaffected | P0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Research-shaped and review-shaped packets pass without gaining documents.
- No packet regresses.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Impact | Mitigation |
|------|--------|------------|
| The level becomes a way to skip plan and tasks | Implementation packets declare research and dodge their contract | The level describes shape, not completeness; it was applied only to packets already carrying research or review output |
| Requiring research.md pulls it into shape grading | Most research output fails on anchors it never had | Measured first: 1 of 11 in scope and 127 of 408 corpus-wide carry anchors, so research.md stays a lazy addon |
| A level enumeration is missed | The declaration fails somewhere unrelated and confusing | Found by declaring it and following each failure to its source; six enumerations in total |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Resolved: the `review` level is correct as written. Deep review's own workflow
compiles its findings into `review/review-report.md` — that is the documented
output path, not an accident of the two packets that have one. The eight packets
carrying only per-lineage reports ran the fan-out and never ran the synthesis
step, so they are incomplete work rather than a mis-stated contract. Loosening
the level to accept a lineage report or a findings registry would make them pass
by lowering what a review record means.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## 8. RELATED DOCUMENTS

- `../spec.md` — the parent packet and its phase map
- `plan.md`, `tasks.md` — this phase's approach and execution
<!-- /ANCHOR:related-docs -->
