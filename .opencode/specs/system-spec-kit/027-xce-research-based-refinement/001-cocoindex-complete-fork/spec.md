---
title: "Phase 001 - Complete CocoIndex MCP Fork"
description: "Plan a full in-repo fork of the cocoindex-code MCP wrapper by replacing the current 0.2.3 soft-fork subset with the complete upstream v0.2.33 repository surface, then porting spec-kit patches, scripts, docs, tests, license notices, and runtime wiring onto that baseline. This phase is prerequisite for later CocoIndex retrieval work because the current bundled fork owns only 15 Python files and 2 tests while upstream v0.2.33 ships 18 Python modules, Docker/runtime helpers, skill docs, pyproject metadata, uv.lock, and 15 tests."
trigger_phrases:
  - "027 phase 001"
  - "cocoindex complete fork"
  - "complete cocoindex mcp fork"
  - "mcp-coco-index full upstream fork"
  - "cocoindex-code v0.2.33 adoption"
  - "spec-kit fork upstream sync"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-cocoindex-complete-fork"
    last_updated_at: "2026-05-10T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded Phase 001 fork plan"
    next_safe_action: "Implement Sub-Phase 1 inventory and upstream baseline import"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "research.md"
      - "resource-map.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-10-027-001-cocoindex-complete-fork-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Should total control include the Rust/Python `cocoindex` engine dependency, or only the `cocoindex-code` MCP wrapper in this phase?"
      - "Should the final package keep upstream's src/ layout or adapt the current flat cocoindex_code package layout?"
    answered_questions:
      - "Use upstream v0.2.33 as the planning baseline; GitHub marks it latest and the downloaded tree matches the v0.2.33 cli.py raw file."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Complete CocoIndex MCP Fork

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

This phase converts `mcp-coco-index` from a partial soft fork into a complete, locally controlled fork of `cocoindex-code`'s MCP wrapper. The current skill fork is pinned to `0.2.3+spec-kit-fork.0.2.0` and documents only the original 0.2.3 vendoring plus six spec-kit patches in `CHANGELOG.md:9-27` and `NOTICE:16-31`. Upstream is now `v0.2.33` as of 2026-05-08; GitHub release `v0.2.33` is marked latest and lists the lazy-load CLI performance change from PR #164.

The researched baseline says this is architectural Level 3 work. The local fork has 15 Python package files and 2 tests; upstream v0.2.33 has 18 Python modules, 15 test files, Docker runtime assets, the `skills/ccc` agent skill, hatch/uv packaging, path mapping helpers, custom chunker support, embedding parameter defaults, and a richer CLI/doctor surface. Taking the whole MCP wrapper into the repo lets later phases change query behavior, daemon behavior, settings, packaging, tests, and docs without chasing PyPI or reimplementing upstream features piecemeal.

The boundary is explicit: this phase forks the `cocoindex-code` MCP wrapper. It does not fork the transitive `cocoindex` engine dependency yet. The plan pins and audits that dependency, because upstream still depends on `cocoindex[litellm]>=1.0.0,<1.1.0` in `external/cocoindex-code-main/pyproject.toml:24-36`; vendoring the engine would be a separate packet with much larger blast radius.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Spec-Scaffolded |
| **Created** | 2026-05-10 |
| **Branch** | `027-xce-research-based-refinement` |
| **Parent Packet** | `027-xce-research-based-refinement` |
| **Predecessor** | none; `000-release-cleanup` remains a non-phase scratch/cleanup folder |
| **Successor** | `../002-code-graph-hld-lld/spec.md` |
| **Source Baseline** | `external/cocoindex-code-main` plus upstream GitHub `v0.2.33` |
| **Estimated Scope** | 35-50 tracked files, ~1,000-1,500 LOC touched depending on layout choice |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`mcp-coco-index` currently has enough forked code to patch search output, but not enough local surface to own the whole MCP lifecycle. The skill's own docs say the fork started from upstream 0.2.3 and only modified dedup, path-class reranking, and mirror exclusions. Meanwhile upstream has moved through at least 30 tagged releases to `v0.2.33`, adding packaging, Docker, runtime path mapping, default embedder params, custom chunkers, CLI doctor behavior, and a broader test suite.

