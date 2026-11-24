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
    last_updated_at: "2026-11-24T18:12:03Z"
    last_updated_by: "claude-code"
    recent_action: "Recorded ADR-008 for the ninth fix round"
    next_safe_action: "Record any decision the traceability rerun raises"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-012-deep-loop-command-offers"
      parent_session_id: null
    completion_pct: 95
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

<!-- ANCHOR:adr-003 -->
## ADR-003: Waive AC-008 on the measured offer rate

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-23 |
| **Deciders** | Operator, who chose "Change to Waived" on 2026-11-23 |

---

<!-- ANCHOR:adr-003-context -->
### Context

AC-008 asks that a session on F3, F5 or F6 answer first with the three-option offer. F6 asked it in 1 of 4 runs after the routing-step edit, and in 0 of 8 runs after packet 013 put the options in the brief. The F3 and F5 files hold only a final turn that points back at an earlier reply, so they cannot show the offer. The live terminal check quoted in `implementation-summary.md` has no transcript in `scratch/`. The row had been set to `Met` with the rate disclosed, but `Met` means verified.

### Constraints

- The status table in `acceptance-criteria.md`: "`Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell."
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: set AC-008 to `Waived` and record the measured rates here.

**How it works**: no code changes. The offer stays taught in the command docs and named in the brief, and the rates stay in the behaviour files of both packets.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Waive with the rates** | The status says what was measured | The criterion stays unmet in substance | 8/10 |
| Keep `Met` with the rate disclosed | No change | `Met` claims a verification the evidence does not hold | 3/10 |

**Why this one**: a waiver states the gap plainly, and the rates stay on record.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- The acceptance table no longer claims a verified offer.

**What it costs**:
- The packet closes with a behaviour criterion not reached.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A later reader treats the waiver as a pass | M | The rates are in this ADR and in both implementation summaries |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | `Met` overstated the evidence |
| 2 | **Beyond Local Maxima?** | PASS | Two wordings were sampled across 12 runs |
| 3 | **Sufficient?** | PASS | A status change only |
| 4 | **Fits Goal?** | PASS | The docs say what was measured |
| 5 | **Open Horizons?** | PASS | A later fix can set the row back to `Met` with new runs |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- AC-008 reads `Waived` with `ADR-003`.

**How to roll back**: set AC-008 back to `Met` with `-` in its Waiver cell.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Narrow D2 so a loop name about the loop's own code is not an ask

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-23 |
| **Deciders** | Operator, who chose "Narrow D2" on 2026-11-23 |

---

<!-- ANCHOR:adr-004-context -->
### Context

D2 counts naming deep research, deep review, a research loop or a review loop as an explicit loop ask. A fresh review showed that this offers the loop on prompts about the loop's own code or results, such as "refactor the deep research scorer", "fix the bugs the deep review found" and "open the review loop config". It also offers it on counts that describe a subject, such as "compare 10 iterations of the model" and "research three-pass vs two-pass compilers".

### Constraints

- D2 in `scratch/decisions.md` is the operator's rule, so narrowing it needs the operator.
- The keep and gain probes must keep their commands.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: a loop name counts as an ask only when no code, file or result noun follows it and no edit or fix verb leads it. A pass or iteration count counts only when it measures the loop rather than a subject.

**How it works**: the gate in `command-attach.ts` and its Python copy read the words around the loop name before they count it, and the shared fixture pins both sides.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Narrow D2** | Ends the topic-mention false offers | Each new reading can drop a real ask, so the controls and probes must hold | 8/10 |
| Keep D2 | No change | Every mention of the loop's code keeps offering the loop | 4/10 |

**Why this one**: the topic mentions are common in this repository, and each one now costs a recommended `:auto` question.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- Prompts about the loop's code, results or config stop getting the offer.

**What it costs**:
- The gate carries more readings to keep in step between TypeScript and Python.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A real ask is read as a subject | M | Controls in the fixture and the 69-probe rerun |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Nine reported false offers |
| 2 | **Beyond Local Maxima?** | PASS | Keeping D2 was weighed |
| 3 | **Sufficient?** | PASS | Readings in one gate and its copy |
| 4 | **Fits Goal?** | PASS | Offer only when the loop is asked for |
| 5 | **Open Horizons?** | PASS | Each reading is one pattern to revert |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- REQ-019 and T058 carry the narrowed rule. D11 in `scratch/decisions.md` points here.

