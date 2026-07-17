---
title: "Feature Specification: sk-doc Router Path-Contract Fixes"
description: "Fix the three-part path-contract defect behind sk-doc's 20/100 Tier-2 benchmark score (wrong path-root normalization, missing leaf resources, over-bundled resource sets) through a dependency-ordered nine-step plan: contract library, hub topology artifacts, parent-check enforcement, fixture typed-gold migration, replay/dispatch canonicalization, nine packet map corrections, scorer taxonomy and create-skill authoring doctrine."
trigger_phrases:
  - "sk-doc routing fixes implementation"
  - "leaf resource contract library"
  - "typed pair workflowMode leafResourceId"
  - "sk-doc path-root normalization fix"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/031-sk-doc-router-alignment/012-sk-doc-routing-fixes"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Recorded shared discovery-fixture ownership: this packet owns, 013 consumes read-only"
    next_safe_action: "Kick off Phase 1 (contract library, includes discovery-fixture format/location)"
    blockers:
      - "Implementation start awaits explicit operator authorization. The 031 parent sequences this after the concurrent skill-advisor routing research (011-skill-advisor-routing-research)"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "012-sk-doc-routing-fixes-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The ~34-alias theory is falsified (113/113 literal alias-to-vocabularyClass equality, zero gaps). The real defect is a three-part path-contract problem"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Feature Specification: sk-doc Router Path-Contract Fixes

---

## EXECUTIVE SUMMARY

sk-doc scored 20/100 with roughly 19 percent exact-resource recall on the Tier-2 gpt-5.6-luna skill benchmark. The 010 research packet traced the cause to a three-part path-contract defect, not the previously assumed alias coverage gap. This packet turns the research's dependency-ordered nine-step fix plan into an implementation-ready scaffold.

**Key Decisions**: Canonical public identity is the typed pair `(workflowMode, leafResourceId)`, packet-root-relative. Migration runs dual-read, single-write, fail-closed.

