ROLE: Senior memory-systems research analyst, DEEP second pass. READ-ONLY. Do NOT write/edit/create files or run code. Spec folder: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/008-caura-memclaw-fleet-memory-teachings (pre-approved; skip Gate 3).

TARGET: caura-memclaw (multi-tenant, Postgres/pgvector). CONSUMER: Spec Kit Memory (LOCAL single-user, SQLite) — 027/004 = causal-edge tombstones (all active causal-edge delete paths must tombstone before hard-delete); 027/005 = deterministic metadata-edge promoter (promote validated parent/child/parent-chain frontmatter relations into causal edges, avoid duplicating already-wired manual links). MemClaw is Apache-2.0 — design inspiration only.
Path: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/027-xce-research-based-refinement/external/caura-memclaw-main

PRIOR PASSES ALREADY FOUND (go DEEPER + verify): (086) separate entity-relationship side-channel from causal memory edges; deterministic validation guards before metadata-edge promotion; bounded entity-graph recall boost with fallbacks; DEFER co-occurrence-inferred relations lacking tombstone/provenance. (087) tombstone/grace first then hard-delete; sticky lifecycle audit with effective-retention snapshot; idempotent lifecycle predicates for retries.

YOUR ANGLE (iteration 016): DEEP relationship + lifecycle/tombstone internals -> design 027/004 + 027/005. Verify with exact file:line: how MemClaw soft-deletes/tombstones (deleted_at? status? grace window?) and ensures the delete is idempotent + audited; how supersession links old->new; whether relations/edges carry provenance (generated vs manual) so a re-promotion does not duplicate; how (if at all) it validates a relationship before persisting it.
Read deeply (cap ~18 files): common/models/{memory,entity,document,lifecycle_audit}.py, common/events/lifecycle_handlers.py, common/events/lifecycle_purge_request.py, core-storage-api/src/core_storage_api/services/postgres_service.py (soft-delete/supersede/purge SQL), core-operations/src/core_operations/* (retention), common/enrichment/schema.py (relation extraction + validation).

DELIVERABLE — markdown with EXACTLY these sections (cite file:line):
## Verified mechanism (deep)
Tombstone vs hard-delete + grace + idempotency + audit; supersession; edge/relation provenance + validation. Confirm/correct 086/087.
## Concrete Spec-Kit-native adoption sketch (027/004 + 027/005)
CONCRETE designs: (004) a causal-edge tombstone lifecycle for SQLite — the edge-state columns, the tombstone-before-hard-delete algorithm, idempotent re-run; (005) a deterministic metadata-edge promotion guard — what "validated" means, how provenance (generated-by=promoter vs manual) prevents duplicate promotion.
## Verdict table
Each teaching: Claim · Maps-to (027/004, 027/005, or new) · Verdict · Risk · Confidence.
## Negative knowledge (confirmed)
Fleet/scale relationship/lifecycle machinery not to port.

Then output EXACTLY one final line, valid compact JSON:
DELTA_JSON: {"iteration":"016","focus":"DEEP relationship + lifecycle/tombstone -> 027/004+005 design","findingsCount":<int>,"newInfoRatio":<0.0-1.0>,"topVerdicts":["ADAPT: ...","ADOPT: ..."],"sources":["path:line"]}
