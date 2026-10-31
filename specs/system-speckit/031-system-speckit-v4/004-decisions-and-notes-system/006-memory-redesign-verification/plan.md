---
title: "Implementation Plan: Phase 6: verify-rollout"
description: "Close out the constitutional-memory deprecation with the full mcp-server gate, a default-search negative control, a load-bearing reference sweep, a spec golden-snapshot check, and steering parity verification."
trigger_phrases:
  - "verify rollout memory redesign"
  - "constitutional negative control"
  - "mcp-server full test suite"
  - "constitutional blast-radius sweep"
  - "steering parity root docs"
importance_tier: "important"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: verify-rollout

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node.js 20.11 or newer |
| **Framework** | Vitest with Node and shell validation runners |
| **Storage** | SQLite-backed memory and vector-index fixtures used by the mcp-server tests |
| **Testing** | `npm test`, Vitest, spec validation scripts, targeted reference and parity checks |

### Overview
This phase verifies the executed constitutional-memory deprecation without changing production behavior. Run the package-level test orchestrator, exercise the default `memory_search` path with an ADR-shaped query, sweep the load-bearing references and indexing paths, compare the spec golden snapshots, and confirm that the standing steering rules remain in both root instruction files.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The phase spec defines REQ-001 through REQ-005 and the close-out scope.
- [x] The prior deprecation, rehome, and advisor phases provide the verification inputs.
- [x] The mcp-server package exposes the complete `npm test` gate.

### Definition of Done
- [ ] The full mcp-server gate exits successfully under the new defaults.
- [ ] The negative control returns no constitutional files from default search.
- [ ] The load-bearing reference and indexing sweep is clean, and retained constitutional files remain plain unindexed documentation.
- [ ] The spec golden snapshots remain unchanged and no required per-packet spec document was added.
- [ ] `AGENTS.md` and `CLAUDE.md` retain every standing steering rule from the `render.ts` capsules and load those rules every turn.
- [ ] Close-out evidence covers every requirement before implementation-summary.md is updated with completion.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Evidence-driven verification of an executed cross-cutting deprecation

### Key Components
- **mcp-server test orchestrator**: Runs the core Vitest suite, file-watcher tests, and spec-validation checks through `npm test`.
- **Default memory search path**: Exercises the ADR-shaped negative control with constitutional inclusion disabled by default.
- **Search and indexing surfaces**: Covers candidate generation, fusion, the memory-search handler, learned feedback, hooks, and index handlers that could reintroduce the retired behavior.
- **Reference manifest**: Defines the explicit review scope and includes every existing deprecation touchpoint required for the sweep.
- **Root steering documents**: `AGENTS.md` and `CLAUDE.md` carry the standing rules that remain active after the deprecation.

### Data Flow
1. Start from the mcp-server package root with the existing dependency set.
2. Establish the test and spec-snapshot baselines without modifying source files.
3. Run `npm test` and retain the output for REQ-001 and the validation portion of REQ-004.
4. Run the ADR-shaped default `memory_search` negative control and assert that no returned path belongs to the constitutional documentation.
5. Sweep the manifest and the load-bearing docs, commands, hooks, tests, search pipeline, and indexing paths. Classify historical references separately from active references.
6. Compare the retained steering capsules with `AGENTS.md` and `CLAUDE.md`, then confirm the spec snapshots and no-stray-file condition.
7. Update implementation-summary.md only after every requirement passes. Add a changelog entry only when the existing packet changelog directory is present.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/search/pipeline/stage1-candidate-gen.ts` | Generates the initial candidate set | Inspect for constitutional candidate admission or filtering regressions | Negative control and full mcp-server suite |
| `lib/search/pipeline/stage2-fusion.ts` | Fuses candidate sources before final ranking | Inspect for reintroduction of excluded constitutional candidates | Search-result assertions and full mcp-server suite |
| `handlers/memory-search.ts` | Owns `memory_search` defaults and result retrieval | Confirm the new default excludes constitutional files | ADR-shaped default query returns zero constitutional paths |
| `lib/search/learned-feedback.ts` | Owns learned-trigger feedback behavior | Confirm the retired learned-trigger path stays disabled | Targeted source check and full mcp-server suite |
| `hooks/memory-surface.ts`, `handlers/memory-index.ts`, and related index surfaces | Control memory surfacing and indexing | Confirm no active path scans or indexes the retained constitutional docs | Load-bearing reference sweep and index-path inspection |
| `constitutional/` documentation | Retained plain reference material | Leave files unchanged and confirm they have no indexing or injection registration | File inventory plus search and indexing sweep |
| `AGENTS.md` and `CLAUDE.md` | Every-turn root steering surfaces | Compare their standing rules with the `render.ts` capsules | Parity comparison and direct content check |
| mcp-server tests and spec validation fixtures | Regression and scaffold contract coverage | Run the existing gates without adding a new required packet document | `npm test` and golden-snapshot result |

Required inventories:
- Same-class producers: `rg -n 'constitutional|includeConstitutional|learned-trigger|learned_feedback' .opencode/skills/system-spec-kit/mcp-server --glob '*.ts'`.
- Consumers of changed symbols: `rg -n 'includeConstitutional|constitutional/|learned-trigger|learned_feedback' .opencode/skills/system-spec-kit --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: default versus explicit search options, ADR-shaped versus non-ADR-shaped queries, candidate generation versus fusion, and documentation presence versus indexing registration.
- Algorithm invariant: the default ADR-shaped search result contains zero constitutional paths, the retained documentation never enters the index, and the root steering capsules remain available on every turn. Test a populated index, an empty index, an explicit opt-in request, and a query with no matching non-constitutional records.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Record the mcp-server package root, existing dependency state, and the baseline commands for the test and snapshot checks.
- [ ] Confirm that the goal-file manifest contains only existing repository paths and includes the executed search-pipeline, handler, and learned-feedback touchpoints.
- [ ] Identify the retained `render.ts` steering capsules and the matching rule sections in `AGENTS.md` and `CLAUDE.md`.