That partial fork creates three concrete risks. First, future phases such as intent steering and rerank clients would be built on an obsolete API surface. Second, install/update scripts still behave like a patch queue instead of an owned distribution. Third, the current repo does not include the upstream test breadth needed to safely port or reject future upstream changes.

### Purpose

Establish a complete in-repo fork of the `cocoindex-code` MCP wrapper so SpecKit owns source, packaging, runtime helpers, tests, docs, attribution, and patch history. After this phase, later CocoIndex phases should modify the local fork directly and run local verification without depending on upstream package layout assumptions.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Import the complete upstream `cocoindex-code` v0.2.33 repository surface from `external/cocoindex-code-main` into `.opencode/skills/mcp-coco-index/mcp_server/` or an explicitly documented equivalent fork root.
- Preserve and port current spec-kit fork patches: mirror exclusions, canonical resource paths, `source_realpath`, `content_hash`, `path_class`, over-fetch dedup, bounded rerank, and `rankingSignals` telemetry.
- Update package metadata from the old setuptools flat-layout fork to an owned build strategy compatible with upstream hatch/uv or a documented local alternative.
- Decide and document whether the fork root keeps upstream `src/cocoindex_code` layout or adapts to the current flat `cocoindex_code` layout.
- Bring upstream tests into the skill and add regression tests for all spec-kit patches.
- Update `scripts/install.sh`, `scripts/update.sh`, `scripts/doctor.sh`, `scripts/ensure_ready.sh`, `README.md`, `INSTALL_GUIDE.md`, `SKILL.md`, `NOTICE`, and `CHANGELOG.md` for the new ownership model.
- Add a dependency audit for the still-external `cocoindex` engine package and the `cocoindex[litellm]>=1.0.0,<1.1.0` version range.

### Out of Scope

