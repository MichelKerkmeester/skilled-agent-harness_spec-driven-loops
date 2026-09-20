---
title: "Decision Record: Phase 7 Closure Waivers"
description: "Two acceptance criteria could not be met and were not forced. Both are recorded as deliberate waivers with the condition that would satisfy each, rather than marked Met to produce a clean gate."
trigger_phrases:
  - "phase 7 waivers"
  - "advisor smoke test not run"
  - "accept path unexercised"
  - "closure waiver"
  - "waived rather than met"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/040-create-repo-rules/007-validation-and-changelog"
    last_updated_at: "2026-08-31T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Recorded two closure waivers with their satisfying conditions"
    next_safe_action: "Commit, then await a repository that needs a rule"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-007-closeout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 7 Closure Waivers

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: The advisor smoke test was not run

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-31 |
| **Deciders** | Operator, Claude Opus 5 |

---

<!-- ANCHOR:adr-001-context -->
### Context

AC-006 required confirming that a plain-language rule request reaches `sk-create-repo-rule`
rather than a sibling, by querying the skill advisor. The advisor's MCP server failed to
connect repeatedly across this session — reported unavailable more than once, and its tools
withdrawn mid-session.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

Record AC-006 as **Waived**, not Met. Routing was verified by a weaker substitute: computing
the keyword match for *"i want to add a repo rule that stops us doing X"* against the
vocabulary classes of both this mode and `sk-create-skill`. This mode matched; the sibling
matched nothing.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Alternative | Why not |
|-------------|---------|
| Mark it Met on the keyword substitute | The substitute shows the signals are right, not that the advisor uses them. That is a different claim |
| Block the phase until the advisor connects | The connection is outside this work's control and has been intermittent for hours |
| Drop the criterion | It is the right criterion; it simply could not run today |
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Accepted:** the packet closes without live proof that the advisor routes to this mode.

**Mitigated by:** the vocabulary class was verified to match rule-shaped requests and not to
collide with `sk-create-skill`, which is the likely confusion.

**Satisfying condition:** one advisor query in a session where the server connects.
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The criterion could not be executed; something had to be recorded |
| 2 | **Beyond Local Maxima?** | PASS | Three alternatives weighed above |
| 3 | **Sufficient?** | PASS | A waiver with a satisfying condition is the lightest honest record |
| 4 | **Fits Goal?** | PASS | Closure on evidence is the phase's stated purpose |
| 5 | **Open Horizons?** | PASS | The criterion stays live and can be satisfied later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `acceptance-criteria.md` AC-006 status becomes `Waived`, waiver cell `ADR-001`
- The phase summary names the advisor test as not run

**How to roll back**: set AC-006 back to `Unmet` and delete this ADR; the packet then fails
`AC_CLOSURE` again, which is the correct state if the waiver is withdrawn.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: The accept path was not demonstrated end to end

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-31 |
| **Deciders** | Operator, Claude Opus 5 |

---

<!-- ANCHOR:adr-002-context -->
### Context

AC-008 required a produced rule judged against the phase-4 standards. No rule was produced,
because no candidate passed the decision tests. Three were tried — run tests before claiming
done; a concurrent session writing to the repo; when to ask the operator versus decide. All
three were correctly refused.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

Record AC-008 as **Waived** rather than trying a fourth candidate until one passed. The
third was close enough that continuing would have been shopping for a pass — the failure
this phase's own risk table names.

The rule set was reviewed three phases earlier by five research iterations that returned
zero warranted new rule files, refused ten candidates and produced one subtraction. A mode
refusing everything currently proposable here behaves consistently with that finding.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Alternative | Why not |
|-------------|---------|
| Argue the third candidate into an accept | It is genuinely borderline; forcing it makes the gate meaningless |
| Invent a request the mode would obviously accept | Certifies nothing, and the spec's risk table forbids exactly this |
| Ship the exercise rule into `repo-rules/` | Shipping a rule because it was convenient to generate is the restraint failure the decision tests exist to refuse |
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**Accepted:** the join from a decision-test pass through to a wired rule has never run.

**Separately evidenced:** phase 3's generated rule matched a shipped rule on all eleven
structural assertions; phase 4's standards then failed that same sample on three tests. Both
halves work; the join is untested.

**Satisfying condition:** the first repository, or the first moment in this one, that
genuinely needs a rule the set does not already carry.
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | No accept case existed; the gap is real and had to be recorded |
| 2 | **Beyond Local Maxima?** | PASS | Three alternatives weighed, all worse |
| 3 | **Sufficient?** | PASS | The waiver names what is unproven and what would prove it |
| 4 | **Fits Goal?** | PASS | The phase exists to close on evidence, not on phase count |
| 5 | **Open Horizons?** | PASS | The first real rule request satisfies it without rework |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `acceptance-criteria.md` AC-008 status becomes `Waived`, waiver cell `ADR-002`
- The phase summary names the accept path as unexercised and says why

**How to roll back**: set AC-008 back to `Unmet` and delete this ADR. The honest alternative
is not a rollback but a real accept case, which would satisfy the criterion outright.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->
