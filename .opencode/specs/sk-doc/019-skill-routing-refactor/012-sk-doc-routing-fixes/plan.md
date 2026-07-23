---
title: "Implementation Plan: sk-doc Router Path-Contract Fixes"
description: "Dependency-ordered approach: contract library, then hub topology artifacts, then parent-check enforcement, then fixture typed-gold migration plus a topology validator, then replay/dispatch canonical pairs, then the nine affected packet maps, then scorer/report taxonomy, then Layer B template doctrine."
trigger_phrases:
  - "sk-doc routing fixes plan"
  - "leaf resource contract implementation phases"
  - "dependency-ordered fix plan"
  - "sk-doc path contract rollback"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/012-sk-doc-routing-fixes"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the nine-phase dependency-ordered implementation plan from research.md Section 8"
    next_safe_action: "Await operator authorization, then start Phase 1 (contract library)"
    blockers:
      - "Sequenced after sibling packet 011-skill-advisor-routing-research per the 031 parent"
    key_files:
      - "plan.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "012-sk-doc-routing-fixes-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: sk-doc Router Path-Contract Fixes

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS scripts), TypeScript (vitest suites), Markdown/JSON (fixtures and templates) |
| **Framework** | None. Plain `node --test` for unit coverage, vitest for the skill-benchmark scoring suite |
| **Storage** | Filesystem only: JSON manifests, Markdown frontmatter fixtures. No database |
| **Testing** | `node --check`, `node --test`, `npx vitest run` against the existing skill-benchmark vitest config |

### Overview

