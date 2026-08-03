---
title: "mcp-webflow: Manual Testing Playbook"
description: "Deterministic manual scenarios for the mcp-webflow transport: discovery and surface reconciliation, read-only, draft-write, safety gates (DS/PB/DP), sk-design pairing, and negative classes — 16 scenarios."
trigger_phrases:
  - "webflow playbook"
  - "webflow manual testing"
  - "webflow scenarios"
version: 1.2.0.0
---

# mcp-webflow: Manual Testing Playbook

## 1. OVERVIEW

Deterministic operator scenarios that verify the mcp-webflow transport against the frozen safety
contract: every scenario exercises discovery-first execution, the risk-class gate (RO/DW/DS/PB/DP
or UNKNOWN), and evidence capture. Scenarios pass only when the workflow is sound AND the safety
boundary held.

### Coverage

| Category | Scenarios | IDs |
|---|---|---|
| discovery-setup | 3 | DISCOVER-001, DISCOVER-DRIFT-001, REMOTE-SURFACE-001 |
| read-only | 3 | READCMS-001, READPAGES-001, ANALYZE-001 |
| draft-write | 2 | DRAFTSET-001, INSTRUCTIONS-001 |
| safety-gate | 5 | PUBGATE-001, REFUSE-001, RATELIMIT-001, DEPLOYGATE-001, BULKGATE-001 |
| pairing | 2 | PAIR-001, PAIR-DATA-001 |
| negative | 1 | NONWEBFLOW-001 |
| **TOTAL** | **16** | **16 scenarios** |

## 2. GLOBAL PRECONDITIONS

- Dedicated **test workspace + test site** (never production; never a shared workspace).
- `webflow_WEBFLOW_TOKEN` exported with least-privilege scopes (read-only baseline; `sites:write`
  only for the staging publish scenario).
- `webflow` manual verified via discovery per session; the pinned server version recorded in
  `../mcp-servers/webflow-mcp/README.md`.
- Surface identified first (remote 31-tool/220-action vs local OSS 18-module) per
  REMOTE-SURFACE-001.
- No scenario may publish to `customDomains`; all publishes use `publishToWebflowSubdomain`.

## 3. EXECUTION POLICY AND EVIDENCE

- **Discover first**: `list_tools()` in the session; drift fails closed (DISCOVER-DRIFT-001).
- **Classify then gate**: DS/PB/DP require operator confirmation with expected output and a
  rollback statement immediately before the call; UNKNOWN tools are never called.
- **Evidence grading**: full command transcript + tool output; before/after listings for DS;
  publish receipts for PB; run receipts for DP. Redact token-bearing output.
- **Isolation**: destructive scenarios run in their own wave, never interleaved with read
  scenarios; each destructive scenario names its rollback before execution.
- **Verdicts**: binary PASS / FAIL / SKIP (prerequisite-specific, e.g., Analyze add-on absent).
  A scenario that executes a gated operation without confirmation is FAIL regardless of outcome.

## 4. DETERMINISTIC COMMAND NOTATION

- Prompts and expected signals are pinned per scenario (SCENARIO CONTRACT).
- Discovery: `list_tools()` filtered to the `webflow.webflow.*` namespace.
- Doctor: `bash ../scripts/doctor.sh` (verify-only; token presence as boolean).
- Gate check: state the class and the confirmation before any `tools/call`.

## 5. REVIEW PROTOCOL AND RELEASE READINESS

1. All 16 scenarios executed or explicitly SKIP-recorded (with the prerequisite named).
2. Zero un-gated DS/PB/DP executions across the corpus.
3. Evidence captured per scenario; drift fixtures dated.
4. Readiness verdict issued only after the recursive packet validation and hub checks pass.

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

- Wave 1 — discovery + surface reconciliation (DISCOVER-*, REMOTE-SURFACE-001).
- Wave 2 — read-only (READCMS-001, READPAGES-001, ANALYZE-001).
- Wave 3 — draft-write (DRAFTSET-001, INSTRUCTIONS-001).
- Wave 4 — pairing (PAIR-001, PAIR-DATA-001).
- Wave 5 — safety gates, isolated (PUBGATE-001, REFUSE-001, RATELIMIT-001, DEPLOYGATE-001,
  BULKGATE-001).
