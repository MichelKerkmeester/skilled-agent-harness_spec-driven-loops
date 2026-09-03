---
title: "Goal: Validator and Template Debt"
description: "The durable directive this packet executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/052-routing-completeness/006-validator-and-template-debt"
    last_updated_at: "2026-09-03T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Triaged the template backlog into four classes"
    next_safe_action: "Operator rules on the four tiers in research/template-triage.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-052-006-validator-and-template-debt"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Validator and Template Debt

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE. Keep it short: goal surfaces cap what
> they hold, and a truncated objective loses its tail, where the criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Measure a template against what it emits, and make the two validators agree about what a fixture is.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | A template fenced block is the deliverable, so the voice scanner reads the payload |
| D2 | The document validator exempts what the packaging gate already exempts |
| D3 | Boilerplate is corrected at the template first, then in the documents it seeded |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Copy these into the objective verbatim. Nothing dereferences a path.

- [x] A template with a seeded blocker is caught rather than scoring clean
- [x] Scanner fixtures stop blocking the document validator and their bytes are unchanged
- [x] Every template in the tree is re-scored with payload scanning on, and the count is recorded
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase authored | Done | `a1a213d2cf` authored the three phases that wait on no measurement |
| Two findings fixed | Done | Register 29 and 30 read Fixed |
| Three findings owned | Done | Register 26, 27 and 28 read Planned against this phase |
| Template backlog triaged | Done | `research/template-triage.md`, 2026-09-03. 520 blockers across 38 of 50 detected templates sorted into 347 prose, 134 emitted, 29 scanner gaps and 10 exemptions |

### Deviations and findings

| Item | Note |
|------|------|
| Tree count versus fleet count | 24 of 40 templates in this tree hide blockers. The fleet figure is 45 of 53 once payload is scanned, and the sweep is roadmap work rather than phase work |
| The worst offender scores zero | It emits 43 blockers while the scanner reports a clean document |
| The recorded 45 of 53 does not reproduce | Re-running the pre-fix scanner over the same file set gives 44 of 53. The masking fix in `82938b3e1c` then moved it to 41 of 53 repo-wide, 38 of 50 under `.opencode/` |
| Two thirds of the backlog is guidance | 347 of 520 occurrences sit in prose no generated document ever sees, so the sweep is smaller than the headline count implied |
<!-- /ANCHOR:log -->
