ROLE: Senior memory-systems research analyst, DEEP second pass. READ-ONLY. Do NOT write/edit/create files or run code. Spec folder: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/008-caura-memclaw-fleet-memory-teachings (pre-approved; skip Gate 3).

TARGET: caura-memclaw (multi-tenant, Postgres/pgvector). CONSUMER: Spec Kit Memory (LOCAL single-user, SQLite + vector store). MemClaw is Apache-2.0 — design inspiration only. Judge transferability under the single-user/local/SQLite vs multi-tenant/Postgres mismatch.
Path: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/027-xce-research-based-refinement/external/caura-memclaw-main

PRIOR PASS (iteration 001) ALREADY FOUND (do not just repeat — go DEEPER and verify): tiered dedup (exact content-hash; semantic bands with LLM judge; review queue snapshots; fast-mode advisory near_duplicate_of); idempotency split into response-level Idempotency-Key (request-hash, pending sentinel, 422 on same-key/different-body) + row-level bulk X-Bulk-Attempt-Id with partial unique index + ON CONFLICT; enrichment is merge-only (agent-provided fields win; deferred enrichment snapshots agent fields); metadata PATCH merges by default; keystone setter does a TOCTOU scope check so a low-trust agent can't narrow-overwrite a broader rule.

YOUR ANGLE (iteration 013): DEEP write-safety internals. Verify and detail, with exact file:line, the IMPLEMENTATION of: (a) the dedup_review queue flow end-to-end; (b) idempotency-key claim/poll race handling; (c) merge_enrichment_fields precedence + deferred-enrichment snapshot; (d) the keystone TOCTOU overwrite guard. Then translate to a single-user SQLite store.
Read deeply (cap ~18 files): core-api/src/core_api/pipeline/steps/write/*, core-api/src/core_api/middleware/idempotency.py, core-api/src/core_api/services/memory_service.py, common/models/{idempotency,dedup_review,memory}.py, core-storage-api/src/core_storage_api/services/postgres_service.py (idempotency + dedup sections), core-api/src/core_api/mcp_server.py (keystone setter).

DELIVERABLE — markdown with EXACTLY these sections (cite file:line):
## Verified mechanism (deep)
Implementation-level detail of (a)-(d), confirming or correcting the prior pass.
## Concrete Spec-Kit-native adoption sketch
For the 1-2 highest-value teachings (target 027/002 write-safety + 027/006 reconciliation): give a CONCRETE design — SQLite table/column shape, the write-gate algorithm in pseudocode, and the "auto may not overwrite manual/constitutional" rule. Keep it minimal (no tenancy, no LLM judge by default).
## Verdict table
Each teaching: Claim · Maps-to · Verdict (ADOPT/ADAPT/REJECT/DEFER) · Risk · Confidence.
## Negative knowledge (confirmed)
What of (a)-(d) is Postgres/fleet-specific and must NOT be ported.

Then output EXACTLY one final line, valid compact JSON:
DELTA_JSON: {"iteration":"013","focus":"DEEP write-safety internals + SQLite adoption sketch","findingsCount":<int>,"newInfoRatio":<0.0-1.0>,"topVerdicts":["ADOPT: ...","ADAPT: ..."],"sources":["path:line"]}