- Vendoring or forking the transitive `cocoindex` engine package. This remains pinned/audited unless the user explicitly expands the scope.
- Implementing Phase 007 intent steering, Phase 010 rerank-client extraction, or Phase 011 memory context extras. Those phases may depend on this one, but their feature behavior remains separate.
- Changing the public MCP `search` tool contract except for preserving existing spec-kit telemetry fields.
- Running destructive `ccc reset` without an explicit verification step and user-visible evidence.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-coco-index/mcp_server/**` | Replace/merge | Full fork root for upstream v0.2.33 plus spec-kit patches |
| `.opencode/skills/mcp-coco-index/scripts/*.sh` | Modify | Install, update, doctor, and readiness workflows for complete fork |
| `.opencode/skills/mcp-coco-index/{SKILL.md,README.md,INSTALL_GUIDE.md,NOTICE,CHANGELOG.md}` | Modify | Ownership, attribution, usage, and release docs |
| `.opencode/skills/mcp-coco-index/references/*.md` | Modify | Tool reference and settings docs for v0.2.33 + spec-kit telemetry |
| `specs/system-spec-kit/027-xce-research-based-refinement/001-cocoindex-complete-fork/*` | Create | Phase plan, research, tasks, checklist, ADR, resource map |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Establish upstream v0.2.33 as the complete fork baseline | `mcp_server/` contains the full upstream source/docs/test/runtime files selected in the import manifest; import manifest cites `external/cocoindex-code-main` and upstream tag `v0.2.33` |
| REQ-002 | Preserve every current spec-kit patch | Tests prove `source_realpath`, `content_hash`, `path_class`, over-fetch dedup, canonical resource boost, and `rankingSignals` still emit after the v0.2.33 port |
| REQ-003 | Preserve local installation path | `bash .opencode/skills/mcp-coco-index/scripts/install.sh --root <repo>` installs from local source, and `ccc --version` includes a spec-kit fork identifier |
| REQ-004 | Keep MCP search API compatible | Existing MCP callers can still call `search(query, limit, offset, refresh_index, languages, paths)` and receive current spec-kit result telemetry |
| REQ-005 | Bring upstream tests under local verification | Upstream unit tests that are relevant outside Docker run locally; Docker tests are documented as optional/manual if not safe in the current environment |
| REQ-006 | Update license and notice attribution | `NOTICE`, `LICENSE`, and `CHANGELOG.md` identify upstream v0.2.33, Apache-2.0 terms, and spec-kit modifications |
| REQ-007 | Document transitive engine boundary | ADR and docs state that `cocoindex-code` is forked, while `cocoindex` engine remains a pinned dependency unless a follow-on phase expands scope |
| REQ-008 | Define rollback | Rollback restores the previous `0.2.3+spec-kit-fork.0.2.0` source tree or a tagged local snapshot and reinstalls the previous editable package |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Resolve layout choice | ADR records `src/` layout vs flat package trade-off; scripts and tests match the chosen layout |
| REQ-010 | Update update-helper workflow | `scripts/update.sh` stops treating the fork as a three-file patch queue and instead supports complete upstream diff/import review |
| REQ-011 | Cover runtime path changes | Tests or smoke checks cover `COCOINDEX_CODE_RUNTIME_DIR`, host path mapping, DB path mapping, and project-root discovery where adopted |
| REQ-012 | Keep later phases dependency-aware | Parent phase map and Phase 007/010/011 docs state dependency on the complete fork baseline where relevant |

### P2 - Nice to have

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-013 | Optional Docker support | Upstream Docker files are either imported and documented or explicitly excluded with rationale |
| REQ-014 | Local fork manifest generator | A script can compare imported upstream files, spec-kit patch overlays, and excluded files in one report |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The skill no longer says it bundles only a soft-fork of upstream 0.2.3; docs and package metadata identify the local complete fork baseline.
- **SC-002**: Running the local test subset proves upstream v0.2.33 behavior plus all spec-kit telemetry patches.
- **SC-003**: Install/doctor scripts operate only against local source and do not require PyPI `cocoindex-code`.
- **SC-004**: Later phases can modify `mcp-coco-index` without first doing an upstream catch-up migration.
- **SC-005**: The phase parent validates recursively after this phase is added and the old phases are renumbered.
- **SC-006**: Every public claim in the fork docs is traceable to local files, upstream tag data, or this phase's research.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Patch port conflicts in `indexer.py`, `query.py`, `schema.py`, `settings.py`, and protocol/server DTOs | High | Port patches as named overlays with tests for each REQ-002 field and behavior |
| Risk | Upstream packaging switch from setuptools to hatch/uv breaks current install script | Medium | Choose one layout in ADR-001, then make install/doctor scripts test the selected path |
| Risk | Local venv size remains large because `sentence-transformers` pulls heavy dependencies | Medium | Keep `[full]` optional and document slim vs full install behavior |
| Risk | Full fork still depends on external `cocoindex` engine | Medium | Pin/audit dependency and open follow-on only if total-control requirement includes engine internals |
| Risk | Docker/runtime path assets add maintenance surface | Medium | Import with tests where useful; mark Docker E2E optional if local CI cannot run Docker |
| Dependency | Upstream `cocoindex-code` v0.2.33 source | Required | Local downloaded tree exists under `external/cocoindex-code-main`; GitHub tag verified |
| Dependency | Existing spec-kit fork patches | Required | `CHANGELOG.md:9-27` and `NOTICE:16-31` define the patch list |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Flag-off search performance must not regress beyond normal upstream v0.2.33 behavior.
- **NFR-P02**: CLI startup should preserve upstream v0.2.33 lazy-load intent instead of importing the full server stack for trivial commands.

### Security
- **NFR-S01**: No install script may execute downloaded remote code at runtime; imported source is reviewed in-repo first.
- **NFR-S02**: Apache-2.0 attribution remains intact and local modifications stay auditable.

### Reliability
- **NFR-R01**: Daemon runtime path, socket, PID, and log handling must work without writing outside configured paths.
- **NFR-R02**: Index schema migration behavior must either be backward compatible or require a documented reindex step.

---

## 8. EDGE CASES

### Data Boundaries
- Existing indexes built by the old fork lack new upstream and spec-kit fields; the implementation must document whether reindex is required.
- `COCOINDEX_CODE_DIR`, `COCOINDEX_CODE_RUNTIME_DIR`, `COCOINDEX_CODE_DB_PATH_MAPPING`, and `COCOINDEX_CODE_HOST_PATH_MAPPING` can point outside the repo; scripts must print paths before mutating runtime state.
- Full upstream includes Docker and skill assets; the import manifest must classify each as imported, excluded, or deferred.

### Error Scenarios
- Patch port test fails: stop and fix the port before changing install scripts.
- Upstream test requires Docker or external provider: mark as manual/optional and keep a non-Docker local substitute.
- Dependency resolver fails on local `[full]` install: retry slim/local editable path and report the missing extra.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 35/25 | 35-50 files, package layout, tests, scripts, docs |
| Risk | 15/25 | API/runtime/persistence behavior and dependency pinning |
| Research | 18/20 | Upstream-vs-local diff, license, packaging, daemon, tests |
| Multi-Agent | 8/15 | Could split import, patch port, and docs verification if delegated later |
| Coordination | 14/15 | Later phases 007/010/011 depend on this baseline |
| **Total** | **90/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Full import drops spec-kit telemetry fields | H | M | Contract tests for every extended result field |
| R-002 | Layout migration breaks `ccc` entrypoint | H | M | Install smoke test and `ccc --help`/`ccc mcp --help` checks |
| R-003 | Upstream Docker files conflict with skill packaging | M | M | Import manifest and optional Docker verification lane |
| R-004 | Hidden dependency on old `cocoindex==1.0.0a33` remains | M | H | Dependency audit and explicit ADR boundary |

---

## 11. USER STORIES

### US-001: Own the MCP Wrapper (Priority: P0)

**As a** SpecKit maintainer, **I want** the complete `cocoindex-code` MCP wrapper in this repo, **so that** local search behavior can be patched, tested, and released without waiting on upstream.

**Acceptance Criteria**:
1. **Given** the full v0.2.33 source tree, **When** the fork is imported, **Then** local install and MCP search use repo-owned source.
2. **Given** a future patch need, **When** a maintainer edits CocoIndex code, **Then** they can test it against local upstream tests plus spec-kit patch tests.

---

### US-002: Preserve Search Semantics (Priority: P0)

**As a** downstream agent workflow, **I want** the current `search` API and telemetry to remain stable, **so that** adopting the complete fork does not break callers.

**Acceptance Criteria**:
1. **Given** an existing MCP search call, **When** it runs against the complete fork, **Then** the response includes baseline fields and spec-kit fields.
2. **Given** a mirror-path duplicate corpus, **When** search returns results, **Then** dedup and canonical resource boosts behave as before.

---

## 12. OPEN QUESTIONS

- Does "total control" include vendoring the transitive `cocoindex` engine dependency, or is owning the `cocoindex-code` MCP wrapper sufficient for Phase 001?
- Should `.opencode/skills/mcp-coco-index/mcp_server/` mirror upstream's repository root exactly, or should upstream live under `vendor/cocoindex-code/` with scripts pointing there?
- Should Docker assets be imported into the skill now or kept only in `external/` until a containerized verification lane exists?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Research**: `research.md`
- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Decision Records**: `decision-record.md`