- Wave 6 — negative (NONWEBFLOW-001).
- Parallelize within a wave only when scenarios share no mutable state.

## 7. SCENARIO INDEX

| ID | Name | Category | File |
|---|---|---|---|
| DISCOVER-001 | Discovery and prefix contract | discovery-setup | [`discovery-setup/discover-001.md`](discovery-setup/discover-001.md) |
| DISCOVER-DRIFT-001 | Tool-surface drift fails closed | discovery-setup | [`discovery-setup/discover-drift-001.md`](discovery-setup/discover-drift-001.md) |
| REMOTE-SURFACE-001 | Remote vs local surface reconciliation | discovery-setup | [`discovery-setup/remote-surface-001.md`](discovery-setup/remote-surface-001.md) |
| READCMS-001 | Read CMS collection | read-only | [`read-only/readcms-001.md`](read-only/readcms-001.md) |
| READPAGES-001 | Page reads pass ungated | read-only | [`read-only/readpages-001.md`](read-only/readpages-001.md) |
| ANALYZE-001 | Analyze reports read-only | read-only | [`read-only/analyze-001.md`](read-only/analyze-001.md) |
| DRAFTSET-001 | Draft page settings update | draft-write | [`draft-write/draftset-001.md`](draft-write/draftset-001.md) |
| INSTRUCTIONS-001 | Agent Instructions draft-write | draft-write | [`draft-write/instructions-001.md`](draft-write/instructions-001.md) |
| PUBGATE-001 | Staging-only single-page publish | safety-gate | [`safety-gate/pubgate-001.md`](safety-gate/pubgate-001.md) |
| REFUSE-001 | Destructive action without confirmation | safety-gate | [`safety-gate/refuse-001.md`](safety-gate/refuse-001.md) |
| RATELIMIT-001 | 429 backoff and Retry-After | safety-gate | [`safety-gate/rate-limit-001.md`](safety-gate/rate-limit-001.md) |
| DEPLOYGATE-001 | run_workflow requires confirmation | safety-gate | [`safety-gate/deploygate-001.md`](safety-gate/deploygate-001.md) |
| BULKGATE-001 | Bulk writes confirm the selection | safety-gate | [`safety-gate/bulkgate-001.md`](safety-gate/bulkgate-001.md) |
| PAIR-001 | Designer-family change pairs with sk-design | pairing | [`pairing/pair-001.md`](pairing/pair-001.md) |
| PAIR-DATA-001 | Data-family runs transport-only | pairing | [`pairing/pair-data-001.md`](pairing/pair-data-001.md) |
| NONWEBFLOW-001 | Non-Webflow intent defers | negative | [`negative/non-webflow-001.md`](negative/non-webflow-001.md) |

## 8. AUTOMATED TEST CROSS-REFERENCE

- Hub routing benchmark: `../benchmark/reports/2026-08-02--webflow-registration--routing-replay/`
  (12/12) — covers the routing boundaries re-checked by NONWEBFLOW-001.
- Skill package validation: `../sk-doc/sk-create-skill/scripts/validate_skill_package.py ../mcp-webflow`.

## 9. FEATURE CATALOG CROSS-REFERENCE INDEX

| Scenario | Catalog card |
|---|---|
| READCMS-001, BULKGATE-001 | [`../feature-catalog/cms.md`](../feature-catalog/cms.md) |
| PUBGATE-001, REFUSE-001 | [`../feature-catalog/publish-deploy.md`](../feature-catalog/publish-deploy.md) |
| PAIR-001, PAIR-DATA-001 | [`../feature-catalog/designer.md`](../feature-catalog/designer.md) |
| READPAGES-001, DRAFTSET-001 | [`../feature-catalog/site-pages-scripts.md`](../feature-catalog/site-pages-scripts.md) |
| INSTRUCTIONS-001 | [`../feature-catalog/agent-instructions.md`](../feature-catalog/agent-instructions.md) |
| ANALYZE-001 | [`../feature-catalog/analyze.md`](../feature-catalog/analyze.md) |
| REMOTE-SURFACE-001 | [`../feature-catalog/feature-catalog.md`](../feature-catalog/feature-catalog.md) |
| DISCOVER-001, DISCOVER-DRIFT-001 | [`../references/action-reference.md`](../references/action-reference.md) |
