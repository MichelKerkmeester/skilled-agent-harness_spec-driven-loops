---
title: "Decision Record: sk-communication clarity program"
description: "The eight operator decisions that unblock the program: three rule conflicts and five engine questions, each with its alternatives and consequences."
trigger_phrases:
  - "clarity program decisions"
  - "colon rule rejected"
  - "send the standard as the instruction"
  - "claim based omission floor"
  - "no-op projection outcome"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/006-sk-communication-clarity/002-synthesis-and-decisions"
    last_updated_at: "2026-09-12T17:00:00Z"
    last_updated_by: "opus-5-session"
    recent_action: "Recorded the eight operator decisions that gate the downstream phases"
    next_safe_action: "Build the allocation table, then open phase 003"
    blockers: []
    key_files:
      - "repo-rules/communication.md"
      - ".opencode/skills/sk-communication/cli-communication-projection/src/config/local-provider.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "opus-5-clarity-program"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The colon-clause ban: rejected"
      - "The banned framework word: adopted for reply prose only"
      - "The unconfirmed-cause qualifier: adopted"
      - "The engine lane: stays a smoothing pass, declared as such"
      - "Detectors: none; the standard becomes the instruction"
      - "Content-loss floor: claim-based omission check"
      - "An unchanged candidate: recorded as a distinct no-op"
      - "Thinking mode: provider-default on both profiles"
---
# Decision Record: sk-communication clarity program

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Eight decisions, taken by the operator on 2026-09-12 against the two research syntheses in this
> packet. Three settle rule conflicts the sources raised. Five settle engine questions the
> skill-logic research raised. Every downstream phase reads this file for its authorised scope.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Reject the colon-clause ban

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-12 |
| **Deciders** | Operator, on the research syntheses in this packet |

---

<!-- ANCHOR:adr-001-context -->
### Context

The response-style source forbids a colon followed by any clause except a literal list of three or more items. This repository's reply-shape rule does the opposite twice: it offers a colon as the em-dash replacement and names a list after a colon as a legitimate case. The rule that offers it also demonstrates the banned shape inside its own em-dash paragraph and again in its failure-prevented line.

### Constraints

- One instruction per punctuation mark across the whole rule set is a property the contradiction scan exists to protect.
- Adoption would require auditing and grandfathering the label-then-list convention every rule file already uses.
- The underlying habit the ban targets is already being adopted as two separate candidates.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Keep the existing rule unchanged and adopt no colon restriction.

**How it works**: Nothing changes. The conflict is recorded as resolved in favour of the status quo, and the first-line contract plus the label-before-payload principle carry the coverage instead.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Reject, keep the rule** | No audit, no per-surface exception, coverage already arrives through two adopted candidates | The colon-clause shape stays permitted in replies | 8/10 |
| Adopt for replies only | Catches the shape where prose is read once | One mark then carries two instructions depending on surface, which the contradiction scan is built to forbid | 4/10 |
| Adopt fully and rewrite the rule files | Single consistent instruction everywhere | A repo-wide rewrite of untouched files for a stylistic reason, including the rule that recommends the colon | 3/10 |

**Why this one**: The failure the ban targets is announcing a point before making it, and that failure is already covered by the first-line contract and the label-before-payload principle. A punctuation ban adds audit cost without adding coverage.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- One instruction per mark survives intact, so the contradiction scan keeps its meaning.
- No grandfather clause enters the rule set, so no reader has to remember a surface-scoped exception for a colon.

**What it costs**:
- The colon-clause shape remains permitted in reply prose. Mitigation: the two adopted candidates catch the underlying habit, so the shape is constrained by what it may do rather than by the mark itself.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The habit persists in a form the two adopted candidates miss | Low | Recorded as a candidate for a later round rather than reopened now; the measurement phase would surface it as a scored dimension |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A conflict between two binding documents had to be resolved either way |
| 2 | **Beyond Local Maxima?** | PASS | Three options were weighed, including the narrower reply-only scope |
| 3 | **Sufficient?** | PASS | Rejection is the smallest possible change and it leaves the coverage argument intact |
| 4 | **Fits Goal?** | PASS | Unblocks phases 3, 6 and 8, all of which touch punctuation guidance |
| 5 | **Open Horizons?** | PASS | Leaves the ban available to revisit if the measurement phase shows the two candidates are insufficient |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- No file changes. The rejection is recorded here and in the allocation table.