**How to roll back**: revert the T058 commit and remove D11.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: A typed deep command outranks the stuck-run diagnosis on the served head

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-24, recording the operator's confirmation of 2026-11-23 |
| **Deciders** | Operator, who confirmed on 2026-11-23 that the typed command stays on the head (Q034, implementation-summary limitation 6) |

---

<!-- ANCHOR:adr-005-context -->
### Context

"my deep review run is stuck, /deep:review again" is both a stuck-run complaint and a typed command. `attachCommand` answers a stuck run with `/doctor:deep-loop`, and the handler then runs `attachTypedCommand`, which puts the typed `/deep:review (ask)` back on the top row. The Python fallback dropped the run row on every stuck run, typed or not. REQ-020, SC-005 and AC-027 stated parity and hook results without naming this case, so a three-lineage deep review on 2026-11-24 filed it as a P1 closure-record gap and as a native and fallback disagreement.

### Constraints

- The served behaviour is the operator's settled choice and is not to change.
- The native and fallback heads should not give a reader two answers to one prompt.
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: a typed `/deep:*` command stays on the served head even on a stuck-run complaint, with policy `ask`, so the reader still answers one question before any run. `attachCommand` keeps answering `/doctor:deep-loop`, because it is the layer that reads the prompt's wording, and the gate-layer parity with Python holds on the stuck-run predicate. The Python fallback, which has no separate typed layer, keeps a typed run row on a stuck complaint, so both served heads agree.

**How it works**: REQ-020 and AC-027 cover the gate layer, and REQ-029 and AC-036 cover the served head. The shared fixture carries two typed columns: `typedReviewKept` for `attachCommand`, and `servedReviewKept` for the served head, which the TypeScript suite reads through `attachTypedCommand` and the Python suite reads from its gate.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Typed command kept on both served heads** | The reader's own choice wins, and both paths agree | The doctor is not offered on that prompt | 8/10 |
| Typed command kept natively, dropped by Python | No Python change | The fallback brief answers the same prompt differently | 4/10 |
| Stuck diagnosis outranks the typed command everywhere | One reading of a stuck run | Reverses the operator's settled choice | 2/10 |

**Why this one**: the operator ruled on the served head, and the fallback brief is a served head too.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- The docs state the exception, and both served paths give one answer.

**What it costs**:
- A reader who types the command on a stuck run is offered a new run rather than the diagnosis. The `ask` policy still stops before any spend.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A later edit to `typedCommandForTop` moves the native head away from Python | M | The serving-layer test and the `servedReviewKept` column pin both |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | One P1 found by two lineages |
| 2 | **Beyond Local Maxima?** | PASS | Three placements weighed |
| 3 | **Sufficient?** | PASS | One Python branch and one fixture column |
| 4 | **Fits Goal?** | PASS | A typed command is the reader's explicit ask |
| 5 | **Open Horizons?** | PASS | Reverting is one condition in each copy |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- REQ-020, SC-005 and AC-027 name the exception now. REQ-029, AC-036 and the sixth-round tasks carry the served-layer pin and the Python alignment.

**How to roll back**: restore the stuck drop for typed rows in `_apply_deep_loop_offer_gate`, set `servedReviewKept` to false on the typed-stuck case, and add a stuck check to `typedCommandForTop`.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: A bare deep loop, research loop or review loop name is not a loop ask

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-24 |
| **Deciders** | Recorded under the operator's instruction to run the sixth round autonomously (Q035). It keeps the behaviour the gate has shipped with, and the operator can reverse it. |

---

<!-- ANCHOR:adr-006-context -->
### Context

D2 lists naming a deep loop, deep research, deep review, a research loop or a review loop as an explicit loop ask. The gate counts bare "deep research" and "deep review", but it counts "deep loop", "research loop" and "review loop" only behind a use, continue or want verb, so "deep loop: audit the payments flow" gets no command while "deep review: audit the payments flow" does. The deep review of 2026-11-24 found that the narrowing had no recorded decision. ADR-004 covers only loop names that name the loop's own code or results.

### Constraints

