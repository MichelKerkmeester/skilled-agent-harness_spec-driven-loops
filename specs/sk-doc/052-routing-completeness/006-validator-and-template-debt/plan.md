---
title: "Implementation Plan: Phase 6: validator-and-template-debt"
description: "How the scanner was made to read a template's payload, how the two gates were brought into agreement about fixtures, and why the template backlog was recorded rather than swept."
trigger_phrases:
  - "validator template debt plan"
  - "payload scanning approach"
  - "template first then documents"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/052-routing-completeness/006-validator-and-template-debt"
    last_updated_at: "2026-09-02T18:47:58Z"
    last_updated_by: "claude-code"
    recent_action: "Filled the phase plan against shipped commits"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/templates/core/plan.md.tmpl"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-052-006-validator-and-template-debt"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: validator-and-template-debt

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python for both gates, Markdown for the templates they measure |
| **Framework** | The voice scanner rule set and the shared document validator |
| **Storage** | Template trees under `assets/` and `templates/`, plus `specs/` planning documents |
| **Testing** | `scaffold-golden-snapshots.vitest.ts`, plus a seeded-blocker negative control |

### Overview

Each fix went to the thing that keeps producing the defect before it went to the documents the
defect had already reached. The template was corrected first, then the files it seeded. Every
count was re-derived rather than inherited, which is how forty-eight became fifty-six and how
an unmeasured zero became forty-five of fifty-three.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing: golden snapshots re-captured, negative control reproducible
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Fix the generator, then its output. A template is a producer, and rewriting its copies while
it keeps emitting the defect buys nothing.

### Key Components
- **`hvr_scan.py` template detection**: a target counts as a template when its name marks it
  as one and it sits in an `assets/` or `templates/` tree, and then the fence is scanned
  rather than masked.
- **`validate_document.py` fixture exemption**: the same path-based exemption the packaging
  gate already carried, so both gates agree about what a fixture is.
- **`plan.md.tmpl` scaffold line**: the seeded boilerplate that reached fifty-six planning
  documents.

### Data Flow

A template emits a payload into every document authored from it. Masking the fence hides the
payload from the scanner, so a defect in the payload is invisible at the template and visible
only later, spread across the documents it seeded.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `hvr_scan.py` | Scores voice, masking fences by default | Updated: template payloads scanned by name and location | A blocker seeded in a template fence is caught, and removing it passes |
| `validate_document.py` | Blocks documents missing required structure | Updated: fixture-tree exemption added | Exits 0 on both voice fixtures, releasing 485 tracked files |
| The packaging gate | Already exempted fixture trees | Unchanged | Its reasoning was the precedent, not a second implementation |
| `repo-rule-template.md` | Emits the verbatim binding line | Updated: banned character removed | All nine shipped rules use the other form |
| `plan.md.tmpl` | Emits the planning scaffold line | Updated: punctuation corrected | Golden snapshots re-captured and passing |
| Fifty-six `plan.md` files | Carry what the template used to emit | Updated | Each dropped exactly one blocker, and none rose |
| `rule-anatomy.md` | States a measured contract | Updated: table re-derived | Five of nine rows had drifted, and the conclusion survived |

Required inventories:
- Same-class producers: every template in the tree was re-scored with payload scanning on, giving 24 of 40 here and 45 of 53 across the fleet.
- Consumers of changed symbols: the corrected scaffold sentence was searched across `specs/`, which returned fifty-six files rather than the forty-eight the finding claimed.
- Matrix axes: gate by document class, giving template, fixture and ordinary document.
- Algorithm invariant: a clean score without payload scanning means unmeasured rather than clean.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Seeded blocker inside a template fence, caught and then cleared | `hvr_scan.py` on a probe template |
| Integration | Both voice fixtures under the document validator | `validate_document.py` |
| Manual | Blocker delta across the fifty-six rewritten planning documents | `hvr_scan.py` before and after |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The packaging gate exemption | Internal | Green | The validator would be inventing a rule rather than matching one |
| Scaffold golden snapshots | Internal | Green | A template edit leaves the suite red |
| The voice rule set | Internal | Green | Blocker definitions have no source |
| `specs/` tree access | Internal | Green | The seeded documents cannot be counted or rewritten |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: payload scanning firing on documents that merely quote a command.
- **Procedure**: the detector is path-based, so narrowing it is a one-line change rather than
  a revert. The template corrections stand on their own and would not be rolled back with it.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Measure templates ──┐
                    ├──► Fix generators ──► Rewrite seeded docs ──► Re-score
