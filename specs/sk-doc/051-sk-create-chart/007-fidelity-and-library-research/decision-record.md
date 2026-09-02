---
title: "Decision Record: Fidelity and library research for sk-create-chart"
description: "Why fidelity is reached through independent work rather than the reference implementation, what was applied to the templates and what was left as a recommendation, and why five contract-level changes stay decisions."
trigger_phrases:
  - "chart fidelity decisions"
  - "chart research decisions"
  - "contract level chart change"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/051-sk-create-chart/007-fidelity-and-library-research"
    last_updated_at: "2026-09-02T00:00:00Z"
    last_updated_by: "phase-7-fidelity"
    recent_action: "Recorded the decisions this phase took and the recommendations it did not apply"
    next_safe_action: "Decide the five contract-level recommendations in ADR-004"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/assets/templates"
      - ".opencode/skills/sk-doc/sk-create-chart/references/template-contract.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-7-fidelity-and-library-research"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "ADR-004: five contract-level recommendations await an operator decision"
    answered_questions:
      - "ADR-001: fidelity comes from independent work and MIT-class libraries"
      - "ADR-002: three template-level changes are applied, the rest are recommendations"
      - "ADR-003: no library is adopted, because the no-dependency clause is load-bearing"
      - "ADR-005: a fan-out lineage and local authoring must not share a working tree"
---
# Decision Record: Fidelity and library research for sk-create-chart

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Fidelity comes from independent work and MIT-class libraries

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-02 |
| **Deciders** | Operator, phase 7 implementer |
| **Satisfies** | NFR-S01 |

---

### Context

The mode was built from a reference implementation licensed PolyForm Noncommercial. This
repository is MIT and public. The operator ruled that nothing from the reference is copied, and
that ruling stands.

### Decision

The research question is how the corpus gets better, not how it gets closer to the reference. The
reference clone is not opened by this phase, and the dispatched executor was told in its own brief
not to open, read, search or reference any clone under a scratch, temporary or vendor directory.
Chart.js, D3, Vega-Lite, Plotly, Observable Plot and ECharts are MIT-class, and are legitimate
sources of ideas and, where the template contract allows, code.

### Consequences

- Every finding is grounded in public documentation a reader can open and check.
- Conventions the reference may already solve had to be reached independently, which cost
  iterations that a permitted reading would have saved.

### Alternatives Rejected

- **Read the reference for ideas only.** The licence governs the work, not the intent, and a
  paraphrase of a licensed implementation is still derived from it.
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Three template-level changes are applied, the other seven are recommendations

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-02 |
| **Deciders** | Phase 7 implementer |
| **Satisfies** | REQ-003, REQ-004 |

---

### Context

The research ranked ten template-level changes as applyable now. Applying all ten would touch
every file in the corpus in one pass, and the corpus check cannot tell a good chart from a bad
one, only a broken one from a working one. The gate proves nothing broke. It does not prove the
picture improved.

### Decision

Three changes are applied, chosen because each closes a defect that exists in the corpus today and
each can be proven by observation rather than by argument:

1. **Per-mark hover titles** on the eight forms where direct labelling is weakest. The largest
   measured gap against upstream, and additive: a `<title>` child of a mark is a native browser
   tooltip and the mark's accessible name, with no listener, no state and no library.
2. **Counted ticks in the candlestick ladder.** The loop accumulated a fractional step, and
   repeated addition drifts. Counting from an integer index is the approach d3 takes.
3. **Measured legend labels** in the six forms that advanced by a character count times a
   constant. The font stack is proportional, so the estimate was wrong for any label with wide
   glyphs, and a long label ran under the next swatch.

The remaining seven are recorded in `implementation-summary.md` as recommendations with their
evidence, and are not applied here.

### Consequences

- Each applied change is provable: the drift was reproduced before the fix, the measured
  positions are fractional where the estimate would be a multiple of the constant, and the
  rendered documents carry one title element per mark.
