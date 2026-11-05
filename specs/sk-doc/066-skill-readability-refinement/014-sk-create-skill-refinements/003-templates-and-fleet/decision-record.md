---
title: "Decision Record: Templates and fleet pass"
description: "The decision that lets a fleet commit land with a guard hard finding when the finding is an operator-approved pinned edit or a citation the guard matched by basename alone."
trigger_phrases:
  - "guard hard finding mapping"
  - "fleet guard false positive"
importance_tier: "normal"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "sk-doc/066-skill-readability-refinement/014-sk-create-skill-refinements/003-templates-and-fleet"
    last_updated_at: "2026-11-05T15:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Recorded the fleet guard mapping decision"
    next_safe_action: "Keep ADR-003 in step with AC-004 and AC-014"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ae286a84-7880-4ce7-a5fe-7d1335e09c78"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Templates and fleet pass

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: A mapped guard hard finding does not block a fleet commit

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-05 |
| **Deciders** | Orchestrator, extending the operator's T010 ruling of 2026-11-05 |

---

### Context

ADR-001 in `plan.md` lets a skill commit land only with no hard guard finding. Four of the fourteen phase commits carry six hard findings. One is the intro edit to the pinned `code-quality-standards.md`, which the operator approved. The other five are `cited-section` findings where the citing line names a different file with the same basename: `sk-code/README.md:151` cites `ROUTER.md` section 8, `runtime-config-contract.md:72` cites `config/README.md` section 1, and the sk-design benchmark report cites `benchmark/README.md` section 1.

### Constraints
- The guard is phase 002 code, so fixing its basename match is out of this phase's scope.
- A hard finding that is waved through without a record defeats the guard.

---

### Decision

**Summary**: A hard finding does not block a commit when it is either an operator-approved pinned edit or a citation shown, by reading the citing line, to name another file.

**Details**: Each such finding is listed with its commit and the reason in `scratch/guard-fleet.txt` and in the task evidence. AC-004 is superseded by AC-014, which checks that list. This applies the operator's T010 choice, "Map each hard finding", to the fleet commits.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Map each hard finding** | Keeps the record, matches the T010 ruling | A reader must check the mapping | 8/10 |
| Fix the guard's basename match first | Removes the false positives | Out of scope, reopens phase 002 | 4/10 |
| Revert the README folds that trip the guard | Guard reads clean | Leaves READMEs failing the render checks | 2/10 |

**Why Chosen**: the mapping keeps every finding visible and the fix to the guard is logged as a follow-up.

---

### Consequences

**Positive**:
- The fleet pass closes with each hard finding explained.

**Negative**:
- The guard keeps reporting basename false positives - Mitigation: a follow-up to resolve a cited path against the citing file's directory before matching.

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| A real broken citation is mislabeled a false positive | M | Each mapping quotes the citing line, and the T026 review samples the citations |

---

### Implementation

**Affected Systems**:
- `acceptance-criteria.md` AC-004 and AC-014
- `scratch/guard-fleet.txt`

**Rollback**: mark AC-004 Unmet again and drop AC-014; no code depends on this record.

<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Skill READMEs open with OVERVIEW, with the AT A GLANCE table folded in as its first subsection. | Not stated. | None | ADR-002, T006, REQ-002 |
| Q002 | Each guard hard finding on the changed templates is mapped to the template task that made it, instead of blocking T010. | Not stated. | None | T010, scratch/guard-t010-map.md, ADR-003 |
| Q003 | The pinned code-quality-standards.md gets an intro-only edit, checked by check-rule-copies.js. | Not stated. | None | T016, CHK-031 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_01D9r9WJyw2G7WP8Mimv6wph:2 -->

Question:
```text
Should skill READMEs open with AT A GLANCE or OVERVIEW? The skill and parent-skill README templates use AT A GLANCE, while the validator rule and the sk-create-readme template expect OVERVIEW.
```

Options:
```text
OVERVIEW (Recommended)
AT A GLANCE
```

Answer:
```text
OVERVIEW (Recommended)
```

### Q002
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_01XAyhJfStaWZPYNEyhsznBw:0 -->

Question:
```text
Phase 003's T010 says the rewrite guard must report no hard finding on the changed templates. But T005, T006 and T009 require edits inside fenced scaffolds (the README scaffolds, the description placeholder, the size diagrams, the '800 words' example), and the guard treats any fenced-block edit as hard. All 10 flagged blocks are those intended edits. How should T010 be checked?
```

Options:
```text
Map each hard finding (Recommended)
Undo fenced edits
Stop here
```

Answer:
```text
Map each hard finding (Recommended)
```

### Q003
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_013TTrCHky16Cdnv3QperZUY:0 -->

Question:
```text
The pinned doc sk-code/shared/references/universal/code-quality-standards.md carries one render finding: its intro (line 17) repeats its description. check-rule-copies.js pins six rule strings in that doc, and the intro sentence is none of them. The rewrite guard refuses any edit to a pinned doc, and the finding must clear before the staged sets can empty. How should it be handled?
```

Options:
```text
Allow intro-only edit (Recommended)
Move it to the exempt map
Leave it for you
```

Answer:
```text
Allow intro-only edit (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
