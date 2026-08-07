ROLE: ADVERSARIAL verifier. Your job is to REFUTE, not confirm. Default position: "this should NOT be adopted as-is." Only let a teaching survive if the evidence is real AND it genuinely improves a single-user local store AND it is not already planned. READ-ONLY. Do NOT write/edit/create files or run code. Spec folder: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/008-caura-memclaw-fleet-memory-teachings (pre-approved; skip Gate 3).

TARGET (verify against its real code): caura-memclaw at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/027-xce-research-based-refinement/external/caura-memclaw-main . CONSUMER: Spec Kit Memory (LOCAL single-user, SQLite + vector store).

ALREADY PLANNED IN 027 (flag any teaching that merely restates these as REDUNDANT / validation-only, NOT new):
- 002 write-safety: auto-* provenance, manual-edge overwrite protection, tier/pin-aware retention (P0 safety gates).
- 003 incremental-index: memo records, dependency DAG, chunk fingerprints, chunk kinds, chunk line-spans.
- 006 write-path-reconciliation: statediff as explicit aid (not source of truth); async post-insert-enrichment.

CLAIMS TO ATTACK (from iterations 001/085/093/095). For EACH: (1) OPEN the cited file:line and CONFIRM or REFUTE the evidence actually says this (catch misattribution/hallucination); (2) attack transferability — over-engineering for single-user? redundant vs 027 plan above? Postgres->SQLite porting hazard? (3) render UPHELD / DOWNGRADE / REFUTED with reason.
- C1: Add a local idempotency receipt table for memory_save/update (request-hash, pending sentinel, replay, conflict-on-different-body). Cited: common/models/idempotency.py:30-53; core-api/src/core_api/middleware/idempotency.py:158,198.
- C2: Field-source precedence / merge-only so automated enrichment may NOT overwrite manual/caller-provided fields. Cited: core-api/src/core_api/pipeline/steps/write/merge_enrichment_fields.py:28-58; core-api/src/core_api/services/memory_service.py:1656.
- C3: Tiered semantic dedup as advisory near_duplicate_of (preview, not hard reject) for a small corpus. Cited: core-api/src/core_api/pipeline/steps/write/check_semantic_duplicate.py:7,193; core-api/src/core_api/pipeline/steps/write/detect_near_duplicate.py:25,106.
- C4: Content-hash/fingerprint idempotent chunk indexing + explicit embedder tuple (id+dim+version) + derived-state columns. Cited: common/embedding/_service.py; common/models/memory.py (embedding/version cols); core-storage-api/src/core_storage_api/services/postgres_service.py (embedding persistence).

DELIVERABLE — markdown with EXACTLY these sections:
## Citation verification
Per claim: VERIFIED / MISATTRIBUTED / NOT-FOUND, with what the cited lines actually contain.
## Refutation analysis
Per claim: the strongest argument AGAINST adopting it (over-engineering / redundant-vs-027 / porting hazard / cargo-cult).
## Verdict adjustments
Table: Claim · Prior verdict · NEW verdict (UPHELD/DOWNGRADE-to-X/REFUTED) · Reason.
## Surviving teachings
The subset that genuinely holds for single-user local Spec Kit, with the tightest scope.

Then output EXACTLY one final line, valid compact JSON:
DELTA_JSON: {"iteration":"017","focus":"ADVERSARIAL refute write-safety/indexing/reconciliation teachings","findingsCount":<int>,"newInfoRatio":<0.0-1.0>,"topVerdicts":["UPHELD: ...","DOWNGRADE: ...","REFUTED: ..."],"sources":["path:line"]}
