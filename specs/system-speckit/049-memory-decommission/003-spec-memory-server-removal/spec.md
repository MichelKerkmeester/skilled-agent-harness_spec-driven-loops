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

Delete 1,480 tracked files and 453,813 lines, the MCP transport entries that start them, the
OpenCode plugin and bridge, the `spec-memory` hook concern, the memory command family, 373
environment flags, and the catalog and playbook that document all of it.

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
into every session's context, 373 environment flags, a 198 MB dependency tree, and a `/doctor`
surface whose reason for existing is repairing it. Deprecating it in place would keep every one of
those costs. Only removal collects the saving.

### Purpose

The repository holds no memory database, no daemon, and no MCP transport for one — and a session
starts clean without them.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `.opencode/skills/system-spec-kit/mcp-server/` — 1,480 tracked files, 453,813 LOC
- `.claude/mcp.json` `system-spec-memory` entry, and the equivalent in any peer runtime config
- `.opencode/bin/system-spec-memory-launcher.cjs` and the `spec-memory.cjs` CLI shim
- `.opencode/plugins/system-spec-memory.js` and its bridge
- `.opencode/hooks/spec-memory/`
- `/memory:*` commands that administer the removed database
- Memory-specific `/doctor` routes
- `SPECKIT_*` flags belonging to the removed subsystem, in `.env.example` and `ENV-REFERENCE.md`
- `feature-catalog/` and `manual-testing-playbook/` under `system-spec-kit`

### Out of Scope

- `system_skill_advisor` — separate server, powers Gate 2. Only its shared `hf-embed` socket
  assumption needs checking, not its code.
- `system-deep-loop`'s `council-graph.sqlite`.
- `scripts/spec/` — validation and scaffolding survive; they are not part of the memory engine.
- Historical spec packets 026 / 027 / 028, which remain as the evidence record.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp-server/` | Delete | The server package |
| `.claude/mcp.json` | Modify | Drop the `system-spec-memory` server entry |
| `.opencode/bin/system-spec-memory-launcher.cjs`, `spec-memory.cjs` | Delete | Launcher and CLI shim |
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
| Risk | Deleting 1,480 files in one commit is hard to review | Med | Split by surface: server tree, transport config, plugin/hook, commands, flags, docs |
| Dependency | Phase 002 residue sweep | Blocks the delete | Sequenced |
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
| Scope | 25/25 | Files: 1,480+, LOC: 453,813, Systems: 5 surfaces |
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
