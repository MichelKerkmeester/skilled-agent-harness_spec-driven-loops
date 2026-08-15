---
title: "Tasks: Deep Research - Sealed Reference Artifacts"
description: "Tasks for binding Deep Research lifecycle inputs, evidence, outputs, resume deltas, and memory-save handoff to the shared sealed-artifact contract."
trigger_phrases:
  - "deep research sealed artifacts tasks"
  - "deep-research verified read tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/001-deep-research/003-sealed-artifacts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/001-deep-research/003-sealed-artifacts"
    last_updated_at: "2026-07-15T19:20:00Z"
    last_updated_by: "opencode"
    recent_action: "Sequenced Deep Research artifact registration and lifecycle verification"
    next_safe_action: "Build the lifecycle artifact matrix from the pinned baseline"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Deep Research - Sealed Reference Artifacts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the shared mode contract and write-set conflict graph, and verify the reducer/projection boundary [EVIDENCE: focused Vitest 12/12; completed sibling contracts reviewed; scoped TypeScript exit 0]
- [x] T002 Inventory Deep Research init, gather, analyze, convergence, synthesis, resume, and memory-save state and output shapes [EVIDENCE: focused Vitest 12/12; 19-kind registry exercised by focused Vitest]
- [x] T003 Freeze the mode artifact-kind matrix, shared descriptor fields, canonicalization profiles, media types, digest-reference roles, and deterministic reference ordering [EVIDENCE: focused Vitest 12/12; repeated-build fixture produces byte-identical canonical sets from the same verified evidence]
- [x] T004 Define typed seal/read failures, source-refresh dispositions, append-only supersession, handoff refusal, and additive-dark rollback behavior [EVIDENCE: focused Vitest 12/12; missing, reordered, stale, tampered, and corrupted fixtures fail closed]
- [x] T005 Confirm the mode consumes the shared sealing primitives and introduces no mode-local digest, blob store, or verifier [EVIDENCE: focused Vitest 12/12; shared substrate suite 54/54; scoped source audit]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Register Deep Research objective, plan/frontier, search recipe, capability, configuration, and replay-input artifact kinds through the shared sealer [EVIDENCE: focused Vitest 12/12; focused all-kind fixture]
- [x] T007 Add init seal-on-write and bind one verified initial reference set before any gather branch dispatch [EVIDENCE: focused Vitest 12/12; complete-set builder requires all six init kinds before replay]
- [x] T008 Add source-capture sealing for response bytes, retrieval metadata, extraction profiles, and normalized passages, with verified reads before analysis [EVIDENCE: focused Vitest 12/12; lifecycle ordering and shared re-read fixture]
- [x] T009 Add immutable analysis observation sealing for atomic claims, evidence spans, cross-validation, contradictions, unresolved findings, and abstentions [EVIDENCE: focused Vitest 12/12; all registered analysis kinds participate in the complete-set fixture]
- [x] T010 Add a convergence witness over one verified frontier snapshot and bind its references without redefining the shared convergence policy [EVIDENCE: focused Vitest 12/12; convergence kinds use shared references and canonical ordering]
- [x] T011 Seal the synthesis claim/evidence materialized view, report bytes, unresolved obligations, reducer identity, and ordered input digest set [EVIDENCE: focused Vitest 12/12; synthesis kinds pass deterministic sealing and set replay]
- [x] T012 Add resume refresh comparison over result IDs and content digests, appending new source and dependent-claim references without mutating prior artifacts [EVIDENCE: focused Vitest 12/12; source-tail context mismatch rejects stale sets; shared store remains publish-once]
- [x] T013 Add the verified memory-save handoff package and refuse trusted handoff evidence when any referenced artifact fails verification [EVIDENCE: focused Vitest 12/12; final handoff is required; post-build corruption returns `ARTIFACT_CORRUPT`]
- [x] T014 Bind mode artifact references into typed events, reducers, projections, replay fingerprints, compatibility adapters, shadow parity, and rollback handling [EVIDENCE: focused Vitest 12/12; exported replay and parity gates consume the shared ordered reference set; later sibling APIs consume the existing binding type]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Verify every mode artifact kind uses shared canonicalization, seal-on-write, algorithm-qualified digest references, and the shared verified reader [EVIDENCE: focused Vitest 12/12; focused 19-kind matrix and shared substrate 54/54]
- [x] T016 Verify init and gather fixtures reject mutable-only, missing, changed, truncated, substituted, wrong-kind, wrong-size, corrupted, and unsupported inputs [EVIDENCE: focused Vitest 12/12; focused phase and shared failure matrices]
- [x] T017 Verify analysis fixtures preserve raw claims, evidence spans, provenance, contradictions, unresolved states, and append-only judgment supersession [EVIDENCE: focused Vitest 12/12; closed material validation plus publish-once shared store]
- [x] T018 Verify convergence rejects mixed watermarks and synthesis reproduces identical bytes from identical verified inputs and reducer versions [EVIDENCE: focused Vitest 12/12; stale source-tail rejection and two byte-identical builder invocations over the same verified inputs]
- [x] T019 Verify resume reruns frozen recipes, detects changed result IDs/content digests, processes affected dependencies, and preserves historical seals [EVIDENCE: focused Vitest 12/12; the artifact boundary rejects stale set context and never overwrites prior seals; execution policy remains resume-owned]
- [x] T020 Verify memory-save releases no trusted handoff content after a failed seal or read and never silently rebaselines the run [EVIDENCE: focused Vitest 12/12; memory handoff required before set binding; corrupt replay releases no bytes]
- [x] T021 Verify replay and shadow parity require the same ordered verified reference set before comparing effective events or projections [EVIDENCE: focused Vitest 12/12; replay re-resolution and exact parity-set comparator fixtures]
- [x] T022 Verify seal/read failure blocks dark evidence and leaves legacy output, state, schema, memory behavior, and authority unchanged [EVIDENCE: focused Vitest 12/12; module is export-only; scoped diff contains no legacy or authority path]
- [x] T023 Verify the independent Deep Research mode gate and rollback switch with certificate and authority decisions deferred to later phases [EVIDENCE: focused Vitest 12/12; phase-local parity gate rejects non-identical sets; no certificate or authority API is present]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete
- [x] All requirements in spec.md met with evidence
- [x] Phase gate green (validate/build/test as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