- D2's purpose is to offer the loop only on an explicit ask.
- The keep and gain probes must keep their commands.
<!-- /ANCHOR:adr-006-context -->

---

<!-- ANCHOR:adr-006-decision -->
### Decision

**We chose**: keep the current behaviour. "Deep research" and "deep review" count on their own, and the three loop names count only behind a use, continue or want verb.

**How it works**: `LOOP_NAMES` in `command-attach.ts` and `_LOOP_NAME` in `skill_advisor.py` are read only through the verb-led alternations of `LOOP_REQUEST`. A shared fixture row pins "deep loop: audit the payments flow" as no ask.
<!-- /ANCHOR:adr-006-decision -->

---

<!-- ANCHOR:adr-006-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Keep the verb requirement** | No new false offers. A bare loop name is as often a question or a topic as a request, as in "the review loop keeps the PR open" | A terse "deep loop: audit X" gets no command | 7/10 |
| Count a bare loop name | Matches D2's list word for word | Widens the gate against D2's explicit-ask rule, and every topic mention of the loop offers a run | 4/10 |

**Why this one**: changing it would widen the offer gate, which D2 exists to narrow. The cost of a miss is a skill suggestion with no command, and the reader can still type the command.
<!-- /ANCHOR:adr-006-alternatives -->

---

<!-- ANCHOR:adr-006-consequences -->
### Consequences

**What improves**:
- The spec states the rule the code has run since the first round.

**What it costs**:
- "deep loop: audit the payments flow" offers no command.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A terse loop request is missed | L | The fixture row records it, and a typed command still asks |
<!-- /ANCHOR:adr-006-consequences -->

---

<!-- ANCHOR:adr-006-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The review found the narrowing unrecorded |
| 2 | **Beyond Local Maxima?** | PASS | Counting the bare name was weighed |
| 3 | **Sufficient?** | PASS | A spec line, this record and one fixture row |
| 4 | **Fits Goal?** | PASS | Offer only on an explicit ask |
| 5 | **Open Horizons?** | PASS | Reversing it is one alternation in each copy |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-006-five-checks -->

---

<!-- ANCHOR:adr-006-impl -->
### Implementation

**What changes**:
- The D2 bullet in `spec.md` names the verb requirement and points here. The sixth-round fixture adds the no-ask row.

**How to roll back**: add a bare-name alternation for `LOOP_NAMES` to `LOOP_REQUEST` and `_LOOP_REQUEST_RE`, flip the fixture row, and amend the D2 bullet.
<!-- /ANCHOR:adr-006-impl -->
<!-- /ANCHOR:adr-006 -->

---

<!-- ANCHOR:adr-007 -->
## ADR-007: Amend REQ-011 to the two research aliases the hub carries

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-24 |
| **Deciders** | Operator decision D8 in `scratch/decisions.md`, as amended after the build; recorded in the seventh fix round on the traceability review's P1 |

---

<!-- ANCHOR:adr-007-context -->
### Context

D8 named three loop-shaped research aliases for the hub: `iterative research`, `multi-round research` and `autonomous research`. The build added the first two and dropped the third, because its out-of-domain replay under `.skilled/repo-rules/skill-hub-routing.md` section 4 pulled a slide-deck prompt to the hub. `hub-router.json:34` and `ROUTER.md:63` carry the two that shipped, and T022 records the drop.

REQ-011 was never amended: it still lists all three aliases as reaching both files, so a reader checking the requirement against the tree finds a clause that cannot hold. No acceptance row tested the alias set as built. The traceability review of 2026-11-24 raised this as its P1 finding.

### Constraints

- A requirement is amended by a recorded decision, never by a silent edit of its text. This record is that decision.
- The alias set stays as shipped. Restoring `autonomous research` would re-add the out-of-domain route the replay rejected.
- AC-016, AC-017 and AC-018 state the other clauses of REQ-011 and are left as they were recorded.
<!-- /ANCHOR:adr-007-context -->

---

<!-- ANCHOR:adr-007-decision -->
### Decision

**We chose**: amend REQ-011 to the two research aliases the tree carries, record the drop here, and give the requirement an owning acceptance row that reads the alias set as built.