The fix lands as nine sequential steps, each one building on the previous step's output. A pure contract library normalizes leaf resources into a canonical typed pair. Hub topology artifacts and an extended parent-check guard enforce that contract at commit time. Fixtures and the replay/dispatch layer adopt the typed pair with a dual-read bridge for legacy strings. The nine affected packets get their maps corrected against that contract. The scorer and report split error classes so a fresh benchmark run measures the real defect, not a path-format artifact. Two Layer B steps then propagate the contract into create-skill's authoring templates so future hubs do not reintroduce it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- Research packet `010-sk-doc-routing-research` is complete with all 10 iterations and a frozen fix plan (confirmed, `research.md` Sections 8-11).
- Operator authorizes implementation start (currently pending, per the 031 parent's sequencing against sibling packet 011).

### Definition of Done
- All 9 fix-plan steps (Section 8) land in the dependency order below.
- All 8 verification commands (research.md Section 9) pass, ending in a fresh Mode-B live run.
- The Section 10 acceptance matrix holds for every one of the 19 sk-doc fixtures, with SD-008 and SD-012 unchanged.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Contract library plus fail-closed validation pipeline. A single source of truth (the leaf-resource contract) feeds a generated, committed manifest. Every runtime consumer (guard, fixtures, replay, dispatch, scorer) reads that manifest instead of deriving its own path logic.

### Key Components
- **Contract library** (`leaf-resource-contract.cjs`): pure functions for normalization, composite-key construction, containment checks, canonical-byte serialization and digesting. No side effects, no filesystem writes.
- **Manifest generator** (`generate-leaf-manifest.cjs`): `--write` produces `leaf-manifest.json` from the contract library plus the authored `leaf-aliases.json`. `--check` fails on drift.
- **Parent-check guard** (`parent-skill-check.cjs` extension): validates manifest source, byte drift, target/collision and bidirectional selected-map reachability, in that order, with distinct guard codes.
- **Topology validator** (`validate-playbook-topology.cjs`): pre-dispatch gate. Schema check, then manifest resolution, then selected-map join. An invalid oracle blocks dispatch entirely.
- **Replay/dispatch layer** (`router-replay.cjs`, `executor-dispatch.cjs`): emits the canonical typed pair at the serialization boundary, caps the selected-map union, dual-reads legacy strings.
- **Scorer/report taxonomy** (`score-skill-benchmark.cjs`, `build-report.cjs`): separates `fixture_schema_error`, `fixture_topology_error`, `fixture_selection_error`, `routing_contract_error` and `routing_miss`. Snapshots topology digests and aborts on `topology_changed_during_run`.

### Data Flow
The hub router selects a `workflowMode` and packet entrypoint. The packet resolves its local leaf resources. The contract library normalizes those resources into the canonical typed pair `(workflowMode, leafResourceId)` at the boundary, after packet resolution and before serialization to any caller. `router-replay.cjs` and `executor-dispatch.cjs` emit that canonical pair. The topology validator checks each fixture's gold against the manifest before a scenario dispatches. The scorer applies exact equality between the model's observed resources and the typed gold, then classifies any mismatch into one of the five error classes before `build-report.cjs` writes the run's report.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|---------------|
| `leaf-resource-contract.cjs` | New: owns normalization and canonical bytes | Create | `node --check`, `node --test leaf-resource-contract.test.cjs` |
| `generate-leaf-manifest.cjs` | New: CLI wrapper over the contract library | Create | `generate-leaf-manifest.cjs --check .opencode/skills/sk-doc` |
| `mode-registry.json` | Existing: workflowMode/alias registry | Update: add `resourceContractVersion` | `parent-skill-check.cjs` strict mode |
| `parent-skill-check.cjs` | Existing: registry-router key equality, first-layer existence | Update: add manifest/byte-drift/collision/reachability guards | `PARENT_HUB_CHECK_STRICT=1` run |
| 19 sk-doc scenario fixtures | Existing: legacy gold strings | Update: typed gold (`expected_workflow_mode` + canonical leaf) | `validate-playbook-topology.cjs` per fixture |
| `router-replay.cjs` | Existing: reads `smart_routing.md`, stops at packet `SKILL.md` | Update: emit canonical typed pairs, dual-read legacy | `sk-doc-leaf-routing-contract.vitest.ts` |
| `executor-dispatch.cjs` | Existing: dispatches selected resources | Update: emit canonical pairs, cap selected-map union | `sk-doc-leaf-routing-contract.vitest.ts` |
| Nine packet routing maps | Existing: packet-local leaf sets, six wrong or missing | Update: correct per acceptance-matrix row | Fresh Mode-B live run |
| `score-skill-benchmark.cjs`, `build-report.cjs` | Existing: exact `Set.has` equality, no error taxonomy | Update: 5-class taxonomy, excluded-row reporting | Aggregate vitest regression |
| `create-skill` templates and schema doc | Existing: no `pathContract` field | Update: declare conversion boundary | Manual review, no scripted gate in Section 9 |
| `parent_skills_nested_packets.md:208-209` | Existing: stale "~34" sentence | Update: remove | `rg -n "34" ...` returns no match on the retired claim |

Required inventories:
- Same-class producers: `rg -n "resources|assets" .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/*.cjs` to confirm every emitter that currently serializes packet-qualified strings.
- Consumers of changed symbols: `rg -n "leafResourceId|resourceContractVersion|leaf-manifest|leaf-aliases" . --glob '*.ts' --glob '*.js' --glob '*.cjs' --glob '*.md'`.
- Matrix axes: the four axes from research.md Section 10, wrong-root / missing-leaf / over-bundle / clean, plus structural, invalid-oracle and reproducibility, 7 rows total.
- Algorithm invariant: `leafResourceId` never resolves outside its packet root (containment check). A hub-qualified or shared-prefixed string only converts to a typed pair through a declared mode or alias, never through generic prefix stripping.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Contract Library (fix-plan step 1)
- [ ] `leaf-resource-contract.cjs` added with normalization, composite-key, containment, canonical-bytes and digest functions
- [ ] `generate-leaf-manifest.cjs` `--write`/`--check` CLI added
- [ ] `leaf-resource-contract.test.cjs` covers the byte-stable generation contract

### Phase 2: Hub Topology Artifacts (fix-plan step 2)
- [ ] `resourceContractVersion` added to `mode-registry.json`
- [ ] `leaf-aliases.json` authored (e.g. the changelog template shared alias)
- [ ] `leaf-manifest.json` generated and committed. No parallel leaf map added to `hub-router.json`

### Phase 3: Hub Enforcement (fix-plan step 3)
- [ ] `parent-skill-check.cjs` extended with manifest-source, byte-drift, target/collision and reachability guard codes, in the ordered sequence from research.md Section 8 iteration 8
- [ ] `parent-skill-check-leaf-manifest.test.cjs` covers each new guard code

### Phase 4: Fixtures and Topology Validator (fix-plan step 4)
- [ ] All 19 sk-doc scenario frontmatters migrated to typed gold
- [ ] `validate-playbook-topology.cjs` added: schema check, then manifest resolution, then selected-map join
- [ ] An invalid oracle fixture blocks dispatch with zero denominators (verified with a synthetic fixture)

### Phase 5: Replay and Dispatch (fix-plan step 5)
- [ ] `router-replay.cjs` emits canonical typed pairs
- [ ] `executor-dispatch.cjs` emits canonical typed pairs, caps the selected-map union at `maxWorkflowModes: 2`
- [ ] Full-inventory intent stays reachable only by explicit request, never as a default bundle
- [ ] Dual-read of legacy packet-qualified and shared-prefixed strings preserved

### Phase 6: Nine Packet Maps (fix-plan step 6)
- [ ] create-quality-control, create-flowchart, create-feature-catalog, create-agent, create-command, create-manual-testing-playbook, create-readme, create-skill, create-changelog corrected against their expected composite pairs
- [ ] create-benchmark and create-diff confirmed untouched (no diff in this packet's change set)

### Phase 7: Scoring and Reporting (fix-plan step 7)
- [ ] `score-skill-benchmark.cjs` splits into `fixture_schema_error` / `fixture_topology_error` / `fixture_selection_error` / `routing_contract_error` / `routing_miss`
- [ ] Runner snapshots topology digests and aborts on `topology_changed_during_run`
- [ ] `build-report.cjs` reports excluded rows separately, fails closed on missing provenance

### Phase 8: Layer B Doctrine (fix-plan steps 8-9)
- [ ] `pathContract` declared in `skill_smart_router.md`, `parent_skill_hub_router_template.json` and `parent_hub_router_schema.md`
- [ ] `parent_skill_smart_routing_template.md` and sk-doc's own `shared/references/smart_routing.md` added
- [ ] Stale "~34 uncovered aliases" sentence removed from `parent_skills_nested_packets.md:208-209`

### Phase 9: Verification
- [ ] All 8 Section 9 verification commands pass in order
- [ ] Fresh Mode-B live run against all 19 fixtures completed, report/config/topology digests recorded
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | Every added or changed CJS file | `node --check` |
| Unit | Contract library normalization, composite keys, containment, canonical bytes | `node --test leaf-resource-contract.test.cjs` |
| Integration | Parent-check guard codes against a live sk-doc manifest | `node --test parent-skill-check-leaf-manifest.test.cjs` |
| Routing contract | Canonical-pair emission, topology validation | `npx vitest run sk-doc-leaf-routing-contract.vitest.ts` |
| Aggregate regression | Whole skill-benchmark vitest suite | `npx vitest run --no-coverage` |
| Live benchmark | All 19 sk-doc scenarios, Mode-B | Manual run against `run-skill-benchmark.cjs`, report captured |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Contract library (Phase 1) | Internal | Not started | Every later phase reads its functions. Nothing else can start |
| Sibling packet 011-skill-advisor-routing-research | Internal | In progress | 031 parent sequences this packet's start after it. Do not begin Phase 1 without authorization |
| `system-deep-loop` skill-benchmark scripts | Internal | Stable, owned by a different packet family | Read-only dependency for Phases 5 and 7. No blocking risk expected |
| `create-skill` authoring stack | Internal | Stable | Phase 8 edits three of its files. Low risk, doc-only change |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The fresh Mode-B live run (Phase 9) fails to repair recall. Or SD-008 and SD-012 regress from their current clean scores.
- **Procedure**: Revert the implementation commits for the affected phase in dependency order, starting from the latest phase back toward Phase 1. Because migration is dual-read/single-write, reverting a later phase does not strand fixture data: legacy packet-qualified strings stay readable throughout. Re-run the Phase 9 verification gate after each revert step to confirm the regression is isolated.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Contract Library) ──► Phase 2 (Hub Topology) ──► Phase 3 (Hub Enforcement)
                                                                    │
                                                                    ▼
Phase 8 (Layer B Doctrine) ◄── Phase 7 (Scoring/Reporting) ◄── Phase 6 (Packet Maps) ◄── Phase 5 (Replay/Dispatch) ◄── Phase 4 (Fixtures)
                                                                    │
                                                                    ▼
                                                              Phase 9 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1 Contract Library | None | 2, 3, 4, 5, 6, 7 |
| 2 Hub Topology | 1 | 3 |
| 3 Hub Enforcement | 1, 2 | 4 |
| 4 Fixtures + Topology Validator | 1, 3 | 5 |
| 5 Replay/Dispatch | 1, 4 | 6 |
| 6 Nine Packet Maps | 1, 5 | 7 |
| 7 Scoring/Reporting | 1, 6 | 9 |
| 8 Layer B Doctrine | 1 (logically, not blocking) | 9 |
| 9 Verification | 7, 8 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|-------------------|
| 1 Contract Library | High | 1-2 sessions |
| 2 Hub Topology | Low | 1 session |
| 3 Hub Enforcement | Medium | 1 session |
| 4 Fixtures + Topology Validator | Medium | 1-2 sessions |
| 5 Replay/Dispatch | High | 1-2 sessions |
| 6 Nine Packet Maps | Medium | 1-2 sessions |
| 7 Scoring/Reporting | Medium | 1 session |
| 8 Layer B Doctrine | Low | 1 session |
| 9 Verification | Low | 1 session, plus the live benchmark run |
| **Total** | | **9-13 sessions** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] All 19 fixtures pass the topology validator before the live benchmark run
- [ ] `leaf-manifest.json` digest recorded for the pre-fix and post-fix state
- [ ] Aggregate vitest regression is green with zero new failures

