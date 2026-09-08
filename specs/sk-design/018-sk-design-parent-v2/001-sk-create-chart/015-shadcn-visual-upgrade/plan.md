---
title: "Implementation Plan: shadcn visual upgrade"
description: "Apply eight measured visual moves from shadcn's frozen chart examples across the 26 standalone templates, the deliveries and the gallery, retune the checker's visual families to the new values, and regenerate the screenshots."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: shadcn visual upgrade

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Standalone HTML templates with inline CSS, SVG and script; Node for the checker and the gallery builder |
| **Framework** | None; the checker forbids external resources |
| **Storage** | None |
| **Testing** | `scripts/check-corpus.cjs --render` as the gate; one mutation per new assertion; screenshot review |

### Overview
Measure first, then move the system in one place per value. The shared style block every template carries gets the new tokens (card scale, tick style, grid, radius, gradient, tooltip card, legend chips); each form is then brought to them one at a time with the checker run after every form. The two new assertions are written and shown failing before any form is edited to pass them. Screenshots and the gallery are regenerated last, from the final corpus, and reviewed by eye against the frozen shadcn examples.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] `check-corpus.cjs --render` passing on the final corpus with the two new families present
- [x] Docs updated (spec/plan/tasks, acceptance criteria, goal, implementation summary, references, changelog)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Template corpus with a single static checker as the binding contract and a render pass as the visual gate.

### Key Components
- **Templates**: 26 standalone forms sharing one style vocabulary; the visual tokens live in each file's style block and geometry block
- **Checker**: `check-corpus.cjs`, whose `type-scale`, `radius`, `card-parts` and `interaction-hygiene` families are retuned, plus new `legend` and `tooltip-card` families
- **Gallery builder**: `build-gallery.cjs`, which must pin each frame's scheme in a way the templates honour

### Data Flow
A template declares its data, series keys, readout knobs and curve in sentinel blocks; the drawing code reads them and paints with the shared visual tokens; the tooltip card and legend chips are built from the same `READOUT` and series declarations; the checker reads the blocks and the markup and errors on disagreement; the render pass opens each file in both schemes and compares two paints.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared helpers.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `check-corpus.cjs` visual families | the binding contract for scale, radius and card parts | retune, never remove; add `legend` and `tooltip-card` | per-family counts do not fall; mutations fail before the corpus passes |
| `build-gallery.cjs` and `assets/gallery.html` | the one-page corpus review | pin each frame's scheme so the templates honour it | `gallery.png` shows a light column that is light |
| `template-contract.md`, `color-system.md`, four deliveries | how authors and readers see the system | update | the references state the system; deliveries pass the gate |

Required inventories:
- Same-class producers: `rg -n 'data-chart-tooltip|class="grid"|\.tick \{|stroke-dasharray' .opencode/skills/sk-design/sk-design-chart/assets`.
- Consumers of changed symbols: `rg -n 'type-scale|radius|card-parts|interaction-hygiene' .opencode/skills/sk-design/sk-design-chart/scripts .opencode/skills/sk-design/sk-design-chart/references`.
- Matrix axes: form (26) by scheme (light, dark) by part present (axis, bars, path, area, tooltip, legend).
- Algorithm invariant: two opens of one file paint the same picture; the tooltip card never leaves the card's box.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | every template, delivery and the gallery | `check-corpus.cjs`, RESULT: PASSED |
| Mutation | one per new assertion | a mutated copy turns the run to FAILED |
| Render | card readouts, pointer reach, settled and dark renders | `check-corpus.cjs --render` |
| Visual review | three forms against three shadcn examples | an independent reviewer reads the captures and the frozen source |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 13 frozen shadcn copy | Internal | Green | Source of every measured value |
| Phase 14 contracts | Internal | Green | The tooltip card and legend read them |
| A local Chrome for `--render` | Environment | Green on 2026-09-07 | Render-dependent families would be unknown |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the render gate cannot be made to pass without loosening a palette gate or removing a checker family
- **Procedure**: `git checkout HEAD -- .opencode/skills/sk-design/sk-design-chart` restores templates, checker, references and screenshots together
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | measure the values and write them down |
| Core Implementation | High | eight moves across 30 files plus the checker and gallery |
| Verification | Med | render gate, two mutations, screenshot review |
| **Total** | | **One long implementation session and one verification session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) — N/A; this packet changes local static assets only
- [x] Feature flag configured — N/A; no runtime rollout surface exists
- [x] Monitoring alerts set — N/A; no deployed service is changed

### Rollback Procedure
1. Stop editing; the checker output names the family
2. Revert the scoped working-tree diff for the chart package
3. `check-corpus.cjs --render` prints RESULT: PASSED again
4. Not user-facing

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A; no data or deployed state changes
<!-- /ANCHOR:enhanced-rollback -->

---
