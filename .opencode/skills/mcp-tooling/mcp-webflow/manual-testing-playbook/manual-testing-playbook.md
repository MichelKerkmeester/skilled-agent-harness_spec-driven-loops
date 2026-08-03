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

---
## 1. OVERVIEW

Deterministic operator scenarios that verify the mcp-webflow transport against the frozen safety
contract: every scenario exercises discovery-first execution, the risk-class gate (RO/DW/DS/PB/DP
or UNKNOWN), and evidence capture. Scenarios pass only when the workflow is sound AND the safety
boundary held.

### Coverage

| Category | Scenarios | IDs |
|---|---|---|
| discovery-setup | 3 | DISCOVER-001, DISCOVER-002, DISCOVER-003 |
| read-only | 3 | READ-001, READ-002, READ-003 |
| draft-write | 2 | DRAFT-001, DRAFT-002 |
| safety-gate | 5 | SAFE-001, SAFE-002, SAFE-003, SAFE-004, SAFE-005 |
| pairing | 2 | PAIR-001, PAIR-002 |
| negative | 1 | NEG-001 |
| **TOTAL** | **16** | **16 scenarios** |

### Realistic Test Model

A realistic user request is given to the orchestrator; the orchestrator discovers tools, applies
the frozen operation class, and (where required) obtains operator confirmation. The operator
captures the process and outcome; the scenario passes only when the workflow is sound and the
safety boundary held.

### What Each Feature File Should Explain

Each scenario file documents its exact prompt, expected signals, evidence, pass/fail criteria,
and failure triage against the frozen contract and the action reference.

---
## 2. GLOBAL PRECONDITIONS

- Dedicated **test workspace + test site** (never production; never a shared workspace).
- `webflow_WEBFLOW_TOKEN` exported with least-privilege scopes (read-only baseline; `sites:write`
  only for the staging publish scenario).
- `webflow` manual verified via discovery per session; the pinned server version recorded in
  `../mcp-servers/webflow-mcp/README.md`.
- Surface identified first (remote 31-tool/220-action vs local OSS 18-module) per
  DISCOVER-003.
- No scenario may publish to `customDomains`; all publishes use `publishToWebflowSubdomain`.

---
## 3. GLOBAL EVIDENCE REQUIREMENTS

- **Discover first**: `list_tools()` in the session; drift fails closed (DISCOVER-002).
- **Classify then gate**: DS/PB/DP require operator confirmation with expected output and a
  rollback statement immediately before the call; UNKNOWN tools are never called.
- **Evidence grading**: full command transcript + tool output; before/after listings for DS;
  publish receipts for PB; run receipts for DP. Redact token-bearing output.
- **Isolation**: destructive scenarios run in their own wave, never interleaved with read
  scenarios; each destructive scenario names its rollback before execution.
- **Verdicts**: binary PASS / FAIL / SKIP (prerequisite-specific, e.g., Analyze add-on absent).
  A scenario that executes a gated operation without confirmation is FAIL regardless of outcome.

---
## 4. DETERMINISTIC COMMAND NOTATION

- Prompts and expected signals are pinned per scenario (SCENARIO CONTRACT).
- Discovery: `list_tools()` filtered to the `webflow.webflow.*` namespace.
- Doctor: `bash ../scripts/doctor.sh` (verify-only; token presence as boolean).
- Gate check: state the class and the confirmation before any `tools/call`.

---
## 5. REVIEW PROTOCOL AND RELEASE READINESS

1. All 16 scenarios executed or explicitly SKIP-recorded (with the prerequisite named).
2. Zero un-gated DS/PB/DP executions across the corpus.
3. Evidence captured per scenario; drift fixtures dated.
4. Readiness verdict issued only after the recursive packet validation and hub checks pass.

---
## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

- Wave 1 — discovery + surface reconciliation (DISCOVER-*, DISCOVER-003).
- Wave 2 — read-only (READ-001, READ-002, READ-003).
- Wave 3 — draft-write (DRAFT-001, DRAFT-002).
- Wave 4 — pairing (PAIR-001, PAIR-002).
- Wave 5 — safety gates, isolated (SAFE-001, SAFE-002, SAFE-003, SAFE-004,
  SAFE-005).
- Wave 6 — negative (NEG-001).
- Parallelize within a wave only when scenarios share no mutable state.

---
## 7. SCENARIO INDEX

