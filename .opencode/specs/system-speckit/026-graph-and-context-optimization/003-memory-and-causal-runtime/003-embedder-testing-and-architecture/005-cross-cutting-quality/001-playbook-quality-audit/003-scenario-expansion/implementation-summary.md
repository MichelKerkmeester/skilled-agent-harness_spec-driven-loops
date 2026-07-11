---
title: "Implementation Summary: 017/003 Scenario expansion"
description: "Authored 15 new + 3 repaired scenarios; B-RETRY validation against live MCP shipped 10/18 PASS with root-cause table"
trigger_phrases: ["017/003 summary", "scenario expansion results", "playbook validation"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/001-playbook-quality-audit/003-scenario-expansion"
    last_updated_at: "2026-05-17T18:25:00Z"
    last_updated_by: "main_agent"
    recent_action: "B-RETRY (b855znbsv) validated 18 scenarios — 10/18 PASS, 8 FAIL classified"
    next_safe_action: "Optional follow-on: handler fixes for 16/282 + 16/283 implementation gaps"
    blockers: []
    key_files:
      - "evidence/017-scenario-validation.jsonl"
      - "evidence/017-scenario-validation-report.md"
      - "evidence/scenario-expansion-summary.csv"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000001017003"
      session_id: "017-003-scenario-expansion"
      parent_session_id: "017-playbook-quality-audit"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Implementation Summary: 017/003 Scenario expansion

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|-------|-------|
| Status | Complete |
| Authored scenarios | 15 new + 3 repaired (commit `61ec86cfc` + `ec9b5bae7`) |
| Validation commit | `915fbb42e` (B-RETRY codex `b855znbsv`) |
| Result | 10/18 PASS, 8 FAIL (with root-cause table) |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

**15 new scenarios** filling tool-coverage gaps identified by 017/001 + 017/002:

| Category | Scenarios | Tools covered |
|---|---|---|
| discovery | 015, 016, 017 | session_bootstrap / session_resume / session_health |
| maintenance | 279 | memory_retention_sweep dry-run |
| analysis | 027 | memory_causal_stats edge case |
| evaluation | 028, 029 | eval_run_ablation + eval_reporting_dashboard |
| tooling-and-scripts | 281, 282, 283 | **embedder_list / embedder_set / embedder_status (NEW MCP tools from 016/003)** |
| governance | 274, 275, 276, 277, 278 | council_graph_* + deep_loop_graph_* + governed-ingest lifecycle |

**3 repaired scenarios** (cat-24 calibration, commit `ec9b5bae7`):
- 402-synonymy-across-vocabularies — example display fixed
- 408-compound-concept-synthesis — example display fixed
- 409-llm-made-memory-recall — calibrated 8/10 threshold (matches 016/004 empirical evidence)
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

Codex `bb2bzcco3` scaffolded the packet + authored scenarios using the same `manual_testing_playbook` template (§1 OVERVIEW, §2 CONTRACT, §3 EXECUTION, §4 SOURCE FILES). Reproducible audit infrastructure shipped as `evidence/generate-playbook-quality-audit.js` (~55KB).

B-RETRY (codex `b855znbsv`) executed each scenario against the live MCP server (nomic-embed-text-v1.5 active per `vec_metadata`) and wrote per-scenario PASS/FAIL rows to `evidence/017-scenario-validation.jsonl`.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

- **Run validation against live MCP** (not source-mode probe) to surface real handler gaps
- **Hard-halt only on infra failures**, not schema mismatches — pre-classified expected FAILs (06/027, 07/028, 16/282, 16/283, 17/278) marked with root cause and CONTINUE
- **Active-embedder source of truth = `vec_metadata` table**, NOT the DB filename (the original B dispatch `bj27at02x` false-halted on filename misread; B-RETRY corrected this)
- **Implementation gaps surfaced for follow-on packet**: `embedder_set` needs `dryRun`, `embedder_status` needs active pointer surface
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## 5. VERIFICATION

| Scenario | Result | Root Cause |
|---|---|---|
| 03/015, 03/016, 03/017, 04/279, 07/029, 16/281, 17/274-277 | 10/10 PASS | NONE |
| 06/027 memory_causal_stats | FAIL | SCENARIO_BUG (no `scope` param in live schema) |
| 07/028 eval_run_ablation | FAIL | SCENARIO_BUG (no dataset selector in live schema) |
| 17/278 governed-ingest cancel | FAIL | SCENARIO_BUG (`/tmp` path rejected by memory-roots policy) |
| 16/282 embedder_set dry-run | FAIL | **IMPLEMENTATION_GAP** (handler missing `dryRun` flag) |
| 16/283 embedder_status active pointer | FAIL | **IMPLEMENTATION_GAP** (returns idle-job state only, not active embedder metadata) |
| 24/402, 24/408, 24/409 | FAIL | FIXTURE_DRIFT (**later root-caused: rescue layer was not firing due to stale dist** — resolved by 016/004 D-RETRY `e964ba505`) |

**Root-cause distribution**: NONE 10, SCENARIO_BUG 3, IMPLEMENTATION_GAP 2, FIXTURE_DRIFT 3, THRESHOLD_TOO_TIGHT 0.

**Strict validation**: `validate.sh --strict` on 017/003 PASSED.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

- **24/402+408+409 FAIL was misclassified as FIXTURE_DRIFT at B-RETRY time** — the actual root cause was the rescue layer not firing because mcp_server `dist` had not been rebuilt since 11:58 UTC. After the 16:27 rebuild and D-RETRY, the rescue layer reaches 8/10 on cat-24/409 again. See 016/004 implementation-summary §7 POST-PUBLISH VERIFICATION.
- **Implementation gaps for follow-on**:
  - `embedder_set` needs a `dryRun: true` path that validates provider availability + reports projected actions without queuing reindex work
  - `embedder_status` needs to expose `vec_metadata.active_embedder_name` + dim alongside job state
- **Scenario fixes for follow-on**:
  - 06/027 contract update: global causal stats (no `scope` param) OR add scoped handler
  - 07/028 contract update: remove dataset selector OR add handler-supported empty fixture
  - 17/278 contract update: use an allowed memory-root path OR document the policy rejection as the expected outcome
<!-- /ANCHOR:limitations -->
