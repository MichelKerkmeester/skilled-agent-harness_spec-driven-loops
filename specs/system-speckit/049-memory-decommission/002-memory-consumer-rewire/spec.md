---
title: "Feature Specification: Phase 2: memory-consumer-rewire"
description: "Repoint AGENTS.md Gate 1 and every external consumer of the memory MCP surface at the trigger index and ripgrep conventions, while the old surface is still available to fall back to."
trigger_phrases:
  - "consumer rewire"
  - "gate 1 rewire"
  - "memory tool call sites"
  - "mcp consumer migration"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 2: memory-consumer-rewire

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

Two counts describe this phase and they measure different things. The roughly 167 figure is a
logical-owner estimate of the consumers that need a decision. The row-level inventory counts
9,016 live paths carrying at least one row this phase owns, and that set mixes docs, specs,
generated evidence and several rows per consumer. Neither number replaces the other, so closure
requires reconciling the 167 owners against the 9,016 rows owner by owner rather than picking
whichever figure is convenient. `AGENTS.md` Gate 1 remains the single most load-bearing consumer.
This phase repoints every live consumer at the phase-001 replacement while the old surface still
exists, so any gap surfaces as a behavioral difference rather than a hard failure.

**Key Decisions**: Rewire before deleting, so a mistake is a wrong answer rather than a missing tool. Treat the 260 in-subsystem references as deletions, not rewrites. Reconcile the two consumer counts owner by owner before closure instead of reporting one of them.

**Critical Dependencies**: Phase 001 must have shipped a proven index and a written ripgrep contract.

**Source inventory**: specs/system-speckit/049-memory-decommission/006-legacy-memory-surface-inventory/research/lineages/luna-max/research.md, with the exhaustive row artifact at specs/system-speckit/049-memory-decommission/006-legacy-memory-surface-inventory/research/lineages/luna-max/inventory.external.json (69 MB, cite by path, do not open it whole).

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-09-02 |
| **Branch** | `claude/speckit-memory-db-review-3gheky` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 4 |
| **Predecessor** | 001-trigger-index-replacement |
| **Successor** | 003-spec-memory-server-removal |
| **Handoff Criteria** | Zero references to `mcp__system_spec_memory__*` or the 41 tool names outside the subsystem tree |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the memory db decommission specification.

**Scope Boundary**: Change consumers only. Nothing is deleted in this phase and the MCP server keeps
running, which is the point: if a rewired consumer is wrong, it produces a different answer that can
be compared against the still-live original, instead of an error that only proves something is gone.

**Dependencies**:
- Phase 001 delivered `trigger-index.json` and `retrieval-conventions.md`

**Deliverables**:
- `AGENTS.md` Gate 1 rewritten against the index
- Every live external consumer repointed: ~167 logical owners, reconciled against the 9,016 live
  paths the row inventory attributes to this phase
- A named replacement writer for `_memory.continuity` frontmatter
- A written split of the shared embedding, HF-local, IPC and launcher branches so
  `system-skill-advisor` keeps a working owner
- A residue sweep proving no external caller remains

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

427 files reference the memory MCP surface. 260 of them live inside `system-spec-kit` itself
(feature catalog, manual-testing playbook, references) and disappear with the subsystem. The
remaining ~167 are real external consumers: `AGENTS.md`, the `deep` and `speckit` command families,
several skills, and the agent mirrors in `.opencode/`, `.claude/`, `.codex/` and `.pi/`. Each one
names tools that will not exist after phase 003.

That 167 is a logical-owner estimate. The row-level inventory, run case-insensitively with the
global ignore disabled, records 9,016 live paths with at least one row owned by this phase and
4,893 with at least one row owned by phase 003. Those sets are wider than the owner list because
they include documentation, spec packets, generated evidence and several rows per consumer, and
they are non-disjoint because a single file can hold both a memory-only row and a shared-advisor
row. Raw path counts cannot answer which owners are done, so the two figures have to be reconciled
owner by owner before this packet closes.

### Purpose

Every external consumer resolves retrieval through the phase-001 mechanisms, verified by a sweep
that returns empty, so that phase 003 deletes something nothing calls.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `AGENTS.md` Gate 1: replace the `memory_match_triggers` gate action with the index lookup.
- The ~167 external consumer files, by area: `system-deep-loop` (25), `commands/deep` (21),
  `commands/create` (19), `cli-external-orchestration` (14), `system-skill-advisor` (13),
  `commands/speckit` (13), `sk-code` (12), `sk-doc` (10), `commands/memory` (6), `commands/doctor` (6),
  and the remaining single-file consumers.
