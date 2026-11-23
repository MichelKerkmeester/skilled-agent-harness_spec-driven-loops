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
## ADR-001: Supersede the near-miss count in AC-019 with the operator's reversal D10

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-23 |
| **Deciders** | Operator (D10 in `scratch/decisions.md`), recorded in the closure pass |

---

<!-- ANCHOR:adr-001-context -->
### Context

AC-019 checks REQ-012 in two ways. The corpus must hold exactly 15 `near-miss` rows, up from 9, and `command-attach.ts` must gain no guard for N7, N9, D1, V7, H6 or A3. Both checks come from D6, which recorded those six prompts as near-miss rows and ruled out a fix. After the first landing the operator said "fix still open", and D10 reversed D6: each open item was fixed at its cause. Later review rounds also added near-miss rows of their own, so the corpus now holds 31.

### Constraints

- A criterion is never renumbered or deleted. A superseded row names the ADR that replaced it.
- No builder reads a `holdout` row. The id check below reads only rows whose split is not `holdout`.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: mark AC-019 `Superseded` by this ADR and check D10's outcome in its place.

**How it works**: the replacement check is that five of the six prompts sit in the corpus as `near-miss` rows: N7 as `nm-system-deep-loop-02`, N9 as `-03`, V7 as `-05`, H6 as `nm-sk-code-02` and A3 as `nm-sk-code-03`. D1 is now a positive `/doctor:deep-loop` row, `cmd-doctor-deep-loop-plain-tune-02`, because D10 fixed the stuck-run complaint instead of recording it as a miss. The guards that D10 added are covered by the shared fixture and the guard tests.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Supersede with D10's outcome** | Matches what the operator decided and what shipped | The original count check is gone | 9/10 |
| Restore 15 rows and remove the guards | Meets the letter of AC-019 | Undoes fixes the operator asked for and brings back false offers | 1/10 |

**Why this one**: D10 is a later operator decision that reverses the rule AC-019 encodes, so the criterion now has to follow D10.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The closure gate checks what was actually built and decided.

**What it costs**:
- The corpus count is no longer pinned. Mitigation: the command-routing baseline recapture pins every row's outcome.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A future row edit drops one of the five near-miss prompts | L | The id list above names each row, so a search finds a missing one |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | AC-019 cannot be met without reverting D10 |
| 2 | **Beyond Local Maxima?** | PASS | Restoring the letter of the row was weighed above |
| 3 | **Sufficient?** | PASS | One id check replaces one count check |
| 4 | **Fits Goal?** | PASS | The packet goal is correct offers, which D10 serves |
| 5 | **Open Horizons?** | PASS | No code changes |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `acceptance-criteria.md` AC-019 reads `Superseded` with `ADR-001` in its Waiver cell.

**How to roll back**: set AC-019 back to `Unmet` with `-` in its Waiver cell and set this ADR's status to `Deprecated`.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Keep or drop the "multi-round research" alias after an out-of-domain hit

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-23 |
| **Deciders** | Operator, who chose "Keep it" on 2026-11-23 |

---

<!-- ANCHOR:adr-002-context -->
### Context

AC-017 asks two things of the research aliases that ship. K2, "multi-round research into vector index compaction", must top `system-deep-loop` on the research route. No out-of-domain prompt may top the hub. The closure pass replayed each shipped alias (`scratch/probes/probes-ac017-ood.json`). Three prompts pass. "write a memo on multi-round research funding for the grant committee" tops `system-deep-loop` on the research route with no command. The same memo without "multi-round" stays on `sk-doc`, so the alias is the cause. K2 depends on the same alias, so the two halves of AC-017 cannot both hold.

### Constraints

- `.skilled/repo-rules/skill-hub-routing.md` §4: "A term that also matches unrelated work … captures traffic the hub cannot serve."
- D8 already dropped "autonomous research" for an out-of-domain hit.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: keep "multi-round research" and waive AC-017's out-of-domain clause for the memo prompt.

**How it works**: no change ships. The memo prompt tops the hub but carries no command, so nothing runs or spends without the operator. K2 keeps its route. Dropping the alias would return K2 to no recommendation, which is where it was before this packet.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Keep the alias, waive the memo hit** | K2 routes, and the hit carries no command | Departs from the D8 precedent | 7/10 |
| Drop the alias, as D8 did | Follows §4 and D8 | K2 gets no recommendation, and AC-017's K2 clause then needs this waiver instead | 6/10 |

**Why this one**: the out-of-domain hit needs a contrived phrase and offers no command, while K2 is a plain loop ask.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- A plain "multi-round research into X" ask keeps reaching the research mode.

