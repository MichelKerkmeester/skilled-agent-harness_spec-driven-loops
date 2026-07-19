---
title: "Research - Complete CocoIndex MCP Fork"
description: "Research basis for Phase 005: upstream v0.2.33, current spec-kit 0.2.3 soft fork, implication matrix, import boundary, dependency and verification needs."
trigger_phrases:
  - "cocoindex complete fork research"
  - "cocoindex-code v0.2.33 research"
  - "mcp-coco-index upstream delta"
importance_tier: "important"
contextType: "research"
---
# Feature Research: Complete CocoIndex MCP Fork

<!-- SPECKIT_TEMPLATE_SOURCE: research | v1.0 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

- **Research ID**: RESEARCH-027-001
- **Feature/Spec**: `spec.md`
- **Status**: Complete for planning
- **Date Started**: 2026-05-10
- **Date Completed**: 2026-05-10
- **Researcher(s)**: Codex
- **Reviewers**: User review pending
- **Last Updated**: 2026-05-10

**Related Documents**:
- Spec: `spec.md`
- ADR: `decision-record.md`
- Resource map: `resource-map.md`
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:file-organization -->
## FILE ORGANIZATION

- Research findings live in this file.
- Implementation plans live in `plan.md` and `tasks.md`.
- Import and touched-path ledger lives in `resource-map.md`.
- No scratch experiments were created during planning.
<!-- /ANCHOR:file-organization -->

---

<!-- ANCHOR:investigation-report -->
## 2. INVESTIGATION REPORT

### Request Summary

The user wants the current partial CocoIndex fork replaced with a complete in-repo fork so the whole MCP wrapper is under local control. They requested this as Phase 1 of `027-xce-research-based-refinement`, with existing phases renumbered and a proper `/spec_kit:plan` style research pass before implementation.

### Current Behavior

The local skill is a partial soft fork. `mcp_server/pyproject.toml:1-10` identifies a soft fork of upstream `cocoindex-code` at `0.2.3+spec-kit-fork.0.2.0`, and `NOTICE:16-31` says the Rust-based `cocoindex` package remains a PyPI dependency. The current source inventory has 15 Python package files and 2 tests, while upstream v0.2.33 has 18 package files and 15 tests.

### Key Findings

1. **Upstream is newer than the local fork**: GitHub marks `v0.2.33` as latest, released 2026-05-08, with PR #164 lazy-load CLI work. The downloaded `external/cocoindex-code-main/src/cocoindex_code/cli.py` matches the raw v0.2.33 file.
2. **The local fork is not a full repository fork**: local `mcp_server/pyproject.toml:28-40` pins `cocoindex[litellm]==1.0.0a33` and bundles `sentence-transformers` directly. Upstream `pyproject.toml:24-36` uses `cocoindex[litellm]>=1.0.0,<1.1.0`, adds `questionary`, and moves local embeddings behind extras at `pyproject.toml:38-58`.
3. **Important upstream modules are missing locally**: upstream adds `_daemon_paths.py`, `chunking.py`, `embedder_defaults.py`, `embedder_params.py`, and `litellm_embedder.py`. `settings.py:119-130` adds custom chunker mappings, while `_daemon_paths.py:16-60` separates runtime socket/PID/log paths from user settings.
4. **Spec-kit patches are narrow and portable**: local `CHANGELOG.md:9-27` lists the patch set: mirror exclusions, chunk identity, path-class taxonomy, over-fetch dedup, bounded rerank, and result telemetry. These must become patch overlays on v0.2.33, not ad hoc edits on stale 0.2.3 files.
5. **Full control has a dependency boundary**: forking `cocoindex-code` does not fork the underlying `cocoindex` engine. Upstream still depends on `cocoindex[litellm]>=1.0.0,<1.1.0`; current local still depends on `cocoindex[litellm]==1.0.0a33`. That is acceptable for Phase 005 only if documented and pinned.

### Recommendations

**Primary Recommendation**:
- Import the full upstream v0.2.33 `cocoindex-code` repository surface into the skill's `mcp_server/` as the new fork root, then reapply spec-kit patches as named overlays with tests. This maximizes local control of the MCP wrapper while keeping the transitive engine dependency bounded.

**Alternative Approaches**:
- Keep the partial fork and manually backport only needed upstream files. Faster initially, but it repeats the current drift problem and leaves tests/runtime docs incomplete.
- Vendor the transitive `cocoindex` engine too. Stronger total-control story, but it explodes scope into a separate engine fork with native/runtime implications.
<!-- /ANCHOR:investigation-report -->

---

<!-- ANCHOR:executive-overview -->
## 3. EXECUTIVE OVERVIEW

