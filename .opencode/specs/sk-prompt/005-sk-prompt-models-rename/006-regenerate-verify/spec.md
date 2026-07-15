---
title: "Feature Specification: Phase 6: regenerate-verify"
description: "Regenerate the derived indexes (advisor skill-graph, spec-memory, packet metadata), then run all gates + a zero-reference sweep + routing probe + smoke to prove the rename is complete and nothing broke."
trigger_phrases:
  - "sk-prompt-models regenerate verify"
  - "rename advisor rebuild"
  - "rename zero-reference sweep"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-prompt/005-sk-prompt-models-rename/006-regenerate-verify"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase complete"
    next_safe_action: "Phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session/006-regenerate-verify"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: regenerate-verify

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 6 |
| **Predecessor** | 005-specs-history-sweep |
| **Successor** | None |
| **Handoff Criteria** | Indexes regenerated; all gates green; zero live references to the old name; advisor routes to sk-prompt-models; a small-model dispatch resolves its profile |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the sk-prompt-models-rename specification — the close-out. It runs ONLY after phases 2–5 have landed all text edits, because the derived indexes must be regenerated from the final state.

**Scope Boundary**: Regeneration of derived state + verification. No new text edits (those are phases 2–5).

**Dependencies**:
- Phases 2–5 complete (all text refs updated).

**Deliverables**:
- Regenerated advisor skill-graph (`skill_advisor.py --force-refresh` + `skill_graph_compiler.py --export-json`), spec-memory index (`memory_index_scan`), and the renamed packet's `description.json`/`graph-metadata.json` derived blocks.
- Green gates: card-sync guard, `validate.sh --strict`, the touched test suites.
- A zero-reference sweep + an advisor routing probe + a live small-model smoke.

**Changelog**:
- When this phase closes, add the matching file to ../changelog/.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After the text rename, the derived indexes (advisor skill-graph + SQLite, spec-memory index, packet metadata `derived` blocks) still hold the old `skill_id`/path. They are generated, not source — a string edit would corrupt them. They must be rebuilt, and the whole rename must be proven complete and non-breaking.

### Purpose
Regenerate all derived state from the renamed source, then prove: zero live references to the old name remain, every gate is green, the advisor routes to `sk-prompt-models`, and a real small-model dispatch still resolves its prompt-craft profile under the new path.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rebuild: advisor skill-graph (force-refresh + compiler), spec-memory index, packet metadata (`generate-description.js` + `backfill-graph-metadata.js`).
- Gates: card-sync guard exit 0; `validate.sh --strict --recursive` on the 158 packet; the secret-scrubber + model-benchmark vitest suites.
- Sweeps/probes: `rg` zero-reference; advisor routing probe; a live small-model smoke dispatch.

### Out of Scope
- Any new text edit (phases 2–5).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `system-skill-advisor/.../skill-graph.{json,sqlite}` | Regenerate | Advisor index rebuild (not hand-edited) |
| spec-memory `context-index.sqlite` + vectors | Regenerate | `memory_index_scan` |
| `…/sk-prompt-models/{description.json,graph-metadata.json}` derived blocks | Regenerate | `generate-description.js` + `backfill-graph-metadata.js` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Indexes regenerated | Advisor force-refresh + compiler succeed; the advisor knows `sk-prompt-models` and not the old id |
| REQ-002 | Zero live references | `rg -l "sk-prompt-small-model"` returns 0 (or only the listed history-care lines, which are enumerated) |
| REQ-003 | All gates green | Card-sync guard exit 0; `validate.sh --strict` 0 errors; the touched vitest suites pass |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Routing + smoke | Advisor probe returns `sk-prompt-models`; a small-model dispatch resolves `model_profiles.json profile_ref → references/models/<id>.md` under the new path |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg -c "sk-prompt-small-model"` totals 0 live hits (history-care lines, if any, are explicitly listed).
- **SC-002**: Card-sync guard exit 0; `validate.sh --strict --recursive` 0 errors; advisor surfaces `sk-prompt-models` on a small-model prompt.
<!-- /ANCHOR:success-criteria -->

### Acceptance Scenarios

- **Given** the regenerated advisor index, **When** probed with "prompt framework for a small model", **Then** it surfaces `sk-prompt-models` (not the old id, not nothing).
- **Given** the renamed registry, **When** a small model is dispatched, **Then** its profile resolves under `sk-prompt-models/references/models/`.

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Stale index after partial regen | Advisor routes to a dead id | Run BOTH force-refresh and the compiler; probe to confirm the new id is live |
| Risk | A missed reference surfaces in the sweep | Rename incomplete | The zero-reference sweep is a P0 gate; fix-and-rerun until 0 (minus enumerated history-care) |
| Risk | Memory vector index holds stale embeddings | Search returns old-name docs | `memory_index_scan` re-embeds; confirm a search no longer surfaces the old id as live |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None — verification is fully determined; the only variable is how many fix-and-rerun loops the zero-reference sweep needs.
<!-- /ANCHOR:questions -->