| ID | Name | Category | File |
|---|---|---|---|
| DISCOVER-001 | Discovery and prefix contract | discovery-setup | [`discovery-setup/discover.md`](discovery-setup/discover.md) |
| DISCOVER-002 | Tool-surface drift fails closed | discovery-setup | [`discovery-setup/discover-drift.md`](discovery-setup/discover-drift.md) |
| DISCOVER-003 | Remote vs local surface reconciliation | discovery-setup | [`discovery-setup/remote-surface.md`](discovery-setup/remote-surface.md) |
| READ-001 | Read CMS collection | read-only | [`read-only/readcms.md`](read-only/readcms.md) |
| READ-002 | Page reads pass ungated | read-only | [`read-only/readpages.md`](read-only/readpages.md) |
| READ-003 | Analyze reports read-only | read-only | [`read-only/analyze.md`](read-only/analyze.md) |
| DRAFT-001 | Draft page settings update | draft-write | [`draft-write/draftset.md`](draft-write/draftset.md) |
| DRAFT-002 | Agent Instructions draft-write | draft-write | [`draft-write/instructions.md`](draft-write/instructions.md) |
| SAFE-001 | Staging-only single-page publish | safety-gate | [`safety-gate/pubgate.md`](safety-gate/pubgate.md) |
| SAFE-002 | Destructive action without confirmation | safety-gate | [`safety-gate/refuse.md`](safety-gate/refuse.md) |
| SAFE-003 | 429 backoff and Retry-After | safety-gate | [`safety-gate/rate-limit.md`](safety-gate/rate-limit.md) |
| SAFE-004 | run_workflow requires confirmation | safety-gate | [`safety-gate/deploygate.md`](safety-gate/deploygate.md) |
| SAFE-005 | Bulk writes confirm the selection | safety-gate | [`safety-gate/bulkgate.md`](safety-gate/bulkgate.md) |
| PAIR-001 | Designer-family change pairs with sk-design | pairing | [`pairing/pair.md`](pairing/pair.md) |
| PAIR-002 | Data-family runs transport-only | pairing | [`pairing/pair-data.md`](pairing/pair-data.md) |
| NEG-001 | Non-Webflow intent defers | negative | [`negative/non-webflow.md`](negative/non-webflow.md) |
---
## 8. AUTOMATED TEST CROSS-REFERENCE

- Hub routing benchmark: [`../benchmark/reports/2026-08-02--webflow-registration--routing-replay/`](../benchmark/reports/2026-08-02--webflow-registration--routing-replay/)
  (12/12) — covers the routing boundaries re-checked by NEG-001.
- Skill package validation: [`../../../sk-doc/sk-create-skill/scripts/validate_skill_package.py`](../../../sk-doc/sk-create-skill/scripts/validate_skill_package.py).

---
## 9. FEATURE CATALOG CROSS-REFERENCE INDEX

| Feature ID | Feature Name | Category | Feature File |
|---|---|---|---|
| READ-001 | Read CMS collection | Read-Only | `../feature-catalog/content/cms.md` |
| READ-002 | Page reads pass ungated | Read-Only | `../feature-catalog/content/site-pages-scripts.md` |
| READ-003 | Analyze reports read-only | Read-Only | `../feature-catalog/intelligence/analyze.md` |
| DRAFT-001 | Draft page settings update | Draft-Write | `../feature-catalog/content/site-pages-scripts.md` |
| DRAFT-002 | Agent Instructions draft-write | Draft-Write | `../feature-catalog/intelligence/agent-instructions.md` |
| SAFE-001 | Staging-only single-page publish | Safety Gate | `../feature-catalog/content/publish-deploy.md` |
| SAFE-002 | Destructive action without confirmation | Safety Gate | `../feature-catalog/content/publish-deploy.md` |
| SAFE-003 | 429 backoff and Retry-After | Safety Gate | `../feature-catalog/content/site-pages-scripts.md` |
| SAFE-004 | run_workflow requires confirmation | Safety Gate | `../feature-catalog/content/site-pages-scripts.md` |
| SAFE-005 | Bulk writes confirm the selection | Safety Gate | `../feature-catalog/content/cms.md` |
| PAIR-001 | Designer-family change pairs with sk-design | Judgment Pairing | `../feature-catalog/design/designer.md` |
| PAIR-002 | Data-family runs transport-only | Judgment Pairing | `../feature-catalog/design/designer.md` |
| DISCOVER-001 | Discovery and prefix contract | Discovery and Setup | `../references/action-reference.md` |
| DISCOVER-002 | Tool-surface drift fails closed | Discovery and Setup | `../references/action-reference.md` |
| DISCOVER-003 | Remote vs local surface reconciliation | Discovery and Setup | `../feature-catalog/feature-catalog.md` |
| NEG-001 | Non-Webflow intent defers | Negative | hub routing (no catalog entry) |