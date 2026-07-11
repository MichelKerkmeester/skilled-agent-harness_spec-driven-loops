---
title: "122 -- Governed ingest and scope isolation (Phase 5)"
description: "This scenario validates Governed ingest and scope isolation (Phase 5) for `122`. It focuses on Confirm governed saves require provenance and scope markers and scoped retrieval blocks cross-actor leakage."
audited_post_018: true
version: 3.6.0.17
---

# 122 -- Governed ingest and scope isolation (Phase 5)

## 1. OVERVIEW

This scenario validates Governed ingest and scope isolation (Phase 5) for `122`. It focuses on Confirm governed saves require provenance and scope markers and scoped retrieval blocks cross-actor leakage.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm governed saves require provenance and scope markers and scoped retrieval blocks cross-actor leakage.
- Real user request: `` Please validate Governed ingest and scope isolation (Phase 5) against memory_save() and tell me whether the expected signals are present: agentId,sessionId,provenanceSource,provenanceActor}` metadata 3) Query with matching scope and verify hit appears 4) Query with mismatched user/agent or tenant and verify hit is filtered out 5) Review `governance_audit` rows. ``
- Prompt: `Validate governed ingest and scope isolation against memory_save(), including provenance rejection, scoped retrieval, leakage blocking, and audit rows.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: agentId,sessionId,provenanceSource,provenanceActor}` metadata 3) Query with matching scope and verify hit appears 4) Query with mismatched user/agent or tenant and verify hit is filtered out 5) Review `governance_audit` rows
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: Save/search outputs + DB query of scoped columns + audit rows showing allow/deny decisions

---

## 3. TEST EXECUTION

### Prompt

```
Validate governed ingest and scope isolation against memory_save(), including provenance rejection, scoped retrieval, leakage blocking, and audit rows.
```

### Commands

1. Attempt `memory_save()` with `tenantId/sessionId` but missing provenance fields and verify rejection
2. Save with full `{tenantId,userId or agentId,sessionId,provenanceSource,provenanceActor}` metadata
3. Query with matching scope and verify hit appears
4. Query with mismatched user/agent or tenant and verify hit is filtered out
5. Review `governance_audit` rows

### Expected

Missing provenance rejects governed ingest; successful governed ingest persists scope metadata; mismatched scope cannot retrieve the spec-doc record; allow/deny decisions are written to `governance_audit`.

### Evidence

Attempted `memory_save()` with `tenantId/sessionId` but missing provenance fields:

```json
{
  "summary": "Error: Governed ingest rejected: provenanceSource is required for governed ingest; provenanceActor is required for governed ingest",
  "data": {
    "error": "Governed ingest rejected: provenanceSource is required for governed ingest; provenanceActor is required for governed ingest",
    "code": "E085",
    "details": {
      "requestId": "170970d8-e75e-46a7-88ca-e3961b80cf6b",
      "issues": [
        "provenanceSource is required for governed ingest",
        "provenanceActor is required for governed ingest"
      ]
    }
  },
  "hints": [
    "Supply the required governed-ingest provenance/scope fields and retry.",
    "Provide the missing tenant/provenance/actor metadata",
    "Retry memory_save"
  ]
}
```

Attempted valid governed `memory_save()` with full `{tenantId,userId,agentId,sessionId,provenanceSource,provenanceActor}` metadata in planner-only mode first; it did not perform ingest:

```json
{
  "summary": "Planner prepared a non-mutating canonical save plan.",
  "data": {
    "status": "planned",
    "filePath": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/031-manual-playbook-execution-sweep/spec.md",
    "specFolder": "system-speckit/031-manual-playbook-execution-sweep",
    "title": "Feature Specification: Manual Testing Playbook Execution Sweep",
    "plannerMode": "plan-only",
    "message": "Planner prepared a non-mutating canonical save plan."
  }
}
```

Retried valid governed `memory_save()` with `plannerMode: "full-auto"`; the governed ingest did not succeed because the selected existing spec document failed template-contract validation:

```json
{
  "summary": "Memory file does not match the required template contract.",
  "data": {
    "status": "rejected",
    "id": 0,
    "specFolder": "system-speckit/031-manual-playbook-execution-sweep",
    "title": "Feature Specification: Manual Testing Playbook Execution Sweep",
    "qualityScore": 0.773,
    "qualityFlags": [
      "Only 3 trigger phrase(s) — 4+ recommended",
      "Closing ANCHOR without opening: questions",
      "Content exceeds token budget: ~2848 tokens (budget: 2000)",
      "violates_template_contract"
    ],
    "rejectionReason": "Template contract validation failed: missing_section, missing_section, missing_section, missing_section, missing_section, missing_section",
    "warnings": [
      "Anchor \"questions\" closes without a matching opening tag",
      "Manual fallback save mode detected; standard generate-context template markers are missing."
    ],
    "message": "Memory file does not match the required template contract."
  },
  "hints": [
    "Rejected saves do not mutate the memory index",
    "Review quality issues and retry the save"
  ]
}
```

Retried valid governed `memory_save()` with `skipPreflight: true`; MCP returned:

```text
MCP error -32001: backend recycled; retry
```

Checked Spec Memory runtime status after the retry:

```text
plugin_id=mk-spec-memory
enabled=true
disabled_reason=none
cache_ttl_ms=5000
max_brief_chars=2400
max_cache_entries=200
runtime_ready=false
node_binary=node
bridge_timeout_ms=3000
cli_timeout_ms=2500
bridge_path=[spec-memory-bridge]
last_bridge_status=skipped
last_error_code=CONNECT_ECONNREFUSED__TMP_MK_SPEC_MEMORY_DAEMON_IPC_SOCK
last_duration_ms=26
bridge_invocations=10
continuity_lookups=9
cache_entries=0
cache_hits=0
cache_misses=9
cache_hit_rate=0
warm_status=skipped
warm_error=CONNECT_ECONNREFUSED__TMP_MK_SPEC_MEMORY_DAEMON_IPC_SOCK
warm_route=warm_probe
warm_retryable=true
warm_exit_code=75
```

Attempted CLI fallback for valid governed `memory_save()`; it was blocked by stale build output:

```text
@spec-kit/mcp-server dist is stale. Run: cd .opencode/skills/system-spec-kit/mcp_server && npm run build
```

Verified `governance_audit` exists:

```text
CREATE TABLE governance_audit (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      decision TEXT NOT NULL,
      memory_id INTEGER,
      logical_key TEXT,
      tenant_id TEXT,
      user_id TEXT,
      agent_id TEXT,
      session_id TEXT,
      reason TEXT,
      metadata TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
CREATE INDEX idx_governance_audit_action
      ON governance_audit(action, decision, created_at DESC);
CREATE INDEX idx_governance_audit_scope
      ON governance_audit(tenant_id, user_id, agent_id, session_id);
```

Queried scoped audit rows for `manual-playbook-tenant-122` / `manual-playbook-session-122`:

```text
id   action       decision  memory_id  logical_key  tenant_id                   user_id                     agent_id                     session_id                   reason                                            created_at         
---  -----------  --------  ---------  -----------  --------------------------  --------------------------  ---------------------------  ---------------------------  ------------------------------------------------  -------------------
292  memory_save  deny                              manual-playbook-tenant-122  manual-playbook-user-allow  manual-playbook-agent-allow  manual-playbook-session-122  provenanceSource is required for governed ingest  2026-07-02 22:28:56
```

Queried `memory_index` for the same governed scope/provenance markers:

```text
(no output)
```

### Pass / Fail

- **BLOCKED**: Missing provenance rejection and deny audit row were observed, but valid governed ingest could not complete because the selected existing spec document failed template-contract validation, MCP recycled/unavailable during the preflight-skipped retry, and the CLI fallback was blocked by stale `@spec-kit/mcp-server` dist output; therefore matching-scope retrieval, mismatched-scope isolation, and allow audit rows could not be verified.

### Failure Triage

Inspect the governed save validation path, scope-filtering logic, and `governance_audit` writes if provenance or isolation behavior regresses.

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [governance/hierarchical-scope-governance-governed-ingest-retention-and-audit.md](../../feature_catalog/governance/hierarchical-scope-governance-governed-ingest-retention-and-audit.md)

---

## 5. SOURCE METADATA

- Group: Governance
- Playbook ID: 122
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `governance/governed-ingest-and-scope-isolation-phase-5.md`
