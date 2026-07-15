---
title: "Review Plan: Hub-doc conformance + reality-alignment audit of cli-external + mcp-tooling hubs"
description: "How the bounded deep-review of the cli-external + mcp-tooling hub docs was run: two dimensions (sk-doc-conformance, reality-alignment), max 10 iterations, verify-every-claim, durable review/ artifacts, findings handed to the 002 remediation plan."
trigger_phrases:
  - "hub doc conformance review plan"
  - "cli-external mcp-tooling doc audit plan"
importance_tier: "normal"
contextType: "review"
_memory:
  continuity:
    packet_pointer: "sk-doc/016-hub-doc-conformance-fixes/001-hub-doc-conformance-review"
    last_updated_at: "2026-07-11T09:14:17.440Z"
    last_updated_by: "claude"
    recent_action: "Review plan authored; dimensions and verify-first protocol fixed"
    next_safe_action: "Execute the 002 remediation plan against the flagged hub docs"
    blockers: []
    key_files:
      - ".opencode/specs/sk-doc/016-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/deep-review-findings-registry.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "hub-doc-conformance-review"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Review Plan: Hub-doc conformance + reality-alignment audit of cli-external + mcp-tooling hubs

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Work type** | Bounded deep-review (read-only audit, no doc edits) |
| **Dimensions** | `sk-doc-conformance` + `reality-alignment` |
| **Executor** | `gpt-5.6-sol-fast`, ≤10 iterations, stop policy = max-iterations |
| **Evidence** | Live CLI/MCP surfaces + sk-doc create-skill templates |

### Overview
This packet audits the `cli-external` and `mcp-tooling` hub docs — feature catalogs, manual testing playbooks, references, vendored `mcp-servers/**/README.md`, and SKILL.md prose — against two axes: conformance to the sk-doc create-skill templates, and reality-alignment against the live CLI/MCP surfaces those docs claim to describe. Every reality claim (CLI flag, MCP tool, transport/auth config, agent route, meta-count, link/path) is checked against live truth rather than assumed. The output is a ranked, deduped finding set a downstream remediation packet can dispatch without re-deriving it.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Review dimensions and iteration budget fixed
- [x] Hub-doc surface enumerated (READMEs, SKILLs, catalogs, playbooks, references, vendored READMEs)
- [x] Live CLI/MCP reachability confirmed for the verify-every-claim rule

### Definition of Done
- [x] Verdict recorded with ranked P0/P1/P2 findings
- [x] Durable run artifacts persisted under `review/`
- [x] Findings partitioned for a collision-free downstream remediation plan

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Deep-review loop — per-iteration dimension pass over a scoped doc slice, each finding checked against live reality, deltas + prompts + dispatch receipts externalized to `review/`.

### Key Components
- **Findings registry**: `review/deep-review-findings-registry.json` — the authoritative deduped finding set
- **Per-iteration deltas + prompts**: telemetry for each of the ≤10 iterations
- **Dimension checks**: `sk-doc-conformance` (template shape) and `reality-alignment` (claim vs live CLI/MCP truth)

### Data Flow
1. Enumerate the hub-doc slice for the iteration
2. For each reality claim, resolve live truth (CLI probe, MCP `tool_info()`/`list_tools()`, template diff)
3. Record a finding with severity + evidence when the doc diverges from reality or template
4. Dedup findings into the registry
5. Carry the deduped counts + finding IDs into the 002 remediation plan

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Fix dimensions (`sk-doc-conformance`, `reality-alignment`) and iteration budget (≤10)
- [x] Enumerate the cli-external + mcp-tooling hub-doc surface
- [x] Confirm live CLI/MCP reachability for verification

### Phase 2: Core Review
- [x] Iterate the dimension passes across the doc slices
- [x] Verify every reality claim against live truth, not the doc's assertion
- [x] Record ranked findings and dedup them into the registry

### Phase 3: Verification
- [x] Verdict recorded (FAIL) with distinct P0/P1/P2 counts
- [x] Artifacts durable under `review/`
- [x] Handoff set partitioned into collision-free work-streams for 002

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Reality-alignment | CLI flags, MCP tools, transport/auth, agent routes, meta-counts | Live CLI probes, Code Mode `tool_info()`/`list_tools()` |
| Conformance | Doc shape vs sk-doc create-skill templates | Template diff, schema checks on vendored READMEs |
| Link/path | Dead links, stale paths | Grep + on-disk resolution |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Live CLI/MCP surfaces | External | Green | Cannot verify reality claims |
| sk-doc create-skill templates | Internal | Green | Cannot check conformance |
| `review/` run artifacts | Internal | Green | No durable finding source for 002 |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Not applicable — this packet is a read-only review and edits no hub doc.
- **Procedure**:
  1. No rollback needed; the review produces artifacts under `review/` only.
  2. If a finding is later disputed, correct it in the 002 remediation plan, not here.

<!-- /ANCHOR:rollback -->