**How to roll back**: Not applicable, nothing was changed. To reverse the decision, supersede this ADR and open the adoption as a new candidate.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Scope the banned framework word to reply prose

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-12 |
| **Deciders** | Operator, on the research syntheses in this packet |

---

<!-- ANCHOR:adr-002-context -->
### Context

The response-style source bans the phrase load-bearing. It appears four times across the root doc and the evidence rule, where it names the class of claim the proof standards govern. A style source cannot ban the root doc's own vocabulary, but the phrase does read as a tic in ordinary reply prose.

### Constraints

- The root doc binds and outranks any rule file or external source.
- The four occurrences are deliberate vocabulary, not accidental phrasing.
- A surface-scoped exception has to be findable by a reader who only loads the reply-shape rule.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Adopt the ban for user-facing reply prose and exempt repository-owned framework wording.

**How it works**: The reply-shape rule gains the phrase in its filler list, with an explicit carve-out naming framework vocabulary. The four existing occurrences stay.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Adopt for reply prose only** | Removes the tic where it reads as one, keeps the term where it does work | Adds a surface-scoped exception a reader has to remember | 7/10 |
| Reject the ban | No exception to remember, root doc vocabulary untouched | The phrase keeps appearing in replies where it is filler | 6/10 |
| Adopt and rename the framework term | One instruction, no exception | Renames a concept several rules depend on, for a stylistic reason | 2/10 |

**Why this one**: The phrase does two different jobs on two different surfaces, so a single instruction would be wrong on one of them. The operator chose the scoped form over outright rejection.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- The tic leaves reply prose, which is where the source's evidence about it applies.
- The framework keeps the term its proof standards are written around.

**What it costs**:
- A surface-scoped exception enters the filler list. Mitigation: the carve-out is written into the same list entry rather than a separate section, so a reader cannot find the ban without finding the exemption.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The exemption is read as covering any document, not only framework wording | Medium | The carve-out names framework vocabulary specifically, and the contradiction scan checks the entry against the root doc's four occurrences |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The conflict had to be resolved and both sides had a real claim |
| 2 | **Beyond Local Maxima?** | PASS | Rejection and full adoption were both weighed |
| 3 | **Sufficient?** | PASS | A single list entry with a carve-out is the smallest form this decision can take |
| 4 | **Fits Goal?** | PASS | Unblocks phase 8, which owns the filler list's host file |
| 5 | **Open Horizons?** | PASS | The exemption can be withdrawn later without touching the four occurrences |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- The reply-shape rule's filler list gains the phrase plus a framework-wording carve-out, in phase 8's scope.
- The four existing occurrences in the root doc and the evidence rule are unchanged.

**How to roll back**: Remove the list entry and its carve-out together. Nothing else depends on it.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Adopt the unconfirmed-cause qualifier

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-12 |
| **Deciders** | Operator, on the research syntheses in this packet |

---

<!-- ANCHOR:adr-003-context -->
### Context

The ADHD source requires an error report to lead with cause then fix. The evidence rule requires an unconfirmed cause be marked as such. The ordering is useful and the requirement is right, so the conflict is over whether a cause may be named before anything confirms it.

### Constraints

- The evidence rule's three tiers keep governing and cannot be weakened by a reporting shape.
- The source's own evaluation results penalise reports that assert a cause on partial evidence, which corroborates the risk rather than the source's phrasing.
- The qualifier lands in the rule every completion claim reads, so it has the widest reach of the three rule conflicts.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Adopt the source's cause-then-fix ordering, with the cause's epistemic status made explicit whenever nothing has confirmed it.

**How it works**: The evidence rule gains a reporting clause: keep the ordering, and where no run confirms the cause, label it as suspected and name the next check. A confirmed cause is reported as a finding.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Adopt the qualifier** | Keeps the useful ordering, closes the tension, corroborated by the source's own evaluation | Adds a reporting shape to a proof rule, where it could be misread as licence | 8/10 |
| Reject, keep the rule unchanged | No risk of weakening a proof rule | Error reports keep burying the fix behind hedging, which is the failure the source names | 5/10 |

