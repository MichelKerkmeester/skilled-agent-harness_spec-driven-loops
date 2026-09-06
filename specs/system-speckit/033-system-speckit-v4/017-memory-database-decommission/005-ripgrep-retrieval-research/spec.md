---
title: "Feature Specification: Phase 5: ripgrep-retrieval-research"
description: "Five-iteration deep research that designs the trigger index and the ripgrep retrieval conventions before phases 001 and 004 are built, and returns ranked amendments to both."
trigger_phrases:
  - "ripgrep retrieval research"
  - "trigger index research"
  - "grep convention research"
  - "retrieval parity evidence"
  - "memory decommission research"
importance_tier: "important"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: ripgrep-retrieval-research

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-02 |
| **Branch** | `branches/017-memory-decommission` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 6 |
| **Predecessor** | 004-grep-convention-doc-retrofit |
| **Successor** | 006-legacy-memory-surface-inventory |
| **Handoff Criteria** | The synthesis exists with a named stop reason, and its ranked amendments are cited by the phase 001 and phase 004 docs they changed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the memory db decommission specification. It is a research phase, not a build.

**Scope Boundary**: Reading and reasoning only. No consumer, server, generator or spec-doc outside this
folder was changed by the run.

**Dependencies**:
- The parent `spec.md` and the phase 001 to 004 specs, which the research read as its subject
- The live trigger lane in `.opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts`, which is the parity baseline
- Official ripgrep guide and flag source, used for flag semantics

**Deliverables**:
- Five iteration records and one synthesis under `research/lineages/luna-max/`
- A ranked amendment brief for phases 001 and 004, each item citing a file and a line

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phases 001 and 004 were specified before anyone had studied what the replacement actually has to match.
Phase 001 promised a trigger index without knowing the normalization, token gating and substring behavior
of the SQL lane it replaces, and phase 004 promised a grep-optimized corpus convention without a frozen
frontmatter contract or runnable ripgrep recipes. Building either from assumption risks a replacement that
looks correct and silently returns a different result set.

### Purpose
Produce evidence, before any build, that tells phases 001 and 004 exactly what to specify, and rank the
amendments so the two build phases can absorb them without rereading the whole study.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The generated trigger index over `trigger_phrases` frontmatter: JSON shape, normalization, matching, idempotence, malformed-input reporting and cold-start latency against the 200ms budget
- Ripgrep invocation conventions that replace `memory_search`, `memory_context` and `memory_quick_search`, including flags, exclusions, exit mapping and caller-side ranking
- The corpus shape that makes grep precise: frontmatter key stability, anchor grammar, naming and what belongs in `trigger_phrases`
- The capability boundary: what the retired MCP surface offered that grep cannot and what replaces each
- A parity harness design and a frozen prompt set
- Failure modes, edge cases and measurable acceptance criteria

### Out of Scope
- Any build - the generator, the parity harness and the prompt set are designed here and written in phase 001
- Any corpus mutation - phase 004 owns the retrofit and this run did not run an inventory
- Any edit to phases 001 to 004 - other agents fold the amendments in, so this phase stays a source

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| research/lineages/luna-max/iterations/iteration-001.md to iteration-005.md | Create | One record per forced iteration |
| research/lineages/luna-max/research.md | Create | The synthesis and the ranked amendment brief |
| research/deep-research-config.json | Create | The run configuration, executor and stop policy |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Run five iterations on one executor with convergence as telemetry only | Five iteration files on disk and a stop reason of `maxIterationsReached` in the synthesis |
| REQ-002 | Give the trigger index a versioned shape, a lookup contract and a cold-start measurement protocol | Synthesis section 6 states JSON shape, matching rules, idempotence, malformed-input handling and the latency protocol |
| REQ-003 | Give runnable ripgrep recipes for structured, path-only and count retrieval with exit mapping | Synthesis section 7 states the three recipes, the flag set, the exclusions and the ranking rule |
| REQ-004 | Rank amendments to phases 001 and 004, each citing a file and a line | Synthesis sections 11 and 12 list amendments per document with `[SOURCE: path:lines]` citations |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Name what grep cannot replace and the parity harness that proves what it can | Synthesis sections 9 and 10 state the capability boundary, the three-arm harness and the frozen cases |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Five iteration files exist on disk and the synthesis names its stop reason
- **SC-002**: The synthesis gives a versioned index shape, a lookup contract and a cold-start measurement protocol
- **SC-003**: The synthesis gives runnable ripgrep recipes for structured, path-only and count retrieval with exit mapping
- **SC-004**: The synthesis lists ranked amendments to phase 001 and phase 004 with file and line citations
- **SC-005**: Phase 001 and 004 spec, plan, tasks and acceptance docs cite this research where they changed
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The live `exactTriggerSearch` lane | Without it there is no parity baseline to design against | Cited by file and line throughout the synthesis, so the baseline survives the server's removal |
| Risk | Research read as a build mandate | Medium: an agent could treat a recommendation as shipped work | The synthesis carries a scope receipt stating that no generator, validator or corpus file was written |
| Risk | Amendments land in only one of the two build phases | Medium: phase 004 could drift from the retrieval path phase 001 builds | SC-005 requires citations in both phases before this one is called closed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does the measured index exceed the one-file budget and require sharding? Phase 001 owns the measurement.
- Should Unicode handling stay exactly compatible with the current ASCII-only normalization, or get a versioned extension?
- What target machine, runtime and sample count make the 200ms p95 gate reproducible?
- Which named phase 002 writer replaces continuity metadata refresh, and are causal links kept as Markdown links or declared a loss?
<!-- /ANCHOR:questions -->

---



<!-- SCAFFOLD_VALIDATION_COUNTS:
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
