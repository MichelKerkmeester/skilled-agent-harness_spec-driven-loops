---
title: "Feature Specification: continuity identities"
description: "Plan stable lineage, claim, candidate, and mode-session identities that persist across resume, handover, replay, and cross-mode boundaries and are recorded on the typed event ledger."
trigger_phrases:
  - "continuity identities"
  - "stable deep-loop identity"
  - "resume handover identity threading"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/007-shared-evidence-and-control-services"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/007-shared-evidence-and-control-services/007-continuity-identities"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Planned stable continuity identities across resume, handover, and mode boundaries"
    next_safe_action: "Implement identity minting and ledger references behind the dark runtime path"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Continuity Identities

> Phase adjacency under the 004 parent (navigation order, not a runtime dependency): predecessor `006-locks-and-fencing`; successor none (last sibling).

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/007-shared-evidence-and-control-services/007-continuity-identities |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop runtime |
| **Origin** | Run-2 continuity-threading finding: one claim, lineage, candidate, or mode session must retain one identity across the whole loop |
| **Child depends_on** | `[]` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The shipped runtime has several local notions of identity, but no shared continuity identity contract. `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/continuity-thread.cjs` deduplicates open questions by normalized text and orders them by iteration plus a content hash. `.opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` reconstructs lineage state from the latest lifecycle event or config and can synthesize finding IDs from run, severity, and array position. `.opencode/skills/system-deep-loop/runtime/lib/council/session-state-hierarchy.cjs` can derive topic and round IDs from indexes and a session ID from the current timestamp. `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` derives a child session from the lineage label plus run ID, while `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/jsonl-repair.ts` deduplicates records from mutable record fields. The coverage graph then scopes node identity under `(spec_folder, loop_type, session_id, id)` in `.opencode/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-db.ts`, which makes a changed session namespace a changed graph identity.

Those mechanisms are valid local coordinates, but they are not durable logical identities. Resume, handover, replay, a reordered candidate list, a renamed lineage label, or a cross-mode transfer can regenerate a key and make the same tracked thing appear new. The run-2 research calls for longitudinal evidence ledgers, immutable claim IDs, minority lineage retention, versioned partial fingerprints, and entities that remain trackable across passes and revisions (`.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/research/research-modes.md`). This phase plans the shared identity substrate: mint each logical identity once, persist it on the typed ledger, carry it through resume and handover, and reference it unchanged across mode boundaries. Attempts, iterations, paths, labels, content hashes, and legacy keys remain attributes or aliases, never the identity itself.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A versioned identity contract for four initial kinds: `lineage`, `claim`, `candidate`, and `mode_session`.
- Mint-once rules, validation, collision handling, idempotent retry, non-reuse, and explicit parent/continuation relationships.
- Stable resume semantics: a logical session or lineage keeps its identity; a true restart or fork mints a new identity linked to the prior one.
- A handover identity frontier containing active typed references plus the ledger cursor and replay fingerprint needed to resolve them.
- Cross-mode typed references that preserve the referenced ID and record the source/target mode boundary without copying or reminting the entity.
- Ledger records for minting, alias binding, relationship binding, and identity-bearing domain events, all guarded by the phase-006 transition-authorized write path.
- A dark compatibility observer for existing session IDs, lineage labels, graph-node IDs, synthesized finding IDs, and candidate IDs; it records aliases without changing legacy authority.
- Runtime fixtures proving stability across resume, handover, replay, reorder, rename, crash/retry, and cross-mode transfer.

### Out of Scope
- Claim lifecycle, contradiction, supersession, and semantic novelty behavior; program phase `010-novelty-claims-continuity-and-projections` consumes these identities.
- Per-mode authority migration and cutover certificates; program phase `014-staged-state-migration-and-authority-cutover` consumes the same identity references.
- The typed event envelope, transition authorization, and canonical append mechanics owned by phase `006-transition-authorized-ledger-core`.
- General upcasters, dual-read adapters, legacy projections, shadow parity, and rollback drills owned by phase `008-compatibility-shadow-and-rollback-bridge`.
- Durable fan-out/fan-in orchestration behavior, dispatch receipts, leases, and salvage policy owned by phase `009-fanout-fanin-durable-orchestration`.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Define one versioned opaque ID shape and typed validator for `lineage`, `claim`, `candidate`, and `mode_session` | Every ID declares its kind and format version; malformed, unknown-kind, and cross-kind substitutions fail closed |
| REQ-002 | Mint an identity exactly once through an idempotent, transition-authorized ledger operation | Retrying the same mint request after interruption returns the original ID and produces no second logical entity |
| REQ-003 | Prohibit identity derivation from mutable content or coordinates | Fixtures prove changes to array order, iteration, label, title, path, text, timestamp, or content hash do not change an existing ID |
| REQ-004 | Preserve logical identity across resume and handover | Resume and handover round trips restore the same active IDs and ledger cursor; missing, ambiguous, or wrong-kind references stop before execution |
| REQ-005 | Separate logical identity from execution attempts and true forks | Retry/resume keeps the logical ID while recording a new attempt; restart/fork mints a child ID with a typed `continues_from` or `forked_from` link |
| REQ-006 | Carry typed references unchanged across mode boundaries | A receiving mode resolves the original entity ID and records the transfer edge; it cannot silently clone, re-key, or change the entity kind |
| REQ-007 | Record identity provenance and relationships on the canonical ledger | Mint, alias, continuation/fork, and cross-mode reference events are replayable and every identity-bearing domain event includes typed subject references |
| REQ-008 | Observe legacy identifiers without making the new service authoritative | Dark-path events bind legacy keys as namespaced aliases, detect ambiguity/collision, and leave shipped readers and writers unchanged |
| REQ-009 | Make replay deterministic and tamper-evident | Replaying the same authorized event prefix reconstructs the same identity registry, relationships, and alias map under the versioned fingerprint |
| REQ-010 | Publish stable downstream contracts for claim continuity and per-mode cutover | Program phases 007 and 011 can reference the identity schema without depending on array indexes, regenerated keys, or mode-local ID formats |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: One logical lineage, claim, candidate, or mode session retains one typed ID through resume, handover, replay, reorder, rename, and cross-mode reference.
- **SC-002**: Crash/retry and concurrent mint fixtures produce one identity or an explicit conflict, never duplicate accepted identities.
- **SC-003**: Ledger replay reconstructs the same identity registry and relationship graph with no dependence on current array position, path, label, or content text.
- **SC-004**: Dark compatibility telemetry shows legacy aliases resolving unambiguously while legacy runtime behavior remains authoritative and unchanged.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

This child has no sibling hard dependency (`depends_on: []`); the predecessor reference is adjacency only. It inherits the 004 parent program dependency on the dark transition-authorized ledger core. The main risks are accidental identity reminting during resume, alias collisions across modes, conflating a retry with a fork, leaking mode-local semantics into the shared schema, and making the dark registry authoritative before phase 008 proves compatibility. The implementation must keep identity writes additive, fail closed on ambiguity, and retain legacy coordinates as namespaced metadata. Downstream program phases 007 and 011 are contract consumers, not owners of identity minting.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. Execution must bind the planned identity event names and ledger cursor fields to the exact phase-006 event-envelope contract without changing the stable semantics in this specification.
<!-- /ANCHOR:questions -->
