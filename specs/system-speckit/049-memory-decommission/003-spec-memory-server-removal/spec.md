---
title: "Feature Specification: Phase 3: spec-memory-server-removal"
description: "Delete the system-spec-memory server package, its MCP transport entries, plugin, bridge, hook, commands, flags and documentation, once nothing external calls it."
trigger_phrases:
  - "spec memory removal"
  - "mcp server deletion"
  - "daemon removal"
  - "subsystem decommission"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 3: spec-memory-server-removal

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

Delete 1,481 tracked files and 453,964 lines, the MCP transport entries that start them, the
OpenCode plugin and bridge, the `spec-memory` hook concern, the memory command family, the
server-only environment flags and the catalog and playbook that document all of it. The same tree
holds 3,203 regular files in a working checkout once build output and installed dependencies are
counted, so the working-copy saving is larger than the tracked diff.

**Key Decisions**: Delete rather than deprecate — the artifact is derived, git holds the history, and a deprecated-but-present subsystem keeps its operational cost; leave `system_skill_advisor` untouched.

**Critical Dependencies**: Phase 002's residue sweep must return empty first.

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
| **Phase** | 3 of 4 |
| **Predecessor** | 002-memory-consumer-rewire |
| **Successor** | 004-grep-convention-doc-retrofit |
| **Handoff Criteria** | No MCP memory transport, no daemon, no orphan launcher; a session boots clean |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the memory db decommission specification.

**Scope Boundary**: Deletion only. No new behavior is introduced here and no consumer changes — if
this phase needs to edit a consumer, phase 002 was incomplete and the fix belongs there.

**Dependencies**:
- Phase 002 residue sweep returns empty

**Deliverables**:
- The subsystem tree removed
- `.claude/mcp.json` and any peer runtime config no longer declaring the server
- Plugin, bridge, hook concern and launcher removed
- Flag surface removed from `.env.example` and the env reference
- A residue sweep proving nothing references the removed tree

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The subsystem's cost is structural, not incidental: a background service that flaps, 41 tools loaded
into every session's context, a wide environment-flag surface, a 198 MB dependency tree and a
`/doctor` surface whose reason for existing is repairing it. Deprecating it in place would keep
every one of those costs. Only removal collects the saving.

The 373-flag figure carried by the parent estimate is not reproducible. The measured target-tree
scope carries 410 unique flag identifiers and the external scope carries 872, and both scopes
include shared advisor aliases this phase must not delete. Read the flag count as a scoping input,
never as a deletion target.

### Purpose

The repository holds no memory database, no daemon, and no MCP transport for one — and a session
starts clean without them.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `.opencode/skills/system-spec-kit/mcp-server/`: 1,481 tracked files, 453,964 lines, 20,273,034 bytes
- `.claude/mcp.json` `system-spec-memory` entry, and the equivalent in any peer runtime config
- `.opencode/bin/system-spec-memory-launcher.cjs` and the `spec-memory.cjs` CLI shim
- `.opencode/plugins/system-spec-memory.js` and its bridge
- `.opencode/hooks/spec-memory/`
- `/memory:*` commands that administer the removed database
- Memory-specific `/doctor` routes
- `SPECKIT_*` flags belonging to the removed subsystem, in `.env.example` and `ENV-REFERENCE.md`
- `feature-catalog/` and `manual-testing-playbook/` under `system-spec-kit`

### Tree Census

Measured against the target tree rather than estimated. The census below replaces the parent's
1,480-file and 453,813-line figures, which were short by one file and 151 lines.

| Scope | Files | Bytes | Newline-counted lines |
|-------|------:|------:|----------------------:|
| Tracked files | 1,481 | 20,273,034 | 453,964 |
| Worktree regular files | 3,203 | 32,456,976 | 618,794 |

Source: `specs/system-speckit/049-memory-decommission/006-legacy-memory-surface-inventory/research/lineages/luna-max/research.md`.
The row-level artifact it cites, `inventory.external.json`, is 69 MB and is referenced by path only.

### Tools Removed

The parent estimate of 41 exposed tools is confirmed against the schema. Only 37 of the names occur
literally in the target-tree scan, because some registration names are reached through aliases or
structured fields rather than as literal strings, so a name-grep undercounts the surface by four.

| Family | Tools |
|--------|-------|
| checkpoint (4) | `checkpoint_create`, `checkpoint_delete`, `checkpoint_list`, `checkpoint_restore` |
| embedder (3) | `embedder_list`, `embedder_set`, `embedder_status` |
| eval (2) | `eval_reporting_dashboard`, `eval_run_ablation` |
| memory (27) | `memory_bulk_delete`, `memory_causal_link`, `memory_causal_stats`, `memory_causal_unlink`, `memory_context`, `memory_delete`, `memory_drift_why`, `memory_embedding_reconcile`, `memory_get_learning_history`, `memory_health`, `memory_index_scan`, `memory_index_scan_cancel`, `memory_index_scan_status`, `memory_ingest_cancel`, `memory_ingest_start`, `memory_ingest_status`, `memory_learned_clear`, `memory_learned_expire`, `memory_list`, `memory_match_triggers`, `memory_quick_search`, `memory_retention_sweep`, `memory_save`, `memory_search`, `memory_stats`, `memory_update`, `memory_validate` |
| session (3) | `session_bootstrap`, `session_health`, `session_resume` |
| task (2) | `task_postflight`, `task_preflight` |

