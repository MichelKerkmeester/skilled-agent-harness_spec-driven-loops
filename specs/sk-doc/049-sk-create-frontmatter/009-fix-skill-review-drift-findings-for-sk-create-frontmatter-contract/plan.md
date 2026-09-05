---
title: "Implementation Plan: fix the skill-review drift findings in the sk-create-frontmatter contract"
description: "Correct the contract to what the code does, make the declared triggers scoreable, trim the hub description inside its own budget with the routing refresh that requires, and reconcile the packet documents. Every change is held to a check named before the edit."
trigger_phrases:
  - "frontmatter drift remediation plan"
  - "hub description trim plan"
  - "compiled routing refresh sequence"
  - "contract correction proof plan"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 9: fix the skill-review drift findings in the sk-create-frontmatter contract

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown contracts, JSON routing metadata, one Node usage string |
| **Framework** | sk-doc parent hub, compiled-routing tooling, spec-kit validator |
| **Storage** | None |
| **Testing** | `package_skill.py`, `validate_document.py`, `test-frontmatter-version.mjs`, advisor replays, `parent-skill-check.cjs`, `compiled-route-guard.cjs`, `validate-canary.cjs`, `validate.sh --strict` |

### Overview
Four kinds of change, each with its own proof. Contract text is corrected against the validators it
describes, and the validator is re-run. Routing vocabulary is extended and replayed before and after.
The hub description is trimmed under a baseline of hub-shaped prompts and the canary's route-gold
rows, with the compiled-routing refresh carried in the same pass. Packet documents are reconciled
and the spec validator is re-run on every folder.
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
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Contract-first correction. The document that owns a rule is changed to match the code that enforces
it, never the reverse, and the ownership boundary phase 001 drew stays where it is.

### Key Components
- **Field reference**: the contract. Sections 1, 4 and 5 and the checklist carry the drift
- **Shared-tier validators**: `quick_validate.py`, `package_skill.py`, the advisor's checker. Read, not edited, except the engine's usage string
- **Hub routing surfaces**: `mode-registry.json` for stage two, `graph-metadata.json` for stage one, both already carrying the mode
- **Compiled-routing tooling**: pins the hub `SKILL.md` bytes, so a description edit is a refresh event

### Data Flow
A prompt reaches the advisor, which scores the hub on `graph-metadata.json` and the hub description.
A hit routes into `hub-router.json`, which picks the mode by alias. The description therefore sits
on the same path as the aliases, and trimming it is measured on that path.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `assets/frontmatter-templates.md` sections 1, 5, checklist | States parser and length rules | Update to what `quick_validate.py` and `package_skill.py` enforce | Grep for `20 lines`, `10-200`, `max_length`, `suggest_removal` returns nothing |
| `assets/frontmatter-templates.md` section 4 notes | Claims coverage-mode enforcement of the five-field block | Update to the checker's real default and walk | The note names shape mode and the top-level walk, with the script path |
| `frontmatter-version.mjs` `helpText` | Usage string | Update to list `gate` | `--help` output contains `gate`, engine tests pass |
| `sk-create-frontmatter/SKILL.md` keyword list, `mode-registry.json` aliases | Stage-two vocabulary, kept identical by convention | Add `trigger phrases` | `diff` of the two lists is empty |
| `sk-doc/graph-metadata.json` | Stage-one vocabulary | Add `version field` and `trigger phrases` | Advisor replay routes both above the incidental floor |
| `sk-doc/SKILL.md` description | Lexical-lane input and pinned source | Trim to the soft target | Audit headroom, guard stale then fresh, canary `REAL-GREEN`, baseline prompts replayed |
| Advisor scorer | Scores `trigger_phrases` at zero | Not a consumer of this change, recorded | Observation in the summary with the command |
| Advisor doc-frontmatter checker | Walks top-level skills only | Not changed, contract corrected | The contract note matches `DOC_SUBDIRS` and the `skillsRoot` walk at lines 34 and 173 |

