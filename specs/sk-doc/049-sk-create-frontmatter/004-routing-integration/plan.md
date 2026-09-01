---
title: "Implementation Plan: Phase 4: routing-integration"
description: "Registers sk-create-frontmatter and wires both routing stages: a mode-registry entry, a hub-router vocabulary class of 17 qualified keywords, ROUTER.md intents and resources, a SKILL.md mode-table row, a regenerated leaf manifest, and a single-route canary case. Every keyword is qualified so none collides with a sibling mode, and both stages are proven by replay rather than by the presence of a registry entry."
trigger_phrases:
  - "frontmatter routing integration"
  - "hub router vocabulary class"
  - "two stage routing proof"
  - "canary coverage guard"
  - "compiled routing refresh sequence"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: routing-integration

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON routing configuration plus markdown router documents under `.opencode/skills/sk-doc/`; the gates are Python and Node |
| **Framework** | The sk-doc two-stage router: the skill advisor selects the hub, the hub router then selects the mode |
| **Storage** | None at run time. The compiled routing manifest is a generated artifact with its own publish sequence |
| **Testing** | `skill_advisor.py` for stage one, the sk-doc canary harness for stage two, `d5-connectivity.cjs` for leaf resolution, and `parent-skill-check.cjs` for the hub invariants |

### Overview
This phase registers the mode and wires both routing stages, then proves a request actually reaches it.
A registry entry is not a route: the advisor has to pick the hub from the request, and the hub router
has to pick this mode over its fourteen siblings. Both halves are demonstrated by replay. The phase also
closes the hub-gate deviation phase 002 recorded, because registration is exactly what invariant 6a was
asking for.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented — spec.md §2 states the failure mode directly: this hub has shipped registered-but-unreachable modes, and the canaries had no assertion that would notice
- [x] Success criteria measurable — SC-001 is a stage-two replay, SC-002 is a canary exit status with a coverage count, SC-003 is a frozen-corpus comparison; all three produce readable output
- [x] Dependencies identified — the phase 002 packet and the phase 003 content it holds, plus the canary fixture corpus and the compiled-routing publish sequence

### Definition of Done
- [x] All acceptance criteria met — AC-001 through AC-007 in acceptance-criteria.md are all `Met`
- [x] Tests passing (if applicable) — all 22 canary rows green, `d5-connectivity.cjs` score 100 with `gateFailed: false`, and all five hub canaries exit 0
- [x] Docs updated (spec/plan/tasks) — plan.md, tasks.md, acceptance-criteria.md and implementation-summary.md all trace to spec.md's REQ-001 through REQ-004 and SC-001/002/003
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two-stage routing. Stage one is the skill advisor scoring a request against each hub's advisor surfaces
and selecting a hub. Stage two is the hub's own router scoring the same request against its vocabulary
classes and selecting one or more modes. A mode reachable in one stage and not the other is invisible,
which is the failure this phase exists to prevent.

### Key Components
- **`mode-registry.json`** — the mode's identity: a fifteenth entry, `packetKind: workflow`, `command: null` because no command is added here, `advisorRouting.routingClass: "metadata"`, and 17 aliases. A `metadata` class means the mode is resolved by hub membership and has no advisor entry of its own.
- **`hub-router.json`** — a `create-frontmatter-aliases` vocabulary class holding the same 17 keywords, a `routerSignals` entry at weight 4 pointing at `sk-create-frontmatter/SKILL.md`, and a `routerPolicy.tieBreak` slot.
- **`ROUTER.md`** — the prose side of stage two: a bullet in the intent model, a `FRONTMATTER` entry in `INTENT_SIGNALS`, a `FRONTMATTER` entry in `RESOURCE_MAP` naming the mode's three leaves, and the same leaves in `FULL_INVENTORY`, which enumerates the whole hub.
- **`SKILL.md`** — a mode-table row, required by hub invariant 6b.
- **`leaf-manifest.json`** — regenerated rather than hand-edited, adding the mode's three leaves.
- **The hub's advisor surfaces** — `graph-metadata.json` and `description.json` carry the frontmatter vocabulary that lets stage one find the hub at all.

