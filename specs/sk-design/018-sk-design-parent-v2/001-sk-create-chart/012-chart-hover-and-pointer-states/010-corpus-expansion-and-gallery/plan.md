---
title: "Implementation Plan: Enlarge every pointer target, restyle all forms with richer data, expand the catalogue with new chart types, and ship one light and dark gallery"
description: "[2-3 sentences: what this implements and the technical approach]"
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Enlarge every pointer target, restyle all forms with richer data, expand the catalogue with new chart types, and ship one light and dark gallery

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Five children, ordered so each lands on a corpus that already satisfies the one before.

`001` makes pointers reach their marks and adds the rule that keeps them reaching. `002` replaces
every placeholder figure and then restyles, as two separately gated stages. `003` adds five forms
under an admission rule. `004` generates the gallery and makes a stale one an error. `005` proves
the whole thing from the final state.

`002` and `003` overlap deliberately: new forms are new files, and the data stage only touches
existing ones, so they cannot collide.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Command | Pass condition |
|------|---------|----------------|
| Corpus, static | `node scripts/check-corpus.cjs` | literal `RESULT: PASSED` |
| Corpus, rendered | `node scripts/check-corpus.cjs --render` | literal `RESULT: PASSED` |
| Packet | `validate.sh <folder> --strict` | literal `RESULT: PASSED`, first `RESULT:` line |

An exit code is not a gate. The corpus checker buffers all output to the end and takes minutes, so
an empty log means running rather than passing.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Everything stays a self-contained static file. No framework, no CDN, no build step for the charts,
readable with scripting unavailable. The only generated artifact is the gallery, and it is a page
about the corpus rather than part of it.

Three rules were added to `check-corpus.cjs`, and each is enforced the same way the corpus already
enforced everything else: watched failing on a real file before it is believed.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| [producer/helper/policy] | [what owns the behavior] | [update/unchanged/not a consumer] | [grep/test/doc evidence] |
| [consumer/status/docs/tests] | [how it observes the behavior] | [update/unchanged/not a consumer] | [grep/test/doc evidence] |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

There is no unit-test harness here; the corpus checker is the suite. A rule is tested by mutating a
real file until the rule fires, reading the message, and restoring from a byte-identical copy.

Worker output is never trusted on its own account. Containment is checked against a pre-dispatch
snapshot, arithmetic is recomputed from the data, and the restyle is checked by comparing rendered
table text character by character.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Node and the headless Chrome the render pass already uses. Nothing installed.
- Packet `012`'s first nine phases, which established the pointer contracts this phase makes reachable.

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Each child is separable. The resolver is one function per file; the rules are call sites in one
script; the gallery is a generated page and its generator. Restoring the affected paths from the
previous commit and re-running the gate returns the corpus to its prior state.

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

| Phase | Complexity | Notes |
|-------|------------|-------|
| Measure and decide | Medium | The measurement is where this work goes wrong, not the edit |
| Build | Low to medium | Bounded and mechanical once the decision is made |
| Prove | Medium | Every new rule is watched failing before it is trusted |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Every changed file is tracked, so the working tree and `git` are the backup
- [x] No flag applies: nothing here is deployed or feature-gated
- [x] The corpus gate is the smoke test, run on demand

### Rollback Procedure
1. Restore the affected paths from the previous commit.
2. Re-run `node scripts/check-corpus.cjs --render` and confirm `RESULT: PASSED`.
3. Confirm the rule tallies return to their prior counts.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A. Nothing outside this package is written.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phase 1   │────►│   Phase 2   │────►│   Phase 3   │
│   Setup     │     │    Core     │     │   Verify    │
└─────────────┘     └──────┬──────┘     └─────────────┘
                          │
                    ┌─────▼─────┐
                    │  Phase 2b │
                    │  Parallel │
                    └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| `001` pointer targets | None | A resolver on every mark-carrying file, and `pointer-reach` | 002, 003 |
| `002` data and restyle | 001 | Believable figures, then a lighter corpus | 004 |
| `003` new forms | 001 | Five forms, a contract row and catalogue entry each | 004 |
| `004` gallery | 002, 003 | A generated page and the rule that keeps it fresh | 005 |
| `005` closure | 004 | Proof from the final state, and the parent reconciled | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **[Phase/Task]** - [Duration estimate] - CRITICAL
2. **[Phase/Task]** - [Duration estimate] - CRITICAL
3. **[Phase/Task]** - [Duration estimate] - CRITICAL

**Total Critical Path**: [Sum of durations]

**Parallel Opportunities**:
- [Task A] and [Task B] can run simultaneously
- [Task C] and [Task D] can run after Phase 1
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | [Setup Complete] | [All dependencies ready] | [Date/Phase] |
| M2 | [Core Done] | [Main features working] | [Date/Phase] |
| M3 | [Release Ready] | [All tests pass] | [Date/Phase] |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: [Decision Title]

**Status**: [Proposed/Accepted/Deprecated]

**Context**: [What problem we're solving]

**Decision**: [What we decided]

**Consequences**:
- [Positive outcome 1]
- [Negative outcome + mitigation]

**Alternatives Rejected**:
- [Option B]: [Why rejected]

---


<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->
