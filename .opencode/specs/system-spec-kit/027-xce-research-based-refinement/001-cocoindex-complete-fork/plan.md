---
title: "Plan - Phase 001 Complete CocoIndex MCP Fork"
description: "Technical plan for replacing the partial 0.2.3 soft fork with a complete v0.2.33 in-repo fork, then porting spec-kit patches, scripts, docs, tests, metadata, and verification."
trigger_phrases:
  - "027 phase 001 plan"
  - "complete cocoindex fork plan"
  - "cocoindex-code v0.2.33 import plan"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-cocoindex-complete-fork"
    last_updated_at: "2026-05-10T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored /spec_kit:plan artifacts for complete CocoIndex MCP fork"
    next_safe_action: "Start Sub-Phase 1 inventory and import manifest"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "decision-record.md", "research.md"]
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Complete CocoIndex MCP Fork

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3.11+, shell scripts, Markdown docs |
| **Framework** | MCP server via `mcp`, CLI via `typer`, CocoIndex engine dependency |
| **Storage** | SQLite vector/state DB under `.cocoindex_code` or mapped runtime paths |
| **Testing** | pytest, shell smoke tests, SpecKit recursive validation |

### Overview

Replace the current partial soft fork with a complete upstream v0.2.33 fork root, then port the spec-kit patch overlay with tests. The implementation must keep local install behavior, preserve MCP search compatibility, update attribution, and make future phases depend on this baseline instead of the stale 0.2.3 fork.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] User selected existing spec parent `027-xce-research-based-refinement`.
- [x] Research identified upstream baseline `v0.2.33` and local fork version `0.2.3+spec-kit-fork.0.2.0`.
- [x] Phase 001 scaffolded at Level 3 and old phases renumbered.
- [ ] User answers whether transitive `cocoindex` engine vendoring is in or out if they need stricter "total control" than MCP-wrapper ownership.

### Definition of Done
- [ ] Full fork root imported or explicitly mapped with import manifest.
- [ ] Current spec-kit patch set preserved with tests.
- [ ] Install, update, doctor, and readiness scripts point at local fork root.
- [ ] Docs, license, notice, changelog, and references updated.
- [ ] Local pytest/smoke verification passes.
- [ ] Recursive spec validation passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Owned vendor fork with patch overlay. Upstream v0.2.33 becomes the local baseline; spec-kit modifications are carried as named local deltas with regression tests.

### Key Components
- **Upstream baseline import**: full source/docs/tests/runtime assets from `external/cocoindex-code-main`.
- **Patch overlay**: current spec-kit search telemetry and ranking changes.
- **Script surface**: install/update/doctor/ensure_ready local workflows.
- **Verification surface**: upstream tests plus spec-kit patch tests.
- **Documentation surface**: skill docs, references, notices, and phase metadata.

### Data Flow

```text
User/agent -> ccc CLI or MCP search
  -> local .opencode/skills/mcp-coco-index/mcp_server fork
  -> cocoindex engine dependency for indexing/embeddings
  -> SQLite vector/state DB
  -> spec-kit result shaping: dedup, path_class, rankingSignals
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/mcp-coco-index/mcp_server/` | Partial source fork | Replace/merge with complete v0.2.33 fork root | file manifest + pytest |
| `scripts/install.sh` | Installs local editable package | Update for chosen layout and extras | install smoke |
| `scripts/update.sh` | Downloads latest and prints three-file patch reminder | Replace with complete-fork diff workflow | dry-run output |
| `scripts/doctor.sh` / `ensure_ready.sh` | Readiness checks | Update version and path checks | strict doctor smoke |
| `SKILL.md` / references | User-facing guidance | Update version, ownership, and fields | markdown review + grep |
| `NOTICE` / `CHANGELOG.md` | Attribution and local deltas | Update upstream baseline and patch list | grep baseline + license |
| Existing phases 007/010/011 | Later CocoIndex changes | Note dependency on Phase 001 where relevant | spec grep |

Required inventories:
- Same-class producers: `rg -n 'source_realpath|path_class|rankingSignals|dedupedAliases|canonical_resource' .opencode/skills/mcp-coco-index`.
- Consumers of changed package layout: `rg -n 'mcp_server/cocoindex_code|src/cocoindex_code|pip install|ccc --version|spec-kit-fork' .opencode/skills/mcp-coco-index`.
- Algorithm invariant: vector similarity remains primary; spec-kit rerank deltas are bounded and auditable.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Import Manifest and Layout Decision
- [ ] Create an import manifest classifying upstream files as imported, excluded, or deferred.
- [ ] Decide `src/` layout vs flat layout in ADR-001.
- [ ] Capture baseline file counts, test counts, and dependency versions.

### Phase 2: Baseline Import
- [ ] Replace/merge `mcp_server/` with the selected v0.2.33 fork root.
- [ ] Preserve local `LICENSE`, `NOTICE`, `CHANGELOG.md`, and skill-level docs outside the fork root.
- [ ] Keep `.venv`, caches, and generated artifacts out of tracked scope.