**Why this one**: This is the only one of the three rule conflicts with a mechanical resolution rather than a preference, so it is the one that should be settled in the rules rather than left to judgment.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- An error report leads with what to do, which is what a reader under pressure needs first.
- An unconfirmed cause is visibly unconfirmed rather than hedged into vagueness or omitted.

**What it costs**:
- A reporting shape now sits inside a proof rule. Mitigation: the clause is read against the three tiers before it lands, and phase 8 tests three adversarial readings of it.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The clause is read as permitting an unconfirmed cause to be asserted | High | Phase 8 requires reading it beside the tier table and attempting three adversarial readings: a cause with no status, a status word that reads as confirmation, and a fix offered with no cause |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A real tension existed between two binding requirements |
| 2 | **Beyond Local Maxima?** | PASS | Rejection was weighed, and the source's own evaluation data was used rather than its phrasing |
| 3 | **Sufficient?** | PASS | A single clause, not a new section or a new rule file |
| 4 | **Fits Goal?** | PASS | Unblocks phase 8 and improves the shape of every error report |
| 5 | **Open Horizons?** | PASS | The clause can be tightened later without disturbing the tiers |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- The evidence rule gains the reporting clause, in phase 8's scope.

**How to roll back**: Revert the clause alone. The tiers are untouched, so removing it restores today's behaviour exactly.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Keep the projection a smoothing pass and declare it

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-12 |
| **Deciders** | Operator, on the research syntheses in this packet |

---

<!-- ANCHOR:adr-004-context -->
### Context

The engine re-renders text in plainer words, which the clarity source calls smoothing and singles out as not being a rewrite. Extending the lane to cutting and reordering was the alternative. The fidelity contract decides whether that is even admissible: the structure signature preserves order for headings, lists, quotes, fences and tables, and is count-based for inline links, reference links, inline code and HTML. So a reorder that moves a heading is caught and a headingless prose reorder is invisible.

### Constraints

- The canonical original must be preserved and every failed path must return exact-original bytes.
- The structure signature cannot currently distinguish a headingless prose reorder from a copy edit.
- The skill's design argument is that it has exactly one lane.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: Keep the lane a smoothing pass, and make both rewrite commands state which pass they perform.

**How it works**: No engine behaviour changes. Each command document declares that it rewords without reordering, so a reader knows what will happen to their text.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Keep smoothing, declare it** | Preserves a guarantee the contract can actually enforce, and the declaration is already in phase 4's scope | The clarity source's strongest claim about rewriting goes unadopted | 8/10 |
| Extend the contract, then the lane | Would adopt the source's claim properly | Requires the structure signature to become position-aware for prose, reopening an invariant the original packet froze | 5/10 |
| Two declared operations | Keeps today's guarantee on the default path | Adds a second lane to a skill whose whole argument is that it has one | 4/10 |

**Why this one**: Extending the lane without extending the contract would remove a guarantee rather than add a capability, and extending the contract is a larger piece of work than this program should absorb.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- A reader knows whether their text will be reordered, which they cannot tell today.
- The fidelity guarantee stays enforceable by the check that exists.

**What it costs**:
- The cut-and-reorder recommendation goes unadopted. Mitigation: it is recorded as an unhomed candidate with its blocking reason, so a later round starts from the contract question rather than the lane question.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The declaration is written as marketing rather than as a contract | Low | Phase 4 requires both command documents name the pass in their own text, checked by reading both plus their runtime mirrors |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A source claim contradicted the engine's core operation and had to be answered |
| 2 | **Beyond Local Maxima?** | PASS | Three options weighed, including extending the contract |
| 3 | **Sufficient?** | PASS | A documentation change rather than an engine change is the smallest form |
| 4 | **Fits Goal?** | PASS | Unblocks phase 4 and removes ambiguity for every operator who runs a rewrite |
| 5 | **Open Horizons?** | PASS | Leaves the contract extension available as its own future decision |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- Both rewrite command documents declare the pass they perform, in phase 4's scope.
- No engine behaviour changes.

**How to roll back**: Revert the two command documents and their runtime mirrors together.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Send the wording standard as the provider instruction, and build no detectors

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-12 |
| **Deciders** | Operator, on the research syntheses in this packet |

---

<!-- ANCHOR:adr-005-context -->
### Context