**How it works**: REQ-011 names `iterative research` and `multi-round research` as the delivered set and points at this record for the third alias. AC-043 greps both hub files for the two aliases and for `autonomous research`, so an unrecorded alias change fails a row instead of leaving the requirement and the tree to drift apart.
<!-- /ANCHOR:adr-007-decision -->

---

<!-- ANCHOR:adr-007-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Amend the requirement to the two aliases** | The requirement, the tree and the decision agree | The third alias exists only as a rejected candidate | 9/10 |
| Restore `autonomous research` in both hub files | Keeps D8's first wording | Re-adds the slide-deck route the replay rejected, and needs a fresh replay first | 3/10 |
| Leave REQ-011 and record the drop only in the scratch log | No documentation change | The packet's own requirement stays false, and the coverage gate cannot pass | 1/10 |

**Why this one**: the alias was dropped on measured evidence, so the record has to follow the measurement rather than the plan.
<!-- /ANCHOR:adr-007-alternatives -->

---

<!-- ANCHOR:adr-007-consequences -->
### Consequences

**What improves**:
- REQ-011 can be checked against the tree, and AC-043 fails if an alias is added or dropped without a record.

**What it costs**:
- A reader of D8's first wording needs this record to know why only two aliases shipped.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A later alias is dropped the same way and again goes unrecorded | M | AC-043 reads both hub files, and the requirement names the exact set |
<!-- /ANCHOR:adr-007-consequences -->

---

<!-- ANCHOR:adr-007-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The review found the requirement contradicted by the tree, with no amendment |
| 2 | **Beyond Local Maxima?** | PASS | Restoring the alias was weighed and rejected on the replay |
| 3 | **Sufficient?** | PASS | One requirement sentence, this record and one acceptance row |
| 4 | **Fits Goal?** | PASS | The hub offers the loop on the wording it actually routes |
| 5 | **Open Horizons?** | PASS | Reversing it is one alias in each hub file plus an ADR and a row |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-007-five-checks -->

---

<!-- ANCHOR:adr-007-impl -->
### Implementation

**What changes**:
- REQ-011 names the two aliases and points here. AC-043 tests the set in both hub files. T022 keeps the observed drop.

**How to roll back**: replay the alias against an out-of-domain prompt, add it to `hub-router.json` and `ROUTER.md` if the replay stays off the hub, and amend REQ-011 and AC-043 in the same pass.
<!-- /ANCHOR:adr-007-impl -->
<!-- /ANCHOR:adr-007 -->

---

<!-- ANCHOR:adr-008 -->
## ADR-008: Amend REQ-035 so a mode-free plural loop serves the hub without a command

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-24 |
| **Deciders** | Operator, answering "Amend REQ-035 (Recommended)" in the ninth fix round on the third traceability rerun's P1 |

---

<!-- ANCHOR:adr-008-context -->
### Context

REQ-035 listed "run two deep loops on the cache layer" among the plural prompts that carry `/deep:review` or `/deep:research`. The prompt names neither mode. Its singular, "run a deep loop on the cache layer", has always served the hub with no command, because a deferred route offers a command only when the ask names one mode (REQ-026). The third traceability rerun found that the plural prompt carried no command anywhere and raised it as a P1.

### Constraints

- The gate never guesses a mode the prompt does not name. Guessing would change the singular prompt and the deferred-route probes too.
- A requirement is amended by a recorded decision, never by a silent edit.
<!-- /ANCHOR:adr-008-context -->

---

<!-- ANCHOR:adr-008-decision -->
### Decision

**We chose**: amend REQ-035 so the mode-free plural prompt asks for the run and serves the hub with no command, the same as its singular.

**How it works**: REQ-035 names the seven prompts that name a mode as carrying their command and states the mode-free one separately. The shared fixture row `plural-deep-loops-served` reads `servedRun: null` in both copies, and AC-051 reads the built advisor's result for all eight.
<!-- /ANCHOR:adr-008-decision -->

---

<!-- ANCHOR:adr-008-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Amend REQ-035 to the deferred-route rule** | The requirement, the singular prompt and the gate agree | A plural mode-free ask still gets no command | 9/10 |
| Serve a default mode when none is named | Every plural prompt carries a command | Changes the singular prompt, the deferred-route rule and its probes, and offers a loop the prompt did not pick | 3/10 |
<!-- /ANCHOR:adr-008-alternatives -->

