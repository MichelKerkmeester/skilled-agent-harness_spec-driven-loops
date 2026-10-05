---
title: "Decision Record: a model panel settles the disputed guessed rows"
description: "Amends protocol section 4: three model families that have not labeled these rows settle the 40 disputed guessed rows by majority, in place of operator labels, and the result is reported as a panel verdict."
trigger_phrases:
  - "decision record"
  - "guessed row panel"
  - "operator label amendment"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/050-open-knowledge-format-adoption/009-census-hardening"
    last_updated_at: "2026-10-05T07:20:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Recorded the panel run and its departures"
    next_safe_action: "None"
    blockers: []
    key_files:
      - "measurement-protocol.md"
      - "scratch/labels/operator-rows.md"
      - "scratch/labels/panel/runs.log"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "e4486fa5-248b-49a4-8970-229354aab7a1"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: a model panel settles the disputed guessed rows

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: A three-family model panel replaces the operator labels

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-04 |
| **Deciders** | Operator, 2026-10-04: asked for SWE 2 max to label, cross-verified by GLM 5.3 Flash max, then chose "Swap DeepSeek out" so the third vote comes from a family that has not seen these rows. Drafted by claude-opus-5-5 |
| **Amends** | `measurement-protocol.md` section 4 |

---

<!-- ANCHOR:adr-001-context -->
### Context

Section 4 sends the 40 guessed rows that Luna 6 and DeepSeek V4.1 Flash dispute most to the operator. The operator asked for models to settle them instead. DeepSeek V4.1 Flash is one of the two labelers whose disagreement produced these rows, and Luna 6 is the other, so neither can be an independent vote.

### Constraints

- This record is written before any panel label exists: the session log has it written at 2026-10-04T20:24:11Z, and the first panel call starts at 20:24:34Z, the first line of `scratch/labels/panel/runs.log`.
- The panel sees the same evidence the operator file shows: the citing line with two lines either side, the citation and the candidate paths. It never sees the earlier labels.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: three families, none of which labeled these rows, label all 40 rows blind and independently, and the majority settles each row.

**How it works**:
- Panel: SWE 2 max (cli-devin), GLM 5.3 Flash at max (planned on cli-pi, `opencode-go/glm-5.3-flash`; see the departures below) and Gemini 3.8 Flash high (cli-devin, `gemini-3-8-flash-high`).
- Each answers `intended`, `not_intended` or `cant_tell` per row, plus the path for an ambiguous row answered `intended`, in batches of 10, from an empty folder with no repository access.
- Two or three matching labels settle a row. For an `intended` majority on an ambiguous row, the path must match too. Anything else stays unsettled and is reported as such.
- A failed or unparseable answer counts as no vote, never as a label.
- Two departures from the batches above, both made before any vote was scored. Gemini hit its output-token limit on batch 1, so that batch ran as one half of 5 rows and then 5 single rows. GLM on cli-pi answered batch 1 and one half-batch, then gave no output for 10 to 30 minutes on four calls, each stopped by its own process id; a fifth was stopped at 7 minutes to change route. At the operator's direction its remaining 25 rows moved to cli-devin with the same model, `glm-5-3-flash-max`. Calls of 5 rows each hit the output-token limit, so it ran one row per call; 4 rows came back before Devin's daily quota ran out. The operator then sent the last 21 rows through cli-pi on LLM Gateway, `llmgateway/glm-5.3-flash` at max, one row per call. A row that failed was retried once. `panel/runs.log` records every call.
- The guessed class is then reported as an intended share with a Wilson 95% interval over settled rows, labeled a panel verdict, with the unsettled count beside it. Section 5 sets no threshold for this class, so no pass or fail follows.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Three families that have not seen the rows** | Every vote is independent of the dispute | A panel verdict, not ground truth | 8/10 |
| SWE 2 max, GLM 5.3 Flash and DeepSeek V4.1 Flash | The operator's first description | DeepSeek re-judges rows it labeled | 5/10 |
| Operator labels, as written | Ground truth by the protocol's own rule | Waits on 40 manual labels | 6/10 |
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The guessed class gets a settled figure without waiting on manual labels.

**What it costs**:
- The figure measures what three models agree on, which can differ from what the author meant.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The three families share a bias | M | Report agreement per pair, and keep the unsettled rows visible |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The operator asked for it |
| 2 | **Beyond Local Maxima?** | PASS | Three options weighed |
| 3 | **Sufficient?** | PASS | One panel run, one score |
| 4 | **Fits Goal?** | PASS | Settles the open criterion |
| 5 | **Open Horizons?** | PASS | Operator labels can still override any row |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `scratch/labels/panel/`: the blind input, each model's answers and the settled rows.
- The guessed rows in the implementation summary, and the acceptance criterion for the labels.

**How to roll back**: delete `scratch/labels/panel/` and this record; section 4 then stands as written.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