The engine's entire provider-facing instruction is thirteen words, declared twice as a literal with a third copy in a test fixture. The skill's documentation says plain English is the wording standard and that every rewrite path routes there rather than carrying a private rubric. Nothing composes standard content onto the instruction before it is sent, so the provider receives the label alone. The alternative was a detector layer with deterministic repairs.

### Constraints

- The skill's own rule gives the wording standard exactly one home.
- Detectors in engine code would be a second home for wording knowledge whatever they are called.
- The instruction reaches the provider as a system message through two builders, and the contract types it as an opaque string.
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: Replace the thirteen-word instruction with the wording standard's reply base, and build no detector layer.

**How it works**: The single hoisted instruction constant resolves to the standard's reply base rather than a literal sentence. The base is the product of the standard's restructure, so this depends on that phase.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Send the standard, no detectors** | Fixes the largest finding directly, keeps one home, needs no new framework | A much longer system instruction on every rewrite, with its token cost | 9/10 |
| The standard carries machine-readable detectors | Deterministic repairs, one home preserved | The standard gains a structured format it has never had, and another skill owns that file | 5/10 |
| Detectors in engine code | Fastest to build, most precise repairs | A second home for wording knowledge, which the skill's own rule forbids | 2/10 |

**Why this one**: The response-style source's own argument is that a concrete rule is followed far better than a stated preference, and the standard already is the concrete rules. Sending it is the direct fix; a detector layer is a new mechanism for a problem the existing standard already describes.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- The documented routing becomes true at runtime instead of only in prose.
- A rewrite through a local or external provider is held to the same standard as one through the in-context engine.

**What it costs**:
- Every provider request carries a much larger system instruction. Mitigation: the reply base is a proper subset of the standard, so it is smaller than the current file, and the measurement phase can quantify the cost.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The base is large enough to crowd the provider's context on a long target | Medium | The bounded-context limits already cap the target size, and the measurement phase records the instruction size as a baseline |
| The base drifts from what a reply needs, silently degrading every rewrite | Medium | The standard has one home, so a change reaches the engine without a code edit, which is the property this decision preserves |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The documented standard has no runtime carrier, which is the program's largest single finding |
| 2 | **Beyond Local Maxima?** | PASS | Two detector designs were weighed and both rejected on the one-home rule |
| 3 | **Sufficient?** | PASS | Pointing the existing constant at the base is the smallest change that fixes the finding |
| 4 | **Fits Goal?** | PASS | Unblocks phase 4 and is the reason phase 7 must precede it |
| 5 | **Open Horizons?** | PASS | Keeps one home, so future standard changes reach the engine with no code change |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- The hoisted instruction constant resolves to the standard's reply base, in phase 4's scope.
- Phase 7 must land first, because the base is its output.
- No detector module is created.

**How to roll back**: Point the constant back at the literal sentence. The literal is preserved in this ADR, so the revert needs no archaeology.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: Add a claim-based content-loss floor

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-12 |
| **Deciders** | Operator, on the research syntheses in this packet |

---

<!-- ANCHOR:adr-006-context -->
### Context

The engine has no content-loss floor. Its validator checks for facts added, polarity changed, requirement strength changed and priority changed, all of which detect addition or alteration. None detects omission, so a candidate that silently drops a caveat can pass.

### Constraints

- The check has to run without changing the accept or reject outcome of any correct rewrite.
- A proportion threshold is mechanically simple but semantically blunt.
- The existing reject-only judge already carries semantic comparison, so a new check should use that path rather than a parallel one.
<!-- /ANCHOR:adr-006-context -->

---

<!-- ANCHOR:adr-006-decision -->
### Decision

**We chose**: Reject a candidate when a claim, caveat or requirement present in the source is absent from it.

**How it works**: An omission check joins the existing semantic comparisons, in the same guard, so it runs on exactly the candidates the other comparisons run on.
<!-- /ANCHOR:adr-006-decision -->

---

<!-- ANCHOR:adr-006-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Claim-based omission check** | Matches the direction the existing checks already point, catches the case that actually matters | Needs the semantic judge, so it is not purely deterministic | 8/10 |
| A proportion threshold | Mechanically checkable and cheap | A legitimately tightened paragraph fails while a same-length rewrite that drops a caveat passes | 3/10 |
| No floor | No new rule, cheapest | The omission case stays unchecked by anything | 4/10 |

