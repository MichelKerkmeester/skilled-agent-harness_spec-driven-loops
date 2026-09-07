---
title: "Feature Specification: shadcn adoptions"
description: "Make the three shadcn chart decisions worth keeping—keyed series tokens, local readout knobs and declared curve intent—explicit and checker-held across the standalone chart corpus."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: shadcn adoptions

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-07 |
| **Branch** | `scaffold/014-shadcn-adoptions` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 13 judged shadcn's chart decisions against the 26-form standalone corpus and found three worth carrying: semantic token indirection with per-key colours, local tooltip formatter and key-alias knobs, and explicit curve intent (linear, step, monotone) where a time form draws a path. None of the three exists in the corpus as a declared, checked contract; today they are partly implicit (the indexed series ladder), partly per-template habit (each tooltip formats its own way), and partly absent (no template states which interpolation it uses or why).

### Purpose
Land the three adoptions as declared contracts the checker can hold, without touching the decisions the research said to keep, and record the four policy-gated items as operator decisions rather than assertions.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

Three adoptions, in this order, each a contract change plus its checker assertion plus the template edits that satisfy it:

1. **Series-key token indirection.** Every multi-series form names its series once, by key, and each key resolves to exactly one palette token; the mapping is declared beside the data, not scattered through the markup. The checker's series-mapping assertion holds it by key as well as by index.
2. **Local readout knobs.** Every form that carries a tooltip or card readout exposes its label formatter, value formatter and key alias in one declared `READOUT` block next to `CHART_DATA`, replacing ad hoc formatting scattered through the script. The number-format assertion requires the block on every tooltip-bearing form.
3. **Declared curve intent.** Every form that draws a path over time declares `CURVE` as one of `linear`, `step` or `monotone`, defaulting to `linear`; `natural` is not a value. The rationale line beside it says why the chosen curve is honest for the data. A `curve-contract` assertion holds the enumeration and the default.

Also in scope: recording the kept decisions where the research said they live (`catalog.md` for radar and pie, `color-system.md` for the palette comparison), and regenerating the gallery if a template changed.

### Out of Scope

- The four policy-gated items: a browser-backed keyboard and pointer gate, a colour-vision-deficiency and hue threshold, metadata-driven data-accuracy checks, and a retargetability manifest. Each is an operator decision in section 10, not work here.
- Any new chart form; no radar, no pie, no area variants without a product question.
- Wrapping, vendoring or porting Recharts or any external resource; the checker forbids it.
- Weakening any existing assertion or contrast gate.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/sk-design-chart/assets/templates/*.html` | Modify | Declared series keys, `READOUT` block on tooltip forms, `CURVE` on path forms |
| `.opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs` | Modify | Key-based series mapping, `READOUT` requirement, `curve-contract` assertion |
| `.opencode/skills/sk-design/sk-design-chart/references/template-contract.md` | Modify | The three contracts written where authors read them |
| `.opencode/skills/sk-design/sk-design-chart/references/catalog.md`, `color-system.md` | Modify | The kept decisions, cited to phase 13 |
| `.opencode/skills/sk-design/sk-design-chart/assets/examples/*.html` | Modify | Deliveries follow their templates |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every multi-series template declares its series by key in one place and each key resolves to exactly one palette token; `check-corpus.cjs` fails a template whose key maps to no token, to two tokens, or whose markup paints a series with a token its key does not own |
| REQ-002 | Every tooltip-bearing template carries one `READOUT` block beside `CHART_DATA` declaring its label formatter, value formatter and key alias, and its readout code reads them from there; `check-corpus.cjs` fails a tooltip-bearing template without the block |
| REQ-003 | Every template that draws a path over time declares `CURVE` from the set `linear`, `step`, `monotone` with a one-line rationale, and its path code honours it; `check-corpus.cjs` fails an undeclared or out-of-set value, `natural` included |
| REQ-004 | `check-corpus.cjs` prints `RESULT: PASSED` with zero errors on the final corpus, and each new assertion is shown to fail on a mutated copy before the corpus is fixed to pass it |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | `template-contract.md` states the three contracts in its own voice, and `catalog.md` and `color-system.md` record the kept decisions with the phase 13 measurements |
| REQ-006 | No existing assertion, gate or threshold is loosened, and no template gains an external reference |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs` prints `RESULT: PASSED` and its assertion list names the key-based series mapping, the readout block and the curve contract.
- **SC-002**: A mutation of each kind, a series key without a token, a tooltip form without `READOUT`, a `CURVE` of `natural`, each turns the run to `RESULT: FAILED` naming the assertion.
- **SC-003**: `grep -c "CURVE" ` over the time-path templates and `grep -c "READOUT"` over the tooltip forms both equal the number of forms the contract names.

### Completion evidence

- SC-001 Met — `node .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs` ended with `Summary: errors: 0` and `RESULT: PASSED`; the output includes `series-mapping`, `number-format` and `curve-contract`.
- SC-002 Met — the three isolated mutations under `scratch/` each ended with `RESULT: FAILED` and their exact assertion lines are recorded in `scratch/mutations.md`.
- SC-003 Met — the final corpus has 18 tooltip-form `READOUT` blocks, four delivery `READOUT` blocks, three template `CURVE` blocks and one delivery `CURVE` block; the grep evidence is recorded in `implementation-summary.md`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 13's findings in `../013-shadcn-reference-research/research/lineages/luna/research.md` | Defines the three adoptions and the kept decisions | Cite it; do not re-research |
| Risk | Editing 26 templates by hand drifts their palette or geometry blocks | High | The existing palette-block and geometry assertions catch drift; run the checker after every template |
| Risk | A `READOUT` block changes a delivery's visible numbers | Med | Deliveries follow their templates and the card-readout check compares card values with the table |
| Risk | The available browser process aborts before returning a document | Med | Static assertions are the gate; render-dependent checks are reported as unknown, never inferred |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `check-corpus.cjs` stays a static pass over 35 files; the three assertions add no browser dependency.

### Security
- **NFR-S01**: No template gains an external reference; `checkNoExternalResources` keeps erroring on any.

### Reliability
- **NFR-R01**: Each new assertion is proven by a mutation that fails before the corpus is made to pass.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a form with one series still declares its key; the mapping check accepts a single key.
- Maximum length: the categorical capacity gate already bounds how many keys a form may declare.

### Error Scenarios
- External service failure: none; everything is local.
- Network timeout: not applicable.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 14/25 | Files: about 30, LOC: several hundred, Systems: 1 |
| Risk | 6/20 | Auth: N, API: N, Breaking: N; a checker change binds every template |
| Research | 2/10 | Done in phase 13 |
| Coordination | 6/15 | Templates, checker, three references and six deliveries move together |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

Operator decisions carried from phase 13. Each becomes a checker assertion only once its policy exists; none is implemented here.

- Which candidate forms does the product demand? Phase 13 found no gap that a reader question confirms.
- Which colour-vision-deficiency model and threshold should become a palette gate, if any?
- Does a browser-backed keyboard and pointer walk become a release gate, and on which runtime?
- Is semantic metadata for domain, curve, null and tick checks worth its maintenance cost?
<!-- /ANCHOR:questions -->

---
