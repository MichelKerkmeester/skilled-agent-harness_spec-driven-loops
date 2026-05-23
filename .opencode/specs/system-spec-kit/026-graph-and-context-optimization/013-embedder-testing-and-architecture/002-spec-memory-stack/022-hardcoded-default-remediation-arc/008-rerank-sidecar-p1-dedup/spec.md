---
title: "Spec: 022/008 Rerank-Sidecar Default Consolidation"
description: "New scripts/sidecar_defaults.py module declares canonical PORT (8765), MODEL_NAME (Qwen/Qwen3-Reranker-0.6B), MODEL_REVISION (e61197ed4...). Python launchers (rerank_sidecar.py + ensure_rerank_sidecar.py) import from it. Bash (start.sh) + Node (ensure-rerank-sidecar.cjs) launchers retain inline defaults but ship explicit cross-language sync comments pointing to canonical Python source. Closes 4 P1 audit findings on port/model/revision duplication."
trigger_phrases: ["022/008 sidecar dedup"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/008-rerank-sidecar-p1-dedup"
    last_updated_at: "2026-05-23T17:45:00Z"
    last_updated_by: "main_agent"
    recent_action: "Phase 008 shipped"
    next_safe_action: "Phase 009"
    blockers: []
    key_files:
      - ".opencode/skills/system-rerank-sidecar/scripts/sidecar_defaults.py"
      - ".opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py"
      - ".opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py"
      - ".opencode/skills/system-rerank-sidecar/scripts/start.sh"
      - ".opencode/bin/lib/ensure-rerank-sidecar.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002281"
      session_id: "016-002-022-008"
      parent_session_id: null
    completion_pct: 100
    open_questions: ["P2 follow-on: add pytest/vitest invariant test asserting Python defaults equal bash + cjs literals — deferred"]
    answered_questions: ["Bash+cjs cannot import Python; pragmatic solution = canonical Python source + cross-language sync comments; invariant test deferred"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Spec: 022/008 Rerank-Sidecar Default Consolidation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Complete |
| Files changed | 1 new (sidecar_defaults.py) + 4 modified (rerank_sidecar.py, ensure_rerank_sidecar.py, start.sh, ensure-rerank-sidecar.cjs) |
| Findings closed | 4 P1 (port 8765, model name, revision hash, default consistency) |
| Wall-clock | ~20 min |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Port `8765`, model name `Qwen/Qwen3-Reranker-0.6B`, and revision hash `e61197ed4...` were duplicated as inline literals across 4 launcher surfaces. Cross-launcher drift risk: change one, forget the others; runtime would silently mismatch.

Solution: canonical Python module + cross-language sync comments. Bash + cjs cannot import Python at runtime; pragmatic mitigation is documented sync requirement + (deferred) invariant test.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- New: `scripts/sidecar_defaults.py` with `DEFAULT_PORT`, `DEFAULT_MODEL_NAME`, `DEFAULT_MODEL_REVISION` constants + docstrings citing all cross-language consumers.
- `rerank_sidecar.py:49-54`: import from sidecar_defaults via lazy try/except.
- `ensure_rerank_sidecar.py:64`: import DEFAULT_PORT; `:155-159`: import DEFAULT_MODEL_NAME + DEFAULT_MODEL_REVISION inside `_canonical_config_hash`.
- `scripts/start.sh:43,73`: add cross-language sync comments above the inline literals.
- `.opencode/bin/lib/ensure-rerank-sidecar.cjs:19,610`: add cross-language sync comments.

### Out of Scope (P2 follow-on)
- pytest/vitest invariant test asserting Python defaults equal bash + cjs literals (deferred).
- use-model.sh inline literal at line 185 (legacy convenience script; not part of dispatched runtime path).
- 9 P2 over-flags: health body byte cap, Pydantic Field caps, reaper interval — those are tuned constants without alternative correct values, not drift.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Verification |
|---|---|---|
| R1 | sidecar_defaults.py exists with 3 canonical constants | `cat sidecar_defaults.py` |
| R2 | rerank_sidecar.py + ensure_rerank_sidecar.py import from sidecar_defaults | `grep -rn "from.*sidecar_defaults" scripts/` ≥ 9 hits |
| R3 | Python ban-list: rerank_sidecar.py + ensure_rerank_sidecar.py no inline `= 8765$\|"Qwen/Qwen3-Reranker-0.6B"\|e61197...` | grep ≥ 0 production hits |
| R4 | Bash + cjs files have cross-language sync comments | `grep "022/008 cross-language sync"` ≥ 4 hits |
| R5 | All 3 syntax checks pass (Python, Bash, Node) | py_compile + bash -n + node -c |
| R6 | Strict-validate phase → exit 0 | `validate.sh --strict` |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

R1–R6 all pass. 4 P1 closed.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:approach -->
## 6. APPROACH

Main-agent direct. 1 new file + 4 modified. Cross-language sync via prominent comments since bash/cjs/python cannot share runtime imports.
<!-- /ANCHOR:approach -->

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Risk | Mitigation |
|---|---|
| Future drift between Python canonical + bash/cjs literals | Cross-language sync comments at all 4 sites; pre-commit hook + invariant test deferred to follow-on |
| Module-load circular import | Lazy `try/except` import pattern inside function bodies |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS
None.
<!-- /ANCHOR:questions -->

<!-- ANCHOR:cross-links -->
## 9. CROSS-LINKS

- Audit: f-iter008-001..004
- Predecessor: phase 006 (CocoIndex Python dedup)
<!-- /ANCHOR:cross-links -->

<!-- ANCHOR:nfr -->
## 10. NON-FUNCTIONAL REQUIREMENTS

Behavior preserved (same default values). No new dependencies.
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## 11. EDGE CASES

- `use-model.sh:32,41` example revisions in help text — historical/instructional, left alone.
- `ensure_rerank_sidecar.py:_canonical_config_hash` uses revision in a config-hash computation; lazy-import inside the function preserves the cold-start contract.
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
## 12. COMPLEXITY

LEVEL 2 with cross-language considerations. 1 new module + 4 file modifications.
<!-- /ANCHOR:complexity -->