**Why this one**: The validator already asks whether the candidate added or altered a claim. Asking whether it dropped one completes the set rather than introducing a new kind of check.
<!-- /ANCHOR:adr-006-alternatives -->

---

<!-- ANCHOR:adr-006-consequences -->
### Consequences

**What improves**:
- A dropped caveat is caught, which is the failure mode a plainer rewrite is most likely to produce.
- The check sits beside its siblings, so a reader finds all four claim comparisons in one place.

**What it costs**:
- The semantic judge runs on more candidates. Mitigation: it runs only inside the existing guard, so an unchanged candidate still skips it.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The check rejects a correct rewrite that legitimately compressed two claims into one | Medium | Phase 4 exercises that case explicitly, and a rejection returns exact-original bytes rather than a broken result |
<!-- /ANCHOR:adr-006-consequences -->

---

<!-- ANCHOR:adr-006-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The omission case is unchecked today and it is the likeliest failure of a plainer rewrite |
| 2 | **Beyond Local Maxima?** | PASS | A proportion threshold and doing nothing were both weighed |
| 3 | **Sufficient?** | PASS | Joining the existing comparisons is smaller than a new subsystem |
| 4 | **Fits Goal?** | PASS | Unblocks phase 4 and strengthens the invariant the package is built around |
| 5 | **Open Horizons?** | PASS | The definition of a claim can be tightened later without moving the check |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-006-five-checks -->

---

<!-- ANCHOR:adr-006-impl -->
### Implementation

**What changes**:
- The fidelity validator gains an omission comparison inside the existing guard, in phase 4's scope.

**How to roll back**: Remove the comparison. The other four are untouched and today's behaviour returns.
<!-- /ANCHOR:adr-006-impl -->
<!-- /ANCHOR:adr-006 -->

---

<!-- ANCHOR:adr-007 -->
## ADR-007: Record an unchanged candidate as a distinct no-op outcome

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-12 |
| **Deciders** | Operator, on the research syntheses in this packet |

---

<!-- ANCHOR:adr-007-context -->
### Context

A candidate returned verbatim currently passes. It is indistinguishable in the record from a successful rewrite, and it is also indistinguishable from a provider that did nothing. Rejecting it outright would turn a model's correct judgment that no change is needed into a failure.

### Constraints

- Returning exact-original bytes is the designed safe path and must stay valid.
- The accept record does not currently say what kind of change a candidate made.
- The measurement phase needs to tell a no-op from a rewrite to interpret any result.
<!-- /ANCHOR:adr-007-context -->

---

<!-- ANCHOR:adr-007-decision -->
### Decision

**We chose**: Record an unchanged candidate as its own outcome, neither a pass nor a failure.

**How it works**: The change-kind field added to the accept record carries a no-op value, so the outcome is visible without being an error.
<!-- /ANCHOR:adr-007-decision -->

---

<!-- ANCHOR:adr-007-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **A distinct no-op outcome** | Keeps a legitimate no-change judgment valid while making it visible, pairs with the change-kind record | A third outcome for any consumer of the record to handle | 8/10 |
| Reject as not-a-projection | Loud and unambiguous | A correct no-change decision is reported as a failure, indistinguishable from a broken provider | 4/10 |
| Keep passing it | No change at all | A no-op stays hidden inside a pass, and the measurement phase cannot see it | 3/10 |

**Why this one**: The two existing options both lose information. A third outcome is the only one that preserves both the safe path and the visibility.
<!-- /ANCHOR:adr-007-alternatives -->

---

<!-- ANCHOR:adr-007-consequences -->
### Consequences

**What improves**:
- The measurement phase can separate no-ops from rewrites, without which a quality delta is uninterpretable.
- A provider that silently does nothing becomes visible in the record.

**What it costs**:
- Consumers of the accept record handle a third outcome. Mitigation: it is a value on a field being added anyway, not a new field.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A consumer treats the no-op value as a failure | Low | The value is named for what it is and the record's existing pass and reject states are unchanged |
<!-- /ANCHOR:adr-007-consequences -->

---

