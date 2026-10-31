---
title: "Feature Specification: Phase 51: Save writer continuity fields"
description: "The continuity writer behind /speckit:save ignores every continuity field it is given and stamps the completion fingerprint after refreshing the graph, so a save leaves resume state stale and can fail its own strict validation."
trigger_phrases:
  - "save writer continuity fields"
  - "generate-context continuity write"
  - "speckit save recent_action"
  - "continuity fingerprint stamp order"
  - "phase parent save routing"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 51: Save writer continuity fields

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-23 |
| **Branch** | `worktrees/064-save-writer-continuity-fields` |
| **Parent Spec** | ../spec.md |
| **Phase** | 51 of 53 |
| **Predecessor** | 050-ci-cleanup-pi-proof |
| **Successor** | 052-core-template-canonical-markers |
| **Handoff Criteria** | A full-auto save writes the continuity fields it carries into the right leaf packet, whether it targets that leaf or a phase parent above it, every ancestor's pointer leads back to that leaf, and a strict validation run straight after the save passes with no repair step. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 51** of the system-spec-kit v4 specification. It is independent of phases 052 and 053, which handle template placeholders.

**Scope Boundary**: the continuity writer (`generate-context.js`), its input normalizer, the save's write order, its phase-parent pointer routing and the two save documents. The pre-compaction snapshot hook and the continuity-freshness rule stay as they are.

**Dependencies**:
- `upsertThinContinuityInMarkdown` in `runtime/lib/continuity/thin-continuity-record.ts`, which already validates and writes a continuity block.
- `followPhaseParentRedirect` in `runtime/lib/resume/resume-ladder.ts`, which already walks a pointer chain up to five levels deep for `/speckit:resume`.
- The deleted MCP handler `mcp-server/handlers/memory-save.ts` at `3095cadc0f9^`, as the record of how the removed write mapped a save onto the block.

**Deliverables**:
- The writer accepts the continuity fields and writes them under the canonical-save lock, in `--full-auto` mode only.
- A save aimed at a phase parent writes into the leaf child that holds the active work, and a leaf save updates every ancestor's pointer.
- The fingerprint stamp and every continuity write happen before the graph refresh.
- `save.md`, `save-workflow.md` and the writer's `--help` describe the fields and the parent routing.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The continuity writer behind `/speckit:save` ignores every continuity field it is given and stamps the completion fingerprint after refreshing the graph, so a save leaves resume state stale and can fail its own strict validation. The write lived in the MCP handler `memory-save.ts`, which commit `3095cadc0f9` deleted on 2026-09-03 with the memory engine, and nothing in the command-line writer took it over. `save.md:61` and `save-workflow.md:255` still say the writer owns the continuity block, and all 1,052 summaries updated since that date were edited by hand. Phase parents fare worse: `updatePhaseParentPointersAfterSave` (`generate-context.ts:493`) clears the parent's `last_active_child_id` on a parent save and updates only the direct parent on a child save, although `/speckit:resume` follows that pointer up to five levels down.

### Purpose
One full-auto save writes the continuity block into the packet that holds the work, keeps every ancestor's pointer leading to it and leaves the generated metadata fresh, so `/speckit:resume` from any level reads what the last save recorded.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Accept `recent_action`, `next_safe_action`, `blockers`, `key_files`, `completion_pct`, `open_questions` and `answered_questions` in the save payload, and write them with `last_updated_at` and `last_updated_by` through `upsertThinContinuityInMarkdown`, in `--full-auto` mode only.
- Route a save aimed at a phase parent to the leaf child holding the active work, and update every ancestor phase parent's pointer on each leaf save.
- Order the save's writes so every change to a source doc, the fingerprint stamp included, lands before the graph refresh.
- Describe the fields and the parent routing in `save.md`, `save-workflow.md` and the writer's `--help` output.

