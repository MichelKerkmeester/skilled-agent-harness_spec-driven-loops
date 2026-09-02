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
    last_updated_at: "2026-09-03T00:00:00Z"
    last_updated_by: "phase-7-second-read"
    recent_action: "Closed ADR-004 and recorded the second read over the twelve unapplied items"
    next_safe_action: "Run the library half of the research on an executor with live web search"
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
      - "The library half of the research still needs a run with live web search"
    answered_questions:
      - "ADR-001: fidelity comes from independent work and MIT-class libraries"
      - "ADR-002: three template-level changes are applied, the rest are recommendations"
      - "ADR-003: no library is adopted, because the no-dependency clause is load-bearing"
      - "ADR-005: a fan-out lineage and local authoring must not share a working tree"
      - "ADR-006: the second read applied nine of the twelve and refused two in writing"
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

**Superseded in part by ADR-006.** The second read took those seven back up one at a time. Six are
now applied and one is refused in writing. The reasoning below still holds for why they did not
land in one pass with the first three.

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
| **Status** | Accepted |
| **Date** | 2026-09-03 |
| **Deciders** | Operator |
| **Satisfies** | REQ-004 |

---

### Context

The research produced five recommendations that change what the contract says or what the check
asserts, rather than what a template contains.

### Decision

The operator has decided all five. Four are applied and one is refused.

| Ref | Recommendation | Disposition |
|-----|----------------|-------------|
| C1 | A narrow-viewport assertion in the corpus check | Applied, as a static assertion rather than a rendered measurement. Rule 14 in the contract, check `narrow-viewport` in the script |
| C2 | State in the catalog that time labels arrive display-ready | Applied. `catalog.md` section 3 now says so, and says the opposite for numbers |
| C3 | Name the computed-value exception beside the "never computes" sentence | Applied. `template-contract.md` section 4 names the waterfall total and the stacked-area total, and states the test that keeps the exception from generalising |
| C4 | A visible in-figure notice when data exceeds a form's shape | Applied to the two forms whose ceilings the research named, `scatter` and `heat-matrix`. A notice is not spread across every form for its own sake, and the contract states the condition |
| C5 | A diverging colour system | Refused. No catalog form consumes a midpoint ramp, and shipping a scale with no consumer repeats the fourth-system mistake `color-system.md` section 7 already documents. Section 8 now records the refusal and names the form that would reopen it |

C1 could not be implemented the way it was written. The recommendation asked for a phone-width
render assertion, and a headless run returns the DOM while the answer lives in layout, which no
`--dump-dom` exposes. What the check can prove is that the file declares the affordance at all,
which is the part an author forgets, and that its floor is never wider than the drawing's own
`viewBox`. Both the contract and the script README say plainly what the check therefore does not
observe.

### Consequences

- The contract now carries fourteen rules rather than thirteen, and every file in the corpus
  satisfies the new one.
- Two forms can render a line of text that is not a data label, which is a new thing a template may
  do. The condition is written into the contract so it does not spread by imitation.
- A diverging system stays absent, and the absence is now documented rather than merely true.

### Alternatives Rejected

- **Leave C2 and C3 as they were, on the grounds that wording changes what the contract promises.**
  That was the right call while the change was the implementer's to make. It is the operator's call,
  the operator made it, and both sentences were describing rules the corpus already followed.
- **Implement C1 by screenshotting at a phone width and comparing images.** A pixel comparison over
  twenty forms fails on font rendering long before it fails on a layout defect, and it needs a
  browser on every machine that runs the check.
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

---

<!-- ANCHOR:adr-006 -->
## ADR-006: The second read applies nine items, refuses two, and changes the shape of one

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-03 |
| **Deciders** | Operator, second-read implementer |
| **Satisfies** | REQ-003, REQ-004 |

---

### Context

ADR-002 left seven template-level recommendations unapplied and ADR-004 left five contract-level
ones undecided. The operator asked for a second read: each item judged again against the template
contract and the restraint ladder, applied if it survives, and refused in writing if it does not.
A silent skip closes nothing, which is what D5 in the goal already said.

### Decision

Nine are applied and two are refused. One of the nine is applied in a different shape than it was
written, and that is the deviation worth naming.

**T8 was asked for as a gradient legend on both shaded forms, and neither got one.** Both put every
value into one of five discrete steps. A continuous ramp would promise a resolution the encoding
does not have, which is a fidelity regression dressed as a fidelity improvement. `heat-matrix` had
no legend at all, which was the real gap, and it received a stepped ramp matching its own banding.
`calendar-grid` already had exactly that legend and kept it, with a comment saying why it is not a
gradient.

**T10 is refused.** Pattern fills would change the visual register of every chart that carries one,
and the problem they solve does not exist here: the colour rule already forbids colour carrying
meaning alone, and every form satisfies it another way. The reasoning is written into
`color-system.md` section 8 rather than left in this packet, because the next author to reach for a
decal will be reading the colour reference.

**C5 is refused,** for the reason in ADR-004.

The pan guard from T6 went to all twenty-nine files under `assets/`, not only to the twenty
templates. Two of those nine extra files are outside what the request named, and the widening is
deliberate. The skeleton an author copies is `assets/color/palette-sheet-neutral.html`, so a guard
that skipped it would leave every future template non-conformant on the day it is created. The
examples are deliveries, which is exactly where a phone-width reader meets the chart, and a check
with a carve-out for the files that most need the property is worse than no check.

### Consequences

- The corpus gained one shared idiom, the formatter, duplicated into every template rather than
  shared. That is the delivery unit's cost and it is already paid nine times over by `niceStep`.
- Two forms and three path builders can now draw a line of prose inside the figure. The contract
  states the condition so it does not spread.
- The check enforces fourteen rules over twenty-nine files, and one of them is asserted from the
  stylesheet rather than from a render. Both documents say so.

### Alternatives Rejected

- **Apply T8 literally.** A gradient bar over a five-band encoding tells the reader the scale is
  continuous. The recommendation was right that a legend was missing and wrong about its form.
- **Apply C4 to every form with a documented ceiling.** Eleven forms carry one. Spreading a runtime
  guard across all of them buys a notice for ceilings nobody has hit, and the two the research named
  are the two where exceeding the shape destroys legibility silently.
- **Scope the pan guard to `assets/templates/` alone.** It keeps the diff inside the named
  directory and leaves the file the contract tells authors to copy without the rule the contract now
  states.
<!-- /ANCHOR:adr-006 -->
