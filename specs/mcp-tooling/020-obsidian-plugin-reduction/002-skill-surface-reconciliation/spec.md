---
title: "Feature Specification: Phase 2: skill-surface-reconciliation"
description: "Reconcile every mcp-obsidian document and router entry that names a removed plugin, so the mode describes the file set phase 1 left behind."
trigger_phrases:
  - "mcp-obsidian router intents"
  - "reconcile obsidian skill docs after plugin removal"
  - "obsidian resource map cleanup"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 2: skill-surface-reconciliation

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY


Phase 1 left the mode describing files that no longer exist. This phase rewrites every surviving
document and router entry that named a removed plugin: the skill router's intents and resource
map, the README plugin table, the installed-plugins roster, the operation-logic artifact map, the
cross-plugin workflow asset, the migration reference, and both indexes. A changelog entry records
the version.

**Key Decisions**: the router keeps a generic `PLUGINS` intent plus two specific ones; the
migration reference keeps its method and loses only its links into deleted doc sets.

**Critical Dependencies**: phase 1 must be complete, or the reconciliation is written against a
file set that is still changing.

---
<!-- ANCHOR:metadata -->

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-11 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 3 |
| **Predecessor** | 001-plugin-doc-removal |
| **Successor** | 003-hub-routing-and-validation |
| **Handoff Criteria** | No surviving document under the mode references a removed plugin path, except changelog history |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->

## Phase Context

This is **Phase 2** of the Reduce mcp-obsidian dedicated plugin support to Iconic and Health.md
only specification.

**Scope Boundary**: documents and router logic inside the mode directory. The parent hub's files
belong to phase 3.

**Dependencies**:
- Phase 1 complete: the 79 files are gone, so the reconciliation describes a settled file set.

**Deliverables**:
- A router whose intents and resource map name only files that exist.
- A README, roster, operation-logic reference and workflow asset that describe two plugins.
- A changelog entry for the shipped version.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->

## 2. PROBLEM & PURPOSE

### Problem Statement
After phase 1 the mode's own documents are wrong. `SKILL.md` routes twelve intents to resource
paths that no longer resolve, `README.md` advertises a plugin table of eleven, the roster claims
which plugins carry dedicated docs, and two indexes list deleted entries. A router that loads a
missing file degrades silently, which is worse than failing.

### Purpose
Every surviving document under the mode describes the two-plugin reality, and every router path
resolves on disk.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->

## 3. SCOPE

### In Scope
- `SKILL.md`: frontmatter description, the keywords comment, activation triggers, the §2 resource
  loading list, `INTENT_SIGNALS`, `RESOURCE_MAP`, the `specific_plugin_intents` tuple, the
  intent-count comment, the §3 headline sentence, the §7 routing table row and the §8 reference list.
- `README.md`: the use-it-for row, the plugin knowledge-layer paragraph, the per-plugin table and
  the FAQ answer.
- `references/plugins/installed-plugins.md`: the roster of which plugins carry dedicated docs.
- `references/plugins/plugin-operation-logic.md`: the artifact data map.
- `assets/workflows.md`: cross-plugin workflow examples.
- `references/notion-migration.md`: links into removed doc sets.
- `feature-catalog/FEATURE-CATALOG.md` and `manual-testing-playbook/manual-testing-playbook.md`: the indexes.
- `changelog/v0.24.0.0.md`: a new entry, and the `version` field in `SKILL.md` frontmatter.

### Out of Scope
- The parent hub's `leaf-manifest.json`, `mode-registry.json` and `hub-router.json` - phase 3.
- `references/mcp-tools.md`, `references/cli-versus-mcp.md`, `references/troubleshooting.md`,
  `INSTALL-GUIDE.md`, `examples/README.md` - their Local REST API mentions are transport
  prerequisite prose, not dedicated plugin support, and were verified to stand on their own.
- `references/themes/` and the two theme files in the catalog and playbook.
- Rewriting the note, vault, CLI or MCP documentation for any reason other than a removed-plugin reference.

### Files to Change

