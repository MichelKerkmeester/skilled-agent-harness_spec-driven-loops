ROLE: ADVERSARIAL verifier. Your job is to REFUTE, not confirm. Default position: "this should NOT be adopted as-is." READ-ONLY. Do NOT write/edit/create files or run code. Spec folder: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/008-caura-memclaw-fleet-memory-teachings (pre-approved; skip Gate 3).

TARGET (verify against real code): caura-memclaw at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/027-xce-research-based-refinement/external/caura-memclaw-main . CONSUMER: Spec Kit Memory (LOCAL single-user, SQLite).

ALREADY PLANNED IN 027 (a teaching that just restates these is REDUNDANT / validation-only — say so):
- 004 causal-edge-tombstones: ALL active causal-edge delete paths MUST tombstone before hard-delete. (So "tombstone before hard-delete" is ALREADY the plan.)
- 005 metadata-edge-promoter: promote validated parent/child/parent-chain frontmatter relations into causal edges; AVOID duplicating already-wired manual links. (So "deterministic promotion + skip manual" is ALREADY the plan.)

CLAIMS TO ATTACK (from iterations 003/086/087/096). For EACH: (1) OPEN cited file:line, CONFIRM/REFUTE; (2) attack: redundant vs 027/004+005 above? over-engineering for single-user? does MemClaw even HAVE memory-to-memory causal edges (or only entity tagging) — if not, is this teaching even grounded? (3) render UPHELD / DOWNGRADE / REFUTED.
- C1: Tombstone-before-hard-delete + grace window + idempotent first-timestamp soft-delete + sticky lifecycle audit. Cited: core-storage-api/src/core_storage_api/services/postgres_service.py:1606-1644; common/models/lifecycle_audit.py; common/events/lifecycle_handlers.py.
- C2: Deterministic natural-key generated-edge promotion with explicit provenance (generated-by=promoter vs manual) and manual-edge SKIP to avoid duplicate promotion. Cited: common/enrichment/schema.py; common/models/entity.py.
- C3: Separate an entity-relationship side-channel from causal memory edges; bounded entity-graph recall boost with fallback. Cited: common/models/entity.py; core-storage-api/src/core_storage_api/services (entity recall).
- C4: Governance — REJECT fleet tenant/scope/suppression machinery (confirm this REJECT is correct); ADAPT only provenance trust-weighting + append-only audit for AUTOMATED mutations. Cited: README.md:251-256; common/models/audit.py; common/events/suppression_handlers.py.

DELIVERABLE — markdown with EXACTLY these sections:
## Citation verification
Per claim: VERIFIED / MISATTRIBUTED / NOT-FOUND. IMPORTANT: explicitly state whether MemClaw has true memory<->memory causal edges or only entity tags — this determines whether 004/005 teachings are grounded in MemClaw at all.
## Refutation analysis
Per claim, strongest argument AGAINST (esp. redundancy vs 027/004+005).
## Verdict adjustments
Table: Claim · Prior verdict · NEW verdict · Reason.
## Surviving teachings
Minimal subset that adds something BEYOND what 027/004+005 already plan.

Then output EXACTLY one final line, valid compact JSON:
DELTA_JSON: {"iteration":"019","focus":"ADVERSARIAL refute relationship/lifecycle/governance teachings","findingsCount":<int>,"newInfoRatio":<0.0-1.0>,"topVerdicts":["UPHELD: ...","DOWNGRADE: ...","REFUTED: ..."],"sources":["path:line"]}