Required inventories:
- Same-class producers: `rg -n '20 lines|10-200|max_length|suggest_removal' .opencode/skills/sk-doc/sk-create-frontmatter`
- Consumers of the changed alias list: `rg -n 'trigger phrases' .opencode/skills/sk-doc/{mode-registry.json,graph-metadata.json,sk-create-frontmatter/SKILL.md}`
- Matrix axes: seventeen declared triggers plus one new alias, replayed once each before and after
- Algorithm invariant: none, no parser or resolver changes
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
| Unit | Engine usage text | `test-frontmatter-version.mjs` |
| Integration | Mode shape, hub invariants, compiled routing | `package_skill.py --check --strict`, `parent-skill-check.cjs`, `compiled-route-guard.cjs`, `compiled-route-sync.cjs --verify`, `validate-canary.cjs` |
| Manual | Routing reachability | Advisor replays of the trigger set and the hub baseline prompts |
| Documents | Everything written | `validate_document.py`, `hvr_scan.py`, `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Advisor daemon | Internal | Green, `freshness: live` | No routing claim can be made |
| Compiled-routing tooling | Internal | Green, all five hubs fresh before the edit | The hub edit cannot be proved refreshed |
| Spec-kit validator | Internal | Green on all nine folders before the edit | Packet reconciliation cannot be proved |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the canary reports anything but `REAL-GREEN` after the hub edit, or a baseline prompt that routed to `sk-doc` before stops routing after
- **Procedure**: `git checkout -- .opencode/skills/sk-doc/SKILL.md`, re-run the manifest re-mint and the canary build so the pins match the restored bytes, and record the failed prompt in the summary
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Baselines ──► Contract and engine edits ──► Routing edits ──► Hub description ──► Refresh and re-pin ──► Packet reconciliation ──► Whole-gate sweep
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Baselines | None | Everything measured |
| Contract and engine edits | Baselines | Whole-gate sweep |
| Routing edits | Baselines | Hub description |
| Hub description | Routing edits | Refresh and re-pin |
| Packet reconciliation | None | Whole-gate sweep |
| Whole-gate sweep | All | Closure |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | One session's baselines |
| Core Implementation | Medium | Nine authored files |
| Verification | Medium | Twelve gates, two replays |
| **Total** | | **One session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline captured for every routing claim
- [x] Guard and canary read fresh and green before the hub edit
- [x] No data changes

### Rollback Procedure
1. Restore the file with `git checkout -- <path>`
2. For the hub `SKILL.md`, re-mint and rebuild the canary so the pins match the restored bytes
3. Re-run the gate that failed

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────┐     ┌──────────────────┐     ┌────────────────┐
│  Baselines   │────►│ Contract, engine,│────►│  Whole-gate    │
│              │     │ routing edits    │     │  sweep         │
└──────────────┘     └────────┬─────────┘     └────────────────┘
                              │
                     ┌────────▼─────────┐
                     │ Hub description, │
                     │ refresh, re-pin  │
                     └──────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Baselines | None | Before-numbers | Every claim |
| Contract edits | Baselines | Corrected reference | Sweep |
| Routing edits | Baselines | Scoreable trigger set | Hub description |
| Hub description | Routing edits | Trimmed description | Refresh |
| Refresh and re-pin | Hub description | Fresh guard, green canary | Sweep |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Baselines** - minutes - CRITICAL
2. **Hub description, refresh, re-pin** - the one step that can fail a gate - CRITICAL
3. **Whole-gate sweep** - minutes - CRITICAL

**Total Critical Path**: one session

**Parallel Opportunities**:
- Contract edits and packet reconciliation touch disjoint files and run alongside the routing work
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baselines captured | Advisor, audit and guard numbers recorded before any edit | Start |
| M2 | Contract and routing corrected | Greps clean, replay green | Mid |
| M3 | Hub refreshed | Guard fresh, canary `REAL-GREEN`, audit headroom above 400 | Late |
| M4 | Packet closed | `validate.sh --strict` green on all ten folders | End |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

Decisions for this phase are recorded in `decision-record.md`: the hub description trim and its
refresh sequence, the spaced alias in place of a scorer change, and correcting the contract to the
checker's real coverage rather than extending the checker.