All paths are relative to `.opencode/skills/mcp-tooling/mcp-obsidian/`.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `SKILL.md` | Modify | Description, keywords, triggers, resource list, intents, resource map, §3/§7/§8 prose, version bump |
| `README.md` | Modify | Plugin table and the three prose spots that enumerate plugins |
| `references/plugins/installed-plugins.md` | Modify | Roster: which of the enabled plugins carry dedicated docs |
| `references/plugins/plugin-operation-logic.md` | Modify | Artifact data map, currently ten artifacts |
| `assets/workflows.md` | Modify | Cross-plugin workflow examples |
| `references/notion-migration.md` | Modify | Remove links into deleted doc sets, keep the method |
| `feature-catalog/FEATURE-CATALOG.md` | Modify | Catalog index rows |
| `manual-testing-playbook/manual-testing-playbook.md` | Modify | Playbook index rows |
| `changelog/v0.24.0.0.md` | Create | Version entry describing the reduction |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every path in `SKILL.md` `RESOURCE_MAP` resolves to a file that exists on disk |
| REQ-002 | `INTENT_SIGNALS` and the `specific_plugin_intents` tuple carry only `PLUGIN_ICONIC`, `PLUGIN_HEALTH` and `THEME_SYSTEM` among the plugin-specific entries |
| REQ-003 | No surviving document under the mode links to a removed plugin path |
| REQ-004 | The `PLUGINS` generic intent lists only surviving resources |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | `SKILL.md` frontmatter description, keyword comment and activation triggers name only the retained plugins |
| REQ-006 | `installed-plugins.md` correctly reports which enabled plugins now carry dedicated docs |
| REQ-007 | A changelog entry exists and the `SKILL.md` version field matches it |
| REQ-008 | The intent-count comment in `SKILL.md` §2 matches the actual number of `INTENT_SIGNALS` keys |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->

## 5. SUCCESS CRITERIA

- **SC-001**: A repo-wide grep for the twelve removed directory names under the mode returns hits only in `changelog/`.
- **SC-002**: Every `RESOURCE_MAP` value resolves, checked by listing each path.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A router path is missed and silently loads nothing | High | Resolve every `RESOURCE_MAP` path against disk as a gate, not by eye |
| Risk | The intent-count comment drifts from the real key count | Low | Count the keys and compare, rather than editing the number by hand |
| Risk | Reconciliation widens into rewriting unrelated prose | Medium | Scope lists the exact spots; anything else is recorded, not fixed |
| Risk | The migration reference loses its method along with its links | Medium | Only the links into deleted doc sets change; the 8-step method stays |
| Dependency | Phase 1 | Blocking | Reconciling a file set that is still changing produces a second wrong document |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The router's always-loaded surface does not grow; `SKILL.md` gets shorter, not longer.

### Security
- **NFR-S01**: No API key, token or vault path is written into any document. The Local REST API prose keeps reading its values from the environment.

### Reliability
- **NFR-R01**: Every router path resolves, so no route can degrade to loading nothing.

---

## 8. EDGE CASES

### Data Boundaries
- A document mentions a removed plugin in passing prose rather than as a link: rewrite the sentence, do not delete the section it sits in.
- A changelog entry names a removed plugin: leave it. History is a record of what was true then.

### Error Scenarios
- A `RESOURCE_MAP` path resolves but points at a retained file under a removed intent: treat it as a wiring error and fix the intent, not the path.
- A removed name survives inside a code fence example: rewrite the example with a retained plugin rather than deleting the example.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 15/25 | Files: 9, LOC: ~400 changed, Systems: 1 |
| Risk | 8/25 | Auth: N, API: N, Breaking: routing degrades silently if a path is missed |
| Research | 5/20 | The affected spots are enumerated, but prose judgment is needed per spot |
| Multi-Agent | 3/15 | Workstreams: 1 |
| Coordination | 10/15 | Dependencies: phase 1 upstream, phase 3 downstream |
| **Total** | **41/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A `RESOURCE_MAP` path is left dangling | H | M | Resolve every path against disk before handoff |
| R-002 | An orphaned intent keeps scoring and routes to nothing | H | M | Intent list and resource map are edited together, then replayed |
| R-003 | Reconciliation drifts into unrelated rewrites | M | M | The scope names each spot; anything else is recorded |

---

## 11. USER STORIES

### US-001: A router that resolves (Priority: P0)

**As an** agent loading Obsidian resources, **I want** every routed path to exist, **so that** a
plugin request either loads real guidance or asks for disambiguation, instead of loading nothing.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Documentation that matches the tree (Priority: P1)

**As a** reader of the mode, **I want** the README and roster to name the two plugins that are
actually documented, **so that** I do not go looking for a doc set that was removed.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

None. The retained set is settled and the out-of-scope boundary was verified against the files.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See the Architecture Decision Record section at the end of `plan.md`

---


