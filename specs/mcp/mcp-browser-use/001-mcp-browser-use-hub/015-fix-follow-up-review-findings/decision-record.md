---
title: "Decision Record: Phase 15: fix-follow-up-review-findings"
description: "Decision record template for documenting architectural choices, alternatives, consequences and implementation notes."
trigger_phrases:
  - "fix follow up review findings decision record"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp/mcp-browser-use/001-mcp-browser-use-hub/015-fix-follow-up-review-findings"
    last_updated_at: "2026-11-24T07:44:39Z"
    last_updated_by: "template-author"
    recent_action: "Initialized decision record template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-015-fix-follow-up-review-findings"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Phase 15: fix-follow-up-review-findings

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: The id noun names a skill only beside another shared word

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-24 |
| **Deciders** | Operator (Q006, Q009), Claude |

---

<!-- ANCHOR:adr-001-context -->
### Context

Advisor 2.0.2.0 let the last word of a skill id anchor the 0.82 task-intent floor, so "doctor" could name system-skilled-doctor. A trace of every lift showed the noun alone lifting skills on ordinary words: "loop", "tooling", "mode", "orca" and "classifier".

### Constraints

- The eight ratchet metrics and the browser replay must hold.
- Any pinned slice that moves needs the operator's approval.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: the noun counts as naming its skill only when the lexical lane also matched another prompt word for that skill.

**How it works**: `promptNamesIdNoun` takes the lexical evidence and returns true only when it holds a `token:` entry other than the noun itself.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Another shared token** | Clears every probed single-word lift and keeps "run the doctor update check" | Re-pins one doctor control row | 8/10 |
| A stop list of common nouns | Moves no pin | Changes nothing for `code`, `design` and `prompt`, which the explicit lane anchors anyway, and needs upkeep | 4/10 |
| Drop the noun clause | Simplest | Loses the doctor lift that variant E added it for | 3/10 |

**Why this one**: it is the only option that removes the single-word lifts without a word list.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Five probe prompts stop lifting a skill they never named.

**What it costs**:
- A prompt that names a skill by its noun alone, with no other shared word, now abstains. Mitigation: name the skill or its domain phrase.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A real one-word request loses its route | L | The doctor, command and ratchet slices all ran and only one control row moved |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Two lineages reported it, and the trace reproduced it |
| 2 | **Beyond Local Maxima?** | PASS | Three options compared above |
| 3 | **Sufficient?** | PASS | One condition in one function |
| 4 | **Fits Goal?** | PASS | The operator folded it into this phase |
| 5 | **Open Horizons?** | PASS | No word list to maintain |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `fusion.ts`: `promptNamesIdNoun` gains the lexical evidence argument.
- `doctor-prompts.jsonl`: `doctor-none-04` expects no recommendation.

**How to roll back**: revert the advisor commit, then run `npm run build` in the advisor runtime.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions
<!-- FILL: Leave the table empty: a full-auto save fills it from captured operator answers. Hand-write a row only for an answer the capture missed, with the next free id. GOOD: Q004 decides `Keep the archive for 30 days`, gives the stated reason and names REQ-002. WEAK: Q004 says `Discussed retention` and leaves the other cells empty. -->

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q006 | Fold the id-noun residual into phase 015 instead of a separate advisor packet or a known limitation. | Not stated. The question's example, sk-design on "the design of this database schema", was misattributed: that lift comes from the explicit lane, not the noun. | None | spec.md scope, ADR-001 |
| Q007 | Plan and build phase 015 now, and commit when green without pushing. | Not stated. | None | tasks.md, implementation-summary.md |
| Q008 | Pin the Aside installer by sha256: download, verify, then run. | Not stated. | None | REQ-004, `install.sh` |
| Q009 | Land variant F2 and re-pin `doctor-none-04` to no recommendation. | Its only link to the doctor skill was the shared word "doctor". | None | ADR-001, `doctor-prompts.jsonl` |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q006
<!-- source: claude:f7099de4-e8ec-43e6-a849-849dabb1c94c:scorer-scope-015:0 -->

Question (condensed from the text asked):
```text
Two reviewers found that a skill whose id ends in a common word can still be lifted to 0.82 by that one word. What should happen to it?
```

Options:
```text
Record known limitation (Recommended)
Own advisor packet
Fold into phase 015
```

Answer:
```text
Fold into phase 015
```

### Q007
<!-- source: claude:f7099de4-e8ec-43e6-a849-849dabb1c94c:scorer-scope-015:1 -->

Question (condensed from the text asked):
```text
Phase 015 has a filled spec but no plan or tasks yet. How should I continue with it?
```

Options:
```text
Plan and build now (Recommended)
Plan only
Stop here
```

Answer:
```text
Plan and build now (Recommended)
```

### Q008
<!-- source: claude:f7099de4-e8ec-43e6-a849-849dabb1c94c:scorer-scope-015:2 -->

Question (condensed from the text asked):
```text
The Aside installer pipes the vendor's official install script straight into bash. What should phase 015 do with it?
```

Options:
```text
Download, pin, verify (Recommended)
Download and show first
Leave as is, document
```

Answer:
```text
Download, pin, verify (Recommended)
```

### Q009
<!-- source: claude:f7099de4-e8ec-43e6-a849-849dabb1c94c:doctor-row-015:0 -->

Question (condensed from the text asked):
```text
Variant F2 clears the single-word id-noun lifts and holds every ratchet metric and replay row, but moves one pinned doctor control row: "my doctor update came in" no longer reaches system-skilled-doctor. How should this land?
```

Options:
```text
Re-pin row to none (Recommended)
Exempt 'doctor' by list
Drop the noun change
```

Answer:
```text
Re-pin row to none (Recommended)
```
<!-- /ANCHOR:operator-answers-verbatim -->

---
