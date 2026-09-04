---
title: "Decision Record: The stroke weight fork and the emphasis glow"
description: "The two changes the research lineages contradicted each other on, with both arguments kept, one answered by the operator and one held open against a rendered comparison."
trigger_phrases:
  - "stroke weight fork"
  - "emphasis glow decision"
  - "chart fork disposition"
  - "chart decision record"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/053-chart-visual-overhaul/001-visual-proof-and-forks"
    last_updated_at: "2026-09-03T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Rendered the weight comparison and recorded the operator's answer on the glow"
    next_safe_action: "Read scratch/forks/stroke-weight.html and fill the disposition in ADR-001"
    blockers:
      - "ADR-001 has no answer, and phase 002 cannot roll the series stroke without one"
    key_files:
      - "specs/sk-doc/053-chart-visual-overhaul/001-visual-proof-and-forks/scratch/forks/stroke-weight.html"
      - ".opencode/skills/sk-doc/sk-create-chart/assets/templates/daily-line.html"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-053-001-visual-proof-and-forks"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Which of the three rendered stroke weights the operator picks"
    answered_questions:
      - "The glow is cut, because a delivered chart is often printed"
---
# Decision Record: The stroke weight fork and the emphasis glow

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: The series stroke weight, rendered rather than argued

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-03 |
| **Deciders** | Operator, unanswered. The comparison is rendered and waiting |

---

<!-- ANCHOR:adr-001-context -->
### Context

Two research lineages read the same reference library and reached opposite answers about how
heavy a series line should be. The `deepseek` lineage ranked thinning the stroke from two pixels
to 0.8 as the single change that buys the most visible payoff, and called the current weight the
reason the corpus looks plain. The `glm` lineage rejected the change, and its stated reason was
that a corpus comment declares the two pixel round cap a deliberate print register.

That reason does not survive contact with the file. The phrase appears nowhere in the skill. The
only written statement on the matter sits three lines below the rule it contradicts: the drawing
comment in the line template says a hairline is the right weight, while the style rule above it
sets a stroke of two. Nothing in the packet records why two was chosen.

The corpus is not consistent with itself either. Five distinct stroke weights are in use across
the twenty forms, counted from the working tree: 1, 1.5, 2, 2.5 and 3. There is no convention
here to defend.

Removing the rejecting argument does not answer the question. A thinner line reads as precision
on a screen and can read as a line that failed to print on paper, and that is a matter of taste
about a delivered artifact. Nine research iterations produced two confident answers pointing in
opposite directions, which is the signal that more argument buys nothing.

### Constraints

- The answer has to survive print. The objection to a hairline is a paper objection, and a screen
  comparison alone does not settle it.
- The dot language landed in the same phase. At 0.8px the per-reading dots carry more of the line
  than the stroke does, so the two changes have to be judged together rather than one at a time.
- Whatever is chosen rolls to nineteen more files in the next phase, so the cost of choosing
  wrong is paid twenty times.
- A default picked here would be indistinguishable from an answer once phase 002 rolls it out.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: nothing yet. The same twenty-eight readings are drawn three times at 2px, 1px and
0.8px on one page, and the phase stops there.

**How it works**: `scratch/forks/stroke-weight.html` holds the three drawings. Grid, fill, dots,
marker, type and geometry are shared, and one CSS rule per variant sets the weight, so a
difference the reader sees is a difference the weight made. The sheet was built while the template still carried its
stroke of two, so the comparison shows the shipped weight beside the two alternatives rather
than beside itself.

**Disposition**: ANSWERED, 2026-09-03, by the operator after reading the rendered comparison.
Chosen: 1px. It is visibly lighter than the 2px the corpus ships and still holds on paper, which
is the objection the thinnest option could not answer from a screen. The template was
changed to 1px in the same commit that recorded this answer, and phase 002 rolled it across the
corpus.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

The three rendered options, and what each costs. Scores rank how well the option serves the
decision, not how well the line reads: that is the operator's call and the reason this record
exists.

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Render all three and stop** | The choice is made by looking at the real series at the real size, the losing arguments stay on record, and nothing ships on a guess | Costs a page nobody delivers, and blocks phase 002 until someone reads it | 9/10 |
| 2px, keep what ships | Zero change, survives print, matches the widest weight already in the corpus | Keeps the look the research called plain, and keeps a comment that contradicts the rule three lines above it | 5/10 |
| 1px | Reads lighter without becoming a hairline, and stays visible on paper | Chosen as a compromise rather than because anyone argued for it | 5/10 |
| 0.8px | The change one lineage ranked highest. The line recedes and the data reads first | Thins further on paper, and the dots begin to outweigh the line they sit on | 5/10 |
| Pick one and roll it | Phase 002 starts today | The mistake this phase exists to prevent. An unrecorded default is indistinguishable from a decision once twenty files carry it | 1/10 |

**Why this one**: the fork is a question of taste about a delivered artifact, and taste is settled
by looking. Both lineages were confident and one of them was wrong about the evidence, which is
the case where more argument is the most expensive way to be wrong again.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The choice is made against the chart the answer applies to, carrying the chrome that landed in
  this phase, rather than against the chart the research described.
- The disproved print-register argument is on record as disproved, so it cannot be cited again.

**What it costs**:
- Phase 002 cannot roll the series stroke until the disposition is filled. Mitigation: every other
  chrome row is settled, so phase 002 has work that does not wait on this.