**Critical Dependencies**: The contract library (step 1) blocks every downstream step. The fresh 19-scenario Mode-B live run is the only proof that the fix repairs the benchmark.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-16 |
| **Track** | sk-doc |
| **Parent** | `sk-doc/031-sk-doc-router-alignment` |
| **Parent Spec** | ../spec.md |
| **Research Source** | `../010-sk-doc-routing-research/research/research.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

sk-doc's Tier-2 gpt-5.6-luna benchmark run scored 20/100 with roughly 19 percent exact-resource recall (`tier2-sk-doc-luna-opencode.report.json`). The headline theory blamed a roughly 34-alias coverage gap in the hub router, but the research found 113 of 113 alias-to-vocabularyClass pairs equal with zero gaps. The real defect is a three-part path-contract problem across all 19 benchmark scenarios: 6 rows fail on wrong path-root normalization, 6 rows fail on a missing expected leaf resource and 5 rows lose material recall to an over-bundled resource set. Two rows (SD-008, SD-012) already pass clean and must stay clean through the fix.

### Purpose

Close all three failure classes by giving sk-doc a canonical, enforced leaf-resource contract, so a fresh Mode-B live run measures real routing recall instead of a path-format artifact.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Layer A, the runtime-critical minimum: a pure contract library and manifest generator, hub topology artifacts (`resourceContractVersion`, `leaf-aliases.json`, `leaf-manifest.json`), extended `parent-skill-check.cjs` enforcement, typed-gold migration of all 19 sk-doc scenario fixtures plus a pre-dispatch topology validator, canonical typed-pair emission in `router-replay.cjs` and `executor-dispatch.cjs`, correction of the nine affected packet maps and a scorer/report error taxonomy.
- **Shared discovery-fixture boundary (with sibling packet `013-skill-advisor-routing-fixes`).** This packet OWNS the single canonical discovery-fixture set for the metadata-hub advisor-discovery boundary. Format is typed gold, the same typed-pair format this packet already uses for its 19 sk-doc scenario fixtures, and location is under the sk-doc tree. Layer A defines the format and location early. Packet 013's P1-5 metadata-hub advisor-discovery battery and `parent-skill-check.cjs` build on top of and consume these fixtures read-only, they do not author a competing set.
- Layer B, authoring doctrine: the `pathContract` declaration in create-skill's hub-router templates and schema doc, plus the second-layer router scaffold and sk-doc's own `shared/references/smart_routing.md`. It also fixes the stale "~34 alias" canon text.
- The six verification test files these steps introduce or extend and the eight verification commands in Section 9 of the research.

### Out of Scope

- `create-benchmark` and `create-diff` packet maps - neither packet has a failing benchmark row, so neither is touched.
- Creating `command-metadata.json` - the research ruled this out as an unnecessary duplicate projection of `mode-registry.json`.
- Global `leafResourceId` uniqueness or packet-qualified public IDs - both were eliminated as design options because they collide with the ten packets that legally share a local `references/README.md` name and collapse the N-to-1 `create-skill`/`create-skill-parent` fan-out.
- Retroactive relabeling of historical benchmark rows - SD-020 and SD-016 gold repairs happen only after provenance-carrying runs exist, per the research's explicit instruction not to retroactively relabel.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs` | Create | Pure normalization, composite-key, containment, canonical-bytes, digest and validation functions |
| `.opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs` | Create | `--write`/`--check` CLI wrapping the contract library |
| `.opencode/skills/sk-doc/create-skill/scripts/tests/leaf-resource-contract.test.cjs` | Create | `node --test` unit coverage for the contract library |
| `.opencode/skills/sk-doc/mode-registry.json` | Modify | Add `resourceContractVersion` field |
| `.opencode/skills/sk-doc/leaf-aliases.json` | Create | Authored shared-alias table (e.g. changelog template alias) |
| `.opencode/skills/sk-doc/leaf-manifest.json` | Create | Generated, committed manifest of canonical leaf resources |
| `.opencode/commands/doctor/scripts/parent-skill-check.cjs` | Modify | Add manifest-source, byte-drift, target/collision and reachability guard codes |
| `.opencode/commands/doctor/scripts/tests/parent-skill-check-leaf-manifest.test.cjs` | Create | `node --test` coverage for the new guard codes |
| `.opencode/skills/sk-doc/manual_testing_playbook/**` (19 scenario files) | Modify | Migrate frontmatter to typed gold (`expected_workflow_mode` + canonical leaf) |
| `.opencode/skills/sk-doc/create-skill/scripts/validate-playbook-topology.cjs` | Create | Pre-dispatch schema-then-manifest-then-selected-map validator |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs` | Modify | Emit canonical typed pairs, dual-read legacy strings |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs` | Modify | Emit canonical typed pairs, cap selected-map union |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/sk-doc-leaf-routing-contract.vitest.ts` | Create | Vitest coverage for canonical-pair emission and topology validation |
| Nine packet routing maps: create-quality-control, create-flowchart, create-feature-catalog, create-agent, create-command, create-manual-testing-playbook, create-readme, create-skill, create-changelog | Modify | Correct the packet-local leaf resources tied to each packet's failing benchmark row |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs` | Modify | Split scoring into `fixture_schema_error` / `fixture_topology_error` / `fixture_selection_error` / `routing_contract_error` / `routing_miss` |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs` | Modify | Report excluded rows separately, fail closed on missing provenance |
| `.opencode/skills/sk-doc/create-skill/assets/skill/skill_smart_router.md` | Modify | Declare the `pathContract` (hubLoadAddress vs leafResourceId, conversion boundary) |
| `.opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_hub_router_template.json` | Modify | Same `pathContract` declaration in the generated template |
| `.opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md` | Modify | Document the `pathContract` schema field |
| `.opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_smart_routing_template.md` | Create | Second-layer router scaffold for future authored hubs |
| `.opencode/skills/sk-doc/shared/references/smart_routing.md` | Create | sk-doc's own per-intent leaf sets and explicit full-inventory intent |
| `.opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md` (lines 208-209) | Modify | Remove the stale "~34 uncovered aliases" sentence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete, Layer A, runtime-critical)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Add the pure leaf-resource contract library plus its `--write`/`--check` manifest generator | `node --check` passes on both files. `generate-leaf-manifest.cjs --check .opencode/skills/sk-doc` passes |
| REQ-002 | Add hub topology artifacts: `resourceContractVersion` in `mode-registry.json`, authored `leaf-aliases.json`, generated `leaf-manifest.json` | Manifest generation is byte-stable across repeated runs. No parallel leaf map exists in `hub-router.json` |
| REQ-003 | Extend `parent-skill-check.cjs` with manifest-source, byte-drift, target/collision and bidirectional selected-map reachability guards | `PARENT_HUB_CHECK_STRICT=1 node parent-skill-check.cjs .opencode/skills/sk-doc` passes |
| REQ-004 | Migrate all 19 sk-doc scenario frontmatters to typed gold and add the pre-dispatch topology validator | `node --test parent-skill-check-leaf-manifest.test.cjs` passes. Invalid oracle fixtures block dispatch with zero denominators |
| REQ-005 | Emit canonical typed pairs from `router-replay.cjs` and `executor-dispatch.cjs`, cap selected-map union, dual-read legacy strings | `npx vitest run sk-doc-leaf-routing-contract.vitest.ts` passes |
| REQ-006 | Correct the nine affected packet maps (create-quality-control, create-flowchart, create-feature-catalog, create-agent, create-command, create-manual-testing-playbook, create-readme, create-skill, create-changelog) | Each packet's failing row resolves to its expected composite pair per the Section 10 acceptance matrix |
| REQ-007 | Split scorer/report taxonomy into fixture/topology/selection/contract/miss error classes and snapshot topology digests | Aggregate regression suite (`vitest run --no-coverage`) passes with zero new failures |

### P1 - Required (Layer B, authoring doctrine, complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Declare the `pathContract` in create-skill's hub-router template, schema doc and smart-router asset. Add the second-layer router scaffold plus sk-doc's own `shared/references/smart_routing.md` | New parent hubs generated from the templates carry the `pathContract` field. sk-doc's `smart_routing.md` lists exact per-intent leaf sets and one explicit full-inventory intent |
| REQ-009 | Remove the stale "~34 uncovered aliases" sentence from `parent_skills_nested_packets.md:208-209` | `rg -n "34" parent_skills_nested_packets.md` no longer matches the retired claim |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All eight Section 9 verification commands pass, including the aggregate regression suite with zero new failures.
- **SC-002**: A fresh Mode-B live run against all 19 sk-doc fixtures shows the wrong-root, missing-leaf and over-bundle groups resolving per the Section 10 acceptance matrix, while SD-008 and SD-012 keep their clean scores and zero waste.
- **SC-003**: Fresh structural score (D5 connectivity) reads 100 on the new run. The report never reuses the old 20/100 value.
- **SC-004**: Manifest generation is reproducible: permuting registry or enumeration order produces identical manifest bytes and digest.
- **SC-005**: `create-benchmark` and `create-diff` show zero diff in this packet's change set, confirming the untouched-packet boundary held.
- **SC-006**: This packet's canonical typed-gold discovery-fixture set, owned under the sk-doc tree, is the single fixture set sibling packet 013's P1-5 battery and `parent-skill-check.cjs` consume. No divergent or duplicate discovery fixture set exists anywhere else.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Contract library (REQ-001) | Every downstream step reads its normalization and canonical-bytes functions. A bug here corrupts the whole chain | Land REQ-001 first, gate it behind its own unit test (command 4), before any consumer starts |
| Dependency | Sibling packet 011-skill-advisor-routing-research | Operator sequenced this packet's implementation start after that concurrent research finishes | Track via the 031 parent's `graph-metadata.json`. Do not start Phase 1 until authorized |
| Risk | Historical 20/100 report has no config fingerprint | It supports the failure profile but cannot attribute today's configs to it | Treat it as directional only. The fresh Mode-B run is the sole proof of repair (SC-002) |
| Risk | Report evidence truncates responses at 300 characters | SD-015's full 65-path bundle and SD-016's contradiction are not reconstructable after the fact | Accept the gap. Do not retroactively relabel SD-016's gold until a provenance-carrying run exists |
| Risk | Fixture migration to typed gold could silently corrupt one of 19 scenarios | A bad migration produces a false pass or false fail in the acceptance matrix | Run the topology validator (REQ-004) against every migrated fixture, before the fresh benchmark run |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Manifest generation carries no timestamps, no locale-dependent ordering and no absolute paths, so repeated runs produce byte-identical output.

### Security
- **NFR-S01**: The contract library's containment check rejects any `leafResourceId` that resolves outside its packet root before it reaches the manifest or the scorer.

### Reliability
- **NFR-R01**: Invalid oracle fixtures and topology-digest mismatches during a run fail closed: zero dispatch, excluded from every scoring denominator, never silently scored as zero recall.

---

## 8. EDGE CASES

### Data Boundaries
- Ten packets legally share the local name `references/README.md`: uniqueness is enforced on the composite pair `(workflowMode, leafResourceId)`, not on the leaf name alone.
- `create-skill` and `create-skill-parent` both resolve to packet `create-skill` but keep distinct public key sets (N-to-1 fan-out).
- The 17-leaf full-inventory scenario is a legitimate wide bundle: the cap is the selected-map union, not an arbitrary numeric limit.

### Error Scenarios
- Topology changes mid-run (`topology_changed_during_run`): the run aborts rather than scoring against a stale manifest digest.
- A fixture references a leaf that no longer exists in the manifest: the topology validator blocks dispatch for that scenario and the scorer excludes it from every denominator.

### State Transitions
- Legacy packet-qualified or shared-prefixed strings remain readable only under the dual-read bridge. Every new emitter writes typed pairs from day one (single-write).

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Files: ~23 across contract library, topology artifacts, guard, fixtures, replay/dispatch, nine packet maps, scorer, templates. Systems: hub router, benchmark scorer, create-skill authoring stack |
| Risk | 15/25 | No auth or public API surface, but a bug in the shared contract library or in fail-closed dispatch gating breaks every downstream benchmark scenario at once |
| Research | 8/20 | Root cause, design decisions and fix plan are already settled by the 10-iteration research packet. Remaining work is implementation, not investigation |
| Multi-Agent | 5/15 | Single implementer per dependency-ordered step. Steps do not parallelize because each reads the prior step's output |
| Coordination | 10/15 | Nine sequential fix-plan steps plus a sibling research packet (011) that gates the implementation start |
| **Total** | **58/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Contract library normalization bug corrupts canonical bytes for every downstream consumer | H | L | Land REQ-001 alone first, behind its own unit test, before any other step starts |
| R-002 | Typed-gold fixture migration mis-maps one of the 19 scenarios | M | M | Run the topology validator against every migrated fixture before the fresh benchmark run |
| R-003 | Nine-packet map corrections introduce a new over-bundle or missing-leaf case while fixing the original one | M | M | Score each corrected packet against its own acceptance-matrix row, not just the aggregate pass/fail |
| R-004 | Dual-read migration bridge masks a legacy reader nobody accounted for | M | L | Grep every consumer of the legacy string shape before removing dual-read support in a later packet |

---

## 11. USER STORIES

### US-001: Canonical typed-pair resources (Priority: P0)

**As a** benchmark maintainer, **I want** the sk-doc router to emit canonical typed-pair resource IDs, **so that** Mode-B live scoring measures real routing recall instead of a path-format artifact.

**Acceptance Criteria**:
1. Given a live scoring run against SD-007, SD-009, SD-003, SD-016, SD-011 or SD-020, When the router serializes its resource answer, Then the observation resolves to the expected composite pair with recall 1.

### US-002: Path contract in authoring templates (Priority: P1)

**As a** skill-hub author, **I want** create-skill's templates to declare the path contract, **so that** new parent hubs don't reintroduce the same coordinate-frame ambiguity that caused this defect.

**Acceptance Criteria**:
1. Given a new parent hub generated from `parent_skill_hub_router_template.json`, When the author reads `parent_hub_router_schema.md`, Then the `pathContract` field explains the hubLoadAddress-versus-leafResourceId conversion boundary without further clarification.

---

## 12. OPEN QUESTIONS

- Legacy-read telemetry cutoff for removing the dual-read bridge is an operator-policy decision deferred past this packet.
- Whether `generate-leaf-manifest.cjs --check` runs path-filtered as a pre-commit hook or unconditionally in CI only. The research recommends unconditional CI-only. This packet does not decide it.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Research Source**: `../010-sk-doc-routing-research/research/research.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