### Data Flow
A request reaches the advisor, which scores it against each hub's `graph-metadata.json` vocabulary and
returns a hub with a confidence. The hub's router then scores the same request against
`hub-router.json`'s vocabulary classes and `ROUTER.md`'s intent signals, and resolves to one or more
modes. `leaf-manifest.json` and `RESOURCE_MAP` are what turn the selected mode into the specific files
loaded. `d5-connectivity.cjs` walks that whole chain and reports whether any link in it is dead.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Routing is a shared contract: every keyword added to this hub competes with every keyword already there.
The surfaces are enumerated for that reason.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/sk-doc/mode-registry.json` | The mode roster | Updated: a fifteenth mode, `packetKind: workflow`, `command: null`, `routingClass: "metadata"`, 17 aliases | The canary coverage guard reads the live registry and reports `modesWithSingleRouteCase: 15` |
| `.opencode/skills/sk-doc/hub-router.json` | Stage-two vocabulary and weights | Updated: a `create-frontmatter-aliases` class, a `routerSignals` entry at weight 4, a `routerPolicy.tieBreak` slot | The canary case `single-create-frontmatter` resolves to the mode with `realEvaluateRouteGoldPass: true` |
| `.opencode/skills/sk-doc/ROUTER.md` | Stage-two prose, intents, resource map and full inventory | Updated: an intent-model bullet, an `INTENT_SIGNALS` entry, a `RESOURCE_MAP` entry with three leaves, and the same leaves in `FULL_INVENTORY` | `d5-connectivity.cjs` reports `routerParseable: true` with empty `deadIntentKeys` and `deadResourcePaths` |
| `.opencode/skills/sk-doc/SKILL.md` | The hub's mode table | Updated: one row, required by invariant 6b | `parent-skill-check.cjs` reports all hard invariants passing |
| `.opencode/skills/sk-doc/leaf-manifest.json` | The leaf index | Regenerated with `generate-leaf-manifest.cjs --write`, adding three leaves | `d5-connectivity.cjs` reports `hubStageTwoRouted: 3` |
| `.opencode/skills/sk-doc/{graph-metadata,description}.json` | The hub's stage-one advisor surfaces | Updated: frontmatter vocabulary added; four "thirteen packets" claims corrected to fourteen across `SKILL.md`, the generated description and the causal summary | `skill_advisor.py` returns `sk-doc` at confidence 0.95 citing the three new signals by name |
| The canary fixture corpus | The stage-two regression harness | Updated: one new single-route case, plus two legitimate source re-pins | All 22 rows green; the 14 pre-existing single-route cases still resolve to their own modes |
| Sibling modes `AGENT_CREATION` and `CHANGELOG` | Adjacent vocabulary owners | Not consumers, and deliberately unchanged | An intent-scorer replay shows `AGENT_CREATION: 12` and `CHANGELOG: 8` on their own prompts, with FRONTMATTER at zero on both |
| The compiled routing manifest | The served routing artifact | Refreshed, synced, verified and finalized through the documented sequence | All five hubs `compiled-serving`; `move-simulation OK: all 5 hubs resolve; 0 reads under .opencode/specs` |

Required inventories:
- Same-class producers: every vocabulary class in `hub-router.json` and every `INTENT_SIGNALS` entry in `ROUTER.md` is a same-class producer, because each competes for the same request text. All 17 candidate keywords were checked against every existing keyword in both files.
- Consumers of the changed surface: the advisor, the hub router, `leaf-manifest.json`, `d5-connectivity.cjs`, the canary harness and `parent-skill-check.cjs` invariants 6a, 6b and 10d.
- Matrix axes: 17 candidate keywords crossed with every existing keyword in two files, checked for substring collision. Result: zero collisions in either.
- Algorithm invariant: no new keyword may tie with or outscore a sibling's exclusive route on that sibling's own prompt. This is why a bare `frontmatter` token was rejected: `AGENT_CREATION` already owns "agent frontmatter".
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns the Setup, Implementation, and Verification phase checkboxes and task state.

### Phase 1: Design the vocabulary and capture the baseline

Choose 17 qualified keywords, check every one for substring collision against every existing keyword in
`ROUTER.md` and `hub-router.json`, and record the pre-registration canary topology counts so the
expected movement is known before anything changes.

### Phase 2: Register and wire both stages

Add the registry entry, the hub-router vocabulary class and signal, the `ROUTER.md` intents and
resources, the `SKILL.md` mode-table row, the regenerated leaf manifest, the advisor-surface vocabulary,
and the single-route canary case.

### Phase 3: Prove reachability, then publish

Replay both stages, run the connectivity gate, confirm the coverage guard counts the mode, confirm no
sibling lost a route, confirm the hub gate returns to exit 0, and publish the compiled routing through
its documented refresh sequence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Stage-one routing | Does a frontmatter request select this hub, and does it match on the new vocabulary specifically | `python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py "<prompt>" --threshold 0.5`, reading the `reason` field for the signal names |
| Stage-two routing | Does the hub router resolve the mode's own vocabulary to the mode | The canary case `single-create-frontmatter`, checking `selectionKind`, `targets` and `realEvaluateRouteGoldPass` |
| Leaf connectivity | Does every leaf the mode declares resolve on disk | `d5-connectivity.cjs --skill .opencode/skills/sk-doc/sk-create-frontmatter`, and the same on the hub |
| Coverage | Does the guard count the mode as covered, derived from the live registry | The canary harness's `modesWithSingleRouteCase` count |
| Regression | Did any sibling lose a route | All 22 canary rows, plus an intent-scorer replay on sibling-owned prompts |
| Hub invariants | Does registration close the phase 002 deviation | `node .opencode/commands/doctor/scripts/parent-skill-check.cjs` |
| Publication | Does the compiled routing serve the new topology | `compiled-route-manifest.cjs refresh`, `compiled-route-sync.cjs`, the status, verify and canary gates, then `--finalize` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002's mode packet | Internal, upstream | Green — the directory and its `SKILL.md` existed to point at | Nothing to register |
| Phase 003's migrated content | Internal, upstream | Green — the three leaves the resource map names are real files | `d5-connectivity.cjs` would report dead resource paths |
| The canary fixture corpus | Internal | Green — 22 rows, all green after two legitimate re-pins | No stage-two regression signal |
| `generate-leaf-manifest.cjs` | Internal | Green — regenerated the manifest rather than hand-editing it | A hand-edited manifest drifts from the tree it indexes |
| The compiled-routing publish sequence | Internal | Yellow — a first attempt left a publication lock held by an exited process; cleared with `--revert` on the retained rollback | The hub stays at `stale-manifest` from phase 003 |
| Sibling modes `AGENT_CREATION` and `CHANGELOG` | Internal | Green — neither lost a route | A vocabulary collision would convert a sibling's exclusive route into a bundle |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A canary row goes red, the coverage guard stops counting the mode, a sibling loses a route, or the compiled routing cannot be published cleanly.
- **Procedure**: Revert the routing files as a set (`mode-registry.json`, `hub-router.json`, `ROUTER.md`, `SKILL.md`, `leaf-manifest.json`, `graph-metadata.json`, `description.json` and the canary fixture), then rerun the canary and the coverage guard to confirm the 14-mode topology is restored. If the compiled routing has already been synced, `compiled-route-sync.cjs --revert` on the retained rollback returns the served artifact to its previous state; that path was exercised during this phase when a lock left by an exited process blocked a sync with `EEXIST`.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Implementation) ──► Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

Not applicable. No hour-level effort estimate was recorded for this phase; progress is tracked by
per-task completion in `tasks.md` (T001-T017), not against a time budget.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) — the compiled-routing sync retains a rollback directory by design, and that retained rollback was the mechanism that cleared the stale publication lock
- [x] Feature flag configured — Not applicable: routing has no flag. A mode is registered or it is not, and the coverage guard reads the live registry rather than a toggle
- [x] Monitoring alerts set — the canary harness, the coverage guard and `d5-connectivity.cjs` are the standing monitoring; all three were run and all three now count this mode

### Rollback Procedure
1. Revert the seven routing files and the canary fixture as one set.
2. Rerun the sk-doc canary and confirm the coverage guard reports the previous 14-mode topology.
3. If the compiled routing was already synced, run `compiled-route-sync.cjs --revert` against the retained rollback and confirm the hub returns to its previous served state.
4. Rerun `parent-skill-check.cjs` and expect invariant 6a to fail again, since reverting registration restores the phase 002 deviation.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. The only generated artifacts are `leaf-manifest.json` and the compiled routing manifest, and both are regenerated from source rather than migrated.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phase 1   │────►│   Phase 2   │────►│   Phase 3   │
│   Setup     │     │Implementation│    │ Verification │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Phase 1 (Setup) | Phases 002 and 003 | The 17-keyword vocabulary, its collision proof, and the pre-registration topology counts | Phase 2 |
| Phase 2 (Implementation) | Phase 1 | The registry entry, both stages wired, the regenerated leaf manifest and the canary case | Phase 3 |
| Phase 3 (Verification) | Phase 2 | Both replays, the connectivity score, the coverage count, the sibling-regression probe, the restored hub gate, and the published compiled routing | Phase 005's command and playbook work |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 1 (Design the vocabulary and capture the baseline)** - Duration: not tracked - CRITICAL
2. **Phase 2 (Register and wire both stages)** - Duration: not tracked - CRITICAL
3. **Phase 3 (Prove reachability, then publish)** - Duration: not tracked - CRITICAL

**Total Critical Path**: Not applicable. No duration estimates were recorded for this phase.

**Parallel Opportunities**:
- None taken. The vocabulary has to be collision-checked before it is written, both stages have to be wired before either can be replayed, and the compiled routing can only be published from a state that already passes its gates.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Vocabulary designed and proven collision-free | 17 qualified keywords, zero substring collisions against every existing keyword in `ROUTER.md` and `hub-router.json` | Complete |
| M2 | Both stages wired | Registry, hub router, `ROUTER.md`, `SKILL.md`, leaf manifest and advisor surfaces all updated | Complete |
| M3 | Reachability proven | Advisor returns `sk-doc` at 0.95 on the new signals; the canary resolves the mode with `realEvaluateRouteGoldPass: true`; `d5-connectivity.cjs` score 100 | Complete |
| M4 | Published and green | All five hubs `compiled-serving`, all five canaries exit 0, hub gate back to exit 0, no lock or rollback directory left behind | Complete |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Every keyword is qualified; no bare `frontmatter` token enters the vocabulary

**Status**: Accepted

**Context**: The obvious vocabulary for a frontmatter mode starts with the word "frontmatter". The hub
already routes on it: `AGENT_CREATION` owns "agent frontmatter". A bare token would have matched every
prompt that sibling matches, tied with it, and turned an exclusive sibling route into a two-mode bundle.
spec.md §3 puts the alternative out of scope in advance: widening a sibling's vocabulary to make room is
a naming problem, not a budget problem.

**Decision**: All 17 keywords are qualified: `yaml frontmatter`, `frontmatter block`, `description
budget` and the like. No bare `frontmatter` token is added. Every candidate was checked for substring
collision against every existing keyword in both `ROUTER.md` and `hub-router.json` before being written.

**Consequences**:
- Zero collisions in either file, and an intent-scorer replay confirms the separation holds on real prompts: "create an agent with agent frontmatter and a permission object" scores `AGENT_CREATION: 12` with FRONTMATTER at zero, and "yaml frontmatter block" scores `FRONTMATTER: 8` alone.
- A user who types only the bare word will not reach this mode from stage two on that token alone. That is the deliberate cost of not disturbing a sibling, and the qualified forms cover the phrasings the mode's own documentation uses.

**Alternatives Rejected**:
- Adding the bare token and accepting the tie: rejected because it degrades a working sibling route to buy a marginal one.
- Narrowing `AGENT_CREATION`'s vocabulary to free the token: rejected by spec.md §3, and it would trade one mode's reachability for another's rather than adding any.

---


<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->
