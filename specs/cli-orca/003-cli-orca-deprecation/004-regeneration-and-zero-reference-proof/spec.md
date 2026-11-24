---
title: "Feature Specification: Phase 4: regeneration-and-zero-reference-proof"
description: "Regenerate the advisor graph, the trigger index, the sk-doc README fixtures and the mcp-tooling routing manifest, then prove no live file names cli-orca."
trigger_phrases:
  - "cli orca removal regeneration"
  - "cli orca zero reference proof"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 4: regeneration-and-zero-reference-proof

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-24 |
| **Branch** | `worktrees/534-deprecate-cli-orca` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 4 |
| **Predecessor** | 003-docs-registries-and-skill-removal |
| **Successor** | None |
| **Handoff Criteria** | Every derived layer is rebuilt and the residue sweep finds only kept hits |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Deprecate and remove the cli-orca skill specification.

**Scope Boundary**: Derived artifacts: the advisor skill graph and dist, the trigger index and its fixtures, two sk-doc README fixtures, one divergence-ledger entry and the mcp-tooling activation manifest. Then the residue sweep and the baseline rerun.

**Dependencies**:
- Phases 2 and 3 finished every source edit

**Deliverables**:
- Fresh derived artifacts
- A residue sweep with every remaining hit on the keep list
- A baseline delta for every touched suite
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After the source edits, the advisor graph still counted 15 skills, the trigger index and README fixtures still listed the skill's paths, the advisor dist was stale, and the mcp-tooling hub fell back to legacy routing because its policy hash changed.

### Purpose
Regenerate every derived layer from its source and prove nothing live still names cli-orca.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
node .skilled/bin/compiled-route-status.cjs --hub mcp-tooling
before: servingAuthority legacy, causeCode stale-manifest; after: compiled, compiled-serving
skill_graph_compiler.py --export-json: 14 skills (was 15)
advisor vitest: baseline 13 failed | 2725 passed; after 0 failed | 2738 passed
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Recompile the advisor skill graph and rebuild the advisor dist
- Regenerate the trigger index and its fixtures
- Drop the cli-orca rows from two sk-doc README fixtures
- Remove the divergence-ledger entry the removal resolved
- Re-mint the mcp-tooling activation manifest and copy it to its authored path

### Out of Scope
- Two served compiled-routing files that differ from their authored copies at HEAD - neither is touched here and the drift predates this packet
- Three sk-code benchmark directories missing from the README manifest - they predate this packet

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | Regenerate | Advisor graph |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` and retrieval fixtures | Regenerate | Trigger index |
| sk-doc `durable-directory-manifest.json`, `baseline-readme-verdicts.json` | Modify | Drop cli-orca rows |
| advisor `local-native-approved-divergences.json` | Modify | Drop one resolved entry |
| mcp-tooling activation `manifest.json`, served and authored | Regenerate | Routing manifest |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No live file outside `specs/` names cli-orca except the kept hits in the phase 1 manifest |
| REQ-002 | No touched suite has a failure its baseline lacked |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | mcp-tooling serves compiled routing again |
| REQ-004 | An Orca prompt gets no advisor recommendation |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `compiled-route-status.cjs --hub mcp-tooling` reports compiled-serving
- **SC-002**: `generate-trigger-index.mjs --check` exits 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Compiled-routing manifest minting | mcp-tooling serves legacy routing | Run `compiled-route-manifest.cjs refresh` and copy the served manifest to its authored path |
| Risk | A fixture refresh absorbs unrelated drift | Medium | Drop only the cli-orca rows instead of running `--write`, so the three sk-code directories stay reported |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

N/A: this phase removes code and documentation and runs no service, so it sets no performance, security or uptime target.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a hub whose inputs did not change keeps its manifest, as cli-external-orchestration did.
- Maximum input: the trigger index rebuilds over the whole corpus, specs included.
- Failure path: a stale advisor dist fails the CLI tests until it is rebuilt.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | 5 file groups |
| Risk | 8/25 | Removal only; git restores every path |
| Research | 6/20 | Inventory and tool lookup |
| **Total** | **23/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The operator chose full removal on 2026-11-24.
<!-- /ANCHOR:questions -->

---
