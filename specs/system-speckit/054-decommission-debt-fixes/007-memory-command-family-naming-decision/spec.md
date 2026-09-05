---
title: "Feature Specification: Phase 7: memory-command-family-naming-decision"
description: "The surviving continuity writer and retrieval commands keep the word memory in their names and paths across at least 87 live files; this phase lays out the keep-literal-and-document versus rename-with-compatibility-window options with blast-radius evidence, so the operator can decide before any rename starts."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 7: memory-command-family-naming-decision

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-09-05 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 7 of 7 |
| **Predecessor** | `../006-orphaned-types-and-dead-modules/spec.md` |
| **Successor** | None |
| **Handoff Criteria** | The operator has recorded a choice between the two options in `decision-record.md`; no rename or path change starts before that record exists |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the decommission debt fixes specification, and its final phase.

**Scope Boundary**: The decision itself and its supporting blast-radius evidence. No file is renamed, no path is edited, and no code changes in this phase - it produces a decision record, not an implementation.

**Dependencies**:
- None on the other six phases, though it should be the last to close since a rename decided here changes reference counts other phases' documentation (and the parent's own `Files to Change` table) currently cite.

**Deliverables**:
- Two fully specified options with grep-counted blast radius for each.
- A `decision-record.md` in this folder, written by the operator, naming the chosen option before any rename work starts.

**Changelog**:
- When this phase closes, refresh the matching file in `../changelog/` using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The surviving continuity writer and retrieval commands still carry the word "memory" throughout their names, paths, and package metadata: the `/memory:save` and `/memory:search` commands (`.opencode/commands/memory/save.md`, `.opencode/commands/memory/search.md`); the writer itself, `scripts/memory/generate-context.ts`, compiled to `scripts/dist/memory/generate-context.js`; the `@spec-kit/scripts` package description, `"CLI tools for spec-kit context generation and memory management"` (`scripts/package.json:4`); the `/doctor memory` route (`.opencode/commands/doctor/_routes.yaml:33-38`, target `memory` → `doctor-memory.yaml`), which now diagnoses the trigger index, not a memory database; and `runtime/hooks/claude/session-stop.ts:73-76`, which hard-codes four candidate resolutions of the `scripts/dist/memory/generate-context.js` path for its auto-save fallback. Decision D7 of packet 052 (`specs/system-speckit/052-memory-decommission-landing/goal.md:61,118`) already chose, for that packet's scope, to keep command names, paths and frontmatter keys literal: "Command names, paths and frontmatter keys stay literal." A repository-wide search for the literal string `scripts/dist/memory` across non-`specs/`, non-`node_modules`, non-`dist`, non-`z_archive` files finds 87 live matches, spanning CLAUDE.md (3 named path citations at lines 308, 316, 475), the skill's own README/ARCHITECTURE/SKILL.md, every `speckit`/`deep`/`create` command asset that documents the save workflow, agent mirrors (`.claude/agents/ai-council.md`, `.claude/agents/orchestrate.md`, `.pi/agents/ai-council.md`, `.pi/agents/orchestrate.md`), and the hook fallback path above. No prior packet has revisited D7's literal-naming choice against this now-larger surface.