---

<!-- ANCHOR:adr-008-consequences -->
### Consequences

**What improves**:
- REQ-035 can be checked against the tree, and the plural and singular mode-free prompts behave alike.

**What it costs**:
- A reader who asks for "deep loops" without a mode picks the mode from the hub's own routing.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A later round reads a mode into a mode-free ask on one side only | M | The fixture row runs in both copies, and the drift guard compares the mode vocabulary on every surface |
<!-- /ANCHOR:adr-008-consequences -->

---

<!-- ANCHOR:adr-008-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The review found the requirement contradicted by the gate's deferred-route rule |
| 2 | **Beyond Local Maxima?** | PASS | Serving a default mode was weighed and rejected |
| 3 | **Sufficient?** | PASS | One requirement sentence, this record and one acceptance row |
| 4 | **Fits Goal?** | PASS | A command is offered only when the request asks for that loop |
| 5 | **Open Horizons?** | PASS | A default mode can be added later in one gate rule, with its own decision |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-008-five-checks -->

---

<!-- ANCHOR:adr-008-impl -->
### Implementation

**What changes**:
- REQ-035 states the mode-free prompt on its own. AC-051 reads all eight prompts through the built advisor. T097 records the change.

**How to roll back**: give the deferred route a default mode in both gate copies, change the fixture row's `servedRun`, and amend REQ-035 and AC-051 with a new record.
<!-- /ANCHOR:adr-008-impl -->
<!-- /ANCHOR:adr-008 -->

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
| Q015 | Keep the multi-round research hub alias and waive the memo out-of-domain replay in AC-017. | Not stated. | None | decision-record.md ADR-002, acceptance-criteria.md AC-017 |
| Q016 | Record a fresh live behaviour session on the F6 prompt instead of waiving AC-008. | Not stated. | None | scratch/behaviour/F6.md, acceptance-criteria.md AC-008 |
| Q017 | Commit and push the closure pass after the alias and F6 answers are applied. | Not stated. | None | tasks.md T051 |
| Q018 | Rerun the F6 behaviour session outside plan mode with a spend cap. | Not stated. | None | scratch/behaviour/F6.md, acceptance-criteria.md AC-008 |
| Q019 | Commit and push the AC-008 work to origin/main once it is settled. | Not stated. | None | tasks.md T052 |
| Q020 | Keep AC-008 unmet and tighten the offer wording in both deep command documents, then rerun F6. | Not stated. | None | tasks.md T052, .skilled/commands/deep/review.md, .skilled/commands/deep/research.md |
| Q021 | Sample F6 three more times before deciding how to close AC-008. | Not stated. | None | tasks.md T053, scratch/behaviour/F6-sample-1.md |
| Q022 | Hold the push until the AC-008 choice is applied, then push everything together. | Not stated. | None | tasks.md T053 |
| Q023 | Mark AC-008 met on F6 sample 1 and state that 1 of 4 runs since the routing-step edit asked the offer. | Not stated. | None | acceptance-criteria.md AC-008, implementation-summary.md limitation 5 |
| Q024 | Tick each unticked task and checklist item against its own check, mark the packet Complete, then commit and push. | Not stated. | None | tasks.md, spec.md, acceptance-criteria.md |
| Q025 | Leave the pending answers from 13 other sessions alone; each is recorded when its own packet is next saved. | Not stated. | None | none in this packet |
| Q026 | Leave the checkout-dependent top skill on probes H5 and N12 recorded as it is, without investigating the cause. | Not stated. | None | T031, implementation-summary.md Verification |
| Q027 | Replace the recorded pre-change corpus counts with a fresh capture run at the pre-change commit. | Not stated. | None | T003, scratch/corpus-before.json |
| Q028 | Try a save to refresh completion_pct in acceptance-criteria.md and change nothing by hand if it does not. | Not stated. | None | acceptance-criteria.md frontmatter |
| Q029 | Fix the gaps the fresh review found, planned first and built only after approval. | Not stated. | None | REQ-015 to REQ-022, T054 to T064 |
| Q030 | Asked for the fixes as a phase child of this packet, which the phase rules do not allow for a correction. | Not stated. | None | none, superseded by the Structure answer |
| Q031 | Reopen this packet for the gate fixes and packet 013 for the typed-command hint, as the phase rules prescribe for a correction. | Not stated. | the Review fixes and Phase answers | spec.md, tasks.md |
| Q032 | Narrow D2 so a loop name about the loop's own code or results, and a count that describes a subject, is not a loop ask. | Not stated. | None | ADR-004, D11, REQ-019, T058 |
| Q033 | Set AC-008 to Waived with the measured offer rates recorded in an ADR. | Not stated. | None | ADR-003, AC-008 |
| Q034 | Keep a typed deep command on the served head when the prompt also complains about a stuck run. | The typed command is the reader's own choice. Recorded from implementation-summary limitation 6, confirmed 2026-11-23; the capture missed it. | None | ADR-005, REQ-020, REQ-029, AC-027, AC-036 |
| Q035 | Run the sixth remediation round autonomously. | Not stated. Given 2026-11-24 as "Autonomously" when the deep review's remediation was requested. | None | ADR-006, REQ-023 to REQ-034, tasks.md Sixth fix round |
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

