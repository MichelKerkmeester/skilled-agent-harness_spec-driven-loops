---
title: "Feature Specification: Fingerprint Docset Enforcement"
description: "The generation marker introduced by the checklist retirement skips drift comparison whenever the marker is absent, which is 3,840 of the 3,843 packets that carry a fingerprint. Make the marker mandatory alongside a fingerprint so the gate compares by default, and stamp the fleet without recomputing digests so the drift it was hiding surfaces instead of being absorbed."
trigger_phrases:
  - "source fingerprint docset"
  - "fingerprint docset enforcement"
  - "drift gate inert"
  - "generation marker required"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/036-spec-doc-template-reduction/012-fingerprint-docset-enforcement"
    last_updated_at: "2026-08-30T14:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored from a fresh-model review finding, reproduced against the live tree"
    next_safe_action: "Plan the schema rule and the stamp-only migration"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-schema.ts"
      - ".opencode/skills/system-spec-kit/mcp-server/lib/validation/generated-metadata-integrity.ts"
      - ".opencode/skills/system-spec-kit/scripts/tests/fingerprint-docset-generation.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-30-fingerprint-docset-enforcement"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Fingerprint Docset Enforcement

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-08-30 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 12 of 13 |
| **Predecessor** | 011-checklist-reference-cleanup |
| **Successor** | 013-retirement-read-path-closure |
| **Handoff Criteria** | Every packet carrying a fingerprint also carries a marker, and validation reports the real mismatch count |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12**. Phase 010 retired the standalone verification checklist and, to keep that
removal from forcing a repo-wide repair, introduced a generation marker on the source
fingerprint. This phase repairs the marker: as shipped it turned a live gate off.

**Scope Boundary**: The marker's presence contract and the migration that satisfies it. The
drift the migration exposes is reported, not repaired — repairing it is per-packet work that
belongs to whoever owns each packet.

**Dependencies**:
- Phase 010 shipped the marker and is Complete; this phase changes its contract, not its purpose.

**Deliverables**:
- A schema rule making the marker mandatory when a fingerprint is present.
- A stamp-only migration for the packets missing it.
- Test cases pinning the new contract, including the one that currently asserts the defect.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The marker skips comparison on an absent value, and the field is optional, so almost nothing is
compared. Measured on the live tree: 3,851 `graph-metadata.json` files, 3,844 carry a
`source_fingerprint`, and **355** carry a `source_fingerprint_docset`. The remaining **3,489**
return early before `SOURCE_FINGERPRINT_MISMATCH` can fire. Backfilling 8 of those skipped
packets in place and diffing showed **4 of 8 with real digest drift** that reports green today.

The marker count moved from 10 to 355 while this phase was being written, because concurrent
packets stamped the ones they touched. That is the shape of the problem rather than progress
against it: coverage arrives only where someone happens to work, and every unstamped packet is
silent until then.

The same absent branch is a deliberate suppression vector. Phase 010 closed the forged-marker
case — writing `99` still reports drift — but deleting the key reaches the identical silence, and
the schema accepts a document without it. The gate is opt-out by omission.

### Purpose

Every packet that carries a fingerprint has its fingerprint compared, and no packet can opt out
by omitting a field.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A schema rule rejecting a document that carries `source_fingerprint` without `source_fingerprint_docset`.
- Integrity-rule handling for that combination, so the failure is legible rather than a bare schema error.
- A migration that stamps the marker on every packet missing it, rather than leaving coverage to accumulate wherever someone happens to work.
- Test coverage for the new contract, replacing the case that currently pins the defect as desired.

### Out of Scope
- Repairing the digest drift the migration exposes — that is per-packet content work, and absorbing it here would repeat the mistake this phase exists to fix.
- The older-generation skip itself, which is the marker's actual purpose and stays.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp-server/lib/graph/graph-metadata-schema.ts` | Modify | Require the marker when a fingerprint is present |
| `mcp-server/lib/validation/generated-metadata-integrity.ts` | Modify | Report rather than skip on a present fingerprint with no marker |
| `scripts/graph/` (new migration entry) | Create | Stamp the marker without recomputing digests |
| `scripts/tests/fingerprint-docset-generation.sh` | Modify | Invert the absent-marker case; add the presence contract |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A packet carrying `source_fingerprint` without `source_fingerprint_docset` fails validation instead of skipping the comparison. |
| REQ-002 | The migration stamps the marker without recomputing the digest, so drift the gate was hiding surfaces as findings rather than being silently overwritten. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | A marker that is present and older than the current generation still skips, which is the migration-absorbing behaviour the marker exists for. |
| REQ-004 | The test case asserting that an absent marker skips is inverted, and a case pins the presence contract directly. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Of the packets carrying a `source_fingerprint`, the count carrying no `source_fingerprint_docset` is 0 (3,489 at the time of writing, and moving as unrelated packets are touched).
- **SC-002**: A strict validation sweep reports a non-zero, specific mismatch count where it reports none today, and each reported packet is traceable to a real document edit.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A schema rule wrong in either direction fails the entire fleet at once | High | Land the migration before the rule, so no packet is ever in the failing combination |
| Risk | Stamping thousands of files produces a diff nobody can review | Med | Stamp-only: one added key per file, no other field touched, verified by diffing a sample |
| Risk | The exposed drift is large enough to block unrelated work | Med | Report it; do not gate other packets on repairing it |
| Dependency | `backfill-graph-metadata.ts` recomputes digests by design | High | The migration must not reuse it as-is — that is what would absorb the drift |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The migration completes over the full tree in a single run without manual batching.

### Security
- **NFR-S01**: The migration writes only within configured specs roots, and only the marker key.

### Reliability
- **NFR-R01**: The migration is idempotent — a second run changes nothing.
- **NFR-R02**: A packet with no fingerprint at all is left untouched.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Fingerprint present, marker absent: the case this phase creates a failure for.
- Fingerprint absent, marker absent: legal and untouched (7 files today).
- Marker present but not an integer: already a schema error; must stay one.

### Error Scenarios
- Migration interrupted partway: idempotence means a re-run resumes safely.
- A packet inside a symlinked track: must be stamped like any other, not skipped.

### State Transitions
- Older marker after the next generation bump: still skips, and that is correct.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Four source files, one migration, ~3,500 data files |
| Risk | 18/25 | Fleet-wide; a wrong rule fails every packet simultaneously |
| Research | 6/20 | Behaviour already reproduced and measured |
| **Total** | **36/70** | **Level 2** |

The deterministic scorer returned Level 1 on lines-of-code and file count. Level 2 was chosen
deliberately: the risk here is blast radius, which that scorer does not read, and Level 2 is
where `acceptance-criteria.md` becomes required.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should the migration stamp the current generation, or the generation each packet was last derived under? Stamping current is simpler but asserts a comparison that was never run; stamping historical is honest but not always recoverable.
- Does the exposed drift want a one-time triage pass, or should it stay as ambient findings until each packet is next touched?
<!-- /ANCHOR:questions -->
