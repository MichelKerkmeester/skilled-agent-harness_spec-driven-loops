---
title: "Tasks: 027/002 Memory Write Safety"
description: "Task list for the three P0 fixes split from 027/005 (auto provenance cap broadening, manual-edge overwrite guard, retention-sweep tier basement) plus the OpenLTM secret-redaction amendment."
trigger_phrases:
  - "027 phase 002"
  - "feedback P0 correctness"
  - "auto-provenance cap broadening"
  - "manual-edge overwrite guard"
  - "retention-sweep tier basement"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-write-safety"
    last_updated_at: "2026-06-10T00:00:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "All tasks T001-T020 complete with test + build evidence"
    next_safe_action: "Start 027/005 reducers; this packet is their completed dependency"
    blockers: []
    key_files: ["spec.md", "plan.md", "checklist.md", "implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-10-027-002-memory-write-safety-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "OpenLTM amendment folded into this phase as T016-T020 (pre-index secret redaction)"
---
# Tasks: 027/002 Memory Write Safety

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read `mcp_server/lib/storage/causal-edges.ts`, `mcp_server/lib/storage/consolidation.ts`, and `mcp_server/lib/governance/memory-retention-sweep.ts`. Evidence: live sites confirmed at causal-edges.ts:270/283 (`createdBy === 'auto'`), consolidation.ts:357 (`edge.created_by === 'auto'`), memory-retention-sweep.ts selectExpiredRows (delete_after only).
- [x] T002 Locate existing causal-edge and retention-sweep tests; identify the smallest fixture surface for each P0. Evidence: `tests/causal-edges-unit.vitest.ts` (in-memory schema pattern), `tests/memory-retention-sweep.vitest.ts` + `tests/fixtures/memory-index-db.ts`.
- [x] T003 Confirm whether auto provenance is already represented by a helper or must be introduced locally. Evidence: no existing helper (repo-wide grep); introduced shared `isAutoEdgeCreator` in causal-edges.ts, imported by consolidation.ts.
- [x] T004 Confirm `memory_index` exposes tier, pin, decay, access-count, and last-access fields needed for retention protection. Evidence: vector-index-schema.ts migrations add `decay_half_life_days` (REAL 90.0), `is_pinned` (INT 0), `last_accessed` (INT 0), `access_count` (INT 0); `importance_tier` is in the base schema. Legacy DBs handled via PRAGMA column probe.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Implement P0-1: broaden automatic provenance classification to `createdBy === "auto" || createdBy.startsWith("auto-")` in causal insert cap paths. Evidence: `isAutoEdgeCreator` applied to the strength cap and the per-node edge bound in `insertEdge`.
- [x] T006 Apply the same automatic provenance classification to consolidation strengthening caps. Evidence: `runHebbianCycle` imports and uses the shared `isAutoEdgeCreator` predicate.
- [x] T007 Implement P0-2: query existing edge provenance before upsert and skip automatic overwrite when existing `created_by` is non-auto. Evidence: conflict SELECT now reads `created_by`; auto writes against non-auto rows return null and preserve the row; auto-to-auto and manual writes unchanged.
- [x] T008 Implement P0-3: extend `RetentionExpiredRow` and expired-row select query with tier, decay, pin, access count, and last accessed fields. Evidence: `RetentionExpiredRow` carries `importanceTier`/`decayHalfLifeDays`/`isPinned`/`accessCount`/`lastAccessed`; missing legacy columns select NULL via PRAGMA probe.
- [x] T009 Implement the tier-aware retention deletion decision so constitutional, critical, or pinned rows are not deleted solely on TTL expiry. Evidence: `isProtectedFromRetentionDelete` gates the destructive delete; protected rows audit as `decision='deny'` with reason `retention_tier_protected`; result reports `protectedCount`/`protectedIds`. Scope note: recency fields are selected for audit but do not protect (REQ-005 scope; see implementation-summary.md Key Decisions).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-2b -->
## Phase 2b: Secret Redaction (OpenLTM Amendment)

- [x] T016 Create the ordered, fail-closed secret scrubber module with typed `[REDACTED:<kind>]` markers and redaction telemetry (`mcp_server/lib/parsing/secret-scrubber.ts`). Evidence: covers private keys, AWS access/secret keys, GitHub/Anthropic/OpenAI/Google/Slack tokens, JWTs, bearer values, credential assignments; `SecretScrubberError` on internal failure.
- [x] T017 Call the scrubber at the head of the memory write/index path, BEFORE content-hash/embedding/FTS (`mcp_server/lib/parsing/memory-parser.ts` `parseMemoryContent`). Evidence: all save/index/ingest paths flow through `parseMemoryFile`/`parseMemoryContent`; title and trigger phrases derive from scrubbed content; contentHash computed over scrubbed text.
- [x] T018 Scrub direct `title`/`triggerPhrases` writes in `memory_update` with fail-closed refusal (`mcp_server/handlers/memory-crud-update.ts`). Evidence: `SecretScrubberError` is rethrown as `MemoryError(INVALID_PARAMETER)`, refusing the write.
- [x] T019 Surface the redaction count in `memory_health` (`mcp_server/handlers/memory-crud-health.ts`). Evidence: full report `data.redaction` carries `totalRedactions`, `byKind`, `lastRedactionAt`.
- [x] T020 Add focused scrubber tests: per-kind redaction, conservative non-matches (sk-* skill slugs, placeholders, prose), fail-closed on injected scrubber error, parse-path integration (scrub before hash), memory_health surface. Evidence: `tests/secret-scrubber.vitest.ts` 27/27 pass.
<!-- /ANCHOR:phase-2b -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Add focused tests for `auto-session` cap behavior in insert and consolidation paths. Evidence: `tests/causal-edges-write-safety.vitest.ts` insert-cap + consolidation-cap describes.
- [x] T011 Add focused tests for manual-edge preservation when automatic/reducer upsert conflicts. Evidence: manual-edge overwrite guard describe (preserve on auto and auto-session, allow auto-to-auto under cap, allow manual curation).
- [x] T012 Add focused tests for protected retention rows and unprotected expired rows. Evidence: `tests/memory-retention-sweep.vitest.ts` tier-basement describe (constitutional/critical/pinned protected, normal/temporary/null-tier deleted, legacy schema, dry-run visibility).
- [x] T013 Run the focused causal tests. Evidence: `npx vitest run tests/causal-edges-write-safety.vitest.ts` 15/15 pass; adjacent causal-edges, causal-edges-unit, causal-fixes suites green.
- [x] T014 Run the focused retention tests. Evidence: `npx vitest run tests/memory-retention-sweep.vitest.ts` 18/18 pass; memory-runtime-retention green.
- [x] T015 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-write-safety --strict`. Evidence: exit 0 on 2026-06-10; `npm run build` exit 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 requirements in `spec.md` are implemented.
- [x] Tests prove all three bug classes are closed (plus the secret-redaction amendment).
- [x] No files outside the named production surfaces and focused tests changed.
- [x] 005-learning-feedback-reducers can record this packet as its completed hard dependency.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Source Audit**: `../research/027-xce-research-pt-04/research.md`
- **Amendment Source**: `../research/010-openltm-memory-architecture-teachings/sub-packet-proposals.md`
- **Downstream Dependency**: `../005-learning-feedback-reducers/spec.md`
<!-- /ANCHOR:cross-refs -->