### Q015
<!-- source: claude:5789dc27-c573-44e7-afdc-52d0e17986b0:toolu_017rP9ush8rLRbMPhfKD19UH:0 -->

Question:
```text
AC-017: the "multi-round research" hub alias makes "write a memo on multi-round research funding for the grant committee" top the deep-loop hub (no command attached), but K2 "multi-round research into vector index compaction" needs that alias to reach the hub. Keep or drop it?
```

Options:
```text
Keep it (Recommended)
Drop it
```

Answer:
```text
Keep it (Recommended)
```

### Q016
<!-- source: claude:5789dc27-c573-44e7-afdc-52d0e17986b0:toolu_017rP9ush8rLRbMPhfKD19UH:1 -->

Question:
```text
AC-008: the stored F6 behaviour recording answers a different prompt. Record a fresh live session on "extend the finished deep review by 3 iterations" (about $1 of paid turns in a throwaway checkout)?
```

Options:
```text
Record it (Recommended)
Waive it
```

Answer:
```text
Record it (Recommended)
```

### Q017
<!-- source: claude:5789dc27-c573-44e7-afdc-52d0e17986b0:toolu_017rP9ush8rLRbMPhfKD19UH:2 -->

Question:
```text
Commit and push the closure pass (1 test file, 7 packet docs, 3 probe files in worktree 522) to origin/main the same way as before?
```

Options:
```text
After the above (Recommended)
Now
Not yet
```

Answer:
```text
After the above (Recommended)
```

### Q018
<!-- source: claude:5789dc27-c573-44e7-afdc-52d0e17986b0:toolu_014ffjWwLfhAqVXtLn1pkcij:0 -->

Question:
```text
AC-008 (packet 012-deep-loop-command-offers) is the only acceptance row still Unmet. The fresh F6 session ($0.22, plan mode, Sonnet) composed the right command, /deep:review <newest review packet> :auto --extend=3, but wrote a plan for approval instead of asking the one offer question beside the spec-folder question. The earlier F3 and F5 plan-mode sessions did ask. How should AC-008 be closed?
```

Options:
```text
Rerun outside plan (Recommended)
Tighten offer section
Waive with an ADR
```

Answer:
```text
Rerun outside plan (Recommended)
```

### Q019
<!-- source: claude:5789dc27-c573-44e7-afdc-52d0e17986b0:toolu_014ffjWwLfhAqVXtLn1pkcij:1 -->

Question:
```text
Once AC-008 is settled, should the resulting changes be committed and pushed to origin/main the same way as before (owner token, which bypasses the signed-commit rule)?
```

Options:
```text
Commit and push (Recommended)
Commit only
Neither
```

Answer:
```text
Commit and push (Recommended)
```

### Q020
<!-- source: claude:5789dc27-c573-44e7-afdc-52d0e17986b0:toolu_01PssQBUbJ1vTQab2So6W7GU:0 -->

Question:
```text
The F6 rerun outside plan mode ($0.18, 4 turns, nothing written) stopped before acting. It asked one turn with the spec-folder question (A Existing recommended), named the newest finished review and said it would run `/deep:review <target> --spec-folder=<016 packet> --extend=3` once confirmed. It did not present the offer options (A Run it with :auto, B :confirm, C no loop), so the recommended option itself does not carry --extend=3, as AC-008's wording asks. F3 did present a recommended run option (2A fan-out). How should AC-008 be recorded?
```

