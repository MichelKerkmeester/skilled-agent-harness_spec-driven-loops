---
title: "Feature Specification: Phase 23: ollama-deprecation-research"
description: "The advisor's Ollama-backed semantic lane ships at weight 0 after three negative measurements, yet its code, vectors, daemon refresh, doctor routes and docs remain. This research maps how to delete every remnant, in the repo and on users' machines, with no backup kept."
trigger_phrases:
  - "ollama deprecation research"
  - "phase 23 ollama deprecation research"
  - "remove ollama from skill advisor"
  - "delete semantic shadow lane"
importance_tier: "important"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 23: ollama-deprecation-research

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-20 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 23 of 23 |
| **Predecessor** | 022-verification-fixes |
| **Successor** | None |
| **Handoff Criteria** | `research/research.md` names every remnant with file:line, the removal order and the user-machine cleanup, ready for `/speckit:plan` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 23** of the epic. Phases 017 to 019 measured the lane and switched it off; a Fable 5.2 read on 2026-11-20 recommended deprecation. The operator chose deletion with no backup.

**Scope Boundary**: Research only. No code, test or doc outside this folder changes.

**Dependencies**:
- The recorded ablations in phases 017, 018 and 019 of this epic.

**Deliverables**:
- `research/research.md`, a five-iteration deep-research synthesis with a complete removal inventory.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The semantic lane routed worse every time it was measured (156 of 196 top-1 with it, 161 without), so it ships at weight 0, but its code, vector refresh, doctor embedder route, coverage checks, env vars and docs all remain. Repo users who followed `/doctor:install` also carry a pulled model and vector tables that do nothing.

### Purpose
Produce an inventory and an ordered removal plan that deletes every Ollama and embedding remnant from the repo and from users' machines, with no backup and nothing left behind.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ rg -l -i "ollama|semantic_shadow|semanticShadow|nomic-embed" --glob '!specs/**' --glob '!**/node_modules/**' --glob '!**/dist/**' . | wc -l
     162
$ grep -n "semantic_shadow" .skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts
13:  { id: 'semantic_shadow', defaultWeight: 0, defaultShadowWeight: 0.05, live: true },
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Inventory every Ollama, embedding and semantic-lane remnant in code, tests, docs, doctor routes, env vars, launcher, database schema, changelogs and playbooks.
- Decide what happens to the shared `system-spec-kit/shared/embeddings/` package and its other consumers.
- Design the user-machine cleanup for repo users who installed the embedder in an earlier release.
- Order the removal so every gate stays green at each step, and define the proof that nothing is left.

### Out of Scope
- Making the change - this phase researches; implementation follows in a later phase.
- Re-running the lane ablation - the operator chose deletion, not another measurement.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `023-ollama-deprecation-research/research/` | Create | Deep-research state, iterations and synthesis |
| `023-ollama-deprecation-research/*.md` | Modify | This phase's own docs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The synthesis lists every remnant with file:line, grouped by surface | `research/research.md` holds the inventory and a residue-check command that would print nothing after removal |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The synthesis gives an ordered removal plan and a user-machine cleanup | `research/research.md` names the order, the gates at each step and the doctor cleanup with its approval |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Five iterations complete and `research/research.md` exists with the inventory, removal order and residue check.
- **SC-002**: `validate.sh --strict` on this phase prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The shared embeddings package has other consumers | Deleting it could break spec-kit or sk-doc | The research traces every import before naming it for deletion |
| Risk | A remnant hides under a name that does not say Ollama | Something survives the removal | The research widens the search beyond the obvious names and defines a residue check |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which consumers of the shared embeddings package survive the advisor's removal?
- How to fully deprecate and remove the skill advisor Ollama and embedding semantic lane with zero remnants (deep research active, see research/research.md).
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:research-context -->
## 8. RESEARCH CONTEXT

Deep research ran five iterations on this topic. `research/research.md` is the canonical synthesis.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
- All five key questions answered. 332 tracked files outside `specs/` carry a remnant.
- The shared embeddings package, the HuggingFace model server and its npm dependency are deleted with the lane: no consumer outside the advisor survives.
- Removal runs in eight ordered steps with named gates; existing databases are discarded and rescanned.
- User machines get one cleanup tool in `/doctor:update apply`: repo-owned leftovers deleted without asking, shared-store models after a yes.
- A residue check with repo and machine modes proves zero remnants; seven operator decisions remain, each with a default.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:research-context -->