- The `_memory.continuity` writer: name and wire whatever replaces the `memory_save` metadata refresh.
- A residue sweep script kept as the phase's proof.
- The six worklist items below, each with its named targets.

### Rewire Worklist

The inventory hands this phase six work items. Each one names its own targets, and each maps to a
requirement in section 4.

**W1. Live consumer families, routes and grants.** Rewrite the context and agent families across
`.opencode/agents` (8 paths, 49 rows), `.claude/agents` (11 paths, 57 rows), `.codex/agents` (8
paths, 47 rows) and `.pi/agents` (8 paths, 47 rows). Rewrite the `/memory:search`, `/memory:save`,
`/memory:manage` and `/doctor` memory routes. Rewrite the deep-loop YAML grants and calls so they
target lineage-local state. Every one of these resolves to the generated trigger index, a ripgrep
recipe from `retrieval-conventions.md`, lineage-local JSONL state or the approved file-local
successor.

**W2. Package and process seams.** Replace `workflow.ts` imports of
`@spec-kit/mcp-server/api/indexing`, the automatic `memory_index_scan` follow-up instructions and
the `.system-spec-memory-launcher.json` daemon detection with source-owned index and lease behavior.

**W3. Shared seam split.** Split `SPEC_KIT_DB_DIR`, `SPECKIT_DB_DIR`, `MEMORY_DB_PATH`, the retry,
launcher and IPC settings and the HF-local branches so `system-skill-advisor` and the retained
model-server consumers keep working. The memory-only DB branches go, the shared model-server socket
stays.

**W4. Instructions, assets and producers.** Update command YAML and TXT assets, `SKILL.md` and
reference files, `graph-metadata.json` and `description.json`, templates, install guidance, feature
catalogs, manual playbooks and the generated-artifact producers. Producers are updated before the
artifacts they generate, or the next generation reintroduces what this phase removed.

**W5. Deep-loop persistence tests.** Rewrite the reducer-facing persistence tests so `memory_save`
and `memory_context` become lineage-local state, while the locks, projections, ledger state and the
loop contract stay exactly as they are.

**W6. Replacement checks before deletions.** Add replacement tests and route checks before deleting
any old assertion. The inventory is a handoff list, not permission to bulk-replace historical
narrative.

### Out of Scope

- The 260 in-subsystem references — they are deleted with the tree in phase 003, not rewritten here.
- `system_skill_advisor`'s own tools. It is a separate server; only its *references to spec-memory*
  are in scope, not its own surface.
- Deleting anything — phase 003.
- Spec-doc content changes — phase 004.

### Preserve Set

These surfaces are out of scope as targets and must still work after this phase. A row that touches
one of them gets a source-level edit that splits the memory branch out, never a token deletion.