<!-- ANCHOR:adr-007-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A no-op is currently indistinguishable from a rewrite, and the measurement phase needs the distinction |
| 2 | **Beyond Local Maxima?** | PASS | Both rejecting and passing were weighed, and both lose information |
| 3 | **Sufficient?** | PASS | A value on a field already being added is the smallest possible form |
| 4 | **Fits Goal?** | PASS | Unblocks phase 4 and is a prerequisite for interpreting phase 5's results |
| 5 | **Open Horizons?** | PASS | Leaves rejecting a no-op available later if that turns out to be wanted |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-007-five-checks -->

---

<!-- ANCHOR:adr-007-impl -->
### Implementation

**What changes**:
- The accept record's change-kind field gains a no-op value, in phase 4's scope.

**How to roll back**: Stop emitting the value. The field remains and the other values are unaffected.
<!-- /ANCHOR:adr-007-impl -->
<!-- /ANCHOR:adr-007 -->

---

<!-- ANCHOR:adr-008 -->
## ADR-008: Align both provider profiles on provider-default thinking mode

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-12 |
| **Deciders** | Operator, on the research syntheses in this packet |

---

<!-- ANCHOR:adr-008-context -->
### Context

The two profiles disagree: the local provider uses provider-default and the external CLI path uses disabled. The field is not a quality dial. When it is anything other than provider-default, the engine looks up the provider's thinking mapping and sets a wire field, and if the provider cannot confirm thinking-control capability the whole request compile returns unsupported and the rewrite does not happen. With provider-default the block is skipped and nothing can fail on that axis.

### Constraints

- A non-default value fails the compile against any provider without confirmed thinking-control capability.
- The measurement phase needs the two lanes comparable.
- The disagreement is undocumented today, so one of the two values is unintentional.
<!-- /ANCHOR:adr-008-context -->

---

<!-- ANCHOR:adr-008-decision -->
### Decision

**We chose**: Set both profiles to provider-default.

**How it works**: The external CLI profile changes from disabled to provider-default, matching the local profile. The thinking block is then skipped on both paths.
<!-- /ANCHOR:adr-008-decision -->

---

<!-- ANCHOR:adr-008-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Provider-default on both** | No provider is refused for lacking a capability it cannot prove, widest compatibility | Two providers can default differently, so the measurement phase cannot fully control the variable | 7/10 |
| Disabled on both | Fails closed and removes the variable entirely | Any provider without confirmed thinking-control capability becomes unusable rather than silently working | 6/10 |
| Keep them different | No change | The divergence stays unintentional and the lanes stay non-comparable | 2/10 |

**Why this one**: The operator chose compatibility over strictness. A copy-editing pass at a fixed low temperature does not need a reasoning pass either way, so refusing a provider over an unprovable capability costs more than it buys.
<!-- /ANCHOR:adr-008-alternatives -->

---

<!-- ANCHOR:adr-008-consequences -->
### Consequences

**What improves**:
- No provider is refused for a capability it cannot prove.
- The two lanes agree, so the divergence stops being an undocumented accident.

**What it costs**:
- Two providers can apply different defaults, so a quality delta cannot be fully attributed. Mitigation: the measurement phase records which provider produced each result, so the variable is visible even though it is not controlled.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A provider's default reasoning pass changes rewrite behaviour between runs | Medium | Phase 5 records the provider per result, so an unexplained variance has somewhere to be traced to |
<!-- /ANCHOR:adr-008-consequences -->

---

<!-- ANCHOR:adr-008-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The profiles disagree today and one value is unintentional |
| 2 | **Beyond Local Maxima?** | PASS | Both the strict and the permissive alignment were weighed, with the failure behaviour established from the code |
| 3 | **Sufficient?** | PASS | A one-value change on one profile |
| 4 | **Fits Goal?** | PASS | Unblocks phase 4 and removes a variable phase 5 would otherwise have to explain |
| 5 | **Open Horizons?** | PASS | Either value can be revisited once the measurement phase has data |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-008-five-checks -->

---

<!-- ANCHOR:adr-008-impl -->
### Implementation

**What changes**:
- The external CLI profile's thinking mode changes to provider-default, in phase 4's scope.

**How to roll back**: Set it back to disabled. The field is a single literal on one profile.
<!-- /ANCHOR:adr-008-impl -->
<!-- /ANCHOR:adr-008 -->

---