### Deletion Worklist

Four items, in order. Nothing here starts until phase 002's residue sweep returns empty.

**W1. The server tree, as one unit.** Delete `.opencode/skills/system-spec-kit/mcp-server/` in a
single move, then remove what pointed at it: its npm workspace entry, its `bin` and `scripts`
entries and the server-only lock and package entries that the workspace left behind.

**W2. Launchers, plugin and hooks.** Delete `.opencode/bin/system-spec-memory-launcher.cjs` and
`.opencode/bin/spec-memory.cjs`, strip the memory allowlists from
`.opencode/bin/lib/launcher-session-proxy.cjs`, delete `.opencode/plugins/system-spec-memory.js`,
delete the memory hook adapters under `.opencode/hooks/spec-memory/` and delete the memory-only
plugin tests and playbooks.

**W3. Registrations, grants, env and catalogs.** Remove the `system-spec-memory` registration and
its tool grants from all five runtime config roots: `.claude/mcp.json`, `.codex/config.toml`,
`.cursor/mcp.json`, `.pi/mcp.json` and `opencode.json`. Then remove the server-only `.env.example`
and `ENV-REFERENCE.md` rows, the install and catalog entries, the launcher leases, the orphan and
session cleanup branches and the obsolete memory routes.

**W4. Preserve, do not sweep.** Anything not proven server-only stays. The preserve set below is a
hard boundary, and a row that mixes a memory term with a retained owner is a source-level edit in
W1 to W3, never a token deletion.

### Out of Scope

- `system_skill_advisor` — separate server, powers Gate 2. Only its shared `hf-embed` socket
  assumption needs checking, not its code.
- `system-deep-loop`'s `council-graph.sqlite`.
- `scripts/spec/` — validation and scaffolding survive; they are not part of the memory engine.
- Historical spec packets 026 / 027 / 028, which remain as the evidence record.

### Preserve Set

Hard out of scope. Every item below shares vocabulary with the removed subsystem and will match a
memory-term search, so each one needs a positive check that it survived, not an absence of evidence
that it was hit. Deleting any of these is a phase failure, not a scope question.