Read both gates ────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | Re-deriving every inherited count |
| Core Implementation | High | Two gate changes, two template fixes, fifty-six rewrites |
| Verification | Medium | Negative control, fixtures, snapshots, blocker deltas |
| **Total** | | **One working session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Golden snapshots re-captured against the corrected template
- [x] Blocker delta measured per rewritten document
- [x] Fixture exemption breadth measured across every tracked markdown file

### Rollback Procedure
1. Narrow or disable the template path detector, which is where payload scanning is decided.
2. Leave the template corrections in place, since they are independent of the detector.
3. Re-run the golden snapshots and both voice fixtures.
4. Re-record the template count, since a detector change changes what is measured.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Measure    │────►│  Fix the    │────►│  Rewrite    │
│  properly   │     │  generators │     │  the copies │
└─────────────┘     └──────┬──────┘     └─────────────┘
                          │
                    ┌─────▼─────┐
                    │  Align    │
                    │  the gates│
                    └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Payload scanning | None | A real template count | Generator fixes |
| Generator fixes | Payload scanning | Corrected templates | Copy rewrites |
| Fixture exemption | The packaging gate precedent | Two gates that agree | Verification |
| Copy rewrites | Generator fixes | Fifty-six documents each down one blocker | Verification |
| Verification | All of the above | Recorded counts and a reproducible control | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Enable payload scanning** - nothing else can be measured before it - CRITICAL
2. **Correct the two seeded templates** - the generators that keep producing the defect - CRITICAL
3. **Align the fixture exemption across both gates** - CRITICAL
4. **Rewrite the seeded planning documents and measure the delta** - CRITICAL

**Total Critical Path**: one session, ordered generator before output.

**Parallel Opportunities**:
- The overview-section work runs alongside the template corrections.
- The fleet re-score runs alongside the copy rewrites.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Rule template corrected | The verbatim binding line matches all nine shipped rules | `c1b3b780c3` |
| M2 | Plan template corrected | Golden snapshots re-captured and passing | `9ae247d772` |
| M3 | Overview sections added | Fourteen fixed, two left exempt, every citation still resolves | `d87e8dd162` |
| M4 | Gates aligned and payload scanned | 45 of 53 recorded, 485 files released, 56 documents rewritten | `d229b0a24d` |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Record the template payload backlog rather than sweep it

**Status**: Accepted

**Context**: once the payload is scanned, 45 of 53 templates in the fleet carry a real
blocker. A sweep would be one commit.

**Decision**: record the backlog with its count and decide it per template.

**Consequences**:
- The count is public and cannot be quietly forgotten.
- The work stays reviewable, since rewriting a payload changes what the template emits.

**Alternatives Rejected**:
- A bulk rewrite: a template's fenced block is the deliverable, and some of those characters
  are load-bearing.

### ADR-002: Put an overview in a zero slot where a section number is cited

**Status**: Accepted

**Context**: the prescribed numbering would open each document at section one, which
renumbers everything below it. Section numbers are cited across files, including from
documents this change was not allowed to touch.

**Decision**: where a number is cited anywhere, the overview goes into a zero slot the tree
already uses. Where nothing cites it, the prescribed numbering applies.

**Consequences**:
- Every citation still resolves.
- Two numbering conventions coexist, decided by whether a document is cited.

**Alternatives Rejected**:
- Renumbering every document: it was attempted and reverted, because it silently breaks
  addresses rather than failing loudly.

---

## 8. AI EXECUTION PROTOCOL

### Pre-Task Checklist

- [x] Read `goal.md` and carry its three decisions into the work.
- [x] Re-derive any count before using it, including counts stated in the finding itself.
- [x] Identify the generator before touching anything it produced.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Generator first, then the documents it seeded |
| TASK-SCOPE | The two gates and the templates they measure. The voice backlog stays out |
| TASK-EVIDENCE | A clean score without payload scanning is reported as unmeasured, never as clean |
| TASK-COUNT | Every inherited number is re-derived, and the new figure is the one recorded |

### Status Reporting Format

Report the gate, what it was not looking at, and the count once it does. Give the tree figure
and the fleet figure separately, naming what each describes.

### Blocked Task Protocol

A BLOCKED task names the payload it cannot rewrite without changing emitted output, and moves
that template to the recorded backlog rather than editing it under a cleanup heading.
