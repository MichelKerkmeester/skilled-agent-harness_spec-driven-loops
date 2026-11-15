---
title: "Decision Record: demo widget"
description: "Decision record template for documenting architectural choices, alternatives, consequences and implementation notes."
trigger_phrases:
  - "demo widget decision record"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "scaffold/001-demo-widget"
    last_updated_at: "2026-11-03T06:35:30Z"
    last_updated_by: "template-author"
    recent_action: "Initialized decision record template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-demo-widget"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: demo widget

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: [Decision Title]
<!-- FILL: Write one ADR per decision with context, choice, consequences and the rejected option. GOOD: ADR-001: a `--keep` option, because the script already parses options. WEAK: We decided on an option. -->

### Metadata

| Field | Value |
|-------|-------|
| **Status** | [Proposed/Accepted/Deprecated/Superseded] |
| **Date** | 2026-11-03 |
| **Deciders** | [Names] |

---

<!-- ANCHOR:adr-001-context -->
### Context

[What problem or situation required this decision? What was at stake?
Write in direct, active voice.]

### Constraints

- [Technical constraint with specifics]
- [Business constraint with specifics]
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: [One-sentence description of the decision, in active voice]

**How it works**: [Implementation approach in 2-3 direct sentences]
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **[Chosen]** | [Advantages] | [Disadvantages] | [X/10] |
| [Alternative A] | [Advantages] | [Disadvantages] | [Y/10] |

**Why this one**: [Rationale in 1-2 sentences, direct and specific]
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- [Specific benefit with measurable impact where possible]
- [Specific benefit]

**What it costs**:
- [Specific drawback] . Mitigation: [How to handle it]

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| [Risk with specifics] | [H/M/L] | [Concrete strategy] |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | [PASS/FAIL] | [Is this solving an actual need now?] |
| 2 | **Beyond Local Maxima?** | [PASS/FAIL] | [Were alternatives explored?] |
| 3 | **Sufficient?** | [PASS/FAIL] | [Is this the simplest approach?] |
| 4 | **Fits Goal?** | [PASS/FAIL] | [Is this on the critical path?] |
| 5 | **Open Horizons?** | [PASS/FAIL] | [Is this long-term aligned?] |

**Checks Summary**: [X/5 PASS]
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- [System/Component with specific change]
- [System/Component with specific change]

**How to roll back**: [Concrete revert steps, not "revert if needed"]
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions
<!-- FILL: Leave the table empty: a full-auto save fills it from captured operator answers. Hand-write a row only for an answer the capture missed, with the next free id. GOOD: Q004 decides `Keep the archive for 30 days`, gives the stated reason and names REQ-002. WEAK: Q004 says `Discussed retention` and leaves the other cells empty. -->

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | The demo widget's status badge uses Amber. | Not stated. | None | spec.md (badge requirements not yet written) |
| Q002 | The status badge must support Web, iOS and Android. | Not stated. | None | spec.md (badge requirements not yet written) |
| Q003 | The status badge shows the label 'Needs review'. | Not stated. | None | spec.md (badge requirements not yet written) |
| Q004 | The status badge is static and does not blink. | Not stated. | None | spec.md (badge requirements not yet written) |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:2b332843-34d6-4f51-8f64-255a9fbbaea8:toolu_016zmRkTa5yDu54sFgDa2wXA:0 -->

Question:
```text
Which colour should the demo widget's status badge use?
```

Options:
```text
Amber
Teal
Slate
```

Answer:
```text
Amber
```

### Q002
<!-- source: claude:2b332843-34d6-4f51-8f64-255a9fbbaea8:toolu_01GCdFQ7XkAfwCM2iJmNNhdj:0 -->

Question:
```text
Which platforms must the demo widget's status badge support? Select all that apply.
```

Options:
```text
Web
iOS
Android
```

Answer:
```text
Web, iOS, Android
```

### Q003
<!-- source: claude:2b332843-34d6-4f51-8f64-255a9fbbaea8:toolu_01N7EfVKkhz99EnnHp7RZT94:0 -->

Question:
```text
What text should the demo widget's status badge show? Pick one or type your own under Other.
```

Options:
```text
Live
Beta
New
```

Answer:
```text
Needs review
```

### Q004
<!-- source: claude:2b332843-34d6-4f51-8f64-255a9fbbaea8:chat:a3089ad3-27d6-4a2f-9019-08d2e638ab79:8acea8f3-5f4c-43d2-9539-2c07ce7cbbde -->

Question:
```text
Should the badge blink?
```

Options: none

Answer:
```text
No, keep it static.
```

<!-- /ANCHOR:operator-answers-verbatim -->

---
