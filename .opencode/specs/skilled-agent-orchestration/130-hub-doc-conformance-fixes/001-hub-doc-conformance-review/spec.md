---
title: "Deep Review: Hub-doc conformance + reality-alignment audit of cli-external + mcp-tooling hubs"
description: "Bounded deep-review (dimensions: sk-doc-conformance + reality-alignment; max 10 iterations) auditing the cli-external and mcp-tooling hub docs — feature catalogs, testing playbooks, references, vendored server READMEs, SKILL.md prose — against the sk-doc create-skill templates and live CLI/MCP reality. Verdict: FAIL. Findings feed the 002 remediation plan."
trigger_phrases:
  - "hub doc conformance review"
  - "cli-external mcp-tooling doc audit"
  - "130-hub-doc-conformance-fixes/001-hub-doc-conformance-review"
importance_tier: "normal"
contextType: "review"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/130-hub-doc-conformance-fixes/001-hub-doc-conformance-review"
    last_updated_at: "2026-07-11T09:14:17.440Z"
    last_updated_by: "claude"
    recent_action: "Deep-review complete (FAIL verdict); findings feed the 002 remediation plan"
    next_safe_action: "Execute the 002 remediation plan against the flagged hub docs"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/deep-review-findings-registry.json"
      - ".opencode/skills/cli-external/SKILL.md"
      - ".opencode/skills/mcp-tooling/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "hub-doc-conformance-review"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Deep Review: Hub-doc conformance + reality-alignment audit of cli-external + mcp-tooling hubs

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-10 |
| **Branch** | `skilled/v4.0.0.0` |
| **Packet Type** | Deep-review (phase child) |
| **Verdict** | FAIL |
| **Successor** | 002-hub-doc-conformance-fixes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `cli-external` and `mcp-tooling` hub docs — feature catalogs, manual testing playbooks, references, vendored `mcp-servers/**/README.md` files, and SKILL.md prose — may have drifted from the live CLI/MCP surfaces they document and from the sk-doc create-skill templates. Drift here silently mis-teaches: dead flags, retired tools, wrong transport/auth config, forbidden agent routes, dead links, wrong meta-counts, and schema-failing vendored READMEs.

### Purpose
Run a bounded deep-review that checks every reality claim in those hub docs against live CLI/MCP truth and against the sk-doc templates, and record ranked findings a remediation packet can act on without re-deriving them.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `cli-external` hub docs: `README.md`, `SKILL.md`, and the `cli-claude-code` / `cli-opencode` mode READMEs + SKILLs
- `mcp-tooling` hub docs: `README.md`, `SKILL.md`, feature catalogs, manual testing playbooks, references, and vendored `mcp-servers/**/README.md`
- Conformance to sk-doc create-skill templates + reality-alignment against live CLI/MCP surfaces

### Out of Scope
- Editing the hub docs (remediation is 002's scope — this packet only reviews)
- SKILL.md routing blocks / INTENT_SIGNALS / RESOURCE_MAP / mode-registry (coordinated separately)
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Run both review dimensions (`sk-doc-conformance`, `reality-alignment`) under a bounded budget. | Max 10 iterations, stop policy = max-iterations; both dimensions exercised across the hub-doc slices, recorded in the `review/` run artifacts. |
| REQ-002 | Verify every reality claim against live truth rather than the doc's assertion. | Each finding cites file:line + a live probe (CLI flag, MCP tool via `tool_info()`/`list_tools()`, transport/auth, agent route, meta-count, or on-disk link/path). |
| REQ-003 | Record ranked, deduped findings as durable artifacts a follow-up packet can dispatch from. | Findings ranked P0/P1/P2 and deduped into `review/deep-review-findings-registry.json`; per-iteration deltas + prompts + dispatch receipts persisted under `review/`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Cover all six failure themes so the downstream plan can partition by theme. | reality-drift, agent-routing, dead links/stale paths, playbook meta-claims, schema-failing vendored READMEs, and test-scenario logic bugs are each represented by at least one finding ID. |
| REQ-005 | Hand off a partition a downstream packet can remediate as collision-free work-streams. | Findings partitioned into file-disjoint streams consumed by `002-hub-doc-conformance-fixes` without re-derivation. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **Verdict recorded:** **FAIL** — 102 P0 / 5 P1 / 4 P2 raw findings (67 P0 / 4 P1 / 2 P2 distinct after dedup) across six themes: reality-drift, agent-routing errors, dead links / stale paths, wrong playbook meta-claims, schema-failing vendored READMEs, and test-scenario logic bugs.
- **Artifacts durable:** full run state, per-iteration deltas + prompts, and dispatch receipts persisted under `review/`.
- **Handoff clean:** findings partitioned so a downstream packet can remediate them as parallel, collision-free work-streams (delivered as `002-hub-doc-conformance-fixes`).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- The findings registry snapshot in `review/` reflects run telemetry; the authoritative ranked finding counts are the deduped totals above, carried into the 002 plan.
- Remediation is a separate packet — this review changes no hub doc itself, so its value is realized only once 002's plan is executed.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

All review-scoping questions were resolved at close; remediation-policy questions (vendored-README rebuild vs exempt, fix-all reality-drift, SKILL.md routing out of scope) were answered in the `002-hub-doc-conformance-fixes` plan.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Review artifacts**: `review/` (strategy, state, findings registry, per-iteration deltas + prompts, dispatch receipts)
- **Remediation plan**: `../002-hub-doc-conformance-fixes/`
- **Parent Spec**: `../spec.md`
