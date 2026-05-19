---
title: "Implementation Plan: 020 Deep Review P1/P2 Remediation"
description: "Plan for scoped remediation of all nine P1 findings from 019, using minimal code changes, targeted regression tests, and packet-local documentation."
trigger_phrases:
  - "020 P1 remediation plan"
  - "mcp-coco-index deep review remediation"
  - "hybrid rerank nomic defaults remediation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/020-deep-review-p1-p2-remediation"
    last_updated_at: "2026-05-19T18:17:10Z"
    last_updated_by: "codex"
    recent_action: "Remediation implementation and validation completed."
    next_safe_action: "Main agent may review the diff and commit."
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0201020102010201020102010201020102010201020102010201020102010201"
      session_id: "020-p1-remediation-codex"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 020 Deep Review P1/P2 Remediation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3, shell, Markdown |
| **Framework** | mcp-coco-index MCP server and Spec Kit docs |
| **Storage** | Existing code index DB is not mutated |
| **Testing** | pytest, ruff, bash syntax check, static `rg` audits |

### Overview
This plan remediates nine P1 findings by confirming each cited defect, applying the smallest viable fix, and adding focused tests where behavior changes. Documentation fixes are treated as production behavior because they drive operator rollback, reproduction, and default-configuration decisions.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 019 devin and codex review reports read before edits.
- [x] Gate 3 spec folder established by operator.
- [x] Sequential-thinking MCP attempted before each P1; inline five-point preflights recorded because MCP calls were cancelled.

### Definition of Done
- [x] All nine P1s fixed and documented.
- [x] Targeted pytest or static verification passes for each P1.
- [x] Full `pytest tests/ -v` passes from `mcp_server`.
- [x] Ruff passes for `cocoindex_code tests/`.
- [x] Strict spec validation passes for this 020 packet.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Surgical remediation across existing components. No new runtime subsystem is introduced.

### Key Components
- **Settings/config defaults**: Fresh daemon settings and ADR env documentation must resolve to the shipped nomic and hybrid defaults.
- **Jina reranker**: Default reranker must tolerate malformed operator env.
- **Daemon index path**: Failed project indexing must propagate to existing failure response logic.
- **Hybrid query scoring**: Additive heuristic boosts must be scaled relative to calibrated RRF.
- **Benchmark harness and analyzer**: Evidence scripts must preserve embedder override and exclude failed run JSON.
- **Operator docs**: README, SKILL, and install guide must match current default behavior.
- **Spec evidence**: RCA and ADR-022 preserve why decisions were made.

### Data Flow
Runtime changes stay inside existing request paths: settings creation reads `_DEFAULT_MODEL`; Jina rerank reads env via bounded parser; daemon index errors flow into `update_index()` failure response; hybrid ranking computes scaled additives after RRF. Evidence-script changes affect offline benchmark reporting only.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `settings.default_user_settings()` | Produces fresh daemon settings | Use `_DEFAULT_MODEL` | `test_settings.py` asserts value. |
| `Config.from_env()` docs | Operator rollback contract | Keep production env names and test ADR alignment | `test_config.py` parses ADR-020 and asserts env effect. |
| `JinaRerankerAdapter.rerank()` | Default reranker adapter | Use bounded int parser | `test_rerankers_jina_v3.py` malformed env test. |
| `ProjectRegistry._run_index()` | Background index runner | Re-raise update failure | `test_daemon.py` failure response test. |
| `run-phase2-smoke.sh` | Benchmark reproduction harness | Honor external embedder env | `bash -n` and static env override audit. |
| `rerank-matrix-analyze.py` | Benchmark verdict generator | Skip failed and timeout-signature runs | `test_rerank_matrix_analyze.py`. |
| README, SKILL, INSTALL guide | User-facing defaults | Align all shipped defaults | Static `rg` stale-claim audit. |
| `_hybrid_ranked_result()` | Hybrid scoring | Scale additive boosts | `test_dedup_mirrors.py` strong RRF lead test. |
| ADR-019 and RCA evidence | Query expansion explanation | Add root-cause addendum | `test_query_expansion.py` and evidence file. |

Required inventories:
- Same-class producer checks used `rg` for old defaults, stale env names, and obsolete reranker claims.
- Changed symbol consumers were checked by targeted tests for each modified runtime path.
- Matrix axes: env validity, index success/failure, run JSON success flag, timeout signature, path class, canonical resource, and RRF score gap.
- Algorithm invariant: calibrated RRF remains the primary hybrid ordering signal; heuristic boosts may break close ties but must not swamp a strong RRF lead.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Source Confirmation
- [x] Read 019 review reports and cited source lines.
- [x] Record five-point preflight for each P1 because sequential-thinking MCP was cancelled.

### Phase 2: Core Remediation
- [x] P1-A fresh settings default fixed.
- [x] P1-B env documentation and ADR-code alignment test fixed.
- [x] P1-C Jina env parsing fixed.
- [x] P1-D index failure reporting fixed.
- [x] P1-E benchmark harness override fixed.
- [x] P1-F matrix analyzer failure filtering fixed.
- [x] P1-G operator docs aligned.
- [x] P1-H hybrid boost scaling fixed.
- [x] P1-I query expansion RCA added.

### Phase 3: Verification
- [x] Targeted tests and static checks run for each P1.
- [x] Full pytest suite run.
- [x] Ruff run.
- [x] Strict spec validation run.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Settings, config, reranker, daemon, hybrid ranking, query expansion | pytest |
| Script | Shell harness syntax | `bash -n` |
| Analyzer | Mixed valid and failed JSON evidence | pytest with temp files |
| Docs | Stale default claims | `rg` static audit |
| Packet | L2 spec folder shape | strict Spec Kit validation |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/python` | Internal venv | Green | Required for pytest and ruff. |
| 019 review reports | Evidence | Green | Read-only source of P1 findings. |
| Spec Kit validator | Internal script | Green | Required before completion claim. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Full pytest, ruff, or strict validation fails after remediation and cannot be corrected within scoped files.
- **Procedure**: Revert only this packet's changed files by targeted inverse patch or git checkout selected paths after explicit operator approval. Do not touch unrelated dirty worktree files.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Source confirmation -> scoped fixes -> targeted tests -> full validation -> commit by main agent
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Source confirmation | Operator P1 list | Scoped fixes |
| Scoped fixes | Source confirmation | Targeted tests |
| Targeted tests | Scoped fixes | Full validation |
| Full validation | Targeted tests and docs | Main-agent commit |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Source confirmation | Medium | 1 hour |
| Core remediation | High | 4-6 hours |
| Verification and docs | Medium | 1-2 hours |
| **Total** | | **6-9 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No database reset or index rebuild performed.
- [x] Runtime changes covered by targeted tests.
- [x] Operator docs updated with shipped defaults.

### Rollback Procedure
1. If ranking behavior regresses, restore `_HYBRID_PATH_CLASS_SHIFT` to `0.05` and `_HYBRID_CANONICAL_RESOURCE_BOOST` to `0.10`, then rerun `test_dedup_mirrors.py`.
2. If daemon failure signaling breaks consumers, remove the `_run_index()` re-raise and add a schema-compatible failure path instead.
3. If doc wording conflicts with later production defaults, update docs and ADR alignment test together.
4. Rerun targeted tests, full pytest, ruff, and strict validation.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->