Options:
```text
Keep Unmet, tighten (Recommended)
Mark Met as observed
Waive with an ADR
```

Answer:
```text
Keep Unmet, tighten (Recommended)
```

### Q021
<!-- source: claude:5789dc27-c573-44e7-afdc-52d0e17986b0:toolu_01L9MRUT8BscTve3DfFcRgAP:0 -->

Question:
```text
AC-008 is still Unmet after the tightening. I made step 0 of both deep command docs name the three offer options (commit 4c70ce2f517) and reran F6 ($0.16). This time the session asked which finished review was meant before it opened the command doc, so it never read the edit. Across three F6 runs, the session acts on the brief's bare '/deep:review (ask)' and never reaches the offer format, which lives one document away. How should AC-008 be closed?
```

Options:
```text
Waive with an ADR (Recommended)
Put format in the brief
Sample more F6 runs
```

Answer:
```text
Sample more F6 runs
```

### Q022
<!-- source: claude:5789dc27-c573-44e7-afdc-52d0e17986b0:toolu_01L9MRUT8BscTve3DfFcRgAP:1 -->

Question:
```text
Two local commits are ready in worktree 522: 4c70ce2f517 (the step 0 wording in both deep command docs) and adc9501f05c (the F6 recordings with AC-008 kept Unmet). You said to push once AC-008 was settled, and it isn't yet. Push them now?
```

Options:
```text
Push after AC-008 (Recommended)
Push now
```

Answer:
```text
Push after AC-008 (Recommended)
```

### Q023
<!-- source: claude:5789dc27-c573-44e7-afdc-52d0e17986b0:toolu_017P9emkhLYwWmvmYc1giqao:0 -->

Question:
```text
The three new F6 samples ($0.49 total, nothing written) split. Sample 1 loaded /deep:review and asked the full offer as text, because headless has no question tool: 'Which packet?' plus A) `/deep:review:auto --extend=3 --spec-folder=<path>` (Recommended), B) :confirm, C) no loop. That matches AC-008 as worded, the same way F3 and F5 did. Samples 2 and 3 first asked which review was meant, since about 30 finished reviews exist, and deferred the command doc. Since the step 0 edit, 1 of 4 runs asked the offer. How should AC-008 be recorded?
```

Options:
```text
Met, rate disclosed (Recommended)
Waive with an ADR
Keep Unmet
```

Answer:
```text
Met, rate disclosed (Recommended)
```

### Q024
<!-- source: claude:5789dc27-c573-44e7-afdc-52d0e17986b0:toolu_01GwFmtxsW2bMNCb8sHGjLaq:0 -->

Question:
```text
Packet 012 (deep-loop command offers) is closeable: every acceptance row is Met, Waived or Superseded and strict validation passes. But tasks.md still has T003 to T036 and the verification checklist unticked, and spec.md says In Progress. What should I do?
```

Options:
```text
Tick, mark Complete, push (Recommended)
Tick and mark Complete, no push
Leave it In Progress
```

Answer:
```text
Tick, mark Complete, push (Recommended)
```

### Q025
<!-- source: claude:5789dc27-c573-44e7-afdc-52d0e17986b0:toolu_01GwFmtxsW2bMNCb8sHGjLaq:2 -->

Question:
```text
13 other sessions have operator answers that were never saved to a packet (for example 306ce05f with 23, f5cd4f6d with 14, 31b4908f with 13). They belong to other packets, not 012. What should happen to them?
```

Options:
```text
Leave them (Recommended)
Write me a list
```

Answer:
```text
Leave them (Recommended)
```

### Q026
<!-- source: claude:5789dc27-c573-44e7-afdc-52d0e17986b0:toolu_019arXajtfnsMvo3vr33UMv3:1 -->

Question:
```text
Probes H5 ("review the sk-doc skill") and N12 ("thoroughly test the login flow in the browser") rank a different top skill depending on the checkout, with no command in either, and no advisor code changed. I haven't found the cause. Should I dig into it?
```

Options:
```text
Leave it recorded (Recommended)
Investigate read-only
```

