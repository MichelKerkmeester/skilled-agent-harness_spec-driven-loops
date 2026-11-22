---
title: "Decision Record: Offer the right deep-loop command and flags from explicit loop wording"
description: "Decision record template for documenting architectural choices, alternatives, consequences and implementation notes."
trigger_phrases:
  - "deep loop command offers decision record"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers"
    last_updated_at: "2026-11-22T11:08:37Z"
    last_updated_by: "template-author"
    recent_action: "Initialized decision record template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-012-deep-loop-command-offers"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Offer the right deep-loop command and flags from explicit loop wording

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: [Decision Title]
<!-- FILL: Write one ADR per decision with context, choice, consequences and the rejected option. GOOD: ADR-001: a `--keep` option, because the script already parses options. WEAK: We decided on an option. -->

### Metadata

| Field | Value |
|-------|-------|
| **Status** | [Proposed/Accepted/Deprecated/Superseded] |
| **Date** | 2026-11-22 |
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
| Q001 | Build all six proposals, with proposal 3 rebuilt under the loop-wording rule. | Not stated. | None | implementation-summary.md, scratch/decisions.md D1 |
| Q002 | A yes to a deep-loop offer runs the command with :auto and the composed flags. | Not stated. | None | deep-*-presentation.txt Offer From an Advisor Brief, decisions D3 |
| Q003 | A deep-loop command is offered only on an explicit loop ask, never on depth wording alone. | Not stated. | None | command-attach.ts LOOP_WORDING, decisions D2 |
| Q004 | Rebuild proposal 3 to score explicit loop wording, narrow the gate, and supersede the depth-wording rule from packet 008. | Not stated. | specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build decision: deep loop offered only on depth wording | explicit.ts, command-attach.ts, decisions D2 |
| Q005 | An offer proposes the native executor unless the request names one. | Not stated. | None | deep-*-presentation.txt flag table, decisions D4 |
| Q006 | Replace the three deep-family holdout rows with fresh prompts written blind. | Not stated. | None | command-prompts.jsonl holdout -02 rows, decisions D7 |
| Q007 | Provision the new worktree with npm ci and builds. | Not stated. | None | worktrees/516-deep-loop-command-offers |
| Q008 | Add the deep-loop offer work to the untagged v4.2.0.0 changelog in place. | Not stated. | None | .skilled/changelog/skilled/v4.2.0.0.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01UuFSLHTvgDaW8Msb2GDgem:1 -->

Question:
```text
Which of the six proposals should the claude1 Opus medium workers build?
```

Options:
```text
1+2: gate and offer (Recommended)
3: depth words in scoring
4+6: dead ends and drift
5: setup via question tool
```

Answer:
```text
1+2: gate and offer (Recommended), 3: depth words in scoring, 4+6: dead ends and drift, 5: setup via question tool
```

### Q002
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01UuFSLHTvgDaW8Msb2GDgem:2 -->

Question:
```text
When the advisor offers a deep loop and the user says yes, what should run?
```

Options:
```text
:confirm with flags (Recommended)
:auto with flags
Plain command, setup asks
```

Answer:
```text
:auto with flags
```

### Q003
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01UuFSLHTvgDaW8Msb2GDgem:3 -->

Question:
```text
Should 'thorough code review' or 'investigate X in depth' get a deep-loop offer, or only requests that name a loop or say 'iterations'?
```

Options:
```text
Offer, user decides (Recommended)
Only explicit loop asks
```

Answer:
```text
Only explicit loop asks
```

### Q004
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01CjvUDRFnM3spxtwWf3EGJS:0 -->

Question:
```text
Your answer 'only explicit loop asks' conflicts with proposal 3, which makes 'thorough' and 'in depth' count toward a deep-loop route. It also reverses the decision recorded in advisor packet 008, which offers a loop on depth wording. How should I reconcile them?
```

Options:
```text
Loop words only (Recommended)
Drop proposal 3
Keep depth words
```

Answer:
```text
Loop words only (Recommended)
```

### Q005
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01CjvUDRFnM3spxtwWf3EGJS:2 -->

Question:
```text
When the AI offers a deep loop, which executor should the composed command propose if the request names none?
```

Options:
```text
Native unless named (Recommended)
DeepSeek for research
```

Answer:
```text
Native unless named (Recommended)
```

### Q006
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01CjvUDRFnM3spxtwWf3EGJS:3 -->

Question:
```text
The analysis agent saw the text of the three sealed deep-family holdout prompts in the advisor routing corpus while running it. Should those rows be replaced before P1 and P3 are tuned?
```

Options:
```text
Replace them (Recommended)
Keep them sealed
```

Answer:
```text
Replace them (Recommended)
```

### Q007
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01WcSp2CybwgeehWQUVKzGXy:0 -->

Question:
```text
The sk-git allocator sets up a new worktree with `npm ci` from the repo's own lockfiles, then builds the dist outputs the advisor CLI needs. The workers can't run the advisor tests or probes without that. CLAUDE.md says to stop for a yes before any install. To undo it, `git worktree remove` deletes the tree along with its node_modules. Can I go ahead with the install?
```

Options:
```text
Yes, provision it (Recommended)
Create, skip install
```

Answer:
```text
Yes, provision it (Recommended)
```

### Q008
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_018RsUNdyKrJb5Ux1aRZhRsa:0 -->

Question:
```text
v4.2.0.0 covers the expanded deep modes themselves: expansive depth, open nodes holding the stop, --extend, fan-out and dispatch. It says nothing about today's deep-loop offer work in packet 012: the advisor offering /deep:* only on explicit loop asks, the one-question offer with the flags already filled in, setup through the question tool, and /doctor:deep-loop for stuck runs. Should I add it?
```

Options:
```text
Add it (Recommended)
Leave as is
```

Answer:
```text
Add it (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->

---