| Preserved surface | Why it survives |
|-------------------|-----------------|
| `system-skill-advisor` registration, database, launcher, thresholds and its advisor-specific memory DB pin | Separate server. It powers Gate 2 and outlives the memory engine |
| Shared HF model-server capability, the `hf-embed` socket, shared embedding adapters and generic IPC settings | The advisor is the surviving owner. Only the memory-only DB branches come out |
| Deep-loop locks, append-only projections, reducer state and the lineage-local continuity writer contract | The loop state machine is not memory. Only its MCP persistence calls are rewired in phase 002 |
| Historical research, run, report, benchmark and JSONL evidence outside `z_archive` | It is the record of what the subsystem did. Labelled historical and excluded from live route validation |
| Generic graph, council, completion and spec-gate infrastructure | Only a row proven `system-spec-memory`-only is in scope |

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp-server/` | Delete | The server package |
| `.claude/mcp.json` | Modify | Drop the `system-spec-memory` server entry |
| `.codex/config.toml`, `.cursor/mcp.json`, `.pi/mcp.json`, `opencode.json` | Modify | The four peer runtime roots, same registration and tool grants |
| `.opencode/bin/system-spec-memory-launcher.cjs`, `spec-memory.cjs` | Delete | Launcher and CLI shim |
| `.opencode/bin/lib/launcher-session-proxy.cjs` | Modify | Strip the memory allowlists. The proxy itself serves the advisor and stays |
| `.opencode/plugins/system-spec-memory.js` | Delete | OpenCode plugin |
| `.opencode/hooks/spec-memory/` | Delete | Hook concern |
| `.opencode/commands/memory/` | Delete/Modify | Per phase-002's per-command decision |
| `.env.example`, `mcp-server/ENV-REFERENCE.md` | Modify/Delete | Flag surface |
| `.opencode/skills/system-spec-kit/{feature-catalog,manual-testing-playbook}/` | Delete | Docs for removed engine |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No MCP client config declares a `system-spec-memory` server in any runtime |
| REQ-002 | A session starts with no memory daemon, no launcher lock directory, and no orphan process |
| REQ-003 | `system_skill_advisor` still resolves its embedder after spec-memory stops spawning the shared model server |
| REQ-004 | `validate.sh` still runs; spec scaffolding and validation are unaffected by the removal |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | `.env.example` and the env reference carry no flag for a removed feature |
| REQ-006 | No documentation left in the repository describes the removed tools as available |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `git ls-files | rg 'mcp-server'` returns nothing under `system-spec-kit`
- **SC-002**: A cold session start produces no memory-server connection attempt and no timeout notice
- **SC-003**: Gate 2 skill routing still works, proving the advisor survived the shared-socket change
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The advisor shares the `hf-embed` socket and may rely on spec-memory spawning the model server | High — Gate 2 breaks | REQ-003 makes this a blocker; verify before the delete commit, not after |
| Risk | `scripts/` imports from `mcp-server` via the `@spec-kit/mcp-server` file dependency | High — validation could break with the tree | REQ-004; check `package.json` links and the compiled `dist` before deleting |
| Risk | Deleting 1,481 tracked files in one commit is hard to review | Med | Split by surface: server tree, transport config, plugin/hook, commands, flags, docs |
| Dependency | Phase 002 residue sweep | Blocks the delete | Sequenced |
| Seam | `workflow.ts` imports `@spec-kit/mcp-server/api/indexing`. Removing only the configuration leaves a compile and import failure | High. Spec workflow scripts stop building | Give the index and lease behavior a source-owned implementation first. `.opencode/skills/system-spec-kit/scripts/core/workflow.ts:101-106,605-640` |
| Seam | Deploy, orphan and session cleanup share `context-server`, launcher leases, `daemon-ipc.sock` and `hf-embed.sock`. Removing all process and socket logic can strand a memory daemon or kill a retained embedder | High. Advisor loses its socket | Split the memory branch out of each script and keep the advisor branch. `.opencode/skills/system-spec-kit/scripts/deploy-mcp.sh:49-82`, `.opencode/scripts/orphan-mcp-sweeper.sh:204-212,296-301,409-434,504-515`, `.opencode/scripts/session-cleanup.sh:102-113` |
| Seam | Shared embeddings, HF-local and IPC serve both memory and `system-skill-advisor` | High. Gate 2 breaks | Remove the memory-only DB branches and keep the shared model-server socket. `.opencode/skills/system-spec-kit/shared/embeddings/adapter.ts:4-13`, `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:32-35,371-382`, `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:134,187,202-203` |
| Seam | Deep-loop YAML, reducer, ledger and tests call `memory_save` and `memory_context` | Med. The loop keeps running on stale contracts | Remove the MCP persistence, never the loop state machine. `.opencode/commands/deep/assets/deep-research-auto.yaml:1757-1782,2339-2347`, `.opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-memory-upsert-yaml.vitest.ts:55-87` |
| Seam | Generators, install scripts and catalogs emit future consumers of the removed tools | Med. Residue returns after the sweep | Update the producer before deleting the generated consumer. `.opencode/install-guides/install-scripts/install-all.sh:5-34,209-223`, `.opencode/commands/create/assets/create-skill-auto.yaml`, `.opencode/skills/system-spec-kit/templates/addons/resource-map.md.tmpl:21-48` |

**The seam rule.** Each of the five rows above is a file that still speaks the old contract and has a
retained owner. A row that mixes a memory term with a surviving caller gets a source-level edit that
keeps the caller working. It never gets a token deletion, a line drop or a blanket search and
replace, and it is not resolved by removing configuration alone.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Session start time does not regress; expected to improve with no daemon handshake

### Security
- **NFR-S01**: Removal drops the ~198 MB dependency tree and its supply-chain surface

### Reliability
- **NFR-R01**: No background service remains that can flap

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: an already-absent file is a no-op, not an error
- Maximum length: none applicable

### Error Scenarios
- A stale `.sqlite` or lock directory on a developer machine: documented cleanup, since these are gitignored and survive a pull
- A peer runtime config not checked into this repository: named in the close-out as operator-verifiable only

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 25/25 | Files: 1,481 tracked, lines: 453,964, Systems: 5 runtime roots plus 5 surfaces |
| Risk | 18/25 | Auth: N, API: Y (41 tools removed), Breaking: Y |
| Research | 6/20 | Dependency links and the shared socket need checking |
| Multi-Agent | 4/15 | Workstreams: 1, deletion is sequential |
| Coordination | 10/15 | Dependencies: gated by 002, gates 004 |
| **Total** | **63/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Skill advisor loses its embedder | H | M | REQ-003 verified before the delete commit |
| R-002 | `scripts/` package breaks via file dependency | H | M | REQ-004; inspect links first |
| R-003 | Unreviewable single commit | M | H | Split by surface into six commits |

---

## 11. USER STORIES

### US-001: A repository with no memory service (Priority: P0)

**As a** framework operator, **I want** no background memory service in the repository, **so that** sessions stop paying for a component that its own benchmark did not show helping.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Reviewable removal (Priority: P1)

**As a** reviewer, **I want** the deletion split by surface, **so that** I can check each one without reading a 1,480-file diff.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- Does `@spec-kit/scripts` import anything from `@spec-kit/mcp-server` that validation actually needs? Its `package.json` declares a `file:../mcp-server` dependency, so this must be resolved before the tree goes.
- Should `feature-catalog/` and `manual-testing-playbook/` be deleted or archived under `specs/`? They document a system that will not exist, but they are also the record of what it did.
<!-- /ANCHOR:questions -->

---