| Preserved surface | Why it survives |
|-------------------|-----------------|
| `system-skill-advisor` registration, its database and launcher, its thresholds and its advisor-specific memory DB pin | A separate server with its own consumers. It must resolve its embedder after W3 splits the shared branches. |
| The shared HF model-server, the `hf-embed.sock` capability, the shared embedding adapters and the generic IPC settings with a surviving owner | The advisor and the retained model-server consumers use them. Removing the socket logic kills a live capability. |
| Deep-loop locks, append-only projections, reducer state and the lineage-local continuity writer contract | W5 removes MCP persistence, not the loop state machine. |
| Historical research, run, report, benchmark and JSONL evidence outside `z_archive` | Labeled historical by the inventory and excluded from live route validation. Rewriting it falsifies the record. |
| Generic graph, council, completion and spec-gate infrastructure | Shares vocabulary with the memory surface without belonging to it. Only an explicitly server-only row is in scope. |

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `AGENTS.md` | Modify | Gate 1 mechanism; §5 tool table; §10 quick-reference rows |
| `.opencode/commands/{deep,speckit,create,memory,doctor}/**` | Modify | Command frontmatter `allowed-tools` and workflow steps |
| `.opencode/agents/*.md`, `.claude/agents/*.md`, `.codex/agents/*.md`, `.pi/agents/*.md` | Modify | Tool grants and retrieval instructions across all four runtime agent roots |
| `.opencode/skills/{system-deep-loop,sk-code,sk-doc,cli-external-orchestration}/**` | Modify | Retrieval references |
| `.opencode/skills/system-spec-kit/references/memory/save-workflow.md` | Modify | Continuity writer contract |
| `.opencode/skills/system-spec-kit/scripts/core/workflow.ts` | Modify | W2: drop the indexing API import and the launcher-json daemon detection |
| `.opencode/skills/system-spec-kit/shared/embeddings/**`, `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts` | Modify | W3: split the memory-only DB branches from the shared model-server and IPC paths |
| `.opencode/commands/deep/assets/*.yaml` | Modify | W1 and W5: grants and calls move to lineage-local state |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/*.vitest.ts` | Modify | W5: reducer persistence tests target lineage-local state |
| `.opencode/install-guides/install-scripts/install-all.sh`, `.opencode/commands/create/assets/*.yaml`, `.opencode/skills/system-spec-kit/templates/addons/resource-map.md.tmpl` | Modify | W4: generated-artifact producers, updated before their outputs |
| `.env.example` | Modify | W3: split the shared environment rows from the server-only rows |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `rg 'mcp__system_spec_memory__'` returns no hits outside `.opencode/skills/system-spec-kit/mcp-server/` |
| REQ-002 | None of the 41 tool names appears as a live instruction outside the subsystem tree |
| REQ-003 | `AGENTS.md` Gate 1 names a mechanism that works with no daemon running |
| REQ-004 | `_memory.continuity` frontmatter is written by a named standalone packet-local writer that keeps atomic same-directory update and lock semantics and does not depend on the MCP server. Ripgrep cannot write, so a read-only index and grep path does not satisfy this requirement |
| REQ-007 | The rewire declares honest capability loss. Semantic paraphrase, vector and BM25 fusion, decay, access tracking, session dedup and causal traversal each get a named replacement or an explicit unsupported declaration with a defined no-hit behavior |
| REQ-008 | W3: `SPEC_KIT_DB_DIR`, `SPECKIT_DB_DIR`, `MEMORY_DB_PATH`, the retry, launcher and IPC settings and the HF-local branches are split so `system-skill-advisor` and the retained model-server consumers keep a working owner |
| REQ-009 | W2: `workflow.ts` no longer imports `@spec-kit/mcp-server/api/indexing`, no longer emits automatic `memory_index_scan` follow-up instructions and no longer detects the daemon through `.system-spec-memory-launcher.json`. Source-owned index and lease behavior replaces all three |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | Command `allowed-tools` frontmatter no longer grants removed tools |
| REQ-006 | Every rewired consumer's retrieval instruction is executable by hand from `retrieval-conventions.md` |
| REQ-010 | W1: the context and agent families across `.opencode/agents`, `.claude/agents`, `.codex/agents` and `.pi/agents`, the `/memory:search`, `/memory:save`, `/memory:manage` and `/doctor` memory routes and the deep-loop YAML grants and calls all resolve through the trigger index, a ripgrep recipe, lineage-local state or the approved file-local successor |
| REQ-011 | W4: command YAML and TXT assets, `SKILL.md` and reference files, `graph-metadata.json` and `description.json`, templates, install guidance, feature catalogs, manual playbooks and generated-artifact producers are updated, producers before their outputs |
| REQ-012 | W5: deep-loop reducer-facing persistence tests use lineage-local state, with the locks, projections, ledger state and loop contract unchanged |
| REQ-013 | W6: replacement tests and route checks land before any old assertion is deleted |
| REQ-014 | The ~167 logical-owner estimate is reconciled owner by owner against the 9,016 live paths the row inventory attributes to this phase, and the reconciliation is recorded |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Residue sweep returns empty outside the subsystem tree
- **SC-002**: A full session runs Gate 1 through Gate 5 with the daemon stopped and no degraded-mode notice
- **SC-003**: `/speckit:plan`, `/speckit:resume` and `/memory:save` complete end to end without the MCP server
- **SC-004**: `system-skill-advisor` resolves its embedder with the memory branches split out
- **SC-005**: Each of the five break-risk seams carries a named replacement or a recorded retain decision
- **SC-006**: The ~167 owner estimate and the 9,016 live inventory paths are reconciled owner by owner in a recorded artifact
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `_memory.continuity` currently written through the save path; no replacement writer exists yet | High — continuity is the canonical recovery chain | REQ-004 makes naming the writer a blocker, not a follow-up |
| Risk | 167 files is enough that a mechanical sweep will miss prose references | Med | Sweep by tool name AND by transport prefix; review each area's diff separately |
| Risk | `commands/memory/*` may not survive rewiring at all | Med — some are pure DB administration with no meaning after removal | Decide per command: rewire, or mark for deletion in phase 003 |
| Dependency | Phase 001 artifacts | Blocks everything here | Sequenced; phase 001 handoff criteria gate it |
| Risk | Five surfaces still speak the old contract and break under a broad removal | High | Each seam below needs a named replacement or a recorded retain decision before phase 003 |

### Break-Risk Seams

Five surfaces still speak the old contract. Each one breaks if removal is broad rather than
surgical, so each needs either a named replacement or an explicit decision to retain it.

| Seam | What breaks | Citation |
|------|-------------|----------|
| S-001 `workflow.ts` to `@spec-kit/mcp-server/api/indexing` | Removing only the configuration leaves a compile and import failure behind | `.opencode/skills/system-spec-kit/scripts/core/workflow.ts:101-106,605-640` |
| S-002 deploy, orphan and session cleanup to `context-server`, launcher leases, `daemon-ipc.sock` and `hf-embed.sock` | Removing all process and socket logic can strand memory daemons or kill a retained advisor and embedder | `.opencode/skills/system-spec-kit/scripts/deploy-mcp.sh:49-82`, `.opencode/scripts/orphan-mcp-sweeper.sh:204-212,296-301,409-434,504-515`, `.opencode/scripts/session-cleanup.sh:102-113` |
| S-003 shared embeddings, HF-local and IPC to memory and `system-skill-advisor` | The advisor loses its embedder if the shared model-server socket goes with the memory-only DB branches | `.opencode/skills/system-spec-kit/shared/embeddings/adapter.ts:4-13`, `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:32-35,371-382`, `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:134,187,202-203` |
| S-004 deep-loop YAML, reducer, ledger and tests to `memory_save` and `memory_context` | Removing the loop state machine along with the MCP persistence breaks convergence and replay | `.opencode/commands/deep/assets/deep-research-auto.yaml:1757-1782,2339-2347`, `.opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-memory-upsert-yaml.vitest.ts:55-87` |
| S-005 generators, install scripts and catalogs to future artifacts | Deleting a generated consumer without updating its producer means the next generation puts it back | `.opencode/install-guides/install-scripts/install-all.sh:5-34,209-223`, `.opencode/commands/create/assets/create-skill-auto.yaml`, `.opencode/skills/system-spec-kit/templates/addons/resource-map.md.tmpl:21-48` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Gate 1 resolution stays under the 200ms budget set in phase 001

### Security
- **NFR-S01**: No consumer gains a broader tool grant than it held before

### Reliability
- **NFR-R01**: No consumer depends on a background service after this phase

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: a consumer with no retrieval need loses the grant rather than gaining a replacement
- Maximum length: none applicable

### Error Scenarios
- Index file absent: the consumer says so plainly rather than silently returning nothing
- A consumer whose only purpose was DB administration: marked for deletion, not rewired

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Files: ~167, LOC: mostly prose, Systems: 6 command families |
| Risk | 14/25 | Auth: N, API: Y (tool grants), Breaking: Y |
| Research | 8/20 | Per-area consumer intent must be read, not assumed |
| Multi-Agent | 8/15 | Workstreams: rewire is parallelizable by area |
| Coordination | 10/15 | Dependencies: gates phase 003 entirely |
| **Total** | **60/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | No replacement continuity writer | H | M | Blocker requirement REQ-004 |
| R-002 | Prose references missed by a name-based sweep | M | H | Two-axis sweep plus per-area diff review |
| R-003 | A rewired consumer silently degrades | M | M | SC-002 full-session run with daemon stopped |

---

## 11. USER STORIES

### US-001: A session that never needs the daemon (Priority: P0)

**As a** framework operator, **I want** every gate and command to work with no background service, **so that** a fresh clone or a flapping daemon is not a degraded session.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Retrieval I can reproduce (Priority: P1)

**As a** framework operator, **I want** each consumer's retrieval step to be a command I can run myself, **so that** I can check what the agent saw.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- Which of the six `/memory:*` commands survive as anything? `/memory:search` may become a thin ripgrep wrapper, while `/memory:manage` administers a database that will not exist.
- Does `_memory.continuity` stay in frontmatter at all, or does phase 004's convention move it? The two phases must not answer this differently.
- Mixed rows in shared files need source-level edits rather than token deletion. Which HF socket and IPC paths does the advisor actually use? That answer decides how W3 splits them.
- The inventory classifies live against historical by path structure. Any implementation target that sits under a research or report directory has to be re-opened by hand before it is treated as inert.
- Causal graph and drift analysis have no grep equivalent. Do explicit Markdown links or typed evidence replace them here, or does this phase declare the capability unsupported and hand the decision to phase 003?
<!-- /ANCHOR:questions -->

---
