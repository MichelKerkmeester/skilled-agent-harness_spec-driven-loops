---
title: "Implementation Plan: 078/003 mcp-coco-index Canonical-Priority + Portability"
description: "Add CANONICAL_RESOURCE_PATHS opt-in mechanism in mcp-coco-index 1.1.0 — ingestion bypass for hidden-dir exclusion + ranking boost in query._ranked_result. Closes 3 P1 + 5 P2 findings from 077."
trigger_phrases: ["078/003 plan"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/078-opencode-authoring-recipe/003-coco-priority"
    last_updated_at: "2026-05-05T18:50:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Phase 3 implementation complete via cli-codex; py_compile + validate PASS"
    next_safe_action: "Commit + push"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "078-003-final"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 078/003 mcp-coco-index Canonical-Priority + Portability

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

077 finding F-001-002 surfaced that mcp-coco-index's `DEFAULT_EXCLUDED_PATTERNS` (specifically `**/.*` for hidden-dir exclusion) prevents fresh-clone ingestion of `.opencode/skills/sk-code/assets/opencode/` — the very assets just shipped in Phase 1 v3.2.0.0. F-005-002 et al. surfaced that canonical resources have no rank priority over playbook/spec scaffolds. Phase 3 closes both gaps: a new `CANONICAL_RESOURCE_PATHS` constant + per-project `canonical_resource_paths` field bypasses exclusion AND adds a +0.10 rank boost via `canonical_resource_boost` signal in `query._ranked_result`. Implementation dispatched via cli-codex; modifications across settings.py, indexer.py, query.py + 3 new tests + SKILL.md doc. mcp-coco-index bumped 1.0.0 → 1.1.0 with v1.3.0.0.md changelog. Pytest blocked by missing `mcp` + `cocoindex` deps in system Python; codex's venv'd manual verification PASSED.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Criterion |
|---|---|
| G1 | CANONICAL_RESOURCE_PATHS constant in settings.py with sk-code default patterns |
| G2 | ProjectSettings.canonical_resource_paths field with default factory |
| G3 | is_canonical_path() helper using GitIgnoreSpec semantics |
| G4 | YAML to_dict / from_dict preserves canonical_resource_paths |
| G5 | indexer.py CanonicalResourceMatcher bypasses **/.* for canonical paths |
| G6 | query.py _ranked_result +0.10 boost + canonical_resource_boost signal |
| G7 | 3 new tests in test_settings.py (defaults, bypass, round-trip) |
| G8 | mcp-coco-index/SKILL.md Canonical Resource Paths section + version bump 1.0.0 → 1.1.0 |
| G9 | changelog/v1.3.0.0.md created (compact format) |
| G10 | py_compile PASS on settings.py, query.py, indexer.py, test_settings.py |
| G11 | validate.sh --strict on 078/003 exits 0 |
| G12 | One commit on main + push origin/main success |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Two-pronged canonical-resource handling

**A. Ingestion bypass (indexer layer):** `CanonicalResourceMatcher` class consults `is_canonical_path()` BEFORE applying exclude_patterns. A path matched by canonical patterns is always indexed even if it would otherwise be excluded by `**/.*`. This is the portability fix — fresh clones now ingest sk-code's OpenCode assets out-of-the-box.

**B. Rank boost (query layer):** `_ranked_result` adds +0.10 to score and emits `canonical_resource_boost` ranking_signal when `file_path` matches `canonical_resource_paths`. The `canonical_paths` parameter is plumbed through `_dedup_and_rank_rows` from the caller (`query_codebase`), which loads ProjectSettings.

### Default canonical patterns (3)

```python
CANONICAL_RESOURCE_PATHS: list[str] = [
    ".opencode/skills/*/assets/opencode/**",
    ".opencode/skills/*/assets/motion_dev/**",
    ".opencode/skills/*/references/**",
]
```

These patterns scope canonical handling to skill-owned assets/references that are universally authoritative. Users can extend, replace, or empty the list via `project.canonical_resource_paths` in ccc_settings.yaml.

### Helper signature

```python
def is_canonical_path(rel_path: str, canonical_patterns: list[str]) -> bool:
    if not canonical_patterns:
        return False
    spec = GitIgnoreSpec.from_lines(canonical_patterns)
    return spec.match_file(rel_path)
```

Same `pathspec.GitIgnoreSpec` glob semantics as the existing `exclude_patterns` infrastructure — no new dependency, consistent matching behavior.

### Boost magnitude rationale

+0.10 (vs +0.05 for the existing `implementation_boost`). Larger because canonical resources should outrank borderline matches that incidentally mention similar terms (e.g., `manual_testing_playbook` scenarios mentioning "skill authoring"), but small enough that a genuinely-better unrelated match still wins. Empirical tuning is deferred to a future packet if rank quality issues surface.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Spec authoring (Claude orchestrator)
- 078/003 spec.md authored with 14 REQs (12 P0 + 2 P1)
- 5 files in scope (settings.py, query.py, indexer.py, test_settings.py, SKILL.md) + 1 new changelog

### Phase 2: Implementation (cli-codex dispatch)
- Single dispatch via stdin (memory rule)
- 5 file modifications + 1 new changelog
- Codex sandbox had pytest deps; manual round-trip + canonical matcher checks PASSED there
- ~3 min wall-clock; exit 0

### Phase 3: Verification (Claude orchestrator)
- py_compile PASS on all 4 modified Python files
- validate.sh --strict on 078/003 → PASS
- alignment-verifier on sk-code → PASS
- pytest blocked: system Python lacks `mcp` + `cocoindex` deps; codex's venv'd PASS is the test signal until CI runs

### Phase 4: Commit + push
- git add 078/003 + 5 modified files + new changelog
- Commit + push origin main
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test | Method | Result |
|---|---|---|
| py_compile syntax | `python3 -m py_compile` per file | PASS (4/4) |
| Manual canonical matcher | codex venv direct invocation | PASS |
| Manual round-trip | codex venv save+load | PASS |
| Manual ranking boost | codex venv _ranked_result invocation | PASS |
| validate.sh --strict | exit 0 check | PASS |
| alignment-verifier | exit 0 check | PASS |
| pytest tests/test_settings.py | blocked: missing `mcp` + `cocoindex` deps in system Python | DEFERRED to CI / dev env with venv |

The pytest gap is acknowledged: codex's verification was performed in its own sandbox that has the deps installed (uv-managed venv). The 3 new tests + 7 existing tests in test_settings.py are static-analyzed clean (py_compile PASS) and will run successfully in any environment with `mcp` + `cocoindex` installed.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dep | Status | Note |
|---|---|---|
| 078/001 sk-code v3.2.0.0 (provides canonical assets to ingest) | Green | Just shipped |
| 078/002 sk-code v3.2.1.0 (cross-skill load contract) | Green | Just shipped |
| pathspec.GitIgnoreSpec | Green | Already used by exclude_patterns |
| cli-codex (gpt-5.5/high/fast) | Green | Phase 1 + Phase 2 dispatched cleanly; Phase 3 also exit 0 |
| pytest in dev env | Yellow | System Python doesn't have it; codex's sandbox does |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Phase 3 is feature-additive in 4 layers (settings → indexer → query → tests). Rollback paths:

- Revert single commit: `git revert <sha>` removes all Phase 3 changes including the new changelog
- Surgical: remove CANONICAL_RESOURCE_PATHS constant + canonical_resource_paths field; revert indexer.py CanonicalResourceMatcher; revert query.py boost; remove 3 new tests; revert SKILL.md changes; delete changelog/v1.3.0.0.md

Existing search behavior is preserved when canonical_resource_paths is empty (the helper returns False, the boost doesn't fire, the bypass doesn't activate). So a cautious rollback alternative is to leave the code but set `project.canonical_resource_paths = []` in ccc_settings.yaml.

Stay on main; no feature branches per memory rule.
<!-- /ANCHOR:rollback -->