The complete fork is justified because the local code is no longer just a few commits behind; it is structurally behind. Upstream's package layout, runtime path helpers, embedding parameter model, Docker support, CLI doctor behavior, and test coverage have moved on. Later phases that touch query expansion, reranking, or memory-context examples would otherwise be implemented against the wrong base.

The safest approach is a two-layer import. Layer one is upstream v0.2.33 as a clean complete baseline. Layer two is the spec-kit patch overlay, carried forward as local modifications with tests and changelog entries. This gives maintainers a clear answer to "what came from upstream" and "what did we change".

### Architecture Diagram

```text
external/cocoindex-code-main (v0.2.33)
        |
        v
.opencode/skills/mcp-coco-index/mcp_server/   complete fork root
        |
        +-- upstream source, docs, tests, docker/runtime assets
        +-- spec-kit patch overlay: dedup, path_class, canonical boost, telemetry
        +-- local scripts: install, update, doctor, ensure_ready
        v
ccc CLI + ccc mcp search tool used by agents
```

### Research Sources

| Source Type | Description | Link/Reference | Credibility |
|-------------|-------------|----------------|-------------|
| Upstream release | GitHub `v0.2.33`, latest, released 2026-05-08 | `https://github.com/cocoindex-io/cocoindex-code/releases/tag/v0.2.33` | High |
| Downloaded source | Local v0.2.33 tree | `external/cocoindex-code-main/` | High |
| Local fork docs | Current spec-kit patch history | `.opencode/skills/mcp-coco-index/CHANGELOG.md` and `NOTICE` | High |
| Local code | Current fork package and scripts | `.opencode/skills/mcp-coco-index/mcp_server/` | High |
<!-- /ANCHOR:executive-overview -->

---

<!-- ANCHOR:core-architecture -->
## 4. CORE ARCHITECTURE

### System Components

#### Component 1: Fork Root
**Purpose**: Own the complete `cocoindex-code` MCP wrapper in repo.

**Responsibilities**:
- Keep upstream source, tests, package metadata, docs, Docker/runtime helpers, and skill assets available locally.
- Expose `ccc` and `ccc mcp` from local source, not PyPI `cocoindex-code`.

**Dependencies**:
- Python 3.11+.
- `cocoindex[litellm]` engine package, pinned/audited by this phase.

#### Component 2: Spec-Kit Patch Overlay
**Purpose**: Preserve behavior that upstream does not have.

**Responsibilities**:
- Add canonical path/resource handling.
- Add chunk identity fields and path class taxonomy.
- Add over-fetch dedup and ranking telemetry.

#### Component 3: Verification Harness
**Purpose**: Prove upstream behavior plus local patches.

**Responsibilities**:
- Run upstream unit tests that are safe locally.
- Add regression tests for local telemetry and dedup behavior.
- Separate Docker/provider-dependent tests from default local tests.

### Integration Points

**External Systems**:
- **GitHub upstream**: source and release tags only; no runtime dependence after import.
- **PyPI `cocoindex` engine**: still external in this phase; pinned/audited.

**Internal Modules**:
- **Skill scripts**: install/update/doctor/ensure_ready must point at the new fork root.
- **SpecKit advisor/docs**: skill guidance must describe complete-fork ownership and current telemetry.
<!-- /ANCHOR:core-architecture -->

---

<!-- ANCHOR:technical-specifications -->
## 5. TECHNICAL SPECIFICATIONS

### Upstream Delta Inventory

| Surface | Current Local | Upstream v0.2.33 | Planning Impact |
|---------|---------------|------------------|-----------------|
| Package files | 15 Python files | 18 Python files | Import new modules and port patch overlay |
| Tests | 2 test files | 15 test files | Adopt default local subset and mark Docker/provider tests |
| Build system | setuptools flat package | hatchling/hatch-vcs, `src/` layout, uv lock | ADR must choose layout and script changes |
| Runtime paths | user settings dir doubles as runtime dir | `_daemon_paths.py` supports runtime dir override | Adopt to avoid socket/log issues |
| Embedding params | minimal model/provider/device | indexing/query params + curated defaults | Adopt and test provider behavior |
| Chunking | built into indexer | public custom chunker registry | Import and document extension point |
| Docker | absent in skill fork | Dockerfile/compose/entrypoint | Import or explicitly defer |

### Verification Needs

- `python -m pytest` for imported upstream tests that do not need Docker or live providers.
- Patch tests for `source_realpath`, `content_hash`, `path_class`, `dedupedAliases`, `uniqueResultCount`, `raw_score`, and `rankingSignals`.
- Install smoke: local editable install, `ccc --help`, `ccc --version`, `ccc mcp --help` or equivalent non-daemon probe.
- Optional daemon/search smoke with isolated `COCOINDEX_CODE_DIR` and `COCOINDEX_CODE_RUNTIME_DIR`.
<!-- /ANCHOR:technical-specifications -->