### Phase 2: Core Verification
- [ ] Run `npm test` from `.opencode/skills/system-spec-kit/mcp-server/` and retain a zero exit status for REQ-001.
- [ ] Run the ADR-shaped default `memory_search` negative control and assert zero constitutional results for REQ-002.
- [ ] Sweep load-bearing docs, commands, hooks, tests, search pipeline files, handlers, and index paths. Confirm that retained constitutional files remain plain unindexed documentation for REQ-003.
- [ ] Run the existing spec validation and golden-snapshot checks. Confirm no snapshot diff and no new required per-packet spec document for REQ-004.
- [ ] Compare the standing rules in `AGENTS.md` and `CLAUDE.md` with the `render.ts` capsules and confirm every-turn loading for REQ-005.

### Phase 3: Close-out
- [ ] Consolidate command output, search results, snapshot results, parity results, and the no-stray-file result into the verification evidence set.
- [ ] Confirm that each REQ-001 through REQ-005 has a pass result before updating implementation-summary.md with completion.
- [ ] Add or update the packet changelog entry only if the existing `changelog/` directory is present. Do not create a new changelog directory.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Full suite | Core mcp-server tests, file-watcher tests, and spec-validation tests | `npm test` from `.opencode/skills/system-spec-kit/mcp-server/` |
| Negative control | ADR-shaped default `memory_search`; assert no result path under the constitutional documentation | Existing mcp-server handler and test harness |
| Reference sweep | Load-bearing docs, commands, hooks, tests, search pipeline, handlers, indexing paths, and manifest entries | Targeted `rg`, direct file checks, and manual classification |
| Golden snapshot | Spec scaffold and required-document shape; assert no diff | Existing spec validation and snapshot fixtures |
| Steering parity | Standing rules in the `render.ts` capsules versus both root instruction files | Targeted `rg` and direct document comparison |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Prior deprecation, rehome, and advisor phases | Internal | Required | The close-out cannot verify the final state until their changes are present |
| Existing mcp-server dependencies and test fixtures | Internal | Required | The full suite and negative control cannot run |
| `AGENTS.md`, `CLAUDE.md`, and `render.ts` steering capsules | Internal | Required | Steering parity remains unverified |
| Existing spec validation and snapshot fixtures | Internal | Required | REQ-004 remains unverified |
| Packet-level `changelog/` directory | Optional | Absent at plan authoring time | Skip the changelog task and do not create the directory |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any full-suite failure, constitutional result in the negative control, active reference to retired surfacing or indexing behavior, snapshot drift, or steering-parity gap.
- **Procedure**: Stop the rollout, retain the failing evidence, and return the owning defect to the relevant prior phase. This phase plans verification only, so it has no production change to revert. Do not update implementation-summary.md with completion until the failed check passes. If a changelog entry was added and the verification is rejected, remove that entry through the normal documented review process.
<!-- /ANCHOR:rollback -->

---
