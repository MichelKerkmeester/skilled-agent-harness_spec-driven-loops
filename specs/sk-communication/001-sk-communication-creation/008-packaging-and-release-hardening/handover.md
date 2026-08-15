---
title: "Handover: Phase 008 Packaging and Release Hardening"
description: "Verified packaging and release-gate framework, the release prerequisites the operator supplies, and the parent release decision."
trigger_phrases:
  - "phase 008 handover"
  - "packaging release handover"
  - "parent release decision"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/008-packaging-and-release-hardening"
    last_updated_at: "2026-08-13T04:36:10.000Z"
    last_updated_by: "claude"
    recent_action: "Completed the Phase 008 framework and pinned checkpoint aea92b33b6."
    next_safe_action: "Run the operator release prerequisites, then record the parent release decision."
    blockers: []
    key_files:
      - "handover.md"
      - "implementation-summary.md"
      - "packages/cli-communication-projection/src/release/index.ts"
      - "packages/cli-communication-projection/src/doctor/index.ts"
      - "specs/sk-communication/001-sk-communication-creation/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-008-implementation-20260812"
      parent_session_id: "phase-008-scaffold-20260811"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Packaging, the doctor, the release gate, rollback, docs, and rehearsals are complete and verified."
---
# Handover: Phase 008 Packaging and Release Hardening

Phase 008 completes the implementation of the portable CLI communication projection. The release gate is built and enforces every prerequisite; the release itself waits on the operator-supplied evidence.

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

---

<!-- ANCHOR:handover-summary -->
## 1. Handover Summary

- **From session**: Phase 008 implementation completed on 2026-08-12
- **To session**: Parent packet release decision (operator)
- **Phase completed**: Package hardening, compatibility doctor, release gate, rollback, docs, and rehearsals
- **Handover time**: 2026-08-12T11:24:18.928Z
- **Recent action**: Passed the 289-test package gate, `npm pack --dry-run`, a second-model adversarial review, and strict recursive validation.
- **Implementation checkpoint**: `aea92b33b6`
<!-- /ANCHOR:handover-summary -->

---

<!-- ANCHOR:context-transfer -->
## 2. Context Transfer

### 2.1 Key Decisions Made

| Decision | Rationale | Impact |
|----------|-----------|--------|
| Fail closed on unknown or stale facts | Unsupported versions and expired privacy facts must never pass silently | The doctor and gate block and select original-only |
| Release requires human-certified non-inferiority | A provisional or automated signal must never authorize a release | The gate blocks any llm-proxy evaluation result |
| Original-only rollback is provider- and network-free | Recovery must work when every provider is down | The emergency mode is a pure declarative plan |

### 2.2 Public Consumption Boundary

```text
createSupportMatrix() -> assessSupportMatrixFreshness(now)
runCompatibilityDoctor(input) -> ready | degraded | blocked (original-only)
evaluateReleaseReadiness(evidence, now) -> release-ready | blocked + evidence manifest
planRollback(...) -> disable projection, original-only, restore previous package
```

| Surface | Provides |
|---------|----------|
| `src/release/index.ts` | Support matrix, freshness gate, release-readiness gate, evidence manifest, rollback |
| `src/doctor/index.ts` | Fail-closed compatibility and privacy diagnostics |
| `docs/` | Install, configuration, privacy, support matrix, rollback, and runbook |

### 2.3 The Operator Release Prerequisites

The release gate is built and enforced, but `evaluateReleaseReadiness` stays `blocked` until the operator supplies:

1. **The powered blind human non-inferiority result** (Phase 007 study): at least three independent blinded human reviewers, owner-approved pre-registered protocol and frozen margins, each dimension's 95% CI lower bound clearing its margin. A provisional llm-proxy result is rejected.
2. **The first live credentialed provider smoke**, persisting no content or secret, for the six-runtime and provider-contract evidence.
3. **Fresh provider and privacy facts**: OpenCode Go retention and training facts revalidated before 2026-08-31 and at release; a stale result blocks hosted routing.

### 2.4 Traps and Scar Tissue

| Trap | Activation condition | Guard |
|------|----------------------|-------|
| Provisional evidence authorizes a release | An llm-proxy evaluation is fed to the gate | `assertHumanCertifiable` blocks it |
| Decorative integrity digest | A tampered support matrix keeps an old digest | The gate recomputes and compares the digest |
| Endpoint check fails open | A probe returns an unrecognized status | The check blocks on any status other than reachable |
| Future-dated evidence | A row observed after `now` | Freshness rejects future-dated evidence as invalid |
| Malformed input crashes the doctor | A record missing an expected field | The doctor catches it and returns a blocked report |
<!-- /ANCHOR:context-transfer -->

---

<!-- ANCHOR:next-session -->
## 3. For Next Session

### 3.1 Recommended Starting Point

- **File**: `../spec.md` (the parent packet release decision)
- **Next safe action**: Supply the operator release prerequisites, run `evaluateReleaseReadiness`, and record the parent release decision.
- **Cold-read order**: 1. `handover.md` 2. `src/release/index.ts` 3. `docs/runbook.md` 4. `../spec.md`
- **Context**: All eight phases are implemented and verified on the branch; the release itself is the operator's decision once the prerequisites pass the gate.

### 3.2 Priority Tasks Remaining

1. Run the powered blind human non-inferiority study and feed its human-certified result to the release gate.
2. Run the first live credentialed provider smoke without persisting content or secrets.
3. Revalidate OpenCode Go privacy and retention facts, then evaluate release readiness and record the decision.

### 3.3 Critical Context to Load

- [x] Phase 008 behavior and receipts: `implementation-summary.md`
- [x] Release and doctor API: package `src/release/` and `src/doctor/`
- [x] Operator docs: package `docs/`
- [x] Parent packet release contract: `../spec.md`
<!-- /ANCHOR:next-session -->

---

<!-- ANCHOR:validation-checklist -->
## 4. Validation Checklist

- [x] Package typecheck, build, all 289 tests, and import smoke pass.
- [x] `npm pack --dry-run` ships only dist and docs, no secret files.
- [x] Second-model adversarial review applied and remediated.
- [x] Fail-closed doctor and release gate, provisional-blocks, and rollback invariants verified.
- [x] Local-only produces zero hosted calls.
- [x] Phase 008 and parent recursive strict validation pass after final metadata refresh.
<!-- /ANCHOR:validation-checklist -->

---

<!-- ANCHOR:session-notes -->
## 5. Session Notes

The portable CLI communication projection is implemented across all eight phases and verified on the branch. The release gate is built and correctly blocks until the human non-inferiority study, the live credentialed smoke, and fresh provider facts are supplied. The merge to the release branch and any push remain operator-gated.
<!-- /ANCHOR:session-notes -->