### Phase 3: Patch Overlay Port
- [ ] Port mirror exclusions and canonical resource paths.
- [ ] Port chunk identity fields and path taxonomy.
- [ ] Port over-fetch dedup and bounded reranking.
- [ ] Port protocol/server/CLI fields for extended telemetry.

### Phase 4: Scripts, Docs, and Metadata
- [ ] Update install, update, doctor, and readiness scripts.
- [ ] Update skill docs and references.
- [ ] Update parent/child phase dependency docs if implementation changes later-phase assumptions.

### Phase 5: Verification and Handoff
- [ ] Run default pytest subset.
- [ ] Run install and CLI/MCP smoke checks.
- [ ] Run SpecKit recursive validation.
- [ ] Write implementation summary and mark checklist with evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Upstream Python tests that do not require Docker/live providers | pytest |
| Regression | Spec-kit fields and dedup/rerank behavior | pytest fixtures |
| Script smoke | install, doctor, ensure_ready, update dry-run | bash |
| MCP smoke | server construction and search schema compatibility | pytest or local MCP smoke |
| Spec validation | Parent and child phase docs | `validate.sh --recursive --strict` |

Default test command target:
```bash
cd .opencode/skills/mcp-coco-index/mcp_server
python -m pytest -m 'not docker_e2e'
```

Optional tests:
```bash
python -m pytest -m docker_e2e
```
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Upstream v0.2.33 source in `external/cocoindex-code-main` | External source snapshot | Green | Cannot establish complete baseline |
| Python 3.11+ | Runtime | Green | Package cannot install |
| `cocoindex[litellm]` engine dependency | External package | Yellow | Full MCP fork still lacks engine ownership |
| Existing spec-kit patches | Internal behavior | Green | Search telemetry regression if not ported |
| Docker | Optional runtime verification | Unknown | Docker E2E may be manual-only |

### Phase Dependencies

- Phase 001 is a new prerequisite for Phase 007 (`coco-intent-steering`), Phase 010 (`retrieval-rerank-clients`), and Phase 011 (`coco-memory-context-extras`).
- Code-graph phases 002-006 can proceed independently unless they consume CocoIndex APIs.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: local install cannot expose `ccc`, search schema compatibility breaks, or patch overlay tests fail after reasonable repair.
- **Procedure**: restore the previous `mcp_server/cocoindex_code` tree and `mcp_server/pyproject.toml` from git, restore old scripts/docs, reinstall editable package, rerun old fork smoke checks.
- **Data**: document whether `.cocoindex_code` indexes must be rebuilt. If schema changed, require `ccc reset && ccc index` only after explicit user confirmation.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Reason |
|-------|------------|--------|
| Phase 1 | User scope answer for transitive engine boundary | Avoid accidental engine fork |
| Phase 2 | Phase 1 | Layout and import manifest must be settled |
| Phase 3 | Phase 2 | Patches port onto imported baseline |
| Phase 4 | Phase 3 | Scripts/docs must reflect actual package behavior |
| Phase 5 | Phase 1-4 | Verification needs final tree |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Workstream | Estimate | Notes |
|------------|----------|-------|
| Import manifest + layout ADR | 1-2 hours | Includes file inventory and exclusions |
| Baseline import | 1-2 hours | Mostly mechanical but high review cost |
| Patch port | 3-5 hours | Main correctness risk |
| Script/docs update | 2-3 hours | Must keep skill docs accurate |
| Verification | 2-4 hours | Depends on dependency resolver and daemon behavior |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Record current `ccc --version` and package path.
- [ ] Capture tracked file diff before import.
- [ ] Keep old package tree recoverable through git.

### Rollback Procedure
1. Restore old tracked source and scripts.
2. Reinstall the old editable package.
3. Run `ccc --help` and non-destructive doctor checks.
4. Document any reindex requirement.

### Data Reversal
No data migration is planned during import. Existing indexes may need rebuild only if schema or embedding parameters change.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
User boundary decision
  -> layout ADR
  -> upstream import
  -> patch overlay port
  -> script/docs update
  -> tests + validation
  -> later CocoIndex phases
```

### Dependency Matrix

| Consumer | Consumes | Contract |
|----------|----------|----------|
| Phase 007 | Query internals | stable local v0.2.33 fork with patch fields |
| Phase 010 | Result/rerank interfaces | stable telemetry and candidate schema |
| Phase 011 | Examples/context extras | stable CLI/MCP behavior |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. Decide transitive engine boundary.
2. Choose fork-root layout.
3. Import full upstream baseline.
4. Port spec-kit patch overlay with tests.
5. Update scripts and docs.
6. Validate recursively.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Exit Criteria |
|-----------|---------------|
| M1 Baseline chosen | ADR accepted and import manifest exists |
| M2 Source imported | local package builds from complete fork root |
| M3 Patch overlay green | all spec-kit patch tests pass |
| M4 Scripts/docs aligned | install/doctor docs reflect complete fork |
| M5 Planning closeout | checklist and validation evidence recorded |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` ADR-001 for the full fork strategy and alternatives.