- The corpus keeps seven known improvements unapplied, and a later reader has to open this
  packet to find them.

### Alternatives Rejected

- **Apply all ten.** A single pass over twenty files, gated by a check that only proves nothing
  broke, is a large unreviewable diff for a mode that ships pictures.
- **Apply none, and record everything.** Two of the three fix defects present in the corpus now,
  and leaving a known defect unfixed to keep the diff small is the wrong trade.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: No library is adopted, because the no-dependency clause is load-bearing

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-02 |
| **Deciders** | Phase 7 implementer |
| **Satisfies** | NFR-P01 |

---

### Context

The brief asked where a library should be recommended, and required any such recommendation to
reconcile with the contract that a template is one file with no build step and no remote
dependency.

### Decision

No library is adopted. Every surveyed library needs a runtime the delivered file deliberately
lacks, and the contract states why: a remote dependency keeps the file working only while the
network is up and the host still exists. Ideas were borrowed, and named at each site: the tick
doctrine, direct labelling, line-break semantics for missing data, parity thinning, gradient
legends, pattern fills and data-derived descriptions. No code was taken.

### Consequences

- Each form stays hand-drawn, which is the cost the contract already accepts.
- Forms that genuinely need a layout engine, such as dense node-link networks, stay out of the
  corpus rather than in it with a library attached.

### Alternatives Rejected

- **Inline a small library into each template.** It satisfies the letter of the no-remote rule and
  breaks its purpose: the reader who edits the data block would be editing a file that is mostly
  someone else's minified code.
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Five contract-level recommendations stay open

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-09-02 |
| **Deciders** | Operator |
| **Satisfies** | REQ-004 |

---

### Context

The research produced five recommendations that change what the contract says or what the check
asserts, rather than what a template contains.

### Decision

They are recorded and not applied. Each needs an operator decision:

| Ref | Recommendation |
|-----|----------------|
| C1 | Add a narrow-viewport render assertion to the corpus check, so a phone-width read is verified rather than assumed |
| C2 | State in the catalog that time labels arrive display-ready in the data block |
| C3 | Name the computed-value exception, the waterfall end and the stacked-area total, beside the contract's "never computes" sentence |
| C4 | Show a visible in-figure notice when data exceeds a form's documented shape |
| C5 | Add a diverging colour system, once a catalog form consumes one |

### Consequences

- The contract stays as it shipped, so nothing in the corpus is invalidated by this phase.
- C1 is the one with a cost to leaving it: narrow-width legibility is the one property the check
  does not observe and the research names as unverified.

### Alternatives Rejected

- **Apply C2 and C3 as documentation-only edits.** They read as harmless wording, and they change
  what the contract promises, which is the operator's call rather than the implementer's.
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: A fan-out lineage and local authoring must not share a working tree

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-02 |
| **Deciders** | Phase 7 implementer |
| **Satisfies** | R-004 |

---

### Context

The research ran as a fan-out lineage. The runtime protects the repository by snapshotting which
paths are dirty before the dispatch, then restoring from `HEAD` any tracked file that became dirty
during it and sits outside the lineage directory. That guard cannot tell the dispatched executor's
writes from anyone else's.

While the lineage ran, this session authored four phase documents, and a concurrent agent edited
files in three other areas. At the end of the run the guard restored twenty-three tracked files
from `HEAD`. Four were this phase's own documents, which were rewritten. The rest were another
agent's uncommitted work, which is gone.

### Decision

Do not write to the working tree while a fan-out lineage is live, and do not start one in a tree
another agent is working in. Where both are needed, the lineage belongs in its own worktree.

### Consequences

- Research and local authoring serialise, which costs wall time.
- The alternative, discovering the loss afterwards, cost a concurrent agent its uncommitted work,
  which no amount of wall time buys back.

### Alternatives Rejected

- **Commit before dispatching.** It protects the committing session and does nothing for a
  concurrent one, which is where the real loss landed.
<!-- /ANCHOR:adr-005 -->
