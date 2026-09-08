---
title: "Implementation Plan: DESIGN.md theming"
description: "One script derives a gated chart palette, typeface and corner ladder from a v3 Style Reference and writes themed copies with provenance; the checker accepts the design-md system by provenance plus inline gates."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: DESIGN.md theming

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node CommonJS script beside the checker; standalone HTML output |
| **Framework** | None; no dependency is added |
| **Storage** | None; input is a local `DESIGN.md` and optional `tokens.json` |
| **Testing** | `node --test` cases on the four bundled example Style References; `check-corpus.cjs` static and `--render`; `--extra` on themed output |

### Overview
Parse the three v3 sections by their documented headings, rank the colours into the corpus' roles, compute the corpus gates from `palettes.json` on the result, and only then write. The checker gains one narrow branch for `system=design-md` and one option to scan an output directory. The stripe example becomes the corpus' own proof delivery.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Corpus static and render gates passing with the proof delivery; tests passing — static and tests pass, but render is sandbox-blocked.
- [x] Docs updated (spec/plan/tasks, acceptance criteria, goal, implementation summary, references, routing, changelog) — packet docs record the observed render limitation.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A derivation script in front of an unchanged template corpus, with the checker as the binding contract for its output.

### Key Components
- **Parser**: reads `## Tokens — Colors`, the primary typeface block and `### Border Radius` from a v3 `DESIGN.md`; reads `darkMode` from `tokens.json` when present
- **Mapper**: ranks colours into surface, ink, muted, rule, series one to four and emphasis per ground
- **Gate**: the corpus gates from `palettes.json`, computed on the derived values before any write
- **Writer**: rewrites the two palette blocks, the provenance comment, the font stacks and the corner ladder of each chosen form
- **Checker branch**: `design-md` provenance plus inline gates; `--extra <dir>`

### Data Flow
`DESIGN.md` tables become a role map; the role map is gated; the gated map is written into copies of the chosen forms; the checker reads the copies' provenance comment and inline values and runs every family on them.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared helpers.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `check-corpus.cjs` palette-source families | byte equality against `palettes.json` | add the `design-md` branch beside it, never inside it | stock forms still compared byte for byte; a themed block with a bad hash or a failing ratio errors |
| `SKILL.md` routing and boundary | sends style references away | keep extraction away, route application here | the routing branch names the script; the boundary sentence is rewritten |
| `assets/examples/` | deliveries | one themed proof delivery | corpus static and render PASSED |

Required inventories:
- Same-class producers: `rg -n 'CHART_PALETTE:BEGIN|CHART_PALETTE_DARK:BEGIN' .opencode/skills/sk-design/sk-design-chart`.
- Consumers of changed symbols: `rg -n 'palette-source|canonicalBlock|canonicalDarkBlock|checkPaletteSource' .opencode/skills/sk-design/sk-design-chart/scripts`.
- Matrix axes: example Style Reference (four) by ground (light, dark) by outcome (pass, refuse).
- Algorithm invariant: a themed copy is byte-identical to its source outside the four rewritten regions.
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
| Unit | parser, mapper, gate, writer | `node --test scripts/tests/apply-design-md.test.cjs` on the four bundled examples plus one refusal fixture |
| Static | the corpus with the proof delivery, and themed output via `--extra` | `check-corpus.cjs`, RESULT: PASSED |
| Render | the proof delivery in both grounds | `check-corpus.cjs --render` |
| Byte identity | one themed copy against its source | `diff` limited to the four rewritten regions |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `design-md-format.md` v3 and the four bundled examples | Internal | Green | The parse contract and fixtures |
| Phase 15 committed | Internal | Green | `git log` returned commit `416827fd10` before the applicator run |
| A local Chrome for `--render` | Environment | Blocked in sandbox | The render command exits 1 because Chrome returns no document; the conductor must rerun it elsewhere |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the checker branch cannot accept a themed block without weakening stock source equality
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
| Core Implementation | Med | one script, one checker branch, one delivery, five docs |
| Verification | Low | tests, static and render gate, one diff |
| **Total** | | **One implementation session and one verification session** |
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
