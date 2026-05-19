---
title: "Implementation Plan: 023F Upstream cocoindex-code Rebase Spike"
description: "Compare the local cocoindex-code fork against upstream v0.2.33, apply cheap compatible wins, and produce a phased rebase plan."
trigger_phrases:
  - "023F"
  - "upstream rebase plan"
  - "cocoindex-code delta"
importance_tier: "high"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/023f-upstream-rebase-spike"
    last_updated_at: "2026-05-19T20:22:26Z"
    last_updated_by: "codex"
    recent_action: "Planned upstream drift spike"
    next_safe_action: "Complete final verification"
    blockers: []
    key_files:
      - "research/upstream-sweep.md"
      - "research/delta-classification.md"
      - "research/rebase-plan.md"
    session_dedup:
      fingerprint: "sha256:1ab56d8f63d272161c3c47e9ffcaac06a39ec765edf4195cd6c6cd573a512d64"
      session_id: "023f-upstream-rebase-spike"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 023F Upstream cocoindex-code Rebase Spike

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3.11, OpenCode MCP server |
| **Framework** | CocoIndex SDK, Typer CLI, pytest |
| **Storage** | SQLite vec0 plus local FTS5 hybrid index |
| **Testing** | pytest, ruff, spec-kit strict validator |

### Overview
The plan is evidence-first: query upstream releases and source, classify local drift, then import only changes that are mechanical and verified. The implementation surface stays limited to `pyproject.toml`, Svelte/Vue file patterns, and one regression test; the larger upstream API work is handed to 023A1/A2/A3.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented.
- [x] Success criteria measurable.
- [x] Dependencies identified: GitHub API, PyPI metadata, local `.venv`.

### Definition of Done
- [x] Full pytest passes from `.opencode/skills/mcp-coco-index/mcp_server`.
- [x] Ruff passes for changed mcp-coco-index files.
- [x] Spec validation passes with `--strict`.
- [ ] Commit contains only intended 023F packet files and allowed mcp-coco-index files. Blocked by sandbox: `.git/index.lock` cannot be created because `.git` is not writable.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Research spike with scoped patch.

### Key Components
- **Upstream `cocoindex-code` v0.2.33**: direct source of module and release deltas.
- **Main CocoIndex SDK**: source of language splitter support and dependency migration pressure.
- **Local fork**: preserves hybrid retrieval, path-class metadata, mirror dedup, CodeRankEmbed/Jina integration, and code-aware chunking.
- **023F packet docs**: durable handoff for 023A1/A2/A3/023B.

### Data Flow
GitHub release/source metadata informs research tables. Research tables drive the rebase plan. Only low-risk deltas become local code changes; everything else becomes future packet guidance.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `pyproject.toml` local extra | Controls optional local embedding stack. | Pin `sentence-transformers==5.4.1`. | `pip index versions sentence-transformers`; full pytest. |
| `settings.DEFAULT_INCLUDED_PATTERNS` | Decides default indexed file globs. | Add `.svelte` and `.vue`. | `tests/test_settings_patterns.py`; upstream release `v0.2.32`; SDK detection check. |
| `cocoindex_code/chunkers/grammars.py` | Local tree-sitter registry. | Unchanged; upstream `cocoindex-code` has no analog grammar registry. | Diff and upstream file listing. |
| `shared.py` / embedder params | Local prompt registry and embedder factory. | Unchanged in 023F; Phase B import target. | Upstream `embedder_params.py` and tests documented. |
| `query.py` / retrieval stack | Local hybrid/rerank/mirror behavior. | Preserve local. | Delta classification marks local-only wins. |

Required inventories:
- Same-class producers: `rg -n "indexing_params|query_params|dimensions|svelte|vue" src tests README.md pyproject.toml` in upstream clone.
- Consumers of changed symbols: `rg -n "DEFAULT_INCLUDED_PATTERNS|include_patterns|svelte|vue" tests cocoindex_code`.
- Matrix axes: upstream source, local source, dependency pin, language defaults, future packet ownership.
- Algorithm invariant: per-side embedder params may alter prompts/input type, but output vector dimension must remain model-wide and identical between indexing and query.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Locate pre-bound 023F packet.
- [x] Load system-spec-kit, sk-code, mcp-coco-index, and cli-codex skill context.
- [x] Clone upstream read-only to `/private/tmp`.

### Phase 2: Implementation
- [x] Enumerate upstream releases and source layout.
- [x] Classify local/upstream deltas.
- [x] Add Svelte/Vue include patterns and tests.
- [x] Pin `sentence-transformers==5.4.1`.
- [x] Write research handoff docs.

### Phase 3: Verification
- [x] Targeted tests for pattern change.
- [x] Full pytest.
- [x] Ruff.
- [x] Spec validation.
- [ ] Commit.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | New default include patterns plus existing config tests | `pytest tests/test_settings_patterns.py tests/test_config.py -q` |
| Full suite | Entire mcp-coco-index test surface | `.venv/bin/python -m pytest tests/ -q`: `189 passed in 17.38s` |
| Lint | Changed mcp-coco-index files | `.venv/bin/python -m ruff check pyproject.toml cocoindex_code/settings.py tests/test_settings_patterns.py`: clean |
| Documentation | Level 2 spec packet | `validate.sh <023F> --strict`: passed with 0 errors and 0 warnings |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| GitHub API/CLI | External | Green | Release/source sweep would fall back to curl or clone. |
| PyPI index | External | Green | Sentence-transformers latest comparison would be unverified. |
| Local `.venv` | Internal | Green | Required for pytest and ruff. |
| CocoIndex SDK stable bump | External | Deferred | Needs Phase A compatibility run. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Full pytest, ruff, or runtime compatibility failure caused by scoped changes.
- **Procedure**: Revert `pyproject.toml`, `settings.py`, and `tests/test_settings_patterns.py`; keep research docs if they remain accurate.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) -> Phase 2 (Core) -> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Gate 3 E, upstream access | Core |
| Core | Setup evidence | Verify |
| Verify | Core changes and docs | Commit |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 20 minutes |
| Core Implementation | Medium | 2-3 hours |
| Verification | Medium | 30-60 minutes |
| **Total** | | **3-4 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data migrations.
- [x] No daemon protocol changes.
- [x] No SDK pin bump.

### Rollback Procedure
1. Revert the three mcp-coco-index implementation files.
2. Re-run targeted tests.
3. Update implementation summary with rollback reason if needed.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Not applicable.
<!-- /ANCHOR:enhanced-rollback -->