Answer:
```text
Leave it recorded (Recommended)
```

### Q027
<!-- source: claude:5789dc27-c573-44e7-afdc-52d0e17986b0:toolu_019arXajtfnsMvo3vr33UMv3:2 -->

Question:
```text
T003's pre-change corpus counts (0 of 35 for both) come from the baseline committed earlier, captured at an older commit `62a9359e60a`, not from a fresh run at the pre-change commit `2ef3895f753`. Should I do the fresh run?
```

Options:
```text
Keep as disclosed (Recommended)
Run it fresh
```

Answer:
```text
Run it fresh
```

### Q028
<!-- source: claude:5789dc27-c573-44e7-afdc-52d0e17986b0:toolu_019arXajtfnsMvo3vr33UMv3:3 -->

Question:
```text
The `completion_pct` field in acceptance-criteria.md's frontmatter still reads 0, though the packet is Complete. The save tool owns that field, so I didn't hand-edit it. What should I do?
```

Options:
```text
Leave it (Recommended)
Try a targeted save
```

Answer:
```text
Try a targeted save
```

### Q029
<!-- source: claude:5789dc27-c573-44e7-afdc-52d0e17986b0:toolu_019jcCSwCn3zQ2mNm7s39T17:0 -->

Question:
```text
The fresh Opus review found real gaps in the deep-loop offer epic (I reproduced 6 of them): refusals like "don't do deep research" still get the offer, a typed `/deep:review:confirm` still gets an A/B/C hint recommending :auto, questions like "how many iterations does deep research run" get the offer, "deep-review" with a hyphen loses it, and "not stuck" still routes to the doctor. Some packet claims also overstate the evidence. What should happen?
```

Options:
```text
New fix packet (Recommended)
Fix only the top two
Correct the docs only
Leave it
```

Answer:
```text
New fix packet (Recommended)
```

### Q030
<!-- source: claude:5789dc27-c573-44e7-afdc-52d0e17986b0:toolu_01Cq68zJvcBt7nLNpRtcANCd:0 -->

Question:
```text
You said "phase" for the review-fix work. Which structure do you want?
```

Options:
```text
014 as a phased packet (Recommended)
Phase child of 012
One epic parent over all three
```

Answer:
```text
Phase child of 012
```

### Q031
<!-- source: claude:5789dc27-c573-44e7-afdc-52d0e17986b0:toolu_019S6xoZAFB1hTDor6MaVoin:0 -->

Question:
```text
"Phase child of 012" conflicts with spec-kit's rules. phase-definitions.md §4 says "A standard non-phased packet may not gain phase children unless both qualification thresholds are met, or the work qualifies for a series parent". 012 is Level 2, under the level-3 threshold. §2 also says a series parent needs "a different change", and that "A correction continues that packet with Option A, even when the packet is complete." The review fixes are corrections of 012's own change (and the typed-suffix hint fix corrects 013's). How should I proceed?
```

Options:
```text
Reopen 012 and 013 (Recommended)
Phase child anyway (override)
Standalone 014 instead
```

Answer:
```text
Reopen 012 and 013 (Recommended)
```

### Q032
<!-- source: claude:5789dc27-c573-44e7-afdc-52d0e17986b0:toolu_017NgHjmF6m34GboesBNRQYx:0 -->

Question:
```text
Decision D2 in packet 012 says naming "deep research", "deep review", "research loop" or "review loop" counts as asking for the loop. Because of that, mentions of the loop's own code or results get the offer: "refactor the deep research scorer", "fix the bugs the deep review found", "open the review loop config". Should the fix narrow D2?
```

Options:
```text
Narrow D2 (Recommended)
Keep D2 as is
```

Answer:
```text
Narrow D2 (Recommended)
```

### Q033
<!-- source: claude:5789dc27-c573-44e7-afdc-52d0e17986b0:toolu_017NgHjmF6m34GboesBNRQYx:2 -->

Question:
```text
AC-008 in packet 012 is marked Met on 1 of 4 F6 runs, plus F3 and F5 transcripts that don't show the offer. The reviewer says that should be Waived with a decision record, not Met. Change it?
```

Options:
```text
Change to Waived (Recommended)
Keep Met
```

Answer:
```text
Change to Waived (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->

---
