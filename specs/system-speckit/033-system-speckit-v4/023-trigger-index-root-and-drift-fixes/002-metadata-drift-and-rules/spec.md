---
title: "Feature Specification: Phase 2: metadata-drift-and-rules"
description: "A renamed packet kept the children of its old identity in graph metadata because the writer only unioned, and track roots were never validated. A refresh now prunes foreign-identity children, a registry rule reports any that remain, and a sweep reports declared-versus-actual child counts for every track root."
trigger_phrases:
  - "metadata drift rules"
  - "graph metadata child identity"
  - "phantom children after rename"
  - "track root sweep"
  - "validator registry rule"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: metadata-drift-and-rules

<!-- SPECKIT_LEVEL: 3 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-05 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 4 |
| **Predecessor** | 001-index-root-and-docs |
| **Successor** | 003-hook-markers-and-improvement-family |
| **Handoff Criteria** | The proof packet carries no foreign-identity child, the new rule appears in a strict validate run, and the track-root sweep prints every drifted track |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the integration research remediation.

**Scope Boundary**: the graph-metadata writer, the validator registry and rules, and a read-only track-root sweep. Bulk regeneration of the 127 drifted packets and the 14 drifted track roots is an operator-run pass, not this phase.

**Dependencies**:
- Phase 1 landed first only for ordering; no code dependency.

**Deliverables**:
- Refresh prunes `children_ids` entries whose leading identity is not the packet's own, keeping the derived-children union.
- Rule `GRAPH_METADATA_CHILD_IDENTITY` registered and reported by `validate.sh`.
- `spec/sweep-track-roots.mjs` reporting declared versus actual children per track root.
- The proof packet `system-deep-loop/030-deep-loop-unification` regenerated clean.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The graph-metadata writer added derived children and never pruned, by design. After a packet rename the old identity's children stayed listed: 127 of 2,707 packets disagreed with disk, several at exactly double, and one packet carried twelve children of a packet it used to be. Track roots, which have no `spec.md`, were never validated at all; one declared 10 children with 36 on disk. No validator rule covered either.

**Purpose:** make a refresh drop what cannot belong to the packet, report anything that remains, and give track roots a sweep.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `runtime/lib/graph/graph-metadata-parser.ts` and `runtime/cli/graph/backfill-graph-metadata.ts`: prune foreign-identity children on refresh; prediction and apply agree.
- `runtime/cli/rules/check-graph-metadata-child-identity.sh` and its registry entry.
- `runtime/cli/spec/sweep-track-roots.mjs` and its README entry.
- Regenerate `specs/system-deep-loop/030-deep-loop-unification/graph-metadata.json` as the proof case.

### Out of Scope
- Regenerating every drifted packet and track root: operator-run, report-only here.
- The stale `last_active_child_id` chronology pointer, which the canonical save path owns.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Priority |
|----|-------------|----------|
| REQ-001 | A metadata refresh drops `children_ids` entries whose leading identity is not the packet's own and keeps every derived on-disk child | P1 |
| REQ-002 | A registry rule reports remaining foreign-identity entries and runs in `validate.sh` | P1 |
| REQ-003 | A sweep lists every track root whose declared children differ from disk, exiting non-zero on drift | P2 |
| REQ-004 | The proof packet validates clean after one refresh | P1 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The proof packet's `children_ids` has zero entries outside its own identity after `backfill-graph-metadata.js`.
- **SC-002**: A strict validate run on packet 054 lists `GRAPH_METADATA_CHILD_IDENTITY` and reports PASSED.
- **SC-003**: The sweep prints one line per drifted track root and exits 1 while drift exists.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Pruning drops an entry a packet legitimately keeps | Lost child link | Low | Only entries whose leading identity differs from the packet's own are dropped; on-disk children under the packet stay |
| A test fixture encoded the old union-only behavior | Red test | Certain | The fixture was reshaped to the new contract with its assertions preserved and a second test added for the prune |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