### Rollback Procedure
1. Identify the failing phase from the Phase 9 verification output.
2. Revert that phase's commits, then re-run its own test file (Section 5).
3. Re-run the aggregate regression suite to confirm no downstream phase depended on the reverted change.
4. Re-run the live Mode-B benchmark only after the aggregate suite is green again.

### Data Reversal
- **Has data migrations?** Yes, the 19 fixture frontmatters move from legacy gold strings to typed gold.
- **Reversal procedure**: Because the migration is dual-read, reverting Phase 4's commit restores the legacy frontmatter directly. No separate data-repair step is needed since the dual-read bridge never deleted the legacy fields, it only added typed ones alongside them.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phase 1   │────►│   Phase 2   │────►│   Phase 3   │────►│   Phase 4   │
│  Contract   │     │  Topology   │     │ Enforcement │     │  Fixtures   │
└──────┬──────┘     └─────────────┘     └─────────────┘     └──────┬──────┘
       │                                                            │
       │            ┌─────────────┐     ┌─────────────┐            ▼
       └───────────►│   Phase 8   │     │   Phase 7   │◄────┌─────────────┐
                     │  Layer B    │     │  Scoring    │     │   Phase 5   │
                     └──────┬──────┘     └──────┬──────┘◄────│   Replay    │
                            │                   ▲             └──────┬──────┘
                            │                   │                    │
                            │            ┌─────────────┐             │
                            │            │   Phase 6   │◄────────────┘
                            │            │ Packet Maps │
                            │            └──────┬──────┘
                            │                   │
                            ▼                   ▼
                     ┌───────────────────────────────┐
                     │           Phase 9             │
                     │         Verification          │
                     └────────────────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Contract library | None | Normalization + canonical bytes | Topology, Enforcement, Fixtures, Replay, Packet Maps, Scoring |