### Purpose
The operator has, in one place, the full blast-radius comparison between staying literal (documenting that "memory" means continuity going forward) and renaming to a continuity-family name with a compatibility window - and records the choice in a `decision-record.md` before any file is touched.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Option A - keep literal.** Document, in the skill's own README/ARCHITECTURE and in `references/memory/memory-system.md`, that "memory" in a command, path, or package-description name means continuity/retrieval, not the retired database - extending D7's precedent rather than reopening it. No file moves, no path changes, no compatibility window needed.
- **Option B - rename to a continuity family.** Rename `/memory:save` → a continuity-named command, `/memory:search` → likewise, `scripts/memory/` → `scripts/continuity/` (or similar), update every one of the 87 live references (CLAUDE.md, hooks, doctor routes, agent mirrors, command assets, the scripts package description), and run a compatibility window (old command names alias to new ones, logged as deprecated) before removing the aliases in a follow-on packet.
- For each option, produce the blast-radius evidence: exact file count and grouping by consumer class (CLAUDE.md, hooks, doctor, agent mirrors, command assets, package metadata), and the operator-facing cost (Option A: a documentation pass; Option B: a rename on the scale of packet 053's `mcp-server` → `runtime` move, since `scripts/dist/memory/generate-context.js` is a hard-coded fallback path inside a hook that runs on every Claude session stop).
- Require the operator's decision to be recorded in a `decision-record.md` in this folder before any rename work is scheduled - this is the acceptance criterion, not a suggestion.

### Out of Scope
- Executing either option's file changes - this phase produces the decision record, not the rename or the documentation pass.
- Revisiting D7 itself as a completed decision for packet 052's scope - this phase asks whether it still holds for the larger 87-file surface today, not whether it was wrong then.
- Any other retired-vocabulary naming question (e.g., `dist/memory` as a compatibility alias name, addressed narrowly in the LUNA-046 finding) beyond the command-family question this phase is scoped to.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `decision-record.md` (this folder) | Create | The operator's recorded choice between Option A and Option B, written when the decision is made |
| (Option B only, future work) `.opencode/commands/memory/**`, `scripts/memory/**`, `scripts/package.json`, `CLAUDE.md`, hook adapters, doctor routes, agent mirrors | Modify | Not touched in this phase; listed here only because the decision this phase produces determines whether a follow-on packet must touch them |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Both options are documented in `spec.md` with an exact, grep-counted blast radius grouped by consumer class |
| REQ-002 | The operator records the chosen option in `decision-record.md` in this folder before any rename work is scheduled in a follow-on packet |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | If Option A is chosen, the documentation pass (README/ARCHITECTURE/`memory-system.md` clarifying that "memory" means continuity) is itself scoped as a follow-on task, not silently skipped |
| REQ-004 | If Option B is chosen, the follow-on rename packet's scope explicitly includes `runtime/hooks/claude/session-stop.ts:73-76`'s hard-coded path candidates, since a missed hook path would silently break auto-save on session stop |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `decision-record.md` exists in this folder and names one of the two options, with the operator's reasoning.
- **SC-002**: The blast-radius counts in `spec.md` are reproducible: `rg -l "scripts/dist/memory" --glob '*.md' --glob '*.json' --glob '*.ts' --glob '*.sh' --glob '*.cjs' --glob '*.mjs' --glob '*.yaml' . | grep -v node_modules | grep -v '/dist/' | grep -v '^specs/' | grep -v z_archive | wc -l` returns 87 (or the actual count at the time the decision is made, if the surface has changed).
- **SC-003**: No file outside this folder's own four documents and `decision-record.md` is modified during this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Option B's rename could be started informally (a few files at a time) without ever producing the `decision-record.md` this phase requires | High | REQ-002 makes the record a hard precondition; the parent packet's `Phase Documentation Map` should not mark this phase `active`/`complete` until the record exists |
| Risk | The 87-file count drifts between when this spec is written and when the decision is made, since other phases in this packet (especially Phase 5's hook changes) touch adjacent files | Low | SC-002 makes the count reproducible on demand rather than treating 87 as a frozen constant |
| Dependency | Packet 052's D7 decision record (`specs/system-speckit/052-memory-decommission-landing/goal.md`) as the precedent this phase either extends or reopens | Low | Already read and cited directly in Problem Statement |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Not applicable - this phase produces documents only.
- **NFR-P02**: Not applicable.

### Security
- **NFR-S01**: Not applicable - no code or credential surface.
- **NFR-S02**: Not applicable.

### Reliability
- **NFR-R01**: Not applicable to this decision-only phase; Option B's follow-on rename packet inherits packet 053's reliability requirements (atomic commit, full gate set, review pass).
- **NFR-R02**: Not applicable.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: not applicable.
- Maximum length: not applicable.
- Invalid format: a `decision-record.md` that does not clearly name one of the two options is treated as no decision recorded - AC-002 stays Unmet until it does.

### Error Scenarios
- External service failure: not applicable.
- Network timeout: not applicable.
- Concurrent access: not applicable - a single operator decision, not a concurrent process.

### State Transitions
- Partial completion: this phase either has a decision record or it does not; there is no partial state to track beyond the requirements above.
- Session expiry: not applicable.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 5/25 | One decision document; the blast-radius evidence is already gathered in this spec |
| Risk | 4/25 | No code touched in this phase; the risk is entirely about the decision being skipped, mitigated by REQ-002's hard precondition |
| Research | 2/20 | The 87-file count and every named consumer were confirmed by direct `rg` runs before this spec was written |
| **Total** | **11/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Keep literal (Option A) or rename with a compatibility window (Option B)? This is the operator decision this phase exists to capture, not to pre-answer; the blast-radius evidence above is provided so the choice is informed.
<!-- /ANCHOR:questions -->

---



<!-- SCAFFOLD_VALIDATION_COUNTS:
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