**What it costs**:
- A text written about multi-round research funding can surface the hub as a skill suggestion. Mitigation: no command is attached.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| More real prompts name multi-round research as a subject | L | Add each as a near-miss row and revisit this ADR |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | AC-017 cannot be met in full either way |
| 2 | **Beyond Local Maxima?** | PASS | Both options were probed |
| 3 | **Sufficient?** | PASS | No code change |
| 4 | **Fits Goal?** | PASS | Loop asks keep reaching the loop |
| 5 | **Open Horizons?** | PASS | Reversible by one alias edit |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- On acceptance, AC-017 reads `Waived` with `ADR-002`. On rejection, "multi-round research" leaves `hub-router.json` and `ROUTER.md`, and AC-017's K2 clause is waived instead.

**How to roll back**: set AC-017 back to `Unmet` with `-` in its Waiver cell.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

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
| Q009 | Fix every P1 and P2 finding from the review of this epic. | Not stated. Recorded from the handoff note of the reviewing session. | None | tasks.md Review fix round |
| Q010 | Record the fix round inside this packet. | Not stated. Recorded from the handoff note of the reviewing session. | None | tasks.md, implementation-summary.md |
| Q011 | Build the fix round in a git worktree. | Not stated. | None | worktrees/522-deep-loop-offer-review-fixes |
| Q012 | Withhold the `/doctor:deep-loop` command row on a prompt that names no deep run. | Not stated. The lexical lane had begun to top that run-policy row on "research why the model needed more iterations to converge". | None | fusion.ts withholdDeepLoopDoctorWithoutRun, tasks.md T043 |
| Q013 | List the offer flags in both /deep:* argument hints. | The operator had asked "Why would we limit those hints". The 140-character budget is a soft warning with no recorded failure behind it. | None | research.md, review.md, command-metadata.json, tasks.md T046 |
| Q014 | Run the closure pass: probe once, mark each acceptance row with its evidence, and propose decision records for the rows that cannot be met as written. | Not stated. Evidence: yes_no, option false, overlap 0, imperative true, shift false. | None | acceptance-criteria.md, decision-record.md ADR-001 and ADR-002, tasks.md T051 |
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

### Q011
<!-- source: claude:b8ebe2c5-6d17-442a-9d87-25b409193411 -->

Question:
```text
Where should the fix round for the deep-loop command-offers review (P1-1 to P1-3, P2-1 to P2-5) be built? The handoff notes this choice was never asked; the current branch is main, with only your own .pi/settings.json change in it.
```

Options:
```text
A) Git worktree (Recommended)
B) Current branch (main)
```

Answer:
```text
A) Git worktree (Recommended)
```

### Q012
<!-- source: claude:b8ebe2c5-6d17-442a-9d87-25b409193411 -->

Question:
```text
"research why the model needed more iterations to converge" no longer gets /deep:research. It now tops the /doctor:deep-loop command row (policy run), which the lexical lane scores from that row's keywords ("deep-research convergence drift", "deep-review iteration graph"). The same row already tops "...needed iterations to converge" on main today, so it predates this round. How should this round handle it?
```

Options:
```text
Guard the row (Recommended)
Record it, change nothing
Retune the keywords
```

Answer:
```text
Guard the row (Recommended)
```

### Q013
<!-- source: claude:5789dc27-c573-44e7-afdc-52d0e17986b0:toolu_011TRpQVus3HYAeNgqJm3YoE:0 -->

Question:
```text
About the argument hints on /deep:research and /deep:review: the 140-character limit is only a soft warning (sk-create-command template line 215 and validate_document.py line 2640). It was added in commit 101bcb08175 with no stated reason for 140 and no recorded failure from a long hint, and deep/research was already 540 characters then. Nothing at runtime breaks on a long hint. Should I add the missing flags (--stop-policy, --lineage-mode, --extend-minutes on both, --review-focus on review, and --model/--reasoning-effort/--count nested under --executor)?
```

Options:
```text
Add the flags (Recommended)
Leave hints as they are
```

Answer:
```text
Add the flags (Recommended)
```

### Q014
<!-- source: claude:5789dc27-c573-44e7-afdc-52d0e17986b0:chat:fbf69d96-0603-413a-ac3f-361401b03e88:b1c1feb7-944a-4477-9429-1714fa33af62 -->

Question:
```text
Your call: should I do the closure pass in this packet? That means running the probe once, marking each row with its evidence, and proposing decision records for AC-019 and AC-008 for you to approve.
```

Options:
```text
Yes
No
```

Answer:
```text
fix
```

<!-- /ANCHOR:operator-answers-verbatim -->

---