| Hub topology | Contract library | `leaf-manifest.json`, `leaf-aliases.json` | Enforcement |
| Hub enforcement | Contract library, Hub topology | Guard codes | Fixtures |
| Fixtures + validator | Contract library, Enforcement | Typed-gold fixtures | Replay |
| Replay/dispatch | Contract library, Fixtures | Canonical pairs at runtime | Packet Maps |
| Packet maps | Contract library, Replay | Corrected leaf sets per packet | Scoring |
| Scoring/reporting | Contract library, Packet Maps | 5-class taxonomy | Verification |
| Layer B doctrine | Contract library (conceptually) | Updated templates and schema | Verification |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 1: Contract Library** - 1-2 sessions - CRITICAL
2. **Phase 4: Fixtures + Topology Validator** - 1-2 sessions - CRITICAL
3. **Phase 5: Replay/Dispatch** - 1-2 sessions - CRITICAL
4. **Phase 6: Nine Packet Maps** - 1-2 sessions - CRITICAL
5. **Phase 7: Scoring/Reporting** - 1 session - CRITICAL
6. **Phase 9: Verification** - 1 session plus live benchmark - CRITICAL

**Total Critical Path**: 6-9 sessions

**Parallel Opportunities**:
- Phase 2 (Hub Topology) and Phase 3 (Hub Enforcement) can run alongside early Phase 4 fixture drafting once Phase 1 lands, since they read the same contract library but write to different files.
- Phase 8 (Layer B Doctrine) can run any time after Phase 1, in parallel with Phases 4-7, since it edits templates that do not gate runtime behavior.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|-------------------|--------|
| M1 | Contract foundation ready | Phases 1-3 complete, guard codes enforce the manifest | After Phase 3 |
| M2 | Runtime emits canonical pairs | Phases 4-6 complete, all 9 affected packets corrected | After Phase 6 |
| M3 | Repair proven | Phases 7-9 complete, fresh Mode-B run matches the Section 10 acceptance matrix | After Phase 9 |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:ai-protocol -->
## L3: AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Confirm the 031 parent authorized Phase 1 start (currently blocked on sibling packet 011)
- [ ] Read decision-record.md ADR-001 and ADR-005 before touching any emitter or fixture
- [ ] Confirm the prior phase's own Section 5 test command passed before starting the next phase

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Phases execute in the Section 4 dependency order. No phase starts before its blocking phase's tests pass |
| TASK-SCOPE | Each phase touches only the files listed in its Section 4 checklist and the Files to Change table in spec.md |
| TASK-VERIFY | Each phase's own Section 5 test command runs before the next phase starts |

### Status Reporting Format
Report phase status as `Phase N: <name> - <PASS/FAIL> - <command output summary>` after each phase's test run, matching the Section 9 verification command list in research.md.

### Blocked Task Protocol
A BLOCKED phase records the blocking phase or external dependency, the specific test that fails, and the resumption condition. T000 in tasks.md is the current BLOCKED task, gated on operator authorization per this plan's Definition of Ready.
<!-- /ANCHOR:ai-protocol -->

---

## L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` for the six settled design decisions (canonical typed-pair identity, composite uniqueness, N-to-1 fan-out, authored shared aliases, dual-read/single-write/fail-closed migration, frozen contract names) plus the eliminated alternatives from research.md Section 11.
