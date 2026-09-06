---
title: "Implementation Plan: every form can be judged without opening a browser"
description: "Render all 75 templates and examples across the two canvas modes to PNGs, from a committed script with a coverage check."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: every form can be judged without opening a browser

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

The two canvas modes ship 70 HTML files and no pictures. Judging a form means opening it.

Two properties shaped the capture. Charts animate on first paint, so a frame taken too early shows a
half-drawn figure. And Chrome ignores every colour-scheme flag in headless capture, so the theme
follows the host machine.

### Overview

A script that mirrors the source layout into PNGs, with a `--check` mode for coverage, stored beside `assets/` rather than inside it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The problem statement and frozen scope are in `spec.md`
- [x] Success criteria are observable commands, not adjectives
- [x] Headless Chrome is confirmed available and already a corpus-checker dependency

### Definition of Done
- [x] Every acceptance criterion in `acceptance-criteria.md` is `Met`, `Waived` or `Superseded`
- [x] `--check` reports zero missing for both modes and the leaf hash is unchanged
- [x] `validate.sh --strict` prints `RESULT: PASSED` for this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Generated artifacts with a coverage check, not hand-made images.

### Key Components

- **`shared/scripts/render-screenshots.cjs`**: the renderer, with a bounded spawn retry and `--check`.
- **`<mode>/screenshots/`**: the output, mirroring `assets/`.
- **Both mode READMEs**: the regeneration command and the host-theme property.

### Data Flow

Each `.html` under `assets/` renders to a PNG at the mirrored path under `screenshots/`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Change |
|---------|--------|
| `shared/scripts/render-screenshots.cjs` | Created |
| `sk-design-chart/screenshots/**` | 36 PNGs |
| `sk-design-diagram/screenshots/**` | 39 PNGs |
| Both mode READMEs | A regeneration section |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Step | What | Gate |
|------|------|------|
| 1 | Confirm a browser and probe a single render | A settled frame, read not assumed |
| 2 | Try to force a deterministic colour scheme | Every flag ignored; documented |
| 3 | Write the renderer with a settle budget | 36 and 39 rendered |
| 4 | Add a bounded retry after one transient failure | 0 failures |
| 5 | Move the output out of the leaf surface | Leaf hash back to its original value |
| 6 | Document regeneration in both READMEs | Command and caveat named |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Check | How |
|-------|-----|
| Coverage | `--check` per mode |
| Not routable | Leaf manifest hash compared before and after |
| Settled frames | A rendered chart read directly |
| No collateral damage | Corpus checker, fleet metadata, leaf and derived freshness |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Depends on | Nature |
|-----------|--------|
| Headless Chrome | Already a corpus-checker dependency |
| The leaf-manifest generator | Decides what counts as routable |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Delete the two `screenshots/` directories and the script, and revert the two READMEs. Nothing else depends on them.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| This phase | Depends on | Blocks |
|-----------|-----------|--------|
| `012-template-screenshots` | `006` for the mode names | Nothing |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Item | Size |
|------|------|
| Images | 75, about 5 MB |
| Scripts | 1 |
| READMEs | 2 |
| Templates modified | 0 |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] A rendered frame read directly, not assumed from a byte count
- [x] Leaf hash compared before and after
- [x] Coverage check run for both modes

### Rollback Procedure
1. Delete both `screenshots/` directories and the script
2. Revert the two READMEs
3. Regenerate the leaf manifest

### Data Reversal

None. Generated images; nothing stateful.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
confirm browser -> probe one render -> read the frame
        |
        v
try to force a colour scheme -> every flag ignored -> document it
        |
        v
render 36 + 39 with a settle budget -> 1 transient failure -> add retry
        |
        v
leaf manifest grew 181 -> 256 -> move out of assets/ -> back to 181
        |
        v
--check: 0 missing both modes; corpus checker still PASSED
```

### Dependency Matrix

| Step | Needs | Produces |
|------|-------|----------|
| Probe | A browser | A settled frame, verified by reading it |
| Render | The settle budget | 75 images |
| Relocate | The leaf hash | Images outside the routable surface |
| Document | The caveats | A regeneration command a reader can run |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

Reading a rendered frame rather than trusting a byte count. A mid-animation capture has a plausible
file size and shows a broken-looking chart, and nothing but looking would catch it.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Evidence |
|-----------|----------|
| Renders settle | A read frame: bars at full height, table present |
| Full coverage | `--check` 0 missing, both modes |
| Not routable | Leaf hash `ec5c48a2ca9a`, unchanged |
| Reproducible | One command per mode, in each README |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Store screenshots beside `assets/`, not inside it

**Status**: Accepted, after the gate caught the alternative

**Context**: The first render wrote to `assets/screenshots/`. The leaf manifest grew from 181 leaves
to 256, with 75 PNGs entering the routable surface.

**Decision**: Move the output to `<mode>/screenshots/`, outside `assets/`.

**Consequences**:
- The leaf hash returned to exactly its previous value.
- A leaf stays what it is meant to be: something a mode loads into context.

**Alternatives Rejected**:
- Configure an exclusion: more machinery than moving a directory.

### ADR-002: Accept the host colour scheme and document it

**Status**: Accepted

**Context**: Chrome ignores `--force-prefers-color-scheme`, `--blink-settings=preferredColorScheme`
and `--headless=new` for `prefers-color-scheme` in screenshot capture. All produced byte-identical
output on a dark-mode host.

**Decision**: Capture whatever the host renders, and say so where a reader will find it.

**Consequences**:
- A regenerated set matches the operator's system theme rather than a fixed one.
- Both themes are valid corpus output and each is validated independently, so neither is wrong.

**Alternatives Rejected**:
- Drive the browser through the DevTools protocol to emulate the media feature: a new dependency and
  a new failure mode, for a property that is documented in one paragraph.

---


<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->