- One page in `scratch/` that must never reach the corpus. Mitigation: the sheet carries a banner
  saying so, it sits outside the checked asset tree, and the corpus check never scans it.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The sheet is judged on screen only, and the print objection goes untested | H | The page says to print it, and the objection is stated in the third card rather than left implied |
| The answer differs between the line form and the bar form | M | Only the line form carries a series stroke, so the bar form does not force a shared answer |
| The comparison drifts because each variant is drawn by its own code | M | One drawing routine is called three times. The rendered DOM was compared and all three hold the same element counts |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The two lineages contradict each other and the corpus contradicts itself, so nothing in the source answers it |
| 2 | **Beyond Local Maxima?** | PASS | Five options weighed, including keeping what ships and picking a default |
| 3 | **Sufficient?** | PASS | One page, three drawings, one shared routine, no build step |
| 4 | **Fits Goal?** | PASS | The rollout in phase 002 multiplies this answer by twenty, so it is on the critical path |
| 5 | **Open Horizons?** | PASS | A weight recorded with its reasoning can be revisited. A default nobody wrote down cannot |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `scratch/forks/stroke-weight.html` is added: three drawings of the shipped demo series, one
  variable between them.
- The templates changed on this axis once the answer arrived. `assets/templates/daily-line.html`
  `stroke-width: 2` on the series.
- The contradicting drawing comment stays exactly as written. It is the evidence the fork rests
  on, so rewriting it before the answer arrives would either pre-empt the choice or destroy the
  citation. It is rewritten when the disposition is filled, not before.

**How to roll back**: delete `scratch/forks/stroke-weight.html`. Nothing in the corpus depends on
it and no shipped file references it.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: The glow behind the emphasis line is cut

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Rejected |
| **Date** | 2026-09-03 |
| **Deciders** | Operator, answered before the comparison was built |

---

<!-- ANCHOR:adr-002-context -->
### Context

The reference library draws its emphasis line over a four-layer blur stack. Both research
lineages rejected the stack and split on what remains.

The `glm` lineage adopted one layer at low opacity, on the ground that a single soft halo
separates the emphasized series from the ones behind it without adding a mark the reader has to
decode. The `deepseek` lineage rejected any layer, calling it a dashboard effect that prints
badly.

The planned resolution was to render both and let the operator choose, the same treatment
ADR-001 gets. The operator answered first, on 2026-09-03: a delivered chart is often printed, and
a blur reads as a smudge on paper. That is the same objection the rejecting lineage raised, and
it is decisive because it names the medium the corpus is built for.

### Constraints

- A delivered chart is a document. It gets printed, and it gets pasted into other documents that
  are printed.
- The corpus renders through one headless browser and is compared as a screenshot, so a blur that
  degrades on paper would never surface in the check.
- The separation the glow was meant to buy is available from the palette, which already gates
  emphasis against the first series colour for contrast.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: no glow, at any layer count. No filter is authored, and no comparison sheet is
rendered for it.

**How it works**: nothing is added. The emphasized reading separates from the line through the
two-weight dot language that landed in this phase instead, a solid mark in the emphasis colour
carrying a ring in the surface colour, which prints as a ring rather than as a smudge.

**Disposition**: ANSWERED, 2026-09-03, by the operator. Rejected.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **No glow** | Prints as drawn, nothing to tune per form, and the separation problem is already solved by the palette gates and the ring | Loses the soft depth the reference library gets from it on screen | 9/10 |
| One layer at low opacity | Separates the emphasized series on screen without a new mark to decode | Blurs on paper, and a low-opacity blur is the hardest kind of change to judge in a screenshot review | 4/10 |
| Render both and ask | Matches how ADR-001 is being settled | Costs a page to answer a question the operator had already answered | 2/10 |
| The four-layer stack the library ships | Faithful to the reference | Rejected by both lineages, and four filter layers on a delivered file is a cost with no reader benefit | 1/10 |

**Why this one**: the medium decides it. A chart that has to survive a printer cannot depend on a
blur to carry meaning, and the ring does the same work with ink that reproduces.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- One less filter in every template, and one less thing for the motion phase to settle after.
- The emphasis treatment is now a single mark language rather than a mark plus a halo, so phase
  002 rolls one idea instead of two.

**What it costs**:
- The screen look loses the depth the reference gets from its halo. Mitigation: none is offered.
  The operator weighed it against print and chose print.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The question returns later as a screen-only enhancement | L | This record names the medium argument, so a later proposal has to answer it rather than restate the original one |
| The emphasized series is hard to pick out on a dense multi-series form | M | The palette source already gates emphasis against the first series colour, and the check enforces that gate on every run |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The fork blocked phase 002 until it carried a disposition, and the operator answered it |
| 2 | **Beyond Local Maxima?** | PASS | Four options weighed, including the one the reference library ships |
| 3 | **Sufficient?** | PASS | The decision is to add nothing, which is the cheapest outcome available |
| 4 | **Fits Goal?** | PASS | Emphasis treatment rolls to twenty files, so settling it early is on the critical path |
| 5 | **Open Horizons?** | PASS | A later screen-only proposal is still possible and now has a stated argument to answer |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- Nothing is added to any template. No `feGaussianBlur`, no filter element, no glow class.
- `scratch/forks/emphasis-glow.html` is not built. The phase documents that named it are
  reconciled against this record rather than left describing a file that will never exist.
- REQ-003 in `spec.md`, AC-008 in `acceptance-criteria.md` and T011 in `tasks.md` are superseded
  by this record.

**How to roll back**: reinstate REQ-003 and build the comparison sheet. No code was written, so
there is nothing to revert in the corpus.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->
