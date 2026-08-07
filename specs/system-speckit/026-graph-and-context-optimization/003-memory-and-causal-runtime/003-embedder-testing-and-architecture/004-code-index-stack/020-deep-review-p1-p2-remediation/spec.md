---
title: "Spec: 020 Deep Review P1/P2 Remediation"
description: "Remediate all nine P1 findings from the 019 deep-review packet across mcp-coco-index production code, tests, operator docs, benchmark harnesses, and packet evidence."
trigger_phrases:
  - "020 deep review P1 remediation"
  - "mcp-coco-index P1 remediation"
  - "CodeRankEmbed Jina v3 hybrid RRF defaults"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/020-deep-review-p1-p2-remediation"
    last_updated_at: "2026-05-19T18:17:10Z"
    last_updated_by: "codex"
    recent_action: "Completed all nine P1 remediations from the 019 deep-review reports and validated the packet."
    next_safe_action: "Main agent may review the diff and commit."
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/settings.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers_jina_v3.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py"
      - ".opencode/skills/mcp-coco-index/README.md"
      - ".opencode/skills/mcp-coco-index/SKILL.md"
      - ".opencode/skills/mcp-coco-index/INSTALL_GUIDE.md"
    session_dedup:
      fingerprint: "sha256:0200200200200200200200200200200200200200200200200200200200200200"
      session_id: "020-p1-remediation-codex"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Gate 3 spec folder was preanswered by the operator."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: 020 Deep Review P1/P2 Remediation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-19 |
| **Spec Folder** | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/020-deep-review-p1-p2-remediation/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 019 deep-review packet found nine P1 defects across the mcp-coco-index stack: stale defaults, docs that contradicted production behavior, unsafe env parsing, misleading success reporting, benchmark evidence hazards, overpowering hybrid boosts, and missing RCA for query-expansion regression. These findings affect fresh installs, operator rollback instructions, reranker stability, benchmark reproducibility, and trust in search quality evidence.

### Purpose
Fix all nine P1 findings with minimal code and documentation changes, add regression coverage for every code change, and preserve clear evidence for the main agent to commit after validation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- P1-A through P1-I remediation exactly as listed by the operator.
- Regression tests for every production or analyzer code change.
- Operator documentation alignment for shipped defaults.
- Packet-local RCA evidence and ADR-022 for the hybrid boost scaling decision.
- L2 packet docs and strict spec validation.

### Out of Scope
- P2 findings from 019.
- Re-running `ccc reset`, `ccc index`, or mutating the live benchmark index.
- Broad refactors of query, rerank, daemon, or config architecture.
- Git commit creation.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/settings.py` | Modify | Fresh settings default uses `_DEFAULT_MODEL`. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers_jina_v3.py` | Modify | Bounded parsing for Jina max-doc-chars env. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py` | Modify | Index update exceptions propagate to failure response path. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py` | Modify | Hybrid-only path and canonical boosts scaled down. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/*.py` | Modify/Create | Targeted regression coverage for P1 code fixes. |
| `.opencode/skills/mcp-coco-index/{README.md,SKILL.md,INSTALL_GUIDE.md}` | Modify | Shipped default claims updated. |
| `.opencode/specs/.../011-rerank-model-fit-investigation/research/phase2-bench/*` | Modify | Harness and analyzer evidence handling fixed. |
| `.opencode/specs/.../002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md` | Modify | ADR-019 addendum for query-expansion RCA. |
| `.opencode/specs/.../020-deep-review-p1-p2-remediation/*` | Create/Modify | Packet docs, checklist, ADR-022, RCA evidence. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Fix all nine P1 findings from 019. | P1-A through P1-I each have source confirmation, a scoped fix, and implementation-summary evidence. |
| REQ-002 | Do not modify 019 deep-review reports. | Git diff has no changes under the 019 review report files. |
| REQ-003 | Do not re-run `ccc reset` or `ccc index`. | Verification uses pytest, ruff, shell syntax checks, and static audits only. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Add regression tests for code changes. | Targeted pytest files pass for settings, config, Jina reranker, daemon, analyzer, hybrid ranking, and query expansion. |
| REQ-005 | Align operator docs with shipped defaults. | README, SKILL, and INSTALL guide name hybrid ON, rerank ON, Jina v3, nomic CodeRankEmbed, and RRF `K=60,V=0.9,F=0.5`. |
| REQ-006 | Document hybrid boost scaling. | Packet-local `decision-record.md` contains ADR-022. |
| REQ-007 | Produce L2 packet docs. | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `description.json`, and `graph-metadata.json` exist and validate. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All nine P1 sections in `implementation-summary.md` include defect, fix, files changed, tests, and evidence.
- **SC-002**: Full mcp-coco-index pytest suite passes from `mcp_server`.
- **SC-003**: Ruff passes for `cocoindex_code` and `tests`.
- **SC-004**: Strict spec validation passes for this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Hybrid ranking behavior | Boost scale changes could alter marginal ties. | Keep vector-only path unchanged; add regression asserting strong RRF preference remains top-1. |
| Risk | Env parsing behavior | Invalid env vars could hide operator mistakes. | Reuse existing bounded parser that logs warnings while falling back safely. |
| Risk | Worktree noise | Existing unrelated changes could obscure diff review. | Touch only scoped files and report that unrelated dirty files were left untouched. |
| Dependency | Python test environment | Verification requires `.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/python`. | Use the requested venv for every pytest and ruff invocation. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Do not add runtime overhead outside the existing query scoring, rerank parsing, and daemon error paths.
- **NFR-P02**: Keep analyzer filtering linear over run JSON files.

### Reliability
- **NFR-R01**: Invalid Jina max-doc-chars env must not crash the default reranker.
- **NFR-R02**: Index failures must surface as failed responses instead of false success.

### Operability
- **NFR-O01**: Operator docs and ADR rollback env names must match production `Config.from_env()` behavior.
- **NFR-O02**: Benchmark harnesses must preserve external embedder overrides.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Env Boundaries
- Malformed `COCOINDEX_RERANK_JINA_MAX_DOC_CHARS`: logs warning and falls back to `6000`.
- ADR-documented RRF env vars: parsed by `Config.from_env()` with expected numeric values.

### Evidence Boundaries
- Analyzer input with `success=false`: excluded and listed as skipped evidence.
- Analyzer input with `hit_rate=0.0` and `latency_ms.mean > 25000`: excluded as timeout signature.

### Ranking Boundaries
- Lower-RRF canonical implementation hit gets scaled boost only; a strong RRF lead remains top-1.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Nine P1s across code, tests, docs, and evidence scripts. |
| Risk | 15/25 | Defaults, query ranking, and daemon failure signaling touch production behavior. |
| Research | 12/20 | Required source-report reading and RCA from rerank-score evidence. |
| **Total** | **45/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