### Out of Scope
- The pre-compaction authored snapshot (`compact-inject.ts`) - it stays opt-in behind `SPECKIT_AUTHORED_CONTINUITY_SNAPSHOT`.
- The `CONTINUITY_FRESHNESS` rule - turning it on is a separate policy decision.
- Rewriting the 1,052 hand-edited continuity blocks - most fail the strict validator (57 of 60 sampled), so `/speckit:resume` skips them today, and the next save through the fixed writer rewrites each block it touches into a valid one.
- The writer's default plan-only mode still refreshes `graph-metadata.json`, although the save command describes its default as non-mutating. That is a separate finding, recorded here and left for its own phase.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/utils/input-normalizer.ts` | Modify | Add the continuity fields to the accepted input set |
| `.skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts` | Modify | Write the continuity block and stamp the fingerprint before the graph refresh |
| `.skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts` | Modify | Parent-aware target resolution, the ancestor pointer walk, and the fields in `--help` |
| `.skilled/skills/system-spec-kit/runtime/cli/core/memory-metadata.ts` | Modify | Let the stamp run inside the workflow's ordered write sequence |
| `.skilled/skills/system-spec-kit/runtime/lib/resume/resume-ladder.ts` | Modify | Share the pointer-chain walk with the writer instead of duplicating it |
| `.skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts` | Modify | Rewrite only the `_memory` block on upsert, so the frontmatter around it and the body stay byte-identical |
| `.skilled/skills/system-spec-kit/runtime/api/index.ts` | Modify | Expose the pointer hop and the continuity reader and upsert to the command-line writer |
| `.skilled/skills/system-spec-kit/runtime/cli/types/session-types.ts` | Modify | Carry the normalized continuity fields through the collected save data |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/save-continuity-write.vitest.ts` | Create | End-to-end save tests for the continuity write, the nested parent routing and the post-save fingerprint |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/` (`input-normalizer-unit`, `phase-parent-pointer`, `generate-context-cli-authority`) | Modify | Field acceptance cases, the parent-save pointer case that now expects no change, and the stamp case moved into the save tests |
| `.skilled/skills/system-spec-kit/runtime/tests/thin-continuity-record.vitest.ts` | Modify | A byte-for-byte check on the frontmatter outside the `_memory` block |
| `.skilled/skills/system-spec-kit/runtime/cli/evals/import-policy-allowlist.json` | Modify | Let the save test call the resume ladder's full pointer walk, which has no public api surface |
| `.skilled/commands/speckit/save.md` | Modify | Name the accepted fields and the parent routing |
| `.skilled/skills/system-spec-kit/references/memory/save-workflow.md` | Modify | Add the fields to the JSON field table and rewrite Phase Parent Save Routing |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A full-auto save whose payload carries continuity fields writes them into the target leaf's `implementation-summary.md` continuity block, with `last_updated_at` and `last_updated_by` set by the writer. A field the payload does not carry keeps its existing value when that value validates, and an invalid one is dropped and named in the output. | A save test on a fixture packet reads the fields back from the block, keeps a valid field the payload left out, drops and names an invalid one, and prints no "Unknown field" warning for the seven fields. |
| REQ-002 | A continuity value the thin-record validator rejects fails the save and writes nothing. The limits are 96 characters and 16 tokens per action field, a `next_safe_action` that opens with an imperative or status verb, and a 2,048-byte block. | A save test with an over-length `recent_action` exits non-zero and leaves the summary byte-identical. |
| REQ-003 | `validate.sh --strict` passes straight after any save, with no repair step in between. | Edit a completed packet's summary, save, then run strict validation. It prints `RESULT: PASSED` with no `SOURCE_FINGERPRINT_MISMATCH`. |
| REQ-006 | A leaf save updates `last_active_child_id` on every ancestor phase parent, up to the resume ladder's five-level limit. | A save in a nested fixture (parent, child parent, leaf) leaves each ancestor pointing one level down toward the leaf, and `/speckit:resume` on the top parent lands on the leaf. |
| REQ-007 | A full-auto save aimed at a phase parent resolves the active leaf and writes the continuity there. At each level it first reads the payload paths (`filesModified` and `key_files`) that lie inside a child of that level, and descends into the child when they all land in one. With no such path at a level, it follows that level's pointer when the pointer names an existing child, the same check the resume ladder applies. | A save test at the top of the nested fixture writes the leaf's block in both cases: through payload paths even when a valid pointer names another child, and through the pointer chain when the payload carries no path inside the tree. |
| REQ-008 | When a parent save cannot resolve one leaf, it writes no continuity, leaves every pointer unchanged and names the candidate children in its output. | A save test with files spread across two children exits cleanly, lists both children, and leaves the pointers byte-identical. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | A payload with no continuity fields, or any payload in plan-only mode, writes no continuity, so existing callers keep working. | A save test without the fields, and one in plan-only mode, leave the continuity block unchanged apart from the fingerprint stamp. |
| REQ-005 | `save.md`, `save-workflow.md` and the writer's `--help` describe the seven fields, the `--full-auto` condition and the parent routing. | Each of the three names all seven fields, and `save-workflow.md`'s Phase Parent Save Routing section describes the resolution order. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `/speckit:resume` on a packet saved through the fixed writer reports the `recent_action` and `next_safe_action` that save carried.
- **SC-002**: `/speckit:resume` on any ancestor of the last-saved leaf lands on that leaf.
- **SC-003**: The 057-style sequence (edit, save, strict validate) passes on the first validation run.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `upsertThinContinuityInMarkdown` behavior | High if its validation rejects blocks that hand edits produced | Run it over a sample of current blocks before wiring it in, and record any it rejects |
| Risk | A stale pointer routes a parent save to the wrong child | Med | The runtime resume ladder, whose pointer step the writer shares, applies no time window, so an old pointer to an existing child always looks valid. The `/speckit:resume` command workflow does check a 24-hour window before it redirects, so the two can disagree on an old pointer. Payload paths inside the tree outrank the pointer, and the pointer decides only a level where the payload carries no such path |
| Dependency | Most existing continuity blocks fail the strict validator | High | A sample of 60 current blocks found 57 rejected, mostly `next_safe_action` and `answered_questions` (`scratch/upsert-sample.md`). A save keeps existing fields that validate, drops invalid ones it does not replace and names each dropped field |
| Risk | The resolved leaf has no `implementation-summary.md` because it is still planned | Med | Report the missing file and write nothing, the same as REQ-008 |
| Risk | The write lands outside the canonical-save lock | Med | Write inside the lock the writer already holds, with the same atomic same-directory rename |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None open. Answered by the operator on 2026-09-23:

- A phase-parent save routes smartly through the parent and its nested children instead of skipping (REQ-006 to REQ-008).
- Continuity is written only under `--full-auto`. Plan-only mode writes none (REQ-004).
- A field the payload does not carry keeps its existing value when that value validates. An invalid one is dropped and named in the save output, and the save fails only when `recent_action` or `next_safe_action` is invalid and the payload does not replace it (REQ-001).
- Parent routing reads payload paths inside the tree before the pointer at every level (REQ-007).
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The ancestor pointer walk reads and writes at most five `graph-metadata.json` files per save, the resume ladder's own depth limit.
- **NFR-P02**: A save with no continuity fields does no continuity work beyond today's fingerprint stamp.

### Security
- **NFR-S01**: Every pointer hop is checked for existence and child shape before it is followed or written, so a malformed pointer cannot route a write outside the packet tree.
- **NFR-S02**: The write stays packet-local apart from the documented ancestor pointer updates.

### Reliability
- **NFR-R01**: Every write in the save, continuity and pointers included, uses the existing atomic same-directory rename, so a crashed save leaves the previous files intact.
- **NFR-R02**: Two saves against the same packet still fail fast on the canonical-save lock instead of interleaving.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty payload fields: an empty string counts as absent, so the field is not written.
- An over-length or narrative action: rejected whole under REQ-002.
- `key_files` naming paths outside the packet: kept as written, since the field records files and is not a routing input unless the target is a parent.

### Error Scenarios
- Unreadable `graph-metadata.json` on an ancestor: that ancestor's pointer is skipped with a warning, and the rest of the save completes.
- A pointer naming a child that no longer exists: treated as stale, the same as the resume ladder does.
- Concurrent saves: the second fails fast on the lock.

### State Transitions
- A leaf moves from planned to in progress: its first full-auto save needs an `implementation-summary.md`, so the save reports its absence instead of creating one.
- Nesting deeper than five levels: the walk stops at the limit and says so.
- The walk reaches a specs root: it stops below the root, so a save never rewrites `specs/graph-metadata.json`. Track folders such as `specs/system-speckit/` still count as ancestors, as they do today.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 13/25 | One writer, its normalizer and workflow, the shared pointer walk, tests and two docs |
| Risk | 12/25 | The save path is shared by every packet, and parent routing decides where writes land |
| Research | 6/20 | The mechanisms exist, the removed handler shows the old mapping, and the resume ladder shows the walk |
| **Total** | **31/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
